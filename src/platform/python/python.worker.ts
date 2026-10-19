/// <reference lib="webworker" />
import { RUNNER } from './runner';
import {COOPERATIVE_RUNTIME} from './cooperative';
/** UI isolation, not a hardened sandbox: never run untrusted downloaded scripts. */
const ROOT='https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
type VM={globals:{set(name:string,value:unknown):void;get(name:string):unknown};runPythonAsync(code:string):Promise<unknown>};
let vm:VM|null=null;
async function initialize(){
 try{const pkg=await import(/* @vite-ignore */ ROOT+'pyodide.mjs');
  vm=await pkg.loadPyodide({indexURL:ROOT}) as VM;
  await vm.runPythonAsync(COOPERATIVE_RUNTIME);
  self.postMessage({type:'ready'});}
 catch(error){self.postMessage({type:'fatal',error:String(error)});}
}
self.onmessage=async(event:MessageEvent)=>{
 const msg=event.data;if(!vm||!['run','continuous'].includes(msg?.type))return;
 try{
  if(msg.type==='continuous'){
   vm.globals.set('_ce_program_id',msg.programId);
   vm.globals.set('_ce_snapshot',JSON.stringify(msg.snapshot??{}));
   if(msg.operation==='start'){
    vm.globals.set('_ce_source',msg.source);
    vm.globals.set('_ce_owner',msg.ownerEntityId);
   }else vm.globals.set('_ce_response',JSON.stringify(msg.response??null));
   const expression=msg.operation==='start'
    ? '_ce_start(_ce_program_id, _ce_source, _ce_snapshot, _ce_owner)'
    : msg.operation==='stop'?'_ce_stop(_ce_program_id)'
    : '_ce_resume(_ce_program_id, _ce_snapshot, json.loads(_ce_response))';
   await vm.runPythonAsync('import json\n_ce_continuous_result = json.dumps('+expression+')');
   self.postMessage({type:'result',id:msg.id,value:JSON.parse(String(vm.globals.get('_ce_continuous_result')))});
   return;
  }
  vm.globals.set('_ce_source',msg.source);
  vm.globals.set('_ce_snapshot',JSON.stringify(msg.snapshot));
  vm.globals.set('_ce_memory',JSON.stringify(msg.memory??{}));
  vm.globals.set('_ce_owner',msg.ownerEntityId??null);
  vm.globals.set('_ce_adapter_source',msg.adapterSource);
  await vm.runPythonAsync(RUNNER);
  self.postMessage({type:'result',id:msg.id,value:JSON.parse(String(vm.globals.get('_ce_result')))});
 }catch(error){self.postMessage({type:'error',id:msg.id,error:String(error)});}
};
void initialize();
