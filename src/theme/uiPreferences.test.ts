import {describe,it,expect} from 'vitest';
import {UI_SCALES} from './uiPreferences';
describe('UI scale allowed values',()=>{
 it('offers bounded readable choices without arbitrary page zoom',()=>{
  expect(UI_SCALES).toEqual([.85,1,1.15,1.3]);
  expect(Math.max(...UI_SCALES)).toBeLessThanOrEqual(1.3);
 });
});
