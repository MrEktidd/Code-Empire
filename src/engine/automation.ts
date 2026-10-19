/** Deterministic physical jobs. Scripts may request jobs, never mutate the world.
 * The simulation clock is authoritative; commands and queries share validation.
 */
import {HEIGHT,WIDTH} from './types';
import type {WorldState,PhysicalJob,Worker} from './types';
import type {ContinuousRequest} from '../platform/python/PythonRuntime';
import {CONTENT} from '../games/code-empire/content/base';
import {moduleEffects} from './components/modules';
import {emitSignal} from './events/bus';

export type ActionResponse={ok:boolean;reason?:string;job_id?:string};
const direction:Record<string,[number,number]>={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
const fail=(reason:string):ActionResponse=>({ok:false,reason});
const at=(world:WorldState,x:number,y:number)=>world.tiles[y*WIDTH+x];
const nodeId=(ground:string)=>ground==='forest'?'core:timber':ground==='quarry'?'core:stone_deposit':null;
export function harvestEligibility(world:WorldState,person:Worker):string|null {
 if(world.phase!=='active')return 'not_initialized';
 if(person.task||world.jobs.some(j=>j.ownerId===person.id&&j.status==='active'))return 'busy';
 const tile=at(world,person.x,person.y);
 const definition=nodeId(tile?.ground??'');
 if(!definition||!tile||tile.remaining<=0)return 'no_resource';
 const spec=CONTENT.resourceNode(definition);
 if(person.capacity-person.carried<spec.yield_per_action)return 'inventory_full';
 if(person.carrying&&person.carrying!==CONTENT.item(spec.output_item).inventory_key)return 'incompatible_cargo';
 if(spec.required_capability&&!moduleEffects(person,CONTENT).capabilities.includes(spec.required_capability))
  return 'missing_tool';
 return null;
}
export function startPhysicalAction(world:WorldState,ownerId:string,request:ContinuousRequest):
 {world:WorldState;response:ActionResponse;waitForJob:boolean}{
 const person=world.workers.find(w=>w.id===ownerId);
 if(!person||request.entityId!==ownerId)return {world,response:fail('not_owner'),waitForJob:false};
 if(!['move','harvest','deposit'].includes(request.kind))return {world,response:fail('invalid_action'),waitForJob:false};
 if(person.task||world.jobs.some(j=>j.ownerId===ownerId&&j.status==='active'))
  return {world,response:fail('busy'),waitForJob:false};
 let job:PhysicalJob;
 const id='job_'+String(world.tick)+'_'+ownerId+'_'+String(world.jobs.length+1);
 if(request.kind==='move'){
  const vector=direction[request.direction??''];
  if(!vector)return {world,response:fail('invalid_direction'),waitForJob:false};
  const x=person.x+vector[0],y=person.y+vector[1];
  if(x<0||x>=WIDTH||y<0||y>=HEIGHT||at(world,x,y)?.ground==='water')
   return {world,response:fail('blocked'),waitForJob:false};
  job={id,ownerId,kind:'move',status:'active',startedTick:world.tick,finishTick:world.tick+1,x,y};
 }else if(request.kind==='harvest'){
  const reason=harvestEligibility(world,person);
  if(reason)return {world,response:fail(reason),waitForJob:false};
  const tile=at(world,person.x,person.y),node=CONTENT.resourceNode(nodeId(tile.ground)!);
  job={id,ownerId,kind:'harvest',status:'active',startedTick:world.tick,finishTick:world.tick+node.harvest_duration_ticks,
   x:person.x,y:person.y,resource:CONTENT.item(node.output_item).inventory_key as 'wood'|'stone',amount:node.yield_per_action};
 }else{
  if(request.storageId!=='stockpile_001')return {world,response:fail('unknown_storage'),waitForJob:false};
  const store=at(world,3,5);
  if(!store||store.ground!=='stockpile')return {world,response:fail('storage_missing'),waitForJob:false};
  if(Math.abs(person.x-3)+Math.abs(person.y-5)>0)return {world,response:fail('out_of_range'),waitForJob:false};
  if(!person.carrying||!person.carried)return {world,response:fail('empty_inventory'),waitForJob:false};
  job={id,ownerId,kind:'deposit',status:'active',startedTick:world.tick,finishTick:world.tick+1,
   x:3,y:5,resource:person.carrying,amount:person.carried};
 }
 return {world:{...world,jobs:[...world.jobs,job]},response:{ok:true,job_id:id},waitForJob:job.kind==='move'};
}
export function advancePhysicalJobs(world:WorldState):WorldState{
 if(!world.jobs.some(j=>j.status==='active'&&j.finishTick<=world.tick))return world;
 let next:WorldState={...world,jobs:world.jobs.map(job=>({...job})),
  tiles:world.tiles.map(tile=>({...tile})),workers:world.workers.map(w=>({...w})),
  stocks:{...world.stocks}};
 for(const job of next.jobs){
  if(job.status!=='active'||job.finishTick>next.tick)continue;
  const worker=next.workers.find(w=>w.id===job.ownerId);
  if(!worker){job.status='failed';job.reason='actor_missing';continue;}
  if(job.kind==='move'){
   worker.x=job.x!;worker.y=job.y!;
  }else if(job.kind==='harvest'){
   const tile=at(next,job.x!,job.y!);
   const available=tile&&nodeId(tile.ground)&&tile.remaining>0;
   const canCarry=worker.capacity-worker.carried>0&&(!worker.carrying||worker.carrying===job.resource);
   if(!available||!canCarry){job.status='failed';job.reason=!available?'resource_depleted':'inventory_full';continue;}
   const amount=Math.min(tile.remaining,job.amount!,worker.capacity-worker.carried);
   tile.remaining-=amount;worker.carried+=amount;worker.carrying=job.resource!;
   next.totalHarvested+=amount;
   if(tile.remaining===0)tile.ground='meadow';
  }else{
   if(worker.x!==3||worker.y!==5||!worker.carrying||!worker.carried){
    job.status='failed';job.reason='transfer_unavailable';continue;
   }
   next.stocks[worker.carrying]=(next.stocks[worker.carrying]??0)+worker.carried;
   worker.carried=0;worker.carrying=null;
  }
  job.status='completed';
  next=emitSignal(next,'job.completed',{jobId:job.id,kind:job.kind},job.ownerId);
 }
 // Keep active jobs plus recent completions, never prune a currently running job.
 const active=next.jobs.filter(j=>j.status==='active'),history=next.jobs.filter(j=>j.status!=='active').slice(-128);
 return {...next,jobs:[...active,...history]};
}
