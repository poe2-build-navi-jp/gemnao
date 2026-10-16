# Community reports: closed, Wrangler-managed setup

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

### Read-only candidate and current access limitation

This local candidate adds operation **readback**, confirmation **empty**, to the
same protected workflow. It requires the existing reviewer/branch checks and
`gemnao-d1-production` Environment approval. It does not change those protections
or request/export credentials. It uses the existing protected secret only in
the approved job. It cannot run remotely until this candidate is separately
reviewed and published; no workflow was dispatched during this investigation.

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
(including SQL POST) are refused before fetch. The historical mutation source
allowlist and artifact checks remain unchanged for inspect/setup/deploy. Only
GET-only readback skips those build/mutation checks, since later published
article commits correctly fall outside that older mutation allowlist.

At investigation time this execution environment has no Cloudflare API token
and no applicable Cloudflare connector. Direct provider GETs were not attempted;
there is no observed 401/403 to report. Current-state evidence is limited to the
original run logs/receipt. A browser owner can alternatively perform these reads
in the existing Cloudflare dashboard. Do not extract the GitHub Environment
secret to this workspace or create a new credential for this investigation.

### Bounded resumption after verified readback (not implemented/executed here)

1. Review the fresh readback, reconcile the D1 UUID and actual guard namespace
   against this run, and pin both in a separately reviewed non-secret recovery
   record. If identity, existing bindings, flags, cron or production baseline
   differ, stop and review that difference. An unexpected existing cleanup must
   be inspected; its name alone is never permission to adopt or overwrite it.
2. Separately review a resume-only writer bound to that record. It must contain
   **no D1 create, schema replay, guard upload, migrations, namespace reset, SQL,
   deletion or Pages mutation**. Never dispatch old setup or use its rerun button.
   Its absent-name precondition now intentionally fails.
3. Re-read all pinned identities and current settings immediately before any
   approved mutation. If needed, send only POST on the existing guard's
   `/subdomain`, body both false, then GET and verify both false. If already
   disabled, skip the write. Existing schedules must be empty; changing/deleting
   a discovered schedule needs separate review and is outside this procedure.
4. Only after confirming cleanup is still absent and reviewing explicit
   permission to create it, upload the reviewed cleanup bytes once, with the
   existing D1 UUID, named guard service and all report flags false. Do not upload
   guard again or replay its migration. Disable cleanup URL/preview via the same
   POST and GET verification; verify schedules empty and all bindings/flags.
   Creation may briefly expose the default HTTP 404 handler until URL disable
   succeeds; intake must remain disconnected and OFF throughout. If the response
   is uncertain or any readback fails, stop, preserve the checkpoint and inspect
   exact live identities; no retry, rollback or automatic cleanup creation.
5. Re-read unchanged Pages configuration and successful current production
   identity. Only with both workers fully verified can a full resourceRecord be
   reviewed and deterministic closed Wrangler additions prepared offline. A
   separately approved closed deployment is a later operation. Do not roll back
   the published articles to the setup workflow's older source SHA.

Before any future mutation writer runs, its reviewed source scope/base must be
reconciled with the currently published article commits; the original historical
`verifySource()` allowlist rejects them. Do not bypass that guard to resume.
No resume writer, resourceRecord, binding change, cron, Pages deployment, bootstrap,
intake activation, new credential or permission change is included here.

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
