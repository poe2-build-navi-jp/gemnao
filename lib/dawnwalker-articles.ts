import type { GameArticle } from '@/lib/game-articles';

// The Blood of Dawnwalker（PC版）の個別記事。
// 2026-09-27に開発元Rebel Wolvesの公式告知（既知の問題・Hotfix 1.0.2〜1.0.5）、
// Steamストア、PCGamingWiki、開発元が案内するRAD Game Toolsの解説で確認した内容だけを載せています。
// STEPのidは解決報告（D1）の集計キーなので、既存のidは変更しないでください。
const sources = {
  knownIssues: {
    label: 'Rebel Wolves公式：既知の問題と回避策（2026-09-03）',
    url: 'https://www.reddit.com/r/DawnwalkerOfficial/comments/1w615p8/known_issues_fixes_workarounds_03092026/',
  },
  hotfix102: {
    label: '公式：Hotfix 1.0.2',
    url: 'https://dawnwalkergame.com/us/en/news/hotfix-102',
  },
  hotfix103: {
    label: 'Rebel Wolves公式：Hotfix 1.0.3（DualSense対応）',
    url: 'https://www.reddit.com/r/DawnwalkerOfficial/comments/1w7fcbx/hotfix_103/',
  },
  hotfix104: {
    label: '公式：Hotfix 1.0.4',
    url: 'https://dawnwalkergame.com/us/en/news/hotfix-104',
  },
  hotfix105: {
    label: 'Rebel Wolves公式：Hotfix 1.0.5（シェーダーコンパイルの改善）',
    url: 'https://www.reddit.com/r/DawnwalkerOfficial/comments/1wcu57e/hotfix_105/',
  },
  intel: {
    label: 'Intel：第13・14世代デスクトップCPUの不安定性と対象外のモバイルCPU',
    url: 'https://community.intel.com/t5/Mobile-and-Desktop-Processors/Intel-Core-13th-and-14th-Gen-Desktop-Instability-Root-Cause/td-p/1633442',
  },
  rad: {
    label: 'RAD Game Tools：Intel第13・14世代CPUの不安定性とクラッシュ（英語）',
    url: 'https://www.radgametools.com/oodleintel.htm',
  },
  steam: {
    label: 'Steamストア：The Blood of Dawnwalker（動作環境）',
    url: 'https://store.steampowered.com/app/3751260/',
  },
  pcgw: {
    label: 'PCGamingWiki：The Blood of Dawnwalker（画面設定・保存場所）',
    url: 'https://www.pcgamingwiki.com/wiki/The_Blood_of_Dawnwalker',
  },
};

type Draft = Omit<
  GameArticle,
  | 'gameSlug'
  | 'checkedAt'
  | 'symptoms'
  | 'seoTitle'
  | 'status'
  | 'targetVersion'
> & { seoTitle?: string };

const make = (draft: Draft): GameArticle => ({
  gameSlug: 'the-blood-of-dawnwalker',
  checkedAt: '2026-09-27',
  status: 'verified',
  targetVersion: 'PC版 Hotfix 1.0.5（2026年9月27日時点の最新）',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const latestPatchFact = {
  label: '最新のホットフィックス',
  value: '1.0.5（2026年9月10日・シェーダーコンパイル処理の改善）',
};

const updateGameStep = {
  title: 'ゲームを最新版（1.0.5以降）にする',
  time: '5〜15分',
  risk: 'low' as const,
};

export const dawnwalkerArticles: GameArticle[] = [
  make({
    slug: 'shader-compilation-crash',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'Dawnwalkerがシェーダーのコンパイル中に落ちる時の対処【PC版】',
    category: 'launch',
    title:
      'The Blood of Dawnwalkerがシェーダーのコンパイル中にクラッシュする原因と対処法【PC版】',
    shortTitle: 'シェーダーコンパイルでクラッシュ',
    symptom:
      '起動時の「シェーダーのコンパイル」中にゲームが落ちる、エラーが出て先へ進めない場合の確認手順です。',
    conclusion:
      '開発元のRebel Wolvesは、この既知の問題の対処として「BIOSを最新にする」ことを案内しています。案内先のRAD Game Toolsの解説によると、Intel第13・14世代デスクトップCoreの一部モデルの不安定性が原因で、Unreal Engine製のゲームがシェーダーの展開に失敗して落ちることがあります。まずCPUの正確な型番とメーカーの対象案内を確認し、該当する場合はPCメーカーまたはマザーボードメーカーのBIOSを最新にします。',
    description:
      'この症状は「ゲームの不具合」ではなく「CPU側の問題」が原因の場合があります。CPUの型番で原因の候補が大きく変わるため、最初にCPUを確認するのが近道です。',
    causes: [
      'Intel第13・14世代デスクトップCoreの一部モデルの不安定性（RAD Game Toolsの解説）',
      'BIOSが古く、不安定性を防ぐ対策が入っていない',
      'ゲームが古いバージョンのまま（1.0.4で安定性、1.0.5でシェーダーコンパイル処理を改善）',
    ],
    quickFacts: [
      { label: '開発元の対処', value: 'BIOSを最新にする（Rebel Wolves公式）' },
      {
        label: '対象になりやすいCPU',
        value: 'Intel第13・14世代デスクトップCoreの対象モデル（モバイルCPUは対象外）',
      },
      {
        label: 'よく出るエラー',
        value:
          'DecompressShader(): Could not decompress shader (GetShaderCompressionFormat=Oodle)',
        copy: true,
      },
      latestPatchFact,
    ],
    diagnosis: [
      {
        symptom: 'シェーダーのコンパイル中に落ちる',
        cause: 'CPUの種類で原因が変わる',
        stepId: 'step-1',
      },
      {
        symptom: 'CPUがIntel第13・14世代デスクトップの対象モデル',
        cause: 'CPUの不安定性・古いBIOS',
        stepId: 'step-2',
      },
      {
        symptom: 'CPUがAMD・モバイルCPU・それ以外',
        cause: 'ゲームのバージョン・ファイル・ドライバー',
        stepId: 'step-4',
      },
      {
        symptom: '対象のIntelデスクトップCPUで「ビデオメモリ不足」と出る',
        cause: 'CPU側の不安定性でも表示されることがある',
        stepId: 'step-2',
      },
      {
        symptom: 'BIOSを更新しても落ちる',
        cause: 'CPUの劣化が進んでいる可能性',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '落ちる場面とCPUの型番を確認する',
        summary: 'CPUの正確な型番を確認します。対象のデスクトップモデル以外（モバイルCPU・AMDを含む）は、この不安定性を理由にBIOSを更新せずSTEP 4へ進んでください。',
        time: '約3分',
        risk: 'low',
        actions: [
          '起動時の「シェーダーのコンパイル」中に落ちるか、プレイ中に落ちるかを記録する',
          'エラーが表示されたら全文を控える（「DecompressShader」を含むか確認する）',
          'Windows＋Rキーで「msinfo32」を実行し、「プロセッサ」でCPUの型番を確認する（例：Core i7-13700K、Core i9-14900K）',
        ],
      },
      {
        id: 'step-2',
        title: 'BIOSのバージョンを確認し、最新にする',
        summary:
          'メーカーが対象と案内するIntel第13・14世代デスクトップモデルだけ確認します。BIOS更新は劣化を防ぐ対策で、すでに生じた劣化を修復するものではありません。',
        time: '20〜40分',
        risk: 'high',
        actions: [
          '「msinfo32」の「BIOSバージョン/日付」と「ベースボード製品」（マザーボードの型番）を控える',
          'メーカー製PCはPCメーカー、自作PCはマザーボードメーカーのサポートページで、同じ型番の最新BIOSと比べる',
          '新しいBIOSがあれば、そのメーカーの手順どおりに更新する',
        ],
        note: 'BIOSの更新中に電源が切れるとPCが起動しなくなるおそれがあります。手順が分からない場合はメーカーのサポートに相談してください。',
      },
      {
        id: 'step-3',
        title: '更新後にシェーダーのコンパイルを最後まで待つ',
        summary:
          'BIOSを更新したら、ゲームを起動してコンパイルが終わるまで待ちます。',
        time: '数分〜',
        risk: 'low',
        actions: [
          'PCを再起動してからゲームを起動する',
          'シェーダーのコンパイルが終わるまで、ほかの重いアプリを動かさずに待つ',
          '再び落ちる場合は、何度も続けて起動し直さず、STEP 5へ進む',
        ],
      },
      {
        id: 'step-4',
        ...updateGameStep,
        summary:
          'Hotfix 1.0.4で安定性が改善され、1.0.5ではシェーダーコンパイル処理が改善されています。',
        actions: [
          'SteamまたはGOG Galaxyでゲームの更新を確認し、最新版を適用する',
          'Steamはライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を行う',
          'GPUドライバーを各社公式サイトの最新版にして、PCを再起動する',
        ],
      },
      {
        id: 'step-5',
        title: 'BIOS更新後も落ちる場合はメーカーに相談する',
        summary:
          'RAD Game Toolsによると、不安定性はチップの物理的な劣化で、一度起きると元に戻らず交換が必要な場合があります。',
        time: '—',
        risk: 'low',
        actions: [
          '他のゲームや重いアプリ（動画編集・ベンチマークなど）でも落ちるか確認する',
          'PCメーカー、またはCPUを購入した販売店・Intelのサポートに、CPUの型番と症状を伝えて相談する',
          'ゲーム側の問題の可能性もあるため、エラー全文とCPU型番を添えて開発元の公式サポートにも報告する',
        ],
      },
    ],
    avoid: [
      '別の型番用のBIOSを入れない',
      'BIOSの更新中に電源を切らない・PCを操作しない',
      'CPUのオーバークロックや電圧の設定を、内容を理解しないまま変更しない',
    ],
    cautions: [
      'BIOSの更新はPCやマザーボードの保証・サポートの条件に従って行ってください。',
    ],
    faqs: [
      {
        question: 'AMDのCPUでも同じ対処でいいですか？',
        answer:
          'Intelが説明するこの不安定性は第13・14世代デスクトップCPUの問題で、同世代のモバイルCPUは対象外です。AMDやモバイルCPUなどの場合は、STEP 4のゲーム更新・整合性確認・ドライバー更新を行い、改善しなければエラー全文を添えて開発元のサポートへ報告してください。',
      },
      {
        question: '他のゲームやソフトでも落ちます。',
        answer:
          'RAD Game Toolsによると、この不安定性はUnreal Engine製のゲームだけでなく、動画編集ソフトやベンチマークなどCPUを多く使うソフトでもクラッシュを起こします。複数のソフトで落ちることだけではCPUが原因と断定できません。調査の手掛かりとして症状を控え、STEP 5のとおりメーカーへ相談してください。',
      },
      {
        question: 'BIOSを更新すれば必ず直りますか？',
        answer:
          'BIOSの更新は、劣化を引き起こす動作条件を避けるためのものです。RAD Game Toolsは、症状がすでに出ている場合はソフトウェアでは直せず、CPUの交換が必要な場合があると説明しています。早めの更新が大切です。',
      },
    ],
    sources: [
      sources.knownIssues,
      sources.hotfix102,
      sources.rad,
      sources.intel,
      sources.hotfix104,
      sources.hotfix105,
    ],
    related: ['stutter-windowed', 'controller-sprint'],
    metaDescription:
      'The Blood of Dawnwalker PC版がシェーダーのコンパイル中に落ちる原因と対処法。開発元が案内するBIOS更新、Intel第13・14世代CPUの不安定性、エラー「DecompressShader」、最新Hotfix 1.0.5まで解説。',
  }),
  make({
    slug: 'stutter-windowed',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'Dawnwalkerがカクつく時の対処法｜フルスクリーン設定【PC版】',
    category: 'display',
    title:
      'The Blood of Dawnwalkerがカクつく・スタッターする時の対処法｜フルスクリーン設定【PC版】',
    shortTitle: 'カクつき・スタッター',
    symptom:
      'ウィンドウ・ボーダーレス表示でカクつく、初めての場所で一瞬止まる、コントローラーをつなぐとFPSが落ちる場合の確認手順です。',
    conclusion:
      '開発元はウィンドウ・ボーダーレス表示でのカクつきを既知の問題とし、回避策として「フルスクリーンで起動する」ことを案内しています。あわせて、シェーダーコンパイル処理を改善したHotfix 1.0.5以降へ更新します。',
    description:
      'カクつきの原因は1つではありません。表示モード、シェーダー、コントローラー、フレーム生成を1つずつ切り分けると、自分に当てはまる対処が見つかります。',
    causes: [
      'ウィンドウ・ボーダーレス表示の既知の問題',
      'シェーダーの生成（1.0.5で処理を改善）',
      'Steam版で古いGameInputのままコントローラーを接続している（1.0.4で修正）',
      '「実験的」と表示されているフレーム生成',
    ],
    quickFacts: [
      {
        label: '公式の回避策',
        value: 'フルスクリーンで起動する（ウィンドウ・ボーダーレスで発生）',
      },
      latestPatchFact,
      {
        label: 'ムービーのフレームレート',
        value: 'ゲーム内のムービーは30fpsに固定（PCGamingWiki）',
      },
      {
        label: 'フレームレート上限',
        value:
          '30〜モニターの最大リフレッシュレートまで設定可能（PCGamingWiki）',
      },
    ],
    diagnosis: [
      {
        symptom: 'ウィンドウ・ボーダーレスでカクつく',
        cause: '既知の問題',
        stepId: 'step-2',
      },
      {
        symptom: '初めての場所で一瞬止まる',
        cause: 'シェーダーの生成',
        stepId: 'step-4',
      },
      {
        symptom: 'Steam版でコントローラーをつなぐとFPSが落ちる',
        cause: '古いGameInput（1.0.4で修正）',
        stepId: 'step-4',
      },
      {
        symptom: 'フレーム生成を使うとカクつく・不安定',
        cause: '実験的な機能',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '今の表示モードとカクつく場面を記録する',
        summary: '変更前の状態を控えておくと、効果を比べられます。',
        time: '約3分',
        risk: 'low',
        actions: [
          'ゲームの画面設定を開き、表示モード・解像度・フレームレート上限をスクリーンショットで控える',
          '同じ場所を移動し、カクつくタイミングを確認する',
        ],
      },
      {
        id: 'step-2',
        title: '表示モードをフルスクリーンにする',
        summary: '開発元が案内している回避策です。',
        time: '約1分',
        risk: 'low',
        actions: [
          '表示モードだけを「フルスクリーン」に変更して適用する',
          '解像度や画質は変えずに、同じ場所で確認する',
        ],
      },
      {
        id: 'step-3',
        title: '同じ場面で比べる',
        summary: '変更前と同じ経路で、引っかかりの回数を比べます。',
        time: '約5分',
        risk: 'low',
        actions: [
          '変更前と同じ経路を同じ時間だけ移動し、引っかかりの回数を比べる',
          '改善しなければ元の表示モードに戻す',
        ],
      },
      {
        id: 'step-4',
        ...updateGameStep,
        summary:
          '1.0.5でシェーダーコンパイル処理が改善され、一部の人のカクつきが直る可能性があると告知されています。',
        actions: [
          'SteamまたはGOG Galaxyでゲームの更新を確認し、1.0.5以降にする',
          'Steam版で古いGameInputを使用中にコントローラーをつなぐとFPSが落ちる問題は、1.0.4で修正済み',
          'GPUドライバーを最新にして、PCを再起動してから比べる',
        ],
      },
      {
        id: 'step-5',
        title: 'フレーム生成を切り、フレームレート上限を決める',
        summary:
          'フレーム生成はゲーム内で「Experimental（実験的）」と表示されています（PCGamingWiki）。',
        time: '約3分',
        risk: 'low',
        actions: [
          'DLSS・FSRのフレーム生成をオフにして、同じ場所で比べる',
          'フレームレート上限を、普段出ている値より少し低い値にする',
          '変化がなければ元の設定に戻す',
        ],
        note: 'FSRのフレーム生成を使った時の垂直同期の問題は、1.0.4で修正されています。',
      },
    ],
    avoid: [
      '表示モードと画質を同時に変えない。1つずつ変えて比べる',
      'ムービーだけ30fpsになるのを不具合と思い込まない（仕様）',
    ],
    cautions: [
      '開発元はPC版のパフォーマンス改善を続けています。最新の告知も確認してください。',
    ],
    faqs: [
      {
        question: 'ムービー（カットシーン）だけカクカクします。',
        answer:
          'PCGamingWikiによると、ゲーム内のムービーは30fpsに固定されています。ゲームプレイ中のカクつきとは別の仕様です。',
      },
      {
        question: 'フルスクリーンにすると他のウィンドウに切り替えにくいです。',
        answer:
          '回避策としてフルスクリーンが案内されている状態です。1.0.5以降に更新した後、ボーダーレス表示でもカクつきが出ないか改めて比べ、問題がなければ使いやすい方を選んでください。',
      },
      {
        question: '今後のアップデートで直りますか？',
        answer:
          '開発元はHotfix 1.0.2の告知で、ウィンドウ・ボーダーレス表示のカクつきを「調査中の既知の問題」としています。2026年9月27日時点の最新は1.0.5です。',
      },
    ],
    sources: [
      sources.knownIssues,
      sources.hotfix102,
      sources.hotfix104,
      sources.hotfix105,
      sources.pcgw,
    ],
    related: ['shader-compilation-crash', 'controller-sprint'],
    metaDescription:
      'The Blood of Dawnwalker PC版がカクつく時の対処法。開発元が案内するフルスクリーンでの回避策、シェーダー処理を改善したHotfix 1.0.5、コントローラー接続時のFPS低下、フレーム生成の見直しを解説。',
  }),
  make({
    slug: 'controller-sprint',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: 'Dawnwalkerでコントローラーの走りが止まる時の対処【PC版】',
    category: 'controller',
    title:
      'The Blood of Dawnwalkerでコントローラーの走りが止まる・PS5コントローラーの対処【PC版】',
    shortTitle: 'コントローラーで走りが止まる',
    symptom:
      '方向を変えると走りが止まる、PS5コントローラー（DualSense）が使えない・ボタン割り当てを変えられない場合の確認手順です。',
    conclusion:
      '走りが止まる問題は、PC版でHotfix 1.0.2と1.0.4でデッドゾーンと走行入力が調整されています。まず最新版へ更新し、それでも止まる場合は入力設定を確認し、改善しなければ開発元へ報告します。公式投稿の感度0.8はコンソール設定の案内で、PC版に同じ手順が使えるとは確認できていません。DualSenseはHotfix 1.0.3でSteam版に対応しました。',
    description:
      'コントローラーの症状は、ゲームのバージョンによって状況が大きく違います。まず今のバージョンを確認するのが近道です。',
    causes: [
      'デッドゾーン・走行入力の調整（1.0.2・1.0.4）が適用されていない',
      '複数のコントローラーや入力変換ツールの競合',
      'PS5コントローラーのボタン割り当て機能が未対応（既知の問題）',
    ],
    quickFacts: [
      { label: '走りが止まる問題', value: '1.0.2と1.0.4で調整（PC版）' },
      {
        label: '公式の回避策',
        value: '感度0.8はコンソール設定の案内。PC版への適用は未確認',
      },
      {
        label: 'DualSense（PS5コントローラー）',
        value: 'Hotfix 1.0.3でSteam版に対応',
      },
      {
        label: 'ボタン割り当て',
        value: '「標準」と「代替」のプリセットのみ（PCGamingWiki）',
      },
    ],
    diagnosis: [
      {
        symptom: '方向を変えると走りが止まる',
        cause: '古いバージョン、デッドゾーン',
        stepId: 'step-2',
      },
      {
        symptom: '最新版でも走りが止まる',
        cause: '入力設定の確認・公式サポートへの報告',
        stepId: 'step-4',
      },
      {
        symptom: 'PS5コントローラーが使えない',
        cause: '1.0.3より前のバージョン',
        stepId: 'step-3',
      },
      {
        symptom: 'ボタン配置を自由に変えたい',
        cause: 'プリセットのみ対応（既知の問題）',
        stepId: 'step-3',
      },
      {
        symptom: '入力が二重になる・勝手に切り替わる',
        cause: '複数の入力機器・変換ツール',
        stepId: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'コントローラーを1台だけ接続する',
        summary: '入力機器が複数あると、どれが原因か分からなくなります。',
        time: '約2分',
        risk: 'low',
        actions: [
          '使わないコントローラーを外し、いつもの1台だけにする',
          'DS4Windowsなどの入力変換ツールを使っている場合は終了する',
          '方向を変えた時に走りが止まるか、同じ場所で確認する',
        ],
      },
      {
        id: 'step-2',
        title: 'ゲームを最新版に更新する',
        summary:
          'PC版では1.0.2と1.0.4で、コントローラーのデッドゾーンと走行入力が調整されています。',
        time: '5〜15分',
        risk: 'low',
        actions: [
          'SteamまたはGOG Galaxyでゲームの更新を確認し、最新版（2026年9月27日時点は1.0.5）を適用する',
          'Steam版で古いGameInputのままコントローラーをつなぐとFPSが落ちる問題も、1.0.4で修正されている',
          '同じコントローラー・同じ場所で方向を変え、症状を比べる',
        ],
      },
      {
        id: 'step-3',
        title: 'PS5コントローラーは対応状況を確認する',
        summary:
          'DualSenseはHotfix 1.0.3でSteam版に対応しました。ボタン割り当ての変更は既知の問題として案内されています。',
        time: '約3分',
        risk: 'low',
        actions: [
          'ゲームが1.0.3以降になっているか確認する',
          'ボタン配置は、コントローラー設定の「標準」と「代替」のプリセットから選ぶ',
          '自由な割り当ては既知の問題として対応中。今後の公式告知を確認する',
        ],
      },
      {
        id: 'step-4',
        title: '入力設定を確認し、改善しなければ報告する',
        summary: '公式投稿の感度1→0.8はコンソール設定の案内です。PC版では同じ項目や効果を確認できていないため、一律には変更しません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲーム内に入力設定がある場合だけ開き、今の設定とコントローラーの型番を控える',
          '変更を試す場合は、表示されている設定だけを1つずつ比べる。該当項目がなければ飛ばす',
          '変化がなければ元の値に戻す',
        ],
        note: '改善しない場合はゲームのバージョン、入力設定、コントローラーの型番と症状を開発元へ報告してください。',
      },
    ],
    avoid: [
      '入力変換ツールとSteam Inputを同時に使わない（入力が二重になることがある）',
      '複数の設定を同時に変えない',
    ],
    cautions: [
      'コントローラー関連の修正は、今後のアップデートで変わる可能性があります。最新の公式告知も確認してください。',
    ],
    faqs: [
      {
        question: 'ボタン配置を自由に変更できますか？',
        answer:
          'PCGamingWikiによると、コントローラーの割り当ては「標準」と「代替」のプリセットのみです。PS5コントローラーのボタン割り当てがない問題は、開発元が既知の問題として対応中と案内しています。',
      },
      {
        question: 'DualSenseの振動は使えますか？',
        answer:
          'PCGamingWikiによると、DualSenseは通常の振動に対応しています（HD振動としての対応ではありません）。',
      },
      {
        question: '最新版でも走りが止まります。',
        answer:
          '公式投稿の感度0.8はコンソール設定の案内で、PC版での適用は未確認です。最新版に更新したうえで改善しない場合は、ゲームのバージョンとコントローラーの種類を添えて開発元へ報告してください。',
      },
    ],
    sources: [
      sources.knownIssues,
      sources.hotfix102,
      sources.hotfix103,
      sources.hotfix104,
      sources.pcgw,
    ],
    related: ['stutter-windowed', 'shader-compilation-crash'],
    metaDescription:
      'The Blood of Dawnwalker PC版でコントローラーの走りが止まる時の対処法。Hotfix 1.0.2・1.0.4の調整、入力設定の確認と公式サポートへの報告、1.0.3で対応したDualSense、ボタン割り当ての現状を解説。',
  }),
];
