export const gameRequestLocales = ['ja', 'en', 'zh', 'es'] as const;
export type GameRequestLocale = (typeof gameRequestLocales)[number];
export function parseGameRequest(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const fields = value as Record<string, unknown>;
  if (
    Object.keys(fields).some(
      (key) => !['gameName', 'locale', 'website'].includes(key),
    ) ||
    typeof fields.gameName !== 'string' ||
    typeof fields.locale !== 'string' ||
    fields.website !== '' ||
    !gameRequestLocales.includes(fields.locale as GameRequestLocale)
  )
    return null;
  if (/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(fields.gameName)) return null;
  const gameName = fields.gameName.normalize('NFKC').trim().replace(/ +/g, ' ');
  // A title, never a message, URL, contact address, prompt, or executable content.
  // This reduces accidental private data; it is not proof that input is non-sensitive.
  if (
    gameName.length < 2 ||
    gameName.length > 80 ||
    !/^[\p{L}\p{N} .:'’!&()+,_・ー-]+$/u.test(gameName) ||
    /(?:https?|www)\b|\d{8,}|[\p{L}\p{N}-]+\.[a-z]{2,}(?:\b|$)/iu.test(gameName)
  )
    return null;
  return {
    gameName,
    normalizedName: gameName.toLocaleLowerCase('en-US'),
    locale: fields.locale as GameRequestLocale,
  };
}
export async function readBoundedJson(
  request: Request,
  maximum = 2048,
): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > maximum)
    throw new Error('too_large');
  const reader = request.body?.getReader();
  if (!reader) return null;
  let size = 0,
    text = '';
  const decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel();
        throw new Error('too_large');
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } catch (error) {
    if (error instanceof Error && error.message === 'too_large') throw error;
    return null;
  } finally {
    reader.releaseLock();
  }
}
export function sameOriginRequest(request: Request) {
  const site = request.headers.get('sec-fetch-site');
  return (
    request.headers.get('origin') === new URL(request.url).origin &&
    (!site || site === 'same-origin')
  );
}
