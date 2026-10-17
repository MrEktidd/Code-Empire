import {useEffect,useMemo,useRef,useState} from 'react';
import type {Controller,WorldState} from '../engine/types';
import type {WindowKind,WorkspaceState} from './registry';
import './workbench.css';
type Action={id:string;label:string;category:string;hint:string;perform:()=>void};
export default function CommandPalette({controllers,world,workspace,onClose,openWindow,openController,openEntity,focusExisting,openDocs,run}:{
 controllers:Controller[];world:WorldState;workspace:WorkspaceState;onClose:()=>void;
 openWindow:(kind:WindowKind)=>void;openController:(id:string)=>void;
 openEntity:(id:string)=>void;focusExisting:(id:string)=>void;openDocs:()=>void;run:()=>void;
}){
 const [query,setQuery]=useState('');
 const [current,setCurrent]=useState(0);
 const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{input.current?.focus();},[]);
 const actions=useMemo(()=>{
  const items:Action[]=[
   {id:'run',label:'Run / Advance Simulation',category:'Actions',hint:'Execute current simulation step',perform:run},
   {id:'docs',label:'Python Reference',category:'Documentation',hint:'Open language help',perform:openDocs},
   ...([
    ['overview','Colony Overview'],['world','World View'],['scripts','Script Explorer'],
    ['learn','Learn Python'],['docs','Game API'],['console','Runtime Console'],
    ['archive','Genesis Archive'],['settings','Settings']
   ] as [WindowKind,string][]).map(([kind,label])=>({
    id:'window:'+kind,label,category:'Windows',hint:'Open or focus window',perform:()=>openWindow(kind)
   })),
   ...controllers.map(c=>({id:'controller:'+c.id,label:c.filename,category:'Python Controllers',
    hint:c.ownerEntityId??'Global script',perform:()=>openController(c.id)})),
   ...world.workers.map(w=>({id:'entity:'+w.id,label:w.name,category:'Characters',
    hint:w.id,perform:()=>openEntity(w.id)})),
   ...workspace.windows.filter(w=>w.kind==='document').map(w=>({
    id:'existing:'+w.id,label:w.docId??w.id,category:'Open Documents',hint:'Switch to document',
    perform:()=>focusExisting(w.id)
   }))
  ];
  return items;
 },[controllers,world.workers,workspace.windows,openWindow,openController,openEntity,focusExisting,openDocs,run]);
 const shown=actions.filter(a=>!query.trim()||[a.label,a.category,a.hint].join(' ').toLowerCase().includes(query.toLowerCase())).slice(0,12);
 const select=(a:Action)=>{a.perform();onClose();};
 return <div className="command-palette-backdrop" onPointerDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <div className="command-palette" role="dialog" aria-label="Quick Open" aria-modal="true">
   <div className="palette-input"><span>⌘</span>
    <input ref={input} aria-label="Search commands, scripts and windows" value={query}
     placeholder="Search scripts, characters, windows, actions..."
     onChange={e=>{setQuery(e.target.value);setCurrent(0);}}
     onKeyDown={e=>{
      if(e.key==='Escape'){e.preventDefault();onClose();}
      if(e.key==='ArrowDown'){e.preventDefault();setCurrent(n=>Math.min(Math.max(shown.length-1,0),n+1));}
      if(e.key==='ArrowUp'){e.preventDefault();setCurrent(n=>Math.max(0,n-1));}
      if(e.key==='Enter'&&shown[current]){e.preventDefault();select(shown[current]);}
     }}/>
    <kbd>ESC</kbd>
   </div>
   <div className="palette-results ce-scroll">
    {shown.length===0?<p className="muted">No commands match. Try a script filename or window name.</p>:
     shown.map((action,index)=><button key={action.id} className={index===current?'selected':''}
      onMouseEnter={()=>setCurrent(index)} onClick={()=>select(action)}>
       <span><strong>{action.label}</strong><small>{action.hint}</small></span>
       <em>{action.category}</em>
     </button>)}
   </div>
   <div className="palette-footer">↑ ↓ NAVIGATE &nbsp; • &nbsp; ENTER OPEN &nbsp; • &nbsp; CTRL / ⌘ + K TO TOGGLE</div>
  </div>
 </div>;
}
