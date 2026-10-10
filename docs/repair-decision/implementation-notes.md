# Repair vs replacement draft — 2026-10-10

- Base: `gemunao` at `3038d0a06f9c2afc7aa176e9e26730f098bdb56f`.
- Main query: パソコン 修理 買い替え. Selected for intent fit. Japan monthly search volume could not be obtained from Semrush because available API units were insufficient; no largest-volume claim is made.
- New `/pc/repair-or-replace` compares settings, performance needs, repair, parts and replacement. Existing `/pc/pc-broken` remains the symptom-isolation article.
- Official Japanese prices checked 2026-10-10. Published labor, manufacturer estimates and configured examples are distinguished. They are neither population averages nor a personal quote.
- The Web questionnaire is self-report. A selected part/work is a consultation candidate, not a confirmed fault. Unknown does not mean healthy; age and a percentage-of-new-price rule do not force replacement.
- Shop handoff is a local text preview, copy and save flow. It is not sent to a shop or server and cannot remove the need for professional examination.
- Existing Windows 0.6 archive was inspected separately: OS/CPU/GPU/RAM/disk capacity and selected Windows events are limited observations, not temperature, SMART, FPS, voltage, physical-damage or memory-hardware tests. The archive, release metadata and hashes are unchanged. New Web answers do not claim to be machine-collected facts.
- Existing diagnosis QA workers, D1 data, migrations, credentials, pending runs and deployment settings are out of scope.
- No production deployment or merge is authorized by this draft.

## Verification

- Production build succeeded: 325 editorial snapshots, 312 sitemap URLs, 244 up-to-date OG cards.
- TypeScript and repository lint passed.
- 109 translated-page/content-parity checks passed.
- 52 deterministic diagnosis, API and SSR/privacy tests passed. New tests cover dangerous symptoms overriding other answers, critical storage, unknown states, manufacturer errors, candidate-only pricing, record migration and local report boundaries.
- Four generated article HTML files checked for head metadata, self-canonical, all language alternates, schema, step anchors, price tables, sitemap entries and existing referenced CSS/JS assets.
- Diagnosis integration gates, noindex/sitemap exclusion, D1 non-access, legacy sharing rejection for new context, and Windows archive identity checks passed.
- Four generated OG cards visually inspected; Spanish summary was shortened to avoid truncation.
- Browser/mobile interaction tests are prepared but **not verified**: Chromium failed before creating a page because the execution sandbox denies its local Unix socket (`socket() failed: Operation not permitted`). The supported elevated attempt hit the same restriction; no sandbox bypass was attempted. No passing mobile visual, clipboard, download, Back/Forward, or real browser privacy result is claimed.
- The browser suite therefore remains a required pre-release check in an environment that supports Chromium. This is a Draft PR, not a release-ready declaration.

### Reproduce the checks

Use the repository's `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm check:localized`, `pnpm test:diagnosis`, plus:

- `node scripts/check-repair-article.mjs`
- `node scripts/check-repair-build.mjs` (after build)
- `node scripts/check-diagnosis-integration.mjs`
- `node scripts/check-windows-download.mjs`
- `DIAGNOSIS_TEST_URL=http://localhost:3027 pnpm exec playwright test --config playwright.diagnosis.config.ts` against a local-beta server
- `TEST_BASE_URL=http://localhost:3027 node scripts/check-repair-browser.mjs`

For this sandbox, the existing `scripts/diagnosis-test-bootstrap.mjs` was used for the unavailable OS network-interface inventory. No production configuration was changed. Browser checks still remain blocked as stated above.

## Independent safety review

A static review found that liquid intrusion/recent wetting was missing from the new danger-choice wording. It now joins the existing stop-use branch before any ordinary troubleshooting, with matching Japanese/English/Chinese/Spanish guidance and a regression assertion. No new data field or collection was added.

The final price list also includes PC Koubou's optional JPY 500 basic diagnostic menu (tax included), making 27 published examples. It is not a comprehensive diagnosis, included repair, universally mandatory charge or a promise that the local handoff removes the shop's inspection. Sources: https://www.pc-koubou.jp/faq/faq_detail.html?id=10569 and https://www.pc-koubou.jp/contents/iiyamapc_support.php?pre=sgi_sup (tax), checked 2026-10-10.
