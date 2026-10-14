import { MY_GAMES_KEY, MY_PC_KEY, type MyPc } from './my-pc';
import { parseRegisteredGames } from './my-games-selection';
import {
  SOLUTIONS_KEY,
  parseSolutions,
  type SavedSolution,
} from './saved-solutions';
import {
  SETTINGS_SNAPSHOTS_KEY,
  parseSettingsSnapshots,
  type SettingsSnapshot,
} from './game-settings-snapshots';
import {
  GAME_EXPERIMENTS_KEY,
  parseGameExperiments,
  type GameExperiment,
} from './game-experiments';
import {
  PLAY_PLANS_KEY,
  TODAY_CHOICES_KEY,
  parsePlayPlans,
  parseTodayChoices,
  type PlayPlan,
  type TodayChoice,
} from './play-plans';
import {
  PLAY_ACTIVITY_KEY,
  parsePlayActivity,
  type PlayActivity,
} from './play-activity';
import { CHANGES_READ_KEY, parseReadChanges } from './my-game-changes-read';
export const BACKUP_MAX_BYTES = 5_000_000;
export const BACKUP_RECOVERY_KEY = 'gemnao-my-games-recovery-v1';
export const BACKUP_EVENT = 'gemnao-my-games-backup';
export const backupKeys = [
  MY_GAMES_KEY,
  MY_PC_KEY,
  SOLUTIONS_KEY,
  SETTINGS_SNAPSHOTS_KEY,
  GAME_EXPERIMENTS_KEY,
  PLAY_PLANS_KEY,
  PLAY_ACTIVITY_KEY,
  CHANGES_READ_KEY,
  TODAY_CHOICES_KEY,
] as const;
export const backupCategories = [
  'games',
  'pc',
  'notes',
  'snapshots',
  'experiments',
  'plans',
  'activity',
  'read',
  'today',
] as const;
export type BackupData = {
  games: string[];
  pc: MyPc | null;
  notes: SavedSolution[];
  snapshots: SettingsSnapshot[];
  experiments: GameExperiment[];
  plans: PlayPlan[];
  activity: PlayActivity[];
  read: string[];
  today: TodayChoice | null;
};
export type BackupCategory = (typeof backupCategories)[number];
export type BackupRow = {
  category: BackupCategory;
  existing: number;
  incoming: number;
  added: number;
  duplicate: number;
  conflict: number;
};
type RawState = Record<(typeof backupKeys)[number], string | null>;
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export class BackupError extends Error {
  constructor(
    readonly code:
      | 'currentInvalid'
      | 'invalid'
      | 'size'
      | 'limit'
      | 'changed'
      | 'storage'
      | 'pending'
      | 'recoveryConflict'
      | 'recoveryInvalid'
      | 'rolledBack',
  ) {
    super(code);
  }
}
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(v).length === keys.length &&
  keys.every((k) => Object.hasOwn(v, k));
const bytes = (s: string) => new TextEncoder().encode(s).byteLength;
const items = (v: unknown) => JSON.stringify({ version: 1, items: v });
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);
function pc(raw: string | null): MyPc | null {
  if (raw === null) return null;
  const v: unknown = JSON.parse(raw);
  if (
    !obj(v) ||
    typeof v.gpu !== 'string' ||
    !/^[a-z0-9-]{1,100}$/.test(v.gpu) ||
    typeof v.ramGb !== 'number' ||
    !Number.isFinite(v.ramGb) ||
    v.ramGb < 1 ||
    v.ramGb > 2048 ||
    !(v.windows === 10 || v.windows === 11)
  )
    throw new BackupError('invalid');
  return { gpu: v.gpu, ramGb: v.ramGb, windows: v.windows as 10 | 11 };
}
function fromRaw(raw: RawState): BackupData {
  try {
    return {
      games: parseRegisteredGames(raw[MY_GAMES_KEY]),
      pc: pc(raw[MY_PC_KEY]),
      notes: parseSolutions(raw[SOLUTIONS_KEY]),
      snapshots: parseSettingsSnapshots(raw[SETTINGS_SNAPSHOTS_KEY]),
      experiments: parseGameExperiments(raw[GAME_EXPERIMENTS_KEY]),
      plans: parsePlayPlans(raw[PLAY_PLANS_KEY]),
      activity: parsePlayActivity(raw[PLAY_ACTIVITY_KEY]),
      read: parseReadChanges(raw[CHANGES_READ_KEY]).read,
      today: parseTodayChoices(raw[TODAY_CHOICES_KEY])[0] || null,
    };
  } catch {
    throw new BackupError('invalid');
  }
}
function readRaw(storage: Pick<Storage, 'getItem'>): RawState {
  try {
    return Object.fromEntries(
      backupKeys.map((k) => [k, storage.getItem(k)]),
    ) as RawState;
  } catch {
    throw new BackupError('storage');
  }
}
function readCurrent(storage: Pick<Storage, 'getItem'>) {
  const raw = readRaw(storage);
  try {
    return { raw, data: fromRaw(raw) };
  } catch {
    throw new BackupError('currentInvalid');
  }
}
function toRaw(d: BackupData): RawState {
  return {
    [MY_GAMES_KEY]: JSON.stringify(d.games),
    [MY_PC_KEY]: d.pc ? JSON.stringify(d.pc) : null,
    [SOLUTIONS_KEY]: items(d.notes),
    [SETTINGS_SNAPSHOTS_KEY]: items(d.snapshots),
    [GAME_EXPERIMENTS_KEY]: items(d.experiments),
    [PLAY_PLANS_KEY]: items(d.plans),
    [PLAY_ACTIVITY_KEY]: items(d.activity),
    [CHANGES_READ_KEY]: JSON.stringify({ version: 1, read: d.read }),
    [TODAY_CHOICES_KEY]: d.today
      ? JSON.stringify({ version: 1, ...d.today })
      : null,
  };
}
function checkLimits(d: BackupData) {
  try {
    fromRaw(toRaw(d));
  } catch {
    throw new BackupError('limit');
  }
  for (const [records, cap] of [
    [d.snapshots, 10],
    [d.experiments, 20],
  ] as const) {
    const counts = new Map<string, number>();
    for (const r of records) {
      const n = (counts.get(r.gameSlug) || 0) + 1;
      counts.set(r.gameSlug, n);
      if (n > cap) throw new BackupError('limit');
    }
  }
  if (bytes(JSON.stringify(d)) > BACKUP_MAX_BYTES - 200)
    throw new BackupError('size');
}
function envelope(d: BackupData) {
  checkLimits(d);
  const raw = JSON.stringify(
    {
      format: 'gemnao-my-games',
      version: 1,
      createdAt: new Date().toISOString(),
      data: d,
    },
    null,
    2,
  );
  if (bytes(raw) > BACKUP_MAX_BYTES) throw new BackupError('size');
  return raw;
}
export function exportMyGames(storage: Pick<Storage, 'getItem'>) {
  return envelope(readCurrent(storage).data);
}
export function parseMyGamesBackup(raw: string): {
  data: Partial<BackupData>;
  legacy: boolean;
} {
  if (raw.length > BACKUP_MAX_BYTES || bytes(raw) > BACKUP_MAX_BYTES)
    throw new BackupError('size');
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    throw new BackupError('invalid');
  }
  try {
    if (obj(v) && exact(v, ['version', 'items']) && v.version === 1) {
      return { data: { notes: parseSolutions(raw) }, legacy: true };
    }
    if (
      !obj(v) ||
      !exact(v, ['format', 'version', 'createdAt', 'data']) ||
      v.format !== 'gemnao-my-games' ||
      v.version !== 1 ||
      typeof v.createdAt !== 'string' ||
      !Number.isFinite(Date.parse(v.createdAt)) ||
      !obj(v.data) ||
      !exact(v.data, backupCategories)
    )
      throw new BackupError('invalid');
    // Round-trip through each established parser, copying only known application fields.
    const d = v.data;
    const normalized = fromRaw({
      [MY_GAMES_KEY]: JSON.stringify(d.games),
      [MY_PC_KEY]: d.pc === null ? null : JSON.stringify(d.pc),
      [SOLUTIONS_KEY]: items(d.notes),
      [SETTINGS_SNAPSHOTS_KEY]: items(d.snapshots),
      [GAME_EXPERIMENTS_KEY]: items(d.experiments),
      [PLAY_PLANS_KEY]: items(d.plans),
      [PLAY_ACTIVITY_KEY]: items(d.activity),
      [CHANGES_READ_KEY]: JSON.stringify({ version: 1, read: d.read }),
      [TODAY_CHOICES_KEY]:
        d.today === null
          ? null
          : JSON.stringify({ version: 1, ...(obj(d.today) ? d.today : {}) }),
    });
    checkLimits(normalized);
    return { data: normalized, legacy: false };
  } catch (e) {
    if (e instanceof BackupError) throw e;
    throw new BackupError('invalid');
  }
}
// Reference aliases are deterministic; a captured conflicting setting never appears
// to refer to a different live setting. No hidden source record is overwritten.
function alias(id: string, value: unknown, max = 80) {
  const s = JSON.stringify(value);
  let a = 2166136261,
    b = 3339675911;
  for (let i = 0; i < s.length; i++) {
    a = Math.imul(a ^ s.charCodeAt(i), 16777619);
    b = Math.imul(b ^ s.charCodeAt(i), 2246822519);
  }
  return `${id.slice(0, max - 24)}-ref-${(a >>> 0).toString(16)}-${(b >>> 0).toString(16)}`;
}
export type RestorePreview = {
  before: RawState;
  after: RawState;
  rows: BackupRow[];
  legacy: boolean;
  data: BackupData;
};
export function previewMyGamesRestore(
  storage: Pick<Storage, 'getItem'>,
  raw: string,
): RestorePreview {
  if (storage.getItem(BACKUP_RECOVERY_KEY) !== null)
    throw new BackupError('pending');
  const state = readCurrent(storage);
  const before = state.raw,
    current = state.data,
    incoming = parseMyGamesBackup(raw);
  const d = incoming.data;
  const rows: BackupRow[] = [];
  function merge<T>(
    category: BackupCategory,
    existing: T[],
    incoming: T[],
    id: (v: T) => string,
  ): T[] {
    const row = {
      category,
      existing: existing.length,
      incoming: incoming.length,
      added: 0,
      duplicate: 0,
      conflict: 0,
    };
    const next = [...existing];
    for (const value of incoming) {
      const old = next.find((v) => id(v) === id(value));
      if (!old) {
        next.push(value);
        row.added++;
      } else if (same(old, value)) {
        row.duplicate++;
      } else row.conflict++;
    }
    rows.push(row);
    return next;
  }
  const noteAliases = new Map<string, string>();
  for (const n of d.notes || []) {
    const old = current.notes.find((o) => o.id === n.id);
    if (old && !same(old, n)) {
      let id = alias(n.id, n, 240),
        i = 0;
      while (current.notes.some((o) => o.id === id))
        id = alias(n.id, { n, i: ++i }, 240);
      noteAliases.set(n.id, id);
    }
  }
  const noteRef = (id: string | undefined) =>
    id ? noteAliases.get(id) || id : undefined;
  function snapshotRef(s: SettingsSnapshot | null): SettingsSnapshot | null {
    if (!s) return null;
    const v = {
      ...s,
      ...(s.sourceNoteId ? { sourceNoteId: noteRef(s.sourceNoteId) } : {}),
    };
    const old = current.snapshots.find((o) => o.id === v.id);
    if (old && !same(old, v)) {
      let id = alias(v.id, v);
      let i = 0;
      while (
        current.snapshots.some(
          (o) => o.id === id && !same({ ...o, id: v.id }, v),
        )
      )
        id = alias(v.id, { v, i: ++i });
      return { ...v, id };
    }
    return v;
  }
  const data: BackupData = {
    games: merge('games', current.games, d.games || [], (v) => v),
    pc:
      merge(
        'pc',
        current.pc ? [current.pc] : [],
        d.pc ? [d.pc] : [],
        () => 'pc',
      )[0] || null,
    notes: merge('notes', current.notes, d.notes || [], (v) => v.id),
    snapshots: merge(
      'snapshots',
      current.snapshots,
      (d.snapshots || []).map((s) => ({
        ...s,
        ...(s.sourceNoteId ? { sourceNoteId: noteRef(s.sourceNoteId) } : {}),
      })),
      (v) => v.id,
    ),
    experiments: merge(
      'experiments',
      current.experiments,
      (d.experiments || []).map((v) => ({
        ...v,
        before: snapshotRef(v.before),
        after: snapshotRef(v.after),
      })),
      (v) => v.id,
    ),
    plans: merge(
      'plans',
      current.plans,
      (d.plans || []).map((v) => ({ ...v, snapshot: snapshotRef(v.snapshot) })),
      (v) => v.gameSlug,
    ),
    activity: merge(
      'activity',
      current.activity,
      (d.activity || []).map((v) => ({
        ...v,
        noteId: noteRef(v.noteId) || '',
      })),
      (v) => v.gameSlug,
    ),
    read: merge('read', current.read, d.read || [], (v) => v),
    today:
      merge(
        'today',
        current.today ? [current.today] : [],
        d.today ? [d.today] : [],
        () => 'today',
      )[0] || null,
  };
  checkLimits(data);
  const serialized = toRaw(data),
    canonicalBefore = toRaw(current);
  const after = Object.fromEntries(
    backupKeys.map((k) => [
      k,
      serialized[k] === canonicalBefore[k] ? before[k] : serialized[k],
    ]),
  ) as RawState;
  return { before, after, rows, legacy: incoming.legacy, data };
}
type Recovery = { version: 1; before: RawState; after: RawState };
export function parseRecoveryRecords(raw: string | null): Recovery[] {
  if (raw === null) return [];
  try {
    if (raw.length > 20_000_000) throw Error();
    const v: unknown = JSON.parse(raw);
    if (
      !obj(v) ||
      !exact(v, ['version', 'before', 'after']) ||
      v.version !== 1 ||
      !obj(v.before) ||
      !obj(v.after) ||
      !exact(v.before, backupKeys) ||
      !exact(v.after, backupKeys) ||
      [v.before, v.after].some((o) =>
        backupKeys.some((k) => o[k] !== null && typeof o[k] !== 'string'),
      )
    )
      throw Error();
    fromRaw(v.before as RawState);
    fromRaw(v.after as RawState);
    return [v as unknown as Recovery];
  } catch {
    throw new BackupError('recoveryInvalid');
  }
}
export function recoverMyGames(storage: Store) {
  const r = parseRecoveryRecords(storage.getItem(BACKUP_RECOVERY_KEY))[0];
  if (!r) return;
  const current = readRaw(storage);
  if (
    backupKeys.some(
      (k) => current[k] !== r.before[k] && current[k] !== r.after[k],
    )
  )
    throw new BackupError('recoveryConflict');
  try {
    for (const k of [...backupKeys].reverse()) {
      const value = storage.getItem(k);
      if (value !== r.before[k] && value !== r.after[k])
        throw new BackupError('recoveryConflict');
      if (value === r.before[k]) continue;
      if (r.before[k] === null) storage.removeItem(k);
      else storage.setItem(k, r.before[k]!);
    }
    storage.removeItem(BACKUP_RECOVERY_KEY);
  } catch (e) {
    if (e instanceof BackupError) throw e;
    throw new BackupError('storage');
  }
}
export function exportRecovery(storage: Pick<Storage, 'getItem'>) {
  const r = parseRecoveryRecords(storage.getItem(BACKUP_RECOVERY_KEY))[0];
  if (!r) throw new BackupError('recoveryInvalid');
  return envelope(fromRaw(r.before));
}
export function restoreMyGames(storage: Store, preview: RestorePreview) {
  if (storage.getItem(BACKUP_RECOVERY_KEY) !== null)
    throw new BackupError('pending');
  if (!same(readRaw(storage), preview.before)) throw new BackupError('changed');
  const changed = backupKeys.filter(
    (k) => preview.before[k] !== preview.after[k],
  );
  if (!changed.length) return;
  // Reserve recovery data before the first mutation. If this cannot fit, nothing changes.
  const journal = JSON.stringify({
    version: 1,
    before: preview.before,
    after: preview.after,
  });
  try {
    storage.setItem(BACKUP_RECOVERY_KEY, journal);
  } catch {
    throw new BackupError('storage');
  }
  try {
    for (const k of changed) {
      if (
        storage.getItem(BACKUP_RECOVERY_KEY) !== journal ||
        storage.getItem(k) !== preview.before[k]
      )
        throw new BackupError('changed');
      if (preview.after[k] === null) storage.removeItem(k);
      else storage.setItem(k, preview.after[k]!);
    }
    if (!same(readRaw(storage), preview.after))
      throw new BackupError('changed');
    storage.removeItem(BACKUP_RECOVERY_KEY);
  } catch (e) {
    if (storage.getItem(BACKUP_RECOVERY_KEY) !== journal)
      throw new BackupError('changed');
    try {
      recoverMyGames(storage);
    } catch {
      if (e instanceof BackupError) throw e;
      throw new BackupError('storage');
    }
    throw new BackupError(e instanceof BackupError ? e.code : 'rolledBack');
  }
}
