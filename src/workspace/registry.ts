export type WindowKind='world'|'scripts'|'controller'|'learn'|'docs'|'python'|'console'|'overview'|'settings'|'document';
export type ViewTab='code'|'docs'|'notes'|'output'|'history';
export type WindowState={id:string;kind:WindowKind;controllerId?:string;x:number;y:number;width:number;height:number;minimized:boolean;maximized:boolean;z:number;tab:ViewTab;docScope?:'python'|'game';docId?:string;docTabs?:string[];activeDoc?:string};
export type WorkspaceState={windows:WindowState[];focus:string|null;nextZ:number};
const titles:Record<WindowKind,string>={world:'World View',scripts:'Script Explorer',controller:'Python Controller',learn:'Learn Python',docs:'Game API',python:'Python Reference',console:'Runtime Console',overview:'Colony Overview',settings:'Settings',document:'Reference Page'};
export function windowTitle(w:WindowState,filename?:string){return w.kind==='controller'?filename??titles.controller:titles[w.kind];}
export function startupWorkspace():WorkspaceState {
 const base=newWorkspace();
 return upsertWindow({nextZ:1,focus:null,windows:[]},'controller','ctrl_000005');
}
export function activeWorkspace():WorkspaceState {
 return {nextZ:2,focus:'overview',windows:[
  {id:'overview',kind:'overview',x:30,y:26,width:740,height:570,minimized:false,maximized:false,z:1,tab:'code'}
 ]};
}
export function newWorkspace():WorkspaceState{
 return {nextZ:5,focus:'world',windows:[
 {id:'world',kind:'world',x:24,y:18,width:640,height:440,minimized:false,maximized:false,z:1,tab:'code'},
 {id:'learn',kind:'learn',x:690,y:32,width:390,height:485,minimized:false,maximized:false,z:2,tab:'code'},
 {id:'scripts',kind:'scripts',x:32,y:485,width:315,height:330,minimized:false,maximized:false,z:3,tab:'code'}]};
}
export function upsertWindow(state:WorkspaceState,kind:WindowKind,controllerId?:string):WorkspaceState{
 const id=kind==='controller'?'controller:'+controllerId:kind;
 const existing=state.windows.find(w=>w.id===id);
 if(existing)return {nextZ:state.nextZ+1,focus:id,windows:state.windows.map(w=>w.id===id?{...w,minimized:false,z:state.nextZ}:w)};
 const w:WindowState={id,kind,controllerId,x:65+state.windows.length*22,y:44+state.windows.length*20,
  width:kind==='controller'?650:kind==='python'?785:kind==='docs'?550:410,height:kind==='controller'?530:kind==='python'?600:420,
  minimized:false,maximized:false,z:state.nextZ,tab:'code',docScope:kind==='docs'?'game':'python',docTabs:kind==='python'?['python:python-start']:kind==='docs'?['game:print']:[],activeDoc:kind==='python'?'python:python-start':kind==='docs'?'game:print':''};
 return {nextZ:state.nextZ+1,focus:id,windows:[...state.windows,w]};
}
export function updateWindow(state:WorkspaceState,id:string,change:Partial<WindowState>):WorkspaceState{
 return {...state,windows:state.windows.map(w=>w.id===id?{...w,...change}:w)};
}
export function focusWindow(state:WorkspaceState,id:string):WorkspaceState{
 return {...state,focus:id,nextZ:state.nextZ+1,windows:state.windows.map(w=>w.id===id?{...w,z:state.nextZ,minimized:false}:w)};
}
export function closeWindow(state:WorkspaceState,id:string):WorkspaceState{
 return {...state,focus:state.focus===id?null:state.focus,windows:state.windows.filter(w=>w.id!==id)};
}
export function parseWorkspace(value:unknown):WorkspaceState{
 if(!value||typeof value!=='object')return newWorkspace();
 const v=value as Partial<WorkspaceState>;
 if(!Array.isArray(v.windows)||!Number.isInteger(v.nextZ))return newWorkspace();
 const kinds=['world','scripts','controller','learn','docs','python','console','overview','settings','document'];
 const valid=v.windows.filter(w=>w&&typeof w.id==='string'&&kinds.includes(w.kind)
  &&['x','y','width','height','z'].every(k=>Number.isFinite(w[k as keyof WindowState]))
  &&w.width>=240&&w.height>=180&&w.width<=3000&&w.height<=2200).slice(0,40);
 return {...newWorkspace(),windows:valid,nextZ:Math.max(5,v.nextZ!),focus:typeof v.focus==='string'?v.focus:null};
}

/** Popout windows have distinct identity and taskbar entries. */
export function popoutDocument(state:WorkspaceState,scope:'python'|'game',id:string):WorkspaceState{
 const windowId='document:'+scope+':'+id;
 const existing=state.windows.find(w=>w.id===windowId);
 if(existing)return focusWindow(state,windowId);
 const key=scope+':'+id;
 const win:WindowState={id:windowId,kind:'document',docScope:scope,docId:id,
  docTabs:[key],activeDoc:key,x:100+state.windows.length*13,y:75+state.windows.length*11,
  width:550,height:470,minimized:false,maximized:false,z:state.nextZ,tab:'code'};
 return {...state,nextZ:state.nextZ+1,focus:windowId,windows:[...state.windows,win]};
}
