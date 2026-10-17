# Code Empire Architecture — v0.3.2

See [PLATFORM.md](PLATFORM.md) for the reusable Python programming workbench and [CONTENT.md](CONTENT.md) for content authoring.

## Principles
- **Composition, not definition inheritance.** Data definitions are explicit and namespaced; entities can have technical components and configurable gameplay module slots.
- **Universal identity, specialized state.** Workers, buildings, and generic entities share permanent IDs and definition references, but carry specialized fields for their respective simulation systems.
- **Internal technical components vs player-facing Modules.** Components name reusable engine capabilities (inventory, location, programmable, production, ownership); Modules are gameplay equipment, training, upgrades, or policies installed in compatible slots.
- **One authoritative command path.** Code Empire's command registry validates and applies both Python- and UI-originated actions; the generic Python runner never directly modifies game state.
- **Typed signals and relationships.** Simulations emit deterministic bounded event records; typed relationships connect entities without bloating individual entity structures.
- **Curated physical data.** Players combine available materials, items, recipes and modules; they do not arbitrarily overwrite basic material properties in the game.
- **Data-driven content.** Official content is loaded from definitions; registering a new compatible material, recipe, entity or Module should not require a new engine subclass.

## Responsibility boundaries
- `src/platform/`: reusable editor, Python worker, scheduling, docs, persistence primitives. No Code Empire-specific rules.
- `src/engine/definitions/`: typed, validated registries and content pack dependency resolution.
- `src/engine/entities/`: common identity references, generic entities and relationships.
- `src/engine/components/`: module-slot effect calculation and installation.
- `src/engine/systems/`: inventory and general simulation capabilities.
- `src/engine/commands/`: registration, permission validation and execution of game commands.
- `src/engine/events/`: typed, deterministic signals.
- `src/games/code-empire/content/base/`: built-in JSON content pack.
- `src/engine/world.ts`: settlement-specific state generation, worker simulation, snapshots and Genesis.
- `src/storage/db.ts`: Code Empire campaign validation and persistence; schema 5 starts fresh without legacy migration.

## Invariants
Entity IDs never depend on display names or filenames. Content IDs are `namespace:name`. Packs resolve dependencies in a stable order and reject invalid references or duplicate definitions. Simulation commands validate permissions and current state before being applied. Definitions are frozen following registration; copies of live entity state can change independently. Modules only add supported effects—they cannot create new simulation systems by naming them. Signals are bounded to recent history; subscriptions to callbacks are engine-side only in this release.

The v0.3.2 architecture explicitly does **not** implement population cohorts, physics-driven crafting, full vehicle logistics, research trees, or an untrusted-mod scripting sandbox.
