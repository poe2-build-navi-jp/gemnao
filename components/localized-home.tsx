import { ChevronRight, Wrench } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { copy, localizedGames } from '@/lib/i18n';
import { games } from '@/lib/games';
import { englishTitle } from '@/lib/english-quality';
import { WikiFooter, WikiHeader } from './wiki-header';

export function LocalizedHome({ locale }: { locale: Locale }) {
  const ui = copy[locale];
  const translatedGames = games.filter(
    (game) => localizedGames[locale][game.slug],
  );
  return (
    <main lang={locale === 'zh' ? 'zh-CN' : locale}>
      <WikiHeader locale={locale} />
      <section className="hero localized-hero">
        <div className="hero-copy">
          <p className="kicker">
            <Wrench size={15} /> WINDOWS PC TROUBLESHOOTING
          </p>
          <h1>{ui.hero}</h1>
          <p>{ui.heroBody}</p>
          {locale === 'en' ? (
            <p>
              Start with your game below. These are troubleshooting checklists,
              not tested fixes for every PC or a live outage tracker. Change one
              setting at a time and keep your saves safe.
            </p>
          ) : null}
        </div>
      </section>
      <section className="content" id="games">
        <div className="section-heading">
          <div>
            <p>{ui.selection}</p>
            <h2>{ui.listTitle}</h2>
          </div>
          <span>
            {translatedGames.length} {ui.titles}
          </span>
        </div>
        <div className="game-grid">
          {translatedGames.map((game, index) => (
            <a
              className="game-card"
              href={`/${locale}/games/${game.slug}`}
              key={game.slug}
              style={{ '--game-accent': game.accent } as React.CSSProperties}
            >
              <span className="rank">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="demand">{ui.open}</p>
                <h3>{locale === 'en' ? englishTitle(game) : game.title}</h3>
                <p className="localized-card-lead">
                  {localizedGames[locale][game.slug].lead}
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
