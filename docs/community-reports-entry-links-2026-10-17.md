# Reports entry links — 2026-10-17

Home and game hubs with articles now reuse ReportEntryLink as a visible report card. Existing article links use a clearer label without adding a second entry. All four languages explain editorial review and source/evidence checks; submissions are not automatically published. Ordinary anchors preserve article/game context. Reports noindex, runtime configuration, cleanup, bindings and article content are unchanged.

Validation: focused Chromium checks pass for JA/EN/ZH/ES home/game/article links, query context, 360/1280px layout, 44px targets and focus. Changed-file oxlint and diff whitespace checks pass. The full production build chain passes (prerender, prepare-pages, static search assets, OG check: 357 pages). TypeScript passes excluding the two pre-existing Playwright files whose package is unavailable in this environment. Generated snapshots contain the CTA on three localized homes and all four Overwatch 2 hubs; Japanese home uses the existing dynamic route.

Public browser verification is delegated to the parent browser: home/hub/article and report navigation, mobile layout, referenced CSS/JS HTTP 200. This environment's previously blocked production access is not retried. No report was submitted by these tests.

Reference: https://developers.google.com/search/docs/crawling-indexing/links-crawlable (crawlable anchors and descriptive link text; no ranking claim).
