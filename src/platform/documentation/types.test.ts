import {describe,it,expect} from 'vitest';
import {docKey,findDoc,searchDocs} from './types';
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
