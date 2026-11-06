export const xmlEscape = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );
export function feedSelection(raw: string, allowed: string[]) {
  const slugs = [...new Set(raw.split(',').filter(Boolean))].sort();
  if (
    !slugs.length ||
    slugs.length > 10 ||
    slugs.some((s) => !allowed.includes(s))
  )
    return null;
  return slugs;
}
export function updatesRss(
  items: {
    game: string;
    title: string;
    date: string;
    source: string;
    path: string;
  }[],
  self: string,
) {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>ゲムなお｜選んだゲームの公式ニュース</title><link>https://gemnao.pages.dev/my-games</link><description>公式Steam告知の見出し。パッチ以外のお知らせも含みます。詳しい内容と対応範囲は公式出典を確認してください。</description><language>ja</language><atom:link href="${xmlEscape(self)}" rel="self" type="application/rss+xml"/>${items.map((i) => `<item><title>${xmlEscape(i.game + '：' + i.title)}</title><guid isPermaLink="false">${xmlEscape(i.source)}</guid><link>https://gemnao.pages.dev${xmlEscape(i.path)}</link><pubDate>${new Date(i.date).toUTCString()}</pubDate><description>${xmlEscape('公式出典：' + i.source + ' / この告知が自分のゲーム版に該当するか確認してください。')}</description></item>`).join('')}</channel></rss>`;
}
