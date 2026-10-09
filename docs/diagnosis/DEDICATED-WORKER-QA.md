# Dedicated diagnostic QA Worker

This candidate uses a new `gemnao-diagnostic-qa` application Worker. It does not
modify the production Pages configuration, preview bindings, either independent
cleanup Worker, schemas, migrations, credentials, DNS or account plan.

## Exact target and stopped state

- Account: `6a09a32cba1288cccce5912015086a35`
- `DIAGNOSIS_DB`: `72c728f5-1656-4e26-bc11-7c508ae155c3`
  (`gemnao-diagnosis-preview-20261007`)
- `FEEDBACK_DB`: `3a714aee-e602-4590-afd0-3c2ddd9aea8f`
  (`gemnao-diagnostic-feedback-preview-20261007`)
- No ordinary `DB` binding, environment inheritance, service bindings or cron.
- Every intake/storage/metrics flag is false. The source-pinned and runtime
  origin is `https://gemnao-diagnostic-qa.soykururu143.workers.dev`, verified by
  the account-subdomain GET in [health run 37648312766](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/37648312766)
  at 2026-10-07T16:11:08Z. This is a planned hostname, not a deployed-site claim.
- `workers_dev` is requested for the new test service, with additional version
  preview URLs disabled. The hostname must not be guessed.

The database identities came from the successful
[two-pair provisioning run](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/37640786041).
That receipt does not prove a subsequent scheduled cleanup succeeded.

## Minimal deployment path

Keep the pinned Vinext/Vite/Wrangler dependencies and normal `pnpm build`.
`scripts/prepare-worker-preview.mjs` copies an explicit asset allowlist into a
separate upload directory and writes an integrity manifest outside that directory.
The thin Worker entry wraps the existing compiled Pages handler, preserving
its private routes and same-origin API checks. Do not deploy the raw Vinext
server entry, which bypasses that wrapper.

Local preparation:

```sh
pnpm build
node scripts/prepare-worker-preview.mjs
node scripts/verify-worker-preview-artifact.mjs
pnpm exec wrangler deploy --config wrangler.worker-preview.json --dry-run --outdir .wrangler/worker-preview-dry-run
```

After independent review and exact deployment approval, an existing protected
GitHub Environment may run the same pinned Wrangler command without `--dry-run`.
Use a small manual job with fixed repository, source SHA, account, Worker name,
configuration and asset manifest; never accept arbitrary target/command inputs.
Do not reuse the old two-pair provisioning approval as new Worker approval, or
pass a Cloudflare secret to unreviewed source/build scripts. Build/test before the
credential-bearing step, and verify artifact hashes again before deploy.
`dist/worker-preview/asset-manifest.json` hashes each uploaded asset and the five
Worker/config inputs. The verifier rejects altered, extra or missing files and
symlinks. The manifest itself must be covered by the approved artifact digest;
an untrusted manifest cannot approve its own contents.

Before that step, use protected read-only provider calls to verify that this
Worker name is unused, and recheck the two database/cleanup pairs. The account
subdomain read and both fresh cleanup markers succeeded in the linked health run.
If the name exists, stop rather than overwrite it. Pin the verified exact URL in
`lib/preview/worker-origin.ts` and all three origin variables in the separate
Worker config, then rebuild and retest. No wildcard `workers.dev` permission is
introduced. A missing, malformed or mismatched pin remains fail-closed.

Official support: [Workers static assets and ASSETS binding](https://developers.cloudflare.com/workers/static-assets/binding/).
Worker-first routing keeps the outer policy ahead of every asset. Exact-path
asset handling avoids redirects for internal snapshot fetches.

## Public surface and privacy

- Only diagnosis/feedback pages, their APIs and frontend assets are exposed.
  `/` redirects to `/diagnose`. Ordinary votes, requests, contact, admin, status
  and article routes return 404 on this test Worker; production is unchanged.
- Every response is private/no-store/noindex/no-referrer with a self-only CSP.
  Third-party ads/analytics cannot execute or send browser network requests.
- Server bundles, source maps, configuration, hidden files and internal paths
  are excluded from assets or denied by the outer policy. Editorial snapshots
  remain available only to the inherited application's internal ASSETS fetch.
- The wrapper refuses an accidental ordinary `DB` binding. D1 feature access
  continues to require its dedicated binding and existing permission flags.
- This public URL is not authenticated access control. Use synthetic enum-only
  QA records, never personal information, real logs or ordinary site votes.

## Activation and deletion gates

Keep all intake flags off until both scheduled cleanup heartbeats are independently
verified fresh (under two hours), identity/configuration review passes, and the
exact-origin synthetic remote test scope is approved. Cleanup readiness is not
fabricated or manually refreshed to satisfy that requirement.

Synthetic tests create a bounded diagnosis share and one consented feedback
report, verify retry/ownership behavior, then delete both via their owner paths.
Existing 30-day record expiry, hourly cleanup, feedback deletion tombstones and
short-lived quota metadata remain unchanged. Tombstones prevent replay until
their original expiry; provider backup/log retention is separate. During an
intake stop, retain storage bindings/cleanup and the verified origin settings so
authorized owner deletion continues. Never use a schema drop as cleanup.

## Tests

```sh
node --test tests/worker-preview/policy.test.mjs
node scripts/check-worker-preview-runtime.mjs --skip-browser
node scripts/check-worker-preview-runtime.mjs --local-enabled --skip-browser
bash scripts/test-worker-preview-synthetic.sh
```

The runtime check uses real local Miniflare D1/Workers assets, blocks outbound
fetches, and can run Chromium with all page requests intercepted locally.
`--skip-browser` explicitly does not verify browser behavior.

`--local-enabled` uses the unmodified hostname-pinned client/server build but
routes every request through local Miniflare. It never supplies provider database
IDs to the test runtime: both D1s are fresh in-memory instances. The deployed
configuration file remains off; only that local instance receives enabled flags.

The enabled synthetic fixture is a disposable source copy with one fixed fake
origin, all-zero account, dummy database IDs and `workers_dev=false`. It rebuilds
both client and server and never deploys. Local direct cleanup calls are permitted
only in its newly created in-memory D1s; they are not remote Cron evidence.
