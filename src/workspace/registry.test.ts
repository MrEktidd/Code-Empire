import {describe,expect,it} from 'vitest';
import {closeWindow,focusWindow,newWorkspace,parseWorkspace,popoutDocument,updateWindow,upsertWindow,applyWorkspacePreset,arrangeWorkspace,resumeWorkspace} from './registry';
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

describe('Workbench organization',()=>{
 it('tiles windows without changing identities or document tabs',()=>{
  const original=upsertWindow(newWorkspace(),'python');
  const doc=original.windows.find(w=>w.id==='python')!;
  const layout=arrangeWorkspace(original,'tile',{width:1200,height:850});
  expect(layout.windows).toHaveLength(original.windows.length);
  expect(layout.windows.find(w=>w.id==='python')?.docTabs).toEqual(doc.docTabs);
  expect(layout.windows.filter(w=>!w.minimized).every(w=>w.x>=0&&w.y>=0)).toBe(true);
 });
 it('presets keep scripts and other windows rather than closing them',()=>{
  const base=upsertWindow(newWorkspace(),'controller','ctrl_example');
  const next=applyWorkspacePreset(base,'research',{width:1200,height:800});
  expect(next.windows.find(w=>w.id==='controller:ctrl_example')?.minimized).toBe(true);
  expect(next.windows.filter(w=>!w.minimized).map(w=>w.kind)).toEqual(['docs','python']);
 });
 it('restores good windows and discards stale controller refs',()=>{
  const saved=upsertWindow(newWorkspace(),'controller','ctrl_deleted');
  const restored=resumeWorkspace(saved,'active',[]);
  expect(restored.windows.some(w=>w.id==='controller:ctrl_deleted')).toBe(false);
  expect(restored.windows.some(w=>w.id==='world')).toBe(true);
 });
});
