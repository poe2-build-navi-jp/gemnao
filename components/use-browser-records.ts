'use client';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
export function useBrowserRecords<T>(
  key: string,
  event: string,
  parse: (raw: string | null) => T[],
) {
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      window.addEventListener(event, callback);
      window.addEventListener('pageshow', callback);
      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(event, callback);
        window.removeEventListener('pageshow', callback);
      };
    },
    [event],
  );
  const snapshot = useCallback(() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return '!unavailable';
    }
  }, [key]);
  const raw = useSyncExternalStore(subscribe, snapshot, () => undefined);
  return useMemo(() => {
    try {
      return {
        items: parse(raw ?? null),
        ready: raw !== undefined,
        error: false,
      };
    } catch {
      return { items: [] as T[], ready: raw !== undefined, error: true };
    }
  }, [raw, parse]);
}
