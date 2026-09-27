/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function LowFpsBeforeSteps() {
  return (
    <div className="reset-config-details low-fps-details">
      <section className="diagnosis-table" id="fps-measure">
        <h2>最初に測る：FPS、上限、GPUの「3D」、CPU</h2>
        <p>
          FPS（1秒に描画する画面の枚数）が低いと感じたら、ゲーム中の同じ場所を
          <strong>同じセーブ・同じ移動ルートで約30秒</strong>
          プレイして、表示FPSのおおよその範囲を控えます。固定された60fpsが目標未満なのか、場面によって40～80fpsに動くのかで確認先が変わります。
        </p>
        <ol>
          <li>
            ゲーム内の「映像」などにFPS表示があれば有効化します。Steam版はSteamの「設定」→「ゲーム中」でパフォーマンスモニターと表示レベルを設定できます。表示できないゲームでは、ゲームが提供するベンチマーク結果も使えます。
            <a
              href="https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767"
              target="_blank"
              rel="noopener noreferrer"
            >
              Steam公式の説明
            </a>
          </li>
          <li>
            ゲーム内の
            <strong>FPS上限、V-Sync、フレーム生成、レンダリング解像度</strong>
            の現在値を記録します。ロビーとプレイ中で上限が異なるゲームもあるので、実際に困るプレイ場面で見ます。
          </li>
          <li>
            <strong>Ctrl＋Shift＋Esc</strong>
            →「パフォーマンス」→「GPU」で、ゲームが使うGPUの名前と「3D」グラフを確認します。「ビデオ
            デコード」など別のエンジンの負荷と混同しません。複数GPUなら「プロセス」のゲーム名を見つけ、「GPUエンジン」列の番号を確認します。
          </li>
          <li>
            同じタスクマネージャーの「パフォーマンス」→「CPU」で使用率を確認します。CPUグラフを右クリック→「グラフの変更」→「論理プロセッサ」にすると個別の推移が見られます。ゲームからタスクマネージャーへ切り替えると負荷が変わるため、正確な同時測定ではなく傾向として扱います。
          </li>
        </ol>
        <p>
          計測中は解像度、画面モード、録画の有無、ノートPCのAC接続状態をそろえます。Steamのモニターでフレーム生成ありのFPSとベースFPSが区別される場合はベース側も控え、前後で同じ指標を比べます。
        </p>
      </section>

      <section className="diagnosis-table" id="fps-branches">
        <h2>原因別の分岐：まず何を変える？</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">同じ場面で見た結果</th>
              <th scope="col">考えられる制約</th>
              <th scope="col">次の操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">
                ほぼ常に60fpsで、設定上限も60。GPUの3D負荷は低め
              </td>
              <td data-label="候補">FPS上限、V-Sync、表示条件</td>
              <td data-label="次の操作">
                <a href="#fps-limit">上限とモニターのHzを確認</a>
                。画質を一括で下げない
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                FPSが設定上限に届かず、使用中GPUの3D負荷が高い
              </td>
              <td data-label="候補">
                GPUの描画負荷。高い使用率だけでは異常とは限らない
              </td>
              <td data-label="次の操作">
                <a href="#fps-compare">レンダリング解像度だけ変更</a>
                し、FPSが上がるか確認
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                上限には届かずGPUに余裕があり、解像度を下げてもFPSがほぼ変わらない
              </td>
              <td data-label="候補">CPU側の処理、誤ったGPU、電源制限など</td>
              <td data-label="次の操作">
                <a href="#fps-next">CPUの論理プロセッサ・使用GPU・電源</a>
                を分けて確認
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                普段は高FPSだが特定の瞬間だけ画面全体が止まる
              </td>
              <td data-label="候補">
                読み込みやシェーダー構築など。一時的な描画待ち
              </td>
              <td data-label="次の操作">
                <a href="/guide/stutter-fix">一瞬カクつく時の確認手順</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">GPUが2台あり、ゲームが内蔵GPU側で動作</td>
              <td data-label="候補">使用GPUの選択</td>
              <td data-label="次の操作">
                <a href="/guide/low-gpu-usage">
                  Windowsで対象ゲームのGPUを確認
                </a>
                して再比較
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>CPU全体35%でもCPU側が詰まることはあります。</strong>
          一部の処理だけが重いと平均値に現れにくいためです。GPU側・CPU側という判断は数値一つで確定せず、設定を一つ変えた時のFPSの変化と一緒に読みます。
          <a
            href="https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft DirectXの解説
          </a>
        </p>
      </section>
    </div>
  );
}

export function LowFpsAfterSteps() {
  return (
    <div className="reset-config-details low-fps-details">
      <section className="diagnosis-table" id="fps-limit">
        <h2>① 設定上限に達していたら、上限とV-Syncを確認</h2>
        <ol>
          <li>
            ゲーム内「設定」→「映像」「ディスプレイ」などで
            <strong>フレームレート上限・最大FPS・V-Sync</strong>
            を確認します。60fps固定なら、モニターのHzと現在のFPS目標も確認。目標が60fpsなら変更しなくて構いません。
          </li>
          <li>
            60fpsより高いFPSを試したい場合、ゲーム内で上限を次の選択肢へ上げ、同じプレイ場面で再測定します。V-Syncや別の上限もある時は一度に切り替えず、元の状態を控えて一項目ずつ比べます。上限を変えてもFPSが上がらなければ性能側の調査に移ります。
          </li>
          <li>
            ゲーム内に上限項目がない時だけドライバーも確認します。NVIDIAは「NVIDIA
            コントロール
            パネル」→「3D設定の管理」→「プログラム設定」→対象ゲームの「最大フレームレート」。AMDのFRTCがある環境ではAMD
            Softwareの「ゲーム／グラフィックス」→「詳細設定」。FRTCは主に全画面向けで、項目の有無は環境で異なります。
            <a
              href="https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              NVIDIA公式
            </a>
            ／
            <a
              href="https://www.amd.com/en/products/software/adrenalin/frtc.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              AMD公式
            </a>
          </li>
        </ol>
        <p>
          上限をむやみに無制限にする必要はありません。熱、消費電力、操作感も確認し、求めるFPSが安定して出る値を選びます。
        </p>
      </section>

      <section className="diagnosis-table" id="fps-compare">
        <h2>② レンダリング解像度だけ変えて同じ場面を比較</h2>
        <p>
          上限が原因ではなさそうなら、ゲームの「設定」→「グラフィック」「映像」で
          <strong>レンダリング解像度／解像度スケール</strong>
          を例として100%から80%へ下げます。項目がなければ画面解像度を1段階だけ下げます。アップスケーラー・レイトレーシング・影・フレーム生成はまだ変えません。
        </p>
        <p>
          設定を適用し、ゲームの指示に従って必要なら再起動。同じセーブ・同じルートを約30秒プレイし、FPSの範囲と使用中GPUの3D負荷を記録します。2回目以降の結果も見て初回ロードの影響を分け、最後に元の解像度へ戻します。
        </p>
        <h3>
          読み方の例（すべて説明用の仮の数値で、実機検証結果ではありません）
        </h3>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">同じ場面での条件</th>
              <th scope="col">100%時</th>
              <th scope="col">80%時</th>
              <th scope="col">次の判断</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="条件">上限60fps、V-Syncは固定</td>
              <td data-label="100%">約60fps／GPU 3D 55%</td>
              <td data-label="80%">約60fps／GPU 3D 44%</td>
              <td data-label="判断">
                上限に達している。画質を下げても表示FPSは上がらない
              </td>
            </tr>
            <tr>
              <td data-label="条件">上限120fps、GPU負荷が高い</td>
              <td data-label="100%">約46fps／GPU 3D 97%</td>
              <td data-label="80%">約61fps／GPU 3D 94%</td>
              <td data-label="判断">
                GPUの描画負荷が制約の候補。元に戻して影・RTなどを個別に調整
              </td>
            </tr>
            <tr>
              <td data-label="条件">上限120fps、GPUに余裕</td>
              <td data-label="100%">約52fps／GPU 3D 48%</td>
              <td data-label="80%">約53fps／GPU 3D 32%</td>
              <td data-label="判断">
                上限以外のCPU側・使用GPU・電源条件を調べる
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          「GPU 3D 97%」も「CPU
          35%」も単独では原因の証拠になりません。別のGPUを測っていないか、録画・動画再生のGPU負荷ではないか確認し、
          <strong>FPSがどう変化したか</strong>を主な手掛かりにします。
        </p>
      </section>

      <section className="diagnosis-table" id="fps-next">
        <h2>③ 比較結果に合う設定だけ試す</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">結果</th>
              <th scope="col">確認する場所と一手</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">上限を上げたらFPSが伸びた</td>
              <td data-label="一手">
                目標FPSとモニターのHz、V-Syncを踏まえて上限を調整。極端な無制限は避ける
              </td>
            </tr>
            <tr>
              <td data-label="結果">レンダリング解像度を下げたらFPSが伸びた</td>
              <td data-label="一手">
                元の解像度に戻し、ゲーム内のレイトレーシングをオフ、次に影を1段階下げて別々に比較。対応ゲームではDLSS／FSR／XeSSの「品質」を個別に試す
              </td>
            </tr>
            <tr>
              <td data-label="結果">解像度を下げてもFPSが伸びず、GPUに余裕</td>
              <td data-label="一手">
                CPUの「論理プロセッサ」グラフ、録画・更新アプリを確認。ゲームに「表示距離」「NPC密度」等があれば1項目だけ変更。
                <a href="/guide/low-gpu-usage">内蔵GPU・電源の確認</a>も行う
              </td>
            </tr>
            <tr>
              <td data-label="結果">FPSは高いが瞬間的に画面が止まる</td>
              <td data-label="一手">
                <a href="/guide/stutter-fix">一瞬カクつく場合</a>
                を参照。初回シェーダー構築や読み込みを確認し、平均FPSだけを追わない
              </td>
            </tr>
            <tr>
              <td data-label="結果">VRAM不足警告・テクスチャの遅れもある</td>
              <td data-label="一手">
                <a href="/guide/vram-shortage">専用・共有GPUメモリの見方</a>
                を参照。テクスチャはVRAM対策として比較し、FPS向上を決め付けない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          測定メモには「セーブ・場面／FPS上限／100%時のFPSとGPU
          3D／変更項目／変更後のFPSとGPU
          3D」を残します。改善しない設定は元に戻し、CPU・GPU・ドライバー設定をまとめて変更しないでください。
        </p>
      </section>
    </div>
  );
}
