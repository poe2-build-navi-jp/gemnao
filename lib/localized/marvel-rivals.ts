import type { LocalizedArticle } from '@/lib/localized/types';
import type { LocalizedHub } from '@/lib/localized/hubs';

export const marvelRivalsLocalizedHub: LocalizedHub = {
  "focused": true,
  "names": {
    "en": "Marvel Rivals",
    "zh": "Marvel Rivals",
    "es": "Marvel Rivals"
  },
  "title": {
    "en": "Marvel Rivals PC: login failures, connections and high ping",
    "zh": "Marvel Rivals PC 版：登录失败、连接问题与高延迟",
    "es": "Marvel Rivals en PC: fallos de inicio de sesión, conexión y ping alto"
  },
  "lead": {
    "en": "Separate trouble logging in or entering a match from network delay during play. Follow Marvel Rivals’ official PC network tests and server-selection guidance.",
    "zh": "区分无法登录、无法进入比赛与对局中的网络延迟，按照官方网络诊断和服务器选择说明排查 PC 版问题。",
    "es": "Distingue los problemas para iniciar sesión o entrar en una partida del retraso de red durante el juego. Sigue las pruebas de red y la selección de servidores indicadas por Marvel Rivals."
  },
  "intro": {
    "en": "If you cannot get in, start with connectivity diagnosis. If you can play but responses arrive late, compare server nodes and collect a delay test. These tools gather evidence; they do not guarantee a repair.",
    "zh": "进不去游戏时先检查连接；能进入比赛但操作反馈迟缓时，比较服务器节点并记录延迟测试。诊断用于收集线索，不保证自动修复问题。",
    "es": "Si no puedes entrar, empieza por diagnosticar la conexión. Si puedes jugar pero las acciones llegan tarde, compara nodos y registra una prueba de latencia. Estas herramientas recogen información; no garantizan una reparación."
  },
  "checkedAt": "2026-10-08",
  "sources": [
    {
      "label": {
        "en": "Marvel Rivals: network analysis tool guide",
        "zh": "Marvel Rivals 官方：网络分析工具指南",
        "es": "Marvel Rivals: guía oficial de análisis de red"
      },
      "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
    },
    {
      "label": {
        "en": "Marvel Rivals: server selection",
        "zh": "Marvel Rivals 官方：服务器选择",
        "es": "Marvel Rivals: selección de servidores"
      },
      "url": "https://www.marvelrivals.com/guide/server/"
    },
    {
      "label": {
        "en": "Marvel Rivals: release FAQ and support contact",
        "zh": "Marvel Rivals 官方：上线问答与客服入口",
        "es": "Marvel Rivals: preguntas de lanzamiento y soporte"
      },
      "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
    },
    {
      "label": {
        "en": "Marvel Rivals: official news",
        "zh": "Marvel Rivals 官方新闻",
        "es": "Marvel Rivals: noticias oficiales"
      },
      "url": "https://www.marvelrivals.com/news/"
    },
    {
      "label": {
        "en": "Steam: Marvel Rivals requirements and languages",
        "zh": "Steam：Marvel Rivals 配置与语言",
        "es": "Steam: requisitos e idiomas de Marvel Rivals"
      },
      "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
    }
  ]
};

export const marvelRivalsLocalizedArticles: LocalizedArticle[] = [
  {
    "locale": "en",
    "gameSlug": "marvel-rivals",
    "gameName": "Marvel Rivals",
    "slug": "login-error",
    "title": "Marvel Rivals Cannot Log In or Enter a Match: PC Network Checks",
    "shortTitle": "Cannot log in or join a match",
    "description": "Check official notices, record the failure and use CapturePro’s Network Adaptability Test for Marvel Rivals PC login or match-entry problems. Learn what to send to support safely.",
    "lead": "For failures at login or when moving from the lobby into a match. An application that crashes at launch, or latency only after a match begins, needs a different investigation.",
    "summary": "Check notices and identify where entry fails, then choose Network Adaptability Test in CapturePro.exe from your legitimate PC installation. Treat the result as diagnostic evidence. If entry still fails, give official support the time, error and test outcome.",
    "quickFacts": [
      {
        "label": "Test to use",
        "value": "Network Adaptability Test"
      },
      {
        "label": "Scope",
        "value": "Windows PC / official tool in a legitimate installation"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Check notices and record where entry fails",
        "cause": "Separate announced service work from the failure on your PC.",
        "stepId": "check-service"
      },
      {
        "symptom": "Find CapturePro.exe in the legitimate installation",
        "cause": "The official guide points to the game’s installation directory.",
        "stepId": "open-capturepro"
      },
      {
        "symptom": "Choose Network Adaptability Test",
        "cause": "This is the test the publisher assigns to login and match-entry failures.",
        "stepId": "test-connectivity"
      },
      {
        "symptom": "Prepare a report for official support",
        "cause": "Report the test outcome separately from the result in the game.",
        "stepId": "contact-support"
      }
    ],
    "steps": [
      {
        "id": "check-service",
        "title": "Check notices and record where entry fails",
        "summary": "Separate announced service work from the failure on your PC.",
        "actions": [
          "Read official news for outages or maintenance affecting your time, region and platform. No notice does not prove that the service is healthy.",
          "Record whether login fails or the lobby works but match entry fails. Save the full error, time with time zone and storefront.",
          "If relevant maintenance is under way, wait for the completion notice, then repeat the same entry attempt."
        ],
        "time": "About 2 min",
        "risk": "low"
      },
      {
        "id": "open-capturepro",
        "title": "Find CapturePro.exe in the legitimate installation",
        "summary": "The official guide points to the game’s installation directory.",
        "actions": [
          "Use your storefront or launcher to locate and open the game’s installed files.",
          "Confirm that CapturePro.exe is inside that legitimate installation and compare with the official guide.",
          "If it is missing or a security warning appears, stop and report the missing file or warning and its source to official support. Do not replace it with a standalone download from another site."
        ],
        "time": "About 2 min",
        "risk": "low"
      },
      {
        "id": "test-connectivity",
        "title": "Choose Network Adaptability Test",
        "summary": "This is the test the publisher assigns to login and match-entry failures.",
        "actions": [
          "Open the installed CapturePro.exe and select Network Adaptability Test.",
          "Follow the tool’s prompts and record its outcome. Even if the test succeeds, separately check whether login or match entry now works.",
          "If the test cannot run, record that limitation and continue to preparing a support report."
        ],
        "time": "Varies by connection",
        "risk": "low",
        "note": "The official instruction to press Stop after about 20 seconds belongs to the delay-test section. Do not treat it as a universal timer for this connectivity test."
      },
      {
        "id": "contact-support",
        "title": "Prepare a report for official support",
        "summary": "Report the test outcome separately from the result in the game.",
        "actions": [
          "Collect the time and time zone, storefront, failing screen, full error and diagnostic outcome.",
          "If a tr_results_xxxxxxxx_xxxxxx.zip archive was generated as described by the guide, note its location. If none appeared, say so.",
          "Follow the official FAQ to Marvel Rivals Support on Discord and confirm what to submit and where. Redact email addresses, IP addresses and other personal details from screenshots. Keep original logs; ask support before editing fields whose purpose is unclear."
        ],
        "time": "About 3 min",
        "risk": "low"
      }
    ],
    "avoid": [
      "Do not obtain CapturePro.exe from search ads, mirrors or unofficial download links.",
      "Do not disable antivirus or the entire firewall to troubleshoot a connection.",
      "Keep passwords, verification codes and tokens out of screenshots and support messages."
    ],
    "cautions": [
      "Diagnostic files may contain connection, device or network-environment information. Do not post them in public chat. Reach support through the official website and confirm the required data and secure submission method.",
      "Based on public official documentation; not a claim of hands-on reproduction or a guaranteed fix."
    ],
    "faqs": [
      {
        "question": "Will changing regions fix a login outage?",
        "answer": "The official release FAQ distinguishes the login server from servers chosen for matchmaking. Selecting a match node alone is not evidence that a login failure will be fixed."
      },
      {
        "question": "Can I download CapturePro.exe elsewhere if it is missing?",
        "answer": "Avoid unofficial copies. Tell support that the file is absent from your legitimate installation. This guide does not promise a standalone download or an identical location across every storefront."
      },
      {
        "question": "What if the test passes but match entry still fails?",
        "answer": "Conditions may differ between the test and the failed attempt. Keep the times and results of both, together with the error. A passing test alone cannot identify an account restriction or a routing fault."
      }
    ],
    "sources": [
      {
        "label": "Marvel Rivals: network analysis tool guide",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals: server selection",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals: release FAQ and support contact",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals: official news",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steam: Marvel Rivals requirements and languages",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "checkedAt": "2026-10-08",
    "related": [
      {
        "href": "/en/games/marvel-rivals/high-ping",
        "label": "High ping and network lag"
      },
      {
        "href": "/pc/wifi-connected-no-internet",
        "label": "Wi-Fi connected but no internet (Japanese)"
      },
      {
        "href": "/guide/verify-steam-files",
        "label": "Verify Steam game files (Japanese)"
      }
    ],
    "sourcePolicy": "Based on public official documentation; not a claim of hands-on reproduction or a guaranteed fix."
  },
  {
    "locale": "en",
    "gameSlug": "marvel-rivals",
    "gameName": "Marvel Rivals",
    "slug": "high-ping",
    "title": "Marvel Rivals High Ping and Network Lag: Server Selection and PC Tests",
    "shortTitle": "High ping and network lag",
    "description": "Compare Marvel Rivals server nodes and use the official Network Delay Test for high ping or delayed actions on PC. Distinguish a short comparison from a capture when lag occurs.",
    "lead": "For players who can enter matches but see delayed movement or actions. Record low FPS separately rather than assuming that all stuttering is a network problem.",
    "summary": "Compare the selected server and its displayed latency, then try a lower-latency candidate if appropriate. If delay continues, use CapturePro.exe’s Network Delay Test on familiar nodes or nearby regions and record when the symptom occurs.",
    "quickFacts": [
      {
        "label": "Test to use",
        "value": "Network Delay Test"
      },
      {
        "label": "Scope",
        "value": "Windows PC / official tool in a legitimate installation"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Separate network delay from low FPS",
        "cause": "The word “lag” alone does not identify a network or rendering problem.",
        "stepId": "separate-lag"
      },
      {
        "symptom": "Compare the available match servers",
        "cause": "The official guide allows a single server or a group of servers.",
        "stepId": "compare-nodes"
      },
      {
        "symptom": "Capture delay with Network Delay Test",
        "cause": "Test familiar nodes or nearby regions using the official tool.",
        "stepId": "test-delay"
      },
      {
        "symptom": "Compare the records and contact support if needed",
        "cause": "Include the conditions under which each measurement was taken.",
        "stepId": "review-delay"
      }
    ],
    "steps": [
      {
        "id": "separate-lag",
        "title": "Separate network delay from low FPS",
        "summary": "The word “lag” alone does not identify a network or rendering problem.",
        "actions": [
          "Describe whether actions arrive late or the whole picture loses smoothness.",
          "If available, record ping and FPS with the selected node and time. If no figures are shown, record the symptoms instead.",
          "Check official news for a relevant incident. If only FPS drops, continue to the general low-FPS guide."
        ],
        "time": "About 2 min",
        "risk": "low",
        "guideLink": {
          "href": "/guide/low-fps",
          "label": "General low-FPS guide (Japanese)",
          "description": "Use this when rendering, rather than network delay, is the problem."
        }
      },
      {
        "id": "compare-nodes",
        "title": "Compare the available match servers",
        "summary": "The official guide allows a single server or a group of servers.",
        "actions": [
          "Check the available servers and displayed latency in the game, and note your original selection.",
          "Compare a lower-latency candidate first. Do not assume a nearby city name guarantees a better route; check the display and actual play.",
          "Record nodes, times and symptoms before and after changing the selection so that you can restore the original choice if it does not help."
        ],
        "time": "About 2 min",
        "risk": "low",
        "note": "Node selection does not guarantee low ping or shorter queues. Use the options shown by your current client."
      },
      {
        "id": "test-delay",
        "title": "Capture delay with Network Delay Test",
        "summary": "Test familiar nodes or nearby regions using the official tool.",
        "actions": [
          "Open CapturePro.exe in the legitimate game installation and choose Network Delay Test. If it is missing, ask support rather than downloading an unofficial copy.",
          "Select nodes you normally use or nearby regions. For a short comparison, wait about 20 seconds, then press Stop yourself.",
          "The publisher also permits testing during play. To capture the symptom, press Stop when noticeable delay occurs and record the time, node and symptoms."
        ],
        "time": "About 20 sec plus setup",
        "risk": "low",
        "note": "About 20 seconds is a measurement guideline, not an expected recovery time. Do not bypass security warnings to run the tool."
      },
      {
        "id": "review-delay",
        "title": "Compare the records and contact support if needed",
        "summary": "Include the conditions under which each measurement was taken.",
        "actions": [
          "Compare the records before and after the node change and at the moment of lag. One result does not prove that your ISP or the game server is faulty.",
          "If it improves, keep the selected node and conditions in your notes. If it recurs, add the time, time zone and symptoms.",
          "If it persists, reach Marvel Rivals Support through the official FAQ. Confirm how to submit the generated tr_results_xxxxxxxx_xxxxxx.zip; do not post it publicly. Redact personal details in screenshots and ask before modifying diagnostic logs."
        ],
        "time": "About 3 min",
        "risk": "low"
      }
    ],
    "avoid": [
      "Do not obtain CapturePro.exe from search ads, mirrors or unofficial download links.",
      "Do not disable antivirus or the entire firewall to troubleshoot a connection.",
      "Keep passwords, verification codes and tokens out of screenshots and support messages."
    ],
    "cautions": [
      "Diagnostic files may contain connection, device or network-environment information. Do not post them in public chat. Reach support through the official website and confirm the required data and secure submission method.",
      "Based on public official documentation; not a claim of hands-on reproduction or a guaranteed fix."
    ],
    "faqs": [
      {
        "question": "Is Tokyo always fastest when playing from Japan?",
        "answer": "Tokyo appears in the official node list, but the best route depends on your connection. Compare your current client’s latency display with actual match behavior."
      },
      {
        "question": "Does Network Delay Test improve FPS?",
        "answer": "The publisher describes it as network diagnosis, not a frame-rate improvement feature. If ping is stable but FPS is low, investigate rendering load separately."
      },
      {
        "question": "Should I select every server?",
        "answer": "The official guide allows one server or a group, but does not say that selecting all is always best. Compare candidate latency and the symptoms before and after a change."
      }
    ],
    "sources": [
      {
        "label": "Marvel Rivals: network analysis tool guide",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals: server selection",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals: release FAQ and support contact",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals: official news",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steam: Marvel Rivals requirements and languages",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "checkedAt": "2026-10-08",
    "related": [
      {
        "href": "/en/games/marvel-rivals/login-error",
        "label": "Cannot log in or join a match"
      },
      {
        "href": "/pc/wifi-connected-no-internet",
        "label": "Wi-Fi connected but no internet (Japanese)"
      },
      {
        "href": "/guide/low-fps",
        "label": "General low-FPS guide (Japanese)"
      }
    ],
    "sourcePolicy": "Based on public official documentation; not a claim of hands-on reproduction or a guaranteed fix."
  },
  {
    "locale": "zh",
    "gameSlug": "marvel-rivals",
    "gameName": "Marvel Rivals",
    "slug": "login-error",
    "title": "Marvel Rivals 无法登录或进入比赛：PC 版网络检查步骤",
    "shortTitle": "无法登录或进入比赛",
    "description": "Marvel Rivals PC 版登录或进入比赛失败时，依次检查官方公告、记录错误、使用 CapturePro 的 Network Adaptability Test，并安全地整理客服所需信息。",
    "lead": "适用于卡在登录阶段，或能到大厅但无法进入比赛的情况。启动时程序直接崩溃，或进入比赛后才出现延迟，应分开排查。",
    "summary": "先查看官方公告并确定失败阶段，再使用正版安装目录中的 CapturePro.exe，选择 Network Adaptability Test。不要仅凭诊断结果断定原因；仍无法进入时，将时间、错误与测试结果交给官方客服。",
    "quickFacts": [
      {
        "label": "使用的测试",
        "value": "Network Adaptability Test"
      },
      {
        "label": "适用范围",
        "value": "Windows PC 版／正版安装内的官方工具"
      }
    ],
    "diagnosis": [
      {
        "symptom": "查看公告并记录失败阶段",
        "cause": "区分官方已公告的维护与本机出现的问题。",
        "stepId": "check-service"
      },
      {
        "symptom": "在正版安装目录中查找 CapturePro.exe",
        "cause": "官方指引要求从游戏安装目录打开工具。",
        "stepId": "open-capturepro"
      },
      {
        "symptom": "选择 Network Adaptability Test",
        "cause": "这是官方针对登录或进入比赛失败指定的连接测试。",
        "stepId": "test-connectivity"
      },
      {
        "symptom": "向官方客服提供结果和复现条件",
        "cause": "分别说明诊断结果和游戏内的结果。",
        "stepId": "contact-support"
      }
    ],
    "steps": [
      {
        "id": "check-service",
        "title": "查看公告并记录失败阶段",
        "summary": "区分官方已公告的维护与本机出现的问题。",
        "actions": [
          "查看官方新闻中是否有影响当前时间、地区和平台的故障或维护公告。没有公告不等于服务一定正常。",
          "记录是登录失败，还是能进入大厅但无法进入比赛。同时保存完整错误、发生时间与时区、使用的商店。",
          "如正在进行相关维护，等待结束公告后，再尝试同一操作。"
        ],
        "time": "约 2 分钟",
        "risk": "low"
      },
      {
        "id": "open-capturepro",
        "title": "在正版安装目录中查找 CapturePro.exe",
        "summary": "官方指引要求从游戏安装目录打开工具。",
        "actions": [
          "通过所用商店或启动器找到并打开游戏安装目录。",
          "确认 CapturePro.exe 位于该正版安装目录，并对照官方指南。",
          "如果找不到文件，或出现安全警告，请停止操作，将缺失情况或警告及文件来源告知官方客服。不要从其他网站补下载单独的程序。"
        ],
        "time": "约 2 分钟",
        "risk": "low"
      },
      {
        "id": "test-connectivity",
        "title": "选择 Network Adaptability Test",
        "summary": "这是官方针对登录或进入比赛失败指定的连接测试。",
        "actions": [
          "打开正版安装内的 CapturePro.exe，选择 Network Adaptability Test。",
          "按工具内提示完成操作并记录结果。即使测试成功，也要另外确认是否能登录或进入比赛。",
          "无法运行测试时，也请记录这一情况，继续整理客服报告。"
        ],
        "time": "时间因网络环境而异",
        "risk": "low",
        "note": "官方“约 20 秒后按 Stop”的说明属于延迟测试部分，不应当作此连接测试的统一时限。"
      },
      {
        "id": "contact-support",
        "title": "向官方客服提供结果和复现条件",
        "summary": "分别说明诊断结果和游戏内的结果。",
        "actions": [
          "整理时间与时区、商店、失败画面、完整错误和诊断结果。",
          "若生成了官方所述的 tr_results_xxxxxxxx_xxxxxx.zip，记下保存位置；若未生成，也如实说明。",
          "从官方问答页进入 Discord 的 Marvel Rivals Support，确认所需内容和提交位置。遮盖截图中的邮箱、IP 地址等个人信息。保留原始日志；不清楚能否编辑的字段，先询问客服。"
        ],
        "time": "约 3 分钟",
        "risk": "low"
      }
    ],
    "avoid": [
      "不要从搜索广告、镜像网站或非官方链接下载 CapturePro.exe。",
      "不要为了排查连接而整体关闭杀毒软件或防火墙。",
      "截图和客服消息中不要包含密码、验证码或令牌。"
    ],
    "cautions": [
      "诊断文件可能含有连接目标、设备或网络环境信息。不要发到公开聊天中。请从官方网站进入客服渠道，先确认所需信息及安全的提交方式。",
      "依据官方公开资料编写，不代表实机复现或保证修复。"
    ],
    "faqs": [
      {
        "question": "更换地区能解决登录故障吗？",
        "answer": "官方上线问答区分登录服务器与匹配时选择的服务器。仅更换比赛节点，不能保证解决登录失败。"
      },
      {
        "question": "找不到 CapturePro.exe，可以去别的网站下载吗？",
        "answer": "请勿使用非官方副本。向客服说明正版安装中没有该文件。本指南不保证存在单独下载地址，也不保证各商店版本的目录完全一致。"
      },
      {
        "question": "测试通过了，为什么仍然无法进入比赛？",
        "answer": "测试和失败时的条件可能不同。请保留两次操作的时间、结果和错误信息。仅凭测试通过，无法判定是否存在账号限制或路由故障。"
      }
    ],
    "sources": [
      {
        "label": "Marvel Rivals 官方：网络分析工具指南",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals 官方：服务器选择",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals 官方：上线问答与客服入口",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals 官方新闻",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steam：Marvel Rivals 配置与语言",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "checkedAt": "2026-10-08",
    "related": [
      {
        "href": "/zh/games/marvel-rivals/high-ping",
        "label": "高 Ping 与网络延迟"
      },
      {
        "href": "/pc/wifi-connected-no-internet",
        "label": "Wi-Fi 已连接但无法上网（日语）"
      },
      {
        "href": "/guide/verify-steam-files",
        "label": "验证 Steam 游戏文件（日语）"
      }
    ],
    "sourcePolicy": "依据官方公开资料编写，不代表实机复现或保证修复。"
  },
  {
    "locale": "zh",
    "gameSlug": "marvel-rivals",
    "gameName": "Marvel Rivals",
    "slug": "high-ping",
    "title": "Marvel Rivals Ping 高、网络卡顿：服务器选择与 PC 延迟测试",
    "shortTitle": "高 Ping 与网络延迟",
    "description": "比较 Marvel Rivals 服务器节点，使用官方 Network Delay Test 排查 PC 版高 Ping 和操作延迟。区分约 20 秒的比较测试与症状发生时的记录。",
    "lead": "适用于能进入比赛，但移动或攻击反馈迟缓的玩家。仅帧率下降的情况，请与网络延迟分开记录。",
    "summary": "先比较当前服务器及显示的延迟，必要时换到延迟较低的候选节点验证。仍有问题时，通过 CapturePro.exe 的 Network Delay Test 测试常用节点或附近地区，记录症状出现的时间。",
    "quickFacts": [
      {
        "label": "使用的测试",
        "value": "Network Delay Test"
      },
      {
        "label": "适用范围",
        "value": "Windows PC 版／正版安装内的官方工具"
      }
    ],
    "diagnosis": [
      {
        "symptom": "区分网络延迟与低帧率",
        "cause": "仅说“卡”不足以判断应检查网络还是渲染。",
        "stepId": "separate-lag"
      },
      {
        "symptom": "比较可用的比赛服务器",
        "cause": "官方说明允许选择单个服务器或一组服务器。",
        "stepId": "compare-nodes"
      },
      {
        "symptom": "使用 Network Delay Test 记录延迟",
        "cause": "用官方工具测试常用节点或附近地区。",
        "stepId": "test-delay"
      },
      {
        "symptom": "比较记录，必要时联系官方客服",
        "cause": "说明每次测量时的条件，有助于描述问题。",
        "stepId": "review-delay"
      }
    ],
    "steps": [
      {
        "id": "separate-lag",
        "title": "区分网络延迟与低帧率",
        "summary": "仅说“卡”不足以判断应检查网络还是渲染。",
        "actions": [
          "写清楚是移动、攻击的反馈慢，还是整个画面不流畅。",
          "若界面提供数据，将 Ping、FPS、所选节点和发生时间一起记录；没有数据时，记录具体症状即可。",
          "查看官方新闻有无相关故障。仅 FPS 下降时，转到通用低帧率指南。"
        ],
        "time": "约 2 分钟",
        "risk": "low",
        "guideLink": {
          "href": "/guide/low-fps",
          "label": "通用低帧率指南（日语）",
          "description": "仅画面渲染不流畅时查看此指南。"
        }
      },
      {
        "id": "compare-nodes",
        "title": "比较可用的比赛服务器",
        "summary": "官方说明允许选择单个服务器或一组服务器。",
        "actions": [
          "在游戏内查看可选服务器及延迟，先记下当前选择。",
          "优先比较延迟较低的候选节点。不要只凭城市距离判断线路优劣，应同时看数值与实际对局表现。",
          "记录更改前后的节点、时间和症状，方便无改善时恢复原来的选择。"
        ],
        "time": "约 2 分钟",
        "risk": "low",
        "note": "选择节点不保证低 Ping 或更短的排队时间。可用节点以当前客户端显示为准。"
      },
      {
        "id": "test-delay",
        "title": "使用 Network Delay Test 记录延迟",
        "summary": "用官方工具测试常用节点或附近地区。",
        "actions": [
          "打开正版游戏安装目录中的 CapturePro.exe，选择 Network Delay Test。找不到时联系官方客服，不要下载非官方副本。",
          "选择常用节点或附近地区。做短时间比较时，等待约 20 秒后手动按 Stop。",
          "官方也允许游戏过程中测试。若要记录症状，在明显延迟发生时按 Stop，并记下时间、节点和现象。"
        ],
        "time": "测试约 20 秒，另需准备时间",
        "risk": "low",
        "note": "约 20 秒是比较测试的参考时长，不是预计恢复时间。不要绕过安全警告运行工具。"
      },
      {
        "id": "review-delay",
        "title": "比较记录，必要时联系官方客服",
        "summary": "说明每次测量时的条件，有助于描述问题。",
        "actions": [
          "比较换节点前后及延迟发生时的记录。不要仅凭一次结果断定运营商或游戏服务器有故障。",
          "若有改善，保留所选节点和条件；若再次发生，补充时间、时区及对局症状。",
          "持续异常时，从官方问答页进入 Marvel Rivals Support。先确认如何提交生成的 tr_results_xxxxxxxx_xxxxxx.zip，不要公开发布。截图中的个人信息应遮盖，修改日志前先询问客服。"
        ],
        "time": "约 3 分钟",
        "risk": "low"
      }
    ],
    "avoid": [
      "不要从搜索广告、镜像网站或非官方链接下载 CapturePro.exe。",
      "不要为了排查连接而整体关闭杀毒软件或防火墙。",
      "截图和客服消息中不要包含密码、验证码或令牌。"
    ],
    "cautions": [
      "诊断文件可能含有连接目标、设备或网络环境信息。不要发到公开聊天中。请从官方网站进入客服渠道，先确认所需信息及安全的提交方式。",
      "依据官方公开资料编写，不代表实机复现或保证修复。"
    ],
    "faqs": [
      {
        "question": "在日本游玩，Tokyo 一定最快吗？",
        "answer": "官方节点列表包含 Tokyo，但最佳线路取决于网络环境。请比较当前客户端的延迟显示与实际比赛表现。"
      },
      {
        "question": "Network Delay Test 可以提升 FPS 吗？",
        "answer": "官方将其作为网络诊断工具，并未说明它能提升帧率。Ping 稳定但 FPS 低时，应另行检查渲染负载。"
      },
      {
        "question": "应该勾选所有服务器吗？",
        "answer": "官方允许单选或多选，但没有说明全选始终最好。请比较候选节点的延迟，再确认更改前后的症状。"
      }
    ],
    "sources": [
      {
        "label": "Marvel Rivals 官方：网络分析工具指南",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals 官方：服务器选择",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals 官方：上线问答与客服入口",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals 官方新闻",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steam：Marvel Rivals 配置与语言",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "checkedAt": "2026-10-08",
    "related": [
      {
        "href": "/zh/games/marvel-rivals/login-error",
        "label": "无法登录或进入比赛"
      },
      {
        "href": "/pc/wifi-connected-no-internet",
        "label": "Wi-Fi 已连接但无法上网（日语）"
      },
      {
        "href": "/guide/low-fps",
        "label": "通用低帧率指南（日语）"
      }
    ],
    "sourcePolicy": "依据官方公开资料编写，不代表实机复现或保证修复。"
  },
  {
    "locale": "es",
    "gameSlug": "marvel-rivals",
    "gameName": "Marvel Rivals",
    "slug": "login-error",
    "title": "Marvel Rivals: no puedo iniciar sesión o entrar en una partida en PC",
    "shortTitle": "No inicia sesión o no entra en partida",
    "description": "Revisa los avisos oficiales y utiliza Network Adaptability Test de CapturePro para los fallos de acceso de Marvel Rivals en PC. Registra el error y prepara un informe seguro para soporte.",
    "lead": "Para errores al iniciar sesión o al pasar del vestíbulo a una partida. Los cierres de la aplicación al arrancar y el retraso que aparece solo durante una partida requieren otra investigación.",
    "summary": "Consulta los avisos y anota en qué punto falla el acceso. Después, selecciona Network Adaptability Test en CapturePro.exe dentro de la instalación legítima de PC. El resultado es una pista de diagnóstico; si el acceso sigue fallando, comunica la hora, el error y el resultado al soporte oficial.",
    "quickFacts": [
      {
        "label": "Prueba indicada",
        "value": "Network Adaptability Test"
      },
      {
        "label": "Ámbito",
        "value": "Windows PC / herramienta oficial de una instalación legítima"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Revisa los avisos y registra dónde falla el acceso",
        "cause": "Distingue el mantenimiento anunciado del fallo que observas en tu equipo.",
        "stepId": "check-service"
      },
      {
        "symptom": "Busca CapturePro.exe en la instalación legítima",
        "cause": "La guía oficial remite al directorio de instalación del juego.",
        "stepId": "open-capturepro"
      },
      {
        "symptom": "Selecciona Network Adaptability Test",
        "cause": "Es la prueba que el editor indica para los fallos al iniciar sesión o entrar en partidas.",
        "stepId": "test-connectivity"
      },
      {
        "symptom": "Prepara la información para el soporte oficial",
        "cause": "Distingue el resultado de la prueba del resultado dentro del juego.",
        "stepId": "contact-support"
      }
    ],
    "steps": [
      {
        "id": "check-service",
        "title": "Revisa los avisos y registra dónde falla el acceso",
        "summary": "Distingue el mantenimiento anunciado del fallo que observas en tu equipo.",
        "actions": [
          "Consulta las noticias oficiales por si hay incidencias o mantenimiento que afecten a tu horario, región y plataforma. La ausencia de un aviso no confirma que todo funcione.",
          "Anota si falla el inicio de sesión o si puedes llegar al vestíbulo pero no a la partida. Guarda el error completo, la hora con zona horaria y la tienda utilizada.",
          "Si hay un mantenimiento aplicable, espera al aviso de finalización y repite el mismo intento de acceso."
        ],
        "time": "Unos 2 min",
        "risk": "low"
      },
      {
        "id": "open-capturepro",
        "title": "Busca CapturePro.exe en la instalación legítima",
        "summary": "La guía oficial remite al directorio de instalación del juego.",
        "actions": [
          "Utiliza la tienda o el lanzador para localizar y abrir los archivos instalados del juego.",
          "Comprueba que CapturePro.exe está dentro de esa instalación legítima y contrástalo con la guía oficial.",
          "Si falta o aparece una advertencia de seguridad, detente y comunica al soporte el archivo ausente o la advertencia y su procedencia. No lo sustituyas por un ejecutable descargado de otra web."
        ],
        "time": "Unos 2 min",
        "risk": "low"
      },
      {
        "id": "test-connectivity",
        "title": "Selecciona Network Adaptability Test",
        "summary": "Es la prueba que el editor indica para los fallos al iniciar sesión o entrar en partidas.",
        "actions": [
          "Abre CapturePro.exe desde la instalación legítima y selecciona Network Adaptability Test.",
          "Sigue las indicaciones de la herramienta y registra el resultado. Aunque la prueba termine bien, comprueba por separado si ya puedes iniciar sesión o entrar en partida.",
          "Si la prueba no puede ejecutarse, anótalo también y pasa a preparar el informe para soporte."
        ],
        "time": "Depende de la conexión",
        "risk": "low",
        "note": "La indicación oficial de pulsar Stop tras unos 20 segundos pertenece a la prueba de latencia. No la apliques como un límite universal a esta prueba de conexión."
      },
      {
        "id": "contact-support",
        "title": "Prepara la información para el soporte oficial",
        "summary": "Distingue el resultado de la prueba del resultado dentro del juego.",
        "actions": [
          "Reúne la hora y zona horaria, tienda, pantalla en la que falla, error completo y resultado del diagnóstico.",
          "Si se ha generado el archivo tr_results_xxxxxxxx_xxxxxx.zip descrito en la guía, anota su ubicación. Si no aparece, indícalo.",
          "Accede a Marvel Rivals Support en Discord desde las preguntas frecuentes oficiales y confirma qué enviar y dónde. Oculta correos, direcciones IP y otros datos personales en las capturas. Conserva los registros originales y consulta antes de editar campos cuya función desconozcas."
        ],
        "time": "Unos 3 min",
        "risk": "low"
      }
    ],
    "avoid": [
      "No descargues CapturePro.exe desde anuncios, sitios espejo ni enlaces no oficiales.",
      "No desactives todo el antivirus o el cortafuegos para investigar la conexión.",
      "No incluyas contraseñas, códigos de verificación ni tokens en capturas o mensajes al soporte."
    ],
    "cautions": [
      "Los archivos de diagnóstico pueden contener datos de conexiones, del equipo o del entorno de red. No los publiques en chats abiertos. Accede al soporte desde la web oficial y confirma qué datos necesitan y cómo enviarlos de forma segura.",
      "Basado en documentación pública oficial; no afirma una reproducción práctica ni garantiza una solución."
    ],
    "faqs": [
      {
        "question": "¿Cambiar de región arregla un fallo de inicio de sesión?",
        "answer": "Las preguntas frecuentes oficiales distinguen el servidor de inicio de sesión de los servidores elegidos para el emparejamiento. Cambiar el nodo de partida no garantiza solucionar el acceso."
      },
      {
        "question": "¿Puedo descargar CapturePro.exe de otra web si no está?",
        "answer": "Evita las copias no oficiales. Informa al soporte de que falta en tu instalación legítima. Esta guía no garantiza una descarga independiente ni una ubicación idéntica en todas las tiendas."
      },
      {
        "question": "¿Por qué la prueba sale bien pero no puedo entrar en partida?",
        "answer": "Las condiciones pueden diferir entre la prueba y el intento fallido. Conserva las horas y resultados de ambos, junto con el error. Una prueba correcta no permite identificar por sí sola una restricción de cuenta o un fallo de ruta."
      }
    ],
    "sources": [
      {
        "label": "Marvel Rivals: guía oficial de análisis de red",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals: selección de servidores",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals: preguntas de lanzamiento y soporte",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals: noticias oficiales",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steam: requisitos e idiomas de Marvel Rivals",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "checkedAt": "2026-10-08",
    "related": [
      {
        "href": "/es/games/marvel-rivals/high-ping",
        "label": "Ping alto y retraso de red"
      },
      {
        "href": "/pc/wifi-connected-no-internet",
        "label": "Wi-Fi conectado sin acceso a internet (japonés)"
      },
      {
        "href": "/guide/verify-steam-files",
        "label": "Verificar archivos de Steam (japonés)"
      }
    ],
    "sourcePolicy": "Basado en documentación pública oficial; no afirma una reproducción práctica ni garantiza una solución."
  },
  {
    "locale": "es",
    "gameSlug": "marvel-rivals",
    "gameName": "Marvel Rivals",
    "slug": "high-ping",
    "title": "Marvel Rivals con ping alto o retraso de red: servidores y pruebas en PC",
    "shortTitle": "Ping alto y retraso de red",
    "description": "Compara los nodos de Marvel Rivals y utiliza Network Delay Test para investigar el ping alto en PC. Distingue una prueba breve de una captura cuando aparece el retraso.",
    "lead": "Para quienes pueden entrar en partidas, pero ven que el movimiento o los ataques se reflejan tarde. Registra las caídas de FPS por separado, sin asumir que todos los tirones son problemas de red.",
    "summary": "Compara el servidor seleccionado y su latencia; si procede, prueba un candidato con menos retraso. Si el problema persiste, utiliza Network Delay Test de CapturePro.exe con nodos habituales o regiones cercanas y anota cuándo aparece el síntoma.",
    "quickFacts": [
      {
        "label": "Prueba indicada",
        "value": "Network Delay Test"
      },
      {
        "label": "Ámbito",
        "value": "Windows PC / herramienta oficial de una instalación legítima"
      }
    ],
    "diagnosis": [
      {
        "symptom": "Distingue el retraso de red de los FPS bajos",
        "cause": "La palabra «lag» no basta para identificar un problema de red o de renderizado.",
        "stepId": "separate-lag"
      },
      {
        "symptom": "Compara los servidores disponibles",
        "cause": "La guía oficial permite seleccionar un servidor o un grupo.",
        "stepId": "compare-nodes"
      },
      {
        "symptom": "Registra el retraso con Network Delay Test",
        "cause": "Utiliza la herramienta oficial con nodos habituales o regiones cercanas.",
        "stepId": "test-delay"
      },
      {
        "symptom": "Compara los datos y consulta al soporte si hace falta",
        "cause": "Incluye las condiciones de cada medición.",
        "stepId": "review-delay"
      }
    ],
    "steps": [
      {
        "id": "separate-lag",
        "title": "Distingue el retraso de red de los FPS bajos",
        "summary": "La palabra «lag» no basta para identificar un problema de red o de renderizado.",
        "actions": [
          "Describe si las acciones llegan tarde o si toda la imagen pierde fluidez.",
          "Si hay datos disponibles, registra ping, FPS, nodo seleccionado y hora. Si no aparecen cifras, anota los síntomas.",
          "Revisa las noticias oficiales por si hay una incidencia relacionada. Si solo caen los FPS, continúa con la guía general de FPS bajos."
        ],
        "time": "Unos 2 min",
        "risk": "low",
        "guideLink": {
          "href": "/guide/low-fps",
          "label": "Guía general de FPS bajos (japonés)",
          "description": "Úsala si el problema es de renderizado, no de red."
        }
      },
      {
        "id": "compare-nodes",
        "title": "Compara los servidores disponibles",
        "summary": "La guía oficial permite seleccionar un servidor o un grupo.",
        "actions": [
          "Consulta los servidores disponibles y la latencia mostrada en el juego; anota la selección original.",
          "Compara primero un candidato de menor latencia. No supongas que una ciudad cercana garantiza una ruta mejor: comprueba las cifras y el comportamiento durante la partida.",
          "Registra los nodos, horas y síntomas antes y después del cambio para poder recuperar la selección original si no ayuda."
        ],
        "time": "Unos 2 min",
        "risk": "low",
        "note": "Elegir un nodo no garantiza ping bajo ni colas más cortas. Usa las opciones que muestre tu cliente actual."
      },
      {
        "id": "test-delay",
        "title": "Registra el retraso con Network Delay Test",
        "summary": "Utiliza la herramienta oficial con nodos habituales o regiones cercanas.",
        "actions": [
          "Abre CapturePro.exe en la instalación legítima del juego y selecciona Network Delay Test. Si falta, consulta al soporte en vez de descargar una copia no oficial.",
          "Elige nodos que uses normalmente o regiones cercanas. Para una comparación breve, espera unos 20 segundos y pulsa Stop manualmente.",
          "El editor también permite hacer la prueba mientras juegas. Para registrar el síntoma, pulsa Stop cuando notes un retraso importante y anota la hora, el nodo y lo ocurrido."
        ],
        "time": "Unos 20 s más la preparación",
        "risk": "low",
        "note": "Los 20 segundos son una referencia de medición, no un plazo de recuperación. No evites las advertencias de seguridad para ejecutar la herramienta."
      },
      {
        "id": "review-delay",
        "title": "Compara los datos y consulta al soporte si hace falta",
        "summary": "Incluye las condiciones de cada medición.",
        "actions": [
          "Compara las notas anteriores y posteriores al cambio de nodo y las del momento del retraso. Un solo resultado no demuestra un fallo de tu proveedor o del servidor del juego.",
          "Si mejora, conserva el nodo elegido y las condiciones. Si vuelve a ocurrir, añade hora, zona horaria y síntomas.",
          "Si continúa, accede a Marvel Rivals Support desde las preguntas frecuentes oficiales. Confirma cómo enviar el archivo tr_results_xxxxxxxx_xxxxxx.zip generado y no lo publiques en un chat abierto. Oculta datos personales en capturas y consulta antes de modificar registros."
        ],
        "time": "Unos 3 min",
        "risk": "low"
      }
    ],
    "avoid": [
      "No descargues CapturePro.exe desde anuncios, sitios espejo ni enlaces no oficiales.",
      "No desactives todo el antivirus o el cortafuegos para investigar la conexión.",
      "No incluyas contraseñas, códigos de verificación ni tokens en capturas o mensajes al soporte."
    ],
    "cautions": [
      "Los archivos de diagnóstico pueden contener datos de conexiones, del equipo o del entorno de red. No los publiques en chats abiertos. Accede al soporte desde la web oficial y confirma qué datos necesitan y cómo enviarlos de forma segura.",
      "Basado en documentación pública oficial; no afirma una reproducción práctica ni garantiza una solución."
    ],
    "faqs": [
      {
        "question": "¿Tokyo siempre es el nodo más rápido si juego desde Japón?",
        "answer": "Tokyo figura en la lista oficial, pero la mejor ruta depende de tu conexión. Compara la latencia mostrada en el cliente actual con el comportamiento real de la partida."
      },
      {
        "question": "¿Network Delay Test mejora los FPS?",
        "answer": "El editor lo presenta como una herramienta de diagnóstico de red, no como una función para aumentar los FPS. Si el ping es estable pero los FPS son bajos, investiga la carga de renderizado por separado."
      },
      {
        "question": "¿Conviene seleccionar todos los servidores?",
        "answer": "La guía oficial permite uno o varios, pero no afirma que seleccionarlos todos sea siempre lo mejor. Compara la latencia de los candidatos y los síntomas antes y después del cambio."
      }
    ],
    "sources": [
      {
        "label": "Marvel Rivals: guía oficial de análisis de red",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals: selección de servidores",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals: preguntas de lanzamiento y soporte",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals: noticias oficiales",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steam: requisitos e idiomas de Marvel Rivals",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "checkedAt": "2026-10-08",
    "related": [
      {
        "href": "/es/games/marvel-rivals/login-error",
        "label": "No inicia sesión o no entra en partida"
      },
      {
        "href": "/pc/wifi-connected-no-internet",
        "label": "Wi-Fi conectado sin acceso a internet (japonés)"
      },
      {
        "href": "/guide/low-fps",
        "label": "Guía general de FPS bajos (japonés)"
      }
    ],
    "sourcePolicy": "Basado en documentación pública oficial; no afirma una reproducción práctica ni garantiza una solución."
  }
];
