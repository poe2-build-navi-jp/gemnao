import type { Metadata } from 'next';
import { GameRequestAdmin } from '@/components/game-request-admin';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
export const metadata: Metadata = {
  title: 'ゲーム追加リクエスト管理',
  robots: { index: false, follow: false, noarchive: true },
};
export default function GameRequestAdminPage() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page admin-server-page">
        <p className="page-kicker">PRIVATE ADMIN</p>
        <h1>ゲーム追加リクエスト管理</h1>
        <GameRequestAdmin />
      </article>
      <WikiFooter />
    </main>
  );
}
