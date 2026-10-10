import {
  isSymptom,
  answerLabel,
  isPcIssue,
  observationQuestion,
  questions,
  statuses,
  type Answers,
  type ActionStatus,
  RULE_VERSION,
  decisionFields,
} from './model';
import { actions, diagnose } from './rules';
export function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
export function exactKeys(value: Record<string, unknown>, allowed: string[]) {
  return Object.keys(value).every((k) => allowed.includes(k));
}
export const legacyAnswerKeys = [
  'symptom', 'scope', 'observation', 'error', 'change', 'launcher', 'os', 'gpu', 'ram',
];
/** Enum-only values. New decision context stays local and never contains device identifiers. */
export function validateAnswerChoices(value: unknown): Answers | null {
  if (!record(value) || !exactKeys(value, [...legacyAnswerKeys, 'safety', 'storage', ...decisionFields])) return null;
  const a: Answers = {};
  for (const [key, v] of Object.entries(value)) {
    const q = key === 'observation' ? observationQuestion(value as Answers) : questions[key];
    if (typeof v !== 'string' || !q?.options.some((o) => o.value === v)) return null;
    a[key as keyof Answers] = v;
  }
  if (a.observation !== 'error' && a.error !== undefined) return null;
  return a;
}
export function validateAnswers(value: unknown): Answers | null {
  const a = validateAnswerChoices(value);
  if (!a) return null;
  const hasLocalContext = Object.keys(a).some((key) => !legacyAnswerKeys.includes(key));
  if (hasLocalContext) {
    if (!a.safety) return null;
    if (a.safety === 'danger') return a;
    if (!a.storage) return null;
    if (a.storage === 'critical') return a;
  }
  if (!isSymptom(a.symptom) || !a.scope) return null;
  if (!isPcIssue(a) && (!a.observation || !a.change || !a.launcher || !a.os || !a.gpu || !a.ram || (a.observation === 'error' && !a.error))) return null;
  if (isPcIssue(a) && Object.keys(a).some((k) => legacyAnswerKeys.includes(k) && !['symptom', 'scope'].includes(k))) return null;
  return a;
}
export function validateStatuses(
  value: unknown,
): Record<string, ActionStatus> | null {
  if (!record(value) || Object.keys(value).length > Object.keys(actions).length)
    return null;
  const result: Record<string, ActionStatus> = {};
  for (const [key, v] of Object.entries(value)) {
    if (
      !Object.hasOwn(actions, key) ||
      typeof v !== 'string' ||
      !Object.hasOwn(statuses, v)
    )
      return null;
    result[key] = v as ActionStatus;
  }
  return result;
}
export function buildSnapshot(input: unknown) {
  if (
    !record(input) ||
    !exactKeys(input, ['answers', 'tried', 'results', 'version']) ||
    input.version !== RULE_VERSION
  )
    return null;
  const answers = validateAnswers(input.answers),
    tried = validateStatuses(input.tried),
    results = validateStatuses(input.results);
  if (!answers || !tried || !results) return null;
  // The existing share protocol is intentionally unchanged: repair context is local-only.
  if (Object.keys(answers).some((key) => !legacyAnswerKeys.includes(key))) return null;
  const result = diagnose(answers, tried);
  const allowed = new Set([
    ...Object.keys(tried),
    ...result.recommendations.map((r) => r.action.id),
  ]);
  if (Object.keys(results).some((k) => !allowed.has(k))) return null;
  const answerLabels = Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [
      key,
      answerLabel(key, value!, answers.symptom),
    ]),
  );
  const actionLabels = Object.fromEntries(
    [...allowed].map((id) => [id, actions[id].title]),
  );
  return { answers, answerLabels, tried, results, actionLabels, result };
}
export type Snapshot = NonNullable<ReturnType<typeof buildSnapshot>>;
