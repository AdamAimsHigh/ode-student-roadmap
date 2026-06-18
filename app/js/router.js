/* Layout generator and view router. The application is a single page with
   two views: a Table of Contents that lists every unit, and a Unit Detail
   view that isolates one unit's modules, videos, and mastery quiz. The
   active view is chosen by the URL hash, so units are bookmarkable and the
   browser back button works. Gateway locking still runs at the module level
   when Guided Pathway mode is active, keyed by the global module sequence. */

/* Downloadable curriculum materials, keyed by unit array index (0 through 18).
   Every unit gets a primary cheat sheet built from its index by the renderer;
   this map adds the optional focused topic guides that some units carry. Each
   subtopic has a display title and a file name resolved under app/assets/pdfs/.
   The files are scaffolded targets, the index lists them before the PDFs land. */
const AVAILABLE_MATERIALS = {
    9: { subtopics: [
        { title: "Abel's Identity", file: "Unit-9-Abels-Identity.pdf" },
        { title: "The Wronskian and Independence", file: "Unit-9-Wronskian.pdf" },
        { title: "Reduction of Order", file: "Unit-9-Reduction-of-Order.pdf" },
        { title: "The Cauchy-Euler Equation", file: "Unit-9-Cauchy-Euler.pdf" }
    ] },
    10: { subtopics: [
        { title: "Exponential Response Formula", file: "Unit-10-Exponential-Response-Formula.pdf" },
        { title: "Variation of Parameters", file: "Unit-10-Variation-of-Parameters.pdf" },
        { title: "The Annihilator Method", file: "Unit-10-Annihilator-Method.pdf" },
        { title: "Undetermined Coefficients Guesses", file: "Unit-10-Undetermined-Coefficients.pdf" }
    ] },
    11: { subtopics: [
        { title: "The Damping Discriminant", file: "Unit-11-Damping-Discriminant.pdf" },
        { title: "Forced Vibrations and Resonance", file: "Unit-11-Forced-Vibrations.pdf" }
    ] },
    12: { subtopics: [
        { title: "Laplace Transform Table", file: "Unit-12-Laplace-Table.pdf" },
        { title: "Partial Fractions for Inverses", file: "Unit-12-Partial-Fractions.pdf" },
        { title: "Heaviside and Dirac Delta", file: "Unit-12-Heaviside-and-Delta.pdf" }
    ] },
    13: { subtopics: [
        { title: "The Frobenius Method", file: "Unit-13-Frobenius-Method.pdf" },
        { title: "Legendre and Bessel Equations", file: "Unit-13-Legendre-and-Bessel.pdf" }
    ] },
    14: { subtopics: [
        { title: "Eigenvalues and Eigenvectors", file: "Unit-14-Eigenvalues-and-Eigenvectors.pdf" },
        { title: "The Determinant and Change of Basis", file: "Unit-14-Determinant-and-Change-of-Basis.pdf" }
    ] },
    15: { subtopics: [
        { title: "The Matrix Exponential", file: "Unit-15-Matrix-Exponential.pdf" },
        { title: "Fundamental Matrices", file: "Unit-15-Fundamental-Matrices.pdf" }
    ] },
    16: { subtopics: [
        { title: "Phase Plane Classification", file: "Unit-16-Phase-Plane-Classification.pdf" },
        { title: "Linearization and the Jacobian", file: "Unit-16-Linearization.pdf" }
    ] },
    17: { subtopics: [
        { title: "Sturm-Liouville Theory", file: "Unit-17-Sturm-Liouville.pdf" },
        { title: "Orthogonal Functions", file: "Unit-17-Orthogonal-Functions.pdf" }
    ] },
    18: { subtopics: [
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
    } else if (hash === "#cheat-sheets") {
        renderCheatSheets(container);
    } else if (hash === "#quizzes-index") {
        renderQuizzesIndex(container);
    } else if (hash === "#interactives") {
        renderStaticPage(container, "Interactives", "Content coming soon.");
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

/* Shared scaffolding for the static navigation routes. Renders a back button,
   a themed page title, and a placeholder message. The real content for each of
   these pages is future work, so for now they announce that it is coming. */
function renderStaticPage(container, title, message) {
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

    const section = document.createElement("section");
    section.className = "static-page";

    const heading = document.createElement("h1");
    heading.className = "static-page-title";
    heading.textContent = title;

    const placeholder = document.createElement("p");
    placeholder.className = "static-page-placeholder";
    placeholder.textContent = message;

    section.appendChild(heading);
    section.appendChild(placeholder);
    container.appendChild(section);
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

/* The Cheat Sheets route. A data driven Table of Contents that mirrors the main
   curriculum: one card per unit with a primary cheat sheet download, plus the
   focused topic guides listed for that unit in AVAILABLE_MATERIALS. */
function renderCheatSheets(container) {
    buildIndexShell(container, "Cheat Sheets (PDFs)",
        "Download a one page cheat sheet for each unit. Some units add focused topic guides.");

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
        primary.setAttribute("download", "");
        primary.textContent = "Download Unit " + index + " Cheat Sheet";
        card.appendChild(primary);

        const materials = AVAILABLE_MATERIALS[index];
        if (materials && materials.subtopics && materials.subtopics.length) {
            const wrap = document.createElement("div");
            wrap.className = "materials-subtopics";

            const label = document.createElement("p");
            label.className = "materials-subtopics-label";
            label.textContent = "Topic guides";
            wrap.appendChild(label);

            const list = document.createElement("ul");
            list.className = "materials-subtopics-list";
            materials.subtopics.forEach(function (sub) {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.className = "pdf-download-link";
                link.href = "assets/pdfs/" + sub.file;
                link.setAttribute("download", "");
                link.textContent = sub.title;
                li.appendChild(link);
                list.appendChild(li);
            });
            wrap.appendChild(list);
            card.appendChild(wrap);
        }

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/* The Practice Sets route. The same per unit card structure as Cheat Sheets,
   tailored for web based practice. The primary action opens the unit, whose
   detail view already hosts the micro practice and the mastery quiz. A
   dedicated HTML review guide will replace this target once those are built. */
function renderPracticeSets(container) {
    buildIndexShell(container, "Practice Sets",
        "Open the web based practice set for each unit. Each set gathers the review and the quizzes for that unit.");

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
        open.href = "#unit-" + index;
        open.textContent = "Open Unit " + index + " Practice Set";
        card.appendChild(open);

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/* The Quizzes Index route. A dashboard of every unit mastery quiz, each mounted
   through the existing quiz engine launch card so its progress line and launch,
   resume, or review button all behave exactly as they do inside a unit. The
   shared mastery id means progress stays in sync with the unit detail view. */
function renderQuizzesIndex(container) {
    buildIndexShell(container, "Quizzes Index",
        "Every unit mastery quiz in one place. Each card tracks your progress and launches the same thirty question runner.");

    const grid = document.createElement("div");
    grid.className = "toc-grid";

    CURRICULUM.forEach(function (unitData) {
        const mastery = QUIZ_DATA.unit_mastery[unitData.unit];
        if (!mastery || !mastery.length) return;

        const host = document.createElement("div");
        host.className = "unit-mastery-host";
        QuizEngine.mount(host, {
            id: "mastery::" + unitData.unit,
            title: unitData.unit,
            intro: "Thirty questions across the whole unit. Track your score, and let any missed question point you back to its module.",
            items: mastery
        });
        grid.appendChild(host);
    });

    container.appendChild(grid);
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
