'use client';
/* oxlint-disable next/no-img-element, next/no-html-link-for-pages -- Downloadable editorial PNGs and native share drafts. */
import { useEffect, useState } from 'react';
import { socialGuideAssets, socialGuideUrl } from '@/lib/social-guide-assets';
import { trackEvent } from '@/lib/analytics';
export function SocialGuideAssets() {
  const [lang, setLang] = useState('ja');
  const [message, setMessage] = useState('');
  const [messageAsset, setMessageAsset] = useState('');
  useEffect(() => {
    function selectLinkedAsset() {
      const item = socialGuideAssets.find(
        (asset) => `#${asset.id}` === location.hash,
      );
      if (item) setLang(item.lang);
    }
    selectLinkedAsset();
    window.addEventListener('hashchange', selectLinkedAsset);
    return () => window.removeEventListener('hashchange', selectLinkedAsset);
  }, []);
  useEffect(() => {
    if (location.hash)
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ block: 'start' });
  }, [lang]);
  const en = lang === 'en';
  return (
    <>
      <label>
        画像・投稿文の言語 / Language{' '}
        <select
          value={lang}
          onChange={(e) => {
            setLang(e.target.value);
            setMessage('');
          }}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      <p>
        {en
          ? 'Download an image and copy the matching draft. The X link opens a draft; you choose whether to publish and attach the downloaded image. Links include campaign tags so visits can be measured.'
          : '画像を保存し、対応する投稿文をコピーできます。Xボタンは下書きを開きます。画像の添付と投稿は自分で行ってください。記事へのリンクには流入計測用のタグが付きます。'}
      </p>
      <div className="social-guide-assets">
        {socialGuideAssets
          .filter((item) => item.lang === lang)
          .map((item) => {
            const text = `${item.draft}\n${socialGuideUrl(item)}`;
            return (
              <section key={item.id} id={item.id} lang={lang}>
                <h2>{item.title.replace('\n', ' — ')}</h2>
                <img
                  src={`/images/social-guides/${item.id}.png`}
                  width={1200}
                  height={1200}
                  loading="lazy"
                  alt={`${item.title.replace('\n', ' ')}: ${item.steps.map((s) => `${s.title} — ${s.body}`).join('; ')} ${item.caution}`}
                />
                <p>
                  <a
                    href={`/images/social-guides/${item.id}.png`}
                    download
                    onClick={() =>
                      trackEvent('social_guide_asset_downloaded', {
                        asset_id: item.id,
                      })
                    }
                  >
                    {en ? 'Download image (PNG)' : '画像を保存（PNG）'} ↓
                  </a>
                </p>
                <label>
                  {en ? 'Post draft' : '投稿文'}
                  <textarea readOnly value={text} rows={7} />
                </label>
                <div className="my-pc-actions">
                  <button
                    type="button"
                    onClick={async () => {
                      setMessageAsset(item.id);
                      try {
                        await navigator.clipboard.writeText(text);
                        setMessage(
                          en ? 'Draft copied.' : '投稿文をコピーしました。',
                        );
                        trackEvent('social_guide_draft_copied', {
                          asset_id: item.id,
                        });
                      } catch {
                        setMessage(
                          en
                            ? 'Select and copy the draft above.'
                            : '上の投稿文を選択してコピーしてください。',
                        );
                      }
                    }}
                  >
                    {en ? 'Copy draft' : '投稿文をコピー'}
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.draft)}&url=${encodeURIComponent(socialGuideUrl(item))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {en ? 'Open draft on X' : 'Xで下書きを開く'} ↗
                  </a>
                  <a href={item.path}>
                    {en ? 'Read the full guide' : '記事で条件・手順を読む'} →
                  </a>
                </div>
                <output aria-live="polite">{messageAsset === item.id ? message : ''}</output>
              </section>
            );
          })}
      </div>
    </>
  );
}
