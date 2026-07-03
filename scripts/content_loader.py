#!/usr/bin/env python3
"""Load a unit's canonical content/ package in the legacy render_latex shape.

The print pipeline (render_latex.py) predates the Content API and consumes the
legacy ``unitN_data.json`` dict. This adapter reconstitutes that exact shape
from ``content/units/unit-NN/{guide,practice}.json`` + ``content/curriculum.json``
so the renderer's emission logic stays untouched:

  * semantic macros are lowered to the print dialect (the inverse of the
    migration's bijective token maps);
  * at-a-glance bullets re-join as ``\\textbf{lead} --- body``;
  * practice solutions regain their ``\\noindent\\textbf{Solution N.}\\quad``
    labels (or the authored ``solutionLabel`` when present);
  * ``flashQuiz`` maps back to the module ``quiz`` key.

The reconstruction is byte-exact against the retired unitN_data.json files
(regression-locked by scripts/test_content_pipeline.py).
"""
from __future__ import annotations

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")

# Inverse of the migration's MACRO_MAP (longest-first so \work does not
# shadow anything; these are plain token renames, brace-balanced by origin).
PRINT_MACRO_MAP = [
    ("\\highlight{", "\\textcolor{accentorange}{"),
    ("\\work{", "\\textcolor{workpurple}{"),
    ("\\warn{", "\\textcolor{warnred}{"),
    ("\\strong{", "\\textbf{"),
]


def _load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def lower_print(s: str) -> str:
    for macro, latex in PRINT_MACRO_MAP:
        s = s.replace(macro, latex)
    return s


def _walk(value, fn):
    if isinstance(value, str):
        return fn(value)
    if isinstance(value, list):
        return [_walk(v, fn) for v in value]
    if isinstance(value, dict):
        return {k: _walk(v, fn) for k, v in value.items()}
    return value


def load_unit_legacy(unit: int) -> dict:
    """The legacy unitN_data.json dict, rebuilt from the canonical package."""
    slug = f"unit-{unit:02d}"
    unit_dir = os.path.join(CONTENT, "units", slug)
    guide_path = os.path.join(unit_dir, "guide.json")
    if not os.path.exists(guide_path):
        raise SystemExit(
            f"unit {unit} has no canonical guide (content/units/{slug}/guide.json); "
            "see content/manifest.json status")
    guide = _load(guide_path)
    practice = _load(os.path.join(unit_dir, "practice.json"))
    curriculum = _load(os.path.join(CONTENT, "curriculum.json"))
    heading = next(u["title"] for u in curriculum["units"] if u["unitNumber"] == unit)

    data = {
        "unit": heading,
        "unitNumber": unit,
        "title": guide["title"],
        "subtitle": lower_print(guide["subtitle"]),
        "description": lower_print(guide["description"]),
        "atAGlance": {
            "title": guide["atAGlance"]["title"],
            "summary": lower_print(guide["atAGlance"]["summary"]),
            "bullets": [
                f"\\textbf{{{lower_print(b['lead'])}}} --- {lower_print(b['body'])}"
                for b in guide["atAGlance"]["bullets"]
            ],
        },
    }

    if guide.get("cheat", {}).get("subtitle"):
        data["cheatSubtitle"] = lower_print(guide["cheat"]["subtitle"])
    if guide.get("cheat", {}).get("takeaway"):
        data["cheatTakeaway"] = _walk(guide["cheat"]["takeaway"], lower_print)

    if guide.get("richBodies"):
        data["is_rich_source"] = True

    modules = []
    for m in guide["modules"]:
        mod = {"id": m["id"], "title": lower_print(m["title"]),
               "topics": lower_print(m["topics"])}
        # render_latex indexes formulas/examples directly; the truthiness-gated
        # blocks (methodology/concept/warning/quiz) may stay absent.
        mod["formulas"] = _walk(m.get("formulas") or [], lower_print)
        mod["examples"] = _walk(m.get("examples") or [], lower_print)
        for key in ("methodology", "concept", "warning"):
            if m.get(key):
                mod[key] = _walk(m[key], lower_print)
        if m.get("flashQuiz"):
            mod["quiz"] = _walk(m["flashQuiz"], lower_print)
        modules.append(mod)
    data["modules"] = modules

    pr = {}
    for key in ("subtitle", "intro"):
        if practice.get(key):
            pr[key] = lower_print(practice[key])
    pr["problems"] = [lower_print(p["problem"]) for p in practice["problems"]]
    pr["solutions"] = []
    for i, p in enumerate(practice["problems"], start=1):
        label = p.get("solutionLabel", f"Solution {i}.")
        # No separator inserted: the canonical body keeps its original
        # post-\quad whitespace, so this re-join is byte-exact.
        pr["solutions"].append(
            f"\\noindent\\textbf{{{label}}}\\quad{lower_print(p['solution'])}")
    if practice.get("takeaway"):
        pr["takeaway"] = _walk(practice["takeaway"], lower_print)
    data["practice"] = pr
    return data
