import type { Metadata } from 'next';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { DiagnosisSharedPage } from '@/components/diagnosis-shared-page';
import '../../../diagnose/diagnosis.css';
export const metadata: Metadata = {
  title: '共有診断の管理',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'ゲムなおのトラブル診断',
    description: '共有内容の管理',
    images: ['/og-default.png'],
  },
  twitter: {
    title: 'ゲムなおのトラブル診断',
    description: '共有内容の管理',
    images: ['/og-default.png'],
  },
};
export default async function ManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main>
      <WikiHeader />
      <article className="diag">
        <p className="diag-kicker">GEMNAO · MANAGE</p>
        <h1>共有診断を管理</h1>
        <DiagnosisSharedPage id={id} manage />
      </article>
      <WikiFooter />
    </main>
  );
}
