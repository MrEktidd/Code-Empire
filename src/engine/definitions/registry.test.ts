import {describe,it,expect} from 'vitest';
import {DefinitionRegistry,definePack} from './registry';
import {CORE_PACK,CONTENT} from '../../games/code-empire/content/base';
import {createGenericEntity} from '../entities/identity';
import {createCivilizationWorld} from '../world';
import {addRelation} from '../entities/relationships';
describe('v0.3.2 data registries and entity composition',()=>{
 it('loads built-in JSON definitions and correctly resolves cross-references',()=>{
  expect(CONTENT.item('core:wood').inventory_key).toBe('wood');
  expect(CONTENT.recipe('core:make_stone_axe').outputs[0].item).toBe('core:stone_axe');
  expect(CONTENT.entity('core:logging_camp').module_slots?.storage).toBe(1);
  expect(CONTENT.module('core:carrying_basket').slot).toBe('utility');
  expect(Object.isFrozen(CONTENT.module('core:carrying_basket'))).toBe(true);
 });
 it('accepts an additional material, item, recipe and entity from a separate pack without core changes',()=>{
  const extra=definePack({id:'demo',version:'1',dependencies:['core']},data=>data.extend([
   {type:'material',id:'demo:quartz',display_name:'Quartz'},
   {type:'item',id:'demo:quartz_chunk',display_name:'Quartz Chunk',stack_size:25,material:'demo:quartz'},
   {type:'recipe',id:'demo:polish_quartz',display_name:'Polish Quartz',inputs:[{item:'demo:quartz_chunk',amount:2}],outputs:[{item:'demo:quartz_chunk',amount:1}],duration:4},
   {type:'entity',id:'demo:quartz_mine',display_name:'Quartz Mine',kind:'workplace',technical_components:['location','inventory'],module_slots:{storage:1}}
  ]));
  const registry=new DefinitionRegistry([extra,CORE_PACK]);
  expect(registry.list('material').some(d=>d.id==='demo:quartz')).toBe(true);
  expect(createGenericEntity('mine_001','Quartz Mine','demo:quartz_mine',registry).definitionId).toBe('demo:quartz_mine');
  expect(registry.packageVersions().demo).toBe('1');
 });
 it('rejects incorrect references, duplicate namespaced IDs and pack dependency loops',()=>{
  const manifest={id:'bad',version:'1',dependencies:['core']};
  expect(()=>new DefinitionRegistry([{manifest,definitions:[{type:'recipe',id:'bad:nope',display_name:'Nope',inputs:[{item:'bad:unknown',amount:1}],outputs:[{item:'core:wood',amount:1}],duration:1}]},CORE_PACK])).toThrow(/missing item reference/);
  expect(()=>new DefinitionRegistry([{manifest,definitions:[{type:'material',id:'bad:gold',display_name:'Gold'},{type:'material',id:'bad:gold',display_name:'Duplicate'}]},CORE_PACK])).toThrow(/duplicate definition/);
  expect(()=>new DefinitionRegistry([{manifest:{id:'a',version:'1',dependencies:['b']},definitions:[]},{manifest:{id:'b',version:'1',dependencies:['a']},definitions:[]}])).toThrow(/Circular/);
  expect(()=>new DefinitionRegistry([{manifest:{id:'x',version:'1',dependencies:['missing']},definitions:[]}])).toThrow(/Missing content pack/);
 });
 it('keeps specialized state while supporting referenced generic locations and relationships',()=>{
  let world=createCivilizationWorld();
  const planet=createGenericEntity('planet_001','Test Planet','core:planet',CONTENT);
  const camp=createGenericEntity('camp_001','Log Camp','core:logging_camp',CONTENT);
  world={...world,entities:[planet,camp]};
  world=addRelation(world,{from:camp.id,to:planet.id,kind:'located_in'});
  expect(world.relationships).toHaveLength(1);
  expect(()=>addRelation(world,{from:planet.id,to:camp.id,kind:'located_in'})).toThrow(/cycle/);
  expect(world.entities[0].technicalState).toEqual({});
  expect(CONTENT.entity(camp.definitionId).kind).toBe('workplace');
 });
});
