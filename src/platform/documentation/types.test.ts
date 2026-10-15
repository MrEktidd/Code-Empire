import {describe,it,expect} from 'vitest';
import {docKey,findDoc,searchDocs,navigateDocTabs,inlineDocLinks,MAX_OPEN_DOC_TABS} from './types';
import type {DocArticle} from './types';
const data:DocArticle[]=[
{id:'lists',scope:'python',category:'Collections',title:'Lists',summary:'Store ordered values',body:'Append to a list',example:'x=[0,1]',tip:'Zero indexed',related:[]},
{id:'ints',scope:'python',category:'Types',title:'Integers',summary:'Whole numbers',body:'42',example:'a=42',tip:'Use int',related:[]}
];
describe('documentation registry',()=>{
it('resolves stable links and searches content',()=>{
 expect(findDoc(data,docKey('python','lists'))?.title).toBe('Lists');
 expect(searchDocs(data,'append','All')).toHaveLength(1);
 expect(searchDocs(data,'','Types')[0].id).toBe('ints');
});
});

describe('documentation navigation',()=>{
 it('preserves the original when opening linked terms',()=>{
  expect(navigateDocTabs(['python:lists'],'python:lists','python:ints','new')).toEqual(
   {tabs:['python:lists','python:ints'],activeDoc:'python:ints'});
 });
 it('focuses existing tabs instead of making duplicates',()=>{
  expect(navigateDocTabs(['python:lists','python:ints'],'python:ints','python:lists','new')).toEqual(
   {tabs:['python:lists','python:ints'],activeDoc:'python:lists'});
 });
 it('replaces the active tab for normal sidebar navigation',()=>{
  expect(navigateDocTabs(['python:lists','python:ints'],'python:ints','python:dicts','current')).toEqual(
   {tabs:['python:lists','python:dicts'],activeDoc:'python:dicts'});
 });
 it('limits the maximum number of open articles',()=>{
  let tabs=['python:start'],active='python:start';
  for(let i=0;i<50;i++){const n=navigateDocTabs(tabs,active,'python:topic'+i,'new');tabs=n.tabs;active=n.activeDoc;}
  expect(tabs).toHaveLength(MAX_OPEN_DOC_TABS);
  expect(tabs[tabs.length-1]).toBe('python:topic49');
 });
 it('parses explicit inline cross-reference markers',()=>{
  expect(inlineDocLinks('See [[int|python:ints]] and [[world.get|game:world-get]].')).toEqual([
   {label:'int',scope:'python',id:'ints'},{label:'world.get',scope:'game',id:'world-get'}]);
 });
});
