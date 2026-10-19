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
 await page.getByRole('button',{name:'OUTPUT',exact:true}).click();
 await expect(page.getByRole('region',{name:'genesis.py'}).getByText(/Define exactly three founders/)).toBeVisible({timeout:75000});
 await expect(page.locator('.workbench-notice-warning')).toContainText('Command rejected');
 await page.getByRole('button',{name:/Open controller output/}).click();
 await expect(page.getByRole('button',{name:'OUTPUT',exact:true})).toHaveClass(/selected/);
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
     const r=indexedDB.open('code-empire-v0340');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
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

test('theme editor applies live colors, can undo/revert and saves across reloads',async({page})=>{
 await enterWorkbench(page);
 await initializeWorld(page);
 await page.getByRole('button',{name:'Settings'}).click();
 await page.getByRole('tab',{name:'Theme'}).click();
 await expect(page.getByRole('heading',{name:'Theme Editor'})).toBeVisible();
 const original=await page.locator('.game-shell').evaluate(el=>getComputedStyle(el).getPropertyValue('--ce-color-accent').trim());
 const input=page.getByRole('textbox',{name:'Accent hex value',exact:true});
 await input.fill('#f0b440');
 await expect(page.locator('.game-shell')).toHaveCSS('--ce-color-accent','#f0b440');
 await page.getByRole('button',{name:/Undo/}).click();
 await expect(page.locator('.game-shell')).toHaveCSS('--ce-color-accent',original);
 await page.getByRole('button',{name:/Redo/}).click();
 await expect(page.locator('.game-shell')).toHaveCSS('--ce-color-accent','#f0b440');
 await page.getByRole('button',{name:'Revert to Saved'}).click();
 await expect(page.locator('.game-shell')).toHaveCSS('--ce-color-accent',original);
 await input.fill('#cf66aa');
 await page.getByRole('button',{name:'Save Theme'}).click();
 await expect(page.getByText('✓ Saved')).toBeVisible();
 await page.reload();
 await expect(page.locator('html')).toHaveCSS('--ce-color-accent','#cf66aa');
 page.on('dialog',dialog=>{void dialog.accept();});
 await enterWorkbench(page);
 await initializeWorld(page);
 await page.getByRole('button',{name:'Settings'}).click();
 await page.getByRole('tab',{name:'Theme'}).click();
 await expect(page.getByRole('textbox',{name:'Accent hex value',exact:true})).toHaveValue('#cf66aa');
 await page.getByRole('button',{name:'Reset Defaults'}).click();
 await page.getByRole('button',{name:'Save Theme'}).click();
 await expect(page.locator('html')).toHaveCSS('--ce-color-accent',original);
});

test('unsaved theme changes are discarded on closing settings',async({page})=>{
 await enterWorkbench(page);
 await initializeWorld(page);
 await page.getByRole('button',{name:'Settings'}).click();
 await page.getByRole('tab',{name:'Theme'}).click();
 await page.getByRole('textbox',{name:'Accent hex value',exact:true}).fill('#dd5511');
 await expect(page.locator('.game-shell')).toHaveCSS('--ce-color-accent','#dd5511');
 await page.getByRole('button',{name:'Close Settings'}).click();
 await expect(page.locator('.game-shell')).toHaveCSS('--ce-color-accent','#76cfa2');
});

test('Quick Open, workspace presets and saved layouts are accessible from the workbench',async({page})=>{
 test.setTimeout(90000);
 await test.step('Boot workbench and open a script from Quick Open',async()=>{
  await enterWorkbench(page);
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog',{name:'Quick Open'})).toBeVisible();
  const search=page.getByRole('textbox',{name:'Search commands, scripts and windows'});
  await search.fill('main.py');
  await search.press('Enter');
  await expect(page.getByRole('dialog',{name:'Quick Open'})).toHaveCount(0);
  await expect(page.locator('.desktop-window[aria-label="main.py"]')).toBeVisible();
 });
 await test.step('Apply Research preset and tile windows',async()=>{
  await page.getByRole('button',{name:'Arrange workspace'}).click();
  await page.getByRole('menuitem',{name:'Research workspace'}).click();
  const mobile=await page.evaluate(()=>window.matchMedia('(max-width: 760px)').matches);
  if(!mobile)await expect(page.locator('.desktop-window[aria-label="Python Reference"]')).toBeVisible();
  else await expect(page.locator('.desktop-window[aria-label="Python Reference"]')).toHaveCount(1);
  await expect(page.locator('.desktop-window[aria-label="Game API"]')).toBeVisible();
  await page.getByRole('button',{name:'Arrange workspace'}).click();
  await page.getByRole('menuitem',{name:'Tile windows'}).click();
  await expect(page.locator('.desktop-window[aria-label="Game API"]')).toBeVisible();
 });
 await test.step('Continue campaign restores the saved layout',async()=>{
  await page.getByRole('button',{name:/MENU/}).last().click();
  await expect(page.getByRole('button',{name:/CONTINUE CAMPAIGN/})).toBeEnabled();
  await page.getByRole('button',{name:/CONTINUE CAMPAIGN/}).click();
  const mobile=await page.evaluate(()=>window.matchMedia('(max-width: 760px)').matches);
  if(mobile){
   await expect(page.locator('.taskbar')).toContainText('Game API');
   const api=page.locator('.taskbar').getByRole('button',{name:'Game API'});
   if(!(await api.getAttribute('class'))?.includes('focused'))await api.click();
  }
  await expect(page.locator('.desktop-window[aria-label="Game API"]')).toBeVisible();
 });
});

test('General Settings controls UI size and offers theme recovery',async({page})=>{
 await enterWorkbench(page);
 await initializeWorld(page);
 await page.getByRole('button',{name:'Settings'}).click();
 await page.getByRole('combobox',{name:'Interface size'}).selectOption('1.15');
 await expect(page.locator('html')).toHaveCSS('--ce-ui-scale','1.15');
 await page.getByRole('button',{name:'Emergency: Restore Default Theme'}).click();
 await expect(page.getByRole('status').filter({hasText:'Appearance restored'})).toBeVisible();
 await page.reload();
 await expect(page.locator('html')).toHaveCSS('--ce-ui-scale','1.15');
});

test('main menu can recover default appearance even with an unreadable saved theme',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>localStorage.setItem('code-empire-ui-theme-v1',
  JSON.stringify({version:1,overrides:{'--ce-color-background':'#ffffff','--ce-color-text':'#ffffff','--ce-color-accent':'#ffffff'}})));
 await page.reload();
 await expect(page.locator('html')).toHaveCSS('--ce-color-text','#ffffff');
 await page.getByRole('button',{name:/RESET APPEARANCE/}).click();
 await expect(page.locator('html')).toHaveCSS('--ce-color-text','#d6e5e5');
});

test('a continuous Python founder follows an explicit route and performs timed harvests',async({page})=>{
 test.setTimeout(150000);
 await enterWorkbench(page);
 await initializeWorld(page);
 await page.getByRole('button',{name:/OPEN GENESIS.PY/}).click();
 const editor=page.locator('.controller-view .cm-content');
 await editor.fill('founders = [\n    {"name": "Adam", "sex": "male"},\n    {"name": "Eve", "sex": "female"},\n    {"name": "Ada", "sex": "female"},\n]\nEmpire.seed_population(founders)\n');
 await page.getByRole('button',{name:/RUN SCRIPT/}).click();
 await expect(page.locator('.founder-card')).toHaveCount(3,{timeout:75000});
 // The editor stays above Overview on desktop; close it to expose the cards.
 await page.getByRole('button',{name:'Close genesis.py'}).click();
 await page.locator('.founder-card').first().click();
 await page.getByRole('combobox',{name:'Execution mode'}).selectOption('continuous');
 await page.locator('.controller-view .cm-content').fill(
  'while True:\n    if self.x < 7:\n        self.move("east")\n    elif self.y > 4:\n        self.move("north")\n    elif self.can_harvest():\n        job = self.harvest()\n        await world.job_completed(job["job_id"])\n    else:\n        await world.wait_ticks(2)\n'
 );
 await page.getByRole('button',{name:/START \/ STEP/}).click();
 await page.getByRole('button',{name:'3×'}).click();
 await expect(page.locator('.inspector-stat').filter({hasText:'Location'})).toContainText('7, 4',{timeout:30000});
 await expect(page.locator('.inspector-stat').filter({hasText:'Carrying'})).toContainText('6 / 6',{timeout:30000});
 await page.getByRole('button',{name:'Ⅱ'}).click();
});
