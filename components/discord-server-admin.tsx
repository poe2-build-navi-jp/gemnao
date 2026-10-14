'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoundedRequest } from './use-bounded-request';
import type { AdminDiscordServerSubmission } from '@/lib/discord-server-db';

type ViewState = 'loading' | 'login' | 'ready' | 'error';

const statusLabels: Record<string, string> = {
  pending: '審査待ち',
  approved: '公開中',
  rejected: '却下',
  expired: '期限切れ',
  closed: '募集終了',
};

export function DiscordServerAdmin() {
  const [view, setView] = useState<ViewState>('loading');
  const [submissions, setSubmissions] = useState<
    AdminDiscordServerSubmission[]
  >([]);
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const mutation = useBoundedRequest();
  const [loginBusy, setLoginBusy] = useState(false);
  const loginRequest = useRef<AbortController | null>(null);
  const mounted = useRef(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) controller.abort();
    const timer = setTimeout(cancel, 15_000);
    try {
      const response = await fetch('/api/admin/discord-servers', {
        cache: 'no-store',
        credentials: 'same-origin',
        signal: controller.signal,
      });
      if (!mounted.current || signal?.aborted) return false;
      if (response.status === 401) {
        setView('login');
        return false;
      }
      if (!response.ok) throw new Error('request failed');
      const data: unknown = await response.json();
      if (
        !data ||
        typeof data !== 'object' ||
        !('submissions' in data) ||
        !Array.isArray(data.submissions)
      )
        throw new Error('invalid response');
      if (!mounted.current || signal?.aborted) return false;
      setSubmissions(data.submissions as AdminDiscordServerSubmission[]);
      setView('ready');
      return true;
    } catch {
      if (mounted.current && !signal?.aborted) setView('error');
      return false;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    void Promise.resolve().then(() => load(controller.signal));
    return () => {
      mounted.current = false;
      controller.abort();
      loginRequest.current?.abort();
    };
  }, [load]);

  async function login(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginRequest.current) return;
    // React clears currentTarget when event dispatch ends. Keep the actual form
    // before awaiting; FormData reads pasted/autofilled DOM values without state.
    const element = event.currentTarget;
    const value = new FormData(element).get('token');
    const token = typeof value === 'string' ? value.trim() : '';
    if (!token) {
      setMessage('管理キーを入力してください。');
      element.querySelector<HTMLInputElement>('[name="token"]')?.focus();
      return;
    }
    element.querySelector<HTMLInputElement>('[name="token"]')?.blur();
    const controller = new AbortController();
    loginRequest.current = controller;
    setLoginBusy(true);
    setMessage('');
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('/api/admin/discord-servers/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        signal: controller.signal,
      });
      if (!mounted.current) return;
      if (!response.ok) {
        setMessage(
          response.status === 401
            ? '管理キーが一致しません。前後の空白を除いて、もう一度入力してください。'
            : '管理APIに接続できませんでした。通信状態を確認して再度お試しください。',
        );
        return;
      }
      clearTimeout(timer);
      element.reset();
      if (!(await load()) && mounted.current)
        setMessage(
          'ログイン後の一覧を確認できませんでした。認証状態と通信を確認し、もう一度お試しください。',
        );
    } catch {
      if (mounted.current)
        setMessage(
          '管理APIに接続できませんでした。通信状態を確認して再度お試しください。',
        );
    } finally {
      clearTimeout(timer);
      loginRequest.current = null;
      if (mounted.current) setLoginBusy(false);
    }
  }

  async function update(
    id: number,
    status: 'approved' | 'rejected' | 'expired' | 'closed',
  ) {
    if (busyId !== null || mutation.isPending()) return;
    setBusyId(id);
    setMessage('');
    const result = await mutation.send(`/api/admin/discord-servers/${id}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!result) return;
    const response = result.response;
    if (!response?.ok) {
      setBusyId(null);
      setMessage('更新の完了を確認できませんでした。再読み込みして状態を確認してください。');
      return;
    }
    await load();
    setBusyId(null);
  }

  if (view === 'loading') return <p>認証状態を確認しています…</p>;

  if (view === 'login') {
    return (
      <form className="admin-login" onSubmit={login} aria-busy={loginBusy}>
        <label>
          管理キー
          <input
            id="discord-admin-token"
            type="password"
            enterKeyHint="go"
            readOnly={loginBusy}
            name="token"
            required
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>
        <button type="submit" disabled={loginBusy}>
          {loginBusy ? '確認中…' : '管理画面を開く'}
        </button>
        <output className="admin-login-status" aria-live="polite">
          {loginBusy ? '認証を確認しています…' : ''}
        </output>
        {message ? (
          <p className="contact-error" role="alert">
            {message}
          </p>
        ) : null}
      </form>
    );
  }

  if (view === 'error')
    return (
      <div>
        <p className="contact-error" role="alert">
          申請一覧を読み込めませんでした。{message}
        </p>
        <button
          className="admin-login-retry"
          type="button"
          onClick={() => {
            setMessage('');
            setView('loading');
            void load();
          }}
        >
          認証状態を再確認する
        </button>
      </div>
    );

  return (
    <section className="admin-server-list">
      <div className="admin-server-summary">
        <strong>
          {submissions.filter((item) => item.status === 'pending').length}
          件の審査待ち
        </strong>
        <button type="button" disabled={busyId !== null} onClick={() => void load()}>
          再読み込み
        </button>
      </div>
      {message ? (
        <p className="contact-error" role="alert">
          {message}
        </p>
      ) : null}
      {submissions.length ? (
        submissions.map((item) => (
          <article key={item.id} className="admin-server-card">
            <header>
              <span>{statusLabels[item.status] || item.status}</span>
              <time dateTime={item.created_at}>
                {new Date(item.created_at).toLocaleString('ja-JP')}
              </time>
            </header>
            <h2>{item.server_name}</h2>
            <dl>
              <div>
                <dt>ゲーム</dt>
                <dd>{item.game}</dd>
              </div>
              <div>
                <dt>募集目的</dt>
                <dd>{item.purposes.join('、')}</dd>
              </div>
              <div>
                <dt>プレイスタイル</dt>
                <dd>{item.styles.join('、') || '指定なし'}</dd>
              </div>
              <div>
                <dt>活動時間</dt>
                <dd>{item.activeTimes.join('、')}</dd>
              </div>
              <div>
                <dt>VC</dt>
                <dd>{item.voice_chat}</dd>
              </div>
              <div>
                <dt>紹介</dt>
                <dd>{item.description}</dd>
              </div>
              <div>
                <dt>参加条件</dt>
                <dd>{item.requirements}</dd>
              </div>
              <div>
                <dt>禁止事項</dt>
                <dd>{item.rules}</dd>
              </div>
              <div>
                <dt>運営者</dt>
                <dd>{item.owner_discord}</dd>
              </div>
              <div>
                <dt>返信先</dt>
                <dd>{item.reply_email}</dd>
              </div>
              <div>
                <dt>招待URL</dt>
                <dd>
                  <a
                    href={item.invite_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.invite_url}
                  </a>
                </dd>
              </div>
            </dl>
            {item.status === 'pending' ? (
              <div className="admin-server-actions">
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => void update(item.id, 'approved')}
                >
                  承認して公開
                </button>
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => void update(item.id, 'rejected')}
                >
                  却下
                </button>
              </div>
            ) : item.status === 'approved' ? (
              <div className="admin-server-actions">
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => void update(item.id, 'closed')}
                >
                  募集終了
                </button>
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() => void update(item.id, 'expired')}
                >
                  期限切れ
                </button>
              </div>
            ) : null}
          </article>
        ))
      ) : (
        <p>申請はまだありません。</p>
      )}
    </section>
  );
}
