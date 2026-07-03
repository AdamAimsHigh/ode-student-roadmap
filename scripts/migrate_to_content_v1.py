#!/usr/bin/env python3
"""One-time migration: build the canonical content/ tree (Content API v1).

Sources, in order of authority:
  * ode/js/curriculum-data.js + ode/js/quiz-data.js  -- the runtime globals
    (extracted via Node, exactly as the browser evaluates them). Curriculum,
    quizzes, and the unit 1 / unit 12 practice sets migrate from here.
  * scripts/unitN_data.json                          -- rich guide + practice
    content for units 0-11 and 13-18.

Emits content/manifest.json, content/curriculum.json, and
content/units/unit-NN/{guide,practice,quizzes}.json per
docs/content-api/CONTENT_API_SPEC.md.

Lossless macro canon (bijective token maps, inverted by the print adapter):
  \\textcolor{accentorange}{ -> \\highlight{      \\textbf{ -> \\strong{
  \\textcolor{workpurple}{   -> \\work{           (\\emph unchanged)
  \\textcolor{warnred}{      -> \\warn{

Run from the repository root:  python scripts/migrate_to_content_v1.py
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
SCHEMA_VERSION = "1.0.0"

# Units whose guide + practice migrate from scripts/unitN_data.json.
JSON_UNITS = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18]
# Guides recovered from generated artifacts (archival quality).
BACKFILL_GUIDE_UNITS = set(range(0, 10))

MACRO_MAP = [
    ("\\textcolor{accentorange}{", "\\highlight{"),
    ("\\textcolor{workpurple}{", "\\work{"),
    ("\\textcolor{warnred}{", "\\warn{"),
    ("\\textbf{", "\\strong{"),
]
NEW_TOKENS = ("\\highlight{", "\\work{", "\\warn{", "\\strong{")

EXTRACTOR_JS = r"""
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const [repoRoot, outFile] = process.argv.slice(2);
const src = (p) => readFileSync(join(repoRoot, p), "utf-8");
const globals = new Function(
  src("ode/js/curriculum-data.js") + "\n" + src("ode/js/quiz-data.js") +
  "\n;return { CURRICULUM, QUIZ_DATA, PRACTICE_DATA };"
)();
writeFileSync(outFile, JSON.stringify(globals));
"""

# Body whitespace after \quad is preserved verbatim so the print
# reconstruction (content_loader.load_unit_legacy) is byte-exact.
LABEL_RE = re.compile(r"^\\noindent\\textbf\{(Solution[^{}]*)\}\\quad")
BULLET_RE = re.compile(r"^\\textbf\{(.+?)\}\s*---\s*(.*)$", re.S)


def fail(msg: str) -> None:
    raise SystemExit(f"MIGRATION PRECONDITION FAILED: {msg}")


def extract_runtime_globals() -> dict:
    with tempfile.TemporaryDirectory() as td:
        js = os.path.join(td, "extract.js")
        out = os.path.join(td, "globals.json")
        with open(js, "w", encoding="utf-8") as f:
            f.write(EXTRACTOR_JS)
        subprocess.run(["node", js, ROOT, out], check=True)
        with open(out, encoding="utf-8") as f:
            return json.load(f)


def map_macros(s: str) -> str:
    for old, new in MACRO_MAP:
        s = s.replace(old, new)
    return s


def walk_strings(value, fn):
    """Apply fn to every string in a nested JSON structure."""
    if isinstance(value, str):
        return fn(value)
    if isinstance(value, list):
        return [walk_strings(v, fn) for v in value]
    if isinstance(value, dict):
        return {k: walk_strings(v, fn) for k, v in value.items()}
    return value


def write_json(path: str, doc) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write("\n")


# ---------------------------------------------------------------------------
# Transforms
# ---------------------------------------------------------------------------
def migrate_curriculum(curriculum: list) -> dict:
    units = []
    for i, u in enumerate(curriculum):
        if not u["unit"].startswith(f"Unit {i}"):
            fail(f"curriculum unit {i} title does not match index: {u['unit']!r}")
        unmapped = set(u) - {"unit", "description", "modules"}
        if unmapped:
            fail(f"curriculum unit {i} has unmapped keys: {unmapped}")
        modules = []
        for m in u["modules"]:
            mm = re.match(r"^(\d+\.\d+)\s+(.+)$", m["module"])
            if not mm:
                fail(f"module title not '<id> <title>': {m['module']!r}")
            entry = {
                "id": mm.group(1),
                "title": mm.group(2),
                "videos": [{"title": v["title"], "videoId": v["video_id"]}
                           for v in m["videos"]],
            }
            if m.get("interactive_checkpoint"):
                entry["checkpoint"] = m["interactive_checkpoint"]
            if m.get("note"):
                entry["note"] = m["note"]
            unmapped = set(m) - {"module", "videos", "interactive_checkpoint", "note"}
            if unmapped:
                fail(f"curriculum module {entry['id']} has unmapped keys: {unmapped}")
            modules.append(entry)
        units.append({
            "unitNumber": i,
            "title": u["unit"],
            "description": u["description"],
            "modules": modules,
        })
    return {"units": units}


def migrate_quizzes(unit_no: int, title: str, videos: list[str], quiz_data: dict) -> dict:
    micro = {}
    for vid in videos:
        items = quiz_data["micro_practice"].get(vid)
        if items:
            micro[vid] = items
    mastery = quiz_data["unit_mastery"].get(title)
    if mastery is None:
        fail(f"no unit_mastery entry keyed by title {title!r}")
    for item in mastery + [i for v in micro.values() for i in v]:
        n_correct = sum(1 for o in item["answerOptions"] if o.get("correct") is True)
        if n_correct != 1:
            fail(f"quiz item {item['id']} has {n_correct} correct options")
    return {"unitNumber": unit_no, "microPractice": micro,
            "unitMastery": mastery, "retiredIds": []}


def migrate_practice_from_unit_json(unit_no: int, data: dict) -> dict:
    pr = data["practice"]
    problems, solutions = pr["problems"], pr["solutions"]
    if len(problems) != len(solutions):
        fail(f"unit {unit_no}: {len(problems)} problems vs {len(solutions)} solutions")
    out_problems = []
    for i, (p, s) in enumerate(zip(problems, solutions), start=1):
        m = LABEL_RE.match(s)
        if not m:
            fail(f"unit {unit_no} solution {i} has no parseable label: {s[:60]!r}")
        label, body = m.group(1), s[m.end():]
        entry = {
            "id": f"ps_{unit_no}_{i}",
            "problem": map_macros(p),
            "solution": map_macros(body),
        }
        if label != f"Solution {i}.":
            entry["solutionLabel"] = label
        out_problems.append(entry)
    doc = {"unitNumber": unit_no}
    for src_key, dst_key in (("subtitle", "subtitle"), ("intro", "intro")):
        if pr.get(src_key):
            doc[dst_key] = map_macros(pr[src_key])
    if pr.get("takeaway"):
        doc["takeaway"] = walk_strings(pr["takeaway"], map_macros)
    doc["problems"] = out_problems
    return doc


def migrate_practice_from_web_store(unit_no: int, store: dict) -> dict:
    problems = []
    for item in store["problems"]:
        problems.append({"id": item["id"], "problem": item["problem"],
                         "solution": item["solution"]})
    return {"unitNumber": unit_no, "problems": problems}


def migrate_guide(unit_no: int, data: dict) -> dict:
    bullets = []
    for b in data["atAGlance"]["bullets"]:
        m = BULLET_RE.match(b)
        if not m:
            fail(f"unit {unit_no} at-a-glance bullet not '\\textbf{{lead}} --- body': {b[:60]!r}")
        bullets.append({"lead": map_macros(m.group(1)), "body": map_macros(m.group(2))})

    modules = []
    for mod in data["modules"]:
        known = {"id", "title", "topics", "formulas", "methodology", "examples",
                 "concept", "warning", "quiz"}
        extra = set(mod) - known
        if extra:
            fail(f"unit {unit_no} module {mod.get('id')} has unmapped keys: {extra}")
        entry = {"id": mod["id"], "title": map_macros(mod["title"]),
                 "topics": map_macros(mod["topics"])}
        if mod.get("formulas"):
            entry["formulas"] = walk_strings(mod["formulas"], map_macros)
        if mod.get("methodology"):
            entry["methodology"] = walk_strings(mod["methodology"], map_macros)
        if mod.get("examples"):
            ex_known = {"title", "setup", "steps", "result"}
            for ex in mod["examples"]:
                if set(ex) - ex_known:
                    fail(f"unit {unit_no} example has unmapped keys: {set(ex) - ex_known}")
            entry["examples"] = walk_strings(mod["examples"], map_macros)
        if mod.get("concept"):
            entry["concept"] = walk_strings(mod["concept"], map_macros)
        if mod.get("warning"):
            entry["warning"] = walk_strings(mod["warning"], map_macros)
        if mod.get("quiz"):
            entry["flashQuiz"] = walk_strings(mod["quiz"], map_macros)
        modules.append(entry)

    doc = {
        "unitNumber": unit_no,
        # is_rich_source is a renderer directive, not provenance: rich formula
        # bodies / example steps are self-delimited and emitted verbatim.
        **({"richBodies": True} if data.get("is_rich_source") else {}),
        "title": data["title"],
        "subtitle": map_macros(data["subtitle"]),
        "description": map_macros(data["description"]),
        "atAGlance": {
            "title": data["atAGlance"]["title"],
            "summary": map_macros(data["atAGlance"]["summary"]),
            "bullets": bullets,
        },
        "modules": modules,
    }
    cheat = {}
    if data.get("cheatSubtitle"):
        cheat["subtitle"] = map_macros(data["cheatSubtitle"])
    if data.get("cheatTakeaway"):
        cheat["takeaway"] = walk_strings(data["cheatTakeaway"], map_macros)
    if cheat:
        doc["cheat"] = cheat
    # 'unit' heading and 'is_rich_source' are intentionally dropped: the heading
    # is derivable from curriculum.json (equality asserted in main), the flag is
    # superseded by manifest provenance.
    return doc


def main() -> None:
    print("Extracting runtime globals via Node...")
    g = extract_runtime_globals()
    curriculum, quiz_data, practice_data = g["CURRICULUM"], g["QUIZ_DATA"], g["PRACTICE_DATA"]

    if len(curriculum) != 19:
        fail(f"expected 19 units, got {len(curriculum)}")

    unit_jsons = {}
    for n in JSON_UNITS:
        with open(os.path.join(ROOT, "scripts", f"unit{n}_data.json"), encoding="utf-8") as f:
            unit_jsons[n] = json.load(f)

    # Bijectivity precondition: no source string already uses a target token.
    all_src = json.dumps(g) + json.dumps(unit_jsons)
    for tok in NEW_TOKENS:
        if json.dumps(tok)[1:-1] in all_src:
            fail(f"target token {tok!r} already present in sources; macro map not bijective")

    # Mastery keys must equal curriculum titles exactly.
    titles = [u["unit"] for u in curriculum]
    mastery_keys = set(quiz_data["unit_mastery"])
    if mastery_keys != set(titles):
        fail(f"mastery keys != curriculum titles: {mastery_keys ^ set(titles)}")

    # Guide 'unit' headings must match curriculum titles (heading is derived).
    for n, d in unit_jsons.items():
        if d["unit"] != titles[n]:
            fail(f"unit {n} guide heading {d['unit']!r} != curriculum title {titles[n]!r}")
        if d["unitNumber"] != n:
            fail(f"unit {n} guide unitNumber field is {d['unitNumber']}")

    # Every micro-practice key must exist in the curriculum.
    all_videos = {v["video_id"] for u in curriculum for m in u["modules"] for v in m["videos"]}
    orphans = set(quiz_data["micro_practice"]) - all_videos
    if orphans:
        fail(f"micro_practice keys not in curriculum: {orphans}")

    # ---- emit ---------------------------------------------------------------
    write_json(os.path.join(CONTENT, "curriculum.json"), migrate_curriculum(curriculum))

    manifest_units = []
    counts = {"problems": 0, "quiz_items": 0}
    for i, u in enumerate(curriculum):
        slug = f"unit-{i:02d}"
        unit_dir = os.path.join(CONTENT, "units", slug)
        videos = [v["video_id"] for m in u["modules"] for v in m["videos"]]

        qdoc = migrate_quizzes(i, u["unit"], videos, quiz_data)
        write_json(os.path.join(unit_dir, "quizzes.json"), qdoc)
        counts["quiz_items"] += len(qdoc["unitMastery"]) + sum(
            len(v) for v in qdoc["microPractice"].values())

        if i in JSON_UNITS:
            pdoc = migrate_practice_from_unit_json(i, unit_jsons[i])
            practice_prov = "authored"
        else:
            pdoc = migrate_practice_from_web_store(i, practice_data[str(i)])
            practice_prov = "authored" if i == 1 else "backfill"
        write_json(os.path.join(unit_dir, "practice.json"), pdoc)
        counts["problems"] += len(pdoc["problems"])

        status = {"guide": "missing", "practice": "complete", "quizzes": "complete"}
        prov = {"practice": practice_prov, "quizzes": "authored"}
        if i in JSON_UNITS:
            write_json(os.path.join(unit_dir, "guide.json"), migrate_guide(i, unit_jsons[i]))
            status["guide"] = "complete"
            prov["guide"] = "backfill" if i in BACKFILL_GUIDE_UNITS else "authored"
        manifest_units.append({"unitNumber": i, "slug": slug,
                               "status": status, "provenance": prov})

    write_json(os.path.join(CONTENT, "manifest.json"),
               {"schemaVersion": SCHEMA_VERSION, "units": manifest_units})

    print(f"content/ written: 19 units, {counts['problems']} practice problems, "
          f"{counts['quiz_items']} quiz items, "
          f"{sum(1 for m in manifest_units if m['status']['guide'] == 'complete')} guides "
          f"(unit 12 guide intentionally missing).")


if __name__ == "__main__":
    sys.exit(main())
