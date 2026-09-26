import { NextRequest, NextResponse } from 'next/server';
import { isDiscordAdmin } from '@/lib/admin-auth';
import { readZeroSearchDemand } from '@/lib/search-demand-db';

export async function GET(request: NextRequest) {
  if (!(await isDiscordAdmin(request)))
    return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });
  try {
    return NextResponse.json(
      { queries: await readZeroSearchDemand() },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: '集計を読み込めませんでした。' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
