import {newWorkspace,parseWorkspace} from '../workspace/registry';
import type {WorkspaceState} from '../workspace/registry';
const KEY='code-empire-workspace-v2';
export function loadWorkspace():WorkspaceState{
 try{return parseWorkspace(JSON.parse(localStorage.getItem(KEY)??'null'));}
 catch{return newWorkspace();}
}
export function saveWorkspace(state:WorkspaceState){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{/* Private browsing may disable preferences */}}
