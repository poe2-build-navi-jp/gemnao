import {
  discordArticles as baseDiscordArticles,
  discordCategoryLabels,
  type DiscordArticle,
  type DiscordCategory,
  type DiscordCause,
} from '@/lib/discord-articles';
import { discordExtraArticles } from '@/lib/discord-articles-extra';
import { discordExtraUiArticles } from '@/lib/discord-articles-extra-ui';

export type { DiscordArticle, DiscordCategory, DiscordCause };
export { discordCategoryLabels };

export const discordArticles: DiscordArticle[] = [
  ...baseDiscordArticles,
  ...discordExtraArticles,
  ...discordExtraUiArticles,
];

export const discordArticleBySlug = (slug: string) =>
  discordArticles.find((item) => item.slug === slug);
