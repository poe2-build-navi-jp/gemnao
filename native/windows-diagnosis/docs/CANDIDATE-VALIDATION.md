# 0.6.1-rc.1 review candidate — 2026-10-23

This is the existing Windows Forms application, recovered from the shipped 0.6.0 ZIP, not a replacement application. The default website download remains 0.6.0. Do not promote this candidate until authorized real-Windows validation and review are complete. The inherited BUILD-RESULTS.md describes only 0.6.0.

## Source and binary provenance

- Repository base: `8f1f5491e0760017a08af057f4577300f0aad80b` on `gemunao`, updated from the requested `5775ccddb8337a696501144d7e16f56b0ede2cff`. Intervening changes do not change the shipped ZIP.
- Original: `public/downloads/gemnao-game-diagnosis-0.6.0-windows-x64.zip`, 299650 bytes, SHA-256 `34719ffa93fe31143dcd392b383831fdf8f3f3ecc98d64f2d9e68d9405126b77`.
- Canonical source location inside that ZIP: `gemnao-game-diagnosis/source/` (45 files). All 49 payload hashes in the original SHA256SUMS.txt verified. The first import commit copies those 45 source files byte-for-byte, adding only .gitignore. Changes are a separate commit.
- Shipped EXE SHA-256: `c8c3e65c79f00c9afbe00323b21c63b88b82a5e7c3d17ab4859a48875a767061`.
- Unmodified source rebuild, SDK 10.0.401, Linux x64: successful net48 x64 Release, zero warnings/errors. Rebuilt EXE SHA-256: `a2a3db03d8121ceaf3e915968a160620742a854684ab6b9148316e7eadb24c36`. **Not byte-identical**; no claim of full reproducible-binary identity or signing provenance.
- `tools/BinaryCompare` found 1,284 equal ordered entries: method IL/signatures, embedded resource payloads, type names and member-reference names/signatures. This is scoped correspondence evidence, not a comparison of every PE/metadata field or a safety certificate. Absolute build paths/compiler metadata may affect bytes; the exact mismatch cause is not established.

## Changes and preserved boundaries

- JA/EN help beside EXE selection gives three short manual steps and a fallback to official support. Exact known Steam/reporter filenames are rejected case-insensitively. Other EXE names remain user-selected; filename filtering does not authenticate arbitrary game binaries. Steam optional selection still separately accepts steam.exe with consent.
- Results lead with observed facts, unknowns and one suggested next step. Completed zero matches is distinct from incomplete/denied/timeout/partial/not-read/cancelled. Existing matches remain visible after partial reads. Other-target indication requires an explicit parser mismatch in an in-window supported application event; no unrelated path/name is retained. It never declares the selected EXE wrong.
- Delayed records remain a possibility, never a confirmed pending state. Exact-path and name-only matches remain distinct. No event is not a health/repair/performance claim.
- Details and the action list expand on request. Safety-stop suggestions and the next step warning remain visible outside collapsed details. Existing user-reported improvement/resolution and performance caveats remain. The full report remains separately available.
- No new automatic scans, game launches, collection, communication, permissions or repair. Existing sharing preview/consents, DPAPI/history schema, scope binding and safety-stop rules remain. New display-only mismatch count is not added to exported payloads or history.
- Numeric rule/feedback version is 0.6.1; assembly/package/title identify rc.1. Web release metadata and all previous ZIP bytes are unchanged.

## Reproduce non-Windows checks

Use .NET SDK 10.0.401; if home is read-only, point DOTNET_CLI_HOME and NUGET_PACKAGES to writable temporary directories. From `native/windows-diagnosis`:

```sh
dotnet restore Gemnao.Diagnostics.csproj --locked-mode
dotnet build Gemnao.Diagnostics.csproj -c Release --no-restore
dotnet run --project tests/Core.Tests.csproj -c Release
python3 tools/verify-source.py
python3 tools/package.py
# Optional scoped binary comparison, using an unmodified extracted source rebuild:
dotnet run --project tools/BinaryCompare/compare.csproj -- ORIGINAL_EXE REBUILT_ORIGINAL_EXE
```

Original suite: 386 passed / 0 failed. Candidate: 410 passed / 0 failed, including 24 new synthetic cases (two-language collection states, incomplete limits, mismatches, helper rejection, safety stop, privacy). Candidate net48 x64 build: zero warnings/errors. Source guards: 710 paired resource entries, consent/no-network/read-only guards pass. These tests do not execute Windows collectors, UI, DPAPI or Recycle Bin.

## Windows acceptance record — all NOT RUN

No authorized connected Windows environment was available. No user-PC access, privilege changes, protection bypass, Wine execution or fabricated screenshots were used. Linux/synthetic results do not fill the following cells. Run only on an explicitly authorized Windows 11 x64 standard-user test session. Stop on a protection block; record BLOCKED instead of bypassing it. Do not provoke a game/hardware failure, clear logs, change ACLs or disable protections to force a scenario.

Run each row in JA and EN, recording separate PASS/FAIL/BLOCKED/NOT RUN, candidate hash, OS/.NET version and DPI locally. Do not publish usernames, machine names, paths, raw logs, screenshots with private data, or actual diagnostic/export contents.

| ID | Procedure and required outcome | JA | EN |
|---|---|---|---|
| W01 | Start as standard user in JA and non-JA OS UI; verify default language and idle-only JA→EN→JA switching. At 800×650 and 100/150/200% DPI, all summary, help, tabs, warnings and expanded details remain reachable with keyboard and scrolling. | NOT RUN | NOT RUN |
| W02 | Before consent, collection/selection remains disabled; help is available and does not read files/launch anything. Cancel the picker; existing target, answers and history remain. Select an installed game EXE. Select Steam.exe/CrashReport.exe in game picker: reject and preserve prior target. No fake file is needed if those files are unavailable. | NOT RUN | NOT RUN |
| W03 | General game and Wilds, all symptoms; Wilds accepts only its known EXE. Test same basename/different location and scope changes; confirm prior-scope history cannot attach. Optional Steam selector is separate and remains consent-gated. General mode never reads Wilds-specific ZIP/traces. | NOT RUN | NOT RUN |
| W04 | Read already existing Application records for a known, safely observed game issue. Compare allowed Windows event view locally with time window and exact/name-only counts. No deliberate crash required; if a suitable record is unavailable, leave NOT RUN. | NOT RUN | NOT RUN |
| W05 | In an available no-match time window, verify Application status Complete and zero matches; no success/healthy claim. Expand details then collapse; warnings and one next step remain. No delayed/wrong-target assertion without evidence. | NOT RUN | NOT RUN |
| W06 | If a genuine normal-user denied/unavailable/timeout/partial condition occurs, verify incomplete status and retention of any collected matches. Do not change permissions/services/logs to induce it. If unavailable, leave NOT RUN; synthetic status tests alone are insufficient. | NOT RUN | NOT RUN |
| W07 | If in-window other-app records exist, show only a qualified other-target indication. Out-of-window/unsupported data alone must not trigger it. Re-read an existing attempt (within 30 min), preserving original start/baseline/outcome and not calling a new trial. Pending record remains unknown unless later observed. | NOT RUN | NOT RUN |
| W08 | Cancel timed capture, cancel collection while API waits, and close while busy. No new accepted partial result replaces prior data; UI returns to idle without starting the game or forcing a process termination. | NOT RUN | NOT RUN |
| W09 | Opt into history, explicitly save one non-sensitive test action, close the app, restart, select the same EXE/profile/symptom, explicitly restore after review. Step/outcome restored; comparison basis reset as explained. Language switching preserves consent/drafts. | NOT RUN | NOT RUN |
| W10 | Use history Recycle action: cancel first, then confirm both app/Windows prompts; only the app's own history goes to Recycle Bin. Cancel any permanent-delete fallback. Restart and confirm no saved entry is restored. Do not empty Recycle Bin. | NOT RUN | NOT RUN |
| W11 | Preview TXT/optional Wilds JSON, cancel save; no file/upload. Changing known-name option resets confirmation. Confirm no private fields leak. Do not submit real exports to the repository. General feedback remains disabled. | NOT RUN | NOT RUN |
| W12 | Use the existing whole-PC-issue answer (do not cause a failure); stop warning stays visible even after marking a step skipped, switching language, collapsing details or rereading. Reproduction disabled. No background service/autostart/network added. | NOT RUN | NOT RUN |

The inherited `WINDOWS-VALIDATION.md` and `.en.md` provide additional regression cases (corrupt history, current-user DPAPI, bounded optional parsing, exports). Keep their not-executed status until actual verification. Promotion requires recording actual results, fixing failures, reviewing the source/EXE mapping and deliberately updating release metadata separately; this change does not deploy or promote the candidate.

## Website verification and remaining unrelated failures

- `pnpm --config.verify-deps-before-run=false build` passed using writable XDG data/config/cache locations. Automatic dependency preflight otherwise tried the environment's read-only home; dependencies and source were not deleted to bypass it.
- Changed-file oxlint and `git diff --check` passed. Download identity/privacy test passed after normalizing whitespace in its English source assertion (the existing line break had caused a false failure).
- All four built Windows-download pages retain the exact 0.6.0 download SHA and do not link the candidate. The existing local static HTTP suite passed; no deployment was performed.
- Full localized-page check fails on an unrelated game-article FAQ count (`3 !== 5`); the same failure was reproduced on untouched base `8f1f549` in a detached worktree. This is not a native-app localization test; the app's 710 resource-pair checks pass.
- Full repository oxlint reports TypeScript errors outside the changed files, including diagnostic browser-test types. Changed-file lint passes. Do not describe the whole repository as lint-clean.
