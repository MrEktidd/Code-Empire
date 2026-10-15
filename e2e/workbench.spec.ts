import {test,expect} from '@playwright/test';
test('new game opens the workbench and both documentation libraries',async({page})=>{
 await page.goto('/');
 await expect(page.getByText(/EARLY ALPHA · v0.2.5/).first()).toBeVisible();
 await page.getByRole('button',{name:/NEW EMPIRE/}).click();
 await expect(page.locator('.desktop-window').first()).toBeVisible();
 await page.getByRole('button',{name:'Python Reference'}).click();
 await expect(page.getByRole('heading',{name:'How Python runs'})).toBeVisible();
 await page.getByRole('button',{name:/Lists/}).click();
 await expect(page.getByRole('heading',{name:/Lists/})).toBeVisible();
 await page.getByRole('button',{name:/Pop out/}).click();
 await expect(page.locator('.desktop-window')).toHaveCount(5);
 await page.getByRole('button',{name:'Game API'}).click();
 await expect(page.getByText('CODE-EMPIRE GAME API').first()).toBeVisible();
});
test('continuous simulation saves progress before returning to menu',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/NEW EMPIRE/}).click();
 await page.getByRole('button',{name:'3×'}).click();
 await page.waitForTimeout(1400);
 const current=await page.evaluate(async()=>{
   const db=await new Promise<IDBDatabase>((resolve,reject)=>{
     const r=indexedDB.open('code-empire-v2');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
   });
   const tick=await new Promise<number>((resolve,reject)=>{
     const tx=db.transaction('campaigns','readonly');const req=tx.objectStore('campaigns').get('autosave');
     req.onsuccess=()=>resolve(req.result?.world?.tick??-1);req.onerror=()=>reject(req.error);
   });db.close();return tick;
 });
 expect(current).toBeGreaterThan(0);
 await page.getByRole('button',{name:/MENU/}).last().click();
 await page.reload();
 await expect(page.getByRole('button',{name:/CONTINUE CAMPAIGN/})).toBeEnabled();
 await page.getByRole('button',{name:/CONTINUE CAMPAIGN/}).click();
 await expect(page.locator('.game-shell')).toBeVisible();
});

test('Python worker executes an NPC controller end-to-end',async({page})=>{
 test.setTimeout(120000);
 await page.goto('/');
 await page.getByRole('button',{name:/NEW EMPIRE/}).click();
 await page.getByRole('button',{name:'Scripts'}).click();
 await page.getByRole('button',{name:/ada.py/}).first().click();
 await page.getByRole('button',{name:/RUN SCRIPT/}).click();
 await page.getByRole('button',{name:'OUTPUT'}).click();
 await expect(page.getByText('Hello, Empire!',{exact:false}).last()).toBeVisible({timeout:75000});
});
