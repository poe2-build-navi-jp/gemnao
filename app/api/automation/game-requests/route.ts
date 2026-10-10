import { isGameRequestConsumer } from '@/lib/game-request-consumer-auth';
import {
  admitGameRequestConsumerCall,
  automaticGameRequestConsumerAllowed,
} from '@/lib/game-request-db';
import {
  getQueueResponse,
  patchQueueResponse,
  queueReply,
} from '@/lib/game-request-queue-api';
async function authorize(request: Request) {
  if (!(await isGameRequestConsumer(request)))
    return queueReply({ error: 'unauthorized' }, 401);
  if (!automaticGameRequestConsumerAllowed())
    return queueReply({ error: 'unavailable' }, 503);
  try {
    if (!(await admitGameRequestConsumerCall()))
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
  } catch {
    return queueReply({ error: 'unavailable' }, 503);
  }
  return null;
}
export async function GET(request: Request) {
  return (await authorize(request)) || getQueueResponse(request);
}
export async function PATCH(request: Request) {
  return (await authorize(request)) || patchQueueResponse(request);
}
// No preflight/CORS, intake, deletes, uploads, arbitrary SQL, or other administrative actions.
function methodNotAllowed() {
  return Response.json(
    { error: 'method_not_allowed' },
    {
      status: 405,
      headers: {
        Allow: 'GET, PATCH',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    },
  );
}
export const OPTIONS = methodNotAllowed;
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;
