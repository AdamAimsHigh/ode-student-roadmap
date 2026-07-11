/* Quiz engine, a focused multiple choice runner for Micro Practice
   (five items per video) and Unit Mastery (thirty items per unit).

   Presentation:
   - mount() chooses a surface from the config. Unit Mastery renders a launch
     card whose button opens a full screen modal. Micro Practice sets
     config.inline, so mount() renders the questions directly inline in the
     column beside the video, with no overlay covering the player.
   - openModal() opens a centered overlay on top of the page and paces the
     student through one question at a time.
   - mountInline() renders the same question flow inline within its host column.
   - runQuiz() drives the question flow for either surface.
   - Each question offers a general hint toggle, renders a per option rationale
     directly beneath the chosen option, and the final Finish leads to a
     Practice Complete summary rather than closing outright.

   Pedagogy, the Math Confidence Reset:
   - A wrong choice never reveals the correct answer. Its rationale is a guiding
     question rooted in first principles so the student re-derives the idea.
   - A correct choice shows a confirming rationale.
   - Score is tracked live as questions are answered.

   Schema mapping:
   - item.hint                 the general hint, shown by the Need a hint toggle
   - item.answerOptions[].text       the option label
   - item.answerOptions[].correct    true on exactly one option
   - item.answerOptions[].rationale  inline text beneath that option, green when
                                     correct, red when incorrect

   Copy rule: no em dashes and no ampersands in any user facing string.
   Math is rendered with KaTeX, inline with single dollar signs and display
   with double dollar signs, matching the checkpoint widgets. */

const QuizEngine = (function () {

    function renderMath(el) {
        if (typeof renderMathInElement === "function") {
            renderMathInElement(el, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ]
            });
        }
    }

    function shuffle(list) {
        const copy = list.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = copy[i]; copy[i] = copy[j]; copy[j] = t;
        }
        return copy;
    }

    function questionId(config, item, index) {
        return item.id || (config.id + "::" + index);
    }

    /* Drives one quiz from start to summary inside a host surface.
       config:  { id, title, intro, items }
       live:    { solved: [questionId, ...] } shared with any launch card so its
                progress line refreshes later. Mutated as answers land.
       surface: {
           body:   element that holds the current question
           footer: element that holds the Next, Finish, and Retry buttons
           score:  element that shows the live score line
           inline: true when running directly in the page rather than a modal.
                   Inline runs leave out the Close Practice control since there
                   is no overlay to dismiss.
           close:  optional callback to dismiss a modal. Unused when inline.
       } */
    function runQuiz(config, live, surface) {
        const total = config.items.length;
        const body = surface.body;
        const footer = surface.footer;
        const score = surface.score;
        const inline = surface.inline === true;
        const close = surface.close || function () {};

        function updateScore() {
            score.textContent = "Score: " + live.solved.length + " of " + total;
        }

        // Open at the first unsolved question, otherwise at the start for review.
        let index = 0;
        for (let i = 0; i < total; i++) {
            const qid = questionId(config, config.items[i], i);
            if (live.solved.indexOf(qid) === -1) { index = i; break; }
        }

        // Renders an option's rationale directly beneath that option. The kind,
        // correct or incorrect, drives the success or error coloring.
        function fillRationale(el, text, kind) {
            el.hidden = false;
            el.className = "quiz-rationale " + kind;
            el.innerHTML = "";
            const p = document.createElement("p");
            p.className = "quiz-rationale-text";
            p.textContent = text;
            el.appendChild(p);
            renderMath(el);
        }

        // Clears this quiz's saved progress, resets the position and the live
        // solved record, then restarts from the first question un-solved.
        function restart() {
            ODEState.clearQuizProgress(config.id);
            live.solved.length = 0;
            index = 0;
            updateScore();
            renderQuestion();
        }

        function renderSummary() {
            body.innerHTML = "";
            footer.innerHTML = "";

            const wrap = document.createElement("div");
            wrap.className = "quiz-summary";

            const title = document.createElement("h4");
            title.className = "quiz-summary-title";
            title.textContent = "Practice Complete";
            wrap.appendChild(title);

            const scoreLine = document.createElement("p");
            scoreLine.className = "quiz-summary-score";
            scoreLine.textContent = "You answered " + live.solved.length + " of " + total + " correctly.";
            wrap.appendChild(scoreLine);

            const message = document.createElement("p");
            message.className = "quiz-summary-message";
            message.textContent = "Strong work. You reasoned each one from first principles instead of memorizing steps. Revisit this practice any time to keep the ideas sharp.";
            wrap.appendChild(message);

            body.appendChild(wrap);

            const retryBtn = document.createElement("button");
            retryBtn.type = "button";
            retryBtn.className = "quiz-retry-btn";
            retryBtn.textContent = "Retry Quiz";
            retryBtn.addEventListener("click", restart);
            footer.appendChild(retryBtn);

            // The Close Practice control only belongs to the modal. An inline
            // run stays in the page, so there is nothing to close.
            if (!inline) {
                const closeBtn = document.createElement("button");
                closeBtn.type = "button";
                closeBtn.className = "quiz-next-btn";
                closeBtn.textContent = "Close Practice";
                closeBtn.addEventListener("click", close);
                footer.appendChild(closeBtn);
                closeBtn.focus();
            } else {
                retryBtn.focus();
            }
        }

        function renderQuestion() {
            body.innerHTML = "";
            footer.innerHTML = "";

            const item = config.items[index];
            const qid = questionId(config, item, index);
            let solved = live.solved.indexOf(qid) !== -1;

            const counter = document.createElement("p");
            counter.className = "quiz-counter";
            counter.textContent = "Question " + (index + 1) + " of " + total;
            body.appendChild(counter);

            const prompt = document.createElement("p");
            prompt.className = "quiz-prompt";
            prompt.textContent = item.prompt;
            body.appendChild(prompt);

            // General hint toggle, shows the question level hint on demand.
            if (item.hint) {
                const hintToggle = document.createElement("button");
                hintToggle.type = "button";
                hintToggle.className = "quiz-hint-toggle";
                hintToggle.textContent = "Need a hint?";
                body.appendChild(hintToggle);

                const hintBox = document.createElement("div");
                hintBox.className = "quiz-hint";
                hintBox.hidden = true;
                const hintText = document.createElement("p");
                hintText.className = "quiz-hint-text";
                hintText.textContent = item.hint;
                hintBox.appendChild(hintText);
                body.appendChild(hintBox);

                hintToggle.addEventListener("click", function () {
                    hintBox.hidden = !hintBox.hidden;
                    hintToggle.textContent = hintBox.hidden ? "Need a hint?" : "Hide hint";
                    if (!hintBox.hidden) renderMath(hintBox);
                });
            }

            const optionList = document.createElement("div");
            optionList.className = "quiz-options";
            body.appendChild(optionList);

            function lock() {
                optionList.querySelectorAll(".quiz-option").forEach(function (b) {
                    b.disabled = true;
                });
            }

            function showNext() {
                footer.innerHTML = "";
                const last = index >= total - 1;
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "quiz-next-btn";
                btn.textContent = last ? "Finish" : "Next Question";
                btn.addEventListener("click", function () {
                    if (last) {
                        renderSummary();
                    } else {
                        index++;
                        renderQuestion();
                    }
                });
                footer.appendChild(btn);
                btn.focus();
            }

            shuffle(item.answerOptions).forEach(function (option) {
                const row = document.createElement("div");
                row.className = "quiz-option-row";

                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "quiz-option";
                btn.textContent = option.text;

                const rationale = document.createElement("div");
                rationale.className = "quiz-rationale";
                rationale.hidden = true;

                // On a restored, already solved question, mark the right choice
                // and show its confirming rationale. This is not a reveal on a
                // wrong attempt, the question was already answered correctly.
                if (solved && option.correct) {
                    btn.classList.add("correct");
                    if (option.rationale) fillRationale(rationale, option.rationale, "correct");
                }

                btn.addEventListener("click", function () {
                    if (solved) return;
                    /* Every graded click is a telemetry attempt, wrong answers
                       included: the mastery model needs the misses that the
                       correct-only persistence loop below never sees. */
                    if (typeof ODETelemetry !== "undefined") {
                        ODETelemetry.record("q", qid, option.correct === true,
                            { skillId: config.id });
                    }
                    if (option.correct) {
                        solved = true;
                        btn.classList.add("correct");
                        if (option.rationale) fillRationale(rationale, option.rationale, "correct");
                        lock();
                        if (live.solved.indexOf(qid) === -1) {
                            live.solved.push(qid);
                            ODEState.setQuizAnswerCorrect(config.id, qid);
                        }
                        updateScore();
                        showNext();
                    } else {
                        btn.classList.add("incorrect");
                        btn.disabled = true;
                        fillRationale(rationale, option.rationale || item.hint ||
                            "Return to the core definition in this video. Which part of it does this choice not respect?", "incorrect");
                    }
                });

                row.appendChild(btn);
                row.appendChild(rationale);
                optionList.appendChild(row);
                renderMath(btn);
            });

            renderMath(prompt);

            if (solved) {
                lock();
                showNext();
            } else {
                const first = optionList.querySelector(".quiz-option");
                if (first) first.focus();
            }
        }

        updateScore();
        renderQuestion();
    }

    /* Builds the shared, mutable record of solved question ids, seeded from
       persistence. Read by a launch card and grown as answers land. */
    function buildLive(config) {
        const saved = ODEState.getQuizProgress(config.id);
        return {
            solved: config.items
                .map(function (item, i) { return questionId(config, item, i); })
                .filter(function (qid) { return saved.indexOf(qid) !== -1; })
        };
    }

    /* Opens the focused practice overlay for the Unit Mastery quiz.
       config: { id, title, intro, items }
       live:   solved record shared with the launch card, refreshed on close.
       refresh: callback to re-render the launch card after the modal closes. */
    function openModal(config, live, refresh) {
        const overlay = document.createElement("div");
        overlay.className = "quiz-modal-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", config.title);

        const modal = document.createElement("div");
        modal.className = "quiz-modal";
        overlay.appendChild(modal);

        // Header: title, live score, exit.
        const header = document.createElement("div");
        header.className = "quiz-modal-header";

        const hTitle = document.createElement("h4");
        hTitle.className = "quiz-modal-title";
        hTitle.textContent = config.title;
        header.appendChild(hTitle);

        const score = document.createElement("span");
        score.className = "quiz-score";
        header.appendChild(score);

        const exit = document.createElement("button");
        exit.type = "button";
        exit.className = "quiz-modal-close";
        exit.textContent = "Exit Practice";
        header.appendChild(exit);
        modal.appendChild(header);

        const body = document.createElement("div");
        body.className = "quiz-modal-body";
        modal.appendChild(body);

        const footer = document.createElement("div");
        footer.className = "quiz-modal-footer";
        modal.appendChild(footer);

        function close() {
            document.removeEventListener("keydown", onKey);
            document.body.classList.remove("quiz-modal-open");
            overlay.remove();
            if (refresh) refresh();
        }

        function onKey(e) {
            if (e.key === "Escape") close();
        }

        exit.addEventListener("click", close);
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) close();
        });
        document.addEventListener("keydown", onKey);
        document.body.classList.add("quiz-modal-open");
        document.body.appendChild(overlay);

        runQuiz(config, live, { body: body, footer: footer, score: score, inline: false, close: close });
    }

    /* Renders the Micro Practice quiz directly inline within its column, so the
       student can watch the video and practice side by side without an overlay
       covering the player. The questions are visible right away, no launch
       button stands between the student and the practice. */
    function mountInline(container, config) {
        const live = buildLive(config);

        const panel = document.createElement("section");
        panel.className = "quiz-inline-panel";

        const header = document.createElement("div");
        header.className = "quiz-inline-header";

        const title = document.createElement("h4");
        title.className = "quiz-inline-title";
        title.textContent = config.title;
        header.appendChild(title);

        const score = document.createElement("span");
        score.className = "quiz-score";
        header.appendChild(score);
        panel.appendChild(header);

        if (config.intro) {
            const intro = document.createElement("p");
            intro.className = "quiz-intro";
            intro.textContent = config.intro;
            panel.appendChild(intro);
        }

        const body = document.createElement("div");
        body.className = "quiz-inline-body";
        panel.appendChild(body);

        const footer = document.createElement("div");
        footer.className = "quiz-inline-footer";
        panel.appendChild(footer);

        container.appendChild(panel);

        runQuiz(config, live, { body: body, footer: footer, score: score, inline: true, close: null });
    }

    /* Public entry point. Renders the launch card.
       container: host element to mount into
       config: {
           id:    stable string, used as the persistence key
           title: heading text
           intro: optional line under the heading
           items: array of {
               prompt,
               hint,                            general hint string
               answerOptions: [ { text, correct, rationale } ]
           }
       }
       Each item has exactly one answer option with correct set to true. Every
       option carries a rationale. The correct rationale confirms, an incorrect
       rationale is a guiding question that never states the answer. */
    function mount(container, config) {
        if (!config || !config.items || !config.items.length) return;

        // Micro Practice runs inline in its column. Unit Mastery keeps the
        // launch card and full screen modal below.
        if (config.inline) {
            mountInline(container, config);
            return;
        }

        const total = config.items.length;

        // Shared, mutable record of which question ids are solved. Seeded from
        // persistence, grown by the modal, read by the launch card.
        const live = buildLive(config);

        const card = document.createElement("section");
        card.className = "quiz-launch-card";

        const title = document.createElement("h4");
        title.className = "quiz-title";
        title.textContent = config.title;
        card.appendChild(title);

        if (config.intro) {
            const intro = document.createElement("p");
            intro.className = "quiz-intro";
            intro.textContent = config.intro;
            card.appendChild(intro);
        }

        const progress = document.createElement("p");
        progress.className = "quiz-progress";
        card.appendChild(progress);

        const launch = document.createElement("button");
        launch.type = "button";
        launch.className = "quiz-launch-btn";
        card.appendChild(launch);

        function refresh() {
            const done = live.solved.length;
            progress.textContent = "Progress: " + done + " of " + total + " complete";
            launch.textContent = done === 0
                ? "Launch Practice"
                : (done >= total ? "Review Practice" : "Resume Practice");
        }
        refresh();

        launch.addEventListener("click", function () {
            openModal(config, live, refresh);
        });

        container.appendChild(card);
        renderMath(card);
    }

    return { mount: mount };
})();
