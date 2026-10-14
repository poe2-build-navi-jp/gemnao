// Synthetic local storage, mocked fetch/gtag, and SSR only. No live votes/GA/DB.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
await mkdir('.wrangler/growth-review', { recursive: true });
await build({
  stdin: {
    contents: `
 export * from './lib/fix-save';export * from './lib/saved-solutions';
 export * from './lib/reported-cases';export * from './lib/game-maintenance';
 export * from './lib/analytics';export * from './lib/step-result-client';
 export * from './lib/localized/index';export {games} from './lib/games';
 export {caseMetadata} from './components/reported-case';
 import {ReportedCasePage} from './components/reported-case';
 import {renderToStaticMarkup} from 'react-dom/server';
 export const renderCase=(item,locale)=>renderToStaticMarkup(<ReportedCasePage item={item} locale={locale}/>);
`,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  jsx: 'automatic',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  outfile: '.wrangler/growth-review/foundations.mjs',
});
const m = await import('../.wrangler/growth-review/foundations.mjs');
assert.equal(m.games.length, 39);
assert.equal(m.reportedCases.length, 1);
const item = m.reportedCases[0];
assert.equal(item.reportedOn, null);
assert.equal(item.gameVersion, null);
assert.equal(item.steamVersion, null);
for (const locale of ['ja', 'en', 'zh', 'es']) {
  const path = m.casePath(item, locale),
    metadata = m.caseMetadata(item.slug, locale),
    html = m.renderCase(item, locale);
  assert.equal(metadata.alternates.canonical, path);
  assert.equal(Object.keys(metadata.alternates.languages).length, 5);
  assert.equal(
    m.hasTranslation(locale === 'ja' ? 'en' : locale, m.casePath(item)),
    true,
  );
  assert.ok(html.includes(item.cpu) && html.includes(item.gpu));
  assert.ok(html.includes(item.copy[locale].badge));
  assert.ok(html.includes(item.copy[locale].unknown));
  const json = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
  );
  assert.equal(json.mainEntityOfPage, 'https://gemnao.pages.dev' + path);
  assert.equal(json.dateModified, '2026-10-14');
  assert.equal(json.datePublished, undefined);
}
const hostile = structuredClone(item);
hostile.copy.en.title = '</script><img src=x onerror=alert(1)>';
const safeHtml = m.renderCase(hostile, 'en');
const safeSchema = JSON.parse(
  safeHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
);
assert.equal(safeSchema.headline, hostile.copy.en.title);
let cases = 5;
const store = (initial = []) => {
  const values = new Map(initial);
  return {
    values,
    getItem: (k) => values.get(k) ?? null,
    setItem: (k, v) => values.set(k, v),
    removeItem: (k) => values.delete(k),
  };
};
const context = 'game-monster-hunter-wilds-not-launching',
  method = 'steam-client-isolation';
for (const locale of ['ja', 'en', 'zh', 'es']) {
  const draft = m.resolvedDraft(context, method, 'Synthetic fix', locale);
  assert.ok(draft);
  const s = store([['legacy-key', 'do not overwrite']]);
  const first = m.saveResolvedFix(
    s,
    draft,
    undefined,
    locale,
    'test-version-1',
    '2026-10-14T00:00:00.000Z',
  );
  assert.equal(first.created, true);
  assert.equal(first.added, true);
  assert.equal(first.gameError, '');
  assert.deepEqual(JSON.parse(s.getItem('gemnao-my-games')), [
    'monster-hunter-wilds',
  ]);
  const raw = s.getItem(m.SOLUTIONS_KEY);
  assert.equal(JSON.parse(raw).version, 1);
  assert.equal(m.parseSolutions(raw)[0].id, first.item.id);
  assert.ok(
    first.item.notes.includes('test-version-1') &&
      first.item.notes.includes('2026-10-13'),
  );
  const repeated = m.saveResolvedFix(
    s,
    draft,
    undefined,
    locale,
    'another-version',
  );
  assert.equal(repeated.created, false);
  assert.equal(repeated.added, false);
  assert.equal(s.getItem(m.SOLUTIONS_KEY), raw);
  assert.equal(s.getItem('legacy-key'), 'do not overwrite');
  cases++;
}
const draft = m.resolvedDraft(context, method, 'Synthetic fix', 'en');
const corrupt = store([[m.SOLUTIONS_KEY, 'broken']]);
assert.throws(() => m.saveResolvedFix(corrupt, draft, undefined, 'en'));
assert.equal(corrupt.getItem(m.SOLUTIONS_KEY), 'broken');
assert.equal(corrupt.getItem('gemnao-my-games'), null);
cases++;
const full = store([
  [
    'gemnao-my-games',
    JSON.stringify(
      m.games
        .filter((g) => g.slug !== draft.gameSlug)
        .slice(0, 10)
        .map((g) => g.slug),
    ),
  ],
]);
const limited = m.saveResolvedFix(full, draft, undefined, 'en');
assert.ok(limited.gameError);
assert.equal(m.readSolutions(full).length, 1);
assert.equal(JSON.parse(full.getItem('gemnao-my-games')).length, 10);
cases++;
const brokenGames = store([['gemnao-my-games', 'broken']]);
assert.ok(m.saveResolvedFix(brokenGames, draft, undefined, 'en').gameError);
assert.equal(brokenGames.getItem('gemnao-my-games'), 'broken');
assert.equal(m.readSolutions(brokenGames).length, 1);
cases++;
const denied = store();
denied.setItem = () => {
  throw Error('quota');
};
assert.throws(() => m.saveResolvedFix(denied, draft, undefined, 'en'));
assert.equal(denied.getItem(m.SOLUTIONS_KEY), null);
cases++;
const gameDenied = store();
const originalWrite = gameDenied.setItem;
gameDenied.setItem = (k, v) => {
  if (k === 'gemnao-my-games') throw Error('quota');
  originalWrite(k, v);
};
assert.ok(m.saveResolvedFix(gameDenied, draft, undefined, 'en').gameError);
assert.equal(m.readSolutions(gameDenied).length, 1);
cases++;
const prior = m.readSolutions(full)[0];
const legacy = store([
  [
    m.SOLUTIONS_KEY,
    m.serializeSolutions([
      { ...prior, notes: 'private older note', support: undefined },
    ]),
  ],
]);
const unchanged = legacy.getItem(m.SOLUTIONS_KEY);
assert.equal(m.saveResolvedFix(legacy, draft, undefined, 'en').created, false);
assert.equal(legacy.getItem(m.SOLUTIONS_KEY), unchanged);
cases++;
for (const slug of ['monster-hunter-wilds', 'ace-combat-8']) {
  const row = m.maintenanceForGame(slug)[0];
  assert.ok(row);
  assert.equal(row.translations.length, 4);
  assert.ok(row.translations.every((t) => t.contentReviewedOn === null));
  for (const source of row.sources)
    if (source.status !== 'content-checked')
      assert.equal(source.checkedOn, null);
}
assert.equal(m.maintenanceForGame('elden-ring').length, 0);
cases += 2;
const events = [];
globalThis.window = { gtag: (...args) => events.push(args) };
globalThis.location = {
  origin: 'https://gemnao.pages.dev',
  pathname: '/games/monster-hunter-wilds/not-launching',
  search: '?private=do-not-send',
  hash: '#private',
};
m.trackRelatedArticleOpened(
  'https://gemnao.pages.dev/guide/pc-game-crash?private=do-not-send',
);
assert.equal(events[0][1], 'related_article_opened');
assert.equal(
  events[0][2].page_location,
  'https://gemnao.pages.dev/games/monster-hunter-wilds/not-launching',
);
assert.equal(events[0][2].page_referrer, '');
for (const href of [
  'https://external.invalid/guide/test',
  '/my?notes=private',
  'javascript:alert(1)',
])
  m.trackRelatedArticleOpened(href);
assert.equal(events.length, 1);
m.trackSolutionSaved();
m.trackSolutionReused();
assert.deepEqual(
  events.slice(1).map((e) => e[1]),
  ['solution_saved', 'solution_reused'],
);
assert.ok(!JSON.stringify(events).includes('do-not-send'));
for (const origin of [
  'http://localhost:3000',
  'https://preview.gemnao.pages.dev',
]) {
  globalThis.location.origin = origin;
  m.trackSolutionSaved();
}
assert.equal(events.length, 3);
globalThis.location.origin = 'https://gemnao.pages.dev';
globalThis.location.pathname = '/admin/contacts';
m.trackSolutionSaved();
m.trackSolutionReused();
assert.equal(events.length, 3);
cases += 4;
globalThis.location.pathname = '/en/games/monster-hunter-wilds/not-launching';
const storage = store();
globalThis.localStorage = storage;
const posts = [];
let mode = 'success';
globalThis.fetch = async (url, options) => {
  assert.equal(url, '/api/feedback');
  const body = JSON.parse(options.body);
  posts.push(body);
  if (mode === 'failure') return Response.json({}, { status: 503 });
  if (mode === 'lost') throw Error('lost acknowledgement');
  if (mode === 'other-tab') {
    storage.setItem(
      `gemnao-feedback:${body.game}:${body.topic}:not-resolved:${body.method}`,
      '1',
    );
  }
  return Response.json({ ok: true });
};
const base = {
  game: context,
  topic: 'launch',
  method: 'steam-client-evidence',
  outcome: 'not-resolved',
  reportStruggling: false,
};
const before = events.length;
assert.equal(await m.sendStepResult(base), 'sent');
assert.equal(events.length, before + 1);
assert.equal(events.at(-1)[1], 'step_result_saved');
assert.equal(events.at(-1)[2].outcome, 'not-resolved');
assert.equal(await m.sendStepResult(base), 'already');
assert.equal(events.length, before + 1);
const failed = { ...base, method: 'steam-client-isolation' };
mode = 'failure';
await assert.rejects(m.sendStepResult(failed));
assert.equal(events.length, before + 1);
mode = 'success';
await m.sendStepResult(failed);
assert.equal(events.length, before + 2);
const fixed = { ...base, method, outcome: 'resolved' };
mode = 'lost';
await assert.rejects(m.sendStepResult(fixed));
const token = posts.at(-1).requestId;
assert.equal(events.length, before + 2);
mode = 'success';
await m.sendStepResult(fixed);
assert.equal(posts.at(-1).requestId, token);
assert.equal(events.length, before + 3);
mode = 'other-tab';
assert.equal(await m.sendStepResult({ ...base, method: 'overlay' }), 'already');
assert.equal(events.length, before + 3);
assert.ok(
  events.every((e) =>
    Object.keys(e[2]).every((k) =>
      ['page_location', 'page_title', 'page_referrer', 'outcome'].includes(k),
    ),
  ),
);
assert.ok(
  !JSON.stringify(events).includes('test-version') &&
    !JSON.stringify(events).includes('RTX'),
);
cases += 4;
console.log(
  `PASS: ${cases} case/metadata/storage/partial failure/legacy/maintenance/privacy/idempotent analytics scenarios; 39 games retained; synthetic local only.`,
);
