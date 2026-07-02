/* Central state management for the ODE Roadmap.
   All persistence flows through localStorage so progress survives across
   sessions. When a Google Identity Services credential is active, the same
   progress additionally synchronizes to the serverless /api/sync endpoint:
   cloud progress is defensively merged into localStorage on boot, and every
   progress mutation dispatches a silent, debounced background POST. Cloud
   calls are strictly best-effort: offline, file://, signed-out, or failing
   sessions leave the localStorage loop untouched. */

const ODEState = (function () {
    const KEYS = {
        watchedVideos: "ode_watched_videos",
        passedCheckpoints: "ode_passed_checkpoints",
        quizProgress: "ode_quiz_progress",
        learningMode: "ode_learning_mode",
        theme: "ode_theme_preference"
    };

    /* Cloud sync constants. The endpoint is root-absolute because the SPA is
       mounted at /ode/ while the API lives at the domain root; the httpContext
       guard keeps this from ever firing under file://. */
    const SYNC_ENDPOINT = "/api/sync";
    const SYNC_DEBOUNCE_MS = 2500;
    const CREDENTIAL_KEY = "ode_google_credential";

    let syncTimer = null;
    let syncActive = false;

    function readJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (err) {
            console.warn("State read failed for " + key + ":", err);
            return fallback;
        }
    }

    function writeJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    /* ---- Cloud sync internals ------------------------------------------ */

    function httpContext() {
        return window.location.protocol === "http:" ||
            window.location.protocol === "https:";
    }

    function decodeCredentialPayload(credential) {
        try {
            const part = credential.split(".")[1]
                .replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(atob(part));
        } catch (err) {
            return null;
        }
    }

    function getStoredCredential() {
        try {
            const credential = sessionStorage.getItem(CREDENTIAL_KEY);
            if (!credential) return null;
            const payload = decodeCredentialPayload(credential);
            if (!payload || !payload.exp || payload.exp * 1000 < Date.now() + 15000) {
                sessionStorage.removeItem(CREDENTIAL_KEY);
                return null;
            }
            return credential;
        } catch (err) {
            return null;
        }
    }

    function snapshotProgress() {
        const snapshot = {};
        snapshot[KEYS.watchedVideos] = readJSON(KEYS.watchedVideos, []);
        snapshot[KEYS.passedCheckpoints] = readJSON(KEYS.passedCheckpoints, {});
        snapshot[KEYS.quizProgress] = readJSON(KEYS.quizProgress, {});
        const mode = localStorage.getItem(KEYS.learningMode);
        if (mode) snapshot[KEYS.learningMode] = mode;
        const theme = localStorage.getItem(KEYS.theme);
        if (theme) snapshot[KEYS.theme] = theme;
        return snapshot;
    }

    function unionLists(local, cloud) {
        const merged = Array.isArray(local) ? local.slice() : [];
        (Array.isArray(cloud) ? cloud : []).forEach(function (id) {
            if (typeof id === "string" && merged.indexOf(id) === -1) merged.push(id);
        });
        return merged;
    }

    /* Defensive merge: progress is additive (union), so a stale device can
       never erase work done elsewhere. Local detail wins on key conflicts. */
    function mergeCloudIntoLocal(cloud) {
        if (!cloud || typeof cloud !== "object") return false;
        let changed = false;

        const localWatched = readJSON(KEYS.watchedVideos, []);
        const mergedWatched = unionLists(localWatched, cloud[KEYS.watchedVideos]);
        if (mergedWatched.length !== localWatched.length) {
            writeJSON(KEYS.watchedVideos, mergedWatched);
            changed = true;
        }

        const localPassed = readJSON(KEYS.passedCheckpoints, {});
        const cloudPassed = cloud[KEYS.passedCheckpoints];
        if (cloudPassed && typeof cloudPassed === "object") {
            Object.keys(cloudPassed).forEach(function (id) {
                if (!Object.prototype.hasOwnProperty.call(localPassed, id)) {
                    localPassed[id] = cloudPassed[id];
                    changed = true;
                }
            });
            if (changed) writeJSON(KEYS.passedCheckpoints, localPassed);
        }

        const localQuiz = readJSON(KEYS.quizProgress, {});
        const cloudQuiz = cloud[KEYS.quizProgress];
        if (cloudQuiz && typeof cloudQuiz === "object") {
            let quizChanged = false;
            Object.keys(cloudQuiz).forEach(function (quizId) {
                const merged = unionLists(localQuiz[quizId], cloudQuiz[quizId]);
                if (merged.length !== (localQuiz[quizId] || []).length) {
                    localQuiz[quizId] = merged;
                    quizChanged = true;
                }
            });
            if (quizChanged) {
                writeJSON(KEYS.quizProgress, localQuiz);
                changed = true;
            }
        }
        return changed;
    }

    function pushToCloud() {
        const credential = getStoredCredential();
        if (!credential || !httpContext()) return;
        fetch(SYNC_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + credential,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ progress: snapshotProgress() })
        }).then(function (res) {
            if (!res.ok) console.debug("Cloud sync push declined:", res.status);
        }).catch(function (err) {
            console.debug("Cloud sync push skipped:", err);
        });
    }

    function scheduleCloudPush() {
        if (!syncActive) return;
        if (syncTimer) clearTimeout(syncTimer);
        syncTimer = setTimeout(pushToCloud, SYNC_DEBOUNCE_MS);
    }

    function initCloudSync() {
        const credential = getStoredCredential();
        if (!credential || !httpContext()) return;
        fetch(SYNC_ENDPOINT, {
            headers: { "Authorization": "Bearer " + credential }
        }).then(function (res) {
            if (!res.ok) throw new Error("status " + res.status);
            return res.json();
        }).then(function (body) {
            const changed = mergeCloudIntoLocal(body && body.progress);
            if (changed && typeof renderCurriculum === "function") {
                renderCurriculum();
            }
            scheduleCloudPush();
        }).catch(function (err) {
            console.debug("Cloud sync init skipped:", err);
        });
    }

    /* ---- Auth UI wiring -------------------------------------------------- */

    function setAuthUI(signedIn, email) {
        const signinSlot = document.getElementById("auth-signin-slot");
        const status = document.getElementById("auth-status");
        const label = document.getElementById("auth-status-label");
        if (signinSlot) signinSlot.hidden = signedIn;
        if (status) status.hidden = !signedIn;
        if (label) label.textContent = email ? "Syncing as " + email : "Sync active";
    }

    function activateCloudSession() {
        const credential = getStoredCredential();
        if (!credential) return;
        syncActive = true;
        const payload = decodeCredentialPayload(credential) || {};
        setAuthUI(true, payload.email || null);
        initCloudSync();
    }

    function deactivateCloudSession() {
        syncActive = false;
        if (syncTimer) clearTimeout(syncTimer);
        try {
            sessionStorage.removeItem(CREDENTIAL_KEY);
        } catch (err) { /* storage unavailable */ }
        if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
        setAuthUI(false, null);
    }

    /* Global callback invoked by the Google Identity Services SDK
       (data-callback on the #g_id_onload element). */
    window.odeHandleGoogleCredential = function (response) {
        if (!response || !response.credential) return;
        try {
            sessionStorage.setItem(CREDENTIAL_KEY, response.credential);
        } catch (err) {
            console.debug("Credential storage unavailable:", err);
            return;
        }
        activateCloudSession();
    };

    /* Scripts load at the end of body, so the header exists already. */
    (function bootCloudSync() {
        const signout = document.getElementById("auth-signout");
        if (signout) signout.addEventListener("click", deactivateCloudSession);
        if (getStoredCredential()) activateCloudSession();
    })();

    return {
        KEYS: KEYS,

        getWatchedVideos: function () {
            return readJSON(KEYS.watchedVideos, []);
        },

        setVideoWatched: function (videoId, isWatched) {
            let watched = readJSON(KEYS.watchedVideos, []);
            if (isWatched && !watched.includes(videoId)) {
                watched.push(videoId);
            } else if (!isWatched) {
                watched = watched.filter(function (id) { return id !== videoId; });
            }
            writeJSON(KEYS.watchedVideos, watched);
            scheduleCloudPush();
            return watched;
        },

        getPassedCheckpoints: function () {
            return readJSON(KEYS.passedCheckpoints, {});
        },

        setCheckpointPassed: function (checkpointId, resultDetail) {
            const passed = readJSON(KEYS.passedCheckpoints, {});
            passed[checkpointId] = resultDetail || { passed: true };
            writeJSON(KEYS.passedCheckpoints, passed);
            scheduleCloudPush();
            return passed;
        },

        isCheckpointPassed: function (checkpointId) {
            const passed = readJSON(KEYS.passedCheckpoints, {});
            return Boolean(passed[checkpointId]);
        },

        // Quiz progress is stored as a map of quizId to a list of the question
        // ids that have been answered correctly. The running score for any
        // quiz is the length of its list.
        getQuizProgress: function (quizId) {
            const all = readJSON(KEYS.quizProgress, {});
            return all[quizId] || [];
        },

        setQuizAnswerCorrect: function (quizId, questionId) {
            const all = readJSON(KEYS.quizProgress, {});
            const list = all[quizId] || [];
            if (list.indexOf(questionId) === -1) list.push(questionId);
            all[quizId] = list;
            writeJSON(KEYS.quizProgress, all);
            scheduleCloudPush();
            return list;
        },

        // Clears the solved question ids for one quiz only, leaving every other
        // quiz's progress untouched. Used by the Retry Quiz action.
        clearQuizProgress: function (quizId) {
            const all = readJSON(KEYS.quizProgress, {});
            if (all.hasOwnProperty(quizId)) {
                delete all[quizId];
                writeJSON(KEYS.quizProgress, all);
                scheduleCloudPush();
            }
            return all;
        },

        getLearningMode: function () {
            // Exploration is the default per ARCHITECTURE.md Section 4.
            return localStorage.getItem(KEYS.learningMode) || "exploration";
        },

        setLearningMode: function (mode) {
            localStorage.setItem(KEYS.learningMode, mode);
            scheduleCloudPush();
        },

        resetAllProgress: function () {
            localStorage.removeItem(KEYS.watchedVideos);
            localStorage.removeItem(KEYS.passedCheckpoints);
            localStorage.removeItem(KEYS.quizProgress);
            scheduleCloudPush();
        },

        // Exposed so widgets or sandboxes that persist through their own
        // pathways can still request a background sync.
        requestCloudSync: function () {
            scheduleCloudPush();
        }
    };
})();
