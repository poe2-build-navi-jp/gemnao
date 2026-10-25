import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
const base = 'http://127.0.0.1:3098';
const out = 'outputs/search-evidence-2026-10-25';
mkdirSync(out, { recursive: true });
const robots = await fetch(base + '/robots.txt');
assert.equal(robots.status, 200);
const policy = await robots.text();
assert.match(
  policy,
  /User-agent: OAI-SearchBot\nAllow: \/\nDisallow: \/admin\nDisallow: \/api/i,
);
assert.match(policy, /User-agent: GPTBot\nDisallow: \/(?:\n|$)/i);
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox'],
});
const results = [];
const errors = [];
const badAssets = [];
const writes = [];
try {
  for (const width of [375, 390, 430, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      serviceWorkers: 'block',
    });
    await context.route('**/*', (route) => {
      const request = route.request(),
        url = new URL(request.url());
      if (!['GET', 'HEAD'].includes(request.method())) {
        writes.push(url.pathname);
        return route.abort();
      }
      if (url.origin !== base) return route.abort();
      if (url.pathname.startsWith('/api/'))
        return route.fulfill({
          status: 503,
          json: { error: 'local read-only test' },
        });
      return route.continue();
    });
    await context.routeWebSocket('**/*', (socket) => socket.close());
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => {
      if (/\.(css|js)(?:\?|$)/.test(r.url()) && r.status() >= 400)
        badAssets.push(r.url());
    });
    for (const path of [
      '/games/monster-hunter-wilds/not-launching',
      '/guide/steam-game-not-launching',
      '/guide/verify-steam-files',
      '/guide/directx-error',
    ]) {
      const response = await page.goto(base + path, {
        waitUntil: 'networkidle',
      });
      assert.equal(response.status(), 200, path);
      assert.equal(await page.locator('h1').count(), 1, path);
      assert.equal(await page.locator('#article-evidence').count(), 1, path);
      const positions = await page.evaluate(() => {
        const evidence = document.getElementById('article-evidence');
        const conclusion = document.querySelector('.answer-summary');
        const steps = [...document.querySelectorAll('[id]')].filter(
          (el) => el.id === 'step-1' || el.id === 'verify-files',
        );
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          hasConclusion: !!conclusion,
          afterConclusion: !!(
            conclusion?.compareDocumentPosition(evidence) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
          afterSteps: steps.some(
            (step) =>
              !!(
                step.compareDocumentPosition(evidence) &
                Node.DOCUMENT_POSITION_FOLLOWING
              ),
          ),
        };
      });
      assert.deepEqual(
        positions,
        {
          overflow: false,
          hasConclusion: true,
          afterConclusion: true,
          afterSteps: true,
        },
        path,
      );
      const canonical = await page
        .locator('head link[rel=canonical]')
        .getAttribute('href');
      assert.equal(canonical, 'https://gemnao.pages.dev' + path);
      assert(await page.locator('head meta[property="og:image"]').count());
      if (path.includes('monster-hunter')) {
        assert.match(
          await page.locator('#article-evidence').innerText(),
          /本人報告1件/,
        );
        assert.equal(
          await page
            .locator(
              '#article-evidence a[href="/examples/wilds-steam-added-dll"]',
            )
            .count(),
          1,
        );
      }
      const image = `${width}-${path.replaceAll('/', '_')}.png`;
      await page.screenshot({ path: out + '/' + image, fullPage: true });
      results.push({ width, path, status: 200, image, ...positions });
    }
    await context.close();
  }
  const page = await browser.newPage();
  await page.route('**/*', (route) =>
    new URL(route.request().url()).origin === base
      ? route.continue()
      : route.abort(),
  );
  for (const path of [
    '/',
    '/en',
    '/tools',
    '/games/rocket-league/dualsense-not-working',
    '/en/games/rocket-league/dualsense-not-working',
  ]) {
    assert.equal(
      (
        await page.goto(base + path, { waitUntil: 'domcontentloaded' })
      ).status(),
      200,
    );
    assert.equal(
      await page.locator('#article-evidence').count(),
      0,
      'No new generic block: ' + path,
    );
    if (path.includes('rocket-league'))
      assert.equal(
        await page.locator('.article-evidence').count(),
        1,
        'Existing localized evidence retained',
      );
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(badAssets, []);
  assert.deepEqual(writes, []);
  writeFileSync(
    out + '/results.json',
    JSON.stringify(
      { results, controls: 5, robots: 'passed', errors, badAssets, writes },
      null,
      2,
    ),
  );
  console.log(
    'PASS: local rendered robots, 16 article/viewport checks, 5 controls, section order/canonical/OG, no overflow/JS errors/bad assets/writes',
  );
} finally {
  await browser.close();
}
