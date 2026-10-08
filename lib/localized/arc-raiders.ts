import type { LocalizedArticle } from '@/lib/localized/types';

export const arcRaidersLocalizedArticles: LocalizedArticle[] = [
  {
    "locale": "en",
    "gameSlug": "arc-raiders",
    "gameName": "ARC Raiders",
    "slug": "matchmaking",
    "checkedAt": "2026-10-08",
    "sourcePolicy": "Based on Embark’s official support and patch notes, checked on October 8, 2026. The symptom comparisons and order of checks are editorial guidance, not hands-on proof or a measured success rate. English UI labels are retained from the official instructions.",
    "title": "ARC Raiders Matchmaking Not Working on PC: Clock, Crossplay and Region Checks",
    "shortTitle": "Matchmaking not working",
    "description": "Troubleshoot ARC Raiders matchmaking on PC. Check the device clock, every party member’s crossplay setting and the Automatic server region, including failures with map conditions.",
    "lead": "For PC players who can reach the lobby but cannot find a match, wait longer with friends, or can enter standard maps but not maps with conditions.",
    "summary": "Record whether the problem differs between standard maps and map conditions, or between solo and party play. Then check clock synchronization, the whole party’s crossplay settings and the Automatic server region one at a time. Keep a note of each change and its result. If login itself fails or an official outage is announced, follow the relevant support notice rather than repeating these changes.",
    "quickFacts": [
      {
        "label": "Only map conditions fail",
        "value": "Check device clock synchronization"
      },
      {
        "label": "Longer waits in a party",
        "value": "The most restrictive member’s crossplay setting applies to the party"
      },
      {
        "label": "Server region",
        "value": "Gameplay → Server → Automatic"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Standard maps work, but map conditions do not",
        "cause": "An incorrect device clock is one possible cause",
        "stepId": "sync-clock"
      },
      {
        "symptom": "Queues get longer when playing with friends",
        "cause": "Check crossplay settings across the party",
        "stepId": "crossplay"
      },
      {
        "symptom": "A server region is selected manually",
        "cause": "Compare with the official Automatic recommendation",
        "stepId": "server-region"
      }
    ],
    "steps": [
      {
        "id": "record-symptom",
        "title": "Identify what fails and check official notices",
        "summary": "Separate login failures from getting stuck after starting matchmaking.",
        "time": "About 2 minutes",
        "risk": "low",
        "actions": [
          "Record whether the lobby opens, when matchmaking stops progressing and the full error message, if any.",
          "Using what you have already tried, note differences between standard maps and map conditions, and between solo and party play. Do not abandon an active raid just to collect a comparison.",
          "Open the official support and update links below. If they announce a relevant outage or maintenance, follow that recovery guidance first."
        ],
        "note": "The checked date on this article is not a live server-status report or a guarantee that the service is currently available."
      },
      {
        "id": "sync-clock",
        "title": "Synchronize the Windows clock and restart the PC",
        "summary": "Embark recommends this for matchmaking and map-condition access problems.",
        "time": "About 3–5 minutes",
        "risk": "low",
        "actions": [
          "Close the game and save any open work.",
          "Open Windows Settings → Time & language → Date & time, and enable Set time automatically.",
          "Select Sync now. Its position and wording may vary with your Windows version.",
          "Once synchronization finishes, restart the PC, reopen ARC Raiders and check whether the same symptom remains."
        ],
        "note": "If a managed PC prevents this change, ask its administrator rather than trying to remove the restriction."
      },
      {
        "id": "crossplay",
        "title": "Check every party member’s crossplay setting",
        "summary": "Your own setting can be on while another player’s restriction still limits the party.",
        "time": "About 2 minutes",
        "risk": "low",
        "actions": [
          "Ask whether any party member has crossplay disabled.",
          "Only if the members are comfortable playing across platforms, have them enable crossplay in their own settings and compare the result.",
          "Respect a preference to keep crossplay off and continue with the region check. Turning it on does not guarantee an immediate match."
        ],
        "note": "The exact path to the crossplay toggle has not been verified here; do not rely on an invented menu location."
      },
      {
        "id": "server-region",
        "title": "Compare with the server region set to Automatic",
        "summary": "The official PC instructions specify Gameplay → Server → Automatic.",
        "time": "About 1 minute",
        "risk": "low",
        "actions": [
          "Open settings with the gear icon at the bottom right of the game screen.",
          "Open Gameplay → Server, note the previous value and choose Automatic.",
          "Without changing other settings at the same time, check whether matchmaking behaves differently."
        ]
      },
      {
        "id": "support-record",
        "title": "Prepare a useful report if the problem remains",
        "summary": "Explain how far you can get instead of piling on changes that have not helped.",
        "time": "About 3 minutes",
        "risk": "low",
        "actions": [
          "Record the date, time and time zone, your PC storefront and the error text.",
          "Write one line each for clock synchronization, crossplay settings and the result with Automatic selected.",
          "Open Embark’s official support link below to check contact options. Hide personal information or unrelated conversations in any screenshots."
        ],
        "note": "Queue length alone does not establish a faulty connection or an account restriction."
      }
    ],
    "avoid": [
      "Do not factory-reset the router or disable the whole firewall to speed up matchmaking.",
      "Do not leave an active raid merely to collect comparison data.",
      "Do not apply error-code fixes from another game to ARC Raiders."
    ],
    "cautions": [
      "These settings instructions are for PC. For console menu paths, use the corresponding section of the official support article.",
      "The October 8, 2026 update changed the map-selection screen. Check the meaning of the setting rather than relying solely on an older screenshot."
    ],
    "faqs": [
      {
        "question": "Why is matchmaking slow in a party when my crossplay is on?",
        "answer": "Embark says the most restrictive crossplay setting in the party applies. Check the other members’ settings too. That does not prove crossplay caused this particular delay; compare the result after any agreed change."
      },
      {
        "question": "The Solo vs. Squads option is missing. Is my configuration broken?",
        "answer": "The official 2.0 notes dated October 8, 2026 say Solo vs. Squads was removed from matchmaking options. Do not delete configuration files just because that option is absent. Check official updates for future changes."
      }
    ],
    "sources": [
      {
        "label": "Embark: matchmaking troubleshooting for PC and console",
        "url": "https://id.embark.games/arc-raiders/support/faq/148-matchmaking-troubleshooting---pc-console"
      },
      {
        "label": "Embark: syncing your device clock",
        "url": "https://id.embark.games/arc-raiders/support/faq/223-syncing-your-device-clock"
      },
      {
        "label": "Embark: Frozen Trail 2.0 fixes and known issues, October 8, 2026",
        "url": "https://arcraiders.com/news/frozen-trail-2-0-update"
      },
      {
        "label": "Embark: ARC Raiders support",
        "url": "https://id.embark.games/arc-raiders/support"
      }
    ],
    "related": [
      {
        "href": "/en/games/arc-raiders/voice-chat",
        "label": "ARC Raiders voice chat and microphone checks on PC"
      }
    ]
  },
  {
    "locale": "en",
    "gameSlug": "arc-raiders",
    "gameName": "ARC Raiders",
    "slug": "voice-chat",
    "checkedAt": "2026-10-08",
    "sourcePolicy": "Based on Embark’s official support and patch notes, checked on October 8, 2026. The symptom comparisons and order of checks are editorial guidance, not hands-on proof or a measured success rate. English UI labels are retained from the official instructions.",
    "title": "ARC Raiders Voice Chat Not Working on PC: Party, Proximity and Microphone Checks",
    "shortTitle": "Voice chat not working",
    "description": "Check ARC Raiders voice chat on PC: party and proximity settings, microphone selection, push-to-talk, Windows permissions and competing audio apps. Avoid unnecessary network changes.",
    "lead": "For PC players who hear game audio but cannot transmit their voice, have working party chat but no proximity chat, or can use the microphone in another app.",
    "summary": "Start with voice-chat enablement, the separate party and proximity transmission modes, and the selected input microphone. Then check Windows microphone permission and apps using the microphone at the same time. If you compare with an open microphone, remember that nearby conversations may be transmitted. Keep previous values so you can return to your preferred settings.",
    "quickFacts": [
      {
        "label": "Proximity voice chat",
        "value": "Can reach raiders outside your squad; check it separately from party chat"
      },
      {
        "label": "Input microphone",
        "value": "Settings → Audio → Voice Chat Input Device"
      },
      {
        "label": "Compare transmission modes",
        "value": "Push-to-Talk and Open Microphone; return to your preferred mode afterward"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Only proximity chat fails",
        "cause": "Check the Proximity Voice Chat settings",
        "stepId": "voice-mode"
      },
      {
        "symptom": "Several microphones are connected",
        "cause": "The game may have selected a different input",
        "stepId": "input-device"
      },
      {
        "symptom": "Neither chat type works",
        "cause": "Also check microphone permission and competing apps",
        "stepId": "microphone-permission"
      }
    ],
    "steps": [
      {
        "id": "voice-mode",
        "title": "Check enablement and transmission mode for each chat type",
        "summary": "Changing party-chat settings alone does not isolate a proximity-only problem.",
        "time": "About 2 minutes",
        "risk": "low",
        "actions": [
          "Open the voice-chat settings under Settings → Audio and check that Enable Voice Chat is enabled.",
          "Check Party Voice Chat and Proximity Voice Chat separately, noting their current transmission modes.",
          "For Push-to-Talk, check your current key binding rather than assuming a default key. If needed, compare with Open Microphone somewhere no private conversation can be overheard.",
          "After comparing, restore the transmission mode you want to use."
        ],
        "note": "Proximity chat can transmit to raiders outside your squad. Never read out personal information or authentication codes as a microphone test."
      },
      {
        "id": "input-device",
        "title": "Explicitly select the microphone the game should use",
        "summary": "A webcam or another input may have been selected instead of your headset.",
        "time": "About 1 minute",
        "risk": "low",
        "actions": [
          "Open Settings → Audio → Voice Chat Input Device.",
          "Choose the microphone you intend to use and compare without changing the transmission mode at the same time.",
          "If the device is missing from the list, check whether Windows recognizes it before continuing."
        ]
      },
      {
        "id": "microphone-permission",
        "title": "Check Windows microphone access for desktop apps",
        "summary": "An operating-system permission block cannot be solved by game settings alone.",
        "time": "About 2 minutes",
        "risk": "medium",
        "actions": [
          "Search Windows Settings for microphone and open the microphone privacy settings.",
          "If you want ARC Raiders to transmit audio, check whether desktop apps are allowed to access the microphone.",
          "Before changing permission, read its scope. This may be a desktop-app setting rather than an ARC Raiders-only toggle.",
          "Restart the game and compare. If your workplace or school manages the PC and prevents changes, ask the administrator."
        ],
        "note": "Screen names vary by Windows version. If you do not want to broaden microphone access, skip this change and include that fact in your support report."
      },
      {
        "id": "close-other-apps",
        "title": "Compare with other microphone-using apps closed",
        "summary": "Check for an interaction without uninstalling the other apps.",
        "time": "About 2–3 minutes",
        "risk": "low",
        "actions": [
          "First make sure any call or recording can be ended. Close unneeded audio apps such as Discord or recording software using their normal exit controls.",
          "Restart ARC Raiders and compare with the same microphone and transmission mode.",
          "If this helps, reopen the apps one at a time and note which combination brings the problem back."
        ],
        "note": "You do not need to forcibly end a meeting or recording, or terminate Windows system processes."
      },
      {
        "id": "support-record",
        "title": "Collect the remaining details for official support",
        "summary": "Report what you established about input, transmission mode and connection.",
        "time": "About 3 minutes",
        "risk": "low",
        "actions": [
          "Record your microphone model, Windows version and whether party chat, proximity chat or both fail.",
          "Distinguish hearing other players from transmitting your own voice, and note whether microphone input also fails in other apps.",
          "Include the results of microphone selection, permission checks and closing other apps, then consult the official support link below.",
          "If connecting to the game or deploying also fails, use the related matchmaking guide to separate those symptoms."
        ],
        "note": "Official support includes further network checks. Do not change a shared network on your own; establish what is needed with its administrator or support."
      }
    ],
    "avoid": [
      "Do not leave proximity chat on an open microphone while discussing private information or reading authentication codes.",
      "Do not disable the entire firewall or install an audio driver from an unknown source to fix voice chat.",
      "Do not start by changing IPv6, DNS and router settings together."
    ],
    "cautions": [
      "These are PC input and transmission checks. Do not apply Windows instructions to a console.",
      "The official 2.0 notes mention fixes for some voice-chat failures, particularly on PS5 and Xbox. This does not establish that every PC problem was fixed or shares the same cause."
    ],
    "faqs": [
      {
        "question": "My microphone works in Discord, but nobody hears me in ARC Raiders. Why?",
        "answer": "The game may use a different input device or transmission mode even when the microphone itself works. Check Voice Chat Input Device and both Party and Proximity settings. If needed, compare with Discord closed."
      },
      {
        "question": "My push-to-talk binding resets after raids. What should I do?",
        "answer": "The October 8, 2026 2.0 known-issues list reports key bindings resetting after raids with non-English keyboard layouts. We have not verified an official reliable workaround. Check your current binding and follow official fixes rather than editing configuration files based on a guess."
      }
    ],
    "sources": [
      {
        "label": "Embark: PC voice-chat troubleshooting",
        "url": "https://id.embark.games/arc-raiders/support/faq/156-troubleshooting-voice-chat---pc"
      },
      {
        "label": "Embark: in-game communication",
        "url": "https://id.embark.games/arc-raiders/support/faq/159-in-game-communication"
      },
      {
        "label": "Microsoft: Windows microphone access and privacy",
        "url": "https://support.microsoft.com/en-us/windows/privacy/windows-camera-microphone-and-privacy"
      },
      {
        "label": "Embark: Frozen Trail 2.0 fixes and known issues, October 8, 2026",
        "url": "https://arcraiders.com/news/frozen-trail-2-0-update"
      },
      {
        "label": "Embark: ARC Raiders support",
        "url": "https://id.embark.games/arc-raiders/support"
      }
    ],
    "related": [
      {
        "href": "/en/games/arc-raiders/matchmaking",
        "label": "ARC Raiders matchmaking checks on PC"
      }
    ]
  },
  {
    "locale": "zh",
    "gameSlug": "arc-raiders",
    "gameName": "ARC Raiders",
    "slug": "matchmaking",
    "title": "ARC Raiders 匹配不到人怎么办？时钟、跨平台联机与服务器区域排查【PC】",
    "shortTitle": "无法匹配",
    "description": "ARC Raiders PC 版无法匹配、无法进入带地图条件的对局时，依据官方说明，逐项检查时钟同步、队伍成员的跨平台联机设置及服务器区域 Automatic。",
    "lead": "适用于能进入大厅却一直无法开始出击、和好友组队后等待时间变长，或能进入普通地图却无法进入带地图条件的对局的 PC 玩家。",
    "summary": "先记录普通地图与条件地图、单人与组队时的症状是否不同，再依次检查时钟同步、全队的跨平台联机设置，以及服务器区域 Automatic。保留每次改动及结果。若登录本身失败，或官方已公告相关故障，请优先遵循对应的官方说明，不要反复更改同一设置。",
    "sourcePolicy": "依据官方支持文档及 2026 年 10 月 8 日更新说明整理，适用于 PC 版。文中的英文菜单名称为官方提供的英文名称；未核实对应的中文游戏界面名称。",
    "quickFacts": [
      {
        "label": "只有条件地图进不去",
        "value": "检查设备时钟是否已同步"
      },
      {
        "label": "仅与好友组队时等待较久",
        "value": "队伍采用成员中限制最严格的跨平台联机设置"
      },
      {
        "label": "服务器区域",
        "value": "Gameplay → Server → Automatic（官方英文名称）"
      }
    ],
    "diagnosis": [
      {
        "symptom": "能进入普通地图，但进不了条件地图",
        "cause": "设备时钟不准确可能是原因之一",
        "stepId": "sync-clock"
      },
      {
        "symptom": "组队时等待时间变长",
        "cause": "队员的跨平台联机设置可能有影响",
        "stepId": "crossplay"
      },
      {
        "symptom": "手动指定了服务器区域",
        "cause": "与官方推荐的 Automatic 设置进行对比",
        "stepId": "server-region"
      }
    ],
    "steps": [
      {
        "id": "record-symptom",
        "title": "确认无法出击的范围，并查看官方公告",
        "summary": "同样是“进不去”，也要区分登录失败和停留在匹配队列的情况。",
        "time": "约 2 分钟",
        "risk": "low",
        "actions": [
          "记录能否打开大厅、是否在开始匹配后卡住，以及完整的错误提示。",
          "根据已经尝试过的情况，记录普通地图／条件地图、单人／组队之间的差异。不要为了比较而退出正在进行的突袭。",
          "打开文末的官方支持与更新说明。如果已有相关故障或维护公告，请优先遵循官方的恢复说明。"
        ],
        "note": "本文的核实日期不代表“服务器目前正常”。本文不保证服务器的实时运行状态。"
      },
      {
        "id": "sync-clock",
        "title": "同步 Windows 时钟并重启电脑",
        "summary": "对于无法进入条件地图的情况，官方也建议进行这项检查。",
        "time": "约 3–5 分钟",
        "risk": "low",
        "actions": [
          "退出游戏，并保存正在编辑的文件。",
          "打开 Windows“设置”→“时间和语言”→“日期和时间”，开启“自动设置时间”。",
          "执行“立即同步”。不同 Windows 版本的名称和位置可能有所不同。",
          "同步完成后重启电脑，再启动 ARC Raiders，检查同样的问题是否仍然存在。"
        ],
        "note": "如果受管理的电脑不允许修改，请联系管理员，不要强行解除限制。"
      },
      {
        "id": "crossplay",
        "title": "检查所有队员的跨平台联机设置",
        "summary": "即使你已开启跨平台联机，只要有队友关闭，队伍的匹配范围仍会受到限制。",
        "time": "约 2 分钟",
        "risk": "low",
        "actions": [
          "向队友确认是否有人关闭了跨平台联机。",
          "只有在队员愿意与其他平台的玩家对战时，才请各自在自己的设置中开启跨平台联机，然后比较结果。",
          "如果有人希望保持关闭，请尊重其选择，继续检查服务器区域。开启跨平台联机并不保证立即匹配成功。"
        ],
        "note": "跨平台联机选项的中文菜单路径尚未核实，因此这里不提供确定的中文菜单名称。"
      },
      {
        "id": "server-region",
        "title": "将服务器区域设为 Automatic 进行对比",
        "summary": "官方 PC 版说明给出的路径是 Gameplay → Server → Automatic。",
        "time": "约 1 分钟",
        "risk": "low",
        "actions": [
          "点击游戏画面右下角的齿轮，打开设置。",
          "打开 Gameplay → Server，记录原来的值，再选择 Automatic。这些是官方英文名称。",
          "不要同时修改其他条件，观察等待出击的情况是否改变。"
        ]
      },
      {
        "id": "support-record",
        "title": "仍未解决时，整理结果并联系官方支持",
        "summary": "与其继续增加无效改动，不如清楚说明问题出现在哪一步。",
        "time": "约 3 分钟",
        "risk": "low",
        "actions": [
          "整理问题发生的日期、时间与时区、PC 版所用的商店平台，以及错误提示。",
          "分别用一行记录时钟同步是否成功、跨平台联机状态，以及使用 Automatic 后的结果。",
          "通过文末的 Embark 官方支持页面查看联系方法。截图中如有个人信息或其他聊天内容，请先遮挡。"
        ],
        "note": "仅凭等待时间，无法断定网络线路故障或账号受到限制。"
      }
    ],
    "avoid": [
      "不要为了加快出击而将路由器恢复出厂设置，或全面关闭防火墙。",
      "不要退出正在进行的突袭来收集对比记录。",
      "不要把其他游戏的错误代码解决方法直接套用到 ARC Raiders。"
    ],
    "cautions": [
      "本文提供 PC 版设置步骤。主机版菜单请查阅官方支持中对应平台的说明。",
      "2026 年 10 月 8 日的 2.0 更新修改了地图选择界面。不要仅凭旧界面的选项位置操作，请确认选项含义。"
    ],
    "faqs": [
      {
        "question": "我已开启跨平台联机，为什么组队后还是匹配很慢？",
        "answer": "根据官方说明，队伍会采用成员中限制最严格的跨平台联机设置。请同时检查其他队员的设置。这并不代表已确定设置就是原因，因此修改后仍需比较结果。"
      },
      {
        "question": "找不到单人对抗小队选项，是设置坏了吗？",
        "answer": "2026 年 10 月 8 日的 2.0 官方补丁说明称，已从匹配选项中移除“Solo vs. Squads”。无需仅因找不到该选项而删除配置文件。后续变化请查看官方更新说明。"
      }
    ],
    "sources": [
      {
        "label": "Embark 官方：匹配问题排查",
        "url": "https://id.embark.games/arc-raiders/support/faq/148-matchmaking-troubleshooting---pc-console"
      },
      {
        "label": "Embark 官方：同步设备时钟",
        "url": "https://id.embark.games/arc-raiders/support/faq/223-syncing-your-device-clock"
      },
      {
        "label": "Embark 官方：Frozen Trail 2.0 更新与已知问题（2026 年 10 月 8 日）",
        "url": "https://arcraiders.com/news/frozen-trail-2-0-update"
      },
      {
        "label": "Embark 官方：ARC Raiders 支持中心",
        "url": "https://id.embark.games/arc-raiders/support"
      }
    ],
    "related": [
      {
        "href": "/zh/games/arc-raiders/voice-chat",
        "label": "ARC Raiders 语音聊天与麦克风问题排查"
      }
    ],
    "checkedAt": "2026-10-08"
  },
  {
    "locale": "zh",
    "gameSlug": "arc-raiders",
    "gameName": "ARC Raiders",
    "slug": "voice-chat",
    "title": "ARC Raiders 语音聊天无法使用、别人听不到声音怎么办？【PC・近距离语音】",
    "shortTitle": "语音聊天或麦克风无法使用",
    "description": "ARC Raiders PC 版语音聊天无法使用、别人听不到你的声音时，安全检查近距离／队伍语音、输入麦克风、按键说话、Windows 权限及同时使用麦克风的应用。",
    "lead": "适用于能听到游戏声音但别人听不到你说话、队伍语音正常但近距离语音不可用，或麦克风在其他应用中能正常工作的 PC 玩家。",
    "summary": "先检查游戏内语音聊天是否开启、队伍／近距离语音各自的发送方式，以及当前选中的输入麦克风。然后检查 Windows 麦克风权限及同时使用麦克风的应用。用开放麦克风进行对比时，要注意周围的谈话也可能被发送出去。",
    "sourcePolicy": "依据官方支持文档及 2026 年 10 月 8 日更新说明整理，适用于 PC 版。将语音发送问题与出击、连接问题分开检查，并记录修改前的值。文中的英文设置名称为官方英文名称；不将未经核实的中文界面名称或固定发言按键当作确定信息。",
    "quickFacts": [
      {
        "label": "近距离语音",
        "value": "可以与小队外的其他 Raider 交谈；需与队伍语音分开检查设置"
      },
      {
        "label": "输入麦克风",
        "value": "Settings → Audio → Voice Chat Input Device（官方英文名称）"
      },
      {
        "label": "对比发送方式",
        "value": "Push-to-Talk（按键说话）与 Open Microphone（开放麦克风）；对比后可改回原来的方式"
      }
    ],
    "diagnosis": [
      {
        "symptom": "只有近距离语音无法传出声音",
        "cause": "检查 Proximity Voice Chat 的设置",
        "stepId": "voice-mode"
      },
      {
        "symptom": "连接了多个麦克风",
        "cause": "游戏可能选中了其他输入设备",
        "stepId": "input-device"
      },
      {
        "symptom": "两种语音聊天都无法使用",
        "cause": "还需检查麦克风权限及同时使用它的应用",
        "stepId": "microphone-permission"
      }
    ],
    "steps": [
      {
        "id": "voice-mode",
        "title": "检查队伍语音与近距离语音是否开启及其发送方式",
        "summary": "如果只有近距离语音出问题，仅修改队伍语音设置无法有效排查。",
        "time": "约 2 分钟",
        "risk": "low",
        "actions": [
          "打开 Settings → Audio 中的语音聊天设置，确认 Enable Voice Chat 已开启。",
          "分别检查 Party Voice Chat 和 Proximity Voice Chat，并记录当前的发送方式。",
          "如果使用 Push-to-Talk，请查看当前按键绑定。如有需要，可在没有不便公开的谈话的环境中，切换到 Open Microphone 进行对比。",
          "对比结束后，改回平时希望使用的发送方式。"
        ],
        "note": "近距离语音会将声音传给小队外的其他 Raider。不要为了测试麦克风而读出个人信息。以上设置名称均为官方英文名称。"
      },
      {
        "id": "input-device",
        "title": "明确选择游戏使用的麦克风",
        "summary": "除耳机外，如果还有摄像头等设备的麦克风，请检查是否误选了其他设备。",
        "time": "约 1 分钟",
        "risk": "low",
        "actions": [
          "打开 Settings → Audio → Voice Chat Input Device。",
          "选择要使用的麦克风名称，保持发送方式不变，比较结果。",
          "如果列表中没有目标设备，先确认 Windows 是否能识别该设备，再继续排查。"
        ]
      },
      {
        "id": "microphone-permission",
        "title": "检查 Windows 是否允许桌面应用访问麦克风",
        "summary": "如果 Windows 拒绝麦克风访问，仅修改游戏设置无法解决问题。",
        "time": "约 2 分钟",
        "risk": "medium",
        "actions": [
          "在 Windows 设置中搜索“麦克风”，打开麦克风隐私设置。",
          "如果你愿意在 ARC Raiders 中发送语音，请检查是否已允许桌面应用访问麦克风。",
          "修改前先确认界面上显示的适用范围。这个开关不一定只单独授权 ARC Raiders。",
          "重启游戏并比较结果。如果是公司、学校等管理的电脑且无法修改，请联系管理员。"
        ],
        "note": "不同 Windows 版本的页面名称有所不同。如果不希望扩大权限，可以跳过此操作，并在联系支持时说明当前权限状态。"
      },
      {
        "id": "close-other-apps",
        "title": "关闭同时使用麦克风的应用进行对比",
        "summary": "无需卸载，就能检查其他语音应用是否产生影响。",
        "time": "约 2–3 分钟",
        "risk": "low",
        "actions": [
          "确认当前通话或录音可以结束后，用正常退出方式关闭 Discord、录屏软件等不再需要的音频应用。",
          "重启 ARC Raiders，保持输入设备和发送方式不变，比较结果。",
          "如果有所改善，逐个重新打开应用，记录哪种组合会让同样的问题再次出现。"
        ],
        "note": "无需强行结束会议或录音，也无需结束 Windows 系统进程。"
      },
      {
        "id": "support-record",
        "title": "仍未改善时，整理要提供给官方支持的信息",
        "summary": "记录麦克风输入、发送方式及连接情况分别检查到了哪一步。",
        "time": "约 3 分钟",
        "risk": "low",
        "actions": [
          "记录麦克风型号、Windows 版本，以及无法使用的是队伍语音还是近距离语音。",
          "区分能否听到对方的声音、是否只有自己的声音传不出去，以及其他应用是否也无法接收麦克风输入。",
          "整理输入设备、麦克风权限，以及关闭其他应用后的结果，再查看文末的官方支持页面。",
          "如果连接游戏或出击本身也失败，请通过相关文章中的匹配排查步骤，区分不同症状。"
        ],
        "note": "官方还提供了进一步的网络排查方法，但不要自行修改共用网络的设置。请先与管理员或支持人员确认是否有必要。"
      }
    ],
    "avoid": [
      "不要在近距离语音保持开放麦克风时进行私密谈话或读出验证码。",
      "不要为了修复语音聊天而全面关闭防火墙，或安装来源不明的音频驱动。",
      "不要一开始就同时修改 IPv6、DNS 和路由器设置。"
    ],
    "cautions": [
      "本文主要检查 PC 版的输入和语音发送。不要将 Windows 操作套用到主机版。",
      "2.0 官方补丁说明列出了一些语音聊天问题的修复，尤其涉及 PS5／Xbox。不能据此断定 PC 版所有相关症状都已解决，或属于同一个问题。"
    ],
    "faqs": [
      {
        "question": "Discord 可以说话，为什么只有 ARC Raiders 里别人听不到？",
        "answer": "即使麦克风本身正常，游戏也可能选中了不同的输入设备，或使用了不同的发送方式。请检查 Voice Chat Input Device，以及 Party／Proximity 各自的设置；必要时对比关闭 Discord 后的情况。"
      },
      {
        "question": "更新后，Push-to-Talk 的按键每次都会恢复默认值",
        "answer": "2026 年 10 月 8 日的 2.0 已知问题中，列出了非英语键盘布局在突袭结束后按键绑定恢复默认值的问题。目前未核实到官方提供的可靠规避方法。请检查当前绑定，并关注官方修复说明，不要自行修改配置文件。"
      }
    ],
    "sources": [
      {
        "label": "Embark 官方：PC 版语音聊天问题排查",
        "url": "https://id.embark.games/arc-raiders/support/faq/156-troubleshooting-voice-chat---pc"
      },
      {
        "label": "Embark 官方：游戏内交流",
        "url": "https://id.embark.games/arc-raiders/support/faq/159-in-game-communication"
      },
      {
        "label": "Microsoft：Windows 麦克风访问与隐私（英文）",
        "url": "https://support.microsoft.com/en-us/windows/privacy/windows-camera-microphone-and-privacy"
      },
      {
        "label": "Embark 官方：Frozen Trail 2.0 更新与已知问题（2026 年 10 月 8 日）",
        "url": "https://arcraiders.com/news/frozen-trail-2-0-update"
      },
      {
        "label": "Embark 官方：ARC Raiders 支持中心",
        "url": "https://id.embark.games/arc-raiders/support"
      }
    ],
    "related": [
      {
        "href": "/zh/games/arc-raiders/matchmaking",
        "label": "ARC Raiders 无法匹配问题排查"
      }
    ],
    "checkedAt": "2026-10-08"
  },
  {
    "locale": "es",
    "gameSlug": "arc-raiders",
    "gameName": "ARC Raiders",
    "slug": "matchmaking",
    "checkedAt": "2026-10-08",
    "title": "ARC Raiders no encuentra partida: reloj, juego cruzado y región del servidor en PC",
    "shortTitle": "No encuentra partida",
    "description": "Guía para PC cuando ARC Raiders no encuentra partida o no permite entrar en mapas con condiciones especiales. Revisa el reloj, el juego cruzado del grupo y la región automática siguiendo la información oficial.",
    "lead": "Si puedes entrar al lobby pero no iniciar una incursión, la espera aumenta al jugar con amigos o solo puedes acceder a mapas normales, esta guía te ayuda a distinguir los síntomas.",
    "summary": "Anota primero si el problema cambia entre mapas normales y mapas con condiciones especiales, o entre jugar en solitario y en grupo. Después comprueba la sincronización del reloj, el juego cruzado de todos los miembros y la selección automática de región. Registra cada cambio y su resultado.",
    "sourcePolicy": "Guía de PC basada en el soporte oficial y la actualización del 8 de octubre de 2026. Los nombres de menús en inglés son los publicados por Embark; no se ha verificado su traducción en la interfaz española. Si falla el inicio de sesión o hay un incidente anunciado, sigue la indicación oficial correspondiente en lugar de repetir cambios.",
    "quickFacts": [
      {
        "label": "Solo fallan los mapas con condiciones especiales",
        "value": "Comprueba la sincronización del reloj del dispositivo"
      },
      {
        "label": "La espera aumenta al jugar con amigos",
        "value": "Se aplica la configuración de juego cruzado más restrictiva del grupo"
      },
      {
        "label": "Región del servidor",
        "value": "Gameplay → Server → Automatic (nombres oficiales en inglés)"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Puedes entrar en mapas normales, pero no en los de condiciones especiales",
        "cause": "Un desfase en el reloj del dispositivo es una posible causa",
        "stepId": "sync-clock"
      },
      {
        "symptom": "La espera aumenta al jugar en grupo",
        "cause": "La configuración de juego cruzado de algún miembro puede influir",
        "stepId": "crossplay"
      },
      {
        "symptom": "Has seleccionado una región manualmente",
        "cause": "Compara el resultado con Automatic, la opción recomendada oficialmente",
        "stepId": "server-region"
      }
    ],
    "steps": [
      {
        "id": "record-symptom",
        "title": "Identifica dónde se detiene el acceso y consulta los avisos oficiales",
        "summary": "Distingue un fallo de inicio de sesión de una espera durante el emparejamiento.",
        "time": "Unos 2 minutos",
        "risk": "low",
        "actions": [
          "Anota si se abre el lobby, si el proceso se detiene después de iniciar el emparejamiento y el texto completo de cualquier error.",
          "A partir de lo que ya hayas probado, anota las diferencias entre mapas normales y mapas con condiciones especiales, y entre jugar en solitario y en grupo. No abandones una incursión en curso para hacer esta comparación.",
          "Consulta el soporte oficial y las notas de actualización enlazados al final. Si hay un incidente o mantenimiento que coincida con el problema, da prioridad a sus indicaciones de restablecimiento."
        ],
        "note": "La fecha de revisión de este artículo no significa que los servidores estén funcionando ahora. No garantiza su estado en tiempo real."
      },
      {
        "id": "sync-clock",
        "title": "Sincroniza el reloj de Windows y reinicia el PC",
        "summary": "Es una comprobación oficial que también se recomienda cuando no puedes entrar en mapas con condiciones especiales.",
        "time": "Unos 3–5 minutos",
        "risk": "low",
        "actions": [
          "Cierra el juego y guarda los archivos en los que estés trabajando.",
          "Abre la configuración de Windows, entra en las opciones de hora e idioma y después en fecha y hora. Activa el ajuste automático de la hora.",
          "Ejecuta la sincronización inmediata del reloj. El nombre y la ubicación de la opción pueden variar según la versión de Windows.",
          "Cuando termine la sincronización, reinicia el PC y comprueba si persiste el mismo problema en ARC Raiders."
        ],
        "note": "Si el PC está administrado y no permite el cambio, consulta al administrador sin intentar eliminar las restricciones."
      },
      {
        "id": "crossplay",
        "title": "Comprueba el juego cruzado de todos los miembros del grupo",
        "summary": "Aunque lo tengas activado, otro miembro que lo tenga desactivado puede limitar la búsqueda del grupo.",
        "time": "Unos 2 minutos",
        "risk": "low",
        "actions": [
          "Pregunta si algún miembro del grupo tiene el juego cruzado desactivado.",
          "Solo si todos aceptan jugar contra personas de otras plataformas, cada miembro puede activarlo en su propia configuración para comparar el resultado.",
          "Respeta a quienes prefieran mantenerlo desactivado y continúa con la región del servidor. Activarlo no garantiza encontrar partida inmediatamente."
        ],
        "note": "No se ha verificado la ruta de menús del juego cruzado en español, por lo que no se da por confirmada aquí."
      },
      {
        "id": "server-region",
        "title": "Compara la región del servidor con Automatic",
        "summary": "La ruta indicada oficialmente para PC es Gameplay → Server → Automatic.",
        "time": "Aproximadamente 1 minuto",
        "risk": "low",
        "actions": [
          "Abre la configuración con el icono de engranaje de la esquina inferior derecha del juego.",
          "Entra en Gameplay → Server, anota el valor actual y selecciona Automatic. Son los nombres oficiales en inglés.",
          "Comprueba si cambia la espera para iniciar una incursión sin modificar otras condiciones a la vez."
        ]
      },
      {
        "id": "support-record",
        "title": "Si continúa el problema, prepara los resultados para el soporte oficial",
        "summary": "Explica hasta dónde llega el proceso en lugar de acumular cambios que no han ayudado.",
        "time": "Unos 3 minutos",
        "risk": "low",
        "actions": [
          "Anota la fecha y hora del fallo, la zona horaria, la tienda que utilizas para jugar en PC y el texto del error.",
          "Resume en una línea cada comprobación: si se sincronizó el reloj, el estado del juego cruzado y el resultado con Automatic.",
          "Consulta cómo contactar con Embark en el soporte oficial enlazado al final. Oculta los datos personales y las conversaciones ajenas que aparezcan en las capturas."
        ],
        "note": "El tiempo de espera por sí solo no demuestra un fallo de conexión ni una restricción de la cuenta."
      }
    ],
    "avoid": [
      "No restablezcas el router ni desactives por completo el firewall para intentar encontrar partida más rápido.",
      "No abandones una incursión en curso para recopilar datos de comparación.",
      "No apliques a ARC Raiders soluciones para códigos de error de otros juegos."
    ],
    "cautions": [
      "Estos pasos de configuración son para PC. Para consolas, consulta la sección correspondiente del soporte oficial.",
      "La actualización 2.0 del 8 de octubre de 2026 cambió la pantalla de selección de mapas. Comprueba qué significa cada opción en lugar de guiarte solo por su posición en capturas antiguas."
    ],
    "faqs": [
      {
        "question": "¿Por qué tarda más en grupo si tengo activado el juego cruzado?",
        "answer": "Según la información oficial, se aplica la configuración de juego cruzado más restrictiva del grupo. Comprueba también la de los demás miembros. Esto no confirma que sea la causa: compara los resultados después de cualquier cambio."
      },
      {
        "question": "No aparece Solo vs. Squads. ¿Se ha dañado mi configuración?",
        "answer": "Las notas oficiales de la actualización 2.0 del 8 de octubre de 2026 indican que Solo vs. Squads se retiró de las opciones de emparejamiento. Su ausencia no es motivo para borrar archivos de configuración. Consulta las notas oficiales para conocer cambios posteriores."
      }
    ],
    "sources": [
      {
        "label": "Embark: solución de problemas de emparejamiento",
        "url": "https://id.embark.games/arc-raiders/support/faq/148-matchmaking-troubleshooting---pc-console"
      },
      {
        "label": "Embark: sincronizar el reloj del dispositivo",
        "url": "https://id.embark.games/arc-raiders/support/faq/223-syncing-your-device-clock"
      },
      {
        "label": "Embark: actualización Frozen Trail 2.0 y problemas conocidos (8 de octubre de 2026)",
        "url": "https://arcraiders.com/news/frozen-trail-2-0-update"
      },
      {
        "label": "Soporte oficial de Embark para ARC Raiders",
        "url": "https://id.embark.games/arc-raiders/support"
      }
    ],
    "related": [
      {
        "href": "/es/games/arc-raiders/voice-chat",
        "label": "Solucionar problemas del chat de voz y el micrófono"
      }
    ]
  },
  {
    "locale": "es",
    "gameSlug": "arc-raiders",
    "gameName": "ARC Raiders",
    "slug": "voice-chat",
    "checkedAt": "2026-10-08",
    "title": "El chat de voz de ARC Raiders no funciona: micrófono y chat de proximidad en PC",
    "shortTitle": "Chat de voz y micrófono",
    "description": "Comprobaciones para PC si no funciona el chat de voz de ARC Raiders: voz de grupo y proximidad, micrófono de entrada, Push-to-Talk, permisos de Windows y otras aplicaciones de audio.",
    "lead": "Guía para PC si oyes el juego pero los demás no te oyen, funciona el chat de grupo pero no el de proximidad, o el micrófono sí funciona en otras aplicaciones.",
    "summary": "Comprueba primero que el chat de voz esté activado, el modo de transmisión del grupo y de proximidad, y el micrófono seleccionado. Después revisa los permisos de Windows y las aplicaciones que usan el micrófono al mismo tiempo. Si pruebas el micrófono abierto, recuerda que puede transmitir conversaciones de tu entorno.",
    "sourcePolicy": "Guía de PC basada en el soporte oficial y la actualización del 8 de octubre de 2026. Distingue los problemas de transmisión de voz de los de conexión o acceso a incursiones y anota los valores antes de cambiarlos. Se conservan los nombres oficiales en inglés; no se han verificado las etiquetas de la interfaz española ni se presupone una tecla fija para hablar.",
    "quickFacts": [
      {
        "label": "Chat de proximidad",
        "value": "Permite hablar con raiders ajenos a tu escuadrón. Comprueba sus ajustes por separado del chat de grupo"
      },
      {
        "label": "Micrófono de entrada",
        "value": "Settings → Audio → Voice Chat Input Device"
      },
      {
        "label": "Comparar modos de transmisión",
        "value": "Push-to-Talk y Open Microphone. Puedes volver al modo anterior después de la prueba"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Solo falla el chat de proximidad",
        "cause": "Revisa la configuración de Proximity Voice Chat",
        "stepId": "voice-mode"
      },
      {
        "symptom": "Tienes varios micrófonos conectados",
        "cause": "Es posible que el juego haya seleccionado otro dispositivo de entrada",
        "stepId": "input-device"
      },
      {
        "symptom": "No funciona ninguno de los dos chats de voz",
        "cause": "Comprueba también los permisos del micrófono y las aplicaciones que lo usan a la vez",
        "stepId": "microphone-permission"
      }
    ],
    "steps": [
      {
        "id": "voice-mode",
        "title": "Revisa la activación y el modo de transmisión de ambos chats",
        "summary": "Si solo falla el chat de proximidad, cambiar únicamente el chat de grupo no ayuda a aislar el problema.",
        "time": "Unos 2 minutos",
        "risk": "low",
        "actions": [
          "Abre los ajustes de voz en Settings → Audio y comprueba que Enable Voice Chat esté activado.",
          "Revisa Party Voice Chat y Proximity Voice Chat por separado y anota el modo de transmisión de cada uno.",
          "Si usas Push-to-Talk, comprueba la tecla asignada actualmente. Si hace falta, compara con Open Microphone en un lugar donde no haya conversaciones que no quieras transmitir.",
          "Después de la prueba, vuelve al modo de transmisión que prefieras usar habitualmente."
        ],
        "note": "El chat de proximidad transmite tu voz también a raiders ajenos a tu escuadrón. No leas datos personales en voz alta para probar el micrófono."
      },
      {
        "id": "input-device",
        "title": "Selecciona expresamente el micrófono que debe usar el juego",
        "summary": "Si tienes otros micrófonos, como el de una cámara web, comprueba que no se haya seleccionado uno distinto al de tus auriculares.",
        "time": "Aproximadamente 1 minuto",
        "risk": "low",
        "actions": [
          "Abre Settings → Audio → Voice Chat Input Device.",
          "Selecciona el nombre del micrófono que quieras usar y compara el resultado sin cambiar el modo de transmisión.",
          "Si no aparece el dispositivo deseado, comprueba que Windows lo reconozca antes de continuar."
        ]
      },
      {
        "id": "microphone-permission",
        "title": "Comprueba el permiso de micrófono para aplicaciones de escritorio en Windows",
        "summary": "Si Windows bloquea el micrófono, cambiar solo los ajustes del juego no resolverá el problema.",
        "time": "Unos 2 minutos",
        "risk": "medium",
        "actions": [
          "Busca las opciones de micrófono en la configuración de Windows y abre sus ajustes de privacidad.",
          "Si aceptas transmitir tu voz en ARC Raiders, comprueba si las aplicaciones de escritorio tienen acceso al micrófono.",
          "Antes de modificar el permiso, revisa el alcance que muestra Windows. No necesariamente es un interruptor que autorice únicamente a ARC Raiders.",
          "Reinicia el juego y compara el resultado. Si el PC está administrado por una empresa o centro educativo y no puedes cambiarlo, consulta al administrador."
        ],
        "note": "Los nombres de las pantallas varían según la versión de Windows. Si no quieres ampliar los permisos, omite este paso e indica esa circunstancia al contactar con soporte."
      },
      {
        "id": "close-other-apps",
        "title": "Cierra otras aplicaciones que usen el micrófono y compara",
        "summary": "Comprueba la influencia de otras aplicaciones de voz sin desinstalarlas.",
        "time": "Unos 2–3 minutos",
        "risk": "low",
        "actions": [
          "Asegúrate de que puedes terminar las llamadas o grabaciones. Cierra de forma normal las aplicaciones de audio que no necesites, como Discord o un programa de grabación.",
          "Reinicia ARC Raiders y compara el resultado sin cambiar el dispositivo de entrada ni el modo de transmisión.",
          "Si mejora, vuelve a abrir las aplicaciones de una en una y anota qué combinación hace que reaparezca el problema."
        ],
        "note": "No hace falta forzar el cierre de reuniones o grabaciones ni finalizar procesos del sistema de Windows."
      },
      {
        "id": "support-record",
        "title": "Si no mejora, reúne la información para el soporte oficial",
        "summary": "Deja constancia de lo que has comprobado sobre el micrófono, el modo de transmisión y la conexión.",
        "time": "Unos 3 minutos",
        "risk": "low",
        "actions": [
          "Anota el modelo del micrófono, la versión de Windows y si falla el chat de grupo, el de proximidad o ambos.",
          "Distingue si oyes a los demás, si solo falta tu voz o si tampoco funciona la entrada del micrófono en otras aplicaciones.",
          "Reúne los resultados de las pruebas de dispositivo de entrada, permisos y cierre de otras aplicaciones, y consulta el soporte oficial enlazado al final.",
          "Si también falla la conexión al juego o el inicio de incursiones, utiliza la guía de emparejamiento relacionada para separar los síntomas."
        ],
        "note": "El soporte oficial incluye medidas de red adicionales, pero no modifiques por tu cuenta una conexión compartida. Consulta con el administrador o con soporte si son necesarias."
      }
    ],
    "avoid": [
      "No mantengas el chat de proximidad en Open Microphone mientras tienes conversaciones privadas o lees códigos de autenticación.",
      "No desactives por completo el firewall ni instales controladores de audio de procedencia desconocida para solucionar el chat de voz.",
      "No empieces cambiando IPv6, DNS y router al mismo tiempo."
    ],
    "cautions": [
      "La guía se centra en la entrada y transmisión de voz en PC. No apliques las instrucciones de Windows a consolas.",
      "Las notas oficiales de la versión 2.0 incluyen correcciones de algunos problemas del chat de voz, especialmente en PS5 y Xbox. Eso no permite concluir que todos los problemas de PC estén resueltos ni que tengan la misma causa."
    ],
    "faqs": [
      {
        "question": "Puedo hablar por Discord, pero en ARC Raiders no me oyen",
        "answer": "Aunque el micrófono funcione, el juego puede tener seleccionado otro dispositivo de entrada u otro modo de transmisión. Revisa Voice Chat Input Device y los ajustes de Party Voice Chat y Proximity Voice Chat por separado. Si hace falta, compara con Discord cerrado."
      },
      {
        "question": "Después de la actualización, la tecla de Push-to-Talk vuelve a su valor inicial",
        "answer": "Los problemas conocidos de la versión 2.0 del 8 de octubre de 2026 incluyen el restablecimiento de las asignaciones de teclas después de una incursión con distribuciones de teclado no inglesas. No se ha confirmado una solución provisional oficial fiable. Comprueba la asignación actual y consulta los avisos oficiales de corrección en lugar de modificar archivos de configuración por tu cuenta."
      }
    ],
    "sources": [
      {
        "label": "Embark: solución de problemas del chat de voz en PC",
        "url": "https://id.embark.games/arc-raiders/support/faq/156-troubleshooting-voice-chat---pc"
      },
      {
        "label": "Embark: comunicación dentro del juego",
        "url": "https://id.embark.games/arc-raiders/support/faq/159-in-game-communication"
      },
      {
        "label": "Microsoft: acceso al micrófono y privacidad de Windows (en inglés)",
        "url": "https://support.microsoft.com/en-us/windows/privacy/windows-camera-microphone-and-privacy"
      },
      {
        "label": "Embark: actualización Frozen Trail 2.0 y problemas conocidos (8 de octubre de 2026)",
        "url": "https://arcraiders.com/news/frozen-trail-2-0-update"
      },
      {
        "label": "Soporte oficial de Embark para ARC Raiders",
        "url": "https://id.embark.games/arc-raiders/support"
      }
    ],
    "related": [
      {
        "href": "/es/games/arc-raiders/matchmaking",
        "label": "Qué hacer si ARC Raiders no encuentra partida"
      }
    ]
  }
];
