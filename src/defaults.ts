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

/** Genesis starts with two editable examples; the player must add a third dictionary. */
export const GENESIS_CONTROLLER_ID='ctrl_genesis_001';
export function genesisController():Controller {
  return {
    id:GENESIS_CONTROLLER_ID,ownerEntityId:null,ownerType:'global',filename:'genesis.py',
    source:'# GENESIS PROTOCOL // Your first people\n# Change Adam and Eve to any names you like.\n# Add a THIRD dictionary in the list below.\n# Example: {"name": "Alex", "sex": "female"}\n\nfounders = [\n    {"name": "Adam", "sex": "male"},\n    {"name": "Eve", "sex": "female"},\n    # Add your third founder here. Remember the comma!\n]\n\nEmpire.seed_population(founders)\n',
    notes:'Define three unique founders with name and sex. Initial housing accommodates exactly three.',
    enabled:false,intervalTicks:24,nextRunTick:1,memory:{},
    lastStatus:'idle',lastError:null,lastOutput:[],executions:0
  };
}
export function ensureGenesisController(controllers:Controller[],active:boolean):Controller[] {
  if(!active||controllers.some(c=>c.id===GENESIS_CONTROLLER_ID||c.filename==='genesis.py'))return controllers;
  return [...controllers,genesisController()];
}
/** Every founder remains a named, independently programmable entity. */
export function founderController(index:number,ownerId:string,name:string):Controller {
  const id='ctrl_'+String(index).padStart(6,'0');
  const slug=name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')||'founder';
  return npc(id,ownerId,slug+'_'+index+'.py',index===1
    ? '# Your first founder: '+name.replace(/[\r\n]/g,' ')+'\n\ndef on_tick(self, world, memory):\n    print("Hello, Empire!")\n'
    : '# Program the actions of '+name.replace(/[\r\n]/g,' ')+'\n\ndef on_tick(self, world, memory):\n    pass\n');
}
export function ensureFounderControllers(controllers:Controller[],world:import('./engine/types').WorldState):Controller[] {
  const existing=new Set(controllers.map(c=>c.ownerEntityId));
  const filenames=new Set(controllers.map(c=>c.filename));
  const additions:Controller[]=[];
  for(const worker of world.workers){
    if(existing.has(worker.id))continue;
    const index=Number(worker.id.replace('npc_',''));
    const c=founderController(index,worker.id,worker.name);
    if(controllers.some(other=>other.id===c.id))continue;
    while(filenames.has(c.filename))c.filename='founder_'+index+'_'+filenames.size+'.py';
    filenames.add(c.filename);existing.add(worker.id);additions.push(c);
  }
  return [...controllers,...additions];
}
