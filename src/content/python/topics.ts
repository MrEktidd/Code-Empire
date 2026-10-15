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
    "body": "A `list` is Python's common general-purpose **array-like collection**. It is ordered, mutable, and can contain repeated or mixed values, such as [[int|python:ints]] values (integers) and [[str|python:strings]] values (text). Lists use square brackets. `numbers[0]` gets the first element, `numbers[-1]` the last, and `len(numbers)` the number of elements. Their order remains stable unless you change it.\n\n`append(value)` adds one element; `extend(iterable)` adds each element from another iterable. `pop()` removes and returns the last item. You can replace an element with `colors[0] = \"purple\"`. The slice `colors[1:3]` gives elements at indices 1 and 2. See [[slicing|python:index-slice]] and [[list methods|python:list-methods]]. Choose a [[tuple|python:tuples]] for a sequence that should not be reassigned and a [[dictionary|python:dicts]] for named keys.",
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
    "tip": "colors[1:3] returns indices 1 and 2; colors[100:200] is an empty list, not an IndexError.",
    "related": []
  },
  {
    "id": "list-methods",
    "scope": "python",
    "category": "Collections",
    "title": "Useful list methods",
    "summary": "Add, remove, find and reorder collection items.",
    "body": "[[append|python:lists]] adds one item; extend adds all items from another [[iterable|python:iterators]]. pop removes and returns an item; remove deletes a matching value. [[sorted()|python:sorting]] returns a new list, while .sort() modifies the original list and returns None.\n\nThe difference between `append` and `extend` matters: `items.append([2,3])` inserts **one nested list**, while `items.extend([2,3])` inserts the numbers individually. `remove(value)` deletes only the **first matching** element and raises `ValueError` if absent. `index(value)` also raises `ValueError` if the item is absent. `pop()` raises `IndexError` on an empty list. `list.sort()` modifies in place and returns `None`. See [[lists|python:lists]], [[exceptions|python:errors]], and [[sorting|python:sorting]].",
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
    "body": "A comprehension constructs a collection by [[iterating|python:for-loops]] and optionally [[filtering|python:if-elif]]. They're especially handy for finding available items or building lookup maps. Prefer a normal loop when the comprehension becomes hard to read.\n\nThe expression `[n * n for n in numbers if n % 2 == 0]` creates a **new list** of squares of the even numbers. The condition after `if` filters the input; the expression before `for` determines each output value. Dictionary comprehensions look like `{n: n*n for n in range(3)}`. Generator expressions use parentheses rather than square brackets and evaluate lazily. See [[lists|python:lists]], [[dictionary mappings|python:dicts]], and [[generators|python:generators]].",
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
    "tip": "A while loop rechecks its condition before every iteration. Always provide a stopping condition.",
    "related": []
  },
  {
    "id": "range-enumerate",
    "scope": "python",
    "category": "Conditions & Loops",
    "title": "range(), enumerate() and zip()",
    "summary": "Generate counts and pair related information during loops.",
    "body": "[[range|python:for-loops]] provides a sequence of numbers; enumerate provides both an index and a value; [[zip|python:iterators]] pairs items from iterables. These built-ins often eliminate manual counter variables.\n\n`range(stop)` starts at zero; `range(start, stop, step)` lets you specify the endpoints and increment (excluding `stop`). `enumerate(colors, start=1)` yields `(index, value)` pairs without a separate counter. `zip(colors, shapes)` yields matched pairs, stopping at the shortest iterable. With `strict=True`, unequal lengths raise `ValueError` instead. See [[for loops|python:for-loops]] and [[unpacking|python:unpacking]].",
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
    "body": "break exits a [[loop|python:for-loops]] early; continue skips to the next iteration. pass does nothing and is useful as a temporary placeholder while building a program.\n\n`break` exits the **nearest enclosing loop**, while `continue` skips the rest of the current iteration and starts the next one. Both are useful for early decisions without extra nested conditions. `pass` is a statement that does nothing; it satisfies Python's requirement that an indented block contain at least one statement. It is not the same as `return`, which exits a [[function|python:return]]. See [[loops|python:for-loops]].",
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
    "body": "Parameters are names in a [[function|python:functions]] definition. Arguments are values passed when calling it. Defaults make some arguments optional. Keyword arguments identify parameters by name and make calls clearer.\n\nA **parameter** appears in a function definition; an **argument** is the actual value passed when calling it. For example, `name` is a parameter in `def greet(name):`, and `\"Sam\"` is an argument in `greet(\"Sam\")`. Default values are evaluated **when the function is defined**, not freshly for every call. Never use an empty list or dictionary as a mutable default unless shared state is intentional: use `None` and build a new collection instead. See [[functions|python:functions]] and [[None|python:none]].",
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
    "body": "return immediately exits a [[function|python:functions]] and supplies a result. Without a return, a function returns [[None|python:none]]. Keep calculations separate from output or side effects when it helps you reason about code.\n\n`return result` exits a function immediately and sends `result` to its caller; `print(result)` displays it but does **not** return that result. If a function ends without `return`, it returns [[None|python:none]]. You can return multiple values as a [[tuple|python:tuples]] and unpack them into names. Keeping calculations independent of printing makes functions easier to reuse and test.",
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
    "tip": "A variable assigned inside a function is normally local to that function.",
    "related": []
  },
  {
    "id": "modules",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Imports and the standard library",
    "summary": "Reuse Python's bundled tools instead of rewriting them.",
    "body": "Python organizes reusable code into modules. Use import [[math|python:math-module]] to access math.ceil() or from collections import Counter to import a single name. The standard library includes many packages for numbers, text, statistics, dates and more. Some operating-system and network features may not be available in constrained environments such as browsers; the language itself remains the same.\n\n`import math` binds the module name `math`, so you call `math.sqrt(9)`. `from collections import Counter` imports `Counter` directly under that name. Imports are usually placed at the beginning of a script, and external third-party packages may require installation. Standard-library modules include [[math|python:math-module]], [[random|python:random-module]], [[statistics|python:statistics-module]], and [[json|python:json-module]]. Check your execution environment before assuming network or operating-system features are available.",
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
    "body": "sorted() returns a new [[list|python:lists]]. Use key= to specify a comparison value, and reverse=True for descending order. Small [[lambda|python:lambda]] functions are useful for short one-off key expressions.\n\n`sorted(values)` returns a new [[list|python:lists]] in ascending order. `values.sort()` changes an existing list **in place** and returns `None`. Both accept `reverse=True` and a `key` function; for example, `key=lambda item: item[\"score\"]` sorts records by their scores. You generally cannot sort a mixture of incomparable types, such as integers and ordinary strings. See [[lambda|python:lambda]] and [[dictionaries|python:dicts]].",
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
    "body": "Python's built-in functions cover many common tasks. [[len|python:lists]] counts elements, sum adds [[numbers|python:ints]], min/max find extremes, abs gives a nonnegative magnitude, and [[round|python:number-formatting]] formats numeric precision.\n\n`len()` returns the number of items in a collection. `sum()` adds numeric values; `min()` and `max()` select extremes; `abs()` returns a magnitude. With an empty list, `sum([])` is `0`, but `min([])` and `max([])` raise `ValueError` unless a default is supplied. The `round()` function computes a new rounded number; it does **not** simply format a string. See [[number formatting|python:number-formatting]] and [[exceptions|python:errors]].",
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
    "body": "any() returns True if at least one element is [[truthy|python:truthiness]]. all() returns True only if every element is truthy. They work well with [[generator expressions|python:generators]] and make validation code concise.\n\n`any(values)` asks whether **at least one** value is truthy; `all(values)` asks whether **every** value is truthy. Both stop as soon as the result is known, which can avoid unnecessary work. They accept [[generator expressions|python:generators]] so you don't need to construct a temporary list. For empty iterables, `any([])` is `False` and `all([])` is `True` (there is no counterexample). See [[truthiness|python:truthiness]].",
    "example": "numbers = [10, 20, 30]\nprint(all(number > 0 for number in numbers))\nprint(any(number > 25 for number in numbers))",
    "tip": "all([]) is True, while any([]) is False. Both stop as soon as the result is known.",
    "related": []
  },
  {
    "id": "strings-methods",
    "scope": "python",
    "category": "Working With Data",
    "title": "Working with text",
    "summary": "Normalize, split, join, and search textual data.",
    "body": "[[String|python:strings]] methods can clean up labels and parse simple text input. strip removes surrounding whitespace; split returns words or delimiter-separated chunks; join combines text; lower supports case-insensitive comparisons.\n\n`strip()` removes whitespace from both ends of a string; `split(\",\")` separates it into a [[list|python:lists]]; `\", \".join(parts)` joins string elements. `lower()` and `casefold()` return lowercased copies for different levels of case-insensitive comparison; `casefold()` is more aggressive for Unicode text. None of these methods changes the original [[string|python:strings]] because strings are immutable. `replace(old,new)` likewise returns a new string.",
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
    "body": "Python raises an [[exception|python:try-except]] when an operation fails. The [[traceback|python:debugging]] names the error type and the line involved. Common examples include NameError for unknown names, TypeError for incompatible operations, and KeyError for missing dictionary entries.\n\nAn **exception** signals that something went wrong during execution. A **traceback** shows the chain of calls that led to the exception and identifies the line and error type. `NameError` often means a misspelled variable; `TypeError` means an operation doesn't fit the types; `KeyError` means a missing dictionary key; `IndexError` means an invalid sequence index. Learn to read the final line first, then inspect the indicated source line. Use [[try/except|python:try-except]] for problems that are genuinely recoverable.",
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
    "body": "Use try to protect an operation that might fail and except to handle named [[exception|python:errors]] classes. else runs when no exception occurred; finally runs even when an exception happens. Use narrow handlers that only catch errors you can recover from.\n\nThe `try` block contains code that might raise an exception. `except ValueError:` handles just that type; uncaught exceptions continue propagating. An optional `else` block runs **only if the try block did not raise an exception**, and `finally` runs as the statement finishes whether or not an exception occurred (including when returning). Catch the narrowest exception type you can actually handle; swallowing every error can hide a bug. See [[raising exceptions|python:raising]] and [[debugging|python:debugging]].",
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
    "body": "Start with a small input, [[print|python:printing]] the key values, and verify one [[function|python:functions]]'s result. Python consoles report printed values and runtime [[exceptions|python:errors]]. Inspect the full traceback and verify the assumptions each line makes.\n\nDebugging means testing an assumption and locating where actual results differ. Start with a small reproducible input, inspect intermediate values with [[print()|python:printing]], and reduce the program to the failing operation. Assertions can check expected results during development; for repeatable checks, write small tests covering ordinary inputs, boundaries, and invalid values. Inspect [[exceptions and tracebacks|python:errors]] rather than ignoring them.",
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
    "example": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\nshape = Rectangle(3, 4)\nprint(shape.area())",
    "tip": "Calling a Python class constructor creates a Python object, not an object in another application.",
    "related": []
  },
  {
    "id": "generators",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Generators and lazy iteration",
    "summary": "Produce values one at a time instead of creating a large list.",
    "body": "A [[generator expression|python:comprehensions]] lazily computes its values. yield inside a function turns it into a generator. They're useful when [[iterating|python:iterators]] large collections or building pipelines, but remember a generator is usually consumed once.\n\nA **generator expression** such as `(n*n for n in range(5))` produces values only when requested; `list(...)` would collect them all immediately. A function containing `yield` returns a generator object whose work resumes during iteration. Generators are efficient for large streams, but iterating one usually **consumes** its elements, so you cannot replay an exhausted generator without creating a new one. Compare with [[list comprehensions|python:comprehensions]] and [[iterators|python:iterators]].",
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
    "body": "Type hints annotate names and [[function|python:functions]] signatures. They improve readability and can help external development tools, but Python does not enforce them at runtime by default. Built-in generics such as [[list|python:lists]][str] and [[dict|python:dicts]][str, int] are available in modern Python.\n\nA type annotation such as `name: str`, `values: list[int]`, or `def total(values: list[int]) -> int:` documents expected types and assists editors and static checkers. Python does **not enforce annotations automatically at runtime**. They can also describe optional values with `str | None` in modern Python. Use [[lists|python:lists]], [[dictionaries|python:dicts]], and [[functions|python:functions]] alongside annotations to write understandable interfaces.",
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
    "body": "Favor descriptive names, small [[functions|python:functions]], clear control flow and named constants. Avoid repeating the same logic across dozens of items. [[Comment|python:comments]] the reason behind decisions and keep complex calculations separate from function calls.\n\nGood code is written for a future reader—including yourself. Prefer `total_price` to `tp`, divide long computations into named [[functions|python:functions]], and use constants such as `MAX_RETRIES` when a value has a clear meaning. Add [[comments|python:comments]] for non-obvious reasoning. Avoid duplicating the same code across many places; repeated logic is a good candidate for a reusable function. Clarity matters more than squeezing everything into one line.",
    "example": "MAX_ATTEMPTS = 3\n\ndef has_attempts_left(attempts_used):\n    \"\"\"Return whether another attempt is allowed.\"\"\"\n    return attempts_used < MAX_ATTEMPTS\n\nprint(has_attempts_left(2))",
    "tip": "Clear names, small functions, and consistent formatting are more valuable than clever one-liners.",
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
    "body": "Arithmetic operators include +, -, *, /, //, %, and **. Division / produces a [[float|python:floats]]; // performs [[floor division|python:ints]]; % gives a remainder; ** raises to a power. Parentheses clarify the order of operations.\n\n`+`, `-`, `*`, and `**` work as expected for numbers; `/` performs true division, `//` floor division, and `%` computes the remainder. Python evaluates multiplication before addition unless parentheses change the order. For negative numbers, `//` rounds toward **negative infinity**, so `-7 // 3 == -3`. See [[integers|python:ints]], [[floats|python:floats]], and [[precedence|python:precedence]].",
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
    "body": "Operators like +=, -=, *= and /= update a [[variable|python:variables]] based on its previous value. They are equivalent to writing the longer expression in many cases. On [[mutable|python:copy-mutation]] containers, augmented assignment may modify an object in place.\n\n`count += 1` is similar to `count = count + 1`; `-=`, `*=`, and `/=` apply other arithmetic operations. For mutable objects such as [[lists|python:lists]], `+=` may change the existing object in place. For immutable numbers or [[strings|python:strings]], it rebinds the name to a new value. These operators update variables rather than comparing them; see [[assignment|python:variables]] and [[mutability|python:copy-mutation]].",
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
    "body": "Python evaluates some operators before others. Multiplication is performed before addition; [[comparisons|python:comparisons]] happen after arithmetic; [[and|python:booleans]] is evaluated before or. Parentheses make expressions explicit and reduce mistakes.\n\nOperator precedence determines the order of operations. Multiplication happens before addition; [[comparisons|python:comparisons]] happen before `not`, which happens before `and`, which happens before `or`. For example, `True or False and False` is `True`, because `and` is grouped first. Parentheses can override precedence and make complicated expressions easier to read. See [[boolean logic|python:booleans]] and [[arithmetic operators|python:operators]].",
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
    "body": "An [[if|python:if-elif]] statement doesn't require an explicit [[bool|python:booleans]]. Empty strings, [[lists|python:lists]], tuples, dictionaries, sets, the number zero, and None are falsy. Nonempty collections and nonzero numbers are truthy. This lets you write simple checks for empty data.\n\nMost objects can be used directly as conditions. `0`, `0.0`, `\"\"`, `[]`, `{}`, `set()`, `None`, and `False` are **falsy**. Nonzero numbers and nonempty collections are generally **truthy**. Thus `if names:` means the collection isn't empty. However, falsiness doesn't tell you *why* an object is empty or absent; use `is None` when you specifically need to distinguish a missing value. See [[booleans|python:booleans]], [[conditions|python:if-elif]], and [[None|python:none]].",
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
    "body": "The [[equality|python:comparisons]] operator == checks whether two values compare equal. The identity operator is checks whether two names refer to the exact same object. Use is [[None|python:none]] when checking for None, but normally use == for numbers and [[strings|python:strings]].\n\n`a == b` asks whether two values compare equal; `a is b` asks whether they are literally the **same object**. Two separate lists holding `[1,2]` are equal, but they are not identical; assigning `c = a` makes `c is a` true. Use `is None` for checks against the [[None singleton|python:none]]. Don't use `is` for comparing ordinary numbers or [[strings|python:strings]], even if small values sometimes appear to share identities.",
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
    "body": "[[Dictionary|python:dicts]] keys() provides keys, values() provides values, and items() provides key/value pairs. get() can provide a default when the key is absent. update() merges another mapping; pop() removes a key and returns its value.\n\n`.keys()`, `.values()`, and `.items()` give iterable **views** of a dictionary's contents. `.get(key, default)` reads safely when a key may be missing, while `.pop(key)` removes a key and **returns its value** (or raises `KeyError` if missing unless you supply a default). `.update(mapping)` merges entries into the existing mapping. The methods use the original dictionary, not a separate copy; see [[dictionaries|python:dicts]] and [[loops|python:for-loops]].",
    "example": "scores = {\"red\": 10, \"blue\": 20}\nprint(scores.get(\"green\", 0))\nfor key, value in scores.items():\n    print(key, value)\nscores.update({\"green\": 30})",
    "tip": "dict.pop(key) returns the removed value. Unlike list.pop(), its parameter is a key, not a position.",
    "related": []
  },
  {
    "id": "unpacking",
    "scope": "python",
    "category": "Collections",
    "title": "Sequence unpacking",
    "summary": "Assign several values in a single statement.",
    "body": "Python can unpack elements of an iterable into separate names. Extended unpacking with a star collects remaining items into a list. Unpacking works for many data types, including tuples, [[lists|python:lists]], and values returned from [[functions|python:functions]].\n\n`x, y = (4, 7)` assigns the tuple's two values to two names. This works with any iterable that yields exactly the required number of values. `first, *middle, last = [1,2,3,4]` collects the remaining middle elements in a **list**. Too many or too few values cause `ValueError` unless you use a starred target. See [[tuples|python:tuples]], [[lists|python:lists]], and [[function return values|python:return]].",
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
    "body": "A collection can contain other collections. A [[dictionary|python:dicts]] can store a [[list|python:lists]] of numbers; a list can store dictionaries. Access the outer container first, then the inner one. Keep structures understandable and consider splitting deep data into helper [[functions|python:functions]].\n\nA nested collection is one container holding other containers, such as `{\"numbers\": [1,2,3]}`. Access it one level at a time: `record[\"numbers\"][0]` first retrieves the [[list|python:lists]] under the [[dictionary|python:dicts]] key, then its first item. Build nested structures only as deep as needed, and use helper functions for repeated lookups. Shallow copies share their nested mutable elements; see [[copying|python:copy-mutation]].",
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
    "body": "In ordinary string literals, `\\n` represents a newline character, `\\t` represents a tab, and `\\\\` represents a single backslash. Use a backslash before a quote to include the same quote character within the string. A **raw string** prefixed by `r` interprets most backslashes literally, which is handy for paths and [[regular expressions|python:regex-module]]. Raw strings cannot end with a single unpaired backslash. See [[strings|python:strings]].",
    "example": "print(\"first\\nsecond\")\nprint(\"She said \\\"hello\\\"\")\npath = r\"C:\\new\\folder\"\nprint(path)",
    "tip": "The sequence \\n inside normal quotes becomes a newline. Inside r\"...\", it remains two characters.",
    "related": []
  },
  {
    "id": "number-formatting",
    "scope": "python",
    "category": "Data Types",
    "title": "Formatting numbers",
    "summary": "Display quantities, percentages and decimal precision clearly.",
    "body": "Format [[numeric|python:floats]] values with [[f-strings|python:fstrings]]. Use :.2f for two decimal places, :,.0f for thousands separators with no decimals, and :.1% for percentages. Formatting changes how a value is displayed, not its underlying numeric type.\n\n`f\"{number:.2f}\"` displays two decimal places, `f\"{value:,}\"` adds thousands separators, and `f\"{ratio:.1%}\"` displays a percentage. The formatting creates a new [[string|python:strings]]; it does not change the numeric value stored in the variable. Formatting is different from computing a new value with `round()`. See [[f-strings|python:fstrings]] and [[floats|python:floats]].",
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
    "body": "The random standard-library [[module|python:modules]] provides randint(), choice(), random(), and shuffle(). A random seed can reproduce a sequence of pseudorandom results, which is useful for [[tests|python:testing]]. Programs requiring secure secrets should use dedicated cryptographic facilities.\n\nThe standard-library `random` module offers `randint(a,b)` (inclusive endpoints), `choice(sequence)`, `random()` (a float from 0 up to but not including 1), and `shuffle(list)` (modifies a list). The pseudo-random generator can be given a seed to reproduce a sequence—useful for demonstrations and [[testing|python:testing]]. It is *not cryptographically secure*: never use it to make passwords or sensitive tokens.",
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
    "body": "The standard math [[module|python:modules]] provides ceil(), floor(), sqrt(), pi, sin(), cos() and other mathematical operations. These functions are convenient for geometry, simulation, measurements and [[calculations|python:operators]].\n\nThe built-in [[math|python:modules]] module provides `sqrt(x)`, `floor(x)`, `ceil(x)`, `pi`, and trigonometric operations. `ceil` rounds upward to the nearest integer; `floor` rounds downward. Trigonometric functions take angles in **radians**, not degrees. `math.sqrt(-1)` raises `ValueError` for real-number math, while complex numbers have separate support in `cmath`. See [[floats|python:floats]].",
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
    "body": "The statistics [[module|python:modules]] includes mean(), median(), mode(), stdev() and other descriptive tools. When handling empty or very small datasets, some functions raise [[exceptions|python:errors]]. Validate input first.\n\nThe `statistics` module provides `mean` (arithmetic average), `median` (middle value after sorting), and `stdev` (sample standard deviation). These are descriptive statistics, not automatic predictions. `mean([])` raises `StatisticsError`, and sample `stdev` needs at least two observations. If your dataset might be empty, validate it first; see [[conditions|python:if-elif]] and [[exceptions|python:errors]].",
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
    "body": "JSON is a common interchange format for [[strings|python:strings]], numbers, booleans, [[lists|python:lists]], [[dictionaries|python:dicts]] with string keys, and null. json.dumps converts a Python value to JSON text; json.loads parses JSON text. Not every Python object, such as a set, can be serialized directly.\n\n`json.dumps(data)` **serializes** supported Python values into a JSON string, while `json.loads(text)` parses a JSON string back into Python data. JSON supports objects, arrays, strings, finite numbers, booleans, and null; Python equivalents are [[dictionaries|python:dicts]], [[lists|python:lists]], strings, numbers, booleans, and `None`. Many Python types, including sets, custom objects, and all possible dictionary keys, cannot be encoded directly without conversion. See [[types|python:types]].",
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
    "body": "A **regular expression** describes a pattern rather than exact text. `re.search(pattern,text)` looks for a match anywhere, `re.fullmatch()` requires the whole string, and `re.findall()` returns all matches. The pattern `r\"\\d+\"` finds one or more digits; the `r` prefix is a [[raw string|python:string-escapes]]. Prefer ordinary string methods for simple checks, since regular expressions can become difficult to read. See [[strings|python:strings]].",
    "example": "import re\n\ntext = \"Code 123, Code 456\"\nprint(re.findall(r\"\\d+\", text))\nprint(bool(re.fullmatch(r\"[a-z]+\", \"hello\")))",
    "tip": "Regular expressions are powerful but can be harder to read than simple string methods.",
    "related": []
  },
  {
    "id": "raising",
    "scope": "python",
    "category": "Errors & Debugging",
    "title": "Raising your own exceptions",
    "summary": "Signal that a function received invalid data.",
    "body": "Use raise to produce an [[exception|python:errors]] when a function's assumptions are violated. [[ValueError|python:try-except]] commonly signals that a value is unacceptable; TypeError signals an inappropriate type. Callers may catch appropriate exceptions.\n\n`raise ValueError(\"message\")` deliberately signals a problem with an unacceptable value. `TypeError` is conventionally used for an inappropriate type; `ValueError` for an inappropriate value of a supported type. A caller may catch expected failures with [[try/except|python:try-except]], but should not silence unknown bugs. Choose an exception and message that help the caller correct the input. See [[exceptions|python:errors]].",
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
    "body": "A recursive [[function|python:functions]] calls itself with a smaller input until a base case is reached. Recursion is helpful for tree-shaped structures or divide-and-conquer algorithms. Many straightforward [[loops|python:while-loops]] are simpler and avoid recursion depth limits.\n\nIn recursion, a [[function|python:functions]] calls itself to solve a smaller subproblem. Every path needs a **base case** that eventually stops the calls. A factorial example computes `5 * 4 * 3 * 2 * 1` by calling `factorial(n-1)` until n reaches 1. Python limits recursion depth, so an iterative [[loop|python:while-loops]] is often simpler and safer for large inputs.",
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
    "body": "A [[class|python:classes]] may inherit methods and attributes from a parent class. A subclass can add features or override a method. Use super() to call the parent class's implementation when appropriate. Composition may be simpler than inheritance for many designs.\n\nA subclass inherits available methods and attributes from its parent [[class|python:classes]]. It can **override** a method by defining another method of the same name. `super()` provides access to parent-class behavior when you want to extend rather than fully replace it. Inheritance is useful for genuine \"is a\" relationships, but a small object containing another object (composition) can be clearer than deep subclass trees.",
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
    "body": "lambda creates a small function from one expression. It is useful for [[sorting|python:sorting]] keys and simple callbacks, but normal def [[functions|python:functions]] are usually clearer for multi-step logic. A lambda cannot contain ordinary statements.\n\n`lambda` creates a small anonymous [[function|python:functions]] from a **single expression**. For example, `lambda n: -n` returns the negative of its argument, making it a simple `key` for [[sorting|python:sorting]]. A lambda can be stored in a variable, but a normal named `def` is often more readable when the calculation deserves explanation or takes multiple steps.",
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
    "body": "An [[iterable|python:for-loops]] can supply an iterator using iter(). The iterator returns one element at a time via next() until StopIteration. [[Lists|python:lists]] can be iterated repeatedly; some iterators are consumed as they run.\n\nAn **iterable** can produce an **iterator** using `iter()`. Calling `next(iterator)` retrieves the next value; after the last one it raises `StopIteration`. A [[for loop|python:for-loops]] performs those steps for you automatically. Some iterators, including [[generators|python:generators]], cannot be restarted after exhaustion. Lists are reusable iterables: calling `iter(my_list)` creates a fresh iterator each time.",
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
    "body": "Testing is the habit of exercising code with known inputs and expected results. [[assert|python:debugging]] is useful for simple development checks and unit tests. Include ordinary cases, boundary values and invalid inputs, and keep [[functions|python:functions]] small enough to test independently.\n\nA test runs code with a known input and checks its result. Use `assert actual == expected` for simple development checks, and exercise normal cases, edge cases (such as zero and empty collections), and invalid inputs. Assertions can be disabled when Python is run with optimization, so they should **not** be used as input validation or security checks. See [[debugging|python:debugging]] and [[exceptions|python:errors]].",
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
    "body": "PEP 8 recommends [[four spaces|python:indentation]] for each indentation level. Many editors let you press the Tab key to insert four spaces. A literal tab is a different character, and mixing tabs and spaces in a single indentation hierarchy can cause confusing [[errors|python:errors]]. Configure your editor consistently and use Shift+Tab to unindent.\n\nUse **four spaces** for each indentation level as recommended by PEP 8. In many editors, including this project's editor, pressing the **Tab key inserts four spaces**; it does not insert a literal tab character. Mixing literal tabs and spaces in indentation can cause a `TabError` or confusing alignment. The safest habit is consistent four-space indentation. See [[indentation and code blocks|python:indentation]] and [[errors|python:errors]].",
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
