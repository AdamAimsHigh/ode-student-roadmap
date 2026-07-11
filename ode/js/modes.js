/* Learning-mode progression logic per ARCHITECTURE.md Section 4.

   Exploration Mode (default): every module and checkpoint is open. Checkpoints
   act as optional self-assessments.

   Guided Pathway: sequential Gateways. A module unlocks only after the
   checkpoint of the previous module has been passed.

   Adaptive Pathway (Sprint Rec 3): the Guided gateway sequence plus
   programmatic remediation detours. Locking is identical to Guided; the
   difference lives in the unit detail view, which asks ODEAdaptive for a
   remediation panel whenever prerequisite skills are weak or fading. */

const ODEModes = (function () {

    const MODES = ["exploration", "guided", "adaptive"];

    function getMode() {
        return ODEState.getLearningMode();
    }

    function setMode(mode) {
        if (MODES.indexOf(mode) === -1) return;
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

    function modeLabel(mode) {
        if (mode === "guided") return "Guided Pathway";
        if (mode === "adaptive") return "Adaptive Pathway";
        return "Exploration Mode";
    }

    function updateModeButtons(activeMode) {
        MODES.forEach(function (mode) {
            const btn = document.getElementById("mode-" + mode);
            if (btn) btn.classList.toggle("active", mode === activeMode);
        });

        // Reflect the active mode on the dropdown trigger so the closed menu
        // always shows which mode is currently selected.
        const label = document.getElementById("mode-dropdown-label");
        if (label) {
            label.textContent = modeLabel(activeMode);
        }
    }

    function initModeControls() {
        MODES.forEach(function (mode) {
            const btn = document.getElementById("mode-" + mode);
            if (btn) {
                btn.addEventListener("click", function () { setMode(mode); });
            }
        });
        updateModeButtons(getMode());
    }

    document.addEventListener("DOMContentLoaded", initModeControls);

    return {
        MODES: MODES,
        getMode: getMode,
        setMode: setMode,
        modeLabel: modeLabel,
        isModuleUnlocked: isModuleUnlocked
    };
})();
