import { NextRequest, NextResponse } from 'next/server';
import { saveContactSubmission } from '@/lib/contact-db';

const categories = new Set([
  'correction',
  'rights',
  'privacy',
  'other',
  'business',
  'server_submission',
  'server_report',
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pageUrlPattern = /^https:\/\/gemnao\.pages\.dev(?:\/|$)/;
const maxBodyBytes = 20_000;

export async function POST(request: NextRequest) {
  const tooLarge = () => NextResponse.json(
    { error: '入力内容が長すぎます。' },
    { status: 413, headers: { 'Cache-Control': 'no-store' } },
  );
  if (Number(request.headers.get('content-length')) > maxBodyBytes) return tooLarge();
  // Count streamed bytes as well: Content-Length is optional and untrusted.
  let body: unknown = null;
  const reader = request.body?.getReader();
  if (reader) {
    try {
      let bytes = 0;
      let text = '';
      const decoder = new TextDecoder();
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > maxBodyBytes) {
          await reader.cancel();
          return tooLarge();
        }
        text += decoder.decode(chunk.value, { stream: true });
      }
      body = JSON.parse(text + decoder.decode());
    } catch {
      body = null;
    }
  }
  const fields = ['category', 'pageUrl', 'message', 'replyEmail', 'website'];
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    Object.entries(body).some(
      ([key, value]) => !fields.includes(key) || typeof value !== 'string',
    )
  ) {
    return NextResponse.json(
      { error: '入力内容を確認してください。' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  const input = body as Partial<Record<(typeof fields)[number], string>>;

  if (input.website) return NextResponse.json({ ok: true }, { status: 201 });

  const category = input.category?.trim() || '';
  const pageUrl = input.pageUrl?.trim() || '';
  const message = input.message?.trim() || '';
  const replyEmail = input.replyEmail?.trim() || '';
  if (
    !categories.has(category) ||
    message.length < 20 ||
    message.length > 4000 ||
    pageUrl.length > 500 ||
    (pageUrl && !pageUrlPattern.test(pageUrl)) ||
    replyEmail.length > 254 ||
    (replyEmail && !emailPattern.test(replyEmail))
  ) {
    return NextResponse.json(
      { error: '入力内容を確認してください。' },
      { status: 400 },
    );
  }

  try {
    await saveContactSubmission({ category, pageUrl, message, replyEmail });
  } catch {
    return NextResponse.json(
      { error: '送信できませんでした。時間を置いて再度お試しください。' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  return NextResponse.json(
    { ok: true },
    { status: 201, headers: { 'Cache-Control': 'no-store' } },
  );
}
