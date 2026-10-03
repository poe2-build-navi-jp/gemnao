// Explicit bookmarks only: article titles and paths stay in this browser.
// This module never sends saved articles to an API or analytics service.
export const READING_LIST_KEY = 'gemnao-reading-list-v1';
export const MAX_READING_ITEMS = 50;
export type ReadingItem = { path: string; title: string; savedAt: string };
export type ReadingItemDraft = Pick<ReadingItem, 'path' | 'title'>;
export type ReadingListLocale = 'ja' | 'en' | 'zh' | 'es';
type ReadingStorage = Pick<Storage, 'getItem' | 'setItem'>;

const MAX_TITLE_LENGTH = 200;
const MAX_PATH_LENGTH = 300;
const MAX_STORAGE_BYTES = 100_000;
const ARTICLE_PATH =
  /^\/(?:(?:(?:en|zh|es)\/)?(?:games\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*|(?:guide|pc|discord|gear)\/[a-z0-9]+(?:-[a-z0-9]+)*)|(?:en\/)?tools\/windows-diagnosis)$/;
const INVALID_MESSAGE =
  'あとで読むの保存データを読み取れません。既存データは上書きしていません。';
const UNAVAILABLE_MESSAGE =
  'このブラウザの保存領域を利用できません。ブラウザの設定・空き容量を確認してください。既存データは上書きしていません。';

class ReadingListError extends Error {}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function safeReadingPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= MAX_PATH_LENGTH &&
    ARTICLE_PATH.test(value)
  );
}

function validTitle(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= MAX_TITLE_LENGTH &&
    value.trim().length > 0 &&
    // Reject embedded control characters in displayed article titles.
    // oxlint-disable-next-line no-control-regex
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

function validTimestamp(value: unknown): value is string {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
  )
    return false;
  const timestamp = Date.parse(value);
  return (
    Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value
  );
}

function validItem(value: unknown): value is ReadingItem {
  return (
    isObject(value) &&
    safeReadingPath(value.path) &&
    validTitle(value.title) &&
    validTimestamp(value.savedAt)
  );
}

export function parseReadingList(raw: string | null): ReadingItem[] {
  if (raw === null) return [];
  if (
    raw.length > MAX_STORAGE_BYTES ||
    new TextEncoder().encode(raw).byteLength > MAX_STORAGE_BYTES
  )
    throw new ReadingListError(INVALID_MESSAGE);
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new ReadingListError(INVALID_MESSAGE);
  }
  if (
    !isObject(value) ||
    value.version !== 1 ||
    !Array.isArray(value.items) ||
    value.items.length > MAX_READING_ITEMS ||
    !value.items.every(validItem) ||
    new Set(value.items.map((item) => item.path)).size !== value.items.length
  )
    throw new ReadingListError(INVALID_MESSAGE);
  // Discard unknown properties rather than trusting imported object fields.
  return value.items.map(({ path, title, savedAt }) => ({
    path,
    title,
    savedAt,
  }));
}

export function readReadingList(storage: ReadingStorage): ReadingItem[] {
  return parseReadingList(storage.getItem(READING_LIST_KEY));
}

function writeReadingList(storage: ReadingStorage, items: ReadingItem[]) {
  const raw = JSON.stringify({ version: 1, items });
  parseReadingList(raw);
  storage.setItem(READING_LIST_KEY, raw);
}

// Read at click time: a stale component must not replace newer saved articles.
// Returning true means a new article was actually persisted, not merely clicked.
export function saveReadingItem(
  storage: ReadingStorage,
  draft: ReadingItemDraft,
): boolean {
  const previous = readReadingList(storage);
  if (
    !isObject(draft) ||
    !safeReadingPath(draft.path) ||
    !validTitle(draft.title)
  )
    throw new ReadingListError('この記事の保存情報が正しくありません。');
  if (previous.some((item) => item.path === draft.path)) return false;
  if (previous.length >= MAX_READING_ITEMS)
    throw new ReadingListError(
      'あとで読むは50件までです。不要な記事を外してから保存してください。',
    );
  const item: ReadingItem = {
    path: draft.path,
    title: draft.title.trim(),
    savedAt: new Date().toISOString(),
  };
  writeReadingList(storage, [item, ...previous]);
  return true;
}

export function removeReadingItem(
  storage: ReadingStorage,
  path: string,
): boolean {
  const previous = readReadingList(storage);
  if (!safeReadingPath(path))
    throw new ReadingListError('この記事の保存情報が正しくありません。');
  const next = previous.filter((item) => item.path !== path);
  if (next.length === previous.length) return false;
  writeReadingList(storage, next);
  return true;
}

export function readingListError(
  error: unknown,
  locale: ReadingListLocale = 'ja',
): string {
  if (locale === 'en')
    return 'Your reading list could not be updated or loaded. Check your browser storage settings and available space. You can save up to 50 articles. Existing data has not been overwritten.';
  if (locale === 'zh')
    return '无法更新或读取稍后阅读列表。请检查浏览器存储设置和可用空间。最多可保存50篇文章。现有数据未被覆盖。';
  if (locale === 'es')
    return 'No se pudo actualizar o leer la lista. Revisa el almacenamiento del navegador y el espacio disponible. Puedes guardar hasta 50 artículos. No se han sobrescrito los datos existentes.';
  if (error instanceof ReadingListError) return error.message;
  // Do not expose raw browser errors or any values from the stored data.
  return UNAVAILABLE_MESSAGE;
}
