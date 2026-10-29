import Fuse from 'fuse.js';

export function normalizeSearchQuery(value: string) {
  return value.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
}
export type SearchDocument<T> = { item: T; title: string; keywords: string; body: string };
// Error identifiers are never corrected as spelling mistakes. Punctuation/width
// variations of the same identifier are accepted, but not adjacent code numbers.
export function searchErrorCodes(value: string): string[] {
  return [...new Set((normalizeSearchQuery(value).match(/\b(?:0x[0-9a-f]{4,}|dxgi_error_[a-z_]+|(?:st|van|wd)[\s_-]*\d[\da-z_-]*|\d{4,})\b/g) || [])
    .map(code => code.replace(/[\s_-]/g, '')))];
}
const cache = new WeakMap<object, Fuse<SearchDocument<unknown>>>();
function engine<T>(index: SearchDocument<T>[]) {
  let fuse = cache.get(index);
  if (!fuse) {
    fuse = new Fuse<SearchDocument<unknown>>(index, {
      keys: [{ name: 'title', weight: 0.55 }, { name: 'keywords', weight: 0.32 }, { name: 'body', weight: 0.13 }],
      includeScore: true, ignoreLocation: true, threshold: 0.3,
      minMatchCharLength: 2,
    });
    cache.set(index, fuse);
  }
  return fuse;
}
export function rankSearchDocuments<T>(index: SearchDocument<T>[], terms: string[], phrase: string, empty: boolean, tieBreak: (a: T, b: T) => number): T[] {
  if (!terms.length) return !empty ? [] : index.map(({ item }) => item).sort(tieBreak);
  if (phrase.length > 300 || terms.length > 20) return [];
  const codes = searchErrorCodes(phrase);
  const candidates = index.map((entry, i) => ({ entry, i, all: `${entry.title} ${entry.keywords} ${entry.body}`, score: 0 }));
  const scores = terms.map(term => {
    const exact = new Map<number, number>();
    for (const row of candidates) if (row.all.includes(term)) exact.set(row.i, row.entry.title.includes(term) ? 30 : row.entry.keywords.includes(term) ? 18 : 4);
    // Keep established exact matches and short tokens precise. Fuzzy spelling
    // is a fallback for a missing term, not a way to drop an unknown qualifier.
    if (exact.size || term.length < 4 || searchErrorCodes(term).length) return exact;
    return new Map(engine(index).search(term).map(hit => [hit.refIndex, 3 * (1 - (hit.score ?? 1))]));
  });
  return candidates.filter(row => scores.every(score => score.has(row.i)) && codes.every(code => searchErrorCodes(row.all).includes(code)))
    .map(row => ({ item: row.entry.item, score: scores.reduce((sum, s) => sum + (s.get(row.i) ?? 0), 0) + (row.entry.title.includes(phrase) ? 100 : 0) + codes.filter(code => searchErrorCodes(row.entry.title).includes(code)).length * 200 }))
    .sort((a,b) => b.score - a.score || tieBreak(a.item,b.item)).map(row => row.item);
}
