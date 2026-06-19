# LaTeX Style Guide — Staples Education Unit Reference Assets

This is the definitive architectural specification for every Unit LaTeX source
that lives in `app/assets/markdowns/` and compiles to a PDF in
`app/assets/pdfs/`. All unit cheat sheets, practice sets, and master reference
guides must conform to it so the published assets share one visual system.

The Unit 2 sources (`Unit-2-Cheat-Sheet.tex`, `Unit-2-Practice-Set.tex`,
`Unit-2-Reference-Guide.tex`) are the reference implementation of this guide.

---

## 1. Preamble Configuration

Every source declares the same document class and package set, then defines the
shared palette and the five custom boxes (Section 3).

```latex
\documentclass[11pt]{article}

\usepackage[margin=1in]{geometry}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{xcolor}
\usepackage[most]{tcolorbox}
\usepackage{enumitem}
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
| `workpurple`    | `#744AA8` | Worked-example framing and solution tracking    |

```latex
\definecolor{headerblue}{HTML}{1C569E}
\definecolor{accentgreen}{HTML}{2E7D32}
\definecolor{accentorange}{HTML}{E27A1E}
\definecolor{workpurple}{HTML}{744AA8}
```

---

## 2. Table of Contents

Every **master guide** file (the merged Reference Guide that contains Parts I,
II, and III together) must generate a clean `\tableofcontents` block directly
beneath the main title block, before the first content section.

Because the Part headings are unnumbered (`\section*`), each Part registers a
single crisp TOC line explicitly:

```latex
\tableofcontents

% ... before each major Part heading:
\phantomsection
\addcontentsline{toc}{section}{Part I --- Condensed Cheat Sheet}
\section*{Part I --- Condensed Cheat Sheet}
```

Standalone single-part assets (an isolated Cheat Sheet or Practice Set) do **not**
carry a table of contents.

---

## 3. Box System (Unbreakable)

Five custom `tcolorbox` components define the visual vocabulary. Shared rules for
all five:

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
```

| Box          | Frame          | Distinction                                  | Use                                   |
| ------------ | -------------- | -------------------------------------------- | ------------------------------------- |
| `topicsbox`  | `headerblue`   | Rounded `arc=2mm`, fixed title               | The "at a glance" sub-topic capsule   |
| `formulabox` | `accentorange` | Standard rule `0.6pt`                         | Standard forms and master formulas    |
| `methodbox`  | `accentgreen`  | Standard rule `0.6pt`                         | Explicitly laid-out algorithm steps   |
| `examplebox` | `workpurple`   | `3pt` west border, `sharp corners`           | Step-by-step worked examples          |
| `conceptbox` | `accentorange` | Thin rule `0.3pt`                             | The closing concept takeaway          |

---

## 4. Inline Typography

- **Live solution tracking.** Every live evaluation step inside a worked
  solution is wrapped in `\textcolor{purple}{...}`. This is retained verbatim —
  the running purple math is how a reader follows the execution of a problem.

  ```latex
  \[ \textcolor{purple}{\ln|y| = 2x^{3} + C} \]
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
