import { NextRequest, NextResponse } from 'next/server';
import { isDiscordAdmin, isSameOrigin } from '@/lib/admin-auth';
import { updateDiscordServerStatus } from '@/lib/discord-server-db';

const allowedStatuses = new Set(['approved', 'rejected', 'expired', 'closed']);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request) || !(await isDiscordAdmin(request))) {
    return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });
  }
  const { id: idText } = await context.params;
  const id = Number(idText);
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!Number.isInteger(id) || id < 1 || !body?.status || !allowedStatuses.has(body.status)) {
    return NextResponse.json({ error: '入力内容を確認してください。' }, { status: 400 });
  }
  try {
    const updated = await updateDiscordServerStatus(
      id,
      body.status as 'approved' | 'rejected' | 'expired' | 'closed',
    );
    if (!updated) {
      return NextResponse.json(
        { error: '状態が変わっているため更新できませんでした。' },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true, status: body.status });
  } catch {
    return NextResponse.json({ error: '更新できませんでした。' }, { status: 500 });
  }
}
