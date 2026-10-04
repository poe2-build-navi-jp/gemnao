import {
  SupportWorkspace,
  SupportUpdates,
} from '@/components/support-workspace';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { MyGamesPanel } from '@/components/my-games-panel';
import { myGamesCopy, type MyGamesLocale } from '@/lib/my-games-copy';
import { myGamesData } from '@/lib/my-games-data';
import { languageTag } from '@/lib/localized/index';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
export function MyGamesPage({ locale = 'ja' }: { locale?: MyGamesLocale }) {
  const t = myGamesCopy[locale];
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath="/my-games" />
      <article className="static-page my-games-page">
        <p className="page-kicker">{t.name}</p>
        <h1>{t.title}</h1>
        <p className="page-lead">{t.lead}</p>
        <a className="my-games-primary" href="#my-games">
          {t.open} ↓
        </a>
        <p className="my-games-privacy">{t.privacy}</p>
        <MyGamesPanel games={myGamesData(locale)} locale={locale} />
        <SupportWorkspace locale={locale} />
        <SupportUpdates locale={locale} />
        <p className="my-games-other">
          <a href="/my#my-reading-list">{t.savedLink} →</a>
        </p>
      </article>
      <WikiFooter locale={locale} />
    </main>
  );
}
