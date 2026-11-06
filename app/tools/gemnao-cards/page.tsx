import type { Metadata } from 'next';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { GemnaoCardStudio } from '@/components/gemnao-card-studio';
import { commonGuides } from '@/lib/common-guides';
import { gameArticles } from '@/lib/game-articles';
export const metadata: Metadata = {
  title: 'ゲムなおカード｜ゲームの解決記録を集めて共有',
  description:
    '症状・試した対処・結果を、箔調デザインのゲムなおカードに。PNG保存と端末内コレクションに対応。',
  alternates: { canonical: '/tools/gemnao-cards' },
  robots: { index: false, follow: true },
};
export default function Page() {
  const articles = [
    ...commonGuides
      .filter((a) => a.status === 'verified')
      .map((a) => ({ path: `/guide/${a.slug}`, title: a.shortTitle })),
    ...gameArticles
      .filter((a) => !['draft', 'thin'].includes(a.status || 'verified'))
      .map((a) => ({ path: `/games/${a.gameSlug}/${a.slug}`, title: a.title })),
  ];
  return (
    <main>
      <WikiHeader pagePath="/tools/gemnao-cards" />
      <article className="static-page">
        <p className="page-kicker">GEMNAO CARDS / SERIES 01</p>
        <h1>ゲムなおカード</h1>
        <p className="page-lead">
          その「試したこと」が、次の誰かの手がかりになる。
        </p>
        <GemnaoCardStudio articles={articles} />
      </article>
      <WikiFooter />
    </main>
  );
}
