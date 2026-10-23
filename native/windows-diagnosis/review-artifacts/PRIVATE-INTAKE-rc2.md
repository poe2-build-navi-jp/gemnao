# Private intake candidate 0.6.1-rc.2

Review only; not verified on a real Windows PC, not a production release or default download.

Source commit: 49dcfa16cbe411170acb49e35e2452433601466a
ZIP: gemnao-game-diagnosis-0.6.1-rc.2-windows-x64.zip
Bytes: 327785
SHA-256: 4ef3551d9f5e8c6ef25d0717b4ca211ac6d9059f85d4c4f0ba1d1feef83ff18b

Includes native C# source and JA/EN instructions. All 62 packaged files and payload hashes were checked locally. Native app exports fixed-schema JSON locally; it does not send data. Browser intake requires preview, unchecked-by-default consent, and explicit submission. Intake and owner review remain disabled pending separately approved setup and verification.

See [Japanese activation and Windows checks](../docs/PRIVATE-INTAKE-ACTIVATION.ja.md), [design and QA](../docs/PRIVATE-INTAKE-CANDIDATE.md), and [Windows candidate checklist](../docs/WINDOWS-CANDIDATE.ja.md). Repository docs/private-diagnostic/ACTIVATION.ja.md is the authoritative activation checklist.

Local verification passed: native Release build (0 warnings/errors), 416 synthetic native tests, 15 isolated D1 test groups, 10 Chromium groups, private-route integration and built-HTTP checks, existing feedback/privacy regressions, and full site build. Full type checking still reports pre-existing Playwright dependency/type errors. No real Windows run, production migration, credential change, live private intake, or scheduled cleanup activation occurred.
