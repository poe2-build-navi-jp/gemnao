import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
const isPublic = process.env.NEXT_PUBLIC_SITE_PUBLIC !== 'false';

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
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      '6RV-7d1vd1Ywq9WTOTVNa7sAVc1pRGcb6F17aJC2wKA',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
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
        {isPublic ? (
          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
