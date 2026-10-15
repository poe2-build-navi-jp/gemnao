# Community reports: closed, Wrangler-managed setup

This workflow never opens intake, moderation or public reporting. It never invokes
bootstrap, verification erasure, an observation, Time Travel or guard reset. The
existing `gemnao-d1-production` Environment and owner approval remain mandatory.
The read-only analytics workflow is unchanged. Dispatch is performed by the owner
or the parent browser exactly once, never by a rerun (`run_attempt` must be 1).

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
