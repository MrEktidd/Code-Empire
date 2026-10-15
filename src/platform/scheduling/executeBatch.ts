/** Game-agnostic execution queue. It knows about tasks, not farms, NPCs or commands. */
export type RunRequest<TContext,TMemory>={id:string;context:TContext;memory:TMemory;source:string};
export type RunOutcome<TMemory,TCommand>={
 id:string;success:boolean;memory?:TMemory;commands:TCommand[];output:string[];error?:string;elapsedMs:number;
};
export async function executeBatch<TContext,TMemory,TCommand>(
 jobs:RunRequest<TContext,TMemory>[],
 execute:(source:string,context:TContext,memory:TMemory)=>Promise<{memory:TMemory;commands:TCommand[];output:string[]}>,
 budgetMs=12000):Promise<RunOutcome<TMemory,TCommand>[]>{
 const results:RunOutcome<TMemory,TCommand>[]=[];
 const start=performance.now();
 for(const job of jobs){
   if(performance.now()-start>=budgetMs)break;
   const began=performance.now();
   try{
     const r=await execute(job.source,job.context,job.memory);
     results.push({id:job.id,success:true,memory:r.memory,commands:r.commands,output:r.output,elapsedMs:performance.now()-began});
   }catch(error){
     results.push({id:job.id,success:false,commands:[],output:[],error:String(error),elapsedMs:performance.now()-began});
   }
 }
 return results;
}
