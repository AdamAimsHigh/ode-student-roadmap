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
   renderSandboxPlayground). Units 1, 2, 3, and 5 already carry graded visualizers
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
    }
];

/* The Interactives route, now a unified visualizers dashboard. Instead of one
   card per unit duplicating the curriculum index, it gathers every standalone
   math visualization engine in the course into a single grid. Each card derives
   its context badge from the engine's home module and offers a launch action that
   mounts the live widget into the main view (see mountVisualizer). */
function renderInteractives(container) {
    buildIndexShell(container, "Interactive Visualizers",
        "Every standalone math visualization engine in the course, gathered into one grid. Launch any tool to mount it right here in the workspace.");

    // The dashboard sits one level below the curriculum root, so its back action
    // reads "Back to Main Roadmap" rather than the shared shell default. The
    // button still targets the empty hash (the Table of Contents); only the label
    // changes, to keep the navigation hierarchy clean.
    const backBtn = container.querySelector(".back-to-toc-btn");
    if (backBtn) backBtn.textContent = "Back to Main Roadmap";

    const grid = document.createElement("div");
    grid.className = "interactives-grid";

    // Normalize every card, graded engine and sandbox placeholder alike, into one
    // render model so a single sort and a single render loop cover both. Graded
    // engines resolve their unit and module from the curriculum (and drop out if
    // the checkpoint is gone); sandbox cards carry their unit number directly and
    // sort to the tail of their unit, behind any graded module.
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

    // Unit 0's three fully built Cluster I engines. They sort within Unit 0 in
    // declared order (900 + index), ahead of the generic placeholder tail (999),
    // so the catalog reads them as the leading sandbox cluster.
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

    // Chronological order: Unit 0 before Unit 1 before Unit 2 ..., and within a
    // unit, ascending module number, with the unit's sandbox last.
    items.sort(function (a, b) {
        if (a.unitNumber !== b.unitNumber) return a.unitNumber - b.unitNumber;
        return a.sortKey - b.sortKey;
    });

    items.forEach(function (item) {
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
            mountVisualizer(container, item);
        });
        card.appendChild(launch);

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/* Mounts a single card into the main view, replacing the dashboard grid with a
   focused workspace and a back action. A graded engine delegates to its
   registered checkpoint widget; a sandbox card opens an ungraded playground
   instead (see renderSandboxPlayground). Either way the content builds inside a
   uniquely identified host that is the only one on the page while it is open, so
   any element ids the engine creates cannot collide with another card's. */
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
        renderInteractives(container);
        window.scrollTo(0, 0);
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
        renderSandboxPlayground(host, item);
    } else {
        CheckpointRegistry.render(item.home.moduleData.interactive_checkpoint, host, item.home.moduleData);
    }
}

/* Renders an ungraded sandbox playground into the mounted host. It mirrors the
   chrome of a graded checkpoint, heading, intro, and a begin button, but carries
   no answer checking: the begin action reads "Open Sandbox Playground" and
   reveals a free-exploration body with no check steps or feedback. The body is an
   empty placeholder for now, the slot each unit's open-ended tool will fill, so
   students will eventually tweak variables, drag sliders, and explore graphs with
   nothing to grade. */
function renderSandboxPlayground(host, item) {
    const heading = document.createElement("div");
    heading.className = "checkpoint-heading";
    heading.textContent = item.vis.title;
    host.appendChild(heading);

    const intro = document.createElement("p");
    intro.className = "checkpoint-intro";
    intro.textContent = item.vis.blurb;
    host.appendChild(intro);

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "checkpoint-begin-btn";
    openBtn.textContent = "Open Sandbox Playground";
    host.appendChild(openBtn);

    openBtn.addEventListener("click", function () {
        openBtn.remove();

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
    });
}

/* ============================================================================
   Unit 0 Cluster I sandbox engines

   Three self-contained, ungraded exploration surfaces mounted by
   renderSandboxPlayground. Shared rules across all three:
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
