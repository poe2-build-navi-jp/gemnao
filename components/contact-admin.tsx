'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  AdminContactSubmission,
  ContactSubmissionStatus,
} from '@/lib/contact-db';

type ViewState = 'loading' | 'login' | 'ready' | 'error';

const categoryLabels: Record<string, string> = {
  correction: '記事の誤り・古い情報',
  rights: '著作権・権利関係',
  privacy: 'プライバシー',
  other: 'その他',
  server_submission: 'サーバー掲載',
  server_report: 'サーバー報告',
};

const statusLabels: Record<ContactSubmissionStatus, string> = {
  new: '未確認',
  reviewing: '確認中',
  resolved: '対応済み',
};

export function ContactAdmin() {
  const [view, setView] = useState<ViewState>('loading');
  const [submissions, setSubmissions] = useState<AdminContactSubmission[]>([]);
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/contacts', {
      cache: 'no-store',
      credentials: 'same-origin',
    }).catch(() => null);
    if (response?.status === 401) {
      setView('login');
      return;
    }
    if (!response?.ok) {
      setView('error');
      return;
    }
    const data = (await response.json()) as {
      submissions?: AdminContactSubmission[];
    };
    setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
    setView('ready');
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/contacts', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
      .then(async (response) => {
        if (response.status === 401) return { unauthorized: true as const };
        if (!response.ok) throw new Error('request failed');
        return (await response.json()) as {
          submissions?: AdminContactSubmission[];
        };
      })
      .then((data) => {
        if (!active) return;
        if ('unauthorized' in data) {
          setView('login');
          return;
        }
        setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
        setView('ready');
      })
      .catch(() => {
        if (active) setView('error');
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const token = form.get('token');
    const response = await fetch('/api/admin/discord-servers/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: typeof token === 'string' ? token.trim() : '',
      }),
    }).catch(() => null);
    if (!response?.ok) {
      setMessage(
        response?.status === 401
          ? '管理キーが一致しません。前後の空白を除いて、もう一度入力してください。'
          : '管理APIに接続できませんでした。通信状態を確認して再度お試しください。',
      );
      return;
    }
    event.currentTarget.reset();
    await load();
  }

  async function update(id: number, status: ContactSubmissionStatus) {
    setBusyId(id);
    setMessage('');
    const response = await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => null);
    setBusyId(null);
    if (!response?.ok) {
      setMessage('状態を更新できませんでした。再度お試しください。');
      return;
    }
    await load();
  }

  if (view === 'loading') return <p>認証状態を確認しています…</p>;

  if (view === 'login') {
    return (
      <form className="admin-login" onSubmit={login}>
        <label>
          管理キー
          <input
            type="password"
            name="token"
            required
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>
        <button type="submit">管理画面を開く</button>
        {message ? (
          <p className="contact-error" role="alert">
            {message}
          </p>
        ) : null}
      </form>
    );
  }

  if (view === 'error') {
    return <p className="contact-error">お問い合わせを読み込めませんでした。</p>;
  }

  return (
    <section className="admin-server-list">
      <div className="admin-server-summary">
        <strong>
          {submissions.filter((item) => item.status === 'new').length}件の未確認
        </strong>
        <button type="button" onClick={() => void load()}>
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
            <h2>{categoryLabels[item.category] || item.category}</h2>
            <dl>
              <div>
                <dt>内容</dt>
                <dd className="admin-contact-message">{item.message}</dd>
              </div>
              <div>
                <dt>対象ページ</dt>
                <dd>
                  {item.page_url.startsWith('https://gemnao.pages.dev/') ? (
                    <a href={item.page_url} target="_blank" rel="noopener noreferrer">
                      {item.page_url}
                    </a>
                  ) : (
                    '指定なし'
                  )}
                </dd>
              </div>
              <div>
                <dt>返信先</dt>
                <dd>
                  {item.reply_email ? (
                    <a href={`mailto:${item.reply_email}`}>{item.reply_email}</a>
                  ) : (
                    '未入力（個別返信なし）'
                  )}
                </dd>
              </div>
            </dl>
            <div className="admin-server-actions">
              {item.status !== 'reviewing' ? (
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void update(item.id, 'reviewing')}
                >
                  確認中にする
                </button>
              ) : null}
              {item.status !== 'resolved' ? (
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void update(item.id, 'resolved')}
                >
                  対応済みにする
                </button>
              ) : null}
              {item.status !== 'new' ? (
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => void update(item.id, 'new')}
                >
                  未確認へ戻す
                </button>
              ) : null}
            </div>
          </article>
        ))
      ) : (
        <p>お問い合わせはまだありません。</p>
      )}
    </section>
  );
}
