'use client';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { siteConfig } from '@/lib/site-config';

const labels = {
  ja: {
    copy: 'リンクをコピー',
    copied: 'コピーしました',
    fallback: 'コピーできませんでした。以下のURLを選択してコピーできます。',
  },
  en: {
    copy: 'Copy link',
    copied: 'Link copied',
    fallback: 'Could not copy. Select and copy the URL below.',
  },
  zh: {
    copy: '复制链接',
    copied: '已复制链接',
    fallback: '无法复制，请选择并复制下方链接。',
  },
  es: {
    copy: 'Copiar enlace',
    copied: 'Enlace copiado',
    fallback: 'No se pudo copiar. Selecciona y copia la URL de abajo.',
  },
};
export function CopyShareLink({
  path,
  locale = 'ja',
}: {
  path: string;
  locale?: keyof typeof labels;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const t = labels[locale];
  // Deliberately use the supplied public canonical path, never location.href.
  const url = `${siteConfig.url}${path}`;
  return (
    <div className="copy-share-link">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setState('copied');
            trackEvent('share', {
              method: 'copy',
              content_type: 'article',
              item_id: path,
            });
          } catch {
            setState('fallback');
          }
        }}
      >
        <Copy size={16} aria-hidden="true" />
        {t.copy}
      </button>
      <output aria-live="polite">
        {state === 'copied' ? t.copied : state === 'fallback' ? t.fallback : ''}
      </output>
      {state === 'fallback' ? (
        <input
          aria-label={t.copy}
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
        />
      ) : null}
    </div>
  );
}
