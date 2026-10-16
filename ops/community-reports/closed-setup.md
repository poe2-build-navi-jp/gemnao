# Community reports: closed, Wrangler-managed setup

## Stage 1 bootstrap protocol: local candidate, not executed

Checked 2026-10-16. Closed deployment run
[38935034477](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38935034477)
succeeded on source `0a703eb562d2f363615be90a442c465178bb78e6`, production
deployment `75d4a1d8-bbc6-46d3-9813-f866518f6a81`. Dedicated resources are now
connected; nine report flags are OFF, Worker public/preview URLs OFF and cron
empty in that receipt. Normal-browser homepage and article acceptance was
confirmed separately. This does not prove ledger initialization or operating
readiness. The historic instructions below describe prior operations, not an
instruction to repeat setup/readback/deploy against this newer production state.

The source candidate remains closed: no phase-state file or root-config change
is included by default. `bootstrap-phase.mjs` implements this separate, bounded
protocol. Preparation below is offline; later publishing, each protected run,
and the existing authenticated administrator POST require the separately agreed
Stage 1 authorization. No new credential is needed for preparation/bootstrap.

1. Prepare **open** locally from the closed source:

   ```bash
   node ops/community-reports/bootstrap-phase.mjs prepare-open
   ```

   Review the two-file diff: new `bootstrap-phase-state.json` pins the existing
   D1 UUID, namespace, closed deployment/source/config fingerprint; Wrangler
   changes only `REPORTS_BOOTSTRAP_ALLOWED` to `true`. All other eight report
   flags stay `false`; no instance pin is invented. Publish the reviewed source
   with `[CF-Pages-Skip]` only after authorization. Do not let an ordinary Git
   Pages deployment bypass the protected manual operation. Dispatch a **new**
   run on that SHA, operation `bootstrap-open`, confirmation
   `OPEN_REPORTS_BOOTSTRAP_ONLY`; owner approval of the existing Environment is
   still required. This changes Pages through its existing managed uploader,
   never PATCHes project settings and never initializes the ledger.

2. Only after its successful, non-secret receipt and bootstrap allowance are
   confirmed, use the owner's **existing administrator browser session** at
   `https://gemnao.pages.dev`. After the administrator POST is explicitly
   authorized, it may execute:

   ```js
   const response = await fetch('/api/admin/reports-bootstrap', {
     method: 'POST',
     credentials: 'same-origin',
   });
   const result = await response.json();
   console.log(response.status, result);
   ```

   There is no submitted body, query parameter, cookie extraction or new token.
   The unchanged route verifies method, same origin, no body, existing admin
   authentication, temporary allow flag, absent instance pin and an empty report
   table. Its sole SQL is a count SELECT. The named service uses the existing
   `community-reports-v1` object. First initialization writes one ledger key;
   repetition returns the existing UUID without resetting totals/deletion markers.
   CI never performs this POST or receives the browser session. Save only the
   exact `{ "ok": true, "instanceId": "<returned UUID>" }` response, not headers
   or credentials. The placeholder here must never enter configuration.

3. Prepare **pin** offline using the actual successful opening receipt and exact
   browser response, stored outside the repository:

   ```bash
   REPORTS_BOOTSTRAP_OPEN_RECEIPT=/tmp/open-receipt.json \
   REPORTS_BOOTSTRAP_RESULT=/tmp/bootstrap-result.json \
   node ops/community-reports/bootstrap-phase.mjs prepare-pin
   ```

   Review/persist the two-file diff with `[CF-Pages-Skip]`: same returned UUID in
   the phase record and `REPORTS_GUARD_INSTANCE`, all nine flags OFF. The opening
   receipt's deployment/SHA/config hash is the exact previous-state anchor;
   arbitrary extra browser response fields or placeholders are rejected. This
   offline check validates consistency of the reviewed receipt, not a digital
   signature; compare it with the actual approved run before publishing.
   New exact-source run: operation `bootstrap-pin`, confirmation
   `PIN_REPORTS_INSTANCE_ONLY`, existing Environment owner approval. The operation
   **first deploys/reads back Pages with the pin and bootstrap OFF**, then adds
   that exact same non-secret pin to the existing cleanup Worker. Cleanup intake,
   all other flags, URLs and cron remain OFF. The guard itself is never changed.

The cleanup transport permits one multipart
`PATCH /workers/scripts/gemnao-community-reports-cleanup/settings` only, with
one `settings` field containing the exact fixed existing bindings plus that UUID.
It never uploads Worker code. D1 metadata, guard namespace, cleanup bindings,
disabled URLs, empty schedules and Pages configuration/production identity are
read before writes and read back after them. An existing different UUID, unexpected
binding/secret or nonempty operator version annotation stops for review. The
annotation refusal prevents the provider's documented omission behavior from
silently removing an operator message/tag. Server-generated version metadata may
change with a settings update; no claim of zero provider version creation is made.
The actual PATCH/provider behavior remains untested against production; synthetic
transport tests and the pinned official SDK contract are local evidence only.

Primary reference, checked 2026-10-16:
https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/script_and_version_settings/methods/edit/

### Failure, closing and replay

If the POST fails or its result is uncertain, stop. Do not synthesize a UUID,
initialize another namespace, reset/delete storage or retry automatically. After
the agreed close authorization, `prepare-close` uses only
`REPORTS_BOOTSTRAP_OPEN_RECEIPT` (no browser response) and generates a two-file
closed configuration without a pin. New run: `bootstrap-close`, confirmation
`CLOSE_REPORTS_BOOTSTRAP_ONLY`. This disables bootstrap through Pages only;
any already initialized ledger is retained. A closed-unpinned phase cannot be
reopened through this candidate without another reviewed recovery plan.

A pin failure after the Pages upload leaves Pages pinned and bootstrap disabled;
cleanup may remain unpinned. Check the receipt and live state. A separately
reviewed **new run on the same exact source SHA** can finish only that same pin:
it skips an already successful desired Pages deployment and an already matching
cleanup pin. Local preparation of an identical pin writes nothing. Replacement
UUIDs, reopening after pin/close, source/config/identity drift and unknown states
are refused. A failed provider mutation consumes its one attempt; no automatic
retry, rollback or deletion is attempted. Wrangler's previously documented
internal Pages upload retry behavior still applies. Concurrency and fresh reads
cannot atomically exclude another operator changing resources between reads;
coordinate this short sequence and stop on any disagreement.

Stage 1 authorization, when granted, must cover only: publishing these reviewed
protocol/opening source changes; the protected bootstrap-open deployment; one
authenticated bodyless administrator POST; persisting its actual non-secret UUID;
the protected bootstrap-pin deployment and exact cleanup binding PATCH; and a
bootstrap-close contingency if the result is uncertain. Existing Environment
approval stays with the owner for each new run. No token creation/registration,
usage-profile assertion, observation, collection, cron, real-data deletion test,
general reporting UI/API publication or intake activation belongs to this stage.
The 56-file unpublished UI candidate is separate and must remain unchanged.

## Historic closed setup and recovery

This workflow never opens intake, moderation or public reporting. It never invokes
bootstrap, verification erasure, an observation, Time Travel or guard reset. The
existing `gemnao-d1-production` Environment and owner approval remain mandatory.
The read-only analytics workflow is unchanged. Dispatch is performed by the owner
or the parent browser exactly once, never by a rerun (`run_attempt` must be 1).

## Partial run 38792112604: read first, do not rerun setup

Checked 2026-10-16. The original run used `SETUP_CLOSED_REPORTS_ONLY` and failed
after `dedicated-d1-created`, `dedicated-schema-applied`, `guard-uploaded`.
The returned D1 UUID is `3141aae6-8dc9-47e9-a8a2-7a05f642f94f`, name
`gemnao-community-reports-production`. The pinned schema was applied and its
initial operation total verified as zero. Cleanup creation was never reached.

The failed request used **PUT** on the guard `/subdomain` endpoint, returning
`PUBLIC_URL_DISABLE_HTTP`, HTTP **405**. Cloudflare documents **POST** for
`/accounts/{account_id}/workers/scripts/{script_name}/subdomain`, with
`enabled` and optional `previews_enabled`. This candidate corrects the method and
its request allowlist to POST, retaining the exact disable-only body
`{ "enabled": false, "previews_enabled": false }`. PUT for this endpoint and
any enable/extra-field payload are rejected before network access. The old test
double incorrectly accepted PUT; the new contract test rejects it. This failure
does not establish a need for a new token or wider permissions.

Primary reference, checked 2026-10-16:
https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/subdomain/methods/create/

Initial Pages inspection reported flags closed; the run did not enable intake,
change Pages configuration or publish Pages. Its guard default HTTP handler is
404 in the reviewed source. Neither fact proves live `workers.dev`/preview flags
or empty cron. The run stopped before their GET readback, and before reading the
actual Durable Object namespace ID. Do not supply a placeholder namespace, call
`prepare-bindings`, or present this partial receipt as a complete resourceRecord.

### Verified readback and cleanup-only candidate

The published **readback** mode, confirmation **empty**, succeeded in owner-approved
run [38916688046](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38916688046),
source `776a8a216fa3ab922817dc57d6a8b15daefb2738`, attempt 1. Its bounded receipt
reported `ok:true`, `readOnly:true`, `readbackComplete:true`, no errors, and:

- Existing D1 UUID/name identity matched the original receipt.
- Guard namespace `54f03069afc249779996d92530e835e1` and class matched.
- Guard `enabled:false`, `previews_enabled:false`, schedules empty.
- Cleanup absent; Pages' nine report flags OFF, intake closed, managed config
  unchanged. The successful production anchor remained `b75715f4-d6ec-4c8b-9569-68ad98d7cabb`,
  article SHA `603b31de1a286880931fa8bf796aefb4533acde1`.

These are observations at that run, not a lease or automatic permission to write.
The readback still reports `readyForAutomaticResume:false`.

The GET-only transport pins the failed run's D1 UUID and permits these reads:

- D1 metadata at the exact returned UUID; verify its name and UUID. No SQL query.
- Worker list; establish guard presence and cleanup presence/absence.
- Existing guard `/settings`, `/subdomain`, `/schedules`: capture its real
  namespace ID, both URL flags, and actual cron expressions. If cleanup already
  exists, read the same settings, bindings and all OFF flags; never overwrite it.
- Pages project and canonical deployment: verify original D1 bindings, absent
  report bindings, all report flags OFF, managed configuration and current
  successful production identity. Secret values are excluded from the receipt.

All observations remain available if one request fails; failure yields only the
fixed stage/error/status, never raw response text. Unknown URL/cron/flag state is
null, not false. `readbackComplete` means observations were read, not that URLs
or cron are safe. `readyForAutomaticResume` is always false. No resourceRecord is
emitted, no artifact is built or uploaded to Cloudflare, and mutation methods
(including SQL POST) are refused before fetch. Only GET-only readback skips the
build/mutation source checks. It retains existing reviewer/branch checks and the
protected Environment; those protections and credentials are unchanged.

The current local workspace has no Cloudflare credential/connector, so this
review re-read the successful GitHub run and bounded job log, not a new direct
provider request. Do not extract the Environment secret or create a new token.

### Cleanup-only resume: local review candidate, not executed

After separate approval to publish this candidate and create the cleanup, choose
a **new** workflow run on the reviewed `gemunao` SHA:

- Operation: `resume-cleanup`
- Confirmation: `CREATE_CLOSED_REPORTS_CLEANUP_ONLY`
- Environment: existing `gemnao-d1-production`; owner approval required.
- Never use `setup`, a rerun, or approve the Environment on the owner's behalf.

`cleanup-resume.mjs` pins the real D1 UUID, namespace, original/readback provenance
and successful Pages recovery fingerprint. Before every creation attempt it
performs fresh D1/guard/Pages GETs, requiring the exact pinned identities, both
guard URLs disabled, no guard cron, nine Pages flags OFF, report bindings absent
and unchanged managed configuration/production anchor. Any drift stops before
writing. Cleanup must be absent, checked again immediately before its upload.

The only two external mutations permitted by its transport are:

1. One `PUT /workers/scripts/gemnao-community-reports-cleanup`, with the exact
   verified cleanup bundle, pinned existing D1 and named guard service bindings,
   nine flags `false`, fixed compatibility date and observability disabled. No
   migration, secret, schedule, inherited binding or arbitrary metadata allowed.
2. One `POST /workers/scripts/gemnao-community-reports-cleanup/subdomain`, body
   exactly `{ "enabled": false, "previews_enabled": false }`, after a confirmed
   successful upload. GET readback must confirm both disabled.

D1, guard and Pages are GET-only. There is no schema query/replay, guard upload or
URL update, namespace operation, cron write/invocation, reset, delete, credential,
permission/protection change, Pages deploy, bootstrap or intake activation. The
artifact contains only `cleanup.mjs` and a digest-pinned manifest; no Pages bytes,
guard bundle or schema. Compilation uses the existing reviewed cleanup source and
all 21 existing pinned runtime/schema hashes remain unchanged. Tests run serially
because CLI receipt tests intentionally exercise one fixed receipt filename.

The workflow keeps the existing production-control concurrency group. The upload
also sends `If-None-Match: *` as a conditional-create safeguard. Cloudflare's
upload documentation mentions conditional ETag headers, but this candidate has
**not** verified wildcard create-only enforcement against the real provider.
Fresh absence checks plus workflow concurrency cannot atomically exclude another
operator creating the same name between GET and PUT. Coordinate that no other
operator creates/updates this cleanup during the approved run; do not claim an
exactly-once creation guarantee. The default HTTP handler is reviewed to return
404, but URL availability may briefly exist between upload and URL disable.

Every attempted mutation is checkpointed; uncertain responses consume that
attempt. Any failed upload/URL request or readback stops without retry, repair,
rollback or deletion. Preserve partial resources and inspect the exact state;
even a later new resume run refuses an already existing cleanup. It never edits
an existing cleanup to recover a partial attempt automatically.

After both writes, fresh readback must confirm the same D1/guard identities and
unchanged Pages configuration, cleanup bindings/flags correct, both cleanup URLs
disabled and schedules empty. Only then is a complete resourceRecord emitted.
Persisting that record/Wrangler bindings and deploying the closed backend remain
separate later approvals. Existing published articles remain on their current
production deployment throughout this operation.

### Source allowlist alignment

The reviewed **change scope** baseline is explicitly
`776a8a216fa3ab922817dc57d6a8b15daefb2738` in `TARGET.scopeBase` and
`closed-source.json`; it must be an ancestor of the execution SHA. It already
contains the later published article commits. The **configuration/schema** base
remains `3d2f8d9d57ca41614882841062e44950e0702d63`; root Wrangler settings are still
compared against that same baseline/persisted closed projection.

No wildcard editorial allowance was added. Only fixed controller/workflow/tests
and existing pinned backend paths are allowed to differ after the new base.
Tracked working changes and untracked non-ignored files are checked too. The
existing Pages build's empty `dist/client/.gitkeep` placeholder may disappear;
nonempty contents or other output/source paths are not permitted. The original
21 runtime/schema hashes are still checked, so moving the change-scope baseline
does not reauthorize modified runtime code. Tests exercise real Git scope checks
against editorial drift, untracked files, runtime hash drift and a changed base.

Additional primary reference, checked 2026-10-16:
https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/update/

## 1. Inspect before mutations

Choose branch `gemunao`, operation `inspect`, and leave confirmation empty.
The job must confirm all fixed target names are absent, source Wrangler settings
match the current managed production configuration, and the canonical production
deployment is successful. Its recovery receipt records only the deployment ID,
source SHA and a fingerprint of non-secret runtime configuration. Secret values
are neither printed nor persisted.

Extra plaintext variables, unknown bindings, a failed/preview rollback target or
configuration drift stop inspection. Correct and review the source/configuration
alignment before creating resources; do not bypass this check or adopt an existing
resource just because its name matches.

## 2. Provision dedicated resources; leave Pages unchanged

Operation `setup`, confirmation `SETUP_CLOSED_REPORTS_ONLY` creates only the new
dedicated D1, its pinned schema, guard and cleanup Workers. Worker public URLs are
disabled, schedules remain empty, and all report flags remain OFF. It does **not**
PATCH Pages bindings or deploy Pages. The recovery receipt is written before the
first mutation and after each completed stage, then uploaded even on failure.

The receipt contains `resourceRecord` with the returned D1 UUID, independent guard
namespace ID and recovery identity. These identifiers are not authentication
credentials. A failure or uncertain response stops the job; keep partial resources
idle and review exact IDs/state. Do not rerun setup, delete/reset the guard or
automatically recreate resources.

## 3. Persist reviewed non-secret identity in the repository

Extract only `resourceRecord` from the bounded receipt to a temporary JSON file.
Without Cloudflare credentials, from a checkout of the reviewed branch run:

```bash
REPORTS_RESOURCE_RECORD=/tmp/reviewed-resource-record.json node ops/community-reports/closed-setup.mjs prepare-bindings
```

This offline command changes only `wrangler.json` and creates
`ops/community-reports/closed-binding-state.json`. It preserves existing vars, DB
bindings and preview settings, adds the dedicated D1 and named guard service, and
sets report flags to `false`. Review the actual UUIDs against the receipt/provider,
then commit these exact two non-secret files with `[CF-Pages-Skip]`. Do not dispatch
deploy until this source change has been reviewed and persisted.

The normal Pages Git build reads this same committed `wrangler.json`, so subsequent
normal deployments retain the report bindings and OFF flags without a dashboard
PATCH, build-time network lookup or secret copying. A missing state file, a source
config mismatch or any change beyond deterministic report additions is rejected.
This step cannot happen before the real resource IDs exist; placeholders are never
accepted or automatically committed by the workflow.

## 4. Deploy the managed closed backend

Operation `deploy`, confirmation `DEPLOY_CLOSED_REPORTS_ONLY`, on the newly reviewed
SHA rechecks the persisted D1 name/UUID, guard namespace, cleanup bindings, disabled
public Worker URLs, empty schedules and unchanged production recovery baseline.
It then passes an explicit Wrangler configuration to the normal Pages uploader.
The source config and isolated upload both retain `./dist/client` as output path.
No project settings PATCH is sent. Original article/UI source remains unchanged.

Readback checks production bindings, plaintext vars, compatibility, existing
secrets' descriptors (in memory only), build settings, preview settings and the
successful deployed SHA. Intake remains OFF; `health` is not claimed healthy and
neither bootstrap nor verification erasure is invoked. Actual operator-authenticated
API use and provider behavior remain later acceptance checks.

## Failure and recovery

The saved successful production deployment ID/SHA is the Pages recovery anchor.
Before Pages deployment, retain dedicated resources idle. After an uncertain upload
or readback failure, stop and inspect the receipt and canonical deployment; do not
re-dispatch automatically. A separately reviewed Pages rollback may restore the
recorded successful deployment. Reconcile project bindings against the persisted
source and non-secret baseline separately: a code rollback does not restore D1 or
guarantee reversal of project settings. Never restore/reset the independent guard.

Wrangler 4.92 may retry an internal Pages upload after its UNKNOWN_ERROR response;
this is not an exactly-once deployment guarantee. The controller does not retry
provisioning or initiate automatic rollback, Time Travel or destructive cleanup.

References, checked 2026-10-15:

- https://developers.cloudflare.com/pages/functions/wrangler-configuration/
- https://developers.cloudflare.com/pages/configuration/rollbacks/
