import {describe,it,expect} from 'vitest';
import {PYTHON_TOPICS} from '../../content/python/topics';
import {GAME_DOCUMENTS} from '../../games/code-empire/docs';
import {findDoc,docKey} from './types';
describe('document link integrity',()=>{
 it('all documentation links resolve to a real article',()=>{
  const all=[...PYTHON_TOPICS,...GAME_DOCUMENTS];
  for(const article of all)for(const link of article.related){
   expect(findDoc(all,docKey(link.scope,link.id)),article.title+' -> '+link.id).toBeDefined();
  }
 });
 it('has portable Python explanations, not world-specific examples',()=>{
  for(const topic of PYTHON_TOPICS){
   expect(topic.example).not.toMatch(/npc_0|Ada|Bram|Cora|First Light|world\.workers|woodcutt/i);
   expect(topic.summary.length).toBeGreaterThan(8);
  }
  expect(PYTHON_TOPICS.length).toBeGreaterThanOrEqual(60);
 });
});
