import type {Dispatch,ReactNode,SetStateAction} from 'react';
import type {Controller,ExecutionEntry,WorldState} from '../engine/types';
import type {WindowKind,WindowState,WorkspaceState} from '../workspace/registry';
import {newWorkspace,updateWindow} from '../workspace/registry';
import PythonEditor from '../platform/editor/PythonEditor';
import '../platform/editor/editor.css';
import DocumentationBrowser from '../platform/documentation/DocumentationBrowser';
import {PYTHON_TOPICS} from '../content/python/topics';
import {GAME_DOCUMENTS} from './code-empire/docs';
import type {DocScope} from '../platform/documentation/types';
import {contextApi} from '../docs/api';
import {LESSONS} from '../learning/lessons';
import WorldView from './code-empire/WorldView';
const LESSON_REFERENCE=['printing','variables','functions','if-elif','if-elif','for-loops','dicts','while-loops'];
export type WindowContext={
 world:WorldState;controllers:Controller[];entries:ExecutionEntry[];selection:string;lesson:number;
 showHint:boolean;beginner:boolean;busy:boolean;
 setShowHint:Dispatch<SetStateAction<boolean>>;setBeginner:Dispatch<SetStateAction<boolean>>;
 setWorkspace:Dispatch<SetStateAction<WorkspaceState>>;
 editController:(id:string,change:Partial<Controller>)=>void;
 execute:(id?:string)=>Promise<void>;open:(kind:WindowKind,id?:string)=>void;
 openEntity:(id:string)=>void;beginLesson:()=>void;checkpointController:(id:string)=>void;openDoc:(scope:DocScope,id:string,popout?:boolean)=>void;
};
 export function renderGameWindow(win:WindowState,ctx:WindowContext):ReactNode{
 const {world,controllers,entries,selection,lesson,showHint,setShowHint,beginner,busy,editController,execute,open,openEntity,setWorkspace,setBeginner,openDoc,beginLesson,checkpointController}=ctx;
  if(win.kind==='world')return <WorldView world={world}selection={selection}onSelect={openEntity}/>;
  if(win.kind==='scripts')return <div className="window-content"><p className="eyebrow">PROJECT EXPLORER</p><p className="muted">Every programmable object gets its own controller automatically. Filenames are editable; IDs are permanent.</p>{controllers.map(c=><button key={c.id} className="file-row" onClick={()=>open('controller',c.id)}><span>⌘</span><span><b>{c.filename}</b><small>{c.ownerEntityId??'Global automation'} · {c.lastStatus}</small></span><span>↗</span></button>)}</div>;
  if(win.kind==='controller'){
   const c=controllers.find(x=>x.id===win.controllerId);
   if(!c)return <p className="muted padded">This controller is unavailable.</p>;
   const owner=[...world.workers,...world.buildings].find(x=>x.id===c.ownerEntityId);
   const recent=entries.filter(e=>e.controllerId===c.id).slice(-12).reverse();
   return <div className="controller-view">
    <div className="controller-meta"><span className="eyebrow">OWNER: {owner?.name??'WORLD'} · {c.ownerEntityId??'global'}</span><span className={'status-pill '+c.lastStatus}>{c.lastStatus.toUpperCase()}</span></div>
    <nav className="controller-tabs">{(['code','docs','notes','output','history'] as const).map(t=><button key={t} className={win.tab===t?'selected':''} onClick={()=>setWorkspace(s=>updateWindow(s,win.id,{tab:t}))}>{t.toUpperCase()}</button>)}</nav>
    {win.tab==='code'&&<div className="code-area"><PythonEditor id={c.id} source={c.source} error={c.lastError} completions={contextApi(c.ownerType).map(a=>({label:a.name,type:'method',detail:a.signature,info:a.description}))} onChange={source=>editController(c.id,{source})} onRun={()=>{checkpointController(c.id);void execute(c.id);}}/></div>}
    {win.tab==='docs'&&<div className="scroll-pane">{contextApi(c.ownerType).map(api=><article className="api-card" key={api.name}><code>{api.signature}</code><p>{api.description}</p><small>{api.note}</small><pre>{api.example}</pre><button onClick={()=>{checkpointController(c.id);editController(c.id,{source:c.source+'\n'+api.example+'\n'});setWorkspace(s=>updateWindow(s,win.id,{tab:'code'}));}}>APPEND EXAMPLE TO CODE</button></article>)}</div>}
    {win.tab==='notes'&&<div className="notes-area"><p className="muted">Private notes for this controller. Autosaved independently of execution state.</p><textarea aria-label="Script notes" value={c.notes} onChange={e=>editController(c.id,{notes:e.target.value})} placeholder="What should this script do? What can be improved?"/></div>}
    {win.tab==='output'&&<div className="scroll-pane output-pane">{c.lastError&&<div className="error-box">{c.lastError}</div>}{recent.length===0?<p className="muted">No executions yet. Press Run Script to see output.</p>:recent.map((e,i)=><div className={e.success?'log-line':'log-line error'} key={i}><span>[Tick {e.tick}] {e.success?'✓':'✕'} {e.filename}</span>{e.output.map((line,j)=><pre key={j}>{line}</pre>)}{e.error&&<pre>{e.error}</pre>}</div>)}</div>}
    {win.tab==='history'&&<div className="scroll-pane"><p className="muted">Saved source checkpoints. Each successful Run Script creates a checkpoint if your code changed.</p>{(c.checkpoints??[]).slice().reverse().map((h,i)=><article className="api-card" key={i}><strong>{new Date(h.savedAt).toLocaleString()}</strong><pre>{h.source.slice(0,1200)}</pre><button onClick={()=>{checkpointController(c.id);editController(c.id,{source:h.source});setWorkspace(s=>updateWindow(s,win.id,{tab:'code'}));}}>RESTORE THIS REVISION</button></article>)}{!c.checkpoints?.length&&<p>No checkpoints yet. Run a script to create one.</p>}</div>}
    <div className="controller-footer"><label><input type="checkbox" checked={c.enabled} onChange={e=>editController(c.id,{enabled:e.target.checked,nextRunTick:world.tick+1})}/> AUTO-RUN</label><label>EVERY <input aria-label="Run interval hours" type="number" min="1" max="999" value={c.intervalTicks} onChange={e=>editController(c.id,{intervalTicks:Math.max(1,Math.min(999,Number(e.target.value)||1))})}/> HOURS</label><button className="accent-btn" disabled={busy} onClick={()=>{checkpointController(c.id);void execute(c.id);}}>{busy?'EXECUTING…':'▶ RUN SCRIPT'}</button></div>
    <div className="rename-row"><label>FILE <input aria-label="Controller filename" value={c.filename} onChange={e=>{const v=e.target.value;if(v.length<=60)editController(c.id,{filename:v});}} onBlur={()=>{if(!/^[\w.-]+\.py$/.test(c.filename)||controllers.some(x=>x.id!==c.id&&x.filename===c.filename))editController(c.id,{filename:c.id+'.py'});}}/></label><span>ID {c.id}</span></div>
   </div>;
  }
  if(win.kind==='learn')return <div className="learning-pane">{lesson>=LESSONS.length?<div className="success-message"><h2>First Steps Complete!</h2><p>You have learned the basics of functions, objects, commands, simulation time, conditions, loops, and persistent memory. Experiment freely!</p></div>:<><div className="lesson-counter">FIELD ACADEMY · LESSON {lesson+1} OF {LESSONS.length}</div><div className="lesson-progress"><span style={{width:(lesson/LESSONS.length*100)+'%'}}/></div><h2>{LESSONS[lesson].title}</h2><p className="lesson-concept">{LESSONS[lesson].concept}</p><p>{LESSONS[lesson].explain}</p><h3>YOUR MISSION</h3><p className="mission">{LESSONS[lesson].goal}</p><button className="accent-btn" onClick={beginLesson}>OPEN LESSON SCRIPT ↗</button><button className="quiet-btn" onClick={()=>{openDoc('python',LESSON_REFERENCE[lesson]??'python-start');}}>READ RELATED PYTHON DOCS ↗</button><button className="quiet-btn" onClick={()=>setShowHint(v=>!v)}>{showHint?'HIDE':'SHOW'} HINT</button>{showHint&&<div className="hint">{LESSONS[lesson].hint}<pre>{LESSONS[lesson].example}</pre><button onClick={()=>{const id=LESSONS[lesson].controllerId;editController(id,{source:LESSONS[lesson].example});open('controller',id);}}>LOAD THIS EXAMPLE</button></div>}<p className="muted">Progress is verified against real script output and game actions. Lessons are optional; you can freely experiment.</p></>}</div>;
  if(win.kind==='python'||win.kind==='docs'||win.kind==='document'){
  const scope=win.kind==='docs'?'game':win.kind==='python'?'python':win.docScope??'python';
  const articles=scope==='python'?PYTHON_TOPICS:GAME_DOCUMENTS;
  const fallback=scope==='python'?'python:python-start':'game:print';
  return <DocumentationBrowser scope={scope} articles={articles} tabs={win.docTabs??[fallback]}
   activeDoc={win.activeDoc??fallback}
   onChange={(tabs,activeDoc)=>setWorkspace(s=>updateWindow(s,win.id,{docTabs:tabs,activeDoc}))}
   onPopout={(s,id)=>openDoc(s,id,true)}
   onCrossLink={(s,id)=>openDoc(s,id)}/>;
 }
    if(win.kind==='console')return <div className="window-content scroll-pane console-lines">{entries.length===0?<p className="muted">Execution and errors will appear here.</p>:entries.slice().reverse().map((e,i)=><div key={i} className={e.success?'log-line':'log-line error'}><b>Tick {e.tick} · {e.filename} {e.success?'✓':'✕'}</b>{e.output.map((s,j)=><pre key={j}>{s}</pre>)}{e.error&&<pre>{e.error}</pre>}</div>)}</div>;
  if(win.kind==='overview')return <div className="window-content overview"><h2>First Light</h2><p className="muted">Settlement Age · Day {1+Math.floor(world.tick/24)}</p><div className="metrics">{Object.entries(world.stocks).map(([k,v])=><div key={k}><small>{k.toUpperCase()}</small><strong>{v}</strong></div>)}</div><h3>Citizens & production</h3><p>{world.workers.length} settlers · {world.totalHarvested} harvested resources</p><h3>Milestones</h3>{world.events.map((e,i)=><p key={i} className="muted">{e}</p>)}</div>;
  return <div className="window-content"><h2>Settings</h2><label className="setting-row"><input type="checkbox" checked={beginner} onChange={e=>setBeginner(e.target.checked)}/> Show beginner learning prompts</label><button onClick={()=>setWorkspace(newWorkspace())}>RESET WORKSPACE LAYOUT</button><p className="muted">Scripts and simulation state are saved in IndexedDB. Window layouts are saved in local browser preferences.</p></div>;
 };
