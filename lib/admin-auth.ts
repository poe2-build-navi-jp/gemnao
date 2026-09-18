import { env } from 'cloudflare:workers';

export const adminCookieName = 'gemnao_discord_admin';

function configuredToken() {
  return (
    (env as unknown as { DISCORD_ADMIN_TOKEN?: string }).DISCORD_ADMIN_TOKEN ||
    process.env.DISCORD_ADMIN_TOKEN ||
    ''
  );
}

async function digest(value: string) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`gemnao-discord-admin:${value}`),
  );
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function validateAdminToken(candidate: string) {
  const token = configuredToken();
  if (!token || !candidate) return false;
  return safeEqual(await digest(candidate), await digest(token));
}

export async function adminSessionValue() {
  const token = configuredToken();
  return token ? digest(token) : '';
}

export async function isDiscordAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const session = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminCookieName}=`))
    ?.slice(adminCookieName.length + 1);
  const expected = await adminSessionValue();
  return Boolean(session && expected && safeEqual(session, expected));
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}
