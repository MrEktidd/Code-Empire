import type {DocArticle} from '../../platform/documentation/types';
export const PYTHON_TOPICS:DocArticle[] = [
  {
    "id": "python-start",
    "scope": "python",
    "category": "Getting Started",
    "title": "How Python runs",
    "summary": "Read code from top to bottom and use indentation to group instructions.",
    "body": "A Python program runs statements in order. Indentation groups statements into blocks. In a normal script you can define functions, assign names, import modules and call functions. This language reference is independent of any particular game or application.",
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
    "body": "A comment starts with # and is ignored by Python. Use comments for why something happens, not just to repeat the code. A triple-quoted string at the beginning of a function can document what that function does.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "A variable is a name referring to an object. Use = to assign a value and == to compare values. Names should be meaningful and usually use snake_case. Python infers the type from the value; you don't need to declare a type before assignment.",
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
    "body": "print() writes readable output. In Code-Empire, print output appears in the controller's Output tab. Use commas to print multiple values without building a string yourself; use f-strings for formatted messages.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
    "example": "name = \"Taylor\"\nscore = 34\nprint(\"Name:\", name)\nprint(f\"{name} scored {score} points\")",
    "tip": "Printing does not change the game world. It is a debugging and learning tool.",
    "related": []
  },
  {
    "id": "indentation",
    "scope": "python",
    "category": "Getting Started",
    "title": "Indentation and code blocks",
    "summary": "Python uses whitespace to decide which statements belong together.",
    "body": "Python uses indentation, not braces, to group statements under a colon after if, for, while, def, class and similar constructs. In this editor, press Tab to insert four spaces; Shift+Tab removes one level. Four spaces are the normal style recommended by PEP 8. Literal tab characters are also recognized by Python, but spaces and tabs must not be mixed inconsistently within the same block. Changing visual tab width does not change what the interpreter reads.",
    "example": "amount = 8\nif amount >= 5:\n    print(\"Enough supplies\")\n    print(\"We can continue\")\nprint(\"This always runs\")",
    "tip": "Mixing tabs and spaces can cause indentation errors. The CodeMirror editor can insert spaces.",
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
    "body": "Every Python value has a type. Common types include int, float, str, bool, list, dict, tuple, set, and NoneType. type() tells you the type of a value. isinstance() is often better for checking whether a value belongs to a particular type.",
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
    "body": "An int represents a whole number, positive or negative. Python integers can become very large, though your game API may enforce smaller ranges. // performs floor division; % returns the remainder. int() can convert valid numeric strings and truncate floats toward zero.",
    "example": "items = 15\nboxes = (items + 6) // 7\nremainder = items % 7\nprint(boxes, remainder)\nprint(int(\"42\"))",
    "tip": "/ always produces a float. // rounds down, including for negative results.",
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
    "body": "float stores an approximate binary floating-point number. It is useful for distances, percentages and calculations. Round values for display with round(), but remember that rounding doesn't change the accuracy of the original measurement.",
    "example": "efficiency = 0.85\noutput = 12 * efficiency\nprint(output)\nprint(round(output, 1))\nprint(f\"Efficiency: {efficiency:.0%}\")",
    "tip": "0.1 + 0.2 may not equal exactly 0.3. Don't use exact equality for approximate decimals.",
    "related": []
  },
  {
    "id": "strings",
    "scope": "python",
    "category": "Data Types",
    "title": "Text · str",
    "summary": "Names, labels, messages, and any textual data.",
    "body": "A str is a sequence of Unicode characters. Create one using single or double quotes. Combine text with +, repeat it with *, get its length with len(), and access individual characters with indexing. Strings cannot be changed in place.",
    "example": "name = \"Taylor\"\nmessage = \"Hello, \" + name\nprint(message)\nprint(name[0])\nprint(len(message))\nprint(\"HELLO\".lower())",
    "tip": "'42' is text, not the number 42. Use int('42') before numeric arithmetic.",
    "related": []
  },
  {
    "id": "fstrings",
    "scope": "python",
    "category": "Data Types",
    "title": "Formatted strings · f-strings",
    "summary": "Put variable values and formatted numbers directly into messages.",
    "body": "Prefix a string literal with f, then place expressions inside braces. F-strings make logging clearer. Formatting options allow precision, alignment, and thousands separators. The expressions inside braces are evaluated when the string is created.",
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
    "body": "A bool has only two values: True and False. Comparisons produce booleans; and, or, and not combine them. Conditions also accept truthy and falsy values, such as non-empty lists and the number 0.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
    "example": "is_sunny = True\nis_warm = False\nnice_day = is_sunny and is_warm\nprint(nice_day)\nprint(not nice_day)\nprint(9 > 4)",
    "tip": "Capitalization matters: True and False, not true and false.",
    "related": []
  },
  {
    "id": "none",
    "scope": "python",
    "category": "Data Types",
    "title": "Missing values · None",
    "summary": "Represent the absence of a value, result, or entity.",
    "body": "None is a special singleton meaning no value is present. A function without a return statement returns None. Use is None and is not None to check for it. Functions commonly return None when no result is available.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "Python is dynamically typed but doesn't automatically combine unrelated types. Use int(), float(), str(), list(), and other constructors when a conversion makes sense. Invalid conversions raise exceptions.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "A Python list is a mutable, ordered collection of values. Think of it as the common Python equivalent of a general-purpose array. Lists can hold [[integer|python:ints]] values, [[string|python:strings]] values, even other lists, and may contain repeated elements. Indexing starts at zero: the first item is colors[0], and the last is colors[-1]. Use append() to add one element, extend() to add several, and [[slicing|python:index-slice]] to select a range. Compare with [[tuples|python:tuples]] for fixed sequences and [[dictionaries|python:dicts]] for keyed lookups.",
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
    "body": "Tuples look like lists but use parentheses and cannot be modified in place. They're useful for fixed coordinates, return values, or grouping related measurements. Tuples can contain mutable objects, so immutability is not always deep.",
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
    "body": "A dictionary maps unique hashable keys to values. It is ideal for named properties, lookup tables, and persistent controller memory. Use square brackets to read or write a known key and get() to supply a default for missing keys.",
    "example": "prices = {\"apple\": 2, \"banana\": 3}\nprices[\"orange\"] = 4\nprint(prices[\"apple\"])\nprint(prices.get(\"pear\", 0))\nfor name, price in prices.items():\n    print(name, price)",
    "tip": "Reading a missing key with [] raises KeyError. Use get() when missing keys are expected.",
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
    "body": "Sets hold unique hashable values. They are useful for tracking assigned item IDs, discovering overlap, and removing duplicates. Sets are not indexable or ordered like lists.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
    "example": "first = {\"red\", \"blue\"}\nsecond = {\"blue\", \"green\"}\nprint(first | second)\nprint(first & second)\nprint(first - second)\nfirst.add(\"yellow\")",
    "tip": "Use set() to make an empty set. {} creates an empty dictionary.",
    "related": []
  },
  {
    "id": "index-slice",
    "scope": "python",
    "category": "Collections",
    "title": "Indexing and slicing",
    "summary": "Take an item or subset from strings, lists, and tuples.",
    "body": "Indices start at 0. Negative indices count from the end. A slice uses [start:stop:step], includes start, and excludes stop. Slicing usually creates a new collection rather than editing the original.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
    "example": "colors = [\"red\", \"blue\", \"green\", \"yellow\"]\nprint(colors[0])\nprint(colors[-1])\nprint(colors[1:3])\nprint(colors[:2])\nprint(colors[::-1])",
    "tip": "workers[1:3] returns items at positions 1 and 2, not position 3.",
    "related": []
  },
  {
    "id": "list-methods",
    "scope": "python",
    "category": "Collections",
    "title": "Useful list methods",
    "summary": "Add, remove, find and reorder collection items.",
    "body": "append adds one item; extend adds all items from another iterable. pop removes and returns an item; remove deletes a matching value. sorted() returns a new list, while .sort() modifies the original list and returns None.",
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
    "body": "A comprehension constructs a collection by iterating and optionally filtering. They're especially handy for finding available items or building lookup maps. Prefer a normal loop when the comprehension becomes hard to read.",
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
    "body": "Comparisons include ==, !=, <, <=, >, >=, in, and not in. Use and when both conditions must hold, or when either is enough, and not to invert a condition. Python supports chained comparisons.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "Python checks the if condition first, then each elif until it finds a true branch. else runs if none matched. Blocks are indented and no braces are required.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "A for loop visits elements of an iterable such as a list, string, tuple, or range. You can loop through dictionaries, or through a list of names. The loop variable is reassigned each iteration.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "A while loop repeats as long as its condition is true. It is useful when the number of repetitions isn't known in advance. Always ensure the condition can eventually become false. Infinite loops, such as while True without a break, can freeze or exhaust an execution budget. Use for when iterating a known collection; use while when testing a changing condition.",
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
    "body": "range provides a sequence of numbers; enumerate provides both an index and a value; zip pairs items from iterables. These built-ins often eliminate manual counter variables.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "break exits a loop early; continue skips to the next iteration. pass does nothing and is useful as a temporary placeholder while building a program.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "Use def to define a function, then call it by name with parentheses. Parameters name the incoming values. A function can return a result, making it easier to test and reuse logic.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "Parameters are names in a function definition. Arguments are values passed when calling it. Defaults make some arguments optional. Keyword arguments identify parameters by name and make calls clearer.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "return immediately exits a function and supplies a result. Without a return, a function returns None. Keep calculation functions separate from command-issuing functions when it helps you reason about code.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "Names assigned inside a function are normally local to it. Parameters are local too. A function may read outer names, but altering global state makes code harder to reason about. Ordinary local variables do not persist between separate program executions unless an application explicitly saves state.",
    "example": "threshold = 20\n\ndef is_above(value):\n    difference = value - threshold\n    return difference > 0\n\nprint(is_above(25))",
    "tip": "Don't expect local variables inside on_tick to survive the next scheduled execution.",
    "related": []
  },
  {
    "id": "modules",
    "scope": "python",
    "category": "Functions & Programs",
    "title": "Imports and the standard library",
    "summary": "Reuse Python's bundled tools instead of rewriting them.",
    "body": "Python organizes reusable code into modules. Use import math to access math.ceil() or from collections import Counter to import a single name. The standard library includes many packages for numbers, text, statistics, dates and more. Some operating-system and network features may not be available in constrained environments such as browsers; the language itself remains the same.",
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
    "body": "sorted() returns a new list. Use key= to specify a comparison value, and reverse=True for descending order. Small lambda functions are useful for short one-off key expressions.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "Python's built-in functions cover many common tasks. len counts elements, sum adds numbers, min/max find extremes, abs gives a nonnegative magnitude, and round formats numeric precision.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "any() returns True if at least one element is truthy. all() returns True only if every element is truthy. They work well with generator expressions and make validation code concise.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "String methods can clean up labels and parse simple text input. strip removes surrounding whitespace; split returns words or delimiter-separated chunks; join combines text; lower supports case-insensitive comparisons.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
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
    "body": "Python raises an exception when an operation fails. The traceback names the error type and the line involved. Common examples include NameError for unknown names, TypeError for incompatible operations, and KeyError for missing dictionary entries.",
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
    "body": "Use try to protect an operation that might fail and except to handle named exception classes. else runs when no exception occurred; finally runs even when an exception happens. Use narrow handlers that only catch errors you can recover from.",
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
    "body": "Start with a small input, print the key values, and verify one function's result. In Code-Empire, the controller Output tab reports prints and runtime exceptions. The game state is authoritative: submitting a command does not guarantee it was accepted.",
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
    "body": "A class defines a type. __init__ initializes each object, and self refers to the current instance. You can create your own helper classes, although Objects you create with a class are ordinary Python objects.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
    "example": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n\nshape = Rectangle(3, 4)\nprint(shape.area())",
    "tip": "A Python class object doesn't automatically create a game-world entity.",
    "related": []
  },
  {
    "id": "generators",
    "scope": "python",
    "category": "Beyond the Basics",
    "title": "Generators and lazy iteration",
    "summary": "Produce values one at a time instead of creating a large list.",
    "body": "A generator expression lazily computes its values. yield inside a function turns it into a generator. They're useful when iterating large collections or building pipelines, but remember a generator is usually consumed once.",
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
    "body": "Type hints annotate names and function signatures. They improve readability and can help external development tools, but Python does not enforce them at runtime by default. Built-in generics such as list[str] and dict[str, int] are available in modern Python.",
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
    "body": "Favor descriptive names, small functions, clear control flow and named constants. Avoid repeating the same logic across dozens of items. Comment the reason behind decisions and keep complex calculations separate from function calls.",
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
    "body": "Lists, sets, and dictionaries are mutable, and assignment copies a reference rather than duplicating the data. To avoid unexpected shared changes, use .copy(), slicing, or copy.deepcopy for nested structures.\n\nTry changing one value in the example, predict what will happen, and then run it. When the result surprises you, check the data type, operator, or control flow involved.",
    "example": "original = [\"red\", \"blue\"]\nalias = original\nseparate = original.copy()\nalias.append(\"green\")\nprint(original)\nprint(separate)",
    "tip": "dict.copy() and list.copy() are shallow. Nested objects may still be shared.",
    "related": []
  },
  {
    "id": "operators",
    "scope": "python",
    "category": "Operators",
    "title": "Arithmetic operators",
    "summary": "Use Python's operators to calculate numbers.",
    "body": "Arithmetic operators include +, -, *, /, //, %, and **. Division / produces a float; // performs floor division; % gives a remainder; ** raises to a power. Parentheses clarify the order of operations.",
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
    "body": "Operators like +=, -=, *= and /= update a variable based on its previous value. They are equivalent to writing the longer expression in many cases. On mutable containers, augmented assignment may modify an object in place.",
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
    "body": "Python evaluates some operators before others. Multiplication is performed before addition; comparisons happen after arithmetic; and is evaluated before or. Parentheses make expressions explicit and reduce mistakes.",
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
    "body": "An if statement doesn't require an explicit bool. Empty strings, lists, tuples, dictionaries, sets, the number zero, and None are falsy. Nonempty collections and nonzero numbers are truthy. This lets you write simple checks for empty data.",
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
    "body": "The equality operator == checks whether two values compare equal. The identity operator is checks whether two names refer to the exact same object. Use is None when checking for None, but normally use == for numbers and strings.",
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
    "body": "Dictionary keys() provides keys, values() provides values, and items() provides key/value pairs. get() can provide a default when the key is absent. update() merges another mapping; pop() removes a key and returns its value.",
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
    "body": "Python can unpack elements of an iterable into separate names. Extended unpacking with a star collects remaining items into a list. Unpacking works for many data types, including tuples, lists, and values returned from functions.",
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
    "body": "A collection can contain other collections. A dictionary can store a list of numbers; a list can store dictionaries. Access the outer container first, then the inner one. Keep structures understandable and consider splitting deep data into helper functions.",
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
    "body": "A backslash introduces escape sequences inside a string: \\n means a newline and \\t means a tab. You can use different quote styles to reduce escaping. Raw strings beginning with r are helpful for regular expressions and Windows-style paths.",
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
    "body": "Format numeric values with f-strings. Use :.2f for two decimal places, :,.0f for thousands separators with no decimals, and :.1% for percentages. Formatting changes how a value is displayed, not its underlying numeric type.",
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
    "body": "The random standard-library module provides randint(), choice(), random(), and shuffle(). A random seed can reproduce a sequence of pseudorandom results, which is useful for tests. Programs requiring secure secrets should use dedicated cryptographic facilities.",
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
    "body": "The standard math module provides ceil(), floor(), sqrt(), pi, sin(), cos() and other mathematical operations. These functions are convenient for geometry, simulation, measurements and calculations.",
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
    "body": "The statistics module includes mean(), median(), mode(), stdev() and other descriptive tools. When handling empty or very small datasets, some functions raise exceptions. Validate input first.",
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
    "body": "JSON is a common interchange format for strings, numbers, booleans, lists, dictionaries with string keys, and null. json.dumps converts a Python value to JSON text; json.loads parses JSON text. Not every Python object, such as a set, can be serialized directly.",
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
    "body": "The re module provides pattern-based text searching. search() finds the first match anywhere; fullmatch() requires the entire string to match; findall() returns all matches. Use raw strings for patterns so backslashes are easier to read.",
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
    "body": "Use raise to produce an exception when a function's assumptions are violated. ValueError commonly signals that a value is unacceptable; TypeError signals an inappropriate type. Callers may catch appropriate exceptions.",
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
    "body": "A recursive function calls itself with a smaller input until a base case is reached. Recursion is helpful for tree-shaped structures or divide-and-conquer algorithms. Many straightforward loops are simpler and avoid recursion depth limits.",
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
    "body": "A class may inherit methods and attributes from a parent class. A subclass can add features or override a method. Use super() to call the parent class's implementation when appropriate. Composition may be simpler than inheritance for many designs.",
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
    "body": "lambda creates a small function from one expression. It is useful for sorting keys and simple callbacks, but normal def functions are usually clearer for multi-step logic. A lambda cannot contain ordinary statements.",
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
    "body": "An iterable can supply an iterator using iter(). The iterator returns one element at a time via next() until StopIteration. Lists can be iterated repeatedly; some iterators are consumed as they run.",
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
    "body": "Testing is the habit of exercising code with known inputs and expected results. assert is useful for simple development checks and unit tests. Include ordinary cases, boundary values and invalid inputs, and keep functions small enough to test independently.",
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
    "body": "PEP 8 recommends four spaces for each indentation level. Many editors let you press the Tab key to insert four spaces. A literal tab is a different character, and mixing tabs and spaces in a single indentation hierarchy can cause confusing errors. Configure your editor consistently and use Shift+Tab to unindent.",
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
