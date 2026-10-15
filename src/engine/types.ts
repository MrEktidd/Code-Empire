export const WORLD_SCHEMA = 2;
export const WIDTH = 16;
export const HEIGHT = 11;
export type Resource = 'wood' | 'stone' | 'food';
export type Ground = 'meadow' | 'forest' | 'quarry' | 'farm' | 'stockpile' | 'water';
export type Task = { kind: 'gather' | 'deposit' | 'move'; x: number; y: number; resource?: Resource };
export type Tile = { x: number; y: number; ground: Ground; remaining: number };
export type Worker = {
  id: string; name: string; role: string; x: number; y: number;
  carried: number; carrying: 'wood' | 'stone' | null; capacity: number;
  policy: 'wood' | 'stone' | null; task: Task | null;
  organizationId: string | null; controlMode: 'independent' | 'delegated' | 'event_only';
};
export type Building = {
  id: string; name: string; type: 'farm'; x: number; y: number;
  mode: 'food' | 'rest'; organizationId: string | null;
  controlMode: 'independent' | 'delegated' | 'event_only';
};
export type WorldState = {
  schema: number; seed: number; tick: number;
  tiles: Tile[]; workers: Worker[]; buildings: Building[];
  stocks: Record<Resource, number>; totalHarvested: number; events: string[];
};
export type Controller = {
  id: string; ownerEntityId: string | null; ownerType: 'npc' | 'farm' | 'global';
  filename: string; source: string; notes: string;
  enabled: boolean; intervalTicks: number; nextRunTick: number;
  memory: Record<string, unknown>;
  lastStatus: 'idle' | 'success' | 'error';
  lastError: string | null;
  checkpoints?: { savedAt: number; source: string }[];
  lastOutput: string[];
  executions: number;
};
export type ScriptCommand = {
  action: 'assign' | 'order' | 'log' | 'farm_mode';
  workerId?: string; buildingId?: string; resource?: string;
  task?: string; mode?: string; message?: string; x?: number; y?: number;
};
export type ScriptResult = {
  commands: ScriptCommand[]; memory: Record<string, unknown>; output: string[];
};
export type ExecutionEntry = {
  tick: number; controllerId: string; filename: string; success: boolean;
  output: string[]; error?: string; commands: number;
};
export type Campaign = {
  schema: number; savedAt: number; world: WorldState;
  controllers: Controller[]; lessonIndex: number;
};
