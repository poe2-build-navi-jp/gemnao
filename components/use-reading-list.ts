'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  parseReadingList,
  readingListError,
  READING_LIST_KEY,
  type ReadingListLocale,
} from '@/lib/reading-list';
import { MY_DATA_EVENT } from '@/lib/saved-solutions';

const UNAVAILABLE = Symbol('reading-list-storage-unavailable');

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    // A clear() in another tab has a null key and must refresh this list too.
    if (event.key !== null && event.key !== READING_LIST_KEY) return;
    try {
      if (event.storageArea && event.storageArea !== window.localStorage)
        return;
    } catch {
      // Still notify so a newly blocked storage area becomes a visible error.
    }
    callback();
  };
  window.addEventListener(MY_DATA_EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(MY_DATA_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot() {
  try {
    // Strings, null and the constant Symbol keep unchanged snapshots stable.
    return window.localStorage.getItem(READING_LIST_KEY);
  } catch {
    return UNAVAILABLE;
  }
}

const getServerSnapshot = () => undefined;

export function announceReadingListChange() {
  if (typeof window !== 'undefined')
    window.dispatchEvent(new Event(MY_DATA_EVENT));
}

export function useReadingList(locale: ReadingListLocale = 'ja') {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    const ready = raw !== undefined;
    try {
      if (raw === UNAVAILABLE) throw new Error('Storage unavailable');
      return { items: parseReadingList(raw ?? null), ready, error: '' };
    } catch (error) {
      return { items: [], ready, error: readingListError(error, locale) };
    }
  }, [raw, locale]);
}
