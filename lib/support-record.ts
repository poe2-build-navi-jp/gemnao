// Structured additions to the existing private notebook. No network or analytics.
import {
  readSolutions,
  upsertSolution,
  type SavedSolution,
} from './saved-solutions';
export const ACTIVE_CASE_KEY = 'gemnao-active-solution';
export type Attempt = {
  path: string;
  stepId: string;
  label: string;
  result: 'unresolved' | 'resolved' | 'tried';
  at: string;
};
export type Reversion = {
  id: string;
  setting: string;
  original: string;
  restore: string;
  state: 'pending' | 'restored' | 'kept';
};
export type SupportRecord = {
  attempts: Attempt[];
  reversions: Reversion[];
  seenUpdates: string[];
};
export const emptySupport = (): SupportRecord => ({
  attempts: [],
  reversions: [],
  seenUpdates: [],
});
const str = (v: unknown, n = 4000): v is string =>
  typeof v === 'string' && v.length <= n;
const obj = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v);
export const canonicalArticle = (path: string) =>
  path.replace(/^\/(en|zh|es)(?=\/)/, '');
export function validSupport(v: unknown): v is SupportRecord {
  if (
    !obj(v) ||
    !Array.isArray(v.attempts) ||
    !Array.isArray(v.reversions) ||
    !Array.isArray(v.seenUpdates)
  )
    return false;
  return (
    v.attempts.length <= 200 &&
    v.reversions.length <= 100 &&
    v.seenUpdates.length <= 1000 &&
    v.attempts.every(
      (a) =>
        obj(a) &&
        str(a.path, 240) &&
        /^\/(?:games\/[a-z0-9-]+|guide|pc|discord)\/[a-z0-9-]+$/.test(a.path) &&
        str(a.stepId, 200) &&
        /^[a-zA-Z0-9_-]+$/.test(a.stepId) &&
        str(a.label, 300) &&
        ['unresolved', 'resolved', 'tried'].includes(String(a.result)) &&
        str(a.at, 40) &&
        Number.isFinite(Date.parse(a.at)),
    ) &&
    v.reversions.every(
      (r) =>
        obj(r) &&
        str(r.id, 100) &&
        !!r.id &&
        str(r.setting) &&
        str(r.original) &&
        str(r.restore) &&
        ['pending', 'restored', 'kept'].includes(String(r.state)),
    ) &&
    new Set(v.reversions.map((r) => r.id)).size === v.reversions.length &&
    v.seenUpdates.every((id) => str(id, 200))
  );
}
export function copySupport(v: SupportRecord): SupportRecord {
  return {
    attempts: v.attempts.map(({ path, stepId, label, result, at }) => ({
      path,
      stepId,
      label,
      result,
      at,
    })),
    reversions: v.reversions.map(
      ({ id, setting, original, restore, state }) => ({
        id,
        setting,
        original,
        restore,
        state,
      }),
    ),
    seenUpdates: [...v.seenUpdates],
  };
}
export function changeSupport(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  id: string,
  change: (record: SavedSolution) => SavedSolution,
) {
  const current = readSolutions(storage).find((item) => item.id === id);
  if (!current) throw new Error('missing-record');
  const next = { ...change(current), updatedAt: new Date().toISOString() };
  upsertSolution(storage, next);
  return next;
}
export function recordAttempt(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  id: string,
  attempt: Attempt,
) {
  return changeSupport(storage, id, (current) => {
    const support = current.support || emptySupport();
    return {
      ...current,
      articlePath: current.articlePath || attempt.path,
      stepId:
        !current.articlePath || current.articlePath === attempt.path
          ? attempt.stepId
          : current.stepId,
      status:
        attempt.result === 'resolved'
          ? 'resolved'
          : attempt.result === 'unresolved'
            ? 'unresolved'
            : current.status,
      support: {
        ...support,
        attempts: [
          ...support.attempts.filter(
            (a) => a.path !== attempt.path || a.stepId !== attempt.stepId,
          ),
          attempt,
        ],
      },
    };
  });
}
