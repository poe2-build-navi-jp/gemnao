import type { GameGuide } from '@/lib/games';
import type { LocalizedHub } from '@/lib/localized/hubs';
import { rocketLeagueSourceUrls as urls } from '@/lib/rocket-league-articles';

// Deliberately focused: no unverified save/config paths, specs or languages.
export const rocketLeagueGuide: GameGuide = {
  slug: 'rocket-league',
  title: 'Rocket League',
  shortTitle: 'Rocket League',
  hubTitle: 'Rocket LeagueのDualSenseトラブル対処ガイド【PC版】',
  lead: 'PC版Rocket Leagueで通常のDualSense（PS5コントローラー）が反応しない時の案内です。Epic Games LauncherとSteam、USBとBluetooth、PC側の未認識とゲーム内だけの入力不良を分けて確認します。',
  accent: '#246bc2',
  demand: 'Windows PC・DualSense・Epic Games Launcher／Steam',
  updated: '2026-10-03',
  tags: ['DualSense', 'PS5コントローラー', '反応しない', 'USB', 'Bluetooth'],
  focused: true,
  savePath: '',
  configPath: '',
  fps: '',
  ultrawide: '',
  hdr: '',
  controller:
    '通常のDualSenseを対象に、公式ソフトウェアの確認と接続の切り分けを案内。別機種や高度な振動機能の対応を保証するページではありません。',
  launchFixes: [
    '最初に、Epicから直接起動／Steamから起動、USB／Bluetooth、最後に正常だった日時を記録する。',
    'PC側で機器とボタン入力を確認できないなら接続から、PCでは動くならゲームへの入力経路から切り分ける。',
    'Sony公式アプリでDualSenseのソフトウェアを確認し、更新が必要な時だけ実行する。更新中は電源・接続を切らない。',
    'Epic公式の切断→PC再起動→再接続後に、同じメニュー操作とフリープレイで比較する。',
    'Steam版だけで残るならゲーム別Steam Inputを比較。改善しない設定は戻し、結果をまとめて公式サポートへ相談する。',
  ],
  mod: '',
  japanese: '',
  specs: { minimum: '', recommended: '', storage: '' },
  sources: [
    {
      label: 'Epic公式：PC版Rocket LeagueのDualSense入力不良（英語）',
      url: urls.epicDualSense,
    },
    {
      label:
        'Sony公式：PlayStation Accessories・動作条件・更新時の注意（英語）',
      url: urls.sonyFirmware,
    },
    { label: 'Sony公式：DualSenseのPC接続（英語）', url: urls.sonyConnection },
    {
      label: 'Epic公式：Rocket Leagueの既知の問題（英語）',
      url: urls.liveIssues,
    },
  ],
};

export const rocketLeagueLocalizedHub: LocalizedHub = {
  focused: true,
  noindex: true,
  names: { en: 'Rocket League', zh: 'Rocket League', es: 'Rocket League' },
  title: {
    en: 'Rocket League on PC: DualSense Troubleshooting',
    zh: 'Rocket League PC 版：DualSense 手柄问题排查',
    es: 'Rocket League para PC: problemas con DualSense',
  },
  checkedAt: '2026-10-03',
  lead: {
    en: 'Help for a standard DualSense (PS5 controller) that will not respond in Rocket League on Windows. Separate Epic Games Launcher from Steam, USB from Bluetooth, and PC detection from in-game input.',
    zh: '适用于 Windows 版 Rocket League 中标准版 DualSense（PS5 手柄）无反应的情况。区分 Epic Games Launcher 与 Steam、USB 与蓝牙，以及电脑未识别和仅游戏内失灵。',
    es: 'Ayuda para un DualSense estándar (mando de PS5) que no responde en Rocket League para Windows. Distingue Epic Games Launcher y Steam, USB y Bluetooth, y detección del PC y respuesta dentro del juego.',
  },
  intro: {
    en: 'Start with the DualSense guide below. It combines Epic’s controller-software and reconnection instructions with Sony’s PC guidance and reversible diagnostic comparisons. Check input outside the game before changing Steam settings. These are official-source summaries, not repairs tested by our editors on your hardware. Other controller models, save locations, PC requirements and language support are outside this focused guide.',
    zh: '先阅读下方 DualSense 指南。内容结合 Epic 的手柄软件与重连说明、Sony 的 PC 使用说明，以及可以恢复原设置的对照排查。修改 Steam 设置前，先检查游戏外的输入。本文为官方资料整理，并非编辑在你的硬件上验证成功的修复记录。其他手柄型号、存档位置、电脑配置要求和语言支持不在本页范围内。',
    es: 'Empieza por la guía de DualSense de abajo. Combina las instrucciones de Epic sobre software y reconexión con las de Sony para PC y comparaciones de diagnóstico reversibles. Comprueba la entrada fuera del juego antes de tocar Steam. Es una síntesis de fuentes oficiales, no una reparación probada por la redacción en tu equipo. Otros modelos de mando, ubicaciones de partidas, requisitos del PC e idiomas quedan fuera de esta guía específica.',
  },
  checklist: {
    en: [
      'Record the launcher, connection type and last working time before changing anything.',
      'If PC input also fails, investigate the connection; if only Rocket League fails, compare its input path.',
      'Check firmware in Sony’s official app; do not disconnect the controller or power off the PC during an update.',
      'After disconnecting, restarting the PC and reconnecting, repeat a menu and Free Play test.',
      'For Steam-only failures, compare per-game Steam Input. Restore settings that do not help and report the results.',
    ],
    zh: [
      '修改前先记录启动器、连接方式及最后正常时间。',
      '电脑输入也失灵时先查连接；仅 Rocket League 失灵时，比较输入传入游戏的路径。',
      '用 Sony 官方应用检查固件；更新期间不要断开手柄或关闭电脑。',
      '断开、重启电脑、重新连接后，重复菜单和自由训练测试。',
      '仅 Steam 版失败时比较游戏专用 Steam 输入设置。无效的设置修改要还原，并保留测试结果。',
    ],
    es: [
      'Anota el lanzador, la conexión y el último funcionamiento correcto antes de cambiar nada.',
      'Si también falla la entrada del PC, revisa la conexión; si solo falla Rocket League, compara cómo recibe la entrada.',
      'Comprueba el firmware con la aplicación oficial de Sony; no desconectes el mando ni apagues el PC al actualizar.',
      'Tras desconectar, reiniciar el PC y reconectar, repite la prueba de menú y Juego libre.',
      'Si solo falla Steam, compara Steam Input por juego. Restaura los ajustes que no ayuden y comunica los resultados.',
    ],
  },
  sources: [
    {
      label: {
        en: 'Epic: DualSense not working in Rocket League on PC',
        zh: 'Epic 官方：PC 版 Rocket League 的 DualSense 输入问题（英语）',
        es: 'Epic: DualSense no funciona en Rocket League para PC (en inglés)',
      },
      url: urls.epicDualSense,
    },
    {
      label: {
        en: 'Sony: PlayStation Accessories, requirements and update precautions',
        zh: 'Sony 官方：PlayStation Accessories、系统要求与更新注意事项（英语）',
        es: 'Sony: PlayStation Accessories, requisitos y precauciones al actualizar (en inglés)',
      },
      url: urls.sonyFirmware,
    },
    {
      label: {
        en: 'Sony: connect DualSense to a PC',
        zh: 'Sony 官方：DualSense 与 PC 连接（英语）',
        es: 'Sony: conectar DualSense a un PC (en inglés)',
      },
      url: urls.sonyConnection,
    },
    {
      label: {
        en: 'Epic: Rocket League live issues',
        zh: 'Epic 官方：Rocket League 实时问题（英语）',
        es: 'Epic: incidencias de Rocket League (en inglés)',
      },
      url: urls.liveIssues,
    },
  ],
};
