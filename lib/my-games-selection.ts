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
