export type WindowKind='world'|'settlement'|'scripts'|'controller'|'learn'|'docs'|'python'|'console'|'overview'|'archive'|'settings'|'document';
export type ViewTab='code'|'docs'|'notes'|'output'|'history';
export type WindowState={id:string;kind:WindowKind;controllerId?:string;x:number;y:number;width:number;height:number;minimized:boolean;maximized:boolean;z:number;tab:ViewTab;docScope?:'python'|'game';docId?:string;docTabs?:string[];activeDoc?:string};
export type WorkspaceState={windows:WindowState[];focus:string|null;nextZ:number};
const titles:Record<WindowKind,string>={world:'World View',settlement:'Settlement',scripts:'Script Explorer',controller:'Python Controller',learn:'Learn Python',docs:'Game API',python:'Python Reference',console:'Runtime Console',overview:'Colony Overview',archive:'Genesis Archive',settings:'Settings',document:'Reference Page'};
export function windowTitle(w:WindowState,filename?:string){return w.kind==='controller'?filename??titles.controller:titles[w.kind];}
export function startupWorkspace():WorkspaceState {
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
  width:kind==='controller'?650:kind==='python'?785:kind==='settings'?820:kind==='docs'?550:410,height:kind==='controller'?530:kind==='python'?600:kind==='settings'?625:420,
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
 const kinds=['world','settlement','scripts','controller','learn','docs','python','console','overview','archive','settings','document'];
 const valid=v.windows.filter(w=>w&&typeof w.id==='string'&&kinds.includes(w.kind)
  &&['x','y','width','height','z'].every(k=>Number.isFinite(w[k as keyof WindowState]))
  &&w.width>0&&w.height>0&&w.width<=3000&&w.height<=2200)
  .slice(0,40).map(w=>({...w,width:Math.max(260,w.width),height:Math.max(180,w.height)}));
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

/** Workbench layouts are UI state only, not part of simulation/campaign state. */
export type WorkspaceArrangement='tile'|'cascade';
export type WorkspacePreset='programming'|'management'|'research';
export type WorkspaceBounds={width:number;height:number};
const clamp=(n:number,low:number,high:number)=>Math.max(low,Math.min(high,n));
export function arrangeWorkspace(state:WorkspaceState,arrangement:WorkspaceArrangement,bounds:WorkspaceBounds):WorkspaceState{
 const width=Math.max(320,bounds.width),height=Math.max(240,bounds.height);
 const windows=state.windows.filter(w=>!w.minimized);
 if(!windows.length)return state;
 const cols=Math.ceil(Math.sqrt(windows.length)),rows=Math.ceil(windows.length/cols);
 return {...state,windows:state.windows.map(w=>{
  const index=windows.findIndex(item=>item.id===w.id);
  if(index<0)return w;
  if(arrangement==='tile'){
   const cellW=width/cols,cellH=height/rows;
   // Mobile displays one window at a time. Its small tile cells must still
   // serialize to a valid desktop-size window so Continue can restore tabs.
   return {...w,maximized:false,x:Math.round(index%cols*cellW),y:Math.round(Math.floor(index/cols)*cellH),
    width:Math.max(260,Math.round(cellW)),height:Math.max(180,Math.round(cellH))};
  }
  return {...w,maximized:false,x:clamp(28+index*38,0,Math.max(0,width-300)),
   y:clamp(28+index*30,0,Math.max(0,height-180)),
   width:Math.min(width,Math.max(320,Math.round(width*.64))),
   height:Math.min(height,Math.max(240,Math.round(height*.7)))};
 })};
}
/** Focus on a task without destroying existing controller or document windows. */
export function applyWorkspacePreset(state:WorkspaceState,preset:WorkspacePreset,bounds:WorkspaceBounds):WorkspaceState{
 const required:WindowKind[]=preset==='programming'?['scripts','console','python']:
  preset==='management'?['world','overview']:['docs','python'];
 let next=state;
 for(const kind of required)next=upsertWindow(next,kind);
 const ids=new Set(required);
 const width=Math.max(320,bounds.width),height=Math.max(240,bounds.height);
 const selected=next.windows.filter(w=>ids.has(w.kind)&&w.kind!=='controller');
 const mainSize=preset==='programming' ? .62 : preset==='management' ? .65 : .5;
 next={...next,windows:next.windows.map(w=>{
  const i=selected.findIndex(x=>x.id===w.id);
  if(i<0)return {...w,minimized:true};
  let rect;
  if(selected.length===2)rect=i===0?{x:0,y:0,width:Math.round(width*mainSize),height}:
   {x:Math.round(width*mainSize),y:0,width:Math.round(width*(1-mainSize)),height};
  else rect=i===0?{x:0,y:0,width:Math.round(width*mainSize),height}:
   {x:Math.round(width*mainSize),y:Math.round((i-1)*height/2),
    width:Math.round(width*(1-mainSize)),height:Math.round(height/2)};
  return {...w,...rect,width:Math.max(260,rect.width),height:Math.max(180,rect.height),
   maximized:false,minimized:false,z:next.nextZ+i};
 })};
 const focus=selected[0]?.id??next.focus;
 return {...next,focus,nextZ:next.nextZ+selected.length};
}
/** Reject invalid or stale saved windows; preserve valid source/editor tabs. */
export function resumeWorkspace(saved:WorkspaceState,phase:'active'|'dormant',controllerIds:readonly string[]):WorkspaceState{
 const ids=new Set(controllerIds);
 const windows=saved.windows.filter(w=>w.kind!=='controller'||!!w.controllerId&&ids.has(w.controllerId));
 if(!windows.length)return phase==='active'?activeWorkspace():startupWorkspace();
 const focus=windows.some(w=>w.id===saved.focus&&!w.minimized)?saved.focus:
  windows.filter(w=>!w.minimized).sort((a,b)=>b.z-a.z)[0]?.id??null;
 return {...saved,windows,focus,nextZ:Math.max(saved.nextZ,...windows.map(w=>w.z+1))};
}
