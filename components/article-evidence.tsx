import {
  articleEvidenceReviews,
  type ArticleEvidenceReview,
} from '@/lib/article-evidence-reviews';
type Evidence = {
  official: { text: string; label: string; url: string }[];
  scope: string;
  limits: string;
  reports: string;
  checks: string;
};

// Source review only: this date must never imply hands-on testing or a patch version.
const checkedOn = '2026-10-22';
const rocketLeague: Record<'ja' | 'en', Evidence> = {
  ja: {
    scope:
      'Windows PC・通常のDualSense・Epic Games Launcher版／Steam版。出典にゲームのビルド番号・対象パッチの指定なし。',
    official: [
      {
        text: 'Epicは機器ソフトウェアの更新確認、切断、PC再起動、USBまたはBluetoothでの再接続を案内しています。',
        label: 'Epic：DualSenseが動かない場合',
        url: 'https://www.epicgames.com/help/c-37599050/c-42869540/a15512450',
      },
      {
        text: 'SonyはWindowsでのUSB・Bluetooth接続を案内しています。機能の対応はゲームや接続方式によって異なります。',
        label: 'Sony：DualSenseのPC接続',
        url: 'https://www.playstation.com/en-us/support/hardware/pair-dualsense-controller-bluetooth/',
      },
    ],
    limits:
      '公式の対処案内であり、特定の不具合の修正完了や全環境での成功を確認したものではありません。編集部による実機再現・改善テストは行っていません。',
    reports:
      'この根拠欄には利用者の成功報告を採用していません。出典・環境・日時を照合できない報告から効果を判断しません。',
    checks:
      'PC側の入力→ゲームのメニュー→フリープレイの比較、実機1台での確認は編集部の切り分け手順です。2Pや二重入力の原因を断定せず、設定は1つずつ比較し、改善しなければ戻します。',
  },
  en: {
    scope:
      'Windows PC, standard DualSense, Epic Games Launcher or Steam. The sources specify no game build or patch version.',
    official: [
      {
        text: 'Epic advises checking controller software, disconnecting it, restarting the PC, then reconnecting by USB or Bluetooth.',
        label: 'Epic: DualSense not working',
        url: 'https://www.epicgames.com/help/c-37599050/c-42869540/a15512450',
      },
      {
        text: 'Sony documents USB and Bluetooth connections on Windows. Feature support depends on the game and connection.',
        label: 'Sony: connecting DualSense to a PC',
        url: 'https://www.playstation.com/en-us/support/hardware/pair-dualsense-controller-bluetooth/',
      },
    ],
    limits:
      'These are official troubleshooting instructions, not confirmation that a specific bug is fixed or that every setup will improve. We have not reproduced or tested this issue on our own hardware.',
    reports:
      'No player success reports are used in this evidence section. Reports without an attributable source, setup and date do not establish effectiveness.',
    checks:
      'Comparing PC input, the game menu and Free Play with one physical controller is our editorial diagnostic sequence. It does not establish the cause of player-two or duplicate input. Compare one setting at a time and revert changes that do not help.',
  },
};

export function ArticleEvidence({
  path,
  locale = 'ja',
}: {
  path: string;
  locale?: string;
}) {
  const review = locale === 'ja' ? articleEvidenceReviews[path] : undefined;
  if (review) return <ReviewedArticleEvidence review={review} />;
  if (
    path !== '/games/rocket-league/dualsense-not-working' ||
    (locale !== 'ja' && locale !== 'en')
  )
    return null;
  const evidence = rocketLeague[locale];
  const en = locale === 'en';
  return (
    <section
      className="sources article-evidence"
      aria-labelledby="article-evidence-title"
    >
      <h2 id="article-evidence-title">
        {en
          ? 'What this advice is based on'
          : 'この対処の根拠と確認できていないこと'}
      </h2>
      <p>
        {en ? 'Sources reviewed' : '出典の確認日'}：
        <time dateTime={checkedOn}>{checkedOn}</time>
      </p>
      <p>{evidence.scope}</p>
      <h3>{en ? 'Official guidance' : '公式に確認できる案内'}</h3>
      <ul>
        {evidence.official.map((item) => (
          <li key={item.url}>
            {item.text}{' '}
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.label} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{evidence.limits}</p>
      <h3>{en ? 'Attributed player reports' : '出典を確認できる利用者報告'}</h3>
      <p>{evidence.reports}</p>
      <h3>
        {en
          ? 'General checks; effectiveness unverified'
          : '一般的な切り分け・効果は未検証'}
      </h3>
      <p>{evidence.checks}</p>
    </section>
  );
}

function ReviewedArticleEvidence({
  review,
}: {
  review: ArticleEvidenceReview;
}) {
  return (
    <section
      className="sources article-evidence"
      id="article-evidence"
      aria-labelledby="article-evidence-title"
    >
      <h2 id="article-evidence-title">確認結果・未検証の範囲と根拠</h2>
      <h3>実際に記録されている結果</h3>
      <p>{review.result}</p>
      {review.reportPath ? (
        <p>
          <a href={review.reportPath}>既存の本人報告と記録の限界を読む</a>
        </p>
      ) : null}
      <h3>分かっていないこと</h3>
      <p>{review.limits}</p>
      <h3>自分の環境で比較する項目</h3>
      <p>{review.compare}</p>
      <h3>対象の版・環境</h3>
      <p>{review.scope}</p>
      <h3>公式説明が裏付ける範囲</h3>
      <ul>
        {review.official.map((source) => (
          <li key={source.url}>
            {source.text}{' '}
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.label} ↗
            </a>
          </li>
        ))}
      </ul>
      <p>{review.sourceReview}</p>
    </section>
  );
}
