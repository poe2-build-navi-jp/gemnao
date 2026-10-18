/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { PathCopy } from '@/components/path-copy';
import { games } from '@/lib/games';
import { gameFacts } from '@/lib/localized/game-facts';
import { saveGuideByGame } from '@/lib/tool-guide-links';
import { localizedArticle } from '@/lib/localized/index';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
const info = {
  title: 'PC Game Save and Configuration File Locations',
  description:
    'Copy reviewed save and configuration paths, replace account placeholders and open the containing folder. Check each game’s backup and restoration instructions first.',
  checkedAt: '2026-10-18',
};
const listed = games.filter((g) => g.savePath && !g.focused);
const englishPath = (s: string) =>
  s.replace('<インストール先>', '<Game installation>');
export const generateStaticParams = () => [{ locale: 'en' }];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/tools/save-locations', info)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if ((await params).locale !== 'en') notFound();
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath="/tools/save-locations" />
      <article className="static-page">
        <p className="page-kicker">TOOLS</p>
        <h1>{info.title}</h1>
        <p className="page-lead">
          Copy a location, adapt its placeholders to your installation and open
          it as described below. Before restoring or overwriting anything, read
          the game-specific guide for the edition, files to copy and cloud-sync
          precautions.
        </p>
        <section className="caution-block" aria-labelledby="open-path-title">
          <h2 id="open-path-title">Open a copied path safely</h2>
          <ol>
            <li>
              Replace {'<Steam>'} with the Steam installation folder,{' '}
              {'<Game installation>'} with the game’s folder, and {'<Steam ID>'}{' '}
              or {'<ID>'} with your actual account folder. A path with
              unreplaced angle-bracket placeholders will not open.
            </li>
            <li>
              If the path ends in a file such as ER0000.sl2 or
              GraphicsConfig.xml, remove that final filename to open its
              containing folder. This is not an instruction to execute the file.
            </li>
            <li>
              Paste the folder path into Windows+R. Environment variables such
              as %APPDATA% can remain as written.
            </li>
            <li>
              For a routine backup, close the game and launcher before copying
              elsewhere. Preserve current data before any restore. If saves are
              missing, corrupted or in conflict, preserve what remains before
              launching or retrying sync.
            </li>
          </ol>
        </section>
        <p className="source-policy">
          Check{' '}
          <a href="/en/gear/save-backup-storage-guide">
            backup destinations and capacity
          </a>{' '}
          before buying storage. An existing USB or external drive may already
          be sufficient.
        </p>
        <div className="save-location-list">
          {listed.map((g) => {
            const name = gameFacts[g.slug]?.names.en || g.slug;
            const linked = saveGuideByGame[g.slug];
            const article = linked
              ? localizedArticle('en', g.slug, linked.slug)
              : undefined;
            return (
              <section key={g.slug} id={g.slug}>
                <h2>
                  <a href={`/en/games/${g.slug}`}>{name}</a>
                </h2>
                <h3>Save-data location recorded in the guide</h3>
                <div className="path-box">
                  <code>{englishPath(g.savePath)}</code>
                  <PathCopy value={englishPath(g.savePath)} english />
                </div>
                {g.slug === 'helldivers-2' ? (
                  <p>
                    This local folder is not a backup of server-managed online
                    progression.
                  </p>
                ) : null}
                {article ? (
                  <p>
                    <a href={`/en/games/${g.slug}/${article.slug}`}>
                      {article.shortTitle}
                    </a>
                  </p>
                ) : null}
                <h3>Configuration location</h3>
                <div className="path-box">
                  <code>{englishPath(g.configPath)}</code>
                  <PathCopy value={englishPath(g.configPath)} english />
                </div>
              </section>
            );
          })}
        </div>
        <section className="caution-block">
          <h2>Before using these locations</h2>
          <ul>
            <li>
              Steam Cloud can replace files with another version. Read the
              specific game’s restore instructions and preserve both copies
              before resolving a conflict.
            </li>
            <li>
              Updates, editions and installation locations can change paths. If
              a folder is absent, check the sources on the game’s guide rather
              than creating a guessed folder.
            </li>
          </ul>
          <p>
            <a href="/en/guide/save-data-backup">General save-backup guide</a>
          </p>
        </section>
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
