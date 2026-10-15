import { env } from 'cloudflare:workers';
import { isDiscordAdmin } from '@/lib/admin-auth';
import { bootstrapReports } from '@/lib/community-reports/bootstrap';
export const dynamic = 'force-dynamic';
export const POST = (request: Request) =>
  bootstrapReports(request, env, () => isDiscordAdmin(request));
