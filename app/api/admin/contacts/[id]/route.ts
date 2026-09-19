import { NextRequest, NextResponse } from 'next/server';
import { isDiscordAdmin, isSameOrigin } from '@/lib/admin-auth';
import {
  type ContactSubmissionStatus,
  updateContactSubmissionStatus,
} from '@/lib/contact-db';

const allowedStatuses = new Set<ContactSubmissionStatus>([
  'new',
  'reviewing',
  'resolved',
]);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request) || !(await isDiscordAdmin(request))) {
    return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });
  }
  const { id: idText } = await context.params;
  const id = Number(idText);
  const body = (await request.json().catch(() => null)) as {
    status?: ContactSubmissionStatus;
  } | null;
  if (
    !Number.isInteger(id) ||
    id < 1 ||
    !body?.status ||
    !allowedStatuses.has(body.status)
  ) {
    return NextResponse.json(
      { error: '入力内容を確認してください。' },
      { status: 400 },
    );
  }
  try {
    const updated = await updateContactSubmissionStatus(id, body.status);
    if (!updated) {
      return NextResponse.json(
        { error: '対象のお問い合わせが見つかりません。' },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, status: body.status });
  } catch {
    return NextResponse.json(
      { error: '状態を更新できませんでした。' },
      { status: 500 },
    );
  }
}
