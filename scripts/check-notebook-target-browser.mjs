// Built local preview only. /my is Japanese-only; /my-games has four locales.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH, args:['--no-sandbox']});
let checks=0;
try {
 for(const width of [375,1440]) for(const path of ['/my','/my-games','/en/my-games','/zh/my-games','/es/my-games']) {
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',r=>{
   const url=new URL(r.request().url());
   return url.origin!==new URL(base).origin || url.pathname.startsWith('/api/') ? r.abort() : r.continue();
  });
  const page=await context.newPage();
  assert.equal((await page.goto(base+path,{waitUntil:'networkidle'})).status(),200);
  const isMy=path==='/my';
  const workspace=page.locator(isMy?'#my-solutions':'#issue-notebook');
  const updates=page.locator('.support-workspace').last();
  const create=workspace.locator('button').first();
  await page.waitForFunction(selector=>!document.querySelector(selector).disabled,isMy?'#new-solution':'#issue-notebook button');
  const href=isMy?'#new-solution':'#issue-notebook';
  const cta=updates.locator(`a[href="${href}"]`);
  assert.equal(await cta.count(),1,`${path} empty CTA`);
  assert.equal(await page.locator(href).count(),1,`${path} real target`);
  if(isMy) assert.equal(await page.locator('a[href="#issue-notebook"]').count(),0);
  await cta.focus();await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  assert.equal(new URL(page.url()).hash,href);
  if(!isMy) await page.keyboard.press('Tab');
  assert.ok(await create.evaluate(el=>document.activeElement===el),`${path} keyboard focus reaches creation`);
  await page.keyboard.press('Enter');
  const form=workspace.locator('form').first();
  await form.locator('input').first().fill('Target regression note');
  await form.locator('textarea').first().fill('Synthetic symptom');
  await form.locator('button[type="submit"]').click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('gemnao-solutions-v1')||'{}').items?.length===1);
  assert.equal(await updates.locator(`a[href="${href}"]`).count(),0,'Saved state must not invite first record');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(selector=>!document.querySelector(selector).disabled,isMy?'#new-solution':'#issue-notebook button');
  assert.equal(await updates.locator(`a[href="${href}"]`).count(),0,'Saved state survives reload');
  assert.ok((await workspace.innerText()).includes('Target regression note'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  checks++;
  await context.close();
 }
 console.log(`PASS: ${checks} empty/saved/reloaded page states, real targets and keyboard-only creation at 375/1440px; Japanese /my and all four /my-games locales`);
} finally {await browser.close();}
