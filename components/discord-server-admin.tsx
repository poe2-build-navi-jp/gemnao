'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [submissions, setSubmissions] = useState<AdminDiscordServerSubmission[]>([]);
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/discord-servers', { cache: 'no-store' }).catch(() => null);
    if (response?.status === 401) {
      setView('login');
      return;
    }
    if (!response?.ok) {
      setView('error');
      return;
    }
    const data = (await response.json()) as { submissions?: AdminDiscordServerSubmission[] };
    setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
    setView('ready');
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/discord-servers', { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) return { unauthorized: true as const };
        if (!response.ok) throw new Error('request failed');
        return (await response.json()) as { submissions?: AdminDiscordServerSubmission[] };
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
    const response = await fetch('/api/admin/discord-servers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: form.get('token') }),
    }).catch(() => null);
    if (!response?.ok) {
      setMessage('管理キーを確認してください。');
      return;
    }
    event.currentTarget.reset();
    await load();
  }

  async function update(id: number, status: 'approved' | 'rejected' | 'expired' | 'closed') {
    setBusyId(id);
    setMessage('');
    const response = await fetch(`/api/admin/discord-servers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => null);
    setBusyId(null);
    if (!response?.ok) {
      setMessage('更新できませんでした。状態を再確認してください。');
      return;
    }
    await load();
  }

  if (view === 'loading') return <p>認証状態を確認しています…</p>;

  if (view === 'login') {
    return (
      <form className="admin-login" onSubmit={login}>
        <label>管理キー<input type="password" name="token" required autoComplete="current-password" /></label>
        <button type="submit">管理画面を開く</button>
        {message ? <p className="contact-error" role="alert">{message}</p> : null}
      </form>
    );
  }

  if (view === 'error') return <p className="contact-error">申請一覧を読み込めませんでした。</p>;

  return (
    <section className="admin-server-list">
      <div className="admin-server-summary">
        <strong>{submissions.filter((item) => item.status === 'pending').length}件の審査待ち</strong>
        <button type="button" onClick={() => void load()}>再読み込み</button>
      </div>
      {message ? <p className="contact-error" role="alert">{message}</p> : null}
      {submissions.length ? submissions.map((item) => (
        <article key={item.id} className="admin-server-card">
          <header><span>{statusLabels[item.status] || item.status}</span><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString('ja-JP')}</time></header>
          <h2>{item.server_name}</h2>
          <dl>
            <div><dt>ゲーム</dt><dd>{item.game}</dd></div>
            <div><dt>募集目的</dt><dd>{item.purposes.join('、')}</dd></div>
            <div><dt>プレイスタイル</dt><dd>{item.styles.join('、') || '指定なし'}</dd></div>
            <div><dt>活動時間</dt><dd>{item.activeTimes.join('、')}</dd></div>
            <div><dt>VC</dt><dd>{item.voice_chat}</dd></div>
            <div><dt>紹介</dt><dd>{item.description}</dd></div>
            <div><dt>参加条件</dt><dd>{item.requirements}</dd></div>
            <div><dt>禁止事項</dt><dd>{item.rules}</dd></div>
            <div><dt>運営者</dt><dd>{item.owner_discord}</dd></div>
            <div><dt>返信先</dt><dd>{item.reply_email}</dd></div>
            <div><dt>招待URL</dt><dd><a href={item.invite_url} target="_blank" rel="noopener noreferrer">{item.invite_url}</a></dd></div>
          </dl>
          {item.status === 'pending' ? (
            <div className="admin-server-actions">
              <button type="button" disabled={busyId === item.id} onClick={() => void update(item.id, 'approved')}>承認して公開</button>
              <button type="button" disabled={busyId === item.id} onClick={() => void update(item.id, 'rejected')}>却下</button>
            </div>
          ) : item.status === 'approved' ? (
            <div className="admin-server-actions">
              <button type="button" disabled={busyId === item.id} onClick={() => void update(item.id, 'closed')}>募集終了</button>
              <button type="button" disabled={busyId === item.id} onClick={() => void update(item.id, 'expired')}>期限切れ</button>
            </div>
          ) : null}
        </article>
      )) : <p>申請はまだありません。</p>}
    </section>
  );
}
