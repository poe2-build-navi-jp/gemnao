/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function RemoveModsBeforeSteps() {
  return (
    <div className="reset-config-details remove-mods-details">
      <section className="diagnosis-table" id="mods-methods">
        <h2>まず導入経路を確認：外す場所が違う</h2>
        <p>
          1つのゲームで複数の導入方法を併用している場合は、各行を確認します。「無効化したのに残る」時は、別の経路で同じMODを入れていないか調べてください。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">導入方法</th>
              <th scope="col">外す場所・退避するもの</th>
              <th scope="col">外れたかの確認</th>
              <th scope="col">元に戻す方法</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="導入方法">Vortex・MO2などの管理ツール</td>
              <td data-label="外し方">
                有効一覧とプロファイルを保存。ツール内で無効化し、Vortexは配置を反映
              </td>
              <td data-label="残存確認">
                同じプロファイルの有効一覧と、Vortexなら反映状況を確認。手動導入分は別に照合
              </td>
              <td data-label="復元">
                同じツールで元のプロファイル・有効一覧に戻し、必要なら再配置
              </td>
            </tr>
            <tr>
              <td data-label="導入方法">ゲームフォルダーへ手動コピー</td>
              <td data-label="外し方">
                自分で追加したファイルだけ、元の相対パスを保ってゲーム外へ移動
              </td>
              <td data-label="残存確認">
                配布アーカイブと導入記録を元パスと突き合わせる。同名だけで判定しない
              </td>
              <td data-label="復元">
                退避したファイルを、記録した相対パスへ1件ずつ戻す
              </td>
            </tr>
            <tr>
              <td data-label="導入方法">Steamワークショップ</td>
              <td data-label="外し方">
                購読中のアイテム名とURLを記録し、対象を購読解除
              </td>
              <td data-label="残存確認">
                Steamの更新完了、購読状態、ゲーム内のMOD有効設定を確認
              </td>
              <td data-label="復元">
                保存したページから再購読し、更新完了後にゲーム内で有効化
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="diagnosis-table" id="mods-backup">
        <h2>最初にコピーするもの：セーブと導入記録</h2>
        <ol>
          <li>
            Steamのゲーム本体の場所は「ライブラリ」→対象ゲームの管理メニュー→「ローカルファイルを閲覧」から開けます。
            <strong>セーブは別の場所にあるゲームも多い</strong>
            ため、保存先はゲーム別の案内で確かめてからコピーします。
            <a href="/guide/save-data-backup">
              セーブデータの保存先とバックアップの手順
            </a>
          </li>
          <li>
            例：導入記録に<code>ゲームフォルダー/mods/ExampleMod/file.pak</code>
            、退避先に<code>退避_2026-09-27/mods/ExampleMod/file.pak</code>
            と同じ階層を残します。実際のファイル名・配置先はMODごとに異なります。コピー後にファイル数と名前を見比べてください。
          </li>
          <li>
            元のゲームファイルを上書きして導入した場合は、MODのファイルを外すだけでは元に戻りません。元ファイルの控えがあるか、Steamの整合性確認で修復できる対象かを先に確認してください。
          </li>
        </ol>
      </section>
    </div>
  );
}

export function RemoveModsAfterSteps() {
  return (
    <div className="reset-config-details remove-mods-details">
      <section className="diagnosis-table" id="mods-residue">
        <h2>外した後の残存確認：画面と元パスの両方を比べる</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">見つかった状態</th>
              <th scope="col">次にすること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状態">
                Vortexで無効なのにゲーム側のファイルが変わらない
              </td>
              <td data-label="次の行動">
                「Deploy
                Mods」で変更を反映。全部の管理対象を一時的に外すなら、設定の高度なモードで「Purge
                Mods」を選び、後で「Deploy
                Mods」で復元。手動導入分はそのまま残ります
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                MO2で無効だが、ゲームを直接起動すると結果が違う
              </td>
              <td data-label="次の行動">
                対象プロファイルと起動経路をそろえて再比較。仮想配置とは別に、手動でゲームフォルダーへ入れたファイルがないか調べる
              </td>
            </tr>
            <tr>
              <td data-label="状態">手動導入したファイルが元パスにある</td>
              <td data-label="次の行動">
                配布アーカイブ、導入日時、配置先を照合。自分が追加したと特定できるものだけ退避し、別MODと共有するフォルダーごとは動かさない
              </td>
            </tr>
            <tr>
              <td data-label="状態">購読解除したMODがまだ使われる</td>
              <td data-label="次の行動">
                Steamの更新完了とゲーム内のMOD画面を確認。同じMODの手動導入・管理ツール導入がないか記録と照合する
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <a
            href="https://github.com/Nexus-Mods/Vortex/wiki/MODDINGWIKI-Users-FAQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nexus ModsのVortex公式FAQ
          </a>
          は、無効化後の配置反映とPurge Modsからの復元を説明しています。Steamの
          <a
            href="https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB"
            target="_blank"
            rel="noopener noreferrer"
          >
            整合性確認
          </a>
          はゲーム本体の検証・修復に使い、追加MODの一括削除が終わった証拠とはしません。
        </p>
      </section>

      <section className="diagnosis-table" id="mods-restore">
        <h2>元に戻す時は、外した時と同じ入口から</h2>
        <ol>
          <li>
            <strong>管理ツール：</strong>
            保存した一覧とプロファイルを開き、必要なMODを1件有効化。Vortexは「Deploy
            Mods」で反映。MO2は該当プロファイルから起動して確認します。
          </li>
          <li>
            <strong>手動導入：</strong>
            退避フォルダーに残した相対パスをたどり、戻す先の同名ファイルが以前と同じか確認。異なるなら上書きせず、対応するゲーム版・導入手順を調べます。まず1件戻して起動を確認します。
          </li>
          <li>
            <strong>ワークショップ：</strong>
            控えたアイテムのページで再購読。Steamのダウンロード・更新を待ち、ゲーム内のMOD管理画面があれば有効化と読み込み順を確認して起動します。
          </li>
        </ol>
        <p>
          どの方法でも1件戻すたびタイトル画面まで確認します。特定のMODを戻した時だけ再発するなら、そのMODを外し、配布元の対応バージョンや依存MODを確認してください。MODを必要とする既存セーブは、本体だけでの検証中に開いて上書きしないでください。
        </p>
      </section>
    </div>
  );
}
