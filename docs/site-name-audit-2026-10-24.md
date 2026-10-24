# Site-name consistency review — 2026-10-24

Base: production commit `d637523949e770434e35246f30f1de5ad2e617b7`. Separate from VALORANT PR134. Draft only.

## Findings and minimal changes

- JA home title, H1, visible header/footer, `og:site_name` and `WebSite.name` already agree on **ゲムなお**. Keep them unchanged; do not stuff all aliases into headings or article titles.
- The existing `WebSite.alternateName` contains only Gemnao. Add the reading げむなお alongside Gemnao in that same node, not a second WebSite entity. The shared JA description makes the aliases visible naturally on home/about and in the home metadata.
- EN/ZH/ES home titles and header/footer use Gemnao consistently. Their nested Open Graph metadata omits `site_name` in built HTML. Set it explicitly to the site's primary name while retaining localized titles and visible Gemnao branding. All languages share the same root WebSite identity; no language-specific site entities.
- The publisher is **オカピ研究所**, not another spelling of the site. Keep its existing `#operator` identity and `/about` URL. Add its already-public English rendering, **Okapi Research Institute**, as the operator's alias, matching `/en/about`. Do not rename the operator to the site brand or invent a legal name.
- Existing editorial author **ゲムなお編集部**, publisher references, about-page relationships and internal brand links need no replacement. JA home links use ゲムなお, localized home links use Gemnao. About/policy anchors remain descriptive.
- WebSite URL remains the canonical site origin. Article URLs, canonical/hreflang, robots, GA, DB, intake and notification settings are unchanged. No sameAs, review markup, invented third-party mentions or AI-specific schema added.

## Evidence and limitations

Official sources reviewed:
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/structured-data/organization
- https://developers.google.com/search/docs/appearance/ai-features

Google uses home-page signals and WebSite data to determine site names automatically; aliases express preferences. AI Overview inclusion is a separate decision and does not require special AI markup. These changes do not prove the cause of a query-specific display difference or guarantee inclusion.

The reported Google display difference was not independently observed. No search screenshot or live-page inspection is claimed. Prior live-fetch restrictions were not bypassed. Local HTML checks are not proof of Google crawling or browser layout.

After a separately approved publication: verify deployed HTML, then use Search Console URL Inspection for the root homepage and request recrawling if appropriate. Allow recrawl/reprocessing time (potentially days or weeks); do not promise a date. Compare the two queries with date, language, region and device recorded. No Search Console submission was performed here.

## Validation

- Build, TypeScript and scoped lint.
- `TEST_ORIGIN=http://127.0.0.1:3127 node scripts/check-site-name.mjs /workspace/gemnao-mw4`: built local root plus static localized/about/article HTML. One WebSite entity; primary and alternate names; publisher separation; visible aliases; home title/H1/OG.
- Baseline comparison: all 632 editorial paths retain canonical/hreflang; 616-URL sitemap unchanged. Baseline tree is production's `bcf41c4aed9b6e179475a011af430751797f1a4d`.
- No article titles added or changed; existing OG cards remain valid.
