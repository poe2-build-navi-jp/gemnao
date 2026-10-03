'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */

import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { myGamesCopy, myGamesPath } from '@/lib/my-games-copy';
import { ui } from '@/lib/localized/ui';

type MobileNavigationProps = {
  locale: 'ja' | 'en' | 'zh' | 'es';
  root: string;
  gamesLabel: string;
  basicsLabel: string;
  aboutLabel: string;
};

export function MobileNavigation({
  locale,
  root,
  gamesLabel,
  basicsLabel,
  aboutLabel,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <div className="mobile-navigation">
      <button
        ref={triggerRef}
        className="mobile-menu"
        type="button"
        aria-label={
          locale === 'ja'
            ? open
              ? 'メニューを閉じる'
              : 'メニューを開く'
            : open
              ? ui[locale].closeMenu
              : ui[locale].openMenu
        }
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open ? (
        <>
          <button
            className="mobile-navigation-backdrop"
            type="button"
            aria-label={
              locale === 'ja' ? 'メニューを閉じる' : ui[locale].closeMenu
            }
            onClick={() => setOpen(false)}
          />
          <aside
            className="mobile-navigation-panel"
            id="mobile-navigation-panel"
            aria-label={
              locale === 'ja' ? 'スマートフォンメニュー' : ui[locale].mobileNav
            }
          >
            <p>{locale === 'ja' ? '主要ページ' : ui[locale].explore}</p>
            <nav>
              <a href={root}>{locale === 'ja' ? 'ホーム' : ui[locale].home}</a>
              {locale === 'ja' ? (
                <a href="/#site-search">ゲーム名・症状を検索</a>
              ) : null}
              <a
                href={locale === 'ja' ? '/?view=games#games' : `${root}/#games`}
              >
                {gamesLabel}
              </a>
              {locale === 'ja' ? <a href="/#symptoms">症状から探す</a> : null}
              {locale === 'ja' ? <a href="/status">障害・メンテ情報</a> : null}
              {locale === 'ja' ? <a href="/my">マイページ</a> : null}
              <a href={myGamesPath(locale)}>{myGamesCopy[locale].name}</a>
              {locale === 'ja' ? <a href="/tools">便利ツール</a> : null}
              {locale === 'en' ? (
                <a href="/en/tools">Tools and Windows diagnosis</a>
              ) : null}
              {locale === 'en' ? <a href="/en#tools">Recent guides</a> : null}
              {locale === 'ja' ? (
                <a href="/?view=articles#articles">解決記事一覧</a>
              ) : null}
              <a href="/guide">
                {basicsLabel}
                {locale === 'ja' ? '' : ui[locale].inJapanese}
              </a>
              <a href="/discord">
                {locale === 'ja'
                  ? 'Discordトラブル'
                  : `Discord${ui[locale].inJapanese}`}
              </a>
              <a href="/pc">
                {locale === 'ja'
                  ? 'PC・Windowsの不具合'
                  : `${ui[locale].pcWindows}${ui[locale].inJapanese}`}
              </a>
              {locale === 'ja' ? (
                <a href="/discord-servers">Discordサーバー募集</a>
              ) : null}
              {locale === 'ja' ? (
                <a href="/discord-servers/submit">サーバーを掲載する</a>
              ) : null}
              <a href="/about">
                {aboutLabel}
                {locale === 'ja' ? '' : ui[locale].inJapanese}
              </a>
            </nav>
            {locale === 'ja' ? (
              <a className="mobile-admin-link" href="/admin/discord-servers">
                管理者用：掲載審査
              </a>
            ) : null}
          </aside>
        </>
      ) : null}
    </div>
  );
}
