# Content packs: contributor guide (v0.3.2)

Official and contributed game content uses **data definitions**. Do not change `src/engine/world.ts` just to add a compatible material, item, recipe, entity type, or module.

## Built-in JSON content
Inspect `src/games/code-empire/content/base/`. A pack has a `pack.json` manifest with its `id`, `version`, and optional `dependencies` array. The index imports each JSON definition file and constructs a `DefinitionRegistry`.

All definitions require a lowercase namespaced `id` such as `myaddon:copper_ore`, a `type`, and a `display_name`. Supported types:

- `material`: optional simple `properties`
- `item`: positive `stack_size`, optional material reference and inventory key
- `recipe`: input/output ingredient arrays (`item` ID and positive `amount`) and positive `duration`
- `entity`: kind, declared `technical_components`, optional module-slot limits
- `module`: slot, allowed entity kinds and effect definitions (`carry_capacity`, `inventory_capacity`, `capability`)

A sample module:

```json
{"type":"module","id":"myaddon:large_pack","display_name":"Large Pack",
 "slot":"utility","allowed_kinds":["person"],
 "effects":[{"kind":"carry_capacity","amount":8}]}
```

The pack loader rejects duplicate IDs, unknown references, invalid fields, missing dependencies, and dependency cycles. Module effects must be supported by a simulation system to have any behavior.

## Factorio-inspired typed registration
For authors developing with TypeScript rather than JSON, the API is:

```ts
import {definePack} from './engine/definitions/registry';

const pack=definePack({id:'myaddon',version:'1.0.0',dependencies:['core']},data=>{
 data.extend([
  {type:'material',id:'myaddon:quartz',display_name:'Quartz'}
 ]);
});
```

Register the pack in a registry alongside its dependencies. `data.extend` registers new definitions; it **does not** inherit another entity type. This helper runs as compiled developer code, not as an arbitrary untrusted user-submitted script. Future community package-loading and permissions need a separate security pass.

## Engineering guidance
Keep all identifiers stable. Avoid introducing new entity subclasses for existing gameplay behavior. Use a typed simulation system and command handler when content truly needs new behavior. When adding an API command, update runtime documentation and tests. New content articles are generated from validated definitions automatically.

Run `npm run check` and `npm run build` before submitting a PR; CI runs desktop/mobile browser tests and Python-reference example checks.
