// Private notes: localStorage only. No API/analytics receives these fields.
export const SOLUTIONS_KEY = 'gemnao-solutions-v1';
export const MY_DATA_EVENT = 'gemnao-my-data';
export const MAX_SOLUTIONS = 100;
export const MAX_BACKUP_BYTES = 2_000_000;
export const statusLabels = {
  investigating: '確認中',
  unresolved: '未解決',
  resolved: '解決済み',
} as const;
export type SolutionStatus = keyof typeof statusLabels;
export type SavedSolution = {
  id: string;
  title: string;
  gameSlug: string;
  status: SolutionStatus;
  diagnosis: string;
  settings: string;
  notes: string;
  articlePath: string;
  stepId: string;
  completedSteps: string[];
  createdAt: string;
  updatedAt: string;
};
export type SolutionDraft = Omit<
  SavedSolution,
  'id' | 'createdAt' | 'updatedAt'
>;
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const string = (value: unknown, limit: number) =>
  typeof value === 'string' && value.length <= limit;
export const safeArticlePath = (path: string) =>
  path === '' ||
  /^\/(?:games\/[a-z0-9-]+\/[a-z0-9-]+|guide\/[a-z0-9-]+|pc\/[a-z0-9-]+|discord\/[a-z0-9-]+)$/.test(
    path,
  );
function validSolution(value: unknown): value is SavedSolution {
  if (!isObject(value)) return false;
  return (
    string(value.id, 240) &&
    Boolean(value.id) &&
    string(value.title, 200) &&
    Boolean((value.title as string).trim()) &&
    string(value.gameSlug, 100) &&
    /^(?:[a-z0-9-]+)?$/.test(value.gameSlug as string) &&
    typeof value.status === 'string' &&
    Object.hasOwn(statusLabels, value.status) &&
    string(value.diagnosis, 4000) &&
    string(value.settings, 4000) &&
    string(value.notes, 4000) &&
    typeof value.articlePath === 'string' &&
    safeArticlePath(value.articlePath) &&
    string(value.stepId, 200) &&
    /^(?:[a-zA-Z0-9_-]+)?$/.test(value.stepId as string) &&
    Array.isArray(value.completedSteps) &&
    value.completedSteps.length <= 100 &&
    value.completedSteps.every((item) => string(item, 200)) &&
    typeof value.createdAt === 'string' &&
    value.createdAt.length <= 40 &&
    Number.isFinite(Date.parse(value.createdAt)) &&
    typeof value.updatedAt === 'string' &&
    value.updatedAt.length <= 40 &&
    Number.isFinite(Date.parse(value.updatedAt))
  );
}
// Copy known fields only; imported objects never become application config.
function clean(value: SavedSolution): SavedSolution {
  const {
    id,
    title,
    gameSlug,
    status,
    diagnosis,
    settings,
    notes,
    articlePath,
    stepId,
    completedSteps,
    createdAt,
    updatedAt,
  } = value;
  return {
    id,
    title,
    gameSlug,
    status,
    diagnosis,
    settings,
    notes,
    articlePath,
    stepId,
    completedSteps: [...completedSteps],
    createdAt,
    updatedAt,
  };
}
export function parseSolutions(raw: string | null): SavedSolution[] {
  if (!raw) return [];
  if (
    raw.length > MAX_BACKUP_BYTES ||
    new TextEncoder().encode(raw).byteLength > MAX_BACKUP_BYTES
  )
    throw new Error('保存データが大きすぎます。');
  const value: unknown = JSON.parse(raw);
  if (
    !isObject(value) ||
    value.version !== 1 ||
    !Array.isArray(value.items) ||
    value.items.length > MAX_SOLUTIONS ||
    !value.items.every(validSolution) ||
    new Set(value.items.map((item) => item.id)).size !== value.items.length
  )
    throw new Error('保存データの形式が正しくありません。');
  return value.items.map(clean);
}
export function serializeSolutions(items: SavedSolution[]) {
  const raw = JSON.stringify({ version: 1, items });
  parseSolutions(raw);
  return raw;
}
export function readSolutions(storage: Storage) {
  return parseSolutions(storage.getItem(SOLUTIONS_KEY));
}
export function upsertSolution(storage: Storage, item: SavedSolution) {
  const previous = readSolutions(storage); // Refuse to overwrite corrupt data.
  if (
    !previous.some((old) => old.id === item.id) &&
    previous.length >= MAX_SOLUTIONS
  )
    throw new Error(
      '保存は100件までです。不要なノートを削除してから保存してください。',
    );
  const next = [item, ...previous.filter((old) => old.id !== item.id)];
  storage.setItem(SOLUTIONS_KEY, serializeSolutions(next));
  return next;
}
export function deleteSolution(storage: Storage, id: string) {
  const next = readSolutions(storage).filter((item) => item.id !== id);
  storage.setItem(SOLUTIONS_KEY, serializeSolutions(next));
}
// Import is a non-destructive merge. Existing IDs (including edited notes) win.
export function importSolutions(storage: Storage, raw: string) {
  const incoming = parseSolutions(raw);
  const existing = readSolutions(storage);
  const ids = new Set(existing.map((item) => item.id));
  const added = incoming.filter((item) => !ids.has(item.id));
  if (existing.length + added.length > MAX_SOLUTIONS)
    throw new Error('取り込み後に100件を超えるため、変更していません。');
  storage.setItem(SOLUTIONS_KEY, serializeSolutions([...existing, ...added]));
  return added.length;
}
export function solutionError(error: unknown) {
  if (
    error instanceof Error &&
    !['QuotaExceededError', 'SecurityError', 'SyntaxError'].includes(error.name)
  )
    return error.message;
  return '保存領域を利用できないか、データを読み取れません。ブラウザの設定・空き容量を確認してください。既存データは上書きしていません。';
}
