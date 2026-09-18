import { NextRequest, NextResponse } from 'next/server';
import { isDiscordAdmin } from '@/lib/admin-auth';
import { listDiscordServerSubmissions } from '@/lib/discord-server-db';

export async function GET(request: NextRequest) {
  if (!(await isDiscordAdmin(request))) {
    return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });
  }
  try {
    const submissions = await listDiscordServerSubmissions();
    return NextResponse.json(
      { submissions },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ error: '申請を読み込めませんでした。' }, { status: 500 });
  }
}
