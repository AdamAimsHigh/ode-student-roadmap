/* Layout generator and view router. The application is a single page with
   two views: a Table of Contents that lists every unit, and a Unit Detail
   view that isolates one unit's modules, videos, and mastery quiz. The
   active view is chosen by the URL hash, so units are bookmarkable and the
   browser back button works. Gateway locking still runs at the module level
   when Guided Pathway mode is active, keyed by the global module sequence. */

/* Downloadable curriculum materials, keyed by unit array index (0 through 18).
   Every unit carries a primary cheat sheet "file" resolved under
   app/assets/pdfs/, and some units add an array of focused topic guides, each
   with its own display title and file. The files are scaffolded targets, the
   index lists them before the PDFs land. */
const AVAILABLE_MATERIALS = {
    0: { file: "Unit-0-Cheat-Sheet.pdf" },
    1: { file: "Unit-1-Cheat-Sheet.pdf" },
    2: { file: "Unit-2-Cheat-Sheet.pdf" },
    3: { file: "Unit-3-Cheat-Sheet.pdf" },
    4: { file: "Unit-4-Cheat-Sheet.pdf" },
    5: { file: "Unit-5-Cheat-Sheet.pdf" },
    6: { file: "Unit-6-Cheat-Sheet.pdf" },
    7: { file: "Unit-7-Cheat-Sheet.pdf" },
    8: { file: "Unit-8-Cheat-Sheet.pdf" },
    9: { file: "Unit-9-Cheat-Sheet.pdf", subtopics: [
        { title: "Abel's Identity", file: "Unit-9-Abels-Identity.pdf" },
        { title: "The Wronskian and Independence", file: "Unit-9-Wronskian.pdf" },
        { title: "Reduction of Order", file: "Unit-9-Reduction-of-Order.pdf" },
        { title: "The Cauchy-Euler Equation", file: "Unit-9-Cauchy-Euler.pdf" }
    ] },
    10: { file: "Unit-10-Cheat-Sheet.pdf", subtopics: [
        { title: "Exponential Response Formula", file: "Unit-10-Exponential-Response-Formula.pdf" },
        { title: "Variation of Parameters", file: "Unit-10-Variation-of-Parameters.pdf" },
        { title: "The Annihilator Method", file: "Unit-10-Annihilator-Method.pdf" },
        { title: "Undetermined Coefficients Guesses", file: "Unit-10-Undetermined-Coefficients.pdf" }
    ] },
    11: { file: "Unit-11-Cheat-Sheet.pdf", subtopics: [
        { title: "The Damping Discriminant", file: "Unit-11-Damping-Discriminant.pdf" },
        { title: "Forced Vibrations and Resonance", file: "Unit-11-Forced-Vibrations.pdf" }
    ] },
    12: { file: "Unit-12-Cheat-Sheet.pdf", subtopics: [
        { title: "Laplace Transform Table", file: "Unit-12-Laplace-Table.pdf" },
        { title: "Partial Fractions for Inverses", file: "Unit-12-Partial-Fractions.pdf" },
        { title: "Heaviside and Dirac Delta", file: "Unit-12-Heaviside-and-Delta.pdf" }
    ] },
    13: { file: "Unit-13-Cheat-Sheet.pdf", subtopics: [
        { title: "The Frobenius Method", file: "Unit-13-Frobenius-Method.pdf" },
        { title: "Legendre and Bessel Equations", file: "Unit-13-Legendre-and-Bessel.pdf" }
    ] },
    14: { file: "Unit-14-Cheat-Sheet.pdf", subtopics: [
        { title: "Eigenvalues and Eigenvectors", file: "Unit-14-Eigenvalues-and-Eigenvectors.pdf" },
        { title: "The Determinant and Change of Basis", file: "Unit-14-Determinant-and-Change-of-Basis.pdf" }
    ] },
    15: { file: "Unit-15-Cheat-Sheet.pdf", subtopics: [
        { title: "The Matrix Exponential", file: "Unit-15-Matrix-Exponential.pdf" },
        { title: "Fundamental Matrices", file: "Unit-15-Fundamental-Matrices.pdf" }
    ] },
    16: { file: "Unit-16-Cheat-Sheet.pdf", subtopics: [
        { title: "Phase Plane Classification", file: "Unit-16-Phase-Plane-Classification.pdf" },
        { title: "Linearization and the Jacobian", file: "Unit-16-Linearization.pdf" }
    ] },
    17: { file: "Unit-17-Cheat-Sheet.pdf", subtopics: [
        { title: "Sturm-Liouville Theory", file: "Unit-17-Sturm-Liouville.pdf" },
        { title: "Orthogonal Functions", file: "Unit-17-Orthogonal-Functions.pdf" }
    ] },
    18: { file: "Unit-18-Cheat-Sheet.pdf", subtopics: [
        { title: "Computing Fourier Series", file: "Unit-18-Computing-Fourier-Series.pdf" },
        { title: "The Heat and Wave Equations", file: "Unit-18-Heat-and-Wave-Equations.pdf" }
    ] }
};

/* Reads the URL hash and returns a valid unit index, or null for the Table
   of Contents. The hash form is "#unit-N" where N is the unit array index. */
function unitIndexFromHash() {
    const match = /^#unit-(\d+)$/.exec(window.location.hash);
    if (!match) return null;
    const index = parseInt(match[1], 10);
    return (index >= 0 && index < CURRICULUM.length) ? index : null;
}

/* The global flat index of a unit's first module. Locking compares against
   ALL_MODULES, a single sequence across every unit, so the detail view must
   start counting where the prior units left off. */
function unitFlatOffset(unitIndex) {
    let offset = 0;
    for (let i = 0; i < unitIndex; i++) {
        offset += CURRICULUM[i].modules.length;
    }
    return offset;
}

/* Counts watched videos within a single unit for its progress readout. */
function unitProgress(unitData, watched) {
    let total = 0;
    let count = 0;
    unitData.modules.forEach(function (moduleData) {
        moduleData.videos.forEach(function (video) {
            total++;
            if (watched.includes(video.video_id)) count++;
        });
    });
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { totalVideos: total, watchedCount: count, percentage: percentage };
}

/* The single render entry point. Every caller, the initial load, a mode
   toggle, and a checkpoint pass, routes through here, so re-rendering always
   redraws the view the hash currently selects. */
function renderCurriculum() {
    const container = document.getElementById("app-content");
    if (!container) return;

    // Static navigation routes from the global header dropdown take priority
    // over the unit views. Each maps a hash to a scaffolded page.
    const hash = window.location.hash;
    if (hash === "#practice-sets") {
        renderPracticeSets(container);
    } else if (/^#practice-sets-\d+$/.test(hash)) {
        const pi = parseInt(hash.slice("#practice-sets-".length), 10);
        if (pi >= 0 && pi < CURRICULUM.length) {
            renderPracticeSetDetail(container, pi);
        } else {
            renderPracticeSets(container);
        }
    } else if (hash === "#cheat-sheets") {
        renderCheatSheets(container);
    } else if (hash === "#quizzes-index") {
        renderQuizzesIndex(container);
    } else if (/^#quizzes-index-\d+$/.test(hash)) {
        const qi = parseInt(hash.slice("#quizzes-index-".length), 10);
        if (qi >= 0 && qi < CURRICULUM.length) {
            renderUnitQuizzesDetail(container, qi);
        } else {
            renderQuizzesIndex(container);
        }
    } else if (hash === "#interactives") {
        renderInteractives(container);
    } else if (hash.indexOf("#interactives-sandbox-") === 0) {
        // Deep-linked sandbox playground. The unique sandbox id rides in the
        // hash (e.g. "#interactives-sandbox-unit_0_equation_translator"), so a
        // refresh or a copied URL re-mounts the same live engine directly,
        // skipping the grid. An unknown id falls back to the dashboard.
        const routeId = hash.slice("#interactives-sandbox-".length);
        const target = findSandboxByRouteId(routeId);
        if (target) {
            mountVisualizer(container, target);
        } else {
            renderInteractives(container);
        }
    } else {
        const unitIndex = unitIndexFromHash();
        if (unitIndex === null) {
            renderTableOfContents(container);
        } else {
            renderUnitDetail(container, unitIndex);
        }
    }

    updateProgressBanner();
}

/* Builds the back button and the intro header shared by the materials index
   pages, appends them to the container, and returns nothing. The grid that
   follows is appended by each caller. Reuses the Table of Contents intro and
   heading classes so the materials pages match the main curriculum styling. */
function buildIndexShell(container, title, subhead) {
    container.innerHTML = "";

    const nav = document.createElement("div");
    nav.className = "unit-detail-nav";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-toc-btn";
    backBtn.textContent = "Back to Table of Contents";
    backBtn.addEventListener("click", function () {
        window.location.hash = "";
    });

    nav.appendChild(backBtn);
    container.appendChild(nav);

    const intro = document.createElement("div");
    intro.className = "toc-intro";

    const heading = document.createElement("h1");
    heading.className = "toc-heading";
    heading.textContent = title;

    const sub = document.createElement("p");
    sub.className = "toc-subhead";
    sub.textContent = subhead;

    intro.appendChild(heading);
    intro.appendChild(sub);
    container.appendChild(intro);
}

/* Strips the leading "N.M " module number from a module title so a derived topic
   guide reads cleanly, for example "1.2 The Number e" becomes "The Number e". */
function stripModuleNumber(moduleTitle) {
    return moduleTitle.replace(/^\d+\.\d+\s+/, "");
}

/* Returns the topic guide entries for a unit. Units with curated guides in
   AVAILABLE_MATERIALS keep them (each carries a PDF "file"); every other unit
   derives its list from its curriculum modules, so all 19 unit cards show a
   Topic guides sub-list. Derived entries carry no file and render as plain text. */
function getUnitSubtopics(unitIndex) {
    const materials = AVAILABLE_MATERIALS[unitIndex];
    if (materials && materials.subtopics && materials.subtopics.length) {
        return materials.subtopics;
    }
    const unitData = CURRICULUM[unitIndex];
    if (!unitData || !unitData.modules) return [];
    return unitData.modules.map(function (moduleData) {
        return { title: stripModuleNumber(moduleData.module) };
    });
}

/* Appends a "Topic guides" sub-list to a materials card. When asLinks is true and
   an entry has a PDF file (the curated guides), it renders as a PDF link that opens
   in a new tab; otherwise the entry renders as a plain text label. This keeps the
   Practice Sets and Interactives hubs free of PDF links while the Cheat Sheets hub
   still offers the downloadable topic guides. */
function appendSubtopics(card, unitIndex, asLinks) {
    const subtopics = getUnitSubtopics(unitIndex);
    if (!subtopics.length) return;

    const wrap = document.createElement("div");
    wrap.className = "materials-subtopics";

    const label = document.createElement("p");
    label.className = "materials-subtopics-label";
    label.textContent = "Topic guides";
    wrap.appendChild(label);

    const list = document.createElement("ul");
    list.className = "materials-subtopics-list";

    subtopics.forEach(function (sub) {
        const li = document.createElement("li");
        if (asLinks && sub.file) {
            const link = document.createElement("a");
            link.className = "pdf-download-link";
            link.href = "assets/pdfs/" + sub.file;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = sub.title;
            li.appendChild(link);
        } else {
            const text = document.createElement("span");
            text.className = "materials-subtopic-text";
            text.textContent = sub.title;
            li.appendChild(text);
        }
        list.appendChild(li);
    });

    wrap.appendChild(list);
    card.appendChild(wrap);
}

/* The Cheat Sheets route. A data driven Table of Contents that mirrors the main
   curriculum: one card per unit with a primary cheat sheet download, plus the
   focused topic guides for that unit (curated PDF guides where they exist, the
   curriculum modules otherwise). */
function renderCheatSheets(container) {
    buildIndexShell(container, "Cheat Sheets (PDFs)",
        "Open the reference materials for each unit, each in a new tab. Some units add focused topic guides.");

    const grid = document.createElement("div");
    grid.className = "toc-grid";

    CURRICULUM.forEach(function (unitData, index) {
        const card = document.createElement("div");
        card.className = "materials-card";

        const title = document.createElement("h3");
        title.className = "materials-card-title";
        title.textContent = unitData.unit;
        card.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "materials-card-desc";
        desc.textContent = unitData.description;
        card.appendChild(desc);

        const primary = document.createElement("a");
        primary.className = "pdf-download-btn";
        primary.href = "assets/pdfs/Unit-" + index + "-Cheat-Sheet.pdf";
        primary.target = "_blank";
        primary.rel = "noopener";
        primary.textContent = "Open Unit " + index + " Cheat Sheet";
        card.appendChild(primary);

        // Topic guides, as PDF links where a curated guide exists.
        appendSubtopics(card, index, true);

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/* The Practice Sets route, the top level of a two level directory. The same per
   unit card structure as Cheat Sheets, tailored for web based practice. Each
   primary action opens that unit's dedicated practice set sub-view, which holds
   the practice problems and a toggle for the solutions. */
function renderPracticeSets(container) {
    buildIndexShell(container, "Practice Sets",
        "Open the web based practice set for each unit. Each set holds the practice problems and a toggle for the solutions.");

    const grid = document.createElement("div");
    grid.className = "toc-grid";

    CURRICULUM.forEach(function (unitData, index) {
        const card = document.createElement("div");
        card.className = "materials-card";

        const title = document.createElement("h3");
        title.className = "materials-card-title";
        title.textContent = unitData.unit;
        card.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "materials-card-desc";
        desc.textContent = unitData.description;
        card.appendChild(desc);

        const open = document.createElement("a");
        open.className = "pdf-download-btn";
        open.href = "#practice-sets-" + index;
        open.textContent = "Open Unit " + index + " Practice Set";
        card.appendChild(open);

        // Topic guides as plain text labels, no PDF links in the Practice Sets hub.
        appendSubtopics(card, index, false);

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/* The curated catalog of standalone visualization engines, keyed by the
   interactive checkpoint id that implements each one. Titles and blurbs are
   dashboard copy; the target unit and module badge are NOT stored here, they are
   derived live from the curriculum (see findModuleByCheckpoint), so a badge can
   never drift from where its engine actually lives. Every id below maps to a
   real graphing or canvas widget registered in app/js/checkpoints/. */
const INTERACTIVE_VISUALIZERS = [
    {
        id: "euler_method_stepper",
        title: "Euler's Method Visualizer",
        blurb: "Step along the tangent line of y' = y and watch the systematic error build, the foundational numerical integrator."
    },
    {
        id: "desmos_interactive_slope_field",
        title: "Slope Field Generator",
        blurb: "Render the direction field of dy/dx = x - y on a live canvas, then thread a solution curve through it."
    },
    {
        id: "rk4_stage_builder",
        title: "Runge-Kutta (RK4) Stage Builder",
        blurb: "Assemble the four weighted slope samples of a single RK4 step and land within a whisker of e."
    },
    {
        id: "desmos_e_limit_explorer",
        title: "The Number e Limit Explorer",
        blurb: "Pan and zoom the Desmos graph of (1 + 1/x)^x to discover the constant the curve settles toward."
    },
    {
        id: "complex_rotation_visualizer",
        title: "Euler's Formula Rotation Visualizer",
        blurb: "Steer e^(i t) around the unit circle in the complex plane and witness Euler's identity as half a turn."
    },
    {
        id: "desmos_ivp_curve_selector",
        title: "IVP Curve Selector",
        blurb: "Pick the member of a solution family that satisfies a given initial condition, live on a Desmos graph."
    },
    {
        id: "desmos_cooling_curve_fitter",
        title: "Newton's Cooling Curve Fitter",
        blurb: "Fit an exponential cooling model to data and read the decay constant straight off the graph."
    }
];

/* Walks the curriculum to find the module that owns a given interactive
   checkpoint id, returning its unit index, unit title, and the module data the
   checkpoint renderer needs. Returns null when no module declares the checkpoint,
   so a renamed or retired engine simply drops out of the dashboard instead of
   rendering a broken card. */
function findModuleByCheckpoint(checkpointId) {
    for (let unitIndex = 0; unitIndex < CURRICULUM.length; unitIndex++) {
        const unitData = CURRICULUM[unitIndex];
        const modules = unitData.modules || [];
        for (let m = 0; m < modules.length; m++) {
            if (modules[m].interactive_checkpoint === checkpointId) {
                return { unitIndex: unitIndex, unitTitle: unitData.unit, moduleData: modules[m] };
            }
        }
    }
    return null;
}

/* The module number prefix, for example "5.1", pulled from a module title so the
   context badge can show it beside the unit. Falls back to the whole title when
   no leading number is present. */
function moduleNumber(moduleTitle) {
    const match = /^(\d+\.\d+)/.exec(moduleTitle);
    return match ? match[1] : moduleTitle;
}

/* A single sortable integer for a module title, so "5.1" orders before "5.4" and
   both order after "1.2". The major number is weighted well above any plausible
   minor count; titles with no leading number sort first. */
function moduleSortKey(moduleTitle) {
    const match = /^(\d+)\.(\d+)/.exec(moduleTitle);
    return match ? parseInt(match[1], 10) * 1000 + parseInt(match[2], 10) : 0;
}

/* Open-ended sandbox playgrounds for the units that do not yet ship a graded
   interactive checkpoint. Each entry is an ungraded exploration surface: when it
   mounts, it opens straight into free play with no answer checking (see
   mountVisualizer). Units 1, 2, 3, and 5 already carry graded visualizers
   in INTERACTIVE_VISUALIZERS, so this set fills every remaining unit, completing a
   0..18 map that is ready for content. The bodies are intentionally empty
   placeholders, the slot each unit's open-ended tool will drop into.

   Unit 0 is deliberately absent from this list: it ships the first cluster of
   fully built sandbox engines below (UNIT_0_SANDBOXES), so it is served three
   live tools instead of a single placeholder. */
const INTERACTIVE_SANDBOX_UNITS = [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const INTERACTIVE_SANDBOXES = INTERACTIVE_SANDBOX_UNITS.map(function (unitNumber) {
    return {
        unitNumber: unitNumber,
        title: "Unit " + unitNumber + " Exploration Sandbox",
        blurb: "An open-ended math playground for this unit, coming soon. Drag sliders, retype expressions, and explore the graph freely, with nothing to grade.",
        isSandbox: true
    };
});

/* Cluster I: the first three fully built, open-ended Unit 0 sandbox engines.
   Unlike the generic placeholders above, each entry carries a stable string id
   (used to key the mounted host element so the engine's own inner ids can never
   collide with another card's) and a render(body) function that builds its live,
   ungraded surface. Every engine namespaces its DOM ids and internal state under
   a strict u0_s1_ / u0_s2_ / u0_s3_ prefix, paints onto canvases whose colors are
   read live from the active theme's CSS custom properties (so Light and Dark both
   render natively), and issues zero network calls, so each runs unchanged under
   the file:// protocol. The render functions are declared lower in this file;
   function declarations hoist, so referencing them here is safe. */
const UNIT_0_SANDBOXES = [
    {
        id: "unit_0_equation_translator",
        unitNumber: 0,
        isSandbox: true,
        title: "The Dynamic Equation Translator",
        blurb: "Assemble component calculus symbols to construct formal rate constraints and drive real-time graphical particle physics simulations.",
        render: renderEquationTranslatorSandbox
    },
    {
        id: "unit_0_constant_explorer",
        unitNumber: 0,
        isSandbox: true,
        title: "The Arbitrary Constant Solution Curve Explorer",
        blurb: "Manipulate the integration constant C as an active spatial parameter to witness how an initial condition locks a singular trajectory out of an infinite family.",
        render: renderConstantExplorerSandbox
    },
    {
        id: "unit_0_variable_space_sandbox",
        unitNumber: 0,
        isSandbox: true,
        title: "The ODE vs. PDE Independent Variable Sandbox",
        blurb: "Contrast total derivatives along a 2D line against multi-dimensional surface gradients to visually grasp independent variable scaling.",
        render: renderVariableSpaceSandbox
    },
    {
        id: "unit_0_vector_grid_tracer",
        unitNumber: 0,
        isSandbox: true,
        title: "The Primitive Vector Grid Tracer",
        blurb: "Probe a blank coordinate field to sample localized derivative vectors and drop custom tracer particles to observe continuous trajectory paths.",
        render: renderVectorGridTracerSandbox
    },
    {
        id: "unit_0_state_space_topology",
        unitNumber: 0,
        isSandbox: true,
        title: "State Space Topology Mapper",
        blurb: "Manipulate the inner system coefficients of a first-order state machine to watch global parameter coordinates warp in real time.",
        render: renderStateSpaceTopologySandbox
    },
    {
        id: "unit_0_cooling_simulator",
        unitNumber: 0,
        isSandbox: true,
        title: "Newton’s Law of Cooling Simulator",
        blurb: "Adjust ambient temperatures and thermal insulation constants to trace how a physical system tracks toward terminal thermal equilibrium.",
        render: renderCoolingSimulatorSandbox
    },
    {
        id: "unit_0_decay_dial",
        unitNumber: 0,
        isSandbox: true,
        title: "Population & Radioactive Decay Half-Life Dial",
        blurb: "Flip structural parameters between unbounded growth and proportional decay to map uniform half-life geometric intervals.",
        render: renderDecayDialSandbox
    },
    {
        id: "unit_0_integro_differential_ledger",
        unitNumber: 0,
        isSandbox: true,
        title: "The Integro-Differential Ledger Sandbox",
        blurb: "Balance instantaneous fluid valve changes against total accumulated histories within a live dynamic rate ledger.",
        render: renderIntegroDifferentialLedgerSandbox
    },
    {
        id: "unit_0_spring_workbench",
        unitNumber: 0,
        isSandbox: true,
        title: "The Mechanical Spring Parameter Workbench",
        blurb: "Tune mass, damping coefficients, and stiffness restoration to observe how physical system parameters dictate harmonic wave geometry.",
        render: renderSpringWorkbenchSandbox
    }
];

/* Cluster II: the first three fully built Unit 1 sandbox engines. Same contract
   as UNIT_0_SANDBOXES - each carries a stable string id (keys the mounted host so
   inner ids never collide), a render(body) that builds a live ungraded surface,
   and a strict u1_s1_ / u1_s2_ / u1_s3_ DOM-and-state namespace. They read every
   colour live from the active theme's CSS custom properties (Light and Dark both
   render natively), issue zero network calls (file:// safe), and their animation
   loops self-terminate once their canvas leaves the DOM. Unit 1 already ships
   graded visualizers in INTERACTIVE_VISUALIZERS; these sit behind them in the
   catalog as the unit's open-ended exploration cluster. Render functions are
   declared lower in the file; function declarations hoist, so this is safe. */
const UNIT_1_SANDBOXES = [
    {
        id: "unit_1_e_limit_explorer",
        unitNumber: 1,
        isSandbox: true,
        title: "The Euler’s Number Limit Explorer",
        blurb: "Drive the limit definition of e dynamically to witness how compounding interest intervals converge onto an absolute mathematical horizon.",
        render: renderELimitExplorerSandbox
    },
    {
        id: "unit_1_complex_rotation_plane",
        unitNumber: 1,
        isSandbox: true,
        title: "Complex Rotation & Euler’s Identity Sandbox",
        blurb: "Manipulate imaginary exponents on a live geometric grid to visualize how e^iθ wraps real coordinates into continuous circular trajectories.",
        render: renderComplexRotationPlaneSandbox
    },
    {
        id: "unit_1_log_linear_warp",
        unitNumber: 1,
        isSandbox: true,
        title: "The Log-Linear Scaling Matrix",
        blurb: "Toggle coordinate space between Cartesian, semi-log, and log-log configurations to uncover the hidden linear architectures of transcendental behaviors.",
        render: renderLogLinearWarpSandbox
    }
];

/* Builds the normalized, sorted card model for the Interactives dashboard:
   graded engines and sandbox cards alike collapse into one shape so a single
   render loop (and the deep-link route resolver) can consume them. Graded
   engines resolve their unit and module from the curriculum (and drop out if the
   checkpoint is gone); sandbox cards carry their unit number directly and sort to
   the tail of their unit, behind any graded module. Returned in chronological
   order: Unit 0 before Unit 1 ..., ascending module number within a unit. */
function buildInteractiveItems() {
    const items = [];

    INTERACTIVE_VISUALIZERS.forEach(function (vis) {
        const home = findModuleByCheckpoint(vis.id);
        if (!home) return; // engine no longer in the curriculum, skip its card
        items.push({
            vis: vis,
            isSandbox: false,
            home: home,
            unitNumber: home.unitIndex,
            moduleLabel: moduleNumber(home.moduleData.module),
            sortKey: moduleSortKey(home.moduleData.module)
        });
    });

    INTERACTIVE_SANDBOXES.forEach(function (vis) {
        items.push({
            vis: vis,
            isSandbox: true,
            home: null,
            unitNumber: vis.unitNumber,
            moduleLabel: "Sandbox",
            sortKey: vis.unitNumber * 1000 + 999
        });
    });

    // Unit 0's fully built Cluster engines. They sort within Unit 0 in declared
    // order (900 + index), ahead of the generic placeholder tail (999), so the
    // catalog reads them as the leading sandbox cluster.
    UNIT_0_SANDBOXES.forEach(function (vis, idx) {
        items.push({
            vis: vis,
            isSandbox: true,
            home: null,
            unitNumber: vis.unitNumber,
            moduleLabel: "Sandbox",
            sortKey: vis.unitNumber * 1000 + 900 + idx
        });
    });

    // Unit 1's fully built Cluster II engines. Same 900 + index sandbox band as
    // Unit 0's cluster, so they sort within Unit 1 behind the graded modules and
    // ahead of any generic placeholder tail (999), reading as the unit's leading
    // open-ended cluster.
    UNIT_1_SANDBOXES.forEach(function (vis, idx) {
        items.push({
            vis: vis,
            isSandbox: true,
            home: null,
            unitNumber: vis.unitNumber,
            moduleLabel: "Sandbox",
            sortKey: vis.unitNumber * 1000 + 900 + idx
        });
    });

    items.sort(function (a, b) {
        if (a.unitNumber !== b.unitNumber) return a.unitNumber - b.unitNumber;
        return a.sortKey - b.sortKey;
    });

    return items;
}

/* The stable route token a sandbox card deep-links under. Built engines carry
   their own id (e.g. "unit_0_equation_translator"); generic placeholders have
   none, so they key off their unit number ("unit-4"). Mirrors the host-id
   fallback in mountVisualizer so the same item resolves both ways. */
function sandboxRouteId(item) {
    return item.vis.id ? item.vis.id : "unit-" + item.unitNumber;
}

/* Resolves a deep-link sandbox route token back to its normalized card item, or
   null when no sandbox matches (a stale or hand-typed id). */
function findSandboxByRouteId(routeId) {
    const items = buildInteractiveItems();
    for (let i = 0; i < items.length; i++) {
        if (items[i].isSandbox && sandboxRouteId(items[i]) === routeId) return items[i];
    }
    return null;
}

/* The Interactives route, now a unified visualizers dashboard. Instead of one
   card per unit duplicating the curriculum index, it gathers every standalone
   math visualization engine in the course into a single grid. Each card derives
   its context badge from the engine's home module. Graded engines mount in place
   on click; sandbox cards advance the hash to their deep-link route so the live
   playground survives a refresh or a shared URL (see renderCurriculum). */
function renderInteractives(container) {
    buildIndexShell(container, "Interactive Visualizers",
        "Every standalone math visualization engine in the course, gathered into one grid. Launch any tool to mount it right here in the workspace.");

    // The dashboard sits one level below the curriculum root, so its back action
    // reads "Back to Main Roadmap" rather than the shared shell default. The
    // button still targets the empty hash (the Table of Contents); only the label
    // changes, to keep the navigation hierarchy clean.
    const backBtn = container.querySelector(".back-to-toc-btn");
    if (backBtn) backBtn.textContent = "Back to Main Roadmap";

    const items = buildInteractiveItems();

    // Two-column split: a sticky unit-navigation sidebar on the left, and the
    // scrolling cohort of bounded unit sections on the right. The whole split is
    // one flex row appended into the app container (which already lays its
    // children out as a column), so it sits cleanly below the intro header.
    const layout = document.createElement("div");
    layout.className = "interactives-layout";

    const sidebar = document.createElement("nav");
    sidebar.className = "interactives-sidebar";
    sidebar.setAttribute("aria-label", "Unit navigation");

    const sidebarTitle = document.createElement("div");
    sidebarTitle.className = "interactives-sidebar-title";
    sidebarTitle.textContent = "Units";
    sidebar.appendChild(sidebarTitle);

    const content = document.createElement("div");
    content.className = "interactives-content";

    // Group the sorted items into bounded per-unit sections. The list is already
    // ordered by unitNumber, so each time the unit changes we open a fresh framed
    // section (a lavender header naming the unit boundary, then that unit's card
    // grid) and add a matching sidebar anchor. Cards keep the same
    // .interactives-grid layout, now nested deeper, so their column baselines stay
    // pixel-aligned within each section.
    let currentUnit = null;
    let currentGrid = null;

    items.forEach(function (item) {
        if (item.unitNumber !== currentUnit) {
            currentUnit = item.unitNumber;

            const section = document.createElement("div");
            section.className = "unit-section-container";
            // A stable scroll target id keyed by unit number, so a sidebar link
            // can jump straight to its section.
            section.id = "interactives-unit-" + item.unitNumber;

            const header = document.createElement("div");
            header.className = "unit-lavender-header";
            // Name the unit boundary from the curriculum itself so the header can
            // never drift from the unit it frames; fall back to the bare number.
            const unitData = CURRICULUM[item.unitNumber];
            header.textContent = unitData ? unitData.unit : ("Unit " + item.unitNumber);
            section.appendChild(header);

            currentGrid = document.createElement("div");
            currentGrid.className = "interactives-grid";
            section.appendChild(currentGrid);

            content.appendChild(section);

            // Matching sidebar anchor. A click smooth-scrolls its section to the
            // top of the viewport; no hash change, so deep-link routing is
            // untouched. The closure captures this iteration's section element.
            const link = document.createElement("button");
            link.type = "button";
            link.className = "interactives-sidebar-link";
            // Full descriptive unit title, pulled from the same curriculum entry
            // as the section header so the two can never drift; falls back to the
            // bare unit number if the curriculum lacks this index.
            link.textContent = unitData ? unitData.unit : ("Unit " + item.unitNumber);
            link.addEventListener("click", function () {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            sidebar.appendChild(link);
        }

        const card = document.createElement("div");
        card.className = "materials-card interactive-card";

        const badge = document.createElement("span");
        badge.className = "interactive-badge";
        badge.textContent = "Unit " + item.unitNumber + " · " + item.moduleLabel;
        card.appendChild(badge);

        const title = document.createElement("h3");
        title.className = "materials-card-title";
        title.textContent = item.vis.title;
        card.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "materials-card-desc";
        desc.textContent = item.vis.blurb;
        card.appendChild(desc);

        const launch = document.createElement("button");
        launch.type = "button";
        launch.className = "pdf-download-btn";
        launch.textContent = item.isSandbox ? "Open Sandbox" : "Launch Visualizer";
        launch.addEventListener("click", function () {
            if (item.isSandbox) {
                // Advance the hash to the deep-link route; the hashchange handler
                // mounts the playground, so the URL alone reproduces this view.
                window.location.hash = "#interactives-sandbox-" + sandboxRouteId(item);
            } else {
                mountVisualizer(container, item);
            }
        });
        card.appendChild(launch);

        currentGrid.appendChild(card);
    });

    layout.appendChild(sidebar);
    layout.appendChild(content);
    container.appendChild(layout);
}

/* Mounts a single card into the main view, replacing the dashboard grid with a
   focused workspace and a back action. A graded engine delegates to its
   registered checkpoint widget; a sandbox card mounts its live playground engine
   directly into the workspace (no intermediate gate). Either way the content
   builds inside a uniquely identified host that is the only one on the page while
   it is open, so any element ids the engine creates cannot collide with
   another card's. */
function mountVisualizer(container, item) {
    container.innerHTML = "";
    const vis = item.vis;

    const nav = document.createElement("div");
    nav.className = "unit-detail-nav";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-toc-btn";
    backBtn.textContent = "Back to Interactive Visualizers";
    backBtn.addEventListener("click", function () {
        // A sandbox arrived via its deep-link hash, so stepping back to the
        // dashboard is a hash change (which re-renders and tears down the engine's
        // animation loop). Graded engines mount in place with the hash still on
        // "#interactives", so setting the same hash would be a no-op: re-render
        // the dashboard directly instead.
        if (item.isSandbox) {
            window.location.hash = "#interactives";
        } else {
            renderInteractives(container);
            window.scrollTo(0, 0);
        }
    });
    nav.appendChild(backBtn);
    container.appendChild(nav);

    const intro = document.createElement("div");
    intro.className = "toc-intro";

    // A compact badge. For graded engines this reads "Unit N · Module N.M"; the
    // full unit title already shows in the heading, so appending it here only
    // crowded the line. Sandbox cards have no module, so they read "Unit N ·
    // Sandbox".
    const badge = document.createElement("span");
    badge.className = "interactive-badge";
    badge.textContent = item.isSandbox
        ? "Unit " + item.unitNumber + " · Sandbox"
        : "Unit " + item.unitNumber + " · Module " + item.moduleLabel;
    intro.appendChild(badge);

    const heading = document.createElement("h1");
    heading.className = "toc-heading";
    heading.textContent = vis.title;
    intro.appendChild(heading);

    container.appendChild(intro);

    // Isolated, uniquely identified host. Only one card is mounted at a time, so
    // the widget's own canvases and Desmos frames never share DOM ids with
    // another card's. Sandbox cards have no checkpoint id, so they key off their
    // unit number instead.
    const host = document.createElement("div");
    host.className = "interactive-workspace-card interactive-host";
    // A built sandbox engine carries its own stable id (e.g.
    // "unit_0_equation_translator"), so the host keys off that; generic sandbox
    // placeholders have no id and fall back to their unit number. Either way the
    // mounted engine is the only one on the page, so its inner ids stay isolated.
    const hostKey = item.isSandbox
        ? (vis.id ? vis.id : "sandbox-unit-" + item.unitNumber)
        : vis.id;
    host.id = "interactive-host-" + hostKey;
    container.appendChild(host);

    if (item.isSandbox) {
        // Mount the live playground straight into the workspace - no intermediate
        // "Open Sandbox Playground" gate. The workspace intro above already shows
        // the title and badge; each built engine adds its own intro paragraph.
        const body = document.createElement("div");
        body.className = "checkpoint-body";
        host.appendChild(body);

        // A built engine (Cluster I and onward) supplies its own render(body);
        // units still awaiting a tool fall back to the construction placeholder.
        if (typeof item.vis.render === "function") {
            item.vis.render(body, item);
        } else {
            const note = document.createElement("p");
            note.className = "checkpoint-placeholder";
            note.textContent = "This open-ended sandbox is under construction. It will let you drag sliders, retype expressions, and explore the graph freely, with nothing to grade.";
            body.appendChild(note);
        }
    } else {
        CheckpointRegistry.render(item.home.moduleData.interactive_checkpoint, host, item.home.moduleData);
    }
}

/* ============================================================================
   Unit 0 Cluster I sandbox engines

   Three self-contained, ungraded exploration surfaces mounted by
   mountVisualizer. Shared rules across all three:
     - Every DOM id and the meaningful internal state is namespaced under a
       strict u0_s1_ / u0_s2_ / u0_s3_ prefix, so nothing they create can collide
       in global memory with another engine or another card.
     - All canvas colors are read live from the document's theme custom
       properties (--bg-color, --accent-color, ...) at draw time, so Light and
       Dark both look native and toggling the theme mid-session repaints in place.
     - No fetch, CDN, or remote script loading: each engine runs unchanged from
       the file:// protocol.
     - Animation loops self-terminate once their canvas leaves the DOM (the back
       action empties the container), so navigating away leaves no orphan frames.
   ============================================================================ */

/* Reads a CSS custom property off the document root, resolved against whichever
   light/dark theme is active right now. Called inside draw loops so a theme
   toggle is reflected on the very next frame. */
function u0SandboxColor(varName, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName);
    return (v && v.trim()) || fallback;
}

/* Draws a filled-head vector arrow from (x0,y0) to (x1,y1) on a 2D context. */
function u0SandboxArrow(ctx, x0, y0, x1, y1, color, width) {
    const dx = x1 - x0, dy = y1 - y0;
    const len = Math.sqrt(dx * dx + dy * dy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 2.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    if (len < 2) return; // too short to carry a readable head
    const ux = dx / len, uy = dy / len;
    const head = 9;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - head * ux + head * 0.5 * uy, y1 - head * uy - head * 0.5 * ux);
    ctx.lineTo(x1 - head * ux - head * 0.5 * uy, y1 - head * uy + head * 0.5 * ux);
    ctx.closePath();
    ctx.fill();
}

/* A labelled toggle-button group for a sandbox control panel. Builds a titled
   row of mutually exclusive buttons; clicking one marks it active (accent fill)
   and fires onPick with its value. Returns a repaint() that re-syncs the active
   styling to an externally changed value. Theme-bound via inline var() styles. */
function u0SandboxToggleGroup(parent, title, options, getValue, onPick) {
    const wrap = document.createElement("div");
    wrap.style.marginBottom = "0.85rem";

    const heading = document.createElement("div");
    heading.textContent = title;
    heading.style.fontSize = "0.78rem";
    heading.style.fontWeight = "700";
    heading.style.textTransform = "uppercase";
    heading.style.letterSpacing = "0.04em";
    heading.style.color = "var(--text-secondary)";
    heading.style.marginBottom = "0.4rem";
    wrap.appendChild(heading);

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.gap = "0.4rem";
    wrap.appendChild(row);

    const buttons = [];
    options.forEach(function (opt) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opt.label;
        btn.style.font = "inherit";
        btn.style.fontSize = "0.9rem";
        btn.style.padding = "0.35rem 0.7rem";
        btn.style.borderRadius = "8px";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid var(--panel-border)";
        btn.addEventListener("click", function () {
            onPick(opt.value);
            repaint();
        });
        row.appendChild(btn);
        buttons.push({ btn: btn, value: opt.value });
    });

    function repaint() {
        const active = getValue();
        buttons.forEach(function (b) {
            const on = b.value === active;
            b.btn.style.background = on ? "var(--accent-color)" : "var(--accent-soft)";
            b.btn.style.color = on ? "var(--bg-color)" : "var(--text-color)";
            b.btn.style.borderColor = on ? "var(--accent-color)" : "var(--panel-border)";
            b.btn.style.fontWeight = on ? "700" : "500";
        });
    }

    parent.appendChild(wrap);
    repaint();
    return repaint;
}

/* A labelled range slider with a live numeric readout, built from the shared
   .slider-row theme classes. Returns a holder whose .value tracks the current
   number, plus setValue() to drive it programmatically (e.g. a coupled control).
   The readout is formatted to opts.decimals places. */
function u0SandboxSlider(parent, opts) {
    const decimals = (opts.decimals === undefined) ? 2 : opts.decimals;
    const row = document.createElement("div");
    row.className = "slider-row";

    const label = document.createElement("span");
    label.className = "slider-label";
    label.textContent = opts.label;

    const input = document.createElement("input");
    input.type = "range";
    input.min = String(opts.min);
    input.max = String(opts.max);
    input.step = String(opts.step);
    input.value = String(opts.value);

    const readout = document.createElement("span");
    readout.className = "slider-readout";

    const holder = { value: opts.value, input: input };
    function format(v) { return v.toFixed(decimals) + (opts.suffix || ""); }
    readout.textContent = format(opts.value);

    input.addEventListener("input", function () {
        holder.value = parseFloat(input.value);
        readout.textContent = format(holder.value);
        if (opts.onChange) opts.onChange(holder.value);
    });
    holder.setValue = function (v) {
        holder.value = v;
        input.value = String(v);
        readout.textContent = format(v);
    };

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(readout);
    parent.appendChild(row);
    return holder;
}

/* ---------------------------------------------------------------------------
   Sandbox 1 - The Dynamic Equation Translator (u0_s1_)

   Left: a syntax selector where the student assembles a rate constraint by
   picking the derivative order (the rate being constrained) and the right-hand
   side it equals, plus a k slider. Right: a live canvas where a particle moves
   on a 1D track under that exact law, its velocity and acceleration drawn as
   theme-coloured vectors. Re-selecting any token instantly rebuilds the law and
   restarts the integration, so the vectors recompute on the spot.
   --------------------------------------------------------------------------- */
function renderEquationTranslatorSandbox(body) {
    // A non-zero start displacement (x0 = 2) matters: the restoring law -k·x and
    // the second-order oscillator both sit dead still at the origin, so seeding a
    // displacement makes every assembled law produce visible motion from frame one.
    const u0_s1_X0 = 2.0;
    const u0_s1_state = {
        order: 1,        // 1 -> dx/dt (velocity law), 2 -> d2x/dt2 (acceleration law)
        rhs: "const",    // const | sine | restoring
        k: 1.2,
        x: u0_s1_X0, v: 0, a: 0, t: 0
    };

    // The right-hand side the chosen tokens evaluate to, in world units.
    function u0_s1_rhsValue() {
        const s = u0_s1_state;
        switch (s.rhs) {
            case "sine": return s.k * Math.sin(s.t);
            case "restoring": return -s.k * s.x;
            default: return s.k; // "const"
        }
    }

    function u0_s1_rhsText() {
        switch (u0_s1_state.rhs) {
            case "sine": return "k·sin t";
            case "restoring": return "−k·x";
            default: return "k";
        }
    }

    function u0_s1_lhsText() {
        return u0_s1_state.order === 1 ? "dx/dt" : "d²x/dt²";
    }

    // Restart the integration from the origin whenever the law changes, so the
    // newly assembled constraint is what drives the vectors from frame one.
    function u0_s1_reset() {
        u0_s1_state.x = u0_s1_X0;
        u0_s1_state.v = 0;
        u0_s1_state.a = 0;
        u0_s1_state.t = 0;
        u0_s1_syncEquation();
    }

    // --- Split layout shell ---
    const u0_s1_wrap = document.createElement("div");
    u0_s1_wrap.style.display = "flex";
    u0_s1_wrap.style.flexWrap = "wrap";
    u0_s1_wrap.style.gap = "1rem";
    u0_s1_wrap.style.alignItems = "stretch";

    const u0_s1_controls = document.createElement("div");
    u0_s1_controls.style.flex = "1 1 240px";
    u0_s1_controls.style.minWidth = "240px";
    u0_s1_controls.style.padding = "1rem";
    u0_s1_controls.style.background = "var(--panel-bg)";
    u0_s1_controls.style.border = "1px solid var(--panel-border)";
    u0_s1_controls.style.borderRadius = "10px";

    const u0_s1_stage = document.createElement("div");
    u0_s1_stage.style.flex = "2 1 340px";
    u0_s1_stage.style.minWidth = "300px";

    u0_s1_wrap.appendChild(u0_s1_controls);
    u0_s1_wrap.appendChild(u0_s1_stage);
    body.appendChild(u0_s1_wrap);

    // --- Selector interface ---
    const u0_s1_blurb = document.createElement("p");
    u0_s1_blurb.className = "checkpoint-intro";
    u0_s1_blurb.textContent = "Pick the rate being constrained and what it equals, then watch the particle obey the law you built.";
    u0_s1_controls.appendChild(u0_s1_blurb);

    u0SandboxToggleGroup(u0_s1_controls, "Rate being constrained",
        [{ value: 1, label: "dx/dt" }, { value: 2, label: "d²x/dt²" }],
        function () { return u0_s1_state.order; },
        function (val) { u0_s1_state.order = val; u0_s1_reset(); });

    u0SandboxToggleGroup(u0_s1_controls, "Equals",
        [{ value: "const", label: "k" }, { value: "sine", label: "k·sin t" }, { value: "restoring", label: "−k·x" }],
        function () { return u0_s1_state.rhs; },
        function (val) { u0_s1_state.rhs = val; u0_s1_reset(); });

    // k slider, built locally so its value drives the law live without a reset.
    const u0_s1_sliderRow = document.createElement("div");
    u0_s1_sliderRow.className = "slider-row";
    const u0_s1_sliderLabel = document.createElement("span");
    u0_s1_sliderLabel.className = "slider-label";
    u0_s1_sliderLabel.textContent = "k =";
    const u0_s1_sliderInput = document.createElement("input");
    u0_s1_sliderInput.type = "range";
    u0_s1_sliderInput.min = "-3";
    u0_s1_sliderInput.max = "3";
    u0_s1_sliderInput.step = "0.1";
    u0_s1_sliderInput.value = String(u0_s1_state.k);
    const u0_s1_sliderReadout = document.createElement("span");
    u0_s1_sliderReadout.className = "slider-readout";
    u0_s1_sliderReadout.textContent = u0_s1_state.k.toFixed(1);
    u0_s1_sliderInput.addEventListener("input", function () {
        u0_s1_state.k = parseFloat(u0_s1_sliderInput.value);
        u0_s1_sliderReadout.textContent = u0_s1_state.k.toFixed(1);
        u0_s1_syncEquation();
    });
    u0_s1_sliderRow.appendChild(u0_s1_sliderLabel);
    u0_s1_sliderRow.appendChild(u0_s1_sliderInput);
    u0_s1_sliderRow.appendChild(u0_s1_sliderReadout);
    u0_s1_controls.appendChild(u0_s1_sliderRow);

    // Assembled-equation readout, in a monospace chip.
    const u0_s1_equation = document.createElement("div");
    u0_s1_equation.style.fontFamily = "Consolas, Monaco, monospace";
    u0_s1_equation.style.fontSize = "1.05rem";
    u0_s1_equation.style.fontWeight = "700";
    u0_s1_equation.style.padding = "0.6rem 0.8rem";
    u0_s1_equation.style.marginTop = "0.4rem";
    u0_s1_equation.style.background = "var(--bg-color)";
    u0_s1_equation.style.border = "1px solid var(--panel-border)";
    u0_s1_equation.style.borderRadius = "8px";
    u0_s1_equation.style.color = "var(--accent-color)";
    u0_s1_controls.appendChild(u0_s1_equation);

    function u0_s1_syncEquation() {
        u0_s1_equation.textContent = u0_s1_lhsText() + " = " + u0_s1_rhsText()
            + "   (k = " + u0_s1_state.k.toFixed(1) + ")";
    }

    // Reset button to recentre the particle without changing the law.
    const u0_s1_resetBtn = document.createElement("button");
    u0_s1_resetBtn.type = "button";
    u0_s1_resetBtn.className = "checkpoint-begin-btn";
    u0_s1_resetBtn.style.marginTop = "0.85rem";
    u0_s1_resetBtn.textContent = "Reset particle to origin";
    u0_s1_resetBtn.addEventListener("click", u0_s1_reset);
    u0_s1_controls.appendChild(u0_s1_resetBtn);

    // --- Canvas stage ---
    const u0_s1_canvas = document.createElement("canvas");
    u0_s1_canvas.width = 560;
    u0_s1_canvas.height = 300;
    u0_s1_canvas.className = "math-canvas";
    u0_s1_stage.appendChild(u0_s1_canvas);

    const u0_s1_ctx = u0_s1_canvas.getContext("2d");
    const u0_s1_LIM = 5; // world half-width of the track

    function u0_s1_step(dt) {
        const s = u0_s1_state;
        s.t += dt;
        if (s.order === 1) {
            // First-order law: dx/dt is the right-hand side directly.
            const rate = u0_s1_rhsValue();
            const prevV = s.v;
            s.v = rate;
            s.x += rate * dt;
            s.a = (s.v - prevV) / dt; // numerical acceleration of the velocity law
        } else {
            // Second-order law: the right-hand side is the acceleration.
            const acc = u0_s1_rhsValue();
            s.a = acc;
            s.v += acc * dt;
            s.x += s.v * dt;
        }
        // Keep the particle on the visible track with an inelastic bounce so a
        // constant-velocity or growing law stays watchable instead of escaping.
        if (s.x > u0_s1_LIM) { s.x = u0_s1_LIM; s.v = -Math.abs(s.v) * 0.6; }
        if (s.x < -u0_s1_LIM) { s.x = -u0_s1_LIM; s.v = Math.abs(s.v) * 0.6; }
    }

    function u0_s1_draw() {
        const ctx = u0_s1_ctx;
        const W = u0_s1_canvas.width, H = u0_s1_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const warm = u0SandboxColor("--error-color", "#b3261e");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const pad = 44;
        const midY = H * 0.52;
        function pxX(x) { return pad + (x + u0_s1_LIM) / (2 * u0_s1_LIM) * (W - 2 * pad); }

        // Track and ticks.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pad, midY);
        ctx.lineTo(W - pad, midY);
        ctx.stroke();
        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        for (let gx = -u0_s1_LIM; gx <= u0_s1_LIM; gx++) {
            const X = pxX(gx);
            ctx.strokeStyle = border;
            ctx.beginPath();
            ctx.moveTo(X, midY - 4);
            ctx.lineTo(X, midY + 4);
            ctx.stroke();
            ctx.fillText(String(gx), X, midY + 18);
        }

        const cx = pxX(u0_s1_state.x);

        // Velocity vector (accent) above the particle, acceleration (warm) below.
        const vScale = 22, aScale = 16;
        u0SandboxArrow(ctx, cx, midY - 16, cx + u0_s1_state.v * vScale, midY - 16, accent, 3);
        u0SandboxArrow(ctx, cx, midY + 16, cx + u0_s1_state.a * aScale, midY + 16, warm, 3);

        // The particle.
        ctx.fillStyle = text;
        ctx.beginPath();
        ctx.arc(cx, midY, 9, 0, 2 * Math.PI);
        ctx.fill();

        // Legend + live readouts.
        ctx.textAlign = "left";
        ctx.font = "13px sans-serif";
        ctx.fillStyle = accent;
        ctx.fillText("velocity  v = " + u0_s1_state.v.toFixed(2), 16, 24);
        ctx.fillStyle = warm;
        ctx.fillText("acceleration  a = " + u0_s1_state.a.toFixed(2), 16, 44);
        ctx.fillStyle = sub;
        ctx.fillText("position  x = " + u0_s1_state.x.toFixed(2), 16, H - 16);
    }

    u0_s1_syncEquation();

    function u0_s1_frame() {
        // Self-terminate once the back action removes the canvas from the page.
        if (!document.body.contains(u0_s1_canvas)) return;
        u0_s1_step(0.016);
        u0_s1_draw();
        requestAnimationFrame(u0_s1_frame);
    }
    requestAnimationFrame(u0_s1_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 2 - The Arbitrary Constant Solution Curve Explorer (u0_s2_)

   A coordinate matrix graphs the family y = C e^x. A faint backdrop of family
   members shows the infinite family; the active member, set by the C slider,
   is painted boldly over it. Clicking anywhere computes the single C whose curve
   threads that (x, y) point, snaps the slider to it, and marks the locked
   trajectory - an initial condition selecting one solution from the family.
   --------------------------------------------------------------------------- */
function renderConstantExplorerSandbox(body) {
    const u0_s2_state = { C: 1.0, pick: null }; // pick = {x, y} of the clicked node

    const u0_s2_C_MIN = -6, u0_s2_C_MAX = 6;
    const u0_s2_xMin = -3, u0_s2_xMax = 3, u0_s2_yMin = -8, u0_s2_yMax = 8;

    const u0_s2_intro = document.createElement("p");
    u0_s2_intro.className = "checkpoint-intro";
    u0_s2_intro.textContent = "Slide C to sweep the family y = C·e^x, or click any point on the grid to lock the one curve that passes through it.";
    body.appendChild(u0_s2_intro);

    const u0_s2_canvas = document.createElement("canvas");
    u0_s2_canvas.width = 600;
    u0_s2_canvas.height = 380;
    u0_s2_canvas.className = "math-canvas";
    u0_s2_canvas.style.cursor = "crosshair";
    body.appendChild(u0_s2_canvas);
    const u0_s2_ctx = u0_s2_canvas.getContext("2d");

    // C slider, built locally so a click can drive its position programmatically.
    const u0_s2_sliderRow = document.createElement("div");
    u0_s2_sliderRow.className = "slider-row";
    const u0_s2_sliderLabel = document.createElement("span");
    u0_s2_sliderLabel.className = "slider-label";
    u0_s2_sliderLabel.textContent = "C =";
    const u0_s2_sliderInput = document.createElement("input");
    u0_s2_sliderInput.type = "range";
    u0_s2_sliderInput.min = String(u0_s2_C_MIN);
    u0_s2_sliderInput.max = String(u0_s2_C_MAX);
    u0_s2_sliderInput.step = "0.01";
    u0_s2_sliderInput.value = String(u0_s2_state.C);
    const u0_s2_sliderReadout = document.createElement("span");
    u0_s2_sliderReadout.className = "slider-readout";
    u0_s2_sliderReadout.textContent = u0_s2_state.C.toFixed(2);
    u0_s2_sliderInput.addEventListener("input", function () {
        u0_s2_state.C = parseFloat(u0_s2_sliderInput.value);
        u0_s2_state.pick = null; // a manual sweep releases the locked point
        u0_s2_sliderReadout.textContent = u0_s2_state.C.toFixed(2);
        u0_s2_draw();
    });
    u0_s2_sliderRow.appendChild(u0_s2_sliderLabel);
    u0_s2_sliderRow.appendChild(u0_s2_sliderInput);
    u0_s2_sliderRow.appendChild(u0_s2_sliderReadout);
    body.appendChild(u0_s2_sliderRow);

    function u0_s2_pxX(x) { return (x - u0_s2_xMin) / (u0_s2_xMax - u0_s2_xMin) * u0_s2_canvas.width; }
    function u0_s2_pyY(y) { return u0_s2_canvas.height - (y - u0_s2_yMin) / (u0_s2_yMax - u0_s2_yMin) * u0_s2_canvas.height; }
    function u0_s2_worldX(px) { return u0_s2_xMin + px / u0_s2_canvas.width * (u0_s2_xMax - u0_s2_xMin); }
    function u0_s2_worldY(py) { return u0_s2_yMin + (u0_s2_canvas.height - py) / u0_s2_canvas.height * (u0_s2_yMax - u0_s2_yMin); }

    function u0_s2_drawCurve(C, color, width) {
        const ctx = u0_s2_ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        let started = false;
        for (let px = 0; px <= u0_s2_canvas.width; px += 2) {
            const x = u0_s2_worldX(px);
            const y = C * Math.exp(x);
            if (!isFinite(y) || Math.abs(y) > 1e5) { started = false; continue; }
            const sy = u0_s2_pyY(y);
            if (started) ctx.lineTo(px, sy); else { ctx.moveTo(px, sy); started = true; }
        }
        ctx.stroke();
    }

    function u0_s2_draw() {
        const ctx = u0_s2_ctx;
        const W = u0_s2_canvas.width, H = u0_s2_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Coordinate matrix: unit grid lines.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        for (let gx = Math.ceil(u0_s2_xMin); gx <= u0_s2_xMax; gx++) {
            const X = u0_s2_pxX(gx);
            ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, H); ctx.stroke();
        }
        for (let gy = Math.ceil(u0_s2_yMin); gy <= u0_s2_yMax; gy += 2) {
            const Y = u0_s2_pyY(gy);
            ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(W, Y); ctx.stroke();
        }
        // Axes, drawn darker.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, u0_s2_pyY(0)); ctx.lineTo(W, u0_s2_pyY(0));
        ctx.moveTo(u0_s2_pxX(0), 0); ctx.lineTo(u0_s2_pxX(0), H);
        ctx.stroke();

        // The infinite family, as faint ghosts.
        const ghosts = [-4, -2, -1, -0.5, 0.5, 1, 2, 4];
        ctx.globalAlpha = 0.28;
        ghosts.forEach(function (C) { u0_s2_drawCurve(C, sub, 1.5); });
        ctx.globalAlpha = 1;

        // The active member.
        u0_s2_drawCurve(u0_s2_state.C, accent, 3);

        // The locked point and its guide lines.
        if (u0_s2_state.pick) {
            const px = u0_s2_pxX(u0_s2_state.pick.x);
            const py = u0_s2_pyY(u0_s2_state.pick.y);
            ctx.strokeStyle = accent;
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, u0_s2_pyY(0)); ctx.lineTo(px, py);
            ctx.moveTo(u0_s2_pxX(0), py); ctx.lineTo(px, py);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = text;
            ctx.font = "13px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("initial condition locks C = " + u0_s2_state.C.toFixed(2),
                Math.min(px + 10, W - 230), Math.max(py - 10, 16));
        }

        // Family label.
        ctx.fillStyle = accent;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("y = C·e^x", 12, 20);
    }

    u0_s2_canvas.addEventListener("click", function (evt) {
        // Map the click into world coordinates, then solve C = y / e^x for the
        // single family member through that point. Clamp into the slider's range.
        const rect = u0_s2_canvas.getBoundingClientRect();
        const px = (evt.clientX - rect.left) * (u0_s2_canvas.width / rect.width);
        const py = (evt.clientY - rect.top) * (u0_s2_canvas.height / rect.height);
        const wx = u0_s2_worldX(px);
        const wy = u0_s2_worldY(py);
        let C = wy / Math.exp(wx);
        C = Math.max(u0_s2_C_MIN, Math.min(u0_s2_C_MAX, C));
        u0_s2_state.C = C;
        u0_s2_state.pick = { x: wx, y: wy };
        u0_s2_sliderInput.value = String(C);
        u0_s2_sliderReadout.textContent = C.toFixed(2);
        u0_s2_draw();
    });

    // This engine is event-driven, but a one-shot rAF guarded on DOM presence
    // lets a mid-session theme toggle repaint without any persistent loop.
    function u0_s2_themeWatch() {
        if (!document.body.contains(u0_s2_canvas)) return;
        u0_s2_draw();
        requestAnimationFrame(u0_s2_themeWatch);
    }
    requestAnimationFrame(u0_s2_themeWatch);
}

/* ---------------------------------------------------------------------------
   Sandbox 3 - The ODE vs. PDE Independent Variable Sandbox (u0_s3_)

   Left: an ODE world - a point whose coordinate depends purely on t, traced as
   x(t) scrolls across a 2D time plot (one independent variable, a total
   derivative along a line). Right: a PDE world - an animated wireframe sheet
   u(x, y, t) projected isometrically, rippling across two spatial variables at
   once (a surface gradient). A shared frequency slider and play toggle drive
   both, making the dimensional contrast immediate.
   --------------------------------------------------------------------------- */
function renderVariableSpaceSandbox(body) {
    const u0_s3_state = { t: 0, freq: 1.0, playing: true };

    const u0_s3_intro = document.createElement("p");
    u0_s3_intro.className = "checkpoint-intro";
    u0_s3_intro.textContent = "Left: a point moving purely as a function of t (an ODE, one independent variable). Right: a sheet rippling across both x and y at once (a PDE, two independent variables).";
    body.appendChild(u0_s3_intro);

    const u0_s3_wrap = document.createElement("div");
    u0_s3_wrap.style.display = "flex";
    u0_s3_wrap.style.flexWrap = "wrap";
    u0_s3_wrap.style.gap = "1rem";
    body.appendChild(u0_s3_wrap);

    // Left pane.
    const u0_s3_leftCol = document.createElement("div");
    u0_s3_leftCol.style.flex = "1 1 280px";
    u0_s3_leftCol.style.minWidth = "260px";
    const u0_s3_leftTitle = document.createElement("div");
    u0_s3_leftTitle.className = "checkpoint-prompt";
    u0_s3_leftTitle.textContent = "ODE world · x(t)";
    u0_s3_leftCol.appendChild(u0_s3_leftTitle);
    const u0_s3_left = document.createElement("canvas");
    u0_s3_left.width = 360;
    u0_s3_left.height = 300;
    u0_s3_left.className = "math-canvas";
    u0_s3_leftCol.appendChild(u0_s3_left);
    u0_s3_wrap.appendChild(u0_s3_leftCol);

    // Right pane.
    const u0_s3_rightCol = document.createElement("div");
    u0_s3_rightCol.style.flex = "1 1 280px";
    u0_s3_rightCol.style.minWidth = "260px";
    const u0_s3_rightTitle = document.createElement("div");
    u0_s3_rightTitle.className = "checkpoint-prompt";
    u0_s3_rightTitle.textContent = "PDE world · u(x, y, t)";
    u0_s3_rightCol.appendChild(u0_s3_rightTitle);
    const u0_s3_right = document.createElement("canvas");
    u0_s3_right.width = 360;
    u0_s3_right.height = 300;
    u0_s3_right.className = "math-canvas";
    u0_s3_rightCol.appendChild(u0_s3_right);
    u0_s3_wrap.appendChild(u0_s3_rightCol);

    // Shared controls: a frequency slider and a play/pause toggle.
    const u0_s3_sliderRow = document.createElement("div");
    u0_s3_sliderRow.className = "slider-row";
    const u0_s3_sliderLabel = document.createElement("span");
    u0_s3_sliderLabel.className = "slider-label";
    u0_s3_sliderLabel.textContent = "freq";
    const u0_s3_sliderInput = document.createElement("input");
    u0_s3_sliderInput.type = "range";
    u0_s3_sliderInput.min = "0.3";
    u0_s3_sliderInput.max = "2.5";
    u0_s3_sliderInput.step = "0.1";
    u0_s3_sliderInput.value = String(u0_s3_state.freq);
    const u0_s3_sliderReadout = document.createElement("span");
    u0_s3_sliderReadout.className = "slider-readout";
    u0_s3_sliderReadout.textContent = u0_s3_state.freq.toFixed(1);
    u0_s3_sliderInput.addEventListener("input", function () {
        u0_s3_state.freq = parseFloat(u0_s3_sliderInput.value);
        u0_s3_sliderReadout.textContent = u0_s3_state.freq.toFixed(1);
    });
    u0_s3_sliderRow.appendChild(u0_s3_sliderLabel);
    u0_s3_sliderRow.appendChild(u0_s3_sliderInput);
    u0_s3_sliderRow.appendChild(u0_s3_sliderReadout);
    body.appendChild(u0_s3_sliderRow);

    const u0_s3_toggle = document.createElement("button");
    u0_s3_toggle.type = "button";
    u0_s3_toggle.className = "checkpoint-begin-btn";
    u0_s3_toggle.textContent = "Pause";
    u0_s3_toggle.addEventListener("click", function () {
        u0_s3_state.playing = !u0_s3_state.playing;
        u0_s3_toggle.textContent = u0_s3_state.playing ? "Pause" : "Play";
    });
    body.appendChild(u0_s3_toggle);

    const u0_s3_lctx = u0_s3_left.getContext("2d");
    const u0_s3_rctx = u0_s3_right.getContext("2d");

    // Left: scroll the curve x(tau) = sin(freq*tau) across a window ending at the
    // current time, with a leading dot. One independent variable: t.
    function u0_s3_drawLeft() {
        const ctx = u0_s3_lctx;
        const W = u0_s3_left.width, H = u0_s3_left.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const midY = H / 2;
        const amp = H * 0.32;
        const span = 4 * Math.PI; // visible time window
        function pxT(tau) { return (tau - (u0_s3_state.t - span)) / span * W; }
        function pyX(x) { return midY - x * amp; }

        // Axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY); ctx.lineTo(W, midY);
        ctx.stroke();

        // The traced curve.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let started = false;
        const steps = 240;
        for (let i = 0; i <= steps; i++) {
            const tau = (u0_s3_state.t - span) + span * i / steps;
            const x = Math.sin(u0_s3_state.freq * tau);
            const sx = pxT(tau), sy = pyX(x);
            if (started) ctx.lineTo(sx, sy); else { ctx.moveTo(sx, sy); started = true; }
        }
        ctx.stroke();

        // Leading point at the current t.
        const xn = Math.sin(u0_s3_state.freq * u0_s3_state.t);
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(pxT(u0_s3_state.t), pyX(xn), 7, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("depends on t alone", 12, H - 14);
    }

    // Right: an isometric wireframe of u(x,y,t) = sin(freq*x + t)*cos(freq*y + t),
    // line opacity rising with height. Two independent variables: x and y.
    function u0_s3_drawRight() {
        const ctx = u0_s3_rctx;
        const W = u0_s3_right.width, H = u0_s3_right.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const N = 14;            // grid resolution per axis
        const range = 2.2;       // world half-extent in x and y
        const cx = W / 2, cy = H * 0.42;
        const ux = 12, uy = 7, uz = 30; // isometric projection scales

        function node(i, j) {
            const x = -range + 2 * range * i / N;
            const y = -range + 2 * range * j / N;
            const z = Math.sin(u0_s3_state.freq * x + u0_s3_state.t) *
                      Math.cos(u0_s3_state.freq * y + u0_s3_state.t);
            const gx = (i - N / 2), gy = (j - N / 2);
            return {
                sx: cx + (gx - gy) * ux,
                sy: cy + (gx + gy) * uy - z * uz,
                z: z
            };
        }

        ctx.lineWidth = 1.4;
        for (let i = 0; i <= N; i++) {
            for (let j = 0; j <= N; j++) {
                const p = node(i, j);
                if (i < N) {
                    const q = node(i + 1, j);
                    ctx.globalAlpha = 0.30 + 0.55 * ((p.z + q.z) / 2 + 1) / 2;
                    ctx.strokeStyle = accent;
                    ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
                }
                if (j < N) {
                    const q = node(i, j + 1);
                    ctx.globalAlpha = 0.30 + 0.55 * ((p.z + q.z) / 2 + 1) / 2;
                    ctx.strokeStyle = accent;
                    ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;

        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("depends on x and y", 12, H - 14);
    }

    function u0_s3_frame() {
        if (!document.body.contains(u0_s3_left)) return; // stop after navigation
        if (u0_s3_state.playing) u0_s3_state.t += 0.03;
        u0_s3_drawLeft();
        u0_s3_drawRight();
        requestAnimationFrame(u0_s3_frame);
    }
    requestAnimationFrame(u0_s3_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 4 - The Primitive Vector Grid Tracer (u0_s4_)

   A deliberately blank coordinate field for dy/dx = f(x, y). The slope field is
   NOT pre-drawn: the student probes it. Hovering anywhere shows the live local
   derivative vector and its numeric slope at that exact point; clicking drops a
   tracer seed whose streamline is integrated both backward and forward along the
   field (arc-length stepping, so vertical slopes never blow up), letting students
   lay down multiple distinct trajectories and map the field by hand. A small
   selector swaps f, and every existing tracer re-integrates under the new field.
   --------------------------------------------------------------------------- */
function renderVectorGridTracerSandbox(body) {
    const u0_s4_fields = [
        { value: "xmy", label: "x − y", fn: function (x, y) { return x - y; } },
        { value: "negy", label: "−y", fn: function (x, y) { return -y; } },
        { value: "circ", label: "−x ⁄ y", fn: function (x, y) { return -x / y; } },
        { value: "xy", label: "x·y ⁄ 4", fn: function (x, y) { return x * y / 4; } }
    ];
    const u0_s4_state = {
        fKey: "xmy",
        seeds: [],          // dropped tracer origins, in world coordinates
        hover: null         // {x, y} world coordinates of the cursor, or null
    };

    function u0_s4_f(x, y) {
        for (let i = 0; i < u0_s4_fields.length; i++) {
            if (u0_s4_fields[i].value === u0_s4_state.fKey) return u0_s4_fields[i].fn(x, y);
        }
        return 0;
    }

    const u0_s4_intro = document.createElement("p");
    u0_s4_intro.className = "checkpoint-intro";
    u0_s4_intro.textContent = "Hover to sample the local slope vector dy/dx = f(x, y). Click to drop a tracer that flows along the field in both directions; drop several to map the field by hand.";
    body.appendChild(u0_s4_intro);

    // Field selector.
    u0SandboxToggleGroup(body, "Field  dy/dx = f(x, y)",
        u0_s4_fields.map(function (f) { return { value: f.value, label: f.label }; }),
        function () { return u0_s4_state.fKey; },
        function (val) { u0_s4_state.fKey = val; });

    const u0_s4_canvas = document.createElement("canvas");
    u0_s4_canvas.width = 480;
    u0_s4_canvas.height = 480;
    u0_s4_canvas.className = "math-canvas";
    u0_s4_canvas.style.cursor = "crosshair";
    body.appendChild(u0_s4_canvas);
    const u0_s4_ctx = u0_s4_canvas.getContext("2d");

    const u0_s4_clearBtn = document.createElement("button");
    u0_s4_clearBtn.type = "button";
    u0_s4_clearBtn.className = "checkpoint-begin-btn";
    u0_s4_clearBtn.textContent = "Clear tracers";
    u0_s4_clearBtn.addEventListener("click", function () { u0_s4_state.seeds = []; });
    body.appendChild(u0_s4_clearBtn);

    const u0_s4_xMin = -6, u0_s4_xMax = 6, u0_s4_yMin = -6, u0_s4_yMax = 6;
    function u0_s4_pxX(x) { return (x - u0_s4_xMin) / (u0_s4_xMax - u0_s4_xMin) * u0_s4_canvas.width; }
    function u0_s4_pyY(y) { return u0_s4_canvas.height - (y - u0_s4_yMin) / (u0_s4_yMax - u0_s4_yMin) * u0_s4_canvas.height; }
    function u0_s4_worldX(px) { return u0_s4_xMin + px / u0_s4_canvas.width * (u0_s4_xMax - u0_s4_xMin); }
    function u0_s4_worldY(py) { return u0_s4_yMin + (u0_s4_canvas.height - py) / u0_s4_canvas.height * (u0_s4_yMax - u0_s4_yMin); }

    // Integrate the streamline through a seed by arc length, both directions, so a
    // steep or infinite slope is handled gracefully via the normalized tangent.
    function u0_s4_streamline(seed) {
        function march(dir) {
            const out = [];
            let x = seed.x, y = seed.y;
            const ds = 0.06 * dir;
            for (let i = 0; i < 800; i++) {
                const m = u0_s4_f(x, y);
                if (!isFinite(m)) break;
                const inv = 1 / Math.sqrt(1 + m * m);
                x += ds * inv;
                y += ds * m * inv;
                if (!isFinite(x) || !isFinite(y)) break;
                if (x < u0_s4_xMin || x > u0_s4_xMax || y < u0_s4_yMin || y > u0_s4_yMax) break;
                out.push({ x: x, y: y });
            }
            return out;
        }
        return march(-1).reverse().concat([{ x: seed.x, y: seed.y }], march(1));
    }

    function u0_s4_draw() {
        const ctx = u0_s4_ctx;
        const W = u0_s4_canvas.width, H = u0_s4_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const alt = u0SandboxColor("--success-color", "#1b7a43");
        const warm = u0SandboxColor("--error-color", "#b3261e");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Unit grid (blank field: no slope marks, just the coordinate lattice).
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        for (let gx = u0_s4_xMin; gx <= u0_s4_xMax; gx++) {
            const X = u0_s4_pxX(gx);
            ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, H); ctx.stroke();
        }
        for (let gy = u0_s4_yMin; gy <= u0_s4_yMax; gy++) {
            const Y = u0_s4_pyY(gy);
            ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(W, Y); ctx.stroke();
        }
        // Axes.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, u0_s4_pyY(0)); ctx.lineTo(W, u0_s4_pyY(0));
        ctx.moveTo(u0_s4_pxX(0), 0); ctx.lineTo(u0_s4_pxX(0), H);
        ctx.stroke();

        // Tracers: each seed's streamline under the current field. Alternate two
        // theme colours so distinct paths stay legible.
        u0_s4_state.seeds.forEach(function (seed, i) {
            const line = u0_s4_streamline(seed);
            ctx.strokeStyle = (i % 2 === 0) ? accent : alt;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            let started = false;
            line.forEach(function (p) {
                const sx = u0_s4_pxX(p.x), sy = u0_s4_pyY(p.y);
                if (started) ctx.lineTo(sx, sy); else { ctx.moveTo(sx, sy); started = true; }
            });
            ctx.stroke();
            // Mark the seed itself.
            ctx.fillStyle = (i % 2 === 0) ? accent : alt;
            ctx.beginPath();
            ctx.arc(u0_s4_pxX(seed.x), u0_s4_pyY(seed.y), 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Hover probe: the live local derivative vector and its readout.
        if (u0_s4_state.hover) {
            const wx = u0_s4_state.hover.x, wy = u0_s4_state.hover.y;
            const m = u0_s4_f(wx, wy);
            const sx = u0_s4_pxX(wx), sy = u0_s4_pyY(wy);
            if (isFinite(m)) {
                const inv = 1 / Math.sqrt(1 + m * m);
                const len = 34; // pixels each side of the cursor
                const dxp = len * inv;
                const dyp = -len * m * inv; // screen y is inverted
                u0SandboxArrow(ctx, sx - dxp, sy - dyp, sx + dxp, sy + dyp, warm, 2.5);
            }
            ctx.fillStyle = text;
            ctx.beginPath();
            ctx.arc(sx, sy, 3.5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = "13px sans-serif";
            ctx.textAlign = "left";
            const label = "dy/dx = " + (isFinite(m) ? m.toFixed(2) : "∞")
                + "   at (" + wx.toFixed(1) + ", " + wy.toFixed(1) + ")";
            let tx = sx + 12, ty = sy - 12;
            if (tx > W - 200) tx = sx - 200;
            if (ty < 16) ty = sy + 22;
            ctx.fillStyle = bg;
            ctx.fillRect(tx - 4, ty - 13, 196, 18);
            ctx.fillStyle = warm;
            ctx.fillText(label, tx, ty);
        }

        // Count badge.
        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(u0_s4_state.seeds.length + " tracer" + (u0_s4_state.seeds.length === 1 ? "" : "s"), 12, H - 12);
    }

    // Map a pointer event onto canvas-internal pixels (the element is scaled to
    // 100% width by .math-canvas, so the rect and the bitmap differ).
    function u0_s4_eventWorld(evt) {
        const rect = u0_s4_canvas.getBoundingClientRect();
        const px = (evt.clientX - rect.left) * (u0_s4_canvas.width / rect.width);
        const py = (evt.clientY - rect.top) * (u0_s4_canvas.height / rect.height);
        return { x: u0_s4_worldX(px), y: u0_s4_worldY(py) };
    }

    u0_s4_canvas.addEventListener("mousemove", function (evt) {
        u0_s4_state.hover = u0_s4_eventWorld(evt);
    });
    u0_s4_canvas.addEventListener("mouseleave", function () {
        u0_s4_state.hover = null;
    });
    u0_s4_canvas.addEventListener("click", function (evt) {
        u0_s4_state.seeds.push(u0_s4_eventWorld(evt));
    });

    function u0_s4_frame() {
        if (!document.body.contains(u0_s4_canvas)) return; // stop after navigation
        u0_s4_draw();
        requestAnimationFrame(u0_s4_frame);
    }
    requestAnimationFrame(u0_s4_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 5 - State Space Topology Mapper (u0_s5_)

   A 2D phase portrait of the linear first-order system
       x' = k·x − y
       y' = x + k·y
   whose eigenvalues k ± i make the parameter dial k a direct topology control:
   k < 0 is a stable inward spiral, k = 0 is a closed-orbit centre, k > 0 is an
   unstable outward spiral. Dragging the dial rescales and reorients every grid
   vector live, and a cloud of flowing tracer particles makes the global warp of
   the state space visible in motion.
   --------------------------------------------------------------------------- */
function renderStateSpaceTopologySandbox(body) {
    const u0_s5_state = { k: -0.3, particles: [] };

    const u0_s5_intro = document.createElement("p");
    u0_s5_intro.className = "checkpoint-intro";
    u0_s5_intro.textContent = "Turn the k dial to warp the whole state space of x' = k·x − y, y' = x + k·y. Watch the vectors and the drifting particles switch between an inward spiral, a closed orbit, and an outward spiral.";
    body.appendChild(u0_s5_intro);

    const u0_s5_canvas = document.createElement("canvas");
    u0_s5_canvas.width = 480;
    u0_s5_canvas.height = 480;
    u0_s5_canvas.className = "math-canvas";
    body.appendChild(u0_s5_canvas);
    const u0_s5_ctx = u0_s5_canvas.getContext("2d");

    // Regime readout chip.
    const u0_s5_regime = document.createElement("div");
    u0_s5_regime.style.fontFamily = "Consolas, Monaco, monospace";
    u0_s5_regime.style.fontSize = "0.95rem";
    u0_s5_regime.style.fontWeight = "700";
    u0_s5_regime.style.padding = "0.55rem 0.8rem";
    u0_s5_regime.style.margin = "0 0 0.6rem";
    u0_s5_regime.style.background = "var(--bg-color)";
    u0_s5_regime.style.border = "1px solid var(--panel-border)";
    u0_s5_regime.style.borderRadius = "8px";
    u0_s5_regime.style.color = "var(--accent-color)";
    body.appendChild(u0_s5_regime);

    // The k dial.
    const u0_s5_sliderRow = document.createElement("div");
    u0_s5_sliderRow.className = "slider-row";
    const u0_s5_sliderLabel = document.createElement("span");
    u0_s5_sliderLabel.className = "slider-label";
    u0_s5_sliderLabel.textContent = "k =";
    const u0_s5_sliderInput = document.createElement("input");
    u0_s5_sliderInput.type = "range";
    u0_s5_sliderInput.min = "-1.5";
    u0_s5_sliderInput.max = "1.5";
    u0_s5_sliderInput.step = "0.01";
    u0_s5_sliderInput.value = String(u0_s5_state.k);
    const u0_s5_sliderReadout = document.createElement("span");
    u0_s5_sliderReadout.className = "slider-readout";
    u0_s5_sliderReadout.textContent = u0_s5_state.k.toFixed(2);
    u0_s5_sliderInput.addEventListener("input", function () {
        u0_s5_state.k = parseFloat(u0_s5_sliderInput.value);
        u0_s5_sliderReadout.textContent = u0_s5_state.k.toFixed(2);
    });
    u0_s5_sliderRow.appendChild(u0_s5_sliderLabel);
    u0_s5_sliderRow.appendChild(u0_s5_sliderInput);
    u0_s5_sliderRow.appendChild(u0_s5_sliderReadout);
    body.appendChild(u0_s5_sliderRow);

    const u0_s5_R = 4; // world half-extent in x and y
    function u0_s5_pxX(x) { return (x + u0_s5_R) / (2 * u0_s5_R) * u0_s5_canvas.width; }
    function u0_s5_pyY(y) { return u0_s5_canvas.height - (y + u0_s5_R) / (2 * u0_s5_R) * u0_s5_canvas.height; }

    function u0_s5_vel(x, y) {
        const k = u0_s5_state.k;
        return { u: k * x - y, v: x + k * y };
    }

    // Seed the drifting particle cloud across the field.
    function u0_s5_spawn() {
        return {
            x: (Math.random() * 2 - 1) * u0_s5_R,
            y: (Math.random() * 2 - 1) * u0_s5_R,
            age: Math.random() * 120
        };
    }
    for (let i = 0; i < 90; i++) u0_s5_state.particles.push(u0_s5_spawn());

    function u0_s5_regimeText() {
        const k = u0_s5_state.k;
        if (k < -0.04) return "Stable spiral · trajectories spiral inward (k < 0)";
        if (k > 0.04) return "Unstable spiral · trajectories spiral outward (k > 0)";
        return "Centre · closed orbits, neither growing nor decaying (k ≈ 0)";
    }

    function u0_s5_draw() {
        const ctx = u0_s5_ctx;
        const W = u0_s5_canvas.width, H = u0_s5_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const warm = u0SandboxColor("--error-color", "#b3261e");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, u0_s5_pyY(0)); ctx.lineTo(W, u0_s5_pyY(0));
        ctx.moveTo(u0_s5_pxX(0), 0); ctx.lineTo(u0_s5_pxX(0), H);
        ctx.stroke();

        // Grid of field vectors, length scaled by local magnitude (clamped),
        // opacity rising with magnitude so the warp reads at a glance.
        const step = 1.0;
        const pxPerWorld = W / (2 * u0_s5_R);
        for (let gx = -u0_s5_R + 0.5; gx <= u0_s5_R; gx += step) {
            for (let gy = -u0_s5_R + 0.5; gy <= u0_s5_R; gy += step) {
                const f = u0_s5_vel(gx, gy);
                const mag = Math.sqrt(f.u * f.u + f.v * f.v);
                if (mag < 1e-4) continue;
                const draw = Math.min(mag, 2.2) * 0.42 * pxPerWorld; // clamp visual length
                const ux = f.u / mag, uy = f.v / mag;
                const x0 = u0_s5_pxX(gx), y0 = u0_s5_pyY(gy);
                const x1 = x0 + ux * draw, y1 = y0 - uy * draw;
                ctx.globalAlpha = 0.25 + 0.55 * Math.min(mag / 3, 1);
                u0SandboxArrow(ctx, x0, y0, x1, y1, accent, 1.8);
            }
        }
        ctx.globalAlpha = 1;

        // Drifting tracer particles integrate the system, fading with age and
        // respawning, so the topology is alive rather than static.
        const dt = 0.03;
        u0_s5_state.particles.forEach(function (p) {
            const f = u0_s5_vel(p.x, p.y);
            p.x += f.u * dt;
            p.y += f.v * dt;
            p.age += 1;
            if (p.age > 220 || Math.abs(p.x) > u0_s5_R || Math.abs(p.y) > u0_s5_R) {
                const fresh = u0_s5_spawn();
                p.x = fresh.x; p.y = fresh.y; p.age = 0;
            }
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = warm;
            ctx.beginPath();
            ctx.arc(u0_s5_pxX(p.x), u0_s5_pyY(p.y), 2.4, 0, 2 * Math.PI);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("x' = k·x − y,   y' = x + k·y", 12, H - 12);
    }

    function u0_s5_frame() {
        if (!document.body.contains(u0_s5_canvas)) return; // stop after navigation
        u0_s5_regime.textContent = u0_s5_regimeText();
        u0_s5_draw();
        requestAnimationFrame(u0_s5_frame);
    }
    requestAnimationFrame(u0_s5_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 6 - Newton's Law of Cooling Simulator (u0_s6_)

   Graphs the closed-form solution of dT/dt = -k(T - Tm),
       T(t) = Tm + (T0 - Tm) e^(-k t),
   with sliders for ambient temperature Tm, initial temperature T0, and cooling
   rate k. A dashed asymptote anchors at Tm; dragging Tm slides that equilibrium
   line (and the whole curve) up or down live, while a sweeping marker traces the
   body's temperature toward thermal equilibrium.
   --------------------------------------------------------------------------- */
function renderCoolingSimulatorSandbox(body) {
    const u0_s6_state = { Tm: 20, T0: 90, k: 0.25, t: 0 };
    const u0_s6_tMax = 20;

    const u0_s6_intro = document.createElement("p");
    u0_s6_intro.className = "checkpoint-intro";
    u0_s6_intro.textContent = "T(t) = Tm + (T0 − Tm)·e^(−k·t). Slide the ambient line Tm to watch the asymptote and the whole cooling curve shift instantly toward a new equilibrium.";
    body.appendChild(u0_s6_intro);

    const u0_s6_canvas = document.createElement("canvas");
    u0_s6_canvas.width = 600;
    u0_s6_canvas.height = 360;
    u0_s6_canvas.className = "math-canvas";
    body.appendChild(u0_s6_canvas);
    const u0_s6_ctx = u0_s6_canvas.getContext("2d");

    u0SandboxSlider(body, { label: "Tm", min: 0, max: 100, step: 1, value: u0_s6_state.Tm, decimals: 0, suffix: "°",
        onChange: function (v) { u0_s6_state.Tm = v; } });
    u0SandboxSlider(body, { label: "T0", min: 0, max: 100, step: 1, value: u0_s6_state.T0, decimals: 0, suffix: "°",
        onChange: function (v) { u0_s6_state.T0 = v; } });
    u0SandboxSlider(body, { label: "k", min: 0.05, max: 1.0, step: 0.01, value: u0_s6_state.k, decimals: 2,
        onChange: function (v) { u0_s6_state.k = v; } });

    const u0_s6_pad = 42;
    function u0_s6_pxX(t) { return u0_s6_pad + t / u0_s6_tMax * (u0_s6_canvas.width - 2 * u0_s6_pad); }
    function u0_s6_pyY(T) { return (u0_s6_canvas.height - u0_s6_pad) - (T / 100) * (u0_s6_canvas.height - 2 * u0_s6_pad); }
    function u0_s6_T(t) { return u0_s6_state.Tm + (u0_s6_state.T0 - u0_s6_state.Tm) * Math.exp(-u0_s6_state.k * t); }

    function u0_s6_draw() {
        const ctx = u0_s6_ctx;
        const W = u0_s6_canvas.width, H = u0_s6_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const warm = u0SandboxColor("--error-color", "#b3261e");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Axes.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(u0_s6_pad, u0_s6_pyY(0)); ctx.lineTo(W - u0_s6_pad, u0_s6_pyY(0));
        ctx.moveTo(u0_s6_pad, u0_s6_pyY(0)); ctx.lineTo(u0_s6_pad, u0_s6_pyY(100));
        ctx.stroke();
        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "right";
        for (let T = 0; T <= 100; T += 20) {
            ctx.fillText(String(T), u0_s6_pad - 6, u0_s6_pyY(T) + 4);
            ctx.strokeStyle = border;
            ctx.beginPath(); ctx.moveTo(u0_s6_pad, u0_s6_pyY(T)); ctx.lineTo(W - u0_s6_pad, u0_s6_pyY(T)); ctx.stroke();
        }
        ctx.textAlign = "center";
        ctx.fillText("time t", W / 2, H - 8);

        // Ambient asymptote (dashed) - the equilibrium the body cools toward.
        ctx.strokeStyle = warm;
        ctx.setLineDash([6, 5]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(u0_s6_pad, u0_s6_pyY(u0_s6_state.Tm)); ctx.lineTo(W - u0_s6_pad, u0_s6_pyY(u0_s6_state.Tm));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = warm;
        ctx.textAlign = "left";
        ctx.fillText("Tm = " + u0_s6_state.Tm.toFixed(0) + "°", u0_s6_pad + 6, u0_s6_pyY(u0_s6_state.Tm) - 6);

        // Cooling curve.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let i = 0; i <= 300; i++) {
            const t = u0_s6_tMax * i / 300;
            const sx = u0_s6_pxX(t), sy = u0_s6_pyY(u0_s6_T(t));
            if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // Sweeping marker tracing the current temperature.
        const tNow = u0_s6_state.t;
        const mx = u0_s6_pxX(tNow), my = u0_s6_pyY(u0_s6_T(tNow));
        ctx.fillStyle = text;
        ctx.beginPath();
        ctx.arc(mx, my, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = accent;
        ctx.textAlign = "left";
        ctx.font = "13px sans-serif";
        ctx.fillText("T = " + u0_s6_T(tNow).toFixed(1) + "°", 12, 22);
    }

    function u0_s6_frame() {
        if (!document.body.contains(u0_s6_canvas)) return; // stop after navigation
        u0_s6_state.t += 0.05;
        if (u0_s6_state.t > u0_s6_tMax) u0_s6_state.t = 0;
        u0_s6_draw();
        requestAnimationFrame(u0_s6_frame);
    }
    requestAnimationFrame(u0_s6_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 7 - Population & Radioactive Decay Half-Life Dial (u0_s7_)

   Graphs N(t) = N0 e^(r t) for dN/dt = r N, with a master toggle flipping r
   between unbounded growth and proportional decay. In decay mode it overlays the
   geometric half-life lattice - vertical lines at every multiple of t½ = ln2/|r|
   and horizontal lines at N0/2, N0/4, ... - making visible that each halving
   takes the same time no matter the starting amplitude. Growth mode mirrors this
   with the doubling-time lattice.
   --------------------------------------------------------------------------- */
function renderDecayDialSandbox(body) {
    const u0_s7_state = { mode: "decay", rate: 0.25, N0: 60, t: 0 };
    const u0_s7_tMax = 20, u0_s7_Nmax = 100;

    const u0_s7_intro = document.createElement("p");
    u0_s7_intro.className = "checkpoint-intro";
    u0_s7_intro.textContent = "dN/dt = r·N. Flip between growth and decay, then read the lattice: every equal time-step multiplies N by the same factor, so the half-life (or doubling time) is constant regardless of where you start.";
    body.appendChild(u0_s7_intro);

    u0SandboxToggleGroup(body, "Regime",
        [{ value: "decay", label: "Decay (r < 0)" }, { value: "growth", label: "Growth (r > 0)" }],
        function () { return u0_s7_state.mode; },
        function (val) { u0_s7_state.mode = val; });

    const u0_s7_canvas = document.createElement("canvas");
    u0_s7_canvas.width = 600;
    u0_s7_canvas.height = 360;
    u0_s7_canvas.className = "math-canvas";
    body.appendChild(u0_s7_canvas);
    const u0_s7_ctx = u0_s7_canvas.getContext("2d");

    u0SandboxSlider(body, { label: "|r|", min: 0.05, max: 0.6, step: 0.01, value: u0_s7_state.rate, decimals: 2,
        onChange: function (v) { u0_s7_state.rate = v; } });
    u0SandboxSlider(body, { label: "N0", min: 20, max: 90, step: 1, value: u0_s7_state.N0, decimals: 0,
        onChange: function (v) { u0_s7_state.N0 = v; } });

    const u0_s7_pad = 42;
    function u0_s7_pxX(t) { return u0_s7_pad + t / u0_s7_tMax * (u0_s7_canvas.width - 2 * u0_s7_pad); }
    function u0_s7_pyY(N) { return (u0_s7_canvas.height - u0_s7_pad) - (N / u0_s7_Nmax) * (u0_s7_canvas.height - 2 * u0_s7_pad); }
    function u0_s7_r() { return u0_s7_state.mode === "decay" ? -u0_s7_state.rate : u0_s7_state.rate; }
    function u0_s7_N(t) { return u0_s7_state.N0 * Math.exp(u0_s7_r() * t); }

    function u0_s7_draw() {
        const ctx = u0_s7_ctx;
        const W = u0_s7_canvas.width, H = u0_s7_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const alt = u0SandboxColor("--success-color", "#1b7a43");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Axes.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(u0_s7_pad, u0_s7_pyY(0)); ctx.lineTo(W - u0_s7_pad, u0_s7_pyY(0));
        ctx.moveTo(u0_s7_pad, u0_s7_pyY(0)); ctx.lineTo(u0_s7_pad, u0_s7_pyY(u0_s7_Nmax));
        ctx.stroke();
        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("time t", W / 2, H - 8);

        // Geometric lattice: equal-time multiplicative steps.
        const interval = Math.log(2) / u0_s7_state.rate; // t½ or doubling time
        const isDecay = u0_s7_state.mode === "decay";
        ctx.font = "11px sans-serif";
        for (let n = 1; n <= 8; n++) {
            const tn = interval * n;
            if (tn > u0_s7_tMax) break;
            const Nn = isDecay ? u0_s7_state.N0 / Math.pow(2, n) : u0_s7_state.N0 * Math.pow(2, n);
            if (Nn > u0_s7_Nmax * 1.02) break;
            // Vertical step line.
            ctx.strokeStyle = alt;
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(u0_s7_pxX(tn), u0_s7_pyY(0)); ctx.lineTo(u0_s7_pxX(tn), u0_s7_pyY(Nn)); ctx.stroke();
            // Horizontal amplitude line.
            ctx.beginPath(); ctx.moveTo(u0_s7_pad, u0_s7_pyY(Nn)); ctx.lineTo(u0_s7_pxX(tn), u0_s7_pyY(Nn)); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = alt;
            ctx.textAlign = "center";
            ctx.fillText((isDecay ? "t½" : "t×2") + (n > 1 ? "·" + n : ""), u0_s7_pxX(tn), u0_s7_pyY(0) + 16);
        }

        // The curve.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 300; i++) {
            const t = u0_s7_tMax * i / 300;
            const N = u0_s7_N(t);
            if (N > u0_s7_Nmax * 1.05 || N < -1) { started = false; continue; }
            const sx = u0_s7_pxX(t), sy = u0_s7_pyY(N);
            if (started) ctx.lineTo(sx, sy); else { ctx.moveTo(sx, sy); started = true; }
        }
        ctx.stroke();

        // Sweeping marker.
        const mx = u0_s7_pxX(u0_s7_state.t), my = u0_s7_pyY(Math.min(u0_s7_N(u0_s7_state.t), u0_s7_Nmax));
        ctx.fillStyle = text;
        ctx.beginPath(); ctx.arc(mx, my, 6, 0, 2 * Math.PI); ctx.fill();

        // Readout.
        ctx.fillStyle = accent;
        ctx.textAlign = "left";
        ctx.font = "13px sans-serif";
        ctx.fillText((isDecay ? "half-life t½ = " : "doubling t×2 = ") + interval.toFixed(2), 12, 22);
    }

    function u0_s7_frame() {
        if (!document.body.contains(u0_s7_canvas)) return; // stop after navigation
        u0_s7_state.t += 0.05;
        if (u0_s7_state.t > u0_s7_tMax) u0_s7_state.t = 0;
        u0_s7_draw();
        requestAnimationFrame(u0_s7_frame);
    }
    requestAnimationFrame(u0_s7_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 8 - The Integro-Differential Ledger Sandbox (u0_s8_)

   Splits a live fluid tank against a running ledger. The tank obeys the
   first-order balance dV/dt = q - c·V (inflow minus a drain proportional to the
   current volume), integrated in real time. The ledger keeps both books side by
   side: the instantaneous derivative dV/dt right now, and the accumulated
   integral V0 + integral of (q - c·V) dt that history has deposited into the
   current volume, plus the equilibrium V* = q/c the system fills toward.
   --------------------------------------------------------------------------- */
function renderIntegroDifferentialLedgerSandbox(body) {
    const u0_s8_state = { q: 3.0, c: 0.05, V: 20, V0: 20, accum: 0 };
    const u0_s8_Vmax = 100;

    const u0_s8_intro = document.createElement("p");
    u0_s8_intro.className = "checkpoint-intro";
    u0_s8_intro.textContent = "The tank balances inflow against a drain proportional to its own level: dV/dt = q − c·V. The ledger tracks the instantaneous rate and the accumulated integral that together set the current volume.";
    body.appendChild(u0_s8_intro);

    const u0_s8_wrap = document.createElement("div");
    u0_s8_wrap.style.display = "flex";
    u0_s8_wrap.style.flexWrap = "wrap";
    u0_s8_wrap.style.gap = "1rem";
    u0_s8_wrap.style.alignItems = "stretch";
    body.appendChild(u0_s8_wrap);

    const u0_s8_tankCol = document.createElement("div");
    u0_s8_tankCol.style.flex = "0 0 200px";
    u0_s8_tankCol.style.minWidth = "180px";
    const u0_s8_canvas = document.createElement("canvas");
    u0_s8_canvas.width = 200;
    u0_s8_canvas.height = 320;
    u0_s8_canvas.className = "math-canvas";
    u0_s8_tankCol.appendChild(u0_s8_canvas);
    u0_s8_wrap.appendChild(u0_s8_tankCol);
    const u0_s8_ctx = u0_s8_canvas.getContext("2d");

    // The ledger text panel.
    const u0_s8_ledger = document.createElement("div");
    u0_s8_ledger.style.flex = "1 1 300px";
    u0_s8_ledger.style.minWidth = "280px";
    u0_s8_ledger.style.fontFamily = "Consolas, Monaco, monospace";
    u0_s8_ledger.style.fontSize = "0.92rem";
    u0_s8_ledger.style.lineHeight = "1.5";
    u0_s8_ledger.style.whiteSpace = "pre-wrap";
    u0_s8_ledger.style.padding = "1rem";
    u0_s8_ledger.style.background = "var(--bg-color)";
    u0_s8_ledger.style.border = "1px solid var(--panel-border)";
    u0_s8_ledger.style.borderRadius = "10px";
    u0_s8_ledger.style.color = "var(--text-color)";
    u0_s8_wrap.appendChild(u0_s8_ledger);

    u0SandboxSlider(body, { label: "q", min: 0, max: 6, step: 0.1, value: u0_s8_state.q, decimals: 1, suffix: " L/s",
        onChange: function (v) { u0_s8_state.q = v; } });
    u0SandboxSlider(body, { label: "c", min: 0.01, max: 0.12, step: 0.005, value: u0_s8_state.c, decimals: 3,
        onChange: function (v) { u0_s8_state.c = v; } });

    const u0_s8_resetBtn = document.createElement("button");
    u0_s8_resetBtn.type = "button";
    u0_s8_resetBtn.className = "checkpoint-begin-btn";
    u0_s8_resetBtn.textContent = "Empty the tank";
    u0_s8_resetBtn.addEventListener("click", function () {
        u0_s8_state.V = 0; u0_s8_state.V0 = 0; u0_s8_state.accum = 0;
    });
    body.appendChild(u0_s8_resetBtn);

    function u0_s8_draw() {
        const ctx = u0_s8_ctx;
        const W = u0_s8_canvas.width, H = u0_s8_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const alt = u0SandboxColor("--success-color", "#1b7a43");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const tankX = 40, tankY = 30, tankW = W - 80, tankH = H - 70;

        // Water fill (proportional to V).
        const frac = Math.max(0, Math.min(1, u0_s8_state.V / u0_s8_Vmax));
        const waterH = tankH * frac;
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(tankX, tankY + tankH - waterH, tankW, waterH);
        ctx.globalAlpha = 1;

        // Tank walls.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tankX, tankY); ctx.lineTo(tankX, tankY + tankH);
        ctx.lineTo(tankX + tankW, tankY + tankH); ctx.lineTo(tankX + tankW, tankY);
        ctx.stroke();

        // Inflow arrow (top), thickness hints at q.
        ctx.strokeStyle = alt;
        ctx.lineWidth = Math.max(1.5, u0_s8_state.q);
        u0SandboxArrow(ctx, tankX + tankW / 2, 6, tankX + tankW / 2, tankY - 2, alt, Math.max(1.5, u0_s8_state.q));
        // Outflow arrow (bottom), thickness hints at drain c·V.
        const drain = u0_s8_state.c * u0_s8_state.V;
        ctx.lineWidth = Math.max(1.5, drain);
        u0SandboxArrow(ctx, tankX + tankW / 2, tankY + tankH + 2, tankX + tankW / 2, H - 8, sub, Math.max(1.5, drain));

        // Level ticks.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "right";
        for (let lv = 0; lv <= 100; lv += 25) {
            const y = tankY + tankH - tankH * (lv / 100);
            ctx.beginPath(); ctx.moveTo(tankX, y); ctx.lineTo(tankX + 6, y); ctx.stroke();
            ctx.fillText(String(lv), tankX - 3, y + 3);
        }
    }

    function u0_s8_updateLedger() {
        const q = u0_s8_state.q, c = u0_s8_state.c, V = u0_s8_state.V;
        const rate = q - c * V;
        const star = c > 1e-6 ? q / c : Infinity;
        const sign = rate >= 0 ? "+" : "−";
        u0_s8_ledger.textContent =
            "INSTANTANEOUS  (derivative)\n" +
            "  dV/dt = q − c·V\n" +
            "        = " + q.toFixed(1) + " − " + c.toFixed(3) + "·" + V.toFixed(1) + "\n" +
            "        = " + sign + Math.abs(rate).toFixed(2) + " L/s\n\n" +
            "ACCUMULATED  (integral)\n" +
            "  V(t) = V0 + ∫₀ᵗ (q − c·V) dτ\n" +
            "       = " + u0_s8_state.V0.toFixed(1) + " + " + u0_s8_state.accum.toFixed(1) + "\n" +
            "       = " + V.toFixed(1) + " L\n\n" +
            "EQUILIBRIUM\n" +
            "  V* = q / c = " + (isFinite(star) ? star.toFixed(1) + " L" : "∞");
    }

    function u0_s8_frame() {
        if (!document.body.contains(u0_s8_canvas)) return; // stop after navigation
        const dt = 0.05;
        const rate = u0_s8_state.q - u0_s8_state.c * u0_s8_state.V;
        const dV = rate * dt;
        const newV = Math.max(0, Math.min(u0_s8_Vmax, u0_s8_state.V + dV));
        u0_s8_state.accum += (newV - u0_s8_state.V); // realised accumulation = V - V0
        u0_s8_state.V = newV;
        u0_s8_draw();
        u0_s8_updateLedger();
        requestAnimationFrame(u0_s8_frame);
    }
    requestAnimationFrame(u0_s8_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 9 - The Mechanical Spring Parameter Workbench (u0_s9_)

   A live mass-spring-damper, m·y'' + b·y' + k·y = 0, integrated numerically with
   sub-stepping for stability. The left canvas hangs a weight from a coil spring
   that stretches and recoils with y; the right canvas rolls the y(t) time trace.
   Sliders for mass, damping, and stiffness let students slide the discriminant
   b² − 4mk across underdamped, critically damped, and overdamped regimes, with a
   live label naming the current state. The mass auto-replucks when it settles.
   --------------------------------------------------------------------------- */
function renderSpringWorkbenchSandbox(body) {
    const u0_s9_state = { m: 1.0, b: 0.4, k: 6.0, y: 2.0, v: 0, trace: [] };

    const u0_s9_intro = document.createElement("p");
    u0_s9_intro.className = "checkpoint-intro";
    u0_s9_intro.textContent = "m·y″ + b·y′ + k·y = 0. Tune mass, damping, and stiffness to move the discriminant b² − 4mk between underdamped oscillation, critical damping, and overdamped creep.";
    body.appendChild(u0_s9_intro);

    const u0_s9_regime = document.createElement("div");
    u0_s9_regime.style.fontFamily = "Consolas, Monaco, monospace";
    u0_s9_regime.style.fontSize = "0.95rem";
    u0_s9_regime.style.fontWeight = "700";
    u0_s9_regime.style.padding = "0.55rem 0.8rem";
    u0_s9_regime.style.margin = "0 0 0.7rem";
    u0_s9_regime.style.background = "var(--bg-color)";
    u0_s9_regime.style.border = "1px solid var(--panel-border)";
    u0_s9_regime.style.borderRadius = "8px";
    u0_s9_regime.style.color = "var(--accent-color)";
    body.appendChild(u0_s9_regime);

    const u0_s9_wrap = document.createElement("div");
    u0_s9_wrap.style.display = "flex";
    u0_s9_wrap.style.flexWrap = "wrap";
    u0_s9_wrap.style.gap = "1rem";
    body.appendChild(u0_s9_wrap);

    const u0_s9_springCol = document.createElement("div");
    u0_s9_springCol.style.flex = "0 0 180px";
    u0_s9_springCol.style.minWidth = "160px";
    const u0_s9_spring = document.createElement("canvas");
    u0_s9_spring.width = 180;
    u0_s9_spring.height = 320;
    u0_s9_spring.className = "math-canvas";
    u0_s9_springCol.appendChild(u0_s9_spring);
    u0_s9_wrap.appendChild(u0_s9_springCol);

    const u0_s9_plotCol = document.createElement("div");
    u0_s9_plotCol.style.flex = "1 1 320px";
    u0_s9_plotCol.style.minWidth = "300px";
    const u0_s9_plot = document.createElement("canvas");
    u0_s9_plot.width = 420;
    u0_s9_plot.height = 320;
    u0_s9_plot.className = "math-canvas";
    u0_s9_plotCol.appendChild(u0_s9_plot);
    u0_s9_wrap.appendChild(u0_s9_plotCol);

    const u0_s9_sctx = u0_s9_spring.getContext("2d");
    const u0_s9_pctx = u0_s9_plot.getContext("2d");

    u0SandboxSlider(body, { label: "m", min: 0.2, max: 3.0, step: 0.1, value: u0_s9_state.m, decimals: 1,
        onChange: function (v) { u0_s9_state.m = v; } });
    u0SandboxSlider(body, { label: "b", min: 0.0, max: 6.0, step: 0.1, value: u0_s9_state.b, decimals: 1,
        onChange: function (v) { u0_s9_state.b = v; } });
    u0SandboxSlider(body, { label: "k", min: 1.0, max: 14.0, step: 0.1, value: u0_s9_state.k, decimals: 1,
        onChange: function (v) { u0_s9_state.k = v; } });

    const u0_s9_pluckBtn = document.createElement("button");
    u0_s9_pluckBtn.type = "button";
    u0_s9_pluckBtn.className = "checkpoint-begin-btn";
    u0_s9_pluckBtn.textContent = "Pluck the mass";
    u0_s9_pluckBtn.addEventListener("click", function () {
        u0_s9_state.y = 2.0; u0_s9_state.v = 0; u0_s9_state.trace = [];
    });
    body.appendChild(u0_s9_pluckBtn);

    function u0_s9_regimeText() {
        const disc = u0_s9_state.b * u0_s9_state.b - 4 * u0_s9_state.m * u0_s9_state.k;
        if (disc < -0.05) return "Underdamped · oscillates while decaying   (b² − 4mk = " + disc.toFixed(1) + " < 0)";
        if (disc > 0.05) return "Overdamped · creeps back, no oscillation   (b² − 4mk = " + disc.toFixed(1) + " > 0)";
        return "Critically damped · fastest non-oscillating return   (b² − 4mk ≈ 0)";
    }

    function u0_s9_drawSpring() {
        const ctx = u0_s9_sctx;
        const W = u0_s9_spring.width, H = u0_s9_spring.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const text = u0SandboxColor("--text-color", "#1a1a1a");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W / 2;
        const anchorY = 14;
        const restLen = 150;
        const massY = anchorY + restLen + u0_s9_state.y * 34; // y stretches downward
        const massR = 26;

        // Ceiling anchor.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx - 30, anchorY); ctx.lineTo(cx + 30, anchorY); ctx.stroke();

        // Coil spring zig-zag from anchor to the mass.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx, anchorY);
        const coils = 12;
        const topGap = 14, springSpan = (massY - massR) - anchorY - topGap;
        for (let i = 0; i <= coils; i++) {
            const yy = anchorY + topGap + springSpan * i / coils;
            const xx = cx + (i % 2 === 0 ? -16 : 16);
            if (i === coils) ctx.lineTo(cx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();

        // Equilibrium reference line.
        ctx.strokeStyle = sub;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        const eqY = anchorY + restLen;
        ctx.beginPath(); ctx.moveTo(8, eqY); ctx.lineTo(W - 8, eqY); ctx.stroke();
        ctx.setLineDash([]);

        // Mass block.
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(cx, massY, massR, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = bg;
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("m", cx, massY + 4);

        ctx.fillStyle = text;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("y = " + u0_s9_state.y.toFixed(2), 8, H - 8);
    }

    function u0_s9_drawPlot() {
        const ctx = u0_s9_pctx;
        const W = u0_s9_plot.width, H = u0_s9_plot.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const midY = H / 2;
        const amp = H * 0.4 / 2.2; // y up to ~2.2 fits the half-height

        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();

        // Rolling y(t) trace, newest at the right edge.
        const tr = u0_s9_state.trace;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        const n = tr.length;
        for (let i = 0; i < n; i++) {
            const sx = W - (n - 1 - i) * 2; // 2px per sample
            const sy = midY - tr[i] * amp;
            if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("y(t)", 8, 16);
    }

    function u0_s9_step() {
        // Integrate m y'' + b y' + k y = 0 with sub-steps for stiff parameters.
        const sub = 6, dt = 0.03 / sub;
        for (let s = 0; s < sub; s++) {
            const a = -(u0_s9_state.b * u0_s9_state.v + u0_s9_state.k * u0_s9_state.y) / u0_s9_state.m;
            u0_s9_state.v += a * dt;
            u0_s9_state.y += u0_s9_state.v * dt;
        }
        // Auto re-pluck once the motion has essentially settled, so each regime
        // keeps demonstrating itself without the student re-clicking.
        if (Math.abs(u0_s9_state.y) < 0.02 && Math.abs(u0_s9_state.v) < 0.05) {
            u0_s9_state.y = 2.0; u0_s9_state.v = 0;
        }
        u0_s9_state.trace.push(u0_s9_state.y);
        if (u0_s9_state.trace.length > 210) u0_s9_state.trace.shift();
    }

    function u0_s9_frame() {
        if (!document.body.contains(u0_s9_spring)) return; // stop after navigation
        u0_s9_step();
        u0_s9_regime.textContent = u0_s9_regimeText();
        u0_s9_drawSpring();
        u0_s9_drawPlot();
        requestAnimationFrame(u0_s9_frame);
    }
    requestAnimationFrame(u0_s9_frame);
}

/* ============================================================================
   Unit 1 Cluster II sandbox engines

   Three self-contained, ungraded exploration surfaces mounted by
   mountVisualizer, following the exact rules of the Unit 0 cluster above:
     - Every DOM id and the meaningful internal state is namespaced under a
       strict u1_s1_ / u1_s2_ / u1_s3_ prefix, so nothing they create can collide
       in global memory with another engine or another card.
     - All canvas colours are read live from the document's theme custom
       properties via u0SandboxColor at draw time, so Light and Dark both render
       natively and a theme toggle mid-session repaints in place.
     - No fetch, CDN, or remote script loading: each engine runs unchanged from
       the file:// protocol.
     - Animation loops self-terminate once their canvas leaves the DOM (the back
       action empties the container), so navigating away leaves no orphan frames.
   They reuse the shared u0Sandbox* helpers (colour, arrow, toggle group); those
   are generic despite the u0 name, so borrowing them keeps the cluster DRY.
   ============================================================================ */

/* ---------------------------------------------------------------------------
   Sandbox 1 - The Euler's Number Limit Explorer (u1_s1_)

   Graphs (1 + 1/n)^n against n on a logarithmic n-axis spanning five orders of
   magnitude. A horizontal asymptote is drawn at e; the n slider drives a cursor
   that eases along the curve toward that horizon, and live readouts report the
   current value and its shrinking gap to e - the limit made visible.
   --------------------------------------------------------------------------- */
function renderELimitExplorerSandbox(body) {
    const u1_s1_E = Math.E; // 2.718281828...
    const u1_s1_LOG_MIN = 0;    // n = 10^0 = 1
    const u1_s1_LOG_MAX = 5.3;  // n = 10^5.3 ≈ 199526, comfortably past 100,000
    const u1_s1_Y_MIN = 1.9, u1_s1_Y_MAX = 2.82; // brackets 2.0 (n=1) up past e
    const u1_s1_state = {
        targetLog: 0.6,  // slider target, in log10(n)
        dispLog: 0.6     // eased display value the cursor chases toward target
    };

    function u1_s1_value(n) { return Math.pow(1 + 1 / n, n); }

    const u1_s1_intro = document.createElement("p");
    u1_s1_intro.className = "checkpoint-intro";
    u1_s1_intro.textContent = "Slide n across five orders of magnitude to compound ever more finely. Each step pushes (1 + 1/n)^n closer to the horizon line at e ≈ 2.71828 — the absolute limit the value approaches but never reaches.";
    body.appendChild(u1_s1_intro);

    // --- Canvas stage ---
    const u1_s1_canvas = document.createElement("canvas");
    u1_s1_canvas.width = 620;
    u1_s1_canvas.height = 380;
    u1_s1_canvas.className = "math-canvas";
    body.appendChild(u1_s1_canvas);
    const u1_s1_ctx = u1_s1_canvas.getContext("2d");

    // --- n slider (logarithmic), built locally so the readout shows n itself,
    // not the raw log10 the slider rides on. ---
    const u1_s1_sliderRow = document.createElement("div");
    u1_s1_sliderRow.className = "slider-row";
    const u1_s1_sliderLabel = document.createElement("span");
    u1_s1_sliderLabel.className = "slider-label";
    u1_s1_sliderLabel.textContent = "n =";
    const u1_s1_sliderInput = document.createElement("input");
    u1_s1_sliderInput.type = "range";
    u1_s1_sliderInput.min = String(u1_s1_LOG_MIN);
    u1_s1_sliderInput.max = String(u1_s1_LOG_MAX);
    u1_s1_sliderInput.step = "0.01";
    u1_s1_sliderInput.value = String(u1_s1_state.targetLog);
    const u1_s1_sliderReadout = document.createElement("span");
    u1_s1_sliderReadout.className = "slider-readout";
    function u1_s1_fmtN(n) {
        return n >= 1000 ? Math.round(n).toLocaleString() : n.toFixed(n < 10 ? 2 : 0);
    }
    u1_s1_sliderReadout.textContent = u1_s1_fmtN(Math.pow(10, u1_s1_state.targetLog));
    u1_s1_sliderInput.addEventListener("input", function () {
        u1_s1_state.targetLog = parseFloat(u1_s1_sliderInput.value);
        u1_s1_sliderReadout.textContent = u1_s1_fmtN(Math.pow(10, u1_s1_state.targetLog));
    });
    u1_s1_sliderRow.appendChild(u1_s1_sliderLabel);
    u1_s1_sliderRow.appendChild(u1_s1_sliderInput);
    u1_s1_sliderRow.appendChild(u1_s1_sliderReadout);
    body.appendChild(u1_s1_sliderRow);

    // --- Live readout chips: current value, target e, and the closing gap. ---
    const u1_s1_readout = document.createElement("div");
    u1_s1_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s1_readout.style.fontSize = "0.98rem";
    u1_s1_readout.style.fontWeight = "700";
    u1_s1_readout.style.padding = "0.6rem 0.8rem";
    u1_s1_readout.style.marginTop = "0.6rem";
    u1_s1_readout.style.background = "var(--panel-bg)";
    u1_s1_readout.style.border = "1px solid var(--panel-border)";
    u1_s1_readout.style.borderRadius = "8px";
    u1_s1_readout.style.color = "var(--text-color)";
    body.appendChild(u1_s1_readout);

    // --- A small static benchmark table anchoring a few decades of n. ---
    const u1_s1_table = document.createElement("table");
    u1_s1_table.style.width = "100%";
    u1_s1_table.style.marginTop = "0.85rem";
    u1_s1_table.style.borderCollapse = "collapse";
    u1_s1_table.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s1_table.style.fontSize = "0.85rem";
    (function () {
        const head = document.createElement("tr");
        ["n", "(1 + 1/n)^n", "gap to e"].forEach(function (h) {
            const th = document.createElement("th");
            th.textContent = h;
            th.style.textAlign = "left";
            th.style.padding = "0.3rem 0.5rem";
            th.style.borderBottom = "1px solid var(--panel-border)";
            th.style.color = "var(--text-secondary)";
            head.appendChild(th);
        });
        u1_s1_table.appendChild(head);
        [1, 10, 100, 1000, 10000, 100000].forEach(function (n) {
            const v = u1_s1_value(n);
            const tr = document.createElement("tr");
            [n.toLocaleString(), v.toFixed(6), (u1_s1_E - v).toFixed(6)].forEach(function (cell, i) {
                const td = document.createElement("td");
                td.textContent = cell;
                td.style.padding = "0.25rem 0.5rem";
                td.style.borderBottom = "1px solid var(--panel-border)";
                td.style.color = i === 0 ? "var(--accent-color)" : "var(--text-color)";
                tr.appendChild(td);
            });
            u1_s1_table.appendChild(tr);
        });
    })();
    body.appendChild(u1_s1_table);

    // --- Drawing ---
    function u1_s1_draw() {
        const ctx = u1_s1_ctx;
        const W = u1_s1_canvas.width, H = u1_s1_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const padL = 52, padR = 24, padT = 22, padB = 40;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        function pxX(L) { return padL + (L - u1_s1_LOG_MIN) / (u1_s1_LOG_MAX - u1_s1_LOG_MIN) * plotW; }
        function pxY(v) { return padT + (u1_s1_Y_MAX - v) / (u1_s1_Y_MAX - u1_s1_Y_MIN) * plotH; }

        // Horizontal value gridlines + labels.
        ctx.font = "11px sans-serif";
        ctx.textAlign = "right";
        for (let gy = 2.0; gy <= 2.8; gy += 0.2) {
            const Y = pxY(gy);
            ctx.strokeStyle = border;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padL, Y);
            ctx.lineTo(W - padR, Y);
            ctx.stroke();
            ctx.fillStyle = sub;
            ctx.fillText(gy.toFixed(1), padL - 8, Y + 4);
        }

        // Vertical decade gridlines + labels (n = 1, 10, 100, ...).
        ctx.textAlign = "center";
        const decadeLabels = ["1", "10", "100", "1k", "10k", "100k"];
        for (let d = 0; d <= 5; d++) {
            const X = pxX(d);
            ctx.strokeStyle = border;
            ctx.beginPath();
            ctx.moveTo(X, padT);
            ctx.lineTo(X, H - padB);
            ctx.stroke();
            ctx.fillStyle = sub;
            ctx.fillText(decadeLabels[d], X, H - padB + 16);
        }
        ctx.fillStyle = sub;
        ctx.fillText("n  (logarithmic)", padL + plotW / 2, H - 6);

        // The asymptote line at e (dashed accent) with a label.
        const eY = pxY(u1_s1_E);
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padL, eY);
        ctx.lineTo(W - padR, eY);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = accent;
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillText("e ≈ 2.71828", padL + 6, eY - 6);

        // The curve (1 + 1/n)^n sampled across the log axis.
        ctx.strokeStyle = text;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        const STEPS = 240;
        for (let i = 0; i <= STEPS; i++) {
            const L = u1_s1_LOG_MIN + (u1_s1_LOG_MAX - u1_s1_LOG_MIN) * (i / STEPS);
            const v = u1_s1_value(Math.pow(10, L));
            const X = pxX(L), Y = pxY(v);
            if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // The eased cursor: a vertical guide plus a dot on the curve.
        const curN = Math.pow(10, u1_s1_state.dispLog);
        const curV = u1_s1_value(curN);
        const cx = pxX(u1_s1_state.dispLog), cy = pxY(curV);
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, padT);
        ctx.lineTo(cx, H - padB);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = good;
        ctx.beginPath();
        ctx.arc(cx, cy, 6.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = bg;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function u1_s1_syncReadout() {
        const n = Math.pow(10, u1_s1_state.dispLog);
        const v = u1_s1_value(n);
        u1_s1_readout.innerHTML = "";
        const line1 = document.createElement("div");
        line1.textContent = "(1 + 1/" + u1_s1_fmtN(n) + ")^" + u1_s1_fmtN(n) + "  =  " + v.toFixed(6);
        line1.style.color = "var(--text-color)";
        const line2 = document.createElement("div");
        line2.textContent = "gap to e  =  " + (u1_s1_E - v).toFixed(6);
        line2.style.color = "var(--accent-color)";
        line2.style.marginTop = "0.2rem";
        u1_s1_readout.appendChild(line1);
        u1_s1_readout.appendChild(line2);
    }

    function u1_s1_frame() {
        if (!document.body.contains(u1_s1_canvas)) return; // stop after navigation
        // Ease the display value toward the slider target so the cursor visibly
        // travels toward the horizon rather than snapping.
        u1_s1_state.dispLog += (u1_s1_state.targetLog - u1_s1_state.dispLog) * 0.12;
        u1_s1_draw();
        u1_s1_syncReadout();
        requestAnimationFrame(u1_s1_frame);
    }
    requestAnimationFrame(u1_s1_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 2 - Complex Rotation & Euler's Identity Sandbox (u1_s2_)

   A complex plane with a unit circle. A θ slider (or a click on the plane) sets
   the angle; the engine eases a vector from the origin to e^(iθ) = cos θ + i sin θ
   on the circle, dropping dashed projections onto the real and imaginary axes so
   the live cosine and sine readouts map straight onto Euler's formula. A play
   toggle rotates θ continuously to trace the full wrap.
   --------------------------------------------------------------------------- */
function renderComplexRotationPlaneSandbox(body) {
    const u1_s2_TWO_PI = Math.PI * 2;
    const u1_s2_state = {
        targetTheta: Math.PI / 4,
        dispTheta: Math.PI / 4,
        playing: false
    };

    // Keep an angle in [0, 2π) for clean readouts.
    function u1_s2_norm(a) {
        a = a % u1_s2_TWO_PI;
        return a < 0 ? a + u1_s2_TWO_PI : a;
    }

    const u1_s2_wrap = document.createElement("div");
    u1_s2_wrap.style.display = "flex";
    u1_s2_wrap.style.flexWrap = "wrap";
    u1_s2_wrap.style.gap = "1rem";
    u1_s2_wrap.style.alignItems = "stretch";

    const u1_s2_controls = document.createElement("div");
    u1_s2_controls.style.flex = "1 1 240px";
    u1_s2_controls.style.minWidth = "240px";
    u1_s2_controls.style.padding = "1rem";
    u1_s2_controls.style.background = "var(--panel-bg)";
    u1_s2_controls.style.border = "1px solid var(--panel-border)";
    u1_s2_controls.style.borderRadius = "10px";

    const u1_s2_stage = document.createElement("div");
    u1_s2_stage.style.flex = "1 1 320px";
    u1_s2_stage.style.minWidth = "300px";

    u1_s2_wrap.appendChild(u1_s2_controls);
    u1_s2_wrap.appendChild(u1_s2_stage);
    body.appendChild(u1_s2_wrap);

    const u1_s2_intro = document.createElement("p");
    u1_s2_intro.className = "checkpoint-intro";
    u1_s2_intro.textContent = "Set the angle θ with the slider, or click anywhere on the plane. The vector tracks e^(iθ) around the unit circle while its shadows on the axes read off cos θ (real) and sin θ (imaginary).";
    u1_s2_controls.appendChild(u1_s2_intro);

    // θ slider, built locally so the readout reports radians directly.
    const u1_s2_sliderRow = document.createElement("div");
    u1_s2_sliderRow.className = "slider-row";
    const u1_s2_sliderLabel = document.createElement("span");
    u1_s2_sliderLabel.className = "slider-label";
    u1_s2_sliderLabel.textContent = "θ =";
    const u1_s2_sliderInput = document.createElement("input");
    u1_s2_sliderInput.type = "range";
    u1_s2_sliderInput.min = "0";
    u1_s2_sliderInput.max = String(u1_s2_TWO_PI);
    u1_s2_sliderInput.step = "0.01";
    u1_s2_sliderInput.value = String(u1_s2_state.targetTheta);
    const u1_s2_sliderReadout = document.createElement("span");
    u1_s2_sliderReadout.className = "slider-readout";
    u1_s2_sliderReadout.textContent = u1_s2_state.targetTheta.toFixed(2) + " rad";
    u1_s2_sliderInput.addEventListener("input", function () {
        u1_s2_state.targetTheta = parseFloat(u1_s2_sliderInput.value);
        u1_s2_sliderReadout.textContent = u1_s2_state.targetTheta.toFixed(2) + " rad";
    });
    u1_s2_sliderRow.appendChild(u1_s2_sliderLabel);
    u1_s2_sliderRow.appendChild(u1_s2_sliderInput);
    u1_s2_sliderRow.appendChild(u1_s2_sliderReadout);
    u1_s2_controls.appendChild(u1_s2_sliderRow);

    // Play/pause auto-rotation.
    const u1_s2_playBtn = document.createElement("button");
    u1_s2_playBtn.type = "button";
    u1_s2_playBtn.className = "checkpoint-begin-btn";
    u1_s2_playBtn.style.marginTop = "0.6rem";
    u1_s2_playBtn.textContent = "Play rotation";
    u1_s2_playBtn.addEventListener("click", function () {
        u1_s2_state.playing = !u1_s2_state.playing;
        u1_s2_playBtn.textContent = u1_s2_state.playing ? "Pause rotation" : "Play rotation";
    });
    u1_s2_controls.appendChild(u1_s2_playBtn);

    // Live e^(iθ) readout chip.
    const u1_s2_readout = document.createElement("div");
    u1_s2_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s2_readout.style.fontSize = "0.95rem";
    u1_s2_readout.style.fontWeight = "700";
    u1_s2_readout.style.padding = "0.6rem 0.8rem";
    u1_s2_readout.style.marginTop = "0.85rem";
    u1_s2_readout.style.background = "var(--bg-color)";
    u1_s2_readout.style.border = "1px solid var(--panel-border)";
    u1_s2_readout.style.borderRadius = "8px";
    u1_s2_controls.appendChild(u1_s2_readout);

    // Euler's identity callout, highlighted as θ passes π.
    const u1_s2_identity = document.createElement("div");
    u1_s2_identity.style.fontSize = "0.86rem";
    u1_s2_identity.style.marginTop = "0.6rem";
    u1_s2_identity.style.color = "var(--text-secondary)";
    u1_s2_identity.textContent = "At θ = π the vector lands on −1: e^(iπ) + 1 = 0, Euler's identity.";
    u1_s2_controls.appendChild(u1_s2_identity);

    // --- Square canvas stage ---
    const u1_s2_canvas = document.createElement("canvas");
    u1_s2_canvas.width = 460;
    u1_s2_canvas.height = 460;
    u1_s2_canvas.className = "math-canvas";
    u1_s2_canvas.style.cursor = "crosshair";
    u1_s2_stage.appendChild(u1_s2_canvas);
    const u1_s2_ctx = u1_s2_canvas.getContext("2d");

    // A click sets θ from the angle of the pointer about the centre.
    u1_s2_canvas.addEventListener("click", function (ev) {
        const rect = u1_s2_canvas.getBoundingClientRect();
        const mx = (ev.clientX - rect.left) * (u1_s2_canvas.width / rect.width);
        const my = (ev.clientY - rect.top) * (u1_s2_canvas.height / rect.height);
        const cx = u1_s2_canvas.width / 2, cy = u1_s2_canvas.height / 2;
        // Canvas y grows downward, so negate to get the math-plane angle.
        const ang = u1_s2_norm(Math.atan2(-(my - cy), mx - cx));
        u1_s2_state.targetTheta = ang;
        u1_s2_state.playing = false;
        u1_s2_playBtn.textContent = "Play rotation";
        u1_s2_sliderInput.value = String(ang);
        u1_s2_sliderReadout.textContent = ang.toFixed(2) + " rad";
    });

    function u1_s2_draw() {
        const ctx = u1_s2_ctx;
        const W = u1_s2_canvas.width, H = u1_s2_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const warm = u0SandboxColor("--error-color", "#b3261e");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W / 2, cy = H / 2;
        const R = Math.min(W, H) * 0.36; // unit-circle radius in pixels

        // Axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(20, cy); ctx.lineTo(W - 20, cy);
        ctx.moveTo(cx, 20); ctx.lineTo(cx, H - 20);
        ctx.stroke();

        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Real", W - 44, cy - 8);
        ctx.textAlign = "center";
        ctx.fillText("Imaginary", cx + 44, 22);
        // Unit ticks at ±1 on both axes.
        ctx.textAlign = "center";
        ctx.fillText("1", cx + R, cy + 16);
        ctx.fillText("−1", cx - R, cy + 16);
        ctx.textAlign = "right";
        ctx.fillText("i", cx - 8, cy - R + 4);
        ctx.fillText("−i", cx - 8, cy + R + 4);

        // Unit circle.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, 2 * Math.PI);
        ctx.stroke();

        const th = u1_s2_state.dispTheta;
        const c = Math.cos(th), s = Math.sin(th);
        const px = cx + c * R, py = cy - s * R;

        // Swept-angle arc from the positive real axis.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 0.28, 0, -u1_s2_norm(th), true);
        ctx.stroke();

        // Dashed projections onto the axes.
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = good;            // cosine -> real axis
        ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(px, cy);
        ctx.stroke();
        ctx.strokeStyle = warm;            // sine -> imaginary axis
        ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(cx, py);
        ctx.stroke();
        ctx.restore();

        // Component markers on the axes.
        ctx.fillStyle = good;
        ctx.beginPath(); ctx.arc(px, cy, 4, 0, 2 * Math.PI); ctx.fill();
        ctx.fillStyle = warm;
        ctx.beginPath(); ctx.arc(cx, py, 4, 0, 2 * Math.PI); ctx.fill();

        // The e^(iθ) vector and its tip.
        u0SandboxArrow(ctx, cx, cy, px, py, accent, 3);
        ctx.fillStyle = text;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = bg;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function u1_s2_syncReadout() {
        const th = u1_s2_norm(u1_s2_state.dispTheta);
        const c = Math.cos(th), s = Math.sin(th);
        u1_s2_readout.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "e^(iθ) = cos θ + i·sin θ";
        l1.style.color = "var(--accent-color)";
        const l2 = document.createElement("div");
        l2.textContent = "= " + c.toFixed(3) + " + " + s.toFixed(3) + " i";
        l2.style.color = "var(--text-color)";
        l2.style.marginTop = "0.2rem";
        const l3 = document.createElement("div");
        l3.textContent = "θ = " + th.toFixed(3) + " rad  (" + (th * 180 / Math.PI).toFixed(1) + "°)";
        l3.style.color = "var(--text-secondary)";
        l3.style.marginTop = "0.2rem";
        u1_s2_readout.appendChild(l1);
        u1_s2_readout.appendChild(l2);
        u1_s2_readout.appendChild(l3);

        // Highlight the identity callout when the vector is near −1.
        const nearPi = Math.abs(u1_s2_norm(th) - Math.PI) < 0.06;
        u1_s2_identity.style.color = nearPi ? "var(--accent-color)" : "var(--text-secondary)";
        u1_s2_identity.style.fontWeight = nearPi ? "700" : "400";
    }

    function u1_s2_frame() {
        if (!document.body.contains(u1_s2_canvas)) return; // stop after navigation
        if (u1_s2_state.playing) {
            u1_s2_state.targetTheta = u1_s2_norm(u1_s2_state.targetTheta + 0.012);
            u1_s2_state.dispTheta = u1_s2_state.targetTheta;
            u1_s2_sliderInput.value = String(u1_s2_state.targetTheta);
            u1_s2_sliderReadout.textContent = u1_s2_state.targetTheta.toFixed(2) + " rad";
        } else {
            // Ease toward the target along the shorter arc.
            let diff = u1_s2_state.targetTheta - u1_s2_state.dispTheta;
            while (diff > Math.PI) diff -= u1_s2_TWO_PI;
            while (diff < -Math.PI) diff += u1_s2_TWO_PI;
            u1_s2_state.dispTheta += diff * 0.15;
        }
        u1_s2_draw();
        u1_s2_syncReadout();
        requestAnimationFrame(u1_s2_frame);
    }
    requestAnimationFrame(u1_s2_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 3 - The Log-Linear Scaling Matrix (u1_s3_)

   Plots four benchmark growth laws - linear, quadratic, exponential, and
   logarithmic - over a shared positive domain, then lets a toggle group switch
   the coordinate space between Cartesian, semi-log (log y), and log-log (log x
   and y). The exponential straightens on semi-log; the power law straightens on
   log-log: each scaling law reveals its signature line. No animation loop runs;
   the surface repaints on demand, so it is inherently file:// and teardown safe.
   --------------------------------------------------------------------------- */
function renderLogLinearWarpSandbox(body) {
    const u1_s3_X_MIN = 0.1, u1_s3_X_MAX = 10;
    const u1_s3_state = { mode: "cartesian" };
    const u1_s3_funcs = [
        { key: "linear", label: "y = x", color: "--accent-color", on: true, f: function (x) { return x; } },
        { key: "quad", label: "y = x²", color: "--success-color", on: true, f: function (x) { return x * x; } },
        { key: "exp", label: "y = 2ˣ", color: "--error-color", on: true, f: function (x) { return Math.pow(2, x); } },
        { key: "log", label: "y = ln x", color: "--locked-color", on: true, f: function (x) { return Math.log(x); } }
    ];

    const u1_s3_modeText = {
        cartesian: "Linear axes. The exponential 2ˣ rockets off the top while the power law x² curves upward; only y = x is straight.",
        semilog: "Log y-axis. The exponential 2ˣ straightens into a line — equal ratios become equal steps — while the power law and the line bend.",
        loglog: "Log–log axes. The power law x² straightens into a line of slope 2; the exponential now curves away. Each law shows its signature."
    };

    const u1_s3_wrap = document.createElement("div");
    u1_s3_wrap.style.display = "flex";
    u1_s3_wrap.style.flexWrap = "wrap";
    u1_s3_wrap.style.gap = "1rem";
    u1_s3_wrap.style.alignItems = "stretch";

    const u1_s3_controls = document.createElement("div");
    u1_s3_controls.style.flex = "1 1 240px";
    u1_s3_controls.style.minWidth = "240px";
    u1_s3_controls.style.padding = "1rem";
    u1_s3_controls.style.background = "var(--panel-bg)";
    u1_s3_controls.style.border = "1px solid var(--panel-border)";
    u1_s3_controls.style.borderRadius = "10px";

    const u1_s3_stage = document.createElement("div");
    u1_s3_stage.style.flex = "2 1 340px";
    u1_s3_stage.style.minWidth = "300px";

    u1_s3_wrap.appendChild(u1_s3_controls);
    u1_s3_wrap.appendChild(u1_s3_stage);
    body.appendChild(u1_s3_wrap);

    const u1_s3_intro = document.createElement("p");
    u1_s3_intro.className = "checkpoint-intro";
    u1_s3_intro.textContent = "Switch the coordinate space and watch each growth law re-resolve. A straight line on the right axis exposes the hidden architecture of a transcendental curve.";
    u1_s3_controls.appendChild(u1_s3_intro);

    // Coordinate-space toggle (reuses the shared theme-bound toggle group).
    u0SandboxToggleGroup(u1_s3_controls, "Coordinate space",
        [{ value: "cartesian", label: "Cartesian" }, { value: "semilog", label: "Semi-Log" }, { value: "loglog", label: "Log-Log" }],
        function () { return u1_s3_state.mode; },
        function (val) { u1_s3_state.mode = val; u1_s3_syncNote(); u1_s3_draw(); });

    // Per-function visibility legend with colour swatches.
    const u1_s3_legendTitle = document.createElement("div");
    u1_s3_legendTitle.textContent = "Curves";
    u1_s3_legendTitle.style.fontSize = "0.78rem";
    u1_s3_legendTitle.style.fontWeight = "700";
    u1_s3_legendTitle.style.textTransform = "uppercase";
    u1_s3_legendTitle.style.letterSpacing = "0.04em";
    u1_s3_legendTitle.style.color = "var(--text-secondary)";
    u1_s3_legendTitle.style.margin = "0.4rem 0";
    u1_s3_controls.appendChild(u1_s3_legendTitle);

    u1_s3_funcs.forEach(function (fn) {
        const rowL = document.createElement("label");
        rowL.style.display = "flex";
        rowL.style.alignItems = "center";
        rowL.style.gap = "0.5rem";
        rowL.style.padding = "0.25rem 0";
        rowL.style.cursor = "pointer";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = fn.on;
        cb.addEventListener("change", function () { fn.on = cb.checked; u1_s3_draw(); });

        const swatch = document.createElement("span");
        swatch.style.display = "inline-block";
        swatch.style.width = "18px";
        swatch.style.height = "3px";
        swatch.style.borderRadius = "2px";
        swatch.style.background = "var(" + fn.color + ")";

        const txt = document.createElement("span");
        txt.textContent = fn.label;
        txt.style.fontFamily = "Consolas, Monaco, monospace";
        txt.style.color = "var(--text-color)";

        rowL.appendChild(cb);
        rowL.appendChild(swatch);
        rowL.appendChild(txt);
        u1_s3_controls.appendChild(rowL);
    });

    const u1_s3_note = document.createElement("div");
    u1_s3_note.style.fontSize = "0.86rem";
    u1_s3_note.style.marginTop = "0.85rem";
    u1_s3_note.style.color = "var(--text-secondary)";
    u1_s3_controls.appendChild(u1_s3_note);
    function u1_s3_syncNote() { u1_s3_note.textContent = u1_s3_modeText[u1_s3_state.mode]; }
    u1_s3_syncNote();

    const u1_s3_canvas = document.createElement("canvas");
    u1_s3_canvas.width = 600;
    u1_s3_canvas.height = 460;
    u1_s3_canvas.className = "math-canvas";
    u1_s3_stage.appendChild(u1_s3_canvas);
    const u1_s3_ctx = u1_s3_canvas.getContext("2d");

    function u1_s3_draw() {
        const ctx = u1_s3_ctx;
        const W = u1_s3_canvas.width, H = u1_s3_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const padL = 50, padR = 20, padT = 20, padB = 38;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        const mode = u1_s3_state.mode;
        const logX = (mode === "loglog");
        const logY = (mode === "semilog" || mode === "loglog");

        // World ranges depend on the active space.
        const xMin = logX ? 0.1 : 0, xMax = u1_s3_X_MAX;
        const yMin = logY ? 0.1 : 0, yMax = logY ? 2000 : 25;
        const lxMin = Math.log10(0.1), lxMax = Math.log10(xMax);
        const lyMin = Math.log10(yMin), lyMax = Math.log10(yMax);

        function pxX(x) {
            const t = logX
                ? (Math.log10(x) - lxMin) / (lxMax - lxMin)
                : (x - xMin) / (xMax - xMin);
            return padL + t * plotW;
        }
        function pxY(y) {
            const t = logY
                ? (Math.log10(y) - lyMin) / (lyMax - lyMin)
                : (y - yMin) / (yMax - yMin);
            return padT + (1 - t) * plotH;
        }

        // --- Gridlines + axis labels ---
        ctx.font = "11px sans-serif";
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;

        // X gridlines.
        ctx.textAlign = "center";
        if (logX) {
            for (let d = -1; d <= 1; d++) {            // decades 0.1, 1, 10
                const base = Math.pow(10, d);
                for (let m = 1; m <= 9; m++) {
                    const x = base * m;
                    if (x < 0.1 - 1e-9 || x > xMax + 1e-9) continue;
                    const X = pxX(x);
                    ctx.strokeStyle = (m === 1) ? border : u0SandboxColor("--accent-soft", "#eee");
                    ctx.beginPath(); ctx.moveTo(X, padT); ctx.lineTo(X, H - padB); ctx.stroke();
                    if (m === 1) { ctx.fillStyle = sub; ctx.fillText(String(x), X, H - padB + 16); }
                }
            }
        } else {
            for (let x = 0; x <= xMax + 1e-9; x += 2) {
                const X = pxX(x);
                ctx.strokeStyle = border;
                ctx.beginPath(); ctx.moveTo(X, padT); ctx.lineTo(X, H - padB); ctx.stroke();
                ctx.fillStyle = sub; ctx.fillText(String(x), X, H - padB + 16);
            }
        }

        // Y gridlines.
        ctx.textAlign = "right";
        if (logY) {
            for (let d = -1; d <= 3; d++) {            // decades 0.1 .. 1000
                const base = Math.pow(10, d);
                for (let m = 1; m <= 9; m++) {
                    const y = base * m;
                    if (y < yMin - 1e-9 || y > yMax + 1e-9) continue;
                    const Y = pxY(y);
                    ctx.strokeStyle = (m === 1) ? border : u0SandboxColor("--accent-soft", "#eee");
                    ctx.beginPath(); ctx.moveTo(padL, Y); ctx.lineTo(W - padR, Y); ctx.stroke();
                    if (m === 1) { ctx.fillStyle = sub; ctx.fillText(String(y), padL - 8, Y + 4); }
                }
            }
        } else {
            for (let y = 0; y <= yMax + 1e-9; y += 5) {
                const Y = pxY(y);
                ctx.strokeStyle = border;
                ctx.beginPath(); ctx.moveTo(padL, Y); ctx.lineTo(W - padR, Y); ctx.stroke();
                ctx.fillStyle = sub; ctx.fillText(String(y), padL - 8, Y + 4);
            }
        }

        // Axis titles.
        ctx.fillStyle = sub;
        ctx.textAlign = "center";
        ctx.fillText("x" + (logX ? "  (log)" : ""), padL + plotW / 2, H - 4);
        ctx.save();
        ctx.translate(12, padT + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("y" + (logY ? "  (log)" : ""), 0, 0);
        ctx.restore();

        // --- Curves ---
        const STEPS = 300;
        u1_s3_funcs.forEach(function (fn) {
            if (!fn.on) return;
            ctx.strokeStyle = u0SandboxColor(fn.color, "#888");
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            let drawing = false;
            for (let i = 0; i <= STEPS; i++) {
                // Sample evenly in screen-x: log-spaced when the x-axis is log.
                const t = i / STEPS;
                const x = logX
                    ? Math.pow(10, lxMin + t * (lxMax - lxMin))
                    : xMin + t * (xMax - xMin);
                if (x <= 0) { drawing = false; continue; }
                const y = fn.f(x);
                // A log axis can only show positive values; break the path on any
                // sample that falls outside the drawable range so the curve simply
                // begins where it becomes representable.
                if (!isFinite(y) || (logY && y <= 0)) { drawing = false; continue; }
                const X = pxX(x), Y = pxY(y);
                if (Y < padT - 4000 || Y > H - padB + 4000) { drawing = false; continue; }
                if (!drawing) { ctx.moveTo(X, Y); drawing = true; } else { ctx.lineTo(X, Y); }
            }
            ctx.stroke();
        });

        // Clip overflow outside the plot box so steep linear-mode curves stay tidy.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(padL, padT, plotW, plotH);
    }

    u1_s3_draw();

    // This surface has no animation loop (it repaints only on user input), so a
    // Light/Dark toggle made while it sits idle would otherwise keep stale colours
    // until the next interaction. Watch the root theme attribute and repaint in
    // place; disconnect once the canvas leaves the DOM so nothing lingers.
    const u1_s3_themeWatch = new MutationObserver(function () {
        if (!document.body.contains(u1_s3_canvas)) { u1_s3_themeWatch.disconnect(); return; }
        u1_s3_draw();
    });
    u1_s3_themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* Renders any KaTeX inside an element, mirroring the quiz engine and checkpoint
   widgets: inline math is wrapped in single dollar signs and display math in
   double dollar signs. Safe to call when the auto render script is absent. */
function renderPracticeMath(el) {
    if (typeof renderMathInElement === "function") {
        renderMathInElement(el, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "\\[", right: "\\]", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false }
            ],
            // Multi-unit content: never let one bad token blank the whole view;
            // KaTeX renders the offending span in red instead of throwing.
            throwOnError: false
        });
    }
}

/* The Practice Set sub-view for a single unit, the second level of the
   directory. Renders a back button to the Practice Sets index, the unit title,
   an action row with the cheat sheet PDF download, a Practice Problems section
   drawn from PRACTICE_DATA, and a Solutions section that stays hidden behind a
   toggle so the answers do not spoil the practice. Units without practice data
   yet show a short coming soon note in each section. */
function renderPracticeSetDetail(container, unitIndex) {
    container.innerHTML = "";

    const unitData = CURRICULUM[unitIndex];
    const practice = PRACTICE_DATA[unitIndex];
    const problems = (practice && practice.problems) || [];

    // Back button to the Practice Sets index.
    const nav = document.createElement("div");
    nav.className = "unit-detail-nav";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-toc-btn";
    backBtn.textContent = "Back to Practice Sets";
    backBtn.addEventListener("click", function () {
        window.location.hash = "practice-sets";
    });

    nav.appendChild(backBtn);
    container.appendChild(nav);

    // Unit title header.
    const intro = document.createElement("div");
    intro.className = "toc-intro";

    const heading = document.createElement("h1");
    heading.className = "toc-heading";
    heading.textContent = unitData.unit;

    const sub = document.createElement("p");
    sub.className = "toc-subhead";
    sub.textContent = "Work the problems first, then reveal the solutions when you are ready.";

    intro.appendChild(heading);
    intro.appendChild(sub);
    container.appendChild(intro);

    // Action row: open the unit practice set PDF in a new tab.
    const actionRow = document.createElement("div");
    actionRow.className = "practice-action-row";

    const download = document.createElement("a");
    download.className = "pdf-download-btn";
    download.href = "assets/pdfs/Unit-" + unitIndex + "-Practice-Set.pdf";
    download.target = "_blank";
    download.rel = "noopener";
    download.textContent = "Open Unit " + unitIndex + " Practice Set (PDF)";
    actionRow.appendChild(download);
    container.appendChild(actionRow);

    // Practice Problems section, rendered from PRACTICE_DATA as an ordered list.
    const problemsSection = document.createElement("section");
    problemsSection.className = "practice-set-section";

    const problemsHeader = document.createElement("h2");
    problemsHeader.className = "module-title";
    problemsHeader.textContent = "Practice Problems";
    problemsSection.appendChild(problemsHeader);

    if (problems.length) {
        const list = document.createElement("ol");
        list.className = "practice-problem-list";
        problems.forEach(function (item) {
            const li = document.createElement("li");
            li.className = "practice-problem";
            li.textContent = item.problem;
            list.appendChild(li);
        });
        problemsSection.appendChild(list);
    } else {
        const note = document.createElement("p");
        note.className = "static-page-placeholder";
        note.textContent = "Practice problems for this unit are coming soon.";
        problemsSection.appendChild(note);
    }
    container.appendChild(problemsSection);

    // Solutions section, hidden by default behind a toggle so the answers stay
    // out of sight until the student chooses to see them.
    const solutionsSection = document.createElement("section");
    solutionsSection.className = "practice-set-section";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "pdf-download-btn";
    toggleBtn.textContent = "View Solutions";

    const solutionsBody = document.createElement("div");
    solutionsBody.className = "practice-set-solutions";
    solutionsBody.hidden = true;

    const solutionsHeader = document.createElement("h2");
    solutionsHeader.className = "module-title";
    solutionsHeader.textContent = "Solutions";
    solutionsBody.appendChild(solutionsHeader);

    if (problems.length) {
        const solList = document.createElement("ol");
        solList.className = "practice-solution-list";
        problems.forEach(function (item) {
            const li = document.createElement("li");
            li.className = "practice-solution";
            li.textContent = item.solution;
            solList.appendChild(li);
        });
        solutionsBody.appendChild(solList);
    } else {
        const note = document.createElement("p");
        note.className = "static-page-placeholder";
        note.textContent = "Solutions for this unit are coming soon.";
        solutionsBody.appendChild(note);
    }

    toggleBtn.addEventListener("click", function () {
        solutionsBody.hidden = !solutionsBody.hidden;
        toggleBtn.textContent = solutionsBody.hidden ? "View Solutions" : "Hide Solutions";
    });

    solutionsSection.appendChild(toggleBtn);
    solutionsSection.appendChild(solutionsBody);
    container.appendChild(solutionsSection);

    // Render all KaTeX in the problems and solutions in one pass.
    renderPracticeMath(container);
}

/* The Quizzes Index route, the top level of a two level directory. A grid of
   19 unit cards, each linking to that unit's quizzes sub-view where the micro
   practice and the unit mastery quiz live together. */
function renderQuizzesIndex(container) {
    buildIndexShell(container, "Quizzes Index",
        "Pick a unit to open its quizzes. Each unit gathers the micro practice for every video and its unit mastery quiz.");

    const grid = document.createElement("div");
    grid.className = "toc-grid";

    CURRICULUM.forEach(function (unitData, index) {
        const card = document.createElement("div");
        card.className = "materials-card";

        const title = document.createElement("h3");
        title.className = "materials-card-title";
        title.textContent = unitData.unit;
        card.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "materials-card-desc";
        desc.textContent = unitData.description;
        card.appendChild(desc);

        const open = document.createElement("a");
        open.className = "pdf-download-btn";
        open.href = "#quizzes-index-" + index;
        open.textContent = "View Unit Quizzes";
        card.appendChild(open);

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/* The Quizzes sub-view for a single unit, the second level of the directory.
   Renders a back button to the Quizzes Index, then a responsive grid of micro
   practice launch cards, one per video that has a quiz, and finally the unit
   mastery launch card. Every card reuses the same quiz id as the unit detail
   view (micro::<video_id> and mastery::<unit title>), so a student's progress
   stays perfectly in sync whichever surface they open. */
function renderUnitQuizzesDetail(container, unitIndex) {
    container.innerHTML = "";

    const unitData = CURRICULUM[unitIndex];

    const nav = document.createElement("div");
    nav.className = "unit-detail-nav";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-toc-btn";
    backBtn.textContent = "Back to Quizzes Index";
    backBtn.addEventListener("click", function () {
        window.location.hash = "quizzes-index";
    });

    nav.appendChild(backBtn);
    container.appendChild(nav);

    const intro = document.createElement("div");
    intro.className = "toc-intro";

    const heading = document.createElement("h1");
    heading.className = "toc-heading";
    heading.textContent = unitData.unit;

    const sub = document.createElement("p");
    sub.className = "toc-subhead";
    sub.textContent = "Micro practice for each video, and the unit mastery quiz at the bottom.";

    intro.appendChild(heading);
    intro.appendChild(sub);
    container.appendChild(intro);

    // One micro practice launch card per video that carries a quiz. Omitting
    // the inline flag gives the launch card surface, which opens the modal
    // runner, matching the unit mastery card on the same page.
    const microGrid = document.createElement("div");
    microGrid.className = "toc-grid";

    unitData.modules.forEach(function (moduleData) {
        moduleData.videos.forEach(function (video) {
            const microItems = QUIZ_DATA.micro_practice[video.video_id];
            if (!microItems || !microItems.length) return;

            const host = document.createElement("div");
            host.className = "video-quiz-host";
            QuizEngine.mount(host, {
                id: "micro::" + video.video_id,
                title: video.title,
                intro: "Five quick checks on this video. A wrong choice gives you a guiding question, not the answer.",
                items: microItems
            });
            microGrid.appendChild(host);
        });
    });

    container.appendChild(microGrid);

    // The unit mastery quiz, anchored at the bottom below all the micro cards.
    const mastery = QUIZ_DATA.unit_mastery[unitData.unit];
    if (mastery && mastery.length) {
        const masteryHost = document.createElement("div");
        masteryHost.className = "unit-mastery-host";
        QuizEngine.mount(masteryHost, {
            id: "mastery::" + unitData.unit,
            title: "Unit Mastery Quiz",
            intro: "Thirty questions across the whole unit. Track your score, and let any missed question point you back to its module.",
            items: mastery
        });
        container.appendChild(masteryHost);
    }
}

/* The Table of Contents view: a grid of unit cards, each showing its title,
   description, and watched progress. */
function renderTableOfContents(container) {
    container.innerHTML = "";

    const watched = ODEState.getWatchedVideos();

    const intro = document.createElement("div");
    intro.className = "toc-intro";

    const heading = document.createElement("h2");
    heading.className = "toc-heading";
    heading.textContent = "Table of Contents";

    const subhead = document.createElement("p");
    subhead.className = "toc-subhead";
    subhead.textContent = "Choose a unit to begin. Each card shows how far you have come.";

    intro.appendChild(heading);
    intro.appendChild(subhead);
    container.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "toc-grid";

    CURRICULUM.forEach(function (unitData, index) {
        grid.appendChild(buildUnitCard(unitData, index, watched));
    });

    container.appendChild(grid);
}

/* One clickable unit card for the Table of Contents. */
function buildUnitCard(unitData, index, watched) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "toc-card";

    const title = document.createElement("h3");
    title.className = "toc-card-title";
    title.textContent = unitData.unit;

    const desc = document.createElement("p");
    desc.className = "toc-card-desc";
    desc.textContent = unitData.description;

    const progress = unitProgress(unitData, watched);

    const track = document.createElement("div");
    track.className = "toc-card-progress-track";

    const fill = document.createElement("div");
    fill.className = "toc-card-progress-fill";
    fill.style.width = progress.percentage + "%";
    track.appendChild(fill);

    const label = document.createElement("span");
    label.className = "toc-card-progress-label";
    label.textContent = progress.percentage + "% watched (" + progress.watchedCount + " of " + progress.totalVideos + " videos)";

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(track);
    card.appendChild(label);

    card.addEventListener("click", function () {
        window.location.hash = "unit-" + index;
    });

    return card;
}

/* The Unit Detail view: only the selected unit, with a persistent button
   back to the Table of Contents above its content. */
function renderUnitDetail(container, unitIndex) {
    container.innerHTML = "";

    const watched = ODEState.getWatchedVideos();
    const unitData = CURRICULUM[unitIndex];

    const nav = document.createElement("div");
    nav.className = "unit-detail-nav";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-toc-btn";
    backBtn.textContent = "Back to Table of Contents";
    backBtn.addEventListener("click", function () {
        window.location.hash = "";
    });

    nav.appendChild(backBtn);
    container.appendChild(nav);

    const unitSection = document.createElement("section");
    unitSection.className = "unit-section";

    const unitHeader = document.createElement("div");
    unitHeader.className = "unit-header";

    const unitTitle = document.createElement("h2");
    unitTitle.className = "unit-title";
    unitTitle.textContent = unitData.unit;

    const unitDesc = document.createElement("p");
    unitDesc.className = "unit-desc";
    unitDesc.textContent = unitData.description;

    unitHeader.appendChild(unitTitle);
    unitHeader.appendChild(unitDesc);
    unitSection.appendChild(unitHeader);

    const moduleList = document.createElement("div");
    moduleList.className = "unit-modules";

    // Start at this unit's global offset so Guided Pathway locking stays
    // consistent with the full module sequence across all units.
    let flatIndex = unitFlatOffset(unitIndex);
    unitData.modules.forEach(function (moduleData) {
        moduleList.appendChild(buildModuleSection(moduleData, flatIndex, watched));
        flatIndex++;
    });

    unitSection.appendChild(moduleList);

    // Unit Mastery quiz, thirty questions, anchored at the bottom of the
    // unit container after all of its modules.
    const mastery = QUIZ_DATA.unit_mastery[unitData.unit];
    if (mastery && mastery.length) {
        const masteryHost = document.createElement("div");
        masteryHost.className = "unit-mastery-host";
        QuizEngine.mount(masteryHost, {
            id: "mastery::" + unitData.unit,
            title: "Unit Mastery Quiz",
            intro: "Thirty questions across the whole unit. Track your score, and let any missed question point you back to its module.",
            items: mastery
        });
        unitSection.appendChild(masteryHost);
    }

    // Master reference guide, the closing action of every unit detail page. It
    // opens the unit master reference guide PDF in a new tab, the single document
    // that gathers the cheat sheet, the practice problems, and the worked solutions.
    const materials = AVAILABLE_MATERIALS[unitIndex];
    if (materials && materials.file) {
        const resourceRow = document.createElement("div");
        resourceRow.className = "unit-master-resource-row";

        const guideLink = document.createElement("a");
        guideLink.className = "pdf-download-btn";
        guideLink.href = "assets/pdfs/Unit-" + unitIndex + "-Reference-Guide.pdf";
        guideLink.target = "_blank";
        guideLink.rel = "noopener";
        guideLink.textContent = "View Full Unit Reference Guide (Cheat Sheet, Problems, and Solutions)";

        resourceRow.appendChild(guideLink);
        unitSection.appendChild(resourceRow);
    }

    container.appendChild(unitSection);
}

function buildModuleSection(moduleData, flatIndex, watched) {
    const unlocked = ODEModes.isModuleUnlocked(flatIndex);

    const section = document.createElement("article");
    section.className = "module-section" + (unlocked ? "" : " locked");

    const header = document.createElement("div");
    header.className = "module-header";

    const title = document.createElement("h3");
    title.className = "module-title";
    title.textContent = moduleData.module;

    const status = document.createElement("span");
    status.className = "module-status";
    if (!unlocked) {
        status.textContent = "Locked, complete the previous checkpoint to continue";
    } else if (ODEState.isCheckpointPassed(moduleData.module)) {
        status.textContent = "Checkpoint passed";
        status.classList.add("passed");
    } else {
        status.textContent = "Open";
    }

    header.appendChild(title);
    header.appendChild(status);
    section.appendChild(header);

    if (unlocked) {
        const videoList = document.createElement("ul");
        videoList.className = "video-list";

        moduleData.videos.forEach(function (video) {
            const item = document.createElement("li");
            item.className = "video-card";

            const title = document.createElement("p");
            title.className = "video-title";
            title.textContent = video.title;

            // Responsive 16:9 wrapper holding the inline YouTube player, so the
            // student watches in place instead of leaving for a new tab.
            const playerWrap = document.createElement("div");
            playerWrap.className = "video-embed";

            const iframe = document.createElement("iframe");
            iframe.src = "https://www.youtube.com/embed/" + video.video_id;
            iframe.title = video.title;
            iframe.loading = "lazy";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.setAttribute("frameborder", "0");
            playerWrap.appendChild(iframe);

            // Subtle fallback for anyone who prefers the full site experience.
            const fallback = document.createElement("a");
            fallback.className = "video-fallback-link";
            fallback.href = "https://www.youtube.com/watch?v=" + video.video_id;
            fallback.target = "_blank";
            fallback.rel = "noopener";
            fallback.textContent = "Watch on YouTube";

            const watchLabel = document.createElement("label");
            watchLabel.className = "video-watched-toggle";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = watched.includes(video.video_id);
            checkbox.addEventListener("change", function () {
                ODEState.setVideoWatched(video.video_id, checkbox.checked);
                updateProgressBanner();
            });

            watchLabel.appendChild(checkbox);
            watchLabel.appendChild(document.createTextNode(" Mark as watched"));

            // Micro Practice for this specific video. When it exists, the video
            // and its quiz sit in a two column split so the student can watch on
            // the left and practice on the right at the same time. Without a
            // quiz, the video content keeps the full card width.
            const microItems = QUIZ_DATA.micro_practice[video.video_id];
            if (microItems && microItems.length) {
                const split = document.createElement("div");
                split.className = "video-lesson-split";

                const main = document.createElement("div");
                main.className = "video-lesson-main";
                main.appendChild(title);
                main.appendChild(playerWrap);
                main.appendChild(fallback);
                main.appendChild(watchLabel);

                const microHost = document.createElement("div");
                microHost.className = "video-quiz-host";
                QuizEngine.mount(microHost, {
                    id: "micro::" + video.video_id,
                    title: "Micro Practice",
                    intro: "Five quick checks on this video. A wrong choice gives you a guiding question, not the answer.",
                    items: microItems,
                    inline: true
                });

                split.appendChild(main);
                split.appendChild(microHost);
                item.appendChild(split);
            } else {
                item.appendChild(title);
                item.appendChild(playerWrap);
                item.appendChild(fallback);
                item.appendChild(watchLabel);
            }

            videoList.appendChild(item);
        });

        section.appendChild(videoList);

        const checkpointPanel = document.createElement("div");
        checkpointPanel.className = "checkpoint-panel";
        CheckpointRegistry.render(moduleData.interactive_checkpoint, checkpointPanel, moduleData);
        section.appendChild(checkpointPanel);
    }

    return section;
}

function updateProgressBanner() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    if (!progressBar || !progressText) return;

    const totalVideos = ALL_MODULES.reduce(function (sum, m) { return sum + m.videos.length; }, 0);
    const watchedCount = ODEState.getWatchedVideos().length;
    const percentage = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

    progressBar.style.width = percentage + "%";
    progressText.textContent = percentage + "% (" + watchedCount + " of " + totalVideos + " videos)";
}

document.addEventListener("DOMContentLoaded", renderCurriculum);

// Switching views through the hash redraws and returns the reader to the top.
// The mode toggle and checkpoint pass call renderCurriculum directly and keep
// their own scroll position, so this listener handles only view navigation.
window.addEventListener("hashchange", function () {
    renderCurriculum();
    window.scrollTo(0, 0);
});
