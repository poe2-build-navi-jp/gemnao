import type { GameArticle } from '@/lib/game-articles';

// 2026年10月中旬〜12月に発売される新作の個別記事。発売の数週間前に公開して、
// 発売日までに検索に載るようにしています。Steamストア・公式のお知らせで
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
const driverUpdate =
  'NVIDIAはNVIDIA App、AMDはAMD Software: Adrenalin Edition、IntelはIntelの公式サイトから最新のドライバーに更新し、PCを再起動する';
const winver =
  'Windows + R →「winver」と入力してEnterを押し、表示されたWindowsのバージョンを確認する';

export const upcomingReleaseArticles: GameArticle[] = [
  make({
    gameSlug: 'castlevania-belmonts-curse',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-03',
    seoTitle:
      'Castlevania: Belmont’s Curse（悪魔城）が起動しない時の対処法【PC版】',
    title:
      'Castlevania: Belmont’s Curse（キャッスルヴァニア ベルモンドの呪い）が起動しない・コントローラーが効かない時の対処法【PC版】',
    shortTitle: '起動しない・コントローラー',
    targetVersion: 'Steam版・2026年10月3日時点の公式情報（発売前）',
    symptom:
      'PC版が起動しない、起動直後に落ちる、コントローラーが反応しない、Midnight Editionのアートギャラリーや特典が見当たらない場合の確認手順です。',
    conclusion:
      'Steamストアの動作環境は、最低・推奨ともWindows 11です。GPUの最低環境はGTX 1650、DirectXは11で、要件は比較的軽めです。起動しない時は、まずWindowsのバージョンとGPUドライバーを確認します。Midnight Editionの「デジタルサウンド＆アートギャラリー」は本編とは別のアプリケーションです。',
    description:
      'KONAMIの発表では2026年10月15日発売です（Steamストアの日本語表示は10月14日）。KONAMI・Evil Empire・Motion Twinが手がける探索型2Dアクションで、日本語は字幕と音声の両方に対応しています。',
    causes: [
      'Windows 11ではない（最低環境からWindows 11）',
      'GPUドライバーが古い・ゲームファイルの破損',
      'オーバーレイや録画ツールの干渉',
      'Steam Inputの設定とコントローラーの相性',
      'アートギャラリーを本編の中で探している（別アプリ）',
    ],
    quickFacts: [
      {
        label: '最低動作環境',
        value:
          'Windows 11／Core i5 8400／GTX 1650／メモリ16GB／DirectX 11／10GB',
      },
      {
        label: '推奨動作環境',
        value: 'Windows 11／Core i5 10400／RTX 3060／メモリ16GB',
      },
      {
        label: '発売日',
        value: '2026年10月15日（KONAMIの発表）',
      },
      {
        label: 'コントローラー',
        value:
          'フルコントローラーサポート・ゲームパッド推奨。DualSense対応、キーボードだけでも遊べる（Steamストアの表記）',
      },
      {
        label: 'Midnight Edition',
        value:
          '本編＋デジタルサウンド＆アートギャラリー（別アプリ）＋ゲーム内アイテム3種',
      },
    ],
    diagnosis: [
      {
        symptom: 'Windows 10のPCで起動しない',
        cause: '動作環境を満たしていない',
        stepId: 'step-1',
      },
      {
        symptom: '起動直後に落ちる・黒い画面のまま',
        cause: 'ドライバー・ファイル・常駐ツール',
        stepId: 'step-2',
      },
      {
        symptom: 'コントローラーが反応しない・ボタンがずれる',
        cause: 'Steam Inputの設定',
        stepId: 'step-3',
      },
      {
        symptom: 'アートギャラリーがゲーム内に見当たらない',
        cause: '本編とは別のアプリケーション',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Windows 11と動作環境を確認する',
        summary:
          'Steamストアの動作環境は、最低・推奨ともWindows 11と記載されています。',
        time: '約3分',
        risk: 'low',
        actions: [
          winver,
          'タスクマネージャー（Ctrl + Shift + Esc）の「パフォーマンス」→「GPU」で、GTX 1650以上か確認する',
          'メモリ16GB以上、空き容量10GB以上が必要',
        ],
      },
      {
        id: 'step-2',
        title: 'GPUドライバーを更新し、ゲームファイルを確認する',
        summary: '起動直後に落ちる・黒い画面のまま進まない場合に確認します。',
        time: '約15分',
        risk: 'low',
        actions: [
          driverUpdate,
          steamVerify,
          'Discord・Steamのオーバーレイ、録画・FPS表示ツールをオフにして起動を比べる',
        ],
      },
      {
        id: 'step-3',
        title: 'コントローラーはSteam InputのON・OFFを比べる',
        summary:
          '本作はフルコントローラーサポートで、DualSenseにも対応しています（Steamストアの表記）。反応しない時は、Steam側の変換が原因のことがあります。',
        time: '約5分',
        risk: 'low',
        actions: [
          'コントローラーをUSBの有線で1台だけつなぐ',
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「コントローラー」で、Steam Inputの設定を切り替えて比べる',
          '他のコントローラー変換ツールを使っている場合は終了してから起動する',
        ],
        note: 'Steam Inputの切り替え方は「Steam Inputでコントローラーが反応しない時の設定」で詳しく解説しています。',
      },
      {
        id: 'step-4',
        title: 'アートギャラリーと特典の場所を確認する',
        summary:
          'Midnight Editionの「デジタルサウンド＆アートギャラリー」は、本編とは別のアプリケーションです（Steamストアの記載）。100枚以上のアートワークと、ゲーム内の楽曲を聴けるサウンドプレイヤーが入っています。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steamのライブラリで、本編とは別にアートギャラリーが入っているか確認する',
          'Midnight Editionのゲーム内アイテムは、トレバースタイルコスチューム・サイファスタイルコスチューム・家族の肖像（魔導器）の3種',
          '予約特典はアルカードスタイルコスチューム（予約購入した場合だけ付く）',
        ],
        note: 'ゲーム内での特典の受け取り方は、発売時の公式の案内もあわせて確認してください。',
      },
    ],
    avoid: [
      '動作環境を満たしていないPCで、非公式の改造ツールを使って起動させようとしない',
      'Midnight Editionと単品の特典を重複して買わないよう、購入前に内容を確認する',
    ],
    cautions: [
      '発売前の情報です。発売後に公式が案内する不具合や修正は、公式のお知らせもあわせて確認してください。',
    ],
    faqs: [
      {
        question: 'Windows 10で遊べますか？',
        answer:
          'Steamストアの動作環境は、最低・推奨ともWindows 11と記載されています。',
      },
      {
        question: '日本語の音声はありますか？',
        answer:
          'Steamストアの対応言語では、日本語はインターフェース・字幕に加えて音声にも対応しています。',
      },
      {
        question: 'GTX 1660のPCで動きますか？',
        answer:
          '最低環境のGPUはGTX 1650で、GTX 1660はそれより上です。推奨環境はRTX 3060です。OSがWindows 11であることも確認してください。',
      },
    ],
    sources: [
      {
        label:
          'Steamストア：Castlevania: Belmont’s Curse（動作環境・対応言語・Midnight Edition）',
        url: 'https://store.steampowered.com/app/4231820/',
      },
      {
        label: 'Steamニュース（公式）：10月15日発売の発表',
        url: 'https://store.steampowered.com/news/app/4231820',
      },
    ],
    related: [],
    metaDescription:
      'Castlevania: Belmont’s Curse PC版が起動しない・コントローラーが効かない時の対処法。Windows 11の動作環境（GTX 1650・メモリ16GB）、ドライバーとファイルの確認、Steam Inputの切り替え、Midnight Editionのアートギャラリー（別アプリ）と特典の内容まで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'tales-of-eternia-remastered',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-03',
    seoTitle:
      'テイルズ オブ エターニア リマスターが起動しない時の対処法【PC版】',
    title:
      'テイルズ オブ エターニア リマスターが起動しない・画面がおかしい時の対処法【PC版・Steam】',
    shortTitle: '起動しない・表示の確認',
    targetVersion: 'Steam版・2026年10月3日時点の公式情報（発売前）',
    symptom:
      'PC版が起動しない、起動直後に落ちる、DirectX 12で起動できない、コントローラーが反応しない、デラックスエディションの特典が見当たらない場合の確認手順です。',
    conclusion:
      '要件はとても軽く、GPUはGTX 650 Ti（1GB）から動作します。ただしSteamストアの動作環境はWindows 11と記載されており、DirectX 12を使うにはWindows 10（バージョン1809以降）とVRAM 4GB以上のGPUが必須と注記されています。起動しない時は、Windowsのバージョン、GPUのVRAM、ドライバーの順に確認します。',
    description:
      '発売は日本時間2026年10月16日7時です（公式の太平洋時間10月15日15時を換算）。2005年に発売された版をもとにしたリマスターで、目的地の表示、エンカウントのOFF、オート戦闘の高速モードなどの便利機能が追加されています。',
    causes: [
      'Windowsのバージョンが要件を満たしていない',
      'GPUのVRAMが4GB未満でDirectX 12が使えない',
      'GPUドライバーが古い・ゲームファイルの破損',
      'オーバーレイや録画ツールの干渉',
      'Steam Inputの設定とコントローラーの相性',
    ],
    quickFacts: [
      {
        label: '動作環境（最低・推奨とも）',
        value:
          'Windows 11／Core i3-8100・Ryzen 3 3100／GTX 650 Ti（1GB）・HD 7770（2GB）・Arc A310（4GB）／メモリ4GB／8GB',
      },
      {
        label: 'DirectX 12の条件',
        value:
          'Windows 10（1809以降）とVRAM 4GB以上のGPUが必須（Steamストアの注記）',
      },
      {
        label: '発売日時',
        value: '日本時間 2026年10月16日 7:00',
      },
      {
        label: 'セーブ',
        value: 'Steamクラウド対応（Steamストアの表記）',
      },
      {
        label: 'デラックスエディション',
        value:
          'デジタルアートブック・サウンドトラック（109曲）・戦闘BGMパック・成長サポートアイテムセット',
      },
    ],
    diagnosis: [
      {
        symptom: '古いWindowsのPCで起動しない',
        cause: 'OSのバージョン',
        stepId: 'step-1',
      },
      {
        symptom: 'DirectX 12のエラーが出る・古いGPUで起動しない',
        cause: 'VRAM 4GB未満',
        stepId: 'step-2',
      },
      {
        symptom: '起動直後に落ちる・黒い画面のまま',
        cause: 'ドライバー・ファイル・常駐ツール',
        stepId: 'step-3',
      },
      {
        symptom: 'コントローラーが反応しない',
        cause: 'Steam Inputの設定',
        stepId: 'step-4',
      },
      {
        symptom: '戦闘曲が変わらない・成長アイテムがない',
        cause: 'デラックスエディションの内容',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Windowsのバージョンを確認する',
        summary:
          'Steamストアの動作環境は、最低・推奨ともWindows 11と記載されています。',
        time: '約3分',
        risk: 'low',
        actions: [
          winver,
          'Windows 10の場合、注記にある「バージョン1809以降」かどうかも確認する',
        ],
      },
      {
        id: 'step-2',
        title: 'GPUのVRAMが4GB以上か確認する',
        summary:
          'Steamストアには、DirectX 12を有効にするにはVRAM 4GB以上のGPUが必須と注記されています。最低環境のGTX 650 Ti（1GB）・HD 7770（2GB）は4GB未満です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'タスクマネージャー（Ctrl + Shift + Esc）の「パフォーマンス」→「GPU」で、「専用GPUメモリ」の容量を確認する',
          'DirectX 12のエラーが出て、専用GPUメモリが4GB未満なら、GPUの条件が原因の可能性が高い',
        ],
        note: 'VRAM 4GB未満のGPUで、DirectX 12以外の方法で起動できるかどうかは、Steamストアに記載がありません。発売時の公式の案内を確認してください。',
      },
      {
        id: 'step-3',
        title: 'GPUドライバーを更新し、ゲームファイルを確認する',
        summary: '起動直後に落ちる・黒い画面のまま進まない場合に確認します。',
        time: '約15分',
        risk: 'low',
        actions: [
          driverUpdate,
          steamVerify,
          'Discord・Steamのオーバーレイ、録画・FPS表示ツールをオフにして起動を比べる',
        ],
      },
      {
        id: 'step-4',
        title: 'コントローラーはSteam InputのON・OFFを比べる',
        summary:
          '本作はフルコントローラーサポートで、DUALSHOCK・DualSenseにも対応しています（Steamストアの表記）。',
        time: '約5分',
        risk: 'low',
        actions: [
          'コントローラーをUSBの有線で1台だけつなぐ',
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「コントローラー」で、Steam Inputの設定を切り替えて比べる',
        ],
        note: 'Steam Inputの切り替え方は「Steam Inputでコントローラーが反応しない時の設定」で詳しく解説しています。',
      },
      {
        id: 'step-5',
        title: 'デラックスエディションの内容を確認する',
        summary:
          'デラックスエディションには、デジタルアートブック、109曲のデジタルサウンドトラック、通常の戦闘曲をシリーズ過去作の曲に差し替えられる「戦闘BGMパック」、キャラクターの能力を上げる「スーパー成長サポートアイテムセット」が含まれます（公式）。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steamのストアページの「DLC」欄やライブラリで、デラックスエディションの追加コンテンツがインストールされているか確認する',
          '通常版を買った場合、デラックスエディションの内容は含まれない',
        ],
        note: 'ゲーム内での受け取り方や戦闘BGMの切り替え方は、発売時の公式の案内もあわせて確認してください。',
      },
    ],
    avoid: [
      '起動しないからといって、先にWindowsの再インストールをしない（まずOSとVRAMの条件を確認する）',
      '非公式のパッチや改造ツールで要件を回避しようとしない',
    ],
    cautions: [
      '発売前の情報です。発売後に公式が案内する不具合や修正は、公式のお知らせもあわせて確認してください。',
    ],
    faqs: [
      {
        question: '古いノートPCでも動きますか？',
        answer:
          '最低環境はGTX 650 Ti（1GB）・HD 7770（2GB）・Arc A310（4GB）、メモリ4GBと軽く、「低」設定で1080p・60fps、「高」設定でも同じ環境で1080p・60fpsとされています。ただしOSはWindows 11と記載されており、DirectX 12を使うにはVRAM 4GB以上のGPUが必要です。',
      },
      {
        question: 'オリジナル版の見た目で遊べますか？',
        answer:
          'グラフィックと効果音は、モード切り替えでオリジナル版の雰囲気に変えられます（公式）。',
      },
      {
        question: '戦闘のエンカウントをなくせますか？',
        answer:
          'リマスター版では、敵とのエンカウントをOFFにする機能が追加されています。ほかに目的地アイコンの表示や、オート戦闘時の高速モードもあります（公式）。',
      },
    ],
    sources: [
      {
        label:
          'Steamストア：テイルズ オブ エターニア リマスター（動作環境・DirectX 12の注記・対応機能）',
        url: 'https://store.steampowered.com/app/3470960/',
      },
      {
        label:
          'Steamニュース（公式）：10月16日発売の発表（発売時刻・デラックスエディション）',
        url: 'https://store.steampowered.com/news/app/3470960',
      },
    ],
    related: [],
    metaDescription:
      'テイルズ オブ エターニア リマスター PC版が起動しない時の対処法。Windows 11の動作環境、DirectX 12に必要なVRAM 4GB以上の条件、ドライバーとファイルの確認、コントローラー、デラックスエディションの内容まで公式情報をもとに解説。発売は日本時間10月16日7時。',
  }),
  make({
    gameSlug: 'phantom-blade-zero',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-03',
    seoTitle:
      'Phantom Blade Zero（影の刃零）が起動しない・重い時の対処法【PC版】',
    title:
      'Phantom Blade Zero（ファントムブレード ゼロ）が起動しない・重い時の対処法【PC版】',
    shortTitle: '起動しない・重い',
    targetVersion: 'Steam版・2026年10月3日時点の公式情報（発売前）',
    symptom:
      'PC版が起動しない、起動直後に落ちる、読み込みが長い、フレームレートが低い・カクつく場合の確認手順です。',
    conclusion:
      '最低環境からSSDへのインストールが必須です。最低環境（GTX 1660 6GB・RX 5500 XT 8GB）の目安は、アップスケーリングを使って1080p・30fpsです。重い時は、アップスケーリングをONにしてレイトレーシングを切るところから始めます。公式は、レイトレーシングなしでも見た目の迫力を保つよう調整したと説明しています。',
    description:
      'Steamストアの日本語表示では2026年10月28日発売です（公式の発表では10月29日。9月9日から延期）。DRMにDenuvoが使われています（Steamストアの表記）。日本語はインターフェース・字幕に対応し、音声は日本語に対応していません。',
    causes: [
      'HDDにインストールしている（SSD必須）',
      'GPUが最低環境（GTX 1660 6GB・RX 5500 XT 8GB）を下回る',
      'アップスケーリングがOFF・レイトレーシングがON',
      'GPUドライバーが古い・ゲームファイルの破損',
      'オーバーレイや録画ツールの干渉',
    ],
    quickFacts: [
      {
        label: '必須',
        value:
          'SSDへのインストール（最低環境から）／64bitのWindows 10・11／DirectX 12',
      },
      {
        label: '最低動作環境',
        value:
          'GTX 1660（6GB）・RX 5500 XT（8GB）／Core i7-8700K・Ryzen 5 3600／メモリ16GB（1080p・30fps、アップスケーリング使用）',
      },
      {
        label: '推奨動作環境',
        value:
          'RTX 3060 Ti（8GB）・RX 6700 XT（12GB）／Core i5-10600K・Ryzen 5 5600X／メモリ16GB（1440p・60fps、アップスケーリング使用）',
      },
      {
        label: 'レイトレーシング',
        value:
          '必須ではない。なしでも見た目を保つよう調整したと公式が説明（6月の公式レター）',
      },
      {
        label: '日本語',
        value:
          'インターフェース・字幕は対応。音声は非対応（Steamストアの表記）',
      },
    ],
    diagnosis: [
      {
        symptom: '読み込みが長い・途中で止まる',
        cause: 'HDDにインストールしている',
        stepId: 'step-1',
      },
      {
        symptom: '古いGPUで起動しない・極端に重い',
        cause: '最低環境を下回る',
        stepId: 'step-2',
      },
      {
        symptom: 'フレームレートが低い・カクつく',
        cause: 'アップスケーリング・レイトレーシングの設定',
        stepId: 'step-3',
      },
      {
        symptom: '起動直後に落ちる・黒い画面のまま',
        cause: 'ドライバー・ファイル・常駐ツール',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'SSDにインストールされているか確認する',
        summary:
          'Steamストアの動作環境には、最低・推奨とも「SSD installation required（SSDへのインストールが必須）」と書かれています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Steamの「設定」→「ストレージ」で、ゲームが入っているドライブを確認する',
          'タスクマネージャー（Ctrl + Shift + Esc）の「パフォーマンス」で、そのドライブの種類（SSD／HDD）を確認する',
          'HDDに入っている場合は、ストレージ画面でゲームを選び「移動」からSSDのドライブへ移す',
        ],
      },
      {
        id: 'step-2',
        title: 'GPUが最低環境を満たすか確認する',
        summary:
          '最低環境はGTX 1660（6GB）・RX 5500 XT（8GB）で、目安はアップスケーリング使用で1080p・30fpsです。',
        time: '約3分',
        risk: 'low',
        actions: [
          'タスクマネージャーの「パフォーマンス」→「GPU」で、GPUの名前と「専用GPUメモリ」を確認する',
          'メモリ（RAM）が16GB以上あるか確認する',
          'CPUは最低環境でCore i7-8700K・Ryzen 5 3600',
        ],
      },
      {
        id: 'step-3',
        title: 'アップスケーリングをONにし、レイトレーシングを切る',
        summary:
          '最低・推奨の目安はどちらもアップスケーリングを使った場合の数値です。レイトレーシングは見た目を上げる機能で、なくても遊べるよう調整されていると公式は説明しています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームのグラフィック設定でアップスケーリング（DLSS・FSRなど、表示される項目）をONにする',
          'レイトレーシングの項目があればOFFにして、フレームレートを比べる',
          '解像度を1080pにして、最低環境の目安（30fps）が出るか確かめる',
        ],
        note: '設定項目の名前は発売時の製品版で変わる場合があります。',
      },
      {
        id: 'step-4',
        title: 'GPUドライバーを更新し、ゲームファイルを確認する',
        summary: '起動直後に落ちる・黒い画面のまま進まない場合に確認します。',
        time: '約15分',
        risk: 'low',
        actions: [
          driverUpdate,
          steamVerify,
          'Discord・Steamのオーバーレイ、録画・FPS表示ツールをオフにして起動を比べる',
        ],
      },
    ],
    avoid: [
      'HDDのまま設定を下げ続けない（SSD必須の要件を先に満たす）',
      'DRMのファイルを書き換える非公式ツールを使わない',
    ],
    cautions: [
      '発売前の情報です。発売後に公式が案内する不具合や修正は、公式のお知らせもあわせて確認してください。',
    ],
    faqs: [
      {
        question: 'GTX 1660で遊べますか？',
        answer:
          '最低環境に含まれます。目安はアップスケーリングを使って1080p・30fpsです。SSDへのインストールも必要です。',
      },
      {
        question: 'Windows 10で遊べますか？',
        answer: 'Steamストアの動作環境は「Windows 10/11（64bit必須）」です。',
      },
      {
        question: '発売日はいつですか？',
        answer:
          'Steamストアの日本語表示は2026年10月28日、公式の発表は10月29日です。当初の9月9日から延期されました。正確な配信開始時刻は、Steamストアと公式のお知らせで確認してください。',
      },
      {
        question: 'コントローラーで遊べますか？',
        answer:
          'フルコントローラーサポートで、ゲームパッドが推奨されています。DUALSHOCK・DualSenseにも対応しています（Steamストアの表記）。',
      },
    ],
    sources: [
      {
        label:
          'Steamストア：Phantom Blade Zero（動作環境・SSD必須・対応言語・DRM）',
        url: 'https://store.steampowered.com/app/4115450/',
      },
      {
        label:
          'Steamニュース（公式）：A Letter From Creative Director（10月29日への延期・レイトレーシングなしでの見た目）',
        url: 'https://store.steampowered.com/news/app/4115450',
      },
    ],
    related: [],
    metaDescription:
      'Phantom Blade Zero（影の刃零）PC版が起動しない・重い時の対処法。最低環境から必須のSSD、GTX 1660・RX 5500 XTの最低環境（1080p・30fps）、アップスケーリングとレイトレーシングの設定、ドライバーの確認まで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'dragon-quest-monsters-4',
    slug: 'demo-transfer',
    category: 'save',
    checkedAt: '2026-10-03',
    seoTitle:
      'DQM4（ドラクエモンスターズ4）体験版の引き継ぎ方法と注意点【PC・Steam版】',
    title:
      'ドラゴンクエストモンスターズ4 体験版の引き継ぎ方法｜特典が受け取れない時の確認【PC・Steam版】',
    shortTitle: '体験版の引き継ぎ・特典',
    targetVersion: 'Steam版・体験版・2026年10月3日時点の公式情報（発売前）',
    symptom:
      '体験版で仲間にしたモンスターを製品版に連れていきたい、体験版のプレイ特典や早期購入特典が受け取れない、PC版が起動しない場合の確認手順です。',
    conclusion:
      '体験版のパーティとスタンバイにいるモンスター（最大8体）を製品版に引き継げます。条件は、製品版を遊ぶPCに同じアカウントで作った体験版のセーブデータがあることと、製品版のタイトル画面で「はじめから」を選ぶことです。引き継いだモンスターはレベル1・初期スキルで「預かり所」に送られます。アイテムとゴールドは引き継げません。',
    description:
      '製品版の発売は2026年12月3日です。マスターズ版は48時間のアーリーアクセスがあり、日本時間12月2日2:00に開始予定です。無料の体験版では、最初の「カレキ地方」をクリアするまで遊べます（公式）。',
    causes: [
      '製品版のタイトル画面で「つづきから」を選んでいる',
      '製品版を遊ぶPCに体験版のセーブデータがない（別のPC・削除済み）',
      '体験版と製品版で別のアカウントを使っている',
      'まだ「預かり所」を開放するところまで進んでいない',
      'Windows 11ではない・GPUのVRAMが6GB未満',
    ],
    quickFacts: [
      {
        label: '引き継げるもの',
        value:
          'パーティとスタンバイのモンスター（最大8体）＋体験版プレイ特典「冒険の続きセット」',
      },
      {
        label: '引き継げないもの',
        value: 'アイテム、ゴールド（モンスターはレベル1・初期スキルになる）',
      },
      {
        label: '引き継ぎの条件',
        value:
          '同じPCに同じアカウントの体験版セーブがある／製品版で「はじめから」を選ぶ／同じプラットフォーム間のみ',
      },
      {
        label: '発売日',
        value:
          '2026年12月3日（マスターズ版のアーリーアクセスは日本時間12月2日2:00開始予定）',
      },
      {
        label: '最低動作環境',
        value:
          'Windows 11／GTX 1660・RX 470・RX 5500 XT・Arc A380（VRAM 6GB以上）／メモリ8GB／40GB',
      },
    ],
    diagnosis: [
      {
        symptom: '体験版のモンスターが製品版にいない',
        cause: '「はじめから」を選んでいない・預かり所が未開放',
        stepId: 'step-2',
      },
      {
        symptom: '別のPCで製品版を遊ぶ',
        cause: '体験版のセーブデータがそのPCにない',
        stepId: 'step-3',
      },
      {
        symptom: '体験版プレイ特典・早期購入特典が見当たらない',
        cause: '受け取り場所・購入条件',
        stepId: 'step-4',
      },
      {
        symptom: '製品版が起動しない',
        cause: 'Windows 11・VRAM 6GBの条件',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '体験版でモンスターをパーティかスタンバイに入れる',
        summary:
          '製品版に引き継げるのは、体験版のセーブデータでパーティとスタンバイにいるモンスター（最大8体）だけです。体験版で仲間にできるのはGランクとFランクのモンスターです。',
        time: '約5分',
        risk: 'low',
        actions: [
          '引き継ぎたいモンスターを、パーティかスタンバイに入れてからセーブする',
          '体験版のセーブデータは、製品版で引き継ぎを確認するまで消さない（体験版もアンインストールしない）',
        ],
      },
      {
        id: 'step-2',
        title: '製品版のタイトル画面で「はじめから」を選ぶ',
        summary:
          '体験版プレイ特典を受け取るには、製品版のタイトル画面で必ず「はじめから」を選んでゲームを始めます（公式）。引き継いだモンスターは「預かり所」に送られます。',
        time: '進行状況による',
        risk: 'low',
        actions: [
          '製品版を起動し、タイトル画面で「はじめから」を選ぶ',
          '「預かり所」が開放されるところまでストーリーを進める',
          '預かり所で、引き継いだモンスター（レベル1・初期スキル）をパーティに加える',
        ],
      },
      {
        id: 'step-3',
        title: '体験版と製品版を同じPC・同じアカウントで遊ぶ',
        summary:
          '製品版を遊ぶPCの中に、同じアカウントで作った体験版のセーブデータがあることが条件です（公式）。体験版から製品版への引き継ぎは、同じプラットフォーム間だけです。',
        time: '約5分',
        risk: 'low',
        actions: [
          '体験版を遊んだのと同じSteamアカウントで製品版を起動する',
          '別のPCで製品版を遊ぶ場合は、そのPCにも体験版をインストールし、体験版のセーブデータがあるか確認する。体験版はSteamクラウドに対応している（Steamストアの表記）',
          'Steamのライブラリで体験版を右クリック→「プロパティ」→「一般」で、Steamクラウドへの保存が有効か確認する',
        ],
      },
      {
        id: 'step-4',
        title: '特典は「追加コンテンツ確認」から受け取る',
        summary:
          '早期購入特典とダウンロード版購入特典は、ゲーム内のメニュー画面にある「追加コンテンツ確認」から受け取ります（Steamストアの記載）。',
        time: '約3分',
        risk: 'low',
        actions: [
          'メニュー画面の「追加コンテンツ確認」を開く',
          '早期購入特典「冒険スタートダッシュセット」は、2027年1月6日 1:59（日本時間）までの購入が条件',
          'ダウンロード版購入特典は「もりもりおにくセット」。体験版プレイ特典は「冒険の続きセット」（力と素早さのゆびわ・元気玉・くんせいにく）',
        ],
        note: '体験版の中では、各種特典などのプレゼントは受け取れません（公式）。',
      },
      {
        id: 'step-5',
        title: 'Windows 11とVRAM 6GB以上を確認する',
        summary:
          'Steamストアの動作環境は、最低・推奨ともWindows 11で、最低環境でVRAM 6GB以上、推奨環境で8GB以上と記載されています。',
        time: '約3分',
        risk: 'low',
        actions: [
          winver,
          'タスクマネージャー（Ctrl + Shift + Esc）の「パフォーマンス」→「GPU」で、「専用GPUメモリ」が6GB以上か確認する',
          driverUpdate,
        ],
        note: '購入前に、無料の体験版で自分のPCで動くか確かめるのが確実です。',
      },
    ],
    avoid: [
      '製品版で引き継ぎを確認する前に、体験版のセーブデータを消したり、体験版をアンインストールしたりしない',
      '製品版を「つづきから」で始めない（体験版プレイ特典は「はじめから」でのみ受け取れる）',
      'マスターズ版と単品の追加コンテンツを重複して買わない（公式の注意）',
    ],
    cautions: [
      '発売前の情報です。体験版と製品版は一部の仕様が異なる場合があると、公式は案内しています。発売時の公式の案内もあわせて確認してください。',
    ],
    faqs: [
      {
        question: '体験版はどこまで遊べますか？',
        answer:
          '主人公たちが最初にたどり着く「カレキ地方」をクリアするまでの物語を遊べます。モンスターのスカウト・育成・配合もできますが、仲間にできるのはGランクとFランクのモンスターだけです（公式）。',
      },
      {
        question: '体験版のレベルや持ち物も引き継げますか？',
        answer:
          '引き継げません。モンスターはレベル1・初期スキルの状態で預かり所に送られ、アイテムとゴールドは引き継げません（公式）。',
      },
      {
        question: 'アーリーアクセスはいつからですか？',
        answer:
          'マスターズ版に48時間のアーリーアクセス権が付き、日本時間2026年12月2日2:00の開始を予定しています（Steamストアの記載）。',
      },
      {
        question: 'コントローラーは使えますか？',
        answer:
          'Steamストアの表記は「部分的コントローラーサポート」で、ゲームパッドが推奨されています。DUALSHOCK・DualSenseに対応し、キーボードだけでも遊べます。',
      },
      {
        question: 'オンライン対戦はできますか？',
        answer:
          'オンライン対戦・オンライン協力プレイに対応し、クロスプラットフォームでのマルチプレイにも対応しています（Steamストアの表記）。',
      },
    ],
    sources: [
      {
        label:
          'Steamストア：ドラゴンクエストモンスターズ4 枯れ木の国のビアンカ・フローラ（動作環境・特典・マスターズ版）',
        url: 'https://store.steampowered.com/app/3681610/',
      },
      {
        label: 'Steamストア：体験版（引き継ぎの条件・プレイ特典）',
        url: 'https://store.steampowered.com/app/4445890/',
      },
      {
        label: 'Steamニュース（公式）：体験版の配信と引き継ぎ',
        url: 'https://store.steampowered.com/news/app/3681610',
      },
    ],
    related: [],
    metaDescription:
      'ドラクエモンスターズ4（DQM4）体験版の引き継ぎ方法。製品版に連れていけるのはパーティとスタンバイのモンスター最大8体、タイトル画面で「はじめから」を選ぶ、同じPC・同じアカウントが条件。引き継げないもの、特典の受け取り場所、Windows 11・VRAM 6GBの動作環境まで解説。',
  }),
];
