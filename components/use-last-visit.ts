'use client';

import { useEffect, useSyncExternalStore } from 'react';

// When the reader last opened マイページ, kept only in this browser.
// The previous visit is copied into sessionStorage once per tab session and
// used as the "新着" baseline, so reloading the page keeps the same badges
// while the next visit compares against this one.
const LAST_KEY = 'gemnao-my-last-visit';
const PREV_KEY = 'gemnao-my-prev-visit';
const EVENT = 'gemnao-my-visit';

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function readPrevious() {
  try {
    return sessionStorage.getItem(PREV_KEY);
  } catch {
    return null;
  }
}

function recordVisit(now: string) {
  try {
    if (sessionStorage.getItem(PREV_KEY) === null) {
      // '' marks "first visit in this browser": nothing is new yet.
      sessionStorage.setItem(PREV_KEY, localStorage.getItem(LAST_KEY) ?? '');
    }
    localStorage.setItem(LAST_KEY, now);
  } catch {
    // Storage blocked: badges simply stay hidden.
  }
  window.dispatchEvent(new Event(EVENT));
}

const nowIso = () => new Date().toISOString();

/**
 * The previous visit time (ISO string), '' on the first visit, or undefined
 * while it is not known yet (server render, hydration, blocked storage).
 */
export function usePreviousVisit() {
  const previous = useSyncExternalStore(subscribe, readPrevious, () => null);
  useEffect(() => {
    recordVisit(nowIso());
  }, []);
  return previous ?? undefined;
}

/** JST calendar date (YYYY-MM-DD) of an ISO time. */
export function jstDate(iso: string) {
  return new Date(Date.parse(iso) + 9 * 3_600_000).toISOString().slice(0, 10);
}
