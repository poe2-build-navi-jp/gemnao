import type { ReactNode } from 'react';
import type { AffiliatePosition } from '@/lib/affiliate-analytics';
import { amazonUrl } from '@/lib/gear-articles';

// Keep this a server-rendered, ordinary anchor: tracking is optional enhancement.
export function AffiliateLink({
  asin,
  articlePath,
  position,
  className,
  children,
}: {
  asin: string;
  articlePath: string;
  position: AffiliatePosition;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={amazonUrl(asin)}
      target="_blank"
      rel="sponsored nofollow noopener"
      data-affiliate-asin={asin}
      data-affiliate-path={articlePath}
      data-affiliate-position={position}
    >
      {children}
    </a>
  );
}
