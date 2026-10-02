// Tell search engines about new and updated pages right after a deploy.
//   node scripts/ping-index.mjs [days]   (default: pages changed in 2 days)
// - IndexNow (Bing, Yandex, Naver, Seznam…): sends the changed URLs.
// - WebSub: announces /feed.xml to Google's hub, which Google uses to
//   discover feed updates quickly.
// Google has no URL submission API for ordinary pages; for launch-day
// pages also use Search Console's URL Inspection → Request indexing.
const site = 'https://gemnao.pages.dev';
const key = '8a431ad6b1d387ce80049b38cc6a027a';
const days = Number(process.argv[2] || 2);

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const since = Date.now() - days * 86_400_000;
const urls = [
  ...sitemap.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g),
]
  .filter(([, , lastmod]) => Date.parse(lastmod) >= since)
  .map(([, loc]) => loc);
console.log(`${urls.length} URLs changed in the last ${days} day(s)`);

if (urls.length) {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(site).host,
      key,
      keyLocation: `${site}/${key}.txt`,
      urlList: urls.slice(0, 10000),
    }),
  });
  console.log('IndexNow:', response.status, response.statusText);
}

const hub = await fetch('https://pubsubhubbub.appspot.com/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    'hub.mode': 'publish',
    'hub.url': `${site}/feed.xml`,
  }),
});
console.log('WebSub (Google hub):', hub.status, hub.statusText);
