import type {WorldState,ScriptCommand,Worker} from '../types';
import {emitSignal} from '../events/bus';
import {createCivilizationWorld,establishFounders,validateFounderBatch,nearestResource} from '../world';
import {changeModule,validateModuleChange} from '../components/modules';
import {craftRecipe} from '../systems/inventory';
import {CONTENT} from '../../games/code-empire/content/base';

export type CommandResult={world:WorldState;messages:string[]};
export type CommandSpec={
 action:string;scope:'global'|'owner-or-global'|'all';
 validate:(world:WorldState,command:ScriptCommand)=>string|null;
 target:(command:ScriptCommand)=>string|undefined;
 apply:(world:WorldState,command:ScriptCommand)=>CommandResult;
};
const result=(world:WorldState,message:string):CommandResult=>({world,messages:[message]});
const active=(world:WorldState)=>world.phase==='active'?null:'Initialize simulation first';
const worker=(world:WorldState,id:unknown)=>world.workers.find(w=>w.id===id);
function cloneWorker(world:WorldState,id:string,change:(worker:Worker)=>void):WorldState{
 return {...world,workers:world.workers.map(w=>{
  if(w.id!==id)return w;
  const next={...w,task:w.task?{...w.task}:null};change(next);return next;
 })};
}
export class CommandRegistry {
 private map=new Map<string,CommandSpec>();
 register(spec:CommandSpec):void{
  if(this.map.has(spec.action))throw Error('Duplicate command '+spec.action);
  this.map.set(spec.action,spec);
 }
 spec(action:string):CommandSpec|undefined{return this.map.get(action);}
 validate(world:WorldState,cmd:ScriptCommand):string|null{
  if(!cmd||typeof cmd!=='object')return 'Not a command';
  const spec=this.spec(cmd.action);
  return spec?spec.validate(world,cmd):'Unsupported command '+String(cmd.action);
 }
 authorized(cmd:ScriptCommand,ownerType:string,ownerId:string|null):boolean{
  const spec=this.spec(cmd.action);if(!spec)return false;
  if(spec.scope==='global')return ownerType==='global'&&ownerId===null;
  if(spec.scope==='owner-or-global')return ownerType==='global'||ownerId===cmd.entityId;
  return true;
 }
 execute(world:WorldState,commands:readonly ScriptCommand[]):CommandResult{
  let current=world;const messages:string[]=[];
  for(const cmd of commands.slice(0,64)){
   const spec=this.spec(cmd?.action);
   const reason=this.validate(current,cmd);
   if(!spec||reason){messages.push('Rejected command: '+(reason??'Unsupported command'));continue;}
   const next=spec.apply(current,cmd);
   current=next.world;messages.push(...next.messages);
  }
  return {world:current,messages};
 }
}
export const COMMANDS=new CommandRegistry();
const add=(spec:CommandSpec)=>COMMANDS.register(spec);
add({action:'initialize',scope:'global',target:()=> 'simulation',
 validate:w=>w.phase==='dormant'?null:'Simulation is already initialized',
 apply:w=>result(createCivilizationWorld(w.seed),'Simulation initialized. Physical environment generated.')});
add({action:'seed_population',scope:'global',target:()=> 'genesis',
 validate:(w,c)=>validateFounderBatch(w,c.founders),
 apply:(w,c)=>{
  let next=establishFounders(w,c.founders);
  for(const founder of next.genesisArchive)next=emitSignal(next,'entity.created',{definitionId:'core:founder'},founder.id);
  next=emitSignal(next,'population.seeded',{count:next.genesisArchive.length});
  return result(next,'Genesis complete: '+next.workers.map(x=>x.name).join(', ')+'. Population '+next.workers.length+'/'+next.housingCapacity+'.');
 }});
add({action:'log',scope:'all',target:()=>undefined,
 validate:(_w,c)=>typeof c.message==='string'&&c.message.length<=180?null:'Log message must be text under 181 characters',
 apply:(w,c)=>result(w,String(c.message).slice(0,180))});
add({action:'assign',scope:'all',target:c=>c.workerId,
 validate:(w,c)=>active(w)??(!worker(w,c.workerId)?'Unknown worker':!['sticks','berries','stone','wood','idle'].includes(c.resource??'')?'Unknown resource assignment':null),
 apply:(w,c)=>{
  const name=worker(w,c.workerId)?.name??'Worker';
  const policy=c.resource==='idle'?null:c.resource as import('../types').Resource;
  return result(cloneWorker(w,c.workerId!,unit=>{if(unit.policy!==policy){unit.policy=policy;unit.task=null;}}),name+': '+(policy??'idle'));
 }});
add({action:'farm_mode',scope:'all',target:c=>c.buildingId,
 validate:(w,c)=>active(w)??(!w.buildings.some(b=>b.id===c.buildingId)?'Unknown farm':
  !['food','rest','resting'].includes(c.mode??'')?'Unknown farm mode':null),
 apply:(w,c)=>{
  const mode=c.mode==='resting'?'rest':c.mode as 'food'|'rest';
  const farm=w.buildings.find(b=>b.id===c.buildingId)!;
  return result({...w,buildings:w.buildings.map(b=>b.id===c.buildingId?{...b,mode}:b)},farm.name+': '+mode);
 }});
add({action:'order',scope:'all',target:c=>c.workerId,
 validate:(w,c)=>{
  const e=active(w);if(e)return e;
  if(!worker(w,c.workerId))return 'Unknown worker';
  if(c.task==='deposit')return null;
  if(c.task==='gather')return ['sticks','berries','stone','wood'].includes(c.resource??'')?null:'Invalid gathering resource';
  if(c.task==='move')return Number.isInteger(c.x)&&Number.isInteger(c.y)&&c.x!>=0&&c.y!>=0&&c.x!<16&&c.y!<11?null:'Invalid move destination';
  return 'Unsupported order';
 },
 apply:(w,c)=>{
  let message='';
  const state=cloneWorker(w,c.workerId!,unit=>{
   if(c.task==='deposit')unit.task={kind:'deposit',x:3,y:5};
   if(c.task==='move')unit.task={kind:'move',x:c.x!,y:c.y!};
   if(c.task==='gather'){
    const target=nearestResource(w,unit,c.resource as import('../types').Resource);
    if(target)unit.task={kind:'gather',x:target.x,y:target.y,resource:c.resource as import('../types').Resource};
    else message='No '+c.resource+' deposits remain.';
   }
  });
  return {world:state,messages:message?[message]:[]};
 }});
add({action:'module.install',scope:'owner-or-global',target:c=>c.entityId,
 validate:(w,c)=>c.moduleId==='core:carrying_basket'
   ?'Carrying Basket is locked until equipment crafting becomes available'
   :validateModuleChange(w,c.entityId,c.moduleId,'install',CONTENT),
 apply:(w,c)=>{
  const next=emitSignal(changeModule(w,c.entityId!,c.moduleId!,'install',CONTENT),'module.installed',{moduleId:c.moduleId!},c.entityId);
  return result(next,'Installed '+c.moduleId+' on '+c.entityId);
 }});
add({action:'module.remove',scope:'owner-or-global',target:c=>c.entityId,
 validate:(w,c)=>validateModuleChange(w,c.entityId,c.moduleId,'remove',CONTENT),
 apply:(w,c)=>{
  const next=emitSignal(changeModule(w,c.entityId!,c.moduleId!,'remove',CONTENT),'module.removed',{moduleId:c.moduleId!},c.entityId);
  return result(next,'Removed '+c.moduleId+' from '+c.entityId);
 }});
add({action:'craft',scope:'global',target:()=> 'global-stockpile',
 validate:(w,c)=>{
  const e=active(w);if(e)return e;
  if(typeof c.recipeId!=='string')return 'Recipe ID required';
  if(!Number.isSafeInteger(c.amount)||c.amount!<1||c.amount!>100)return 'Craft amount must be 1–100';
  try{craftRecipe(w.stocks,c.recipeId,c.amount!,CONTENT);}catch(e){return String(e instanceof Error?e.message:e);}
  return null;
 },
 apply:(w,c)=>{
  const after=craftRecipe(w.stocks,c.recipeId!,c.amount!,CONTENT);
  let next:WorldState={...w,stocks:after};
  next=emitSignal(next,'inventory.changed',{recipeId:c.recipeId!,count:c.amount!});
  next=emitSignal(next,'recipe.completed',{recipeId:c.recipeId!,count:c.amount!});
  return result(next,'Crafted '+c.amount+' × '+c.recipeId);
 }});
add({action:'build_shelter',scope:'global',target:()=> 'settlement',
 validate:w=>active(w)??(!w.settlementUnlocked?'Settlement is locked':w.leanToCount>=1?'Lean-to already built':w.stocks.sticks<12||w.stocks.stone<6?'Need 12 sticks and 6 stone':null),
 apply:w=>result(emitSignal({...w,stocks:{...w.stocks,sticks:w.stocks.sticks-12,stone:w.stocks.stone-6},housingCapacity:w.housingCapacity+2,leanToCount:1},'settlement.shelter_built',{housingAdded:2}),'Lean-to constructed! Two housing places added.')});
add({action:'recruit_worker',scope:'global',target:()=> 'settlement',
 validate:(w,c)=>active(w)??(!w.leanToCount?'Build a lean-to first':w.workers.length>=w.housingCapacity?'Housing is full':typeof c.name!=='string'||!c.name.trim()||c.name.trim().length>32?'Name must be 1–32 characters':!['male','female'].includes(c.sex??'')?'Choose sex':w.workers.some(x=>x.name.toLowerCase()===c.name!.trim().toLowerCase())?'Name in use':null),
 apply:(w,c)=>{
  const max=Math.max(0,...w.workers.map(x=>Number(x.id.replace('npc_',''))||0));
  const id='npc_'+String(max+1).padStart(6,'0');
  const tile=w.tiles.find(t=>t.ground==='meadow'&&t.x>=2&&t.x<=5&&t.y>=3&&t.y<=7&&!w.workers.some(x=>x.x===t.x&&x.y===t.y));
  const recruit:Worker={id,definitionId:'core:founder',installedModules:{},name:c.name!.trim(),sex:c.sex,role:'Settler',x:tile?.x??3,y:tile?.y??6,carried:0,carrying:null,capacity:6,hunger:80,policy:null,task:null,organizationId:null,controlMode:'independent'};
  return result(emitSignal({...w,workers:[...w.workers,recruit]},'entity.created',{definitionId:'core:founder'},id),recruit.name+' joined the settlement.');
 }});
export const validateCommand=(world:WorldState,command:ScriptCommand)=>COMMANDS.validate(world,command);
export const applyCommands=(world:WorldState,commands:ScriptCommand[])=>COMMANDS.execute(world,commands);
