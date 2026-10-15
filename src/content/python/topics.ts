import type {DocArticle} from '../../platform/documentation/types';
export const PYTHON_TOPICS:DocArticle[] = [
  {
    "id": "python-start",
    "scope": "python",
    "category": "Getting Started",
    "title": "How Python runs",
    "summary": "Read code from top to bottom and use indentation to group instructions.",
    "body": "Python executes top-level statements in order, normally from top to bottom. Defining a [[function|python:functions]] stores it for later; its indented body does not run until the function is called. You can assign [[variables|python:variables]], call functions, and import [[modules|python:modules]]. A function call runs that function's body before execution returns to the next statement.\n\nWhitespace is meaningful: a colon begins many compound statements, and [[indentation|python:indentation]] identifies the instructions belonging to each block. Python is case-sensitive, so a name spelled `Name` differs from `name`.",
    "example": "message = \"Hello, world!\"\nprint(message)\n\ndef greet(name):\n    print(\"Welcome,\", name)\n\ngreet(\"Taylor\")",
    "tip": "Indent blocks with four spaces. Python is case-sensitive: Name and name are different.",
    "related": [
      {
        "scope": "python",
        "id": "indentation",
        "label": "Indentation and code blocks"
      },
      {
        "scope": "python",
        "id": "variables",
        "label": "Variables and assignment"
      },
      {
        "scope": "python",
        "id": "printing",
        "label": "print() and output"
      },
      {
        "scope": "python",
        "id": "types",
        "label": "Understanding types"
      }
    ]
  },
  {
    "id": "comments",
    "scope": "python",
    "category": "Getting Started",
    "title": "Comments and docstrings",
    "summary": "Explain the intention of your code without changing what it does.",
    "body": "A comment starts with `#` outside of a quoted [[string|python:strings]]. Python ignores it when executing the program. A useful comment explains *why* a decision was made, not just what an obvious line does. You can put a comment on its own line or after a statement.\n\nA **docstring** is a string literal placed first in a module, [[function|python:functions]], or class body. It documents that object and can be accessed through `.__doc__`. Triple quotes are common because they allow multiple lines. A triple-quoted string anywhere else is just an ordinary string expression.",
    "example": "# Explain why a calculation is needed\nMINIMUM_SCORE = 70\n\ndef passed(score):\n    \"\"\"Return True when the score meets the requirement.\"\"\"\n    return score >= MINIMUM_SCORE\n\nprint(passed(85))",
    "tip": "A triple-quoted string is still a string; it becomes a docstring in the appropriate location.",
    "related": []
  },
  {
    "id": "variables",
    "scope": "python",
    "category": "Getting Started",
    "title": "Variables and assignment",
    "summary": "Give values readable names and update them as a program runs.",
    "body": "A variable is a name bound to a Python object. The single equals sign `=` **assigns** a value; double equals `==` [[compares|python:comparisons]] two values. Reassignment changes what the name refers to, and does not necessarily change an existing object. Python determines each object's [[type|python:types]] at runtime, so you don't have to declare it first.\n\nChoose meaningful names such as `item_count`. Use lowercase names separated by underscores (`snake_case`) for ordinary variables and functions. Names cannot begin with a digit, and keywords such as `for` cannot be used as variable names. Python treats uppercase and lowercase names differently.",
    "example": "count = 12\nadded = 5\ncount = count + added\n\nmessage = \"Hello, world!\"\nprint(message, count)",
    "tip": "= changes a variable. == asks whether two values are equal.",
    "related": []
  },
  {
    "id": "printing",
    "scope": "python",
    "category": "Getting Started",
    "title": "print() and output",
    "summary": "Inspect values, understand a program, and display debugging messages.",
    "body": "`print()` displays readable text on the program's standard output, normally a terminal or editor console. Separate values with commas to display them together; by default, Python inserts a space. Use the `sep` and `end` keyword arguments to change those separators.\n\n`print()` is useful for inspecting a program while learning or debugging. It does not *return* the printed value: its return value is [[None|python:none]]. For polished messages and numbers, see [[f-strings|python:fstrings]] and [[string formatting|python:number-formatting]].",
    "example": "name = \"Taylor\"\nscore = 34\nprint(\"Name:\", name)\nprint(f\"{name} scored {score} points\")",
    "tip": "print() produces output and returns None; use return to produce a value other code can use.",
    "related": []
  },
  {
    "id": "indentation",
    "scope": "python",
    "category": "Getting Started",
    "title": "Indentation and code blocks",
    "summary": "Python uses whitespace to decide which statements belong together.",
    "body": "Python groups statements using **indentation**, not braces. Lines indented equally belong to the same block; a line indented further belongs to a nested block. Blocks after `if`, `for`, `while`, `def`, `class`, and similar statements begin after a colon (`:`). When indentation decreases, that block has ended. See [[conditions|python:if-elif]] and [[functions|python:functions]].\n\n**In this editor, press Tab to insert four spaces**, and Shift+Tab to unindent. You don't need to press the spacebar four times. Python also supports literal tab characters, but those are different from spaces: using them inconsistently can raise `TabError` or cause confusing nesting. PEP 8 recommends **four spaces per level**, with spaces preferred over literal tabs. Blank lines can be used for readability; they do not close a block.",
    "example": "amount = 8\nif amount >= 5:\n    print(\"Enough supplies\")\n    print(\"We can continue\")\nprint(\"This always runs\")",
    "tip": "Tab inserts four spaces in this editor. Avoid mixing literal tabs with spaces in indentation.",
    "related": [
      {
        "scope": "python",
        "id": "indentation-style",
        "label": "Tabs and spaces"
      },
      {
        "scope": "python",
        "id": "if-elif",
        "label": "if / elif / else"
      },
      {
        "scope": "python",
        "id": "functions",
        "label": "Defining functions"
      }
    ]
  },
  {
    "id": "types",
    "scope": "python",
    "category": "Getting Started",
    "title": "Understanding types",
    "summary": "Know what kind of data you are working with.",
    "body": "Every Python object has a type that determines what it represents and which operations it supports. Common types are [[int|python:ints]] (whole numbers), [[float|python:floats]] (floating-point numbers), [[str|python:strings]] (text), [[bool|python:booleans]] (True/False), [[list|python:lists]] (editable sequences), [[dict|python:dicts]] (key/value mappings), [[tuple|python:tuples]] (fixed sequences), and [[set|python:sets]] (unique elements). `None` has type `NoneType`.\n\n`type(value)` reports the exact type. `isinstance(value, SomeType)` checks whether an object is an instance of a type *or its subclasses*; it is generally better for flexible type checks. Python is dynamically typed: a variable can later refer to an object of a different type, although such changes can make code harder to follow.",
    "example": "values = [7, 3.5, \"hello\", True, None]\nfor value in values:\n    print(repr(value), type(value).__name__)",
    "tip": "Strings and numbers are different. '7' + 3 raises TypeError; convert explicitly.",
    "related": [
      {
        "scope": "python",
        "id": "ints",
        "label": "Integers · int"
      },
      {
        "scope": "python",
        "id": "floats",
        "label": "Decimals · float"
      },
      {
        "scope": "python",
        "id": "strings",
        "label": "Text · str"
      },
      {
        "scope": "python",
        "id": "booleans",
        "label": "True and False · bool"
      },
      {
        "scope": "python",
        "id": "none",
        "label": "Missing values · None"
      },
      {
        "scope": "python",
        "id": "lists",
        "label": "Lists · list (Python's everyday array)"
      }
    ]
  },
  {
    "id": "ints",
    "scope": "python",
    "category": "Data Types",
    "title": "Integers · int",
    "summary": "Whole numbers such as worker counts, stockpiles, and map coordinates.",
    "body": "An [[integer|python:ints]] (`int`) represents a whole number, including zero and negatives. Python integers have arbitrary precision, limited mainly by available memory. Use `+`, `-`, `*`, and `**` for arithmetic, `//` for floor division, and `%` for the remainder. See [[operators|python:operators]].\n\nThe `/` operator returns a [[float|python:floats]] even when dividing two integers evenly, while `//` rounds its quotient **toward negative infinity**: `-7 // 3` is `-3`. `int(\"42\")` converts valid numeric text; `int(3.9)` discards the fractional part **toward zero**, not toward negative infinity.",
    "example": "items = 15\nboxes = (items + 6) // 7\nremainder = items % 7\nprint(boxes, remainder)\nprint(int(\"42\"))",
    "tip": "-7 // 3 is -3, but int(-7 / 3) is -2: floor division and truncation are different.",
    "related": [
      {
        "scope": "python",
        "id": "floats",
        "label": "Decimals · float"
      },
      {
        "scope": "python",
        "id": "number-formatting",
        "label": "Formatting numbers"
      },
      {
        "scope": "python",
        "id": "operators",
        "label": "Arithmetic operators"
      }
    ]
  },
  {
    "id": "floats",
    "scope": "python",
    "category": "Data Types",
    "title": "Decimals · float",
    "summary": "Represent measurements, probabilities, ratios, and non-integer values.",
    "body": "A `float` represents a floating-point number, typically stored using binary double precision. It's suitable for measurements and approximate calculations. Because many decimal fractions cannot be represented exactly in binary, `0.1 + 0.2` isn't precisely `0.3`. Use [[formatting|python:number-formatting]] to display a desired number of decimal places.\n\n`round(value, digits)` computes a **new rounded value**; it doesn't mutate the original number. Rounding still uses approximate floating-point inputs and is not a general solution to precision-sensitive money calculations. For numeric comparisons with rounding errors, consider `math.isclose()`. See [[the math module|python:math-module]].",
    "example": "efficiency = 0.85\noutput = 12 * efficiency\nprint(output)\nprint(round(output, 1))\nprint(f\"Efficiency: {efficiency:.0%}\")",
    "tip": "For approximate floats, use math.isclose(a, b) rather than == when a tolerance makes sense.",
    "related": []
  },
  {
    "id": "strings",
    "scope": "python",
    "category": "Data Types",
    "title": "Text · str",
    "summary": "Names, labels, messages, and any textual data.",
    "body": "A [[string|python:strings]] (`str`) contains Unicode text, written in single quotes (`'hello'`) or double quotes (`\"hello\"`). You can join strings using `+`, repeat using `*`, and examine characters using [[indexing and slicing|python:index-slice]]. Strings are **immutable**: calling a text method produces a new string rather than modifying the original.\n\n`len(text)` counts Unicode code points, which isn't always the number of user-perceived characters (some symbols use several code points). String indices begin at zero. Use `str(number)` to turn a number into text; writing `\"5\" + 3` raises a `TypeError`. For including variables directly, see [[f-strings|python:fstrings]].",
    "example": "name = \"Taylor\"\nmessage = \"Hello, \" + name\nprint(message)\nprint(name[0])\nprint(len(message))\nprint(\"HELLO\".lower())",
    "tip": "len() counts Unicode code points, not necessarily visual glyphs.",
    "related": []
  },
  {
    "id": "fstrings",
    "scope": "python",
    "category": "Data Types",
    "title": "Formatted strings · f-strings",
    "summary": "Put variable values and formatted numbers directly into messages.",
    "body": "An **f-string** is a string literal prefixed with `f`, such as `f\"Hello, {name}\"`. Python evaluates the expressions inside `{...}` when building the resulting [[string|python:strings]], making them handy for messages, logging, and display.\n\nA colon inside the braces introduces a formatting specification: `{value:.2f}` displays two decimals, `{value:,}` uses thousands separators, and `{ratio:.1%}` displays a percentage. See [[number formatting|python:number-formatting]]. To include a literal brace, double it: `{{` or `}}`.",
    "example": "name = \"Taylor\"\nnumber = 12345\ndecimal = 0.876\nprint(f\"{name} has {number:,} points\")\nprint(f\"Progress: {decimal:.1%}\")",
    "tip": "Use double braces {{ and }} if you need literal braces in an f-string.",
    "related": []
  },
  {
    "id": "booleans",
    "scope": "python",
    "category": "Data Types",
    "title": "True and False · bool",
    "summary": "Represent yes/no conditions and determine branches of logic.",
    "body": "A `bool` has exactly two values, `True` and `False` (capital letters matter). [[Comparisons|python:comparisons]] such as `5 > 3` produce booleans. Use `not` to reverse a truth value; `and` and `or` combine conditions using short-circuit evaluation, so the right side may not be evaluated at all.\n\nAn important distinction: `and` and `or` **return one of their operands**, not always a bool; for instance `\"\" or \"fallback\"` returns the string `\"fallback\"`. See [[truthiness|python:truthiness]] for how numbers, strings, and collections behave in a condition. `bool` is also a subclass of `int`, but using booleans as ordinary numbers usually harms readability.",
    "example": "is_sunny = True\nis_warm = False\nnice_day = is_sunny and is_warm\nprint(nice_day)\nprint(not nice_day)\nprint(9 > 4)",
    "tip": "and/or may return a string, number, or list; not always True or False.",
    "related": []
  },
  {
    "id": "none",
    "scope": "python",
    "category": "Data Types",
    "title": "Missing values · None",
    "summary": "Represent the absence of a value, result, or entity.",
    "body": "`None` is Python's singleton value for **no value** or an absent result. It is different from the number `0`, an empty [[list|python:lists]], or `False`. A [[function|python:functions]] without an explicit return value returns `None`, as does a function using `return` alone.\n\nUse `value is None` or `value is not None` to check for it. These are [[identity|python:identity]] checks; avoid `value == None` for this purpose. Don't interpret every `None` as an error—many functions intentionally return it to indicate that there is nothing to return.",
    "example": "value = None\nif value is None:\n    print(\"Nothing has been assigned yet\")",
    "tip": "None is different from 0, False, '', and an empty list.",
    "related": []
  },
  {
    "id": "converting",
    "scope": "python",
    "category": "Data Types",
    "title": "Conversions and input types",
    "summary": "Convert between text, whole numbers, decimals, and booleans.",
    "body": "Python does not freely combine incompatible data types. `int(\"12\")` parses integer text, `float(\"4.5\")` parses decimal text, and `str(12)` converts a number into its printable form. `list(iterable)`, `tuple(iterable)`, and `set(iterable)` make corresponding [[collections|python:lists]].\n\nConversion isn't always possible. `int(\"twelve\")` raises a `ValueError`; `int(3.9)` truncates rather than rounds. Be especially careful with `bool()`: `bool(\"False\")` is `True`, because **any non-empty string is truthy**. Parse textual yes/no values explicitly. See [[exceptions|python:errors]] and [[truthiness|python:truthiness]].",
    "example": "number = int(\"16\")\ndistance = float(\"4.5\")\nmessage = \"Count: \" + str(number)\nprint(number + 4)\nprint(distance, message)",
    "tip": "bool('False') is True because the string is not empty. Parse text explicitly.",
    "related": []
  },
  {
    "id": "lists",
    "scope": "python",
    "category": "Collections",
    "title": "Lists · list (Python's everyday array)",
    "summary": "Store an ordered, editable collection of workers, IDs, or resources.",
    "body": "A `list` is Python's common general-purpose **array-like collection**. It is ordered, mutable, and can contain repeated or mixed values, such as [[integers|python:ints]] and [[strings|python:strings]]. Lists use square brackets. `numbers[0]` gets the first element, `numbers[-1]` the last, and `len(numbers)` the number of elements. Their order remains stable unless you change it.\n\n`append(value)` adds one element; `extend(iterable)` adds each element from another iterable. `pop()` removes and returns the last item. You can replace an element with `colors[0] = \"purple\"`. The slice `colors[1:3]` gives elements at indices 1 and 2. See [[slicing|python:index-slice]] and [[list methods|python:list-methods]]. Choose a [[tuple|python:tuples]] for a sequence that should not be reassigned and a [[dictionary|python:dicts]] for named keys.",
    "example": "numbers = [0, 1, 2, 3]\ncolors = [\"red\", \"blue\", \"green\"]\ncolors.append(\"yellow\")\nprint(numbers[0])\nprint(colors[-1])\nprint(len(colors))",
    "tip": "The first element has index 0. Accessing an index that doesn't exist raises IndexError.",
    "related": [
      {
        "scope": "python",
        "id": "ints",
        "label": "Integers · int"
      },
      {
        "scope": "python",
        "id": "strings",
        "label": "Text · str"
      },
      {
        "scope": "python",
        "id": "tuples",
        "label": "Tuples · tuple"
      },
      {
        "scope": "python",
        "id": "dicts",
        "label": "Dictionaries · dict"
      },
      {
        "scope": "python",
        "id": "index-slice",
        "label": "Indexing and slicing"
      },
      {
        "scope": "python",
        "id": "list-methods",
        "label": "Useful list methods"
      }
    ]
  },
  {
    "id": "tuples",
    "scope": "python",
    "category": "Collections",
    "title": "Tuples · tuple",
    "summary": "Store an ordered group of values that shouldn't be reassigned.",
    "body": "A `tuple` is an ordered, **immutable** sequence: its element positions cannot be replaced, added, or removed. Common uses include fixed coordinates and grouped [[return values|python:return]]. Parentheses are conventional, but commas actually make a tuple: `pair = 1, 2` works, and a one-element tuple must include a comma: `(5,)`.\n\nTuples can contain mutable objects, such as [[lists|python:lists]]. You cannot replace a list stored inside a tuple, but you can still modify that list. Tuples support indexing, slicing, unpacking, and iteration. See [[mutability|python:copy-mutation]] and [[unpacking|python:unpacking]].",
    "example": "position = (4, 7)\nx, y = position\nprint(f\"Coordinates: {x}, {y}\")\n\nresult = (\"success\", 12)\nstatus, count = result",
    "tip": "A one-element tuple needs a trailing comma: (5,), not (5).",
    "related": []
  },
  {
    "id": "dicts",
    "scope": "python",
    "category": "Collections",
    "title": "Dictionaries · dict",
    "summary": "Associate keys with values, such as worker assignments or stock counts.",
    "body": "A `dict` stores **key → value** associations. Keys must be hashable (for example, [[strings|python:strings]], [[integers|python:ints]], or tuples containing only hashable elements); values can be any objects. Dictionaries preserve insertion order in modern Python. Define one with `{\"red\": 1}`, access a known key with `data[\"red\"]`, or assign one with `data[\"blue\"] = 2`.\n\nReading a missing key with square brackets raises `KeyError`. Use `data.get(\"missing\", default)` when absence is expected. Loop with `for key, value in data.items():` to inspect both names and values. See [[dictionary methods|python:dictionary-methods]], [[sets|python:sets]], and [[unpacking|python:unpacking]].",
    "example": "prices = {\"apple\": 2, \"banana\": 3}\nprices[\"orange\"] = 4\nprint(prices[\"apple\"])\nprint(prices.get(\"pear\", 0))\nfor name, price in prices.items():\n    print(name, price)",
    "tip": "Keys must be hashable; dictionaries preserve insertion order.",
    "related": [
      {
        "scope": "python",
        "id": "lists",
        "label": "Lists · list (Python's everyday array)"
      },
      {
        "scope": "python",
        "id": "dictionary-methods",
        "label": "Dictionary methods"
      },
      {
        "scope": "python",
        "id": "sets",
        "label": "Sets · set"
      }
    ]
  },
  {
    "id": "sets",
    "scope": "python",
    "category": "Collections",
    "title": "Sets · set",
    "summary": "Keep unique items and compare groups efficiently.",
    "body": "A `set` is a mutable collection of **unique hashable elements**. Sets are useful for membership tests, deduplication, and mathematical operations such as union (`|`), intersection (`&`), and difference (`-`). Unlike [[lists|python:lists]], sets are **unordered**: you shouldn't assume a consistent printing or iteration order, and they cannot be accessed by numeric index.\n\nUse `set()` for an empty set, because `{}` creates an empty [[dictionary|python:dicts]]. You can add a hashable element with `.add()`, and remove one with `.discard()` without an error if it is missing. Lists cannot be placed inside sets because lists aren't hashable.",
    "example": "first = {\"red\", \"blue\"}\nsecond = {\"blue\", \"green\"}\nprint(first | second)\nprint(first & second)\nprint(first - second)\nfirst.add(\"yellow\")",
    "tip": "Never write code that relies on the order of elements returned by a set.",
    "related": []
  },
  {
    "id": "index-slice",
    "scope": "python",
    "category": "Collections",
    "title": "Indexing and slicing",
    "summary": "Take an item or subset from strings, lists, and tuples.",
    "body": "Most Python sequences use **zero-based indexing**. The first element is `items[0]`; the last is `items[-1]`. Accessing a nonexistent individual index raises `IndexError`. The slice syntax `items[start:stop:step]` selects a portion: `start` is included and `stop` is excluded. Omitting either end selects from that boundary.\n\nSlices work with [[lists|python:lists]], [[strings|python:strings]], and [[tuples|python:tuples]]. For example, `colors[1:3]` selects indices 1 and 2; `colors[::-1]` builds a reversed sequence. A slice outside the valid bounds is usually clipped rather than raising an error. See [[sequence unpacking|python:unpacking]].",
    "example": "colors = [\"red\", \"blue\", \"green\", \"yellow\"]\nprint(colors[0])\nprint(colors[-1])\nprint(colors[1:3])\nprint(colors[:2])\nprint(colors[::-1])",
    "tip": "colors[1:3] selects positions 1 and 2; slicing an out-of-range end is safe.",
    "related": []
  },
  {
    "id": "list-methods",
    "scope": "python",
    "category": "Collections",
    "title": "Useful list methods",
    "summary": "Add, remove, find and reorder collection items.",
    "body": "[[append|python:lists]] adds one item; extend adds all items from another [[iterable|python:iterators]]. pop removes and returns an item; remove deletes a matching value. [[sorted()|python:sorting]] returns a new list, while .sort() modifies the original list and returns None.",
    "example": "colors = [\"blue\", \"red\"]\ncolors.append(\"green\")\ncolors.extend([\"yellow\", \"purple\"])\nprint(sorted(colors))\nprint(colors.pop())\nprint(colors.index(\"red\"))",
    "tip": "Avoid changing a list while directly looping over it; build a new list or loop over a copy.",
    "related": []
  },
  {
    "id": "comprehensions",
    "scope": "python",
    "category": "Collections",
    "title": "List and dict comprehensions",
    "summary": "Build collections from existing data with compact expressions.",
    "body": "A comprehension constructs a collection by [[iterating|python:for-loops]] and optionally [[filtering|python:if-elif]]. They're especially handy for finding available items or building lookup maps. Prefer a normal loop when the comprehension becomes hard to read.",
    "example": "numbers = [1, 2, 3, 4, 5, 6]\neven_squares = [n * n for n in numbers if n % 2 == 0]\nprint(even_squares)",
    "tip": "Readability wins: split complex nested comprehensions into smaller steps.",
    "related": []
  },
  {
    "id": "comparisons",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "Comparisons and logic",
    "summary": "Make decisions from conditions, thresholds, and membership checks.",
    "body": "Comparison operators include `==` (equal), `!=` (not equal), `<`, `<=`, `>`, and `>=`. Use `in` or `not in` for membership testing—for example, `\"red\" in colors`. These are different from the logical operators `and`, `or`, and `not`, which combine conditions. See [[booleans|python:booleans]].\n\nPython supports **chained comparisons**: `0 <= score < 100` checks both comparisons and evaluates the middle expression only once. `==` compares values; `is` tests whether two names refer to the same object. See [[identity|python:identity]].",
    "example": "number = 18\nminimum = 10\nmaximum = 30\nprint(minimum <= number < maximum)\nprint(number > 0 and number < 20)\nprint(\"red\" in [\"red\", \"blue\"])",
    "tip": "Use == for equality and is for identity, especially is None.",
    "related": []
  },
  {
    "id": "if-elif",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "if / elif / else",
    "summary": "Choose different actions depending on the current state.",
    "body": "An `if` statement chooses which indented block to run. If its condition is truthy, Python executes that block and skips the alternatives. Otherwise it checks each optional `elif` in order, then runs `else` if none match. Only **one branch** in the chain executes. Each branch begins with a colon (`:`) and an [[indented|python:indentation]] block.\n\nConditions often use [[comparisons|python:comparisons]], but any value with a truth value can be tested. For example, `if items:` runs when a list isn't empty; see [[truthiness|python:truthiness]]. Nested conditions are allowed, but clear branches are often easier to read.",
    "example": "temperature = 18\nif temperature < 10:\n    print(\"Cold\")\nelif temperature < 25:\n    print(\"Mild\")\nelse:\n    print(\"Warm\")",
    "tip": "Only the first matching branch runs.",
    "related": []
  },
  {
    "id": "for-loops",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "for loops",
    "summary": "Process every item in a collection without repeating instructions.",
    "body": "A `for` loop visits items from an **iterable** one by one. Common iterables include [[lists|python:lists]], [[strings|python:strings]], [[tuples|python:tuples]], and `range()`. The indented body runs once for each element, with the loop variable bound to that element. You don't need a manual counter for ordinary collection iteration.\n\n`range(3)` yields 0, 1, 2 (not 3). `enumerate(items)` provides indices and values together; `zip()` can pair two sequences. See [[range and enumerate|python:range-enumerate]] and [[break/continue|python:break-continue]]. If the iterable is empty, the loop body does not run.",
    "example": "colors = [\"red\", \"blue\", \"green\"]\nfor color in colors:\n    print(\"Color:\", color)\n\nfor index in range(3):\n    print(\"Index:\", index)",
    "tip": "range(3) produces 0, 1, 2. It doesn't include the end value.",
    "related": [
      {
        "scope": "python",
        "id": "lists",
        "label": "Lists · list (Python's everyday array)"
      },
      {
        "scope": "python",
        "id": "range-enumerate",
        "label": "range(), enumerate() and zip()"
      },
      {
        "scope": "python",
        "id": "comprehensions",
        "label": "List and dict comprehensions"
      }
    ]
  },
  {
    "id": "while-loops",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "while loops and safety",
    "summary": "Repeat instructions until a condition changes.",
    "body": "A `while` loop tests its condition **before each repetition**, running the indented body while the condition is truthy. Use it when a stopping point depends on a changing condition instead of a known collection size. Update the relevant variable inside the loop, or use `break`, so that it eventually finishes.\n\nA loop such as `while True:` without a reachable exit can run indefinitely. In a program with a limited execution budget, that can cause a timeout. Prefer a [[for loop|python:for-loops]] when processing a known iterable; see [[comparisons|python:comparisons]] and [[break/continue|python:break-continue]].",
    "example": "count = 0\nwhile count < 3:\n    print(\"Round\", count)\n    count += 1\n\nprint(\"Finished\")",
    "tip": "An infinite while loop can time out your script. In Code-Empire, prefer scheduled on_tick calls for ongoing behavior.",
    "related": []
  },
  {
    "id": "range-enumerate",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "range(), enumerate() and zip()",
    "summary": "Generate counts and pair related information during loops.",
    "body": "[[range|python:for-loops]] provides a sequence of numbers; enumerate provides both an index and a value; [[zip|python:iterators]] pairs items from iterables. These built-ins often eliminate manual counter variables.",
    "example": "colors = [\"red\", \"blue\", \"green\"]\nshapes = [\"circle\", \"square\", \"triangle\"]\nfor index, color in enumerate(colors, start=1):\n    print(index, color)\nfor color, shape in zip(colors, shapes):\n    print(color, shape)",
    "tip": "zip stops when the shortest iterable is exhausted unless you use strict=True.",
    "related": []
  },
  {
    "id": "break-continue",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "break, continue and pass",
    "summary": "Control how loops and unfinished blocks behave.",
    "body": "break exits a [[loop|python:for-loops]] early; continue skips to the next iteration. pass does nothing and is useful as a temporary placeholder while building a program.",
    "example": "numbers = [1, 2, 3, 4, 5]\nfor number in numbers:\n    if number == 2:\n        continue\n    print(number)\n    if number == 4:\n        break\n\ndef unfinished():\n    pass",
    "tip": "pass is not the same as return: it does not exit a function.",
    "related": []
  },
  {
    "id": "functions",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Defining functions",
    "summary": "Create reusable blocks of code with meaningful names.",
    "body": "A [[function|python:functions]] groups reusable instructions under a name. Define it using `def name(parameters):` followed by an indented block. Defining a function **does not run its body**. Calling it, such as `add_tax(10, 0.15)`, supplies argument values and runs the body.\n\nA function can send a result back with `return`, or return `None` if no value is supplied. Using small functions makes complex code easier to test and change. See [[parameters and arguments|python:parameters]], [[return values|python:return]], and [[scope|python:scope]].",
    "example": "def add_tax(price, rate):\n    return price * (1 + rate)\n\nprint(add_tax(10, 0.15))",
    "tip": "Defining a function does not run its body until you call it.",
    "related": [
      {
        "scope": "python",
        "id": "parameters",
        "label": "Parameters, defaults and keyword arguments"
      },
      {
        "scope": "python",
        "id": "return",
        "label": "return and None"
      },
      {
        "scope": "python",
        "id": "scope",
        "label": "Scope and local variables"
      },
      {
        "scope": "python",
        "id": "type-hints",
        "label": "Type hints"
      }
    ]
  },
  {
    "id": "parameters",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Parameters, defaults and keyword arguments",
    "summary": "Write flexible functions that accept different inputs.",
    "body": "Parameters are names in a [[function|python:functions]] definition. Arguments are values passed when calling it. Defaults make some arguments optional. Keyword arguments identify parameters by name and make calls clearer.",
    "example": "def describe_item(name, color=\"red\"):\n    return f\"{name} is {color}\"\n\nprint(describe_item(\"apple\"))\nprint(describe_item(\"ball\", color=\"blue\"))",
    "tip": "Don't use a mutable list or dictionary as a default parameter unless you explicitly want it shared between calls.",
    "related": []
  },
  {
    "id": "return",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "return and None",
    "summary": "Send results from a function back to the code that called it.",
    "body": "return immediately exits a [[function|python:functions]] and supplies a result. Without a return, a function returns [[None|python:none]]. Keep calculation functions separate from command-issuing functions when it helps you reason about code.",
    "example": "def is_even(number):\n    return number % 2 == 0\n\nanswer = is_even(12)\nprint(answer)",
    "tip": "print() displays a value but doesn't return that value for later use.",
    "related": []
  },
  {
    "id": "scope",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Scope and local variables",
    "summary": "Understand which variables belong to each function.",
    "body": "**Scope** determines where a name can be used. Assignments inside a function normally create **local** variables; parameters are local too. A function can read names from outer scopes, but attempting to assign to one without declaring it `global` or `nonlocal` usually creates a new local name. Using explicit arguments and return values is generally clearer than manipulating globals.\n\nLocal variables remain available during that function call. They are not automatically persistent between independent executions of a program. When you need to preserve data, pass it around or use an explicit storage mechanism. See [[variables|python:variables]], [[functions|python:functions]], and [[return|python:return]].",
    "example": "threshold = 20\n\ndef is_above(value):\n    difference = value - threshold\n    return difference > 0\n\nprint(is_above(25))",
    "tip": "Prefer passing arguments and returning results over changing global state.",
    "related": []
  },
  {
    "id": "modules",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Imports and the standard library",
    "summary": "Reuse Python's bundled tools instead of rewriting them.",
    "body": "Python organizes reusable code into modules. Use import [[math|python:math-module]] to access math.ceil() or from collections import [[Counter|python:dictionary-methods]] to import a single name. The standard library includes many packages for numbers, text, statistics, dates and more. Some operating-system and network features may not be available in constrained environments such as browsers; the language itself remains the same.",
    "example": "import math\nfrom collections import Counter\n\nprint(math.ceil(15 / 7))\ncounts = Counter([\"red\", \"blue\", \"red\"])\nprint(counts[\"red\"])",
    "tip": "Importing a package does not mean every OS-dependent feature will work in the browser. Third-party packages may not be installed.",
    "related": [
      {
        "scope": "python",
        "id": "math-module",
        "label": "The math module"
      },
      {
        "scope": "python",
        "id": "random-module",
        "label": "Random values"
      },
      {
        "scope": "python",
        "id": "statistics-module",
        "label": "Basic statistics"
      },
      {
        "scope": "python",
        "id": "json-module",
        "label": "JSON and dictionaries"
      }
    ]
  },
  {
    "id": "sorting",
    "scope": "python",
    "category": "Working With Data",
    "title": "Sorting and key functions",
    "summary": "Rank candidates by skills, efficiency, or other computed properties.",
    "body": "sorted() returns a new [[list|python:lists]]. Use key= to specify a comparison value, and reverse=True for descending order. Small [[lambda|python:lambda]] functions are useful for short one-off key expressions.",
    "example": "items = [{\"name\": \"blue\", \"score\": 34},\n         {\"name\": \"red\", \"score\": 62},\n         {\"name\": \"green\", \"score\": 48}]\nordered = sorted(items, key=lambda item: item[\"score\"], reverse=True)\nprint([item[\"name\"] for item in ordered])",
    "tip": "sorted() doesn't change the original list. list.sort() changes it in place.",
    "related": []
  },
  {
    "id": "builtins",
    "scope": "python",
    "category": "Working With Data",
    "title": "len(), sum(), min(), max(), abs()",
    "summary": "Measure collections and calculate useful aggregates.",
    "body": "Python's built-in functions cover many common tasks. [[len|python:lists]] counts elements, sum adds [[numbers|python:ints]], min/max find extremes, abs gives a nonnegative magnitude, and [[round|python:number-formatting]] formats numeric precision.",
    "example": "cargo = [4, 6, 2, 8]\nprint(len(cargo))\nprint(sum(cargo))\nprint(min(cargo), max(cargo))\nprint(sum(cargo) / len(cargo))",
    "tip": "Averages require handling an empty list to avoid division by zero.",
    "related": []
  },
  {
    "id": "any-all",
    "scope": "python",
    "category": "Working With Data",
    "title": "any() and all()",
    "summary": "Check whether at least one or every condition is satisfied.",
    "body": "any() returns True if at least one element is [[truthy|python:truthiness]]. all() returns True only if every element is truthy. They work well with [[generator expressions|python:generators]] and make validation code concise.",
    "example": "numbers = [10, 20, 30]\nprint(all(number > 0 for number in numbers))\nprint(any(number > 25 for number in numbers))",
    "tip": "all([]) is True and any([]) is False—this matters when validating empty rosters.",
    "related": []
  },
  {
    "id": "strings-methods",
    "scope": "python",
    "category": "Working With Data",
    "title": "Working with text",
    "summary": "Normalize, split, join, and search textual data.",
    "body": "[[String|python:strings]] methods can clean up labels and parse simple text input. strip removes surrounding whitespace; split returns words or delimiter-separated chunks; join combines text; lower supports case-insensitive comparisons.",
    "example": "raw = \" red, blue, green \"\ncolors = [part.strip() for part in raw.split(\",\")]\nprint(colors)\nprint(\" | \".join(colors))\nprint(\"RED\".lower() == \"red\")",
    "tip": "str.replace creates a new string; strings themselves cannot be modified in place.",
    "related": []
  },
  {
    "id": "errors",
    "scope": "python",
    "category": "Errors & Debugging",
    "title": "Exceptions and tracebacks",
    "summary": "Understand why a program failed instead of guessing.",
    "body": "Python raises an [[exception|python:try-except]] when an operation fails. The [[traceback|python:debugging]] names the error type and the line involved. Common examples include NameError for unknown names, TypeError for incompatible operations, and KeyError for missing dictionary entries.",
    "example": "prices = {\"apple\": 2}\ntry:\n    print(prices[\"pear\"])\nexcept KeyError:\n    print(\"Price not found\")",
    "tip": "Catch specific errors. A bare except can hide genuine programming bugs.",
    "related": [
      {
        "scope": "python",
        "id": "try-except",
        "label": "try / except / finally"
      },
      {
        "scope": "python",
        "id": "raising",
        "label": "Raising your own exceptions"
      },
      {
        "scope": "python",
        "id": "debugging",
        "label": "Debugging with print and small tests"
      }
    ]
  },
  {
    "id": "try-except",
    "scope": "python",
    "category": "Errors & Debugging",
    "title": "try / except / finally",
    "summary": "Handle expected failures without stopping an entire program.",
    "body": "Use try to protect an operation that might fail and except to handle named [[exception|python:errors]] classes. else runs when no exception occurred; finally runs even when an exception happens. Use narrow handlers that only catch errors you can recover from.",
    "example": "raw = \"12\"\ntry:\n    value = int(raw)\nexcept ValueError:\n    value = 0\nelse:\n    print(\"Parsed successfully\")\nfinally:\n    print(\"Conversion attempted\")\nprint(value)",
    "tip": "Use exceptions for genuinely exceptional cases, not as a replacement for every normal condition.",
    "related": []
  },
  {
    "id": "debugging",
    "scope": "python",
    "category": "Errors & Debugging",
    "title": "Debugging with print and small tests",
    "summary": "Make failures reproducible and inspect one assumption at a time.",
    "body": "Start with a small input, [[print|python:printing]] the key values, and verify one [[function|python:functions]]'s result. Python consoles report printed values and runtime [[exceptions|python:errors]]. Inspect the full traceback and verify the assumptions each line makes.",
    "example": "def is_multiple(number, divisor):\n    answer = number % divisor == 0\n    print(\"Inputs:\", number, divisor, \"Result:\", answer)\n    return answer\n\nassert is_multiple(12, 3)\nassert not is_multiple(13, 3)",
    "tip": "assert is useful for simple development checks, but is not a substitute for validating player-facing or external data.",
    "related": []
  },
  {
    "id": "classes",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Classes and objects",
    "summary": "Build custom types with attributes and methods.",
    "body": "A `class` defines a new [[type|python:types]] of object. Its methods are functions belonging to that class. When you call `Rectangle(3, 4)`, Python creates an instance and typically invokes `__init__` to initialize its attributes. In an instance method, `self` is the object being used—not a special reserved keyword, but the standard parameter name.\n\nAssign `self.width = width` to store an attribute. Calling `shape.area()` passes `shape` as `self` automatically. Classes are useful for grouping data and behavior, but simple [[functions|python:functions]] and [[dictionaries|python:dicts]] may be more appropriate for small tasks.",
    "example": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n\nshape = Rectangle(3, 4)\nprint(shape.area())",
    "tip": "Calling a Python class constructor creates a Python object, not an object in another application.",
    "related": []
  },
  {
    "id": "generators",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Generators and lazy iteration",
    "summary": "Produce values one at a time instead of creating a large list.",
    "body": "A [[generator expression|python:comprehensions]] lazily computes its values. yield inside a function turns it into a generator. They're useful when [[iterating|python:iterators]] large collections or building pipelines, but remember a generator is usually consumed once.",
    "example": "values = (n * n for n in range(5))\nprint(sum(values))\n\ndef countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nprint(list(countdown(3)))",
    "tip": "A generator expression is not a saved list. Convert it with list() when you need to inspect or reuse values.",
    "related": []
  },
  {
    "id": "type-hints",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Type hints",
    "summary": "Document the inputs and outputs you expect.",
    "body": "Type hints annotate names and [[function|python:functions]] signatures. They improve readability and can help external development tools, but Python does not enforce them at runtime by default. Built-in generics such as [[list|python:lists]][str] and [[dict|python:dicts]][str, int] are available in modern Python.",
    "example": "def count_colors(colors: list[str]) -> int:\n    return len(colors)\n\nnames: dict[str, int] = {\"red\": 1}\nprint(count_colors(list(names)))",
    "tip": "A type annotation isn't input validation. Incorrect values can still be passed at runtime.",
    "related": []
  },
  {
    "id": "readable-code",
    "scope": "python",
    "category": "Writing Good Code",
    "title": "Readable, maintainable Python",
    "summary": "Write programs you can understand and extend weeks later.",
    "body": "Favor descriptive names, small [[functions|python:functions]], clear control flow and named constants. Avoid repeating the same logic across dozens of items. [[Comment|python:comments]] the reason behind decisions and keep complex calculations separate from function calls.",
    "example": "MAX_ATTEMPTS = 3\n\ndef has_attempts_left(attempts_used):\n    \"\"\"Return whether another attempt is allowed.\"\"\"\n    return attempts_used < MAX_ATTEMPTS\n\nprint(has_attempts_left(2))",
    "tip": "Shorter code isn't always better. Prioritize clarity over clever one-liners.",
    "related": []
  },
  {
    "id": "copy-mutation",
    "scope": "python",
    "category": "Writing Good Code",
    "title": "Mutability, references and copying",
    "summary": "Know when two variables refer to the same list or dictionary.",
    "body": "Some Python values, including [[lists|python:lists]], [[dictionaries|python:dicts]], and [[sets|python:sets]], are **mutable**. Others, including [[strings|python:strings]], integers, and tuples, cannot be changed in place. Assigning `alias = original` doesn't copy a list; both names refer to the same object, so a modification through either name is visible through both.\n\n`list.copy()` and slicing copy the outer list only (**shallow copies**). If it contains nested lists or dictionaries, those nested objects are still shared. Use `copy.deepcopy()` when you genuinely need independent nested objects. See [[nested collections|python:nested-collections]].",
    "example": "original = [\"red\", \"blue\"]\nalias = original\nseparate = original.copy()\nalias.append(\"green\")\nprint(original)\nprint(separate)",
    "tip": "A shallow copy doesn't duplicate nested mutable objects.",
    "related": []
  },
  {
    "id": "operators",
    "scope": "python",
    "category": "Operators",
    "title": "Arithmetic operators",
    "summary": "Use Python's operators to calculate numbers.",
    "body": "Arithmetic operators include +, -, *, /, //, %, and **. Division / produces a [[float|python:floats]]; // performs [[floor division|python:ints]]; % gives a remainder; ** raises to a power. Parentheses clarify the order of operations.",
    "example": "print(10 + 4)\nprint(10 / 4)\nprint(10 // 4)\nprint(10 % 4)\nprint(2 ** 3)",
    "tip": "Floor division rounds toward negative infinity, not toward zero.",
    "related": []
  },
  {
    "id": "augmented",
    "scope": "python",
    "category": "Operators",
    "title": "Augmented assignment",
    "summary": "Shorten updates to existing variables.",
    "body": "Operators like +=, -=, *= and /= update a [[variable|python:variables]] based on its previous value. They are equivalent to writing the longer expression in many cases. On [[mutable|python:copy-mutation]] containers, augmented assignment may modify an object in place.",
    "example": "count = 4\ncount += 3\ncount *= 2\nprint(count)",
    "tip": "a += b is an assignment, not a comparison.",
    "related": []
  },
  {
    "id": "precedence",
    "scope": "python",
    "category": "Operators",
    "title": "Operator precedence",
    "summary": "Know the order in which expressions are evaluated.",
    "body": "Python evaluates some operators before others. Multiplication is performed before addition; [[comparisons|python:comparisons]] happen after arithmetic; [[and|python:booleans]] is evaluated before or. Parentheses make expressions explicit and reduce mistakes.",
    "example": "print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(True or False and False)",
    "tip": "Use parentheses for complex conditions even when you know the precedence rules.",
    "related": []
  },
  {
    "id": "truthiness",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "Truthy and falsy values",
    "summary": "Understand how Python interprets different values in conditions.",
    "body": "An [[if|python:if-elif]] statement doesn't require an explicit [[bool|python:booleans]]. Empty strings, [[lists|python:lists]], tuples, dictionaries, sets, the number zero, and None are falsy. Nonempty collections and nonzero numbers are truthy. This lets you write simple checks for empty data.",
    "example": "names = []\nif not names:\n    print(\"The list is empty\")\n\nvalue = 12\nif value:\n    print(\"Nonzero value\")",
    "tip": "None, 0, and an empty string are all falsy, but they are not equal in meaning.",
    "related": []
  },
  {
    "id": "identity",
    "scope": "python",
    "category": "Operators",
    "title": "Equality versus identity",
    "summary": "Learn when to use == and when to use is.",
    "body": "The [[equality|python:comparisons]] operator == checks whether two values compare equal. The identity operator is checks whether two names refer to the exact same object. Use is [[None|python:none]] when checking for None, but normally use == for numbers and [[strings|python:strings]].",
    "example": "a = [1, 2]\nb = [1, 2]\nc = a\nprint(a == b)\nprint(a is b)\nprint(a is c)",
    "tip": "Don't use is for string or integer value comparisons.",
    "related": []
  },
  {
    "id": "dictionary-methods",
    "scope": "python",
    "category": "Collections",
    "title": "Dictionary methods",
    "summary": "Read and update mappings safely.",
    "body": "[[Dictionary|python:dicts]] keys() provides keys, values() provides values, and items() provides key/value pairs. get() can provide a default when the key is absent. update() merges another mapping; [[pop()|python:list-methods]] removes a key and returns its value.",
    "example": "scores = {\"red\": 10, \"blue\": 20}\nprint(scores.get(\"green\", 0))\nfor key, value in scores.items():\n    print(key, value)\nscores.update({\"green\": 30})",
    "tip": "A dictionary's keys must be hashable; lists cannot be dictionary keys.",
    "related": []
  },
  {
    "id": "unpacking",
    "scope": "python",
    "category": "Collections",
    "title": "Sequence unpacking",
    "summary": "Assign several values in a single statement.",
    "body": "Python can unpack elements of an iterable into separate names. Extended unpacking with a star collects remaining items into a list. Unpacking works for many data types, including tuples, [[lists|python:lists]], and values returned from [[functions|python:functions]].",
    "example": "first, second = [10, 20]\na, *middle, last = [1, 2, 3, 4]\nprint(first, second)\nprint(middle, last)",
    "tip": "The number of values must match the target variables unless you use starred unpacking.",
    "related": []
  },
  {
    "id": "nested-collections",
    "scope": "python",
    "category": "Collections",
    "title": "Nested collections",
    "summary": "Represent structured values with lists inside dictionaries and vice versa.",
    "body": "A collection can contain other collections. A [[dictionary|python:dicts]] can store a [[list|python:lists]] of numbers; a list can store dictionaries. Access the outer container first, then the inner one. Keep structures understandable and consider splitting deep data into helper [[functions|python:functions]].",
    "example": "record = {\"name\": \"red\", \"numbers\": [2, 4, 6]}\nprint(record[\"numbers\"][1])\nrows = [{\"x\": 1}, {\"x\": 2}]\nprint(rows[0][\"x\"])",
    "tip": "Nested mutable objects may be shared when you make shallow copies.",
    "related": []
  },
  {
    "id": "string-escapes",
    "scope": "python",
    "category": "Data Types",
    "title": "Escaping strings",
    "summary": "Include newlines, quotes and special characters in text.",
    "body": "A backslash introduces escape sequences inside a [[string|python:strings]]: \\n means a newline and \\t means a tab. You can use different quote styles to reduce escaping. Raw strings beginning with r are helpful for [[regular expressions|python:regex-module]] and Windows-style paths.",
    "example": "print(\"first\\nsecond\")\\nprint(\"She said \\\"hello\\\"\")\\ntext = r\"C:\\new\\folder\"\\nprint(text)",
    "tip": "A raw string cannot end with an unpaired backslash.",
    "related": []
  },
  {
    "id": "number-formatting",
    "scope": "python",
    "category": "Data Types",
    "title": "Formatting numbers",
    "summary": "Display quantities, percentages and decimal precision clearly.",
    "body": "Format [[numeric|python:floats]] values with [[f-strings|python:fstrings]]. Use :.2f for two decimal places, :,.0f for thousands separators with no decimals, and :.1% for percentages. Formatting changes how a value is displayed, not its underlying numeric type.",
    "example": "pi = 3.14159\nratio = 0.375\ncount = 12000\nprint(f\"{pi:.2f}\")\nprint(f\"{ratio:.1%}\")\nprint(f\"{count:,}\")",
    "tip": "Displaying two decimals doesn't round the stored value permanently.",
    "related": []
  },
  {
    "id": "random-module",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Random values",
    "summary": "Generate simple pseudorandom numbers for experiments.",
    "body": "The random standard-library [[module|python:modules]] provides randint(), choice(), random(), and shuffle(). A random seed can reproduce a sequence of pseudorandom results, which is useful for [[tests|python:testing]]. Programs requiring secure secrets should use dedicated cryptographic facilities.",
    "example": "import random\nrandom.seed(5)\nprint(random.randint(1, 6))\nprint(random.choice([\"red\", \"blue\", \"green\"]))",
    "tip": "Do not use random for passwords, authentication tokens or security-sensitive randomness.",
    "related": []
  },
  {
    "id": "math-module",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "The math module",
    "summary": "Use common mathematical functions without reimplementing them.",
    "body": "The standard math [[module|python:modules]] provides ceil(), floor(), sqrt(), pi, sin(), cos() and other mathematical operations. These functions are convenient for geometry, simulation, measurements and [[calculations|python:operators]].",
    "example": "import math\nprint(math.sqrt(81))\nprint(math.ceil(4.2))\nprint(math.pi)",
    "tip": "math.sqrt() rejects negative real numbers. See cmath for complex-number operations.",
    "related": []
  },
  {
    "id": "statistics-module",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Basic statistics",
    "summary": "Calculate averages, medians and related summaries.",
    "body": "The statistics [[module|python:modules]] includes mean(), median(), mode(), stdev() and other descriptive tools. When handling empty or very small datasets, some functions raise [[exceptions|python:errors]]. Validate input first.",
    "example": "import statistics\nvalues = [2, 4, 4, 10]\nprint(statistics.mean(values))\nprint(statistics.median(values))",
    "tip": "An empty list cannot have a mean.",
    "related": []
  },
  {
    "id": "json-module",
    "scope": "python",
    "category": "Working With Data",
    "title": "JSON and dictionaries",
    "summary": "Convert simple Python data to portable text.",
    "body": "JSON is a common interchange format for [[strings|python:strings]], numbers, booleans, [[lists|python:lists]], [[dictionaries|python:dicts]] with string keys, and null. json.dumps converts a Python value to JSON text; json.loads parses JSON text. Not every Python object, such as a set, can be serialized directly.",
    "example": "import json\nvalue = {\"colors\": [\"red\", \"blue\"], \"count\": 2}\ntext = json.dumps(value)\nprint(text)\nprint(json.loads(text)[\"count\"])",
    "tip": "JSON uses true, false and null; Python uses True, False and None.",
    "related": []
  },
  {
    "id": "regex-module",
    "scope": "python",
    "category": "Working With Data",
    "title": "Regular expressions",
    "summary": "Search or validate text using reusable patterns.",
    "body": "The re [[module|python:modules]] provides pattern-based text searching. search() finds the first match anywhere; fullmatch() requires the entire [[string|python:strings]] to match; findall() returns all matches. Use [[raw strings|python:string-escapes]] for patterns so backslashes are easier to read.",
    "example": "import re\\ntext = \"Code 123, Code 456\"\\nprint(re.findall(r\"\\d+\", text))\\nprint(bool(re.fullmatch(r\"[a-z]+\", \"hello\")))",
    "tip": "Regular expressions are powerful but can be harder to read than simple string methods.",
    "related": []
  },
  {
    "id": "raising",
    "scope": "python",
    "category": "Errors & Debugging",
    "title": "Raising your own exceptions",
    "summary": "Signal that a function received invalid data.",
    "body": "Use raise to produce an [[exception|python:errors]] when a function's assumptions are violated. [[ValueError|python:try-except]] commonly signals that a value is unacceptable; TypeError signals an inappropriate type. Callers may catch appropriate exceptions.",
    "example": "def percentage(value):\n    if not 0 <= value <= 100:\n        raise ValueError(\"Must be between 0 and 100\")\n    return value / 100\n\nprint(percentage(75))",
    "tip": "Use informative exception messages that describe what input was expected.",
    "related": []
  },
  {
    "id": "recursion",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Recursion",
    "summary": "Let a function solve smaller versions of the same problem.",
    "body": "A recursive [[function|python:functions]] calls itself with a smaller input until a base case is reached. Recursion is helpful for tree-shaped structures or divide-and-conquer algorithms. Many straightforward [[loops|python:while-loops]] are simpler and avoid recursion depth limits.",
    "example": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))",
    "tip": "Always define a base case that can be reached; excessive recursion raises RecursionError.",
    "related": []
  },
  {
    "id": "inheritance",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Class inheritance",
    "summary": "Reuse and specialize existing class behavior.",
    "body": "A [[class|python:classes]] may inherit methods and attributes from a parent class. A subclass can add features or override a method. Use super() to call the parent class's implementation when appropriate. Composition may be simpler than inheritance for many designs.",
    "example": "class Shape:\n    def describe(self):\n        return \"a shape\"\n\nclass Circle(Shape):\n    def describe(self):\n        return \"a circle\"\n\nprint(Circle().describe())",
    "tip": "Avoid deep inheritance hierarchies when small composed objects are easier to understand.",
    "related": []
  },
  {
    "id": "lambda",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Lambda expressions",
    "summary": "Write short anonymous functions for simple operations.",
    "body": "lambda creates a small function from one expression. It is useful for [[sorting|python:sorting]] keys and simple callbacks, but normal def [[functions|python:functions]] are usually clearer for multi-step logic. A lambda cannot contain ordinary statements.",
    "example": "numbers = [3, 1, 4, 2]\nprint(sorted(numbers, key=lambda n: -n))",
    "tip": "Prefer a named def when the logic deserves an explanation.",
    "related": []
  },
  {
    "id": "iterators",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Iterables and iterators",
    "summary": "Understand what for loops really consume.",
    "body": "An [[iterable|python:for-loops]] can supply an iterator using iter(). The iterator returns one element at a time via next() until StopIteration. [[Lists|python:lists]] can be iterated repeatedly; some iterators are consumed as they run.",
    "example": "colors = [\"red\", \"blue\"]\niterator = iter(colors)\nprint(next(iterator))\nprint(next(iterator))",
    "tip": "An exhausted iterator must be recreated to start over.",
    "related": []
  },
  {
    "id": "testing",
    "scope": "python",
    "category": "Writing Good Code",
    "title": "Assertions and small tests",
    "summary": "Check that a function behaves correctly for multiple inputs.",
    "body": "Testing is the habit of exercising code with known inputs and expected results. [[assert|python:debugging]] is useful for simple development checks and unit tests. Include ordinary cases, boundary values and invalid inputs, and keep [[functions|python:functions]] small enough to test independently.",
    "example": "def double(number):\n    return number * 2\n\nassert double(0) == 0\nassert double(3) == 6\nassert double(-2) == -4\nprint(\"All checks passed\")",
    "tip": "assert can be disabled in optimized Python; validate user input explicitly.",
    "related": []
  },
  {
    "id": "indentation-style",
    "scope": "python",
    "category": "Writing Good Code",
    "title": "Tabs and spaces",
    "summary": "Make indentation consistent across a project.",
    "body": "PEP 8 recommends [[four spaces|python:indentation]] for each indentation level. Many editors let you press the Tab key to insert four spaces. A literal tab is a different character, and mixing tabs and spaces in a single indentation hierarchy can cause confusing [[errors|python:errors]]. Configure your editor consistently and use Shift+Tab to unindent.",
    "example": "def describe(value):\n    if value > 0:\n        print(\"Positive\")\n    else:\n        print(\"Zero or negative\")",
    "tip": "Pressing Tab and inserting literal tab characters are not the same thing.",
    "related": [
      {
        "scope": "python",
        "id": "indentation",
        "label": "Indentation and code blocks"
      },
      {
        "scope": "python",
        "id": "functions",
        "label": "Defining functions"
      }
    ]
  }
];
export const PYTHON_CATEGORIES=["Getting Started","Data Types","Collections","Conditions & Loops","Functions & Programs","Working With Data","Errors & Debugging","Beyond the Basics","Writing Good Code","Operators"];
