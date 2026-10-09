# Isolated sharing and consented-feedback preview candidate

Local candidate only. This document is not deployment approval. No live database
ID or preview origin is configured by this patch. Production `wrangler.json`,
its ordinary `DB`, build defaults, and the provisioning controller are unchanged.
The prerequisite feedback D1 limiter and dedicated diagnosis storage changes are
included before this patch.

## Preconditions before enabling a preview

1. Independently review this candidate and the exact built commit.
2. Verify the Cloudflare target is a Pages **preview**, not the production
   deployment or a production deployment alias. Select one exact HTTPS origin
   under `*.gemnao.pages.dev` from provider output. The hostname suffix alone does
   not prove deployment classification. The canonical production origin, other
   preview origins, HTTP, ports, paths, and malformed origin settings are denied.
3. Verify two newly created, separately identified, initially empty databases:
   `DIAGNOSIS_DB` and `FEEDBACK_DB`. Neither may be the ordinary production DB or
   the other feature's DB. Match the provider IDs and migration hashes against
   the reviewed provisioning receipt. Never infer or substitute an ID.
4. Verify each dedicated cleanup worker has only its own binding, the correct
   hourly schedule, and a successful real scheduled run. Apply only the matching
   schema. No fabricated/manual health timestamp is an activation prerequisite.
5. Bind those two verified IDs only to the selected preview. Keep production
   settings unchanged. Use synthetic QA inputs, never real logs or personal data.

## Preview-only runtime settings

Keep `DIAGNOSIS_LOCAL_BETA=true` and the normal beta build. No public build flag
or sitemap change is required. After the checks above, the reviewed preview needs:

- `DIAGNOSIS_PREVIEW_SHARING_ENABLED=true`
- `DIAGNOSIS_PREVIEW_ORIGIN`: the exact verified preview HTTPS origin, no slash
- `DIAGNOSIS_ENABLED=true`
- `DIAGNOSIS_STORAGE_ENABLED=true`
- `DIAGNOSIS_SHARING_ENABLED=true`
- `DIAGNOSIS_WRITES_ENABLED=true`
- `DIAGNOSIS_METRICS_ENABLED=false`
- `DIAGNOSIS_DB`: only the new diagnosis preview database
- `FEEDBACK_ENABLED=true`
- `FEEDBACK_PREVIEW_ENABLED=true`
- `FEEDBACK_PREVIEW_ORIGIN`: the same exact verified origin
- `FEEDBACK_DB`: only the new feedback preview database

The exception requires both the explicit preview flag and exact request origin.
A partial or invalid preview scope fails closed even if the old beta flag is
false. The browser also requires the runtime's explicit `previewSharing` mode
and a valid HTTPS Pages preview origin before displaying sharing. Cleanup must
be recent before new sessions, shares, updates, or feedback can be saved.
Preview metrics are forcibly disabled even if a stale metrics flag says true.
Neither service falls back to `DB`, auto-migrates, or guesses a binding.

Expected public status after successful cleanup:

- `/api/diagnosis/config`: `enabled:true`, `sharing:true`, `metrics:false`,
  `localOnly:false`, `previewSharing:true`
- `/api/diagnostic-feedback`: `enabled:true`, `canDelete:true`

A false readiness value is not proof that cleanup is healthy. Confirm real
scheduled execution separately. The preview origin/flags do not authorize any
production activation or persistent credential change.

## Stop intake without stranding deletion

Set `DIAGNOSIS_PREVIEW_SHARING_ENABLED=false` and `FEEDBACK_ENABLED=false`.
Keep the dedicated bindings, diagnosis storage permission, exact origin settings,
and cleanup workers in place. Existing authenticated/secret-verified owner
management and deletion remain available. Do not remove storage bindings or
cleanup as an intake rollback. Do not remove one scope setting to broaden access.

The existing 30-day retention, public-link disclosure, explicit sharing consent,
feedback consent/version checks, owner authentication, tombstones, quotas,
no-store/noindex headers, sitemap exclusion, and analytics/ad exclusions remain.

## Reproducible local verification

With existing dependencies available, run the package's standard build, lint,
and typecheck, plus:

- `node scripts/test-diagnosis.mjs tests/diagnosis/rules.test.ts tests/diagnosis/api.test.ts tests/diagnosis/preview-client.test.ts`
- `node tests/diagnostic-feedback/run.mjs`
- `node scripts/check-diagnostic-feedback-d1.mjs`
- `node scripts/check-diagnosis-integration.mjs`
- `node scripts/check-diagnostic-feedback-integration.mjs`
- `node scripts/check-isolated-feature-preview.mjs` after the Pages build

The final check exercises the actual built Pages worker with two fresh local
Miniflare D1 databases, no ordinary DB, disabled outbound network/Request.cf,
and no credentials. It checks missing-cleanup refusal, exact-origin readiness,
sharing, private page headers, consented feedback/retry, metrics-off behavior,
separate schemas, and owner deletion after intake shutdown. It does not replace
an independent code review, real provider binding/schedule verification, or
interactive browser QA of the selected remote preview.
