import type { EnglishCommonGuide } from './common-guides-en';
export const shaderGuideEn: EnglishCommonGuide = {
 slug:'shader-cache-delete',path:'/guide/shader-cache-delete',topic:'display',
 title:'Clear and Rebuild Shader Caches: Windows, NVIDIA and AMD',shortTitle:'Shader cache cleanup and rebuilding',
 description:'Choose the correct shader cache, use documented Windows or GPU controls, restore NVIDIA’s cache setting, and compare gameplay after compilation finishes.',
 lead:'For a rendering or launch problem where cache cleanup is a relevant troubleshooting step. Shader caches reuse compiled graphics work; clearing them regularly is not an FPS upgrade.',
 summary:'Choose one cache route, close the game and launcher, and clear only its documented target. Allow the game to rebuild what it needs. Compare the same scene again after compilation and on the next launch; the first run can stutter while new shaders are prepared.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese shader-cache guide, including its vendor routes and result checks. Vendor instructions describe different caches and software versions. Our comparison sequence is editorial guidance, not a game benchmark or a guarantee that cache corruption caused the symptom.',
 branches:[
 {symptom:'Using Windows cleanup',action:'Select only DirectX Shader Cache if present.',step:'shader-windows'},
 {symptom:'Following NVIDIA’s manual cache route',action:'Temporarily disable caching, clear identified contents, then restore Driver Default.',step:'shader-nvidia'},
 {symptom:'AMD Software exposes Reset Shader Cache',action:'Use that specific reset, not a full software reset.',step:'shader-amd'},
 {symptom:'The game is already preparing shaders',action:'Follow its waiting-screen instructions before attempting cleanup.',step:'shader-game'},
 ],
 steps:[
 {id:'step-1',title:'Record the symptom and close the game',actions:[
 'Record the game, GPU, driver version, update before the symptom and affected scene. Choose one repeatable scene and keep quality settings unchanged.',
 'Close the game and launcher, and check free space for rebuilding. If initial shader preparation is visibly progressing, let it finish instead of deleting its work.',
 ],next:'Start with the game’s own current instructions when only that game is affected. Do not treat every stutter as a cache fault.'},
 {id:'step-2',title:'Clear only the selected cache',actions:[
 'Choose one Windows, NVIDIA or AMD route below. Do not clear every cache at once: launch and record the result after each relevant comparison.',
 'For an in-game preparation indicator, read the game-specific examples below. Waiting for preloading is a different operation from deleting cached files.',
 ],next:'If the documented option or folder is absent, skip that target. Do not substitute an unfamiliar folder or force access to files in use.'},
 {id:'step-3',title:'Let rebuilding finish, then compare',actions:[
 'Launch the game. If it displays shader compilation, optimization or preloading, wait on the screen the game specifies. There is no universal completion time across CPUs, games and storage.',
 'After preparation completes, compare the chosen scene. Exit normally and compare the same scene/settings on another launch. Record first-visit hitches separately from a failure that returns every time.',
 'If it does not improve, stop repeating cleanup. Use the result checks below for file verification, GPU memory or driver investigation. For NVIDIA, confirm caching was re-enabled before judging the result.',
 ],next:'Repeated whole-PC restarts or stop codes are not normal compilation behavior. Stop the game test and investigate the wider failure.'},
 ],
 extraSections:[
 {id:'shader-route',title:'Windows, driver and game caches are different',actions:[
 'Windows Disk Cleanup exposes a DirectX Shader Cache category when available. NVIDIA and AMD also manage driver caches. A game can maintain its own preparation process or data. One cleanup operation is not proof that every cache is empty.',
 'Choose the route relevant to the symptom or the game publisher’s instructions. Persistent low FPS across games also needs quality/load checks; routine cache deletion can make the next run slower.',
 ]},
 {id:'shader-windows',title:'Windows: select only DirectX Shader Cache',actions:[
 'Search Start for Disk Cleanup and open it. If asked for a drive, select the Windows drive, normally C:.',
 'In Files to delete, clear unrelated selections and select only DirectX Shader Cache. Review the category, then choose OK and Delete Files. Save other work before a requested restart.',
 'If the item is missing or contains no data, skip this operation. Do not delete a similar-looking folder instead. Microsoft documents the cleanup controls; the linked Intel support discussion documents this specific category as a troubleshooting step, not as a confirmed fix for every case.',
 ]},
 {id:'shader-nvidia',title:'NVIDIA: finish by re-enabling the cache',actions:[
 'Following NVIDIA’s linked manual procedure, open NVIDIA App → Graphics → Global Settings → Shader Cache Size. Record the original value, set Cache Size to Off, apply it and restart the PC.',
 String.raw`Before opening a game, inspect these documented folders if they exist: %USERPROFILE%\AppData\Local\NVIDIA\DXCache; %USERPROFILE%\AppData\Local\NVIDIA\GLCache; %USERPROFILE%\AppData\Local\NVIDIA Corporation\NV_Cache. Remove only their cache contents, not their parent directories. Skip missing folders and files in use.`,
 'Return to NVIDIA App, set the cache to Driver Default, apply and restart again. Off was temporary. If the setting is unavailable or paths differ, stop this route and consult the current vendor/game instructions rather than broadening deletion. A driver-removal utility is not required for this manual route.',
 ]},
 {id:'shader-amd',title:'AMD: use the specific shader-cache reset',actions:[
 'Open AMD Software and its Global Graphics settings, using Gaming → Graphics or the software’s settings search as available. Expand Advanced and locate Reset Shader Cache.',
 'Use that specific reset and review any confirmation. It clears stored shaders so they can be generated again. Do not substitute Factory Reset or another whole-software reset.',
 'AMD’s linked guide uses a full installation of Adrenalin Edition 23.9.1 as its reference. Screens and available controls depend on version, installation type and hardware. If the option is absent, skip it rather than guessing a manual directory.',
 ]},
 {id:'shader-game',title:'Game preparation is not a universal reset button',actions:[
 'Black Ops 6: Activision says to let shader preloading finish before playing and to remain in the Main Menu during it. Leaving that menu interrupts preloading. This instruction applies to that game; it does not establish a common rebuild button for other titles.',
 'Fortnite: Epic describes repeated DirectX 12 shader recompilation as one cause of heavy stutter and explains that the first match after cleanup may still stutter while new shaders compile. Compare later behavior too. Its game-specific paths may differ from the generic NVIDIA procedure; do not combine the lists or guess which version applies.',
 'Do not delete a game’s shader assets simply because their names contain shader. Follow that game’s documented cache procedure when needed.',
 ]},
 {id:'shader-rebuild',title:'When to wait and when to change the investigation',actions:[
 'Progress moves and loading takes longer: allow preparation to finish on the required screen. A brief pause in a progress display is not by itself grounds to force-close the game.',
 'Only the first visit to a scene hitches: compilation is a candidate. Compare the same scene on a later launch. If every run crashes at the same percentage, record the exact error/progress/time and check installed files and official known issues.',
 'Preparation finishes but performance stays low or GPU memory errors occur: check quality and VRAM rather than deleting again. If the PC restarts or shows a Windows stop code, stop the normal cache comparison and use system troubleshooting.',
 ]},
 {id:'shader-record',title:'Record a comparison someone else can interpret',actions:[
 'Keep game/GPU/driver version, the update and scene before the problem, the route used, whether preparation completed, and first-versus-next-launch results under identical settings.',
 'Include the error text, any skipped in-use files and whether the NVIDIA cache setting was restored. Mark unknown observations as unknown. This is a reader’s test record, not evidence that we ran the game on that hardware.',
 ]},
 ],
 cautions:['Target only the documented cache; never remove an entire save or AppData folder.','Expect rebuilding cost after cleanup. Repeating deletion prevents a useful comparison.','Do not force-delete locked files or leave NVIDIA caching Off after this procedure.'],
 faqs:[
 {question:'Does shader-cache cleanup delete saves?',answer:'The identified caches store reusable graphics work, separately from progress. That does not make whole game-data folders safe to delete. Limit the operation to the named category or identified cache contents.'},
 {question:'Will deleting caches before every session improve FPS?',answer:'It is not recommended. Reusing compiled shaders avoids work; deletion makes that work necessary again. Persistent low FPS also needs a quality and GPU-load investigation.'},
 {question:'What if DirectX Shader Cache is absent or shows zero bytes?',answer:'There may be no removable data in that category. Skip it rather than hunting for similarly named folders. That result does not prove driver or game caches are empty.'},
 {question:'Can I leave NVIDIA Shader Cache Size Off?',answer:'Off is temporary in this troubleshooting route. Complete the return to Driver Default, Apply and restart. Otherwise later runs cannot make the same use of cached work and your comparison conditions change.'},
 {question:'Does the Windows operation clear every game’s cache?',answer:'No universal coverage is established. Windows, GPU drivers and games can manage separate data. Use only a relevant documented route and follow game-specific guidance for game-owned caches.'},
 ],
 sources:[
 {label:'Intel support discussion: DirectX Shader Cache troubleshooting',url:'https://community.intel.com/t5/Gaming-on-Intel-Processors-with/CS2-crashed-Failure-Exception-IP-Module-igd10umt64xe-DLL/m-p/1757369'},
 {label:'Microsoft: Disk Cleanup and selecting temporary-file categories',url:'https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows'},
 {label:'NVIDIA: manual shader-cache removal and restoring caching',url:'https://nvidia.custhelp.com/app/answers/detail/a_id/5735/~/deleting-nvidia-shader-cache-files'},
 {label:'NVIDIA: Shader Cache Size and recompilation',url:'https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm'},
 {label:'AMD: Global Graphics and Reset Shader Cache',url:'https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html'},
 {label:'Activision: Black Ops 6 shader-preloading conditions',url:'https://support.activision.com/black-ops-6/articles/black-ops-6-pc-troubleshooting'},
 {label:'Epic Games: Fortnite DirectX 12 recompilation and first-match stutter',url:'https://www.epicgames.com/help/c-34254770/c-38015632/a11302262'},
 ],
 related:[{href:'/en/guide/stutter-fix',label:'Compare brief hitches'},{href:'/en/guide/verify-steam-files',label:'Verify game files'},{href:'/en/guide/gpu-driver-update',label:'GPU driver checks'},{href:'/en/guide/vram-shortage',label:'VRAM and quality settings'},{href:'/en/guide/pc-game-crash',label:'Game crashes'}],
};
