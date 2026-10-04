'use client';
/* oxlint-disable next/no-html-link-for-pages -- Preserve native article navigation. */
import { useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchEnglishEntries, type EnglishSearchEntry } from '@/lib/english-search';
import { useSearchQuery } from './use-search-query';
export function EnglishHomeSearch({ entries }: { entries: EnglishSearchEntry[] }) {
  const [query, setQuery] = useSearchQuery();
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchEnglishEntries(entries, query), [entries, query]);
  const searching = Boolean(query.trim());
  return <section className="content english-home-search" aria-labelledby="english-search-title">
    <h2 id="english-search-title">Find an English guide</h2>
    <label htmlFor="english-search">Search by game, symptom or error code</label>
    <div className="search-box">
      <Search size={20} aria-hidden="true" />
      <input id="english-search" ref={input} type="search" value={query}
        placeholder="e.g. Wilds crash, ST-3100001"
        onChange={event => setQuery(event.target.value)} />
      {query && <button className="clear-search" type="button" onClick={() => {
        setQuery(''); input.current?.focus();
      }}>Clear</button>}
    </div>
    {searching && <>
      <output aria-live="polite">{results.length} English results</output>
      {!results.length && <p>No matching English guides. Try a game name, a shorter symptom or the error code.</p>}
      <div className="search-result-list">
        {results.map(result => <a href={result.href} key={result.href}>
          <span><small>{result.label}</small><strong>{result.title}</strong></span>
          <span aria-hidden="true">→</span>
        </a>)}
      </div>
    </>}
  </section>;
}
