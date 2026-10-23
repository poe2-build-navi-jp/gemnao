import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const evidenceDir = process.env.TEST_EVIDENCE_DIR || '/tmp/gemnao-ux-evidence';
await mkdir(evidenceDir, { recursive: true });
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('@playwright/test')); }
catch { ({ chromium } = require('playwright')); }
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
try {
  for (const locale of ['ja', 'en']) {
    for (const width of [375, 390, 430, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      // Local fixture only. Never submit answers or alter live response data.
      await page.route('**/api/feedback?*', route => route.fulfill({ json: {
        rows: [{ topic: 'launch', resolved: 1, struggling: 14 }],
        methods: [{ methodId: 'sync-time', methodLabel: 'Time sync', responses: 1, notResolved: 21 }],
        stepResultsAvailable: true,
      } }));
      const path = `${locale === 'en' ? '/en' : ''}/games/ace-combat-8/error-st-3100001`;
      await page.goto(base + path, { waitUntil: 'networkidle' });
      const cta = page.locator('.clock-sync-first a');
      const save = page.getByRole('button', { name: locale === 'en' ? 'Save for later' : 'あとで読むに保存', exact: true });
      assert.equal(await cta.getAttribute('href'), '#sync-time');
      assert.ok((await cta.boundingBox()).y < (await save.boundingBox()).y);
      assert.ok((await cta.boundingBox()).y + (await cta.boundingBox()).height < 900);
      assert.equal(await page.locator('#sync-time').count(), 1);
      assert.equal(await page.locator('head link[rel="canonical"]').getAttribute('href'), 'https://gemnao.pages.dev' + path);
      assert.ok(await page.locator('head meta[property="og:image"]').getAttribute('content'));
      assert.ok(await page.locator('#references a').count());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (locale === 'ja') {
        await page.locator('.solution-data-panel').waitFor();
        assert.match(await page.locator('.solution-data-summary').innerText(), /解決 1件.*未解決 14件/s);
        assert.doesNotMatch(await page.locator('.solution-data-summary').innerText(), /%/);
        assert.match(await page.locator('#sync-time').innerText(), /21件/);
      } else {
        assert.match(await page.locator('#sync-time').innerText(), /21/);
        assert.match(await page.locator('body').innerText(), /separate aggregates/);
      }
      await page.screenshot({ path: `${evidenceDir}/${locale}-${width}.png` });
      await save.click();
      await page.getByRole('button', { name: locale === 'en' ? 'Saved (remove)' : '保存済み（外す）', exact: true }).waitFor();
      await cta.click();
      assert.equal(new URL(page.url()).hash, '#sync-time');
      await page.waitForFunction(() => { const top = document.querySelector('#sync-time').getBoundingClientRect().top; return top >= 0 && top < 200; });
      await page.screenshot({ path: `${evidenceDir}/${locale}-${width}-step.png` });
      await page.close();
      console.log(`PASS ${locale} ${width}: CTA, save, count fixture, SEO, references, no overflow`);
    }
  }
} finally { await browser.close(); }
