import type { ArticleCategory, GameArticle } from '@/lib/game-articles';
import type { Locale } from '@/lib/i18n';
import type { LocalizedArticle } from '@/lib/localized/types';

export type FollowupLanguage = 'ja' | Locale;
export type FollowupCopy = Pick<
  LocalizedArticle,
  | 'title'
  | 'shortTitle'
  | 'description'
  | 'lead'
  | 'summary'
  | 'quickFacts'
  | 'diagnosis'
  | 'steps'
  | 'avoid'
  | 'cautions'
  | 'faqs'
  | 'related'
>;
export type FollowupGuide = {
  gameSlug: string;
  gameName: string;
  slug: string;
  category: ArticleCategory;
  checkedAt: string;
  sources: { url: string; labels: Record<FollowupLanguage, string> }[];
  copy: Record<FollowupLanguage, FollowupCopy>;
  relatedSlugs: string[];
};

export function japaneseFollowup(guide: FollowupGuide): GameArticle {
  const copy = guide.copy.ja;
  return {
    gameSlug: guide.gameSlug,
    slug: guide.slug,
    category: guide.category,
    status: 'verified',
    checkedAt: guide.checkedAt,
    title: copy.title,
    seoTitle: copy.title,
    shortTitle: copy.shortTitle,
    symptom: copy.lead,
    conclusion: copy.summary,
    description: copy.description,
    metaDescription: copy.description,
    symptoms: copy.steps.map((step) => ({
      label: step.title,
      target: step.id,
    })),
    quickFacts: copy.quickFacts,
    diagnosis: copy.diagnosis,
    steps: copy.steps.map((step) => ({
      ...step,
      guideLink: step.guideLink
        ? { ...step.guideLink, description: step.guideLink.description || '' }
        : undefined,
    })),
    avoid: copy.avoid,
    cautions: copy.cautions,
    faqs: copy.faqs,
    sources: guide.sources.map((source) => ({
      url: source.url,
      label: source.labels.ja,
    })),
    related: guide.relatedSlugs,
  };
}

export function translatedFollowups(guide: FollowupGuide): LocalizedArticle[] {
  return (['en', 'zh', 'es'] as const).map((locale) => ({
    ...guide.copy[locale],
    locale,
    gameSlug: guide.gameSlug,
    gameName: guide.gameName,
    slug: guide.slug,
    checkedAt: guide.checkedAt,
    sources: guide.sources.map((source) => ({
      url: source.url,
      label: source.labels[locale],
    })),
  }));
}
