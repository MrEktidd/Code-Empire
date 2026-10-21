import {useState} from 'react';
import type {WorldState} from '../../engine/types';
const GLYPHS:Record<string,string>={meadow:'·',forest:'♣',quarry:'◆',fallen_branches:'⌁',loose_stones:'◈',berry_bush:'✿',farm:'❋',stockpile:'⌂',water:'≈'};
const ICONS:Record<string,string>={sticks:'01-materials/sticks.png',stone:'01-materials/stone.png',berries:'02-food/berries.png',wood:'01-materials/logs.png'};
const GOALS:Record<string,number>={berries:15,sticks:18,stone:12};
export default function WorldView({world,selection,onSelect,onAction}:{world:WorldState;selection:string;onSelect:(id:string)=>void;onAction:(id:string,kind:'move'|'harvest'|'deposit',direction?:string)=>void}){
 const [hover,setHover]=useState('');
 const entities=new Map<string,{id:string;name:string}[]>();
 for(const e of world.workers){const key=e.x+','+e.y;entities.set(key,[...(entities.get(key)??[]),{id:e.id,name:e.name}]);}
 const selected=world.workers.find(e=>e.id===selection);
 return <div className="world-content ce-scroll">
  <div className="map-header"><span>THE FRONTIER · 16 × 11</span><span>DAY {1+Math.floor(world.tick/24)} · TICK {world.tick}</span></div>
  <div className="stockpile-goal"><b>{world.settlementUnlocked?'✓ SETTLEMENT UNLOCKED':'FOUNDING GOAL · STOCKPILE ALL THREE'}</b><div className="stockpile-goal-items">{Object.entries(GOALS).map(([item,target])=><div key={item}><img src={'/Code-Empire/'+'assets/icons/'+ICONS[item]} alt=""/><strong>{item}</strong><span>{world.stocks[item]??0}/{target}</span><progress value={world.stocks[item]??0} max={target}/></div>)}</div></div>
  <div className="map-grid">{world.tiles.map(t=>{const es=entities.get(t.x+','+t.y);return <button key={t.x+','+t.y} className={'tile '+t.ground+(es?' occupied':'')} title={t.ground+' · '+t.x+','+t.y} onMouseEnter={()=>setHover(t.ground+' ('+t.x+', '+t.y+') '+t.remaining+' remaining')} onClick={()=>{if(es){const i=es.findIndex(e=>e.id===selection);onSelect(es[(i+1)%es.length].id);}}}>{es?.length?<span className={'tile-entity '+(es[0].id===selection?'selected':'')}>{es[0].name[0]}</span>:GLYPHS[t.ground]}</button>;})}</div>
  <div className="map-legend">✿ BERRIES · ⌁ STICKS · ◈ SURFACE STONES · ⌂ STOCKPILE · {hover}</div>
  <div className="worker-controls"><div className="worker-picker">{world.workers.map(w=><button key={w.id} className={selected?.id===w.id?'active':''} onClick={()=>onSelect(w.id)}>{w.name} · {w.hunger}% fed</button>)}</div>
   {selected?<><div className="worker-control-info"><b>{selected.name}</b> · ({selected.x},{selected.y}) · Carrying {selected.carried}/{selected.capacity} {selected.carrying??''} <button className="accent-btn" onClick={()=>onSelect(selected.id)}>OPEN SCRIPT ↗</button></div>
    <div className="manual-pad"><div/><button onClick={()=>onAction(selected.id,'move','north')} title='self.move("north")'>↑</button><div/><button onClick={()=>onAction(selected.id,'move','west')} title='self.move("west")'>←</button><button onClick={()=>onAction(selected.id,'harvest')} title='self.harvest()'>HARVEST</button><button onClick={()=>onAction(selected.id,'move','east')} title='self.move("east")'>→</button><div/><button onClick={()=>onAction(selected.id,'move','south')} title='self.move("south")'>↓</button><div/></div>
    <button className="accent-btn" onClick={()=>onAction(selected.id,'deposit')} title='self.deposit("stockpile_001")'>DEPOSIT AT CAMP</button></>:<p>Select a founder on the grid or above to give a manual command.</p>}
  </div>
 </div>;
}