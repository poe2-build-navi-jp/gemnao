// Authentication belongs to the route wrapper; never export these through an unguarded route.
import {
  claimGameRequest,
  listGameRequests,
  requestReasons,
  requestStates,
  updateGameRequest,
} from '@/lib/game-request-db';
import { readBoundedJson } from '@/lib/game-request-input';
export function queueReply(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}
const uuid = /^[a-f0-9-]{36}$/;
export async function getQueueResponse(request: Request) {
  const url = new URL(request.url);
  if (
    url.search.length > 256 ||
    [...url.searchParams.keys()].some((key) => key !== 'after') ||
    url.searchParams.getAll('after').length > 1
  )
    return queueReply({ error: 'invalid' }, 400);
  const after = url.searchParams.get('after');
  if (after && !uuid.test(after)) return queueReply({ error: 'invalid' }, 400);
  try {
    return queueReply(await listGameRequests(after));
  } catch {
    return queueReply({ error: 'unavailable' }, 503);
  }
}
export async function patchQueueResponse(request: Request) {
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
    'application/json'
  )
    return queueReply({ error: 'unsupported_media_type' }, 415);
  let body: unknown;
  try {
    body = await readBoundedJson(request);
  } catch {
    return queueReply({ error: 'too_large' }, 413);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return queueReply({ error: 'invalid' }, 400);
  const b = body as Record<string, unknown>;
  if (typeof b.id !== 'string' || !uuid.test(b.id))
    return queueReply({ error: 'invalid' }, 400);
  try {
    if (
      b.action === 'claim' &&
      Object.keys(b).every((k) => ['id', 'action'].includes(k))
    ) {
      const claim = await claimGameRequest(b.id);
      return claim
        ? queueReply({ claim })
        : queueReply({ error: 'conflict' }, 409);
    }
    if (
      b.action !== 'update' ||
      Object.keys(b).some(
        (k) =>
          ![
            'id',
            'action',
            'leaseToken',
            'status',
            'canonicalGame',
            'reasonCode',
            'publicationUrl',
            'publicationSha',
          ].includes(k),
      ) ||
      typeof b.leaseToken !== 'string' ||
      !uuid.test(b.leaseToken) ||
      !requestStates.includes(b.status as (typeof requestStates)[number])
    )
      return queueReply({ error: 'invalid' }, 400);
    const canonicalGame = b.canonicalGame ?? null,
      reasonCode = b.reasonCode ?? null,
      publicationUrl = b.publicationUrl ?? null,
      publicationSha = b.publicationSha ?? null;
    if (
      (canonicalGame !== null &&
        (typeof canonicalGame !== 'string' ||
          !/^[a-z0-9][a-z0-9-]{1,79}$/.test(canonicalGame))) ||
      (reasonCode !== null &&
        !requestReasons.includes(
          reasonCode as (typeof requestReasons)[number],
        )) ||
      (publicationUrl !== null &&
        (typeof publicationUrl !== 'string' ||
          !/^https:\/\/gemnao\.pages\.dev\/games\/[a-z0-9-]+$/.test(
            publicationUrl,
          ))) ||
      (publicationSha !== null &&
        (typeof publicationSha !== 'string' ||
          !/^[a-f0-9]{40}$/.test(publicationSha))) ||
      (b.status === 'published' &&
        (!canonicalGame || !publicationUrl || !publicationSha)) ||
      (['held', 'rejected', 'covered'].includes(String(b.status)) &&
        !reasonCode)
    )
      return queueReply({ error: 'invalid' }, 400);
    if (
      ['published', 'covered'].includes(String(b.status)) &&
      (!canonicalGame ||
        publicationUrl !== `https://gemnao.pages.dev/games/${canonicalGame}`)
    )
      return queueReply({ error: 'invalid' }, 400);
    const result = await updateGameRequest({
      id: b.id,
      leaseToken: b.leaseToken,
      status: b.status as string,
      canonicalGame: canonicalGame as string | null,
      reasonCode: reasonCode as string | null,
      publicationUrl: publicationUrl as string | null,
      publicationSha: publicationSha as string | null,
    });
    return result
      ? queueReply({ request: result })
      : queueReply({ error: 'conflict' }, 409);
  } catch {
    return queueReply({ error: 'unavailable' }, 503);
  }
}
