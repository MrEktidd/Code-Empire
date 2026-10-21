import {describe,it,expect} from 'vitest';
import {createCivilizationWorld,establishFounders,stepWorld,worldSnapshot} from './world';
import {startPhysicalAction} from './automation';
import {applyCommands} from './commands/registry';
import {CONTENT} from '../games/code-empire/content/base';
import type {WorldState} from './types';
const people=[{name:'Ada',sex:'female' as const},{name:'Bram',sex:'male' as const},{name:'Cora',sex:'female' as const}];
const founded=()=>establishFounders(createCivilizationWorld(42),people);
describe('0.3.5 First Stockpile',()=>{
 it('starts the three founders without tools and zero gathered stock',()=>{
  const w=founded();expect(w.workers).toHaveLength(3);
  expect(w.workers.every(p=>Object.keys(p.installedModules).length===0)).toBe(true);
  expect(w.stocks.sticks).toBe(0);expect(w.stocks.berries).toBe(0);expect(w.stocks.stone).toBe(0);
  expect(w.settlementUnlocked).toBe(false);
 });
 it('collects berries without a tool and observes real duration',()=>{
  let w=founded();w.workers[0].x=5;w.workers[0].y=6;
  const r=startPhysicalAction(w,w.workers[0].id,{kind:'harvest',entityId:w.workers[0].id});
  expect(r.response.ok).toBe(true);expect(r.world.jobs[0].finishTick).toBe(2);
  w=stepWorld(r.world);expect(w.workers[0].carried).toBe(0);
  w=stepWorld(w);expect(w.workers[0].carrying).toBe('berries');
 });
 it('keeps tree cutting tool-gated',()=>{
  const w=founded();w.workers[0].x=7;w.workers[0].y=4;
  expect(startPhysicalAction(w,w.workers[0].id,{kind:'harvest',entityId:w.workers[0].id}).response.reason).toBe('missing_tool');
 });
 it('requires stocks simultaneously and preserves the unlock after spending',()=>{
  let w:WorldState={...founded(),stocks:{...founded().stocks,sticks:18,stone:12,berries:14}};
  w=stepWorld(w);expect(w.settlementUnlocked).toBe(false);
  w={...w,stocks:{...w.stocks,berries:15}};w=stepWorld(w);
  expect(w.settlementUnlocked).toBe(true);
  const built=applyCommands(w,[{action:'build_shelter'}]);
  expect(built.world.leanToCount).toBe(1);expect(built.world.housingCapacity).toBe(5);
  expect(built.world.stocks.sticks).toBe(6);
  expect(built.world.settlementUnlocked).toBe(true);
 });
 it('recruits only after shelter and respects its housing capacity',()=>{
  let w:WorldState={...founded(),settlementUnlocked:true,stocks:{...founded().stocks,sticks:18,stone:12,berries:15}};
  expect(applyCommands(w,[{action:'recruit_worker',name:'Dara',sex:'female'}]).messages[0]).toMatch(/Rejected/);
  w=applyCommands(w,[{action:'build_shelter'}]).world;
  w=applyCommands(w,[{action:'recruit_worker',name:'Dara',sex:'female'},{action:'recruit_worker',name:'Eran',sex:'male'}]).world;
  expect(w.workers).toHaveLength(5);
  expect(applyCommands(w,[{action:'recruit_worker',name:'Fay',sex:'female'}]).messages[0]).toMatch(/Rejected/);
  expect(worldSnapshot(w).settlement.unlocked).toBe(true);
 });
 it('registers the three introductory items with existing icons',()=>{
  expect(CONTENT.item('core:berries').icon).toBe('02-food/berries.png');
  expect(CONTENT.item('core:sticks').icon).toBe('01-materials/sticks.png');
  expect(CONTENT.item('core:stone').icon).toBe('01-materials/stone.png');
 });
});
