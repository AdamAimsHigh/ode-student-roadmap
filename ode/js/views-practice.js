/* ============================================================================
   Practice Set detail view (extracted from router.js, Phase 3 router decomposition).

   renderPracticeMath (the shared KaTeX auto-render pass) and the
   per-unit Practice Set page. PRACTICE_DATA strings arrive
   HTML-ready from scripts/compile_web.py (entities escaped,
   semantic macros lowered to elements) and are injected via
   innerHTML, then typeset by KaTeX.
   Classic script loaded before router.js in index.html -- no ES modules, no
   fetch -- the app keeps running unchanged from the file:// protocol.
   ============================================================================ */

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
