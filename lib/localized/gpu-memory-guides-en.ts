import type { EnglishCommonGuide } from './common-guides-en';
const base = { category: 'Common PC game troubleshooting', checkedAt: '2026-10-18', sourcePolicy: 'English edition of our Japanese guide, including its detailed comparisons. Microsoft explains GPU counters and graphics resources. The comparison order and numerical examples are editorial guidance, not measurements from a tested PC or proof of a fault.' };
export const gpuMemoryGuidesEn: EnglishCommonGuide[] = [
{
 ...base, slug:'vram-shortage',path:'/guide/vram-shortage',topic:'display',
 title:'Is Your Game Running Out of VRAM? Compare Memory and Stutter',shortTitle:'Check possible VRAM shortage',
 description:'Read dedicated and shared GPU memory for the correct GPU. Compare one texture setting in the same scene and judge both memory use and symptoms before blaming VRAM.',
 lead:'A nearly full memory counter is a reason to investigate, not a diagnosis. First identify the GPU running the game and distinguish a discrete graphics card from integrated graphics.',
 summary:'Record dedicated and shared memory when the symptom occurs. On a discrete GPU, compare one lower texture setting in the same scene. Check whether both memory use and stutter change. For integrated graphics, include shared memory and system RAM instead of judging the small dedicated-memory figure alone.',
 branches:[
 {symptom:'Dedicated memory is nearly full and movement stutters',action:'Compare texture quality with the same route and scene.',step:'step-2'},
 {symptom:'Only a small dedicated-memory amount appears on integrated graphics',action:'Read shared memory and system RAM too.',step:'vram-readings'},
 {symptom:'A VRAM warning appears despite a low counter',action:'Check the selected GPU, timing and exact warning.',step:'vram-observe'},
 {symptom:'Memory use falls but stutter remains',action:'Move to other explanations instead of repeating the same change.',step:'vram-next'},
 ],
 steps:[
 {id:'step-1',title:'Identify the game GPU and both memory counters',actions:[
 'With the game running, press Ctrl+Shift+Esc. In Task Manager’s Processes view, use the game’s GPU engine entry where available to identify its GPU number. In Performance, select that same GPU and record its name.',
 'Immediately after the symptom, record Dedicated GPU memory and Shared GPU memory as used / displayed capacity. A small dedicated-memory value on integrated graphics does not by itself mean a fault or insufficient memory.',
 ],next:'If the GPU is uncertain, confirm its name before interpreting a reading. Keep the two memory categories separate and record the symptom at the same time.'},
 {id:'step-2',title:'Match the symptom with one setting to compare',actions:[
 'Distinguish a memory warning, hitches during movement and deterioration after a long session. A game’s VRAM estimate may describe settings rather than measured use, so do not treat it as the same counter as Task Manager.',
 'If a discrete GPU is near its dedicated-memory capacity when symptoms appear, lower texture quality by one level in the game. For an added high-resolution texture pack or mod, use its documented disable method separately and preserve any required configuration.',
 ],next:'Record the original value. Change one item, not a whole quality preset, and keep resolution and the test scene unchanged.'},
 {id:'step-3',title:'Compare memory and symptoms on the same route',actions:[
 'Record the save, resolution and route. Restart if the game requires it to apply textures, then revisit the same scene and compare dedicated/shared memory plus warnings or the number of hitches.',
 'If memory use falls but the symptom persists, investigate other causes. If it improves, revisit again to see whether the result repeats. Restore an unhelpful change and use the result branches below.',
 ],next:'A lower counter alone is not an improvement in playability. Separate the first visit from repeat visits because loading or shader preparation can also change the result.'},
 ],
 extraSections:[
 {id:'vram-readings',title:'Read dedicated, shared and total memory separately',actions:[
 'On a discrete GPU, dedicated memory refers to its graphics memory. For a display such as 7.6 / 8.0 GB, distinguish current use from capacity. Other applications can contribute to the use shown in Performance.',
 'Shared GPU memory uses system RAM. In an illustrative 0.5 / 8.0 GB reading, 0.5 GB is in use; the 8.0 GB limit is neither current use nor extra dedicated VRAM. A combined total does not turn an 8 GB graphics card into a 16 GB card.',
 'Integrated graphics may reserve some system RAM and use additional shared memory. A dedicated figure such as 128 MB cannot be compared directly with a discrete card’s VRAM to decide whether a game will run.',
 'Use the same Performance counter for before/after comparisons. Per-process memory figures can count shared resources differently; Microsoft also documents a Windows 10 per-process counter issue. Do not add process totals together and call the result physical VRAM use.',
 ]},
 {id:'vram-observe',title:'Match the observation to the moment of the problem',actions:[
 'If GPU engine is hidden, check the Processes column headings for that option. Match the number to the GPU name in Performance. If the game’s engine cannot be identified there, check its display settings and GPU name; do not guess the number.',
 'Record both memory counters just after a hitch and during a normal scene. Switching away from the game can change its workload, so note how the observation was taken. Also record system RAM in Performance → Memory, especially for integrated graphics.',
 'Near-full dedicated memory plus movement hitches makes memory pressure a candidate, alongside loading or shader preparation. Compare texture quality and repeat the route twice. Hitches only on the first visit with ample memory call for a different comparison.',
 'If shared memory and system RAM rise during long sessions, compare background video or recording apps one at a time. Repeat at a similar session length rather than comparing a fresh launch with hours of play.',
 'For a warning with a low reading, keep the exact message and time. A different selected GPU, a brief peak or an allocation request can make a later snapshot misleading; the low value does not invalidate the warning.',
 ]},
 {id:'vram-compare',title:'Make a reversible texture comparison',actions:[
 'Keep the same save, resolution, display mode and route. Record the original texture setting, both memory readings, warnings and hitches. If the first visit differs, repeat the original route before changing anything.',
 'Lower only texture quality by one level, apply the change and restart if required. If there is no texture option but the game has an optional high-resolution texture DLC, follow its official removal/disable instructions and wait for the change to finish. Do not remove unrelated DLC or game files.',
 'Illustrative example only, not a hardware test: dedicated use falls from 7.7 / 8.0 GB to 6.3 / 8.0 GB, shared use from 0.9 / 8.0 GB to 0.3 / 8.0 GB, and about three hitches per route become zero on two visits. This supports investigating memory pressure, but does not isolate it as the only cause.',
 'If only the numbers fall, do not claim success. Texture changes can affect other work, including shader preparation; compare first and repeat visits separately.',
 ]},
 {id:'vram-next',title:'Choose the next check from the result',actions:[
 'Memory use and symptoms improve: keep a usable quality setting and check other scenes. Memory falls but symptoms remain: restore the unhelpful quality reduction and compare stutter, loading or other workload factors.',
 'Neither reading nor symptom changes: confirm the setting applied and that you observed the game’s actual GPU. Use the related low-GPU-usage guide for GPU selection.',
 'Crashes or warnings continue: record the full warning, game version, GPU, settings and system RAM use. Use the crash guide and official game support. Consistently low FPS needs the separate rendering-load comparison in the FPS guide.',
 'Do not edit registry numbers to claim more physical VRAM or treat a page file as dedicated graphics memory. Preserve original settings and do not delete game files based only on their names.',
 ]},
 ],
 cautions:['A near-capacity reading is not proof of a memory shortage or broken GPU.','Do not change textures, resolution, drivers and mods together; you would lose the comparison.'],
 faqs:[
 {question:'Does 7.8 GB used on an 8 GB card prove a VRAM shortage?',answer:'No. Match the reading to the affected scene and compare both memory use and symptoms after changing only texture quality. First confirm the GPU being measured.'},
 {question:'Does 8 GB of shared GPU memory add 8 GB of VRAM?',answer:'No. Shared memory comes from system RAM. A displayed limit is also different from current use. It does not add physical memory to the graphics card.'},
 {question:'My integrated GPU shows only 128 MB dedicated. Can it run games?',answer:'That figure alone cannot decide. Integrated graphics can use shared RAM. Check the game’s official requirements, shared GPU memory and system RAM rather than comparing that figure alone with a discrete card.'},
 {question:'Textures use less memory now, but the game still stutters. What next?',answer:'Restore an unhelpful change and compare repeat visits. Shader preparation, loading and other processing can produce hitches too. Consistently low FPS needs a separate rendering/CPU comparison.'},
 {question:'Why does the game’s VRAM display differ from Task Manager?',answer:'The game may show an estimate derived from settings, while Task Manager measures a different scope including other processes. Compare the same metric before and after the change.'},
 ],
 sources:[
 {label:'Microsoft DirectX: GPU and memory counters in Task Manager',url:'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/'},
 {label:'Microsoft Learn: graphics memory reporting examples',url:'https://learn.microsoft.com/en-us/windows-hardware/drivers/display/examples-of-graphics-memory-reporting'},
 {label:'Microsoft Learn: incorrect per-process memory counters on affected Windows 10 systems',url:'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/gpu-process-memory-counters-report-wrong-value'},
 {label:'NVIDIA: texture quality and VRAM in The Witcher 3 (game-specific example)',url:'https://www.nvidia.com/en-us/geforce/news/the-witcher-3-wild-hunt-graphics-performance-and-tweaking-guide/'},
 ],
 related:[{href:'/en/guide/low-gpu-usage',label:'Low GPU usage and the selected GPU'},{href:'/en/guide/stutter-fix',label:'Hitches and stutter'},{href:'/en/guide/low-fps',label:'Consistently low FPS'},{href:'/en/guide/pc-game-crash',label:'Game crashes'},{href:'/guide/shader-cache-delete',label:'Shader cache checks (Japanese)'}],
},
{
 ...base,slug:'low-gpu-usage',path:'/guide/low-gpu-usage',topic:'launch',
 title:'Low GPU Usage in Games: Check the FPS Cap, CPU and Selected GPU',shortTitle:'Low GPU usage in games',
 description:'Compare actual FPS with your target and cap before chasing GPU utilization. Identify the game GPU, inspect CPU load and make one reversible setting change.',
 lead:'Low utilization can be normal when the game already meets your FPS target. The useful outcome is smooth, responsive play, not pushing a percentage toward 100%.',
 summary:'Check in-game FPS and its cap first. If the target is not met, identify the GPU the game actually uses and compare its rendering load with CPU logical-processor activity. Then test a relevant CPU setting, GPU selection or power condition one at a time.',
 branches:[
 {symptom:'The game holds your target FPS at its cap',action:'Low utilization alone does not require a change.',step:'gpu-normal'},
 {symptom:'FPS misses the target and some CPU threads are busy',action:'Compare one available CPU-related game setting.',step:'gpu-cpu'},
 {symptom:'A discrete GPU shows 0%, but another GPU runs the game',action:'Confirm both number and name before changing GPU preference.',step:'gpu-select'},
 {symptom:'Both readings are low and FPS remains low',action:'Check other caps, foreground state and power conditions.',step:'gpu-next'},
 ],
 steps:[
 {id:'step-1',title:'Compare gameplay FPS with its target and cap',actions:[
 'Use an available in-game FPS display or performance monitor during normal gameplay. Record the game’s FPS limit and V-Sync setting. A lobby or paused screen may use a different limit, so compare the same playable scene.',
 'Illustrative example: your target and cap are both 60 FPS, gameplay stays near 60 and there are no hitches. GPU use around 40% is not itself a problem. Investigate CPU/GPU constraints when the target is missed or movement causes drops.',
 ],next:'If the game meets the intended target smoothly, no utilization fix is needed. If a lower cap blocks the target, inspect that cap before blaming hardware.'},
 {id:'step-2',title:'Record the actual game GPU and CPU load together',actions:[
 'Press Ctrl+Shift+Esc and find the game in Processes. Use the GPU engine number, then inspect that GPU’s name and 3D graph in Performance. A different GPU at 0% does not establish that the game is not using graphics hardware.',
 'In Performance → CPU, right-click the graph and choose Change graph to → Logical processors where offered. The overall average can hide uneven work. Switching away from the game can reduce load, so treat the readings as observations rather than a conclusive diagnosis.',
 ],next:'Keep the FPS, cap, GPU name/number and CPU pattern from the same scene. A busy logical processor is a clue, not proof that the CPU is the only limitation.'},
 {id:'step-3',title:'Compare a CPU setting or the confirmed GPU choice',actions:[
 'If CPU work is a candidate, lower one available setting such as draw distance or NPC density and compare FPS in the same scene. Separately compare a background recording/video app by closing it normally; let updates finish. Avoid changing a whole preset.',
 'Only if a multi-GPU PC is confirmed to run the game on integrated graphics, inspect the game under Windows Settings → System → Display → Graphics. Record its preference, choose the intended High performance GPU, save and restart the game. Recheck the actual GPU and FPS.',
 ],next:'Judge the result by FPS and responsiveness, not a required rise in GPU use. Restore a change that does not help before the next comparison.'},
 {id:'step-4',title:'Check power and rendering load when relevant',actions:[
 'On a laptop, check its power connection and Settings → System → Power & battery → Power mode. If it is saving power, compare Balanced under the same conditions and keep the previous setting. If performance remains abnormal, use the manufacturer’s power and temperature guidance.',
 'If the actual game GPU’s 3D load is high while FPS misses the cap, compare rendering load using the related low-FPS guide. A low percentage by itself does not prove a driver fault or justify replacing the GPU.',
 ],next:'Record game/version, target and actual FPS, cap, CPU pattern, GPU identity and each comparison. Persistent symptoms need that context before further changes.'},
 ],
 extraSections:[
 {id:'gpu-normal',title:'When low GPU usage is normal',actions:[
 'An illustrative 60 FPS target, 60 FPS cap and stable 60 FPS with no hitches leaves no reason to raise GPU usage just because it reads 40%. If you want a higher target, first check the game’s cap and display refresh rate.',
 'For a 120 FPS target with a 60 FPS limit, examine the game limit, V-Sync and any known driver-level cap. Change only the relevant setting. Average FPS and occasional freezes are different symptoms; use the stutter guide for momentary hitches.',
 ]},
 {id:'gpu-readings',title:'Keep the measurement tied to the game',actions:[
 'Record FPS during actual play with the game’s display or an available monitor. Use the same scene, not a pause menu. Keep the FPS cap and V-Sync state in your notes.',
 'If needed, expose GPU engine through the Processes column headings. Match the number with the GPU name in Performance. GPU 0 is not guaranteed to mean integrated graphics on every PC.',
 'Inspect the relevant 3D engine and CPU logical-processor graphs. Task Manager’s overall GPU percentage represents its busiest engine, which may include work other than game rendering. Returning focus to Task Manager can also change the game workload.',
 ]},
 {id:'gpu-table',title:'Example readings and the next comparison',actions:[
 'These numbers are illustrative, not benchmark results. Target 60, cap 60 and actual 60 with about 40% 3D load: no change needed if play is smooth. Target 120, cap 60 and actual 60: inspect the limit first.',
 'Target 60, cap 120 and actual 45 with CPU average 35%, some logical processors near 90% and the game GPU near 35%: CPU-side work is a candidate. Compare one relevant setting; the readings alone do not prove the cause.',
 'Actual 45 with integrated GPU near 90% and a discrete GPU at 0%: inspect which GPU runs the game. Actual 45 with the correct discrete GPU near 96%: investigate rendering load rather than trying to raise utilization.',
 'Actual 45 with low CPU and GPU readings: the cause is still unclear. Check another cap, whether the game became a background window and its power conditions.',
 ]},
 {id:'gpu-cpu',title:'Test CPU-side work without changing every setting',actions:[
 'Confirm that a cap below your target is not the explanation. At the same slow scene, record whether CPU work is uneven while the game GPU has spare capacity.',
 'If provided by the game, compare one draw-distance, NPC-density, object-count or simulation-quality setting. Keep its original value and restore it if unhelpful. Skip options the game does not offer.',
 'Close one optional recording or video app normally and compare again. Let an active update finish rather than interrupting it. Improved FPS does not require GPU usage to rise by a particular amount.',
 ]},
 {id:'gpu-select',title:'Choose another GPU only when the evidence supports it',actions:[
 'Match the game process’s engine number with the GPU name. An idle discrete GPU can coexist with a game running on integrated graphics; idle does not mean broken.',
 'On a multi-GPU Windows 11 PC, select the game in System → Display → Graphics, inspect its options and the GPU named for High performance, then save. If you need to add a desktop app, identify the game executable rather than choosing only its launcher.',
 'Close and reopen the game, then recheck the actual GPU, FPS and 3D load in the same scene. Restore the original preference if the change does not help. A single-GPU PC does not need this comparison.',
 ]},
 {id:'gpu-next',title:'If FPS and both utilization readings stay low',actions:[
 'FPS fixed at a particular value: inspect game, V-Sync, driver and lobby-specific limits. Change one only when it conflicts with your intended target.',
 'Laptop on battery or saving power: confirm the appropriate power connection and compare Balanced power mode where available. Watch temperature and battery use; use manufacturer guidance for abnormal behavior.',
 'GPU load drops only when Task Manager is in front: prioritize an in-game FPS reading or observe from another display if available. Do not diagnose the running game from an idle/background snapshot.',
 'The actual GPU is busy: use the low-FPS guide to compare render resolution. GPU selection and power look appropriate but the issue began after an update: record game/Windows update timing and driver version, then use the driver guide.',
 ]},
 ],
 cautions:['Do not chase 100% GPU utilization when the game already meets your target smoothly.','Do not disable security, overclock or buy replacement hardware based on one utilization snapshot.'],
 faqs:[
 {question:'I get 60 FPS at a 60 FPS cap and only 40% GPU use. Is that bad?',answer:'If 60 FPS is your target and play is smooth, low utilization alone needs no repair. If you want a higher target, check the cap and display refresh rate first.'},
 {question:'CPU average is only 30%. Can it still limit FPS?',answer:'The average can hide uneven work across logical processors. Compare their graphs with the cap and actual game GPU, then test one relevant setting instead of treating the average as proof.'},
 {question:'My discrete GPU shows 0%. Is the game ignoring it?',answer:'You may be inspecting another GPU or engine, or the game may reduce work when it loses focus. Match the game’s GPU engine number to its name and 3D graph.'},
 {question:'Does High performance GPU preference improve every PC?',answer:'No. It is a comparison for a PC with another suitable GPU when the game is using the unintended one. Restart and verify the actual result; a one-GPU PC may have nothing to switch.'},
 {question:'FPS is high but the game briefly freezes. Is low GPU use the cause?',answer:'A high average and brief hitches need separate checks. Record when the pauses occur, including first visits and loading, and use the stutter guide rather than assuming the utilization figure explains them.'},
 ],
 sources:[
 {label:'Microsoft DirectX: CPU and GPU constraints',url:'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/'},
 {label:'Microsoft DirectX: GPU numbers and engine readings in Task Manager',url:'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/'},
 {label:'Microsoft: per-game graphics preference in Windows 11',url:'https://support.microsoft.com/en-us/windows/hardware/display-graphics/optimizations-for-windowed-games-in-windows-11'},
 {label:'Microsoft: CPU cores and logical processors in Task Manager',url:'https://support.microsoft.com/en-us/windows/experience/compatibility/find-out-how-many-cores-a-processor-on-a-windows-device-has'},
 {label:'Microsoft: Windows performance and power-mode considerations',url:'https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows'},
 {label:'Steam Support: in-game performance monitor',url:'https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767'},
 ],
 related:[{href:'/en/guide/low-fps',label:'Low FPS and rendering load'},{href:'/en/guide/stutter-fix',label:'Brief freezes and stutter'},{href:'/en/guide/vram-shortage',label:'Check GPU memory pressure'},{href:'/en/guide/gpu-driver-update',label:'GPU driver checks'}],
},
];
