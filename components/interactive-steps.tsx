'use client';

import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  ListChecks,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Step = {
  id: string;
  title: string;
  summary?: string;
  actions: string[];
  note?: string;
};
type Row = { topic: string; struggling: number; resolved: number };
type Method = { methodId: string; methodLabel: string; responses: number };
type Progress = {
  currentStep: number;
  completedIds: string[];
  solved: boolean;
  solvedStepId?: string;
  lastViewedAt: string;
};

const threshold = 10;

export function InteractiveSteps({
  contextSlug,
  topic,
  articleTitle,
  articlePath,
  heading = '解決手順',
  steps,
}: {
  contextSlug: string;
  topic: string;
  articleTitle: string;
  articlePath: string;
  heading?: string;
  steps: Step[];
}) {
  const storageKey = `gemnao-progress:${contextSlug}`;
  const voteKey = `gemnao-feedback:${contextSlug}:${topic}`;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [solvedStepId, setSolvedStepId] = useState('');
  const [showResume, setShowResume] = useState(false);
  const [sending, setSending] = useState('');
  const [message, setMessage] = useState('');
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const progress = JSON.parse(saved) as Progress;
        const safeStep = Math.min(
          Math.max(progress.currentStep || 0, 0),
          Math.max(steps.length - 1, 0),
        );
        queueMicrotask(() => {
          setCurrentStep(safeStep);
          setCompletedIds(progress.completedIds || []);
          setSolvedStepId(progress.solvedStepId || '');
          setShowResume(safeStep > 0 && !progress.solved);
        });
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
    const recentKey = 'gemnao-recent-troubles';
    const current = {
      contextSlug,
      title: articleTitle,
      path: articlePath,
      viewedAt: new Date().toISOString(),
    };
    try {
      const previous = JSON.parse(localStorage.getItem(recentKey) || '[]') as (typeof current)[];
      localStorage.setItem(
        recentKey,
        JSON.stringify([
          current,
          ...previous.filter((item) => item.contextSlug !== contextSlug),
        ].slice(0, 5)),
      );
    } catch {
      localStorage.setItem(recentKey, JSON.stringify([current]));
    }
    queueMicrotask(() =>
      setAlreadyVoted(Boolean(localStorage.getItem(`${voteKey}:resolved`))),
    );
    const controller = new AbortController();
    async function loadFeedback() {
      try {
        const response = await fetch(
          `/api/feedback?game=${encodeURIComponent(contextSlug)}`,
          { signal: controller.signal },
        );
        if (!response.ok) return;
        const data = (await response.json()) as {
          rows?: Row[];
          methods?: Method[];
        };
        setRows(data.rows || []);
        setMethods(data.methods || []);
      } catch {
        return;
      }
    }
    void loadFeedback();
    return () => controller.abort();
  }, [articlePath, articleTitle, contextSlug, steps.length, storageKey, voteKey]);

  function saveProgress(next: Progress) {
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const row = rows.find((item) => item.topic === topic) || {
    topic,
    struggling: 0,
    resolved: 0,
  };
  const total = row.struggling + row.resolved;
  const solvedRate = total ? Math.round((row.resolved / total) * 100) : 0;
  const rankedMethods = useMemo(
    () => [...methods].sort((a, b) => b.responses - a.responses).slice(0, 3),
    [methods],
  );
  const solvedStep = steps.find((step) => step.id === solvedStepId);
  const shareText = solvedStep
    ? `${articleTitle}、「${solvedStep.title}」で直った！\n同じ症状の人向け👇`
    : articleTitle;

  async function solved(step: Step) {
    if (sending || localStorage.getItem(`${voteKey}:resolved`)) return;
    setSending(step.id);
    setMessage('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: contextSlug,
          topic,
          kind: 'step-solved',
          method: step.id,
          label: step.title,
        }),
      });
      if (!response.ok) throw new Error('save failed');
      const data = (await response.json()) as { rows?: Row[]; methods?: Method[] };
      setRows(data.rows || []);
      setMethods(data.methods || []);
      setSolvedStepId(step.id);
      setCompletedIds((value) => [...new Set([...value, step.id])]);
      localStorage.setItem(`${voteKey}:resolved`, '1');
      setAlreadyVoted(true);
      saveProgress({
        currentStep,
        completedIds: [...new Set([...completedIds, step.id])],
        solved: true,
        solvedStepId: step.id,
        lastViewedAt: new Date().toISOString(),
      });
    } catch {
      setMessage('回答を保存できませんでした。通信状態を確認して、もう一度お試しください。');
    } finally {
      setSending('');
    }
  }

  async function notSolved(step: Step, index: number) {
    if (sending || solvedStepId) return;
    const nextCompleted = [...new Set([...completedIds, step.id])];
    setCompletedIds(nextCompleted);
    if (index < steps.length - 1) {
      const next = index + 1;
      setCurrentStep(next);
      setShowResume(false);
      saveProgress({
        currentStep: next,
        completedIds: nextCompleted,
        solved: false,
        lastViewedAt: new Date().toISOString(),
      });
      requestAnimationFrame(() =>
        document.getElementById(steps[next].id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        }),
      );
      return;
    }
    if (localStorage.getItem(`${voteKey}:struggling`)) return;
    setSending(step.id);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: contextSlug,
          topic,
          kind: 'struggling',
        }),
      });
      if (!response.ok) throw new Error('save failed');
      const data = (await response.json()) as { rows?: Row[] };
      setRows(data.rows || []);
      localStorage.setItem(`${voteKey}:struggling`, '1');
      saveProgress({
        currentStep: index,
        completedIds: nextCompleted,
        solved: false,
        lastViewedAt: new Date().toISOString(),
      });
      setMessage('回答を記録しました。下の「まだ直りませんか？」から次の対処法も確認できます。');
    } catch {
      setMessage('回答を保存できませんでした。通信状態を確認して、もう一度お試しください。');
    } finally {
      setSending('');
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setMessage('リンクをコピーしました。');
  }

  async function nativeShare() {
    if (!navigator.share) return;
    await navigator.share({ title: articleTitle, text: shareText, url: window.location.href });
  }

  return (
    <section className="interactive-troubleshooter" aria-labelledby="interactive-steps-title">
      <div className="solution-data-panel">
        <p className="evidence-label">GEMNAO FIRST-PARTY DATA</p>
        <h2>このトラブルの解決状況</h2>
        {total >= threshold ? (
          <div className="solution-data-summary">
            <strong>{solvedRate}%が解決</strong>
            <span>匿名回答 {total}件</span>
          </div>
        ) : (
          <p>信頼できる表示に必要な回答データを集計中です（10件以上で解決率を表示）。</p>
        )}
        {row.resolved >= threshold && rankedMethods.length ? (
          <div className="method-ranking">
            <strong>よく直っている方法</strong>
            <ol>
              {rankedMethods.map((method) => (
                <li key={method.methodId}>
                  <span>{method.methodLabel}</span>
                  <b>{method.responses}件</b>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        <small>匿名の回答件数です。個人情報やIPアドレスは保存しません。</small>
      </div>

      {showResume ? (
        <div className="resume-panel">
          <RotateCcw size={19} />
          <div>
            <strong>前回の続きがあります</strong>
            <span>STEP {currentStep + 1}から再開できます。</span>
          </div>
          <button type="button" onClick={() => document.getElementById(steps[currentStep]?.id)?.scrollIntoView({ behavior: 'smooth' })}>
            続きから再開
          </button>
        </div>
      ) : null}

      <div className="step-progress" aria-label={`進行状況 ${Math.min(currentStep + 1, steps.length)} / ${steps.length}`}>
        <span>進行状況</span>
        <strong>{Math.min(currentStep + 1, steps.length)} / {steps.length}</strong>
        <div><i style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} /></div>
      </div>

      <div className="procedure-section">
        <h2 id="interactive-steps-title"><ListChecks size={26} />{heading}</h2>
        <div className="procedure-list">
          {steps.map((step, index) => {
            const completed = completedIds.includes(step.id);
            const solvedHere = solvedStepId === step.id;
            return (
              <section className={`procedure-card interactive-step${index === currentStep ? ' current' : ''}${completed ? ' completed' : ''}`} id={step.id} key={step.id}>
                <header>
                  <span>{completed ? <Check size={19} /> : index + 1}</span>
                  <div><h3>{step.title}</h3>{step.summary ? <p>{step.summary}</p> : null}</div>
                </header>
                <ol>{step.actions.map((action) => <li key={action}>{action}</li>)}</ol>
                {step.note ? <p className="procedure-note">{step.note}</p> : null}
                <div className="step-actions">
                  <button className="step-solved" type="button" onClick={() => void solved(step)} disabled={Boolean(sending || solvedStepId || alreadyVoted)}>
                    <CheckCircle2 size={18} />{solvedHere ? 'この方法で解決済み' : 'これで直った'}
                  </button>
                  {!solvedStepId ? (
                    <button className="step-next" type="button" onClick={() => void notSolved(step, index)} disabled={Boolean(sending)}>
                      {index < steps.length - 1 ? '直らない → 次へ' : '全部試したが直らない'}<ChevronRight size={17} />
                    </button>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {solvedStep ? (
        <output className="success-share">
          <CheckCircle2 size={28} />
          <div><strong>解決できました！</strong><p>同じ症状で困っている人に、この方法を共有できます。</p></div>
          <div className="share-actions">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(`https://gemnao.pages.dev${articlePath}`)}`} target="_blank" rel="noreferrer">Xで共有</a>
            <button type="button" onClick={() => void copyLink()}><Clipboard size={17} />リンクをコピー</button>
            {typeof navigator !== 'undefined' && 'share' in navigator ? <button type="button" onClick={() => void nativeShare()}><Share2 size={17} />共有</button> : null}
          </div>
        </output>
      ) : null}
      {message ? <output className="step-message">{message}</output> : null}
    </section>
  );
}
