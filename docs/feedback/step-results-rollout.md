# Symptom + method + result collection

Status: prepared for review. No production migration, test votes, or deployment performed for this feature.

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

## Authorized operator handoff (not executed)

Do not log into Cloudflare through a browser. Do not create credentials or select a different database. Use an already authorized official execution route, or stop and request one.

1. Independently verify the actual production Pages project, current D1 binding `DB`, account, and database identity. Repository config historically names `gemnao-db`; this is not proof that the current production binding matches. Stop on any mismatch.
2. Read the metadata-only `docs/feedback/schema-preflight.sql` against that verified database. Verify the current schema has the historical columns, and whether any of migration 0004 is already present. Do not replay an uncertain migration: partial/already-applied states need reconciliation.
3. In the same authorized environment, list D1 migrations. Apply only after confirming the historical migrations are recorded and `0004_step_result_reports.sql` is the only pending migration. If any other migration is pending, stop for review. Take note of the provider's available restore point before applying; do not export private tables into the repository.
4. After explicit review/approval, use the official D1 migration operation for this verified binding. No test report POSTs to production.
5. Rerun the same metadata-only preflight SQL as readback. Expected: the old method columns remain, `not_resolved_count` is NOT NULL/default zero, all seven receipt columns exist, and `step_result_receipts_requested_at` is present. Verify the migration registry reports 0004 applied.
6. Only after publication approval, deploy the reviewed commit through the existing site pipeline. Verify the exact remote commit and required CI. Read-only GET of a real existing article should return the new capability flag. Check real HTML/CSS/JS and mobile/desktop UI without clicking reporting buttons. Do not infer launch from source alone.

Example official CLI reads, to be run only after independently verifying the target and existing authorization:

    wrangler d1 info gemnao-db
    wrangler d1 migrations list gemnao-db --remote
    wrangler d1 execute gemnao-db --remote --file docs/feedback/schema-preflight.sql

The reviewed migration application is consequential and intentionally not automated by this change. Use the verified target's normal migration workflow only after approval. If the application must roll back, restore the prior application commit while leaving additive data/schema intact; do not drop receipt/counter data.

## Verification

- `node scripts/check-feedback-input.mjs`
- `node scripts/check-feedback-d1.mjs` (isolated ephemeral Miniflare D1 only)
- `node scripts/check-step-result-client.mjs` (mock transport/storage only)
- `node scripts/check-localized-step-results.mjs` (three-language controls and 40-page canonical ID parity)
- `node scripts/check-step-result-ui.mjs` (shallow JSX/hooks only, not browser QA)
- Project TypeScript, lint, production build, existing support/note/navigation/ranking regressions.

UI widths and real browser flows must be reported separately from these invariant checks. No production availability or visual verification is implied by passing unit tests.
