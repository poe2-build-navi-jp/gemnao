/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { editorialAuthor } from '@/lib/editorial-identity';
import type { Locale } from '@/lib/i18n';

export function EditorialByline({ locale = 'ja' }: { locale?: 'ja' | Locale }) {
  const labels = {
    ja: { prefix: '編集：', name: editorialAuthor.name },
    en: { prefix: 'Edited by ', name: editorialAuthor.alternateName },
    zh: { prefix: '编辑：', name: 'Gemnao 编辑团队' },
    es: { prefix: 'Edición: ', name: 'equipo editorial de Gemnao' },
  };
  const t = labels[locale];
  const english = locale === 'en';
  return (
    <span>
      {t.prefix}
      <a href={`${english ? '/en' : ''}/about#editorial-team`} hrefLang={english ? 'en' : 'ja'}>
        {t.name}
      </a>
    </span>
  );
}
