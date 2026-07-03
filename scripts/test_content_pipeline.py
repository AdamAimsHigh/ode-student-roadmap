#!/usr/bin/env python3
"""Regression lock for the Content API v1 pipeline (run from the repo root).

Three checks, all zero-dependency:
  1. content/ tree structural sanity (counts, ID formats, referential
     integrity essentials -- the deep contextual rules live in
     validate_content.py).
  2. The compiled web targets are up to date (compile_web.py --check).
  3. Print reconstruction fidelity: content_loader.load_unit_legacy() rebuilds
     each retired scripts/unitN_data.json BYTE-EXACTLY (modulo the dropped
     is_rich_source flag). Skipped for units whose legacy file is absent, so
     the suite keeps passing if the archival files are ever removed.

Run:  python scripts/test_content_pipeline.py
"""
from __future__ import annotations

import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import content_loader  # noqa: E402

FAILURES = []


def check(label: str, ok: bool, detail: str = "") -> None:
    print(("PASS " if ok else "FAIL ") + label + (f" -- {detail}" if detail and not ok else ""))
    if not ok:
        FAILURES.append(label)


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def diff_paths(a, b, path="$", out=None):
    out = out if out is not None else []
    if type(a) is not type(b):
        out.append(f"{path}: type {type(a).__name__} vs {type(b).__name__}")
    elif isinstance(a, dict):
        for k in a.keys() | b.keys():
            # Falsy-valued keys (legacy null/[] placeholders, loader [] defaults)
            # may exist on either side only: render_latex.py's emission treats
            # absent and empty identically for every optional block.
            if k not in a:
                if b[k]:
                    out.append(f"{path}.{k}: only in reconstruction")
            elif k not in b:
                if a[k]:
                    out.append(f"{path}.{k}: missing from reconstruction")
            else:
                diff_paths(a[k], b[k], f"{path}.{k}", out)
    elif isinstance(a, list):
        if len(a) != len(b):
            out.append(f"{path}: length {len(a)} vs {len(b)}")
        else:
            for i, (x, y) in enumerate(zip(a, b)):
                diff_paths(x, y, f"{path}[{i}]", out)
    elif a != b:
        out.append(f"{path}: {str(a)[:60]!r} != {str(b)[:60]!r}")
    return out


def main() -> int:
    # ---- 1. structural sanity ------------------------------------------------
    manifest = load(os.path.join(ROOT, "content", "manifest.json"))
    curriculum = load(os.path.join(ROOT, "content", "curriculum.json"))
    check("manifest lists 19 units", len(manifest["units"]) == 19)
    check("curriculum has 19 units", len(curriculum["units"]) == 19)

    all_videos = {v["videoId"] for u in curriculum["units"]
                  for m in u["modules"] for v in m["videos"]}
    problems = 0
    quiz_items = 0
    for entry in manifest["units"]:
        n, slug = entry["unitNumber"], entry["slug"]
        d = os.path.join(ROOT, "content", "units", slug)
        practice = load(os.path.join(d, "practice.json"))
        quizzes = load(os.path.join(d, "quizzes.json"))
        check(f"{slug} unitNumber fields agree",
              practice["unitNumber"] == n and quizzes["unitNumber"] == n)
        for p in practice["problems"]:
            problems += 1
            if not p["id"].startswith(f"ps_{n}_"):
                check(f"{slug} practice id {p['id']} location", False)
        for vid, items in quizzes["microPractice"].items():
            quiz_items += len(items)
            if vid not in all_videos:
                check(f"{slug} micro key {vid} exists in curriculum", False)
        quiz_items += len(quizzes["unitMastery"])
        for item in quizzes["unitMastery"] + [i for v in quizzes["microPractice"].values() for i in v]:
            n_correct = sum(1 for o in item["answerOptions"] if o.get("correct") is True)
            if n_correct != 1:
                check(f"{item['id']} exactly one correct option", False)
        guide_status = entry["status"]["guide"]
        check(f"{slug} guide status matches file",
              (guide_status == "complete") == os.path.exists(os.path.join(d, "guide.json")))
    check("193 practice problems", problems == 193, str(problems))
    check("1820 quiz items", quiz_items == 1820, str(quiz_items))

    # ---- 2. compiled web targets fresh ----------------------------------------
    r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "compile_web.py"),
                        "--check"], capture_output=True, text=True)
    check("compile_web.py --check", r.returncode == 0, r.stdout.strip()[-200:])

    # ---- 3. byte-exact print reconstruction ------------------------------------
    tested = 0
    for entry in manifest["units"]:
        n = entry["unitNumber"]
        legacy_path = os.path.join(ROOT, "scripts", f"unit{n}_data.json")
        if entry["status"]["guide"] != "complete" or not os.path.exists(legacy_path):
            continue
        legacy = load(legacy_path)
        rebuilt = content_loader.load_unit_legacy(n)
        diffs = diff_paths(legacy, rebuilt)
        check(f"unit {n} print reconstruction byte-exact", not diffs,
              "; ".join(diffs[:3]))
        tested += 1
    check("reconstruction tested for all complete guides", tested == sum(
        1 for e in manifest["units"] if e["status"]["guide"] == "complete"))

    print(f"\n{'ALL CHECKS PASSED' if not FAILURES else f'{len(FAILURES)} CHECK(S) FAILED'}")
    return 1 if FAILURES else 0


if __name__ == "__main__":
    sys.exit(main())
