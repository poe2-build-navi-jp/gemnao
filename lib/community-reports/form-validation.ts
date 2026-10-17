import { articleReview } from '../fix-save';
import { day, sourceUrl, validReportVersion, type Content } from './model';
export type ReportField =
  | 'game'
  | 'articlePath'
  | 'stepIds'
  | 'version'
  | 'observedOn'
  | 'sources'
  | 'readOn';
export function reportFieldErrors(
  content: Content,
  game: string,
  now: number,
): ReportField[] {
  const errors: ReportField[] = [];
  if (!game) errors.push('game');
  const article = articleReview(content.articlePath);
  if (!article?.gameSlug || article.gameSlug !== game)
    errors.push('articlePath');
  if (
    !article ||
    content.stepIds.length < 1 ||
    content.stepIds.length > 8 ||
    new Set(content.stepIds).size !== content.stepIds.length ||
    content.stepIds.some((id) => !article.steps.some((s) => s.id === id))
  )
    errors.push('stepIds');
  try {
    day(content.observedOn, now);
  } catch {
    errors.push('observedOn');
  }
  if (!validReportVersion(content.version)) errors.push('version');
  try {
    if (content.sources.length > 3) throw Error();
    content.sources.forEach((s) => sourceUrl(s.url));
  } catch {
    errors.push('sources');
  }
  try {
    content.sources.forEach((s) => day(s.readOn, now));
  } catch {
    errors.push('readOn');
  }
  return errors;
}
