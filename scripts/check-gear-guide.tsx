import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { GearBuyerGuide } from '../components/gear-buyer-guide';
import { gearGuides } from '../lib/gear-guides';
import { gearArticles } from '../lib/gear-articles';
import { discordAudioGrowthArticles } from '../lib/discord-audio-growth-articles';
import { ogCardSpecs } from '../lib/og-cards';

const guide = gearGuides.find((item) => item.slug === 'discord-microphone-guide')!;
assert.ok(guide);
const html = renderToStaticMarkup(<GearBuyerGuide guide={guide} />);
assert.equal((html.match(/data-affiliate-asin=/g) ?? []).length, 1);
assert.match(html, /data-affiliate-position="after-fit-check"/);
assert.match(html, /data-affiliate-path="\/gear\/discord-microphone-guide"/);
assert.match(html, /https:\/\/www.amazon.co.jp\/dp\/B08H6X6G28\?tag=aquaponyo06-22/);
assert.match(html, /rel="sponsored nofollow noopener"/);
assert.ok(html.indexOf('id="compare"') < html.indexOf('id="product-example"'));
assert.ok(html.indexOf('合わない場合・購入前の注意') < html.indexOf('data-affiliate-asin'));
assert.ok(html.indexOf('買い替えは不要') < html.indexOf('data-affiliate-asin'));
const structured = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
assert.deepEqual(structured.map((item: { '@type': string }) => item['@type']), ['BreadcrumbList', 'Article']);
assert.equal(structured[1].about, 'Discord用マイクの選び方と購入前の確認');
assert.ok(!html.includes('AggregateRating'));
const guideLinks = discordAudioGrowthArticles.flatMap((article) => article.causes.flatMap((cause, index) => cause.guideLink ? [{ slug: article.slug, step: index + 1, href: cause.guideLink.href }] : []));
assert.deepEqual(guideLinks, [
  { slug: 'mic-volume-low', step: 5, href: '/gear/discord-microphone-guide' },
  { slug: 'bluetooth-audio-problem', step: 2, href: '/gear/discord-microphone-guide' },
]);
assert.ok(gearArticles.some((article) => article.slug === 'stream-deck-plus-xl'));
assert.ok(ogCardSpecs().some((card) => card.path === '/gear/discord-microphone-guide'));
console.log('Gear guide SSR/content checks passed: one late CTA, truthful schema, two diagnostic links, OG registration.');
