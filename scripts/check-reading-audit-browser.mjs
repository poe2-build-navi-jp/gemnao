// Run against the built local preview; never contact production APIs or analytics.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox']});
const output = process.env.SCREENSHOT_DIR || '/tmp/reading-audit-screenshots';
await mkdir(output, {recursive:true});
const paths = ['/games/monster-hunter-wilds/not-launching', '/en/games/monster-hunter-wilds/not-launching', '/zh/games/cyberpunk-2077/not-launching', '/es/games/cyberpunk-2077/not-launching', '/guide/pc-game-crash', '/pc/refresh-rate-stuck-60hz', '/discord/upload-failed'];
const metrics=[];
const statesOnly=process.argv.includes('--states-only');
const articlesOnly=process.argv.includes('--articles-only');
try {
 for (const width of (statesOnly ? [] : [375,390,393,430,1440])) {
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',r=>{
   const url=new URL(r.request().url());
   return url.origin!==new URL(base).origin || url.pathname.startsWith('/api/') ? r.abort() : r.continue();
  });
  const page=await context.newPage();
  for (const path of paths) {
   assert.equal((await page.goto(base+path,{waitUntil:'networkidle'})).status(),200,path);
   const toc=page.locator('.article-toc'), toggle=toc.locator('.toc-toggle');
   const answer=page.locator('.answer-summary');
   if (width<=760) {
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    assert.equal(await toc.locator('a:visible').count(),0);
    const answerTop=await answer.evaluate(e=>e.getBoundingClientRect().top+scrollY);
    const firstTop=await page.locator('.procedure-card,.pc-step,.article-step').first().evaluate(e=>e.getBoundingClientRect().top+scrollY).catch(()=>null);
    metrics.push({width,path,answerTop,firstTop});
    assert.ok((await toc.boundingBox()).height<110,'Collapsed TOC must be compact');
    if(path==='/games/monster-hunter-wilds/not-launching') {
     assert.ok(answerTop<1300,`answer too low: ${answerTop}`);
     assert.ok(firstTop<6500,`STEP1 too low: ${firstTop}`);
     assert.equal(await page.locator('.symptom-nav').count(),0);
    }
    await toggle.focus(); await page.keyboard.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert.ok(await toc.locator('a:visible').count()>0);
    await page.keyboard.press('Space');
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    await page.keyboard.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
   } else {
    assert.equal(await toggle.isVisible(),false);
    assert.ok(await toc.locator('a:visible').count()>0);
    assert.ok((await toc.boundingBox()).x<(await answer.boundingBox()).x);
   }
   // All original branches are present, unique and point to real targets.
   const targets=await toc.locator('a').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
   assert.equal(targets.length,new Set(targets).size,path);
   for(const target of targets.filter(href=>href.startsWith('#'))) assert.equal(await page.locator(target).count(),1,target);
   const lastStep=toc.locator('a[href^="#"]').filter({hasText: /./}).nth(Math.max(0,targets.length-3));
   const target=await lastStep.getAttribute('href');
   await lastStep.focus(); await page.keyboard.press('Enter');
   await page.waitForTimeout(1800);
   assert.equal(new URL(page.url()).hash,target);
   assert.ok((await page.locator(target).boundingBox()).y<250);
   if(width<=760) {
    await toggle.click(); await toggle.click(); await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const contrast=await page.locator('.article-hero .save-article small').evaluateAll(elements=>elements.map(e=>{
    const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
    const luminance=values=>values.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
    const foreground=luminance(rgb(getComputedStyle(e).color));
    const probe=document.createElement('span');probe.style.color='var(--navy)';document.body.append(probe);
    const background=luminance(rgb(getComputedStyle(probe).color));probe.remove();
    return (Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05);
   }));
   contrast.forEach(value=>assert.ok(value>=4.5,`contrast ${value}`));
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);
   await page.screenshot({path:`${output}/${width}-${path.replaceAll('/','_')}.png`});
  }
  await context.close();
 }
 // Empty, saved, unresolved and resolved states in every existing locale.
 for(const stateWidth of (articlesOnly ? [] : [375,390,430,1440])) for(const locale of ['ja','en','zh','es']) {
  const context=await browser.newContext({viewport:{width:stateWidth,height:900}});
  await context.route('**/*',r=>new URL(r.request().url()).origin!==new URL(base).origin || new URL(r.request().url()).pathname.startsWith('/api/') ? r.abort() : r.continue());
  const page=await context.newPage();
  await page.goto(base+(locale==='ja'?'':`/${locale}`)+'/my-games',{waitUntil:'networkidle'});
  const workspace=page.locator('#issue-notebook');
  const updates=page.locator('.support-workspace').last();
  await workspace.locator('button').first().waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#issue-notebook button').disabled);
  assert.equal(await workspace.locator('select').count(),0);
  const initial=await updates.innerText();
  assert.equal(await updates.locator('a[href="#issue-notebook"]').count(),1);
  await workspace.scrollIntoViewIfNeeded();
  await page.screenshot({path:`${output}/${stateWidth}-${locale}-empty.png`});
  await updates.locator('a').focus();await page.keyboard.press('Enter');
  await workspace.locator('button').first().click();
  await workspace.locator('input').first().fill('Audit symptom');
  await workspace.locator('textarea').first().fill('Test symptom details');
  await workspace.locator('form button[type="submit"]').click();
  await workspace.locator('.support-tools').waitFor();
  assert.equal(await workspace.locator(':scope > label select option').count(),2);
  assert.notEqual(await updates.innerText(),initial);
  assert.equal(await updates.locator('a[href="#issue-notebook"]').count(),0);
  let unresolved;
  for(const status of ['unresolved','resolved']) {
   await page.evaluate(status=>{
    const data=JSON.parse(localStorage.getItem('gemnao-solutions-v1'));
    data.items[0].status=status;localStorage.setItem('gemnao-solutions-v1',JSON.stringify(data));
   },status);
   await page.reload({waitUntil:'networkidle'});
   await workspace.locator('.support-tools').waitFor();
   assert.ok((await updates.innerText()).length>30);
   assert.equal(await workspace.locator('select:visible').count(),1,'Only the issue selector is visible on the dashboard');
   for (const select of await workspace.locator('select').all()) assert.ok(await select.locator('option').count()>0, 'No empty selectors');
   if(status==='unresolved') unresolved=await updates.innerText();
   else assert.notEqual(await updates.innerText(),unresolved);
  }
  await page.screenshot({path:`${output}/${stateWidth}-${locale}-saved-resolved.png`});
  await context.close();
 }
 const page=await browser.newPage();
 await page.route('**/*',r=>new URL(r.request().url()).origin!==new URL(base).origin || new URL(r.request().url()).pathname.startsWith('/api/') ? r.abort() : r.continue());
 for(const prefix of (articlesOnly ? [] : ['', '/en'])) {
  await page.goto(base+prefix+'/tools/windows-diagnosis');
  const link=page.locator('#history a[href="/my#my-solutions"]');
  assert.equal(await link.count(),1);
  await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+'/my#my-solutions');
  await page.locator('#my-solutions').waitFor();
 }
 if(!statesOnly) await writeFile(`${output}/metrics.json`,JSON.stringify(metrics,null,2));
 if(!statesOnly) console.log(`PASS: 35 article layouts at 375/390/393/430/1440px, TOC keyboard/repeated toggles/anchors/contrast. Metrics: ${output}/metrics.json`);
 if(!articlesOnly) console.log('PASS: 4-locale empty/saved/unresolved/resolved states at 375/390/430/1440px and both diagnosis-notebook links.');
} finally {await browser.close();}
