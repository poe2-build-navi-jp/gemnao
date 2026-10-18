// Synthetic page and transport only. No production requests or real GA.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const compiled = await build({
  stdin: {
    resolveDir: process.cwd(),
    loader: 'tsx',
    contents: `
import React from 'react';import{createRoot}from'react-dom/client';import{StepResultCollection,StepResultButtons}from'./components/step-result-collection';
const root=createRoot(document.getElementById('root'));const steps=[{id:'step-1',title:'First'},{id:'step-2',title:'Last'}];
window.mode='get-hang';window.posts=[];window.receipts=new Set();window.delayed=[];window.signals=[];
window.fetch=async(url,init={})=>{window.signals.push(init.signal);if(init.method==='POST'){const b=JSON.parse(init.body);window.posts.push(b);window.receipts.add(b.requestId);if(window.mode==='post-hang')return new Promise(r=>window.delayed.push(r));return Response.json({ok:true});}if(window.mode==='get-hang')return new Promise(r=>window.delayed.push(r));return Response.json({rows:[],methods:[],stepResultsAvailable:true});};
window.mount=(locale)=>root.render(<StepResultCollection key={locale} contextSlug="deadline-fixture" topic="launch" locale={locale} steps={steps}><section id="step-1"><StepResultButtons method="step-1"/></section></StepResultCollection>);
window.unmount=()=>root.render(null);window.mount(window.initialLocale);`,
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
});
const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const locale of ['en', 'zh', 'es']) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 850 },
    });
    await context.route('**/*', (r) =>
      r.request().url().endsWith('/fixture.js')
        ? r.fulfill({
            contentType: 'text/javascript',
            body: compiled.outputFiles[0].text,
          })
        : r.request().resourceType() === 'document'
          ? r.fulfill({
              contentType: 'text/html',
              body: `<meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script>window.initialLocale=${JSON.stringify(locale)}</script><script src="/fixture.js"></script>`,
            })
          : r.abort(),
    );
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.clock.install();
    await page.goto('http://localhost/', { waitUntil: 'load' });
    await page.locator('#step-1 button').first().waitFor();
    assert.ok(await page.locator('#step-1 button').first().isDisabled());
    await page.clock.runFor(15001);
    const reconnect = page.locator('aside.procedure-note > button');
    await reconnect.waitFor();
    assert.equal(await page.evaluate(() => signals[0].aborted), true);
    // Reconnect succeeds. Old GET arriving afterwards cannot replace its result.
    await page.evaluate(() => {
      window.mode = 'ok';
    });
    await reconnect.click();
    await page.waitForFunction(
      () => !document.querySelector('#step-1 button').disabled,
    );
    await page.evaluate(() =>
      delayed.shift()(
        Response.json({ methods: [], stepResultsAvailable: false }),
      ),
    );
    await page.clock.runFor(1);
    assert.equal(
      await page.locator('#step-1 button').first().isDisabled(),
      false,
    );
    await page.evaluate(() => (window.mode = 'post-hang'));
    await page.locator('#step-1 .step-actions button').nth(1).click();
    await page.waitForFunction(() => posts.length === 1);
    assert.ok(
      await page.locator('#step-1 .step-actions button').nth(1).isDisabled(),
    );
    // Locale switch/unmount while POST is pending. Original request survives safely.
    await page.evaluate(() => {
      window.unmount();
    });
    await page.clock.runFor(1);
    await page.evaluate(() => {
      window.mode = 'ok';
      window.mount(window.initialLocale === 'es' ? 'en' : 'es');
    });
    await page.locator('#step-1').waitFor();
    await page.clock.runFor(15001);
    await page.evaluate(() => delayed.shift()(Response.json({ ok: true })));
    await page.clock.runFor(1);
    assert.equal(
      await page.evaluate(() =>
        Boolean(
          localStorage.getItem(
            'gemnao-feedback:deadline-fixture:launch:not-resolved:step-1',
          ),
        ),
      ),
      false,
      'late POST cannot mark completion',
    );
    const recover = page.locator('aside.procedure-note div button');
    await recover.waitFor();
    await recover.click();
    await page.waitForFunction(
      () =>
        posts.length === 2 &&
        Boolean(
          localStorage.getItem(
            'gemnao-feedback:deadline-fixture:launch:not-resolved:step-1',
          ),
        ),
    );
    const result = await page.evaluate(() => ({
      ids: posts.map((p) => p.requestId),
      receipts: receipts.size,
    }));
    assert.equal(result.ids[0], result.ids[1]);
    assert.equal(result.receipts, 1);
    // GET cancellation on locale switch/unmount leaves late data detached.
    await page.evaluate(() => {
      window.mode = 'get-hang';
      window.mount('zh');
    });
    await page.clock.runFor(1);
    await page.evaluate(() => window.unmount());
    await page.clock.runFor(1);
    assert.equal(await page.evaluate(() => signals.at(-1).aborted), true);
    await page.evaluate(() =>
      delayed.shift()(
        Response.json({ methods: [], stepResultsAvailable: true }),
      ),
    );
    await page.clock.runFor(1);
    assert.equal(await page.locator('#root').innerText(), '');
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      'PASS ' +
        locale +
        ': stalled GET/reconnect, late GET ignored, stalled POST, locale switch/unmount, same-token recovery, one synthetic server receipt',
    );
  }
} finally {
  await browser.close();
}
