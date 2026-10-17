import manifest from './pack.json';
import materials from './materials.json';
import items from './items.json';
import recipes from './recipes.json';
import entities from './entities.json';
import modules from './modules.json';
import {DefinitionRegistry} from '../../../..//engine/definitions/registry';
import type {ContentPack} from '../../../..//engine/definitions/types';
/** Registered official content; contributors add their own packs without editing simulation rules. */
export const CORE_PACK:ContentPack={manifest,definitions:[...materials,...items,...recipes,...entities,...modules]};
export const CONTENT=new DefinitionRegistry([CORE_PACK]);
