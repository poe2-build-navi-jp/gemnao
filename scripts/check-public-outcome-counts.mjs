// Local-only UI regression: synthetic read snapshots, no writes or external traffic.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
const compiled = await build({
  entryPoints: ['lib/step-outcome-counts.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { stepOutcomeCounts } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(compiled.outputFiles[0].text).toString('base64')
);
assert.equal(stepOutcomeCounts([], 'step-1', false), null);
assert.deepEqual(stepOutcomeCounts([], 'step-1', true), {
  resolved: 0,
  notResolved: 0,
  total: 0,
});
for (const invalid of [
  -1,
  1.5,
  NaN,
  Infinity,
  '2',
  undefined,
  Number.MAX_SAFE_INTEGER + 1,
]) {
  assert.equal(
    stepOutcomeCounts(
      [{ methodId: 'step-1', responses: invalid, notResolved: 0 }],
      'step-1',
      true,
    ),
    null,
  );
  assert.equal(
    stepOutcomeCounts(
      [{ methodId: 'step-1', responses: 0, notResolved: invalid }],
      'step-1',
      true,
    ),
    null,
  );
}
for (const methods of [
  [null],
  [{}],
  [{ responses: 0, notResolved: 0 }],
  [
    { methodId: 'one', responses: 0, notResolved: 0 },
    { methodId: 'one', responses: 0, notResolved: 0 },
  ],
  [{ methodId: 'other', responses: NaN, notResolved: 0 }],
]) {
  assert.equal(
    stepOutcomeCounts(methods, 'step-1', true),
    null,
    'invalid snapshot is not zero',
  );
}
console.log(
  'PASS: snapshot validation, confirmed missing-row zero, malformed data never zero.',
);
if (process.env.UNIT_ONLY === '1') process.exit(0);
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3011';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const output = '/tmp/gemnao-public-counts-screenshots';
await mkdir(output, { recursive: true });
let requests = 0;
try {
  for (const width of [375, 390, 430, 1440])
    for (const locale of ['', '/en', '/zh', '/es']) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      let mode = 'counts';
      await context.route('**/*', async (route) => {
        const request = route.request(),
          url = new URL(request.url());
        if (url.origin !== new URL(base).origin) return route.abort();
        if (url.pathname === '/api/feedback') {
          assert.equal(
            request.method(),
            'GET',
            'public totals require no submission',
          );
          requests++;
          if (mode === 'error')
            return route.fulfill({ status: 503, body: 'unavailable' });
          return route.fulfill({
            json: {
              rows: [{ topic: 'launch', resolved: 2, struggling: 0 }],
              methods:
                mode === 'zero'
                  ? []
                  : [
                      {
                        methodId: 'step-1',
                        methodLabel: 'Synthetic',
                        responses: 2,
                        notResolved: 1,
                      },
                    ],
              stepResultsAvailable: true,
            },
          });
        }
        if (url.pathname.startsWith('/api/')) return route.abort();
        return route.continue();
      });
      const page = await context.newPage();
      const path = locale + '/games/cyberpunk-2077/not-launching';
      assert.equal(
        (await page.goto(base + path, { waitUntil: 'networkidle' })).status(),
        200,
      );
      const counts = page.locator('.step-outcome-counts');
      await counts.first().waitFor();
      const texts = await counts.allTextContents();
      assert.ok(
        texts.some((t) => t.includes('2') && t.includes('1')),
        JSON.stringify(texts),
      );
      assert.ok(
        texts.some((t) => t.match(/0.*0/)),
        'unreported steps show confirmed zero',
      );
      await counts.first().scrollIntoViewIfNeeded();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${locale}`,
      );
      assert.ok(
        await counts.evaluateAll((els) =>
          els.every((el) => el.getBoundingClientRect().right <= innerWidth),
        ),
      );
      await page.screenshot({
        path: `${output}/${width}-${locale.slice(1) || 'ja'}.png`,
      });
      mode = 'zero';
      await page.reload({ waitUntil: 'networkidle' });
      await counts.first().waitFor();
      assert.ok((await counts.first().textContent()).match(/0.*0/));
      mode = 'error';
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await counts.count(), 0);
      await context.close();
    }
  console.log(
    `PASS: public counts/confirmed zeros/failed GET, JA EN ZH ES at 375/390/430/1440px; ${requests} synthetic GETs, no POST or external traffic; ${output}`,
  );
} finally {
  await browser.close();
}
