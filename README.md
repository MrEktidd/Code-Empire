# Code-Empire

**Program a civilization from its first settlement to the stars.**

Code-Empire is an open-source browser-first programming and simulation game. Write real Python in a virtual project, automate settlers, and gradually build systems sophisticated enough to govern kingdoms, industries, planets and (eventually) galaxies.

**Current status:** Foundation **v0.1.0** — the first playable settlement slice. The later eras are planned, not implemented.

## Play

After GitHub Pages is enabled under **Settings → Pages → Build and deployment → GitHub Actions**, the live build will appear at:

https://mrektidd.github.io/Code-Empire/

The deployment workflow runs on every push to `main`, and pull requests receive build/test checks without deploying.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm ci
npm run dev
```

Test and build:

```bash
npm run check
npm run build
```

## How to play Foundation 0.1

1. Open `main.py` and use **Run script** to initialize the demonstration forestry and mining policies.
2. Play/pause, step through one simulation hour, or increase speed.
3. Edit `main.py`, add more .py files and change their per-file run frequencies.
4. Monitor the worker positions, harvested resources, settlement stockpiles and console.
5. Export your campaign regularly. Browsers may evict IndexedDB data, and data does not automatically sync across devices.

Each game tick represents an hour. While the site is closed, engine-managed standing jobs accumulate up to 336 hours of simulated offline progress (1 game hour per real minute). Player Python does **not** actually execute in the background. Instead, those scripts resume when you return.

Python is loaded on first execution from the pinned Pyodide CDN. An internet connection is needed for the first Python runtime download; subsequent use may benefit from browser cache.

## Current Python API

```python
def on_tick(world, memory):
    for worker in world.workers():
        if worker.role == "Forester":
            world.assign(worker.id, "wood")
        elif worker.role == "Miner":
            world.assign(worker.id, "stone")

    memory["runs"] = memory.get("runs", 0) + 1
    print(f"Automation ran {memory['runs']} times")
```

- `world.workers()` — worker snapshots with id, role, position, cargo and policy.
- `world.stockpile(resource)` — current stored stock.
- `world.assign(worker_id, "wood" | "stone" | "idle")` — persistent engine-managed orders, including offline catch-up.
- `world.order(worker_id, "gather", resource="wood")`, `world.order(id, "deposit")`, `world.order(id, "move", x=..., y=...)` — single commands.
- `world.log(message)` and `print(...)` — console output.
- `memory` — explicit JSON-serializable per-script memory that survives reloads.

## Development direction

See [architecture](docs/ARCHITECTURE.md). We plan to add a proper event scheduler, script editor tooling, simulation benchmarks, world modules, research, buildings, logistics, NPC settlements and many more interconnected systems.

## Security

Python runs client-side in a Web Worker, not in a secure sandbox. Do not execute code from untrusted sources. The game is not a cloud Python execution service.

## License

MIT. Community contributions, ideas, testing and code review are welcome.
