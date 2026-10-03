// Release dates (Japan) of the new games we cover, used to put their
// troubleshooting articles at the top of the home page and the feed in the
// weeks around launch, when people search for them. Dates come from the
// release roundups / Steam store; update when a date moves.

export type Launch = {
  gameSlug: string;
  /** Japanese release date (YYYY-MM-DD). */
  release: string;
  /** Early access start, if any. */
  earlyAccess?: string;
};

export const launches: Launch[] = [
  { gameSlug: 'silent-hill-townfall', release: '2026-09-24' },
  { gameSlug: 'control-resonant', release: '2026-09-24' },
  { gameSlug: 'minecraft-dungeons-2', release: '2026-09-29' },
  { gameSlug: 'shin-sangoku-musou-2-remastered', release: '2026-10-01' },
  {
    gameSlug: 'ace-combat-8',
    release: '2026-10-02',
    earlyAccess: '2026-09-29',
  },
  { gameSlug: 'aion2', release: '2026-10-05', earlyAccess: '2026-09-30' },
  {
    gameSlug: 'gears-of-war-e-day',
    release: '2026-10-07',
    earlyAccess: '2026-10-02',
  },
  { gameSlug: 'dragons-dogma-2', release: '2026-10-09' },
  { gameSlug: 'castlevania-belmonts-curse', release: '2026-10-15' },
  { gameSlug: 'tales-of-eternia-remastered', release: '2026-10-16' },
  { gameSlug: 'call-of-duty-modern-warfare-4', release: '2026-10-23' },
  { gameSlug: 'final-fantasy-resonance', release: '2026-10-23' },
  { gameSlug: 'phantom-blade-zero', release: '2026-10-28' },
  {
    gameSlug: 'dragon-quest-monsters-4',
    release: '2026-12-03',
    earlyAccess: '2026-12-02',
  },
];

const DAY = 86_400_000;

/** Games from 14 days before (early access) launch to 21 days after release. */
export function activeLaunches(now: number) {
  return launches
    .filter((item) => {
      const start = Date.parse(item.earlyAccess ?? item.release) - 14 * DAY;
      const end = Date.parse(item.release) + 21 * DAY;
      return now >= start && now <= end;
    })
    .sort((a, b) => a.release.localeCompare(b.release));
}
