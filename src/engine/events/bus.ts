import type {WorldState} from '../types';
export type SimSignalType='entity.created'|'population.seeded'|'module.installed'|'module.removed'|'inventory.changed'|'recipe.completed'|'job.completed';
export type SimSignal={tick:number;sequence:number;type:SimSignalType;entityId?:string;payload:Record<string,string|number|boolean>};
export function emitSignal(world:WorldState,type:SimSignalType,payload:SimSignal['payload'],entityId?:string):WorldState{
 const last=world.signals[world.signals.length-1];
 const signal:SimSignal={tick:world.tick,sequence:(last?.sequence??0)+1,type,entityId,payload:{...payload}};
 return {...world,signals:[...world.signals,signal].slice(-128)};
}
/** Deterministic in-process subscription primitive; no user callbacks execute inside dispatch. */
export class SignalBus{
 private listeners=new Map<SimSignalType,Set<(signal:SimSignal)=>void>>();
 subscribe(type:SimSignalType,callback:(signal:SimSignal)=>void):()=>void{
  const set=this.listeners.get(type)??new Set();set.add(callback);this.listeners.set(type,set);
  return ()=>set.delete(callback);
 }
 publish(signals:readonly SimSignal[]):void{
  for(const signal of signals)for(const listener of this.listeners.get(signal.type)??[])listener(signal);
 }
}
