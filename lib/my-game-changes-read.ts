// Independent from game choices, notes, diagnosis and their existing formats.
export const CHANGES_READ_KEY = 'gemnao-official-changes-read-v1';
export const CHANGES_READ_EVENT = 'gemnao-official-changes-read';
export type ReadChanges = { version: 1; read: string[] };
export function parseReadChanges(raw: string | null): ReadChanges {
  if (raw === null) return { version: 1, read: [] };
  const value: unknown = JSON.parse(raw);
  if (
    !value ||
    typeof value !== 'object' ||
    !('version' in value) ||
    value.version !== 1 ||
    !('read' in value) ||
    !Array.isArray(value.read) ||
    value.read.length > 1000 ||
    !value.read.every(
      (id) => typeof id === 'string' && /^[a-z0-9-]{1,160}$/.test(id),
    )
  ) {
    throw new Error('Invalid read state');
  }
  return { version: 1, read: [...new Set(value.read)] };
}
export function setChangeRead(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  id: string,
  read: boolean,
  storageKey = CHANGES_READ_KEY,
) {
  if (!/^[a-z0-9-]{1,160}$/.test(id)) throw new Error('Invalid change ID');
  // Read latest at the time of action. Never overwrite corrupt or future schemas.
  const current = parseReadChanges(storage.getItem(storageKey));
  const next = new Set(current.read);
  if (read) next.add(id);
  else next.delete(id);
  if (next.size > 1000) throw new Error('Read state full');
  storage.setItem(storageKey, JSON.stringify({ version: 1, read: [...next] }));
}
