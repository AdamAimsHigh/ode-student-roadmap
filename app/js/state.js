/* Central state management for the ODE Roadmap.
   All persistence flows through localStorage so progress survives across sessions. */

const ODEState = (function () {
    const KEYS = {
        watchedVideos: "ode_watched_videos",
        passedCheckpoints: "ode_passed_checkpoints",
        quizProgress: "ode_quiz_progress",
        learningMode: "ode_learning_mode",
        theme: "ode_theme_preference"
    };

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
            return watched;
        },

        getPassedCheckpoints: function () {
            return readJSON(KEYS.passedCheckpoints, {});
        },

        setCheckpointPassed: function (checkpointId, resultDetail) {
            const passed = readJSON(KEYS.passedCheckpoints, {});
            passed[checkpointId] = resultDetail || { passed: true };
            writeJSON(KEYS.passedCheckpoints, passed);
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
            return list;
        },

        // Clears the solved question ids for one quiz only, leaving every other
        // quiz's progress untouched. Used by the Retry Quiz action.
        clearQuizProgress: function (quizId) {
            const all = readJSON(KEYS.quizProgress, {});
            if (all.hasOwnProperty(quizId)) {
                delete all[quizId];
                writeJSON(KEYS.quizProgress, all);
            }
            return all;
        },

        getLearningMode: function () {
            // Exploration is the default per ARCHITECTURE.md Section 4.
            return localStorage.getItem(KEYS.learningMode) || "exploration";
        },

        setLearningMode: function (mode) {
            localStorage.setItem(KEYS.learningMode, mode);
        },

        resetAllProgress: function () {
            localStorage.removeItem(KEYS.watchedVideos);
            localStorage.removeItem(KEYS.passedCheckpoints);
            localStorage.removeItem(KEYS.quizProgress);
        }
    };
})();
