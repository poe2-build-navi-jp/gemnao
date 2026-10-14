import type { FollowupGuide } from './types';

export const valorantVan9001Guide: FollowupGuide = {
  gameSlug: 'valorant',
  gameName: 'VALORANT',
  slug: 'van9001',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://support.riotgames.com/en-us/riot/client/error-van-9001',
      labels: {
        ja: 'Riot：VAN9001の意味（英語）',
        en: 'Riot: error VAN9001',
        zh: 'Riot：VAN9001 含义（英语）',
        es: 'Riot: error VAN9001 (inglés)',
      },
    },
    {
      url: 'https://support.riotgames.com/en-us/riot/client/enable-tpm-20',
      labels: {
        ja: 'Riot：TPMの状態・仕様とメーカー案内（英語）',
        en: 'Riot: TPM readiness, specification and manufacturer guidance',
        zh: 'Riot：TPM 状态、规范及厂商说明（英语）',
        es: 'Riot: estado, especificación de TPM y guía del fabricante (inglés)',
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
      title: 'VALORANTのVAN9001：TPM 2.0の状態・バージョンを確認する手順',
      shortTitle: 'VAN9001・TPM 2.0',
      description:
        'VAN9001が出たらtpm.mscで状態と仕様バージョンを確認。2.0・1.2・未検出を分け、TPMクリアをせず、回復キーと機種別の対応を確認します。',
      lead: 'Windows PC版VALORANTでVAN9001やTPM 2.0を求める表示が出た場合向けです。TPMが見つからない表示を、部品がない証拠とは扱いません。',
      summary:
        'RiotはVAN9001を、必要なTPM 2.0が有効として検出されていない状態と説明しています。まずtpm.mscで使用準備の状態と仕様バージョンを読みます。TPMをクリアせず、ファームウェア変更前にバックアップ・暗号化の回復キー・正確な機種の公式手順を確認してください。',
      quickFacts: [
        {
          label: '最初の確認',
          value: 'tpm.msc：状態と仕様バージョン',
        },
        {
          label: '未検出の場合',
          value: '無効・未検出・機種非対応を区別。無搭載と即断しない',
        },
        {
          label: '2.0で準備完了',
          value: 'クリアせず再起動し、残るエラー全文を確認',
        },
      ],
      diagnosis: [
        {
          symptom: 'VAN9001か番号が不明',
          cause: '全文とPCの管理者を確認',
          stepId: 'record-van9001',
        },
        {
          symptom: '準備完了・仕様2.0',
          cause: '再起動後の結果を確認',
          stepId: 'recheck-tpm-error',
        },
        {
          symptom: '仕様1.2、またはTPMが見つからない',
          cause: '機種対応と公式手順を確認',
          stepId: 'check-tpm-support',
        },
        {
          symptom: 'tpm.mscが開かない',
          cause: 'Windowsセキュリティの表示も確認',
          stepId: 'read-tpm-state',
        },
      ],
      steps: [
        {
          id: 'record-van9001',
          title: '番号と変更前の準備を確認する',
          summary: '回復手段を確保してから設定変更の要否を考えます。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'VAN RESTRICTION 5やVAN9005なら番号が異なるため、このSTEPのリンクと関連記事から専用の確認へ進む。',
            'エラー番号・全文・時刻・Windowsの版を記録する。VAN9003ならセキュアブートの専用記事へ進む。',
            '職場・学校のPCは管理者へ相談する。自分のPCでも、重要データのバックアップとBitLocker／デバイス暗号化の回復キーを別端末から確認できることを先に確かめる。',
            '回復キーや機種名が不明なら変更しない。キーを公開の回答欄、画像、相談文へ貼り付けない。',
          ],
          guideLink: {
            href: '/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5：HVCIの確認',
          },
        },
        {
          id: 'read-tpm-state',
          title: 'tpm.mscで状態と仕様を読む',
          summary: '有効かどうかと、バージョンを別々に確認します。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            'Windows＋Rでtpm.mscを開き、使用する準備ができている旨の状態と、「TPM製造元情報」の「仕様バージョン」を控える。',
            '準備完了かつ2.0ならSTEP 4へ。1.2または互換TPMが見つからない場合はSTEP 3へ進み、クリアや初期化を選ばない。',
            '画面が開かない場合は「Windowsセキュリティ」→「デバイスセキュリティ」→セキュリティプロセッサの詳細も確認する。表示がないだけで部品の故障・無搭載と判断しない。',
          ],
          note: '読むだけなら戻す設定はありません。「製造元バージョン」と「仕様バージョン」を取り違えないでください。',
        },
        {
          id: 'check-tpm-support',
          title: '機種対応とメーカーの案内を確認する',
          summary: '1.2や未検出の原因を、部品購入や設定切替の前に確認します。',
          time: '確認に約3〜5分',
          risk: 'medium',
          actions: [
            '正確なPC・マザーボードの機種名でメーカー公式サポートを確認する。RiotのTPMガイドにもメーカー窓口がある。',
            'Intel PTT／AMD fTPMなどの名称や対応は機種により異なる。画面が案内と違う、2.0への対応が不明な場合は変更せずメーカーへ相談する。',
            'バックアップ、回復キー、現在の設定と復旧方法を確認したうえで、必要な操作だけを機種別の公式手順に従う。TPMバージョンや種類の切替でも鍵が失われる場合があるため、自己判断で切り替えない。',
          ],
          note: 'この汎用記事ではTPMクリア、TPM種類の切替、BIOS更新を手順化しません。準備完了のTPMを試しに消すことは避けます。',
        },
        {
          id: 'recheck-tpm-error',
          title: '再起動後に2.0と残存エラーを確認する',
          summary: 'TPMの表示とゲームの起動結果を分けて記録します。',
          time: '確認に約3〜5分',
          risk: 'low',
          actions: [
            '作業を保存して再起動し、tpm.mscで準備完了と仕様2.0を確認してからVALORANTを起動する。',
            '止まる場合はVAN9001のままか、VAN: RESTRICTIONなど別の表示かを全文で確認する。要件を推測してTPMを切り替えない。',
            'Riotへ機種名、Windowsの版、TPM状態・仕様バージョン、変更の有無、再起動後のエラーを伝える。回復キーを含めない。',
          ],
          guideLink: {
            href: '/games/valorant/van9003',
            label: '別のVAN番号が出た場合の確認',
          },
        },
      ],
      avoid: [
        'TPMをクリア・初期化しない',
        '未検出だけでTPMを購入したり、バージョンや種類を切り替えたりしない',
        'Vanguard、TPM、ウイルス対策を無効にして回避しない',
      ],
      cautions: [
        'TPMやファームウェアの変更で暗号化の回復キーが必要になる場合があります。確認できなければ停止します。',
        'Windows 11だけのエラーとは断定しません。現在のRiot要件と実際のエラーを確認してください。',
      ],
      faqs: [
        {
          question: 'TPMが見つからないなら新しく買う必要がありますか？',
          answer:
            '表示だけでは決められません。無効・未検出の可能性もあるため、機種がTPM 2.0やファームウェアTPMに対応するかをメーカーに確認します。',
        },
        {
          question: 'TPM 2.0で準備完了なのにエラーが残る時は？',
          answer:
            '再起動後のエラー全文をRiotへ伝えます。VAN: RESTRICTIONは別の構成要件を示すことがあるため、VAN9001と同じものと考えてTPMをクリア・切替しないでください。',
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
          href: '/games/valorant/van9003',
          label: 'VAN9003：セキュアブートの状態を確認する',
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
      title: 'VALORANT VAN9001: Check TPM 2.0 Status and Specification Version',
      shortTitle: 'VAN9001 and TPM 2.0',
      description:
        'Use tpm.msc to separate TPM 2.0, version 1.2 and not-detected results for VAN9001. Check recovery access and model support without clearing TPM.',
      lead: 'For VAN9001 or a TPM 2.0 requirement shown by VALORANT on a Windows PC. A not-found message alone does not prove that a TPM is physically absent.',
      summary:
        'Riot says VAN9001 means the required TPM 2.0 is not detected as enabled. First read readiness and Specification Version in tpm.msc. Do not clear TPM. Before firmware changes, confirm a backup, access to your encryption recovery key and the official instructions for the exact PC model.',
      quickFacts: [
        {
          label: 'Read first',
          value: 'tpm.msc: status and Specification Version',
        },
        {
          label: 'Not detected',
          value: 'Separate disabled, undetected and unsupported hardware',
        },
        {
          label: 'Ready with 2.0',
          value: 'Restart and record the remaining error without clearing TPM',
        },
      ],
      diagnosis: [
        {
          symptom: 'Unsure whether the code is VAN9001',
          cause: 'Record the full message and PC ownership',
          stepId: 'record-van9001',
        },
        {
          symptom: 'Ready and Specification Version 2.0',
          cause: 'Check the result after restart',
          stepId: 'recheck-tpm-error',
        },
        {
          symptom: 'Version 1.2 or compatible TPM not found',
          cause: 'Check model support and official instructions',
          stepId: 'check-tpm-support',
        },
        {
          symptom: 'tpm.msc will not open',
          cause: 'Also check Windows Security',
          stepId: 'read-tpm-state',
        },
      ],
      steps: [
        {
          id: 'record-van9001',
          title: 'Record the code and prepare recovery access',
          summary:
            'Have recovery options before considering any setting changes.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'For VAN RESTRICTION 5 or VAN9005, use this step’s link and related guides for that exact number.',
            'Record the code, full message, time and Windows version. For VAN9003, use the Secure Boot article.',
            'Ask the administrator of a work or school PC. On your own PC, first back up important files and confirm you can access the BitLocker/device-encryption recovery key from another device.',
            'Stop before changes if the key or model is unknown. Do not put recovery keys in public feedback, screenshots or support descriptions.',
          ],
          guideLink: {
            href: '/en/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5: HVCI checks',
          },
        },
        {
          id: 'read-tpm-state',
          title: 'Read TPM readiness and version',
          summary:
            'Enabled status and specification version are separate checks.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'Press Windows + R, enter tpm.msc and read the status. Record Specification Version under TPM Manufacturer Information.',
            'For ready with version 2.0, go to Step 4. For 1.2 or compatible TPM not found, go to Step 3 without choosing Clear or initialization.',
            'If the console will not open, also check Windows Security → Device security → Security processor details. Missing information alone does not prove missing or broken hardware.',
          ],
          note: 'Reading the state needs no rollback. Do not confuse Manufacturer Version with Specification Version.',
        },
        {
          id: 'check-tpm-support',
          title: 'Check model support with the manufacturer',
          summary:
            'Establish why TPM is 1.2 or undetected before buying hardware or switching modes.',
          time: 'About 3–5 minutes to check',
          risk: 'medium',
          actions: [
            'Find the official support page for your exact PC or motherboard model. Riot’s TPM guide also links to manufacturer resources.',
            'Names such as Intel PTT and AMD fTPM, availability and menus depend on the model. Ask the manufacturer if the screen differs or 2.0 support is unclear.',
            'Only follow the model’s official procedure after confirming backup, recovery-key access, original settings and recovery steps. Switching TPM versions or types can lose keys; do not switch on speculation.',
          ],
          note: 'This general guide does not provide TPM clearing, TPM-type switching or BIOS-update instructions. Do not erase a ready TPM as a test.',
        },
        {
          id: 'recheck-tpm-error',
          title: 'Recheck 2.0 and the error after restart',
          summary:
            'Record TPM status separately from whether the game launches.',
          time: 'About 3–5 minutes to check',
          risk: 'low',
          actions: [
            'Save work, restart the PC, check readiness and Specification Version 2.0 in tpm.msc, then launch VALORANT.',
            'If blocked, record whether it is still VAN9001 or a different message such as VAN: RESTRICTION. Do not infer a requirement and switch TPM types.',
            'Give Riot the model, Windows version, TPM status/version, any changes and the post-restart error. Exclude recovery keys.',
          ],
          guideLink: {
            href: '/en/games/valorant/van9003',
            label: 'Check the other VAN error',
          },
        },
      ],
      avoid: [
        'Do not clear or initialize TPM',
        'Do not buy a TPM or switch its version/type based only on a not-detected message',
        'Do not disable Vanguard, TPM or antivirus protection to bypass the check',
      ],
      cautions: [
        'TPM or firmware changes may require the encryption recovery key. Stop if you cannot confirm access.',
        'Do not assume this error is exclusive to Windows 11. Match the actual message to current Riot requirements.',
      ],
      faqs: [
        {
          question: 'Does TPM not found mean I need to buy one?',
          answer:
            'No. It can be disabled or undetected. Ask the manufacturer whether your exact model supports TPM 2.0 or firmware TPM before purchasing hardware.',
        },
        {
          question: 'What if TPM 2.0 is ready but the game still blocks me?',
          answer:
            'Give Riot the full message after restarting. VAN: RESTRICTION can refer to different configuration requirements; do not treat it as identical to VAN9001 or clear/switch TPM on that basis.',
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
          href: '/en/games/valorant/van9003',
          label: 'VAN9003: check Secure Boot',
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
      title: 'VALORANT VAN9001：检查 TPM 2.0 状态与规范版本',
      shortTitle: 'VAN9001 与 TPM 2.0',
      description:
        '用 tpm.msc 区分 TPM 2.0、1.2 与未检测到的情况。不要清除 TPM，先确认恢复密钥、机型支持及对应官方说明。',
      lead: '适用于 Windows PC 版 VALORANT 显示 VAN9001 或要求 TPM 2.0 的情况。仅凭未找到提示，不能断定电脑没有 TPM。',
      summary:
        'Riot 说明 VAN9001 表示所需的 TPM 2.0 未被检测为已启用。先在 tpm.msc 查看就绪状态与规范版本，不要清除 TPM。更改固件前，应确认备份、加密恢复密钥的访问方式以及准确机型的官方说明。',
      quickFacts: [
        {
          label: '首先读取',
          value: 'tpm.msc：状态与规范版本',
        },
        {
          label: '未检测到',
          value: '区分被禁用、未识别和机型不支持',
        },
        {
          label: '已就绪且为 2.0',
          value: '不清除 TPM，重启并记录剩余错误',
        },
      ],
      diagnosis: [
        {
          symptom: '不确定是否为 VAN9001',
          cause: '记录完整提示与电脑管理者',
          stepId: 'record-van9001',
        },
        {
          symptom: '已就绪且规范版本为 2.0',
          cause: '检查重启后的结果',
          stepId: 'recheck-tpm-error',
        },
        {
          symptom: '版本 1.2 或找不到兼容 TPM',
          cause: '确认机型支持与官方说明',
          stepId: 'check-tpm-support',
        },
        {
          symptom: 'tpm.msc 无法打开',
          cause: '也查看 Windows 安全中心',
          stepId: 'read-tpm-state',
        },
      ],
      steps: [
        {
          id: 'record-van9001',
          title: '记录编号并准备恢复方式',
          summary: '先保证恢复途径，再判断是否要修改设置。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '若显示 VAN RESTRICTION 5 或 VAN9005，请通过本步骤链接及相关文章检查对应编号。',
            '记录编号、完整提示、时间及 Windows 版本；VAN9003 请看安全启动专文。',
            '工作或学校电脑先咨询管理员。个人电脑也要先备份重要文件，确认可从另一台设备取得 BitLocker／设备加密恢复密钥。',
            '密钥或机型不清楚时停止修改，不把恢复密钥放入公开反馈、截图或咨询描述。',
          ],
          guideLink: {
            href: '/zh/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5：HVCI 检查',
          },
        },
        {
          id: 'read-tpm-state',
          title: '读取就绪状态与规范版本',
          summary: '是否启用和版本是否符合要求要分别确认。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '按 Windows + R，输入 tpm.msc，读取状态并记录 TPM 制造商信息下的规范版本。',
            '已就绪且为 2.0 时进入第 4 步；1.2 或找不到兼容 TPM 时进入第 3 步，不选择清除或初始化。',
            '控制台打不开时，也查看 Windows 安全中心→设备安全性→安全处理器详细信息。缺少显示不等于硬件缺失或损坏。',
          ],
          note: '查看状态无需还原；不要把制造商版本误当成规范版本。',
        },
        {
          id: 'check-tpm-support',
          title: '向厂商确认机型支持',
          summary: '购买硬件或切换模式前，先确认 1.2 或未检测到的原因。',
          time: '检查约需 3–5 分钟',
          risk: 'medium',
          actions: [
            '按电脑或主板的准确型号查官方支持；Riot 的 TPM 指南也列有厂商入口。',
            'Intel PTT、AMD fTPM 等名称、支持情况和菜单因机型而异。界面不符或不确定支持 2.0 时先咨询厂商。',
            '确认备份、恢复密钥、原设置与恢复步骤后，才按该机型的官方说明操作。切换 TPM 版本或类型可能丢失密钥，不要凭猜测切换。',
          ],
          note: '本通用指南不提供清除 TPM、切换类型或更新 BIOS 的操作；不要为测试而清除已就绪的 TPM。',
        },
        {
          id: 'recheck-tpm-error',
          title: '重启后再确认 2.0 与错误',
          summary: '分别记录 TPM 状态和游戏是否启动。',
          time: '检查约需 3–5 分钟',
          risk: 'low',
          actions: [
            '保存工作并重启，在 tpm.msc 确认已就绪及规范版本 2.0，再启动 VALORANT。',
            '仍受阻时，记录是 VAN9001 还是 VAN: RESTRICTION 等其他完整提示，不推测要求后就切换 TPM 类型。',
            '向 Riot 提供机型、Windows 版本、TPM 状态与规范版本、修改情况及重启后的错误；不要附上恢复密钥。',
          ],
          guideLink: {
            href: '/zh/games/valorant/van9003',
            label: '检查另一个 VAN 错误',
          },
        },
      ],
      avoid: [
        '不要清除或初始化 TPM',
        '不要只凭未检测到提示购买 TPM 或切换版本、类型',
        '不要禁用 Vanguard、TPM 或杀毒防护绕过检查',
      ],
      cautions: [
        'TPM 或固件修改可能触发加密恢复密钥要求，无法确认密钥时应停止。',
        '不能断定错误只发生于 Windows 11；应按实际提示检查 Riot 的现行要求。',
      ],
      faqs: [
        {
          question: '找不到 TPM 就要买一个吗？',
          answer:
            '不一定。也可能被禁用或未检测到，购买前先向厂商确认准确机型是否支持 TPM 2.0 或固件 TPM。',
        },
        {
          question: '2.0 已就绪仍被阻止怎么办？',
          answer:
            '重启后把完整提示交给 Riot。VAN: RESTRICTION 可能涉及不同配置要求，不要当成同一种错误而清除或切换 TPM。',
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
          href: '/zh/games/valorant/van9003',
          label: 'VAN9003：检查安全启动',
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
        'VALORANT VAN9001: comprueba TPM 2.0 y su versión de especificación',
      shortTitle: 'VAN9001 y TPM 2.0',
      description:
        'Consulta tpm.msc para distinguir TPM 2.0, 1.2 y no detectado. No borres TPM: confirma la recuperación, la compatibilidad y las instrucciones del modelo.',
      lead: 'Para VAN9001 o un requisito de TPM 2.0 en VALORANT para Windows. Que no se encuentre TPM no demuestra por sí solo que falte físicamente.',
      summary:
        'Según Riot, VAN9001 indica que no se detecta como habilitado el TPM 2.0 requerido. Primero consulta el estado y la versión de especificación en tpm.msc. No borres TPM. Antes de modificar firmware, confirma la copia, el acceso a la clave de recuperación y las instrucciones oficiales del modelo exacto.',
      quickFacts: [
        {
          label: 'Primera consulta',
          value: 'tpm.msc: estado y versión de especificación',
        },
        {
          label: 'No detectado',
          value: 'Distingue desactivado, no detectado y no compatible',
        },
        {
          label: 'Listo y versión 2.0',
          value: 'Reinicia y registra el error sin borrar TPM',
        },
      ],
      diagnosis: [
        {
          symptom: 'No sabes si el código es VAN9001',
          cause: 'Anota el mensaje y quién gestiona el PC',
          stepId: 'record-van9001',
        },
        {
          symptom: 'Listo y versión de especificación 2.0',
          cause: 'Revisa el resultado tras reiniciar',
          stepId: 'recheck-tpm-error',
        },
        {
          symptom: 'Versión 1.2 o TPM compatible no encontrado',
          cause: 'Consulta compatibilidad y guía oficial',
          stepId: 'check-tpm-support',
        },
        {
          symptom: 'tpm.msc no se abre',
          cause: 'Comprueba también Seguridad de Windows',
          stepId: 'read-tpm-state',
        },
      ],
      steps: [
        {
          id: 'record-van9001',
          title: 'Anota el código y prepara la recuperación',
          summary: 'Ten opciones de recuperación antes de plantear cambios.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Para VAN RESTRICTION 5 o VAN9005, usa el enlace de este paso y las guías relacionadas para ese número.',
            'Anota el código, el mensaje, la hora y Windows. Si es VAN9003, consulta el artículo de arranque seguro.',
            'En un equipo de trabajo o estudios consulta al administrador. En uno propio, respalda primero los archivos y confirma el acceso a la clave de BitLocker/cifrado desde otro dispositivo.',
            'Si desconoces la clave o el modelo, no cambies nada. No publiques claves en comentarios, capturas ni descripciones de soporte.',
          ],
          guideLink: {
            href: '/es/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5: comprobaciones de HVCI',
          },
        },
        {
          id: 'read-tpm-state',
          title: 'Lee el estado y la versión de TPM',
          summary: 'Comprueba por separado si está listo y qué versión tiene.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Pulsa Windows + R, escribe tpm.msc y consulta el estado. Anota la versión de especificación en la información del fabricante de TPM.',
            'Si está listo y es 2.0, pasa al paso 4. Si es 1.2 o no se encuentra TPM compatible, pasa al paso 3 sin elegir borrar o inicializar.',
            'Si la consola no abre, consulta Seguridad de Windows → Seguridad del dispositivo → Detalles del procesador de seguridad. Que falte información no demuestra ausencia ni avería del hardware.',
          ],
          note: 'Leer el estado no requiere revertir ajustes. No confundas la versión del fabricante con la versión de especificación.',
        },
        {
          id: 'check-tpm-support',
          title: 'Consulta la compatibilidad del modelo',
          summary:
            'Aclara por qué aparece 1.2 o no detectado antes de comprar o cambiar modos.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'medium',
          actions: [
            'Busca el soporte oficial del modelo exacto de PC o placa. La guía de TPM de Riot también enlaza recursos de fabricantes.',
            'Los nombres Intel PTT o AMD fTPM, los menús y la compatibilidad dependen del modelo. Consulta al fabricante si la pantalla difiere o no sabes si admite 2.0.',
            'Solo sigue sus instrucciones tras confirmar la copia, la clave, los ajustes originales y la recuperación. Cambiar la versión o tipo de TPM puede hacer perder claves: no lo hagas por suposición.',
          ],
          note: 'Esta guía general no explica cómo borrar TPM, cambiar su tipo ni actualizar BIOS. No borres un TPM listo para hacer una prueba.',
        },
        {
          id: 'recheck-tpm-error',
          title: 'Revisa 2.0 y el error tras reiniciar',
          summary:
            'Registra el estado de TPM y el inicio del juego por separado.',
          time: 'Unos 3–5 minutos para comprobar',
          risk: 'low',
          actions: [
            'Guarda el trabajo, reinicia, confirma que TPM está listo y su especificación es 2.0 en tpm.msc; después abre VALORANT.',
            'Si sigue bloqueado, anota si es VAN9001 o un mensaje diferente como VAN: RESTRICTION. No supongas un requisito y cambies el tipo de TPM.',
            'Comunica a Riot el modelo, Windows, estado y versión de TPM, cambios y error tras reiniciar. Excluye claves de recuperación.',
          ],
          guideLink: {
            href: '/es/games/valorant/van9003',
            label: 'Comprobar el otro error VAN',
          },
        },
      ],
      avoid: [
        'No borres ni inicialices TPM',
        'No compres TPM ni cambies su tipo o versión solo porque no se detecta',
        'No desactives Vanguard, TPM ni antivirus para eludir la comprobación',
      ],
      cautions: [
        'Los cambios de TPM o firmware pueden requerir la clave del cifrado. Detente si no confirmas el acceso.',
        'No supongas que el error es exclusivo de Windows 11: compara el mensaje con los requisitos actuales de Riot.',
      ],
      faqs: [
        {
          question: '¿TPM no encontrado significa que debo comprar uno?',
          answer:
            'No. Puede estar desactivado o no detectado. Antes de comprar, consulta si el modelo exacto admite TPM 2.0 o TPM por firmware.',
        },
        {
          question: '¿Y si TPM 2.0 está listo pero el juego sigue bloqueado?',
          answer:
            'Comunica a Riot el mensaje completo tras reiniciar. VAN: RESTRICTION puede indicar otros requisitos; no lo trates como VAN9001 ni borres o cambies TPM por ese motivo.',
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
          href: '/es/games/valorant/van9003',
          label: 'VAN9003: comprobar arranque seguro',
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
    'van9003',
    'not-launching-no-van',
  ],
};
