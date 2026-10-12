'use client';
/* oxlint-disable next/no-html-link-for-pages -- Private QA requires full document navigation. */
import { useEffect, useRef, useState } from 'react';
type Slot = 'diagnosis-a' | 'diagnosis-b' | 'feedback-a' | 'feedback-b';
type Saved = { id?: string; key?: string; deleted?: boolean };
type Evidence = { step: string; status: 'pass' | 'fail'; at: string };
type Local = {
  runId: string;
  records: Partial<Record<Slot, Saved>>;
  evidence: Evidence[];
  phase?: string;
};
type Status = {
  active?: boolean;
  configured?: boolean;
  runId?: string;
  expiresAt?: number;
  records?: {
    slot: Slot;
    id: string | null;
    present: boolean;
    consumed: boolean;
    owned: boolean;
  }[];
};
const slots: Slot[] = [
  'diagnosis-a',
  'diagnosis-b',
  'feedback-a',
  'feedback-b',
];
const labels = {
  'diagnosis-a': '診断A',
  'diagnosis-b': '診断B',
  'feedback-a': '報告A',
  'feedback-b': '報告B',
};
const storageKey = 'gemnao-limited-qa-v1';
const api = '/api/admin/diagnosis-qa';
async function call(
  url: string,
  input?: unknown,
  method = input === undefined ? 'GET' : 'POST',
  credentials: RequestCredentials = 'same-origin',
) {
  const response = await fetch(url, {
    method,
    credentials,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-Diagnosis-Request': '1' },
    ...(input === undefined ? {} : { body: JSON.stringify(input) }),
  });
  let value: Record<string, unknown> = {};
  try {
    value = await response.json();
  } catch {
    /* A blocked/HTML response is a failed check, not a retry signal. */
  }
  return { response, value };
}
const randomKey = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
const digest = async (s: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
export function DiagnosisQa() {
  const [status, setStatus] = useState<Status>({}),
    [login, setLogin] = useState(false),
    [key, setKey] = useState('');
  const [message, setMessage] = useState('状態を確認しています。'),
    [busy, setBusy] = useState(false),
    [consent, setConsent] = useState(false);
  const [local, setLocal] = useState<Local>({
    runId: '',
    records: {},
    evidence: [],
  });
  const state = useRef(local),
    lock = useRef(false);
  function save(next: Local) {
    // Only this tab's normal per-record deletion keys. Never store the admin key/cookie.
    sessionStorage.setItem(storageKey, JSON.stringify(next));
    state.current = next;
    setLocal(next);
  }
  function record(step: string, ok: boolean) {
    save({
      ...state.current,
      evidence: [
        ...state.current.evidence,
        { step, status: ok ? 'pass' : 'fail', at: new Date().toISOString() },
      ],
    });
    if (!ok)
      throw new Error(
        step +
          'を確認できません。受付は開けず、状態確認または削除を行ってください。',
      );
  }
  async function refresh() {
    const { response, value } = await call(api);
    if (response.status === 401) {
      setLogin(true);
      setMessage('本人が既存の管理キーを入力してください。');
      return;
    }
    setLogin(false);
    if (!response.ok)
      throw new Error(
        typeof value.error === 'string'
          ? value.error
          : '状態を確認できません（HTTP ' +
              response.status +
              '）。別の方法で接続を回避せず停止してください。',
      );
    const next = value as Status;
    setStatus(next);
    if (next.runId) {
      if (
        state.current.runId &&
        state.current.runId !== next.runId &&
        Object.values(state.current.records).some((r) => !r?.deleted)
      )
        throw new Error(
          '前回分の削除記録が残っています。新しい試験は開始できません。',
        );
      const merged: Local =
        state.current.runId === next.runId
          ? { ...state.current, records: { ...state.current.records } }
          : { runId: next.runId, records: {}, evidence: [] };
      for (const r of next.records || [])
        if (r.id)
          merged.records[r.slot] = { ...merged.records[r.slot], id: r.id };
      save(merged);
    }
    setMessage(
      next.active
        ? '一般受付はOFFです。下の順に進めてください。'
        : '保存・共有のテスト権限は停止中です。未削除分の削除は続けられます。',
    );
    return next;
  }
  useEffect(() => {
    void Promise.resolve().then(() => {
      try {
        const data = sessionStorage.getItem(storageKey);
        if (data) {
          const parsed = JSON.parse(data) as Local;
          if (
            typeof parsed.runId === 'string' &&
            parsed.records &&
            Array.isArray(parsed.evidence)
          ) {
            state.current = parsed;
            setLocal(parsed);
          }
        }
        void refresh().catch((e) => setMessage(e.message));
      } catch {
        setMessage(
          'このタブで削除情報を保持できません。テストを開始しないでください。',
        );
      }
    });
  }, []);
  async function run(fn: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      let stopFailed = false;
      if (fn === createFour || fn === check || fn === finish) {
        try {
          await close();
        } catch {
          stopFailed = true;
        }
      }
      setMessage(
        (e instanceof Error
          ? e.message
          : '確認できません。停止してください。') +
          (stopFailed
            ? ' 一時権限の停止も未確認です。期限までは状態を確認してください。'
            : ''),
      );
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }
  async function signIn() {
    const entered = key;
    setKey('');
    const { response } = await call('/api/admin/discord-servers/login', {
      token: entered,
    });
    if (!response.ok)
      throw new Error('ログインできません。既存の管理キーを確認してください。');
    await refresh();
  }
  async function createFour() {
    const current = await refresh();
    if (!current?.active || !consent)
      throw new Error('受付時間と架空データへの同意を確認してください。');
    save({ ...state.current, phase: 'started' });
    const session = await call(api, { op: 'session', slot: 'diagnosis-a' });
    record('通常の所有者セッション', session.response.ok);
    const planned = session.value.diagnosisIds as Record<string, string>;
    if (
      !planned ||
      !/^[a-f0-9]{32}$/.test(planned['diagnosis-a']) ||
      !/^[a-f0-9]{32}$/.test(planned['diagnosis-b'])
    )
      throw new Error('削除対象のIDを準備できません。');
    const pending = { ...state.current.records };
    for (const slot of ['diagnosis-a', 'diagnosis-b'] as Slot[])
      pending[slot] = { ...pending[slot], id: planned[slot] };
    save({ ...state.current, records: pending });
    for (const slot of slots) {
      if (current.records?.some((r) => r.slot === slot && r.consumed)) continue;
      if (slot.startsWith('diagnosis')) {
        const result = await call(api, { op: 'create', slot });
        if (
          result.response.status === 201 &&
          typeof result.value.id === 'string'
        )
          save({
            ...state.current,
            records: {
              ...state.current.records,
              [slot]: { id: result.value.id },
            },
          });
        record(labels[slot] + '保存', result.response.status === 201);
      } else {
        let saved = state.current.records[slot];
        if (!saved?.key) {
          const deleteKey = randomKey(),
            id =
              Math.floor(Date.now() / 1000)
                .toString(16)
                .padStart(8, '0') + (await digest(deleteKey)).slice(0, 24);
          saved = { id, key: deleteKey };
          save({
            ...state.current,
            records: { ...state.current.records, [slot]: saved },
          });
        }
        const result = await call(api, {
          op: 'create',
          slot,
          receiptId: saved.id,
          deleteKey: saved.key,
        });
        record(labels[slot] + '保存', result.response.status === 201);
      }
    }
    const after = await refresh();
    record(
      '架空4件の存在',
      slots.every((slot) =>
        after?.records?.some((r) => r.slot === slot && r.present && r.owned),
      ),
    );
    setMessage('4件を保存しました。次に「共有・保護を確認」を押してください。');
  }
  async function check() {
    for (const slot of slots) {
      const saved = state.current.records[slot];
      if (!saved?.id) throw new Error('4件の保存を先に確認してください。');
      if (slot.startsWith('diagnosis')) {
        const shared = await call('/api/diagnosis/' + saved.id);
        record(
          labels[slot] + '共有内容と個人情報除外',
          shared.response.status === 200 &&
            !!shared.value.snapshot &&
            !['owner_hash', 'recovery_hash', 'recoveryKey', 'request_id'].some(
              (k) => k in shared.value,
            ) &&
            shared.response.headers
              .get('Cache-Control')
              ?.includes('no-store') === true,
        );
        const page = await fetch('/diagnosis/' + saved.id, {
          cache: 'no-store',
        });
        record(
          labels[slot] + '共有ページ',
          page.status === 200 &&
            (await page.text()).includes('トラブル診断結果') &&
            page.headers.get('X-Robots-Tag')?.includes('noindex') === true,
        );
        const stranger = await call(
          '/api/diagnosis/' + saved.id + '/owner',
          undefined,
          'GET',
          'omit',
        );
        record(
          labels[slot] + '所有者以外の拒否',
          stranger.response.status === 403,
        );
      } else {
        if (!saved.key)
          throw new Error('作成したタブで削除情報を確認してください。');
        const duplicate = await call(api, {
          op: 'duplicate',
          slot,
          receiptId: saved.id,
          deleteKey: saved.key,
        });
        record(
          labels[slot] + '同じ番号の重複保存',
          duplicate.response.status === 200 &&
            duplicate.value.receipt_id === saved.id,
        );
        const wrong = (saved.key[0] === '0' ? '1' : '0') + saved.key.slice(1);
        const rejected = await call(
          '/api/diagnostic-feedback',
          { receipt_id: saved.id, delete_key: wrong },
          'DELETE',
          'omit',
        );
        record(
          labels[slot] + '誤った削除キーの拒否',
          rejected.response.status === 409,
        );
      }
    }
    save({ ...state.current, phase: 'checked' });
    await refresh();
    setMessage(
      '共有と保護を確認しました。表示された共有リンクも開いてから、「4件を削除して終了」を押してください。',
    );
  }
  async function removeRecords() {
    for (const slot of slots) {
      const saved = state.current.records[slot];
      if (!saved?.id || saved.deleted) continue;
      if (!slot.startsWith('diagnosis') && !saved.key)
        throw new Error('報告の削除キーは作成したタブだけにあります。');
      const result = await call(api, {
        op: 'delete',
        slot,
        ...(slot.startsWith('diagnosis')
          ? {}
          : { receiptId: saved.id, deleteKey: saved.key }),
      });
      record(
        labels[slot] + '所有者による削除',
        result.response.ok && result.value.ok === true,
      );
      save({
        ...state.current,
        records: {
          ...state.current.records,
          [slot]: { ...saved, deleted: true },
        },
      });
    }
  }
  async function close() {
    const result = await call(api, { op: 'close' });
    if (!result.response.ok) {
      const current = await refresh();
      if (current?.active !== false)
        throw new Error(
          '停止を確認できません。受付OFFのまま状況を報告してください。',
        );
    }
    setStatus((s) => ({ ...s, active: false }));
  }
  async function finish() {
    if (state.current.phase !== 'checked')
      throw new Error('先に共有・保護を確認するか、中止して削除してください。');
    await removeRecords();
    const removedState = await refresh();
    record(
      '4件の本文不存在',
      slots.every((slot) =>
        removedState?.records?.some((r) => r.slot === slot && !r.present),
      ),
    );
    for (const slot of slots) {
      const saved = state.current.records[slot]!;
      if (slot.startsWith('diagnosis')) {
        const absent = await call('/api/diagnosis/' + saved.id + '/owner');
        // The ordinary owner route intentionally returns 403 for both absent rows and wrong owners.
        // Scoped QA inventory above, not the 403 alone, establishes absence.
        record(
          labels[slot] + '削除後の所有者表示拒否',
          absent.response.status === 403,
        );
        const replay = await call(api, { op: 'create', slot });
        record(
          labels[slot] + '削除後の再作成拒否',
          replay.response.status === 409,
        );
      } else {
        const replay = await call(api, {
          op: 'duplicate',
          slot,
          receiptId: saved.id,
          deleteKey: saved.key,
        });
        record(
          labels[slot] + '削除後の復活拒否',
          replay.response.status === 409,
        );
      }
    }
    await close();
    record('一時権限の停止', true);
    const cleaned = { ...state.current.records };
    for (const slot of slots) if (cleaned[slot]) delete cleaned[slot]!.key;
    save({ ...state.current, records: cleaned, phase: 'complete' });
    setMessage(
      '4件の削除と一時権限の停止を確認しました。下の結果を保存し、この会話へ添付してください。一般受付はまだOFFです。',
    );
  }
  async function abort() {
    await close();
    await removeRecords();
    save({ ...state.current, phase: 'stopped' });
    setMessage(
      '一時権限を停止し、このタブで確認できた試験データを削除しました。状態不明がある場合は結果を共有してください。',
    );
  }
  function download() {
    const receipt = {
      runId: state.current.runId,
      phase: state.current.phase,
      records: Object.fromEntries(
        Object.entries(state.current.records).map(([slot, r]) => [
          slot,
          { id: r.id, deleted: r.deleted === true },
        ]),
      ),
      evidence: state.current.evidence,
      publicIntakeEnabled: false,
      note: 'Browser-observed QA only. Keys and cookies excluded. Cloudflare configuration and final activation are separate checks.',
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(receipt, null, 2)], {
        type: 'application/json',
      }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gemnao-qa-result.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="space-y-5">
      <p>
        既存管理者だけが、架空の診断2件・報告2件を試します。一般受付はOFFのままです。実際のゲーム名や個人情報の入力はありません。
      </p>
      <p>
        削除が終わるまでこのタブを閉じないでください。削除用情報はこのタブのsessionStorageにだけ保持し、結果ファイルには含めません。
      </p>
      {status.expiresAt && (
        <p>
          保存・共有の期限：
          <strong>
            {new Date(status.expiresAt).toLocaleString('ja-JP', {
              timeZone: 'Asia/Tokyo',
            })}{' '}
            JST
          </strong>
          （延長しません）
        </p>
      )}
      <output className="block rounded border p-4">{message}</output>
      {login && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(signIn);
          }}
          className="space-y-3"
        >
          <label className="block">
            既存の管理キー
            <input
              type="password"
              autoComplete="current-password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="block w-full rounded border p-2"
            />
          </label>
          <button disabled={busy || !key} className="rounded border px-4 py-2">
            ログイン
          </button>
        </form>
      )}
      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={busy}
        />
        固定の架空4件を保存し、確認後に削除することに同意します。
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          disabled={
            busy || !status.active || !consent || local.phase === 'complete'
          }
          onClick={() => void run(createFour)}
          className="rounded border px-4 py-2 disabled:opacity-40"
        >
          1. 架空4件を保存
        </button>
        <button
          disabled={
            busy ||
            !status.active ||
            !slots.every(
              (s) => local.records[s]?.id && !local.records[s]?.deleted,
            )
          }
          onClick={() => void run(check)}
          className="rounded border px-4 py-2 disabled:opacity-40"
        >
          2. 共有・保護を確認
        </button>
        <button
          disabled={busy || !status.active || local.phase !== 'checked'}
          onClick={() => void run(finish)}
          className="rounded border px-4 py-2 disabled:opacity-40"
        >
          3. 4件を削除して終了
        </button>
        <button
          disabled={
            busy || (!Object.keys(local.records).length && !status.active)
          }
          onClick={() => void run(abort)}
          className="rounded border px-4 py-2 disabled:opacity-40"
        >
          中止・未削除分を削除
        </button>
        <button
          disabled={busy}
          onClick={() =>
            void run(async () => {
              await refresh();
            })
          }
          className="rounded border px-4 py-2 disabled:opacity-40"
        >
          状態を確認
        </button>
      </div>
      <ul className="space-y-2">
        {slots.map((slot) => (
          <li key={slot}>
            {labels[slot]}：
            {local.records[slot]?.deleted
              ? '削除済み'
              : local.records[slot]?.id
                ? '受付番号あり'
                : '未実施'}
            {slot.startsWith('diagnosis') &&
              local.records[slot]?.id &&
              !local.records[slot]?.deleted && (
                <a
                  className="ml-3 underline"
                  href={'/diagnosis/' + local.records[slot]!.id}
                  target="_blank"
                  rel="noreferrer"
                >
                  共有ページを開く
                </a>
              )}
          </li>
        ))}
      </ul>
      <p>
        期限切れ・中止後も、所有者認証による削除は利用できます。無料枠や障害で削除できない場合は停止したまま結果を共有してください。補助台帳は期限終了から24時間後以降の定期削除、報告の復活防止記録は30日後以降の定期削除対象です。
      </p>
      <button
        onClick={download}
        disabled={!local.evidence.length}
        className="rounded border px-4 py-2"
      >
        結果だけ保存（キーを含みません）
      </button>
      <ol className="text-sm">
        {local.evidence.map((e, i) => (
          <li key={i}>
            {e.status === 'pass' ? '✓' : '×'} {e.step}
          </li>
        ))}
      </ol>
      <p>
        <a href="/" className="underline">
          サイトへ戻る
        </a>
      </p>
    </section>
  );
}
