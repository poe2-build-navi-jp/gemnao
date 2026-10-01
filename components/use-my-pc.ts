'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { MY_GAMES_KEY, MY_PC_KEY, type MyPc } from '@/lib/my-pc';

// マイPC / マイゲーム live only in this browser (localStorage). Components
// and other tabs stay in sync through a custom event and the storage event.
const EVENT = 'gemnao-my-data';

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function readRaw(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** `ready` is false during server rendering and hydration. */
function useStored<T>(key: string, parse: (raw: string | null) => T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key) ?? '',
    () => undefined,
  );
  const value = useMemo(
    () => parse(raw === undefined || raw === '' ? null : raw),
    [raw, parse],
  );
  const save = useCallback(
    (next: T | null) => {
      try {
        if (next === null) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Private mode or storage disabled: nothing is saved.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [value, save, raw !== undefined] as const;
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const parsePc = (raw: string | null) => parseJson<MyPc | null>(raw, null);
const parseGames = (raw: string | null) => {
  const value = parseJson<unknown>(raw, []);
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
};

export const useMyPc = () => useStored(MY_PC_KEY, parsePc);
export const useMyGames = () => useStored(MY_GAMES_KEY, parseGames);
