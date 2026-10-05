import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3008';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const path = '/games/onimusha-way-of-the-sword/black-screen';
const key = 'gemnao-solutions-v1';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
try {
  for (const width of [375, 390, 430, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
    });
    const errors = [];
    await context.route('**/*', (r) => {
      const u = new URL(r.request().url());
      assert.ok(
        !(u.href + (r.request().postData() || '')).includes('PRIVATE_BLACK'),
      );
      if (u.origin !== new URL(base).origin) return r.abort();
      if (u.pathname.startsWith('/api/'))
        return r.fulfill({ json: { rows: [], methods: [] } });
      return r.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const read = () =>
      page.evaluate(
        (k) => JSON.parse(localStorage.getItem(k) || '{"items":[]}').items,
        key,
      );
    const first = page.locator('#step-1');
    const skip = first.locator('.step-skip a');
    assert.equal(await skip.getAttribute('href'), '#step-3');
    await skip.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**#step-3');
    assert.equal(
      await page.locator('[aria-label="進行状況 3 / 4"]').count(),
      1,
    );
    assert.deepEqual(await read(), []);
    await page.goBack();
    await page.goForward();
    await page.waitForURL('**#step-3');
    const visible = first.getByRole('link', {
      name: '画面が戻った場合だけ、STEP 2で表示設定を確認 →',
    });
    await visible.click();
    await page.waitForURL('**#step-2');
    const next = first.locator('button.step-next');
    assert.match(await next.innerText(), /録画ソフトとサブモニター/);
    await next.click();
    assert.equal(
      await page.locator('[aria-label="進行状況 3 / 4"]').count(),
      1,
    );
    const prompt = first.locator('.result-note');
    await prompt.getByRole('button', { name: 'ノートを確認して保存' }).click();
    await prompt
      .getByLabel('記録のタイトル')
      .fill('PRIVATE_BLACK local fixture');
    await prompt
      .getByRole('button', { name: 'キャンセル', exact: true })
      .click();
    assert.deepEqual(await read(), []);
    await prompt.getByRole('button', { name: '案内を閉じる' }).click();
    await next.click();
    await prompt.getByRole('button', { name: 'ノートを確認して保存' }).click();
    await prompt
      .getByLabel('症状・診断結果')
      .fill('PRIVATE_BLACK synthetic black screen');
    await prompt.getByRole('button', { name: 'ノートに保存する' }).click();
    await page.waitForFunction(
      (k) =>
        JSON.parse(localStorage.getItem(k) || '{"items":[]}').items.length ===
        1,
      key,
    );
    const saved = await read();
    assert.equal(saved.length, 1);
    assert.equal(saved[0].stepId, 'step-3');
    assert.deepEqual(saved[0].completedSteps, [
      '表示方式を切り替えて画面を取り戻す',
    ]);
    assert.equal(saved[0].support.attempts[0].stepId, 'step-1');
    await page.reload({ waitUntil: 'networkidle' });
    assert.match(await page.locator('.resume-panel').innerText(), /STEP 3/);
    await first.locator('.step-solved').click();
    await page.locator('.success-share').waitFor();
    assert.equal(await page.locator('.step-skip, button.step-next').count(), 0);
    assert.equal(
      await first.getByRole('link', { name: /画面が戻った場合だけ/ }).count(),
      0,
    );
    // English uses the existing notebook result selector, not Japanese per-step voting.
    await page.goto(base + '/en' + path, { waitUntil: 'networkidle' });
    const enlink = page
      .locator('#step-1')
      .getByRole('link', { name: /Still black or shortcut not applicable/ });
    assert.equal(await enlink.getAttribute('href'), '#step-3');
    await enlink.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**#step-3');
    await page.goBack();
    await page.goForward();
    await page.waitForURL('**#step-3');
    assert.match(
      await page.locator('#step-2').innerText(),
      /Only if the menu is visible/,
    );
    const workspace = page.locator('#issue-notebook');
    await workspace
      .getByRole('button', { name: 'Save a new issue', exact: true })
      .click();
    await workspace
      .getByRole('button', { name: 'Cancel', exact: true })
      .click();
    assert.deepEqual(await read(), saved);
    const details = workspace
      .locator('details')
      .filter({ has: page.getByLabel('Step attempted', { exact: true }) });
    await details.locator('summary').click();
    await workspace
      .getByLabel('Step attempted', { exact: true })
      .selectOption('step-1');
    await workspace
      .getByLabel('Result', { exact: true })
      .selectOption('unresolved');
    await workspace
      .getByRole('button', { name: 'Record result', exact: true })
      .click();
    assert.equal(
      (await read())[0].support.attempts.at(-1).result,
      'unresolved',
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${width}px: JA safe skip/result/save/resume/solved; EN route/result/cancel; keyboard/history; local fixtures only`,
    );
  }
} finally {
  await browser.close();
}
