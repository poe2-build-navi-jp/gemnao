import { env } from 'cloudflare:workers';
import { configuredAdmin, configuredAdminToken } from './admin-cookie';

export const adminCookieName = 'gemnao_discord_admin';

function configuredSecrets() {
  const workerEnv = env as unknown as {
    DISCORD_ADMIN_TOKEN?: string;
    DISCORD_ADMIN_TOKEN_HASH?: string;
  };
  return {
    token:
      workerEnv.DISCORD_ADMIN_TOKEN || process.env.DISCORD_ADMIN_TOKEN || '',
    hash:
      workerEnv.DISCORD_ADMIN_TOKEN_HASH ||
      process.env.DISCORD_ADMIN_TOKEN_HASH ||
      '',
  };
}

export async function validateAdminToken(candidate: string) {
  return configuredAdminToken(candidate, configuredSecrets());
}

export async function isDiscordAdmin(request: Request) {
  return configuredAdmin(request, configuredSecrets());
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}
