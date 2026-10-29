'use client';
/* oxlint-disable next/no-html-link-for-pages -- Preserve native article navigation. */
import { ocrCopy } from '@/lib/ocr-copy';
import { guideUi } from '@/lib/localized/guide-ui';
import type { Locale } from '@/lib/i18n';
import { useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchEnglishEntries, type EnglishSearchEntry } from '@/lib/english-search';
import { useSearchQuery } from './use-search-query';
export function EnglishHomeSearch({ entries, locale = 'en' }: { entries: EnglishSearchEntry[]; locale?: Locale }) {
  const t = guideUi[locale];
  const [query, setQuery] = useSearchQuery();
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchEnglishEntries(entries, query), [entries, query]);
  const searching = Boolean(query.trim());
  return <section className="content english-home-search" aria-labelledby="english-search-title">
    <h2 id="english-search-title">{t.searchTitle}</h2>
    <label htmlFor="english-search">{t.searchLabel}</label>
    <div className="search-box">
      <Search size={20} aria-hidden="true" />
      <input id="english-search" ref={input} type="search" value={query}
        placeholder={t.placeholder}
        onChange={event => setQuery(event.target.value)} />
      {query && <button className="clear-search" type="button" onClick={() => {
        setQuery(''); input.current?.focus();
      }}>{t.clear}</button>}
    </div>
    <p><a href={`/diagnose/image-search?lang=${locale}`}>{ocrCopy[locale].title} →</a></p>
    {searching && <>
      <output aria-live="polite">{results.length} {t.results}</output>
      {!results.length && <p>{t.empty}</p>}
      <div className="search-result-list">
        {results.map(result => <a href={result.href} key={result.href}>
          <span><small>{result.label}</small><strong>{result.title}</strong></span>
          <span aria-hidden="true">→</span>
        </a>)}
      </div>
    </>}
  </section>;
}
