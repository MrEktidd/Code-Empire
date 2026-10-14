import { describe, expect, it } from 'vitest';
import { applyCommands, catchUp, createWorld, stepWorld, worldSnapshot } from './world';
import { HEIGHT, WIDTH } from './types';

describe('Code Empire deterministic simulation', () => {
  it('creates a playable seeded world', () => {
    const world = createWorld(42);
    expect(world.tiles).toHaveLength(WIDTH * HEIGHT);
    expect(world.workers).toHaveLength(3);
    expect(createWorld(42)).toEqual(world);
    expect(createWorld(43).tiles).not.toEqual(world.tiles);
  });

  it('never mutates the previous state when advancing', () => {
    const initial = createWorld();
    const next = stepWorld(initial);
    expect(initial.tick).toBe(0);
    expect(next.tick).toBe(1);
    expect(next.tiles).not.toBe(initial.tiles);
  });

  it('executes engine-managed forestry and mining policies', () => {
    let state = applyCommands(createWorld(), [
      { action: 'assign', workerId: 'w1', resource: 'wood' },
      { action: 'assign', workerId: 'w2', resource: 'stone' }
    ]).world;
    for (let i = 0; i < 96; i++) state = stepWorld(state);
    expect(state.stocks.wood).toBeGreaterThan(12);
    expect(state.stocks.stone).toBeGreaterThan(6);
  });

  it('caps catch-up time and keeps it equivalent to ordinary ticks', () => {
    const initial = applyCommands(createWorld(), [{ action: 'assign', workerId: 'w1', resource: 'wood' }]).world;
    const caught = catchUp(initial, 11 * 60_000);
    let manual = initial;
    for (let i = 0; i < 11; i++) manual = stepWorld(manual);
    expect(caught.world).toEqual(manual);
    expect(catchUp(initial, 900 * 60_000).hours).toBe(336);
  });

  it('validates unknown workers and out-of-range orders', () => {
    const initial = createWorld();
    const result = applyCommands(initial, [
      { action: 'assign', workerId: 'not-real', resource: 'wood' },
      { action: 'order', workerId: 'w1', task: 'move', x: -20, y: 5 }
    ]);
    expect(result.messages).toHaveLength(2);
    expect(result.world.workers[0].task).toBeNull();
    expect(worldSnapshot(initial).workers[0].id).toBe('w1');
  });
});
