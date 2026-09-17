import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/lib/games';
import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles';
import { gameArticles } from '@/lib/game-articles';
import {
  incrementFeedback,
  incrementSolutionMethod,
  readSolutionMethods,
  readFeedback,
  recordStepSolved,
} from '@/lib/feedback-db';

const topics = new Set([
  'save',
  'display',
  'controller',
  'launch',
  'mods',
  'specs',
  'discord-launch',
  'discord-audio',
  'discord-connection',
  'discord-screen',
]);
const kinds = new Set(['struggling', 'resolved']);
const validGame = (slug: string) =>
  games.some((game) => game.slug === slug) ||
  gameArticles.some(
    (article) => `game-${article.gameSlug}-${article.slug}` === slug,
  ) ||
  commonGuides.some((guide) => `guide-${guide.slug}` === slug) ||
  discordArticles.some((article) => `discord-${article.slug}` === slug);

export async function GET(request: NextRequest) {
  const game = request.nextUrl.searchParams.get('game') || '';
  if (!validGame(game))
    return NextResponse.json(
      { error: 'ゲームが見つかりません' },
      { status: 404 },
    );
  const [rows, methods] = await Promise.all([
    readFeedback(game),
    readSolutionMethods(game),
  ]);
  return NextResponse.json(
    { rows, methods },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    game?: string;
    topic?: string;
    kind?: string;
    method?: string;
    label?: string;
  } | null;
  if (
    !body ||
    !body.game ||
    !body.topic ||
    !body.kind ||
    !validGame(body.game) ||
    !topics.has(body.topic)
  ) {
    return NextResponse.json(
      { error: '入力が正しくありません' },
      { status: 400 },
    );
  }
  if (body.kind === 'method') {
    if (
      !body.method?.match(/^[a-z0-9-]{1,48}$/) ||
      !body.label ||
      body.label.length > 80
    )
      return NextResponse.json(
        { error: '入力が正しくありません' },
        { status: 400 },
      );
    await incrementSolutionMethod(
      body.game,
      body.topic,
      body.method,
      body.label,
    );
    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (body.kind === 'step-solved') {
    if (
      !body.method?.match(/^[a-z0-9-]{1,48}$/) ||
      !body.label ||
      body.label.length > 80
    )
      return NextResponse.json(
        { error: '入力が正しくありません' },
        { status: 400 },
      );
    await recordStepSolved(
      body.game,
      body.topic,
      body.method,
      body.label,
    );
    const [rows, methods] = await Promise.all([
      readFeedback(body.game),
      readSolutionMethods(body.game),
    ]);
    return NextResponse.json(
      { ok: true, rows, methods },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (!kinds.has(body.kind))
    return NextResponse.json(
      { error: '入力が正しくありません' },
      { status: 400 },
    );
  await incrementFeedback(
    body.game,
    body.topic,
    body.kind as 'struggling' | 'resolved',
  );
  return NextResponse.json(
    { rows: await readFeedback(body.game) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
