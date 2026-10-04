import {
  readSolutions,
  serializeSolutions,
  SOLUTIONS_KEY,
  type SavedSolution,
} from './saved-solutions';
import { emptySupport } from './support-record';
import type { SupportLocale } from './support-copy';
export type SupportUpdate = {
  id: string;
  gameSlug: string;
  symptomPaths: string[];
  kind: 'official' | 'workaround';
  sourceUrl: string;
  verifiedOn: string;
  publishedAt: string;
  text: Record<SupportLocale, string>;
};
// Editorial registry, deliberately empty until specific claims and applicability
// have been checked. Never populate from article updatedAt or general Steam news.
export const supportUpdates: SupportUpdate[] = [];
export function matchingUpdates(
  item: SavedSolution,
  updates = supportUpdates,
  now = Date.now(),
) {
  if (item.status === 'resolved' || !item.gameSlug) return [];
  const paths = new Set([
    item.articlePath,
    ...(item.support?.attempts.map((a) => a.path) || []),
  ]);
  return updates.filter(
    (update) =>
      update.gameSlug === item.gameSlug &&
      update.symptomPaths.some((path) => paths.has(path)) &&
      update.sourceUrl.startsWith('https://') &&
      Number.isFinite(Date.parse(update.verifiedOn)) &&
      Date.parse(update.verifiedOn) <= now &&
      Number.isFinite(Date.parse(update.publishedAt)) &&
      Date.parse(update.publishedAt) <= now &&
      !item.support?.seenUpdates.includes(update.id),
  );
}

// A single write makes marking a batch as read all-or-nothing on quota failure.
export function markUpdatesRead(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  visible: { id: string; updates: string[] }[],
) {
  const records = readSolutions(storage);
  const next = records.map((item) => {
    const ids = visible.find((entry) => entry.id === item.id)?.updates;
    if (!ids?.length) return item;
    const support = item.support || emptySupport();
    return {
      ...item,
      support: {
        ...support,
        seenUpdates: [...new Set([...support.seenUpdates, ...ids])],
      },
    };
  });
  storage.setItem(SOLUTIONS_KEY, serializeSolutions(next));
}
