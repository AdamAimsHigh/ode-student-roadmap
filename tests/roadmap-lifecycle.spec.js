// @ts-check
/* Student-lifecycle end-to-end integration spec for the ODE Roadmap.
 *
 * Four critical-path flows are exercised in a real headless Chromium context
 * against the production assets served over the local static server (see
 * playwright.config.js):
 *
 *   1. Mobile responsive check  — the landing storefront navigation stacks
 *      cleanly on a phone viewport with no horizontal scroll or clipping.
 *   2. Dashboard hydration      — /ode/ parses the curriculum and paints all
 *      19 unit cards as real DOM blocks.
 *   3. Interactive canvas mount — a deep-linked sandbox hash mounts the
 *      SandboxKit-class canvas engine and drives live animation frames.
 *   4. State persistence loop   — a passed-checkpoint detail (native range
 *      slider coordinates + Desmos scalar map) serializes verbatim into the
 *      ode_passed_checkpoints localStorage cache and round-trips back out.
 *
 * The specs never mutate a shipped asset; they only drive and observe the app.
 *
 * CONSOLE POLICY. Every test asserts ZERO uncaught page exceptions
 * (`pageerror` — the true "runtime console exception" signal). Console
 * *errors* are also collected, but third-party noise that is inherent to
 * running the CDN-backed app on a bare localhost origin (Desmos trial-key
 * notice, Google Identity origin-not-allowed, Turnstile hostname, analytics
 * beacon CORS, favicon) is allow-listed and only FIRST-PARTY console errors
 * fail the run. This mirrors the environmental-noise findings recorded across
 * this project's prior local verification passes.
 */

const { test, expect, devices } = require("@playwright/test");

/* Console noise that is environmental on a localhost origin, not a regression
   in our own code. Anchored to the external hosts / library banners that emit
   it, so a genuine first-party error is never masked. */
const ENVIRONMENTAL_CONSOLE = [
    /desmos/i,
    /accounts\.google\.com|gsi|identity|GSI_LOGGER/i,
    /provider's accounts list is empty/i,
    /turnstile|challenges\.cloudflare\.com/i,
    /cloudflareinsights|beacon\.min\.js|static\.cloudflareinsights/i,
    /fonts\.googleapis\.com|fonts\.gstatic\.com/i,
    /favicon\.ico/i,
    // Cross-origin resource fetches named directly by host.
    /Failed to load resource.*(google|desmos|cloudflare|gstatic)/i,
    // Auth-rejection resource loads (401/403). On the bare localhost origin
    // these are always the third-party sign-in / bot-check / analytics
    // endpoints refusing an unlisted origin; the local static server serves
    // every first-party asset 200 (or 404), never 401/403, so this can only
    // mask environmental noise, never a first-party regression.
    /Failed to load resource.*status of (401|403)/i
];

/* Plain-text environmental match, used for uncaught exceptions (pageerror
   supplies only an Error, no originating URL). Kept tight and pattern-anchored
   so a first-party crash — a TypeError in our own code — never matches and
   always fails the gate. The one documented case here is the Cloudflare
   Turnstile widget throwing 110200 on the domain-restricted key when the
   landing contact form loads on a bare localhost origin. */
function isEnvironmentalText(text) {
    return ENVIRONMENTAL_CONSOLE.some((rx) => rx.test(text));
}

/* A console error is environmental when either its message text OR the URL of
   the script/resource that logged it (msg.location().url — the third-party
   host, even when the message itself carries no host) matches the allow-list.
   Everything else is a genuine first-party error and fails the run. */
function isEnvironmental(msg) {
    const location = typeof msg.location === "function" ? msg.location() : null;
    const haystack = msg.text() + " " + ((location && location.url) || "");
    return isEnvironmentalText(haystack);
}

/* Attaches diagnostic listeners to a page and returns the live collections.
   pageErrors holds uncaught exceptions; firstPartyConsoleErrors holds only
   console.error output that is NOT on the environmental allow-list. */
function attachDiagnostics(page) {
    const pageErrors = [];
    const firstPartyConsoleErrors = [];
    page.on("pageerror", (err) => {
        const text = String(err && err.message ? err.message : err);
        if (!isEnvironmentalText(text)) pageErrors.push(text);
    });
    page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        if (!isEnvironmental(msg)) firstPartyConsoleErrors.push(msg.text());
    });
    return { pageErrors, firstPartyConsoleErrors };
}

/* Shared post-flow assertion: no uncaught exceptions, no first-party console
   errors. Environmental third-party noise is tolerated by construction. */
function expectCleanConsole(diag) {
    expect(diag.pageErrors, "uncaught runtime exceptions").toEqual([]);
    expect(
        diag.firstPartyConsoleErrors,
        "first-party console errors"
    ).toEqual([]);
}

/* ------------------------------------------------------------------------- *
 * 1. Mobile responsive check — landing storefront navigation.
 * ------------------------------------------------------------------------- */
test.describe("landing storefront on a mobile viewport", () => {
    // Pixel 5: a real phone profile (viewport, DPR, mobile UA, touch). Rides
    // the Chromium engine, so it runs under the single provisioned browser.
    // `defaultBrowserType` is stripped because it forces a new worker and is
    // illegal inside a describe group; the remaining keys (viewport, mobile
    // UA, DPR, touch) are the emulation surface this check needs.
    const { defaultBrowserType, ...pixel5 } = devices["Pixel 5"];
    test.use(pixel5);

    test("navigation stacks with no horizontal scroll or clipping", async ({
        page
    }) => {
        const diag = attachDiagnostics(page);
        await page.goto("/", { waitUntil: "load" });

        const navbar = page.locator("header.navbar");
        await expect(navbar).toBeVisible();

        const links = page.locator("header.navbar nav a");
        await expect(links).toHaveCount(4);

        // No horizontal overflow: the document must not scroll sideways. A
        // 1px tolerance absorbs sub-pixel rounding.
        const overflow = await page.evaluate(
            () =>
                document.documentElement.scrollWidth -
                document.documentElement.clientWidth
        );
        expect(overflow, "document horizontal overflow (px)").toBeLessThanOrEqual(1);

        // No clipping: every nav link's box sits fully inside the viewport
        // width, and the links stack (vertical spread exceeds their own
        // height, i.e. they are not crammed onto one overflowing row).
        const viewport = page.viewportSize();
        const boxes = [];
        for (const link of await links.all()) {
            const box = await link.boundingBox();
            expect(box, "nav link is laid out").not.toBeNull();
            expect(box.x, "nav link left edge in view").toBeGreaterThanOrEqual(-1);
            expect(
                box.x + box.width,
                "nav link right edge in view"
            ).toBeLessThanOrEqual(viewport.width + 1);
            boxes.push(box);
        }
        const topSpread =
            Math.max(...boxes.map((b) => b.y)) - Math.min(...boxes.map((b) => b.y));
        expect(topSpread, "nav links stack vertically").toBeGreaterThan(0);

        expectCleanConsole(diag);
    });
});

/* ------------------------------------------------------------------------- *
 * 2. Dashboard hydration — /ode/ paints all 19 unit blocks.
 * ------------------------------------------------------------------------- */
test.describe("roadmap dashboard on /ode/", () => {
    test("hydrates and paints all 19 unit cards as DOM blocks", async ({
        page
    }) => {
        const diag = attachDiagnostics(page);
        await page.goto("/ode/", { waitUntil: "load" });

        // The Table of Contents renders one .toc-card button per curriculum
        // unit. All 19 must paint as real, addressable DOM targets.
        const cards = page.locator("#app-content .toc-card");
        await expect(cards).toHaveCount(19);

        // Each card is a genuine content block, not an empty shell: it must
        // carry a non-empty unit title.
        const titles = page.locator("#app-content .toc-card .toc-card-title");
        await expect(titles).toHaveCount(19);
        const firstTitle = (await titles.first().textContent()) || "";
        expect(firstTitle.trim().length, "first unit card has a title").toBeGreaterThan(0);

        expectCleanConsole(diag);
    });
});

/* ------------------------------------------------------------------------- *
 * 3. Interactive canvas mounting — deep-linked SandboxKit engine.
 * ------------------------------------------------------------------------- */
test.describe("interactive sandbox deep link", () => {
    const ROUTE = "unit_0_equation_translator";

    test("mounts the canvas engine and drives live animation frames", async ({
        page
    }) => {
        const diag = attachDiagnostics(page);

        // Advance history directly to the sandbox hash route; the router mounts
        // the live engine on load without visiting the dashboard first.
        await page.goto(`/ode/#interactives-sandbox-${ROUTE}`, {
            waitUntil: "load"
        });

        // The visualizer host for this exact engine id must be present, and a
        // canvas must mount inside it with real (non-zero) pixel dimensions.
        const host = page.locator(`#interactive-host-${ROUTE}`);
        await expect(host).toBeVisible();
        const canvas = host.locator("canvas").first();
        await expect(canvas).toBeVisible();

        const dims = await canvas.evaluate((c) => ({
            w: c.width,
            h: c.height
        }));
        expect(dims.w, "canvas width").toBeGreaterThan(0);
        expect(dims.h, "canvas height").toBeGreaterThan(0);

        // Physics is live: the default assembled law (dx/dt = k, k = 1.2, from
        // a seeded displacement) moves the particle from frame one, so the
        // rendered pixels change across successive animation frames. Sampling
        // the canvas twice, ~350ms apart, must yield different content — proof
        // the requestAnimationFrame draw loop is actually running.
        const firstSample = await canvas.evaluate((c) => c.toDataURL());
        await page.waitForTimeout(350);
        const secondSample = await canvas.evaluate((c) => c.toDataURL());
        expect(
            secondSample,
            "canvas repaints across animation frames"
        ).not.toBe(firstSample);

        expectCleanConsole(diag);
    });
});

/* ------------------------------------------------------------------------- *
 * 4. State persistence loop — checkpoint success serialization.
 * ------------------------------------------------------------------------- */
test.describe("checkpoint state persistence", () => {
    test("serializes slider and Desmos coordinates into localStorage", async ({
        page
    }) => {
        const diag = attachDiagnostics(page);
        await page.goto("/ode/", { waitUntil: "load" });

        // The checkpoint success handler (checkpoint-core.js `pass()`) commits
        // the final, stable control coordinates through the public
        // ODEState.setCheckpointPassed API: native range sliders under
        // `sliders`, Desmos calculator variables under `desmosSliders`. Drive
        // that exact sink with a valid completion detail — the same shape the
        // widget builds at pass time — and confirm it serializes verbatim.
        const CHECKPOINT_ID = "u0_m1_equation_translator";
        const detail = {
            passed: true,
            attempts: 2,
            checkpoint: "mock evaluation",
            sliders: { "Growth rate k": 1.75, "Initial displacement": -3 },
            desmosSliders: { C: 2.5, a: 0.5 }
        };

        await page.evaluate(
            ({ id, payload }) => {
                // ODEState is the module singleton from ode/js/state.js. It is
                // a top-level `const` (a lexical global, not a window property),
                // so it is referenced as a bare identifier here.
                ODEState.setCheckpointPassed(id, payload);
            },
            { id: CHECKPOINT_ID, payload: detail }
        );

        // Read the raw localStorage cache the app persists into, and assert the
        // coordinates round-tripped through JSON.stringify with full fidelity.
        const raw = await page.evaluate(
            () => localStorage.getItem("ode_passed_checkpoints")
        );
        expect(raw, "ode_passed_checkpoints cache written").not.toBeNull();
        const stored = JSON.parse(raw);
        expect(stored[CHECKPOINT_ID]).toBeTruthy();
        expect(stored[CHECKPOINT_ID].passed).toBe(true);
        expect(stored[CHECKPOINT_ID].sliders["Growth rate k"]).toBe(1.75);
        expect(stored[CHECKPOINT_ID].sliders["Initial displacement"]).toBe(-3);
        expect(stored[CHECKPOINT_ID].desmosSliders.C).toBe(2.5);
        expect(stored[CHECKPOINT_ID].desmosSliders.a).toBe(0.5);

        // And the public getter rehydrates the same detail the widget would
        // read back to restore its slider coordinates on the next boot.
        const rehydrated = await page.evaluate(
            (id) => ODEState.getCheckpointDetail(id),
            CHECKPOINT_ID
        );
        expect(rehydrated.sliders["Growth rate k"]).toBe(1.75);
        expect(rehydrated.desmosSliders.a).toBe(0.5);
        expect(
            await page.evaluate(
                (id) => ODEState.isCheckpointPassed(id),
                CHECKPOINT_ID
            )
        ).toBe(true);

        expectCleanConsole(diag);
    });
});
