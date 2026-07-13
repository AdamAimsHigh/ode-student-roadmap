/* Custom Quiz Factory view, the #quiz-builder route.

   Lets a student compose their own practice session: pick any set of units
   from the curriculum, choose a question count, and the factory aggregates
   a quiz from the schema v2 adaptive pools. Aggregation is asynchronous by
   construction: every selected unit's lazy bank chunk is hydrated through
   ODEBank.ensureUnit in parallel (a Promise.all over the callback contract,
   still file:// legal because the loader injects classic script elements),
   and only then does the factory filter QUIZ_DATA.pool down to the chosen
   units and hand the finished array to QuizEngine.startSession.

   Depth guarantee: when the static pools alone cannot cover the requested
   count, the factory asks ODEBank.freshPoolItems for additional parametric
   template instantiations (new parameter draws, salted ids, stable skill
   ids), and finally falls back to the curated unit mastery banks stamped
   with the mastery skill key, mirroring the adaptive composer's sourcing
   order. If the selection still cannot reach the requested count the quiz
   runs with everything available and says so.

   Classic script loaded before router.js (Pillar 1 boot order); no ES
   modules, no fetch. Copy rule: no em-dashes, no ampersands. */

function renderQuizBuilder(container) {
    buildIndexShell(container, "Custom Quiz Factory",
        "Build your own practice session. Choose the units you want, set the length, and the factory assembles the questions.");

    const structureLabel = (typeof SUBJECT_CONFIG !== "undefined" &&
        SUBJECT_CONFIG.structureLabel) || "Unit";
    const units = (typeof SUBJECT_CONFIG !== "undefined" &&
        SUBJECT_CONFIG.units) || [];

    if (!units.length || typeof ODEBank === "undefined") {
        const note = document.createElement("p");
        note.className = "static-page-placeholder";
        note.textContent = "The question banks are not available in this shell, so a custom quiz cannot be built here.";
        container.appendChild(note);
        return;
    }

    const panel = document.createElement("section");
    panel.className = "quiz-builder-panel";

    /* ---- Unit multi-select ------------------------------------------------ */

    const unitHeading = document.createElement("h3");
    unitHeading.className = "quiz-builder-heading";
    unitHeading.textContent = "1. Pick your " + structureLabel.toLowerCase() + "s";
    panel.appendChild(unitHeading);

    const unitGrid = document.createElement("div");
    unitGrid.className = "builder-unit-grid";
    const unitChecks = [];

    units.forEach(function (unitData, index) {
        const option = document.createElement("label");
        option.className = "builder-unit-option";

        const check = document.createElement("input");
        check.type = "checkbox";
        check.value = String(index);
        check.className = "builder-unit-check";
        unitChecks.push(check);

        const text = document.createElement("span");
        text.className = "builder-unit-label";
        text.textContent = unitData.unit;

        check.addEventListener("change", function () {
            option.classList.toggle("selected", check.checked);
        });

        option.appendChild(check);
        option.appendChild(text);
        unitGrid.appendChild(option);
    });
    panel.appendChild(unitGrid);

    /* ---- Question count ---------------------------------------------------- */

    const countHeading = document.createElement("h3");
    countHeading.className = "quiz-builder-heading";
    countHeading.textContent = "2. Choose the length";
    panel.appendChild(countHeading);

    const countRow = document.createElement("div");
    countRow.className = "builder-count-row";
    const COUNT_CHOICES = [10, 20, 30];
    let selectedCount = COUNT_CHOICES[0];

    COUNT_CHOICES.forEach(function (count, i) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "builder-count-btn" + (i === 0 ? " active" : "");
        btn.textContent = count + " questions";
        btn.addEventListener("click", function () {
            selectedCount = count;
            countRow.querySelectorAll(".builder-count-btn").forEach(function (b) {
                b.classList.toggle("active", b === btn);
            });
        });
        countRow.appendChild(btn);
    });
    panel.appendChild(countRow);

    /* ---- Build action ------------------------------------------------------- */

    const buildHeading = document.createElement("h3");
    buildHeading.className = "quiz-builder-heading";
    buildHeading.textContent = "3. Build and practice";
    panel.appendChild(buildHeading);

    const buildBtn = document.createElement("button");
    buildBtn.type = "button";
    buildBtn.className = "builder-submit-btn";
    buildBtn.textContent = "Build My Quiz";
    panel.appendChild(buildBtn);

    const status = document.createElement("p");
    status.className = "builder-status";
    panel.appendChild(status);

    container.appendChild(panel);

    const quizHost = document.createElement("div");
    quizHost.className = "session-quiz-host";
    container.appendChild(quizHost);

    /* Hydration of one unit's bank chunk as a promise over the loader's
       callback contract. Failed chunks resolve too (composition tolerates
       a missing unit), so an aggregation can never hang. */
    function ensureUnitAsync(unit) {
        return new Promise(function (resolve) {
            if (ODEBank.hasFailed(unit)) { resolve(unit); return; }
            const ready = ODEBank.ensureUnit(unit, function () {
                resolve(unit);
            });
            if (ready) resolve(unit);
        });
    }

    /* Aggregates the item array for the chosen units and count, in the
       composer's sourcing order: hydrated static pools, fresh parametric
       instantiations, curated mastery banks. */
    function aggregateItems(selectedUnits, count) {
        const seen = {};
        const items = [];

        function push(item) {
            if (!item || !item.id || seen[item.id]) return;
            if (items.length >= count) return;
            seen[item.id] = true;
            items.push(item);
        }

        /* Pass 1: the session-stable adaptive pools, shuffled across the
           whole selection so no single unit dominates the front. */
        let poolItems = [];
        selectedUnits.forEach(function (unit) {
            poolItems = poolItems.concat(QUIZ_DATA.pool[unit] || []);
        });
        builderShuffle(poolItems).forEach(push);

        /* Pass 2: fresh parametric draws until the count is met or a full
           sweep adds nothing new (a selection with no templates cannot
           grow; the sweep cap keeps a thin selection from spinning). */
        let sweeps = 0;
        while (items.length < count && sweeps < 6) {
            const before = items.length;
            builderShuffle(selectedUnits).forEach(function (unit) {
                if (items.length >= count) return;
                ODEBank.freshPoolItems(unit).forEach(function (item) {
                    /* Only salted parametric re-rolls are new here; the
                       static passthroughs dedupe on their stable ids. */
                    push(item);
                });
            });
            if (items.length === before) break;
            sweeps++;
        }

        /* Pass 3: curated mastery banks, stamped with the mastery surface's
           skill key so telemetry stays consistent with the mastery quiz. */
        if (items.length < count) {
            let masteryItems = [];
            selectedUnits.forEach(function (unit) {
                const unitData = units[unit];
                (QUIZ_DATA.unit_mastery[unit] || []).forEach(function (item, i) {
                    const copy = {};
                    Object.keys(item).forEach(function (k) { copy[k] = item[k]; });
                    if (!copy.skillId && unitData) {
                        copy.skillId = "mastery::" + unitData.unit;
                    }
                    if (!copy.id) copy.id = "mpool::" + unit + "::" + i;
                    masteryItems.push(copy);
                });
            });
            builderShuffle(masteryItems).forEach(push);
        }

        return builderShuffle(items);
    }

    function buildQuiz() {
        const selectedUnits = unitChecks.filter(function (check) {
            return check.checked;
        }).map(function (check) {
            return parseInt(check.value, 10);
        });

        if (!selectedUnits.length) {
            status.textContent = "Select at least one " +
                structureLabel.toLowerCase() + " to build from.";
            status.classList.add("error");
            return;
        }

        status.classList.remove("error");
        status.textContent = "Loading the question banks for your selection.";
        buildBtn.disabled = true;
        quizHost.innerHTML = "";

        /* Simultaneous hydration: every selected unit's chunk loads in
           parallel and composition waits on the whole set. */
        Promise.all(selectedUnits.map(ensureUnitAsync)).then(function () {
            /* The student may have navigated away while chunks loaded. */
            if (window.location.hash !== "#quiz-builder" ||
                !document.body.contains(quizHost)) return;
            buildBtn.disabled = false;

            const items = aggregateItems(selectedUnits, selectedCount);
            if (!items.length) {
                status.textContent = "No questions are available for that selection right now. Try different " +
                    structureLabel.toLowerCase() + "s, or refresh the page if the banks failed to load.";
                status.classList.add("error");
                return;
            }

            status.textContent = items.length < selectedCount
                ? "Your selection holds " + items.length + " questions, so the session runs with all of them."
                : "Your " + items.length + " question session is ready. Good luck.";

            /* A rebuilt custom quiz always starts clean: stale solved ids
               from an earlier build must not pre-answer this one. */
            const quizId = "builder::custom";
            ODEState.clearQuizProgress(quizId);
            QuizEngine.startSession(quizHost, {
                id: quizId,
                title: "Your Custom Quiz",
                intro: "Questions drawn from the " +
                    structureLabel.toLowerCase() + "s you picked. A wrong choice gives you a guiding question, not the answer.",
                items: items,
                inline: true
            });
            quizHost.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    buildBtn.addEventListener("click", buildQuiz);
}

/* Local shuffle helper (Fisher-Yates on a copy), file scope so the view
   never reaches into another module's internals. */
function builderShuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = copy[i]; copy[i] = copy[j]; copy[j] = t;
    }
    return copy;
}
