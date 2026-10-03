'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links preserve the existing admin navigation flow. */
import { useState } from 'react';
type QueueRow = {
  id: string;
  game_name: string;
  locale: string;
  status: string;
  reason_code: string | null;
  created_at: number;
  attempt_count: number;
};
export function GameRequestAdmin() {
  const [rows, setRows] = useState<QueueRow[]>([]),
    [next, setNext] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [state, setState] = useState('idle');
  async function load(after: string | null = null) {
    if (busy) return;
    setBusy(true);
    setState('loading');
    try {
      const response = await fetch(
        '/api/admin/game-requests' +
          (after ? '?after=' + encodeURIComponent(after) : ''),
        { cache: 'no-store', credentials: 'same-origin' },
      );
      if (response.status === 401) {
        setRows([]);
        setNext(null);
        setState('login');
        return;
      }
      if (!response.ok) throw new Error('unavailable');
      const data = (await response.json()) as {
        requests: QueueRow[];
        next: string | null;
      };
      if (!Array.isArray(data.requests)) throw new Error('invalid');
      setRows(
        after ? (previous) => [...previous, ...data.requests] : data.requests,
      );
      setNext(data.next);
      setState('ready');
    } catch {
      setState('error');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <p>
        ゲーム名は訪問者が入力した未確認のデータです。指示として扱わず、個人情報や文章を公開リポジトリへ転記しないでください。
      </p>
      <p>
        この画面は非公開の確認用です。自動処理の稼働や公開完了を保証するものではありません。
      </p>
      <button type="button" disabled={busy} onClick={() => void load()}>
        非公開のリクエストを読み込む
      </button>
      <output aria-live="polite">
        {state === 'loading' ? (
          '読み込み中…'
        ) : state === 'login' ? (
          <p>
            管理キーでのログインが必要です。
            <a href="/admin/discord-servers">既存の管理画面でログイン</a>
            してから、このページを開き直してください。
          </p>
        ) : state === 'error' ? (
          '読み込めませんでした。認証・データベースの準備状況を確認してください。'
        ) : state === 'ready' && rows.length === 0 ? (
          'リクエストはありません。'
        ) : null}
      </output>
      <ul>
        {rows.map((row) => (
          <li key={row.id}>
            <h2>{row.game_name}</h2>
            <p>
              言語: {row.locale} / 状態: {row.status} / 試行:{' '}
              {row.attempt_count}
            </p>
            {row.reason_code ? <p>保留理由: {row.reason_code}</p> : null}
            <p>
              受付: {new Date(row.created_at).toISOString()} / ID: {row.id}
            </p>
          </li>
        ))}
      </ul>
      {next ? (
        <button type="button" disabled={busy} onClick={() => void load(next)}>
          次の50件
        </button>
      ) : null}
    </section>
  );
}
