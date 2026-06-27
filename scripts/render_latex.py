#!/usr/bin/env python3
"""Render a Unit's LaTeX assets from a mined curriculum JSON.

This is the bridge stage of the JSON -> LaTeX -> PDF pipeline. It reads a single
``unit{N}_data.json`` and emits one of three asset .tex files depending on the
``--mode`` flag, all sharing the unified style harness pulled in via
``\\input{app/assets/markdowns/preamble.tex}`` (palette, typography, and the six
custom boxes defined in LATEX_STYLE_GUIDE.md):

  * ``--mode cheat``    -> ``Unit-{N}-Cheat-Sheet.tex``     (Part I only: the
                          condensed at-a-glance capsule plus, per module, the
                          formula/method/concept/warning boxes -- worked examples
                          and the per-module quiz are dropped to keep it dense).
  * ``--mode practice`` -> ``Unit-{N}-Practice-Set.tex``    (Part II problems and
                          Part III complete solutions, authored in the JSON's
                          ``practice`` block).
  * ``--mode master``   -> ``Unit-{N}-Reference-Guide.tex`` (the full guide: TOC,
                          at-a-glance, and the complete 6-box matrix per module).

Conventions enforced here:
  * Every parameterized box uses a braced title ``title={#1}`` (supplied via the
    box's optional argument), matching the protected-title rule of the guide.
  * Every live step inside a worked example, and every authored solution line, is
    wrapped in ``\\textcolor{workpurple}{...}`` so running math reads identically
    to the examplebox / solution frame color.

Run from the repository root so the relative ``\\input`` path resolves:
    python scripts/render_latex.py --unit 14 --mode cheat
    python scripts/render_latex.py --unit 14 --mode practice
    python scripts/render_latex.py --unit 14 --mode master
"""

from __future__ import annotations

import argparse
import json
import os

# Paths are resolved relative to the repository root (the script's parent dir).
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREAMBLE_INPUT = "app/assets/markdowns/preamble.tex"
MARKDOWNS_DIR = os.path.join(REPO_ROOT, "app", "assets", "markdowns")

# Per-mode output filename suffix.
ASSET_SUFFIX = {
    "cheat": "Cheat-Sheet",
    "practice": "Practice-Set",
    "master": "Reference-Guide",
}


# ---------------------------------------------------------------------------
# Small LaTeX helpers
# ---------------------------------------------------------------------------
def display(body: str) -> str:
    """A display-math block."""
    return f"\\[ {body} \\]"


def purple_display(body: str) -> str:
    """A display-math block with the whole line tracked in worked-example purple."""
    return f"\\[ \\textcolor{{workpurple}}{{{body}}} \\]"


def title_block(data: dict, subtitle: str) -> list[str]:
    """The shared centered title block: unit title, byline, italic subtitle."""
    return [
        "\\begin{center}",
        f"    {{\\LARGE \\bfseries {data['title']}}}\\\\[6pt]",
        "    {\\large Prepared by Staples Education}\\\\[4pt]",
        f"    {{\\itshape {subtitle}}}",
        "\\end{center}",
        "",
        "\\vspace{0.4em}",
        "",
    ]


def document_head() -> list[str]:
    return [f"\\input{{{PREAMBLE_INPUT}}}", "", "\\begin{document}", ""]


# ---------------------------------------------------------------------------
# Box renderers
# ---------------------------------------------------------------------------
def render_topicsbox(glance: dict) -> str:
    lines = [f"\\begin{{topicsbox}}[{glance['title']}]", glance["summary"], ""]
    lines.append("\\begin{itemize}[leftmargin=1.4em, itemsep=3pt]")
    for bullet in glance["bullets"]:
        lines.append(f"    \\item {bullet}")
    lines.append("\\end{itemize}")
    lines.append("\\end{topicsbox}")
    return "\n".join(lines)


def render_formulabox(formula: dict) -> str:
    return "\n".join([
        f"\\begin{{formulabox}}[{formula['title']}]",
        display(formula["body"]),
        "\\end{formulabox}",
    ])


def render_methodbox(method: dict) -> str:
    lines = [f"\\begin{{methodbox}}[{method['title']}]", "\\begin{enumerate}[leftmargin=1.6em]"]
    for step in method["steps"]:
        lines.append(f"    \\item {step}")
    lines.append("\\end{enumerate}")
    lines.append("\\end{methodbox}")
    return "\n".join(lines)


def render_examplebox(example: dict) -> str:
    lines = [f"\\begin{{examplebox}}[{example['title']}]"]
    if example.get("setup"):
        lines.append(example["setup"])
    # Each live solution step is tracked in workpurple per the style guide.
    for step in example["steps"]:
        lines.append(purple_display(step))
    lines.append("\\end{examplebox}")
    return "\n".join(lines)


def render_conceptbox(concept: dict) -> str:
    return "\n".join([
        f"\\begin{{conceptbox}}[{concept['title']}]",
        concept["body"],
        "\\end{conceptbox}",
    ])


def render_warningbox(warning: dict) -> str:
    return "\n".join([
        f"\\begin{{warningbox}}[{warning['title']}]",
        warning["body"],
        "\\end{warningbox}",
    ])


# ---------------------------------------------------------------------------
# Module renderers (full vs condensed)
# ---------------------------------------------------------------------------
def render_module_full(module: dict) -> str:
    """Master guide: heading, topics lead-in, then the complete box matrix."""
    parts = [
        f"% ---- Module {module['id']} {'-' * 50}",
        f"\\subsection{{{module['title']}}}",
        f"\\emph{{{module['topics']}}}",
        "",
    ]
    for formula in module["formulas"]:
        parts.append(render_formulabox(formula))
        parts.append("")
    parts.append(render_methodbox(module["methodology"]))
    parts.append("")
    for example in module["examples"]:
        parts.append(render_examplebox(example))
        parts.append("")
    parts.append(render_conceptbox(module["concept"]))
    parts.append("")
    parts.append(render_warningbox(module["warning"]))
    parts.append("\n\\vspace{0.8em}\n")
    return "\n".join(parts)


def render_module_condensed(module: dict) -> str:
    """Cheat sheet: heading, topics lead-in, formulas, method, concept, warning.

    Worked examples and the per-module quiz bank are intentionally dropped so the
    cheat sheet stays a dense single-pass reference.
    """
    parts = [
        f"% ---- Module {module['id']} {'-' * 40}",
        f"\\subsection{{{module['title']}}}",
        f"\\emph{{{module['topics']}}}",
        "",
    ]
    for formula in module["formulas"]:
        parts.append(render_formulabox(formula))
        parts.append("")
    parts.append(render_methodbox(module["methodology"]))
    parts.append("")
    parts.append(render_conceptbox(module["concept"]))
    parts.append("")
    parts.append(render_warningbox(module["warning"]))
    parts.append("\n\\vspace{0.6em}\n")
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Practice blocks (shared by the standalone Practice Set and the master guide)
# ---------------------------------------------------------------------------
def render_practice_problems(practice: dict) -> list[str]:
    """The intro paragraph plus the numbered list of practice problems."""
    out = []
    if practice.get("intro"):
        out.append(practice["intro"])
        out.append("")
    out.append("\\begin{enumerate}[leftmargin=2em]")
    for problem in practice["problems"]:
        out.append(f"    \\item {problem}")
        out.append("")
    out.append("\\end{enumerate}")
    out.append("")
    return out


def render_practice_solutions(practice: dict) -> list[str]:
    """The worked solutions, each followed by spacing, plus an optional takeaway."""
    out = []
    for solution in practice["solutions"]:
        out.append(solution)
        out.append("")
        out.append("\\medskip")
        out.append("")
    if practice.get("takeaway"):
        out.append(render_conceptbox(practice["takeaway"]))
        out.append("")
    return out


# ---------------------------------------------------------------------------
# Document assemblers, one per mode
# ---------------------------------------------------------------------------
def render_master(data: dict) -> str:
    out = []
    out.append(f"% Unit {data['unitNumber']} Reference Guide --- {data['subtitle']}")
    out.append("% AUTO-GENERATED by scripts/render_latex.py --mode master.")
    out.append("% Do not edit by hand; edit the JSON and re-run the renderer.")
    out.append("")
    out += document_head()
    out += title_block(data, f"Unit {data['unitNumber']}: {data['subtitle']}")
    out.append("\\tableofcontents")
    out.append("\\vspace{0.4em}")
    out.append("")
    out.append(render_topicsbox(data["atAGlance"]))
    out.append("")
    out.append("\\vspace{0.6em}")
    out.append("")
    # Force the section counter so sub-modules read N.1, N.2, ...
    out.append(f"\\setcounter{{section}}{{{data['unitNumber']}}}")
    out.append("")
    for module in data["modules"]:
        out.append(render_module_full(module))
    # Fold the practice problems and worked solutions into the full guide so the
    # Reference Guide is a single comprehensive document. The standalone
    # Practice Set still renders the same content via --mode practice.
    practice = data.get("practice")
    if practice:
        out.append("\\clearpage")
        out.append("\\phantomsection")
        out.append("\\addcontentsline{toc}{section}{Practice Problems}")
        out.append("\\section*{Practice Problems}")
        out.append("")
        out += render_practice_problems(practice)
        out.append("\\clearpage")
        out.append("\\phantomsection")
        out.append("\\addcontentsline{toc}{section}{Complete Solutions}")
        out.append("\\section*{Complete Solutions}")
        out.append("")
        out += render_practice_solutions(practice)
    out.append("\\end{document}")
    out.append("")
    return "\n".join(out)


def render_cheat(data: dict) -> str:
    n = data["unitNumber"]
    subtitle = data.get("cheatSubtitle", f"Condensed Cheat Sheet")
    out = []
    out.append(f"% Unit {n} Cheat Sheet (Part I only, standalone)")
    out.append("% AUTO-GENERATED by scripts/render_latex.py --mode cheat.")
    out.append("% Do not edit by hand; edit the JSON and re-run the renderer.")
    out.append("")
    out += document_head()
    out += title_block(data, subtitle)
    out.append(render_topicsbox(data["atAGlance"]))
    out.append("")
    out.append("\\vspace{0.6em}")
    out.append("\\hrule")
    out.append("\\vspace{0.6em}")
    out.append("")
    out.append("\\phantomsection")
    out.append("\\addcontentsline{toc}{section}{Part I --- Condensed Cheat Sheet}")
    out.append("\\section*{Part I --- Condensed Cheat Sheet}")
    out.append(f"\\setcounter{{section}}{{{n}}}   % subsections auto-number as the Unit {n} modules")
    out.append("")
    for module in data["modules"]:
        out.append(render_module_condensed(module))
    if data.get("cheatTakeaway"):
        out.append(render_conceptbox(data["cheatTakeaway"]))
        out.append("")
    out.append("\\end{document}")
    out.append("")
    return "\n".join(out)


def render_practice(data: dict) -> str:
    n = data["unitNumber"]
    practice = data["practice"]
    subtitle = practice.get("subtitle", "Practice Set: Problems and Complete Solutions")
    out = []
    out.append(f"% Unit {n} Practice Set (Part II Problems and Part III Solutions, standalone)")
    out.append("% AUTO-GENERATED by scripts/render_latex.py --mode practice.")
    out.append("% Do not edit by hand; edit the JSON and re-run the renderer.")
    out.append("")
    out += document_head()
    out += title_block(data, subtitle)
    # Part II --- problems.
    out.append("\\phantomsection")
    out.append("\\addcontentsline{toc}{section}{Part II --- Review Guide: Practice Problems}")
    out.append("\\section*{Part II --- Review Guide: Practice Problems}")
    out.append("")
    out += render_practice_problems(practice)
    # Part III --- solutions.
    out.append("\\clearpage")
    out.append("\\phantomsection")
    out.append("\\addcontentsline{toc}{section}{Part III --- Complete Solutions}")
    out.append("\\section*{Part III --- Complete Solutions}")
    out.append("")
    out += render_practice_solutions(practice)
    out.append("\\end{document}")
    out.append("")
    return "\n".join(out)


RENDERERS = {"cheat": render_cheat, "practice": render_practice, "master": render_master}


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def resolve_data_path(unit: int, explicit: str | None) -> str:
    if explicit:
        return explicit if os.path.isabs(explicit) else os.path.join(REPO_ROOT, explicit)
    # Prefer scripts/unit{N}_data.json; fall back to a repo-root copy (e.g. unit 13).
    scripts_path = os.path.join(REPO_ROOT, "scripts", f"unit{unit}_data.json")
    root_path = os.path.join(REPO_ROOT, f"unit{unit}_data.json")
    return scripts_path if os.path.exists(scripts_path) else root_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Render a Unit's LaTeX asset from its curriculum JSON.")
    parser.add_argument("--unit", type=int, default=14, help="Unit number (default: 14).")
    parser.add_argument("--mode", choices=RENDERERS, default="master", help="Which asset to emit.")
    parser.add_argument("--data", default=None, help="Path to the unit data JSON (default: scripts/unit{N}_data.json).")
    parser.add_argument("--out", default=None, help="Override output .tex path.")
    args = parser.parse_args()

    data_path = resolve_data_path(args.unit, args.data)
    with open(data_path, encoding="utf-8") as fh:
        data = json.load(fh)

    tex = RENDERERS[args.mode](data)

    out_path = args.out or os.path.join(
        MARKDOWNS_DIR, f"Unit-{args.unit}-{ASSET_SUFFIX[args.mode]}.tex"
    )
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(tex)
    print(f"[{args.mode}] wrote {out_path} (from {os.path.relpath(data_path, REPO_ROOT)})")


if __name__ == "__main__":
    main()
