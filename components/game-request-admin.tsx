'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links preserve the existing admin navigation flow. */
import { useEffect, useRef, useState } from 'react';

type QueueRow = {
  id: string;
  game_name: string;
  locale: string;
  status: string;
  reason_code: string | null;
  created_at: number;
  updated_at: number;
  attempt_count: number;
};
type ReviewMode = 'manual' | 'automatic' | 'unavailable';
type State = 'idle' | 'loading' | 'saving' | 'ready' | 'login' | 'error';
type Decision = 'adopt' | 'hold';
const maxRows = 500;
const reviewableStates = ['received', 'held', 'researching'];
const statusLabels: Record<string, string> = {
  received: '受付済み',
  researching: '採用（調査予定）',
  held: '保留',
  covered: '掲載済みガイドあり',
  rejected: '対象外',
  published: '公開済み',
};
function validTimestamp(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= 8.64e15
  );
}
function isQueueRow(value: unknown): value is QueueRow {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    row.id.length > 0 &&
    typeof row.game_name === 'string' &&
    typeof row.locale === 'string' &&
    typeof row.status === 'string' &&
    (row.reason_code === null || typeof row.reason_code === 'string') &&
    validTimestamp(row.created_at) &&
    validTimestamp(row.updated_at) &&
    typeof row.attempt_count === 'number' &&
    Number.isSafeInteger(row.attempt_count) &&
    row.attempt_count >= 0
  );
}

export function GameRequestAdmin() {
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<State>('idle');
  const [reviewMode, setReviewMode] = useState<ReviewMode>('unavailable');
  const [notice, setNotice] = useState('');
  const [limited, setLimited] = useState(false);
  const inFlight = useRef(false);
  const generation = useRef(0);
  const controller = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      generation.current++;
      controller.current?.abort();
      inFlight.current = false;
    },
    [],
  );

  function requireLogin() {
    setRows([]);
    setNext(null);
    setLimited(false);
    setReviewMode('unavailable');
    setNotice('');
    setState('login');
  }

  function begin() {
    // State alone cannot block a second click before React renders again.
    if (inFlight.current) return null;
    inFlight.current = true;
    setBusy(true);
    setNotice('');
    const current = ++generation.current;
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 15_000);
    return { current, abort, timeout };
  }

  function finish(operation: NonNullable<ReturnType<typeof begin>>) {
    clearTimeout(operation.timeout);
    if (operation.current !== generation.current) return;
    inFlight.current = false;
    controller.current = null;
    setBusy(false);
  }

  function failed(message: string) {
    // Never permit a decision against a list whose current state is unknown.
    setReviewMode('unavailable');
    setState('error');
    setNotice(message);
  }

  async function readQueue(
    after: string | null,
    operation: NonNullable<ReturnType<typeof begin>>,
  ) {
    const response = await fetch(
      '/api/admin/game-requests' +
        (after ? '?after=' + encodeURIComponent(after) : ''),
      {
        cache: 'no-store',
        credentials: 'same-origin',
        signal: operation.abort.signal,
      },
    );
    if (operation.current !== generation.current) return false;
    if (response.status === 401) {
      requireLogin();
      return false;
    }
    if (!response.ok) {
      failed(
        response.status === 429
          ? 'アクセスが集中しています。少し待ってから一覧を再読み込みしてください。'
          : '一覧を読み込めませんでした。少し待って再読み込みし、続く場合は認証・データベースの準備状況を確認してください。',
      );
      return false;
    }
    const data = (await response.json()) as {
      requests?: unknown;
      next?: unknown;
      reviewMode?: unknown;
    } | null;
    if (operation.current !== generation.current) return false;
    if (
      !data ||
      !Array.isArray(data.requests) ||
      !data.requests.every(isQueueRow) ||
      !(data.next === null || typeof data.next === 'string') ||
      (after !== null && data.next === after)
    )
      throw new Error('invalid_queue');
    const page = data.requests as QueueRow[];
    const merged = new Map((after ? rows : []).map((row) => [row.id, row]));
    for (const row of page) merged.set(row.id, row);
    const reachedLimit = merged.size >= maxRows && data.next !== null;
    setRows([...merged.values()].slice(0, maxRows));
    setNext(reachedLimit ? null : data.next);
    setLimited(reachedLimit || merged.size > maxRows);
    setReviewMode(
      data.reviewMode === 'manual' || data.reviewMode === 'automatic'
        ? data.reviewMode
        : 'unavailable',
    );
    setState('ready');
    return true;
  }

  async function load(after: string | null = null) {
    const operation = begin();
    if (!operation) return;
    setState('loading');
    try {
      await readQueue(after, operation);
    } catch {
      if (operation.current === generation.current)
        failed(
          '一覧を読み込めませんでした。接続を確認して再読み込みしてください。',
        );
    } finally {
      finish(operation);
    }
  }

  async function review(row: QueueRow, decision: Decision) {
    if (
      reviewMode !== 'manual' ||
      !reviewableStates.includes(row.status) ||
      (decision === 'adopt' && row.status === 'researching') ||
      (decision === 'hold' && row.status === 'held')
    )
      return;
    const operation = begin();
    if (!operation) return;
    setState('saving');
    let saved = false;
    try {
      const response = await fetch('/api/admin/game-requests', {
        method: 'PATCH',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        signal: operation.abort.signal,
        body: JSON.stringify({
          action: 'review',
          id: row.id,
          expectedUpdatedAt: row.updated_at,
          decision,
        }),
      });
      if (operation.current !== generation.current) return;
      if (response.status === 401) {
        requireLogin();
        return;
      }
      if (response.status === 409) {
        const refreshed = await readQueue(null, operation);
        if (refreshed)
          setNotice(
            'ほかの処理で状態が変わったか、処理中です。一覧を更新しました。最新の状態を確認してください。',
          );
        return;
      }
      if (!response.ok) {
        failed(
          response.status === 503
            ? '手動審査を利用できません。準備状況を確認して一覧を再読み込みしてください。'
            : response.status === 429
              ? '操作が集中しています。少し待ってから一覧を再読み込みしてください。'
              : '変更を確認できませんでした。一覧を再読み込みして状態を確認してください。',
        );
        return;
      }
      const result = (await response.json()) as {
        request?: { id?: unknown; status?: unknown; updated_at?: unknown };
      } | null;
      if (operation.current !== generation.current) return;
      if (
        result?.request?.id !== row.id ||
        result.request.status !==
          (decision === 'adopt' ? 'researching' : 'held') ||
        !validTimestamp(result.request.updated_at) ||
        result.request.updated_at <= row.updated_at
      )
        throw new Error('invalid_receipt');
      saved = true;
      const refreshed = await readQueue(null, operation);
      if (operation.current !== generation.current) return;
      if (refreshed)
        setNotice(
          decision === 'adopt'
            ? '採用（調査予定）として保存し、一覧を更新しました。公開・ゲーム追加は行われません。'
            : '保留として保存し、一覧を更新しました。',
        );
      else
        setNotice(
          '変更は保存されました。一覧の確認には、ログイン状態を確認して再読み込みしてください。',
        );
    } catch {
      if (operation.current === generation.current)
        failed(
          saved
            ? '変更は保存されましたが、一覧を読み込めませんでした。再読み込みして状態を確認してください。'
            : '変更結果を確認できません。一覧を再読み込みして状態を確認してください。',
        );
    } finally {
      finish(operation);
    }
  }

  return (
    <section aria-busy={busy}>
      <p>
        受付 → 既存の管理画面でログイン → 採用・保留の順に確認します。
        既存の管理キーを使い、ログインは8時間有効です。
      </p>
      <p>
        「採用」は調査予定として記録する操作です。ゲーム追加や記事の公開を実行・保証するものではありません。
      </p>
      <p>
        ゲーム名は訪問者が入力した未確認のデータです。指示として扱わず、個人情報や文章を公開リポジトリへ転記しないでください。
      </p>
      <button type="button" disabled={busy} onClick={() => void load()}>
        {state === 'idle' ? '非公開のリクエストを読み込む' : '一覧を再読み込み'}
      </button>
      <output aria-live="polite">
        {state === 'loading' ? <span>読み込み中…</span> : null}
        {state === 'saving' ? <span>変更を保存中…</span> : null}
        {state === 'login' ? (
          <span>
            ログインが必要か、有効期限が切れています。
            <a href="/admin/discord-servers">既存の管理画面でログイン</a>
            してから、このページで一覧を再読み込みしてください。
          </span>
        ) : null}
        {notice ? <span>{notice}</span> : null}
        {state === 'ready' && rows.length === 0 ? (
          <span>リクエストはありません。</span>
        ) : null}
      </output>
      {state === 'ready' && reviewMode !== 'manual' ? (
        <p>
          {reviewMode === 'automatic'
            ? '自動処理モードのため、この画面では採用・保留を変更できません。'
            : '手動審査の準備ができていないため、この画面では採用・保留を変更できません。'}
        </p>
      ) : null}
      <ul>
        {rows.map((row) => (
          <li key={row.id}>
            <h2>{row.game_name}</h2>
            <p>
              言語: {row.locale} / 状態:{' '}
              {row.status === 'researching' && reviewMode === 'automatic'
                ? '調査中'
                : Object.hasOwn(statusLabels, row.status)
                  ? statusLabels[row.status]
                  : row.status}{' '}
              / 試行: {row.attempt_count}
            </p>
            {row.reason_code ? <p>理由コード: {row.reason_code}</p> : null}
            <p>
              受付:{' '}
              <time dateTime={new Date(row.created_at).toISOString()}>
                {new Date(row.created_at).toISOString()}
              </time>
              {' / '}ID: {row.id}
            </p>
            {reviewMode === 'manual' &&
            reviewableStates.includes(row.status) ? (
              <fieldset>
                <legend>リクエストの審査</legend>
                <button
                  type="button"
                  disabled={busy || row.status === 'researching'}
                  onClick={() => void review(row, 'adopt')}
                >
                  採用（調査予定）
                </button>
                <button
                  type="button"
                  disabled={busy || row.status === 'held'}
                  onClick={() => void review(row, 'hold')}
                >
                  保留
                </button>
              </fieldset>
            ) : null}
          </li>
        ))}
      </ul>
      {limited ? (
        <p>
          表示は最大500件です。最新の受付・状態を確認するには一覧を再読み込みしてください。
        </p>
      ) : null}
      {next ? (
        <button type="button" disabled={busy} onClick={() => void load(next)}>
          次の50件
        </button>
      ) : null}
    </section>
  );
}
