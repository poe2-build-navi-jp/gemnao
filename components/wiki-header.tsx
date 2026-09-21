import { Languages, MonitorCog, Search } from 'lucide-react';
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
      <a
        className="logo"
        href={root}
        aria-label={locale === 'en' ? 'Gemnao home' : 'ゲムなお ホーム'}
      >
        <span className="logo-mark">
          <MonitorCog size={21} />
        </span>
        <span className="brand-name">
          {locale === 'en' ? 'Gemnao' : 'ゲムなお'}
          <em>
            {locale === 'en'
              ? 'PC game troubleshooting'
              : 'PCゲームのお直しWiki'}
          </em>
        </span>
      </a>
      <nav
        aria-label={
          locale === 'en' ? 'Main navigation' : 'メインナビゲーション'
        }
      >
        <a href={locale === 'ja' ? '/?view=games#games' : `${root}/#games`}>
          {labels.games}
        </a>
        {locale === 'ja' ? <a href="/#symptoms">症状から探す</a> : null}
        <a href="/guide">
          {labels.basics}
          {locale === 'en' ? ' (Japanese)' : ''}
        </a>
        <a href="/discord">Discord{locale === 'en' ? ' (Japanese)' : ''}</a>
        {locale === 'ja' ? <a href="/discord-servers">サーバー募集</a> : null}
        {locale === 'ja' ? (
          <a
            className="header-search-link"
            href="/#site-search"
            aria-label="ゲーム名・症状を検索"
            title="ゲーム名・症状を検索"
          >
            <Search size={18} aria-hidden="true" />
          </a>
        ) : (
          <a href="/about">
            {labels.about}
            {locale === 'en' ? ' (Japanese)' : ''}
          </a>
        )}
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
        <strong>{locale === 'en' ? 'Gemnao' : 'ゲムなお'}</strong>
        <p>{text.tagline}</p>
      </div>
      <nav
        aria-label={
          locale === 'en' ? 'Footer navigation' : 'フッターナビゲーション'
        }
      >
        <a href="/about">{locale === 'en' ? 'About (Japanese)' : '運営情報'}</a>
        <a href="/privacy">
          {locale === 'en' ? 'Privacy (Japanese)' : 'プライバシー'}
        </a>
        <a href="/terms">
          {locale === 'en' ? 'Terms (Japanese)' : '利用規約・免責'}
        </a>
        <a href="/discord-servers">
          {locale === 'en'
            ? 'Discord servers (Japanese)'
            : 'Discordサーバー募集'}
        </a>
        <a href="/contact">
          {locale === 'en' ? 'Contact (Japanese)' : 'お問い合わせ'}
        </a>
      </nav>
      <small>
        © 2026 {locale === 'en' ? 'Gemnao. ' : 'ゲムなお。'}
        {text.footer}
      </small>
    </footer>
  );
}
