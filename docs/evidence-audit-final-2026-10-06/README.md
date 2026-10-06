# Final correction bundle — 2026-10-06

Base: PR74 `2e6407701cf2ee64fcfee7f7f85f63e73140fc7b`. This bundle preserves the PR74 GPU changes and combines seven scoped corrections/qualifications. It has not been merged or published when this record is written.

## Corrections and source scope

- HELLDIVERS 2 storage: attribute Steam minimum 135 GB / recommended 40 GB and PlayStation 100 GB instead of treating one value as universal. Ask readers to check the current Steam install/update requirement. The existing EN/ZH/ES hub introductions receive the same qualification; their source table retains the attributed Steam minimum and its omitted contradictory recommended value. Primary links are in the code and `comparisons-97.json`.
- WARDOGS: the Steam table checks Japanese interface support, not subtitles. Correct the shared Japanese-support datum without inferring a categorical lack of subtitles. This focused hub does not currently display that field; this is a source-data correction, not a claim that a visible subtitle sentence was removed.
- CoD MW4: Activision's PC footnote says a mobile number linked to Activision may be required. The hub data and existing individual article now identify the requested account and conditional nature. Additional Steam requirements are not denied; current Steam content was age-gated and no age verification was submitted.
- CoD UAC: hub, individual article and shared TPM guide limit permission advice to an expected official-launcher flow, CODBrokerInstaller.exe / enrollaik.exe, and verified publisher/source. Unexpected or unidentified programs must not be permitted. This is a safety qualification, not proof the old official executable procedure was false.
- MOD hub: use the installation method (manager/manual/Workshop), move only identified self-added files, test first to the title screen, and do not overwrite MOD-dependent existing saves. This summarizes the already detailed safe-removal guide. One affected OG card was regenerated and visually inspected.
- HELLDIVERS 2 GameGuard: replace blanket folder deletion with Steam integrity checking and, when needed, the current Arrowhead procedure for the specific error. Do not delete unidentified files/folders. This is a cautious narrowing of unsupported universal advice, not proof every deletion procedure is wrong. Existing localized Error 114 guidance is already source-specific and is retained.
- WARDOGS queue: retain normal queue waiting but prioritize an official hotfix/update/restart instruction. Apply the condition to the shared hub data, article conclusion, quick fact and action; preserve STEP IDs. Existing Steam-news source already explains the launch hotfix.

## Validation actually performed

`validation/exit-statuses.json` records exit codes. Empty type/lint logs are successful silent runs.

- TypeScript, lint, GPU boundary/legacy-ID regression, editorial safety, saved-solutions and the new focused corrections regression: PASS.
- Existing localized check: 79 translated pages PASS.
- The initial `pnpm build` failed during pnpm dependency preflight (missing home store path), before project compilation. Using the same package.json build command via `npm run build` with copied existing matching dependencies succeeded. No dependency, credential, billing, environment or security setting was changed.
- Final build: 285 editorial snapshots, sitemap 272 URLs, image sitemap 21 pages, 204 OG cards current. Existing `ERR_UNSUPPORTED_ESM_URL_SCHEME` cloudflare protocol warning occurs during speculative prerender; final exit is 0 and snapshot assertions pass. It is recorded, not hidden.
- Snapshot checks: all 285 retain canonical, head metadata, locale language, verification/AdSense/schema and exclude dynamic/private/query/RSC routes.
- Targeted generated-HTML assertions: HELLDIVERS 2 JA/EN/ZH/ES, WARDOGS hub/article, CoD hub/article, MOD hub and save hub. Focused hub launch guidance is in FAQ JSON-LD; these checks do not falsely call it visible UI. The WARDOGS language claim is tested against data, not an absent rendered section.
- Current cloud browser read-only observation of the exact base preview `https://cff132e3.gemnao.pages.dev/trouble/save` confirmed local-preservation-first and normal-backup-only sync text. That existing preview is PR74 base, not this unpublished correction bundle.

## Browser evidence inherited, not rerun

The GPU four-width fixture report is `docs/evidence-audit-batch16-2026-10-05/validation/my-pc-browser.txt`; its script is alongside it. It covers 375/390/430/1440px, legacy selection, discarded unsaved edits, nine explicit variants, keyboard save, reload, Back/Forward, removal and no overflow/errors, using local fixtures and API mocks.

`validation/inherited-gpu-proof.json` compares the tested premerge commit `bf69b32c77fba68e7a471f04a626d3c1b5897c82`, PR74 base and this working tree: GPU source, /my page/dashboard, package manifest, lockfile and Vite configuration hashes are identical. `validation/unchanged-ui-diff.txt` is empty across all app/components and those files. Save-hub safety text at base is also byte-identical to reviewed `71f20dc6e5ece85683fa2ee5732ae490b9e25f98`; its earlier four-width report is in `docs/evidence-audit-batch14-2026-10-05/validation/save-review-browser.txt`.

The known-denied Chromium launch route was not retried. New longer article/hub text was not newly reflow-tested at four widths, and no new full-site mobile/HTTP sweep, game executable, Windows UAC, real save, D1 or user record was exercised. Source equality supports inherited GPU evidence, not a claim that the final modified text has new mobile screenshots.

## Audit reconciliation and limits

The 15 groups marked read-not-compared in the old batch16 ledger had since received a separate limited primary-source comparison. This bundle incorporates that completed research rather than claiming it had never occurred or repeating it. Four groups receive corrections; the other eleven receive only scoped research notes. Sources, remaining gaps and fetch/age-gate holds appear per group in `comparisons-97.json`; `scope-summary.json` is a compact view.

97 groups: 49 partial, 22 partial-with-corrections, 19 compared, 7 compared-with-holds, 0 read-not-compared. These are claim/scope labels only. All 97 retain `wholePageVerified=false`. No assertion that all pages, translations, diagrams, archives or game behavior are fully checked follows from those counts.

Examples of remaining limits: release-time CoD requirements and current Steam extra phone conditions; WARDOGS Family Sharing primary-source confirmation and paths/HDR; HELLDIVERS paths/display/controller details and the unresolved storage contradiction; Dragon's Dogma update/settings/API retrieval holds; detailed controller/date claims in unreleased games; past weekly issues, full Discord cards, figure/linked-guide claims and universal network/VPN advice. The exact limited findings and unresolved scopes are preserved rather than upgraded to full-page completion.

URLs, article/STEP IDs, persistence formats, database operations, SEO infrastructure, analytics and production deployment configuration were not changed. Only the requested wording/source qualification, one existing OG asset, focused regression and evidence records are in this bundle.
