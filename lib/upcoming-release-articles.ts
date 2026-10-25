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
    checkedAt: '2026-10-17',
    seoTitle:
      'Castlevania: Belmont’s Curse（悪魔城）が起動しない・黒い画面の対処法【PC版】',
    title:
      'Castlevania: Belmont’s Curse（キャッスルヴァニア ベルモンドの呪い）が起動しない・黒い画面のまま進まない時の対処法【PC版】',
    shortTitle: '起動しない・黒い画面',
    targetVersion:
      'Steam版・Ver.1.1.3と2026年10月16日時点のKONAMIの不具合のお知らせ',
    symptom:
      'PC版が起動しない、黒い画面のまま進まない、起動直後に落ちる、コントローラーが反応しない、Midnight Editionのアートギャラリーや特典が見当たらない場合の確認手順です。',
    conclusion:
      'KONAMIは、垂直同期（V-Sync）がOFFでFPSが「無制限」のとき、高リフレッシュレートのモニターでゲームが起動せず黒い画面になる不具合を認めています。まずゲームをVer.1.1.3以降に更新し、それでも起動しない時は、Windowsでモニターのリフレッシュレートを一時的に60Hz未満に下げてゲームを起動し、映像設定でV-SyncをONにしてから元に戻します（公式の手順）。動作環境は最低・推奨ともWindows 11です。',
    description:
      '2026年10月15日に発売されました。10月16日のVer.1.1.3で黒い画面の不具合への対策が配信されましたが、環境によってはまだ起きる場合があるとKONAMIは案内しています。日本語は字幕と音声の両方に対応しています。',
    causes: [
      'V-SyncがOFF・FPSが「無制限」で、高リフレッシュレートのモニターを使っている（KONAMIが確認している不具合）',
      'ゲームがVer.1.1.3より古い',
      'Windows 11ではない（最低環境からWindows 11）',
      'GPUドライバーが古い・ゲームファイルの破損',
      'オーバーレイや録画ツールの干渉',
      'Steam Inputの設定とコントローラーの相性',
      'アートギャラリーを本編の中で探している（別アプリ）',
    ],
    quickFacts: [
      {
        label: '黒い画面で起動しない（公式の回避策）',
        value:
          'リフレッシュレートを60Hz未満に→ゲームの映像設定でV-SyncをON→ゲームを終了→リフレッシュレートを元に戻す',
      },
      {
        label: '修正アップデート',
        value:
          'Ver.1.1.3（10月16日）。環境によってはまだ起きる場合あり（KONAMI）',
      },
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
        value: '2026年10月15日',
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
        symptom: '起動すると黒い画面のまま進まない',
        cause: 'V-Sync OFF・FPS無制限と高リフレッシュレート',
        stepId: 'step-5',
      },
      {
        symptom: 'Windows 10のPCで起動しない',
        cause: '動作環境を満たしていない',
        stepId: 'step-1',
      },
      {
        symptom: '回避策を試しても起動直後に落ちる',
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
        id: 'step-5',
        title: '黒い画面のまま起動しない時は、V-SyncをONにする（公式の回避策）',
        summary:
          'KONAMIは、V-SyncがOFFでFPSが「無制限」の設定だと、ゲームが起動できないことがあると発表しています。黒い画面のままでは設定画面に入れないため、一時的にモニターのリフレッシュレートを下げて起動します。',
        time: '約10分',
        risk: 'low',
        actions: [
          'Steamでゲームを最新版（Ver.1.1.3以降）に更新する。ライブラリでゲームを選び、更新が残っていないか確認する',
          'それでも起動しない時：Windowsの「設定」→「システム」→「ディスプレイ」→「ディスプレイの詳細設定」で、リフレッシュレートを60Hz未満にする',
          'ゲームを起動し、タイトル画面の「設定（Settings）」→「映像（Video）」で「V-Sync」をONにして、ゲームを一度終了する',
          'Windowsのリフレッシュレートを元の値に戻し、通常の起動で同じ黒画面が再発するか確認する。公式の回避策であり、このPCでの改善結果は実際の表示で判断する',
        ],
        note: '60Hz未満が選べないモニターもあります。何度試しても起動しない場合は、KONAMIのカスタマーサポートに問い合わせるよう公式が案内しています。',
      },
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
      'KONAMIは、黒い画面の不具合を完全に直すアップデートを準備中です（2026年10月16日時点）。最新のお知らせもあわせて確認してください。',
      'Steam Deckでは一部の画面表示が画面外にはみ出す不具合を、KONAMIが確認しています（修正を検討中）。',
    ],
    faqs: [
      {
        question: '144Hzや240Hzのモニターで、起動すると黒い画面のままです。',
        answer:
          'KONAMIが確認している不具合です。V-SyncがOFFでFPSが「無制限」だと起動できないことがあります。Ver.1.1.3に更新し、それでも直らなければ、Windowsでリフレッシュレートを一時的に60Hz未満にして起動し、映像設定でV-SyncをONにしてから元の値に戻してください（公式の手順）。',
      },
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
          'KONAMI公式：不具合に関するお知らせ（V-Sync OFF・FPS無制限で起動できない時の手順）',
        url: 'https://www.konami.com/games/castlevania/belmonts_curse/jp/ja/noti_261014',
      },
      {
        label:
          'Steamニュース（公式）：Notice regarding Black Screen for High Refresh Rate Monitors（Ver.1.1.3）',
        url: 'https://store.steampowered.com/news/app/4231820',
      },
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
      'Castlevania: Belmont’s Curse PC版が起動しない・黒い画面のまま進まない時の対処法。KONAMI公式の回避策（リフレッシュレートを60Hz未満にしてV-SyncをON）、Ver.1.1.3の修正、Windows 11の動作環境、Steam Inputの切り替え、Midnight Editionの内容まで解説。',
  }),
  make({
    gameSlug: 'tales-of-eternia-remastered',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-17',
    seoTitle:
      'テイルズ オブ エターニア リマスターが起動しない時の対処法【PC版】',
    title:
      'テイルズ オブ エターニア リマスターが起動しない・画面がおかしい時の対処法【PC版・Steam】',
    shortTitle: '起動しない・表示の確認',
    targetVersion: 'Steam版・2026年10月17日時点の公式情報（発売後）',
    symptom:
      'PC版が起動しない、起動直後に落ちる、DirectX 12で起動できない、コントローラーが反応しない、デラックスエディションの特典が見当たらない場合の確認手順です。',
    conclusion:
      'Steamの要件欄にはGTX 650 Ti（1GB）が記載されていますが、これだけで起動可能とは判断できません。ただしSteamストアの動作環境はWindows 11と記載されており、DirectX 12を使うにはWindows 10（バージョン1809以降）とVRAM 4GB以上のGPUが必須と注記されています。起動しない時は、Windowsのバージョン、GPUのVRAM、ドライバーの順に確認します。',
    description:
      '日本時間2026年10月16日7時に発売されました（公式の太平洋時間10月15日15時）。2005年に発売された版をもとにしたリマスターで、目的地の表示、エンカウントのOFF、オート戦闘の高速モードなどの便利機能が追加されています。',
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
          'DirectX 12のエラーが出て、専用GPUメモリが4GB未満なら、その注記を満たしていないことを記録して公式サポートへ確認する。エラーだけで原因を確定しない',
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
      '発売後、Steamの公式のお知らせで不具合の案内は出ていません（2026年10月17日時点）。案内が出た場合は、公式のお知らせもあわせて確認してください。',
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
      '最低環境からSSDへのインストールが必須です。最低環境（GTX 1660 6GB・RX 5500 XT 8GB）の目安は、アップスケーリングを使って1080p・30fpsです。発売後に起動可能となってから、実際に選べるアップスケーリングとレイトレーシング設定を1項目ずつ比較します。製品版の実測結果ではありません。公式は、レイトレーシングなしでも見た目の迫力を保つよう調整したと説明しています。',
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
        note: '体験版で自分のPCの動作を比較できます。ただし、これは体験版での確認であり、発売前の製品版全体の性能や引き継ぎ成功を検証した結果ではありません。',
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
  make({
    gameSlug: 'football-manager-27',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-25',
    seoTitle:
      'FM27が起動しない時の対処法｜無料ローンチプレビューとDenuvoの認証制限【PC版】',
    title:
      'Football Manager 27（FM27）が起動しない時の対処法｜無料ローンチプレビューの期間・引き継ぎとDenuvoの認証制限【PC版】',
    shortTitle: '起動しない・ローンチプレビュー・Denuvo',
    targetVersion: 'Steam版・2026年10月25日時点の公式情報（発売前）',
    symptom:
      'PC版のFM27（ローンチプレビューを含む）が起動しない、起動直後に落ちる、複数のPCで遊ぶと起動できなくなった、ローンチプレビューのセーブを製品版で続けたい場合の確認手順です。',
    conclusion:
      'まずCPUがSSE4.2・SSSE3に対応しているか、Windowsが最新の状態かを確認します。Steamストアには、DRMとして「Denuvo Anti-tamper」と「5 a day マシン認証制限」（1日に認証できるマシンは5台まで）が表記されています。複数のPCで遊ぶ人は注意してください。無料のローンチプレビューは日本時間10月30日3時〜11月4日3時で、そこで始めたセーブは製品版でも続けられると公式が案内しています。',
    description:
      'Steamストアの日本語表示では2026年11月10日発売です。ローンチプレビューは、これまでの「ベータ／先行アクセス」に代わる発売前の版で、無料期間の後は予約購入した人が発売日まで続けて遊べます（SEGA公認の販売店で購入した場合）。日本語に対応しています。',
    causes: [
      'CPUがSSE4.2・SSSE3に対応していない',
      'Windowsの更新が適用されていない（動作環境に「最新の更新を適用」と記載）',
      'Denuvoのマシン認証の上限（1日5台）に達した',
      'GPUドライバーが古い・ゲームファイルの破損',
      'オーバーレイや録画ツールの干渉',
    ],
    quickFacts: [
      {
        label: '発売日',
        value: '2026年11月10日（Steamストアの表記）',
      },
      {
        label: '無料のローンチプレビュー',
        value:
          '日本時間10月30日3時〜11月4日3時（英国時間10月29日18時〜11月3日18時）。登録不要',
      },
      {
        label: 'セーブの引き継ぎ',
        value:
          '無料期間に始めたセーブは、有料のローンチプレビュー・製品版でも続けられる（公式）',
      },
      {
        label: 'DRM',
        value:
          'Denuvo Anti-tamper・5 a day マシン認証制限（Steamストアの表記）',
      },
      {
        label: '最低動作環境',
        value:
          'Windows 10/11（最新の更新）／Core i3-530・FX-4100（SSE4.2・SSSE3必須）／GTX 960・R9 380・Intel HD 530／メモリ6GB／20GB',
      },
    ],
    diagnosis: [
      {
        symptom: '古いPCで起動しない・すぐ落ちる',
        cause: 'CPU・GPU・Windowsの条件',
        stepId: 'step-1',
      },
      {
        symptom: '別のPCでも遊んだら起動できなくなった',
        cause: 'Denuvoのマシン認証の上限',
        stepId: 'step-2',
      },
      {
        symptom: 'ローンチプレビューの期間・続きが分からない',
        cause: '無料期間と引き継ぎの条件',
        stepId: 'step-3',
      },
      {
        symptom: '起動直後に落ちる・画面が出ない',
        cause: 'ドライバー・ファイル・常駐ツール',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'CPU・GPU・Windowsが動作環境を満たすか確認する',
        summary:
          '最低動作環境では、CPUがSSE4.2とSSSE3に対応していること、GPUがシェーダーモデル5.0に対応していること、Windows 10/11に最新の更新を適用していることが条件です。',
        time: '約5分',
        risk: 'low',
        actions: [
          'タスクマネージャー（Ctrl + Shift + Esc）の「パフォーマンス」で、CPU・GPUの名前とメモリ（6GB以上）を確認する',
          'CPUの名前で、メーカーの公式サイトの仕様（命令セット）にSSE4.2・SSSE3があるか確認する',
          '「設定」→「Windows Update」で更新を確認し、すべて適用してから再起動する',
          winver,
        ],
      },
      {
        id: 'step-2',
        title: '複数のPCで遊ぶ時は、Denuvoの1日5台の認証制限に注意する',
        summary:
          'Steamストアには「Denuvo Anti-tamper」「5 a day マシン認証制限」と表記されています。1日に認証できるマシンの数に上限があるという意味の表記です。',
        time: '約3分',
        risk: 'low',
        actions: [
          '同じ日に多くのPCで起動していないか確認する（自宅・ノートPC・ネットカフェなど）',
          '上限は1日あたりなので、上限に達したと思われる場合は時間をおいてから、遊ぶPCで起動し直す',
          '表示されたエラーの文言を控え、解決しない場合はSEGA・Sports Interactiveの公式サポートに伝える',
        ],
        note: '認証の細かな仕組みは公開されていません。DRMを回避する非公式ツールは使わないでください。',
      },
      {
        id: 'step-3',
        title: 'ローンチプレビューの期間と、セーブの引き継ぎ条件を確認する',
        summary:
          '無料のローンチプレビューは、Steam・Epic・Microsoft Store・Xbox Game Pass・PC Game Passで遊べます。無料期間に始めたセーブは、有料のローンチプレビューと製品版でも始め直さずに続けられると公式が案内しています。',
        time: '約3分',
        risk: 'low',
        actions: [
          '無料期間は日本時間10月30日3時〜11月4日3時。期間が終わると、予約購入していない場合は製品版の発売まで遊べない',
          '予約購入すると、無料期間の後も有料のローンチプレビューとして11月10日の発売まで続けられる（SEGA公認の販売店で購入した場合）',
          'Game Passで遊ぶ場合は、サブスクリプションでセーブを続けられる（ローンチプレビューはGame Pass UltimateとPC Game Passのみ）',
        ],
        note: 'ローンチプレビューは権利者の承認前のデータを含み、一部のクラブや選手の素材がない場合があると公式が注意しています。',
      },
      {
        id: 'step-4',
        title: 'GPUドライバーを更新し、ゲームファイルを確認する',
        summary: '起動直後に落ちる・画面が出ない場合に確認します。',
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
      'Denuvoを回避するとうたう非公式ツールやファイルを使わない',
      '起動しないからといって、ローンチプレビューのセーブフォルダを消さない（製品版で続けられる）',
    ],
    cautions: [
      '発売前の情報です。発売後に公式が案内する不具合や修正は、公式のお知らせもあわせて確認してください。',
      '時刻は公式の英国時間（GMT）を日本時間に換算した目安です。正確な時刻はSteamストアと公式のお知らせで確認してください。',
    ],
    faqs: [
      {
        question: 'ローンチプレビューは無料ですか？',
        answer:
          '日本時間10月30日3時〜11月4日3時の5日間は、登録不要で無料で遊べます（PC・Mac）。その後は予約購入した人が、11月10日の発売まで続けて遊べます。',
      },
      {
        question: '無料期間のセーブは製品版で使えますか？',
        answer:
          '公式は、無料期間に始めたゲームは有料のローンチプレビューと製品版でも始め直さずに続けられると案内しています。',
      },
      {
        question: '日本語で遊べますか？',
        answer: 'Steamストアの対応言語に日本語が含まれています。',
      },
      {
        question: 'Windows 10で遊べますか？',
        answer:
          '最低動作環境はWindows 10/11（最新の更新を適用）、推奨はWindows 11（64bit）です（Steamストアの表記）。',
      },
    ],
    sources: [
      {
        label:
          'Steamストア：Football Manager 27（動作環境・対応言語・DRMの表記）',
        url: 'https://store.steampowered.com/app/4530370/',
      },
      {
        label:
          'Steamニュース（公式）：Play Free: Football Manager 27 Launch Preview（無料期間・引き継ぎ）',
        url: 'https://store.steampowered.com/news/app/4530370',
      },
    ],
    related: [],
    metaDescription:
      'Football Manager 27（FM27）PC版が起動しない時の対処法。SSE4.2・SSSE3が必要なCPUの条件、Denuvoの「1日5台」のマシン認証制限、無料ローンチプレビューの期間（10月30日3時〜11月4日3時）と製品版へのセーブ引き継ぎまで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'where-the-seeds-fall',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-25',
    seoTitle:
      '崩落の国が起動しない時の対処法｜Windows 11・SSD必須と体験版【PC版】',
    title:
      '崩落の国（Where the Seeds Fall）が起動しない・体験版が動かない時の対処法｜Windows 11とSSDが必須【PC版】',
    shortTitle: '起動しない・体験版',
    targetVersion: 'Steam版・体験版・2026年10月25日時点の公式情報（発売前）',
    symptom:
      'PC版・体験版が起動しない、起動直後に落ちる、読み込みが長い、重い場合の確認手順です。',
    conclusion:
      '最低動作環境からWindows 11とSSDへのインストールが必須です（Steamストアの表記）。起動しない時は、まずWindowsのバージョンとインストール先のドライブを確認します。最低環境のGPUはGTX 1660（6GB）・RX 6600（8GB）、メモリは16GBです。',
    description:
      'Cygamesの新ブランド「CygamesEdge」の第1作で、Steamストアの日本語表示では2026年11月5日発売です。体験版は配信中で、公式によると最初からすべてのアクションが使える高難度の区間で、ストーリー要素はなく15〜30分ほどで遊べます。日本語に対応しています。 体験版と未発売の製品版を区別してください。製品版の修復を実機検証した記事ではなく、製品版の操作は配信開始後に公式案内と照合します。',
    causes: [
      'Windows 10を使っている（最低環境からWindows 11）',
      'HDDにインストールしている（SSD必須）',
      'GPUが最低環境（GTX 1660 6GB・RX 6600 8GB）を下回る',
      'GPUドライバーが古い・ゲームファイルの破損',
      'オーバーレイや録画ツールの干渉',
    ],
    quickFacts: [
      { label: '発売日', value: '2026年11月5日（Steamストアの表記）' },
      {
        label: '必須',
        value: 'Windows 11／SSDへのインストール（最低環境から）',
      },
      {
        label: '最低動作環境',
        value:
          'Core i5-10400・Ryzen 5 5500／GTX 1660（6GB）・RX 6600（8GB）／メモリ16GB／DirectX 12／5GB',
      },
      {
        label: '推奨動作環境',
        value:
          'Core i5-12400・Ryzen 5 5600／RTX 3060（8GB）・RX 6700 XT／メモリ16GB',
      },
      {
        label: '体験版',
        value:
          '配信中。すべてのアクションが使える区間で、ストーリー要素なし・15〜30分程度（公式）',
      },
    ],
    diagnosis: [
      {
        symptom: '起動しない・すぐ終了する',
        cause: 'Windows 11ではない',
        stepId: 'step-1',
      },
      {
        symptom: '読み込みが長い・途中で止まる',
        cause: 'HDDにインストールしている',
        stepId: 'step-2',
      },
      {
        symptom: '古いGPUで起動しない・極端に重い',
        cause: '最低環境を下回る',
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
        title: 'Windows 11か確認する',
        summary:
          'Steamストアの動作環境は、最低・推奨ともWindows 11です。Windows 10は動作環境に含まれていません。',
        time: '約2分',
        risk: 'low',
        actions: [
          winver,
          '「Windows 10」と表示された場合は動作環境の対象外。PCがWindows 11に対応しているかは、Microsoftの「PC正常性チェック」アプリで確認できる',
        ],
      },
      {
        id: 'step-2',
        title: 'SSDにインストールされているか確認する',
        summary:
          'Steamストアの動作環境には、最低・推奨とも「SSD環境必須」と書かれています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Steamの「設定」→「ストレージ」で、ゲームが入っているドライブを確認する',
          'タスクマネージャー（Ctrl + Shift + Esc）の「パフォーマンス」で、そのドライブの種類（SSD／HDD）を確認する',
          'HDDに入っている場合は、ストレージ画面でゲームを選び「移動」からSSDのドライブへ移す',
        ],
      },
      {
        id: 'step-3',
        title: 'GPUとメモリが最低環境を満たすか確認する',
        summary:
          '最低環境はGTX 1660（6GB）・RX 6600（8GB）、メモリ16GBです。体験版で動作を確かめてから購入するのが確実です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'タスクマネージャーの「パフォーマンス」→「GPU」で、GPUの名前と「専用GPUメモリ」を確認する',
          'メモリ（RAM）が16GB以上あるか確認する',
          'CPUは最低環境でCore i5-10400・Ryzen 5 5500',
        ],
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
      'Windows 10のまま、設定やファイルを書き換えて動かそうとしない（動作環境の対象外）',
      'HDDのまま設定を下げ続けない（SSD必須の要件を先に満たす）',
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
        question: '体験版のセーブは製品版に引き継げますか？',
        answer:
          '公式は、体験版を製品版とは別の内容（すべてのアクションが最初から使える区間・ストーリー要素なし）と説明しています。セーブの引き継ぎについての案内は確認できていません（10月25日時点）。',
      },
      {
        question: 'どのくらいで遊び終わりますか？',
        answer:
          '公式によると、メインストーリーは初回のプレイで約3時間です。製品版は体験版より遊びやすい難易度に調整されています。',
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
          'Steamストア：崩落の国（動作環境・Windows 11・SSD必須・対応言語）',
        url: 'https://store.steampowered.com/app/4139580/',
      },
      {
        label:
          'Steamニュース（公式）：体験版の配信（体験版の内容・プレイ時間・価格）',
        url: 'https://store.steampowered.com/news/app/4139580',
      },
    ],
    related: [],
    metaDescription:
      '崩落の国（Where the Seeds Fall）PC版・体験版が起動しない時の対処法。最低環境から必須のWindows 11とSSD、GTX 1660・RX 6600の最低環境、ドライバーとファイルの確認、体験版の内容まで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'godzilla-destroy-all-monsters-melee',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-25',
    seoTitle:
      'ゴジラ DAMM Remasteredが起動しない時の対処法｜DirectX 12とオンライン対戦【PC版】',
    title:
      'Godzilla: Destroy All Monsters Melee Remastered（ゴジラ）が起動しない・オンライン対戦できない時の対処法【PC版】',
    shortTitle: '起動しない・オンライン対戦',
    targetVersion: 'Steam版・体験版・2026年10月25日時点の公式情報（発売前）',
    symptom:
      'PC版・体験版が起動しない、起動直後に落ちる、オンライン対戦につながらない、友達と遊ぶ方法が分からない場合の確認手順です。',
    conclusion:
      '最低動作環境のGPUは「DirectX 12・シェーダーモデル6対応」のGTX 1060（6GB）・RX 580（8GB）で、メモリは16GBです（Steamストアの表記）。起動しない時は、まずGPUとドライバーを確認します。オンラインは1対1のクイックマッチで、ローカルでは最大4人で遊べます（体験版の公式案内）。',
    description:
      'Steamストアの日本語表示では2026年11月3日発売です。体験版は10月27日まで配信されています（公式）。Windows 10（64bit）でも動作環境に含まれ、Windows 11が推奨です。日本語のインターフェース・字幕に対応し、フル音声は英語のみです。',
    causes: [
      'GPUがDirectX 12・シェーダーモデル6に対応していない、または最低環境を下回る',
      'メモリが16GB未満',
      'GPUドライバーが古い・ゲームファイルの破損',
      'オーバーレイや録画ツールの干渉',
      'オンライン対戦の回線・Steamの状態',
    ],
    quickFacts: [
      { label: '発売日', value: '2026年11月3日（Steamストアの表記）' },
      { label: '体験版', value: '10月27日まで配信（公式）' },
      {
        label: '最低動作環境',
        value:
          'Windows 10（64bit）・Windows 11推奨／Core i5-8400・Ryzen 5 2600／GTX 1060（6GB）・RX 580（8GB）、DirectX 12・シェーダーモデル6対応／メモリ16GB／6GB',
      },
      {
        label: '遊び方',
        value:
          'オンラインは1対1のクイックマッチ、ローカルは最大4人。Remote Play Together対応',
      },
      {
        label: '日本語',
        value:
          'インターフェース・字幕は対応。フル音声は英語のみ（Steamストアの表記）',
      },
    ],
    diagnosis: [
      {
        symptom: '起動しない・すぐ落ちる',
        cause: 'GPU・DirectX 12の条件',
        stepId: 'step-1',
      },
      {
        symptom: '起動直後に落ちる・黒い画面のまま',
        cause: 'ドライバー・ファイル・常駐ツール',
        stepId: 'step-2',
      },
      {
        symptom: 'オンライン対戦につながらない',
        cause: '回線・Steamの状態',
        stepId: 'step-3',
      },
      {
        symptom: '離れた友達と一緒に遊びたい',
        cause: 'Remote Play Togetherの使い方',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'GPUとメモリが最低環境を満たすか確認する',
        summary:
          '最低環境はGTX 1060（6GB）・RX 580（8GB）で、「DirectX 12・シェーダーモデル6対応」と書かれています。メモリは16GBです。',
        time: '約5分',
        risk: 'low',
        actions: [
          'タスクマネージャー（Ctrl + Shift + Esc）の「パフォーマンス」→「GPU」で、GPUの名前と「専用GPUメモリ」を確認する',
          'Windows + R →「dxdiag」と入力し、「ディスプレイ」タブの「機能レベル」に12_0以上が含まれているか見る（DirectX 12対応の目安）',
          'メモリ（RAM）が16GB以上あるか確認する',
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
        title: 'オンライン対戦につながらない時は、回線とSteamの状態を確認する',
        summary:
          'オンラインは1対1のクイックマッチです（体験版の公式案内）。つながらない時は、まず自分の回線とSteamの状態を確認します。',
        time: '約10分',
        risk: 'low',
        actions: [
          'ほかのサイトや動画が普通に見られるか確認し、ルーターを再起動する',
          'Steamにログインできているか、Steamのダウンロードや動画配信など回線を多く使うものを止める',
          '公式のお知らせ（Steamニュース）で、メンテナンスや障害の案内が出ていないか確認する',
        ],
      },
      {
        id: 'step-4',
        title: '離れた友達とはRemote Play Togetherで遊ぶ',
        summary:
          'ローカルでは最大4人で遊べ、Steamストアの表記ではRemote Play Togetherに対応しています。',
        time: '約5分',
        risk: 'low',
        actions: [
          '自分がゲームを起動し、Shift + Tabでオーバーレイを開いて、フレンドリストから友達を「Remote Play Together」に招待する',
          '招待された友達はゲームを持っていなくても参加できる（Steamの仕様）',
          '映像や操作が遅れる時は、有線LANで接続する',
        ],
      },
    ],
    avoid: [
      '最低環境を下回るGPUで、ファイルを書き換えて無理に動かそうとしない',
      '公式以外のサイトからドライバーや修正ツールを入れない',
    ],
    cautions: [
      '発売前の情報です。発売後に公式が案内する不具合や修正は、公式のお知らせもあわせて確認してください。',
    ],
    faqs: [
      {
        question: 'Windows 10で遊べますか？',
        answer:
          'Steamストアの最低動作環境は「Windows 10 64-bit、Windows 11推奨」です。',
      },
      {
        question: '体験版はいつまで遊べますか？',
        answer:
          '公式の案内では10月27日までです。体験版ではゴジラ・キングギドラ・ガイガンを選べ、オンラインの1対1と最大4人のローカル対戦を試せます。',
      },
      {
        question: '日本語で遊べますか？',
        answer:
          'インターフェースと字幕は日本語に対応しています。フル音声は英語のみです（Steamストアの表記）。',
      },
      {
        question: 'コントローラーで遊べますか？',
        answer:
          'フルコントローラーサポートで、ゲームパッドが推奨されています（Steamストアの表記）。',
      },
    ],
    sources: [
      {
        label:
          'Steamストア：Godzilla: Destroy All Monsters Melee Remastered（動作環境・対応言語・遊び方）',
        url: 'https://store.steampowered.com/app/4251460/',
      },
      {
        label:
          'Steamニュース（公式）：体験版の配信（10月27日まで・オンライン1対1）',
        url: 'https://store.steampowered.com/news/app/4251460',
      },
      {
        label: 'Steam：Remote Play Together（招待のしかた）',
        url: 'https://store.steampowered.com/remoteplay',
      },
    ],
    related: [],
    metaDescription:
      'Godzilla: Destroy All Monsters Melee Remastered（ゴジラ）PC版・体験版が起動しない・オンライン対戦できない時の対処法。DirectX 12・シェーダーモデル6対応のGTX 1060・RX 580の最低環境、ドライバーとファイルの確認、オンライン1対1とRemote Play Togetherまで公式情報をもとに解説。',
  }),
];
