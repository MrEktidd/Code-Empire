import {useState} from 'react';
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
     <button className="ce-button" onClick={()=>setWorkspace(newWorkspace())}>Reset Workspace Layout</button>
     <p className="muted">Scripts and simulation state are saved in IndexedDB. Window layouts and theme preferences are stored in your browser.</p>
   </section>
   <section className="ce-scroll settings-body" hidden={tab!=='theme'} role="tabpanel">
      <ThemeEditor/>
   </section>
 </div>;
}
