# Pipeline Learning Log

## Global Knowledge Base
- Pipeline Convention: Tectonic compiler (must run from repo root to resolve preamble).
- Asset Strategy: All units MUST generate 3 assets (Cheat Sheet, Practice Set, Reference Guide).
- Rendering Logic: `render_latex.py` must support '--mode cheat', '--mode practice', and '--mode master'.

## Retrospectives
- Unit 13: Successfully deployed asset-aware renderer. Confirmed tectonic path resolution needs root-level execution.
- Unit 14 ("Linear Algebra Foundations for Systems"): SUCCESS. T-Production: 17m 10s. Generated all 3 assets (Cheat Sheet, Practice Set, Reference Guide) from `scripts/unit14_data.json` via the upgraded asset-aware `render_latex.py` (now genuinely supports `--mode cheat|practice|master` and `--unit N`). Key learning: tectonic resolves `\input` relative to the SOURCE FILE's directory, not the CWD, so compiling the `.tex` in place under `app/assets/markdowns/` fails to find `preamble.tex`. Fix: copy each asset to the repo root, compile there (`--outdir app/assets/pdfs/`), then delete the root copy. All three PDFs compiled clean with no aux debris.
