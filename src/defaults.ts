import type { Controller } from './engine/types';
const npc = (id: string, owner: string, filename: string, source: string): Controller => ({
  id, ownerEntityId: owner, ownerType: 'npc', filename, source, notes: '',
  enabled: false, intervalTicks: 6, nextRunTick: 1, memory: {},
  lastStatus: 'idle', lastError: null, lastOutput: [], executions: 0
});
export function starterControllers(): Controller[] {
  return [
    npc('ctrl_000001','npc_000001','ada.py',
      '# Ada is your first programmable settler.\n# Start with the Learn Python window!\n\ndef on_tick(self, world, memory):\n    print("Hello, Empire!")\n'),
    npc('ctrl_000002','npc_000002','bram.py',
      '# Bram is a miner. Customize his behavior.\n\ndef on_tick(self, world, memory):\n    self.order("gather", resource="stone")\n'),
    npc('ctrl_000003','npc_000003','cora.py',
      '# Cora awaits your instructions.\n\ndef on_tick(self, world, memory):\n    pass\n'),
    {
      id:'ctrl_000004', ownerEntityId:'farm_000001', ownerType:'farm',
      filename:'first_light_farm.py', source:'# Farms can produce food or rest.\n\ndef on_tick(self, world, memory):\n    self.set_mode("food")\n',
      notes:'Food production is calculated once every game day.', enabled:true,
      intervalTicks:24, nextRunTick:24, memory:{}, lastStatus:'idle', lastError:null, lastOutput:[], executions:0
    },
    {
      id:'ctrl_000005', ownerEntityId:null, ownerType:'global', filename:'main.py',
      source:'# Global scripts can coordinate multiple entities.\n# Enable automatic execution whenever you are ready.\n\ndef on_tick(world, memory):\n    pass\n',
      notes:'Global scripts receive world and memory, but no self object.',
      enabled:false, intervalTicks:12, nextRunTick:1, memory:{}, lastStatus:'idle',
      lastError:null, lastOutput:[], executions:0
    }
  ];
}

/** Only a global controller exists before founding. The population is intentionally zero. */
export function initialControllers(): Controller[] {
  return [{
    id:'ctrl_000005',ownerEntityId:null,ownerType:'global',filename:'main.py',
    source:'# CIVILIZATION INITIATIVE // Simulation initialization\n# Run this Python file to generate your first world.\n\nEmpire.initialize()\n',
    notes:'Empire.initialize() is a one-time command. Running it again will not reset the world.',
    enabled:false,intervalTicks:12,nextRunTick:1,memory:{},
    lastStatus:'idle',lastError:null,lastOutput:[],executions:0
  }];
}
