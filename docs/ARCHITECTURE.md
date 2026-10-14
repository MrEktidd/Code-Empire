# Code-Empire architecture (Foundation 0.1)

## Vision

A single programmable civilization grows from a settlement into kingdoms, industry, orbital settlements, and eventually galactic civilizations. Earlier economic and logistics systems persist as the player's society scales.

## Architectural boundaries

- `src/engine/`: deterministic, serializable TypeScript world rules. No browser APIs, renderer, or interpreter imports.
- `src/runtime/`: isolated Python execution through a Pyodide Web Worker. All requests are snapshots; all results are bounded command proposals. It does not directly mutate world objects.
- `src/storage/`: browser persistence, import/export and schema validation. No simulator-specific UI.
- `src/App.tsx`: initial UI and orchestration (to be broken into panels as we expand).
- `src/defaults.ts`: example player scripts.

## Authoritative simulation

Each tick represents one game hour. The React rendering cadence is separate. Python scripts have per-file schedules; the core simulation does not run Python synchronously in the rendering thread.

Commands are checked by `applyCommands`. The next milestone will implement an event heap with stable ordering for construction, travel and multiple world-system frequencies, and snapshot/commit conflict handling when several scripts are due simultaneously. The current foundation uses simple hour-based schedules and serial execution.

## Browser persistence

IndexedDB stores one versioned campaign with player scripts, per-script serializable memory, scheduled run times and world state. Source file edits persist independently from Python VM lifetime. Export/import uses JSON. Future save schemas must have migrations and recoverable backups. For multi-year campaigns, use chunked records and periodic snapshots.

## Offline progress

Catch-up is capped at 336 simulated hours at 1 hour per real minute. Engine-owned standing orders are processed during catch-up. Arbitrary player Python scripts are not run in the background and are not claimed to have run offline. Their next scheduled run resumes when the player returns. We will later add bounded script replay and analytical production for large-scale catch-up.

## Security and limits

Pyodide in a Web Worker keeps Python from blocking the UI. Scripts have a 2-second per-execution wall-clock budget and 64-command limit. A stalled worker is destroyed and recreated. **A Web Worker is not a hostile-code sandbox.** Players should not paste untrusted code, and scripts may have access to browser-side capabilities made available by Pyodide. Avoid storing secrets on the game origin. Content sharing and multiplayer execution need hardened isolation and separate security review.

## Scaling plan

Introduce entity IDs, spatial partitions, an event min-heap, production batching, and resolution-based simulation LOD before expanding the world beyond one settlement. All domain modules must implement pure state transition functions with deterministic seeds, test fixtures, and explicit save schema versions.
