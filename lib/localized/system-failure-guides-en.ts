import type { EnglishCommonGuide } from './common-guides-en';
export const systemFailureGuidesEn: EnglishCommonGuide[] = [
 {
 slug:'pc-shuts-down-while-gaming',path:'/guide/pc-shuts-down-while-gaming',topic:'launch',
 title:'PC Shuts Down or Restarts While Gaming: Safe Checks and Event Logs',shortTitle:'PC shuts down while gaming',
 description:'Separate power loss, automatic restarts and game crashes. Read Event 41 carefully, record the right temperature sensors, and recognize when to stop testing.',
 lead:'For a whole-PC shutdown or restart during a game. A game closing while Windows remains usable and a monitor going blank are different symptoms.',
 summary:'Record what stopped and how the PC returned. Stop using equipment with smoke, a burning smell, sparks, swelling or damaged/hot power connections. Otherwise correlate the time with Windows records and inspect cooling and external connections safely. Event 41 alone does not identify a failed power supply.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese shutdown guide and its history, sensor and service checks. Microsoft documents event interpretation; hardware vendors document model-specific temperature and cooling checks. The triage order is editorial guidance, not a hardware diagnosis or a stress-test result.',
 branches:[
 {symptom:'Lights/fans stop and the PC stays off',action:'Check for danger signs before any external inspection.',step:'step-1'},
 {symptom:'Windows restarts without you pressing anything',action:'Match the time with stop-error and system records.',step:'power-history'},
 {symptom:'A stop code appears',action:'Use the linked Windows stop-code guide.',step:'power-symptoms'},
 {symptom:'Shutdowns recur or cooling/power looks abnormal',action:'Stop reproduction and prepare a service record.',step:'power-service'},
 ],
 steps:[
 {id:'step-1',title:'Distinguish power loss, restart and a stop error',actions:[
 'Note whether the PC’s lights/fans stopped, whether the Windows logo returned without input, and whether a stop code appeared. If only the game closed and Windows still works, investigate a game crash rather than assuming power loss.',
 'Stop use if you notice smoke, a burning smell, sparks, swelling or abnormal cable/plug heat. Disconnect power only if safe, and contact the manufacturer. With repeated shutdowns, preserve important data where safe before further troubleshooting.',
 ],next:'Do not restart damaged equipment to obtain a better log. A missing observation should be recorded as unknown, not inferred from the screen going dark.'},
 {id:'step-2',title:'Correlate history and events with the observed time',actions:[
 'After Windows recovers, search Start for View reliability history and record the affected date’s events. Open Event Viewer from the Start context menu, then Windows Logs → System, and inspect the failure period and the following startup.',
 'Record event source, ID and details. Use BugCheck/stop-code information for the stop-error branch and WHEA or manufacturer diagnostic errors for hardware-support investigation. Kernel-Power 41 records an unclean shutdown; its presence or a zero BugcheckCode does not establish the cause.',
 ],next:'Compare what you saw with the event chronology. Events written at startup can describe the preceding failure, rather than a new failure at the displayed time.'},
 {id:'step-3',title:'Inspect cooling and external power safely',actions:[
 'Only without danger signs, check suitable placement on a hard, flat surface and unobstructed vents. Follow the model’s instructions for external cleaning with power off. Do not open the power supply or work on internal wiring. A fan that stops at low load is not automatically faulty; check model behavior and warnings.',
 'Where supported, Task Manager → Performance → the game GPU displays temperature. Use a manufacturer monitoring tool for CPU temperature. Record model/sensor names, startup readings, any safely captured game reading and fan behavior. Do not repeatedly trigger shutdowns just to obtain measurements.',
 'Inspect accessible cable condition and connections, and confirm a laptop adapter matches the manufacturer’s specification. If you changed overclocking or undervolting, record the change and use the manufacturer’s instructions to return that setting to standard. Do not perform a blanket firmware reset or keep provoking power loss.',
 ],next:'A repeated shutdown ends the comparison. Persistent failures after safe external checks need PC/device support, even when the logs are incomplete.'},
 ],
 extraSections:[
 {id:'power-symptoms',title:'What disappeared, and how did it return?',actions:[
 'Lights/fans stop and the PC stays off: investigate a power interruption, cooling or device issue without deciding the failed component. Danger signs take priority over data collection.',
 'An automatic Windows restart can follow a stop screen too brief to read. A visible stop code belongs to the stop-code guide whatever the screen color. If Windows remains usable after the game closes, use the game-crash guide.',
 'A black display with the PC still running also needs display/input checks. Record the observed sequence rather than forcing the PC off merely to classify it.',
 ]},
 {id:'power-history',title:'Use Event 41 as context, not a parts diagnosis',actions:[
 'View reliability history gives a timeline. Event Viewer → Windows Logs → System provides source, ID and details. Record events around both the incident and next boot, including BugCheck and WHEA-Logger where present.',
 'Microsoft explains that Event 41 is generated after an unclean shutdown. A zero bug-check value can mean Windows could not write the code or dump. No event, or only Event 41, leaves the cause unresolved.',
 'A BugCheck record containing a stop code/dump points to the stop-error investigation. WHEA records or manufacturer diagnostic errors provide support evidence but do not, by their names alone, tell you which part to replace.',
 ]},
 {id:'power-temperature',title:'Keep sensor names and capture times together',actions:[
 'GPU temperature availability in Task Manager depends on hardware/driver support. Microsoft’s linked announcement describes original support conditions, not every current device. A missing reading is not proof of a sensor or GPU failure.',
 'CPU temperature needs an appropriate manufacturer monitor. On supported AMD configurations, Performance Metrics can expose GPU and junction readings separately. Do not compare a CPU value with GPU junction temperature as if they were the same sensor.',
 'Use the exact CPU/GPU model’s specification for limits. One reading of 90°C cannot identify the cause. Record the sensor, tool, time, fan behavior and time to shutdown only where safely observable. A cool post-reboot value cannot reconstruct the earlier load.',
 ]},
 {id:'power-safe',title:'Limit home checks to a safe comparison',actions:[
 'With the PC off, inspect external vents and placement and follow its manual for accessible dust removal. Do not insert tools through vents or use a fan warning as a reason to dismantle the device.',
 'Visually inspect accessible plugs/cables. Discoloration, damage or dangerous heat means stop use, not touch-and-test. Check the specified adapter model; do not improvise internal connections or a replacement power supply.',
 'After one isolated event with no danger signs, record the existing quality/FPS/peripheral settings. A short, ordinary-use comparison of one reversible change may help. Stop if it shuts down again. Lower load preventing a recurrence is a clue, not proof that cooling or power hardware is healthy.',
 ]},
 {id:'power-service',title:'When to stop and request inspection',actions:[
 'Smoke, sparks, a burning smell, swelling or damaged electrical connections: stop use immediately and contact the manufacturer/service provider. Disconnect only if it can be done safely.',
 'Fan warnings, manufacturer diagnostic errors, or shutdowns near a model’s thermal limit: stop reproduction and provide the model and observed result. Repeated failures in several games or normal Windows use also warrant service after safe data preservation.',
 'Provide PC model; game/version and scene; whether it stayed off or restarted; date/frequency; event details; sensor/tool and capture time; external checks and setting changes. Redact personal details before posting publicly.',
 'If only one game closed once with Windows still running, follow its crash/known-issue path. Return to system investigation if the whole PC later restarts or loses power.',
 ]},
 ],
 cautions:['Never open a power supply or deliberately stress a PC that repeatedly shuts down.','Do not treat Event 41 or a temperature number as a replacement-parts diagnosis.','Preserve important files where safe; measurements do not justify continuing use of damaged equipment.'],
 faqs:[
 {question:'Should I replace the power supply because Event 41 appeared?',answer:'Not on that evidence alone. Match the observed shutdown with stop codes, other events and model-specific diagnostics. Let the inspection provider assess replacement from the full record.'},
 {question:'Does BugcheckCode 0 rule out a stop error?',answer:'No. The system may have been unable to record it. Keep any observed stop screen, associated event and dump information instead of treating zero as proof of a power interruption.'},
 {question:'Does a 90°C CPU reading prove a fault?',answer:'Limits and cooling designs differ by model. Use the exact specification and the timing of temperature/fan behavior. If shutdowns recur, stop playing for measurements and request inspection.'},
 {question:'Lower graphics settings prevent shutdown. Is it fixed?',answer:'That suggests a relationship to load, but does not distinguish cooling from power or another cause. Record the change and seek support for recurring shutdowns; do not restore a failing load repeatedly to prove it.'},
 ],
 sources:[
 {label:'Microsoft: Event 41 and zero bug-check values',url:'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart'},
 {label:'Microsoft: Event Viewer and Windows configuration tools',url:'https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows'},
 {label:'Microsoft: unexpected restarts and stop codes',url:'https://support.microsoft.com/en-us/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors'},
 {label:'Microsoft: original GPU-temperature display support conditions',url:'https://blogs.windows.com/windows-insider/2019/08/16/announcing-windows-10-insider-preview-build-18963/'},
 {label:'Intel: model-specific CPU temperature limits and protection',url:'https://www.intel.com/content/www/us/en/support/articles/000005597/processors.html'},
 {label:'AMD: temperature and performance metrics',url:'https://www.amd.com/en/resources/support-articles/faqs/DH3-038.html'},
 {label:'ASUS: overheating, fan checks and supported diagnostics (Japanese)',url:'https://www.asus.com/jp/support/faq/1015064/'},
 {label:'Dell: overheating and shutdown troubleshooting',url:'https://www.dell.com/support/kbdoc/en-us/000130867/how-to-troubleshoot-a-overheating-shutdown-or-thermal-issue-on-a-dell-pc'},
 ],
 related:[{href:'/en/guide/bsod-while-gaming',label:'Windows stop codes and minidumps'},{href:'/en/guide/pc-game-freezes',label:'Game freezes and unresponsive Windows'},{href:'/en/guide/gpu-driver-update',label:'GPU driver checks'},{href:'/en/guide/pc-game-crash',label:'Only the game closes'}],
 },
 {
 slug:'bsod-while-gaming',path:'/guide/bsod-while-gaming',topic:'launch',
 title:'Windows Stop Codes While Gaming: Memory Tests, Logs and Minidumps',shortTitle:'Stop codes and blue screens while gaming',
 description:'Record a Windows stop code, choose a relevant driver or hardware check, find MemoryDiagnostics-Results, and preserve minidumps for private support.',
 lead:'For a Windows stop error followed by a restart, after you can return to Windows. The error screen can be blue or black depending on the Windows version; a blank screen without a stop code needs a different investigation.',
 summary:'Record the stop code, any What failed filename, the time and recent changes. Match these with System-log events, then choose one relevant driver, memory or manufacturer check. Preserve important data if failures repeat. A code or named file is an investigation clue, not a conclusive diagnosis of a failed component.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese stop-code guide, including its code map, diagnostic results and dump handling. Microsoft documents the codes and tools. The conservative comparison order is editorial guidance; no memory test or game crash was reproduced on a reader’s PC.',
 branches:[
 {symptom:'A stop code or What failed filename is visible',action:'Record it and the time before changing settings.',step:'step-1'},
 {symptom:'VIDEO_TDR_FAILURE, memory or WHEA code',action:'Choose the matching investigation, not an assumed broken part.',step:'bsod-codes'},
 {symptom:'The memory test completed without a notification',action:'Read its dated System-log result.',step:'bsod-memory'},
 {symptom:'No minidump is present',action:'Record that fact and review configured dump handling.',step:'bsod-dump'},
 ],
 steps:[
 {id:'step-1',title:'Record the code, time and preceding changes',actions:[
 'Photograph the Stop code and any What failed filename if available. If it disappears too quickly, inspect Event Viewer → Windows Logs → System after recovery for BugCheck or WHEA-Logger entries near that time.',
 'Record game/version, scene, date/time and recent Windows, GPU-driver or peripheral changes. Preserve important files if failures repeat, and do not deliberately crash the PC again to obtain a clearer photo.',
 ],next:'Unknown code is a valid observation. A filename on the screen does not by itself prove that file or device caused the failure.'},
 {id:'step-2',title:'Choose checks relevant to the code and timing',actions:[
 'VIDEO_TDR_FAILURE: record GPU/driver version and whether a driver change preceded it. MEMORY_MANAGEMENT or IRQL_NOT_LESS_OR_EQUAL: consider memory diagnostics and recent drivers/devices. WHEA_UNCORRECTABLE_ERROR: use manufacturer hardware guidance, cooling checks and documented standard settings. None of these labels alone identifies a part to replace.',
 'On a stable Windows 11 system, review Settings → Windows Update. If a driver update immediately preceded the issue, record the old/new versions and follow the driver guide’s supported rollback route. Change one item and compare only while safe; stop if system failures recur.',
 ],next:'Do not reset firmware or remove several drivers at once. If Windows itself remains unstable or hardware diagnostics report errors, use manufacturer support.'},
 {id:'step-3',title:'Read the memory-test result and preserve dump evidence',actions:[
 'Save work and close apps before opening Windows Memory Diagnostic. Choose Restart now and check for problems only when ready. After the diagnostic and return to Windows, inspect Event Viewer → Windows Logs → System for the dated MemoryDiagnostics-Results entry.',
 'Read the result text. No detected errors means this test found none, not that every memory-related cause is excluded. If it reports hardware problems, preserve the result and contact the PC manufacturer. If the entry cannot be found, report the result as unavailable.',
 String.raw`If small dumps were created, open %SystemRoot%\Minidump in File Explorer and note the .dmp filenames/timestamps near the incident. Follow the support provider’s submission instructions; do not upload memory dumps to a public forum without reviewing the destination and privacy implications.`,
 ],next:'Keep observations, result text and dump availability together. Missing files or notifications are not clean bills of health.'},
 ],
 extraSections:[
 {id:'bsod-first',title:'Match the event to the incident',actions:[
 'Record code, time and recent changes first. In the System log, inspect the failure interval and next boot. A BugCheck entry may identify a code and dump path; keep nearby WHEA records too.',
 'Kernel-Power 41 can accompany an unclean restart and is not a standalone power-supply diagnosis. For its interpretation, use the linked shutdown guide. Repeated incidents justify preservation and support rather than repeated reproduction.',
 ]},
 {id:'bsod-codes',title:'A code points to an investigation, not a verdict',actions:[
 'VIDEO_TDR_FAILURE (0x116): inspect the GPU in Device Manager → Display adapters → its Properties → Driver, recording version/date and the displayed filename. The code concerns failed graphics timeout recovery; drivers, settings and hardware conditions can be involved.',
 'MEMORY_MANAGEMENT (0x1A): record recent memory settings/devices and a diagnostic result. The code describes a serious memory-management error, not automatic proof that a RAM module needs replacement.',
 'IRQL_NOT_LESS_OR_EQUAL (0xA): review recent driver/device changes and memory diagnostics. Compare one documented, reversible change; disconnect a newly added nonessential peripheral only using its safe removal/shutdown instructions.',
 'WHEA_UNCORRECTABLE_ERROR (0x124): preserve WHEA details and use manufacturer diagnostics. Cooling and nonstandard tuning can matter. If you changed overclock/undervolt settings, follow the manufacturer’s route back to standard rather than guessing firmware values.',
 'Another code, or none captured: keep the dated events and dump availability for support. Do not select a fix simply because a search result mentions a similar filename.',
 ]},
 {id:'bsod-memory',title:'Find the result even if the notification disappears',actions:[
 'Save files and close the game/apps. Search Start for Windows Memory Diagnostic; Windows+R → mdsched.exe is another entry point. Schedule the restart when ready and allow the diagnostic to complete.',
 'After signing in, open Event Viewer → Windows Logs → System. Use Find for MemoryDiagnostics-Results and select the entry matching your test time. Read General rather than assuming any older entry belongs to this run.',
 'Record the exact result and test date. An error needs manufacturer assessment; no detected error has the limited meaning described in Step 3. A missing entry is an unavailable result. Do not repeat disruptive tests endlessly to manufacture a reassuring result.',
 ]},
 {id:'bsod-dump',title:'Preserve a minidump and choose a private submission route',actions:[
 String.raw`Small crash dumps normally use %SystemRoot%\Minidump. Note relevant .dmp names/dates and keep a separate investigation copy if permitted, leaving the originals intact. If the event specifies another location, inspect that location instead.`,
 'If no file exists, review View advanced system settings → Advanced → Startup and Recovery → Settings → Write debugging information. None disables dump saving. Consult manufacturer/support guidance before changing the format; available space and the failure itself also affect whether a dump is written.',
 'A dump contains crash-time memory information, and even a small dump can expose details you would not want public. Ask the official support provider where and how to submit it. This guide does not require installing a debugger or publishing the file.',
 ]},
 {id:'bsod-report',title:'Build a useful support record',actions:[
 'Include PC model, Windows version, GPU/driver, game/version, scene/time/frequency, code and filename, relevant event text, memory-test date/result, and dump presence/name.',
 'List changes made before the first failure and comparisons already tried. State whether it happens only in one game or also in other games/normal work. Redact personal paths and identifiers from any public screenshot.',
 ]},
 ],
 cautions:['Stop repeated crash reproduction and preserve important data.','A code, filename or negative memory test is not a complete hardware diagnosis.','Keep crash dumps off public sites unless you deliberately reviewed what and where you are sharing.'],
 faqs:[
 {question:'The stop screen is black. Does this guide still apply?',answer:'Yes, if it displays a Windows stop error or restart-required message. Appearance varies by Windows version. A plain black screen without a stop code belongs to the blank-screen guide.'},
 {question:'The memory diagnostic showed no notification. Where is the result?',answer:'Look for the correctly dated MemoryDiagnostics-Results event in Windows Logs → System. If it is absent, record that the result could not be confirmed; do not interpret silence as a pass.'},
 {question:'The Minidump folder is empty. Does that rule out an error?',answer:'No. Dump configuration, available space and the failure conditions can prevent a file. Record the absence and review the configured format with support rather than assuming normal operation.'},
 {question:'Does Kernel-Power 41 mean a failed power supply?',answer:'No. Correlate the unexpected restart with stop codes, other events and observed conditions. The shutdown guide explains the limits of that event.'},
 ],
 sources:[
 {label:'Microsoft: Windows stop codes and basic checks',url:'https://support.microsoft.com/en-us/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors'},
 {label:'Microsoft: VIDEO_TDR_FAILURE and memory-test result logs',url:'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-0x116---video-tdr-failure'},
 {label:'Microsoft: MEMORY_MANAGEMENT bug check',url:'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-0x1a--memory-management'},
 {label:'Microsoft: IRQL_NOT_LESS_OR_EQUAL and memory diagnostics',url:'https://support.microsoft.com/en-us/windows/experience/performance-optimization/how-to-fix-error-0xa-irql-not-less-or-equal'},
 {label:'Microsoft: WHEA_UNCORRECTABLE_ERROR investigation',url:'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-0x124---whea-uncorrectable-error'},
 {label:'Microsoft: small memory dump locations and settings',url:'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/read-small-memory-dump-file'},
 {label:'Microsoft: stop-code and dump investigation',url:'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/stop-code-error-troubleshooting'},
 {label:'Microsoft: interpreting Kernel-Power Event 41',url:'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart'},
 ],
 related:[{href:'/en/guide/gpu-driver-update',label:'GPU driver update and rollback checks'},{href:'/en/guide/pc-shuts-down-while-gaming',label:'Whole-PC shutdowns and restarts'},{href:'/en/guide/pc-game-freezes',label:'Freezes and unresponsive Windows'},{href:'/en/guide/black-screen',label:'Black screen without a stop code'}],
 },
];
