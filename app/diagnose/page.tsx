/* oxlint-disable next/no-html-link-for-pages -- Full document navigation isolates diagnostic pages from third-party scripts. */
import type { Metadata } from 'next';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { DiagnosisStorageNotice } from '@/components/diagnosis-storage-notice';
import { DiagnosisWizard } from '@/components/diagnosis-wizard';
import { games } from '@/lib/games';
import './diagnosis.css';
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'PCゲーム無料トラブル診断 β',
  description:
    'PCゲームが起動しない、クラッシュ、黒い画面、フリーズ、低FPS、カクつきを回答から切り分け。確認する順番と安全な手順を整理します。登録・インストール不要。',
  alternates: { canonical: '/diagnose' },
  openGraph: {
    title: 'PCゲーム無料トラブル診断 | ゲムなお',
    description: '症状を選んで、次に確認する場所を整理します。',
    url: '/diagnose',
  },
  twitter: {
    title: 'PCゲーム無料トラブル診断 | ゲムなお',
    description: '回答から確認する順番を整理します。',
  },
};
export default function DiagnosePage() {
  if (process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED !== 'true' && process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA !== 'true') return <main><p>診断は現在準備中です。既存の記事をご利用ください。</p><a href="/">ホームへ</a></main>;
  return (
    <main>
      <WikiHeader pagePath="/diagnose" />
      <article className="diag">
        <nav aria-label="パンくず" className="diag-breadcrumb">
          <a href="/">ホーム</a>
          <span> / PCゲーム無料診断</span>
        </nav>
        <header className="diag-intro">
          <p className="diag-kicker">GEMNAO TROUBLESHOOTING · β</p>
          <h1>
            PCゲームの不具合を
            <br />
            <span>無料で診断</span>
          </h1>
          <p>
            起動しない、落ちる、画面が真っ黒、重い…。
            <br />
            症状を選んで、次に確認する場所を絞り込みます。
          </p>
          <p className="diag-notice">
            この診断は回答内容をもとに、確認する順番を整理するものです。PC内部の自動検査や、故障原因の確定は行いません。
          </p>
        </header>
        <DiagnosisWizard gameNames={games.map((g) => g.title)} />
        <section className="diag-about">
          <h2>この診断で分かること</h2>
          <p>
            ゲームが起動しない・クラッシュ・黒い画面・フリーズ・FPSが低い・カクつく、の6症状に対応します。回答によって質問を変え、最初に確認する項目を最大3つに整理します。結果から具体的な手順の記事を開き、実施後の変化を記録できます。
          </p>
          <h3>PCの情報が分からなくても使えますか？</h3>
          <p>
            技術的な質問には「分からない」と確認方法を用意しています。スマートフォンから、不具合が起きているPCについて回答できます。
          </p>
          <h3>安全に使うために</h3>
          <p>
            インストールやPC内の自動取得は行いません。原因の確率や改善率を表示せず、推奨理由と注意事項を案内します。電源断やPC全体の停止は、通常のゲーム診断から安全確認へ切り替えます。
          </p>
          <h3>β版の対象外の症状</h3>
          <p>
            GPU使用率、VRAM、音、Steam
            Cloud、コントローラーなどの専用診断は準備中です。
            <a href="/guide">既存の症状別ガイド</a>をご覧ください。
          </p>
          <h3>記録と共有について</h3>
          <p>
            <DiagnosisStorageNotice />
            <a href="/diagnose/privacy">詳しい保存・削除の説明</a>
          </p>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebApplication',
                  name: 'ゲムなお PCゲーム無料トラブル診断',
                  url: 'https://gemnao.pages.dev/diagnose',
                  applicationCategory: 'UtilitiesApplication',
                  operatingSystem: 'Web browser',
                  isAccessibleForFree: true,
                  description:
                    '回答をもとにPCゲームの確認順を整理するWeb診断。PC内部の自動検査や原因確定は行いません。',
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'ホーム',
                      item: 'https://gemnao.pages.dev/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'PCゲーム無料診断',
                      item: 'https://gemnao.pages.dev/diagnose',
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </article>
      <WikiFooter />
    </main>
  );
}
