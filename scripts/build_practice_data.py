#!/usr/bin/env python3
"""RETIRED (2026-07-03, Content API v1). Superseded by scripts/compile_web.py,
which compiles PRACTICE_DATA (and everything else) from the canonical content/
tree. Its web_clean sanitizer lives on, ported faithfully, as compile_web.web_lower.
Kept for reference only; refuses to run.

Original docstring follows.

Build the web PRACTICE_DATA store for all curriculum units.

Dev-time tool (like render_latex.py). It mines each unit's practice block --
problems + complete solutions -- and sanitizes the PDF-LaTeX into the web-clean
shape the SPA's renderPracticeSetDetail() expects: plain prose with inline
math in $...$ and display math in $$...$$, no document-level commands, no
\\textcolor / \\textbf wrappers, no "Solution N." labels (the <ol> auto-numbers).

Sources:
  - Units 0-11, 13-18: scripts/unitN_data.json -> practice.{problems,solutions}
  - Unit 12 (hand-authored exception, no JSON): ode/assets/markdowns/Unit-12-Practice-Set.tex

The gold-standard Unit 1 entry already in quiz-data.js is preserved verbatim.
Output: rewrites the `const PRACTICE_DATA = { ... };` block in ode/js/quiz-data.js.

Runtime is unaffected: the SPA loads only the generated static JS (file:// safe).
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUIZ_DATA = os.path.join(ROOT, "app", "js", "quiz-data.js")
UNIT12_TEX = os.path.join(ROOT, "app", "assets", "markdowns", "Unit-12-Practice-Set.tex")

# Units sourced from JSON practice blocks. Unit 1 is preserved from quiz-data.js;
# Unit 12 is parsed from its hand-authored .tex.
JSON_UNITS = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18]


def _unwrap_command(s, cmd, nargs_before=0):
    """Replace \\cmd{...}{BODY} with BODY, brace-balanced.

    nargs_before = number of leading brace groups to drop (e.g. the color name
    in \\textcolor{color}{body}). The final group is unwrapped to its contents.
    """
    needle = "\\" + cmd
    out = []
    i = 0
    n = len(s)
    while i < n:
        j = s.find(needle, i)
        if j == -1:
            out.append(s[i:])
            break
        # Ensure it's a real control word boundary (not a longer command).
        after = j + len(needle)
        if after < n and (s[after].isalpha()):
            out.append(s[i:after])
            i = after
            continue
        out.append(s[i:j])
        k = after
        # Skip optional spaces, then consume nargs_before leading {..} groups.
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
            # Malformed; emit the command literally to avoid silent loss.
            out.append(needle)
            i = after
            continue
        out.append(body)
        i = k
    return "".join(out)


def web_clean(s):
    """Sanitize one problem/solution LaTeX string into web-renderable text."""
    # Display / inline math delimiters -> KaTeX auto-render delimiters.
    s = s.replace("\\[", "$$").replace("\\]", "$$")
    s = s.replace("\\(", "$").replace("\\)", "$")
    # Drop the "Solution N." label prefix (the ordered list numbers itself).
    s = re.sub(r"\\noindent\s*\\textbf\s*\{\s*Solution\s*\d+\.?\s*\}\s*\\quad\s*", "", s)
    s = re.sub(r"\\textbf\s*\{\s*Solution\s*\d+\.?\s*\}\s*\\quad\s*", "", s)
    # Strip color wrappers (KaTeX cannot resolve the named palette colors).
    s = _unwrap_command(s, "textcolor", nargs_before=1)
    # Unwrap remaining \textbf{...} (problem-type labels) to plain text.
    s = _unwrap_command(s, "textbf")
    # Remove document-level spacing/structure commands that live outside math.
    s = re.sub(r"\\(noindent|medskip|smallskip|bigskip|par|clearpage|phantomsection)\b", "", s)
    s = re.sub(r"\\vspace\s*\{[^}]*\}", "", s)
    # House-style em/en dashes -> Unicode for clean screen typography.
    s = s.replace("---", "—").replace("--", "–")
    # Collapse all whitespace (incl. newlines inside former \[..\]) to single spaces.
    s = re.sub(r"\s+", " ", s).strip()
    return s


def from_json(unit):
    path = os.path.join(ROOT, "scripts", "unit%d_data.json" % unit)
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    pr = data.get("practice") or {}
    problems = pr.get("problems") or []
    solutions = pr.get("solutions") or []
    if len(problems) != len(solutions):
        raise SystemExit("Unit %d: %d problems vs %d solutions (mismatch)"
                         % (unit, len(problems), len(solutions)))
    items = []
    for idx, (p, sol) in enumerate(zip(problems, solutions), start=1):
        items.append({
            "id": "ps_%d_%d" % (unit, idx),
            "problem": web_clean(p),
            "solution": web_clean(sol),
        })
    return items


def from_unit12_tex():
    with open(UNIT12_TEX, encoding="utf-8") as f:
        tex = f.read()
    # Problems: the Part II enumerate items.
    m = re.search(r"Practice Problems.*?\\begin\{enumerate\}(?:\[[^\]]*\])?(.*?)\\end\{enumerate\}",
                  tex, re.S)
    if not m:
        raise SystemExit("Unit 12: could not locate Part II enumerate")
    body = m.group(1)
    # Split on \item at brace depth 0.
    raw_items = [seg.strip() for seg in re.split(r"\\item\b", body) if seg.strip()]
    problems = [web_clean(seg) for seg in raw_items]
    # Solutions: \textbf{Solution N.} ... up to next \medskip/\begin{conceptbox}/\end{document}.
    sol_blocks = re.findall(
        r"\\noindent\s*\\textbf\{Solution\s*\d+\.?\}.*?(?=\\medskip|\\begin\{conceptbox\}|\\end\{document\})",
        tex, re.S)
    solutions = [web_clean(b) for b in sol_blocks]
    if len(problems) != len(solutions):
        raise SystemExit("Unit 12: %d problems vs %d solutions (mismatch)"
                         % (len(problems), len(solutions)))
    items = []
    for idx, (p, sol) in enumerate(zip(problems, solutions), start=1):
        items.append({"id": "ps_12_%d" % idx, "problem": p, "solution": sol})
    return items


def js_string(s):
    """Encode a Python string as a JS double-quoted literal (preserve \\ for KaTeX)."""
    out = s.replace("\\", "\\\\").replace('"', '\\"')
    return '"' + out + '"'


def render_entry(unit, items):
    lines = ["    %d: {" % unit, "        problems: ["]
    for k, it in enumerate(items):
        comma = "," if k < len(items) - 1 else ""
        lines.append("            {")
        lines.append("                id: %s," % js_string(it["id"]))
        lines.append("                problem: %s," % js_string(it["problem"]))
        lines.append("                solution: %s" % js_string(it["solution"]))
        lines.append("            }%s" % comma)
    lines.append("        ]")
    lines.append("    }")
    return "\n".join(lines)


def extract_unit1_block(src):
    """Return the verbatim '1: { ... }' object literal from the current file."""
    start = src.index("const PRACTICE_DATA")
    key = src.index("\n    1: {", start)
    brace = src.index("{", key)
    depth = 0
    i = brace
    while i < len(src):
        c = src[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
        i += 1
    return "    1: " + src[brace:i + 1]


def main():
    with open(QUIZ_DATA, encoding="utf-8") as f:
        src = f.read()

    entries = {}
    for u in JSON_UNITS:
        entries[u] = from_json(u)
    entries[12] = from_unit12_tex()
    unit1_block = extract_unit1_block(src)

    ordered = []
    for u in range(0, 19):
        if u == 1:
            ordered.append(unit1_block)
        else:
            ordered.append(render_entry(u, entries[u]))
    new_block = "const PRACTICE_DATA = {\n" + ",\n".join(ordered) + "\n};"

    # Replace the existing PRACTICE_DATA = { ... }; block.
    start = src.index("const PRACTICE_DATA = {")
    # Find the matching closing '};' by brace counting from the opening brace.
    brace = src.index("{", start)
    depth = 0
    i = brace
    while i < len(src):
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
            if depth == 0:
                break
        i += 1
    # i points at closing brace; expect ';' next.
    end = i + 1
    while end < len(src) and src[end] in " ;":
        end += 1
        if src[end - 1] == ";":
            break
    new_src = src[:start] + new_block + src[end:]

    with open(QUIZ_DATA, "w", encoding="utf-8") as f:
        f.write(new_src)

    counts = {u: len(entries[u]) for u in entries}
    counts[1] = unit1_block.count('id:')
    print("PRACTICE_DATA rewritten. Problem counts by unit:")
    for u in range(0, 19):
        print("  Unit %2d: %d" % (u, counts[u]))
    print("Total units: %d" % len(range(0, 19)))


if __name__ == "__main__":
    raise SystemExit(
        "RETIRED: build_practice_data.py is superseded by scripts/compile_web.py "
        "(compiles from the canonical content/ tree). See docs/content-api/CONTENT_API_SPEC.md.")
