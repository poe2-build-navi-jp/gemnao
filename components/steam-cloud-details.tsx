/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function SteamCloudBeforeSteps() {
  return (
    <div className="reset-config-details steam-cloud-details">
      <section className="diagnosis-table" id="cloud-first">
        <h2>競合が出たら：選択前の保全を先に</h2>
        <p>
          競合画面の「ローカル」は今のPC側、「クラウド」はSteam側の候補です。選んだ方が欲しい進行か分からない間は、どちらもクリックしないでください。ゲームを起動すると自動保存や同期が動く場合があります。
        </p>
        <ol>
          <li>
            競合画面を撮影し、両方の更新日時・ファイル情報があれば一緒に記録します。表示された時刻と実際に遊んだ時刻にずれがないかも確認します。
          </li>
          <li>
            ゲームを起動せず、
            <a href="/guide/save-data-backup">
              セーブの保存先とバックアップ手順
            </a>
            で対象ゲームのフォルダーを特定。エクスプローラーでコピーし、
            <code>ゲーム名_PC-A_ローカル_日時</code>
            のような別フォルダーへ貼り付けます。切り取りや上書きは使いません。コピー先のファイル数とサイズも確認します。
          </li>
          <li>
            複数PCで遊んだ場合はPC BのゲームとSteamを開く前に、同様にPC
            Bのローカルも別にコピーします。Steam
            Deckなど別端末がある場合も、ゲーム固有の案内に従って残せるデータを確認します。どちらのPCのコピーか混ぜないでください。
          </li>
          <li>
            ブラウザーで
            <a
              href="https://store.steampowered.com/account/remotestorage"
              target="_blank"
              rel="noopener noreferrer"
            >
              Steam公式のRemote Storage
            </a>
            にログインし、対象ゲームのファイルが表示されダウンロードできるなら、
            <code>ゲーム名_クラウド_日時</code>
            へ別途保存します。表示されないゲームでは「クラウドは空」と決めつけません。
          </li>
        </ol>
        <p>
          Cloudの設定変更や「同期できません」からの強行起動はコピーを取った後に判断します。ゲームによってSteam
          Cloudが同期するファイルの種類や保存先は異なります。
        </p>
      </section>
      <section className="diagnosis-table" id="cloud-devices">
        <h2>1台／複数PC：確認する順番</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">使い方</th>
              <th scope="col">先に確かめる記録</th>
              <th scope="col">競合時の確認先</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="使い方">普段は1台だけ</td>
              <td data-label="先に確認">
                最後にそのPCで保存・終了した日時。オフラインで遊んだか、再インストールや新規ゲームを始めたか
              </td>
              <td data-label="次の確認">
                そのPCのローカルコピー、競合画面の日時、手元のスクリーンショット・メモ
              </td>
            </tr>
            <tr>
              <td data-label="使い方">PC AとPC Bを交互に使う</td>
              <td data-label="先に確認">
                各PCで最後に遊んだ日時・章・キャラクター・終了後の同期完了。どちらかがオフラインだったか
              </td>
              <td data-label="次の確認">
                AとBのローカルを別々にコピーし、クラウドの日時も照合。古いPCのゲームを先に開かない
              </td>
            </tr>
            <tr>
              <td data-label="使い方">どちらが進んでいたか覚えていない</td>
              <td data-label="先に確認">
                Steamやゲームのスクリーンショット、手元の進行メモ、セーブファイル名と更新日時
              </td>
              <td data-label="次の確認">
                中身を断定せず両候補を保全し、ゲーム公式の保存方式を調べる。選択後の確認方法を決める
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="diagnosis-table" id="cloud-progress">
        <h2>「進行状況」は選択前にどう照合する？</h2>
        <p>
          競合画面だけで双方のセーブを読み込んで比べる機能はありません。次の3点を候補ごとにメモし、実際に最後に遊んだセッションと結びつけます。
        </p>
        <ol>
          <li>
            <strong>何を達成したか：</strong>
            最後の章・クエスト、キャラクター名、レベル、プレイ時間、最後に見た場所を思い出し、ゲーム内スクリーンショット・配信記録・手元メモがあれば日時も確認します。
          </li>
          <li>
            <strong>いつ・どの端末か：</strong>PC A、PC
            Bそれぞれで最後にゲームを終了した時刻と、Steamが「同期済み」になったかを照合。オフラインプレイならその後の進行がクラウドにまだ反映されていない可能性があります。
          </li>
          <li>
            <strong>保存ファイルの手掛かり：</strong>
            PC側のコピー内でファイル名・更新日時・容量・スロット数を確認。クラウドのファイルが見られる場合も同じ項目を比べます。容量や日時だけで章・装備・セーブの正常性は分からないので、最後のプレイ履歴と合わせて判断します。
          </li>
        </ol>
      </section>
    </div>
  );
}

export function SteamCloudAfterSteps() {
  return (
    <div className="reset-config-details steam-cloud-details">
      <section className="diagnosis-table" id="cloud-examples">
        <h2>ローカル？ クラウド？ 選択の具体例</h2>
        <p>
          以下は選び方を示す<strong>架空の例</strong>
          です。第何章まで進めたかは競合画面の表示ではなく、本人のプレイ記録やスクリーンショットから分かっている前提です。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">確認できた経過</th>
              <th scope="col">表示された候補</th>
              <th scope="col">保全後の判断</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="経過">
                1台だけ。26日夜にオフラインで第8章まで進めた
              </td>
              <td data-label="候補">
                ローカル：26日23時／クラウド：25日21時。クラウドは第5章で止まった日の版
              </td>
              <td data-label="判断">
                <strong>ローカル</strong>
                を選ぶ根拠がある。PC側のコピーを保存し、選択後も第8章か確認
              </td>
            </tr>
            <tr>
              <td data-label="経過">
                PC Bで26日夜に第8章まで進め、同期済み。今は古いPC Aを起動
              </td>
              <td data-label="候補">
                PC Aのローカル：25日21時／クラウド：26日23時。PC Bの記録と一致
              </td>
              <td data-label="判断">
                <strong>クラウド</strong>
                を選ぶ根拠がある。A・B両方のコピーを残し、Aで第8章か確認
              </td>
            </tr>
            <tr>
              <td data-label="経過">
                同じPCで26日深夜に新規ゲームを開始したが、戻したいのは以前の第8章
              </td>
              <td data-label="候補">
                ローカル：27日0時の新規データ／クラウド：26日20時の第8章相当
              </td>
              <td data-label="判断">
                日時はローカルが新しくても<strong>クラウド</strong>
                が目的に合う。両方保全し、別スロットも確認
              </td>
            </tr>
            <tr>
              <td data-label="経過">最後に遊んだPCや進行を思い出せない</td>
              <td data-label="候補">
                日時だけが表示され、セーブの中身が分からない
              </td>
              <td data-label="判断">
                <strong>いったん選択を保留</strong>
                。PCごとのコピーとクラウドの保存可否を確認し、必要ならゲーム公式へ相談
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="diagnosis-table" id="cloud-verify">
        <h2>選択した後、何を見れば成功？</h2>
        <ol>
          <li>
            ゲームを開き、セーブ一覧にあるキャラクター名・章・プレイ時間・スロット数が最後に期待した状態か確認します。複数スロットがあるゲームでは、ロード対象が別スロットになっていないかも確認します。
          </li>
          <li>
            必要なら保存せずにロードして直近の場所や進行を確かめます。ゲームによっては起動・ロードだけで自動保存されるため、選択前のPC
            A・PC B・クラウドのバックアップはこの時点でも消しません。
          </li>
          <li>
            一致したら通常の方法でゲームを終了し、Steam上で対象ゲームの同期完了を確認してから次のPCを起動。違えば追加で保存・別PCで起動する前に停止し、
            <a href="/guide/save-data-backup">バックアップからの復元手順</a>
            とゲーム公式の案内を確認します。
          </li>
        </ol>
      </section>
      <section className="diagnosis-table" id="cloud-error">
        <h2>競合ではなく「同期できません」の場合</h2>
        <ol>
          <li>
            ゲームを強行起動せずローカルをコピーします。Steamの「設定」→「クラウド」と対象ゲームの「プロパティ」→「一般」でCloudが有効か、ログイン中のアカウントが目的のものか確認します。
          </li>
          <li>
            通信が安定しているかを確かめ、Steamを通常終了・起動して同期状態を見ます。ゲームを遊び終えた直後ならアップロードが終わるまで待ちます。
          </li>
          <li>
            なお続く場合はゲーム名、エラー表示、開始時刻、1台／複数PCの別、バックアップの有無を控えます。Steam公式の案内に沿って必要ならSteamインストール先の
            <code>logs/cloud_log.txt</code>
            も確認し、ログや保存先を丸ごと削除せずサポートへ相談します。
          </li>
        </ol>
      </section>
    </div>
  );
}
