import { env } from 'cloudflare:workers';

export const adminCookieName = 'gemnao_discord_admin';

function configuredSecrets() {
  const workerEnv = env as unknown as {
    DISCORD_ADMIN_TOKEN?: string;
    DISCORD_ADMIN_TOKEN_HASH?: string;
  };
  return {
    token: workerEnv.DISCORD_ADMIN_TOKEN || process.env.DISCORD_ADMIN_TOKEN || '',
    hash:
      workerEnv.DISCORD_ADMIN_TOKEN_HASH ||
      process.env.DISCORD_ADMIN_TOKEN_HASH ||
      '',
  };
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

async function configuredTokenHash() {
  const configured = configuredSecrets();
  if (configured.hash) return configured.hash.toLowerCase();
  return configured.token ? digest(configured.token) : '';
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
  if (!candidate) return false;
  const candidateHash = await digest(candidate);
  const expectedHash = await configuredTokenHash();
  return Boolean(expectedHash && safeEqual(candidateHash, expectedHash));
}

export async function isDiscordAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const session = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminCookieName}=`))
    ?.slice(adminCookieName.length + 1);
  if (!session) return false;

  // Cookie serializers percent-encode symbols in the management key. Decode
  // the value before checking it so keys containing %, +, spaces, or Japanese
  // characters do not authenticate successfully and then immediately fail.
  let token = session;
  try {
    token = decodeURIComponent(session);
  } catch {
    return false;
  }
  return validateAdminToken(token);
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}
