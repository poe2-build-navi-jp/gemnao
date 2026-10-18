import type { EnglishCommonGuide } from './common-guides-en';
const base = {category: 'Common PC game troubleshooting', checkedAt: '2026-10-18', sourcePolicy: 'English edition of the corresponding Japanese guide, including its detailed error branches. Microsoft documents the components and error categories; our comparison order is editorial guidance. A DLL name or error code alone does not prove the cause.'};
export const runtimeGuidesEn: EnglishCommonGuide[] = [
  {
    ...base, slug: 'directx-error', path: '/guide/directx-error', topic: 'launch',
    title: 'DirectX Errors in PC Games: Feature Levels, Missing DLLs and DXGI', shortTitle: 'DirectX errors in PC games',
    description: 'Match a DirectX error to GPU feature levels, legacy libraries or a DXGI device error. Read dxdiag for the correct GPU and avoid unofficial replacement DLLs.',
    lead: 'Keep the entire message, including its final code or DLL name. “DirectX error” can describe several different problems, so installing a runtime is not a universal repair.',
    summary: 'Compare feature-level errors with the GPU the game actually uses. For a missing legacy library, check the publisher’s prerequisite software. For DXGI device errors, record the scene and driver history, then compare one setting at a time.',
    branches: [
      {symptom: 'Feature Level 12_0 required or D3D11 feature level 11_0', action: 'Compare the required feature level with the actual game GPU.', step: 'directx-feature'},
      {symptom: 'd3dx9_43.dll, XINPUT1_3.dll or D3DCompiler_43.dll is missing', action: 'Check the game’s legacy DirectX prerequisites.', step: 'directx-dll'},
      {symptom: 'DXGI_ERROR_DEVICE_REMOVED, DEVICE_HUNG or DEVICE_RESET', action: 'Compare the failing scene and graphics configuration.', step: 'directx-gpu'},
      {symptom: 'd3d12.dll, dxgi.dll or an unspecified initialization error', action: 'Check requirements and Windows components.', step: 'directx-system'},
    ],
    steps: [
      {id: 'step-1', title: 'Record the complete error and the GPU', actions: [
        'Capture the full error, including the final letters, numbers and DLL name. Note whether it appears at launch or during a particular scene. Use the error branches above to choose the relevant check.',
        'Press Win+R, enter dxdiag and inspect DirectX Version on System. On Display or Render, record the GPU name, Feature Levels and driver date/version. If there are several GPUs, confirm which one the game uses.',
      ], next: 'A Windows DirectX version and a GPU feature level are different measurements. Keep both, together with the exact error, before choosing STEP 2.'},
      {id: 'step-2', title: 'Apply only the branch that matches the message', actions: [
        'For an explicit feature-level requirement, compare the game publisher’s requirement with the selected GPU’s list. If another compatible GPU is available, check this game under Windows Settings → System → Display → Graphics. A runtime cannot add hardware features the GPU lacks.',
        'For a missing legacy library such as d3dx9_43.dll or XINPUT1_3.dll, follow the publisher’s prerequisite instructions. Where the game needs these older DirectX libraries, use Microsoft’s official End-User Runtimes package. Keep this separate from Windows DLLs such as d3d12.dll.',
        'For DXGI device removed, hung or reset errors, record the game, scene and recent driver changes. Compare a mod or overlay, graphics setting or driver version one at a time, preserving the previous configuration. The wording alone does not prove GPU hardware failure.',
      ], next: 'Use the matching detailed section below. If the message does not fit, collect the requirements and failure context instead of guessing from the word DirectX.'},
      {id: 'step-3', title: 'Retest the same scene and keep a useful record', actions: [
        'Restart when required, then use the same launch method and scene. If the error changes, record the new message and choose its own branch instead of repeating the old repair.',
        'If it persists, give official game support the edition, full error, GPU, feature levels, driver version, failing scene and changes tried. dxdiag offers Save All Information; review personal details before sharing a report publicly.',
      ], next: 'A changed error is a new observation, not necessarily a repair. Stop repeating an unchanged test and use the record to narrow the next check.'},
    ],
    extraSections: [
      {id: 'directx-error-types', title: 'When the message does not fit a DirectX branch', actions: [
        'MSVCP140.dll and VCRUNTIME140.dll belong to the Visual C++ branch. Use the related Visual C++ guide instead of treating every missing DLL as a DirectX library.',
        'An initialization failure without a file name or feature level cannot be classified from that phrase alone. Check the game’s official requirements, the GPU being used and when initialization failed.',
      ]},
      {id: 'directx-feature', title: 'DirectX 12 is not the same as feature level 12_0', actions: [
        'In dxdiag, System describes the Windows DirectX version. Display or Render shows the selected GPU and its feature levels. Inspect each relevant GPU tab on a multi-GPU PC.',
        'Illustrative example: Windows reports DirectX 12, the game GPU lists only up to 11_0, and the game explicitly requires 12_0. The Windows version label does not satisfy that missing GPU requirement. Check other available GPUs and the driver state.',
        'Illustrative example: the GPU lists 12_1 and the game requires 12_0. The listed capability meets that feature-level requirement, but you still need to confirm that the game uses this GPU and meets its other requirements.',
        'Feature levels describe capabilities, not an FPS ranking. If the publisher says only “DirectX 12”, do not invent a more specific required level. Installing legacy libraries cannot upgrade the GPU’s hardware capabilities.',
      ]},
      {id: 'directx-dll', title: 'A missing legacy DirectX library', actions: [
        'Check the publisher’s prerequisite list first. If it calls for the legacy DirectX libraries, open Microsoft’s DirectX End-User Runtimes (June 2010) page in Sources. For Steam installation damage, file verification is another relevant comparison.',
        'Follow the official package instructions. The June 2010 redistributable can extract its contents to a new empty folder; run DXSETUP.exe from that extracted package to install the required components. Merely extracting files is not the installation.',
        'Retest after the requested restart. These optional older libraries do not change the DirectX version built into Windows or add GPU features. Do not download individual DLLs from unofficial sites or copy them into System32.',
      ]},
      {id: 'directx-gpu', title: 'A device error during rendering', actions: [
        'Record the scene, game version, driver update and any recent mod change. Compare one game with other games if available. DEVICE_REMOVED can refer to a driver/device state; it does not necessarily mean the physical card came out.',
        'With the game closed, compare an overlay or a mod using its documented disable method. Preserve saves and mod requirements. If that does not help, compare one graphics setting, keeping the original value so you can restore it.',
        'If it affects several games or began with a GPU driver update, use the related driver guide. If the whole PC loses power or restarts, stop treating it as just an application error and use the whole-PC guide linked below (Japanese).',
        'Try another rendering mode, such as DX11, only when this game officially offers it. Record the old setting. There is no universal launch option that makes an unsupported GPU compatible.',
      ]},
      {id: 'directx-system', title: 'Windows DLLs and unexplained initialization failures', actions: [
        'For d3d12.dll or dxgi.dll errors, first compare the publisher’s OS and graphics requirements. Check Windows Update and restart as directed. Legacy DirectX additions are not replacements for these Windows components.',
        'For one failing Steam game, verify its files. On a multi-GPU PC, inspect the game’s Windows Graphics preference and the selected GPU before drawing a compatibility conclusion.',
        'If Windows system-file errors persist across apps, use Microsoft’s System File Checker instructions in Sources. Its documented sequence uses an elevated Command Prompt, DISM.exe /Online /Cleanup-image /Restorehealth, then sfc /scannow after DISM succeeds. Keep the result and ask support if repair fails; do not replace system DLLs manually.',
      ]},
    ],
    cautions: ['Do not replace an unfamiliar DLL by downloading it from a file-sharing or DLL-download site.', 'Keep feature-level requirements, legacy libraries and graphics-device errors separate. Do not use registry timeout changes or security disabling as a blanket fix.'],
    faqs: [
      {question: 'Why does a game demand 12_0 when dxdiag says DirectX 12?', answer: 'The System label describes Windows DirectX; Feature Levels describes capabilities of the selected GPU and driver. Compare the game’s explicit requirement with the GPU it uses.'},
      {question: 'Should I download d3dx9_43.dll by itself?', answer: 'Use the publisher’s prerequisite instructions and Microsoft’s official legacy runtime where required. An unofficial loose DLL is not a safe substitute and will not upgrade GPU capabilities.'},
      {question: 'Does DEVICE_REMOVED mean my GPU physically disconnected?', answer: 'Not necessarily. Driver changes and device-state failures can also produce rendering-device errors. Record the exact code, driver version and affected games before concluding that hardware failed.'},
      {question: 'Will the old runtime fix a missing d3d12.dll or dxgi.dll?', answer: 'Those belong to a different branch. Check supported Windows/game requirements and Windows Update first. Persistent system-file errors across apps warrant Microsoft’s repair guidance, not a loose DLL replacement.'},
      {question: 'Can I force every DX12 game to use DX11?', answer: 'Only use another rendering mode that this game officially supports. An arbitrary launch flag is not a universal fallback and cannot provide missing hardware features.'},
    ],
    sources: [
      {label: 'Microsoft: check DirectX with dxdiag', url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/which-version-of-directx-is-on-your-pc'},
      {label: 'Microsoft Learn: hardware feature levels and API versions', url: 'https://learn.microsoft.com/en-us/windows/win32/direct3d12/hardware-feature-levels'},
      {label: 'Microsoft: DirectX End-User Runtimes (June 2010)', url: 'https://www.microsoft.com/en-us/download/details.aspx?id=8109'},
      {label: 'Microsoft Learn: DXGI error definitions', url: 'https://learn.microsoft.com/en-us/windows/win32/direct3ddxgi/dxgi-error'},
      {label: 'Microsoft: System File Checker', url: 'https://support.microsoft.com/en-us/windows/experience/backup-recovery/using-system-file-checker-in-windows'},
      {label: 'Steam Support: verify game files', url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB'},
    ],
    related: [{href: '/en/guide/visual-c-runtime-error', label: 'Visual C++ and missing runtime DLLs'}, {href: '/en/guide/gpu-driver-update', label: 'GPU driver update or rollback'}, {href: '/en/guide/verify-steam-files', label: 'Verify Steam files'}, {href: '/guide/pc-shuts-down-while-gaming', label: 'The whole PC shuts down (Japanese)'}, {href: '/en/guide/vram-shortage', label: 'Check video memory pressure'}],
  },
  {
    ...base, slug: 'visual-c-runtime-error', path: '/guide/visual-c-runtime-error', topic: 'launch',
    title: 'Visual C++ Runtime Errors in Games: Missing DLLs, x86 and x64', shortTitle: 'Visual C++ runtime errors',
    description: 'Record the missing DLL and the affected app before choosing a Visual C++ package. Match its runtime family and architecture, repair only the relevant installation and read setup failures carefully.',
    lead: 'A generic Runtime Error does not identify a redistributable version. Start with the complete message and the game, launcher or plug-in that produced it.',
    summary: 'Use the DLL name to narrow the runtime family, then confirm the publisher’s prerequisites and the affected app’s x86 or x64 architecture. Check the matching installed package before repairing or adding it. Keep other installed versions in place.',
    branches: [
      {symptom: 'MSVCP140.dll or VCRUNTIME140.dll is missing', action: 'Check the v14 family and the app’s architecture.', step: 'vc-error-table'},
      {symptom: 'MSVCP120.dll, MSVCP110.dll or MSVCP100.dll is missing', action: 'Check the corresponding older family, not just the newest v14.', step: 'vc-error-table'},
      {symptom: 'Only Runtime Error or 0xc000007b is shown', action: 'Collect prerequisites and the affected executable; do not guess a version.', step: 'step-1'},
      {symptom: 'The Microsoft installer itself fails', action: 'Keep the setup code and logs for the matching failure branch.', step: 'vc-failed'},
    ],
    steps: [
      {id: 'step-1', title: 'Identify the message and the affected application', actions: [
        'Capture the full error, DLL name such as MSVCP120.dll, code and executable being launched. If the message only says Runtime Error, check official prerequisites and logs before deciding it is a particular Visual C++ family.',
        'Use the game’s official support to confirm its architecture and required runtime. A 32-bit game needs x86 even on 64-bit Windows. For a launcher, mod or plug-in error, check that component’s provider rather than assuming it matches the game executable.',
      ], next: 'Continue with the required family and architecture confirmed, or record them as unknown and ask the publisher. Do not choose x64 solely from the Windows edition.'},
      {id: 'step-2', title: 'Check the matching installed package', actions: [
        'Press Win+R, enter appwiz.cpl and inspect Microsoft Visual C++ Redistributable entries in Programs and Features. Record the year or 14.x family and the x86/x64 suffix separately. Windows 11 Installed apps can also show their names.',
        'Example: a confirmed 32-bit game needs MSVCP120.dll, but only 2013 (x64) appears. Check for the 2013 (x86) prerequisite; do not delete x64 or newer v14 entries. This list alone does not establish the state of DLLs bundled inside a game.',
      ], next: 'Match both family and architecture. Leave unrelated versions installed, then choose repair or installation for the identified prerequisite.'},
      {id: 'step-3', title: 'Repair or install the identified Microsoft package', actions: [
        'Open Microsoft’s distribution page in Sources and choose the family and architecture confirmed for the affected app. A game needing 2013 or earlier has a separate prerequisite; the latest v14 is not a replacement for every older family.',
        'If the matching package is installed, select it in Programs and Features and use Change → Repair where offered. If absent, use the official Microsoft installer. If Change or Repair is unavailable, check that same official package’s installer options rather than uninstalling all versions.',
      ], next: 'Record the package name and setup result. If installation fails, preserve the error and use the failure section below before retrying.'},
      {id: 'step-4', title: 'Repeat the original launch and follow the result', actions: [
        'Restart and launch the same executable in the same way. If the missing-DLL message disappears, check that the game reaches its title screen. If another name appears, record it and confirm its own prerequisite.',
        'If setup failed, retain its error and logs. If setup succeeded but the same game error remains, recheck architecture, game files and any mod or plug-in involved. For Steam, verify files; otherwise give official support the full error and relevant installed-package list.',
      ], next: 'Keep a changed error separate from a solved launch. Stop adding unrelated redistributables when the evidence points to the same unresolved component.'},
    ],
    extraSections: [
      {id: 'vc-error-table', title: 'Match the DLL family before selecting a download', actions: [
        'VCRUNTIME140.dll, VCRUNTIME140_1.dll or MSVCP140.dll: check the v14 family. MSVCP120.dll or MSVCR120.dll: check 2013. MSVCP110.dll or MSVCR110.dll: check 2012 Update 4. MSVCP100.dll or MSVCR100.dll: check 2010 SP1. Confirm the publisher’s requirements and architecture for each candidate.',
        'The older families have separate sections on Microsoft’s page and can coexist. Their continued availability does not mean they are currently supported. If a download requires sign-in or is unavailable, use the publisher’s guidance; do not substitute a third-party DLL archive.',
        'ucrtbase.dll or api-ms-win-*.dll can involve Windows Universal CRT components. Check Windows Update and the publisher’s prerequisites. A generic Runtime Error or 0xc000007b alone does not select a year or architecture.',
      ]},
      {id: 'vc-architecture', title: 'Match the app, not the Windows label', actions: [
        'Find the architecture of the executable that fails. A 32-bit game on 64-bit Windows still needs its x86 prerequisite. A separate launcher or plug-in can have different requirements.',
        'If the target is unknown, inspect the publisher’s prerequisite instructions or ask support. x86 and x64 packages can coexist on 64-bit Windows, but their presence is not a reason to install every family blindly.',
      ]},
      {id: 'vc-installed', title: 'Read installed-package names carefully', actions: [
        'In Programs and Features, record the relevant family, full version and architecture before using Change or Repair. Do not remove other years merely because they look old.',
        'If the name is absent, recheck the family and architecture against the publisher’s requirement. If the game includes a private runtime, the Windows list alone cannot verify or repair those bundled files.',
      ]},
      {id: 'vc-failed', title: 'If repair or installation fails', actions: [
        'No matching entry or no Repair option: recheck the required family and architecture, then inspect the matching Microsoft installer’s available operation.',
        'A newer version is already installed: record the installed version in the same family and architecture. Check its repair option or Microsoft’s current package instead of repeatedly running an older installer.',
        'Invalid installer package, code 1620: record the package and download source. Obtain a fresh copy of the matching official package rather than reusing a damaged file.',
        'Generic failure, code 1603: preserve the setup message and logs. Check Windows Update and restart before a controlled retry. The code alone does not identify one cause.',
        'Access denied, code 5, or file in use, code 32: save work, close running apps and restart. On a PC you administer, the verified Microsoft installer may require Run as administrator; on a managed PC, ask its administrator. Keep security protection enabled.',
        'An older version cannot be removed, code 1714: identify the exact old package in the log and follow Microsoft’s guidance for that package or ask support. Do not bulk-delete redistributables or Windows Installer storage folders.',
        'Setup succeeds but the game still fails: recheck the failing executable, architecture and complete DLL name. Compare verified game files and the documented mod configuration before asking game support.',
      ]},
      {id: 'vc-record', title: 'Five details to give support', actions: [
        'Keep the game and launch method; complete error and DLL name; affected executable’s architecture (or unknown); matching installed family/version/architecture; and repair or installation result with its error code. Review personal details before sharing screenshots or logs.',
      ]},
    ],
    cautions: ['Do not bulk-uninstall older Visual C++ entries; other software may require them.', 'Do not copy unofficial DLL downloads into the game folder or Windows directories, and do not disable protection to force setup through.'],
    faqs: [
      {question: 'Does 64-bit Windows mean I only need x64?', answer: 'No. Match the affected app. A 32-bit game requires its x86 runtime even on 64-bit Windows; also match the required family.'},
      {question: 'Will the latest v14 replace MSVCP120.dll?', answer: 'The 120 family points to Visual C++ 2013. Confirm the game’s prerequisite and architecture, then use that section of Microsoft’s page rather than assuming v14 replaces it.'},
      {question: 'Should I remove old 2010 or 2013 entries?', answer: 'Other games may still depend on them. Repair or add only the prerequisite relevant to this error, keeping the other packages in place.'},
      {question: 'Which package fixes Runtime Error with no DLL name?', answer: 'That phrase alone cannot determine a year or architecture. Check the publisher’s prerequisites, the component that failed and its logs before choosing a package.'},
      {question: 'What does installer error 1603 mean?', answer: 'It is a general setup failure, not a specific diagnosis. Preserve the setup log, check the matching installed package and follow the failure branch; do not remove every runtime or download loose DLLs.'},
    ],
    sources: [
      {label: 'Microsoft: Visual C++ families and architecture-specific downloads', url: 'https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist'},
      {label: 'Microsoft: repair apps and programs', url: 'https://support.microsoft.com/en-us/windows/apps/repair-apps-and-programs-in-windows'},
      {label: 'Microsoft: troubleshoot Visual C++ Redistributable installation', url: 'https://learn.microsoft.com/en-us/cpp/windows/troubleshoot-vc-redistributable-installation-issues?view=msvc-170'},
      {label: 'Steam Support: verify game files', url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB'},
    ],
    related: [{href: '/en/guide/directx-error', label: 'DirectX and DXGI errors'}, {href: '/en/guide/verify-steam-files', label: 'Verify Steam files'}, {href: '/en/guide/steam-game-not-launching', label: 'Steam launch failures'}, {href: '/guide/remove-mods-safely', label: 'Compare a game without mods safely (Japanese)'}],
  },
];
