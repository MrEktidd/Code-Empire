import type {ControllerBase,PythonResult} from '../platform/controllers/types';
import type {GenericEntity} from './entities/identity';
import type {EntityRelation} from './entities/relationships';
import type {SimSignal} from './events/bus';
export const WORLD_SCHEMA = 5;
export const WIDTH = 16;
export const HEIGHT = 11;
export type Resource = 'wood' | 'stone' | 'food';
export type Ground = 'meadow' | 'forest' | 'quarry' | 'farm' | 'stockpile' | 'water';
export type Task = { kind: 'gather' | 'deposit' | 'move'; x: number; y: number; resource?: Resource };
export type Tile = { x: number; y: number; ground: Ground; remaining: number };
export type FounderRecord = {id:string;name:string;sex:'male'|'female';createdTick:number};
export type Worker = {
  id: string; definitionId:string; installedModules:Record<string,string[]>; name: string; role: string; x: number; y: number; sex?: 'male'|'female';
  carried: number; carrying: 'wood' | 'stone' | null; capacity: number;
  policy: 'wood' | 'stone' | null; task: Task | null;
  organizationId: string | null; controlMode: 'independent' | 'delegated' | 'event_only';
};
export type Building = {
  id: string; definitionId:string; installedModules:Record<string,string[]>; name: string; type: 'farm'; x: number; y: number;
  mode: 'food' | 'rest'; organizationId: string | null;
  controlMode: 'independent' | 'delegated' | 'event_only';
};
export type WorldState = {
  schema: number; seed: number; tick: number;
  phase: 'dormant' | 'active'; housingCapacity: number;
  tiles: Tile[]; workers: Worker[]; buildings: Building[]; entities:GenericEntity[];
  relationships:EntityRelation[]; signals:SimSignal[]; genesisArchive:FounderRecord[];
  stocks: Record<string, number>; totalHarvested: number; events: string[];
};
export type ScriptCommand = {
  action: 'assign' | 'order' | 'log' | 'farm_mode' | 'initialize' | 'seed_population' | 'module.install' | 'module.remove' | 'craft';
  workerId?: string; buildingId?: string; resource?: string;
  task?: string; mode?: string; message?: string; x?: number; y?: number; founders?:unknown;
  entityId?:string;moduleId?:string;recipeId?:string;amount?:number;
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
