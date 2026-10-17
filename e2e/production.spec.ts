import {test,expect} from '@playwright/test';

/** Tests the actual bundled Pages build, not Vite's development server.
 * Protects against a successful CI build that publishes broken script URLs.
 */
test('deployed-path bundle boots without a blank screen or uncaught errors',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/Code-Empire/');
 await expect(page.getByRole('button',{name:/NEW EMPIRE/})).toBeVisible({timeout:15000});
 await expect(page.locator('.menu-root')).toBeVisible();
 await page.getByRole('button',{name:/NEW EMPIRE/}).click();
 await page.getByRole('textbox',{name:'Boot command'}).fill('Empire.boot()');
 await page.getByRole('textbox',{name:'Boot command'}).press('Enter');
 await expect(page.locator('.game-shell')).toBeVisible();
 await expect(page.locator('.sidebar.ce-scroll')).toHaveCSS('scrollbar-color','rgb(83, 143, 118) rgb(18, 38, 53)');
 expect(errors).toEqual([]);
});
