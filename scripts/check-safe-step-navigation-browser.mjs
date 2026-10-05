import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const path = '/guide/steam-input-controller';
const key = 'gemnao-solutions-v1';
const fixture = (id) => ({
  id,
  title: `PRIVATE_NAV ${id}`,
  gameSlug: '',
  status: 'unresolved',
  diagnosis: 'Synthetic controller symptom',
  settings: '',
  notes: '',
  articlePath: path,
  stepId: 'step-2',
  completedSteps: [],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
});
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
await mkdir('outputs/safe-navigation', { recursive: true });
try {
  for (const width of [375, 390, 430, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
    });
    const posts = [];
    const errors = [];
    await context.route('**/*', (r) => {
      const url = new URL(r.request().url());
      assert.ok(
        !(url.href + (r.request().postData() || '')).includes('PRIVATE_NAV'),
      );
      if (url.origin !== new URL(base).origin) return r.abort();
      if (url.pathname.startsWith('/api/')) {
        if (r.request().method() === 'POST')
          posts.push(JSON.parse(r.request().postData()));
        return r.fulfill({ json: { rows: [], methods: [] } });
      }
      return r.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const first = page.locator('#step-1');
    const second = page.locator('#step-2');
    const unknown = first.getByRole('link', {
      name: '未確認・認識しない → 接続とメーカー診断を確認',
      exact: true,
    });
    const confirmed = first.getByRole('link', {
      name: '機器名とボタン反応を確認した → ゲーム別設定を比較',
      exact: true,
    });
    assert.equal(
      await first.locator('.step-skip').count(),
      0,
      'no prerequisite-bypassing skip',
    );
    assert.equal(
      await second.locator('button.step-next').count(),
      0,
      'game comparison gated initially',
    );
    await first.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `outputs/safe-navigation/steam-input-${width}.png`,
    });
    await unknown.focus();
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#input-device');
    assert.ok(
      (await page.locator('#input-device').innerText()).includes(
        'メーカーの公式サポート',
      ),
    );
    assert.equal(
      await page.locator('.interactive-step.completed').count(),
      0,
      'unknown is not a tried or solved step',
    );
    await page
      .locator('#input-device')
      .getByRole('link', { name: '接続を確認したら、STEP 1で認識の結果を選ぶ' })
      .focus();
    await page.keyboard.press('Enter');
    await confirmed.focus();
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#step-2');
    assert.equal(await second.locator('button.step-next').count(), 1);
    assert.equal(
      posts.length,
      0,
      'recognition is not an anonymous solution report',
    );
    assert.equal(
      await page
        .locator('.result-note,.success-share,.interactive-step.completed')
        .count(),
      0,
    );
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.goForward({ waitUntil: 'domcontentloaded' });
    assert.equal(new URL(page.url()).hash, '#step-2');
    // Legacy progress never proves recognition for an unresolved issue.
    await page.evaluate(
      ({ key, items }) => {
        localStorage.setItem(key, JSON.stringify({ version: 1, items }));
        localStorage.setItem('gemnao-active-solution', 'A');
        localStorage.setItem(
          'gemnao-progress:guide-steam-input-controller',
          JSON.stringify({
            currentStep: 2,
            completedIds: ['step-1', 'step-2'],
            solved: true,
            solvedStepId: 'step-2',
            lastViewedAt: '2026-09-30T00:00:00Z',
          }),
        );
      },
      { key, items: [fixture('A'), fixture('B')] },
    );
    await page.reload({ waitUntil: 'networkidle' });
    const read = () =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)).items, key);
    const original = await read();
    assert.ok(
      (await page.locator('.resume-panel').innerText()).includes('STEP 1'),
    );
    assert.equal(await second.locator('button.step-next').count(), 0);
    const select = page.getByLabel('問題のノート', { exact: true });
    await confirmed.click();
    await select.selectOption('B');
    assert.equal(
      await second.locator('button.step-next').count(),
      0,
      'A confirmation not inherited by B',
    );
    await select.selectOption('A');
    assert.equal(
      await second.locator('button.step-next').count(),
      1,
      'A session confirmation retained',
    );
    await second.locator('button.step-next').click();
    const prompt = second.locator('.result-note');
    await prompt.getByRole('button', { name: 'ノートを確認して保存' }).click();
    await prompt.getByLabel('保存先のノート').selectOption('A');
    await prompt
      .getByRole('button', { name: 'キャンセル', exact: true })
      .click();
    assert.deepEqual(
      await read(),
      original,
      'cancel and confirmation do not write notes',
    );
    await prompt.getByRole('button', { name: '案内を閉じる' }).click();
    await second.locator('button.step-next').click();
    await prompt.getByRole('button', { name: 'ノートを確認して保存' }).click();
    await prompt.getByLabel('保存先のノート').selectOption('A');
    await prompt.getByRole('button', { name: 'ノートに保存する' }).click();
    assert.equal(
      (await read()).find((i) => i.id === 'A').support.attempts[0].stepId,
      'step-2',
    );
    assert.equal(posts.length, 0);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(
      await second.locator('button.step-next').count(),
      0,
      'saved progress alone does not assert recognition',
    );
    await confirmed.click();
    await second.locator('.step-solved').click();
    await page.locator('.success-share').waitFor();
    await page.waitForFunction(() =>
      Boolean(
        localStorage.getItem(
          'gemnao-feedback:guide-steam-input-controller:controller:resolved',
        ),
      ),
    );
    assert.equal(posts.length, 1);
    assert.equal(posts[0].kind, 'step-solved');
    assert.equal(posts[0].method, 'step-2');
    await select.selectOption('B');
    assert.equal(await page.locator('.success-share').count(), 0);
    await confirmed.click();
    await second.locator('.step-solved').click();
    await page.locator('.success-share').waitFor();
    assert.equal(posts.length, 1, 'anonymous dedup retained across issues');
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    // Inspect all existing Cyberpunk language versions, including the changed text.
    for (const locale of ['', '/en', '/zh', '/es']) {
      const response = await page.goto(
        base + locale + '/games/cyberpunk-2077/not-launching#verify-files',
        { waitUntil: 'networkidle' },
      );
      assert.equal(response.status(), 200);
      await page.locator('#verify-files').waitFor();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${locale} ${width}`,
      );
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${width}px: keyboard unknown/confirmed branches, no recognition votes/writes, no bypass skip, legacy/notes A→B→A, cancel/save/reload, game-result dedup, 4-language article layout`,
    );
  }
} finally {
  await browser.close();
}
