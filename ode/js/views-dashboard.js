/* Statistics dashboard view (Sprint Rec 4), the #dashboard route.

   Renders the telemetry substrate (Sprint Rec 1) through the ODECharts
   kernel: summary stat tiles, a per-unit mastery radar, the daily activity
   trend lines, the weakest-skill bars, and the consistency heatmap. The
   closing section turns the same skill state into actionable suggestions,
   each deep-linking into an adaptive session composed by ODEAdaptive
   (Sprint Rec 3), so every insight ends in a click that starts practice.

   Classic script loaded before router.js (Pillar 1 boot order); reads only
   in-JS globals and localStorage, so the view is fully file:// executable.
   Copy rule: no em-dashes, no ampersands. */

function renderDashboard(container) {
    buildIndexShell(container, "Statistics Dashboard",
        "Your mastery, momentum, and the next best practice session, computed from every question you have answered.");

    const telemetryReady = typeof ODETelemetry !== "undefined";
    const skills = telemetryReady ? ODETelemetry.getSkillSnapshot() : [];
    const daily = telemetryReady ? ODETelemetry.getDailyActivity() : {};
    const assessed = skills.filter(function (s) { return s.attempts > 0; });

    if (!assessed.length && !Object.keys(daily).length) {
        const empty = document.createElement("div");
        empty.className = "dashboard-empty";
        const note = document.createElement("p");
        note.className = "static-page-placeholder";
        note.textContent = "No practice history yet. Answer a few quiz questions and this dashboard will start mapping your mastery.";
        empty.appendChild(note);
        const cta = document.createElement("a");
        cta.className = "pdf-download-btn";
        cta.href = "#quizzes-index";
        cta.textContent = "Open the Quizzes Index";
        empty.appendChild(cta);
        container.appendChild(empty);
        return;
    }

    container.appendChild(buildStatTiles(assessed, daily));

    const grid = document.createElement("div");
    grid.className = "dashboard-grid";
    const radarCard = buildRadarCard(assessed);
    if (radarCard) grid.appendChild(radarCard);
    grid.appendChild(buildTrendCard(daily));
    const mixCard = buildSessionMixCard();
    if (mixCard) grid.appendChild(mixCard);
    const volatilityCard = buildVolatilityCard();
    if (volatilityCard) grid.appendChild(volatilityCard);
    const barsCard = buildWeakSkillsCard(assessed);
    if (barsCard) grid.appendChild(barsCard);
    grid.appendChild(buildHeatmapCard(daily));
    container.appendChild(grid);

    const suggestions = buildSuggestions(assessed);
    if (suggestions) container.appendChild(suggestions);
}

/* ---- Summary tiles ------------------------------------------------------ */

function dashboardDayStreak(daily) {
    function key(d) {
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }
    let streak = 0;
    const cursor = new Date();
    /* Today counts when active, but an inactive today does not break a
       streak that ran through yesterday. */
    if (!daily[key(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while (daily[key(cursor)] && daily[key(cursor)][0] > 0) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

function buildStatTiles(assessed, daily) {
    let attempts = 0;
    let correct = 0;
    assessed.forEach(function (s) {
        attempts += s.attempts;
        correct += s.correct;
    });
    const tiles = [
        { value: String(attempts), label: "questions answered" },
        {
            value: attempts ? Math.round(100 * correct / attempts) + "%" : "0%",
            label: "overall accuracy"
        },
        { value: String(assessed.length), label: "skills tracked" },
        { value: String(dashboardDayStreak(daily)), label: "day streak" }
    ];
    const row = document.createElement("div");
    row.className = "dashboard-tiles";
    tiles.forEach(function (tile) {
        const el = document.createElement("div");
        el.className = "dashboard-tile";
        const value = document.createElement("span");
        value.className = "dashboard-tile-value";
        value.textContent = tile.value;
        const label = document.createElement("span");
        label.className = "dashboard-tile-label";
        label.textContent = tile.label;
        el.appendChild(value);
        el.appendChild(label);
        row.appendChild(el);
    });
    return row;
}

/* ---- Chart cards --------------------------------------------------------- */

function dashboardChartCard(title, canvasHeight) {
    const card = document.createElement("div");
    card.className = "chart-card";
    const heading = document.createElement("h3");
    heading.className = "chart-card-title";
    heading.textContent = title;
    card.appendChild(heading);
    const canvas = document.createElement("canvas");
    canvas.className = "chart-canvas";
    canvas.style.height = canvasHeight + "px";
    card.appendChild(canvas);
    return { card: card, canvas: canvas };
}

/* Elo rating normalized into [0, 1] over the model's clamp range. */
function dashboardMastery(rating) {
    return Math.max(0, Math.min(1, (rating - 400) / 2000));
}

/* Per-unit mastery radar. Units come from the skill id taxonomy through
   ODEAdaptive.unitForSkill; with fewer than three unit axes the strongest
   individual skills stand in so the polygon stays readable. */
function buildRadarCard(assessed) {
    if (typeof ODECharts === "undefined" || !assessed.length) return null;
    const structureLabel = (typeof SUBJECT_CONFIG !== "undefined" &&
        SUBJECT_CONFIG.structureLabel) || "Unit";
    const byUnit = {};
    assessed.forEach(function (s) {
        const unit = typeof ODEAdaptive !== "undefined"
            ? ODEAdaptive.unitForSkill(s.skillId) : null;
        if (unit === null) return;
        (byUnit[unit] = byUnit[unit] || []).push(s);
    });
    let axes = Object.keys(byUnit).map(Number).sort(function (a, b) {
        return a - b;
    }).map(function (unit) {
        const group = byUnit[unit];
        const mean = group.reduce(function (sum, s) {
            return sum + dashboardMastery(s.rating);
        }, 0) / group.length;
        return { label: structureLabel + " " + unit, value: mean };
    });
    if (axes.length < 3) {
        axes = assessed.slice(0, Math.max(3, Math.min(8, assessed.length)))
            .map(function (s) {
                return {
                    label: typeof ODEAdaptive !== "undefined"
                        ? ODEAdaptive.skillLabel(s.skillId) : s.skillId,
                    value: dashboardMastery(s.rating)
                };
            });
    }
    if (axes.length < 3) return null;
    const built = dashboardChartCard("Mastery Radar", 260);
    ODECharts.radar(built.canvas, { axes: axes.slice(0, 10) });
    return built.card;
}

/* Thirty-day activity trend: questions per day and correct per day. */
function buildTrendCard(daily) {
    const built = dashboardChartCard("Thirty Day Trend", 200);
    if (typeof ODECharts === "undefined") return built.card;
    const attempts = [];
    const correct = [];
    const labels = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth(),
            today.getDate() - i);
        const key = d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
        const entry = daily[key] || [0, 0];
        attempts.push(entry[0] || 0);
        correct.push(entry[1] || 0);
        labels.push(i % 7 === 1 ? (d.getMonth() + 1) + "/" + d.getDate() : "");
    }
    ODECharts.line(built.canvas, {
        series: [
            { label: "Questions", values: attempts, color: "secondary" },
            { label: "Correct", values: correct, color: "accent" }
        ],
        labels: labels
    });
    return built.card;
}

function buildWeakSkillsCard(assessed) {
    if (typeof ODECharts === "undefined" || !assessed.length) return null;
    /* getSkillSnapshot sorts weakest first already. */
    const rows = assessed.slice(0, 8).map(function (s) {
        return {
            label: typeof ODEAdaptive !== "undefined"
                ? ODEAdaptive.skillLabel(s.skillId) : s.skillId,
            value: s.rating - 400,
            max: 2000,
            detail: "rating " + s.rating + ", " + s.attempts + " attempts",
            color: s.rating < 1150 ? "error" : "accent"
        };
    });
    const built = dashboardChartCard("Skills Needing Work", rows.length * 34 + 8);
    ODECharts.bars(built.canvas, { bars: rows });
    return built.card;
}

/* Categorical donut of the practice mix: how the event log distributes
   across the three session surfaces the telemetry layer records. */
function buildSessionMixCard() {
    if (typeof ODECharts === "undefined" ||
        typeof ODETelemetry === "undefined") return null;
    const events = ODETelemetry.getEvents();
    if (!events.length) return null;
    const counts = { q: 0, c: 0, v: 0 };
    events.forEach(function (e) {
        if (counts[e.kind] !== undefined) counts[e.kind]++;
    });
    const built = dashboardChartCard("Practice Mix", 180);
    ODECharts.donut(built.canvas, {
        slices: [
            { label: "Quiz answers", value: counts.q, color: "accent" },
            { label: "Checkpoints", value: counts.c, color: "success" },
            { label: "Videos watched", value: counts.v, color: "secondary" }
        ],
        centerLabel: "events"
    });
    return built.card;
}

/* Elo volatility scatter: the attempt log replayed through the same rating
   update the telemetry model runs per skill, but as one aggregate track, so
   every assessed attempt lands as a dot on the rating trajectory. Correct
   attempts draw in the success color, misses in the error color, and the
   vertical spread of the field is the volatility itself. */
function buildVolatilityCard() {
    if (typeof ODECharts === "undefined" ||
        typeof ODETelemetry === "undefined") return null;
    const assessedEvents = ODETelemetry.getEvents().filter(function (e) {
        return e.kind === "q" || e.kind === "c";
    }).slice(-300);
    if (assessedEvents.length < 2) return null;

    /* Aggregate two-sided Elo replay, mirroring the telemetry constants:
       seed 1200, default difficulty 1200, K decaying from 48 toward 8. */
    let rating = 1200;
    const points = assessedEvents.map(function (e, i) {
        const K = Math.max(8, 48 / (1 + i / 8));
        const expected = 1 / (1 + Math.pow(10, (1200 - rating) / 400));
        rating = Math.round(Math.min(2400, Math.max(400,
            rating + K * ((e.correct ? 1 : 0) - expected))));
        return {
            x: e.t,
            y: rating,
            color: e.correct ? "success" : "error"
        };
    });

    function tickLabel(ms) {
        const d = new Date(ms);
        return (d.getMonth() + 1) + "/" + d.getDate();
    }
    const first = points[0];
    const last = points[points.length - 1];
    const mid = points[Math.floor(points.length / 2)];
    const xTicks = [{ x: first.x, label: tickLabel(first.x) }];
    if (mid.x !== first.x && mid.x !== last.x) {
        xTicks.push({ x: mid.x, label: tickLabel(mid.x) });
    }
    if (last.x !== first.x) {
        xTicks.push({ x: last.x, label: tickLabel(last.x) });
    }

    const built = dashboardChartCard("Elo Volatility Map", 200);
    ODECharts.scatter(built.canvas, { points: points, xTicks: xTicks });
    return built.card;
}

function buildHeatmapCard(daily) {
    const built = dashboardChartCard("Consistency Heatmap", 130);
    if (typeof ODECharts !== "undefined") {
        ODECharts.heatmap(built.canvas, { days: daily, weeks: 26 });
    }
    return built.card;
}

/* ---- Predictive suggestions ---------------------------------------------- */

/* Rule-driven next-step cards, every one deep-linking a composed session.
   The rules read the same snapshot the composer will use, so a suggestion
   never points at an empty session on the happy path. */
function buildSuggestions(assessed) {
    if (typeof ODEAdaptive === "undefined" || !assessed.length) return null;
    const cards = [];
    const weakest = assessed[0];
    if (weakest && weakest.rating < 1150) {
        cards.push({
            title: "Attack your weak areas",
            body: ODEAdaptive.skillLabel(weakest.skillId) +
                " is your lowest rated skill at " + weakest.rating +
                ". A focused session moves it fastest.",
            hash: ODEAdaptive.sessionHash("weak", null),
            action: "Start Weak Area Session"
        });
    }
    const fading = assessed.filter(function (s) {
        return s.attempts >= 2 && s.retention < 0.5;
    }).sort(function (a, b) { return a.retention - b.retention; });
    if (fading.length) {
        cards.push({
            title: "Review before you forget",
            body: fading.length + " skill" + (fading.length > 1 ? "s are" : " is") +
                " past the retention half-life, led by " +
                ODEAdaptive.skillLabel(fading[0].skillId) +
                ". A short review resets the curve.",
            hash: ODEAdaptive.sessionHash("review", null),
            action: "Start Review Session"
        });
    }
    const strongest = assessed[assessed.length - 1];
    if (strongest && strongest.rating >= 1300 &&
        strongest.accuracy >= 0.8 && strongest.attempts >= 4) {
        cards.push({
            title: "Ready to step up",
            body: ODEAdaptive.skillLabel(strongest.skillId) +
                " sits at " + strongest.rating + " with " +
                Math.round(strongest.accuracy * 100) +
                "% accuracy. Harder questions will keep it growing.",
            hash: ODEAdaptive.sessionHash("harder", strongest.skillId),
            action: "Start Step Up Session"
        });
    }
    if (!cards.length) {
        cards.push({
            title: "Keep the momentum",
            body: "Your ratings are settling in. A similar-level session on " +
                ODEAdaptive.skillLabel(weakest.skillId) +
                " keeps the practice loop warm.",
            hash: ODEAdaptive.sessionHash("similar", weakest.skillId),
            action: "Start Similar Session"
        });
    }

    const section = document.createElement("div");
    section.className = "dashboard-suggestions";
    const heading = document.createElement("h3");
    heading.className = "chart-card-title";
    heading.textContent = "Suggested Next Sessions";
    section.appendChild(heading);
    const row = document.createElement("div");
    row.className = "suggestion-row";
    cards.slice(0, 3).forEach(function (card) {
        const el = document.createElement("div");
        el.className = "suggestion-card";
        const title = document.createElement("h4");
        title.className = "suggestion-title";
        title.textContent = card.title;
        el.appendChild(title);
        const body = document.createElement("p");
        body.className = "suggestion-body";
        body.textContent = card.body;
        el.appendChild(body);
        const link = document.createElement("a");
        link.className = "pdf-download-btn";
        link.href = card.hash;
        link.textContent = card.action;
        el.appendChild(link);
        row.appendChild(el);
    });
    section.appendChild(row);
    return section;
}
