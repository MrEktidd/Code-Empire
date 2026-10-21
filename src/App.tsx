import {useCallback,useEffect,useRef,useState} from 'react';
import type {ChangeEvent} from 'react';
import MainMenu from './app/MainMenu';
import {applyTheme,persistTheme,themeDefaults} from './theme/themeState';
import {saveUiScale} from './theme/uiPreferences';
import {renderGameWindow} from './games/WindowContent';
import WorldView from './games/code-empire/WorldView';
import SettlementView from './games/code-empire/SettlementView';
import {createPendingWorld,catchUp} from './engine/world';
import {applyCommands} from './engine/commands/registry';
import {startPhysicalAction} from './engine/automation';
import {CODE_EMPIRE_PYTHON_BRIDGE} from './games/code-empire/pythonBridge';
import {SaveCoordinator} from './platform/persistence/SaveCoordinator';
import {mergeRuntimeControllers} from './platform/controllers/mergeRuntime';
import {popoutDocument} from './workspace/registry';
import type {DocScope} from './platform/documentation/types';
import {findDoc} from './platform/documentation/types';
import {PYTHON_TOPICS} from './content/python/topics';
import {GAME_DOCUMENTS} from './games/code-empire/docs';
import {advanceTick,runControllers} from './engine/scheduler';
import {ContinuousScheduler} from './engine/continuousScheduler';
import type {Campaign,Controller,ExecutionEntry,WorldState,ScriptCommand} from './engine/types';
import {initialControllers,ensureGenesisController,ensureFounderControllers} from './defaults';
import {PythonRuntime} from './platform/python/PythonRuntime';
import {loadCampaign,saveCampaign,downloadCampaign,validCampaign,migrateCampaign} from './storage/db';
import {loadWorkspace,saveWorkspace,hasSavedWorkspace} from './storage/workspace';
import {startupWorkspace,activeWorkspace,upsertWindow,focusWindow,updateWindow,windowTitle,arrangeWorkspace,applyWorkspacePreset,resumeWorkspace} from './workspace/registry';
import type {WindowKind,WindowState,WorkspaceState} from './workspace/registry';
import {WindowManager} from './workspace/WindowManager';
import WorkspaceControls from './workspace/WorkspaceControls';
import CommandPalette from './workspace/CommandPalette';
import NotificationCenter from './workspace/NotificationCenter';
import type {WorkbenchNotice} from './workspace/NotificationCenter';
import {LESSONS,lessonCompleted} from './learning/lessons';
import './styles.css';
const SPEED=[0,1100,420,140];
type Screen='menu'|'terminal'|'game';
const BOOT_MESSAGES=[
 'Validating reality constraints...',
 'Calculating continental drift...',
 'Generating terrain elevation and drainage...',
 'Establishing atmospheric composition...',
 'Seeding natural resources: timber, limestone, copper, iron, fresh water...',
 'Distributing biological potential...',
 'Reticulating splines...',
 'Allocating initial housing capacity: 3...',
 'Preparing civilization telemetry...',
 'Simulation online.'
];
export default function App(){
 const [screen,setScreen]=useState<Screen>('menu');
 const [bootInput,setBootInput]=useState('');
 const [bootError,setBootError]=useState('');
 const [loadingStep,setLoadingStep]=useState(-1);
 const [loaded,setLoaded]=useState(false);
 const [world,setWorld]=useState(createPendingWorld);
 const [controllers,setControllers]=useState(initialControllers);
 const [lesson,setLesson]=useState(0);
 const [entries,setEntries]=useState<ExecutionEntry[]>([]);
 const [workspace,setWorkspace]=useState<WorkspaceState>(loadWorkspace);
 const [speed,setSpeed]=useState(0);
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState('System ready.');
 const [offline,setOffline]=useState(0);
 const [showHint,setShowHint]=useState(false);
 const [beginner,setBeginner]=useState(true);
 const [selection,setSelection]=useState('');
 const [discipline,setDiscipline]=useState<'world'|'settlement'>('world');
 const [saveExists,setSaveExists]=useState(false);
 const [paletteOpen,setPaletteOpen]=useState(false);
 const [notice,setNotice]=useState<WorkbenchNotice|null>(null);
 const runtime=useRef<PythonRuntime|null>(null);
 const continuous=useRef(new ContinuousScheduler());
 const [saveStatus,setSaveStatus]=useState('Saved');
 const saver=useRef<SaveCoordinator<{world:WorldState;controllers:Controller[];lesson:number}>|null>(null);
 const latest=useRef({world,controllers,lesson});
 const gate=useRef(false);
 const sessionVersion=useRef(0);
 const fileInput=useRef<HTMLInputElement>(null);
 latest.current={world,controllers,lesson};
 useEffect(()=>{
  runtime.current=new PythonRuntime();
  const coordinator=new SaveCoordinator(()=>latest.current,
   async snapshot=>saveCampaign(snapshot.world,snapshot.controllers,snapshot.lesson),
   (state,error)=>{
    setSaveStatus(state==='saved'?'Saved':state==='saving'?'Saving…':state==='error'?'Save failed':'Unsaved');
    if(state==='saved')setSaveExists(true);
    if(error)setStatus('Save failed: '+error.message);
   });
  saver.current=coordinator;coordinator.start();
  let live=true;
  void loadCampaign().then(c=>{if(live)setSaveExists(validCampaign(c));}).catch(()=>{})
   .finally(()=>{if(live)setLoaded(true);});
  return()=>{live=false;runtime.current?.destroy();void coordinator.dispose().catch(()=>{});};
 },[]);
 useEffect(()=>{if(screen==='game')saveWorkspace(workspace);},[workspace,screen]);
 useEffect(()=>{
  if(loadingStep<0)return;
  if(loadingStep>=BOOT_MESSAGES.length){
   const end=setTimeout(()=>{setLoadingStep(-1);setWorkspace(activeWorkspace());setStatus('Simulation online. Population: 0 / 3.');},550);
   return()=>clearTimeout(end);
  }
  const timer=setTimeout(()=>setLoadingStep(step=>step+1),loadingStep===0?350:220);
  return()=>clearTimeout(timer);
 },[loadingStep]);
 useEffect(()=>{if(screen==='game')saver.current?.markDirty();},[world,controllers,lesson,screen]);

 const applyState=useCallback((w:WorldState,c:Controller[],e:ExecutionEntry[],original:Controller[])=>{
  setWorld(w);setControllers(current=>{
   const merged=mergeRuntimeControllers(current,c,original);
   const missing=c.filter(item=>!merged.some(other=>other.id===item.id));
   return ensureFounderControllers(ensureGenesisController([...merged,...missing],w.phase==='active'&&w.workers.length===0),w);
  });setEntries(old=>[...old,...e].slice(-130));
  if(w.workers.length) setLesson(old=>Math.min(old+Number(lessonCompleted(old,w,c,e)),LESSONS.length));
 },[]);
 const execute=useCallback(async(manualId?:string)=>{
  if(gate.current||!runtime.current||screen!=='game'||loadingStep>=0)return;
  gate.current=true;setBusy(true);
  const sessionAtStart=sessionVersion.current;
  try{
   const {world:w,controllers:c}=latest.current;
   const isContinuous=!!manualId&&c.some(x=>x.id===manualId&&x.executionMode==='continuous');
   const activeControllers=isContinuous?c.map(x=>x.id===manualId?{...x,enabled:true}:x):c;
   const first=manualId&&!isContinuous?
    await runControllers(w,c,c.filter(x=>x.id===manualId),(source,snapshot,memory,ownerId)=>
      runtime.current!.run<ScriptCommand>(source,snapshot,memory,ownerId,CODE_EMPIRE_PYTHON_BRIDGE),true):
    await advanceTick(w,activeControllers,(source,snapshot,memory,ownerId)=>
      runtime.current!.run<ScriptCommand>(source,snapshot,memory,ownerId,CODE_EMPIRE_PYTHON_BRIDGE));
   const physical=first.world.phase==='active'?await continuous.current.pulse(first.world,first.controllers,
    (id,operation,snapshot,source,owner,response)=>
     runtime.current!.stepContinuous(id,operation,snapshot,source,owner,response)):null;
   const result=physical?{world:physical.world,controllers:physical.controllers,entries:[...first.entries,...physical.entries]}:first;
   if(sessionAtStart!==sessionVersion.current)return;
   applyState(result.world,result.controllers,result.entries,c);
   if(w.phase==='dormant'&&result.world.phase==='active'){setLoadingStep(0);setSpeed(0);}
   const failed=result.entries.find(x=>!x.success);
   const rejected=result.entries.find(x=>x.output.some(message=>message.startsWith('Rejected command:')));
   if(failed||rejected){
    const entry=failed??rejected!;
    const body=failed?(entry.error??entry.output.join(' · ')):entry.output.find(msg=>msg.startsWith('Rejected command:'))??'Command rejected';
    setStatus(failed?'Python error — inspect controller Output.':'Command rejected — inspect controller Output.');
    setNotice({id:Date.now(),kind:failed?'error':'warning',title:failed?'Python execution failed':'Command rejected',
      detail:body.slice(0,250),actionLabel:'Open controller output',
      onAction:()=>setWorkspace(s=>{
       const opened=upsertWindow(s,'controller',entry.controllerId);
       return updateWindow(opened,'controller:'+entry.controllerId,{tab:'output'});
      })});
   }else{
    setStatus(manualId?'Script executed.':'Simulation advanced.');
    if(manualId)setNotice({id:Date.now(),kind:'success',title:'Script executed',detail:'Python ran successfully. Review the Output tab for details.'});
   }
  }catch(error){setStatus('Runtime issue: '+String(error));setSpeed(0);
   setNotice({id:Date.now(),kind:'error',title:'Runtime issue',detail:String(error).slice(0,240)});}
  finally{gate.current=false;setBusy(false);}
 },[screen,applyState,loadingStep]);
 useEffect(()=>{if(screen!=='game'||!speed)return;
  const timer=setInterval(()=>{void execute();},SPEED[speed]);return()=>clearInterval(timer);
 },[screen,speed,execute]);
 const newGame=async()=>{
  if(gate.current){setStatus('Finish the current Python execution before starting a campaign.');return;}
  await saver.current?.flush().catch(()=>{});
  sessionVersion.current++;
  if(saveExists&&!window.confirm('Start a new campaign? The existing autosave will be replaced. Export your save first if needed.'))return;
  continuous.current.reset();
  setSpeed(0);setWorld(createPendingWorld());setControllers(initialControllers());setLesson(0);setEntries([]);
  setWorkspace(startupWorkspace());setStatus('Awaiting simulation startup.');
  setOffline(0);setSelection('');setDiscipline('world');setBootInput('');setBootError('');setLoadingStep(-1);setScreen('terminal');
 };
 const continueGame=async()=>{
  if(gate.current){setStatus('A Python execution is still running.');return;}
  await saver.current?.flush().catch(()=>{});
  sessionVersion.current++;
  continuous.current.reset();
  try{
   const value=await loadCampaign();
   if(!validCampaign(value)){setStatus('No valid campaign to continue.');return;}
   const result=catchUp(value.world,Date.now()-value.savedAt);
   setWorld(result.world);
   setControllers(ensureFounderControllers(ensureGenesisController(value.controllers,result.world.phase==='active'&&result.world.workers.length===0),result.world));
   setLesson(value.lessonIndex);
   const saved=hasSavedWorkspace()?loadWorkspace():null;
   setWorkspace(saved?resumeWorkspace(saved,result.world.phase,value.controllers.map(c=>c.id)):
     result.world.phase==='dormant'?startupWorkspace():activeWorkspace());setLoadingStep(-1);
   setOffline(result.hours);setEntries([]);setStatus('Welcome back to First Light!');
   setScreen('game');
  }catch(e){setStatus('Could not load campaign: '+String(e));}
 };
 const issueCommand=(command:ScriptCommand)=>{
  if(gate.current||busy||world.phase!=='active')return;
  const outcome=applyCommands(latest.current.world,[command]);
  setWorld(outcome.world);
  setControllers(c=>ensureFounderControllers(c,outcome.world));
  setStatus(outcome.messages.join(' · ')||'Command processed.');
  const isRejected=outcome.messages.some(message=>message.startsWith('Rejected'));
  setNotice({id:Date.now(),kind:isRejected?'warning':'success',
   title:isRejected?'Command rejected':'Command completed',
   detail:outcome.messages.join(' · ').slice(0,230)});
  if(outcome.messages.length)setEntries(old=>[...old,{tick:world.tick,controllerId:'engine',filename:'Interface',success:!outcome.messages[0].startsWith('Rejected'),output:outcome.messages,commands:1}].slice(-130));
 };
 const manualAction=(id:string,kind:'move'|'harvest'|'deposit',direction?:string)=>{
  if(gate.current||busy||world.phase!=='active')return;
  const action=startPhysicalAction(latest.current.world,id,{entityId:id,kind,direction,storageId:'stockpile_001'});
  if(action.response.ok){latest.current={...latest.current,world:action.world};setWorld(action.world);setStatus('Manual '+kind+' started. Advance game time to complete it.');}
  else setStatus('Action unavailable: '+action.response.reason);
 };
 const open=(kind:WindowKind,id?:string)=>setWorkspace(s=>upsertWindow(s,kind,id));
 useEffect(()=>{
  if(screen!=='game')return;
  const shortcut=(e:KeyboardEvent)=>{
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
    e.preventDefault();setPaletteOpen(x=>!x);return;
   }
   if(e.key==='Escape')setPaletteOpen(false);
   if(e.key==='F1'&&!['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement)?.tagName??'')){
    e.preventDefault();setWorkspace(s=>upsertWindow(s,'python'));
   }
  };
  document.addEventListener('keydown',shortcut,true);
  return()=>document.removeEventListener('keydown',shortcut,true);
 },[screen]);
 const editController=(id:string,change:Partial<Controller>)=>setControllers(c=>c.map(x=>x.id===id?{...x,...change}:x));
 const checkpointController=(id:string)=>{
  setControllers(current=>current.map(c=>{
   if(c.id!==id)return c;
   const previous=c.checkpoints??[];
   if(previous[previous.length-1]?.source===c.source)return c;
   return {...c,checkpoints:[...previous,{savedAt:Date.now(),source:c.source}].slice(-20)};
  }));
 };
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
  if(gate.current){setStatus('Complete Python execution before importing.');return;}
  await saver.current?.flush().catch(()=>{});
  const file=event.target.files?.[0];if(!file)return;
  try{
   const data:unknown=JSON.parse(await file.text());
   const imported=migrateCampaign(data);
   if(!imported)throw new Error('Unsupported or invalid campaign save.');
   if(!window.confirm('Import this campaign and replace your current autosave?'))return;
   const c=imported as Campaign;
   await saveCampaign(c.world,c.controllers,c.lessonIndex);
   sessionVersion.current++;
   continuous.current.reset();
   setWorld(c.world);
   setControllers(ensureFounderControllers(ensureGenesisController(c.controllers,c.world.phase==='active'&&c.world.workers.length===0),c.world));
   setLesson(c.lessonIndex);setEntries([]);
   setSaveExists(true);setWorkspace(c.world.phase==='dormant'?startupWorkspace():activeWorkspace());setLoadingStep(-1);setScreen('game');setSpeed(0);setStatus('Campaign imported.');
  }catch(error){setStatus('Import failed: '+String(error));}
  finally{event.target.value='';}
 };
 const openDoc=(scope:DocScope,id:string,popout=false)=>{
  setWorkspace(current=>{
   if(popout)return popoutDocument(current,scope,id);
   const kind=scope==='python'?'python':'docs';
   const updated=upsertWindow(current,kind);
   const key=scope+':'+id,w=updated.windows.find(x=>x.id===kind)!;
   const tabs=[...(w.docTabs??[])];if(!tabs.includes(key))tabs.push(key);
   return updateWindow(updated,kind,{docTabs:tabs.slice(-12),activeDoc:key});
  });
 };
 const title=(win:WindowState)=>win.kind==='document'?
  findDoc([...PYTHON_TOPICS,...GAME_DOCUMENTS],win.activeDoc??'')?.title??'Reference Page':
  windowTitle(win,controllers.find(c=>c.id===win.controllerId)?.filename);
 const render=(win:WindowState)=>renderGameWindow(win,{world,controllers,entries,selection,lesson,
  showHint,setShowHint,beginner,busy,editController,execute,issueCommand,manualAction,open,openEntity,setWorkspace,setBeginner,openDoc,beginLesson,checkpointController});

 const resetAppearance=()=>{
  const defaults=themeDefaults();
  applyTheme(defaults);saveUiScale(1);
  try{persistTheme(defaults);setStatus('Appearance and interface size reset to defaults.');}
  catch{setStatus('Appearance reset for this session; browser storage is unavailable.');}
 };
 const submitBoot=()=>{
  if(bootInput.trim()==='Empire.boot()'){setBootError('');setScreen('game');setWorkspace(startupWorkspace());}
  else setBootError('Unrecognized command. Enter Empire.boot() to launch the simulation software.');
 };
 return <>
  {screen==='menu'?<MainMenu loaded={loaded} saveExists={saveExists}
  onNew={()=>void newGame()} onContinue={()=>void continueGame()} onImport={()=>fileInput.current?.click()}
  onResetAppearance={resetAppearance} status={status}/>:
   screen==='terminal'?<main className="boot-terminal"><section className="boot-screen" aria-label="Simulation terminal">
    <p className="boot-heading">CIVILIZATION INITIATIVE // UNIVERSAL TERMINAL</p>
    <h1>WELCOME TO YOUR SIMULATION</h1>
    <p>Simulation theory is no longer a hypothesis. Our reality is computational.</p>
    <p>Every willing mind is invited to create a civilization, test its future, and help humanity better understand our own.</p>
    <p>This world has no people, no history, and no destiny until you begin.</p>
    <p className="boot-instruction">Type <strong>Empire.boot()</strong> to launch the simulation software.</p>
    <form onSubmit={e=>{e.preventDefault();submitBoot();}}><label htmlFor="terminal-input">C:\\EMPIRE&gt;</label><input id="terminal-input" autoFocus spellCheck={false} autoComplete="off" value={bootInput} onChange={e=>setBootInput(e.target.value)} aria-label="Boot command"/><span className="boot-cursor">█</span></form>
    {bootError&&<p className="boot-error" role="alert">{bootError}</p>}
    <p className="boot-footnote">Press ENTER to execute · <button type="button" onClick={()=>setScreen('menu')}>RETURN TO MENU</button></p>
   </section></main>:
   <div className="game-shell"><header className="game-header"><button className="brand-button" onClick={async()=>{setSpeed(0);await saver.current?.flush().catch(()=>{});setScreen('menu');}}>⌘ <b>CODE<span>EMPIRE</span></b></button><span>{world.phase==='dormant'?'SIMULATION OFFLINE':'FIRST LIGHT'} <span className="divider">/</span> {world.phase==='dormant'?'AWAITING INITIALIZATION':'SETTLEMENT AGE'}</span><span>DAY {1+Math.floor(world.tick/24)} · {String(world.tick%24).padStart(2,'0')}:00</span><div className="clock-actions"><button disabled={world.phase==='dormant'||loadingStep>=0} className={speed===0?'active':''} onClick={()=>setSpeed(0)}>Ⅱ</button><button disabled={busy||world.phase==='dormant'||loadingStep>=0} onClick={()=>void execute()}>⏭</button>{[1,2,3].map(v=><button key={v} disabled={world.phase==='dormant'||loadingStep>=0} className={speed===v?'active':''} onClick={()=>setSpeed(v)}>{v}×</button>)}</div></header>
   <div className="game-row"><aside className="sidebar ce-scroll">{(world.phase==='dormant'?[['scripts','⌘','Scripts'],['python','Py','Python Reference'],['docs','▤','Game API']]:[['overview','◫','Overview'],['world','◇','World'],...(world.settlementUnlocked?[['settlement','⌂','Settlement'] as const]:[]),['archive','▤','Genesis Archive'],['scripts','⌘','Scripts'],['learn','✧','Learn Python'],['python','Py','Python Reference'],['docs','▤','Game API'],['console','>_','Console'],['settings','⚙','Settings']] as const).map(([kind,icon,label])=><button key={kind} title={label} aria-label={label} onClick={()=>kind==='world'||kind==='settlement'?setDiscipline(kind):open(kind as WindowKind)}><span>{icon}</span><small>{label}</small></button>)}</aside>
   <div className="desktop-area"><div className="discipline-background">{world.phase==='active'?(discipline==='settlement'&&world.settlementUnlocked?<SettlementView world={world} onCommand={issueCommand}/>:<WorldView world={world} selection={selection} onSelect={openEntity} onAction={manualAction}/>):<div className="window-content"><p className="muted">Initialize the simulation to display your world.</p></div>}</div><WindowManager state={workspace} setState={setWorkspace} title={title} render={render}/>
    {loadingStep>=0&&<div className="initialization-overlay" role="status" aria-live="polite"><div className="initialization-box ce-scroll"><p className="eyebrow">CIVILIZATION INITIATIVE // WORLD GENERATOR</p><h2>INITIALIZING SIMULATION</h2>
     <div className="initialization-progress"><span style={{width:(100*Math.min(loadingStep,BOOT_MESSAGES.length)/BOOT_MESSAGES.length)+'%'}}/></div>
     {BOOT_MESSAGES.slice(0,loadingStep+1).map((m,i)=><p className={i===loadingStep?'initialization-current':''} key={i}>{i===loadingStep?'› ':'✓ '}{m}</p>)}</div></div>}
    <div className="taskbar ce-scroll"><WorkspaceControls
      onArrange={(mode,bounds)=>setWorkspace(s=>arrangeWorkspace(s,mode,bounds))}
      onPreset={(preset,bounds)=>setWorkspace(s=>applyWorkspacePreset(s,preset,bounds))}/>
      <button className="quick-open-trigger" title="Quick Open (Ctrl+K)" onClick={()=>setPaletteOpen(true)}>⌕ Find</button>
      {workspace.windows.map(w=><button key={w.id} className={workspace.focus===w.id&&!w.minimized?'focused':''} onClick={()=>setWorkspace(s=>(w.minimized||s.focus!==w.id)?focusWindow(s,w.id):updateWindow(s,w.id,{minimized:true}))}>{title(w)}</button>)}</div></div></div>
   <footer className="game-footer"><span className="footer-notice">{status} · {saveStatus}{offline>0?' · +'+offline+'h offline progress':''}</span>{world.workers.length>0&&beginner&&lesson<LESSONS.length&&<button className="lesson-shortcut" onClick={()=>open('learn')}>✧ Lesson {lesson+1}: {LESSONS[lesson].title}</button>}<button onClick={()=>downloadCampaign(world,controllers,lesson)}>⇩ EXPORT</button><button onClick={()=>fileInput.current?.click()}>⇧ IMPORT</button><button onClick={async()=>{setSpeed(0);await saver.current?.flush().catch(()=>{});setScreen('menu');}}>⌂ MENU</button></footer>
   </div>}
  {screen==='game'&&<NotificationCenter notice={notice} onDismiss={()=>setNotice(null)}/>}
  {screen==='game'&&paletteOpen&&<CommandPalette controllers={controllers} world={world} workspace={workspace}
   onClose={()=>setPaletteOpen(false)} openWindow={kind=>open(kind)}
   openController={id=>open('controller',id)} openEntity={openEntity}
   focusExisting={id=>setWorkspace(s=>focusWindow(s,id))}
   openDocs={()=>open('python')} run={()=>{void execute();}}/>}
  <input ref={fileInput} type="file" hidden accept=".json,application/json" onChange={e=>void importGame(e)}/>
 </>;
}