import { NextRequest } from 'next/server';
import {
  articleFeedbackTopic,
  articleImageTitle,
  articleSteps,
} from '@/lib/article-step-data';
import { readFeedback, readSolutionMethods } from '@/lib/feedback-db';
import { solutionDataImage } from '@/lib/solution-data-image';

export async function GET(request: NextRequest) {
  const context = request.nextUrl.searchParams.get('game') || '';
  const steps = articleSteps(context);
  const topic = articleFeedbackTopic(context);
  const title = articleImageTitle(context);
  if (!steps?.length || !topic || !title)
    return new Response(null, { status: 404 });
  try {
    const [rows, methods] = await Promise.all([
      readFeedback(context),
      readSolutionMethods(context, topic),
    ]);
    const row = rows.find((item) => item.topic === topic);
    const svg =
      row && solutionDataImage(title, row, methods, steps, new Date());
    if (!svg)
      return new Response(null, {
        status: 404,
        headers: { 'Cache-Control': 'no-store' },
      });
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(null, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
