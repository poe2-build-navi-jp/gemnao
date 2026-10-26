import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
const origin = process.env.OCR_TEST_ORIGIN || 'http://127.0.0.1:3105';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const requests = []; const errors = []; const logs = [];
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  page.on('request', req => requests.push({ url: req.url(), method: req.method(), body: req.postData() }));
  page.on('console', message => logs.push(message.text()));
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${origin}/diagnose/image-search?lang=en`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Find articles from image text' }).waitFor();
  assert.equal(requests.some(r => r.url.includes('/ocr/v7/')), false, 'OCR assets must load only on consent');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const makeImage = async (text, font = 'bold 40px sans-serif') => Buffer.from(await page.evaluate(({ text, font }) => {
    const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 160;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1000, 160); ctx.fillStyle = '#000'; ctx.font = font; ctx.fillText(text, 30, 95);
    return canvas.toDataURL('image/png').split(',')[1];
  }, { text, font }), 'base64');
  const fixture = { name: 'harmless-fixture.png', mimeType: 'image/png', buffer: await makeImage('ST-3100001 Steam') };
  await page.locator('#ocr-file').setInputFiles(fixture);
  await page.getByRole('button', { name: 'Read image text', exact: true }).click();
  await page.getByText('Reading complete. Review and edit the text.', { exact: true }).waitFor({ timeout: 120000 });
  const text = await page.locator('#ocr-text').inputValue();
  assert.match(text, /ST.?3100001/); console.log('PASS real English OCR fixture');
  await page.waitForFunction(() => !document.querySelector('iframe[title="Local OCR"]'));
  await expect.poll(() => page.workers().length).toBe(0); assert.equal(page.workers().length, 0, 'Completed worker disposed');
  assert.equal(await page.locator('iframe[title="Local OCR"]').count(), 0);
  assert.equal(await page.getByRole('region', { name: 'Search results' }).count(), 0, 'No search before confirmation');
  await page.locator('#ocr-text').fill('ST-3100001');
  await page.getByRole('button', { name: 'Confirm text and search' }).click();
  await page.locator('a[href="/en/games/ace-combat-8/error-st-3100001"]').waitFor();
  assert.equal(page.url(), `${origin}/diagnose/image-search?lang=en`);
  await page.locator('#ocr-text').fill('unknownqzxvbnm');
  await page.getByRole('button', { name: 'Confirm text and search' }).click();
  await page.getByText('No matching articles. Try only the game name or error code.').waitFor();
  // Validation uses a forged MIME with non-image content.
  await page.locator('#ocr-file').setInputFiles({ name: 'invalid.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await page.getByRole('button', { name: 'Read image text', exact: true }).click();
  await page.getByRole('button', { name: 'Retry', exact: true }).waitFor();
  // Mock an asset failure, then retry with the real OCR engine.
  await page.locator('#ocr-file').setInputFiles(fixture);
  await page.route('**/ocr/v7/eng.traineddata.gz', route => route.abort());
  await page.getByRole('button', { name: 'Read image text', exact: true }).click();
  await page.getByRole('button', { name: 'Retry', exact: true }).waitFor({ timeout: 30000 });
  await page.unroute('**/ocr/v7/eng.traineddata.gz');
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await page.getByText('Reading complete. Review and edit the text.', { exact: true }).waitFor({ timeout: 120000 });
  console.log('PASS validation and simulated asset failure → real retry');
  // Hold loading to cancel before createWorker resolves.
  let release; const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/ocr/v7/eng.traineddata.gz', async route => { await gate; await route.continue().catch(() => {}); });
  await page.getByRole('button', { name: 'Read image text', exact: true }).click();
  await page.locator('iframe[title="Local OCR"]').waitFor({ state: 'attached' });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.equal(await page.locator('iframe[title="Local OCR"]').count(), 0);
  await page.getByText('Reading cancelled.', { exact: true }).waitFor();
  release(); await page.unroute('**/ocr/v7/eng.traineddata.gz');
  await page.getByRole('button', { name: 'Clear image and text' }).click();
  assert.equal(await page.locator('#ocr-text').inputValue(), '');
  assert.equal(await page.locator('#ocr-file').inputValue(), '');
  await expect.poll(() => page.workers().length).toBe(0); assert.equal(page.workers().length, 0, 'Cancelled worker disposed');
  console.log('PASS cancel during loading and clear');
  // Oversized and excessive pixel count validation must fail before loading a worker.
  for (const invalid of [
    { name: 'large.png', mimeType: 'image/png', buffer: Buffer.alloc(8 * 1024 * 1024 + 1) },
    { name: 'wide.png', mimeType: 'image/png', buffer: Buffer.from(await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 8193; c.height = 2; return c.toDataURL().split(',')[1]; }), 'base64') },
  ]) {
    await page.locator('#ocr-file').setInputFiles(invalid);
    await page.getByRole('button', { name: 'Read image text', exact: true }).click();
    await page.getByRole('button', { name: 'Retry', exact: true }).waitFor();
    assert.equal(await page.locator('iframe[title="Local OCR"]').count(), 0);
  }
  const bigImage = Buffer.from(await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 1000; c.height = 3000;
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = '#000'; ctx.font = '30px sans-serif';
    for (let y = 45; y < 2980; y += 45) ctx.fillText('Harmless Steam error ST-3100001', 30, y);
    return c.toDataURL().split(',')[1];
  }), 'base64');
  await page.locator('#ocr-file').setInputFiles({ name: 'cancel-fixture.png', mimeType: 'image/png', buffer: bigImage });
  await page.getByRole('button', { name: 'Read image text', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('progress')?.value > 0, null, { timeout: 120000 });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByText('Reading cancelled.', { exact: true }).waitFor();
  await expect.poll(() => page.workers().length).toBe(0); assert.equal(page.workers().length, 0);
  console.log('PASS size/pixel limits and cancellation during real recognition');
  // Real Japanese OCR, including the Japanese model (desktop font, not a game screenshot).
  await page.locator('#ocr-language').selectOption('ja');
  await page.locator('#ocr-file').setInputFiles({ name: 'japanese-fixture.png', mimeType: 'image/png', buffer: await makeImage('起動しない Steam', '40px "Noto Sans CJK JP"') });
  await page.getByRole('button', { name: '文字を読み取る', exact: true }).click();
  await page.getByText('読み取り完了。文字を確認・編集してください。', { exact: true }).waitFor({ timeout: 120000 });
  assert.match(await page.locator('#ocr-text').inputValue(), /起動/);
  console.log('PASS real Japanese OCR fixture');
  for (const [lang, content, expected] of [['zh', '游戏 Steam', /游戏/], ['es', 'Error de inicio Steam', /Error de inicio/]]) {
    await page.locator('#ocr-language').selectOption(lang);
    await page.locator('#ocr-file').setInputFiles({ name: 'language-fixture.png', mimeType: 'image/png', buffer: await makeImage(content, '40px "Noto Sans CJK JP"') });
    await page.locator('.image-search-actions button').first().click();
    await page.waitForFunction(() => document.querySelector('#ocr-text').value.length > 0, { timeout: 120000 });
    assert.match(await page.locator('#ocr-text').inputValue(), expected);
  }
  console.log('PASS real Chinese and Spanish OCR fixtures');
  for (const lang of ['zh', 'es']) {
    await page.locator('#ocr-language').selectOption(lang);
    await page.locator('#ocr-text').fill('Steam');
    await page.locator('form button').click();
    const hrefs = await page.locator('section li a').evaluateAll(links => links.map(link => link.getAttribute('href')));
    assert(hrefs.length > 0); assert(hrefs.every(href => href.startsWith(`/${lang}/`)));
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const external = requests.filter(r => !r.url.startsWith(origin) && !r.url.startsWith('data:') && !r.url.startsWith('blob:'));
  assert.deepEqual(external, [], 'No external requests');
  assert.deepEqual(requests.filter(r => r.method !== 'GET'), [], 'No uploads or analytics posts');
  assert(requests.every(r => !r.url.includes('ST-3100001') && !r.url.includes('unknownqzxvbnm')));
  assert.deepEqual(errors, []);
  assert(logs.every(log => !log.includes('ST-3100001') && !log.includes('unknownqzxvbnm') && !log.includes('harmless-fixture')), 'No private text/filename in console');
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0, 'No persisted private data');
  console.log(`PASS privacy: ${requests.length} same-origin GETs only; no image/text in URLs or request bodies; no page exceptions; zh/es local results; 375px layout`);
} finally { await browser.close(); }
