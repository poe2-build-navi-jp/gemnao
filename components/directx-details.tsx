/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function DirectxBeforeSteps() {
  return (
    <div className="reset-config-details directx-details">
      <section className="diagnosis-table" id="directx-error-types">
        <h2>エラーの英数字で入口を選ぶ</h2>
        <p>
          ダイアログを閉じる前にスクリーンショットを撮り、
          <strong>エラー全文と末尾の英数字・DLL名</strong>
          を控えます。次は表示例であり、ゲーム固有のエラー文や原因を確定する表ではありません。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">表示例</th>
              <th scope="col">何を疑うか</th>
              <th scope="col">先に開く場所</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="表示例">
                <code>Feature Level 12_0 required</code>／
                <code>D3D11 feature level 11_0</code>
              </td>
              <td data-label="分類">
                使用GPUの機能レベルとゲーム要求が合わない可能性
              </td>
              <td data-label="次に確認">
                <a href="#directx-feature">dxdiagのGPU・機能レベル</a>
                。別GPUがあるPCは使用GPUも確認
              </td>
            </tr>
            <tr>
              <td data-label="表示例">
                <code>d3dx9_43.dll</code>／<code>XINPUT1_3.dll</code>／
                <code>D3DCompiler_43.dll</code>がない
              </td>
              <td data-label="分類">古いゲーム用の追加ライブラリ不足が候補</td>
              <td data-label="次に確認">
                <a href="#directx-dll">
                  ゲーム公式の前提ソフトとMicrosoftの旧ランタイム
                </a>
              </td>
            </tr>
            <tr>
              <td data-label="表示例">
                <code>DXGI_ERROR_DEVICE_REMOVED</code>／<code>DEVICE_HUNG</code>
                ／<code>DEVICE_RESET</code>
              </td>
              <td data-label="分類">
                描画中のGPUデバイスが利用できなくなった可能性
              </td>
              <td data-label="次に確認">
                <a href="#directx-gpu">
                  発生場面・ドライバー・MODやオーバーレイ
                </a>
              </td>
            </tr>
            <tr>
              <td data-label="表示例">
                <code>d3d12.dll</code>／<code>dxgi.dll</code>
                がない、または読み込めない
              </td>
              <td data-label="分類">
                Windows標準の構成やゲームの要求環境を確認
              </td>
              <td data-label="次に確認">
                <a href="#directx-system">
                  Windows Updateとシステムファイルの確認
                </a>
              </td>
            </tr>
            <tr>
              <td data-label="表示例">
                <code>MSVCP140.dll</code>／<code>VCRUNTIME140.dll</code>がない
              </td>
              <td data-label="分類">
                Visual C++系。DirectXの追加ライブラリではない
              </td>
              <td data-label="次に確認">
                <a href="/guide/visual-c-runtime-error">Visual C++の対処記事</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          「DirectXの初期化に失敗」のようにファイル名や機能レベルがない場合は、この表だけでは分類できません。ゲームの公式動作環境、使用GPUと失敗したタイミングを確認してから対処を選んでください。
        </p>
      </section>

      <section className="diagnosis-table" id="directx-feature">
        <h2>DirectX 12と「機能レベル12_0」の違い</h2>
        <ol>
          <li>
            <strong>Windowsキー＋R</strong>→<code>dxdiag</code>
            →Enter。「システム」の「DirectX バージョン」は
            <strong>Windowsに用意されたランタイム</strong>を示します。
          </li>
          <li>
            「ディスプレイ」や「レンダリング」タブを開き、「名前」で
            <strong>対象のGPU</strong>、「機能レベル」で<code>12_1</code>、
            <code>12_0</code>、<code>11_0</code>
            などの一覧を確認します。GPUが2つあれば各タブを見ます。使用GPUが違うなら一覧の数字だけでゲームの対応を断定できません。
          </li>
          <li>
            ゲームの公式動作環境が<strong>「Feature Level 12_0以上」</strong>
            を要求する場合、使用するGPUの一覧に<code>12_0</code>
            かそれより上位の機能レベルがあるか照合します。「DirectX
            12対応」という表記だけなら要求する機能レベルまで断定しません。
          </li>
        </ol>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">dxdiagの仮例</th>
              <th scope="col">読み方</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="仮例">
                システム：DirectX 12／使用GPU：<code>11_0</code>まで／ゲーム：
                <code>12_0 required</code>
              </td>
              <td data-label="読み方">
                Windowsのバージョン表示とGPUの機能は別。現在のGPUは要求に届かない
              </td>
              <td data-label="次の行動">
                別GPUの有無とドライバー状態を確認。対応GPUがなければゲームの公式必要環境を再確認
              </td>
            </tr>
            <tr>
              <td data-label="仮例">
                システム：DirectX 12／使用GPU：<code>12_1</code>あり／ゲーム：
                <code>12_0 required</code>
              </td>
              <td data-label="読み方">
                一覧では要求を満たすが、ゲームがそのGPUを使っているとは限らない
              </td>
              <td data-label="次の行動">
                ノートPCなどはWindowsのグラフィック設定で対象ゲームのGPUを確認。ゲームの別要件も照合
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>上の数値は説明用の仮例です。</strong>
          機能レベルはGPUが使える描画機能を表し、FPSやGPU性能の順位ではありません。Windows
          Updateや旧DirectXランタイムの追加だけでGPUにない機能は増えません。
        </p>
      </section>
    </div>
  );
}

export function DirectxAfterSteps() {
  return (
    <div className="reset-config-details directx-details">
      <section className="diagnosis-table" id="directx-dll">
        <h2>「DLLがない」なら、ファイル名で対処を分ける</h2>
        <p>
          <code>d3dx9_43.dll</code>、<code>XINPUT1_3.dll</code>、
          <code>D3DCompiler_43.dll</code>
          などの古い追加ライブラリが不足する場合は、ゲームの公式サポートに必要な前提ソフトが書かれていないか先に確認します。Steam版なら
          <a href="/guide/verify-steam-files">ゲームファイルの整合性を確認</a>
          する選択肢もあります。
        </p>
        <ol>
          <li>
            ゲーム公式の案内が旧DirectX SDK用の追加ライブラリを要求する場合は、
            <a
              href="https://www.microsoft.com/ja-jp/download/details.aspx?id=8109"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft公式のDirectX エンドユーザー ランタイム（June 2010）
            </a>
            を開きます。ダウンロードした<code>directx_Jun2010_redist.exe</code>
            を実行して、<strong>新しい空フォルダー</strong>へ内容を展開します。
          </li>
          <li>
            展開先で<code>DXSETUP.exe</code>
            を実行し、画面の案内に従います。これは追加の古いライブラリ用で、WindowsのDirectXバージョンやGPUの機能レベルを引き上げる操作ではありません。
          </li>
          <li>
            再起動後、同じゲームで同じエラーが出るか確認。ファイル名が変わったら新しい表示名に沿って確認先を選び直します。
          </li>
        </ol>
        <p>
          <strong>異なる種類のDLLは分けて確認：</strong>
          <code>MSVCP</code>／<code>VCRUNTIME</code>は
          <a href="/guide/visual-c-runtime-error">Visual C++</a>、
          <code>d3d12.dll</code>や<code>dxgi.dll</code>
          なら下のWindows側の確認へ。ファイルを1つずつ非公式サイトから取得してゲームフォルダーやSystem32へコピーしないでください。
        </p>
      </section>

      <section className="diagnosis-table" id="directx-gpu">
        <h2>GPUエラーなら、ドライバーと落ちる場面を比べる</h2>
        <p>
          <code>DXGI_ERROR_DEVICE_REMOVED</code>、<code>DEVICE_HUNG</code>、
          <code>DEVICE_RESET</code>は
          <strong>DLL不足や機能レベル不足とは別</strong>
          です。「REMOVED」という英語だけでGPUの物理故障とは判断しません。
        </p>
        <ol>
          <li>
            エラーが出た場面、ゲームの版、直前のドライバー更新やMOD導入を記録。特定の場面・1つのゲームのみか、ほかのゲームでも起きるか分けます。
          </li>
          <li>
            MODやオーバーレイを使っていれば導入元の方法で一つずつ無効にし、同じ場面で比較。改善しなければ画質設定を一段下げて比較し、VRAMの余裕は
            <a href="/guide/vram-shortage">VRAM不足の記事</a>
            で確認します。変更した値は元に戻せるよう控えます。
          </li>
          <li>
            複数ゲームで起きる、またはGPUドライバー更新後からなら、
            <a href="/guide/gpu-driver-update">GPUメーカー別の更新・戻し方</a>
            を確認。電源断やPC再起動も伴う場合は
            <a href="/guide/pc-shuts-down-while-gaming">PC全体の確認</a>
            へ進みます。
          </li>
        </ol>
        <p>
          ゲーム公式がDX11などの別描画モードを案内している場合だけ、切り替え前の設定を控えて試します。
          <strong>全ゲーム共通の起動オプションはありません。</strong>
        </p>
      </section>

      <section className="diagnosis-table" id="directx-system">
        <h2>Windows標準DLLや原因不明の初期化エラー</h2>
        <ol>
          <li>
            <code>d3d12.dll</code>／<code>dxgi.dll</code>
            のような表示や、ファイル名のない「初期化失敗」なら、まずゲームの公式必要環境とOS、GPU名・機能レベルを照合します。Windows
            11の「設定」→「Windows Update」で更新を確認し、再起動します。
          </li>
          <li>
            1ゲームだけなら
            <a href="/guide/verify-steam-files">ゲームファイルの整合性</a>
            を確認。GPUが2つあり別のGPUでゲームが起動している疑いがあるなら「設定」→「システム」→「ディスプレイ」→「グラフィック」でゲームを選び、利用するGPUを確認します。
          </li>
          <li>
            複数のアプリでWindowsのシステムファイル異常が続く場合は、
            <a
              href="https://support.microsoft.com/ja-jp/windows/experience/backup-recovery/using-system-file-checker-in-windows"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft公式の修復手順
            </a>
            で管理者のコマンド プロンプトから
            <code>DISM.exe /Online /Cleanup-image /Restorehealth</code>
            を実行し、成功後に<code>sfc /scannow</code>
            を実行します。結果を控え、必要ならサポートに相談します。
          </li>
        </ol>
        <p>
          解決しなければ、エラー画面、ゲームの版、dxdiagの「すべての情報を保存」で得た情報、変更前後の結果をゲーム公式サポートへ伝えます。保存ファイルはPC情報を含むため、公開投稿の前に内容を確認してください。
        </p>
      </section>
    </div>
  );
}
