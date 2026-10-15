import {useState} from 'react';
import type {WorldState} from '../../engine/types';
const GLYPHS:Record<string,string>={meadow:'·',forest:'♣',quarry:'◆',farm:'❋',stockpile:'⌂',water:'≈'};
export default function WorldView({world,selection,onSelect}:{world:WorldState;selection:string;onSelect:(id:string)=>void}){
 const [hover,setHover]=useState('');
 const entities=new Map<string,{id:string;name:string;type:string}[]>();
 for(const e of [...world.workers,...world.buildings]){
  const key=e.x+','+e.y;entities.set(key,[...(entities.get(key)??[]),{id:e.id,name:e.name,type:'role'in e?'NPC':'Farm'}]);
 }
 const selected=[...world.workers,...world.buildings].find(e=>e.id===selection);
 return <div className="world-content"><div className="map-header"><span>THE FRONTIER · 16 × 11</span><span>Tick {world.tick}</span></div><div className="map-grid">{world.tiles.map(t=>{
  const es=entities.get(t.x+','+t.y);
  return <button key={t.x+','+t.y} className={'tile '+t.ground+(es?' occupied':'')} title={t.ground+' · '+t.x+','+t.y} onMouseEnter={()=>setHover(t.ground+' ('+t.x+', '+t.y+') '+(t.remaining? t.remaining+' remaining':''))} onClick={()=>{if(es){const index=es.findIndex(e=>e.id===selection);onSelect(es[(index+1)%es.length].id);}}}>{es?.length?<span className={'tile-entity '+(es[0].id===selection?'selected':'')}>{es[0].name[0]}</span>:GLYPHS[t.ground]}</button>;
 })}</div><div className="map-legend">♣ FOREST · ◆ QUARRY · ⌂ STORAGE · ❋ FARM · ● SETTLER</div><div className="inspector"><div><b>{selected?.name??'Select a programmable object'}</b><span>{selected?.id??hover} · {'role'in (selected??{})?(selected as WorldState['workers'][number]).role:(selected?'Farm':'')}</span></div>{selected&&<button className="accent-btn" onClick={()=>onSelect(selected.id)}>⌘ OPEN CONTROLLER</button>}</div><div className="world-stocks">{Object.entries(world.stocks).map(([key,value])=><div key={key}><small>{key.toUpperCase()}</small><b>{value}</b></div>)}</div></div>;
}
