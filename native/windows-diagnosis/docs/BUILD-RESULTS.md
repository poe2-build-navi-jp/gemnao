# 0.6.0 bilingual Windows x64 validation — 2026-10-02 UTC

## Completed

- Linux x64, official Microsoft .NET SDK 10.0.401: net48 x64 Release compilation succeeds, **0 warnings / 0 errors**.
- **386 synthetic tests passed / 0 failed**. This includes the existing 352 tests and 34 localization/invariance/proofreading tests; several test cases iterate every resource, game/symptom, invalid value or state combination.
- **695 paired English/Japanese resource entries**, embedded in the EXE, checked for completeness, key references and absence of Japanese text in English application strings.
- Explicit Japanese-UI/default-English fallback; language round trips regenerate rule text and summaries without changing typed evidence, raw original names, rule IDs, enum values, JSON bytes or encoded history bytes.
- Null/malformed/IP-shaped driver-version values remain unknown in both languages and cannot enter JSON or become a claimed observed driver change. Collectors store invariant values; localized strings do not act as evidence sentinels.
- All 14 game-kind/symptom combinations generate English/Japanese plans with identical step IDs/order. History remains scoped to the exact selected EXE location/game category/symptom; another game/path/symptom is rejected. General-game feedback remains disabled.
- Prior safety-stop, incomplete/zero-event caveats, no automatic collection/repair/upload, manual-only steps and separate consents retained.
- Existing bounded XML/Steam/ZIP/history parsers and 3,000 deterministic malformed-input fuzz fixtures remain covered.
- Source safety guards pass: no network/repair/registry-write APIs, standard-user manifest, bounded reads, preview-confirmed exports and own-user history-only writes/Recycle Bin operation.
- Independent read-only source review found no remaining state-loss or safety blocker after correction of two initial UI resource references. Idle-only switching preserves answer/consent/history draft state; raw text boxes/paths are excluded from translation lookups; nested redraws retain their updating guard.
- Official English Steam/Microsoft locale links were checked. Gemnao uses an explicit translated-route whitelist, with Japanese fallback links labeled as such.
- English/Japanese quickstarts and English README/Windows checklist supplied with source/resources.
- Prior 0.5 package kept byte-for-byte: SHA-256 `88023049dee7e92aad94f6d6653b4a63e2eedf3a086e0bb6e5ca8058a4cdaaa0`.

## English proofreading

All 693 initial English resources were read against Japanese and their code use sites, plus the complete English README, quickstart, localization contract, build report, Windows checklist, and English portions of the feedback contract/source references. The hardcoded mod label and matching-parenthesis separator were moved into paired resources, giving 695 entries. Corrections address count/unit grammar, process-memory terminology, consistent dropdown captions after language switching, capture-versus-action wording, weaker causal hypotheses after an unchanged trial, and precise privacy/optional-DLL export language. No diagnostic behavior, permission, schema, outcome code or safety policy was changed. Five regression tests cover the consequential wording corrections. This review is not a guarantee that every future English phrasing is perfect.

## Not run / not claimed

- **No actual 0.6 Windows UI, screen/DPI/accessibility, native dialog or EXE execution test.** Repeated UI switching with live controls remains on the supplied Windows checklist.
- No actual game launch or Windows collector/Steam module enumeration/DPAPI restore/Recycle Bin execution in this environment.
- No Windows 10, ARM64 or 32-bit compatibility certification.
- No automatic performance measurement, root-cause certainty, hardware repair, game modifications, web intake, signing, public installer test, CI or user-PC operation.
- Earlier owner-reported 0.3 basic Windows operation does not replace 0.6 verification. Native compilation/synthetic tests do not claim the website was tested; website integration is a separate validation.

Test fixtures contain fabricated data only; no personal ZIPs/logs/images/paths or user answers are included. `SHA256SUMS.txt` in the package verifies individual payload bytes and is not a publisher signature or safety certificate.
