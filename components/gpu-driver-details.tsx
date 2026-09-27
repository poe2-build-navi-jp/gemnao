/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function GpuDriverBeforeSteps() {
  return (
    <div className="reset-config-details gpu-driver-details">
      <section className="diagnosis-table" id="gpu-prepare">
        <h2>更新前に残す：GPU名・版・症状の3点</h2>
        <p>
          画面が映っていて操作できるWindows
          11の手順です。今の版を残すと、更新しても直らなかった場合に比較できます。PC全体が映らない場合は
          <a href="/guide/black-screen">黒い画面の切り分け</a>
          を先に確認してください。
        </p>
        <ol>
          <li>
            「スタート」を右クリック→「デバイス マネージャー」→「ディスプレイ
            アダプター」。表示された製品名を控えます。CPUがIntelでもゲームの表示にNVIDIAやAMDを使うPCがあります。
          </li>
          <li>
            対象のGPUを右クリック→「プロパティ」→「ドライバー」で版と日付を控えます。「タスク
            マネージャー」→「パフォーマンス」→「GPU」でも、GPU 0・GPU
            1それぞれの製品名を確認できます。複数ある場合は両方記録してください。
          </li>
          <li>
            PCメーカー・型番、ゲーム名、起動直後か特定の場面か、現在の画質設定を記録します。インストーラーが再起動を求めることがあるため、ほかの作業も保存します。
          </li>
        </ol>
        <p>
          ノートPC・携帯型PCでは製品メーカーが独自に調整したドライバーを配布することがあります。まず製品メーカーの型番別サポートを確認し、対応する版がある場合はその案内で更新します。自作PCやメーカーからGPUメーカー版を案内されている場合は、下の操作から対象を選んでください。
        </p>
      </section>

      <section className="diagnosis-table" id="gpu-vendors">
        <h2>メーカー別：どの画面から更新する？</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">GPU</th>
              <th scope="col">更新画面</th>
              <th scope="col">更新前に確認すること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="GPU">NVIDIA GeForce</td>
              <td data-label="画面">
                NVIDIAアプリ→「ドライバー」→「ダウンロード」→「インストール」
              </td>
              <td data-label="確認">
                画面上部のGame Ready／Studioの種類、版、対応ゲームの説明
              </td>
            </tr>
            <tr>
              <td data-label="GPU">AMD Radeon</td>
              <td data-label="画面">
                AMD Softwareで「System」を検索→「System Settings」→「Manage
                Updates」
              </td>
              <td data-label="確認">
                Software and Driversの現在の版、提供中の版、Factory
                Resetが選ばれていないか
              </td>
            </tr>
            <tr>
              <td data-label="GPU">Intel Graphics・Arc</td>
              <td data-label="画面">
                Intel Driver &amp; Support
                Assistant（DSA）の検出結果→該当するグラフィック更新
              </td>
              <td data-label="確認">
                GPU名とPCメーカーの対応版、検出された更新がグラフィック用か
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          インストール済みのアプリやドライバー構成により画面が異なる場合があります。項目が見つからない時は、下の各社公式リンクから対応する案内を確認してください。
        </p>
      </section>

      <section id="gpu-nvidia">
        <h2>NVIDIA：NVIDIAアプリの「ドライバー」から</h2>
        <ol>
          <li>
            <a
              href="https://www.nvidia.com/ja-jp/software/nvidia-app/"
              target="_blank"
              rel="noreferrer"
            >
              NVIDIA公式アプリ
            </a>
            を開き、「ドライバー」を選びます。ゲーム主体ならGame
            Ready、制作用途が主体ならStudioなど、画面に表示された種類を確認します。今の種類も記録してください。
          </li>
          <li>
            表示された新しい版の説明を開き、GPU・Windows・困っているゲームへの対応を確認します。「ダウンロード」後、完了したら「インストール」を選び、画面の案内に従います。
          </li>
          <li>
            アプリを使わない場合は
            <a
              href="https://www.nvidia.com/ja-jp/drivers/"
              target="_blank"
              rel="noreferrer"
            >
              NVIDIA公式ドライバー検索
            </a>
            でGPUの製品名とOSを指定し、対象の版を選びます。ノートPCはメーカーの対応案内が先です。
          </li>
        </ol>
        <p>
          別の版や種類への切り替えを更新と同時に行うと比較しづらいため、どちらを入れたかを記録します。NVIDIAアプリが以前の版を表示している場合は、後述の復旧手順から再導入できます。
        </p>
      </section>

      <section id="gpu-amd">
        <h2>AMD：AMD Softwareの「システム設定」から</h2>
        <ol>
          <li>
            Windowsの検索からAMD Software: Adrenalin
            Editionを開きます。アプリ内検索欄に「System」と入力し、「System
            Settings」を開きます。
          </li>
          <li>
            「Software and Drivers」で現在の版を控え、「Manage
            Updates」を選びます。AMD Install Managerの「Available
            Software」に更新候補があれば、下向き矢印でダウンロードします。
          </li>
          <li>
            インストーラーが開いたら対象のGPUと版を確認し、提示された利用条件を読み、通常のインストールを進めます。表示が一時的にちらつくことがあります。
          </li>
        </ol>
        <p>
          <strong>「Factory Reset」は通常の更新では選ばないでください。</strong>
          AMDは既存のパッケージを削除し、以前のドライバーへ戻せなくなると説明しています。「Driver
          Only」でAMD Softwareの画面がない場合は、
          <a
            href="https://www.amd.com/ja/support/download/drivers.html"
            target="_blank"
            rel="noreferrer"
          >
            AMD公式のドライバー配布
          </a>
          かPCメーカーのサポートを使います。
        </p>
      </section>

      <section id="gpu-intel">
        <h2>Intel：Driver &amp; Support Assistantで対象を確認</h2>
        <ol>
          <li>
            PCメーカーの対応情報を見てから、必要であれば
            <a
              href="https://www.intel.com/content/www/us/en/support/detect.html"
              target="_blank"
              rel="noreferrer"
            >
              Intel公式のDriver &amp; Support Assistant
            </a>
            （DSA）を開き、案内に従って入手・起動します。
          </li>
          <li>
            検出結果の画面で、GPU名と現在の版を照合し、Intelのグラフィック用の更新だけを選びます。更新の候補がなければ、無理に別型番用のファイルを選びません。
          </li>
          <li>
            ダウンロードとインストールはDSAやインストーラーの画面に従います。Arcを含む製品の画面は導入済みのソフトウェアで異なるため、表示された更新対象の製品名を優先してください。
          </li>
        </ol>
        <p>
          Intel公式はPCメーカー版とDSAを更新方法として案内しています。ノートPCでメーカー専用の機能がある場合は、汎用版を上書きする前に製品メーカーの案内を確認してください。
        </p>
      </section>
    </div>
  );
}

export function GpuDriverAfterSteps() {
  return (
    <div className="reset-config-details gpu-driver-details">
      <section className="diagnosis-table" id="gpu-compare">
        <h2>更新後の確認：「版が変わった」と「症状が直った」を分ける</h2>
        <ol>
          <li>
            インストーラーの再起動が済んでいなければ、作業内容を保存してWindowsを一度再起動します。繰り返し再起動する必要はありません。
          </li>
          <li>
            更新前と同じデバイス
            マネージャーの「ドライバー」で対象GPUの版を記録します。版が変わっていない場合は、別GPUを確認していないか、インストーラーの結果画面を確認します。
          </li>
          <li>
            同じゲーム、セーブ、画質、解像度、場所で元の症状を確認します。クラッシュや画面乱れなら「同じ条件で再発したか」を記録。平均FPSだけで判断せず、初回のシェーダー構築は別に記録します。
          </li>
        </ol>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">結果</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">版が変わり、元の症状も改善</td>
              <td data-label="次の行動">
                再起動後も同じ場面で確認し、版と結果をメモして完了
              </td>
            </tr>
            <tr>
              <td data-label="結果">版は変わったが、症状は同じ</td>
              <td data-label="次の行動">
                次にゲームファイル、画質、VRAMなどを切り分ける。更新を繰り返さない
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                新たに黒画面・クラッシュ・描画異常が出た
              </td>
              <td data-label="次の行動">
                版と発生場面を記録し、下の復旧手順で以前の版に戻して比較する
              </td>
            </tr>
            <tr>
              <td data-label="結果">版が変わっていない／導入に失敗</td>
              <td data-label="次の行動">
                GPUの選択、PCメーカーの対応、インストーラーに表示されたエラーを確認
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="gpu-rollback">
        <h2>悪化したら：Windowsから以前の版へ戻す</h2>
        <ol>
          <li>
            新しい症状がいつ出たか、更新後のドライバー版とPC型番を記録します。
          </li>
          <li>
            Windowsの「スタート」を右クリック→「デバイス
            マネージャー」→「ディスプレイ
            アダプター」→更新したGPUを右クリック→「プロパティ」→「ドライバー」→「ドライバーを元に戻す」を選びます。管理者権限が必要な場合があります。
          </li>
          <li>
            画面の案内に従い、完了後にWindowsの再起動を求められたら実施します。同じGPUの版とゲームの症状をもう一度確認します。
          </li>
        </ol>
        <p>
          ボタンが押せない場合は、以前の版がWindowsに残っていない可能性があります。
          <strong>
            ボタンを有効化するために無関係なドライバーを削除しないでください。
          </strong>
          次の表から、実際に使用していた版が分かる経路を選びます。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">使っていた経路</th>
              <th scope="col">以前の版を探す場所</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="経路">NVIDIAアプリ</td>
              <td data-label="場所">
                「ドライバー」の以前インストールした版が残っていれば、該当版の「…」→「再インストール」。表示される版を記録と照合する
              </td>
            </tr>
            <tr>
              <td data-label="経路">ノートPC・携帯型PCのメーカー版</td>
              <td data-label="場所">
                PCメーカーの型番別サポートから、以前使っていた互換版を探す。提供がなければメーカーへ相談
              </td>
            </tr>
            <tr>
              <td data-label="経路">AMD／Intel／NVIDIAの公式配布</td>
              <td data-label="場所">
                製品名・OS・更新前の版が一致する以前の公式パッケージを探す。提供状況は製品ごとに違う
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          AMDで「Factory
          Reset」を実行していた場合は、Windowsのロールバックを利用できないことがあります。別の公式版を使う前に、PCメーカーの対応範囲と元の版を確かめてください。画面がまったく映らない場合は
          <a href="/guide/black-screen">黒画面の記事</a>を参照してください。
        </p>
      </section>

      <section id="gpu-record">
        <h2>更新前後を比べる記録メモ</h2>
        <p>
          数値を実測した結果ではなく、読者が埋めるためのテンプレートです。サポートに相談する際にも使えます。
        </p>
        <ul>
          <li>PCメーカー・型番／GPU名（複数ある場合はそれぞれ）：</li>
          <li>ゲーム名・版／元の症状と再現する場面：</li>
          <li>更新前のドライバー版と日付／更新した配布元：</li>
          <li>更新後の版／インストーラーの結果と再起動の有無：</li>
          <li>同じ場面での結果／新しく出た症状／戻した版：</li>
        </ul>
      </section>
    </div>
  );
}
