import { test, expect, type Page } from '@playwright/test';
import { symptoms } from '../../lib/diagnosis/model';
async function begin(page: Page, symptom = 'ゲームが起動しない') {
  await page.goto('/diagnose');
  await page
    .getByRole('button', { name: '症状を選んで診断をはじめる' })
    .click();
  await page.getByRole('button', { name: symptom, exact: false }).click();
  await page.getByRole('button', { name: '次へ', exact: false }).click();
}
async function choose(page: Page, label: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: '次へ', exact: false }).click();
}
async function complete(page: Page, symptom = 'ゲームが起動しない') {
  await begin(page, symptom);
  await choose(page, '分からない');
  await choose(page, '分からない');
  await choose(page, '分からない');
  await choose(page, '分からない');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByLabel('ゲーム名（任意）').fill('PRIVATE FREE TEXT');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '確認する順番を見る' }).click();
  await expect(
    page.getByRole('heading', { name: 'あなたの診断結果' }),
  ).toBeVisible();
}
for (const symptom of symptoms)
  test(`P0: ${symptom.label}, all unknown completes without sharing`, async ({
    page,
  }) => {
    const posts: string[] = [];
    page.on('request', (r) => {
      if (r.method() === 'POST') posts.push(r.postData() || '');
    });
    await complete(page, symptom.label);
    await expect(
      page.getByText('現在の回答だけでは、優先する原因候補を絞れません。', {
        exact: false,
      }),
    ).toBeVisible();
    expect(posts.every((x) => !x.includes('PRIVATE FREE TEXT'))).toBeTruthy();
    expect(posts.every((x) => !x.includes('"snapshot"'))).toBeTruthy();
    await page.reload();
    await page.getByRole('button', { name: '続きから再開する' }).click();
    await expect(
      page.getByRole('heading', { name: 'あなたの診断結果' }),
    ).toBeVisible();
  });
test('dependent answer cleared by Back, safety branch, keyboard focus', async ({
  page,
}) => {
  await begin(page);
  await choose(page, 'ゲームだけ（Windowsは操作できる）');
  await choose(page, 'エラーが表示される');
  await choose(page, 'DirectX / DXGI');
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: 'プレイを押しても無反応' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  await expect(
    page.getByRole('heading', { name: '発生する前に変更したものは？' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('gemnao-diagnosis-v1') || '{}').answers
          .error,
    ),
  ).toBeUndefined();
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: '前の質問へ' }).click();
  await page.getByRole('button', { name: 'PCの電源が落ちる' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: '確認する順番を見る' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'ゲーム診断を止め、PC全体の症状を確認する',
    }),
  ).toBeVisible();
  expect(await page.locator('.diag-actions>li').count()).toBe(1);
});
for (const width of [375, 390, 430, 1280])
  test(`responsive ${width}px, no overflow and focus`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await begin(page);
    await expect(
      page.getByRole('heading', { name: '止まるのはゲームだけですか？' }),
    ).toBeFocused();
    await expect(page.locator('.diag-question')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/diagnosis-${width}.png`,
      fullPage: true,
    });
  });
test('sharing explicit preview, retry, unrelated browser read-only, update, revoke and delete', async ({
  page,
  browser,
  baseURL,
}) => {
  await complete(page);
  await page
    .getByRole('button', { name: '共有用ページを作る', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: '公開する内容の確認' }),
  ).toBeVisible();
  await expect(page.locator('.diag-preview')).not.toContainText(
    'PRIVATE FREE TEXT',
  );
  await expect(
    page.getByRole('button', { name: '確認した内容でURLを発行' }),
  ).toBeDisabled();
  await page.getByRole('checkbox', { name: '上の内容と公開範囲' }).check();
  await page.route('**/api/diagnosis', (r) =>
    r.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'テスト用保存失敗' }),
    }),
  );
  await page.getByRole('button', { name: '確認した内容でURLを発行' }).click();
  await expect(page.getByRole('alert')).toContainText('テスト用保存失敗');
  await expect(
    page.getByRole('checkbox', { name: '上の内容と公開範囲' }),
  ).toBeChecked();
  await page.unroute('**/api/diagnosis');
  await page.getByRole('button', { name: '確認した内容でURLを発行' }).click();
  await expect(page.locator('.diag-share-url')).toBeVisible();
  const path = await page.locator('.diag-share-url').getAttribute('href');
  expect(path).toMatch(/^\/diagnosis\/[a-f0-9]{32}$/);
  const id = path!.split('/').pop()!;
  const key = await page.locator('.diag-key').textContent();
  expect(key).toMatch(/^[a-f0-9]{64}$/);
  const cookie = (await page.context().cookies()).find(
    (c) => c.name === '__Host-gemnao-diagnosis',
  );
  expect(cookie?.httpOnly).toBeTruthy();
  expect(cookie?.secure).toBeTruthy();
  expect(cookie?.sameSite).toBe('Strict');
  const other = await browser.newContext({ baseURL });
  const visitor = await other.newPage();
  const resp = await visitor.goto(path!);
  expect(resp!.status()).toBe(200);
  await expect(
    visitor.getByRole('heading', { name: 'あなたの診断結果' }),
  ).toBeVisible();
  await expect(
    visitor.getByRole('button', { name: '改善した', exact: true }),
  ).toHaveCount(0);
  expect(await visitor.content()).not.toContain(key!);
  expect(resp!.headers()['cache-control']).toContain('no-store');
  expect(resp!.headers()['x-robots-tag']).toContain('noindex');
  expect(resp!.headers()['referrer-policy']).toBe('no-referrer');
  const unauthorized = await other.request.patch(`/api/diagnosis/${id}`, {
    headers: { Origin: baseURL!, 'X-Diagnosis-Request': '1' },
    data: { results: { inspect: 'improved' }, revision: 1 },
  });
  expect(unauthorized.status()).toBe(403);
  await page
    .getByRole('link', { name: '共有内容を更新・失効・削除する' })
    .click();
  await expect(
    page.getByRole('heading', { name: '共有診断を管理' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '改善した', exact: true }).click();
  await page
    .getByRole('button', { name: '共有内容を更新', exact: true })
    .click();
  await page.getByRole('button', { name: '確認して更新', exact: true }).click();
  await expect(
    page.getByText('確認した実施結果を共有ページへ反映しました。'),
  ).toBeVisible();
  await visitor.reload();
  await expect(visitor.getByText('実施結果：改善した')).toBeVisible();
  await page.getByRole('button', { name: '今すぐ共有を失効させる' }).click();
  await page.getByRole('button', { name: '確認して失効', exact: true }).click();
  await expect(
    page.getByText('共有ページを即時失効させました。'),
  ).toBeVisible();
  expect((await visitor.goto(path!))!.status()).toBe(404);
  expect((await other.request.get('/api/diagnosis/' + id)).status()).toBe(404);
  await page.getByRole('button', { name: '共有データを削除する' }).click();
  await page.getByRole('button', { name: '確認して削除', exact: true }).click();
  await expect(
    page.getByText('共有ページを稼働DBから削除しました。'),
  ).toBeVisible();
  expect((await other.request.get('/api/diagnosis/' + id)).status()).toBe(404);
  await other.close();
});
test('article navigation resets external scripts; SEO, existing assets and feedback stay intact', async ({
  page,
  request,
}) => {
  await page.goto('/guide/steam-game-not-launching');
  await expect(
    page.getByRole('link', { name: '無料診断をはじめる' }),
  ).toBeVisible();
  const articleTitle = await page.title();
  expect(articleTitle).toContain('Steam');
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute('href');
  expect(canonical).toBe(
    'https://gemnao.pages.dev/guide/steam-game-not-launching',
  );
  const articleSchemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(articleSchemas.join('')).toContain('FAQPage');
  expect(articleSchemas.join('')).toContain('Article');
  const external: string[] = [];
  await page.getByRole('link', { name: '無料診断をはじめる' }).click();
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(page.url()).origin)
      external.push(r.url());
  });
  await page
    .getByRole('button', { name: '症状を選んで診断をはじめる' })
    .click();
  await page.waitForTimeout(2200);
  expect(external).toEqual([]);
  expect(
    await page.evaluate(() =>
      Boolean((window as Window & { gtag?: unknown }).gtag),
    ),
  ).toBe(false);
  expect(
    await page
      .locator('script[src*="googletagmanager"],script[src*="adsbygoogle"]')
      .count(),
  ).toBe(0);
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(
    'https://gemnao.pages.dev/diagnose',
  );
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('/diagnose</loc>');
  expect(sitemap).not.toContain('/diagnosis/');
  for (const path of [
    '/robots.txt',
    '/ads.txt',
    '/en',
    '/guide',
    '/api/feedback?game=guide-steam-game-not-launching',
  ])
    expect((await request.get(path)).status()).toBe(200);
  const home = await request.get('/');
  expect(home.status()).toBe(200);
  const html = await home.text();
  expect(html).toContain('google-site-verification');
  expect(html).toContain('google-adsense-account');
  const urls = [
    ...html.matchAll(/(?:src|href)="([^"]+\.(?:css|js)(?:\?[^"]*)?)"/g),
  ]
    .map((m) => m[1])
    .filter((u) => u.startsWith('/'));
  expect(urls.length).toBeGreaterThan(0);
  for (const u of urls.slice(0, 8))
    expect((await request.get(u)).status()).toBe(200);
});

test('tried actions initially show only relevant candidates, with other actions optional', async ({
  page,
}) => {
  await begin(page);
  await choose(page, 'ゲームだけ（Windowsは操作できる）');
  await choose(page, 'プレイを押しても無反応');
  await choose(page, '思い当たる変更はない');
  await choose(page, 'Steam');
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: '次へ' }).click();
  expect(
    await page.locator('.diag-relevant-tried select').count(),
  ).toBeLessThanOrEqual(3);
  await expect(
    page.getByLabel('FPS上限と表示設定を確認する'),
  ).not.toBeVisible();
  await page
    .getByText('ほかに試した対処を選ぶ（任意）', { exact: true })
    .click();
  await expect(page.getByLabel('FPS上限と表示設定を確認する')).toBeVisible();
  await page
    .getByLabel('FPS上限と表示設定を確認する')
    .selectOption('unchanged');
  await page.getByRole('button', { name: '確認する順番を見る' }).click();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('gemnao-diagnosis-v1') || '{}').tried
          .fpscap,
    ),
  ).toBe('unchanged');
});
