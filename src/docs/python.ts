export type PythonTopic = {
  id:string; category:string; title:string; summary:string; explanation:string;
  code:string; watch:string; keywords:string[];
};
export const PYTHON_CATEGORIES: string[] = [
  "Getting Started",
  "Data Types",
  "Collections",
  "Conditions & Loops",
  "Functions & Programs",
  "Working With Data",
  "Errors & Debugging",
  "Beyond the Basics",
  "Writing Good Code",
  "Code-Empire Python"
];
export const PYTHON_TOPICS: PythonTopic[] = [
  {
    "id": "python-start",
    "category": "Getting Started",
    "title": "How Python runs",
    "summary": "Read code from top to bottom and use indentation to group instructions.",
    "explanation": "Python is an interpreted programming language. In Code-Empire, a script defines an on_tick function that the game calls. Outside functions, normal Python statements run when the file is executed. Each script execution starts with a fresh local namespace, while the supplied memory dictionary can persist values across runs.",
    "code": "message = \"Hello, Empire!\"\nprint(message)\n\ndef greet(name):\n    print(\"Welcome,\", name)\n\ngreet(\"Ada\")",
    "watch": "Indent blocks with four spaces. Python is case-sensitive: Name and name are different.",
    "keywords": []
  },
  {
    "id": "comments",
    "category": "Getting Started",
    "title": "Comments and docstrings",
    "summary": "Explain the intention of your code without changing what it does.",
    "explanation": "A comment starts with # and is ignored by Python. Use comments for why something happens, not just to repeat the code. A triple-quoted string at the beginning of a function can document what that function does.",
    "code": "# An explanation for future you\nwood_target = 100\n\ndef needs_wood(stored):\n    \"\"\"Return True when the warehouse is below target.\"\"\"\n    return stored < wood_target\n\nprint(needs_wood(45))",
    "watch": "A triple-quoted string is still a string; it becomes a docstring in the appropriate location.",
    "keywords": []
  },
  {
    "id": "variables",
    "category": "Getting Started",
    "title": "Variables and assignment",
    "summary": "Give values readable names and update them as a program runs.",
    "explanation": "A variable is a name referring to an object. Use = to assign a value and == to compare values. Names should be meaningful and usually use snake_case. Python infers the type from the value; you don't need to declare a type before assignment.",
    "code": "wood = 12\nwood_gathered = 5\nwood = wood + wood_gathered\n\nsettlement_name = \"First Light\"\nprint(settlement_name, wood)",
    "watch": "= changes a variable. == asks whether two values are equal.",
    "keywords": []
  },
  {
    "id": "printing",
    "category": "Getting Started",
    "title": "print() and output",
    "summary": "Inspect values, understand a program, and display debugging messages.",
    "explanation": "print() writes readable output. In Code-Empire, print output appears in the controller's Output tab. Use commas to print multiple values without building a string yourself; use f-strings for formatted messages.",
    "code": "worker = \"Ada\"\nwood = 34\nprint(\"Worker:\", worker)\nprint(f\"{worker} collected {wood} wood\")",
    "watch": "Printing does not change the game world. It is a debugging and learning tool.",
    "keywords": []
  },
  {
    "id": "indentation",
    "category": "Getting Started",
    "title": "Indentation and code blocks",
    "summary": "Python uses whitespace to decide which statements belong together.",
    "explanation": "A colon usually introduces a new block, including if, for, while, def, and class statements. Indent the statements within a block by four spaces. Statements at the same indentation level belong to the same block.",
    "code": "amount = 8\nif amount >= 5:\n    print(\"Enough supplies\")\n    print(\"We can continue\")\nprint(\"This always runs\")",
    "watch": "Mixing tabs and spaces can cause indentation errors. The CodeMirror editor can insert spaces.",
    "keywords": []
  },
  {
    "id": "types",
    "category": "Getting Started",
    "title": "Understanding types",
    "summary": "Know what kind of data you are working with.",
    "explanation": "Every Python value has a type. Common types include int, float, str, bool, list, dict, tuple, set, and NoneType. type() tells you the type of a value. isinstance() is often better for checking whether a value belongs to a particular type.",
    "code": "values = [7, 3.5, \"Ada\", True, None]\nfor value in values:\n    print(repr(value), type(value).__name__)\n\nprint(isinstance(7, int))",
    "watch": "Strings and numbers are different. '7' + 3 raises TypeError; convert explicitly.",
    "keywords": []
  },
  {
    "id": "ints",
    "category": "Data Types",
    "title": "Integers · int",
    "summary": "Whole numbers such as worker counts, stockpiles, and map coordinates.",
    "explanation": "An int represents a whole number, positive or negative. Python integers can become very large, though your game API may enforce smaller ranges. // performs floor division; % returns the remainder. int() can convert valid numeric strings and truncate floats toward zero.",
    "code": "workers = 15\nsupervisors_needed = (workers + 6) // 7\nleft_over = workers % 7\nprint(supervisors_needed, left_over)\nprint(int(\"42\"))",
    "watch": "/ always produces a float. // rounds down, including for negative results.",
    "keywords": []
  },
  {
    "id": "floats",
    "category": "Data Types",
    "title": "Decimals · float",
    "summary": "Represent measurements, probabilities, ratios, and non-integer values.",
    "explanation": "float stores an approximate binary floating-point number. It is useful for distances, percentages and calculations. Round values for display with round(), but remember that rounding doesn't change the accuracy of the original measurement.",
    "code": "efficiency = 0.85\noutput = 12 * efficiency\nprint(output)\nprint(round(output, 1))\nprint(f\"Efficiency: {efficiency:.0%}\")",
    "watch": "0.1 + 0.2 may not equal exactly 0.3. Don't use exact equality for approximate decimals.",
    "keywords": []
  },
  {
    "id": "strings",
    "category": "Data Types",
    "title": "Text · str",
    "summary": "Names, labels, messages, and any textual data.",
    "explanation": "A str is a sequence of Unicode characters. Create one using single or double quotes. Combine text with +, repeat it with *, get its length with len(), and access individual characters with indexing. Strings cannot be changed in place.",
    "code": "name = \"Ada\"\nmessage = \"Hello, \" + name\nprint(message)\nprint(name[0])\nprint(len(message))\nprint(\"WOOD\".lower())",
    "watch": "'42' is text, not the number 42. Use int('42') before numeric arithmetic.",
    "keywords": []
  },
  {
    "id": "fstrings",
    "category": "Data Types",
    "title": "Formatted strings · f-strings",
    "summary": "Put variable values and formatted numbers directly into messages.",
    "explanation": "Prefix a string literal with f, then place expressions inside braces. F-strings make logging clearer. Formatting options allow precision, alignment, and thousands separators. The expressions inside braces are evaluated when the string is created.",
    "code": "worker = \"Bram\"\nwood = 12345\nefficiency = 0.876\nprint(f\"{worker} stored {wood:,} wood\")\nprint(f\"Efficiency: {efficiency:.1%}\")",
    "watch": "Use double braces {{ and }} if you need literal braces in an f-string.",
    "keywords": []
  },
  {
    "id": "booleans",
    "category": "Data Types",
    "title": "True and False · bool",
    "summary": "Represent yes/no conditions and determine branches of logic.",
    "explanation": "A bool has only two values: True and False. Comparisons produce booleans; and, or, and not combine them. Conditions also accept truthy and falsy values, such as non-empty lists and the number 0.",
    "code": "has_tools = True\nhas_wood = False\ncan_build = has_tools and has_wood\nprint(can_build)\nprint(not can_build)\nprint(9 > 4)",
    "watch": "Capitalization matters: True and False, not true and false.",
    "keywords": []
  },
  {
    "id": "none",
    "category": "Data Types",
    "title": "Missing values · None",
    "summary": "Represent the absence of a value, result, or entity.",
    "explanation": "None is a special singleton meaning no value is present. A function without a return statement returns None. Use is None and is not None to check for it. Code-Empire's world.get() returns None if an object ID cannot be found.",
    "code": "target = None\n\nif target is None:\n    print(\"No target selected yet\")",
    "watch": "None is different from 0, False, '', and an empty list.",
    "keywords": []
  },
  {
    "id": "converting",
    "category": "Data Types",
    "title": "Conversions and input types",
    "summary": "Convert between text, whole numbers, decimals, and booleans.",
    "explanation": "Python is dynamically typed but doesn't automatically combine unrelated types. Use int(), float(), str(), list(), and other constructors when a conversion makes sense. Invalid conversions raise exceptions.",
    "code": "number = int(\"16\")\ndistance = float(\"4.5\")\nmessage = \"Worker count: \" + str(number)\nprint(number + 4)\nprint(distance)\nprint(message)",
    "watch": "bool('False') is True because the string is not empty. Parse text explicitly.",
    "keywords": []
  },
  {
    "id": "lists",
    "category": "Collections",
    "title": "Lists · list (Python's everyday array)",
    "summary": "Store an ordered, editable collection of workers, IDs, or resources.",
    "explanation": "A list is Python's standard general-purpose array-like collection. Items can be of mixed types, can appear more than once, and are addressed by zero-based indices. Lists are mutable, so append(), pop(), and assignment can update them.",
    "code": "worker_ids = [\"npc_000001\", \"npc_000002\"]\nworker_ids.append(\"npc_000003\")\nprint(worker_ids[0])\nprint(len(worker_ids))\nworker_ids.remove(\"npc_000002\")\nprint(worker_ids)",
    "watch": "The first element has index 0. Accessing an index that doesn't exist raises IndexError.",
    "keywords": []
  },
  {
    "id": "tuples",
    "category": "Collections",
    "title": "Tuples · tuple",
    "summary": "Store an ordered group of values that shouldn't be reassigned.",
    "explanation": "Tuples look like lists but use parentheses and cannot be modified in place. They're useful for fixed coordinates, return values, or grouping related measurements. Tuples can contain mutable objects, so immutability is not always deep.",
    "code": "location = (4, 7)\nx, y = location\nprint(f\"Tile at {x}, {y}\")\n\nresult = (\"Ada\", 12)\nname, cargo = result",
    "watch": "A one-element tuple needs a trailing comma: (5,), not (5).",
    "keywords": []
  },
  {
    "id": "dicts",
    "category": "Collections",
    "title": "Dictionaries · dict",
    "summary": "Associate keys with values, such as worker assignments or stock counts.",
    "explanation": "A dictionary maps unique hashable keys to values. It is ideal for named properties, lookup tables, and persistent controller memory. Use square brackets to read or write a known key and get() to supply a default for missing keys.",
    "code": "jobs = {\"Ada\": \"wood\", \"Bram\": \"stone\"}\njobs[\"Cora\"] = \"idle\"\nprint(jobs[\"Ada\"])\nprint(jobs.get(\"Unknown\", \"unassigned\"))\nfor name, role in jobs.items():\n    print(name, role)",
    "watch": "Reading a missing key with [] raises KeyError. Use get() when missing keys are expected.",
    "keywords": []
  },
  {
    "id": "sets",
    "category": "Collections",
    "title": "Sets · set",
    "summary": "Keep unique items and compare groups efficiently.",
    "explanation": "Sets hold unique hashable values. They are useful for tracking assigned worker IDs, discovering overlap, and removing duplicates. Sets are not indexable or ordered like lists.",
    "code": "assigned = {\"Ada\", \"Bram\"}\navailable = {\"Bram\", \"Cora\", \"Dara\"}\nprint(available - assigned)\nprint(available & assigned)\nassigned.add(\"Cora\")",
    "watch": "Use set() to make an empty set. {} creates an empty dictionary.",
    "keywords": []
  },
  {
    "id": "index-slice",
    "category": "Collections",
    "title": "Indexing and slicing",
    "summary": "Take an item or subset from strings, lists, and tuples.",
    "explanation": "Indices start at 0. Negative indices count from the end. A slice uses [start:stop:step], includes start, and excludes stop. Slicing usually creates a new collection rather than editing the original.",
    "code": "workers = [\"Ada\", \"Bram\", \"Cora\", \"Dara\"]\nprint(workers[0])\nprint(workers[-1])\nprint(workers[1:3])\nprint(workers[:2])\nprint(workers[::-1])",
    "watch": "workers[1:3] returns items at positions 1 and 2, not position 3.",
    "keywords": []
  },
  {
    "id": "list-methods",
    "category": "Collections",
    "title": "Useful list methods",
    "summary": "Add, remove, find and reorder collection items.",
    "explanation": "append adds one item; extend adds all items from another iterable. pop removes and returns an item; remove deletes a matching value. sorted() returns a new list, while .sort() modifies the original list and returns None.",
    "code": "workers = [\"Cora\", \"Ada\"]\nworkers.append(\"Bram\")\nworkers.extend([\"Dara\", \"Eli\"])\nprint(sorted(workers))\nprint(workers.pop())\nprint(workers.index(\"Ada\"))",
    "watch": "Avoid changing a list while directly looping over it; build a new list or loop over a copy.",
    "keywords": []
  },
  {
    "id": "comprehensions",
    "category": "Collections",
    "title": "List and dict comprehensions",
    "summary": "Build collections from existing data with compact expressions.",
    "explanation": "A comprehension constructs a collection by iterating and optionally filtering. They're especially handy for finding available workers or building lookup maps. Prefer a normal loop when the comprehension becomes hard to read.",
    "code": "workers = [\n    {\"name\": \"Ada\", \"free\": True},\n    {\"name\": \"Bram\", \"free\": False},\n    {\"name\": \"Cora\", \"free\": True}\n]\nfree_names = [w[\"name\"] for w in workers if w[\"free\"]]\nprint(free_names)",
    "watch": "Readability wins: split complex nested comprehensions into smaller steps.",
    "keywords": []
  },
  {
    "id": "comparisons",
    "category": "Conditions & Loops",
    "title": "Comparisons and logic",
    "summary": "Make decisions from conditions, thresholds, and membership checks.",
    "explanation": "Comparisons include ==, !=, <, <=, >, >=, in, and not in. Use and when both conditions must hold, or when either is enough, and not to invert a condition. Python supports chained comparisons.",
    "code": "wood = 18\nmin_stock = 10\nmax_stock = 30\nprint(min_stock <= wood < max_stock)\nprint(wood > 0 and wood < 20)\nprint(\"Ada\" in [\"Ada\", \"Bram\"])",
    "watch": "Use == for equality and is for identity, especially is None.",
    "keywords": []
  },
  {
    "id": "if-elif",
    "category": "Conditions & Loops",
    "title": "if / elif / else",
    "summary": "Choose different actions depending on the current state.",
    "explanation": "Python checks the if condition first, then each elif until it finds a true branch. else runs if none matched. Blocks are indented and no braces are required.",
    "code": "wood = 18\nif wood < 10:\n    print(\"Critical shortage\")\nelif wood < 25:\n    print(\"Build reserve\")\nelse:\n    print(\"Stockpiles healthy\")",
    "watch": "Only the first matching branch runs.",
    "keywords": []
  },
  {
    "id": "for-loops",
    "category": "Conditions & Loops",
    "title": "for loops",
    "summary": "Process every item in a collection without repeating instructions.",
    "explanation": "A for loop visits elements of an iterable such as a list, string, tuple, or range. You can loop through dictionaries, or through world.workers() in a game script. The loop variable is reassigned each iteration.",
    "code": "workers = [\"Ada\", \"Bram\", \"Cora\"]\nfor worker in workers:\n    print(\"Checking\", worker)\n\nfor index in range(3):\n    print(\"Visit\", index)",
    "watch": "range(3) produces 0, 1, 2. It doesn't include the end value.",
    "keywords": []
  },
  {
    "id": "while-loops",
    "category": "Conditions & Loops",
    "title": "while loops and safety",
    "summary": "Repeat instructions until a condition changes.",
    "explanation": "A while loop repeats while its condition remains truthy. It is useful for bounded algorithms, but always make sure something changes to end the loop. break exits; continue moves to the next iteration.",
    "code": "count = 0\nwhile count < 3:\n    print(\"Round\", count)\n    count += 1\n\nprint(\"Finished\")",
    "watch": "An infinite while loop can time out your script. In Code-Empire, prefer scheduled on_tick calls for ongoing behavior.",
    "keywords": []
  },
  {
    "id": "range-enumerate",
    "category": "Conditions & Loops",
    "title": "range(), enumerate() and zip()",
    "summary": "Generate counts and pair related information during loops.",
    "explanation": "range provides a sequence of numbers; enumerate provides both an index and a value; zip pairs items from iterables. These built-ins often eliminate manual counter variables.",
    "code": "workers = [\"Ada\", \"Bram\", \"Cora\"]\njobs = [\"wood\", \"stone\", \"idle\"]\n\nfor number, name in enumerate(workers, start=1):\n    print(number, name)\n\nfor name, job in zip(workers, jobs):\n    print(name, \"→\", job)",
    "watch": "zip stops when the shortest iterable is exhausted unless you use strict=True.",
    "keywords": []
  },
  {
    "id": "break-continue",
    "category": "Conditions & Loops",
    "title": "break, continue and pass",
    "summary": "Control how loops and unfinished blocks behave.",
    "explanation": "break exits a loop early; continue skips to the next iteration. pass does nothing and is useful as a temporary placeholder while building a program.",
    "code": "workers = [\"Ada\", \"Bram\", \"Cora\"]\nfor name in workers:\n    if name == \"Bram\":\n        continue\n    print(name)\n    if name == \"Cora\":\n        break\n\ndef unfinished_feature():\n    pass",
    "watch": "pass is not the same as return: it does not exit a function.",
    "keywords": []
  },
  {
    "id": "functions",
    "category": "Functions & Programs",
    "title": "Defining functions",
    "summary": "Create reusable blocks of code with meaningful names.",
    "explanation": "Use def to define a function, then call it by name with parentheses. Parameters name the incoming values. A function can return a result, making it easier to test and reuse logic.",
    "code": "def required_supervisors(lumberjacks):\n    return (lumberjacks + 6) // 7\n\nprint(required_supervisors(7))\nprint(required_supervisors(8))",
    "watch": "Defining a function does not run its body until you call it.",
    "keywords": []
  },
  {
    "id": "parameters",
    "category": "Functions & Programs",
    "title": "Parameters, defaults and keyword arguments",
    "summary": "Write flexible functions that accept different inputs.",
    "explanation": "Parameters are names in a function definition. Arguments are values passed when calling it. Defaults make some arguments optional. Keyword arguments identify parameters by name and make calls clearer.",
    "code": "def describe_worker(name, role=\"generalist\"):\n    return f\"{name}: {role}\"\n\nprint(describe_worker(\"Ada\"))\nprint(describe_worker(\"Bram\", role=\"miner\"))",
    "watch": "Don't use a mutable list or dictionary as a default parameter unless you explicitly want it shared between calls.",
    "keywords": []
  },
  {
    "id": "return",
    "category": "Functions & Programs",
    "title": "return and None",
    "summary": "Send results from a function back to the code that called it.",
    "explanation": "return immediately exits a function and supplies a result. Without a return, a function returns None. Keep calculation functions separate from command-issuing functions when it helps you reason about code.",
    "code": "def has_enough_wood(current, needed):\n    return current >= needed\n\nready = has_enough_wood(27, 20)\nprint(ready)",
    "watch": "print() displays a value but doesn't return that value for later use.",
    "keywords": []
  },
  {
    "id": "scope",
    "category": "Functions & Programs",
    "title": "Scope and local variables",
    "summary": "Understand which variables belong to each function.",
    "explanation": "Names assigned inside a function are normally local to it. Parameters are local too. A function may read outer names, but altering global state makes code harder to reason about. Code-Empire provides explicit memory to persist across script runs.",
    "code": "target = 20\n\ndef needs_more(current):\n    shortage = target - current\n    return shortage > 0\n\nprint(needs_more(15))",
    "watch": "Don't expect local variables inside on_tick to survive the next scheduled execution.",
    "keywords": []
  },
  {
    "id": "modules",
    "category": "Functions & Programs",
    "title": "Imports and the standard library",
    "summary": "Reuse Python's bundled tools instead of rewriting them.",
    "explanation": "import loads a Python module into a namespace. The standard library includes math, statistics, collections, itertools, and many other useful modules. In a browser runtime, some modules requiring native OS or network services may be unavailable.",
    "code": "import math\nfrom collections import Counter\n\nprint(math.ceil(15 / 7))\ncounts = Counter([\"wood\", \"stone\", \"wood\"])\nprint(counts[\"wood\"])",
    "watch": "Importing a package does not mean every OS-dependent feature will work in the browser. Third-party packages may not be installed.",
    "keywords": []
  },
  {
    "id": "sorting",
    "category": "Working With Data",
    "title": "Sorting and key functions",
    "summary": "Rank candidates by skills, efficiency, or other computed properties.",
    "explanation": "sorted() returns a new list. Use key= to specify a comparison value, and reverse=True for descending order. Small lambda functions are useful for short one-off key expressions.",
    "code": "workers = [\n    {\"name\": \"Ada\", \"skill\": 34},\n    {\"name\": \"Bram\", \"skill\": 62},\n    {\"name\": \"Cora\", \"skill\": 48}\n]\nranking = sorted(workers, key=lambda w: w[\"skill\"], reverse=True)\nprint([w[\"name\"] for w in ranking])",
    "watch": "sorted() doesn't change the original list. list.sort() changes it in place.",
    "keywords": []
  },
  {
    "id": "builtins",
    "category": "Working With Data",
    "title": "len(), sum(), min(), max(), abs()",
    "summary": "Measure collections and calculate useful aggregates.",
    "explanation": "Python's built-in functions cover many common tasks. len counts elements, sum adds numbers, min/max find extremes, abs gives a nonnegative magnitude, and round formats numeric precision.",
    "code": "cargo = [4, 6, 2, 8]\nprint(len(cargo))\nprint(sum(cargo))\nprint(min(cargo), max(cargo))\nprint(sum(cargo) / len(cargo))",
    "watch": "Averages require handling an empty list to avoid division by zero.",
    "keywords": []
  },
  {
    "id": "any-all",
    "category": "Working With Data",
    "title": "any() and all()",
    "summary": "Check whether at least one or every condition is satisfied.",
    "explanation": "any() returns True if at least one element is truthy. all() returns True only if every element is truthy. They work well with generator expressions and make validation code concise.",
    "code": "stockpiles = {\"wood\": 70, \"stone\": 27, \"food\": 40}\nready = all(stockpiles[r] >= 20 for r in (\"wood\", \"stone\"))\nshortage = any(amount < 30 for amount in stockpiles.values())\nprint(ready, shortage)",
    "watch": "all([]) is True and any([]) is False—this matters when validating empty rosters.",
    "keywords": []
  },
  {
    "id": "strings-methods",
    "category": "Working With Data",
    "title": "Working with text",
    "summary": "Normalize, split, join, and search textual data.",
    "explanation": "String methods can clean up labels and parse simple text input. strip removes surrounding whitespace; split returns words or delimiter-separated chunks; join combines text; lower supports case-insensitive comparisons.",
    "code": "raw = \" Ada, Bram, Cora \"\nnames = [part.strip() for part in raw.split(\",\")]\nprint(names)\nprint(\" | \".join(names))\nprint(\"WOOD\".lower() == \"wood\")",
    "watch": "str.replace creates a new string; strings themselves cannot be modified in place.",
    "keywords": []
  },
  {
    "id": "errors",
    "category": "Errors & Debugging",
    "title": "Exceptions and tracebacks",
    "summary": "Understand why a program failed instead of guessing.",
    "explanation": "Python raises an exception when an operation fails. The traceback names the error type and the line involved. Common examples include NameError for unknown names, TypeError for incompatible operations, and KeyError for missing dictionary entries.",
    "code": "workers = {\"Ada\": \"wood\"}\ntry:\n    print(workers[\"Bram\"])\nexcept KeyError:\n    print(\"No assignment for Bram\")",
    "watch": "Catch specific errors. A bare except can hide genuine programming bugs.",
    "keywords": []
  },
  {
    "id": "try-except",
    "category": "Errors & Debugging",
    "title": "try / except / finally",
    "summary": "Handle expected failures without stopping an entire program.",
    "explanation": "Use try to protect an operation that might fail and except to handle named exception classes. else runs when no exception occurred; finally runs even when an exception happens. Use narrow handlers that only catch errors you can recover from.",
    "code": "raw = \"12\"\ntry:\n    workers = int(raw)\nexcept ValueError:\n    workers = 0\nelse:\n    print(\"Parsed successfully\")\nfinally:\n    print(\"Conversion attempted\")\nprint(workers)",
    "watch": "Use exceptions for genuinely exceptional cases, not as a replacement for every normal condition.",
    "keywords": []
  },
  {
    "id": "debugging",
    "category": "Errors & Debugging",
    "title": "Debugging with print and small tests",
    "summary": "Make failures reproducible and inspect one assumption at a time.",
    "explanation": "Start with a small input, print the key values, and verify one function's result. In Code-Empire, the controller Output tab reports prints and runtime exceptions. The game state is authoritative: submitting a command does not guarantee it was accepted.",
    "code": "def supervisors_needed(count):\n    result = (count + 6) // 7\n    print(\"count:\", count, \"result:\", result)\n    return result\n\nassert supervisors_needed(7) == 1\nassert supervisors_needed(8) == 2",
    "watch": "assert is useful for simple development checks, but is not a substitute for validating player-facing or external data.",
    "keywords": []
  },
  {
    "id": "classes",
    "category": "Beyond the Basics",
    "title": "Classes and objects",
    "summary": "Build custom types with attributes and methods.",
    "explanation": "A class defines a type. __init__ initializes each object, and self refers to the current instance. You can create your own helper classes, although Code-Empire world entities are exposed as game-controlled snapshots, not editable Python model objects.",
    "code": "class Crew:\n    def __init__(self, name, size):\n        self.name = name\n        self.size = size\n\n    def needs_supervisors(self):\n        return (self.size + 6) // 7\n\nteam = Crew(\"North\", 15)\nprint(team.needs_supervisors())",
    "watch": "A Python class object doesn't automatically create a game-world entity.",
    "keywords": []
  },
  {
    "id": "generators",
    "category": "Beyond the Basics",
    "title": "Generators and lazy iteration",
    "summary": "Produce values one at a time instead of creating a large list.",
    "explanation": "A generator expression lazily computes its values. yield inside a function turns it into a generator. They're useful when iterating large collections or building pipelines, but remember a generator is usually consumed once.",
    "code": "values = (n * n for n in range(5))\nprint(sum(values))\n\ndef countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nprint(list(countdown(3)))",
    "watch": "A generator expression is not a saved list. Convert it with list() when you need to inspect or reuse values.",
    "keywords": []
  },
  {
    "id": "type-hints",
    "category": "Beyond the Basics",
    "title": "Type hints",
    "summary": "Document the inputs and outputs you expect.",
    "explanation": "Type hints annotate names and function signatures. They improve readability and can help external development tools, but Python does not enforce them at runtime by default. Built-in generics such as list[str] and dict[str, int] are available in modern Python.",
    "code": "def crew_size(names: list[str]) -> int:\n    return len(names)\n\nassigned: dict[str, str] = {\"Ada\": \"wood\"}\nprint(crew_size(list(assigned)))",
    "watch": "A type annotation isn't input validation. Incorrect values can still be passed at runtime.",
    "keywords": []
  },
  {
    "id": "readable-code",
    "category": "Writing Good Code",
    "title": "Readable, maintainable Python",
    "summary": "Write programs you can understand and extend weeks later.",
    "explanation": "Favor descriptive names, small functions, clear control flow and named constants. Avoid repeating the same logic across dozens of workers. Comment the reason behind decisions and keep complex calculations separate from game commands.",
    "code": "SUPERVISOR_CAPACITY = 7\n\ndef required_supervisors(worker_count):\n    return (worker_count + SUPERVISOR_CAPACITY - 1) // SUPERVISOR_CAPACITY\n\nprint(required_supervisors(21))",
    "watch": "Shorter code isn't always better. Prioritize clarity over clever one-liners.",
    "keywords": []
  },
  {
    "id": "copy-mutation",
    "category": "Writing Good Code",
    "title": "Mutability, references and copying",
    "summary": "Know when two variables refer to the same list or dictionary.",
    "explanation": "Lists, sets, and dictionaries are mutable, and assignment copies a reference rather than duplicating the data. To avoid unexpected shared changes, use .copy(), slicing, or copy.deepcopy for nested structures.",
    "code": "original = [\"Ada\", \"Bram\"]\nalias = original\nseparate = original.copy()\n\nalias.append(\"Cora\")\nprint(original)   # Also contains Cora\nprint(separate)   # Still two workers",
    "watch": "dict.copy() and list.copy() are shallow. Nested objects may still be shared.",
    "keywords": []
  },
  {
    "id": "game-context",
    "category": "Code-Empire Python",
    "title": "The on_tick script pattern",
    "summary": "Put your decisions inside the function called by the simulation.",
    "explanation": "Each attached entity gets self, world, and memory. self is the entity receiving commands; world provides read-only observations and game command APIs; memory persists between executions. A global script has on_tick(world, memory) without self.",
    "code": "def on_tick(self, world, memory):\n    memory[\"visits\"] = memory.get(\"visits\", 0) + 1\n    print(f\"{self.name}: run {memory['visits']}\")\n    # See Game API for commands that affect the world.",
    "watch": "This section explains Python execution conventions. Supported self/world methods are documented separately in Game API.",
    "keywords": []
  },
  {
    "id": "game-limits",
    "category": "Code-Empire Python",
    "title": "Browser runtime and safe loops",
    "summary": "Write code that finishes promptly and lets the scheduler call it again.",
    "explanation": "Code-Empire runs Python via Pyodide in a browser worker. Scripts have an execution timeout and a limited command budget. Avoid blocking operations, infinite loops, and huge allocations. Use on_tick scheduling instead of a while True loop to create ongoing activity.",
    "code": "def on_tick(self, world, memory):\n    if world.tick % 24 == 0:\n        print(\"A new day at First Light\")\n    # Return promptly; the scheduler will call you again.",
    "watch": "Not all external Python packages and operating-system APIs are available in the browser. Python runs while the game is open; offline progress does not run user Python.",
    "keywords": []
  }
];
export function filterPythonTopics(query:string,category:string='All'):PythonTopic[]{
 const needle=query.trim().toLocaleLowerCase();
 return PYTHON_TOPICS.filter(t=>(category==='All'||t.category===category) && (
 !needle || [t.title,t.summary,t.explanation,t.code,...t.keywords].join(' ').toLocaleLowerCase().includes(needle)));
}
