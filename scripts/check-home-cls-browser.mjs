// Local built preview only. All API responses are mocked; no D1 or external traffic.
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const origin = new URL(base).origin;
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--no-sandbox'],
});
const rects = (page) => page.evaluate(() => {
  const box = (selector) => {
    const rect = document.querySelector(selector).getBoundingClientRect();
    return { top: rect.top + scrollY, height: rect.height };
  };
  return { slot: box('.diagnosis-cta-home-slot'), symptoms: box('#symptoms') };
});
const nextPaint = (page) => page.evaluate(() => new Promise((resolve) =>
  requestAnimationFrame(() => requestAnimationFrame(resolve))));
const stable = (before, after, label) => {
  for (const name of ['slot', 'symptoms']) {
    for (const key of ['top', 'height']) {
      assert.ok(Math.abs(before[name][key] - after[name][key]) < 0.5,
        label + ': ' + name + '.' + key + ' moved');
    }
  }
};
let checks = 0;
try {
  for (const width of [360, 390, 640, 768, 1280]) {
    for (const outcome of ['enabled', 'disabled', 'invalid', 'error', 'focused']) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      let release;
      const held = new Promise((resolve) => { release = resolve; });
      let requested;
      const configRequested = new Promise((resolve) => { requested = resolve; });
      let completed;
      const configCompleted = new Promise((resolve) => { completed = resolve; });
      await context.route('**/*', async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== origin) return route.abort();
        if (url.pathname === '/api/diagnosis/config') {
          requested();
          await held;
          if (outcome === 'error') await route.abort();
          else await route.fulfill({ json: outcome === 'invalid' ? {} : {
            enabled: outcome === 'enabled' || outcome === 'focused',
            sharing: false, metrics: false, localOnly: true,
          } });
          completed();
          return;
        }
        if (url.pathname.startsWith('/api/')) return route.abort();
        return route.continue();
      });
      try {
        const response = await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200);
        let timeout;
        try {
          await Promise.race([
            configRequested,
            new Promise((_, reject) => {
              timeout = setTimeout(() => reject(new Error('config was not requested; use a beta-enabled build')), 15000);
            }),
          ]);
        } finally {
          clearTimeout(timeout);
        }
        const fallback = page.getByRole('link', { name: '症状から解決記事を探す →', exact: true });
        assert.equal(await fallback.isVisible(), true);
        assert.equal(await page.locator('.diagnosis-cta-home-slot a[href="/diagnose"]').count(), 0);
        assert.equal(await page.locator('.diagnosis-cta-home-slot [aria-hidden="true"] a').count(), 0);
        const before = await rects(page);
        if (outcome === 'focused') await fallback.focus();
        release();
        await configCompleted;
        if (outcome === 'enabled') {
          await page.getByRole('link', { name: '無料診断をはじめる →', exact: true }).waitFor();
        } else {
          await nextPaint(page);
          assert.equal(await fallback.isVisible(), true);
          assert.equal(await page.locator('.diagnosis-cta-home-slot a[href="/diagnose"]').count(), 0);
        }
        await nextPaint(page);
        stable(before, await rects(page), width + ' ' + outcome);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.equal(await page.locator('.diagnosis-cta-home-slot [aria-hidden="true"] a').count(), 0);
        if (outcome === 'focused') {
          assert.equal(await fallback.evaluate((el) => document.activeElement === el), true);
          await page.keyboard.press('Enter');
          assert.equal(new URL(page.url()).hash, '#symptoms');
          await page.locator('input[type="search"]').focus();
          await page.getByRole('link', { name: '無料診断をはじめる →', exact: true }).waitFor();
          stable(before, await rects(page), width + ' after fallback blur');
        }
        checks++;
      } finally {
        release();
        await context.close();
      }
    }
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      return url.origin !== origin || url.pathname.startsWith('/api/') ? route.abort() : route.continue();
    });
    const page = await context.newPage();
    await page.goto(base + '/');
    assert.equal(await page.getByRole('link', { name: '症状から解決記事を探す →', exact: true }).isVisible(), true);
    assert.equal(await page.locator('.diagnosis-cta-home-slot a[href="/diagnose"]').count(), 0);
    await context.close();
  }
  console.log('PASS: ' + checks + ' home runtime-gate/layout/focus cases and 5 no-JS widths; no production API or external requests');
} finally {
  await browser.close();
}
