#!/usr/bin/env python3
"""Verify the standalone Python handbook against a real Python interpreter.

The TS module contains a JSON literal. Extract only that literal; do not
execute or import arbitrary TypeScript/JavaScript during this check.
"""
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
CONTENT = (ROOT / "src/content/python/topics.ts").read_text(encoding="utf-8")
MATCH = re.search(
    r"export const PYTHON_TOPICS:DocArticle\[\] = (\[[\s\S]*?\]);\s*export const PYTHON_CATEGORIES",
    CONTENT,
)
if not MATCH:
    sys.exit("Could not read the Python handbook data")
topics = json.loads(MATCH.group(1))

# Exact stdout checks for a representative sample, including the formerly
# broken code examples involving literal backslash escape sequences.
EXPECTED = {
    "python-start": "Hello, world!\nWelcome, Taylor",
    "indentation": "Enough supplies\nWe can continue\nThis always runs",
    "ints": "3 1\n42",
    "floats": "10.2\n10.2\nEfficiency: 85%",
    "strings": "Hello, Taylor\nT\n13\nhello",
    "booleans": "False\nTrue\nTrue",
    "lists": "0\nyellow\n4",
    "dicts": "2\n0\napple 2\nbanana 3\norange 4",
    "comparisons": "True\nTrue\nTrue",
    "for-loops": "Color: red\nColor: blue\nColor: green\nIndex: 0\nIndex: 1\nIndex: 2",
    "functions": "11.5",
    "classes": "12",
    "copy-mutation": "['red', 'blue', 'green']\n['red', 'blue']",
    "number-formatting": "3.14\n37.5%\n12,000",
    "regex-module": "['123', '456']\nTrue",
    "string-escapes": "first\nsecond\nShe said \"hello\"\nC:\\new\\folder",
    "testing": "All checks passed",
}

errors = []
seen = set()
if len(topics) < 65:
    errors.append("Expected the full 65-article reference, found " + str(len(topics)))
for topic in topics:
    name = topic["id"]
    if name in seen:
        errors.append(f"{name}: duplicate document ID")
    seen.add(name)
    if topic["scope"] != "python":
        errors.append(f"{name}: not in the Python reference scope")
    if len(topic["body"].strip()) < 180:
        errors.append(f"{name}: body is too short for a usable reference")
    if "Try changing one value in the example" in topic["body"]:
        errors.append(f"{name}: repetitive placeholder advice remains")
    if re.search(r"\b(Code-Empire|First Light|Ada|Bram|Cora|npc_\d+|lumberjack)\b",
                 topic["body"] + topic["tip"] + topic["example"], re.IGNORECASE):
        errors.append(f"{name}: game-specific content in the reusable handbook")

    code = topic["example"]
    if not isinstance(code, str) or not code.strip():
        errors.append(f"{name}: missing code example")
        continue

    try:
        compile(code, f"<handbook:{name}>", "exec")
    except SyntaxError as exc:
        errors.append(f"{name}: SyntaxError line {exc.lineno}: {exc.msg}")
        continue

    try:
        run = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True, text=True, encoding="utf-8",
            timeout=4, check=False,
        )
    except subprocess.TimeoutExpired:
        errors.append(f"{name}: example timed out")
        continue
    if run.returncode != 0:
        errors.append(f"{name}: example failed:\n{run.stderr[-700:]}")
    elif name in EXPECTED and run.stdout.rstrip("\n") != EXPECTED[name]:
        errors.append(
            f"{name}: unexpected output\n"
            f"  expected {EXPECTED[name]!r}\n"
            f"  actual   {run.stdout.rstrip(chr(10))!r}"
        )

if errors:
    print("Python handbook accuracy check FAILED:\n")
    for issue in errors:
        print("- " + issue)
    sys.exit(1)
print(f"Python handbook accuracy check passed: {len(topics)} real Python examples executed; "
      f"{len(EXPECTED)} exact-output expectations verified.")
