'use client';
import { useRef, useState } from 'react';
import {
  parseReport,
  type PrivateReport,
} from '@/lib/private-diagnostic/contract';
import { PrivateDiagnosticPreview } from './private-diagnostic-preview';
type Row = { receipt_id: string; created_at: number; expires_at: number };
export function PrivateDiagnosticAdmin() {
  const [rows, setRows] = useState<Row[]>([]),
    [next, setNext] = useState<string | null>(null),
    [report, setReport] = useState<PrivateReport | null>(null),
    [notice, setNotice] = useState('認証済みの運営者だけが読み込めます。'),
    [busy, setBusy] = useState(false);
  const lock = useRef(false);
  async function read(id?: string, before?: string) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setReport(null);
    setNext(null);
    if (!id) setRows([]);
    setNotice('読み込み中…');
    const c = new AbortController(),
      timer = setTimeout(() => c.abort(), 10000);
    try {
      const q = id
        ? '?id=' + encodeURIComponent(id)
        : before
          ? '?before=' + encodeURIComponent(before)
          : '';
      const r = await fetch('/api/admin/private-diagnostic' + q, {
        credentials: 'same-origin',
        cache: 'no-store',
        signal: c.signal,
      });
      if (!r.ok) {
        setRows([]);
        setNotice(
          r.status === 401
            ? '既存の運営者認証、または閲覧の有効設定が必要です。'
            : r.status === 404
              ? '見つからないか、保持期限が切れています。'
              : '読み込めませんでした（HTTP ' +
                r.status +
                '）。本文は表示しません。',
        );
        return;
      }
      const v = (await r.json()) as {
        report?: unknown;
        items: Row[];
        next: string | null;
      };
      if (id) {
        setReport(parseReport(v.report));
        setNotice('非公開の詳細を読み込みました。');
      } else {
        if (
          !Array.isArray(v.items) ||
          v.items.length > 20 ||
          v.items.some(
            (x: Row) =>
              !/^[a-f0-9]{32}$/.test(x.receipt_id) ||
              !Number.isInteger(x.created_at) ||
              !Number.isInteger(x.expires_at),
          ) ||
          (v.next !== null && !/^[a-f0-9]{32}$/.test(v.next))
        )
          throw Error();
        setRows(v.items);
        setNext(v.next);
        setNotice(
          v.items.length
            ? 'このページの受付を読み込みました。'
            : 'このページに期限内の受付はありません。',
        );
      }
    } catch {
      setRows([]);
      setReport(null);
      setNotice('通信または応答を確認できません。自動再試行はしません。');
    } finally {
      clearTimeout(timer);
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="space-y-4">
      <output aria-live="polite">{notice}</output>
      <button disabled={busy} onClick={() => void read()}>
        一覧を読む
      </button>
      <ul>
        {rows.map((row) => (
          <li key={row.receipt_id}>
            <button disabled={busy} onClick={() => void read(row.receipt_id)}>
              {row.receipt_id}
            </button>{' '}
            — {new Date(row.created_at * 1000).toISOString()} / 期限{' '}
            {new Date(row.expires_at * 1000).toISOString()}
          </li>
        ))}
      </ul>
      {next && (
        <button disabled={busy} onClick={() => void read(undefined, next)}>
          次の20件
        </button>
      )}
      {report && <PrivateDiagnosticPreview report={report} />}
    </section>
  );
}
