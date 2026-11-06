/* oxlint-disable next/no-html-link-for-pages -- Official sources use native links. */
import { changesForArticle } from '@/lib/my-game-changes';
import { gameChangesCopy } from '@/lib/my-game-changes-copy';
import type { MyGamesLocale } from '@/lib/my-games-copy';

export function OfficialUpdateNotice({
  path,
  locale = 'ja',
}: {
  path: string;
  locale?: MyGamesLocale;
}) {
  const changes = changesForArticle(path, locale).filter(
    (change) => change.checkedOn >= '2026-11-06',
  );
  if (!changes.length) return null;
  const t = gameChangesCopy[locale];
  return (
    <section
      className="guide-section official-update-notice"
      id="official-updates"
      aria-labelledby="official-updates-title"
    >
      <h2 id="official-updates-title">{t.heading}</h2>
      {changes.map((change) => (
        <article key={change.id} lang={change.copyLocale}>
          <h3>{change.copy.title}</h3>
          <p>
            {t.published}:{' '}
            <time dateTime={change.publishedOn}>{change.publishedOn}</time> /{' '}
            {t.checked}:{' '}
            <time dateTime={change.checkedOn}>{change.checkedOn}</time>
          </p>
          <dl>
            <div>
              <dt>{t.condition}</dt>
              <dd>{change.copy.condition}</dd>
            </div>
            <div>
              <dt>{t.change}</dt>
              <dd>{change.copy.change}</dd>
            </div>
            <div>
              <dt>{t.check}</dt>
              <dd>{change.copy.check}</dd>
            </div>
          </dl>
          <a
            href={change.sourceUrl}
            hrefLang={change.sourceLanguage || 'ja'}
            rel="noreferrer"
          >
            {change.sourceLanguage === 'en' ? t.sourceEnglish : t.source} →
          </a>
        </article>
      ))}
    </section>
  );
}
