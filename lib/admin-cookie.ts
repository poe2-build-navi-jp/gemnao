/** Shared verifier; callers supply the existing configuration, never a new key. */
export async function configuredAdmin(
  request: Request,
  config: { token?: string; hash?: string },
) {
  const part = (request.headers.get('cookie') || '')
    .split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith('gemnao_discord_admin='));
  if (!part) return false;
  let token;
  try {
    token = decodeURIComponent(part.slice('gemnao_discord_admin='.length));
  } catch {
    return false;
  }
  return configuredAdminToken(token, config);
}
async function digest(token: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode('gemnao-discord-admin:' + token),
      ),
    ),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
}
export async function configuredAdminToken(
  token: string,
  config: { token?: string; hash?: string },
) {
  if (!token) return false;
  const expected =
    config.hash?.toLowerCase() ||
    (config.token ? await digest(config.token) : '');
  const actual = await digest(token);
  if (!expected || actual.length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < actual.length; i++)
    difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}
