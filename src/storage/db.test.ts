import {describe,it,expect} from 'vitest';
import {createWorld} from '../engine/world';
import {starterControllers} from '../defaults';
import {validCampaign} from './db';
describe('campaign file validation',()=>{
 const valid=()=>({schema:7,savedAt:Date.now(),world:createWorld(),controllers:starterControllers(),lessonIndex:0});
 it('accepts the generated v0.3 campaign',()=>expect(validCampaign(valid())).toBe(true));
 it('rejects malformed tile data',()=>{
  const x=valid();x.world.tiles[0].x=100;expect(validCampaign(x)).toBe(false);
 });
 it('rejects duplicate controller IDs',()=>{
  const x=valid();x.controllers[1].id=x.controllers[0].id;expect(validCampaign(x)).toBe(false);
 });
 it('rejects invalid script memory and impossible positions',()=>{
  const x=valid();x.world.workers[0].x=-1;expect(validCampaign(x)).toBe(false);
 });
});
