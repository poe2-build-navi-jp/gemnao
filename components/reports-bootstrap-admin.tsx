'use client';
import { useRef, useState, useSyncExternalStore } from 'react';

const KEY = 'gemnao-reports-bootstrap-attempt-v1';
const UUID =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
type Attempt = { status: 'sent' } | { status: 'success'; instanceId: string };

// The previous attempt in this tab, read without a state update in an effect.
// undefined = not read yet (server render / hydration); UNREADABLE = storage
// could not be read safely; null = no previous attempt.
const UNREADABLE = 'unreadable';
const noSubscribe = () => () => {};
function readStoredAttempt() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return UNREADABLE;
  }
}
/** null when the stored marker cannot be parsed (treated like unreadable). */
function parseAttempt(raw: string): Attempt | null {
  try {
    const value = JSON.parse(raw) as Partial<Attempt>;
    if (
      value.status === 'success' &&
      'instanceId' in value &&
      typeof value.instanceId === 'string' &&
      UUID.test(value.instanceId)
    )
      return { status: 'success', instanceId: value.instanceId };
    return { status: 'sent' };
  } catch {
    return null;
  }
}

export function ReportsBootstrapAdmin({ allowed }: { allowed: boolean }) {
  const attempted = useRef(false);
  const stored = useSyncExternalStore(
    noSubscribe,
    readStoredAttempt,
    () => undefined,
  );
  const storedAttempt =
    typeof stored === 'string' && stored !== UNREADABLE
      ? parseAttempt(stored)
      : null;
  const storageError =
    stored === UNREADABLE || (typeof stored === 'string' && !storedAttempt);
  const loaded = stored !== undefined && !storageError;
  const [sentAttempt, setAttempt] = useState<Attempt | null>(null);
  const attempt = sentAttempt ?? storedAttempt;
  const [busy, setBusy] = useState(false);
  const [sendMessage, setMessage] = useState('');
  const message =
    sendMessage ||
    (storageError
      ? '送信履歴を安全に確認できません。実行せず、初期化口を閉じて設定を確認してください。'
      : '');

  async function initialize() {
    if (!allowed || !loaded || storedAttempt || attempted.current) return;
    attempted.current = true;
    const sent: Attempt = { status: 'sent' };
    try {
      sessionStorage.setItem(KEY, JSON.stringify(sent));
    } catch {
      setAttempt(sent);
      setMessage(
        '送信履歴を保存できないため、実行していません。初期化口を閉じて確認してください。',
      );
      return;
    }
    setAttempt(sent);
    setBusy(true);
    setMessage('送信中です。画面を閉じず、再実行しないでください。');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      // One bodyless same-origin POST, existing HttpOnly admin session only.
      // No body, query, token input, headers, automatic retry or side-effect GET.
      const response = await fetch('/api/admin/reports-bootstrap', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        signal: controller.signal,
      });
      const value: unknown = await response.json();
      if (
        response.status === 200 &&
        value &&
        typeof value === 'object' &&
        Object.keys(value).length === 2 &&
        'ok' in value &&
        value.ok === true &&
        'instanceId' in value &&
        typeof value.instanceId === 'string' &&
        UUID.test(value.instanceId)
      ) {
        const success: Attempt = {
          status: 'success',
          instanceId: value.instanceId,
        };
        setAttempt(success);
        try {
          sessionStorage.setItem(KEY, JSON.stringify(success));
        } catch {
          /* Still show the actual result; the pre-send marker prevents replay. */
        }
        setMessage(
          'UUIDを取得しました。この値を運用担当へ渡し、Pagesとcleanupへの固定・初期化口の閉鎖を行ってください。この画面だけでは設定は変更されません。',
        );
      } else if (response.status === 401) {
        setMessage(
          '管理者認証が確認できません。再送せず、既存のログイン状態と初期化設定を確認してください。',
        );
      } else if (
        response.status === 409 &&
        value &&
        typeof value === 'object' &&
        'error' in value &&
        value.error === 'setup-closed'
      ) {
        setMessage(
          '初期化口は閉じています。この画面から設定を開くことはできません。再送しないでください。',
        );
      } else {
        setMessage(
          '初期化結果を確定できません。再実行せず、初期化口を閉じ、運用担当が状態を確認してください。',
        );
      }
    } catch {
      setMessage(
        '通信結果が不明です。初期化が済んだ可能性があります。再実行せず、初期化口を閉じ、運用担当が状態を確認してください。',
      );
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="bootstrap-title">
      <h2 id="bootstrap-title">管理記録を1回初期化</h2>
      <p>
        報告の受付はOFFのままです。既存の専用台帳に識別UUIDを作成し、既存の場合は同じUUIDを返します。報告や既存記録の削除・リセットは行いません。
      </p>
      <p>
        {allowed
          ? '一時許可の設定です。承認済みの初期化を1回だけ実行できます。'
          : '初期化は現在許可されていません。操作せず、運用担当の設定確認を待ってください。'}
      </p>
      <button
        type="button"
        disabled={!allowed || !loaded || attempt !== null || busy}
        onClick={() => void initialize()}
      >
        初期化を1回実行
      </button>
      <output aria-live="polite" style={{ display: 'block' }}>
        {message ||
          (attempt?.status === 'sent'
            ? 'このタブでは送信済みです。結果を確定できないため再実行せず、初期化口を閉じて確認してください。'
            : '')}
      </output>
      {attempt?.status === 'success' && (
        <div>
          <h3>返却されたUUID</h3>
          <code style={{ overflowWrap: 'anywhere' }}>{attempt.instanceId}</code>
          <p>
            このUUIDは認証情報ではありません。初回作成か既存台帳かは、この応答だけでは判別できません。
          </p>
        </div>
      )}
      <p>
        送信後の自動再試行や再実行ボタンはありません。画面を更新しても、このタブの送信履歴と成功時のUUIDだけを保持します。別タブや別ブラウザからも再実行しないでください。
      </p>
    </section>
  );
}
