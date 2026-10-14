# Code-Empire

**Program a civilization from its first settlement to the stars.**

Code-Empire is an open-source browser-based Python coding game. Program individual settlers, learn Python through real simulation challenges, and eventually build automated organizations, kingdoms, industries and interstellar civilizations.

**Current release:** v0.2 — **The Programmer's Workbench**. Kingdoms, industrial research and galactic exploration are future goals.

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
```

GitHub Actions checks PRs, then deploys `main` to GitHub Pages. For local testing use the development server rather than opening `index.html` directly.

The project is MIT licensed and welcomes community contributions. See [architecture](docs/ARCHITECTURE.md) for system boundaries.
