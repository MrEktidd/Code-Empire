import { WORLD_SCHEMA, WIDTH, HEIGHT } from '../engine/types';
import type { Campaign, Controller, WorldState } from '../engine/types';
// New database deliberately begins at v0.2; no v0.1 save migration is performed.
const NAME='code-empire-v2', STORE='campaigns', SLOT='autosave';
async function open():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const r=indexedDB.open(NAME,1);
    r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};
    r.onerror=()=>reject(r.error);
    r.onsuccess=()=>resolve(r.result);
  });
}
async function withStore<T>(mode:IDBTransactionMode,fn:(s:IDBObjectStore,done:(v:T)=>void)=>void):Promise<T>{
  const db=await open();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,mode);
    let value:T;
    tx.oncomplete=()=>{db.close();resolve(value);};
    tx.onerror=()=>{db.close();reject(tx.error);};
    tx.onabort=()=>{db.close();reject(tx.error);};
    fn(tx.objectStore(STORE),v=>{value=v;});
  });
}
export async function loadCampaign():Promise<Campaign | undefined>{
  return withStore<Campaign | undefined>('readonly',(s,done)=>{
    const r=s.get(SLOT);
    r.onsuccess=()=>done(r.result as Campaign | undefined);
  });
}
export async function saveCampaign(world:WorldState,controllers:Controller[],lessonIndex:number):Promise<void>{
  const campaign:Campaign={schema:WORLD_SCHEMA,savedAt:Date.now(),world,controllers,lessonIndex};
  await withStore<void>('readwrite',(s,done)=>{s.put(campaign,SLOT);done();});
}
export async function deleteCampaign():Promise<void>{
  await withStore<void>('readwrite',(s,done)=>{s.delete(SLOT);done();});
}
export function validCampaign(obj:unknown):obj is Campaign{
 if(!obj||typeof obj!=='object'||Array.isArray(obj))return false;
 const c=obj as Partial<Campaign>;
 if(c.schema!==WORLD_SCHEMA||!Number.isFinite(c.savedAt)||c.savedAt!<0||
  !Number.isInteger(c.lessonIndex)||c.lessonIndex!<0||c.lessonIndex!>10000)return false;
 const w=c.world as WorldState|undefined;
 if(!w||w.schema!==WORLD_SCHEMA||!Number.isInteger(w.tick)||w.tick<0||
  !Number.isInteger(w.seed)||!Array.isArray(w.tiles)||w.tiles.length!==WIDTH*HEIGHT||
  !Array.isArray(w.workers)||w.workers.length<1||w.workers.length>100000||
  !Array.isArray(w.buildings)||w.buildings.length>100000||
  !w.stocks||!['wood','stone','food'].every(k=>Number.isFinite(w.stocks[k as keyof typeof w.stocks])&&w.stocks[k as keyof typeof w.stocks]>=0)||
  !Number.isFinite(w.totalHarvested)||!Array.isArray(w.events)||
  !w.events.every(e=>typeof e==='string'&&e.length<=2000))return false;
 const integer=(v:unknown)=>Number.isInteger(v)&&Number(v)>=0;
 const grid=(x:number,y:number)=>integer(x)&&integer(y)&&x<WIDTH&&y<HEIGHT;
 const ground=new Set(['meadow','forest','quarry','farm','stockpile','water']);
 if(!w.tiles.every((t,i)=>t&&grid(t.x,t.y)&&t.y*WIDTH+t.x===i&&ground.has(t.ground)&&integer(t.remaining)))return false;
 const ids=new Set<string>();
 const register=(id:unknown):boolean=>{
  if(typeof id!=='string'||id.length<1||id.length>128||ids.has(id))return false;
  ids.add(id);return true;
 };
 if(!w.workers.every(x=>x&&register(x.id)&&typeof x.name==='string'&&typeof x.role==='string'&&grid(x.x,x.y)&&
  integer(x.carried)&&integer(x.capacity)&&x.capacity>0&&x.carried<=x.capacity&&
  [null,'wood','stone'].includes(x.carrying)&&[null,'wood','stone'].includes(x.policy)&&
  [null,'independent','delegated','event_only'].includes(x.controlMode)&&
  (x.task===null||(x.task&&['gather','deposit','move'].includes(x.task.kind)&&grid(x.task.x,x.task.y)))))return false;
 if(!w.buildings.every(x=>x&&register(x.id)&&typeof x.name==='string'&&x.type==='farm'&&grid(x.x,x.y)&&
  ['food','rest'].includes(x.mode)&&['independent','delegated','event_only'].includes(x.controlMode)))return false;
 if(!Array.isArray(c.controllers)||c.controllers.length>120000)return false;
 const controllerIds=new Set<string>(), filenames=new Set<string>();
 return c.controllers.every(script=>{
  if(!script||typeof script.id!=='string'||controllerIds.has(script.id)||
   typeof script.filename!=='string'||script.filename.length>160||filenames.has(script.filename)||
   !script.filename.endsWith('.py')||typeof script.source!=='string'||script.source.length>1000000||
   typeof script.notes!=='string'||script.notes.length>200000||
   !['npc','farm','global'].includes(script.ownerType)||
   (script.ownerEntityId!==null&&!ids.has(script.ownerEntityId))||
   typeof script.enabled!=='boolean'||!integer(script.intervalTicks)||script.intervalTicks<1||
   !integer(script.nextRunTick)||!integer(script.executions)||!['idle','success','error'].includes(script.lastStatus)||
   (script.lastError!==null&&typeof script.lastError!=='string')||!Array.isArray(script.lastOutput)||
   !script.lastOutput.every(x=>typeof x==='string')||!script.memory||
   typeof script.memory!=='object'||Array.isArray(script.memory))return false;
  try{if(JSON.stringify(script.memory).length>32768)return false;}catch{return false;}
  if(script.checkpoints&&(!Array.isArray(script.checkpoints)||script.checkpoints.length>40||
   !script.checkpoints.every(x=>Number.isFinite(x.savedAt)&&typeof x.source==='string'&&x.source.length<=1000000)))return false;
  controllerIds.add(script.id);filenames.add(script.filename);return true;
 });
}

export function downloadCampaign(world:WorldState,controllers:Controller[],lessonIndex:number){
  const payload:Campaign={schema:WORLD_SCHEMA,savedAt:Date.now(),world,controllers,lessonIndex};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='code-empire-v0.2.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
