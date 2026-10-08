# PR 102 manual OG artifact workflow

This is a one-purpose, manually dispatched, read-only workflow for source
`512c9dd1abf8e699418e01bb8c907143319617e8` on
`content/three-game-guides-20261008`. It does not commit, push, merge, deploy,
modify a protected environment, or access Cloudflare secrets.

## Activation and run
1. Review and merge only the workflow/helper PR into the default branch `gemunao`.
   Do not merge content PR #102.
2. Open Actions → **PR 102 OG cards and checks (manual, read-only)**.
3. Choose **Run workflow**, select `gemunao`, and run once. There are no inputs.
   CLI equivalent:
   `gh workflow run pr102-og-artifact.yml --repo poe2-build-navi-jp/gemnao --ref gemunao`
4. Wait for the exact run to complete. Download `pr102-og-<run_id>-<attempt>`.
   A failed run may contain diagnostic logs; that is not a successful build.

GitHub requires the workflow definition on the default branch for manual dispatch:
https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch

## Permissions and bounds
- Only `contents: read`; unspecified GITHUB_TOKEN permissions are none.
- Built-in token is used by checkout and the two fixed-branch read checks only;
  checkout never persists credentials. No new token or repository secret.
- No push/PR/schedule/workflow-run trigger. Fixed repository, default-branch
  dispatch, immutable article source SHA and before/after source-head checks.
- Single concurrency group; 35-minute job timeout; seven-day artifact retention.
- Pinned checkout/setup-node/upload-artifact actions; pinned Node/pnpm and binary
  PyMuPDF/Pillow dependencies. Application dependencies use the existing lockfile
  and disabled installation lifecycle scripts.
- Build/check steps never receive a write token. The workflow cannot publish content.
- No cache or deployment, and no application package/build/runtime changes.

Permission reference:
https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions

## Accepting generated files
Require BOTH a successful exact workflow run and `reports/READY.txt`.
Inspect `reports/outcomes.json`, logs, and `reports/verified.json`; verify the
source SHA and all 37 SHA-256 file checksums. Visually inspect all 36 PNGs.
The helper verifies 1200×630 PNGs, exact path allowlist, unchanged existing OG
manifest hashes, and all 36 prerendered pages' titles/descriptions/language,
canonical/hreflang, sitemap membership, OG paths and local CSS/JS asset existence.
The generated manifest is copied byte-for-byte, never synthesized by this helper.

Only `commit-files/lib/og-image-manifest.ts` and the 36 explicitly enumerated
`commit-files/public/images/og/...` PNGs may be committed using the existing
GitHub connector to `content/three-game-guides-20261008`.
Immediately before committing, verify its head still equals the pinned source;
use a normal fast-forward update with an expected-SHA lease. Never force-push,
commit HTML/reports/build files, or update `gemunao` from this artifact.

If any check fails, retain the draft and inspect logs. Do not waive checks or
hand-edit the manifest. Source changes require a separately reviewed pin update.
After generated assets are committed, recheck the exact content commit's normal
Pages preview, desktop/mobile rendering and HTML/CSS/JS HTTP delivery. Artifact
checks do not replace visual review or authorize production publication.
