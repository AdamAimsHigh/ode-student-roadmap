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
- **`file://` executable, no server.** The app must run by opening `app/index.html` directly — **no Node, no Express, no bundler, no build step.** Deployment target is static **GitHub Pages** (ARCHITECTURE.md §2).
- **All first-party code is plain script-injected globals**, never ES modules with `import`/`export` and never a packaged dependency tree. The single source of truth for boot order is the ordered `<script>` block at the bottom of `app/index.html`:

  ```
  curriculum-data.js   → state.js → theme.js → modes.js
  → checkpoints/checkpoint-registry.js → checkpoint-core.js → widgets-unit0..18.js
  → quiz-data.js → quiz-engine.js → router.js   (router is ALWAYS last)
  ```

  **Load order is a contract:** data and the state machine must be parsed *before* the router that consumes them; the router is loaded last and bootstraps the first render.
- **Data is embedded, never fetched.** Because `file://` blocks `fetch()` of sibling files, every data layer ships as an in-JS global (`CURRICULUM`, `QUIZ_DATA`, `PRACTICE_DATA`, …). This is why the 193-problem practice store was backfilled *into* `quiz-data.js` rather than loaded from `scripts/unitN_data.json` at runtime.
- **External libraries are the only network dependency**, all via CDN `<script>`/`<link>` in `<head>`: **KaTeX 0.16.8** (CSS + JS + `auto-render`), **Math.js 11.8.0** (local parsing), **Desmos v1.9** (interactive checkpoints). Local stylesheets load `theme.css` **before** `main.css` so custom properties exist before components consume them.

### Pillar 2: Centralized Hash Routing Matrix
- **One entry point.** `app/js/router.js` exposes `renderCurriculum()`, the sole render function. Every navigation, mode toggle, and checkpoint pass funnels through it, so the view always redraws to match the URL hash.
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
  - `curriculum-data.js` → `CURRICULUM` (Unit → Module → Video → `interactive_checkpoint`), mirrored from `app/data/curriculum.json` and canonically specified in ARCHITECTURE.md §3.
  - `checkpoints/checkpoint-registry.js` + `widgets-unitN.js` → per-unit interactive widget definitions, resolved by the `interactive_checkpoint` key on each module.
  - `quiz-data.js` → `QUIZ_DATA` (micro-practice + mastery) **and** `PRACTICE_DATA` (the web practice store, units 0–18).
- **The renderer is data-driven.** `router.js` reads these globals and builds DOM with shared classes (`.practice-problem-list`, `.practice-solution-list`, `.pdf-download-btn`, `.toc-grid`, …). Adding a unit's content requires no router change — only a data entry.
- **Build-time tooling produces data, never runtime behavior.** `scripts/render_latex.py` (PDF assets) and `scripts/build_practice_data.py` (web practice store) are dev-time generators. They sanitize PDF-LaTeX into web-clean strings (`$…$` / `$$…$$`, color/label wrappers stripped) and emit static globals, preserving Pillar 1.
- **Unit 0's sandbox model is rich, not a placeholder.** Where most units fall back to the generic `INTERACTIVE_SANDBOXES` placeholders (one static "coming soon" body per unit), Unit 0 is served by a dedicated programmatic array, `UNIT_0_SANDBOXES` in `router.js`. Each of its nine entries carries a stable `id`, dashboard copy, and an explicit `render(body)` function rather than an empty body, so the dashboard loop mounts a live, self-contained canvas engine (each with a self-terminating `requestAnimationFrame` loop that stops once its canvas leaves the DOM, strict `u0_sN_` id/variable namespacing, and colors read live from the Pillar 4 theme tokens). The data-driven `isSandbox` path is unchanged — the renderer simply invokes the entry's `render` when present — keeping layout free of engine logic.

### Pillar 4: Dual-Theme Custom Property Framework
- **Tokenized palette, single-attribute switch.** `app/css/theme.css` declares the light-default palette on `:root` and overrides the *same token names* under `[data-theme="dark"]`. Theme switching is one attribute flip on the root element — never a stylesheet swap (ARCHITECTURE.md §2).

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
- **All progress serializes to discrete, namespaced `localStorage` keys** through the `ODEState` IIFE in `app/js/state.js`. Every key is `ode_*`-prefixed:

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

---

## Absorbed `ARCHITECTURE.md` Design Parameters (Dangling-Reference Reconciliation)

The code comments in `app/css/theme.css` and `app/js/state.js` cite an `ARCHITECTURE.md` by section number. That document is **not at the repository root** — it lives at `ODE-Manager-Local/ARCHITECTURE.md` (alongside its `CLAUDE.md` persona file). To keep `WEBSITE_BLUEPRINT.md` the single living source of truth, its design parameters are absorbed here, and the dangling references are reconciled:

| Code reference | Original `ARCHITECTURE.md` source | Absorbed into |
|---|---|---|
| `theme.css` — *"per ARCHITECTURE.md Section 2"* | §2 Technical Architecture and Integrations (theme toggle: CSS vars + `localStorage`, default light) | **Pillar 4** |
| `state.js` — *"Exploration is the default per ARCHITECTURE.md Section 4"* | §4 Dual-Mode Progression and Interactive Checkpoints | **Pillar 5** |
| Curriculum schema | §3 Curriculum Data Structure (Unit → Module → Video → checkpoint; mirrored in `app/data/curriculum.json` + `app/js/curriculum-data.js`) | **Pillar 3** |

**Cross-subject design parameters carried forward from `ARCHITECTURE.md`:**
- **§1 Pedagogy — Math Confidence Reset:** the UI prioritizes first-principles logic over rote memorization; failed checkpoints yield guiding questions, not answers.
- **§1 Copywriting constraint (binding on all UI copy):** user-facing text, tooltips, and quiz strings must use a strictly professional tone and **must not contain em-dashes or ampersands** — use commas and the word "and". (This constraint governs *rendered UI copy and quiz content*, not internal engineering docs such as this blueprint.)
- **§2 Stack invariants:** vanilla HTML/CSS/modular JS; Desmos for visualizations; KaTeX + Math.js for math; GNU Octave reserved for any heavy offline problem-set generation; GitHub Pages as the deploy target.

> **Going forward, treat `ODE-Manager-Local/ARCHITECTURE.md` as the historical project brief and this file as the authoritative living blueprint.** When the two disagree, this blueprint wins, and the divergence should be noted in a future revision.

---

## Maintenance Contract

Per `PIPELINE_LEARNINGS.md` → *Architectural Governance and Living Blueprint Rule*:
1. A structural change to the web shell (script load order, routing matrix, theme tokens, or `ode_*` persistence keys) is **incomplete** until the matching pillar above is updated in the same sprint.
2. New data layers must preserve **Pillar 1** (embedded globals, no runtime fetch, no build dependency for the client).
3. New user-facing copy must honor the **§1 copywriting constraint** (no em-dashes, no ampersands).
