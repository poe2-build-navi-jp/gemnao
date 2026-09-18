import { NextRequest, NextResponse } from 'next/server';
import {
  adminCookieName,
  adminSessionValue,
  isSameOrigin,
  validateAdminToken,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: '不正なリクエストです。' }, { status: 403 });
  }
  const body = (await request.json().catch(() => null)) as { token?: string } | null;
  if (!(await validateAdminToken(body?.token || ''))) {
    return NextResponse.json({ error: '管理キーが正しくありません。' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, await adminSessionValue(), {
    httpOnly: true,
    secure: new URL(request.url).protocol === 'https:',
    sameSite: 'strict',
    path: '/',
    maxAge: 8 * 60 * 60,
  });
  return response;
}
