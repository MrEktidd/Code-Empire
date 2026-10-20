import type {ContentPack,Definition,DefinitionId,DefinitionType,EntityDefinition,ItemDefinition,ModuleDefinition,RecipeDefinition,ResourceNodeDefinition} from './types';
import {CORE_COMPONENTS,ENTITY_KINDS} from './types';

const idPattern=/^[a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*$/;
const obj=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const string=(v:unknown):v is string=>typeof v==='string'&&v.length>0;
const integer=(v:unknown):v is number=>Number.isSafeInteger(v)&&Number(v)>=0;
const positive=(v:unknown):v is number=>integer(v)&&Number(v)>0;
const list=(v:unknown):v is unknown[]=>Array.isArray(v);
const unique=(a:unknown[])=>new Set(a).size===a.length;
function fail(id:string,detail:string):never{throw Error(`Content ${id}: ${detail}`);}
function validate(raw:unknown):Definition{
 if(!obj(raw))fail('unknown','expected a definition object');
 const {id,type,display_name}=raw;
 if(!string(id)||!idPattern.test(id))fail(String(id),'id must use namespace:name (lowercase)');
 if(!string(display_name)||display_name.length>100)fail(id,'display_name must have 1–100 characters');
 if(raw.description!==undefined&&(!string(raw.description)||raw.description.length>1000))fail(id,'invalid description');
 if(type==='material'){
  if(raw.properties!==undefined&&(!obj(raw.properties)||Object.values(raw.properties).some(v=>!['string','number','boolean'].includes(typeof v)||typeof v==='number'&&!Number.isFinite(v))))fail(id,'invalid material properties');
 }else if(type==='item'){
  if(!positive(raw.stack_size))fail(id,'stack_size must be positive');
  if(raw.inventory_key!==undefined&&!string(raw.inventory_key))fail(id,'invalid inventory_key');
  if(raw.material!==undefined&&!string(raw.material))fail(id,'invalid material reference');
 }else if(type==='recipe'){
  if(!positive(raw.duration))fail(id,'duration must be positive');
  for(const field of ['inputs','outputs']){
   const a=raw[field];if(!list(a)||a.length===0||a.length>32)fail(id,`${field} must contain 1–32 ingredients`);
   for(const ingredient of a)if(!obj(ingredient)||!string(ingredient.item)||!positive(ingredient.amount))fail(id,`invalid ${field} ingredient`);
   if(!unique(a.map(v=>(v as {item:string}).item)))fail(id,`duplicate ${field} item`);
  }
 }else if(type==='resource_node'){
  if(!['forest','quarry'].includes(String(raw.ground)))fail(id,'invalid resource ground');
  if(!string(raw.output_item))fail(id,'resource output_item required');
  if(!positive(raw.yield_per_action)||!positive(raw.harvest_duration_ticks))fail(id,'resource yields and duration must be positive');
  if(raw.required_capability!==undefined&&!string(raw.required_capability))fail(id,'invalid capability requirement');
 }else if(type==='entity'){
  if(!ENTITY_KINDS.includes(raw.kind as typeof ENTITY_KINDS[number]))fail(id,'unknown entity kind');
  if(!list(raw.technical_components)||!unique(raw.technical_components)||raw.technical_components.some(c=>!CORE_COMPONENTS.includes(c as typeof CORE_COMPONENTS[number])))fail(id,'invalid technical components');
  if(raw.module_slots!==undefined&&(!obj(raw.module_slots)||Object.entries(raw.module_slots).some(([slot,count])=>!slot||!integer(count)||Number(count)>32)))fail(id,'module_slots must be nonnegative integers <= 32');
 }else if(type==='module'){
  if(!string(raw.slot))fail(id,'module slot is required');
  if(!list(raw.allowed_kinds)||raw.allowed_kinds.length===0||!unique(raw.allowed_kinds)||raw.allowed_kinds.some(k=>!ENTITY_KINDS.includes(k as typeof ENTITY_KINDS[number])))fail(id,'invalid allowed_kinds');
  if(!list(raw.effects)||raw.effects.length===0||raw.effects.length>8)fail(id,'module needs 1–8 effects');
  for(const effect of raw.effects){
   if(!obj(effect)||!['carry_capacity','inventory_capacity','capability'].includes(String(effect.kind)))fail(id,'unknown module effect');
   if(effect.kind==='capability'?!string(effect.capability):!positive(effect.amount))fail(id,'invalid module effect parameters');
  }
 }else fail(id,'unknown definition type '+String(type));
 return structuredClone(raw) as Definition;
}
function deepFreeze<T>(value:T):T{
 if(value&&typeof value==='object'&&!Object.isFrozen(value)){
  for(const entry of Object.values(value))deepFreeze(entry);
  Object.freeze(value);
 }
 return value;
}
/** Factorio-inspired registration, but compiled/validated data rather than runtime third-party code. */
export class DefinitionRegistry {
 private definitions=new Map<string,Definition>();
 private byType=new Map<DefinitionType,Definition[]>();
 private packages=new Map<string,string>();
 constructor(packs:ContentPack[]){
  const waiting=new Map<string,ContentPack>();
  for(const pack of packs){
   const m=pack.manifest;
   if(!m||typeof m.id!=='string'||!/^[a-z][a-z0-9_-]*$/.test(m.id)||!string(m.version)||!Array.isArray(pack.definitions))
    throw Error('Invalid content pack manifest');
   if(waiting.has(m.id))throw Error('Duplicate content pack '+m.id);
   waiting.set(m.id,pack);
  }
  const visit=(id:string,stack:string[])=>{
   if(this.packages.has(id))return;
   if(stack.includes(id))throw Error('Circular content dependencies: '+[...stack,id].join(' -> '));
   const pack=waiting.get(id);
   if(!pack)throw Error('Missing content pack dependency '+id);
   const deps=pack.manifest.dependencies??[];
   if(!list(deps)||deps.some(x=>!string(x)))throw Error('Invalid dependencies in '+id);
   for(const dep of deps)visit(dep,[...stack,id]);
   this.register(id,pack.definitions);
   this.packages.set(id,pack.manifest.version);
  };
  for(const id of [...waiting.keys()].sort())visit(id,[]);
  for(const def of this.definitions.values())this.validateReferences(def);
  for(const [type,defs] of this.byType)this.byType.set(type,Object.freeze(defs) as unknown as Definition[]);
 }
 /** Equivalent to data.extend([...]) inside an official, compiled content package. */
 private register(namespace:string,raw:unknown[]){
  for(const record of raw){
   const def=validate(record);
   if(def.id.split(':')[0]!==namespace)fail(def.id,'namespace does not match its pack');
   if(this.definitions.has(def.id))fail(def.id,'duplicate definition id');
   const frozen=deepFreeze(def);
   this.definitions.set(frozen.id,frozen);
   const list=this.byType.get(frozen.type)??[];
   list.push(frozen);this.byType.set(frozen.type,list);
  }
 }
 private validateReferences(def:Definition){
  const ref=(id:string,type:DefinitionType)=>{
   if(this.definitions.get(id)?.type!==type)fail(def.id,`missing ${type} reference ${id}`);
  };
  if(def.type==='item'&&def.material)ref(def.material,'material');
  if(def.type==='recipe')for(const entry of [...def.inputs,...def.outputs])ref(entry.item,'item');
  if(def.type==='resource_node')ref(def.output_item,'item');
  if(def.type==='module'&&def.effects.some(x=>x.kind==='carry_capacity')&&!def.allowed_kinds.includes('person'))
   fail(def.id,'carry_capacity requires a person-compatible module');
 }
 get(id:DefinitionId):Definition|undefined{return this.definitions.get(id);}
 require<T extends DefinitionType>(id:string,type:T):Extract<Definition,{type:T}>{
  const def=this.definitions.get(id);
  if(!def||def.type!==type)throw Error(`Unknown ${type}: ${id}`);
  return def as Extract<Definition,{type:T}>;
 }
 list<T extends DefinitionType>(type:T):ReadonlyArray<Extract<Definition,{type:T}>>{
  return (this.byType.get(type)??[]) as Extract<Definition,{type:T}>[];
 }
 item(id:string):ItemDefinition{return this.require(id,'item');}
 recipe(id:string):RecipeDefinition{return this.require(id,'recipe');}
 entity(id:string):EntityDefinition{return this.require(id,'entity');}
 module(id:string):ModuleDefinition{return this.require(id,'module');}
 resourceNode(id:string):ResourceNodeDefinition{return this.require(id,'resource_node');}
 inventoryKey(id:string):string{return this.item(id).inventory_key??id;}
 packageVersions():Readonly<Record<string,string>>{return Object.fromEntries(this.packages);}
}
/** Typed extension API; packages use the same data as a JSON file would. */
export function definePack(manifest:ContentPack['manifest'],define:(data:{extend:(definitions:Definition[])=>void})=>void):ContentPack{
 const definitions:Definition[]=[];
 define({extend(entries){definitions.push(...entries);}});
 return {manifest,definitions};
}
