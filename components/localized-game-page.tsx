/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Gauge,
  Gamepad2,
  Languages,
  MonitorUp,
  Puzzle,
} from 'lucide-react';
import { IssueFeedback } from '@/components/issue-feedback';
import { PathCopy } from '@/components/path-copy';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import type { GameGuide } from '@/lib/games';
import type { Locale } from '@/lib/i18n';
import { copy, localizedGames } from '@/lib/i18n';
import { diagnosticFocus, englishTitle } from '@/lib/english-quality';

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="guide-section" id={id}>
      <h2>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function specText(value: string, locale: Locale) {
  const replacements: Record<Locale, [RegExp, string][]> = {
    en: [
      [/メモリ?/g, 'RAM '],
      [/インストール先/g, 'game installation folder'],
      [/。/g, '. '],
      [/、/g, ', '],
      [/以上/g, ' or higher'],
      [/必須/g, ' required'],
      [/推奨/g, ' recommended'],
      [/クラス/g, ' class'],
      [
        /内蔵GPUを含む幅広いPCで動作/g,
        'Runs on a wide range of PCs, including integrated graphics',
      ],
      [/バックアップ領域/g, 'backup space'],
    ],
    zh: [
      [/メモリ/g, '内存'],
      [/以上/g, '以上'],
      [/必須/g, '（必须）'],
      [/推奨/g, '（推荐）'],
      [/クラス/g, '级'],
      [/内蔵GPUを含む幅広いPCで動作/g, '包括核显在内的多种电脑均可运行'],
      [/バックアップ領域/g, '备份空间'],
    ],
    es: [
      [/メモリ/g, 'RAM '],
      [/以上/g, ' o superior'],
      [/必須/g, ' obligatorio'],
      [/推奨/g, ' recomendado'],
      [/クラス/g, ' aprox.'],
      [
        /内蔵GPUを含む幅広いPCで動作/g,
        'Funciona en muchos equipos, incluso con gráficos integrados',
      ],
      [/バックアップ領域/g, 'espacio para copias'],
    ],
  };
  return replacements[locale].reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
}

export function LocalizedGamePage({
  game,
  locale,
}: {
  game: GameGuide;
  locale: Locale;
}) {
  const ui = copy[locale];
  const local = localizedGames[locale][game.slug];
  const title = locale === 'en' ? englishTitle(game) : game.title;
  const path = (value: string) =>
    locale === 'en'
      ? value.replace('インストール先', 'game installation folder')
      : value;
  const localeCode = locale === 'zh' ? 'zh-CN' : locale;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${title} PC troubleshooting guide`,
    dateModified: game.updated,
    inLanguage: localeCode,
    about: title,
  };
  return (
    <main lang={localeCode}>
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
          <nav className="breadcrumbs">
            <a href={`/${locale}`}>{ui.home}</a>
            <span>/</span>
            <a href={`/${locale}#games`}>{ui.games}</a>
            <span>/</span>
            <b>{locale === 'en' ? title : game.shortTitle}</b>
          </nav>
          <p className="article-label">{ui.articleLabel}</p>
          <h1>{title}</h1>
          <p className="article-lead">{local.lead}</p>
          <div className="article-meta">
            <span>
              {locale === 'en' ? 'Source data last recorded' : ui.lastChecked}{' '}
              {game.updated}
            </span>
            <span>2026</span>
          </div>
        </div>
      </div>
      <div className="article-layout">
        <aside className="toc">
          <strong>{ui.contents}</strong>
          <a href="#save">1. {ui.save}</a>
          <a href="#display">2. {ui.display}</a>
          <a href="#controller">3. {ui.controller}</a>
          <a href="#launch">4. {ui.launch}</a>
          <a href="#mods">5. {ui.mods}</a>
          <a href="#specs">6. {ui.specs}</a>
        </aside>
        <article className="guide-article">
          <div className="safety-note">
            <AlertTriangle size={20} />
            <div>
              <strong>{ui.backupTitle}</strong>
              <p>{ui.backupBody}</p>
            </div>
          </div>
          <section className="evidence-panel" aria-labelledby="evidence-title">
            <div className="evidence-copy">
              <p className="evidence-label">EVIDENCE STATUS</p>
              <h2 id="evidence-title">
                <BarChart3 size={22} />
                {ui.evidence}
              </h2>
              <p>
                {locale === 'en'
                  ? 'This is an editorial troubleshooting checklist, not a benchmark or a confirmed fix for every hardware configuration. Publisher/store information and community references are linked separately below. No success rate or hands-on test is claimed.'
                  : ui.evidenceBody}
              </p>
            </div>
            <div className="evidence-stats">
              <div>
                <span>
                  {locale === 'en' ? 'Linked references' : ui.sourcesChecked}
                </span>
                <b>{game.sources.length}</b>
                <small>{ui.sourceNote}</small>
              </div>
              <div>
                <span>{ui.fixes}</span>
                <b>{locale === 'en' ? 3 : local.fixes.length}</b>
                <small>{ui.fixNote}</small>
              </div>
            </div>
            <p className="evidence-caveat">
              {locale === 'en'
                ? 'An update can change file locations and supported settings. Check the current publisher guidance before modifying files.'
                : ui.caveat}
            </p>
          </section>
          <IssueFeedback gameSlug={game.slug} locale={locale} />
          <Section id="save" icon={<FolderOpen />} title={ui.save}>
            <h3>{ui.saveData}</h3>
            <div className="path-box">
              <code>{path(game.savePath)}</code>
              <PathCopy value={path(game.savePath)} english={locale === 'en'} />
            </div>
            <h3>{ui.config}</h3>
            <div className="path-box">
              <code>{path(game.configPath)}</code>
              <PathCopy
                value={path(game.configPath)}
                english={locale === 'en'}
              />
            </div>
            <p className="tip">{ui.openPath}</p>
            {locale === 'en' ? (
              <p>
                These are Windows locations and may differ by storefront or
                redirected Documents folder. Replace angle-bracket placeholders
                with your own folder or account ID; do not paste placeholders
                literally. If the path does not exist, stop and consult the
                references instead of creating or deleting files. Close the game
                before copying a backup.
              </p>
            ) : null}
          </Section>
          <Section id="display" icon={<MonitorUp />} title={ui.display}>
            <div className="fact-grid">
              <div>
                <span>
                  <Gauge size={17} /> FPS / 21:9 / HDR
                </span>
                <p>{ui.genericDisplay}</p>
              </div>
            </div>
          </Section>
          <Section id="controller" icon={<Gamepad2 />} title={ui.controller}>
            <p>
              {locale === 'en'
                ? 'If a controller is already supported but inputs repeat, disconnect extra controllers and test one connection method at a time. Record the original Steam Input setting before changing it, test in the same menu, then restore it if the problem remains. Check the store listing for supported devices; this checklist does not guarantee support.'
                : ui.genericController}
            </p>
          </Section>
          <Section id="launch" icon={<AlertTriangle />} title={ui.launch}>
            <p>{ui.launchIntro}</p>
            {locale === 'en' ? (
              <>
                <h3>Before you change anything</h3>
                <p>{diagnosticFocus[game.slug]}</p>
                <ol className="fix-list">
                  <li>
                    <span>1</span>
                    <div>
                      <b>Capture a repeatable failure</b>
                      <p>
                        Write down the exact error, game build, storefront, GPU,
                        driver version and the last action before the failure.
                        Retry the same scene once after restarting the game. For
                        connection problems, check publisher service notices
                        first.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>2</span>
                    <div>
                      <b>
                        Check installed files when assets are missing or the
                        game crashes
                      </b>
                      <p>
                        For a Steam-managed installation, open Library → game
                        Properties → Installed Files → Verify integrity of game
                        files. Let it finish, then test the original failure
                        again. Back up user modifications first: verification
                        can replace modified files and is not a save recovery
                        tool. For a separately updating launcher, use its
                        publisher’s repair instructions.
                      </p>
                      <a
                        href="https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Steam Support: file verification
                      </a>
                    </div>
                  </li>
                  <li>
                    <span>3</span>
                    <div>
                      <b>Compare one reversible change</b>
                      <p>
                        If the problem began after a mod or settings change,
                        restore the previous setting or use your mod manager’s
                        clean profile. Preserve the original profile and saves.
                        Retest the same scene; keep the change only if it helps,
                        otherwise restore it. Do not load and overwrite a
                        mod-dependent save during a clean test.
                      </p>
                    </div>
                  </li>
                </ol>
                <h3>Still not working?</h3>
                <p>
                  Stop repeating unsuccessful changes. Send the publisher the
                  exact error, version, hardware, reproduction steps and tests
                  already tried. Remove account identifiers and personal folder
                  names from public logs. Do not download unofficial DLL packs,
                  bypass anti-cheat or disable security software.
                </p>
              </>
            ) : (
              <ol className="fix-list">
                {local.fixes.map((fix, index) => (
                  <li key={fix}>
                    <span>{index + 1}</span>
                    <div>
                      <b>{fix}</b>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Section>
          <Section id="mods" icon={<Puzzle />} title={ui.mods}>
            <h3>MOD</h3>
            <p>{ui.genericMods}</p>
            <h3>
              <Languages size={18} /> Language
            </h3>
            <p>{local.language}</p>
          </Section>
          <Section id="specs" icon={<CheckCircle2 />} title={ui.specs}>
            {locale === 'en' ? (
              <p>
                Use the current official store requirements in the references
                below. Older summaries may omit CPU, RAM, storage or upscaling
                assumptions; they are not a performance guarantee. Compare the
                full requirements with your PC before buying hardware.
              </p>
            ) : (
              <>
                <div className="spec-table">
                  <div>
                    <b>{ui.minimum}</b>
                    <span>{specText(game.specs.minimum, locale)}</span>
                  </div>
                  <div>
                    <b>{ui.recommended}</b>
                    <span>{specText(game.specs.recommended, locale)}</span>
                  </div>
                  <div>
                    <b>{ui.storage}</b>
                    <span>{specText(game.specs.storage, locale)}</span>
                  </div>
                </div>
                <p className="source-note">{ui.requirementsNote}</p>
              </>
            )}
          </Section>
          <section className="sources">
            <h2>{ui.references}</h2>
            {game.sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.url}
              >
                {locale === 'en'
                  ? source.url.includes('pcgamingwiki.com')
                    ? 'PCGamingWiki — community reference'
                    : source.url.includes('store.steampowered.com')
                      ? 'Steam — official store requirements and features'
                      : `Publisher reference — ${new URL(source.url).hostname} (source language may vary)`
                  : source.label}
                <ExternalLink size={15} />
              </a>
            ))}
          </section>
        </article>
      </div>
      <WikiFooter locale={locale} />
    </main>
  );
}
