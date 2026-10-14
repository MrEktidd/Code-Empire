import {useCallback,useEffect,useRef,useState} from 'react';
import type {ChangeEvent,ReactNode} from 'react';
import {createWorld,catchUp,worldSnapshot} from './engine/world';
import {advanceTick,runControllers} from './engine/scheduler';
import type {Campaign,Controller,ExecutionEntry,WorldState} from './engine/types';
import {starterControllers} from './defaults';
import {PythonRuntime} from './runtime/client';
import {loadCampaign,saveCampaign,deleteCampaign,downloadCampaign,validCampaign} from './storage/db';
import {loadWorkspace,saveWorkspace} from './storage/workspace';
import {newWorkspace,upsertWindow,focusWindow,updateWindow,windowTitle} from './workspace/registry';
import type {WindowKind,WindowState,WorkspaceState} from './workspace/registry';
import {WindowManager} from './workspace/WindowManager';
import PythonEditor from './components/PythonEditor';
import {API,contextApi} from './docs/api';
import {LESSONS,lessonCompleted} from './learning/lessons';
import './styles.css';
const VERSION='0.2.0';
const SPEED=[0,1100,420,140];
const GLYPHS:Record<string,string>={meadow:'·',forest:'♣',quarry:'◆',farm:'❋',stockpile:'⌂',water:'≈'};
type Screen='menu'|'game';
export default function App(){
 const [screen,setScreen]=useState<Screen>('menu');
 const [loaded,setLoaded]=useState(false);
 const [world,setWorld]=useState(createWorld);
 const [controllers,setControllers]=useState(starterControllers);
 const [lesson,setLesson]=useState(0);
 const [entries,setEntries]=useState<ExecutionEntry[]>([]);
 const [workspace,setWorkspace]=useState<WorkspaceState>(loadWorkspace);
 const [speed,setSpeed]=useState(0);
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState('System ready.');
 const [offline,setOffline]=useState(0);
 const [search,setSearch]=useState('');
 const [showHint,setShowHint]=useState(false);
 const [beginner,setBeginner]=useState(true);
 const [selection,setSelection]=useState('npc_000001');
 const [saveExists,setSaveExists]=useState(false);
 const runtime=useRef<PythonRuntime|null>(null);
 const latest=useRef({world,controllers,lesson});
 const gate=useRef(false);
 const fileInput=useRef<HTMLInputElement>(null);
 latest.current={world,controllers,lesson};
 useEffect(()=>{runtime.current=new PythonRuntime();let live=true;void loadCampaign().then(c=>{if(live)setSaveExists(validCampaign(c));}).catch(()=>{}).finally(()=>{if(live)setLoaded(true);});return()=>{live=false;runtime.current?.destroy();};},[]);
 useEffect(()=>{if(screen==='game')saveWorkspace(workspace);},[workspace,screen]);
 useEffect(()=>{if(screen!=='game')return;
  const timer=setTimeout(()=>{const s=latest.current;void saveCampaign(s.world,s.controllers,s.lesson).then(()=>setSaveExists(true)).catch(e=>setStatus('Autosave failed: '+String(e)));},650);
  return()=>clearTimeout(timer);
 },[world,controllers,lesson,screen]);
 const applyState=useCallback((w:WorldState,c:Controller[],e:ExecutionEntry[])=>{
  setWorld(w);setControllers(c);setEntries(old=>[...old,...e].slice(-130));
  setLesson(old=>Math.min(old+Number(lessonCompleted(old,w,c,e)),LESSONS.length));
 },[]);
 const execute=useCallback(async(manualId?:string)=>{
  if(gate.current||!runtime.current||screen!=='game')return;
  gate.current=true;setBusy(true);
  try{
   const {world:w,controllers:c}=latest.current;
   const result=manualId?
    await runControllers(w,c,c.filter(x=>x.id===manualId),runtime.current.execute):
    await advanceTick(w,c,runtime.current.execute);
   applyState(result.world,result.controllers,result.entries);
   if(result.entries.some(x=>!x.success))setStatus('Python error — inspect the controller Output tab.');
   else setStatus(manualId?'Script executed.':'Simulation advanced.');
  }catch(error){setStatus('Runtime issue: '+String(error));setSpeed(0);}
  finally{gate.current=false;setBusy(false);}
 },[screen,applyState]);
 useEffect(()=>{if(screen!=='game'||!speed)return;
  const timer=setInterval(()=>{void execute();},SPEED[speed]);return()=>clearInterval(timer);
 },[screen,speed,execute]);
 const newGame=async()=>{
  if(saveExists&&!window.confirm('Start a new campaign? The existing autosave will be replaced. Export your save first if needed.'))return;
  setSpeed(0);setWorld(createWorld());setControllers(starterControllers());setLesson(0);setEntries([]);
  setWorkspace(newWorkspace());setStatus('New settlement founded. Open Learn Python to begin.');
  setOffline(0);setSelection('npc_000001');setScreen('game');
 };
 const continueGame=async()=>{
  try{
   const value=await loadCampaign();
   if(!validCampaign(value)){setStatus('No valid campaign to continue.');return;}
   const result=catchUp(value.world,Date.now()-value.savedAt);
   setWorld(result.world);setControllers(value.controllers);setLesson(value.lessonIndex);
   setOffline(result.hours);setEntries([]);setStatus('Welcome back to First Light!');
   setScreen('game');
  }catch(e){setStatus('Could not load campaign: '+String(e));}
 };
 const open=(kind:WindowKind,id?:string)=>setWorkspace(s=>upsertWindow(s,kind,id));
 const editController=(id:string,change:Partial<Controller>)=>setControllers(c=>c.map(x=>x.id===id?{...x,...change}:x));
 const openEntity=(id:string)=>{
  setSelection(id);
  const c=controllers.find(x=>x.ownerEntityId===id);
  if(c)open('controller',c.id);
 };
 const beginLesson=()=>{
  const c=controllers.find(x=>x.id===LESSONS[lesson]?.controllerId);
  if(c)open('controller',c.id);
 };
 const importGame=async(event:ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
   const data:unknown=JSON.parse(await file.text());
   if(!validCampaign(data))throw new Error('Only v0.2 campaign saves are supported.');
   if(!window.confirm('Import this campaign and replace your current autosave?'))return;
   const c=data as Campaign;
   await saveCampaign(c.world,c.controllers,c.lessonIndex);
   setWorld(c.world);setControllers(c.controllers);setLesson(c.lessonIndex);setEntries([]);
   setSaveExists(true);setScreen('game');setSpeed(0);setStatus('Campaign imported.');
  }catch(error){setStatus('Import failed: '+String(error));}
  finally{event.target.value='';}
 };
 const title=(win:WindowState)=>windowTitle(win,controllers.find(c=>c.id===win.controllerId)?.filename);
 const render=(win:WindowState):ReactNode=>{
  if(win.kind==='world')return <WorldView world={world}selection={selection}onSelect={openEntity}/>;
  if(win.kind==='scripts')return <div className="window-content"><p className="eyebrow">PROJECT EXPLORER</p><p className="muted">Every programmable object gets its own controller automatically. Filenames are editable; IDs are permanent.</p>{controllers.map(c=><button key={c.id} className="file-row" onClick={()=>open('controller',c.id)}><span>⌘</span><span><b>{c.filename}</b><small>{c.ownerEntityId??'Global automation'} · {c.lastStatus}</small></span><span>↗</span></button>)}</div>;
  if(win.kind==='controller'){
   const c=controllers.find(x=>x.id===win.controllerId);
   if(!c)return <p className="muted padded">This controller is unavailable.</p>;
   const owner=[...world.workers,...world.buildings].find(x=>x.id===c.ownerEntityId);
   const recent=entries.filter(e=>e.controllerId===c.id||e.controllerId==='engine').slice(-12).reverse();
   return <div className="controller-view">
    <div className="controller-meta"><span className="eyebrow">OWNER: {owner?.name??'WORLD'} · {c.ownerEntityId??'global'}</span><span className={'status-pill '+c.lastStatus}>{c.lastStatus.toUpperCase()}</span></div>
    <nav className="controller-tabs">{(['code','docs','notes','output'] as const).map(t=><button key={t} className={win.tab===t?'selected':''} onClick={()=>setWorkspace(s=>updateWindow(s,win.id,{tab:t}))}>{t.toUpperCase()}</button>)}</nav>
    {win.tab==='code'&&<div className="code-area"><PythonEditor controller={c} onChange={source=>editController(c.id,{source})}/></div>}
    {win.tab==='docs'&&<div className="scroll-pane">{contextApi(c.ownerType).map(api=><article className="api-card" key={api.name}><code>{api.signature}</code><p>{api.description}</p><small>{api.note}</small><pre>{api.example}</pre><button onClick={()=>{editController(c.id,{source:c.source+'\n'+api.example+'\n'});setWorkspace(s=>updateWindow(s,win.id,{tab:'code'}));}}>APPEND EXAMPLE TO CODE</button></article>)}</div>}
    {win.tab==='notes'&&<div className="notes-area"><p className="muted">Private notes for this controller. Autosaved independently of execution state.</p><textarea aria-label="Script notes" value={c.notes} onChange={e=>editController(c.id,{notes:e.target.value})} placeholder="What should this script do? What can be improved?"/></div>}
    {win.tab==='output'&&<div className="scroll-pane output-pane">{c.lastError&&<div className="error-box">{c.lastError}</div>}{recent.length===0?<p className="muted">No executions yet. Press Run Script to see output.</p>:recent.map((e,i)=><div className={e.success?'log-line':'log-line error'} key={i}><span>[Tick {e.tick}] {e.success?'✓':'✕'} {e.filename}</span>{e.output.map((line,j)=><pre key={j}>{line}</pre>)}{e.error&&<pre>{e.error}</pre>}</div>)}</div>}
    <div className="controller-footer"><label><input type="checkbox" checked={c.enabled} onChange={e=>editController(c.id,{enabled:e.target.checked,nextRunTick:world.tick+1})}/> AUTO-RUN</label><label>EVERY <input aria-label="Run interval hours" type="number" min="1" max="999" value={c.intervalTicks} onChange={e=>editController(c.id,{intervalTicks:Math.max(1,Math.min(999,Number(e.target.value)||1))})}/> HOURS</label><button className="accent-btn" disabled={busy} onClick={()=>void execute(c.id)}>{busy?'EXECUTING…':'▶ RUN SCRIPT'}</button></div>
    <div className="rename-row"><label>FILE <input aria-label="Controller filename" value={c.filename} onChange={e=>{const v=e.target.value;if(v.length<=60)editController(c.id,{filename:v});}} onBlur={()=>{if(!/^[\w.-]+\.py$/.test(c.filename)||controllers.some(x=>x.id!==c.id&&x.filename===c.filename))editController(c.id,{filename:c.id+'.py'});}}/></label><span>ID {c.id}</span></div>
   </div>;
  }
  if(win.kind==='learn')return <div className="learning-pane">{lesson>=LESSONS.length?<div className="success-message"><h2>First Steps Complete!</h2><p>You have learned the basics of functions, objects, commands, simulation time, conditions, loops, and persistent memory. Experiment freely!</p></div>:<><div className="lesson-counter">FIELD ACADEMY · LESSON {lesson+1} OF {LESSONS.length}</div><div className="lesson-progress"><span style={{width:(lesson/LESSONS.length*100)+'%'}}/></div><h2>{LESSONS[lesson].title}</h2><p className="lesson-concept">{LESSONS[lesson].concept}</p><p>{LESSONS[lesson].explain}</p><h3>YOUR MISSION</h3><p className="mission">{LESSONS[lesson].goal}</p><button className="accent-btn" onClick={beginLesson}>OPEN LESSON SCRIPT ↗</button><button className="quiet-btn" onClick={()=>setShowHint(v=>!v)}>{showHint?'HIDE':'SHOW'} HINT</button>{showHint&&<div className="hint">{LESSONS[lesson].hint}<pre>{LESSONS[lesson].example}</pre><button onClick={()=>{const id=LESSONS[lesson].controllerId;editController(id,{source:LESSONS[lesson].example});open('controller',id);}}>LOAD THIS EXAMPLE</button></div>}<p className="muted">Progress is verified against real script output and game actions. Lessons are optional; you can freely experiment.</p></>}</div>;
  if(win.kind==='docs')return <div className="window-content scroll-pane"><p className="eyebrow">SEARCHABLE API REFERENCE</p><input className="doc-search" placeholder="Find methods, resources, Python topics..." value={search} onChange={e=>setSearch(e.target.value)}/>{API.filter(e=>(e.name+' '+e.description+' '+e.signature).toLowerCase().includes(search.toLowerCase())).map(e=><article className="api-card" key={e.name}><code>{e.signature}</code><p>{e.description}</p><small>{e.note} · Returns {e.returns}</small><pre>{e.example}</pre></article>)}<h3>PYTHON FOUNDATIONS</h3><p>Python's indentation defines code blocks. Use <code>def</code> to define functions, <code>if</code> to make decisions, <code>for</code> to iterate lists, and dictionaries to store named values. Start with Learn Python for interactive exercises.</p><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noreferrer">Official Python tutorial ↗</a></div>;
  if(win.kind==='console')return <div className="window-content scroll-pane console-lines">{entries.length===0?<p className="muted">Execution and errors will appear here.</p>:entries.slice().reverse().map((e,i)=><div key={i} className={e.success?'log-line':'log-line error'}><b>Tick {e.tick} · {e.filename} {e.success?'✓':'✕'}</b>{e.output.map((s,j)=><pre key={j}>{s}</pre>)}{e.error&&<pre>{e.error}</pre>}</div>)}</div>;
  if(win.kind==='overview')return <div className="window-content overview"><h2>First Light</h2><p className="muted">Settlement Age · Day {1+Math.floor(world.tick/24)}</p><div className="metrics">{Object.entries(world.stocks).map(([k,v])=><div key={k}><small>{k.toUpperCase()}</small><strong>{v}</strong></div>)}</div><h3>Citizens & production</h3><p>{world.workers.length} settlers · {world.totalHarvested} harvested resources</p><h3>Milestones</h3>{world.events.map((e,i)=><p key={i} className="muted">{e}</p>)}</div>;
  return <div className="window-content"><h2>Settings</h2><label className="setting-row"><input type="checkbox" checked={beginner} onChange={e=>setBeginner(e.target.checked)}/> Show beginner learning prompts</label><button onClick={()=>setWorkspace(newWorkspace())}>RESET WORKSPACE LAYOUT</button><p className="muted">Scripts and simulation state are saved in IndexedDB. Window layouts are saved in local browser preferences.</p></div>;
 };
 return <>
  {screen==='menu'?<div className="menu-root"><div className="menu-stars"/><div className="menu-content"><div className="logo-mark">⌘</div><div className="menu-eyebrow">A CIVILIZATION WRITTEN IN CODE</div><h1>CODE<span>EMPIRE</span></h1><p>From your first settler to the stars. Write Python, automate a living world, and learn to think like a programmer.</p><div className="menu-options"><button className="accent-btn" disabled={!loaded} onClick={()=>void newGame()}>✦ NEW EMPIRE</button><button disabled={!loaded||!saveExists} onClick={()=>void continueGame()}>▶ CONTINUE CAMPAIGN</button><button onClick={()=>fileInput.current?.click()}>⇧ IMPORT CAMPAIGN</button><a href="https://github.com/MrEktidd/Code-Empire" target="_blank" rel="noreferrer">↗ OPEN-SOURCE PROJECT</a></div><div className="menu-bottom">FOUNDATION v{VERSION} · REAL PYTHON · MIT LICENSE</div>{status!=='System ready.'&&<div className="menu-status">{status}</div>}</div></div>:
   <div className="game-shell"><header className="game-header"><button className="brand-button" onClick={()=>{setSpeed(0);setScreen('menu');}}>⌘ <b>CODE<span>EMPIRE</span></b></button><span>FIRST LIGHT <span className="divider">/</span> SETTLEMENT AGE</span><span>DAY {1+Math.floor(world.tick/24)} · {String(world.tick%24).padStart(2,'0')}:00</span><div className="clock-actions"><button className={speed===0?'active':''} onClick={()=>setSpeed(0)}>Ⅱ</button><button disabled={busy} onClick={()=>void execute()}>⏭</button>{[1,2,3].map(v=><button key={v} className={speed===v?'active':''} onClick={()=>setSpeed(v)}>{v}×</button>)}</div></header>
   <div className="game-row"><aside className="sidebar">{([['overview','◫','Overview'],['world','◇','World'],['scripts','⌘','Scripts'],['learn','✧','Learn Python'],['docs','▤','Documentation'],['console','>_','Console'],['settings','⚙','Settings']] as const).map(([kind,icon,label])=><button key={kind} title={label} aria-label={label} onClick={()=>open(kind)}><span>{icon}</span><small>{label}</small></button>)}</aside>
   <div className="desktop-area"><WindowManager state={workspace} setState={setWorkspace} title={title} render={render}/><div className="taskbar">{workspace.windows.map(w=><button key={w.id} className={workspace.focus===w.id&&!w.minimized?'focused':''} onClick={()=>setWorkspace(s=>w.minimized?focusWindow(s,w.id):updateWindow(s,w.id,{minimized:true}))}>{title(w)}</button>)}</div></div></div>
   <footer className="game-footer"><span className="footer-notice">{status}{offline>0?' · +'+offline+'h offline progress':''}</span>{beginner&&lesson<LESSONS.length&&<button className="lesson-shortcut" onClick={()=>open('learn')}>✧ Lesson {lesson+1}: {LESSONS[lesson].title}</button>}<button onClick={()=>downloadCampaign(world,controllers,lesson)}>⇩ EXPORT</button><button onClick={()=>fileInput.current?.click()}>⇧ IMPORT</button><button onClick={()=>{setSpeed(0);setScreen('menu');}}>⌂ MENU</button></footer>
   </div>}
  <input ref={fileInput} type="file" hidden accept=".json,application/json" onChange={e=>void importGame(e)}/>
 </>;
}
function WorldView({world,selection,onSelect}:{world:WorldState;selection:string;onSelect:(id:string)=>void}){
 const [hover,setHover]=useState('');
 const entities=new Map<string,{id:string;name:string;type:string}[]>();
 for(const e of [...world.workers,...world.buildings]){
  const key=e.x+','+e.y;entities.set(key,[...(entities.get(key)??[]),{id:e.id,name:e.name,type:'role'in e?'NPC':'Farm'}]);
 }
 const selected=[...world.workers,...world.buildings].find(e=>e.id===selection);
 return <div className="world-content"><div className="map-header"><span>THE FRONTIER · 16 × 11</span><span>Tick {world.tick}</span></div><div className="map-grid">{world.tiles.map(t=>{
  const es=entities.get(t.x+','+t.y);
  return <button key={t.x+','+t.y} className={'tile '+t.ground+(es?' occupied':'')} title={t.ground+' · '+t.x+','+t.y} onMouseEnter={()=>setHover(t.ground+' ('+t.x+', '+t.y+') '+(t.remaining? t.remaining+' remaining':''))} onClick={()=>es&&onSelect(es[0].id)}>{es?.length?<span className={'tile-entity '+(es[0].id===selection?'selected':'')}>{es[0].name[0]}</span>:GLYPHS[t.ground]}</button>;
 })}</div><div className="map-legend">♣ FOREST · ◆ QUARRY · ⌂ STORAGE · ❋ FARM · ● SETTLER</div><div className="inspector"><div><b>{selected?.name??'Select a programmable object'}</b><span>{selected?.id??hover} · {'role'in (selected??{})?(selected as WorldState['workers'][number]).role:(selected?'Farm':'')}</span></div>{selected&&<button className="accent-btn" onClick={()=>onSelect(selected.id)}>⌘ OPEN CONTROLLER</button>}</div><div className="world-stocks">{Object.entries(world.stocks).map(([key,value])=><div key={key}><small>{key.toUpperCase()}</small><b>{value}</b></div>)}</div></div>;
}
