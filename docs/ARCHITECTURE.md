# Code-Empire — Programmer's Workbench v0.2

## Vision

One continuous civilization advances from settlement through kingdom, industry, orbital exploration and eventually interstellar empire. The game is programming-first: writing better software is how the player solves increasingly complex civilizational problems.

## Separation of concerns

- `src/engine/`: deterministic TypeScript simulation, stable identities, commands, scheduler and types.
- `src/runtime/`: real Python through a Pyodide Web Worker. Observes snapshots and submits commands; does not own world state.
- `src/docs/api.ts`: centralized API reference used by contextual documentation and CodeMirror completion.
- `src/learning/`: progression-based teaching modules with real gameplay outcome checks.
- `src/workspace/`: window state management and desktop/mobile presentation. Window visibility must never control script execution.
- `src/components/PythonEditor.tsx`: CodeMirror UI, separated from the runtime.
- `src/storage/`: new v0.2 IndexedDB campaign save, import/export, and separate window layout preferences.
- `src/App.tsx`: main menu and UI orchestration; progressively split into smaller features as they mature.

## Identity and controllers

Objects have immutable IDs like `npc_000001` and `farm_000001`. Controllers have independent immutable IDs, e.g. `ctrl_000001`. Their filenames, display names, and working folders are user-facing metadata, not references or primary keys.

Each controller has an owner (or null for global scripts), source, notes, per-script JSON-compatible memory, on/off schedule, interval, next due tick, status, error and recent output.

Each NPC and each operating building receives a default controller automatically. This is the foundation for future organizations, teams, machines, vehicles and space fleets. Objects may eventually be delegated to controllers higher in the organizational hierarchy. Delegation is not yet gameplay in v0.2.

## Execution and scheduling

A game tick represents one hour. The simulation clock is independent of frame rate.

The v0.2 scheduler locates every due controller (bounded batches), sorts by next due tick then controller ID, and runs Python against a consistent world snapshot. Individual failures do not abort unrelated controllers. Successful commands are validated against authoritative simulation state, with first-wins per-entity conflict rules; output and errors are attributed to their originating scripts.

Run Now does not enable scheduled execution. Pausing the simulation does not prevent manually running Python. One Web Worker holds a shared Pyodide interpreter while controller scopes and memory are reconstructed separately for each execution. The runtime can be terminated after a timeout, but this is **not** a security sandbox.

Future development: an event min-heap, explicit execution budgets for large organizations, per-object event subscriptions, deterministic command transactions, batch optimization and multi-resolution world simulation.

## Learning design

Learners first print a value, inspect attributes, issue NPC orders, observe ticks, use conditions, loop through collections, use persisted dictionary state, then schedule programs. Lessons verify actual execution output or changed world state; they are not mandatory progression gates.

Contextual Docs show only methods supported by the attached entity type. The world API is versioned and should remain source-compatible once the first stable public API is declared.

## Persistence and offline progression

This version deliberately starts with IndexedDB database `code-empire-v2` and world schema 2; **there is no v0.1 migration**. Source, notes, memory, due times, world state, and tutorial progress are saved. Layout preferences are separate in localStorage. Players can export/import the full campaign as JSON.

Offline catch-up applies engine standing policies only, capped at 336 ticks using one simulated hour for each real minute away. Arbitrary Python is never falsely reported as having run.

## Next era of programming

Organizations will become programmable entities with memberships, labor roles, supervisor ratios and transactional workforce assignments. Individual worker controllers remain inspectable and resumable if delegated to organizations. Shared templates will allow reuse of behaviors without thousands of duplicate source files. The engine must distinguish code reuse, hierarchical delegation and world simulation aggregation.

## Release process

Branches and PRs → TypeScript checking / Vitest → production Vite build → merge to main → GitHub Pages deployment. Release versions and future save migrations must be tracked separately.
