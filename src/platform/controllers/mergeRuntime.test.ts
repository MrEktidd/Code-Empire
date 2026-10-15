import {describe,it,expect} from 'vitest';
import {starterControllers} from '../../defaults';
import {mergeRuntimeControllers} from './mergeRuntime';
describe('asynchronous controller result merging',()=>{
 it('never overwrites edits or a newly changed schedule',()=>{
  const old=starterControllers(),fresh=old.map(c=>c.id===old[0].id?{...c,source:'fresh code',notes:'my note',intervalTicks:20,nextRunTick:99}:c);
  const ended=old.map(c=>c.id===old[0].id?{...c,source:'old code',memory:{runs:1},executions:1,lastStatus:'success' as const,nextRunTick:10}:c);
  const next=mergeRuntimeControllers(fresh,ended,old)[0];
  expect(next.source).toBe('fresh code');
  expect(next.notes).toBe('my note');expect(next.nextRunTick).toBe(99);
  expect(next.memory.runs).toBe(1);expect(next.executions).toBe(1);
 });
});
