import { chromium } from '/workspace/gemnao/node_modules/@playwright/test/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3008';
const route='/games/onimusha-way-of-the-sword';
try {
for(const width of [375,1440]) {
 const context=await browser.newContext({viewport:{width,height:900}});
 await context.route('**/*',r=>{
 const u=new URL(r.request().url());
 if(u.origin!==base)return r.abort();
 if(u.pathname.startsWith('/api/'))return r.fulfill({json:{rows:[],methods:[]}});
 return r.continue();
 });
 const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+route,{waitUntil:'networkidle'});
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('head link[rel="canonical"]').getAttribute('href'),'https://gemnao.pages.dev'+route);
 assert.equal(await page.locator('head meta[property="og:image"]').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 const save=page.locator('.save-game button');
 await save.click(); assert.equal(await save.getAttribute('aria-pressed'),'true');
 await save.click(); assert.equal(await save.getAttribute('aria-pressed'),'false');
 await page.locator('#save-method a[href="#save-in-game"]').click();
 await page.waitForURL('**#save-in-game');
 await page.locator('#save-faq summary').first().click();
 assert.ok(await page.locator('#save-faq details').first().getAttribute('open')!==null);
 await page.screenshot({path:`/tmp/onimusha-${width}.png`,fullPage:true});
 const links=await page.locator('#save-method a[href^="/"], .article-link-section a[href^="/"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')));
 for(const href of [...new Set(links)]) {const response=await context.request.get(base+href);assert.equal(response.status(),200,href);}
 await page.locator('#save-method a[href="/guide/save-data-backup"]').click(); await page.waitForURL('**/guide/save-data-backup');
 assert.equal(errors.length,0,JSON.stringify(errors));
 console.log(JSON.stringify({width,links:links.length,overflow:false,errors,canonical:true,faq:true,navigation:true}));
 await context.close();
}
} finally {await browser.close();}
