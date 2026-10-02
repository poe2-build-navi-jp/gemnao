# Diagnostic feedback v1: staging only, collection disabled

Base: production gemunao d8d84b2. Does not depend on unmerged diagnosis PR21.
No production D1, survey aggregates, /my data, authentication, tokens or account
settings were modified. No deployment or migration has been performed.

## Paths and design

- /diagnostic-feedback: manual form or <=4096-byte JSON local import, complete
  allowlisted preview, unchecked consent, explicit send. API status failure keeps
  send/delete disabled. Never claim receipt if persistence fails. Retry keeps the
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
3. Configure FEEDBACK_RATE_LIMIT using Cloudflare's supported rate-limit binding
   for this deployment. Suggested maximum 10 requests/60 seconds per key, including
   global key (global ceiling intentionally small for v1). Do not enable if Pages
   cannot expose this binding; migrate design only after explicit review. Platform
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
