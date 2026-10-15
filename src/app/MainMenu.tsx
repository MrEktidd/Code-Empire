export default function MainMenu({loaded,saveExists,onNew,onContinue,onImport,status}:{
 loaded:boolean;saveExists:boolean;onNew:()=>void;onContinue:()=>void;onImport:()=>void;status:string;
}){
 return <div className="menu-root"><div className="menu-stars"/><div className="menu-content">
  <div className="logo-mark">⌘</div>
  <div className="menu-eyebrow">A CIVILIZATION WRITTEN IN CODE</div>
  <h1>CODE<span>EMPIRE</span></h1>
  <div className="alpha-banner"><strong>EARLY ALPHA · v0.2.6</strong><p>This is a development preview of the Python workbench and simulation engine. Most civilization gameplay systems are not implemented yet. Export backups of work you want to keep.</p></div>
  <p>From your first settler to the stars. Write Python and automate a living world.</p>
  <div className="menu-options">
    <button className="accent-btn" disabled={!loaded} onClick={onNew}>✦ NEW EMPIRE</button>
    <button disabled={!loaded||!saveExists} onClick={onContinue}>▶ CONTINUE CAMPAIGN</button>
    <button onClick={onImport}>⇧ IMPORT CAMPAIGN</button>
    <a href="https://github.com/MrEktidd/Code-Empire" target="_blank" rel="noreferrer">↗ OPEN-SOURCE PROJECT</a>
    <a href="https://github.com/MrEktidd/Code-Empire/issues" target="_blank" rel="noreferrer">REPORT A BUG / SUGGEST A FEATURE ↗</a>
  </div>
  <div className="menu-bottom">EARLY ALPHA · v0.2.6 · REAL PYTHON · MIT LICENSE</div>
  {status!=='System ready.'&&<div className="menu-status">{status}</div>}
 </div></div>;
}