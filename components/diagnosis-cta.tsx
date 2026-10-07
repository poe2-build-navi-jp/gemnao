'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native navigation isolates diagnosis from loaded ad/analytics scripts. */
import { useEffect, useState } from 'react';
export function DiagnosisCta({ home = false }: { home?: boolean }) {
  const [visible, setVisible] = useState(
    false,
  );
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED !== 'true') return;
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
  if (!visible) return null;
  return (
    <aside
      className={`diagnosis-cta${home ? ' diagnosis-cta-home' : ''}`}
      aria-label="PCゲーム無料トラブル診断"
    >
      <div>
        <p className="diagnosis-cta-eyebrow">PCゲーム無料診断 · β</p>
        <h2>
          {home
            ? 'PCゲームの不具合、次はどこを確認する？'
            : 'いろいろ試したけど、まだ直らない？'}
        </h2>
        <p>症状を選んで、次に確認する場所と対処の順番を整理します。</p>
        <small>登録不要 · インストール不要 · 無料</small>
      </div>
      <a href="/diagnose">無料診断をはじめる →</a>
    </aside>
  );
}
