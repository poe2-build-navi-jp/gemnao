/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function SteamDiskWriteBeforeSteps() {
  return (
    <div className="reset-config-details steam-disk-write-details">
      <section className="diagnosis-table" id="disk-target">
        <h2>最初に、どのドライブへ書き込めないか特定する</h2>
        <p>
          Steam本体がC:にあることと、ゲームがC:へ保存されることは別です。エラーの出た
          <strong>ゲームの保存先ドライブ</strong>を先に確認します。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">今の状態</th>
              <th scope="col">Steamで開く場所</th>
              <th scope="col">見ておくもの</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状態">更新中・インストール済み</td>
              <td data-label="場所">
                「ライブラリ」→ゲームを右クリック→「プロパティ」→「インストール済みファイル」→「参照」
              </td>
              <td data-label="確認">
                開いたフォルダーの先頭のドライブ文字（例：D:）。Steam「設定」→「ストレージ」でも対象ゲームのあるライブラリを確認
              </td>
            </tr>
            <tr>
              <td data-label="状態">まだインストール先を選んでいない</td>
              <td data-label="場所">
                インストール画面の保存先選択と「設定」→「ストレージ」
              </td>
              <td data-label="確認">
                今回選ぶドライブ文字。既定ライブラリの場所を思い込みで決めない
              </td>
            </tr>
            <tr>
              <td data-label="状態">外付け先のゲームが見えない</td>
              <td data-label="場所">
                Windowsの「このPC」とSteamの「設定」→「ストレージ」
              </td>
              <td data-label="確認">
                以前のドライブ文字で認識されているか。見えないうちは更新やライブラリ修復を反復しない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          例：ゲームの「参照」で <strong>D: ドライブ</strong>
          が開き、Steam本体はC:。この場合、まずD:の空きを確認します。別の空きがあるSteamライブラリへ移す場合は、
          <a
            href="https://help.steampowered.com/en/faqs/view/4BD4-4528-6B2E-8327"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steam公式の移動手順
          </a>
          を使います。
        </p>
      </section>

      <section className="diagnosis-table" id="disk-space">
        <h2>「十分な空き」はどう確かめる？</h2>
        <ol>
          <li>
            <strong>Windowsキー＋E</strong>
            →「このPC」→「デバイスとドライブ」で、保存先ドライブ（例：D:）の
            <strong>空き領域</strong>
            を記録します。「プロパティ」→「全般」でも確認できます。WindowsのC:とゲームのD:の両方が表示される時は、数字を取り違えないでください。
          </li>
          <li>
            Steamの「ダウンロード」で対象ゲームの更新量と進行状況を確認します。
            <strong>
              表示されるダウンロード量は、更新中に必要なディスク容量の確定値ではありません。
            </strong>
            展開や既存ファイルの置換に追加の領域が必要なことがあり、全ゲーム共通の「何GBあれば安全」という値は置けません。
          </li>
          <li>
            対象ドライブの空きが心もとない時は、削除してよいと分かる自分のファイルを整理するか、Steamの「設定」→「ストレージ」で空きのある別のライブラリを利用します。Steamやゲームのフォルダーを名前で判断して手動削除せず、空きが増えたことを「このPC」で再確認してから再開します。
          </li>
        </ol>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">確認例（仮の数値）</th>
              <th scope="col">どう読むか</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="例">
                D: 空き4GB、Steamで更新のダウンロード表示が6GB。C: 空き80GB
              </td>
              <td data-label="判断">
                ゲームの保存先D:に余裕がない。C:の80GBだけを見て「十分」と判断しない
              </td>
              <td data-label="次の行動">
                D:を整理、またはSteamで空きのある保存先を選択して再確認
              </td>
            </tr>
            <tr>
              <td data-label="例">D: 空き40GB、ダウンロード表示が2GB</td>
              <td data-label="判断">
                空き不足の可能性は下がるが、更新・展開の必要量はゲームごとに異なる
              </td>
              <td data-label="次の行動">
                同じ更新を一度再開。なお失敗するなら
                <a href="#disk-repair">対象ライブラリの修復</a>へ
              </td>
            </tr>
          </tbody>
        </table>
        <p className="reset-small">
          数値は説明用で、特定ゲームで実測した必要容量ではありません。
          <a
            href="https://support.microsoft.com/ja-jp/windows/experience/storage-filemanagement/free-up-drive-space-in-windows"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft公式：このPCで空き容量を確認
          </a>
        </p>
      </section>
    </div>
  );
}

export function SteamDiskWriteAfterSteps() {
  return (
    <div className="reset-config-details steam-disk-write-details">
      <section className="diagnosis-table" id="disk-repair">
        <h2>ライブラリ修復の後は、同じ更新の完了まで確かめる</h2>
        <ol>
          <li>
            Steamの「設定」→「ストレージ」→
            <strong>実際にエラーが出たドライブ</strong>
            を選び、「…」→「ライブラリフォルダーを修復（Repair
            Folder）」を実行。Steam公式の
            <a
              href="https://help.steampowered.com/ja/faqs/view/21F5-8D5D-0141-7A5E"
              target="_blank"
              rel="noopener noreferrer"
            >
              更新とインストールの案内
            </a>
            に対応する操作です。表示名が異なる場合は同じストレージ画面の修復項目を確認します。
          </li>
          <li>
            修復処理が終わったら
            <strong>Steamの「ダウンロード」で同じゲームを再開</strong>
            します。通信中のパーセント表示だけで終わりにせず、インストール・更新が完了し、同じエラーが再表示されないことを確認。ゲームを起動できれば、そのゲームでの更新が成功したと判断できます。
          </li>
          <li>
            まだ同じゲームだけ失敗するなら、そのゲームの「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」。整合性確認で修復があっても再度更新・起動を試し、成功したか判定します。Steamライブラリ修復と整合性確認は対象が違います。
          </li>
        </ol>
        <p>
          修復後もSteamのダウンロード進行表示を控えます。同じ地点で止まる／別の地点で止まる／最後まで完了する、の違いが次の切り分けに役立ちます。
        </p>
      </section>

      <section className="diagnosis-table" id="disk-results">
        <h2>確認結果で次にすることを選ぶ</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">修復・再開後の結果</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">更新が完了し、ゲームも起動</td>
              <td data-label="次の操作">
                このゲームの問題は解消。修復した日とドライブ文字を記録し、無用な再インストールやディスク点検はしない
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                対象ゲームだけ再び失敗。他のゲームは同じドライブで正常
              </td>
              <td data-label="次の操作">
                ゲームファイルの整合性を確認し、再度同じ更新を試す。セキュリティソフトの隔離履歴に該当ファイルがあれば出所を調べる。
                <a href="/guide/verify-steam-files">整合性確認の手順</a>
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                同じドライブにある別のゲームも書き込み失敗
              </td>
              <td data-label="次の操作">
                エラー文、ゲーム名、ドライブ文字を記録。Windowsでも保存に失敗するか確認し、重要データを保全して
                <a href="#disk-check">ドライブ点検の条件</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">外付けドライブが見えたり消えたりする</td>
              <td data-label="次の操作">
                更新を止めて重要データを保全。接続・電源・ケーブルを安全に確認し、再発する場合は機器メーカーへ相談
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                Steamだけ失敗し、Windowsの点検ではエラーを検出しない
              </td>
              <td data-label="次の操作">
                Steam公式サポートにエラー全文、再現した進行状況、修復・整合性確認の結果、ドライブの空きを伝える
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="diagnosis-table" id="disk-check">
        <h2>Windowsのドライブ点検へ進む条件と、結果の読み方</h2>
        <p>
          <strong>
            同じドライブ上の複数ゲームで失敗、Windowsのファイル保存も失敗、ドライブの認識が切れる、異音やWindowsのエラー通知がある
          </strong>
          時は、Steam内の修復だけを繰り返さずドライブ側を調べます。異音や認識切れが頻繁なら、重要データや
          <a href="/guide/save-data-backup">セーブを別の保存先へ保全</a>
          することを優先し、負荷のかかる再試行は止めてください。
        </p>
        <ol>
          <li>
            Windowsキー＋E→「このPC」→<strong>対象ドライブ</strong>
            を右クリック→「プロパティ」→「ツール」→「エラーチェック」の「チェック」を開きます。C:やD:を取り違えず、結果の文面をメモします。
          </li>
          <li>
            Windowsが「エラーなし」と示すならファイルシステムの異常は検出されていません。ただし物理的な故障がない保証ではありません。同じドライブで症状が続くなら相談を検討します。「エラーがある」「修復が必要」の場合は、重要データを保全しWindowsの指示に従います。再起動が求められたら作業を保存してから進みます。
          </li>
          <li>
            修復後は同じゲームの更新を一度再開。複数ゲームやWindowsの保存失敗が残る、異音・認識切れが続く場合は、ドライブまたはPCメーカーにドライブ文字・エラー表示・点検結果を伝えます。
          </li>
        </ol>
        <p className="reset-small">
          手動で <code>chkdsk /f</code> や <code>/r</code>{' '}
          を繰り返す必要はありません。
          <a
            href="https://learn.microsoft.com/ja-jp/windows-server/administration/windows-commands/chkdsk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoftの説明
          </a>
          では、修復操作と検査は異なり、全面的なセクター検査には長時間かかる場合があります。
        </p>
      </section>
    </div>
  );
}
