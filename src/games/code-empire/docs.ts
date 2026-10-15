import {API} from '../../docs/api';
import type {DocArticle} from '../../platform/documentation/types';
const categories:Record<string,string>={
 'Empire.initialize':'Simulation Setup','print':'Python Output','memory':'Controller State','world.tick':'Simulation Time',
 'world.workers':'World Queries','world.buildings':'World Queries','world.get':'World Queries','world.stockpile':'World Queries',
 'world.assign':'Worker Commands','world.order':'Worker Commands','self.order':'Worker Commands','self.assign':'Worker Commands',
 'world.log':'Python Output','self.set_mode':'Building Commands'};
const related:Record<string,string[]>={
 'Empire.initialize':['functions','parameters'],'print':['printing','strings'],'memory':['dicts','variables'],'world.workers':['lists','for-loops'],
 'world.buildings':['lists','for-loops'],'world.get':['none','variables'],
 'world.stockpile':['ints','if-elif'],'world.assign':['functions','parameters'],'world.order':['functions','parameters'],
 'self.order':['functions','parameters'],'self.assign':['functions','parameters'],
 'world.tick':['operators','ints'],'self.set_mode':['strings','functions']};
/** The game-specific adapter owns contextual links into the portable Python handbook. */
const contextual:Record<string,string>={
 'Empire.initialize':'This is a Python [[function call|python:functions]] available during startup. It generates the world only once. Read about [[arguments|python:parameters]] for other game APIs.',
 'print':'This uses Python’s built-in [[print()|python:printing]] function. For formatted output, see [[f-strings|python:fstrings]].',
 'memory':'This value is a Python [[dictionary|python:dicts]]. Use [[variables|python:variables]] and key lookups to preserve simple information.',
 'world.tick':'Time counters are [[integers|python:ints]]; use [[operators|python:operators]] to calculate schedules.',
 'world.workers':'The result is a Python [[list|python:lists]]. Use a [[for loop|python:for-loops]] to examine its elements.',
 'world.buildings':'The result is a Python [[list|python:lists]] of objects. Use [[for loops|python:for-loops]] to inspect it.',
 'world.get':'An unsuccessful lookup returns [[None|python:none]], so check the value using an [[if statement|python:if-elif]].',
 'world.stockpile':'The quantity is an [[integer|python:ints]]; use [[comparisons|python:comparisons]] to test thresholds.',
 'world.assign':'The command is a Python [[method call|python:classes]] with arguments; read about [[function parameters|python:parameters]].',
 'world.order':'The command uses [[function arguments|python:parameters]] and [[strings|python:strings]] to describe the action.',
 'world.log':'The message should be a [[string|python:strings]]; [[f-strings|python:fstrings]] can format values.',
 'self.assign':'The selected value is a [[string|python:strings]] passed as a [[function argument|python:parameters]].',
 'self.order':'Use [[strings|python:strings]] to name tasks, and [[function parameters|python:parameters]] for options.',
 'self.set_mode':'The mode is a Python [[string|python:strings]]. See [[function arguments|python:parameters]] for usage.'
};
export const GAME_DOCUMENTS:DocArticle[]=API.map(e=>({
 id:e.name.replaceAll('.','-'),scope:'game',category:categories[e.name]??'Other',
 title:e.name,signature:e.signature,summary:e.description,body:e.note+'\n\n'+(contextual[e.name]??''),
 example:e.example,tip:'Game-world changes are submitted as validated commands; direct mutations of snapshots have no effect.',
 returns:e.returns,
 related:(related[e.name]??[]).map(id=>({scope:'python' as const,id,label:id.replaceAll('-',' ')}))
}));
