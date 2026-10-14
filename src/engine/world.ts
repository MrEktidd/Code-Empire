import { HEIGHT, WIDTH, WORLD_SCHEMA } from './types';
import type { ScriptCommand, Tile, Worker, WorldState } from './types';

function random01(seed: number, x: number, y: number): number {
  let n = (seed ^ Math.imul(x + 139, 374761393) ^ Math.imul(y + 53, 668265263)) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export function createWorld(seed = 2048): WorldState {
  const tiles: Tile[] = [];
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const r = random01(seed, x, y);
      let ground: Tile['ground'] = 'meadow';
      if (r < .22) ground = 'forest';
      else if (r < .32) ground = 'quarry';
      else if (r > .97) ground = 'water';
      const remaining = ground === 'forest' ? 24 + Math.floor(r * 100) : ground === 'quarry' ? 28 + Math.floor(r * 90) : 0;
      tiles.push({ x, y, ground, remaining });
    }
  }
  const set = (x: number, y: number, ground: Tile['ground'], remaining = 0) => {
    tiles[y * WIDTH + x] = { x, y, ground, remaining };
  };
  for (let y = 3; y <= 7; y++) for (let x = 2; x <= 5; x++) set(x, y, 'meadow');
  set(3, 5, 'stockpile');
  set(4, 7, 'farm');
  set(7, 4, 'forest', 72);
  set(9, 7, 'quarry', 65);
  return {
    schema: WORLD_SCHEMA, seed, tick: 0, tiles,
    workers: [
      { id: 'w1', name: 'Ada', role: 'Forester', x: 3, y: 5, carried: 0, carrying: null, capacity: 6, policy: null, task: null },
      { id: 'w2', name: 'Bram', role: 'Miner', x: 4, y: 5, carried: 0, carrying: null, capacity: 6, policy: null, task: null },
      { id: 'w3', name: 'Cora', role: 'Generalist', x: 3, y: 6, carried: 0, carrying: null, capacity: 6, policy: null, task: null }
    ],
    stocks: { wood: 12, stone: 6, food: 48 },
    totalHarvested: 0,
    events: ['Your settlement has been founded. Write Python to put your settlers to work.']
  };
}

const tileAt = (world: WorldState, x: number, y: number): Tile | undefined =>
  world.tiles[y * WIDTH + x];

function nearest(world: WorldState, unit: Worker, resource: 'wood' | 'stone'): Tile | undefined {
  const type = resource === 'wood' ? 'forest' : 'quarry';
  return world.tiles.filter(t => t.ground === type && t.remaining > 0)
    .sort((a, b) => (Math.abs(a.x - unit.x) + Math.abs(a.y - unit.y)) -
      (Math.abs(b.x - unit.x) + Math.abs(b.y - unit.y)) || a.y - b.y || a.x - b.x)[0];
}

function choosePolicyTask(world: WorldState, unit: Worker): void {
  if (!unit.policy) return;
  if (unit.carried >= unit.capacity || (unit.carried > 0 && unit.carrying !== unit.policy)) {
    unit.task = { kind: 'deposit', x: 3, y: 5 };
    return;
  }
  const target = nearest(world, unit, unit.policy);
  if (target) unit.task = { kind: 'gather', x: target.x, y: target.y, resource: unit.policy };
  else if (unit.carried > 0) unit.task = { kind: 'deposit', x: 3, y: 5 };
}

function moveToward(unit: Worker, x: number, y: number): void {
  if (unit.x !== x) unit.x += unit.x < x ? 1 : -1;
  else if (unit.y !== y) unit.y += unit.y < y ? 1 : -1;
}

function progressWorker(world: WorldState, unit: Worker): void {
  if (!unit.task) choosePolicyTask(world, unit);
  const task = unit.task;
  if (!task) return;
  if (unit.x !== task.x || unit.y !== task.y) { moveToward(unit, task.x, task.y); return; }
  if (task.kind === 'gather') {
    const tile = tileAt(world, task.x, task.y);
    const res = task.resource === 'stone' ? 'stone' : 'wood';
    if (tile && tile.ground === (res === 'wood' ? 'forest' : 'quarry') && tile.remaining > 0) {
      const amount = Math.min(unit.capacity - unit.carried, tile.remaining, 3);
      if (amount > 0 && (!unit.carrying || unit.carrying === res)) {
        tile.remaining -= amount;
        unit.carried += amount;
        unit.carrying = res;
        world.totalHarvested += amount;
        if (tile.remaining === 0) tile.ground = 'meadow';
      }
    }
  } else if (task.kind === 'deposit') {
    if (unit.carrying && unit.carried > 0) world.stocks[unit.carrying] += unit.carried;
    unit.carried = 0;
    unit.carrying = null;
  }
  unit.task = null;
}

export function stepWorld(previous: WorldState): WorldState {
  const state: WorldState = {
    ...previous,
    tick: previous.tick + 1,
    tiles: previous.tiles.map(t => ({ ...t })),
    workers: previous.workers.map(w => ({ ...w, task: w.task ? { ...w.task } : null })),
    stocks: { ...previous.stocks },
    events: [...previous.events]
  };
  for (const worker of state.workers) progressWorker(state, worker);
  if (state.tick % 24 === 0) {
    state.stocks.food += 9; // One farm, before population consumption.
    state.stocks.food = Math.max(0, state.stocks.food - state.workers.length * 2);
    if (state.stocks.food === 0 && state.tick % 48 === 0) state.events.push('Your settlers are going hungry.');
  }
  if (state.stocks.wood >= 60 && state.stocks.stone >= 24 && !state.events.some(e => e.startsWith('Milestone:'))) {
    state.events.push('Milestone: First Stockpiles — your settlement has secured 60 wood and 24 stone.');
  }
  return state;
}

export function applyCommands(previous: WorldState, commands: ScriptCommand[]): { world: WorldState; messages: string[] } {
  const world: WorldState = { ...previous, workers: previous.workers.map(w => ({ ...w, task: w.task ? { ...w.task } : null })) };
  const messages: string[] = [];
  for (const cmd of commands.slice(0, 64)) {
    if (cmd.action === 'log') {
      messages.push(String(cmd.message ?? '').slice(0, 180));
      continue;
    }
    const unit = world.workers.find(w => w.id === cmd.workerId);
    if (!unit) { messages.push('Unknown worker: ' + String(cmd.workerId)); continue; }
    if (cmd.action === 'assign') {
      if (cmd.resource === 'wood' || cmd.resource === 'stone' || cmd.resource === 'idle') {
        const nextPolicy = cmd.resource === 'idle' ? null : cmd.resource;
        if (unit.policy !== nextPolicy) {
          unit.policy = nextPolicy;
          unit.task = null;
          messages.push(unit.name + ': ' + (unit.policy ? 'automating ' + unit.policy : 'standing by'));
        }
      } else messages.push('Invalid resource assignment for ' + unit.name);
    } else if (cmd.action === 'order') {
      if (cmd.task === 'deposit') unit.task = { kind: 'deposit', x: 3, y: 5 };
      else if (cmd.task === 'gather' && (cmd.resource === 'wood' || cmd.resource === 'stone')) {
        const target = nearest(world, unit, cmd.resource);
        if (target) unit.task = { kind: 'gather', x: target.x, y: target.y, resource: cmd.resource };
        else messages.push('No ' + cmd.resource + ' deposit remains in range.');
      } else if (cmd.task === 'move' && Number.isInteger(cmd.x) && Number.isInteger(cmd.y) &&
        cmd.x! >= 0 && cmd.y! >= 0 && cmd.x! < WIDTH && cmd.y! < HEIGHT) {
        unit.task = { kind: 'move', x: cmd.x!, y: cmd.y! };
      } else messages.push('Invalid order for ' + unit.name);
    }
  }
  return { world, messages };
}

/** Engine-owned standing orders are the only automation allowed during offline catch-up.
 * Arbitrary Python code is never silently claimed to have run while the browser was closed. */
export function catchUp(previous: WorldState, elapsedMs: number): { world: WorldState; hours: number } {
  const hours = Math.min(336, Math.max(0, Math.floor(elapsedMs / 60_000)));
  let world = previous;
  for (let hour = 0; hour < hours; hour++) world = stepWorld(world);
  return { world, hours };
}

export function worldSnapshot(world: WorldState) {
  return {
    tick: world.tick,
    day: 1 + Math.floor(world.tick / 24),
    hour: world.tick % 24,
    stocks: world.stocks,
    workers: world.workers.map(w => ({
      id: w.id, name: w.name, role: w.role, x: w.x, y: w.y,
      carrying: w.carried, cargo_type: w.carrying, capacity: w.capacity,
      policy: w.policy
    }))
  };
}
