import { NextRequest, NextResponse } from 'next/server';
import { articleSteps, articleFeedbackTopic } from '@/lib/article-step-data';
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
  recordStepResult,
  stepResultsAvailable,
} from '@/lib/feedback-db';
import { recordFeedbackEvent } from '@/lib/status/events-db';

const topics = new Set([
  'save',
  'display',
  'controller',
  'launch',
  'mods',
  'specs',
  'server',
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
const validTopic = (game: string, topic: string) => {
  const articleTopic = articleFeedbackTopic(game);
  return articleTopic
    ? topic === articleTopic
    : topics.has(topic) ||
        gameArticles.some(
          (article) => article.gameSlug === game && article.slug === topic,
        );
};

export async function GET(request: NextRequest) {
  const game = request.nextUrl.searchParams.get('game') || '';
  if (!validGame(game))
    return NextResponse.json(
      { error: 'ゲームが見つかりません' },
      { status: 404 },
    );
  const [rows, methods] = await Promise.all([
    readFeedback(game),
    readSolutionMethods(game, articleFeedbackTopic(game)),
  ]);
  return NextResponse.json(
    { rows, methods, stepResultsAvailable: await stepResultsAvailable() },
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
    outcome?: string;
    requestId?: string;
    requestedAt?: string;
    reportStruggling?: boolean;
  } | null;
  if (
    !body ||
    typeof body.game !== 'string' ||
    typeof body.topic !== 'string' ||
    typeof body.kind !== 'string' ||
    !validGame(body.game) ||
    !validTopic(body.game, body.topic)
  ) {
    return NextResponse.json(
      { error: '入力が正しくありません' },
      { status: 400 },
    );
  }
  if (body.kind === 'method') {
    if (articleSteps(body.game))
      return NextResponse.json(
        { error: '記事のSTEPから回答してください' },
        { status: 400 },
      );
    if (
      typeof body.method !== 'string' ||
      !body.method.match(/^[a-z0-9-]{1,48}$/) ||
      typeof body.label !== 'string' ||
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
  if (body.kind === 'step-result') {
    const origin = request.headers.get('Origin');
    if (
      request.headers
        .get('Content-Type')
        ?.split(';')[0]
        .trim()
        .toLowerCase() !== 'application/json' ||
      origin !== new URL(request.url).origin ||
      request.headers.get('Sec-Fetch-Site') === 'cross-site'
    )
      return NextResponse.json(
        { error: 'このサイトの記事から回答してください' },
        { status: 403 },
      );
    const steps = articleSteps(body.game);
    const step = steps?.find((item) => item.id === body.method);
    if (
      !step ||
      (body.outcome !== 'resolved' && body.outcome !== 'not-resolved') ||
      (body.outcome === 'not-resolved' &&
        'notResolvedReportable' in step &&
        !step.notResolvedReportable) ||
      typeof body.requestId !== 'string' ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
        body.requestId,
      ) ||
      typeof body.requestedAt !== 'string' ||
      !Number.isFinite(Date.parse(body.requestedAt)) ||
      new Date(body.requestedAt).toISOString() !== body.requestedAt ||
      typeof body.reportStruggling !== 'boolean' ||
      (body.reportStruggling &&
        (body.outcome !== 'not-resolved' || step.id !== steps?.at(-1)?.id))
    )
      return NextResponse.json(
        { error: '入力が正しくありません' },
        { status: 400 },
      );
    if (
      Date.parse(body.requestedAt!) < Date.now() - 30 * 86400000 ||
      Date.parse(body.requestedAt!) > Date.now() + 300000
    )
      return NextResponse.json(
        { error: '送信番号の期限が切れています。重複防止のため再送できません' },
        { status: 410 },
      );
    if (!(await stepResultsAvailable()))
      return NextResponse.json(
        { error: '方法別の結果はまだ受け付けていません' },
        { status: 503 },
      );
    const result = await recordStepResult(
      body.game,
      body.topic,
      step.id,
      step.title,
      body.outcome,
      body.requestId,
      body.reportStruggling,
      body.requestedAt!,
    );
    if (result.limited)
      return NextResponse.json(
        {
          error: '匿名回答の受付が混み合っています。同じ回答を後で再送できます',
        },
        {
          status: 429,
          headers: { 'Retry-After': '3600', 'Cache-Control': 'no-store' },
        },
      );
    if (result.expired)
      return NextResponse.json(
        { error: '送信番号の期限が切れています。重複防止のため再送できません' },
        { status: 410 },
      );
    if (!result.accepted)
      return NextResponse.json(
        { error: '別の回答に使われた送信番号です' },
        { status: 409 },
      );
    if (result.created && body.reportStruggling)
      await recordFeedbackEvent(body.game, 'struggling').catch(() => undefined);
    // Acknowledgement is independent of a later aggregate read. Retrying the
    // same request is safe even if this response is interrupted.
    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (body.kind === 'step-solved') {
    const step = articleSteps(body.game)?.find(
      (item) => item.id === body.method,
    );
    if (!step)
      return NextResponse.json(
        { error: '記事のSTEPが見つかりません' },
        { status: 400 },
      );
    await recordStepSolved(body.game, body.topic, step.id, step.title);
    const [rows, methods] = await Promise.all([
      readFeedback(body.game),
      readSolutionMethods(body.game, articleFeedbackTopic(body.game)),
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
  // Time-stamped copy for the status board's "reports are rising" list.
  // A failure here must not lose the vote itself.
  if (body.kind === 'struggling')
    await recordFeedbackEvent(body.game, 'struggling').catch(() => undefined);
  return NextResponse.json(
    { rows: await readFeedback(body.game) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
