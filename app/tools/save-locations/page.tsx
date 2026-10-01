import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { PathCopy } from '@/components/path-copy';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { games } from '@/lib/games';

export const metadata: Metadata = {
  title: 'PCゲームのセーブデータの場所一覧｜パスをコピーして開く',
  description:
    'モンハンワイルズ、エルデンリング、パルワールド、サイバーパンク2077、BG3、スカイリムなど人気PCゲームのセーブデータと設定ファイルの場所を一覧にまとめました。パスをコピーしてWindows＋Rに貼り付けるだけで開けます。',
  alternates: { canonical: '/tools/save-locations' },
};

// Only games whose save path is recorded in lib/games.ts (with sources).
const listed = games.filter((game) => game.savePath && !game.focused);

export default function SaveLocations() {
  return (
    <main>
      <WikiHeader pagePath="/tools/save-locations" />
      <article className="static-page">
        <p className="page-kicker">TOOLS</p>
        <h1>PCゲームのセーブデータの場所一覧</h1>
        <p className="page-lead">
          パスの横の「コピー」を押し、Windows＋Rで開く「ファイル名を指定して実行」に貼り付けてEnterを押すと、そのフォルダが開きます。バックアップは、ゲームとランチャーを終了してからフォルダごと別の場所へコピーしてください。
        </p>
        <div className="save-location-list">
          {listed.map((game) => (
            <section key={game.slug} id={game.slug}>
              <h2>
                <a href={`/games/${game.slug}`}>{game.shortTitle}</a>
              </h2>
              <h3>セーブデータ</h3>
              <div className="path-box">
                <code>{game.savePath}</code>
                <PathCopy value={game.savePath} />
              </div>
              <h3>設定ファイル</h3>
              <div className="path-box">
                <code>{game.configPath}</code>
                <PathCopy value={game.configPath} />
              </div>
            </section>
          ))}
        </div>
        <section className="caution-block">
          <h2>使う時の注意</h2>
          <ul>
            <li>
              「&lt;Steam
              ID&gt;」「&lt;ID&gt;」「&lt;インストール先&gt;」の部分は、自分の環境のフォルダ名に置き換えてください。そのまま貼り付けても開けません。
            </li>
            <li>
              Steamクラウドが有効なゲームでは、古いデータで上書きされることがあります。復元の前に各ゲームの記事で手順を確認してください。
            </li>
            <li>
              保存場所はアップデートで変わることがあります。見つからない時は、各ゲームのページの出典を確認してください。
            </li>
          </ul>
          <p>
            <a href="/guide/save-data-backup">
              セーブデータのバックアップ方法（共通ガイド）
            </a>
          </p>
        </section>
      </article>
      <WikiFooter />
    </main>
  );
}
