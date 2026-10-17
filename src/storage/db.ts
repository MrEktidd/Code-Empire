import {WORLD_SCHEMA,WIDTH,HEIGHT} from '../engine/types';
import type {Campaign,Controller,WorldState} from '../engine/types';
import {CONTENT} from '../games/code-empire/content/base';
import {entityRefs} from '../engine/entities/identity';
const NAME='code-empire-v032',STORE='campaigns',SLOT='autosave';
async function open():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open(NAME,1);
  r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};
  r.onerror=()=>reject(r.error);r.onsuccess=()=>resolve(r.result);
 });
}
async function withStore<T>(mode:IDBTransactionMode,fn:(s:IDBObjectStore,done:(v:T)=>void)=>void):Promise<T>{
 const db=await open();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,mode);let value:T;
  tx.oncomplete=()=>{db.close();resolve(value);};
  tx.onerror=()=>{db.close();reject(tx.error);};
  tx.onabort=()=>{db.close();reject(tx.error);};
  fn(tx.objectStore(STORE),v=>{value=v;});
 });
}
export async function loadCampaign():Promise<Campaign|undefined>{
 const raw=await withStore<unknown>('readonly',(s,done)=>{const r=s.get(SLOT);r.onsuccess=()=>done(r.result);});
 return migrateCampaign(raw);
}
/** v0.3.2 deliberately starts a fresh save format. No legacy migration. */
export function migrateCampaign(raw:unknown):Campaign|undefined{return validCampaign(raw)?raw:undefined;}
export async function saveCampaign(world:WorldState,controllers:Controller[],lessonIndex:number):Promise<void>{
 const campaign:Campaign={schema:WORLD_SCHEMA,savedAt:Date.now(),world,controllers,lessonIndex};
 await withStore<void>('readwrite',(s,done)=>{s.put(campaign,SLOT);done();});
}
export async function deleteCampaign():Promise<void>{
 await withStore<void>('readwrite',(s,done)=>{s.delete(SLOT);done();});
}
const obj=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const nat=(v:unknown):v is number=>Number.isSafeInteger(v)&&Number(v)>=0;
export function validCampaign(value:unknown):value is Campaign{
 if(!obj(value))return false;
 const c=value as Partial<Campaign>;
 if(c.schema!==WORLD_SCHEMA||!Number.isFinite(c.savedAt)||Number(c.savedAt)<0||!nat(c.lessonIndex)||c.lessonIndex>10000)return false;
 const w=c.world as WorldState|undefined;
 if(!w||w.schema!==WORLD_SCHEMA||!['dormant','active'].includes(w.phase)||!nat(w.tick)||!Number.isSafeInteger(w.seed)||
  !nat(w.housingCapacity)||w.housingCapacity<3||!Array.isArray(w.workers)||!Array.isArray(w.buildings)||
  !Array.isArray(w.entities)||!Array.isArray(w.relationships)||!Array.isArray(w.signals)||
  !Array.isArray(w.genesisArchive)||!Array.isArray(w.events)||!Array.isArray(w.tiles)||
  w.tiles.length!==(w.phase==='active'?WIDTH*HEIGHT:0)||w.workers.length>w.housingCapacity||
  w.workers.length>100000||w.entities.length>100000||w.buildings.length>100000||
  w.genesisArchive.length>10000||w.relationships.length>100000||w.signals.length>128||
  !obj(w.stocks)||Object.entries(w.stocks).some(([k,v])=>k.length>128||!nat(v))||
  !nat(w.totalHarvested)||w.events.some(e=>typeof e!=='string'||e.length>2000))return false;
 const ground=new Set(['meadow','forest','quarry','farm','stockpile','water']);
 const grid=(x:number,y:number)=>nat(x)&&nat(y)&&x<WIDTH&&y<HEIGHT;
 if(!w.tiles.every((tile,i)=>tile&&grid(tile.x,tile.y)&&tile.y*WIDTH+tile.x===i&&ground.has(tile.ground)&&nat(tile.remaining)))return false;
 const all=entityRefs(w),ids=new Set<string>();
 for(const e of all){
  if(typeof e.id!=='string'||e.id.length>128||!e.id||ids.has(e.id)||CONTENT.get(e.definitionId)?.type!=='entity')return false;
  ids.add(e.id);
 }
 const installed=(e:{installedModules:Record<string,string[]>;definitionId:string})=>{
  if(!obj(e.installedModules))return false;
  const def=CONTENT.entity(e.definitionId);
  return Object.entries(e.installedModules).every(([slot,items])=>Array.isArray(items)&&items.length<=(def.module_slots?.[slot]??0)&&
   new Set(items).size===items.length&&items.every(id=>typeof id==='string'&&CONTENT.get(id)?.type==='module'&&
     CONTENT.module(id).slot===slot&&CONTENT.module(id).allowed_kinds.includes(def.kind)));
 };
 if(!w.workers.every(e=>e&&e.definitionId==='core:founder'&&typeof e.name==='string'&&
  (e.sex===undefined||e.sex==='male'||e.sex==='female')&&typeof e.role==='string'&&grid(e.x,e.y)&&installed(e)&&
  nat(e.capacity)&&e.capacity>=1&&nat(e.carried)&&e.carried<=e.capacity&&
  [null,'wood','stone'].includes(e.carrying)&&[null,'wood','stone'].includes(e.policy)&&
  [null,'independent','delegated','event_only'].includes(e.controlMode)&&
  (e.task===null||(e.task&&['gather','deposit','move'].includes(e.task.kind)&&grid(e.task.x,e.task.y)))))return false;
 if(!w.buildings.every(e=>e&&e.definitionId==='core:farm'&&e.type==='farm'&&
  typeof e.name==='string'&&grid(e.x,e.y)&&installed(e)&&['food','rest'].includes(e.mode)&&
  ['independent','delegated','event_only'].includes(e.controlMode)))return false;
 if(!w.entities.every(e=>e&&typeof e.name==='string'&&typeof e.kind==='string'&&
  CONTENT.entity(e.definitionId).kind===e.kind&&installed(e)&&
  (e.locationId===null||ids.has(e.locationId))&&obj(e.technicalState)))return false;
 if(!w.genesisArchive.every(a=>a&&ids.has(a.id)&&typeof a.name==='string'&&a.name.length>0&&a.name.length<=32&&
  (a.sex==='male'||a.sex==='female')&&nat(a.createdTick)&&a.createdTick<=w.tick&&
  w.workers.some(e=>e.id===a.id&&e.name===a.name&&e.sex===a.sex)))return false;
 if(new Set(w.genesisArchive.map(a=>a.id)).size!==w.genesisArchive.length)return false;
 if(!w.relationships.every(r=>r&&ids.has(r.from)&&ids.has(r.to)&&r.from!==r.to&&['owns','manages','member_of','located_in','operates'].includes(r.kind)))return false;
 if(!w.signals.every((s,i)=>s&&nat(s.tick)&&nat(s.sequence)&&s.sequence>0&&s.tick<=w.tick&&
  (i===0||s.sequence>w.signals[i-1].sequence)&&typeof s.type==='string'&&obj(s.payload)&&
  (s.entityId===undefined||typeof s.entityId==='string')))return false;
 if(w.phase==='dormant'&&(all.length!==0||w.tick!==0||w.signals.length>0))return false;
 if(!Array.isArray(c.controllers)||c.controllers.length>120000)return false;
 const controllerIds=new Set<string>(),filenames=new Set<string>();
 for(const script of c.controllers as Controller[]){
  if(!script||typeof script.id!=='string'||controllerIds.has(script.id)||
   typeof script.filename!=='string'||filenames.has(script.filename)||
   typeof script.source!=='string'||script.source.length>1000000||
   typeof script.notes!=='string'||!['npc','farm','global'].includes(script.ownerType)||
   (script.ownerEntityId!==null&&!ids.has(script.ownerEntityId))||
   typeof script.enabled!=='boolean'||!nat(script.intervalTicks)||script.intervalTicks<1||
   !nat(script.nextRunTick)||!nat(script.executions)||!['idle','success','error'].includes(script.lastStatus)||
   (script.lastError!==null&&typeof script.lastError!=='string')||
   !Array.isArray(script.lastOutput)||!script.lastOutput.every(v=>typeof v==='string')||!obj(script.memory))return false;
  try{if(JSON.stringify(script.memory).length>32768)return false;}catch{return false;}
  controllerIds.add(script.id);filenames.add(script.filename);
 }
 return true;
}
export function downloadCampaign(world:WorldState,controllers:Controller[],lessonIndex:number){
 const payload:Campaign={schema:WORLD_SCHEMA,savedAt:Date.now(),world,controllers,lessonIndex};
 const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='code-empire-v0.3.2.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
}
