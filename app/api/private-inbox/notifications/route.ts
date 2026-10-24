import { env } from 'cloudflare:workers';
import {
  handleInboxNotifications,
  type InboxNotifyEnv,
} from '@/lib/private-inbox-notifications';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) =>
  handleInboxNotifications(request, env as InboxNotifyEnv);
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const OPTIONS = GET;
export const HEAD = GET;
