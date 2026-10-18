/* oxlint-disable next/no-html-link-for-pages -- Native links match editorial routes. */
import { WikiHeader, WikiFooter } from './wiki-header';
import { localizedDiscordArticles } from '@/lib/localized/index';
export const discordIndexEn = {
  title: 'Discord Troubleshooting Guides',
  description:
    'Find an English Discord guide for launch, loading and update failures, installation errors, microphone input, missing voices, audio errors 1001–1003, Bluetooth audio, stream audio, black shared screens, uploads, bot management, call disconnections, cameras, app crashes, echoes, activity sharing, game-volume changes, login, quiet microphones, No Route, notifications, overlays, phone verification, RTC connection, screen sharing and System Helper. Start with the affected device, viewer and channel.',
  checkedAt: '2026-10-18',
};
export function EnglishDiscordIndex() {
  const articles = localizedDiscordArticles.filter((a) => a.locale === 'en');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: discordIndexEn.title,
    description: discordIndexEn.description,
    inLanguage: 'en',
    url: 'https://gemnao.pages.dev/en/discord',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.shortTitle,
        url: `https://gemnao.pages.dev/en/discord/${a.slug}`,
      })),
    },
  };
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath="/discord" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article className="static-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/en">Home</a>
          <span>›</span>
          <b>Discord</b>
        </nav>
        <p className="page-kicker">DISCORD TROUBLESHOOTING</p>
        <h1>{discordIndexEn.title}</h1>
        <p className="page-lead">
          Identify which part fails before changing settings: launch, sign-in, update, call connection, camera, your input, shared
          application audio, the actual viewer’s picture or an attachment. These{' '}
          {articles.length} English guides use official sources and one-change
          comparisons.
        </p>
        <div className="guide-index-grid">
          {articles.map((a) => (
            <a href={`/en/discord/${a.slug}`} key={a.slug}>
              <strong>{a.shortTitle}</strong>
              <span>{a.description}</span>
              <small>Choose the next check →</small>
            </a>
          ))}
        </div>
        <section className="guide-category">
          <h2>Keep tests private and comparable</h2>
          <p>
            Use willing participants and a permitted test destination. A blank
            Notepad window or harmless audio is enough; do not share private
            conversations, account screens or game logs. Whole-screen sharing
            can expose notifications and other windows.
          </p>
          <p>
            Keep security protection enabled and respect channel restrictions.
            Record which device, client and viewer fails, restore unhelpful
            settings, and give official support the comparison rather than
            guessing from one indicator.
          </p>
          <p>
            <a href="/en/guide">PC game troubleshooting guides</a> ·{' '}
            <a href="/en/gear/discord-microphone-guide">
              Microphone checks before buying equipment
            </a>
          </p>
        </section>
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
