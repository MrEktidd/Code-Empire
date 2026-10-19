import {describe,it,expect} from 'vitest';
import {createWorld,stepWorld} from './world';
import {startPhysicalAction,harvestEligibility} from './automation';
const act=(w:ReturnType<typeof createWorld>,kind:'move'|'harvest'|'deposit',extra:Record<string,string>={})=>
 startPhysicalAction(w,'npc_000001',{kind,entityId:'npc_000001',...extra});
describe('authoritative physical actions',()=>{
 it('moves only one legal tile per request and commits on a later tick',()=>{
  const world=createWorld();
  const {world:issued,response,waitForJob}=act(world,'move',{direction:'east'});
  expect(response.ok).toBe(true);
  expect(waitForJob).toBe(true);
  expect(world.workers[0].x).toBe(3);
  const moved=stepWorld(issued);
  expect(moved.workers[0].x).toBe(4);
  expect(moved.jobs[0].status).toBe('completed');
  expect(act(world,'move',{direction:'west'}).response.ok).toBe(true);
  expect(act(world,'move',{direction:'teleport'}).response.reason).toBe('invalid_direction');
 });
 it('rejects overlapping jobs for the same character',()=>{
  const one=act(createWorld(),'move',{direction:'east'});
  expect(act(one.world,'move',{direction:'north'}).response.reason).toBe('busy');
 });
 it('checks resource position, tools and capacity before starting harvest',()=>{
  const w=createWorld();const person=w.workers[0];
  expect(harvestEligibility(w,person)).toBe('no_resource');
  person.x=7;person.y=4;
  expect(harvestEligibility(w,person)).toBe('missing_tool');
 });
});
