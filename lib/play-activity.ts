// Kept separate from continuation conditions and all existing storage formats.
export const PLAY_ACTIVITY_KEY = 'gemnao-play-activity-v1';
export const PLAY_ACTIVITY_EVENT = 'gemnao-play-activity';
export type PlayTask = {
  id: string;
  text: string;
  done: boolean;
  deleted: boolean;
};
export type TroubleDraft = { tried: string; nextFix: string; noteId: string };
export type PlayActivity = TroubleDraft & {
  gameSlug: string;
  tasks: PlayTask[];
  revision: number;
  updatedAt: string;
};
export class ActivityError extends Error {
  constructor(readonly code: 'invalid' | 'limit' | 'conflict' | 'missing') {
    super(code);
  }
}
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, n: number): v is string =>
  typeof v === 'string' && v.length <= n;
function valid(v: unknown): v is PlayActivity {
  return (
    obj(v) &&
    str(v.gameSlug, 100) &&
    /^[a-z0-9-]+$/.test(v.gameSlug) &&
    str(v.tried, 1000) &&
    str(v.nextFix, 300) &&
    str(v.noteId, 240) &&
    str(v.updatedAt, 40) &&
    Number.isFinite(Date.parse(v.updatedAt)) &&
    Number.isSafeInteger(v.revision) &&
    Number(v.revision) > 0 &&
    Array.isArray(v.tasks) &&
    v.tasks.length <= 28 &&
    v.tasks.every(
      (t) =>
        obj(t) &&
        str(t.id, 80) &&
        /^[a-z0-9-]+$/.test(t.id) &&
        str(t.text, 160) &&
        !!t.text.trim() &&
        typeof t.done === 'boolean' &&
        typeof t.deleted === 'boolean',
    ) &&
    new Set(v.tasks.map((t) => t.id)).size === v.tasks.length &&
    v.tasks.filter((t) => !t.deleted).length <= 8 &&
    v.tasks.filter((t) => t.deleted).length <= 20
  );
}
function copy(v: PlayActivity): PlayActivity {
  return {
    gameSlug: v.gameSlug,
    tried: v.tried,
    nextFix: v.nextFix,
    noteId: v.noteId,
    revision: v.revision,
    updatedAt: v.updatedAt,
    tasks: v.tasks.map((t) => ({
      id: t.id,
      text: t.text,
      done: t.done,
      deleted: t.deleted,
    })),
  };
}
export function parsePlayActivity(raw: string | null): PlayActivity[] {
  if (raw === null) return [];
  if (raw.length > 1_000_000) throw new ActivityError('invalid');
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    throw new ActivityError('invalid');
  }
  if (
    !obj(v) ||
    v.version !== 1 ||
    !Array.isArray(v.items) ||
    v.items.length > 100 ||
    !v.items.every(valid) ||
    new Set(v.items.map((x) => x.gameSlug)).size !== v.items.length
  )
    throw new ActivityError('invalid');
  return v.items.map(copy);
}
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export type TaskAction =
  | { kind: 'add'; id: string; text: string }
  | { kind: 'toggle' | 'delete' | 'restore' | 'purge'; id: string };
function update(
  storage: Store,
  slug: string,
  revision: number,
  mutate: (v: PlayActivity) => void,
) {
  const items = parsePlayActivity(storage.getItem(PLAY_ACTIVITY_KEY));
  const old = items.find((v) => v.gameSlug === slug);
  if ((old?.revision || 0) !== revision) throw new ActivityError('conflict');
  if (!old && items.length >= 100) throw new ActivityError('limit');
  const value: PlayActivity = old
    ? copy(old)
    : {
        gameSlug: slug,
        tried: '',
        nextFix: '',
        noteId: '',
        tasks: [],
        revision: 0,
        updatedAt: '',
      };
  mutate(value);
  value.revision++;
  value.updatedAt = new Date().toISOString();
  if (!valid(value)) throw new ActivityError('invalid');
  storage.setItem(
    PLAY_ACTIVITY_KEY,
    JSON.stringify({
      version: 1,
      items: [value, ...items.filter((v) => v.gameSlug !== slug)],
    }),
  );
  return value;
}
export function saveTrouble(
  storage: Store,
  slug: string,
  draft: TroubleDraft,
  revision: number,
) {
  return update(storage, slug, revision, (v) => {
    v.tried = draft.tried;
    v.nextFix = draft.nextFix;
    v.noteId = draft.noteId;
  });
}
export function changePlayTask(
  storage: Store,
  slug: string,
  action: TaskAction,
  revision: number,
) {
  return update(storage, slug, revision, (v) => {
    if (action.kind === 'add') {
      if (v.tasks.filter((t) => !t.deleted).length >= 8)
        throw new ActivityError('limit');
      if (v.tasks.some((t) => t.id === action.id))
        throw new ActivityError('invalid');
      v.tasks.push({
        id: action.id,
        text: action.text.trim(),
        done: false,
        deleted: false,
      });
      return;
    }
    const t = v.tasks.find((t) => t.id === action.id);
    if (!t) throw new ActivityError('missing');
    if (action.kind === 'toggle') {
      if (t.deleted) throw new ActivityError('missing');
      t.done = !t.done;
    }
    if (action.kind === 'delete') {
      if (t.deleted) throw new ActivityError('missing');
      if (v.tasks.filter((t) => t.deleted).length >= 20)
        throw new ActivityError('limit');
      t.deleted = true;
    }
    if (action.kind === 'restore') {
      if (!t.deleted) throw new ActivityError('missing');
      if (v.tasks.filter((t) => !t.deleted).length >= 8)
        throw new ActivityError('limit');
      t.deleted = false;
    }
    if (action.kind === 'purge') {
      if (!t.deleted) throw new ActivityError('invalid');
      v.tasks = v.tasks.filter((t) => t.id !== action.id);
    }
  });
}
