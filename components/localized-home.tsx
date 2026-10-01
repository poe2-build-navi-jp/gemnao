/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, ChevronRight, Wrench } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { games } from '@/lib/games';
import { gameFacts } from '@/lib/localized/game-facts';
import { localizedHubs } from '@/lib/localized/hubs';
import { languageTag, localizedArticles } from '@/lib/localized/index';
import { ui } from '@/lib/localized/ui';
import { WikiFooter, WikiHeader } from './wiki-header';

export function LocalizedHome({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const translatedGames = games.filter((game) => localizedHubs[game.slug]);
  const articles = localizedArticles.filter(
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
                href={`/${locale}/games/${article.gameSlug}/${article.slug}`}
                key={`${article.gameSlug}/${article.slug}`}
              >
                <span>{gameFacts[article.gameSlug].names[locale]}</span>
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
                <h3>{gameFacts[game.slug].names[locale]}</h3>
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
