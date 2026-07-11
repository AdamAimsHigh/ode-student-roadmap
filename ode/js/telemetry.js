/* Telemetry and mastery substrate for the ODE Roadmap.

   The classic Pillar 5 keys store sets (watched ids, solved ids), which can
   answer "what is done" but never "how is the student trending". This module
   adds the event-sourced layer the statistics dashboard and the adaptive
   practice engine both read. Three namespaced localStorage layers, all
   riding the same snapshot, cloud merge, and reset loop in state.js:

   - ode_events          Rolling attempt log. Each event is a packed string
                         "t|k|r|id": seconds since the module epoch in
                         base36, a one letter kind (q quiz answer,
                         c checkpoint attempt, v video completion), a 0/1
                         result flag, and the item id. Bounded to MAX_EVENTS;
                         the oldest events are trimmed because the aggregate
                         layers below have already absorbed them, so the
                         payload stays far inside the Worker's 128 KiB cap.
   - ode_skill_state     Per-skill mastery aggregates { r, a, c, t }: Elo
                         rating, attempts, correct count, last-seen ms.
                         Updated incrementally on every assessed attempt
                         (quiz and checkpoint kinds; video completions carry
                         no assessment signal), so trimming the raw event
                         window loses no mastery information.
   - ode_daily_activity  ISO local-date -> [events, correct] counters. Feeds
                         the consistency heatmap across a horizon far longer
                         than the raw event window at trivial byte cost.

   Mastery math, two-sided Elo: the student's per-skill rating r meets an
   item difficulty d (DEFAULT_DIFFICULTY until the question bank ships
   authored difficulties). Expected score E = 1/(1+10^((d-r)/400)), update
   r <- r + K(outcome - E), with K decaying as attempts accumulate so early
   evidence moves the estimate quickly and a settled skill stays stable.
   Retrieval strength for review scheduling decays as exp(-ln2 * days / 14)
   and is computed at read time from t, never stored.

   Load order contract: this file parses after subject-config.js and before
   state.js (state.js reads ODETelemetry.KEYS at parse time). At runtime the
   coupling is bidirectional but guarded on both sides, so either module
   degrades gracefully without the other. */

const ODETelemetry = (function () {
    const KEYS = {
        events: "ode_events",
        skills: "ode_skill_state",
        daily: "ode_daily_activity"
    };

    /* Packed-timestamp epoch: 2026-01-01 UTC. Seconds since epoch render as
       five base36 characters until 2028. Ordering is always by decoded
       value, never by string comparison. */
    const EPOCH_MS = Date.UTC(2026, 0, 1);

    const MAX_EVENTS = 1500;
    const MAX_ID_LENGTH = 48;
    const MAX_SKILLS = 500;
    const MAX_DAILY_DAYS = 366;

    const ELO_SEED = 1200;
    const ELO_MIN = 400;
    const ELO_MAX = 2400;
    const DEFAULT_DIFFICULTY = 1200;
    /* Half-life in days for the retrieval-strength staleness signal. */
    const HALF_LIFE_DAYS = 14;

    const KINDS = { q: true, c: true, v: true };

    function readJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (err) {
            console.warn("Telemetry read failed for " + key + ":", err);
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.warn("Telemetry write failed for " + key + ":", err);
        }
    }

    function clamp(x, lo, hi) {
        return Math.min(hi, Math.max(lo, x));
    }

    function toCount(value) {
        return typeof value === "number" && isFinite(value) && value > 0
            ? Math.round(value) : 0;
    }

    /* ---- Packed event codec --------------------------------------------- */

    function cleanId(id) {
        return String(id === undefined || id === null ? "" : id)
            .replace(/\|/g, "/").slice(0, MAX_ID_LENGTH);
    }

    function packEvent(ms, kind, correct, itemId) {
        const seconds = Math.max(0, Math.round((ms - EPOCH_MS) / 1000));
        return seconds.toString(36) + "|" + kind + "|" +
            (correct ? "1" : "0") + "|" + cleanId(itemId);
    }

    function decodeEvent(packed) {
        if (typeof packed !== "string") return null;
        const parts = packed.split("|");
        if (parts.length !== 4 || !KINDS[parts[1]]) return null;
        const seconds = parseInt(parts[0], 36);
        if (isNaN(seconds) || seconds < 0) return null;
        return {
            t: EPOCH_MS + seconds * 1000,
            kind: parts[1],
            correct: parts[2] === "1",
            itemId: parts[3]
        };
    }

    function eventTime(packed) {
        const decoded = decodeEvent(packed);
        return decoded ? decoded.t : 0;
    }

    function localDateKey(ms) {
        const d = new Date(ms);
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

    /* ---- Elo skill model -------------------------------------------------- */

    function updateSkill(skills, skillId, correct, difficulty, nowMs) {
        const s = skills[skillId] || { r: ELO_SEED, a: 0, c: 0, t: 0 };
        const d = typeof difficulty === "number" && isFinite(difficulty)
            ? clamp(difficulty, ELO_MIN, ELO_MAX)
            : DEFAULT_DIFFICULTY;
        /* K decays with evidence: 48 on the first attempt, ~24 by the 8th,
           floored at 8 so a settled skill still tracks slow drift. */
        const K = Math.max(8, 48 / (1 + s.a / 8));
        const expected = 1 / (1 + Math.pow(10, (d - s.r) / 400));
        s.r = Math.round(clamp(s.r + K * ((correct ? 1 : 0) - expected),
            ELO_MIN, ELO_MAX));
        s.a += 1;
        if (correct) s.c += 1;
        s.t = nowMs;
        skills[skillId] = s;
    }

    /* Bounded maps: when a cap is exceeded the stalest entries (smallest
       last-seen, oldest date) are dropped first. */
    function pruneSkills(skills) {
        const ids = Object.keys(skills);
        if (ids.length <= MAX_SKILLS) return;
        ids.sort(function (x, y) {
            return (skills[x].t || 0) - (skills[y].t || 0);
        });
        ids.slice(0, ids.length - MAX_SKILLS).forEach(function (id) {
            delete skills[id];
        });
    }

    function pruneDaily(daily) {
        const days = Object.keys(daily);
        if (days.length <= MAX_DAILY_DAYS) return;
        days.sort();
        days.slice(0, days.length - MAX_DAILY_DAYS).forEach(function (day) {
            delete daily[day];
        });
    }

    /* ---- Recording --------------------------------------------------------- */

    /* Records one learning event. kind: "q" quiz answer, "c" checkpoint
       attempt, "v" video completion. opts.skillId groups the item under a
       mastery skill (defaults to the item id); opts.difficulty is the item's
       Elo difficulty seed once the question bank supplies authored values.
       Every failure path is swallowed: telemetry must never break a lesson. */
    function record(kind, itemId, correct, opts) {
        if (!KINDS[kind]) return;
        const options = opts || {};
        const now = Date.now();
        const ok = correct === true || correct === 1;
        try {
            const events = readJSON(KEYS.events, []);
            events.push(packEvent(now, kind, ok, itemId));
            if (events.length > MAX_EVENTS) {
                events.splice(0, events.length - MAX_EVENTS);
            }
            writeJSON(KEYS.events, events);

            /* Videos are engagement, not assessment: they land in the event
               log and the daily counters but never move a mastery rating. */
            if (kind !== "v") {
                const skills = readJSON(KEYS.skills, {});
                const skillId = cleanId(
                    options.skillId !== undefined ? options.skillId : itemId);
                if (skillId) {
                    updateSkill(skills, skillId, ok, options.difficulty, now);
                    pruneSkills(skills);
                    writeJSON(KEYS.skills, skills);
                }
            }

            const daily = readJSON(KEYS.daily, {});
            const day = localDateKey(now);
            const counts = Array.isArray(daily[day]) ? daily[day] : [0, 0];
            daily[day] = [toCount(counts[0]) + 1, toCount(counts[1]) + (ok ? 1 : 0)];
            pruneDaily(daily);
            writeJSON(KEYS.daily, daily);
        } catch (err) {
            console.warn("Telemetry record skipped:", err);
        }
        if (typeof ODEState !== "undefined" && ODEState.requestCloudSync) {
            ODEState.requestCloudSync();
        }
    }

    /* ---- Cloud merge --------------------------------------------------------

       Called by state.js inside its defensive boot merge. Additive like the
       core progress merge: a stale device can never erase telemetry gathered
       elsewhere.
       - events: union by exact packed string, re-sorted by decoded time,
         trimmed to the newest MAX_EVENTS.
       - skills: per skill, the record with more attempts wins (more evidence
         is more authority); ties fall to the later last-seen stamp.
       - daily: per date, elementwise maximum of the counters. */
    function mergeCloudTelemetry(cloud) {
        if (!cloud || typeof cloud !== "object") return false;
        let changed = false;
        try {
            const cloudEvents = cloud[KEYS.events];
            if (Array.isArray(cloudEvents) && cloudEvents.length > 0) {
                const local = readJSON(KEYS.events, []);
                const seen = {};
                local.forEach(function (e) { seen[e] = true; });
                let added = false;
                cloudEvents.forEach(function (e) {
                    if (!seen[e] && decodeEvent(e)) {
                        seen[e] = true;
                        local.push(e);
                        added = true;
                    }
                });
                if (added) {
                    local.sort(function (x, y) {
                        return eventTime(x) - eventTime(y);
                    });
                    if (local.length > MAX_EVENTS) {
                        local.splice(0, local.length - MAX_EVENTS);
                    }
                    writeJSON(KEYS.events, local);
                    changed = true;
                }
            }

            const cloudSkills = cloud[KEYS.skills];
            if (cloudSkills && typeof cloudSkills === "object" &&
                !Array.isArray(cloudSkills)) {
                const local = readJSON(KEYS.skills, {});
                let skillsChanged = false;
                Object.keys(cloudSkills).forEach(function (id) {
                    const remote = cloudSkills[id];
                    if (!remote || typeof remote !== "object" ||
                        Array.isArray(remote)) return;
                    const clean = {
                        r: Math.round(clamp(toCount(remote.r) || ELO_SEED,
                            ELO_MIN, ELO_MAX)),
                        a: toCount(remote.a),
                        c: toCount(remote.c),
                        t: toCount(remote.t)
                    };
                    const mine = local[id];
                    const remoteWins = !mine || clean.a > toCount(mine.a) ||
                        (clean.a === toCount(mine.a) && clean.t > toCount(mine.t));
                    if (remoteWins &&
                        JSON.stringify(mine) !== JSON.stringify(clean)) {
                        local[id] = clean;
                        skillsChanged = true;
                    }
                });
                if (skillsChanged) {
                    pruneSkills(local);
                    writeJSON(KEYS.skills, local);
                    changed = true;
                }
            }

            const cloudDaily = cloud[KEYS.daily];
            if (cloudDaily && typeof cloudDaily === "object" &&
                !Array.isArray(cloudDaily)) {
                const local = readJSON(KEYS.daily, {});
                let dailyChanged = false;
                Object.keys(cloudDaily).forEach(function (day) {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
                    const remote = cloudDaily[day];
                    if (!Array.isArray(remote)) return;
                    const mine = Array.isArray(local[day]) ? local[day] : [0, 0];
                    const merged = [
                        Math.max(toCount(mine[0]), toCount(remote[0])),
                        Math.max(toCount(mine[1]), toCount(remote[1]))
                    ];
                    if (merged[0] !== toCount(mine[0]) ||
                        merged[1] !== toCount(mine[1])) {
                        local[day] = merged;
                        dailyChanged = true;
                    }
                });
                if (dailyChanged) {
                    pruneDaily(local);
                    writeJSON(KEYS.daily, local);
                    changed = true;
                }
            }
        } catch (err) {
            console.warn("Telemetry merge skipped:", err);
        }
        return changed;
    }

    /* ---- Read surface (dashboard and adaptive engine) ---------------------- */

    function getEvents() {
        return readJSON(KEYS.events, []).map(decodeEvent).filter(Boolean);
    }

    function getSkillState() {
        return readJSON(KEYS.skills, {});
    }

    function getDailyActivity() {
        return readJSON(KEYS.daily, {});
    }

    /* Computed mastery view, weakest skill first. retention is the decayed
       retrieval strength in [0, 1]; low retention on a once-strong skill is
       the "review what is fading" signal. */
    function getSkillSnapshot() {
        const skills = readJSON(KEYS.skills, {});
        const now = Date.now();
        return Object.keys(skills).map(function (id) {
            const s = skills[id];
            const attempts = toCount(s.a);
            const lastSeen = toCount(s.t);
            const days = lastSeen ? Math.max(0, (now - lastSeen) / 86400000) : null;
            return {
                skillId: id,
                rating: toCount(s.r) || ELO_SEED,
                attempts: attempts,
                correct: toCount(s.c),
                accuracy: attempts ? toCount(s.c) / attempts : 0,
                lastSeen: lastSeen || null,
                retention: days === null
                    ? 0
                    : Math.exp(-Math.LN2 * days / HALF_LIFE_DAYS)
            };
        }).sort(function (x, y) { return x.rating - y.rating; });
    }

    function resetTelemetry() {
        try {
            localStorage.removeItem(KEYS.events);
            localStorage.removeItem(KEYS.skills);
            localStorage.removeItem(KEYS.daily);
        } catch (err) { /* storage unavailable */ }
    }

    return {
        KEYS: KEYS,
        record: record,
        mergeCloudTelemetry: mergeCloudTelemetry,
        getEvents: getEvents,
        getSkillState: getSkillState,
        getDailyActivity: getDailyActivity,
        getSkillSnapshot: getSkillSnapshot,
        resetTelemetry: resetTelemetry
    };
})();
