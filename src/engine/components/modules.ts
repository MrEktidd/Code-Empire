import type {WorldState,Worker,Building} from '../types';
import type {GenericEntity} from '../entities/identity';
import type {DefinitionRegistry} from '../definitions/registry';
import {findEntity} from '../entities/identity';
type Installable=Worker|Building|GenericEntity;
export function moduleEffects(entity:Installable,registry:DefinitionRegistry){
 const effects=Object.values(entity.installedModules).flat().map(id=>registry.module(id)).flatMap(m=>m.effects);
 return {carryCapacity:effects.reduce((n,e)=>n+(e.kind==='carry_capacity'?(e.amount??0):0),0),
  storageCapacity:effects.reduce((n,e)=>n+(e.kind==='inventory_capacity'?(e.amount??0):0),0),
  capabilities:effects.filter(e=>e.kind==='capability').map(e=>e.capability!)};
}
export function validateModuleChange(world:WorldState,entityId:unknown,moduleId:unknown,action:'install'|'remove',registry:DefinitionRegistry):string|null{
 if(world.phase!=='active')return 'Initialize simulation first';
 if(typeof entityId!=='string'||typeof moduleId!=='string')return 'Entity and module IDs are required';
 const entity=findEntity(world,entityId);
 if(!entity)return 'Unknown entity '+entityId;
 const def=registry.get(moduleId);
 if(!def||def.type!=='module')return 'Unknown module '+moduleId;
 const type=registry.entity(entity.definitionId);
 if(!def.allowed_kinds.includes(type.kind))return 'Module is incompatible with '+type.kind;
 const slot=def.slot,capacity=type.module_slots?.[slot]??0;
 const current=entity.installedModules[slot]??[];
 if(action==='install'){
  if(current.includes(moduleId))return 'Module already installed';
  if(current.length>=capacity)return 'No available '+slot+' slots';
 }else if(!current.includes(moduleId))return 'Module is not installed';
 return null;
}
export function changeModule(world:WorldState,entityId:string,moduleId:string,action:'install'|'remove',registry:DefinitionRegistry):WorldState{
 const reason=validateModuleChange(world,entityId,moduleId,action,registry);
 if(reason)throw Error(reason);
 const selected=registry.module(moduleId);
 const change=<T extends Installable>(entity:T):T=>{
  if(entity.id!==entityId)return entity;
  const updated={...entity,installedModules:{...entity.installedModules,
   [selected.slot]:action==='install'?[...(entity.installedModules[selected.slot]??[]),moduleId]:
    (entity.installedModules[selected.slot]??[]).filter(x=>x!==moduleId)}} as T;
  if('capacity' in updated&&typeof updated.capacity==='number'){
   const delta=selected.effects.reduce((v,e)=>v+(e.kind==='carry_capacity'?(e.amount??0):0),0);
   updated.capacity+=action==='install'?delta:-delta;
  }
  return updated;
 };
 return {...world,workers:world.workers.map(change),buildings:world.buildings.map(change),entities:world.entities.map(change)};
}
