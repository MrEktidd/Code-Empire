import {describe,it,expect} from 'vitest';
import {createWorld,worldSnapshot} from './world';
import {starterControllers} from '../defaults';
import {advanceTick,dueControllers,runControllers} from './scheduler';
import type {ScriptResult} from './types';
const result=(commands:ScriptResult['commands']=[]):ScriptResult=>({commands,memory:{runs:1},output:['ok']});
describe('entity controllers',()=>{
 it('creates stable unique entity and controller identities',()=>{
  const w=createWorld();const c=starterControllers();
  expect(new Set([...w.workers,...w.buildings].map(x=>x.id)).size).toBe(4);
  expect(new Set(c.map(x=>x.id)).size).toBe(c.length);
  for(const entity of [...w.workers,...w.buildings])expect(c.some(x=>x.ownerEntityId===entity.id)).toBe(true);
 });
 it('runs every due controller and isolates failures',async()=>{
  const world=createWorld();const controllers=starterControllers().map(c=>({...c,enabled:true,nextRunTick:1}));
  const tick=await advanceTick(world,controllers,async(_source,_snapshot,_memory,id)=>{
   if(id==='npc_000002')throw Error('bad code');
   return result(id==='npc_000001'?[{action:'assign',workerId:id,resource:'wood'}]:[]);
  });
  expect(tick.entries.filter(e=>e.controllerId!=='engine')).toHaveLength(controllers.length);
  expect(tick.controllers.find(c=>c.ownerEntityId==='npc_000002')?.lastStatus).toBe('error');
  expect(tick.world.workers[0].policy).toBe('wood');
 });
 it('resolves conflicting orders with deterministic first-wins',async()=>{
  const w=createWorld();w.tick=10;
  const c=starterControllers().slice(0,2).map((x,i)=>({...x,enabled:true,nextRunTick:10,
   id:i?'ctrl_b':'ctrl_a'}));
  const r=await runControllers(w,c,dueControllers(w,c),async(_s,_v,_m,owner)=>result([
   {action:'assign',workerId:'npc_000001',resource:owner==='npc_000001'?'wood':'stone'}]));
  expect(r.world.workers[0].policy).toBe('wood');
  expect(r.entries.some(e=>e.output.some(s=>s.includes('conflict')))).toBe(true);
 });
 it('preserves input world and controller memory',async()=>{
  const world=createWorld(),controllers=starterControllers();
  const original=JSON.stringify({world,controllers});
  await runControllers(world,controllers,[controllers[0]],async()=>result([{action:'assign',workerId:'npc_000001',resource:'wood'}]));
  expect(JSON.stringify({world,controllers})).toBe(original);
  expect(worldSnapshot(world).workers[0].id).toBe('npc_000001');
 });
});
