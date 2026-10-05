'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  MY_DATA_EVENT,
  parseSolutions,
  solutionError,
  SOLUTIONS_KEY,
} from '@/lib/saved-solutions';

function subscribe(callback: () => void) {
  window.addEventListener(MY_DATA_EVENT, callback);
  window.addEventListener('storage', callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener(MY_DATA_EVENT, callback);
    window.removeEventListener('storage', callback);
    window.removeEventListener('pageshow', callback);
  };
}
export function announceMyData() {
  window.dispatchEvent(new Event(MY_DATA_EVENT));
}
export function useSavedSolutions() {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(SOLUTIONS_KEY) ?? '';
      } catch {
        return '!storage-unavailable';
      }
    },
    () => undefined,
  );
  return useMemo(() => {
    try {
      return {
        items: parseSolutions(raw || null),
        error: '',
        ready: raw !== undefined,
      };
    } catch (error) {
      return {
        items: [],
        error: solutionError(error),
        ready: raw !== undefined,
      };
    }
  }, [raw]);
}
