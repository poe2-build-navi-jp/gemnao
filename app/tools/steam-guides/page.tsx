import type { Metadata } from 'next';
import { WikiHeader, WikiFooter } from '@/components/wiki-header';
import { SteamGuidePublisher } from '@/components/steam-guide-publisher';
import { steamGuideDraft, steamGuideTargets } from '@/lib/steam-guide-export';
import { steamAppIds } from '@/lib/status/sources';
import { gameBySlug } from '@/lib/games';
export const metadata: Metadata = {
  title: 'Steam向けゲムなおガイド原稿｜ゲムなお',
  description:
    'モンハンワイルズ・パルワールド・エルデンリングの確認ガイドをSteam用BBCodeで用意。出典付きの本文を確認・保存できます。',
  alternates: { canonical: '/tools/steam-guides' },
  robots: { index: false, follow: true },
};
export default function Page() {
  const drafts = steamGuideTargets.flatMap((t) =>
    (['ja', 'en'] as const).flatMap((l) => {
      const d = steamGuideDraft(t.game, l);
      return d ? [d] : [];
    }),
  );
  const choices = steamGuideTargets
    .filter((t) => drafts.some((d) => d.game === t.game))
    .map((t) => ({
      slug: t.game,
      title: gameBySlug(t.game)!.shortTitle,
      appId: steamAppIds[t.game],
    }));
  return (
    <main>
      <WikiHeader pagePath="/tools/steam-guides" />
      <article className="static-page">
        <p className="page-kicker">STEAM COMMUNITY GUIDES</p>
        <h1>Steam向けガイド原稿</h1>
        <SteamGuidePublisher drafts={drafts} choices={choices} />
      </article>
      <WikiFooter />
    </main>
  );
}
