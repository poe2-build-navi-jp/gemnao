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
import {
  sendStepResult,
  StepResultError,
  readPendingStepResults,
  hasFeedbackVote,
  markFeedbackVote,
} from '@/lib/step-result-client';
import type { AdvanceCheck } from '@/lib/step-navigation';
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
  nextStepId?: string;
  id: string;
  title: string;
  summary?: string;
  advanceCheck?: AdvanceCheck;
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
type Method = {
  methodId: string;
  methodLabel: string;
  responses: number;
  notResolved?: number;
};
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
    confirmedStepIds: string[];
    currentStep: number;
    completedIds: string[];
    solvedStepId: string;
    showResume: boolean;
    message: string;
    reports: Record<
      string,
      {
        step: Step;
        resolved: boolean;
        final: boolean;
        status: 'sending' | 'sent' | 'already' | 'error';
        error?: string;
        retryable?: boolean;
      }
    >;
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
    confirmedStepIds: [],
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
    reports: {},
    outcome: null,
  };
  const firstCheck = steps.findIndex((step) => step.advanceCheck);
  if (
    !initial.solvedStepId &&
    firstCheck >= 0 &&
    initial.currentStep > firstCheck
  )
    initial.currentStep = firstCheck;
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
  const [collection, setCollection] = useState<{
    context: string;
    status: 'loading' | 'unavailable' | 'available';
    legacyAvailable: boolean;
  }>({ context: '', status: 'loading', legacyAvailable: false });
  const canCollectResults =
    collection.context === contextSlug && collection.status === 'available';
  const canCollectLegacy =
    collection.context === contextSlug && collection.legacyAvailable;
  const collectionLoading =
    collection.context !== contextSlug || collection.status === 'loading';
  // Anonymous submission status survives saves of the same private note.
  // Private outcome/note drafts above remain revision-scoped.
  const reportScope = JSON.stringify([articlePath, activeCase]);
  const [submissionReports, setSubmissionReports] = useState<
    Record<string, Session['reports']>
  >({});
  const reports = submissionReports[reportScope] || {};
  const [pendingRecovery, setPendingRecovery] = useState<{
    context: string;
    values: ReturnType<typeof readPendingStepResults>;
  }>({ context: '', values: [] });
  function refreshPendingRecovery() {
    setPendingRecovery({
      context: contextSlug,
      values: readPendingStepResults(
        contextSlug,
        topic,
        steps.map((step) => step.id),
      ),
    });
  }
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active)
        setPendingRecovery({
          context: contextSlug,
          values: readPendingStepResults(
            contextSlug,
            topic,
            steps.map((step) => step.id),
          ),
        });
    });
    return () => {
      active = false;
    };
  }, [contextSlug, topic, scope, steps]);
  const visibleContext = useRef(contextSlug);
  useEffect(() => {
    visibleContext.current = contextSlug;
    return () => {
      visibleContext.current = '';
    };
  }, [contextSlug]);

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
        if (!response.ok) throw new Error('unavailable');
        const data = (await response.json()) as {
          rows?: Row[];
          methods?: Method[];
          stepResultsAvailable?: boolean;
        };
        if (controller.signal.aborted) return;
        if (
          !Array.isArray(data.rows) ||
          !Array.isArray(data.methods) ||
          typeof data.stepResultsAvailable !== 'boolean'
        )
          throw new Error('invalid capability response');
        setRows(data.rows || []);
        setMethods(data.methods || []);
        setCollection({
          context: contextSlug,
          status: data.stepResultsAvailable ? 'available' : 'unavailable',
          legacyAvailable: true,
        });
      } catch {
        if (!controller.signal.aborted)
          setCollection({
            context: contextSlug,
            status: 'unavailable',
            legacyAvailable: false,
          });
        return;
      }
    }
    void loadFeedback();
    return () => controller.abort();
  }, [articlePath, articleTitle, contextSlug, steps, storageKey, voteKey]);

  function hasVote(kind: string) {
    return hasFeedbackVote(`${voteKey}:${kind}`);
  }
  function markVote(kind: string) {
    markFeedbackVote(`${voteKey}:${kind}`);
  }

  function updateReport(report: Session['reports'][string]) {
    setSubmissionReports((previous) => ({
      ...previous,
      [reportScope]: {
        ...previous[reportScope],
        [`${report.step.id}:${report.resolved}`]: report,
      },
    }));
  }
  async function reportResult(step: Step, resolved: boolean, final: boolean) {
    if (!canCollectResults) return;
    updateReport({ step, resolved, final, status: 'sending' });
    try {
      const result = await sendStepResult({
        game: contextSlug,
        topic,
        method: step.id,
        outcome: resolved ? 'resolved' : 'not-resolved',
        reportStruggling: !resolved && final && !hasVote('struggling'),
      });
      updateReport({ step, resolved, final, status: result });
      if (visibleContext.current === contextSlug) refreshPendingRecovery();
      // This response belongs to the captured article/saved-case scope.
      // Aggregate refresh is best effort and must never undo an acknowledgement.
      if (visibleContext.current !== contextSlug) return;
      try {
        const response = await fetch(
          `/api/feedback?game=${encodeURIComponent(contextSlug)}`,
        );
        if (!response.ok) return;
        const data = (await response.json()) as {
          rows?: Row[];
          methods?: Method[];
        };
        if (visibleContext.current === contextSlug) {
          setRows(data.rows || []);
          setMethods(data.methods || []);
        }
      } catch {
        /* The vote is saved even if the fresh totals are unavailable. */
      }
    } catch (error) {
      if (visibleContext.current === contextSlug) refreshPendingRecovery();
      // Keep acknowledgement intact when only the aggregate refresh failed.
      updateReport({
        step,
        resolved,
        final,
        status: 'error',
        retryable: !(error instanceof StepResultError) || error.retryable,
        error:
          error instanceof Error
            ? error.message
            : '送信完了を確認できませんでした。同じ回答を再送できます。',
      });
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
    if (canCollectResults) {
      await reportResult(step, true, false);
      return;
    }
    if (!canCollectLegacy) {
      updateReport({
        step,
        resolved: true,
        final: false,
        status: 'error',
        error:
          '匿名集計への接続を確認できていないため、回答は送信していません。ノートは別に保存できます。',
        retryable: true,
      });
      return;
    }
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

  function nextIndex(step: Step, index: number) {
    const target = steps.findIndex(
      (candidate) => candidate.id === step.nextStepId,
    );
    return target > index ? target : Math.min(index + 1, steps.length - 1);
  }

  async function notSolved(step: Step, index: number) {
    if (solvedStepId) return;
    const nextCompleted = [...new Set([...completedIds, step.id])];
    updateSession({
      currentStep: nextIndex(step, index),
      completedIds: nextCompleted,
      showResume: false,
      message: '',
      outcome: {
        step,
        resolved: false,
        nextId: steps[nextIndex(step, index)].id,
        at: new Date().toISOString(),
      },
    });
    if (canCollectResults) {
      await reportResult(step, false, index === steps.length - 1);
      return;
    }
    if (!canCollectLegacy) {
      updateReport({
        step,
        resolved: false,
        final: index === steps.length - 1,
        status: 'error',
        error:
          '匿名集計への接続を確認できていないため、回答は送信していません。ノートは別に保存できます。',
        retryable: true,
      });
      return;
    }
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
              <strong>「直った」と回答された方法</strong>
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
        <p className="procedure-note">
          {canCollectResults
            ? '実際に試した結果を教えてください。「これで直った」「試したが直らない」を押すと、この記事の症状・STEP・結果を匿名の回答数として集計します。ノートの内容は送信しません。'
            : collectionLoading
              ? '匿名集計への接続を確認中です。手順やノートは利用できます。接続確認前の結果は送信されません。'
              : '実際に試した結果を選んで、次の手順やノートに進めます。方法別の「直らなかった」の集計は、現在このページでは利用できません。'}
        </p>
        {canCollectResults && (
          <p className="procedure-note">
            「直らなかった」は新機能開始後の回答だけです。以前の未解決回答には方法の記録がありません。過去の解決回答も含む匿名集計のため、同じ人の回答や動作確認の回答を区別できません。回答数は人数や成功率ではなく、効果を保証するものではありません。
          </p>
        )}
        {canCollectResults &&
          pendingRecovery.context === contextSlug &&
          pendingRecovery.values.length > 0 && (
            <aside className="procedure-note" aria-label="未確認の匿名回答">
              <p>
                このブラウザで、送信完了を確認できていない匿名回答があります。ノートとは別に、元のSTEP・結果のまま確認できます。
              </p>
              {pendingRecovery.values.map((pending) => {
                const step = steps.find((item) => item.id === pending.method);
                return (
                  step && (
                    <p key={`${pending.method}:${pending.outcome}`}>
                      「{step.title}」：
                      {pending.outcome === 'resolved'
                        ? '直った'
                        : '試したが直らなかった'}
                      {pending.retryable ? (
                        <button
                          type="button"
                          className="step-next"
                          onClick={() =>
                            void reportResult(
                              step,
                              pending.outcome === 'resolved',
                              pending.reportStruggling,
                            )
                          }
                        >
                          元の回答の送信を確認
                        </button>
                      ) : (
                        '（送信番号が期限切れ、または確認できないため再送できません）'
                      )}
                    </p>
                  )
                );
              })}
            </aside>
          )}
        <div className="procedure-list">
          {steps.map((step, index) => {
            const prerequisite =
              !solvedStepId &&
              steps
                .slice(0, index)
                .find(
                  (prior) =>
                    prior.advanceCheck &&
                    !session.confirmedStepIds.includes(prior.id),
                );
            const completed = completedIds.includes(step.id);
            const solvedHere = solvedStepId === step.id;
            return (
              <section
                className={`procedure-card interactive-step${index === currentStep ? ' current' : ''}${completed ? ' completed' : ''}`}
                id={step.id}
                tabIndex={-1}
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
                    {canCollectResults &&
                      methods.some(
                        (method) =>
                          method.methodId === step.id &&
                          Number.isSafeInteger(method.notResolved) &&
                          (method.notResolved || 0) > 0,
                      ) && (
                        <p>
                          このSTEPで直らなかった回答：
                          {
                            methods.find(
                              (method) => method.methodId === step.id,
                            )?.notResolved
                          }
                          件（新機能開始後）
                        </p>
                      )}
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
                {step.guideLink && (!step.nextStepId || !solvedStepId) ? (
                  <p className="procedure-note">
                    {step.guideLink.description}{' '}
                    <a href={step.guideLink.href}>{step.guideLink.label} →</a>
                  </p>
                ) : null}
                <TroubleshootingProduct
                  articlePath={articlePath}
                  step={index + 1}
                />
                {!solvedStepId &&
                  !prerequisite &&
                  !step.advanceCheck &&
                  index < steps.length - 1 && (
                    <p className="step-skip">
                      <a
                        href={`#${steps[nextIndex(step, index)].id}`}
                        onClick={() =>
                          updateSession({
                            currentStep: nextIndex(step, index),
                            showResume: false,
                            outcome: null,
                          })
                        }
                      >
                        対象外なら「{steps[nextIndex(step, index)].title}
                        」へスキップ
                      </a>
                    </p>
                  )}
                {prerequisite ? (
                  <p className="procedure-note">
                    先に「{prerequisite.title}」で前提条件を確認してください。
                    <a href={`#${prerequisite.id}`}>認識の確認へ戻る</a>
                  </p>
                ) : (
                  <>
                    {!solvedStepId && step.advanceCheck && (
                      <p className="procedure-note">
                        {step.advanceCheck.prompt}
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
                        {solvedHere
                          ? 'この方法で解決済み'
                          : step.advanceCheck?.resolvedLabel || 'これで直った'}
                      </button>
                      {!solvedStepId && step.advanceCheck ? (
                        <>
                          <a
                            className="step-next"
                            href={step.advanceCheck.unresolvedHref}
                            onClick={() =>
                              updateSession({
                                currentStep: index,
                                confirmedStepIds:
                                  session.confirmedStepIds.filter(
                                    (id) => id !== step.id,
                                  ),
                                showResume: false,
                                outcome: null,
                              })
                            }
                          >
                            {step.advanceCheck.unresolvedLabel}
                          </a>
                          <a
                            className="step-next step-confirm"
                            href={`#${steps[index + 1]?.id}`}
                            onClick={() =>
                              updateSession({
                                confirmedStepIds: [
                                  ...new Set([
                                    ...session.confirmedStepIds,
                                    step.id,
                                  ]),
                                ],
                                currentStep: Math.min(
                                  index + 1,
                                  steps.length - 1,
                                ),
                                showResume: false,
                                outcome: null,
                              })
                            }
                          >
                            {step.advanceCheck.confirmedLabel}
                          </a>
                        </>
                      ) : !solvedStepId ? (
                        <button
                          className="step-next"
                          type="button"
                          onClick={() => void notSolved(step, index)}
                        >
                          {index < steps.length - 1
                            ? `試したが直らない → 次は「${steps[nextIndex(step, index)].title}」を確認`
                            : '試したが直らない'}
                          <ChevronRight size={17} />
                        </button>
                      ) : null}
                    </div>
                  </>
                )}
                {Object.values(reports)
                  .filter((report) => report.step.id === step.id)
                  .map((report) => (
                    <output
                      className="procedure-note"
                      key={`${report.step.id}:${report.resolved}`}
                      aria-live="polite"
                    >
                      {report.status === 'sending'
                        ? '匿名回答を送信中…'
                        : report.status === 'sent'
                          ? 'この症状・方法・結果の匿名回答を記録しました。'
                          : report.status === 'already'
                            ? report.resolved
                              ? 'この記事の解決回答はこのブラウザから送信済みです。方法別の追加送信は行いません。ノートは別に保存できます。'
                              : 'このSTEPの未解決回答はこのブラウザから送信済みです。ノートは別に保存できます。'
                            : report.error ||
                              '匿名回答の送信完了を確認できませんでした。'}
                      {report.status === 'error' &&
                        report.retryable !== false &&
                        canCollectResults && (
                          <button
                            type="button"
                            className="step-next"
                            onClick={() =>
                              void reportResult(
                                report.step,
                                report.resolved,
                                report.final,
                              )
                            }
                          >
                            同じ回答を再送
                          </button>
                        )}
                    </output>
                  ))}
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
