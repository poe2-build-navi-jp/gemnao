# One dedicated public QA Worker: local, disabled preparation

This adds one manual workflow and a small deploy adapter. It reuses the existing
`ops/feedback-preview` Environment verifier, scoped credential transport, pinned
Artifact SDK and exclusive exact-run claim. It does not reimplement Wrangler's
asset protocol. Nothing has been published, dispatched or deployed for this task.
`pins.json` pins the independently reviewed published application source
`a2f963b5832c0d13df21d42b1a1352211cc3651e`, tree
`a37a00e7ed50ab68c3c1c08864c51229d1fc1e99`. It preserves production main
`4cf30fd90f830166d2084cdcbe7c934ddab67ec1` article changes. Execution review and
exact-run owner approval remain separate prerequisites.
The read-only health/discovery run 37648312766 verified the planned origin
https://gemnao-diagnostic-qa.soykururu143.workers.dev at 2026-10-07 16:11 UTC.
This is a target hostname, not evidence that the QA Worker has been deployed.

Controller base: `2e037bbffe6f8b0076060d7880f45778e886a8f4`.
The workflow runs ONLY on the already allowed controller branch. The existing
Environment remains name `gemnao-preview-data`, ID `23658815122`, owner reviewer
`325773421`, no admin bypass, self-review allowed, exact single branch. No
Environment/credential/permission changes are included. Reuse existing masked
record/digest/token Environment Secrets; there is no repository/org fallback.
Do not change the existing provision/health workflow or cleanup schedules.

## Supported minimal sequence

1. Read-only discovery proves the exact account, existing workers.dev subdomain,
   no `gemnao-diagnostic-qa` collision and both receipt D1 identities. Independently
   review the existing token evidence and current account-wide Free limits/headroom.
   Token evidence may use the explicit prior-success mode below; it does not assert
   known account restriction or expiry. Unknown cost/target evidence stops. No
   broader token is requested.
2. Integrate/rebase the application candidate onto the current production article
   baseline without dropping article changes. Pin the verified actual origin in
   the source and three runtime origin vars. Keep every intake/storage/sharing/
   feedback/metrics flag false. Rebuild and complete local QA. Set the reviewed
   source commit/tree, lock SHA-256 and real origin in pins.json, then review code
   and change executionReviewed to true. Publication/dispatch are separate actions.
3. Register the manual dispatcher on default only after approval, then dispatch
   the exact reviewed controller ref. Gate verifies Environment configuration and
   repository/org secret absence, checks out the pinned app source, installs frozen
   dependencies, and builds once without the Cloudflare credential. Production
   build removes tracked dist/client/.gitkeep; restore-placeholder.mjs restores only
   its verified empty Git blob before the clean-source check. All other tracked
   differences still fail. `prepare-pages.mjs` includes Date.now in its build ID, so the protected job MUST
   NOT rebuild and claim identical bytes.
4. Official Wrangler 4.92.0 dry-run emits one self-contained module. `package.mjs`
   checks source/tree/lock, exact 5 manifest inputs and the entire asset set, then
   derives a no-bundle config with logging/observability off. It stages ONLY those
   inputs, static assets, manifest, compiled module and derived config. The original
   application config and production sources are not modified. The stage is at
   most 80 MiB; one official immutable GitHub artifact is uploaded with one-day
   retention and existing repository access. No overwrite/cross-repo access.
5. Before approving the waiting Environment job, owner reviews the exact run/head,
   source/tree, actual origin, emitted three byte hashes, artifact ID/archive digest,
   zero-charge headroom, existing token review and the two residual limitations
   below. Store the exact JSON and its independent SHA-256 in the existing masked
   Environment record/digest secrets. Record schema is the `validateRecord()` code;
   tests use clearly synthetic records, never operational limits or approvals.
6. The protected job downloads that same artifact by ID and installs locked tools
   with lifecycle scripts disabled. It verifies source, all assets, compiled bundle,
   generated config and record BEFORE the final action references the CF token.
   The final action repeats byte verification using controller code only; no app
   build script, dynamic app-code import or package installation receives the token.
7. Recheck authenticated run/head/owner approval, complete ≤100-run history and
   reviewed no-write reconciliation of every other QA deploy run. Verify artifact
   ID/run/head/digest, fixed account, actual subdomain, complete <100 Workers
   inventory and the two receipt D1 names/UUIDs. No table or row is read.
8. Reuse the existing official exclusive same-run claim (8 KiB archive, one-day
   retention). Claim payload additionally binds QA pins and approval digest; the
   legacy plan hash in its namespace is only the reused claim mechanism, not the
   QA deployment plan. Claim conflict or uncertain readback stops.
9. POST a new private Worker identity with the fixed unused name, no public/preview
   URLs, logpush or observability. Require a fresh immutable ID absent from the
   initial inventory and recheck it. Invoke pinned official Wrangler exactly once
   using the verified compiled module and `--no-bundle`; no rebuild. Recheck exact
   immutable ID/name, public workers.dev enabled, preview URLs disabled, logging
   disabled, only two D1 bindings, ASSETS and exact disabled vars, and documented
   result.schedules as an empty array. Beta Worker create/read envelopes retain
   the existing controller's absent/null-errors compatibility with explicit
   success:true; D1, schedules and other endpoints still require errors:[].
10. Preserve the safe receipt. Actual browser/HTTP QA and cleanup-health conditions
    remain separate; success reports intakeEnabled=false and actualQaVerified=false.
    Any unknown write outcome stops. Never rerun the CLI, rerun the GitHub attempt,
    delete the claim, adopt a colliding Worker or automatically delete resources.

## Exact target and permitted writes

All CF effects are under account `6a09a32cba1288cccce5912015086a35`.
Only new Worker name `gemnao-diagnostic-qa` is authorized. Only D1 bindings are:
- DIAGNOSIS_DB → `72c728f5-1656-4e26-bc11-7c508ae155c3`
- FEEDBACK_DB → `3a714aee-e602-4590-afd0-3c2ddd9aea8f`

Creation receipt byte hash:
`a60571f40ecd9a37db31a42e98841ad2ba2f993de0ec016488fc688d599e43d0`.
There is no ordinary DB, D1 create/schema/query, Pages binding, custom domain,
route, Cron, production Worker, cleanup Worker, secret-write or permission change.

The wrapper's sole direct Cloudflare write is POST `/workers/workers`, relative
to that fixed account. The pinned Wrangler deploy implementation may perform:
- POST `/workers/scripts/gemnao-diagnostic-qa/assets-upload-session` with the
  reviewed asset manifest; POST `/workers/assets/upload?base64=true` with only
  content-addressed files requested from that manifest, using the returned
  short-lived upload token. No token is exposed to the owner/logs/repo.
- POST `/workers/scripts/gemnao-diagnostic-qa/versions` and POST its `/deployments`
  with the one uploaded version at 100%; or legacy PUT
  `/workers/scripts/gemnao-diagnostic-qa` when its supported service lookup treats
  the newly created empty identity as not yet having a deployed service.
- PATCH that script's `/script-settings` for disabled observability/logpush and
  its own deployment tags; POST its `/subdomain` to enable workers.dev while
  previews_enabled=false.

Wrangler also reads service/settings/deployments/subdomain metadata. Config
validation disallows routes, schedules, build commands, resource provisioning,
containers, unexpected variables, any other resource bindings and unknown keys.
The wrapper rechecks expected state after success because Wrangler may warn rather
than fail if its non-versioned settings update fails. SDK asset/deploy flows are
not routed through the wrapper's bounded JSON API. They are the pinned official
client, timeout-limited and configuration-scoped, not a claimed network firewall.
If that scope is insufficient, do not enable execution; a different reviewed plan
is required. Account-level token permission is not provider-enforced per-D1 or
per-Worker isolation.

GitHub effects: one ≤80 MiB uncompressed build artifact with one-day retention;
one existing ≤8 KiB exclusive claim artifact with one-day retention; normal
workflow logs/Environment deployment record. Existing access is unchanged. Dispatch
approval must cover build artifact storage before the protected owner gate.

## Honest residual limitations: explicit approval required

- Creating the identity via the supported POST is new-resource creation. The
  subsequent Wrangler deployment is NAME-targeted. Immutable-ID checks before and
  after detect drift but cannot atomically prevent another actor replacing/renaming
  that name between check and write. The record must accept this specific race.
- Pinned official Wrangler 4.92.0 internally retries retryable version/legacy-script
  uploads and subdomain updates (up to 3 attempts), plus content-addressed asset
  uploads with its own retry policy. The wrapper itself never reruns Wrangler.
  If the requirement is absolutely no HTTP retry after an ambiguous response,
  this supported Wrangler path is BLOCKED. Do not patch Wrangler or invent an
  unsupported atomic/one-shot guarantee. The owner must explicitly accept its
  internal retry behavior for this exact deployment, recorded in wranglerRetries.
- Public noindex is indexing guidance, not access control. Unsolicited traffic can
  consume Free request/CPU headroom. No provider quota reservation is claimed.
  Human-reviewed budget/expiry evidence is required; stale, unknown or paid plan
  evidence fails closed. Source hash proves bytes, not evidence authenticity.

## Existing-token evidence, without mandatory screenshots

The strict `owner-reviewed-scope` kind retains known scope/account restriction and
expiry predicates when independently available. A screenshot is not mandatory.
Alternatively, `user-configured-scope-plus-authenticated-target-receipt` requires
the existing secret name, exact account, noExpansion=true, user-evidence hash,
creationRunId=37640786041 and the fixed successful creation-receipt hash above.
It explicitly records accountRestriction=unverified and expiry=unverified.
Successful prior target access proves access at that time, not provider-enforced
account restriction, per-resource isolation, least privilege or validity until a
future date. This alternative does not inspect, copy or expand the token. Fresh
normal authenticated target reads still precede writes; auth failure stops without
rerun. The record must not turn these unverified properties into true assertions.

## Current remaining inputs

Final controller pin review; exact-run owner approval after the credential-free
build artifact is available; independently reviewed existing-token evidence in one of the two supported forms below and
Free/headroom/artifact-storage evidence; owner
acceptance of exact public exposure, name race and official internal retries;
registered exact dispatcher and reviewed waiting run/artifact record. Neither
preparing code nor prior approval of cleanup resources authorizes this launch.

Approval statement (fill exact source/run/hashes after discovery):
“I approve this exact run and artifact to create only gemnao-diagnostic-qa in the
specified account, publicly deploy the reviewed assets/module with only the two
receipt D1 bindings and intake disabled, reuse the existing token, stay within
reviewed zero-charge limits, and accept the disclosed name-targeting race and
pinned Wrangler internal retries, with no rerun or automatic cleanup.”

## Local checks and primary sources

`node --test tests/worker-qa/*.test.mjs` uses mocked transports/CLI only.
A real credential-free clean build of application ee83c3a passed on 2026-10-07; its
only tracked difference was deleted dist/client/.gitkeep. The narrow restoration
then left git diff HEAD empty. No application source file was reset or hidden.
A separate clearly synthetic local-origin fixture exercised the whole gate:
real build → 614 assets → Wrangler dry-run → package → fresh source checkout +
623 transferred files (55,741,730 bytes) → controller verification without rebuild
→ no-bundle Wrangler dry-run. Both compiled-module hashes were identical.
Synthetic fixture pins are outside the repository and never authorize a deployment.
Existing controller tests are unchanged. Local tests do not establish real token
scope, real provider behavior, actual URL reachability or remote QA success.

- https://developers.cloudflare.com/workers/wrangler/commands/workers/#deploy
- https://developers.cloudflare.com/workers/static-assets/direct-upload/
- https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/create/
- https://github.com/cloudflare/workers-sdk/tree/wrangler%404.92.0/packages/wrangler/src
- https://github.com/actions/upload-artifact/commit/ea165f8d65b6e75b540449e92b4886f43607fa02
- https://github.com/actions/download-artifact/commit/d3f86a106a0bac45b974a628896c90dbdf5c8093

Pinned installed Wrangler CLI SHA-256 was locally inspected for these effects:
`fc1aa72afc91906759a3555e76e6dae1b13504f71dec6d3bbfa0fe24c351ebd7`.

Contract fixtures are checked against reviewed controller 2e037bb and official
Cloudflare TypeScript SDK v5.2.0 workers/beta/workers/workers.ts (create/get),
workers/scripts/schedules.ts (nested schedules) and script-and-version-settings.ts
(GET /settings D1 id/name/type and ASSETS bindings).
