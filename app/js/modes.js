/* Dual-mode progression logic per ARCHITECTURE.md Section 4.

   Exploration Mode (default): every module and checkpoint is open. Checkpoints
   act as optional self-assessments.

   Guided Pathway: sequential Gateways. A module unlocks only after the
   checkpoint of the previous module has been passed. */

const ODEModes = (function () {

    function getMode() {
        return ODEState.getLearningMode();
    }

    function setMode(mode) {
        if (mode !== "exploration" && mode !== "guided") return;
        ODEState.setLearningMode(mode);
        updateModeButtons(mode);
        if (typeof renderCurriculum === "function") {
            renderCurriculum();
        }
    }

    function isModuleUnlocked(flatModuleIndex) {
        if (getMode() === "exploration") return true;
        if (flatModuleIndex === 0) return true;

        // In Guided Pathway, every prior module checkpoint must be passed.
        // Progress is keyed by module title because checkpoint type ids are
        // reused across modules (the same widget type guards several gates).
        // ALL_MODULES is the flattened module sequence across all units.
        for (let i = 0; i < flatModuleIndex; i++) {
            if (!ODEState.isCheckpointPassed(ALL_MODULES[i].module)) {
                return false;
            }
        }
        return true;
    }

    function updateModeButtons(activeMode) {
        const explorationBtn = document.getElementById("mode-exploration");
        const guidedBtn = document.getElementById("mode-guided");
        if (!explorationBtn || !guidedBtn) return;

        explorationBtn.classList.toggle("active", activeMode === "exploration");
        guidedBtn.classList.toggle("active", activeMode === "guided");
    }

    function initModeControls() {
        const explorationBtn = document.getElementById("mode-exploration");
        const guidedBtn = document.getElementById("mode-guided");

        if (explorationBtn) {
            explorationBtn.addEventListener("click", function () { setMode("exploration"); });
        }
        if (guidedBtn) {
            guidedBtn.addEventListener("click", function () { setMode("guided"); });
        }
        updateModeButtons(getMode());
    }

    document.addEventListener("DOMContentLoaded", initModeControls);

    return {
        getMode: getMode,
        setMode: setMode,
        isModuleUnlocked: isModuleUnlocked
    };
})();
