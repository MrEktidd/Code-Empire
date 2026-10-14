import { WORLD_SCHEMA } from '../engine/types';
import type { Campaign, ScriptFile, WorldState } from '../engine/types';
const DB_NAME = 'code-empire';
const STORE = 'campaigns';
const SLOT = 'autosave';

function connect(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
async function transaction<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore, done: (value: T) => void) => void): Promise<T> {
  const db = await connect();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    let result: T;
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
    work(tx.objectStore(STORE), value => { result = value; });
  });
}

export async function loadCampaign(): Promise<Campaign | undefined> {
  return transaction<Campaign | undefined>('readonly', (store, done) => {
    const r = store.get(SLOT);
    r.onsuccess = () => done(r.result as Campaign | undefined);
  });
}
export async function saveCampaign(world: WorldState, scripts: ScriptFile[]): Promise<void> {
  const value: Campaign = { schema: WORLD_SCHEMA, savedAt: Date.now(), world, scripts };
  await transaction<void>('readwrite', (store, done) => { store.put(value, SLOT); done(); });
}
export function validCampaign(data: unknown): data is Campaign {
  if (!data || typeof data !== 'object') return false;
  const c = data as Partial<Campaign>;
  const w = c.world as Partial<WorldState> | undefined;
  return c.schema === WORLD_SCHEMA && typeof c.savedAt === 'number'
    && !!w && w.schema === WORLD_SCHEMA && Number.isInteger(w.tick)
    && Array.isArray(w.tiles) && w.tiles.length === 176
    && Array.isArray(w.workers) && w.workers.length > 0
    && typeof w.stocks?.wood === 'number' && typeof w.stocks?.stone === 'number'
    && typeof w.stocks?.food === 'number' && Array.isArray(c.scripts)
    && c.scripts.every(s => typeof s.path === 'string' && typeof s.source === 'string'
      && Number.isInteger(s.interval) && s.interval > 0 && typeof s.nextRun === 'number');
}
export function exportCampaign(world: WorldState, scripts: ScriptFile[]): void {
  const payload: Campaign = { schema: WORLD_SCHEMA, savedAt: Date.now(), world, scripts };
  const objectUrl = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = 'code-empire-save.json';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}
