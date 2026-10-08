/* oxlint-disable next/no-html-link-for-pages -- Native links preserve the existing navigation behavior. */

const walkthrough = 'https://game8.jp/onimusha-ws/813817';

export function OnimushaSaveAnswer({ english = false }: { english?: boolean }) {
  return (
    <section className="guide-section" id="save-method">
      <h2>
        {english
          ? 'How to save your progress'
          : '鬼武者 Way of the Swordのセーブ方法'}
      </h2>
      <p>
        {english
          ? 'Save your progress at a Spirit Mirror. Game8’s illustrated walkthrough shows the mirror beside Okuni at the start of the Kiyomizu-dera chapter and identifies it as a place to save. This concerns Onimusha: Way of the Sword, not the earlier Onimusha games.'
          : 'ゲームの進行状況は「破魔鏡」でセーブします。ゲームエイトの画像付き攻略では、「清水寺鬼舞台」の開始地点にいる出雲阿国の隣の破魔鏡と、そこでセーブできることが確認できます。旧作『鬼武者』ではなく『Way of the Sword』の案内です。'}
      </p>
      <p>
        {english
          ? 'We have not verified PC-specific buttons or automatic-save timing. Use the controls shown on your own screen rather than assuming that touching the mirror alone saved your progress.'
          : 'PC版の操作キーやオートセーブの発生条件は未検証です。「触れただけで保存済み」とは判断せず、自分の画面に表示される操作案内で確認してください。'}
      </p>
      <ol>
        <li>{english ? 'Find a Spirit Mirror in the area.' : 'エリア内の破魔鏡を探す。'}</li>
        <li>{english ? 'Approach it and use the controls shown on your own screen.' : '近づいて、自分の画面に出る操作案内で開く。'}</li>
        <li>{english ? 'Check which save will be overwritten before confirming.' : '上書きする保存先を確認してから確定する。'}</li>
        <li>{english ? 'Wait until saving finishes before closing the game.' : '保存処理が終わるまで待ってからゲームを終了する。'}</li>
      </ol>
      <p>
        {english
          ? 'Saving in the game and copying PC save files as a backup are different tasks. A file backup is a precaution before changing settings or files; it is not a substitute for saving your current progress in the game.'
          : 'ゲーム内で進行状況を保存する操作と、PCのセーブファイルを別の場所へコピーするバックアップは別です。ファイルのバックアップは設定やデータを変更する前の保全であり、ゲーム内セーブの代わりにはなりません。'}
      </p>
      <p className="article-meta">
        {english
          ? 'Source checked October 8, 2026: '
          : '出典確認：2026年10月8日。'}
        <a href={walkthrough} target="_blank" rel="noreferrer">
          {english
            ? 'Game8’s illustrated walkthrough (Japanese; story spoilers)'
            : 'ゲームエイトの画像付き攻略（先の展開の記載あり）'}
        </a>
        {english
          ? '. Source review, not our own gameplay test.'
          : '。当サイトの実機プレイ検証ではありません。'}
      </p>
    </section>
  );
}
