import { NextRequest, NextResponse } from 'next/server';
import { buildGameNews } from '@/lib/status/data';
import { steamAppIds } from '@/lib/status/sources';

// Official announcements for the reader's マイゲーム (up to 10 games),
// cached at the edge for 30 minutes per game list.
export async function GET(request: NextRequest) {
  const slugs = [
    ...new Set(
      (request.nextUrl.searchParams.get('games') || '')
        .split(',')
        .filter((slug) => steamAppIds[slug]),
    ),
  ]
    .sort()
    .slice(0, 10);
  if (!slugs.length)
    return NextResponse.json({}, { headers: { 'Cache-Control': 'no-store' } });
  const cache =
    typeof caches === 'undefined'
      ? null
      : (caches as unknown as { default: Cache }).default;
  const key = `https://gemnao.pages.dev/__cache/game-news-v1?games=${slugs.join(',')}`;
  try {
    const cached = await cache?.match(key);
    if (cached)
      return new Response(cached.body, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      });
  } catch {
    // Rebuild below.
  }
  const body = JSON.stringify(await buildGameNews(slugs));
  try {
    await cache?.put(
      key,
      new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
        },
      }),
    );
  } catch {
    // Best effort.
  }
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
