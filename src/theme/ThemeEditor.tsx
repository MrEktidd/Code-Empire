import {useEffect,useState} from 'react';
import type {ThemeValues,ThemeToken} from './themeState';
import {
  THEME_TOKENS,TOKEN_GROUPS,THEME_PRESETS,themeDefaults,readSavedTheme,applyTheme,
  persistTheme,presetTheme,isThemeValue,importTheme,exportTheme
} from './themeState';
import './themeEditor.css';

const same=(a:ThemeValues,b:ThemeValues)=>THEME_TOKENS.every(t=>a[t.id]===b[t.id]);
function contrastColor(hex:string):number[]{
 return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
}
function contrast(a:string,b:string):number{
 const lum=(hex:string)=>contrastColor(hex).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 const x=lum(a),y=lum(b);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
function ColorControl({label,id,value,onChange}:{label:string;id:ThemeToken;value:string;onChange:(id:ThemeToken,value:string)=>void}){
 const [hex,setHex]=useState(value);
 useEffect(()=>setHex(value),[value]);
 return <div className="theme-setting">
  <label htmlFor={'pick-'+id}>{label}</label>
  <div className="theme-color-entry">
   <input id={'pick-'+id} aria-label={label+' color picker'} type="color" value={value}
    onChange={e=>onChange(id,e.target.value)} title={'Choose '+label.toLowerCase()}/>
   <input aria-label={label+' hex value'} className="ce-input theme-hex" type="text" maxLength={7}
    spellCheck={false} value={hex} onChange={e=>{
      const next=e.target.value;
      setHex(next);
      if(isThemeValue(id,next))onChange(id,next.toLowerCase());
    }} onBlur={()=>setHex(value)} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}}/>
  </div>
 </div>;
}
function RangeControl({label,id,value,min,max,step,onChange}:{
 label:string;id:ThemeToken;value:string;min:number;max:number;step:number;onChange:(id:ThemeToken,value:string)=>void
}){
 const n=parseInt(value,10);
 return <div className="theme-setting theme-range">
   <label htmlFor={'slider-'+id}>{label} <strong>{n}px</strong></label>
   <input id={'slider-'+id} type="range" min={min} max={max} step={step}
    value={n} onChange={e=>onChange(id,e.target.value+'px')}/>
 </div>;
}
/** Only this editor changes live root variables; never writes campaign state. */
export default function ThemeEditor(){
 const [saved,setSaved]=useState(readSavedTheme);
 const [draft,setDraft]=useState(readSavedTheme);
 const [past,setPast]=useState<ThemeValues[]>([]);
 const [future,setFuture]=useState<ThemeValues[]>([]);
 const [status,setStatus]=useState('');
 const [shared,setShared]=useState('');
 const [shareOpen,setShareOpen]=useState(false);
 const dirty=!same(draft,saved);
 useEffect(()=>{applyTheme(draft);},[draft]);
 useEffect(()=>{
  const onReset=()=>{
   const defaults=themeDefaults();
   setSaved(defaults);setDraft({...defaults});setPast([]);setFuture([]);setStatus('Appearance restored to defaults.');
  };
  window.addEventListener('code-empire:theme-reset',onReset);
  return()=>window.removeEventListener('code-empire:theme-reset',onReset);
 },[]);
 // Closing Settings without saving (even by switching windows) restores saved choices.
 useEffect(()=>()=>{applyTheme(readSavedTheme());},[]);
 const update=(next:ThemeValues)=>{
  if(same(next,draft))return;
  setPast(current=>[...current,draft].slice(-40));
  setFuture([]);
  setDraft(next);setStatus('');
 };
 const edit=(id:ThemeToken,value:string)=>{
  if(!isThemeValue(id,value))return;
  update({...draft,[id]:value.toLowerCase()});
 };
 const undo=()=>{
  if(!past.length)return;
  setFuture(current=>[draft,...current].slice(0,40));
  setDraft(past[past.length-1]);setPast(past.slice(0,-1));setStatus('');
 };
 const redo=()=>{
  if(!future.length)return;
  setPast(current=>[...current,draft].slice(-40));
  setDraft(future[0]);setFuture(future.slice(1));setStatus('');
 };
 const save=()=>{
  try{persistTheme(draft);setSaved({...draft});setPast([]);setFuture([]);setStatus('Theme saved to this browser.');}
  catch{setStatus('Could not save preferences. Browser storage may be disabled.');}
 };
 const revert=()=>{update({...saved});setStatus('Restored the last saved theme preview.');};
 const reset=()=>{update(themeDefaults());setStatus('Default colors restored in the preview. Choose Save Theme to keep them.');};
 const textRatio=contrast(draft['--ce-color-text'],draft['--ce-color-surface']);
 const labelRatio=contrast(draft['--ce-color-accent'],draft['--ce-color-background']);
 const lowContrast=textRatio<4.5||labelRatio<3;
 return <div className="theme-editor">
  <div className="theme-toolbar">
   <div>
    <p className="eyebrow">CODE EMPIRE / PERSONALIZATION</p>
    <h3>Theme Editor</h3>
    <p className="muted">Changes appear instantly across the workbench. Save only when you're happy with the result.</p>
   </div>
   <span className={'theme-status-pill '+(dirty?'theme-unsaved':'')}>{dirty?'● Unsaved changes':'✓ Saved'}</span>
  </div>
  <div className="theme-action-bar">
   <button className="ce-button ce-button--primary" onClick={save} disabled={!dirty}>Save Theme</button>
   <button className="ce-button" onClick={undo} disabled={!past.length}>↶ Undo</button>
   <button className="ce-button" onClick={redo} disabled={!future.length}>↷ Redo</button>
   <button className="ce-button" onClick={revert} disabled={!dirty}>Revert to Saved</button>
   <button className="ce-button" onClick={reset}>Reset Defaults</button>
  </div>
  {status&&<p role="status" className="theme-feedback">{status}</p>}
  <div className="theme-editor-layout">
   <div className="theme-controls">
    <label className="theme-preset-label" htmlFor="theme-preset">Quick theme presets</label>
    <select id="theme-preset" className="ce-input theme-preset" value="" onChange={e=>{
      const value=e.target.value;
      if(THEME_PRESETS.some(p=>p===value))update(presetTheme(value as typeof THEME_PRESETS[number]));
    }}>
     <option value="">Choose a preset...</option>
     {THEME_PRESETS.map(p=><option key={p} value={p}>{p}</option>)}
    </select>
    {TOKEN_GROUPS.map(group=><details key={group.id} className="theme-section ce-panel" open>
      <summary><strong>{group.title}</strong><small>{group.description}</small></summary>
      <div className="theme-options">
       {THEME_TOKENS.filter(def=>def.group===group.id).map(def=>def.kind==='color'?
        <ColorControl key={def.id} id={def.id} label={def.label} value={draft[def.id]} onChange={edit}/>:
        <RangeControl key={def.id} id={def.id} label={def.label} value={draft[def.id]}
          min={def.min} max={def.max} step={def.step} onChange={edit}/>)}
      </div>
    </details>)}
    <details className="theme-section theme-share ce-panel" open={shareOpen} onToggle={e=>setShareOpen(e.currentTarget.open)}>
      <summary><strong>Share or Import</strong><small>Copy a theme JSON preset or paste one from a friend.</small></summary>
      <div className="theme-share-body">
       <button className="ce-button" onClick={async()=>{
        const json=exportTheme(draft);setShared(json);
        try{await navigator.clipboard.writeText(json);setStatus('Theme JSON copied to clipboard.');}
        catch{setStatus('Theme JSON ready below. Select it to copy.');}
       }}>Copy Theme JSON</button>
       <label htmlFor="theme-json">Theme JSON</label>
       <textarea id="theme-json" className="ce-input theme-json" rows={5} value={shared}
        placeholder="Paste a Code Empire theme JSON here..." onChange={e=>setShared(e.target.value)}/>
       <button className="ce-button" disabled={!shared.trim()} onClick={()=>{
        try{update(importTheme(shared));setStatus('Theme imported into preview. Save to keep it.');}
        catch(e){setStatus('Import failed: '+(e instanceof Error?e.message:String(e)));}
       }}>Import to Preview</button>
      </div>
    </details>
   </div>
   <aside className="theme-preview" aria-label="Live theme preview">
    <p className="eyebrow">LIVE PREVIEW</p>
    <div className="theme-preview-panel ce-panel">
      <div className="theme-preview-title">First Light <span>□ &times;</span></div>
      <div className="theme-preview-content">
       <p className="eyebrow">CIVILIZATION INITIATIVE</p>
       <h4>Simulation Ready</h4>
       <p className="muted">Your civilization awaits its next command.</p>
       <div className="theme-preview-row"><span className="ce-badge">SYSTEM ACTIVE</span><span>Day 1</span></div>
       <div className="theme-preview-buttons">
        <button className="ce-button ce-button--primary">Primary Action</button>
        <button className="ce-button">Secondary</button>
       </div>
       <div className="theme-preview-divider"/>
       <label htmlFor="theme-demo-input">Sample input</label>
       <input id="theme-demo-input" className="ce-input" placeholder="Empire.initialize()" readOnly/>
      </div>
    </div>
    <div className="theme-contrast ce-panel">
      <strong>Readability</strong>
      <div><span>Text on panel</span><b>{textRatio.toFixed(1)}:1</b></div>
      <div><span>Accent on background</span><b>{labelRatio.toFixed(1)}:1</b></div>
      {lowContrast&&<p className="theme-contrast-warning" role="alert">Low contrast: some text may be difficult to read. Try brighter text or darker surfaces.</p>}
    </div>
    <p className="muted">Theme preferences are saved locally on this device, independent of your civilization. Closing Settings discards unsaved changes.</p>
   </aside>
  </div>
 </div>;
}
