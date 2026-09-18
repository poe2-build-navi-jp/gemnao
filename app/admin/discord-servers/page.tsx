import type { Metadata } from 'next';
import { DiscordServerAdmin } from '@/components/discord-server-admin';

export const metadata: Metadata = {
  title: 'Discordサーバー掲載審査',
  robots: { index: false, follow: false, noarchive: true },
};

export default function DiscordServerAdminPage() {
  return (
    <main className="static-page admin-server-page">
      <p className="page-kicker">PRIVATE ADMIN</p>
      <h1>Discordサーバー掲載審査</h1>
      <p className="page-lead">申請内容と招待リンクを確認し、問題がない募集だけを承認してください。</p>
      <DiscordServerAdmin />
    </main>
  );
}
