import { test, expect, type Page } from '@playwright/test';
import { symptoms, PREVIOUS_RULE_VERSION, RULE_VERSION } from '../../lib/diagnosis/model';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/diagnosis/config', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ enabled: true, sharing: false, metrics: false }) }));
});

async function start(page: Page) {
  await page.goto('/diagnose');
  await page.getByRole('button', { name: '症状を選んで診断をはじめる' }).click();
}
async function choose(page: Page, label: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: '次へ', exact: false }).click();
}
async function begin(page: Page, symptom = 'ゲームが起動しない') {
  await start(page);
  await choose(page, 'そのような兆候には気付いていない');
  await choose(page, '重大な警告は見ていない');
  await page.getByRole('button', { name: symptom, exact: false }).click();
  await page.getByRole('button', { name: '次へ', exact: false }).click();
}
async function toDecision(page: Page, symptom = 'ゲームが起動しない') {
  await begin(page, symptom);
  for (let i = 0; i < 4; i++) await choose(page, '分からない');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ゲーム名（任意）').fill('PRIVATE FREE TEXT');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await expect(page.getByRole('heading', { name: '修理・部品交換を比べるための情報は？' })).toBeFocused();
}
async function finish(page: Page) {
  await page.getByRole('button', { name: '確認する順番を見る' }).click();
  await expect(page.getByRole('heading', { name: 'あなたの診断結果' })).toBeVisible();
}
for (const symptom of symptoms) test(`P0: ${symptom.label}, unknown remains inconclusive and resumes locally`, async ({ page }) => {
  const outbound: string[] = [];
  page.on('request', (request) => { if (request.method() === 'POST') outbound.push(request.url()); });
  await toDecision(page, symptom.label);
  await finish(page);
  await expect(page.getByRole('heading', { name: '情報不足：修理・部品交換・買い替えはまだ決められません' })).toBeVisible();
  await expect(page.getByRole('button', { name: '共有用ページを作る', exact: true })).toHaveCount(0);
  expect(outbound.filter((url) => url.includes('/api/diagnosis'))).toEqual([]);
  await page.reload();
  await page.getByRole('button', { name: '続きから再開する' }).click();
  await expect(page.getByRole('heading', { name: 'あなたの診断結果' })).toBeVisible();
});

test('danger stops before symptoms and takes precedence over a migrated storage warning', async ({ page }) => {
  await page.addInitScript(({ version }) => {
    localStorage.setItem('gemnao-diagnosis-v1', JSON.stringify({ version, answers: { safety: 'none', storage: 'critical' }, game: '', tried: { settings: 'improved' }, results: {}, step: 'storage', complete: true, savedAt: Date.now() }));
  }, { version: RULE_VERSION });
  await page.goto('/diagnose');
  await page.getByRole('button', { name: '続きから再開する' }).click();
  await page.getByRole('button', { name: '回答に戻る' }).click();
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: '異臭・煙・膨らみ・危険な熱・液体侵入や水濡れ直後がある', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('使用と充電を中止');
  await finish(page);
  await expect(page.getByRole('heading', { name: '使用を中止し、メーカー・専門窓口へ相談' })).toBeVisible();
  await expect(page.locator('.diag-actions > li')).toHaveCount(0);
  await expect(page.locator('.diag-costs')).toHaveCount(0);
  await expect(page.locator('.diag-decision')).toContainText('バックアップのためでも無理に電源を入れない');
});

test('critical storage and unknown safety suppress ordinary game instructions', async ({ page }) => {
  await start(page);
  await choose(page, '分からない');
  await page.getByRole('button', { name: '信頼性低下・故障予測などの重大な警告がある', exact: true }).click();
  await finish(page);
  await expect(page.getByRole('heading', { name: '重要データの保全を優先し、ストレージの相談へ' })).toBeVisible();
  await expect(page.locator('.diag-actions > li')).toHaveCount(0);
  await expect(page.locator('.diag-decision')).toContainText('安全に操作できる場合だけ');
});

test('dependent Back changes clear hidden errors; PC-wide branch goes to consultation', async ({ page }) => {
  await begin(page);
  await choose(page, 'ゲームだけ（Windowsは操作できる）');
  await choose(page, 'エラーが表示される');
  await choose(page, 'DirectX / DXGI');
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await choose(page, 'プレイを押しても無反応');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gemnao-diagnosis-v1') || '{}').answers.error)).toBeUndefined();
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: 'PCの電源が落ちる' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: '次へ' }).click();
  await finish(page);
  await expect(page.getByRole('heading', { name: 'PC全体の異常は、ハードウェアも含めて修理相談' })).toBeVisible();
  await expect(page.locator('.diag-actions > li')).toHaveCount(1);
});

test('explicit cost category and report stay local, with preview approval reset on record change', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', (request) => { if (request.method() === 'POST') posts.push(request.url()); });
  await toDecision(page);
  await page.getByLabel('費用を確認したい作業（任意・故障確定ではありません）').selectOption('memory');
  await page.getByLabel('症状が出る頻度（自己申告）').selectOption('intermittent');
  await finish(page);
  await expect(page.getByRole('heading', { name: '選んだ作業の公式料金例' })).toBeVisible();
  await page.getByRole('button', { name: '相談用メモの全文を確認する' }).click();
  const preview = page.getByLabel('保存・コピーする内容の全文');
  const report = await preview.inputValue();
  expect(report).toContain('ときどき起きる');
  expect(report).toContain('自己申告');
  expect(report).toContain('メモ作成日時（UTC');
  expect(report).not.toContain('PRIVATE FREE TEXT');
  await expect(page.getByRole('button', { name: '確認したメモをコピー' })).toBeDisabled();
  await expect(page.getByRole('button', { name: '確認したメモをテキスト保存' })).toBeDisabled();
  await page.getByRole('checkbox', { name: '内容と未確認項目を確認しました' }).check();
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('test clipboard failure')) } }); });
  await page.getByRole('button', { name: '確認したメモをコピー' }).click();
  await expect(page.getByText('自動コピーできませんでした。', { exact: false })).toBeVisible();
  await expect(preview).toBeFocused();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '確認したメモをテキスト保存' }).click();
  expect((await download).suggestedFilename()).toBe('gemnao-repair-consultation.txt');
  await page.getByRole('button', { name: '改善した', exact: true }).first().click();
  await expect(page.getByRole('button', { name: '相談用メモの全文を確認する' })).toBeVisible();
  await page.getByRole('button', { name: '相談用メモの全文を確認する' }).click();
  await expect(page.getByRole('checkbox', { name: '内容と未確認項目を確認しました' })).not.toBeChecked();
  expect(posts.filter((url) => url.includes('/api/diagnosis'))).toEqual([]);
});

test('existing manufacturer error overrides settings and chosen part stays a candidate', async ({ page }) => {
  await toDecision(page, 'FPSが低い');
  await page.getByLabel('すでに実施したメーカー診断の結果（任意）').selectOption('error');
  await page.getByLabel('費用を確認したい作業（任意・故障確定ではありません）').selectOption('storage');
  await finish(page);
  await expect(page.getByRole('heading', { name: 'メーカー診断のエラーを添えて修理相談' })).toBeVisible();
  await expect(page.locator('.diag-actions > li')).toHaveCount(0);
  await expect(page.locator('.diag-costs')).toContainText('必要な交換を特定した結果ではありません');
});

test('older local answers reopen safety without losing prior action records', async ({ page }) => {
  await page.addInitScript(({ version }) => {
    localStorage.setItem('gemnao-diagnosis-v1', JSON.stringify({ version, answers: { symptom: 'crash', scope: 'pc-freeze' }, game: '', tried: { history: 'unchanged' }, results: {}, step: 'scope', complete: true, savedAt: Date.now() }));
  }, { version: PREVIOUS_RULE_VERSION });
  await page.goto('/diagnose');
  await page.getByRole('button', { name: '続きから再開する' }).click();
  await expect(page.getByRole('heading', { name: '先に、危険な兆候はありませんか？' })).toBeFocused();
  await choose(page, 'そのような兆候には気付いていない');
  await choose(page, '重大な警告は見ていない');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gemnao-diagnosis-v1') || '{}').tried.history)).toBe('unchanged');
});
for (const width of [375, 390, 430, 1280]) test(`responsive ${width}px: focus, decision and report have no overflow`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await toDecision(page);
  await page.getByLabel('費用を確認したい作業（任意・故障確定ではありません）').selectOption('storage');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await finish(page);
  await page.getByRole('button', { name: '相談用メモの全文を確認する' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: `test-results/diagnosis-repair-${width}.png`, fullPage: true });
});

test('local beta retains no GA, native article navigation, noindex and sitemap exclusion', async ({ page, request }) => {
  await page.goto('/diagnose');
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://gemnao.pages.dev/diagnose');
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex');
  expect(await page.locator('script[src*="googletagmanager"],script[src*="adsbygoogle"]').count()).toBe(0);
  expect(await page.evaluate(() => Boolean((window as Window & { gtag?: unknown }).gtag))).toBe(false);
  await expect(page.getByRole('link', { name: '修理・パーツ交換の費用と、買い替えを比べるガイド' })).toHaveAttribute('href', '/pc/repair-or-replace');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('/diagnose</loc>');
  expect(sitemap).not.toContain('/diagnosis/');
});

test('changing optional cost context keeps tried actions and reset really clears local history', async ({ page }) => {
  await begin(page, 'FPSが低い');
  await choose(page, 'ゲームだけ（Windowsは操作できる）');
  await choose(page, '30 / 60など一定のFPSで止まる');
  await choose(page, '思い当たる変更はない');
  await choose(page, 'Steam');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('FPS上限と表示設定を確認する').selectOption('improved');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('保証・延長保証', { exact: true }).selectOption('covered');
  await page.getByLabel('費用を確認したい作業（任意・故障確定ではありません）').selectOption('gpu');
  await finish(page);
  await expect(page.getByRole('heading', { name: '設定の確認・改善を先に試す余地があります' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gemnao-diagnosis-v1') || '{}').tried.fpscap)).toBe('improved');
  await page.getByRole('button', { name: '端末内の記録を消す', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('gemnao-diagnosis-v1'))).toBeNull();
  await expect(page.getByRole('button', { name: '続きから再開する' })).toHaveCount(0);
});
