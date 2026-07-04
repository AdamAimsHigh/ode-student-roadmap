/* Layout generator and view router. The application is a single page with
   two views: a Table of Contents that lists every unit, and a Unit Detail
   view that isolates one unit's modules, videos, and mastery quiz. The
   active view is chosen by the URL hash, so units are bookmarkable and the
   browser back button works. Gateway locking still runs at the module level
   when Guided Pathway mode is active, keyed by the global module sequence. */

/* Downloadable curriculum materials, keyed by unit array index (0 through 18).
   Every unit carries a primary cheat sheet "file" resolved under
   ode/assets/pdfs/, and some units add an array of focused topic guides, each
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
   real graphing or canvas widget registered in ode/js/checkpoints/. */
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
    },
    {
        id: "unit_2_master_differential_matrix",
        unitNumber: 2,
        isSandbox: true,
        title: "The First-Order Differential Equation Matrix",
        blurb: "An advanced operational workbench to select, configure, and visualize the slope fields, solution curves, and phase properties of any first-order differential model.",
        render: renderMasterDifferentialMatrixSandbox
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

        // The whole card is the launch control, matching the Table of Contents
        // unit cards: a real <button> so clicks and keyboard activation anywhere
        // on the frame advance into the tool.
        const card = document.createElement("button");
        card.type = "button";
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

        card.addEventListener("click", function () {
            if (item.isSandbox) {
                // Advance the hash to the deep-link route; the hashchange handler
                // mounts the playground, so the URL alone reproduces this view.
                window.location.hash = "#interactives-sandbox-" + sandboxRouteId(item);
            } else {
                mountVisualizer(container, item);
            }
        });

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
            // PRACTICE_DATA strings arrive HTML-ready from compile_web.py:
            // entities escaped, semantic macros lowered to <em>/<strong>/spans.
            li.innerHTML = item.problem;
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
            // HTML-ready compiler output, same contract as the problems list.
            li.innerHTML = item.solution;
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
    // Mastery banks are keyed by unit number (Content API v1 id-keyed lookup);
    // the mount id keeps the unit title so saved quiz progress carries over.
    const mastery = QUIZ_DATA.unit_mastery[unitIndex];
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
    // unit container after all of its modules. Mastery banks are keyed by
    // unit number (Content API v1 id-keyed lookup); the mount id keeps the
    // unit title so saved quiz progress carries over.
    const mastery = QUIZ_DATA.unit_mastery[unitIndex];
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
