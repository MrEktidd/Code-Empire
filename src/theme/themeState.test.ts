import {describe,it,expect} from 'vitest';
import {THEME_TOKENS,isThemeValue,validateThemeOverrides} from './themeState';
describe('theme preference input validation',()=>{
 it('only permits known color tokens and safe #rrggbb colors',()=>{
  expect(isThemeValue('--ce-color-accent','#20Ab90')).toBe(true);
  expect(isThemeValue('--ce-color-accent','red; position:absolute')).toBe(false);
  expect(validateThemeOverrides({'--ce-color-accent':'#20Ab90','--bad':'#ffffff'})).toEqual({'--ce-color-accent':'#20ab90'});
 });
 it('clamps editable dimensions through whitelist validation',()=>{
  expect(isThemeValue('--ce-panel-radius','12px')).toBe(true);
  expect(isThemeValue('--ce-panel-radius','2000px')).toBe(false);
  expect(isThemeValue('--ce-panel-radius','calc(1px + 2px)')).toBe(false);
  expect(isThemeValue('--ce-scrollbar-size','9px')).toBe(true);
  expect(isThemeValue('--ce-scrollbar-size','100px')).toBe(false);
  expect(new Set(THEME_TOKENS.map(t=>t.id)).size).toBe(THEME_TOKENS.length);
 });
});
