'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native continuation fragment link. */
import { useBrowserRecords } from './use-browser-records';
import { MY_GAMES_KEY } from '@/lib/my-pc';
import { MY_DATA_EVENT } from '@/lib/saved-solutions';
import { parseRegisteredGames } from '@/lib/my-games-selection';
import {
  PLAY_PLANS_KEY,
  PLAY_PLANS_EVENT,
  parsePlayPlans,
} from '@/lib/play-plans';
import { nextGameAction } from '@/lib/my-game-next';
import { games } from '@/lib/games';
import { gameDisplayName } from '@/lib/game-display-name';
import { myGamesPath, type MyGamesLocale } from '@/lib/my-games-copy';
import { myGamesTransferCopy } from '@/lib/my-games-transfer-copy';
export function NextGameAction({ locale }: { locale: MyGamesLocale }) {
  const registered = useBrowserRecords(
    MY_GAMES_KEY,
    MY_DATA_EVENT,
    parseRegisteredGames,
  );
  const plans = useBrowserRecords(
    PLAY_PLANS_KEY,
    PLAY_PLANS_EVENT,
    parsePlayPlans,
  );
  if (!registered.ready || !plans.ready || registered.error || plans.error)
    return null;
  const plan = nextGameAction(
    registered.items,
    plans.items,
    games.map((g) => g.slug),
  );
  if (!plan) return null;
  const game = games.find((g) => g.slug === plan.gameSlug)!;
  const name = gameDisplayName(game, locale);
  const t = myGamesTransferCopy[locale];
  return (
    <div className="home-next-game">
      <p>
        <strong>
          {t.homeNext}: {name}
        </strong>
      </p>
      <p className="home-next-text">{plan.next}</p>
      <a href={`${myGamesPath(locale)}#play-plan-${game.slug}`}>
        {t.homeOpen} →
      </a>
    </div>
  );
}
