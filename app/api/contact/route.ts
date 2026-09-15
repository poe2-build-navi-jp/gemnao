import { NextRequest, NextResponse } from 'next/server';
import { saveContactSubmission } from '@/lib/contact-db';

const categories = new Set(['correction', 'rights', 'privacy', 'other']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    category?: string;
    pageUrl?: string;
    message?: string;
    replyEmail?: string;
    website?: string;
  } | null;

  if (body?.website) return NextResponse.json({ ok: true }, { status: 201 });

  const category = body?.category?.trim() || '';
  const pageUrl = body?.pageUrl?.trim() || '';
  const message = body?.message?.trim() || '';
  const replyEmail = body?.replyEmail?.trim() || '';
  if (
    !categories.has(category) ||
    message.length < 20 ||
    message.length > 2000 ||
    pageUrl.length > 500 ||
    replyEmail.length > 254 ||
    (replyEmail && !emailPattern.test(replyEmail))
  ) {
    return NextResponse.json(
      { error: '入力内容を確認してください。' },
      { status: 400 },
    );
  }

  await saveContactSubmission({ category, pageUrl, message, replyEmail });
  return NextResponse.json(
    { ok: true },
    { status: 201, headers: { 'Cache-Control': 'no-store' } },
  );
}
