/* Lazy question-bank loader (Content Schema v2, Sprint Rec 2).

   The monolithic quiz-data.js (2.5 MB parsed at boot) is retired. Question
   and practice content now ships as one generated chunk per unit under
   js/bank/bank-unit-NN.js, loaded on the first navigation that needs it.

   file:// legality: fetch() of sibling files is blocked on the file://
   scheme, but dynamically injected <script> elements execute normally, so
   this loader preserves the Pillar 1 zero-dependency contract. Chunk src
   values are document-relative, so the same tree runs from file://, from
   /ode/ in production, or from any future mount point.

   This file owns the QUIZ_DATA and PRACTICE_DATA global shells the views
   consume. Each chunk calls ODEBank.registerUnit(n, {v, d, p}), which:
     1. decodes the compile-time dictionary compression (payload strings
        reference dictionary entries via a 3-char code: the U+00A4 sentinel
        plus a two-char base-62 index; one regex pass restores them);
     2. expands parametric templates (items carrying params) into concrete
        items, once per session, via a built-in arithmetic evaluator, so a
        template needs no Math.js and works with every CDN blocked;
     3. hydrates the globals and flushes the waiting re-render callbacks.

   Load order contract: this file parses before the view layer (views read
   the globals it declares) and is independent of state.js and telemetry.js.
   Every failure path is contained: a chunk that fails to load marks its
   unit failed and the views render a graceful note instead of looping. */

/* Global data shells, hydrated per unit by ODEBank.registerUnit. Shapes
   match the retired monolith exactly, so every consumer reads unchanged:
   micro_practice keyed by video id, unit_mastery keyed by unit number.
   pool is new in v2: the per-unit adaptive question pool from bank.json. */
var QUIZ_DATA = { micro_practice: {}, unit_mastery: {}, pool: {} };
var PRACTICE_DATA = {};

const ODEBank = (function () {
    const ALPHABET =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    /* U+00A4 is the dictionary sentinel. It survives json emission unescaped
       (unlike a control character) and the content validator forbids it in
       canonical strings, so a code can never collide with real content. */
    const CODE_RE = /¤([0-9A-Za-z]{2})/g;

    /* Per-unit load state: undefined (untouched), "loading", "ready",
       "failed". Failure is sticky for the session: the error flush already
       re-rendered the views once, and retrying from inside that re-render
       would loop forever on a permanently missing chunk. A reload retries. */
    const status = {};
    const waiters = {};

    function decodeString(s, dict) {
        return s.replace(CODE_RE, function (match, code) {
            const index = ALPHABET.indexOf(code.charAt(0)) * 62 +
                ALPHABET.indexOf(code.charAt(1));
            const entry = dict[index];
            return entry === undefined ? match : entry;
        });
    }

    /* Restores every string value in a decoded chunk payload. Object keys
       (video ids, field names) are emitted uncompressed by the compiler. */
    function decodeDeep(value, dict) {
        if (typeof value === "string") return decodeString(value, dict);
        if (Array.isArray(value)) {
            return value.map(function (v) { return decodeDeep(v, dict); });
        }
        if (value && typeof value === "object") {
            const out = {};
            Object.keys(value).forEach(function (k) {
                out[k] = decodeDeep(value[k], dict);
            });
            return out;
        }
        return value;
    }

    /* ---- Parametric templates ------------------------------------------ */

    /* Tiny arithmetic evaluator for derived template values: integers,
       param names, + - * / ^, parentheses, unary minus. ^ binds tightest
       and associates right. Recursive descent, no eval, no Math.js, so
       templates instantiate identically on file:// with every CDN blocked. */
    function evalExpr(expr, env) {
        let pos = 0;

        function skipSpaces() {
            while (pos < expr.length && expr.charAt(pos) === " ") pos++;
        }

        function parsePrimary() {
            skipSpaces();
            const c = expr.charAt(pos);
            if (c === "(") {
                pos++;
                const v = parseSum();
                skipSpaces();
                if (expr.charAt(pos) !== ")") throw new Error("expected )");
                pos++;
                return v;
            }
            if (c === "-") { pos++; return -parsePrimary(); }
            if (c >= "0" && c <= "9") {
                let end = pos;
                while (end < expr.length &&
                    expr.charAt(end) >= "0" && expr.charAt(end) <= "9") end++;
                const v = parseInt(expr.slice(pos, end), 10);
                pos = end;
                return v;
            }
            let end = pos;
            while (end < expr.length && /[a-z0-9_]/.test(expr.charAt(end))) end++;
            const name = expr.slice(pos, end);
            pos = end;
            if (!name || !Object.prototype.hasOwnProperty.call(env, name)) {
                throw new Error("unknown name in expression: " + name);
            }
            return env[name];
        }

        function parsePower() {
            const base = parsePrimary();
            skipSpaces();
            if (expr.charAt(pos) === "^") {
                pos++;
                return Math.pow(base, parsePower());
            }
            return base;
        }

        function parseProduct() {
            let v = parsePower();
            for (;;) {
                skipSpaces();
                const c = expr.charAt(pos);
                if (c === "*") { pos++; v *= parsePower(); }
                else if (c === "/") { pos++; v /= parsePower(); }
                else return v;
            }
        }

        function parseSum() {
            let v = parseProduct();
            for (;;) {
                skipSpaces();
                const c = expr.charAt(pos);
                if (c === "+") { pos++; v += parseProduct(); }
                else if (c === "-") { pos++; v -= parseProduct(); }
                else return v;
            }
        }

        const result = parseSum();
        skipSpaces();
        if (pos !== expr.length) throw new Error("trailing input: " + expr);
        if (!isFinite(result)) throw new Error("non-finite result: " + expr);
        return result;
    }

    function drawParam(spec) {
        const step = typeof spec.step === "number" && spec.step > 0
            ? spec.step : 1;
        const count = Math.floor((spec.max - spec.min) / step) + 1;
        return spec.min + step * Math.floor(Math.random() * Math.max(1, count));
    }

    function substitute(text, env) {
        return text.replace(/\{\{([a-z][a-z0-9]*)\}\}/g, function (match, name) {
            return Object.prototype.hasOwnProperty.call(env, name)
                ? String(env[name]) : match;
        });
    }

    /* Expands one bank item. Items without params pass through untouched.
       A template draws each param uniformly from its integer range, then
       evaluates derived expressions (in authored order; later expressions
       may reference earlier names), then substitutes {{name}} placeholders
       in every string field. The item id stays stable across sessions so
       progress and telemetry key consistently. A broken template returns
       null and is dropped: bank content can never break a lesson. */
    function instantiate(item) {
        if (!item || typeof item !== "object") return null;
        if (!item.params) return item;
        try {
            const env = {};
            Object.keys(item.params).forEach(function (name) {
                env[name] = drawParam(item.params[name]);
            });
            if (item.derived) {
                Object.keys(item.derived).forEach(function (name) {
                    env[name] = evalExpr(item.derived[name], env);
                });
            }
            const out = { id: item.id, prompt: substitute(item.prompt, env) };
            if (item.skillId) out.skillId = item.skillId;
            if (typeof item.difficulty === "number") {
                out.difficulty = item.difficulty;
            }
            if (item.hint) out.hint = substitute(item.hint, env);
            out.answerOptions = (item.answerOptions || []).map(function (opt) {
                const o = { text: substitute(opt.text, env) };
                if (opt.correct === true) o.correct = true;
                if (opt.rationale) o.rationale = substitute(opt.rationale, env);
                return o;
            });
            return out;
        } catch (err) {
            console.warn("Bank template " + (item.id || "?") + " dropped:", err);
            return null;
        }
    }

    /* ---- Registration and hydration ------------------------------------ */

    /* Called by each generated chunk. Decodes, expands, hydrates, then
       flushes every callback waiting on this unit (typically one re-render
       through the router, which now finds the data in place). */
    function registerUnit(n, chunk) {
        n = Number(n);
        try {
            const dict = (chunk && chunk.d) || [];
            const payload = decodeDeep((chunk && chunk.p) || {}, dict);
            if (payload.micro) {
                Object.keys(payload.micro).forEach(function (videoId) {
                    QUIZ_DATA.micro_practice[videoId] = payload.micro[videoId];
                });
            }
            if (payload.mastery) QUIZ_DATA.unit_mastery[n] = payload.mastery;
            if (payload.practice) PRACTICE_DATA[n] = payload.practice;
            if (payload.pool) {
                QUIZ_DATA.pool[n] = payload.pool.map(instantiate)
                    .filter(function (item) { return item !== null; });
            }
        } catch (err) {
            console.warn("Bank chunk for unit " + n + " failed to hydrate:", err);
        }
        status[n] = "ready";
        flush(n);
    }

    function flush(n) {
        const callbacks = waiters[n] || [];
        delete waiters[n];
        callbacks.forEach(function (cb) {
            try { cb(); } catch (err) { /* a view error never blocks siblings */ }
        });
    }

    function chunkSrc(n) {
        return "js/bank/bank-unit-" + (n < 10 ? "0" + n : String(n)) + ".js";
    }

    /* Ensures unit n's bank chunk is loaded. Returns true when the data is
       already hydrated (synchronous path: render immediately). Otherwise
       queues onReady, injects the chunk script once, and returns false; the
       view renders its loading state and re-renders from the callback. */
    function ensureUnit(n, onReady) {
        n = Number(n);
        if (status[n] === "ready") return true;
        if (status[n] === "failed") return false;
        if (typeof document === "undefined") return false;
        if (typeof onReady === "function") {
            (waiters[n] = waiters[n] || []).push(onReady);
        }
        if (status[n] === "loading") return false;
        status[n] = "loading";
        try {
            const el = document.createElement("script");
            el.src = chunkSrc(n);
            el.async = true;
            el.onerror = function () {
                if (status[n] !== "ready") {
                    status[n] = "failed";
                    flush(n);
                }
            };
            (document.head || document.documentElement).appendChild(el);
        } catch (err) {
            status[n] = "failed";
            flush(n);
        }
        return false;
    }

    function isReady(n) { return status[Number(n)] === "ready"; }
    function hasFailed(n) { return status[Number(n)] === "failed"; }

    return {
        ensureUnit: ensureUnit,
        registerUnit: registerUnit,
        isReady: isReady,
        hasFailed: hasFailed
    };
})();
