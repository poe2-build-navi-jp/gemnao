export type GameGuide = {
  slug: string;
  title: string;
  shortTitle: string;
  hubTitle?: string;
  lead: string;
  accent: string;
  demand: string;
  issueScale?: '非常に高い' | '高い' | '中程度';
  updated: string;
  tags: string[];
  savePath: string;
  configPath: string;
  fps: string;
  ultrawide: string;
  hdr: string;
  controller: string;
  launchFixes: string[];
  mod: string;
  japanese: string;
  specs: { minimum: string; recommended: string; storage: string };
  sources: { label: string; url: string }[];
  focused?: boolean;
};

const pcgw = (path: string) => `https://www.pcgamingwiki.com/wiki/${path}`;
const steam = (id: string) => `https://store.steampowered.com/app/${id}`;

export const games: GameGuide[] = [
  {
    slug: 'aniimo',
    title: 'Aniimo / アニモ',
    shortTitle: 'アニモ（Aniimo）',
    hubTitle: 'アニモ（Aniimo）PC版の不具合・エラー対処法',
    lead: 'アニモPC版で起動しない、黒画面、ログインできない、ビデオメモリ不足、ランチャー表示の問題が起きたときの確認手順をまとめています。',
    accent: '#6f5bd3',
    demand: '2026年9月16日グローバル正式リリース直後',
    issueScale: '高い',
    updated: '2026-09-17',
    tags: [
      '起動しない',
      'クラッシュ',
      '黒画面',
      'ログインできない',
      'ビデオメモリ不足',
      'ランチャー',
    ],
    focused: true,
    savePath: '公式サポートで確認できる情報のみ案内',
    configPath: '公式サポートで確認できる情報のみ案内',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      '公式のお知らせでメンテナンス・更新情報を確認',
      'ランチャーまたはSteamを終了し、PC再起動後にファイルを修復',
      'GPUドライバーとWindows Updateを確認',
    ],
    mod: '',
    japanese: '日本語に公式対応。',
    specs: {
      minimum: '公式ストアの最新要件を確認',
      recommended: '公式ストアの最新要件を確認',
      storage: '公式ストアの最新表示を確認',
    },
    sources: [
      { label: 'Aniimo公式サイト', url: 'https://www.aniimo.com/ja' },
      {
        label: 'Aniimo公式ニュース',
        url: 'https://www.aniimo.com/newslist',
      },
      {
        label: 'Steamストア',
        url: 'https://store.steampowered.com/app/4126040/Aniimo/',
      },
    ],
  },
  {
    slug: 'onimusha-way-of-the-sword',
    title: '鬼武者 Way of the Sword',
    shortTitle: '鬼武者 Way of the Sword',
    lead: '2026年9月発売のPC版で報告される起動失敗、クラッシュ、低FPSを公式手順で切り分け。',
    accent: '#8b2f28',
    demand: '2026年9月3日発売の新作',
    issueScale: '高い',
    updated: '2026-09-13',
    tags: ['起動しない', 'クラッシュ', '低FPS', 'CrashReport', 'config.ini'],
    focused: true,
    savePath:
      'Steam Cloud対応。ローカル保存先は公式サポートで未公表のため、同期完了を確認してから操作',
    configPath: String.raw`<Steam>\steamapps\common\OnimushaWotS\config.ini`,
    fps: '最低要件未満や高設定で低下する場合があります。公式案内どおりプリセット「最低」から段階的に上げます。',
    ultrawide: '利用可能な解像度はゲーム内表示設定とモニター側で確認します。',
    hdr: 'HDR出力で不安定な場合は、公式案内どおりスクリーンモード・解像度・垂直同期と分けて比較します。',
    controller:
      'コントローラー対応。入力不良時はSteam Inputと外部変換ツールを1つずつ比較します。',
    launchFixes: [
      'NVIDIA 596.49以上／AMD 26.5.1以上へ更新し再起動',
      'Steamでゲームファイルの整合性を確認',
      '描画オーバーレイや録画ツールを終了',
      'shader.cacheとshader.cache2を退避して再構築',
    ],
    mod: '本体の安定性確認中はMODやReShadeを外し、オンライン機能の規約を優先します。',
    japanese: '日本語インターフェース・音声・字幕に公式対応。',
    specs: {
      minimum: 'Steamストアの最新「最低」要件を確認',
      recommended: 'Steamストアの最新「推奨」要件を確認',
      storage: '公式ストアの最新表示を確認',
    },
    sources: [
      {
        label: 'カプコン公式トラブルシューティング',
        url: 'https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/',
      },
      { label: 'Steamストア', url: steam('2638890') },
    ],
  },
  {
    slug: 'the-blood-of-dawnwalker',
    title: 'The Blood of Dawnwalker',
    shortTitle: 'Dawnwalker',
    lead: 'シェーダーコンパイル時のクラッシュ、ウィンドウ表示のカクつき、コントローラー不具合を公式既知問題から確認。',
    accent: '#7b2731',
    demand: '2026年9月発売・発売直後の既知問題あり',
    issueScale: '高い',
    updated: '2026-09-13',
    tags: ['シェーダー', 'クラッシュ', 'カクつき', 'コントローラー'],
    focused: true,
    savePath: '個別記事で確認済み情報のみ案内',
    configPath: '個別記事で確認済み情報のみ案内',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      'フルスクリーンでカクつきを比較',
      'BIOS更新状況を確認',
      'コントローラー感度を0.8へ調整',
    ],
    mod: '',
    japanese: '',
    specs: {
      minimum: '公式ストア参照',
      recommended: '公式ストア参照',
      storage: '公式ストア参照',
    },
    sources: [
      {
        label: '公式サイト',
        url: 'https://en.bandainamcoent.eu/dawnwalker/the-blood-of-dawnwalker',
      },
      {
        label: '公式既知問題・回避策',
        url: 'https://www.reddit.com/r/DawnwalkerOfficial/comments/1w615p8/known_issues_fixes_workarounds_03092026/',
      },
    ],
  },
  {
    slug: 'star-wars-zero-company',
    title: 'STAR WARS Zero Company',
    shortTitle: 'ゼロ・カンパニー',
    lead: '起動しない、黒画面、セーブ進行が反映されない問題をEA公式サポートの手順で確認。',
    accent: '#395b76',
    demand: '2026年8月27日発売・EA公式に既知の対処あり',
    issueScale: '高い',
    updated: '2026-09-13',
    tags: ['起動しない', '黒画面', 'セーブ消えた', '低FPS'],
    focused: true,
    savePath: '個別記事で確認済み情報のみ案内',
    configPath: '個別記事で確認済み情報のみ案内',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: ['PCを再起動', 'ゲームファイルを修復', 'GPUドライバーを更新'],
    mod: '',
    japanese: '',
    specs: {
      minimum: 'EA公式PC要件を確認',
      recommended: 'EA公式PC要件を確認',
      storage: 'EA公式PC要件を確認',
    },
    sources: [
      {
        label: 'EA公式トラブルシューティング',
        url: 'https://help.ea.com/ja/articles/star-wars/zero-company/troubleshoot-common-issues/',
      },
      {
        label: 'EA公式PC要件',
        url: 'https://help.ea.com/en/articles/star-wars/zero-company/platforms-pc-requirements-guide/',
      },
    ],
  },
  {
    slug: 'wardogs',
    title: 'WARDOGS',
    shortTitle: 'WARDOGS',
    lead: '発売直後に確認されたサーバー混雑、ログイン待ち、接続不良を、ローカル設定と運営側障害に分けて確認。',
    accent: '#526246',
    demand: '2026年9月10日早期アクセス・最大30万人超',
    issueScale: '非常に高い',
    updated: '2026-09-13',
    tags: ['サーバー接続', 'ログイン待ち', '接続できない'],
    focused: true,
    savePath: 'オンラインゲームのため個別記事で確認済み情報のみ案内',
    configPath: '個別記事で確認済み情報のみ案内',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      '公式サーバー告知を確認',
      '待機列を抜けずに待つ',
      'SteamとPCを再起動',
    ],
    mod: '',
    japanese: '',
    specs: {
      minimum: 'Steamストア参照',
      recommended: 'Steamストア参照',
      storage: 'Steamストア参照',
    },
    sources: [
      { label: 'Steamストア', url: steam('1867240') },
      {
        label: '発売日のサーバー障害報道',
        url: 'https://www.pcgamer.com/games/fps/wardogs-servers-go-down-as-over-300-000-people-rush-to-play-on-launch-day/',
      },
    ],
  },
  {
    slug: 'monster-hunter-wilds',
    title: 'モンスターハンターワイルズ',
    shortTitle: 'モンハンワイルズ',
    lead: '起動失敗やカクつきを切り分け、セーブ保全から画質調整までを最短で確認。',
    accent: '#d2673d',
    demand: '2025年発売・Steam最大約138万人',
    issueScale: '非常に高い',
    updated: '2026-09-09',
    tags: [
      '起動しない',
      'FPS低下',
      'セーブ場所',
      'ウルトラワイド',
      'HDR',
      '推奨スペック',
      'config.ini',
    ],
    savePath: String.raw`<Steam>\userdata\<Steam ID>\2246340\remote\win64_save`,
    configPath: String.raw`<インストール先>\config.ini`,
    fps: 'ゲーム内のフレームレート上限を確認。まず60/120/144などモニターに合わせ、フレーム生成の有無で実FPSと表示FPSを分けて判断します。',
    ultrawide:
      '21:9まで対応。3440×1440などでは端に小さな黒帯が残る場合があります。',
    hdr: 'HDR対応。Windows側のHDRを先に有効化し、ゲーム内輝度を再調整します。',
    controller:
      'Xbox系およびPlayStation系コントローラー対応。二重入力時はSteam Inputを一度OFFにして比較。',
    launchFixes: [
      'Steamの「インストール済みファイルの整合性を確認」を実行',
      'GPUドライバーを更新し、PCを再起動',
      'config.iniをバックアップ後に退避し、設定を再生成',
      '高解像度テクスチャ使用時はVRAM不足と空き容量を確認',
    ],
    mod: 'セーブとゲームフォルダを先にバックアップ。アップデート直後はMODを外し、本体のみで起動確認します。',
    japanese: '日本語は公式対応。非公式の日本語化MODは不要です。',
    specs: {
      minimum: 'GTX 1660 6GB / RX 5500 XT 8GB、メモリ16GB',
      recommended: 'RTX 2060 Super 8GB / RX 6600 8GB以上',
      storage: '75GB以上。SSD必須',
    },
    sources: [
      { label: 'Steamストア（公式要件・対応機能）', url: steam('2246340') },
      {
        label: '公式トラブルシューティング（Steam）',
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
      },
      {
        label: 'PCGamingWiki（設定場所・表示対応）',
        url: pcgw('Monster_Hunter_Wilds'),
      },
    ],
  },
  {
    slug: 'palworld',
    title: 'Palworld / パルワールド',
    shortTitle: 'パルワールド',
    lead: 'ワールドの保存先、専用サーバーの設定、アップデート後の起動不良を確認。',
    accent: '#28a09b',
    demand: '2026年7月の1.0で再び大規模プレイ',
    issueScale: '非常に高い',
    updated: '2026-09-09',
    tags: [
      'セーブ場所',
      'PalWorldSettings.ini',
      '専用サーバー',
      'ポート8211',
      'バックアップ',
      '1.0クラッシュ',
      '推奨スペック',
    ],
    savePath: String.raw`%LOCALAPPDATA%\Pal\Saved\SaveGames\<Steam ID>`,
    configPath: String.raw`%LOCALAPPDATA%\Pal\Saved\Config\Windows`,
    fps: 'フレームレート上限はグラフィック設定で変更。安定しない場合はモニターのリフレッシュレートより少し低く固定。',
    ultrawide:
      '21:9でプレイ可能。UIの端切れは解像度スケールを100%に戻して確認。',
    hdr: 'ゲーム内に安定した専用HDR調整がない環境ではWindows Auto HDRを個別に比較。',
    controller:
      'フルコントローラー対応。反応しないときはSteam Inputの「デフォルト」と「有効」を比較。',
    launchFixes: [
      '1.0非対応のWorkshop・手動導入MODをすべて退避',
      'Steamでファイル整合性を確認',
      'Config\\Windowsをバックアップ後に退避',
      'マルチはクライアントとサーバーのバージョンを揃える',
    ],
    mod: '1.0更新後は古いMODを管理画面でOFFにするだけでなく、手動導入ファイルも退避します。導入前にSaveGamesを別ドライブへコピーしてください。',
    japanese: '日本語は公式対応。',
    specs: {
      minimum: 'Core i5-9400F / GTX 1660、メモリ16GB',
      recommended:
        'Core i5-12400 / Ryzen 5 5600X、RTX 3060 Ti / RX 6700 XT、メモリ32GB',
      storage: '40GB。SSD必須',
    },
    sources: [
      { label: 'Steamストア（公式要件・対応機能）', url: steam('1623730') },
      {
        label: 'Palworld公式サーバーガイド',
        url: 'https://docs.palworldgame.com/ja/',
      },
      { label: 'PCGamingWiki（保存場所・PC設定）', url: pcgw('Palworld') },
    ],
  },
  {
    slug: 'elden-ring',
    title: 'ELDEN RING',
    shortTitle: 'エルデンリング',
    lead: '60FPS上限、21:9の黒帯、起動時の白画面とMODのオフライン運用を整理。',
    accent: '#a48339',
    demand: '2026年もSteam上位に継続登場',
    issueScale: '非常に高い',
    updated: '2026-09-06',
    tags: ['FPS上限', '21:9黒帯', '白画面', 'MOD'],
    savePath: String.raw`%APPDATA%\EldenRing\<Steam ID>\ER0000.sl2`,
    configPath: String.raw`%APPDATA%\EldenRing\GraphicsConfig.xml`,
    fps: '公式仕様は60FPS上限。解除MOD利用時はEasy Anti-Cheatを無効化し、必ずオフラインで運用します。',
    ultrawide:
      '公式は16:9表示。21:9/32:9は黒帯が入り、解除には非公式ツールが必要です。',
    hdr: 'HDR対応。色が白っぽい場合はWindows HDRキャリブレーション後にゲームを再起動。',
    controller:
      'Xbox/PlayStation系対応。ボタンが二重反応する場合はDS4WindowsとSteam Inputの二重変換を解消。',
    launchFixes: [
      'Steamでファイル整合性を確認',
      'MODと外部DLLを退避',
      'GraphicsConfig.xmlをバックアップ後に再生成',
      'Epic Online Services / Easy Anti-Cheatの修復を実行',
    ],
    mod: 'オンラインでの改変ファイル利用は避けます。セーブを複製し、MOD専用のオフライン環境を分けるのが安全です。',
    japanese: '日本語は公式対応。',
    specs: {
      minimum: 'GTX 1060 3GB / RX 580 4GB、メモリ12GB',
      recommended: 'GTX 1070 / RX Vega 56、メモ16GB',
      storage: '60GB',
    },
    sources: [
      { label: 'PCGamingWiki', url: pcgw('Elden_Ring') },
      { label: 'Steamストア', url: steam('1245620') },
    ],
  },
  {
    slug: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    shortTitle: 'サイバーパンク2077',
    lead: 'セーブ保全、HDR、ウルトラワイド、REDmodと起動エラーの基本手順。',
    accent: '#cfad12',
    demand: '大型更新後も長期的に高いMOD需要',
    updated: '2026-09-06',
    tags: ['HDR', 'ウルトラワイド', 'REDmod', 'クラッシュ'],
    savePath: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077`,
    configPath: String.raw`%LOCALAPPDATA%\CD Projekt Red\Cyberpunk 2077`,
    fps: 'ゲーム内で最大FPSを設定可能。レイトレーシングとフレーム生成を分けて調整。',
    ultrawide:
      '21:9/32:9に対応。会話やミニマップの表示は解像度により小さく感じる場合があります。',
    hdr: 'HDR対応。HDR10 PQ等をディスプレイに合わせ、最大輝度とペーパーホワイトを調整。',
    controller:
      'コントローラー対応。DualSenseの追加機能は有線接続が必要になる場合があります。',
    launchFixes: [
      'REDmod/CET/redscript等の互換性を確認し、いったん全て外す',
      'Steam/GOGでファイルを修復',
      'GPUドライバーのシェーダーキャッシュを再生成',
      'GamePipelineLibrary.cacheを退避して再起動',
    ],
    mod: '公式REDmodと外部ローダーの役割は別。必要前提のバージョンを揃え、1個ずつ導入します。',
    japanese: '音声・字幕とも日本語に公式対応。',
    specs: {
      minimum: 'GTX 1060 6GB / RX 580 8GBクラス',
      recommended: 'RTX 2060 Super / RX 5700 XT以上',
      storage: '70GB。SSD必須',
    },
    sources: [
      { label: 'PCGamingWiki', url: pcgw('Cyberpunk_2077') },
      { label: 'Steamストア', url: steam('1091500') },
    ],
  },
  {
    slug: 'baldurs-gate-3',
    title: "Baldur's Gate 3",
    shortTitle: 'バルダーズ・ゲート3',
    lead: 'DX11/Vulkanの切り替え、セーブ同期、マルチのMOD不一致を解消。',
    accent: '#8f483a',
    demand: '長編RPGとMODで継続的な検索需要',
    updated: '2026-09-06',
    tags: ['起動しない', 'セーブ同期', 'MOD', 'コントローラー'],
    savePath: String.raw`%LOCALAPPDATA%\Larian Studios\Baldur's Gate 3\PlayerProfiles\Public\Savegames\Story`,
    configPath: String.raw`%LOCALAPPDATA%\Larian Studios\Baldur's Gate 3\PlayerProfiles\Public`,
    fps: 'ゲーム内で上限を設定可能。終盤のCPU負荷が高い場面は上限解除より安定値へ固定。',
    ultrawide:
      'ウルトラワイド対応。カットシーンの表示差はパッチとMODのバージョンを確認。',
    hdr: 'HDR対応。WindowsでHDRを先に有効化し、DX11とVulkanで見え方を比較。',
    controller:
      'フルコントローラー対応。ランチャーが操作できない場合は起動オプションでスキップ。',
    launchFixes: [
      'DX11とVulkanを切り替えて起動',
      'ランチャーをスキップしbg3_dx11.exeまたはbg3.exeを直接起動',
      'Modsフォルダとmodsettings.lsxを退避',
      'マルチ参加者全員の本体・MODバージョンを揃える',
    ],
    mod: 'マルチは全員が同じMODと読み込み順を使用。パッチ後はバニラセーブで起動確認します。',
    japanese: '日本語は公式対応。',
    specs: {
      minimum: 'GTX 970 / RX 480、メモリ8GB',
      recommended: 'RTX 2060 Super / RX 5700 XT、メモリ16GB',
      storage: '150GB。SSD必須',
    },
    sources: [
      { label: 'PCGamingWiki', url: pcgw('Baldur%27s_Gate_3') },
      { label: 'Steamストア', url: steam('1086940') },
    ],
  },
  {
    slug: 'helldivers-2',
    title: 'HELLDIVERS 2',
    shortTitle: 'ヘルダイバー2',
    lead: '起動クラッシュ、GameGuard、マッチング、DualSenseの切り分け。',
    accent: '#e6b72d',
    demand: 'オンライン人口と更新に連動するトラブル需要',
    updated: '2026-09-06',
    tags: ['クラッシュ', 'GameGuard', 'FPS', 'コントローラー'],
    savePath: String.raw`%APPDATA%\Arrowhead\Helldivers2\saves`,
    configPath: String.raw`%APPDATA%\Arrowhead\Helldivers2\user_settings.config`,
    fps: 'ゲーム内で上限設定。フレーム落ちはグラフィック最下部のAsynchronous ComputeをON/OFF比較。',
    ultrawide: '21:9対応。照準やHUDの位置は画面比率で見え方が変わります。',
    hdr: 'HDR出力対応。専用HDRスライダーは限定的なためWindows側の調整も使用。',
    controller:
      'Xbox系・DualSense対応。DualSenseのハプティクとアダプティブトリガーはUSB有線接続を推奨。',
    launchFixes: [
      'PCとSteamを再起動し、サーバー障害でないか確認',
      'GameGuardフォルダを削除して再生成',
      'ファイル整合性とセキュリティソフトの隔離履歴を確認',
      'フルスクリーンで固まる場合はボーダーレスに変更',
    ],
    mod: 'オンライン専用かつアンチチート搭載のため、改変ツールの導入は非推奨です。',
    japanese: '日本語は公式対応。',
    specs: {
      minimum: 'GTX 1050 Ti / RX 470、メモリ8GB',
      recommended: 'RTX 2060 / RX 6600 XT、メモリ16GB',
      storage: '100GB',
    },
    sources: [
      { label: 'PCGamingWiki', url: pcgw('Helldivers_2') },
      { label: 'Steamストア', url: steam('553850') },
    ],
  },
  {
    slug: 'hogwarts-legacy',
    title: 'Hogwarts Legacy',
    shortTitle: 'ホグワーツ・レガシー',
    lead: 'カクつき、VRAM不足、起動時クラッシュとUE系MODの基本。',
    accent: '#4a67a0',
    demand: '長期セールとMODで技術系検索が継続',
    updated: '2026-09-06',
    tags: ['カクつき', 'VRAM', 'セーブ場所', 'MOD'],
    savePath: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\SaveGames`,
    configPath: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor`,
    fps: 'ゲーム内で上限を設定可能。スタッターが出る場合はテクスチャ品質とRTを先に下げます。',
    ultrawide:
      'ウルトラワイドプレイに対応。カットシーンは黒帯が出る場合があります。',
    hdr: 'HDR対応。Windows HDRをONにしてからゲームを起動。',
    controller:
      'Xbox/PlayStation系対応。無線で表示が合わない場合はSteam Inputを確認。',
    launchFixes: [
      'Engine.iniの改変を退避',
      '~modsフォルダを空にして起動',
      'GPUドライバー更新後にシェーダー構築を待つ',
      'Engine.iniでVRAMプールを変えた場合は値を戻す',
    ],
    mod: 'UE系MODはPhoenix\\Content\\Paks配下に入る形式が中心。必要前提と本体対応版を確認。',
    japanese: '音声・字幕とも公式の日本語対応があります。',
    specs: {
      minimum: 'GTX 960 / RX 470、メモリ16GB',
      recommended: 'GTX 1080 Ti / RX 5700 XT以上',
      storage: '85GB。SSD推奨',
    },
    sources: [
      { label: 'PCGamingWiki', url: pcgw('Hogwarts_Legacy') },
      { label: 'Steamストア', url: steam('990080') },
    ],
  },
  {
    slug: 'gta-v-enhanced',
    title: 'Grand Theft Auto V Enhanced',
    shortTitle: 'GTA5 Enhanced',
    lead: 'Legacyからのセーブ移行、HDR/RT、ERR_GFX_STATE、ストーリーMODを確認。',
    accent: '#55864b',
    demand: 'Enhanced移行とLegacy版との違いで検索が集中',
    updated: '2026-09-06',
    tags: ['セーブ移行', 'ERR_GFX_STATE', 'HDR', 'MOD'],
    savePath: String.raw`%USERPROFILE%\Documents\Rockstar Games\GTAV Enhanced\Profiles\<ID>`,
    configPath: String.raw`%USERPROFILE%\Documents\Rockstar Games\GTAV Enhanced\settings.xml`,
    fps: '高FPSでスタッターが出る場合は140FPS以下に固定して比較。非公式解除はストーリー専用。',
    ultrawide: '21:9はHor+で対応。カットシーンは16:9の黒帯が入ります。',
    hdr: 'Enhanced版はHDR対応。Windowsとゲーム側の両方を有効化。',
    controller:
      'Xbox系およびDualSense対応。DualSenseのアダプティブトリガーはUSB有線接続。',
    launchFixes: [
      'Rockstar Games Launcherのキャッシュとサインイン状態を確認',
      'settings.xmlをバックアップ後に再生成',
      'ASIローダーとMODを全て外して起動',
      'ERR_GFX_STATEはドライバー更新と設定ファイル再生成を順に実施',
    ],
    mod: 'MODはストーリーモード専用。BattlEyeとオンラインを使う環境には混ぜず、MOD用起動を分けます。',
    japanese: '日本語字幕に公式対応。',
    specs: {
      minimum: 'GTX 1630 / RX 6400クラス',
      recommended: 'RTX 3060 / RX 6600 XT以上',
      storage: '105GB。SSD必須',
    },
    sources: [
      { label: 'PCGamingWiki', url: pcgw('Grand_Theft_Auto_V_Enhanced') },
      { label: 'Steamストア', url: steam('3240220') },
    ],
  },
  {
    slug: 'skyrim-special-edition',
    title: 'The Elder Scrolls V: Skyrim Special Edition',
    shortTitle: 'Skyrim SE',
    lead: 'SKSE、日本語版、60FPS制限、MOD更新で起動しない問題を整理。',
    accent: '#6b7278',
    demand: '2026年の本体更新後もMOD検索が非常に多い',
    updated: '2026-09-06',
    tags: ['SKSE', '日本語化', 'FPS上限', 'MOD'],
    savePath: String.raw`%USERPROFILE%\Documents\My Games\Skyrim Special Edition\Saves`,
    configPath: String.raw`%USERPROFILE%\Documents\My Games\Skyrim Special Edition`,
    fps: 'デフォルトは60Hz前提。高リフレッシュレートはSKSE64とSSE Display Tweaksで物理演算を含めて調整。',
    ultrawide: '21:9は解像度設定とUI補正MODの組み合わせが実用的。',
    hdr: 'ネイティブHDRは非対応。Windows Auto HDRまたは対応ReShade等は自己責任で比較。',
    controller: 'Xbox系に対応。PlayStation系はSteam Input経由での確認が安定。',
    launchFixes: [
      'SKSE64と本体ランタイムの対応版を確認',
      'Address Libraryなど前提MODを更新',
      'プラグインを半分ずつOFFにして原因を切り分け',
      'Skyrim.iniとSkyrimPrefs.iniを保全後に再生成',
    ],
    mod: '初心者はVortex、構成を厳密に分けたい場合はMod Organizer 2が候補。対応ランタイム表記を必ず確認。',
    japanese:
      '公式日本語版あり。MODによっては英語版本体+日本語リソースの構成を求められるため、個別手順を優先。',
    specs: {
      minimum: 'GTX 470 / Radeon 7870、メモリ8GB',
      recommended: 'GTX 780 / R9 290以上',
      storage: '12GB+。MOD構成は100GB以上も想定',
    },
    sources: [
      {
        label: 'PCGamingWiki',
        url: pcgw('The_Elder_Scrolls_V%3A_Skyrim_Special_Edition'),
      },
      { label: 'Steamストア', url: steam('489830') },
    ],
  },
  {
    slug: 'stardew-valley',
    title: 'Stardew Valley',
    shortTitle: 'スターデューバレー',
    lead: 'セーブの復元、SMAPI、MODの競合、コントローラー設定を確認。',
    accent: '#5b9a57',
    demand: 'Steam DeckとMOD導入で定番の長期人気作',
    updated: '2026-09-06',
    tags: ['セーブ復元', 'SMAPI', 'MOD', 'コントローラー'],
    savePath: String.raw`%APPDATA%\StardewValley\Saves`,
    configPath: String.raw`%APPDATA%\StardewValley`,
    fps: '60FPS基準で安定。カクつきはMODの処理負荷とフルスクリーン/ボーダーレスを比較。',
    ultrawide: '広い解像度でプレイ可能。UIスケールとズーム値を個別に調整。',
    hdr: 'ネイティブHDRは非対応。Windows Auto HDRの効果は環境差があります。',
    controller: 'フルコントローラー対応。Steam Inputの公式レイアウトから確認。',
    launchFixes: [
      'SMAPIコンソールの赤文字で必要MODと非対応MODを確認',
      'Steamの起動オプションを外し、バニラ起動',
      'startup_preferencesを保全後に再生成',
      'セーブ破損時は同名の_oldファイルから復元',
    ],
    mod: 'SMAPIを使い、Modsフォルダに1個ずつ導入。本体アップデート後はSMAPIとContent Patcherを先に更新。',
    japanese: '日本語は公式対応。古い日本語化MODは通常不要です。',
    specs: {
      minimum: '2GHz CPU、メモリ2GB、256MB VRAM',
      recommended: '内蔵GPUを含む幅広いPCで動作',
      storage: '1GB未満+バックアップ領域',
    },
    sources: [
      { label: 'PCGamingWiki', url: pcgw('Stardew_Valley') },
      { label: 'Steamストア', url: steam('413150') },
    ],
  },
];

export const gameBySlug = (slug: string) =>
  games.find((game) => game.slug === slug);
