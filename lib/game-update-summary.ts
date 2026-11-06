export type GameUpdateSummary = {
  id: string;
  gameSlug: string;
  gameTitle: string;
  title: string;
  language?: string;
  publishedOn: string;
  checkedOn: string;
  href: string;
};
export function unreadGameUpdates(
  updates: GameUpdateSummary[],
  saved: string[],
  read: string[],
) {
  const games = new Set(saved),
    seen = new Set<string>(),
    readIds = new Set(read);
  return updates
    .filter((item) => {
      if (
        !games.has(item.gameSlug) ||
        readIds.has(item.id) ||
        seen.has(item.id)
      )
        return false;
      seen.add(item.id);
      return true;
    })
    .sort(
      (a, b) =>
        b.publishedOn.localeCompare(a.publishedOn) || a.id.localeCompare(b.id),
    );
}
