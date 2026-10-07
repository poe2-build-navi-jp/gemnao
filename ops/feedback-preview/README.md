# Isolated feedback and diagnosis-sharing preview controller

**Default-deny, manually approved execution.** The protected local JavaScript
action now has a concrete scoped transport and locked official SDK. It is runnable
only after the existing exact Environment, owner review, secret and exact run-bound
record/digest are present. No real credential, account call, artifact upload or
workflow run was used in preparing/testing this integration. The legacy offline
CLI and createApprovedAdapter() still deny; the sole live entry is action.yml.

Production base: `35e931b3163b85394b7ac7e44ddde9e54f3e6e87`. Changes are isolated
under this directory, focused tests and a new manual-only workflow. Existing
application source, root `wrangler.json`, `.openai/drizzle`, `ops/d1`, production
workflows and the local diagnosis beta are preserved.

## Exact new resources

Account to authenticate before execution: `6a09a32cba1288cccce5912015086a35`.
This identifier is a requested target, not proof of authenticated access.

| Scope | NEW D1 | NEW cleanup Worker | Binding | Proposed protected Environment | Proposed UTC Cron |
| --- | --- | --- | --- | --- | --- |
| Feedback | `gemnao-diagnostic-feedback-preview-20261007` | `gemnao-diagnostic-feedback-cleanup-preview` | `FEEDBACK_DB` | `gemnao-preview-data` | `0 * * * *` |
| Sharing | `gemnao-diagnosis-preview-20261007` | `gemnao-diagnosis-cleanup-preview` | `DIAGNOSIS_DB` | `gemnao-preview-data` | `17 * * * *` |

Each binding may refer only to its corresponding NEW D1 creation receipt. No
ordinary `DB`, production ID, existing resource adoption, fallback name, Pages
binding or application activation. A collision stops; no suffix, replace or delete.
No alert recipient/channel or reviewer identity is assumed. All setup choices
remain unset until exact approval and verification.

## Reviewed source pins

Feedback source commit `feb866d6dc0391a76b8e7f16228de8b9788b9583`, tree
`e49c2b6c6e5be8a2eb31730a9f3105d47a51bd40`. Sharing schema source commit
`7ef1df53bc9ee4b2c3f9b852dfa4ad30e06d8631`, tree
`45594676b1ec971bcd9fc93c691ad28ba24b030a`. Sharing cleanup source commit
`b2c51a26cd323492f9fdc0f4939d2967b1956e7f`, tree
`51d849805ca36914046289626241d32bbd1b9cd5`.

| Artifact under `reviewed/` | SHA-256 |
| --- | --- |
| `0001.sql` | `06cd366d4269986d33170e6325e02c651801586cce4caa8169b48dbef0ff7405` |
| `cleanup.ts` | `fe3a5c1f8fc8358f3cb676f0dd51ba9214b57874eb2a2de8703c206973a8ea86` |
| `cleanup.mjs` | `fc9be025bfd8d559afd5dcb1c1ee7b6e5461a6a204bfd773dc4224dc9f1e74c3` |
| `diagnosis/0001.sql` | `f50e5b9c723f64668c482be86ab590910c474d57a1222124b87d7adfc1fe6681` |
| `diagnosis/cloudflare/diagnosis-cleanup.ts` | `eebb5081080768fe06f2037074e849f452dfd277c4e12a92fa511d93f4f737f1` |
| `diagnosis/lib/diagnosis/cleanup.ts` | `ded590732fc5c0ec667af1ecee418f45fedb6f09dc8596156a9a45c9930836de` |
| `diagnosis/cleanup.bundle` | `601934e05c896c320d34b779937774b3a80ba3df99fda0facd01c413c52a5012` |

SQL and TypeScript are byte-identical copies. Feedback JS uses esbuild 0.27.3
transform with loader=ts, target=es2022 and legalComments=none. Sharing bundle uses
its artifact directory as working directory, entry `cloudflare/diagnosis-cleanup.ts`,
bundle=true, format=esm, platform=neutral, output
`.wrangler/diagnosis-tests/cleanup-worker.mjs`. Tests reproduce the exact bytes and
verify exactly two inputs. No application server or other transitive code is copied.

## Runnable protected integration

`adapter.mjs` implements bounded preflight and five Cloudflare writes per pair.
`live.mjs` confines token injection to the reviewed JavaScript action in the
protected job. `runtime/package-lock.json` pins the official Artifact SDK and every
transitive dependency; npm ci --ignore-scripts verifies integrity without lifecycle
scripts. The JavaScript action receives GitHub's ephemeral artifact runtime token
through the supported action runtime. A shell step is not assumed to expose it.

Execution ref is fixed to `refs/heads/prepare/feedback-preview-controller-20261007`.
The dispatcher must first be registered on the default branch, then dispatched
with this selected ref. Registration is not permission to execute on default.
The existing Environment is pinned by name AND ID23658815122. Before any job
references it, a read-only gate verifies owner poe2-build-navi-jp as the single
reviewer, self-approval allowed, no administrator bypass, and the exact branch.
Missing/mismatched settings stop without implicitly creating an Environment.

The protected action requires GitHub-hosted/manual/attempt1 context, checkout SHA
and workflow SHA matching the exact record. It verifies current owner approval via
GitHub API, then performs authenticated Cloudflare read preflight before mutations.
Only the final protected action step receives the Cloudflare secret. Token value,
scope and expiry are never printed; successful account reads are not represented
as proof of minimal token scope/expiry. Secure setup review remains authoritative
for those properties. Scope failures do not request broader permissions.

The transport contract is fetch-compatible `(url, options) -> Response` and must
honor AbortSignal. Only the two fixed provider origins and internally constructed
paths are used. Response URL must match, redirects are rejected, status must be
200/201, content must be JSON, and Cloudflare success/errors must be unambiguous.
Each request has a 10-second deadline and 1 MiB response cap; the session caps all
requests at 120. Provider errors/response bodies are never logged or rethrown.
No retries, SDK fallback, billing calls or destructive cleanup exist.

The older `modelPreflight` fixtures remain synthetic specification tests only.
Their caller booleans are not consumed by the implemented adapter or accepted as
authenticated evidence. Even their result always says executionAllowed=false.

## Approval and cost evidence

Minimal record flow, with no commit/run circularity:

1. Publish the reviewed code and dispatch the fixed branch with no inputs. The
   gate emits safe exact run ID/head SHA/ref/plan hash/reviewer ID and the protected
   job waits for owner approval.
2. Prepare the independently reviewed non-sensitive record for that existing run.
   Store its exact JSON in Environment secret `GEMNAO_PREVIEW_APPROVAL_RECORD`
   and its SHA-256 in Environment secret `GEMNAO_PREVIEW_APPROVAL_SHA256`, ONLY under gemnao-preview-data.
   No real screenshots, credentials or private raw usage images go into the repo.
3. Owner approves that exact waiting job. Its step receives those Environment secrets
   after review, checks the independent digest and run/head/ref/owner metadata,
   then performs the fixed preflight, durable claim and creation sequence.

The record and digest are noncredential configuration stored as secrets so GitHub
masks their exact values before rendering the action's environment in job logs.
The workflow never reads approval configuration from `vars`; old expired variables
are unused. Do not print, transform or dump the record: masking is not a substitute
for avoiding output, especially for structured values.

The unprotected gate receives only booleans indicating whether same-named repo/org
secrets exist and rejects either one, preventing configured fallback authorization.
Setup must keep those secret names absent outside the Environment and must not
change scope during the run. The workflow does not read secret/variable values
through REST or add a PAT/grant. It consumes the protected job's secrets and
independently validates record/hash against authenticated run/protection metadata.
GitHub configuration/review endpoints use Actions:read; ref reads use Contents:read.
No real approval record is populated in code. Empty, stale or mismatched values
stop before Cloudflare credential use. New runs require new exact records.

For a failed run with an unresolved outcome, a new owner-approved exact-run record
may explicitly use `mode: read-only-preflight`. Its expiry and all run/ref/owner
checks still apply. This path exposes only metadata preflight, rejects non-GET and
non-preflight endpoints before transport, and never loads the Artifact SDK,
creates a claim or calls provisioning. It may inspect inventory despite unresolved
prior runs or a target-name collision. Inventory metadata remains internal; public
success output is only the fixed read-only completion/intake-disabled marker.
Provisioning still requires independently reviewed no-write reconciliation for all
prior runs, no collisions, and its original creation mode. A diagnostic result is
not permission to retry creation.

Public failure diagnostics contain only allowlisted local stage/error codes and
the last request's service, method, static endpoint class and numeric HTTP status.
For parsed Cloudflare envelopes, two safe enums also describe `success`
(true/false/missing/invalid) and `errors` (absent/null/empty/nonempty/invalid).
No URLs, resource IDs, headers, response bodies, record values or arbitrary error
text are included. An unrecognized failure becomes `UNCLASSIFIED_FAILURE`.

Only the fixed beta Workers list/create/get and version create/get endpoints
accept absent/null `errors`, and only with explicit
`success:true` plus the existing strict result/pagination/identity checks. The
[official Workers list SDK](https://github.com/cloudflare/cloudflare-typescript/blob/main/src/resources/workers/beta/workers/workers.ts)
uses [V4PagePaginationArray](https://github.com/cloudflare/cloudflare-typescript/blob/main/src/core/pagination.ts),
which reads result/result_info and does not require errors. Worker create/get and
[version create/get](https://github.com/cloudflare/cloudflare-typescript/blob/main/src/resources/workers/beta/workers/versions.ts)
also unwrap result without requiring errors. This is SDK compatibility;
the [HTTP reference](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/list/)
still describes errors as an array and does not explicitly promise null. False or
missing success, nonempty/malformed errors, and invalid result/pagination still
block. Exact Worker identity, bindings, module bytes and readbacks remain required.
D1/account and legacy Cron endpoints still require an empty errors array. The
previous failure's exact envelope shape remains unproven until safe diagnostics
observe it; HTTP 200 alone never establishes success.

The record binds account, both fixed resource pairs, `PLAN_HASH` (including artifact
hashes/settings), exact branch/commit, one GitHub run ID, single-Environment reviewer policy, cleanup,
chosen notification destination with deliveryStatus=pending and accepted residual Cron naming risk. The execution record
expires after one hour. Its owner-UI cost evidence may remain valid for the same
explicit UTC quota day, ending no later than the evidenced 00:00 UTC daily reset. Freshness
is checked again before each write. Thresholds/reservations must be explicitly
reviewed, not copied from test fixture numbers.

The supported pending cost record is `owner-ui-reviewed`, NOT authenticated billing
or quota API evidence. An independent review of private owner screenshots must
record screenshot hash, review-evidence hash, account, operation, capture/review
UTC timestamps, explicit quota date/reset, reviewed unchanged-plan evidence,
Workers Free assessment (explicit label or honest enforced-cap-pattern inference),
zero authorized charge, account-wide remaining
D1 reads/writes/storage and Workers requests, database/Worker/Cron capacity, and a
reviewed reservation covering BOTH pairs plus existing workloads. Private images,
billing details and account screenshots are not published in the repository.
Each usage dimension must deduct a separately reviewed conservative allowance
for intervening existing-account traffic/storage before the two-pair reservation.
No numeric example is an operational budget. A screenshot hash proves byte identity,
not authenticity; human/source review is
still required. Project analytics, a typed FREE, an empty subscription response or
caller booleans cannot establish the plan or account-wide headroom.

Actual authenticated metadata preflight corroborates account identity and current
DB/Worker slot counts and actual Cron counts (read-only schedules metadata for
each Worker in the complete inventory). The enforced Free Cron limit is five per
account; unknown or insufficient Cron capacity blocks independently of DB count. It does not certify screenshot-derived request/storage
headroom, freshness beyond the captured instant, or a provider-enforced reservation.
Concurrent usage and UI reporting lag must be included in the reviewed safety
margin. Unknown fields, paid plans, insufficient thresholds or stale evidence deny.
No Billing Read permission is requested or needed by this path. Application rate
limits do not cap all billable work; cleanup has no per-invocation expired-row cap.

## Fixed authenticated read-only preflight

All read paths below are built internally; they are not dispatch inputs.

1. GitHub `/repos/poe2-build-navi-jp/gemnao/actions/runs/{approved_run_id}` and
   `/git/ref/heads/{approved_branch}`: exact repository/workflow/ref/commit,
   manual event, in-progress state, and run_attempt=1.
2. That fixed workflow's `/actions/workflows/feedback-preview-control.yml/runs`:
   complete history within 100 runs, including current run. Any other unknown,
   active, retried or unreconciled run denies. Previously completed no-write runs
   need individually reviewed receipts in the pinned record. A successful status
   alone is not proof of no prior mutation. Truncated/deleted/unavailable history
   is not a safe retry signal; preserve durable run records through reconciliation.
3. Current run `/approvals`, and the single exact Environment plus its
   `/deployment-branch-policies`: exact reviewer IDs, one exact branch, no tags or
   wildcard, no admin bypass, actual matching manual approval for `gemnao-preview-data`.
   Owner-manual permits the selected owner to approve bot/app-originated runs
   unless requireOwnerInitiator was explicitly selected. Independent mode requires
   prevent-self-review=true and reviewer distinct from actor/triggering actor.
4. Cloudflare `GET /accounts/{fixed_account}`, followed by `/d1/database` and
   `/workers/workers`: up to ten pages of 100, consistent totals, unique IDs,
   complete inventories, no target-name collisions and enough reviewed free slots.
   GET `/workers/scripts/{inventory_name}/schedules` for each authenticated inventory
   Worker, metadata only, to verify account-wide Cron headroom. No script source is read.

No existing table queries, private rows, unrelated script source, secrets, billing,
account settings mutations or permission changes. Missing capabilities stop rather
than silently expanding access. GitHub Actions read is needed for run/review and
Environment metadata; unavailable API fields fail closed.

## Ten Cloudflare mutations plus one bounded GitHub claim upload/readback

Each pair permits five Cloudflare mutations; ten total. The separate GitHub
claim upload/readback uses its official multi-request protocol and is not counted
as a Cloudflare mutation. Its max 8 KiB archive, one-day retention, existing
repository access and reviewed storage budget are also bound in the approval
record and PLAN_HASH. No artifact-access expansion or paid storage is authorized.
All Cloudflare paths are under the single authenticated account above.

1. POST `/d1/database`, exact new name. Require a fresh new UUID/name receipt absent
   from complete initial inventory, then independently read back that UUID/name.
2. POST `/d1/database/{new_uuid}/query`, exact pinned schema bytes only. Require nine
   successful feedback results or seven sharing results. No seed records/heartbeat.
   Sharing's IF NOT EXISTS syntax does not authorize adopting an existing database.
3. POST `/workers/workers`, exact new name, subdomain enabled=false and
   previews_enabled=false from creation, logpush=false and observability.enabled=false.
   Require a fresh immutable Worker ID absent from initial inventory, exact name,
   disabled access and readback under this account. No legacy create-or-replace PUT.
4. POST `/workers/workers/{new_worker_id}/versions?deploy=true`, one pinned ES module,
   compatibility date 2026-05-22 and exactly one D1 binding to that feature's new UUID.
   Require version identity/binding response, then GET that new version with `?include=modules` and compare
   its module bytes/binding. No other bindings, assets, secrets, routes or add-ons.
5. GET the Worker by immutable ID and exact name again, then PUT only its name-based
   `/workers/scripts/{fixed_name}/schedules` with the single reviewed Cron. Verify
   response and recheck immutable identity afterward.

Cron's documented endpoint is name-targeted. The checks catch prior rename/drift,
not an atomic concurrent-rename race between check and write. The record must
explicitly accept this residual limitation. No unsupported conditional-write claim
or fallback exists. Initial Worker creation uses the supported new-resource POST;
public URLs are disabled before any version upload.

A mutation is journaled in-progress BEFORE transport. Failed/partial/uncertain
responses permanently stop the instance. Provision attempts, including failed
preflight, are one-shot. GitHub's durable run and prior-run checks are supplemented by a mandatory
atomic durable same-run claim BEFORE the first Cloudflare mutation. A fresh
instance/process must create the same fixed run claim name exclusively; an existing,
uncertain or mismatched claim denies even when provider inventory is still empty.
The claim binds repository/run/plan/record hashes and a fresh instance nonce, with
independent readback. `artifact-claim.mjs` implements the concrete official Artifact
client integration. It calls uploadArtifact INSIDE each provision process for
`gemnao-preview-data-claim-{run_id}-{PLAN_HASH}`; a previous action-step output cannot
be reused as a claim. V4's documented same-name conflict blocks a fresh process in
the same run, including after a crash and lost local journal. There is no
get-existing/adopt/delete/overwrite path. The SDK's immutable-create protocol is
used; this is not an invented compare-and-swap API.

The wrapper pins official `@actions/artifact` 2.3.2 and the integrity recorded in
`actions/upload-artifact` v4.6.2's lockfile. It uploads one non-sensitive claim JSON
(max 4 KiB source / 8 KiB archive), retention one day, compression zero; then checks
returned ID/digest, current-run metadata and a downloaded exact payload. No findBy
or cross-run/repository token scope. The SDK uses the runner's existing runtime
artifact token and introduces no persistent credential grant. The package client
is loaded only by the protected action after record/protection checks. The reviewed loader
checks the official SDK pin and npm ci enforces locked dependency integrity, preserve normal
repository artifact access and keep claims/runs intact until reconciliation.
Only the live claim SDK integration test after approval can establish actual
provider behavior; current tests use mocks plus reviewed official semantics.

The wrapper calls uploadArtifact once; SDK-internal upload/network retry behavior
is distinct from Cloudflare mutations, which are never retried. A claim conflict,
uncertain upload or readback mismatch stops before any Cloudflare write. No artifact
is uploaded and no retention/access setting is changed during this preparation.
Missing claim integration blocks; an ephemeral file/Map is only a test fake.
Run-attempt>1 is also denied. Never delete a claim to permit retry; reconcile
read-only and obtain a new exact reviewed recovery plan.
Creation receipts never authorize adopting another resource. No delete/rollback
mutation is automatic. Safe receipts include IDs, fixed names, hashes, timestamps
and outcomes; no credentials, reports or raw provider responses.

## Remaining secure setup and launch steps

- Review final code and exact execution commit/ref; select reviewer/operator policy
  and exact IDs. Create/verify only the single protected Environment `gemnao-preview-data` after
  approval, with no admin bypass and matching branch/manual-review rules.
- Supply and independently review still-missing account-wide owner-UI plan/quota
  evidence, explicit capacity reservations, cleanup approval and accepted notification destination with deliveryStatus=pending for empty preview creation. Alerts contain operational status only, no reports,
  raw IPs, salts, keys or receipt identifiers. No destination is assumed/configured.
- At action time, securely create/configure a dedicated short-lived Cloudflare
  credential restricted to this account with D1 Write and Workers Scripts Write.
  Proposed secret name: `GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN`, stored only in
  `gemnao-preview-data`; only the final protected action references its value.
  These are account-level permissions, NOT per-database provider isolation. No
  Billing/Pages/Zone/global/role/notification writes. No existing step-result token
  reuse. User enters/stores credentials through secure setup, never chat/logs/repo.
- Review the live transport/secure-record loader and pinned Artifact SDK wiring,
  verify its actual conflict/readback behavior and unchanged artifact access,
  and complete exact protected setup.
  The offline CLI/factory remain denied; only the protected JavaScript action can execute after all exact setup checks. The
  adapter's injected trusted-hash argument is an integration boundary, not a user
  approval bypass. No arbitrary dispatch record, secret or authorization flag.
- Sharing application isolation remains a separate prerequisite. Before switching
  any source/binding, inventory possible historical data under the old binding and
  approve migration/deletion/retention continuity. An empty new DB proves nothing
  about legacy records. Never orphan owner deletion/cleanup or repoint ordinary DB.
- Actual corrected HTTP/browser sharing QA remains unverified. A prior local
  Wrangler HTTP attempt hit a forbidden incidental Cloudflare request; no bypass
  was made. Local mock/Miniflare tests do not establish remote/platform behavior.
- After future authorized deployment, prove two actual hourly executions for each
  Worker, advancing heartbeat, expired-only deletion and failed-cleanup behavior,
  plus alert delivery and owner deletion availability before activation/promotion.

Feedback's pinned module has scheduled() only. Sharing's cleanup denies HTTP with
404 and has no public application/admin route. Workers.dev/preview URLs must remain
verified disabled. Successful provisioning receipts would not prove heartbeat,
monitoring, retained-data continuity or intake readiness.

Rollback keeps intake disabled, isolated bindings, owner deletion, retention and
monitoring. No DB/table drop, early report deletion or resource destruction without
separate approval. Provider backups/log retention is distinct from application
expiry. This PR does not change an application feature flag or deploy Pages.

## Checks and primary references

- `node --test tests/feedback-preview/control.test.mjs tests/feedback-preview/adapter.test.mjs`
- `node tests/feedback-preview/local-d1.mjs`
- Repository full lint, TypeScript and beta build/Pages/OG checks

All adapter requests in tests use synthetic injected transports. Miniflare tests
use disposable local DBs. No workflow was run during this preparation. After owner approval the protected action can run live preflight/provisioning.

- [Create a new Worker](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/create/)
- [Read Worker version modules](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/methods/get/)
- [Pinned official Artifact dependency/integrity](https://github.com/actions/upload-artifact/blob/v4.6.2/package-lock.json)
- [Official overwrite implementation](https://github.com/actions/upload-artifact/blob/v4.6.2/src/upload/upload-artifact.ts)
- [Immutable GitHub artifact semantics](https://github.blog/news-insights/product-news/get-started-with-v4-of-github-actions-artifacts/)
- [Create/deploy a Worker version by ID](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/methods/create/)
- [Get immutable Worker identity](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/get/)
- [List Workers](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/list/)
- [Cron update](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/schedules/methods/update/)
- [D1 create](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/create/)
- [D1 schema batch API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/)
- [Workers limits and midnight-UTC request reset](https://developers.cloudflare.com/workers/platform/limits/)
- [D1 daily 00:00 UTC reset](https://developers.cloudflare.com/d1/platform/release-notes/)
- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) and [limits](https://developers.cloudflare.com/d1/platform/limits/)
- [Account-scoped permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)
- [GitHub run/review metadata](https://docs.github.com/en/rest/actions/workflow-runs)
- [GitHub Environment protections](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)

### Empty preview versus feature readiness

This record authorizes only mode=create-empty-preview-pairs. An accepted existing
notification destination can be recorded with deliveryStatus=pending; no fake
delivery hash is required or accepted as proof. Receipts explicitly return
alertDeliveryVerified=false, actualHeartbeatVerified=false and intakeEnabled=false.
No application binding, intake/share flag or real data collection is changed.
Actual scheduled retention and alert delivery must be proven before real data,
sharing activation or production promotion. Existing GitHub email preferences
alone do not monitor Cloudflare Cron health.

## Observe the created preview cleanup heartbeats

The separately approved `cleanup-health` record mode binds `HEALTH_PLAN_HASH` to
creation run 37640786041 and only its two new database IDs. After the existing
exact-run/ref/Environment/owner approval checks, it verifies account identity and
both database UUID/name pairs, then issues one fixed SELECT per feature through
D1's POST query endpoint. The transport permits only those exact SQL bytes/hashes
and URLs, denies other mutations, and never initializes the Artifact SDK or claim.
It does not weaken the original GET-only diagnostic mode or provisioning checks.
After account verification it also reads the existing account Workers subdomain
once via the [fixed GET endpoint](https://developers.cloudflare.com/api/typescript/resources/workers/subresources/subdomains/methods/get/).
The health-plan hash binds that GET and planned Worker name `gemnao-diagnostic-qa`.
Only a validated lowercase DNS label is used to derive the planned workers.dev
origin, always marked deployed=false. Missing/invalid metadata or lookup failure
returns known=false and no origin; both heartbeat checks still run independently.
This does not verify a deployed QA Worker or configure/create a subdomain.
No Worker execution, Cron changes, report-row reads or existing database access
are included. A repeated probe requires a new exact-run approval record.

The SELECTs read only the feedback singleton cleanup timestamp and the sharing
`cleanup_success` timestamp/expiry. Heartbeats must postdate creation, not be in
the future, and be at most two hours old. Missing/stale values return pending.
Public output contains per-feature healthy/pending booleans, the explicitly planned
QA origin discovery result, and intake=false;
metadata rows and quota usage are never printed. This confirms heartbeat freshness,
not a seeded expiry/deletion experiment, alert delivery or production readiness.
