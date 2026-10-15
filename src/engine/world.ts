import { HEIGHT, WIDTH, WORLD_SCHEMA } from './types';
import type { Building, ScriptCommand, Tile, Worker, WorldState } from './types';

function random01(seed: number, x: number, y: number): number {
  let n = (seed ^ Math.imul(x + 139, 374761393) ^ Math.imul(y + 53, 668265263)) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
/** Before Empire.initialize() runs, no terrain or people have been generated. */
export function createPendingWorld(seed = 2048): WorldState {
  return {schema:WORLD_SCHEMA,seed,tick:0,phase:'dormant',housingCapacity:3,tiles:[],
    workers:[],buildings:[],stocks:{wood:0,stone:0,food:0},totalHarvested:0,events:[]};
}

/** includePrototypeEntities keeps existing v0.2 fixtures and saves testable.
 * New v0.3 simulations create a natural environment without initial citizens.
 */
export function createWorld(seed = 2048, includePrototypeEntities = true): WorldState {
  const tiles: Tile[] = [];
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
    const r = random01(seed, x, y);
    let ground: Tile['ground'] = 'meadow';
    if (r < .22) ground = 'forest';
    else if (r < .32) ground = 'quarry';
    else if (r > .97) ground = 'water';
    const remaining = ground === 'forest' ? 24 + Math.floor(r * 100) : ground === 'quarry' ? 28 + Math.floor(r * 90) : 0;
    tiles.push({ x, y, ground, remaining });
  }
  const set = (x: number, y: number, ground: Tile['ground'], remaining = 0) => { tiles[y * WIDTH + x] = { x, y, ground, remaining }; };
  for (let y = 3; y <= 7; y++) for (let x = 2; x <= 5; x++) set(x, y, 'meadow');
  set(3, 5, 'stockpile'); if (includePrototypeEntities) set(4, 7, 'farm'); set(7, 4, 'forest', 72); set(9, 7, 'quarry', 65);
  const worker = (id: string, name: string, role: string, x: number, y: number): Worker =>
    ({ id, name, role, x, y, carried: 0, carrying: null, capacity: 6, policy: null,
      task: null, organizationId: null, controlMode: 'independent' });
  const farm: Building = { id: 'farm_000001', name: 'First Light Farm', type: 'farm', x: 4, y: 7, mode: 'food',
    organizationId: null, controlMode: 'independent' };
  return { schema: WORLD_SCHEMA, seed, tick: 0, phase:'active', housingCapacity:3, tiles,
    buildings: includePrototypeEntities ? [farm] : [],
    workers: includePrototypeEntities ? [worker('npc_000001', 'Ada', 'Forester', 3, 5),
      worker('npc_000002', 'Bram', 'Miner', 4, 5),
      worker('npc_000003', 'Cora', 'Generalist', 3, 6)] : [],
    stocks: { wood: 12, stone: 6, food: 48 }, totalHarvested: 0,
    events: includePrototypeEntities
      ? ['First Light founded. Open Ada’s controller and begin your Python lessons.']
      : ['Simulation initialized. A habitable clearing awaits its first inhabitants.'] };
}
export function createCivilizationWorld(seed = 2048): WorldState {
  return createWorld(seed, false);
}
}
function nearest(world: WorldState, unit: Worker, resource: 'wood' | 'stone'): Tile | undefined {
  const type = resource === 'wood' ? 'forest' : 'quarry';
  return world.tiles.filter(t => t.ground === type && t.remaining > 0)
    .sort((a, b) => (Math.abs(a.x - unit.x) + Math.abs(a.y - unit.y)) -
      (Math.abs(b.x - unit.x) + Math.abs(b.y - unit.y)) || a.y - b.y || a.x - b.x)[0];
}
function choosePolicyTask(world: WorldState, unit: Worker): void {
  if (!unit.policy) return;
  if (unit.carried >= unit.capacity || (unit.carried > 0 && unit.carrying !== unit.policy)) {
    unit.task = { kind: 'deposit', x: 3, y: 5 }; return;
  }
  const target = nearest(world, unit, unit.policy);
  if (target) unit.task = { kind: 'gather', x: target.x, y: target.y, resource: unit.policy };
  else if (unit.carried > 0) unit.task = { kind: 'deposit', x: 3, y: 5 };
}
function progressWorker(world: WorldState, unit: Worker): void {
  if (!unit.task) choosePolicyTask(world, unit);
  const task = unit.task;
  if (!task) return;
  if (unit.x !== task.x || unit.y !== task.y) {
    if (unit.x !== task.x) unit.x += unit.x < task.x ? 1 : -1;
    else unit.y += unit.y < task.y ? 1 : -1;
    return;
  }
  if (task.kind === 'gather') {
    const tile = world.tiles[task.y * WIDTH + task.x];
    const res = task.resource === 'stone' ? 'stone' : 'wood';
    if (tile && tile.ground === (res === 'wood' ? 'forest' : 'quarry') && tile.remaining > 0) {
      const amount = Math.min(unit.capacity - unit.carried, tile.remaining, 3);
      if (amount > 0 && (!unit.carrying || unit.carrying === res)) {
        tile.remaining -= amount; unit.carried += amount; unit.carrying = res; world.totalHarvested += amount;
        if (tile.remaining === 0) tile.ground = 'meadow';
      }
    }
  } else if (task.kind === 'deposit') {
    if (unit.carrying && unit.carried > 0) world.stocks[unit.carrying] += unit.carried;
    unit.carried = 0; unit.carrying = null;
  }
  unit.task = null;
}
export function stepWorld(previous: WorldState): WorldState {
  if (previous.phase === 'dormant') return previous;
  const state: WorldState = {
    ...previous, tick: previous.tick + 1,
    tiles: previous.tiles.map(t => ({ ...t })),
    workers: previous.workers.map(w => ({ ...w, task: w.task ? { ...w.task } : null })),
    buildings: previous.buildings.map(b => ({ ...b })),
    stocks: { ...previous.stocks }, events: [...previous.events]
  };
  for (const worker of state.workers) progressWorker(state, worker);
  if (state.tick % 24 === 0) {
    for (const farm of state.buildings) if (farm.mode === 'food') state.stocks.food += 9;
    state.stocks.food = Math.max(0, state.stocks.food - state.workers.length * 2);
    if (state.stocks.food === 0 && state.tick % 48 === 0) state.events.push('Food shortage: your settlers are going hungry.');
  }
  if (state.stocks.wood >= 60 && state.stocks.stone >= 24 && !state.events.some(e => e.startsWith('Milestone:')))
    state.events.push('Milestone: First Stockpiles — 60 wood and 24 stone secured.');
  return state;
}
export function applyCommands(previous: WorldState, commands: ScriptCommand[]): { world: WorldState; messages: string[] } {
  let world: WorldState = {
    ...previous, workers: previous.workers.map(w => ({ ...w, task: w.task ? { ...w.task } : null })),
    buildings: previous.buildings.map(b => ({ ...b }))
  };
  const messages: string[] = [];
  for (const cmd of commands.slice(0, 64)) {
    if (cmd.action === 'initialize') {
      if (world.phase === 'active') {messages.push('Simulation already initialized.');continue;}
      world = createCivilizationWorld(world.seed);
      messages.push('Simulation initialized. Physical environment generated.');
      continue;
    }
    if (world.phase === 'dormant' && cmd.action !== 'log') {
      messages.push('Initialize the simulation with Empire.initialize() first.');
      continue;
    }
    if (cmd.action === 'log') { messages.push(String(cmd.message ?? '').slice(0, 180)); continue; }
    if (cmd.action === 'farm_mode') {
      const farm = world.buildings.find(b => b.id === cmd.buildingId);
      if (!farm || !['food','rest','resting'].includes(cmd.mode??'')) messages.push('Invalid farm mode command');
      else { farm.mode = cmd.mode === 'resting' ? 'rest' : cmd.mode as 'food'|'rest'; messages.push(farm.name + ': ' + farm.mode); }
      continue;
    }
    const unit = world.workers.find(w => w.id === cmd.workerId);
    if (!unit) { messages.push('Unknown worker: ' + String(cmd.workerId)); continue; }
    if (cmd.action === 'assign') {
      if (cmd.resource === 'wood' || cmd.resource === 'stone' || cmd.resource === 'idle') {
        const nextPolicy = cmd.resource === 'idle' ? null : cmd.resource;
        if (unit.policy !== nextPolicy) { unit.policy = nextPolicy; unit.task = null; messages.push(unit.name + ': ' + (nextPolicy ?? 'idle')); }
      } else messages.push('Invalid resource: ' + String(cmd.resource));
    } else if (cmd.action === 'order') {
      if (cmd.task === 'deposit') unit.task = { kind: 'deposit', x: 3, y: 5 };
      else if (cmd.task === 'gather' && (cmd.resource === 'wood' || cmd.resource === 'stone')) {
        const target = nearest(world, unit, cmd.resource);
        if (target) unit.task = { kind: 'gather', x: target.x, y: target.y, resource: cmd.resource };
        else messages.push('No ' + cmd.resource + ' deposits remain.');
      } else if (cmd.task === 'move' && Number.isInteger(cmd.x) && Number.isInteger(cmd.y) &&
        cmd.x! >= 0 && cmd.y! >= 0 && cmd.x! < WIDTH && cmd.y! < HEIGHT) {
        unit.task = { kind: 'move', x: cmd.x!, y: cmd.y! };
      } else messages.push('Invalid order for ' + unit.name);
    }
  }
  return { world, messages };
}
/** Offline progress executes established engine-owned policies, not player Python. */
export function catchUp(previous: WorldState, elapsedMs: number): { world: WorldState; hours: number } {
  const hours = Math.min(336, Math.max(0, Math.floor(elapsedMs / 60_000)));
  let world = previous;
  for (let i = 0; i < hours; i++) world = stepWorld(world);
  return { world, hours };
}
export function worldSnapshot(world: WorldState) {
  return {
    tick: world.tick, day: 1 + Math.floor(world.tick / 24), hour: world.tick % 24,
    phase: world.phase, housing_capacity: world.housingCapacity,
    stocks: { ...world.stocks },
    workers: world.workers.map(w => ({
      id: w.id, name: w.name, role: w.role, x: w.x, y: w.y,
      carried: w.carried, carrying: w.carried, cargo_type: w.carrying,
      capacity: w.capacity, policy: w.policy, control_mode: w.controlMode
    })),
    buildings: world.buildings.map(b => ({
      id: b.id, name: b.name, type: b.type, x: b.x, y: b.y, mode: b.mode
    }))
  };
}
