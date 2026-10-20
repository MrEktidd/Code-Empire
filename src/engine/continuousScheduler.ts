import type {Controller,ExecutionEntry,WorldState} from './types';
import type {ContinuousStep} from '../platform/python/PythonRuntime';
import {worldSnapshot} from './world';
import {startPhysicalAction} from './automation';

export type ContinuousExecutor=(id:string,operation:'start'|'resume'|'stop',
  snapshot:ReturnType<typeof worldSnapshot>,source?:string,owner?:string|null,
  response?:Record<string,unknown>|null)=>Promise<ContinuousStep>;
type Waiting=
 |{kind:'job';jobId:string}
 |{kind:'ticks';until:number;response:Record<string,unknown>}
 |{kind:'signal';type:string;sequence:number}
 |{kind:'next_tick';until:number;response:Record<string,unknown>};
type Program={source:string;started:boolean;waiting?:Waiting;response?:Record<string,unknown>};

export class ContinuousScheduler{
 private sessions=new Map<string,Program>();
 private prefix=0;
 /** Called at a campaign boundary. Python code cannot outlive its world. */
 reset():void{this.prefix++;this.sessions.clear();}
 async pulse(world:WorldState,controllers:Controller[],execute:ContinuousExecutor):
  Promise<{world:WorldState;controllers:Controller[];entries:ExecutionEntry[]}>{
  let current=world;
  const resultControllers=controllers.map(c=>({...c}));
  const entries:ExecutionEntry[]=[];
  const enabled=new Set(controllers.filter(c=>c.executionMode==='continuous'&&c.enabled&&
   c.ownerType==='npc'&&!!current.workers.find(w=>w.id===c.ownerEntityId)).map(c=>c.id));
  for(const [id] of this.sessions)if(!enabled.has(id)){
   this.sessions.delete(id);
   try{await execute(this.prefix+':'+id,'stop',worldSnapshot(current));}catch{/* Stop is best effort; new starts use distinct identities. */}
  }
  for(const c of resultControllers.filter(c=>enabled.has(c.id)).sort((a,b)=>a.id.localeCompare(b.id)).slice(0,16)){
   let session=this.sessions.get(c.id);
   if(session&&session.source!==c.source){
    try{await execute(this.prefix+':'+c.id,'stop',worldSnapshot(current));}catch{/* Restart replaces stale generator. */}
    session=undefined;
   }
   if(!session){session={source:c.source,started:false};this.sessions.set(c.id,session);}
   let response:Record<string,unknown>|undefined=session.response;
   if(session.waiting){
    const wait=session.waiting;
    if(wait.kind==='ticks'||wait.kind==='next_tick'){
     if(current.tick<wait.until)continue;
     response=wait.response;
    }else if(wait.kind==='job'){
     const job=current.jobs.find(j=>j.id===wait.jobId);
     if(job?.status==='active')continue;
     response=job?{ok:job.status==='completed',job_id:job.id,reason:job.reason??''}
      :{ok:false,reason:'job_not_found'};
    }else{
     const event=current.signals.find(e=>e.sequence>wait.sequence&&e.type===wait.type);
     if(!event)continue;
     response={ok:true,event:{type:event.type,entity_id:event.entityId??null,
      tick:event.tick,payload:event.payload}};
    }
    session.waiting=undefined;
   }
   const output:string[]=[];
   let error:string|undefined;
   // Time slice prevents scripts that issue immediate failing commands forever
   // from monopolizing the tick, in addition to Python's loop watchdog.
   for(let attempt=0;attempt<8;attempt++){
    let outcome:ContinuousStep;
    try{
     outcome=await execute(this.prefix+':'+c.id,session.started?'resume':'start',
      worldSnapshot(current),session.started?undefined:session.source,c.ownerEntityId,response);
    }catch(e){error=String(e);this.sessions.delete(c.id);break;}
    session.started=true;
    output.push(...outcome.output);
    if(outcome.kind==='error'){error=outcome.error??'Unknown runtime failure';this.sessions.delete(c.id);break;}
    if(outcome.kind==='done'||outcome.kind==='stopped'){
     this.sessions.delete(c.id);c.enabled=false;break;
    }
    const request=outcome.request;
    if(!request){error='No suspension request';this.sessions.delete(c.id);break;}
    response=undefined;
    if(request.kind==='move'||request.kind==='harvest'||request.kind==='deposit'){
     const action=startPhysicalAction(current,c.ownerEntityId!,request);
     current=action.world;
     response=action.response as Record<string,unknown>;
     if(action.waitForJob&&action.response.job_id){
      session.waiting={kind:'job',jobId:action.response.job_id};
      break;
     }
    }else if(request.kind==='wait_ticks'){
     const ticks=request.ticks??-1;
     if(!Number.isSafeInteger(ticks)||ticks<0||ticks>1000000)
      response={ok:false,reason:'invalid_wait'};
     else if(ticks===0)response={ok:true};
     else{session.waiting={kind:'ticks',until:current.tick+ticks,response:{ok:true}};break;}
    }else if(request.kind==='job_completed'){
     const job=current.jobs.find(j=>j.id===request.jobId&&j.ownerId===c.ownerEntityId);
     if(!job)response={ok:false,reason:'job_not_found'};
     else if(job.status==='active'){session.waiting={kind:'job',jobId:job.id};break;}
     else response={ok:job.status==='completed',job_id:job.id,reason:job.reason??''};
    }else if(request.kind==='signal'){
     if(!['job.completed','inventory.changed','entity.created','population.seeded'].includes(request.signal??''))
      response={ok:false,reason:'unknown_signal'};
     else{
      session.waiting={kind:'signal',type:request.signal!,sequence:current.signals.at(-1)?.sequence??0};
      break;
     }
    }
    if(attempt===7){
     session.waiting={kind:'next_tick',until:current.tick+1,response:response??{ok:true}};
    }
   }
   c.executions++;
   c.lastStatus=error?'error':'success';c.lastError=error??null;c.lastOutput=output.slice(-40);
   if(error||output.length)entries.push({tick:current.tick,controllerId:c.id,filename:c.filename,
    success:!error,output:output.slice(-40),error,commands:0});
   if(error)c.enabled=false;
  }
  return {world:current,controllers:resultControllers,entries};
 }
}
