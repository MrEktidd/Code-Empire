import type { ScriptFile } from './engine/types';

export const STARTER_CODE = `# CODE EMPIRE — FIRST AUTOMATION
# This is real Python, running in your browser.
# Edit this script, then press RUN SCRIPT.
#
# Available API:
# world.workers()          -> list of worker objects
# world.stockpile("wood")  -> amount in settlement storage
# world.assign(id, "wood") -> standing forestry job
# world.assign(id, "stone")-> standing mining job
# world.assign(id, "idle") -> clear standing job
# world.order(id, "deposit")
# world.order(id, "gather", resource="wood")
# world.order(id, "move", x=6, y=3)
# world.log("message")
#
# Persistent dict "memory" survives script executions.

def on_tick(world, memory):
    for worker in world.workers():
        if worker.role == "Forester":
            world.assign(worker.id, "wood")
        elif worker.role == "Miner":
            world.assign(worker.id, "stone")

    memory["runs"] = memory.get("runs", 0) + 1
    if memory["runs"] == 1:
        print("Our first automation has begun!")
    if world.stockpile("wood") >= 60:
        world.log("Forestry target reached: 60 wood.")
`;

export function starterScripts(): ScriptFile[] {
  return [{ path: 'main.py', source: STARTER_CODE, enabled: true, interval: 6, nextRun: 0, memory: {} }];
}
