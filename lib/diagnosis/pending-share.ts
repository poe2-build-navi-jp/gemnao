import { RULE_VERSION, type Answers, type ActionStatus } from './model';
import { buildSnapshot, exactKeys, record } from './validation';

const PREFIX = 'gemnao-diagnosis-pending-v1:';
export const PENDING_TTL = 30 * 86400000;
export type PendingShare = {
  version: 1;
  requestId: string;
  createdAt: number;
  ownerBinding: string | null;
  snapshot: {
    answers: Answers;
    tried: Record<string, ActionStatus>;
    results: Record<string, ActionStatus>;
    version: string;
  };
};

function valid(value: unknown, now: number): value is PendingShare {
  return record(value) &&
    exactKeys(value, ['version', 'requestId', 'createdAt', 'ownerBinding', 'snapshot']) &&
    value.version === 1 && typeof value.requestId === 'string' &&
    /^[a-f0-9]{32}$/.test(value.requestId) &&
    typeof value.createdAt === 'number' && Number.isFinite(value.createdAt) &&
    value.createdAt <= now + 60000 && now - value.createdAt < PENDING_TTL &&
    (value.ownerBinding === null || (typeof value.ownerBinding === 'string' && /^[a-f0-9]{64}$/.test(value.ownerBinding))) &&
    record(value.snapshot) && value.snapshot.version === RULE_VERSION &&
    !!buildSnapshot(value.snapshot);
}

/** Local recovery records only. Never store cookies, recovery keys or free text. */
export function pendingShares(now = Date.now()): PendingShare[] {
  const values: PendingShare[] = [];
  const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
    .filter((key): key is string => !!key?.startsWith(PREFIX));
  for (const key of keys) {
    let value: unknown;
    try { value = JSON.parse(localStorage.getItem(key) || 'null'); } catch { value = null; }
    if (!valid(value, now) || key !== PREFIX + value.requestId) {
      localStorage.removeItem(key);
      continue;
    }
    values.push(value);
  }
  return values.sort((a, b) => a.createdAt - b.createdAt);
}
export function readPendingShare(now = Date.now()) {
  return pendingShares(now)[0] || null;
}
export function savePendingShare(value: PendingShare, now = Date.now(), mustExist = false) {
  if (!valid(value, now)) throw new Error('共有の再試行情報が期限切れ、または現在の版に対応していません。');
  const existing = pendingShares(now);
  const previous = existing.find((item) => item.requestId === value.requestId);
  if (mustExist && !previous) throw new Error('この端末の再試行情報は削除または期限切れになっています。新しい共有は作成しません。');
  if (previous && (previous.createdAt !== value.createdAt ||
    JSON.stringify(previous.snapshot) !== JSON.stringify(value.snapshot) ||
    (previous.ownerBinding !== null && previous.ownerBinding !== value.ownerBinding)))
    throw new Error('再試行情報が別の画面で変わりました。再読み込みして確認してください。');
  if (existing.length >= 10 && !existing.some((item) => item.requestId === value.requestId))
    throw new Error('未確認の共有送信が残っています。先に再試行情報を確認してください。');
  const json = JSON.stringify(value);
  const key = PREFIX + value.requestId;
  localStorage.setItem(key, json);
  if (localStorage.getItem(key) !== json) throw new Error('共有の再試行情報をこの端末に保存できません。');
}
export function removePendingShare(requestId: string) {
  localStorage.removeItem(PREFIX + requestId);
}
export function clearPendingShares() {
  const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
    .filter((key): key is string => !!key?.startsWith(PREFIX));
  for (const key of keys) localStorage.removeItem(key);
}

/** Cross-tab coordination only; this is not authentication or a stored credential. */
export async function withPendingShareLock<T>(operation: () => Promise<T> | T): Promise<T> {
  if (typeof navigator === 'undefined' || !navigator.locks)
    throw new Error('このブラウザでは共有の安全な再試行を準備できません。対応ブラウザをご利用ください。');
  return navigator.locks.request('gemnao-diagnosis-pending-v1', { ifAvailable: true }, async (lock) => {
    if (!lock) throw new Error('別の画面で共有の処理中です。完了してから再試行してください。');
    return operation();
  });
}
