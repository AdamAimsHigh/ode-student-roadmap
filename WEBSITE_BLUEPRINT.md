# WEBSITE_BLUEPRINT.md

> **The definitive master architecture blueprint for the Staples Education ODE Roadmap** — a zero-build, vanilla-JS single-page application. This is the *living blueprint* mandated by the **Architectural Governance & Living Blueprint Rule** in `PIPELINE_LEARNINGS.md`: every structural change to the global web shell (script load order, theme tokens, routing mechanics, or persistence keys) MUST update the corresponding pillar below before a sprint concludes.
>
> It decouples the **core layout systems** (shell, routing, theming, persistence) from the **mathematical data layers** (curriculum, checkpoints, quizzes, practice sets). The two divisions below capture how the shell *got here* (archaeology) and what it *guarantees going forward* (the system spec).

---

## Division I: Structural Archaeology (Phase 0 to Phase 2)

The shell evolved from a single static page into a modular SPA across roughly two weeks. The boundary of this archaeology is **2026-06-12**, the commit that introduced the persistent tracking log (`.claude-session-state.md`) — the moment the project gained formal memory.

### Phase 0 — The Monolithic Syllabus (2026-05-27)
| Commit | Milestone |
|---|---|
| `218c639` | **Initial commit** — ODE Study Roadmap, a static 57-video syllabus in a single page. |
| `18e9f5b` | Duplicated the roadmap to `index.html` for root-URL access — the first "shell" entry point. |

The page *was* the application: no routing, no state module, no theming layer.

### Phase 1 — Interactivity Grafted onto the Monolith (2026-05-27 → 06-04)
| Commit | Evolution |
|---|---|
| `2d7e8bd` | First interactive **Checkpoint Quiz**, introducing the two enduring pillars: **KaTeX math rendering** and **`localStorage` progress tracking**. |
| `6be3034`, `4585787` | Scaled the checkpoint to a 15-question mastery gate; extended KaTeX into the post-submission rationale. |
| `ffa22d1`, `b8507b3` | Local **Slope Field Generator** (RK4 plotting) and **Euler's Method Visualizer** — first in-browser numerical engines. |
| `4513662` → `34e9960` | **Micro-Practice** quizzes injected inline beneath each video card. |
| `2f4d46d` | **`generate_micro_quizzes.py`** — automated quiz generation from YouTube transcripts via the Gemini API: the first build-time content pipeline. |
| `1883194` | +9 videos and matching micro-practice (2026-06-04). |

Capabilities were welded directly onto the monolith; separation of concerns had not yet arrived.

### Phase 2 — Modularization and the Formal Tracking Boundary (2026-06-11 → 06-12)
| Commit | Evolution |
|---|---|
| `d22e350` | "Update gitignore for agentic workflow" — the repo formally acknowledges agent-driven development. |
| `7cbe89a` | **Dual-mode UI toggle** (Exploration / Guided) plus **Desmos API** checkpoint integration. |
| `59940be` | **Quiz engine + Unit 0 content — and the first commit of `.claude-session-state.md`.** ⬅️ **FORMAL TRACKING BEGINS (2026-06-12).** |
| `ad1085a` (06-13) | Hash-based **SPA routing** lands the day after the boundary, locking in the modular shell whose spec is Division II. |

**Boundary summary:** at `59940be` the project simultaneously extracted a reusable quiz engine and began keeping a persistent architectural log. The foundation was *declared* at the tracking boundary and *structurally crystallized* one commit later with hash routing.

---

## Division II: Reusable Architecture Pillars (The System Spec)

These five pillars are the load-bearing guarantees of the shell. **Changing any of them obligates an update to this file** (the Living Blueprint Rule).

### Pillar 1: Zero-Dependency Client Architecture
- **Multi-app repository layout (2026-07-01 restructure).** The repository root is the deployed web root of **StaplesEducation.com**: the tutoring business landing page (`index.html`, `reviews.html`, `style.css`) serves at `/`, and the ODE roadmap SPA lives in the standalone directory shell **`ode/`** (renamed from `app/`), served at **`/ode/`**. Deployment target is **Cloudflare Workers static assets** (superseding the original GitHub Pages target): `wrangler.jsonc` points `assets.directory` at the repository root, and the root `.assetsignore` is a **deny-by-default allowlist** re-including only `index.html`, `reviews.html`, `style.css`, and `ode/` — everything else (`node_modules/`, `scripts/`, PDFs, the Python toolchain) is shielded from cloud uploads by construction.
- **`file://` executable, no server.** The app must run by opening `ode/index.html` directly — **no Node, no Express, no bundler, no build step.** The `ode/` shell is fully self-contained: every internal reference is document-relative (`css/…`, `js/…`, `assets/pdfs/…`), so the same tree runs identically from `file://`, from `/ode/` in production, or from any future mount point.
- **All first-party code is plain script-injected globals**, never ES modules with `import`/`export` and never a packaged dependency tree. The single source of truth for boot order is the ordered `<script>` block at the bottom of `ode/index.html`:

  ```
  curriculum-data.js   → state.js → theme.js → modes.js
  → checkpoints/checkpoint-registry.js → checkpoint-core.js → widgets-unit0..18.js
  → quiz-data.js → quiz-engine.js → router.js   (router is ALWAYS last)
  ```

  **Load order is a contract:** data and the state machine must be parsed *before* the router that consumes them; the router is loaded last and bootstraps the first render.
- **Data is embedded, never fetched.** Because `file://` blocks `fetch()` of sibling files, every data layer ships as an in-JS global (`CURRICULUM`, `QUIZ_DATA`, `PRACTICE_DATA`, …). This is why the 193-problem practice store was backfilled *into* `quiz-data.js` rather than loaded from `scripts/unitN_data.json` at runtime.
- **External libraries are the only network dependency**, all via CDN `<script>`/`<link>` in `<head>`: **KaTeX 0.16.8** (CSS + JS + `auto-render`), **Math.js 11.8.0** (local parsing), **Desmos v1.9** (interactive checkpoints), and **Google Identity Services** (`accounts.google.com/gsi/client`, async/defer, for the optional cloud sync of Pillar 5 — degrades silently on `file://` or offline). Local stylesheets load `theme.css` **before** `main.css` so custom properties exist before components consume them.
- **Serverless companion (2026-07-01).** The only server-side code in the repository is `src/worker.js`, the Worker entry (`wrangler.jsonc` `main`) serving `/api/sync` in front of the asset pipeline. It verifies Google ID tokens with the native Web Crypto API against Google's JWKS and reads/writes per-student progress in the `ODE_PROGRESS_KV` KV namespace. It is a *companion*, not a dependency: the client never requires it to function (Pillar 1 holds — the SPA remains fully `file://` executable).

### Pillar 2: Centralized Hash Routing Matrix
- **One entry point.** `ode/js/router.js` exposes `renderCurriculum()`, the sole render function. Every navigation, mode toggle, and checkpoint pass funnels through it, so the view always redraws to match the URL hash.
- **Subpath mounting (2026-07-01 restructure).** In production the SPA mounts at `/ode/`; the hash matrix below is unchanged because every route lives *after* the `#` and every asset link is document-relative, so the router is agnostic to its mount point. Cross-app navigation is one-way by design: the landing page and `reviews.html` link **into** the SPA via the `/ode/` primary CTA in their shared navigation header; the SPA contains no root-absolute links back out, preserving its standalone `file://` contract.
- **History interception** is wired at the bottom of `router.js`:
  - `document.addEventListener("DOMContentLoaded", renderCurriculum)` — initial paint.
  - `window.addEventListener("hashchange", …)` — re-render plus `window.scrollTo(0, 0)` on view changes.
- **The routing matrix** (hash → view):

  | Hash | View | Type |
  |---|---|---|
  | `#practice-sets` | Practice Sets index | static landing |
  | `#cheat-sheets` | Cheat Sheets (PDF) index | static landing |
  | `#quizzes-index` | Quizzes index | static landing |
  | `#interactives` | Interactives hub | static landing |
  | `#practice-sets-N` | Unit N practice set (problems + toggleable solutions) | dynamic sub-route |
  | `#quizzes-index-N` | Unit N quizzes detail | dynamic sub-route |
  | `#unit-N` | Unit N detail (modules, videos, mastery quiz) | dynamic sub-route |
  | *(empty / unmatched)* | Table of Contents | fallback |

- **Bookmarkable and back-button-safe** by design: all view state lives in the hash, never in memory. `unitIndexFromHash()` parses `#unit-N`; sub-route handlers bound-check `N` against `CURRICULUM.length` and fall back to the parent index on overflow.
- **Guided-Pathway gating** computes a *global* flat module sequence via `unitFlatOffset()` over `ALL_MODULES`, so checkpoint locking spans unit boundaries (see Pillar 5 / ARCHITECTURE.md §4).

### Pillar 3: The Unified Data Model Separation
- **Layout never embeds content.** The curriculum map, checkpoint widgets, quiz strings, and practice problems are each isolated in their own script-injected global, consumed by the layout files but never authored inside them:
  - `curriculum-data.js` → `CURRICULUM` (Unit → Module → Video → `interactive_checkpoint`), mirrored from `ode/data/curriculum.json` and canonically specified in ARCHITECTURE.md §3.
  - `checkpoints/checkpoint-registry.js` + `widgets-unitN.js` → per-unit interactive widget definitions, resolved by the `interactive_checkpoint` key on each module.
  - `quiz-data.js` → `QUIZ_DATA` (micro-practice + mastery) **and** `PRACTICE_DATA` (the web practice store, units 0–18).
- **The renderer is data-driven.** `router.js` reads these globals and builds DOM with shared classes (`.practice-problem-list`, `.practice-solution-list`, `.pdf-download-btn`, `.toc-grid`, …). Adding a unit's content requires no router change — only a data entry.
- **Build-time tooling produces data, never runtime behavior.** `scripts/render_latex.py` (PDF assets) and `scripts/build_practice_data.py` (web practice store) are dev-time generators. They sanitize PDF-LaTeX into web-clean strings (`$…$` / `$$…$$`, color/label wrappers stripped) and emit static globals, preserving Pillar 1.
- **The built-sandbox model is rich, not a placeholder.** Where most units fall back to the generic `INTERACTIVE_SANDBOXES` placeholders (one static "coming soon" body per unit), the leading units are served by dedicated programmatic arrays in `router.js`: `UNIT_0_SANDBOXES` (nine entries), `UNIT_1_SANDBOXES` (ten entries), and `UNIT_2_SANDBOXES` (10 entries, the complete first-order toolkit: linear-solver, geometric-transformation, applied-physics, and the master differential-matrix workbench). Each entry carries a stable, **descriptive ID slug** (`unit_0_*`, `unit_1_*`, `unit_2_*` — e.g. `unit_2_integrating_factor_builder`), dashboard copy, and an explicit `render(body)` function rather than an empty body, so the dashboard loop mounts a live, self-contained canvas engine. Every engine runs a **self-terminating `requestAnimationFrame` loop** that stops once its canvas leaves the DOM, uses strict per-card id/variable namespacing (`u0_sN_`, `u1_sN_`, and for Unit 2's cluster `u2_s1_` through `u2_s10_`) so no inner id or state can collide globally, and reads its colors live from the Pillar 4 theme tokens so Light and Dark both render natively. Registration is uniform: each array is folded into `buildInteractiveItems()` under the same `900 + index` sandbox sort band, and each card deep-links by its slug at `#interactives-sandbox-<id>`. The data-driven `isSandbox` path is unchanged — the renderer simply invokes the entry's `render` when present — keeping layout free of engine logic.

### Pillar 4: Dual-Theme Custom Property Framework
- **Tokenized palette, single-attribute switch.** `ode/css/theme.css` declares the light-default palette on `:root` and overrides the *same token names* under `[data-theme="dark"]`. Theme switching is one attribute flip on the root element — never a stylesheet swap (ARCHITECTURE.md §2).

  | Token | Light (`:root`) | Dark (`[data-theme="dark"]`) |
  |---|---|---|
  | `--bg-color` | `#ffffff` | `#121212` |
  | `--text-color` | `#1a1a1a` | `#e0e0e0` |
  | `--panel-bg` | `#f4f4f4` | `#1e1e1e` |
  | `--accent-color` | `#6200ee` | `#bb86fc` |
  | *(plus `--text-secondary`, `--panel-border`, `--accent-soft`, `--success/-error/-locked-color`, `--header-bg`, `--shadow-color`)* | | |

- `body` transitions `background-color` and `color` (0.3s) for a smooth toggle. Default theme is **light**; the choice persists in `ode_theme_preference` (Pillar 5) and is applied on load.
- **Seamless dropdown hover bridge.** The header `.nav-dropdown` menus carry a transparent `.nav-dropdown-menu::before` pseudo-element (defined in `main.css`) spanning the 0.4rem trigger-to-panel gap. Because the menu is a DOM descendant of `.nav-dropdown`, hovering the bridge keeps the ancestor `:hover` alive, so menus no longer snap shut mid-traversal. The bridge is transparent and theme-agnostic, so it composes with the token palette without per-theme rules.

### Pillar 5: Quiz Subsystem Persistence Loop
- **All progress serializes to discrete, namespaced `localStorage` keys** through the `ODEState` IIFE in `ode/js/state.js`. Every key is `ode_*`-prefixed:

  | Key | Holds |
  |---|---|
  | `ode_watched_videos` | array of watched `video_id`s |
  | `ode_passed_checkpoints` | map of `checkpointId → result detail` |
  | `ode_quiz_progress` | map of `quizId → [correctly-answered question ids]` |
  | `ode_learning_mode` | `"exploration"` (default) or `"guided"` |
  | `ode_theme_preference` | `"light"` (default) / `"dark"` / `"system"` |

- **Defensive I/O.** `readJSON`/`writeJSON` wrap every access in `try/catch` with a fallback, so corrupt or unavailable storage degrades gracefully instead of throwing.
- **Domain semantics.** A quiz's score *is* the length of its correct-answer array; `clearQuizProgress(quizId)` powers per-quiz "Retry" without touching siblings. `resetAllProgress()` clears watched videos, checkpoints, and quiz progress **but deliberately preserves** `ode_learning_mode` and `ode_theme_preference` (UI preferences survive a progress reset).
- **Mode logic (ARCHITECTURE.md §4).** *Exploration* (default) leaves everything unlocked; checkpoints are optional self-assessments. *Guided Pathway* activates gateways: the next module unlocks only after the current checkpoint passes, enforced via the Pillar 2 flat-offset sequence. On failure the system surfaces a first-principles guiding question, never the answer.
- **Cloud sync loop (2026-07-01, optional layer over the localStorage loop).** When a Google Identity Services credential is active, `state.js` extends the persistence loop to the `/api/sync` endpoint (root-absolute by necessity — the SPA mounts at `/ode/` while the API lives at the domain root; a protocol guard keeps it inert under `file://`):
  - **Credential:** the GIS ID token is held in `sessionStorage` under `ode_google_credential` (session-scoped by design; expired tokens are dropped on read). The GIS callback global is `odeHandleGoogleCredential`; sign-out clears the credential and calls `google.accounts.id.disableAutoSelect()`.
  - **Boot merge:** on load with a valid credential, the cloud record is fetched and **defensively merged** — watched videos and per-quiz correct-answer lists are unioned, checkpoint entries are added only when locally absent (local detail wins) — so a stale device can never erase work done elsewhere. A changed merge triggers one `renderCurriculum()` repaint.
  - **Background push:** every progress mutator (`setVideoWatched`, `setCheckpointPassed`, `setQuizAnswerCorrect`, `clearQuizProgress`, `setLearningMode`, `resetAllProgress`) schedules a silent, debounced (2.5 s) POST of the whitelisted `ode_*` snapshot; `ODEState.requestCloudSync()` exposes the same trigger for widgets that persist through their own pathways. All cloud calls are best-effort `try/catch` — the localStorage loop is authoritative and never blocks on the network.
  - **Server contract:** `src/worker.js` (Pillar 1 serverless companion) stores one KV record per Google `sub` (`progress:<sub>`), sanitizing every payload against a strict whitelist with size caps before writing.

---

## Absorbed `ARCHITECTURE.md` Design Parameters (Dangling-Reference Reconciliation)

The code comments in `ode/css/theme.css` and `ode/js/state.js` cite an `ARCHITECTURE.md` by section number. That document is **not at the repository root** — it lives at `ODE-Manager-Local/ARCHITECTURE.md` (alongside its `CLAUDE.md` persona file). To keep `WEBSITE_BLUEPRINT.md` the single living source of truth, its design parameters are absorbed here, and the dangling references are reconciled:

| Code reference | Original `ARCHITECTURE.md` source | Absorbed into |
|---|---|---|
| `theme.css` — *"per ARCHITECTURE.md Section 2"* | §2 Technical Architecture and Integrations (theme toggle: CSS vars + `localStorage`, default light) | **Pillar 4** |
| `state.js` — *"Exploration is the default per ARCHITECTURE.md Section 4"* | §4 Dual-Mode Progression and Interactive Checkpoints | **Pillar 5** |
| Curriculum schema | §3 Curriculum Data Structure (Unit → Module → Video → checkpoint; mirrored in `ode/data/curriculum.json` + `ode/js/curriculum-data.js`) | **Pillar 3** |

**Cross-subject design parameters carried forward from `ARCHITECTURE.md`:**
- **§1 Pedagogy — Math Confidence Reset:** the UI prioritizes first-principles logic over rote memorization; failed checkpoints yield guiding questions, not answers.
- **§1 Copywriting constraint (binding on all UI copy):** user-facing text, tooltips, and quiz strings must use a strictly professional tone and **must not contain em-dashes or ampersands** — use commas and the word "and". (This constraint governs *rendered UI copy and quiz content*, not internal engineering docs such as this blueprint.)
- **§2 Stack invariants:** vanilla HTML/CSS/modular JS; Desmos for visualizations; KaTeX + Math.js for math; GNU Octave reserved for any heavy offline problem-set generation; GitHub Pages as the deploy target *(historical — superseded 2026-07-01 by Cloudflare Workers static assets, see Pillar 1)*.

> **Going forward, treat `ODE-Manager-Local/ARCHITECTURE.md` as the historical project brief and this file as the authoritative living blueprint.** When the two disagree, this blueprint wins, and the divergence should be noted in a future revision.

---

## Maintenance Contract

Per `PIPELINE_LEARNINGS.md` → *Architectural Governance and Living Blueprint Rule*:
1. A structural change to the web shell (script load order, routing matrix, theme tokens, or `ode_*` persistence keys) is **incomplete** until the matching pillar above is updated in the same sprint.
2. New data layers must preserve **Pillar 1** (embedded globals, no runtime fetch, no build dependency for the client).
3. New user-facing copy must honor the **§1 copywriting constraint** (no em-dashes, no ampersands).
