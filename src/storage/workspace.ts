import {newWorkspace,parseWorkspace} from '../workspace/registry';
import type {WorkspaceState} from '../workspace/registry';
const KEY='code-empire-workspace-v2';
function profile():string{return typeof window!=='undefined'&&window.matchMedia('(max-width: 760px)').matches?'mobile':'desktop';}
export function loadWorkspace():WorkspaceState{
 try{
  const saved=localStorage.getItem(KEY+':'+profile())??(profile()==='desktop'?localStorage.getItem(KEY):null);
  return parseWorkspace(saved?JSON.parse(saved):null);
 }catch{return newWorkspace();}
}
export function saveWorkspace(state:WorkspaceState){
 try{localStorage.setItem(KEY+':'+profile(),JSON.stringify(state));}catch{/* Storage might be unavailable. */}
}

export function hasSavedWorkspace():boolean{
 try{return localStorage.getItem(KEY+':'+profile())!==null;}catch{return false;}
}
