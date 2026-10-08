# Temporary access gate for the existing diagnostic QA Worker

## Scope and current state

This draft adds only an outer HTTP Basic access gate to the isolated QA wrapper,
local synthetic regression tests, a secretless PR check, and a separate protected existing-ID update controller. It does not deploy,
enable collection, provision a credential, change GitHub protection, or alter
production. The source is based on PR 98 / a2f963b; the separate sharing-consent and
pending-recovery changes from PR 105 must be reviewed and integrated before hosted
data QA. PR 105's reviewed consent/recovery head is 8244ca4cf709f7e1cd4c8d9a29787d23d5db82f8. Future integration must preserve the PR 98 DIAGNOSIS_DB isolation and runtime-configured privacy component while incorporating the new retention/recovery wording. Never merge it straight over this isolated source without rechecking those differences. Do not merge PR 90 and PR 98 as independent duplicate implementations.

Fixed future deployment target:
- Account: 6a09a32cba1288cccce5912015086a35
- Worker: gemnao-diagnostic-qa
- Immutable Worker ID: 4cde2e6602024e6b9650d26b28955010
- Origin: https://gemnao-diagnostic-qa.soykururu143.workers.dev
- DIAGNOSIS_DB: 72c728f5-1656-4e26-bc11-7c508ae155c3
- FEEDBACK_DB: 3a714aee-e602-4590-afd0-3c2ddd9aea8f

The production DB 385a194f-5119-4bbe-9afe-2e6ce4ceb341, ordinary Pages application,
existing response data, and both cleanup Workers are excluded.

## Owner-only credential handoff

1. Open the existing repository Environment settings:
   https://github.com/poe2-build-navi-jp/gemnao/settings/environments/23658815122/edit
2. In **Environment secrets**, the owner adds exactly one new secret:
   **GEMNAO_QA_ACCESS_PASSPHRASE**. Do not use the similarly named Environment
   variables section, repository secrets, or organization secrets.
3. The owner uses their password manager / trusted random generator to make a
   unique disposable token with at least 128 bits of randomness, preferably
   32 random bytes encoded as printable ASCII. The implementation accepts
   43–128 ASCII characters (no spaces/control characters). Length validation
   cannot establish randomness: a human-chosen phrase or reused password is not
   acceptable with the SHA-256 verifier.
4. The owner enters and saves that token in the dedicated GitHub secret field.
   No assistant generates, asks for, reads, copies, or types the real value.
   Never send it through chat, issues, PRs, screenshots, URLs, logs, or files.
   Do not reuse GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN.
5. After a separately reviewed deployment and owner approval, the owner opens
   the exact QA origin in a dedicated private browser session. Its native Basic
   authentication prompt uses username **qa** and the same disposable token.
   The browser may cache/resend Basic credentials; this is not application-
   controlled logout. Close the private session after use. Do not save it in a
   shared browser. The server-side expiry remains authoritative.
6. Remove the temporary GitHub access secret after the test window through a
   separately authorized owner action. Never remove/rotate the infrastructure
   Cloudflare token as part of this task.

No actual credential value belongs in this document or PR.

## Gate behavior

The final Worker export authenticates before calling the existing preview
wrapper, so root redirects, assets, API routes, robots.txt, HEAD and OPTIONS are
covered. Keep assets.run_worker_first=true, preview URLs disabled, and no custom
routes/domains. Existing exact-origin, no ordinary DB, CSP and no-store checks
remain in place.

Required server-only runtime values:
- QA_ACCESS_SHA256: lowercase SHA-256 verifier of the owner-generated random token
- QA_ACCESS_NOT_BEFORE: 13-digit UTC Unix milliseconds
- QA_ACCESS_EXPIRES_AT: 13-digit UTC Unix milliseconds

A valid window has notBefore <= now < expiresAt and lasts no more than one hour.
Missing, malformed, future, expired, reversed or oversized windows deny access.
Expiry NEVER exposes the application publicly. Missing/wrong Basic credentials
receive a generic 401; unavailable configuration receives a generic 503.
Authentication failure never invokes application or asset code.

The gate bounds and validates the Basic header, uses runtime timingSafeEqual for
fixed-length digest bytes, strips Authorization and access configuration before
calling application code, and requires an independent exact Origin / same-origin
Sec-Fetch-Site on non-GET/HEAD requests. Existing endpoint CSRF checks must remain.

All responses are private/no-store/noindex, with no third-party scripts/frames.
No auth cookie, client-side credential storage, access log or public verifier is
introduced. The verifier is sensitive server configuration: do not print it or
package it into client assets or build artifacts. Do not assume masking the raw
GitHub secret masks its derived hash.

In-flight work admitted before expiry may finish after the boundary; a late
response is withheld. Expiry is not an automatic delete, resource teardown or
forced cancellation of already-running writes, and cannot revoke downloaded data.

## Bounded existing-ID installation controller

The old worker-qa-deploy.yml / deploy.mjs is NEW-resource-only and all-OFF-only.
Do not rerun it, weaken collision checks, change its accepted configuration, or
pretend it can update this existing Worker.

The new manual worker-qa-access.yml / update.mjs implements initial gate installation with every intake flag OFF. It reuses verification and the exclusive claim SDK from the exact f53724e reviewed-controller checkout. It does not implement synthetic intake enablement or an access renewal. Its executable context accepts only the already protected controller branch, not this PR branch. Publication there and dispatcher registration require separate approval before execution:
1. Pin the integrated application/controller commit, source tree, lockfile,
   compiled bundle, five existing manifest inputs, assets, and exact config.
   The gate is inside worker-preview-policy.mjs, already covered by the manifest.
   Build/test without credentials; never include the passphrase or verifier.
2. Verify the existing gemnao-preview-data Environment ID 23658815122, sole owner
   reviewer 325773421, admin bypass off, and the existing exact controller branch.
   A PR branch is not deployable through this Environment; do not expand its
   allowed branches. Future reviewed controller publication is a separate action.
3. Require an exact-run approval record binding the fixed Worker ID/name/origin,
   both D1 IDs, intended operation, artifact digests, access-window timestamps,
   zero-charge budget, one-shot behavior and the disclosed name-targeted
   Wrangler race/internal retries. Owner alone clicks Approve and deploy.
4. Only inside the protected job, read the dedicated access secret and derive
   its verifier in memory. Do not print the secret/verifier or put either in command arguments, workflow outputs, artifacts or persistent files. The raw passphrase stays in the protected process environment/memory. Official Wrangler receives only the verifier in a mode-0600 config inside a unique private temporary directory, deleted in finally; Wrangler logs are redirected to /dev/null and child output is captured/discarded. A hard runner crash relies on GitHub-hosted runner disposal, not an application deletion guarantee.
   Masking is defense in depth, not permission to log.
5. Authenticate the existing Cloudflare credential normally and GET the exact
   Worker by immutable ID before any write; require the exact name and account,
   exact subdomain and existing two D1 identities. Reject drift, missing
   resources, ordinary DB bindings, routes, extra services or unreviewed config.
6. The controller performs no new-Worker creation POST. It checks the fixed ID and name lookup in both directions, and exact bindings/settings initially and again after the exclusive claim immediately before invoking the pinned official Wrangler exactly once. Missing identity always fails the observed precondition. These checks are not atomic: an external actor deleting/renaming after the last check can still cause name-targeted Wrangler to create/update a different identity. The exact-run record must explicitly accept this residual race; if absolute no-create-under-race is required, this implementation is blocked. Repository job concurrency does not constrain outside actors.

   The initial installation keeps every collection/storage/sharing/feedback/
   metrics flag OFF. Preserve the access gate on every later update.
   Use official supported deployment APIs with freshly checked name/ID, then
   read back ID, bindings, flags, access expiry, no logs/observability, no Cron,
   public workers.dev and disabled preview URLs. Any uncertain write stops;
   do not retry, adopt another Worker, create a replacement or delete resources.
7. Synthetic ON is a separate bounded operation, using only this Worker and its
   two test DBs. DIAGNOSIS_LOCAL_BETA stays true and metrics stay false. Never
   enable public intake without the active access gate.
8. End the synthetic window with an explicitly authorized OFF update while
   retaining the access gate. On failures or expiry, deny new access/collection;
   do not fall back to a publicly accessible site.

The controller is covered by synthetic mock tests and secretless build checks, not remote execution. It refuses an already gated or otherwise changed runtime state; do not reuse it for renewal or synthetic ON. Secret storage, new access grant and the exact existing-Worker
update require the owner's disclosed action-time approval. No paid plan, budget
increase, new Cloudflare API token or permission expansion is included.

## Synthetic data, deletion and notification acceptance

Keep synthetic payloads detached from real user reports. Use unique per-run IDs,
fixed enum-only fixtures and exact row ownership. Never query or delete ordinary
production records or entire tables.

- Confirm zero sends before consent and fresh consent after content changes.
- Confirm share DTO disclosure boundaries, owner-cookie/recovery restrictions,
  immutable retries, reload/pending recovery, revocation and owner deletion.
- Confirm feedback idempotency, cancellation during uncertain saves, wrong-key
  refusal and tombstone protection against resurrection.
- Keep only needed fixture rows. In each test DB, use an expired and a non-expired
  canary; read back only those IDs before/after two natural hourly cleanup runs.
  Feedback expiries are seconds; diagnosis expiries are milliseconds.
- The existing feedback cleanup at :00 UTC and diagnosis cleanup at :17 UTC must
  not be altered or invoked through an invented HTTP route. Their remote deletion
  and heartbeat must be evidenced separately. Authentication can expire while
  approved metadata-only observation continues; do not extend access silently.
- Existing cleanup code writes heartbeats/throws but sends no alert. The existing
  single-shot health workflow does not provide continuous monitoring. A selected
  existing notification destination and observed failure-notification delivery
  are still required before real data or production activation.
- Do not fake stale global health or break cleanup resources to simulate failures.
  Local failure injection is not evidence of a real remote outage notification.

## Zero-charge and verification boundary

Observed GitHub account evidence on 2026-10-08 13:58 UTC showed Actions storage
0 GB used / 0.5 GB included (rounded/lagged UI), Actions and Packages budgets $0
with Stop usage=Yes. Do not change these budgets. Recheck current headroom and
Cloudflare Workers Free limits immediately before any future authorized live run.
Public unauthorized requests still reach Cloudflare and can consume free quota,
even when the gate denies them. There is no provider reservation guarantee.

Local regression tests use obvious synthetic tokens. The separate PR-check workflow has read-only
contents permission, no Environment/secret access, no upload artifact, no deployment
and no D1 calls. Run gate/wrapper/artifact tests, typecheck, lint and build. Passing
these checks does not establish remote authentication, actual expiry deletion,
notification delivery, production readiness or an authorized deployment.
