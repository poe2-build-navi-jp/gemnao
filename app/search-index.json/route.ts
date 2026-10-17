import { compactSearchIndex } from '@/lib/site-search';

// Compact article index for the home page search box. The browser fetches it
// only when someone searches or filters, so the home page itself does not
// carry every article's text (see lib/search-core.ts).
export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(compactSearchIndex()), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
