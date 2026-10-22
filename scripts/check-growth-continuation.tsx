import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { ArticleEvidence } from '../components/article-evidence';
import { nextDiagnosisArticle } from '../lib/diagnosis/next-article';
import { diagnose } from '../lib/diagnosis/rules';
import { saveResolvedFix } from '../lib/fix-save';
import { readSolutions } from '../lib/saved-solutions';

const result = diagnose({
  symptom: 'low-fps',
  scope: 'game',
  observation: 'capped',
  change: 'settings',
  launcher: 'steam',
  safety: 'none',
  storage: 'none',
});
assert(result.recommendations.length);
const next = nextDiagnosisArticle(result, {});
assert.equal(next, result.recommendations[0]);
assert.equal(
  nextDiagnosisArticle(
    result,
    Object.fromEntries(
      result.recommendations.map((r) => [r.action.id, 'unchanged']),
    ),
  ),
  undefined,
);
assert.equal(
  nextDiagnosisArticle(result, { [next!.action.id]: 'improved' }),
  undefined,
);
assert.equal(nextDiagnosisArticle({ ...result, scope: 'pc' }, {}), undefined);
assert.equal(
  nextDiagnosisArticle({ ...result, scope: 'insufficient' }, {}),
  undefined,
);
assert.notEqual(
  nextDiagnosisArticle(result, { [next!.action.id]: 'tried' })?.action.id,
  next!.action.id,
);
for (const locale of ['ja', 'en']) {
  const html = renderToStaticMarkup(
    <ArticleEvidence
      path="/games/rocket-league/dualsense-not-working"
      locale={locale}
    />,
  );
  assert.match(html, /2026-10-22/);
  assert.match(html, /epicgames.com/);
  assert.match(html, /playstation.com/);
  assert.equal((html.match(/<h3>/g) || []).length, 3);
}
assert.equal(
  renderToStaticMarkup(<ArticleEvidence path="/games/aniimo/not-launching" />),
  '',
);
assert.equal(
  renderToStaticMarkup(
    <ArticleEvidence
      path="/games/rocket-league/dualsense-not-working"
      locale="zh"
    />,
  ),
  '',
);
const map = new Map<string, string>();
const storage = {
  getItem: (k: string) => map.get(k) ?? null,
  setItem: (k: string, v: string) => {
    map.set(k, v);
  },
};
storage.setItem('gemnao-my-games', JSON.stringify(['apex-legends']));
const draft = {
  title: 'Controller check',
  gameSlug: 'rocket-league',
  status: 'resolved' as const,
  diagnosis: '',
  settings: 'Bluetooth → USB; menu input works',
  notes: '',
  articlePath: '/games/rocket-league/dualsense-not-working',
  stepId: 'check-connection',
  completedSteps: [],
};
const first = saveResolvedFix(
  storage,
  draft,
  undefined,
  'en',
  'User supplied version',
);
assert.equal(first.item.settings, draft.settings);
assert.deepEqual(JSON.parse(storage.getItem('gemnao-my-games')!), [
  'apex-legends',
  'rocket-league',
]);
const original = storage.getItem('gemnao-solutions-v1');
const repeated = saveResolvedFix(
  storage,
  { ...draft, settings: 'Different value' },
  undefined,
  'en',
);
assert.equal(repeated.created, false);
assert.equal(storage.getItem('gemnao-solutions-v1'), original);
assert.equal(readSolutions(storage).length, 1);
storage.setItem('gemnao-solutions-v1', 'corrupt');
assert.throws(() => saveResolvedFix(storage, draft, undefined, 'en'));
assert.equal(storage.getItem('gemnao-solutions-v1'), 'corrupt');
console.log(
  'PASS: matched next article, no safety/unrelated fallback, bilingual evidence, settings retention, repeated save and corruption preservation',
);
