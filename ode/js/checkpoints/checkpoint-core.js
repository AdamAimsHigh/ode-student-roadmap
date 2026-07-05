/* Checkpoint core engine.

   Shared machinery for every interactive checkpoint widget:
   - shell(): lazy widget chrome, the full widget builds only when the student
     begins, so a page with 125 modules stays light.
   - Failure state engine: a wrong attempt NEVER reveals the answer. It shows
     an escalating first-principles guiding question instead.
   - pass(): records progress keyed by module title (checkpoint type ids are
     reused across modules) and re-renders so Guided Pathway gates open.
   - Math.js numeric comparison helpers so student expressions are judged by
     mathematical equivalence, not string matching.
   - Desmos helpers for graph-based checkpoints.
   - Reusable interaction builders: matching game, category sorter,
     expression tasks, and a multiple choice logic gate. */

const CheckpointCore = (function () {

    // ---------- KaTeX ----------

    function renderMath(el) {
        if (typeof renderMathInElement === "function") {
            renderMathInElement(el, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ],
                // Scoped re-render guard: skip subtrees KaTeX already typeset
                // (class "katex"). Checkpoint stages re-render on state changes,
                // so this keeps a repeat pass from re-descending settled math.
                // Fresh "$...$" text is never inside a .katex node.
                ignoredClasses: ["katex"]
            });
        }
    }

    // ---------- Math.js helpers ----------

    function toRealNumber(value) {
        if (typeof value === "number") return value;
        if (value && typeof value === "object" && typeof value.re === "number") {
            return Math.abs(value.im) > 1e-9 ? NaN : value.re;
        }
        return NaN;
    }

    function usesOnlyVariables(exprStr, allowed) {
        const permitted = allowed.concat(["e", "pi", "E", "PI", "i"]);
        try {
            const node = math.parse(exprStr);
            let offending = null;
            node.traverse(function (n, path, parent) {
                if (!n.isSymbolNode) return;
                if (parent && parent.isFunctionNode && parent.fn === n) return;
                if (permitted.indexOf(n.name) === -1 && !offending) {
                    offending = n.name;
                }
            });
            return offending;
        } catch (err) {
            return null; // syntax problems surface in compile, not here
        }
    }

    function sampleScope(variables, i, samples, lo, hi) {
        const scope = {};
        variables.forEach(function (v, idx) {
            const t = ((i + 0.5) / samples + idx * 0.31) % 1;
            scope[v] = lo + (hi - lo) * t;
        });
        return scope;
    }

    /* True when the student expression numerically equals the target
       expression across a sample grid. */
    function expressionsMatch(studentExpr, targetExpr, variables, options) {
        const opts = options || {};
        const samples = opts.samples || 10;
        const lo = (opts.min !== undefined) ? opts.min : 0.4;
        const hi = (opts.max !== undefined) ? opts.max : 2.4;
        const tol = opts.tolerance || 1e-3;

        const offending = usesOnlyVariables(studentExpr, variables);
        if (offending) {
            return { ok: false, error: "The symbol " + offending + " is not expected here. Use only: " + variables.join(", ") + "." };
        }

        let student;
        try {
            student = math.compile(studentExpr);
        } catch (err) {
            return { ok: false, error: "The expression could not be read. Check the syntax, for example 2x, x^2, or e^(2x)." };
        }
        const target = math.compile(targetExpr);

        let valid = 0;
        for (let i = 0; i < samples; i++) {
            const scope = sampleScope(variables, i, samples, lo, hi);
            let sVal, tVal;
            try {
                sVal = toRealNumber(student.evaluate(Object.assign({}, scope)));
                tVal = toRealNumber(target.evaluate(Object.assign({}, scope)));
            } catch (err) {
                return { ok: false, error: "The expression could not be evaluated. Use only the variables " + variables.join(", ") + "." };
            }
            if (!isFinite(sVal) || !isFinite(tVal)) continue;
            valid++;
            const scale = Math.max(1, Math.abs(tVal));
            if (Math.abs(sVal - tVal) > tol * scale) {
                return { ok: false };
            }
        }
        if (valid < Math.ceil(samples / 2)) {
            return { ok: false, error: "The expression could not be evaluated on enough points. Check it and try again." };
        }
        return { ok: true };
    }

    /* True when d/dx of the student expression equals target(x) times the
       student expression, judged numerically. Used for integrating factors,
       where any nonzero constant multiple is a correct answer. */
    function satisfiesGrowthLaw(studentExpr, rateExpr, variable, options) {
        const opts = options || {};
        const lo = (opts.min !== undefined) ? opts.min : 0.2;
        const hi = (opts.max !== undefined) ? opts.max : 1.8;
        const samples = opts.samples || 9;
        const tol = opts.tolerance || 5e-3;
        const h = 1e-4;

        let student;
        try {
            student = math.compile(studentExpr);
        } catch (err) {
            return { ok: false, error: "The expression could not be read. Check the syntax, for example e^(2x)." };
        }
        const rate = math.compile(rateExpr);

        let valid = 0;
        for (let i = 0; i < samples; i++) {
            const x = lo + (hi - lo) * (i + 0.5) / samples;
            let fPlus, fMinus, fHere, rHere;
            try {
                const sp = {}; sp[variable] = x + h;
                const sm = {}; sm[variable] = x - h;
                const s0 = {}; s0[variable] = x;
                fPlus = toRealNumber(student.evaluate(sp));
                fMinus = toRealNumber(student.evaluate(sm));
                fHere = toRealNumber(student.evaluate(s0));
                rHere = toRealNumber(rate.evaluate({ x: x }));
            } catch (err) {
                return { ok: false, error: "The expression could not be evaluated. Use the variable " + variable + " only." };
            }
            if (!isFinite(fPlus) || !isFinite(fMinus) || !isFinite(fHere) || Math.abs(fHere) < 1e-9) continue;
            valid++;
            const derivative = (fPlus - fMinus) / (2 * h);
            const expected = rHere * fHere;
            const scale = Math.max(1, Math.abs(expected));
            if (Math.abs(derivative - expected) > tol * scale) {
                return { ok: false };
            }
        }
        if (valid < Math.ceil(samples / 2)) {
            return { ok: false, error: "The expression vanished or failed on too many points. Check it and try again." };
        }
        return { ok: true };
    }

    /* True when the gradient of the student expression numerically equals
       the target component expressions. Judges potential functions: any
       additive constant passes automatically because differentiation
       removes it. */
    function gradientMatches(studentExpr, targetExprs, variables, options) {
        const opts = options || {};
        const samples = opts.samples || 9;
        const lo = (opts.min !== undefined) ? opts.min : 0.4;
        const hi = (opts.max !== undefined) ? opts.max : 2.2;
        const tol = opts.tolerance || 5e-3;
        const h = 1e-4;

        let student;
        try {
            student = math.compile(studentExpr);
        } catch (err) {
            return { ok: false, error: "The expression could not be read. Check the syntax, for example x^2*y + x." };
        }
        const targets = targetExprs.map(function (t) { return math.compile(t); });

        let valid = 0;
        for (let i = 0; i < samples; i++) {
            const scope = sampleScope(variables, i, samples, lo, hi);
            let allFinite = true;
            const partials = [];
            const expected = [];
            try {
                for (let j = 0; j < variables.length; j++) {
                    const plus = Object.assign({}, scope);
                    const minus = Object.assign({}, scope);
                    plus[variables[j]] += h;
                    minus[variables[j]] -= h;
                    const d = (toRealNumber(student.evaluate(plus)) - toRealNumber(student.evaluate(minus))) / (2 * h);
                    const t = toRealNumber(targets[j].evaluate(Object.assign({}, scope)));
                    if (!isFinite(d) || !isFinite(t)) { allFinite = false; break; }
                    partials.push(d);
                    expected.push(t);
                }
            } catch (err) {
                return { ok: false, error: "The expression could not be evaluated. Use only the variables " + variables.join(", ") + "." };
            }
            if (!allFinite) continue;
            valid++;
            for (let j = 0; j < variables.length; j++) {
                const scale = Math.max(1, Math.abs(expected[j]));
                if (Math.abs(partials[j] - expected[j]) > tol * scale) {
                    return { ok: false };
                }
            }
        }
        if (valid < Math.ceil(samples / 2)) {
            return { ok: false, error: "The expression could not be evaluated on enough points. Check it and try again." };
        }
        return { ok: true };
    }

    /* Parses a numeric student answer and compares it to a target. */
    function numberEquals(valueStr, target, tolerance) {
        let parsed;
        try {
            parsed = math.evaluate(valueStr);
        } catch (err) {
            return { ok: false, error: "Enter a number, for example 2.25 or 1/2." };
        }
        parsed = toRealNumber(parsed);
        if (!isFinite(parsed)) {
            return { ok: false, error: "Enter a single numeric value." };
        }
        return { ok: Math.abs(parsed - target) <= tolerance };
    }

    // ---------- Canvas math view ----------

    /* A lightweight world-coordinate canvas for visuals Desmos cannot
       reliably produce, such as direction fields. */
    function mathCanvas(parent, opts) {
        const o = opts || {};
        const xMin = (o.xMin !== undefined) ? o.xMin : -5;
        const xMax = (o.xMax !== undefined) ? o.xMax : 5;
        const yMin = (o.yMin !== undefined) ? o.yMin : -5;
        const yMax = (o.yMax !== undefined) ? o.yMax : 5;

        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = o.height || 360;
        canvas.className = "math-canvas";
        parent.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        function px(x) { return (x - xMin) / (xMax - xMin) * canvas.width; }
        function py(y) { return canvas.height - (y - yMin) / (yMax - yMin) * canvas.height; }

        return {
            canvas: canvas,

            clear: function () {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            },

            axes: function () {
                ctx.strokeStyle = "#c8c8d0";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(px(xMin), py(0)); ctx.lineTo(px(xMax), py(0));
                ctx.moveTo(px(0), py(yMin)); ctx.lineTo(px(0), py(yMax));
                ctx.stroke();
            },

            slopeField: function (f, spacing) {
                const gap = spacing || 0.5;
                ctx.strokeStyle = "#9aa0b8";
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let x = xMin + gap / 2; x < xMax; x += gap) {
                    for (let y = yMin + gap / 2; y < yMax; y += gap) {
                        const m = f(x, y);
                        if (!isFinite(m)) continue;
                        const half = gap * 0.32;
                        const dx = half / Math.sqrt(1 + m * m);
                        const dy = m * dx;
                        ctx.moveTo(px(x - dx), py(y - dy));
                        ctx.lineTo(px(x + dx), py(y + dy));
                    }
                }
                ctx.stroke();
            },

            curve: function (fn, color) {
                ctx.strokeStyle = color || "#6042a6";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                let started = false;
                const steps = 300;
                for (let i = 0; i <= steps; i++) {
                    const x = xMin + (xMax - xMin) * i / steps;
                    const y = fn(x);
                    if (!isFinite(y) || Math.abs(y) > 1e4) { started = false; continue; }
                    if (started) {
                        ctx.lineTo(px(x), py(y));
                    } else {
                        ctx.moveTo(px(x), py(y));
                        started = true;
                    }
                }
                ctx.stroke();
            },

            point: function (x, y, color, label) {
                ctx.fillStyle = color || "#c74440";
                ctx.beginPath();
                ctx.arc(px(x), py(y), 6, 0, 2 * Math.PI);
                ctx.fill();
                if (label) {
                    ctx.font = "13px sans-serif";
                    ctx.fillText(label, px(x) + 10, py(y) - 8);
                }
            }
        };
    }

    /* A labeled range slider with a live numeric readout. Returns a holder
       whose .value always carries the current number. */
    function rangeControl(parent, config) {
        const row = document.createElement("div");
        row.className = "slider-row";

        const label = document.createElement("span");
        label.className = "slider-label";
        label.textContent = config.label;

        const input = document.createElement("input");
        input.type = "range";
        input.min = String(config.min);
        input.max = String(config.max);
        input.step = String(config.step);
        input.value = String(config.value);

        const readout = document.createElement("span");
        readout.className = "slider-readout";
        readout.textContent = String(config.value);

        const holder = { value: config.value };
        input.addEventListener("input", function () {
            holder.value = parseFloat(input.value);
            readout.textContent = String(holder.value);
            if (config.onChange) config.onChange(holder.value);
        });

        row.appendChild(label);
        row.appendChild(input);
        row.appendChild(readout);
        parent.appendChild(row);
        return holder;
    }

    // ---------- Desmos helpers ----------

    function desmosGraph(parent, options) {
        if (typeof Desmos === "undefined") {
            const warn = document.createElement("p");
            warn.className = "checkpoint-placeholder";
            warn.textContent = "The Desmos graphing library did not load. Check your connection and reload the page to use this checkpoint.";
            parent.appendChild(warn);
            return null;
        }
        const frame = document.createElement("div");
        frame.className = "desmos-frame";
        parent.appendChild(frame);
        return Desmos.GraphingCalculator(frame, Object.assign({
            expressions: false,
            settingsMenu: false,
            zoomButtons: true,
            border: false,
            keypad: false
        }, options || {}));
    }

    /* Observes a slider variable in a Desmos calculator. Returns a holder
       object whose .value field always carries the latest numeric value. */
    function observeValue(calculator, latexVariable) {
        const holder = { value: NaN };
        if (!calculator) return holder;
        const helper = calculator.HelperExpression({ latex: latexVariable });
        helper.observe("numericValue", function () {
            holder.value = helper.numericValue;
        });
        return holder;
    }

    // ---------- Shell and the failure-state engine ----------

    function shell(container, moduleData, config, buildFn) {
        const heading = document.createElement("div");
        heading.className = "checkpoint-heading";
        heading.textContent = CheckpointRegistry.titleFromId(moduleData.interactive_checkpoint);
        container.appendChild(heading);

        const intro = document.createElement("p");
        intro.className = "checkpoint-intro";
        intro.textContent = config.description;
        container.appendChild(intro);
        renderMath(intro);

        if (ODEState.isCheckpointPassed(moduleData.module)) {
            const done = document.createElement("p");
            done.className = "checkpoint-feedback success";
            done.textContent = "Checkpoint passed. You can revisit it any time by reopening this page in Exploration Mode.";
            container.appendChild(done);
        }

        const beginBtn = document.createElement("button");
        beginBtn.type = "button";
        beginBtn.className = "checkpoint-begin-btn";
        beginBtn.textContent = "Begin Checkpoint";
        container.appendChild(beginBtn);

        beginBtn.addEventListener("click", function () {
            beginBtn.remove();

            const body = document.createElement("div");
            body.className = "checkpoint-body";
            container.appendChild(body);

            const feedback = document.createElement("div");
            feedback.className = "checkpoint-feedback";
            container.appendChild(feedback);

            const api = createApi(moduleData, config, feedback);
            buildFn(body, api);
            renderMath(body);
        });
    }

    function createApi(moduleData, config, feedback) {
        let attempts = 0;
        let passed = false;

        function showGuide(text, extra) {
            feedback.className = "checkpoint-feedback failure";
            feedback.innerHTML = "";

            const lead = document.createElement("p");
            lead.textContent = "Not yet. Consider this guiding question:";
            feedback.appendChild(lead);

            const question = document.createElement("p");
            question.className = "guiding-question";
            question.textContent = text;
            feedback.appendChild(question);

            if (extra) {
                const detail = document.createElement("p");
                detail.className = "feedback-extra";
                detail.textContent = extra;
                feedback.appendChild(detail);
            }
            renderMath(feedback);
        }

        return {
            pass: function (message) {
                if (passed) return;
                passed = true;
                attempts++;
                feedback.className = "checkpoint-feedback success";
                feedback.textContent = message || "Checkpoint passed. Your reasoning holds from first principles.";
                ODEState.setCheckpointPassed(moduleData.module, {
                    passed: true,
                    attempts: attempts,
                    checkpoint: moduleData.interactive_checkpoint
                });
                // Let the student read the success message, then refresh the
                // layout so Guided Pathway gates open and badges update.
                setTimeout(function () {
                    const y = window.scrollY;
                    if (typeof renderCurriculum === "function") renderCurriculum();
                    window.scrollTo(0, y);
                }, 1600);
            },

            /* A failed attempt. Escalates through the configured guiding
               questions and never reveals the final answer. */
            fail: function (extra) {
                attempts++;
                const guides = config.guidingQuestions || [];
                const guide = guides.length
                    ? guides[Math.min(attempts - 1, guides.length - 1)]
                    : "Return to the core definition in this module. Which part of it does your answer not yet respect?";
                showGuide(guide, extra);
            },

            /* A specific guiding question, for widgets that carry their own
               per-question guidance, such as the multiple choice logic gate. */
            guide: function (text, extra) {
                attempts++;
                showGuide(text, extra);
            },

            /* Input problems (syntax, wrong variables) are reported plainly.
               They are not failed attempts and trigger no guiding question. */
            error: function (message) {
                feedback.className = "checkpoint-feedback failure";
                feedback.textContent = message;
            },

            renderMath: renderMath
        };
    }

    // ---------- Reusable interaction builders ----------

    function shuffle(list) {
        const copy = list.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
        }
        return copy;
    }

    function checkButton(label, onClick) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "check-btn";
        btn.textContent = label || "Check My Answer";
        btn.addEventListener("click", onClick);
        return btn;
    }

    /* Matching game: click an item on the left, then its partner on the
       right. Clicking a paired item releases the pair. */
    function buildMatchingGame(body, api, config) {
        const prompt = document.createElement("p");
        prompt.className = "checkpoint-prompt";
        prompt.textContent = config.prompt;
        body.appendChild(prompt);

        const board = document.createElement("div");
        board.className = "match-board";
        body.appendChild(board);

        const leftCol = document.createElement("div");
        leftCol.className = "match-column";
        const rightCol = document.createElement("div");
        rightCol.className = "match-column";
        board.appendChild(leftCol);
        board.appendChild(rightCol);

        const pairs = config.pairs;
        const leftItems = shuffle(pairs.map(function (p, i) { return { text: p.left, key: i }; }));
        const rightItems = shuffle(pairs.map(function (p, i) { return { text: p.right, key: i }; }));

        let selectedLeft = null;
        const assignment = {}; // left key -> right key
        let pairCounter = 0;

        function refreshBadges() {
            board.querySelectorAll(".match-item").forEach(function (el) {
                const badge = el.querySelector(".pair-badge");
                if (badge) badge.remove();
            });
            let n = 0;
            Object.keys(assignment).forEach(function (leftKey) {
                n++;
                [leftCol, rightCol].forEach(function (col, side) {
                    const key = side === 0 ? leftKey : String(assignment[leftKey]);
                    const el = col.querySelector('[data-key="' + key + '"]');
                    if (el) {
                        const badge = document.createElement("span");
                        badge.className = "pair-badge";
                        badge.textContent = String(n);
                        el.appendChild(badge);
                    }
                });
            });
        }

        function makeItem(item, side) {
            const el = document.createElement("button");
            el.type = "button";
            el.className = "match-item";
            el.dataset.key = String(item.key);
            el.textContent = item.text;
            el.addEventListener("click", function () {
                if (side === "left") {
                    if (assignment.hasOwnProperty(item.key)) {
                        delete assignment[item.key];
                        refreshBadges();
                        return;
                    }
                    leftCol.querySelectorAll(".match-item").forEach(function (b) { b.classList.remove("selected"); });
                    el.classList.add("selected");
                    selectedLeft = item.key;
                } else {
                    const owner = Object.keys(assignment).find(function (k) { return assignment[k] === item.key; });
                    if (owner !== undefined) {
                        delete assignment[owner];
                        refreshBadges();
                        return;
                    }
                    if (selectedLeft === null) return;
                    assignment[selectedLeft] = item.key;
                    leftCol.querySelectorAll(".match-item").forEach(function (b) { b.classList.remove("selected"); });
                    selectedLeft = null;
                    pairCounter++;
                    refreshBadges();
                }
            });
            return el;
        }

        leftItems.forEach(function (item) { leftCol.appendChild(makeItem(item, "left")); });
        rightItems.forEach(function (item) { rightCol.appendChild(makeItem(item, "right")); });

        body.appendChild(checkButton("Check My Pairs", function () {
            const total = pairs.length;
            const made = Object.keys(assignment).length;
            if (made < total) {
                api.error("Pair every item before checking. " + made + " of " + total + " pairs are placed.");
                return;
            }
            let correct = 0;
            Object.keys(assignment).forEach(function (k) {
                if (Number(k) === assignment[k]) correct++;
            });
            if (correct === total) {
                api.pass();
            } else {
                api.fail(correct + " of " + total + " pairs are correctly matched. Adjust and check again.");
            }
        }));
    }

    /* Category sorter: each scenario gets a dropdown of categories. */
    function buildCategorySorter(body, api, config) {
        const prompt = document.createElement("p");
        prompt.className = "checkpoint-prompt";
        prompt.textContent = config.prompt;
        body.appendChild(prompt);

        const rows = [];
        shuffle(config.items).forEach(function (item) {
            const row = document.createElement("div");
            row.className = "sorter-row";

            const text = document.createElement("span");
            text.className = "sorter-text";
            text.textContent = item.text;

            const select = document.createElement("select");
            select.className = "sorter-select";
            const blank = document.createElement("option");
            blank.value = "";
            blank.textContent = "Choose a category";
            select.appendChild(blank);
            config.categories.forEach(function (cat) {
                const opt = document.createElement("option");
                opt.value = cat;
                opt.textContent = cat;
                select.appendChild(opt);
            });

            row.appendChild(text);
            row.appendChild(select);
            body.appendChild(row);
            rows.push({ select: select, answer: item.category });
        });

        body.appendChild(checkButton("Check My Sorting", function () {
            const unset = rows.filter(function (r) { return !r.select.value; }).length;
            if (unset > 0) {
                api.error("Assign a category to every scenario first. " + unset + " remain unassigned.");
                return;
            }
            const correct = rows.filter(function (r) { return r.select.value === r.answer; }).length;
            if (correct === rows.length) {
                api.pass();
            } else {
                api.fail(correct + " of " + rows.length + " scenarios are sorted correctly.");
            }
        }));
    }

    /* Expression task: one or more free-entry fields, each judged by a
       check function returning { ok, error }. */
    function buildExpressionTask(body, api, config) {
        const prompt = document.createElement("p");
        prompt.className = "checkpoint-prompt";
        prompt.textContent = config.prompt;
        body.appendChild(prompt);

        const inputs = [];
        config.fields.forEach(function (field) {
            const row = document.createElement("div");
            row.className = "expr-row";

            const label = document.createElement("label");
            label.className = "expr-label";
            label.textContent = field.label;

            let input;
            if (field.options) {
                input = document.createElement("select");
                input.className = "sorter-select";
                const blank = document.createElement("option");
                blank.value = "";
                blank.textContent = "Choose";
                input.appendChild(blank);
                field.options.forEach(function (optText) {
                    const opt = document.createElement("option");
                    opt.value = optText;
                    opt.textContent = optText;
                    input.appendChild(opt);
                });
            } else {
                input = document.createElement("input");
                input.type = "text";
                input.className = "expr-input";
                input.placeholder = field.placeholder || "";
                input.spellcheck = false;
            }

            row.appendChild(label);
            row.appendChild(input);
            body.appendChild(row);
            inputs.push({ field: field, input: input });
        });

        body.appendChild(checkButton(config.buttonLabel || "Check My Answer", function () {
            for (let i = 0; i < inputs.length; i++) {
                const value = inputs[i].input.value.trim();
                if (!value) {
                    api.error("Fill in every field before checking.");
                    return;
                }
            }
            for (let i = 0; i < inputs.length; i++) {
                const result = inputs[i].field.check(inputs[i].input.value.trim());
                if (result.error) {
                    api.error(result.error);
                    return;
                }
                if (!result.ok) {
                    api.fail();
                    return;
                }
            }
            api.pass();
        }));
    }

    /* Multiple choice logic gate: one question at a time, all must be
       answered correctly to pass. A wrong choice produces that question's
       guiding question, never the answer. */
    function buildLogicGate(body, api, config) {
        let index = 0;

        const stage = document.createElement("div");
        body.appendChild(stage);

        function renderQuestion() {
            stage.innerHTML = "";
            const q = config.questions[index];

            const counter = document.createElement("p");
            counter.className = "checkpoint-prompt";
            counter.textContent = "Question " + (index + 1) + " of " + config.questions.length;
            stage.appendChild(counter);

            const text = document.createElement("p");
            text.className = "mcq-question";
            text.textContent = q.text;
            stage.appendChild(text);

            shuffle(q.options).forEach(function (option) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "mcq-option";
                btn.textContent = option.text;
                btn.addEventListener("click", function () {
                    if (option.correct) {
                        index++;
                        if (index >= config.questions.length) {
                            api.pass();
                            stage.innerHTML = "";
                        } else {
                            renderQuestion();
                            api.error("Correct. Next question.");
                        }
                    } else {
                        api.guide(q.guide);
                    }
                });
                stage.appendChild(btn);
            });

            api.renderMath(stage);
        }

        renderQuestion();
    }

    return {
        shell: shell,
        renderMath: renderMath,
        expressionsMatch: expressionsMatch,
        satisfiesGrowthLaw: satisfiesGrowthLaw,
        gradientMatches: gradientMatches,
        usesOnlyVariables: usesOnlyVariables,
        numberEquals: numberEquals,
        mathCanvas: mathCanvas,
        rangeControl: rangeControl,
        desmosGraph: desmosGraph,
        observeValue: observeValue,
        buildMatchingGame: buildMatchingGame,
        buildCategorySorter: buildCategorySorter,
        buildExpressionTask: buildExpressionTask,
        buildLogicGate: buildLogicGate,
        checkButton: checkButton
    };
})();
