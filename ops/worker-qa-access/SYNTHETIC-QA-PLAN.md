# Bounded synthetic QA and OFF restoration

Preparation only. No ON deployment, credential generation, row creation, deletion,
cleanup invocation or notification sending is authorized by this document.

## Fixed target and source

- Worker `gemnao-diagnostic-qa`, ID `4cde2e6602024e6b9650d26b28955010`, account `6a09a32cba1288cccce5912015086a35`.
- Origin `https://gemnao-diagnostic-qa.soykururu143.workers.dev`.
- Diagnosis DB `72c728f5-1656-4e26-bc11-7c508ae155c3`; feedback DB `3a714aee-e602-4590-afd0-3c2ddd9aea8f` only.
- Reviewed app `ec8e3fef41a03b92d7f57d7258aec99fba7cc470`, tree `63b97621cd2d3e8682c1fa5481e536d78fd35aac`.
- Initial gate receipt: run `37845453980`, intake OFF, gate until `2026-10-08T22:10:00Z`. Owner reported opening the private authenticated page; agent browser returned `ERR_BLOCKED_BY_CLIENT`, so live browser QA remains incomplete.

## One shared controller, two transitions

`enable-existing-gated-qa-synthetic`: exact observed gated-OFF state to seven
synthetic flags ON. LOCAL_BETA remains true, metrics false. Existing password
verifier is unchanged. The owner approves any replacement access window in the
exact-run record; cost evidence must remain valid through the whole access window. It starts no earlier than that record and is at most one hour.
Expiry denies every route, including assets and owner deletion; it never exposes
the app publicly. Only the owner-controlled test session may use the credential.

`disable-existing-gated-qa-intake`: exact observed gated-ON state to the same seven
flags OFF. Preserve password verifier and access timestamps exactly. This recovery
works after gate expiry under fresh deployment approval, without reopening access.
Expire access first if the OFF job is delayed; do not infer flags automatically
became OFF. Already-admitted writes may finish after expiry.

Each transition uses the same fixed ID/name checks, two DB checks, owner-protected
job, exact artifact, exclusive claim and one Wrangler invocation. Recheck identity
and exact expected settings immediately before and after the call. External
delete/rename races are not atomic with name-targeted Wrangler; disclose this and
its internal retries in each owner's approval. Stop on uncertain outcomes.

The record contains `priorDeployment` with the verified prior write run/commit matching current settings,
receipt hash, prior intake state and access timestamps. Confirmed deployments (including a failed run reconciled after a write)
belong in `reconciledWriteRuns`, never in `reconciledNoWriteRuns`. Prior failed runs
37833234988, 37836827161 and 37839603004 all stopped before Cloudflare API/claim.
Bind `syntheticPlanSha256` to the final owner-reviewed execution ledger for ON.

## Owner approval bundle before running anything

1. Publish reviewed controller/workflow changes, prepare the ON run/artifact and
   OFF recovery procedure, and freshly review zero-charge limits. Keep the existing
   token, budgets, Environment reviewer and allowed branch unchanged.
2. Approve exact ON window, fixed Worker/DBs, synthetic-only payloads, limited
   record counts and the per-run identifier ledger. No real names, emails, user
   reports, free-form personal information or production rows.
3. Obtain explicit per-action approval before permanent deletion of the exact
   synthetic rows identified in the resulting ledger. Creating fixtures does not
   itself approve deleting them. Separately approve owner-facing revocation and
   recovery tests and their exact fixture targets.
4. Owner alone performs each final `Approve and deploy`. Actual QA login uses
   username `qa` and the existing passphrase through owner-only entry. Do not send
   credentials or recovery/deletion keys to chat, PRs, logs or artifacts.

## Minimum fixture ledger and checks

Reserve logical case labels before ON: `diagnosis-create`, `diagnosis-revoke`,
`feedback-create`, `feedback-cancel`. Use at most two diagnosis reports and two
feedback reports. Predetermined diagnosis API request IDs for an approved API
harness can be `20261009000100000000000000000001` and
`20261009000100000000000000000002`. Check that the exact request IDs do not belong
to an existing fixture; never adopt an existing row.

The normal diagnosis API generates its share ID. Record the returned ID against
the approved request ID, then obtain deletion approval for that exact created row.
Feedback receipt IDs encode issuance seconds plus a hash of their deletion key;
the ordinary client generates them. Freeze the actual receipt ID in the ledger
after creation, without logging the key. Do not substitute arbitrary preset
receipt IDs or claim the UI can force a predetermined server-generated share ID.
If every internal row ID must be fixed before creation, these normal API tests
must wait for a separately reviewed fixture path; do not add a public bypass.

- Verify no submission before consent, preview content and consent invalidation
  after content changes, pending-save/reload recovery, and cookie-only ownership.
- Verify sharing payload fields, repeated submission idempotency, wrong-owner
  refusal, then approved revoke/delete of only the ledger rows.
- Diagnosis removal: `DELETE /api/diagnosis/{id}` with owner cookie, same origin,
  `X-Diagnosis-Request: 1` and `{}` body. Storage must still be ON.
- Diagnosis revoke: `POST /api/diagnosis/{id}/revoke`; recovery uses
  `POST /api/diagnosis/{id}/recover` and the owner's recovery key. Those keys remain
  in the owner's session. Revocation is not immediate row deletion.
- Feedback removal: `DELETE /api/diagnostic-feedback` with its exact receipt/key.
  This creates a retention tombstone before removing the matching report.
- Finish approved owner deletion before OFF or gate expiry. Do not silently
  extend access to finish. Retain a non-secret outcome/ID ledger, not answer data.

ON also requires real cleanup heartbeats: diagnosis `cleanup_success` less than
two hours old (milliseconds), feedback `last_cleanup` within 7200 seconds. Never
write a fresh heartbeat to make the test pass. Some API GETs update quota/salt
bookkeeping; they are not read-only database operations and must be covered by
the synthetic QA permission.

## OFF acceptance and unfinished expiry/notification checks

After OFF, exact runtime settings must show the seven flags false and unchanged
gate/DBs. Authenticated diagnosis config intentionally reports `enabled:true`,
`sharing:false`, `metrics:false`, `localOnly:true`; LOCAL_BETA keeps local-only
diagnosis usable. Feedback reports `enabled:false`, `canDelete:true` while the
outer gate is still valid. Do not assert diagnosis `enabled:false`.

Normal creation APIs retain records for 30 days and cannot set a short expiry.
Fast natural-cleanup verification requires separately approved, exact-ID fixture
seeding; it is not implemented by this transition PR. Reserve these unused
synthetic canary IDs only after an exact absence check:

- Diagnosis expired/live: `20261009000100000000000000000101`, `20261009000100000000000000000102`.
- Feedback expired/live: `20261009000100000000000000000201`, `20261009000100000000000000000202`.

Seed only the approved columns/rows in the two test DBs; use milliseconds for
diagnosis and seconds for feedback. Observe two natural cleanup cycles (feedback
at :00 UTC, diagnosis at :17 UTC), expired removal and live preservation. No
invented cleanup HTTP route, forced Cron, table-wide deletion or unrelated-row
inspection. Metadata observation can outlast browser access with separate scope.

Cleanup currently records heartbeats/throws but has no confirmed notification
destination or sender. The owner must select an existing destination and approve
the exact synthetic notification/delivery test before it is sent. Do not fake a
remote outage or report delivery/expiry QA complete from local tests alone.

Production activation remains blocked on actual storage/share/delete/expiry and
notification acceptance. This PR changes no production application or database.
