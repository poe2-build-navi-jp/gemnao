import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
await mkdir('.wrangler/pv-growth', { recursive: true });
await build({
  stdin: {
    contents: `export * from './lib/game-update-summary';
export * from './lib/my-game-changes';
export * from './lib/my-game-changes-read';
export * from './components/official-update-notice';
export * from './components/reported-case';`,
    resolveDir: process.cwd(),
  },
  outfile: '.wrangler/pv-growth/components.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
});
const {
  unreadGameUpdates,
  gameUpdateSummaries,
  changesForArticle,
  OfficialUpdateNotice,
  ReportedCaseLink,
  parseReadChanges,
  setChangeRead,
} = await import('../.wrangler/pv-growth/components.mjs');
await test('unread summary includes saved games only, deduplicates and sorts', () => {
  const updates = gameUpdateSummaries('ja');
  const rows = unreadGameUpdates([...updates, ...updates], ['enshrouded'], []);
  assert.equal(rows[0].id, 'enshrouded-1012-20261104-v1');
  assert.ok(rows.every((item) => item.gameSlug === 'enshrouded'));
  assert.equal(new Set(rows.map((r) => r.id)).size, rows.length);
  assert.deepEqual(unreadGameUpdates(updates, [], []), []);
});
await test('read state survives removal and re-adding without marking anything solved', () => {
  const data = new Map([['unrelated-notes', 'keep']]);
  const storage = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
  };
  const updates = gameUpdateSummaries('en');
  const id = 'enshrouded-1012-20261104-v1';
  setChangeRead(storage, id, true);
  const read = parseReadChanges(
    storage.getItem('gemnao-official-changes-read-v1'),
  ).read;
  assert.deepEqual(unreadGameUpdates(updates, [], read), []);
  assert.ok(
    !unreadGameUpdates(updates, ['enshrouded'], read).some((r) => r.id === id),
  );
  assert.equal(data.get('unrelated-notes'), 'keep');
  setChangeRead(storage, id, false);
  assert.ok(
    unreadGameUpdates(
      updates,
      ['enshrouded'],
      parseReadChanges(storage.getItem('gemnao-official-changes-read-v1')).read,
    ).some((r) => r.id === id),
  );
});
await test('malformed read state is not overwritten', () => {
  let stored = '{"version":2,"read":[]}';
  const storage = {
    getItem: () => stored,
    setItem: (_k, v) => {
      stored = v;
    },
  };
  assert.throws(() => setChangeRead(storage, 'valid-id', true));
  assert.equal(stored, '{"version":2,"read":[]}');
});
for (const locale of ['ja', 'en', 'zh', 'es']) {
  await test(`${locale}: latest official fix appears on affected articles with primary sources`, () => {
    const path = '/games/planet-zoo-2/franchise-save-not-loading';
    const rows = changesForArticle(path, locale);
    assert.equal(rows[0].id, 'planet-zoo-2-109-20261105-v1');
    assert.equal(rows[0].copyLocale, locale);
    assert.ok(
      changesForArticle('/games/planet-zoo-2/crashing-autosave', locale).some(
        (r) => r.id === rows[0].id,
      ),
    );
    const html = renderToStaticMarkup(
      h(OfficialUpdateNotice, { path, locale }),
    );
    assert.match(html, /1\.0\.9/);
    assert.match(html, /steamcommunity.com/);
    assert.equal(
      renderToStaticMarkup(
        h(OfficialUpdateNotice, {
          path: '/games/aniimo/not-launching',
          locale,
        }),
      ),
      '',
    );
  });
  await test(`${locale}: actual Wilds case is contextualized on relevant guides only`, () => {
    assert.match(
      renderToStaticMarkup(
        h(ReportedCaseLink, { articlePath: '/guide/pc-game-crash', locale }),
      ),
      /wilds-steam-added-dll/,
    );
    assert.equal(
      renderToStaticMarkup(
        h(ReportedCaseLink, {
          articlePath: '/games/planet-zoo-2/crashing-autosave',
          locale,
        }),
      ),
      '',
    );
  });
}
