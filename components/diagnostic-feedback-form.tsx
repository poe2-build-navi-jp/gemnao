'use client';
import { useEffect, useRef, useState } from 'react';
import {
  actionIds,
  outcomes,
  symptoms,
  parseReport,
  MAX_REPORT_BYTES,
  type Report,
} from '@/lib/diagnostic-feedback/contract';
import { strictJson } from '@/lib/diagnostic-feedback/json';
const labels: Record<string, string> = {
  'launch-crash': '起動時クラッシュ',
  'black-screen': '黒い画面',
  'graphics-error': '描画エラー',
  'shader-preparation': 'シェーダー準備中',
  'in-game-crash': 'プレイ中クラッシュ',
  unknown: '不明',
  resolved: '解決した',
  improved: '改善した',
  unchanged: '変わらない',
  worse: '悪化した',
  'not-tried': '試していない',
  'wilds-files': 'Steamファイル整合性確認',
  'wilds-driver': 'ドライバーと公式情報の照合',
  'wilds-capture': '録画・オーバーレイ比較',
  'wilds-admin-flag': '管理者実行設定の確認',
  'wilds-compatibility': '互換モードの確認',
  'wilds-mods': '追加ツールの利用履歴確認',
  'wilds-traces': '既知の痕跡候補の確認',
  'wilds-textures': '高解像度DLCの確認',
  'wilds-security': '保護通知の確認',
  'wilds-requirements': '必要環境の照合',
  'wilds-records': '記録の保管・相談',
  'wilds-stop': '再テストを止めて相談',
  'wilds-steam-client-review': 'Steam本体と外部DLL候補の切り分け',
};
const random = (n: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(n)))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
const download = (text: string, name: string) => {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'text/plain;charset=utf-8' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export function DiagnosticFeedbackForm() {
  const [enabled, setEnabled] = useState(false),
    [canDelete, setCanDelete] = useState(false),
    [status, setStatus] = useState('受付状況を確認中です'),
    [report, setReport] = useState<Report | null>(null),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false);
  const [symptom, setSymptom] = useState<Report['symptom']>('launch-crash'),
    [action, setAction] = useState<(typeof actionIds)[number]>(
      'wilds-steam-client-review',
    ),
    [outcome, setOutcome] = useState<(typeof outcomes)[number]>('unknown');
  const [deleteId, setDeleteId] = useState(''),
    [deleteKey, setDeleteKey] = useState('');
  const pending = useRef<{
    receipt_id: string;
    delete_key: string;
    report: Report;
  } | null>(null);
  const lock = useRef(false);
  const fileSequence = useRef(0);
  useEffect(() => {
    fetch('/api/diagnostic-feedback', {
      cache: 'no-store',
      credentials: 'same-origin',
      mode: 'same-origin',
      redirect: 'error',
    })
      .then(
        (r) => r.json() as Promise<{ enabled?: boolean; canDelete?: boolean }>,
      )
      .then((v) => {
        setEnabled(v.enabled === true);
        setCanDelete(v.canDelete === true);
        setStatus(
          v.enabled
            ? '受付できます。内容確認後に任意で送信できます'
            : v.canDelete
              ? '新規受付は停止中です。内容確認と受付済み報告の削除は利用できます'
              : '受付は準備中です。読み込み・確認だけ利用でき、送信されません',
        );
      })
      .catch(() => setStatus('受付を確認できません。送信できません'));
  }, []);
  const reset = (value: Report | null) => {
    pending.current = null;
    setReport(value);
    setConsent(false);
    setSent(false);
  };
  async function importFile(file?: File) {
    const sequence = ++fileSequence.current;
    if (lock.current) return;
    reset(null);
    if (!file) return;
    try {
      if (file.size > MAX_REPORT_BYTES)
        throw new Error('ファイルは4KB以内です。ZIP・生ログは読み込めません');
      const parsed = parseReport(strictJson(await file.text()));
      if (sequence !== fileSequence.current) return;
      reset(parsed);
      setStatus('端末内で読み込みました。まだ送信していません');
    } catch (e) {
      if (sequence === fileSequence.current)
        setStatus(e instanceof Error ? e.message : '読み込めません');
    }
  }
  async function submit() {
    if (lock.current || !enabled || !report || !consent || sent) return;
    lock.current = true;
    setBusy(true);
    try {
      if (!pending.current) {
        const key = random(32);
        const digest = Array.from(
          new Uint8Array(
            await crypto.subtle.digest(
              'SHA-256',
              new TextEncoder().encode(key),
            ),
          ),
        )
          .map((v) => v.toString(16).padStart(2, '0'))
          .join('');
        pending.current = {
          receipt_id:
            Math.floor(Date.now() / 1000)
              .toString(16)
              .padStart(8, '0') + digest.slice(0, 24),
          delete_key: key,
          report,
        };
      }
      setDeleteId(pending.current.receipt_id);
      setDeleteKey(pending.current.delete_key);
      const response = await fetch('/api/diagnostic-feedback', {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        redirect: 'error',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pending.current, consent_version: 1 }),
      });
      const value = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || value.ok !== true)
        throw new Error(value.error || '保存を確認できません');
      setSent(true);
      setStatus('保存を確認しました。削除用の受付情報を保存してください');
    } catch (e) {
      setStatus(
        (e instanceof Error ? e.message : '保存を確認できません') +
          '。再試行は同じ受付番号を使います',
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function remove() {
    if (lock.current || !canDelete) return;
    lock.current = true;
    setBusy(true);
    try {
      const response = await fetch('/api/diagnostic-feedback', {
        method: 'DELETE',
        credentials: 'same-origin',
        mode: 'same-origin',
        redirect: 'error',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receipt_id: deleteId.trim(),
          delete_key: deleteKey.trim(),
        }),
      });
      if (!response.ok) throw new Error('削除を確認できません');
      setStatus(
        '削除リクエストを処理しました。受付番号と削除キーが一致する保存データは削除されます',
      );
      setSent(true);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : '削除を確認できません');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const cls =
    'rounded border border-slate-300 p-2 w-full bg-white text-slate-900';
  return (
    <div className="mt-6 space-y-6">
      <output
        aria-live="polite"
        className="rounded bg-slate-100 p-4 text-slate-900"
      >
        {status}
      </output>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">1. 端末内で内容を準備</h2>
        <p>
          Windowsツールは不要です。手動入力、またはツールが書き出した専用JSONを選べます。ファイル名や生ログは送信しません。
        </p>
        <label className="block">
          専用JSON（4KB以内）
          <input
            className={cls}
            type="file"
            accept="application/json,.json"
            disabled={busy}
            onChange={(e) => void importFile(e.target.files?.[0])}
          />
        </label>
        <fieldset disabled={busy} className="space-y-3 rounded border p-4">
          <legend>手動入力（ワイルズ）</legend>
          <label className="block">
            症状
            <select
              className={cls}
              value={symptom}
              onChange={(e) => setSymptom(e.target.value as Report['symptom'])}
            >
              {symptoms.map((x) => (
                <option key={x} value={x}>
                  {labels[x]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            試した手順
            <select
              className={cls}
              value={action}
              onChange={(e) =>
                setAction(e.target.value as (typeof actionIds)[number])
              }
            >
              {actionIds.map((x) => (
                <option key={x} value={x}>
                  {labels[x]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            本人の結果
            <select
              className={cls}
              value={outcome}
              onChange={(e) =>
                setOutcome(e.target.value as (typeof outcomes)[number])
              }
            >
              {outcomes.map((x) => (
                <option key={x} value={x}>
                  {labels[x]}
                </option>
              ))}
            </select>
          </label>
          <button
            className={cls}
            onClick={() => {
              fileSequence.current++;
              reset(
                parseReport({
                  schema_version: 1,
                  game_id: 'monster-hunter-wilds',
                  symptom,
                  source: 'web-manual',
                  tool_version: '1.0.0',
                  rule_version: '1.0.0',
                  actions: [
                    { action_id: action, outcome, evidence: 'self-report' },
                  ],
                }),
              );
              setStatus('手動入力の送信候補を作りました。まだ送信していません');
            }}
          >
            この内容を確認画面へ
          </button>
        </fieldset>
      </section>
      {report && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. 送信される項目の全文</h2>
          <p>
            {report.actions
              .map((a) => `${labels[a.action_id]}：${labels[a.outcome]}`)
              .join(' ／ ')}
          </p>
          <pre className="max-h-96 overflow-auto rounded bg-slate-100 p-4 text-sm text-slate-900">
            {JSON.stringify(report, null, 2)}
          </pre>
          <p>
            受信先はゲムなおの専用Cloudflare
            D1です。ゲーム・症状・版番号・選んだ手順・本人の結果と、任意でOS/GPUの分類・ドライバー版を受け取ります。手順の選択から追加ソフト等の利用が推測される場合があります。編集者が内容を見直し、テスト後の手順改善に利用します。生ログ・氏名・メールアドレス等は送信項目に含められません。
          </p>
          <p>
            通常の保存データは30日後に期限切れとなり、毎時の削除処理で消去します。障害時は削除が遅れる場合があり、受付を自動停止します。Cloudflareのバックアップ・リクエストログは別の保持規定が適用され、即時消去を保証できません。削除後の再送防止用受付番号と削除キーのハッシュは最大30日保持します。個別回答・公開一覧・自動学習は行いません。
          </p>
          <p>
            連続送信の制限のため、Cloudflareが受け取るIPアドレスを一時的に使います。アプリには生のIPを保存せず、日ごとに変わる鍵付きハッシュと受付時刻のみを回答と分けて短期間保持します。IPv6は同じネットワーク内でまとめます。通常は次の通信または毎時の削除処理で期限切れ分を消去し、障害時は消去が遅れる場合があります。同じ回線の利用者間で制限を共有するため、時間を空けた再試行が必要になることがあります。
          </p>
          <label className="flex gap-3">
            <input
              type="checkbox"
              checked={consent}
              disabled={busy || sent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              上の項目・目的・保存期間を確認し、任意でゲムなおに送信することに同意します
            </span>
          </label>
          <button
            className={cls}
            disabled={!enabled || !consent || busy || sent}
            onClick={() => void submit()}
          >
            {busy
              ? '処理中…'
              : sent
                ? '処理済み'
                : enabled
                  ? '確認した内容だけ送信'
                  : '受付準備中・送信できません'}
          </button>
        </section>
      )}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">受付情報・削除</h2>
        <p>
          削除キーはこの画面のメモリーだけにあります。再読み込み前に保存してください。共有やURLへの貼り付けはしないでください。通信が途切れた場合も、このキーで削除を依頼できます。
        </p>
        {deleteId && (
          <button
            className={cls}
            onClick={() =>
              download(
                JSON.stringify(
                  { receipt_id: deleteId, delete_key: deleteKey },
                  null,
                  2,
                ),
                'gemnao-feedback-receipt.txt',
              )
            }
          >
            削除用の受付情報を保存
          </button>
        )}
        <label className="block">
          受付番号
          <input
            className={cls}
            maxLength={32}
            value={deleteId}
            disabled={busy}
            autoComplete="off"
            onChange={(e) => setDeleteId(e.target.value)}
          />
        </label>
        <label className="block">
          削除キー
          <input
            className={cls}
            type="password"
            maxLength={64}
            value={deleteKey}
            disabled={busy}
            autoComplete="off"
            onChange={(e) => setDeleteKey(e.target.value)}
          />
        </label>
        <button
          className={cls}
          disabled={
            !canDelete ||
            busy ||
            !/^[a-f0-9]{32}$/.test(deleteId) ||
            !/^[a-f0-9]{64}$/.test(deleteKey)
          }
          onClick={() => void remove()}
        >
          この受付番号の報告を削除
        </button>
      </section>
    </div>
  );
}
