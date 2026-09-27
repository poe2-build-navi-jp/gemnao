/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function VerifySteamBeforeSteps() {
  return (
    <div className="reset-config-details verify-steam-details">
      <section className="diagnosis-table" id="verify-what">
        <h2>整合性確認で分かること・分からないこと</h2>
        <p>
          Steamがインストールした
          <strong>ゲームファイルを照合し、必要なら修復</strong>
          する機能です。検証の数字だけを見ず、
          <strong>ダウンロードが終わった後に同じ症状が変わったか</strong>
          で判断します。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">検証で扱うもの</th>
              <th scope="col">ここまでは分からないもの</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="照合対象">
                Steamから配信されたゲーム本体の不足・変更
              </td>
              <td data-label="対象外の判断">
                別に追加したMODやゲームの外の設定・セーブが正常かどうか
              </td>
            </tr>
            <tr>
              <td data-label="照合対象">
                不足・不整合があれば再取得や修復が行われる場合がある
              </td>
              <td data-label="対象外の判断">
                再取得の件数だけから、原因、ストレージの故障、ゲームが直ったかは確定できない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          操作はSteam「ライブラリ」→対象ゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」。
          <a
            href="https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steam公式の操作案内
          </a>
        </p>
      </section>

      <section className="diagnosis-table" id="verify-outcomes">
        <h2>結果別の早見表：ダウンロード完了後に判定</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">表示と起動結果</th>
              <th scope="col">どう読むか</th>
              <th scope="col">次の一手</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">ファイルを再取得 → 同じ場面で直った</td>
              <td data-label="読み方">
                配布ファイルの修復が改善に関与した可能性
              </td>
              <td data-label="次の一手">
                変更履歴を残し、MODを使うなら1件ずつ戻して再発するか比べる
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                再取得 → ダウンロードは終わったが症状は同じ
              </td>
              <td data-label="読み方">修復だけでは原因を除けていない</td>
              <td data-label="次の一手">
                起動時のエラー文、
                <a href="/guide/remove-mods-safely">MODの残存</a>
                、ゲームの設定などを確認
              </td>
            </tr>
            <tr>
              <td data-label="結果">再取得なし／すべて検証済み → 症状は同じ</td>
              <td data-label="読み方">
                照合した配布ファイル以外の原因を優先して調べる
              </td>
              <td data-label="次の一手">
                <a href="/guide/steam-game-not-launching">
                  起動しない症状別の確認
                </a>
                、クラッシュなら
                <a href="/guide/pc-game-crash">障害履歴の確認</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">再起動や翌日にも同じように再取得</td>
              <td data-label="読み方">
                更新・MOD再適用・書き込み失敗などの時刻と照合が必要
              </td>
              <td data-label="次の一手">
                <a href="#verify-repeat">再発の切り分け</a>
                で変更の直前とSteamの更新履歴を突き合わせる
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                検証後にダウンロード待機・書き込みエラー
              </td>
              <td data-label="読み方">
                再取得が終わっていない。起動結果の比較はまだできない
              </td>
              <td data-label="次の一手">
                Steamの「ダウンロード」を確認し、
                <a href="/guide/steam-disk-write-error">
                  保存先ドライブと空き領域
                </a>
                へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">ワークショップのアイテムがダウンロード</td>
              <td data-label="読み方">
                購読中なら検証を機に取得される場合がある
              </td>
              <td data-label="次の一手">
                Steamのワークショップ購読一覧とゲーム内の有効状態を確認。MODなしで試すなら
                <a href="/guide/remove-mods-safely">外す手順</a>へ
              </td>
            </tr>
          </tbody>
        </table>
        <p className="reset-small">
          「何件なら正常」「毎回1件なら故障」といった共通の閾値は置けません。Steamの更新やゲームの構成も合わせて見ます。
        </p>
      </section>

      <section className="diagnosis-table" id="verify-mods">
        <h2>MOD・ワークショップ・セーブへの影響</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">導入・保存方法</th>
              <th scope="col">検証前に残すもの</th>
              <th scope="col">検証後に確かめること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="種類">Steam配布ファイルを上書きするMOD</td>
              <td data-label="事前に残すもの">
                元のMODの導入元・対応版・再導入手順
              </td>
              <td data-label="検証後">
                配布ファイルへの改変が元に戻った可能性。起動確認後に必要なものだけ再導入
              </td>
            </tr>
            <tr>
              <td data-label="種類">手動で追加したファイル・管理ツール</td>
              <td data-label="事前に残すもの">
                追加ファイルの場所、有効MODとプロファイルの一覧
              </td>
              <td data-label="検証後">
                追加分が残存していないか導入記録で確認。「整合性確認済み＝MODを全削除」ではない
              </td>
            </tr>
            <tr>
              <td data-label="種類">Steamワークショップ</td>
              <td data-label="事前に残すもの">購読中アイテムと有効状態</td>
              <td data-label="検証後">
                「ダウンロード」に項目が出る場合がある。購読中なら更新完了とゲーム内の有効状態を確認
              </td>
            </tr>
            <tr>
              <td data-label="種類">セーブ・ゲーム別設定</td>
              <td data-label="事前に残すもの">
                <a href="/guide/save-data-backup">
                  ゲーム別の保存先を調べ、セーブをコピー
                </a>
              </td>
              <td data-label="検証後">
                配布ファイルの検証だけで既存セーブの正常性は証明できない。MOD依存のセーブは上書きしない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <a
            href="https://partner.steamgames.com/doc/features/workshop/implementation?l=japanese"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steamworksのワークショップ資料
          </a>
          は、整合性確認によって購読中アイテムのダウンロードが起こり得ると説明しています。
        </p>
      </section>
    </div>
  );
}

export function VerifySteamAfterSteps() {
  return (
    <div className="reset-config-details verify-steam-details">
      <section className="diagnosis-table" id="verify-repeat">
        <h2>翌日また再発したら：直前に変わったものを見る</h2>
        <ol>
          <li>
            <strong>Steam更新の後に再発：</strong>
            「ダウンロード」で対象ゲームの更新・ワークショップの更新があったかを確認。更新日時とエラーが戻った時刻を記録し、ゲームの更新情報とMODの対応状況を調べます。
          </li>
          <li>
            <strong>MODを戻すと再発：</strong>
            起動前の状態と、最後に有効化したMOD名・読み込み順を記録。セーブを保全したうえで
            <a href="/guide/remove-mods-safely">導入方法ごとに外して</a>
            、タイトル画面で比較します。
          </li>
          <li>
            <strong>ダウンロード失敗・書き込みエラーも出る：</strong>
            「プロパティ」→「インストール済みファイル」→「参照」で開くゲーム保存先のドライブを確認し、
            <a href="/guide/steam-disk-write-error">
              そのドライブの空きとエラー
            </a>
            を調べます。セキュリティソフトの履歴にゲームファイルの隔離があれば、対象・時刻・理由を記録してから配布元の案内を確認します。
          </li>
        </ol>
        <p>
          毎回再取得の表示が出ても、ゲームは正常に起動している場合は、件数だけを根拠にドライブを交換・フォルダーを削除しないでください。ゲームの再現症状やエラーがあるかを合わせて判断します。
        </p>
      </section>

      <section className="diagnosis-table" id="verify-record">
        <h2>相談するときに伝える確認メモ</h2>
        <p>
          ゲーム名と保存先ドライブ／症状が出る場面／整合性確認の日時と再取得表示／Steam「ダウンロード」が完了したか／MOD・ワークショップの有無／再起動・更新・MOD再適用のどの直後に再発したか。これをゲームの公式サポートへ渡せば、配布ファイル以外も含めて確認できます。
        </p>
      </section>
    </div>
  );
}
