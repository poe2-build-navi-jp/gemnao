# Cleanup readiness monitor (inactive preparation)

This is a dependency-free, secretless GitHub Actions monitor of two existing
public capability GETs. It never reads a Cloudflare API or a database directly,
submits feedback, creates a share, sends an external message, changes settings,
or deploys anything. It does not use or modify `ops/feedback-preview`.

**Initial state:** both entries in `reviewed-targets.mjs` are `null`. There is no
schedule. A manual `self-test` runs synthetic tests only. Selecting an unset
live target exits nonzero with `target_not_reviewed`, before any request.
These files alone are not a working alert or proof of notification delivery.

## What it checks

- `GET /api/diagnostic-feedback`: `enabled` and `canDelete` booleans.
- `GET /api/diagnosis/config`: `enabled`, `sharing`, and `metrics` booleans;
  optional `localOnly` and `previewSharing` booleans are accepted. Metrics must
  remain false because metrics activation is outside this monitor's scope.
- For reviewed expected `enabled`, false feedback/sharing readiness fails the
  Action. Existing application code makes missing, stale, or failed cleanup
  heartbeats fail closed. Missing bindings or an intentional runtime flag change
  can produce the same response. Report **capability not ready**, not a proven
  cleanup cause. Feedback currently requires cleanup within 7,200 seconds;
  sharing requires cleanup less than two hours old. The application, not this
  monitor, owns that freshness threshold.
- Expected `disabled` or sharing `local-only` produces `paused` when collection
  is off. It does not flag the absence of a heartbeat and does not claim cleanup
  is healthy. Unexpected collection or metrics intake fails. A stale heartbeat
  is invisible while intake is intentionally disabled, so retained data may need
  separately approved operational checks during a prolonged pause.
- HTTP errors (including rate limiting), malformed or oversized responses,
  missing `no-store`, timeouts, and unexpected response fields fail with a fixed
  code. Requests are never retried, and redirects are never followed.

The GETs may consume the existing public limiter and read the application's
singleton heartbeat. They are not report/share queries. Responses are capped at
2 KiB; real fetch has a 15-second deadline including body streaming. Logs contain
only constant service/state/code fields, never raw responses, URLs, errors,
report contents, share IDs, IP addresses, cookies, tokens or secrets. GitHub's
normal runner/workflow metadata still exists. No artifacts are uploaded.

## Review a target before enabling live reads

1. Verify the exact deployed preview URL and isolated bindings through the
   separate activation review. A branch alias moves with that branch, so record
   the intended deployment there. Do not invent a URL or use the synthetic test
   hostname. A preview URL must be one subdomain of `gemnao.pages.dev`.
2. In a reviewed commit, replace only the intended `null` with this shape, using
   the verified origin in both exact URLs:

   ```js
   Object.freeze({
     feedback: Object.freeze({
       url: 'https://VERIFIED-PREVIEW.gemnao.pages.dev/api/diagnostic-feedback',
       expected: 'enabled',
     }),
     sharing: Object.freeze({
       url: 'https://VERIFIED-PREVIEW.gemnao.pages.dev/api/diagnosis/config',
       expected: 'enabled',
     }),
   })
   ```

   `feedback.expected` supports `enabled` or `disabled`. `sharing.expected`
   additionally supports `local-only`. Production is a separately reviewed entry
   restricted to `https://gemnao.pages.dev` and cannot pass with `previewSharing`
   true. Both paths, the common origin, HTTPS, absence of credentials/query/hash,
   and expected modes are validated before either request. CLI and workflow
   dispatch accept only `preview` or `production`, never an arbitrary URL or mode.
3. Update the test asserting all targets are unconfigured to assert the exact
   newly reviewed configuration. Keep the rejected-target and mock-only tests.
4. Re-run local checks. Review/publish the commit separately. No production
   enabling, schedule activation, publication or manual Action run is implied by
   preparing these files.
5. With authorization, run the default-branch workflow manually for the reviewed
   target. Save the exact commit/run evidence and fixed status result. A success
   cannot prove expired-row deletion, heartbeat advancement, or an end-to-end
   notification; those remain independent acceptance checks.

## Notification and scheduling acceptance

GitHub's built-in Action failure notification is the only intended channel.
No webhook, email service, token, or new recipient is configured here. Existing
owner web/email failure-only preferences do not establish this workflow's
recipient eligibility or prove delivery.

Before adding any schedule in a separate reviewed change:

- Confirm the exact target and expected mode; never infer readiness from the
  intentional-off production state or automatically downgrade to `disabled`.
- Confirm the owner is eligible for this workflow's notifications. Manual run
  notifications go to the triggering user with Actions notifications enabled.
  Scheduled notifications initially go to the creator, can move to the user who
  changes cron, and can move to the user who re-enables a disabled schedule.
  A bot-created or bot-edited schedule must not be assumed to notify the owner.
- Test one explicitly authorized synthetic failure from the eligible owner and
  verify the actual GitHub/email notification arrives. Do not break cleanup or
  stop collection to test alerts. There is deliberately no failure dispatch mode
  in this initial workflow; any such test change needs review.
- Review timing against hourly cleanup and the two-hour fail-closed window, and
  account for GitHub schedule delays/drops and inactivity disabling. GitHub
  Actions is not a guaranteed real-time watchdog and cannot notify when the
  monitor itself never runs. Confirm observation of scheduled runs as part of
  activation. Choose an off-peak minute and the smallest useful cadence.
- Update the manual-only job condition for the explicitly authorized scheduled
  event in that same review. Merely adding a cron while leaving that condition
  unchanged would skip the job. Preserve default-branch and repository guards,
  least privileges, constant output and the committed target allowlist.

References (checked 2026-10-07):
[GitHub workflow notifications](https://docs.github.com/en/actions/concepts/workflows-and-actions/notifications-for-workflow-runs)
and [scheduled workflow behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

## Local checks

```sh
node --test tests/cleanup-health-monitor/monitor.test.mjs
pnpm lint
pnpm typecheck
pnpm build
```

The focused tests inject synthetic fetch responses; no test calls a remote API.
They cover readiness failure, intentional pauses, unexpected intake, optional
preview schema, exact URL/mode validation, redirects, bounded/invalid responses,
timeouts, redacted errors, the nonzero CLI, and the manual credentialless workflow.
They model the identical public response of missing/stale/failed cleanup; they
do not themselves inspect a real heartbeat or prove live cleanup execution.
