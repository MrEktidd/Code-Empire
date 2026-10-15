import {describe,it,expect,vi} from 'vitest';
import {SaveCoordinator} from './SaveCoordinator';
describe('SaveCoordinator',()=>{
 it('writes latest dirty snapshot and flushes on demand',async()=>{
   let state=1;const writes:number[]=[];
   const c=new SaveCoordinator(()=>state,async s=>{writes.push(s);},()=>{});
   state=2;c.markDirty();await c.flush();expect(writes).toEqual([2]);
   state=3;c.markDirty();await c.flush();expect(writes).toEqual([2,3]);await c.dispose();
 });
 it('never allows an older write to finish after a newer write',async()=>{
   let state=1;const commits:number[]=[];let release!:()=>void;
   const c=new SaveCoordinator(()=>state,async s=>{if(s===1)await new Promise<void>(res=>{release=res;});commits.push(s);},()=>{});
   c.markDirty();const first=c.flush();await Promise.resolve();await Promise.resolve();
   state=2;c.markDirty();const second=c.flush();release();await Promise.all([first,second]);
   expect(commits).toEqual([1,2]);await c.dispose();
 });
 it('periodically flushes continuous dirty state',async()=>{
   vi.useFakeTimers();
   try{
     let state=0;const committed:number[]=[];
     const c=new SaveCoordinator(()=>state,async x=>{committed.push(x);},()=>{},1000,2000);c.start();
     for(let i=0;i<10;i++){state=i;c.markDirty();await vi.advanceTimersByTimeAsync(250);}
     await c.flush();expect(committed.length).toBeGreaterThan(0);
     await c.dispose();
   }finally{vi.useRealTimers();}
 });
});
