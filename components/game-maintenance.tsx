/* oxlint-disable next/no-html-link-for-pages -- Existing public editorial links. */
import { maintenanceForGame } from '@/lib/game-maintenance';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { hasTranslation } from '@/lib/localized/index';
const copy = {
  ja: {
    jaGuide: '（日本語）',
    heading: '重点記事の更新記録',
    scope:
      'Wilds・AC8の一部記事を手動管理しています。他ゲームの記事を削除したり、更新がないと判定したりする一覧ではありません。',
    version: '参照版（最新とは未確認）',
    unknown: '未記録',
    date: '記事内の確認日',
    sources: '個別の公式出典',
    verified: '本文を確認',
    title: 'タイトルのみ確認・本文未確認',
    pending: '今回取得できず未確認',
    attempt: '確認を試みた日',
    translations: '各言語の記事と更新確認',
    exists: '記事あり',
    absent: '翻訳なし',
    notReviewed: '出典との整合は未レビュー',
    reviewed: '本文整合レビュー日',
    guide: '現在の記事を読む',
  },
  en: {
    jaGuide: ' (Japanese)',
    heading: 'Focused guide maintenance',
    scope:
      'A manual record for selected Wilds and AC8 guides. Other games remain available; this is not a claim that they have no updates.',
    version: 'Reference version (not verified as latest)',
    unknown: 'Not recorded',
    date: 'Review date stated in the guide',
    sources: 'Specific official references',
    verified: 'Content checked',
    title: 'Title checked; content unverified',
    pending: 'Not retrieved in this review',
    attempt: 'Attempted on',
    translations: 'Language versions and review state',
    exists: 'Article exists',
    absent: 'No translation',
    notReviewed: 'Source parity not reviewed',
    reviewed: 'Content parity reviewed on',
    guide: 'Read the current guide',
  },
  zh: {
    jaGuide: '（日语）',
    heading: '重点文章的更新记录',
    scope:
      '手动管理部分Wilds和AC8文章。其他游戏文章仍保留，这不表示它们没有更新。',
    version: '参考版本（未确认是最新）',
    unknown: '未记录',
    date: '文章中注明的核对日期',
    sources: '具体官方来源',
    verified: '已核对正文',
    title: '仅确认标题，正文未确认',
    pending: '本次未能取得，尚未确认',
    attempt: '尝试核对日期',
    translations: '各语言文章与更新核对状态',
    exists: '文章存在',
    absent: '没有翻译',
    notReviewed: '尚未审核与来源的一致性',
    reviewed: '正文一致性审核日期',
    guide: '阅读当前文章',
  },
  es: {
    jaGuide: ' (japonés)',
    heading: 'Mantenimiento de guías prioritarias',
    scope:
      'Registro manual de algunas guías de Wilds y AC8. Las de otros juegos siguen disponibles; no afirma que carezcan de actualizaciones.',
    version: 'Versión de referencia (sin confirmar como última)',
    unknown: 'No registrada',
    date: 'Fecha de revisión indicada en la guía',
    sources: 'Referencias oficiales específicas',
    verified: 'Contenido comprobado',
    title: 'Título comprobado; contenido sin verificar',
    pending: 'No se pudo obtener en esta revisión',
    attempt: 'Intento de revisión',
    translations: 'Idiomas y estado de revisión',
    exists: 'Existe el artículo',
    absent: 'Sin traducción',
    notReviewed: 'Correspondencia con las fuentes sin revisar',
    reviewed: 'Revisión de correspondencia',
    guide: 'Leer la guía actual',
  },
};
export function GameMaintenance({
  gameSlug,
  locale,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
}) {
  const rows = maintenanceForGame(gameSlug),
    t = copy[locale];
  if (!rows.length) return null;
  return (
    <details className="game-maintenance">
      <summary>{t.heading}</summary>
      <p>{t.scope}</p>
      {rows.map((row) => {
        const local =
          locale !== 'ja' && hasTranslation(locale, row.articlePath);
        return (
          <section key={row.articlePath} aria-label={t.heading}>
            <p>
              {t.version}: {row.referenceVersion || t.unknown}
            </p>
            <p>
              {t.date}: {row.articleCheckedOn || t.unknown}
            </p>
            <p>
              <a
                href={`${local ? `/${locale}` : ''}${row.articlePath}`}
                hrefLang={local ? locale : 'ja'}
              >
                {t.guide}
                {locale !== 'ja' && !local ? t.jaGuide : ''}
              </a>
            </p>
            <h5>{t.sources}</h5>
            <ul>
              {row.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} hrefLang="en" rel="noreferrer">
                    {source.label}
                  </a>
                  <br />
                  {source.status === 'content-checked'
                    ? `${t.verified}: ${source.checkedOn}`
                    : source.status === 'title-only'
                      ? t.title
                      : t.pending}{' '}
                  — {t.attempt}: {source.attemptedOn}
                </li>
              ))}
            </ul>
            <h5>{t.translations}</h5>
            <ul>
              {row.translations.map((item) => (
                <li key={item.locale}>
                  {item.locale}:{' '}
                  {item.exists
                    ? `${t.exists} — ${t.date}: ${item.articleCheckedOn || t.unknown} — ${item.contentReviewedOn ? `${t.reviewed}: ${item.contentReviewedOn}` : t.notReviewed}`
                    : t.absent}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </details>
  );
}
