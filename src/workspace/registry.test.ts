import {describe,expect,it} from 'vitest';
import {closeWindow,focusWindow,newWorkspace,parseWorkspace,popoutDocument,updateWindow,upsertWindow} from './registry';
describe('workspace windows',()=>{
 it('opens and restores the same controller instead of duplicating windows',()=>{
  let s=upsertWindow(newWorkspace(),'controller','ctrl_000001');
  s=updateWindow(s,'controller:ctrl_000001',{minimized:true});
  s=upsertWindow(s,'controller','ctrl_000001');
  expect(s.windows.filter(w=>w.id==='controller:ctrl_000001')).toHaveLength(1);
  expect(s.windows.find(w=>w.id===s.focus)?.minimized).toBe(false);
 });
 it('focuses, persists and closes windows',()=>{
  let s=upsertWindow(newWorkspace(),'docs');
  s=focusWindow(s,'world');
  expect(parseWorkspace(JSON.parse(JSON.stringify(s)))).toEqual(s);
  expect(closeWindow(s,'docs').windows.some(w=>w.id==='docs')).toBe(false);
 });
 it('opens one popout per document, and restores it by ID',()=>{
  let s=popoutDocument(newWorkspace(),'python','lists');
  s=popoutDocument(s,'python','lists');
  expect(s.windows.filter(w=>w.kind==='document')).toHaveLength(1);
  expect(s.focus).toBe('document:python:lists');
 });
 it('rejects corrupt preferences',()=>expect(parseWorkspace({foo:'bar'})).toEqual(newWorkspace()));
});
