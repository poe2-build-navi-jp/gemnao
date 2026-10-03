import { NextResponse } from 'next/server';
import { buildStatus } from '@/lib/status/data';

// Cached at the edge for 10 minutes: the board calls ~26 official endpoints.
const TTL = 600;
const cacheKey = 'https://gemnao.pages.dev/__cache/status-v2';

export async function GET() {
  const cache =
    typeof caches === 'undefined'
      ? null
      : (caches as unknown as { default: Cache }).default;
  try {
    const cached = await cache?.match(cacheKey);
    if (cached)
      return new Response(cached.body, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      });
  } catch {
    // Fall through and rebuild.
  }
  const data = await buildStatus();
  const body = JSON.stringify(data);
  try {
    await cache?.put(
      cacheKey,
      new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${TTL}`,
        },
      }),
    );
  } catch {
    // Caching is best effort.
  }
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
