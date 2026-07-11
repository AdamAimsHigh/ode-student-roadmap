/* View router and core curriculum views. The active view is chosen by the
   URL hash, so every page is bookmarkable and the browser back button works.
   This file owns the hash dispatcher (renderCurriculum), the unit helpers,
   the Table of Contents / Unit Detail views, the progress banner, and the
   bootstrap listeners. The directory views live in their own classic
   scripts, loaded before this one in index.html (Phase 3 decomposition):
     views-materials.js     AVAILABLE_MATERIALS, index shell, Cheat Sheets
                            and Practice Sets indexes
     views-interactives.js  Interactives dashboard + sandbox deep links
                            (engines themselves live in sandboxes.js)
     views-practice.js      per-unit Practice Set page (HTML-ready strings)
     views-quizzes.js       Quizzes Index + per-unit quizzes page
     views-dashboard.js     #dashboard statistics view (Sprint Rec 4)
     views-settings.js      #settings profile view + edge-gated admin console
     adaptive.js            #session-<kind> composed practice (Sprint Rec 3)
   Gateway locking still runs at the module level when Guided Pathway or
   Adaptive Pathway mode is active, keyed by the global module sequence;
   Adaptive additionally opens weak-prerequisite remediation detours in the
   unit detail view. */


/* Reads the URL hash and returns a valid unit index, or null for the Table
   of Contents. The hash form is "#unit-N" where N is the unit array index. */
function unitIndexFromHash() {
    const match = /^#unit-(\d+)$/.exec(window.location.hash);
    if (!match) return null;
    const index = parseInt(match[1], 10);
    return (index >= 0 && index < SUBJECT_CONFIG.units.length) ? index : null;
}

/* The global flat index of a unit's first module. Locking compares against
   ALL_MODULES, a single sequence across every unit, so the detail view must
   start counting where the prior units left off. */
function unitFlatOffset(unitIndex) {
    const units = SUBJECT_CONFIG.units;
    let offset = 0;
    for (let i = 0; i < unitIndex; i++) {
        offset += units[i].modules.length;
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
        if (pi >= 0 && pi < SUBJECT_CONFIG.units.length) {
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
        if (qi >= 0 && qi < SUBJECT_CONFIG.units.length) {
            renderUnitQuizzesDetail(container, qi);
        } else {
            renderQuizzesIndex(container);
        }
    } else if (hash === "#dashboard") {
        renderDashboard(container);
    } else if (hash === "#settings") {
        renderSettings(container);
    } else if (hash.indexOf("#session-") === 0) {
        // Adaptive composed practice (Sprint Rec 3). The kind rides in the
        // hash; an optional URI-encoded focus (a skill id, or uN for the
        // remediation detour's unit scope) follows a tilde separator, so a
        // dashboard suggestion or a branching panel link is bookmarkable.
        const spec = hash.slice("#session-".length);
        const tilde = spec.indexOf("~");
        const kind = tilde === -1 ? spec : spec.slice(0, tilde);
        let focus = tilde === -1 ? null : spec.slice(tilde + 1);
        if (focus) {
            try { focus = decodeURIComponent(focus); } catch (err) { focus = null; }
        }
        ODEAdaptive.renderAdaptiveSession(container, kind, focus);
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

    SUBJECT_CONFIG.units.forEach(function (unitData, index) {
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

    /* Quiz and practice content lives in this unit's lazy bank chunk
       (Pillar 1 lazy layer, bank-loader.js). First visit: the page renders
       immediately with its videos and readings, then re-renders through the
       router once the chunk lands and the quiz cards can mount. The hash
       guard keeps a slow chunk from repainting a view already navigated
       away from. */
    const bankReady = typeof ODEBank !== "undefined" &&
        ODEBank.ensureUnit(unitIndex, function () {
            if (unitIndexFromHash() === unitIndex) renderCurriculum();
        });
    const bankFailed = typeof ODEBank !== "undefined" &&
        ODEBank.hasFailed(unitIndex);

    const watched = ODEState.getWatchedVideos();
    const unitData = SUBJECT_CONFIG.units[unitIndex];

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

    // Adaptive Pathway remediation detour (Sprint Rec 3): when the active
    // mode is adaptive and prerequisite skills from earlier units are weak
    // or fading, the composer inserts a detour panel above the module list
    // that deep-links a remedy session scoped to those skills. Exploration
    // and Guided renders are untouched (the builder returns null).
    if (typeof ODEAdaptive !== "undefined") {
        const detour = ODEAdaptive.buildRemediationPanel(unitIndex);
        if (detour) unitSection.appendChild(detour);
    }

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
    // unit title so saved quiz progress carries over. Until the lazy bank
    // chunk lands the bank is absent and a short status note holds its slot.
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
    } else if (!bankReady) {
        const note = document.createElement("p");
        note.className = "static-page-placeholder";
        note.textContent = bankFailed
            ? "The quizzes for this unit could not be loaded. Refresh the page to try again."
            : "Loading the quizzes for this unit.";
        unitSection.appendChild(note);
    }

    // Supplemental readings, the closing block of every unit detail page,
    // driven by the generated READINGS_DATA global (Content Schema v2). The
    // reference guide keeps its established primary button; every other
    // linkable reading lists beneath it. Planned readings (no file yet) are
    // omitted here, the Cheat Sheets index shows them as text labels.
    const readings = (typeof READINGS_DATA !== "undefined" &&
        READINGS_DATA[unitIndex]) || [];
    const linkable = readings.filter(function (r) { return r.file || r.url; });
    if (linkable.length) {
        const resourceRow = document.createElement("div");
        resourceRow.className = "unit-master-resource-row";

        function readingHref(reading) {
            return reading.url ? reading.url : "assets/pdfs/" + reading.file;
        }

        const guide = linkable.find(function (r) {
            return r.kind === "reference-guide";
        });
        if (guide) {
            const guideLink = document.createElement("a");
            guideLink.className = "pdf-download-btn";
            guideLink.href = readingHref(guide);
            guideLink.target = "_blank";
            guideLink.rel = "noopener";
            guideLink.textContent = "View Full Unit Reference Guide (Cheat Sheet, Problems, and Solutions)";
            resourceRow.appendChild(guideLink);
        }

        const others = linkable.filter(function (r) { return r !== guide; });
        if (others.length) {
            const wrap = document.createElement("div");
            wrap.className = "materials-subtopics";

            const label = document.createElement("p");
            label.className = "materials-subtopics-label";
            label.textContent = "Supplemental Readings";
            wrap.appendChild(label);

            const list = document.createElement("ul");
            list.className = "materials-subtopics-list";
            others.forEach(function (reading) {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.className = "pdf-download-link";
                link.href = readingHref(reading);
                link.target = "_blank";
                link.rel = "noopener";
                link.textContent = reading.title;
                li.appendChild(link);
                list.appendChild(li);
            });
            wrap.appendChild(list);
            resourceRow.appendChild(wrap);
        }

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
