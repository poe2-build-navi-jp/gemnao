import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'PCゲーマー向け便利ツール・早見表',
  description:
    '障害・メンテ情報、マイPCでの動作環境チェック、セーブデータの場所一覧、ショートカットキー早見表、リフレッシュレート確認ツールなど、ブックマークしておくと便利なページをまとめました。',
  alternates: { canonical: '/tools' },
};

const tools = [
  {
    href: '/tools/windows-diagnosis',
    title: 'PCゲーム診断（Windows用・試作版）',
    body: 'ゲーム本体と6つの症状を選んで、記録と次の確認を整理。共通診断とゲーム固有チェックを分けた試作版です。',
  },
  {
    href: '/status',
    title: '今日、落ちてる？（障害・メンテ情報）',
    body: 'Discordの稼働状況、ゲームの公式メンテナンス予定と公式のお知らせを1ページで確認。',
  },
  {
    href: '/my',
    title: 'マイPC・マイゲーム',
    body: 'GPU・メモリ・Windowsを登録すると、新作が動くかの目安が表示されます。ログイン不要。',
  },
  {
    href: '/tools/save-locations',
    title: 'セーブデータの場所一覧',
    body: '人気PCゲームのセーブ・設定ファイルの場所を、コピーして開けるパスで一覧に。',
  },
  {
    href: '/pc/gaming-shortcut-keys',
    title: 'ゲーム中に使うショートカットキー早見表',
    body: '画面が固まった・応答しない・HDRがおかしい時のキーを図解で。',
  },
  {
    href: '/tools/refresh-rate',
    title: 'リフレッシュレート（Hz）確認ツール',
    body: '144Hzのはずが60Hzになっていないか、ブラウザで測れます。',
  },
  {
    href: '/new-releases/2026-10',
    title: '新作PCゲームの動作環境まとめ',
    body: '今月の新作の必須条件を1つの表に。マイPCを登録すると○×で表示。',
  },
];

export default function Tools() {
  return (
    <main>
      <WikiHeader pagePath="/tools" />
      <article className="static-page">
        <p className="page-kicker">TOOLS</p>
        <h1>PCゲーマー向け便利ツール・早見表</h1>
        <p className="page-lead">
          困った時にすぐ開けるよう、ブックマークしておくと便利なページです。
        </p>
        <div className="related-section">
          <div>
            {tools.map((tool) => (
              <a href={tool.href} key={tool.href}>
                <span>{tool.title}</span>
                {tool.body}
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </div>
      </article>
      <WikiFooter />
    </main>
  );
}
