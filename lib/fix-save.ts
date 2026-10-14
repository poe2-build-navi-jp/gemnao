import { gameArticles } from './game-articles';
import { commonGuides } from './common-guides';
import { discordArticles } from './discord-articles';
import {
  readSolutions,
  upsertSolution,
  type SolutionDraft,
  type SavedSolution,
} from './saved-solutions';
import { parseRegisteredGames } from './my-games-selection';
import { MY_GAMES_KEY } from './my-pc';
import {
  emptySupport,
  copySupport,
  canonicalArticle,
  type Attempt,
} from './support-record';
import type { MyGamesLocale } from './my-games-copy';
import { fixSaveCopy } from './fix-save-copy';
export function articleReview(path: string) {
  const canonical = canonicalArticle(path);
  const game = gameArticles.find(
    (a) =>
      `/games/${a.gameSlug}/${a.slug}` === canonical &&
      !['draft', 'thin'].includes(a.status || 'verified'),
  );
  if (game)
    return {
      path: canonical,
      title: game.title,
      gameSlug: game.gameSlug,
      checkedOn: game.checkedAt,
      steps: game.steps,
    };
  const guide = commonGuides.find(
    (a) => `/guide/${a.slug}` === canonical && a.status === 'verified',
  );
  if (guide)
    return {
      path: canonical,
      title: guide.title,
      gameSlug: '',
      checkedOn: guide.checkedAt,
      steps: guide.steps.map((s, i) => ({
        id: `step-${i + 1}`,
        title: s.title,
      })),
    };
  const discord = discordArticles.find(
    (a) => `/discord/${a.slug}` === canonical && a.status === 'verified',
  );
  if (discord)
    return {
      path: canonical,
      title: discord.title,
      gameSlug: '',
      checkedOn: discord.checkedAt,
      steps: discord.causes.map((s, i) => ({
        id: `cause-${i + 1}`,
        title: s.title,
      })),
    };
  return undefined;
}
export function reviewForContext(context: string) {
  const game = gameArticles.find(
    (a) => `game-${a.gameSlug}-${a.slug}` === context,
  );
  return articleReview(
    game
      ? `/games/${game.gameSlug}/${game.slug}`
      : context.startsWith('guide-')
        ? `/guide/${context.slice(6)}`
        : context.startsWith('discord-')
          ? `/discord/${context.slice(8)}`
          : '',
  );
}
export function resolvedDraft(
  context: string,
  method: string,
  label: string,
  locale: MyGamesLocale,
): SolutionDraft | undefined {
  const article = reviewForContext(context);
  if (!article || !article.steps.some((s) => s.id === method)) return undefined;
  const t = fixSaveCopy[locale];
  return {
    title: label.slice(0, 200),
    gameSlug: article.gameSlug,
    status: 'resolved',
    diagnosis: t.reported,
    settings: label,
    notes: '',
    articlePath: article.path,
    stepId: method,
    completedSteps: [method],
  };
}
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export function fixSnapshotNotes(
  notes: string,
  articlePath: string,
  locale: MyGamesLocale,
  version = '',
) {
  const review = articleReview(articlePath);
  if (!review) return notes;
  const t = fixSaveCopy[locale];
  return [
    notes,
    `${t.version}: ${version.trim().slice(0, 120) || t.unknown}`,
    `${t.checked}: ${review.checkedOn}`,
    t.caution,
  ]
    .filter(Boolean)
    .join('\n');
}
export function registerFixGame(storage: Store, gameSlug: string) {
  if (!gameSlug) return { added: false };
  const current = parseRegisteredGames(storage.getItem(MY_GAMES_KEY));
  if (current.includes(gameSlug)) return { added: false };
  if (current.length >= 10) throw Error('game-limit');
  storage.setItem(MY_GAMES_KEY, JSON.stringify([...current, gameSlug]));
  return { added: true };
}
// Keep v1 notebook fields and the registered-game array exactly as they are.
// A game-registration failure cannot invalidate a successfully saved note.
export function saveResolvedFix(
  storage: Store,
  draft: SolutionDraft,
  attempt: Attempt | undefined,
  locale: MyGamesLocale,
  version = '',
  now = new Date().toISOString(),
) {
  const review = articleReview(draft.articlePath);
  if (
    draft.status !== 'resolved' ||
    !review ||
    !review.steps.some((s) => s.id === draft.stepId) ||
    draft.gameSlug !== review.gameSlug
  )
    throw Error('invalid-fix');
  const existing = readSolutions(storage).find(
    (item) =>
      item.articlePath === review.path &&
      item.stepId === draft.stepId &&
      item.status === 'resolved' &&
      item.gameSlug === draft.gameSlug,
  );
  const t = fixSaveCopy[locale];
  const item: SavedSolution = existing || {
    ...draft,
    diagnosis: draft.diagnosis || t.reported,
    settings:
      draft.settings ||
      attempt?.label ||
      review.steps.find((s) => s.id === draft.stepId)!.title,
    articlePath: review.path,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    notes: fixSnapshotNotes(draft.notes, review.path, locale, version),
    support: {
      ...(draft.support ? copySupport(draft.support) : emptySupport()),
      attempts: [
        ...(draft.support?.attempts.filter(
          (a) => a.path !== review.path || a.stepId !== draft.stepId,
        ) || []),
        {
          path: review.path,
          stepId: draft.stepId,
          label: (attempt?.label || draft.settings || draft.title).slice(
            0,
            300,
          ),
          result: 'resolved',
          at: attempt?.at || now,
        },
      ],
    },
  };
  if (!existing) upsertSolution(storage, item);
  let added = false,
    gameError = '';
  try {
    added = registerFixGame(storage, item.gameSlug).added;
  } catch (error) {
    gameError =
      error instanceof Error && error.message === 'game-limit'
        ? t.limit
        : t.gameError;
  }
  return { item, created: !existing, added, gameError };
}
