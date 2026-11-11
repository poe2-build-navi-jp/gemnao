/* oxlint-disable next/no-html-link-for-pages -- Match the existing home page's native navigation. */
import { commonGuides } from '@/lib/common-guides';
import { homeDescription, homeStartChecks } from '@/lib/home-start';
import { homePageUpdatedAt } from '@/lib/home-content';
import { casePath, reportedCases } from '@/lib/reported-cases';
import { siteConfig } from '@/lib/site-config';

export function HomeStart() {
  const links = homeStartChecks.flatMap<{ slug: string; label: string }>((check) => check.links);
  for (const link of links) {
    if (!commonGuides.some((guide) => guide.slug === link.slug && guide.status === 'verified'))
      throw new Error(`Home starting guide is not published: ${link.slug}`);
  }
  const example = reportedCases.find((item) => item.slug === 'wilds-steam-added-dll');
  return (
    <section className="content home-start" aria-labelledby="home-start-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${siteConfig.url}/#webpage`,
            url: `${siteConfig.url}/`,
            name: 'ゲムなお｜PCゲームのお直しWiki',
            description: homeDescription,
            inLanguage: 'ja-JP',
            dateModified: homePageUpdatedAt,
            isPartOf: { '@id': `${siteConfig.url}/#website` },
            publisher: { '@id': `${siteConfig.url}/#operator` },
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: links.map((link, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: link.label,
                url: `${siteConfig.url}/guide/${link.slug}`,
              })),
            },
          }).replace(/</g, '\\u003c'),
        }}
      />
      <div className="section-heading compact-heading">
        <div>
          <p>START HERE</p>
          <h2 id="home-start-title">何から確認するか迷ったら</h2>
        </div>
      </div>
      <p className="home-start-lead">
        症状が似ていても、確認する場所は同じとは限りません。今起きている状態から手順を選び、一度に一つずつ試して結果を比べます。改善しない場合は、記事内の「次の確認」や公式サポートへ進んでください。
      </p>
      <div className="home-start-grid">
        {homeStartChecks.map((check) => (
          <section key={check.title}>
            <h3>{check.title}</h3>
            <p>{check.description}</p>
            <ul>
              {check.links.map((link) => (
                <li key={link.slug}><a href={`/guide/${link.slug}`}>{link.label} →</a></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="home-start-evidence">
        <h3>手順の出典と、試した結果を分けて読む</h3>
        <p>
          公式の案内は各記事の出典に、利用者の体験は個別の記録に示します。
          {example && <><a href={casePath(example)}>Wildsが起動するようになった本人報告</a>は1件の報告で、編集部が独立して再現した結果ではありません。</>}
          確認できた条件と未確認の点を分け、同じ操作で必ず直るとは扱いません。
        </p>
        <a href="/about#editorial-team">編集・出典の方針を見る →</a>
      </div>
    </section>
  );
}
