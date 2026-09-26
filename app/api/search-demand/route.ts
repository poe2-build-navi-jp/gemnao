import { NextRequest, NextResponse } from 'next/server';
import { isSameOrigin } from '@/lib/admin-auth';
import { hasSiteSearchResult, normalizeSearchQuery } from '@/lib/site-search';
import { recordZeroSearch } from '@/lib/search-demand-db';

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return new Response(null, { status: 403 });
  const body = (await request.json().catch(() => null)) as {
    query?: unknown;
    locale?: unknown;
  } | null;
  if (!body || typeof body.query !== 'string' || body.locale !== 'ja')
    return new Response(null, { status: 400 });
  const query = body.query.trim();
  const normalizedQuery = normalizeSearchQuery(query);
  // Search terms can contain private data. Do not retain emails, URLs, phone
  // numbers, long identifiers, or freeform strings outside the safe alphabet.
  if (
    normalizedQuery.length < 2 ||
    normalizedQuery.length > 80 ||
    !/^[\p{L}\p{N} ._・ー-]+$/u.test(normalizedQuery) ||
    /\d{8,}/.test(normalizedQuery) ||
    hasSiteSearchResult(normalizedQuery)
  )
    return new Response(null, { status: 400 });
  try {
    await recordZeroSearch(query, normalizedQuery, 'ja');
    return new Response(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: '検索記録を保存できませんでした。' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
