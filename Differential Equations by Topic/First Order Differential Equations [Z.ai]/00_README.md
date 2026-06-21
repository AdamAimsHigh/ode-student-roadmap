# Differential Equations — Course Materials

**Staples Education** · Adam Staples
**Last updated:** 2026-06-19

---

## What's in this folder

This folder contains the complete teaching materials for **Unit 1 — First-Order Ordinary Differential Equations**. The materials are organized so that students, TAs, and instructors can quickly find what they need by purpose: presentation slides for lectures, study materials for review, and Octave scripts for computational practice.

---

## Folder Structure

```
Differential Equations/
│
├── 00_README.md                          ← you are here
│
└── Unit 1 — First-Order ODEs/
    │
    ├── Slides/
    │   └── ODE_First_Order_Dynamics.pptx     ← 38-slide lecture deck
    │
    ├── Study Materials/
    │   ├── ODE_Handout.pdf                    ← formula sheet + decision tree + method summaries
    │   └── ODE_Practice_Problems.pdf          ← 25 problems + full worked solutions
    │
    └── Octave Code/
        ├── ODE_Octave_Guide.pdf               ← how-to guide for Octave 11.3.0 GUI
        ├── 00_gui_basics.m                    ← GUI overview, command window, plotting
        ├── 01_separable_ode.m                 ← symbolic solve of dy/dx = 2xy
        ├── 02_linear_ode.m                    ← integrating factor method
        ├── 03_exact_ode.m                     ← exact equation + potential function
        ├── 04_nonexact_if.m                   ← non-exact equation + integrating factor
        ├── 05_numerical_methods.m             ← Euler, Heun, RK4 side-by-side
        ├── 06_slope_fields.m                  ← direction fields + solution curves
        └── 07_verification.m                  ← back-substitution + numerical vs analytical
```

---

## How to Use Each File

### Slides — `ODE_First_Order_Dynamics.pptx`
The 38-slide lecture deck. Color-coded throughout:
- **Black** prose for explanatory text
- **Purple** (#6B2FA0) for live mathematics being derived step-by-step
- **Orange** (#E07B00) boxed for final answers
- **Blue** (#1f61c9) for structural headers and section labels

**Module structure:**
1. Foundations & Conceptualization (slides 1–5)
2. Qualitative Analysis & Slope Fields (slides 6–7)
3. Analytical Methods — Separation, Linear, Exact, Non-Exact (slides 8–28)
   - Each method has: technique slide → proof/derivation → 2 worked examples
   - Includes a microeconomics application (indifference curves) for exact equations
4. Numerical Methods — Euler, Heun, RK4 (slides 29–35)
5. The Cognitive Map & Summary (slides 36–38)

### Study Materials

#### `ODE_Handout.pdf`
A 7-page printable quick reference. Print this double-sided and bring it to every lecture and problem set session. Contains:
- **Color-coding key** (page 1) — explains the meaning of each color used in the slides
- **Formula sheet** (page 1) — all five techniques on one page
- **Decision tree** (page 2) — "Given dy/dx = f(x,y), ask these questions in order…"
- **Method summaries** (pages 3–7) — one page per method with formula, when-to-use, and a 3-step worked example

#### `ODE_Practice_Problems.pdf`
A 25-problem workbook with full worked solutions. Five problems per topic (Separation, Linear, Exact, Non-Exact, Numerical), increasing in difficulty from basic technique drills to applied real-world scenarios. Problems include:
- Newton's Law of Cooling
- Mixing problems
- RC and RL circuits
- Cobb-Douglas indifference curves (microeconomics)
- Logistic growth and Torricelli's law
- Bernoulli equations
- Heat differentials (thermodynamics)
- RK4 step-by-step computation

### Octave Code

#### `ODE_Octave_Guide.pdf`
The companion guide to the .m scripts. Covers:
- Octave 11.3.0 GUI basics (Command Window, Editor, Workspace, Plot window)
- Loading and using the symbolic package for analytical ODE solving
- Numerical ODE solving with `ode45` and from-scratch Euler/Heun/RK4 implementations
- Plotting slope fields with `quiver` and overlaying solution curves
- Verifying analytical solutions by back-substitution
- Comparing numerical vs analytical results

#### The `.m` Scripts
Eight runnable Octave scripts, numbered in teaching order. Each is self-contained — open in the Octave Editor and press F5 to run.

| Script | Topic | What it demonstrates |
|--------|-------|----------------------|
| `00_gui_basics.m` | GUI overview | Command window, variables, basic plotting, loading the symbolic package |
| `01_separable_ode.m` | Separation | Symbolic `dsolve` of dy/dx = 2xy with verification and plotting |
| `02_linear_ode.m` | Linear ODE | Integrating factor μ = e^∫P dx, with manual computation and verification |
| `03_exact_ode.m` | Exact equations | Testing M_y = N_x, finding the potential F(x,y), plotting level curves |
| `04_nonexact_if.m` | Non-exact + IF | Testing for x-only or y-only IF, multiplying through, solving as exact |
| `05_numerical_methods.m` | Numerical | Euler, Heun, RK4 implemented from scratch + comparison table + `ode45` |
| `06_slope_fields.m` | Plotting | `quiver` direction fields with overlaid solution curves |
| `07_verification.m` | Verification | Back-substitution to check analytical solutions, numerical vs analytical comparison |

---

## Suggested Workflow for Students

1. **Before lecture:** Skim the relevant section in the `ODE_Handout.pdf` to preview the formulas.
2. **During lecture:** Follow along in the slides. Take notes on the purple live-math steps.
3. **After lecture, same day:** Work 2-3 problems from `ODE_Practice_Problems.pdf`. Check your work against the full solutions.
4. **Within 2-3 days:** Open the corresponding `.m` script in Octave and run it. Modify the ODE and re-run to build intuition.
5. **Before exams:** Re-read the handout's decision tree and rework any problems you got wrong.

## Suggested Workflow for Instructors

1. **Lecture prep:** Open the `.pptx` in PowerPoint or Keynote. The slide notes are intentionally minimal — the color-coding carries the pedagogical structure.
2. **Assigning problem sets:** Pick problems from `ODE_Practice_Problems.pdf` by topic. The 5-problem-per-topic structure means you can assign 1 easy + 1 medium for a quick set, or all 5 for a comprehensive unit review.
3. **Computational lab:** Have students run the `.m` scripts in order. The `05_numerical_methods.m` script is especially good for a lab session — students can experiment with step size and see the error trade-offs visually.

---

## Technical Notes

- **Octave version:** 11.3.0 (GUI). Scripts should also work in MATLAB R2021a or later with no changes, except that MATLAB does not require `pkg load symbolic` (the Symbolic Math Toolbox is loaded by default).
- **Symbolic package:** Install once with `pkg install -forge symbolic` from the Octave command window. Load it each session with `pkg load symbolic`. The package requires Python and SymPy to be installed on your system — see the Octave documentation if installation fails.
- **PowerPoint compatibility:** The `.pptx` was authored in Office Open XML and is compatible with PowerPoint 2016+, Keynote, Google Slides, and LibreOffice Impress. Fonts used (Inter, JetBrains Mono, Source Serif 4) are embedded where possible; if your viewer substitutes fonts, the layout may shift slightly but all content remains readable.

---

## Future Units

This folder structure is designed to accommodate additional units as siblings of `Unit 1`:

```
Differential Equations/
├── Unit 1 — First-Order ODEs/         ← current
├── Unit 2 — Second-Order ODEs/        ← future
├── Unit 3 — Laplace Transforms/       ← future
├── Unit 4 — Systems of ODEs/          ← future
└── Unit 5 — PDEs/                     ← future
```

Each unit folder should follow the same `Slides/` + `Study Materials/` + `Octave Code/` structure for consistency.

---

## Contact

**Adam Staples** · Staples Education

For corrections, suggestions, or to report errors, please annotate the relevant slide or PDF and share your feedback. This material is a living document — your input shapes the next iteration.
