export const WORLD_SCHEMA = 1;
export const WIDTH = 16;
export const HEIGHT = 11;

export type Resource = 'wood' | 'stone' | 'food';
export type Ground = 'meadow' | 'forest' | 'quarry' | 'farm' | 'stockpile' | 'water';
export type Task = { kind: 'gather' | 'deposit' | 'move'; x: number; y: number; resource?: Resource };
export type Tile = { x: number; y: number; ground: Ground; remaining: number };
export type Worker = {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  carried: number;
  carrying: 'wood' | 'stone' | null;
  capacity: number;
  policy: 'wood' | 'stone' | null;
  task: Task | null;
};
export type WorldState = {
  schema: number;
  seed: number;
  tick: number;
  tiles: Tile[];
  workers: Worker[];
  stocks: Record<Resource, number>;
  totalHarvested: number;
  events: string[];
};
export type ScriptFile = {
  path: string;
  source: string;
  enabled: boolean;
  interval: number;
  nextRun: number;
  memory: Record<string, unknown>;
};
export type ScriptCommand = {
  action: 'assign' | 'order' | 'log';
  workerId?: string;
  resource?: string;
  task?: string;
  message?: string;
  x?: number;
  y?: number;
};
export type ScriptResult = {
  commands: ScriptCommand[];
  memory: Record<string, unknown>;
  output: string[];
};
export type Campaign = {
  schema: number;
  savedAt: number;
  world: WorldState;
  scripts: ScriptFile[];
};
