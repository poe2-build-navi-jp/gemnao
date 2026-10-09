# Diagnostic feedback v1: staging only, collection disabled

Base: production gemunao d8d84b2. Does not depend on unmerged diagnosis PR21.
No production D1, survey aggregates, /my data, authentication, tokens or account
settings were modified. No deployment or migration has been performed.

## Paths and design

- /diagnostic-feedback: manual form or <=4096-byte JSON local import, complete
  allowlisted preview, unchecked consent, explicit send. API status failure keeps
  send/delete disabled. Status exposes independent `enabled` and `canDelete`: intake off or stale cleanup stops new reports but preserves receipt/key deletion when the isolated DB and its quota schema remain configured. Deletion uses separate per-network/global quota buckets so intake traffic cannot consume its allowance. Never claim receipt if persistence fails. Retry keeps the
  same receipt/key/report; edit creates a new submission and requires consent.
- /api/diagnostic-feedback: no public reports/list/read API. GET exposes only
  enabled status; POST creates; DELETE needs receipt/key. All responses no-store
  and noindex; same-origin JSON requests only. 6144-byte streamed transport cap,
  duplicate JSON-key rejection, field/enums/count caps, parameterized statements.
- Separate FEEDBACK_DB: diagnostic_reports, diagnostic_report_tombstones and
  diagnostic_retention_health, diagnostic_rate_salt and diagnostic_rate_attempts.
  No migrations at runtime; no existing DB binding or fallback.
- D1 quotas, not a Workers RateLimit binding: GET/POST share a 10-attempt rolling
  60-second intake cap; DELETE has a separate 10-attempt cap. Each admission checks
  both network and global counts atomically. Raw IP, UA, cookies, paths, free text
  and raw files are not persisted. A daily HMAC of the trusted network address is
  briefly stored separately from reports; this is pseudonymous, not anonymous.
  Cloudflare itself sees requests; provider backups/logs have their own retention.
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
3. Review the D1 quota design below and prove it in the isolated preview. No
   FEEDBACK_RATE_LIMIT binding is used: Pages does not document it as supported,
   and the Workers API is per-location/eventually consistent, not a global cap.
   The staged migration includes both quota tables. Platform request/CPU/D1 billing
   is not a hard financial cap: verify owner budgets, alerts and route-level edge
   limits before launch. Requests rejected by D1 still invoke the app/database.
   DB separately caps retained reports created that UTC day at 200; this is not
   a total daily-admission or unique-user count (deletion frees retained capacity).
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
in-memory SQLite with a D1-compatible adapter. `node scripts/check-diagnostic-feedback-d1.mjs`
executes the same candidate migration and quota/service SQL against real local
Miniflare D1, including parallel requests. Neither is remote D1 verification.
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

`FEEDBACK_ENABLED` is an intake switch, not an owner-deletion switch. Keep the verified isolated `FEEDBACK_DB` and quota schema during an intake shutdown; DELETE remains Origin-checked, body/receipt/key-validated and rate-limited without requiring a fresh cleanup heartbeat. Missing bindings fail closed. The UI uses `canDelete` independently from intake status. Binding removal and full code rollback still require an operator deletion/retention plan. This does not authorize or configure production access.

Validation of the correction: 17 SQLite groups (including intake-off/stale-heartbeat deletion, CSRF/key/binding/rate denials and no resurrection), TypeScript noEmit, full oxlint, worker integration/privacy check, 79 localized pages, full Vinext build/Pages preparation and 204 OG checks passed. The integration check was rerun after build completion because an earlier concurrent invocation saw the temporarily absent generated snapshot manifest. Browser enabled deletion and remote Cloudflare runtime remain unverified.

Final base is 7c930738cd5cd78c68b8fcfbe915893d8ffd60e5, retaining PR84's backup and native privacy corrections. The deletion fix was independently reviewed after implementation: DELETE bypasses intake/heartbeat gates only, keeps isolated storage, per-method rate limits, Origin/body/receipt/key verification and tombstone semantics. Its UI capability is independent of intake. Re-ran all 17 SQLite groups, actual wrapper integration, typecheck/lint, 79 localized pages and full build/Pages/OG successfully on this base (285 snapshots, 272 sitemap URLs, 204 OG cards). Browser/real platform prerequisites remain unverified.


## Verified platform limitation (2026-10-07)

Cloudflare's supported Pages binding list does not include direct Workers Rate
Limiting, whose counters are per-location and eventually consistent. The original
mock-limiter candidate therefore could not establish a usable Pages binding or a
strict global limit. The local D1 replacement below removes that dependency while
keeping activation blocked pending code/privacy/operational review. No existing
credential or D1-control approval covers new resources or expanded permissions.
Sources: https://developers.cloudflare.com/pages/functions/bindings/ and
https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ .

## 2026-10-07 supported Pages quota replacement (local, dormant)

This section supersedes the earlier binding-dependent launch design and historical
rate-binding verification gaps. No remote resource or active schedule was created.
Production `wrangler.json`, `.openai/drizzle`, and `ops/d1` are unchanged. The entire
candidate schema remains staged at `migrations/diagnostic-feedback/0001.sql`; this
is a fresh isolated-database migration, not permission to reapply it to a database
that already contains the old candidate. Inventory/reconcile any such preview
schema before a separately approved migration. Never infer a remote schema.

### Atomicity and precise quota semantics

- The only runtime configuration is default-off `FEEDBACK_ENABLED` and isolated
  `FEEDBACK_DB`. There is no configurable weaker fallback, runtime CREATE TABLE,
  new long-lived auth credential, in-memory allowance, or external service.
- D1's own `unixepoch()` anchors admission, rather than edge/client clocks. One
  conditional INSERT checks both counts. D1 batch transaction pruning happens
  before that insert; concurrent requests cannot separately pass a read/check.
- Counts include the second exactly 60 seconds ago; an admitted request occupies
  a slot for normally 60–61 seconds (a delayed batch can deny longer). The INSERT
  counts all rows left by pruning, so even a clock tick between statements cannot
  exceed the 20-row bound. This enforces at most 10 admissions in
  any rolling 60 seconds, without a fixed-minute burst. A UTC day rollover changes
  the HMAC, but never resets the shared global rolling count. Salt changes during
  an in-flight request deny conservatively rather than admit using stale material.
- GET status and POST share intake allowance. Invalid, repeated, conflicting and
  later-failing requests consume admission without a refund. Origin/method/off
  checks run first; those early rejections do not touch quota storage. Rejections
  due to a full quota do not append attempt rows. Successful admission does not
  promise report persistence; the existing receipt/idempotency checks still apply.
- IPv4 uses its canonical address; IPv6 uses a canonical /64; mapped IPv4 aliases
  share the IPv4 bucket. Only Cloudflare's CF-Connecting-IP is accepted. Malformed
  or absent addresses fail closed; body/query/forwarded headers cannot choose
  network keys. Cloudflare header provenance must be verified in preview.
- The global and per-network bounds are both 10, so the global bound dominates the
  current pilot. GET + POST generally use two slots. Shared/NAT networks can affect
  legitimate users. Raising either limit requires fresh capacity/privacy review.
- DELETE has its own same-sized global/network pool and does not need intake on or
  a fresh heartbeat. Intake traffic cannot consume deletion capacity. Malicious
  DELETE traffic can still exhaust its own pool; this is not guaranteed availability
  under attack. Preserve retry instructions and an operator deletion path.
- Missing quota schema, unavailable D1, and failed quota writes fail closed with
  503 before any report mutation. A 429 admits no report mutation. The feature
  switch must stay off until full schema, cleanup and platform checks succeed.

### Retention and privacy

There is one singleton salt row, populated from Web Crypto's 32 random bytes and
replaced at the first request of each UTC day. The HMAC input includes day and
intake/delete scope. Only the HMAC, bucket, random attempt ID and database timestamp
are stored, with no raw IP, receipt, report ID, user agent or free text. Equivalent
network requests are linkable during that day; anyone with both salt and hashes
could test candidate networks, so these are private pseudonymous anti-abuse data.
Do not export either quota table in editorial review or expose them via an API.

Admission pruning keeps at most 20 attempt rows total (10 per independent pool),
even if the hourly job stops. Expired attempts are removed at the next quota check
or by hourly cleanup; quiet-site retention is normally under 61 minutes. The salt
is normally removed/rotated by the next UTC-day request or hourly cleanup (under
25 hours from creation). Inactivity plus cleanup failure can leave these bounded
records longer; do not promise unconditional expiry. Cleanup deletes quota records,
reports and tombstones in one batch before writing its health heartbeat; failure
cannot refresh health. Provider backup/log retention remains separate. Form copy
now discloses the short-lived network HMAC and shared-network limits before consent.

### Cost, abuse and review burden

Quota admission normally costs one indexed salt read and a two-statement D1 batch;
first-of-day salt creation adds an upsert and reread. Later health/report work adds
its existing reads/writes. Even refused attempts execute those quota operations.
The quota protects application admissions and bounded rate-record storage, not
edge requests, CPU, database billing or all service denial. No automatic budget or
alert was configured. Owner-reviewed edge controls and monitoring remain launch
prerequisites; this local change authorizes no paid service or account setting.

At 10 per minute each, intake and deletion can each approach 14,400 admissions per
day (the conservative second boundary lowers sustained throughput). New reports
are separately limited to 200 currently retained from the UTC day, but repeated
retries/status checks also consume quota. Valid pre-cancellation receipts can
create 30-day tombstones: a sustained DELETE load could retain roughly 432,000
small tombstones, even though at most 20 rate rows exist. Review storage/cost and
operator workload before enabling; do not misrepresent the rate table bound as a
bound on all database rows. Owner cancellation/tombstone protections are retained.

### Primary platform references (checked 2026-10-07)

- Pages supported bindings, including D1: https://developers.cloudflare.com/pages/functions/bindings/
- D1 database API and batched statements: https://developers.cloudflare.com/d1/worker-api/d1-database/
- Workers Rate Limiting locality/accuracy limitations: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- Workers node:net compatibility used for strict IP validation: https://developers.cloudflare.com/workers/runtime-apis/nodejs/net/

### Local verification of this replacement

- 19 SQLite groups pass, including existing consent/body/receipt/delete/tombstone
  regressions, UTC rollover during an in-flight quota request, and the exact
  60-second boundary. The same suite passes with wall time fixed to 23:30 UTC.
- 13 real Miniflare D1 groups pass: native SQL time, 40-way same-network and
  40-network global races, independent 40-way DELETE, 20-row bound across a
  between-statement clock tick, UTC rotation, shared status/POST quota, failed
  cleanup transaction rollback, and missing/partial-schema failures.
- The 33 diagnosis tests and full game-request D1 suite pass, as do private worker
  integration, article diagnosis checks and 79 translated-page checks.
- TypeScript noEmit, full oxlint and the full Vinext build/Pages preparation/OG
  check pass: 285 editorial snapshots, 272 sitemap URLs, 204 OG cards. Existing
  installed tool binaries were used; no dependency or package-lock change.
- Independent read-only code/privacy/concurrency review found no production-code
  blockers for the dormant candidate. A test-clock reset issue it found was fixed
  and checked under late-UTC time. No activation, remote D1, real Pages runtime,
  configured Cron/alerts, or enabled browser consent/network flow is established
  by these local results. The launch prerequisites above remain required.
