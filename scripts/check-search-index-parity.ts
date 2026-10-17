// The home page searches a compact index (/search-index.json, no article
// bodies). It must return exactly what the full server index returns.
import assert from 'node:assert/strict';
import { searchClusters, searchInIndex } from '../lib/search-core';
import { compactSearchIndex, searchArticles } from '../lib/site-search';

const index = compactSearchIndex();
assert.ok(
  !JSON.stringify(index).includes('"gameArticle"'),
  'compact index must not carry article bodies',
);
const queries = [
  '',
  'エスコン 起動しない',
  'steam',
  'セーブ',
  'discord マイク',
  'AION2',
  '黒い画面',
  '未収録タイトル 起動しない',
];
for (const cluster of ['all', ...searchClusters])
  for (const query of queries) {
    const full = searchArticles(query, cluster).map((item) => item.key);
    const compact = searchInIndex(index, query, cluster).map(
      (item) => item.key,
    );
    assert.deepEqual(compact, full, `${cluster} / "${query}"`);
  }
console.log(
  `PASS: compact search index matches the full index (${queries.length} queries × ${searchClusters.length + 1} filters, ${index.length} articles)`,
);
