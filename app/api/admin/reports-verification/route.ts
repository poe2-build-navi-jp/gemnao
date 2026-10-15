import { env } from 'cloudflare:workers';
import { isDiscordAdmin } from '@/lib/admin-auth';
import {
  verifyClosedReports,
  type VerificationEnv,
} from '@/lib/community-reports/verification';
export const dynamic = 'force-dynamic';
export const POST = (request: Request) =>
  verifyClosedReports(request, env as VerificationEnv, () =>
    isDiscordAdmin(request),
  );
