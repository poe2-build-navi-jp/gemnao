'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native navigation isolates diagnosis from loaded ad/analytics scripts. */
import { useEffect, useState } from 'react';
export function DiagnosisCta({ home = false }: { home?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [fallbackFocused, setFallbackFocused] = useState(false);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED !== 'true' && process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA !== 'true') return;
    let live = true;
    void fetch('/api/diagnosis/config', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (live && d && typeof d === 'object' && 'enabled' in d)
          setVisible(d.enabled === true);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  const reserveHomeSlot =
    home &&
    (process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED === 'true' ||
      process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true');
  if (!visible && !reserveHomeSlot) return null;

  // Do not replace the fallback link while a reader is about to activate it.
  const showDiagnosis = visible && !fallbackFocused;

  // Both home cards occupy the same grid cell, including the hidden card.
  // Their natural maximum height is reserved before the runtime gate resolves.
  // A hidden measurement has no link and cannot receive focus.
  const diagnosisCard = (
    <aside
      className={`diagnosis-cta${home ? ' diagnosis-cta-home' : ''}`}
      aria-label="PCゲーム無料トラブル診断"
      aria-hidden={!showDiagnosis || undefined}
      inert={!showDiagnosis}
      style={showDiagnosis ? undefined : { visibility: 'hidden' }}
    >
      <div>
        <p className="diagnosis-cta-eyebrow">PCゲーム無料診断 · β</p>
        <h2>
          {home
            ? 'PCゲームの不具合、次はどこを確認する？'
            : 'いろいろ試したけど、まだ直らない？'}
        </h2>
        <p>症状を選んで、次に確認する場所と対処の順番を整理します。</p>
        <small>端末内の記録のみ · サーバー送信・共有なし · 無料</small>
      </div>
      {showDiagnosis ? (
        <a href="/diagnose">無料診断をはじめる →</a>
      ) : (
        <span className="diagnosis-cta-action">無料診断をはじめる →</span>
      )}
    </aside>
  );
  if (!home) return diagnosisCard;
  return (
    <div className="diagnosis-cta-home-slot">
      {diagnosisCard}
      <aside
        className="diagnosis-cta diagnosis-cta-home"
        aria-label="症状から解決記事を探す"
        aria-hidden={showDiagnosis || undefined}
        inert={showDiagnosis}
        style={showDiagnosis ? { visibility: 'hidden' } : undefined}
      >
        <div>
          <p className="diagnosis-cta-eyebrow">PCゲームのトラブル対策</p>
          <h2>PCゲームの不具合、次はどこを確認する？</h2>
          <p>症状に合う解決記事で、確認する場所と対処の順番を探せます。</p>
          <small>起動・クラッシュ・重い・セーブ・MODなど</small>
        </div>
        {showDiagnosis ? (
          <span className="diagnosis-cta-action">症状から解決記事を探す →</span>
        ) : (
          <a
            href="#symptoms"
            onFocus={() => setFallbackFocused(true)}
            onBlur={() => setFallbackFocused(false)}
          >
            症状から解決記事を探す →
          </a>
        )}
      </aside>
    </div>
  );
}
