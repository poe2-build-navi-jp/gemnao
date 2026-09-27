/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */
import { PathCopy } from './path-copy';
const examples = [
  {
    game: 'Cyberpunk 2077（Windows PC版）',
    folder: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077`,
    target:
      'Cyberpunk 2077フォルダー全体。中の各セーブ用フォルダー・付随ファイルも含める',
    parent: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red`,
    href: '/games/cyberpunk-2077',
    source:
      'https://support.cdprojektred.com/ja/cyberpunk/pc/sp-technical/issue/1706/sebudetanobao-cun-chang-suo-wojiao-etekudasai',
  },
  {
    game: 'Baldur’s Gate 3（Windows PC版）',
    folder: String.raw`%LOCALAPPDATA%\Larian Studios\Baldur's Gate 3\PlayerProfiles\Public\Savegames\Story`,
    target:
      '全セーブならStory全体。1つだけならStory内の該当セーブ用フォルダーを丸ごと',
    parent: String.raw`%LOCALAPPDATA%\Larian Studios\Baldur's Gate 3\PlayerProfiles\Public\Savegames`,
    href: '/games/baldurs-gate-3',
    source: 'https://larian.com/support/faqs/multiplayer-issues_84',
  },
  {
    game: 'Stardew Valley（Windows・Steam版）',
    folder: String.raw`%APPDATA%\StardewValley\Saves`,
    target:
      '全キャラクターならSaves全体。各「名前_数字」フォルダーには同名のセーブ本体とSaveGameInfoの両方を含める。_oldがあれば一緒に残す',
    parent: String.raw`%APPDATA%\StardewValley`,
    href: '/games/stardew-valley',
    source:
      'https://www.stardewvalley.net/missing-corrupt-save-file-troubleshooting-guide/',
  },
];
export function SaveBackupBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="save-locations">
        <h2>ゲーム別の保存先・コピー対象3例</h2>
        <p>
          「コピー」を押し、エクスプローラー上部のアドレスバーへ貼り付けてEnter。開いたら1つ上へ移動し、対象フォルダーを丸ごとコピーします。AppDataが隠れていても、この入力方法で開けます。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">ゲーム</th>
              <th scope="col">開く保存先</th>
              <th scope="col">コピーするもの</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((e) => (
              <tr key={e.game}>
                <td data-label="ゲーム">
                  <strong>{e.game}</strong>
                  <p>
                    <a href={e.href}>ゲーム別ガイド</a>
                  </p>
                </td>
                <td data-label="保存先">
                  <code>{e.folder}</code>
                  <PathCopy value={e.folder} />
                </td>
                <td data-label="コピー対象">
                  <p>{e.target}</p>
                  <a href={e.source} target="_blank" rel="noreferrer">
                    保存先の公式資料
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reset-small">
          保存先は公式資料、フォルダー全体を残す方法はコピー漏れを減らすための本記事の整理です。Xboxアプリ版・Steam
          Deck・家庭用機に、そのまま当てはめないでください。
        </p>
        <details>
          <summary>フォルダーがない・候補が複数ある時</summary>
          <p>
            前回遊んだWindowsユーザーと購入ストアを確認します。別ユーザーなら%APPDATA%などの参照先も変わります。更新日時は手がかりですが、それだけで正しいセーブと断定しません。候補が複数なら分けて保全し、ゲーム内のキャラクター名・進行状況と照合します。
          </p>
          <p>
            サーバー管理のオンラインゲームでは、進行状況をPCのフォルダーコピーで復元できない場合があります。ローカル保存の対応があるゲーム向けの手順です。
          </p>
        </details>
      </section>
    </div>
  );
}
export function SaveBackupAfterSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="save-verify">
        <h2>「バックアップを検証する」とは？ 3段階で確認</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">確認</th>
              <th scope="col">具体的な操作</th>
              <th scope="col">分かること・限界</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="確認">1. コピー漏れ</td>
              <td data-label="操作">
                元と先のフォルダーのプロパティで、ファイル数・フォルダー数・サイズ（バイト）を比較。中の主要ファイルも開いて探す
              </td>
              <td data-label="判断">
                不足や明らかな容量違いを発見できる。同じ数・容量でも中身が違う場合はある
              </td>
            </tr>
            <tr>
              <td data-label="確認">2. 内容の一致</td>
              <td data-label="操作">
                対応するファイルのSHA-256を比較。フォルダー全体なら全ファイルが対象
              </td>
              <td data-label="判断">
                コピー元と先の内容を照合できる。元のセーブ自体の正常性は分からない
              </td>
            </tr>
            <tr>
              <td data-label="確認">3. ゲームで読めるか</td>
              <td data-label="操作">
                下の復元手順でコピーを戻し、ロード画面と実際の進行状況を確認
              </td>
              <td data-label="判断">
                確認したゲーム版・環境での読み込みが分かる。将来の版での互換性まで保証しない
              </td>
            </tr>
          </tbody>
        </table>
        <h3>追加確認：PowerShellで1ファイルの内容を比べる</h3>
        <p>
          スタートで「PowerShell」を検索して開きます。次の2つのパスを実在する
          <strong>ファイル</strong>
          のフルパスへ置き換え、1行ずつ実行してください。フォルダーのパスは指定できません。ファイルを読むだけで、削除・上書きはしません。
        </p>
        <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          <code>{String.raw`Get-FileHash -LiteralPath "C:\コピー元\セーブファイル" -Algorithm SHA256 | Format-List Hash,Path
Get-FileHash -LiteralPath "E:\バックアップ\セーブファイル" -Algorithm SHA256 | Format-List Hash,Path`}</code>
        </pre>
        <p>
          両方の<strong>Hashの文字列が完全一致</strong>
          なら、その2ファイルの内容は一致しています。エラーが出た、片方しか表示されない、値が違う場合は未確認です。コピー後にゲームを起動して元データが更新された場合も一致しなくなります。
        </p>
        <p className="reset-small">
          これは1ファイルずつの追加確認です。主要ファイル1個だけの一致を「フォルダー全体の検証済み」とは扱いません。
          <a href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash?view=powershell-5.1">
            Microsoft：Get-FileHash
          </a>
        </p>
      </section>
      <section id="save-restore">
        <h2>バックアップから復元する手順</h2>
        <p>
          正常に遊べている人が、毎回セーブを入れ替える必要はありません。復元が必要な時、または読み込みテストをする時に実行します。バックアップ原本は保管し、
          <strong>コピーしたものを戻す</strong>のが基本です。
        </p>
        <h3>1. 現在の状態と同期設定を保全する</h3>
        <p>
          ゲームを終了し、今の保存先も「復元前_日付時刻」へコピーします。Steam版でCloud対応の場合、ライブラリで対象ゲームを右クリック→「プロパティ」→「一般」からSteam
          Cloudを一時的にオフにし、Steamを終了。ゲーム独自のクロスセーブも使っていれば、その同期設定も確認します。
        </p>
        <h3>2. 現在の対象フォルダーを退避して、元の名前で戻す</h3>
        <p>
          今ある対象フォルダーをゲームが参照しない別の場所へ退避します。バックアップの外側に付けた日付フォルダーではなく、その中の
          <strong>元の名前のフォルダー</strong>
          を下表の場所へコピーします。古いファイルと混ぜず、階層を1段増やさないよう確認してください。
        </p>
        <div className="diagnosis-table">
          <table className="reset-examples">
            <thead>
              <tr>
                <th scope="col">戻す対象（全体を保存した場合）</th>
                <th scope="col">貼り付け先の親フォルダー</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((e, i) => (
                <tr key={e.game}>
                  <td data-label="戻す対象">
                    {['Cyberpunk 2077', 'Story', 'Saves'][i]}
                  </td>
                  <td data-label="貼り付け先">
                    <code>{e.parent}</code>
                    <PathCopy value={e.parent} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          例：Stardew Valleyでは、戻した後に{' '}
          <code>{String.raw`StardewValley\Saves\名前_数字\SaveGameInfo`}</code>{' '}
          となれば正しい階層です。
          <code>{String.raw`Saves\Saves\名前_数字`}</code>{' '}
          にはしません。1キャラクターだけ保存した場合は、その「名前_数字」フォルダーをSavesの中へ戻します。
        </p>
        <h3>3. ロードと進行状況を確認する</h3>
        <p>
          同じアカウント・対応するゲーム版で起動し、ロード一覧のキャラクター名・日時・プレイ時間を照合します。さらに実際にロードして、場所・クエスト・所持品などが記録した状態か確認。自動保存が動く場合があるため、テストにはバックアップのコピーを使います。
        </p>
        <p>
          失敗したらゲームとランチャーを終了し、今回戻したフォルダーを別へ退避して「復元前」のデータを元の場所へ戻せます。MODを使っていたセーブは必要なMOD・版がそろっているかも調べます。
        </p>
        <h3>4. 確認後に同期を戻す</h3>
        <p>
          期待した状態で読み込めたら正常に保存・終了し、そのローカルデータをもう一度別にコピーしてから同期を戻します。競合が表示された場合は、残したい進行状況と日時を照合して選択。「クラウドだから正しい」「新しい日時だから正しい」とは決めません。判断できなければ選択を止め、
          <a href="/guide/steam-cloud-sync-error">同期エラーの確認手順</a>
          へ進んでください。
        </p>
      </section>
      <section className="diagnosis-table" id="save-trouble">
        <h2>コピー・復元でつまずいた時の確認表</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">症状</th>
              <th scope="col">確認すること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="症状">使用中・コピー失敗が出る</td>
              <td data-label="確認">
                ゲームとランチャーの終了、コピー先の空き容量、USBの接続を確認。未完了のコピーは成功扱いにしない
              </td>
            </tr>
            <tr>
              <td data-label="症状">コピー先のサイズ・数が違う</td>
              <td data-label="確認">
                同じ階層を比較しているか、途中で保存が走っていないか。新しい空のバックアップ先へ再コピーして比較
              </td>
            </tr>
            <tr>
              <td data-label="症状">復元してもロード一覧に出ない</td>
              <td data-label="確認">
                フォルダーの二重化、ストア・アカウントの違い、付随ファイルの不足を確認。Stardew
                ValleyはSaveGameInfoも確認
              </td>
            </tr>
            <tr>
              <td data-label="症状">ロード一覧にはあるが読めない</td>
              <td data-label="確認">
                ゲーム版・必要なDLC・MOD環境・元データの破損を切り分ける。正常だった過去のコピーを残しておく
              </td>
            </tr>
            <tr>
              <td data-label="症状">復元したのに別の状態へ戻る</td>
              <td data-label="確認">
                Steam
                Cloud・ゲーム独自の同期・別端末の起動を確認。上書きを繰り返す前に両方の候補を保全
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="save-record">
        <h2>次回の自分にも伝わるバックアップ記録</h2>
        <p>
          外側の日付フォルダーにメモを置くと、復元時に選びやすくなります。セーブ用フォルダーの内部には追加しません。
        </p>
        <div className="reset-checklist">
          <p>ゲーム名／ストア／ゲーム版／MOD：</p>
          <p>保存した日時／キャラクター／進行状況：</p>
          <p>元の保存先／戻すフォルダー名：</p>
          <p>ファイル数・サイズの照合：未確認・一致</p>
          <p>ハッシュ確認：未実施・一部一致・全ファイル一致</p>
          <p>ゲームでの読み込み：未確認・確認済み（日時： ）</p>
        </div>
        <p>
          <strong>
            「コピーした」→「一致を確認した」→「読み込めた」を分けて記録する。
          </strong>
          これが、バックアップを復旧に使える形で残すコツです。
        </p>
        <p className="reset-small">
          2026年9月27日に公式資料を照合。ゲーム実機での復元テスト結果は掲載していません。共有時はPCのユーザー名やアカウントIDを伏せてください。
        </p>
      </section>
    </div>
  );
}
