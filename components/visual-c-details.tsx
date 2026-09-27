/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

const microsoftDownloads =
  'https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist';

export function VisualCBeforeSteps() {
  return (
    <div className="reset-config-details visual-c-details">
      <section className="diagnosis-table" id="vc-error-table">
        <h2>エラー表示から、調べる系列を選ぶ</h2>
        <p>
          DLL名の数字は<strong>必要な年版の手がかり</strong>
          です。実際にエラーを出したゲーム・プラグインが32bitか64bitかは、別に確認します。表示例が違う場合は、同じ数字だと推測してインストールしないでください。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">画面に出た名前・表示</th>
              <th scope="col">確認する配布欄</th>
              <th scope="col">次の一手</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="表示">
                <code>VCRUNTIME140.dll</code>・<code>MSVCP140.dll</code>・
                <code>VCRUNTIME140_1.dll</code>が見つからない
              </td>
              <td data-label="系列">Visual C++ v14（2015以降の系列）</td>
              <td data-label="次の一手">
                Microsoftの
                <a
                  href={microsoftDownloads}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  最新v14欄
                </a>
                からゲームのx86／x64に合うものを選ぶ。Windowsが64bitでも32bitゲームにはx86
              </td>
            </tr>
            <tr>
              <td data-label="表示">
                <code>MSVCP120.dll</code>・<code>MSVCR120.dll</code>
                が見つからない
              </td>
              <td data-label="系列">Visual C++ 2013（12.0）</td>
              <td data-label="次の一手">
                <a
                  href={microsoftDownloads}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoftの2013欄
                </a>
                でx86／x64を選ぶ。最新v14を入れるだけでは2013の代わりにならない
              </td>
            </tr>
            <tr>
              <td data-label="表示">
                <code>MSVCP110.dll</code>・<code>MSVCR110.dll</code>
                が見つからない
              </td>
              <td data-label="系列">Visual C++ 2012（11.0）</td>
              <td data-label="次の一手">
                <a
                  href={microsoftDownloads}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoftの2012 Update 4欄
                </a>
                でゲームに合う対象を確認
              </td>
            </tr>
            <tr>
              <td data-label="表示">
                <code>MSVCP100.dll</code>・<code>MSVCR100.dll</code>
                が見つからない
              </td>
              <td data-label="系列">Visual C++ 2010（10.0）</td>
              <td data-label="次の一手">
                <a
                  href={microsoftDownloads}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoftの2010 SP1欄
                </a>
                を確認。古いゲームの公式手順があれば併せて確認
              </td>
            </tr>
            <tr>
              <td data-label="表示">
                <code>ucrtbase.dll</code>／<code>api-ms-win-*.dll</code>がない
              </td>
              <td data-label="系列">WindowsのUniversal CRTに関係する可能性</td>
              <td data-label="次の一手">
                Windows Updateとゲーム提供元の案内を確認。
                <a
                  href="https://learn.microsoft.com/ja-jp/cpp/windows/universal-crt-deployment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MicrosoftのUCRT説明
                </a>
                を参照し、DLLを単体で入れない
              </td>
            </tr>
            <tr>
              <td data-label="表示">
                DLL名がない「Runtime Error!」・<code>0xc000007b</code>のみ
              </td>
              <td data-label="系列">表示だけでは特定できない</td>
              <td data-label="次の一手">
                ゲームの前提ソフトと公式サポートを確認。コードだけでVisual
                C++の年版やx86／x64を決めない
              </td>
            </tr>
          </tbody>
        </table>
        <p className="reset-small">
          数字と年版の対応はMicrosoftの配布資料に基づく目安です。「必要なDLL」がゲーム本体でなくMODやランチャーから呼ばれている場合、確認すべき対象が変わります。
        </p>
      </section>

      <section className="diagnosis-table" id="vc-architecture">
        <h2>x86とx64の選び方：Windowsではなくゲームを見る</h2>
        <ol>
          <li>
            まずゲームの公式動作環境・サポートを読み、対象が「32-bit／x86」か「64-bit／x64」かを確認します。ランチャーとゲーム本体が別なら、
            <strong>エラーを出しているゲーム本体・プラグイン</strong>
            の案内を見ます。
          </li>
          <li>
            ゲームが32bitならx86、64bitならx64を選びます。例えば64bit
            Windowsに「Visual C++ 2013 (x64)」だけあっても、32bitゲームで
            <code>MSVCP120.dll</code>が必要なら2013 (x86)の確認が必要です。
          </li>
          <li>
            ゲーム側の対象が不明な場合は推測でx64に決めず、配布元の前提条件・同梱の再頒布可能パッケージ・公式サポートを確認します。64bit
            Windowsではx86版とx64版を併存できますが、
            <strong>必要な年版はDLL名とゲームの案内で絞る</strong>のが先です。
          </li>
        </ol>
        <p>
          <a
            href={microsoftDownloads}
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoftの配布案内
          </a>
          も、パッケージのアーキテクチャはアプリの対象と一致させると説明しています。
        </p>
      </section>

      <section className="diagnosis-table" id="vc-installed">
        <h2>Windowsの導入済み一覧を確認する</h2>
        <ol>
          <li>
            <strong>Windowsキー＋R</strong>→<code>appwiz.cpl</code>
            →Enter。「プログラムと機能」で<strong>Microsoft Visual C++</strong>
            を探します。Windows
            11では「設定」→「アプリ」→「インストールされているアプリ」からも一覧を見られます。
          </li>
          <li>
            表で絞った年版／14.xと、名前の末尾の<strong>(x86)／(x64)</strong>
            をセットで確認し、表示をメモします。例：
            <code>Microsoft Visual C++ 2013 Redistributable (x86)</code>
            。2015以降のv14系は2017・2019・2022など異なる年号で表示される場合があるため、名前に加えバージョンも確認してください。
          </li>
          <li>
            対象がある場合は選択して「変更」→「修復」（選べる場合）を実行。見当たらなければMicrosoft公式ページの同じ年版・アーキテクチャを選んで導入します。どちらも再起動後に同じエラーが出るか比較します。
          </li>
        </ol>
      </section>
    </div>
  );
}

export function VisualCAfterSteps() {
  return (
    <div className="reset-config-details visual-c-details">
      <section className="diagnosis-table" id="vc-failed">
        <h2>修復・インストールが失敗した場合の判断表</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">結果</th>
              <th scope="col">確認する点</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">
                「修復」が表示されない／対象が一覧にない
              </td>
              <td data-label="確認">探した系列とx86／x64が合っているか</td>
              <td data-label="次の行動">
                同じ年版・対象の
                <a
                  href={microsoftDownloads}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft公式インストーラー
                </a>
                を開き、表示された導入・修復の操作を選ぶ
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                「より新しいバージョンが既にある」などと表示
              </td>
              <td data-label="確認">
                導入済み一覧の同じ系列・同じx86／x64のバージョン
              </td>
              <td data-label="次の行動">
                古いインストーラーを繰り返さず、導入済みの項目の修復か、Microsoftの現行配布欄を確認
              </td>
            </tr>
            <tr>
              <td data-label="結果">無効なインストーラーパッケージ（1620）</td>
              <td data-label="確認">
                ダウンロード元とファイル名、再試行した日時
              </td>
              <td data-label="次の行動">
                以前の実行ファイルを使い回さず、該当する系列・アーキテクチャのパッケージをMicrosoftの配布ページから取得し直す
              </td>
            </tr>
            <tr>
              <td data-label="結果">1603など詳細のない失敗</td>
              <td data-label="確認">
                画面のコード・該当パッケージ名・セットアップのログ
              </td>
              <td data-label="次の行動">
                Windows
                Updateと再起動後に再試行。1603だけでは原因を断定できないため、
                <a
                  href="https://learn.microsoft.com/ja-jp/cpp/windows/troubleshoot-vc-redistributable-installation-issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoftの診断案内
                </a>
                へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">アクセス拒否（5）／ファイル使用中（32）</td>
              <td data-label="確認">
                管理者権限の有無、実行中のゲーム・インストーラー
              </td>
              <td data-label="次の行動">
                作業を保存してアプリを終了・PCを再起動。Microsoft公式のインストーラーを「管理者として実行」し再確認
              </td>
            </tr>
            <tr>
              <td data-label="結果">古い版を削除できない（1714）</td>
              <td data-label="確認">ログに書かれた古いパッケージの正確な版</td>
              <td data-label="次の行動">
                Microsoftの
                <a
                  href="https://learn.microsoft.com/ja-jp/cpp/windows/troubleshoot-vc-redistributable-installation-issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  1714の案内
                </a>
                に沿ってその版だけを扱う。全てのVisual C++やWindows
                Installerの保存フォルダーを一括削除しない
              </td>
            </tr>
            <tr>
              <td data-label="結果">導入成功、しかしゲームだけ同じDLLエラー</td>
              <td data-label="確認">
                ゲーム/プラグインのx86／x64、エラーの全文、ゲームファイル
              </td>
              <td data-label="次の行動">
                <a href="/guide/verify-steam-files">Steamの整合性確認</a>、
                <a href="/guide/remove-mods-safely">MODの切り分け</a>
                を行い、解決しなければ記録をゲームのサポートへ
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="diagnosis-table" id="vc-record">
        <h2>問い合わせ前に残す5項目</h2>
        <p>
          ゲーム名と起動経路／エラー全文とDLL名／ゲームの32bit・64bit（不明なら「不明」）／導入済み一覧の該当年版と(x86)/(x64)／Microsoftの修復・導入結果とエラー番号。これだけあれば、別の版を入れ続ける前に不足箇所を確認できます。
        </p>
      </section>
    </div>
  );
}
