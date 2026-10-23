import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { readFile, mkdir } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3008';
const out = process.env.TEST_SCREENSHOT_DIR || '/tmp/guide-game-links';
await mkdir(out, { recursive: true });
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const allGuides = Object.keys(manifest).filter((p) => /^\/guide\/.+/.test(p));
const target = [
  'stutter-fix',
  'shader-cache-delete',
  'steam-cloud-sync-error',
  'vram-shortage',
];
const translated = Object.keys(manifest).filter((p) =>
  /^\/(en|zh|es)\/guide\//.test(p),
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const width of [375, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    await context.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== base) return r.abort();
      if (u.pathname.startsWith('/api/'))
        return r.fulfill({ json: { rows: [], methods: [] } });
      return r.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const links = new Set();
    for (const path of [
      ...allGuides,
      ...translated,
      '/',
      '/games/onimusha-way-of-the-sword',
      '/games/aniimo/launcher-display',
    ]) {
      assert.equal(
        (await page.goto(base + path, { waitUntil: 'networkidle' })).status(),
        200,
        path,
      );
      assert.equal(await page.locator('h1').count(), 1, path);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        path + ' overflow',
      );
      assert.equal(
        await page.locator('head meta[property="og:image"]').count(),
        1,
        path,
      );
      assert.equal(
        await page.locator('head link[rel="canonical"]').getAttribute('href'),
        'https://gemnao.pages.dev' + (path === '/' ? '' : path),
      );
      const section = page.locator('section.related-section').filter({
        has: page.getByRole('heading', {
          name: 'ゲーム別の対処法',
          exact: true,
        }),
      });
      const localHtml = manifest[path]
        ? await readFile('dist/client' + manifest[path], 'utf8')
        : '';
      const expected = [
        ...localHtml.matchAll(
          /<section class="related-section"><h2>ゲーム別の対処法<\/h2>(.*?)<\/section>/gs,
        ),
      ].flatMap((m) => [...m[1].matchAll(/href="([^"]+)"/g)].map((x) => x[1]));
      assert.deepEqual(
        await section
          .locator('a')
          .evaluateAll((es) => es.map((e) => e.getAttribute('href'))),
        expected,
        path,
      );
      for (const href of expected) links.add(href);
      if (
        target.some((s) => path === '/guide/' + s) ||
        path === '/guide/low-gpu-usage'
      ) {
        if (await section.count()) await section.scrollIntoViewIfNeeded();
        else await page.locator('#related-guides').scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${out}/${path.split('/').pop()}-${width}.png`,
        });
      }
    }
    for (const href of links)
      assert.equal(
        (await context.request.get(base + href)).status(),
        200,
        href,
      );
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        width,
        guidePages: allGuides.length,
        translatedPages: translated.length,
        gameLinks: links.size,
        overflow: false,
        errors,
      }),
    );
    await context.close();
  }
} finally {
  await browser.close();
}
