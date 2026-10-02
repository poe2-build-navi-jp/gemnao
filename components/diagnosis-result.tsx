'use client';
/* oxlint-disable next/no-html-link-for-pages -- Full document navigation keeps diagnostic pages isolated from third-party scripts. */
import {
  statuses,
  type ActionStatus,
  type DiagnosisResult,
  type Answers,
  answerLabel,
} from '@/lib/diagnosis/model';
export function DiagnosisSummary({ answers }: { answers: Answers }) {
  const labels: Record<string, string> = {
    symptom: '症状',
    scope: '影響範囲',
    observation: '発生状況',
    error: 'エラーの分類',
    change: '直前の変更',
    launcher: '起動元',
    os: 'Windows',
    gpu: 'GPU',
    ram: 'メモリ',
  };
  return (
    <dl className="diag-summary">
      {Object.entries(answers).map(([k, v]) => (
        <div key={k}>
          <dt>{labels[k]}</dt>
          <dd>{answerLabel(k, v!, answers.symptom)}</dd>
        </div>
      ))}
    </dl>
  );
}
export function DiagnosisResultView({
  result,
  records,
  onRecord,
  onArticle,
}: {
  result: DiagnosisResult;
  records: Record<string, ActionStatus>;
  onRecord?: (id: string, status: ActionStatus) => void;
  onArticle?: (id: string) => void;
}) {
  return (
    <section aria-labelledby="diag-result-title">
      <p className="diag-kicker">回答から整理した確認の順番</p>
      <h2 id="diag-result-title">あなたの診断結果</h2>
      <p className={result.scope === 'pc' ? 'diag-warning' : 'diag-lead'}>
        {result.summary}
      </p>
      {result.missing.length > 0 && (
        <p className="diag-notice">
          情報が不足している項目：{result.missing.join('、')}
          。「分からない」は「問題なし」と判定していません。
        </p>
      )}
      <h3>
        {result.scope === 'insufficient'
          ? '追加で確認すること'
          : result.scope === 'pc'
            ? '安全のために確認すること'
            : 'まず確認すること'}
      </h3>
      <ol className="diag-actions">
        {result.recommendations.map(({ action: a, reason, ruleId }, index) => (
          <li key={ruleId} className="diag-card">
            <span className="diag-number" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{a.title}</h3>
            <p className="diag-reason">{reason}</p>
            <dl className="diag-facts">
              <div>
                <dt>所要時間</dt>
                <dd>{a.time}</dd>
              </div>
              <div>
                <dt>危険度</dt>
                <dd>{a.risk}</dd>
              </div>
              <div>
                <dt>元に戻す</dt>
                <dd>{a.reversible}</dd>
              </div>
            </dl>
            <p className="diag-warning">
              <strong>先に確認：</strong>
              {a.warning}
            </p>
            <ol>
              {a.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <a
              className="diag-link"
              href={a.article}
              onClick={() => onArticle?.(a.id)}
            >
              ゲムなおの詳しい手順を見る →
            </a>
            <details>
              <summary>根拠と、試した後の進み方</summary>
              <p>
                <strong>改善したら：</strong>
                {a.improved}
              </p>
              <p>
                <strong>改善しなかったら：</strong>
                {a.unchanged}
              </p>
              <ul>
                {a.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer noopener">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <small>
                ルール {ruleId} / 確認日 {result.checkedAt}
              </small>
            </details>
            {onRecord ? (
              <fieldset className="diag-record">
                <legend>この対処を試しましたか？</legend>
                <div className="diag-status-buttons">
                  {Object.entries(statuses).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={(records[a.id] || 'untried') === value}
                      onClick={() => onRecord(a.id, value as ActionStatus)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              <p>実施結果：{statuses[records[a.id] || 'untried']}</p>
            )}
          </li>
        ))}
      </ol>
      <p className="diag-small">
        改善は利用者の自己申告です。複数の対処をした場合、どれが改善に関係したかはこの記録だけでは分かりません。ルール版：
        {result.version}
      </p>
    </section>
  );
}
