import {
  SupportWorkspace,
  SupportUpdates,
} from '@/components/support-workspace';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { GameRequestForm } from '@/components/game-request-form';
import { MyGamesBackup } from '@/components/my-games-backup';
import { MyGamesPanel } from '@/components/my-games-panel';
import { myGamesCopy, type MyGamesLocale } from '@/lib/my-games-copy';
import { myGamesData } from '@/lib/my-games-data';
import { languageTag } from '@/lib/localized/index';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
export function MyGamesPage({ locale = 'ja' }: { locale?: MyGamesLocale }) {
  const t = myGamesCopy[locale];
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath="/my-games" />
      <article className="static-page my-games-page">
        <p className="page-kicker">{t.name}</p>
        <h1>{t.title}</h1>
        <p className="page-lead">{t.lead}</p>
        <p className="my-games-privacy">{t.privacy}</p>
        <MyGamesPanel games={myGamesData(locale)} locale={locale} />
        <p>
          <a href="/tools/game-alerts">
            {
              {
                ja: 'マイゲームの更新通知・RSS購読',
                en: 'Game update alerts and RSS (Japanese)',
                zh: '游戏更新通知与 RSS（日文）',
                es: 'Avisos y RSS de juegos (japonés)',
              }[locale]
            }{' '}
            →
          </a>
        </p>
        <p>
          <a href="/tools/gemnao-cards">
            {
              {
                ja: 'ゲムなおカードで対処を記録・共有',
                en: 'Record and share a Gemnao Card (Japanese)',
                zh: '用 Gemnao 卡片记录与分享（日文）',
                es: 'Registrar y compartir una tarjeta Gemnao (japonés)',
              }[locale]
            }{' '}
            →
          </a>
        </p>
        <MyGamesBackup locale={locale} />
        <SupportWorkspace locale={locale} />
        <SupportUpdates locale={locale} createHref="#issue-notebook" />
        <GameRequestForm locale={locale} />
        <p className="my-games-other">
          <a href="/my#my-reading-list">{t.savedLink} →</a>
        </p>
      </article>
      <WikiFooter locale={locale} />
    </main>
  );
}
