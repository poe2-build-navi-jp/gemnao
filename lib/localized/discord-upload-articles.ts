import type { LocalizedArticle } from './types';

// Discord deliberately reuses the localized article data model, not /games URLs.
// The Japanese renderer generates cause-1 ... cause-6 from the cause array.
const sourceUrls = [
  'https://support.discord.com/hc/en-us/articles/25444343291031-File-Attachments-FAQ',
  'https://support.discord.com/hc/en-us/articles/211866427-How-do-I-upload-images-and-GIFs',
  'https://support.discord.com/hc/en-us/articles/115000435108-What-are-Nitro-Nitro-Basic',
  'https://docs.discord.com/developers/topics/permissions',
  'https://discord.com/community/permissions-on-discord-discord',
  'https://support.discord.com/hc/en-us/articles/1500005466681-File-Preview',
  'https://support.discord.com/hc/en-us/articles/115000068672-Safer-Messaging-on-Discord',
  'https://support.discord.com/hc/en-us/articles/31623498041623-Discord-Troubleshooting-Guide',
  'https://discordstatus.com/',
  'https://support.discord.com/hc/en-us/requests/new',
];
const sources = (labels: string[]) =>
  sourceUrls.map((url, index) => ({ url, label: labels[index] }));

export const localizedDiscordUploadArticles: LocalizedArticle[] = [
  {
    locale: 'en',
    gameSlug: 'discord',
    gameName: 'Discord',
    slug: 'upload-failed',
    title:
      'Discord Image or File Upload Failed: Check Size, Permissions and Previews',
    shortTitle: 'Images or files will not upload',
    description:
      'Diagnose Discord upload failures using the current account limit, channel permissions, a harmless control file and an app/browser comparison. Separate missing previews from failed uploads and protect private screenshots.',
    lead: 'For desktop, browser, Android and iOS: a size error after choosing a file, an upload that stalls, images that will not send, or a sent attachment without a preview.',
    summary:
      'First distinguish a failed send from an attachment that was sent but has no preview. For size errors, use the limit currently shown for your account and channel. For failures in one channel, check attachment permissions. If a tiny harmless image also fails, compare the app and browser under the same conditions. Respect safety blocks instead of trying to get around them.',
    sourcePolicy:
      'Based on official sources checked on October 3, 2026. The comparison sequence is editorial troubleshooting guidance, not a claim of hands-on testing across devices or accounts. Official limit descriptions are inconsistent and experiments are documented; use your current in-app account/channel limit. All linked sources below are in English.',
    related: [
      {
        href: '/discord/loading-stuck',
        label: 'Discord stuck loading (Japanese)',
      },
      {
        href: '/discord/not-opening',
        label: 'Discord will not open (Japanese)',
      },
    ],
    quickFacts: [
      {
        label: 'Start here',
        value:
          'Record the exact error and whether the attachment exists in message history.',
      },
      {
        label: 'Size check',
        value:
          'Compare the local source file with the current on-screen limit, before automatic compression.',
      },
      {
        label: 'Controlled test',
        value:
          'One harmless JPEG under 100 KB, only in the same private channel where testing is permitted. This is a test size, not an upload limit.',
      },
      {
        label: 'Stop condition',
        value:
          'A content or malware warning means stop sending that file and follow the warning.',
      },
    ],
    diagnosis: [
      {
        symptom: 'A file-size error appears as soon as you select the file',
        cause:
          'Compare the local source size with the limit shown for this account and channel.',
        stepId: 'cause-2',
      },
      {
        symptom:
          'Text sends, but even a tiny image cannot be attached in this channel',
        cause:
          'Text permission does not establish attachment permission. Ask an administrator to check the effective channel permissions.',
        stepId: 'cause-3',
      },
      {
        symptom:
          'Text also fails, or the composer/attachment action is unavailable',
        cause:
          'Check read-only or posting restrictions, including thread-specific send permission.',
        stepId: 'cause-3',
      },
      {
        symptom: 'The control image sends, but the original file fails',
        cause:
          'Check size, then whether the original opens locally. This points toward a file-specific issue, not proven corruption.',
        stepId: 'cause-4',
      },
      {
        symptom:
          'The attachment exists and your own file downloads, but there is no preview',
        cause:
          'The upload succeeded. Check format and display settings rather than repeatedly resending.',
        stepId: 'cause-4',
      },
      {
        symptom: 'Even the tiny control image stalls during upload',
        cause:
          'Compare the same file, account and permitted channel in the app and browser.',
        stepId: 'cause-5',
      },
      {
        symptom: 'A sensitive-content, safety or malware warning appears',
        cause:
          'Stop retrying and record the warning. Do not change extensions or routes to bypass it.',
        stepId: 'cause-6',
      },
    ],
    steps: [
      {
        id: 'cause-1',
        title: 'Locate the failure and prepare a safe control file',
        summary:
          'File selection, a failed send and a missing preview are different stages. Record what happened without repeatedly posting private images or logs.',
        time: '2–3 minutes',
        risk: 'low',
        actions: [
          'Record the error text, time and time zone, device, file type and file size. Go directly to Step 6 for a safety warning or Step 2 for a size error.',
          'If the attachment remains in message history and you can download your own file, treat it as sent and use Step 4. A pending or failed-send indicator instead calls for upload troubleshooting.',
          'Create a small solid-color JPEG locally in an image editor, with no personal information in the image or filename. Under 100 KB is a suggested control size, not a Discord limit.',
          'Only if the original destination is private and test posts are permitted, send that one file once using the same account and channel. Success points to Steps 2 and 4 for the original file; failure points to Steps 3 and 5.',
        ],
        note: 'Do not post tests in public servers or restricted channels. If testing in the affected channel is not allowed, ask an administrator for a private test location; success elsewhere does not prove permission in the original channel. Never use screenshots, private conversations or game logs as control files.',
      },
      {
        id: 'cause-2',
        title: 'Compare the current limit with the file before compression',
        summary:
          'As checked on October 3, 2026, the September 30 attachment FAQ lists free 20 MB, Basic 50 MB and Nitro up to 1 GB. The June 11 image guide still says 10 MB. Experiments are explicitly documented, so these are dated descriptions rather than one universal cap.',
        time: '2–5 minutes',
        risk: 'low',
        actions: [
          'Read the limit displayed in the upload or error screen for this account and destination channel. If it differs from an article, use the current screen instead of repeatedly trying against an assumed number.',
          'Read the source file size in your device’s file information or properties. The attachment FAQ describes a pre-compression check, so mobile quality settings or automatic compression are not a guaranteed way past a size error.',
          'If it is too large, preserve the original and edit a copy locally: lower image dimensions/quality or trim unnecessary video. Check that the saved copy is comfortably below the displayed limit.',
          'Confirm the content and destination are appropriate, then try the copy once. If the same error persists well below the limit, keep the error text and use Steps 5 and 6. Buying Nitro is not a prerequisite for diagnosis.',
        ],
        note: 'The September 29 Nitro guide also lists Basic 50 MB and Nitro up to 1 GB, but retains an older free-tier explanation mentioning 10 MB. Later changes remain possible. Do not upload private images or logs to online compressors/converters, and do not overwrite the original.',
      },
      {
        id: 'cause-3',
        title: 'Check effective attachment permission in this channel',
        summary:
          'Sending text and attaching files are separate permissions. Ask an administrator to check what actually applies in this channel, rather than relying only on a server role.',
        time: '2–3 minutes; administrator response may take longer',
        risk: 'low',
        actions: [
          'Use existing posts and the composer’s notice to establish whether ordinary text can be sent. An unavailable composer is not a file-size problem.',
          'If text works but the small control image does not, ask an administrator to check the effective Attach Files permission for this channel.',
          'For a normal channel, also check message-sending permission; for a thread, check permission to send messages in threads. Mention any channel/member overrides and visible posting restriction.',
          'Only after an administrator authorizes the test and fixes any permission problem, retry the same small image from Step 1. If attachments are intentionally disallowed, respect that rule and stop here.',
        ],
        note: 'Do not bypass server restrictions with another account, a DM or an external service. Embed Links controls link previews and is separate from Attach Files; changing it does not remove an attachment restriction.',
      },
      {
        id: 'cause-4',
        title: 'Separate an original-file problem from a preview problem',
        summary:
          'A downloadable attachment without an inline picture is different from a failed upload. A file being attachable does not guarantee that Discord can display or play it inline.',
        time: '3–5 minutes',
        risk: 'low',
        actions: [
          'Open the original locally in a suitable app. If it cannot open, is empty or is still being saved, finish saving it or obtain a valid copy. Renaming an extension does not convert the contents.',
          'If the original image opens but only that image fails, preserve it and export a separate JPEG locally. Recheck size and whether the content is safe to share, then compare in the same permitted location.',
          'If message history shows an attachment filename and download action, check whether your own harmless file downloads. A PDF can be attached without an image-style preview; text previews also have separate rules. No preview alone does not establish a failed send.',
          'If your own attachment downloads but images are not displayed, inspect image/preview options under the user settings’ Chat section. Record any value before changing it and restore it if the change does not help. Leave safety filters and channel permissions alone.',
        ],
        note: 'Do not open an unknown sender’s file as a test. A video extension alone does not establish playback support. A successful control image does not prove the original is corrupt or that its format is unsupported.',
      },
      {
        id: 'cause-5',
        title: 'Compare the app and browser without changing other conditions',
        summary:
          'Use this after a tiny control file fails and no size or posting-permission problem was found. Changing the destination and file as well would make the result hard to interpret.',
        time: '3–5 minutes',
        risk: 'low',
        actions: [
          'Check Discord Status for an ongoing incident matching the time of the failure. If relevant, stop repeated sends and retry the same small image after recovery. An empty incident list does not prove your device is at fault.',
          'On a PC, compare the official web client at discord.com/app with the app on that same device. Use the same account, private permitted channel and control image, with one attempt in each. Verify the official domain if sign-in is required.',
          'If only one client works, fully close and reopen the failing one, apply normal official updates and retest once. Warn call participants before closing Discord. The working client can be used temporarily within the channel’s rules.',
          'If both fail, check whether ordinary websites load. If needed, compare on another trusted network you are allowed to use, keeping the other conditions fixed. Comparing a mobile device with a PC also changes the device, so it cannot isolate the app alone.',
        ],
        note: 'Do not use a different network or VPN to evade workplace or school restrictions. Leave antivirus and firewall protection enabled and ask the administrator. A full cache wipe or reinstall is not needed before these results are available.',
      },
      {
        id: 'cause-6',
        title:
          'Respect safety warnings and send only necessary support details',
        summary:
          'A content block is different from a connection failure. If you suspect a false positive, follow the displayed guidance instead of repeatedly modifying or redistributing the blocked file.',
        time: '5 minutes to prepare a report',
        risk: 'low',
        actions: [
          'Stop sending a file flagged for inappropriate content or safety. Do not crop it, rename its extension, encrypt it in a ZIP or use another account to evade inspection.',
          'Do not run or resend a file flagged as malware. Check with the source or administrator without adding a security exclusion. Ask the server administrator about permissions, or official Discord Support about upload problems or suspected false positives.',
          'Prepare the exact error, time and time zone, OS and app/browser versions, file type and size, on-screen limit and same-control-file comparison results. Do not attach the original file by default.',
          'If a screenshot is needed, keep the original locally and edit a copy on your device. Cover tokens, authentication codes, email addresses, usernames and private conversations with opaque redaction, then reopen the exported image to check for anything left visible.',
        ],
        note: 'Use the official support form in Sources. Never send sign-in QR codes, passwords or tokens. Do not post private logs or original attachments to public channels or online converters; give the official private support channel only what it needs.',
      },
    ],
    avoid: [
      'Do not turn dated 10 MB, 20 MB or 500 MB figures into a universal limit; use the current account/channel display.',
      'Do not overwrite originals or send private files to online compression/conversion tools.',
      'Do not bypass attachment restrictions or safety blocks using DMs, other accounts, extension changes or encrypted archives.',
      'Do not disable security software, evade managed-network rules, or start with a full cache wipe/reinstall.',
    ],
    cautions: [
      'Control tests belong only in the same private channel where posting and testing are permitted. If another location is needed, its success does not establish permission in the original channel.',
      'Do not test with private screenshots, conversations or logs, and do not open unknown attachments.',
      'Before sharing a screenshot, preserve the original, redact a local copy, and inspect the exported result for tokens, codes, email addresses, usernames and private chat.',
      'If unresolved, report the error, time zone, versions, type/size, current limit and comparison results through official private support. Do not include the original file or raw logs automatically.',
    ],
    faqs: [
      {
        question: 'Is the free limit 10 MB or 20 MB? Is Nitro still 500 MB?',
        answer:
          'The attachment FAQ checked on October 3, 2026 was updated September 30 and lists free 20 MB, Basic 50 MB and Nitro up to 1 GB. The June 11 image guide still mentions 10 MB. These official descriptions conflict and experiments are documented. Do not rely on older 10 MB or 500 MB figures as fixed limits: use the current display for your account and channel.',
      },
      {
        question:
          'Why does mobile still show a size error after I lower upload quality?',
        answer:
          'The attachment FAQ describes checking size before compression. Preserve the original, export a smaller copy locally and check that copy’s size rather than relying on Discord’s quality setting. Private images or logs do not need to go through an online compressor.',
      },
      {
        question:
          'Text sends but images do not. Does that prove a permission problem?',
        answer:
          'No, but it is a possibility: text sending and file attachment are separate permissions. If a tiny harmless image also fails in the same private permitted channel, ask an administrator to check effective Attach Files permission, then compare clients.',
      },
      {
        question: 'Does a missing PDF or video preview mean the upload failed?',
        answer:
          'No. If the attachment exists in history and your own safe file downloads, separate delivery from preview behavior. Format, video encoding and display settings can affect inline viewing or playback. Renaming a file extension does not convert it.',
      },
      {
        question: 'If the tiny image works, is the original file corrupt?',
        answer:
          'That result alone cannot tell you. It narrows attention to size, save state and format. Check the current limit and whether the file opens locally; for an image, preserve the original and compare a separately exported JPEG. Do not modify and resend an original that triggered a safety warning.',
      },
      {
        question:
          'Should I disable a filter, ZIP the file or use another account?',
        answer:
          'Do not use these methods to evade a safety block or server attachment rule. Follow the warning, ask the administrator about permissions, and use official support for suspected false positives. Do not run or redistribute a malware-flagged file.',
      },
      {
        question:
          'Can I send my full game log or Discord screenshot to support?',
        answer:
          'Start with the error, time, versions, file type/size and test results. If a screenshot is necessary, edit a local copy, cover tokens, codes, email addresses, usernames and private conversations, then inspect the exported image. Keep the original private and share only relevant details through official private support.',
      },
    ],
    sources: sources([
      'Discord: File Attachments FAQ (updated September 30, 2026; sizes, pre-compression checks and display)',
      'Discord: Uploading images and GIFs (updated June 11, 2026; older limit remains)',
      'Discord: Nitro and Nitro Basic (updated September 29, 2026; some older text remains)',
      'Discord developer documentation: message, attachment and thread permissions',
      'Discord: Permissions overview (attachments versus link previews)',
      'Discord: File Preview (text previews)',
      'Discord: Safer Messaging (image filters)',
      'Discord: Troubleshooting and reporting bugs',
      'Discord Status: official service incidents',
      'Discord: official support request form',
    ]),
    checkedAt: '2026-10-03',
  },
  {
    locale: 'zh',
    gameSlug: 'discord',
    gameName: 'Discord',
    slug: 'upload-failed',
    title: 'Discord 图片或文件上传失败：排查大小限制、频道权限和预览问题',
    shortTitle: '图片或文件无法上传',
    description:
      '根据 Discord 当前显示的上传限制、频道权限、无敏感信息的小文件测试及客户端与浏览器对比，定位图片和文件发送失败。区分预览缺失与上传失败，并保护截图中的隐私。',
    lead: '适用于桌面客户端、浏览器、Android 和 iOS：选择文件后提示超限、上传卡住、图片发不出，或附件已发送但没有预览。',
    summary:
      '先区分“发送失败”和“已发送但没有预览”。容量报错以当前账号和频道显示的限制为准；仅某个频道失败时检查附件权限。无敏感信息的小图片也失败，再保持条件一致，对比客户端和浏览器。遇到安全拦截应遵循提示，不要尝试绕过。',
    sourcePolicy:
      '本文依据截至 2026 年 10 月 3 日核实的官方资料编写。对比顺序是编辑整理的排查建议，不代表已在所有设备或账号上实测。官方文档中的容量说明存在不一致，也注明了实验性调整；请以当前账号和频道的界面提示为准。下列来源均为英文官方页面。',
    related: [
      { href: '/discord/loading-stuck', label: 'Discord 一直加载（日语）' },
      { href: '/discord/not-opening', label: 'Discord 无法打开（日语）' },
    ],
    quickFacts: [
      {
        label: '先确认',
        value: '记录完整报错，并查看消息记录中是否已出现附件。',
      },
      {
        label: '容量判断',
        value: '将本地原文件大小与当前界面上限比较，不依赖自动压缩后的大小。',
      },
      {
        label: '对照测试',
        value:
          '使用一张小于 100KB、无个人信息的 JPEG，仅在原来的私密且允许测试的频道发送一次。这是测试文件大小，不是上传上限。',
      },
      {
        label: '何时停止',
        value: '出现内容或恶意软件警告时，停止发送该文件并遵循提示。',
      },
    ],
    diagnosis: [
      {
        symptom: '刚选择文件就提示大小超限',
        cause: '比较本地原文件大小和该账号、频道当前显示的限制。',
        stepId: 'cause-2',
      },
      {
        symptom: '文字能发送，但同一频道连小图片也无法附加',
        cause: '能发文字不代表能附加文件。请管理员核实该频道的实际生效权限。',
        stepId: 'cause-3',
      },
      {
        symptom: '文字也发不出，或输入框、附件操作不可用',
        cause:
          '检查只读或发言限制；在帖子或讨论串中还要核实相应的消息发送权限。',
        stepId: 'cause-3',
      },
      {
        symptom: '测试小图片能发，只有原文件失败',
        cause:
          '先查大小，再看原文件能否在本地打开。这说明应关注文件本身，但不能直接断定文件损坏。',
        stepId: 'cause-4',
      },
      {
        symptom: '附件已出现在记录中，自己的文件能下载，但没有预览',
        cause: '上传已完成。检查格式与显示设置，不要反复重发。',
        stepId: 'cause-4',
      },
      {
        symptom: '连测试小图片也在上传途中卡住',
        cause: '保持账号、获准使用的频道和文件一致，对比客户端与浏览器。',
        stepId: 'cause-5',
      },
      {
        symptom: '出现敏感内容、安全性或恶意软件警告',
        cause: '停止重试，记录警告。不要改扩展名或换发送途径来绕过拦截。',
        stepId: 'cause-6',
      },
    ],
    steps: [
      {
        id: 'cause-1',
        title: '确认失败阶段，准备安全的对照文件',
        summary:
          '选择文件、消息发送失败和预览缺失是不同阶段。先记录情况，不要反复发送私密图片或日志。',
        time: '2–3 分钟',
        risk: 'low',
        actions: [
          '记录报错原文、发生时间和时区、设备、文件类型与大小。若有安全警告，直接转到步骤 6；若提示容量超限，转到步骤 2。',
          '如果消息记录中仍有附件，而且可以下载自己制作的该文件，就按“已发送”处理，转到步骤 4。若仍显示等待发送或发送失败，则继续排查上传。',
          '在本地图片编辑器中新建一张小尺寸纯色 JPEG，图片和文件名都不要包含个人信息。建议控制在 100KB 以下，仅用于测试，并非 Discord 的上传上限。',
          '仅当原来的发送位置是私密频道且允许测试发帖时，使用同一账号在同一频道发送这个文件一次。成功则按步骤 2、4 检查原文件；失败则查看步骤 3、5。',
        ],
        note: '不要在公开服务器或限制发帖的位置测试。原频道不允许测试时，请管理员安排私密测试位置；在其他频道成功不能证明原频道具有附件权限。不要把截图、私人聊天或游戏日志当作测试素材。',
      },
      {
        id: 'cause-2',
        title: '比较当前上限与压缩前的文件大小',
        summary:
          '截至 2026 年 10 月 3 日，9 月 30 日更新的附件 FAQ 标注免费账号 20MB、Basic 50MB、Nitro 最高 1GB；6 月 11 日更新的图片指南仍写着 10MB。官方也注明正在测试不同上限，所以这些是有日期的说明，不能当作所有账号永远一致的限制。',
        time: '2–5 分钟',
        risk: 'low',
        actions: [
          '查看当前账号向该频道上传时，上传界面或报错显示的上限。如果与文章数字不同，以当前界面为准，不要凭假定上限反复重试。',
          '在设备的文件信息或属性中查看原文件大小。附件 FAQ 说明会在压缩前检查大小，因此手机画质设置或自动压缩不能保证解决超限问题。',
          '超过上限时保留原文件，用本地编辑器处理副本：缩小图片尺寸、降低画质，或剪去视频不需要的部分。保存后确认副本大小明显低于界面上限。',
          '重新确认内容适合分享、接收位置正确，再用副本试一次。已明显低于上限却仍报同样错误时，保留报错并转到步骤 5、6。无需先购买 Nitro 才能排查。',
        ],
        note: '9 月 29 日更新的 Nitro 说明也列出 Basic 50MB、Nitro 最高 1GB，但免费档位部分仍保留旧的 10MB 说明。核实日期之后还可能变化。不要将私密图片或日志上传到在线压缩、转换网站，也不要覆盖原文件。',
      },
      {
        id: 'cause-3',
        title: '核实同一频道实际生效的附件权限',
        summary:
          '发送文字和附加文件是不同权限。请管理员检查该频道实际应用的规则，而不只是查看服务器角色。',
        time: '2–3 分钟；等待管理员回复的时间另计',
        risk: 'low',
        actions: [
          '根据已有消息和输入框提示，确认普通文字是否能发送。输入框不可用不属于文件过大的问题。',
          '文字能发但小测试图片也失败时，请管理员检查该频道实际生效的 Attach Files（附加文件）权限。',
          '普通频道还要检查消息发送权限；讨论串则要检查在讨论串内发送消息的权限。同时说明频道或成员级别的覆盖设置，以及界面显示的发言限制。',
          '只有管理员处理好权限问题并允许测试后，才用步骤 1 的同一张小图片再试。如果禁止附件是频道的既定规则，就遵守规则并停止。',
        ],
        note: '不要通过其他账号、私信或外部服务绕过服务器限制。Embed Links（嵌入链接）控制的是链接预览，与 Attach Files 不同，修改它不会解除附件禁止。',
      },
      {
        id: 'cause-4',
        title: '区分原文件问题和单纯的预览问题',
        summary:
          '已有可下载附件但不显示图片，与上传失败不同。文件能被附加，不代表 Discord 一定能在聊天中显示或播放它。',
        time: '3–5 分钟',
        risk: 'low',
        actions: [
          '用本地适用的应用打开原文件。如果无法打开、大小为零或尚未保存完成，先完成保存或取得有效副本。仅修改扩展名不会转换文件内容。',
          '原图片能打开、但只有它上传失败时，保留原件，在本地另存或导出为一个 JPEG 副本。重新检查大小和分享内容，再在同一获准位置比较。',
          '消息记录中有附件文件名和下载操作时，确认自己的无敏感信息测试文件是否能下载。PDF 可以作为附件发送而不显示图片式预览；文本预览也有单独规则。缺少预览本身不能说明消息未送达。',
          '自己的附件能下载、但图片不显示时，检查用户设置中聊天部分的图片和预览选项。修改前记录原值，无效时恢复。不要改动安全过滤器或频道权限。',
        ],
        note: '不要通过打开陌生人发来的文件进行测试。视频扩展名本身不能证明能否播放；小图片上传成功，也不能证明原文件已损坏或其格式不受支持。',
      },
      {
        id: 'cause-5',
        title: '保持其他条件一致，对比客户端与浏览器',
        summary:
          '小对照文件也失败、且尚未发现容量或发帖权限问题时，再进行此项测试。同时更换文件和接收位置，会让结果难以解释。',
        time: '3–5 分钟',
        risk: 'low',
        actions: [
          '查看 Discord Status 是否有与故障时间相符的进行中事件。若有关联，停止连续发送，待恢复后用同一小图片再试。没有事件公告也不能证明一定是设备故障。',
          '在 PC 上，用同一设备的官方网页版 discord.com/app 与客户端比较。账号、允许测试的私密频道、小图片均保持相同，每侧试一次。需要登录时先核对官方域名。',
          '只有一侧成功时，彻底关闭再打开失败的一侧，安装正常的官方更新后再试一次。关闭 Discord 会结束通话，应先通知对方。可暂时在频道规则允许范围内使用正常的一侧。',
          '两侧都失败时，检查普通网站能否访问。必要时在获准使用的另一条可信网络上、保持其他条件不变进行比较。从手机改用 PC 同时改变了设备，不能仅凭该结果断定是手机应用的问题。',
        ],
        note: '不要利用其他网络或 VPN 绕过学校、工作单位的限制。保持杀毒软件和防火墙开启，并咨询管理员。取得这些结果前，无需先清空全部缓存或重装。',
      },
      {
        id: 'cause-6',
        title: '遵循安全警告，仅提供必要信息求助',
        summary:
          '内容拦截不同于网络错误。即使怀疑误判，也应按提示处理，不要持续修改或转发已被拦截的文件。',
        time: '约 5 分钟整理资料',
        risk: 'low',
        actions: [
          '出现不适当内容或安全警告时停止发送该文件。不要裁剪图片、更改扩展名、放入加密 ZIP 或换账号来避开检查。',
          '被提示为恶意软件的文件不要运行或重发。向来源方或管理员核实，不要自行添加安全排除项。权限问题找服务器管理员；上传异常或疑似误判可咨询 Discord 官方支持。',
          '整理完整报错、时间和时区、系统及客户端／浏览器版本、文件类型与大小、界面上限，以及相同小文件的对比结果。不要默认附上原文件。',
          '需要截图说明时，将原图留在本地，只编辑副本。用不透明遮盖隐藏令牌、验证码、邮箱地址、用户名和私人聊天；导出后重新打开图片，检查是否还有遗漏。',
        ],
        note: '请使用来源列表中的官方支持表单。不要发送登录二维码、密码或令牌。私密日志和原附件不要贴到公开频道或在线转换网站，只向官方私密支持渠道提供必要部分。',
      },
    ],
    avoid: [
      '不要把有日期的 10MB、20MB 或 500MB 数字当作统一永久上限，应以当前账号和频道提示为准。',
      '不要覆盖原件，也不要把私密文件交给在线压缩或转换工具。',
      '不要借助私信、其他账号、改扩展名或加密压缩包绕过附件规则和安全拦截。',
      '不要关闭安全软件、绕过受管理网络的规则，或一开始就清空缓存、重装。',
    ],
    cautions: [
      '对照测试仅限原来的私密且允许发帖、允许测试的频道。换到其他位置成功，不能证明原频道有权限。',
      '测试不要使用私密截图、聊天或日志，也不要打开来历不明的附件。',
      '分享截图前保留原图，在本地编辑副本，并检查导出结果中是否残留令牌、验证码、邮箱、用户名和私人聊天。',
      '仍未解决时，通过官方私密支持渠道提交报错、时区、版本、类型与大小、当前上限和对比结果，不要自动附上原文件或完整日志。',
    ],
    faqs: [
      {
        question: '免费上限到底是 10MB 还是 20MB？Nitro 还是 500MB 吗？',
        answer:
          '2026 年 10 月 3 日核实的附件 FAQ 更新于 9 月 30 日，标注免费 20MB、Basic 50MB、Nitro 最高 1GB；6 月 11 日的图片指南仍写着 10MB。官方说明并不一致，也注明存在实验。不要把旧的 10MB 或 500MB 当作固定限制，以当前账号和频道显示为准。',
      },
      {
        question: '手机已经调低上传画质，为什么还提示文件过大？',
        answer:
          '附件 FAQ 说明会在压缩前检查大小。应保留原件，在本地导出更小的副本并检查其大小，不要只依赖 Discord 的画质设置。私密图片和日志无需经过在线压缩网站。',
      },
      {
        question: '文字能发、图片不能发，就一定是权限问题吗？',
        answer:
          '不能确定，但确实可能。文字发送与附件是独立权限。如果同一获准使用的私密频道连无敏感信息的小图片也失败，请管理员核实实际生效的 Attach Files 权限，再比较客户端。',
      },
      {
        question: 'PDF 或视频没有预览，是不是上传失败了？',
        answer:
          '不一定。消息记录中有附件，且自己的安全文件能下载时，要将发送结果与预览表现分开判断。文件格式、视频编码和显示设置都可能影响聊天内的显示或播放。改扩展名并不等于转换格式。',
      },
      {
        question: '小图片可以上传，是不是说明原文件坏了？',
        answer:
          '仅凭这一结果无法判断。它只是提示应关注大小、保存状态和格式。检查当前上限及文件能否在本地打开；图片可保留原件后另导出 JPEG 比较。若原文件触发安全警告，不要修改后重发。',
      },
      {
        question: '关闭过滤器、压成 ZIP 或换账号能解决吗？',
        answer:
          '不要用这些方法绕过安全拦截或服务器附件规则。遵循警告，权限问题找管理员，疑似误判找官方支持。被提示为恶意软件的文件不要运行或再次传播。',
      },
      {
        question: '可以把完整游戏日志或 Discord 截图直接发给支持人员吗？',
        answer:
          '先尝试用报错、时间、版本、文件类型与大小及测试结果说明。确需截图时，在本地编辑副本，遮住令牌、验证码、邮箱、用户名和私人聊天，并检查导出图片。原件不要公开，只经官方私密支持渠道提供相关部分。',
      },
    ],
    sources: sources([
      'Discord 官方：附件 FAQ（2026 年 9 月 30 日更新；大小、压缩前检查与显示）',
      'Discord 官方：上传图片和 GIF（2026 年 6 月 11 日更新；仍含旧上限）',
      'Discord 官方：Nitro 与 Nitro Basic（2026 年 9 月 29 日更新；仍含部分旧说明）',
      'Discord 官方开发者文档：消息、附件与讨论串权限',
      'Discord 官方：权限概览（附件与链接预览的区别）',
      'Discord 官方：File Preview（文本预览）',
      'Discord 官方：安全消息功能（图片过滤器）',
      'Discord 官方：故障排查与问题报告',
      'Discord Status：官方服务故障信息',
      'Discord 官方支持申请表单',
    ]),
    checkedAt: '2026-10-03',
  },
  {
    locale: 'es',
    gameSlug: 'discord',
    gameName: 'Discord',
    slug: 'upload-failed',
    title:
      'Discord no sube imágenes o archivos: tamaño, permisos y vistas previas',
    shortTitle: 'No se pueden subir imágenes o archivos',
    description:
      'Identifica los fallos de carga de Discord con el límite actual de tu cuenta, los permisos del canal, un archivo de prueba inocuo y una comparación entre app y navegador. Distingue una vista previa ausente de un envío fallido y protege tus capturas.',
    lead: 'Para la app de escritorio, navegador, Android e iOS: error de tamaño al elegir un archivo, carga detenida, imágenes que no se envían o adjuntos enviados sin vista previa.',
    summary:
      'Primero distingue un envío fallido de un adjunto enviado sin vista previa. Si hay un error de tamaño, usa el límite que aparece actualmente para tu cuenta y canal. Si solo falla un canal, revisa el permiso para adjuntar archivos. Si también falla una imagen pequeña e inocua, compara app y navegador sin cambiar las demás condiciones. Respeta los bloqueos de seguridad.',
    sourcePolicy:
      'Guía basada en fuentes oficiales comprobadas el 3 de octubre de 2026. El orden de las comparaciones es una propuesta editorial de diagnóstico, no una afirmación de pruebas prácticas en todos los dispositivos o cuentas. Las cifras oficiales no coinciden entre documentos y se mencionan experimentos; manda el límite actual de tu cuenta y canal. Las fuentes enlazadas están en inglés.',
    related: [
      {
        href: '/discord/loading-stuck',
        label: 'Discord se queda cargando (japonés)',
      },
      { href: '/discord/not-opening', label: 'Discord no se abre (japonés)' },
    ],
    quickFacts: [
      {
        label: 'Primera comprobación',
        value:
          'Anota el error exacto y si el adjunto aparece en el historial de mensajes.',
      },
      {
        label: 'Tamaño',
        value:
          'Compara el archivo original local con el límite actual en pantalla, antes de la compresión automática.',
      },
      {
        label: 'Prueba controlada',
        value:
          'Un JPEG inocuo de menos de 100 KB, solo en el mismo canal privado donde se permita probar. Es un tamaño de prueba, no el límite de Discord.',
      },
      {
        label: 'Cuándo parar',
        value:
          'Una advertencia de contenido o malware exige dejar de enviar ese archivo y seguir sus indicaciones.',
      },
    ],
    diagnosis: [
      {
        symptom: 'El error de tamaño aparece al seleccionar el archivo',
        cause:
          'Compara el tamaño original local con el límite mostrado para esta cuenta y canal.',
        stepId: 'cause-2',
      },
      {
        symptom:
          'Puedes enviar texto, pero ni una imagen pequeña se adjunta en ese canal',
        cause:
          'Poder escribir no demuestra permiso para adjuntar. Pide a un administrador que revise los permisos efectivos del canal.',
        stepId: 'cause-3',
      },
      {
        symptom:
          'Tampoco puedes enviar texto, o no está disponible el cuadro de mensaje o de adjuntos',
        cause:
          'Comprueba las restricciones de publicación o solo lectura; los hilos tienen su propio permiso de envío.',
        stepId: 'cause-3',
      },
      {
        symptom: 'La imagen de prueba se envía, pero el archivo original falla',
        cause:
          'Revisa primero su tamaño y después si se abre localmente. Apunta al archivo, pero no demuestra que esté dañado.',
        stepId: 'cause-4',
      },
      {
        symptom:
          'El adjunto existe y puedes descargar tu archivo, pero no hay vista previa',
        cause:
          'La carga terminó. Revisa formato y opciones de visualización, sin reenviar repetidamente.',
        stepId: 'cause-4',
      },
      {
        symptom: 'Incluso la imagen pequeña de prueba se queda subiendo',
        cause:
          'Compara el mismo archivo, cuenta y canal autorizado en la app y el navegador.',
        stepId: 'cause-5',
      },
      {
        symptom:
          'Aparece una advertencia de contenido sensible, seguridad o malware',
        cause:
          'Deja de reintentar y anota la advertencia. No cambies la extensión ni la vía de envío para eludirla.',
        stepId: 'cause-6',
      },
    ],
    steps: [
      {
        id: 'cause-1',
        title: 'Localiza el fallo y prepara un archivo de control seguro',
        summary:
          'Seleccionar un archivo, fallar al enviarlo y no mostrar su vista previa son etapas diferentes. Registra lo ocurrido sin publicar repetidamente imágenes privadas o registros.',
        time: '2–3 minutos',
        risk: 'low',
        actions: [
          'Anota el error, la hora y zona horaria, el dispositivo, el tipo de archivo y su tamaño. Ve directamente al paso 6 si hay una advertencia de seguridad, o al paso 2 si se supera el tamaño.',
          'Si el adjunto sigue en el historial y puedes descargar ese archivo que tú creaste, considéralo enviado y ve al paso 4. Si aparece como pendiente o fallido, continúa con el diagnóstico de carga.',
          'Crea localmente un JPEG pequeño de un solo color con un editor de imágenes. No incluyas datos personales en la imagen ni en el nombre. Menos de 100 KB es una sugerencia para la prueba, no un límite de Discord.',
          'Solo si el destino original es privado y permite publicaciones de prueba, envía ese único archivo una vez con la misma cuenta y en el mismo canal. Si funciona, revisa el original con los pasos 2 y 4; si falla, usa los pasos 3 y 5.',
        ],
        note: 'No hagas pruebas en servidores públicos ni en canales restringidos. Si no puedes probar en el canal afectado, pide un espacio privado autorizado a un administrador; funcionar en otro canal no demuestra que tengas permiso en el original. No uses capturas, conversaciones privadas ni registros del juego como archivos de control.',
      },
      {
        id: 'cause-2',
        title: 'Compara el límite actual con el tamaño antes de comprimir',
        summary:
          'La comprobación del 3 de octubre de 2026 encontró que el FAQ de adjuntos del 30 de septiembre indica 20 MB gratis, 50 MB con Basic y hasta 1 GB con Nitro. La guía de imágenes del 11 de junio aún menciona 10 MB. Discord también documenta experimentos: son cifras fechadas, no un límite universal permanente.',
        time: '2–5 minutos',
        risk: 'low',
        actions: [
          'Lee el límite que aparece en la pantalla de carga o en el error para esa cuenta y ese canal. Si difiere de un artículo, usa el dato actual en pantalla y no sigas probando con una cifra supuesta.',
          'Consulta el tamaño original en la información o propiedades del archivo del dispositivo. El FAQ describe una comprobación previa a la compresión; la calidad de subida móvil o la compresión automática no garantizan superar un error de tamaño.',
          'Si pesa demasiado, conserva el original y edita una copia local: reduce dimensiones o calidad de la imagen, o recorta partes innecesarias del vídeo. Comprueba que la copia guardada quede claramente por debajo del límite mostrado.',
          'Confirma que puedes compartir ese contenido con ese destino y prueba la copia una vez. Si el mismo error continúa con un archivo bastante menor que el límite, guarda el texto y sigue los pasos 5 y 6. No hace falta comprar Nitro para diagnosticar.',
        ],
        note: 'La guía de Nitro del 29 de septiembre también indica 50 MB con Basic y hasta 1 GB con Nitro, aunque conserva una explicación antigua del nivel gratuito que menciona 10 MB. Puede haber cambios posteriores. No envíes imágenes privadas ni registros a compresores o conversores web y no sobrescribas el original.',
      },
      {
        id: 'cause-3',
        title: 'Comprueba el permiso efectivo para adjuntar en ese canal',
        summary:
          'Enviar texto y adjuntar archivos son permisos separados. Pide que un administrador revise lo que se aplica realmente en ese canal, no solo el rol general del servidor.',
        time: '2–3 minutos, más la espera del administrador',
        risk: 'low',
        actions: [
          'Usa los mensajes existentes y el aviso del cuadro de escritura para comprobar si puedes enviar texto normal. Un cuadro no disponible no es un problema de tamaño de archivo.',
          'Si el texto funciona pero la imagen pequeña de control no, pide al administrador que revise el permiso efectivo Adjuntar archivos (Attach Files) de ese canal.',
          'En un canal normal, comprueba también el permiso para enviar mensajes; en un hilo, el permiso para enviar mensajes en hilos. Indica las restricciones visibles y las posibles excepciones de canal o miembro.',
          'Solo después de que el administrador corrija cualquier problema de permisos y autorice la prueba, repite con la misma imagen del paso 1. Si los adjuntos están prohibidos deliberadamente, respeta la norma y detente.',
        ],
        note: 'No eludas las normas del servidor con otra cuenta, un mensaje directo ni un servicio externo. Insertar enlaces (Embed Links) controla las vistas previas de enlaces y es distinto de Adjuntar archivos; cambiarlo no elimina una prohibición de adjuntos.',
      },
      {
        id: 'cause-4',
        title: 'Distingue un problema del archivo de uno de vista previa',
        summary:
          'Un adjunto descargable sin imagen integrada es distinto de una carga fallida. Que un formato pueda adjuntarse no garantiza que Discord pueda mostrarlo o reproducirlo en el chat.',
        time: '3–5 minutos',
        risk: 'low',
        actions: [
          'Abre el original localmente con una aplicación adecuada. Si no se abre, está vacío o aún se está guardando, termina de guardarlo u obtén una copia válida. Cambiar la extensión no convierte el contenido.',
          'Si la imagen original se abre, pero solo falla esa imagen, consérvala y exporta otra copia JPEG localmente. Revisa el tamaño y si se puede compartir ese contenido, y compara en el mismo lugar autorizado.',
          'Si el historial muestra el nombre del adjunto y una opción de descarga, comprueba si puedes descargar tu propio archivo inocuo. Un PDF puede adjuntarse sin una vista previa como imagen; el texto también tiene reglas de previsualización independientes. Su ausencia no demuestra que el envío haya fallado.',
          'Si tu adjunto se descarga pero las imágenes no se muestran, revisa las opciones de imágenes y vistas previas en la sección Chat de los ajustes de usuario. Anota el valor antes de cambiarlo y restáuralo si no ayuda. No modifiques filtros de seguridad ni permisos del canal.',
        ],
        note: 'No abras un archivo de un remitente desconocido para probar. La extensión de un vídeo no basta para saber si se puede reproducir. Que la imagen de control funcione tampoco demuestra corrupción del original o incompatibilidad de su formato.',
      },
      {
        id: 'cause-5',
        title: 'Compara app y navegador manteniendo las demás condiciones',
        summary:
          'Usa este paso si también falla el archivo pequeño y no has detectado un problema de tamaño ni de permisos. Cambiar además el destino o el archivo impide interpretar bien el resultado.',
        time: '3–5 minutos',
        risk: 'low',
        actions: [
          'Consulta Discord Status para ver si hay una incidencia en curso que coincida con la hora del fallo. Si es pertinente, deja de reenviar y repite con la misma imagen cuando se restablezca el servicio. Que no haya avisos no demuestra un fallo de tu dispositivo.',
          'En un PC, compara el cliente web oficial discord.com/app con la app del mismo equipo. Mantén la misma cuenta, el mismo canal privado autorizado y la misma imagen, con un intento en cada cliente. Verifica el dominio oficial si debes iniciar sesión.',
          'Si solo funciona uno, cierra por completo y vuelve a abrir el que falla, aplica sus actualizaciones oficiales habituales y repite una vez. Avisa a quienes estén en llamada antes de cerrar Discord. Puedes usar temporalmente el cliente que funciona dentro de las reglas del canal.',
          'Si fallan ambos, comprueba si cargan otras webs normales. Si hace falta, compara con otra red de confianza que tengas autorización para usar, sin cambiar lo demás. Pasar del móvil al PC también cambia el dispositivo, por lo que no aísla un fallo de la app.',
        ],
        note: 'No uses otra red o una VPN para evadir restricciones del trabajo o centro educativo. Mantén activos antivirus y cortafuegos, y consulta al administrador. No necesitas vaciar toda la caché ni reinstalar antes de obtener estos resultados.',
      },
      {
        id: 'cause-6',
        title:
          'Respeta las advertencias y prepara un informe mínimo para soporte',
        summary:
          'Un bloqueo de contenido no es un fallo de conexión. Aunque sospeches un falso positivo, sigue el aviso en vez de modificar o redistribuir repetidamente el archivo bloqueado.',
        time: '5 minutos para preparar el informe',
        risk: 'low',
        actions: [
          'Deja de enviar un archivo marcado por contenido inapropiado o seguridad. No recortes la imagen, cambies la extensión, la metas en un ZIP cifrado ni uses otra cuenta para evitar la inspección.',
          'No ejecutes ni reenvíes un archivo señalado como malware. Consulta a su proveedor o al administrador sin añadir exclusiones de seguridad. Los permisos corresponden al administrador del servidor; los fallos de carga o posibles falsos positivos pueden consultarse a Discord Support.',
          'Prepara el error exacto, hora y zona horaria, versiones del sistema y app/navegador, tipo y tamaño del archivo, límite en pantalla y resultados de comparar el mismo archivo pequeño. No adjuntes el original de forma automática.',
          'Si necesitas una captura, conserva el original localmente y edita una copia en tu dispositivo. Tapa con bloques opacos los tokens, códigos de autenticación, correos, nombres de usuario y conversaciones privadas. Abre de nuevo la imagen exportada para comprobar que no quede nada visible.',
        ],
        note: 'Usa el formulario oficial enlazado en Fuentes. Nunca envíes códigos QR de acceso, contraseñas ni tokens. No publiques registros privados o archivos originales en canales públicos ni conversores web; entrega solo lo necesario mediante el canal privado oficial de soporte.',
      },
    ],
    avoid: [
      'No conviertas cifras fechadas de 10 MB, 20 MB o 500 MB en un límite universal: consulta la cuenta y el canal actuales.',
      'No sobrescribas originales ni envíes archivos privados a herramientas de compresión o conversión web.',
      'No eludas restricciones o bloqueos de seguridad con mensajes directos, otras cuentas, extensiones cambiadas o archivos cifrados.',
      'No desactives software de seguridad, evadas reglas de redes administradas ni empieces borrando toda la caché o reinstalando.',
    ],
    cautions: [
      'Las pruebas deben hacerse únicamente en el mismo canal privado donde se permita publicar y probar. Si necesitas otro lugar, que allí funcione no demuestra permiso en el canal original.',
      'No pruebes con capturas, conversaciones o registros privados, ni abras adjuntos desconocidos.',
      'Antes de compartir una captura, conserva el original, oculta datos en una copia local e inspecciona el resultado exportado: tokens, códigos, correos, usuarios y chat privado.',
      'Si persiste, envía el error, zona horaria, versiones, tipo/tamaño, límite actual y comparaciones al soporte privado oficial. No incluyas automáticamente el archivo original o los registros completos.',
    ],
    faqs: [
      {
        question:
          '¿El límite gratuito es de 10 o 20 MB? ¿Nitro sigue en 500 MB?',
        answer:
          'El FAQ de adjuntos comprobado el 3 de octubre de 2026 está actualizado al 30 de septiembre e indica 20 MB gratis, 50 MB con Basic y hasta 1 GB con Nitro. La guía de imágenes del 11 de junio aún menciona 10 MB. Las fuentes oficiales no coinciden y describen experimentos. No tomes los antiguos 10 MB o 500 MB como cifras fijas: usa la indicación actual de tu cuenta y canal.',
      },
      {
        question:
          '¿Por qué el móvil dice que es demasiado grande aunque baje la calidad?',
        answer:
          'El FAQ describe una comprobación anterior a la compresión. Conserva el original, exporta una copia más pequeña localmente y comprueba su tamaño, en lugar de confiar solo en la calidad configurada en Discord. No hace falta enviar imágenes privadas o registros a un compresor web.',
      },
      {
        question:
          'Puedo mandar texto pero no imágenes. ¿Seguro que son los permisos?',
        answer:
          'No es seguro, pero es posible: escribir y adjuntar son permisos separados. Si también falla una imagen pequeña e inocua en el mismo canal privado autorizado, pide que un administrador revise el permiso efectivo Attach Files y después compara clientes.',
      },
      {
        question:
          '¿Que un PDF o vídeo no tenga vista previa significa que no se subió?',
        answer:
          'No. Si el adjunto está en el historial y puedes descargar tu archivo seguro, separa el envío de la previsualización. El formato, la codificación del vídeo y los ajustes pueden afectar a la visualización o reproducción integrada. Cambiar la extensión no convierte el archivo.',
      },
      {
        question: 'Si funciona la imagen pequeña, ¿el original está dañado?',
        answer:
          'Ese resultado no basta. Orienta la revisión hacia tamaño, estado de guardado y formato. Comprueba el límite actual y si se abre localmente; si es una imagen, conserva el original y compara con otro JPEG exportado. No modifiques y reenvíes un original que activó una advertencia de seguridad.',
      },
      {
        question: '¿Conviene quitar el filtro, usar un ZIP u otra cuenta?',
        answer:
          'No lo uses para evadir un bloqueo de seguridad o una regla del servidor. Sigue la advertencia, consulta permisos al administrador y posibles falsos positivos al soporte oficial. No ejecutes ni redistribuyas archivos señalados como malware.',
      },
      {
        question:
          '¿Puedo enviar el registro completo del juego o una captura de Discord a soporte?',
        answer:
          'Empieza con el error, hora, versiones, tipo/tamaño y resultados. Si hace falta una captura, edita una copia local, tapa tokens, códigos, correos, nombres de usuario y conversaciones privadas, y revisa la imagen exportada. Mantén el original privado y comparte solo lo pertinente mediante el soporte privado oficial.',
      },
    ],
    sources: sources([
      'Discord: FAQ de adjuntos (30 de septiembre de 2026; tamaños, comprobación previa a la compresión y visualización)',
      'Discord: subir imágenes y GIF (11 de junio de 2026; conserva un límite antiguo)',
      'Discord: Nitro y Nitro Basic (29 de septiembre de 2026; conserva parte de la explicación antigua)',
      'Documentación oficial de Discord: permisos de mensajes, adjuntos e hilos',
      'Discord: descripción de permisos (adjuntos y vistas previas de enlaces)',
      'Discord: File Preview (vistas previas de texto)',
      'Discord: mensajería más segura (filtros de imágenes)',
      'Discord: diagnóstico y notificación de errores',
      'Discord Status: incidencias oficiales del servicio',
      'Discord: formulario oficial de soporte',
    ]),
    checkedAt: '2026-10-03',
  },
];
