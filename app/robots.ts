import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const isPublic = process.env.NEXT_PUBLIC_SITE_PUBLIC !== 'false';
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
  return {
    rules: isPublic
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: isPublic ? [`${base}/sitemap.xml`, `${base}/image-sitemap.xml`] : undefined,
  };
}
