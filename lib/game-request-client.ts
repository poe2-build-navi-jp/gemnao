import type { MyGamesLocale } from './my-games-copy';
import { parseGameRequest } from './game-request-input';

export function normalizeRequestedGame(value: string): string | null {
  // Share the server title rules; this module contains no secrets or database code.
  return (
    parseGameRequest({ gameName: value, locale: 'ja', website: '' })
      ?.gameName ?? null
  );
}
export type GameRequestOutcome =
  | 'received'
  | 'duplicate'
  | 'invalid'
  | 'unavailable'
  | 'rateLimited'
  | 'failed';
export async function sendGameRequest(
  gameName: string,
  locale: MyGamesLocale,
  signal: AbortSignal,
): Promise<GameRequestOutcome> {
  try {
    const response = await fetch('/api/game-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameName, locale, website: '' }),
      signal,
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (response.status === 429) return 'rateLimited';
    if (response.status === 503) return 'unavailable';
    if (response.status === 400 || response.status === 413) return 'invalid';
    if (response.status !== 200 && response.status !== 201) return 'failed';
    const data: unknown = await response.json();
    if (
      !data ||
      typeof data !== 'object' ||
      !('ok' in data) ||
      data.ok !== true ||
      !('status' in data) ||
      data.status !== 'received' ||
      !('duplicate' in data) ||
      typeof data.duplicate !== 'boolean'
    )
      return 'failed';
    return data.duplicate ? 'duplicate' : 'received';
  } catch {
    return 'failed';
  }
}
