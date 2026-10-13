import type { GameGuide } from '@/lib/games';
import type { LocalizedHub } from '@/lib/localized/hubs';

export const launchGameGuides: GameGuide[] = [
  {
    title: 'VALORANT',
    shortTitle: 'VALORANT',
    hubTitle: 'VALORANTのVAN9003・VAN9001確認ガイド【PC版】',
    lead: 'VAN9003はセキュアブート、VAN9001はTPM 2.0の状態から確認します。表示された番号で記事を選び、ファームウェア変更前に回復キー・バックアップ・機種別の公式手順を確認してください。',
    accent: '#bd3047',
    demand: 'Windows PC版・Riot Vanguard',
    tags: ['VAN9003', 'VAN9001', 'セキュアブート', 'TPM 2.0', '起動しない'],
    launchFixes: [
      'エラー番号と全文を記録し、VAN9003とVAN9001の専用記事を選ぶ。',
      '最初はmsinfo32またはtpm.mscで表示を読む。Windowsの版だけで要否を決めない。',
      'バックアップ、回復キー、機種別手順が不明なら変更を止め、メーカーや管理者へ相談する。',
    ],
    slug: 'valorant',
    updated: '2026-10-13',
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    mod: '',
    japanese: '',
    specs: {
      minimum: '',
      recommended: '',
      storage: '',
    },
    sources: [
      {
        label: 'Riot：VAN9003の意味（英語）',
        url: 'https://support.riotgames.com/en-us/riot/client/error-van-9003',
      },
      {
        label: 'Riot：Secure Bootの状態とメーカー別案内（英語）',
        url: 'https://support.riotgames.com/en-us/riot/client/secure-boot-guide',
      },
      {
        label: 'Microsoft：BitLocker回復キーを確認する（英語）',
        url: 'https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key',
      },
      {
        label: 'Riot：Vanguardのセキュリティ要件（英語）',
        url: 'https://support.riotgames.com/en-us/riot/performance/vanguard-security-requirements/',
      },
      {
        label: 'Riot：VAN9001の意味（英語）',
        url: 'https://support.riotgames.com/en-us/riot/client/error-van-9001',
      },
      {
        label: 'Riot：TPMの状態・仕様とメーカー案内（英語）',
        url: 'https://support.riotgames.com/en-us/riot/client/enable-tpm-20',
      },
    ],
  },
  {
    title: 'Apex Legends',
    shortTitle: 'Apex Legends',
    hubTitle: 'Apex Legendsのr5apex.exe・起動エラー確認ガイド【PC版】',
    lead: 'r5apex.exeを含む起動エラーの専用記事への案内です。EA appとSteamを分け、エラー全文・止まった段階から修復と次の相談先を選びます。',
    accent: '#a13b31',
    demand: 'Windows PC版・EA app／Steam',
    tags: ['r5apex.exe', '起動しない', 'EA app', 'Steam', '修復'],
    launchFixes: [
      'エラー全文、利用ランチャー、起動前かゲーム起動後かを記録する。',
      'EA appの修復とSteamの整合性確認は別の手順。実際のランチャーに合わせる。',
      'Preparing、30005、Apex_crash.txtは同じ原因と決めつけず、専用記事の分岐から公式案内へ進む。',
    ],
    slug: 'apex-legends',
    updated: '2026-10-13',
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    mod: '',
    japanese: '',
    specs: {
      minimum: '',
      recommended: '',
      storage: '',
    },
    sources: [
      {
        label: 'EA：Apexのエラーコード・r5apex.exe',
        url: 'https://help.ea.com/ja/articles/apex-legends/error-codes/',
      },
      {
        label: 'EA：EA appのダウンロード・インストール・読込み',
        url: 'https://help.ea.com/ja/articles/orders-and-rewards/ea-app-game-download-installation-loading-not-working/',
      },
      {
        label: 'Steam：ゲームファイルの整合性確認（英語）',
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      },
    ],
  },
];

export const launchLocalizedHubs: Record<string, LocalizedHub> = {
  valorant: {
    focused: true,
    noindex: false,
    names: {
      en: 'VALORANT',
      zh: 'VALORANT',
      es: 'VALORANT',
    },
    title: {
      en: 'VALORANT VAN9003 and VAN9001: PC Checks',
      zh: 'VALORANT VAN9003 与 VAN9001：PC 检查指南',
      es: 'VALORANT VAN9003 y VAN9001: comprobaciones en PC',
    },
    checkedAt: '2026-10-13',
    lead: {
      en: 'Choose VAN9003 for Secure Boot or VAN9001 for TPM 2.0. Read the current state before considering firmware changes.',
      zh: 'VAN9003 查看安全启动，VAN9001 查看 TPM 2.0。先读取当前状态，再判断是否需要修改固件。',
      es: 'Elige VAN9003 para arranque seguro o VAN9001 para TPM 2.0. Consulta primero el estado antes de plantear cambios de firmware.',
    },
    intro: {
      en: 'Match the exact code and complete message to the guides below. Prepare a backup and access to the encryption recovery key from another device before any firmware work. If the PC is managed or the model is unclear, ask its administrator or manufacturer.',
      zh: '按准确编号与完整提示选择下方指南。固件操作前，先备份并确认能从另一台设备取得加密恢复密钥。受管理电脑或机型不明确时，咨询管理员或厂商。',
      es: 'Elige la guía por el código y mensaje completos. Antes de tocar firmware, prepara una copia y acceso a la clave del cifrado desde otro dispositivo. Si el equipo está gestionado o desconoces el modelo, consulta al administrador o fabricante.',
    },
    sources: [
      {
        url: 'https://support.riotgames.com/en-us/riot/client/error-van-9003',
        label: {
          en: 'Riot: error VAN9003',
          zh: 'Riot：VAN9003 含义（英语）',
          es: 'Riot: error VAN9003 (inglés)',
        },
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/client/secure-boot-guide',
        label: {
          en: 'Riot: Secure Boot state and manufacturer resources',
          zh: 'Riot：安全启动状态与厂商说明（英语）',
          es: 'Riot: estado de Secure Boot y recursos del fabricante (inglés)',
        },
      },
      {
        url: 'https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key',
        label: {
          en: 'Microsoft: find your BitLocker recovery key',
          zh: 'Microsoft：查找 BitLocker 恢复密钥（英语）',
          es: 'Microsoft: encontrar la clave de recuperación de BitLocker (inglés)',
        },
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/performance/vanguard-security-requirements/',
        label: {
          en: 'Riot: Vanguard security requirements',
          zh: 'Riot：Vanguard 安全要求（英语）',
          es: 'Riot: requisitos de seguridad de Vanguard (inglés)',
        },
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/client/error-van-9001',
        label: {
          en: 'Riot: error VAN9001',
          zh: 'Riot：VAN9001 含义（英语）',
          es: 'Riot: error VAN9001 (inglés)',
        },
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/client/enable-tpm-20',
        label: {
          en: 'Riot: TPM readiness, specification and manufacturer guidance',
          zh: 'Riot：TPM 状态、规范及厂商说明（英语）',
          es: 'Riot: estado, especificación de TPM y guía del fabricante (inglés)',
        },
      },
    ],
  },
  'apex-legends': {
    focused: true,
    noindex: true,
    names: {
      en: 'Apex Legends',
      zh: 'Apex Legends',
      es: 'Apex Legends',
    },
    title: {
      en: 'Apex Legends: r5apex.exe and PC Launch Errors',
      zh: 'Apex Legends：r5apex.exe 与 PC 启动错误',
      es: 'Apex Legends: r5apex.exe y errores de inicio en PC',
    },
    checkedAt: '2026-10-13',
    lead: {
      en: 'Start with the r5apex.exe launch-error guide. Separate EA app from Steam and record the full message and failure stage.',
      zh: '从 r5apex.exe 启动错误指南开始。区分 EA app 与 Steam，记录完整提示和失败阶段。',
      es: 'Empieza por la guía de errores r5apex.exe. Distingue EA app y Steam y registra el mensaje completo y la fase del fallo.',
    },
    intro: {
      en: 'The article below explains repair and verification for each launcher, Windows update checks and what to record if the error remains. Preparing, 30005 and crashes after launch are separate branches. Use official support instead of downloading replacement executable files.',
      zh: '下方专文说明两种启动器的修复方式、Windows 更新检查和问题持续时的记录。Preparing、30005 与启动后崩溃分别处理，不从第三方下载替代可执行文件。',
      es: 'La guía distingue la reparación de cada lanzador, Windows Update y los datos para soporte. Preparing, 30005 y cierres tras iniciar tienen ramas separadas. No descargues ejecutables de sustitución de terceros.',
    },
    sources: [
      {
        url: 'https://help.ea.com/ja/articles/apex-legends/error-codes/',
        label: {
          en: 'EA: Apex error codes and r5apex.exe (Japanese)',
          zh: 'EA：Apex 错误代码与 r5apex.exe（日语）',
          es: 'EA: códigos de Apex y r5apex.exe (japonés)',
        },
      },
      {
        url: 'https://help.ea.com/ja/articles/orders-and-rewards/ea-app-game-download-installation-loading-not-working/',
        label: {
          en: 'EA: EA app download, installation and loading help (Japanese)',
          zh: 'EA：EA app 下载、安装与加载帮助（日语）',
          es: 'EA: descargas, instalación y carga en EA app (japonés)',
        },
      },
      {
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
        label: {
          en: 'Steam: verify integrity of game files',
          zh: 'Steam：验证游戏文件完整性（英语）',
          es: 'Steam: verificar integridad de los archivos (inglés)',
        },
      },
    ],
  },
};
