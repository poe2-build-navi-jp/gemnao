import type { SavedSolution } from './saved-solutions';

// Immutable, user-entered records. No machine settings are read or changed.
export const SETTINGS_SNAPSHOTS_KEY = 'gemnao-settings-snapshots-v1';
export const SETTINGS_SNAPSHOTS_EVENT = 'gemnao-settings-snapshots';
export const SNAPSHOT_LIMIT = 100;
export const GAME_SNAPSHOT_LIMIT = 10;
export const settingsFields = [
  'resolution',
  'preset',
  'fpsLimit',
  'controller',
  'memo',
] as const;
export type SettingsField = (typeof settingsFields)[number];
export type SettingsDraft = Record<SettingsField, string> & {
  name: string;
  checkedOn: string;
  comfortable: boolean;
  sourceNoteId?: string;
};
export type SettingsSnapshot = SettingsDraft & {
  id: string;
  gameSlug: string;
  createdAt: string;
};
export const emptySettingsDraft = (): SettingsDraft => ({
  name: '',
  resolution: '',
  preset: '',
  fpsLimit: '',
  controller: '',
  memo: '',
  checkedOn: '',
  comfortable: false,
});
export function localDay(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function isCalendarDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const string = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length <= max;
export class SettingsSnapshotError extends Error {
  constructor(
    readonly code: 'invalid' | 'empty' | 'limit' | 'date' | 'missing',
  ) {
    super(code);
  }
}
function validSnapshot(v: unknown): v is SettingsSnapshot {
  return (
    object(v) &&
    string(v.id, 80) &&
    /^[a-z0-9-]+$/.test(v.id) &&
    string(v.gameSlug, 100) &&
    /^[a-z0-9-]+$/.test(v.gameSlug) &&
    string(v.name, 80) &&
    settingsFields.every((field) =>
      string(v[field], field === 'memo' ? 4000 : 200),
    ) &&
    settingsFields.some((field) => (v[field] as string).trim()) &&
    typeof v.comfortable === 'boolean' &&
    string(v.checkedOn, 10) &&
    (v.checkedOn === '' || isCalendarDate(v.checkedOn)) &&
    string(v.createdAt, 40) &&
    Number.isFinite(Date.parse(v.createdAt)) &&
    (v.sourceNoteId === undefined ||
      (string(v.sourceNoteId, 240) && !!v.sourceNoteId))
  );
}
function copySnapshot(v: SettingsSnapshot): SettingsSnapshot {
  return {
    id: v.id,
    gameSlug: v.gameSlug,
    createdAt: v.createdAt,
    name: v.name,
    resolution: v.resolution,
    preset: v.preset,
    fpsLimit: v.fpsLimit,
    controller: v.controller,
    memo: v.memo,
    checkedOn: v.checkedOn,
    comfortable: v.comfortable,
    ...(v.sourceNoteId ? { sourceNoteId: v.sourceNoteId } : {}),
  };
}
export function parseSettingsSnapshots(raw: string | null): SettingsSnapshot[] {
  if (raw === null) return [];
  if (raw.length > 1_000_000) throw new SettingsSnapshotError('invalid');
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new SettingsSnapshotError('invalid');
  }
  if (
    !object(data) ||
    data.version !== 1 ||
    !Array.isArray(data.items) ||
    data.items.length > SNAPSHOT_LIMIT ||
    !data.items.every(validSnapshot) ||
    new Set(data.items.map((v) => v.id)).size !== data.items.length
  )
    throw new SettingsSnapshotError('invalid');
  return data.items.map(copySnapshot);
}
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export function saveSettingsSnapshot(
  storage: Store,
  gameSlug: string,
  draft: SettingsDraft,
  id: string,
  now = new Date(),
) {
  const previous = parseSettingsSnapshots(
    storage.getItem(SETTINGS_SNAPSHOTS_KEY),
  );
  if (!settingsFields.some((field) => draft[field].trim()))
    throw new SettingsSnapshotError('empty');
  if (
    draft.checkedOn &&
    (!isCalendarDate(draft.checkedOn) || draft.checkedOn > localDay(now))
  )
    throw new SettingsSnapshotError('date');
  const item = { ...draft, id, gameSlug, createdAt: now.toISOString() };
  if (!validSnapshot(item)) throw new SettingsSnapshotError('invalid');
  // IDs never overwrite a record: experiment logs can reference immutable snapshots.
  if (previous.some((old) => old.id === id))
    throw new SettingsSnapshotError('invalid');
  if (
    previous.length >= SNAPSHOT_LIMIT ||
    previous.filter((old) => old.gameSlug === gameSlug).length >=
      GAME_SNAPSHOT_LIMIT
  )
    throw new SettingsSnapshotError('limit');
  const saved = copySnapshot(item);
  storage.setItem(
    SETTINGS_SNAPSHOTS_KEY,
    JSON.stringify({ version: 1, items: [saved, ...previous] }),
  );
  return saved;
}
export function deleteSettingsSnapshot(
  storage: Store,
  id: string,
  gameSlug: string,
) {
  const previous = parseSettingsSnapshots(
    storage.getItem(SETTINGS_SNAPSHOTS_KEY),
  );
  if (!previous.some((item) => item.id === id && item.gameSlug === gameSlug))
    throw new SettingsSnapshotError('missing');
  storage.setItem(
    SETTINGS_SNAPSHOTS_KEY,
    JSON.stringify({
      version: 1,
      items: previous.filter(
        (item) => item.id !== id || item.gameSlug !== gameSlug,
      ),
    }),
  );
}
export function settingsDifferences(
  left: SettingsSnapshot,
  right: SettingsSnapshot,
) {
  if (left.gameSlug !== right.gameSlug)
    throw new SettingsSnapshotError('invalid');
  return settingsFields.map((field) => ({
    field,
    left: left[field],
    right: right[field],
    changed: left[field] !== right[field],
  }));
}
// Explicit copy only. Legacy free text cannot reliably be split into structured fields.
export function copySettingsNote(
  draft: SettingsDraft,
  note: SavedSolution,
  gameSlug: string,
): SettingsDraft {
  if (note.gameSlug !== gameSlug || !note.settings.trim())
    throw new SettingsSnapshotError('missing');
  const memo = [draft.memo, note.settings].filter(Boolean).join('\n\n');
  if (memo.length > 4000) throw new SettingsSnapshotError('invalid');
  return { ...draft, memo, sourceNoteId: note.id };
}

// Share the same validation/copy contract with immutable experiment references.
export {
  validSnapshot as validSettingsSnapshot,
  copySnapshot as copySettingsSnapshot,
};
