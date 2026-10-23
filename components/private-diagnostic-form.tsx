'use client';
import { privateDiagnosticPolicy, privateDiagnosticPurpose } from '@/lib/private-diagnostic/policy';
import { useEffect, useRef, useState } from 'react';
import {
  parseEnvelope,
  parseReport,
  MAX_REPORT_BYTES,
  type PrivateReport,
} from '@/lib/private-diagnostic/contract';
import { strictJson } from '@/lib/diagnostic-feedback/json';
import { PrivateDiagnosticPreview } from './private-diagnostic-preview';
type Pending = {
  receipt_id: string;
  delete_key: string;
  report: PrivateReport;
};
type Phase =
  | 'idle'
  | 'sending'
  | 'rejected'
  | 'uncertain'
  | 'saved'
  | 'deleted';
const hex = (bytes: Uint8Array) =>
  Array.from(bytes, (x) => x.toString(16).padStart(2, '0')).join('');
function download(value: unknown) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gemnao-private-receipt.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function PrivateDiagnosticForm() {
  const [en, setEn] = useState(false),
    [enabled, setEnabled] = useState(false),
    [canDelete, setCanDelete] = useState(false),
    [report, setReport] = useState<PrivateReport | null>(null),
    [consent, setConsent] = useState(false),
    [phase, setPhase] = useState<Phase>('idle'),
    [notice, setNotice] = useState(''),
    [pending, setPending] = useState<Pending | null>(null),
    [busy, setBusy] = useState(false);
  const lock = useRef(false),
    generation = useRef(0),
    active = useRef<AbortController | null>(null);
  const t = (ja: string, english: string) => (en ? english : ja);
  useEffect(() => {
    const c = new AbortController();
    const timer = setTimeout(() => c.abort(), 10000);
    fetch('/api/private-diagnostic', {
      credentials: 'omit',
      cache: 'no-store',
      signal: c.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json() as Promise<{ enabled?: boolean; canDelete?: boolean }>;
      })
      .then((v) => {
        setEnabled(v.enabled === true);
        setCanDelete(v.canDelete === true);
      })
      .catch(() => {
        setEnabled(false);
      })
      .finally(() => clearTimeout(timer));
    return () => {
      c.abort();
      active.current?.abort();
    };
  }, []);
  async function importFile(file?: File) {
    if (lock.current || pending) return;
    const seq = ++generation.current;
    setReport(null);
    setConsent(false);
    setPhase('idle');
    setNotice('');
    if (!file) return;
    try {
      if (file.size > MAX_REPORT_BYTES + 1024) throw Error();
      const value = strictJson(await file.text());
      let next: PrivateReport,
        restore: Pending | null = null;
      if (value && typeof value === 'object' && 'receipt_id' in value) {
        const parsed = parseEnvelope(value);
        next = parsed.report!;
        restore = {
          receipt_id: parsed.receipt_id,
          delete_key: parsed.delete_key,
          report: next,
        };
      } else next = parseReport(value);
      if (seq !== generation.current) return;
      setReport(next);
      setPending(restore);
      setPhase(restore ? 'uncertain' : 'idle');
    } catch {
      if (seq === generation.current)
        setNotice(
          t(
            '対応する選別済みJSONを読み込めません。TXT・ZIP・生ログは送れません。',
            'Cannot import a supported sanitized JSON. TXT, ZIP and raw logs are not accepted.',
          ),
        );
    }
  }
  async function submit() {
    if (
      lock.current ||
      !enabled ||
      !report ||
      !consent ||
      phase === 'saved' ||
      phase === 'deleted'
    )
      return;
    lock.current = true;
    setBusy(true);
    setPhase('sending');
    setNotice('');
    let dispatched = false;
    try {
      let p = pending;
      if (!p) {
        const key = hex(crypto.getRandomValues(new Uint8Array(32)));
        const digest = hex(
          new Uint8Array(
            await crypto.subtle.digest(
              'SHA-256',
              new TextEncoder().encode(key),
            ),
          ),
        );
        p = {
          receipt_id:
            Math.floor(Date.now() / 1000)
              .toString(16)
              .padStart(8, '0') + digest.slice(0, 24),
          delete_key: key,
          report,
        };
        setPending(p);
      }
      const controller = new AbortController();
      active.current = controller;
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        dispatched = true;
        const response = await fetch('/api/private-diagnostic', {
          method: 'POST',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...p, consent_version: 1 }),
          signal: controller.signal,
        });
        if (response.status >= 400 && response.status < 500) {
          setPhase('rejected');
          return;
        }
        const value = (await response.json()) as {
          ok?: boolean;
          receipt_id?: string;
          expires_at?: number;
        };
        if (
          !response.ok ||
          value.ok !== true ||
          value.receipt_id !== p.receipt_id ||
          !Number.isInteger(value.expires_at)
        )
          throw Error();
        setPhase('saved');
      } finally {
        clearTimeout(timer);
        active.current = null;
      }
    } catch {
      setPhase(dispatched ? 'uncertain' : 'rejected');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function remove() {
    if (
      lock.current ||
      !canDelete ||
      !pending ||
      !window.confirm(
        t(
          'この受付の削除を依頼しますか？未到着の送信も同じ受付番号では保存できなくなります。',
          'Request deletion? A delayed request with this receipt will also be blocked.',
        ),
      )
    )
      return;
    lock.current = true;
    setBusy(true);
    setNotice('');
    const controller = new AbortController();
    active.current = controller;
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/private-diagnostic', {
        method: 'DELETE',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receipt_id: pending.receipt_id,
          delete_key: pending.delete_key,
        }),
        signal: controller.signal,
      });
      const value = (await response.json()) as {
        ok?: boolean;
        receipt_id?: string;
        expires_at?: number;
      };
      if (!response.ok || value.ok !== true) throw Error();
      setPhase('deleted');
      setConsent(false);
    } catch {
      setNotice(
        t(
          '削除結果を確認できません。同じ受付情報で確認・再試行してください。',
          'Deletion is unconfirmed. Keep this receipt and retry manually.',
        ),
      );
    } finally {
      clearTimeout(timer);
      active.current = null;
      lock.current = false;
      setBusy(false);
    }
  }
  const phaseText = {
    idle: t('まだ送信していません。', 'Nothing has been sent.'),
    sending: t(
      '送信中です。保存結果を待っています。',
      'Sending; waiting for storage confirmation.',
    ),
    rejected: t(
      '今回の送信は受け付けられませんでした。同じ受付情報で再試行できます。以前の不確実な送信の有無までは確定しません。',
      'This attempt was rejected or could not start. Retry with the same receipt. A previous uncertain attempt may still exist.',
    ),
    uncertain: t(
      '保存されたか確認できません。新しい受付を作らず、受付情報を保存して同じ番号で再試行してください。',
      'Storage is uncertain. Save the receipt and retry with the same identity, not a new submission.',
    ),
    saved: t(
      'ゲムなおへの非公開保存を確認しました。これは運営者の閲覧・返信・解決を保証しません。',
      'Private storage at Gemnao is confirmed. This does not guarantee review, a reply or a resolution.',
    ),
    deleted: t(
      '削除要求を処理しました。対応する保存データを削除し、同じ受付の再送を防ぎます。',
      'Deletion was processed; matching stored data is removed and retries with this receipt are blocked.',
    ),
  }[phase];
  return (
    <div className="space-y-5">
      <label>
        Language / 言語{' '}
        <select
          value={en ? 'en' : 'ja'}
          onChange={(e) => setEn(e.target.value === 'en')}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      <h1>
        {t('Windows診断結果の非公開受付', 'Private Windows diagnostic intake')}
      </h1>
      <p>
        {t(
          '診断ツールが保存した専用JSONだけを読み込みます。読み込みは端末内だけで、下の同意と送信操作までは内容を送信しません。運営者の確認用で、公開コミュニティへの投稿ではありません。',
          'Import only the dedicated JSON saved by the diagnostic tool. Import stays on this device; report content is sent only after consent and an explicit send. This is for operator review, not a public community post.',
        )}
      </p>
      <p>
        {t(
          '最大4KB・30日保持。名前、パス、生ログ、PC製品名、端末ID、自由入力は受け付けません。完全匿名ではなく、配信事業者は通信情報を扱います。削除後のバックアップ・配信ログは事業者の保持方針によります。受付番号は公開しないでください。',
          'Maximum 4KB; retained for 30 days. No names, paths, raw logs, PC product names, device IDs or free text. Not guaranteed anonymous: the hosting provider processes connection data, and backups/service logs follow its policies. Keep receipt information private.',
        )}
      </p>
      <p id="private-use-purpose">{privateDiagnosticPurpose[en ? 'en' : 'ja']}</p>
      <p id="private-retention-policy">{privateDiagnosticPolicy[en ? 'en' : 'ja']}</p>
      <details><summary>中文 / Español — 保存方针 / Política de conservación</summary>
        <p lang="zh-Hans">{privateDiagnosticPurpose.zh}</p>
        <p lang="zh-Hans">{privateDiagnosticPolicy.zh}</p>
        <p lang="es">{privateDiagnosticPurpose.es}</p>
        <p lang="es">{privateDiagnosticPolicy.es}</p>
      </details>
      <output aria-live="polite">
        {enabled
          ? t(
              '受付可能です。送信は任意です。',
              'Intake is available. Sending is optional.',
            )
          : t(
              '準備中：受付は停止中または未確認です。上記は受付開始後の保存方針です。読み込み・確認のみ利用できます。',
              'In preparation: intake is closed or unverified. The policy above applies after intake opens. Import and review only.',
            )}
      </output>
      <label>
        {t('診断JSON／保存した受付情報', 'Diagnostic JSON / saved receipt')}{' '}
        <input
          aria-label="Import JSON"
          type="file"
          accept=".json,application/json"
          disabled={busy || pending !== null}
          onChange={(e) => void importFile(e.target.files?.[0])}
        />
      </label>
      {report && <PrivateDiagnosticPreview report={report} en={en} />}
      <label className="block">
        <input
          type="checkbox"
          aria-describedby="private-use-purpose private-retention-policy"
          checked={consent}
          disabled={!report || busy || phase === 'saved' || phase === 'deleted'}
          onChange={(e) => setConsent(e.target.checked)}
        />
        {t(
          '上の全内容、サイト改善と他の利用者の解決支援という利用目的（原文公開・第三者販売・別目的利用は含まない）、容量による受付停止・対応の限界、30日の閲覧期限と自動削除の時期・例外を確認し、運営者に非公開で送ることに同意します。',
          'I reviewed all content, its use to improve the site and help others (excluding publication of originals, third-party sale and other purposes), capacity-related pauses and service limitations, the 30-day access limit and automatic deletion timing and exceptions, and consent to send it privately to the operator.',
        )}
      </label>
      <button
        disabled={
          !enabled ||
          !report ||
          !consent ||
          busy ||
          phase === 'saved' ||
          phase === 'deleted'
        }
        onClick={() => void submit()}
      >
        {t('確認した内容を送信する', 'Send reviewed content')}
      </button>
      <output aria-live="polite">{phaseText}</output>
      {notice && <p role="alert">{notice}</p>}
      {pending && (
        <section className="space-y-3">
          <p>
            {t(
              '受付番号（成功表示とは別）',
              'Receipt ID (not proof of success)',
            )}
            : <code>{pending.receipt_id}</code>
          </p>
          <p>
            {t(
              '受付情報は削除キーと選別済み内容を含みます。再読込後の再試行・削除にはこのファイルを読み込んでください。サイトには自動保存しません。',
              'The receipt file contains the deletion key and sanitized report. Reimport it after reloading to retry or delete. It is not automatically saved in the browser.',
            )}
          </p>
          <button onClick={() => download({ ...pending, consent_version: 1 })}>
            {t('受付情報を手元に保存', 'Save receipt locally')}
          </button>
          <button
            disabled={!canDelete || busy || phase === 'deleted'}
            onClick={() => void remove()}
          >
            {t('この受付の削除を依頼', 'Request deletion')}
          </button>
          <button
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  t(
                    '受付情報は保存しましたか？未確認の送信は新規作成せず、同じ情報で再試行してください。',
                    'Have you saved this receipt? Retry uncertain submissions using the same receipt.',
                  ),
                )
              ) {
                ++generation.current;
                setPending(null);
                setReport(null);
                setConsent(false);
                setPhase('idle');
              }
            }}
          >
            {t('別の結果を読み込む', 'Import a different result')}
          </button>
        </section>
      )}
    </div>
  );
}
