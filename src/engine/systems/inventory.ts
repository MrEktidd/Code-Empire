import type {DefinitionRegistry} from '../definitions/registry';
export type Inventory=Record<string,number>;
export function quantity(inventory:Readonly<Inventory>,itemId:string,registry:DefinitionRegistry):number{
 return inventory[registry.inventoryKey(itemId)]??0;
}
export function changeInventory(inventory:Readonly<Inventory>,itemId:string,amount:number,registry:DefinitionRegistry):Inventory{
 if(!Number.isSafeInteger(amount))throw Error('Inventory amount must be a safe integer');
 const key=registry.inventoryKey(itemId),next=(inventory[key]??0)+amount;
 if(!Number.isSafeInteger(next)||next<0)throw Error('Insufficient inventory: '+itemId);
 return {...inventory,[key]:next};
}
export function craftRecipe(inventory:Readonly<Inventory>,recipeId:string,count:number,registry:DefinitionRegistry):Inventory{
 if(!Number.isSafeInteger(count)||count<1||count>100)throw Error('Craft count must be 1–100');
 const recipe=registry.recipe(recipeId);
 for(const input of recipe.inputs)if(quantity(inventory,input.item,registry)<input.amount*count)
  throw Error('Not enough '+input.item+' for '+recipeId);
 let result={...inventory};
 for(const entry of recipe.inputs)result=changeInventory(result,entry.item,-entry.amount*count,registry);
 for(const entry of recipe.outputs)result=changeInventory(result,entry.item,entry.amount*count,registry);
 return result;
}
