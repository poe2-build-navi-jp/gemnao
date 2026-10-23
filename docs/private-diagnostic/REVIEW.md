# Non-public Windows diagnostic intake — draft, OFF

This is a review candidate. No production DB, credentials, access policy, binding, migration, intake switch, cron or alert has been created or changed. The existing default Windows download stays 0.6.0. The native candidate is 0.6.1-rc.2 and is not verified on Windows.

## User-approved boundary

The person using the diagnostic tool chooses whether to send. They review the selected content and explicitly consent before sending. This is private operator intake, not a community post, public share link, anonymous article vote, or the existing Wilds action-outcome feedback contract.

The implementation retains the native app's no-network design: the person previews/saves a dedicated JSON file, explicitly opens the static intake URL (no report in URL), imports the file locally in the browser, reviews readable JA/EN fields and complete JSON, checks an initially unchecked consent box, then presses Send. App save confirmation is NOT send consent. The web page sends a status GET on load; it does not send report content on import. Ordinary browser navigation/status requests expose connection metadata to the hosting provider. Saving in a sync folder may separately synchronize the local file.

## Closed schema, not a raw diagnostic dump

`PrivateDiagnosticExport.cs` and `lib/private-diagnostic/contract.ts` define a new schema (`kind: private-diagnostic`, version 1), separate from diagnostic-feedback v1. Required values are tool version; general/Wilds category; fixed symptom; Application read status/counts/limit; System read status and restart/display-record presence; whole-PC answer and trial outcome; and one allowlisted next-step ID or null. JA/EN labels mirror the existing 30 native steps. The next step is a suggestion, not an established cause. Observations and user answers are separately labeled; submitted tool output is not independently authenticated evidence.

No full TXT, free-text game name, EXE/path, CPU/GPU product name, email, username, device ID, raw log, DLL name, crash ZIP, full history, screenshot, exception text or precise source-event timestamp is accepted. Unknown keys, duplicate JSON keys, inconsistent counts, unsupported enums, excess fields/counts/bytes are rejected. A 4KiB JSON report fits within the streamed 6KiB transport cap. This is intentionally less detailed than the local report; it cannot identify arbitrary general games, establish causation, authenticate an untrusted sender's observations, or guarantee anonymity.

## Reused code and isolated storage

- Native: reuses original Windows Forms controls, localization, consent/file guard and one existing confirmed browser-launch path. No HTTP client is added. Existing TXT export, history DPAPI, optional reads, old feedback JSON and old disabled web intake button are retained.
- Web: reuses `strictJson`, feedback receipt/key validation and pure IP normalization; adapts the atomic D1 short-window quota logic to private-only tables and a separate daily salt/HMAC domain; the new service is an explicitly isolated adaptation of the existing feedback service. No cross-feature fallback or writes.
- Binding: explicit `PRIVATE_DIAGNOSTIC_DB` only; no fallback to any other binding. The current alternative may point this explicit binding to a separately approved existing QA DB. Every table/index is prefixed `private_diagnostic_`; legacy `diagnostic_*` tables are never read or written. Physical database quotas and platform access remain shared: SQL namespaces are not a separate permission or billing boundary. The staged migration creates only the new namespace and fails on existing objects; no runtime migration, legacy copy, rename or adoption occurs. It has not been applied remotely.
- No writes to the existing shared 500-admission ledger and no changes to community-review/publication.
- `PRIVATE_DIAGNOSTIC_ENABLED` and `PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED` are absent from runtime configuration and default off. New intake also requires both flags and a successful cleanup heartbeat within two hours. Status/POST fail closed without the isolated binding. DELETE remains available with the binding when intake or review is disabled/stale.

## Receipt and failure semantics

A per-submission browser-generated 32-byte random deletion key yields a key-bound receipt ID with creation time. It is not a device identity. The server stores only its hash. A new receipt must be at most 24h old, with 5-minute future-clock tolerance. Same receipt, key and canonical report recover the same saved receipt; changed payload conflicts. Double clicks are locked. Successful responses are accepted only when their receipt matches and expiry is present. 4xx rejection/pre-dispatch errors, network/5xx/malformed/lost-response uncertainty, confirmed storage and confirmed deletion have separate messages. Storage is not a guarantee of operator review, reply or resolution.

No automatic retry. The person can save a private receipt/recovery JSON containing their sanitized report and deletion key, reimport after reload, and separately consent to retry with the SAME receipt. Nothing goes to localStorage automatically. The receipt must be kept private; losing it can prevent user-initiated deletion/retry. The admin endpoint never returns deletion hashes/keys. A public GET returns capability flags only; receipt IDs never grant read access.

Cancellation/deletion leaves a 30-day key-bound tombstone, including for a not-yet-arrived POST, preventing resurrection. Conditional INSERT checks the tombstone atomically. DELETE removes a report only after confirming its tombstone exists. At capacity, deletion of an existing report still replaces its occupied slot with a tombstone; cancellation of an unknown receipt can be refused honestly without claiming deletion.

## Capacity and retention

- Reports plus tombstones combined: at most 1,000 retained rows. This is an application bound, not a billing cap.
- At most 200 retained reports created on the current UTC day; deleting a report reduces this particular count. Do not present it as 200 unique people or a lifetime submissions/day counter.
- Existing atomic rolling quotas: 10 admitted attempts per 60 seconds for intake and separately 10 for deletion, including failures/retries. At most 20 short-window attempt rows. A daily HMAC of the edge-supplied IP/network is retained briefly; raw IP/UA are not in report rows. The provider still processes connection data.
- Reports and tombstones expire after 30 days. Expired reports are never returned in the owner view even before physical cleanup.
- Prepared `cloudflare/private-diagnostic-cleanup.ts` adapts the existing tested cleanup algorithm to private-only tables and heartbeat; HTTP returns 404. It has NO deployed cron/config. Intended hourly cron and operational alert must be separately approved/configured/verified before activation. Cleanup emits private_diagnostic_cleanup_success/failure without row data. Legacy cleanup cannot refresh the private heartbeat or remove private rows, and private cleanup cannot touch legacy rows. A healthy legacy heartbeat never opens this intake.
- Backup/platform-log retention is governed by the provider; do not promise instant removal from every backup.

## Owner-only read design and exact auth blocker

`/admin/private-diagnostic` is an empty public shell; no report is rendered at build time. Both list and detail call `/api/admin/private-diagnostic`, which checks the separate review enable flag and existing `isDiscordAdmin` verifier before any DB read. List contains only receipt/creation/expiry and pages of at most 20; detail validates the stored fixed schema. All results/errors are private/no-store/noindex. Unknown/expired IDs return 404. React renders plain text, never raw HTML. The private UI routes have restrictive same-origin CSP, no analytics/ads, no referrer and no public editorial snapshots.

Existing auth uses the shared `gemnao_discord_admin` HttpOnly/SameSite=Strict cookie and existing `DISCORD_ADMIN_TOKEN_HASH` / `DISCORD_ADMIN_TOKEN`. The code can authenticate a key holder, **not prove that only the owner holds that key**. Until the owner confirms sole authorized custody and the existing login works, keep `PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED` OFF. If others share it or a separate role is required, design/approve a narrower existing identity/role integration first. This PR generates no secret, changes no access rights and adds no unauthenticated substitute.

## Local verification (synthetic data only)

From repository root, with SDK 10.0.401:

```sh
dotnet build native/windows-diagnosis/Gemnao.Diagnostics.csproj -c Release
dotnet run --project native/windows-diagnosis/tests/Core.Tests.csproj -c Release
dotnet run --project native/windows-diagnosis/tests/Core.Tests.csproj -c Release -- --write-private-fixture /tmp/private-native-fixture.json
python3 native/windows-diagnosis/tools/verify-source.py
node scripts/check-private-diagnostic.mjs
node scripts/check-private-diagnostic-browser.mjs
node scripts/check-private-diagnostic-integration.mjs
node scripts/check-diagnostic-feedback-d1.mjs
node scripts/check-diagnostic-feedback-integration.mjs
```

The D1 test uses actual local Miniflare D1 and staged schema with synthetic data, not remote bindings. Browser tests use Chromium with mocked transport; the native fixture is generated by the real C# exporter and accepted by the web validator. They do not establish Windows UI behavior, live transport, existing operator authentication, remote retention or alert delivery. All such checks remain unrun.

Current results: 416 native synthetic tests, zero failures; net48 x64 Release builds with zero warnings/errors; 718 paired resources and safety guards pass. 20 private local D1 groups (both schemas share one synthetic DB; legacy contents are compared before/after private operations, with explicit cross-namespace receipt, salt/quota, heartbeat and cleanup tests), 10 synthetic Chromium UI groups and private worker/privacy integration checks pass. Full repository `pnpm typecheck` (`tsc --noEmit`) passes after restoring dependencies with `pnpm install --frozen-lockfile --ignore-scripts` (CI mode and writable XDG directories). The earlier missing `@playwright/test`/implicit-any failures were an incomplete local dependency installation, not remaining base-code errors. Package manifests and lockfile are unchanged; focused lint also passes. See the PR for final build/regression results.

Final local checks also passed: full site build, existing feedback 13 local D1 groups, existing feedback/privacy integration, default download/hash checks, and the actual built Pages private screens with CSS/JS HTTP200, no-store/noindex/CSP, intake closed and owner API HTTP401 with no DB binding. No live resource was used.

## Current activation boundary

See ACTIVATION.ja.md for the single remaining checklist. Existing QA metadata observations do not establish current binding/heartbeat, free quota headroom, unused data, or permission to reuse the DB. No operational counts or report records are included here. The rc2 ZIP is unchanged; this revision changes only unmerged web/storage candidate code. Conversation-only notification remains unconfigured: a supported authenticated private read connector is required before polling, and polling is not an instant webhook. No public metadata or GitHub relay is introduced.
