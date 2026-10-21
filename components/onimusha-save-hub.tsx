/* oxlint-disable next/no-html-link-for-pages -- Native links preserve existing navigation. */

export function OnimushaSaveHub() {
  return (
    <section className="guide-section" id="save-method">
      <h2>鬼武者 Way of the Swordのセーブ方法・保存と同期の確認</h2>
      <p>
        ゲーム内セーブは破魔鏡が確認先です（ゲームエイトの攻略情報）。
        PC版の操作キー・オートセーブの発生条件は未検証です。
        ファイルのバックアップやSteamクラウドの同期は、ゲーム内で進行を保存する操作とは別です。
      </p>
      <nav className="symptom-nav" aria-label="セーブ・症状別の確認先">
        <strong>知りたいことから選ぶ</strong>
        <div>
        <a href="#save-in-game">ゲーム内のセーブ方法を知りたい</a>
        <a href="/guide/save-data-backup">保存場所の確認・バックアップ手順（PCゲーム共通）</a>
        <a href="/guide/steam-cloud-sync-error">同期エラー・競合／進行が戻ったときの確認（Steam共通）</a>
        <a href="#article-links-title">起動しない・クラッシュ・低FPSなど、ほかの症状から探す</a>
      </div>
      </nav>
      <h3 id="save-in-game">ゲーム内のセーブ方法</h3>
      <p>
        破魔鏡に近づき、自分の画面に表示される操作案内を確認してください。
        触れただけで保存済みと判断せず、保存処理が終わるまでゲームを終了しないでください。
        保存先や上書き確認が出た場合は、残したい進行を上書きしないよう内容を確かめます。
      </p>
      <p className="article-meta">
        攻略情報の確認：2026年10月21日。
        <a href="https://game8.jp/onimusha-ws/813817" target="_blank" rel="noreferrer">ゲームエイトの画像付き攻略（先の展開の記載あり）</a>
        で破魔鏡のセーブ機能を確認。当サイトの実機プレイ検証ではありません。
      </p>
      <div className="faq-section" id="save-faq">
        <h3>セーブのよくある質問</h3>
        <details>
          <summary>PC版のセーブデータはどこにありますか？</summary>
          <p>今回確認した公式ストアとカプコンのトラブルシューティングでは、保存パスを確認できませんでした。他作品のパスを流用せず、対象フォルダーを確認できるまで削除・移動を避けてください。確認後のコピーと照合は、上のバックアップ記事で案内しています。</p>
        </details>
        <details>
          <summary>Steamクラウド対応なら、バックアップは不要ですか？</summary>
          <p>Steam公式ストアにはSteamクラウド対応の表記があります（2026年10月21日確認）。ただし、対応表記だけでは自分のPCの同期完了や復元できる進行は確認できません。変更前の状態は別の場所にもコピーし、競合が出たら日時だけで選ばず、上の同期エラー記事で保全と照合を確認してください。</p>
        </details>
      </div>
      <p className="article-meta">
        公式確認先：<a href="https://store.steampowered.com/app/2638890/?l=japanese" target="_blank" rel="noreferrer">Steamストア</a>
        ／<a href="https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/" target="_blank" rel="noreferrer">カプコン公式トラブルシューティング</a>。
        共通記事への案内は、本作での復元成功を保証するものではありません。
      </p>
    </section>
  );
}
