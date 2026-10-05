// Run with PLAYWRIGHT_MODULE pointing at an installed playwright package if needed.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  args: ['--no-sandbox'],
});
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await context.newPage();
const requests = [];
const errors = [];
page.on('request', (r) => requests.push(r.url() + ' ' + (r.postData() || '')));
page.on('pageerror', (e) => errors.push(e.message));
// Never exercise real feedback, D1 or external services in this UI test.
await context.route('**/api/**', (r) =>
  r.fulfill({ json: { rows: [], methods: [], items: [] } }),
);
await context.route(/^https?:\/\/(?!localhost:3000)/, (r) => r.abort());
const state = () =>
  page.evaluate(
    () => JSON.parse(localStorage.getItem('gemnao-solutions-v1')).items,
  );
try {
  await page.goto(base + '/en/my-games');
  const workspace = page.locator('.support-workspace').first();
  await workspace
    .getByRole('button', { name: 'Save a new issue', exact: true })
    .click();
  await workspace
    .getByLabel('Issue title', { exact: true })
    .fill('PRIVATE_SENTINEL crash');
  await workspace
    .getByLabel('Game', { exact: true })
    .selectOption('cyberpunk-2077');
  await workspace
    .getByLabel('Symptoms and diagnosis', { exact: true })
    .fill('PRIVATE_SENTINEL C:\\Users\\alice\\log.txt');
  await workspace
    .getByRole('button', { name: 'Save note', exact: true })
    .click();
  assert.equal((await state()).length, 1);
  const id = (await state())[0].id;
  await page.reload();
  await workspace.locator('.support-tools').waitFor();
  assert.equal(
    await workspace.getByLabel('Issue notebook', { exact: true }).inputValue(),
    id,
  );
  await page.goto(base + '/en/games/cyberpunk-2077/not-launching');
  await page
    .locator('.support-workspace')
    .getByText('Attempts across articles (0)', { exact: true })
    .click();
  await page.getByLabel('Result', { exact: true }).selectOption('unresolved');
  await page
    .getByRole('button', { name: 'Record result', exact: true })
    .dblclick();
  assert.equal((await state())[0].support.attempts.length, 1);
  await page.goto(base + '/guide/no-game-audio');
  await page
    .locator('.support-tools summary')
    .filter({ hasText: '記事をまたいだ試行履歴' })
    .click();
  await page.getByLabel('結果', { exact: true }).selectOption('unresolved');
  await page
    .getByRole('button', { name: '結果を記録', exact: true })
    .dblclick();
  assert.equal((await state())[0].support.attempts.length, 2);
  await page
    .getByRole('button', { name: /^直らない → 次は/ })
    .first()
    .click();
  assert.equal((await state())[0].support.attempts.length, 2);
  assert.equal(
    await page.evaluate(() =>
      Object.keys(localStorage).some(
        (key) =>
          key.startsWith('gemnao-progress:') &&
          JSON.parse(localStorage.getItem(key)).currentStep === 1,
      ),
    ),
    false,
  );
  await page.goBack();
  await page.goForward();
  await page.reload();
  assert.equal((await state())[0].support.attempts.length, 2);
  await page.goto(base + '/en/my-games');
  await page
    .getByText('Temporary settings checklist (0)', { exact: true })
    .click();
  await page.getByLabel('Setting changed', { exact: true }).fill('Overlay');
  await page.getByLabel('Original value', { exact: true }).fill('On');
  await page
    .getByLabel('How to restore it', { exact: true })
    .fill('Enable overlay');
  await page
    .getByRole('button', { name: 'Add setting', exact: true })
    .dblclick();
  assert.equal((await state())[0].support.reversions.length, 1);
  await page
    .getByLabel('Overlay: Status', { exact: true })
    .selectOption('restored');
  assert.equal((await state())[0].support.reversions[0].state, 'restored');
  await page
    .getByLabel('Overlay: Status', { exact: true })
    .selectOption('kept');
  assert.equal((await state())[0].support.reversions[0].state, 'kept');
  await page
    .getByText('Support summary: preview and copy', { exact: true })
    .click();
  assert.ok(
    !(
      await page.getByLabel('Editable preview', { exact: true }).inputValue()
    ).includes('PRIVATE_SENTINEL'),
  );
  await page.getByLabel('Symptoms (original text)', { exact: true }).check();
  const preview = await page
    .getByLabel('Editable preview', { exact: true })
    .inputValue();
  assert.ok(preview.includes('not automatically translated'));
  assert.ok(!preview.includes('alice'));
  await page
    .getByLabel('Editable preview', { exact: true })
    .fill('Reviewed text');
  await page.getByRole('button', { name: 'Copy text', exact: true }).click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    'Reviewed text',
  );
  // Clipboard rejection is reported, with manual-copy fallback.
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, 'writeText', {
      configurable: true,
      value: () => Promise.reject(new Error('blocked')),
    }),
  );
  await page.getByRole('button', { name: 'Copy text', exact: true }).click();
  await page
    .getByText('Copy failed. Select and copy the preview manually.', {
      exact: true,
    })
    .waitFor();
  // Storage failure must not update the saved value or report success.
  const before = await state();
  await page.evaluate(() => {
    window.__originalSet = function (...args) {
      return Reflect.apply(Storage.prototype.__gemnaoSet, this, args);
    };
    // oxlint-disable-next-line typescript/unbound-method -- Save native implementation for failure injection.
    Storage.prototype.__gemnaoSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function () {
      throw new DOMException('full', 'QuotaExceededError');
    };
  });
  await page
    .getByLabel('Overlay: Status', { exact: true })
    .selectOption('pending');
  await page.getByRole('alert').waitFor();
  assert.deepEqual(await state(), before);
  await page.evaluate(() => {
    Storage.prototype.setItem = window.__originalSet;
  });
  // Keyboard-only disclosure interaction and mobile widths, in all four languages.
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    await page.goto(base + (locale === 'ja' ? '' : '/' + locale) + '/my-games');
    const section = page.locator('.support-workspace').first();
    await section.locator('.support-tools').waitFor();
    await section.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(
      await section.locator('details').first().getAttribute('open'),
      '',
    );
    for (const width of [375, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await section
        .locator('details')
        .evaluateAll((nodes) => nodes.forEach((n) => (n.open = true)));
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${locale} ${width}: overflow`,
      );
      assert.ok(
        await section
          .locator('textarea')
          .last()
          .evaluate((el) => el.getBoundingClientRect().right <= innerWidth),
      );
    }
    await section.screenshot({ path: `/tmp/gemnao-support-${locale}.png` });
  }
  // Legacy note and progress remain readable, and a fresh browser context resumes persisted data.
  const snapshot = await context.storageState();
  const fresh = await browser.newContext({ storageState: snapshot });
  await fresh.route('**/api/**', (r) =>
    r.fulfill({ json: { rows: [], methods: [], items: [] } }),
  );
  const p2 = await fresh.newPage();
  await p2.goto(base + '/en/my-games');
  await p2.locator('.support-tools').waitFor();
  assert.equal(
    await p2.getByLabel('Issue notebook', { exact: true }).inputValue(),
    id,
  );
  await fresh.close();
  assert.ok(
    requests.every((r) => !r.includes('PRIVATE_SENTINEL')),
    'private text leaked into network',
  );
  assert.deepEqual(errors, []);
  console.log(
    'PASS browser: create, reload, cross-article, back/forward, repeated clicks, restore states, preview/copy/fallback, quota, keyboard, ja/en/zh/es at 375/390/430, fresh-context resume, privacy',
  );
} finally {
  await browser.close();
}
