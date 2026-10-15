import { articleReview } from '../fix-save';
export const symptoms = [
  'launch',
  'crash',
  'performance',
  'display',
  'network',
  'audio',
  'other',
] as const;
export const outcomes = ['unresolved', 'resolved', 'recurrence'] as const;
export const reasons = [
  'privacy',
  'incorrect',
  'duplicate',
  'abuse',
  'other',
] as const;
export const labels = [
  'self-report',
  'separate-environment',
  'official-fix',
] as const;
export type Symptom = (typeof symptoms)[number];
export type Outcome = (typeof outcomes)[number];
export type Source = { url: string; readOn: string | null };
export type Content = {
  articlePath: string;
  symptom: Symptom;
  stepIds: string[];
  outcome: Outcome;
  observedOn: string | null;
  version: string;
  os: 'unknown' | 'windows-10' | 'windows-11' | 'other';
  gpu: 'unknown' | 'nvidia' | 'amd' | 'intel' | 'other';
  sources: Source[];
};
export type Evidence = {
  label: (typeof labels)[number];
  checkedOn: string;
  basis: 'self-report' | 'separate-pc-test' | 'official-announcement';
  sources: { url: string; readOn: string }[];
  observedOn: string | null;
  result: Outcome | null;
  environment: string;
  note: string;
};
export { ID, SECRET } from './ids';
export const RETENTION_SECONDS = 30 * 86400; // Proposed new policy; not applied to production.
export const MAX_REVISIONS = 20;
export function exact(
  value: unknown,
  keys: string[],
): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).every((k) => keys.includes(k))
  );
}
export function day(
  value: unknown,
  now: number,
  nullable = true,
): string | null {
  if (nullable && value === null) return null;
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value ||
    value > new Date(now * 1000).toISOString().slice(0, 10)
  )
    throw Error('date');
  return value;
}
export function sourceUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 400) throw Error('source');
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.port ||
    !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname) ||
    /(?:^|\.)(?:localhost|local|internal|test|invalid)$/i.test(url.hostname)
  )
    throw Error('source');
  return url.href;
}
export function parseContent(value: unknown, now: number): Content {
  if (
    !exact(value, [
      'articlePath',
      'symptom',
      'stepIds',
      'outcome',
      'observedOn',
      'version',
      'os',
      'gpu',
      'sources',
    ]) ||
    typeof value.articlePath !== 'string' ||
    !/^\/games\/[a-z0-9-]+\/[a-z0-9-]+$/.test(value.articlePath)
  )
    throw Error('content');
  const review = articleReview(value.articlePath);
  if (
    !review?.gameSlug ||
    !symptoms.includes(value.symptom as Symptom) ||
    !outcomes.includes(value.outcome as Outcome) ||
    !Array.isArray(value.stepIds) ||
    value.stepIds.length < 1 ||
    value.stepIds.length > 8 ||
    new Set(value.stepIds).size !== value.stepIds.length ||
    !value.stepIds.every((id) => review.steps.some((s) => s.id === id)) ||
    typeof value.version !== 'string' ||
    (value.version !== '' &&
      !/^[0-9][0-9A-Za-z.+_-]{0,23}$/.test(value.version)) ||
    !['unknown', 'windows-10', 'windows-11', 'other'].includes(
      value.os as string,
    ) ||
    !['unknown', 'nvidia', 'amd', 'intel', 'other'].includes(
      value.gpu as string,
    ) ||
    !Array.isArray(value.sources) ||
    value.sources.length > 3
  )
    throw Error('content');
  const sources = value.sources.map((s) => {
    if (!exact(s, ['url', 'readOn'])) throw Error('source');
    return { url: sourceUrl(s.url), readOn: day(s.readOn, now) };
  });
  return {
    articlePath: value.articlePath,
    symptom: value.symptom as Symptom,
    stepIds: value.stepIds as string[],
    outcome: value.outcome as Outcome,
    observedOn: day(value.observedOn, now),
    version: value.version,
    os: value.os as Content['os'],
    gpu: value.gpu as Content['gpu'],
    sources,
  };
}
function text(value: unknown, max: number) {
  if (typeof value !== 'string' || value.length > max || /[<>@]/.test(value))
    throw Error('evidence');
  for (let i = 0; i < value.length; i++)
    if (value.charCodeAt(i) < 32) throw Error('evidence');
  return value.trim();
}
export function parseEvidence(value: unknown, now: number): Evidence {
  if (
    !exact(value, [
      'label',
      'checkedOn',
      'basis',
      'sources',
      'observedOn',
      'result',
      'environment',
      'note',
    ]) ||
    !labels.includes(value.label as Evidence['label']) ||
    !Array.isArray(value.sources) ||
    value.sources.length > 3
  )
    throw Error('evidence');
  const label = value.label as Evidence['label'];
  const expected = {
    'self-report': 'self-report',
    'separate-environment': 'separate-pc-test',
    'official-fix': 'official-announcement',
  }[label];
  if (value.basis !== expected) throw Error('evidence');
  const sources = value.sources.map((s) => {
    if (!exact(s, ['url', 'readOn'])) throw Error('source');
    return { url: sourceUrl(s.url), readOn: day(s.readOn, now, false)! };
  });
  const environment = text(value.environment, 120),
    note = text(value.note, 300);
  const observedOn = day(value.observedOn, now);
  const result = value.result === null ? null : (value.result as Outcome);
  if (result !== null && !outcomes.includes(result)) throw Error('evidence');
  if (
    label !== 'self-report' &&
    (!sources.length || !note || !observedOn || !result)
  )
    throw Error('evidence');
  if (label === 'separate-environment' && !environment) throw Error('evidence');
  const checkedOn = day(value.checkedOn, now, false)!;
  if (
    sources.some((s) => s.readOn > checkedOn) ||
    (observedOn && observedOn > checkedOn)
  )
    throw Error('evidence');
  return {
    label,
    checkedOn,
    basis: expected as Evidence['basis'],
    sources,
    observedOn,
    result,
    environment,
    note,
  };
}
export type PublicReport = {
  id: string;
  revision: number;
  content: Content;
  evidence: Evidence;
  postedAt: number;
  updatedAt: number;
};
export type OwnerReport = {
  id: string;
  revision: number;
  content: Content;
  state: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  history: {
    revision: number;
    content: Content | null;
    at: number;
    action: string;
  }[];
  audit: {
    at: number;
    revision: number;
    action: string;
    reason: string;
    evidence: Evidence | null;
  }[];
  withdrawalPending: boolean;
};
