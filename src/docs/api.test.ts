import {describe,it,expect} from 'vitest';
import {controllerApi} from './api';
import {founderController,ensureFounderControllers} from '../defaults';
import {createCivilizationWorld,establishFounders} from '../engine/world';
describe('Founding UX and contextual Python APIs',()=>{
 it('only shows commands appropriate for a scheduled worker',()=>{
  const names=controllerApi('npc','scheduled').map(e=>e.name);
  expect(names).toContain('self.assign');
  expect(names).toContain('world.stockpile');
  expect(names).not.toContain('world.craft');
  expect(names).not.toContain('Empire.initialize');
  expect(names).not.toContain('self.install_module');
  expect(names).not.toContain('self.move');
 });
 it('uses physical actions and waits for continuous workers',()=>{
  const names=controllerApi('npc','continuous').map(e=>e.name);
  expect(names).toContain('self.move');
  expect(names).toContain('self.harvest');
  expect(names).toContain('world.job_completed');
  expect(names).not.toContain('self.order');
  expect(names).not.toContain('world.craft');
 });
 it('shows Genesis only its own setup command and output',()=>{
  expect(controllerApi('global','scheduled',true).map(e=>e.name).sort()).toEqual(['Empire.seed_population','print']);
 });
 it('provides top-level Python to new founders',()=>{
  const a=founderController(1,'npc_000001','Ada');
  expect(a.source).toContain('print("Hello, Empire!")');
  expect(a.source).not.toContain('def on_tick');
  expect(a.source).toContain('\n# Switch to Continuous mode');
  const b=founderController(2,'npc_000002','Bram');
  expect(b.source).not.toContain('def on_tick');
 });
 it('upgrades only the pristine legacy script, preserving edited player code',()=>{
  const w=establishFounders(createCivilizationWorld(),[
   {name:'Ada',sex:'female'},{name:'Bram',sex:'male'},{name:'Cora',sex:'female'}
  ]);
  const original=founderController(1,'npc_000001','Ada');
  const legacy={...original,source:'# Your first founder: Ada\n\ndef on_tick(self, world, memory):\n    print("Hello, Empire!")\n'};
  const custom={...founderController(2,'npc_000002','Bram'),source:'def on_tick(self, world, memory):\n    print("custom")\n'};
  const revised=ensureFounderControllers([legacy,custom],w);
  expect(revised.find(x=>x.id==='ctrl_000001')?.source).toBe(original.source);
  expect(revised.find(x=>x.id==='ctrl_000002')?.source).toBe(custom.source);
  expect(revised.find(x=>x.id==='ctrl_000003')?.source).not.toContain('def on_tick');
 });
});
