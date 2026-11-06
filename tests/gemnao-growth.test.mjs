import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
await mkdir('.wrangler/growth', { recursive: true });
await build({
  stdin: {
    contents:
      "export * from './lib/gemnao-card'; export * from './lib/game-alert-feed'; export * from './lib/steam-guide-export';",
    resolveDir: process.cwd(),
  },
  outfile: '.wrangler/growth/code.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
});
const {
  cleanCard,
  cardSvg,
  readCardCollection,
  feedSelection,
  updatesRss,
  steamGuideDraft,
  steamGuideTargets,
} = await import('../.wrangler/growth/code.mjs');
await test('card escapes injected markup and does not silently accept a broken collection', () => {
  const c = cleanCard({
    game: '<script>alert(1)</script>',
    symptom: 'A & B',
    action: '<image href="https://evil.test"/>',
    result: 'resolved',
    theme: 'gold',
    article: '//evil.test/path',
    date: '2026-11-06',
  });
  assert.equal(c.article, '');
  const svg = cardSvg(c);
  assert.ok(!svg.includes('<script>'));
  assert.ok(!svg.includes('<image '));
  assert.ok(svg.includes('&lt;script&gt;'));
  assert.ok(svg.includes('本人の記録'));
  assert.deepEqual(readCardCollection(null), []);
  assert.throws(() => readCardCollection('{broken'));
  assert.throws(() => readCardCollection('[{}]'));
  assert.equal(readCardCollection(JSON.stringify([c])).length, 1);
});
await test('maximum card copy is bounded, with no external image or embedded script', async () => {
  const c = cleanCard({
    game: 'あ'.repeat(500),
    symptom: '症'.repeat(500),
    action: '対'.repeat(500),
    result: 'unresolved',
    theme: 'violet',
    article: '/guide/save-data-backup',
    date: '2026-11-06',
  });
  assert.equal(c.game.length, 40);
  assert.equal(c.symptom.length, 70);
  assert.equal(c.action.length, 130);
  const svg = cardSvg(c);
  assert.ok(svg.includes('…'));
  assert.ok(!svg.includes('href='));
  await writeFile('.wrangler/growth/card-long.svg', svg);
});
await test('feed selection is capped, canonical and rejects unexpected games', () => {
  assert.deepEqual(feedSelection('b,a,b', ['a', 'b']), ['a', 'b']);
  assert.equal(feedSelection('', []), null);
  assert.equal(feedSelection('a,../secret', ['a']), null);
  assert.equal(
    feedSelection(
      Array.from({ length: 11 }, (_, i) => 'g' + i).join(','),
      Array.from({ length: 11 }, (_, i) => 'g' + i),
    ),
    null,
  );
});
await test('RSS escapes announcement strings and stable GUIDs preserve identity', () => {
  const rss = updatesRss(
    [
      {
        game: 'A & B',
        title: '<script>x</script>',
        date: '2026-11-06T00:00:00Z',
        source: 'https://steamcommunity.com/announcements/detail/123',
        path: '/games/palworld',
      },
    ],
    'https://gemnao.pages.dev/api/game-updates-feed?games=palworld',
  );
  assert.ok(rss.includes('&lt;script&gt;'));
  assert.ok(!rss.includes('<script>'));
  assert.ok(
    rss.includes(
      '<guid isPermaLink="false">https://steamcommunity.com/announcements/detail/123</guid>',
    ),
  );
  assert.ok(rss.includes('https://gemnao.pages.dev/games/palworld'));
});
for (const target of steamGuideTargets)
  for (const locale of ['ja', 'en'])
    await test(`${locale}: ${target.game} has a standalone sourced Steam guide`, async () => {
      const d = steamGuideDraft(target.game, locale);
      assert.ok(d, 'Missing verified draft');
      assert.ok(d.body.length > 800);
      assert.ok(d.body.includes('[list]'));
      assert.ok(d.body.includes(d.checkedAt));
      assert.ok(d.body.includes('https://gemnao.pages.dev' + d.path));
      assert.ok(d.body.includes('utm_source=steam'));
      assert.ok(!d.body.includes('undefined'));
    });
