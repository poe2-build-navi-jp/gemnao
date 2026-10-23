import { env } from 'cloudflare:workers';
import {
  handlePrivateDiagnostic,
  type PrivateDiagnosticEnv,
} from '@/lib/private-diagnostic/service';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) =>
  handlePrivateDiagnostic(request, env as PrivateDiagnosticEnv);
export const POST = GET;
export const DELETE = GET;
