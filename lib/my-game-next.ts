import type { PlayPlan } from './play-plans';
export function nextGameAction(
  saved: string[],
  plans: PlayPlan[],
  known: string[],
) {
  return plans
    .filter(
      (p) =>
        saved.includes(p.gameSlug) &&
        known.includes(p.gameSlug) &&
        p.next.trim(),
    )
    .sort(
      (a, b) =>
        Date.parse(b.updatedAt) - Date.parse(a.updatedAt) ||
        a.gameSlug.localeCompare(b.gameSlug),
    )[0];
}
