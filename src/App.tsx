import { useCallback, useEffect, useRef, useState } from 'react';
import { applyCommands, catchUp, createWorld, stepWorld, worldSnapshot } from './engine/world';
import { WIDTH } from './engine/types';
import type { Campaign, ScriptFile, WorldState } from './engine/types';
import { starterScripts } from './defaults';
import { PythonRuntime } from './runtime/client';
import { exportCampaign, loadCampaign, saveCampaign, validCampaign } from './storage/db';

const VERSION = '0.1.0';
const TICK_RATE = [0, 800, 300, 100];
const TERRAIN: Record<string, string> = { meadow:'·', forest:'♣', quarry:'◆', farm:'❋', stockpile:'⌂', water:'≈' };
const LOG_LIMIT = 80;

export default function App() {
  const [world, setWorld] = useState<WorldState>(() => createWorld());
  const [scripts, setScripts] = useState<ScriptFile[]>(starterScripts);
  const [file, setFile] = useState('main.py');
  const [speed, setSpeed] = useState(0);
  const [logs, setLogs] = useState<string[]>(['Welcome to Code-Empire. Run your first Python script.']);
  const [status, setStatus] = useState('Loading your campaign...');
  const [ready, setReady] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [offline, setOffline] = useState(0);
  const [hovered, setHovered] = useState<string>('');
  const runtime = useRef<PythonRuntime | null>(null);
  const worldRef = useRef(world);
  const scriptsRef = useRef(scripts);
  const busyRef = useRef(false);
  const importedRef = useRef<HTMLInputElement>(null);
  const current = scripts.find(s => s.path === file) ?? scripts[0];

  const note = useCallback((message: string) => setLogs(old => [...old.slice(-LOG_LIMIT), message].slice(-LOG_LIMIT)), []);
  const commitWorld = useCallback((updated: WorldState) => { worldRef.current = updated; setWorld(updated); }, []);
  const commitScripts = useCallback((updated: ScriptFile[]) => { scriptsRef.current = updated; setScripts(updated); }, []);
  const updateFile = (change: Partial<ScriptFile>) => commitScripts(scriptsRef.current.map(s => s.path === file ? { ...s, ...change } : s));

  useEffect(() => {
    runtime.current = new PythonRuntime();
    let alive = true;
    void loadCampaign().then(campaign => {
      if (!alive) return;
      if (validCampaign(campaign)) {
        const elapsed = Math.max(0, Date.now() - campaign.savedAt);
        const caught = catchUp(campaign.world, elapsed);
        commitWorld(caught.world);
        commitScripts(campaign.scripts);
        setFile(campaign.scripts[0]?.path ?? 'main.py');
        setOffline(caught.hours);
        setStatus('Campaign restored');
      } else setStatus('New frontier ready');
      setReady(true);
    }).catch(error => { if (alive) { setReady(true); setStatus('Save storage unavailable: ' + String(error)); } });
    return () => { alive = false; runtime.current?.destroy(); };
  }, [commitScripts, commitWorld]);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => void saveCampaign(world, scripts).catch(e => setStatus('Save failed: ' + String(e))), 500);
    return () => clearTimeout(timer);
  }, [ready, world, scripts]);

  const runFile = useCallback(async (script: ScriptFile, state: WorldState): Promise<void> => {
    if (busyRef.current || !runtime.current) return;
    busyRef.current = true;
    setExecuting(true);
    try {
      setStatus('Running ' + script.path + '...');
      const response = await runtime.current.run(script.source, worldSnapshot(state), script.memory);
      const result = applyCommands(worldRef.current, response.commands);
      commitWorld(result.world);
      const changed = scriptsRef.current.map(s => s.path === script.path ? { ...s, memory: response.memory, nextRun: state.tick + s.interval } : s);
      commitScripts(changed);
      for (const line of [...response.output, ...result.messages].slice(0, 45)) note('[Python] ' + line);
      setStatus(script.path + ' completed');
    } catch (error) {
      note('[Error] ' + String(error));
      setStatus('Script error — inspect console');
      setSpeed(0);
    } finally {
      busyRef.current = false;
      setExecuting(false);
    }
  }, [commitScripts, commitWorld, note]);

  const advance = useCallback(() => {
    if (!ready || busyRef.current) return;
    const next = stepWorld(worldRef.current);
    commitWorld(next);
    const due = scriptsRef.current.find(s => s.enabled && s.nextRun <= next.tick);
    if (due) void runFile(due, next);
  }, [commitWorld, ready, runFile]);

  useEffect(() => {
    if (!speed || !ready) return;
    const timer = setInterval(advance, TICK_RATE[speed]);
    return () => clearInterval(timer);
  }, [speed, ready, advance]);

  const reset = () => {
    if (!window.confirm('Reset the world and all Python files? Export a backup first if you want to keep them.')) return;
    setSpeed(0);
    commitWorld(createWorld());
    commitScripts(starterScripts());
    setFile('main.py');
    setLogs(['New settlement founded.']);
    setStatus('New campaign');
  };
  const addScript = () => {
    const proposed = window.prompt('New script filename (example: scouts.py)');
    if (!proposed) return;
    const name = proposed.trim();
    if (!/^[\w-]+\.py$/.test(name) || scripts.some(s => s.path === name)) { note('Choose a unique filename ending in .py, with letters, numbers, hyphens or underscores.'); return; }
    commitScripts([...scripts, { path:name, source:'def on_tick(world, memory):\n    pass\n', enabled:true, interval:12, nextRun:world.tick, memory:{} }]);
    setFile(name);
  };
  const importSave = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const imported = input.files?.[0];
    if (!imported) return;
    try {
      const contents: unknown = JSON.parse(await imported.text());
      if (!validCampaign(contents)) throw new Error('Unsupported or invalid save schema.');
      if (!window.confirm('Replace your current campaign with this backup?')) return;
      const restored = contents as Campaign;
      setSpeed(0);
      commitWorld(restored.world);
      commitScripts(restored.scripts);
      setFile(restored.scripts[0]?.path ?? 'main.py');
      setStatus('Campaign imported');
      note('Campaign imported from backup.');
    } catch (error) { note('Import failed: ' + String(error)); }
    finally { input.value = ''; }
  };
  const workersByCell = new Map<string, typeof world.workers>();
  world.workers.forEach(w => {
    const key = w.x + ',' + w.y;
    workersByCell.set(key, [...(workersByCell.get(key) ?? []), w]);
  });
  const days = 1 + Math.floor(world.tick / 24);
  const hour = world.tick % 24;
  const milestones = world.events.filter(e => e.startsWith('Milestone:')).length;
  return <div className="app-shell">
    <header className="app-header">
      <div className="brand"><div className="brand-emblem">CE</div><div><h1>CODE<span>EMPIRE</span></h1><small>PROGRAM A CIVILIZATION · FOUNDATION {VERSION}</small></div></div>
      <div className="top-stats">
        <div><small>COLONY</small><strong>FIRST LIGHT</strong></div>
        <div><small>ERA</small><strong>SETTLEMENT</strong></div>
        <div><small>DAY / HOUR</small><strong>{days} / {String(hour).padStart(2, '0')}:00</strong></div>
      </div>
      <a className="source-link" target="_blank" rel="noreferrer" href="https://github.com/MrEktidd/Code-Empire">↗ GitHub</a>
    </header>
    <div className="statusbar"><span className="green-dot"/> {status} {offline > 0 && <span className="offline-chip">+{offline}h offline settlement progress</span>}<span className="right">World seed: {world.seed} · Tick {world.tick} · Milestones {milestones}</span></div>
    <main className="workspace">
      <section className="panel editor-panel">
        <div className="panel-heading"><span>⌘ PYTHON AUTOMATION</span><span className="mini-label">Pyodide · WebAssembly</span></div>
        <div className="filebar"><div className="tabs">{scripts.map(s => <button className={'tab ' + (s.path === file ? 'active' : '')} key={s.path} onClick={() => setFile(s.path)}>{s.path}</button>)}</div><button className="icon-btn" onClick={addScript} title="New Python script">＋</button></div>
        <div className="editor-hint">Edit Python to control the simulation. Each file has its own execution schedule.</div>
        <textarea className="code-editor" spellCheck={false} aria-label="Python source code" value={current?.source ?? ''} onChange={e => updateFile({ source:e.target.value })}/>
        <div className="editor-controls"><label className="small-control"><input type="checkbox" checked={current?.enabled ?? false} onChange={e => updateFile({ enabled:e.target.checked })}/> AUTO RUN</label><label className="small-control">EVERY <input className="interval" aria-label="Execution interval in hours" type="number" min="1" max="9999" value={current?.interval ?? 6} onChange={e => updateFile({ interval:Math.min(9999, Math.max(1, Number(e.target.value) || 1)) })}/> HOURS</label><button className="button primary" disabled={!ready || executing || !current} onClick={() => current && void runFile(current, worldRef.current)}>{executing ? 'EXECUTING...' : '▶ RUN SCRIPT'}</button></div>
        <div className="help"><strong>WORLD API</strong><code>world.workers()</code><code>world.stockpile("wood")</code><code>world.assign(id, "wood")</code><code>world.order(id, "gather", resource="stone")</code><code>world.log("message")</code><div>Persistent variables: <code>memory["key"]</code></div></div>
      </section>
      <section className="panel map-panel">
        <div className="panel-heading"><span>◇ THE FRONTIER</span><span className="mini-label">16 × 11 · PROCEDURAL</span></div>
        <div className="map-wrap"><div className="map-grid" role="img" aria-label="Settlement world map">
          {world.tiles.map(tile => {
            const w = workersByCell.get(tile.x + ',' + tile.y);
            const active = w?.length;
            return <div key={tile.x + '-' + tile.y} className={'tile ' + tile.ground + (active ? ' occupied' : '')} title={tile.ground + ' (' + tile.x + ', ' + tile.y + ')' + (tile.remaining ? ' · '+tile.remaining+' remaining' : '')} onMouseEnter={() => setHovered(tile.ground + ' [' + tile.x + ', ' + tile.y + ']' + (tile.remaining ? ' · '+tile.remaining+' left' : ''))}>
              {active ? <span className="occupant">{w!.map(unit => unit.name[0]).join('')}</span> : TERRAIN[tile.ground]}
            </div>;
          })}
        </div></div>
        <div className="map-legend"><span>♣ Forest</span><span>◆ Quarry</span><span>⌂ Stockpile</span><span>❋ Farm</span><span>● Settlers</span></div>
        <div className="tile-info">{hovered || 'Hover over the map for tile details. Forests and quarries are finite.'}</div>
        <div className="transport"><div><b>SIMULATION CLOCK</b><span>1 tick = 1 hour</span></div><div className="transport-buttons"><button onClick={() => setSpeed(0)} className={'button '+(!speed?'selected':'')}>Ⅱ PAUSE</button><button onClick={advance} disabled={!ready || executing} className="button">⏭ STEP</button>{[1,2,3].map(n => <button key={n} onClick={() => setSpeed(n)} className={'button '+(speed===n?'selected':'')}>{n}×</button>)}</div></div>
      </section>
      <aside className="side-column">
        <section className="panel stock-panel"><div className="panel-heading">◫ COLONY STOCKPILES</div><div className="stock-list">{([['wood','WOOD','♣'],['stone','STONE','◆'],['food','FOOD','❋']] as const).map(([key,name,symbol]) => <div className="stock" key={key}><span className="stock-icon">{symbol}</span><div><small>{name}</small><strong>{world.stocks[key].toLocaleString()}</strong></div></div>)}</div><div className="foot-stat">Lifetime harvest <b>{world.totalHarvested.toLocaleString()}</b></div></section>
        <section className="panel workers-panel"><div className="panel-heading">♙ SETTLERS <span className="mini-label">{world.workers.length} ACTIVE</span></div>{world.workers.map(w => <div className="worker" key={w.id}><div className="avatar">{w.name[0]}</div><div className="worker-text"><strong>{w.name}</strong><small>{w.role} · ({w.x}, {w.y})</small><span>{w.policy ? '⚙ Automating '+w.policy : '○ Awaiting instructions'}</span></div><div className="cargo">{w.carried}/{w.capacity}</div></div>)}</section>
        <section className="panel objectives"><div className="panel-heading">☆ FIRST OBJECTIVE</div><h3>Establish a resource network</h3><p>Use Python to automate your forester and miner. Build a stockpile of 60 wood and 24 stone.</p><div className="progress-track"><div style={{width:Math.min(100, Math.min(world.stocks.wood / 60,world.stocks.stone / 24) * 100)+'%'}}/></div><div className="objective-total">{world.stocks.wood}/60 wood · {world.stocks.stone}/24 stone</div></section>
      </aside>
    </main>
    <section className="console-panel panel"><div className="panel-heading"><span>⌁ RUNTIME CONSOLE</span><span className="mini-label">SCRIPT OUTPUT & EVENTS</span></div><div className="console-contents">{logs.length ? logs.slice(-12).map((item,i)=><div key={i}><span className="prompt-symbol">›</span> {item}</div>) : <div>No output yet.</div>}</div></section>
    <footer><span>CODE-EMPIRE · MIT OPEN SOURCE · PRE-ALPHA</span><div className="footer-actions"><button onClick={() => exportCampaign(worldRef.current,scriptsRef.current)}>⇩ EXPORT SAVE</button><button onClick={() => importedRef.current?.click()}>⇧ IMPORT SAVE</button><button onClick={reset}>↺ NEW WORLD</button><input type="file" accept=".json,application/json" ref={importedRef} hidden onChange={e=>void importSave(e)}/></div><span>AUTOSAVE: BROWSER STORAGE</span></footer>
  </div>;
}
