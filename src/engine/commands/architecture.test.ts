import {describe,it,expect} from 'vitest';
import {createCivilizationWorld,applyCommands} from '../world';
import {CONTENT} from '../../games/code-empire/content/base';
import {craftRecipe,quantity} from '../systems/inventory';
import {changeModule,moduleEffects,validateModuleChange} from '../components/modules';
import {createGenericEntity} from '../entities/identity';
import {SignalBus} from '../events/bus';
import {COMMANDS} from './registry';
describe('v0.3.2 modules, recipes, commands and signals',()=>{
 const founders=[{name:'Adam',sex:'male'},{name:'Eve',sex:'female'},{name:'Ari',sex:'male'}];
 const world=()=>applyCommands(createCivilizationWorld(),[{action:'seed_population',founders}]).world;
 it('validates an individual module slot and reversible capacity effects',()=>{
  const w=world();const first=w.workers[0];
  expect(first.capacity).toBe(6);
  const installed=applyCommands(w,[{action:'module.install',entityId:first.id,moduleId:'core:carrying_basket'}]).world;
  expect(installed.workers[0].capacity).toBe(12);
  expect(w.workers[0].capacity).toBe(6);
  expect(installed.signals.at(-1)?.type).toBe('module.installed');
  expect(validateModuleChange(installed,first.id,'core:carrying_basket','install',CONTENT)).toMatch(/already/);
  const removed=applyCommands(installed,[{action:'module.remove',entityId:first.id,moduleId:'core:carrying_basket'}]).world;
  expect(removed.workers[0].capacity).toBe(6);
  expect(removed.signals.at(-1)?.type).toBe('module.removed');
 });
 it('calculates the same capacity effects on an entirely different entity kind',()=>{
  let w=world();
  const camp=createGenericEntity('camp_001','Lumber Camp','core:logging_camp',CONTENT);
  w={...w,entities:[camp]};
  expect(validateModuleChange(w,camp.id,'core:carrying_basket','install',CONTENT)).toMatch(/incompatible/);
  w=changeModule(w,camp.id,'core:log_storage','install',CONTENT);
  expect(moduleEffects(w.entities[0],CONTENT).storageCapacity).toBe(50);
  w=changeModule(w,camp.id,'core:log_storage','remove',CONTENT);
  w=changeModule(w,camp.id,'core:improved_log_storage','install',CONTENT);
  expect(moduleEffects(w.entities[0],CONTENT).storageCapacity).toBe(500);
 });
 it('uses generic inventory operations to craft content data and rejects unaffordable recipes',()=>{
  const w=createCivilizationWorld();
  expect(quantity(w.stocks,'core:wood',CONTENT)).toBe(12);
  const next=craftRecipe(w.stocks,'core:make_stone_axe',1,CONTENT);
  expect(next.wood).toBe(10);expect(next.stone).toBe(3);expect(next['core:stone_axe']).toBe(1);
  const crafted=applyCommands(w,[{action:'craft',recipeId:'core:make_stone_axe',amount:1}]);
  expect(crafted.world.stocks).toEqual(next);
  expect(crafted.world.signals.at(-1)?.type).toBe('recipe.completed');
  expect(()=>craftRecipe({wood:0,stone:0},'core:make_stone_axe',1,CONTENT)).toThrow(/Not enough/);
 });
 it('shares command validation between UI and Python and supports bounded ordered signals',()=>{
  const w=world();
  const cmd={action:'module.install' as const,entityId:'npc_000001',moduleId:'core:carrying_basket'};
  expect(COMMANDS.validate(w,cmd)).toBeNull();
  expect(COMMANDS.authorized(cmd,'npc','npc_000001')).toBe(true);
  expect(COMMANDS.authorized(cmd,'npc','npc_000002')).toBe(false);
  const next=COMMANDS.execute(w,[cmd]).world;
  const seen:string[]=[];const bus=new SignalBus();
  const unsubscribe=bus.subscribe('module.installed',event=>seen.push(event.entityId??''));
  bus.publish(next.signals);
  expect(seen).toEqual(['npc_000001']);
  unsubscribe();bus.publish(next.signals);expect(seen).toHaveLength(1);
  expect(next.signals.map(s=>s.sequence)).toEqual([...next.signals.map(s=>s.sequence)].sort((a,b)=>a-b));
 });
});
