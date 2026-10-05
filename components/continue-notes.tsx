'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native navigation preserves article fragments. */
import { useSavedSolutions, announceMyData } from './use-saved-solutions';
import { SupportUpdates } from './support-workspace';
import { ACTIVE_CASE_KEY } from '@/lib/support-record';
import { supportCopy, type SupportLocale } from '@/lib/support-copy';
import { hasTranslation } from '@/lib/localized';

const titles = { ja: '前回の続き', en: 'Continue where you left off', zh: '继续上次的排查', es: 'Continúa donde lo dejaste' };
export function ContinueNotes({ locale = 'ja' }: { locale?: SupportLocale }) {
  const { items, ready, error } = useSavedSolutions();
  const pending = items.filter(item => item.status !== 'resolved')
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  if (!ready || error || !pending.length) return null;
  const myPath = `${locale === 'ja' ? '' : `/${locale}`}/my-games`;
  return <section className="content recent-troubles continue-notes" aria-label={titles[locale]}>
    <h2>{titles[locale]}</h2>
    <p>{supportCopy[locale].local}</p>
    <div className="recent-trouble-list">
      {pending.slice(0, 3).map(item => {
        const translated = locale !== 'ja' && hasTranslation(locale, item.articlePath);
        const href = item.articlePath
          ? `${translated ? `/${locale}` : ''}${item.articlePath}${item.stepId ? `#${item.stepId}` : ''}`
          : `${myPath}#issue-notebook`;
        return <a href={href} key={item.id} onClick={() => {
          try { localStorage.setItem(ACTIVE_CASE_KEY, item.id); announceMyData(); } catch { /* The article remains available. */ }
        }}><span>{item.title}{locale !== 'ja' && item.articlePath && !translated ? ' (日本語)' : ''}</span><span>{supportCopy[locale].resume} →</span></a>;
      })}
    </div>
    <SupportUpdates locale={locale} createHref={`${myPath}#issue-notebook`} />
  </section>;
}
