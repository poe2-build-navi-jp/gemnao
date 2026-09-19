import { NextRequest, NextResponse } from 'next/server';
import { isDiscordAdmin } from '@/lib/admin-auth';
import { listContactSubmissions } from '@/lib/contact-db';

export async function GET(request: NextRequest) {
  if (!(await isDiscordAdmin(request))) {
    return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });
  }
  try {
    const submissions = await listContactSubmissions();
    return NextResponse.json(
      { submissions },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'お問い合わせを読み込めませんでした。' },
      { status: 500 },
    );
  }
}
