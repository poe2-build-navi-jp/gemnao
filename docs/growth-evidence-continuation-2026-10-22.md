# Growth work: evidence and continuation, 2026-10-22

Base: `75dcabf387d3f5294c25a5be32862ea873458f08` (clean checkout). Read AGENTS.md and CLAUDE.md; no repository `.agents/skills` or populated workspace `.agents` were available.

## Search decisions (areas 1 and 2)

Recent available data does not justify further keyword/title rewrites or new symptom articles. Recent edits require observation before additional changes. Preserve the recent content and related-article matching improvements.

## Changes (areas 3 and 4)

- Add a reusable, selectively rendered source-evidence section to the JA/EN Rocket League DualSense article. It separates official instructions, attributed reports (none used here), and editorial/general checks. It states source-review date, platform/controller/launcher scope, unspecified game build, no personal reproduction, and no universal effectiveness claim.
- Sources read on October 22: [Epic's DualSense instructions](https://www.epicgames.com/help/c-37599050/c-42869540/a15512450) and [Sony's PC connection guidance](https://www.playstation.com/en-us/support/hardware/pair-dualsense-controller-bluetooth/). Official connection/update advice is distinguished from the editor's comparative diagnostic sequence. No new claim of a fixed game patch.
- Diagnosis promotes exactly one existing matched, untried recommendation. It never substitutes an unrelated article. PC-wide/safety/information-shortage cases do not get this extra link, and recording improvement suppresses further promoted changes. Existing recommendation and related-article matching remain intact.
- The existing resolved-fix save control accepts actual settings/connection details in JA/EN/ZH/ES. It uses the current notebook and My Games registration; no schema, backend, collection or deletion change. Explicit save only; existing resolved records are not overwritten on repeated save. Existing settings snapshots can still copy a saved note explicitly.

## Verification

- `pnpm build`: PASS (621 editorial snapshots, 603 sitemap URLs, 548 OG cards current). No titles/new articles, so no OG regeneration needed.
- `pnpm typecheck`: PASS after installing the lockfile's missing `@playwright/test`. Before installation the checkout reproduced 19 type errors from that missing dependency. No package/lockfile edits.
- Global lint: initial 29 errors; after dependency repair 10 remain, all in unchanged `components/discord-server-directory.tsx` and `tests/feedback-stats-d1/control.test.mjs`. Changed-file lint passes. Do not describe global lint as clean.
- Localization: PASS, 347 translated pages.
- Diagnosis rule/specialist suites: 34 PASS.
- New `node scripts/run-growth-continuation-check.mjs`: PASS (one matched article, safety exclusions, bilingual evidence, actual setting retention, duplicate save and corrupt-store preservation).
- New `TEST_BASE_URL=http://127.0.0.1:8797 node scripts/check-growth-continuation-browser.mjs`: PASS, JA/EN at 360/1280; interrupted save, actual settings, registered-game preservation, repeated save, My Games reopening, screenshots, no overflow or asset/runtime errors; diagnosis single matched guide, back navigation and improvement persistence after reload. Screenshots were visually inspected in `/tmp/gemnao-growth-screenshots/`.
- Existing settings, support, My Games transfer and article-diagnosis checks: PASS.
- Browser settings suite: PASS, JA/EN/ZH/ES at 360/390/1440 plus 320px long text; settings copy/save/compare, reload, cross-tab changes, quota/corruption preservation, notebook and diagnosis preservation. All APIs mocked; external requests blocked.
- `scripts/check-october-stability-build.mjs` and `scripts/check-gears-wardogs-build.mjs`: PASS for all eight new JA/EN routes, self-canonical, reciprocal hreflang, no article noindex, sitemap inclusion, OG, anchors, and crawlable hub/backlinks. `dist/client/robots.txt` allows `/` and advertises sitemaps. No concrete crawlability defect found.
- English article regression still fails at the pre-existing `English home discovery: /games/aion2/login-error` assertion. No changes to that home or article.

Browser commands require the production local server to run with `NEXT_PUBLIC_DIAGNOSIS_ENABLED=true NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA=false`; otherwise dynamic `/diagnose` correctly remains unavailable. First diagnostic test attempts used an incomplete mock/seed; corrected tests use the existing complete config contract and valid stored answers.

## Publication verification limits

The production branch was checked by `git ls-remote`: still the base SHA before publication. Live GETs for the eight pages, hubs, sitemap and robots failed at the environment CONNECT proxy with 403 before the origin. This is not an origin denial or evidence of a live page defect; no bypass attempted. GitHub check-run API lookup via `gh` was also forbidden. Parent-side provider-check and live-body verification are required. No DB, credentials, account permissions, billing, report acceptance, deletion routines or Reddit changes.
