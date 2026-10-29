import { changesForGame, officialGameChanges } from './my-game-changes';
import type { ReadingItem } from './reading-list';
import { parseReadChanges } from './my-game-changes-read';
export const SAVED_CHANGES_KEY = 'gemnao-saved-article-changes-v1';
// Separate from My Games read state and all existing saved-data schemas.
export function initializeSavedChanges(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
) {
  const raw = storage.getItem(SAVED_CHANGES_KEY);
  if (raw !== null) {
    parseReadChanges(raw);
    return;
  }
  storage.setItem(
    SAVED_CHANGES_KEY,
    JSON.stringify({ version: 1, read: officialGameChanges.map((c) => c.id) }),
  );
}
export function savedArticleChanges(items: ReadingItem[], locale: 'ja' | 'en') {
  const paths = new Set(
    items.map((item) => item.path.replace(/^\/(en|zh|es)\//, '/')),
  );
  const games = new Set(
    officialGameChanges
      .filter((c) => paths.has(c.articlePath))
      .map((c) => c.gameSlug),
  );
  return [...games]
    .flatMap((game) => changesForGame(game, locale))
    .filter((c) => paths.has(c.articlePath));
}
