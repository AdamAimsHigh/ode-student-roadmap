/* ============================================================================
   Quiz directory views (extracted from router.js, Phase 3 router decomposition).

   The Quizzes Index grid and the per-unit quizzes page (micro
   practice cards plus the unit mastery quiz). Mastery banks are
   keyed by unit number (Content API v1 id-keyed lookup); QuizEngine
   mount ids keep the unit title so saved progress carries over.
   Classic script loaded before router.js in index.html -- no ES modules, no
   fetch -- the app keeps running unchanged from the file:// protocol.
   ============================================================================ */

/* The Quizzes Index route, the top level of a two level directory. A grid of
   19 unit cards, each linking to that unit's quizzes sub-view where the micro
   practice and the unit mastery quiz live together. */
function renderQuizzesIndex(container) {
    buildIndexShell(container, "Quizzes Index",
        "Pick a unit to open its quizzes. Each unit gathers the micro practice for every video and its unit mastery quiz.");

    const grid = document.createElement("div");
    grid.className = "toc-grid";

    SUBJECT_CONFIG.units.forEach(function (unitData, index) {
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

    const unitData = SUBJECT_CONFIG.units[unitIndex];

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
