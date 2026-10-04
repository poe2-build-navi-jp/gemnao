import { ArticleDiagnosisEntry } from '@/components/article-diagnosis-entry';
import { SupportWorkspace } from '@/components/support-workspace';
import { ShareButtons } from '@/components/share-buttons';
import { editorialAuthor, editorialPublisher } from '@/lib/editorial-identity';
import { SaveGame } from '@/components/save-game';
import { SaveArticle } from '@/components/save-article';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Timer,
} from 'lucide-react';
import { PathCopy } from '@/components/path-copy';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import type { GameGuide } from '@/lib/games';
import { gameFacts } from '@/lib/localized/game-facts';
import { ogImageFor } from '@/lib/og-images';
import { hasTranslation, languageTag } from '@/lib/localized/index';
import type { LocalizedArticle as Article } from '@/lib/localized/types';
import { ui } from '@/lib/localized/ui';

const SITE = 'https://gemnao.pages.dev';

export function LocalizedArticle({
  game,
  article,
  section,
}: { article: Article } & (
  | { game: GameGuide; section?: 'games' }
  | { game?: never; section: 'discord' }
)) {
  const { locale } = article;
  const t = ui[locale];
  const isDiscord = section === 'discord';
  const name = isDiscord
    ? 'Discord'
    : article.gameName || gameFacts[game!.slug].names[locale];
  const originalHubPath = isDiscord ? '/discord' : `/games/${game!.slug}`;
  const originalPath = `${originalHubPath}/${article.slug}`;
  const translatedHub = hasTranslation(locale, originalHubPath);
  const hubPath = `${translatedHub ? `/${locale}` : ''}${originalHubPath}`;
  const hubLabel = `${name}${translatedHub ? '' : t.inJapanese}`;
  const path = `/${locale}${originalPath}`;
  const editorialLabel = {
    en: 'Edited by Gemnao Editorial Team',
    zh: '编辑：Gemnao 编辑团队',
    es: 'Edición: equipo editorial de Gemnao',
  }[locale];
  const nextGuideLabel = {
    en: 'Different symptom or still not fixed? Find the next check →',
    zh: '症状不同或仍未解决？查看下一步排查 →',
    es: '¿Otro síntoma o sigue sin resolverse? Consulta qué revisar después →',
  }[locale];
  const riskLabel = { en: 'Risk', zh: '风险', es: 'Riesgo' }[locale];
  const risks = {
    en: { low: 'low', medium: 'medium', high: 'high' },
    zh: { low: '低', medium: '中', high: '高' },
    es: { low: 'bajo', medium: 'medio', high: 'alto' },
  }[locale];
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: article.title,
      description: article.description,
      dateModified: article.checkedAt,
      inLanguage: languageTag[locale],
      author: editorialAuthor,
      publisher: editorialPublisher,
      mainEntityOfPage: `${SITE}${path}`,
      about: {
        '@type': isDiscord ? 'SoftwareApplication' : 'VideoGame',
        name: isDiscord
          ? 'Discord'
          : article.gameName || gameFacts[game!.slug].names.en,
      },
      citation: article.sources.map((source) => source.url),
      image: `${SITE}${ogImageFor(path).split('?')[0]}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
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
        {
          '@type': 'ListItem',
          position: 2,
          name: hubLabel,
          item: `${SITE}${hubPath}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.shortTitle,
          item: `${SITE}${path}`,
        },
      ],
    },
  ];
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath={originalPath} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="breadcrumb">
            <a href={`/${locale}`}>{t.home}</a>
            <span>›</span>
            <a href={hubPath} hrefLang={translatedHub ? locale : 'ja'}>
              {hubLabel}
            </a>
            <span>›</span>
            <b>{article.shortTitle}</b>
          </nav>
          <p className="article-label">{name}</p>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.lead}</p>
          <div className="article-meta">
            <span>
              <a href="/about" hrefLang="ja">
                {editorialLabel}
                {t.inJapanese}
              </a>
            </span>
            <span>
              {t.lastChecked} {article.checkedAt}
            </span>
          </div>
          <SaveArticle path={path} title={article.title} locale={locale} />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>{t.contents}</strong>
          <a href="#answer">{t.summary}</a>
          <a href="#diagnosis">{t.diagnosis}</a>
          {article.steps.map((step, index) => (
            <a href={`#${step.id}`} key={step.id}>
              {index + 1}. {step.title}
            </a>
          ))}
          <a href="#faq">{t.faq}</a>
          <a href="#references">{t.references}</a>
        </aside>
        <article className="guide-article">
          <section className="answer-summary" id="answer">
            <h2>
              <CheckCircle2 size={23} /> {t.summary}
            </h2>
            <p>{article.summary}</p>
            {article.related?.length ? (
              <a className="article-next-jump" href="#related-guides">
                {nextGuideLabel}
              </a>
            ) : null}
          </section>
          {!isDiscord ? <SaveGame slug={game!.slug} locale={locale} /> : null}
          <section className="quick-facts" aria-labelledby="quick-facts-title">
            <h2 id="quick-facts-title">
              <Timer size={21} /> {t.quickFacts}
            </h2>
            <dl>
              {article.quickFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    {fact.copy ? <code>{fact.value}</code> : fact.value}
                    {fact.copy ? (
                      <PathCopy value={fact.value} labels={t.copyLabels} />
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="diagnosis-table" id="diagnosis">
            <h2>{t.diagnosis}</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">{t.symptom}</th>
                  <th scope="col">{t.cause}</th>
                  <th scope="col">{t.step}</th>
                </tr>
              </thead>
              <tbody>
                {article.diagnosis.map((row) => {
                  const index = article.steps.findIndex(
                    (step) => step.id === row.stepId,
                  );
                  return (
                    <tr key={row.symptom}>
                      <td data-label={t.symptom}>{row.symptom}</td>
                      <td data-label={t.cause}>{row.cause}</td>
                      <td data-label={t.step}>
                        <a className="diagnosis-step-link" href={`#${row.stepId}`}>
                          {t.stepLabel} {index + 1}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          <section className="pc-steps" aria-label={t.steps}>
            <h2>{t.steps}</h2>
            <SupportWorkspace
              locale={locale}
              steps={article.steps}
              draft={{
                title: article.title,
                gameSlug: game?.slug || '',
                status: 'investigating',
                diagnosis: '',
                settings: '',
                notes: '',
                articlePath: originalPath,
                stepId: '',
                completedSteps: [],
              }}
            />
            {article.steps.map((step, index) => (
              <section className="pc-step" id={step.id} key={step.id}>
                <h3>
                  {t.stepLabel} {index + 1}｜{step.title}
                </h3>
                <p>{step.summary}</p>
                <p className="step-badges">
                  {t.time}: {step.time}
                  {step.risk ? ` · ${riskLabel}: ${risks[step.risk]}` : ''}
                </p>
                <ol>
                  {step.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
                {step.note ? <p className="tip">{step.note}</p> : null}
                {step.guideLink ? (
                  <p>
                    <a href={step.guideLink.href}>{step.guideLink.label}</a>
                    {step.guideLink.description
                      ? ` — ${step.guideLink.description}`
                      : ''}
                  </p>
                ) : null}
              </section>
            ))}
          </section>
          <section className="avoid-block">
            <h2>
              <AlertTriangle size={21} /> {t.avoid}
            </h2>
            <ul>
              {article.avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="caution-block">
            <h2>{t.cautions}</h2>
            <ul>
              {article.cautions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="faq-section" id="faq">
            <h2>{t.faq}</h2>
            <div>
              {article.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <ArticleDiagnosisEntry path={originalPath} locale={locale} />
          {article.related?.length ? (
            <section className="related-section" id="related-guides">
              <h2>
                {
                  {
                    en: 'Related guides',
                    zh: '相关指南',
                    es: 'Guías relacionadas',
                  }[locale]
                }
              </h2>
              <div>
                {article.related.map((link) => (
                  <a
                    href={link.href}
                    data-related="true"
                    hrefLang={link.href.match(/^\/(en|zh|es)\//)?.[1] || 'ja'}
                    key={link.href}
                  >
                    {link.label}
                    <ArrowRight size={15} />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
          <ShareButtons title={article.title} path={path} locale={locale} />
          <section className="sources" id="references">
            <h2>{t.references}</h2>
            <p className="source-policy">
              {article.sourcePolicy || t.sourcePolicy}
            </p>
            {article.sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.url}
              >
                {source.label}
                <ExternalLink size={15} />
              </a>
            ))}
            <a href={hubPath} hrefLang={translatedHub ? locale : 'ja'}>
              {hubLabel}
              <ArrowRight size={15} />
            </a>
            <a href={originalPath} hrefLang="ja">
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
