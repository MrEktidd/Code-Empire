import { applyCommands, stepWorld, worldSnapshot } from './world';
import type { Controller, ExecutionEntry, ScriptCommand, ScriptResult, WorldState } from './types';

export type Executor = (source: string, snapshot: ReturnType<typeof worldSnapshot>,
  memory: Record<string, unknown>, ownerEntityId: string | null) => Promise<ScriptResult>;
export type TickResult = { world: WorldState; controllers: Controller[]; entries: ExecutionEntry[] };

export function dueControllers(world: WorldState, controllers: Controller[], limit = 16): Controller[] {
  return controllers.filter(c => c.enabled && c.nextRunTick <= world.tick
    && (c.ownerEntityId === null || ![...world.workers, ...world.buildings].some(
      e => e.id === c.ownerEntityId && e.controlMode !== 'independent')))
    .sort((a,b) => a.nextRunTick - b.nextRunTick || a.id.localeCompare(b.id))
    .slice(0, limit);
}
export async function runControllers(world: WorldState, controllers: Controller[], selected: Controller[],
  executor: Executor): Promise<TickResult> {
  const snapshot = worldSnapshot(world);
  const changes = new Map<string, Controller>();
  const allCommands: { id: string; command: ScriptCommand }[] = [];
  const entries: ExecutionEntry[] = [];
  for (const controller of selected) {
    const next = { ...controller, nextRunTick: world.tick + controller.intervalTicks,
      executions: controller.executions + 1 };
    try {
      const result = await executor(controller.source, snapshot, controller.memory, controller.ownerEntityId);
      if (!result || !Array.isArray(result.commands) || !Array.isArray(result.output) ||
        !result.memory || typeof result.memory !== 'object' || Array.isArray(result.memory))
        throw new Error('Script returned an invalid result');
      const memoryJson = JSON.stringify(result.memory);
      if (memoryJson.length > 32768) throw new Error('Persistent memory exceeds 32 KB');
      next.memory = JSON.parse(memoryJson) as Record<string, unknown>;
      next.lastStatus = 'success' as const; next.lastError = null;
      next.lastOutput = result.output.slice(0, 40).map(String);
      for (const command of result.commands.slice(0, 64)) allCommands.push({ id: controller.id, command });
      entries.push({ tick: world.tick, controllerId: controller.id, filename: controller.filename,
        success: true, output: next.lastOutput, commands: result.commands.length });
    } catch (error) {
      next.lastStatus = 'error' as const; next.lastError = String(error);
      next.lastOutput = [];
      entries.push({ tick: world.tick, controllerId: controller.id, filename: controller.filename,
        success: false, output: [], error: String(error), commands: 0 });
    }
    changes.set(controller.id, next);
  }
  // First valid controller command for an entity wins per tick. Log commands never conflict.
  const claimed = new Set<string>();
  const accepted: ScriptCommand[] = [];
  for (const { id, command } of allCommands) {
    if (!command || typeof command !== 'object') continue;
    const target = command.action === 'farm_mode' ? command.buildingId :
      command.action === 'log' ? null : command.workerId;
    if (target && claimed.has(target)) {
      const entry = entries.find(e => e.controllerId === id);
      entry?.output.push('Command conflict: ' + target + ' was already ordered this tick.');
      continue;
    }
    if (target) claimed.add(target);
    accepted.push(command);
  }
  const { world: updated, messages } = applyCommands(world, accepted);
  if (messages.length) entries.push({ tick: world.tick, controllerId:'engine', filename:'Simulation',
    success:true, output:messages, commands:0 });
  return { world: updated, controllers: controllers.map(c => changes.get(c.id) ?? c), entries };
}
export async function advanceTick(world: WorldState, controllers: Controller[], executor: Executor): Promise<TickResult> {
  const updated = stepWorld(world);
  return runControllers(updated, controllers, dueControllers(updated, controllers), executor);
}
