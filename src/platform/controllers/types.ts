export type Checkpoint={savedAt:number;source:string};
export type ControllerBase<OwnerKind extends string=string>={
 id:string;ownerEntityId:string|null;ownerType:OwnerKind;
 filename:string;source:string;notes:string;
 enabled:boolean;intervalTicks:number;nextRunTick:number;
 memory:Record<string,unknown>;lastStatus:'idle'|'success'|'error';
 lastError:string|null;lastOutput:string[];executions:number;
 checkpoints?:Checkpoint[];
};
export type PythonResult<Command=unknown>={commands:Command[];memory:Record<string,unknown>;output:string[]};
