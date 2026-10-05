import type { GameArticle } from '@/lib/game-articles';

// 2026年10月発売の新作の個別記事。公式のお知らせ・Steamストア・公式サイトで
// 確認した内容だけを載せています（確認日は各記事のcheckedAt）。
// STEPのidは解決報告（D1）の集計キーなので、公開後は変更しないでください。

type Draft = Omit<GameArticle, 'symptoms' | 'seoTitle' | 'status'> & {
  seoTitle?: string;
};

const make = (draft: Draft): GameArticle => ({
  status: 'verified',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const steamVerify =
  'Steam：ライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」';

const gearsSources = {
  launch: {
    label:
      'Steamニュース（公式）：Gears of War: E-Day is Available in Early Access Today（10月1日・サポートとサービス状況の案内）',
    url: 'https://store.steampowered.com/news/app/3010850',
  },
  gold: {
    label: 'Steamニュース（公式）：ゴールド到達・発売日時・最終PC動作環境',
    url: 'https://store.steampowered.com/news/app/3010850',
  },
  beta: {
    label:
      'Steamニュース（公式）：オープンベータの既知の問題・推奨ドライバー・ポート',
    url: 'https://store.steampowered.com/news/app/3010850',
  },
  steam: {
    label: 'Steamストア：Gears of War: E-Day（動作環境・PC版の機能）',
    url: 'https://store.steampowered.com/app/3010850/',
  },
  support: {
    label: 'Gears of War公式サポート（問い合わせ）',
    url: 'https://aka.ms/gearscontactsupport',
  },
  status: {
    label: 'Gears of War公式：サービス状況（status.gearsofwar.com）',
    url: 'https://status.gearsofwar.com/',
  },
};

export const octoberReleaseArticles: GameArticle[] = [
  make({
    gameSlug: 'gears-of-war-e-day',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-03',
    seoTitle:
      'Gears of War: E-Day（ギアーズ）が起動しない・落ちる時の対処法【PC版】',
    title:
      'Gears of War: E-Day（ギアーズ・オブ・ウォー E-Day）が起動しない・落ちる時の対処法【PC版】',
    shortTitle: '起動しない・クラッシュ',
    targetVersion: 'Steam版・XBOX on PC版・2026年10月1日時点の公式情報',
    symptom:
      'PC版が起動しない、起動直後に落ちる、読み込みが終わらない、テクスチャが表示されない、オンラインに接続できない場合の確認手順です。',
    conclusion:
      '最低環境から、ハードウェアレイトレーシング対応GPUとSSDが必須です。GTX 10／16シリーズのGPUやHDDへのインストールでは正常に動きません。次にWindowsのバージョンとGPUドライバーを確認します。オープンベータでは、古いNVIDIAドライバーだと起動しないことが公式の既知の問題として挙げられていました。',
    description:
      'Premium Editionの早期アクセスは日本時間10月2日0時から、発売は10月7日0時からです（公式の太平洋時間8時を日本時間に換算）。Game Pass Ultimate・PC Game Passでは発売日から遊べます。',
    causes: [
      'GPUがハードウェアレイトレーシングに対応していない',
      'HDDにインストールしている（公式はHDD非対応と案内）',
      'Windowsが古い（最低環境はWindows 10 22H2 ビルド19045.7291）',
      'GPUドライバーが古い',
      '古いOBS・一部のセキュリティソフトとの競合（ベータ版の既知の問題）',
    ],
    quickFacts: [
      {
        label: '必須（最低環境から）',
        value: 'ハードウェアレイトレーシング対応GPU／SSD／DirectX 12',
      },
      {
        label: '最低動作環境',
        value:
          'Windows 10 22H2以降／RTX 2060・RTX 5050・RX 6600・RX 9060／メモリ12GB／115GB',
      },
      {
        label: '推奨動作環境',
        value:
          'Windows 11 25H2以降／RTX 3060 Ti・RTX 5060・RX 6700 XT・RX 9060 XT／メモリ16GB',
      },
      {
        label: '推奨ドライバー（ベータ版の案内）',
        value: 'NVIDIA 610.74以降／AMD 26.7.1／Intel 101.8864',
      },
      {
        label: '遊べる日時（日本時間）',
        value: 'Premium Edition：10月2日0時／発売・Game Pass：10月7日0時',
      },
    ],
    diagnosis: [
      {
        symptom: 'GTX 10／16シリーズ、RX 5000シリーズ以前で起動しない',
        cause: 'レイトレーシング非対応のGPU',
        stepId: 'step-1',
      },
      {
        symptom: '読み込みが終わらない・テクスチャが出ない・カクつく',
        cause: 'HDDにインストールしている',
        stepId: 'step-2',
      },
      {
        symptom: '起動しない（GPUは対応している）',
        cause: 'Windows・ドライバーが古い',
        stepId: 'step-3',
      },
      {
        symptom: '録画中・特定のソフトを入れていると落ちる',
        cause: '古いOBS・セキュリティソフトとの競合',
        stepId: 'step-4',
      },
      {
        symptom: 'Intel Arcで極端に重い・起動が遅い',
        cause: 'Resizable BARが無効',
        stepId: 'step-5',
      },
      {
        symptom: 'オンラインに入れない・エラーコードが出る',
        cause: 'アカウント・ネットワークのポート',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'GPUがハードウェアレイトレーシングに対応しているか確認する',
        summary:
          'Steamストアの最低環境には「ハードウェアレイトレーシング対応GPUが必須」と書かれています。非対応のGPUは設定を変えても要件を満たせません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Ctrl + Shift + Esc でタスクマネージャーを開き、「パフォーマンス」→「GPU」の右上でGPU名を確認する',
          'NVIDIAはGeForce RTX 20シリーズ以降、AMDはRadeon RX 6000シリーズ以降が対応。GTX 10／16シリーズ、RX 5000シリーズ以前は非対応',
          '最低環境のGPUはRTX 2060・RTX 5050・RX 6600・RX 9060。対応GPUでもこれより性能が低いと重くなる',
        ],
      },
      {
        id: 'step-2',
        title: 'SSDにインストールする',
        summary:
          '公式は、HDDは非対応で、読み込みの問題・表示されない素材・カクつき・クラッシュの原因になると案内しています。',
        time: '約20分（移動するデータ量による）',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「インストールフォルダを移動」からSSDを選ぶ（再ダウンロード不要）',
          '空き容量は115GB必要。アップデート分の余裕も確保する',
        ],
      },
      {
        id: 'step-3',
        title: 'WindowsとGPUドライバーを更新する',
        summary:
          '最低環境はWindows 10 22H2（ビルド19045.7291）です。オープンベータでは、古いNVIDIAドライバーでは更新するまで起動しないと案内されていました。',
        time: '約20分',
        risk: 'low',
        actions: [
          'Windows + R →「winver」と入力してEnter。Windows 10の場合はバージョン22H2・ビルド19045.7291以降か確認し、古ければWindows Updateを実行する',
          'NVIDIAはNVIDIA App、AMDはAMD Software: Adrenalin Edition、IntelはIntelの公式サイトから更新する（ベータ版の推奨：NVIDIA 610.74以降、AMD 26.7.1、Intel 101.8864）',
          '更新後にPCを再起動する',
          steamVerify,
        ],
      },
      {
        id: 'step-4',
        title: '録画ソフト・セキュリティソフトとの競合を確認する',
        summary:
          'オープンベータの既知の問題として、古いOBSでの録画によるクラッシュと、Comodo Antivirusがゲームの実行ファイルを誤ってブロックする問題が公開されていました。',
        time: '約10分',
        risk: 'low',
        actions: [
          'OBSを使っている場合はバージョン29.0.0以降に更新する',
          'Comodo Antivirusを含む保護機能は有効に保つ。検出がある場合は検出名と対象ファイルを確認し、除外や隔離からの復元を行う前にComodoかゲームの公式サポートに相談する',
          'Discord・Steamのオーバーレイ、FPS表示ツールも一度オフにして起動を比べる',
        ],
      },
      {
        id: 'step-5',
        title: 'Intel ArcはResizable BARを有効にする',
        summary:
          'オープンベータでは、Intel Arc A580・B580でResizable BAR（ReBAR）が無効だと大幅に性能が落ちること、Arcでは起動のたびにシェーダーを作り直すため起動が長いことが既知の問題とされていました。',
        time: '約15分',
        risk: 'medium',
        actions: [
          'マザーボードやPCメーカーの手順に沿ってBIOSを開き、「Re-Size BAR Support（Resizable BAR）」と「Above 4G Decoding」を有効にする（項目名はメーカーで異なる）',
          '保存して再起動し、同じ場面で重さを比べる',
        ],
        note: 'BIOSの画面や項目名はメーカーで異なります。分からない場合はメーカーの公式手順を確認してください。',
      },
      {
        id: 'step-6',
        title: 'オンラインに入れない時はアカウントとポートを確認する',
        summary:
          'オープンベータでは、XBOXアプリとMicrosoft Storeに別のアカウントでサインインしているとオンラインで遊べない問題が公開されていました。エラーコード「drone-snub」の対策で、必要なポートはUDP 3074に変わっています。',
        time: '約10分',
        risk: 'low',
        actions: [
          '先に公式のサービス状況ページ（status.gearsofwar.com）で、障害やメンテナンスが出ていないか確認する（公式の案内）',
          'XBOX on PC版（Game Pass）の場合、XBOXアプリとMicrosoft Storeで同じMicrosoftアカウントにサインインしているか確認する',
          'drone-snubのエラーが出る場合は、ルーターでUDP 3074の通信が遮断されていないか確認する（ルーターの説明書やプロバイダーの案内を参照）',
          '直らない場合は、表示されたエラーコードと時刻を控えて公式サポート（GearsofWar.com/support）に問い合わせる',
        ],
      },
    ],
    avoid: [
      'レイトレーシング非対応のGPUで、非公式ツールや設定ファイルの書き換えで起動させようとしない',
      '起動させるためだけに保護機能を停止したり、許可リストに追加したりしない',
      'ルーターのポートを無闇に開放しない（必要なポートだけを確認する）',
    ],
    cautions: [
      'ドライバーの推奨版と既知の問題はオープンベータ時点の公式の案内です。発売時の最新の案内もあわせて確認してください。',
    ],
    faqs: [
      {
        question: 'GTX 1660やGTX 1080で遊べますか？',
        answer:
          '遊べません。最低環境からハードウェアレイトレーシング対応GPUが必須で、GTX 10／16シリーズは要件を満たしません。',
      },
      {
        question:
          'ウルトラワイドモニターやフレームレート上限なしに対応していますか？',
        answer:
          'Steamストアによると、ゲームプレイとメニューで21:9・32:9のウルトラワイドに対応し、対応ハードウェアではフレームレート上限なしにできます。オープンベータでは150fpsの一時的な上限とフレーム生成の無効化がありましたが、製品版では解除されると案内されています。',
      },
      {
        question: 'PC Game Passでも遊べますか？',
        answer:
          'Game Pass UltimateとPC Game Passでは発売日（日本時間10月7日0時）から遊べます。10月2日からの早期アクセスはPremium Editionと、Game Passでプレミアムアップグレードを購入した人が対象です（10月1日の公式のお知らせ）。',
      },
    ],
    sources: [
      {
        label: 'Microsoft：Windowsセキュリティの除外設定の注意',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      gearsSources.launch,
      gearsSources.gold,
      gearsSources.steam,
      gearsSources.beta,
      gearsSources.support,
      gearsSources.status,
    ],
    related: [],
    metaDescription:
      'Gears of War: E-Day（ギアーズ・オブ・ウォー E-Day）PC版が起動しない・落ちる時の対処法。必須のレイトレーシング対応GPUとSSD、Windows 10 22H2以降、推奨ドライバー、OBS・セキュリティソフトとの競合、Intel ArcのReBAR、オンラインのポートまで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'dragons-dogma-2',
    slug: 'performance',
    category: 'display',
    checkedAt: '2026-09-28',
    seoTitle:
      'ドラゴンズドグマ2が重い・カクつく時の設定と対処法【PC版・ダークアリズン対応】',
    title:
      'ドラゴンズドグマ2（ダークアリズン）が重い・カクつく時の設定と対処法【PC版】',
    shortTitle: '重い・カクつく・DLC',
    targetVersion: 'Steam版（TU3.2以降）・2026年9月28日時点',
    symptom:
      '街中や人が多い場所で重くなる、fpsが安定しない、VRAM不足で落ちる、ダークアリズンのエクスパンションが遊べない場合の確認手順です。',
    conclusion:
      'まず最新のアップデート（9月2日配信のTU3.2以降）を適用します。TU3.2ではフレームレートが改善され、Steam版には「NPCの描画人数制御」「CPU省電力モード」などの軽量化設定が追加されました。カプコンは、NPCが多い街中ではCPUの負荷が高くなり、処理負荷が下がる設定でフレームレートの改善が見込めると案内しています。',
    description:
      'ダークアリズンは2026年10月9日発売です。Steam版は本編とのセット「ドラゴンズドグマ 2：ダークアリズン」と、本編を持っている人向けのエクスパンション（DLC）があり、DLCは本編と最新パッチが必要です。',
    causes: [
      '古いバージョンのまま遊んでいる（TU3.2でフレームレート改善）',
      'NPCが多い場面でのCPUの負荷',
      'グラフィックスメモリ（VRAM）の使用量が多すぎる',
      '動作環境を満たしていない（Windows 11が必須）',
      'エクスパンションに必要な本編・最新パッチがない',
    ],
    quickFacts: [
      { label: 'まずやること', value: '最新のアップデート（TU3.2以降）を適用' },
      {
        label: 'TU3.2で追加された軽量化設定（Steam版）',
        value:
          'NPCの描画人数制御／CPU省電力モード／草密度・草揺れの品質／Volumetric Fog・Cloudscapeの解像度／レイトレーシングGIの品質',
      },
      {
        label: '最低動作環境',
        value:
          'Windows 11（64bit必須）／GTX 1660・RX 5500 XT（8GB）／メモリ16GB',
      },
      {
        label: 'レイトレーシングを使うには',
        value: 'RTX 2080 Ti または RX 6800 が必要（Steamストア）',
      },
      {
        label: 'ダークアリズン',
        value: '2026年10月9日発売。エクスパンションは本編と最新パッチが必要',
      },
    ],
    diagnosis: [
      {
        symptom: '全体的に重い・更新していない',
        cause: '古いバージョン',
        stepId: 'step-1',
      },
      {
        symptom: '街中・人が多い場所だけ重い',
        cause: 'NPCが多い場面のCPU負荷',
        stepId: 'step-2',
      },
      {
        symptom: '景色の多い場所で重い・GPU使用率が高い',
        cause: '草・霧・雲・レイトレーシングの負荷',
        stepId: 'step-3',
      },
      {
        symptom: '落ちる・テクスチャがぼやける',
        cause: 'グラフィックスメモリ（VRAM）の使いすぎ',
        stepId: 'step-4',
      },
      {
        symptom: 'Windows 10のPCで遊んでいる',
        cause: '動作環境を満たしていない',
        stepId: 'step-5',
      },
      {
        symptom: 'ダークアリズンの内容が出てこない',
        cause: '本編・最新パッチ・DLCの反映',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '最新のアップデート（TU3.2以降）を適用する',
        summary:
          '9月2日配信のTU3.2では、フレームレートの改善、セーブスロットの拡張（1つ→3つ）、Steam版のグラフィック設定の追加が行われました。',
        time: '約10分',
        risk: 'low',
        actions: [
          'Steamのダウンロード画面で、ドラゴンズドグマ2の更新が残っていないか確認する',
          '更新後に起動し、同じ場所でfpsを比べる',
          steamVerify,
        ],
      },
      {
        id: 'step-2',
        title:
          '街中で重い時は「NPCの描画人数制御」と「CPU省電力モード」を見直す',
        summary:
          'カプコンは、街中などNPCが多数登場する場面でCPUに負荷がかかることを認め、処理負荷が下がる設定でフレームレートの改善が見込めると案内しています。',
        time: '約5分',
        risk: 'low',
        actions: [
          '「Options」→「Graphics」で「NPCの描画人数制御」を下げ、人の多い街で比べる',
          '「CPU省電力モード」の設定を切り替えて比べる（効果はPCによって異なる）',
          'グラフィック品質を「パフォーマンス重視」にする',
        ],
        note: '設定は1項目ずつ変え、同じ場所で比べると、どれが効いたか分かります。',
      },
      {
        id: 'step-3',
        title: '景色の多い場所で重い時は、草・霧・雲・レイトレーシングを下げる',
        summary:
          'TU3.2でSteam版に、負荷を細かく調整できる項目が追加されました。',
        time: '約10分',
        risk: 'low',
        actions: [
          '「草密度の設定」「草揺れの品質」「Groundの品質設定」を下げる',
          '「Volumetric Fogの解像度設定」「Cloudscapeの解像度設定」を下げる',
          'レイトレーシングを使っている場合は「レイトレーシングGIの品質設定」を下げるか、オフにして比べる（レイトレーシングにはRTX 2080 TiまたはRX 6800が必要）',
          'DLSS・FSRなどのアップスケーリングを使う（NVIDIAはDLSS FRAME GENERATIONも選べる）',
        ],
      },
      {
        id: 'step-4',
        title: '使用グラフィックスメモリの表示を、搭載VRAMの範囲に収める',
        summary:
          'TU3.2から、グラフィック設定画面に使用グラフィックスメモリが表示されるようになりました。',
        time: '約5分',
        risk: 'low',
        actions: [
          'タスクマネージャーの「パフォーマンス」→「GPU」で「専用GPUメモリ」（VRAM）の容量を確認する',
          'グラフィック設定画面の使用グラフィックスメモリの表示が、VRAMの容量を超えないようにテクスチャ品質などを下げる',
        ],
      },
      {
        id: 'step-5',
        title: '動作環境（Windows 11）を確認する',
        summary:
          'Steamストアの動作環境は、最低・推奨ともWindows 11（64bit必須）です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windows + R →「winver」でWindows 11か確認する',
          'GPUがGTX 1660・RX 5500 XT（8GB）以上、メモリが16GB以上か確認する',
          'SSDへのインストールが推奨されている。HDDの場合はSSDへの移動も検討する',
        ],
      },
      {
        id: 'step-6',
        title:
          'ダークアリズンの内容が出てこない時は、本編・パッチ・DLCを確認する',
        summary:
          'エクスパンション（DLC）は本編がないと遊べず、最新パッチの適用が必要な場合があります（Steamストアの記載）。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Steamのライブラリでドラゴンズドグマ2を開き、「DLC」の欄にエクスパンションがインストール済みになっているか確認する',
          '本編の更新を適用してから、Steamを再起動して起動する',
          '本編とDLCを重複して買わないよう、セット商品「ドラゴンズドグマ 2：ダークアリズン」か、エクスパンション単体かを購入前に確認する',
        ],
      },
    ],
    avoid: [
      '複数の設定を同時に変えない（どれが効いたか分からなくなる）',
      'セーブデータのフォルダを手動で消したり書き換えたりしない',
    ],
    cautions: [
      'ダークアリズンの発売後は、公式のアップデート情報で新しい不具合・修正も確認してください。',
    ],
    faqs: [
      {
        question: 'ダークアリズンはいつから遊べますか？',
        answer:
          '2026年10月9日発売です。Steam版は本編とのセット（ドラゴンズドグマ 2：ダークアリズン）と、本編を持っている人向けのエクスパンション（DLC）があります。',
      },
      {
        question: 'Windows 10で遊べますか？',
        answer:
          'Steamストアの動作環境は、最低・推奨ともWindows 11（64bit必須）と記載されています。',
      },
      {
        question: 'セーブは何個まで作れますか？',
        answer:
          'TU3.2で、覚者ごとのセーブスロットが1つから3つに増えました。各スロットに「オートセーブ」「中断セーブ」「最後に休息した宿屋セーブ」の3種類が保存されます。',
      },
    ],
    sources: [
      {
        label:
          'カプコン公式サイト：ドラゴンズドグマ2 アップデート情報（TU3.2・CPU負荷の改善）',
        url: 'https://www.dragonsdogma.com/2/ja-jp/topics/update/',
      },
      {
        label: 'カプコン プレスリリース：TU3.2配信とダークアリズンの商品情報',
        url: 'https://prtimes.jp/main/html/rd/p/000006004.000013450.html',
      },
      {
        label: 'Steamストア：Dragon’s Dogma 2（動作環境）',
        url: 'https://store.steampowered.com/app/2054970/',
      },
      {
        label: 'Steamストア：ダークアリズン エクスパンション（本編が必要）',
        url: 'https://store.steampowered.com/app/2593290/',
      },
    ],
    related: [],
    metaDescription:
      'ドラゴンズドグマ2（ダークアリズン）PC版が重い・カクつく時の対処法。TU3.2で追加された「NPCの描画人数制御」「CPU省電力モード」などの軽量化設定、VRAMの目安、Windows 11の動作環境、エクスパンションが出てこない時の確認まで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'final-fantasy-resonance',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-09-28',
    seoTitle: 'FFレゾナンスが起動しない・特典が受け取れない時の対処法【PC版】',
    title:
      'ファイナルファンタジー レゾナンスが起動しない・特典が受け取れない時の対処法｜体験版の引き継ぎも【PC版】',
    shortTitle: '起動しない・特典・体験版',
    targetVersion: 'Steam版・体験版・2026年9月28日時点',
    symptom:
      'PC版や体験版が起動しない、体験版のセーブを製品版で使いたい、予約特典・早期購入特典・Digital Deluxe Editionのアイテムが見当たらない場合の確認手順です。',
    conclusion:
      '動作環境は最低・推奨ともWindows 11です。起動しない時は、まずWindowsのバージョンとGPUドライバーを確認します。特典はすぐには届かず、ゲームを一定以上進めた後に「ミトラの町」の宿屋前にあるポストから受け取ります。体験版のセーブデータは製品版に引き継げます（公式）。',
    description:
      'Steam版の発売は2026年10月23日です。無料の「第一章まるごと先行体験版」では、製品版と同じ第一章を遊べます（一部のレベル制限あり）。購入前に、体験版で自分のPCで動くか確かめられます。',
    causes: [
      'Windows 11ではない（最低環境からWindows 11）',
      'GPUドライバーが古い・ゲームファイルの破損',
      '特典の受け取り場所まで進んでいない',
      '予約購入・早期購入の条件を満たしていない',
      '見た目を変えるアイテムをONにしていない',
    ],
    quickFacts: [
      {
        label: '最低動作環境',
        value: 'Windows 11／GTX 1650・RX 6400・Arc A580／メモリ8GB／15GB',
      },
      {
        label: '体験版',
        value:
          '第一章を丸ごと遊べる。セーブデータは製品版に引き継ぎ可能（公式）',
      },
      {
        label: '特典の受け取り場所',
        value: 'ゲームを一定以上進めた後、「ミトラの町」の宿屋前のポスト',
      },
      {
        label: '早期購入特典の条件',
        value: '2026年11月7日 1:59（日本時間）までに購入',
      },
      {
        label: '魔導船・魔導アーマーの見た目',
        value: 'メインメニュー →「アイテム」で認証キー・鍵をONにする',
      },
    ],
    diagnosis: [
      {
        symptom: 'Windows 10のPCで起動しない',
        cause: '動作環境を満たしていない',
        stepId: 'step-1',
      },
      {
        symptom: '起動直後に落ちる・黒画面',
        cause: 'ドライバー・ファイル',
        stepId: 'step-2',
      },
      {
        symptom: '体験版の続きから遊びたい',
        cause: 'セーブの引き継ぎ',
        stepId: 'step-3',
      },
      {
        symptom: '別のPCで続きを遊びたい',
        cause: 'Steamクラウドの設定',
        stepId: 'step-4',
      },
      {
        symptom: '特典のアイテムがない',
        cause: '受け取り場所・購入条件',
        stepId: 'step-5',
      },
      {
        symptom: '飛空艇・チョコボの見た目が変わらない',
        cause: 'アイテムがOFFのまま',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Windows 11と動作環境を確認する',
        summary: 'Steamストアの動作環境は、最低・推奨ともWindows 11です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windows + R →「winver」と入力してEnterを押し、Windows 11か確認する',
          'タスクマネージャーの「パフォーマンス」→「GPU」で、GTX 1650・RX 6400・Arc A580以上か確認する',
          'メモリ8GB以上、空き容量15GB以上、DirectX 12対応が必要',
        ],
      },
      {
        id: 'step-2',
        title: 'GPUドライバーを更新し、ゲームファイルを確認する',
        summary: '起動直後に落ちる・黒画面になる場合に確認します。',
        time: '約15分',
        risk: 'low',
        actions: [
          'NVIDIAはNVIDIA App、AMDはAMD Software: Adrenalin Edition、IntelはIntelの公式サイトから最新のドライバーに更新し、PCを再起動する',
          steamVerify,
          'Discord・Steamのオーバーレイ、録画・FPS表示ツールをオフにして起動を比べる',
        ],
      },
      {
        id: 'step-3',
        title: '体験版のセーブデータを製品版で使う',
        summary:
          '公式は、体験版のセーブデータを製品版に引き継げると案内しています。体験版は第一章の範囲で、一部のレベルに制限があります。',
        time: '約5分',
        risk: 'low',
        actions: [
          '体験版を遊んだのと同じSteamアカウントで製品版を起動する',
          '製品版で体験版のセーブデータが読み込めるか確認してから、体験版をアンインストールする',
          '読み込めない場合は、体験版と製品版の両方でSteamクラウドの保存が有効か確認する（手順4）',
        ],
        note: '引き継ぎの具体的な画面や操作は、発売時の公式の案内も確認してください。',
      },
      {
        id: 'step-4',
        title: 'Steamクラウドへのセーブの保存を確認する',
        summary:
          '製品版・体験版ともSteamクラウドに対応しています（Steamストアの表記）。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「一般」で、Steamクラウドへの保存が有効になっているか確認する',
          '別のPCで遊ぶ時は、前のPCでゲームを終了してSteamの同期が終わってから起動する',
        ],
      },
      {
        id: 'step-5',
        title: '特典はミトラの町の宿屋前のポストで受け取る',
        summary:
          '予約特典・早期購入特典・Digital Deluxe Editionのアイテムは、ゲームを一定以上進めた後に、「ミトラの町」の宿屋前に置かれたポストから受け取ります（Steamストアの記載）。',
        time: '進行状況による',
        risk: 'low',
        actions: [
          'ストーリーを進め、「ミトラの町」の宿屋前にあるポストを調べる',
          '予約特典「魔導船＆かけだし騎士の応援パック」は予約購入した場合だけ付く（発売日以降の購入には付かない）',
          '早期購入特典「かけだし騎士のスタートダッシュパック」は2026年11月7日 1:59（日本時間）までの購入が条件',
        ],
      },
      {
        id: 'step-6',
        title: '魔導船・魔導アーマーの見た目はアイテムをONにする',
        summary: '見た目を変えるアイテムは、受け取っただけでは反映されません。',
        time: '約1分',
        risk: 'low',
        actions: [
          '飛空艇を魔導船にする：メインメニュー →「アイテム」で「魔導船認証キー」をONにする',
          'チョコボを魔導アーマーにする（Digital Deluxe Edition）：メインメニュー →「アイテム」で「魔導アーマーの鍵」をONにする',
        ],
      },
    ],
    avoid: [
      '製品版で引き継ぎを確認する前に、体験版のセーブデータを消さない',
      'Digital Deluxe Editionと単品のDLCを重複して買わない（公式の注意）',
    ],
    cautions: [
      '発売後に公式が案内する不具合や修正は、公式のお知らせもあわせて確認してください。',
    ],
    faqs: [
      {
        question: 'Windows 10で遊べますか？',
        answer:
          'Steamストアの動作環境は、最低・推奨ともWindows 11と記載されています。',
      },
      {
        question: '体験版はどこまで遊べますか？',
        answer:
          '製品版と同じ「第一章」の範囲を遊べます。一部のレベルに制限があり、セーブデータは製品版に引き継げます（公式）。',
      },
      {
        question: 'ノートPCでも動きますか？',
        answer:
          '最低環境はGTX 1650・RX 6400・Arc A580相当のGPU、メモリ8GB、Windows 11です。推奨環境（1080p・60fps・最高設定）もGTX 1650・RX 5500 XT・Arc A580と比較的軽めです。体験版で確かめるのが確実です。',
      },
    ],
    sources: [
      {
        label:
          'Steamストア：ファイナルファンタジー レゾナンス（動作環境・特典の受け取り方）',
        url: 'https://store.steampowered.com/app/3259780/',
      },
      {
        label: 'Steamストア：第一章まるごと先行体験版（セーブ引き継ぎ）',
        url: 'https://store.steampowered.com/app/4474710/',
      },
      {
        label: 'Steamニュース（公式）：体験版の配信',
        url: 'https://store.steampowered.com/news/app/3259780',
      },
    ],
    related: [],
    metaDescription:
      'FFレゾナンス PC版が起動しない・特典が受け取れない時の対処法。Windows 11の動作環境、体験版セーブの製品版への引き継ぎ、Steamクラウド、予約特典・早期購入特典の受け取り場所（ミトラの町の宿屋前のポスト）、魔導船の見た目の切り替えまで解説。',
  }),
];
