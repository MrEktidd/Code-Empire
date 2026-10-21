import {useState} from 'react';
import type {WorldState} from '../../engine/types';
const GLYPHS:Record<string,string>={meadow:'·',forest:'♣',quarry:'◆',fallen_branches:'⌁',loose_stones:'◈',berry_bush:'✿',farm:'❋',stockpile:'⌂',water:'≈'};
// Vite bundles static imports and rewrites their URLs for GitHub Pages.
const ICONS:Record<string,string>={
 sticks:new URL('../../../assets/icons/01-materials/sticks.png',import.meta.url).href,
 stone:new URL('../../../assets/icons/01-materials/stone.png',import.meta.url).href,
 berries:new URL('../../../assets/icons/02-food/berries.png',import.meta.url).href
};
const GOALS:Record<string,number>={berries:15,sticks:18,stone:12};
export default function WorldView({world,selection,onSelect}:{world:WorldState;selection:string;onSelect:(id:string)=>void}){
 const [hover,setHover]=useState('');
 const entities=new Map<string,{id:string;name:string}[]>();
 for(const e of world.workers){const key=e.x+','+e.y;entities.set(key,[...(entities.get(key)??[]),{id:e.id,name:e.name}]);}
 return <div className="world-content ce-scroll">
  <div className="map-header"><span>THE FRONTIER · 16 × 11</span><span>DAY {1+Math.floor(world.tick/24)} · TICK {world.tick}</span></div>
  <div className="stockpile-goal"><b>{world.settlementUnlocked?'✓ SETTLEMENT UNLOCKED':'FOUNDING GOAL · STOCKPILE ALL THREE'}</b><div className="stockpile-goal-items">{Object.entries(GOALS).map(([item,target])=><div key={item}><img src={ICONS[item]} alt=""/><strong>{item}</strong><span>{world.stocks[item]??0}/{target}</span><progress value={world.stocks[item]??0} max={target}/></div>)}</div></div>
  <div className="map-grid">{world.tiles.map(t=>{const es=entities.get(t.x+','+t.y);return <button key={t.x+','+t.y} className={'tile '+t.ground+(es?' occupied':'')} title={t.ground+' · '+t.x+','+t.y} onMouseEnter={()=>setHover(t.ground+' ('+t.x+', '+t.y+') '+t.remaining+' remaining')} onClick={()=>{if(es){const i=es.findIndex(e=>e.id===selection);onSelect(es[(i+1)%es.length].id);}}}>{es?.length?<span className={'tile-entity '+(es[0].id===selection?'selected':'')}>{es[0].name[0]}</span>:GLYPHS[t.ground]}</button>;})}</div>
  <div className="map-legend">✿ BERRIES · ⌁ STICKS · ◈ SURFACE STONES · ⌂ STOCKPILE · {hover}</div>
  <p className="map-legend">Select a founder on the map to open their script and manual controls.</p>
 </div>;
}