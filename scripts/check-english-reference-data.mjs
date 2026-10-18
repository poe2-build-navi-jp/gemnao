import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({
  stdin: {
    contents: `export {remainingPagesEn} from './lib/localized/remaining-pages-en';export {weeklyReportsEn} from './lib/localized/weekly-reports-en';export {weeklyReports} from './lib/weekly-reports';export {releaseRoundupsEn} from './lib/localized/release-roundups-en';export {releaseRoundups} from './lib/release-roundups';export {gearArticlesEn} from './lib/localized/gear-articles-en';export {gearArticles} from './lib/gear-articles';export {troubleHubsEn} from './lib/localized/trouble-hubs-en';export {troubleHubs} from './lib/trouble-hubs';export {checkFit,gpus} from './lib/my-pc';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const d = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);
assert.equal(d.remainingPagesEn.length, 23);
assert.equal(new Set(d.remainingPagesEn.map((p) => p.path)).size, 23);
for (const [en, ja] of [
  [d.weeklyReportsEn, d.weeklyReports],
  [d.releaseRoundupsEn, d.releaseRoundups],
  [d.gearArticlesEn, d.gearArticles],
  [d.troubleHubsEn, d.troubleHubs],
]) {
  assert.deepEqual(
    en.map((a) => a.slug),
    ja.map((a) => a.slug),
  );
  for (let i = 0; i < en.length; i++) {
    const a = en[i],
      b = ja[i];
    for (const key of [
      'items',
      'upcoming',
      'games',
      'fits',
      'notFits',
      'features',
      'specs',
      'beforeBuying',
      'faqs',
      'sources',
    ])
      if (b[key])
        assert.equal(a[key].length, b[key].length, `${a.slug} ${key}`);
    if (a.items)
      for (let n = 0; n < a.items.length; n++) {
        assert.equal(a.items[n].source.url, b.items[n].source.url);
        assert.equal(a.items[n].date, b.items[n].date);
        assert.equal(a.items[n].kind, b.items[n].kind);
      }
    if (a.games)
      for (let n = 0; n < a.games.length; n++) {
        const g = a.games[n],
          j = b.games[n];
        assert.deepEqual(g.spec, j.spec);
        assert.equal(g.source, j.source);
        assert.equal(g.gtx1660, j.gtx1660);
        assert.equal(g.win10, j.win10);
      }
    if (a.sources)
      assert.deepEqual(
        a.sources.map((s) => s.url),
        b.sources.map((s) => s.url),
      );
    if (a.product) assert.deepEqual(a.product, b.product);
    if (a.guideSlugs) assert.deepEqual(a.guideSlugs, b.guideSlugs);
    for (const key of [
      'title',
      'description',
      'lead',
      'highlights',
      'items',
      'upcoming',
      'games',
      'fits',
      'notFits',
      'features',
      'specs',
      'beforeBuying',
      'faqs',
      'sources',
      'quickChecks',
    ])
      if (a[key])
        assert.ok(
          !/[\u3040-\u30ff\u3400-\u9fff]/.test(JSON.stringify(a[key])),
          `${a.slug}: Japanese text in ${key}`,
        );
  }
}
for (const gpu of d.gpus)
  for (const windows of [10, 11])
    for (const ramGb of [4, 16, 64])
      for (const r of d.releaseRoundups)
        for (const game of r.games) {
          if (!game.spec) continue;
          const pc = { gpu: gpu.id, windows, ramGb };
          const ja = d.checkFit(pc, game.spec),
            en = d.checkFit(pc, game.spec, 'en');
          assert.equal(en.result, ja.result);
          assert.equal(en.reasons.length, ja.reasons.length);
          assert.ok(!/[\u3040-\u30ff\u3400-\u9fff]/.test(en.reasons.join('')));
        }
console.log(
  'PASS: 23 reference pages; weekly/source/item parity, 18 requirement/spec/fit records, gear and trouble content parity, English PC-fit results match Japanese decisions.',
);
