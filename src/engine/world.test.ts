import { describe, expect, it } from 'vitest';
import { applyCommands, catchUp, createWorld, stepWorld, worldSnapshot } from './world';
import { HEIGHT, WIDTH } from './types';
describe('Code Empire deterministic simulation v0.2', () => {
  it('creates a seeded world with controllers-compatible entities', () => {
    const world = createWorld(42);
    expect(world.tiles).toHaveLength(WIDTH * HEIGHT);
    expect(world.workers).toHaveLength(3);
    expect(world.buildings).toHaveLength(1);
    expect(createWorld(42)).toEqual(world);
    expect(createWorld(43).tiles).not.toEqual(world.tiles);
  });
  it('does not mutate previous states',()=>{
    const world=createWorld();
    const next=stepWorld(world);
    expect(world.tick).toBe(0);expect(next.tick).toBe(1);
    expect(next.workers).not.toBe(world.workers);
  });
  it('automates forestry and mining with standing orders',()=>{
    let w=applyCommands(createWorld(),[
      {action:'assign',workerId:'npc_000001',resource:'wood'},
      {action:'assign',workerId:'npc_000002',resource:'stone'}]).world;
    for(let i=0;i<96;i++)w=stepWorld(w);
    expect(w.stocks.wood).toBeGreaterThan(12);
    expect(w.stocks.stone).toBeGreaterThan(6);
  });
  it('controls the farm independently',()=>{
    let w=applyCommands(createWorld(),[{action:'farm_mode',buildingId:'farm_000001',mode:'rest'}]).world;
    expect(w.buildings[0].mode).toBe('rest');
    for(let i=0;i<24;i++)w=stepWorld(w);
    expect(w.stocks.food).toBe(42);
  });
  it('caps offline progress and matches ordinary ticks',()=>{
    const initial=applyCommands(createWorld(),[{action:'assign',workerId:'npc_000001',resource:'wood'}]).world;
    const offline=catchUp(initial,11*60000);
    let manual=initial;
    for(let i=0;i<11;i++)manual=stepWorld(manual);
    expect(offline.world).toEqual(manual);
    expect(catchUp(initial,900*60000).hours).toBe(336);
  });
  it('rejects invalid orders',()=>{
    const result=applyCommands(createWorld(),[
      {action:'assign',workerId:'unknown',resource:'wood'},
      {action:'order',workerId:'npc_000001',task:'move',x:-1,y:3}]);
    expect(result.messages).toHaveLength(2);
    expect(result.world.workers[0].task).toBeNull();
    expect(worldSnapshot(result.world).workers[0].id).toBe('npc_000001');
  });
});
