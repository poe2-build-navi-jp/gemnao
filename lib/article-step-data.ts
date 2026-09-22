import { gameArticles } from './game-articles';
import { discordArticles } from './discord-articles';
import { commonGuides } from './common-guides';

// Resolve stored identifiers against published content; never trust client labels.
export function articleSteps(context: string) {
  const game = gameArticles.find(
    (a) =>
      `game-${a.gameSlug}-${a.slug}` === context &&
      !['draft', 'thin'].includes(a.status || 'verified'),
  );
  if (game) return game.steps;
  const discord = discordArticles.find(
    (a) => `discord-${a.slug}` === context && a.status === 'verified',
  );
  if (discord)
    return discord.causes.map((cause, i) => ({
      id: `cause-${i + 1}`,
      title: cause.title,
    }));
  const guide = commonGuides.find(
    (a) => `guide-${a.slug}` === context && a.status === 'verified',
  );
  return guide?.steps.map((step, i) => ({
    id: `step-${i + 1}`,
    title: step.title,
  }));
}
