import { aniimoHubTitle, aniimoHubAnswer } from '@/lib/aniimo-troubleshooting';

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
    hubTitle: aniimoHubTitle,
    lead: 'アニモ（Aniimo）の不具合を、起動・ログイン・画面表示の症状から切り分けるPC版ガイドです。公式の修復方法と、結果に応じた次の行動を確認できます。',
    accent: '#6f5bd3',
    demand: 'Windows PC版：公式ランチャー・Steam',
    issueScale: '高い',
    updated: '2026-09-30',
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
      aniimoHubAnswer,
      '起動失敗なら、公式ランチャーのワンクリック修復またはSteamの整合性確認後に同じ操作で比較',
      '同じ症状が残れば発生時刻・エラー・修復結果を記録して公式サポートへ',
    ],
    mod: '',
    japanese: '日本語に公式対応。',
    specs: {
      minimum: '公式ストアの最新要件を確認',
      recommended: '公式ストアの最新要件を確認',
      storage: '公式ストアの最新表示を確認',
    },
    sources: [
      {
        label: 'Aniimo公式FAQ：起動・修復・ログイン・表示倍率',
        url: 'https://aniimo.com/ja/newslist/detail/100091',
      },
      {
        label: 'Aniimo公式：Intel CPUの安定性問題',
        url: 'https://aniimo.com/ja/newslist/detail/100102',
      },
      {
        label: 'Aniimo公式：更新・修正内容（9月23日）',
        url: 'https://aniimo.com/ja/newslist/detail/100139',
      },
      {
        label: 'Aniimo公式：不具合の報告窓口',
        url: 'https://aniimo.com/newslist/detail/100117',
      },
      {
        label: 'Steam公式：ゲームファイルの整合性確認',
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      },
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
    updated: '2026-09-27',
    tags: ['起動しない', 'クラッシュ', '低FPS', 'CrashReport', 'config.ini'],
    focused: true,
    savePath: String.raw`<Steam>\userdata\<Steam ID>\2638890\remote\win64_save`,
    configPath: String.raw`<Steam>\steamapps\common\OnimushaWotS\config.ini`,
    fps: 'フレームレート上限は30〜360fpsまたは上限なしで設定可能。安定しない時は公式案内どおりグラフィックプリセット「最低」から段階的に上げます。',
    ultrawide:
      '21:9に対応。32:9では21:9の比率で表示され、左右に黒帯が入ります（PCGamingWiki）。',
    hdr: 'HDR対応。最大輝度・全体の明るさ・彩度・UIの明るさを調整できます。表示が不安定な場合は公式案内どおりスクリーンモード・解像度・垂直同期と分けて比較します。',
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
      minimum:
        'Windows 11／GTX 1660（6GB）・RX 5500 XT（8GB）／メモリ16GB（「低」1080p・アップスケール30fps）',
      recommended:
        'Windows 11／RTX 2060 Super（8GB）・RX 6600（8GB）／メモリ16GB（「中」1080p・アップスケール60fps）',
      storage: '50GB（SSD必須）',
    },
    sources: [
      {
        label: 'カプコン公式トラブルシューティング',
        url: 'https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/',
      },
      { label: 'Steamストア', url: steam('2638890') },
      {
        label: 'PCGamingWiki',
        url: pcgw('Onimusha:_Way_of_the_Sword'),
      },
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
    updated: '2026-09-27',
    tags: ['シェーダー', 'クラッシュ', 'カクつき', 'コントローラー'],
    focused: true,
    savePath: String.raw`%LOCALAPPDATA%\Dawnwalker\Saved\SaveGames`,
    configPath: String.raw`%LOCALAPPDATA%\Dawnwalker\Saved\Config\Windows`,
    fps: 'フレームレート上限は30〜モニターの最大リフレッシュレートまで設定可能。ゲーム内のムービーは30fps固定です（PCGamingWiki）。',
    ultrawide:
      'ウルトラワイドはゲームプレイが横に広がる表示に対応。ムービーは上下に黒帯が入ります（PCGamingWiki）。',
    hdr: 'ネイティブのHDR出力には対応していません（PCGamingWiki）。',
    controller:
      'フルコントローラー対応。DualSenseはHotfix 1.0.3でSteam版に対応。ボタン割り当ては「標準」「代替」のプリセットのみです。',
    launchFixes: [
      'ゲームを最新版（1.0.5以降）に更新',
      'シェーダーのコンパイル中に落ちる場合はBIOSを最新に（Intel第13・14世代CPUは特に）',
      'カクつく場合はフルスクリーンで起動',
      'コントローラーで走りが止まる場合は感度を1から0.8へ',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕に対応（音声は非対応。Steamストアの表記）。',
    specs: {
      minimum: 'Windows 10／GTX 1060・RX 580（VRAM 6GB）／メモリ16GB',
      recommended:
        'RTX 4060・RX 7600 XT・Intel Arc B580（VRAM 8GB）／メモリ16GB',
      storage: '60GB（SSD）',
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
      { label: 'Steamストア', url: steam('3751260') },
      { label: 'PCGamingWiki', url: pcgw('The_Blood_of_Dawnwalker') },
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
    updated: '2026-09-27',
    tags: ['起動しない', '黒画面', 'セーブ消えた', '低FPS'],
    focused: true,
    savePath: String.raw`%LOCALAPPDATA%\SWZeroCompany\Saved\SaveGames`,
    configPath: String.raw`%LOCALAPPDATA%\SWZeroCompany\Saved`,
    fps: 'フレームレート上限は無制限・30〜240fpsから選択。GTX 10・RTX 20は「環境ジオメトリ詳細」をオフ、Intel ArcはResizable BARをオン（EA公式）。',
    ultrawide: '',
    hdr: 'HDR対応（Steamストア）。ピーク輝度・明るさ・シャドウ・UIの明るさを調整できます（PCGamingWiki）。',
    controller:
      'DualShock・DualSense対応（Steamストアの表記は部分的コントローラーサポート）。',
    launchFixes: [
      'PCとランチャーを再起動し、更新を適用',
      'ゲームファイルを修復・検証',
      'GPUドライバーを更新（DLSSで落ちる場合はGame Ready 610.88より新しい版）',
      'Intel第13・14世代のデスクトップ向けCPUはBIOSを更新',
    ],
    mod: '',
    japanese: '',
    specs: {
      minimum:
        'Windows 10/11（64bit）／GTX 1080・RX 5600 XT・Intel Arc B580／メモリ16GB（1080p・「低」・30fps）',
      recommended: 'RTX 3080・RX 7800 XT／メモリ32GB（1440p・「高」・60fps）',
      storage: '50GB',
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
      { label: 'Steamストア', url: steam('2075800') },
      { label: 'PCGamingWiki', url: pcgw('Star_Wars_Zero_Company') },
    ],
  },
  {
    slug: 'gears-of-war-e-day',
    title: 'Gears of War: E-Day（ギアーズ・オブ・ウォー E-Day）',
    shortTitle: 'Gears of War: E-Day',
    lead: 'レイトレーシング対応GPUとSSDが必須。起動しない・落ちる原因を、公式の動作環境とベータ版の既知の問題から確認。',
    accent: '#7a1f1f',
    demand: '2026年10月7日発売（日本時間）・Premium Editionは10月2日から',
    issueScale: '非常に高い',
    updated: '2026-09-28',
    tags: ['起動しない', 'クラッシュ', 'レイトレーシング', 'SSD', 'ドライバー'],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      'GPUがハードウェアレイトレーシングに対応しているか確認',
      'Windows 10 22H2（ビルド19045.7291）以降か確認',
      'SSDにインストール（HDDは非対応）',
      'GPUドライバーを公式の推奨版以降に更新',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕・音声に対応（Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 10 22H2以降／RTX 2060・RTX 5050・RX 6600・RX 9060（レイトレーシング対応必須）／メモリ12GB',
      recommended:
        'Windows 11 25H2以降／RTX 3060 Ti・RTX 5060・RX 6700 XT・RX 9060 XT／メモリ16GB',
      storage: '115GB。SSD必須',
    },
    sources: [
      { label: 'Steamストア', url: steam('3010850') },
      {
        label: '公式のお知らせ（Steamニュース）',
        url: 'https://store.steampowered.com/news/app/3010850',
      },
    ],
  },
  {
    slug: 'dragons-dogma-2',
    title: 'ドラゴンズドグマ 2（ダークアリズン）',
    shortTitle: 'ドラゴンズドグマ2',
    lead: '街中で重い・カクつく原因と、TU3.2で追加された軽量化設定を公式情報から確認。ダークアリズン（10月9日）の導入前チェックも。',
    accent: '#6b4a2b',
    demand: '2024年3月発売・ダークアリズンは2026年10月9日発売',
    issueScale: '高い',
    updated: '2026-09-28',
    tags: ['重い', 'カクつく', 'NPC', 'ダークアリズン', 'Windows 11'],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      '最新のアップデート（TU3.2以降）を適用',
      '「NPCの描画人数制御」「CPU省電力モード」などTU3.2の設定を見直す',
      '使用グラフィックスメモリの表示をVRAM内に収める',
      'エクスパンションは本編と最新パッチが必要',
    ],
    mod: '',
    japanese: '日本語対応（カプコン）。',
    specs: {
      minimum:
        'Windows 11（64bit必須）／GTX 1660・RX 5500 XT（8GB）／メモリ16GB（1080p・パフォーマンス重視・アップスケールで45〜60fps）',
      recommended:
        'Windows 11／RTX 2070 Super・RX 6600 XT／メモリ16GB（1080p・パフォーマンス重視・アップスケールで60fps）',
      storage: '記載なし（SSD推奨）',
    },
    sources: [
      { label: 'Steamストア', url: steam('2054970') },
      {
        label: '公式サイト：アップデート情報',
        url: 'https://www.dragonsdogma.com/2/ja-jp/topics/update/',
      },
    ],
  },
  {
    slug: 'final-fantasy-resonance',
    title: 'ファイナルファンタジー レゾナンス（FINAL FANTASY RESONANCE）',
    shortTitle: 'FFレゾナンス',
    lead: 'Windows 11が必要。起動しない時の確認と、体験版セーブの引き継ぎ・予約特典の受け取り方を公式情報から整理。',
    accent: '#2c4f7c',
    demand: '2026年10月23日発売・体験版配信中（セーブ引き継ぎ可）',
    issueScale: '中程度',
    updated: '2026-09-28',
    tags: ['起動しない', '体験版', 'セーブ引き継ぎ', '予約特典', 'Windows 11'],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      'Windows 11か確認（最低環境からWindows 11）',
      'GPUドライバーを更新し、ゲームファイルを確認',
      '体験版で動作を確かめ、セーブを製品版に引き継ぐ',
      '特典はゲームを進めてミトラの町の宿屋前のポストで受け取る',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕・音声に対応（Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 11／GTX 1650・RX 6400・Arc A580／メモリ8GB（1080p・30fps・すべて「低」）',
      recommended:
        'Windows 11／GTX 1650・RX 5500 XT・Arc A580／メモリ8GB（1080p・60fps・すべて「最高」）',
      storage: '15GB',
    },
    sources: [
      { label: 'Steamストア', url: steam('3259780') },
      { label: 'Steamストア：第一章まるごと先行体験版', url: steam('4474710') },
    ],
  },
  {
    slug: 'call-of-duty-modern-warfare-4',
    title:
      'Call of Duty: Modern Warfare 4（コール オブ デューティ モダン・ウォーフェア4）',
    shortTitle: 'CoD MW4',
    lead: 'PC版はTPM 2.0とセキュアブートが必須。遊べない時の確認と有効化の手順をActivision公式の案内から整理。',
    accent: '#3d4a2f',
    demand: '2026年10月23日発売・キャンペーン早期アクセスは10月16日（PT）から',
    issueScale: '非常に高い',
    updated: '2026-09-28',
    tags: [
      'TPM 2.0',
      'セキュアブート',
      '起動しない',
      '電話番号',
      '推奨スペック',
    ],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      'TPM 2.0とセキュアブートが有効か確認（tpm.msc・msinfo32）',
      'Secure Attestation Wizardで要件を満たしているか確認',
      '初回起動時のユーザーアカウント制御（UAC）の確認で「はい」を選ぶ',
      'Steamアカウントに携帯電話番号を登録',
    ],
    mod: '',
    japanese: '日本語の音声・テキスト・字幕に対応（Activision公式）。',
    specs: {
      minimum:
        'Windows 10 64bit（22H2以降）／GTX 970・GTX 1060・RX 470・Arc A580（VRAM 3GB）／メモリ12GB（ベータ版の値）',
      recommended:
        'Windows 11 64bit／RTX 3060 Ti・RX 6700 XT・Arc B580（VRAM 8GB）／メモリ16GB（ベータ版の値）',
      storage: 'SSD必須',
    },
    sources: [
      {
        label: 'Activision公式サポート：TPM 2.0とセキュアブート',
        url: 'https://support.activision.com/articles/trusted-platform-module-and-secure-boot',
      },
      {
        label: 'Call of Duty公式ブログ：ベータ版のPC動作環境',
        url: 'https://www.callofduty.com/blog/2026/08/call-of-duty-modern-warfare-4-next-early-intel-pc-specs',
      },
      { label: 'Steamストア', url: steam('4435490') },
    ],
  },
  {
    slug: 'control-resonant',
    title: 'CONTROL Resonant（コントロール レゾナント）',
    shortTitle: 'CONTROL Resonant',
    lead: 'クラッシュ・重さ・音の途切れを、Remedy公式の既知の問題とサポート手順から確認。',
    accent: '#8a1f1f',
    demand: '2026年9月24日発売',
    issueScale: '高い',
    updated: '2026-09-28',
    tags: ['クラッシュ', '重い', '音が途切れる', 'AMD', 'セーブ場所'],
    focused: true,
    savePath: String.raw`<Steam>\userdata\<Steam ID>\3669870`,
    configPath: String.raw`%LOCALAPPDATA%\Remedy\CONTROLResonant\renderer.ini`,
    fps: 'フレームレート上限は30〜360fps、または上限なし（PCGamingWiki）。',
    ultrawide: 'ウルトラワイドは横に広がる表示（Hor+）に対応（PCGamingWiki）。',
    hdr: 'HDR対応。一部の場所で色が濃くなりすぎる既知の問題あり（Remedy公式）。',
    controller: '',
    launchFixes: [
      'AMD Radeon RX 7000・9000シリーズはAMDの対策ドライバーを確認',
      'レイトレーシング設定を変えた後はゲームを再起動',
      'GPUドライバーを更新し、ゲームファイルを確認',
      '音の不具合はWindowsの出力先と音声設定を確認',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕・音声に対応（Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 10/11／GTX 1070・RX 5600 XT・Arc A580／メモリ16GB（1080p・低・30fps、アップスケール使用）',
      recommended: 'RTX 3060 Ti・RX 6700 XT・Arc B580／メモリ16GB',
      storage: '120GB。SSD必須',
    },
    sources: [
      {
        label: 'Remedy公式ヘルプ：既知の問題',
        url: 'https://remedy.helpshift.com/hc/en/5-control-resonant/faq/314-resonance-disruption-known-issues-and-updates/',
      },
      { label: 'Steamストア', url: steam('3669870') },
      { label: 'PCGamingWiki', url: pcgw('Control_Resonant') },
    ],
  },
  {
    slug: 'silent-hill-townfall',
    title: 'SILENT HILL: Townfall（サイレントヒル タウンフォール）',
    shortTitle: 'SILENT HILL: Townfall',
    lead: 'PC版のカクつき・重さについて、公式が修正パッチを準備中。パッチまでにできる設定の見直しを確認。',
    accent: '#4d5a5e',
    demand: '2026年9月24日発売・PC版の修正パッチ準備中（公式）',
    issueScale: '高い',
    updated: '2026-09-28',
    tags: ['カクつく', '重い', 'Windows 11', 'セーブ場所', 'DLC'],
    focused: true,
    savePath: String.raw`%LOCALAPPDATA%\Townfall\Saved\SaveGames`,
    configPath: String.raw`%LOCALAPPDATA%\Townfall\Saved\Config\Windows`,
    fps: 'フレームレート上限は30〜240fps（30fps刻み）で設定できます（PCGamingWiki）。',
    ultrawide:
      'ウルトラワイドに対応し、レターボックス（黒帯）はオフにできます（PCGamingWiki）。',
    hdr: 'WindowsでHDRが有効なら起動時に自動でHDRになります。ゲーム内の調整項目はありません（PCGamingWiki）。',
    controller: '',
    launchFixes: [
      '公式のお知らせで修正パッチの配信を確認',
      'Windows 11か確認（動作環境はWindows 11）',
      'アップスケーリングを使い、フレームレート上限を設定',
      'GPUドライバーを更新し、ゲームファイルを確認',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕・音声に対応（Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 11／RTX 2060 Super・RX 6600／メモリ16GB（1080p・低・30fps）',
      recommended:
        'RTX 3080・RX 7800 XT／メモリ32GB（4K・高・30fps、DLSS・FSR・TSRのバランス使用）',
      storage: '75GB',
    },
    sources: [
      { label: 'Steamストア', url: steam('1636440') },
      {
        label: '公式のお知らせ（Steamニュース）',
        url: 'https://store.steampowered.com/news/app/1636440',
      },
      { label: 'PCGamingWiki', url: pcgw('Silent_Hill:_Townfall') },
    ],
  },
  {
    slug: 'minecraft-dungeons-2',
    title: 'Minecraft Dungeons II（マインクラフト ダンジョンズ2）',
    shortTitle: 'Minecraft Dungeons II',
    lead: 'Microsoftアカウント必須・最大4人のクロスプレイ。友達と遊べない時の確認を公式情報から整理。',
    accent: '#3f7a3a',
    demand: '2026年9月29日発売・Game Pass対応',
    issueScale: '中程度',
    updated: '2026-09-28',
    tags: [
      'マルチプレイ',
      'クロスプレイ',
      'Microsoftアカウント',
      'パーティーコード',
    ],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      'Microsoftアカウントでサインイン（Steam版も必要）',
      'パーティーコードで参加',
      'パーティーは最大4人（同じPCで遊ぶ人も含む）',
      'VPNを止め、回線を見直す',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕・音声に対応（Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 10（1703以降）／GTX 1050・RX 560（VRAM 2GB以上）／メモリ8GB',
      recommended: 'GTX 1060・RX 580（VRAM 6GB以上）／メモリ16GB',
      storage: '記載なし（Steamストア）',
    },
    sources: [
      { label: 'Steamストア', url: steam('1912410') },
      {
        label:
          'Minecraft公式：Minecraft Dungeons IIの新しいゲームシステム（英語）',
        url: 'https://www.minecraft.net/en-us/article/minecraft-dungeons-ii-gameplay-systems',
      },
    ],
  },
  {
    slug: 'aion2',
    title: 'AION2（アイオン2）',
    shortTitle: 'AION2',
    lead: 'アーリーアクセス開始時のログイン待ち・接続不良を、運営側の混雑とPC側の原因に分けて確認。',
    accent: '#3b5b8c',
    demand: '2026年9月30日アーリーアクセス・10月5日正式サービス（基本無料）',
    issueScale: '高い',
    updated: '2026-09-28',
    tags: ['ログインできない', '接続できない', '待機列', 'アーリーアクセス'],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      '公式のお知らせで障害・メンテナンスを確認',
      '待機列は抜けずに待つ',
      'Steam版はPlaytestアプリを削除し、AION 2本体をダウンロード',
      'VPN・通信ツールを止め、有線接続で試す',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕・音声に対応（Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 10/11（64bit）／GTX 1050 Ti・RX 470（4GB）／メモリ8GB（FHDはプリセット「非常に低い」）',
      recommended:
        'RTX 2070・RX 5700 XT（8GB）／メモリ16GB（FHDはプリセット「低い」）',
      storage: '100GB',
    },
    sources: [
      { label: 'Steamストア', url: steam('3393110') },
      {
        label: 'NC公式：ファウンダーズパックとアーリーアクセス',
        url: 'https://about.ncsoft.com/jp/news/article/Aion2_update_2607232',
      },
    ],
  },
  {
    slug: 'ace-combat-8',
    title:
      'エースコンバット8 ウイングス・オブ・シーヴ（ACE COMBAT 8: WINGS OF THEVE）',
    shortTitle: 'エースコンバット8',
    lead: 'レイトレーシング対応GPU・SSD・Windows 11が必須。起動しない原因を動作環境から順に確認。',
    accent: '#2f5d73',
    demand: '2026年10月2日発売・9月29日アーリーアクセス',
    issueScale: '高い',
    updated: '2026-09-28',
    tags: [
      '起動しない',
      'クラッシュ',
      'レイトレーシング',
      'Windows 11',
      '推奨スペック',
    ],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      'GPUがハードウェアレイトレーシングに対応しているか確認',
      'Windows 11か確認（最低環境からWindows 11）',
      'SSDにインストールし、空き容量150GBを確保',
      'GPUドライバーを更新し、整合性を確認',
    ],
    mod: '',
    japanese: '日本語のインターフェース・字幕・音声に対応（公式サイト）。',
    specs: {
      minimum:
        'Windows 11／RTX 2060（6GB）・RX 6600 XT（8GB）／メモリ16GB（1080p・LOW・30fps、アップスケール使用）',
      recommended:
        'RTX 3070・RX 6800／メモリ32GB（1080p・MEDIUM・60fps、アップスケール使用）',
      storage: '150GB。SSD必須',
    },
    sources: [
      {
        label: '公式サイト（STEAM版システム要件）',
        url: 'https://enso-order.acecombat.jp/',
      },
      { label: 'Steamストア', url: steam('2288340') },
    ],
  },
  {
    slug: 'shin-sangoku-musou-2-remastered',
    title: '真・三國無双２ with 猛将伝 Remastered',
    shortTitle: '真・三國無双2 Remastered',
    lead: 'VRAM 6GB以上・Windows 11が必要。起動しない・重い時の確認を、体験版での事前チェックと合わせて案内。',
    accent: '#8c3b2f',
    demand: '2026年10月1日発売・体験版配信中',
    issueScale: '中程度',
    updated: '2026-09-28',
    tags: ['起動しない', '重い', 'VRAM', '体験版', '推奨スペック'],
    focused: true,
    savePath: '',
    configPath: '',
    fps: '',
    ultrawide: '',
    hdr: '',
    controller: '',
    launchFixes: [
      'GPUのVRAMが6GB以上か確認',
      'Windows 11か確認',
      'GPUドライバーを更新してPCを再起動',
      '体験版で自分のPCで動くか事前に確認',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕・音声に対応（Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 11／GTX 1060・RX 5600 XT・Arc A380（VRAM 6GB）／メモリ16GB（1080p・30fps・「低」、アップスケール使用）',
      recommended:
        'RTX 3060・RX 6700 XT（VRAM 8GB）／メモリ16GB（1080p・60fps・「高」、アップスケール使用）',
      storage: '60GB',
    },
    sources: [
      { label: '公式サイト', url: 'https://www.gamecity.ne.jp/smusou2-re/jp/' },
      { label: 'Steamストア', url: steam('3841510') },
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
    updated: '2026-09-27',
    tags: ['サーバー接続', 'ログイン待ち', '接続できない'],
    focused: true,
    savePath: String.raw`%LOCALAPPDATA%\Wardogs\Saved\SaveGames`,
    configPath: String.raw`%LOCALAPPDATA%\Wardogs\Saved\Config\WindowsClient`,
    fps: 'フレームレートは上限なし、または最大360fpsまで設定可能。メインメニューは別に設定できます（PCGamingWiki）。',
    ultrawide: 'ウルトラワイドは横に広がる表示（Hor+）に対応（PCGamingWiki）。',
    hdr: 'ネイティブのHDR出力には対応していません（PCGamingWiki）。',
    controller: '',
    launchFixes: [
      'Steamのニュースで障害・メンテナンスを確認',
      'ログイン待ちの列は抜けずに待つ',
      '更新を適用してSteamとPCを再起動',
      'ファミリーシェアリングではなく自分のアカウントで購入（9月18日に無効化）',
    ],
    mod: '',
    japanese:
      '日本語のインターフェース・字幕に対応（音声は非対応。Steamストアの表記）。',
    specs: {
      minimum:
        'Windows 10／GTX 1660・RX 590／メモリ16GB（1080p・低・アップスケールで60fps）',
      recommended:
        'Windows 11／RTX 3070・RX 6700 XT／メモリ16GB（1440p・中で70fps以上）',
      storage: '50GB',
    },
    sources: [
      { label: 'Steamストア', url: steam('1867240') },
      {
        label: '発売日のサーバー障害報道',
        url: 'https://www.pcgamer.com/games/fps/wardogs-servers-go-down-as-over-300-000-people-rush-to-play-on-launch-day/',
      },
      { label: 'PCGamingWiki', url: pcgw('Wardogs') },
    ],
  },
  {
    slug: 'monster-hunter-wilds',
    title: 'モンスターハンターワイルズ',
    shortTitle: 'モンハンワイルズ',
    lead: 'モンハンワイルズのクラッシュ・起動失敗を発生場面別に切り分け。MOD、GPU、VRAM、クラッシュ記録から次の対処を選べます。',
    accent: '#d2673d',
    demand: '2025年発売・Steam最大約138万人',
    issueScale: '非常に高い',
    updated: '2026-09-30',
    tags: [
      'クラッシュ',
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
    fps: 'ゲーム中のFPS上限は30〜360fps、ムービーは30〜60fpsで設定。推奨環境の60fpsはフレーム生成を使った目安です。フレーム生成を選べない時はWindowsの「ハードウェアアクセラレータによるGPUスケジューリング」をオンにします。',
    ultrawide:
      '21:9まで対応（ゲームプレイ・ムービーとも横に広がる表示）。3440×1440では正確な21:9に合わせるため端に小さな黒帯が出ます。32:9は非対応。',
    hdr: 'HDR対応。Windows側のHDRを先に有効化し、ゲーム内輝度を再調整します。',
    controller:
      'コントローラー操作はSteam入力が前提。ボタン表示は自動で切り替わらないため手動で選択。DualSenseの振動はUSB接続で使います。',
    launchFixes: [
      'Steamの「インストール済みファイルの整合性を確認」を実行',
      '落ちた場面・エラー・GPUドライバー版を記録し、公式案内の対応版と照合して比較',
      'config.iniをバックアップ後に退避し、設定を再生成',
      'VRAM 16GB未満なら高解像度テクスチャパックを無効化（公式）',
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
        label: '公式お知らせ（推奨ドライバー）',
        url: 'https://store.steampowered.com/news/app/2246340/view/534357354429284375',
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
    updated: '2026-09-29',
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
    updated: '2026-09-29',
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
    updated: '2026-09-29',
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
    updated: '2026-09-29',
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
    updated: '2026-09-29',
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
    updated: '2026-09-29',
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
    updated: '2026-09-29',
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
