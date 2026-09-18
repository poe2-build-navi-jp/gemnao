import { Languages, MonitorCog } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { copy, localeNames, localizedRoot } from '@/lib/i18n';
import { MobileNavigation } from '@/components/mobile-navigation';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */

export function WikiHeader({
  locale = 'ja',
  pagePath = '',
}: {
  locale?: 'ja' | Locale;
  pagePath?: string;
}) {
  const root = localizedRoot(locale);
  const labels =
    locale === 'ja'
      ? {
          games: 'ゲーム一覧',
          basics: 'PC設定の基本',
          about: 'このサイトについて',
        }
      : copy[locale];
  return (
    <header className="site-header">
      <a className="logo" href={root} aria-label="ゲムなお ホーム">
        <span className="logo-mark">
          <MonitorCog size={21} />
        </span>
        <span className="brand-name">
          ゲムなお<em>PCゲームのお直しWiki</em>
        </span>
      </a>
      <nav aria-label="メインナビゲーション">
        <a href={locale === 'ja' ? '/?view=games#games' : `${root}/#games`}>
          {labels.games}
        </a>
        <a href="/guide">{labels.basics}</a>
        <a href="/discord">Discord</a>
        {locale === 'ja' ? <a href="/discord-servers">サーバー募集</a> : null}
        <a href="/about">{labels.about}</a>
      </nav>
      <details className="language-menu">
        <summary aria-label="Language">
          <Languages size={18} />
          <span>{localeNames[locale]}</span>
        </summary>
        <div>
          {(['ja', 'en', 'zh', 'es'] as const).map((item) => {
            const target =
              `${item === 'ja' ? '' : `/${item}`}${pagePath}` || '/';
            return (
              <a
                href={target}
                hrefLang={item === 'zh' ? 'zh-CN' : item}
                key={item}
                aria-current={item === locale ? 'page' : undefined}
              >
                {localeNames[item]}
              </a>
            );
          })}
        </div>
      </details>
      <MobileNavigation
        locale={locale}
        root={root}
        gamesLabel={labels.games}
        basicsLabel={labels.basics}
        aboutLabel={labels.about}
      />
    </header>
  );
}

export function WikiFooter({ locale = 'ja' }: { locale?: 'ja' | Locale }) {
  const text =
    locale === 'ja'
      ? {
          tagline: 'まず試す順番がわかる、日本語のPCゲームお直しWiki。',
          footer: '各ゲーム名・商標は各権利者に帰属します。',
        }
      : copy[locale];
  return (
    <footer className="site-footer" id="footer-nav">
      <div>
        <strong>ゲムなお</strong>
        <p>{text.tagline}</p>
      </div>
      <nav aria-label="フッターナビゲーション">
        <a href="/about">運営情報</a>
        <a href="/privacy">プライバシー</a>
        <a href="/terms">利用規約・免責</a>
        <a href="/discord-servers">Discordサーバー募集</a>
        <a href="/contact">お問い合わせ</a>
      </nav>
      <small>© 2026 ゲムなお。{text.footer}</small>
    </footer>
  );
}
