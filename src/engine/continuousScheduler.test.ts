import {describe,it,expect} from 'vitest';
import {ContinuousScheduler} from './continuousScheduler';
import {createWorld,stepWorld} from './world';
import {starterControllers} from '../defaults';
import type {ContinuousExecutor} from './continuousScheduler';
describe('Continuous physical programs',()=>{
 it('suspends movement until the next tick then resumes a persistent script',async()=>{
  const w=createWorld();const c=starterControllers().map(x=>x.id==='ctrl_000001'?
   {...x,enabled:true,executionMode:'continuous' as const}:x);
  const engine=new ContinuousScheduler();
  const calls:string[]=[];
  const execute:ContinuousExecutor=async(id,operation)=>{
   calls.push(operation);
   return operation==='start'?{kind:'request',request:{kind:'move',entityId:'npc_000001',direction:'east'},output:[]}:
    {kind:'request',request:{kind:'wait_ticks',ticks:3},output:[]};
  };
  const first=await engine.pulse(w,c,execute);
  expect(first.world.workers[0].x).toBe(3);
  expect(first.world.jobs).toHaveLength(1);
  const next=await engine.pulse(stepWorld(first.world),first.controllers,execute);
  expect(next.world.workers[0].x).toBe(4);
  expect(calls).toEqual(['start','resume']);
  expect(next.controllers[0].enabled).toBe(true);
 });
 it('holds timer subscriptions without repeatedly executing Python',async()=>{
  const w=createWorld();const cs=starterControllers().map(x=>x.id==='ctrl_000001'?
   {...x,enabled:true,executionMode:'continuous' as const}:x);
  const engine=new ContinuousScheduler();let calls=0;
  const runner:ContinuousExecutor=async()=>{calls++;return {kind:'request',output:[],request:{kind:'wait_ticks',ticks:5}}};
  const r=await engine.pulse(w,cs,runner);
  await engine.pulse(stepWorld(r.world),r.controllers,runner);
  expect(calls).toBe(1);
 });
});
