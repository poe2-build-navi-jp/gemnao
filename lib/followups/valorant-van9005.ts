import type { FollowupGuide } from './types';

export const valorantVan9005Guide: FollowupGuide = {
  gameSlug: 'valorant',
  gameName: 'VALORANT',
  slug: 'van9005',
  category: 'launch',
  checkedAt: '2026-10-14',
  sources: [
    {
      url: 'https://support.riotgames.com/ja-jp/riot/client/error-van-9005',
      labels: {
        ja: 'Riot：VAN9005の現在の確認順',
        en: 'Riot: current VAN9005 checks (Japanese)',
        zh: 'Riot：VAN9005 当前检查顺序（日语）',
        es: 'Riot: comprobaciones actuales de VAN9005 (japonés)',
      },
    },
    {
      url: 'https://support.riotgames.com/en-us/riot/client/enable-tpm-20',
      labels: {
        ja: 'Riot：TPMの状態と機種別案内（英語）',
        en: 'Riot: TPM status and manufacturer guidance',
        zh: 'Riot：TPM 状态与厂商指南（英语）',
        es: 'Riot: estado de TPM y guías del fabricante (inglés)',
      },
    },
    {
      url: 'https://support.riotgames.com/en-us/riot/client/secure-boot-guide',
      labels: {
        ja: 'Riot：UEFI・セキュアブート確認（英語）',
        en: 'Riot: UEFI and Secure Boot checks',
        zh: 'Riot：UEFI 与安全启动检查（英语）',
        es: 'Riot: comprobaciones de UEFI y arranque seguro (inglés)',
      },
    },
    {
      url: 'https://support.riotgames.com/ja-jp/riot/support-tools/enable-memory-integrity/',
      labels: {
        ja: 'Riot：メモリ整合性・HVCIの確認',
        en: 'Riot: memory integrity and HVCI checks (Japanese)',
        zh: 'Riot：内存完整性与 HVCI 检查（日语）',
        es: 'Riot: integridad de memoria y HVCI (japonés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'VALORANTのVAN9005｜TPM 2.0・UEFI・メモリ整合性を順に確認',
      shortTitle: 'VAN9005・セキュリティ要件',
      description:
        'VAN9005の現在の公式手順はTPM 2.0、Secure Boot、メモリ整合性の順。tpm.mscとmsinfo32で状態を読み、Legacy・未検出・HVCI未実行を分けて確認します。',
      lead: 'VAN9005、またはVBSのためにTPM 2.0とUEFI準拠ファームウェアが必要と表示されたWindows PC版VALORANT向けです。',
      summary:
        'VAN9005はVanguardが必要なセキュリティ設定を検出できない場合のエラーです。現在のRiot案内に合わせ、TPM 2.0→Secure Boot→メモリ整合性の順で確認します。まずtpm.mscとmsinfo32で状態を読み、旧記事のVBS無効化を一般的な解決策として使わないでください。',
      quickFacts: [
        {
          label: '確認順',
          value: 'TPM 2.0 → Secure Boot → メモリ整合性',
        },
        {
          label: '読むだけの確認',
          value: 'tpm.msc・msinfo32',
        },
        {
          label: 'Legacy／未対応表示',
          value: '設定を切り替える前に機種と復旧手段を確認',
        },
      ],
      diagnosis: [
        {
          symptom: 'TPMが見つからない・仕様1.2',
          cause: '有効状態と機種対応を確認',
          stepId: 'check-tpm',
        },
        {
          symptom: 'BIOSモードがLegacy・Secure Bootオフ',
          cause: '起動方式を変える前に相談',
          stepId: 'check-uefi',
        },
        {
          symptom: 'TPM・Secure Bootは正常でも9005',
          cause: 'メモリ整合性の実行状態を確認',
          stepId: 'check-memory',
        },
      ],
      steps: [
        {
          id: 'check-tpm',
          title: 'TPM 2.0の状態と仕様を読む',
          summary: 'TPM有効化とクリアは別の操作です。',
          actions: [
            'VAN9005の全文、Windowsの版、PC・マザーボード型番を記録する。Windows＋Rでtpm.mscを開き、使用準備の状態と「仕様バージョン」が2.0か読む。',
            '未検出や1.2ならメーカーの機種別対応を確認する。表示だけで無搭載・故障と決めず、TPMのクリアや種類切替、部品購入を先に行わない。',
            '設定変更前にはバックアップとBitLocker／デバイス暗号化の回復キーへのアクセスを確認する。管理PCは管理者へ。回復キーを公開しない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'check-uefi',
          title: 'UEFIとSecure Bootの表示を確認する',
          summary: 'Legacyの場合は設定切替の前に止まります。',
          actions: [
            'msinfo32で「BIOSモード」と「セキュアブートの状態」を読む。UEFIか、状態が有効かをそれぞれ記録する。',
            'Legacy、未対応、無効の表示なら、出典のRiotガイドと正確な機種の公式サポートを確認する。Legacy／MBRでUEFIやCSMを即変更すると起動できなくなる恐れがある。',
            '暗号化、デュアルブート、ディスク構成、復旧方法が不明ならメーカーへ相談する。一般記事だけでディスク変換やストレージモード変更を実施しない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'check-memory',
          title: 'メモリ整合性とHVCIの稼働を確認する',
          summary: 'TPMとSecure Bootを確認した後のチェックです。',
          actions: [
            'Windowsセキュリティのデバイスセキュリティ→コア分離でメモリ整合性の表示を確認する。',
            'msinfo32でVBSが実行中か、実行中サービスに「ハイパーバイザーによるコードの整合性の強制」が含まれるかを確認する。仮想化の有効表示だけでは十分でない。',
            '不足がある場合はRiotのメモリ整合性ガイドへ。互換性警告の名前と公開元を確認し、メーカーの更新を優先する。手動で.sysを消さない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'retest-9005',
          title: '必要な対応後に再起動して比較する',
          summary: '変更は機種別の正式な案内に従い、一度に試しません。',
          actions: [
            '必要な対応を公式案内で確認できた場合だけ行い、変更後は再起動する。TPM、UEFI、Secure Boot、HVCIの表示を再確認してVALORANTを起動する。',
            '9005が残るなら、全文・機種・Windowsの版・各表示・実施内容をRiotへ伝える。RESTRICTION 5など別番号に変わった場合は該当記事で条件を確認する。',
            '公式窓口が必要とするログを用意し、回復キーや不要な個人情報は共有しない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
      ],
      avoid: [
        '旧手順のVBS・メモリ整合性無効化を一般解にしない',
        'TPMクリア、Legacyからの即UEFI切替、ストレージモード変更を試さない',
        'Vanguardやウイルス対策を停止して回避しない',
      ],
      cautions: [
        '公式確認日：2026-10-14。実機での再現・解決を確認した記事ではありません。',
        'Windows 11限定とは断定しません。現在の公式案内とエラー全文を優先します。',
      ],
      faqs: [
        {
          question: '以前はVBSをオフにする記事がありました。',
          answer:
            '現在のVAN9005公式案内はTPM 2.0、Secure Boot、メモリ整合性を確認する流れです。過去の回避策より、現在の要件と実際の表示を優先します。',
        },
        {
          question: 'TPM 2.0だけ有効なら十分ですか？',
          answer:
            'ほかの確認を省略しません。UEFI・Secure Boot、メモリ整合性の動作も記録し、すべて確認しても9005が続く場合はRiotへ相談します。',
        },
      ],
      related: [
        {
          href: '/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5・HVCI',
        },
        {
          href: '/games/valorant/van9003',
          label: 'VAN9003：Secure Bootの状態',
        },
        {
          href: '/games/valorant/van9001',
          label: 'VAN9001：TPM 2.0の状態',
        },
        {
          href: '/games/valorant/not-launching-no-van',
          label: 'VAN番号なし・起動しない',
        },
      ],
    },
    en: {
      title:
        'VALORANT VAN9005: Check TPM 2.0, UEFI and Memory Integrity in Order',
      shortTitle: 'VAN9005 security requirements',
      description:
        'Follow current Riot guidance for VAN9005: TPM 2.0, Secure Boot, then memory integrity. Read tpm.msc and msinfo32 before changing firmware or following old VBS workarounds.',
      lead: 'For VALORANT on Windows showing VAN9005 or a message requiring TPM 2.0 and UEFI-compliant firmware for VBS.',
      summary:
        'VAN9005 means Vanguard did not detect required security settings. Follow Riot’s current order: TPM 2.0, Secure Boot, then memory integrity. Read the state with tpm.msc and msinfo32 first; do not use disabling VBS from older articles as a general fix.',
      quickFacts: [
        {
          label: 'Order',
          value: 'TPM 2.0 → Secure Boot → memory integrity',
        },
        {
          label: 'Read-only checks',
          value: 'tpm.msc and msinfo32',
        },
        {
          label: 'Legacy or unsupported',
          value: 'Check model and recovery options before switching settings',
        },
      ],
      diagnosis: [
        {
          symptom: 'TPM missing or specification 1.2',
          cause: 'Check readiness and model support',
          stepId: 'check-tpm',
        },
        {
          symptom: 'Legacy BIOS mode or Secure Boot off',
          cause: 'Seek guidance before changing boot mode',
          stepId: 'check-uefi',
        },
        {
          symptom: 'TPM and Secure Boot look correct',
          cause: 'Check running memory integrity',
          stepId: 'check-memory',
        },
      ],
      steps: [
        {
          id: 'check-tpm',
          title: 'Read TPM readiness and specification',
          summary: 'Enabling TPM is not the same as clearing it.',
          actions: [
            'Record the full VAN9005 message, Windows version and exact PC or motherboard model. Open tpm.msc with Windows + R and read readiness and Specification Version 2.0.',
            'For missing TPM or version 1.2, check manufacturer support for the model. Do not infer absence or failure, clear or switch TPM, or buy parts from this reading alone.',
            'Before configuration changes, confirm backups and access to the BitLocker/device encryption recovery key. Ask the administrator for managed PCs. Never publish the key.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'check-uefi',
          title: 'Read UEFI and Secure Boot status',
          summary: 'Stop before switching settings if the system uses Legacy.',
          actions: [
            'In msinfo32, record BIOS Mode and Secure Boot State separately: UEFI and On are the readings to check.',
            'For Legacy, Unsupported or Off, consult Riot’s linked guide and your exact model’s official support. Switching UEFI/CSM immediately on Legacy/MBR can prevent Windows from booting.',
            'Ask the manufacturer if encryption, dual boot, disk layout or recovery is unclear. Do not convert disks or change storage mode based on a general article alone.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'check-memory',
          title: 'Check memory integrity and running HVCI',
          summary: 'Do this after the TPM and Secure Boot checks.',
          actions: [
            'In Windows Security, open Device security and Core isolation to read memory integrity status.',
            'In msinfo32, check running VBS and Hypervisor enforced Code Integrity in its running services. A virtualization-enabled indicator alone is insufficient.',
            'For missing requirements, follow Riot’s memory integrity guide. Identify incompatible drivers and publishers, prioritize official vendor updates and do not manually delete .sys files.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'retest-9005',
          title: 'Restart and compare after necessary changes',
          summary:
            'Use model-specific official guidance, one change at a time.',
          actions: [
            'Only make a necessary change after confirming the official procedure; restart afterward. Recheck TPM, UEFI, Secure Boot and HVCI readings, then launch VALORANT.',
            'If 9005 remains, send Riot the full message, model, Windows version, readings and actions. If it becomes RESTRICTION 5 or another number, check that guide’s scope.',
            'Prepare logs requested by official support without sharing recovery keys or unnecessary personal information.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
      ],
      avoid: [
        'Do not treat old advice to disable VBS or memory integrity as a general fix.',
        'Do not clear TPM, immediately switch Legacy to UEFI or experiment with storage mode.',
        'Do not bypass the error by stopping Vanguard or antivirus protection.',
      ],
      cautions: [
        'Official sources checked on 2026-10-14; no in-game reproduction or verified repair is claimed.',
        'Do not assume this is exclusive to Windows 11. Use current official guidance and the full message.',
      ],
      faqs: [
        {
          question: 'An older article told me to turn VBS off.',
          answer:
            'The current VAN9005 guidance checks TPM 2.0, Secure Boot and memory integrity. Prioritize current requirements and the actual message over an old workaround.',
        },
        {
          question: 'Is enabled TPM 2.0 sufficient?',
          answer:
            'Do not skip the remaining checks. Record UEFI, Secure Boot and working memory integrity; contact Riot if 9005 persists after all have been checked.',
        },
      ],
      related: [
        {
          href: '/en/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5 / HVCI',
        },
        {
          href: '/en/games/valorant/van9003',
          label: 'VAN9003: Secure Boot status',
        },
        {
          href: '/en/games/valorant/van9001',
          label: 'VAN9001: TPM 2.0 status',
        },
        {
          href: '/en/games/valorant/not-launching-no-van',
          label: 'Not launching without a VAN code',
        },
      ],
    },
    zh: {
      title: 'VALORANT VAN9005：依次检查 TPM 2.0、UEFI 和内存完整性',
      shortTitle: 'VAN9005 安全要求',
      description:
        '按 Riot 当前顺序检查 VAN9005：TPM 2.0、安全启动、内存完整性。先用 tpm.msc 和 msinfo32 读取状态，再决定是否需要对应机型支持。',
      lead: '适用于 Windows PC 版 VALORANT 显示 VAN9005，或提示 VBS 需要 TPM 2.0 和符合 UEFI 标准的固件。',
      summary:
        'VAN9005 表示 Vanguard 未检测到所需安全设置。按 Riot 当前顺序检查 TPM 2.0、安全启动和内存完整性。先使用 tpm.msc 与 msinfo32 读取状态，不将旧文章中的关闭 VBS 当作通用修复。',
      quickFacts: [
        {
          label: '检查顺序',
          value: 'TPM 2.0 → 安全启动 → 内存完整性',
        },
        {
          label: '只读检查',
          value: 'tpm.msc、msinfo32',
        },
        {
          label: 'Legacy 或不支持',
          value: '切换设置前先核对机型和恢复方案',
        },
      ],
      diagnosis: [
        {
          symptom: '未找到 TPM 或规范版本 1.2',
          cause: '检查就绪状态及机型支持',
          stepId: 'check-tpm',
        },
        {
          symptom: 'Legacy 模式或安全启动关闭',
          cause: '改变启动模式前先咨询',
          stepId: 'check-uefi',
        },
        {
          symptom: 'TPM 与安全启动正常',
          cause: '检查内存完整性运行状态',
          stepId: 'check-memory',
        },
      ],
      steps: [
        {
          id: 'check-tpm',
          title: '读取 TPM 就绪状态和规范版本',
          summary: '启用 TPM 与清除 TPM 不是同一操作。',
          actions: [
            '记录完整 VAN9005 提示、Windows 版本和准确 PC／主板型号。按 Windows＋R 输入 tpm.msc，查看是否就绪及规范版本是否为 2.0。',
            '未检测到 TPM 或为 1.2 时，查询厂商对该机型的支持。不仅凭此判断无硬件或故障，不先清除、切换 TPM 或购买部件。',
            '更改设置前先确认备份及 BitLocker／设备加密恢复密钥的访问方式。受管理电脑咨询管理员，不公开密钥。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'check-uefi',
          title: '读取 UEFI 和安全启动状态',
          summary: 'Legacy 情况下先停止，不直接切换。',
          actions: [
            '在 msinfo32 中分别记录 BIOS 模式与安全启动状态，核对是否为 UEFI 和开启。',
            '显示 Legacy、不支持或关闭时，查阅 Riot 来源指南及准确机型的官方支持。Legacy／MBR 状态下立即更改 UEFI／CSM 可能使 Windows 无法启动。',
            '加密、双系统、磁盘布局或恢复方法不明时先问厂商。不仅凭通用文章转换磁盘或更改存储模式。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'check-memory',
          title: '核对内存完整性及 HVCI 运行状态',
          summary: '在 TPM 和安全启动之后检查。',
          actions: [
            '在 Windows 安全中心的设备安全性、内核隔离中查看内存完整性。',
            '在 msinfo32 中确认 VBS 正在运行，且运行中的服务包含虚拟机监控程序强制的代码完整性（HVCI）。仅显示虚拟化启用不够。',
            '条件不足时查阅 Riot 内存完整性指南。记录不兼容驱动与发布者，优先厂商正式更新，不手删 .sys。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'retest-9005',
          title: '必要处理后重启并比较',
          summary: '按机型官方说明逐项处理。',
          actions: [
            '只有确认对应官方步骤后才实施必要改动，并在改动后重启。重新记录 TPM、UEFI、安全启动、HVCI 状态后启动 VALORANT。',
            '9005 仍在时，向 Riot 提供全文、机型、Windows 版本、各项状态和操作。若变为 RESTRICTION 5 等其他编号，改用对应文章确认条件。',
            '准备官方支持要求的日志，不分享恢复密钥或无关个人信息。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
      ],
      avoid: [
        '不把关闭 VBS 或内存完整性的旧方法当通用修复。',
        '不清除 TPM，不直接把 Legacy 改为 UEFI，不试改存储模式。',
        '不停止 Vanguard 或杀毒保护来绕过错误。',
      ],
      cautions: [
        '官方资料核对日期：2026-10-14；未声称已实机复现或验证修复。',
        '不认定仅限 Windows 11；以当前官方说明和完整提示为准。',
      ],
      faqs: [
        {
          question: '旧文章让我关闭 VBS，应该照做吗？',
          answer:
            '当前 VAN9005 官方说明要求检查 TPM 2.0、安全启动和内存完整性。优先依据当前要求及实际提示，而非旧的绕过方式。',
        },
        {
          question: '只启用 TPM 2.0 就够了吗？',
          answer:
            '仍需记录 UEFI、安全启动及内存完整性的工作状态。全部核对后仍有 9005，请咨询 Riot。',
        },
      ],
      related: [
        {
          href: '/zh/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5／HVCI',
        },
        {
          href: '/zh/games/valorant/van9003',
          label: 'VAN9003：安全启动状态',
        },
        {
          href: '/zh/games/valorant/van9001',
          label: 'VAN9001：TPM 2.0 状态',
        },
        {
          href: '/zh/games/valorant/not-launching-no-van',
          label: '无 VAN 编号却无法启动',
        },
      ],
    },
    es: {
      title:
        'VALORANT VAN9005: comprueba TPM 2.0, UEFI e integridad de memoria',
      shortTitle: 'Requisitos de VAN9005',
      description:
        'Sigue el orden actual de Riot para VAN9005: TPM 2.0, arranque seguro e integridad de memoria. Lee tpm.msc y msinfo32 antes de cambiar firmware o aplicar soluciones antiguas de VBS.',
      lead: 'Para VALORANT en Windows con VAN9005 o un mensaje que exige TPM 2.0 y firmware compatible con UEFI para VBS.',
      summary:
        'VAN9005 indica que Vanguard no detectó los ajustes de seguridad requeridos. Sigue el orden actual de Riot: TPM 2.0, arranque seguro e integridad de memoria. Consulta primero tpm.msc y msinfo32; no uses desactivar VBS como solución general basada en artículos antiguos.',
      quickFacts: [
        {
          label: 'Orden',
          value: 'TPM 2.0 → arranque seguro → integridad de memoria',
        },
        {
          label: 'Consulta sin cambios',
          value: 'tpm.msc y msinfo32',
        },
        {
          label: 'Legacy o no compatible',
          value: 'Confirma modelo y recuperación antes de cambiar ajustes',
        },
      ],
      diagnosis: [
        {
          symptom: 'TPM no detectado o versión 1.2',
          cause: 'Comprueba estado y compatibilidad del modelo',
          stepId: 'check-tpm',
        },
        {
          symptom: 'BIOS Legacy o arranque seguro desactivado',
          cause: 'Consulta antes de cambiar el modo de arranque',
          stepId: 'check-uefi',
        },
        {
          symptom: 'TPM y arranque seguro parecen correctos',
          cause: 'Comprueba la integridad de memoria en ejecución',
          stepId: 'check-memory',
        },
      ],
      steps: [
        {
          id: 'check-tpm',
          title: 'Lee el estado y la especificación de TPM',
          summary: 'Activar TPM no equivale a borrarlo.',
          actions: [
            'Anota el mensaje completo, Windows y el modelo exacto del PC o placa. Abre tpm.msc con Windows + R y comprueba si está listo y si la versión de especificación es 2.0.',
            'Si no se detecta o es 1.2, consulta al fabricante para ese modelo. No deduzcas ausencia o avería, borres o cambies TPM, ni compres piezas solo por esa lectura.',
            'Antes de modificar ajustes, confirma copias de seguridad y acceso a la clave de recuperación de BitLocker/cifrado del dispositivo. En equipos administrados, consulta al administrador. No publiques la clave.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'check-uefi',
          title: 'Lee UEFI y el estado del arranque seguro',
          summary: 'Detente antes de cambiar ajustes si aparece Legacy.',
          actions: [
            'En msinfo32, anota por separado el modo de BIOS y el estado del arranque seguro: comprueba UEFI y activado.',
            'Si aparece Legacy, no compatible o desactivado, consulta la guía de Riot y el soporte oficial del modelo. Cambiar UEFI/CSM inmediatamente con Legacy/MBR puede impedir que Windows arranque.',
            'Consulta al fabricante si no conoces el cifrado, arranque dual, distribución de discos o recuperación. No conviertas discos ni cambies el modo de almacenamiento solo por una guía general.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'check-memory',
          title: 'Comprueba integridad de memoria y HVCI',
          summary: 'Hazlo después de comprobar TPM y arranque seguro.',
          actions: [
            'En Seguridad de Windows, abre Seguridad del dispositivo y Aislamiento del núcleo para consultar la integridad de memoria.',
            'En msinfo32, comprueba VBS en ejecución y la integridad de código aplicada por el hipervisor (HVCI) entre sus servicios activos. El indicador de virtualización habilitada no basta.',
            'Si falta algo, consulta la guía de integridad de memoria de Riot. Identifica controladores incompatibles y sus editores, prioriza actualizaciones oficiales y no borres .sys manualmente.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'retest-9005',
          title: 'Reinicia y compara tras los cambios necesarios',
          summary: 'Sigue instrucciones oficiales del modelo, de una en una.',
          actions: [
            'Haz un cambio necesario solo tras confirmar el procedimiento oficial y reinicia después. Vuelve a consultar TPM, UEFI, arranque seguro y HVCI; inicia VALORANT.',
            'Si continúa 9005, facilita a Riot mensaje completo, modelo, Windows, lecturas y acciones. Si cambia a RESTRICTION 5 u otro número, consulta el ámbito de esa guía.',
            'Prepara los registros que solicite el soporte oficial sin incluir claves de recuperación ni información personal innecesaria.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
      ],
      avoid: [
        'No uses desactivar VBS o integridad de memoria como arreglo general basado en guías antiguas.',
        'No borres TPM, cambies inmediatamente de Legacy a UEFI ni pruebes modos de almacenamiento.',
        'No detengas Vanguard o el antivirus para evitar el error.',
      ],
      cautions: [
        'Fuentes consultadas el 2026-10-14; no se afirma reproducción en el juego ni reparación comprobada.',
        'No se presupone que sea exclusivo de Windows 11. Prioriza la guía oficial actual y el mensaje completo.',
      ],
      faqs: [
        {
          question: 'Una guía antigua decía que desactivara VBS.',
          answer:
            'La guía actual de VAN9005 comprueba TPM 2.0, arranque seguro e integridad de memoria. Prioriza los requisitos actuales y el mensaje real frente a una solución antigua.',
        },
        {
          question: '¿Basta con activar TPM 2.0?',
          answer:
            'No omitas las demás comprobaciones. Anota UEFI, arranque seguro e integridad de memoria en funcionamiento; consulta a Riot si persiste 9005 tras comprobarlo todo.',
        },
      ],
      related: [
        {
          href: '/es/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5 / HVCI',
        },
        {
          href: '/es/games/valorant/van9003',
          label: 'VAN9003: estado del arranque seguro',
        },
        {
          href: '/es/games/valorant/van9001',
          label: 'VAN9001: estado de TPM 2.0',
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
    'van9003',
    'van9001',
    'not-launching-no-van',
  ],
};
