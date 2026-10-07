import type { Metadata } from 'next';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { DiagnosisSharedPage } from '@/components/diagnosis-shared-page';
import '../../diagnose/diagnosis.css';
export const metadata: Metadata = {
  title: 'ゲムなおのトラブル診断結果',
  description: 'PCゲームの確認する順番を整理した共有ページです。',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'ゲムなおのトラブル診断結果',
    description: 'PCゲームのトラブル診断結果です。',
    images: ['/og-default.png'],
  },
  twitter: {
    title: 'ゲムなおのトラブル診断結果',
    description: 'PCゲームのトラブル診断結果です。',
    images: ['/og-default.png'],
  },
};
export default async function SharedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main>
      <WikiHeader />
      <article className="diag">
        <p className="diag-kicker">GEMNAO · SHARED RESULT</p>
        <h1>トラブル診断結果</h1>
        <DiagnosisSharedPage id={id} />
      </article>
      <WikiFooter />
    </main>
  );
}
