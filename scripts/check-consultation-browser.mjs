import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { build } from 'esbuild';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3027';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const bundle = await build({ stdin: { contents: "export {RULE_VERSION} from './lib/diagnosis/model'", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', write: false });
const { RULE_VERSION } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
 for (const width of [375, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const posts = [];
  await context.route('**/*', route => {
   const req = route.request();
   if (req.method() === 'POST') posts.push(req.url());
   const url = new URL(req.url());
   if (url.origin !== new URL(base).origin) return route.abort();
   if (url.pathname === '/api/diagnosis/config') return route.fulfill({json:{enabled:true,sharing:false,metrics:false}});
   return route.continue();
  });
  await context.addInitScript(({version}) => {
   if (!localStorage.getItem('consultation-seeded')) {
    localStorage.setItem('gemnao-diagnosis-v1', JSON.stringify({version, answers:{safety:'none',storage:'none',symptom:'crash',scope:'game',observation:'random',change:'none',launcher:'steam',os:'unknown',gpu:'unknown',ram:'unknown'},game:'ACE COMBAT 8 <script>private</script>',tried:{},results:{},step:'decision',complete:true,savedAt:Date.now()}));
    localStorage.setItem('consultation-seeded', 'yes');
   }
   window.copyCalls = [];
   window.copyMode = 'pending';
   Object.defineProperty(navigator, 'clipboard', { configurable:true, value:{writeText: text => {
    window.copyCalls.push(text);
    if (window.copyMode === 'fail') return Promise.reject(new Error('denied'));
    if (window.copyMode === 'pending') return new Promise(resolve => {window.finishCopy = resolve;});
    return Promise.resolve();
   }}});
  }, {version:RULE_VERSION});
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/diagnose');
  await page.getByRole('button',{name:'続きから再開する'}).click();
  await page.getByRole('button',{name:'相談用メモの全文を確認する'}).click();
  const preview = page.locator('#diag-report-preview');
  assert.match(await preview.inputValue(), /症状：ゲームがクラッシュする/);
  assert.doesNotMatch(await preview.inputValue(), /private|<script>|ACE COMBAT/);
  const copy=page.getByRole('button',{name:'確認したメモをコピー',exact:true});
  assert.ok(await copy.isDisabled());
  const saved=await page.evaluate(()=>localStorage.getItem('gemnao-diagnosis-v1'));
  await page.getByLabel('内容と未確認項目を確認しました').check();
  await copy.evaluate(button => {button.click();button.click();});
  assert.equal(await page.evaluate(()=>window.copyCalls.length),1);
  assert.ok(await copy.isDisabled());
  await page.evaluate(()=>window.finishCopy());
  await page.getByText('相談用メモをコピーしました。', {exact:false}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('gemnao-diagnosis-v1')),saved);
  await page.getByLabel('友達・コミュニティ向けの短いまとめ', {exact:false}).uncheck();
  assert.ok(await copy.isDisabled());
  assert.match(await preview.inputValue(),/PC修理相談用メモ/);
  await page.getByLabel('内容と未確認項目を確認しました').check();
  await page.evaluate(()=>{window.copyMode='fail';});
  await copy.click();
  await page.getByText('自動コピーできませんでした。',{exact:false}).waitFor();
  assert.ok(await preview.evaluate(e=>e.selectionEnd===e.value.length));
  await page.getByRole('button',{name:'閉じる',exact:true}).click();
  await page.getByRole('button',{name:'相談用メモの全文を確認する'}).click();
  assert.ok(await copy.isDisabled());
  await page.getByLabel('内容と未確認項目を確認しました').check();
  await page.evaluate(()=>{window.copyMode='pending';});
  await copy.click();
  await page.goto(base+'/tools/windows-diagnosis#community-reference');
  for (const prefix of ['', '/en']) {
   await page.goto(base+prefix+'/tools/windows-diagnosis#community-reference');
   const section=page.locator('#community-reference');
   await section.waitFor();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.evaluate(()=>{window.copyMode='fail';});
   await section.getByRole('button').click();
   assert.match(await section.locator('output').innerText(),/コピーできません|Copy failed/);
   await page.evaluate(()=>{window.copyMode='ok';});
   await section.getByRole('button').click();
   assert.match(await page.evaluate(()=>window.copyCalls.at(-1)),/community-reference/);
   const href=await section.locator('a').first().getAttribute('href');
   const response=await page.goto(base+href);assert.equal(response.status(),200);
  }
  await page.goto(base+'/diagnose');
  await page.getByRole('button',{name:'続きから再開する'}).click();
  await page.getByRole('button',{name:'相談用メモの全文を確認する'}).click();
  assert.ok(await copy.isDisabled());
  assert.deepEqual(posts,[]);
  assert.deepEqual(errors,[]);
  await context.close();
 }
 console.log('Consultation browser checks passed: preview, escaping, consent, repeated clicks, interruption, failures, navigation, saved records, JA/EN, 375/1440px; no POSTs.');
} finally {await browser.close();}
