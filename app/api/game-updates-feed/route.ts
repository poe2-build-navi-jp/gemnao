import { buildGameNews } from '@/lib/status/data';
import { steamAppIds } from '@/lib/status/sources';
import { gameBySlug } from '@/lib/games';
import { feedSelection, updatesRss } from '@/lib/game-alert-feed';
export async function GET(request: Request) {
  const url = new URL(request.url),
    slugs = feedSelection(
      url.searchParams.get('games') || '',
      Object.keys(steamAppIds).filter((s) => gameBySlug(s)),
    );
  if (!slugs)
    return new Response('Select between 1 and 10 supported games.', {
      status: 400,
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
    });
  const self =
    'https://gemnao.pages.dev/api/game-updates-feed?games=' + slugs.join(',');
  const cache =
    typeof caches === 'undefined'
      ? null
      : (caches as unknown as { default: Cache }).default;
  const key =
    'https://gemnao.pages.dev/__cache/alerts-v1?games=' + slugs.join(',');
  try {
    const hit = await cache?.match(key);
    if (hit) return hit;
  } catch {
    /* rebuild */
  }
  const news = await buildGameNews(slugs);
  const items = slugs
    .flatMap((slug) =>
      (news[slug] || [])
        .filter((n) => Number.isFinite(Date.parse(n.date)))
        .map((n) => ({
          game: gameBySlug(slug)!.shortTitle,
          title: n.title,
          date: n.date,
          source: n.url,
          path: `/games/${slug}`,
        })),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const response = new Response(updatesRss(items, self), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex',
      'X-Content-Type-Options': 'nosniff',
    },
  });
  try {
    await cache?.put(key, response.clone());
  } catch {
    /* best effort */
  }
  return response;
}
