import {test,expect} from '@playwright/test';
async function enterWorkbench(page: import('@playwright/test').Page){
 await page.goto('/');
 await page.getByRole('button',{name:/NEW EMPIRE/}).click();
 await page.getByRole('textbox',{name:'Boot command'}).fill('Empire.boot()');
 await page.getByRole('textbox',{name:'Boot command'}).press('Enter');
 await expect(page.getByRole('button',{name:'Scripts'})).toBeVisible();
}
async function initializeWorld(page: import('@playwright/test').Page){
 await page.getByRole('button',{name:/RUN SCRIPT/}).click();
 await expect(page.getByRole('heading',{name:'INITIALIZING SIMULATION'})).toBeVisible({timeout:75000});
 await expect(page.getByRole('heading',{name:'First Light'})).toBeVisible({timeout:15000});
}
test('genesis rejects incomplete list then creates three archived founders',async({page})=>{
 test.setTimeout(120000);
 await enterWorkbench(page);
 await initializeWorld(page);
 await page.getByRole('button',{name:/OPEN GENESIS.PY/}).click();
 await expect(page.getByText('Founding Population')).toBeVisible();
 await page.getByRole('button',{name:/RUN SCRIPT/}).click();
 await page.getByRole('button',{name:'OUTPUT'}).click();
 await expect(page.getByText(/Define exactly three founders/)).toBeVisible({timeout:75000});
 await page.getByRole('button',{name:'CODE',exact:true}).click();
 const editor=page.locator('.controller-view .cm-content');
 await editor.fill('founders = [\n    {"name": "Adam", "sex": "male"},\n    {"name": "Eve", "sex": "female"},\n    {"name": "Ada", "sex": "female"},\n]\n\nEmpire.seed_population(founders)\n');
 await page.getByRole('button',{name:/RUN SCRIPT/}).click();
 await expect(page.locator('.founder-card')).toHaveCount(3,{timeout:75000});
 await page.locator('.sidebar').getByRole('button',{name:'Genesis Archive',exact:true}).click();
 await expect(page.locator('.genesis-archive .founder-card')).toHaveCount(3);
 await page.locator('.genesis-archive .founder-card').first().click();
 await page.getByRole('button',{name:'INSTALL CARRYING BASKET'}).click();
 await expect(page.getByText('0 / 12',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'REMOVE CARRYING BASKET'}).click();
 await expect(page.getByText('0 / 6',{exact:true})).toBeVisible();
 await page.locator('.sidebar').getByRole('button',{name:'Genesis Archive',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Genesis Archive'})).toBeVisible();
 await expect(page.locator('.genesis-archive .founder-card')).toHaveCount(3);
 await page.getByRole('button',{name:/MENU/}).last().click();
 await page.reload();
 await page.getByRole('button',{name:/CONTINUE CAMPAIGN/}).click();
 await page.locator('.sidebar').getByRole('button',{name:'Genesis Archive',exact:true}).click();
 await expect(page.locator('.genesis-archive .founder-card')).toHaveCount(3);
});
test('new game opens the workbench and both documentation libraries',async({page})=>{
 await enterWorkbench(page);
 await expect(page.locator('.desktop-window').first()).toBeVisible();
 await page.getByRole('button',{name:'Python Reference'}).click();
 await expect(page.getByRole('heading',{name:'How Python runs'})).toBeVisible();
 await page.getByRole('button',{name:/Lists/}).click();
 await expect(page.getByRole('heading',{name:/Lists/})).toBeVisible();
 await page.getByRole('button',{name:/Pop out/}).click();
 await expect(page.locator('.desktop-window')).toHaveCount(3);
 await page.getByRole('button',{name:'Game API'}).click();
 await expect(page.locator('.documentation-toolbar strong').filter({hasText:'GAME API'}).first()).toBeVisible();
});
test('continuous simulation saves progress before returning to menu',async({page})=>{
 await enterWorkbench(page);
 await initializeWorld(page);
 await page.getByRole('button',{name:'3×'}).click();
 await page.waitForTimeout(1400);
 const current=await page.evaluate(async()=>{
   const db=await new Promise<IDBDatabase>((resolve,reject)=>{
     const r=indexedDB.open('code-empire-v032');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
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

test('Python worker initializes a zero-population world end-to-end',async({page})=>{
 test.setTimeout(120000);
 await enterWorkbench(page);
 await initializeWorld(page);
 await expect(page.getByText('0 / 3',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'World'}).click();
 await expect(page.getByText('THE FRONTIER',{exact:false})).toBeVisible();
});

test('in-article Python links open and reuse tabs without losing the source',async({page})=>{
 await enterWorkbench(page);
 await page.getByRole('button',{name:'Python Reference'}).click();
 const browser=page.locator('.documentation-browser').filter({has:page.locator('.documentation-toolbar strong:has-text("PYTHON REFERENCE")')});
 await browser.locator('.documentation-directory').getByRole('button',{name:/Lists/}).click();
 await expect(browser.locator('.documentation-article h2')).toContainText('Lists');
 const tabs=browser.locator('.documentation-tabs .documentation-tab');
 await expect(tabs).toHaveCount(1);
 await browser.locator('.documentation-article').getByRole('button',{name:'int',exact:true}).click();
 await expect(browser.locator('.documentation-article h2')).toContainText('Integers');
 await expect(tabs).toHaveCount(2);
 await browser.locator('.documentation-tabs .documentation-tab').filter({hasText:'Lists'}).locator('button').first().click();
 await expect(browser.locator('.documentation-article h2')).toContainText('Lists');
 await browser.locator('.documentation-article').getByRole('button',{name:'int',exact:true}).click();
 await expect(tabs).toHaveCount(2);
 await expect(browser.locator('.documentation-article-toolbar').getByRole('button',{name:/Pop out/})).toBeVisible();
 await expect(browser.locator('.documentation-article-toolbar').getByRole('button',{name:/Tab/})).toHaveCount(0);
});

test('Game API language links open the Python Reference without closing the API',async({page})=>{
 await enterWorkbench(page);
 await page.getByRole('button',{name:'Game API'}).click();
 const game=page.locator('.documentation-browser').filter({has:page.locator('.documentation-toolbar strong:has-text("GAME API")')});
 await game.locator('.documentation-directory').getByRole('button',{name:'world.workers',exact:true}).click();
 await expect(game.locator('.documentation-article h2')).toContainText('world.workers');
 await game.locator('.documentation-article').getByRole('button',{name:'list',exact:true}).click();
 const python=page.locator('.documentation-browser').filter({has:page.locator('.documentation-toolbar strong:has-text("PYTHON REFERENCE")')});
 await expect(python.locator('.documentation-article h2')).toContainText('Lists');
 await expect(game.locator('.documentation-tab')).toHaveCount(1);
});

test('workbench renders after startup and the navigation sidebar remains scrollable',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.menu-root')).toBeVisible();
 await enterWorkbench(page);
 await expect(page.locator('.game-shell')).toBeVisible();
 await expect(page.locator('.sidebar')).toHaveCSS('overflow-y','auto');
});

test('shared theme colors apply across real scrollable panels and editor',async({page})=>{
 await enterWorkbench(page);
 const color='rgb(83, 143, 118) rgb(18, 38, 53)';
 const rail=page.locator('.sidebar.ce-scroll');
 await expect(rail).toHaveCSS('scrollbar-color',color);
 await expect(page.locator('.game-shell .cm-scroller').first()).toHaveCSS('scrollbar-color',color);
 await initializeWorld(page);
 await expect(page.locator('.overview.ce-scroll')).toHaveCSS('scrollbar-color',color);
 await page.getByRole('button',{name:'Python Reference'}).click();
 await expect(page.locator('.documentation-directory.ce-scroll')).toHaveCSS('scrollbar-color',color);
 await expect(page.locator('.documentation-article.ce-scroll')).toHaveCSS('scrollbar-color',color);
 await expect(page.locator('.overview.ce-scroll')).toHaveCSS('scrollbar-width','thin');
});

test('one central theme token controls all themed scroll containers',async({page})=>{
 await enterWorkbench(page);
 await page.getByRole('button',{name:'Python Reference'}).click();
 const panes=page.locator('.sidebar.ce-scroll, .documentation-directory.ce-scroll, .documentation-article.ce-scroll');
 const before=await panes.evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).scrollbarColor));
 expect(new Set(before).size).toBe(1);
 await page.locator('.game-shell').evaluate(node=>(node as HTMLElement).style.setProperty('--ce-scrollbar-thumb','#e18c55'));
 const after=await panes.evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).scrollbarColor));
 expect(after).toHaveLength(before.length);
 for(const c of after)expect(c).toContain('rgb(225, 140, 85)');
});
