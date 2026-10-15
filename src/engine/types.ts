import type {ControllerBase,PythonResult} from '../platform/controllers/types';
export const WORLD_SCHEMA = 3;
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
  phase: 'dormant' | 'active'; housingCapacity: number;
  tiles: Tile[]; workers: Worker[]; buildings: Building[];
  stocks: Record<Resource, number>; totalHarvested: number; events: string[];
};
export type ScriptCommand = {
  action: 'assign' | 'order' | 'log' | 'farm_mode' | 'initialize';
  workerId?: string; buildingId?: string; resource?: string;
  task?: string; mode?: string; message?: string; x?: number; y?: number;
};
export type Controller = ControllerBase<'npc' | 'farm' | 'global'>;
export type ScriptResult = PythonResult<ScriptCommand>;
export type ExecutionEntry = {
  tick: number; controllerId: string; filename: string; success: boolean;
  output: string[]; error?: string; commands: number; durationMs?: number;
};
export type Campaign = {
  schema: number; savedAt: number; world: WorldState;
  controllers: Controller[]; lessonIndex: number;
};
