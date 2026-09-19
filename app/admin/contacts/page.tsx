import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ContactAdmin } from '@/components/contact-admin';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'お問い合わせ管理',
  robots: { index: false, follow: false, noarchive: true },
};

export default function ContactAdminPage() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page admin-server-page">
        <p className="page-kicker">PRIVATE ADMIN</p>
        <h1>お問い合わせ管理</h1>
        <p className="page-lead">
          記事の訂正依頼、権利関係、プライバシー、その他の連絡を確認できます。
        </p>
        <p className="admin-back-link">
          <a href="/admin/discord-servers">Discordサーバー掲載審査</a>
          <a href="/contact">お問い合わせフォームを確認</a>
        </p>
        <ContactAdmin />
      </article>
      <WikiFooter />
    </main>
  );
}
