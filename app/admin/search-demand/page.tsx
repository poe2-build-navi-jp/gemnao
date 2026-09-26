import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { SearchDemandAdmin } from '@/components/search-demand-admin';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: '記事がない検索の集計',
  robots: { index: false, follow: false, noarchive: true },
};

export default function SearchDemandPage() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page admin-server-page">
        <p className="page-kicker">PRIVATE ADMIN</p>
        <h1>記事がない検索</h1>
        <p>
          過去30日間に検索結果が0件だった語句を、匿名の件数で確認します。記事の自動公開はしません。
        </p>
        <p>
          <a href="/admin/discord-servers">管理画面でログインする</a>
        </p>
        <SearchDemandAdmin />
      </article>
      <WikiFooter />
    </main>
  );
}
