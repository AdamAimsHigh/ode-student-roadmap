#!/usr/bin/env python3
"""Compile canonical content/ into the SPA's embedded data layer.

Targets (all carry a GENERATED banner; never hand-edit them):
  ode/js/curriculum-data.js   const CURRICULUM_DATA / CURRICULUM / ALL_MODULES
  ode/js/quiz-data.js         const QUIZ_DATA + const PRACTICE_DATA
  ode/data/curriculum.json    legacy-shaped mirror
  ode/data/quizzes.json       legacy-shaped mirror

Legacy shapes are preserved exactly (Pillar 1 and the router contract):
  * curriculum modules re-join as "<id> <title>" with video_id /
    interactive_checkpoint field names;
  * QUIZ_DATA.unit_mastery is keyed by the exact unit title (until the Phase 2
    router migration);
  * PRACTICE_DATA strings are web-lowered: display delimiters normalized to
    $$, semantic macros unwrapped, print spacing commands stripped, house-style
    dashes, whitespace collapsed (the faithful port of the retired
    build_practice_data.py sanitizer).

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

# Semantic macros unwrapped for the web (Phase 1: drop macro, keep body).
# \emph is deliberately NOT unwrapped, matching the deployed store.
WEB_UNWRAP = ["strong", "highlight", "work", "warn"]


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
# Web lowering (faithful port of the retired build_practice_data.py sanitizer)
# ---------------------------------------------------------------------------
def _unwrap_command(s, cmd, nargs_before=0):
    """Replace \\cmd{...}{BODY} with BODY, brace-balanced."""
    needle = "\\" + cmd
    out = []
    i = 0
    n = len(s)
    while i < n:
        j = s.find(needle, i)
        if j == -1:
            out.append(s[i:])
            break
        after = j + len(needle)
        if after < n and s[after].isalpha():
            out.append(s[i:after])
            i = after
            continue
        out.append(s[i:j])
        k = after
        dropped = 0
        body = None
        while k < n:
            while k < n and s[k] in " \t\n":
                k += 1
            if k >= n or s[k] != "{":
                break
            depth = 0
            start = k
            while k < n:
                c = s[k]
                if c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        k += 1
                        break
                k += 1
            group = s[start + 1:k - 1]
            if dropped < nargs_before:
                dropped += 1
                continue
            body = group
            break
        if body is None:
            out.append(needle)
            i = after
            continue
        out.append(body)
        i = k
    return "".join(out)


def web_lower(s):
    """Lower one canonical MathText string into the web-store dialect."""
    s = s.replace("\\[", "$$").replace("\\]", "$$")
    s = s.replace("\\(", "$").replace("\\)", "$")
    for cmd in WEB_UNWRAP:
        s = _unwrap_command(s, cmd)
    s = re.sub(r"\\(noindent|medskip|smallskip|bigskip|par|clearpage|phantomsection)\b", "", s)
    s = re.sub(r"\\vspace\s*\{[^}]*\}", "", s)
    s = s.replace("---", "—").replace("--", "–")
    s = re.sub(r"\s+", " ", s).strip()
    return s


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
        mastery[u["title"]] = q["unitMastery"]
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
        banner("QUIZ_DATA (micro-practice + unit mastery) and PRACTICE_DATA "
               "(the practice problem matrix).", sv)
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
