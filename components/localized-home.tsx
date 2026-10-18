import { translatedCommonGuides } from '@/lib/localized/save-guides-zh-es';
import { guideUi } from '@/lib/localized/guide-ui';
import { commonGuidesEn } from '@/lib/localized/common-guides-en';
import { ReportEntryLink } from '@/components/report-entry-link';
import { ContinueNotes } from './continue-notes';
import { EnglishHomeSearch } from './english-home-search';
import { LatestArticles } from './latest-articles';
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
      <div className="content report-entry-home"><ReportEntryLink prominent locale={locale} /></div>
      {locale === 'en' && <EnglishHomeSearch entries={[
        ...articles.map(article => ({
          href: article.gameSlug === 'discord' ? `/en/discord/${article.slug}` : `/en/games/${article.gameSlug}/${article.slug}`,
          title: article.title,
          label: article.gameSlug === 'discord' ? 'Discord' : article.gameName || gameFacts[article.gameSlug].names.en,
          body: `${article.lead} ${article.summary} ${article.diagnosis.map(row => `${row.symptom} ${row.cause}`).join(' ')}`,
        })),
        ...translatedGames.map(game => ({href: `/en/games/${game.slug}`, title: localizedHubs[game.slug].names?.en || gameFacts[game.slug].names.en, label: 'Game troubleshooting', body: localizedHubs[game.slug].lead.en || ''})),
        {href: '/en/discord', title: 'Discord troubleshooting guides', label: 'Discord index', body: 'Microphone, stream audio, screen share black screen and file uploads.'},
        {href: '/en/guide', title: 'PC game troubleshooting guides', label: 'Guide index', body: 'Steam verification, GPU drivers, black screen, low FPS, launch, crash and stutter.'},
        ...commonGuidesEn.map(guide => ({href: `/en${guide.path}`, title: guide.title, label: 'PC troubleshooting', body: guide.description || ''})),
        {href: `/en${crashGuideEn.path}`, title: crashGuideEn.title, label: 'PC troubleshooting', body: crashGuideEn.description || ''},
        ...gearGuidesEn.map(guide => ({href: `/en/gear/${guide.slug}`, title: guide.title, label: 'Before you buy', body: guide.description || ''})),
        {href: '/en/tools/windows-diagnosis', title: 'Windows game diagnosis: instructions and download', label: 'Windows prototype', body: 'Game launch, crash, black screen, freeze, low FPS and stutter. Windows 11 x64.'},
      ]} />}
      {locale !== 'en' && <><EnglishHomeSearch locale={locale} entries={[
        ...articles.map(a => ({href:a.gameSlug === 'discord' ? `/${locale}/discord/${a.slug}` : `/${locale}/games/${a.gameSlug}/${a.slug}`,title:a.title,label:a.gameName || (a.gameSlug === 'discord' ? 'Discord' : gameFacts[a.gameSlug].names[locale]),body:`${a.lead} ${a.summary}`})),
        ...translatedCommonGuides.filter(g => g.locale === locale).map(g => ({href:`/${locale}${g.path}`,title:g.title,label:guideUi[locale].index,body:g.description})),
        {href:`/${locale}/guide`,title:guideUi[locale].indexTitle,label:guideUi[locale].index,body:guideUi[locale].indexDescription},
      ]} /><section className="content"><div className="section-heading"><h2>{guideUi[locale].index}</h2><a href={`/${locale}/guide`}>{guideUi[locale].read} →</a></div><div className="guide-index-grid">{translatedCommonGuides.filter(g => g.locale === locale).map(g => <a href={`/${locale}${g.path}`} key={g.path}><strong>{g.shortTitle}</strong><span>{g.description}</span></a>)}</div></section></>}
      <LatestArticles locale={locale} articles={[...articles]
        .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt))
        .slice(0, 3)
        .map(article => ({
          href: article.gameSlug === 'discord'
            ? `/${locale}/discord/${article.slug}`
            : `/${locale}/games/${article.gameSlug}/${article.slug}`,
          title: article.title,
          checkedAt: article.checkedAt,
          label: article.gameSlug === 'discord' ? 'Discord'
            : article.gameName || gameFacts[article.gameSlug].names[locale],
        }))} />
      <ContinueNotes locale={locale} />
      <div className="content home-my-shortcut">
        <MyGamesHomeEntry locale={locale} />
      </div>
      <div className="content home-bookmark-slot">
        <HomeBookmarkHelp locale={locale} />
      </div>
      {locale === 'en' ? (
        <section className="content" id="tools">
          <div className="section-heading">
            <h2>Windows diagnosis and recent guides</h2><a href="/en/discord">Discord troubleshooting <ArrowRight size={15} /></a><a href="/en/guide">Browse all PC troubleshooting guides <ArrowRight size={15} /></a>
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
              {commonGuidesEn.map(guide => (<a href={`/en${guide.path}`} key={guide.slug}><span>PC troubleshooting</span>{guide.title}<ArrowRight size={15} /></a>))}
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
