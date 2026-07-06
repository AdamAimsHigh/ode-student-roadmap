/* Central state management for the ODE Roadmap.
   All persistence flows through localStorage so progress survives across
   sessions. When a Google Identity Services credential or a Worker-issued
   edge session is active, the same progress additionally synchronizes to
   the serverless /api/sync endpoint: cloud progress is defensively merged
   into localStorage on boot, and every progress mutation dispatches a
   silent, debounced background POST. Sign-in persistence is long-lived:
   the first Google verification is exchanged by the Worker for an opaque
   30-day session token cached in localStorage, so returning students stay
   signed in across browser restarts on both mobile and desktop. Sign-out
   is a two-phase teardown: a best-effort DELETE /api/sync revokes the edge
   session server-side, then local credentials are dumped unconditionally.
   Cloud calls are strictly best-effort: offline, file://, signed-out, or
   failing sessions leave the localStorage loop untouched. */

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
       guard keeps this from ever firing under file://. SYNC_SUBJECT names
       this app's curriculum track in the Worker's namespaced progress store
       ("progress:<subject>:<sub>") — a future Linear Algebra or Calculus SPA
       ships the same coordinator with its own subject constant and can never
       touch ode records. Existing pre-namespace progress is migrated
       server-side on first read; nothing changes in localStorage. */
    const SYNC_ENDPOINT = "/api/sync";
    const SYNC_SUBJECT = "ode";
    const SYNC_DEBOUNCE_MS = 2500;
    const CREDENTIAL_KEY = "ode_google_credential";
    const SESSION_KEY = "ode_cloud_session";

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

    /* The raw Google ID token, persisted in localStorage (namespaced ode_*
       key) so a still-fresh credential survives a browser restart. Google
       tokens only live about an hour; long-term persistence comes from the
       edge session below, with this credential as the exchange currency. */
    function getStoredCredential() {
        try {
            const credential = localStorage.getItem(CREDENTIAL_KEY);
            if (!credential) return null;
            const payload = decodeCredentialPayload(credential);
            if (!payload || !payload.exp || payload.exp * 1000 < Date.now() + 15000) {
                localStorage.removeItem(CREDENTIAL_KEY);
                return null;
            }
            return credential;
        } catch (err) {
            return null;
        }
    }

    /* The long-lived edge session issued by the Worker after a verified
       Google sign-in: { token, expiresAt, email }. The Worker keeps the
       matching hashed record in KV with a 30-day TTL and is the sole
       authority on validity; the local expiresAt is only a hint that lets
       the client skip a doomed request. */
    function getStoredSession() {
        const session = readJSON(SESSION_KEY, null);
        if (!session || typeof session.token !== "string") return null;
        if (session.expiresAt &&
            Date.parse(session.expiresAt) < Date.now() + 60000) {
            clearStoredSession();
            return null;
        }
        return session;
    }

    function clearStoredSession() {
        try {
            localStorage.removeItem(SESSION_KEY);
        } catch (err) { /* storage unavailable */ }
    }

    /* Whenever the Worker verifies a full Google credential it returns a
       freshly minted session alongside the sync payload; adopt it so the
       next thirty days of requests skip the Google token entirely. */
    function adoptSessionFromResponse(body) {
        if (!body || !body.session || typeof body.session.token !== "string") {
            return;
        }
        const credential = getStoredCredential();
        const payload = credential
            ? decodeCredentialPayload(credential) || {}
            : {};
        const previous = readJSON(SESSION_KEY, null) || {};
        try {
            writeJSON(SESSION_KEY, {
                token: body.session.token,
                expiresAt: body.session.expiresAt || null,
                email: payload.email || previous.email || null
            });
        } catch (err) { /* storage unavailable */ }
    }

    /* Prefer the long-lived edge session; fall back to a fresh Google ID
       token, which the Worker exchanges for a new session. */
    function pickAuthToken() {
        const session = getStoredSession();
        if (session) return { token: session.token, kind: "session" };
        const credential = getStoredCredential();
        if (credential) return { token: credential, kind: "google" };
        return null;
    }

    /* Shared authenticated fetch. If a session token bounces with a 401
       (expired, evicted, or revoked at the edge), it is dropped and the
       request retries once with the Google credential when one is still
       valid; otherwise the auth UI quietly resets and GIS auto-select
       re-establishes the account on the next load. */
    function syncFetch(options) {
        const auth = pickAuthToken();
        if (!auth) {
            if (syncActive) {
                syncActive = false;
                setAuthUI(false, null);
                /* The session evaporated mid-flight (expired or revoked), so
                   the visitor is anonymous again: restore sign-in surfaces. */
                syncGoogleSurfaces();
            }
            return Promise.reject(new Error("signed out"));
        }
        if (!httpContext()) return Promise.reject(new Error("file context"));
        const init = {
            method: options.method,
            headers: { "Authorization": "Bearer " + auth.token }
        };
        if (options.body) {
            init.headers["Content-Type"] = "application/json";
            init.body = options.body;
        }
        return fetch(SYNC_ENDPOINT + "?subject=" + SYNC_SUBJECT, init).then(function (res) {
            if (res.status === 401 && auth.kind === "session" && !options.retried) {
                clearStoredSession();
                options.retried = true;
                return syncFetch(options);
            }
            return res;
        });
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
        syncFetch({
            method: "POST",
            body: JSON.stringify({ progress: snapshotProgress() })
        }).then(function (res) {
            if (!res.ok) {
                console.debug("Cloud sync push declined:", res.status);
                return null;
            }
            return res.json();
        }).then(function (body) {
            if (body) adoptSessionFromResponse(body);
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
        syncFetch({ method: "GET" }).then(function (res) {
            if (!res.ok) throw new Error("status " + res.status);
            return res.json();
        }).then(function (body) {
            adoptSessionFromResponse(body);
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

    /* GIS is initialized programmatically rather than through a declarative
       g_id_onload element: declarative init rendered the embedded button and
       fired the floating One Tap prompt unconditionally as soon as the async
       SDK loaded, re-showing sign-in chrome to students who already held a
       valid local session. This module is now the single authority over both
       Google surfaces. */
    const GIS_CLIENT_ID =
        "422031597298-sa519hc2p023v4koialdum75crip6890.apps.googleusercontent.com";

    let gisInitialized = false;
    let gisButtonRendered = false;

    function gisApi() {
        return (window.google && google.accounts && google.accounts.id) || null;
    }

    /* Completely anonymous means no edge session and no still-valid Google
       credential in localStorage; only then may sign-in chrome appear. */
    function isAnonymous() {
        return !getStoredSession() && !getStoredCredential();
    }

    function setAuthUI(signedIn, email) {
        const signinSlot = document.getElementById("auth-signin-slot");
        const status = document.getElementById("auth-status");
        const label = document.getElementById("auth-status-label");
        if (signinSlot) signinSlot.hidden = signedIn;
        if (status) status.hidden = !signedIn;
        if (label) label.textContent = email ? "Syncing as " + email : "Sync active";
    }

    /* Reconcile Google's sign-in surfaces with the current auth state:
       anonymous visitors get the embedded button (rendered once into the
       slot) and the One Tap prompt; authenticated students get neither.
       Guarded end to end so file:// and offline sessions no-op silently. */
    function syncGoogleSurfaces() {
        const api = gisApi();
        if (!api || !gisInitialized || !isAnonymous()) return;
        const slot = document.getElementById("auth-signin-slot");
        if (slot && !gisButtonRendered) {
            try {
                api.renderButton(slot, {
                    type: "standard",
                    shape: "pill",
                    theme: "outline",
                    text: "signin_with",
                    size: "medium"
                });
                gisButtonRendered = true;
            } catch (err) {
                console.debug("GIS button render skipped:", err);
            }
        }
        try {
            api.prompt();
        } catch (err) {
            console.debug("GIS One Tap prompt skipped:", err);
        }
    }

    function initGoogleIdentity() {
        const api = gisApi();
        if (!api || gisInitialized) return;
        try {
            api.initialize({
                client_id: GIS_CLIENT_ID,
                callback: window.odeHandleGoogleCredential,
                auto_select: true,
                itp_support: true,
                context: "signin"
            });
            gisInitialized = true;
        } catch (err) {
            console.debug("GIS init skipped:", err);
            return;
        }
        syncGoogleSurfaces();
    }

    /* Documented GIS hook, invoked by the SDK the moment it finishes loading.
       The gsi/client script is async, so it always lands after this module
       has executed; the boot call below covers the theoretical inverse. */
    window.onGoogleLibraryLoad = initGoogleIdentity;

    /* A session activates from either credential shape: the persistent edge
       session token (the common returning-student path) or a fresh Google
       ID token (first sign-in, or a re-auth after session expiry). */
    function activateCloudSession() {
        const session = getStoredSession();
        const credential = getStoredCredential();
        if (!session && !credential) return;
        syncActive = true;
        const payload = credential
            ? decodeCredentialPayload(credential) || {}
            : {};
        setAuthUI(true, payload.email || (session && session.email) || null);
        initCloudSync();
    }

    /* Server-side half of sign-out: revokes the edge session's hashed KV
       record via DELETE /api/sync so the token dies everywhere, not just in
       this browser's localStorage. Strictly fire-and-forget — the promise is
       never awaited and every failure path (offline, timeout, file://, 401
       on an already-dead token) is swallowed, so the local cache dump that
       follows can never be blocked and a student is never trapped signed-in.
       keepalive lets the request survive an immediate tab close. */
    function revokeCloudSession() {
        const session = getStoredSession();
        if (!session || !httpContext()) return;
        try {
            fetch(SYNC_ENDPOINT, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + session.token },
                keepalive: true
            }).catch(function (err) {
                console.debug("Edge session revocation skipped:", err);
            });
        } catch (err) {
            console.debug("Edge session revocation skipped:", err);
        }
    }

    function deactivateCloudSession() {
        /* Revoke server-side first, while the session token is still in
           localStorage to read; everything below proceeds unconditionally. */
        revokeCloudSession();
        syncActive = false;
        if (syncTimer) clearTimeout(syncTimer);
        try {
            localStorage.removeItem(CREDENTIAL_KEY);
        } catch (err) { /* storage unavailable */ }
        clearStoredSession();
        const api = gisApi();
        if (api) api.disableAutoSelect();
        setAuthUI(false, null);
        /* Restore both Google surfaces for the now-anonymous visitor: the
           embedded button is unhidden (and rendered if sign-in happened
           before it ever drew), and One Tap re-prompts. disableAutoSelect
           above guarantees the prompt is an account chooser, never a silent
           re-login of the account that just signed out. */
        syncGoogleSurfaces();
    }

    /* Global callback registered with google.accounts.id.initialize()
       (auto_select re-issues credentials silently for returning accounts). */
    window.odeHandleGoogleCredential = function (response) {
        if (!response || !response.credential) return;
        try {
            localStorage.setItem(CREDENTIAL_KEY, response.credential);
        } catch (err) {
            console.debug("Credential storage unavailable:", err);
            return;
        }
        activateCloudSession();
        /* Dismiss any One Tap prompt still floating from the anonymous
           state; the embedded button slot is hidden by setAuthUI above. */
        const api = gisApi();
        if (api && typeof api.cancel === "function") {
            try { api.cancel(); } catch (err) { /* prompt already closed */ }
        }
    };

    /* Scripts load at the end of body, so the header exists already. The
       boot read is defensive: any cached session or still-valid credential
       in localStorage initializes the cloud loop immediately, and corrupt
       or expired entries fall through to the signed-out state. */
    (function bootCloudSync() {
        const signout = document.getElementById("auth-signout");
        if (signout) signout.addEventListener("click", deactivateCloudSession);
        if (getStoredSession() || getStoredCredential()) activateCloudSession();
        /* Covers the edge where the GIS SDK finished loading before this
           module ran (onGoogleLibraryLoad would then never fire for us). */
        initGoogleIdentity();
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

        // resultDetail is a free-form object persisted verbatim under the
        // checkpoint id. Beyond { passed, attempts, checkpoint } it may carry a
        // `sliders` map of { sliderLabel: finalValue } committed once at pass
        // time (see checkpoint-core.js), so a passed checkpoint's stable slider
        // coordinates hydrate on the next app boot. The whole detail is
        // whitelisted and JSON size-capped by the /api/sync sanitizer.
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

        // Returns the persisted result-detail object for one checkpoint, or
        // null when it has never been passed. Used to rehydrate a passed
        // checkpoint's saved slider coordinates when its widget is rebuilt.
        getCheckpointDetail: function (checkpointId) {
            const passed = readJSON(KEYS.passedCheckpoints, {});
            const detail = passed[checkpointId];
            return (detail && typeof detail === "object") ? detail : null;
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
