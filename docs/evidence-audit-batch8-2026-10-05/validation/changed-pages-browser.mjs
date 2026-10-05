import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {chromium}=require('/opt/codex/cua_node/lib/node_modules/playwright');
const base='http://127.0.0.1:3009';const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const width of [375,390,430,1440]){
 const context=await browser.newContext({viewport:{width,height:960}});const errors=[];
 await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==base)return r.abort();if(u.pathname.startsWith('/api/'))return r.fulfill({json:{rows:[],methods:[]}});return r.continue();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/privacy','/tools','/tools/refresh-rate','/guide/windows-11-required','/pc/gaming-shortcut-keys','/pc/refresh-rate-stuck-60hz','/games/the-blood-of-dawnwalker','/games/elden-ring','/games/onimusha-way-of-the-sword']){
 const response=await page.goto(base+path,{waitUntil:'networkidle'});assert.equal(response.status(),200,path);
 assert.ok(await page.title());assert.ok(await page.locator('head link[rel=canonical]').count());
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path+' overflow '+width);
 for(const d of await page.locator('details').all()){const summary=d.locator('summary').first();if(await summary.isVisible()){await summary.focus();await page.keyboard.press('Enter');await page.keyboard.press('Enter');}}
 if(path==='/privacy')assert.ok((await page.locator('main').innerText()).includes('新しい記録を書き込む際に30日'));
 if(path==='/tools')assert.ok((await page.locator('main').innerText()).includes('ブラウザの描画頻度の目安'));
 if(path==='/tools/refresh-rate'){
  const start=page.getByRole('button',{name:'ブラウザの描画頻度を測る',exact:true});await start.focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:'中断する',exact:true}).click();assert.ok(await start.isEnabled());await start.click();await page.locator('output').waitFor({timeout:15000});assert.ok((await page.locator('output').innerText()).includes('直接測った値ではありません'));
 }
 }
 assert.deepEqual(errors,[]);console.log('PASS '+width+'px: 9 changed/related pages, no overflow, keyboard details, local Hz start/cancel/complete, metadata');await context.close();
}}finally{await browser.close();}
