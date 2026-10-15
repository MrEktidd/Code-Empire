import {API} from '../../docs/api';
import type {DocArticle} from '../../platform/documentation/types';
const categories:Record<string,string>={
 'print':'Python Output','memory':'Controller State','world.tick':'Simulation Time',
 'world.workers':'World Queries','world.buildings':'World Queries','world.get':'World Queries','world.stockpile':'World Queries',
 'world.assign':'Worker Commands','world.order':'Worker Commands','self.order':'Worker Commands','self.assign':'Worker Commands',
 'world.log':'Python Output','self.set_mode':'Building Commands'};
const related:Record<string,string[]>={
 'print':['printing','strings'],'memory':['dicts','variables'],'world.workers':['lists','for-loops'],
 'world.buildings':['lists','for-loops'],'world.get':['none','variables'],
 'world.stockpile':['ints','if-elif'],'world.assign':['functions','parameters'],'world.order':['functions','parameters'],
 'self.order':['functions','parameters'],'self.assign':['functions','parameters'],
 'world.tick':['operators','ints'],'self.set_mode':['strings','functions']};
export const GAME_DOCUMENTS:DocArticle[]=API.map(e=>({
 id:e.name.replaceAll('.','-'),scope:'game',category:categories[e.name]??'Other',
 title:e.name,signature:e.signature,summary:e.description,body:e.note,
 example:e.example,tip:'Game-world changes are submitted as validated commands; direct mutations of snapshots have no effect.',
 returns:e.returns,
 related:(related[e.name]??[]).map(id=>({scope:'python' as const,id,label:id.replaceAll('-',' ')}))
}));
