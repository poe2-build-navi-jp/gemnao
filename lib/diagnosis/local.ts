import { clearPendingShares, pendingShares, withPendingShareLock } from './pending-share';
import {
  RULE_VERSION,
  PREVIOUS_RULE_VERSION,
  questionFor,
  stepsFor,
  statuses,
  type Answers,
  type ActionStatus,
} from './model';
import {
  record,
  validateAnswers,
  validateStatuses,
  validateAnswerChoices,
} from './validation';
import { DIAGNOSIS_UNAVAILABLE } from './availability';
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
  step: 'safety',
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
      ![RULE_VERSION, PREVIOUS_RULE_VERSION, '2026-10-02.1'].includes(String(d.version)) ||
      typeof d.savedAt !== 'number' ||
      !Number.isFinite(d.savedAt) ||
      d.savedAt > Date.now() + 60000 ||
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
    const answers = validateAnswerChoices(d.answers);
    if (!answers) {
      localStorage.removeItem(LOCAL_KEY);
      return null;
    }
    if (
      Object.entries(answers).some(
        ([id, value]) =>
          !questionFor(id, answers)?.options.some((o) => o.value === value),
      ) ||
      !stepsFor(answers).includes(d.step) ||
      (d.complete &&
        (!validateAnswers(answers) ||
          (d.version === RULE_VERSION && !answers.safety))) ||
      (d.shareId !== undefined &&
        (typeof d.shareId !== 'string' || !/^[a-f0-9]{32}$/.test(d.shareId)))
    ) {
      localStorage.removeItem(LOCAL_KEY);
      return null;
    }
    if (d.version !== RULE_VERSION) {
      // Keep prior answers and records; the new safety questions must be answered afresh.
      return {
        ...(d as LocalDiagnosis),
        version: RULE_VERSION,
        answers,
        complete: false,
        step: 'safety',
        shareId: undefined,
      };
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
export async function clearLocal() {
  try {
    // Preserve ordinary local-only diagnosis erasure on browsers where sharing
    // is unavailable. Existing pending shares still require coordinated erase.
    if (typeof navigator === 'undefined' || !navigator.locks) {
      if (pendingShares().length) return false;
      localStorage.removeItem(LOCAL_KEY);
      return localStorage.getItem(LOCAL_KEY) === null;
    }
    return await withPendingShareLock(() => {
    localStorage.removeItem(LOCAL_KEY);
    clearPendingShares();
    return localStorage.getItem(LOCAL_KEY) === null && pendingShares().length === 0;
    });
  } catch {
    return false;
  }
}
export class DiagnosisRequestError extends Error {
  constructor(
    message: string,
    readonly unavailable = false,
  ) {
    super(message);
    this.name = 'DiagnosisRequestError';
  }
}

const stringArray = (value: unknown) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
const stringMap = (value: unknown) =>
  record(value) &&
  Object.keys(value).every(
    (key) => !['__proto__', 'prototype', 'constructor'].includes(key),
  ) &&
  Object.values(value).every((item) => typeof item === 'string');
const statusMap = (value: unknown) =>
  stringMap(value) &&
  Object.values(value as Record<string, string>).every((item) =>
    Object.hasOwn(statuses, item),
  );

/** Check rendering structure, without recomputing an archived rule version. */
function validSharedSnapshot(value: unknown): boolean {
  if (
    !record(value) ||
    !stringMap(value.answers) ||
    !statusMap(value.tried) ||
    !statusMap(value.results) ||
    (value.answerLabels !== undefined && !stringMap(value.answerLabels)) ||
    (value.actionLabels !== undefined && !stringMap(value.actionLabels)) ||
    !record(value.result)
  )
    return false;
  const result = value.result;
  if (
    !['version', 'checkedAt', 'scope', 'summary'].every(
      (key) => typeof result[key] === 'string',
    ) ||
    !stringArray(result.missing) ||
    !Array.isArray(result.recommendations)
  )
    return false;
  if (
    !result.recommendations.every((recommendation) => {
      if (
        !record(recommendation) ||
        typeof recommendation.ruleId !== 'string' ||
        typeof recommendation.reason !== 'string' ||
        !record(recommendation.action)
      )
        return false;
      const action = recommendation.action;
      return (
        [
          'id',
          'title',
          'time',
          'risk',
          'reversible',
          'warning',
          'improved',
          'unchanged',
          'article',
        ].every((key) => typeof action[key] === 'string') &&
        stringArray(action.steps) &&
        Array.isArray(action.sources) &&
        action.sources.every(
          (source) =>
            record(source) &&
            typeof source.label === 'string' &&
            typeof source.url === 'string',
        )
      );
    })
  )
    return false;
  if (result.decision !== undefined) {
    const decision = result.decision;
    if (
      !record(decision) ||
      !['category', 'urgency', 'title'].every(
        (key) => typeof decision[key] === 'string',
      ) ||
      !['evidence', 'nextSteps', 'comparison'].every((key) =>
        stringArray(decision[key]),
      )
    )
      return false;
  }
  return true;
}

function validResponse(path: string, method: string, value: unknown): boolean {
  if (!record(value) || Object.hasOwn(value, 'error')) return false;
  if (path === '/config')
    return ['enabled', 'sharing', 'metrics'].every(
      (key) => typeof value[key] === 'boolean',
    );
  const timestamp = (key: string) =>
    typeof value[key] === 'number' && Number.isFinite(value[key]);
  if (path === '' && method === 'POST')
    return (
      typeof value.id === 'string' &&
      /^[a-f0-9]{32}$/.test(value.id) &&
      timestamp('expiresAt') &&
      timestamp('createdAt') &&
      Number.isInteger(value.revision) &&
      ((typeof value.recoveryKey === 'string' &&
        /^[a-f0-9]{64}$/.test(value.recoveryKey)) ||
        (value.repeated === true && value.recoveryKey === null))
    );
  if (method === 'GET')
    return (
      typeof value.id === 'string' &&
      /^[a-f0-9]{32}$/.test(value.id) &&
      timestamp('expiresAt') &&
      (value.inactive === true ||
        (timestamp('createdAt') &&
          timestamp('updatedAt') &&
          Number.isInteger(value.revision) &&
          validSharedSnapshot(value.snapshot)))
    );
  if (method === 'PATCH')
    return (
      value.ok === true &&
      Number.isInteger(value.revision) &&
      timestamp('updatedAt') &&
      timestamp('expiresAt')
    );
  return value.ok === true;
}

export async function diagnosisRequest<T = Record<string, unknown>>(
  path: string,
  body?: unknown,
  method = 'POST',
): Promise<T> {
  const requestMethod =
    body === undefined && method === 'POST' ? 'GET' : method;
  let response: Response;
  try {
    response = await fetch(`/api/diagnosis${path}`, {
      method: requestMethod,
      credentials: 'same-origin',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers:
        body !== undefined
          ? { 'Content-Type': 'application/json', 'X-Diagnosis-Request': '1' }
          : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new DiagnosisRequestError(DIAGNOSIS_UNAVAILABLE, true);
  }
  // Cloudflare can return an HTML error page before the Worker runs. A 200
  // static fallback is not a successful save either. Never retry automatically.
  if (
    response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !==
    'application/json'
  )
    throw new DiagnosisRequestError(DIAGNOSIS_UNAVAILABLE, true);
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new DiagnosisRequestError(DIAGNOSIS_UNAVAILABLE, true);
  }
  if (!response.ok) {
    const knownFailure =
      record(data) &&
      ['daily_limit', 'storage_limit', 'unavailable'].includes(
        String(data.code),
      );
    const message =
      record(data) &&
      typeof data.error === 'string' &&
      (response.status < 500 || knownFailure)
        ? data.error
        : DIAGNOSIS_UNAVAILABLE;
    throw new DiagnosisRequestError(
      message,
      response.status >= 500 || knownFailure,
    );
  }
  if (!validResponse(path, requestMethod, data))
    throw new DiagnosisRequestError(DIAGNOSIS_UNAVAILABLE, true);
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
