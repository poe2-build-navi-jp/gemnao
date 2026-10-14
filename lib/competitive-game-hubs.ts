import type { GameGuide } from './games';
import type { LocalizedHub } from './localized/hubs';

export const competitiveGameGuides: GameGuide[] = [
  {
    slug: 'overwatch-2',
    title: 'Overwatch 2',
    shortTitle: 'Overwatch 2',
    hubTitle: 'Overwatch 2のエラー確認ガイド【PC版】',
    lead: 'PC版Overwatch 2（OW2）で「レンダリングデバイスが失われました」や「Your rendering device has been lost」と表示され終了する場合向けです。',
    accent: '#b87932',
    demand: 'PC版・公式資料に基づく症状別ガイド',
    updated: '2026-10-14',
    tags: ['レンダリングデバイスが失われました', '起動・クラッシュ'],
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
    launchFixes: [
      'Blizzardのサポート回答は、GPUの停止・クラッシュに関わり、ドライバーやハードウェアなど複数の原因があり得ると説明しています。故障と即断せず、まず発生場面とGPU・ドライバー版を記録し、メーカーの正式な更新を一つずつ比較します。画面全体の異常やPC再起動を伴う場合はゲームだけの問題として繰り返し試さないでください。',
    ],
    sources: [
      {
        url: 'https://us.forums.blizzard.com/en/overwatch/t/your-rendering-device-has-been-lost-application-closing/813964',
        label: 'Blizzard公式フォーラム：Jambrixの回答（2023-05-04・英語）',
      },
      {
        url: 'https://www.nvidia.com/ja-jp/drivers/',
        label: 'NVIDIA：製品・OS別の公式ドライバー',
      },
      {
        url: 'https://www.amd.com/en/resources/support-articles/faqs/DH3-016.html',
        label: 'AMD：GPU情報・ソフトウェア更新（英語）',
      },
    ],
  },
  {
    slug: 'pubg',
    title: 'PUBG: BATTLEGROUNDS',
    shortTitle: 'PUBG: BATTLEGROUNDS',
    hubTitle: 'PUBG: BATTLEGROUNDSのエラー確認ガイド【PC版】',
    lead: 'ロビー入室時にアンチチートや別のセキュリティソフトとの競合を示す警告が出るPC向けです。警告なしの接続失敗や利用制限は同じ原因と扱いません。',
    accent: '#ad8a26',
    demand: 'PC版・公式資料に基づく症状別ガイド',
    updated: '2026-10-14',
    tags: ['アンチチート競合警告・ロビー', '起動・クラッシュ'],
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
    launchFixes: [
      'PUBGの2025年8月11日の公式レターは、37.1以降、独自セキュリティ付きの別ゲームとの同時起動時にロビーで警告が出る場合を説明しています。まず全文を記録し、もう一方のゲームを通常終了してPUBGだけで比較します。特定製品を原因と断定せず、セキュリティ機能は停止しません。',
    ],
    sources: [
      {
        url: 'https://www.pubg.com/ja/news/9001',
        label: 'PUBG：新アンチチート導入レター（2025-08-11・37.1）',
      },
    ],
  },
];

export const competitiveLocalizedHubs: Record<string, LocalizedHub> = {
  'overwatch-2': {
    focused: true,
    noindex: true,
    checkedAt: '2026-10-14',
    names: {
      en: 'Overwatch 2',
      zh: 'Overwatch 2',
      es: 'Overwatch 2',
    },
    title: {
      en: 'Overwatch 2 PC Error Guides',
      zh: 'Overwatch 2 PC 错误排查指南',
      es: 'Guías de errores de Overwatch 2 en PC',
    },
    lead: {
      en: 'For Overwatch 2 on PC closing with “Your rendering device has been lost” or an equivalent localized message.',
      zh: '适用于 PC 版 Overwatch 2（OW2）显示 Your rendering device has been lost 或对应语言提示后退出。',
      es: 'Para Overwatch 2 en PC que se cierra con Your rendering device has been lost o su traducción.',
    },
    intro: {
      en: 'Blizzard’s support reply describes a GPU hang or crash with multiple possible causes, including drivers and hardware. Record the scene, GPU and driver version before comparing an official vendor update. If the entire display fails or the PC restarts, stop treating it as a game-only crash.',
      zh: 'Blizzard 支持回复将其解释为 GPU 挂起或崩溃，可能涉及驱动或硬件等多种原因。先记录场景、GPU 和驱动版本，再逐项比较厂商正式更新结果。若整个屏幕异常或电脑重启，停止按游戏单独崩溃反复测试。',
      es: 'La respuesta de soporte de Blizzard describe un bloqueo o fallo de la GPU con varias causas posibles, incluidos controladores y hardware. Anota escena, GPU y versión antes de comparar una actualización oficial. Si falla toda la pantalla o se reinicia el PC, deja de tratarlo como un cierre exclusivo del juego.',
    },
    sources: [
      {
        url: 'https://us.forums.blizzard.com/en/overwatch/t/your-rendering-device-has-been-lost-application-closing/813964',
        label: {
          en: 'Blizzard forum: Jambrix support reply (May 4, 2023)',
          zh: 'Blizzard 官方论坛：Jambrix 支持回复（2023-05-04，英语）',
          es: 'Foro de Blizzard: respuesta de Jambrix (4 de mayo de 2023, inglés)',
        },
      },
      {
        url: 'https://www.nvidia.com/ja-jp/drivers/',
        label: {
          en: 'NVIDIA: official driver selection (Japanese)',
          zh: 'NVIDIA：官方驱动选择（日语）',
          es: 'NVIDIA: selección oficial de controladores (japonés)',
        },
      },
      {
        url: 'https://www.amd.com/en/resources/support-articles/faqs/DH3-016.html',
        label: {
          en: 'AMD: graphics information and software updates',
          zh: 'AMD：显卡信息与软件更新（英语）',
          es: 'AMD: información gráfica y actualizaciones (inglés)',
        },
      },
    ],
  },
  pubg: {
    focused: true,
    noindex: true,
    checkedAt: '2026-10-14',
    names: {
      en: 'PUBG: BATTLEGROUNDS',
      zh: 'PUBG: BATTLEGROUNDS',
      es: 'PUBG: BATTLEGROUNDS',
    },
    title: {
      en: 'PUBG: BATTLEGROUNDS PC Error Guides',
      zh: 'PUBG: BATTLEGROUNDS PC 错误排查指南',
      es: 'Guías de errores de PUBG: BATTLEGROUNDS en PC',
    },
    lead: {
      en: 'For a PC warning about anti-cheat or security-software conflicts when entering the lobby. A connection failure without that warning or an account restriction is a different symptom.',
      zh: '适用于 PC 进入大厅时提示反作弊或安全软件冲突。没有该警告的连接失败或账号限制应另行判断。',
      es: 'Para un aviso de conflicto antitrampas o de seguridad al entrar en la sala en PC. Un fallo sin ese aviso o una restricción de cuenta son síntomas distintos.',
    },
    intro: {
      en: 'PUBG’s August 11, 2025 letter describes a lobby warning from update 37.1 when another game with its own security software is running. Record the message, close the other game normally and compare with PUBG alone. Do not name a particular product as the cause or stop security protection.',
      zh: 'PUBG 在2025年8月11日的说明中介绍：37.1起，与带独立安全软件的其他游戏同时运行时，进入大厅可能出现警告。先记录全文，正常退出另一个游戏，再只运行 PUBG 比较。不认定某个特定产品是原因，不停止安全保护。',
      es: 'La carta de PUBG del 11 de agosto de 2025 describe un aviso desde la actualización 37.1 al ejecutar otro juego con seguridad propia. Anota el mensaje, cierra normalmente el otro juego y compara con PUBG solo. No atribuyas la causa a un producto concreto ni detengas la protección.',
    },
    sources: [
      {
        url: 'https://www.pubg.com/ja/news/9001',
        label: {
          en: 'PUBG: anti-cheat introduction letter (August 11, 2025; 37.1; Japanese)',
          zh: 'PUBG：反作弊引入说明（2025-08-11、37.1，日语）',
          es: 'PUBG: carta de introducción antitrampas (11 de agosto de 2025; 37.1; japonés)',
        },
      },
    ],
  },
};
