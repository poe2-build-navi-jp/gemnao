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

// Match the topic used by each article UI; reject cross-topic votes.
export function articleFeedbackTopic(context: string): string | undefined {
  if (!articleSteps(context)) return undefined;
  const game = gameArticles.find(
    (a) => `game-${a.gameSlug}-${a.slug}` === context,
  );
  if (game)
    return game.category === 'settings'
      ? 'display'
      : game.category === 'server'
        ? 'launch'
        : game.category;
  const discord = discordArticles.find((a) => `discord-${a.slug}` === context);
  if (discord)
    return `discord-${['game', 'bot'].includes(discord.category) ? 'launch' : discord.category}`;
  const guide = commonGuides.find((a) => `guide-${a.slug}` === context);
  if (!guide) return undefined;
  const slug = guide.slug;
  return /save|uninstall/.test(slug)
    ? 'save'
    : /controller/.test(slug)
      ? 'controller'
      : /mod|reshade/.test(slug)
        ? 'mods'
        : /fps|vram|stutter|shader/.test(slug)
          ? 'display'
          : 'launch';
}
