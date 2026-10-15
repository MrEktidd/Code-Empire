import {describe,it,expect} from 'vitest';
import {createWorld,worldSnapshot} from './world';
import {starterControllers} from '../defaults';
import {advanceTick,dueControllers,runControllers,validateCommand} from './scheduler';
import type {ScriptResult} from './types';
const result=(commands:ScriptResult['commands']=[]):ScriptResult=>({commands,memory:{runs:1},output:['ok']});
describe('entity controllers',()=>{
 it('creates stable unique entity and controller identities',()=>{
  const w=createWorld(),c=starterControllers();
  expect(new Set([...w.workers,...w.buildings].map(x=>x.id)).size).toBe(4);
  expect(new Set(c.map(x=>x.id)).size).toBe(c.length);
  for(const entity of [...w.workers,...w.buildings])expect(c.some(x=>x.ownerEntityId===entity.id)).toBe(true);
 });
 it('executes every due controller while isolating failures',async()=>{
  const world=createWorld(),controllers=starterControllers().map(c=>({...c,enabled:true,nextRunTick:1}));
  const tick=await advanceTick(world,controllers,async(_s,_v,_m,id)=>{
   if(id==='npc_000002')throw Error('bad code');
   return result(id==='npc_000001'?[{action:'assign',workerId:id,resource:'wood'}]:[]);
  });
  expect(tick.entries.filter(e=>e.controllerId!=='engine')).toHaveLength(controllers.length);
  expect(tick.controllers.find(c=>c.ownerEntityId==='npc_000002')?.lastStatus).toBe('error');
  expect(tick.world.workers[0].policy).toBe('wood');
 });
 it('validates before conflict ownership and permits a later valid order',async()=>{
  const w=createWorld(),cs=starterControllers().slice(0,2).map((c,i)=>({...c,enabled:true,nextRunTick:0,id:'ctrl_'+i}));
  const r=await runControllers(w,cs,dueControllers(w,cs),async(_s,_v,_m,id)=>result([
   {action:'assign',workerId:'npc_000001',resource:id==='npc_000001'?'garbage':'stone'}]));
  expect(r.world.workers[0].policy).toBe('stone');
  expect(r.entries.some(e=>e.output.some(s=>s.includes('Rejected')))).toBe(true);
  expect(validateCommand(w,{action:'farm_mode',buildingId:'farm_000001',mode:'resting'})).toBeNull();
 });
 it('manual run does not rewrite next scheduled tick',async()=>{
  const w=createWorld(),cs=starterControllers();
  const r=await runControllers(w,cs,[cs[0]],async()=>result(),true);
  expect(r.controllers[0].nextRunTick).toBe(cs[0].nextRunTick);
 });
 it('preserves input world and controller memory',async()=>{
  const w=createWorld(),cs=starterControllers(),before=JSON.stringify({w,cs});
  await runControllers(w,cs,[cs[0]],async()=>result([{action:'assign',workerId:'npc_000001',resource:'wood'}]));
  expect(JSON.stringify({w,cs})).toBe(before);
  expect(worldSnapshot(w).workers[0].id).toBe('npc_000001');
 });
});
