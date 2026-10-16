import { env } from 'cloudflare:workers';
import { isDiscordAdmin } from '@/lib/admin-auth';
import { observeReports } from '@/lib/community-reports/control';
export const dynamic = 'force-dynamic';
export const POST = (request: Request) =>
  observeReports(request, env, () => isDiscordAdmin(request));
