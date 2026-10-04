// Run against a local built preview. External services and APIs are never exercised.
// Optional: TEST_BASE_URL, PLAYWRIGHT_MODULE, CHROMIUM_PATH.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--no-sandbox'],
});
const target = '#media-playback';
const paths = ['/games/monster-hunter-wilds/not-launching', '/en/games/monster-hunter-wilds/not-launching'];
let checks = 0;
async function arrived(page) {
  // Wait past the long-distance native smooth scroll, then assert the settled position.
  await page.waitForTimeout(1800);
  const state = await page.evaluate(() => ({
    hash: location.hash,
    top: document.querySelector('#media-playback')?.getBoundingClientRect().top,
    margin: parseFloat(getComputedStyle(document.querySelector('#media-playback')).scrollMarginTop),
    width: innerWidth,
    url: location.href,
  }));
  assert.equal(state.hash, target, JSON.stringify(state));
  assert.ok(Math.abs(state.top - state.margin) < 2, JSON.stringify(state));
  assert.equal(await page.locator(target).count(), 1);
  checks++;
}

try {
  for (const width of [390, 1165, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      return url.origin !== new URL(base).origin || url.pathname.startsWith('/api/')
        ? route.abort() : route.continue();
    });
    const page = await context.newPage();
    for (const path of paths) {
      for (const selector of [`aside a[href="${target}"]`, `.diagnosis-table a[href="${target}"]`]) {
        await page.goto('about:blank');
        await page.goto(base + path, { waitUntil: 'networkidle' });
        const link = page.locator(selector);
        await link.click();
        await arrived(page);
        if (path.startsWith('/en') && selector.startsWith('.diagnosis')) {
          assert.equal(await link.evaluate((element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
          }), 1, `Step label wraps at ${width}px`);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${path} at ${width}px`);
      }
      // Existing fragment URLs and keyboard navigation must also arrive after hydration.
      await page.goto('about:blank');
      await page.goto(base + path + target, { waitUntil: 'networkidle' });
      await arrived(page);
      await page.goto('about:blank');
      await page.goto(base + path, { waitUntil: 'networkidle' });
      await page.locator(`.diagnosis-table a[href="${target}"]`).focus();
      await page.keyboard.press('Enter');
      await arrived(page);
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1165, height: 900 } });
  let releaseScripts;
  const gate = new Promise((resolve) => { releaseScripts = resolve; });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(base).origin || url.pathname.startsWith('/api/')) return route.abort();
    if (route.request().resourceType() === 'script') await gate;
    return route.continue();
  });
  const page = await context.newPage();
  try {
    await page.goto(base + paths[1], { waitUntil: 'commit' });
    await page.locator(`.diagnosis-table a[href="${target}"]`).click();
    await page.waitForFunction((hash) => location.hash === hash, target);
  } finally {
    releaseScripts();
  }
  await page.waitForFunction(() => window.__NEXT_HYDRATED === true);
  await arrived(page);
  await context.close();
  console.log(`Article fragment browser checks passed: ${checks} settled arrivals; JA/EN, 390/1165/1440px, pointer/keyboard/deep link/delayed hydration.`);
} finally {
  await browser.close();
}
