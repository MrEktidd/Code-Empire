import {stepWorld,worldSnapshot} from './world';
import {COMMANDS,applyCommands,validateCommand} from './commands/registry';
import {ensureGenesisController,ensureFounderControllers,GENESIS_CONTROLLER_ID} from '../defaults';
import { executeBatch } from '../platform/scheduling/executeBatch';
import type { Controller, ExecutionEntry, ScriptCommand, ScriptResult, WorldState } from './types';
export type Executor=(source:string,snapshot:ReturnType<typeof worldSnapshot>,memory:Record<string,unknown>,ownerEntityId:string|null)=>Promise<ScriptResult>;
export type TickResult={world:WorldState;controllers:Controller[];entries:ExecutionEntry[]};
export function dueControllers(world:WorldState,controllers:Controller[],limit=16):Controller[]{
 if(world.phase==='dormant')return [];
 const entities=new Map([...world.workers,...world.buildings].map(e=>[e.id,e.controlMode]));
 return controllers.filter(c=>c.id!==GENESIS_CONTROLLER_ID && c.enabled && c.nextRunTick<=world.tick &&
  (c.ownerEntityId===null||entities.get(c.ownerEntityId)==='independent'))
  .sort((a,b)=>a.nextRunTick-b.nextRunTick||a.id.localeCompare(b.id)).slice(0,limit);
}
export {validateCommand} from './commands/registry';
export async function runControllers(world:WorldState,controllers:Controller[],selected:Controller[],executor:Executor,manual=false):Promise<TickResult>{
 const snapshot=worldSnapshot(world);
 const requests=selected.map(c=>({id:c.id,source:c.source,memory:c.memory,context:{snapshot,ownerId:c.ownerEntityId}}));
 const responses=await executeBatch(requests,async(source,ctx,memory)=>{
   const result=await executor(source,ctx.snapshot,memory,ctx.ownerId);
   if(!result||!Array.isArray(result.commands)||!Array.isArray(result.output)||!result.memory||
     typeof result.memory!=='object'||Array.isArray(result.memory))throw Error('Invalid script response');
   const serialized=JSON.stringify(result.memory);
   if(serialized.length>32768)throw Error('Persistent controller memory exceeds 32 KB');
   return {commands:result.commands.slice(0,64),memory:JSON.parse(serialized) as Record<string,unknown>,output:result.output.slice(0,40).map(String)};
 },8000);
 const changes=new Map<string,Controller>();
 const entries:ExecutionEntry[]=[];
 const pending:{id:string;command:ScriptCommand}[]=[];
 for(const outcome of responses){
   const controller=selected.find(c=>c.id===outcome.id)!;
   const next:Controller={...controller,nextRunTick:manual?controller.nextRunTick:world.tick+controller.intervalTicks,
    executions:controller.executions+1,lastStatus:outcome.success?'success':'error',
    lastError:outcome.error??null,lastOutput:outcome.output.slice(0,40)};
   if(outcome.success)next.memory=outcome.memory??controller.memory;
   changes.set(controller.id,next);
   if(outcome.success)for(const command of outcome.commands)pending.push({id:controller.id,command});
   entries.push({tick:world.tick,controllerId:controller.id,filename:controller.filename,
     success:outcome.success,output:[...outcome.output],error:outcome.error,commands:outcome.commands.length,
     durationMs:outcome.elapsedMs});
 }
 // The first *valid* proposed command per entity wins. Invalid commands never reserve an entity.
 const claimed=new Set<string>(),accepted:ScriptCommand[]=[];
 for(const {id,command} of pending){
  const entry=entries.find(e=>e.controllerId===id)!;
  const origin=selected.find(c=>c.id===id)!;
  const reason=!COMMANDS.authorized(command,origin.ownerType,origin.ownerEntityId)
    ? (command.action==='initialize'||command.action==='seed_population'
       ? 'Only a global controller can initialize or seed the simulation'
       : 'Controller is not permitted to control this entity')
    : validateCommand(world,command);
  if(reason){entry.output.push('Rejected command: '+reason);continue;}
  const target=COMMANDS.spec(command.action)?.target(command);
  if(target&&claimed.has(target)){entry.output.push('Command conflict: '+target+' was already ordered this tick.');continue;}
  if(target)claimed.add(target);
  accepted.push(command);
 }
 const committed=applyCommands(world,accepted);
 if(committed.messages.length)entries.push({tick:world.tick,controllerId:'engine',filename:'Simulation',success:true,
  output:committed.messages,commands:0});
 const updated=controllers.map(c=>changes.get(c.id)??c);
 const withGenesis=ensureGenesisController(updated,committed.world.phase==='active'&&committed.world.workers.length===0);
 return {world:committed.world,controllers:ensureFounderControllers(withGenesis,committed.world),entries};
}
export async function advanceTick(world:WorldState,controllers:Controller[],executor:Executor):Promise<TickResult>{
 const updated=stepWorld(world);
 return runControllers(updated,controllers,dueControllers(updated,controllers),executor);
}
