import { env } from 'cloudflare:workers';
const productionOrigin = 'https://gemnao.pages.dev';
// Exactly 32 random bytes, encoded as 64 hex or 43 unpadded base64url characters.
// This validates encoding/length, not entropy; setup must use a secure generator.
const tokenPattern = /^(?:[a-fA-F0-9]{64}|[A-Za-z0-9_-]{43})$/;
async function digest(value: string) {
  return new Uint8Array(
    await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(`gemnao-game-request-consumer:${value}`),
    ),
  );
}
export async function isGameRequestConsumer(request: Request) {
  // Do not expose old deployment/preview credentials through a preview hostname.
  // Node/Undici also adds Sec-Fetch-Mode:cors to server requests; mode alone
  // is not a browser signal. Browser Origin/Sec-Fetch-Site are rejected.
  if (
    new URL(request.url).origin !== productionOrigin ||
    request.headers.has('origin') ||
    request.headers.has('sec-fetch-site')
  )
    return false;
  const authorization = request.headers.get('authorization');
  if (
    !authorization ||
    authorization.length > 80 ||
    !authorization.startsWith('Bearer ')
  )
    return false;
  const candidate = authorization.slice(7);
  if (!tokenPattern.test(candidate)) return false;
  // Read on every request. No process.env/admin-cookie/Discord-key fallback and no cached digest.
  const expected = (env as unknown as { GAME_REQUEST_CONSUMER_TOKEN?: unknown })
    .GAME_REQUEST_CONSUMER_TOKEN;
  if (typeof expected !== 'string' || !tokenPattern.test(expected))
    return false;
  const [left, right] = await Promise.all([
    digest(candidate),
    digest(expected),
  ]);
  let difference = 0;
  for (let i = 0; i < 32; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}
