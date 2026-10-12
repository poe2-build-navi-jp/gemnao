# Public diagnosis and optional feedback intake

The public rollout shares **500 admission slots total**, not 500 people or a
guarantee of 500 successfully stored payloads. The separate game-listing request
limit is unchanged. Existing daily and short-window limits still apply.

`DIAGNOSIS_DB.diagnosis_operations` holds one permanent aggregate row,
`admission:total:v1`. Its value is a canonical decimal integer between 0 and 500;
its `expires_at=0` does not make it eligible for the existing cleanup query, which
only deletes expired `salt:%` operation keys. No new schema, DB, secret, or cron
deployment is required. Do not delete/reset this row to reopen intake.

A D1 transaction creates a temporary domain-separated request fingerprint and
conditionally increases the aggregate together. A unique transaction claim
prevents concurrent retries from increasing it twice. Temporary fingerprints
use `salt:admission:v1:` and expire 30 days after their first admission; retries
never extend that deadline. The already deployed diagnosis cleanup removes them.
Expired fingerprints may be removed during a later request, and a new admission
after expiry may consume another slot. Neither payload deletion nor fingerprint
expiry decreases the aggregate. No individual identifier is retained indefinitely.

The two payload DBs cannot join one transaction. Therefore a successfully
reserved slot remains consumed when the payload write fails or its outcome is
unknown. An existing fingerprint with no saved payload cannot create a new
payload. The same saved payload can still be recovered using its existing
identity. API errors and unconfirmed write results never claim success.

This counter starts with the new public rollout; the previously completed
four-record synthetic QA ran before this public admission mechanism. Temporary
QA remains disabled. Its bounded internal guards are unchanged and cannot be
selected by a public API input.

Diagnosis and feedback both require a fresh diagnosis cleanup heartbeat for new
admission; feedback also requires its own fresh cleanup heartbeat. Missing or
invalid bindings/state deny intake. Owner deletion is independent of this cap
and remains available subject to its normal authentication and provider availability.

Provider Free-plan enforcement is separate from this application counter. The
app stops on provider quota/storage errors; it does not measure account-wide
headroom or impose a billing cap on a Paid plan.

Validation: `node tests/diagnosis/admission.test.mjs` exercises real local D1
transactions, concurrent retries, the 499/500 boundary, expiry, retained aggregate,
both payload APIs, owner deletion, failed write results, and lost responses.
