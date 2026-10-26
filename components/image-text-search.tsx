'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native navigation unloads the isolated OCR page. */
import { useEffect, useRef, useState } from 'react';
import { searchInIndex } from '@/lib/search-core';
import { searchEnglishEntries } from '@/lib/english-search';
import type { OcrSearchIndexes } from '@/lib/ocr-search-index';
import { ocrCopy, type OcrLocale } from '@/lib/ocr-copy';
export function ImageTextSearch({ indexes, initialLocale }: { indexes: OcrSearchIndexes; initialLocale: OcrLocale }) {
  const [locale, setLocale] = useState<OcrLocale>(initialLocale);
  const [file, setFile] = useState<File>();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'busy' | 'ready' | 'error' | 'empty' | 'cancelled'>('idle');
  const [progress, setProgress] = useState(0);
  const control = useRef<AbortController | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const dispose = () => { control.current?.abort(); control.current = null; setFile(undefined); setText(''); setQuery(''); setStatus('idle'); if (input.current) input.current.value = ''; };
    window.addEventListener('pagehide', dispose);
    return () => { window.removeEventListener('pagehide', dispose); control.current?.abort(); };
  }, []);
  const t = ocrCopy[locale];
  const busy = status === 'busy';
  const results = query ? locale === 'ja' ? searchInIndex(indexes.ja, query) : searchEnglishEntries(indexes[locale], query) : [];
  function cancel() { control.current?.abort(); control.current = null; setStatus('cancelled'); }
  function clear() { cancel(); setFile(undefined); setText(''); setQuery(''); setStatus('idle'); if (input.current) input.current.value = ''; }
  async function read() {
    if (!file || busy) return;
    const job = new AbortController(); control.current = job;
    setStatus('busy'); setProgress(0); setQuery('');
    try {
      const { validateOcrImage, recognizeLocalImage } = await import('@/lib/browser-ocr');
      await validateOcrImage(file);
      if (job.signal.aborted) return;
      const extracted = await recognizeLocalImage(file, { ja: 'jpn+eng', en: 'eng', zh: 'chi_sim+eng', es: 'spa+eng' }[locale], job.signal, setProgress);
      if (job.signal.aborted) return;
      setText(extracted.trim()); setStatus(extracted.trim() ? 'ready' : 'empty');
    } catch { if (!job.signal.aborted) setStatus('error'); }
    finally { if (control.current === job) control.current = null; }
  }
  return <main className="image-search" lang={locale === 'zh' ? 'zh-CN' : locale}>
    <a href={locale === 'ja' ? '/' : `/${locale}`}>{t.home}</a>
    <h1>{t.title}</h1><p>{t.privacy}</p><p>{t.note}</p>
    <label htmlFor="ocr-language">{t.language}</label>
    <select id="ocr-language" value={locale} disabled={busy} onChange={event => { setLocale(event.target.value as OcrLocale); setQuery(''); }}>
      <option value="ja">日本語</option><option value="en">English</option><option value="zh">简体中文</option><option value="es">Español</option>
    </select>
    <label htmlFor="ocr-file">{t.file}</label>
    <input ref={input} id="ocr-file" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={event => { setFile(event.target.files?.[0]); setStatus('idle'); setText(''); setQuery(''); }} />
    <div className="image-search-actions">
      <button type="button" disabled={!file || busy} onClick={read}>{status === 'error' ? t.retry : t.start}</button>
      {busy && <button type="button" onClick={cancel}>{t.cancel}</button>}
      <button type="button" onClick={clear}>{t.clear}</button>
    </div>
    {busy && <progress aria-label={t.busy} value={progress} max={1} />}
    <output aria-live="polite">{status === 'idle' ? '' : t[status]}{busy ? ` ${Math.round(progress * 100)}%` : ''}</output>
    <form onSubmit={event => { event.preventDefault(); if (!busy && text.trim().length <= 300) setQuery(text.trim()); }}>
      <label htmlFor="ocr-text">{t.text}</label>
      <textarea id="ocr-text" value={text} rows={6} disabled={busy} autoComplete="off" spellCheck={false} onChange={event => { setText(event.target.value); setQuery(''); }} />
      {text.trim().length > 300 && <p role="alert">{t.limit}</p>}
      <button disabled={busy || !text.trim() || text.trim().length > 300}>{t.search}</button>
    </form>
    {query && <section aria-label={t.results}><output>{results.length ? `${t.results}: ${results.length}` : t.none}</output><ul>{results.map(result => <li key={result.href}><a href={result.href}>{result.title}</a></li>)}</ul></section>}
  </main>;
}
