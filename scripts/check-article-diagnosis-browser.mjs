// Local built preview only; block external traffic and APIs.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
const output = process.env.SCREENSHOT_DIR || '/tmp/article-diagnosis-screenshots';
await mkdir(output, { recursive: true });
const paths = ['', '/en', '/zh', '/es'].map(prefix => `${prefix}/games/cyberpunk-2077/not-launching`);
paths.push('/guide/pc-game-crash', '/en/guide/pc-game-crash', '/pc/refresh-rate-stuck-60hz');
let count = 0;
try {
 for (const width of [375, 390, 430, 1440]) {
  const context = await browser.newContext({viewport:{width,height:1000}});
  await context.route('**/*', route => {
   const url = new URL(route.request().url());
   return url.origin !== new URL(base).origin || url.pathname.startsWith('/api/') ? route.abort() : route.continue();
  });
  const page=await context.newPage();
  for (const path of paths) {
   const response=await page.goto(base+path, {waitUntil:'networkidle'});
   assert.equal(response.status(),200,path);
   const card=page.locator('.diagnosis-article-entry');
   assert.equal(await card.count(),1,path);
   assert.ok(await card.evaluate(el => Boolean(document.querySelector('#faq').compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)),path);
   const link=card.locator('a');
   const href=await link.getAttribute('href');
   assert.equal(await page.locator(`.guide-article a[href="${href}"]`).count(),1,`duplicate CTA: ${path}`);
   await link.focus();
   await page.keyboard.press('Shift+Tab');
   await page.keyboard.press('Tab');
   assert.equal(await link.evaluate(el => document.activeElement===el),true);
   assert.equal(await link.evaluate(el => el.matches(':focus-visible')),true);
   assert.ok((await link.boundingBox()).height>=44);
   await card.scrollIntoViewIfNeeded();
   await page.waitForTimeout(300);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width} ${path}`);
   assert.ok(await card.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth;}));
   await page.screenshot({path:`${output}/${width}-${path.replaceAll('/','_')}.png`});
   await page.keyboard.press('Enter');
   await page.waitForURL(base+href);
   assert.equal((await page.request.get(base+href)).status(),200);
   count++;
  }
  for (const path of ['/games/monster-hunter-wilds/save-data','/games/monster-hunter-wilds/hdr','/guide/bsod-while-gaming','/guide/pc-shuts-down-while-gaming','/en/discord/upload-failed','/zh/games/stardew-valley/save-restore','/es/games/gta-v-enhanced/story-save-migration']) {
   assert.equal((await page.goto(base+path)).status(),200,path);
   assert.equal(await page.locator('.diagnosis-article-entry').count(),0,path);
  }
  await context.close();
 }
 console.log(`PASS: ${count} rendered CTA/keyboard destinations at 375/390/430/1440px, 28 exclusion checks; screenshots: ${output}`);
} finally {await browser.close();}
