/// <reference lib="webworker" />
import { RUNNER } from './runner';
/** UI isolation, not a hardened sandbox: never run untrusted downloaded scripts. */
const ROOT='https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
type VM={globals:{set(name:string,value:unknown):void;get(name:string):unknown};runPythonAsync(code:string):Promise<unknown>};
let vm:VM|null=null;
async function initialize(){
 try{const pkg=await import(/* @vite-ignore */ ROOT+'pyodide.mjs');
  vm=await pkg.loadPyodide({indexURL:ROOT}) as VM;self.postMessage({type:'ready'});}
 catch(error){self.postMessage({type:'fatal',error:String(error)});}
}
self.onmessage=async(event:MessageEvent)=>{
 const msg=event.data;if(msg?.type!=='run'||!vm)return;
 try{
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
