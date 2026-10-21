# ST-3100001: first action and anonymous counts

## Scope and base

Base: `605493aafe59a2af47b160387b98861820a36efe` on local `work`, initially clean. Read `AGENTS.md` and `CLAUDE.md`. No repository `.agents/skills` or `/workspace/.agents/skills` exists. `git ls-remote --symref origin HEAD refs/heads/gemunao` returned this same SHA for GitHub HEAD and `gemunao`; the local remote-tracking reference was stale. Previous quality-kit changes were not present or imported.

Repository docs describe Cloudflare Pages deployment with prepared static HTML and the worker wrapper. Historical English publication notes identify a successful `gemunao` deployment, but neither those notes nor GitHub HEAD establishes the current Pages production-branch setting. No push, deployment, IndexNow, configuration or permission changes were performed. Publication remains pending current Cloudflare production-branch evidence and matching deployment/source confirmation.

## Changes

- Only the Japanese and English ST-3100001 hero gets a smaller displayed heading, a concise first-check conclusion and a `#sync-time` CTA ahead of save controls. Full titles, article data, URLs, metadata, original conclusion, references and save behavior remain intact.
- Shared Japanese response presentation replaces the prominent percentage with resolved/unresolved counts and cumulative total, retaining the existing ten-answer visibility gate.
- Japanese and English STEP response presentation explains historical counts and separate article/STEP aggregation. No date was invented. Existing older unsuccessful responses remain in the article aggregate; they cannot be assigned retroactively to individual methods.
- No API, database, aggregation function, submission availability, diagnosis initial state, related-article content or weekly-label changes.

## Aggregation evidence

`lib/feedback-db.ts: readFeedback` reads `issue_feedback` by `game_slug`, without a date filter. The UI selects the article's topic. `readSolutionMethods` reads `solution_method_feedback` by context and article topic, also without a date filter. Japanese and English use `game-ace-combat-8-error-st-3100001`, with the canonical topic and method IDs.

`recordStepResult` increments a method's success/failure counts; successes also increment article success, while article failures are only incremented for the eligible final-step report. These are separate but overlapping aggregates, not independent observations to add together. Historical success counts remain included. Earlier method failures were not recorded; the schema cannot supply their method or an exact collection start date. See `docs/feedback/step-results-rollout.md`.

## Validation

- PASS: complete build-script sequence, using installed local executable `node_modules/.bin/vinext build --prerender-all --prerender-concurrency 1`, followed by `scripts/prepare-pages.mjs`, `scripts/check-static-search-assets.mjs`, `scripts/generate-og-cards.mjs --check`, with the package script's diagnosis environment values. 609 HTML snapshots, 591 sitemap URLs, 536 OG cards verified.
- PASS: changed-file `oxlint`; `git diff --check`; localization check (340 translated pages).
- PASS: `check-localized-step-results.mjs`, `check-step-result-ui.mjs`, `check-step-result-client.mjs`, `check-feedback-input.mjs`, `check-feedback-deadline.mjs`.
- PASS: new `scripts/check-st-article-ux-browser.mjs`, both languages at 375/390/430/1440 px. Verifies first-screen CTA before save, actual anchor navigation, save operation, no horizontal overflow, canonical, OG image, references, and historical count fixtures (article 1/14; STEP 1 1/21). These numbers are mocked test data, not a claim about current production totals. No answer submissions or production DB writes.
- Visual inspection: Japanese/English 375 px hero screenshots and Japanese STEP screen. Screenshots are in `/workspace/scratch/gemnao-ux-evidence/`; test accepts `TEST_EVIDENCE_DIR`, `TEST_BASE_URL`, `CHROMIUM_PATH`.
- FAILED: literal `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm check:localized` could not start normally because the environment's pnpm automatic dependency check attempted to create missing `/home/agent/.local/share/pnpm` (ENOENT). Existing binaries/scripts were then run directly; no dependency/settings change.
- FAILED: repository-wide direct `oxlint` (29 diagnostic lines in unchanged files, including Discord directory hooks/accessibility, missing Playwright types, and floating promises in tests).
- FAILED: direct `tsc --noEmit` due to absent installed `@playwright/test` and consequent implicit-any errors in existing diagnosis browser tests. No changed-file type errors reported. Browser regression used the environment's installed `playwright` and `/usr/bin/chromium`.
- NOT RUN: production/post-deployment validation, full unrelated test suites. Publication is deliberately pending; it was not denied by an approval tool and has no uncertain deployment outcome.

Logs: `/tmp/gemnao-build-final.log`, `/tmp/gemnao-prepare-final.log`, `/tmp/gemnao-browser.log`, `/tmp/gemnao-lint-direct.log`, `/tmp/gemnao-types-direct.log`.
