import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
const base = 'http://127.0.0.1:3100';
const coverage = JSON.parse(
  readFileSync('docs/evidence-coverage-2026-10-25/coverage.json'),
);
const changed = coverage.articles
  .filter((a) => a.disposition === 'changed')
  .map((a) => a.path);
const routes = [
  ...changed,
  '/zh/guide/pc-game-crash',
  '/es/guide/pc-game-crash',
];
const out = 'outputs/evidence-coverage-2026-10-25';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox'],
});
const errors = [],
  badAssets = [],
  writes = [],
  results = [];
try {
  for (const width of [375, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      serviceWorkers: 'block',
    });
    await context.route('**/*', (route) => {
      const req = route.request(),
        url = new URL(req.url());
      if (!['GET', 'HEAD'].includes(req.method())) {
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
    for (const path of routes) {
      const response = await page.goto(base + path, {
        waitUntil: 'networkidle',
      });
      assert.equal(response.status(), 200, path);
      assert.equal(await page.locator('h1').count(), 1, path);
      assert.equal(
        await page.locator('head link[rel=canonical]').getAttribute('href'),
        'https://gemnao.pages.dev' + path,
      );
      assert(
        await page.locator('head meta[property="og:image"]').count(),
        path,
      );
      assert(
        await page.locator('#references a[href^="https://"]').count(),
        path,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        path,
      );
      assert(
        (await page.locator('.procedure-card,.pc-step').count()) > 0,
        path,
      );
      if (path.startsWith('/zh/'))
        assert.match(await page.locator('main').innerText(), /资料核对记录/);
      else if (path.startsWith('/es/'))
        assert.match(
          await page.locator('main').innerText(),
          /Registro de revisión de fuentes/,
        );
      else
        assert.match(await page.locator('main').innerText(), /資料の確認記録/);
      if (
        path === '/games/onimusha-way-of-the-sword/low-fps' ||
        path === '/guide/ray-tracing-gpu'
      )
        await page.screenshot({
          path: `${out}/${width}-${path.replaceAll('/', '_')}.png`,
          fullPage: true,
        });
      results.push({ path, width, status: 200 });
    }
    // Existing sufficient categories and the first-wave scope remain readable.
    for (const path of [
      '/discord/error-1002',
      '/pc/microphone-after-update',
      '/en/guide/directx-error',
      '/',
      '/tools',
    ]) {
      assert.equal(
        (await page.goto(base + path, { waitUntil: 'networkidle' })).status(),
        200,
        path,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        path,
      );
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(badAssets, []);
  assert.deepEqual(writes, []);
  writeFileSync(
    out + '/results.json',
    JSON.stringify(
      { results, controls: 10, errors, badAssets, writes },
      null,
      2,
    ) + '\n',
  );
  console.log(
    `PASS: ${results.length} article/viewport checks + 10 controls; canonical/OG/sources/procedures/date labels, no overflow/JS errors/bad assets/writes`,
  );
} finally {
  await browser.close();
}
