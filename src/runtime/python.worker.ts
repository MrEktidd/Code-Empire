/// <reference lib="webworker" />
/** Pyodide runs in a Web Worker to prevent UI hangs. This is not a secure Python sandbox. */
const ROOT = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
type VM = { globals: { set(name: string,value: unknown): void; get(name: string): unknown }; runPythonAsync(code:string): Promise<unknown> };
let vm: VM | null = null;
const RUNNER = [
'import json, io, sys',
'from types import SimpleNamespace',
'raw = json.loads(_ce_snapshot)',
'memory = json.loads(_ce_memory)',
'commands = []',
'class ObjectView:',
'    def __init__(self, record):',
'        self.__dict__.update(record)',
'    def order(self, task, resource=None, x=None, y=None):',
'        if self.id.startswith("npc_"):',
'            commands.append({"action":"order","workerId":self.id,"task":str(task),"resource":resource,"x":x,"y":y})',
'        else:',
'            raise ValueError("Only NPCs can use self.order().")',
'    def assign(self, resource):',
'        if not self.id.startswith("npc_"): raise ValueError("Only NPCs can use self.assign().")',
'        commands.append({"action":"assign","workerId":self.id,"resource":str(resource)})',
'    def set_mode(self, mode):',
'        if not self.id.startswith("farm_"): raise ValueError("Only farms can use self.set_mode().")',
'        commands.append({"action":"farm_mode","buildingId":self.id,"mode":str(mode)})',
'class World:',
'    def __init__(self, record):',
'        self.tick = record["tick"]; self.day = record["day"]; self.hour = record["hour"]',
'        self._stocks = record["stocks"]',
'        self._workers = [ObjectView(w) for w in record["workers"]]',
'        self._buildings = [ObjectView(b) for b in record["buildings"]]',
'    def workers(self): return list(self._workers)',
'    def buildings(self): return list(self._buildings)',
'    def get(self, entity_id):',
'        return next((e for e in self._workers + self._buildings if e.id == entity_id), None)',
'    def stockpile(self, resource): return self._stocks.get(resource, 0)',
'    def assign(self, worker_id, resource):',
'        commands.append({"action":"assign","workerId":str(worker_id),"resource":str(resource)})',
'    def order(self, worker_id, task, resource=None, x=None, y=None):',
'        commands.append({"action":"order","workerId":str(worker_id),"task":str(task),"resource":resource,"x":x,"y":y})',
'    def log(self, message): commands.append({"action":"log","message":str(message)})',
'world = World(raw)',
'owner = world.get(_ce_owner) if _ce_owner else None',
'namespace = {"world":world,"self":owner,"memory":memory,"__name__":"__main__"}',
'capture = io.StringIO()',
'original_stdout = sys.stdout',
'try:',
'    sys.stdout = capture',
'    exec(_ce_source, namespace, namespace)',
'    callback = namespace.get("on_tick")',
'    if callable(callback):',
'        if owner is None: callback(world, memory)',
'        else: callback(owner, world, memory)',
'finally:',
'    sys.stdout = original_stdout',
'output = capture.getvalue()[:6000].splitlines()[:40]',
'_ce_result = json.dumps({"commands":commands[:64],"memory":memory,"output":output})'
].join('\n');
async function initialize() {
  try {
    const module = await import(/* @vite-ignore */ ROOT + 'pyodide.mjs');
    vm = await module.loadPyodide({indexURL:ROOT}) as VM;
    self.postMessage({type:'ready'});
  } catch(error) { self.postMessage({type:'fatal',error:String(error)}); }
}
self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;
  if (msg?.type !== 'run' || !vm) return;
  try {
    vm.globals.set('_ce_source', msg.source);
    vm.globals.set('_ce_snapshot', JSON.stringify(msg.snapshot));
    vm.globals.set('_ce_memory', JSON.stringify(msg.memory ?? {}));
    vm.globals.set('_ce_owner', msg.ownerEntityId ?? null);
    await vm.runPythonAsync(RUNNER);
    self.postMessage({type:'result',id:msg.id,value:JSON.parse(String(vm.globals.get('_ce_result')))});
  } catch(error) { self.postMessage({type:'error',id:msg.id,error:String(error)}); }
};
void initialize();
