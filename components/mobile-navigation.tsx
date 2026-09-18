'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */

import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <div className="mobile-navigation">
      <button
        className="mobile-menu"
        type="button"
        aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
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
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
          />
          <aside
            className="mobile-navigation-panel"
            id="mobile-navigation-panel"
            aria-label="スマートフォンメニュー"
          >
            <p>主要ページ</p>
            <nav>
              <a href={root}>ホーム</a>
              {locale === 'ja' ? (
                <a href="/#site-search">ゲーム名・症状を検索</a>
              ) : null}
              <a
                href={locale === 'ja' ? '/?view=games#games' : `${root}/#games`}
              >
                {gamesLabel}
              </a>
              {locale === 'ja' ? <a href="/#symptoms">症状から探す</a> : null}
              {locale === 'ja' ? (
                <a href="/?view=articles#articles">解決記事一覧</a>
              ) : null}
              <a href="/guide">{basicsLabel}</a>
              <a href="/discord">Discordトラブル</a>
              {locale === 'ja' ? (
                <a href="/discord-servers">Discordサーバー募集</a>
              ) : null}
              {locale === 'ja' ? (
                <a href="/discord-servers/submit">サーバーを掲載する</a>
              ) : null}
              <a href="/about">{aboutLabel}</a>
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
