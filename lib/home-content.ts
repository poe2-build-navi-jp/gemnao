import { homeContentUpdatedAt } from './home-start';
import { searchArticles } from './site-search';
import { latestWeeklyReport } from './weekly-reports';

// Share the same initial article list between the home page and its update
// signals. Keep article bodies on the server, as before.
export const homeArticles = searchArticles('')
  .filter((article) => article.kind === 'game')
  .slice(0, 6)
  .map(({ gameArticle: _omit, ...article }) => article);

// The initial home view shows three dated articles and the latest weekly
// roundup. Use their real publication/review dates, not the build date or
// future release dates. The manual date still covers edits to home guidance.
export const homePageUpdatedAt = [
  homeContentUpdatedAt,
  latestWeeklyReport.publishedAt,
  ...homeArticles.slice(0, 3).map((article) => article.checkedAt),
].sort().at(-1)!;
