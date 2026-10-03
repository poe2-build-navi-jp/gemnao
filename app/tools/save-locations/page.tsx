import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { PathCopy } from '@/components/path-copy';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { games } from '@/lib/games';
import { saveGuideByGame } from '@/lib/tool-guide-links';

export const metadata: Metadata = {
  title: 'PCゲームのセーブデータの場所一覧｜パスをコピーして開く',
  description:
    'モンハンワイルズ、エルデンリング、パルワールド、サイバーパンク2077、BG3、スカイリムなど人気PCゲームのセーブデータと設定ファイルの場所を一覧にまとめました。パスのコピー、環境ごとの置き換え方、ゲーム別のバックアップ・復元手順を案内。',
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
          保存場所をコピーし、自分の環境に合わせて下の手順で開いてください。復元や上書きの前には、ゲーム別の記事で対象の版・コピーする範囲・クラウド同期の注意を確認します。
        </p>
        <section className="caution-block" aria-labelledby="open-path-title">
          <h2 id="open-path-title">コピーしたパスの開き方</h2>
          <ol>
            <li>
              「&lt;Steam&gt;」はSteamのインストール先、「&lt;Steam
              ID&gt;」「&lt;ID&gt;」などは自分のフォルダ名に置き換えます。山かっこが残ったままでは開けません。
            </li>
            <li>
              パスがファイル名（例：ER0000.sl2、GraphicsConfig.xml）で終わる場合は、末尾のファイル名を除いてフォルダのパスにします。ファイル自体を実行する手順ではありません。
            </li>
            <li>
              フォルダのパスをWindows＋Rの「ファイル名を指定して実行」に貼り付けます。%APPDATA%などの環境変数はそのままで使えます。
            </li>
            <li>
              バックアップはゲームとランチャーを終了してから別の場所へコピーします。復元する前にも現在のデータを退避してください。
            </li>
          </ol>
        </section>
        <p className="source-policy">
          保存先を用意する前に、
          <a href="/gear/save-backup-storage-guide">
            バックアップ先の選び方・必要容量
          </a>
          も確認できます。手持ちのUSBメモリーや外付けドライブで足りる場合、新規購入は不要です。
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
              {saveGuideByGame[game.slug] ? (
                <p>
                  <a
                    href={`/games/${game.slug}/${saveGuideByGame[game.slug].slug}`}
                  >
                    {saveGuideByGame[game.slug].label}
                  </a>
                </p>
              ) : null}
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
