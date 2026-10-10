import { isDiscordAdmin } from '@/lib/admin-auth';
import { sameOriginRequest } from '@/lib/game-request-input';
import {
  gameRequestReviewMode,
  automaticGameRequestConsumerAllowed,
} from '@/lib/game-request-db';
import { patchManualReviewResponse } from '@/lib/game-request-manual-api';
import {
  getQueueResponse,
  patchQueueResponse,
  queueReply,
} from '@/lib/game-request-queue-api';
export async function GET(request: Request) {
  if (!(await isDiscordAdmin(request)))
    return queueReply({ error: 'unauthorized' }, 401);
  const response = await getQueueResponse(request);
  if (!response.ok) return response;
  const data = (await response.json()) as {
    requests: unknown[];
    next: string | null;
  };
  return queueReply({ ...data, reviewMode: gameRequestReviewMode() });
}
export async function PATCH(request: Request) {
  if (!sameOriginRequest(request))
    return queueReply({ error: 'forbidden' }, 403);
  if (!(await isDiscordAdmin(request)))
    return queueReply({ error: 'unauthorized' }, 401);
  const mode = gameRequestReviewMode();
  if (mode === 'manual') return patchManualReviewResponse(request);
  if (!automaticGameRequestConsumerAllowed())
    return queueReply({ error: 'unavailable' }, 503);
  return patchQueueResponse(request);
}
