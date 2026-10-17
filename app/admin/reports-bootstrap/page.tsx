/* oxlint-disable next/no-html-link-for-pages -- The admin login is a separate full page; keep a native link. */
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { env } from 'cloudflare:workers';
import { isDiscordAdmin } from '@/lib/admin-auth';
import { ReportsBootstrapAdmin } from '@/components/reports-bootstrap-admin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: '報告機能の初期設定',
  robots: { index: false, follow: false, noarchive: true },
};

export default async function ReportsBootstrapPage() {
  const request = new Request(
    'https://gemnao.pages.dev/admin/reports-bootstrap',
    {
      headers: await headers(),
    },
  );
  const authenticated = await isDiscordAdmin(request);
  const flags = env as unknown as Record<string, unknown>;
  const otherFlags = [
    'REPORTS_ENABLED',
    'REPORTS_PUBLIC_ENABLED',
    'REPORTS_REVIEW_ENABLED',
    'REPORTS_BUDGET_VERIFIED',
    'REPORTS_AUTO_OBSERVATION_ENABLED',
    'REPORTS_USAGE_PROFILE_VERIFIED',
    'REPORTS_PUBLIC_MONITOR_VERIFIED',
    'REPORTS_VERIFICATION_ALLOWED',
  ];
  const allowed =
    flags.REPORTS_BOOTSTRAP_ALLOWED === 'true' &&
    !flags.REPORTS_GUARD_INSTANCE &&
    otherFlags.every((key) => flags[key] === 'false');
  return (
    <main className="static-page">
      <h1>報告機能の初期設定</h1>
      {authenticated ? (
        <ReportsBootstrapAdmin allowed={allowed} />
      ) : (
        <>
          <p>
            既存の管理者ログインが必要です。認証情報はこの画面では入力しません。
          </p>
          <a href="/admin/contacts">お問い合わせ管理でログイン</a>
          <p>ログイン後、この画面へ戻ってください。</p>
        </>
      )}
    </main>
  );
}
