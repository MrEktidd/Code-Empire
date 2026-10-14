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
  if (!obj || typeof obj!=='object')return false;
  const c=obj as Partial<Campaign>;
  if(c.schema!==WORLD_SCHEMA || !Number.isFinite(c.savedAt) || !Number.isInteger(c.lessonIndex))return false;
  const w=c.world as WorldState | undefined;
  if(!w || w.schema!==WORLD_SCHEMA || !Number.isInteger(w.tick) || w.tick<0 ||
    !Array.isArray(w.tiles) || w.tiles.length!==WIDTH*HEIGHT ||
    !Array.isArray(w.workers) || w.workers.length<1 ||
    !Array.isArray(w.buildings) || !w.stocks || !Object.values(w.stocks).every(Number.isFinite))return false;
  return Array.isArray(c.controllers) && c.controllers.every(s=>
    typeof s.id==='string' && typeof s.filename==='string' && typeof s.source==='string' &&
    typeof s.notes==='string' && Number.isInteger(s.intervalTicks) && s.intervalTicks>0 &&
    Number.isInteger(s.nextRunTick) && s.nextRunTick>=0 &&
    (s.ownerEntityId===null || typeof s.ownerEntityId==='string') &&
    typeof s.memory==='object' && s.memory!==null && !Array.isArray(s.memory));
}
export function downloadCampaign(world:WorldState,controllers:Controller[],lessonIndex:number){
  const payload:Campaign={schema:WORLD_SCHEMA,savedAt:Date.now(),world,controllers,lessonIndex};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='code-empire-v0.2.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
