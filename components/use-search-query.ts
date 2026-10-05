'use client';
import { useEffect, useState } from 'react';
// Replace this history entry so article → Back restores the query without
// adding a history entry for every keystroke. Preserve the router's state.
export function useSearchQuery(parameter = 'q', initial = '') {
  const [query, setQuery] = useState(initial);
  useEffect(() => {
    const restore = () => setQuery(new URL(window.location.href).searchParams.get(parameter) || initial);
    restore();
    window.addEventListener('popstate', restore);
    window.addEventListener('pageshow', restore);
    return () => {
      window.removeEventListener('popstate', restore);
      window.removeEventListener('pageshow', restore);
    };
  }, [parameter, initial]);
  function update(value: string) {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value && value !== initial) url.searchParams.set(parameter, value);
    else url.searchParams.delete(parameter);
    window.history.replaceState(window.history.state, '', url);
  }
  return [query, update] as const;
}
