import { env } from 'cloudflare:workers';
import { reportsHealth } from '@/lib/community-reports/health';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) => reportsHealth(request, env);
export const POST = GET;
export const DELETE = GET;
export const PATCH = GET;
