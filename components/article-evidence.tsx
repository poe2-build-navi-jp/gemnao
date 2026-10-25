import { localizedEvidenceReviews } from '@/lib/article-evidence-localized';
import { followupEvidenceReviews } from '@/lib/article-evidence-followup';
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
  const review = evidenceReview(path, locale);
  if (review)
    return <ReviewedArticleEvidence review={review} locale={locale} />;
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
  locale,
}: {
  review: ArticleEvidenceReview;
  locale: string;
}) {
  const t = evidenceLabels[locale] || evidenceLabels.ja;
  return (
    <section
      className="sources article-evidence"
      id="article-evidence"
      aria-labelledby="article-evidence-title"
    >
      <h2 id="article-evidence-title">{t.title}</h2>
      <h3>{t.result}</h3>
      <p>{review.result}</p>
      {review.reportPath ? (
        <p>
          <a href={review.reportPath}>{t.report}</a>
        </p>
      ) : null}
      <h3>{t.limits}</h3>
      <p>{review.limits}</p>
      <h3>{t.compare}</h3>
      <p>{review.compare}</p>
      <h3>{t.scope}</h3>
      <p>{review.scope}</p>
      <h3>{t.sources}</h3>
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

export function evidenceReview(path: string, locale = 'ja') {
  return locale === 'ja'
    ? articleEvidenceReviews[path] || followupEvidenceReviews[path]
    : localizedEvidenceReviews[`${locale}:${path}`];
}
export function ArticleEvidenceTocLink({
  path,
  locale = 'ja',
}: {
  path: string;
  locale?: string;
}) {
  return evidenceReview(path, locale) ? (
    <a href="#article-evidence">
      {(evidenceLabels[locale] || evidenceLabels.ja).title}
    </a>
  ) : null;
}
export const evidenceLabels: Record<string, Record<string, string>> = {
  ja: {
    title: '確認結果・未検証の範囲と根拠',
    result: '実際に記録されている結果',
    report: '既存の本人報告と記録の限界を読む',
    limits: '分かっていないこと',
    compare: '自分の環境で比較する項目',
    scope: '対象の版・環境',
    sources: '公式説明が裏付ける範囲',
  },
  en: {
    title: 'Results, limits and evidence',
    result: 'Recorded results',
    report: 'Read the existing player report and its limits',
    limits: 'What remains unknown',
    compare: 'What to compare on your PC',
    scope: 'Versions and environment',
    sources: 'What official sources support',
  },
  zh: {
    title: '记录结果、未验证范围与依据',
    result: '已有记录的结果',
    report: '阅读已有用户报告及其局限',
    limits: '尚不明确的事项',
    compare: '在自己的电脑上比较什么',
    scope: '适用版本与环境',
    sources: '官方资料支持的范围',
  },
  es: {
    title: 'Resultados, límites y fuentes',
    result: 'Resultados registrados',
    report: 'Leer el informe existente y sus límites',
    limits: 'Lo que aún no se conoce',
    compare: 'Qué comparar en tu PC',
    scope: 'Versiones y entorno',
    sources: 'Qué respaldan las fuentes oficiales',
  },
};
