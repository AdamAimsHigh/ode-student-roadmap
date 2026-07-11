/* Client-side smoke suite for the universal template player (Audit Rec #2).
 *
 * Boots ode/index.html over file:// -- the SPA's zero-dependency contract
 * (WEBSITE_BLUEPRINT Pillar 1) -- and asserts the subject-neutral shell built
 * in the Universal SPA Content Matrix refactor renders cleanly across viewports.
 *
 * HERMETIC BY DESIGN: every cross-origin (http/https) request is blocked, so the
 * suite is deterministic and internet-free. This is safe because first-party
 * code guards every CDN global (`typeof renderMathInElement === "function"`,
 * `typeof Desmos === "undefined"`, `gisApi()` null-checks), so the shell renders
 * its DOM and text with KaTeX/Desmos/Math.js/GIS absent. The upside: any error
 * that survives the guard below is unambiguously OURS, never third-party noise
 * (Google GIS on a null file:// origin, YouTube embeds, Desmos, CDNs).
 *
 * Coverage map to the audit spec:
 *   A CONSOLE GUARD     -> collectFirstPartyErrors, asserted 0 in every test
 *   B ROUTE EXERCISE    -> "walks unit hash routes" (per viewport)
 *   C TAXONOMY          -> "renders SUBJECT_CONFIG.structureLabel dynamically"
 *   D SANDBOX MOUNT     -> "sandbox engine mounts a canvas and tears down"
 *   E LAZY BANK         -> "lazy bank chunk hydrates quizzes, practice, and
 *                          readings" (Content Schema v2: dynamic <script>
 *                          chunk injection must work over file://)
 *   F CAPSTONE ROUTES   -> "#dashboard, #settings, and composed #session
 *                          routes render over file://" (Day 3: statistics
 *                          dashboard, profile split view, adaptive composer)
 */

const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

const ODE_INDEX = pathToFileURL(
    path.resolve(__dirname, "..", "ode", "index.html")
).href;

const VIEWPORTS = [
    { name: "desktop", width: 1280, height: 800 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 667 }
];

/* Errors originating outside our first-party file:// code are not ours to fix:
   blocked CDN subresources, Google GIS on a null origin, FedCM, YouTube, etc.
   The console guard ignores anything matching this, or any non-file:// source. */
const THIRD_PARTY =
    /accounts\.google\.com|\bgsi\b|GSI_LOGGER|FedCM|gstatic|googleapis|desmos\.com|jsdelivr|cdnjs|youtube|ytimg|doubleclick|cloudflareinsights|net::ERR|ERR_(FAILED|BLOCKED|NAME_NOT_RESOLVED|INTERNET_DISCONNECTED)|Failed to load resource/i;

function isFirstPartyError(text, url) {
    if (text && THIRD_PARTY.test(text)) return false;
    if (url && THIRD_PARTY.test(url)) return false;
    if (url && !url.startsWith("file:")) return false;
    return true;
}

/* Attaches the CONSOLE GUARD (spec A). Returns a live array of first-party
   failures: uncaught page exceptions plus console.error entries that are not
   attributable to a blocked/third-party source. */
function collectFirstPartyErrors(page) {
    const errors = [];
    page.on("pageerror", (err) => {
        const text = String((err && (err.stack || err.message)) || err);
        if (isFirstPartyError(text, "")) errors.push("pageerror: " + text);
    });
    page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        const loc = msg.location() || {};
        if (isFirstPartyError(msg.text(), loc.url)) {
            errors.push("console.error: " + msg.text());
        }
    });
    return errors;
}

/* Blocks the network so the file:// boot is hermetic and deterministic. Only
   http/https is aborted; file:/data:/blob: continue so the SPA and its own
   assets load normally. */
async function blockExternal(page) {
    await page.route("**/*", (route) => {
        return /^https?:/i.test(route.request().url())
            ? route.abort()
            : route.continue();
    });
}

/* Boots the SPA to its Table of Contents and returns the live subject config. */
async function bootToToc(page, viewport) {
    await blockExternal(page);
    const errors = collectFirstPartyErrors(page);
    if (viewport) await page.setViewportSize(viewport);
    await page.goto(ODE_INDEX, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#app-content .toc-grid", { timeout: 15000 });
    const config = await page.evaluate(() => ({
        subjectId: SUBJECT_CONFIG.subjectId,
        structureLabel: SUBJECT_CONFIG.structureLabel,
        unitCount: SUBJECT_CONFIG.units.length
    }));
    return { errors, config };
}

for (const vp of VIEWPORTS) {
    test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
        test("boots the universal shell with zero first-party console errors", async ({ page }) => {
            const { errors, config } = await bootToToc(page, vp);
            // The shell is driven by the abstracted config, not a hardcoded "ode".
            expect(config.subjectId).toBe("ode");
            expect(config.unitCount).toBeGreaterThan(0);
            // Let the debounced boot (cloud-sync init, GIS) settle before judging.
            await page.waitForTimeout(300);
            expect(errors, "first-party errors:\n" + errors.join("\n")).toHaveLength(0);
        });

        test("walks unit hash routes and keeps the viewport container intact", async ({ page }) => {
            const { errors, config } = await bootToToc(page, vp);
            // Spec B: exercise first, middle-ish, and last unit -- n-dynamic, so
            // the last index is read from the config, never a hardcoded 18.
            const targets = [0, 1, config.unitCount - 1];
            for (const n of targets) {
                await page.evaluate((h) => { window.location.hash = h; }, `#unit-${n}`);
                await page.waitForFunction(
                    () => !!document.querySelector("#app-content .unit-title"),
                    { timeout: 10000 }
                );
                // Viewport container intact: no horizontal overflow blowout.
                const fits = await page.evaluate(
                    () => document.documentElement.scrollWidth <= window.innerWidth + 2
                );
                expect(fits, `#unit-${n} overflows the viewport width`).toBeTruthy();
                // The detail view actually redrew to a unit (title is present).
                const title = await page.textContent("#app-content .unit-title");
                expect(title && title.trim().length).toBeTruthy();
            }
            // Back to ToC redraws the grid (router container swap works both ways).
            await page.evaluate(() => { window.location.hash = ""; });
            await page.waitForSelector("#app-content .toc-grid", { timeout: 10000 });
            expect(errors, "first-party errors:\n" + errors.join("\n")).toHaveLength(0);
        });
    });
}

test("renders SUBJECT_CONFIG.structureLabel dynamically (taxonomy abstraction)", async ({ page }) => {
    const { errors } = await bootToToc(page, VIEWPORTS[0]);

    // Spec C: the Cheat Sheets index composes its button copy from the config's
    // structureLabel. With the default label the shell prints "Unit".
    await page.evaluate(() => { window.location.hash = "#cheat-sheets"; });
    await page.waitForFunction(
        () => /Open \S+ 0 Cheat Sheet/.test(
            document.getElementById("app-content").textContent || ""),
        { timeout: 10000 }
    );
    const defaultCopy = await page.textContent("#app-content");
    expect(defaultCopy).toMatch(/Open Unit 0 Cheat Sheet/);

    // Flip the label live and re-render: if the layout truly reads the config
    // (and not a hardcoded "Unit"), the DOM must follow to "Chapter".
    await page.evaluate(() => {
        window.__origLabel = SUBJECT_CONFIG.structureLabel;
        SUBJECT_CONFIG.structureLabel = "Chapter";
        renderCurriculum();
    });
    await page.waitForFunction(
        () => /Open Chapter 0 Cheat Sheet/.test(
            document.getElementById("app-content").textContent || ""),
        { timeout: 10000 }
    );
    const flippedCopy = await page.textContent("#app-content");
    expect(flippedCopy).toMatch(/Open Chapter 0 Cheat Sheet/);
    expect(flippedCopy).not.toMatch(/Open Unit 0 Cheat Sheet/);

    // Restore so nothing leaks between tests (page context is fresh anyway).
    await page.evaluate(() => {
        SUBJECT_CONFIG.structureLabel = window.__origLabel;
        renderCurriculum();
    });
    expect(errors, "first-party errors:\n" + errors.join("\n")).toHaveLength(0);
});

test("lazy bank chunk hydrates quizzes, practice, and readings on demand", async ({ page }) => {
    const { errors } = await bootToToc(page, VIEWPORTS[0]);

    // Spec E: at boot no bank chunk has loaded -- the shells must be empty.
    const bootState = await page.evaluate(() => ({
        micro: Object.keys(QUIZ_DATA.micro_practice).length,
        mastery: Object.keys(QUIZ_DATA.unit_mastery).length
    }));
    expect(bootState.micro).toBe(0);
    expect(bootState.mastery).toBe(0);

    // Entering a unit route injects that unit's chunk via a dynamic <script>
    // (file://-legal) and re-renders: the mastery card and the per-video
    // micro practice hosts must appear without any manual reload.
    await page.evaluate(() => { window.location.hash = "#unit-0"; });
    await page.waitForSelector("#app-content .unit-mastery-host", { timeout: 10000 });
    const microHosts = await page.evaluate(
        () => document.querySelectorAll("#app-content .video-quiz-host").length);
    expect(microHosts, "micro practice mounts beside the videos").toBeGreaterThan(0);

    // Only the visited unit hydrates -- laziness is the whole point.
    const hydrated = await page.evaluate(
        () => Object.keys(QUIZ_DATA.unit_mastery));
    expect(hydrated).toEqual(["0"]);

    // The supplemental readings row (generated READINGS_DATA) closes the page.
    const readingsRow = await page.evaluate(() => {
        const row = document.querySelector("#app-content .unit-master-resource-row");
        return row ? row.textContent : "";
    });
    expect(readingsRow).toMatch(/Reference Guide/);

    // The practice set sub-route hydrates its problems from the same chunk
    // pipeline (unit 2 also carries the schema v2 bank pool).
    await page.evaluate(() => { window.location.hash = "#practice-sets-2"; });
    await page.waitForSelector("#app-content .practice-problem-list li", { timeout: 10000 });
    const poolReady = await page.evaluate(
        () => (QUIZ_DATA.pool["2"] || []).length > 0 &&
            !JSON.stringify(QUIZ_DATA.pool["2"]).includes("{{"));
    expect(poolReady, "bank pool hydrates with templates expanded").toBeTruthy();

    expect(errors, "first-party errors:\n" + errors.join("\n")).toHaveLength(0);
});

test("#dashboard, #settings, and composed #session routes render over file://", async ({ page }) => {
    const { errors } = await bootToToc(page, VIEWPORTS[0]);

    // Spec F1: with no telemetry the dashboard renders its empty state and
    // points at the quizzes index instead of drawing charts.
    await page.evaluate(() => { window.location.hash = "#dashboard"; });
    await page.waitForSelector("#app-content .dashboard-empty", { timeout: 10000 });

    // Seed a small mastery history through the real telemetry surface, then
    // re-render: the tiles, the chart canvases, and at least one suggestion
    // deep-link into a #session route must appear.
    await page.evaluate(() => {
        ODETelemetry.record("q", "bk_2_1", true, { skillId: "sk_2_separation", difficulty: 1150 });
        ODETelemetry.record("q", "bk_2_1", false, { skillId: "sk_2_separation", difficulty: 1150 });
        ODETelemetry.record("q", "bk_2_3", false, { skillId: "sk_2_integrating_factor", difficulty: 1250 });
        ODETelemetry.record("q", "bk_2_3", false, { skillId: "sk_2_integrating_factor", difficulty: 1250 });
        ODETelemetry.record("q", "q0", true, { skillId: "sk_0_basics" });
        renderCurriculum();
    });
    await page.waitForSelector("#app-content .dashboard-tiles", { timeout: 10000 });
    const dashState = await page.evaluate(() => ({
        canvases: document.querySelectorAll("#app-content canvas").length,
        sessionLinks: document.querySelectorAll(
            '#app-content .dashboard-suggestions a[href^="#session-"]').length
    }));
    expect(dashState.canvases, "chart kernel mounts canvases").toBeGreaterThan(0);
    expect(dashState.sessionLinks, "suggestions deep-link composed sessions").toBeGreaterThan(0);

    // Spec F2: a composed weak-areas session hydrates its bank chunks lazily
    // over file:// and mounts the inline quiz runner.
    await page.evaluate(() => { window.location.hash = "#session-weak"; });
    await page.waitForSelector("#app-content .quiz-inline-panel", { timeout: 15000 });
    const sessionOptions = await page.evaluate(
        () => document.querySelectorAll("#app-content .quiz-option").length);
    expect(sessionOptions, "composed session offers answer options").toBeGreaterThan(0);

    // Spec F3: the settings split view. The student interface renders fully;
    // under file:// the role probe never fires and the package section
    // explains itself. Chart canvases from the dashboard must be gone (the
    // self-terminating RAF contract, observed at the DOM).
    await page.evaluate(() => { window.location.hash = "#settings"; });
    await page.waitForSelector("#app-content .settings-grid", { timeout: 10000 });
    const settingsState = await page.evaluate(() => ({
        cards: document.querySelectorAll("#app-content .settings-card").length,
        canvases: document.querySelectorAll("#app-content canvas").length,
        roleNote: (document.querySelector("#app-content .settings-role-slot") || {}).textContent || ""
    }));
    expect(settingsState.cards).toBeGreaterThanOrEqual(3);
    expect(settingsState.canvases, "dashboard canvases torn down on exit").toBe(0);
    expect(settingsState.roleNote).toMatch(/online version/);

    // The theme toggle inside settings flips the Pillar 4 root attribute.
    await page.evaluate(() => {
        const buttons = document.querySelectorAll("#app-content .settings-toggle-btn");
        for (const btn of buttons) {
            if (btn.textContent === "Dark") { btn.click(); break; }
        }
    });
    const theme = await page.evaluate(
        () => document.documentElement.getAttribute("data-theme"));
    expect(theme).toBe("dark");

    const fits = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 2);
    expect(fits, "#settings overflows the viewport width").toBeTruthy();

    expect(errors, "first-party errors:\n" + errors.join("\n")).toHaveLength(0);
});

test("sandbox engine mounts a canvas and tears down cleanly on exit", async ({ page }) => {
    const { errors } = await bootToToc(page, VIEWPORTS[0]);

    // Spec D: discover a real built sandbox engine from the page's own registry
    // rather than hardcoding an id, then deep-link to it.
    const routeId = await page.evaluate(() => {
        const items = buildInteractiveItems();
        const built = items.find((it) => it.isSandbox && it.vis && it.vis.id);
        return built ? sandboxRouteId(built) : null;
    });
    expect(routeId, "a built sandbox engine must exist in the registry").toBeTruthy();

    // Mount: the canvas engine hooks the DOM under #app-content.
    await page.evaluate((id) => {
        window.location.hash = "#interactives-sandbox-" + id;
    }, routeId);
    await page.waitForFunction(
        () => document.querySelectorAll("#app-content canvas").length > 0,
        { timeout: 10000 }
    );
    const mounted = await page.evaluate(
        () => document.querySelectorAll("#app-content canvas").length);
    expect(mounted, "sandbox mount must attach at least one canvas").toBeGreaterThan(0);

    // Exit the view: the router swaps the container, the RAF loop self-terminates,
    // and every canvas must leave the DOM (clean teardown, no orphaned engines).
    await page.evaluate(() => { window.location.hash = ""; });
    await page.waitForSelector("#app-content .toc-grid", { timeout: 10000 });
    const afterExit = await page.evaluate(
        () => document.querySelectorAll("#app-content canvas").length);
    expect(afterExit, "every sandbox canvas must be torn down on exit").toBe(0);

    expect(errors, "first-party errors:\n" + errors.join("\n")).toHaveLength(0);
});
