/* oxlint-disable next/no-html-link-for-pages -- Native links match the article template. */

export function DiscordMicVolumeDiagram() {
  return (
    <figure className="voice-direction-diagram" aria-labelledby="voice-direction-title">
      <figcaption id="voice-direction-title">
        <strong>説明図：小さいのは、送る声？ 聞く声？</strong>
        <span>音声の向きと確認先を整理した図です。実際の設定画面ではありません。</span>
      </figcaption>
      <div className="voice-direction-path">
        <strong>自分の声が小さいと言われる</strong>
        <p>自分のマイク → 自分の入力設定 → 相手が聞く音量</p>
        <ul>
          <li><a href="#cause-1">1人だけに小さい：聞く相手の個別音量を確認</a></li>
          <li><a href="#cause-2">全員に小さい：自分の録音とDiscordテストを比較</a></li>
        </ul>
      </div>
      <div className="voice-direction-path">
        <strong>自分が聞く相手の声が小さい</strong>
        <p>相手の声 → 自分が設定した個別音量・出力音量 → 自分のイヤホン</p>
        <a href="/discord/user-volume-low">相手の声が小さい記事で、聞く側の設定を確認 →</a>
      </div>
      <p className="source-policy">
        自分の入力音量を上げても、自分が聞く相手の声の音量は調整できません。
        以下の録音・通話の比較は読者が確認する手順です。編集部による実機の改善結果や音量の測定値ではありません。
      </p>
    </figure>
  );
}
