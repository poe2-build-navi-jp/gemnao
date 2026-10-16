import { env } from 'cloudflare:workers';
import { isDiscordAdmin } from '@/lib/admin-auth';
import {
  handleReports,
  type ReportsEnv,
} from '@/lib/community-reports/service';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) =>
  handleReports(request, env as ReportsEnv, undefined, () =>
    isDiscordAdmin(request),
  );
export const PATCH = GET;
