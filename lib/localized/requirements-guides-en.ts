import type { EnglishCommonGuide } from './common-guides-en';
export const requirementsGuidesEn: EnglishCommonGuide[] = [
 {
 slug:'tpm-secure-boot',path:'/guide/tpm-secure-boot',topic:'launch',
 title:'A Game Requires TPM 2.0 or Secure Boot: Check Before Changing Firmware',shortTitle:'TPM 2.0 and Secure Boot requirements',
 description:'Check TPM version and Secure Boot state in Windows. Prepare backups, recovery keys and model-specific instructions before any firmware or boot change.',
 lead:'For a PC game reporting a TPM 2.0 or Secure Boot requirement. The first checks below only inspect the current state; firmware changes need the correct instructions for your exact PC or motherboard.',
 summary:'Use tpm.msc to inspect TPM readiness/version and msinfo32 to inspect BIOS Mode and Secure Boot State. Do not switch Legacy/CSM to UEFI just because a game requests Secure Boot. Identify disk format, preserve data and encryption recovery access, and obtain model-specific recovery instructions first.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese TPM guide. Microsoft documents Windows checks and prerequisites; Activision documents its own game requirements. This is a preparation and decision guide, not a universal firmware procedure or evidence that a BIOS conversion was tested.',
 branches:[
 {symptom:'TPM version or status is unknown',action:'Read tpm.msc without clearing the TPM.',step:'step-1'},
 {symptom:'Secure Boot is Off, Unsupported or BIOS Mode is Legacy',action:'Check boot/disk prerequisites before changing anything.',step:'step-4'},
 {symptom:'You lack a recovery key or model-specific instructions',action:'Stop at inspection and ask the PC administrator/manufacturer.',step:'step-2'},
 {symptom:'Windows reports the required state but the game still refuses it',action:'Use that game’s official attestation guidance.',step:'step-5'},
 ],
 steps:[
 {id:'step-1',title:'Inspect the current Windows state',actions:[
 'Press Windows+R, enter tpm.msc and choose OK. Read whether the TPM is ready for use and whether Specification Version is 2.0. Compatible TPM cannot be found can mean it is disabled; it does not alone prove the hardware lacks it.',
 'Open Windows+R → msinfo32. Record BIOS Mode and Secure Boot State. The intended state for a game requiring enabled Secure Boot is UEFI with Secure Boot On.',
 'Windows 11 eligibility includes Secure Boot capability, which is not the same observation as it currently being enabled. Check the state itself and distinguish the game’s requirement from the OS requirement.',
 ],next:'Keep the exact result. If it is unclear, do not guess a firmware switch from a similarly named setting.'},
 {id:'step-2',title:'Prepare before entering firmware settings',actions:[
 'Back up important data and confirm access to the correct BitLocker/device-encryption recovery key if encryption is used. Obtain the exact model’s instructions and recovery procedure. If these are unavailable, stop and contact the manufacturer or administrator. Do not choose Clear TPM.',
 'Save open work. On Windows 11, the normal route is Settings → System → Recovery → Advanced startup → Restart now. Use the manufacturer’s documented entry route if the screen differs.',
 'On the recovery screen, use Troubleshoot → Advanced options → UEFI Firmware Settings → Restart where that option is available. Entering the screen does not require changing a setting.',
 'Firmware menus and save/exit controls differ by model. Read and record current settings before any approved change; if unsure, exit without saving changes and seek support.',
 ],next:'Do not expose recovery keys in screenshots or support posts. Having a backup is not the same as knowing how this PC will recover from a boot change.'},
 {id:'step-3',title:'Enable a supported TPM using the model’s instructions',actions:[
 'Only after preparation, locate the TPM option described by the manufacturer. Microsoft lists menu examples such as Advanced, Security or Trusted Computing; they are not guaranteed menu names.',
 'Possible labels include Intel PTT, Intel Platform Trust Technology, AMD fTPM/PSP fTPM, Security Device Support or TPM State. Match the documented setting for your model instead of enabling every similarly named option.',
 'Use the model’s save-and-restart procedure, then return to tpm.msc and confirm readiness plus Specification Version 2.0. A save-key example such as F10 is not universal.',
 ],next:'If Windows does not return normally or recovery is requested, follow the prepared recovery/manufacturer instructions. Do not clear TPM as a troubleshooting shortcut.'},
 {id:'step-4',title:'Check boot prerequisites before enabling Secure Boot',actions:[
 'In Disk Management, identify the disk containing Windows and inspect its Properties → Volumes → Partition style. If it is MBR or the disk/state is uncertain, do not disable CSM or switch boot mode to UEFI; ask the manufacturer or administrator.',
 'Only with confirmed compatible UEFI/GPT setup, backups, recovery access and model-specific instructions, enable Secure Boot by that documented route. Record the previous state and verify msinfo32 after restarting. If controls are unavailable, do not delete keys or improvise firmware settings.',
 'If MBR-to-GPT conversion is required, review Microsoft’s MBR2GPT prerequisites with the administrator/manufacturer. Conversion and subsequent firmware boot changes need a recovery plan, including encryption handling. This guide does not provide a conversion command or recommend disabling encryption wholesale.',
 ],next:'Stop at an unmet prerequisite. A game launch error is not a reason to risk an unbootable Windows installation.'},
 {id:'step-5',title:'Use the game’s official guidance if checks still fail',actions:[
 'For the relevant Call of Duty titles, Activision documents CODBrokerInstaller.exe or enrollaik.exe UAC requests during normal official launch/registration. Verify the request’s origin and publisher against the official guidance; a matching filename alone is not authorization to approve an unexpected program.',
 'On a stable PC, review Windows Update and restart as required, then recheck the recorded TPM/Secure Boot state before another normal launch.',
 'Activision describes an AMD firmware 3.*.0.* registration/compliance issue. If applicable, contact the motherboard/PC manufacturer for the exact supported firmware procedure. Do not flash firmware on unstable power or from an unrelated model’s download.',
 ],next:'Provide the error and observed state to official support. Do not weaken UAC, disable anti-cheat or repeatedly approve unexplained prompts to bypass the check.'},
 ],
 extraSections:[
 {id:'tpm-stop',title:'Keep inspection, enablement and conversion separate',actions:[
 'tpm.msc and msinfo32 report different properties. TPM version 2.0 is not proof of Secure Boot On; Windows 11 installed is not proof that the game’s attestation passes.',
 'Missing recovery access, an unidentified Windows disk, Legacy/MBR, unavailable controls or an unfamiliar firmware screen are stopping conditions. Use model-specific support rather than a generic video for another motherboard.',
 'For a managed PC, involve its administrator. Never share the recovery key or attempt to clear/reset security hardware to satisfy a game prompt.',
 ]},
 ],
 cautions:['Do not clear TPM, delete Secure Boot keys or switch Legacy/CSM to UEFI by guesswork.','Preserve data and confirm encryption recovery access before changing firmware.','Use exact-model firmware instructions; this article does not execute or authorize changes on a managed PC.'],
 faqs:[
 {question:'Can enabling these features affect other software?',answer:'Do not assume every boot setup is unaffected. Firmware/boot changes can affect Windows startup and recovery, particularly with Legacy/MBR or encrypted/custom configurations. Prepare the model-specific procedure first.'},
 {question:'Which games require them?',answer:'Check each game’s official requirements. Activision currently documents both for applicable Call of Duty titles, including Modern Warfare 4, with title/mode-specific enforcement. A requirement for one game does not establish the requirement for another.'},
 {question:'What if I am not comfortable changing firmware?',answer:'Stop after recording the Windows checks and contact the PC/motherboard manufacturer or administrator. Microsoft and Activision both direct uncertain users toward hardware support; guessed switches are not necessary to collect useful information.'},
 ],
 sources:[
 {label:'Microsoft: inspect and enable TPM 2.0',url:'https://support.microsoft.com/en-us/windows/security/devicesecurity/enable-tpm-2-0-on-your-pc'},
 {label:'Microsoft: Windows 11 and Secure Boot',url:'https://support.microsoft.com/en-us/windows/security/devicesecurity/windows-11-and-secure-boot'},
 {label:'Activision: game-specific TPM, Secure Boot and registration requirements',url:'https://support.activision.com/articles/trusted-platform-module-and-secure-boot'},
 {label:'Microsoft: MBR2GPT prerequisites and encryption/boot considerations',url:'https://learn.microsoft.com/en-us/windows/deployment/mbr-to-gpt'},
 ],
 related:[{href:'/en/guide/steam-game-not-launching',label:'Steam launch failures'},{href:'/en/guide/windows-11-required',label:'Games requiring Windows 11'},{href:'/en/guide/ray-tracing-gpu',label:'Hardware ray-tracing requirements'}],
 },
 {
 slug:'windows-11-required',path:'/guide/windows-11-required',topic:'launch',
 title:'Can a Windows 11 Game Run on Windows 10? Check Before Upgrading',shortTitle:'Games that require Windows 11',
 description:'Compare the game’s supported OS with winver, check Windows 11 eligibility, preserve saves before upgrading, and distinguish ESU coverage from game compatibility.',
 lead:'For a game whose minimum requirements explicitly name Windows 11. Judge the exact game/edition’s current requirements, not just its release year or graphics features.',
 summary:'Open winver to record your Windows version/build, then compare it with the game’s minimum OS. A Windows 11-only specification does not officially support Windows 10 even if a launch happens to work. PC Health Check assesses upgrade eligibility. Windows 10 ESU provides eligible security updates; it does not change a game’s supported OS.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese Windows 11 requirements guide. Microsoft documents eligibility and Windows 10 support; current game specifications remain the authority for each title. This guide is not a tested compatibility list or an instruction to bypass upgrade safeguards.',
 branches:[
 {symptom:'Unsure which Windows version is installed',action:'Record the edition, version and build using winver.',step:'step-1'},
 {symptom:'The game lists Windows 11 as its minimum OS',action:'Check upgrade eligibility before purchasing or changing firmware.',step:'step-2'},
 {symptom:'Preparing to upgrade',action:'Preserve independent save copies and recovery access first.',step:'step-3'},
 {symptom:'Staying on Windows 10',action:'Check both the game’s OS support and your Windows update coverage.',step:'step-4'},
 ],
 steps:[
 {id:'step-1',title:'Compare Windows with the game’s minimum OS',actions:[
 'Press Windows+R, enter winver and press Enter.',
 'Record Windows 10 or Windows 11, its version and OS build. A label such as 22H2 is not a substitute for recording which Windows product it belongs to.',
 'Open the exact game/edition’s official store requirements and compare both minimum and recommended OS. Do not infer that every new game has the same OS requirement.',
 ],next:'If the minimum names Windows 11 only, treat Windows 10 as outside that published support condition even if another player reports a successful launch.'},
 {id:'step-2',title:'Check eligibility with PC Health Check',actions:[
 'Search Windows for PC Health Check and select Check now. If it is missing, use Microsoft’s official app link from the source below rather than a third-party download.',
 'Read each reported reason for ineligibility. A disabled TPM may need model-specific guidance; Secure Boot capability differs from being currently enabled. Do not change firmware merely from the overall failed-check message.',
 ],next:'An unsupported CPU cannot be made eligible by toggling TPM. Respect compatibility safeguards and consult the PC manufacturer instead of forcing an unsupported installation.'},
 {id:'step-3',title:'Preserve saves before an OS change',actions:[
 'Identify each game’s actual save location and copy the full required save data to an independent destination outside the planned change’s scope, preferably a separate physical device. Compare the copy using the linked backup guide; preserve other important files and encryption recovery access too.',
 'For Steam Cloud games, confirm synchronization finished, but retain the independent copy. Cloud availability does not establish that all recent progress or every local configuration was backed up.',
 ],next:'Proceed only with a supported upgrade plan and recoverable data. Do not treat an OS upgrade as a guaranteed repair for an unrelated game fault.'},
 {id:'step-4',title:'Understand the limits of staying on Windows 10',actions:[
 'For a game listing Windows 11 as minimum, a successful Windows 10 launch does not place that configuration inside its published support. Consider a supported OS/device path before purchase rather than relying on a bypass.',
 'For games that do support Windows 10, compare the required version/build and check applicable Windows Update coverage. Normal Windows 10 support ended on October 14, 2025; ESU is conditional security coverage for eligible devices, not a change to game requirements.',
 'If an official demo exists, it can provide a practical compatibility check before buying. Its performance and behavior do not guarantee the full game or future updates will work, particularly outside the supported OS.',
 ],next:'Consult Microsoft’s current ESU eligibility/terms when relevant. This article does not enroll a device, recommend a payment option or promise unsupported game compatibility.'},
 ],
 extraSections:[
 {id:'windows-requirements',title:'OS support and graphics requirements are separate',actions:[
 'ACE COMBAT 8’s official specification lists Windows 11. This is a checked example, not evidence that every October release requires it. Use the Japanese monthly roundup as an index and verify the current publisher/store specification for the specific title.',
 'A game can require hardware ray tracing while still supporting a specified Windows 10 build. Likewise, a suitable OS does not establish GPU, storage or security-feature compatibility. Compare each requirement independently.',
 'PC Health Check explains OS upgrade eligibility, not whether a particular game will run smoothly. If it reports a safeguard or unmet requirement, resolve that with official support before changing the installation.',
 ]},
 ],
 cautions:['Do not bypass Windows eligibility or firmware prerequisites to satisfy a game requirement.','Keep independent save copies before upgrading; synchronization alone is insufficient assurance.','A demo or another player’s report does not override published OS support.'],
 faqs:[
 {question:'Which October 2026 games need Windows 11?',answer:'Check the exact title’s current official requirements. ACE COMBAT 8 is a confirmed example. The linked Japanese monthly roundup helps locate titles, but its list is not a substitute for each publisher’s current OS specification.'},
 {question:'When did normal Windows 10 support end?',answer:'October 14, 2025. Eligible Windows 10 22H2 devices can receive security updates through the applicable ESU program after meeting its enrollment conditions. ESU does not satisfy a game’s Windows 11 requirement; consult Microsoft for current terms.'},
 {question:'PC Health Check says this PC does not meet the requirements. What now?',answer:'Read the individual reason. TPM enablement, Secure Boot capability and CPU eligibility are different issues. Use the manufacturer’s guidance and prepare recovery access before any firmware change; a setting cannot fix every unsupported component.'},
 ],
 sources:[
 {label:'Microsoft: PC Health Check and Windows 11 eligibility',url:'https://support.microsoft.com/en-us/windows/experience/compatibility/how-to-use-the-pc-health-check-app'},
 {label:'Microsoft: TPM 2.0 checks',url:'https://support.microsoft.com/en-us/windows/security/devicesecurity/enable-tpm-2-0-on-your-pc'},
 {label:'Microsoft: Secure Boot capability and Windows 11',url:'https://support.microsoft.com/en-us/windows/security/devicesecurity/windows-11-and-secure-boot'},
 {label:'Microsoft: Windows 10 Extended Security Updates',url:'https://www.microsoft.com/en-us/windows/extended-security-updates'},
 {label:'Gemnao: October 2026 PC requirements roundup (Japanese)',url:'https://gemnao.pages.dev/new-releases/2026-10'},
 {label:'ACE COMBAT 8: official Steam system requirements (Japanese)',url:'https://enso-order.acecombat.jp/'},
 ],
 related:[{href:'/en/guide/tpm-secure-boot',label:'TPM and Secure Boot checks'},{href:'/en/guide/save-data-backup',label:'Preserve saves before an upgrade'},{href:'/en/guide/steam-game-not-launching',label:'Other Steam launch failures'}],
 },
 {
 slug:'ray-tracing-gpu',path:'/guide/ray-tracing-gpu',topic:'launch',
 title:'Game Requires a Hardware Ray-Tracing GPU: Check Your Exact Model',shortTitle:'Hardware ray-tracing GPU requirements',
 description:'Identify the GPU a game uses, distinguish dedicated ray-tracing hardware from basic DXR support, and compare the publisher’s full minimum specification.',
 lead:'For a game that explicitly requires a hardware ray-tracing-capable GPU. An optional ray-tracing quality setting and a mandatory hardware feature are different requirements.',
 summary:'Record every GPU model in Task Manager and compare the actual game GPU with its published minimum. GeForce RTX and Radeon RX 6000-and-later families include dedicated ray-tracing hardware, but capability alone does not guarantee sufficient performance. Older GTX cards running some DXR effects is not proof that they meet a game’s mandatory hardware requirement.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese ray-tracing requirements guide. Publisher specifications establish game requirements; NVIDIA’s explanation distinguishes shader-based DXR from dedicated RT hardware. The guide does not claim a performance benchmark or that every GPU in a named family meets every game’s minimum.',
 branches:[
 {symptom:'Unsure which GPU is installed',action:'Record exact models, including both GPUs on a hybrid system.',step:'step-1'},
 {symptom:'A GTX card can run an older DXR demo',action:'Compare dedicated hardware requirements separately.',step:'ray-feature'},
 {symptom:'Laptop has a suitable discrete GPU',action:'Check which GPU the game actually uses.',step:'step-3'},
 {symptom:'The correct compatible GPU is already selected',action:'Inspect drivers and the other minimum requirements.',step:'step-4'},
 ],
 steps:[
 {id:'step-1',title:'Record the exact GPU model',actions:[
 'Open Task Manager with Ctrl+Shift+Esc, then Performance → GPU.',
 'Record the model shown. If GPU 0 and GPU 1 both appear, record both; the numbering alone does not identify the faster GPU or the one used by the game.',
 ],next:'Use the full model, including mobile or integrated variants where applicable. A brand name alone is not a compatibility check.'},
 {id:'step-2',title:'Compare hardware capability and the game’s minimum',actions:[
 'NVIDIA GeForce RTX families, beginning with RTX 20, provide dedicated RT hardware. GTX 10/16 models do not gain those cores from a driver update. NVIDIA documents basic DXR effects on some GTX hardware using shader cores; that is a different capability from meeting a game’s mandatory hardware requirement.',
 'AMD Radeon RX 6000 and later families include ray-tracing acceleration; for example, the RX 6600 specification lists Ray Accelerators. RX 5000 and earlier families are not equivalent to those hardware-accelerated models. For other GPUs or uncertain variants, consult the exact model specification and publisher support list.',
 'Compare the listed minimum model, memory and feature/API requirements too. A GPU can have ray-tracing hardware yet fall below the game’s required performance or memory. Lowering quality cannot add a missing mandatory hardware feature.',
 ],next:'Do not buy or replace hardware from the series name alone. Match the full game specification and exact device.'},
 {id:'step-3',title:'On multi-GPU systems, check the game’s selection',actions:[
 'If the game runs, inspect its GPU engine in Task Manager Processes where available and match the number to Performance’s model names. If no engine is shown or the game cannot launch, do not invent a selection from the numbering.',
 'In Windows Settings → System → Display → Graphics, inspect the actual game executable’s preference. Where a compatible discrete GPU is available, choose the appropriate High performance GPU, save and restart the game. Record the original preference so an unhelpful change can be restored.',
 ],next:'A High performance label is not proof that the selected GPU meets the requirement; confirm the model it names.'},
 {id:'step-4',title:'Check software and the remaining requirements',actions:[
 'Use the PC/GPU manufacturer’s supported driver channel for the exact model, following the driver guide. Keep the current version and any supported rollback option recorded; do not use unofficial driver packs.',
 'Compare the game’s other required OS/build, storage and security features. Windows 11, SSD or TPM requirements apply only where that game specifies them. Do not enable firmware features merely because another title requires them.',
 ],next:'If the selected GPU and other requirements match but launch still fails, send the exact error and device/driver details to the publisher. Do not bypass its hardware checks with unknown files.'},
 ],
 extraSections:[
 {id:'ray-feature',title:'Basic DXR support is not the same as dedicated RT hardware',actions:[
 'NVIDIA’s technical explanation describes GTX performing ray calculations on general shader cores, while RTX uses dedicated RT cores for key work. A successful old demonstration is therefore not a guarantee for a new game whose minimum explicitly requires hardware ray tracing.',
 'Read whether ray tracing is optional, recommended or mandatory. An Off setting for optional effects cannot be assumed to remove an engine’s minimum hardware requirement.',
 ]},
 {id:'ray-examples',title:'Check examples against the current official table',actions:[
 'ACE COMBAT 8’s official Steam requirements specify hardware ray tracing, SSD and DirectX 12 with Shader Model 6.6 or later, alongside Windows 11. Do not reduce that combination to a single RTX/RX label.',
 'Gears of War: E-Day’s Steam minimum also explicitly requires a hardware ray-tracing-capable GPU. Its OS specification is separate and lists a Windows 10 build; ray-tracing requirements alone do not imply Windows 11.',
 'Use the Japanese monthly roundup as an index, then recheck the current publisher/store page for your edition. This article identifies requirements rather than measuring playable frame rates on your PC.',
 ]},
 ],
 cautions:['Do not equate any DXR demonstration with meeting a game’s mandatory hardware specification.','Do not assume every RTX/RX model provides enough performance or VRAM.','Use official driver and game-support paths; do not bypass requirement checks with unknown DLLs.'],
 faqs:[
 {question:'Can a GTX 1660 Super or GTX 1080 Ti meet a mandatory hardware-ray-tracing requirement?',answer:'Do not treat those cards as equivalent to the publisher’s listed hardware-accelerated models. Some GTX GPUs can run basic DXR through shaders, but lack dedicated RT cores. Check the exact game’s supported models rather than relying on older raster performance.'},
 {question:'Can I turn ray tracing off to make an unsupported GPU work?',answer:'Only an optional feature can be treated as an optional setting. When hardware ray tracing is a minimum requirement, an effect toggle does not establish support for a GPU lacking the required feature.'},
 {question:'Which October 2026 examples require the hardware?',answer:'The official ACE COMBAT 8 requirements and Gears of War: E-Day’s Steam minimum both explicitly require it. Their other requirements differ, so compare each current table separately.'},
 ],
 sources:[
 {label:'AMD: Radeon RX 6600 specifications and Ray Accelerators',url:'https://www.amd.com/ja/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6600.html'},
 {label:'ACE COMBAT 8: official Steam requirements (Japanese)',url:'https://enso-order.acecombat.jp/'},
 {label:'Steam: Gears of War: E-Day system requirements',url:'https://store.steampowered.com/app/3010850/'},
 {label:'Gemnao: October 2026 PC requirements roundup (Japanese)',url:'https://gemnao.pages.dev/new-releases/2026-10'},
 {label:'NVIDIA: dedicated RT cores versus shader-based GTX DXR',url:'https://www.nvidia.com/en-us/geforce/news/geforce-gtx-dxr-ray-tracing-available-now/'},
 ],
 related:[{href:'/en/guide/gpu-driver-update',label:'GPU driver checks'},{href:'/en/guide/steam-game-not-launching',label:'Steam launch troubleshooting'},{href:'/en/guide/windows-11-required',label:'Check the game’s OS requirement'}],
 },
];
