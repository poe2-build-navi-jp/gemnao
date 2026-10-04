import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  args: ['--no-sandbox'],
});
const fixture = (id) => ({
  id,
  title: `Issue ${id}`,
  gameSlug: 'cyberpunk-2077',
  status: 'investigating',
  diagnosis: `Private fixture ${id}`,
  settings: '',
  notes: '',
  articlePath: '/guide/no-game-audio',
  stepId: '',
  completedSteps: [],
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
});
async function scenario(oldProgress = false) {
  const context = await browser.newContext();
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(base).origin) return route.abort();
    if (url.pathname.startsWith('/api/'))
      return route.fulfill({ json: { rows: [], methods: [] } });
    return route.continue();
  });
  const page = await context.newPage();
  await page.goto(base + '/my-games');
  await page.evaluate(
    ({ items, oldProgress }) => {
      localStorage.setItem(
        'gemnao-solutions-v1',
        JSON.stringify({ version: 1, items }),
      );
      localStorage.setItem('gemnao-active-solution', 'A');
      if (oldProgress)
        localStorage.setItem(
          'gemnao-progress:guide-no-game-audio',
          JSON.stringify({
            currentStep: 1,
            completedIds: ['step-1'],
            solved: false,
            lastViewedAt: '2026-10-01T00:00:00Z',
          }),
        );
    },
    { items: [fixture('A'), fixture('B')], oldProgress },
  );
  await page.goto(base + '/guide/no-game-audio');
  await page.locator('.support-tools').waitFor();
  const read = () =>
    page.evaluate(
      () => JSON.parse(localStorage.getItem('gemnao-solutions-v1')).items,
    );
  if (!oldProgress) {
    await page
      .locator('#step-1')
      .getByRole('button', { name: '直らない → 次へ', exact: true })
      .click();
    assert.deepEqual(
      (await read())
        .find((i) => i.id === 'A')
        .support.attempts.map((a) => a.stepId),
      ['step-1'],
    );
  } else {
    await page
      .getByRole('button', { name: '続きから再開', exact: true })
      .waitFor();
    assert.ok((await read()).every((i) => !i.support));
  }
  await page.getByLabel('問題のノート', { exact: true }).selectOption('B');
  await page
    .locator('#step-2')
    .getByRole('button', { name: '直らない → 次へ', exact: true })
    .dblclick();
  let records = await read();
  assert.deepEqual(
    records.find((i) => i.id === 'B').support.attempts.map((a) => a.stepId),
    ['step-2'],
  );
  assert.deepEqual(
    records.find((i) => i.id === 'A').support?.attempts.map((a) => a.stepId) ||
      [],
    oldProgress ? [] : ['step-1'],
  );
  await page.reload();
  await page.locator('.support-tools').waitFor();
  assert.deepEqual(
    (await read())
      .find((i) => i.id === 'B')
      .support.attempts.map((a) => a.stepId),
    ['step-2'],
  );
  // New problems must not inherit checked steps or a diagnosis from article progress.
  await page
    .getByRole('button', { name: '診断結果・設定を保存', exact: true })
    .click();
  await page
    .locator('.solution-form textarea')
    .first()
    .fill('New independent symptom');
  await page
    .getByRole('button', { name: 'ノートに保存する', exact: true })
    .click();
  records = await read();
  const created = records.find((i) => !['A', 'B'].includes(i.id));
  assert.ok(created);
  assert.deepEqual(created.completedSteps, []);
  assert.equal(created.status, 'investigating');
  assert.equal(created.settings, '');
  assert.ok(!created.support);
  // Capture the problem at click time, not after an anonymous reply returns.
  await page.getByLabel('問題のノート', { exact: true }).selectOption('A');
  let pending;
  let requestArrived;
  const arrival = new Promise((resolve) => {
    requestArrived = resolve;
  });
  await page.route('**/api/feedback', (route) => {
    if (route.request().method() === 'POST') {
      pending = route;
      requestArrived();
    } else return route.fulfill({ json: { rows: [], methods: [] } });
  });
  await page
    .locator('#step-2')
    .getByRole('button', { name: 'これで直った', exact: true })
    .click();
  await arrival;
  await page.getByLabel('問題のノート', { exact: true }).selectOption('B');
  await pending.fulfill({ json: { rows: [], methods: [] } });
  await page.getByText('解決できました！', { exact: true }).waitFor();
  records = await read();
  assert.equal(
    records
      .find((i) => i.id === 'A')
      .support.attempts.find((a) => a.stepId === 'step-2').result,
    'resolved',
  );
  assert.equal(
    records
      .find((i) => i.id === 'B')
      .support.attempts.find((a) => a.stepId === 'step-2').result,
    'unresolved',
  );
  await context.close();
}
try {
  await scenario();
  await scenario(true);
  console.log(
    'PASS issue isolation: A→B switch, legacy article progress, reload, double click, clean new-note draft, async selection switch',
  );
} finally {
  await browser.close();
}
