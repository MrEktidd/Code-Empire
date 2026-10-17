/** Data definitions are immutable catalogs, not live simulation objects. */
export type DefinitionId=string;
export type CoreComponent='inventory'|'location'|'programmable'|'production'|'ownership';
export type DefinitionBase={type:string;id:string;display_name:string;description?:string};
export type MaterialDefinition=DefinitionBase&{type:'material';properties?:Record<string,string|number|boolean>};
export type ItemDefinition=DefinitionBase&{type:'item';stack_size:number;material?:string;inventory_key?:string};
export type Ingredient={item:string;amount:number};
export type RecipeDefinition=DefinitionBase&{type:'recipe';inputs:Ingredient[];outputs:Ingredient[];duration:number};
export type EntityKind='person'|'workplace'|'vehicle'|'organization'|'workforce'|'location'|'machine'|'celestial';
export type EntityDefinition=DefinitionBase&{type:'entity';kind:EntityKind;technical_components:CoreComponent[];module_slots?:Record<string,number>};
export type ModuleEffect={kind:'carry_capacity'|'inventory_capacity'|'capability';amount?:number;capability?:string};
export type ModuleDefinition=DefinitionBase&{type:'module';slot:string;allowed_kinds:EntityKind[];effects:ModuleEffect[]};
export type Definition=MaterialDefinition|ItemDefinition|RecipeDefinition|EntityDefinition|ModuleDefinition;
export type DefinitionType=Definition['type'];
export type ContentManifest={id:string;version:string;dependencies?:string[]};
export type ContentPack={manifest:ContentManifest;definitions:unknown[]};
export const CORE_COMPONENTS:readonly CoreComponent[]=['inventory','location','programmable','production','ownership'];
export const ENTITY_KINDS:readonly EntityKind[]=['person','workplace','vehicle','organization','workforce','location','machine','celestial'];
