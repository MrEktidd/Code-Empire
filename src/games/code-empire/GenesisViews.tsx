import type {WorldState} from '../../engine/types';
type Props={world:WorldState;openGenesis:()=>void;openEntity:(id:string)=>void};
export function GenesisArchive({world,openGenesis,openEntity}:Props){
 return <div className="window-content genesis-archive">
  <p className="eyebrow">CIVILIZATION INITIATIVE · HISTORICAL RECORDS</p><h2>Genesis Archive</h2>
  <p className="muted">The identities of your first inhabitants are preserved here. Your personally named characters have permanent IDs, independent scripts and their own place in civilization's history.</p>
  {world.genesisArchive.length===0?<div className="genesis-mission"><h3>No inhabitants recorded</h3><p>Complete the Genesis Protocol to establish your first named inhabitants.</p><button className="accent-btn" onClick={openGenesis}>OPEN GENESIS.PY ↗</button></div>:
  <div className="founder-list">{world.genesisArchive.map((f,i)=><button key={f.id} className="founder-card" onClick={()=>openEntity(f.id)}>
   <span className="founder-index">{String(i+1).padStart(2,'0')}</span><span><strong>{f.name}</strong><small>{f.sex} · Original founder · Day {1+Math.floor(f.createdTick/24)}</small></span><span>↗</span>
  </button>)}</div>}
 </div>;
}
export function GenesisOverview({world,openGenesis,openEntity,openArchive}:Props&{openArchive:()=>void}){
 return <div className="window-content overview genesis-overview">
  <p className="eyebrow">CIVILIZATION INITIATIVE · SIMULATION STATUS</p>
  <h2>{world.phase==='active'?'First Light':'Awaiting Initialization'}</h2>
  <p className="muted">Settlement Age · Day {1+Math.floor(world.tick/24)}</p>
  <div className="metrics"><div><small>POPULATION</small><strong>{world.workers.length}</strong></div><div><small>HOUSING</small><strong>{world.workers.length} / {world.housingCapacity}</strong></div>{Object.entries(world.stocks).map(([key,value])=><div key={key}><small>{key.toUpperCase()}</small><strong>{value}</strong></div>)}</div>
  {world.genesisArchive.length===0?<section className="genesis-mission">
   <p className="eyebrow">YOUR FIRST CHALLENGE</p><h3>The Genesis Protocol</h3>
   <p>Your environment is ready, but no civilization exists yet. Open <code>genesis.py</code>, customize the names Adam and Eve, and add a third founder dictionary to the list.</p>
   <p>The three founders are created together after the code passes validation. The initial housing limit is three.</p>
   <button className="accent-btn" onClick={openGenesis}>OPEN GENESIS.PY ↗</button>
  </section>:<section className="genesis-mission">
   <p className="eyebrow">GENESIS COMPLETE</p><h3>Founding Characters</h3>
   <div className="founder-list">{world.genesisArchive.map(f=><button key={f.id} className="founder-card" onClick={()=>openEntity(f.id)}>
    <span className="founder-index">◉</span><span><strong>{f.name}</strong><small>{f.sex} · Personal controller available</small></span><span>↗</span>
   </button>)}</div>
   <p className="muted">Your housing is full. Future population expansion will require infrastructure; your named founders remain individually programmable.</p>
   <button className="inspector-action" onClick={openArchive}>OPEN GENESIS ARCHIVE ↗</button>
  </section>}
  <h3>Simulation history</h3>{world.events.map((event,i)=><p className="muted" key={i}>{event}</p>)}
 </div>;
}