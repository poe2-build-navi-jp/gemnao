import { env } from 'cloudflare:workers';
import {handleNotificationMetadata, type NotificationEnv} from '@/lib/private-diagnostic/notifications';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) => handleNotificationMetadata(request, env as NotificationEnv);
export const POST = GET;
export const DELETE = GET;
export const OPTIONS = GET;
