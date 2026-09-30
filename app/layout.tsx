import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site-config';
import { AdsenseLoader } from '@/components/adsense-loader';
import { AnalyticsLoader } from '@/components/analytics-loader';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
const isPublic = process.env.NEXT_PUBLIC_SITE_PUBLIC !== 'false';
const configuredGoogleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-V2QT94S68G';
const googleAnalyticsId = /^G-[A-Z0-9]+$/.test(configuredGoogleAnalyticsId)
  ? configuredGoogleAnalyticsId
  : '';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ゲムなお｜PCゲームのお直しWiki',
    template: '%s | ゲムなお',
  },
  description:
    'PCゲームの起動トラブル、セーブデータ場所、FPS設定、MOD導入を日本語で解説。',
  icons: { icon: '/favicon.svg' },
  robots: isPublic
    ? { 'max-image-preview': 'large' }
    : { index: false, follow: false, noarchive: true },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      '6RV-7d1vd1Ywq9WTOTVNa7sAVc1pRGcb6F17aJC2wKA',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: siteConfig.name,
    title: 'ゲムなお｜PCゲームのお直しWiki',
    description:
      'PCゲームの起動トラブル、セーブ場所、FPS設定、MOD導入を日本語で解説。',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ゲムなお｜PCゲームのお直しWiki',
    description:
      'PCゲームの起動トラブル、セーブ場所、FPS設定、MOD導入を日本語で解説。',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-7738997902416481';
  return (
    <html lang="ja">
      <head>
        {siteConfig.xAccount ? (
          <meta name="twitter:site" content={`@${siteConfig.xAccount}`} />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${siteUrl}/#website`,
                  name: siteConfig.name,
                  url: siteUrl,
                  description: siteConfig.description,
                  inLanguage: 'ja-JP',
                  publisher: { '@id': `${siteUrl}/#operator` },
                },
                {
                  '@type': 'Organization',
                  '@id': `${siteUrl}/#operator`,
                  name: siteConfig.operatorName,
                  url: `${siteUrl}/about`,
                  email: siteConfig.contactEmail,
                },
              ],
            }),
          }}
        />
        {isPublic ? (
          <meta name="google-adsense-account" content={adsenseClient} />
        ) : null}
        {isPublic && googleAnalyticsId ? (
          <>
            <script
              dangerouslySetInnerHTML={{
                // The admin screens are not counted (see lib/analytics.ts).
                __html: `(function(){var p=location.pathname;
if (p === '/admin' || p.indexOf('/admin/') === 0) return;
window.dataLayer = window.dataLayer || [];
window.gtag = function(){dataLayer.push(arguments);};
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');})();`,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        {children}
        {isPublic ? <AdsenseLoader client={adsenseClient} /> : null}
        {isPublic && googleAnalyticsId ? (
          <AnalyticsLoader id={googleAnalyticsId} />
        ) : null}
      </body>
    </html>
  );
}
