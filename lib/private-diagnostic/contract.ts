import { stepLabels } from './steps';
import { parseEnvelope as parseFeedbackEnvelope } from '../diagnostic-feedback/contract';
export const MAX_REPORT_BYTES = 4096;
export const readStates = [
  'not-read',
  'complete',
  'access-denied',
  'unavailable',
  'timed-out',
  'partial',
  'cancelled',
] as const;
export const symptoms = [
  'launch',
  'crash',
  'black-screen',
  'freeze',
  'low-fps',
  'stutter',
  'other',
] as const;
export type PrivateReport = {
  next_step: string | null;
  schema_version: 1;
  kind: 'private-diagnostic';
  tool_version: string;
  game: 'general' | 'wilds';
  symptom: (typeof symptoms)[number];
  observed: {
    application: {
      status: (typeof readStates)[number];
      exact_matches: number;
      name_matches: number;
      other_target_records: number;
      examined: number;
      unsupported: number;
      limit_reached: boolean;
    };
    system: {
      status: (typeof readStates)[number];
      restart_record: boolean;
      display_record: boolean;
    };
  };
  self_report: {
    whole_pc_issue: 'unknown' | 'yes' | 'no';
    trial: 'not-tested' | 'better' | 'same' | 'worse' | 'unsure';
  };
};
function record(
  value: unknown,
  keys: string[],
): asserts value is Record<string, unknown> {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.keys(value).length !== keys.length ||
    !keys.every((k) => Object.hasOwn(value, k))
  )
    throw Error('Unsupported fields');
}
function member(value: unknown, values: readonly unknown[]) {
  if (!values.includes(value)) throw Error('Unsupported value');
}
export function parseReport(value: unknown): PrivateReport {
  record(value, [
    'next_step',
    'schema_version',
    'kind',
    'tool_version',
    'game',
    'symptom',
    'observed',
    'self_report',
  ]);
  if (
    value.next_step !== null &&
    (typeof value.next_step !== 'string' ||
      !Object.hasOwn(stepLabels, value.next_step))
  )
    throw Error('Invalid next step');
  member(value.schema_version, [1]);
  member(value.kind, ['private-diagnostic']);
  if (
    typeof value.tool_version !== 'string' ||
    value.tool_version.length > 23 ||
    !/^\d{1,5}(\.\d{1,5}){0,3}$/.test(value.tool_version)
  )
    throw Error('Invalid version');
  member(value.game, ['general', 'wilds']);
  member(value.symptom, symptoms);
  record(value.observed, ['application', 'system']);
  const a = value.observed.application,
    s = value.observed.system;
  record(a, [
    'status',
    'exact_matches',
    'name_matches',
    'other_target_records',
    'examined',
    'unsupported',
    'limit_reached',
  ]);
  record(s, ['status', 'restart_record', 'display_record']);
  member(a.status, readStates);
  member(s.status, readStates);
  for (const key of [
    'exact_matches',
    'name_matches',
    'other_target_records',
    'examined',
    'unsupported',
  ])
    if (!Number.isInteger(a[key]) || Number(a[key]) < 0 || Number(a[key]) > 300)
      throw Error('Invalid count');
  if (
    Number(a.exact_matches) +
      Number(a.name_matches) +
      Number(a.other_target_records) +
      Number(a.unsupported) >
    Number(a.examined)
  )
    throw Error('Inconsistent counts');
  member(a.limit_reached, [true, false]);
  member(s.restart_record, [true, false]);
  member(s.display_record, [true, false]);
  if (a.status === 'complete' && (a.limit_reached || a.unsupported !== 0))
    throw Error('Incomplete evidence');
  record(value.self_report, ['whole_pc_issue', 'trial']);
  member(value.self_report.whole_pc_issue, ['unknown', 'yes', 'no']);
  member(value.self_report.trial, [
    'not-tested',
    'better',
    'same',
    'worse',
    'unsure',
  ]);
  if (new TextEncoder().encode(JSON.stringify(value)).length > MAX_REPORT_BYTES)
    throw Error('Report too large');
  // Canonical field order for byte-stable retry checks; no original object retained.
  return {
    next_step: value.next_step as string | null,
    schema_version: 1,
    kind: 'private-diagnostic',
    tool_version: value.tool_version,
    game: value.game as PrivateReport['game'],
    symptom: value.symptom as PrivateReport['symptom'],
    observed: {
      application: {
        status: a.status as PrivateReport['observed']['application']['status'],
        exact_matches: Number(a.exact_matches),
        name_matches: Number(a.name_matches),
        other_target_records: Number(a.other_target_records),
        examined: Number(a.examined),
        unsupported: Number(a.unsupported),
        limit_reached: a.limit_reached as boolean,
      },
      system: {
        status: s.status as PrivateReport['observed']['system']['status'],
        restart_record: s.restart_record as boolean,
        display_record: s.display_record as boolean,
      },
    },
    self_report: {
      whole_pc_issue: value.self_report
        .whole_pc_issue as PrivateReport['self_report']['whole_pc_issue'],
      trial: value.self_report.trial as PrivateReport['self_report']['trial'],
    },
  };
}
export function parseEnvelope(value: unknown, deletion = false) {
  if (deletion)
    return { ...parseFeedbackEnvelope(value, true), report: undefined };
  record(value, ['receipt_id', 'delete_key', 'report', 'consent_version']);
  if (value.consent_version !== 1) throw Error('Consent required');
  const identity = parseFeedbackEnvelope(
    { receipt_id: value.receipt_id, delete_key: value.delete_key },
    true,
  );
  return { ...identity, report: parseReport(value.report) };
}
