/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */
import { PathCopy } from './path-copy';
const examples = [
  {
    game: 'Cyberpunk 2077（Windows PC版）',
    path: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077`,
    keep: 'ゲーム本体だけの削除なら、この別保存先は削除範囲外',
    lose: 'Saved Games内のCyberpunk 2077も手動で消すとローカルセーブを失う。公式クリーンインストールにはこの工程が含まれる',
    href: '/games/cyberpunk-2077',
    source:
      'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/2233/how-do-i-perform-a-clean-install-of-the-game',
  },
  {
    game: 'Baldur’s Gate 3（Windows PC版）',
    path: String.raw`%LOCALAPPDATA%\Larian Studios\Baldur's Gate 3\PlayerProfiles\Public\Savegames\Story`,
    keep: 'ゲーム本体だけの削除なら、AppData側のStoryは削除範囲外',
    lose: 'AppData内のBaldur’s Gate 3を丸ごと消すと、配下のStoryにあるセーブも対象になる',
    href: '/games/baldurs-gate-3',
    source: 'https://larian.com/support/faqs/multiplayer-issues_84',
  },
  {
    game: 'Stardew Valley（Windows・Steam版）',
    path: String.raw`%APPDATA%\StardewValley\Saves`,
    keep: 'ゲーム本体だけの削除なら、AppData側のSavesは削除範囲外',
    lose: 'Savesやその親のStardewValleyを手動で消すと、キャラクター別セーブも対象になる',
    href: '/games/stardew-valley',
    source:
      'https://www.stardewvalley.net/missing-corrupt-save-file-troubleshooting-guide/',
  },
];
export function UninstallSaveBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="uninstall-decision">
        <h2>30秒で判断：どの削除をする予定ですか？</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">予定している操作</th>
              <th scope="col">セーブへの影響</th>
              <th scope="col">選ぶ行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="操作">
                ランチャーからゲーム本体だけをアンインストール
              </td>
              <td data-label="影響">
                別保存のセーブを削除しないなら残る。追加のユーザーデータ削除があれば別扱い
              </td>
              <td data-label="行動">保存先をコピーし、通常削除へ</td>
            </tr>
            <tr>
              <td data-label="操作">
                ゲームのインストールフォルダーを手動削除
              </td>
              <td data-label="影響">
                その中にセーブ・MOD設定・バックアップがあれば一緒に消える
              </td>
              <td data-label="行動">
                範囲を確認。容量を空けるだけなら通常削除を使う
              </td>
            </tr>
            <tr>
              <td data-label="操作">
                AppData・Saved Games・userdataなども掃除
              </td>
              <td data-label="影響">
                セーブ保存先を含む可能性が高い。ゲーム本体の削除とは別
              </td>
              <td data-label="行動">
                残存ファイルだから不要と決めず、対象を特定して退避
              </td>
            </tr>
            <tr>
              <td data-label="操作">
                Windows初期化・ドライブ初期化・ユーザー削除
              </td>
              <td data-label="影響">通常のゲーム削除より範囲が広い</td>
              <td data-label="行動">消す範囲の外、できれば外付け機器へ保全</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>
            確認するのは「ゲーム名」だけでなく「削除する範囲にセーブが入っているか」です。
          </strong>
          Windowsの「アンインストール」から実行する場合も、ゲーム側の確認画面に追加のデータ削除がないか読みます。
        </p>
      </section>
      <section className="diagnosis-table" id="uninstall-examples">
        <h2>ゲーム別：残る条件と、消してはいけない場所</h2>
        <p>
          下のパスをコピーしてエクスプローラーのアドレスバーへ貼り付けると、セーブ側を確認できます。通常のゲーム本体のインストール先とは別の場所です。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">ゲーム・セーブ保存先</th>
              <th scope="col">ゲーム本体だけの削除</th>
              <th scope="col">手動削除で注意する操作</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((e) => (
              <tr key={e.game}>
                <td data-label="ゲームと保存先">
                  <strong>{e.game}</strong>
                  <p>
                    <code>{e.path}</code>
                  </p>
                  <PathCopy value={e.path} />
                  <p>
                    <a href={e.href}>ゲーム別ガイド</a> ／{' '}
                    <a href={e.source} target="_blank" rel="noreferrer">
                      公式資料
                    </a>
                  </p>
                </td>
                <td data-label="本体だけ削除">{e.keep}</td>
                <td data-label="手動削除">{e.lose}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reset-small">
          公式に確認した保存先と削除範囲を照合した判断です。全ストア・全バージョンのアンインストーラーを実機検証した結果ではありません。保存先の移動や、ユーザーデータも消す追加操作がある場合は条件が変わります。
        </p>
        <h3>具体例：Cyberpunk 2077の「クリーンインストール」は別工程</h3>
        <p>
          CD PROJEKT
          REDの公式手順は、先にセーブを外部へコピーし、クラウド保存をオフにしてからゲームをアンインストールします。その後に、ゲームの残存フォルダーだけでなく
          <strong>Saved Games側のCyberpunk 2077も削除する</strong>
          工程があります。再インストール後は保管したセーブを戻す流れです。
        </p>
        <p>
          つまり、同じゲームでも「本体だけを外す」と「保存先まで含めて初期化する」では結果が違います。容量を空けたいだけの人が、クリーンインストールの全工程を行う必要はありません。
        </p>
      </section>
    </div>
  );
}
export function UninstallSaveAfterSteps() {
  return (
    <div className="reset-config-details">
      <section id="uninstall-normal">
        <h2>セーブを残して通常アンインストールする</h2>
        <p>
          上の3つの準備を終えてから、購入したランチャーで対象ゲームだけを削除します。
        </p>
        <h3>Steamの場合</h3>
        <p>
          ライブラリ→対象ゲームを右クリック→「管理」→「アンインストール」。確認画面で対象ゲームを確認して実行します。Steamクライアント自体の削除とは区別してください。
        </p>
        <h3>Epic Games Launcherの場合</h3>
        <p>
          「ライブラリ」→対象タイトル横の「…」→「アンインストール」。表示された確認に従います。
        </p>
        <p>
          独自アンインストーラーで「セーブ」「設定」「ユーザーデータ」も削除する選択肢が出た場合、残したいデータの削除は選びません。完了後にセーブ保存先を開き、対象ファイルが残っているか確認します。これはファイルの存在確認で、読み込み可能かは再インストール後に確認します。
        </p>
        <p className="reset-small">
          <a href="https://help.steampowered.com/en/faqs/view/4566-6D94-3A46-953A">
            Steamの操作案内
          </a>{' '}
          ／{' '}
          <a href="https://www.epicgames.com/help/c-32735058/c-36403860/a12795838?lang=en-US">
            Epicの操作案内
          </a>
        </p>
      </section>
      <section id="uninstall-after">
        <h2>再インストール後：残っているのに見えない場合もある</h2>
        <p>
          同じストア・アカウントで再インストールし、保存先を確認してから起動します。ロード一覧のキャラクター名・進行状況を照合し、期待したセーブが読めれば完了です。
        </p>
        <div className="diagnosis-table">
          <table className="reset-examples">
            <thead>
              <tr>
                <th scope="col">状態</th>
                <th scope="col">次の確認</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="状態">
                  ローカルファイルはあるが、ロード一覧にない
                </td>
                <td data-label="確認">
                  Windowsユーザー、ストア、ゲームのアカウント、保存先の階層を確認。すぐにファイルを消さない
                </td>
              </tr>
              <tr>
                <td data-label="状態">ローカルにないが、バックアップはある</td>
                <td data-label="確認">
                  <a href="/guide/save-data-backup#save-restore">
                    同期を止めて元の保存先へ戻す復元手順
                  </a>
                  へ。今あるデータも先に退避
                </td>
              </tr>
              <tr>
                <td data-label="状態">クラウド同期エラー・競合が出る</td>
                <td data-label="確認">
                  起動・新規保存を急がず、残したい日時と進行状況を確認。
                  <a href="/guide/steam-cloud-sync-error">
                    同期エラーの切り分け
                  </a>
                  へ
                </td>
              </tr>
              <tr>
                <td data-label="状態">ローカルもコピーも見つからない</td>
                <td data-label="確認">
                  ごみ箱、別Windowsユーザー、外付け機器、クラウド側に保存があるかを確認。バックアップなしでの復旧は保証できない
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          オンラインゲームの進行状況がサーバー側にある場合は、ログインしたアカウントとサーバーも確認します。別のストア・アカウントへの引き継ぎ可否は、通常の再インストールとは別の問題です。
        </p>
      </section>
      <section id="uninstall-record" className="reset-checklist">
        <h2>削除前に残す3行メモ</h2>
        <p>① 削除するもの：ゲーム本体のみ／保存先を含む追加削除</p>
        <p>② 残すセーブ：元のパス・ゲーム名・ストア・進行状況</p>
        <p>③ 退避先：削除範囲の外のパス・コピー照合の結果</p>
        <p>
          <strong>
            本体を消す場所と、セーブを残す場所を別々に書ければ、確認すべき範囲が明確になります。
          </strong>
          詳しいコピー・照合方法は
          <a href="/guide/save-data-backup">セーブのバックアップ記事</a>
          にまとめています。
        </p>
        <p className="reset-small">
          資料確認：2026年9月27日。共有する時はWindowsのユーザー名やアカウントIDを伏せてください。
        </p>
      </section>
    </div>
  );
}
