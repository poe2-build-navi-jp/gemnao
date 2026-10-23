// Real components, loopback fixture and synthetic config only. No remote APIs.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('@playwright/test')); } catch { ({ chromium } = require('playwright')); }
const out = '.wrangler/home-diagnosis-browser';
await mkdir(out, { recursive: true });
await build({ stdin: { contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {DiagnosisWizard} from './components/diagnosis-wizard';import {WeeklyPeriodLabel} from './components/weekly-period-label';import './app/diagnose/diagnosis.css';createRoot(document.getElementById('root')).render(location.pathname==='/weekly'?<main>{['ja','en','zh','es'].map(locale=><p key={locale} data-locale={locale}><WeeklyPeriodLabel slug="2026-10-05" locale={locale}/> — 2026-10-05 – 2026-10-11</p>)}</main>:<main className="diag"><DiagnosisWizard gameNames={[]}/></main>);`,loader:'tsx',resolveDir:process.cwd()},bundle:true,format:'esm',outfile:`${out}/bundle.js`,define:{'process.env.NODE_ENV':'"production"','process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED':'"true"','process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA':'"false"'} });
const unexpected=[];
const server=createServer(async(req,res)=>{
 if(req.method!=='GET'||req.url.startsWith('/api/')){unexpected.push(req.url);res.writeHead(405);res.end();return;}
 if(['/bundle.js','/bundle.css'].includes(req.url)){res.setHeader('Content-Type',req.url.endsWith('.js')?'text/javascript':'text/css');res.end(await readFile(out+req.url));return;}
 res.setHeader('Content-Type','text/html');res.end('<!doctype html><html lang="ja"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/bundle.css"><style>body{margin:0;font-family:sans-serif}main{padding:16px}</style><div id="root"></div><script type="module" src="/bundle.js"></script></html>');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
let count=0;
try{
for(const width of [375,1440]){
 for(const scenario of ['running','stopped','network','http','invalid','timeout-late']){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.clock.install();
  let release;
  const gate=new Promise(r=>{release=r;});
  let received;
  const arrival=new Promise(r=>{received=r;});
  await page.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(u.origin!==base||route.request().method()!=='GET'){unexpected.push(u.pathname);return route.abort();}
   if(u.pathname!=='/api/diagnosis/config') return route.continue();
   received(); await gate;
   if(scenario==='network')return route.abort();
   if(scenario==='http')return route.fulfill({status:503,json:{error:'unavailable'}});
   return route.fulfill({json:scenario==='invalid'?{enabled:'true'}:{enabled:scenario!=='stopped',sharing:false,metrics:false}});
  });
  await page.goto(base); await arrival;
  assert.match(await page.locator('body').innerText(),/確認中/);
  assert.doesNotMatch(await page.locator('body').innerText(),/停止中|確認不能/);
  assert.equal(await page.getByRole('button',{name:/診断をはじめる/}).count(),0);
  if(scenario==='timeout-late') await page.clock.fastForward(15001);
  release();
  const expected=scenario==='running'?'稼働中':scenario==='stopped'?'停止中':'確認不能';
  await page.getByText(new RegExp(expected)).waitFor();
  if(scenario==='timeout-late') { await page.waitForTimeout(100); assert.doesNotMatch(await page.locator('body').innerText(),/稼働中/); }
  if(scenario==='running') { await page.getByRole('button',{name:/診断をはじめる/}).click(); await page.locator('h2').first().waitFor(); }
  else assert.equal(await page.getByRole('button',{name:/診断をはじめる/}).count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${out}/${scenario}-${width}.png`});
  await page.close();count++;console.log(`PASS diagnosis ${scenario} ${width}`);
 }
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.clock.install({time:new Date('2026-10-11T14:59:59Z')});
 await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await page.goto(base+'/weekly');
 await page.getByText('今週の不具合まとめ',{exact:true}).waitFor();
 await page.clock.fastForward(1001);
 for(const text of ['過去のまとめ','Past roundups','往期汇总','Resúmenes anteriores']) await page.getByText(text,{exact:true}).waitFor();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`${out}/weekly-${width}.png`});
 await page.close();count++;console.log(`PASS weekly JST rollover all four languages ${width}`);
}
assert.deepEqual(unexpected,[]);console.log(`PASS ${count} browser scenarios; no production requests or writes`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
