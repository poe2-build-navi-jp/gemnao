/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, ChevronRight, Wrench } from 'lucide-react';
import { gearGuidesEn } from '@/lib/localized/gear-guides-en';
import { crashGuideEn } from '@/lib/localized/crash-guide-en';
import type { Locale } from '@/lib/i18n';
import { games } from '@/lib/games';
import { gameFacts } from '@/lib/localized/game-facts';
import { localizedHubs, hasLocalizedHub } from '@/lib/localized/hubs';
import {
  languageTag,
  localizedArticles,
  localizedDiscordArticles,
} from '@/lib/localized/index';
import { ui } from '@/lib/localized/ui';
import { WikiFooter, WikiHeader } from './wiki-header';
import { MyGamesHomeEntry } from './my-games-home-entry';
import { HomeBookmarkHelp } from './home-bookmark-help';

export function LocalizedHome({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const translatedGames = games.filter((game) =>
    hasLocalizedHub(locale, game.slug),
  );
  const articles = [...localizedArticles, ...localizedDiscordArticles].filter(
    (article) => article.locale === locale,
  );
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} />
      <section className="hero localized-hero">
        <div className="hero-copy">
          <p className="kicker">
            <Wrench size={15} /> {t.homeKicker}
          </p>
          <h1>{t.homeTitle}</h1>
          <p>{t.homeBody}</p>
          <p>{t.homeNote}</p>
        </div>
      </section>
      <div className="content home-my-shortcut">
        <MyGamesHomeEntry locale={locale} />
      </div>
      <div className="content home-bookmark-slot">
        <HomeBookmarkHelp locale={locale} />
      </div>
      {locale === 'en' ? (
        <section className="content" id="tools">
          <div className="section-heading">
            <h2>Windows diagnosis and recent guides</h2>
          </div>
          <div className="related-section">
            <div>
              <a href="/en/tools/windows-diagnosis">
                <span>Free Windows prototype</span>Check a PC game launch or
                crash problem
                <ArrowRight size={15} />
              </a>
              <a href={`/en${crashGuideEn.path}`}>
                <span>PC troubleshooting</span>
                {crashGuideEn.title}
                <ArrowRight size={15} />
              </a>
              {gearGuidesEn.map((guide) => (
                <a href={`/en/gear/${guide.slug}`} key={guide.slug}>
                  <span>Before you buy</span>
                  {guide.title}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="content" id="articles">
        <div className="section-heading">
          <div>
            <h2>{t.homeArticles}</h2>
          </div>
          <span>{articles.length}</span>
        </div>
        <div className="related-section">
          <div>
            {articles.map((article) => (
              <a
                href={
                  article.gameSlug === 'discord'
                    ? `/${locale}/discord/${article.slug}`
                    : `/${locale}/games/${article.gameSlug}/${article.slug}`
                }
                key={`${article.gameSlug}/${article.slug}`}
              >
                <span>
                  {article.gameSlug === 'discord'
                    ? 'Discord'
                    : article.gameName ||
                      gameFacts[article.gameSlug].names[locale]}
                </span>
                {article.title}
                <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="content" id="games">
        <div className="section-heading">
          <div>
            <h2>{t.homeGames}</h2>
          </div>
          <span>{translatedGames.length}</span>
        </div>
        <div className="game-grid">
          {translatedGames.map((game) => (
            <a
              className="game-card"
              href={`/${locale}/games/${game.slug}`}
              key={game.slug}
              style={{ '--game-accent': game.accent } as React.CSSProperties}
            >
              <div>
                <h3>
                  {localizedHubs[game.slug].names?.[locale] ||
                    gameFacts[game.slug].names[locale]}
                </h3>
                <p className="localized-card-lead">
                  {localizedHubs[game.slug].lead[locale]}
                </p>
              </div>
              <ChevronRight className="arrow" size={20} />
            </a>
          ))}
        </div>
      </section>
      <WikiFooter locale={locale} />
    </main>
  );
}
