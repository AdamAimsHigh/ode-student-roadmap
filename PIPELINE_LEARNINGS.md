# Pipeline Learning Log

## Global Knowledge Base
- Pipeline Convention: Tectonic compiler (must run from repo root to resolve preamble).
- Asset Strategy: All units MUST generate 3 assets (Cheat Sheet, Practice Set, Reference Guide).
- Rendering Logic: `render_latex.py` must support '--mode cheat', '--mode practice', and '--mode master'.

## Retrospectives
- Unit 13: Successfully deployed asset-aware renderer. Confirmed tectonic path resolution needs root-level execution.
- Unit 14 ("Linear Algebra Foundations for Systems"): SUCCESS. T-Production: 17m 10s. Generated all 3 assets (Cheat Sheet, Practice Set, Reference Guide) from `scripts/unit14_data.json` via the upgraded asset-aware `render_latex.py` (now genuinely supports `--mode cheat|practice|master` and `--unit N`). Key learning: tectonic resolves `\input` relative to the SOURCE FILE's directory, not the CWD, so compiling the `.tex` in place under `app/assets/markdowns/` fails to find `preamble.tex`. Fix: copy each asset to the repo root, compile there (`--outdir app/assets/pdfs/`), then delete the root copy. All three PDFs compiled clean with no aux debris.
- Normalization complete: Units 13 and 14 both standardized to the full 3-asset suite. Relocated `unit13_data.json` from repo root to `scripts/` (matching the unit 14 convention) and added the missing `cheatSubtitle`, `cheatTakeaway`, and `practice` (10 problems + solutions) blocks so `--mode cheat` and `--mode practice` produce real Unit 13 assets. Re-rendering Unit 14 from unchanged data produced byte-identical `.tex` (renderer is deterministic); only the PDFs differed by non-content build metadata, so that churn was reverted.
- Unit 15 ("Systems of Linear Differential Equations"): SUCCESS. Authored `scripts/unit15_data.json` (5 modules: convert-to-system, eigenvalue decoupling, matrix exponential, fundamental matrices, complex eigenvalues) and rendered all 3 assets via `render_latex.py --unit 15 --mode cheat|practice|master`. Combined-approach content: the MethodBox in 15.2 lays out the diagonalization/decoupling algorithm ($A=PDP^{-1}$, $\mathbf{y}=P^{-1}\mathbf{x}\Rightarrow\mathbf{y}'=D\mathbf{y}$); the matrix-exponential "theory" (15.3) lives in formulaboxes (the 6-box style guide has no dedicated TheoryBox, so the defining formulas $e^{At}=\sum (At)^k/k!$ and $e^{At}=Pe^{Dt}P^{-1}$ render as formulaboxes). One coherent worked matrix $A=\big(\begin{smallmatrix}1&2\\3&2\end{smallmatrix}\big)$ ($\lambda=4,-1$; $P=\big(\begin{smallmatrix}2&1\\3&-1\end{smallmatrix}\big)$, $\det P=-5$, $P^{-1}=\tfrac15\big(\begin{smallmatrix}1&1\\3&-2\end{smallmatrix}\big)$) threads 15.2 → 15.3 → 15.4 so the same $P$, $P^{-1}$, $D$ build the decoupling, then $e^{At}$, then the fundamental matrix that normalizes back to $e^{At}$ at $t=0$ — every intermediate product ($AP$, $P^{-1}AP=D$, $Pe^{Dt}P^{-1}$) shown in full, no skipped algebra, all verified ($P^{-1}P=I$, $e^{A\cdot0}=I$). Reconfirmed the Unit 14 friction-point fix: copy each asset to the repo root, compile with `tectonic --outdir app/assets/pdfs/`, delete the root copy. All three PDFs compiled clean on the first pass with no aux/log debris at root.



## Unit 16 Retrospective

- **Friction Point 1 (Math Environment Overflows):** Long symbolic derivations in `\[...\]` environments caused `overfull \hbox` issues in the Reference Guide. 

    - *Fix:* Use `\text{}` inside math or break derivations into smaller `align*` blocks.

- **Friction Point 2 (Package Dependencies):** `psmallmatrix` is not supported by the current `preamble.tex` dependencies. 

    - *Fix:* Always prefer `\left(\begin{smallmatrix}...\end{smallmatrix}\right)` for compact matrix notation within prose.


## Roadmap Alignment Note (Unit 17)
- **Status:** Sequence reconciled with `curriculum.json`.
- **Target:** Unit 17 is "Boundary Value Problems and Sturm–Liouville Theory." 
- **Architectural Note:** Ensure the "MethodBox" focus shifts to the orthogonality of eigenfunctions—a shift from the "Phase Plane" geometry of Unit 16 to the "Functional Basis" approach of Unit 17.

## Unit 17 Retrospective

- **Unit 17 ("Boundary Value Problems and Sturm–Liouville Theory"): SUCCESS.** Authored `scripts/unit17_data.json` (6 modules: IVP-vs-BVP, two-point BVPs, eigenvalues/eigenfunctions, the shooting method, orthogonal functions, Sturm–Liouville theory) and rendered all 3 assets via `render_latex.py --unit 17 --mode cheat|practice|master`. All three PDFs compiled to `app/assets/pdfs/` (Cheat 91.7 KiB, Practice 58.3 KiB, Reference 118.1 KiB — each larger than its Unit 16 counterpart), no aux/log debris at root.
- **The Orthogonality Pivot (executed):** The MethodBox in 17.6 is the *proof* of eigenfunction orthogonality — two eigenpairs → multiply/subtract → Lagrange identity $y_n(py_m')'-y_m(py_n')'=\tfrac{d}{dx}[p(y_n y_m'-y_m y_n')]$ → integrate → boundary bracket vanishes under separated BCs → $\int_a^b y_n y_m w\,dx=0$. The "TheoryBox (Functional Basis)" was realized as a **formulabox** (`Functional Basis — Generalized Fourier Expansion`, $f=\sum c_n y_n$, $c_n=\langle f,y_n\rangle_w/\langle y_n,y_n\rangle_w$), reconfirming the Unit 15 finding that the 6-box style harness has no dedicated TheoryBox. The capstone worked example (17.5) is the vibrating string with fixed ends: operator/BVP → eigenpairs $\lambda_n=(n\pi/L)^2,\ \sin(n\pi x/L)$ → coefficient formula from orthogonality → **fully expanded** integration of $f(x)=x$ (denominator $L/2$ by half-angle; numerator by parts with boundary term $(-1)^{n+1}L^2/(n\pi)$ and the residual $\cos$ integral shown to vanish) → $x=\sum(-1)^{n+1}\tfrac{2L}{n\pi}\sin\tfrac{n\pi x}{L}$. No coefficient algebra skipped.
- **Friction Point (NEW — closing-bracket in box titles):** An examplebox title containing `$[0,\pi]$` failed to compile (`! Missing $ inserted`): the literal `]` inside the title closed the tcolorbox optional-argument bracket `[...]` prematurely. The Cheat Sheet and Practice Set built fine because the cheat mode drops worked examples and the practice problems put intervals in `enumerate` items (body text), not in box titles. *Fix:* never put a literal `]` in a box title — reworded to `$0\le x\le \pi$`. (Math `$...$` in titles is otherwise fine, as Unit 16's `$a=b=c=d=1$` title showed; the hazard is specifically `]`.)
- **Source extraction:** modules 17.1–17.6 mined from `app/data/curriculum.json`; mastery quiz IDs `um_17_1` … `um_17_30` confirmed present in `app/data/quizzes.json` and used to seed the 10-problem practice set.
