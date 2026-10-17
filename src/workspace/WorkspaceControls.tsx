import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import type {WorkspaceArrangement,WorkspaceBounds,WorkspacePreset} from './registry';
import './workbench.css';
export default function WorkspaceControls({onArrange,onPreset}:{
 onArrange:(mode:WorkspaceArrangement,bounds:WorkspaceBounds)=>void;
 onPreset:(preset:WorkspacePreset,bounds:WorkspaceBounds)=>void;
}){
 const [open,setOpen]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 const menuRef=useRef<HTMLDivElement>(null);
 const [position,setPosition]=useState<{left:number;bottom:number}>({left:8,bottom:45});
 useEffect(()=>{
  if(!open)return;
  const dismiss=(e:PointerEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node)&&!menuRef.current?.contains(e.target as Node))setOpen(false);};
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};
  document.addEventListener('pointerdown',dismiss);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape);};
 },[open]);
 const bounds=():WorkspaceBounds=>{
  const el=document.querySelector('.desktop-root');
  return {width:el?.clientWidth??window.innerWidth-74,height:el?.clientHeight??window.innerHeight-144};
 };
 return <div className="workspace-controls" ref={ref}>
  <button className="workspace-menu-trigger" aria-label="Arrange workspace" aria-expanded={open}
   onClick={()=>{
    if(!open&&ref.current){
     const box=ref.current.getBoundingClientRect();
     setPosition({left:Math.min(box.left,Math.max(8,window.innerWidth-235)),bottom:window.innerHeight-box.top+6});
    }
    setOpen(value=>!value);
   }} title="Arrange desktop windows">▦ Layout</button>
  {open&&createPortal(<div ref={menuRef} className="workspace-menu" role="menu" aria-label="Workspace layouts"
   style={{position:'fixed',left:position.left,bottom:position.bottom,zIndex:4001}}>
   <span className="workspace-menu-label">ARRANGE WINDOWS</span>
   {(['tile','cascade'] as const).map(id=><button role="menuitem" key={id} onClick={()=>{onArrange(id,bounds());setOpen(false);}}>
    {id==='tile'?'⊞ Tile windows':'▤ Cascade windows'}</button>)}
   <span className="workspace-menu-label">WORKSPACE PRESETS</span>
   {(['programming','management','research'] as const).map(id=><button role="menuitem" key={id} onClick={()=>{onPreset(id,bounds());setOpen(false);}}>
    {id==='programming'?'⌘ Programming':id==='management'?'◫ Management':'▤ Research'} workspace</button>)}
   <p>Presets minimize unused windows; your scripts, tabs, and documents remain open.</p>
  </div>,document.body)}
 </div>;
}
