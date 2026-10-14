import type { FollowupGuide } from './types';

export const valorantRestriction5Guide: FollowupGuide = {
  gameSlug: 'valorant',
  gameName: 'VALORANT',
  slug: 'van-restriction-5',
  category: 'launch',
  checkedAt: '2026-10-14',
  sources: [
    {
      url: 'https://support.riotgames.com/ja-jp/riot/penalties/error-van-restriction-5/',
      labels: {
        ja: 'Riot：VAN RESTRICTION 5',
        en: 'Riot: VAN RESTRICTION 5 (Japanese)',
        zh: 'Riot：VAN RESTRICTION 5（日语）',
        es: 'Riot: VAN RESTRICTION 5 (japonés)',
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
      title: 'VALORANTのVAN RESTRICTION 5｜メモリ整合性・HVCIの確認手順',
      shortTitle: 'VAN RESTRICTION 5・HVCI',
      description:
        'VAN RESTRICTION 5が出たらメモリ整合性のスイッチだけでなく、msinfo32でVBSとHVCIの実行状態を確認。互換性のないドライバー、仮想化、機種別案内への分岐を整理します。',
      lead: 'エラー全文に「VAN: RESTRICTION: 5」があるPC向けです。別番号のRESTRICTIONは番号に一致するRiot公式記事へ進んでください。VAN9005は下の関連記事で確認できます。',
      summary:
        'RESTRICTION 5は、Vanguardがメモリ整合性の正常稼働を確認できない場合のエラーです。まず現在の状態を読み、VBSが実行中で、実行中サービスにHVCIが含まれるか確認します。仮想化が有効という表示だけでは完了と判断せず、不足項目に応じてWindowsまたは機種別の公式案内へ進みます。',
      quickFacts: [
        {
          label: '対象番号',
          value: 'VAN: RESTRICTION: 5',
        },
        {
          label: '確認コマンド',
          value: 'msinfo32',
        },
        {
          label: '完了の確認',
          value: 'VBS実行中＋実行中サービスのHVCI',
        },
      ],
      diagnosis: [
        {
          symptom: 'メモリ整合性はオンなのにエラー',
          cause: '実際の実行状態も確認',
          stepId: 'read-hvci',
        },
        {
          symptom: 'スイッチが灰色・互換性警告',
          cause: 'ドライバー名と公開元を確認',
          stepId: 'check-blocker',
        },
        {
          symptom: 'VBSが設定済みだが未実行',
          cause: '機種対応・仮想化の確認へ',
          stepId: 'check-blocker',
        },
      ],
      steps: [
        {
          id: 'read-hvci',
          title: '番号とVBS・HVCIの実行状態を読む',
          summary: '設定のオンと、実際に動いている状態を区別します。',
          actions: [
            'エラー全文とWindowsの版を記録し、RESTRICTIONの番号が5か確認する。',
            'Windows＋Rでmsinfo32を開く。「仮想化ベースのセキュリティ」が「実行中」か、さらに「仮想化ベースのセキュリティの実行中サービス」に「ハイパーバイザーによるコードの整合性の強制」が含まれるか読む。',
            'タスクマネージャーのCPU欄で「仮想化：有効」でもHVCIの動作証明にはならない。VBS・実行中サービス・エラー全文を別々に記録する。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'check-blocker',
          title: '変更前にドライバーと機種を確認する',
          summary: '警告や仮想化の状態に合わせて相談先を選びます。',
          actions: [
            'Windowsセキュリティのデバイスセキュリティ→コア分離でメモリ整合性の状態を確認する。互換性警告があればドライバー名と公開元を控え、正規の更新版をメーカーで確認する。',
            '仮想化が無効、またはVBSが設定済みでも実行されない場合は、正確なPC・マザーボード型番でメーカーの対応と手順を確認する。出典のRiotガイドにもメーカー別リンクがある。',
            'BIOS等の変更に進む前にバックアップ、暗号化の回復キーへのアクセス、復旧方法を確認する。管理PCは管理者へ。不明な設定を試しに切り替えない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'enable-memory-integrity',
          title: '不足している設定だけ公式案内で整える',
          summary: '機種確認と警告の解消を先に行います。',
          actions: [
            '仮想化が有効で互換性警告がなく、メモリ整合性がオフならWindowsセキュリティのコア分離からオンにし、指示に従って再起動する。',
            'スイッチがない・灰色・警告が残る場合はRiotの該当トラブルシューティングとメーカーへ。BIOS更新や一括設定変更をこのページだけで実施しない。',
            'Windows HomeやHyper-Vの項目がないことだけで非対応と判断しない。Windowsの版、CPU、VBSとHVCIの実行状況を伝えて確認する。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'medium',
        },
        {
          id: 'verify-hvci',
          title: '再起動後にHVCIと残る番号を再確認する',
          summary: '正常な状態でも同じ番号が続く場合はRiotへ引き継ぎます。',
          actions: [
            'msinfo32でVBSが実行中か、実行中サービスにHVCIがあるか、両方を再確認してVALORANTを起動する。',
            'RESTRICTION 5が続くなら、機種、Windowsの版、両方の表示、警告ドライバー名、変更内容と再起動後の全文をRiotへ伝える。',
            '公式窓口が求めるログだけを共有する。回復キーや個人情報を公開欄に載せない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
      ],
      avoid: [
        'VBS・メモリ整合性を無効にして回避しない',
        '互換性のない.sysを手で削除しない',
        'ストレージモードやTPMを試しに変更・クリアしない',
      ],
      cautions: [
        '公式確認日：2026-10-14。実機での再現・解決検証ではありません。',
        'BIOSの表示が機種別案内と違う、復旧手段が不明、起動不良が出た場合は操作を止めてメーカーへ相談します。',
      ],
      faqs: [
        {
          question: 'VBSが実行中なら解決済みですか？',
          answer:
            'HVCIの実行中サービス表示と、ゲームで同じ番号が消えたかも確認します。VBS実行中やCPU仮想化の有効表示だけで成功とはしません。',
        },
        {
          question: 'メモリ整合性がオンなのに5が出ます。',
          answer:
            'スイッチの状態、VBS実行状態、実行中サービスを分けて記録してください。警告や不足がなければ設定を繰り返し変更せずRiotへ相談します。',
        },
      ],
      related: [
        {
          href: '/games/valorant/van9005',
          label: 'VAN9005：TPM・UEFI・メモリ整合性',
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
        'VALORANT VAN RESTRICTION 5: Check Memory Integrity and Running HVCI',
      shortTitle: 'VAN RESTRICTION 5 / HVCI',
      description:
        'Check running VBS and HVCI in msinfo32, not just the memory integrity switch. Separate incompatible drivers and virtualization issues before following model-specific guidance.',
      lead: 'For a PC message that explicitly says VAN: RESTRICTION: 5. Other RESTRICTION numbers and VAN9005 need their own checks.',
      summary:
        'RESTRICTION 5 means Vanguard could not confirm working memory integrity. Read the current state first: VBS must be running and its running services must include HVCI. A virtualization-enabled indicator alone is insufficient; use Windows or model-specific guidance for the missing requirement.',
      quickFacts: [
        {
          label: 'Exact number',
          value: 'VAN: RESTRICTION: 5',
        },
        {
          label: 'Check with',
          value: 'msinfo32',
        },
        {
          label: 'Verify',
          value: 'Running VBS plus HVCI in running services',
        },
      ],
      diagnosis: [
        {
          symptom: 'Memory integrity is on but the error remains',
          cause: 'Check actual running services',
          stepId: 'read-hvci',
        },
        {
          symptom: 'Switch greyed out or incompatibility warning',
          cause: 'Identify driver and publisher',
          stepId: 'check-blocker',
        },
        {
          symptom: 'VBS configured but not running',
          cause: 'Check model and virtualization support',
          stepId: 'check-blocker',
        },
      ],
      steps: [
        {
          id: 'read-hvci',
          title: 'Read the number and running VBS/HVCI state',
          summary: 'An enabled setting and a running service are different.',
          actions: [
            'Record the full message and Windows version; confirm the RESTRICTION number is 5.',
            'Open msinfo32 with Windows + R. Check that Virtualization-based security is running and that Virtualization-based security Services Running includes Hypervisor enforced Code Integrity.',
            'Task Manager showing Virtualization: Enabled under CPU is not proof of running HVCI. Record VBS, running services and the game message separately.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'check-blocker',
          title: 'Check drivers and the exact PC model first',
          summary:
            'Choose guidance based on warnings and virtualization status.',
          actions: [
            'In Windows Security, open Device security and Core isolation to check memory integrity. For an incompatibility warning, note the driver and publisher and look for an official vendor update.',
            'If virtualization is disabled or VBS is configured but not running, check your exact PC or motherboard model with the manufacturer. Riot’s source guide also links to manufacturer resources.',
            'Before firmware changes, confirm backups, access to the encryption recovery key and a recovery plan. Ask the administrator for a managed PC; do not experiment with unfamiliar settings.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'enable-memory-integrity',
          title: 'Address only the missing setting',
          summary: 'Check the model and resolve warnings before proceeding.',
          actions: [
            'If virtualization is enabled, no incompatibility warning remains and memory integrity is off, enable it in Windows Security under Core isolation and restart as directed.',
            'If the switch is missing, greyed out or still warns, use the matching Riot troubleshooting section and manufacturer support. This article is not a BIOS flashing or bulk configuration procedure.',
            'Windows Home or a missing Hyper-V checkbox alone does not establish incompatibility. Provide the Windows edition, CPU and running VBS/HVCI state for support.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'medium',
        },
        {
          id: 'verify-hvci',
          title: 'Recheck HVCI and the number after restarting',
          summary:
            'Escalate a persistent error once the required states are present.',
          actions: [
            'Reopen msinfo32, check both running VBS and HVCI in running services, then launch VALORANT.',
            'If RESTRICTION 5 remains, give Riot the model, Windows version, both readings, named drivers, changes and full post-restart message.',
            'Share only logs requested through official support. Never post recovery keys or private details publicly.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
      ],
      avoid: [
        'Do not disable VBS or memory integrity to bypass the error.',
        'Do not manually delete incompatible .sys files.',
        'Do not experiment with storage mode or clear or switch TPM.',
      ],
      cautions: [
        'Official sources checked on 2026-10-14; this is not a report of an in-game reproduction or verified fix.',
        'Stop and ask the manufacturer if model instructions do not match, recovery is unclear or Windows stops booting.',
      ],
      faqs: [
        {
          question: 'Is running VBS enough?',
          answer:
            'Also check HVCI in running services and whether the game still reports the same number. Running VBS or enabled CPU virtualization alone does not establish success.',
        },
        {
          question: 'Memory integrity is on, but error 5 remains.',
          answer:
            'Record the switch, VBS state and running services separately. If no warning or missing requirement is apparent, contact Riot instead of repeatedly changing settings.',
        },
      ],
      related: [
        {
          href: '/en/games/valorant/van9005',
          label: 'VAN9005: TPM, UEFI and memory integrity',
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
      title: 'VALORANT VAN RESTRICTION 5：检查内存完整性与 HVCI 运行状态',
      shortTitle: 'VAN RESTRICTION 5／HVCI',
      description:
        '通过 msinfo32 检查 VBS 和 HVCI 是否运行，不只看内存完整性开关。区分不兼容驱动与虚拟化问题，先确认具体机型再操作。',
      lead: '适用于完整提示明确为 VAN: RESTRICTION: 5 的 PC。其他 RESTRICTION 编号或 VAN9005 请按对应文章检查。',
      summary:
        'RESTRICTION 5 表示 Vanguard 无法确认内存完整性正常工作。先读取状态：VBS 应正在运行，且运行中的服务应包含 HVCI。仅显示虚拟化已启用并不足够；根据缺少的条件查阅 Windows 或对应机型说明。',
      quickFacts: [
        {
          label: '适用编号',
          value: 'VAN: RESTRICTION: 5',
        },
        {
          label: '检查命令',
          value: 'msinfo32',
        },
        {
          label: '验证条件',
          value: 'VBS 正在运行＋运行中的服务包含 HVCI',
        },
      ],
      diagnosis: [
        {
          symptom: '内存完整性已开但仍报错',
          cause: '检查实际运行服务',
          stepId: 'read-hvci',
        },
        {
          symptom: '开关灰色或有兼容性警告',
          cause: '记录驱动和发布者',
          stepId: 'check-blocker',
        },
        {
          symptom: 'VBS 已配置但未运行',
          cause: '核对机型与虚拟化支持',
          stepId: 'check-blocker',
        },
      ],
      steps: [
        {
          id: 'read-hvci',
          title: '读取编号及 VBS／HVCI 运行状态',
          summary: '设置已启用不等于服务已运行。',
          actions: [
            '记录完整提示和 Windows 版本，确认 RESTRICTION 编号为 5。',
            '按 Windows＋R 输入 msinfo32。检查基于虚拟化的安全性是否正在运行，并检查其运行中的服务是否包含虚拟机监控程序强制的代码完整性（HVCI）。',
            '任务管理器 CPU 页显示虚拟化已启用，也不能证明 HVCI 正在运行。分别记录 VBS、运行中的服务与游戏提示。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'check-blocker',
          title: '先检查驱动和准确机型',
          summary: '按警告内容及虚拟化状态选择支持资料。',
          actions: [
            '在 Windows 安全中心的设备安全性、内核隔离中查看内存完整性。有不兼容警告时记录驱动及发布者，先查询厂商正式更新。',
            '若虚拟化未启用，或 VBS 已配置却未运行，按准确的 PC／主板型号查询厂商支持；Riot 原文也提供厂商入口。',
            '更改固件前先确认备份、加密恢复密钥的访问方式及恢复方案。受管理电脑交给管理员，不试改陌生设置。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'enable-memory-integrity',
          title: '按官方说明补齐缺少的设置',
          summary: '先核对机型并处理警告。',
          actions: [
            '虚拟化已启用且没有兼容性警告、内存完整性为关闭时，可在 Windows 安全中心的内核隔离中开启，并按提示重启。',
            '开关缺失、灰色或警告仍在时，查阅 Riot 对应排查章节并咨询厂商。不仅凭本文更新 BIOS 或批量修改设置。',
            '不能仅凭 Windows 家庭版或找不到 Hyper-V 选项就认定不兼容。向支持人员提供 Windows 版本、CPU 及 VBS／HVCI 运行状态。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'medium',
        },
        {
          id: 'verify-hvci',
          title: '重启后再次核对 HVCI 和错误编号',
          summary: '所需状态齐全但仍报错时交给 Riot。',
          actions: [
            '重新打开 msinfo32，同时确认 VBS 正在运行及运行中的服务包含 HVCI，再启动 VALORANT。',
            '仍有 RESTRICTION 5 时，向 Riot 提供机型、Windows 版本、两项状态、警告驱动、改动和重启后的完整提示。',
            '仅向官方支持提供所需日志；不要公开恢复密钥或个人信息。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
      ],
      avoid: [
        '不关闭 VBS 或内存完整性来绕过错误。',
        '不手动删除不兼容的 .sys 文件。',
        '不试改存储模式，不清除或切换 TPM。',
      ],
      cautions: [
        '官方资料核对日期：2026-10-14；未声称在游戏实机复现或验证修复。',
        '说明与机型不符、恢复方式不明或 Windows 无法启动时，停止操作并咨询厂商。',
      ],
      faqs: [
        {
          question: 'VBS 正在运行就够了吗？',
          answer:
            '还要检查运行中的服务是否包含 HVCI，并确认游戏是否仍显示同一编号。VBS 运行或 CPU 虚拟化启用都不能单独证明成功。',
        },
        {
          question: '内存完整性已开，为什么还报错？',
          answer:
            '分别记录开关、VBS 状态及运行中的服务。没有明显警告或缺少项时，联系 Riot，不反复改设置。',
        },
      ],
      related: [
        {
          href: '/zh/games/valorant/van9005',
          label: 'VAN9005：TPM、UEFI 与内存完整性',
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
        'VALORANT VAN RESTRICTION 5: comprueba la integridad de memoria y HVCI',
      shortTitle: 'VAN RESTRICTION 5 / HVCI',
      description:
        'Comprueba VBS y HVCI en ejecución con msinfo32, además del interruptor de integridad de memoria. Distingue controladores incompatibles y virtualización antes de cambiar ajustes.',
      lead: 'Para un PC cuyo mensaje indique exactamente VAN: RESTRICTION: 5. Otros números RESTRICTION y VAN9005 requieren sus propias comprobaciones.',
      summary:
        'RESTRICTION 5 significa que Vanguard no pudo confirmar el funcionamiento de la integridad de memoria. Comprueba primero que VBS esté en ejecución y que sus servicios en ejecución incluyan HVCI. El indicador de virtualización habilitada no basta; consulta Windows o la guía del modelo según lo que falte.',
      quickFacts: [
        {
          label: 'Número exacto',
          value: 'VAN: RESTRICTION: 5',
        },
        {
          label: 'Consulta',
          value: 'msinfo32',
        },
        {
          label: 'Verificación',
          value: 'VBS en ejecución y HVCI entre sus servicios activos',
        },
      ],
      diagnosis: [
        {
          symptom: 'Integridad de memoria activada pero sigue el error',
          cause: 'Comprueba los servicios en ejecución',
          stepId: 'read-hvci',
        },
        {
          symptom: 'Interruptor gris o aviso de incompatibilidad',
          cause: 'Identifica controlador y editor',
          stepId: 'check-blocker',
        },
        {
          symptom: 'VBS configurado pero sin ejecutarse',
          cause: 'Consulta modelo y virtualización',
          stepId: 'check-blocker',
        },
      ],
      steps: [
        {
          id: 'read-hvci',
          title: 'Lee el número y el estado de VBS y HVCI',
          summary:
            'Un ajuste habilitado no equivale a un servicio en ejecución.',
          actions: [
            'Anota el mensaje completo y la versión de Windows; confirma que el número RESTRICTION sea 5.',
            'Abre msinfo32 con Windows + R. Comprueba que la seguridad basada en virtualización esté en ejecución y que sus servicios en ejecución incluyan la integridad de código aplicada por el hipervisor (HVCI).',
            'Virtualización: Habilitada en la sección CPU del Administrador de tareas no demuestra que HVCI funcione. Anota por separado VBS, servicios activos y el mensaje del juego.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'check-blocker',
          title: 'Comprueba controladores y el modelo exacto',
          summary:
            'Elige la ayuda según los avisos y el estado de virtualización.',
          actions: [
            'En Seguridad de Windows, abre Seguridad del dispositivo y Aislamiento del núcleo. Si aparece incompatibilidad, anota controlador y editor y consulta su actualización oficial.',
            'Si la virtualización está deshabilitada o VBS está configurado pero no se ejecuta, consulta al fabricante con el modelo exacto del PC o placa. La guía de Riot también enlaza a fabricantes.',
            'Antes de cambiar firmware, confirma copias de seguridad, acceso a la clave de recuperación del cifrado y un plan de recuperación. En equipos administrados, consulta al administrador; no pruebes ajustes desconocidos.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'enable-memory-integrity',
          title: 'Corrige solo el ajuste que falta',
          summary:
            'Confirma el modelo y resuelve los avisos antes de continuar.',
          actions: [
            'Si la virtualización está habilitada, no quedan avisos y la integridad de memoria está desactivada, actívala en Aislamiento del núcleo y reinicia según se indique.',
            'Si falta el interruptor, está gris o persiste el aviso, consulta el apartado correspondiente de Riot y al fabricante. Esta página no es un procedimiento para actualizar BIOS o cambiar todos los ajustes.',
            'Windows Home o la ausencia de la casilla Hyper-V no demuestran incompatibilidad por sí solos. Facilita edición de Windows, CPU y estado de VBS/HVCI al soporte.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'medium',
        },
        {
          id: 'verify-hvci',
          title: 'Vuelve a comprobar HVCI y el número tras reiniciar',
          summary:
            'Consulta a Riot si el error continúa con los estados requeridos presentes.',
          actions: [
            'Abre msinfo32, confirma VBS en ejecución y HVCI entre sus servicios activos; después inicia VALORANT.',
            'Si persiste RESTRICTION 5, facilita a Riot modelo, Windows, ambas lecturas, controladores señalados, cambios y mensaje completo tras reiniciar.',
            'Comparte solo los registros solicitados por el soporte oficial. No publiques claves de recuperación ni datos privados.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
      ],
      avoid: [
        'No desactives VBS o la integridad de memoria para evitar el error.',
        'No borres manualmente archivos .sys incompatibles.',
        'No pruebes cambios de almacenamiento ni borres o cambies el TPM.',
      ],
      cautions: [
        'Fuentes consultadas el 2026-10-14; no se afirma reproducción en el juego ni una reparación comprobada en un PC.',
        'Detente y consulta al fabricante si las instrucciones no coinciden, no sabes cómo recuperar el equipo o Windows deja de arrancar.',
      ],
      faqs: [
        {
          question: '¿Basta con que VBS esté en ejecución?',
          answer:
            'Comprueba también HVCI entre los servicios activos y si el juego sigue mostrando el mismo número. VBS o virtualización de CPU habilitada no demuestran el éxito por sí solos.',
        },
        {
          question:
            'La integridad de memoria está activada, pero sigue el error 5.',
          answer:
            'Anota por separado el interruptor, VBS y los servicios activos. Si no hay avisos ni requisitos ausentes evidentes, consulta a Riot en vez de cambiar ajustes repetidamente.',
        },
      ],
      related: [
        {
          href: '/es/games/valorant/van9005',
          label: 'VAN9005: TPM, UEFI e integridad de memoria',
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
  relatedSlugs: ['van9005', 'van9003', 'van9001', 'not-launching-no-van'],
};
