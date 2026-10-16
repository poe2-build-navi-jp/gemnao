import { env } from 'cloudflare:workers';
import {
  handleReports,
  type ReportsEnv,
} from '@/lib/community-reports/service';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) =>
  handleReports(request, env as ReportsEnv);
export const POST = GET;
export const PATCH = GET;
export const DELETE = GET;
