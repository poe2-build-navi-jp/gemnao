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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSavedSolutions } from '@/components/use-saved-solutions';
import { useActiveCase } from '@/components/support-workspace';
import { ResultNote } from '@/components/result-note';
import { SaveSolution } from '@/components/save-solution';
import { trackEvent } from '@/lib/analytics';
import { TroubleshootingProduct } from '@/components/troubleshooting-product';
import {
  solutionRanking,
  stepSolutionReports,
  feedbackSummary,
} from '@/lib/solution-ranking';

type Step = {
  id: string;
  title: string;
  summary?: string;
  actions: string[];
  note?: string;
  guideLink?: { href: string; label: string; description: string };
  time?: string;
  risk?: 'low' | 'medium' | 'high';
};

const riskLabels = {
  low: '影響：小（元に戻せる）',
  medium: '影響：中（設定が変わる）',
  high: '影響：大（ファイルを入れ替える）',
};
type Row = { topic: string; struggling: number; resolved: number };
type Method = { methodId: string; methodLabel: string; responses: number };
type NextLink = { href: string; label: string };
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
  shareHashtag,
  heading = '解決手順',
  steps,
  nextLinks = [],
}: {
  contextSlug: string;
  topic: string;
  articleTitle: string;
  articlePath: string;
  shareHashtag?: string;
  heading?: string;
  steps: Step[];
  nextLinks?: NextLink[];
}) {
  const storageKey = `gemnao-progress:${contextSlug}`;
  const voteKey = `gemnao-feedback:${contextSlug}:${topic}`;
  const activeCase = useActiveCase();
  const { items: savedNotes } = useSavedSolutions();
  const activeNote = savedNotes.find((item) => item.id === activeCase);
  const [legacyProgress, setLegacyProgress] = useState<Progress | null>(null);
  type Session = {
    currentStep: number;
    completedIds: string[];
    solvedStepId: string;
    showResume: boolean;
    message: string;
    outcome: {
      step: Step;
      resolved: boolean;
      nextId: string;
      at: string;
    } | null;
  };
  // A saved revision supersedes transient results. Different issues never share
  // transient state, including results arriving from an earlier feedback request.
  const scope = JSON.stringify([
    articlePath,
    activeCase,
    activeNote?.updatedAt,
  ]);
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const noteIndex =
    activeNote?.articlePath === articlePath
      ? steps.findIndex((step) => step.id === activeNote.stepId)
      : -1;
  const legacy = !activeCase ? legacyProgress : null;
  const initial: Session = {
    currentStep: noteIndex >= 0 ? noteIndex : legacy?.currentStep || 0,
    completedIds: activeNote
      ? (activeNote.support?.attempts || [])
          .filter(
            (attempt) =>
              attempt.path === articlePath &&
              steps.some((step) => step.id === attempt.stepId),
          )
          .map((attempt) => attempt.stepId)
      : legacy?.completedIds || [],
    solvedStepId: activeNote
      ? activeNote.status === 'resolved' && noteIndex >= 0
        ? activeNote.stepId
        : ''
      : legacy?.solved
        ? legacy.solvedStepId || ''
        : '',
    showResume: activeNote
      ? activeNote.status !== 'resolved' && noteIndex >= 0
      : Boolean(legacy && legacy.currentStep > 0 && !legacy.solved),
    message: '',
    outcome: null,
  };
  const session = sessions[scope] || initial;
  const {
    currentStep,
    completedIds,
    solvedStepId,
    showResume,
    message,
    outcome,
  } = session;
  function updateSession(change: Partial<Session>) {
    setSessions((previous) => ({
      ...previous,
      [scope]: { ...(previous[scope] || initial), ...change },
    }));
  }
  function setMessage(message: string) {
    updateSession({ message });
  }
  // Anonymous vote deduplication is article-wide, never a lock on note actions.
  const pendingVotes = useRef(new Set<string>());
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch {
      /* Keep the article usable. */
    }
    if (saved) {
      try {
        const progress = JSON.parse(saved) as Progress;
        const safeStep = Math.min(
          Math.max(
            Number.isInteger(progress.currentStep) ? progress.currentStep : 0,
            0,
          ),
          Math.max(steps.length - 1, 0),
        );
        queueMicrotask(() =>
          setLegacyProgress({
            ...progress,
            currentStep: safeStep,
            completedIds: Array.isArray(progress.completedIds)
              ? progress.completedIds.filter(
                  (id) =>
                    typeof id === 'string' &&
                    steps.some((step) => step.id === id),
                )
              : [],
            solvedStepId:
              progress.solved &&
              steps.some((step) => step.id === progress.solvedStepId)
                ? progress.solvedStepId
                : '',
          }),
        );
      } catch {
        // Ignore malformed progress without deleting private data.
      }
    }
    try {
      const voted = Boolean(localStorage.getItem(`${voteKey}:resolved`));
      queueMicrotask(() => setAlreadyVoted(voted));
    } catch {
      /* Storage may be disabled. */
    }
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
  }, [articlePath, articleTitle, contextSlug, steps, storageKey, voteKey]);

  function hasVote(kind: string) {
    try {
      return Boolean(localStorage.getItem(`${voteKey}:${kind}`));
    } catch {
      return false;
    }
  }

  function markVote(kind: string) {
    try {
      localStorage.setItem(`${voteKey}:${kind}`, '1');
    } catch {
      // A successful server response must not become a false failure message.
    }
  }

  const row = rows.find((item) => item.topic === topic) || {
    topic,
    struggling: 0,
    resolved: 0,
  };
  const { total, percentage: solvedRate } = feedbackSummary(row);
  const stepReports = useMemo(
    () => stepSolutionReports(methods, steps, row.resolved),
    [methods, steps, row.resolved],
  );
  const rankedMethods = useMemo(
    () => solutionRanking(methods, steps, row.resolved),
    [methods, steps, row.resolved],
  );
  const solvedStep = steps.find((step) => step.id === solvedStepId);
  const shareUrl = solvedStep
    ? `https://gemnao.pages.dev${articlePath}#${solvedStep.id}`
    : `https://gemnao.pages.dev${articlePath}`;
  const normalizedHashtag = shareHashtag?.replace(/[^\p{L}\p{N}_]/gu, '');
  const shareText = solvedStep
    ? `${articleTitle}\n「${solvedStep.title}」で直りました。\n同じ症状の人向け👇${normalizedHashtag ? `\n#${normalizedHashtag}` : ''}`
    : articleTitle;

  async function solved(step: Step) {
    if (solvedStepId) return;
    updateSession({
      solvedStepId: step.id,
      completedIds: [...new Set([...completedIds, step.id])],
      showResume: false,
      message: '',
      outcome: {
        step,
        resolved: true,
        nextId: step.id,
        at: new Date().toISOString(),
      },
    });
    if (
      alreadyVoted ||
      hasVote('resolved') ||
      pendingVotes.current.has('resolved')
    )
      return;
    pendingVotes.current.add('resolved');
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
      const data = (await response.json()) as {
        rows?: Row[];
        methods?: Method[];
      };
      setRows(data.rows || []);
      setMethods(data.methods || []);
      trackEvent('issue_resolved', {
        game: contextSlug,
        topic,
        step_id: step.id,
      });
      markVote('resolved');
      setAlreadyVoted(true);
    } catch {
      setMessage(
        '匿名回答を送信できませんでした。ノートの保存は、表示された案内から別に行えます。',
      );
    } finally {
      pendingVotes.current.delete('resolved');
    }
  }

  async function notSolved(step: Step, index: number) {
    if (solvedStepId) return;
    const nextCompleted = [...new Set([...completedIds, step.id])];
    updateSession({
      currentStep: Math.min(index + 1, steps.length - 1),
      completedIds: nextCompleted,
      showResume: false,
      message: '',
      outcome: {
        step,
        resolved: false,
        nextId: steps[index + 1]?.id || step.id,
        at: new Date().toISOString(),
      },
    });
    if (
      index < steps.length - 1 ||
      hasVote('struggling') ||
      pendingVotes.current.has('struggling')
    )
      return;
    pendingVotes.current.add('struggling');
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
      markVote('struggling');
      trackEvent('issue_struggling', { game: contextSlug, topic });
      setMessage(
        '回答を記録しました。下の「まだ直りませんか？」から次の対処法も確認できます。',
      );
    } catch {
      setMessage(
        '匿名回答を送信できませんでした。ノートの保存は、表示された案内から別に行えます。',
      );
    } finally {
      pendingVotes.current.delete('struggling');
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackEvent('share', {
        method: 'copy',
        content_type: 'article',
        item_id: articlePath,
      });
      setMessage('リンクをコピーしました。');
    } catch {
      setMessage(
        'リンクをコピーできませんでした。ブラウザの設定を確認してください。',
      );
    }
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: articleTitle,
        text: shareText,
        url: shareUrl,
      });
      trackEvent('share', {
        method: 'native',
        content_type: 'article',
        item_id: articlePath,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage(
        '共有を開始できませんでした。X共有またはリンクコピーをお試しください。',
      );
    }
  }

  return (
    <section
      className="interactive-troubleshooter"
      aria-labelledby="interactive-steps-title"
    >
      {/* Show first-party data only after the threshold. An empty
          "collecting data" panel on every article reads as unfinished. */}
      {solvedRate !== null ? (
        <div className="solution-data-panel">
          <h2>このトラブルの解決状況</h2>
          <div className="solution-data-summary">
            <strong>解決報告の割合 {solvedRate}%</strong>
            <span>
              匿名回答 {total}件（解決 {row.resolved}件・未解決 {row.struggling}
              件）
            </span>
          </div>
          {row.resolved >= threshold && rankedMethods.length ? (
            <div className="method-ranking">
              <strong>実際に直った方法</strong>
              <p>現在、解決報告が多い順に表示しています。</p>
              <ol>
                {rankedMethods.slice(0, 3).map((method) => (
                  <li key={method.methodId} value={method.rank}>
                    <span>
                      {method.tied
                        ? `同率${method.rank}位：`
                        : `${method.rank}位：`}
                      <a href={`#${method.methodId}`}>{method.methodLabel}</a>
                    </span>
                    <b>{method.responses}件</b>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {total >= threshold && rankedMethods.length ? (
            <figure className="solution-illustration">
              <a
                href={`/api/solution-image?game=${encodeURIComponent(contextSlug)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="STEP別の解決回答画像を拡大して見る"
              >
                {/* oxlint-disable-next-line next/no-img-element -- Dynamic D1-backed SVG cannot be preoptimized. */}
                <img
                  src={`/api/solution-image?game=${encodeURIComponent(contextSlug)}`}
                  alt={`${articleTitle}のSTEP別解決回答数。詳細は直前の解決状況を確認してください。`}
                  width={1080}
                  height={1080}
                  loading="lazy"
                />
              </a>
              <figcaption>
                実際の解決回答を集計した画像です。集計時点を画像内に表示しています。
              </figcaption>
            </figure>
          ) : null}
          <small>
            利用者の自己申告で、全閲覧者の成功率や効果の比較試験ではありません。同じ人が未解決と解決の両方を報告する場合があります。件数は人数ではなく回答数です。
          </small>
        </div>
      ) : null}

      {showResume ? (
        <div className="resume-panel">
          <RotateCcw size={19} />
          <div>
            <strong>前回の続きがあります</strong>
            <span>STEP {currentStep + 1}から再開できます。</span>
          </div>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById(steps[currentStep]?.id)
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            続きから再開
          </button>
        </div>
      ) : null}

      <div
        className="step-progress"
        aria-label={`進行状況 ${Math.min(currentStep + 1, steps.length)} / ${steps.length}`}
      >
        <span>進行状況</span>
        <strong>
          {Math.min(currentStep + 1, steps.length)} / {steps.length}
        </strong>
        <div>
          <i
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="procedure-section">
        <h2 id="interactive-steps-title">
          <ListChecks size={26} />
          {heading}
        </h2>
        <SaveSolution
          steps={steps}
          draft={{
            title: articleTitle,
            gameSlug: articlePath.match(/^\/games\/([a-z0-9-]+)\//)?.[1] || '',
            // Article-wide progress does not identify which problem it belongs to.
            status: 'investigating',
            diagnosis: '',
            settings: '',
            notes: '',
            articlePath,
            stepId: '',
            completedSteps: [],
          }}
        />
        <div className="procedure-list">
          {steps.map((step, index) => {
            const completed = completedIds.includes(step.id);
            const solvedHere = solvedStepId === step.id;
            return (
              <section
                className={`procedure-card interactive-step${index === currentStep ? ' current' : ''}${completed ? ' completed' : ''}`}
                id={step.id}
                key={step.id}
              >
                <header>
                  <span>{completed ? <Check size={19} /> : index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    {step.time || step.risk ? (
                      <p className="step-badges">
                        {step.time ? <span>目安 {step.time}</span> : null}
                        {step.risk ? (
                          <span className={`risk-${step.risk}`}>
                            {riskLabels[step.risk]}
                          </span>
                        ) : null}
                      </p>
                    ) : null}
                    {step.summary ? <p>{step.summary}</p> : null}
                    {stepReports.find(
                      (method) => method.methodId === step.id,
                    ) ? (
                      <p>
                        このSTEPの解決報告：
                        {
                          stepReports.find(
                            (method) => method.methodId === step.id,
                          )?.responses
                        }
                        件
                      </p>
                    ) : null}
                  </div>
                </header>
                <ol>
                  {step.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
                {step.note ? (
                  <p className="procedure-note">{step.note}</p>
                ) : null}
                {step.guideLink ? (
                  <p className="procedure-note">
                    {step.guideLink.description}{' '}
                    <a href={step.guideLink.href}>{step.guideLink.label} →</a>
                  </p>
                ) : null}
                <TroubleshootingProduct
                  articlePath={articlePath}
                  step={index + 1}
                />
                {!solvedStepId && index < steps.length - 1 && (
                  <p className="step-skip">
                    <a href={`#${steps[index + 1].id}`}>
                      対象外なら「{steps[index + 1].title}」へスキップ
                    </a>
                  </p>
                )}
                <div className="step-actions">
                  <button
                    className="step-solved"
                    type="button"
                    onClick={() => void solved(step)}
                    disabled={Boolean(solvedStepId)}
                  >
                    <CheckCircle2 size={18} />
                    {solvedHere ? 'この方法で解決済み' : 'これで直った'}
                  </button>
                  {!solvedStepId ? (
                    <button
                      className="step-next"
                      type="button"
                      onClick={() => void notSolved(step, index)}
                    >
                      {index < steps.length - 1
                        ? `直らない → 次は「${steps[index + 1].title}」を確認`
                        : '全部試したが直らない'}
                      <ChevronRight size={17} />
                    </button>
                  ) : null}
                </div>
                {outcome?.step.id === step.id && (
                  <ResultNote
                    key={`${scope}:${outcome.at}`}
                    onClose={() => updateSession({ outcome: null })}
                    attempt={{
                      path: articlePath,
                      stepId: step.id,
                      label: step.title,
                      result: outcome.resolved ? 'resolved' : 'unresolved',
                      at: outcome.at,
                    }}
                    draft={{
                      title: articleTitle,
                      gameSlug:
                        articlePath.match(/^\/games\/([a-z0-9-]+)\//)?.[1] ||
                        '',
                      status: outcome.resolved ? 'resolved' : 'unresolved',
                      diagnosis: '',
                      settings: '',
                      notes: '',
                      articlePath,
                      stepId: outcome.nextId,
                      completedSteps: [step.title],
                    }}
                  />
                )}
              </section>
            );
          })}
        </div>
      </div>

      {!solvedStep &&
      completedIds.length >= steps.length &&
      nextLinks.length ? (
        <section
          className="related-section step-next-actions"
          aria-labelledby="step-next-actions-title"
        >
          <h2 id="step-next-actions-title">まだ直りませんか？</h2>
          <p>現在の症状に近いものから、次の対処法を確認してください。</p>
          <div>
            {nextLinks.slice(0, 5).map((link) => (
              <a data-related="true" href={link.href} key={link.href}>
                {link.label}
                <ChevronRight size={16} />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {solvedStep ? (
        <output className="success-share">
          <CheckCircle2 size={28} />
          <div>
            <strong>解決できました！</strong>
            <p>
              「{solvedStep.title}
              」で直りました。同じ症状で困っている人に共有できます。
            </p>
          </div>
          <div className="share-actions">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              data-share="x"
            >
              Xで共有
            </a>
            <button type="button" onClick={() => void copyLink()}>
              <Clipboard size={17} />
              リンクをコピー
            </button>
            {typeof navigator !== 'undefined' && 'share' in navigator ? (
              <button type="button" onClick={() => void nativeShare()}>
                <Share2 size={17} />
                共有
              </button>
            ) : null}
          </div>
        </output>
      ) : null}
      {message ? <output className="step-message">{message}</output> : null}
    </section>
  );
}
