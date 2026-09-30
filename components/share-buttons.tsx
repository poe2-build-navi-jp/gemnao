import { siteConfig } from '@/lib/site-config';

// Plain links so sharing works without JavaScript and adds no client bundle.
export function ShareButtons({
  title,
  path,
  hashtag,
  label = '同じ症状の人に共有する',
}: {
  title: string;
  path: string;
  hashtag?: string;
  label?: string;
}) {
  const url = `${siteConfig.url}${path}`;
  const tag = hashtag?.replace(/[^\p{L}\p{N}_]/gu, '');
  const via = siteConfig.xAccount ? `&via=${siteConfig.xAccount}` : '';
  const links = [
    {
      label: 'Xでポスト',
      share: 'x',
      className: 'share-x',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}${tag ? `&hashtags=${encodeURIComponent(tag)}` : ''}${via}`,
    },
    {
      label: 'LINEで送る',
      share: 'line',
      className: 'share-line',
      href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
    },
    {
      label: 'はてブ',
      share: 'hatena',
      className: 'share-hatena',
      href: `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ];
  return (
    <nav className="article-share" aria-label="この記事を共有">
      <strong>{label}</strong>
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
      </div>
    </nav>
  );
}
