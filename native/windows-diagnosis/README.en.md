# Gemnao PC Game Diagnosis 0.6.0

An English/Japanese, local, read-only Windows x64 prototype. Select a game EXE and symptom, review limited Windows evidence, then follow one manual check at a time. The optional Monster Hunter Wilds profile adds narrowly scoped checks; it does not make Wilds-specific assumptions about other games.

**The executable is compiled but unsigned. Version 0.6's Windows UI, data collection on a real PC, DPI, DPAPI history and Recycle Bin flows have not been executed on Windows. Linux compilation and synthetic tests do not establish Windows runtime compatibility or safety. If Windows security, antivirus or organizational policy blocks it, stop. Do not bypass a warning, disable protection, add exclusions or run as administrator to get around a block.**

## Start and choose a language

1. Extract the ZIP completely. Keep `Gemnao.Diagnostics.exe` and its `.exe.config` together, and open the EXE normally.
2. Intended target: Windows 11 x64 with .NET Framework 4.8 or later. No SDK, PowerShell command or separate installer is needed. Windows 10, ARM64 and 32-bit operation are not verified.
3. Use **Language / 言語** at the top: **English** or **日本語**. A Japanese Windows UI defaults to Japanese; other Windows UI languages default to English. This setting lasts for this launch only; the app does not save a new preference file.
4. Switch while idle. The selector is disabled during a timed capture or read. Changing the display language retains the selected game, answers, consent, current/baseline evidence, action records and safety stop. It does not collect again or count as a retest.
5. Both languages are embedded in the EXE. All application questions, results, warnings, action instructions, history summaries and TXT exports use the selected language. JSON keys and outcome codes remain language-neutral for compatibility. Original device/module names shown locally remain unchanged and are labeled as original values.

## First diagnosis

1. In tab 1, choose the general PC-game rules, the symptom, and the store (unknown, Steam or other). Read the collection description and opt in before selecting the actual game EXE. A launcher or crash reporter may be a different EXE. Do not alter protected-folder permissions to find it.
2. If the issue already happened, read the previous ten minutes instead of reproducing it. The application does not collect simply because it opened.
3. Only if it is safe, start timing immediately before a short manual attempt in the same scene. This tool never starts, plays, records video of or terminates the game. Wait until CrashReport generation finishes before pressing the read button. A five-second log-write wait follows; Windows can still write records later.
4. If records are missing, use the **Read the same records again without relaunching** without launching again. It extends the same range, for up to 30 minutes from its original start, retaining the comparison baseline, trial identity and your recorded result. It is not a fresh attempt. If you have launched the game again or changed a setting, do not use this reread option.
5. Review the evidence and the next manual step in tab 3. Record what you actually tried. Change one thing only, compare the same scene if safe, and report improved / unchanged / worse / unsure yourself. An unrecorded step is not proof you have never tried it. Do not repeat a failed check merely because its result is absent.
6. If the game now works, further changes or deliberate failure reproduction are unnecessary. For shutdowns, restarts, system-wide freezes, blue screens or abnormal heat, stop trying to reproduce the issue and prioritize existing records and the PC manufacturer's support. A previously observed whole-PC abnormal shutdown remains a caution even after an incomplete reread.

## Supported symptoms and limits

The entry choices are failure to launch, crash/unexpected exit, black screen, freeze/unresponsive, low FPS, stutter/brief pauses, and other/unknown. Each leads to a distinct fixed plan. Steam-specific verification is not imposed on non-Steam stores.

**FPS, frame times, GPU utilization and temperature are not measured.** Performance comparisons are your observations in the same scene/settings. Event counts and a one-time RAM/storage reading cannot establish game performance, a root cause or a repair. No events does not mean success or a healthy PC. Names of GPUs/CPUs are not automatic pass/fail benchmarks; driver dates are not installation dates.

Other symptoms receive common evidence and support guidance only. This version has no dedicated analysis for network, account, audio or input issues, arbitrary game-engine logs, hardware faults or protected apps, and does not automatically track child executables. Unknown, denied, unsupported, timed-out and partial data stay visibly uncertain.

## Exactly what is read

With the base collection consent and an explicit button action:

- Selected EXE version resources and narrowly targeted compatibility/admin-registration flags. Flags do not prove the effective permissions, current UI setting or cause. No executable is loaded or run.
- OS version; CPU name/vendor/logical processor count (first socket); up to eight GPU names/vendors/driver versions; visible/available RAM and up to sixteen RAM-module capacities.
- Total/free space for the Windows and selected-game drive-letter roots only. SSD type, mount relationships and other drives are not inferred.
- Matching Application Error 1000 / Application Hang 1002 records. Exact EXE-path matches are distinguished from weaker name-only matches.
- System Display 4101 / Kernel-Power 41 in the time range as whole-PC context. Their causal relation to the selected game remains unknown.
- Each event-log read is bounded to 300 recent examined events, including unrelated ones that can consume that budget; fixed XML fields only, 64 KiB XML limit, no DTD or external entities. Access denials and unsupported formats are not successes. WER 1001 and complete raw event text are excluded.
- API waits are bounded where possible, but Windows calls may not return immediately on cancel. No elevation is attempted. Cancel retains previous accepted evidence.

The app's low-free-space (5 GiB or 5%) and low-available-RAM (1 GiB) thresholds are prompts to check, not official game requirements or hardware diagnoses. It does not read saves, Steam userdata/account IDs, full disks or lists of other applications.

### Optional Steam checks, initially off

Only with the separate Steam opt-in and a verified selected Steam executable: examine six fixed names directly under that Steam installation, their presence/Hidden attribute, and locations of five known DLL names from the matching running Steam process. At most four Steam processes and 1,024 modules per process are examined, with a cooperative ten-second budget. Only fixed-name classifications are retained. The app does not read configuration contents, other process titles/arguments, arbitrary process memory or accounts. Denied access remains unknown.

A file's presence, Hidden attribute, loading into Steam, loading into a game, and a crash cause are separate facts. These names do not establish malware or a reason to delete/rename anything. Do not modify System32/SysWOW64. A single Wilds case does not establish another game's cause.

### Optional Wilds profile, initially off

The user-selected Monster Hunter Wilds Steam profile accepts the actual `MonsterHunterWilds.exe`. Dedicated launch rules apply only to the launch symptom; other symptoms use the general plan. General-game mode does not inspect Wilds registrations, traces, CrashReport ZIPs or dumps.

Wilds can search bounded Steam registration locations and inspect CrashReport ZIP presence/times. Two additional, separate opt-ins allow seven fixed trace names plus retail LastPlayed metadata, and one bounded CrashReport ZIP. LastPlayed can record a failed launch and does not prove successful play; demo/beta success is kept separate from retail success.

ZIP reading is at most 8 MiB, sixteen entries, fixed text up to 64 KiB and a limited dump up to 16 MiB. It does not extract to disk, run code, upload raw bytes, or analyze memory, registers, stacks, instructions or symbols. Unknown/encrypted/damaged/in-progress archives are rejected or labeled incomplete. Old/out-of-range/unmatched reports are not silently treated as this attempt's evidence. Unknown module names stay on the local details screen and are not exported. An unknown/blank module identity never forms a complete repeated-crash signature.

## Export, privacy and local history

Tab 4 previews the exact TXT to be saved. Review every part and confirm before choosing a local file. Changing the optional allowlisted-DLL-name choice resets that confirmation. The report excludes selected names/paths, CPU/GPU names, raw logs, account/machine IDs, absolute event timestamps and unknown module names; only predefined, filtered fields are included. This reduces exposure but does not guarantee anonymity. A sync folder such as OneDrive may synchronize independently of this app.

Tab 5 records a maximum of 64 manual action/result entries. Optional history has its own consent; checking it neither reads nor saves automatically. Save explicitly to the app's dedicated LocalAppData location, protected for the current Windows user with DPAPI. History stores fixed game category, symptom, action IDs, states, outcomes, limited observed differences, and a per-history salted local EXE-location binding. It does not store the EXE path itself. The binding is never included in TXT or JSON.

Restoring requires a matching EXE location, game category and symptom plus a content review. It does not prove the underlying installation or PC is identical; earlier observations are not reused as a current baseline. Another game, another install path, another symptom and old version-1 history are rejected. Language changes do not change schema-2 history or its binding. History deletion uses only the app's own history files and Windows' Recycle Bin confirmation. Cancel any permanent-delete fallback; the app never empties the Recycle Bin.

The optional improvement-report JSON remains **local-save only** and available only for the Wilds launch workflow. Pick one to eight recorded actions, review every field, optionally include a self-confirmed current environment and confirm before saving. Stable schema-1 keys, rule IDs and outcome codes remain unchanged by language. Raw data, paths, device/account IDs, the full history and observed differences are excluded. The general-game JSON format is unsupported. The web-intake button remains disabled: **no uploads or claims that a report has been submitted**.

## Manual links and security

The app has no network client, background service, startup registration, updater or automatic repair. It never modifies game/Steam files, registry settings, drivers, security settings or Windows logs. It writes only explicitly confirmed exports and its own history files with separate consent.

Opening a help link requires a prompt. A browser will make ordinary web requests; no diagnostic data is put in the URL. Available translated guides are linked in English. Other Gemnao guide URLs remain Japanese and are labeled `(Japanese)` in the English link confirmation/report. Official Steam/Microsoft locale links use checked English counterparts.

`SHA256SUMS.txt` detects byte changes; it is not a publisher signature or safety certification.

## Build and validation

See `docs/BUILD-RESULTS.md`, `docs/LOCALIZATION.md`, and `docs/WINDOWS-VALIDATION.en.md`. Build with a trusted .NET SDK and the locked Microsoft .NET Framework reference package:

- `dotnet restore Gemnao.Diagnostics.csproj --locked-mode`
- `dotnet build Gemnao.Diagnostics.csproj -c Release --no-restore`
- `dotnet run --project tests/Core.Tests.csproj -c Release`
- `python tools/verify-source.py`
- `python tools/package.py`

Tests use fabricated fixtures, not real personal logs. The package includes source, English/Japanese quickstarts and resource files. Older release ZIPs are retained separately.
