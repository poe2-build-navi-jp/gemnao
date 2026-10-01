import type { Locale } from '@/lib/i18n';

// A troubleshooting article rewritten for one language. It covers the same
// official steps as the Japanese article with the same gameSlug/slug (and
// the same step ids, so the two versions stay comparable), but is written
// for readers of that language rather than translated sentence by sentence.
export type LocalizedArticle = {
  locale: Locale;
  gameSlug: string;
  slug: string;
  title: string;
  /** <meta name="description"> and the social preview text. */
  description: string;
  /** Short heading used in breadcrumbs and article lists. */
  shortTitle: string;
  /** Who the page is for, shown under the title. */
  lead: string;
  /** The answer in a few sentences, shown first. */
  summary: string;
  quickFacts: { label: string; value: string; copy?: boolean }[];
  diagnosis: { symptom: string; cause: string; stepId: string }[];
  steps: {
    id: string;
    title: string;
    summary: string;
    time: string;
    actions: string[];
    note?: string;
  }[];
  avoid: string[];
  cautions: string[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  checkedAt: string;
};
