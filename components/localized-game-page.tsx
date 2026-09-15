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
      [/メモリ/g, 'RAM '],
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
  const localeCode = locale === 'zh' ? 'zh-CN' : locale;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${game.title} PC troubleshooting guide`,
    dateModified: game.updated,
    inLanguage: localeCode,
    about: game.title,
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
            <b>{game.shortTitle}</b>
          </nav>
          <p className="article-label">{ui.articleLabel}</p>
          <h1>{game.title}</h1>
          <p className="article-lead">{local.lead}</p>
          <div className="article-meta">
            <span>
              {ui.lastChecked} {game.updated}
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
              <p>{ui.evidenceBody}</p>
            </div>
            <div className="evidence-stats">
              <div>
                <span>{ui.demand}</span>
                <b>
                  {locale === 'zh' ? '高' : locale === 'es' ? 'Alta' : 'High'}
                </b>
                <small>{ui.demandNote}</small>
              </div>
              <div>
                <span>{ui.sourcesChecked}</span>
                <b>{game.sources.length}</b>
                <small>{ui.sourceNote}</small>
              </div>
              <div>
                <span>{ui.fixes}</span>
                <b>{local.fixes.length}</b>
                <small>{ui.fixNote}</small>
              </div>
            </div>
            <p className="evidence-caveat">※ {ui.caveat}</p>
          </section>
          <IssueFeedback gameSlug={game.slug} locale={locale} />
          <Section id="save" icon={<FolderOpen />} title={ui.save}>
            <h3>{ui.saveData}</h3>
            <div className="path-box">
              <code>{game.savePath}</code>
              <PathCopy value={game.savePath} />
            </div>
            <h3>{ui.config}</h3>
            <div className="path-box">
              <code>{game.configPath}</code>
              <PathCopy value={game.configPath} />
            </div>
            <p className="tip">{ui.openPath}</p>
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
            <p>{ui.genericController}</p>
          </Section>
          <Section id="launch" icon={<AlertTriangle />} title={ui.launch}>
            <p>{ui.launchIntro}</p>
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
                {source.label}
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
