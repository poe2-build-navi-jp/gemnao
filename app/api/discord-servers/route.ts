import { NextRequest, NextResponse } from 'next/server';
import {
  activeTimes,
  discordServerGames,
  playStyles,
  recruitmentPurposes,
  voiceChatOptions,
} from '@/lib/discord-servers';
import {
  createDiscordServerSubmission,
  listApprovedDiscordServers,
} from '@/lib/discord-server-db';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invitePattern =
  /^https:\/\/(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\/[A-Za-z0-9-]{2,64}\/?$/i;

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.map(stringValue).filter(Boolean)
    : [];
}

function allowedList(values: string[], allowed: readonly string[]) {
  return values.length > 0 && values.every((value) => allowed.includes(value));
}

export async function GET() {
  try {
    const servers = await listApprovedDiscordServers();
    return NextResponse.json(
      { servers },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } },
    );
  } catch {
    return NextResponse.json(
      { error: '募集情報を読み込めませんでした。' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: '入力内容を確認してください。' }, { status: 400 });
  }

  // Honeypotはbotへ保存成否を知らせず、実データだけ保存しない。
  if (stringValue(body.website)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const serverName = stringValue(body.serverName);
  const description = stringValue(body.description);
  const inviteUrl = stringValue(body.inviteUrl).replace(/\/$/, '');
  const game = stringValue(body.game);
  const purposes = stringList(body.purposes);
  const styles = stringList(body.styles);
  const selectedActiveTimes = stringList(body.activeTimes);
  const voiceChat = stringValue(body.voiceChat);
  const requirements = stringValue(body.requirements);
  const rules = stringValue(body.rules);
  const ownerDiscord = stringValue(body.ownerDiscord);
  const replyEmail = stringValue(body.replyEmail).toLowerCase();

  const voiceChatValues = voiceChatOptions.map((item) => item.value);
  if (
    serverName.length < 2 ||
    serverName.length > 80 ||
    description.length < 40 ||
    description.length > 600 ||
    !invitePattern.test(inviteUrl) ||
    !discordServerGames.includes(game as (typeof discordServerGames)[number]) ||
    !allowedList(purposes, recruitmentPurposes) ||
    (styles.length > 0 && !styles.every((value) => playStyles.includes(value as (typeof playStyles)[number]))) ||
    !allowedList(selectedActiveTimes, activeTimes) ||
    !voiceChatValues.includes(voiceChat as (typeof voiceChatValues)[number]) ||
    requirements.length < 10 ||
    requirements.length > 300 ||
    rules.length < 10 ||
    rules.length > 300 ||
    !ownerDiscord ||
    ownerDiscord.length > 80 ||
    !emailPattern.test(replyEmail) ||
    replyEmail.length > 254
  ) {
    return NextResponse.json(
      { error: '必須項目またはDiscord招待URLを確認してください。' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const result = await createDiscordServerSubmission({
      serverName,
      description,
      inviteUrl,
      game,
      purposes,
      styles,
      activeTimes: selectedActiveTimes,
      voiceChat: voiceChat as (typeof voiceChatValues)[number],
      requirements,
      rules,
      ownerDiscord,
      replyEmail,
    });
    if ('duplicate' in result && result.duplicate) {
      return NextResponse.json(
        { error: 'この招待URLは申請済み、または掲載中です。' },
        { status: 409, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    if ('rateLimited' in result && result.rateLimited) {
      return NextResponse.json(
        { error: '短時間の申請回数が上限に達しました。時間を置いてください。' },
        { status: 429, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    return NextResponse.json(
      { ok: true, status: 'pending' },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: '保存できませんでした。時間を置いて再度お試しください。' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
