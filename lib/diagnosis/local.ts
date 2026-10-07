import {
  RULE_VERSION,
  questionFor,
  stepsFor,
  type Answers,
  type ActionStatus,
} from './model';
import { record, validateAnswers, validateStatuses } from './validation';
export const LOCAL_KEY = 'gemnao-diagnosis-v1';
export type LocalDiagnosis = {
  version: string;
  answers: Answers;
  game: string;
  tried: Record<string, ActionStatus>;
  results: Record<string, ActionStatus>;
  step: string;
  complete: boolean;
  savedAt: number;
  shareId?: string;
};
export const freshLocal = (): LocalDiagnosis => ({
  version: RULE_VERSION,
  answers: {},
  game: '',
  tried: {},
  results: {},
  step: 'symptom',
  complete: false,
  savedAt: Date.now(),
});
export function readLocal(): LocalDiagnosis | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const d: unknown = JSON.parse(raw);
    if (
      !record(d) ||
      d.version !== RULE_VERSION ||
      typeof d.savedAt !== 'number' ||
      Date.now() - d.savedAt > 30 * 86400000 ||
      typeof d.game !== 'string' ||
      d.game.length > 80 ||
      typeof d.complete !== 'boolean' ||
      typeof d.step !== 'string' ||
      !record(d.answers) ||
      !validateStatuses(d.tried) ||
      !validateStatuses(d.results)
    ) {
      localStorage.removeItem(LOCAL_KEY);
      return null;
    }
    const answers = d.answers as Answers;
    if (
      Object.entries(answers).some(
        ([id, value]) =>
          !questionFor(id, answers)?.options.some((o) => o.value === value),
      ) ||
      !stepsFor(answers).includes(d.step) ||
      (d.complete && !validateAnswers(answers)) ||
      (d.shareId !== undefined &&
        (typeof d.shareId !== 'string' || !/^[a-f0-9]{32}$/.test(d.shareId)))
    ) {
      localStorage.removeItem(LOCAL_KEY);
      return null;
    }
    return d as LocalDiagnosis;
  } catch {
    return null;
  }
}
export function saveLocal(value: LocalDiagnosis): boolean {
  try {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({ ...value, savedAt: Date.now() }),
    );
    return true;
  } catch {
    return false;
  }
}
export function clearLocal() {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    /* Disabled storage does not block the UI. */
  }
}
export async function diagnosisRequest<T = Record<string, unknown>>(
  path: string,
  body?: unknown,
  method = 'POST',
): Promise<T> {
  const response = await fetch(`/api/diagnosis${path}`, {
    method: body === undefined && method === 'POST' ? 'GET' : method,
    credentials: 'same-origin',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    headers:
      body !== undefined
        ? { 'Content-Type': 'application/json', 'X-Diagnosis-Request': '1' }
        : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = (await response
    .json()
    .catch(() => ({ error: '応答を確認できませんでした' }))) as {
    error?: string;
  };
  if (!response.ok)
    throw new Error(
      data.error || '通信できませんでした。入力を残したまま再試行できます。',
    );
  return data as T;
}
export function metric(
  event: string,
  step = 'none',
  action = 'none',
  status = 'none',
) {
  void diagnosisRequest('/events', { event, step, action, status }).catch(
    () => {},
  );
}
