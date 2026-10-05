# PR65 review follow-up: Onimusha black-screen navigation

The STEP 1 prose told readers whose screen remained black to skip STEP 2, but the Japanese skip link, unresolved action and saved continuation still selected the adjacent STEP 2. They now use the same explicit safe continuation, STEP 3 (capture tools / extra displays). Skipping does not mark STEP 1 as attempted or save a note. The unresolved result records only STEP 1 as attempted; explicit note saving retains STEP 3 as the continuation. No storage format changed.

A separate Japanese link says to use STEP 2 only once the picture returns. This conditional link disappears after a resolved result. The English article already uses static steps and the notebook's result selector, not Japanese per-step voting; it now links directly from STEP 1 to STEP 3 for a still-black screen / inapplicable shortcut and retains STEP 2's visible-menu condition. No English voting UI was added.

## Validation

- TypeScript, full lint, localization (79 pages), production build (285 editorial snapshots, 272 sitemap URLs, 204 current OG cards): pass.
- Editorial safety, editorial snapshots, English articles and safe-step-navigation content regressions: pass.
- `scripts/check-onimusha-black-screen-browser.mjs`: Japanese skip/unresolved → STEP 3, visible-picture link → STEP 2, no automatic note saving, cancel, explicit save, correct attempted vs continuation STEP, reload resume, resolved state; English safe link and notebook result/cancel; keyboard Enter and back/forward. Local synthetic fixtures, API mocks and external-request blocking only.
- `scripts/check-safe-step-navigation-browser.mjs`: existing Steam Input prerequisite, issue switching, cancel/save/reload, anonymous result deduplication and JA/EN/ZH/ES article layout.
- Both browser suites run at 375, 390, 430 and 1440 pixels using local built assets and a temporary Wrangler configuration without D1 bindings. No Cloudflare login, CAPTCHA, deployment or live data access.

The review's preview URL identified the defect; the fixed build was exercised locally. Windows / the game itself was not run. No claims about resolution rates or page-view impact are made; these tests verify web navigation and local persistence only.
