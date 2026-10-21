import {useState} from 'react';
import type {WorldState,ScriptCommand} from '../../engine/types';
export default function SettlementView({world,onCommand}:{world:WorldState;onCommand:(command:ScriptCommand)=>void}){
 const [name,setName]=useState('');const [sex,setSex]=useState<'male'|'female'>('female');
 return <div className="window-content ce-scroll settlement-view"><p className="eyebrow">SETTLEMENT · FIRST LIGHT</p><h2>From Camp to Community</h2>
 <p>Use your shared stockpile to build a humble lean-to. The first shelter adds room for two settlers.</p>
 <section className="settlement-card"><h3>Stick Lean-to</h3><p>Cost: 12 sticks · 6 stones</p><p>Built: {world.leanToCount} / 1</p><button className="accent-btn" disabled={world.leanToCount>0||world.stocks.sticks<12||world.stocks.stone<6} onClick={()=>onCommand({action:'build_shelter'})}>{world.leanToCount?'CONSTRUCTED':'BUILD LEAN-TO'}</button></section>
 <section className="settlement-card"><h3>Recruit settlers</h3><p>Population: {world.workers.length}/{world.housingCapacity}</p><p>New recruits begin with an individual script attached and no tools.</p>
 <label>Name <input value={name} maxLength={32} onChange={e=>setName(e.target.value)}/></label>
 <label>Sex <select value={sex} onChange={e=>setSex(e.target.value as 'male'|'female')}><option value="female">Female</option><option value="male">Male</option></select></label>
 <button className="accent-btn" disabled={!world.leanToCount||world.workers.length>=world.housingCapacity||!name.trim()} onClick={()=>{onCommand({action:'recruit_worker',name:name.trim(),sex});setName('');}}>RECRUIT WORKER</button></section>
 </div>;
}