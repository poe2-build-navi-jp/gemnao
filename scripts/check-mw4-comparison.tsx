import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { articleBySlug } from '../lib/game-articles';
import { gameBySlug } from '../lib/games';
// Measurement instructions must not create a solved/not-solved feedback step.
const mw4 = articleBySlug('call-of-duty-modern-warfare-4', 'crash')!;
const { TroubleshootingArticle } =
  await import('../components/troubleshooting-article');
const mw4Html = renderToStaticMarkup(
  <TroubleshootingArticle game={gameBySlug(mw4.gameSlug)!} article={mw4} />,
);
assert(!mw4.steps.some((step) => step.id === 'compare-results'));
const comparisonSection = mw4Html.match(
  /<section[^>]*id="compare-results"[^>]*>([\s\S]*?)<\/section>/,
)?.[1];
assert(comparisonSection, 'Comparison instructions remain publicly readable');
assert(
  !comparisonSection.includes('<button'),
  'Recording measurements cannot submit solved feedback',
);
assert(
  comparisonSection.includes('/my-games#my-game-call-of-duty-modern-warfare-4'),
);
assert(
  mw4Html.includes('href="#compare-results"'),
  'Comparison stays reachable from the article TOC',
);
console.log(
  'PASS: MW4 comparison instructions stay outside repair votes and preserve their TOC/log links',
);
