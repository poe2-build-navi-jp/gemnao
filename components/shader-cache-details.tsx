/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */
export function ShaderCacheBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="shader-route">
        <h2>どのキャッシュを操作する？ 4つの入口</h2>
        <p>
          シェーダーキャッシュは、描画用に変換した処理を保存して使い回す仕組みです。定期掃除でFPSを上げるものではありません。更新後に始まった描画不良や、ゲーム側が削除を案内する症状で切り分けに使います。
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col" style={{ minWidth: '6em' }}>
                対象
              </th>
              <th scope="col">開く場所</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="対象">Windows</td>
              <td data-label="開く場所">
                <a href="#shader-windows">ディスク クリーンアップ</a>
              </td>
              <td data-label="操作">DirectXシェーダーキャッシュだけ削除</td>
            </tr>
            <tr>
              <td data-label="対象">NVIDIA</td>
              <td data-label="開く場所">
                <a href="#shader-nvidia">
                  NVIDIA App → Graphics → Global Settings
                </a>
              </td>
              <td data-label="操作">
                一時的にOff → 再起動 → 指定先を削除 → 設定を戻す
              </td>
            </tr>
            <tr>
              <td data-label="対象">AMD</td>
              <td data-label="開く場所">
                <a href="#shader-amd">
                  AMD Software → Global Graphics → Advanced
                </a>
              </td>
              <td data-label="操作">Reset Shader Cacheを実行</td>
            </tr>
            <tr>
              <td data-label="対象">ゲーム内</td>
              <td data-label="開く場所">
                <a href="#shader-game">構築・プリロードを表示する画面</a>
              </td>
              <td data-label="操作">ゲームが指定する画面で構築完了を待つ</td>
            </tr>
          </tbody>
        </table>
        <p>
          特定のゲームだけなら、そのゲームの案内を優先します。全ゲームで常に重い場合は、
          <a href="/guide/low-fps">FPS・画質の確認</a>も必要です。
        </p>
      </section>
    </div>
  );
}
export function ShaderCacheAfterSteps() {
  return (
    <div className="reset-config-details">
      <section id="shader-windows">
        <h2>Windows：DirectXシェーダーキャッシュの削除</h2>
        <p>
          <strong>1.</strong> スタートの検索に「ディスク
          クリーンアップ」と入力して開きます。
        </p>
        <p>
          <strong>2.</strong>{' '}
          ドライブ選択が出たらWindowsが入っているドライブ（通常C:）を選びます。
        </p>
        <p>
          <strong>3.</strong>{' '}
          「削除するファイル」で他のチェックを外し、「DirectX シェーダー
          キャッシュ」だけを選択。「OK」→「ファイルの削除」で実行します。
        </p>
        <p className="reset-small">
          <a href="https://community.intel.com/t5/Gaming-on-Intel-Processors-with/CS2-crashed-Failure-Exception-IP-Module-igd10umt64xe-DLL/m-p/1757369">
            Intelサポート担当者の操作案内
          </a>
          でも、C:ドライブのDirectX Shader
          Cacheを選ぶ手順が示されています。項目の有無・表示名はWindowsの版や保存状態で異なります。該当項目がなければ、この操作はスキップします。
        </p>
      </section>
      <section id="shader-nvidia">
        <h2>NVIDIA：削除後はキャッシュ設定を戻す</h2>
        <p>
          NVIDIA公式の手動削除ルートです。「Shader Cache
          Size」は容量設定で、選ぶだけで削除完了になるボタンではありません。
        </p>
        <p>
          <strong>1.</strong> NVIDIA
          Appの「Graphics（グラフィックス）」→「Global
          Settings（グローバル設定）」→「Shader Cache Size」を開き、「Cache
          Size」を「Off」にして「Apply」。PCを再起動します。
        </p>
        <p>
          <strong>2.</strong>{' '}
          ゲームを起動せず、Win＋Rで次のパスを1つずつ開き、存在するフォルダーの
          <strong>中身だけ</strong>を削除します。
        </p>
        <ul>
          <li>
            <code>{'%USERPROFILE%\\AppData\\Local\\NVIDIA\\DXCache'}</code>
          </li>
          <li>
            <code>{'%USERPROFILE%\\AppData\\Local\\NVIDIA\\GLCache'}</code>
          </li>
          <li>
            <code>
              {'%USERPROFILE%\\AppData\\Local\\NVIDIA Corporation\\NV_Cache'}
            </code>
          </li>
        </ul>
        <p>
          <strong>3.</strong> NVIDIA Appに戻り「Shader Cache」を「Driver
          Default（ドライバーのデフォルト）」へ戻して「Apply」。もう一度PCを再起動します。
        </p>
        <p>
          存在しないフォルダーは飛ばします。使用中のファイルは強制削除せず、スキップしたことをメモしてください。設定項目がない版ではこのルートを中止し、Windows側の操作だけで比較できます。
        </p>
        <p>
          <a href="https://nvidia.custhelp.com/app/answers/detail/a_id/5735/~/deleting-nvidia-shader-cache-files">
            出典：NVIDIAの削除手順
          </a>
          。ドライバー削除ツールを導入しなくても、上記の手動ルートを選べます。
        </p>
      </section>
      <section id="shader-amd">
        <h2>AMD：Reset Shader Cacheを実行</h2>
        <p>
          <strong>1.</strong> スタートで「AMD
          Software」を検索して開き、「ゲーム（Gaming）」→「グラフィックス（Graphics）」からグローバル設定を開きます。
        </p>
        <p>
          <strong>2.</strong>{' '}
          「詳細設定（Advanced）」を展開し、「シェーダーキャッシュをリセット（Reset
          Shader Cache）」を探します。
        </p>
        <p>
          <strong>3.</strong>{' '}
          その項目のリセットを実行し、確認画面が出たら承認します。次のゲーム起動から必要なキャッシュが作られます。
        </p>
        <p className="reset-small">
          <a href="https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html">
            AMD公式の説明
          </a>
          はAdrenalin Edition 23.9.1のFull
          Installを基準としています。版・導入形態で画面が異なり、項目がない場合もあります。「工場出荷時にリセット」など、ソフト全体の初期化とは区別してください。
        </p>
      </section>
      <section id="shader-game">
        <h2>ゲーム内：削除と事前構築を区別する</h2>
        <h3>Black Ops 6：メインメニューで待つ</h3>
        <p>
          PC版を起動し、シェーダープリロードが進行中ならメインメニューから移動せず完了を待ちます。その後にプレイを開始します。Activisionは、メインメニューを離れるとプリロードが止まり、性能に影響すると説明しています。
        </p>
        <p>
          これは事前構築の手順です。すべてのゲームに共通の「再構築」ボタンはありません。別ゲームに同じメニュー名を当てはめたり、ゲームデータのshaderファイルを推測で消したりしないでください。
        </p>
        <h3>Fortnite：削除後の初回マッチはまだカクつく場合がある</h3>
        <p>
          Epic Gamesは、DirectX
          12でシェーダーの再コンパイルが繰り返される症状についてキャッシュ削除を案内しています。同時に、削除後の最初のマッチは新しいシェーダーのコンパイルでカクつく可能性も説明しています。初回だけで失敗と決めず、その後の変化を確認する例です。
        </p>
        <p>
          <a href="https://support.activision.com/black-ops-6/articles/black-ops-6-pc-troubleshooting">
            Black Ops 6公式
          </a>{' '}
          ／{' '}
          <a href="https://www.epicgames.com/help/c-34254770/c-38015632/a11302262">
            Fortnite公式
          </a>
        </p>
      </section>
      <section className="diagnosis-table" id="shader-rebuild">
        <h2>再構築中の挙動：待つ時・別の対策へ進む時</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">状態</th>
              <th scope="col">判断と次の操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状態">進捗が進み、ロードが普段より長い</td>
              <td data-label="判断">
                再構築中の可能性。指定画面で完了を待つ。短時間止まった表示だけで強制終了しない
              </td>
            </tr>
            <tr>
              <td data-label="状態">初めての場面だけ引っかかる</td>
              <td data-label="判断">
                実行中のコンパイルも候補。同じ場面を次回起動後にも比較する
              </td>
            </tr>
            <tr>
              <td data-label="状態">毎回同じ進捗でクラッシュする</td>
              <td data-label="判断">
                エラー・進捗・時刻を記録。
                <a href="/guide/verify-steam-files">ファイルの整合性</a>
                とゲームの既知不具合を確認
              </td>
            </tr>
            <tr>
              <td data-label="状態">完了後も常に重い・VRAM不足が出る</td>
              <td data-label="判断">
                <a href="/guide/vram-shortage">VRAMと画質設定</a>
                を切り分ける。再削除を繰り返さない
              </td>
            </tr>
            <tr>
              <td data-label="状態">PC全体が再起動・ブルースクリーンになる</td>
              <td data-label="判断">
                通常の再構築待ちとして扱わず、停止コードやシステム側の障害を調べる
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="shader-record">
        <h2>比較・相談に使える確認メモ</h2>
        <p>
          「消したら重くなった」だけでは、再構築中か元の不具合か分かりません。同じ場所・同じ設定で以下を控えると、相談先にも経過が伝わります。
        </p>
        <div className="reset-checklist">
          <p>ゲーム／GPU／ドライバー版：</p>
          <p>症状が始まった更新・場面：</p>
          <p>実行した操作：Windows・NVIDIA・AMD・ゲーム内</p>
          <p>構築完了の表示：あり・なし・不明</p>
          <p>初回と次回の同じ場面：改善・変化なし・悪化</p>
          <p>エラー文／使用中で削除できなかったファイル：</p>
        </div>
        <p className="reset-small">
          本記事は2026年9月27日に公式資料を照合して編集しました。上のメモは読者が実測を残すためのもので、編集部によるゲーム実機テストの結果ではありません。
        </p>
      </section>
    </div>
  );
}
