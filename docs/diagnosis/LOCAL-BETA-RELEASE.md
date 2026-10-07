# Local-only diagnosis beta candidate

This is a narrow stacked change on the reviewed dormant integration. It is not a publication approval. Production activation still waits for independent review of the exact commit and an allowed browser/manual QA pass; the cloud browser refused the earlier dormant preview and that is not a completed browser test.

## What becomes usable

- Six-symptom question flow and evidence-linked recommendations.
- Optional answers, game name and tried/results history stored only in this browser's localStorage. No account or cross-device sync. Thirty-day age is checked on reopening, not while the browser is closed; explicit local reset is available.
- Diagnosis pages and their links use full-document navigation, exclude ads/GA, have private/no-store CSP and noindex. They remain absent from sitemap.

## What cannot be activated by this change

`DIAGNOSIS_LOCAL_BETA=true` is the only new runtime variable in production and isolated preview configuration. The build sets `NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA=true`. No diagnosis storage/sharing/metrics flag is set. Feedback and game-request flags/credentials remain absent. No schema, binding, worker Cron or credential changes.

The beta configuration response returns `enabled:true`, `sharing:false`, `metrics:false`, `localOnly:true` before accessing D1. Public session/create/event/read/update routes remain denied in local-beta mode even if old storage flags were accidentally set; shared pages are refused. Share UI is not mounted, and metrics cannot be enabled by runtime config in a local-beta build. Pre-existing owner deletion still requires its separate explicit storage permission; local-beta does not remove it.

## Verification

- 35 diagnosis tests, including no D1 touch under conflicting old runtime flags and preservation of pre-existing owner deletion.
- Actual worker tests cover noindex/private local pages, denied shared pages and dormant defaults.
- Typecheck and full lint passed.
- Full local-beta build/Pages/OG passed: 285 editorial snapshots, 272 sitemap URLs, 204 OG cards. `/diagnose` remains outside sitemap.
- Actual locally served built Pages output tested with a temporary isolated config containing **no D1 binding**: config capability, rejected POST/session/events and shared URL, both pages' noindex/no-store/CSP/privacy copy, all referenced CSS/JS 200, sitemap exclusion passed. The fixture uses copied built assets outside the repository because Pages discovers config from the served assets directory; no remote resources are accessed.
- Browser behavior at 375/390/430px, keyboard flow, repeated/back/reload transitions, local reset and analytics network exclusion still need an allowed browser/manual reviewer. Chromium launch is blocked in this executor; do not treat HTTP or shallow tests as browser QA.

## Release sequencing

Merge the dormant integration first only after its review. Retarget this stacked change onto the resulting production branch and verify identical intended changes/current SHA before approval. Do not merge the old PR21/24/45 in addition. After approved release, verify exact deployment, `/api/diagnosis/config`, `/diagnose`/privacy HTML and assets, noindex/sitemap exclusion, disabled collection capabilities and the local browser flow. If UI problems occur, roll back this UI-only commit or remove both local-beta activation flags; no production data migration needs reversal.

Review follow-up: local-beta sitemap exclusion now takes priority even when the older build activation flag is accidentally true. The beta flag is explicitly passed to Vinext, Pages preparation and OG validation, since each is a separate process. The full package build command passed with the old flag deliberately true, still producing 272 URLs without `/diagnose`; actual no-DB served HTTP checks passed again. Start/result copy was also corrected so beta never advertises optional sharing or shared-page updates.
