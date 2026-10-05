// Only synthetic local browser records. Every API and external request is intercepted.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
const path = '/games/monster-hunter-wilds/not-launching';
const key = 'gemnao-solutions-v1';
const fixture = (id) => ({
  id,
  title: `PRIVATE_SENTINEL ${id}`,
  gameSlug: 'monster-hunter-wilds',
  status: 'unresolved',
  diagnosis: 'Synthetic symptom',
  settings: 'Original setting',
  notes: 'Private text',
  articlePath: path,
  stepId: 'remove-mods',
  completedSteps: [],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
});
await mkdir('outputs/engagement', { recursive: true });
try {
  for (const width of [375, 390, 430, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const requests = [];
    await context.route('**/*', (r) => {
      const url = new URL(r.request().url());
      requests.push(url.href + (r.request().postData() || ''));
      if (url.origin !== new URL(base).origin) return r.abort();
      if (url.pathname.startsWith('/api/'))
        return r.fulfill({ json: { rows: [], methods: [] } });
      return r.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(30000);
    const read = () =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key) || '{"items":[]}').items,
        key,
      );
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(
      await page.locator('.continue-notes').count(),
      0,
      'first visit',
    );
    await page.evaluate(
      ({ key, items }) => {
        localStorage.setItem(key, JSON.stringify({ version: 1, items }));
        localStorage.setItem('gemnao-active-solution', 'A');
      },
      { key, items: [fixture('A'), fixture('B')] },
    );
    await page.goto(base + path, { waitUntil: 'networkidle' });
    assert.deepEqual(
      await page
        .locator('.diagnosis-table tbody a')
        .evaluateAll((nodes) => nodes.slice(0, 4).map((n) => n.hash)),
      ['#verify-files', '#update-driver', '#shader-crash', '#remove-mods'],
    );
    const card = page.locator('#remove-mods');
    assert.ok(
      (await card.locator('.step-next').innerText()).includes(
        'Steamの整合性確認',
      ),
    );
    const original = await read();
    await card.locator('.step-skip a').focus();
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#verify-files');
    assert.deepEqual(await read(), original, 'skipping records no attempt');
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await card.locator('.step-next').focus();
    await page.keyboard.press('Enter');
    const note = card.locator('.result-note');
    await note.waitFor();
    assert.deepEqual(await read(), original, 'result never autosaves');
    await note.getByRole('button', { name: '案内を閉じる' }).click();
    assert.equal(await note.count(), 0);
    assert.deepEqual(await read(), original);
    await card.locator('.step-next').click();
    await note.getByRole('button', { name: 'ノートを確認して保存' }).focus();
    await page.keyboard.press('Enter');
    await note
      .locator('.solution-form textarea')
      .first()
      .fill('PRIVATE_SENTINEL unsaved');
    await note.getByRole('button', { name: 'キャンセル', exact: true }).click();
    assert.deepEqual(
      await read(),
      original,
      'cancel keeps both existing notes',
    );
    await note.getByRole('button', { name: 'ノートを確認して保存' }).click();
    await note.getByLabel('保存先のノート').selectOption('B');
    await note.getByRole('button', { name: 'ノートに保存する' }).click();
    const saved = await read();
    assert.deepEqual(
      saved.find((i) => i.id === 'A'),
      original[0],
    );
    assert.equal(saved.length, 2);
    assert.equal(
      saved.find((i) => i.id === 'B').support.attempts[0].stepId,
      'remove-mods',
    );
    assert.equal(saved.find((i) => i.id === 'B').stepId, 'verify-files');
    assert.equal(saved.find((i) => i.id === 'B').notes, original[1].notes);
    await page.goto(base, { waitUntil: 'networkidle' });
    const resume = page.locator('.continue-notes');
    await resume.waitFor();
    assert.equal(
      await resume
        .locator('.recent-trouble-list a')
        .first()
        .getAttribute('href'),
      `${path}#verify-files`,
    );
    assert.ok((await resume.innerText()).includes('確認済み'));
    assert.equal(
      await resume.locator('.support-workspace article').count(),
      0,
      'no fabricated updates',
    );
    await resume.locator('.recent-trouble-list a').first().focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**#verify-files', {
      timeout: 15000,
      waitUntil: 'domcontentloaded',
    });
    await page.goBack({ waitUntil: 'networkidle' });
    await page.locator('.continue-notes').waitFor();
    await page.goForward({ waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).hash, '#verify-files');
    await page.reload({ waitUntil: 'networkidle' });
    assert.ok(
      (await page.locator('.resume-panel').innerText()).includes('STEP 2'),
    );
    assert.equal(
      (await read()).find((i) => i.id === 'B').stepId,
      'verify-files',
    );
    await page.locator('#verify-files .step-solved').click();
    const resolved = page.locator('#verify-files .result-note');
    await resolved.waitFor();
    await page.getByText('解決できました！', { exact: true }).waitFor();
    assert.equal(
      await page.locator('.step-next, .step-skip').count(),
      0,
      'solved has no next-work prompts',
    );
    assert.equal(
      (await read()).find((i) => i.id === 'B').status,
      'unresolved',
      'solved result does not change note yet',
    );
    await resolved
      .getByRole('button', { name: 'ノートを確認して保存' })
      .click();
    await resolved.getByLabel('保存先のノート').selectOption('B');
    await resolved.getByRole('button', { name: 'ノートに保存する' }).click();
    assert.equal((await read()).find((i) => i.id === 'B').status, 'resolved');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(
      await page.locator('.step-next, .step-skip').count(),
      0,
      'saved resolution survives reload without further-work prompts',
    );
    // Clear fixture titles before the evidence screenshot: no personal or synthetic private content.
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#remove-mods .step-next').click();
    await page.locator('#remove-mods .result-note').scrollIntoViewIfNeeded();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width} overflow`,
    );
    await page.screenshot({
      path: `outputs/engagement/result-note-${width}.png`,
    });
    // All four homepage locales retain empty / unresolved / all-resolved / deleted behavior.
    for (const locale of ['', '/en', '/zh', '/es']) {
      await page.evaluate(
        ({ key, item }) =>
          localStorage.setItem(
            key,
            JSON.stringify({ version: 1, items: [item] }),
          ),
        { key, item: fixture('C') },
      );
      await page.goto(base + locale + '/', { waitUntil: 'networkidle' });
      await page.locator('.continue-notes').waitFor();
      assert.equal(
        await page
          .locator('.continue-notes .support-workspace article')
          .count(),
        0,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.evaluate((key) => {
        const data = JSON.parse(localStorage.getItem(key));
        data.items[0].status = 'resolved';
        localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(new Event('gemnao-my-data'));
      }, key);
      assert.equal(
        await page.locator('.continue-notes').count(),
        0,
        'all resolved',
      );
      await page.evaluate((key) => {
        localStorage.removeItem(key);
        window.dispatchEvent(new Event('gemnao-my-data'));
      }, key);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.continue-notes').count(), 0, 'deleted');
    }
    assert.ok(
      requests.every((r) => !r.includes('PRIVATE_SENTINEL')),
      'private data reached network',
    );
    await context.close();
    console.log(
      `PASS ${width}px: first visit, diagnosis order, keyboard result, dismiss, cancel/save, isolated A/B notes, resume/back/forward/reload, solved, 4-locale empty/update-free/resolved/deleted home, privacy`,
    );
  }
} finally {
  await browser.close();
}
