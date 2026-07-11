#!/usr/bin/env python3
"""Compile canonical content/ into the SPA's embedded data layer.

Targets (all carry a GENERATED banner; never hand-edit them):
  ode/js/curriculum-data.js     const CURRICULUM_DATA / CURRICULUM / ALL_MODULES
  ode/js/readings-data.js       const READINGS_DATA (supplemental readings)
  ode/js/bank/bank-unit-NN.js   one lazy chunk per unit: ODEBank.registerUnit(...)
  ode/data/curriculum.json      legacy-shaped mirror
  ode/data/quizzes.json         legacy-shaped mirror (uncompressed)
  ode/data/readings.json        mirror of READINGS_DATA

Schema v2 restructure (Sprint Rec 2, 2026-07-10): the monolithic
ode/js/quiz-data.js (2.5 MB parsed at boot) is retired. Quiz, practice, and
bank-pool content is emitted as one dictionary-compressed chunk per unit,
lazily injected by ode/js/bank-loader.js via dynamic <script> elements (legal
on file://, unlike fetch). QUIZ_DATA / PRACTICE_DATA keep their exact legacy
shapes; the loader owns the global shells and hydrates them per unit.

Dictionary compression: per chunk, frequent word n-grams across the payload's
string values are hoisted into a dictionary array; occurrences are replaced by
a 3-char code (U+00A4 sentinel + two-char base-62 index). U+00A4 is forbidden
in canonical content (validate_content.py), so codes can never collide.

Router contract (Phase 2, id-keyed + HTML lowering) is unchanged:
  * curriculum modules re-join as "<id> <title>" with video_id /
    interactive_checkpoint field names;
  * QUIZ_DATA.unit_mastery is keyed by the unit number;
  * PRACTICE_DATA strings are HTML-lowered for innerHTML + KaTeX injection.

Modes:
  python scripts/compile_web.py                  compile and write targets
  python scripts/compile_web.py --check          compile, byte-diff against the
                                                 committed targets, write nothing
                                                 (exit 1 on any difference or
                                                 stale generated file)

Run from the repository root. Requires Node on PATH (used to evaluate the
candidate JS through the real ode/js/bank-loader.js exactly as the browser
would, as a post-compile sanity check).
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import subprocess
import sys
import tempfile
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
BANK_DIR = os.path.join("ode", "js", "bank")
BANK_LOADER = os.path.join(ROOT, "ode", "js", "bank-loader.js")
LEGACY_MONOLITH = os.path.join("ode", "js", "quiz-data.js")

STATIC_TARGETS = {
    "curriculum_js": os.path.join("ode", "js", "curriculum-data.js"),
    "readings_js": os.path.join("ode", "js", "readings-data.js"),
    "curriculum_mirror": os.path.join("ode", "data", "curriculum.json"),
    "quizzes_mirror": os.path.join("ode", "data", "quizzes.json"),
    "readings_mirror": os.path.join("ode", "data", "readings.json"),
}

# --- dictionary compression parameters --------------------------------------
DICT_SENTINEL = "¤"
DICT_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
DICT_MAX_ENTRIES = len(DICT_ALPHABET) ** 2  # 3844
CODE_LEN = 3          # sentinel + two base-62 chars
MIN_PHRASE = 9        # shorter phrases cannot beat the code + storage overhead
MAX_PHRASE = 80
MIN_OCCURRENCES = 3
NGRAM_RANGE = range(2, 9)

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
        bank_path = os.path.join(d, "bank.json")
        units[entry["unitNumber"]] = {
            "manifest": entry,
            "practice": load_json(os.path.join(d, "practice.json")),
            "quizzes": load_json(os.path.join(d, "quizzes.json")),
            "readings": load_json(os.path.join(d, "readings.json")),
            "bank": load_json(bank_path) if os.path.exists(bank_path) else None,
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


def build_readings_data(units):
    """Per-unit supplemental readings for the web UI. Planned entries keep
    their title as a text label but drop file/url, so the shell never renders
    a dead link to an unrendered PDF."""
    out = {}
    for n in sorted(units):
        entries = []
        for r in units[n]["readings"]["readings"]:
            e = {"id": r["id"], "kind": r["kind"], "title": r["title"]}
            if r.get("description"):
                e["description"] = r["description"]
            if r.get("status") == "planned":
                e["planned"] = True
            elif r.get("file"):
                e["file"] = r["file"]
            elif r.get("url"):
                e["url"] = r["url"]
            entries.append(e)
        out[str(n)] = entries
    return out


def build_pool_data(units):
    """bank.json items pass through verbatim (quiz strings are never
    web-lowered; the quiz engine renders via textContent + KaTeX). The
    client's bank loader expands parametric templates at hydration time."""
    out = {}
    for n in sorted(units):
        bank = units[n]["bank"]
        if bank and bank.get("items"):
            out[n] = bank["items"]
    return out


# ---------------------------------------------------------------------------
# Dictionary compression (per chunk)
# ---------------------------------------------------------------------------
def collect_strings(value, out):
    if isinstance(value, str):
        out.append(value)
    elif isinstance(value, list):
        for v in value:
            collect_strings(v, out)
    elif isinstance(value, dict):
        for v in value.values():  # keys stay uncompressed by construction
            collect_strings(v, out)


def dict_code(index):
    return DICT_SENTINEL + DICT_ALPHABET[index // 62] + DICT_ALPHABET[index % 62]


def build_dictionary(strings):
    """Frequent word n-grams, greedily selected by realized savings.

    Pass 1 counts candidate phrases (word n-grams with trailing whitespace
    preserved, so replacements re-join exactly). Pass 2 applies the best
    candidates longest-first to a working copy and records how many
    replacements each actually achieved (overlapping candidates steal
    occurrences from each other; only realized replacements count). Pass 3
    keeps the phrases whose realized savings beat their dictionary storage
    cost. Deterministic for a given input, which --check requires."""
    counts = Counter()
    for s in strings:
        if DICT_SENTINEL in s:
            raise SystemExit("canonical string contains the reserved "
                             "dictionary sentinel U+00A4: " + s[:80])
        tokens = re.findall(r"\S+\s*", s)
        for size in NGRAM_RANGE:
            for i in range(len(tokens) - size + 1):
                phrase = "".join(tokens[i:i + size])
                if MIN_PHRASE <= len(phrase) <= MAX_PHRASE:
                    counts[phrase] += 1

    candidates = [(count * (len(p) - CODE_LEN) - (len(p) + 4), p)
                  for p, count in counts.items() if count >= MIN_OCCURRENCES]
    candidates = [c for c in candidates if c[0] > 0]
    candidates.sort(key=lambda t: (-t[0], t[1]))
    trial = [p for _, p in candidates[:DICT_MAX_ENTRIES]]
    trial.sort(key=lambda p: (-len(p), p))  # longest-first application

    working = list(strings)
    realized = Counter()
    for phrase in trial:
        marker = "\x00"
        for i, s in enumerate(working):
            hits = s.count(phrase)
            if hits:
                realized[phrase] += hits
                working[i] = s.replace(phrase, marker)

    kept = [p for p in trial
            if realized[p] * (len(p) - CODE_LEN) > len(p) + 4]
    kept = kept[:DICT_MAX_ENTRIES]
    return kept


def encode_deep(value, codes):
    if isinstance(value, str):
        for phrase, code in codes:
            if phrase in value:
                value = value.replace(phrase, code)
        return value
    if isinstance(value, list):
        return [encode_deep(v, codes) for v in value]
    if isinstance(value, dict):
        return {k: encode_deep(v, codes) for k, v in value.items()}
    return value


def compress_payload(payload):
    strings = []
    collect_strings(payload, strings)
    dictionary = build_dictionary(strings)
    codes = [(phrase, dict_code(i)) for i, phrase in enumerate(dictionary)]
    # Longest-first replacement: dictionary order is already longest-first.
    encoded = encode_deep(payload, codes)
    return dictionary, encoded


# ---------------------------------------------------------------------------
# Emission
# ---------------------------------------------------------------------------
def js_literal(value, indent=4, compact=False):
    if compact:
        s = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    else:
        s = json.dumps(value, ensure_ascii=False, indent=indent)
    # U+2028/2029 are valid JSON but illegal raw in JS string literals.
    # Written as explicit escapes here: a literal U+2028 in this source is
    # invisible in most editors and one lost paste turns it into a space.
    return s.replace(" ", "\\u2028").replace(" ", "\\u2029")


def banner(what, schema_version):
    return (f"/* GENERATED from content/ by scripts/compile_web.py — do not hand-edit.\n"
            f"   {what}\n"
            f"   Content API schemaVersion {schema_version}. "
            f"Edit content/ and re-run the compiler. */\n\n")


def chunk_target(n):
    return os.path.join(BANK_DIR, f"bank-unit-{n:02d}.js")


def build_unit_chunk(n, curriculum_unit, unit, practice_data):
    """One lazy chunk: this unit's micro practice, mastery bank, practice
    problems, and (when bank.json exists) the adaptive pool."""
    q = unit["quizzes"]
    micro = {}
    for m in curriculum_unit["modules"]:
        for v in m["videos"]:
            items = q["microPractice"].get(v["videoId"])
            if items:
                micro[v["videoId"]] = items
    payload = {"micro": micro, "mastery": q["unitMastery"],
               "practice": practice_data[n]}
    bank = unit["bank"]
    if bank and bank.get("items"):
        payload["pool"] = bank["items"]
    return payload


def compile_all():
    manifest, curriculum, units = load_content()
    sv = manifest["schemaVersion"]

    curriculum_legacy = build_curriculum_legacy(curriculum)
    quiz_data = build_quiz_data_legacy(curriculum, units)
    practice_data = build_practice_data_legacy(units)
    readings_data = build_readings_data(units)
    pool_data = build_pool_data(units)

    files = {}
    targets = dict(STATIC_TARGETS)

    files["curriculum_js"] = (
        banner("Curriculum spine consumed by the router (Pillar 3).", sv)
        + "const CURRICULUM_DATA =\n" + js_literal(curriculum_legacy, indent=2) + ";\n\n"
        + "const CURRICULUM = CURRICULUM_DATA.curriculum;\n\n"
        + "const ALL_MODULES = CURRICULUM.reduce(function (acc, unit) {\n"
        + "    return acc.concat(unit.modules);\n}, []);\n")

    files["readings_js"] = (
        banner("READINGS_DATA: supplemental readings per unit (Tectonic LaTeX "
               "PDFs under assets/pdfs/, or absolute https URLs). Entries "
               "flagged planned carry no file: the UI renders a text label, "
               "never a dead link.", sv)
        + "const READINGS_DATA = " + js_literal(readings_data) + ";\n")

    curriculum_by_n = {u["unitNumber"]: u for u in curriculum["units"]}
    for entry in manifest["units"]:
        n = entry["unitNumber"]
        payload = build_unit_chunk(n, curriculum_by_n[n], units[n], practice_data)
        dictionary, encoded = compress_payload(payload)
        chunk = {"v": 2, "d": dictionary, "p": encoded}
        key = f"bank_{n:02d}"
        files[key] = (
            banner(f"Lazy bank chunk for unit {n}: micro practice, unit mastery, "
                   "practice problems, adaptive pool. Dictionary-compressed; "
                   "loaded on demand by ode/js/bank-loader.js via dynamic "
                   "script injection (file://-legal).", sv)
            + f"ODEBank.registerUnit({n}, "
            + js_literal(chunk, compact=True) + ");\n")
        targets[key] = chunk_target(n)

    files["curriculum_mirror"] = js_literal(curriculum_legacy, indent=2) + "\n"
    quiz_mirror = {"_doc": ("GENERATED mirror of the hydrated QUIZ_DATA global "
                            "(uncompressed), compiled from content/ by "
                            "scripts/compile_web.py. Do not hand-edit."),
                   **quiz_data}
    if pool_data:
        quiz_mirror["pool"] = {str(n): items for n, items in pool_data.items()}
    files["quizzes_mirror"] = js_literal(quiz_mirror, indent=2) + "\n"
    files["readings_mirror"] = js_literal(
        {"_doc": ("GENERATED mirror of ode/js/readings-data.js READINGS_DATA, "
                  "compiled from content/ by scripts/compile_web.py. "
                  "Do not hand-edit."),
         **readings_data}, indent=2) + "\n"

    expected = {
        "units": len(curriculum["units"]),
        "micro": len(quiz_data["micro_practice"]),
        "mastery": len(quiz_data["unit_mastery"]),
        "problems": sum(len(practice_data[n]["problems"]) for n in practice_data),
        "pool": sum(len(v) for v in pool_data.values()),
        "readings": len(readings_data),
    }
    return files, targets, expected


def node_sanity_check(files, targets, expected):
    """Evaluate the candidate chunks through the real bank loader exactly as
    the browser would; assert the hydrated globals match the canon."""
    with open(BANK_LOADER, encoding="utf-8") as f:
        loader_src = f.read()
    chunk_keys = sorted(k for k in files if k.startswith("bank_"))
    with tempfile.TemporaryDirectory() as td:
        paths = {}
        for i, key in enumerate(["readings_js"] + chunk_keys):
            p = os.path.join(td, f"s{i}.js")
            with open(p, "w", encoding="utf-8") as f:
                f.write(files[key])
            paths[key] = p
        loader_path = os.path.join(td, "loader.js")
        with open(loader_path, "w", encoding="utf-8") as f:
            f.write(loader_src)
        check = os.path.join(td, "check.js")
        sources = [loader_path, paths["readings_js"]] + [paths[k] for k in chunk_keys]
        with open(check, "w", encoding="utf-8") as f:
            f.write(
                'const { readFileSync } = require("node:fs");\n'
                f'const sources = {json.dumps(sources)};\n'
                'const body = sources.map(p => readFileSync(p, "utf-8")).join("\\n")\n'
                '  + ";return { QUIZ_DATA, PRACTICE_DATA, READINGS_DATA };";\n'
                'const g = new Function(body)();\n'
                'const problems = Object.values(g.PRACTICE_DATA)'
                '.reduce((a, u) => a + u.problems.length, 0);\n'
                'const pool = Object.values(g.QUIZ_DATA.pool)'
                '.reduce((a, items) => a + items.length, 0);\n'
                'let unexpanded = 0;\n'
                'for (const items of Object.values(g.QUIZ_DATA.pool)) {\n'
                '  if (JSON.stringify(items).includes("{{")) unexpanded++;\n'
                '}\n'
                'console.log(JSON.stringify({\n'
                '  micro: Object.keys(g.QUIZ_DATA.micro_practice).length,\n'
                '  mastery: Object.keys(g.QUIZ_DATA.unit_mastery).length,\n'
                '  problems, pool, unexpanded,\n'
                '  readings: Object.keys(g.READINGS_DATA).length\n'
                '}));\n')
        out = subprocess.run(["node", check], capture_output=True, text=True)
        if out.returncode != 0:
            raise SystemExit("sanity check node run FAILED:\n" + out.stderr[-2000:])
        shape = json.loads(out.stdout)

    mismatches = [k for k in ("micro", "mastery", "problems", "pool", "readings")
                  if shape[k] != expected[k]]
    if shape["unexpanded"]:
        mismatches.append("unexpanded-templates")
    if mismatches:
        raise SystemExit(f"sanity check FAILED: {mismatches} "
                         f"(hydrated {shape} vs canon {expected})")
    return shape


def stale_generated(targets):
    """Generated files this compiler owns but no longer emits: retired bank
    chunks (unit removed) and the retired quiz-data.js monolith."""
    emitted = {os.path.normpath(rel) for rel in targets.values()}
    stale = []
    for path in glob.glob(os.path.join(ROOT, BANK_DIR, "bank-unit-*.js")):
        rel = os.path.normpath(os.path.relpath(path, ROOT))
        if rel not in emitted:
            stale.append(rel)
    if os.path.exists(os.path.join(ROOT, LEGACY_MONOLITH)):
        stale.append(LEGACY_MONOLITH)
    return stale


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="byte-diff candidates against committed targets; write nothing")
    args = ap.parse_args()

    files, targets, expected = compile_all()
    shape = node_sanity_check(files, targets, expected)
    print("hydrated globals:", shape)
    stale = stale_generated(targets)

    if args.check:
        dirty = []
        for key, rel in targets.items():
            path = os.path.join(ROOT, rel)
            current = open(path, encoding="utf-8").read() if os.path.exists(path) else None
            if current != files[key]:
                dirty.append(rel)
        dirty.extend(stale)
        if dirty:
            print("STALE (re-run scripts/compile_web.py):")
            for rel in dirty:
                print("  " + rel)
            return 1
        print("all targets up to date")
        return 0

    os.makedirs(os.path.join(ROOT, BANK_DIR), exist_ok=True)
    total = 0
    for key, rel in sorted(targets.items(), key=lambda kv: kv[1]):
        path = os.path.join(ROOT, rel)
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(files[key])
        total += len(files[key].encode("utf-8"))
        print(f"wrote {rel} ({len(files[key].encode('utf-8')):,} bytes)")
    for rel in stale:
        os.remove(os.path.join(ROOT, rel))
        print("removed stale generated file " + rel)
    print(f"total emitted: {total:,} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
