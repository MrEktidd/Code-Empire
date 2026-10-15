# Code-Empire

**Program a civilization from its first settlement to the stars.**

Code-Empire is an open-source browser-based Python coding game. Program individual settlers, learn Python through real simulation challenges, and eventually build automated organizations, kingdoms, industries and interstellar civilizations.

**Current release:** v0.2.6 — **The Programmer's Workbench** with a dedicated, ungated Python Reference handbook. Kingdoms, industrial research and galactic exploration are future goals.

## Play

After GitHub Pages is configured to use GitHub Actions: https://mrektidd.github.io/Code-Empire/

The main menu offers **New Empire**, **Continue Campaign**, and **Import Campaign**. New games begin in the settlement age with three NPCs and a farm. The default workbench opens a world map, script explorer, and **Learn Python** academy.

## Learn Python: Start here

1. Open **Learn Python** (✧) in the left navigation rail.
2. Follow the sequential hands-on lessons. They introduce `print()`, functions, attributes, methods, ticks, conditionals, loops, dictionaries, and scheduling.
3. Open Ada's controller `ada.py`, edit real Python, and click **Run Script**.
4. See printed messages in its **Output** tab. The system checks game results, not simply text patterns.
5. Use the contextual **Docs** tab for exact methods available to the currently selected entity. Show a hint or load a worked example if needed.
6. Toggle **Auto-run** and choose an execution interval to automate an object.
7. Select NPCs or the farm on the world map to open their individual script windows.

The lessons are optional and can be completed while experimenting with the rest of the simulation. This is a learning prototype, not yet a complete Python course.

## Python Reference — always available

The **Python Reference** is a separate button in the left rail, independent of both **Learn Python** milestones and **Game API**. It has 65 searchable articles across 10 sections on Python syntax, built-in types (int, float, str, bool), lists (the standard Python array-like container), dictionaries, tuples, sets, control flow, functions, modules, exceptions, debugging and readable code.

Every article has plain-language explanations, a runnable Python example, common mistakes and a copy-example control. Relevant concepts inside articles are linked like an encyclopedia: following a link opens a new documentation tab, preserves your previous article, and focuses an existing tab instead of duplicating it. Links from Game API articles also take you to the Python Reference. Search and browse any article immediately—nothing is gated behind lesson progress. The learning academy has a shortcut to relevant reference articles when a concept is introduced.

The **Game API** remains the reference for world-specific commands such as `self.order()` and `world.workers()`. Script-attached Docs tabs still show the APIs available to each entity type. This separation is intentional: Python language concepts are documented independently of Code-Empire systems.

## Object controllers

Every programmable object has an **immutable entity ID** and its own Python script:

- Ada: `npc_000001` → `ada.py`
- Bram: `npc_000002` → `bram.py`
- Cora: `npc_000003` → `cora.py`
- First Light Farm: `farm_000001` → `first_light_farm.py`

Controller files may be renamed without changing their identity or the objects they control. A separate global `main.py` controller can coordinate the whole world.

```python
def on_tick(self, world, memory):
    if world.stockpile("wood") < 100:
        self.assign("wood")
    else:
        self.assign("idle")
```

A farm controller can issue `self.set_mode("food")` or `self.set_mode("rest")`. The farm independently generates daily resources.

Scripts are proposed actions: Python cannot directly overwrite the authoritative game state. Controller executions, memory, notes, source and schedules persist in IndexedDB.

## Workspace

Desktop script windows support dragging, resizing, maximizing, minimizing and restoring via the taskbar. The left navigation rail opens the world, scripts, documentation, academy, overview and console. Script windows contain **Code / Docs / Notes / Output** tabs.

On mobile, windows become full-screen panels selectable from the taskbar.

The Python editor uses CodeMirror 6 with highlighting, auto-indentation, line numbers, brackets, search and API completion. Documentation entries use the same centralized API registry as editor completion.

## Simulation, offline progress and safety

One tick is one game hour. Due controllers execute in deterministic order with a per-execution timeout and command cap. Commands are validated at the end of each execution batch; the first valid command to an object takes precedence when there are conflicts.

Offline progress is limited to 336 hours at **one simulated hour per real minute away**. This only advances established, engine-managed worker policies and production. Player Python **does not execute** in the background while the browser is closed.

Campaigns autosave in browser IndexedDB. Export JSON backups often; website storage can be cleared. v0.2 deliberately begins with a new save schema and **does not import or migrate v0.1 saves**.

Pyodide runs real Python in a Web Worker and loads from a pinned CDN URL. A worker prevents normal UI blocking but is **not a hardened security sandbox**. Do not paste scripts from untrusted sources.

## Development

Requires Node.js 22+ and npm:

```bash
npm install
npm run dev
npm run check
npm run build
npm run test:e2e
```

GitHub Actions checks PRs, then deploys `main` to GitHub Pages. For local testing use the development server rather than opening `index.html` directly.

The project is MIT licensed and welcomes community contributions. See [architecture](docs/ARCHITECTURE.md) for system boundaries.

## v0.2.5 — Reusable engine and workbench

v0.2.5 separates the reusable Python runtime, workbench and documentation browser from the Code-Empire settlement simulation. The documentation library now has 65 game-agnostic topics, clickable links, tabs and independent pop-out windows. The Game API uses the same browser. The editor uses Tab = four spaces, larger/smaller font controls, keyboard Run and error diagnostics. Autosaving uses a bounded dirty-state coordinator, and script executions can no longer overwrite newer source edits. A source history tab keeps recent run checkpoints. The menu labels the prototype **Early Alpha**. See [platform architecture](docs/PLATFORM.md).

## v0.2.6 — Reference navigation

This maintenance update adds contextual, linked Python concepts across all 65 language articles, and links from Game API explanations into Python Reference topics. In-text and related links open a new documentation tab by default; existing tabs are reused rather than duplicated. Sidebar navigation still uses the current tab. The redundant '+ Tab' actions were removed; independently movable Pop Out windows remain available.
