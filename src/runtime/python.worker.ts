/// <reference lib="webworker" />
/** Separate worker for untrusted-in-the-UI player scripts. This is NOT a hardened security sandbox. */
const PYODIDE_ROOT = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
type PythonVM = {
  globals: { set(name: string, value: unknown): void; get(name: string): unknown };
  runPythonAsync(source: string): Promise<unknown>;
};
let vm: PythonVM | null = null;

const RUNNER = `
import json, io, sys
raw = json.loads(_ce_snapshot)
commands = []
logs = []
mem = json.loads(_ce_memory)
class Unit:
    def __init__(self, entry):
        self.__dict__.update(entry)
class World:
    def __init__(self, entry):
        self.tick = entry["tick"]
        self.day = entry["day"]
        self.hour = entry["hour"]
        self._stocks = entry["stocks"]
        self._workers = [Unit(w) for w in entry["workers"]]
    def workers(self):
        return list(self._workers)
    def stockpile(self, resource):
        return self._stocks.get(resource, 0)
    def assign(self, worker_id, resource):
        commands.append({"action":"assign","workerId":str(worker_id),"resource":str(resource)})
    def order(self, worker_id, task, resource=None, x=None, y=None):
        commands.append({"action":"order","workerId":str(worker_id),"task":str(task),"resource":resource,"x":x,"y":y})
    def log(self, message):
        commands.append({"action":"log","message":str(message)})
world = World(raw)
namespace = {"world": world, "memory": mem, "__name__": "__main__"}
capture = io.StringIO()
old_stdout = sys.stdout
try:
    sys.stdout = capture
    exec(_ce_source, namespace, namespace)
    if callable(namespace.get("on_tick")):
        namespace["on_tick"](world, mem)
finally:
    sys.stdout = old_stdout
output = capture.getvalue().splitlines()[:40]
_ce_result = json.dumps({"commands":commands[:64],"memory":mem,"output":output})
`;

async function boot(): Promise<void> {
  try {
    // Vite leaves this explicitly-ignored remote ESM import unbundled.
    const pyModule = await import(/* @vite-ignore */ PYODIDE_ROOT + 'pyodide.mjs');
    vm = await pyModule.loadPyodide({ indexURL: PYODIDE_ROOT });
    self.postMessage({ type: 'ready' });
  } catch (error) {
    self.postMessage({ type: 'fatal', error: String(error) });
  }
}
self.onmessage = async (event: MessageEvent) => {
  const msg = event.data;
  if (msg?.type !== 'run' || !vm) return;
  try {
    vm.globals.set('_ce_source', msg.source);
    vm.globals.set('_ce_snapshot', JSON.stringify(msg.snapshot));
    vm.globals.set('_ce_memory', JSON.stringify(msg.memory ?? {}));
    await vm.runPythonAsync(RUNNER);
    self.postMessage({ type: 'result', id: msg.id, value: JSON.parse(String(vm.globals.get('_ce_result'))) });
  } catch (error) {
    self.postMessage({ type: 'error', id: msg.id, error: String(error) });
  }
};
void boot();
