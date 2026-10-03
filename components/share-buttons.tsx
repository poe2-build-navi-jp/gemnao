import { CopyShareLink } from '@/components/copy-share-link';
import { siteConfig } from '@/lib/site-config';

// Social links still work without JavaScript; only copy needs a small client component.
export function ShareButtons({
  title,
  path,
  hashtag,
  label,
  locale = 'ja',
}: {
  title: string;
  path: string;
  hashtag?: string;
  label?: string;
  locale?: 'ja' | 'en' | 'zh' | 'es';
}) {
  const labels = {
    ja: {
      heading: '同じ症状の人に共有する',
      nav: 'この記事を共有',
      x: 'Xでポスト',
      line: 'LINEで送る',
      hatena: 'はてブ',
    },
    en: {
      heading: 'Share this guide',
      nav: 'Share this article',
      x: 'Post on X',
      line: 'Share on LINE',
      hatena: 'Hatena',
    },
    zh: {
      heading: '分享此指南',
      nav: '分享此文章',
      x: '分享到 X',
      line: '分享到 LINE',
      hatena: 'Hatena',
    },
    es: {
      heading: 'Compartir esta guía',
      nav: 'Compartir este artículo',
      x: 'Publicar en X',
      line: 'Enviar por LINE',
      hatena: 'Hatena',
    },
  }[locale];
  const url = `${siteConfig.url}${path}`;
  const tag = hashtag?.replace(/[^\p{L}\p{N}_]/gu, '');
  const via = siteConfig.xAccount ? `&via=${siteConfig.xAccount}` : '';
  const links = [
    {
      label: labels.x,
      share: 'x',
      className: 'share-x',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}${tag ? `&hashtags=${encodeURIComponent(tag)}` : ''}${via}`,
    },
    {
      label: labels.line,
      share: 'line',
      className: 'share-line',
      href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
    },
    {
      label: labels.hatena,
      share: 'hatena',
      className: 'share-hatena',
      href: `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ];
  return (
    <nav className="article-share" aria-label={labels.nav}>
      <strong>{label || labels.heading}</strong>
      <div>
        {links.map((link) => (
          <a
            className={link.className}
            data-share={link.share}
            href={link.href}
            key={link.className}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
        <CopyShareLink path={path} locale={locale} />
      </div>
    </nav>
  );
}
