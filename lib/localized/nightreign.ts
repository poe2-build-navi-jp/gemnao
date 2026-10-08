import type { LocalizedArticle } from '@/lib/localized/types';
import type { LocalizedHub } from '@/lib/localized/hubs';

export const nightreignLocalizedHub: LocalizedHub = {
  "focused": true,
  "names": {
    "en": "ELDEN RING NIGHTREIGN",
    "zh": "ELDEN RING NIGHTREIGN",
    "es": "ELDEN RING NIGHTREIGN"
  },
  "checkedAt": "2026-10-08",
  "title": {
    "en": "NIGHTREIGN: DLC and Deep of Night Troubleshooting",
    "zh": "NIGHTREIGN：DLC 与 Deep of Night 问题排查",
    "es": "NIGHTREIGN: problemas con el DLC y Profundidades de la Noche"
  },
  "lead": {
    "en": "Steam guides for an inactive DLC, unavailable Scholar or Undertaker, and missing Deep of Night access.",
    "zh": "Steam 版 DLC 未生效、Scholar／Undertaker 无法使用，以及 Deep of Night 无法进入时的检查指南。",
    "es": "Guías de Steam para un DLC inactivo, Scholar o Undertaker no disponibles y problemas de acceso a Profundidades de la Noche."
  },
  "intro": {
    "en": "Choose the symptom first. A missing title-screen DLC label calls for an activation check; locked characters call for a progression check. Deep of Night instead requires Night Aspect completion and an online connection. Steam and console patch numbers may differ.",
    "zh": "先选择症状。标题画面没有 DLC 标识时检查启用状态；角色无法选择时检查解锁进度。Deep of Night 则要求击败 Night Aspect 并在线连接。Steam 与主机的补丁版本号可能不同。",
    "es": "Elige primero el síntoma. Si falta el indicador del DLC en el título, revisa la activación; si faltan los personajes, comprueba el progreso. Profundidades de la Noche exige derrotar al Aspecto de la Noche y conectarse en línea. Las versiones de Steam y consola pueden diferir."
  },
  "sources": [
    {
      "label": {
        "en": "Official DLC activation and unlock guide (Japanese)",
        "zh": "官方：DLC 启用与解锁说明（日语）",
        "es": "Guía oficial de activación y desbloqueo del DLC (japonés)"
      },
      "url": "https://nightreign.eldenring.jp/article/251202_1.html"
    },
    {
      "label": {
        "en": "Official Deep of Night requirements (Japanese)",
        "zh": "官方：深夜模式开放条件（日语）",
        "es": "Requisitos oficiales de Profundidades de la Noche (japonés)"
      },
      "url": "https://nightreign.eldenring.jp/article/250828_1.html"
    },
    {
      "label": {
        "en": "Steam update, July 2, 2026 (Japanese)",
        "zh": "官方：2026年7月2日 Steam 版更新（日语）",
        "es": "Actualización de Steam del 2 de julio de 2026 (japonés)"
      },
      "url": "https://nightreign.eldenring.jp/article/260702_1.html"
    },
    {
      "label": {
        "en": "PS4/PS5 update, September 18, 2026 (Japanese)",
        "zh": "官方：2026年9月18日 PS4／PS5 版更新（日语）",
        "es": "Actualización de PS4/PS5 del 18 de septiembre de 2026 (japonés)"
      },
      "url": "https://nightreign.eldenring.jp/article/260918_1.html"
    },
    {
      "label": {
        "en": "Steam: game details, languages and requirements",
        "zh": "Steam：产品信息、语言与配置需求",
        "es": "Steam: producto, idiomas y requisitos"
      },
      "url": "https://store.steampowered.com/app/2622380/ELDEN_RING_NIGHTREIGN/"
    }
  ]
};

export const nightreignLocalizedArticles: LocalizedArticle[] = [
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "dlc-not-working",
    "title": "NIGHTREIGN DLC Not Working on Steam: Unlock Scholar and Undertaker",
    "shortTitle": "DLC or characters unavailable",
    "description": "Check The Forsaken Hollows ownership, Steam activation, completed downloads and the title-screen DLC label before checking Scholar and Undertaker unlock conditions.",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "Activation check",
        "value": "The Forsaken Hollows label on the title screen"
      },
      {
        "label": "Platform",
        "value": "Windows/Steam; console activation differs"
      },
      {
        "label": "Character unlock",
        "value": "Defeat Tricephalos, then follow the NPC conversations"
      },
      {
        "label": "Steam update reference",
        "value": "July 2, 2026: App 1.03.3 / Regulation 1.03.5"
      }
    ],
    "diagnosis": [
      {
        "symptom": "DLC missing from Steam properties",
        "cause": "Check the purchasing account and product",
        "stepId": "check-entitlement"
      },
      {
        "symptom": "No DLC label on the title screen",
        "cause": "Activation or download may be incomplete",
        "stepId": "enable-dlc"
      },
      {
        "symptom": "Label present, characters unavailable",
        "cause": "Check progress and NPC conversations",
        "stepId": "unlock-nightfarers"
      },
      {
        "symptom": "Characters available, new expedition missing",
        "cause": "The expedition has an additional requirement",
        "stepId": "unlock-target"
      }
    ],
    "steps": [
      {
        "id": "check-entitlement",
        "title": "Confirm ownership on the current Steam account",
        "summary": "Check the purchase before buying anything again.",
        "actions": [
          "In Steam Library, right-click ELDEN RING NIGHTREIGN, open Properties, then DLC.",
          "Look for The Forsaken Hollows. If absent, compare your purchase history or receipt with the product, store and account you are using.",
          "If it is still missing from the list, stop here and use Steam Support with your purchase record."
        ],
        "note": "Do not confuse the base game with a DLC-inclusive edition, or treat a console purchase as Steam ownership.",
        "time": "About 2 min",
        "risk": "low"
      },
      {
        "id": "enable-dlc",
        "title": "Enable the DLC and restart Steam",
        "summary": "Follow the official Steam activation instructions and wait for the downloads to finish.",
        "actions": [
          "Check The Forsaken Hollows in the DLC list.",
          "Restart the Steam client and wait for the required game and DLC downloads to complete.",
          "Launch the game and look above the version number at the bottom-right of the title screen for The Forsaken Hollows.",
          "If the label appears, continue to the unlock check. If a download fails or the label remains absent, record the error and continue to the final reporting step."
        ],
        "note": "The PC announcement checked lists App 1.03.3 / Regulation 1.03.5. The September 18 update to App 1.03.4 targets PS4/PS5; do not wait for that number on Steam.",
        "time": "About 3 min plus download time",
        "risk": "low"
      },
      {
        "id": "unlock-nightfarers",
        "title": "Check the conversations after defeating Tricephalos",
        "summary": "Do this after confirming the DLC label.",
        "actions": [
          "Check whether the save you are using has defeated Tricephalos.",
          "At Roundtable Hold, speak with the Iron Menial to hear the Small Jar Merchant’s message.",
          "Visit the Small Jar Merchant and follow the in-game guidance, then check whether Scholar and Undertaker are available.",
          "If the requirements and conversations are complete but nothing changes, keep your save and record the situation."
        ],
        "note": "Unlocking the characters and unlocking the new expedition are separate checks.",
        "time": "About 3 min to check; progression time varies",
        "risk": "low"
      },
      {
        "id": "unlock-target",
        "title": "Check the additional expedition requirement",
        "summary": "Available characters do not by themselves confirm expedition access.",
        "actions": [
          "Confirm that Scholar and Undertaker are unlocked and that at least two targets have been defeated.",
          "Visit the chapel beyond the Small Jar Merchant at Roundtable Hold and check access to the Balancers expedition.",
          "If DLC content is missing only within Deep of Night, use the related Deep of Night article to check matchmaking conditions."
        ],
        "note": "DLC content was added to Deep of Night on December 17, 2025. The launch guide’s reference to a future update is historical, not a current lack of support.",
        "time": "About 3 min to check; progression time varies",
        "risk": "low"
      },
      {
        "id": "record-result",
        "title": "Record exactly where access stops",
        "summary": "Distinguish ownership, installation and in-game progression.",
        "actions": [
          "Record the DLC list, title-screen label and App/Regulation versions.",
          "Note whether Tricephalos was defeated, which NPC conversations occurred and whether the characters can be selected.",
          "Use Steam Support for missing ownership. For progression that remains blocked despite meeting the requirements, follow the official game site’s support directions with the full error and occurrence time.",
          "If the base game cannot reach its title screen, use the general Steam launch guide instead of repeating DLC unlock steps."
        ],
        "note": "The January 15, 2026 update addressed reacquisition of certain lost outfits and unique relics. Do not equate those historical reports with a present character-unlock problem.",
        "time": "About 5 min",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Steam game launch troubleshooting (Japanese)",
          "description": "For failure to reach the title screen, not for changing DLC ownership or unlock conditions."
        }
      }
    ],
    "avoid": [
      "Do not buy the DLC again solely because its label is missing.",
      "Do not delete or edit saves or use unofficial DLC unlockers.",
      "Do not apply PS4/PS5 patch numbers or activation instructions to Steam."
    ],
    "cautions": [
      "Official sources checked on October 8, 2026; this is not a claim of hands-on reproduction or a guaranteed fix.",
      "When downloads fail, also check free space and the displayed error. Change one thing at a time and record the result."
    ],
    "faqs": [
      {
        "question": "Does the Deluxe Edition still need activation?",
        "answer": "The official launch guide includes Deluxe owners in its activation instructions. Verify ownership separately from the Steam DLC checkbox and title-screen label."
      },
      {
        "question": "Do unlocked characters guarantee access to the new target?",
        "answer": "No. The new expedition also requires defeating at least two targets and visiting the chapel. Character selection alone does not confirm that step."
      },
      {
        "question": "Are the lost-outfit and relic issues still unpatched?",
        "answer": "The January 15, 2026 notes describe reacquiring certain lost outfits and unique relics at Roundtable Hold. Apply the update and check the affected item; report different symptoms separately."
      }
    ],
    "sources": [
      {
        "label": "Official DLC activation and unlock guide (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "DLC added to Deep of Night, December 17, 2025 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "Fixes and adjustments, January 15, 2026 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "Steam update, July 2, 2026 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "PS4/PS5 update, September 18, 2026 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "Official news (Japanese)",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "Steam: game details, languages and requirements",
        "url": "https://store.steampowered.com/app/2622380/ELDEN_RING_NIGHTREIGN/"
      },
      {
        "label": "Bandai Namco: how to unlock the DLC content (English)",
        "url": "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-nightreign-how-unlock-the-dlc-content"
      }
    ],
    "locale": "en",
    "gameName": "ELDEN RING NIGHTREIGN",
    "lead": "For Windows/Steam players who bought the DLC but cannot select its characters or start its expeditions. Separate account ownership and installation from progress inside the game.",
    "summary": "Look for The Forsaken Hollows above the version number on the title screen. If absent, check Steam activation. If present, check the conversation after defeating Tricephalos: speak to the Iron Menial, then visit the Small Jar Merchant. Owning the DLC alone does not finish the character unlock.",
    "sourcePolicy": "Based on official announcements checked on October 8, 2026. The Japanese activation and patch notices govern the Steam workflow; old future-update wording is superseded by later patch notes. No hands-on test is claimed.",
    "related": [
      {
        "href": "/en/games/elden-ring-nightreign/deep-of-night-not-appearing",
        "label": "Deep of Night unavailable"
      }
    ]
  },
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "deep-of-night-not-appearing",
    "title": "NIGHTREIGN Deep of Night Missing: Unlock and Online Checks",
    "shortTitle": "Deep of Night unavailable",
    "description": "Check Night Aspect completion, online login and the Steam update when Deep of Night is unavailable. Distinguish mode access from missing DLC encounters.",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "Progress requirement",
        "value": "Defeat the Nightlord Night Aspect"
      },
      {
        "label": "Connection",
        "value": "Online only, including solo; supports 1–3 players"
      },
      {
        "label": "DLC distinction",
        "value": "Mode access and DLC encounter conditions differ"
      },
      {
        "label": "Checked",
        "value": "October 8, 2026"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Mode unavailable",
        "cause": "Progress requirement may be incomplete",
        "stepId": "check-clear"
      },
      {
        "symptom": "Cannot play solo",
        "cause": "Game may be offline",
        "stepId": "check-online"
      },
      {
        "symptom": "Login error or update required",
        "cause": "Check completed updates and connection errors",
        "stepId": "check-update"
      },
      {
        "symptom": "Only DLC encounters are missing",
        "cause": "DLC participation requirements or encounter selection",
        "stepId": "check-dlc-content"
      }
    ],
    "steps": [
      {
        "id": "check-clear",
        "title": "Confirm Night Aspect completion on the current save",
        "summary": "This differs from unlocking the DLC characters.",
        "actions": [
          "Check the progression of the save currently loaded.",
          "If Night Aspect is undefeated, continue the normal expeditions.",
          "If defeated, move on to the online-status check."
        ],
        "note": "Defeating Tricephalos alone is not the Deep of Night requirement. Do not start over or delete the save to troubleshoot this.",
        "time": "About 2 min to check; progression time varies",
        "risk": "low"
      },
      {
        "id": "check-online",
        "title": "Check online status from the title screen",
        "summary": "Solo and offline are different settings.",
        "actions": [
          "Return to the title screen and check whether the game is offline.",
          "If started offline, choose LOGIN from the title menu.",
          "After connecting, check Deep of Night again. If LOGIN fails, record the exact message before continuing."
        ],
        "note": "The official guide allows one, two or three players while online. Changing the party size to three is not an unlock requirement.",
        "time": "About 2 min",
        "risk": "low"
      },
      {
        "id": "check-update",
        "title": "Finish Steam updates and check official notices",
        "summary": "PC and console version numbers may differ.",
        "actions": [
          "Close the game and check Steam for pending downloads or updates.",
          "After they finish, restart the game and record the App and Regulation versions on the title screen.",
          "Check official news for updates targeting Steam and notices affecting connections.",
          "Try logging in after updating. If connected but the mode is absent, report that alongside the completion check."
        ],
        "note": "As checked on October 8, 2026, the latest listed Steam update is July 2: App 1.03.3 / Regulation 1.03.5. September 18’s App 1.03.4 is PS4/PS5 only.",
        "time": "About 3 min plus update time",
        "risk": "low"
      },
      {
        "id": "check-dlc-content",
        "title": "Separate missing DLC encounters from missing mode access",
        "summary": "If the mode works, its unlock requirements are already a different issue.",
        "actions": [
          "Confirm The Forsaken Hollows is activated. If its title-screen label is absent, use the related DLC activation article.",
          "In multiplayer, check whether the expedition matched only players with the DLC applied.",
          "Even with the requirements met, do not diagnose a bug from a single expedition without a particular boss or terrain event."
        ],
        "note": "DLC content was added on December 17, 2025, with encounter-rate adjustments announced on January 15, 2026. This does not promise a particular encounter every run.",
        "time": "About 2 min",
        "risk": "low"
      },
      {
        "id": "record-result",
        "title": "Report mode access, login failure and matchmaking separately",
        "summary": "Identify the screen where progress stops.",
        "actions": [
          "Record Night Aspect completion, online status and Steam version numbers.",
          "Separate an absent mode from a selectable mode with a connection error or a matchmaking wait.",
          "Use the official site’s support directions with the time, full error, recent updates and steps already tested.",
          "If the game cannot reach its title screen, use general launch troubleshooting. Do not delete saves or authentication-related files to enable the mode."
        ],
        "note": "If an official maintenance notice exists, check its dates and affected platforms. This article is not a live outage report.",
        "time": "About 5 min",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Steam game launch troubleshooting (Japanese)",
          "description": "Use when the base game cannot open; mode unlock conditions are a separate issue."
        }
      }
    ],
    "avoid": [
      "Do not delete your save to reveal Deep of Night.",
      "Do not bypass anti-cheat for an online-only mode.",
      "Do not abandon an active expedition to test the menu; the official guide warns of multiplayer departure penalties."
    ],
    "cautions": [
      "Mode selection, login and matchmaking waits are different symptoms. Keep the exact screen and error.",
      "DLC ownership is separate from the mode’s progression and connection requirements."
    ],
    "faqs": [
      {
        "question": "Can I play Deep of Night offline if I go solo?",
        "answer": "No. A one-player expedition still needs online mode. Do not confuse it with ordinary solo play."
      },
      {
        "question": "Are team sessions or multiplayer passwords unsupported?",
        "answer": "The official guide permits both. A long matchmaking wait is different from a locked mode; record the displayed status and connection state."
      },
      {
        "question": "Must I buy the DLC to unlock Deep of Night?",
        "answer": "The official mode requirements are defeating Night Aspect and connecting online. The DLC-only matchmaking rule concerns DLC encounters inside the mode."
      }
    ],
    "sources": [
      {
        "label": "Official Deep of Night requirements (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/250828_1.html"
      },
      {
        "label": "Official DLC activation and unlock guide (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "DLC added to Deep of Night, December 17, 2025 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "Fixes and adjustments, January 15, 2026 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "Steam update, July 2, 2026 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "PS4/PS5 update, September 18, 2026 (Japanese)",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "Official news (Japanese)",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "Bandai Namco: Deep of Night explained (Spanish)",
        "url": "https://es.bandainamcoent.eu/elden-ring/noticias/elden-ring-nightreign-explicacion-de-profundidades-de-la-noche"
      }
    ],
    "locale": "en",
    "gameName": "ELDEN RING NIGHTREIGN",
    "lead": "For players unable to access Deep of Night. A missing mode and not encountering DLC bosses or terrain during an expedition need different checks.",
    "summary": "Deep of Night requires defeating Night Aspect and connecting online. A solo expedition still requires online mode. If both conditions are met, check Steam updates and record login errors separately from the mode’s availability.",
    "sourcePolicy": "Based on official announcements checked on October 8, 2026. The Japanese activation and patch notices govern the Steam workflow; old future-update wording is superseded by later patch notes. No hands-on test is claimed.",
    "related": [
      {
        "href": "/en/games/elden-ring-nightreign/dlc-not-working",
        "label": "DLC or characters unavailable"
      }
    ]
  },
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "dlc-not-working",
    "title": "NIGHTREIGN DLC 未生效：检查 Scholar 与 Undertaker 的解锁条件（Steam）",
    "shortTitle": "DLC 或新增角色无法使用",
    "description": "Steam 版 The Forsaken Hollows 未生效时，先核对购买账号、DLC 勾选、下载与标题画面标识，再检查 Scholar 和 Undertaker 的游戏内解锁条件。",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "启用标识",
        "value": "标题画面显示 The Forsaken Hollows"
      },
      {
        "label": "适用平台",
        "value": "Windows／Steam；主机版操作不同"
      },
      {
        "label": "角色解锁入口",
        "value": "击败 Tricephalos 后推进圆桌厅堂的相关对话"
      },
      {
        "label": "Steam 更新参考",
        "value": "2026年7月2日：App 1.03.3／Regulation 1.03.5"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Steam DLC 列表中没有该内容",
        "cause": "需要核对购买账号与商品",
        "stepId": "check-entitlement"
      },
      {
        "symptom": "标题画面没有 DLC 名称",
        "cause": "可能尚未启用或下载完成",
        "stepId": "enable-dlc"
      },
      {
        "symptom": "有 DLC 标识，但角色不能选",
        "cause": "需要核对进度与 NPC 对话",
        "stepId": "unlock-nightfarers"
      },
      {
        "symptom": "角色可用，但新增目标没有出现",
        "cause": "新增出击还有其他条件",
        "stepId": "unlock-target"
      }
    ],
    "steps": [
      {
        "id": "check-entitlement",
        "title": "核对当前 Steam 账号是否拥有 DLC",
        "summary": "不要急着重复购买，先核对购买记录。",
        "actions": [
          "在 Steam 库中右键点击 ELDEN RING NIGHTREIGN，打开属性，再进入 DLC。",
          "查找 The Forsaken Hollows；若没有显示，对照购买记录或收据，核对商品、购买平台与当前账号。",
          "若列表仍没有该内容，暂不进行勾选操作，准备购买记录并通过 Steam 客服确认。"
        ],
        "note": "不要混淆本体与包含 DLC 的版本，也不要把主机平台的购买记录视为 Steam 所有权。",
        "time": "约2分钟",
        "risk": "low"
      },
      {
        "id": "enable-dlc",
        "title": "勾选 DLC，并重新启动 Steam",
        "summary": "按官方 Steam 启用流程操作，等待下载完成。",
        "actions": [
          "在 DLC 列表中勾选 The Forsaken Hollows。",
          "重新启动 Steam 客户端，等待本体与 DLC 所需下载完成。",
          "启动游戏，在标题画面右下角版本号的上方检查 The Forsaken Hollows 标识。",
          "出现标识后再检查角色解锁。若下载报错或完成后仍没有标识，记录错误与显示状态，转到最后的记录步骤。"
        ],
        "note": "本次核对的 PC 公告为 App 1.03.3／Regulation 1.03.5。9月18日的 App 1.03.4 只面向 PS4／PS5，不要等待 Steam 显示相同版本号。",
        "time": "检查约3分钟，下载时间另计",
        "risk": "low"
      },
      {
        "id": "unlock-nightfarers",
        "title": "核对击败 Tricephalos 后的对话流程",
        "summary": "先确认标题画面已有 DLC 标识。",
        "actions": [
          "核对当前存档是否已击败 Tricephalos。",
          "在圆桌厅堂与 Iron Menial 对话，听取 Small Jar Merchant 的口信。",
          "前往 Small Jar Merchant 处，按照游戏内提示继续，再检查能否选择 Scholar 与 Undertaker。",
          "若已满足条件并完成相关对话仍无变化，保留存档并记录现象。"
        ],
        "note": "角色解锁与新增目标解锁需要分开核对。",
        "time": "检查约3分钟，攻略时间另计",
        "risk": "low"
      },
      {
        "id": "unlock-target",
        "title": "核对新增目标的额外条件",
        "summary": "能选择新增角色，并不代表新增出击条件已全部完成。",
        "actions": [
          "确认已解锁 Scholar 与 Undertaker，并击败至少两个目标。",
          "前往圆桌厅堂 Small Jar Merchant 后方的礼拜堂，检查是否能出击挑战 Balancers。",
          "若仅在 Deep of Night 中看不到 DLC 内容，阅读相关文章并检查匹配条件。"
        ],
        "note": "DLC 内容已于2025年12月17日加入 Deep of Night。发售说明中的后续更新计划不能作为当前尚未实装的依据。",
        "time": "检查约3分钟，攻略时间另计",
        "risk": "low"
      },
      {
        "id": "record-result",
        "title": "记录问题停在哪一个环节",
        "summary": "把所有权、安装状态与游戏进度分开说明。",
        "actions": [
          "记录 DLC 列表、标题画面标识、App 与 Regulation 版本号。",
          "整理 Tricephalos 的击败状态、两个 NPC 的对话进度，以及新增角色能否选择。",
          "购买资格无法确认时联系 Steam 客服；符合游戏条件仍无法推进时，按游戏官网的支持指引反馈完整错误、发生时间与检查结果。",
          "如果本体连标题画面都无法打开，使用通用 Steam 启动排查指南，不要反复尝试角色解锁流程。"
        ],
        "note": "2026年1月15日的更新处理了部分丢失服装与独有遗物的重新获取问题。不要把旧的物品丢失报告直接当成当前角色未解锁的原因。",
        "time": "约5分钟",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Steam 游戏无法启动排查指南（日语）",
          "description": "适用于无法进入标题画面的情况，不用于修改 DLC 所有权或解锁条件。"
        }
      }
    ],
    "avoid": [
      "不要仅因为没有 DLC 标识就重复购买。",
      "不要删除或修改存档，也不要使用非官方 DLC 解锁工具。",
      "不要把 PS4／PS5 的补丁版本号和操作套用到 Steam。"
    ],
    "cautions": [
      "官方资料核对日期为2026年10月8日；本文不声称经过实机复现，也不保证一定解决。",
      "下载失败时核对剩余空间与错误信息。每次只改变一项，并记录结果。"
    ],
    "faqs": [
      {
        "question": "豪华版也要检查 DLC 启用状态吗？",
        "answer": "官方开始指南也将豪华版等购买者列入启用说明。请分别核对已购资格、Steam 中的 DLC 勾选状态和标题画面的标识。"
      },
      {
        "question": "角色解锁后，新增目标一定已经开放吗？",
        "answer": "还需核对至少击败两个目标并前往礼拜堂的条件。能选择角色不等于新增出击流程已经完成。"
      },
      {
        "question": "服装与遗物消失的问题仍未修复吗？",
        "answer": "2026年1月15日的公告已说明部分丢失服装与独有遗物可在圆桌厅堂重新获取。应用更新后核对具体物品；不同现象应分开反馈。"
      }
    ],
    "sources": [
      {
        "label": "官方：DLC 启用与解锁说明（日语）",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "官方：2025年12月17日加入 DLC 内容（日语）",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "官方：2026年1月15日修复与调整（日语）",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "官方：2026年7月2日 Steam 版更新（日语）",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "官方：2026年9月18日 PS4／PS5 版更新（日语）",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "官方公告列表（日语）",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "Steam：产品信息、语言与配置需求",
        "url": "https://store.steampowered.com/app/2622380/ELDEN_RING_NIGHTREIGN/"
      },
      {
        "label": "万代南梦宫官方：DLC 内容解锁方法（英语）",
        "url": "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-nightreign-how-unlock-the-dlc-content"
      }
    ],
    "locale": "zh",
    "gameName": "ELDEN RING NIGHTREIGN",
    "lead": "适用于已购买 DLC，却无法选择新增角色或挑战新增目标的 Windows／Steam 玩家。购买资格、安装完成和游戏进度是不同的检查项。下文保留部分角色与目标的英文名称，便于对照官方说明。",
    "summary": "先看标题画面右下角的版本号上方是否显示 The Forsaken Hollows。没有时先检查 Steam 启用状态；有显示时，再确认击败 Tricephalos 后，与 Iron Menial 和 Small Jar Merchant 的对话流程。购买 DLC 不代表角色已自动解锁。",
    "sourcePolicy": "依据2026年10月8日核对的官方公告。Steam 流程以日语启用说明和后续补丁公告为准；旧的未来更新描述已由后续补丁说明取代。本文不声称经过实机测试。",
    "related": [
      {
        "href": "/zh/games/elden-ring-nightreign/deep-of-night-not-appearing",
        "label": "Deep of Night 无法进入"
      }
    ]
  },
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "deep-of-night-not-appearing",
    "title": "NIGHTREIGN 深夜模式不显示：Deep of Night 解锁与联网检查",
    "shortTitle": "Deep of Night 无法进入",
    "description": "Deep of Night 不显示或无法游玩时，检查 Night Aspect 击败记录、在线登录与 Steam 更新，并区分模式未开放和 DLC 内容未出现。",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "进度条件",
        "value": "击败夜王 Night Aspect"
      },
      {
        "label": "连接要求",
        "value": "在线专用，支持1～3人，单人也需联网"
      },
      {
        "label": "DLC 条件",
        "value": "模式解锁与 DLC 内容出现是两项条件"
      },
      {
        "label": "核对日期",
        "value": "2026年10月8日"
      }
    ],
    "diagnosis": [
      {
        "symptom": "模式没有出现",
        "cause": "可能尚未满足击败条件",
        "stepId": "check-clear"
      },
      {
        "symptom": "单人也无法进入",
        "cause": "游戏可能处于离线状态",
        "stepId": "check-online"
      },
      {
        "symptom": "登录失败或提示更新",
        "cause": "需检查更新完成状态与连接错误",
        "stepId": "check-update"
      },
      {
        "symptom": "只有 DLC 内容没出现",
        "cause": "DLC 匹配条件或遭遇选择",
        "stepId": "check-dlc-content"
      }
    ],
    "steps": [
      {
        "id": "check-clear",
        "title": "确认当前存档已经击败 Night Aspect",
        "summary": "这与新增 DLC 角色的解锁条件不同。",
        "actions": [
          "检查当前载入存档的进度。",
          "如果尚未击败 Night Aspect，先推进普通出击。",
          "如果已击败，继续检查在线状态。"
        ],
        "note": "只击败 Tricephalos 不满足此模式的条件。不需要为了排查而重新建档或删除存档。",
        "time": "检查约2分钟，攻略时间另计",
        "risk": "low"
      },
      {
        "id": "check-online",
        "title": "从标题画面核对在线状态",
        "summary": "单人出击不等于离线游玩。",
        "actions": [
          "返回标题画面，确认是否处于离线状态。",
          "若以离线模式启动，在标题菜单选择 LOGIN。",
          "连接后再次检查 Deep of Night；若登录失败，先保存完整错误信息，再继续下一步。"
        ],
        "note": "官方说明支持在线状态下1～3人出击。把人数改为3人不是解锁条件。",
        "time": "约2分钟",
        "risk": "low"
      },
      {
        "id": "check-update",
        "title": "完成 Steam 更新并查看官方公告",
        "summary": "PC 与主机平台的版本号可能不同。",
        "actions": [
          "关闭游戏，在 Steam 中检查尚未完成的下载或更新。",
          "完成后重新启动游戏，记录标题画面的 App 与 Regulation 版本号。",
          "在官方公告中查看面向 Steam 的更新，以及影响连接的通知。",
          "更新后重新登录。若已联网但模式仍没有出现，将这一结果与击败条件一起记录。"
        ],
        "note": "截至2026年10月8日核对，最新 Steam 更新公告为7月2日：App 1.03.3／Regulation 1.03.5。9月18日的 App 1.03.4 仅适用于 PS4／PS5。",
        "time": "检查约3分钟，更新时间另计",
        "risk": "low"
      },
      {
        "id": "check-dlc-content",
        "title": "区分模式可用但 DLC 内容未出现的情况",
        "summary": "如果可以进入模式，就不要把该现象当成模式未解锁。",
        "actions": [
          "确认 The Forsaken Hollows 已启用；标题画面无标识时，先阅读关联的 DLC 启用指南。",
          "多人出击时，核对是否仅与已应用 DLC 的玩家匹配。",
          "即使条件满足，单次出击没有遇到某个敌人或地形，也不足以判断发生了故障。"
        ],
        "note": "DLC 内容已在2025年12月17日加入该模式，2026年1月15日还调整了出现率。这不代表每次出击都会出现指定内容。",
        "time": "约2分钟",
        "risk": "low"
      },
      {
        "id": "record-result",
        "title": "分别记录模式未开放、登录失败与匹配等待",
        "summary": "说明具体停在哪个画面。",
        "actions": [
          "记录 Night Aspect 击败情况、在线状态与 Steam 版本号。",
          "区分模式不存在、可以选择但连接报错、以及正在等待匹配。",
          "按官网支持指引，提交发生时间、完整错误、近期更新和已尝试步骤。",
          "若连标题画面都无法打开，使用通用启动排查指南。不要为开放模式而删除存档或认证相关文件。"
        ],
        "note": "如有官方维护公告，请核对时间与适用平台。本文不代表当前正发生服务器故障。",
        "time": "约5分钟",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Steam 游戏无法启动排查指南（日语）",
          "description": "本体无法打开时使用；与模式的解锁条件分开检查。"
        }
      }
    ],
    "avoid": [
      "不要为显示模式而删除存档。",
      "不要绕过反作弊来进入在线专用模式。",
      "不要在出击中途退出以测试菜单；官方已提示多人出击离开时会有处罚。"
    ],
    "cautions": [
      "模式选择、登录与匹配等待是不同现象，请保留具体画面和错误信息。",
      "拥有 DLC 与满足该模式的进度、连接条件是不同的事情。"
    ],
    "faqs": [
      {
        "question": "单人 Deep of Night 可以离线玩吗？",
        "answer": "不可以。即使选择1人出击，也需要在线连接，不能与普通单人游玩混淆。"
      },
      {
        "question": "不能使用队伍会话或联机暗号吗？",
        "answer": "官方说明允许使用这两种方式。等待匹配与模式未开放不同，应记录界面状态和连接情况。"
      },
      {
        "question": "必须购买 DLC 才能进入吗？",
        "answer": "官方列出的模式条件是击败 Night Aspect 并在线连接。仅与 DLC 玩家匹配的条件，针对的是该模式内 DLC 新增内容的出现。"
      }
    ],
    "sources": [
      {
        "label": "官方：深夜模式开放条件（日语）",
        "url": "https://nightreign.eldenring.jp/article/250828_1.html"
      },
      {
        "label": "官方：DLC 启用与解锁说明（日语）",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "官方：2025年12月17日加入 DLC 内容（日语）",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "官方：2026年1月15日修复与调整（日语）",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "官方：2026年7月2日 Steam 版更新（日语）",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "官方：2026年9月18日 PS4／PS5 版更新（日语）",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "官方公告列表（日语）",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "万代南梦宫官方：Deep of Night 说明（西班牙语）",
        "url": "https://es.bandainamcoent.eu/elden-ring/noticias/elden-ring-nightreign-explicacion-de-profundidades-de-la-noche"
      }
    ],
    "locale": "zh",
    "gameName": "ELDEN RING NIGHTREIGN",
    "lead": "适用于无法使用 Deep of Night 高难度模式的玩家。模式本身未开放，与出击中没有遇到某个 DLC 敌人或地形，是不同的问题。文中保留目标的英文名称以便对照官方说明。",
    "summary": "Deep of Night 要求击败 Night Aspect，并连接在线模式。单人出击同样需要联网。条件满足后仍无法进入，应确认 Steam 更新完成，并将登录报错与模式是否显示分开记录。",
    "sourcePolicy": "依据2026年10月8日核对的官方公告。Steam 流程以日语启用说明和后续补丁公告为准；旧的未来更新描述已由后续补丁说明取代。本文不声称经过实机测试。",
    "related": [
      {
        "href": "/zh/games/elden-ring-nightreign/dlc-not-working",
        "label": "DLC 或新增角色无法使用"
      }
    ]
  },
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "dlc-not-working",
    "title": "El DLC de NIGHTREIGN no aparece en Steam: Scholar y Undertaker",
    "shortTitle": "DLC o personajes no disponibles",
    "description": "Comprueba la compra de The Forsaken Hollows, su activación en Steam, las descargas y el indicador del título antes de revisar el desbloqueo de Scholar y Undertaker.",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "Indicador de activación",
        "value": "The Forsaken Hollows en la pantalla de título"
      },
      {
        "label": "Plataforma",
        "value": "Windows/Steam; las instrucciones de consola son distintas"
      },
      {
        "label": "Desbloqueo de personajes",
        "value": "Derrota a Tricephalos y sigue las conversaciones indicadas"
      },
      {
        "label": "Referencia para Steam",
        "value": "2 de julio de 2026: App 1.03.3 / Regulation 1.03.5"
      }
    ],
    "diagnosis": [
      {
        "symptom": "El DLC falta en las propiedades de Steam",
        "cause": "Comprueba la cuenta y el producto adquirido",
        "stepId": "check-entitlement"
      },
      {
        "symptom": "No hay indicador del DLC en el título",
        "cause": "Activación o descarga posiblemente incompleta",
        "stepId": "enable-dlc"
      },
      {
        "symptom": "Aparece el indicador pero no los personajes",
        "cause": "Revisa el progreso y las conversaciones",
        "stepId": "unlock-nightfarers"
      },
      {
        "symptom": "Los personajes funcionan pero falta el nuevo objetivo",
        "cause": "La expedición tiene otro requisito",
        "stepId": "unlock-target"
      }
    ],
    "steps": [
      {
        "id": "check-entitlement",
        "title": "Comprueba la compra en la cuenta actual de Steam",
        "summary": "Revisa el pedido antes de volver a pagar.",
        "actions": [
          "En la biblioteca de Steam, haz clic derecho en ELDEN RING NIGHTREIGN, abre Propiedades y después DLC.",
          "Busca The Forsaken Hollows. Si falta, compara el historial o recibo con el producto, la tienda y la cuenta que estás usando.",
          "Si sigue sin aparecer, no continúes con la casilla de activación: consulta con el Soporte de Steam y prepara el justificante."
        ],
        "note": "No confundas el juego base con una edición que incluya el DLC, ni una compra de consola con una licencia de Steam.",
        "time": "Unos 2 min",
        "risk": "low"
      },
      {
        "id": "enable-dlc",
        "title": "Activa el DLC y reinicia Steam",
        "summary": "Sigue el procedimiento oficial para Steam y espera a que terminen las descargas.",
        "actions": [
          "Marca The Forsaken Hollows en la lista de DLC.",
          "Reinicia el cliente de Steam y espera a que finalicen las descargas necesarias del juego y del DLC.",
          "Abre el juego y busca The Forsaken Hollows encima de la versión, en la esquina inferior derecha de la pantalla de título.",
          "Si aparece, sigue con el desbloqueo. Si falla la descarga o sigue faltando el indicador, anota el error y pasa al último paso."
        ],
        "note": "El anuncio de PC consultado indica App 1.03.3 / Regulation 1.03.5. App 1.03.4, del 18 de septiembre, corresponde a PS4/PS5; no esperes ese número en Steam.",
        "time": "Unos 3 min, más la descarga",
        "risk": "low"
      },
      {
        "id": "unlock-nightfarers",
        "title": "Revisa las conversaciones posteriores a Tricephalos",
        "summary": "Hazlo después de confirmar el indicador del DLC.",
        "actions": [
          "Comprueba si has derrotado a Tricephalos en la partida que estás usando.",
          "En Roundtable Hold, habla con Iron Menial para escuchar el mensaje de Small Jar Merchant.",
          "Visita a Small Jar Merchant, sigue las indicaciones del juego y comprueba si puedes seleccionar a Scholar y Undertaker.",
          "Si cumples los requisitos y las conversaciones no cambian nada, conserva la partida y anota lo ocurrido."
        ],
        "note": "Desbloquear los personajes y acceder a la nueva expedición son comprobaciones distintas.",
        "time": "Unos 3 min de comprobación; el progreso requiere tiempo adicional",
        "risk": "low"
      },
      {
        "id": "unlock-target",
        "title": "Comprueba el requisito adicional de la expedición",
        "summary": "Poder seleccionar los personajes no confirma el acceso al nuevo objetivo.",
        "actions": [
          "Comprueba que Scholar y Undertaker estén desbloqueados y que hayas derrotado al menos a dos objetivos.",
          "Visita la capilla que hay más allá de Small Jar Merchant en Roundtable Hold y revisa el acceso a Balancers.",
          "Si solo falta contenido del DLC dentro de Profundidades de la Noche, consulta el artículo relacionado sobre sus condiciones de emparejamiento."
        ],
        "note": "El contenido del DLC se añadió a este modo el 17 de diciembre de 2025. La referencia a una futura actualización en la guía de lanzamiento ya es histórica.",
        "time": "Unos 3 min de comprobación; el progreso requiere tiempo adicional",
        "risk": "low"
      },
      {
        "id": "record-result",
        "title": "Anota en qué punto se bloquea el acceso",
        "summary": "Separa licencia, instalación y progreso dentro del juego.",
        "actions": [
          "Anota la lista de DLC, el indicador del título y las versiones App/Regulation.",
          "Registra si derrotaste a Tricephalos, qué conversaciones completaste y si puedes elegir los personajes.",
          "Para problemas con la compra, consulta al Soporte de Steam. Si cumples las condiciones pero el juego no avanza, sigue las indicaciones de soporte del sitio oficial e incluye el error completo y la hora.",
          "Si el juego base ni siquiera llega al título, utiliza la guía general de inicio de Steam en lugar de repetir el desbloqueo del DLC."
        ],
        "note": "La actualización del 15 de enero de 2026 abordó la recuperación de ciertos atuendos y reliquias únicas perdidos. No atribuyas automáticamente un bloqueo de personajes actual a esos informes antiguos.",
        "time": "Unos 5 min",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Problemas al iniciar juegos de Steam (japonés)",
          "description": "Para juegos que no llegan al título; no modifica licencias ni requisitos de desbloqueo."
        }
      }
    ],
    "avoid": [
      "No vuelvas a comprar el DLC solo porque falte su indicador.",
      "No borres ni edites partidas ni uses herramientas no oficiales para desbloquear DLC.",
      "No apliques a Steam las versiones o instrucciones de activación de PS4/PS5."
    ],
    "cautions": [
      "Fuentes oficiales consultadas el 8 de octubre de 2026. No se afirma haber reproducido el problema ni se garantiza una solución.",
      "Si falla una descarga, revisa también el espacio libre y el error mostrado. Cambia una sola cosa cada vez y anota el resultado."
    ],
    "faqs": [
      {
        "question": "¿La Deluxe Edition también necesita comprobar la activación?",
        "answer": "La guía oficial de lanzamiento incluye a los propietarios de la Deluxe Edition en las instrucciones de activación. Comprueba por separado la compra, la casilla de Steam y el indicador del título."
      },
      {
        "question": "¿Tener los personajes garantiza el acceso al nuevo objetivo?",
        "answer": "No. La nueva expedición también requiere derrotar al menos a dos objetivos y visitar la capilla. Poder seleccionar los personajes no confirma ese paso."
      },
      {
        "question": "¿Siguen sin corregirse los atuendos y reliquias perdidos?",
        "answer": "Las notas del 15 de enero de 2026 describen cómo se recuperan ciertos atuendos y reliquias únicos en Roundtable Hold. Aplica la actualización y comprueba el objeto afectado; informa por separado de otros síntomas."
      }
    ],
    "sources": [
      {
        "label": "Guía oficial de activación y desbloqueo del DLC (japonés)",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "Contenido del DLC añadido el 17 de diciembre de 2025 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "Correcciones y ajustes del 15 de enero de 2026 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "Actualización de Steam del 2 de julio de 2026 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "Actualización de PS4/PS5 del 18 de septiembre de 2026 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "Noticias oficiales (japonés)",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "Steam: producto, idiomas y requisitos",
        "url": "https://store.steampowered.com/app/2622380/ELDEN_RING_NIGHTREIGN/"
      },
      {
        "label": "Bandai Namco: cómo desbloquear el contenido del DLC (inglés)",
        "url": "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-nightreign-how-unlock-the-dlc-content"
      }
    ],
    "locale": "es",
    "gameName": "ELDEN RING NIGHTREIGN",
    "lead": "Para jugadores de Windows/Steam que compraron el DLC pero no pueden elegir sus personajes o iniciar sus expediciones. La compra, la instalación y el progreso son comprobaciones distintas. Se conservan algunos nombres ingleses para facilitar la consulta de la guía oficial.",
    "summary": "Busca The Forsaken Hollows sobre el número de versión en la pantalla de título. Si falta, revisa la activación en Steam. Si aparece, comprueba las conversaciones tras derrotar a Tricephalos: habla con Iron Menial y visita a Small Jar Merchant. Comprar el DLC no completa por sí solo el desbloqueo.",
    "sourcePolicy": "Basado en anuncios oficiales consultados el 8 de octubre de 2026. El procedimiento de Steam sigue los avisos japoneses de activación y actualización; los planes antiguos se contrastan con parches posteriores. No se afirma una prueba práctica.",
    "related": [
      {
        "href": "/es/games/elden-ring-nightreign/deep-of-night-not-appearing",
        "label": "Profundidades de la Noche no disponible"
      }
    ]
  },
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "deep-of-night-not-appearing",
    "title": "NIGHTREIGN: no aparece Profundidades de la Noche",
    "shortTitle": "Profundidades de la Noche no disponible",
    "description": "Comprueba la victoria sobre Aspecto de la Noche, la conexión en línea y la actualización de Steam si no puedes acceder a Profundidades de la Noche. Distingue los encuentros del DLC.",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "Requisito de progreso",
        "value": "Derrotar al Señor de la Noche Aspecto de la Noche"
      },
      {
        "label": "Conexión",
        "value": "Solo en línea, incluso en solitario; admite de 1 a 3 jugadores"
      },
      {
        "label": "Distinción del DLC",
        "value": "El acceso al modo y sus encuentros del DLC tienen condiciones distintas"
      },
      {
        "label": "Comprobado",
        "value": "8 de octubre de 2026"
      }
    ],
    "diagnosis": [
      {
        "symptom": "El modo no aparece",
        "cause": "Puede faltar el requisito de progreso",
        "stepId": "check-clear"
      },
      {
        "symptom": "No puedo jugar en solitario",
        "cause": "El juego puede estar desconectado",
        "stepId": "check-online"
      },
      {
        "symptom": "Error de conexión o actualización requerida",
        "cause": "Revisa las actualizaciones y el error",
        "stepId": "check-update"
      },
      {
        "symptom": "Solo faltan encuentros del DLC",
        "cause": "Condiciones del DLC o selección de encuentros",
        "stepId": "check-dlc-content"
      }
    ],
    "steps": [
      {
        "id": "check-clear",
        "title": "Confirma la victoria sobre Aspecto de la Noche en la partida actual",
        "summary": "El requisito difiere del desbloqueo de personajes del DLC.",
        "actions": [
          "Revisa el progreso de la partida cargada.",
          "Si todavía no derrotaste a Aspecto de la Noche, continúa las expediciones normales.",
          "Si ya lo derrotaste, pasa a comprobar el estado en línea."
        ],
        "note": "Derrotar únicamente a Tricephalos no cumple este requisito. No hace falta empezar de nuevo ni borrar la partida.",
        "time": "Unos 2 min de comprobación; el progreso requiere tiempo adicional",
        "risk": "low"
      },
      {
        "id": "check-online",
        "title": "Comprueba la conexión desde la pantalla de título",
        "summary": "Jugar en solitario y jugar sin conexión no son lo mismo.",
        "actions": [
          "Vuelve a la pantalla de título y comprueba si el juego está desconectado.",
          "Si arrancó sin conexión, elige INICIAR SESIÓN (LOGIN en inglés) en el menú del título.",
          "Tras conectarte, vuelve a comprobar el modo. Si INICIAR SESIÓN (LOGIN en inglés) falla, anota el mensaje completo antes de continuar."
        ],
        "note": "La guía oficial permite expediciones de uno, dos o tres jugadores estando en línea. Elegir tres jugadores no es un requisito de desbloqueo.",
        "time": "Unos 2 min",
        "risk": "low"
      },
      {
        "id": "check-update",
        "title": "Termina las actualizaciones de Steam y revisa los avisos",
        "summary": "Las versiones de PC y consola pueden ser diferentes.",
        "actions": [
          "Cierra el juego y comprueba si Steam tiene descargas o actualizaciones pendientes.",
          "Cuando terminen, reinicia el juego y anota las versiones App y Regulation del título.",
          "Revisa las noticias oficiales para encontrar actualizaciones destinadas a Steam y avisos que afecten a la conexión.",
          "Prueba a iniciar sesión tras actualizar. Si estás conectado pero falta el modo, registra ese resultado junto con la comprobación del jefe."
        ],
        "note": "A fecha de consulta, 8 de octubre de 2026, el último anuncio para Steam es del 2 de julio: App 1.03.3 / Regulation 1.03.5. App 1.03.4, del 18 de septiembre, es solo para PS4/PS5.",
        "time": "Unos 3 min, más la actualización",
        "risk": "low"
      },
      {
        "id": "check-dlc-content",
        "title": "Distingue la falta de encuentros del DLC del acceso al modo",
        "summary": "Si puedes entrar, la ausencia de un encuentro no significa que el modo esté bloqueado.",
        "actions": [
          "Confirma que The Forsaken Hollows está activado. Si falta su indicador en el título, consulta el artículo relacionado sobre el DLC.",
          "En multijugador, comprueba si la expedición reúne únicamente a jugadores con el DLC aplicado.",
          "Aunque cumplas las condiciones, no concluyas que hay un fallo porque una expedición no incluya un jefe o terreno concreto."
        ],
        "note": "El contenido se añadió el 17 de diciembre de 2025 y sus frecuencias se ajustaron el 15 de enero de 2026. Eso no garantiza un encuentro concreto en cada partida.",
        "time": "Unos 2 min",
        "risk": "low"
      },
      {
        "id": "record-result",
        "title": "Separa modo bloqueado, fallo de conexión y espera de emparejamiento",
        "summary": "Indica en qué pantalla se detiene el proceso.",
        "actions": [
          "Anota la victoria sobre Aspecto de la Noche, el estado en línea y las versiones de Steam.",
          "Distingue un modo ausente de uno seleccionable con error de conexión o una espera de emparejamiento.",
          "Sigue las indicaciones de soporte del sitio oficial e incluye la hora, el error completo, las actualizaciones recientes y lo que probaste.",
          "Si el juego no alcanza la pantalla de título, usa la guía general de inicio. No borres partidas ni archivos de autenticación para activar el modo."
        ],
        "note": "Si hay un aviso oficial de mantenimiento, comprueba su fecha y plataformas. Este artículo no informa de una caída en tiempo real.",
        "time": "Unos 5 min",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Problemas al iniciar juegos de Steam (japonés)",
          "description": "Úsala si el juego base no abre; los requisitos del modo se comprueban por separado."
        }
      }
    ],
    "avoid": [
      "No borres la partida para que aparezca el modo.",
      "No eludas el sistema antitrampas de un modo en línea.",
      "No abandones una expedición activa para probar el menú; la guía oficial advierte de penalizaciones por salir en multijugador."
    ],
    "cautions": [
      "Seleccionar modo, iniciar sesión y esperar emparejamiento son síntomas diferentes. Conserva el mensaje y la pantalla exactos.",
      "Poseer el DLC es distinto de cumplir los requisitos de progreso y conexión del modo."
    ],
    "faqs": [
      {
        "question": "¿Puedo jugar sin conexión si voy en solitario?",
        "answer": "No. Una expedición de un jugador también requiere el modo en línea. No lo confundas con el juego habitual en solitario."
      },
      {
        "question": "¿Se permiten sesiones de equipo o contraseñas multijugador?",
        "answer": "La guía oficial permite ambas. Una espera larga de emparejamiento es diferente de un modo bloqueado; registra el estado mostrado y la conexión."
      },
      {
        "question": "¿Necesito comprar el DLC para desbloquear este modo?",
        "answer": "Los requisitos oficiales del modo son derrotar a Aspecto de la Noche y conectarse en línea. La regla de emparejar solo a usuarios del DLC se refiere a los encuentros añadidos dentro del modo."
      }
    ],
    "sources": [
      {
        "label": "Requisitos oficiales de Profundidades de la Noche (japonés)",
        "url": "https://nightreign.eldenring.jp/article/250828_1.html"
      },
      {
        "label": "Guía oficial de activación y desbloqueo del DLC (japonés)",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "Contenido del DLC añadido el 17 de diciembre de 2025 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "Correcciones y ajustes del 15 de enero de 2026 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "Actualización de Steam del 2 de julio de 2026 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "Actualización de PS4/PS5 del 18 de septiembre de 2026 (japonés)",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "Noticias oficiales (japonés)",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "Bandai Namco: explicación de Profundidades de la Noche",
        "url": "https://es.bandainamcoent.eu/elden-ring/noticias/elden-ring-nightreign-explicacion-de-profundidades-de-la-noche"
      }
    ],
    "locale": "es",
    "gameName": "ELDEN RING NIGHTREIGN",
    "lead": "Para quienes no pueden acceder a Profundidades de la Noche (Deep of Night). Que falte el modo y que no aparezca un jefe o terreno del DLC durante una expedición son problemas distintos.",
    "summary": "El modo exige derrotar a Aspecto de la Noche y conectarse en línea. También necesitas conexión si sales en solitario. Si cumples ambas condiciones, comprueba las actualizaciones de Steam y registra los errores de inicio de sesión por separado de la disponibilidad del modo.",
    "sourcePolicy": "Basado en anuncios oficiales consultados el 8 de octubre de 2026. El procedimiento de Steam sigue los avisos japoneses de activación y actualización; los planes antiguos se contrastan con parches posteriores. No se afirma una prueba práctica.",
    "related": [
      {
        "href": "/es/games/elden-ring-nightreign/dlc-not-working",
        "label": "DLC o personajes no disponibles"
      }
    ]
  }
];
