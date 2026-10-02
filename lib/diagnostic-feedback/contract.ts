export const MAX_REPORT_BYTES = 4096;
export const actionIds = [
  'wilds-files',
  'wilds-driver',
  'wilds-capture',
  'wilds-admin-flag',
  'wilds-compatibility',
  'wilds-mods',
  'wilds-traces',
  'wilds-textures',
  'wilds-security',
  'wilds-requirements',
  'wilds-records',
  'wilds-stop',
  'wilds-steam-client-review',
] as const;
export const symptoms = [
  'launch-crash',
  'black-screen',
  'graphics-error',
  'shader-preparation',
  'in-game-crash',
  'unknown',
] as const;
export const outcomes = [
  'resolved',
  'improved',
  'unchanged',
  'worse',
  'not-tried',
  'unknown',
] as const;
export type Report = {
  schema_version: 1;
  game_id: 'monster-hunter-wilds';
  symptom: (typeof symptoms)[number];
  source: 'native-windows' | 'web-manual';
  tool_version: string;
  rule_version: string;
  os_family?: string;
  gpu_vendor?: string;
  driver_version?: string;
  actions: {
    action_id: (typeof actionIds)[number];
    outcome: (typeof outcomes)[number];
    evidence: 'self-report';
  }[];
};
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const hasOnly = (v: Record<string, unknown>, keys: string[]) =>
  Object.keys(v).every((k) => keys.includes(k));
const oneOf = (v: unknown, choices: readonly string[]) =>
  typeof v === 'string' && choices.includes(v);
const version = (v: unknown) =>
  typeof v === 'string' &&
  v.length <= 23 &&
  /^\d{1,5}(\.\d{1,5}){0,3}$/.test(v);
export function parseReport(value: unknown): Report {
  if (
    !object(value) ||
    !hasOnly(value, [
      'schema_version',
      'game_id',
      'symptom',
      'source',
      'tool_version',
      'rule_version',
      'os_family',
      'gpu_vendor',
      'driver_version',
      'actions',
    ]) ||
    value.schema_version !== 1 ||
    value.game_id !== 'monster-hunter-wilds' ||
    !oneOf(value.symptom, symptoms) ||
    !oneOf(value.source, ['native-windows', 'web-manual']) ||
    !version(value.tool_version) ||
    !version(value.rule_version)
  )
    throw new Error('形式またはバージョンが対応していません');
  if (
    value.os_family !== undefined &&
    !oneOf(value.os_family, ['windows-10', 'windows-11', 'other', 'unknown'])
  )
    throw new Error('OS分類が不正です');
  if (
    value.gpu_vendor !== undefined &&
    !oneOf(value.gpu_vendor, ['nvidia', 'amd', 'intel', 'other', 'unknown'])
  )
    throw new Error('GPU分類が不正です');
  if (value.driver_version !== undefined && !version(value.driver_version))
    throw new Error('ドライバー版が不正です');
  if (
    !Array.isArray(value.actions) ||
    value.actions.length < 1 ||
    value.actions.length > 8
  )
    throw new Error('手順は1〜8件です');
  const seen = new Set();
  for (const action of value.actions) {
    if (
      !object(action) ||
      !hasOnly(action, ['action_id', 'outcome', 'evidence']) ||
      !oneOf(action.action_id, actionIds) ||
      !oneOf(action.outcome, outcomes) ||
      action.evidence !== 'self-report' ||
      seen.has(action.action_id)
    )
      throw new Error('手順・結果が不正です');
    seen.add(action.action_id);
  }
  if (new TextEncoder().encode(JSON.stringify(value)).length > MAX_REPORT_BYTES)
    throw new Error('ファイルは4KB以内です');
  // Rebuild in stable field order for retry comparison. Never preserve unknown data.
  return {
    schema_version: 1,
    game_id: 'monster-hunter-wilds',
    symptom: value.symptom as Report['symptom'],
    source: value.source as Report['source'],
    tool_version: value.tool_version as string,
    rule_version: value.rule_version as string,
    ...(value.os_family ? { os_family: value.os_family as string } : {}),
    ...(value.gpu_vendor ? { gpu_vendor: value.gpu_vendor as string } : {}),
    ...(value.driver_version
      ? { driver_version: value.driver_version as string }
      : {}),
    actions: value.actions.map((a) => ({
      action_id: a.action_id,
      outcome: a.outcome,
      evidence: 'self-report',
    })),
  };
}
export function parseEnvelope(value: unknown, deletion = false) {
  if (
    !object(value) ||
    !hasOnly(
      value,
      deletion
        ? ['receipt_id', 'delete_key']
        : ['receipt_id', 'delete_key', 'report', 'consent_version'],
    ) ||
    typeof value.receipt_id !== 'string' ||
    !/^[a-f0-9]{32}$/.test(value.receipt_id) ||
    typeof value.delete_key !== 'string' ||
    !/^[a-f0-9]{64}$/.test(value.delete_key) ||
    (!deletion && value.consent_version !== 1)
  )
    throw new Error('送信形式が不正です');
  return {
    receipt_id: value.receipt_id,
    delete_key: value.delete_key,
    report: deletion ? undefined : parseReport(value.report),
  };
}
