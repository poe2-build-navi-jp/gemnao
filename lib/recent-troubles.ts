import { safeReadingPath } from '@/lib/reading-list';

// Reuse the existing history key. No history is sent to a server.
export const RECENT_TROUBLES_KEY = 'gemnao-recent-troubles';
export type RecentTrouble = { title: string; path: string; viewedAt: string };
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;

export function parseRecentTroubles(raw: string | null): RecentTrouble[] {
  if (!raw || raw.length > 100_000) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const paths = new Set<string>();
    return value
      .filter((item): item is RecentTrouble => {
        if (!item || typeof item !== 'object') return false;
        const valid =
          typeof item.path === 'string' &&
          safeReadingPath(item.path) &&
          typeof item.title === 'string' &&
          Boolean(item.title.trim()) &&
          item.title.length <= 240 &&
          typeof item.viewedAt === 'string' &&
          item.viewedAt.length <= 40 &&
          Number.isFinite(Date.parse(item.viewedAt)) &&
          !paths.has(item.path);
        if (valid) paths.add(item.path);
        return valid;
      })
      .slice(0, 5)
      .map(({ title, path, viewedAt }) => ({ title, path, viewedAt }));
  } catch {
    return [];
  }
}

export function rememberTrouble(storage: Storage, item: RecentTrouble) {
  if (parseRecentTroubles(JSON.stringify([item])).length !== 1) return;
  try {
    const raw = storage.getItem(RECENT_TROUBLES_KEY);
    const previous = parseRecentTroubles(raw);
    if (raw !== null) {
      // History updates are automatic; never replace unreadable existing data.
      if (raw.length > 100_000) return;
      const source: unknown = JSON.parse(raw);
      if (!Array.isArray(source) || source.length !== previous.length) return;
    }
    storage.setItem(
      RECENT_TROUBLES_KEY,
      JSON.stringify(
        [item, ...previous.filter((old) => old.path !== item.path)].slice(0, 5),
      ),
    );
  } catch {
    // Reading an article must work even when storage is blocked or full.
  }
}
