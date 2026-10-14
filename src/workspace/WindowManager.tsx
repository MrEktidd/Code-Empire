import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { WindowState, WorkspaceState } from './registry';
import { closeWindow, focusWindow, updateWindow } from './registry';
type Props={state:WorkspaceState;setState:(updater:(v:WorkspaceState)=>WorkspaceState)=>void;render:(w:WindowState)=>ReactNode;title:(w:WindowState)=>string};
export function WindowManager({state,setState,render,title}:Props){
 const [small,setSmall]=useState(()=>window.matchMedia('(max-width: 760px)').matches);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const q=window.matchMedia('(max-width: 760px)');const change=()=>setSmall(q.matches);q.addEventListener('change',change);return()=>q.removeEventListener('change',change);},[]);
 const move=(e:React.PointerEvent<HTMLDivElement>,w:WindowState,resize:boolean)=>{
  if(small||w.maximized||e.button!==0)return;
  e.preventDefault();e.stopPropagation();
  const target=e.currentTarget;
  target.setPointerCapture(e.pointerId);
  const sx=e.clientX,sy=e.clientY,start={x:w.x,y:w.y,width:w.width,height:w.height};
  const onMove=(ev:PointerEvent)=>{
   const dx=ev.clientX-sx,dy=ev.clientY-sy;
   const bounds=root.current;
   if(!bounds)return;
   const maxW=bounds.clientWidth,maxH=bounds.clientHeight;
   setState(old=>updateWindow(old,w.id,resize?
    {width:Math.max(300,Math.min(maxW-start.x,start.width+dx)),height:Math.max(235,Math.min(maxH-start.y,start.height+dy))}:
    {x:Math.max(0,Math.min(maxW-start.width,start.x+dx)),y:Math.max(0,Math.min(maxH-100,start.y+dy))}));
  };
  const finish=()=>{target.removeEventListener('pointermove',onMove);target.removeEventListener('pointerup',finish);target.removeEventListener('pointercancel',finish);};
  target.addEventListener('pointermove',onMove);target.addEventListener('pointerup',finish);target.addEventListener('pointercancel',finish);
 };
 const visible=state.windows.filter(w=>!w.minimized);
 const selected=visible.find(w=>w.id===state.focus)??visible.slice().sort((a,b)=>b.z-a.z)[0];
 return <div className="desktop-root" ref={root}>
  {visible.map(w=><section aria-label={title(w)} key={w.id}
    className={'desktop-window '+(w.maximized?'window-max ':'')+((small&&selected?.id!==w.id)?'mobile-hidden ':'')}
    style={small?undefined:{left:w.x,top:w.y,width:w.width,height:w.height,zIndex:w.z} as CSSProperties}
    onPointerDown={()=>setState(s=>s.focus===w.id?s:focusWindow(s,w.id))}>
    <div className="window-titlebar" onPointerDown={e=>move(e,w,false)}>
      <span className="window-heading"><span className="window-dot"/> {title(w)}</span>
      <span className="window-actions">
        <button title="Minimize" aria-label={'Minimize '+title(w)} onPointerDown={e=>e.stopPropagation()} onClick={()=>setState(s=>updateWindow(s,w.id,{minimized:true}))}>─</button>
        {!small&&<button title="Maximize or restore" aria-label="Maximize" onPointerDown={e=>e.stopPropagation()} onClick={()=>setState(s=>updateWindow(s,w.id,{maximized:!w.maximized}))}>□</button>}
        <button title="Close window" aria-label={'Close '+title(w)} onPointerDown={e=>e.stopPropagation()} onClick={()=>setState(s=>closeWindow(s,w.id))}>×</button>
      </span>
    </div>
    <div className="window-body">{render(w)}</div>
    {!small&&!w.maximized&&<div className="resize-grip" title="Drag to resize" onPointerDown={e=>move(e,w,true)}>◢</div>}
  </section>)}
 </div>;
}
