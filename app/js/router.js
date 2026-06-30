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
    },
    {
        id: "unit_1_piecewise_continuity",
        unitNumber: 1,
        isSandbox: true,
        title: "The Piecewise Transition & Continuity Lab",
        blurb: "Manipulate the boundaries and coefficients of piecewise functions to manually stitch discontinuous lines into smooth, differentiable tracks.",
        render: renderPiecewiseContinuitySandbox
    },
    {
        id: "unit_1_taylor_polynomial_machinery",
        unitNumber: 1,
        isSandbox: true,
        title: "The Taylor Series Convergence Engine",
        blurb: "Dial up the polynomial order of a Maclaurin/Taylor expansion to watch static power series morph and snap to local transcendental curves.",
        render: renderTaylorMachinerySandbox
    },
    {
        id: "unit_1_inverse_operator_boundaries",
        unitNumber: 1,
        isSandbox: true,
        title: "The Operator & Inverse Function Constraint Matrix",
        blurb: "Probe input-output mappings across non-monotonic functions to visualize why domain restrictions are required to establish valid algebraic inverses.",
        render: renderInverseOperatorSandbox
    },
    {
        id: "unit_1_exponential_growth_ceiling",
        unitNumber: 1,
        isSandbox: true,
        title: "The Exponential Growth Ceiling Lab",
        blurb: "Compare the growth rates of polynomial power terms against dominant exponential functions to track how e^x outpaces any algebraic bound.",
        render: renderExponentialCeilingSandbox
    },
    {
        id: "unit_1_logarithmic_bounds",
        unitNumber: 1,
        isSandbox: true,
        title: "The Logarithmic Domain & Growth Barrier",
        blurb: "Visualize the severe horizontal slowing of ln(x) alongside its vertical asymptotic drop at the origin to ground domain-safety constraints.",
        render: renderLogarithmicBoundsSandbox
    },
    {
        id: "unit_1_difference_quotient_geometry",
        unitNumber: 1,
        isSandbox: true,
        title: "The Secant-to-Tangent Difference Quotient Matrix",
        blurb: "Drive a secant interval width Δx down to absolute zero to witness the geometric crystallization of a local instantaneous derivative vector.",
        render: renderDifferenceQuotientSandbox
    },
    {
        id: "unit_1_prerequisite_matrix",
        unitNumber: 1,
        isSandbox: true,
        title: "The Prerequisite Function Reference Matrix",
        blurb: "A unified operational dashboard to audit, compare, and visualize the domain restrictions, ranges, and derivative fields of all core benchmark functions.",
        render: renderPrerequisiteMatrixSandbox
    }
];

/* Cluster III: the first three fully built Unit 2 sandbox engines, mapping the
   first-order linear toolkit. Same contract as the Unit 0/1 clusters - each
   carries a stable string id (keys the mounted host so inner ids never collide),
   a render(body) that builds a live ungraded surface, and a strict
   u2_s1_ / u2_s2_ / u2_s3_ DOM-and-state namespace. They read every colour live
   from the active theme's CSS custom properties (Light and Dark both render
   natively), issue zero network calls (file:// safe), and their animation loops
   self-terminate once their canvas leaves the DOM. Render functions are declared
   lower in the file; function declarations hoist, so this is safe. */
const UNIT_2_SANDBOXES = [
    {
        id: "unit_2_integrating_factor_builder",
        unitNumber: 2,
        isSandbox: true,
        title: "The Integrating Factor Product Engine",
        blurb: "Visualize how multiplying a linear equation by μ(x) collapses an un-solvable differential sum into a pristine, integrable Product Rule derivative.",
        render: renderIntegratingFactorBuilderSandbox
    },
    {
        id: "unit_2_linear_slope_threader",
        unitNumber: 2,
        isSandbox: true,
        title: "Linear Slope Field & Solution Threader",
        blurb: "Probe a dynamic slope field for y' + P(x)y = Q(x) and drop interactive tracer seeds to map particular solution trajectories.",
        render: renderLinearSlopeThreaderSandbox
    },
    {
        id: "unit_2_general_particular_decomposition",
        unitNumber: 2,
        isSandbox: true,
        title: "Transient vs. Steady-State Decomposition Matrix",
        blurb: "Slide the constant of integration C across a live graph to decouple static steady-state solutions from vanishing transient behaviors.",
        render: renderGeneralParticularDecompositionSandbox
    },
    {
        id: "unit_2_exact_differential_surfaces",
        unitNumber: 2,
        isSandbox: true,
        title: "Exact Equations & Conservative Vector Fields",
        blurb: "Map out the total differential grid of M(x,y)dx + N(x,y)dy = 0 to visualize how the test for exactness forces cross-partials to form a conservative potential surface.",
        render: renderExactDifferentialSurfacesSandbox
    },
    {
        id: "unit_2_substitution_transformation_warp",
        unitNumber: 2,
        isSandbox: true,
        title: "Non-Linear Substitution & Transformation Warp",
        blurb: "Watch complex nonlinear curves (Bernoulli/Homogeneous) collapse into standard linear trajectories via live algebraic variable substitutions (v = y^(1-n) or v = y/x).",
        render: renderSubstitutionTransformationWarpSandbox
    },
    {
        id: "unit_2_existence_uniqueness_breakdown",
        unitNumber: 2,
        isSandbox: true,
        title: "Picard’s Theorem Existence & Uniqueness Boundary",
        blurb: "Stress-test non-lipschitz first-order initial value conditions to witness the geometric tearing of solution curves where existence or uniqueness breaks down.",
        render: renderExistenceUniquenessBreakdownSandbox
    },
    {
        id: "unit_2_velocity_drag_terminal",
        unitNumber: 2,
        isSandbox: true,
        title: "Velocity Drag & Terminal Velocity Thresholds",
        blurb: "Adjust mass parameters and non-linear drag coefficients to track how falling bodies asymptotically converge onto their terminal physical velocity limits.",
        render: renderVelocityDragTerminalSandbox
    },
    {
        id: "unit_2_compartment_mixing_ledger",
        unitNumber: 2,
        isSandbox: true,
        title: "Multi-Chamber Mixing Compartment Ledger",
        blurb: "Balance volumetric inflow concentrations against proportional outflow rates within a live fluid ledger tracking total salt accumulation history.",
        render: renderCompartmentMixingLedgerSandbox
    },
    {
        id: "unit_2_logistic_population_saturation",
        unitNumber: 2,
        isSandbox: true,
        title: "The Logistic Population Carrying Capacity Lab",
        blurb: "Manipulate intrinsic growth coefficients and structural carrying capacities to witness how populations stabilize or drop toward environmental equilibriums.",
        render: renderLogisticPopulationSaturationSandbox
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

    // Unit 2's fully built Cluster III engines. Same 900 + index sandbox band as
    // the Unit 0/1 clusters, so they sort within Unit 2 behind the graded modules
    // and ahead of any generic placeholder tail (999), reading as the unit's
    // leading open-ended cluster.
    UNIT_2_SANDBOXES.forEach(function (vis, idx) {
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

/* ---------------------------------------------------------------------------
   Sandbox 4 - The Piecewise Transition & Continuity Lab (u1_s4_)

   A fixed quadratic branch q(x) = 0.5·x² holds the right side (x ≥ c). The
   student drives the left linear branch L(x) = m·x + b and the boundary c to
   stitch the two together. Two conditions are checked live at the seam:
     value continuity   L(c) = q(c)
     differentiability  L'(c) = q'(c)  ->  m = c   (since q'(x) = x)
   The junction is painted green when smooth, accent when it is a continuous
   corner, and warm red when the branches leave a jump. No animation loop runs;
   the surface repaints on input and on a Light/Dark toggle.
   --------------------------------------------------------------------------- */
function renderPiecewiseContinuitySandbox(body) {
    const u1_s4_Q = 0.5;               // fixed quadratic coefficient, q(x) = 0.5 x^2
    const u1_s4_TOL = 0.05;            // seam tolerance for the continuity checks
    const u1_s4_state = { m: 1.0, b: -0.5, c: 1.0 };
    const u1_s4_xMin = -4, u1_s4_xMax = 4, u1_s4_yMin = -3, u1_s4_yMax = 9;

    function u1_s4_lin(x) { return u1_s4_state.m * x + u1_s4_state.b; }
    function u1_s4_quad(x) { return u1_s4_Q * x * x; }

    const u1_s4_wrap = document.createElement("div");
    u1_s4_wrap.style.display = "flex";
    u1_s4_wrap.style.flexWrap = "wrap";
    u1_s4_wrap.style.gap = "1rem";
    u1_s4_wrap.style.alignItems = "stretch";

    const u1_s4_controls = document.createElement("div");
    u1_s4_controls.style.flex = "1 1 240px";
    u1_s4_controls.style.minWidth = "240px";
    u1_s4_controls.style.padding = "1rem";
    u1_s4_controls.style.background = "var(--panel-bg)";
    u1_s4_controls.style.border = "1px solid var(--panel-border)";
    u1_s4_controls.style.borderRadius = "10px";

    const u1_s4_stage = document.createElement("div");
    u1_s4_stage.style.flex = "2 1 340px";
    u1_s4_stage.style.minWidth = "300px";

    u1_s4_wrap.appendChild(u1_s4_controls);
    u1_s4_wrap.appendChild(u1_s4_stage);
    body.appendChild(u1_s4_wrap);

    const u1_s4_intro = document.createElement("p");
    u1_s4_intro.className = "checkpoint-intro";
    u1_s4_intro.textContent = "The right branch is fixed at q(x) = ½x². Move the line L(x) = m·x + b and the boundary c to stitch it onto the curve — first close the gap (continuity), then match the slopes (differentiability).";
    u1_s4_controls.appendChild(u1_s4_intro);

    const u1_s4_mSlider = u0SandboxSlider(u1_s4_controls, {
        label: "slope  m =", min: -3, max: 3, step: 0.05, value: u1_s4_state.m, decimals: 2,
        onChange: function (v) { u1_s4_state.m = v; u1_s4_draw(); }
    });
    const u1_s4_bSlider = u0SandboxSlider(u1_s4_controls, {
        label: "shift  b =", min: -4, max: 4, step: 0.05, value: u1_s4_state.b, decimals: 2,
        onChange: function (v) { u1_s4_state.b = v; u1_s4_draw(); }
    });
    const u1_s4_cSlider = u0SandboxSlider(u1_s4_controls, {
        label: "boundary  c =", min: -3, max: 3, step: 0.05, value: u1_s4_state.c, decimals: 2,
        onChange: function (v) { u1_s4_state.c = v; u1_s4_draw(); }
    });

    // One-tap solve: for the current c, the smooth fit is m = c, b = −½c².
    const u1_s4_snap = document.createElement("button");
    u1_s4_snap.type = "button";
    u1_s4_snap.className = "checkpoint-begin-btn";
    u1_s4_snap.style.marginTop = "0.6rem";
    u1_s4_snap.textContent = "Snap line to a smooth seam";
    u1_s4_snap.addEventListener("click", function () {
        const c = u1_s4_state.c;
        u1_s4_state.m = c;
        u1_s4_state.b = -u1_s4_Q * c * c;
        u1_s4_mSlider.setValue(Math.round(u1_s4_state.m * 20) / 20);
        u1_s4_bSlider.setValue(Math.round(u1_s4_state.b * 20) / 20);
        u1_s4_draw();
    });
    u1_s4_controls.appendChild(u1_s4_snap);

    const u1_s4_readout = document.createElement("div");
    u1_s4_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s4_readout.style.fontSize = "0.88rem";
    u1_s4_readout.style.fontWeight = "700";
    u1_s4_readout.style.padding = "0.6rem 0.8rem";
    u1_s4_readout.style.marginTop = "0.85rem";
    u1_s4_readout.style.background = "var(--bg-color)";
    u1_s4_readout.style.border = "1px solid var(--panel-border)";
    u1_s4_readout.style.borderRadius = "8px";
    u1_s4_controls.appendChild(u1_s4_readout);

    const u1_s4_canvas = document.createElement("canvas");
    u1_s4_canvas.width = 600;
    u1_s4_canvas.height = 420;
    u1_s4_canvas.className = "math-canvas";
    u1_s4_stage.appendChild(u1_s4_canvas);
    const u1_s4_ctx = u1_s4_canvas.getContext("2d");

    // Continuity / differentiability test at the current seam.
    function u1_s4_test() {
        const c = u1_s4_state.c;
        const Lc = u1_s4_lin(c), Qc = u1_s4_quad(c);
        const dVal = Lc - Qc;
        const m1 = u1_s4_state.m, m2 = c; // q'(c) = c
        const dSlope = m1 - m2;
        const continuous = Math.abs(dVal) < u1_s4_TOL;
        const differentiable = continuous && Math.abs(dSlope) < u1_s4_TOL;
        return { c: c, Lc: Lc, Qc: Qc, dVal: dVal, m1: m1, m2: m2, dSlope: dSlope, continuous: continuous, differentiable: differentiable };
    }

    function u1_s4_draw() {
        const ctx = u1_s4_ctx;
        const W = u1_s4_canvas.width, H = u1_s4_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const warm = u0SandboxColor("--error-color", "#b3261e");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const padL = 44, padR = 18, padT = 16, padB = 30;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        function pxX(x) { return padL + (x - u1_s4_xMin) / (u1_s4_xMax - u1_s4_xMin) * plotW; }
        function pxY(y) { return padT + (u1_s4_yMax - y) / (u1_s4_yMax - u1_s4_yMin) * plotH; }

        // Grid + axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        for (let gx = u1_s4_xMin; gx <= u1_s4_xMax; gx++) {
            const X = pxX(gx);
            ctx.beginPath(); ctx.moveTo(X, padT); ctx.lineTo(X, H - padB); ctx.stroke();
            if (gx !== 0) ctx.fillText(String(gx), X, pxY(0) + 12);
        }
        ctx.textAlign = "right";
        for (let gy = -2; gy <= 8; gy += 2) {
            const Y = pxY(gy);
            ctx.beginPath(); ctx.moveTo(padL, Y); ctx.lineTo(W - padR, Y); ctx.stroke();
            ctx.fillText(String(gy), padL - 6, Y + 3);
        }
        // Bold axes.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(padL, pxY(0)); ctx.lineTo(W - padR, pxY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pxX(0), padT); ctx.lineTo(pxX(0), H - padB); ctx.stroke();

        const c = u1_s4_state.c;
        // Boundary line at x = c (dashed accent).
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(pxX(c), padT); ctx.lineTo(pxX(c), H - padB); ctx.stroke();
        ctx.restore();

        // Linear branch, x < c.
        ctx.strokeStyle = text;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 240; i++) {
            const x = u1_s4_xMin + (c - u1_s4_xMin) * (i / 240);
            const X = pxX(x), Y = pxY(u1_s4_lin(x));
            if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // Quadratic branch, x >= c (drawn in accent so the two pieces read apart).
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        started = false;
        for (let i = 0; i <= 240; i++) {
            const x = c + (u1_s4_xMax - c) * (i / 240);
            const X = pxX(x), Y = pxY(u1_s4_quad(x));
            if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // Junction marker(s).
        const t = u1_s4_test();
        const seamColor = t.differentiable ? good : (t.continuous ? accent : warm);
        if (!t.continuous) {
            // A visible jump: mark both branch endpoints and a dashed gap between.
            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = warm;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(pxX(c), pxY(t.Lc)); ctx.lineTo(pxX(c), pxY(t.Qc)); ctx.stroke();
            ctx.restore();
            [t.Lc, t.Qc].forEach(function (yv) {
                ctx.fillStyle = warm;
                ctx.beginPath(); ctx.arc(pxX(c), pxY(yv), 5.5, 0, 2 * Math.PI); ctx.fill();
            });
        } else {
            ctx.fillStyle = seamColor;
            ctx.beginPath(); ctx.arc(pxX(c), pxY(t.Qc), 7, 0, 2 * Math.PI); ctx.fill();
            ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
        }

        // Legend.
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillStyle = text;
        ctx.fillText("L(x) = m·x + b   (x < c)", padL + 6, padT + 14);
        ctx.fillStyle = accent;
        ctx.fillText("q(x) = ½x²   (x ≥ c)", padL + 6, padT + 30);

        u1_s4_syncReadout(t);
    }

    function u1_s4_syncReadout(t) {
        u1_s4_readout.innerHTML = "";
        function line(txt, ok) {
            const d = document.createElement("div");
            d.textContent = txt;
            d.style.color = ok ? "var(--success-color)" : "var(--error-color)";
            d.style.marginTop = "0.18rem";
            return d;
        }
        const head = document.createElement("div");
        head.textContent = t.differentiable ? "✓ Smooth (differentiable)"
            : (t.continuous ? "△ Continuous, but a corner" : "✕ Discontinuous (jump)");
        head.style.color = t.differentiable ? "var(--success-color)"
            : (t.continuous ? "var(--accent-color)" : "var(--error-color)");
        head.style.marginBottom = "0.3rem";
        u1_s4_readout.appendChild(head);
        u1_s4_readout.appendChild(line("value:  L(c)=" + t.Lc.toFixed(2) + "  q(c)=" + t.Qc.toFixed(2) + "  Δ=" + t.dVal.toFixed(2), t.continuous));
        u1_s4_readout.appendChild(line("slope:  m₁=" + t.m1.toFixed(2) + "  m₂=" + t.m2.toFixed(2) + "  Δ=" + t.dSlope.toFixed(2), t.differentiable));
    }

    u1_s4_draw();

    // No animation loop here; repaint on a Light/Dark toggle so idle colours stay
    // current. The observer disconnects once the canvas leaves the DOM.
    const u1_s4_themeWatch = new MutationObserver(function () {
        if (!document.body.contains(u1_s4_canvas)) { u1_s4_themeWatch.disconnect(); return; }
        u1_s4_draw();
    });
    u1_s4_themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* ---------------------------------------------------------------------------
   Sandbox 5 - The Taylor Series Convergence Engine (u1_s5_)

   Graphs a transcendental base (sin, cos, or eˣ) and its Maclaurin polynomial
   (centre 0) up to a slider-set degree. When the degree changes, the new term's
   coefficients ease in from zero, so the partial sum visibly grows and snaps onto
   the curve. A shaded band on the x-axis marks the interval where the polynomial
   stays within tolerance of the true function, widening as the order climbs.
   --------------------------------------------------------------------------- */
function renderTaylorMachinerySandbox(body) {
    const u1_s5_MAXDEG = 10;
    const u1_s5_xMin = -6, u1_s5_xMax = 6, u1_s5_yMin = -4, u1_s5_yMax = 4;
    const u1_s5_state = {
        kind: "sin",
        degree: 3,
        target: [],   // target Maclaurin coefficients for the current kind+degree
        disp: []      // eased display coefficients the curve is drawn from
    };

    // Factorials 0..MAXDEG, computed once.
    const u1_s5_FACT = (function () {
        const f = [1];
        for (let k = 1; k <= u1_s5_MAXDEG; k++) f.push(f[k - 1] * k);
        return f;
    })();

    function u1_s5_base(x) {
        if (u1_s5_state.kind === "exp") return Math.exp(x);
        if (u1_s5_state.kind === "cos") return Math.cos(x);
        return Math.sin(x);
    }

    // Maclaurin coefficients (index = power of x) for the active base up to deg.
    function u1_s5_targetCoeffs(deg) {
        const c = [];
        for (let k = 0; k <= u1_s5_MAXDEG; k++) c.push(0);
        for (let k = 0; k <= deg; k++) {
            if (u1_s5_state.kind === "exp") {
                c[k] = 1 / u1_s5_FACT[k];
            } else if (u1_s5_state.kind === "sin") {
                if (k % 2 === 1) { const j = (k - 1) / 2; c[k] = Math.pow(-1, j) / u1_s5_FACT[k]; }
            } else { // cos
                if (k % 2 === 0) { const j = k / 2; c[k] = Math.pow(-1, j) / u1_s5_FACT[k]; }
            }
        }
        return c;
    }

    function u1_s5_poly(x) {
        // Horner over the eased display coefficients.
        let acc = 0;
        for (let k = u1_s5_MAXDEG; k >= 0; k--) acc = acc * x + u1_s5_state.disp[k];
        return acc;
    }

    function u1_s5_retarget() { u1_s5_state.target = u1_s5_targetCoeffs(u1_s5_state.degree); }

    const u1_s5_wrap = document.createElement("div");
    u1_s5_wrap.style.display = "flex";
    u1_s5_wrap.style.flexWrap = "wrap";
    u1_s5_wrap.style.gap = "1rem";
    u1_s5_wrap.style.alignItems = "stretch";

    const u1_s5_controls = document.createElement("div");
    u1_s5_controls.style.flex = "1 1 240px";
    u1_s5_controls.style.minWidth = "240px";
    u1_s5_controls.style.padding = "1rem";
    u1_s5_controls.style.background = "var(--panel-bg)";
    u1_s5_controls.style.border = "1px solid var(--panel-border)";
    u1_s5_controls.style.borderRadius = "10px";

    const u1_s5_stage = document.createElement("div");
    u1_s5_stage.style.flex = "2 1 340px";
    u1_s5_stage.style.minWidth = "300px";

    u1_s5_wrap.appendChild(u1_s5_controls);
    u1_s5_wrap.appendChild(u1_s5_stage);
    body.appendChild(u1_s5_wrap);

    const u1_s5_intro = document.createElement("p");
    u1_s5_intro.className = "checkpoint-intro";
    u1_s5_intro.textContent = "Pick a base function, then raise the degree. Each new term eases into the partial sum, hugging the curve over a wider interval — the convergence window, shaded on the x-axis, expands outward from the centre at 0.";
    u1_s5_controls.appendChild(u1_s5_intro);

    u0SandboxToggleGroup(u1_s5_controls, "Base function",
        [{ value: "sin", label: "sin x" }, { value: "cos", label: "cos x" }, { value: "exp", label: "eˣ" }],
        function () { return u1_s5_state.kind; },
        function (val) { u1_s5_state.kind = val; u1_s5_retarget(); });

    const u1_s5_degSlider = u0SandboxSlider(u1_s5_controls, {
        label: "degree  n =", min: 0, max: u1_s5_MAXDEG, step: 1, value: u1_s5_state.degree, decimals: 0,
        onChange: function (v) { u1_s5_state.degree = Math.round(v); u1_s5_retarget(); }
    });

    const u1_s5_readout = document.createElement("div");
    u1_s5_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s5_readout.style.fontSize = "0.86rem";
    u1_s5_readout.style.fontWeight = "700";
    u1_s5_readout.style.padding = "0.6rem 0.8rem";
    u1_s5_readout.style.marginTop = "0.85rem";
    u1_s5_readout.style.background = "var(--bg-color)";
    u1_s5_readout.style.border = "1px solid var(--panel-border)";
    u1_s5_readout.style.borderRadius = "8px";
    u1_s5_readout.style.color = "var(--text-color)";
    u1_s5_readout.style.lineHeight = "1.5";
    u1_s5_controls.appendChild(u1_s5_readout);

    const u1_s5_canvas = document.createElement("canvas");
    u1_s5_canvas.width = 600;
    u1_s5_canvas.height = 420;
    u1_s5_canvas.className = "math-canvas";
    u1_s5_stage.appendChild(u1_s5_canvas);
    const u1_s5_ctx = u1_s5_canvas.getContext("2d");

    // Seed both coefficient vectors at the starting degree.
    u1_s5_retarget();
    u1_s5_state.disp = u1_s5_state.target.slice();

    // The symmetric interval about 0 where the partial sum tracks the base within
    // tolerance - the visible "interval of convergence" for this many terms.
    function u1_s5_convergenceEdge() {
        const TOL = 0.3;
        let edge = 0;
        for (let x = 0; x <= u1_s5_xMax; x += 0.05) {
            if (Math.abs(u1_s5_poly(x) - u1_s5_base(x)) > TOL) break;
            edge = x;
        }
        return edge;
    }

    function u1_s5_draw() {
        const ctx = u1_s5_ctx;
        const W = u1_s5_canvas.width, H = u1_s5_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const soft = u0SandboxColor("--accent-soft", "#ece6ff");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const padL = 40, padR = 16, padT = 16, padB = 28;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        function pxX(x) { return padL + (x - u1_s5_xMin) / (u1_s5_xMax - u1_s5_xMin) * plotW; }
        function pxY(y) { return padT + (u1_s5_yMax - y) / (u1_s5_yMax - u1_s5_yMin) * plotH; }
        function clampY(Y) { return Math.max(padT - 200, Math.min(H - padB + 200, Y)); }

        // Convergence band (shaded) behind the grid.
        const edge = u1_s5_convergenceEdge();
        if (edge > 0.05) {
            ctx.fillStyle = soft;
            ctx.globalAlpha = 0.6;
            ctx.fillRect(pxX(-edge), padT, pxX(edge) - pxX(-edge), plotH);
            ctx.globalAlpha = 1;
        }

        // Grid + axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        for (let gx = u1_s5_xMin; gx <= u1_s5_xMax; gx++) {
            const X = pxX(gx);
            ctx.beginPath(); ctx.moveTo(X, padT); ctx.lineTo(X, H - padB); ctx.stroke();
            if (gx !== 0) ctx.fillText(String(gx), X, pxY(0) + 12);
        }
        ctx.textAlign = "right";
        for (let gy = u1_s5_yMin; gy <= u1_s5_yMax; gy++) {
            const Y = pxY(gy);
            ctx.beginPath(); ctx.moveTo(padL, Y); ctx.lineTo(W - padR, Y); ctx.stroke();
            if (gy !== 0) ctx.fillText(String(gy), padL - 6, Y + 3);
        }
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(padL, pxY(0)); ctx.lineTo(W - padR, pxY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pxX(0), padT); ctx.lineTo(pxX(0), H - padB); ctx.stroke();

        // Base function (accent, dashed) for reference.
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 360; i++) {
            const x = u1_s5_xMin + (u1_s5_xMax - u1_s5_xMin) * (i / 360);
            const Y = clampY(pxY(u1_s5_base(x)));
            if (!started) { ctx.moveTo(pxX(x), Y); started = true; } else ctx.lineTo(pxX(x), Y);
        }
        ctx.stroke();
        ctx.restore();

        // Taylor partial sum (solid, text colour) drawn from eased coefficients.
        ctx.strokeStyle = text;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        started = false;
        for (let i = 0; i <= 360; i++) {
            const x = u1_s5_xMin + (u1_s5_xMax - u1_s5_xMin) * (i / 360);
            const yv = u1_s5_poly(x);
            const Y = clampY(pxY(yv));
            if (!started) { ctx.moveTo(pxX(x), Y); started = true; } else ctx.lineTo(pxX(x), Y);
        }
        ctx.stroke();

        // Centre marker at the expansion point.
        ctx.fillStyle = good;
        ctx.beginPath(); ctx.arc(pxX(0), pxY(u1_s5_base(0)), 5, 0, 2 * Math.PI); ctx.fill();

        // Legend.
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillStyle = accent;
        ctx.fillText("base function (dashed)", padL + 6, padT + 14);
        ctx.fillStyle = text;
        ctx.fillText("Taylor partial sum", padL + 6, padT + 30);

        u1_s5_syncReadout(edge);
    }

    function u1_s5_termsText() {
        // Show the symbolic partial sum from the (settled) target coefficients.
        const names = { sin: "sin x", cos: "cos x", exp: "eˣ" };
        const parts = [];
        for (let k = 0; k <= u1_s5_state.degree; k++) {
            const c = u1_s5_state.target[k];
            if (Math.abs(c) < 1e-12) continue;
            const sign = c < 0 ? "−" : (parts.length ? "+" : "");
            let mag;
            if (k === 0) mag = Math.abs(c).toFixed(0);
            else if (Math.abs(Math.abs(c) - 1) < 1e-12) mag = "x" + (k > 1 ? "^" + k : "");
            else mag = "x" + (k > 1 ? "^" + k : "") + "/" + Math.round(1 / Math.abs(c));
            parts.push(sign + mag);
        }
        return names[u1_s5_state.kind] + " ≈ " + (parts.length ? parts.join(" ") : "0");
    }

    function u1_s5_syncReadout(edge) {
        u1_s5_readout.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "degree n = " + u1_s5_state.degree;
        l1.style.color = "var(--text-color)";
        const l2 = document.createElement("div");
        l2.textContent = u1_s5_termsText();
        l2.style.color = "var(--accent-color)";
        l2.style.whiteSpace = "normal";
        l2.style.wordBreak = "break-word";
        const l3 = document.createElement("div");
        l3.textContent = "convergence window ≈ [−" + edge.toFixed(2) + ", " + edge.toFixed(2) + "]";
        l3.style.color = "var(--success-color)";
        u1_s5_readout.appendChild(l1);
        u1_s5_readout.appendChild(l2);
        u1_s5_readout.appendChild(l3);
    }

    function u1_s5_frame() {
        if (!document.body.contains(u1_s5_canvas)) return; // stop after navigation
        // Ease each display coefficient toward its target so added terms grow in.
        let moving = false;
        for (let k = 0; k <= u1_s5_MAXDEG; k++) {
            const d = u1_s5_state.target[k] - u1_s5_state.disp[k];
            if (Math.abs(d) > 1e-9) { u1_s5_state.disp[k] += d * 0.16; moving = true; }
            else u1_s5_state.disp[k] = u1_s5_state.target[k];
        }
        u1_s5_draw();
        requestAnimationFrame(u1_s5_frame);
        return moving;
    }
    requestAnimationFrame(u1_s5_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 6 - The Operator & Inverse Function Constraint Matrix (u1_s6_)

   Graphs a function that fails the horizontal line test (x² or sin x). A dual
   slider sets a restriction window [xmin, xmax]; the restricted arc is shaded and
   tested for injectivity by sampling for strict monotonicity. When the window is
   one-to-one, its reflection across y = x is drawn live as the valid inverse;
   when it is not, the inverse is withheld and the seam is flagged - the reason a
   domain restriction is required before an inverse exists.
   --------------------------------------------------------------------------- */
function renderInverseOperatorSandbox(body) {
    const u1_s6_LIM = 4; // symmetric world box [-LIM, LIM] on both axes (equal aspect)
    const u1_s6_defs = {
        quad: { label: "y = x²", f: function (x) { return x * x; }, dom: [-2, 2], win: [0.4, 2] },
        sin: { label: "y = sin x", f: function (x) { return Math.sin(x); }, dom: [-3.4, 3.4], win: [-1.3, 1.3] }
    };
    const u1_s6_state = { kind: "quad", xmin: 0.4, xmax: 2 };

    function u1_s6_f(x) { return u1_s6_defs[u1_s6_state.kind].f(x); }

    const u1_s6_wrap = document.createElement("div");
    u1_s6_wrap.style.display = "flex";
    u1_s6_wrap.style.flexWrap = "wrap";
    u1_s6_wrap.style.gap = "1rem";
    u1_s6_wrap.style.alignItems = "stretch";

    const u1_s6_controls = document.createElement("div");
    u1_s6_controls.style.flex = "1 1 240px";
    u1_s6_controls.style.minWidth = "240px";
    u1_s6_controls.style.padding = "1rem";
    u1_s6_controls.style.background = "var(--panel-bg)";
    u1_s6_controls.style.border = "1px solid var(--panel-border)";
    u1_s6_controls.style.borderRadius = "10px";

    const u1_s6_stage = document.createElement("div");
    u1_s6_stage.style.flex = "1 1 360px";
    u1_s6_stage.style.minWidth = "320px";

    u1_s6_wrap.appendChild(u1_s6_controls);
    u1_s6_wrap.appendChild(u1_s6_stage);
    body.appendChild(u1_s6_wrap);

    const u1_s6_intro = document.createElement("p");
    u1_s6_intro.className = "checkpoint-intro";
    u1_s6_intro.textContent = "These curves fail the horizontal line test, so they have no inverse as a whole. Slide the domain window until the shaded arc is one-to-one — only then does its mirror across y = x become a valid inverse function.";
    u1_s6_controls.appendChild(u1_s6_intro);

    // Domain-window sliders, declared before the toggle so the toggle handler can
    // reset them to the new function's default window.
    let u1_s6_minSlider, u1_s6_maxSlider;

    u0SandboxToggleGroup(u1_s6_controls, "Function",
        [{ value: "quad", label: "y = x²" }, { value: "sin", label: "y = sin x" }],
        function () { return u1_s6_state.kind; },
        function (val) {
            u1_s6_state.kind = val;
            const w = u1_s6_defs[val].win;
            u1_s6_state.xmin = w[0]; u1_s6_state.xmax = w[1];
            u1_s6_minSlider.setValue(w[0]);
            u1_s6_maxSlider.setValue(w[1]);
            u1_s6_draw();
        });

    u1_s6_minSlider = u0SandboxSlider(u1_s6_controls, {
        label: "x min =", min: -u1_s6_LIM, max: u1_s6_LIM, step: 0.05, value: u1_s6_state.xmin, decimals: 2,
        onChange: function (v) {
            u1_s6_state.xmin = v;
            if (u1_s6_state.xmin > u1_s6_state.xmax - 0.2) {
                u1_s6_state.xmax = Math.min(u1_s6_LIM, u1_s6_state.xmin + 0.2);
                u1_s6_maxSlider.setValue(u1_s6_state.xmax);
            }
            u1_s6_draw();
        }
    });
    u1_s6_maxSlider = u0SandboxSlider(u1_s6_controls, {
        label: "x max =", min: -u1_s6_LIM, max: u1_s6_LIM, step: 0.05, value: u1_s6_state.xmax, decimals: 2,
        onChange: function (v) {
            u1_s6_state.xmax = v;
            if (u1_s6_state.xmax < u1_s6_state.xmin + 0.2) {
                u1_s6_state.xmin = Math.max(-u1_s6_LIM, u1_s6_state.xmax - 0.2);
                u1_s6_minSlider.setValue(u1_s6_state.xmin);
            }
            u1_s6_draw();
        }
    });

    const u1_s6_readout = document.createElement("div");
    u1_s6_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s6_readout.style.fontSize = "0.9rem";
    u1_s6_readout.style.fontWeight = "700";
    u1_s6_readout.style.padding = "0.6rem 0.8rem";
    u1_s6_readout.style.marginTop = "0.85rem";
    u1_s6_readout.style.background = "var(--bg-color)";
    u1_s6_readout.style.border = "1px solid var(--panel-border)";
    u1_s6_readout.style.borderRadius = "8px";
    u1_s6_controls.appendChild(u1_s6_readout);

    const u1_s6_canvas = document.createElement("canvas");
    u1_s6_canvas.width = 460;
    u1_s6_canvas.height = 460;
    u1_s6_canvas.className = "math-canvas";
    u1_s6_stage.appendChild(u1_s6_canvas);
    const u1_s6_ctx = u1_s6_canvas.getContext("2d");

    // Strict-monotonicity test over the restriction window: sample the arc and
    // confirm every step moves the same direction. A one-to-one arc is invertible.
    function u1_s6_injective() {
        const N = 120;
        let dir = 0;
        let prev = u1_s6_f(u1_s6_state.xmin);
        for (let i = 1; i <= N; i++) {
            const x = u1_s6_state.xmin + (u1_s6_state.xmax - u1_s6_state.xmin) * (i / N);
            const y = u1_s6_f(x);
            const d = y - prev;
            if (Math.abs(d) > 1e-7) {
                const s = d > 0 ? 1 : -1;
                if (dir === 0) dir = s;
                else if (s !== dir) return false;
            }
            prev = y;
        }
        return true;
    }

    function u1_s6_draw() {
        const ctx = u1_s6_ctx;
        const W = u1_s6_canvas.width, H = u1_s6_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const warm = u0SandboxColor("--error-color", "#b3261e");
        const soft = u0SandboxColor("--accent-soft", "#ece6ff");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const pad = 30;
        const plot = Math.min(W, H) - 2 * pad;
        function pxX(x) { return pad + (x + u1_s6_LIM) / (2 * u1_s6_LIM) * plot; }
        function pxY(y) { return pad + (u1_s6_LIM - y) / (2 * u1_s6_LIM) * plot; }

        // Grid.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        for (let g = -u1_s6_LIM; g <= u1_s6_LIM; g++) {
            ctx.beginPath(); ctx.moveTo(pxX(g), pad); ctx.lineTo(pxX(g), pad + plot); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad, pxY(g)); ctx.lineTo(pad + plot, pxY(g)); ctx.stroke();
        }
        // Axes.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(pad, pxY(0)); ctx.lineTo(pad + plot, pxY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pxX(0), pad); ctx.lineTo(pxX(0), pad + plot); ctx.stroke();

        // y = x mirror line (dashed).
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(pxX(-u1_s6_LIM), pxY(-u1_s6_LIM)); ctx.lineTo(pxX(u1_s6_LIM), pxY(u1_s6_LIM)); ctx.stroke();
        ctx.restore();

        const def = u1_s6_defs[u1_s6_state.kind];
        const valid = u1_s6_injective();
        const arcColor = valid ? good : warm;

        // Full function (faint), so the failing whole stays visible.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 360; i++) {
            const x = def.dom[0] + (def.dom[1] - def.dom[0]) * (i / 360);
            const X = pxX(x), Y = pxY(u1_s6_f(x));
            if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // Shaded restriction band on the domain.
        ctx.fillStyle = soft;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(pxX(u1_s6_state.xmin), pad, pxX(u1_s6_state.xmax) - pxX(u1_s6_state.xmin), plot);
        ctx.globalAlpha = 1;

        // Restricted arc (bold, valid/invalid colour).
        ctx.strokeStyle = arcColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        started = false;
        for (let i = 0; i <= 240; i++) {
            const x = u1_s6_state.xmin + (u1_s6_state.xmax - u1_s6_state.xmin) * (i / 240);
            const X = pxX(x), Y = pxY(u1_s6_f(x));
            if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // The inverse: reflect the restricted arc across y = x, drawn only when the
        // window is one-to-one (otherwise the reflection is not a function).
        if (valid) {
            ctx.strokeStyle = accent;
            ctx.lineWidth = 3;
            ctx.setLineDash([]);
            ctx.beginPath();
            started = false;
            for (let i = 0; i <= 240; i++) {
                const x = u1_s6_state.xmin + (u1_s6_state.xmax - u1_s6_state.xmin) * (i / 240);
                const y = u1_s6_f(x);
                // reflection across y = x swaps the coordinates
                const X = pxX(y), Y = pxY(x);
                if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
            }
            ctx.stroke();
        }

        // Legend.
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillStyle = arcColor;
        ctx.fillText("restricted " + def.label, pad + 4, pad + 14);
        if (valid) {
            ctx.fillStyle = accent;
            ctx.fillText("inverse (reflected over y = x)", pad + 4, pad + 30);
        }

        u1_s6_syncReadout(valid);
    }

    function u1_s6_syncReadout(valid) {
        u1_s6_readout.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "window  [" + u1_s6_state.xmin.toFixed(2) + ", " + u1_s6_state.xmax.toFixed(2) + "]";
        l1.style.color = "var(--text-color)";
        const l2 = document.createElement("div");
        l2.textContent = valid ? "✓ one-to-one — inverse exists" : "✕ fails horizontal line test — no inverse";
        l2.style.color = valid ? "var(--success-color)" : "var(--error-color)";
        l2.style.marginTop = "0.2rem";
        u1_s6_readout.appendChild(l1);
        u1_s6_readout.appendChild(l2);
    }

    u1_s6_draw();

    const u1_s6_themeWatch = new MutationObserver(function () {
        if (!document.body.contains(u1_s6_canvas)) { u1_s6_themeWatch.disconnect(); return; }
        u1_s6_draw();
    });
    u1_s6_themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* A range slider that rides on log10(value) so a single drag can sweep several
   orders of magnitude with even control (e.g. Δx from 1 down to 0.001, or a zoom
   window from 8 out to 600). opts.min/max/value are the actual values (all > 0);
   the readout prints the real value to opts.decimals places. Returns a holder
   tracking .value with setValue() to drive it programmatically, mirroring
   u0SandboxSlider's shape. */
function u1SandboxLogSlider(parent, opts) {
    const dec = (opts.decimals === undefined) ? 3 : opts.decimals;
    const lmin = Math.log10(opts.min), lmax = Math.log10(opts.max);
    const row = document.createElement("div");
    row.className = "slider-row";

    const label = document.createElement("span");
    label.className = "slider-label";
    label.textContent = opts.label;

    const input = document.createElement("input");
    input.type = "range";
    input.min = String(lmin);
    input.max = String(lmax);
    input.step = String((lmax - lmin) / 1000);
    input.value = String(Math.log10(opts.value));

    const readout = document.createElement("span");
    readout.className = "slider-readout";

    const holder = { value: opts.value, input: input };
    function fmt(v) { return v.toFixed(dec) + (opts.suffix || ""); }
    readout.textContent = fmt(opts.value);

    input.addEventListener("input", function () {
        holder.value = Math.pow(10, parseFloat(input.value));
        readout.textContent = fmt(holder.value);
        if (opts.onChange) opts.onChange(holder.value);
    });
    holder.setValue = function (v) {
        holder.value = v;
        input.value = String(Math.log10(v));
        readout.textContent = fmt(v);
    };

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(readout);
    parent.appendChild(row);
    return holder;
}

/* ---------------------------------------------------------------------------
   Sandbox 7 - The Exponential Growth Ceiling Lab (u1_s7_)

   Plots y = xⁿ against y = aˣ on a viewport whose width is a log-scaled zoom
   slider. The y-window auto-fits the polynomial (yMax = xMaxⁿ), so the power term
   fills the frame to the top-right while the exponential, once it overtakes,
   shoots straight off the top. Sliders set the power n and base a; the engine
   scans for the crossover where aˣ permanently overtakes xⁿ and reports whether
   it sits inside the current window - so zooming out reveals the ceiling crossing
   no matter how large n is.
   --------------------------------------------------------------------------- */
function renderExponentialCeilingSandbox(body) {
    const u1_s7_state = { n: 3, a: 2.0, xMax: 12 };

    function u1_s7_pow(x) { return Math.pow(x, u1_s7_state.n); }
    function u1_s7_exp(x) { return Math.pow(u1_s7_state.a, x); }

    const u1_s7_wrap = document.createElement("div");
    u1_s7_wrap.style.display = "flex";
    u1_s7_wrap.style.flexWrap = "wrap";
    u1_s7_wrap.style.gap = "1rem";
    u1_s7_wrap.style.alignItems = "stretch";

    const u1_s7_controls = document.createElement("div");
    u1_s7_controls.style.flex = "1 1 240px";
    u1_s7_controls.style.minWidth = "240px";
    u1_s7_controls.style.padding = "1rem";
    u1_s7_controls.style.background = "var(--panel-bg)";
    u1_s7_controls.style.border = "1px solid var(--panel-border)";
    u1_s7_controls.style.borderRadius = "10px";

    const u1_s7_stage = document.createElement("div");
    u1_s7_stage.style.flex = "2 1 340px";
    u1_s7_stage.style.minWidth = "300px";

    u1_s7_wrap.appendChild(u1_s7_controls);
    u1_s7_wrap.appendChild(u1_s7_stage);
    body.appendChild(u1_s7_wrap);

    const u1_s7_intro = document.createElement("p");
    u1_s7_intro.className = "checkpoint-intro";
    u1_s7_intro.textContent = "Raise the power n as high as you like — then zoom the window out. The exponential aˣ always finds the crossover and pulls away for good, off the top of the frame, while the polynomial is still climbing.";
    u1_s7_controls.appendChild(u1_s7_intro);

    const u1_s7_nSlider = u0SandboxSlider(u1_s7_controls, {
        label: "power  n =", min: 1, max: 6, step: 1, value: u1_s7_state.n, decimals: 0,
        onChange: function (v) { u1_s7_state.n = Math.round(v); u1_s7_draw(); }
    });
    const u1_s7_aSlider = u0SandboxSlider(u1_s7_controls, {
        label: "base  a =", min: 1.1, max: 3, step: 0.05, value: u1_s7_state.a, decimals: 2,
        onChange: function (v) { u1_s7_state.a = v; u1_s7_draw(); }
    });
    u1SandboxLogSlider(u1_s7_controls, {
        label: "zoom  xₘₐₓ =", min: 8, max: 600, value: u1_s7_state.xMax, decimals: 0,
        onChange: function (v) { u1_s7_state.xMax = v; u1_s7_draw(); }
    });

    const u1_s7_readout = document.createElement("div");
    u1_s7_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s7_readout.style.fontSize = "0.86rem";
    u1_s7_readout.style.fontWeight = "700";
    u1_s7_readout.style.padding = "0.6rem 0.8rem";
    u1_s7_readout.style.marginTop = "0.85rem";
    u1_s7_readout.style.background = "var(--bg-color)";
    u1_s7_readout.style.border = "1px solid var(--panel-border)";
    u1_s7_readout.style.borderRadius = "8px";
    u1_s7_readout.style.lineHeight = "1.5";
    u1_s7_controls.appendChild(u1_s7_readout);

    const u1_s7_canvas = document.createElement("canvas");
    u1_s7_canvas.width = 600;
    u1_s7_canvas.height = 420;
    u1_s7_canvas.className = "math-canvas";
    u1_s7_stage.appendChild(u1_s7_canvas);
    const u1_s7_ctx = u1_s7_canvas.getContext("2d");

    // Largest x in the window where aˣ overtakes xⁿ for good (h: − -> +).
    function u1_s7_crossover() {
        const xMax = u1_s7_state.xMax;
        const steps = 3000;
        let last = null;
        let prev = u1_s7_exp(0.5) - u1_s7_pow(0.5);
        for (let i = 1; i <= steps; i++) {
            const x = 0.5 + (xMax - 0.5) * (i / steps);
            const h = u1_s7_exp(x) - u1_s7_pow(x);
            if (prev < 0 && h >= 0) last = x;
            prev = h;
        }
        return last;
    }

    function u1_s7_draw() {
        const ctx = u1_s7_ctx;
        const W = u1_s7_canvas.width, H = u1_s7_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const padL = 46, padR = 16, padT = 16, padB = 28;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        const xMax = u1_s7_state.xMax;
        const yMax = Math.pow(xMax, u1_s7_state.n); // frame fits the polynomial exactly
        function pxX(x) { return padL + (x / xMax) * plotW; }
        function pxY(y) { return padT + (1 - y / yMax) * plotH; }
        function clampY(Y) { return Math.max(padT - 300, Math.min(H - padB + 300, Y)); }

        // Grid: a handful of vertical / horizontal references with end labels.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        for (let g = 0; g <= 5; g++) {
            const x = xMax * g / 5;
            const X = pxX(x);
            ctx.beginPath(); ctx.moveTo(X, padT); ctx.lineTo(X, H - padB); ctx.stroke();
            ctx.fillText(x.toFixed(x < 10 ? 1 : 0), X, H - padB + 14);
        }
        ctx.textAlign = "right";
        for (let g = 0; g <= 4; g++) {
            const y = yMax * g / 4;
            const Y = pxY(y);
            ctx.beginPath(); ctx.moveTo(padL, Y); ctx.lineTo(W - padR, Y); ctx.stroke();
            ctx.fillText(y >= 1000 ? y.toExponential(0) : y.toFixed(0), padL - 6, Y + 3);
        }

        // Polynomial xⁿ (text colour).
        ctx.strokeStyle = text;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 480; i++) {
            const x = xMax * (i / 480);
            const X = pxX(x), Y = clampY(pxY(u1_s7_pow(x)));
            if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // Exponential aˣ (accent) - clipped as it leaves the top.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= 480; i++) {
            const x = xMax * (i / 480);
            const X = pxX(x), Y = clampY(pxY(u1_s7_exp(x)));
            if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // Crossover marker.
        const xc = u1_s7_crossover();
        if (xc !== null) {
            const yc = u1_s7_pow(xc);
            ctx.save();
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = good;
            ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(pxX(xc), padT); ctx.lineTo(pxX(xc), H - padB); ctx.stroke();
            ctx.restore();
            ctx.fillStyle = good;
            ctx.beginPath(); ctx.arc(pxX(xc), clampY(pxY(yc)), 6, 0, 2 * Math.PI); ctx.fill();
            ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
        }

        // Legend.
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillStyle = text;
        ctx.fillText("y = xⁿ", padL + 6, padT + 14);
        ctx.fillStyle = accent;
        ctx.fillText("y = aˣ", padL + 6, padT + 30);

        u1_s7_syncReadout(xc);
    }

    function u1_s7_syncReadout(xc) {
        u1_s7_readout.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "y = x^" + u1_s7_state.n + "   vs   y = " + u1_s7_state.a.toFixed(2) + "^x";
        l1.style.color = "var(--text-color)";
        const l2 = document.createElement("div");
        l2.style.marginTop = "0.2rem";
        if (xc !== null) {
            l2.textContent = "✓ aˣ overtakes xⁿ at x ≈ " + xc.toFixed(2) + " — and dominates forever after.";
            l2.style.color = "var(--success-color)";
        } else if (u1_s7_exp(u1_s7_state.xMax) >= u1_s7_pow(u1_s7_state.xMax)) {
            l2.textContent = "aˣ already leads across the whole window.";
            l2.style.color = "var(--accent-color)";
        } else {
            l2.textContent = "xⁿ still leads here — zoom xₘₐₓ out to find the ceiling crossover.";
            l2.style.color = "var(--text-secondary)";
        }
        u1_s7_readout.appendChild(l1);
        u1_s7_readout.appendChild(l2);
    }

    u1_s7_draw();

    const u1_s7_themeWatch = new MutationObserver(function () {
        if (!document.body.contains(u1_s7_canvas)) { u1_s7_themeWatch.disconnect(); return; }
        u1_s7_draw();
    });
    u1_s7_themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* ---------------------------------------------------------------------------
   Sandbox 8 - The Logarithmic Domain & Growth Barrier (u1_s8_)

   Graphs y = ln x with the x ≤ 0 half-plane shaded as the forbidden domain. A
   log-scaled probe x = c (slider or click) drops a marker on the curve; as c → 0⁺
   a red asymptote banner fades in and the readout plunges toward −∞. A toggle
   overlays the derivative 1/x, correlating the curve's gentle horizontal crawl
   for large x with its explosive slope near the origin.
   --------------------------------------------------------------------------- */
function renderLogarithmicBoundsSandbox(body) {
    const u1_s8_state = { c: 1.0, showDeriv: false };
    const u1_s8_xMin = -1.2, u1_s8_xMax = 8, u1_s8_yMin = -5, u1_s8_yMax = 3;

    const u1_s8_wrap = document.createElement("div");
    u1_s8_wrap.style.display = "flex";
    u1_s8_wrap.style.flexWrap = "wrap";
    u1_s8_wrap.style.gap = "1rem";
    u1_s8_wrap.style.alignItems = "stretch";

    const u1_s8_controls = document.createElement("div");
    u1_s8_controls.style.flex = "1 1 240px";
    u1_s8_controls.style.minWidth = "240px";
    u1_s8_controls.style.padding = "1rem";
    u1_s8_controls.style.background = "var(--panel-bg)";
    u1_s8_controls.style.border = "1px solid var(--panel-border)";
    u1_s8_controls.style.borderRadius = "10px";

    const u1_s8_stage = document.createElement("div");
    u1_s8_stage.style.flex = "2 1 340px";
    u1_s8_stage.style.minWidth = "300px";

    u1_s8_wrap.appendChild(u1_s8_controls);
    u1_s8_wrap.appendChild(u1_s8_stage);
    body.appendChild(u1_s8_wrap);

    const u1_s8_intro = document.createElement("p");
    u1_s8_intro.className = "checkpoint-intro";
    u1_s8_intro.textContent = "ln x is defined only for x > 0. Drive the probe c toward zero to watch the value fall off a cliff toward −∞, and toggle the 1/x slope to see why: the derivative blows up exactly where the domain runs out.";
    u1_s8_controls.appendChild(u1_s8_intro);

    const u1_s8_cSlider = u1SandboxLogSlider(u1_s8_controls, {
        label: "probe  c =", min: 0.02, max: 8, value: u1_s8_state.c, decimals: 3,
        onChange: function (v) { u1_s8_state.c = v; u1_s8_draw(); }
    });

    // Derivative overlay toggle.
    const u1_s8_derivBtn = document.createElement("button");
    u1_s8_derivBtn.type = "button";
    u1_s8_derivBtn.className = "checkpoint-begin-btn";
    u1_s8_derivBtn.style.marginTop = "0.6rem";
    function u1_s8_syncBtn() {
        u1_s8_derivBtn.textContent = "Overlay slope 1/x: " + (u1_s8_state.showDeriv ? "on" : "off");
    }
    u1_s8_syncBtn();
    u1_s8_derivBtn.addEventListener("click", function () {
        u1_s8_state.showDeriv = !u1_s8_state.showDeriv;
        u1_s8_syncBtn();
        u1_s8_draw();
    });
    u1_s8_controls.appendChild(u1_s8_derivBtn);

    const u1_s8_readout = document.createElement("div");
    u1_s8_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s8_readout.style.fontSize = "0.9rem";
    u1_s8_readout.style.fontWeight = "700";
    u1_s8_readout.style.padding = "0.6rem 0.8rem";
    u1_s8_readout.style.marginTop = "0.85rem";
    u1_s8_readout.style.background = "var(--bg-color)";
    u1_s8_readout.style.border = "1px solid var(--panel-border)";
    u1_s8_readout.style.borderRadius = "8px";
    u1_s8_readout.style.lineHeight = "1.5";
    u1_s8_controls.appendChild(u1_s8_readout);

    const u1_s8_canvas = document.createElement("canvas");
    u1_s8_canvas.width = 600;
    u1_s8_canvas.height = 420;
    u1_s8_canvas.className = "math-canvas";
    u1_s8_canvas.style.cursor = "crosshair";
    u1_s8_stage.appendChild(u1_s8_canvas);
    const u1_s8_ctx = u1_s8_canvas.getContext("2d");

    // A click sets the probe to the x under the pointer (positive domain only).
    u1_s8_canvas.addEventListener("click", function (ev) {
        const rect = u1_s8_canvas.getBoundingClientRect();
        const mx = (ev.clientX - rect.left) * (u1_s8_canvas.width / rect.width);
        const padL = 46, padR = 16;
        const plotW = u1_s8_canvas.width - padL - padR;
        const x = u1_s8_xMin + (mx - padL) / plotW * (u1_s8_xMax - u1_s8_xMin);
        if (x > 0.02 && x <= u1_s8_xMax) {
            u1_s8_state.c = Math.min(8, x);
            u1_s8_cSlider.setValue(u1_s8_state.c);
            u1_s8_draw();
        }
    });

    function u1_s8_draw() {
        const ctx = u1_s8_ctx;
        const W = u1_s8_canvas.width, H = u1_s8_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const warm = u0SandboxColor("--error-color", "#b3261e");
        const locked = u0SandboxColor("--locked-color", "#9aa0b4");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const padL = 46, padR = 16, padT = 16, padB = 28;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        function pxX(x) { return padL + (x - u1_s8_xMin) / (u1_s8_xMax - u1_s8_xMin) * plotW; }
        function pxY(y) { return padT + (u1_s8_yMax - y) / (u1_s8_yMax - u1_s8_yMin) * plotH; }
        function clampY(Y) { return Math.max(padT - 300, Math.min(H - padB + 300, Y)); }

        // Forbidden domain x <= 0 (locked-colour wash).
        ctx.fillStyle = locked;
        ctx.globalAlpha = 0.18;
        ctx.fillRect(pxX(u1_s8_xMin), padT, pxX(0) - pxX(u1_s8_xMin), plotH);
        ctx.globalAlpha = 1;

        // Grid + axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        for (let gx = -1; gx <= u1_s8_xMax; gx++) {
            const X = pxX(gx);
            ctx.beginPath(); ctx.moveTo(X, padT); ctx.lineTo(X, H - padB); ctx.stroke();
            if (gx !== 0) ctx.fillText(String(gx), X, pxY(0) + 12);
        }
        ctx.textAlign = "right";
        for (let gy = u1_s8_yMin; gy <= u1_s8_yMax; gy++) {
            const Y = pxY(gy);
            ctx.beginPath(); ctx.moveTo(padL, Y); ctx.lineTo(W - padR, Y); ctx.stroke();
            if (gy !== 0) ctx.fillText(String(gy), padL - 6, Y + 3);
        }
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(padL, pxY(0)); ctx.lineTo(W - padR, pxY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pxX(0), padT); ctx.lineTo(pxX(0), H - padB); ctx.stroke();

        // Vertical asymptote at x = 0, intensifying as c shrinks.
        const proximity = Math.max(0, Math.min(1, (0.5 - u1_s8_state.c) / 0.5));
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = warm;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.25 + 0.65 * proximity;
        ctx.beginPath(); ctx.moveTo(pxX(0), padT); ctx.lineTo(pxX(0), H - padB); ctx.stroke();
        ctx.restore();

        // Derivative 1/x overlay (success colour), drawn behind the main curve.
        if (u1_s8_state.showDeriv) {
            ctx.strokeStyle = good;
            ctx.lineWidth = 2;
            ctx.save();
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            let started = false;
            for (let i = 0; i <= 480; i++) {
                const x = 0.02 + (u1_s8_xMax - 0.02) * (i / 480);
                const Y = clampY(pxY(1 / x));
                if (!started) { ctx.moveTo(pxX(x), Y); started = true; } else ctx.lineTo(pxX(x), Y);
            }
            ctx.stroke();
            ctx.restore();
        }

        // ln x curve (accent).
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 480; i++) {
            const x = 0.01 + (u1_s8_xMax - 0.01) * (i / 480);
            const Y = clampY(pxY(Math.log(x)));
            if (!started) { ctx.moveTo(pxX(x), Y); started = true; } else ctx.lineTo(pxX(x), Y);
        }
        ctx.stroke();

        // Probe line + marker at x = c.
        const c = u1_s8_state.c;
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pxX(c), padT); ctx.lineTo(pxX(c), H - padB); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(pxX(c), clampY(pxY(Math.log(c))), 6, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();

        // Fading red asymptote banner when the probe is near the origin.
        if (proximity > 0.02) {
            const bw = 232, bh = 30;
            ctx.save();
            ctx.globalAlpha = 0.12 + 0.5 * proximity;
            ctx.fillStyle = warm;
            ctx.fillRect(padL + 8, padT + 8, bw, bh);
            ctx.globalAlpha = 0.4 + 0.6 * proximity;
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText("ln x → −∞   as x → 0⁺", padL + 18, padT + 28);
            ctx.restore();
        }

        u1_s8_syncReadout();
    }

    function u1_s8_syncReadout() {
        const c = u1_s8_state.c;
        u1_s8_readout.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "ln(" + c.toFixed(3) + ") = " + Math.log(c).toFixed(3);
        l1.style.color = Math.log(c) < -1.5 ? "var(--error-color)" : "var(--text-color)";
        u1_s8_readout.appendChild(l1);
        if (u1_s8_state.showDeriv) {
            const l2 = document.createElement("div");
            l2.textContent = "slope 1/x = " + (1 / c).toFixed(3);
            l2.style.color = "var(--success-color)";
            l2.style.marginTop = "0.2rem";
            u1_s8_readout.appendChild(l2);
        }
        const l3 = document.createElement("div");
        l3.textContent = c < 0.1 ? "domain edge: value plunging, slope exploding" : "domain: x > 0 only";
        l3.style.color = "var(--text-secondary)";
        l3.style.marginTop = "0.2rem";
        u1_s8_readout.appendChild(l3);
    }

    u1_s8_draw();

    const u1_s8_themeWatch = new MutationObserver(function () {
        if (!document.body.contains(u1_s8_canvas)) { u1_s8_themeWatch.disconnect(); return; }
        u1_s8_draw();
    });
    u1_s8_themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* ---------------------------------------------------------------------------
   Sandbox 9 - The Secant-to-Tangent Difference Quotient Matrix (u1_s9_)

   Graphs y = x³ − 3x with a fixed base point x₀ and a second point x₀ + Δx. A
   dashed secant joins them; the solid analytic tangent f'(x₀) = 3x₀² − 3 is drawn
   for comparison. A log-scaled Δx slider (1 down to 0.001), plus a "shrink Δx → 0"
   animation, drives the secant slope onto the tangent slope, with live readouts of
   both and their closing error. A single requestAnimationFrame loop both runs the
   shrink animation and keeps colours live; it self-terminates on DOM eviction.
   --------------------------------------------------------------------------- */
function renderDifferenceQuotientSandbox(body) {
    const u1_s9_state = { x0: 1.0, dx: 0.7, animating: false };
    const u1_s9_xMin = -2.4, u1_s9_xMax = 2.4, u1_s9_yMin = -4, u1_s9_yMax = 4;
    const u1_s9_DX_MIN = 0.001;

    function u1_s9_f(x) { return x * x * x - 3 * x; }
    function u1_s9_df(x) { return 3 * x * x - 3; }

    const u1_s9_wrap = document.createElement("div");
    u1_s9_wrap.style.display = "flex";
    u1_s9_wrap.style.flexWrap = "wrap";
    u1_s9_wrap.style.gap = "1rem";
    u1_s9_wrap.style.alignItems = "stretch";

    const u1_s9_controls = document.createElement("div");
    u1_s9_controls.style.flex = "1 1 240px";
    u1_s9_controls.style.minWidth = "240px";
    u1_s9_controls.style.padding = "1rem";
    u1_s9_controls.style.background = "var(--panel-bg)";
    u1_s9_controls.style.border = "1px solid var(--panel-border)";
    u1_s9_controls.style.borderRadius = "10px";

    const u1_s9_stage = document.createElement("div");
    u1_s9_stage.style.flex = "2 1 340px";
    u1_s9_stage.style.minWidth = "300px";

    u1_s9_wrap.appendChild(u1_s9_controls);
    u1_s9_wrap.appendChild(u1_s9_stage);
    body.appendChild(u1_s9_wrap);

    const u1_s9_intro = document.createElement("p");
    u1_s9_intro.className = "checkpoint-intro";
    u1_s9_intro.textContent = "The dashed secant joins x₀ and x₀ + Δx. Shrink Δx toward zero and watch its slope crystallize onto the solid tangent — the difference quotient becoming the instantaneous derivative f′(x₀) = 3x₀² − 3.";
    u1_s9_controls.appendChild(u1_s9_intro);

    const u1_s9_x0Slider = u0SandboxSlider(u1_s9_controls, {
        label: "base  x₀ =", min: -2, max: 2, step: 0.05, value: u1_s9_state.x0, decimals: 2,
        onChange: function (v) { u1_s9_state.x0 = v; }
    });
    const u1_s9_dxSlider = u1SandboxLogSlider(u1_s9_controls, {
        label: "interval  Δx =", min: u1_s9_DX_MIN, max: 1, value: u1_s9_state.dx, decimals: 3,
        onChange: function (v) { u1_s9_state.dx = v; u1_s9_state.animating = false; u1_s9_syncBtn(); }
    });

    const u1_s9_animBtn = document.createElement("button");
    u1_s9_animBtn.type = "button";
    u1_s9_animBtn.className = "checkpoint-begin-btn";
    u1_s9_animBtn.style.marginTop = "0.6rem";
    function u1_s9_syncBtn() {
        u1_s9_animBtn.textContent = u1_s9_state.animating ? "Shrinking Δx → 0 …" : "Shrink Δx → 0";
    }
    u1_s9_syncBtn();
    u1_s9_animBtn.addEventListener("click", function () {
        if (u1_s9_state.animating) {
            u1_s9_state.animating = false;
        } else {
            // Restart from a wide gap if we are already collapsed, so the lock-on
            // is visible every time the button is pressed.
            if (u1_s9_state.dx <= u1_s9_DX_MIN * 4) {
                u1_s9_state.dx = 1;
                u1_s9_dxSlider.setValue(u1_s9_state.dx);
            }
            u1_s9_state.animating = true;
        }
        u1_s9_syncBtn();
    });
    u1_s9_controls.appendChild(u1_s9_animBtn);

    const u1_s9_readout = document.createElement("div");
    u1_s9_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s9_readout.style.fontSize = "0.86rem";
    u1_s9_readout.style.fontWeight = "700";
    u1_s9_readout.style.padding = "0.6rem 0.8rem";
    u1_s9_readout.style.marginTop = "0.85rem";
    u1_s9_readout.style.background = "var(--bg-color)";
    u1_s9_readout.style.border = "1px solid var(--panel-border)";
    u1_s9_readout.style.borderRadius = "8px";
    u1_s9_readout.style.lineHeight = "1.5";
    u1_s9_controls.appendChild(u1_s9_readout);

    const u1_s9_canvas = document.createElement("canvas");
    u1_s9_canvas.width = 600;
    u1_s9_canvas.height = 420;
    u1_s9_canvas.className = "math-canvas";
    u1_s9_stage.appendChild(u1_s9_canvas);
    const u1_s9_ctx = u1_s9_canvas.getContext("2d");

    function u1_s9_draw() {
        const ctx = u1_s9_ctx;
        const W = u1_s9_canvas.width, H = u1_s9_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const padL = 40, padR = 16, padT = 16, padB = 28;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        function pxX(x) { return padL + (x - u1_s9_xMin) / (u1_s9_xMax - u1_s9_xMin) * plotW; }
        function pxY(y) { return padT + (u1_s9_yMax - y) / (u1_s9_yMax - u1_s9_yMin) * plotH; }
        function clampY(Y) { return Math.max(padT - 200, Math.min(H - padB + 200, Y)); }

        // Grid + axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        for (let gx = -2; gx <= 2; gx++) {
            const X = pxX(gx);
            ctx.beginPath(); ctx.moveTo(X, padT); ctx.lineTo(X, H - padB); ctx.stroke();
            if (gx !== 0) ctx.fillText(String(gx), X, pxY(0) + 12);
        }
        ctx.textAlign = "right";
        for (let gy = u1_s9_yMin; gy <= u1_s9_yMax; gy++) {
            const Y = pxY(gy);
            ctx.beginPath(); ctx.moveTo(padL, Y); ctx.lineTo(W - padR, Y); ctx.stroke();
            if (gy !== 0) ctx.fillText(String(gy), padL - 6, Y + 3);
        }
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(padL, pxY(0)); ctx.lineTo(W - padR, pxY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pxX(0), padT); ctx.lineTo(pxX(0), H - padB); ctx.stroke();

        // The curve.
        ctx.strokeStyle = text;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 360; i++) {
            const x = u1_s9_xMin + (u1_s9_xMax - u1_s9_xMin) * (i / 360);
            const X = pxX(x), Y = clampY(pxY(u1_s9_f(x)));
            if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        const x0 = u1_s9_state.x0;
        const x1 = x0 + u1_s9_state.dx;
        const f0 = u1_s9_f(x0), f1 = u1_s9_f(x1);
        const mSec = (f1 - f0) / u1_s9_state.dx;
        const mTan = u1_s9_df(x0);

        // Tangent line (solid, success) spanning the frame.
        ctx.strokeStyle = good;
        ctx.lineWidth = 2;
        const tanL = f0 + mTan * (u1_s9_xMin - x0);
        const tanR = f0 + mTan * (u1_s9_xMax - x0);
        ctx.beginPath();
        ctx.moveTo(pxX(u1_s9_xMin), clampY(pxY(tanL)));
        ctx.lineTo(pxX(u1_s9_xMax), clampY(pxY(tanR)));
        ctx.stroke();

        // Secant line (dashed, accent) spanning the frame.
        ctx.save();
        ctx.setLineDash([7, 5]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        const secL = f0 + mSec * (u1_s9_xMin - x0);
        const secR = f0 + mSec * (u1_s9_xMax - x0);
        ctx.beginPath();
        ctx.moveTo(pxX(u1_s9_xMin), clampY(pxY(secL)));
        ctx.lineTo(pxX(u1_s9_xMax), clampY(pxY(secR)));
        ctx.stroke();
        ctx.restore();

        // The two sample points.
        ctx.fillStyle = text;
        ctx.beginPath(); ctx.arc(pxX(x0), pxY(f0), 6, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(pxX(x1), clampY(pxY(f1)), 5, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();

        // Legend.
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillStyle = good;
        ctx.fillText("tangent  f′(x₀)", padL + 6, padT + 14);
        ctx.fillStyle = accent;
        ctx.fillText("secant (Δx)", padL + 6, padT + 30);

        u1_s9_syncReadout(mSec, mTan);
    }

    function u1_s9_syncReadout(mSec, mTan) {
        const err = Math.abs(mSec - mTan);
        u1_s9_readout.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "secant slope  = " + mSec.toFixed(4);
        l1.style.color = "var(--accent-color)";
        const l2 = document.createElement("div");
        l2.textContent = "tangent f′(x₀) = " + mTan.toFixed(4);
        l2.style.color = "var(--success-color)";
        l2.style.marginTop = "0.2rem";
        const l3 = document.createElement("div");
        l3.textContent = "|error| = " + err.toFixed(4);
        l3.style.color = err < 0.05 ? "var(--success-color)" : "var(--text-secondary)";
        l3.style.marginTop = "0.2rem";
        u1_s9_readout.appendChild(l1);
        u1_s9_readout.appendChild(l2);
        u1_s9_readout.appendChild(l3);
    }

    function u1_s9_frame() {
        if (!document.body.contains(u1_s9_canvas)) return; // stop after navigation
        if (u1_s9_state.animating) {
            u1_s9_state.dx *= 0.95;
            if (u1_s9_state.dx <= u1_s9_DX_MIN) {
                u1_s9_state.dx = u1_s9_DX_MIN;
                u1_s9_state.animating = false;
                u1_s9_syncBtn();
            }
            u1_s9_dxSlider.setValue(u1_s9_state.dx);
        }
        u1_s9_draw();
        requestAnimationFrame(u1_s9_frame);
    }
    requestAnimationFrame(u1_s9_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 10 - The Prerequisite Function Reference Matrix (u1_s10_)

   The capstone of the Unit 1 cluster: a single dashboard that audits every core
   prerequisite function. A button group on the left selects the active function;
   an information desk below it prints its domain, range, derivative, and inverse
   criteria; the canvas on the right graphs it with a node that tracks the cursor
   along the curve, a floating badge reading the live (x, f(x)) and the local slope
   f'(x). Polynomial, exponential, logarithmic, a piecewise step, and sine all
   render as y = f(x); the complex case e^{iθ} switches the canvas to the unit
   circle, the node riding the angle with the rotational derivative i·e^{iθ}.

   One requestAnimationFrame loop drives the redraw (so a theme toggle repaints
   live) and self-terminates the moment the canvas leaves the DOM; the cursor
   listeners live on that same canvas, so they are collected with it on route
   change. Every colour is read live from the theme, file:// safe, no network.
   --------------------------------------------------------------------------- */
function renderPrerequisiteMatrixSandbox(body) {
    // The function catalogue. Graph-mode entries expose f, df and a viewport; the
    // complex entry is flagged so the canvas swaps to a unit-circle parameterisation.
    const u1_s10_CATALOG = {
        poly: {
            label: "Polynomial xⁿ", mode: "graph",
            f: function (x) { return x * x * x; }, df: function (x) { return 3 * x * x; },
            domain: "all real x  ∈ (−∞, ∞)",
            range: "all real y  ∈ (−∞, ∞)   (odd power)",
            deriv: "d/dx xⁿ = n·xⁿ⁻¹    →    d/dx x³ = 3x²",
            inverse: "One-to-one for odd powers (x³ ↔ ∛x). Even powers need a domain restriction such as x ≥ 0.",
            xMin: -3, xMax: 3, yMin: -6, yMax: 6, node: 1.2
        },
        exp: {
            label: "Exponential eˣ", mode: "graph",
            f: function (x) { return Math.exp(x); }, df: function (x) { return Math.exp(x); },
            domain: "all real x  ∈ (−∞, ∞)",
            range: "y > 0  ∈ (0, ∞)",
            deriv: "d/dx eˣ = eˣ    (equals its own derivative)",
            inverse: "Bijective ℝ → (0, ∞); the inverse is ln x.",
            xMin: -3, xMax: 3, yMin: -1, yMax: 8, node: 1.0
        },
        log: {
            label: "Logarithmic ln x", mode: "graph",
            f: function (x) { return Math.log(x); }, df: function (x) { return 1 / x; },
            domain: "x > 0  ∈ (0, ∞)   (left half forbidden)",
            range: "all real y  ∈ (−∞, ∞)",
            deriv: "d/dx ln x = 1/x    (explodes as x → 0⁺)",
            inverse: "Bijective (0, ∞) → ℝ; the inverse is eˣ.",
            xMin: -1, xMax: 7, yMin: -4, yMax: 3, node: 2.0, domLow: 0.01
        },
        step: {
            label: "Piecewise Step ⌊x⌋", mode: "graph", step: true,
            f: function (x) { return Math.floor(x); }, df: function () { return 0; },
            domain: "all real x  ∈ (−∞, ∞)",
            range: "integers  y ∈ ℤ",
            deriv: "f′(x) = 0 on each tread; undefined at the integer jumps",
            inverse: "Not one-to-one (constant on each step) — no inverse exists.",
            xMin: -3, xMax: 3, yMin: -4, yMax: 4, node: 1.5
        },
        trig: {
            label: "Trigonometric sin x", mode: "graph",
            f: function (x) { return Math.sin(x); }, df: function (x) { return Math.cos(x); },
            domain: "all real x  ∈ (−∞, ∞)",
            range: "−1 ≤ y ≤ 1  ∈ [−1, 1]",
            deriv: "d/dx sin x = cos x",
            inverse: "Invertible only on [−π/2, π/2]; the inverse is arcsin x.",
            xMin: -6.5, xMax: 6.5, yMin: -2, yMax: 2, node: 0.8
        },
        complex: {
            label: "Complex e^{iθ}", mode: "complex",
            domain: "all real θ  ∈ (−∞, ∞)",
            range: "the unit circle  |z| = 1",
            deriv: "d/dθ e^{iθ} = i·e^{iθ}    (tangent, 90° ahead)",
            inverse: "Multivalued — the complex logarithm, fixed by choosing a 2π branch.",
            node: Math.PI / 4
        }
    };
    const u1_s10_state = { key: "poly", t: 1.2 }; // t = world-x (graph) or θ (complex)

    // --- Split dashboard shell ---
    const u1_s10_wrap = document.createElement("div");
    u1_s10_wrap.style.display = "flex";
    u1_s10_wrap.style.flexWrap = "wrap";
    u1_s10_wrap.style.gap = "1rem";
    u1_s10_wrap.style.alignItems = "stretch";

    const u1_s10_controls = document.createElement("div");
    u1_s10_controls.style.flex = "1 1 250px";
    u1_s10_controls.style.minWidth = "250px";
    u1_s10_controls.style.padding = "1rem";
    u1_s10_controls.style.background = "var(--panel-bg)";
    u1_s10_controls.style.border = "1px solid var(--panel-border)";
    u1_s10_controls.style.borderRadius = "10px";

    const u1_s10_stage = document.createElement("div");
    u1_s10_stage.style.flex = "2 1 340px";
    u1_s10_stage.style.minWidth = "300px";
    u1_s10_stage.style.position = "relative"; // anchors the floating badge

    u1_s10_wrap.appendChild(u1_s10_controls);
    u1_s10_wrap.appendChild(u1_s10_stage);
    body.appendChild(u1_s10_wrap);

    const u1_s10_intro = document.createElement("p");
    u1_s10_intro.className = "checkpoint-intro";
    u1_s10_intro.textContent = "Pick a benchmark function to audit it. The desk lists its domain, range, derivative, and inverse rule; sweep the graph to ride the node along the curve and read the live value and instantaneous slope.";
    u1_s10_controls.appendChild(u1_s10_intro);

    // --- Control hub: the function selector button group ---
    u0SandboxToggleGroup(u1_s10_controls, "Core prerequisite functions",
        [
            { value: "poly", label: "xⁿ" },
            { value: "exp", label: "eˣ" },
            { value: "log", label: "ln x" },
            { value: "step", label: "Step" },
            { value: "trig", label: "sin x" },
            { value: "complex", label: "e^{iθ}" }
        ],
        function () { return u1_s10_state.key; },
        function (val) {
            u1_s10_state.key = val;
            u1_s10_state.t = u1_s10_CATALOG[val].node; // reset node to the function's default
            u1_s10_syncDesk();
        });

    // --- Information desk: properties of the active function ---
    const u1_s10_desk = document.createElement("div");
    u1_s10_desk.style.marginTop = "0.85rem";
    u1_s10_desk.style.padding = "0.75rem 0.85rem";
    u1_s10_desk.style.background = "var(--bg-color)";
    u1_s10_desk.style.border = "1px solid var(--panel-border)";
    u1_s10_desk.style.borderRadius = "8px";
    u1_s10_controls.appendChild(u1_s10_desk);

    function u1_s10_deskRow(term, value, accentValue) {
        const row = document.createElement("div");
        row.style.marginBottom = "0.55rem";
        const t = document.createElement("div");
        t.textContent = term;
        t.style.fontSize = "0.72rem";
        t.style.fontWeight = "700";
        t.style.textTransform = "uppercase";
        t.style.letterSpacing = "0.04em";
        t.style.color = "var(--text-secondary)";
        const v = document.createElement("div");
        v.textContent = value;
        v.style.fontSize = "0.92rem";
        v.style.fontFamily = "Consolas, Monaco, monospace";
        v.style.color = accentValue ? "var(--accent-color)" : "var(--text-color)";
        v.style.marginTop = "0.1rem";
        v.style.wordBreak = "break-word";
        row.appendChild(t);
        row.appendChild(v);
        return row;
    }

    function u1_s10_syncDesk() {
        const cfg = u1_s10_CATALOG[u1_s10_state.key];
        u1_s10_desk.innerHTML = "";
        const head = document.createElement("div");
        head.textContent = cfg.label;
        head.style.fontSize = "1.05rem";
        head.style.fontWeight = "700";
        head.style.color = "var(--accent-text)";
        head.style.marginBottom = "0.6rem";
        u1_s10_desk.appendChild(head);
        u1_s10_desk.appendChild(u1_s10_deskRow("Domain", cfg.domain));
        u1_s10_desk.appendChild(u1_s10_deskRow("Range", cfg.range));
        u1_s10_desk.appendChild(u1_s10_deskRow("Derivative", cfg.deriv, true));
        u1_s10_desk.appendChild(u1_s10_deskRow("Inverse existence", cfg.inverse));
    }
    u1_s10_syncDesk();

    // --- Interactive sheet: canvas + floating badge ---
    const u1_s10_canvas = document.createElement("canvas");
    u1_s10_canvas.width = 640;
    u1_s10_canvas.height = 440;
    u1_s10_canvas.className = "math-canvas";
    u1_s10_canvas.style.cursor = "crosshair";
    u1_s10_canvas.style.display = "block";
    u1_s10_stage.appendChild(u1_s10_canvas);
    const u1_s10_ctx = u1_s10_canvas.getContext("2d");

    const u1_s10_badge = document.createElement("div");
    u1_s10_badge.style.position = "absolute";
    u1_s10_badge.style.pointerEvents = "none";
    u1_s10_badge.style.padding = "0.35rem 0.55rem";
    u1_s10_badge.style.fontFamily = "Consolas, Monaco, monospace";
    u1_s10_badge.style.fontSize = "0.8rem";
    u1_s10_badge.style.fontWeight = "700";
    u1_s10_badge.style.lineHeight = "1.4";
    u1_s10_badge.style.whiteSpace = "nowrap";
    u1_s10_badge.style.background = "var(--panel-bg)";
    u1_s10_badge.style.color = "var(--text-color)";
    u1_s10_badge.style.border = "1px solid var(--accent-color)";
    u1_s10_badge.style.borderRadius = "7px";
    u1_s10_badge.style.boxShadow = "0 2px 8px var(--shadow-color)";
    u1_s10_badge.style.transform = "translate(-50%, -130%)";
    u1_s10_stage.appendChild(u1_s10_badge);

    // Shared plot padding so the draw loop and the cursor mapping agree.
    const u1_s10_pad = { L: 46, R: 18, T: 18, B: 30 };

    // Current viewport for the active function (graph mode).
    function u1_s10_view() {
        const cfg = u1_s10_CATALOG[u1_s10_state.key];
        return { xMin: cfg.xMin, xMax: cfg.xMax, yMin: cfg.yMin, yMax: cfg.yMax };
    }

    // Cursor -> node. Graph mode maps pointer-x to world-x (clamped to domain);
    // complex mode maps the pointer's angle about the centre to θ.
    u1_s10_canvas.addEventListener("mousemove", function (ev) {
        const rect = u1_s10_canvas.getBoundingClientRect();
        const cx = (ev.clientX - rect.left) * (u1_s10_canvas.width / rect.width);
        const cy = (ev.clientY - rect.top) * (u1_s10_canvas.height / rect.height);
        const cfg = u1_s10_CATALOG[u1_s10_state.key];
        if (cfg.mode === "complex") {
            const W = u1_s10_canvas.width, H = u1_s10_canvas.height;
            u1_s10_state.t = Math.atan2(-(cy - H / 2), cx - W / 2);
        } else {
            const v = u1_s10_view();
            const plotW = u1_s10_canvas.width - u1_s10_pad.L - u1_s10_pad.R;
            let x = v.xMin + (cx - u1_s10_pad.L) / plotW * (v.xMax - v.xMin);
            x = Math.max(v.xMin, Math.min(v.xMax, x));
            if (cfg.domLow !== undefined) x = Math.max(cfg.domLow, x);
            u1_s10_state.t = x;
        }
    });

    function u1_s10_drawGraph(cfg) {
        const ctx = u1_s10_ctx;
        const W = u1_s10_canvas.width, H = u1_s10_canvas.height;
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const locked = u0SandboxColor("--locked-color", "#9aa0b4");
        const bg = u0SandboxColor("--bg-color", "#ffffff");

        const v = u1_s10_view();
        const plotW = W - u1_s10_pad.L - u1_s10_pad.R, plotH = H - u1_s10_pad.T - u1_s10_pad.B;
        function pxX(x) { return u1_s10_pad.L + (x - v.xMin) / (v.xMax - v.xMin) * plotW; }
        function pxY(y) { return u1_s10_pad.T + (v.yMax - y) / (v.yMax - v.yMin) * plotH; }
        function clampY(Y) { return Math.max(u1_s10_pad.T - 240, Math.min(H - u1_s10_pad.B + 240, Y)); }

        // Forbidden-domain wash for ln x (x <= 0).
        if (cfg.domLow !== undefined && v.xMin < 0) {
            ctx.fillStyle = locked;
            ctx.globalAlpha = 0.16;
            ctx.fillRect(pxX(v.xMin), u1_s10_pad.T, pxX(0) - pxX(v.xMin), plotH);
            ctx.globalAlpha = 1;
        }

        // Grid + numeric labels.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.fillStyle = sub;
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        for (let gx = Math.ceil(v.xMin); gx <= v.xMax; gx++) {
            const X = pxX(gx);
            ctx.beginPath(); ctx.moveTo(X, u1_s10_pad.T); ctx.lineTo(X, H - u1_s10_pad.B); ctx.stroke();
            if (gx !== 0) ctx.fillText(String(gx), X, pxY(0) + 12);
        }
        ctx.textAlign = "right";
        for (let gy = Math.ceil(v.yMin); gy <= v.yMax; gy++) {
            const Y = pxY(gy);
            ctx.beginPath(); ctx.moveTo(u1_s10_pad.L, Y); ctx.lineTo(W - u1_s10_pad.R, Y); ctx.stroke();
            if (gy !== 0) ctx.fillText(String(gy), u1_s10_pad.L - 6, Y + 3);
        }
        // Axes.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.4;
        if (v.yMin < 0 && v.yMax > 0) { ctx.beginPath(); ctx.moveTo(u1_s10_pad.L, pxY(0)); ctx.lineTo(W - u1_s10_pad.R, pxY(0)); ctx.stroke(); }
        if (v.xMin < 0 && v.xMax > 0) { ctx.beginPath(); ctx.moveTo(pxX(0), u1_s10_pad.T); ctx.lineTo(pxX(0), H - u1_s10_pad.B); ctx.stroke(); }

        // The function curve. The step function draws as flat treads so the jumps
        // read as genuine discontinuities rather than a connected ramp.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.6;
        if (cfg.step) {
            for (let k = Math.floor(v.xMin); k <= v.xMax; k++) {
                const x0 = Math.max(v.xMin, k), x1 = Math.min(v.xMax, k + 1);
                if (x1 <= x0) continue;
                const Y = clampY(pxY(cfg.f(x0 + 0.001)));
                ctx.beginPath();
                ctx.moveTo(pxX(x0), Y);
                ctx.lineTo(pxX(x1), Y);
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            let started = false;
            const STEPS = 480;
            for (let i = 0; i <= STEPS; i++) {
                const x = v.xMin + (v.xMax - v.xMin) * (i / STEPS);
                if (cfg.domLow !== undefined && x <= cfg.domLow) { started = false; continue; }
                const Y = clampY(pxY(cfg.f(x)));
                if (!started) { ctx.moveTo(pxX(x), Y); started = true; } else ctx.lineTo(pxX(x), Y);
            }
            ctx.stroke();
        }

        // Node at (t, f(t)).
        const x = u1_s10_state.t;
        const y = cfg.f(x), slope = cfg.df(x);
        const nx = pxX(x), ny = clampY(pxY(y));

        // Crosshair down to the axes.
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(nx, pxY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(pxX(0) < u1_s10_pad.L ? u1_s10_pad.L : pxX(0), ny); ctx.stroke();
        ctx.restore();

        // Local tangent indicator (slope f'(x)) - skipped for the step's flat treads
        // would still be valid (slope 0), so we draw it for every graph function.
        const dxw = (v.xMax - v.xMin) * 0.12;
        ctx.strokeStyle = good;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pxX(x - dxw), clampY(pxY(y - slope * dxw)));
        ctx.lineTo(pxX(x + dxw), clampY(pxY(y + slope * dxw)));
        ctx.stroke();

        // Node dot.
        ctx.fillStyle = text;
        ctx.beginPath(); ctx.arc(nx, ny, 6, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();

        // Floating badge.
        const slopeText = cfg.step
            ? (Math.abs(x - Math.round(x)) < 0.02 ? "undef (jump)" : "0")
            : slope.toFixed(3);
        u1_s10_badge.innerHTML = "x = " + x.toFixed(3) + "<br>f(x) = " + y.toFixed(3) + "<br>f′(x) = " + slopeText;
        u1_s10_placeBadge(nx, ny);
    }

    function u1_s10_drawComplex(cfg) {
        const ctx = u1_s10_ctx;
        const W = u1_s10_canvas.width, H = u1_s10_canvas.height;
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const text = u0SandboxColor("--text-color", "#1a1a1a");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const bg = u0SandboxColor("--bg-color", "#ffffff");

        const cxC = W / 2, cyC = H / 2;
        const R = Math.min(W, H) * 0.36;

        // Axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(20, cyC); ctx.lineTo(W - 20, cyC); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cxC, 20); ctx.lineTo(cxC, H - 20); ctx.stroke();
        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Real", W - 44, cyC - 8);
        ctx.textAlign = "center";
        ctx.fillText("Imaginary", cxC + 46, 22);

        // Unit circle.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(cxC, cyC, R, 0, 2 * Math.PI); ctx.stroke();

        const th = u1_s10_state.t;
        const c = Math.cos(th), s = Math.sin(th);
        const px = cxC + c * R, py = cyC - s * R;

        // Tangent (rotational derivative i·e^{iθ}) at the node.
        ctx.strokeStyle = good;
        ctx.lineWidth = 2;
        const tlen = R * 0.5;
        u0SandboxArrow(ctx, px, py, px + (-s) * tlen, py - (c) * tlen, good, 2.5);

        // Radius vector + node.
        u0SandboxArrow(ctx, cxC, cyC, px, py, accent, 3);
        ctx.fillStyle = text;
        ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();

        const norm = (th < 0 ? th + 2 * Math.PI : th);
        u1_s10_badge.innerHTML = "θ = " + norm.toFixed(3) + " rad<br>e^{iθ} = " + c.toFixed(3) + " + " + s.toFixed(3) + "i<br>d/dθ = i·e^{iθ}";
        u1_s10_placeBadge(px, py);
    }

    // Position the floating badge over the node, in CSS pixels, clamped to the stage.
    function u1_s10_placeBadge(nodeCanvasX, nodeCanvasY) {
        const scaleX = u1_s10_canvas.clientWidth / u1_s10_canvas.width;
        const scaleY = u1_s10_canvas.clientHeight / u1_s10_canvas.height;
        let left = nodeCanvasX * scaleX;
        let top = nodeCanvasY * scaleY;
        left = Math.max(60, Math.min(u1_s10_canvas.clientWidth - 60, left));
        top = Math.max(34, top);
        u1_s10_badge.style.left = left + "px";
        u1_s10_badge.style.top = top + "px";
    }

    function u1_s10_draw() {
        const ctx = u1_s10_ctx;
        const W = u1_s10_canvas.width, H = u1_s10_canvas.height;
        ctx.fillStyle = u0SandboxColor("--bg-color", "#ffffff");
        ctx.fillRect(0, 0, W, H);
        const cfg = u1_s10_CATALOG[u1_s10_state.key];
        if (cfg.mode === "complex") u1_s10_drawComplex(cfg); else u1_s10_drawGraph(cfg);
    }

    function u1_s10_frame() {
        if (!document.body.contains(u1_s10_canvas)) return; // self-terminate on route change
        u1_s10_draw();
        requestAnimationFrame(u1_s10_frame);
    }
    requestAnimationFrame(u1_s10_frame);
}

/* ============================================================================
   Unit 2 Cluster III sandbox engines

   Three self-contained, ungraded exploration surfaces for the first-order linear
   toolkit, mounted by mountVisualizer. Shared rules (identical to the Unit 0/1
   clusters):
     - Every DOM id and the meaningful internal state is namespaced under a strict
       u2_s1_ / u2_s2_ / u2_s3_ prefix, so nothing they create can collide in
       global memory with another engine or another card.
     - All canvas colours are read live from the document's theme custom
       properties (--bg-color, --accent-color, ...) at draw time, so Light and
       Dark both look native and a mid-session theme toggle repaints in place.
     - No fetch, CDN, or remote script loading: each engine runs unchanged from
       the file:// protocol.
     - Animation loops self-terminate once their canvas leaves the DOM (the back
       action empties the container), so navigating away leaves no orphan frames.
   They reuse the shared u0Sandbox* helpers (colour, arrow, toggle group, slider);
   those are generic despite the u0 name, so borrowing them keeps the cluster DRY.
   ============================================================================ */

/* ---------------------------------------------------------------------------
   Sandbox 1 - The Integrating Factor Product Engine (u2_s1_)

   Left: pick P(x) from {2, 1/x, 2x}; a canvas graphs P(x) (accent) against its
   antiderivative ∫P dx (success), the exponent that builds μ. Right: a live
   algebra ribbon that walks y' + P y = Q through multiplication by
   μ(x) = e^{∫P dx} and the reverse product rule, with a highlight that cycles to
   the collapse step d/dx[μ·y] = μ·Q so the condensation reads as a motion.
   --------------------------------------------------------------------------- */
function renderIntegratingFactorBuilderSandbox(body) {
    // Each option carries P(x), its antiderivative (the exponent of μ), and the
    // pre-simplified μ label so no symbolic engine is needed at draw time.
    const u2_s1_OPTIONS = [
        { key: "2",   P: function (x) { return 2; },     I: function (x) { return 2 * x; },         pLabel: "P(x) = 2",    iLabel: "∫P dx = 2x",      muLabel: "μ(x) = e^{2x}" },
        { key: "1/x", P: function (x) { return 1 / x; }, I: function (x) { return Math.log(x); },   pLabel: "P(x) = 1/x",  iLabel: "∫P dx = ln|x|",   muLabel: "μ(x) = e^{ln x} = x" },
        { key: "2x",  P: function (x) { return 2 * x; }, I: function (x) { return x * x; },         pLabel: "P(x) = 2x",   iLabel: "∫P dx = x²",  muLabel: "μ(x) = e^{x²}" }
    ];
    const u2_s1_state = { optKey: "2", phase: 0, tick: 0 };
    function u2_s1_opt() {
        for (let i = 0; i < u2_s1_OPTIONS.length; i++) {
            if (u2_s1_OPTIONS[i].key === u2_s1_state.optKey) return u2_s1_OPTIONS[i];
        }
        return u2_s1_OPTIONS[0];
    }

    const u2_s1_intro = document.createElement("p");
    u2_s1_intro.className = "checkpoint-intro";
    u2_s1_intro.textContent = "A first-order linear equation y' + P(x)y = Q(x) is not directly integrable: the left side is a sum, not a derivative. Multiply through by the integrating factor μ(x) = e^{∫P dx} and the sum collapses into one clean product-rule derivative, d/dx[μ·y]. Pick a P(x) and watch the factor build.";
    body.appendChild(u2_s1_intro);

    // Two-column workspace: graph on the left, algebra ribbon on the right. Wraps
    // to a single column on narrow viewports via flex-wrap.
    const u2_s1_cols = document.createElement("div");
    u2_s1_cols.style.display = "flex";
    u2_s1_cols.style.flexWrap = "wrap";
    u2_s1_cols.style.gap = "1rem";
    u2_s1_cols.style.alignItems = "flex-start";
    body.appendChild(u2_s1_cols);

    const u2_s1_left = document.createElement("div");
    u2_s1_left.style.flex = "1 1 320px";
    u2_s1_left.style.minWidth = "300px";
    u2_s1_cols.appendChild(u2_s1_left);

    const u2_s1_right = document.createElement("div");
    u2_s1_right.style.flex = "1 1 320px";
    u2_s1_right.style.minWidth = "300px";
    u2_s1_cols.appendChild(u2_s1_right);

    // Left: the P(x) chooser, then the dual-curve canvas.
    u0SandboxToggleGroup(u2_s1_left, "Choose P(x)", [
        { label: "2", value: "2" },
        { label: "1/x", value: "1/x" },
        { label: "2x", value: "2x" }
    ], function () { return u2_s1_state.optKey; }, function (v) {
        u2_s1_state.optKey = v;
        u2_s1_state.phase = 0;
        u2_s1_state.tick = 0;
        u2_s1_refreshSteps();
    });

    const u2_s1_canvas = document.createElement("canvas");
    u2_s1_canvas.width = 560;
    u2_s1_canvas.height = 340;
    u2_s1_canvas.className = "math-canvas";
    u2_s1_left.appendChild(u2_s1_canvas);
    const u2_s1_ctx = u2_s1_canvas.getContext("2d");

    // The μ badge: the headline result, recomputed when P changes.
    const u2_s1_muBadge = document.createElement("div");
    u2_s1_muBadge.style.fontFamily = "Consolas, Monaco, monospace";
    u2_s1_muBadge.style.fontSize = "1.05rem";
    u2_s1_muBadge.style.fontWeight = "700";
    u2_s1_muBadge.style.textAlign = "center";
    u2_s1_muBadge.style.padding = "0.55rem 0.7rem";
    u2_s1_muBadge.style.borderRadius = "8px";
    u2_s1_muBadge.style.background = "var(--accent-soft)";
    u2_s1_muBadge.style.color = "var(--accent-text)";
    u2_s1_muBadge.style.border = "1px solid var(--panel-border)";
    u2_s1_left.appendChild(u2_s1_muBadge);

    // Right: the algebra ribbon. Each step is a row; a cycling highlight marks
    // the active line so the collapse reads as a progression.
    const u2_s1_ribbonTitle = document.createElement("div");
    u2_s1_ribbonTitle.textContent = "The collapse, step by step";
    u2_s1_ribbonTitle.style.fontSize = "0.78rem";
    u2_s1_ribbonTitle.style.fontWeight = "700";
    u2_s1_ribbonTitle.style.textTransform = "uppercase";
    u2_s1_ribbonTitle.style.letterSpacing = "0.04em";
    u2_s1_ribbonTitle.style.color = "var(--text-secondary)";
    u2_s1_ribbonTitle.style.marginBottom = "0.5rem";
    u2_s1_right.appendChild(u2_s1_ribbonTitle);

    const u2_s1_stepRows = [];
    const u2_s1_stepBox = document.createElement("div");
    u2_s1_stepBox.style.display = "flex";
    u2_s1_stepBox.style.flexDirection = "column";
    u2_s1_stepBox.style.gap = "0.45rem";
    u2_s1_right.appendChild(u2_s1_stepBox);

    for (let i = 0; i < 5; i++) {
        const row = document.createElement("div");
        row.style.fontFamily = "Consolas, Monaco, monospace";
        row.style.fontSize = "0.95rem";
        row.style.padding = "0.55rem 0.7rem";
        row.style.borderRadius = "8px";
        row.style.border = "1px solid var(--panel-border)";
        row.style.background = "var(--panel-bg)";
        row.style.color = "var(--text-color)";
        row.style.transition = "background 0.25s, border-color 0.25s";
        u2_s1_stepBox.appendChild(row);
        u2_s1_stepRows.push(row);
    }

    // Rebuilds step text (and the μ badge) for the current P, and resets the
    // highlight. Step 3 (index 3) is the product-rule collapse - the payoff line.
    function u2_s1_refreshSteps() {
        const o = u2_s1_opt();
        u2_s1_muBadge.textContent = o.muLabel;
        const lines = [
            "y′ + P(x)·y = Q(x)",
            "μ·y′ + μ·P(x)·y = μ·Q(x)      (× μ)",
            "since μ′ = μ·P(x):   μ·y′ + μ′·y = μ·Q(x)",
            "⇒  d/dx[ μ·y ] = μ·Q(x)",
            "y = (1/μ) ∫ μ·Q(x) dx     with " + o.muLabel
        ];
        for (let i = 0; i < u2_s1_stepRows.length; i++) {
            u2_s1_stepRows[i].textContent = lines[i];
        }
    }
    u2_s1_refreshSteps();

    function u2_s1_paintHighlight() {
        for (let i = 0; i < u2_s1_stepRows.length; i++) {
            const on = i === u2_s1_state.phase;
            const collapse = i === 3;
            u2_s1_stepRows[i].style.background = on
                ? (collapse ? "var(--accent-color)" : "var(--accent-soft)")
                : "var(--panel-bg)";
            u2_s1_stepRows[i].style.color = on && collapse ? "var(--bg-color)" : "var(--text-color)";
            u2_s1_stepRows[i].style.borderColor = on ? "var(--accent-color)" : "var(--panel-border)";
            u2_s1_stepRows[i].style.fontWeight = on ? "700" : "500";
        }
    }

    function u2_s1_draw() {
        const ctx = u2_s1_ctx;
        const W = u2_s1_canvas.width, H = u2_s1_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const o = u2_s1_opt();
        const X0 = 0.25, X1 = 3.0;          // positive domain so 1/x and ln stay real
        const padL = 46, padR = 18, padT = 18, padB = 34;
        const plotW = W - padL - padR, plotH = H - padT - padB;

        // Autoscale Y across both sampled curves with a small pad.
        let yMin = Infinity, yMax = -Infinity;
        const SAMPLES = 200;
        for (let i = 0; i <= SAMPLES; i++) {
            const x = X0 + (X1 - X0) * (i / SAMPLES);
            const pv = o.P(x), iv = o.I(x);
            if (isFinite(pv)) { yMin = Math.min(yMin, pv); yMax = Math.max(yMax, pv); }
            if (isFinite(iv)) { yMin = Math.min(yMin, iv); yMax = Math.max(yMax, iv); }
        }
        if (!isFinite(yMin) || !isFinite(yMax)) { yMin = -1; yMax = 1; }
        const padY = (yMax - yMin) * 0.12 || 1;
        yMin -= padY; yMax += padY;
        if (yMin > 0) yMin = 0;             // always show the y = 0 baseline

        function pxX(x) { return padL + (x - X0) / (X1 - X0) * plotW; }
        function pxY(y) { return padT + (yMax - y) / (yMax - yMin) * plotH; }

        // Axes + zero baseline.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(padL, padT, plotW, plotH);
        const y0 = pxY(0);
        if (y0 >= padT && y0 <= padT + plotH) {
            ctx.strokeStyle = sub;
            ctx.beginPath(); ctx.moveTo(padL, y0); ctx.lineTo(padL + plotW, y0); ctx.stroke();
        }
        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("x", padL + plotW / 2, H - 8);

        // ∫P dx (the exponent) in success colour.
        ctx.strokeStyle = good;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
            const x = X0 + (X1 - X0) * (i / SAMPLES);
            const v = o.I(x);
            const X = pxX(x), Y = pxY(v);
            if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // P(x) in accent.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
            const x = X0 + (X1 - X0) * (i / SAMPLES);
            const v = o.P(x);
            const X = pxX(x), Y = pxY(v);
            if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // Legend.
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillStyle = accent;
        ctx.fillText(o.pLabel, padL + 8, padT + 16);
        ctx.fillStyle = good;
        ctx.fillText(o.iLabel, padL + 8, padT + 34);
    }

    function u2_s1_frame() {
        if (!document.body.contains(u2_s1_canvas)) return; // stop after navigation
        u2_s1_state.tick++;
        // Advance the highlight roughly every 0.8s (48 frames at ~60fps).
        if (u2_s1_state.tick % 48 === 0) {
            u2_s1_state.phase = (u2_s1_state.phase + 1) % u2_s1_stepRows.length;
        }
        u2_s1_draw();
        u2_s1_paintHighlight();
        requestAnimationFrame(u2_s1_frame);
    }
    requestAnimationFrame(u2_s1_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 2 - Linear Slope Field & Solution Threader (u2_s2_)

   A canvas slope field for y' = Q(x) - P(x)y with P(x) = p and Q(x) = q0 + q1 x,
   each on a slider. Clicking the grid drops a tracer seed that integrates both
   forward and backward by arc-length-parameterized RK4 (unit-tangent stepping,
   so steep regions thread cleanly), drawing a bold particular solution through
   the field. Seeds and field both repaint live as the sliders move.
   --------------------------------------------------------------------------- */
function renderLinearSlopeThreaderSandbox(body) {
    const u2_s2_X0 = -4, u2_s2_X1 = 4, u2_s2_Y0 = -4, u2_s2_Y1 = 4;
    const u2_s2_MAX_SEEDS = 8;
    const u2_s2_state = { seeds: [] };

    const u2_s2_intro = document.createElement("p");
    u2_s2_intro.className = "checkpoint-intro";
    u2_s2_intro.textContent = "The slope field draws y' = Q(x) − P(x)y at every grid point: the local direction a solution must follow. Set P(x) = p and Q(x) = q0 + q1·x with the sliders, then click anywhere to drop a tracer seed. It integrates forward and backward along the field to thread one particular solution curve.";
    body.appendChild(u2_s2_intro);

    const u2_s2_canvas = document.createElement("canvas");
    u2_s2_canvas.width = 560;
    u2_s2_canvas.height = 460;
    u2_s2_canvas.className = "math-canvas";
    u2_s2_canvas.style.cursor = "crosshair";
    body.appendChild(u2_s2_canvas);
    const u2_s2_ctx = u2_s2_canvas.getContext("2d");

    const u2_s2_pad = { L: 40, R: 16, T: 16, B: 30 };
    function u2_s2_plotW() { return u2_s2_canvas.width - u2_s2_pad.L - u2_s2_pad.R; }
    function u2_s2_plotH() { return u2_s2_canvas.height - u2_s2_pad.T - u2_s2_pad.B; }
    function u2_s2_pxX(x) { return u2_s2_pad.L + (x - u2_s2_X0) / (u2_s2_X1 - u2_s2_X0) * u2_s2_plotW(); }
    function u2_s2_pxY(y) { return u2_s2_pad.T + (u2_s2_Y1 - y) / (u2_s2_Y1 - u2_s2_Y0) * u2_s2_plotH(); }
    function u2_s2_worldX(px) { return u2_s2_X0 + (px - u2_s2_pad.L) / u2_s2_plotW() * (u2_s2_X1 - u2_s2_X0); }
    function u2_s2_worldY(py) { return u2_s2_Y1 - (py - u2_s2_pad.T) / u2_s2_plotH() * (u2_s2_Y1 - u2_s2_Y0); }

    // Control panel: P(x)=p, and Q(x)=q0+q1 x. Holders are read live each draw.
    const u2_s2_panel = document.createElement("div");
    u2_s2_panel.className = "slider-panel";
    body.appendChild(u2_s2_panel);
    const u2_s2_pS = u0SandboxSlider(u2_s2_panel, { label: "p  (in P(x) = p)", min: -1.5, max: 2.5, step: 0.1, value: 1, decimals: 1 });
    const u2_s2_q0S = u0SandboxSlider(u2_s2_panel, { label: "q0  (constant of Q)", min: -3, max: 3, step: 0.1, value: 1, decimals: 1 });
    const u2_s2_q1S = u0SandboxSlider(u2_s2_panel, { label: "q1  (slope of Q)", min: -2, max: 2, step: 0.1, value: 0, decimals: 1 });

    const u2_s2_clearBtn = document.createElement("button");
    u2_s2_clearBtn.type = "button";
    u2_s2_clearBtn.textContent = "Clear tracer seeds";
    u2_s2_clearBtn.style.font = "inherit";
    u2_s2_clearBtn.style.fontSize = "0.9rem";
    u2_s2_clearBtn.style.fontWeight = "600";
    u2_s2_clearBtn.style.marginTop = "0.6rem";
    u2_s2_clearBtn.style.padding = "0.4rem 0.9rem";
    u2_s2_clearBtn.style.borderRadius = "8px";
    u2_s2_clearBtn.style.cursor = "pointer";
    u2_s2_clearBtn.style.border = "1px solid var(--panel-border)";
    u2_s2_clearBtn.style.background = "var(--accent-soft)";
    u2_s2_clearBtn.style.color = "var(--accent-text)";
    u2_s2_clearBtn.addEventListener("click", function () { u2_s2_state.seeds.length = 0; });
    u2_s2_panel.appendChild(u2_s2_clearBtn);

    function u2_s2_slope(x, y) {
        return (u2_s2_q0S.value + u2_s2_q1S.value * x) - u2_s2_pS.value * y;
    }

    // Click drops a seed at the world coordinate under the pointer. The canvas
    // buffer and its CSS display size differ (width:100%), so scale the pointer
    // offset by buffer/displayed ratio before inverting to world space.
    u2_s2_canvas.addEventListener("click", function (e) {
        const rect = u2_s2_canvas.getBoundingClientRect();
        const bx = (e.clientX - rect.left) * (u2_s2_canvas.width / rect.width);
        const by = (e.clientY - rect.top) * (u2_s2_canvas.height / rect.height);
        const wx = u2_s2_worldX(bx), wy = u2_s2_worldY(by);
        if (wx < u2_s2_X0 || wx > u2_s2_X1 || wy < u2_s2_Y0 || wy > u2_s2_Y1) return;
        u2_s2_state.seeds.push({ x: wx, y: wy });
        if (u2_s2_state.seeds.length > u2_s2_MAX_SEEDS) u2_s2_state.seeds.shift();
    });

    // Unit-tangent of the solution curve at (x,y); dir = +1 forward, -1 backward.
    function u2_s2_tangent(x, y, dir) {
        const m = u2_s2_slope(x, y);
        const inv = 1 / Math.sqrt(1 + m * m);
        return { dx: dir * inv, dy: dir * m * inv };
    }

    // Integrates one direction from a seed by arc-length RK4 (ds fixed), returning
    // the polyline of world points until it leaves the plotted window.
    function u2_s2_integrate(seed, dir) {
        const ds = 0.05, MAX = 700;
        const pts = [{ x: seed.x, y: seed.y }];
        let x = seed.x, y = seed.y;
        for (let i = 0; i < MAX; i++) {
            const k1 = u2_s2_tangent(x, y, dir);
            const k2 = u2_s2_tangent(x + 0.5 * ds * k1.dx, y + 0.5 * ds * k1.dy, dir);
            const k3 = u2_s2_tangent(x + 0.5 * ds * k2.dx, y + 0.5 * ds * k2.dy, dir);
            const k4 = u2_s2_tangent(x + ds * k3.dx, y + ds * k3.dy, dir);
            x += ds / 6 * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
            y += ds / 6 * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy);
            if (x < u2_s2_X0 || x > u2_s2_X1 || y < u2_s2_Y0 || y > u2_s2_Y1) { pts.push({ x: x, y: y }); break; }
            pts.push({ x: x, y: y });
        }
        return pts;
    }

    function u2_s2_draw() {
        const ctx = u2_s2_ctx;
        const W = u2_s2_canvas.width, H = u2_s2_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Plot frame + axes.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(u2_s2_pad.L, u2_s2_pad.T, u2_s2_plotW(), u2_s2_plotH());
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.2;
        const ax0 = u2_s2_pxY(0), ay0 = u2_s2_pxX(0);
        ctx.beginPath(); ctx.moveTo(u2_s2_pad.L, ax0); ctx.lineTo(u2_s2_pad.L + u2_s2_plotW(), ax0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ay0, u2_s2_pad.T); ctx.lineTo(ay0, u2_s2_pad.T + u2_s2_plotH()); ctx.stroke();

        // Slope field: short unit segments coloured by the local direction.
        const NX = 21, NY = 17, segLen = 11;
        for (let i = 0; i < NX; i++) {
            for (let j = 0; j < NY; j++) {
                const x = u2_s2_X0 + (u2_s2_X1 - u2_s2_X0) * (i / (NX - 1));
                const y = u2_s2_Y0 + (u2_s2_Y1 - u2_s2_Y0) * (j / (NY - 1));
                const m = u2_s2_slope(x, y);
                const inv = 1 / Math.sqrt(1 + m * m);
                const ux = inv, uy = m * inv;
                const cx = u2_s2_pxX(x), cy = u2_s2_pxY(y);
                // Pixel-space tangent: +x world is +px, +y world is -px.
                const hx = segLen * ux, hy = -segLen * uy;
                ctx.strokeStyle = border;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(cx - hx, cy - hy);
                ctx.lineTo(cx + hx, cy + hy);
                ctx.stroke();
            }
        }

        // Each seed's threaded particular solution: backward + forward, bold.
        u2_s2_state.seeds.forEach(function (seed) {
            const back = u2_s2_integrate(seed, -1);
            const fwd = u2_s2_integrate(seed, 1);
            ctx.strokeStyle = accent;
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            let started = false;
            // Backward half, drawn from its far end in toward the seed.
            for (let k = back.length - 1; k >= 0; k--) {
                const X = u2_s2_pxX(back[k].x), Y = u2_s2_pxY(back[k].y);
                if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
            }
            for (let k = 1; k < fwd.length; k++) {
                const X = u2_s2_pxX(fwd[k].x), Y = u2_s2_pxY(fwd[k].y);
                ctx.lineTo(X, Y);
            }
            ctx.stroke();
            // The seed marker.
            ctx.fillStyle = good;
            ctx.beginPath();
            ctx.arc(u2_s2_pxX(seed.x), u2_s2_pxY(seed.y), 4.5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = bg;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        // Axis ticks / labels at the integer extents.
        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("x", u2_s2_pad.L + u2_s2_plotW() - 6, ax0 - 6);
        ctx.textAlign = "left";
        ctx.fillText("y", ay0 + 6, u2_s2_pad.T + 12);

        if (u2_s2_state.seeds.length === 0) {
            ctx.fillStyle = sub;
            ctx.font = "13px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Click the field to drop a tracer seed", u2_s2_pad.L + u2_s2_plotW() / 2, u2_s2_pad.T + u2_s2_plotH() / 2);
        }
    }

    function u2_s2_frame() {
        if (!document.body.contains(u2_s2_canvas)) return; // stop after navigation
        u2_s2_draw();
        requestAnimationFrame(u2_s2_frame);
    }
    requestAnimationFrame(u2_s2_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 3 - Transient vs. Steady-State Decomposition Matrix (u2_s3_)

   The standard linear solution y = C e^{-x} + (x - 1) decomposed live: the steady
   state x - 1 is a fixed dashed baseline, the transient C e^{-x} is a thin curve
   that decays to zero, and the full solution is the bold sum. A slider drives C;
   the rendered C eases toward the target so the family visibly morphs, and a
   readout reports the transient shrinking toward 0 as x grows.
   --------------------------------------------------------------------------- */
function renderGeneralParticularDecompositionSandbox(body) {
    const u2_s3_X0 = -1, u2_s3_X1 = 6, u2_s3_Y0 = -6, u2_s3_Y1 = 8;
    const u2_s3_state = { targetC: 2, dispC: 2 };

    function u2_s3_steady(x) { return x - 1; }
    function u2_s3_transient(C, x) { return C * Math.exp(-x); }
    function u2_s3_full(C, x) { return u2_s3_transient(C, x) + u2_s3_steady(x); }

    const u2_s3_intro = document.createElement("p");
    u2_s3_intro.className = "checkpoint-intro";
    u2_s3_intro.textContent = "Every solution of y' + y = x is y = C e^{−x} + (x − 1): one fixed steady state x − 1 plus a transient C e^{−x} that the initial condition picks. Slide C to sweep the whole family. The dashed line is the steady state; notice every curve collapses onto it as x grows, because the transient term vanishes.";
    body.appendChild(u2_s3_intro);

    const u2_s3_canvas = document.createElement("canvas");
    u2_s3_canvas.width = 600;
    u2_s3_canvas.height = 380;
    u2_s3_canvas.className = "math-canvas";
    body.appendChild(u2_s3_canvas);
    const u2_s3_ctx = u2_s3_canvas.getContext("2d");

    const u2_s3_panel = document.createElement("div");
    u2_s3_panel.className = "slider-panel";
    body.appendChild(u2_s3_panel);
    u0SandboxSlider(u2_s3_panel, {
        label: "C  (constant of integration)", min: -5, max: 5, step: 0.1, value: 2, decimals: 1,
        onChange: function (v) { u2_s3_state.targetC = v; }
    });

    const u2_s3_readout = document.createElement("div");
    u2_s3_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u2_s3_readout.style.fontSize = "0.95rem";
    u2_s3_readout.style.fontWeight = "700";
    u2_s3_readout.style.padding = "0.6rem 0.8rem";
    u2_s3_readout.style.marginTop = "0.4rem";
    u2_s3_readout.style.background = "var(--panel-bg)";
    u2_s3_readout.style.border = "1px solid var(--panel-border)";
    u2_s3_readout.style.borderRadius = "8px";
    u2_s3_readout.style.color = "var(--text-color)";
    body.appendChild(u2_s3_readout);

    const u2_s3_pad = { L: 44, R: 18, T: 18, B: 32 };
    function u2_s3_plotW() { return u2_s3_canvas.width - u2_s3_pad.L - u2_s3_pad.R; }
    function u2_s3_plotH() { return u2_s3_canvas.height - u2_s3_pad.T - u2_s3_pad.B; }
    function u2_s3_pxX(x) { return u2_s3_pad.L + (x - u2_s3_X0) / (u2_s3_X1 - u2_s3_X0) * u2_s3_plotW(); }
    function u2_s3_pxY(y) { return u2_s3_pad.T + (u2_s3_Y1 - y) / (u2_s3_Y1 - u2_s3_Y0) * u2_s3_plotH(); }

    function u2_s3_plotCurve(fn, color, width, dashed) {
        const ctx = u2_s3_ctx;
        ctx.save();
        if (dashed) ctx.setLineDash([7, 5]);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        const STEPS = 300;
        let started = false;
        for (let i = 0; i <= STEPS; i++) {
            const x = u2_s3_X0 + (u2_s3_X1 - u2_s3_X0) * (i / STEPS);
            const y = fn(x);
            if (y < u2_s3_Y0 - 2 || y > u2_s3_Y1 + 2) { started = false; continue; }
            const X = u2_s3_pxX(x), Y = u2_s3_pxY(y);
            if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();
        ctx.restore();
    }

    function u2_s3_draw() {
        const ctx = u2_s3_ctx;
        const W = u2_s3_canvas.width, H = u2_s3_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const text = u0SandboxColor("--text-color", "#1a1a1a");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Frame + gridlines on integer x and even y.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(u2_s3_pad.L, u2_s3_pad.T, u2_s3_plotW(), u2_s3_plotH());
        ctx.font = "11px sans-serif";
        for (let gx = 0; gx <= u2_s3_X1; gx++) {
            const X = u2_s3_pxX(gx);
            ctx.strokeStyle = border;
            ctx.beginPath(); ctx.moveTo(X, u2_s3_pad.T); ctx.lineTo(X, u2_s3_pad.T + u2_s3_plotH()); ctx.stroke();
            ctx.fillStyle = sub; ctx.textAlign = "center";
            ctx.fillText(String(gx), X, u2_s3_pad.T + u2_s3_plotH() + 14);
        }
        // Zero axis.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.2;
        const yAxis = u2_s3_pxY(0);
        ctx.beginPath(); ctx.moveTo(u2_s3_pad.L, yAxis); ctx.lineTo(u2_s3_pad.L + u2_s3_plotW(), yAxis); ctx.stroke();

        const C = u2_s3_state.dispC;

        // Steady state (dashed accent) - the fixed baseline.
        u2_s3_plotCurve(u2_s3_steady, accent, 2.2, true);
        // Transient component alone (thin, secondary) - the part that vanishes.
        u2_s3_plotCurve(function (x) { return u2_s3_transient(C, x); }, good, 1.8, false);
        // Full solution (bold) - the sum the student actually rides.
        u2_s3_plotCurve(function (x) { return u2_s3_full(C, x); }, text, 3, false);

        // Legend.
        ctx.textAlign = "left";
        ctx.font = "12px sans-serif";
        ctx.fillStyle = text; ctx.fillText("y = C e^{−x} + (x − 1)", u2_s3_pad.L + 8, u2_s3_pad.T + 16);
        ctx.fillStyle = accent; ctx.fillText("steady state  x − 1", u2_s3_pad.L + 8, u2_s3_pad.T + 34);
        ctx.fillStyle = good; ctx.fillText("transient  C e^{−x}", u2_s3_pad.L + 8, u2_s3_pad.T + 52);
    }

    function u2_s3_syncReadout() {
        const C = u2_s3_state.dispC;
        const t3 = u2_s3_transient(C, 3), t5 = u2_s3_transient(C, 5);
        u2_s3_readout.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "C = " + C.toFixed(2) + "    transient at x=0:  " + C.toFixed(2);
        l1.style.color = "var(--text-color)";
        const l2 = document.createElement("div");
        l2.textContent = "transient at x=3:  " + t3.toFixed(3) + "      at x=5:  " + t5.toFixed(3) + "   → 0";
        l2.style.color = "var(--accent-text)";
        l2.style.marginTop = "0.2rem";
        u2_s3_readout.appendChild(l1);
        u2_s3_readout.appendChild(l2);
    }

    function u2_s3_frame() {
        if (!document.body.contains(u2_s3_canvas)) return; // stop after navigation
        // Ease the rendered C toward the slider target so the family morphs.
        u2_s3_state.dispC += (u2_s3_state.targetC - u2_s3_state.dispC) * 0.12;
        u2_s3_draw();
        u2_s3_syncReadout();
        requestAnimationFrame(u2_s3_frame);
    }
    requestAnimationFrame(u2_s3_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 4 - Exact Equations & Conservative Vector Fields (u2_s4_)

   Toggles between an exact system (2xy dx + (x²+1) dy = 0) and an inexact one
   (2y dx + x² dy = 0). The (M, N) field is drawn as normalized arrows; the
   cross-partials ∂M/∂y and ∂N/∂x are computed and compared live. On a match a
   success badge lights and the potential's level curves F(x,y) = y(x²+1) = C are
   contoured; on a clash an error badge shows and contour tracking is blocked.
   --------------------------------------------------------------------------- */
function renderExactDifferentialSurfacesSandbox(body) {
    // Each system carries its M, N, the symbolic cross-partials, whether it is
    // exact, and (when exact) the potential F whose level sets y = C/(x²+1) are
    // the solution contours.
    const u2_s4_SYSTEMS = {
        exact: {
            label: "Exact:  2xy dx + (x²+1) dy = 0",
            M: function (x, y) { return 2 * x * y; },
            N: function (x, y) { return x * x + 1; },
            dMdy: "∂M/∂y = 2x",
            dNdx: "∂N/∂x = 2x",
            exact: true,
            potential: "F(x,y) = y(x² + 1) = C",
            level: function (C, x) { return C / (x * x + 1); }
        },
        inexact: {
            label: "Inexact:  2y dx + x² dy = 0",
            M: function (x, y) { return 2 * y; },
            N: function (x, y) { return x * x; },
            dMdy: "∂M/∂y = 2",
            dNdx: "∂N/∂x = 2x",
            exact: false,
            potential: null,
            level: null
        }
    };
    const u2_s4_state = { key: "exact" };
    function u2_s4_sys() { return u2_s4_SYSTEMS[u2_s4_state.key]; }

    const u2_s4_intro = document.createElement("p");
    u2_s4_intro.className = "checkpoint-intro";
    u2_s4_intro.textContent = "An equation M dx + N dy = 0 is exact when it is the total differential of a potential F, which happens exactly when ∂M/∂y = ∂N/∂x. Toggle the system: when the cross-partials match, the field is conservative and its solutions are the level curves F = C; when they clash, no potential exists and the contours are blocked.";
    body.appendChild(u2_s4_intro);

    u0SandboxToggleGroup(body, "Choose the system", [
        { label: "Exact", value: "exact" },
        { label: "Inexact", value: "inexact" }
    ], function () { return u2_s4_state.key; }, function (v) { u2_s4_state.key = v; });

    const u2_s4_canvas = document.createElement("canvas");
    u2_s4_canvas.width = 560;
    u2_s4_canvas.height = 440;
    u2_s4_canvas.className = "math-canvas";
    body.appendChild(u2_s4_canvas);
    const u2_s4_ctx = u2_s4_canvas.getContext("2d");

    // The cross-partial readout: two symbolic rows plus a verdict badge.
    const u2_s4_partials = document.createElement("div");
    u2_s4_partials.style.fontFamily = "Consolas, Monaco, monospace";
    u2_s4_partials.style.fontSize = "0.98rem";
    u2_s4_partials.style.fontWeight = "700";
    u2_s4_partials.style.padding = "0.6rem 0.8rem";
    u2_s4_partials.style.marginTop = "0.4rem";
    u2_s4_partials.style.background = "var(--panel-bg)";
    u2_s4_partials.style.border = "1px solid var(--panel-border)";
    u2_s4_partials.style.borderRadius = "8px";
    u2_s4_partials.style.color = "var(--text-color)";
    body.appendChild(u2_s4_partials);

    const u2_s4_badge = document.createElement("div");
    u2_s4_badge.style.fontWeight = "700";
    u2_s4_badge.style.textAlign = "center";
    u2_s4_badge.style.padding = "0.55rem 0.7rem";
    u2_s4_badge.style.marginTop = "0.5rem";
    u2_s4_badge.style.borderRadius = "8px";
    u2_s4_badge.style.border = "1px solid var(--panel-border)";
    body.appendChild(u2_s4_badge);

    const u2_s4_X0 = -3, u2_s4_X1 = 3, u2_s4_Y0 = -3, u2_s4_Y1 = 3;
    const u2_s4_pad = { L: 38, R: 16, T: 16, B: 30 };
    function u2_s4_plotW() { return u2_s4_canvas.width - u2_s4_pad.L - u2_s4_pad.R; }
    function u2_s4_plotH() { return u2_s4_canvas.height - u2_s4_pad.T - u2_s4_pad.B; }
    function u2_s4_pxX(x) { return u2_s4_pad.L + (x - u2_s4_X0) / (u2_s4_X1 - u2_s4_X0) * u2_s4_plotW(); }
    function u2_s4_pxY(y) { return u2_s4_pad.T + (u2_s4_Y1 - y) / (u2_s4_Y1 - u2_s4_Y0) * u2_s4_plotH(); }

    function u2_s4_syncReadout() {
        const s = u2_s4_sys();
        u2_s4_partials.innerHTML = "";
        const r1 = document.createElement("div");
        r1.textContent = s.dMdy;
        r1.style.color = "var(--accent-text)";
        const r2 = document.createElement("div");
        r2.textContent = s.dNdx;
        r2.style.color = "var(--accent-text)";
        r2.style.marginTop = "0.15rem";
        u2_s4_partials.appendChild(r1);
        u2_s4_partials.appendChild(r2);
        if (s.exact) {
            u2_s4_badge.textContent = "EXACT  ✓  ∂M/∂y = ∂N/∂x  →  " + s.potential;
            u2_s4_badge.style.background = "var(--success-color)";
            u2_s4_badge.style.color = "var(--bg-color)";
            u2_s4_badge.style.borderColor = "var(--success-color)";
        } else {
            u2_s4_badge.textContent = "NOT EXACT  ✗  ∂M/∂y ≠ ∂N/∂x  →  no potential, contours blocked";
            u2_s4_badge.style.background = "var(--error-color)";
            u2_s4_badge.style.color = "var(--bg-color)";
            u2_s4_badge.style.borderColor = "var(--error-color)";
        }
    }

    function u2_s4_draw() {
        const ctx = u2_s4_ctx;
        const W = u2_s4_canvas.width, H = u2_s4_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(u2_s4_pad.L, u2_s4_pad.T, u2_s4_plotW(), u2_s4_plotH());

        // Axes through the origin.
        ctx.strokeStyle = sub;
        ctx.lineWidth = 1.2;
        const ay = u2_s4_pxY(0), ax = u2_s4_pxX(0);
        ctx.beginPath(); ctx.moveTo(u2_s4_pad.L, ay); ctx.lineTo(u2_s4_pad.L + u2_s4_plotW(), ay); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax, u2_s4_pad.T); ctx.lineTo(ax, u2_s4_pad.T + u2_s4_plotH()); ctx.stroke();

        const s = u2_s4_sys();

        // (M, N) vector field as normalized arrows.
        const NX = 13, NY = 13, arrowLen = 13;
        for (let i = 0; i < NX; i++) {
            for (let j = 0; j < NY; j++) {
                const x = u2_s4_X0 + (u2_s4_X1 - u2_s4_X0) * (i / (NX - 1));
                const y = u2_s4_Y0 + (u2_s4_Y1 - u2_s4_Y0) * (j / (NY - 1));
                const vx = s.M(x, y), vy = s.N(x, y);
                const mag = Math.sqrt(vx * vx + vy * vy);
                if (mag < 1e-9) continue;
                const ux = vx / mag, uy = vy / mag;
                const cx = u2_s4_pxX(x), cy = u2_s4_pxY(y);
                // World +y is screen -y, so flip the vertical component.
                u0SandboxArrow(ctx, cx - arrowLen * ux, cy + arrowLen * uy, cx + arrowLen * ux, cy - arrowLen * uy, accent, 1.4);
            }
        }

        // Level-curve contours F = C, only when the system is exact.
        if (s.exact && s.level) {
            ctx.strokeStyle = good;
            ctx.lineWidth = 2.4;
            const CS = [-4, -3, -2, -1, 1, 2, 3, 4];
            CS.forEach(function (C) {
                ctx.beginPath();
                let started = false;
                const STEPS = 200;
                for (let k = 0; k <= STEPS; k++) {
                    const x = u2_s4_X0 + (u2_s4_X1 - u2_s4_X0) * (k / STEPS);
                    const y = s.level(C, x);
                    if (y < u2_s4_Y0 || y > u2_s4_Y1) { started = false; continue; }
                    const X = u2_s4_pxX(x), Y = u2_s4_pxY(y);
                    if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
                }
                ctx.stroke();
            });
        }

        // Caption: which system, and the contour status.
        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(s.label, u2_s4_pad.L + 6, u2_s4_pad.T + 14);
        ctx.fillStyle = s.exact ? good : sub;
        ctx.fillText(s.exact ? "level curves F = C drawn" : "contours blocked (not conservative)", u2_s4_pad.L + 6, u2_s4_pad.T + 32);
    }

    function u2_s4_frame() {
        if (!document.body.contains(u2_s4_canvas)) return; // stop after navigation
        u2_s4_draw();
        u2_s4_syncReadout();
        requestAnimationFrame(u2_s4_frame);
    }
    requestAnimationFrame(u2_s4_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 5 - Non-Linear Substitution & Transformation Warp (u2_s5_)

   A single canvas split into two plots. Left: the Bernoulli family
   y = 1/(1 + A e^x) solving y' + y = y². Right: the linear family v = 1 + A e^x
   solving the substituted v' - v = -1, where v = y^(1-n) = y^(-1) (n = 2). An x
   slider rides a cursor along the highlighted curve in both panes; a tracking
   arrow bridges the gutter, annotating the map v = 1/y point by point.
   --------------------------------------------------------------------------- */
function renderSubstitutionTransformationWarpSandbox(body) {
    const u2_s5_XA = -3, u2_s5_XB = 2;             // shared x-domain for both panes
    const u2_s5_A = [0.5, 1, 2];                   // the family constants
    const u2_s5_HILITE = 1;                        // index of the highlighted (A = 1) curve
    const u2_s5_state = { cursorX: -0.5 };

    function u2_s5_yBern(A, x) { return 1 / (1 + A * Math.exp(x)); }   // y = 1/(1 + A e^x)
    function u2_s5_vLin(A, x) { return 1 + A * Math.exp(x); }          // v = 1/y = 1 + A e^x

    const u2_s5_intro = document.createElement("p");
    u2_s5_intro.className = "checkpoint-intro";
    u2_s5_intro.textContent = "A Bernoulli equation y' + y = y² is nonlinear, but the substitution v = y^(1−n) = y^(−1) turns it into the linear equation v' − v = −1. Left is the tangled nonlinear family; right is the straightened linear family. Drag the x slider to watch a single point map across the warp by v = 1/y.";
    body.appendChild(u2_s5_intro);

    // The substitution badge: the algebraic bridge spelled out.
    const u2_s5_badge = document.createElement("div");
    u2_s5_badge.style.fontFamily = "Consolas, Monaco, monospace";
    u2_s5_badge.style.fontSize = "0.95rem";
    u2_s5_badge.style.fontWeight = "700";
    u2_s5_badge.style.textAlign = "center";
    u2_s5_badge.style.padding = "0.55rem 0.7rem";
    u2_s5_badge.style.marginBottom = "0.6rem";
    u2_s5_badge.style.borderRadius = "8px";
    u2_s5_badge.style.background = "var(--accent-soft)";
    u2_s5_badge.style.color = "var(--accent-text)";
    u2_s5_badge.style.border = "1px solid var(--panel-border)";
    u2_s5_badge.textContent = "y' + y = y²   →   v = y^(1−n) = y^(−1)   →   v' − v = −1";
    body.appendChild(u2_s5_badge);

    const u2_s5_canvas = document.createElement("canvas");
    u2_s5_canvas.width = 640;
    u2_s5_canvas.height = 360;
    u2_s5_canvas.className = "math-canvas";
    body.appendChild(u2_s5_canvas);
    const u2_s5_ctx = u2_s5_canvas.getContext("2d");

    const u2_s5_panel = document.createElement("div");
    u2_s5_panel.className = "slider-panel";
    body.appendChild(u2_s5_panel);
    u0SandboxSlider(u2_s5_panel, {
        label: "x  (evaluation coordinate)", min: u2_s5_XA, max: u2_s5_XB, step: 0.02, value: -0.5, decimals: 2,
        onChange: function (v) { u2_s5_state.cursorX = v; }
    });

    const u2_s5_readout = document.createElement("div");
    u2_s5_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u2_s5_readout.style.fontSize = "0.95rem";
    u2_s5_readout.style.fontWeight = "700";
    u2_s5_readout.style.padding = "0.6rem 0.8rem";
    u2_s5_readout.style.marginTop = "0.4rem";
    u2_s5_readout.style.background = "var(--panel-bg)";
    u2_s5_readout.style.border = "1px solid var(--panel-border)";
    u2_s5_readout.style.borderRadius = "8px";
    u2_s5_readout.style.color = "var(--text-color)";
    body.appendChild(u2_s5_readout);

    // Two plot regions sharing the canvas, split by a central gutter.
    const u2_s5_pad = { T: 30, B: 26 };
    const u2_s5_LX0 = 40, u2_s5_LX1 = 290;       // left pane pixel x-extent
    const u2_s5_RX0 = 350, u2_s5_RX1 = 624;      // right pane pixel x-extent
    const u2_s5_YL0 = 0, u2_s5_YL1 = 1.05;        // left pane (y) value range
    const u2_s5_YR0 = 0, u2_s5_YR1 = 17;          // right pane (v) value range
    function u2_s5_plotTop() { return u2_s5_pad.T; }
    function u2_s5_plotBot() { return u2_s5_canvas.height - u2_s5_pad.B; }
    function u2_s5_LpxX(x) { return u2_s5_LX0 + (x - u2_s5_XA) / (u2_s5_XB - u2_s5_XA) * (u2_s5_LX1 - u2_s5_LX0); }
    function u2_s5_LpxY(y) { return u2_s5_plotTop() + (u2_s5_YL1 - y) / (u2_s5_YL1 - u2_s5_YL0) * (u2_s5_plotBot() - u2_s5_plotTop()); }
    function u2_s5_RpxX(x) { return u2_s5_RX0 + (x - u2_s5_XA) / (u2_s5_XB - u2_s5_XA) * (u2_s5_RX1 - u2_s5_RX0); }
    function u2_s5_RpxY(v) { return u2_s5_plotTop() + (u2_s5_YR1 - v) / (u2_s5_YR1 - u2_s5_YR0) * (u2_s5_plotBot() - u2_s5_plotTop()); }

    function u2_s5_draw() {
        const ctx = u2_s5_ctx;
        const W = u2_s5_canvas.width, H = u2_s5_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const text = u0SandboxColor("--text-color", "#1a1a1a");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Pane frames + titles.
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(u2_s5_LX0, u2_s5_plotTop(), u2_s5_LX1 - u2_s5_LX0, u2_s5_plotBot() - u2_s5_plotTop());
        ctx.strokeRect(u2_s5_RX0, u2_s5_plotTop(), u2_s5_RX1 - u2_s5_RX0, u2_s5_plotBot() - u2_s5_plotTop());
        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Nonlinear  y = 1/(1 + A e^x)", (u2_s5_LX0 + u2_s5_LX1) / 2, u2_s5_plotTop() - 12);
        ctx.fillText("Linear  v = 1 + A e^x", (u2_s5_RX0 + u2_s5_RX1) / 2, u2_s5_plotTop() - 12);

        // The two families. The highlighted A = 1 curve is bold; the others faint.
        const STEPS = 160;
        u2_s5_A.forEach(function (A, idx) {
            const hot = idx === u2_s5_HILITE;
            // Left (Bernoulli).
            ctx.strokeStyle = hot ? accent : border;
            ctx.lineWidth = hot ? 2.8 : 1.4;
            ctx.beginPath();
            for (let k = 0; k <= STEPS; k++) {
                const x = u2_s5_XA + (u2_s5_XB - u2_s5_XA) * (k / STEPS);
                const X = u2_s5_LpxX(x), Y = u2_s5_LpxY(u2_s5_yBern(A, x));
                if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
            }
            ctx.stroke();
            // Right (linear), clipped to the pane's v range.
            ctx.strokeStyle = hot ? good : border;
            ctx.lineWidth = hot ? 2.8 : 1.4;
            ctx.beginPath();
            let started = false;
            for (let k = 0; k <= STEPS; k++) {
                const x = u2_s5_XA + (u2_s5_XB - u2_s5_XA) * (k / STEPS);
                const v = u2_s5_vLin(A, x);
                if (v > u2_s5_YR1) { started = false; continue; }
                const X = u2_s5_RpxX(x), Y = u2_s5_RpxY(v);
                if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
            }
            ctx.stroke();
        });

        // The cursor point on the highlighted curve in both panes.
        const A = u2_s5_A[u2_s5_HILITE];
        const cx = u2_s5_state.cursorX;
        const yv = u2_s5_yBern(A, cx), vv = u2_s5_vLin(A, cx);
        const lpx = u2_s5_LpxX(cx), lpy = u2_s5_LpxY(yv);
        const rpx = u2_s5_RpxX(cx), rpy = u2_s5_RpxY(Math.min(vv, u2_s5_YR1));

        // Tracking arrow bridging the gutter: the v = 1/y map made visible.
        u0SandboxArrow(ctx, lpx, lpy, rpx, rpy, text, 2);
        ctx.fillStyle = text;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("v = 1/y", (lpx + rpx) / 2, (lpy + rpy) / 2 - 8);

        [[lpx, lpy, accent], [rpx, rpy, good]].forEach(function (d) {
            ctx.fillStyle = d[2];
            ctx.beginPath(); ctx.arc(d[0], d[1], 5.5, 0, 2 * Math.PI); ctx.fill();
            ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
        });
    }

    function u2_s5_syncReadout() {
        const A = u2_s5_A[u2_s5_HILITE];
        const cx = u2_s5_state.cursorX;
        const yv = u2_s5_yBern(A, cx), vv = u2_s5_vLin(A, cx);
        u2_s5_readout.textContent = "x = " + cx.toFixed(2) + "    y = " + yv.toFixed(4) + "    →    v = y^(−1) = 1/y = " + vv.toFixed(4);
    }

    function u2_s5_frame() {
        if (!document.body.contains(u2_s5_canvas)) return; // stop after navigation
        u2_s5_draw();
        u2_s5_syncReadout();
        requestAnimationFrame(u2_s5_frame);
    }
    requestAnimationFrame(u2_s5_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 6 - Picard's Theorem Existence & Uniqueness Boundary (u2_s6_)

   Slope field for y' = y^(1/3), whose right side is not Lipschitz at y = 0, so
   Picard-Lindelöf cannot guarantee a unique solution there. Click to place the
   initial-condition node. Away from y = 0 the field has one well-defined curve;
   on the y = 0 boundary the engine animates the branching family - the zero
   solution and the delayed-departure power-law solutions y = ((2/3)(x - x1))^(3/2)
   that all pass through the same node, proving non-uniqueness.
   --------------------------------------------------------------------------- */
function renderExistenceUniquenessBreakdownSandbox(body) {
    const u2_s6_X0 = -4, u2_s6_X1 = 4, u2_s6_Y0 = -3, u2_s6_Y1 = 3;
    const u2_s6_BOUNDARY = 0.22;                  // |y0| under this counts as "on the boundary"
    const u2_s6_state = { x0: -1, y0: 0, grow: 0 };

    function u2_s6_slope(x, y) { return Math.cbrt(y); }   // y' = y^(1/3)

    const u2_s6_intro = document.createElement("p");
    u2_s6_intro.className = "checkpoint-intro";
    u2_s6_intro.textContent = "Picard-Lindelof guarantees a unique solution only where the right side is Lipschitz in y. For y' = y^(1/3) that fails at y = 0: the slope flattens but the derivative of the right side blows up. Click to place the initial condition. On the y = 0 line, watch infinitely many solution curves branch from one node - existence holds, uniqueness shatters.";
    body.appendChild(u2_s6_intro);

    const u2_s6_canvas = document.createElement("canvas");
    u2_s6_canvas.width = 600;
    u2_s6_canvas.height = 400;
    u2_s6_canvas.className = "math-canvas";
    u2_s6_canvas.style.cursor = "crosshair";
    body.appendChild(u2_s6_canvas);
    const u2_s6_ctx = u2_s6_canvas.getContext("2d");

    const u2_s6_badge = document.createElement("div");
    u2_s6_badge.style.fontWeight = "700";
    u2_s6_badge.style.textAlign = "center";
    u2_s6_badge.style.padding = "0.55rem 0.7rem";
    u2_s6_badge.style.marginTop = "0.4rem";
    u2_s6_badge.style.borderRadius = "8px";
    u2_s6_badge.style.border = "1px solid var(--panel-border)";
    body.appendChild(u2_s6_badge);

    const u2_s6_pad = { L: 38, R: 16, T: 16, B: 30 };
    function u2_s6_plotW() { return u2_s6_canvas.width - u2_s6_pad.L - u2_s6_pad.R; }
    function u2_s6_plotH() { return u2_s6_canvas.height - u2_s6_pad.T - u2_s6_pad.B; }
    function u2_s6_pxX(x) { return u2_s6_pad.L + (x - u2_s6_X0) / (u2_s6_X1 - u2_s6_X0) * u2_s6_plotW(); }
    function u2_s6_pxY(y) { return u2_s6_pad.T + (u2_s6_Y1 - y) / (u2_s6_Y1 - u2_s6_Y0) * u2_s6_plotH(); }
    function u2_s6_worldX(px) { return u2_s6_X0 + (px - u2_s6_pad.L) / u2_s6_plotW() * (u2_s6_X1 - u2_s6_X0); }
    function u2_s6_worldY(py) { return u2_s6_Y1 - (py - u2_s6_pad.T) / u2_s6_plotH() * (u2_s6_Y1 - u2_s6_Y0); }

    // Click drops the IC node at the world coordinate, restarting the branch grow.
    u2_s6_canvas.addEventListener("click", function (e) {
        const rect = u2_s6_canvas.getBoundingClientRect();
        const bx = (e.clientX - rect.left) * (u2_s6_canvas.width / rect.width);
        const by = (e.clientY - rect.top) * (u2_s6_canvas.height / rect.height);
        const wx = u2_s6_worldX(bx), wy = u2_s6_worldY(by);
        if (wx < u2_s6_X0 || wx > u2_s6_X1 || wy < u2_s6_Y0 || wy > u2_s6_Y1) return;
        u2_s6_state.x0 = wx;
        u2_s6_state.y0 = wy;
        u2_s6_state.grow = 0;     // re-animate the branches growing out
    });

    // RK4 in x for the generic field-following solution through the node.
    function u2_s6_integrate(dir) {
        const h = 0.04 * dir, MAX = 400;
        const pts = [{ x: u2_s6_state.x0, y: u2_s6_state.y0 }];
        let x = u2_s6_state.x0, y = u2_s6_state.y0;
        for (let i = 0; i < MAX; i++) {
            const k1 = u2_s6_slope(x, y);
            const k2 = u2_s6_slope(x + h / 2, y + h / 2 * k1);
            const k3 = u2_s6_slope(x + h / 2, y + h / 2 * k2);
            const k4 = u2_s6_slope(x + h, y + h * k3);
            y += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
            x += h;
            if (x < u2_s6_X0 || x > u2_s6_X1 || y < u2_s6_Y0 - 1 || y > u2_s6_Y1 + 1) break;
            pts.push({ x: x, y: y });
        }
        return pts;
    }

    function u2_s6_plotPoints(pts, color, width) {
        const ctx = u2_s6_ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < pts.length; i++) {
            if (pts[i].y < u2_s6_Y0 || pts[i].y > u2_s6_Y1) { started = false; continue; }
            const X = u2_s6_pxX(pts[i].x), Y = u2_s6_pxY(pts[i].y);
            if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();
    }

    function u2_s6_draw() {
        const ctx = u2_s6_ctx;
        const W = u2_s6_canvas.width, H = u2_s6_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const err = u0SandboxColor("--error-color", "#b00020");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(u2_s6_pad.L, u2_s6_pad.T, u2_s6_plotW(), u2_s6_plotH());

        // The y = 0 failure line, dashed, called out as the boundary.
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = err;
        ctx.lineWidth = 1.6;
        const yb = u2_s6_pxY(0);
        ctx.beginPath(); ctx.moveTo(u2_s6_pad.L, yb); ctx.lineTo(u2_s6_pad.L + u2_s6_plotW(), yb); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = err;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("y = 0  (Lipschitz fails)", u2_s6_pad.L + 6, yb - 5);

        // Slope field for y' = cbrt(y): short segments coloured by direction.
        const NX = 25, NY = 17, seg = 9;
        for (let i = 0; i < NX; i++) {
            for (let j = 0; j < NY; j++) {
                const x = u2_s6_X0 + (u2_s6_X1 - u2_s6_X0) * (i / (NX - 1));
                const y = u2_s6_Y0 + (u2_s6_Y1 - u2_s6_Y0) * (j / (NY - 1));
                const m = u2_s6_slope(x, y);
                const inv = 1 / Math.sqrt(1 + m * m);
                const cx = u2_s6_pxX(x), cy = u2_s6_pxY(y);
                ctx.strokeStyle = border;
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(cx - seg * inv, cy + seg * m * inv);
                ctx.lineTo(cx + seg * inv, cy - seg * m * inv);
                ctx.stroke();
            }
        }

        const onBoundary = Math.abs(u2_s6_state.y0) < u2_s6_BOUNDARY;
        const span = (u2_s6_X1 - u2_s6_state.x0) * u2_s6_state.grow;   // how far branches have grown

        if (onBoundary) {
            // Non-uniqueness: the zero solution plus delayed-departure power laws,
            // each leaving y = 0 at a later x1 and rising as ((2/3)(x - x1))^{3/2}.
            const x0 = u2_s6_state.x0;
            // The flat zero solution.
            u2_s6_plotPoints([{ x: u2_s6_X0, y: 0 }, { x: u2_s6_X1, y: 0 }], accent, 2.6);
            const departures = [0, 1.1, 2.2, 3.3];
            departures.forEach(function (d) {
                const x1 = x0 + d;
                const pts = [];
                const STEPS = 160;
                for (let k = 0; k <= STEPS; k++) {
                    const x = x0 + span * (k / STEPS);
                    let y = 0;
                    if (x > x1) { const s = (2 / 3) * (x - x1); y = Math.pow(s, 1.5); }
                    pts.push({ x: x, y: y });
                }
                u2_s6_plotPoints(pts, accent, 2.6);
                // The mirror (negative) branch for the first departure, to show both signs.
                if (d === 0) {
                    u2_s6_plotPoints(pts.map(function (p) { return { x: p.x, y: -p.y }; }), accent, 2.6);
                }
            });
            u2_s6_badge.textContent = "NON-UNIQUE  ✗  infinitely many solution curves through this node";
            u2_s6_badge.style.background = "var(--error-color)";
            u2_s6_badge.style.color = "var(--bg-color)";
            u2_s6_badge.style.borderColor = "var(--error-color)";
        } else {
            // Lipschitz away from y = 0: one curve, integrated both directions.
            const fwd = u2_s6_integrate(1), back = u2_s6_integrate(-1);
            // Trim the forward branch to the animated growth for visual parity.
            const shown = Math.max(2, Math.floor(fwd.length * u2_s6_state.grow));
            u2_s6_plotPoints(back, good, 2.8);
            u2_s6_plotPoints(fwd.slice(0, shown), good, 2.8);
            u2_s6_badge.textContent = "UNIQUE  ✓  Lipschitz here, exactly one solution through this node";
            u2_s6_badge.style.background = "var(--success-color)";
            u2_s6_badge.style.color = "var(--bg-color)";
            u2_s6_badge.style.borderColor = "var(--success-color)";
        }

        // The IC node marker.
        ctx.fillStyle = onBoundary ? err : good;
        ctx.beginPath();
        ctx.arc(u2_s6_pxX(u2_s6_state.x0), u2_s6_pxY(u2_s6_state.y0), 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = bg;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = sub;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("(x0, y0) = (" + u2_s6_state.x0.toFixed(2) + ", " + u2_s6_state.y0.toFixed(2) + ")", u2_s6_pad.L + u2_s6_plotW() - 6, u2_s6_pad.T + 16);
    }

    function u2_s6_frame() {
        if (!document.body.contains(u2_s6_canvas)) return; // stop after navigation
        // Ease the branch growth toward full extent so paths sweep out on placement.
        u2_s6_state.grow += (1 - u2_s6_state.grow) * 0.05;
        u2_s6_draw();
        requestAnimationFrame(u2_s6_frame);
    }
    requestAnimationFrame(u2_s6_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 7 - Velocity Drag & Terminal Velocity Thresholds (u2_s7_)

   Integrates m dv/dt = mg - k v^n in real time. A falling particle in a left
   lane visualizes the speed; a rolling time-domain plot on the right traces v(t)
   climbing toward the dashed analytical terminal velocity v_term = (mg/k)^(1/n).
   Sliders drive m, g, k; a toggle flips the drag power n between linear (1) and
   quadratic (2). Changing any parameter re-aims the curve at the new v_term.
   --------------------------------------------------------------------------- */
function renderVelocityDragTerminalSandbox(body) {
    const u2_s7_state = { v: 0, m: 1, g: 9.8, k: 0.5, n: 1, hist: [], laneY: 0 };
    const u2_s7_HIST_MAX = 260;

    function u2_s7_terminal() {
        // mg = k v^n  =>  v_term = (mg/k)^(1/n)
        return Math.pow(u2_s7_state.m * u2_s7_state.g / u2_s7_state.k, 1 / u2_s7_state.n);
    }

    const u2_s7_intro = document.createElement("p");
    u2_s7_intro.className = "checkpoint-intro";
    u2_s7_intro.textContent = "A falling body obeys m dv/dt = mg − k vⁿ: gravity pulls down, drag pushes back, and the two balance at the terminal velocity v_term = (mg/k)^(1/n) where dv/dt = 0. Tune mass, gravity, and drag, and switch between linear and quadratic friction. The velocity curve always bends toward the dashed v_term line.";
    body.appendChild(u2_s7_intro);

    u0SandboxToggleGroup(body, "Drag power n", [
        { label: "Linear (n = 1)", value: 1 },
        { label: "Quadratic (n = 2)", value: 2 }
    ], function () { return u2_s7_state.n; }, function (v) { u2_s7_state.n = v; });

    // Split stage: a narrow falling-particle lane beside the rolling v(t) plot.
    const u2_s7_stage = document.createElement("div");
    u2_s7_stage.style.display = "flex";
    u2_s7_stage.style.gap = "0.75rem";
    u2_s7_stage.style.alignItems = "stretch";
    body.appendChild(u2_s7_stage);

    const u2_s7_laneWrap = document.createElement("div");
    u2_s7_laneWrap.style.flex = "0 0 130px";
    u2_s7_stage.appendChild(u2_s7_laneWrap);
    const u2_s7_lane = document.createElement("canvas");
    u2_s7_lane.width = 130;
    u2_s7_lane.height = 360;
    u2_s7_lane.className = "math-canvas";
    u2_s7_laneWrap.appendChild(u2_s7_lane);
    const u2_s7_laneCtx = u2_s7_lane.getContext("2d");

    const u2_s7_plotWrap = document.createElement("div");
    u2_s7_plotWrap.style.flex = "1 1 auto";
    u2_s7_plotWrap.style.minWidth = "0";
    u2_s7_stage.appendChild(u2_s7_plotWrap);
    const u2_s7_plot = document.createElement("canvas");
    u2_s7_plot.width = 460;
    u2_s7_plot.height = 360;
    u2_s7_plot.className = "math-canvas";
    u2_s7_plotWrap.appendChild(u2_s7_plot);
    const u2_s7_plotCtx = u2_s7_plot.getContext("2d");

    const u2_s7_panel = document.createElement("div");
    u2_s7_panel.className = "slider-panel";
    body.appendChild(u2_s7_panel);
    const u2_s7_mS = u0SandboxSlider(u2_s7_panel, { label: "mass m", min: 0.2, max: 5, step: 0.1, value: 1, decimals: 1, onChange: function (v) { u2_s7_state.m = v; } });
    const u2_s7_gS = u0SandboxSlider(u2_s7_panel, { label: "gravity g", min: 1, max: 20, step: 0.1, value: 9.8, decimals: 1, onChange: function (v) { u2_s7_state.g = v; } });
    const u2_s7_kS = u0SandboxSlider(u2_s7_panel, { label: "drag k", min: 0.05, max: 3, step: 0.05, value: 0.5, decimals: 2, onChange: function (v) { u2_s7_state.k = v; } });

    const u2_s7_resetBtn = document.createElement("button");
    u2_s7_resetBtn.type = "button";
    u2_s7_resetBtn.textContent = "Drop again (v = 0)";
    u2_s7_resetBtn.style.font = "inherit";
    u2_s7_resetBtn.style.fontSize = "0.9rem";
    u2_s7_resetBtn.style.fontWeight = "600";
    u2_s7_resetBtn.style.marginTop = "0.6rem";
    u2_s7_resetBtn.style.padding = "0.4rem 0.9rem";
    u2_s7_resetBtn.style.borderRadius = "8px";
    u2_s7_resetBtn.style.cursor = "pointer";
    u2_s7_resetBtn.style.border = "1px solid var(--panel-border)";
    u2_s7_resetBtn.style.background = "var(--accent-soft)";
    u2_s7_resetBtn.style.color = "var(--accent-text)";
    u2_s7_resetBtn.addEventListener("click", function () { u2_s7_state.v = 0; u2_s7_state.hist = []; });
    u2_s7_panel.appendChild(u2_s7_resetBtn);

    const u2_s7_readout = document.createElement("div");
    u2_s7_readout.style.fontFamily = "Consolas, Monaco, monospace";
    u2_s7_readout.style.fontSize = "0.95rem";
    u2_s7_readout.style.fontWeight = "700";
    u2_s7_readout.style.padding = "0.6rem 0.8rem";
    u2_s7_readout.style.marginTop = "0.4rem";
    u2_s7_readout.style.background = "var(--panel-bg)";
    u2_s7_readout.style.border = "1px solid var(--panel-border)";
    u2_s7_readout.style.borderRadius = "8px";
    u2_s7_readout.style.color = "var(--text-color)";
    body.appendChild(u2_s7_readout);

    function u2_s7_step() {
        // Sub-stepped explicit Euler keeps the v^2 case stable at frame cadence.
        const SUB = 8, h = 0.018;
        for (let i = 0; i < SUB; i++) {
            const a = u2_s7_state.g - (u2_s7_state.k / u2_s7_state.m) * Math.pow(Math.max(u2_s7_state.v, 0), u2_s7_state.n);
            u2_s7_state.v = Math.max(0, u2_s7_state.v + a * h);
        }
        u2_s7_state.hist.push(u2_s7_state.v);
        if (u2_s7_state.hist.length > u2_s7_HIST_MAX) u2_s7_state.hist.shift();
    }

    function u2_s7_drawLane() {
        const ctx = u2_s7_laneCtx;
        const W = u2_s7_lane.width, H = u2_s7_lane.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

        const vTerm = u2_s7_terminal();
        // The particle drifts down the lane at a rate set by v, wrapping to loop.
        u2_s7_state.laneY += Math.min(u2_s7_state.v, vTerm * 1.1) * 0.9;
        if (u2_s7_state.laneY > H - 20) u2_s7_state.laneY = 18;
        const px = W / 2, py = Math.max(18, u2_s7_state.laneY);

        // Velocity arrow stub (down), length scaled to v / v_term.
        const frac = vTerm > 0 ? Math.min(u2_s7_state.v / vTerm, 1) : 0;
        u0SandboxArrow(ctx, px, py, px, py + 16 + 44 * frac, accent, 3);
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(px, py, 8, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();

        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("falling body", W / 2, H - 8);
    }

    function u2_s7_drawPlot() {
        const ctx = u2_s7_plotCtx;
        const W = u2_s7_plot.width, H = u2_s7_plot.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");
        const text = u0SandboxColor("--text-color", "#1a1a1a");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        const padL = 44, padR = 16, padT = 18, padB = 32;
        const plotW = W - padL - padR, plotH = H - padT - padB;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(padL, padT, plotW, plotH);

        const vTerm = u2_s7_terminal();
        const yMax = 1.3 * Math.max(vTerm, u2_s7_state.v, 0.5);
        function pxY(v) { return padT + (yMax - v) / yMax * plotH; }

        // Terminal-velocity baseline (dashed accent) with a label.
        const tY = pxY(vTerm);
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(padL, tY); ctx.lineTo(padL + plotW, tY); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = accent;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("v_term = " + vTerm.toFixed(2), padL + 6, tY - 6);

        // Axis labels.
        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(yMax.toFixed(1), padL - 6, padT + 10);
        ctx.fillText("0", padL - 6, padT + plotH);
        ctx.textAlign = "center";
        ctx.fillText("time →", padL + plotW / 2, H - 8);
        ctx.save();
        ctx.translate(14, padT + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("velocity v(t)", 0, 0);
        ctx.restore();

        // The rolling v(t) trace.
        const hist = u2_s7_state.hist;
        if (hist.length > 1) {
            ctx.strokeStyle = good;
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            for (let i = 0; i < hist.length; i++) {
                const X = padL + (i / (u2_s7_HIST_MAX - 1)) * plotW;
                const Y = pxY(hist[i]);
                if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
            }
            ctx.stroke();
            // Leading dot.
            const lx = padL + ((hist.length - 1) / (u2_s7_HIST_MAX - 1)) * plotW;
            ctx.fillStyle = good;
            ctx.beginPath(); ctx.arc(lx, pxY(hist[hist.length - 1]), 4.5, 0, 2 * Math.PI); ctx.fill();
            ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
        }
    }

    function u2_s7_syncReadout() {
        const vTerm = u2_s7_terminal();
        const gap = vTerm - u2_s7_state.v;
        u2_s7_readout.textContent = "v = " + u2_s7_state.v.toFixed(3) + "    v_term = " + vTerm.toFixed(3) +
            "    gap = " + gap.toFixed(3) + "    (n = " + u2_s7_state.n + ")";
    }

    function u2_s7_frame() {
        if (!document.body.contains(u2_s7_plot)) return; // stop after navigation
        u2_s7_step();
        u2_s7_drawLane();
        u2_s7_drawPlot();
        u2_s7_syncReadout();
        requestAnimationFrame(u2_s7_frame);
    }
    requestAnimationFrame(u2_s7_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 8 - Multi-Chamber Mixing Compartment Ledger (u2_s8_)

   A live mixing tank tracking dA/dt = r_in·C_in − r_out·A/V with the volume
   V(t) = V0 + (r_in − r_out)t. The tank fills or drains visually, its tint set by
   the salt concentration A/V; a ledger text box reports V(t), A(t), and the
   concentration in real time. Sliders drive the inflow rate, inflow
   concentration, and outflow rate; the sim holds at the volume bounds.
   --------------------------------------------------------------------------- */
function renderCompartmentMixingLedgerSandbox(body) {
    const u2_s8_V0 = 100, u2_s8_VMIN = 5, u2_s8_VMAX = 195, u2_s8_VCAP = 200;
    const u2_s8_state = { A: 0, t: 0, rin: 6, Cin: 0.5, rout: 6 };

    function u2_s8_volume() { return u2_s8_V0 + (u2_s8_state.rin - u2_s8_state.rout) * u2_s8_state.t; }

    const u2_s8_intro = document.createElement("p");
    u2_s8_intro.className = "checkpoint-intro";
    u2_s8_intro.textContent = "Salt water flows into a tank at rate r_in with concentration C_in, and the well-mixed solution drains at rate r_out. The salt mass obeys dA/dt = r_in·C_in − r_out·A/V, while the volume itself drifts as V(t) = V0 + (r_in − r_out)t. Tune the three rates and watch the tank fill or drain while the ledger tracks the salt.";
    body.appendChild(u2_s8_intro);

    const u2_s8_canvas = document.createElement("canvas");
    u2_s8_canvas.width = 560;
    u2_s8_canvas.height = 320;
    u2_s8_canvas.className = "math-canvas";
    body.appendChild(u2_s8_canvas);
    const u2_s8_ctx = u2_s8_canvas.getContext("2d");

    const u2_s8_panel = document.createElement("div");
    u2_s8_panel.className = "slider-panel";
    body.appendChild(u2_s8_panel);
    u0SandboxSlider(u2_s8_panel, { label: "inflow rate r_in", min: 0, max: 12, step: 0.5, value: 6, decimals: 1, onChange: function (v) { u2_s8_state.rin = v; } });
    u0SandboxSlider(u2_s8_panel, { label: "inflow conc. C_in", min: 0, max: 2, step: 0.05, value: 0.5, decimals: 2, onChange: function (v) { u2_s8_state.Cin = v; } });
    u0SandboxSlider(u2_s8_panel, { label: "outflow rate r_out", min: 0, max: 12, step: 0.5, value: 6, decimals: 1, onChange: function (v) { u2_s8_state.rout = v; } });

    const u2_s8_resetBtn = document.createElement("button");
    u2_s8_resetBtn.type = "button";
    u2_s8_resetBtn.textContent = "Reset ledger (t = 0)";
    u2_s8_resetBtn.style.font = "inherit";
    u2_s8_resetBtn.style.fontSize = "0.9rem";
    u2_s8_resetBtn.style.fontWeight = "600";
    u2_s8_resetBtn.style.marginTop = "0.6rem";
    u2_s8_resetBtn.style.padding = "0.4rem 0.9rem";
    u2_s8_resetBtn.style.borderRadius = "8px";
    u2_s8_resetBtn.style.cursor = "pointer";
    u2_s8_resetBtn.style.border = "1px solid var(--panel-border)";
    u2_s8_resetBtn.style.background = "var(--accent-soft)";
    u2_s8_resetBtn.style.color = "var(--accent-text)";
    u2_s8_resetBtn.addEventListener("click", function () { u2_s8_state.A = 0; u2_s8_state.t = 0; });
    u2_s8_panel.appendChild(u2_s8_resetBtn);

    const u2_s8_ledger = document.createElement("div");
    u2_s8_ledger.style.fontFamily = "Consolas, Monaco, monospace";
    u2_s8_ledger.style.fontSize = "0.95rem";
    u2_s8_ledger.style.fontWeight = "700";
    u2_s8_ledger.style.padding = "0.6rem 0.8rem";
    u2_s8_ledger.style.marginTop = "0.4rem";
    u2_s8_ledger.style.background = "var(--panel-bg)";
    u2_s8_ledger.style.border = "1px solid var(--panel-border)";
    u2_s8_ledger.style.borderRadius = "8px";
    u2_s8_ledger.style.color = "var(--text-color)";
    body.appendChild(u2_s8_ledger);

    function u2_s8_step() {
        const h = 0.02, SUB = 6;
        for (let i = 0; i < SUB; i++) {
            // Advance time only while the volume stays inside its physical band, so
            // the tank holds at full/empty instead of overflowing or going negative.
            const tNext = u2_s8_state.t + h;
            const vNext = u2_s8_V0 + (u2_s8_state.rin - u2_s8_state.rout) * tNext;
            if (vNext >= u2_s8_VMIN && vNext <= u2_s8_VMAX) u2_s8_state.t = tNext;
            const V = Math.max(u2_s8_VMIN, u2_s8_volume());
            const dA = u2_s8_state.rin * u2_s8_state.Cin - u2_s8_state.rout * (u2_s8_state.A / V);
            u2_s8_state.A = Math.max(0, u2_s8_state.A + dA * h);
        }
    }

    function u2_s8_draw() {
        const ctx = u2_s8_ctx;
        const W = u2_s8_canvas.width, H = u2_s8_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Tank geometry.
        const tankX = 200, tankY = 40, tankW = 200, tankH = 240;
        const V = u2_s8_volume();
        const fillFrac = Math.max(0, Math.min(1, V / u2_s8_VCAP));
        const conc = V > 0 ? u2_s8_state.A / V : 0;
        const concAlpha = Math.max(0.12, Math.min(0.92, conc / 1.5));

        // Water fill (concentration sets the opacity of the accent tint).
        const fillH = tankH * fillFrac;
        ctx.globalAlpha = concAlpha;
        ctx.fillStyle = accent;
        ctx.fillRect(tankX, tankY + tankH - fillH, tankW, fillH);
        ctx.globalAlpha = 1;
        // Water surface line.
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tankX, tankY + tankH - fillH); ctx.lineTo(tankX + tankW, tankY + tankH - fillH); ctx.stroke();

        // Tank walls (open top).
        ctx.strokeStyle = border;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(tankX, tankY);
        ctx.lineTo(tankX, tankY + tankH);
        ctx.lineTo(tankX + tankW, tankY + tankH);
        ctx.lineTo(tankX + tankW, tankY);
        ctx.stroke();

        // Inflow pipe + drip (top-left), outflow pipe + drip (bottom-right).
        ctx.fillStyle = good;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        u0SandboxArrow(ctx, tankX + 34, tankY - 28, tankX + 34, tankY - 4, good, 3);
        ctx.fillText("r_in, C_in", tankX - 30, tankY - 30);
        u0SandboxArrow(ctx, tankX + tankW, tankY + tankH - 14, tankX + tankW + 30, tankY + tankH - 14, sub, 3);
        ctx.fillStyle = sub;
        ctx.fillText("r_out", tankX + tankW + 6, tankY + tankH - 20);

        // Concentration caption inside the tank.
        ctx.fillStyle = sub;
        ctx.textAlign = "center";
        ctx.fillText("V = " + V.toFixed(1) + "   conc = " + conc.toFixed(3), tankX + tankW / 2, tankY + tankH + 24);

        // Left-side equation reminder.
        ctx.fillStyle = sub;
        ctx.font = "13px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("dA/dt = r_in·C_in − r_out·A/V", 16, 60);
        ctx.fillText("V(t) = V0 + (r_in − r_out)t", 16, 84);
    }

    function u2_s8_syncLedger() {
        const V = u2_s8_volume();
        const conc = V > 0 ? u2_s8_state.A / V : 0;
        u2_s8_ledger.innerHTML = "";
        const l1 = document.createElement("div");
        l1.textContent = "t = " + u2_s8_state.t.toFixed(2) + "    V(t) = " + V.toFixed(2) + "    (V0 = " + u2_s8_V0 + ")";
        l1.style.color = "var(--text-color)";
        const l2 = document.createElement("div");
        l2.textContent = "A(t) = " + u2_s8_state.A.toFixed(3) + " salt    concentration A/V = " + conc.toFixed(4);
        l2.style.color = "var(--accent-text)";
        l2.style.marginTop = "0.2rem";
        u2_s8_ledger.appendChild(l1);
        u2_s8_ledger.appendChild(l2);
    }

    function u2_s8_frame() {
        if (!document.body.contains(u2_s8_canvas)) return; // stop after navigation
        u2_s8_step();
        u2_s8_draw();
        u2_s8_syncLedger();
        requestAnimationFrame(u2_s8_frame);
    }
    requestAnimationFrame(u2_s8_frame);
}

/* ---------------------------------------------------------------------------
   Sandbox 9 - The Logistic Population Carrying Capacity Lab (u2_s9_)

   Slope field and solutions for the autonomous logistic dP/dt = rP(1 − P/K).
   Sliders set the growth rate r and carrying capacity K (the P-axis rescales to
   K live). Click to drop the initial state P0; the curve integrates and bends
   per regime: it levels onto K from below (0 < P0 < K), descends onto K from
   above (P0 > K), or sits flat on the K equilibrium when P0 = K.
   --------------------------------------------------------------------------- */
function renderLogisticPopulationSaturationSandbox(body) {
    const u2_s9_T0 = 0, u2_s9_T1 = 12;
    const u2_s9_state = { r: 0.8, K: 100, t0: 1, P0: 20 };

    function u2_s9_slope(t, P) { return u2_s9_state.r * P * (1 - P / u2_s9_state.K); }
    function u2_s9_Pmax() { return u2_s9_state.K * 1.8; }

    const u2_s9_intro = document.createElement("p");
    u2_s9_intro.className = "checkpoint-intro";
    u2_s9_intro.textContent = "The logistic law dP/dt = rP(1 − P/K) grows a population fastest in the middle and stalls at the carrying capacity K, the stable equilibrium. Set the growth rate and K, then click to drop the starting population P0. Below K the curve rises to K; above K it falls to K; exactly at K it stays flat. K is the attractor either way.";
    body.appendChild(u2_s9_intro);

    const u2_s9_canvas = document.createElement("canvas");
    u2_s9_canvas.width = 600;
    u2_s9_canvas.height = 400;
    u2_s9_canvas.className = "math-canvas";
    u2_s9_canvas.style.cursor = "crosshair";
    body.appendChild(u2_s9_canvas);
    const u2_s9_ctx = u2_s9_canvas.getContext("2d");

    const u2_s9_panel = document.createElement("div");
    u2_s9_panel.className = "slider-panel";
    body.appendChild(u2_s9_panel);
    u0SandboxSlider(u2_s9_panel, { label: "growth rate r", min: 0.1, max: 2, step: 0.05, value: 0.8, decimals: 2, onChange: function (v) { u2_s9_state.r = v; } });
    u0SandboxSlider(u2_s9_panel, {
        label: "carrying capacity K", min: 20, max: 160, step: 5, value: 100, decimals: 0,
        onChange: function (v) {
            // Keep P0 in range as K shrinks so the node never falls off the axis.
            u2_s9_state.K = v;
            if (u2_s9_state.P0 > u2_s9_Pmax()) u2_s9_state.P0 = u2_s9_Pmax();
        }
    });

    const u2_s9_badge = document.createElement("div");
    u2_s9_badge.style.fontWeight = "700";
    u2_s9_badge.style.textAlign = "center";
    u2_s9_badge.style.padding = "0.55rem 0.7rem";
    u2_s9_badge.style.marginTop = "0.4rem";
    u2_s9_badge.style.borderRadius = "8px";
    u2_s9_badge.style.border = "1px solid var(--panel-border)";
    u2_s9_badge.style.background = "var(--panel-bg)";
    u2_s9_badge.style.color = "var(--text-color)";
    body.appendChild(u2_s9_badge);

    const u2_s9_pad = { L: 46, R: 16, T: 16, B: 32 };
    function u2_s9_plotW() { return u2_s9_canvas.width - u2_s9_pad.L - u2_s9_pad.R; }
    function u2_s9_plotH() { return u2_s9_canvas.height - u2_s9_pad.T - u2_s9_pad.B; }
    function u2_s9_pxX(t) { return u2_s9_pad.L + (t - u2_s9_T0) / (u2_s9_T1 - u2_s9_T0) * u2_s9_plotW(); }
    function u2_s9_pxY(P) { return u2_s9_pad.T + (u2_s9_Pmax() - P) / u2_s9_Pmax() * u2_s9_plotH(); }
    function u2_s9_worldT(px) { return u2_s9_T0 + (px - u2_s9_pad.L) / u2_s9_plotW() * (u2_s9_T1 - u2_s9_T0); }
    function u2_s9_worldP(py) { return u2_s9_Pmax() - (py - u2_s9_pad.T) / u2_s9_plotH() * u2_s9_Pmax(); }

    u2_s9_canvas.addEventListener("click", function (e) {
        const rect = u2_s9_canvas.getBoundingClientRect();
        const bx = (e.clientX - rect.left) * (u2_s9_canvas.width / rect.width);
        const by = (e.clientY - rect.top) * (u2_s9_canvas.height / rect.height);
        const t = u2_s9_worldT(bx), P = u2_s9_worldP(by);
        if (t < u2_s9_T0 || t > u2_s9_T1 || P < 0 || P > u2_s9_Pmax()) return;
        u2_s9_state.t0 = t;
        u2_s9_state.P0 = P;
    });

    // RK4 in t for the logistic solution through the node, one direction.
    function u2_s9_integrate(dir) {
        const h = 0.05 * dir, MAX = 400;
        const pts = [{ t: u2_s9_state.t0, P: u2_s9_state.P0 }];
        let t = u2_s9_state.t0, P = u2_s9_state.P0;
        for (let i = 0; i < MAX; i++) {
            const k1 = u2_s9_slope(t, P);
            const k2 = u2_s9_slope(t + h / 2, P + h / 2 * k1);
            const k3 = u2_s9_slope(t + h / 2, P + h / 2 * k2);
            const k4 = u2_s9_slope(t + h, P + h * k3);
            P += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
            t += h;
            if (t < u2_s9_T0 || t > u2_s9_T1) break;
            pts.push({ t: t, P: P });
        }
        return pts;
    }

    function u2_s9_plotPoints(pts, color, width) {
        const ctx = u2_s9_ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < pts.length; i++) {
            if (pts[i].P < 0 || pts[i].P > u2_s9_Pmax()) { started = false; continue; }
            const X = u2_s9_pxX(pts[i].t), Y = u2_s9_pxY(pts[i].P);
            if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();
    }

    function u2_s9_draw() {
        const ctx = u2_s9_ctx;
        const W = u2_s9_canvas.width, H = u2_s9_canvas.height;
        const bg = u0SandboxColor("--bg-color", "#ffffff");
        const border = u0SandboxColor("--panel-border", "#cccccc");
        const sub = u0SandboxColor("--text-secondary", "#5a5a6e");
        const accent = u0SandboxColor("--accent-color", "#6200ee");
        const good = u0SandboxColor("--success-color", "#1b7f4b");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(u2_s9_pad.L, u2_s9_pad.T, u2_s9_plotW(), u2_s9_plotH());

        // P-axis ticks (0, K, Pmax).
        ctx.fillStyle = sub;
        ctx.font = "11px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("0", u2_s9_pad.L - 6, u2_s9_pad.T + u2_s9_plotH());
        ctx.fillText(u2_s9_state.K.toFixed(0), u2_s9_pad.L - 6, u2_s9_pxY(u2_s9_state.K) + 4);
        ctx.fillText(u2_s9_Pmax().toFixed(0), u2_s9_pad.L - 6, u2_s9_pad.T + 8);
        ctx.textAlign = "center";
        ctx.fillText("time t →", u2_s9_pad.L + u2_s9_plotW() / 2, H - 8);

        // Slope field for dP/dt = rP(1 - P/K).
        const NT = 22, NP = 16, seg = 9;
        for (let i = 0; i < NT; i++) {
            for (let j = 0; j < NP; j++) {
                const t = u2_s9_T0 + (u2_s9_T1 - u2_s9_T0) * (i / (NT - 1));
                const P = u2_s9_Pmax() * (j / (NP - 1));
                // Slope in screen space: scale dP/dt by the axis aspect ratio.
                const m = u2_s9_slope(t, P);
                const dtScreen = u2_s9_plotW() / (u2_s9_T1 - u2_s9_T0);
                const dpScreen = -u2_s9_plotH() / u2_s9_Pmax() * m;
                const norm = Math.sqrt(dtScreen * dtScreen + dpScreen * dpScreen) || 1;
                const ux = dtScreen / norm, uy = dpScreen / norm;
                const cx = u2_s9_pxX(t), cy = u2_s9_pxY(P);
                ctx.strokeStyle = border;
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(cx - seg * ux, cy - seg * uy);
                ctx.lineTo(cx + seg * ux, cy + seg * uy);
                ctx.stroke();
            }
        }

        // The carrying-capacity equilibrium line P = K (dashed accent).
        ctx.save();
        ctx.setLineDash([7, 5]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        const kY = u2_s9_pxY(u2_s9_state.K);
        ctx.beginPath(); ctx.moveTo(u2_s9_pad.L, kY); ctx.lineTo(u2_s9_pad.L + u2_s9_plotW(), kY); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = accent;
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("P = K  (carrying capacity)", u2_s9_pad.L + 6, kY - 6);

        // The solution through the node, both directions.
        u2_s9_plotPoints(u2_s9_integrate(-1), good, 2.8);
        u2_s9_plotPoints(u2_s9_integrate(1), good, 2.8);

        // The initial-state node.
        ctx.fillStyle = good;
        ctx.beginPath();
        ctx.arc(u2_s9_pxX(u2_s9_state.t0), u2_s9_pxY(u2_s9_state.P0), 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.stroke();
    }

    function u2_s9_syncBadge() {
        const P0 = u2_s9_state.P0, K = u2_s9_state.K;
        const near = Math.abs(P0 - K) < K * 0.04;
        let msg;
        if (near) msg = "P0 ≈ K  →  flat: the population sits at the stable equilibrium";
        else if (P0 < K) msg = "0 < P0 < K  →  rising: the curve levels onto K from below";
        else msg = "P0 > K  →  falling: the curve descends onto K from above";
        u2_s9_badge.textContent = "P0 = " + P0.toFixed(1) + ",  K = " + K.toFixed(0) + "   |   " + msg;
    }

    function u2_s9_frame() {
        if (!document.body.contains(u2_s9_canvas)) return; // stop after navigation
        u2_s9_draw();
        u2_s9_syncBadge();
        requestAnimationFrame(u2_s9_frame);
    }
    requestAnimationFrame(u2_s9_frame);
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
