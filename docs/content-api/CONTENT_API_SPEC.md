# Staples Education Content API Specification

**Version 1.0.0-draft — 2026-07-03**

The canonical content model for the ODE interactive roadmap: one source of truth per
unit, compiled into every delivery target. This document is normative; the JSON
Schemas in `schema/` are the machine-checkable half of the same contract.

---

## 1. Purpose and Scope

Today the same 19-unit curriculum lives in **three overlapping representations**:

| Representation | Location | Consumed by |
|---|---|---|
| Web globals (`CURRICULUM`, `QUIZ_DATA`, `PRACTICE_DATA`) | `ode/js/curriculum-data.js`, `ode/js/quiz-data.js` (~2 MB) | SPA runtime |
| JSON mirrors | `ode/data/curriculum.json`, `ode/data/quizzes.json` | documentation only |
| Per-unit rich content | `scripts/unitN_data.json` (18 files; unit 12 missing) | `render_latex.py`, `build_practice_data.py` |

None is authoritative for everything, mirrors drift by hand, and PDF-flavored LaTeX
does not round-trip into web strings (the documented `--mode master` regeneration
loss). This spec replaces all three with **canonical content packages** under
`content/`, from which every representation above is *compiled*.

**In scope:** document formats, string/math conventions, identifier registry,
compilation targets, versioning, validation rules, migration notes.
**Out of scope (Phase 1+):** the compiler implementations, router migration,
the mobile app itself.

## 2. Architectural Model

```
                    content/  (canonical, hand- or agent-authored, git-reviewed)
                        │
        ┌───────────────┼────────────────────┐
        ▼               ▼                    ▼
  web compiler    print compiler       mobile bundle
  (Node or Py)   (render_latex.py)    (copy + manifest)
        │               │                    │
        ▼               ▼                    ▼
 ode/js/*.js      Unit-N-*.tex → PDF   bundled JSON read
 (script-injected  via tectonic         natively by the
  globals)                              Capacitor app
```

Three invariants carry over from `WEBSITE_BLUEPRINT.md` and are **preserved by
construction**:

1. **Pillar 1 holds.** The SPA still ships embedded, script-injected globals and
   runs from `file://`. The Content API is a *build-time* contract, not a runtime
   fetch API. Compiled JS artifacts gain a `/* GENERATED from content/ — do not
   hand-edit */` banner.
2. **Progress keys are sacred.** `ode_quiz_progress` persists arrays of quiz item
   IDs and `ode_watched_videos` persists video IDs. Canonical IDs are therefore
   **append-only and immutable** (§5).
3. **Copy rules bind.** No em dashes and no ampersands in user-facing prose
   (ARCHITECTURE §1, absorbed into the blueprint). The validator enforces this
   outside math spans (§8).

The mobile app consumes the canonical files **directly** — that is the point of
the design: the web build is a *projection* of the canonical model, not the model.

## 3. Directory Layout

```
content/
  manifest.json                 # schemaVersion, unit registry, completeness status
  curriculum.json               # units → modules → videos → checkpoints
  units/
    unit-00/
      guide.json                # rich reference content (at-a-glance, module 6-box matrix)
      practice.json             # the unit's slice of the 193-problem matrix
      quizzes.json              # micro-practice (per video) + unit mastery (30 items)
    unit-01/ … unit-18/         # same shape; two-digit zero-padded slugs
```

Each file validates against the like-named schema in `docs/content-api/schema/`.
A unit directory may be **partial** during migration; `manifest.json` records
per-file status so compilers can fail loudly instead of emitting holes.

## 4. String Content Types and the Math Profile

Every human-readable string field is one of three declared types. The schemas
reference these via `common.defs.schema.json`.

### 4.1 `PlainText`
No markup, no math, no LaTeX. Used for titles, slugs, video titles.
Forbidden characters: `—` (U+2014), `&`, and the LaTeX em dash `---`.

### 4.2 `MathText`
Prose with embedded math: inline `$...$`, display `$$...$$`. This is the workhorse
type (prompts, hints, rationales, solutions, summaries, concept/warning bodies).

- Math spans must be **KaTeX 0.16-renderable** (the deployed renderer). KaTeX
  compatibility is the canonical bar; pdflatex/tectonic accepts a superset, so
  anything KaTeX renders the print pipeline can too.
- **Forbidden inside `MathText`:** text-mode presentational LaTeX — `\textbf`,
  `\textcolor`, `\noindent`, `\quad`/`\qquad` *outside* math, `\\` line breaks in
  prose, `---`, environment/document commands (`\begin{document}`, `\input`,
  `\section`). Structure belongs in JSON fields, not in strings.
- **The five semantic macros** are the *only* permitted text-mode commands
  (amended 1.0.0: `\work` and `\warn` added after the migration audit found
  441 `workpurple` and 47 `warnred` usages that would otherwise be lossy):

  | Macro | Meaning | Web mapping (Phase 1 → target) | Print mapping |
  |---|---|---|---|
  | `\emph{…}` | emphasis | unwrap → `<em>` | `\emph{…}` |
  | `\strong{…}` | strong emphasis | unwrap → `<strong>` | `\textbf{…}` |
  | `\highlight{…}` | accent callout | unwrap → `<mark class="accent">` | `\textcolor{accentorange}{…}` |
  | `\work{…}` | live working math | unwrap → styled span | `\textcolor{workpurple}{…}` |
  | `\warn{…}` | warning emphasis | unwrap → styled span | `\textcolor{warnred}{…}` |

  Web lowering is **unwrap** (drop the macro, keep the body) in Phase 1 because
  the SPA renders these strings via `textContent` + KaTeX auto-render; the HTML
  element mappings activate with the Phase 2 renderer migration. The macro maps
  are **bijective token renames**, so canonical ⇄ print round-trips are
  byte-exact and nothing is lost in either direction — the load-bearing fix for
  the documented `--mode master` regeneration loss.

### 4.3 `MathExpr`
A bare math body with **no delimiters** — the renderer chooses `\[...\]`,
`$$...$$`, or an `aligned` context. Used for formula bodies, worked-example
steps, and recurrence displays. Same KaTeX bar as math spans in `MathText`.
Alignment `&` and `\\` are legal here (matrices, `aligned`) — the ampersand copy
rule applies to prose, not math.

**Delimiter note (amended 1.0.0):** in `MathText`, display math may be
delimited by `$$...$$` *or* `\[...\]` as authored — KaTeX auto-render accepts
both, and preserving the authored form keeps the print round-trip byte-exact.
The web compiler normalizes `\[ \]` → `$$` at emission (matching today's
deployed strings); canonical files keep the authored delimiters.

**Solution labels (amended 1.0.0):** practice solutions carry no label prefix
in canonical form; the print compiler emits the default `Solution N.` label, or
the problem's explicit `solutionLabel` when present (the six authored
`(Capstone)` variants). This also fixes a live web defect where non-default
labels leaked literal `\noindentSolution (Capstone).\quad` text to students.

### 4.4 Print-only decoration is the compiler's job
`\textcolor{workpurple}{…}` wrapping of live solution steps, `Solution N.`
labels, `\noindent` spacing — all of it is applied by the print compiler at
emission time (as `render_latex.py` already does for examples). Canonical
content never contains it.

## 5. Identifier and Key Registry

| Entity | Format | Example | Stability rule |
|---|---|---|---|
| Unit | integer `unitNumber` 0–18 + slug `unit-NN` | `13`, `unit-13` | permanent |
| Module | `"<unit>.<ordinal>"` string | `"13.1"` | permanent once published |
| Video | YouTube ID (11 chars) | `"Em339AlejIs"` | external key; replacing a video creates a *new* key |
| Micro-practice item | `mp_<videoId>_<n>` | `mp_Em339AlejIs_1` | **immutable** — persisted in `ode_quiz_progress` |
| Mastery item | `um_<unit>_<n>` | `um_0_1` | **immutable** — same reason |
| Practice problem | `ps_<unit>_<n>` | `ps_0_9` | **immutable** — deep-linkable |
| Checkpoint | snake_case slug | `desmos_e_limit_explorer` | resolved by checkpoint registry |
| Sandbox | `unit_<N>_<slug>` | `unit_2_integrating_factor_builder` | deep-linked via `#interactives-sandbox-<id>` |

Rules:

1. **IDs are append-only.** Never renumber, never reuse a retired ID. Retiring an
   item removes it from the array; its ID stays burned (a `retiredIds` list in
   the unit's `quizzes.json` documents these).
2. **Keys are IDs, not display strings.** Canonical `unitMastery` is keyed by
   `unitNumber` — *not* by the exact unit title, which is how `QUIZ_DATA.unit_mastery`
   is keyed today and which silently orphans a quiz on any title edit. The web
   compiler emits the title-keyed legacy shape until the Phase 2 router migration
   (§7.1), after which the legacy emission is deleted.
3. **Cross-file referential integrity** (every `videoId` in `quizzes.json` exists
   in `curriculum.json`; every module checkpoint resolves; unit numbers agree
   with the directory slug) is validator-enforced (§8).

## 6. Document Types

Normative field tables live in the schemas; this section gives shape and intent.

### 6.1 `manifest.json` — the registry
```json
{
  "schemaVersion": "1.0.0",
  "units": [
    { "unitNumber": 0, "slug": "unit-00",
      "status": { "guide": "complete", "practice": "complete", "quizzes": "complete" },
      "provenance": { "guide": "backfill" } }
  ]
}
```
`status` values: `complete` | `partial` | `missing`. `provenance` distinguishes
`authored` guides from the units 0–9 archival `backfill` (today's
`is_rich_source` flag, renamed and inverted into something meaningful).
Compilers **must** refuse to emit a target that requires a `missing` file.

### 6.2 `curriculum.json` — the spine
Units → modules → videos → checkpoint, the shape the router walks. Canonical
field names are clean (`checkpoint`, not `interactive_checkpoint`; `videoId`,
not `video_id`); the web compiler emits the legacy names (§7.1).

### 6.3 `units/unit-NN/guide.json` — rich reference content
The direct descendant of `unitN_data.json`: unit heading block, `atAGlance`,
`cheat` (subtitle + takeaway), and per-module the six-box matrix — `formulas[]`,
`methodology`, `examples[]`, `concept`, `warning`, `flashQuiz[]` (today's
module `quiz`, renamed to avoid colliding with the interactive quiz system —
these are Q/A pairs printed in the PDF guides, not `answerOptions` items).
Two structural changes from the legacy shape:

- **At-a-glance bullets are structured:** `{ "lead": "Taylor foundations",
  "body": "the coefficient formula …" }` replaces
  `"\\textbf{Taylor foundations} --- the coefficient formula …"`. The print
  compiler re-joins with bold + em dash typography; the web renders it natively.
- All bodies obey the §4 math profile (semantic macros instead of `\textcolor`).

### 6.4 `units/unit-NN/practice.json` — the problem matrix slice
```json
{
  "unitNumber": 13,
  "subtitle": "…", "intro": "…", "takeaway": { "title": "…", "body": "…" },
  "problems": [
    { "id": "ps_13_1",
      "problem": "\\strong{(Maclaurin series)} Write the Maclaurin series of $e^x$ …",
      "solution": "Every derivative of $e^x$ equals $e^x$ … $$ e^x = \\sum_{n=0}^{\\infty}\\frac{x^n}{n!} $$",
      "tags": ["series", "maclaurin"] }
  ]
}
```
**Problems and solutions are paired in one object** — the legacy parallel
`problems[]`/`solutions[]` arrays (index-matched by prayer) are retired. `tags`
is optional, reserved for future filtering/search across the 193-problem matrix.

### 6.5 `units/unit-NN/quizzes.json` — interactive assessment
```json
{
  "unitNumber": 0,
  "microPractice": { "Em339AlejIs": [ /* 5 QuizItems */ ] },
  "unitMastery":   [ /* 30 QuizItems */ ],
  "retiredIds": []
}
```
A `QuizItem` is the existing shape — `id`, `prompt`, `hint`,
`answerOptions[{text, correct?, rationale}]` — with the invariants now
machine-enforced: exactly one option carries `correct: true` (JSON Schema
`contains`/`minContains`/`maxContains`), every option carries a `rationale`,
incorrect rationales are guiding questions that never state the answer
(pedagogy rule — prose-reviewable, not machine-checkable). Counts (5 per video,
30 per mastery) are schema defaults but only *warnings* in the validator, so a
unit can grow deliberately.

## 7. Compilation Targets

### 7.1 Web (`ode/js/`, `ode/data/`)
One compiler emits, from canonical content:

| Artifact | Content | Notes |
|---|---|---|
| `ode/js/curriculum-data.js` | `const CURRICULUM = […]` | legacy field names (`video_id`, `interactive_checkpoint`) until router migration |
| `ode/js/quiz-data.js` | `const QUIZ_DATA = {…}` + `const PRACTICE_DATA = {…}` | `unit_mastery` keyed by exact unit title (legacy) until router migration |
| `ode/data/*.json` | mirrors | now generated, never hand-edited — drift becomes impossible |

Semantic macros are lowered for the web: `\emph`→`<em>`, `\strong`→`<strong>`,
`\highlight`→`<mark class="accent">` (one CSS token rule in `main.css`, themed
via Pillar 4 custom properties). Script-load-order and `file://` contracts are
untouched.

### 7.2 Print (`render_latex.py` → tectonic)
`render_latex.py --unit N --mode cheat|practice|master` reads
`content/units/unit-NN/` instead of `scripts/unitN_data.json`. Semantic macros
lower to the style-guide palette; `workpurple` wrapping and `Solution N.`
labels are applied at emission as today. Because canonical content is loss-free,
**every mode is regenerable for every unit** — the backfill round-trip caveat
dies with the migration.

### 7.3 Mobile (Ionic Capacitor, future)
The app bundles `content/` verbatim and reads it natively (Capacitor apps serve
from `https://localhost`, so `fetch()` of bundled JSON works — no embedded-global
workaround needed). `manifest.json` is the app's index; `schemaVersion` gates
compatibility. No mobile-specific artifact exists until the app does; the
guarantee is simply that canonical JSON **is** the mobile format.

## 8. Validation

Two layers, both zero-dependency:

1. **JSON Schema (2020-12)** — `docs/content-api/schema/*.schema.json`. Structural:
   required fields, ID patterns, exactly-one-correct-option, forbidden characters
   in `PlainText`.
2. **`scripts/validate_content.py` (Phase 1)** — contextual rules schemas cannot
   express:
   - copy rules (`—`, `&`, `---`) checked *outside* math spans only;
   - forbidden LaTeX command scan in `MathText`/`MathExpr` (the §4.2 blocklist);
   - balanced `$`/`$$` delimiters and brace balance;
   - cross-file referential integrity (§5 rule 3);
   - ID format ↔ location agreement (`ps_13_*` only in `unit-13/practice.json`);
   - count warnings (5 per micro-practice, 30 per mastery, 10+ per practice set);
   - KaTeX render check where feasible (Node + the already-CDN-pinned KaTeX
     version, as an optional strict mode).

CI shape: `python scripts/validate_content.py && node scripts/compile_web.mjs --check`
(compile in check mode diffs emitted artifacts against committed ones — the same
regression-lock pattern as `test_sync_worker.mjs`).

## 9. Versioning and Evolution

- `schemaVersion` is semver, single-sourced in `manifest.json`.
- **Minor** bump: additive optional fields, new tags, new units. Consumers ignore
  unknown fields by contract.
- **Major** bump: field renames/removals, ID format changes, math profile
  tightening. Requires a migration script committed in the same change.
- Compilers embed the `schemaVersion` they consumed into generated artifact
  banners, so a stale build is diagnosable from the artifact alone.
- Content edits (fixing a typo in a rationale) are **not** version events; the
  schema versions the *shape*, git versions the *content*.

## 10. Migration Notes (input to Phase 1)

Defects and gaps in the current state that the migration must absorb, discovered
during the 2026-07-03 audit:

1. **Broken generator paths.** `scripts/build_practice_data.py` (`ROOT/app/js/…`)
   and `scripts/render_latex.py` (`MARKDOWNS_DIR = REPO_ROOT/app/…`) still point
   at pre-rename `app/` paths and currently cannot run. Fix lands with the
   compiler work; the blueprint's rename-audit rule gains two more path-anchored
   files to its checklist.
2. **Unit 12 has no JSON** — its practice set is hand-authored
   `ode/assets/markdowns/Unit-12-Practice-Set.tex`, special-cased in
   `build_practice_data.py`. Migration authors `unit-12/` canonically (parse the
   .tex once, review, commit) and deletes the special case.
3. **Backfilled guides (units 0–9)** are archival-quality (`is_rich_source`);
   they migrate as `provenance: backfill` and upgrade opportunistically.
4. **Parallel practice arrays** (`problems[]`/`solutions[]`) zip into paired
   objects mechanically; a length mismatch anywhere becomes a hard migration error.
5. **Legacy LaTeX lowering:** existing `\textbf{…} ---` bullet patterns split
   into `{lead, body}`; `\textcolor{accentorange}` → `\highlight`; `\emph` stays;
   residual print-only commands are stripped with a migration report for review.
6. **Both mirrors** (`ode/data/*.json`) become generated files in the same change,
   with the "documentation mirror" `_doc` preamble replaced by the generated banner.

Migration is script-driven end to end (one `scripts/migrate_to_content_v1.py`),
with the model reviewing diffs and edge cases — not retyping content.

## 11. Decision Record

| # | Decision | Rationale | Alternative rejected |
|---|---|---|---|
| D1 | Canonical content lives in `content/` as per-unit packages | Unit = authoring/review/migration granule; matches pipeline and agent fan-out | one mega-JSON (merge conflicts, unreviewable diffs) |
| D2 | Build-time compilation, runtime stays embedded globals | Pillar 1 `file://` contract is inviolable | runtime fetch + fallback (complexity, contract risk) |
| D3 | Semantic macros (`\emph`/`\strong`/`\highlight`) as the only text-mode commands | Stores intent; kills the web↔print round-trip loss both ways | markdown-in-JSON (new parser in every consumer); keep `\textcolor` (web must strip destructively) |
| D4 | KaTeX 0.16 renderability is the canonical math bar | Web is the strictest consumer; print accepts a superset | separate web/print strings per field (doubles authoring, guarantees drift) |
| D5 | `unitMastery` keyed by `unitNumber`, legacy title-key emitted until router migrates | Title edits must not orphan quizzes | immediate router change (couples Phase 0/1 to Phase 2 risk) |
| D6 | Quiz/practice IDs immutable and append-only | `ode_quiz_progress` and deep links persist them | content-hash IDs (progress resets on every typo fix) |
| D7 | Problems and solutions paired in one object | Index-matched parallel arrays are a latent data bug | keep parallel arrays (status quo prayer) |
| D8 | Mirrors become generated artifacts | Hand-maintained mirrors have already drifted once | delete mirrors (they serve doc/diff review value) |

---

## 12. Content Schema v2 Addendum (2026-07-10, Sprint Rec 2)

Additive evolution — every v1 document is valid unchanged. Two new per-unit
document types and a restructured web compilation target.

### 12.1 `units/unit-NN/readings.json` — supplemental readings (required)

The canonical registry of a unit's Tectonic LaTeX PDF supplemental readings
(cheat sheet, practice set, reference guide, solutions, topic guides) plus an
`https` absolute-URL escape hatch (`url` instead of `file`) for readings too
large to commit (e.g. R2-hosted documents). Schema:
`schema/readings.schema.json`. Key rules:

- `id` is `rd_<unitNumber>_<slug>`, globally unique, same immutability contract as D6.
- Exactly one of `file` (bare filename under `ode/assets/pdfs/`) or `url`,
  unless `status: "planned"` — a scaffolded target whose PDF has not been
  rendered yet. The web compiler strips `file`/`url` from planned entries so
  the UI shows a text label, never a dead link (this retired the dead
  topic-guide links previously hand-authored in `views-materials.js`).
- A non-planned `file` must exist on disk (validator ERROR).
- `title`/`description` are strict UI copy.

`AVAILABLE_MATERIALS` in `views-materials.js` is now *derived at runtime* from
the generated `READINGS_DATA` global — the hand-authored catalog is retired.

### 12.2 `units/unit-NN/bank.json` — question bank v2 (optional)

The growth surface for question volume beyond the curated `quizzes.json`
banks: authored two-sided Elo `difficulty` (400–2400), `skillId` mapping into
the telemetry skill registry, and **parametric templates**. Schema:
`schema/bank.schema.json`. An item with `params` is a template: each param is
an inclusive integer range (optional `step`), `derived` names are arithmetic
expressions over params (integers, `+ - * / ^`, parentheses — evaluated by the
bank loader's built-in ~40-line evaluator, no Math.js dependency), and
`{{name}}` placeholders substitute into every string field. Instantiation
happens client-side once per session; the item `id` stays stable across
instantiations so progress and telemetry key consistently (D6 holds).

Bank items compile into `QUIZ_DATA.pool[unitNumber]` — the adaptive session
composer's feedstock (Sprint Rec 3). IDs are `bk_<unitNumber>_<n>`.

### 12.3 Web target restructure: lazy per-unit bank chunks

The §7.1 monolithic `ode/js/quiz-data.js` (2.5 MB parsed at boot) is retired.
The compiler now emits:

| Artifact | Content | Loading |
|---|---|---|
| `ode/js/bank/bank-unit-NN.js` × 19 | `ODEBank.registerUnit(N, {d, p})` — dictionary-compressed quiz + practice + pool payload | lazy, injected on first navigation to a unit route |
| `ode/js/readings-data.js` | `const READINGS_DATA = {…}` | boot (tiny) |
| `ode/data/readings.json` | mirror | — |
| `ode/data/quizzes.json` | mirror (uncompressed legacy shape, unchanged) | — |

**Dictionary compression:** per chunk, the compiler extracts frequent word
n-grams into a dictionary array `d`; payload strings reference entries via a
3-char code (`U+0011` sentinel + two-char base-62 index). `U+0011`/`U+0012`
are forbidden in canonical strings (validator ERROR). Decoding is one regex
pass in `ode/js/bank-loader.js`.

**`file://` legality (D2 upheld):** chunks load by dynamic `<script>`
injection — script elements execute from `file://` where `fetch()` is blocked,
so the zero-dependency contract survives. `bank-loader.js` owns the
`QUIZ_DATA`/`PRACTICE_DATA` global shells, the `ensureUnit(n, cb)` injection
queue, template instantiation, and dictionary decoding; views render
placeholders until a chunk lands, then re-render through the Pillar 2 router.

---

*Maintenance: this spec is part of the Living Blueprint contract — structural
changes to `content/` shapes, ID formats, or the math profile are incomplete
until this document and the schemas are updated in the same change
(`WEBSITE_BLUEPRINT.md` → Maintenance Contract).*
