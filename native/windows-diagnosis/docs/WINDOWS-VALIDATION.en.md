# Windows 0.6.0 validation checklist — NOT EXECUTED

Use an authorized Windows 11 x64 standard-user session. Save work first. Stop if security software or organizational policy blocks the app; do not bypass it. Synthetic .NET tests and Linux compilation do not satisfy any check below. Older 0.3 owner-reported basic operation does not verify 0.6.

## Languages and layout

- Start under Japanese Windows UI and a non-Japanese Windows UI: defaults are Japanese and English respectively. No collection occurs at launch.
- Confirm every visible tab, question, choice, consent, caution, prompt, result, history view, TXT preview, file-dialog title/filter and JSON instruction is in the selected language. Native Windows/OS-owned dialogs may follow Windows' language.
- Inspect 100%, 150% and 200% DPI and an 800×650 window. Scroll to every control and read long English choices in the expanded dropdown. Action titles must be readable in the details pane; confirm that the list can scroll horizontally. Keyboard focus and screen-reader labels need real execution.
- Repeatedly switch EN → JA → EN at: fresh start; game selected before any snapshot; existing current/baseline results; a restored history with no current snapshot; cancelled/error/partial/no-events state; same-record reread; a retained whole-PC stop condition.
- Verify selected tab/action, game/rules/symptom/store, every answer, consent checkbox, unsaved history draft state/result, saved journal records, trial outcome, baseline and safety stop all remain intact. No collection, new trial, scope-change prompt or history write should happen merely by switching.
- Try switching during collection/timed capture: the control must be disabled. After cancel, it becomes available without resetting evidence.
- The original CPU/GPU names and names of unknown DLLs retain their exact locally displayed text (including Japanese characters if present) and are explicitly labeled original. Unknown states translate as unknown, never as a newly observed fact.
- Export the same typed evidence in each language; narratives differ but event counts, versions, match classifications, step IDs and uncertainty match. Review confirmation still gates every save.

## Consent and collection

- No search/read without base consent. Optional traces, archive and Steam checks are off initially and do nothing without consent.
- Select two unrelated game EXEs including the same basename in different directories. General mode must never use Wilds-specific folder/ZIP parsing.
- Choose each symptom and unknown/Steam/other store. Performance modes must state that FPS, frame times, utilization and temperatures are not measured.
- Verify exact-path versus name-only event matches and missing/denied/unsupported/partial statuses against Windows. A zero-record run must not be reported as healthy or resolved.
- Bounded application/system events, EXE file version, compatibility registration, hardware and two drive roots must agree with permitted Windows views. No full-log text or user/account IDs in output.
- Test ordinary cancel and closing while a Windows API is waiting. Retain previous accepted data; no forced process termination/elevation.

## Captures and safety

- Do not provoke real hardware failure or high-load tests. Use safe known application-only scenarios or synthetic verification.
- Wait for CrashReport generation before ending a timed attempt. Decline the completion prompt to continue waiting without relaunch.
- Same-record reread retains start time, baseline, outcome, action history and attempt identity, and increments only refresh count. Reject a range beyond 30 minutes without clearing evidence.
- Retest requires a distinct nonoverlapping range. Same-record or cross-game/cross-symptom ranges cannot be compared as a new trial.
- Prior/current whole-PC shutdown records or the user's whole-PC issue answer disable reproduction, even after a partial reread or language switch. If genuinely abnormal heat/shutdown occurs, stop use and consult appropriate support.

## Wilds and Steam optional checks

- Only the selected Wilds profile accepts its target EXE and exposes trace/archive parsing; only its launch symptom gets the dedicated launch plan.
- Unknown/blank module identities remain incomplete pattern evidence, including a zero-valued version/offset. Unknown DLL names stay local.
- Confirm separate retail/demo success answers and that LastPlayed is not a success claim.
- Reject unfinished, oversized, encrypted, corrupt and unknown ZIPs; never extract raw content to disk. Do not mix old/out-of-range archive evidence into this attempt.
- Optional Steam checks compare actual selected steam.exe path, at most fixed known names and location classes; other steam.exe instances must not be silently accepted. Hidden/presence/loading/causality remain separate.
- Permission denials, link/junction paths and unavailable data remain unknown; do not alter protection to complete a test.

## History, exports and links

- History opt-in alone does not read or save. Explicit save/restore uses only the app's own LocalAppData files with current-user DPAPI.
- Matching location/game/symptom restores only after review; another game/path/symptom, damaged/oversized files, another Windows user and legacy schema 1 are rejected without replacing current records.
- Restore clears the current comparison basis as explained; language switching never does.
- Recycle action requires app and Windows confirmations and touches only its own history files. Cancel a permanent-delete fallback; do not empty the Recycle Bin.
- TXT/JSON preview confirmation resets when content options change. Cancel Save As without creating a file. Test sync-folder warning and local fixed-drive/link restrictions.
- Selected exports must exclude game names/paths, CPU/GPU names, raw logs, unknown DLL names, account or machine IDs, absolute event times and binding values. Known DLL names require the separate allowlist option.
- JSON keys/outcome codes remain stable in both languages. General-game feedback stays disabled; Wilds JSON is save-only. Web intake stays disabled and no upload-success message appears.
- Help links require confirmation and contain no diagnostic data. Available English links resolve; untranslated links are labeled Japanese. Opening a browser is ordinary web communication.
- Closing leaves no service, background agent, autostart or updater. No game/Steam/registry/security/driver/log modification occurred.
