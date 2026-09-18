import { NextRequest, NextResponse } from 'next/server';
import { adminCookieName, isSameOrigin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: '不正なリクエストです。' }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, '', {
    httpOnly: true,
    secure: new URL(request.url).protocol === 'https:',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
