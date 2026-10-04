import { normalizeSearchQuery, rankSearchDocuments } from './search-ranking';
export type EnglishSearchEntry = { href: string; title: string; label: string; body: string };
export function searchEnglishEntries(entries: EnglishSearchEntry[], query: string) {
  const phrase = normalizeSearchQuery(query);
  const terms = [...new Set(phrase.split(/\s+/).filter(Boolean))];
  return rankSearchDocuments(entries.map(item => ({
    item,
    title: normalizeSearchQuery(item.title),
    keywords: normalizeSearchQuery(item.label),
    body: normalizeSearchQuery(item.body),
  })), terms, phrase, !phrase, (a, b) => a.title.localeCompare(b.title, 'en'));
}
