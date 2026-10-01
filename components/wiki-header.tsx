/* oxlint-disable next/no-img-element -- Tiny static logo uses the same asset as the favicon. */
import { Languages, Search } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { copy, localeNames, localizedRoot } from '@/lib/i18n';
import { MobileNavigation } from '@/components/mobile-navigation';
import { hasTranslation } from '@/lib/localized/index';
import { ui } from '@/lib/localized/ui';
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
        // The visible brand text is the accessible name (a different
        // aria-label fails WCAG "label in name").
      >
        <span className="logo-mark">
          <img
            src="/favicon.svg"
            alt=""
            width={38}
            height={38}
            aria-hidden="true"
          />
        </span>
        <span className="brand-name">
          {locale === 'ja' ? 'ゲムなお' : 'Gemnao'}
          <em>
            {locale === 'ja' ? 'PCゲームのお直しWiki' : ui[locale].brandTagline}
          </em>
        </span>
      </a>
      <nav
        aria-label={
          locale === 'ja' ? 'メインナビゲーション' : ui[locale].mainNav
        }
      >
        <a href={locale === 'ja' ? '/?view=games#games' : `${root}/#games`}>
          {labels.games}
        </a>
        {locale === 'ja' ? <a href="/#symptoms">症状から探す</a> : null}
        {locale === 'ja' ? <a href="/status">障害情報</a> : null}
        <a href="/guide">
          {labels.basics}
          {locale === 'ja' ? '' : ui[locale].inJapanese}
        </a>
        <a href="/discord">
          Discord{locale === 'ja' ? '' : ui[locale].inJapanese}
        </a>
        <a href="/pc">
          {locale === 'ja'
            ? 'PC・Windows'
            : `${ui[locale].pcWindows}${ui[locale].inJapanese}`}
        </a>
        {locale === 'ja' ? (
          <a href="/discord-servers">Discordサーバー</a>
        ) : null}
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
            {ui[locale].inJapanese}
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
            // Link to the same page in that language when it exists,
            // otherwise to that language's home page.
            const target =
              item === 'ja'
                ? pagePath || '/'
                : hasTranslation(item, pagePath)
                  ? `/${item}${pagePath}`
                  : `/${item}`;
            return (
              <a
                href={target}
                hrefLang={item === 'zh' ? 'zh-Hans' : item}
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
  if (locale !== 'ja') {
    const t = ui[locale];
    const link = (href: string, label: string) => (
      <a href={href}>
        {label}
        {t.inJapanese}
      </a>
    );
    return (
      <footer className="site-footer" id="footer-nav">
        <div>
          <strong>Gemnao</strong>
          <p>{t.footerTagline}</p>
        </div>
        <nav aria-label={t.footerNav}>
          {link('/about', t.about)}
          {link('/privacy', t.privacy)}
          {link('/terms', t.terms)}
          {link('/discord-servers', t.discordServers)}
          {link('/pc', t.pcWindows)}
          {link('/contact', t.contact)}
        </nav>
        <small>© 2026 Gemnao. {t.trademarks}</small>
      </footer>
    );
  }
  return (
    <footer className="site-footer" id="footer-nav">
      <div>
        <strong>ゲムなお</strong>
        <p>まず試す順番がわかる、日本語のPCゲームお直しWiki。</p>
      </div>
      <nav aria-label="フッターナビゲーション">
        <a href="/about">運営情報</a>
        <a href="/privacy">プライバシー</a>
        <a href="/terms">利用規約・免責</a>
        <a href="/status">障害・メンテ情報</a>
        <a href="/tools">便利ツール</a>
        <a href="/discord-servers">Discordサーバー募集</a>
        <a href="/pc">PC・Windowsの不具合</a>
        <a href="/gear">ゲーマー向けデバイス</a>
        <a href="/contact">お問い合わせ</a>
      </nav>
      <small>
        © 2026 ゲムなお。各ゲーム名・商標は各権利者に帰属します。
        Amazonのアソシエイトとして、ゲムなおは適格販売により収入を得ています。
      </small>
    </footer>
  );
}
