import type { Metadata } from 'next';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { SocialGuideAssets } from '@/components/social-guide-assets';
export const metadata: Metadata = {
  title: '症状別の共有画像・投稿文',
  description:
    'ST-3100001・ワイルズのクラッシュ・Steamの起動不良の確認画像と投稿文を、日本語・英語で保存できます。',
  alternates: { canonical: '/tools/share-guides' },
  robots: { index: false, follow: true },
};
export default function Page() {
  return (
    <main>
      <WikiHeader pagePath="/tools/share-guides" />
      <article className="static-page">
        <p className="page-kicker">GEMNAO QUICK CHECKS</p>
        <h1>症状別の共有画像・投稿文</h1>
        <p>
          日本語・English。確認の順番を紹介する編集図です。ゲームの実画面や、検証による成功例を示すものではありません。
        </p>
        <SocialGuideAssets />
      </article>
      <WikiFooter />
    </main>
  );
}
