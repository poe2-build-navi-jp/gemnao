# Dedicated diagnosis storage prerequisite

## Scope and release state

Prepared locally on the exact local-beta tree `45594676b1ec971bcd9fc93c691ad28ba24b030a` (beta `7ef1df53bc9ee4b2c3f9b852dfa4ad30e06d8631`, identical production merge `35e931b3163b85394b7ac7e44ddde9e54f3e6e87`). This is a separate prerequisite, not a change to the approved beta release or permission to enable sharing.

- API storage, shared-page reads and scheduled cleanup require explicit `DIAGNOSIS_DB`. Ordinary site `DB` cannot substitute, even with all diagnosis flags enabled.
- `DIAGNOSIS_STORAGE_ENABLED` remains the independent storage permission. Local-beta config returns before resolving storage; beta blocks public session/create/read/update/events regardless of stale flags. Owner recovery/revocation/deletion still requires verified dedicated storage permission.
- Cleanup imports only `lib/diagnosis/cleanup.ts`. Its function and thirty-day retention constant were copied byte-for-byte from the baseline; the server re-exports it. The transactional delete batch, expiry comparisons and success-only heartbeat are unchanged. Missing binding is a cleanup failure, not a successful heartbeat.
- The cleanup template uses `DIAGNOSIS_DB` with unfilled target placeholders. No production configuration, survey/outcome implementation, request/feedback storage, credentials, `.openai/drizzle`, staged SQL or migration controller was changed.
- Synthetic local fixtures use distinct fake IDs: diagnosis `...0004` gets only staged diagnosis DDL; ordinary site regression `...0005` gets existing site migrations. The fixture explicitly disables local-beta only for dormant sharing API tests and serves copied generated assets with its own config, so Pages cannot silently discover the production beta config.

## Verified locally on 2026-10-07

- 40 diagnosis rules/API/SQLite tests pass, including all-flags-on ordinary-DB refusal, dedicated cleanup with both bindings present, missing-binding cleanup refusal, local-beta precedence and owner deletion permission, and rollback/no heartbeat renewal if the deletion batch fails.
- Worker/config integration checks pass: shared HTML requires the dedicated binding; absent binding never falls back; beta and dormant pages remain private/noindex; conflicting old build flags cannot add diagnosis to sitemap. The cleanup bundle's exact two inputs are the cleanup Worker and dependency-free cleanup module.
- TypeScript and full oxlint pass. Commands use the existing installed executables directly; pnpm's dependency preflight tried to create its unavailable home/store before running scripts.
- Full serial Vinext build, Pages preparation and OG checks pass, including deliberately conflicting `NEXT_PUBLIC_DIAGNOSIS_ENABLED=true` with `NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA=true`: 285 editorial snapshots, 272 sitemap URLs, 204 OG cards. Diagnosis stays outside sitemap. The build emits its existing nonfatal `cloudflare:` prerender warning.
- 79 localized pages and article-diagnosis CTA regression checks pass.

## Verification limits and launch gates

Actual local D1 queries verified that the dummy diagnosis database contains the four diagnosis tables without `issue_feedback`, and the separate dummy ordinary database contains `issue_feedback` without diagnosis tables. The first HTTP attempt then correctly reported local-beta capabilities instead of active sharing because Pages discovered the production config from the served assets directory. The harness now isolates copied assets/config, but its rerun could not be verified under the no-Cloudflare-network restriction: Wrangler's local dev process automatically tries an external `workers.cloudflare.com` Request.cf fetch. Do not count the corrected full D1/Pages/Cron HTTP suite or the final no-D1 beta HTTP check as passed. No restriction was bypassed. Browser UI was not rerun; the known Chromium socket launch restriction remains unresolved.

No remote schema/rows have been inspected. Historical preview/live diagnosis records may exist under the old ordinary binding. Before switching any source or binding, complete the read-only inventory and explicitly approved migration/deletion/retention-continuity plan in [RELEASE-AND-ROLLBACK.md](RELEASE-AND-ROLLBACK.md#dedicated-binding-prerequisite-and-existing-data-continuity-2026-10-07). An empty new database is not proof of no legacy data. Do not automatically copy/delete records or repoint the ordinary DB, and do not orphan existing owner deletion or cleanup during migration/rollback.

Remaining gates: allowed actual HTTP and browser/manual sharing QA, remote inventory, exact schema/continuity review, isolated preview/production database targets, action-time approval for new persistent access, independent cleanup deployment/Cron/heartbeat/retention checks and separately reviewed activation. This prerequisite alone does not make sharing available.
