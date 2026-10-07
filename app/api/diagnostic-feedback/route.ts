import { env } from 'cloudflare:workers';
import {
  handleFeedback,
  type FeedbackEnv,
} from '@/lib/diagnostic-feedback/service';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) =>
  handleFeedback(request, env as FeedbackEnv);
export const POST = GET;
export const DELETE = GET;
