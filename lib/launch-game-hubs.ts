import type { GameGuide } from '@/lib/games';
import type { LocalizedHub } from '@/lib/localized/hubs';

export const launchGameGuides: GameGuide[] = [
  {
    title: 'VALORANT',
    shortTitle: 'VALORANT',
    hubTitle: 'VALORANTの起動・VAN9003・VAN9001確認ガイド【PC版】',
    lead: 'VAN番号なしの起動失敗、VAN9003のSecure Boot、VAN9001のTPMを分けて選びます。表示された全文に合う記事から確認してください。',
    accent: '#bd3047',
    demand: 'Windows PC版・Riot Vanguard',
    tags: ['起動しない', 'VAN9003', 'VAN9001', 'セキュアブート', 'TPM 2.0'],
    launchFixes: [
      'VAN番号なしはRiot Client修復、VAN9003はSecure Boot、VAN9001はTPMの専用記事へ。',
      '番号と全文、止まる段階を記録し、関係のない設定変更を重ねない。',
      'ファームウェア変更はバックアップ・回復キー・機種別公式手順が揃うまで進めない。',
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
        url: 'https://support.riotgames.com/en-us/riot/client/error-van-9003',
        label: 'Riot：VAN9003の意味（英語）',
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/client/secure-boot-guide',
        label: 'Riot：Secure Bootの状態とメーカー別案内（英語）',
      },
      {
        url: 'https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key',
        label: 'Microsoft：BitLocker回復キーを確認する（英語）',
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/performance/vanguard-security-requirements/',
        label: 'Riot：Vanguardのセキュリティ要件（英語）',
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/client/error-van-9001',
        label: 'Riot：VAN9001の意味（英語）',
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/client/enable-tpm-20',
        label: 'Riot：TPMの状態・仕様とメーカー案内（英語）',
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/connectivity/riot-client-full-repair-tool',
        label: 'Riot：クライアントの完全修復（英語）',
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/performance/troubleshooting-game-launching-errors',
        label: 'Riot：ゲーム起動エラーの分岐（英語）',
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/performance/uninstall-and-disable-vanguard',
        label: 'Riot：Vanguardの通常アンインストール・再導入（英語）',
      },
    ],
  },
  {
    title: 'Apex Legends',
    shortTitle: 'Apex Legends',
    hubTitle: 'Apex Legendsの起動・クラッシュ・接続エラー確認ガイド【PC版】',
    lead: 'r5apex.exeの起動エラー、Apex_crash.txtのクラッシュ、code:net／leafの接続問題を分けます。全文と発生段階に合う記事を選び、修復と回線確認を混同しません。',
    accent: '#a13b31',
    demand: 'Windows PC版・EA app／Steam',
    tags: [
      'r5apex.exe',
      'Apex_crash.txt',
      'code:net',
      'code:leaf',
      '起動しない',
    ],
    launchFixes: [
      '起動前のr5apex.exe、ゲームが落ちるApex_crash.txt、接続のnet／leafを分ける。',
      '修復はEA appとSteamで手順を分け、結果を記録する。',
      '通信エラーは公式状況を確認し、障害時に再インストールを繰り返さない。',
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
        url: 'https://help.ea.com/ja/articles/apex-legends/error-codes/',
        label: 'EA：Apexのエラーコード・r5apex.exe',
      },
      {
        url: 'https://help.ea.com/ja/articles/orders-and-rewards/ea-app-game-download-installation-loading-not-working/',
        label: 'EA：EA appのダウンロード・インストール・読込み',
      },
      {
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
        label: 'Steam：ゲームファイルの整合性確認（英語）',
      },
      {
        url: 'https://help.ea.com/en/articles/apex-legends/error-codes/',
        label: 'EA：Apexのエラーコード（英語）',
      },
      {
        url: 'https://help.ea.com/en/articles/platforms/fix-crashing-and-freezing/',
        label: 'EA：PCのクラッシュ・フリーズ（英語）',
      },
      {
        url: 'https://help.ea.com/en/articles/technical-issues/problems-connecting-online/',
        label: 'EA：接続トラブルの確認（英語）',
      },
      {
        url: 'https://help.ea.com/en/server-status/',
        label: 'EA：公式サーバー状況（英語）',
      },
    ],
  },
  {
    title: 'Fortnite',
    shortTitle: 'Fortnite',
    slug: 'fortnite',
    accent: '#2876bd',
    demand: 'Windows PC版',
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
    hubTitle: 'Fortniteの実行中・DX12黒画面確認ガイド【PC版】',
    lead: 'Epicで実行中なのに窓がない場合と、DX12で窓が黒い場合を分けます。ファイル確認・正規EAC導入・Performance Mode比較を症状に合わせて選びます。',
    updated: '2026-10-13',
    tags: ['実行中', '開かない', 'DX12', '黒画面', 'Easy Anti-Cheat'],
    launchFixes: [
      '窓なしと黒い窓、エラーコードの有無を記録する。',
      '実行中のままならEpicのファイル確認と正規EAC導入の案内へ。',
      'DX12黒画面の描画比較は元の引数を記録し、改善しなければ戻す。',
    ],
    sources: [
      {
        url: 'https://www.epicgames.com/help/c-34254770/c-38015632/fortnite-shows-running-in-epic-games-launcher-and-it-is-not-opening-a23382825',
        label: 'Epic：実行中なのに開かない（英語）',
      },
      {
        url: 'https://www.epicgames.com/help/c-34254770/a17813569',
        label: 'Epic：ゲームファイルの確認（英語）',
      },
      {
        url: 'https://www.epicgames.com/help/c-34254770/a20611857',
        label: 'Epic：Fortnite用Easy Anti-Cheatの導入（英語）',
      },
      {
        url: 'https://www.epicgames.com/help/c-34254770/c-38015632/a14140539',
        label: 'Epic：Fortniteの描画問題とPerformance Mode（英語）',
      },
    ],
  },
  {
    title: 'Battlefield 6',
    shortTitle: 'Battlefield 6',
    slug: 'battlefield-6',
    accent: '#486843',
    demand: 'Windows PC版',
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
    hubTitle: 'Battlefield 6の更新後クラッシュ・蘇生・起動エラー確認ガイド',
    lead: '更新後クラッシュ、BRの蘇生表示、Javelin (94)とSecure Bootの要求を分けて確認します。94はEA app起動と導入先、Secure BootはWindowsのOn・UEFIから確認します。',
    updated: '2026-10-13',
    tags: [
      'Javelin 94',
      'Secure Boot',
      'セキュアブート',
      '起動しない',
      'EA app',
    ],
    launchFixes: [
      '94とSecure Bootを明示する全文を分けて記録する。',
      '94は公式のEA app起動比較とBF6だけのJavelin再導入へ。',
      'On＋UEFIでも止まる場合は万能修正を仮定せず、全文と機種をEAへ相談する。',
    ],
    sources: [
      {
        url: 'https://help.ea.com/en/articles/battlefield/battlefield-6/error-codes/',
        label: 'EA：Battlefield 6のエラー別案内（英語）',
      },
      {
        url: 'https://help.ea.com/en/articles/platforms/pc-ea-anticheat/',
        label: 'EA：Javelinの導入とエラー別対処（英語）',
      },
      {
        url: 'https://www.ea.com/games/battlefield/battlefield-6/news/secure-boot-information',
        label: 'EA：Battlefield 6のSecure Boot要件（英語）',
      },
      {
        url: 'https://help.ea.com/en/articles/technical-issues/secure-boot/',
        label: 'EA：Secure Bootの状態確認と機種別案内（英語）',
      },
      {
        url: 'https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key',
        label: 'Microsoft：BitLocker回復キー（英語）',
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
      en: 'VALORANT: Launch Failures, VAN9003 and VAN9001',
      zh: 'VALORANT：启动失败、VAN9003 与 VAN9001',
      es: 'VALORANT: fallos de inicio, VAN9003 y VAN9001',
    },
    checkedAt: '2026-10-13',
    lead: {
      en: 'Choose a non-VAN launch failure, VAN9003 for Secure Boot or VAN9001 for TPM. Match the full message before making changes.',
      zh: '区分无 VAN 编号的启动失败、VAN9003 安全启动和 VAN9001 TPM，先按完整提示选择文章。',
      es: 'Distingue fallos sin VAN, VAN9003 para Secure Boot y VAN9001 para TPM. Elige según el mensaje completo.',
    },
    intro: {
      en: 'Start without firmware changes. Use Riot Client repair for a non-VAN failure; for a stated security requirement, read Windows state and prepare backup and recovery access before model-specific guidance. Each article explains the next step if it still fails.',
      zh: '先不修改固件。无 VAN 编号时使用 Riot Client 修复；明确要求安全设置时先读取 Windows 状态，并准备备份、恢复方式与机型指南。各文章提供未解决时的下一步。',
      es: 'Empieza sin modificar firmware. Sin VAN usa la reparación del cliente; para requisitos de seguridad, lee Windows y prepara copia y recuperación antes de consultar la guía del modelo. Cada artículo incluye el siguiente paso.',
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
      {
        url: 'https://support.riotgames.com/en-us/riot/connectivity/riot-client-full-repair-tool',
        label: {
          en: 'Riot: Client Full Repair Tool',
          zh: 'Riot：客户端完整修复（英语）',
          es: 'Riot: reparación completa del cliente (inglés)',
        },
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/performance/troubleshooting-game-launching-errors',
        label: {
          en: 'Riot: game-launching errors',
          zh: 'Riot：游戏启动错误分支（英语）',
          es: 'Riot: errores al iniciar juegos (inglés)',
        },
      },
      {
        url: 'https://support.riotgames.com/en-us/riot/performance/uninstall-and-disable-vanguard',
        label: {
          en: 'Riot: normal Vanguard uninstall and reinstall',
          zh: 'Riot：正常卸载与重装 Vanguard（英语）',
          es: 'Riot: desinstalar y reinstalar Vanguard normalmente (inglés)',
        },
      },
    ],
  },
  'apex-legends': {
    focused: true,
    noindex: false,
    names: {
      en: 'Apex Legends',
      zh: 'Apex Legends',
      es: 'Apex Legends',
    },
    title: {
      en: 'Apex Legends: Launch Errors, Crashes and Connection Checks',
      zh: 'Apex Legends：启动、崩溃与连接错误指南',
      es: 'Apex Legends: inicio, cierres y errores de conexión',
    },
    checkedAt: '2026-10-13',
    lead: {
      en: 'Choose r5apex.exe launch errors, Apex_crash.txt crashes or code:net/leaf connections. Match the message and stage before repairing files or comparing the network.',
      zh: '区分 r5apex.exe 启动错误、Apex_crash.txt 崩溃和 code:net／leaf 连接问题，按完整提示与阶段选择。',
      es: 'Elige r5apex.exe al iniciar, cierres Apex_crash.txt o conexión code:net/leaf. Distingue el mensaje y fase antes de reparar o comparar la red.',
    },
    intro: {
      en: 'Use the actual launcher for file checks. Crashes need scene and comparison records; connection errors start with official server status. A filename or code alone does not diagnose hardware failure or a current widespread outage.',
      zh: '按实际启动器检查文件。崩溃要记录场景与比较结果；连接错误先查看官方服务器状态。文件名或代码本身不能证明硬件故障或当前全体断线。',
      es: 'Comprueba archivos con tu lanzador real. Los cierres necesitan escena y comparaciones; la conexión comienza por el estado oficial. Un nombre o código no demuestra avería ni caída general.',
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
          en: 'Steam: verify game files',
          zh: 'Steam：验证游戏文件（英语）',
          es: 'Steam: verificar archivos (inglés)',
        },
      },
      {
        url: 'https://help.ea.com/en/articles/apex-legends/error-codes/',
        label: {
          en: 'EA: Apex error codes ',
          zh: 'EA：Apex 错误代码（英语）',
          es: 'EA: códigos de Apex (inglés)',
        },
      },
      {
        url: 'https://help.ea.com/en/articles/platforms/fix-crashing-and-freezing/',
        label: {
          en: 'EA: PC crashes and freezes ',
          zh: 'EA：PC 崩溃与卡死（英语）',
          es: 'EA: cierres y bloqueos en PC (inglés)',
        },
      },
      {
        url: 'https://help.ea.com/en/articles/technical-issues/problems-connecting-online/',
        label: {
          en: 'EA: connection troubleshooting ',
          zh: 'EA：连接问题排查（英语）',
          es: 'EA: problemas de conexión (inglés)',
        },
      },
      {
        url: 'https://help.ea.com/en/server-status/',
        label: {
          en: 'EA: official server status ',
          zh: 'EA：官方服务器状态（英语）',
          es: 'EA: estado oficial de servidores (inglés)',
        },
      },
    ],
  },
  fortnite: {
    focused: true,
    noindex: false,
    names: {
      en: 'Fortnite',
      zh: 'Fortnite',
      es: 'Fortnite',
    },
    title: {
      en: 'Fortnite: Running Without a Window and DX12 Black Screens',
      zh: 'Fortnite：运行中无窗口与 DX12 黑屏',
      es: 'Fortnite: en ejecución sin ventana y pantalla negra DX12',
    },
    checkedAt: '2026-10-13',
    lead: {
      en: 'Separate Running with no window from a black DX12 window. Choose file verification, legitimate EAC installation or a reversible Performance Mode comparison.',
      zh: '区分显示运行中但没有窗口与 DX12 窗口黑屏，按症状选择文件验证、正规 EAC 安装或可恢复的性能模式比较。',
      es: 'Separa En ejecución sin ventana de una ventana negra DX12. Elige verificar, instalar EAC legítimamente o comparar Rendimiento con restauración.',
    },
    intro: {
      en: 'Start with the window and full error, not just the launcher label. Keep protection enabled. Rendering arguments must match the cited current Epic guide, and the original text and toggle should be saved before changing them.',
      zh: '先记录窗口与完整提示，不只看启动器标记。保持安全保护；渲染参数使用所引用的当前 Epic 指南，修改前保存原文本与开关。',
      es: 'Empieza por la ventana y el mensaje completo, no solo la etiqueta del lanzador. Mantén la protección y usa los argumentos de la guía actual citada, guardando texto y activación originales.',
    },
    sources: [
      {
        url: 'https://www.epicgames.com/help/c-34254770/c-38015632/fortnite-shows-running-in-epic-games-launcher-and-it-is-not-opening-a23382825',
        label: {
          en: 'Epic: Fortnite shows running but does not open',
          zh: 'Epic：显示运行中但无法打开（英语）',
          es: 'Epic: Fortnite aparece en ejecución pero no abre (inglés)',
        },
      },
      {
        url: 'https://www.epicgames.com/help/c-34254770/a17813569',
        label: {
          en: 'Epic: verify game files',
          zh: 'Epic：验证游戏文件（英语）',
          es: 'Epic: verificar archivos del juego (inglés)',
        },
      },
      {
        url: 'https://www.epicgames.com/help/c-34254770/a20611857',
        label: {
          en: 'Epic: install Easy Anti-Cheat for Fortnite',
          zh: 'Epic：安装 Fortnite 所需的 Easy Anti-Cheat（英语）',
          es: 'Epic: instalar Easy Anti-Cheat para Fortnite (inglés)',
        },
      },
      {
        url: 'https://www.epicgames.com/help/c-34254770/c-38015632/a14140539',
        label: {
          en: 'Epic: Fortnite graphics and Performance Mode ',
          zh: 'Epic：Fortnite 图形问题与性能模式（英语）',
          es: 'Epic: gráficos y modo Rendimiento de Fortnite (inglés)',
        },
      },
    ],
  },
  'battlefield-6': {
    focused: true,
    noindex: false,
    names: {
      en: 'Battlefield 6',
      zh: 'Battlefield 6',
      es: 'Battlefield 6',
    },
    title: {
      en: 'Battlefield 6: Update Crashes, Revives and Launch Errors',
      zh: 'Battlefield 6：Javelin 94 与安全启动检查',
      es: 'Battlefield 6: Javelin 94 y comprobación de Secure Boot',
    },
    checkedAt: '2026-10-13',
    lead: {
      en: 'Javelin (94) and Secure Boot prompts need different checks. Use EA app launch and installation checks for 94; read Windows On/UEFI for Secure Boot.',
      zh: 'Javelin (94) 与安全启动要求分开检查：94 核对 EA app 启动与安装；安全启动读取 Windows 的 On／UEFI。',
      es: 'Javelin (94) y Secure Boot requieren comprobaciones distintas: inicio e instalación con EA app para 94, y estado On/UEFI de Windows para Secure Boot.',
    },
    intro: {
      en: 'Do not infer a ban or a firmware fault from error 94. A Secure Boot check reads state first; prepare backup, private recovery-key access and model-specific guidance before any firmware work. Reinstallation targets only BF6.',
      zh: '不凭 94 判断封禁或固件故障。安全启动先读取状态；固件操作前准备备份、私下可用的恢复密钥和准确机型指南。重装只针对 BF6。',
      es: 'No deduzcas una sanción o fallo de firmware por 94. Consulta primero el estado de Secure Boot; prepara copia, acceso privado a recuperación y guía del modelo antes del firmware. Reinstala solo para BF6.',
    },
    sources: [
      {
        url: 'https://help.ea.com/en/articles/battlefield/battlefield-6/error-codes/',
        label: {
          en: 'EA: Battlefield 6 error messages',
          zh: 'EA：Battlefield 6 错误提示（英语）',
          es: 'EA: errores de Battlefield 6 (inglés)',
        },
      },
      {
        url: 'https://help.ea.com/en/articles/platforms/pc-ea-anticheat/',
        label: {
          en: 'EA: install and troubleshoot Javelin',
          zh: 'EA：安装与排查 Javelin（英语）',
          es: 'EA: instalación y errores de Javelin (inglés)',
        },
      },
      {
        url: 'https://www.ea.com/games/battlefield/battlefield-6/news/secure-boot-information',
        label: {
          en: 'EA: Battlefield 6 Secure Boot requirement',
          zh: 'EA：Battlefield 6 安全启动要求（英语）',
          es: 'EA: requisito de Secure Boot en Battlefield 6 (inglés)',
        },
      },
      {
        url: 'https://help.ea.com/en/articles/technical-issues/secure-boot/',
        label: {
          en: 'EA: Secure Boot checks and manufacturer guidance',
          zh: 'EA：安全启动检查与厂商指南（英语）',
          es: 'EA: comprobaciones de Secure Boot y guía del fabricante (inglés)',
        },
      },
      {
        url: 'https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key',
        label: {
          en: 'Microsoft: BitLocker recovery key',
          zh: 'Microsoft：BitLocker 恢复密钥（英语）',
          es: 'Microsoft: clave de recuperación de BitLocker (inglés)',
        },
      },
    ],
  },
};
