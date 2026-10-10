import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3027';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
await mkdir('outputs/repair-decision', { recursive: true });
let checks = 0;
try {
  for (const width of [375, 390, 430, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    await ctx.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.origin !== new URL(base).origin) return route.abort();
      if (u.pathname === '/api/diagnosis/config')
        return route.fulfill({
          json: { enabled: true, sharing: false, metrics: false },
        });
      if (u.pathname.startsWith('/api/'))
        return route.fulfill({ json: { rows: [], methods: [] } });
      return route.continue();
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const path of [
      '/pc/repair-or-replace',
      '/en/pc/repair-or-replace',
      '/zh/pc/repair-or-replace',
      '/es/pc/repair-or-replace',
      '/',
      '/pc',
      '/tools',
    ]) {
      const res = await page.goto(base + path, { waitUntil: 'networkidle' });
      assert.equal(res.status(), 200, path);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${path} overflow ${width}`,
      );
      if (path.endsWith('/pc/repair-or-replace')) {
        assert.ok(await page.locator('#repair-costs').count());
        const prices = page.locator('.repair-price-details');
        assert.equal(await prices.getAttribute('open'), null);
        await prices.locator(':scope > summary').press('Enter');
        assert.notEqual(await prices.getAttribute('open'), null);
        assert.equal(await prices.locator('[data-parts-cost]').count(), 27);
        await prices.locator(':scope > summary').press('Space');
        assert.equal(await prices.getAttribute('open'), null);
        await page.locator('.repair-article-toc a[href="#step-4"]').click();
        assert.equal(new URL(page.url()).hash, '#step-4');
        assert.ok(await page.locator('#step-4').isVisible());
        await page.goBack();
        assert.notEqual(new URL(page.url()).hash, '#step-4');

        assert.equal(
          await page.locator('link[rel=canonical]').getAttribute('href'),
          'https://gemnao.pages.dev' + path,
        );
        assert.equal(
          await page.locator('link[rel=alternate][hreflang]').count(),
          5,
        );
        assert.ok(
          (
            await page
              .locator('meta[property="og:image"]')
              .getAttribute('content')
          ).includes('/images/og/'),
        );
        for (let i = 1; i <= 4; i++)
          assert.equal(await page.locator(`#step-${i}`).count(), 1);
        if (width === 390) {
          await page.screenshot({
            path: `outputs/repair-decision/${path.split('/').filter(Boolean).join('-')}-390.png`,
          });
          await page.locator('#repair-costs').scrollIntoViewIfNeeded();
          await page.screenshot({
            path: `outputs/repair-decision/costs-${path.startsWith('/pc') ? 'ja' : path.split('/')[1]}-390.png`,
          });
        }
      } else
        assert.ok(
          await page.locator('a[href="/pc/repair-or-replace"]').count(),
          path,
        );
      checks++;
    }
    assert.deepEqual(errors, [], `JS errors ${width}`);
    await ctx.close();
  }
  console.log(
    `PASS: ${checks} page/viewport cases, real canonical/hreflang/OG/steps/entry links, no overflow or JS exceptions. External requests blocked; APIs mocked.`,
  );
} finally {
  await browser.close();
}
