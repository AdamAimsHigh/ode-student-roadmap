/* Adaptive session composer (Sprint Rec 3).

   Reads the two-sided Elo mastery layer (ode_skill_state, via
   ODETelemetry.getSkillSnapshot) and the schema v2 adaptive question pools
   (QUIZ_DATA.pool, hydrated lazily per unit by bank-loader.js) and composes
   targeted practice sessions the QuizEngine can run directly. Three
   surfaces hang off this module:

   1. The #session-<kind> route view (renderAdaptiveSession, dispatched by
      router.js). Kinds: similar, easier, harder, weak, review, remedy.
      A focus rides after a tilde, URI-encoded ("#session-similar~sk_2_..."),
      naming a skill for the level-matched kinds or a unit index for remedy.
   2. The post-evaluation branching panel (buildBranchingPanel), appended by
      the QuizEngine to every Practice Complete summary: Similar, Easier,
      Harder, Attack Weak Areas, and Spaced Repetition Review targets whose
      links compose the next session from the just-updated skill state.
   3. The Adaptive guided track's remediation detours
      (buildRemediationPanel): in adaptive mode the unit detail view opens
      with a detour panel whenever prerequisite skills from earlier units
      are weak or fading, deep-linking a remedy session scoped to them.

   Composition sources, in preference order: authored pool items for the
   target skills (they carry skillId and Elo difficulty), then same-unit
   pool items, then unit mastery items as the depth fallback (stamped with
   the mastery surface's skill key so telemetry stays consistent). Every
   candidate unit's bank chunk is hydrated through ODEBank.ensureUnit
   before composing, preserving the Pillar 1 lazy contract.

   Classic script, no ES modules, no fetch. All couplings are typeof-guarded
   so the module degrades silently if telemetry or the bank layer is absent.
   Copy rule: no em-dashes, no ampersands in user-facing strings. */

const ODEAdaptive = (function () {

    const SESSION_SIZE = 8;
    const WEAK_RATING_CEILING = 1150;
    const FADING_RETENTION_CEILING = 0.5;
    /* Difficulty windows relative to the student's skill rating. */
    const SIMILAR_WINDOW = 150;
    const STEP_MARGIN = 50;
    const ELO_DEFAULT = 1200;

    const KIND_COPY = {
        similar: {
            title: "Similar Practice",
            intro: "More questions in the same skill lane, matched to your current level."
        },
        easier: {
            title: "Confidence Builder",
            intro: "A step down in difficulty to rebuild solid footing before climbing again."
        },
        harder: {
            title: "Step Up Challenge",
            intro: "A step up in difficulty to stretch what you have already mastered."
        },
        weak: {
            title: "Attack Weak Areas",
            intro: "Targeted questions on your lowest rated skills, so effort lands where it pays the most."
        },
        review: {
            title: "Spaced Repetition Review",
            intro: "Skills you once held that are fading. A short pass now resets the forgetting curve."
        },
        remedy: {
            title: "Remediation Detour",
            intro: "Prerequisite skills from earlier units that need attention before this unit's gate."
        }
    };

    /* ---- Skill to unit inference ---------------------------------------- */

    let videoUnitCache = null;

    function videoUnitMap() {
        if (videoUnitCache) return videoUnitCache;
        videoUnitCache = {};
        const units = (typeof SUBJECT_CONFIG !== "undefined" &&
            SUBJECT_CONFIG.units) || [];
        units.forEach(function (unitData, index) {
            (unitData.modules || []).forEach(function (moduleData) {
                (moduleData.videos || []).forEach(function (video) {
                    videoUnitCache[video.video_id] = index;
                });
            });
        });
        return videoUnitCache;
    }

    /* Maps any recorded skill id shape back to its unit index:
       sk_<n>_<slug> (authored bank skills), "N.M ..." module titles
       (checkpoint attempts), mastery::Unit N (curated mastery fallback),
       micro::<video_id> (curated micro fallback). Unknown shapes yield
       null and simply do not scope a unit. */
    function unitForSkill(skillId) {
        if (typeof skillId !== "string") return null;
        let match = /^sk_(\d+)_/.exec(skillId);
        if (match) return parseInt(match[1], 10);
        match = /^(\d+)\.\d+/.exec(skillId);
        if (match) return parseInt(match[1], 10);
        match = /^mastery::Unit (\d+)/.exec(skillId);
        if (match) return parseInt(match[1], 10);
        match = /^micro::(.+)$/.exec(skillId);
        if (match) {
            const unit = videoUnitMap()[match[1]];
            return unit === undefined ? null : unit;
        }
        return null;
    }

    /* Readable display name for a skill id, for panels and suggestions. */
    function skillLabel(skillId) {
        const authored = /^sk_\d+_(.+)$/.exec(skillId);
        if (authored) {
            return authored[1].split("_").map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(" ");
        }
        const micro = /^micro::(.+)$/.exec(skillId);
        if (micro) return "Video practice " + micro[1];
        return skillId.replace(/^mastery::/, "");
    }

    function snapshot() {
        if (typeof ODETelemetry === "undefined" ||
            !ODETelemetry.getSkillSnapshot) return [];
        try {
            return ODETelemetry.getSkillSnapshot();
        } catch (err) {
            return [];
        }
    }

    function ratingFor(skillId, snap) {
        for (let i = 0; i < snap.length; i++) {
            if (snap[i].skillId === skillId) return snap[i].rating;
        }
        return ELO_DEFAULT;
    }

    /* ---- Target selection ------------------------------------------------ */

    /* Assessed skills only: a skill needs at least one attempt to be a
       meaningful target. Weak sorts by rating ascending; review sorts by
       decayed retention ascending among skills with real evidence. */
    function weakSkills(snap, limit) {
        return snap.filter(function (s) { return s.attempts > 0; })
            .slice(0, limit || 4);
    }

    function fadingSkills(snap, limit) {
        return snap.filter(function (s) {
            return s.attempts >= 2 && s.retention < FADING_RETENTION_CEILING;
        }).sort(function (a, b) {
            return a.retention - b.retention;
        }).slice(0, limit || 4);
    }

    /* Weak or fading skills that belong to units BEFORE the given unit:
       the adaptive track's remediation trigger. */
    function weakPrerequisites(unitIndex) {
        return snapshot().filter(function (s) {
            const unit = unitForSkill(s.skillId);
            if (unit === null || unit >= unitIndex) return false;
            return (s.attempts > 0 && s.rating < WEAK_RATING_CEILING) ||
                (s.attempts >= 2 && s.retention < FADING_RETENTION_CEILING);
        }).slice(0, 3);
    }

    /* ---- Item collection ------------------------------------------------- */

    function shuffle(list) {
        const copy = list.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = copy[i]; copy[i] = copy[j]; copy[j] = t;
        }
        return copy;
    }

    /* Every candidate item for a unit: the authored adaptive pool first,
       then the curated mastery bank stamped with the mastery surface's
       skill key (so a session attempt and a mastery-quiz attempt move the
       same Elo rating). Items are copies safe to annotate. */
    function unitCandidates(unitIndex) {
        const out = [];
        if (typeof QUIZ_DATA === "undefined") return out;
        (QUIZ_DATA.pool && QUIZ_DATA.pool[unitIndex] || []).forEach(function (item) {
            out.push(item);
        });
        const units = (typeof SUBJECT_CONFIG !== "undefined" &&
            SUBJECT_CONFIG.units) || [];
        const unitData = units[unitIndex];
        (QUIZ_DATA.unit_mastery && QUIZ_DATA.unit_mastery[unitIndex] || [])
            .forEach(function (item, i) {
                const copy = {};
                Object.keys(item).forEach(function (k) { copy[k] = item[k]; });
                if (!copy.skillId && unitData) {
                    copy.skillId = "mastery::" + unitData.unit;
                }
                if (!copy.id) copy.id = "mpool::" + unitIndex + "::" + i;
                out.push(copy);
            });
        return out;
    }

    function itemDifficulty(item) {
        return typeof item.difficulty === "number" ? item.difficulty : ELO_DEFAULT;
    }

    /* ---- Session composition ---------------------------------------------- */

    /* Resolves which units a composed session will need hydrated, from the
       kind + focus alone (no pool data required), so the view can drive
       ODEBank.ensureUnit before composing. */
    function targetPlan(kind, focus) {
        const snap = snapshot();
        let skills = [];
        if (kind === "weak") {
            skills = weakSkills(snap);
        } else if (kind === "review") {
            skills = fadingSkills(snap);
        } else if (kind === "remedy") {
            const unitIndex = parseInt(String(focus).replace(/^u/, ""), 10);
            skills = isNaN(unitIndex) ? [] : weakPrerequisites(unitIndex);
        } else if (focus) {
            skills = snap.filter(function (s) { return s.skillId === focus; });
            if (!skills.length) skills = [{ skillId: focus, rating: ELO_DEFAULT }];
        } else {
            /* Level-matched kind without a focus: fall back to the weakest
               assessed skills so the deep link still lands somewhere useful. */
            skills = weakSkills(snap);
        }
        const unitSet = {};
        skills.forEach(function (s) {
            const unit = unitForSkill(s.skillId);
            if (unit !== null) unitSet[unit] = true;
        });
        return {
            skills: skills,
            units: Object.keys(unitSet).map(Number)
        };
    }

    /* Composes the QuizEngine config for a session. Call only after the
       plan's units are hydrated. Returns null when no items qualify. */
    function compose(kind, focus) {
        const copy = KIND_COPY[kind];
        if (!copy) return null;
        const plan = targetPlan(kind, focus);
        if (!plan.skills.length || !plan.units.length) return null;
        const snap = snapshot();
        const skillSet = {};
        plan.skills.forEach(function (s) { skillSet[s.skillId] = true; });

        let candidates = [];
        plan.units.forEach(function (unit) {
            candidates = candidates.concat(unitCandidates(unit));
        });
        const seen = {};
        candidates = candidates.filter(function (item) {
            if (!item || !item.id || seen[item.id]) return false;
            seen[item.id] = true;
            return true;
        });

        /* Prefer exact skill matches; widen to unit-mates only when the
           targeted pool is thinner than a full session. */
        let matched = candidates.filter(function (item) {
            return item.skillId && skillSet[item.skillId];
        });
        if (matched.length < SESSION_SIZE) {
            const fill = candidates.filter(function (item) {
                return !(item.skillId && skillSet[item.skillId]);
            });
            matched = matched.concat(fill);
        }

        /* Difficulty shaping against the student's rating per item skill. */
        function distance(item) {
            const rating = ratingFor(item.skillId, snap);
            return itemDifficulty(item) - rating;
        }
        if (kind === "easier") {
            const below = matched.filter(function (i) {
                return distance(i) < -STEP_MARGIN;
            });
            if (below.length) matched = below;
            matched.sort(function (a, b) { return distance(b) - distance(a); });
        } else if (kind === "harder") {
            const above = matched.filter(function (i) {
                return distance(i) > STEP_MARGIN;
            });
            if (above.length) matched = above;
            matched.sort(function (a, b) { return distance(a) - distance(b); });
        } else if (kind === "similar") {
            const near = matched.filter(function (i) {
                return Math.abs(distance(i)) <= SIMILAR_WINDOW;
            });
            if (near.length) matched = near;
            matched.sort(function (a, b) {
                return Math.abs(distance(a)) - Math.abs(distance(b));
            });
        } else {
            matched.sort(function (a, b) {
                return Math.abs(distance(a)) - Math.abs(distance(b));
            });
        }

        /* Light shuffle inside the qualifying pool keeps repeat sessions
           fresh while the sort above still bounds the difficulty band. */
        const items = shuffle(matched.slice(0, SESSION_SIZE * 2))
            .slice(0, SESSION_SIZE);
        if (!items.length) return null;

        return {
            id: "session::" + kind + (focus ? "::" + focus : ""),
            title: copy.title,
            intro: copy.intro,
            items: items
        };
    }

    /* ---- Lazy bank orchestration ------------------------------------------ */

    /* Ensures every unit in the list is hydrated. Returns true when all are
       already in place; otherwise fires onReady once after the last pending
       chunk lands (or fails, which composing tolerates). */
    function ensureUnits(units, onReady) {
        if (typeof ODEBank === "undefined") return true;
        let pending = 0;
        let allReady = true;
        units.forEach(function (unit) {
            const ready = ODEBank.ensureUnit(unit, function () {
                pending--;
                if (pending === 0 && typeof onReady === "function") onReady();
            });
            if (!ready && !ODEBank.hasFailed(unit)) {
                allReady = false;
                pending++;
            }
        });
        return allReady || pending === 0;
    }

    /* ---- Panels ------------------------------------------------------------ */

    function sessionHash(kind, focus) {
        return "#session-" + kind +
            (focus ? "~" + encodeURIComponent(focus) : "");
    }

    function branchLink(label, detail, kind, focus) {
        const link = document.createElement("a");
        link.className = "branch-btn";
        link.href = sessionHash(kind, focus);
        const strong = document.createElement("span");
        strong.className = "branch-btn-label";
        strong.textContent = label;
        link.appendChild(strong);
        if (detail) {
            const small = document.createElement("span");
            small.className = "branch-btn-detail";
            small.textContent = detail;
            link.appendChild(small);
        }
        return link;
    }

    /* The post-evaluation branching panel, appended by the QuizEngine to
       every Practice Complete summary. The dominant skill of the finished
       quiz anchors the level-matched targets; the weak and review targets
       read the whole skill state. */
    function buildBranchingPanel(finishedConfig) {
        const items = (finishedConfig && finishedConfig.items) || [];
        /* Dominant skill: the most frequent skillId across the finished
           items, falling back to the quiz id the engine would have used. */
        const counts = {};
        items.forEach(function (item) {
            const skill = item.skillId ||
                (finishedConfig && finishedConfig.id) || "";
            if (skill) counts[skill] = (counts[skill] || 0) + 1;
        });
        let dominant = null;
        Object.keys(counts).forEach(function (skill) {
            if (!dominant || counts[skill] > counts[dominant]) dominant = skill;
        });
        if (!dominant && !snapshot().length) return null;

        const panel = document.createElement("div");
        panel.className = "branch-panel";

        const heading = document.createElement("p");
        heading.className = "branch-panel-title";
        heading.textContent = "Choose your next move";
        panel.appendChild(heading);

        const row = document.createElement("div");
        row.className = "branch-panel-row";
        if (dominant) {
            const label = skillLabel(dominant);
            row.appendChild(branchLink("Similar", label, "similar", dominant));
            row.appendChild(branchLink("Easier", "Step down in " + label, "easier", dominant));
            row.appendChild(branchLink("Harder", "Step up in " + label, "harder", dominant));
        }
        row.appendChild(branchLink("Attack Weak Areas",
            "Your lowest rated skills", "weak", null));
        row.appendChild(branchLink("Spaced Repetition",
            "Review skills that are fading", "review", null));
        panel.appendChild(row);
        return panel;
    }

    /* The Adaptive track's remediation detour, mounted by the unit detail
       view above the module list when the active mode is adaptive and
       prerequisite skills are weak. Returns null when there is nothing to
       remediate, so the happy path renders untouched. */
    function buildRemediationPanel(unitIndex) {
        if (typeof ODEModes === "undefined" ||
            ODEModes.getMode() !== "adaptive") return null;
        const prerequisites = weakPrerequisites(unitIndex);
        if (!prerequisites.length) return null;

        const panel = document.createElement("section");
        panel.className = "remediation-panel";

        const title = document.createElement("h3");
        title.className = "remediation-title";
        title.textContent = "Recommended detour before this unit";
        panel.appendChild(title);

        const explain = document.createElement("p");
        explain.className = "remediation-text";
        explain.textContent = "The Adaptive Pathway found earlier skills that are weak or fading. A short remediation session now will make this unit land better.";
        panel.appendChild(explain);

        const list = document.createElement("ul");
        list.className = "remediation-skill-list";
        prerequisites.forEach(function (s) {
            const li = document.createElement("li");
            li.textContent = skillLabel(s.skillId) + " (rating " + s.rating + ")";
            list.appendChild(li);
        });
        panel.appendChild(list);

        panel.appendChild(branchLink("Start Remediation Detour",
            prerequisites.length + " skill" +
            (prerequisites.length > 1 ? "s" : "") + " to shore up",
            "remedy", "u" + unitIndex));
        return panel;
    }

    /* ---- The #session route view ------------------------------------------ */

    function renderNote(container, text) {
        const note = document.createElement("p");
        note.className = "static-page-placeholder";
        note.textContent = text;
        container.appendChild(note);
    }

    function renderAdaptiveSession(container, kind, focus) {
        container.innerHTML = "";
        const copy = KIND_COPY[kind];

        const nav = document.createElement("div");
        nav.className = "unit-detail-nav";
        const backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.className = "back-to-toc-btn";
        backBtn.textContent = "Back to Dashboard";
        backBtn.addEventListener("click", function () {
            window.location.hash = "dashboard";
        });
        nav.appendChild(backBtn);
        container.appendChild(nav);

        const intro = document.createElement("div");
        intro.className = "toc-intro";
        const heading = document.createElement("h1");
        heading.className = "toc-heading";
        heading.textContent = copy ? copy.title : "Practice Session";
        const sub = document.createElement("p");
        sub.className = "toc-subhead";
        sub.textContent = copy ? copy.intro : "";
        intro.appendChild(heading);
        intro.appendChild(sub);
        container.appendChild(intro);

        if (!copy) {
            renderNote(container, "That practice session type does not exist. Head back to the dashboard and pick a suggestion.");
            return;
        }

        const plan = targetPlan(kind, focus);
        if (!plan.skills.length || !plan.units.length) {
            renderNote(container, "There is not enough practice history to compose this session yet. Answer some quiz questions first, then come back.");
            return;
        }

        /* Hydrate every unit the plan touches, re-rendering through the
           router when the last chunk lands; the hash guard keeps a slow
           chunk from repainting a view the student already left. */
        const currentHash = window.location.hash;
        const ready = ensureUnits(plan.units, function () {
            if (window.location.hash === currentHash &&
                typeof renderCurriculum === "function") {
                renderCurriculum();
            }
        });
        if (!ready) {
            renderNote(container, "Composing your session. The question banks are loading.");
            return;
        }

        const config = compose(kind, focus);
        if (!config) {
            renderNote(container, "No questions currently match this target. Try another suggestion from the dashboard.");
            return;
        }

        const host = document.createElement("div");
        host.className = "session-quiz-host";
        QuizEngine.mount(host, {
            id: config.id,
            title: config.title,
            intro: config.intro,
            items: config.items,
            inline: true
        });
        container.appendChild(host);
    }

    return {
        compose: compose,
        targetPlan: targetPlan,
        ensureUnits: ensureUnits,
        unitForSkill: unitForSkill,
        skillLabel: skillLabel,
        weakPrerequisites: weakPrerequisites,
        sessionHash: sessionHash,
        buildBranchingPanel: buildBranchingPanel,
        buildRemediationPanel: buildRemediationPanel,
        renderAdaptiveSession: renderAdaptiveSession
    };
})();
