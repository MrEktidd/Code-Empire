import type {WorldState} from '../types';
import {entityRefs} from './identity';
export type RelationKind='owns'|'manages'|'member_of'|'located_in'|'operates';
export type EntityRelation={from:string;to:string;kind:RelationKind};
export function addRelation(world:WorldState,relation:EntityRelation):WorldState{
 if(relation.from===relation.to)throw Error('Self relationships are not supported');
 const ids=new Set(entityRefs(world).map(x=>x.id));
 if(!ids.has(relation.from)||!ids.has(relation.to))throw Error('Unknown relationship entity');
 if(!['owns','manages','member_of','located_in','operates'].includes(relation.kind))throw Error('Unknown relationship type');
 if(world.relationships.some(r=>r.from===relation.from&&r.to===relation.to&&r.kind===relation.kind))return world;
 if(['located_in','manages'].includes(relation.kind)&&world.relationships.some(r=>r.from===relation.from&&r.kind===relation.kind))
  throw Error('Only one '+relation.kind+' relationship is allowed per entity');
 if(relation.kind==='located_in'){
  const parents=new Map(world.relationships.filter(r=>r.kind==='located_in').map(r=>[r.from,r.to]));
  let target:string|undefined=relation.to;
  while(target){if(target===relation.from)throw Error('Containment cycle');target=parents.get(target);}
 }
 return {...world,relationships:[...world.relationships,relation]};
}
