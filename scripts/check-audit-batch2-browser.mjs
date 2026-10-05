import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3001';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
const routes = [
  '/games/shin-sangoku-musou-2-remastered',
  '/games/shin-sangoku-musou-2-remastered/not-launching',
  '/games/final-fantasy-resonance',
  '/games/ace-combat-8/not-launching',
  '/weekly/2026-09-28',
];
const banned = ['情報の状態：確認済み'];
await mkdir('outputs/evidence-safety', { recursive: true });
let checked = 0;
try {
  for (const width of [375, 390, 430, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 960 } });
    await ctx.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== new URL(base).origin) return r.abort();
      if (u.pathname.startsWith('/api/'))
        return r.fulfill({ json: { rows: [], methods: [] } });
      return r.continue();
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const path of routes) {
      const response = await page.goto(base + path, {
        waitUntil: 'networkidle',
      });
      assert.equal(response.status(), 200, path);
      for (const details of await page.locator('main details').all()) {
        if (!(await details.getAttribute('open')))
          await details.locator('summary').click();
      }
      const text = await page.locator('main').innerText();
      for (const needle of banned)
        assert.ok(
          !text.includes(needle),
          `${path}: unsafe instruction ${needle}`,
        );
      if (path.includes('shin-sangoku') && path.endsWith('/not-launching'))
        assert.ok(text.includes('RX 6700 XT（12GB）'), path);
      if (path.includes('/weekly/'))
        assert.ok(await page.locator('a[href*="patch-note_v1-3-1"]').count());
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${path} overflow at ${width}`,
      );
      checked++;
    }
    assert.deepEqual(errors, []);
    await ctx.close();
  }
  console.log(
    `PASS: ${checked} page/width combinations, corrected VRAM, primary patch link, no blanket verified badge, no overflow/JS errors; APIs mocked, external requests blocked`,
  );
} finally {
  await browser.close();
}
