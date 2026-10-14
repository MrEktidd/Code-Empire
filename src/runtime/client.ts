import type { ScriptResult } from '../engine/types';
import type { Executor } from '../engine/scheduler';
type Pending = { resolve:(r:ScriptResult)=>void; reject:(e:Error)=>void; timer:ReturnType<typeof setTimeout> };
export class PythonRuntime {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private pending = new Map<number,Pending>();
  private counter = 0;

  private initialize(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = new Promise<void>((resolve,reject)=>{
      const worker = new Worker(new URL('./python.worker.ts', import.meta.url), {type:'module'});
      this.worker = worker;
      const timer = setTimeout(()=>{this.reset();reject(new Error('Python runtime initialization timed out. Check your internet connection.'));},60000);
      worker.onmessage = event => {
        const msg = event.data;
        if (msg.type === 'ready') {clearTimeout(timer);resolve();}
        else if (msg.type === 'fatal') {clearTimeout(timer);this.reset();reject(new Error(msg.error));}
        else if (msg.type === 'result' || msg.type === 'error') {
          const pending = this.pending.get(msg.id);
          if (!pending) return;
          clearTimeout(pending.timer);this.pending.delete(msg.id);
          if (msg.type === 'error') pending.reject(new Error(msg.error)); else pending.resolve(msg.value);
        }
      };
      worker.onerror = e => {clearTimeout(timer);this.reset();reject(new Error(e.message || 'Python worker failed'));};
    });
    return this.ready;
  }
  readonly execute: Executor = async (source,snapshot,memory,ownerEntityId)=>{
    await this.initialize();
    return new Promise<ScriptResult>((resolve,reject)=>{
      const id = ++this.counter;
      const timer = setTimeout(()=>{
        this.reset();
        reject(new Error('Script exceeded the 2-second execution limit. Runtime restarted.'));
      },2000);
      this.pending.set(id,{resolve,reject,timer});
      this.worker!.postMessage({type:'run',id,source,snapshot,memory,ownerEntityId});
    });
  };
  private reset() {
    this.worker?.terminate(); this.worker = null; this.ready = null;
    for (const job of this.pending.values()) {clearTimeout(job.timer);job.reject(new Error('Python runtime restarted.'));}
    this.pending.clear();
  }
  destroy() {this.reset();}
}
