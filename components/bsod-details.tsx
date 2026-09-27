/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function BsodBeforeSteps() {
  return (
    <div className="reset-config-details bsod-details">
      <section className="diagnosis-table" id="bsod-first">
        <h2>最初に確認する3点：コード・時刻・直前の変更</h2>
        <p>
          Windowsに戻れた場合の手順です。画面の色はWindowsの版で異なります。停止コードを撮影できなかった場合も、ゲーム名・停止した日時・更新や周辺機器の変更を控えてください。
        </p>
        <ol>
          <li>
            「スタート」を右クリック→「イベント ビューアー」→「Windows
            ログ」→「システム」を開き、停止した時刻の前後を調べます。ソース「BugCheck」があれば詳細の停止コードとダンプの場所を控え、同時刻前後の「WHEA-Logger」なども記録します。
          </li>
          <li>
            「Kernel-Power」イベント41は予期しない再起動の手掛かりで、単独では原因部品を示しません。イベントの名前だけで電源ユニットを交換しないでください。
          </li>
          <li>
            停止を繰り返す場合は、まず必要なファイルをバックアップします。再現させ続けず、診断結果を揃えてPCメーカーや修理窓口に相談してください。
          </li>
        </ol>
      </section>
      <section className="diagnosis-table" id="bsod-codes">
        <h2>停止コード別：次に確認する場所</h2>
        <p>
          停止コードは調査の入口です。表示だけで原因部品を確定するものではありません。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">停止コードの例</th>
              <th scope="col">先に確認する場所</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="停止コード">VIDEO_TDR_FAILURE（0x116）</td>
              <td data-label="確認先">
                デバイス マネージャー→ディスプレイ
                アダプター→対象GPUのプロパティ→ドライバー
              </td>
              <td data-label="次の行動">
                GPU名・版・更新日を控え、更新直後なら
                <a href="/guide/gpu-driver-update">元の版へ戻す方法</a>
                を確認。画面に出たファイル名も記録。
              </td>
            </tr>
            <tr>
              <td data-label="停止コード">MEMORY_MANAGEMENT（0x1A）</td>
              <td data-label="確認先">
                Windows メモリ診断の結果と最近のメモリ設定・追加機器
              </td>
              <td data-label="次の行動">
                下記の手順で診断し、エラーの有無と診断時刻を控える。
              </td>
            </tr>
            <tr>
              <td data-label="停止コード">IRQL_NOT_LESS_OR_EQUAL（0xA）</td>
              <td data-label="確認先">
                最近変更したドライバー・周辺機器とメモリ診断
              </td>
              <td data-label="次の行動">
                変更履歴を控え、新しく追加した機器を外すなど、1項目ずつ比較。
              </td>
            </tr>
            <tr>
              <td data-label="停止コード">WHEA_UNCORRECTABLE_ERROR（0x124）</td>
              <td data-label="確認先">
                PCメーカーのハードウェア診断と同時刻のWHEA-Logger
              </td>
              <td data-label="次の行動">
                OC・アンダーボルトを標準へ戻し、冷却の異常を確認。繰り返す場合はメーカーへ相談。
              </td>
            </tr>
            <tr>
              <td data-label="停止コード">別のコード／読めなかった</td>
              <td data-label="確認先">
                停止時刻付近の「システム」ログとミニダンプ
              </td>
              <td data-label="次の行動">
                コードやダンプの有無を控えてサポートへ。ファイル名が表示されても単独で犯人と決めない。
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function BsodAfterSteps() {
  return (
    <div className="reset-config-details bsod-details">
      <section className="diagnosis-table" id="bsod-memory">
        <h2>Windows メモリ診断：起動から結果の確認まで</h2>
        <ol>
          <li>
            作業中のファイルを保存してゲームを終了。Windowsの「スタート」で「Windows
            メモリ診断」と検索して開き、「今すぐ再起動して問題の有無を確認する」を選びます。Windows＋R→
            <code>mdsched.exe</code>でも起動できます。
          </li>
          <li>
            再起動後の診断が終わり、Windowsにサインインしたら「スタート」を右クリック→「イベント
            ビューアー」→「Windows
            ログ」→「システム」を開きます。右側の「検索」を押して
            <code>MemoryDiagnostics-Results</code>
            を探し、診断を実行した日時の項目を開いて「全般」の結果本文を読みます。
          </li>
          <li>
            「エラーは検出されませんでした」は、その検査で見つからなかったという意味です。症状が続くならドライバー・機器なども調べます。「ハードウェアの問題が検出されました」などエラーが出たら、結果の画面とPC型番を控えてメーカーへ相談します。項目が見つからなければ「未検出」とは扱わず、結果が確認できなかったと記録します。
          </li>
        </ol>
      </section>
      <section className="diagnosis-table" id="bsod-dump">
        <h2>ミニダンプはどこ？ 何を渡す？</h2>
        <p>
          ミニダンプ（<code>.dmp</code>
          ）は停止時にWindowsが作る調査用ファイルです。自分で中身を読めなくても、サポートが解析に使えます。
        </p>
        <ol>
          <li>
            Windows＋Eでエクスプローラーを開き、アドレスバーへ
            <code>%SystemRoot%\Minidump</code>と入力。停止日時に近い
            <code>.dmp</code>
            のファイル名・日時を控えます。調査用のコピーを別のフォルダーへ保存し、元ファイルを削除しないでください。
          </li>
          <li>
            ない場合は、Windowsの検索で「システムの詳細設定を表示」→「詳細設定」→「起動と回復」の「設定」→「デバッグ情報の書き込み」を確認します。「なし」ならダンプは保存されません。設定を変える際はPCメーカーの案内に従い、次の停止前に空き容量も確認してください。
          </li>
          <li>
            ダンプには停止時のメモリ情報が含まれます。公開サイトへ無条件で載せず、提出先と方法をサポートに確認してください。BugCheckのイベントに記載された保存先が別の場合はそちらを確認します。
          </li>
        </ol>
      </section>
      <section className="diagnosis-table" id="bsod-report">
        <h2>相談時に渡す情報：そのまま使えるメモ</h2>
        <ul>
          <li>PCのメーカー・型番、Windowsの版、GPU名・ドライバー版</li>
          <li>ゲーム名・ゲームの版・停止した日時と場面・再現頻度</li>
          <li>停止コード・What failedのファイル名（あれば）・画面写真</li>
          <li>
            イベント ビューアーで一致したBugCheck／WHEA-Loggerの日時と本文
          </li>
          <li>メモリ診断の日時と結果本文、ミニダンプの有無とファイル名</li>
          <li>発生前の更新・接続機器・OC設定、実施した対策と変化</li>
        </ul>
        <p>
          同じゲームの同じ場面でだけ起きるか、ほかのゲームや通常の作業中も起きるかを添えると、ゲーム側とPC全体の調査を分けやすくなります。
        </p>
      </section>
    </div>
  );
}
