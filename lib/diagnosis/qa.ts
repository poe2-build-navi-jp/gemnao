import windowConfig from './qa-window.json';
import fixtures from './qa-fixtures.json';
import { configuredAdmin } from '../admin-cookie';
import { handleDiagnosis, type DiagnosisEnv, privateHeaders } from './server';
import {
  handleFeedback,
  type FeedbackEnv,
} from '../diagnostic-feedback/service';
import type { QaWriteGuard } from './qa-guard';

export type QaWindow = {
  enabled: boolean;
  runId: string;
  startsAt: number;
  expiresAt: number;
};
export type QaEnv = DiagnosisEnv &
  FeedbackEnv & {
    DISCORD_ADMIN_TOKEN_HASH?: string;
    DISCORD_ADMIN_TOKEN?: string;
  };
const origin = 'https://gemnao.pages.dev';
const hex32 = /^[a-f0-9]{32}$/;
const hex64 = /^[a-f0-9]{64}$/;
const slots = [
  'diagnosis-a',
  'diagnosis-b',
  'feedback-a',
  'feedback-b',
] as const;
type Slot = (typeof slots)[number];
type Claim = {
  slot: Slot;
  requestId?: string;
  receiptId?: string;
  ownerHash: string;
};
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: privateHeaders });
const denied = (message = '限定テストは利用できません。', status = 403) =>
  json({ error: message }, status);
const prefix = (w: QaWindow) => 'salt:qa:' + w.runId + ':';
const stopKey = (w: QaWindow) => prefix(w) + 'closed';
const feedbackStopKey = (w: QaWindow) => 'qa-stop:' + w.runId;
const cookieToken = (r: Request) =>
  (r.headers.get('cookie') || '')
    .split(';')
    .map((x) => x.trim())
    .find((x) => x.startsWith('__Host-gemnao-diagnosis='))
    ?.slice('__Host-gemnao-diagnosis='.length) || '';
const digest = async (s: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
const plannedId = async (w: QaWindow, slot: Slot) =>
  (await digest('gemnao-qa-share:' + w.runId + ':' + slot)).slice(0, 32);
export const configuredWindow = (w: QaWindow) =>
  w.enabled === true &&
  /^[a-z0-9-]{8,64}$/.test(w.runId) &&
  Number.isSafeInteger(w.startsAt) &&
  Number.isSafeInteger(w.expiresAt) &&
  w.startsAt > 0 &&
  w.expiresAt > w.startsAt &&
  w.expiresAt - w.startsAt <= 3600000 &&
  w.startsAt % 1000 === 0 &&
  w.expiresAt % 1000 === 0;
export const liveWindow = (w: QaWindow, now: number) =>
  configuredWindow(w) && now >= w.startsAt && now < w.expiresAt;
const offBindings = (e: QaEnv) =>
  e.DIAGNOSIS_LOCAL_BETA === 'true' &&
  e.DIAGNOSIS_ENABLED === 'false' &&
  e.DIAGNOSIS_STORAGE_ENABLED === 'true' &&
  e.DIAGNOSIS_SHARING_ENABLED === 'false' &&
  e.DIAGNOSIS_WRITES_ENABLED === 'false' &&
  e.DIAGNOSIS_METRICS_ENABLED === 'false' &&
  e.FEEDBACK_ENABLED === 'false' &&
  !!e.DIAGNOSIS_DB &&
  !!e.FEEDBACK_DB;
const auth = (r: Request, e: QaEnv) =>
  configuredAdmin(r, {
    hash: e.DISCORD_ADMIN_TOKEN_HASH,
    token: e.DISCORD_ADMIN_TOKEN,
  });
const sameSite = (r: Request) =>
  new URL(r.url).origin === origin &&
  !new URL(r.url).search &&
  (!r.headers.has('sec-fetch-site') ||
    r.headers.get('sec-fetch-site') === 'same-origin') &&
  (r.method === 'GET' || r.headers.get('origin') === origin);
export const qaDiagnosisEnv = (e: QaEnv): DiagnosisEnv => ({
  DIAGNOSIS_DB: e.DIAGNOSIS_DB,
  DIAGNOSIS_STORAGE_ENABLED: 'true',
  DIAGNOSIS_ENABLED: 'true',
  DIAGNOSIS_LOCAL_BETA: 'false',
  DIAGNOSIS_SHARING_ENABLED: 'true',
  DIAGNOSIS_WRITES_ENABLED: 'true',
  DIAGNOSIS_METRICS_ENABLED: 'false',
});
function internal(
  r: Request,
  path: string,
  body?: unknown,
  method = body === undefined ? 'GET' : 'POST',
  withoutOwner = false,
) {
  const headers = new Headers(r.headers);
  headers.set('Origin', origin);
  headers.set('X-Diagnosis-Request', '1');
  headers.set('Content-Type', 'application/json');
  headers.delete('content-length');
  if (withoutOwner) headers.delete('cookie');
  return new Request(origin + path, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function stopped(e: QaEnv, w: QaWindow) {
  return !!(await e
    .DIAGNOSIS_DB!.prepare('SELECT key FROM diagnosis_operations WHERE key=?')
    .bind(stopKey(w))
    .first());
}
async function claim(
  e: QaEnv,
  w: QaWindow,
  value: Claim,
): Promise<QaWriteGuard | null> {
  const key = prefix(w) + value.slot,
    serialized = JSON.stringify(value);
  const result = await e
    .DIAGNOSIS_DB!.prepare(`INSERT OR IGNORE INTO diagnosis_operations(key,value,expires_at)
    SELECT ?,?,? WHERE NOT EXISTS(SELECT 1 FROM diagnosis_operations WHERE key=?)
    AND unixepoch()*1000>=? AND unixepoch()*1000<?`)
    .bind(
      key,
      serialized,
      w.expiresAt + 86400000,
      stopKey(w),
      w.startsAt,
      w.expiresAt,
    )
    .run();
  if (!result.success || result.meta.changes !== 1) return null;
  return {
    key,
    value: serialized,
    stopKey: stopKey(w),
    startsAt: w.startsAt,
    expiresAt: w.expiresAt,
  } satisfies QaWriteGuard;
}
async function readClaims(e: QaEnv, w: QaWindow) {
  const rows = await e
    .DIAGNOSIS_DB!.prepare(
      'SELECT value FROM diagnosis_operations WHERE key IN (?,?,?,?)',
    )
    .bind(...slots.map((slot) => prefix(w) + slot))
    .all<{ value: string }>();
  return rows.results.map((row) => JSON.parse(row.value) as Claim);
}
async function state(e: QaEnv, w: QaWindow, r: Request) {
  const ownerHash = await digest(cookieToken(r));
  const result = [];
  for (const c of await readClaims(e, w)) {
    const row = c.requestId
      ? await e
          .DIAGNOSIS_DB!.prepare(
            'SELECT id FROM diagnosis_shared WHERE request_id=? LIMIT 1',
          )
          .bind(c.requestId)
          .first<{ id: string }>()
      : await e
          .FEEDBACK_DB!.prepare(
            'SELECT receipt_id FROM diagnostic_reports WHERE receipt_id=?',
          )
          .bind(c.receiptId!)
          .first<{ receipt_id: string }>();
    result.push({
      slot: c.slot,
      consumed: true,
      present: !!row,
      owned: c.ownerHash === ownerHash,
      id: c.requestId
        ? (row as { id: string } | null)?.id || null
        : c.receiptId,
    });
  }
  return result;
}

/** A GET exception covers only the two newly claimed synthetic shares, never arbitrary rows. */
export async function qaShareAllowed(
  r: Request,
  e: QaEnv,
  id: string,
  w: QaWindow = windowConfig,
  now = Date.now(),
) {
  if (
    r.method !== 'GET' ||
    !hex32.test(id) ||
    !sameSite(r) ||
    !liveWindow(w, now) ||
    !offBindings(e) ||
    !(await auth(r, e))
  )
    return false;
  try {
    if (await stopped(e, w)) return false;
    return !!(await e
      .DIAGNOSIS_DB!.prepare(`SELECT d.id FROM diagnosis_shared d JOIN diagnosis_operations o
      ON json_extract(o.value,'$.requestId')=d.request_id WHERE d.id=? AND o.key IN (?,?)
      AND unixepoch()*1000>=? AND unixepoch()*1000<? LIMIT 1`)
      .bind(
        id,
        prefix(w) + slots[0],
        prefix(w) + slots[1],
        w.startsAt,
        w.expiresAt,
      )
      .first());
  } catch {
    return false;
  }
}

/** Administrative wrapper. Bodies select fixed fixtures; they cannot supply SQL, bindings or snapshots. */
export async function handleQa(
  r: Request,
  e: QaEnv,
  w: QaWindow = windowConfig,
  now = Date.now(),
): Promise<Response> {
  if (!sameSite(r) || !['GET', 'POST'].includes(r.method)) return denied();
  if (!(await auth(r, e)))
    return denied('既存の管理キーでログインしてください。', 401);
  if (!configuredWindow(w) || !offBindings(e))
    return json(
      {
        active: false,
        configured: false,
        error: '限定テストは準備中または撤去済みです。',
      },
      503,
    );
  if (!liveWindow(w, now) && r.method === 'GET')
    return json(
      {
        active: false,
        configured: true,
        runId: w.runId,
        expiresAt: w.expiresAt,
        records: [],
        error:
          '限定テストは開始前または期限切れです。削除は通常の所有者認証で続けられます。',
      },
      200,
    );
  try {
    if (r.method === 'GET')
      return json({
        configured: true,
        runId: w.runId,
        expiresAt: w.expiresAt,
        active: !(await stopped(e, w)),
        records: await state(e, w, r),
      });
    if (r.headers.get('content-type')?.split(';')[0] !== 'application/json')
      return denied('入力形式が不正です。', 400);
    if (Number(r.headers.get('content-length') || 0) > 2048)
      return denied('入力が大きすぎます。', 400);
    const reader = r.body?.getReader();
    if (!reader) return denied('入力がありません。', 400);
    let bytes = new Uint8Array();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      if (bytes.length + chunk.value.length > 2048) {
        await reader.cancel();
        return denied('入力が大きすぎます。', 400);
      }
      const joined = new Uint8Array(bytes.length + chunk.value.length);
      joined.set(bytes);
      joined.set(chunk.value, bytes.length);
      bytes = joined;
    }
    let input: {
      op?: string;
      slot?: Slot;
      receiptId?: string;
      deleteKey?: string;
    };
    try {
      input = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return denied('入力形式が不正です。', 400);
    }
    if (
      !input ||
      typeof input !== 'object' ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (k) => !['op', 'slot', 'receiptId', 'deleteKey'].includes(k),
      )
    )
      return denied('入力形式が不正です。', 400);
    if (input.op === 'delete') {
      // This does not extend intake/read authority: it narrows ordinary owner deletion
      // to the exact claimed fixture. A tampered browser record cannot target other rows.
      if (now < w.startsAt || now >= w.expiresAt + 86400000)
        return denied(
          '試験台帳の保持期限外です。通常の所有者削除画面を使ってください。',
        );
      const slot = input.slot;
      if (!slot || !slots.includes(slot))
        return denied('指定した4件だけを削除できます。', 400);
      const diagnosis = slot.startsWith('diagnosis');
      if (Object.keys(input).length !== (diagnosis ? 2 : 4))
        return denied('入力形式が不正です。', 400);
      const entry = await e
        .DIAGNOSIS_DB!.prepare(
          'SELECT value FROM diagnosis_operations WHERE key=?',
        )
        .bind(prefix(w) + slot)
        .first<{ value: string }>();
      if (!entry) return json({ ok: true, uncreated: true });
      const c = JSON.parse(entry.value) as Claim;
      if (diagnosis) {
        const index = slot.endsWith('-a') ? 0 : 1;
        const token = cookieToken(r);
        if (
          !hex64.test(token) ||
          c.ownerHash !== (await digest(token)) ||
          c.requestId !== fixtures.diagnosis[index].requestId
        )
          return denied('作成時の所有者Cookieが必要です。');
        const id = await plannedId(w, slot);
        const existing = await e
          .DIAGNOSIS_DB!.prepare(
            'SELECT request_id FROM diagnosis_shared WHERE id=?',
          )
          .bind(id)
          .first<{ request_id: string }>();
        if (!existing) return json({ ok: true, absent: true });
        if (existing.request_id !== c.requestId)
          return denied('試験対象と一致しません。', 409);
        const response = await handleDiagnosis(
          internal(r, '/api/diagnosis/' + id, {}, 'DELETE'),
          e,
          now,
        );
        if (!response.ok) return response;
        if (
          await e
            .DIAGNOSIS_DB!.prepare('SELECT id FROM diagnosis_shared WHERE id=?')
            .bind(id)
            .first()
        )
          throw new Error('delete not verified');
      } else {
        if (
          !hex32.test(input.receiptId || '') ||
          !hex64.test(input.deleteKey || '') ||
          c.receiptId !== input.receiptId
        )
          return denied('この試験の受付番号と削除キーが必要です。');
        const response = await handleFeedback(
          internal(
            r,
            '/api/diagnostic-feedback',
            { receipt_id: input.receiptId, delete_key: input.deleteKey },
            'DELETE',
          ),
          e,
          Math.floor(now / 1000),
        );
        if (!response.ok) return response;
        if (
          await e
            .FEEDBACK_DB!.prepare(
              'SELECT receipt_id FROM diagnostic_reports WHERE receipt_id=?',
            )
            .bind(c.receiptId)
            .first()
        )
          throw new Error('delete not verified');
      }
      return json({ ok: true, absent: true });
    }
    if (input.op === 'close') {
      if (Object.keys(input).length !== 1)
        return denied('入力形式が不正です。', 400);
      if (now >= w.expiresAt) return json({ ok: true, active: false });
      if (!liveWindow(w, now)) return denied();
      // First revoke admissions/diagnosis inserts, then atomically fence feedback inserts.
      const a = await e
        .DIAGNOSIS_DB!.prepare(
          'INSERT OR IGNORE INTO diagnosis_operations(key,value,expires_at) VALUES (?,?,?)',
        )
        .bind(stopKey(w), 'closed', w.expiresAt + 86400000)
        .run();
      const b = await e
        .FEEDBACK_DB!.prepare(
          'INSERT OR IGNORE INTO diagnostic_report_tombstones(receipt_id,delete_hash,expires_at) VALUES (?,?,?)',
        )
        .bind(
          feedbackStopKey(w),
          '0'.repeat(64),
          Math.floor(w.expiresAt / 1000) + 86400,
        )
        .run();
      if (!a.success || !b.success) throw new Error('close');
      return json({ ok: true, active: false });
    }
    if (!liveWindow(w, now))
      return denied('限定テストは開始前または期限切れです。');
    if (await stopped(e, w))
      return denied('この限定テストは終了しています。', 409);
    const slot = input.slot;
    if (!slot || !slots.includes(slot))
      return denied('指定した4件だけを試験できます。', 400);
    const isDiagnosis = slot.startsWith('diagnosis');
    const index = slot.endsWith('-a') ? 0 : 1;
    if (input.op === 'session') {
      if (!isDiagnosis || Object.keys(input).length !== 2)
        return denied('入力形式が不正です。', 400);
      const response = await handleDiagnosis(
        internal(r, '/api/diagnosis/session', {
          requestId: fixtures.diagnosis[index].requestId,
        }),
        qaDiagnosisEnv(e),
        now,
      );
      if (!response.ok) return response;
      // Return nonsecret IDs before creation so a lost response never loses the deletion target.
      return Response.json(
        {
          ok: true,
          diagnosisIds: {
            'diagnosis-a': await plannedId(w, slots[0]),
            'diagnosis-b': await plannedId(w, slots[1]),
          },
        },
        { status: 200, headers: response.headers },
      );
    }
    const token = cookieToken(r);
    if (!hex64.test(token))
      return denied('先にテスト用の通常セッションを準備してください。');
    if (input.op === 'create' && isDiagnosis) {
      if (Object.keys(input).length !== 2)
        return denied('入力形式が不正です。', 400);
      const f = fixtures.diagnosis[index];
      if (
        await e
          .DIAGNOSIS_DB!.prepare(
            'SELECT id FROM diagnosis_shared WHERE request_id=? LIMIT 1',
          )
          .bind(f.requestId)
          .first()
      )
        return denied('既に使用済みです。状態確認で確認してください。', 409);
      const permit = await claim(e, w, {
        slot,
        requestId: f.requestId,
        ownerHash: await digest(token),
      });
      if (!permit)
        return denied('使用済みまたは停止済みです。再作成しません。', 409);
      permit.recordId = await plannedId(w, slot);
      const response = await handleDiagnosis(
        internal(r, '/api/diagnosis', {
          requestId: f.requestId,
          snapshot: f.snapshot,
        }),
        qaDiagnosisEnv(e),
        now,
        permit,
      );
      const data = (await response.json()) as Record<string, unknown>;
      delete data.recoveryKey; // The normal HttpOnly owner cookie suffices for this trial.
      return json(data, response.status);
    }
    if ((input.op === 'create' || input.op === 'duplicate') && !isDiagnosis) {
      if (
        Object.keys(input).length !== 4 ||
        !hex32.test(input.receiptId || '') ||
        !hex64.test(input.deleteKey || '')
      )
        return denied('入力形式が不正です。', 400);
      const keyHash = await digest(input.deleteKey!);
      if (input.receiptId!.slice(8) !== keyHash.slice(0, 24))
        return denied('受付番号と削除キーが一致しません。', 409);
      const issued = parseInt(input.receiptId!.slice(0, 8), 16) * 1000;
      if (issued < w.startsAt || issued >= w.expiresAt || issued > now + 300000)
        return denied('受付番号がこの試験時間内ではありません。', 400);
      const value: Claim = {
        slot,
        receiptId: input.receiptId,
        ownerHash: await digest(token),
      };
      let permit: QaWriteGuard | null;
      if (input.op === 'create') permit = await claim(e, w, value);
      else {
        const found = await e
          .DIAGNOSIS_DB!.prepare(
            'SELECT value FROM diagnosis_operations WHERE key=?',
          )
          .bind(prefix(w) + slot)
          .first<{ value: string }>();
        // Only test the existing handler's duplicate/tombstone path; never create on retry.
        const existing = await e
          .FEEDBACK_DB!.prepare(
            'SELECT receipt_id FROM diagnostic_reports WHERE receipt_id=? AND delete_hash=? UNION ALL SELECT receipt_id FROM diagnostic_report_tombstones WHERE receipt_id=? AND delete_hash=? LIMIT 1',
          )
          .bind(input.receiptId!, keyHash, input.receiptId!, keyHash)
          .first();
        if (!found || found.value !== JSON.stringify(value) || !existing)
          return denied(
            '同じ保存済み・削除済みの受付番号だけ確認できます。',
            409,
          );
        permit = {
          key: prefix(w) + slot,
          value: found.value,
          stopKey: stopKey(w),
          startsAt: w.startsAt,
          expiresAt: w.expiresAt,
        };
      }
      if (!permit)
        return denied('使用済みまたは停止済みです。再作成しません。', 409);
      return handleFeedback(
        internal(r, '/api/diagnostic-feedback', {
          receipt_id: input.receiptId,
          delete_key: input.deleteKey,
          report: fixtures.feedback[index].report,
          consent_version: 1,
        }),
        { FEEDBACK_DB: e.FEEDBACK_DB, FEEDBACK_ENABLED: 'true' },
        Math.floor(now / 1000),
        { ...permit, stopKey: feedbackStopKey(w) },
      );
    }
    return denied('この操作は許可されていません。', 400);
  } catch {
    return json(
      {
        error:
          '結果を確認できません。新しいIDで再実行せず、状態確認と削除を行ってください。',
      },
      503,
    );
  }
}
