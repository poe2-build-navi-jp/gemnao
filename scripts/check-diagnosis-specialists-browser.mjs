// Synthetic local-only browser regression. Production requests are prohibited.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test');
const out='/tmp/gemnao-specialist-browser';
await mkdir(out,{recursive:true});
await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {DiagnosisWizard} from './components/diagnosis-wizard';import './app/diagnose/diagnosis.css';createRoot(document.getElementById('root')).render(<main className="diag"><DiagnosisWizard gameNames={[]}/></main>);`,loader:'tsx',resolveDir:process.cwd()},bundle:true,platform:'browser',format:'esm',outfile:out+'/bundle.js',define:{'process.env.NODE_ENV':'"production"','process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED':'"true"','process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA':'"false"'}});
const server=createServer(async(req,res)=>{if(req.method!=='GET'){res.writeHead(405).end();return;}const file=req.url==='/bundle.js'?'bundle.js':req.url==='/bundle.css'?'bundle.css':null;res.setHeader('Content-Type',file?.endsWith('js')?'text/javascript':file?'text/css':'text/html');res.end(file?await readFile(out+'/'+file):'<html lang="ja"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/bundle.css"><div id="root"></div><script type="module" src="/bundle.js"></script></html>');});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const cases=[['gpu-usage','GPU使用率が気になる','GPU使用率は低いが、目標FPS・上限に達している','設定変更は不要'],['vram','VRAMが足りないか確認したい','内蔵GPU・共有GPUメモリの数字を見ている','専用VRAMに足さず'],['audio','ゲームの音がおかしい','Bluetoothでマイク・通話を使うと変わる','LE Audio'],['steam-cloud','Steam Cloudの同期がおかしい','クラウドとローカルの競合が出ている','正しい方が不明なら選択を保留'],['controller','コントローラーが動かない・二重入力','二重入力：DS4Windowsなどの変換アプリを使っている','入力変換1経路']];
try {for(const width of [390,1165])for(const [id,label,choice,expected] of cases){
 const context=await browser.newContext({viewport:{width,height:900},permissions:['clipboard-read','clipboard-write']});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{const req=route.request();if(req.url().startsWith(origin+'/api/')){assert.equal(req.method(),'GET');return route.fulfill({json:{enabled:true,sharing:false,metrics:false}});}assert.ok(req.url().startsWith(origin));return route.continue();});
 await page.goto(origin);await page.getByRole('button',{name:'症状を選んで診断をはじめる →'}).click();
 const next=()=>page.getByRole('button',{name:'次へ →',exact:true}).click();
 await page.getByRole('button',{name:'そのような兆候には気付いていない',exact:true}).click();await next();await page.getByRole('button',{name:'重大な警告は見ていない',exact:true}).click();await next();
 await page.getByRole('button',{name:label,exact:false}).click();await next();await page.locator('.diag-options button').first().click();await next();
 await page.getByRole('button',{name:choice,exact:true}).click();await next();await page.getByRole('button',{name:'思い当たる変更はない',exact:true}).click();await next();await page.getByRole('button',{name:'Steam',exact:true}).click();await next();
 await page.locator('#diag-os').selectOption('windows11');await next();await next();await next();await page.getByRole('button',{name:'確認する順番を見る →',exact:true}).click();
 await page.getByText(expected,{exact:false}).first().waitFor();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.reload();await page.getByRole('button',{name:'続きから再開する'}).click();await page.getByText(expected,{exact:false}).first().waitFor();
 await page.getByRole('button',{name:'相談用メモの全文を確認する'}).click();const memo=await page.locator('textarea').inputValue();assert.ok(memo.includes(label));
 await page.getByRole('checkbox').check();await page.getByRole('button',{name:'確認したメモをコピー'}).click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),memo);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'確認したメモをテキスト保存'}).click();assert.ok((await downloadPromise).suggestedFilename().endsWith('.txt'));
 if(id==='gpu-usage') {
 await page.getByRole('button',{name:'閉じる',exact:true}).click();
 await page.getByRole('button',{name:'← 回答に戻る',exact:true}).click();
 for(let n=0;n<9;n++){
   if(await page.getByRole('button',{name:'ゲームの音がおかしい',exact:false}).count())break;
   await page.getByRole('button',{name:'← 前の質問へ',exact:true}).click();
 }
 await page.getByRole('button',{name:'ゲームの音がおかしい',exact:false}).click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('gemnao-diagnosis-v1')));
 assert.equal(saved.complete,false);assert.equal(saved.answers.observation,undefined);assert.deepEqual(saved.results,{});assert.deepEqual(saved.tried,{});
 await next();await page.getByRole('button',{name:'分からない',exact:true}).click();await next();await page.getByRole('button',{name:'分からない',exact:true}).click();await next();await page.getByRole('button',{name:'分からない',exact:true}).click();await next();await page.getByRole('button',{name:'分からない',exact:true}).click();await next();await next();await next();await next();await page.getByRole('button',{name:'確認する順番を見る →',exact:true}).click();
 await page.getByText('現在の回答だけでは、優先する原因候補を絞れません。すでに試した対処を繰り返さず、追加情報を確認してください。',{exact:true}).waitFor();
}
await page.getByRole('button',{name:'別の症状を診断する'}).click();await page.locator('.diag-options button').first().waitFor();assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${id} ${width}px, result/reload/copy/download/restart`);
}}finally{await browser.close();server.close();}
