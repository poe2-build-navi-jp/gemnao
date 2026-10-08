'use client';
/* oxlint-disable next/no-html-link-for-pages -- Deliberate document navigation for privacy. */
import { useEffect, useRef, useState } from 'react';
import {
  RULE_VERSION,
  statuses,
  type Answers,
  type ActionStatus,
} from '@/lib/diagnosis/model';
import { diagnose, actions } from '@/lib/diagnosis/rules';
import { DiagnosisSummary } from './diagnosis-result';
import { diagnosisRequest } from '@/lib/diagnosis/local';
import { readPendingShare, savePendingShare, removePendingShare, type PendingShare } from '@/lib/diagnosis/pending-share';
export function ShareControls({
  id,
  onCopy,
}: {
  id: string;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState('');
  const url =
    typeof location !== 'undefined' ? `${location.origin}/diagnosis/${id}` : '';
  return (
    <>
      <a className="diag-share-url" href={`/diagnosis/${id}`}>
        {url || '共有結果を開く'}
      </a>
      <div className="diag-share-links">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied('URLをコピーしました');
              onCopy?.();
            } catch {
              setCopied(
                'コピーできませんでした。上のURLを選択してコピーしてください。',
              );
            }
          }}
        >
          URLをコピー
        </button>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('PCゲームのトラブル診断結果です')}&url=${encodeURIComponent(url)}`}
        >
          Xで共有 ↗
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`}
        >
          LINEで共有 ↗
        </a>
      </div>
      <output>{copied}</output>
    </>
  );
}
export function SharePreview({
  answers,
  tried,
  results,
}: {
  answers: Answers;
  tried: Record<string, ActionStatus>;
  results: Record<string, ActionStatus>;
}) {
  const result = diagnose(answers, tried);
  return (
    <div className="diag-preview">
      <h3>公開する内容の確認</h3>
      <DiagnosisSummary answers={answers} />
      <p>
        優先確認：{result.recommendations.map((r) => r.action.title).join('、')}
      </p>
      <ul>
        {Object.entries({ ...tried, ...results })
          .filter(([, status]) => status !== 'untried')
          .map(([id, status]) => (
            <li key={id}>
              {actions[id]?.title}：{statuses[status]}
            </li>
          ))}
      </ul>
      <p className="diag-small">
        ゲーム名・エラー全文・ログ・ユーザー名・メールアドレス・PC内のパスは含みません。
      </p>
    </div>
  );
}
type ShareAttempt = PendingShare;
export function DiagnosisShare({
  answers,
  tried,
  results,
  shareId,
  enabled,
  onCreated,
  onMetric,
  onBusyChange,
  initialAttempt,
}: {
  answers: Answers;
  tried: Record<string, ActionStatus>;
  results: Record<string, ActionStatus>;
  shareId?: string;
  enabled: boolean;
  onCreated: (id: string) => void;
  onMetric: (event: string) => void;
  onBusyChange?: (busy: boolean) => void;
  initialAttempt?: ShareAttempt;
}) {
  const [preview, setPreview] = useState(false),
    [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [key, setKey] = useState<string | null>(null),
    [expires, setExpires] = useState<number | null>(null);
  const content = JSON.stringify({ answers, tried, results, version: RULE_VERSION });
  const [reviewedContent, setReviewedContent] = useState(content);
  const [attempt, setAttempt] = useState<ShareAttempt | null>(initialAttempt || null);
  const locked = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  // Invalidate consent before committing a render of changed local content.
  // Returning to an earlier answer must not revive an earlier confirmation.
  if (reviewedContent !== content) {
    setReviewedContent(content);
    setConfirmed(false);
  }
  const previewSnapshot = attempt?.snapshot || { answers, tried, results };
  async function create() {
    if (!mounted.current || locked.current || !preview || !enabled || shareId || !confirmed || reviewedContent !== content) return;
    locked.current = true;
    setBusy(true);
    onBusyChange?.(true);
    setError('');
    // Capture both before the session await. An uncertain save must never reuse
    // its request ID with different content, including after cancel/reopen.
    try {
      let submission: ShareAttempt = attempt || {
        version: 1,
        createdAt: Date.now(),
        ownerBinding: null,
        requestId: crypto.randomUUID().replaceAll('-', ''),
        snapshot: JSON.parse(content) as ShareAttempt['snapshot'],
      };
      try {
        if (!attempt && readPendingShare())
          throw new Error('前回の未確認送信が残っています。回答に戻るか再読み込みして回復してください。');
        savePendingShare(submission);
      } catch (e) {
        throw new Error('再試行情報を端末内に保存できないため、共有内容は送信していません。' +
          (e instanceof Error ? e.message : 'ブラウザの保存設定や空き容量を確認してください。'));
      }
      setAttempt(submission);
      const resuming = submission.ownerBinding !== null;
      const session = await diagnosisRequest<{ ownerBinding: string }>('/session', {
        requestId: submission.requestId,
        ...(submission.ownerBinding ? { resume: true } : {}),
      });
      if (!mounted.current) return;
      if (typeof session.ownerBinding !== 'string' || !/^[a-f0-9]{64}$/.test(session.ownerBinding) ||
        (submission.ownerBinding && submission.ownerBinding !== session.ownerBinding))
        throw new Error('元の管理用Cookieを確認できません。この送信を別のCookieで再作成することはできません。');
      submission = { ...submission, ownerBinding: session.ownerBinding };
      try { savePendingShare(submission); }
      catch { throw new Error('再試行情報を端末内に保存できないため、共有内容は送信していません。保存設定や空き容量を確認してください。'); }
      setAttempt(submission);
      const d = await diagnosisRequest<{
        id: string;
        recoveryKey: string | null;
        expiresAt: number;
        repeated?: boolean;
      }>('', {
        snapshot: submission.snapshot,
        requestId: submission.requestId,
        ownerBinding: submission.ownerBinding,
        ...(resuming ? { resume: true } : {}),
      });
      if (
        typeof d.id !== 'string' || !/^[a-f0-9]{32}$/.test(d.id) ||
        (d.recoveryKey !== null &&
          (typeof d.recoveryKey !== 'string' || !/^[a-f0-9]{64}$/.test(d.recoveryKey))) ||
        typeof d.expiresAt !== 'number' || !Number.isFinite(d.expiresAt)
      ) throw new Error('保存を確認できませんでした。同じ内容で再試行してください。');
      if (!mounted.current) return;
      let cleanupFailed = false;
      try { removePendingShare(submission.requestId); } catch { cleanupFailed = true; }
      onCreated(d.id);
      if (cleanupFailed) setError('共有は保存されましたが、端末内の再試行情報を消せませんでした。URLと管理キーを先に控えてください。');
      setKey(d.recoveryKey);
      setExpires(d.expiresAt);
      if (d.repeated && !d.recoveryKey)
        setError(
          '前の保存が完了していたため、同じURLを表示しています。管理キーは再表示できません。このブラウザから管理できますが、別の端末へ復元できるキーを控えていない場合は、必要に応じてこの共有を削除して作り直してください。',
        );
      setPreview(false);
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e.message : '保存できませんでした。');
    } finally {
      locked.current = false;
      if (mounted.current) {
        setBusy(false);
        onBusyChange?.(false);
      }
    }
  }
  return (
    <section className="diag-share" aria-labelledby="diag-share-title">
      <h2 id="diag-share-title">相談するときに、結果を共有</h2>
      <p>
        Discordなどで「症状は？」「何を試した？」を伝えるためのページを作れます。共有せずに診断を使うこともできます。
      </p>
      {error && (
        <p role="alert" className="diag-error">
          {error}
        </p>
      )}
      {shareId ? (
        <>
          <ShareControls id={shareId} onCopy={() => onMetric('copy')} />
          {expires && (
            <p>
              共有期限：{new Date(expires).toLocaleString('ja-JP')}
              （作成から30日）
            </p>
          )}
          {key && (
            <div className="diag-warning">
              <strong>復元用管理キーは、この画面で一度だけ表示します</strong>
              <p>
                別のブラウザで管理権限を戻すために必要です。共有相手には渡さず、安全な場所に控えてください。
              </p>
              <span className="diag-key">{key}</span>
              <button onClick={() => setKey(null)}>
                控えたので管理キーを隠す
              </button>
            </div>
          )}
          <p>端末内で記録を変えても共有ページは更新されません。</p>
          <a className="diag-link" href={`/diagnosis/manage/${shareId}`}>
            共有内容を更新・失効・削除する →
          </a>
        </>
      ) : enabled ? (
        <>
          {!preview ? (
            <button
              onClick={() => {
                setPreview(true);
                setConfirmed(false);
              }}
            >
              {initialAttempt ? '前回の送信内容を確認する' : '共有用ページを作る'}
            </button>
          ) : (
            <>
              <SharePreview {...previewSnapshot} />
              {attempt && (
                <p className="diag-notice">
                  保存の再試行は、最初に送信を確認した上の内容と同じ受付情報を使います。その後の端末内の変更は送信しません。確認済みの内容・受付情報・同じCookieか確認する秘密ではない指紋を、このブラウザに最初の操作から最大30日保存します。自動送信はしません。
                </p>
              )}
              <p className="diag-warning">
                このリンクを知っている人は、共有内容を閲覧できます。SNSや公開掲示板に貼ると、不特定多数の人に見られる可能性があります。
              </p>
              <p>
                30日で失効し、期限切れの稼働DBデータは24時間以内の削除を目標とします。バックアップや転載の扱いは
                <a href="/diagnose/privacy">保存・削除の説明</a>
                をご確認ください。
              </p>
              <label className="diag-confirm">
                <input
                  type="checkbox"
                  checked={confirmed}
                  disabled={busy}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <span>
                  上の内容と公開範囲を確認し、この内容で共有ページを作ります
                </span>
              </label>
              <button
                className="diag-primary"
                disabled={!confirmed || busy}
                onClick={create}
              >
                {busy ? '保存しています…' : '確認した内容でURLを発行'}
              </button>
              <button disabled={busy} onClick={() => setPreview(false)}>
                キャンセル
              </button>
            </>
          )}
        </>
      ) : (
        <p className="diag-notice">
          共有機能は現在準備中、または一時停止中です。診断と端末内の実施結果の記録は利用できます。
        </p>
      )}
    </section>
  );
}
