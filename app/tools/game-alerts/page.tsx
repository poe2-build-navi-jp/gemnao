import type { Metadata } from 'next';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { GameAlertSubscription } from '@/components/game-alert-subscription';
import { steamAppIds } from '@/lib/status/sources';
import { gameBySlug } from '@/lib/games';
export const metadata: Metadata = {
  title: 'マイゲームの更新通知・RSS購読｜ゲムなお',
  description:
    '遊んでいるゲームのSteam公式ニュースを選んで購読。RSSアプリと、ページを開いている間のブラウザー通知に対応。',
  alternates: { canonical: '/tools/game-alerts' },
  robots: { index: false, follow: true },
};
export default function Page() {
  const choices = Object.keys(steamAppIds).flatMap((slug) => {
    const g = gameBySlug(slug);
    return g ? [{ slug, title: g.shortTitle }] : [];
  });
  return (
    <main>
      <WikiHeader pagePath="/tools/game-alerts" />
      <article className="static-page">
        <p className="page-kicker">GAME UPDATES</p>
        <h1>マイゲームの更新通知</h1>
        <GameAlertSubscription choices={choices} />
      </article>
      <WikiFooter />
    </main>
  );
}
