import {useState} from 'react';
import {readUiScale,saveUiScale,UI_SCALES} from '../theme/uiPreferences';
import type {UiScale} from '../theme/uiPreferences';
import {persistTheme,themeDefaults,applyTheme} from '../theme/themeState';
import type {Dispatch,SetStateAction} from 'react';
import type {WorkspaceState} from '../workspace/registry';
import {newWorkspace} from '../workspace/registry';
import ThemeEditor from '../theme/ThemeEditor';
import '../theme/themeEditor.css';

export default function SettingsWindow({beginner,setBeginner,setWorkspace}:{
 beginner:boolean;
 setBeginner:(value:boolean)=>void;
 setWorkspace:Dispatch<SetStateAction<WorkspaceState>>;
}){
 const [tab,setTab]=useState<'general'|'theme'>('general');
 const [scale,setScale]=useState(readUiScale);
 const [status,setStatus]=useState('');
 return <div className="settings-screen">
   <div className="settings-tabs" role="tablist" aria-label="Settings sections">
     <button role="tab" aria-selected={tab==='general'} className={tab==='general'?'active':''}
       onClick={()=>setTab('general')}>General</button>
     <button role="tab" aria-selected={tab==='theme'} className={tab==='theme'?'active':''}
       onClick={()=>setTab('theme')}>Theme</button>
   </div>
   <section className="window-content ce-scroll settings-body" hidden={tab!=='general'} role="tabpanel">
     <h2>General Settings</h2>
     <label className="setting-row"><input type="checkbox" checked={beginner}
       onChange={e=>setBeginner(e.target.checked)}/> Show beginner learning prompts</label>
     <div className="setting-group">
      <label htmlFor="ui-scale">Interface size</label>
      <select id="ui-scale" className="ce-input" value={scale} onChange={e=>{
       const next=Number(e.target.value) as UiScale;
       if(!UI_SCALES.includes(next))return;
       setScale(next);saveUiScale(next);
      }}>{UI_SCALES.map(s=><option key={s} value={s}>{Math.round(s*100)}%</option>)}</select>
      <p className="muted">Adjusts text, controls, window headers, navigation and toolbars without zooming the world map.</p>
     </div>
     <button className="ce-button" onClick={()=>setWorkspace(newWorkspace())}>Reset Workspace Layout</button>
     <button className="ce-button" onClick={()=>{
      try{
       const defaults=themeDefaults();
       persistTheme(defaults);applyTheme(defaults);
       window.dispatchEvent(new Event('code-empire:theme-reset'));
       setStatus('Appearance restored to the default theme.');
      }catch{setStatus('Unable to update theme preferences.');}
     }}>Emergency: Restore Default Theme</button>
     {status&&<p role="status">{status}</p>}
     <div className="setting-group">
      <strong>Keyboard shortcuts</strong>
      <p className="muted">Ctrl / ⌘ + K — Quick Open commands, scripts and windows</p>
      <p className="muted">Ctrl / ⌘ + Enter — Run the open Python controller</p>
      <p className="muted">F1 — Python Reference (outside text fields)</p>
      <p className="muted">Double-click a window header to maximize or restore.</p>
     </div>
     <p className="muted">Scripts and simulation state are saved in IndexedDB. Window layouts and theme preferences are stored in your browser.</p>
   </section>
   <section className="ce-scroll settings-body" hidden={tab!=='theme'} role="tabpanel">
      <ThemeEditor/>
   </section>
 </div>;
}
