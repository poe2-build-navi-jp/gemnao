export function normalizeSearchQuery(value: string) {
  return value.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
}

export type SearchDocument<T> = {
  item: T;
  title: string;
  keywords: string;
  body: string;
};
export function rankSearchDocuments<T>(
  index: SearchDocument<T>[], terms: string[], phrase: string, empty: boolean,
  tieBreak: (a: T, b: T) => number,
): T[] {
  if (!terms.length)
    return !empty ? [] : index.map(({ item }) => item).sort(tieBreak);
  return index
    .map((entry) => {
      const all = `${entry.title} ${entry.keywords} ${entry.body}`;
      if (!terms.every((term) => all.includes(term)))
        return { item: entry.item, score: -1 };
      const score =
        (entry.title.includes(phrase) ? 100 : 0) +
        terms.reduce(
          (sum, term) =>
            sum +
            (entry.title.includes(term)
              ? 30
              : entry.keywords.includes(term)
                ? 12
                : 3),
          0,
        );
      return { item: entry.item, score };
    })
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || tieBreak(a.item, b.item))
    .map(({ item }) => item);
}
