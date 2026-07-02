/* Checkpoint registry.

   Maps each interactive_checkpoint id from the curriculum data to a renderer.
   Each renderer receives (containerElement, moduleData) and is responsible for
   building its widget and calling ODEState.setCheckpointPassed on success.

   The curriculum defines 44 checkpoint types. Dedicated widget modules are
   registered into RENDERERS by id as they are built; any id without a
   dedicated renderer falls back to a labeled placeholder. */

const CheckpointRegistry = (function () {

    // Dedicated widget renderers register here, keyed by checkpoint id.
    const RENDERERS = {};

    // Module-specific overrides, keyed by exact module title. Used when a
    // checkpoint type id is shared by several modules but the content must
    // differ, for example application_scenario_sorter in 0.4 and 4.6.
    const MODULE_RENDERERS = {};

    // Acronyms and special words that must keep their casing in display titles.
    const TITLE_CASING = {
        rk4: "RK4",
        ivp: "IVP",
        bvp: "BVP",
        ode: "ODE",
        e: "e"
    };

    function titleFromId(checkpointId) {
        const words = checkpointId.split("_").map(function (word) {
            if (TITLE_CASING.hasOwnProperty(word)) return TITLE_CASING[word];
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return "Checkpoint: " + words.join(" ");
    }

    function renderPlaceholder(container, moduleData) {
        const heading = document.createElement("div");
        heading.className = "checkpoint-heading";
        heading.textContent = titleFromId(moduleData.interactive_checkpoint);

        const body = document.createElement("p");
        body.className = "checkpoint-placeholder";
        body.textContent = "This interactive checkpoint is under construction. It will ask you to reason from first principles, not recall steps.";

        container.appendChild(heading);
        container.appendChild(body);
    }

    function register(checkpointId, rendererFn) {
        RENDERERS[checkpointId] = rendererFn;
    }

    function registerForModule(moduleTitle, rendererFn) {
        MODULE_RENDERERS[moduleTitle] = rendererFn;
    }

    function render(checkpointId, container, moduleData) {
        const moduleRenderer = MODULE_RENDERERS[moduleData.module];
        if (moduleRenderer) {
            moduleRenderer(container, moduleData);
            return;
        }
        const renderer = RENDERERS[checkpointId];
        if (renderer) {
            renderer(container, moduleData);
        } else {
            renderPlaceholder(container, moduleData);
        }
    }

    return {
        register: register,
        registerForModule: registerForModule,
        render: render,
        titleFromId: titleFromId
    };
})();
