import type { Metadata } from 'next';
import { MyDashboard, type DashboardGame } from '@/components/my-dashboard';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { articlesForGame } from '@/lib/game-articles';
import { games } from '@/lib/games';
import { releaseRoundups } from '@/lib/release-roundups';
import { maintenanceSchedule, steamAppIds } from '@/lib/status/sources';

// Personal page: everything is stored in the reader's browser, so there is
// nothing for search engines to index.
export const metadata: Metadata = {
  title: 'マイページ｜遊ぶゲーム・診断結果・解決した設定を保存',
  description:
    '自分のPCのGPU・メモリ・Windowsと、遊んでいるゲームを登録すると、動作環境の目安と公式のお知らせ・メンテナンス・解決記事をまとめて確認できます。',
  alternates: { canonical: '/my' },
  robots: { index: false, follow: true },
};

function specFor(slug: string) {
  for (const roundup of releaseRoundups)
    for (const game of roundup.games)
      if (game.spec && game.article?.href.startsWith(`/games/${slug}/`))
        return game.spec;
  return undefined;
}

function dashboardGames(now: number): DashboardGame[] {
  return games.map((game) => ({
    slug: game.slug,
    name: game.shortTitle,
    articles: articlesForGame(game.slug)
      .filter(
        (article) => !['draft', 'thin'].includes(article.status || 'verified'),
      )
      .slice(0, 4)
      .map((article) => ({
        href: `/games/${game.slug}/${article.slug}`,
        label: article.shortTitle,
      })),
    maintenance: maintenanceSchedule
      .filter(
        (item) => item.gameSlug === game.slug && Date.parse(item.end) > now,
      )
      .map((item) => ({
        title: item.title,
        start: item.start,
        end: item.end,
        url: item.source.url,
      })),
    spec: specFor(game.slug),
    hasNews: Boolean(steamAppIds[game.slug]),
  }));
}

export default function MyPage() {
  const data = dashboardGames(new Date().getTime());
  return (
    <main>
      <WikiHeader pagePath="/my" />
      <article className="static-page">
        <p className="page-kicker">MY PAGE</p>
        <h1>保存した記事と、遊ぶゲームのマイページ</h1>
        <p className="page-lead">
          あとで読む記事、最近見た手順、遊ぶゲームの最新情報をここに。診断結果・解決した設定も見返せます。ログイン不要で、登録内容はこのブラウザにだけ保存されます。
        </p>
        <nav className="my-page-links" aria-label="マイページの内容">
          <a href="#my-reading-list">あとで読む</a>
          <a href="#my-feed">ゲームの最新情報</a>
          <a href="#my-games">ゲームの登録</a>
          <a href="#my-solutions">診断結果・解決ノート</a>
          <a href="#my-pc">PCの登録</a>
        </nav>
        <MyDashboard games={data} />
      </article>
      <WikiFooter />
    </main>
  );
}
