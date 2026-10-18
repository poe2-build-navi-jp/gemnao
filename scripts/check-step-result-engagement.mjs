// Entirely synthetic browser: every request is fulfilled/aborted in memory.
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
import React from 'react'; import {createRoot} from 'react-dom/client';
import {StepResultCollection,StepResultButtons} from './components/step-result-collection';
import * as analytics from './lib/analytics';
const steps=[{id:'step-1',title:'First step'},{id:'step-2',title:'Final step'}];
const root=createRoot(document.getElementById('root'));
window.analytics=analytics;
window.render=()=>root.render(<StepResultCollection contextSlug="fixture" topic="launch" locale={window.locale} steps={steps}><div style={{height:1200}}/><section id="step-1"><StepResultButtons method="step-1"/></section><section id="step-2"><StepResultButtons method="step-2"/></section><section id="references">Official sources</section></StepResultCollection>);
window.render();`,
  },
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
});
const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const locale of ['en', 'zh', 'es'])
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 800 },
      });
      let fail = true;
      let posts = 0;
      await context.route('**/*', (route) => {
        const url = new URL(route.request().url());
        if (url.pathname === '/fixture.js')
          return route.fulfill({
            contentType: 'text/javascript',
            body: compiled.outputFiles[0].text,
          });
        if (url.pathname === '/api/feedback') {
          if (route.request().method() === 'POST') {
            posts++;
            return route.fulfill({
              status: fail ? 503 : 200,
              json: fail ? { error: 'PRIVATE_ERROR' } : { ok: true },
            });
          }
          return route.fulfill({
            json: { rows: [], methods: [], stepResultsAvailable: true },
          });
        }
        if (route.request().resourceType() === 'document')
          return route.fulfill({
            contentType: 'text/html',
            body: `<meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}button,a{overflow-wrap:anywhere} .step-actions{display:flex;flex-wrap:wrap;gap:8px}section{max-width:100%}</style><div id="root"></div><script>window.locale=${JSON.stringify(locale)};window.events=[];window.gtag=(...args)=>events.push(args)</script><script src="/fixture.js"></script>`,
          });
        return route.abort();
      });
      const page = await context.newPage();
      page.on('pageerror', (error) => console.error(error.message));
      await page.goto(
        `https://gemnao.pages.dev/${locale}/games/ace-combat-8/error-st-3100001`,
        { waitUntil: 'networkidle' },
      );
      assert.equal(
        await page.evaluate(() => events.length),
        0,
        'offscreen controls not counted',
      );
      await page.locator('#step-1 .step-actions').scrollIntoViewIfNeeded();
      await page.waitForFunction(() =>
        events.some((e) => e[1] === 'step_result_controls_viewed'),
      );
      await page.evaluate(() => {
        render();
        render();
      });
      await page.locator('#step-1 button').nth(1).click();
      await page.waitForFunction(() =>
        events.some((e) => e[1] === 'step_result_failed'),
      );
      assert.equal(
        await page.locator('#step-1 a[href="#step-2"]').count(),
        1,
        'navigation survives failed save',
      );
      fail = false;
      await page.locator('#step-1 output button').click();
      await page.waitForFunction(() =>
        events.some((e) => e[1] === 'step_result_saved'),
      );
      await page.locator('#step-1 a[href="#step-2"]').click();
      await page.locator('#step-2 button').nth(1).click();
      await page.waitForFunction(
        () => events.filter((e) => e[1] === 'step_result_saved').length === 2,
      );
      assert.equal(
        await page.locator('#step-2 a[href="#references"]').count(),
        1,
      );
      const events = await page.evaluate(() => window.events);
      assert.equal(
        events.filter(
          (e) =>
            e[1] === 'step_result_controls_viewed' && e[2].step_id === 'step-1',
        ).length,
        1,
        'rerender deduped',
      );
      assert.equal(
        events.filter((e) => e[1] === 'step_result_failed').length,
        1,
      );
      assert.equal(
        events.find((e) => e[1] === 'step_result_failed')[2].failure,
        'unavailable',
      );
      for (const [, name, params] of events) {
        assert.ok(
          [
            'step_result_controls_viewed',
            'step_result_failed',
            'step_result_saved',
          ].includes(name),
        );
        assert.ok(['step-1', 'step-2'].includes(params.step_id));
        assert.deepEqual(
          Object.keys(params).sort(),
          [
            'step_id',
            'page_location',
            'page_title',
            'page_referrer',
            ...(name === 'step_result_controls_viewed' ? [] : ['outcome']),
            ...(name === 'step_result_failed' ? ['failure'] : []),
          ].sort(),
        );
        assert.ok(!JSON.stringify(params).includes('PRIVATE_ERROR'));
      }
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      const before = events.length;
      await page.evaluate(() => {
        const original = window.gtag;
        delete window.gtag;
        analytics.trackStepResultSaved('resolved', location.pathname, 'step-3');
        window.gtag = original;
        analytics.trackStepResultSaved('resolved', '/admin', 'step-3');
        analytics.trackStepResultSaved(
          'resolved',
          location.pathname,
          'private note@example.com',
        );
        analytics.trackStepResultSaved(
          'resolved',
          location.pathname + '?secret=value',
          'step-3',
        );
        history.replaceState(null, '', '/reports');
        analytics.trackStepResultSaved(
          'resolved',
          '/games/ace-combat-8/error-st-3100001',
          'step-3',
        );
      });
      assert.equal(
        await page.evaluate(() => events.length),
        before,
        'disabled and private paths/data suppressed',
      );
      assert.equal(posts, 3);
      await context.close();
    }
  console.log(
    'PASS: EN/ZH/ES 390/1440px; actual visibility, rerender dedupe, STEP IDs, failed save/retry, next/final links, disabled analytics and privacy whitelist. All browser requests intercepted; no real votes or GA.',
  );
} finally {
  await browser.close();
}
