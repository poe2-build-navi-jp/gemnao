import {
  SETTINGS_SNAPSHOTS_KEY,
  parseSettingsSnapshots,
  validSettingsSnapshot,
  copySettingsSnapshot,
  localDay,
  isCalendarDate,
  type SettingsSnapshot,
} from './game-settings-snapshots';
export const GAME_EXPERIMENTS_KEY = 'gemnao-game-experiments-v1';
export const GAME_EXPERIMENTS_EVENT = 'gemnao-game-experiments';
export type ExperimentDecision = 'pending' | 'adopt' | 'revert';
export type ExperimentDraft = {
  changed: string;
  purpose: string;
  beforeId: string;
  afterId: string;
  fpsBefore: string;
  fpsAfter: string;
  result: string;
  performedOn: string;
  decision: ExperimentDecision;
};
export type GameExperiment = Omit<ExperimentDraft, 'beforeId' | 'afterId'> & {
  id: string;
  gameSlug: string;
  createdAt: string;
  // Copies include the immutable source ID. Always display the captured values,
  // even if the original is later deleted, replaced or unreadable.
  before: SettingsSnapshot | null;
  after: SettingsSnapshot | null;
};
export const emptyExperiment = (): ExperimentDraft => ({
  changed: '',
  purpose: '',
  beforeId: '',
  afterId: '',
  fpsBefore: '',
  fpsAfter: '',
  result: '',
  performedOn: '',
  decision: 'pending',
});
export class ExperimentError extends Error {
  constructor(
    readonly code:
      | 'invalid'
      | 'empty'
      | 'date'
      | 'fps'
      | 'limit'
      | 'reference'
      | 'missing',
  ) {
    super(code);
  }
}
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length <= max;
export const validMeasuredFps = (value: unknown): value is string =>
  typeof value === 'string' &&
  (value === '' || /^(?:0|[1-9]\d{0,4})(?:\.\d{1,2})?$/.test(value));
function validExperiment(v: unknown): v is GameExperiment {
  return (
    object(v) &&
    str(v.id, 80) &&
    /^[a-z0-9-]+$/.test(v.id) &&
    str(v.gameSlug, 100) &&
    /^[a-z0-9-]+$/.test(v.gameSlug) &&
    str(v.createdAt, 40) &&
    Number.isFinite(Date.parse(v.createdAt)) &&
    str(v.changed, 200) &&
    str(v.purpose, 200) &&
    str(v.result, 2000) &&
    !!(v.changed.trim() || v.result.trim()) &&
    validMeasuredFps(v.fpsBefore) &&
    validMeasuredFps(v.fpsAfter) &&
    str(v.performedOn, 10) &&
    (v.performedOn === '' || isCalendarDate(v.performedOn)) &&
    typeof v.decision === 'string' &&
    ['pending', 'adopt', 'revert'].includes(v.decision) &&
    [v.before, v.after].every(
      (ref) =>
        ref === null ||
        (validSettingsSnapshot(ref) && ref.gameSlug === v.gameSlug),
    )
  );
}
function copyExperiment(v: GameExperiment): GameExperiment {
  return {
    id: v.id,
    gameSlug: v.gameSlug,
    createdAt: v.createdAt,
    changed: v.changed,
    purpose: v.purpose,
    result: v.result,
    performedOn: v.performedOn,
    fpsBefore: v.fpsBefore,
    fpsAfter: v.fpsAfter,
    decision: v.decision,
    before: v.before ? copySettingsSnapshot(v.before) : null,
    after: v.after ? copySettingsSnapshot(v.after) : null,
  };
}
export function parseGameExperiments(raw: string | null): GameExperiment[] {
  if (raw === null) return [];
  if (raw.length > 2_000_000) throw new ExperimentError('invalid');
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new ExperimentError('invalid');
  }
  if (
    !object(data) ||
    data.version !== 1 ||
    !Array.isArray(data.items) ||
    data.items.length > 100 ||
    !data.items.every(validExperiment) ||
    new Set(data.items.map((v) => v.id)).size !== data.items.length
  )
    throw new ExperimentError('invalid');
  return data.items.map(copyExperiment);
}
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export function saveGameExperiment(
  storage: Store,
  gameSlug: string,
  draft: ExperimentDraft,
  id: string,
  now = new Date(),
) {
  const previous = parseGameExperiments(storage.getItem(GAME_EXPERIMENTS_KEY));
  if (!draft.changed.trim() && !draft.result.trim())
    throw new ExperimentError('empty');
  if (!validMeasuredFps(draft.fpsBefore) || !validMeasuredFps(draft.fpsAfter))
    throw new ExperimentError('fps');
  if (
    draft.performedOn &&
    (!isCalendarDate(draft.performedOn) || draft.performedOn > localDay(now))
  )
    throw new ExperimentError('date');
  let snapshots: SettingsSnapshot[] = [];
  if (draft.beforeId || draft.afterId) {
    try {
      snapshots = parseSettingsSnapshots(
        storage.getItem(SETTINGS_SNAPSHOTS_KEY),
      );
    } catch {
      throw new ExperimentError('reference');
    }
  }
  const capture = (sourceId: string) => {
    if (!sourceId) return null;
    const source = snapshots.find(
      (s) => s.id === sourceId && s.gameSlug === gameSlug,
    );
    if (!source) throw new ExperimentError('reference');
    return copySettingsSnapshot(source);
  };
  const item = {
    id,
    gameSlug,
    createdAt: now.toISOString(),
    changed: draft.changed,
    purpose: draft.purpose,
    result: draft.result,
    performedOn: draft.performedOn,
    fpsBefore: draft.fpsBefore,
    fpsAfter: draft.fpsAfter,
    decision: draft.decision,
    before: capture(draft.beforeId),
    after: capture(draft.afterId),
  };
  if (!validExperiment(item) || previous.some((old) => old.id === id))
    throw new ExperimentError('invalid');
  if (
    previous.length >= 100 ||
    previous.filter((old) => old.gameSlug === gameSlug).length >= 20
  )
    throw new ExperimentError('limit');
  const saved = copyExperiment(item);
  storage.setItem(
    GAME_EXPERIMENTS_KEY,
    JSON.stringify({ version: 1, items: [saved, ...previous] }),
  );
  return saved;
}
export function deleteGameExperiment(
  storage: Store,
  id: string,
  gameSlug: string,
) {
  const previous = parseGameExperiments(storage.getItem(GAME_EXPERIMENTS_KEY));
  if (!previous.some((item) => item.id === id && item.gameSlug === gameSlug))
    throw new ExperimentError('missing');
  storage.setItem(
    GAME_EXPERIMENTS_KEY,
    JSON.stringify({
      version: 1,
      items: previous.filter(
        (item) => item.id !== id || item.gameSlug !== gameSlug,
      ),
    }),
  );
}
