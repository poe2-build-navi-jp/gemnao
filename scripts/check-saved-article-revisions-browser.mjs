// Synthetic revisions exist only in this isolated browser bundle, never in the
// production registry. Exercise real filtering, enrollment, rendering and storage.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
const key = 'gemnao-saved-article-changes-v1';
const firstId = 'fixture-saved-revision-one';
const nextId = 'fixture-saved-revision-two';
const built = await build({
  stdin: {
    contents: `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { SavedArticleChanges } from './components/saved-article-changes';
      import { officialGameChanges } from './lib/my-game-changes';
      const source = officialGameChanges.find(c => c.gameSlug === 'apex-legends');
      const fixture = id => ({ ...source, id, publishedOn: '2000-01-01', checkedOn: '2000-01-01', sourceUrl: 'https://example.invalid/fixture', copy: { ja: { title: id, condition: '合成条件', change: 'テスト専用の変更', check: '合成確認' }, en: { title: id, condition: 'Synthetic condition', change: 'Test-only change', check: 'Synthetic check' } } });
      // Modify only the bundle's in-memory copy, with same-date revisions to
      // prove that a new revision ID, not a date bump, makes the card unread.
      officialGameChanges.splice(0, officialGameChanges.length, fixture('${firstId}'));
      if (new URLSearchParams(location.search).get('revision') === '2') officialGameChanges.push(fixture('${nextId}'));
      const locale = new URLSearchParams(location.search).get('locale') === 'en' ? 'en' : 'ja';
      createRoot(document.getElementById('root')).render(<SavedArticleChanges locale={locale} items={[{ path: '/en/games/apex-legends/javelin-launch-error', title: 'Fixture saved article', savedAt: '2000-01-01T00:00:00.000Z' }]} />);
    `,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  jsx: 'automatic',
});
const requests = [];
const server = createServer((req, res) => {
  requests.push(req.url);
  res.setHeader('Content-Type', 'text/html');
  res.end(
    '<!doctype html><html><meta charset="utf-8"><div id="root"></div><script>' +
      built.outputFiles[0].text +
      '</script></html>',
  );
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const locale of ['ja', 'en']) {
    const context = await browser.newContext();
    const external = [],
      errors = [];
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin !== base) {
        external.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    const state = (id) =>
      page
        .locator(`#change-${id}`)
        .locator('..')
        .locator('.my-game-change-state');
    const read = locale === 'ja' ? '既読' : 'Read';
    const unread = locale === 'ja' ? '未読' : 'Unread';
    await page.goto(`${base}/?locale=${locale}&revision=1`);
    await expect(page.locator('.my-game-change')).toHaveCount(1);
    await expect(state(firstId)).toHaveText(read);
    assert.deepEqual(
      await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).read, key),
      [firstId],
    );

    // Simulate revisiting after an editorial release adds a revision.
    await page.goto(`${base}/?locale=${locale}&revision=2`);
    await expect(page.locator('.my-game-change')).toHaveCount(2);
    await expect(state(firstId)).toHaveText(read);
    await expect(state(nextId)).toHaveText(unread);
    await page.reload();
    await expect(state(nextId)).toHaveText(unread);
    assert.deepEqual(
      await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).read, key),
      [firstId],
    );
    await page
      .locator(`#change-${nextId}`)
      .locator('..')
      .getByRole('button')
      .click();
    await expect(state(nextId)).toHaveText(read);
    assert.deepEqual(
      await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).read, key),
      [firstId, nextId],
    );
    await page.reload();
    await expect(state(nextId)).toHaveText(read);
    await expect(state(firstId)).toHaveText(read);
    assert.deepEqual(
      await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).read, key),
      [firstId, nextId],
    );
    assert.deepEqual(external, []);
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${locale}: initial read → new same-date revision → unread card on revisit/reload → mark read → read on reload`,
    );
  }
  assert(requests.every((path) => !path.startsWith('/api/')));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
