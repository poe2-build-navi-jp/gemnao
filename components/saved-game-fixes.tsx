'use client';
/* oxlint-disable next/no-html-link-for-pages -- Explicit native reopen links. */
import { useSavedSolutions } from './use-saved-solutions';
import { articleReview } from '@/lib/fix-save';
import { fixSaveCopy } from '@/lib/fix-save-copy';
import { hasTranslation } from '@/lib/localized/index';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { trackSolutionReused } from '@/lib/analytics';
export function SavedGameFixes({
  gameSlug,
  locale,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
}) {
  const { items, error, ready } = useSavedSolutions(),
    t = fixSaveCopy[locale];
  const fixes = items.filter(
    (i) => i.gameSlug === gameSlug && i.status === 'resolved',
  );
  return (
    <section className="saved-game-fixes" aria-label={t.history}>
      <h4>{t.history}</h4>
      <p>{t.caution}</p>
      {error && <p role="alert">{t.error}</p>}
      {ready && !error && !fixes.length && <p>{t.noFixes}</p>}
      {fixes.map((item) => {
        const review = articleReview(item.articlePath),
          translated =
            locale !== 'ja' && hasTranslation(locale, item.articlePath);
        const href = `${translated ? `/${locale}` : ''}${item.articlePath}${item.stepId ? `#${item.stepId}` : ''}`;
        return (
          <article key={item.id}>
            <h5>{item.title}</h5>
            <p>
              {t.step}:{' '}
              {item.settings ||
                item.support?.attempts.find((a) => a.result === 'resolved')
                  ?.label ||
                item.stepId}
            </p>
            <dl>
              <div>
                <dt>{t.recorded}</dt>
                <dd>
                  <time dateTime={item.createdAt}>
                    {item.createdAt.slice(0, 10)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>{t.current}</dt>
                <dd>{review?.checkedOn || t.unknown}</dd>
              </div>
            </dl>
            <details>
              <summary>{t.details}</summary>
              <p className="saved-fix-notes">{item.notes || t.unknown}</p>
            </details>
            {review && (
              <p>
                <a
                  href={href}
                  hrefLang={translated ? locale : 'ja'}
                  onClick={() => trackSolutionReused()}
                >
                  {t.recheck}
                  {locale !== 'ja' && !translated ? t.jaGuide : ''} →
                </a>
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}
