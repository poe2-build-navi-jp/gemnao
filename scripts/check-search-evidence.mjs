import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
const bundle = await build({
  stdin: {
    contents: `import robots from './app/robots'; import {articleEvidenceReviews} from './lib/article-evidence-reviews'; import {gameArticles} from './lib/game-articles'; import {commonGuides} from './lib/common-guides'; import {reportedCases} from './lib/reported-cases'; export {robots,articleEvidenceReviews,gameArticles,commonGuides,reportedCases};`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const {
  robots,
  articleEvidenceReviews,
  gameArticles,
  commonGuides,
  reportedCases,
} = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);
const previous = process.env.NEXT_PUBLIC_SITE_PUBLIC;
process.env.NEXT_PUBLIC_SITE_PUBLIC = 'true';
const publicRules = robots();
assert(Array.isArray(publicRules.rules));
const serialize = (rule) =>
  [
    `User-agent: ${rule.userAgent}`,
    ...[rule.allow]
      .flat()
      .filter(Boolean)
      .map((p) => `Allow: ${p}`),
    ...[rule.disallow]
      .flat()
      .filter(Boolean)
      .map((p) => `Disallow: ${p}`),
  ].join('\n');
const staticRules = readFileSync('public/robots.txt', 'utf8');
for (const rule of publicRules.rules)
  assert(staticRules.includes(serialize(rule)));
for (const agent of ['Googlebot', 'bingbot', 'OAI-SearchBot', 'GPTBot']) {
  const rule =
    publicRules.rules.find(
      (r) => r.userAgent.toLowerCase() === agent.toLowerCase(),
    ) || publicRules.rules.find((r) => r.userAgent === '*');
  if (agent === 'GPTBot') {
    assert.equal(rule.disallow, '/');
    assert.equal(rule.allow, undefined);
  } else {
    assert.equal(rule.allow, '/');
    assert.deepEqual(rule.disallow, ['/admin', '/api']);
  }
}
process.env.NEXT_PUBLIC_SITE_PUBLIC = 'false';
assert.deepEqual(robots().rules, { userAgent: '*', disallow: '/' });
assert.equal(robots().sitemap, undefined);
if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_PUBLIC;
else process.env.NEXT_PUBLIC_SITE_PUBLIC = previous;
assert.equal(Object.keys(articleEvidenceReviews).length, 4);
for (const [path, review] of Object.entries(articleEvidenceReviews)) {
  const article = path.startsWith('/games/')
    ? gameArticles.find((a) => path === `/games/${a.gameSlug}/${a.slug}`)
    : commonGuides.find((a) => path === `/guide/${a.slug}`);
  assert(article, path);
  assert(article.conclusion.length < 175, path);
  assert(article.steps.length > 0, path);
  assert(
    review.scope &&
      review.result &&
      review.limits &&
      review.compare &&
      review.sourceReview,
    path,
  );
  assert(review.official.length > 0, path);
  assert(review.official.every((s) => s.url.startsWith('https://')));
  assert(
    !/2026-10-25/.test(article.checkedAt),
    'Do not silently refresh the whole article date',
  );
}
const report = reportedCases.find((r) => r.slug === 'wilds-steam-added-dll');
assert.equal(report.gameVersion, null);
assert.equal(report.reportedOn, null);
assert.equal(report.steamVersion, null);
assert.match(articleEvidenceReviews[report.articlePath].result, /本人報告1件/);
assert.match(
  articleEvidenceReviews[report.articlePath].limits,
  /原因DLLは特定できず/,
);
const inventory = JSON.parse(
  readFileSync(
    'docs/search-evidence-2026-10-25/article-inventory.json',
    'utf8',
  ),
);
assert.equal(
  inventory.articles.filter((a) => a.scope === 'individual-evidence-added')
    .length,
  4,
);
assert.equal(
  inventory.articles.filter((a) => a.scope === 'not-reviewed-this-change')
    .length,
  186,
);
console.log(
  'PASS: robot groups/static parity, Google/Bing access, admin/API exclusion, private mode; four scoped reviews, inherited dates, existing report unknowns and explicit backlog',
);
