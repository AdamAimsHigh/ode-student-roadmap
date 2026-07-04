#!/usr/bin/env python3
"""Compile canonical content/ into the SPA's embedded data layer.

Targets (all carry a GENERATED banner; never hand-edit them):
  ode/js/curriculum-data.js   const CURRICULUM_DATA / CURRICULUM / ALL_MODULES
  ode/js/quiz-data.js         const QUIZ_DATA + const PRACTICE_DATA
  ode/data/curriculum.json    legacy-shaped mirror
  ode/data/quizzes.json       legacy-shaped mirror

Router contract (Phase 2, id-keyed + HTML lowering):
  * curriculum modules re-join as "<id> <title>" with video_id /
    interactive_checkpoint field names (unchanged legacy shape);
  * QUIZ_DATA.unit_mastery is keyed by the unit number (as a string object
    key), replacing the Phase 1 title keys;
  * PRACTICE_DATA strings are HTML-lowered and are injected by the router via
    innerHTML: display delimiters normalized to $$, literal & < > escaped to
    entities (KaTeX reads the resulting text nodes verbatim), semantic macros
    lowered to HTML elements in prose (\\strong -> <strong>, \\emph -> <em>,
    \\highlight/\\work/\\warn -> classed spans styled in ode/css/main.css) and
    unwrapped inside math spans exactly as Phase 1 did, print spacing commands
    stripped, house-style dashes in prose, whitespace collapsed.

Modes:
  python scripts/compile_web.py                  compile and write targets
  python scripts/compile_web.py --check          compile, byte-diff against the
                                                 committed targets, write nothing
                                                 (exit 1 on any difference)

Run from the repository root. Requires Node on PATH (used to evaluate the
candidate JS exactly as the browser would, as a post-compile sanity check).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")

TARGETS = {
    "curriculum_js": os.path.join("ode", "js", "curriculum-data.js"),
    "quiz_js": os.path.join("ode", "js", "quiz-data.js"),
    "curriculum_mirror": os.path.join("ode", "data", "curriculum.json"),
    "quizzes_mirror": os.path.join("ode", "data", "quizzes.json"),
}

# Semantic macros in prose lower to HTML elements (Phase 2). Inside math spans
# the same macros are unwrapped (drop macro, keep body) so KaTeX never sees
# them, preserving the Phase 1 rendering of math content.
PROSE_TAGS = {
    "strong": ("<strong>", "</strong>"),
    "emph": ("<em>", "</em>"),
    "highlight": ('<span class="tx-highlight">', "</span>"),
    "work": ('<span class="tx-work">', "</span>"),
    "warn": ('<span class="tx-warn">', "</span>"),
}
MATH_UNWRAP = frozenset(["strong", "highlight", "work", "warn"])


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_content():
    manifest = load_json(os.path.join(CONTENT, "manifest.json"))
    curriculum = load_json(os.path.join(CONTENT, "curriculum.json"))
    units = {}
    for entry in manifest["units"]:
        d = os.path.join(CONTENT, "units", entry["slug"])
        units[entry["unitNumber"]] = {
            "manifest": entry,
            "practice": load_json(os.path.join(d, "practice.json")),
            "quizzes": load_json(os.path.join(d, "quizzes.json")),
        }
        if entry["status"]["practice"] == "missing" or entry["status"]["quizzes"] == "missing":
            raise SystemExit(f"unit {entry['unitNumber']}: required file missing per manifest")
    return manifest, curriculum, units


# ---------------------------------------------------------------------------
# Web lowering: canonical MathText -> HTML-ready store string. One math-aware
# scan tracks $ / $$ state and a brace stack, so a prose macro whose body
# contains inline math still closes its element at the matching brace, and a
# macro inside math is unwrapped without disturbing KaTeX grouping braces.
# ---------------------------------------------------------------------------
_ENTITIES = {"&": "&amp;", "<": "&lt;", ">": "&gt;"}


def _esc(c):
    return _ENTITIES.get(c, c)


def web_lower(s):
    """Lower one canonical MathText string into the HTML web-store dialect."""
    s = s.replace("\\[", "$$").replace("\\]", "$$")
    s = s.replace("\\(", "$").replace("\\)", "$")
    s = re.sub(r"\\(noindent|medskip|smallskip|bigskip|par|clearpage|phantomsection)\b", "", s)
    s = re.sub(r"\\vspace\s*\{[^}]*\}", "", s)

    out = []
    stack = []   # per open brace group: ("tag", close) | ("unwrap",) | ("brace",)
    math = None  # None (prose) | "$" | "$$"
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c == "\\":
            nxt = s[i + 1] if i + 1 < n else ""
            if nxt.isalpha():
                j = i + 1
                while j < n and s[j].isalpha():
                    j += 1
                name = s[i + 1:j]
                k = j
                while k < n and s[k] in " \t\n":
                    k += 1
                semantic = name in (PROSE_TAGS if math is None else MATH_UNWRAP)
                if semantic and k < n and s[k] == "{":
                    if math is None:
                        open_tag, close_tag = PROSE_TAGS[name]
                        out.append(open_tag)
                        stack.append(("tag", close_tag))
                    else:
                        stack.append(("unwrap",))
                    i = k + 1
                    continue
                out.append("\\" + name)
                i = j
                continue
            out.append("\\" + _esc(nxt))
            i += 2
            continue
        if c == "$":
            if math is None:
                math = "$$" if s.startswith("$$", i) else "$"
                width = len(math)
            elif math == "$$" and s.startswith("$$", i):
                math, width = None, 2
            else:  # closes an inline span; a lone $ inside $$ cannot occur
                math, width = None, 1
            out.append(s[i:i + width])
            i += width
            continue
        if c == "{":
            stack.append(("brace",))
            out.append("{")
            i += 1
            continue
        if c == "}":
            entry = stack.pop() if stack else ("brace",)
            if entry[0] == "tag":
                out.append(entry[1])
            elif entry[0] == "brace":
                out.append("}")
            i += 1
            continue
        if math is None and s.startswith("---", i):
            out.append("—")
            i += 3
            continue
        if math is None and s.startswith("--", i):
            out.append("–")
            i += 2
            continue
        out.append(_esc(c))
        i += 1

    return re.sub(r"\s+", " ", "".join(out)).strip()


# ---------------------------------------------------------------------------
# Legacy-shape builders
# ---------------------------------------------------------------------------
def build_curriculum_legacy(curriculum):
    out = []
    for u in curriculum["units"]:
        modules = []
        for m in u["modules"]:
            entry = {
                "module": f"{m['id']} {m['title']}",
                "videos": [{"title": v["title"], "video_id": v["videoId"]}
                           for v in m["videos"]],
            }
            if m.get("checkpoint"):
                entry["interactive_checkpoint"] = m["checkpoint"]
            if m.get("note"):
                entry["note"] = m["note"]
            modules.append(entry)
        out.append({"unit": u["title"], "description": u["description"],
                    "modules": modules})
    return {"curriculum": out}


def build_quiz_data_legacy(curriculum, units):
    micro = {}
    mastery = {}
    for u in curriculum["units"]:
        n = u["unitNumber"]
        q = units[n]["quizzes"]
        for m in u["modules"]:
            for v in m["videos"]:
                items = q["microPractice"].get(v["videoId"])
                if items:
                    micro[v["videoId"]] = items
        # Phase 2 router contract: mastery banks are keyed by the unit number
        # (stringified object key), not the display title.
        mastery[str(n)] = q["unitMastery"]
    return {"micro_practice": micro, "unit_mastery": mastery}


def build_practice_data_legacy(units):
    out = {}
    for n in sorted(units):
        problems = []
        for p in units[n]["practice"]["problems"]:
            solution = p["solution"]
            if p.get("solutionLabel"):
                solution = p["solutionLabel"] + " " + solution
            problems.append({
                "id": p["id"],
                "problem": web_lower(p["problem"]),
                "solution": web_lower(solution),
            })
        out[n] = {"problems": problems}
    return out


# ---------------------------------------------------------------------------
# Emission
# ---------------------------------------------------------------------------
def js_literal(value, indent=4):
    s = json.dumps(value, ensure_ascii=False, indent=indent)
    # U+2028/2029 are valid JSON but illegal raw in JS string literals.
    return s.replace(" ", "\\u2028").replace(" ", "\\u2029")


def banner(what, schema_version):
    return (f"/* GENERATED from content/ by scripts/compile_web.py — do not hand-edit.\n"
            f"   {what}\n"
            f"   Content API schemaVersion {schema_version}. "
            f"Edit content/ and re-run the compiler. */\n\n")


def compile_all():
    manifest, curriculum, units = load_content()
    sv = manifest["schemaVersion"]

    curriculum_legacy = build_curriculum_legacy(curriculum)
    quiz_data = build_quiz_data_legacy(curriculum, units)
    practice_data = build_practice_data_legacy(units)

    files = {}
    files["curriculum_js"] = (
        banner("Curriculum spine consumed by the router (Pillar 3).", sv)
        + "const CURRICULUM_DATA =\n" + js_literal(curriculum_legacy, indent=2) + ";\n\n"
        + "const CURRICULUM = CURRICULUM_DATA.curriculum;\n\n"
        + "const ALL_MODULES = CURRICULUM.reduce(function (acc, unit) {\n"
        + "    return acc.concat(unit.modules);\n}, []);\n")
    files["quiz_js"] = (
        banner("QUIZ_DATA (micro-practice keyed by video id; unit mastery keyed "
               "by unit number) and PRACTICE_DATA (the practice problem matrix; "
               "problem/solution strings are HTML-ready for innerHTML + KaTeX).", sv)
        + "const QUIZ_DATA = " + js_literal(quiz_data) + ";\n\n"
        + "const PRACTICE_DATA = " + js_literal(practice_data) + ";\n")
    files["curriculum_mirror"] = js_literal(curriculum_legacy, indent=2) + "\n"
    files["quizzes_mirror"] = js_literal(
        {"_doc": ("GENERATED mirror of ode/js/quiz-data.js QUIZ_DATA, compiled "
                  "from content/ by scripts/compile_web.py. Do not hand-edit."),
         **quiz_data}, indent=2) + "\n"
    return files


def node_sanity_check(files):
    """Evaluate the candidate JS exactly as the browser would; assert shape."""
    with tempfile.TemporaryDirectory() as td:
        cur = os.path.join(td, "c.js")
        quiz = os.path.join(td, "q.js")
        for path, key in ((cur, "curriculum_js"), (quiz, "quiz_js")):
            with open(path, "w", encoding="utf-8") as f:
                f.write(files[key])
        check = os.path.join(td, "check.js")
        with open(check, "w", encoding="utf-8") as f:
            f.write(
                'const { readFileSync } = require("node:fs");\n'
                f'const g = new Function(readFileSync({json.dumps(cur)}, "utf-8") + "\\n" +\n'
                f'  readFileSync({json.dumps(quiz)}, "utf-8") +\n'
                '  ";return { CURRICULUM, ALL_MODULES, QUIZ_DATA, PRACTICE_DATA };")();\n'
                'const problems = Object.values(g.PRACTICE_DATA)'
                '.reduce((a, u) => a + u.problems.length, 0);\n'
                'console.log(JSON.stringify({units: g.CURRICULUM.length, '
                'modules: g.ALL_MODULES.length, '
                'micro: Object.keys(g.QUIZ_DATA.micro_practice).length, '
                'mastery: Object.keys(g.QUIZ_DATA.unit_mastery).length, problems}));\n')
        out = subprocess.run(["node", check], check=True, capture_output=True, text=True)
        return json.loads(out.stdout)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="byte-diff candidates against committed targets; write nothing")
    args = ap.parse_args()

    files = compile_all()
    shape = node_sanity_check(files)
    print("candidate globals:", shape)

    if args.check:
        dirty = []
        for key, rel in TARGETS.items():
            path = os.path.join(ROOT, rel)
            current = open(path, encoding="utf-8").read() if os.path.exists(path) else None
            if current != files[key]:
                dirty.append(rel)
        if dirty:
            print("STALE (re-run scripts/compile_web.py):")
            for rel in dirty:
                print("  " + rel)
            return 1
        print("all targets up to date")
        return 0

    for key, rel in TARGETS.items():
        path = os.path.join(ROOT, rel)
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(files[key])
        print("wrote", rel)
    return 0


if __name__ == "__main__":
    sys.exit(main())
