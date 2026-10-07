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
          ? 'Approach the mirror and follow the controls shown in your game. Check the selected save before confirming an overwrite, and wait for saving to finish before closing the game. We have not verified PC-specific buttons or automatic-save timing, so do not assume that touching the mirror alone saved your progress.'
          : '破魔鏡に近づき、ゲーム画面に表示される操作案内に従ってください。上書き前に保存先を確認し、保存処理が終わってからゲームを終了します。PC版の操作キーやオートセーブの発生条件は未検証のため、「触れただけで保存済み」とは判断しないでください。'}
      </p>
      <p className="article-meta">
        {english
          ? 'Source checked October 7, 2026: '
          : '出典確認：2026年10月7日。'}
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
