import type { FollowupGuide } from './types';

export const valorantVan9003Guide: FollowupGuide = {
  gameSlug: 'valorant',
  gameName: 'VALORANT',
  slug: 'van9003',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://support.riotgames.com/en-us/riot/client/error-van-9003',
      labels: {
        ja: 'Riot：VAN9003の意味（英語）',
        en: 'Riot: error VAN9003',
        zh: 'Riot：VAN9003 含义（英语）',
        es: 'Riot: error VAN9003 (inglés)',
      },
    },
    {
      url: 'https://support.riotgames.com/en-us/riot/client/secure-boot-guide',
      labels: {
        ja: 'Riot：Secure Bootの状態とメーカー別案内（英語）',
        en: 'Riot: Secure Boot state and manufacturer resources',
        zh: 'Riot：安全启动状态与厂商说明（英语）',
        es: 'Riot: estado de Secure Boot y recursos del fabricante (inglés)',
      },
    },
    {
      url: 'https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key',
      labels: {
        ja: 'Microsoft：BitLocker回復キーを確認する（英語）',
        en: 'Microsoft: find your BitLocker recovery key',
        zh: 'Microsoft：查找 BitLocker 恢复密钥（英语）',
        es: 'Microsoft: encontrar la clave de recuperación de BitLocker (inglés)',
      },
    },
    {
      url: 'https://support.riotgames.com/en-us/riot/performance/vanguard-security-requirements/',
      labels: {
        ja: 'Riot：Vanguardのセキュリティ要件（英語）',
        en: 'Riot: Vanguard security requirements',
        zh: 'Riot：Vanguard 安全要求（英语）',
        es: 'Riot: requisitos de seguridad de Vanguard (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'VALORANTのVAN9003：セキュアブートの状態確認と次の手順',
      shortTitle: 'VAN9003・セキュアブート',
      description:
        'VAN9003が出たらmsinfo32でBIOSモードとセキュアブート状態を確認。UEFI・無効・レガシーを分け、回復キーと機種別手順を用意して次の確認へ進みます。',
      lead: 'Windows PC版VALORANTでVAN9003やSecure Bootを求める表示が出た場合の案内です。Windowsの版だけで判断せず、エラー全文と実際の状態を照合します。',
      summary:
        'RiotはVAN9003をセキュアブートが有効でない状態と説明しています。まずmsinfo32でBIOSモードとセキュアブート状態を読み取ります。設定変更の前にデータのバックアップ、暗号化の回復キー、機種別の公式手順を確認し、不明なら変更せず相談してください。',
      quickFacts: [
        {
          label: 'まず読む項目',
          value: 'msinfo32：BIOSモード／セキュアブートの状態',
        },
        {
          label: '変更前の準備',
          value: 'バックアップ・回復キー・正確な機種名',
        },
        {
          label: '有効なのにエラー',
          value: '設定を繰り返し変えず、再起動後のエラー全文を確認',
        },
      ],
      diagnosis: [
        {
          symptom: 'エラーがVAN9003か不明',
          cause: '番号と全文を保存する',
          stepId: 'record-van9003',
        },
        {
          symptom: 'UEFIでセキュアブートが無効',
          cause: '復旧の準備とメーカー手順を確認する',
          stepId: 'prepare-secure-boot',
        },
        {
          symptom: 'レガシー・非対応・不明',
          cause: '起動モードを変更せず相談する',
          stepId: 'read-secure-boot',
        },
        {
          symptom: 'UEFI・有効でもVAN9003が残る',
          cause: '再起動後の状態とエラーをRiotへ伝える',
          stepId: 'recheck-vanguard',
        },
      ],
      steps: [
        {
          id: 'record-van9003',
          title: 'エラー全文とPCの管理者を確認する',
          summary: '似た番号のエラーを同じ手順で処理しないようにします。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'VAN RESTRICTION 5やVAN9005なら番号が異なるため、このSTEPのリンクと関連記事から専用の確認へ進む。',
            'VAN9003の番号、全文、発生時刻、Windowsの版を記録する。VAN9001ならTPMの専用記事へ進む。',
            '職場・学校のPCは管理者へ相談し、ファームウェアや暗号化の設定を変更しない。',
            'BIOS作業を検討する前に重要データをバックアップし、BitLocker／デバイス暗号化の回復キーを別端末から確認できる状態にする。回復キーを記事の回答欄や公開画像に載せない。',
          ],
          guideLink: {
            href: '/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5：HVCIの確認',
          },
        },
        {
          id: 'read-secure-boot',
          title: 'msinfo32で2つの状態を読む',
          summary: 'ここでは表示を確認するだけで、設定は変更しません。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'Windows＋Rを押し、msinfo32と入力してEnterを押す。「システム情報」で「BIOSモード」と「セキュアブートの状態」を控える。',
            'UEFIかつ有効（On）ならSTEP 4へ。UEFIかつ無効（Off）ならSTEP 3で変更前の条件を確認する。',
            'レガシー、サポートされていない表示、不明な場合は停止する。CSMを切ったりUEFIへ直接切り替えたりせず、表示と機種名をメーカーへ伝える。',
          ],
          note: '状態確認に戻す設定はありません。起動モードだけを切り替えるとWindowsが起動できなくなる場合があります。',
        },
        {
          id: 'prepare-secure-boot',
          title: '回復キーと機種別の手順を揃える',
          summary: '無効という表示だけでBIOSを変更しません。',
          time: '確認に約3〜5分',
          risk: 'medium',
          actions: [
            'PCまたはマザーボードの正確な機種名を確認し、RiotのSecure Bootガイドにあるメーカー窓口から、その機種の公式手順を探す。',
            'バックアップ、別端末からの回復キー確認、現在の設定と復旧方法が揃うまでは変更しない。ディスク形式や機種対応が不明ならメーカーへ相談する。',
            '必要な条件を確認できた場合だけ機種別手順に従う。設定項目が灰色、説明と画面が違う場合は保存せず中止し、キーの削除・リセットで進めない。',
          ],
          note: 'この汎用記事ではBIOS更新、ディスク変換、Secure Bootキーの操作を案内しません。復旧も機種別の公式手順に従います。',
        },
        {
          id: 'recheck-vanguard',
          title: '再起動後の状態と残るエラーを確認する',
          summary: 'Windowsの状態と、ゲームの結果を別々に記録します。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            '作業を保存してPCを再起動し、msinfo32の2項目をもう一度確認してVALORANTを起動する。',
            'UEFI・有効でも止まる場合は、エラーがVAN9003のままか、VAN: RESTRICTIONなど別の表示になったかを全文で確認する。',
            '機種名、Windowsの版、2つの状態、変更の有無、再起動後のエラーをRiot公式サポートへ伝える。回復キーや個人情報は添付しない。',
          ],
          guideLink: {
            href: '/games/valorant/van9001',
            label: '別のVAN番号が出た場合の確認',
          },
        },
      ],
      avoid: [
        'TPMクリアやSecure Bootキー削除・リセットを試さない',
        'LegacyからUEFIへの切替、CSM無効化、ディスク変換を一律に行わない',
        'Vanguardやウイルス対策を無効にして回避しない',
      ],
      cautions: [
        '回復キーや機種別手順が不明なら設定変更を止め、管理者・メーカーへ相談します。',
        'Windows 11以外でも、表示されたエラーと現行のRiot要件を確認します。OS名だけで要否を決めません。',
      ],
      faqs: [
        {
          question: '有効なのにVAN9003が消えない時は？',
          answer:
            '再起動後のmsinfo32とエラー全文を記録します。別の要件を示すエラーの可能性もあるため、設定を繰り返し切り替えずRiotへ相談してください。',
        },
        {
          question: '「サポートされていません」は設定を変えれば直りますか？',
          answer:
            '表示だけでは判断できません。起動モードやディスク構成、機種の対応をメーカーに確認し、UEFIへの切替やキー操作を先に行わないでください。',
        },
      ],
      related: [
        {
          href: '/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5：HVCIの確認',
        },
        {
          href: '/games/valorant/van9005',
          label: 'VAN9005：TPM・UEFI・メモリ整合性',
        },
        {
          href: '/games/valorant/van9001',
          label: 'VAN9001：TPM 2.0の状態を確認する',
        },
        {
          href: '/guide/tpm-secure-boot',
          label: 'TPM・セキュアブートの共通確認',
        },
        {
          href: '/games/valorant/not-launching-no-van',
          label: 'VAN番号なし・起動しない',
        },
      ],
    },
    en: {
      title: 'VALORANT VAN9003: Check Secure Boot and Choose the Next Step',
      shortTitle: 'VAN9003 and Secure Boot',
      description:
        'Read BIOS Mode and Secure Boot State in msinfo32 for VAN9003. Separate UEFI, Off and Legacy results, prepare recovery access, and use instructions for your exact PC model.',
      lead: 'For VAN9003 or a Secure Boot requirement shown by VALORANT on a Windows PC. Match the complete error to the actual state instead of deciding from the Windows version alone.',
      summary:
        'Riot describes VAN9003 as Secure Boot not being enabled. First read BIOS Mode and Secure Boot State in msinfo32. Before considering firmware changes, back up important files, confirm access to the encryption recovery key and find the manufacturer’s model-specific instructions. Stop and ask for help if any of these are unclear.',
      quickFacts: [
        {
          label: 'Read first',
          value: 'msinfo32: BIOS Mode and Secure Boot State',
        },
        {
          label: 'Before changes',
          value: 'Backup, recovery-key access and exact PC model',
        },
        {
          label: 'Already On',
          value: 'Recheck after restart and record the remaining error',
        },
      ],
      diagnosis: [
        {
          symptom: 'Not sure which VAN error appeared',
          cause: 'Record the number and complete message',
          stepId: 'record-van9003',
        },
        {
          symptom: 'UEFI with Secure Boot Off',
          cause: 'Prepare recovery access and the correct manufacturer guide',
          stepId: 'prepare-secure-boot',
        },
        {
          symptom: 'Legacy, Unsupported or unclear',
          cause: 'Stop before changing boot mode',
          stepId: 'read-secure-boot',
        },
        {
          symptom: 'UEFI and On but the error remains',
          cause: 'Give Riot the post-restart state and full error',
          stepId: 'recheck-vanguard',
        },
      ],
      steps: [
        {
          id: 'record-van9003',
          title: 'Record the error and who manages the PC',
          summary: 'Similar error numbers can need different checks.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'For VAN RESTRICTION 5 or VAN9005, use this step’s link and related guides for that exact number.',
            'Record VAN9003, the full message, time and Windows version. For VAN9001, use the TPM article instead.',
            'For a work or school PC, contact its administrator without changing firmware or encryption settings.',
            'Before considering BIOS work, back up important files and make sure you can access the BitLocker/device-encryption recovery key from another device. Never post that key in article feedback or public screenshots.',
          ],
          guideLink: {
            href: '/en/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5: HVCI checks',
          },
        },
        {
          id: 'read-secure-boot',
          title: 'Read both fields in msinfo32',
          summary: 'This check reads the current state without changing it.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'Press Windows + R, enter msinfo32 and press Enter. In System Information, record BIOS Mode and Secure Boot State.',
            'If they show UEFI and On, continue to Step 4. For UEFI and Off, use Step 3 to check the prerequisites.',
            'For Legacy, Unsupported or an unclear result, stop. Give the manufacturer the model and displayed values before switching to UEFI or disabling CSM.',
          ],
          note: 'Reading the state needs no rollback. Switching boot mode alone can prevent Windows from starting.',
        },
        {
          id: 'prepare-secure-boot',
          title: 'Prepare recovery access and the model guide',
          summary:
            'An Off result is not enough to start changing BIOS settings.',
          time: 'About 3–5 minutes to check',
          risk: 'medium',
          actions: [
            'Identify the exact PC or motherboard model. Use the manufacturer resources linked in Riot’s Secure Boot guide to find instructions for that model.',
            'Confirm your backup, recovery-key access from another device, original settings and recovery procedure before any change. Ask the manufacturer if disk layout or model support is unclear.',
            'Only follow the model-specific procedure after those conditions are established. If an option is gray or the screen differs from the guide, cancel without saving; do not delete or reset Secure Boot keys.',
          ],
          note: 'This general guide does not walk through BIOS updates, disk conversion or key management. Any recovery also needs the manufacturer’s procedure.',
        },
        {
          id: 'recheck-vanguard',
          title: 'Recheck the state and error after restart',
          summary: 'Record Windows state and game behavior separately.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'Save your work, restart the PC and read the two msinfo32 fields again before launching VALORANT.',
            'If UEFI and On are confirmed but the game stops, check whether the complete error still says VAN9003 or now shows VAN: RESTRICTION or another message.',
            'Send Riot support the model, Windows version, displayed states, any changes and the post-restart error. Exclude recovery keys and private information.',
          ],
          guideLink: {
            href: '/en/games/valorant/van9001',
            label: 'Check the other VAN error',
          },
        },
      ],
      avoid: [
        'Do not clear TPM or delete/reset Secure Boot keys',
        'Do not apply a blanket Legacy-to-UEFI switch, CSM change or disk conversion',
        'Do not disable Vanguard or antivirus protection to bypass the error',
      ],
      cautions: [
        'Stop before firmware changes if recovery-key access or model instructions are missing. Ask the administrator or manufacturer.',
        'On other Windows versions too, follow the displayed error and current Riot requirements; the OS name alone does not settle the requirement.',
      ],
      faqs: [
        {
          question: 'What if Secure Boot is already On?',
          answer:
            'Record msinfo32 and the complete error after restarting. Another requirement may be involved. Contact Riot instead of repeatedly toggling firmware settings.',
        },
        {
          question: 'Does Unsupported mean I should change BIOS mode?',
          answer:
            'No. Ask the manufacturer to check model support, boot mode and disk layout first. Do not switch to UEFI or manipulate keys on that assumption.',
        },
      ],
      related: [
        {
          href: '/en/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5: HVCI checks',
        },
        {
          href: '/en/games/valorant/van9005',
          label: 'VAN9005: TPM, UEFI and memory integrity',
        },
        {
          href: '/en/games/valorant/van9001',
          label: 'VAN9001: check TPM 2.0',
        },
        {
          href: '/en/games/valorant',
          label: 'VALORANT error guides',
        },
        {
          href: '/en/games/valorant/not-launching-no-van',
          label: 'No VAN code: launch failure',
        },
      ],
    },
    zh: {
      title: 'VALORANT VAN9003：检查安全启动状态与下一步',
      shortTitle: 'VAN9003 与安全启动',
      description:
        '用 msinfo32 检查 BIOS 模式和安全启动状态，区分 UEFI、关闭与传统模式；先准备恢复密钥，再查对应机型的官方说明。',
      lead: '适用于 Windows PC 版 VALORANT 显示 VAN9003 或要求启用 Secure Boot 的情况。应对照完整错误和实际状态，不只看 Windows 版本。',
      summary:
        'Riot 将 VAN9003 解释为安全启动未启用。先在 msinfo32 中读取 BIOS 模式和安全启动状态。考虑固件修改前，备份重要文件，确认能从另一台设备取得加密恢复密钥，并找到准确机型的官方说明；不确定时停止并咨询。',
      quickFacts: [
        {
          label: '先查看',
          value: 'msinfo32：BIOS 模式／安全启动状态',
        },
        {
          label: '修改前',
          value: '备份、恢复密钥与准确机型',
        },
        {
          label: '已经开启',
          value: '重启后再次确认，记录仍出现的完整错误',
        },
      ],
      diagnosis: [
        {
          symptom: '不确定 VAN 错误编号',
          cause: '保存编号与完整提示',
          stepId: 'record-van9003',
        },
        {
          symptom: 'UEFI 且安全启动关闭',
          cause: '先准备恢复方式和厂商说明',
          stepId: 'prepare-secure-boot',
        },
        {
          symptom: '传统模式、不支持或状态不明',
          cause: '不要先更改启动模式',
          stepId: 'read-secure-boot',
        },
        {
          symptom: 'UEFI、开启但仍报错',
          cause: '向 Riot 提交重启后的状态与错误',
          stepId: 'recheck-vanguard',
        },
      ],
      steps: [
        {
          id: 'record-van9003',
          title: '确认错误与电脑管理者',
          summary: '相似编号可能需要不同检查。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '若显示 VAN RESTRICTION 5 或 VAN9005，请通过本步骤链接及相关文章检查对应编号。',
            '记录 VAN9003、完整提示、时间及 Windows 版本；若为 VAN9001，请看 TPM 专文。',
            '工作或学校电脑先联系管理员，不自行修改固件或加密设置。',
            '准备 BIOS 操作前，备份重要文件，并确认能从另一台设备取得 BitLocker／设备加密恢复密钥。不要在公开反馈或截图中暴露密钥。',
          ],
          guideLink: {
            href: '/zh/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5：HVCI 检查',
          },
        },
        {
          id: 'read-secure-boot',
          title: '在 msinfo32 读取两个字段',
          summary: '本步只查看，不修改设置。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '按 Windows + R，输入 msinfo32 并回车，在系统信息中记录 BIOS 模式和安全启动状态。',
            '显示 UEFI 且开启（On）时进入第 4 步；UEFI 且关闭（Off）时进入第 3 步检查前提。',
            '显示传统模式（Legacy）、不支持或无法判断时停止。先把机型与结果交给厂商，不直接切换 UEFI 或关闭 CSM。',
          ],
          note: '查看状态无需还原。只切换启动模式可能导致 Windows 无法启动。',
        },
        {
          id: 'prepare-secure-boot',
          title: '准备恢复密钥与机型说明',
          summary: '不能仅凭关闭状态就开始修改 BIOS。',
          time: '检查约需 3–5 分钟',
          risk: 'medium',
          actions: [
            '查清电脑或主板的准确型号，通过 Riot 安全启动指南中的厂商入口，寻找对应型号的官方说明。',
            '确认备份、另一台设备上的恢复密钥访问方式、原设置及恢复步骤；磁盘布局或机型支持不明确时先咨询厂商。',
            '前提确认后才按机型说明操作。选项灰色或界面不符时取消并不保存，不删除或重置安全启动密钥。',
          ],
          note: '本通用指南不提供 BIOS 更新、磁盘转换或密钥管理操作；恢复也应按厂商说明进行。',
        },
        {
          id: 'recheck-vanguard',
          title: '重启后确认状态与剩余错误',
          summary: '分别记录 Windows 状态与游戏运行结果。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '保存工作并重启电脑，再用 msinfo32 检查两个字段，然后启动 VALORANT。',
            '若确认 UEFI 与开启后仍被阻止，记录完整提示，区分仍是 VAN9003 还是 VAN: RESTRICTION 等其他错误。',
            '向 Riot 官方支持提供机型、Windows 版本、显示状态、是否修改及重启后的错误；不要提交恢复密钥或隐私信息。',
          ],
          guideLink: {
            href: '/zh/games/valorant/van9001',
            label: '检查另一个 VAN 错误',
          },
        },
      ],
      avoid: [
        '不要清除 TPM，也不要删除或重置安全启动密钥',
        '不要一律切换 Legacy/UEFI、关闭 CSM 或转换磁盘',
        '不要通过禁用 Vanguard 或杀毒防护绕过错误',
      ],
      cautions: [
        '恢复密钥或机型说明不明确时，停止固件修改并咨询管理员或厂商。',
        '其他 Windows 版本也应按实际错误及现行 Riot 要求检查，不能只凭系统名称判断。',
      ],
      faqs: [
        {
          question: '已经开启仍报 VAN9003 怎么办？',
          answer:
            '记录重启后的 msinfo32 状态与完整提示。可能涉及其他要求，应咨询 Riot，不要反复切换固件设置。',
        },
        {
          question: '显示不支持就要切换 BIOS 模式吗？',
          answer:
            '不能这样判断。先让厂商确认机型支持、启动模式和磁盘布局，不先切换 UEFI 或操作密钥。',
        },
      ],
      related: [
        {
          href: '/zh/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5：HVCI 检查',
        },
        {
          href: '/zh/games/valorant/van9005',
          label: 'VAN9005：TPM、UEFI 与内存完整性',
        },
        {
          href: '/zh/games/valorant/van9001',
          label: 'VAN9001：检查 TPM 2.0',
        },
        {
          href: '/zh/games/valorant',
          label: 'VALORANT 错误指南',
        },
        {
          href: '/zh/games/valorant/not-launching-no-van',
          label: '无 VAN 编号的启动失败',
        },
      ],
    },
    es: {
      title:
        'VALORANT VAN9003: comprueba el arranque seguro y el siguiente paso',
      shortTitle: 'VAN9003 y arranque seguro',
      description:
        'Consulta el modo de BIOS y el estado de arranque seguro en msinfo32. Distingue UEFI, desactivado y Legacy; prepara la recuperación y las instrucciones de tu modelo.',
      lead: 'Para VAN9003 o un requisito de Secure Boot en VALORANT para Windows. Compara el mensaje completo con el estado real, sin decidir solo por la versión de Windows.',
      summary:
        'Riot describe VAN9003 como arranque seguro no habilitado. Primero consulta el modo de BIOS y el estado de arranque seguro en msinfo32. Antes de modificar firmware, respalda los archivos, confirma el acceso a la clave de recuperación del cifrado y busca las instrucciones oficiales del modelo. Si algo no está claro, detente y consulta.',
      quickFacts: [
        {
          label: 'Consulta inicial',
          value: 'msinfo32: modo de BIOS y estado de arranque seguro',
        },
        {
          label: 'Antes de modificar',
          value: 'Copia, clave de recuperación y modelo exacto',
        },
        {
          label: 'Ya está activado',
          value: 'Reinicia y registra el error que permanece',
        },
      ],
      diagnosis: [
        {
          symptom: 'No sabes qué error VAN aparece',
          cause: 'Anota el número y el mensaje completo',
          stepId: 'record-van9003',
        },
        {
          symptom: 'UEFI con arranque seguro desactivado',
          cause: 'Prepara recuperación y guía del fabricante',
          stepId: 'prepare-secure-boot',
        },
        {
          symptom: 'Legacy, no compatible o incierto',
          cause: 'Detente antes de cambiar el modo de arranque',
          stepId: 'read-secure-boot',
        },
        {
          symptom: 'UEFI y activado, pero sigue fallando',
          cause: 'Comunica a Riot el estado y error tras reiniciar',
          stepId: 'recheck-vanguard',
        },
      ],
      steps: [
        {
          id: 'record-van9003',
          title: 'Anota el error y quién gestiona el PC',
          summary:
            'Los códigos parecidos pueden necesitar otras comprobaciones.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Para VAN RESTRICTION 5 o VAN9005, usa el enlace de este paso y las guías relacionadas para ese número.',
            'Anota VAN9003, el mensaje completo, la hora y la versión de Windows. Si aparece VAN9001, consulta el artículo de TPM.',
            'En un equipo de trabajo o estudios, contacta al administrador sin cambiar firmware ni cifrado.',
            'Antes de plantearte cambios de BIOS, respalda los archivos y confirma que puedes consultar la clave de BitLocker/cifrado del dispositivo desde otro equipo. No publiques la clave en comentarios ni capturas.',
          ],
          guideLink: {
            href: '/es/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5: comprobaciones de HVCI',
          },
        },
        {
          id: 'read-secure-boot',
          title: 'Consulta los dos campos en msinfo32',
          summary: 'Esta comprobación solo lee el estado.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Pulsa Windows + R, escribe msinfo32 y pulsa Intro. Anota el modo de BIOS y el estado de arranque seguro en Información del sistema.',
            'Si indican UEFI y Activado (On), pasa al paso 4. Si indican UEFI y Desactivado (Off), revisa los requisitos del paso 3.',
            'Si indican Legacy, no compatible o un resultado incierto, detente. Consulta al fabricante con el modelo y los valores antes de cambiar a UEFI o desactivar CSM.',
          ],
          note: 'Leer el estado no requiere revertir nada. Cambiar solo el modo de arranque puede impedir que Windows inicie.',
        },
        {
          id: 'prepare-secure-boot',
          title: 'Prepara la recuperación y la guía del modelo',
          summary:
            'Un estado desactivado no basta para empezar a cambiar la BIOS.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'medium',
          actions: [
            'Identifica el modelo exacto del PC o placa. Usa los recursos del fabricante enlazados en la guía de Secure Boot de Riot para encontrar sus instrucciones.',
            'Confirma la copia, el acceso a la clave desde otro dispositivo, los ajustes originales y el procedimiento de recuperación. Consulta si desconoces el formato del disco o la compatibilidad.',
            'Solo sigue el procedimiento del modelo cuando hayas confirmado esas condiciones. Si una opción está gris o la pantalla no coincide, cancela sin guardar; no borres ni restablezcas claves de Secure Boot.',
          ],
          note: 'Esta guía general no incluye actualizar BIOS, convertir discos ni gestionar claves. La recuperación también requiere las instrucciones del fabricante.',
        },
        {
          id: 'recheck-vanguard',
          title: 'Revisa el estado y el error tras reiniciar',
          summary: 'Registra por separado Windows y el resultado del juego.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Guarda el trabajo, reinicia el PC, vuelve a leer los dos campos en msinfo32 y abre VALORANT.',
            'Si UEFI y Activado están confirmados pero falla, comprueba el mensaje completo: VAN9003, VAN: RESTRICTION u otro error.',
            'Envía al soporte oficial de Riot el modelo, Windows, los estados, los cambios realizados y el error posterior al reinicio. Excluye claves de recuperación y datos privados.',
          ],
          guideLink: {
            href: '/es/games/valorant/van9001',
            label: 'Comprobar el otro error VAN',
          },
        },
      ],
      avoid: [
        'No borres TPM ni elimines o restablezcas claves de Secure Boot',
        'No apliques cambios generales de Legacy a UEFI, CSM o conversión de disco',
        'No desactives Vanguard ni la protección antivirus para eludir el error',
      ],
      cautions: [
        'Si no tienes acceso a la clave o a las instrucciones del modelo, detente y consulta al administrador o fabricante.',
        'En otras versiones de Windows también debes seguir el error mostrado y los requisitos actuales de Riot, sin decidir solo por el nombre del sistema.',
      ],
      faqs: [
        {
          question: '¿Y si ya está activado y sigue VAN9003?',
          answer:
            'Registra msinfo32 y el error completo tras reiniciar. Puede haber otro requisito. Consulta a Riot en vez de alternar repetidamente ajustes de firmware.',
        },
        {
          question:
            '¿No compatible significa que debo cambiar el modo de BIOS?',
          answer:
            'No. Pide al fabricante que compruebe el modelo, el arranque y el disco antes de cambiar a UEFI o manipular claves.',
        },
      ],
      related: [
        {
          href: '/es/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5: comprobaciones de HVCI',
        },
        {
          href: '/es/games/valorant/van9005',
          label: 'VAN9005: TPM, UEFI e integridad de memoria',
        },
        {
          href: '/es/games/valorant/van9001',
          label: 'VAN9001: comprobar TPM 2.0',
        },
        {
          href: '/es/games/valorant',
          label: 'Guías de errores de VALORANT',
        },
        {
          href: '/es/games/valorant/not-launching-no-van',
          label: 'No inicia sin código VAN',
        },
      ],
    },
  },
  relatedSlugs: [
    'van-restriction-5',
    'van9005',
    'van9001',
    'not-launching-no-van',
  ],
};
