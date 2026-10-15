import {describe,it,expect} from 'vitest';
import {executeBatch} from './executeBatch';
describe('generic task queue',()=>{
 it('isolates failed tasks and executes the others in order',async()=>{
 const ran:string[]=[];
 const results=await executeBatch([{id:'a',source:'',context:{name:'A'},memory:{}},{id:'b',source:'',context:{name:'B'},memory:{}},{id:'c',source:'',context:{name:'C'},memory:{}}],
 async(_source,context,memory)=>{ran.push(context.name);if(context.name==='B')throw new Error('bad');return {commands:[],memory,output:[]};});
 expect(ran).toEqual(['A','B','C']);expect(results.map(r=>r.success)).toEqual([true,false,true]);
 });
});
