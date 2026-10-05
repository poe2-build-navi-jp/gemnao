import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
const output='/tmp/english-search-screenshots';await mkdir(output,{recursive:true});
try {
 for(const width of [375,390,430,1440]) {
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin!==new URL(base).origin||u.pathname.startsWith('/api/')?r.abort():r.continue();});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/en',{waitUntil:'networkidle'});
  const input=page.locator('#english-search');
  const results=page.locator('.english-home-search .search-result-list a');
  for(const q of ['ST-3100001','st-3100001','ST 3100001']) {
   await input.fill(q);assert.equal(await results.first().getAttribute('href'),'/en/games/ace-combat-8/error-st-3100001');
  }
  await input.fill(' WILDS   crash ');
  assert.ok(await results.count()>0);
  const links=await results.evaluateAll(a=>a.map(x=>x.getAttribute('href')));
  assert.ok(links.every(href=>href.startsWith('/en/')));
  await input.fill('wilds nonexistentqzx');assert.equal(await results.count(),0);
  assert.ok(await page.getByText('No matching English guides.',{exact:false}).isVisible());
  await input.fill('ST-3100001');
  const href=await results.first().getAttribute('href');
  await input.focus();await page.keyboard.press('Tab');await page.keyboard.press('Tab');
  assert.ok(await results.first().evaluate(e=>e===document.activeElement));
  await page.keyboard.press('Enter');await page.waitForURL(base+href);
  await page.goBack({waitUntil:'networkidle'});assert.equal(await input.inputValue(),'ST-3100001');
  assert.equal(await results.first().getAttribute('href'),href);
  await page.goForward({waitUntil:'networkidle'});assert.equal(new URL(page.url()).pathname,href);
  await page.goBack({waitUntil:'networkidle'});
  await page.locator('.english-home-search').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${output}/${width}-english-results.png`});
  await page.getByRole('button',{name:'Clear',exact:true}).click();
  assert.equal(await input.inputValue(),'');assert.equal(await results.count(),0);
  assert.equal(new URL(page.url()).searchParams.has('q'),false);
  assert.ok(await input.evaluate(e=>e===document.activeElement));
  await page.reload({waitUntil:'networkidle'});assert.equal(await input.inputValue(),'');
  // Native Japanese search uses the same history persistence without changing ranking.
  await page.goto(base+'/',{waitUntil:'networkidle'});
  const ja=page.getByRole('searchbox',{name:'ゲーム名や症状を検索'});
  await ja.fill('ST-3100001');
  const hit=page.locator('#articles a[href="/games/ace-combat-8/error-st-3100001"]');
  assert.ok((await hit.innerText()).includes('サーバー・接続'));
  await hit.click();await page.waitForURL(base+'/games/ace-combat-8/error-st-3100001');
  assert.ok((await page.locator('.article-label').innerText()).includes('サーバー・接続'));
  await page.goBack({waitUntil:'networkidle'});assert.equal(await ja.inputValue(),'ST-3100001');
  await page.goForward({waitUntil:'networkidle'});await page.goBack({waitUntil:'networkidle'});
  await page.getByRole('button',{name:'クリア',exact:true}).click();assert.equal(await ja.inputValue(),'');
  // Untranslated and translated language choices, including keyboard activation.
  await page.goto(base+'/guide/steam-game-not-launching',{waitUntil:'networkidle'});
  const menu=page.locator('.language-menu');await menu.locator('summary').focus();await page.keyboard.press('Enter');
  for(const [locale,text] of [['en','Not translated'],['zh','暂无翻译'],['es','Sin traducción']]) {
   const link=menu.locator(`a[href="/${locale}"]`);
   assert.ok((await link.innerText()).includes(text));assert.equal(await link.locator('small').getAttribute('lang'),locale);
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${output}/${width}-language-fallback.png`});
  await menu.locator('a[href="/en"]').focus();await page.keyboard.press('Enter');await page.waitForURL(base+'/en');
  await page.goto(base+'/games/cyberpunk-2077/not-launching',{waitUntil:'networkidle'});
  await menu.locator('summary').click();
  for(const locale of ['en','zh','es']) {
   const link=menu.locator(`a[href="/${locale}/games/cyberpunk-2077/not-launching"]`);
   assert.equal(await link.count(),1);assert.equal(await link.locator('small').count(),0);
  }
  await menu.locator('a[href="/en/games/cyberpunk-2077/not-launching"]').focus();await page.keyboard.press('Enter');await page.waitForURL(base+'/en/games/cyberpunk-2077/not-launching');
  for(const locale of ['zh','es']) {await page.goto(base+'/'+locale);assert.equal(await page.locator('#english-search').count(),0);assert.ok(await page.locator('#articles a').count()>0);}
  assert.deepEqual(errors,[]);
  await context.close();
 }
 const page=await browser.newPage();
 await page.route('**/*',r=>{const u=new URL(r.request().url());return u.origin!==new URL(base).origin||u.pathname.startsWith('/api/')?r.abort():r.continue();});
 await page.goto(base+'/?view=articles',{waitUntil:'networkidle'});
 await page.getByRole('searchbox').fill('ST-3100001');
 await page.locator('.article-cluster-filter').getByRole('button',{name:'サーバー',exact:true}).click();
 const filtered=page.locator('#articles a').first();const filteredHref=await filtered.getAttribute('href');
 await filtered.click();await page.waitForURL(base+filteredHref);await page.goBack({waitUntil:'networkidle'});
 assert.equal(await page.getByRole('searchbox').inputValue(),'ST-3100001');
 assert.equal(await page.locator('.article-cluster-filter .active').innerText(),'サーバー');
 assert.equal(await page.locator('#articles a').first().getAttribute('href'),filteredHref);
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.article-cluster-filter .active').innerText(),'サーバー');
 assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).href,'https://gemnao.pages.dev/');
 await page.goto(base+'/en?q=ST-3100001',{waitUntil:'networkidle'});
 assert.equal(await page.locator('#english-search').inputValue(),'ST-3100001');
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://gemnao.pages.dev/en');
 await page.close();
 console.log('PASS: EN/JA search, zero/multi-term/case/error-code, clear/reload/back/forward, keyboard results and translated/fallback language navigation at 375/390/430/1440px; zh/es home lists retained');
}finally{await browser.close();}
