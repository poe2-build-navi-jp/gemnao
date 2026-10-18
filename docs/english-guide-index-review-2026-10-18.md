# English guide index and four translations — 2026-10-18

Prepared locally from production `c313a3a9bd1f467b347fe253c19a2a88ecffacd2`. Publication is pending approval for this batch.

## Deliverables

- `/en/guide`: symptom-grouped index of exactly seven English common guides.
- `/en/guide/verify-steam-files`: preparation, verification, interpretation and recurrence (four canonical STEP IDs).
- `/en/guide/gpu-driver-update`: identify hardware, official/OEM update route, comparison and rollback (three IDs).
- `/en/guide/black-screen`: Windows versus game scope, display/settings comparison, file/add-on comparison (three IDs).
- `/en/guide/low-fps`: baseline, caps, resolution comparison and next checks (four IDs).

The index includes the existing Steam-launch, crash and stutter guides. Desktop and mobile English navigation lead to the English index; Chinese/Spanish navigation retains its explicitly Japanese destination. English search, home discovery, article breadcrumbs and related links are connected. Only real Japanese/English alternates are declared. Five OG images were generated. The Japanese index changes only to add reciprocal hreflang.

## Editorial checks

The Japanese articles supply the scope and STEP identities. English procedures were checked against the official URLs linked in each article; explanations and comparison order are editorial adaptations, not hardware testing or measured success claims.

- Steam verification: official Installed Files control confirmed; Steamworks explicitly documents Workshop downloads triggered by verification. The guide distinguishes repaired managed files from additional mod files, requires save/mod records, and does not diagnose storage failure from reacquisition counts.
- GPU drivers: NVIDIA Drivers/Reinstall, AMD Manage Updates/Install Manager and Factory Reset limitations, and Intel installation/OEM/rollback guidance checked. Intel's DCH-versus-legacy warning is retained. No driver-cleaning tool, security shutdown or routine reset is prescribed. Installer screens and rollback availability are qualified by version/hardware.
- Black screen: Microsoft blank-screen and HDR guidance checked. Game-only startup/audio symptoms are separated from no signal, absent desktop and system restarts. Configuration paths are not guessed; only publisher-confirmed files may be backed up and moved. No game-specific third-party mod documentation is presented as a vendor source.
- Low FPS: Microsoft DirectX CPU/GPU workload, Task Manager engine graphs and per-app graphics guidance checked, plus Steam performance-monitor and Microsoft refresh-rate documentation. Consistently low FPS, intermittent hitches and network position jumps are separated. One-variable comparisons and generated-frame caveats are explicit.

Official source links and confirmation date are included in article data at `lib/localized/common-guides-more-en.ts`. Pages whose Steam support body was not exposed by the web reader were cross-checked with the official indexed verification text and the existing Japanese source-backed procedure; no unsupported detailed Steam UI was invented.

## Validation

The isolated `/tmp/gemnao-guides-batch2` build excludes the three unrelated collector-proposal files.

- Full production-flag build and preparation: passed; 445 editorial snapshots, sitemap 424 URLs, image sitemap 21 pages.
- TypeScript: passed with the environment's installed Playwright type mapping.
- Changed-file lint and whitespace checks: passed.
- Localized renderer/parity: 197 pages passed, including the new index and each guide's Japanese STEP IDs. Seven distinct index entries asserted.
- Generated English HTML regression: 11 article pairs and 525 internal links/anchors passed. Canonical, reciprocal hreflang, language menus, schema, OG, sitemap and home discovery checked. Index metadata, seven-item collection schema and absence of invented alternates checked separately.
- Static search assets: passed. OG freshness: 364 cards, five new images.
- Local production browser at 375, 390 and 1440px: index plus four articles (15 combinations), one H1, no horizontal overflow, no broken fragment links or JavaScript exceptions, and all requested local CSS/JS returned 200.
- Seven index cards, breadcrumbs, mobile navigation and four new-guide search queries at each width (12 searches) passed. `/zh/guide`, `/es/guide` and representative untranslated article routes returned 404.
- Screenshots inspected for mobile and desktop index and mobile driver article. Browser evidence: `/tmp/gemnao-guides-batch2-browser.json`; runner: `/tmp/check-guides-batch2.cjs`. External requests were blocked and API reads intercepted; zero API writes and no real GA events.

No push, deployment, Google submission, credentials or live data changes were performed. The unrelated collector code, operations-test changes and local proposal remain outside this commit. Remaining action: approve this batch for production publication, then verify deployment and public delivery.
