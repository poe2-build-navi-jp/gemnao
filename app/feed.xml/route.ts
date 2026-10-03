import { commonGuides } from '@/lib/common-guides';
import { discordArticles } from '@/lib/discord-articles-all';
import { gameArticles } from '@/lib/game-articles';
import { games } from '@/lib/games';
import { pcArticles } from '@/lib/pc-articles';
import { weeklyReports } from '@/lib/weekly-reports';

// Atom feed of the most recently checked pages. Its URL is announced to
// Google's WebSub hub after a deploy (scripts/ping-index.mjs) so new and
// updated troubleshooting pages are discovered quickly.
const SITE = 'https://gemnao.pages.dev';

const escape = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[char] as string,
  );

export function GET() {
  const gameName = (slug: string) =>
    games.find((game) => game.slug === slug)?.shortTitle ?? '';
  const entries = [
    ...gameArticles
      .filter((item) => !['draft', 'thin'].includes(item.status || 'verified'))
      .map((item) => ({
        title: item.seoTitle,
        summary: item.metaDescription,
        path: `/games/${item.gameSlug}/${item.slug}`,
        updated: item.checkedAt,
        category: gameName(item.gameSlug),
      })),
    ...weeklyReports.map((item) => ({
      title: item.title,
      summary: item.description,
      path: `/weekly/${item.slug}`,
      updated: item.publishedAt,
      category: '今週の不具合まとめ',
    })),
    ...pcArticles.map((item) => ({
      title: item.seoTitle,
      summary: item.description,
      path: `/pc/${item.slug}`,
      updated: item.checkedAt,
      category: 'PC・Windows',
    })),
    ...commonGuides
      .filter((item) => item.status === 'verified')
      .map((item) => ({
        title: item.title,
        summary: item.description,
        path: `/guide/${item.slug}`,
        updated: item.checkedAt,
        category: 'PCゲーム共通',
      })),
    ...discordArticles
      .filter((item) => item.status === 'verified')
      .map((item) => ({
        title: item.seoTitle,
        summary: item.metaDescription,
        path: `/discord/${item.slug}`,
        updated: item.checkedAt,
        category: 'Discord',
      })),
  ]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, 50);
  const updated = `${entries[0]?.updated ?? '2026-10-01'}T00:00:00+09:00`;
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">
  <title>ゲムなお｜PCゲームのお直しWiki</title>
  <subtitle>PCゲーム・Windows・Discordの不具合と対処法（新着・更新順）</subtitle>
  <id>${SITE}/</id>
  <link rel="self" href="${SITE}/feed.xml"/>
  <link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
  <link href="${SITE}/"/>
  <updated>${updated}</updated>
  <author><name>ゲムなお編集部</name></author>
${entries
  .map(
    (entry) => `  <entry>
    <title>${escape(entry.title)}</title>
    <id>${SITE}${entry.path}</id>
    <link href="${SITE}${entry.path}"/>
    <updated>${entry.updated}T00:00:00+09:00</updated>
    <category term="${escape(entry.category)}"/>
    <summary>${escape(entry.summary)}</summary>
  </entry>`,
  )
  .join('\n')}
</feed>
`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
}
