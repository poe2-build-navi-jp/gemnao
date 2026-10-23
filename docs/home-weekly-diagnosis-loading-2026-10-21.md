# Weekly period and initial diagnosis availability

Base: published `79154a84913d25f790811d05d2a3f70c34a01c57`. Separate local branch `fix/weekly-period-diagnosis-loading`. No previous quality-kit changes. No push/deployment: these additions await separate publication approval.

## Changes

- Homepage weekly banner uses the report slug's strictly validated Monday calendar date, interpreted at JST midnight. Period is [Monday 00:00 JST, next Monday 00:00 JST). It never parses the human-readable period or publication date. Expired reports say 「過去のまとめ」. Cached/static HTML starts with neutral 「週刊まとめ」 and retains the existing explicit date range; hydration, JST midnight and visibility changes refresh the label without requiring a redeploy. Future/invalid dates stay neutral. Report text and URLs are unchanged.
- Shared Japanese header/footer links to the weekly index use neutral 「週刊まとめ」. English home already says “Weekly official-announcement archives”; Chinese/Spanish homes have no weekly-current claim, so no new translated routes or unrelated blocks were added. Label helper supports and tests all four existing languages.
- Diagnosis config starts as unknown, displaying 「診断の稼働状況を確認中です…」. Valid enabled response shows 「診断は稼働中です。」 and permits start; valid disabled response shows 「診断は現在停止中です。」. Network, HTTP, malformed response and 15-second timeout show 「確認不能：診断の稼働状況を確認できません。…」, not stopped. No start/resume UI before confirmed enablement. Late responses after timeout or unmount are ignored. Existing config response validation and build flags remain in force. Config fetch itself is not retried; timeout ignores late results rather than modifying shared request/submission behavior.
- No API, DB, aggregation, intake settings, dependency, permission or billing changes.

## Verification

- PASS: 83 Node tests, 0 failures: existing diagnosis rules/API/availability suites plus 5 new weekly-period tests. JST start/end milliseconds, year rollover, leap-day week, invalid/non-Monday dates, future dates, static fallback, and JA/EN/ZH/ES labels covered.
- PASS: `node scripts/check-home-diagnosis-states-browser.mjs`: 14 synthetic browser scenarios, 375/1440px. Each config request is held pending first; running/stopped/network/HTTP/invalid/timeout-with-late-success then tested. No premature start, late-success enablement or horizontal overflow. Open-page weekly boundary switches in all four languages. Loopback only; no production data or requests.
- PASS: installed `vinext build --prerender-all --prerender-concurrency 1`, then prepare-pages, static-search-assets and OG-card checks with package build's diagnosis environment values. 609 static HTML snapshots, 591 sitemap URLs, 536 OG pages. Only whitespace indentation changed after build.
- PASS: localization check, 340 translated pages; changed-file oxlint and git diff --check.
- PASS: full local pages `/`, `/en`, `/zh`, `/es`, `/diagnose` at 375px, no horizontal overflow; diagnosis pending display then enabled start checked with intercepted config. Japanese home and diagnosis screenshots visually inspected. Initial second-server launch was refused because our existing dev server was running; after restarting that local server with the build flags, an early connection-refused attempt was repeated after it became ready and all five pages passed. No production access.
- Full lint FAILED: 29 existing diagnostics. Full typecheck FAILED: 19 existing diagnostics. Both outputs compared byte-for-byte with the earlier published-base validation logs and were identical: missing installed @playwright/test and consequent implicit-any errors, Discord directory hooks/accessibility issues, floating promises in feedback-stats tests. No new diagnostics. Used installed executables directly because pnpm's environment startup failure was already established; no dependency/settings changes.
- NOT RUN: production/post-deployment verification or unrelated full browser suites. Publication intentionally pending; no approval denial or uncertain mutation.

Logs: `/tmp/gemnao-extra-tests.log`, `/tmp/gemnao-extra-browser.log`, `/tmp/gemnao-extra-build.log`, `/tmp/gemnao-extra-types.log`, `/tmp/gemnao-extra-lint-all.log`. Component screenshots: `.wrangler/home-diagnosis-browser/` (ignored). Full-page mobile evidence: `/workspace/scratch/gemnao-extra-evidence/`.
