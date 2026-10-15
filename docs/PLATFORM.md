# Reusable programming platform

v0.2.5 established the programming workbench from Code-Empire's simulated world.

## Boundaries

- `src/platform/python` contains the generic Pyodide worker, execution service and Python runner. It does **not** recognize NPC, farm, or resource types.
- `src/games/code-empire/pythonBridge.ts` constructs game-specific Python objects and commands from snapshots. The engine validates all requested commands.
- `src/platform/scheduling` executes bounded tasks and reports per-task outcomes without knowledge of simulated objects.
- `src/engine/scheduler.ts` is Code-Empire's scheduling *adapter*, responsible for due game controllers and authoritative command conflict resolution.
- `src/platform/persistence` manages serialized dirty state writes; `src/storage/db.ts` owns Code-Empire's saved campaign format.
- `src/platform/editor` implements CodeMirror and accepts completions as a prop; it does not import any Code-Empire API.
- `src/platform/documentation` implements the reusable tabbed document browser and cross-links using stable IDs.
- `src/content/python/topics.ts` holds game-independent Python reference material.
- `src/games/code-empire/docs.ts` converts game-specific APIs into reference articles.
- `src/games/WindowContent.tsx` renders Code-Empire-specific panels, while the application shell and window manager remain reusable.

## Extension model

To support a different game, provide:
1. A serializable world snapshot and simulation rules.
2. A Python bridge that exposes world-specific read-only snapshots and proposes validated commands.
3. A game scheduler adapter, controller definitions and associated persistence records.
4. Optional game-specific API documents and custom windows.

Reuse the generic editor, Python runner, documentation browser, windows, storage coordination and execution batch logic. The platform does not import the game adapter.

## Python scope and limitations

Player scripts run in a shared Pyodide instance within a dedicated Web Worker; this is **not a hardened sandbox**. Never encourage importing untrusted third-party scripts. Scripts have a per-execution watchdog and a bounded controller batch; command validity is checked before conflict ownership is granted.

Controller source revisions are merged against the latest player edits. A completed asynchronous execution updates diagnostics, memory and command results, not older source text. Manual runs do not reset automatic schedules.

## Documentation

Python language topics are environment-agnostic and must not reference settlers, buildings or Code-Empire data. Game APIs are authored separately and may cross-link to language topics. Both use the same browser with tabs, category navigation, search and independent pop-out windows. Beginning in v0.2.6, linked terms inside articles and related-topic references open destinations in new tabs without duplicating existing tabs; sidebar navigation reuses the current tab. Explicit links use `[[label|scope:stable-id]]` and are validated by tests. Cross-links use stable `scope:id` identifiers and are checked in tests.

## Release and testing

Run `npm run check`, `npm run build`, and `npm run test:e2e`. Unit tests cover generic task scheduling, write coordination, controller result merging, docs and simulation. Playwright runs desktop and mobile Chromium smoke tests in CI.
