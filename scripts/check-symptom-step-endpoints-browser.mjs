import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
await mkdir('outputs/symptom-endpoints', { recursive: true });
try {
  for (const width of [375, 390, 430]) {
    for (const fixture of [
      {
        path: '/games/final-fantasy-resonance/not-launching',
        id: 'step-2',
        href: '/trouble/not-launching',
        unrelated: '体験版',
      },
      {
        path: '/games/dragons-dogma-2/performance',
        id: 'step-5',
        href: '/trouble/fps',
        unrelated: 'DLC',
      },
    ]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const errors = [];
      const requests = [];
      await context.route('**/*', (route) => {
        const request = route.request();
        const url = new URL(request.url());
        assert.ok(
          !(url.href + (request.postData() || '')).includes('PRIVATE_ENDPOINT'),
        );
        if (url.origin !== new URL(base).origin) return route.abort();
        if (url.pathname.startsWith('/api/')) {
          requests.push(request.method());
          return route.fulfill({
            json: {
              rows: [],
              methods: [],
              stepResultsAvailable: false,
              feedbackAvailable: false,
            },
          });
        }
        return route.continue();
      });
      const page = await context.newPage();
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(base + fixture.path, { waitUntil: 'networkidle' });
      const step = page.locator(`#${fixture.id}`);
      assert.equal(await step.locator('.step-skip').count(), 0);
      const button = step.getByRole('button', {
        name: '試したが直らない → 結果を整理して次の相談先を確認',
      });
      assert.ok(!(await button.innerText()).includes(fixture.unrelated));
      await button.click();
      const endpoint = step.getByRole('complementary', {
        name: 'この症状の次の行動',
      });
      await endpoint.waitFor();
      assert.equal(
        await endpoint.locator(`a[href="${fixture.href}"]`).count(),
        1,
      );
      assert.equal(await endpoint.locator('a[href="#references"]').count(), 1);
      assert.ok(
        (await page.locator('#references a[href^="https://"]').count()) > 0,
      );
      assert.ok(await step.evaluate((el) => el.classList.contains('current')));
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await endpoint.scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `outputs/symptom-endpoints/${fixture.path.split('/')[2]}-${width}.png`,
      });
      await step
        .getByRole('button', { name: 'ノートを確認して保存', exact: true })
        .click();
      await step
        .locator('form textarea')
        .first()
        .fill('PRIVATE_ENDPOINT synthetic symptom');
      await step
        .getByRole('button', { name: 'ノートに保存する', exact: true })
        .click();
      const notes = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('gemnao-solutions-v1')),
      );
      assert.equal(
        notes.items[0].stepId,
        fixture.id,
        'saved unresolved note stays at symptom endpoint',
      );
      assert.equal(notes.items[0].support.attempts[0].stepId, fixture.id);
      await page.reload({ waitUntil: 'networkidle' });
      assert.ok(
        await page
          .locator(`#${fixture.id}`)
          .evaluate((el) => el.classList.contains('current')),
        'resume remains in same symptom',
      );
      assert.equal(
        requests.filter((method) => method === 'POST').length,
        0,
        'unavailable collection makes no vote',
      );
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  console.log(
    'PASS: FF/Dogma endpoints at 375/390/430, matched links, source anchor, no horizontal overflow, saved/resumed STEP IDs, no private-note network requests; all APIs mocked',
  );
} finally {
  await browser.close();
}
