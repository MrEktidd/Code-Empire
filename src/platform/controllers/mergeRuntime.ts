import type {ControllerBase} from './types';
/** Execution never owns source, filename, notes, user schedule controls or checkpoints. */
export function mergeRuntimeControllers<T extends ControllerBase>(current:T[],executed:T[],original:T[]):T[]{
 const results=new Map(executed.map(c=>[c.id,c]));
 const initial=new Map(original.map(c=>[c.id,c]));
 return current.map(live=>{
  const next=results.get(live.id),before=initial.get(live.id);
  if(!next||!before)return live;
  return {...live,
   memory:next.memory,
   enabled:live.enabled===before.enabled?next.enabled:live.enabled,
   lastStatus:next.lastStatus,
   lastError:next.lastError,
   lastOutput:next.lastOutput,
   executions:next.executions,
   nextRunTick:live.nextRunTick===before.nextRunTick?next.nextRunTick:live.nextRunTick};
 });
}
