#!/usr/bin/env python3
"""Contextual validator for the canonical content/ tree (Content API v1, spec §8).

Zero-dependency companion to the JSON Schemas in docs/content-api/schema/:
it enforces the rules a schema regex cannot express. Two severities:

  ERROR    breaks a consumer or the canon -> exit 1
  WARNING  style / completeness drift     -> exit 0 (or 1 with --strict)

Copy-rule severity is contextual, matching how each string ships:
  * quiz strings and curriculum titles/descriptions are student-facing UI copy:
    no em dash (U+2014 or ---), no ampersand outside math  -> ERROR
  * practice/guide strings are print-first LaTeX where '---' is the correct
    typographic source form (the web compiler lowers it); only a literal
    U+2014 em dash (should be authored as ---) and prose '&' warn.

Run from the repository root:  python scripts/validate_content.py [--strict]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")

# Commands with no place in canonical strings, by severity. FORBIDDEN always
# errors: presentational commands the semantic macros replace, plus document
# structure. LEGACY_SPACING errors in strict (UI copy) contexts but only warns
# in print-first text, where the backfill era authored spacing into the bodies
# (byte-preserved by the migration; cleanup is Phase 2 content work).
FORBIDDEN_COMMANDS = re.compile(
    r"\\(textcolor|textbf"
    r"|input|include|section|subsection|documentclass|usepackage)\b")
LEGACY_SPACING = re.compile(
    r"\\(textit|underline|noindent|medskip|smallskip|bigskip"
    r"|vspace|hspace|clearpage|phantomsection)\b")

EM_DASH = "—"

ERRORS: list[str] = []
WARNINGS: list[str] = []


def err(msg): ERRORS.append(msg)
def warn(msg): WARNINGS.append(msg)


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def strip_math(s: str) -> str:
    """Remove math spans so prose-only rules do not fire inside math."""
    s = re.sub(r"\$\$.*?\$\$", " ", s, flags=re.S)
    s = re.sub(r"\\\[.*?\\\]", " ", s, flags=re.S)
    s = re.sub(r"(?<!\\)\$.*?(?<!\\)\$", " ", s, flags=re.S)
    s = re.sub(r"\\\(.*?\\\)", " ", s, flags=re.S)
    return s


def check_string(where: str, s: str, strict_copy: bool, math_expr: bool = False):
    # Balance checks apply everywhere. \\[6pt]-style line-break spacing is not
    # a display-math opener, hence the lookbehinds.
    unescaped_dollars = len(re.findall(r"(?<!\\)\$", s))
    if unescaped_dollars % 2 != 0:
        err(f"{where}: odd number of $ delimiters")
    if len(re.findall(r"(?<!\\)\\\[", s)) != len(re.findall(r"(?<!\\)\\\]", s)):
        err(f"{where}: unbalanced \\[ \\]")
    if s.count("{") - s.count("\\{") != s.count("}") - s.count("\\}"):
        err(f"{where}: unbalanced braces")

    m = FORBIDDEN_COMMANDS.search(s)
    if m:
        err(f"{where}: forbidden command \\{m.group(1)} (use semantic macros; "
            "print decoration is the compiler's job)")
    m = LEGACY_SPACING.search(s)
    if m:
        if strict_copy:
            err(f"{where}: print command \\{m.group(1)} in UI copy")
        else:
            warn(f"{where}: legacy print command \\{m.group(1)} authored in body "
                 "(Phase 2 cleanup)")

    if math_expr:
        return  # bare math: no prose rules
    prose = strip_math(s)
    if strict_copy:
        if EM_DASH in prose or "---" in prose:
            err(f"{where}: em dash in UI copy (copy rule: use commas)")
        if "&" in prose:
            err(f"{where}: ampersand in UI copy (copy rule: use 'and')")
        if "\\\\" in prose:
            err(f"{where}: raw \\\\ line break in UI prose")
    else:
        if EM_DASH in prose:
            warn(f"{where}: literal U+2014 em dash (author as --- in print-first text)")
        if "&" in prose:
            warn(f"{where}: ampersand in prose")


def walk(where: str, value, strict_copy: bool, math_expr_keys=frozenset()):
    if isinstance(value, str):
        check_string(where, value, strict_copy)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            walk(f"{where}[{i}]", v, strict_copy, math_expr_keys)
    elif isinstance(value, dict):
        for k, v in value.items():
            if k in math_expr_keys and isinstance(v, (str, list)):
                items = v if isinstance(v, list) else [v]
                for i, s in enumerate(items):
                    if isinstance(s, str):
                        check_string(f"{where}.{k}[{i}]", s, strict_copy, math_expr=True)
            else:
                walk(f"{where}.{k}", v, strict_copy, math_expr_keys)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--strict", action="store_true", help="warnings also fail")
    args = ap.parse_args()

    manifest = load(os.path.join(CONTENT, "manifest.json"))
    curriculum = load(os.path.join(CONTENT, "curriculum.json"))

    # --- curriculum: UI copy, referential base --------------------------------
    all_videos: dict[str, int] = {}
    unit_titles = {}
    for u in curriculum["units"]:
        n = u["unitNumber"]
        unit_titles[n] = u["title"]
        walk(f"curriculum u{n}.description", u["description"], strict_copy=True)
        check_string(f"curriculum u{n}.title", u["title"], strict_copy=True)
        for m in u["modules"]:
            if not m["id"].startswith(f"{n}."):
                err(f"curriculum u{n} module {m['id']}: id does not match unit")
            for v in m["videos"]:
                if v["videoId"] in all_videos:
                    err(f"curriculum: duplicate videoId {v['videoId']}")
                all_videos[v["videoId"]] = n

    seen_ids: set[str] = set()
    for entry in manifest["units"]:
        n, slug = entry["unitNumber"], entry["slug"]
        d = os.path.join(CONTENT, "units", slug)
        if slug != f"unit-{n:02d}":
            err(f"manifest unit {n}: slug {slug} malformed")

        # --- quizzes: strict UI copy, ID discipline ---------------------------
        q = load(os.path.join(d, "quizzes.json"))
        retired = set(q.get("retiredIds", []))
        for vid, items in q["microPractice"].items():
            if all_videos.get(vid) != n:
                err(f"{slug}/quizzes: micro key {vid} not a unit-{n} video")
            if len(items) != 5:
                warn(f"{slug}/quizzes: video {vid} has {len(items)} micro items (target 5)")
            for it in items:
                if not it["id"].startswith(f"mp_{vid}_"):
                    err(f"{slug}/quizzes: item {it['id']} id does not match video {vid}")
        if len(q["unitMastery"]) != 30:
            warn(f"{slug}/quizzes: {len(q['unitMastery'])} mastery items (target 30)")
        for it in q["unitMastery"]:
            if not it["id"].startswith(f"um_{n}_"):
                err(f"{slug}/quizzes: mastery item {it['id']} id does not match unit")
        for it in q["unitMastery"] + [i for v in q["microPractice"].values() for i in v]:
            if it["id"] in seen_ids:
                err(f"{slug}/quizzes: duplicate item id {it['id']}")
            seen_ids.add(it["id"])
            if it["id"] in retired:
                err(f"{slug}/quizzes: item id {it['id']} reuses a retired id")
            n_correct = sum(1 for o in it["answerOptions"] if o.get("correct") is True)
            if n_correct != 1:
                err(f"{slug}/quizzes: item {it['id']} has {n_correct} correct options")
            walk(f"{slug}/quizzes {it['id']}", it, strict_copy=True)

        # --- practice: print-first text, ID discipline ------------------------
        p = load(os.path.join(d, "practice.json"))
        if len(p["problems"]) < 10:
            warn(f"{slug}/practice: only {len(p['problems'])} problems (target 10+)")
        for i, prob in enumerate(p["problems"], start=1):
            if prob["id"] != f"ps_{n}_{i}":
                err(f"{slug}/practice: problem {i} id {prob['id']} out of sequence")
            if prob["id"] in seen_ids:
                err(f"{slug}/practice: duplicate id {prob['id']}")
            seen_ids.add(prob["id"])
            walk(f"{slug}/practice {prob['id']}", prob, strict_copy=False)
        for k in ("subtitle", "intro", "takeaway"):
            if p.get(k):
                walk(f"{slug}/practice.{k}", p[k], strict_copy=False)

        # --- guide: print-first text, bare-math fields ------------------------
        gpath = os.path.join(d, "guide.json")
        if os.path.exists(gpath):
            g = load(gpath)
            math_keys = frozenset() if g.get("richBodies") else frozenset({"body", "steps"})
            for m in g["modules"]:
                if not m["id"].startswith(f"{n}."):
                    err(f"{slug}/guide module {m['id']}: id does not match unit")
                for f in m.get("formulas", []):
                    check_string(f"{slug}/guide {m['id']} formula title", f["title"], False)
                    check_string(f"{slug}/guide {m['id']} formula body", f["body"], False,
                                 math_expr=not g.get("richBodies"))
                for ex in m.get("examples", []):
                    walk(f"{slug}/guide {m['id']} example", ex, strict_copy=False,
                         math_expr_keys=math_keys)
                for k in ("methodology", "concept", "warning", "flashQuiz"):
                    if m.get(k):
                        walk(f"{slug}/guide {m['id']}.{k}", m[k], strict_copy=False)
            for k in ("subtitle", "description", "atAGlance", "cheat"):
                if g.get(k):
                    walk(f"{slug}/guide.{k}", g[k], strict_copy=False)

    print(f"validate_content: {len(ERRORS)} error(s), {len(WARNINGS)} warning(s)")
    for e in ERRORS:
        print("  ERROR   " + e)
    shown = WARNINGS if len(WARNINGS) <= 25 else WARNINGS[:25]
    for w in shown:
        print("  warning " + w)
    if len(WARNINGS) > 25:
        print(f"  ... and {len(WARNINGS) - 25} more warnings")
    return 1 if ERRORS or (args.strict and WARNINGS) else 0


if __name__ == "__main__":
    sys.exit(main())
