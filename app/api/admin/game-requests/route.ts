import { isDiscordAdmin } from '@/lib/admin-auth';
import { sameOriginRequest } from '@/lib/game-request-input';
import {
  getQueueResponse,
  patchQueueResponse,
  queueReply,
} from '@/lib/game-request-queue-api';
export async function GET(request: Request) {
  if (!(await isDiscordAdmin(request)))
    return queueReply({ error: 'unauthorized' }, 401);
  return getQueueResponse(request);
}
export async function PATCH(request: Request) {
  if (!sameOriginRequest(request))
    return queueReply({ error: 'forbidden' }, 403);
  if (!(await isDiscordAdmin(request)))
    return queueReply({ error: 'unauthorized' }, 401);
  return patchQueueResponse(request);
}
