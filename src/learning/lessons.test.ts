import {describe,expect,it} from 'vitest';
import {lessonCompleted,LESSONS} from './lessons';
import {createWorld} from '../engine/world';
import {starterControllers} from '../defaults';
describe('learn-to-code lessons',()=>{
 it('has an ordered challenge and hint for every lesson',()=>{
  expect(LESSONS.length).toBeGreaterThanOrEqual(7);
  for(const l of LESSONS){expect(l.goal.length).toBeGreaterThan(10);expect(l.hint.length).toBeGreaterThan(10);}
 });
 it('only advances the printing lesson after real output',()=>{
  const w=createWorld(),c=starterControllers();
  expect(lessonCompleted(0,w,c,[])).toBe(false);
  expect(lessonCompleted(0,w,c,[{tick:0,controllerId:'ctrl_000001',filename:'ada.py',success:true,output:['Hello, Empire!'],commands:0}])).toBe(true);
 });
});
