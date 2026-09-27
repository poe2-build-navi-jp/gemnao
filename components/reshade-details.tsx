/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */
export function ReShadeBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="reshade-route">
        <h2>導入方法で解除手順を選ぶ</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">導入した方法</th>
              <th scope="col">使う解除方法</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="導入方法">ReShadeのセットアップ</td>
              <td data-label="解除方法">
                同じゲーム.exeを選び、アンインストールを実行
              </td>
            </tr>
            <tr>
              <td data-label="導入方法">MOD管理ツール・配布パック</td>
              <td data-label="解除方法">
                管理ツール・パックの解除手順。ファイルの自動再配置にも注意
              </td>
            </tr>
            <tr>
              <td data-label="導入方法">DLLを手動コピー（Direct3D／OpenGL）</td>
              <td data-label="解除方法">
                ReShade製DLLを特定して退避。下の表で識別
              </td>
            </tr>
            <tr>
              <td data-label="導入方法">Vulkan／OpenXR</td>
              <td data-label="解除方法">
                公式セットアップを使う。共有レイヤーの手動削除は行わない
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="diagnosis-table" id="reshade-files">
        <h2>どのファイルを外す？ 名前と役割の早見表</h2>
        <p>
          対象は<strong>ReShadeを導入したゲーム側のファイル</strong>
          です。WindowsのSystem32・SysWOW64は操作しません。
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">名前の例</th>
              <th scope="col">役割・見分け方</th>
              <th scope="col">扱い</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="名前">
                <code>dxgi.dll</code>／<code>d3d9.dll</code>／
                <code>d3d11.dll</code>／<code>opengl32.dll</code>
              </td>
              <td data-label="役割">
                通常導入のReShade本体の例。同名でも別のツールやゲームのファイルの場合がある
              </td>
              <td data-label="扱い">ReShade製と確認できたものだけ退避</td>
            </tr>
            <tr>
              <td data-label="名前">
                <code>ReShade.ini</code>
              </td>
              <td data-label="役割">
                ReShadeの設定。プリセットやシェーダーの保存先も手がかりになる
              </td>
              <td data-label="扱い">
                解除前にコピー。単独で退避しても本体解除にはならない
              </td>
            </tr>
            <tr>
              <td data-label="名前">
                <code>ReShadePreset.ini</code>／自分で付けた名前の
                <code>.ini</code>
              </td>
              <td data-label="役割">
                色味・エフェクトのプリセット。ゲームの設定.iniとは別
              </td>
              <td data-label="扱い">再利用したいものは保存しておく</td>
            </tr>
            <tr>
              <td data-label="名前">
                <code>reshade-shaders</code>／<code>ReShade.log</code>
              </td>
              <td data-label="役割">
                シェーダー・素材／動作ログ。保存先を変更している場合もある
              </td>
              <td data-label="扱い">
                必要な素材・調査用ログを先に保全。これだけ消しても本体が残る場合がある
              </td>
            </tr>
          </tbody>
        </table>
        <h3>DLLを見分ける3つの確認</h3>
        <ol>
          <li>
            候補を右クリック→「プロパティ」→「詳細」で製品名・説明を確認する。
          </li>
          <li>
            <strong>ReShade</strong>
            の表記と、導入時に選んだ.exeの場所・追加ファイルの記録を照合する。
          </li>
          <li>
            判別できなければ手動操作を止め、セットアップで既存導入を検出できるか確認する。
          </li>
        </ol>
        <p className="reset-small">
          公式セットアップも製品名でReShadeを識別します。ファイル名・更新日時だけでの判定は避けます。旧版や特殊な導入では名前が異なることがあります。
        </p>
      </section>
    </div>
  );
}
export function ReShadeAfterSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="reshade-still-loaded">
        <h2>外せない・まだ表示される場合</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">状況</th>
              <th scope="col">次に確認すること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状況">アンインストールの選択肢が出ない</td>
              <td data-label="確認">
                選択した.exeと描画APIが導入時と同じか。ランチャーとゲーム本体、別ストア・別インストール先を取り違えていないか
              </td>
            </tr>
            <tr>
              <td data-label="状況">ReShadeではないDLLがあると表示される</td>
              <td data-label="確認">
                上書きせず中止。DXVKなど別ツールの導入記録を確認
              </td>
            </tr>
            <tr>
              <td data-label="状況">解除後もReShadeが起動する</td>
              <td data-label="確認">
                別フォルダーの.exe、MOD管理ツールの再配置、Vulkan／OpenXRでの導入を確認
              </td>
            </tr>
            <tr>
              <td data-label="状況">使用中で移動できない</td>
              <td data-label="確認">
                ゲームと関連ランチャーを終了。終了できていなければPCを再起動し、ゲームを開く前に解除
              </td>
            </tr>
            <tr>
              <td data-label="状況">表示は消えたがクラッシュは続く</td>
              <td data-label="確認">
                <a href="/guide/remove-mods-safely">ほかのMOD</a>
                ・オーバーレイを個別に切り分ける
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="reshade-restore">
        <h2>元に戻したい場合</h2>
        <p>
          <strong>手動退避した場合：</strong>
          ゲームを終了し、同名の新しいファイルがないか確認してから、退避したReShadeファイルを元のフォルダーへ戻します。同名のファイルがあれば上書きせず、所有元を確かめます。
        </p>
        <p>
          <strong>セットアップで解除した場合：</strong>
          公式配布元から再導入し、同じ.exeと描画APIを選びます。必要なシェーダーを入れてから、保存したプリセットをReShade内で選び直します。Vulkan・OpenXRはDLLをコピーするだけでは元に戻せません。
        </p>
      </section>
      <section className="reset-checklist" id="reshade-record">
        <h2>相談・共有用：解除後の確認メモ</h2>
        <p>「消したのに直らない」を切り分けるため、次の4点を残します。</p>
        <ul>
          <li>導入方法：セットアップ／MOD管理／手動、描画API</li>
          <li>対象：選んだゲーム.exeとReShade製と確認したファイル</li>
          <li>解除後：ReShadeの表示と元の症状がそれぞれどう変わったか</li>
          <li>再起動後：ファイルやReShadeが戻っていないか</li>
        </ul>
        <p className="reset-small">
          公開するパスではWindowsユーザー名を伏せてください。編集部によるゲーム実機検証ではなく、ReShade
          6.8.0の公式ソースと開発者の説明を確認して整理しています。
        </p>
      </section>
    </div>
  );
}
