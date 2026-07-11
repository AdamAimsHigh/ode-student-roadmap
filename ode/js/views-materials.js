/* ============================================================================
   Materials directory views (extracted from router.js, Phase 3 router decomposition).

   AVAILABLE_MATERIALS (the PDF catalog, also read by router.js's
   unit detail view), the shared index-page shell (buildIndexShell,
   used by every directory view including the quizzes and
   interactives indexes), the topic-guide sublist helpers, and the
   Cheat Sheets / Practice Sets index pages.
   Classic script loaded before router.js in index.html -- no ES modules, no
   fetch -- the app keeps running unchanged from the file:// protocol.
   ============================================================================ */

/* Downloadable curriculum materials, keyed by unit array index. Derived at
   parse time from the generated READINGS_DATA global (readings-data.js,
   compiled from content/units/unit-NN/readings.json) -- the hand-authored
   catalog this file used to carry is retired. The cheat-sheet reading fills
   the unit's primary "file"; topic-guide readings build the Topic guides
   sublist. Planned readings (PDF not rendered yet) arrive without a file and
   render as plain text labels, never dead links. */
const AVAILABLE_MATERIALS = (function () {
    const out = {};
    if (typeof READINGS_DATA === "undefined") return out;
    Object.keys(READINGS_DATA).forEach(function (key) {
        const entry = {};
        const subtopics = [];
        READINGS_DATA[key].forEach(function (reading) {
            if (reading.kind === "cheat-sheet" && reading.file) {
                entry.file = reading.file;
            } else if (reading.kind === "topic-guide") {
                const sub = { title: reading.title };
                if (reading.file) sub.file = reading.file;
                if (reading.url) sub.url = reading.url;
                subtopics.push(sub);
            }
        });
        if (subtopics.length) entry.subtopics = subtopics;
        out[Number(key)] = entry;
    });
    return out;
})();

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
    const unitData = SUBJECT_CONFIG.units[unitIndex];
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
        if (asLinks && (sub.file || sub.url)) {
            const link = document.createElement("a");
            link.className = "pdf-download-link";
            // Local PDFs resolve under assets/pdfs/ (document-relative,
            // file:// legal); url is the absolute https escape hatch for
            // readings hosted off-repo (readings.schema.json).
            link.href = sub.url ? sub.url : "assets/pdfs/" + sub.file;
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

        const primary = document.createElement("a");
        primary.className = "pdf-download-btn";
        primary.href = "assets/pdfs/" + SUBJECT_CONFIG.structureLabel +
            "-" + index + "-Cheat-Sheet.pdf";
        primary.target = "_blank";
        primary.rel = "noopener";
        primary.textContent = "Open " + SUBJECT_CONFIG.structureLabel +
            " " + index + " Cheat Sheet";
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
        open.href = "#practice-sets-" + index;
        open.textContent = "Open " + SUBJECT_CONFIG.structureLabel +
            " " + index + " Practice Set";
        card.appendChild(open);

        // Topic guides as plain text labels, no PDF links in the Practice Sets hub.
        appendSubtopics(card, index, false);

        grid.appendChild(card);
    });

    container.appendChild(grid);
}
