/* ============================================================================
   Interactives dashboard views (extracted from router.js, Phase 3 router decomposition).

   The visualizer and sandbox catalogs (engine functions live in
   sandboxes.js, which must load first: the catalog consts reference
   them by name at evaluation time), curriculum badge derivation,
   the Interactives dashboard grid, and mountVisualizer, the
   deep-link mount point used by the #interactives-sandbox-* route.
   Classic script loaded before router.js in index.html -- no ES modules, no
   fetch -- the app keeps running unchanged from the file:// protocol.
   ============================================================================ */

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
    const units = SUBJECT_CONFIG.units;
    for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
        const unitData = units[unitIndex];
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
            const unitData = SUBJECT_CONFIG.units[item.unitNumber];
            header.textContent = unitData ? unitData.unit
                : (SUBJECT_CONFIG.structureLabel + " " + item.unitNumber);
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
