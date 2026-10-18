import type { EnglishCommonGuide } from './common-guides-en';
export const reshadeGuideEn: EnglishCommonGuide = {
 slug:'reshade-uninstall',path:'/guide/reshade-uninstall',topic:'mods',
 title:'Uninstall ReShade Safely: Identify Files, Keep Presets and Restore',shortTitle:'Uninstall or disable ReShade',
 description:'Use the original ReShade installation route, identify a DLL before moving it, preserve presets and add-ons, and distinguish shared Vulkan/OpenXR layers from local files.',
 lead:'For removing ReShade or investigating a launch/black-screen problem after installing it. Turning effects off changes the image but does not unload ReShade itself.',
 summary:'Record the game executable, graphics API and installation method, then copy settings, presets and added assets outside the game. Use the official setup or original mod manager where applicable. For a manual local Direct3D/OpenGL install, move only a positively identified ReShade DLL. Shared Vulkan/OpenXR installations need the setup’s application-specific handling.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese guide and its file-identification, restoration and residual-load checks. The linked v6.8.0 source is the inspected implementation, not a claim that every newer setup has identical screens. Developer guidance supports the normal local-file distinction. No game-specific uninstall was executed for this article.',
 branches:[
 {symptom:'Installed through ReShade setup',action:'Choose the same executable/API and explicitly select uninstall.',step:'step-2'},
 {symptom:'Installed through a mod manager or pack',action:'Disable through that source before files can be redeployed.',step:'reshade-route'},
 {symptom:'A DLL was copied manually',action:'Identify its product and original path before moving it.',step:'reshade-files'},
 {symptom:'Vulkan/OpenXR, or ReShade returns after removal',action:'Review the shared-layer or alternate-launch route.',step:'reshade-still-loaded'},
 ],
 steps:[
 {id:'step-1',title:'Record the installation and preserve reusable files',actions:[
 'Close the game. In Steam, its Manage → Browse local files action opens the installation. Identify the actual game executable chosen during ReShade setup, not simply its launcher or another store’s copy.',
 'Copy ReShade.ini, the active preset, your added shader assets and any add-ons you need into a dated folder outside the game. Include presets saved elsewhere. PresetPath in the configuration can help locate the selected preset; check the actual file and keep its original path.',
 'Record the executable’s full path, ReShade version, graphics API and installed add-ons. Before moving a DLL manually, identify its product details and compare them with your installation record as described below.',
 ],next:'Confirm the copy before uninstalling. Keep game saves separately protected if you will also change other mods or repair installed files.'},
 {id:'step-2',title:'Remove it through the correct installation route',actions:[
 'For an official setup installation, obtain setup from reshade.me and select the same game executable and graphics API. When an existing installation is detected, explicitly choose Uninstall ReShade and effects. In the inspected v6.8.0 screen, the default is Update, so continuing without changing it does not uninstall.',
 'For a mod manager or distribution pack, use its documented disable/removal procedure. Removing files while the manager still enables the package can allow them to be placed back during deployment or launch.',
 'For a manually copied local Direct3D/OpenGL install, move only the DLL you have confirmed belongs to ReShade out of its load location, into a separate holding folder. Keep the backup intact. Compare loading before cleaning related settings or shaders.',
 'For Vulkan or OpenXR, use official setup for the selected application. These use shared layer handling; moving a DLL beside one game is not enough to establish removal. Do not manually edit shared layer registrations or delete their directories.',
 ],next:'If the executable/API or file ownership cannot be identified, stop and consult the original installation instructions. Do not overwrite an unfamiliar DLL to make setup proceed.'},
 {id:'step-3',title:'Check loading and the original symptom separately',actions:[
 'Launch through the same route as before. Record both ReShade’s startup/overlay behavior and whether the crash or black screen changed. A notification can be hidden, so its absence alone does not prove ReShade is unloaded.',
 'If launch works, exit normally and check another launch for automatic redeployment. Keep reusable presets. Review ownership before cleaning remaining configuration, logs or shader files; their mere presence does not prove the module still loads.',
 'If nothing changes, compare other mods/overlays individually. If an original game file may have been moved accidentally, restore the identified file first. Where appropriate, use Steam Properties → Installed Files → Verify integrity of game files after preserving saves and mod records.',
 ],next:'Do not confuse removing ReShade with resolving every color or launch issue. Preserve the record and use the relevant game/display guide if the symptom remains.'},
 ],
 extraSections:[
 {id:'reshade-route',title:'Choose removal by installation method',actions:[
 'Setup installation: select the original game executable/API and the uninstall operation. Manager/pack: use that source’s removal procedure and check whether deployment would restore it.',
 'Manual local DLL: identify and move that addition only. Vulkan/OpenXR: use setup’s shared-layer handling for the target application. These routes have different scopes and should not be mixed by guessing file locations.',
 ]},
 {id:'reshade-files',title:'Identify a file before moving it',actions:[
 'Local-module filenames can include dxgi.dll, d3d9.dll, d3d11.dll or opengl32.dll. These names are also used by other software. Inspect Properties → Details for product/description and correlate ReShade identification with the executable path and installation record. A filename or modification date alone is insufficient.',
 'ReShade.ini holds configuration; a preset such as ReShadePreset.ini or a custom .ini stores effect choices. Shader assets and ReShade.log have separate roles. Preserve what you need and do not confuse these with the game’s own configuration files.',
 'The inspected setup uses product metadata to distinguish ReShade from other modules. If ownership remains uncertain, stop manual changes and use the setup’s detection or original distributor’s instructions.',
 'All local-file discussion concerns the verified game installation. Do not modify Windows System32 or SysWOW64. Older/custom installations may differ; an absent filename is not permission to delete another one.',
 ]},
 {id:'reshade-still-loaded',title:'When uninstall is unavailable or ReShade returns',actions:[
 'No uninstall choice: check the selected executable/API, actual game versus launcher, store and installation location. Do not assume an installer detecting nothing proves there was no installation elsewhere.',
 'Setup reports a non-ReShade DLL: cancel rather than overwrite it, then review other rendering tools such as DXVK in your installation record. A package conflict needs identification first.',
 'ReShade loads again: inspect an alternate executable, manager redeployment or a shared Vulkan/OpenXR installation. A file in use should be handled by closing the game/launcher normally, or restarting before launch if necessary; do not force-delete it.',
 'The overlay disappears but the game still fails: compare other mods/overlays and the game’s known issues one at a time. The first result concerns ReShade loading; the second concerns the original fault.',
 ]},
 {id:'reshade-restore',title:'Restore through the same route without blind overwrites',actions:[
 'After manual relocation, close the game and compare the original destination with your record. If a new same-named file is present, identify it before any replacement. Return the confirmed ReShade addition to its original path only when compatible.',
 'After setup removal, reinstall from the official source for the correct executable/API, add the required effects, then select your preserved preset. Use the manager for a managed package. Vulkan/OpenXR restoration is not just copying a DLL into the game folder.',
 'Keep the backup until a normal launch confirms the intended setup. If restoring it recreates the issue, remove/disable it through the same documented route and investigate version or compatibility requirements.',
 ]},
 {id:'reshade-record',title:'Keep four observations for support',actions:[
 'Record installation method/API; selected executable and identified files; ReShade loading versus the original symptom after removal; and whether either returns after another launch.',
 'Include the version of setup used. The source review here concerns v6.8.0; current software may differ. Redact Windows usernames from paths before posting publicly. Do not describe a source-code review as a successful game-specific test.',
 ]},
 ],
 cautions:['Never remove a DLL solely because its name appears in a cleanup list.','Keep presets, configuration, needed assets and add-ons outside the uninstall scope first.','Do not edit Windows system folders or shared-layer registry entries as a shortcut.'],
 faqs:[
 {question:'Does removing dxgi.dll uninstall ReShade?',answer:'Only a positively identified local ReShade module at the actual load path supports that comparison. Another rendering tool may use the same filename, and Vulkan follows a different route. Preserve and identify before moving it.'},
 {question:'Is turning effects off the same as uninstalling?',answer:'No. ReShade can remain loaded with its effects disabled. Effects-off can compare image processing; a launch conflict requires checking the module’s loading path.'},
 {question:'A preset .ini remains. Did removal fail?',answer:'A preset alone is not the loading module. Keep it for reuse and distinguish it from the game’s own settings. Judge removal using the installation route and loading checks, not just leftover preset files.'},
 {question:'Will Steam verification remove ReShade?',answer:'Do not rely on verification as complete removal of added mods. Use setup or the original manager for ReShade; verification has the separate role of checking installed game files.'},
 {question:'Colors still look wrong after removal. What should I check?',answer:'Compare the same scene and inspect game HDR/gamma, GPU color controls and other rendering mods one at a time. A remaining color difference does not by itself prove ReShade still loads.'},
 ],
 sources:[
 {label:'ReShade: official distribution and supported APIs',url:'https://reshade.me/'},
 {label:'ReShade v6.8.0 source: identification and removal behavior',url:'https://github.com/crosire/reshade/blob/v6.8.0/setup/MainWindow.xaml.cs'},
 {label:'ReShade v6.8.0 source: operation choices and default selection',url:'https://github.com/crosire/reshade/blob/v6.8.0/setup/Pages/SelectOperationPage.xaml'},
 {label:'Developer crosire: normal local installation files',url:'https://reshade.me/forum/troubleshooting/3407-how-to-uninstall-completely'},
 {label:'Steam Support: verify installed game files',url:'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB'},
 ],
 related:[{href:'/en/guide/remove-mods-safely',label:'Remove other mods safely'},{href:'/en/guide/steam-game-not-launching',label:'Steam launch failures'},{href:'/en/guide/black-screen',label:'Black screens'},{href:'/en/guide/verify-steam-files',label:'Verify game files'},{href:'/en/guide/reset-config-file',label:'Reset a configuration file'}],
};
