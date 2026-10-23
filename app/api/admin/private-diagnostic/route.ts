import { env } from 'cloudflare:workers';
import { isDiscordAdmin } from '@/lib/admin-auth';
import { handlePrivateAdmin } from '@/lib/private-diagnostic/admin';
import type { PrivateDiagnosticEnv } from '@/lib/private-diagnostic/service';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) =>
  handlePrivateAdmin(request, env as PrivateDiagnosticEnv, () =>
    isDiscordAdmin(request),
  );
