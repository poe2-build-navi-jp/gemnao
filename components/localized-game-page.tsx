import { OnimushaSaveAnswer } from '@/components/onimusha-save-answer';
import { ArticleToc } from '@/components/article-toc';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Languages,
} from 'lucide-react';
import { PathCopy } from '@/components/path-copy';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import type { GameGuide } from '@/lib/games';
import type { Locale } from '@/lib/i18n';
import { gameFacts, type Spec } from '@/lib/localized/game-facts';
import { localizedHubs } from '@/lib/localized/hubs';
import { languageTag, localizedArticlesFor } from '@/lib/localized/index';
import { ui } from '@/lib/localized/ui';

const SITE = 'https://gemnao.pages.dev';
const specFields = ['os', 'cpu', 'gpu', 'ram', 'storage'] as const;

function SpecValue({
  spec,
  field,
  t,
}: {
  spec: Spec;
  field: (typeof specFields)[number];
  t: (typeof ui)[Locale];
}) {
  if (field !== 'storage' || !spec.ssd) return <>{spec[field]}</>;
  const note =
    spec.ssd === 'required'
      ? t.ssdRequired
      : spec.ssd === 'recommended'
        ? t.ssdRecommended
        : t.ssdPreferred;
  return (
    <>
      {spec.storage} ({note})
    </>
  );
}

// A translated game page: written-for-the-language intro, translated guides,
// file locations, and requirements / language support from the Steam store.
export function LocalizedGamePage({
  game,
  locale,
}: {
  game: GameGuide;
  locale: Locale;
}) {
  const t = ui[locale];
  const hub = localizedHubs[game.slug];
  const facts = gameFacts[game.slug];
  const name = hub.names?.[locale] || facts.names[locale];
  const title = hub.title?.[locale] || name;
  const checkedAt = hub.checkedAt || facts.checkedAt;
  const articles = localizedArticlesFor(locale, game.slug);
  const path = `/${locale}/games/${game.slug}`;
  const localPath = (value: string) =>
    value.replace('<インストール先>', t.installFolder);
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: hub.title?.[locale] || `${name} — ${t.gameLabel}`,
      description: hub.lead[locale],
      dateModified: checkedAt,
      inLanguage: languageTag[locale],
      author: { '@type': 'Organization', name: 'Gemnao' },
      mainEntityOfPage: `${SITE}${path}`,
      about: { '@type': 'VideoGame', name: hub.names?.en || facts.names.en },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.home,
          item: `${SITE}/${locale}`,
        },
        { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
      ],
    },
  ];
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath={`/games/${game.slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div
        className="article-hero"
        style={{ '--game-accent': game.accent } as React.CSSProperties}
      >
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="breadcrumb">
            <a href={`/${locale}`}>{t.home}</a>
            <span>/</span>
            <b>{name}</b>
          </nav>
          <p className="article-label">{t.gameLabel}</p>
          <h1>{title}</h1>
          <p className="article-lead">{hub.lead[locale]}</p>
          <div className="article-meta">
            <span>
              {t.lastChecked} {checkedAt}
            </span>
          </div>
        </div>
      </div>
      <div className="article-layout">
        <ArticleToc title={t.contents}>
          {game.slug === 'onimusha-way-of-the-sword' && locale === 'en' ? (
            <a href="#save-method">How to save</a>
          ) : null}
          {articles.length ? <a href="#guides">{t.guides}</a> : null}
          {hub.checklist?.[locale] ? (
            <a href="#checklist">{t.checklist}</a>
          ) : null}
          {!hub.focused ? (
            <>
              <a href="#saves">{t.saves}</a>
              <a href="#requirements">{t.requirements}</a>
              <a href="#languages">{t.languages}</a>
            </>
          ) : null}
          <a href="#references">{t.references}</a>
        </ArticleToc>
        <article className="guide-article">
          <p className="article-introduction">{hub.intro[locale]}</p>
          {game.slug === 'onimusha-way-of-the-sword' && locale === 'en' ? (
            <OnimushaSaveAnswer english />
          ) : null}
          {articles.length ? (
            <section className="related-section" id="guides">
              <h2>{t.guides}</h2>
              <div>
                {articles.map((article) => (
                  <a href={`${path}/${article.slug}`} key={article.slug}>
                    <span>{article.shortTitle}</span>
                    {article.title}
                    <ArrowRight size={15} />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
          {hub.checklist?.[locale] ? (
            <section className="guide-section" id="checklist">
              <h2>
                <AlertTriangle />
                {t.checklist}
              </h2>
              <p>{t.checklistIntro}</p>
              <ol className="fix-list">
                {hub.checklist[locale]!.map((item, index) => (
                  <li key={item}>
                    <span>{index + 1}</span>
                    <div>
                      <b>{item}</b>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          {!hub.focused ? (
            <>
              <section className="guide-section" id="saves">
                <h2>
                  <FolderOpen />
                  {t.saves}
                </h2>
                <h3>{t.saveData}</h3>
                {hub.fileLocations ? (
                  <p>{hub.fileLocations.saveNote}</p>
                ) : (
                  <div className="path-box">
                    <code>{localPath(game.savePath)}</code>
                    <PathCopy
                      value={localPath(game.savePath)}
                      labels={t.copyLabels}
                    />
                  </div>
                )}
                <h3>{t.config}</h3>
                <div className="path-box">
                  <code>
                    {localPath(
                      hub.fileLocations?.configPath || game.configPath,
                    )}
                  </code>
                  <PathCopy
                    value={localPath(
                      hub.fileLocations?.configPath || game.configPath,
                    )}
                    labels={t.copyLabels}
                  />
                </div>
                <p className="tip">
                  {hub.fileLocations
                    ? 'Use Steam → Library → right-click the game → Manage → Browse local files to open the actual installation. The library placeholder above is not a path to paste into Run. Copy config.ini before editing it.'
                    : t.openPath}
                </p>
              </section>
              <section className="diagnosis-table" id="requirements">
                <h2>{t.requirements}</h2>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{t.specItem}</th>
                      <th scope="col">{t.minimum}</th>
                      {facts.recommended ? (
                        <th scope="col">{t.recommended}</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {specFields.map((field) => (
                      <tr key={field}>
                        <th scope="row">{t[field]}</th>
                        <td data-label={t.minimum}>
                          <SpecValue spec={facts.minimum} field={field} t={t} />
                        </td>
                        {facts.recommended ? (
                          <td data-label={t.recommended}>
                            <SpecValue
                              spec={facts.recommended}
                              field={field}
                              t={t}
                            />
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="source-note">{t.requirementsNote}</p>
              </section>
              <section className="diagnosis-table" id="languages">
                <h2>
                  <Languages size={21} /> {t.languages}
                </h2>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{t.language}</th>
                      <th scope="col">{t.interfaceText}</th>
                      <th scope="col">{t.fullAudio}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(['en', 'zh', 'es', 'ja'] as const).map((lang) => (
                      <tr key={lang}>
                        <th scope="row">{t.langNames[lang]}</th>
                        <td data-label={t.interfaceText}>
                          {facts.languages[lang].ui ? t.yes : t.no}
                        </td>
                        <td data-label={t.fullAudio}>
                          {facts.languages[lang].audio ? t.yes : t.no}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          ) : null}
          <section className="sources" id="references">
            <h2>
              <CheckCircle2 size={21} /> {t.references}
            </h2>
            <p className="source-policy">{t.sourcePolicy}</p>
            {hub.sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.url}
              >
                {source.label[locale]}
                <ExternalLink size={15} />
              </a>
            ))}
            <a href={`/games/${game.slug}`} hrefLang="ja">
              {t.japaneseVersion}
              <ArrowRight size={15} />
            </a>
          </section>
        </article>
      </div>
      <WikiFooter locale={locale} />
    </main>
  );
}
