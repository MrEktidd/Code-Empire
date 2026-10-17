import type {WorldState} from '../types';
export type EntityRef={id:string;definitionId:string;kind:string};
export type GenericEntity=EntityRef&{name:string;locationId:string|null;installedModules:Record<string,string[]>;technicalState:Record<string,unknown>};
export function entityRefs(world:WorldState):EntityRef[]{
 return [...world.workers.map(e=>({id:e.id,definitionId:e.definitionId,kind:'person'})),
  ...world.buildings.map(e=>({id:e.id,definitionId:e.definitionId,kind:'workplace'})),
  ...world.entities.map(e=>({id:e.id,definitionId:e.definitionId,kind:e.kind}))];
}
export function findEntity(world:WorldState,id:string){
 return [...world.workers,...world.buildings,...world.entities].find(e=>e.id===id);
}
export function createGenericEntity(id:string,name:string,definitionId:string,registry:import('../definitions/registry').DefinitionRegistry):GenericEntity{
 const def=registry.entity(definitionId);
 if(!/^[a-z][a-z0-9_]*$/.test(id)||!name.trim())throw Error('Invalid entity identity');
 return {id,name,definitionId,kind:def.kind,locationId:null,installedModules:{},technicalState:{}};
}
