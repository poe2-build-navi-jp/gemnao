# Diagnostic feedback v1: staging only, collection disabled

Base: production gemunao d8d84b2. Does not depend on unmerged diagnosis PR21.
No production D1, survey aggregates, /my data, authentication, tokens or account
settings were modified. No deployment or migration has been performed.

## Paths and design

- /diagnostic-feedback: manual form or <=4096-byte JSON local import, complete
  allowlisted preview, unchecked consent, explicit send. API status failure keeps
  send/delete disabled. Status exposes independent `enabled` and `canDelete`: intake off or stale cleanup stops new reports but preserves receipt/key deletion when the isolated DB and limiter bindings remain configured. Deletion uses separate per-address/global rate buckets so intake traffic cannot consume its allowance. Never claim receipt if persistence fails. Retry keeps the
  same receipt/key/report; edit creates a new submission and requires consent.
- /api/diagnostic-feedback: no public reports/list/read API. GET exposes only
  enabled status; POST creates; DELETE needs receipt/key. All responses no-store
  and noindex; same-origin JSON requests only. 6144-byte streamed transport cap,
  duplicate JSON-key rejection, field/enums/count caps, parameterized statements.
- Separate FEEDBACK_DB: diagnostic_reports, diagnostic_report_tombstones and
  diagnostic_retention_health only. No migrations at runtime; no existing DB binding.
- Rate-limiter binding required, for both CF-derived IP and a shared global key.
  The app does not persist IP, UA, cookies, paths, free text or raw files. Cloudflare
  itself sees requests: do not promise anonymity from the hosting provider.
- Browser receipt: first 8 hex = UTC creation seconds, next 24 hex = first24 SHA-256 hex of the independently random deletion key. Independent random 32-byte deletion key is stored as SHA-256 only. A new
  submission's receipt expires after 24h (5-minute future-clock tolerance).
  Active receipts idempotent for retention duration. Deletion transaction creates
  30-day receipt/key-hash tombstone even for a not-yet-arrived report (24h receipt freshness required); concurrent POST checks tombstone inside INSERT.
- Rows expire at 30 days; independent hourly cleanup deletes them and updates
  heartbeat. API stops receiving if heartbeat exceeds 2 hours. Expired rows are
  excluded from review. Backups/platform logs follow provider policies, not the
  immediate app deletion guarantee. User-facing copy discloses this limitation.

## Launch checklist (all required; currently BLOCKED)

1. Owner reviews code and approves launch scope. Confirm production/preview
   project and database identities with authorized Cloudflare access. Existing
   access is unavailable; do not generate credentials or bypass bot protection.
2. Provision an isolated preview FEEDBACK_DB only with necessary approval; do NOT
   point FEEDBACK_DB at the existing survey DB. Apply only
   migrations/diagnostic-feedback/0001.sql to this verified target.
3. BLOCKED: the current source requires FEEDBACK_RATE_LIMIT, but Cloudflare's
   published supported Pages bindings do not list a direct Rate Limiting binding.
   Do not assume this source can be activated by adding that binding. Prepare and
   review a Pages-supported design, such as atomic quotas in the isolated D1 DB or
   an explicitly authorized private service-bound Worker. The Workers RateLimit
   API is per-location and eventually consistent: a shared key is NOT a strict
   global ceiling. The intended intake policy is 10 requests/60 seconds per
   network and a separate truly global cap; deletion needs its own quota.
   Neither implementation nor platform cost is approved by this checklist. Platform
   request/CPU billing is not a hard financial cap: owner must verify budget/alerts
   and route-level edge limits before launch. DB additionally caps retained daily
   reports at 200; it does not represent a unique-user count or causal statistic.
4. Deploy cloudflare/diagnostic-feedback-cleanup.ts as a separately authorized
   Worker with the SAME isolated FEEDBACK_DB and hourly cron `0 * * * *`. This is
   prepared code, not a configured or running schedule. Verify actual scheduled
   execution and heartbeat updates; run a controlled expired-row deletion check.
   Configure operator alert on cron failure/stale heartbeat through existing
   authorized monitoring. No secret-protected or unauthenticated HTTP cron endpoint.
5. Set FEEDBACK_ENABLED=true ONLY after preview checks and explicit production
   migration/deployment approval. Root GA and AdSense skip the route; edge wrapper
   adds no-store/noindex/referrer policy and CSP preventing third-party requests.
   Navigate to the form via full document navigation, never SPA Link/prefetch from
   tracked pages (previously loaded analytics cannot be unloaded reliably).
6. Check disabled state, malicious body, cross-origin, limit, D1 failure, stale
   heartbeat, imports, consent, retry, delete/retry, mobile overflow, analytics
   network exclusion and unaffected article survey /my /sitemap /robots /ads.
7. Only after verified live publication enable native link. Until then native
   export works locally and must continue saying reporting is preparing.

No public launch config with a real database ID is committed. wrangler.json and
existing bindings are unchanged. No credentials, secrets or reviewer endpoint.

## Owner review workflow

Use existing authorized D1 access to export only `report_json,created_at` from
unexpired diagnostic_reports. Review locally; do not export deletion hashes or
receipt IDs, publish raw rows, or send them to third-party analytics/LLMs without
new authority. Remove working exports when review is done within the same 30-day
window. An example WHERE clause is `expires_at > unixepoch()`.

Record proposed rule change separately: supported symptom, action, self-report
limitations, alternative explanations, official-source check, and regression tests.
Human approval and versioned release are required. Never automatically change
rankings, claim causation, or invent success rates from these volunteer reports.

## Local verification

`node tests/diagnostic-feedback/run.mjs` bundles TypeScript and tests against real
in-memory SQLite with a D1-compatible adapter. This is not remote D1 verification.
Run project tsc, focused lint, build, prepare-pages and OG manifest check too.
Wrangler preview should use a dedicated local binding configuration, never remote.

## Verification completed in this branch

- 15 test groups passed against SQLite, including persisted retry/delete,
  duplicate keys, strict enums, stale/missing configuration, rate limit,
  storage failure, global retained-row ceiling, and cleanup.
- `tsc --noEmit`, full `oxlint`, `vinext build`, `prepare-pages.mjs`, and
  `generate-og-cards.mjs --check` passed (163 OG pages).
- Wrangler `d1 execute --local` applied all six migration statements successfully
  to dummy database feedback-local-only. No remote command was used. Wrangler
  could not write its usual home-directory log; migration itself returned success.
- Disabled Cloudflare preview checked in the cloud browser: manual preview,
  unchecked/reset consent, permanently disabled send, and native synthetic JSON
  import succeeded. DOM showed only same-origin scripts and no desktop overflow.
  Mobile viewport, complete network capture, enabled submission and retry UI QA
  still require isolated preview bindings; no real report was submitted.

## 2026-10-07 current-source integration (not a launch)

Replayed onto a77bb60383860196a5f7d1503f0008eeccac9b9a. This branch is independent of unmerged diagnosis PR21 and game-request PR45. Current origin-scoped analytics, editorial snapshots, localized pages and production/preview binding isolation are retained. Production config, step-result schema/control workflow and native binaries are unchanged.

- PASS 16 SQLite groups, including ordinary `DB` binding refusal (no fallback for missing `FEEDBACK_DB`).
- PASS typecheck, full lint, 79 localized-page checks, existing article diagnosis and step-result client/UI regression checks.
- PASS build, Pages preparation and OG checks: 285 editorial snapshots, 272 sitemap URLs, 204 OG cards.
- PASS isolated-binding/staged-schema/default-off checks and the actual worker wrapper with a synthetic HTML renderer: no public snapshot, no-store/noindex/referrer policy and same-origin-only CSP.
- These local checks do not verify a real deployed rate-limit binding, Cron, alert, consent/network browser flow, or enabled remote persistence. No such deployment or credential was created.

Integration dependency: if PR21 is also incorporated, preserve the union of `/diagnose`, `/diagnosis` and `/diagnostic-feedback` exclusions in layout analytics, `lib/analytics.ts`, AdSense and the worker security-header dispatch. Each route must remain excluded from public editorial snapshots. Never resolve these files by replacing one feature's exclusions with the other feature's version. Run both suites after combination.

## 2026-10-07 deletion-availability correction

`FEEDBACK_ENABLED` is an intake switch, not an owner-deletion switch. Keep the verified isolated `FEEDBACK_DB` and limiter bindings during an intake shutdown; DELETE remains Origin-checked, body/receipt/key-validated and rate-limited without requiring a fresh cleanup heartbeat. Missing bindings fail closed. The UI uses `canDelete` independently from intake status. Binding removal and full code rollback still require an operator deletion/retention plan. This does not authorize or configure production access.

Validation of the correction: 17 SQLite groups (including intake-off/stale-heartbeat deletion, CSRF/key/binding/rate denials and no resurrection), TypeScript noEmit, full oxlint, worker integration/privacy check, 79 localized pages, full Vinext build/Pages preparation and 204 OG checks passed. The integration check was rerun after build completion because an earlier concurrent invocation saw the temporarily absent generated snapshot manifest. Browser enabled deletion and remote Cloudflare runtime remain unverified.

Final base is 7c930738cd5cd78c68b8fcfbe915893d8ffd60e5, retaining PR84's backup and native privacy corrections. The deletion fix was independently reviewed after implementation: DELETE bypasses intake/heartbeat gates only, keeps isolated storage, per-method rate limits, Origin/body/receipt/key verification and tombstone semantics. Its UI capability is independent of intake. Re-ran all 17 SQLite groups, actual wrapper integration, typecheck/lint, 79 localized pages and full build/Pages/OG successfully on this base (285 snapshots, 272 sitemap URLs, 204 OG cards). Browser/real platform prerequisites remain unverified.

## Verified platform limitation (2026-10-07)

Sources: https://developers.cloudflare.com/pages/functions/bindings/ and https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ . The dormant source and mock limiter tests do not establish a usable Pages binding or a globally exact admission limit. A supported replacement is being prepared separately and must receive code/privacy/concurrency/cleanup review before replacing this candidate. No existing credential or D1-control approval covers new resources or permissions.
