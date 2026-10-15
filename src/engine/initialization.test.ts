import {describe,it,expect} from 'vitest';
import {createPendingWorld,createCivilizationWorld,applyCommands,stepWorld} from './world';
import {runControllers,validateCommand,dueControllers} from './scheduler';
import {initialControllers,starterControllers} from '../defaults';
import {createWorld} from './world';
import {validCampaign,migrateCampaign} from '../storage/db';
describe('v0.3 initialization lifecycle',()=>{
 it('starts with no world, no people, and three reserved housing places',()=>{
  const w=createPendingWorld(99);
  expect(w).toMatchObject({phase:'dormant',housingCapacity:3,tick:0,tiles:[],workers:[],buildings:[]});
  expect(stepWorld(w)).toBe(w);
  expect(dueControllers(w,initialControllers())).toEqual([]);
 });
 it('generates a deterministic uninhabited clearing only once',()=>{
  const waiting=createPendingWorld(99);
  const first=applyCommands(waiting,[{action:'initialize'}]);
  expect(waiting.phase).toBe('dormant');
  expect(first.world).toEqual(createCivilizationWorld(99));
  expect(first.world.workers).toHaveLength(0);
  expect(first.world.buildings).toHaveLength(0);
  expect(first.world.housingCapacity).toBe(3);
  expect(validateCommand(first.world,{action:'initialize'})).toMatch(/already/);
  expect(applyCommands(first.world,[{action:'initialize'}]).world).toEqual(first.world);
 });
 it('accepts initialization from global Python controller, rejects entity controllers',async()=>{
  const w=createPendingWorld(),cs=initialControllers();
  const ok=await runControllers(w,cs,cs,async()=>({commands:[{action:'initialize'}],memory:{},output:[]}),true);
  expect(ok.world.phase).toBe('active');
  const invalid=await runControllers(w,starterControllers(),starterControllers().slice(0,1),
    async()=>({commands:[{action:'initialize'}],memory:{},output:[]}),true);
  expect(invalid.world.phase).toBe('dormant');
  expect(invalid.entries[0].output).toContain('Rejected command: Only a global controller can initialize the simulation');
 });
 it('validates dormant campaigns and migrates valid v0.2 saves without losing names',()=>{
  const waiting={schema:3,savedAt:Date.now(),world:createPendingWorld(),controllers:initialControllers(),lessonIndex:0};
  expect(validCampaign(waiting)).toBe(true);
  const old=createWorld();
  const converted=migrateCampaign({schema:2,savedAt:Date.now(),world:{...old,schema:2,phase:undefined,housingCapacity:undefined},
    controllers:starterControllers(),lessonIndex:2});
  expect(converted?.world.workers.map(w=>w.name)).toEqual(['Ada','Bram','Cora']);
  expect(converted?.world.phase).toBe('active');
  expect(converted?.lessonIndex).toBe(2);
 });
});
