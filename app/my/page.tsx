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
  title: 'マイPC・マイゲーム',
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
        <h1>マイPC・マイゲーム</h1>
        <p className="page-lead">
          自分のPCと遊んでいるゲームを登録しておくと、次に来た時にここから最新の情報を確認できます。ログインは不要で、登録内容はこのブラウザにだけ保存されます。
        </p>
        <MyDashboard games={data} />
      </article>
      <WikiFooter />
    </main>
  );
}
