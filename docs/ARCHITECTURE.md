# Code-Empire Architecture — v0.2.5

The canonical architectural specification for the reusable programming workbench is in [PLATFORM.md](PLATFORM.md).

The application has three explicit boundaries:

- **Programming platform:** generic Python execution, controller scheduling primitives, editing, documentation browser, workspace, save coordination and diagnostics.
- **Code-Empire module:** settlement world state, entities, command validators, Python bridge, game API articles and specialized game panels.
- **Python reference content:** reusable language documentation that contains no Code-Empire-specific assumptions.

See the repository README for play, setup, limitations and release notes.

Future game systems should implement adapters rather than modifying the generic Python runner. The simulation alone owns authoritative world state, while scripts propose validated commands. A worker executing Pyodide protects UI responsiveness but is not a hardened sandbox.
