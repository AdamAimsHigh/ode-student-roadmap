# LaTeX Style Guide — Staples Education Unit Reference Assets

This is the definitive architectural specification for every Unit LaTeX source
that lives in `ode/assets/markdowns/` and compiles to a PDF in
`ode/assets/pdfs/`. All unit cheat sheets, practice sets, and master reference
guides must conform to it so the published assets share one visual system.

The Unit 2 sources (`Unit-2-Cheat-Sheet.tex`, `Unit-2-Practice-Set.tex`,
`Unit-2-Reference-Guide.tex`) are the reference implementation of this guide.

---

## 1. Preamble Configuration

Every source declares the same document class and package set, then defines the
shared palette and the six custom boxes (Section 3).

```latex
\documentclass[11pt]{article}

\usepackage[margin=1in]{geometry}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{xcolor}
\usepackage[most]{tcolorbox}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{hyperref}

% Links map to the structural header blue.
\hypersetup{colorlinks=true, linkcolor=headerblue, urlcolor=headerblue}

\tcbuselibrary{skins}
```

### 1.1 Palette

Define the four brand colors by their HTML hex values. Every box frame and every
inline accent draws from this palette — no raw `blue!70!black`-style mixes.

| Color name      | Hex       | Role                                            |
| --------------- | --------- | ----------------------------------------------- |
| `headerblue`    | `#1C569E` | Overview / structural framing, hyperlinks       |
| `accentgreen`   | `#2E7D32` | Algorithms and laid-out methods                 |
| `accentorange`  | `#E27A1E` | Formulas and final concept takeaways            |
| `workpurple`    | `#A020F0` | Worked-example framing and live solution tracking (vibrant) |
| `warnred`       | `#C0392B` | Crimson warning boxes for common pitfalls       |

```latex
\definecolor{headerblue}{HTML}{1C569E}
\definecolor{accentgreen}{HTML}{2E7D32}
\definecolor{accentorange}{HTML}{E27A1E}
\definecolor{workpurple}{HTML}{A020F0}
\definecolor{warnred}{HTML}{C0392B}
```

### 1.2 Subsection Typography

Numbered sub-module headings (`2.1`, `2.2`, ...) are a permanent part of the
visual system: both the section number and the title render in `headerblue`,
large and bold, via `titlesec`. This rule is mandatory in every unit source so
the sub-module headings read consistently across all assets.

```latex
\titleformat{\subsection}
  {\normalfont\large\bfseries\color{headerblue}}{\thesubsection}{1em}{}
```

---

## 2. Table of Contents

Every **master guide** file (the merged Reference Guide that contains Parts I,
II, and III together) must generate a clean `\tableofcontents` block directly
beneath the main title block, before the first content section.

The index is **two levels deep**: it lists both the major Parts and the
underlying mathematical sub-modules (2.1 through 2.5). Both depth counters are
set explicitly to level 2 in the preamble:

```latex
\setcounter{secnumdepth}{2}   % number sections and subsections
\setcounter{tocdepth}{2}      % list both in the table of contents
```

The Part headings stay unnumbered (`\section*`), so each Part registers one crisp
section-level TOC line explicitly. The content sub-modules are authored as
**numbered** `\subsection` commands so they register in the TOC automatically.
Because the parent Part is starred (the section counter never advances), the
section counter is forced to the unit number so the sub-modules read 2.1, 2.2,
... rather than 0.1, 0.2:

```latex
\tableofcontents

% ... before each major Part heading:
\phantomsection
\addcontentsline{toc}{section}{Part I --- Condensed Cheat Sheet}
\section*{Part I --- Condensed Cheat Sheet}
\setcounter{section}{2}        % so subsections auto-number 2.1, 2.2, ...
\subsection{Separable Equations}        % renders and indexes as "2.1 Separable Equations"
```

Standalone single-part assets (an isolated Cheat Sheet or Practice Set) do **not**
carry a table of contents, but use the same numbered `\subsection` convention.

---

## 3. Box System (Unbreakable)

Six custom `tcolorbox` components define the visual vocabulary. Shared rules for
all six:

- **Unbreakable.** No `breakable` parameter — every box stays whole on one page.
  The `breakable` library is *not* loaded; only `skins`.
- **Protected titles.** Parameterized boxes use `title={#1}` (braced) so inline
  math containing `=` in a title is never torn apart by the `pgfkeys` parser.
- **`enhanced`** skin and **`fonttitle=\bfseries`**, white title text on the
  colored title bar.

```latex
% 1. topicsbox — Blue Overview Capsule (fixed title)
\newtcolorbox{topicsbox}{
    enhanced,
    colback=headerblue!6!white, colframe=headerblue,
    coltitle=white, fonttitle=\bfseries,
    title=Unit 2 at a Glance: Core Sub-Topics,
    boxrule=0.6pt, arc=2mm,
    left=3mm, right=3mm, top=2mm, bottom=2mm
}

% 2. formulabox — Orange Formula Container
\newtcolorbox{formulabox}[1][Master Formula]{
    enhanced,
    colback=accentorange!8!white, colframe=accentorange,
    coltitle=white, fonttitle=\bfseries,
    title={#1},
    boxrule=0.6pt, arc=1mm,
    left=3mm, right=3mm, top=2mm, bottom=2mm
}

% 3. methodbox — Green Algorithm Block
\newtcolorbox{methodbox}[1][Method]{
    enhanced,
    colback=accentgreen!6!white, colframe=accentgreen,
    coltitle=white, fonttitle=\bfseries,
    title={#1},
    boxrule=0.6pt, arc=1mm,
    left=3mm, right=3mm, top=2mm, bottom=2mm
}

% 4. examplebox — Purple West-Bordered Worked Example
\newtcolorbox{examplebox}[1][Worked Example]{
    enhanced,
    colback=workpurple!4!white, colframe=workpurple,
    coltitle=white, fonttitle=\bfseries,
    title={#1},
    boxrule=0.4pt, sharp corners,
    borderline west={3pt}{0pt}{workpurple},
    left=5mm, right=3mm, top=2mm, bottom=2mm
}

% 5. conceptbox — Orange Thin-Bordered Final Concept Takeaway
\newtcolorbox{conceptbox}[1][Key Takeaway]{
    enhanced,
    colback=accentorange!5!white, colframe=accentorange,
    coltitle=white, fonttitle=\bfseries,
    title={#1},
    boxrule=0.3pt, arc=1mm,
    left=3mm, right=3mm, top=2mm, bottom=2mm
}

% 6. warningbox — Crimson West-Bordered Common Pitfall
\newtcolorbox{warningbox}[1][Common Pitfall]{
    enhanced,
    colback=red!3!white, colframe=warnred,
    coltitle=white, fonttitle=\bfseries,
    title={#1},
    boxrule=0.4pt, sharp corners,
    borderline west={3pt}{0pt}{warnred},
    left=5mm, right=3mm, top=2mm, bottom=2mm
}
```

| Box          | Frame          | Distinction                                  | Use                                   |
| ------------ | -------------- | -------------------------------------------- | ------------------------------------- |
| `topicsbox`  | `headerblue`   | Rounded `arc=2mm`, fixed title               | The "at a glance" sub-topic capsule   |
| `formulabox` | `accentorange` | Standard rule `0.6pt`                         | Standard forms and master formulas    |
| `methodbox`  | `accentgreen`  | Standard rule `0.6pt`                         | Explicitly laid-out algorithm steps   |
| `examplebox` | `workpurple`   | `3pt` west border, `sharp corners`           | Step-by-step worked examples          |
| `conceptbox` | `accentorange` | Thin rule `0.3pt`                             | The closing concept takeaway          |
| `warningbox` | `warnred`      | `3pt` crimson west border, `sharp corners`   | Common pitfalls and cautions          |

---

## 4. Inline Typography

- **Live solution tracking.** Every live evaluation step inside a worked
  solution is wrapped in `\textcolor{workpurple}{...}`, which resolves to the
  signature vibrant purple (`#A020F0`). The running purple math is how a reader
  follows the execution of a problem, and it shares one named color with the
  worked-example box frame so the purple reads identically everywhere.

  ```latex
  \[ \textcolor{workpurple}{\ln|y| = 2x^{3} + C} \]
  ```

- **Concept takeaways.** The final steps of a solution set conclude in a
  `\begin{conceptbox}` element rather than a raw text header. Inside it, the key
  terms and results carry orange text values via `\textcolor{accentorange}{...}`.

  ```latex
  \begin{conceptbox}[Unit Key Takeaway]
  The \textcolor{accentorange}{integrating factor $\mu = e^{\int P\,dx}$}
  collapses a linear left side into a single derivative.
  \end{conceptbox}
  ```

---

## 5. Print Splits

In merged assets (the master Reference Guide that holds multiple Parts), enforce
a structural `\clearpage` directly before the major **Part II** and **Part III**
section titles so each begins on a fresh page:

```latex
\clearpage
\section*{Part III --- Complete Solutions}
```

A standalone Practice Set keeps the `\clearpage` before Part III (solutions print
on their own page) but **not** before Part II, so the document opens directly on
its problems with no leading blank page. A standalone single-Part Cheat Sheet
needs no internal `\clearpage` at all.
