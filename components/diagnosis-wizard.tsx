'use client';
/* oxlint-disable next/no-html-link-for-pages -- Private diagnostic routes always use full-document navigation. */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  symptoms,
  questions,
  decisionFields,
  questionFor,
  stepsFor,
  changeAnswer,
  isPcIssue,
  statuses,
  type Action,
  type ActionStatus,
  type Answers,
} from '@/lib/diagnosis/model';
import { actions, diagnose } from '@/lib/diagnosis/rules';
import {
  clearLocal,
  readLocal,
  saveLocal,
  freshLocal,
  diagnosisRequest,
  type LocalDiagnosis,
} from '@/lib/diagnosis/local';
import { DiagnosisResultView, DiagnosisSummary } from './diagnosis-result';
import { repairDecision } from '@/lib/diagnosis/decision';
import { buildRepairReport } from '@/lib/diagnosis/report';
import { DiagnosisRepairReport } from './diagnosis-repair-report';
import { DiagnosisShare } from './diagnosis-share';
function TriedActionField({
  action,
  current,
  onChange,
}: {
  action: Action;
  current: ActionStatus;
  onChange: (status: ActionStatus) => void;
}) {
  return (
    <div className="diag-field">
      <label htmlFor={`tried-${action.id}`}>{action.title}</label>
      <select
        id={`tried-${action.id}`}
        value={current}
        onChange={(e) => onChange(e.target.value as ActionStatus)}
      >
        {Object.entries(statuses).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DiagnosisWizard({ gameNames }: { gameNames: string[] }) {
  const [data, setData] = useState<LocalDiagnosis>(freshLocal);
  const [ready, setReady] = useState(false),
    [storageOk, setStorageOk] = useState(true),
    [resume, setResume] = useState<LocalDiagnosis | null>(null);
  const [config, setConfig] = useState({
      enabled: false,
      sharing: false,
    }),
    [started, setStarted] = useState(false);
  const [notice, setNotice] = useState('');
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    queueMicrotask(() => {
      setResume(readLocal());
      setReady(true);
    });
    void diagnosisRequest<{
      enabled: boolean;
      sharing: boolean;
      metrics: boolean;
    }>('/config')
      .then((next) => setConfig({
        enabled: (process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED === 'true' || process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true') && next.enabled === true,
        sharing: process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA !== 'true' && process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED === 'true' && next.enabled === true && next.sharing === true,
      }))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (ready && started) {
      const ok = saveLocal(data);
      queueMicrotask(() => setStorageOk(ok));
    }
  }, [data, ready, started]);
  useEffect(() => {
    if (started) title.current?.focus();
  }, [data.step, data.complete, started]);
  // This local repair flow does not emit diagnostic events, even if runtime flags change.
  const steps = stepsFor(data.answers);
  const stepIndex = steps.indexOf(data.step);
  const index = stepIndex < 0 ? 0 : stepIndex;
  const q = questionFor(data.step, data.answers);
  const records = { ...data.tried, ...data.results };
  const result = { ...diagnose(data.answers, data.tried), decision: repairDecision(data.answers, records) };
  const report = useMemo(() => {
    const currentRecords = { ...data.tried, ...data.results };
    return buildRepairReport(data.answers, currentRecords, repairDecision(data.answers, currentRecords), new Date().toISOString());
  }, [data.answers, data.tried, data.results]);
  const relevantActionIds = new Set(
    diagnose(data.answers, {}).recommendations.map((r) => r.action.id),
  );
  const triedChoices = Object.values(actions).filter(
    (a) => !['pc', 'inspect'].includes(a.id),
  );
  const recordTried = (id: string, status: ActionStatus) =>
    setData((d) => ({
      ...d,
      tried: { ...d.tried, [id]: status },
      results: {},
      shareId: undefined,
    }));
  const change = (id: keyof Answers, value: string) =>
    setData((d) =>
      d.answers[id] === value
        ? d
        : {
            ...d,
            answers: changeAnswer(d.answers, id, value),
            tried: ['safety', 'storage', ...decisionFields].includes(id) ? d.tried : {},
            results: ['safety', 'storage', ...decisionFields].includes(id) ? d.results : {},
            complete: false,
            shareId: undefined,
          },
    );
  const next = () => {
    const ids = stepsFor(data.answers);
    const current = ids.indexOf(data.step);
    if (current === ids.length - 1) {
      setData((d) => ({ ...d, complete: true }));
    } else {
      const nextStep = ids[current + 1];
      setData((d) => ({ ...d, step: nextStep }));
    }
  };
  const back = () => {
    setData((d) => ({
      ...d,
      complete: false,
      step: steps[Math.max(0, index - 1)],
    }));
    setNotice('');
  };
  const start = () => {
    const d = freshLocal();
    setData(d);
    setResume(null);
    setStarted(true);
  };
  const reset = () => {
    clearLocal();
    setData(freshLocal());
    setResume(null);
    setStarted(false);
    setNotice(
      process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true' ? 'このブラウザの診断を消去しました。' : 'このブラウザの診断を消去しました。発行済みの共有ページは管理画面で削除してください。',
    );
  };
  if (!ready)
    return <output className="diag-notice">診断を準備しています…</output>;
  if (!config.enabled)
    return (
      <p className="diag-warning">
        診断は現在停止しています。
        <a href="/guide">症状別の記事をご覧ください</a>
      </p>
    );
  return (
    <div className="diag-flow">
      {notice && <output className="diag-notice">{notice}</output>}
      {!storageOk && (
        <p role="alert" className="diag-warning">
          このブラウザには保存できません。診断は続けられますが、再読み込みすると回答が失われます。
        </p>
      )}
      {!started ? (
        <section className="diag-start">
          <div className="diag-badges">
            <span>無料</span>
            <span>登録不要</span>
            <span>インストール不要</span>
          </div>
          <button className="diag-primary" onClick={start}>
            症状を選んで診断をはじめる →
          </button>
          {resume && (
            <div className="diag-resume">
              <p>このブラウザに前回の診断が残っています</p>
              <button
                onClick={() => {
                  setData(resume);
                  setStarted(true);
                  setResume(null);
                }}
              >
                続きから再開する
              </button>
              <button onClick={reset}>端末内の記録を消す</button>
            </div>
          )}
          <p className="diag-small">
            {process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true' ? '回答とゲーム名はこのブラウザ内だけに保存します。このβ版は診断内容をサーバーへ送信せず、結果の共有や診断イベントの計測も行いません。最後の操作から30日を過ぎた記録は再訪時に消します。共用PCでは使い終わったら記録を消してください。' : '回答とゲーム名はこのブラウザ内で保持します。任意の共有を確定する前に回答全文を送信することはありません。保存期間は最後の操作から30日が目安です。共用PCでは使い終わったら記録を消してください。'}
          </p>
        </section>
      ) : data.complete ? (
        <>
          <div className="diag-toolbar">
            <button
              onClick={() =>
                setData((d) => ({ ...d, complete: false, step: steps.at(-1)! }))
              }
            >
              ← 回答に戻る
            </button>
            <button onClick={reset}>端末内の記録を消す</button>
          </div>
          <h2 ref={title} tabIndex={-1} className="diag-visually-hidden">
            診断結果
          </h2>
          {data.game && <p>対象ゲーム（この端末のみ）：{data.game}</p>}
          <DiagnosisResultView
            result={result}
            answers={data.answers}
            records={records}
            onRecord={(id, status) => {
              if ((data.results[id] || data.tried[id] || 'untried') === status)
                return;
              setData((d) => ({
                ...d,
                results: { ...d.results, [id]: status },
              }));
              setNotice(
                process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true' ? '実施結果をこのブラウザ内に記録しました。サーバーへは送信していません。' : '実施結果をこの端末に記録しました。共有ページは自動更新しません。',
              );
            }}
          />
          <DiagnosisRepairReport key={report} report={report} />
          {Object.keys(data.tried).length > 0 && (
            <details>
              <summary>診断前に試した対処</summary>
              <ul>
                {Object.entries(data.tried).map(([id, status]) => (
                  <li key={id}>
                    {actions[id]?.title}：{statuses[status]}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <details>
            <summary>回答のまとめ</summary>
            <DiagnosisSummary answers={data.answers} />
          </details>
          {process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA !== 'true' && data.answers.safety === undefined && <DiagnosisShare
            answers={data.answers}
            tried={data.tried}
            results={data.results}
            shareId={data.shareId}
            enabled={config.sharing}
            onCreated={(id) => setData((d) => ({ ...d, shareId: id }))}
            onMetric={() => {}}
          />}
          <button className="diag-secondary" onClick={start}>
            別の症状を診断する
          </button>
        </>
      ) : (
        <section className="diag-question">
          <ol className="diag-progress" aria-label="進行段階">
            {['安全', '症状', '確認', '結果'].map((s, i) => (
              <li
                key={s}
                aria-current={
                  (['safety', 'storage'].includes(data.step) ? 0 : ['symptom', 'scope', 'observation', 'error'].includes(data.step) ? 1 : 2) === i
                    ? 'step'
                    : undefined
                }
              >
                {s}
              </li>
            ))}
          </ol>
          <div className="diag-toolbar">
            {index > 0 && <button onClick={back}>← 前の質問へ</button>}
            <span>現在 {index + 1} 問目 · 回答により分岐</span>
          </div>
          <h2 ref={title} tabIndex={-1}>
            {data.step === 'decision'
              ? '修理・部品交換を比べるための情報は？'
              : data.step === 'environment'
              ? '不具合が起きているPCの情報は？'
              : data.step === 'game'
                ? '問題が起きているゲームは？'
                : data.step === 'tried'
                  ? 'すでに試した対処はありますか？'
                  : q?.title}
          </h2>
          {q ? (
            <>
              <details className="diag-help">
                <summary>確認方法を見る</summary>
                <p>{q.help}</p>
              </details>
              <fieldset className="diag-options" aria-label={q.title}>
                {q.options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={data.answers[q.id] === o.value}
                    onClick={() => change(q.id, o.value)}
                  >
                    {o.label}
                    {data.step === 'symptom' && (
                      <small>
                        {symptoms.find((s) => s.id === o.value)?.detail}
                      </small>
                    )}
                  </button>
                ))}
              </fieldset>
            </>
          ) : data.step === 'environment' ? (
            <>
              <p>
                今見ているスマートフォンの情報ではありません。分からない項目はそのまま進めます。
              </p>
              {(['os', 'gpu', 'ram'] as const).map((id) => (
                <div className="diag-field" key={id}>
                  <label htmlFor={`diag-${id}`}>{questions[id].title}</label>
                  <select
                    id={`diag-${id}`}
                    value={data.answers[id] || 'unknown'}
                    onChange={(e) => change(id, e.target.value)}
                  >
                    {questions[id].options.map((o) => (
                      <option value={o.value} key={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <details>
                    <summary>確認方法を見る</summary>
                    <p>{questions[id].help}</p>
                  </details>
                </div>
              ))}
            </>
          ) : data.step === 'decision' ? (
            <>
              <p>分かる範囲で選んでください。すべて任意です。型番や製造番号の入力は不要で、分からない項目は未確認のまま判断します。</p>
              {decisionFields.map((id) => (
                <div className="diag-field" key={id}>
                  <label htmlFor={`diag-${id}`}>{questions[id].title}</label>
                  <select id={`diag-${id}`} aria-describedby={`diag-help-${id}`} value={data.answers[id] || 'unknown'} onChange={(e) => change(id, e.target.value)}>
                    {questions[id].options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <p id={`diag-help-${id}`} className="diag-small">{questions[id].help}</p>
                </div>
              ))}
            </>
          ) : data.step === 'game' ? (
            <div className="diag-field">
              <label htmlFor="diag-game">ゲーム名（任意）</label>
              <input
                id="diag-game"
                maxLength={80}
                list="diag-games"
                value={data.game}
                onChange={(e) =>
                  setData((d) => ({ ...d, game: e.target.value }))
                }
                placeholder="例：ELDEN RING"
              />
              <datalist id="diag-games">
                {gameNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </datalist>
              <p className="diag-small">
                この端末だけのメモです。自由入力のゲーム名は共有・計測へ送信しません。分からなければ空欄で進めます。今回の診断はゲーム共通の確認順です。
              </p>
            </div>
          ) : (
            <>
              <p>
                「改善しなかった」「試した」を選んだ対処は、今回の優先候補から外します。未実施ならそのまま進めます。
              </p>
              <div className="diag-relevant-tried">
                {triedChoices
                  .filter((a) => relevantActionIds.has(a.id))
                  .map((a) => (
                    <TriedActionField
                      key={a.id}
                      action={a}
                      current={data.tried[a.id] || 'untried'}
                      onChange={(status) => recordTried(a.id, status)}
                    />
                  ))}
              </div>
              <details className="diag-other-actions">
                <summary>ほかに試した対処を選ぶ（任意）</summary>
                <p className="diag-small">
                  今回の候補以外で試した対処も、必要なら記録できます。
                </p>
                <div className="diag-tried">
                  {triedChoices
                    .filter((a) => !relevantActionIds.has(a.id))
                    .map((a) => (
                      <TriedActionField
                        key={a.id}
                        action={a}
                        current={data.tried[a.id] || 'untried'}
                        onChange={(status) => recordTried(a.id, status)}
                      />
                    ))}
                </div>
              </details>
            </>
          )}
          <button
            className="diag-primary"
            disabled={Boolean(q && !data.answers[q.id])}
            onClick={() => {
              if (data.step === 'environment') {
                setData((d) => ({
                  ...d,
                  answers: {
                    ...d.answers,
                    os: d.answers.os || 'unknown',
                    gpu: d.answers.gpu || 'unknown',
                    ram: d.answers.ram || 'unknown',
                  },
                  step: 'game',
                }));
              } else if (data.step === 'decision') {
                setData((d) => ({ ...d, answers: {
                  ...d.answers,
                  ...Object.fromEntries(decisionFields.map((id) => [id, d.answers[id] || 'unknown'])),
                }, complete: true }));
              } else next();
            }}
          >
            {index === steps.length - 1 ? '確認する順番を見る →' : '次へ →'}
          </button>
          {data.answers.safety === 'danger' && <p role="alert" className="diag-warning">使用と充電を中止し、安全を確保してメーカー・専門窓口へ相談してください。バックアップのためでも電源を入れず、分解や再現テストをしないでください。</p>}
          {data.answers.safety !== 'danger' && data.answers.storage === 'critical' && <p role="alert" className="diag-warning">安全に操作できる場合だけ重要データの退避を優先します。再検査・負荷テスト・初期化をせず、メーカーへ相談してください。</p>}
          {isPcIssue(data.answers) && (
            <p className="diag-warning">
              PC全体の症状を選んだため、安全確認へ切り替えます。
            </p>
          )}
          <p className="diag-small">
            症状に関する回答を変更すると、それに続く回答を見直します。回答を変えた場合は対処の記録も確認し直してください。
          </p>
        </section>
      )}
    </div>
  );
}
