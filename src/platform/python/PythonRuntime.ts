import type {PythonResult} from '../controllers/types';
export type ContinuousRequest={
 kind:'move'|'harvest'|'deposit'|'wait_ticks'|'job_completed'|'signal';
 direction?:string;entityId?:string;storageId?:string;ticks?:number;jobId?:string;signal?:string;
};
export type ContinuousStep={
 kind:'request'|'done'|'error'|'stopped';request?:ContinuousRequest;
 output:string[];error?:string;
};
type Pending={resolve:(value:PythonResult)=>void;reject:(reason:Error)=>void;timer:ReturnType<typeof setTimeout>};
export class PythonRuntime {
 private worker:Worker|null=null;
 private ready:Promise<void>|null=null;
 private pending=new Map<number,Pending>();
 private counter=0;
 private initialize():Promise<void>{
  if(this.ready)return this.ready;
  this.ready=new Promise<void>((resolve,reject)=>{
   const worker=new Worker(new URL('./python.worker.ts',import.meta.url),{type:'module'});
   this.worker=worker;
   const timer=setTimeout(()=>{this.reset();reject(new Error('Python runtime initialization timed out. Check your connection.'));},60000);
   worker.onmessage=e=>{
    const msg=e.data;
    if(msg.type==='ready'){clearTimeout(timer);resolve();}
    else if(msg.type==='fatal'){clearTimeout(timer);this.reset();reject(new Error(msg.error));}
    else if(msg.type==='result'||msg.type==='error'){
     const p=this.pending.get(msg.id);if(!p)return;
     clearTimeout(p.timer);this.pending.delete(msg.id);
     if(msg.type==='error')p.reject(new Error(msg.error));
     else p.resolve(msg.value);
    }
   };
   worker.onerror=e=>{clearTimeout(timer);this.reset();reject(new Error(e.message||'Python worker failed'));};
  });
  return this.ready;
 }
 async run<TCommand=unknown>(source:string,snapshot:unknown,memory:Record<string,unknown>,ownerEntityId:string|null,adapterSource:string):Promise<PythonResult<TCommand>>{
  await this.initialize();
  return new Promise<PythonResult<TCommand>>((resolve,reject)=>{
   const id=++this.counter;
   const timer=setTimeout(()=>{this.reset();reject(new Error('Script exceeded its 2-second execution budget. Python runtime restarted.'));},2000);
   this.pending.set(id,{resolve:resolve as unknown as (value:PythonResult)=>void,reject,timer});
   this.worker!.postMessage({type:'run',id,source,snapshot,memory,ownerEntityId,adapterSource});
  });
 }
 /** Resume an actual persistent Python generator, not a re-run of its source.
  * Every call has its own watchdog; the engine drives each yield explicitly. */
 async stepContinuous(programId:string,operation:'start'|'resume'|'stop',
  snapshot:unknown,source?:string,ownerEntityId?:string|null,
  response?:Record<string,unknown>|null):Promise<ContinuousStep>{
  await this.initialize();
  return new Promise<ContinuousStep>((resolve,reject)=>{
   const id=++this.counter;
   const timer=setTimeout(()=>{
    this.reset();reject(new Error('Continuous program exceeded its CPU budget; Python worker restarted.'));
   },2000);
   this.pending.set(id,{resolve:resolve as (value:PythonResult)=>void,reject,timer});
   this.worker!.postMessage({type:'continuous',id,programId,operation,snapshot,source,ownerEntityId,response});
  });
 }
 private reset(){
  this.worker?.terminate();this.worker=null;this.ready=null;
  for(const job of this.pending.values()){clearTimeout(job.timer);job.reject(new Error('Python runtime restarted.'));}
  this.pending.clear();
 }
 destroy(){this.reset();}
}
