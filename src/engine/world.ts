import { HEIGHT, WIDTH, WORLD_SCHEMA } from './types';
import type { Building, FounderRecord, Tile, Worker, WorldState } from './types';
import {emitSignal} from './events/bus';
import {advancePhysicalJobs,harvestEligibility} from './automation';
export {applyCommands} from './commands/registry';

function random01(seed: number, x: number, y: number): number {
  let n = (seed ^ Math.imul(x + 139, 374761393) ^ Math.imul(y + 53, 668265263)) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
/** Before Empire.initialize() runs, no terrain or people have been generated. */
export function createPendingWorld(seed = 2048): WorldState {
  return {schema:WORLD_SCHEMA,seed,tick:0,phase:'dormant',housingCapacity:3,tiles:[],
    workers:[],buildings:[],entities:[],jobs:[],relationships:[],signals:[],genesisArchive:[],stocks:{wood:0,stone:0,food:0},totalHarvested:0,events:[]};
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
    ({ id, definitionId:'core:founder',installedModules:{}, name, role, x, y, carried: 0, carrying: null, capacity: 6, policy: null,
      task: null, organizationId: null, controlMode: 'independent' });
  const farm: Building = { id: 'farm_000001', definitionId:'core:farm',installedModules:{}, name: 'First Light Farm', type: 'farm', x: 4, y: 7, mode: 'food',
    organizationId: null, controlMode: 'independent' };
  return { schema: WORLD_SCHEMA, seed, tick: 0, phase:'active', housingCapacity:3, tiles,
    buildings: includePrototypeEntities ? [farm] : [],entities:[],jobs:[],relationships:[],signals:[],genesisArchive:[],
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
/** Genesis is a single all-or-nothing founding event, not repeatable population spawning. */
export function validateFounderBatch(world:WorldState,raw:unknown):string|null {
  if(world.phase!=='active')return 'Initialize the simulation first.';
  if(world.genesisArchive.length>0||world.workers.length>0)return 'Genesis has already established a population.';
  if(!Array.isArray(raw))return 'founders must be a Python list of dictionaries.';
  if(raw.length!==3)return 'Define exactly three founders. Add a third dictionary to the founders list.';
  if(raw.length>world.housingCapacity-world.workers.length)return 'Not enough housing capacity for the founding population.';
  const names=new Set<string>();
  for(let i=0;i<raw.length;i++){
    const person=raw[i];
    if(!person||typeof person!=='object'||Array.isArray(person))return `Founder ${i+1} must be a dictionary.`;
    const data=person as Record<string,unknown>;
    if(typeof data.name!=='string'||data.name.trim().length<1||data.name.trim().length>32||Array.from(data.name).some(char=>char.charCodeAt(0)<32||char.charCodeAt(0)===127))
      return `Founder ${i+1} needs a name of 1–32 visible characters.`;
    const key=data.name.trim().toLowerCase();
    if(names.has(key))return 'Founder names must be unique.';
    names.add(key);
    if(data.sex!=='female'&&data.sex!=='male')return `Founder ${i+1} needs sex="female" or sex="male".`;
    if(Object.keys(data).some(key=>key!=='name'&&key!=='sex'))return `Founder ${i+1} has unsupported keys. Use name and sex.`;
  }
  return null;
}
export function establishFounders(previous:WorldState,raw:unknown):WorldState {
  const reason=validateFounderBatch(previous,raw);
  if(reason)throw new Error(reason);
  const records=(raw as {name:string;sex:'male'|'female'}[]).map((x,i):FounderRecord=>({
    id:'npc_'+String(i+1).padStart(6,'0'),name:x.name.trim(),sex:x.sex,createdTick:previous.tick
  }));
  const spawn:[[number,number],[number,number],[number,number]]=[[3,6],[4,5],[4,6]];
  const workers:Worker[]=records.map((f,i)=>({
    id:f.id,definitionId:'core:founder',installedModules:(i===0?{tool:['core:starter_axe']}:
     i===1?{tool:['core:starter_pickaxe']}:{}) as Record<string,string[]>,name:f.name,sex:f.sex,role:'Founder',x:spawn[i][0],y:spawn[i][1],
    carried:0,carrying:null,capacity:6,policy:null,task:null,
    organizationId:null,controlMode:'independent'
  }));
  return {...previous,workers,genesisArchive:records,
    events:[...previous.events,`Genesis: ${records.map(x=>x.name).join(', ')} became the first inhabitants of First Light.`]};
}
export function nearestResource(world: WorldState, unit: Worker, resource: 'wood' | 'stone'): Tile | undefined {
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
  const target = nearestResource(world, unit, unit.policy);
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
    stocks: { ...previous.stocks }, jobs:previous.jobs.map(j=>({...j})), events: [...previous.events]
  };
  const withJobs=advancePhysicalJobs(state);
  // Legacy scheduled workers continue using their original task-policy system;
  // continuous controllers use explicit, one-cell physical requests instead.
  for (const worker of withJobs.workers) progressWorker(withJobs, worker);
  if (withJobs.tick % 24 === 0) {
    for (const farm of withJobs.buildings) if (farm.mode === 'food') withJobs.stocks.food += 9;
    withJobs.stocks.food = Math.max(0, withJobs.stocks.food - withJobs.workers.length * 2);
    if (withJobs.stocks.food === 0 && withJobs.tick % 48 === 0) withJobs.events.push('Food shortage: your settlers are going hungry.');
  }
  if (withJobs.stocks.wood >= 60 && withJobs.stocks.stone >= 24 && !withJobs.events.some(e => e.startsWith('Milestone:')))
    withJobs.events.push('Milestone: First Stockpiles — 60 wood and 24 stone secured.');
  if(Object.keys(withJobs.stocks).some(key=>withJobs.stocks[key]!==previous.stocks[key]))
    return emitSignal(withJobs,'inventory.changed',{tick:withJobs.tick});
  return withJobs;
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
      id: w.id,definition_id:w.definitionId,modules:w.installedModules, name: w.name, role: w.role, sex:w.sex??null, x: w.x, y: w.y,
      carried: w.carried, carrying: w.carried, cargo_type: w.carrying,
      capacity: w.capacity, policy: w.policy, control_mode: w.controlMode,
      current_job:world.jobs.find(j=>j.ownerId===w.id&&j.status==='active')?.id??null,
      harvest_ready:harvestEligibility(world,w)===null,
      near_storage:w.x===3&&w.y===5?'stockpile_001':null
    })),
    signals:world.signals.slice(-40).map(s=>({...s,payload:{...s.payload}})),
    jobs:world.jobs.map(j=>({...j})),
    resource_nodes:world.tiles.filter(t=>t.ground==='forest'||t.ground==='quarry')
      .map(t=>({x:t.x,y:t.y,kind:t.ground,remaining:t.remaining})),
    entities:world.entities.map(e=>({id:e.id,name:e.name,kind:e.kind,definition_id:e.definitionId,modules:e.installedModules})),
    buildings: world.buildings.map(b => ({
      id: b.id,definition_id:b.definitionId,modules:b.installedModules, name: b.name, type: b.type, x: b.x, y: b.y, mode: b.mode
    }))
  };
}
