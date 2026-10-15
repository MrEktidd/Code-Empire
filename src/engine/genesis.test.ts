import {describe,it,expect} from 'vitest';
import {applyCommands,createCivilizationWorld,createPendingWorld,validateFounderBatch,worldSnapshot} from './world';
import {runControllers,validateCommand,dueControllers} from './scheduler';
import {genesisController,ensureFounderControllers,initialControllers} from '../defaults';
import {validCampaign,migrateCampaign} from '../storage/db';
const founders=[{name:'Adam',sex:'male'},{name:'Eve',sex:'female'},{name:'Ada',sex:'female'}];
const genesis=()=>createCivilizationWorld();
describe('Genesis Protocol v0.3.1',()=>{
 it('teaches the player to add a third dictionary',()=>{
  const script=genesisController();
  expect(script.source).toContain('{"name": "Adam", "sex": "male"}');
  expect(script.source).toContain('{"name": "Eve", "sex": "female"}');
  expect(script.source).not.toContain('{"name": "Alex", "sex": "female"},\n]');
  expect(validateFounderBatch(genesis(),founders.slice(0,2))).toMatch(/third dictionary/);
 });
 it('creates exactly three named people, records founding and does not mutate previous state',()=>{
  const original=genesis();const before=JSON.stringify(original);
  const r=applyCommands(original,[{action:'seed_population',founders}]);
  expect(JSON.stringify(original)).toBe(before);
  expect(r.world.workers.map(x=>x.name)).toEqual(['Adam','Eve','Ada']);
  expect(r.world.workers.map(x=>x.sex)).toEqual(['male','female','female']);
  expect(r.world.genesisArchive.map(x=>x.name)).toEqual(['Adam','Eve','Ada']);
  expect(r.world.workers.map(x=>x.id)).toEqual(['npc_000001','npc_000002','npc_000003']);
  expect(worldSnapshot(r.world).workers[0].name).toBe('Adam');
  const next=applyCommands(r.world,[{action:'seed_population',founders}]);
  expect(next.world).toEqual(r.world);
  expect(next.messages.some(x=>x.includes('Genesis rejected'))).toBe(true);
 });
 it('rejects malformed batches atomically, capacity limit and dormant requests',()=>{
  const w=genesis();
  for(const bad of [null,{},founders.slice(0,2),[...founders,founders[0]],
    [...founders.slice(0,2),{name:'  ',sex:'female'}],
    [...founders.slice(0,2),{name:'aDa',sex:'female'}],
    [...founders.slice(0,2),{name:'Jules',sex:'other'}],
    [...founders.slice(0,2),{name:'Alex',sex:'male',power:99}]])
    expect(validateCommand(w,{action:'seed_population',founders:bad})).not.toBeNull();
  expect(validateFounderBatch({...w,housingCapacity:2},founders)).toMatch(/housing/);
  expect(validateFounderBatch(createPendingWorld(),founders)).toMatch(/Initialize/);
  expect(applyCommands(w,[{action:'seed_population',founders:founders.slice(0,2)}]).world).toEqual(w);
 });
 it('only global scripts may seed; produces personal controllers and immutable identities',async()=>{
  const world=genesis();const cs=[genesisController()];
  const run=async()=>({commands:[{action:'seed_population' as const,founders}],output:[],memory:{}});
  const result=await runControllers(world,cs,cs,run,true);
  expect(result.world.workers).toHaveLength(3);
  expect(result.controllers.filter(x=>x.ownerType==='npc')).toHaveLength(3);
  expect(result.controllers.find(x=>x.ownerEntityId==='npc_000001')?.source).toContain('Hello, Empire!');
  expect(ensureFounderControllers(result.controllers,result.world)).toHaveLength(result.controllers.length);
  const npc={...genesisController(),id:'unauthorized',ownerType:'npc' as const,ownerEntityId:null};
  const invalid=await runControllers(world,[npc],[npc],run,true);
  expect(invalid.world.workers).toHaveLength(0);
  expect(invalid.entries[0].output.join(' ')).toMatch(/Only a global controller/);
  expect(dueControllers(world,[{...cs[0],enabled:true,nextRunTick:0}])).toEqual([]);
 });
 it('validates stored records and upgrades v0.3.0 zero-population campaigns',()=>{
  const world=applyCommands(genesis(),[{action:'seed_population',founders}]).world;
  const records=ensureFounderControllers([genesisController(),...initialControllers()],world);
  const campaign={schema:4,savedAt:Date.now(),world,controllers:records,lessonIndex:0};
  expect(validCampaign(campaign)).toBe(true);
  expect(validCampaign({...campaign,world:{...world,genesisArchive:[...world.genesisArchive,world.genesisArchive[0]]}})).toBe(false);
  const old={schema:3,savedAt:Date.now(),world:{...createCivilizationWorld(),schema:3,genesisArchive:undefined},controllers:initialControllers(),lessonIndex:0};
  const updated=migrateCampaign(old);
  expect(updated?.world.genesisArchive).toEqual([]);
  expect(updated?.world.workers).toHaveLength(0);
 });
});
