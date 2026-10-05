// Authored records and stable STEP IDs, not rendered UI repetitions.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const out = 'docs/evidence-audit-batch2-2026-10-05';
mkdirSync(out, { recursive: true });
const modules = {
  games: 'games',
  gameArticles: 'game-articles',
  commonGuides: 'common-guides',
  discordArticles: 'discord-articles-all',
  pcArticles: 'pc-articles',
  gearArticles: 'gear-articles',
  gearGuides: 'gear-guides',
  releaseRoundups: 'release-roundups',
  weeklyReports: 'weekly-reports',
  localizedArticles: 'localized/index',
  localizedDiscordArticles: 'localized/index',
  gameFacts: 'localized/game-facts',
  localizedHubs: 'localized/hubs',
  launches: 'launch-calendar',
};
const result = await build({
  stdin: {
    contents: Object.entries(modules)
      .map(([k, v]) => `export {${k}} from './lib/${v}';`)
      .join('\n'),
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  alias: { '@': process.cwd() },
  logLevel: 'error',
});
const data = await import(
  'data:text/javascript;base64,' +
    Buffer.from(result.outputFiles[0].text).toString('base64')
);
const pages = JSON.parse(
  readFileSync('docs/evidence-audit-2026-10-05/pages.json', 'utf8'),
);
const families = new Map();
for (const p of pages) {
  const path = new URL(p.url).pathname;
  const key = path.replace(/^\/(en|zh|es)(?=\/|$)/, '') || '/';
  if (!families.has(key))
    families.set(key, {
      path: key,
      kind: 'navigation-tool-policy-or-other',
      variants: [],
      reviewStatus: 'unverified',
      authoredRecords: [],
    });
  families.get(key).variants.push({ locale: p.locale, path });
}
const units = [];
const fields = [
  'targetVersion',
  'symptom',
  'conclusion',
  'description',
  'lead',
  'summary',
  'answer',
  'quickFacts',
  'diagnosis',
  'steps',
  'avoid',
  'cautions',
  'faqs',
  'quickChecks',
  'escalation',
  'evidenceSummary',
  'shortcutRows',
  'sections',
  'target',
  'quickFixes',
  'causes',
  'ifNotFixed',
  'botRecommendations',
  'product',
  'fits',
  'notFits',
  'specs',
  'features',
  'beforeBuying',
  'compare',
  'notice',
  'setup',
  'games',
  'items',
  'highlights',
  'upcoming',
];
function add(path, kind, item, locale = 'ja') {
  if (!families.has(path)) throw Error(`Missing crawled route: ${path}`);
  const f = families.get(path);
  f.kind = kind;
  const record = {
    locale,
    title: item.title,
    sources: item.sources || [],
    body: Object.fromEntries(
      fields.filter((k) => item[k] != null).map((k) => [k, item[k]]),
    ),
  };
  f.authoredRecords.push(record);
  const steps =
    item.steps || (kind === 'discord-article' ? item.causes : []) || [];
  for (const [i, step] of steps.entries()) {
    const id =
      path +
      '#' +
      (step.id || `${kind === 'discord-article' ? 'cause' : 'step'}-${i + 1}`);
    let u = units.find((x) => x.id === id);
    if (!u) {
      u = {
        id,
        kind: 'procedure-topic',
        reviewStatus: 'unverified',
        variants: [],
      };
      units.push(u);
    }
    u.variants.push({ locale, ...step });
  }
}
for (const a of data.gameArticles)
  add(`/games/${a.gameSlug}/${a.slug}`, 'game-article', a);
for (const [key, section, kind] of [
  ['commonGuides', 'guide', 'common-guide'],
  ['discordArticles', 'discord', 'discord-article'],
  ['pcArticles', 'pc', 'pc-article'],
  ['gearArticles', 'gear', 'gear-article'],
  ['gearGuides', 'gear', 'gear-article'],
  ['releaseRoundups', 'new-releases', 'roundup'],
  ['weeklyReports', 'weekly', 'weekly'],
])
  for (const a of data[key]) add(`/${section}/${a.slug}`, kind, a);
for (const a of data.localizedArticles)
  add(`/games/${a.gameSlug}/${a.slug}`, 'game-article', a, a.locale);
for (const a of data.localizedDiscordArticles)
  add(`/discord/${a.slug}`, 'discord-article', a, a.locale);
const facts = new Map();
function fact(game, topic, locale, path, field, value) {
  if (value == null || value === '') return;
  const id = `${game}:${topic}`;
  if (!facts.has(id))
    facts.set(id, {
      id,
      game,
      topic,
      reviewStatus: 'unverified',
      occurrences: [],
    });
  facts.get(id).occurrences.push({ locale, path, field, value });
}
for (const g of data.games) {
  const path = `/games/${g.slug}`;
  const f = families.get(path);
  if (!f) throw Error(path);
  f.kind = 'game-hub';
  for (const [key, value] of Object.entries(g.specs))
    fact(g.slug, 'requirements.' + key, 'ja', path, 'specs.' + key, value);
  for (const key of [
    'savePath',
    'configPath',
    'fps',
    'ultrawide',
    'hdr',
    'controller',
    'mod',
    'japanese',
  ])
    fact(g.slug, key, 'ja', path, key, g[key]);
  fact(g.slug, 'release-and-status', 'ja', path, 'demand', g.demand);
  const gf = data.gameFacts[g.slug];
  const hub = data.localizedHubs[g.slug];
  if (gf)
    for (const v of f.variants.filter((v) => v.locale !== 'ja')) {
      for (const key of ['minimum', 'recommended'])
        fact(
          g.slug,
          'requirements.' + key,
          v.locale,
          v.path,
          'gameFacts.' + key,
          gf[key],
        );
      fact(
        g.slug,
        'requirements.storage',
        v.locale,
        v.path,
        'gameFacts.minimum.storage',
        gf.minimum.storage,
      );
    }
  if (hub) f.localizedHub = hub;
}
for (const a of data.gameArticles) {
  const path = `/games/${a.gameSlug}/${a.slug}`;
  for (const [i, q] of (a.quickFacts || []).entries()) {
    const topics = [];
    if (/最低/.test(q.label)) topics.push('requirements.minimum');
    if (/推奨/.test(q.label)) topics.push('requirements.recommended');
    if (/空き容量|ストレージ/.test(q.label))
      topics.push('requirements.storage');
    if (/発売/.test(q.label)) topics.push('release-and-status');
    for (const t of topics)
      fact(a.gameSlug, t, 'ja', path, `quickFacts[${i}]`, q.value);
  }
}
for (const l of data.launches)
  fact(l.gameSlug, 'release-and-status', 'ja', '/', 'launches', l);
const appGame = new Map();
for (const g of data.games)
  for (const s of g.sources || []) {
    const m = s.url.match(/steampowered.com\/app\/(\d+)/);
    if (m && !appGame.has(m[1])) appGame.set(m[1], g.slug);
  }
for (const r of data.releaseRoundups)
  for (const [i, g] of r.games.entries()) {
    const app = g.source.match(/steampowered.com\/app\/(\d+)/)?.[1];
    const game =
      g.article?.href.split('/')[2] ||
      appGame.get(app) ||
      `store-${app || g.name}`;
    const path = '/new-releases/' + r.slug;
    fact(game, 'release-and-status', 'ja', path, `games[${i}].date`, g.date);
    fact(
      game,
      'requirements.minimum',
      'ja',
      path,
      `games[${i}]`,
      Object.fromEntries(
        ['os', 'minGpu', 'memory', 'must'].map((k) => [k, g[k]]),
      ),
    );
    fact(
      game,
      'requirements.storage',
      'ja',
      path,
      `games[${i}].storage`,
      g.storage,
    );
  }
const tokens = (value) =>
  [
    ...new Set(
      (
        JSON.stringify(value)
          .normalize('NFKC')
          .match(
            /(?:\b(?:GTX|RTX|RX|KB)\s*[0-9][A-Z0-9]*(?:\s*(?:Ti|XT|SUPER))?|\bWindows\s*\d+(?:\.\d+)?|\b\d+\.\d+\.\d+\b|\b\d+\s*(?:GB|MB)\b)/gi,
          ) || []
      ).map((t) => t.toLowerCase().replaceAll(' ', '')),
    ),
  ].sort();
const deltas = [];
for (const u of units) {
  const ja = u.variants.find((v) => v.locale === 'ja');
  if (!ja) continue;
  for (const v of u.variants.filter((v) => v.locale !== 'ja')) {
    const a = tokens(ja),
      b = tokens(v);
    deltas.push({
      id: u.id,
      locale: v.locale,
      onlyJa: a.filter((t) => !b.includes(t)),
      onlyTranslation: b.filter((t) => !a.includes(t)),
      meaningEquivalence:
        'unverified; stable STEP pairing is not semantic proof',
    });
  }
}
const serialize = (value) => JSON.stringify(value, null, 2) + '\n';
const census = [...families.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
writeFileSync(out + '/article-units.json.gz', gzipSync(serialize(census)));
writeFileSync(out + '/procedure-topics.json.gz', gzipSync(serialize(units)));
writeFileSync(out + '/shared-fact-topics.json', serialize([...facts.values()]));
writeFileSync(out + '/language-differences.json', serialize(deltas));
for (const family of census)
  family.unmappedLocaleBodies = family.variants
    .filter((v) => !family.authoredRecords.some((r) => r.locale === v.locale))
    .map((v) => v.locale);
writeFileSync(out + '/article-units.json.gz', gzipSync(serialize(census)));
const counts = census.reduce(
  (r, f) => ((r[f.kind] = (r[f.kind] || 0) + 1), r),
  {},
);
const summary = {
  rawRenderedProseBlocks: 17427,
  exactDuplicateRemovedProseBlocks: 17272,
  proseBlocksAreNotFactClaims: true,
  renderedUrls: pages.length,
  canonicalArticleAndPageUnits: census.length,
  kinds: counts,
  procedureTopics: units.length,
  procedureLocaleOccurrences: units.reduce((n, x) => n + x.variants.length, 0),
  sharedGameFactTopics: facts.size,
  sharedGameFactOccurrences: [...facts.values()].reduce(
    (n, x) => n + x.occurrences.length,
    0,
  ),
  languageStepPairs: deltas.length,
  numericDifferencePairs: deltas.filter(
    (x) => x.onlyJa.length || x.onlyTranslation.length,
  ).length,
  limitations: [
    'Article/page units are the audit denominator, not 17,272 rendered blocks.',
    'STEP topics and fact topics overlap: do not add them or call them unique atomic facts.',
    'Cross-language STEP IDs and game/topic keys group likely same meaning; content remains visible for semantic review.',
    'Common UI/SEO duplicates are absent; unstructured special routes still require individual review.',
  ],
};
writeFileSync(out + '/unit-summary.json', serialize(summary));
console.log(summary);
