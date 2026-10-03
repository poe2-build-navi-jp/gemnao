import {
  gameRequestsAvailable,
  persistGameRequest,
} from '@/lib/game-request-db';
import {
  parseGameRequest,
  readBoundedJson,
  sameOriginRequest,
} from '@/lib/game-request-input';
function reply(
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...extra,
    },
  });
}
export async function GET() {
  return reply({ available: await gameRequestsAvailable() });
}
export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return reply({ error: 'forbidden' }, 403);
  if (!(await gameRequestsAvailable()))
    return reply({ error: 'unavailable' }, 503);
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
    'application/json'
  )
    return reply({ error: 'unsupported_media_type' }, 415);
  let body: unknown;
  try {
    body = await readBoundedJson(request);
  } catch {
    return reply({ error: 'too_large' }, 413);
  }
  const input = parseGameRequest(body);
  if (!input) return reply({ error: 'invalid' }, 400);
  // Cloudflare supplies this trusted header. Fail closed outside its ingress.
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip || !/^[0-9a-f:.]{3,45}$/i.test(ip))
    return reply({ error: 'unavailable' }, 503);
  try {
    const { duplicate } = await persistGameRequest(input, ip);
    return reply(
      { ok: true, status: 'received', duplicate },
      duplicate ? 200 : 201,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('game_request_rate_limit')
    )
      return reply({ error: 'rate_limited' }, 429, { 'Retry-After': '86400' });
    return reply({ error: 'unavailable' }, 503);
  }
}
