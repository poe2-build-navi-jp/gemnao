// Supplement existing support/isolation regressions; local synthetic records only.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
const articlePath = '/guide/no-game-audio';
const key = 'gemnao-solutions-v1';
const legacyKey = 'gemnao-progress:guide-no-game-audio';
const fixture = (id) => ({
  id,
  title: `PRIVATE_CASE ${id}`,
  gameSlug: '',
  status: 'unresolved',
  diagnosis: `Synthetic ${id}`,
  settings: '',
  notes: '',
  articlePath,
  stepId: id === 'A' ? 'step-1' : 'step-2',
  completedSteps: [],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
});
try {
  for (const width of [375, 1440])
    for (const oldSolved of [false, true]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      let pending;
      let arrived;
      const arrival = new Promise((resolve) => {
        arrived = resolve;
      });
      const posts = [];
      const errors = [];
      await context.route('**/*', (route) => {
        const url = new URL(route.request().url());
        assert.ok(
          !(url.href + (route.request().postData() || '')).includes(
            'PRIVATE_CASE',
          ),
        );
        if (url.origin !== new URL(base).origin) return route.abort();
        if (url.pathname.startsWith('/api/')) {
          if (route.request().method() === 'POST') {
            posts.push(JSON.parse(route.request().postData()));
            if (!oldSolved && posts.length === 1) {
              pending = route;
              arrived();
              return;
            }
          }
          return route.fulfill({ json: { rows: [], methods: [] } });
        }
        return route.continue();
      });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(base + articlePath, { waitUntil: 'networkidle' });
      await page.evaluate(
        ({ key, legacyKey, oldSolved, items }) => {
          localStorage.clear();
          localStorage.setItem(key, JSON.stringify({ version: 1, items }));
          localStorage.setItem('gemnao-active-solution', '');
          localStorage.setItem(
            legacyKey,
            JSON.stringify({
              currentStep: 3,
              completedIds: ['step-3'],
              solved: oldSolved,
              solvedStepId: oldSolved ? 'step-3' : undefined,
              lastViewedAt: '2026-09-30T00:00:00Z',
            }),
          );
        },
        { key, legacyKey, oldSolved, items: [fixture('A'), fixture('B')] },
      );
      if (oldSolved)
        await page.evaluate(() => {
          // Existing no-game-audio topic is launch. Include only its actual vote key.
          localStorage.setItem(
            'gemnao-feedback:guide-no-game-audio:launch:resolved',
            '1',
          );
        });
      await page.reload({ waitUntil: 'networkidle' });
      const select = page.getByLabel('問題のノート', { exact: true });
      if (oldSolved) await page.locator('.success-share').waitFor();
      else
        assert.ok(
          (await page.locator('.resume-panel').innerText()).includes('STEP 4'),
        );
      await select.selectOption('A');
      const read = () =>
        page.evaluate(
          (key) => JSON.parse(localStorage.getItem(key)).items,
          key,
        );
      const original = await read();
      const legacyBefore = await page.evaluate(
        (k) => localStorage.getItem(k),
        legacyKey,
      );
      assert.ok(
        (await page.locator('.resume-panel').innerText()).includes('STEP 1'),
      );
      assert.equal(
        await page.locator('.success-share').count(),
        0,
        'unresolved A supersedes legacy solved',
      );
      assert.ok(await page.locator('.step-next').count());
      assert.ok(await page.locator('#step-1 .step-solved').isEnabled());
      await page.locator('#step-1 .step-solved').click();
      await page.locator('.success-share').waitFor();
      if (!oldSolved) await arrival;
      await select.selectOption('B');
      assert.equal(
        await page.locator('.success-share').count(),
        0,
        'A result is not B result',
      );
      assert.ok(
        (await page.locator('.resume-panel').innerText()).includes('STEP 2'),
      );
      assert.equal(
        await page.locator('#step-1 .result-note').count(),
        0,
        'A prompt hidden while B selected',
      );
      await page.locator('#step-2 .step-next').click();
      await page.locator('#step-2 .result-note').waitFor();
      assert.deepEqual(
        await read(),
        original,
        'neither local result autosaves',
      );
      if (!oldSolved) {
        assert.ok(pending, 'first anonymous response is still pending');
        await pending.fulfill({ json: { rows: [], methods: [] } });
        pending = undefined;
      }
      // Late anonymous response must not complete or change B.
      await page
        .locator('#step-2 .result-note')
        .getByRole('button', { name: 'ノートを確認して保存' })
        .click();
      await page
        .locator('#step-2 .result-note')
        .getByLabel('保存先のノート')
        .selectOption('B');
      await page
        .locator('#step-2 .result-note')
        .getByRole('button', { name: 'キャンセル', exact: true })
        .click();
      assert.deepEqual(await read(), original);
      await select.selectOption('A');
      await page.locator('.success-share').waitFor();
      assert.equal(
        await page.locator('.step-next, .step-skip').count(),
        0,
        'A retains only its own temporary result',
      );
      await page
        .locator('#step-1 .result-note')
        .getByRole('button', { name: 'ノートを確認して保存' })
        .click();
      await page
        .locator('#step-1 .result-note')
        .getByRole('button', { name: 'キャンセル', exact: true })
        .click();
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(
        await page.locator('.success-share').count(),
        0,
        'cancelled A result is not persisted or restored from legacy',
      );
      assert.ok(
        await page.locator('#step-1 .step-solved').isEnabled(),
        'anonymous vote does not disable notebook result',
      );
      await page.locator('#step-1 .step-solved').click();
      await page
        .locator('#step-1 .result-note')
        .getByRole('button', { name: 'ノートを確認して保存' })
        .click();
      await page
        .locator('#step-1 .result-note')
        .getByLabel('保存先のノート')
        .selectOption('A');
      await page
        .locator('#step-1 .result-note')
        .getByRole('button', { name: 'ノートに保存する' })
        .click();
      assert.equal((await read()).find((i) => i.id === 'A').status, 'resolved');
      await select.selectOption('B');
      assert.ok(await page.locator('#step-2 .step-solved').isEnabled());
      assert.ok(await page.locator('.step-next').count());
      await select.selectOption('A');
      await page.locator('.success-share').waitFor();
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('.success-share').waitFor();
      await select.selectOption('B');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.success-share').count(), 0);
      await page.locator('#step-2 .step-solved').click();
      await page.locator('.success-share').waitFor();
      assert.deepEqual(
        (await read()).find((i) => i.id === 'B'),
        original[1],
      );
      assert.equal(
        posts.length,
        oldSolved ? 0 : 1,
        'article-wide anonymous dedup across A/B and reload',
      );
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), legacyKey),
        legacyBefore,
        'legacy storage unchanged',
      );
      assert.deepEqual(errors, []);
      await context.close();
      console.log(
        `PASS ${width}px legacy solved=${oldSolved}: legacy precedence, A→B→A, in-flight response isolation, cancel/reload, explicit save, B result after anonymous vote, immutable legacy`,
      );
    }
} finally {
  await browser.close();
}
