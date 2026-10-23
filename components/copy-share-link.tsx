'use client';
import { Copy } from 'lucide-react';
import { useRef, useState } from 'react';
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
  text,
}: {
  path: string;
  text?: string;
  locale?: keyof typeof labels;
}) {
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const t = labels[locale];
  // Deliberately use the supplied public canonical path, never location.href.
  const url = `${siteConfig.url}${path}`;
  return (
    <div className="copy-share-link">
      {text && (
        <label>
          {locale === 'ja'
            ? '返信テンプレートのプレビュー（個人情報なし）'
            : 'Reply template preview (no personal data)'}
          <textarea
            readOnly
            rows={7}
            value={text}
          />
        </label>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          if (lock.current) return;
          lock.current = true;
          setBusy(true);
          try {
            await navigator.clipboard.writeText(text ?? url);
            setState('copied');
            if (!text)
              trackEvent('share', {
                method: 'copy',
                content_type: 'article',
                item_id: path,
              });
          } catch {
            setState('fallback');
          } finally {
            lock.current = false;
            setBusy(false);
          }
        }}
      >
        <Copy size={16} aria-hidden="true" />
        {text
          ? locale === 'ja'
            ? '返信テンプレートをコピー'
            : 'Copy reply template'
          : t.copy}
      </button>
      <output aria-live="polite">
        {state === 'copied'
          ? text
            ? locale === 'ja'
              ? 'コピーしました'
              : 'Copied'
            : t.copied
          : state === 'fallback'
            ? text
              ? locale === 'ja'
                ? 'コピーできませんでした。プレビューを選択して手動でコピーしてください。'
                : 'Copy failed. Select and copy the preview manually.'
              : t.fallback
            : ''}
      </output>
      {state === 'fallback' && !text ? (
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
