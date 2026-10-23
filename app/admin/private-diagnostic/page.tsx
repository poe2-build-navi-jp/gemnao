import type { Metadata } from 'next';
import { PrivateDiagnosticAdmin } from '@/components/private-diagnostic-admin';
export const metadata: Metadata = {
  title: '非公開診断の運営者確認',
  robots: { index: false, follow: false, noarchive: true },
};
/* oxlint-disable next/no-html-link-for-pages -- Full document navigation to authenticated admin. */
export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-5 py-10">
      <h1>非公開診断の運営者確認</h1>
      <p>
        公開コミュニティの審査画面とは別です。本文・一覧は認証済みAPIからのみ読み込みます。運営者限定の既存管理キーを確認するまで閲覧は有効にしません。
      </p>
      <a href="/admin/discord-servers">既存の管理ログイン</a>
      <PrivateDiagnosticAdmin />
    </main>
  );
}
