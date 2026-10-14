import type { GameGuide } from '@/lib/games';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { gameFacts } from '@/lib/localized/game-facts';

// Official English store names checked 2026-10-14. Use the product name as a
// fallback, without claiming that a translated hub or localized specs exist.
// Steam app IDs: 2054970, 3470960, 3681610, 3841510 respectively.
const officialFallbackNames: Record<string, string> = {
  'dragons-dogma-2': "Dragon's Dogma 2",
  'tales-of-eternia-remastered': 'Tales of Eternia Remastered',
  'dragon-quest-monsters-4': 'DRAGON QUEST MONSTERS: The Withered World',
  'shin-sangoku-musou-2-remastered':
    'DYNASTY WARRIORS 3: Complete Edition Remastered',
};
export function gameDisplayName(
  game: Pick<GameGuide, 'slug' | 'title' | 'shortTitle'> | undefined,
  locale: MyGamesLocale,
): string {
  if (!game) return '';
  if (locale === 'ja') return game.shortTitle;
  if (gameFacts[game.slug]?.names[locale])
    return gameFacts[game.slug].names[locale];
  const title = game.title.split('（')[0].split(' / ')[0];
  return (
    officialFallbackNames[game.slug] ||
    (/[ぁ-んァ-ヶ一-龯]/u.test(title)
      ? game.title.match(/（([A-Za-z][^）]+)）/u)?.[1] || title
      : title)
  );
}
