import assert from 'node:assert/strict';
import {
  solutionRanking,
  stepSolutionReports,
  feedbackSummary,
} from '../lib/solution-ranking';
import { articleSteps } from '../lib/article-step-data';
import { gameArticles } from '../lib/game-articles';
import { discordArticles } from '../lib/discord-articles';
import { commonGuides } from '../lib/common-guides';
assert.deepEqual(feedbackSummary({ resolved: 0, struggling: 0 }), {
  total: 0,
  percentage: null,
});
assert.deepEqual(feedbackSummary({ resolved: 9, struggling: 0 }), {
  total: 9,
  percentage: null,
});
assert.deepEqual(feedbackSummary({ resolved: 7, struggling: 3 }), {
  total: 10,
  percentage: 70,
});
const steps = [
  { id: 'a', title: '正規の方法A' },
  { id: 'b', title: '正規の方法B' },
];
const report = (id: string, n: number) => ({
  methodId: id,
  methodLabel: '任意の投稿ラベル',
  responses: n,
});
assert.equal(solutionRanking([report('a', 9)], steps, 30).length, 0);
assert.equal(solutionRanking([report('unknown', 50)], steps, 50).length, 0);
assert.equal(solutionRanking([report('a', 11)], steps, 10).length, 0);
assert.equal(solutionRanking([report('a', NaN)], steps, 20).length, 0);
assert.equal(stepSolutionReports([], steps, 0).length, 0);
assert.equal(stepSolutionReports([report('a', 1)], steps, 1)[0].responses, 1);
assert.equal(stepSolutionReports([report('a', 9)], steps, 9)[0].responses, 9);
assert.equal(stepSolutionReports([report('a', 0)], steps, 0).length, 0);
const tied = solutionRanking([report('a', 5), report('b', 5)], steps, 10);
assert.deepEqual(
  tied.map((x) => [x.rank, x.tied]),
  [
    [1, true],
    [1, true],
  ],
);
assert.equal(tied[0].methodLabel, '正規の方法A');
assert.equal(solutionRanking([report('a', 10)], steps, 10)[0].responses, 10);
const contexts = [
  ...gameArticles.map((a) => `game-${a.gameSlug}-${a.slug}`),
  ...discordArticles.map((a) => `discord-${a.slug}`),
  ...commonGuides.map((a) => `guide-${a.slug}`),
];
for (const context of contexts) {
  const resolved = articleSteps(context);
  assert(resolved?.length, context);
  assert.equal(
    new Set(resolved.map((s) => s.id)).size,
    resolved.length,
    context,
  );
}
const urls = new Set([
  ...gameArticles.map((a) => `/games/${a.gameSlug}/${a.slug}`),
  ...discordArticles.map((a) => `/discord/${a.slug}`),
]);
for (const article of gameArticles)
  for (const slug of article.related)
    assert(
      urls.has(`/games/${article.gameSlug}/${slug}`),
      `${article.slug} -> ${slug}`,
    );
for (const article of discordArticles)
  for (const slug of article.related)
    assert(urls.has(`/discord/${slug}`), `${article.slug} -> ${slug}`);
console.log(
  `PASS: threshold, ties, invalid counts/IDs, trusted labels; ${contexts.length} article step mappings and related links`,
);
