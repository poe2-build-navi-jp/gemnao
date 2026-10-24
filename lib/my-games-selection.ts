import { MY_GAMES_KEY } from '@/lib/my-pc';

export type MyGamesNotice = {
  kind: 'success' | 'error' | 'warning' | 'info';
  message:
    | 'success'
    | 'removed'
    | 'already'
    | 'absent'
    | 'error'
    | 'corrupt'
    | 'limit';
  added: boolean;
};

// Read at action time. Repeated additions/removals must never toggle intent.
export function changeMyGames(
  storage: () => Pick<Storage, 'getItem'>,
  save: (next: string[]) => boolean,
  slug: string,
  operation: 'add' | 'remove',
): MyGamesNotice {
  const result = (
    kind: MyGamesNotice['kind'],
    message: MyGamesNotice['message'],
    added = false,
  ): MyGamesNotice => ({ kind, message, added });
  let raw: string | null;
  try {
    raw = storage().getItem(MY_GAMES_KEY);
  } catch {
    return result('error', 'error');
  }
  let value: unknown;
  try {
    value = JSON.parse(raw || '[]');
  } catch {
    return result('error', 'corrupt');
  }
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string'))
    return result('error', 'corrupt');
  const current = [...new Set(value as string[])];
  const exists = current.includes(slug);
  if (operation === 'add' && exists) return result('info', 'already');
  if (operation === 'remove' && !exists) return result('info', 'absent');
  if (operation === 'add' && current.length >= 10)
    return result('warning', 'limit');
  try {
    if (
      !save(
        operation === 'remove'
          ? current.filter((item) => item !== slug)
          : [...current, slug],
      )
    )
      return result('error', 'error');
  } catch {
    return result('error', 'error');
  }
  return result(
    'success',
    operation === 'remove' ? 'removed' : 'success',
    operation === 'add',
  );
}

// Strict reader for transfer and the home continuation. Existing storage remains unchanged.
export function parseRegisteredGames(raw: string | null): string[] {
  if (raw === null) return [];
  if (raw.length > 2000) throw Error('invalid');
  const v: unknown = JSON.parse(raw);
  if (
    !Array.isArray(v) ||
    v.length > 10 ||
    !v.every((s) => typeof s === 'string' && /^[a-z0-9-]{1,100}$/.test(s)) ||
    new Set(v).size !== v.length
  )
    throw Error('invalid');
  return [...v];
}
