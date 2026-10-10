// Only the authenticated, same-origin owner route may invoke manual mutations.
import { readBoundedJson } from './game-request-input';
import { queueReply } from './game-request-queue-api';
import {
  gameRequestReviewMode,
  admitGameRequestManualReviewCall,
  reviewGameRequest,
} from './game-request-db';
export async function patchManualReviewResponse(request: Request) {
  if (gameRequestReviewMode() !== 'manual')
    return queueReply({ error: 'unavailable' }, 503);
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
    'application/json'
  )
    return queueReply({ error: 'unsupported_media_type' }, 415);
  let value: unknown;
  try {
    value = await readBoundedJson(request);
  } catch {
    return queueReply({ error: 'too_large' }, 413);
  }
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return queueReply({ error: 'invalid' }, 400);
  const body = value as Record<string, unknown>;
  if (
    Object.keys(body).some(
      (key) => !['action', 'id', 'expectedUpdatedAt', 'decision'].includes(key),
    ) ||
    body.action !== 'review' ||
    typeof body.id !== 'string' ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
      body.id,
    ) ||
    typeof body.expectedUpdatedAt !== 'number' ||
    !Number.isSafeInteger(body.expectedUpdatedAt) ||
    body.expectedUpdatedAt < 0 ||
    body.expectedUpdatedAt >= Number.MAX_SAFE_INTEGER ||
    typeof body.decision !== 'string' ||
    !['adopt', 'hold'].includes(body.decision)
  )
    return queueReply({ error: 'invalid' }, 400);
  try {
    if (!(await admitGameRequestManualReviewCall()))
      return Response.json(
        { error: 'rate_limited' },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'X-Robots-Tag': 'noindex',
            'Retry-After': '60',
          },
        },
      );
    const result = await reviewGameRequest({
      id: body.id,
      expectedUpdatedAt: body.expectedUpdatedAt,
      decision: body.decision as 'adopt' | 'hold',
    });
    return result
      ? queueReply({ request: result })
      : queueReply({ error: 'conflict' }, 409);
  } catch {
    return queueReply({ error: 'unavailable' }, 503);
  }
}
