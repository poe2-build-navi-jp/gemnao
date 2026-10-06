# Symptom + method + result collection

Migration 0004 completed on 2026-10-06 through the reviewed GitHub workflow ([run 37535266119](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/37535266119)). Its strict metadata readback passed. Feature publication and live capability are verified separately from that migration; no production test votes were submitted.

## Scope and semantics

Reuses the existing Japanese InteractiveSteps UI used by game articles, common guides, and Discord articles. Adds compact reporting-only controls to the shared EN/ZH/ES article template (39 existing translated game/Discord pages) and the three canonically matched steps of /en/guide/pc-game-crash. Existing hub feedback stays unchanged. English tools, gear pages, and non-troubleshooting hubs do not get invented result controls. Buttons explicitly represent a tried result; skip links and prerequisite-recognition links are navigation and do not submit results. Private saved-case notes remain separate and local. New-kind negative submissions for the Steam Input recognition prerequisite are rejected by canonical reportability metadata; its explicit actual-game-fixed success remains available.

- `solution_method_feedback.response_count` remains successful reports, including historical reports. Existing rankings and solution images still use this column only.
- Add `not_resolved_count`, starting at zero. An intermediate failure increments only this method counter. A final-STEP failure can also increment the existing article-level struggling counter once per browser, retaining the old final-step semantics. It does not assert that every previous STEP was tried.
- A successful STEP increments article resolved and that method's successful count atomically. They are the same report and must not be added together as independent reports.
- Historical unsuccessful methods cannot be recovered. Existing anonymous historical successes cannot be separated into unique visitors, repeat visitors, or QA/test answers. No new seed votes.
- Counts are self-reported answers, not people, controlled evidence, or a guaranteed fix/success rate. Success and failure collection started at different times; no method-level percentage is calculated.

## Data and retry safety

The new `step-result` API accepts a server-validated article/topic/STEP, outcome, a per-action random UUID, timestamp, and the final-step article-struggling flag. Client labels are not trusted. The transport emits an explicit field whitelist and never sends notebook IDs, notes, settings, logs, screenshots, email, PC details, or the submission token/result to Google Analytics.

`step_result_receipts` binds each token to its article/topic/STEP/outcome/final flag. It is an idempotency receipt, not a visitor/device identifier. A transactional D1 batch first admits one unexpired receipt using database time and a unique token, then increments method and article counters only for that admission. Replays count once and mismatched payloads return 409 without changes. A lost response can be retried with the same token, including after reload when localStorage is available. Memory fallback covers repeat actions/navigation if storage is blocked; reload after blocked storage cannot provide cross-session deduplication. No unique-user or abuse-proof claim is made. New-result POSTs require JSON and a same-origin Origin; an explicitly cross-site Fetch Metadata value is rejected. A transactional cap of 50,000 retained receipts bounds this new storage after expiry cleanup, with a bounded count and no per-IP/device fingerprint. Existing-token retries still work at capacity; new submissions receive honest HTTP 429/retry messaging and do not increment counters. This limits storage, not automated voting by a determined caller.

Receipts older than 30 days are removed on the next new-method result write, using an indexed timestamp. No cron is added. Expired submissions are rejected before writes, including after cleanup, and the UI does not offer an endless retry. Aggregate counts remain. The existing 30-day status-board event retention is unchanged. Privacy copy discloses the additional per-action record and local pending tokens.

A request remains bound to its original article/case/STEP. Late completions cannot change another case's result note. A failed successful-result submission has a separate retry control even when the local solved button is disabled. Aggregate refresh failure never revokes a successful acknowledgement. Private note saving remains available independently of anonymous submission success or duplicate suppression.

## Required additive migration

Review `.openai/drizzle/0004_step_result_reports.sql` and its generated Drizzle schema snapshot. It creates one receipt table and its timestamp index, and adds one default-zero column to the existing method table. It does not rewrite/delete old rows or alter old counter meanings. No runtime schema creation is introduced for the new feature.

The code capability check requires the counter type/default, receipt column types/NOT NULL/sole primary key, known CHECK constraints, and the expected timestamp index definition. Until ready, GET returns `stepResultsAvailable: false`; the UI says method-level unsuccessful collection is unavailable and retains the old flow. A direct new-kind POST returns 503 before any result write. Old GET/POST contracts remain compatible with additive response fields. Loading/failed capability requests never fall through to legacy writes or analytics; local note/navigation actions stay usable. A browser-level pending-answer prompt recovers original submissions after reload or creating/saving a private note.

## Migration completion and publication checks

The approved forward-only baseline preserved all four existing migration-history id/name pairs and appended exactly one 0004 record. The registry structure stayed unchanged; the new method column, receipt table and indexes passed the complete post-migration checks. Existing answers were not compared row by row: preservation is supported by the additive SQL (no answer UPDATE/DELETE), isolated data-preservation fixtures and live structural/history readback.

The unidentified historical migration was not renamed, replayed or treated as proof that 0003 ran. Do not apply the historical migration directory blindly or rerun 0004. Any future database operation must follow the current guarded procedure and fixed-baseline rules in `ops/d1/README.md`, not the earlier manual handoff. The restore checkpoint remains in the authorized run record; no private database export is committed.

Publish only the reviewed feature commit after integrating current production configuration. Future previews have no D1 binding; historical preview URLs may retain old bindings and must not receive test votes. Read-only production GET must confirm the new capability, and real HTML/CSS/JS and language controls must be checked without submitting reports. Do not infer feature launch from migration success alone.

If application rollback is needed, restore prior application code while retaining the additive schema/data. Do not drop receipts or counters as part of code rollback.

## Verification

- `node scripts/check-feedback-input.mjs`
- `node scripts/check-feedback-d1.mjs` (isolated ephemeral Miniflare D1 only)
- `node scripts/check-step-result-client.mjs` (mock transport/storage only)
- `node scripts/check-localized-step-results.mjs` (three-language controls and 40-page canonical ID parity)
- `node scripts/check-step-result-ui.mjs` (shallow JSX/hooks only, not browser QA)
- Project TypeScript, lint, production build, existing support/note/navigation/ranking regressions.

UI widths and real browser flows must be reported separately from these invariant checks. No production availability or visual verification is implied by passing unit tests.
