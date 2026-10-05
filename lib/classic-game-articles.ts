import type { GameArticle } from '@/lib/game-articles';

// 定番タイトル7作品の個別記事。各社の公式サポート（CD PROJEKT RED・Larian・
// Arrowhead・WB Games・Rockstar・SKSE公式・Stardew Valley公式Wiki）で
// を基に編集。本記事の安全方針は公式手順と区別する。
// 今回の部分確認範囲は docs/evidence-audit-2026-10-05 を参照。
// STEPのidは解決報告（D1）の集計キーなので、公開後は変更しないでください。

type Draft = Omit<
  GameArticle,
  'checkedAt' | 'symptoms' | 'seoTitle' | 'status'
> & {
  seoTitle?: string;
};

const make = (draft: Draft): GameArticle => ({
  checkedAt: '2026-09-29',
  status: 'verified',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const verifySteam = (name: string) =>
  `Steamのライブラリで「${name}」を右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」`;

export const classicGameArticles: GameArticle[] = [
  make({
    gameSlug: 'cyberpunk-2077',
    slug: 'not-launching',
    category: 'launch',
    seoTitle:
      'サイバーパンク2077が起動しない・クラッシュする時の対処法【PC版】',
    title:
      'サイバーパンク2077が起動しない・クラッシュする時の対処法｜公式サポートの手順【PC版】',
    shortTitle: '起動しない・クラッシュ',
    targetVersion: 'Steam・GOG・Epic版（PC）',
    symptom:
      '起動ボタンを押しても始まらない、REDlauncherの後に落ちる、プレイ中にデスクトップへ戻る場合の確認手順です。',
    conclusion:
      'CD PROJEKT REDの公式サポートの確認項目を基に、動作環境とWindows、GPUドライバー、Visual C++ 再頒布可能パッケージ、ゲームファイルを順に確認します。本記事では保護機能を有効に保ち、非必須のオーバーレイだけを1つずつ比較します。MODを入れている場合は、まずMODを外した状態で起動できるか確認します。',
    description:
      'ドライバーの更新直後から落ちるようになった場合は、公式サポートが1つ前のバージョンに戻すよう案内しています。オーバークロック・アンダークロックもクラッシュの原因になるため、定格に戻して確認します。',
    causes: [
      'GPUドライバーの不具合・更新直後の相性',
      'Visual C++ 再頒布可能パッケージの破損・不足',
      'ゲームファイルの破損',
      'Discordなどのオーバーレイ、監視ツール、セキュリティソフト',
      'MOD（REDmod・CETなど）が本体のバージョンに対応していない',
      'CPU・GPUのオーバークロック',
    ],
    quickFacts: [
      {
        label: 'Windowsのバージョン確認',
        value: 'Windows＋R→「winver」（Windows 10は1909以上が必要）',
      },
      {
        label: 'セーブの場所',
        value: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077`,
        copy: true,
      },
      {
        label: 'ドライバー更新後から落ちる',
        value: '1つ前のバージョンに戻して確認（公式）',
      },
      { label: 'MODを入れている', value: 'まずMODなしで起動できるか確認' },
    ],
    diagnosis: [
      {
        symptom: 'MODを入れてから、または大型アップデート後から起動しない',
        cause: 'MODが本体のバージョンに未対応',
        stepId: 'mods-off',
      },
      {
        symptom: 'GPUドライバーを更新した直後から落ちる',
        cause: 'ドライバーとの相性',
        stepId: 'gpu-driver',
      },
      {
        symptom: '「MSVCP140.dll が見つからない」などDLLのエラーが出る',
        cause: 'Visual C++ 再頒布可能パッケージの不足・破損',
        stepId: 'vcredist',
      },
      {
        symptom: 'プレイ中にランダムで落ちる',
        cause: 'ファイル破損・オーバーレイ・オーバークロック',
        stepId: 'verify-files',
      },
    ],
    steps: [
      {
        id: 'mods-off',
        title: 'MODを外し、動作環境とWindowsのバージョンを確認する',
        summary: 'MODが原因かどうかを最初に切り分けます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'MOD管理ツールを使っている場合は、すべてのMODを無効にする（手動で入れた場合は、導入したファイルを別のフォルダへ退避する）',
          'Windows＋Rキーを押し「winver」と入力して、Windowsのバージョンを確認する。Windows 10で1909より古い場合は更新する（公式）',
          'Steamストアの動作環境と、自分のGPU・メモリを比べる',
        ],
        note: 'MODを外して起動できた場合は、MODをゲーム本体のバージョンに対応した版へ更新してから1つずつ戻します。',
      },
      {
        id: 'gpu-driver',
        title: 'GPUドライバーをクリーンインストールする',
        summary:
          '公式サポートは、古いドライバーを削除してから最新版を入れ直す手順を案内しています。',
        time: '約15分',
        risk: 'medium',
        actions: [
          'NVIDIA・AMD・Intelの公式サイトから最新のドライバーを先にダウンロードしておく',
          'NVIDIA・Intel：Display Driver Uninstaller（DDU）で古いドライバーを削除してから、ダウンロードしたドライバーを入れる。AMD：AMD Cleanup Utilityで削除してから入れる（公式の案内）',
          'ドライバーを更新した直後から落ちるようになった場合は、1つ前のバージョンを入れて確認する',
        ],
        note: 'ドライバーの削除中は画面の解像度が下がることがあります。手順を控えてから作業してください。',
      },
      {
        id: 'vcredist',
        title: 'Visual C++ 再頒布可能パッケージを入れ直す',
        summary:
          'DLLのエラーが出る場合や、起動直後に何も表示されず終わる場合に確認します。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Microsoft公式サイトから、Visual C++ 再頒布可能パッケージのx64版とx86版の両方をダウンロードする',
          'それぞれのインストーラーを右クリック→「管理者として実行」でインストールする',
          'PCを再起動してからゲームを起動する',
        ],
      },
      {
        id: 'verify-files',
        title: 'ゲームファイルを確認し、非必須のオーバーレイを比較する',
        summary:
          '破損したファイルを修復し、非必須のオーバーレイだけを1つずつ比較します。保護機能は有効に保ちます。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          verifySteam('Cyberpunk 2077'),
          'GOG GALAXY・Epic Gamesの場合も、各ランチャーの「確認・修復」を使う',
          'Discord・Ubisoft Connect・GOG GALAXYなど、非必須のオーバーレイだけを1つずつオフにして起動を比較する。ウイルス対策・ファイアウォールは有効のままにする',
          'ランチャー（Steam・GOG GALAXY・Epic）を管理者として実行してから起動する',
          'CPU・GPUをオーバークロック・アンダークロックしている場合は定格に戻す（公式）',
        ],
        note: '起動させるために検疫を解除したり、除外設定を追加したりしないでください。公式ゲームファイルの誤検知が疑われる場合は、保護履歴の検出名・対象ファイルを控え、セキュリティ製品の公式窓口またはCD PROJEKT REDサポートへ確認してください。',
      },
    ],
    avoid: [
      'MODを入れたまま再インストールしない（MODのファイルが残る場合がある）',
      'セーブフォルダを削除しない。作業前に別の場所へコピーしておく',
      'オーバークロックした状態のまま原因を探さない',
    ],
    cautions: [
      '直らない場合は、表示されたエラーの文章やエラーコードを控えてCD PROJEKT REDのサポートに問い合わせてください（公式の案内）。',
    ],
    faqs: [
      {
        question: 'REDlauncherが起動しません。',
        answer:
          '公式サポートは、Steam・Epic Games・GOG GALAXYのいずれかのストアアプリを管理者として実行してから起動する方法を案内しています。',
      },
      {
        question: '再インストールするとセーブは消えますか？',
        answer: String.raw`セーブは「%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077」に保存され、通常はゲームのフォルダとは別です。念のため、作業前にこのフォルダを別の場所へコピーしておくと安全です。`,
      },
    ],
    sources: [
      {
        label:
          'CD PROJEKT RED サポート：Game is not launching — Cyberpunk 2077',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1568/game-is-not-launching',
      },
      {
        label: 'CD PROJEKT RED サポート：Game crashes — Cyberpunk 2077',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1700/my-game-crashes-7',
      },
      {
        label: 'CD PROJEKT RED サポート：MSVCP140_1.dll が見つからないエラー',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1915/error-the-code-execution-cannot-proceed-because-msvcp140-1-dll-was-not-found',
      },
    ],
    related: [],
    metaDescription:
      'サイバーパンク2077がPCで起動しない・クラッシュする時の対処法。CD PROJEKT RED公式サポートの手順（GPUドライバーのクリーンインストール、Visual C++、ファイル確認、オーバーレイ停止）とMODの切り分けを解説。',
  }),
  make({
    gameSlug: 'baldurs-gate-3',
    slug: 'crash-on-startup',
    category: 'launch',
    seoTitle:
      'バルダーズ・ゲート3が起動しない・起動時に落ちる時の対処法【PC版】',
    title:
      'バルダーズ・ゲート3（BG3）が起動しない・起動時にクラッシュする時の対処法【PC版】',
    shortTitle: '起動しない・起動時に落ちる',
    targetVersion: 'Steam・GOG版（Windows）',
    symptom:
      'ランチャーから「Play」を押しても始まらない、ロゴの前後で落ちる、パッチ後から起動しなくなった場合の確認手順です。',
    conclusion:
      'Larianの公式サポートは、①常駐アプリを閉じる、②ファイルの確認、③ランチャーでDirectX 11とVulkanを切り替える、④ランチャーを通さずexeを直接起動する、⑤古いMODを完全に外す、の順で案内しています。セーブや設定を作り直す手順は最後に回し、必ずフォルダの名前を変えて残してから行います。',
    description:
      'Vulkan版は「bg3.exe」、DirectX 11版は「bg3_dx11.exe」です。ASUS Sonic Studio Virtual Mixerが起動時のクラッシュを起こす既知の問題も公式に案内されています。',
    causes: [
      'セキュリティソフト・オーバーレイ・監視ツールなどの常駐アプリ',
      'ゲームファイルの破損',
      'DirectX 11／Vulkanのどちらか一方で起動できない',
      '古いパッチ用のMODが残っている',
      'ASUS Sonic Studio Virtual Mixer（既知の問題）',
      'Visual C++ 再頒布可能パッケージの破損',
    ],
    quickFacts: [
      {
        label: '実行ファイル',
        value: 'Vulkan：bg3.exe／DirectX 11：bg3_dx11.exe（binフォルダ内）',
      },
      {
        label: 'MODフォルダ',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods`,
        copy: true,
      },
      {
        label: 'セーブ・設定の場所',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3`,
        copy: true,
      },
      {
        label: '既知の問題',
        value: 'ASUS Sonic Studio Virtual Mixerで起動時に落ちる（公式）',
      },
    ],
    diagnosis: [
      {
        symptom: 'ランチャーのPlayを押すと落ちる',
        cause: '常駐アプリ・描画APIとの相性',
        stepId: 'switch-api',
      },
      {
        symptom: 'ランチャー自体が表示されない・操作できない',
        cause: 'ランチャーの不具合',
        stepId: 'direct-exe',
      },
      {
        symptom: 'パッチ後から起動しない（MODを使っていた）',
        cause: '古いMODが残っている',
        stepId: 'remove-mods',
      },
      {
        symptom: '新しいセーブでも起動時に落ちる',
        cause: '設定ファイル・キャッシュの破損',
        stepId: 'reset-profile',
      },
    ],
    steps: [
      {
        id: 'switch-api',
        title: '常駐アプリを閉じ、ファイル確認とDX11／Vulkanの切り替えを試す',
        summary:
          'Larianの確認項目を基に、保護機能を有効に保ったまま切り分ける本記事の手順です。',
        time: '10〜15分',
        risk: 'low',
        actions: [
          '不要なグラフィック調整ツール・監視用オーバーレイ・チャットアプリを1つずつ終了して比較する。セキュリティソフトとファイアウォールは有効に保つ。検出がある場合は、対象ファイルと検出名を確認してセキュリティソフトの提供元かLarianに相談する',
          'ASUS Sonic Studio Virtual Mixerを使っている場合は、無効にするかアンインストールする（公式の既知の問題）',
          verifySteam("Baldur's Gate 3"),
          'ランチャーでDirectX 11とVulkanを切り替えて起動する',
        ],
      },
      {
        id: 'direct-exe',
        title: 'ランチャーを通さず、exeを管理者として直接起動する',
        summary: 'SteamやGOG GALAXYを終了し、binフォルダのexeから起動します。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steam（GOG版はGalaxy）を終了する',
          String.raw`「…\SteamApps\common\Baldurs Gate 3\bin」を開く（Steamのライブラリで右クリック→「管理」→「ローカルファイルを閲覧」からも開ける）`,
          'Vulkanなら「bg3.exe」、DirectX 11なら「bg3_dx11.exe」を右クリック→「管理者として実行」',
          '公式サポートは、exeを右クリックした後にShiftキーを押したまま「管理者として実行」を選び、スプラッシュ画面が出るまでShiftを押し続ける方法も案内している',
        ],
        note: 'Visual C++のDLLエラーが出た場合は、Microsoft公式サイトから最新のVisual C++ 再頒布可能パッケージ（64bit）を入れ直します。',
      },
      {
        id: 'remove-mods',
        title: '古いMODを完全に外す',
        summary:
          '以前のパッチでMODを使っていた場合、ファイルが残っていると起動時に落ちることがあります。',
        time: '約5分',
        risk: 'medium',
        actions: [
          'ゲームとランチャーを終了する',
          String.raw`エクスプローラーのアドレス欄に「%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods」を入力し、中身を別の場所へ移動する`,
          String.raw`ゲームのインストール先「…\Baldurs Gate 3\Data」に「Mods」「Public」フォルダがある場合も、別の場所へ移動する（公式はどちらも削除してよいと案内）`,
          'MODなしで起動できるか確認する',
        ],
      },
      {
        id: 'reset-profile',
        title: '設定フォルダの名前を変えて、作り直させる',
        summary:
          'セーブ・設定・キャッシュのフォルダを新しく作らせて確認します。名前を変えるだけなので元に戻せます。',
        time: '約5分',
        risk: 'medium',
        actions: [
          String.raw`まず「%LocalAppData%\Larian Studios\Baldur's Gate 3\LevelCache」の中身を削除して起動する（公式）`,
          String.raw`直らない場合は「%LocalAppData%\Larian Studios」を開き、「Baldur's Gate 3」フォルダの名前を変える（例：末尾に_oldを付ける）`,
          '起動できたら、新しいゲームの開始とセーブ・ロードができるか確認する',
          'セーブを戻す場合は、新しくできたフォルダを削除して、名前を変えたフォルダを元の名前に戻す',
        ],
        note: 'Steamクラウドが有効な場合、起動時にクラウドのデータが再ダウンロードされることがあります。公式は、必要に応じてこのゲームのSteamクラウドを一時的にオフにする方法も案内しています。',
      },
    ],
    avoid: [
      '設定フォルダを名前変更ではなく削除しない（セーブが入っている）',
      'マルチプレイで、参加者ごとにMODの有無・バージョンが違う状態のまま試さない',
    ],
    cautions: [
      '直らない場合、公式はdxdiagのレポート（Windows＋R→「dxdiag」→「情報をすべて保存」）と、binフォルダのgold.log・クラッシュダンプを添えて問い合わせるよう案内しています。',
    ],
    faqs: [
      {
        question: 'DirectX 11とVulkanのどちらで遊べばいいですか？',
        answer:
          'どちらかで起動できない場合は、もう一方に切り替えて確認するよう公式サポートが案内しています。起動できて安定する方を使ってください。',
      },
      {
        question: 'セーブデータはどこにありますか？',
        answer: String.raw`「%LocalAppData%\Larian Studios\Baldur's Gate 3」フォルダに、セーブ・設定ファイル・レベルキャッシュが入っています（公式）。`,
      },
    ],
    sources: [
      {
        label:
          'Microsoft：Windowsセキュリティのウイルスと脅威の防止（除外の注意）',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label: 'Larian公式サポート：Crashing upon startup (PC)',
        url: 'https://larian.com/support/faqs/crashing-upon-startup-pc_59',
      },
      {
        label: 'Larian公式サポート：The Larian Launcher is crashing',
        url: 'https://larian.com/support/faqs/the-larian-launcher-is-crashing_63',
      },
      {
        label: "Baldur's Gate 3 公式サポート",
        url: 'https://baldursgate3.game/support',
      },
    ],
    related: [],
    metaDescription:
      'バルダーズ・ゲート3（BG3）がPCで起動しない・起動時に落ちる時の対処法。Larian公式の手順（DX11とVulkanの切り替え、exeの直接起動、古いMODの削除、設定フォルダの作り直し）を解説。',
  }),
  make({
    gameSlug: 'helldivers-2',
    slug: 'gameguard-error-114',
    category: 'launch',
    seoTitle: 'ヘルダイバー2のGameGuardエラー114の直し方【PC版】',
    title:
      'ヘルダイバー2（HELLDIVERS 2）のGameGuardエラー114で起動しない時の直し方【PC版】',
    shortTitle: 'GameGuardエラー114',
    targetVersion: 'Steam版（Windows）',
    symptom:
      '起動時にnProtect GameGuardのエラー114が出てゲームが始まらない場合の、Arrowhead公式サポートの手順です。',
    conclusion:
      'Arrowheadの公式サポートは、①exeを管理者として（Windows 11では互換モードWindows 8も）実行、②GameGuardのアンインストールと再インストール、③常駐ツールの停止、④セキュリティソフト、⑤古いHDD、を案内しています。ただし本記事では、保護機能を止めず検出内容を提供元に相談し、内部機器の変更は安全を確認してから判断する手順にしています。',
    description:
      'Arrowheadの案内には除外設定も含まれますが、除外したファイルはリアルタイムの検査対象外になります。本記事では保護を有効に保ち、検出内容を提供元に確認してから判断する手順にしています。',
    causes: [
      'GameGuardのインストール状態の破損',
      '常駐しているユーティリティ（不正ツールでなくても反応する場合がある）',
      'セキュリティソフト・ファイアウォール',
      '管理者権限がない状態での起動',
      '接続された古いHDD（まれ）',
    ],
    quickFacts: [
      {
        label: 'ゲームのフォルダを開く',
        value: 'Steamで右クリック→「管理」→「ローカルファイルを閲覧」',
      },
      { label: '実行ファイル', value: 'binフォルダの「helldivers2」' },
      {
        label: 'GameGuardの再インストール',
        value: 'toolsフォルダの「gguninst」→「GGSetup」を管理者として実行',
      },
      {
        label: 'Windows 11の場合',
        value: '互換モード「Windows 8」も有効にする（公式）',
      },
    ],
    diagnosis: [
      {
        symptom: 'エラー114が毎回出る',
        cause: '管理者権限・互換性',
        stepId: 'run-as-admin',
      },
      {
        symptom: '管理者で実行しても114が出る',
        cause: 'GameGuardのインストール状態',
        stepId: 'reinstall-gameguard',
      },
      {
        symptom: '特定のアプリを起動している時だけ出る',
        cause: 'ユーティリティ・セキュリティソフトとの干渉',
        stepId: 'utilities',
      },
    ],
    steps: [
      {
        id: 'run-as-admin',
        title: 'helldivers2を管理者として（Windows 11は互換モードも）実行する',
        summary: '公式サポートが最初に挙げている手順です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steamのライブラリで「HELLDIVERS 2」を右クリック→「管理」→「ローカルファイルを閲覧」',
          '「bin」フォルダを開き、「helldivers2」を右クリック→「プロパティ」→「互換性」タブ',
          '「管理者としてこのプログラムを実行する」にチェックを入れる',
          'Windows 11の場合は「互換モードでこのプログラムを実行する」にもチェックを入れ、「Windows 8」を選ぶ',
          '「OK」を押してSteamから起動する',
        ],
        note: '直った後も不具合が出る場合は、チェックを外せば元に戻ります。',
      },
      {
        id: 'reinstall-gameguard',
        title: 'GameGuardをアンインストールして入れ直す',
        summary: 'ゲームのフォルダにあるGameGuardのツールを使います。',
        time: '約5分',
        risk: 'low',
        actions: [
          'STEP 1と同じ方法でゲームのフォルダを開く',
          '「tools」フォルダの「gguninst」を右クリック→「管理者として実行」',
          'アンインストールが終わったら、同じフォルダの「GGSetup」を右クリック→「管理者として実行」',
          'PCを再起動してから起動する',
        ],
      },
      {
        id: 'utilities',
        title: '常駐ツールを1つずつ閉じ、保護履歴を確認する',
        summary:
          '不正ツールではないアプリでもエラー114が出る場合があると公式が説明しています。',
        time: '約10分',
        risk: 'low',
        actions: [
          'オーバーレイ、マクロ、RGB制御、監視ツールなどの常駐アプリを1つずつ終了して、起動できるか確認する',
          '保護機能を有効に保つ。GameGuardやHELLDIVERS 2の公式ファイルが検出された場合は、検出名と対象ファイルを記録し、除外や隔離からの復元を行う前に提供元かArrowheadに相談する。フォルダ全体を一律に除外しない',
          'Arrowheadは古いHDDの影響にも言及しています。通電中に内部ドライブを外さないでください。対象のドライブや必要なデータの有無が分からない場合は、変更前にPCメーカーや技術者に相談してください',
        ],
        note: '原因のアプリが分かった場合、Arrowheadはアプリ名を報告するよう案内しています。',
      },
    ],
    avoid: [
      '起動させるためだけに保護機能を停止したり、除外を追加したりしない',
      '改変ツール・チートツールを使わない（アンチチートが反応する）',
    ],
    cautions: [
      '上の手順で直らない場合は、Arrowheadのサポートに問い合わせてください。',
    ],
    faqs: [
      {
        question:
          'Windows Defenderしか使っていませんが、例外設定は必要ですか？',
        answer:
          '自動的に追加する必要はありません。Arrowheadは除外設定にも言及していますが、リアルタイムの検査対象外になるリスクがあります。公式ファイルへの検出かを確認し、保護を有効にしたまま提供元かArrowheadに相談してください。',
      },
      {
        question: 'GameGuardを入れ直すとセーブは消えますか？',
        answer:
          'GameGuardのアンインストール・再インストールは、ゲームのフォルダ内にあるアンチチートだけを入れ直す手順で、公式の手順にセーブデータの削除は含まれていません。',
      },
    ],
    sources: [
      {
        label:
          'Microsoft：Windowsセキュリティのウイルスと脅威の防止（除外の注意）',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label:
          'Arrowhead公式サポート：I receive Error 114 when attempting to launch HELLDIVERS 2',
        url: 'https://arrowhead.zendesk.com/hc/en-us/articles/14732747845020-I-receive-Error-114-when-attempting-to-launch-HELLDIVERS-2',
      },
      {
        label: 'Steamストア：HELLDIVERS 2',
        url: 'https://store.steampowered.com/app/553850/',
      },
    ],
    related: [],
    metaDescription:
      'ヘルダイバー2（HELLDIVERS 2）でGameGuardのエラー114が出て起動しない時の直し方。Arrowheadの案内を基に、管理者・互換モード、GameGuardの再インストール、常駐ツールと保護履歴の確認を解説。',
  }),
  make({
    gameSlug: 'hogwarts-legacy',
    slug: 'crash',
    category: 'launch',
    seoTitle:
      'ホグワーツ・レガシーが落ちる・クラッシュする時の対処法【PC・Steam版】',
    title:
      'ホグワーツ・レガシーが起動しない・クラッシュする時の対処法｜公式サポートの手順【PC・Steam版】',
    shortTitle: '起動しない・クラッシュ',
    targetVersion: 'Steam版（Windows）',
    symptom:
      '起動直後やプレイ中にデスクトップへ戻る、読み込み中に止まる場合の、WB Games（Portkey Games）公式サポートの手順です。',
    conclusion:
      '公式サポートは、①GPU・サウンドドライバーの更新、②Windows Update（DirectXの更新）、③オーバークロックを定格に戻す、④ゲームファイルの確認、⑤グラフィック設定を下げる、⑥セキュリティソフトと不要なアプリの確認、を案内しています。公式は除外設定にも言及していますが、本記事では保護機能を有効に保ち、検出内容を提供元に相談する手順にしています。Engine.iniを編集したりMODを入れたりしている場合は、先に元に戻して確認します。',
    description:
      '最低動作環境を満たしていても、高い画質設定は安定性に影響する場合があると公式は説明しています。落ちる場合はグラフィック設定を下げて比べます。',
    causes: [
      'GPU・サウンドドライバーが古い、または破損している',
      'Windows（DirectX）が更新されていない',
      'オーバークロック・ターボブースト',
      'ゲームファイルの破損',
      '画質設定が高すぎる',
      'セキュリティソフトによるファイルの隔離',
      'Engine.iniの編集やMOD',
    ],
    quickFacts: [
      {
        label: 'セーブの場所',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\SaveGames`,
        copy: true,
      },
      {
        label: '設定ファイルの場所',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor`,
        copy: true,
      },
      {
        label: 'DirectXの更新',
        value: 'Windows Updateで行う（公式）',
      },
      {
        label: '直らない時',
        value: '公式のバグ報告サイトで同じ報告を探して投票・追記',
      },
    ],
    diagnosis: [
      {
        symptom: 'Engine.iniを編集した・MODを入れた後から落ちる',
        cause: '設定ファイル・MOD',
        stepId: 'undo-changes',
      },
      {
        symptom: 'ドライバーやWindowsをしばらく更新していない',
        cause: 'ドライバー・DirectXが古い',
        stepId: 'drivers-windows',
      },
      {
        symptom: '起動はするが特定の場面で落ちる',
        cause: 'ファイル破損・画質設定',
        stepId: 'verify-settings',
      },
      {
        symptom: 'セキュリティソフトの通知が出た',
        cause: 'ゲームのファイルが隔離された',
        stepId: 'background-apps',
      },
    ],
    steps: [
      {
        id: 'undo-changes',
        title: 'Engine.iniの変更とMODを元に戻す',
        summary:
          '公式の手順は、ゲームを変更していない状態が前提です。先に元に戻して切り分けます。',
        time: '約5分',
        risk: 'low',
        actions: [
          String.raw`「%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor」を開き、Engine.iniを編集している場合は、編集前の状態に戻すか、編集したファイルを別の場所へ退避する`,
          'MODを入れている場合は、MODのファイルを別の場所へ移動する',
          'この状態で起動し、落ちるか確認する',
        ],
      },
      {
        id: 'drivers-windows',
        title: 'GPU・サウンドドライバーとWindowsを更新する',
        summary:
          'DirectXはWindows Updateで更新されます。ドライバーはメーカーの公式サイトから入れます。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'NVIDIA・AMD・Intel、またはPCメーカーのサイトから最新のGPUドライバーを入れる',
          'サウンドドライバーも、PC・マザーボードのメーカーのサイトで更新を確認する',
          '「設定」→「Windows Update」→「更新プログラムのチェック」で更新する',
          'CPU・GPUをオーバークロック（ターボブースト含む）している場合は、メーカーの定格に戻す（公式）',
        ],
      },
      {
        id: 'verify-settings',
        title: 'ゲームファイルを確認し、グラフィック設定を下げる',
        summary: 'ファイルの破損と、画質設定による負荷を順に切り分けます。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          verifySteam('Hogwarts Legacy'),
          'ゲーム内のグラフィック設定を低めのプリセットにして、同じ場面で落ちるか確認する',
          'それでも直らない場合は、アンインストールして再インストールする（セーブは別の場所に保存されているが、念のため先にコピーする）',
        ],
      },
      {
        id: 'background-apps',
        title: '保護履歴を確認し、不要なアプリを1つずつ閉じる',
        summary:
          'ファイルの隔離や、他のアプリとの干渉を確認します。クリーンブートは一時的な確認用です。',
        time: '約10分',
        risk: 'medium',
        actions: [
          '保護機能を有効にしたまま隔離履歴の検出名と対象ファイルを確認する。ゲームを起動させるためだけに隔離ファイルを復元したり、ゲームフォルダ全体を除外したりせず、セキュリティソフトの提供元かWB Gamesに相談する',
          'ゲームを起動する前に、不要なオーバーレイや監視ツールなど保護機能以外のアプリを1つずつ閉じて比較する',
          'それでも落ちる場合は、Microsoftの公式手順でクリーンブートを行って比べる。確認が終わったら必ず通常の起動に戻す',
        ],
        note: '公式は、クリーンブートの手順を誤るとPCの起動に影響する場合があるため、Microsoftの手順どおりに行うよう注意しています。',
      },
    ],
    avoid: [
      'セーブフォルダを削除しない。再インストール前にコピーしておく',
      'クリーンブートの状態のまま使い続けない',
    ],
    cautions: [
      '直らない場合、公式は「Hogwarts Legacy」のバグ報告サイトで同じ症状の報告を探し、投票やスクリーンショットの追加をするよう案内しています。',
    ],
    faqs: [
      {
        question: '最低動作環境を満たしているのに落ちます。',
        answer:
          '公式サポートは、動作環境を満たしていても、画質を上げる設定は性能と安定性に影響する場合があると説明しています。グラフィック設定を下げて比べてください。',
      },
      {
        question: 'DirectXはどうやって更新しますか？',
        answer:
          'DirectXはWindows Updateで更新されます。「設定」→「Windows Update」→「更新プログラムのチェック」から更新してください。',
      },
    ],
    sources: [
      {
        label:
          'Microsoft：Windowsセキュリティのウイルスと脅威の防止（除外の注意）',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label: 'Portkey Games公式サポート：PC Troubleshooting (Steam)',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/articles/10765467342099-PC-Troubleshooting-Steam',
      },
      {
        label: 'Portkey Games公式サポート：Hogwarts Legacy',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/categories/360004524734-Hogwarts-Legacy',
      },
    ],
    related: [],
    metaDescription:
      'ホグワーツ・レガシーがPCで起動しない・クラッシュする時の対処法。WB Games公式サポートの手順（ドライバーとWindows Update、オーバークロック解除、ファイル確認、画質設定、セキュリティソフト）を解説。',
  }),
  make({
    gameSlug: 'gta-v-enhanced',
    slug: 'story-save-migration',
    category: 'save',
    seoTitle: 'GTA5 EnhancedにLegacyのストーリーセーブを移行する方法【PC版】',
    title:
      'GTA5 Enhancedにストーリーモードのセーブを移行する方法｜Legacy版からの引き継ぎ手順【PC版】',
    shortTitle: 'ストーリーセーブの移行',
    targetVersion: 'PC版（Steam・Rockstar Games Launcher・Epic）',
    symptom:
      'GTA V Legacyで進めたストーリーモードを、GTA V Enhancedで続けたい人向けです。Rockstar公式サポートの手順で解説します。',
    conclusion:
      'Legacy版のポーズメニュー「ゲーム」→「セーブデータをアップロード」（Upload Save Game）でRockstar Gamesにアップロードし、Enhanced版のランディングページ「ストーリー」タブ、またはポーズメニュー「ゲーム」→「セーブデータをダウンロード」で受け取ります。移行は1アカウントにつき1回だけで、ダウンロードした時点で確定します。',
    description:
      'アップロードしたセーブは90日間ダウンロードでき、ダウンロードするまでは何度でも上書きできます。PCから家庭用機、家庭用機からPCへの移行はできません（公式）。',
    causes: [
      'Rockstar GamesアカウントとSteamなどのPCプラットフォームのアカウントが連携されていない',
      'Enhanced版にすでにストーリーのセーブがある（ランディングページから受け取れない）',
      'アップロードから90日以上たった',
      'すでに一度ダウンロードしている（2回目の移行はできない）',
    ],
    quickFacts: [
      {
        label: '移行できる回数',
        value: '1アカウントにつき1回（ダウンロードした時点で確定）',
      },
      {
        label: 'アップロードの有効期限',
        value: '90日間（過ぎたら再アップロード）',
      },
      { label: '移行できる範囲', value: 'PC同士のみ。PC⇔家庭用機は不可' },
      {
        label: 'Enhanced版のセーブの場所',
        value: String.raw`%USERPROFILE%\Documents\Rockstar Games\GTAV Enhanced\Profiles`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: 'アップロードの項目が使えない・失敗する',
        cause: 'アカウントの連携',
        stepId: 'link-account',
      },
      {
        symptom: 'どのセーブを送るか決めたい',
        cause: 'アップロードできるのは1つだけ',
        stepId: 'upload-save',
      },
      {
        symptom: 'Enhanced版のランディングページに移行の案内が出ない',
        cause: 'Enhanced版にすでにセーブがある',
        stepId: 'download-save',
      },
    ],
    steps: [
      {
        id: 'link-account',
        title: 'Rockstar GamesアカウントとPCのアカウントの連携を確認する',
        summary:
          '移行は、サインインしているRockstar Gamesアカウントを通して行われます。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Legacy版とEnhanced版で、同じRockstar Gamesアカウントにサインインしているか確認する',
          'そのアカウントが、普段使っているPCプラットフォーム（Steamなど）のアカウントと連携されているか確認する',
        ],
        note: 'アカウントの停止・BANや、不正・不十分な進行状況のプロフィールは移行の対象外になる場合があります（公式）。',
      },
      {
        id: 'upload-save',
        title: 'Legacy版からセーブをアップロードする',
        summary:
          'アップロードできるのは1つだけです。移したいセーブを選びます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'PCでGTA V Legacyを起動し、ストーリーモードでポーズメニューを開く',
          '「ゲーム」→「セーブデータをアップロード」（英語表示：Game → Upload Save Game）を選ぶ',
          '移したいセーブを選び、確認画面で内容を確かめてアップロードする',
          '完了のメッセージが表示されるまで待つ',
        ],
        note: 'ダウンロードする前なら、別のセーブで何度でも上書きできます。アップロード後にLegacy版で進めた内容は、Enhanced版には同期されません。',
      },
      {
        id: 'download-save',
        title: 'Enhanced版でセーブをダウンロードする',
        summary:
          'ランディングページの「ストーリー」タブか、ポーズメニューから受け取ります。ダウンロードすると移行は完了です。',
        time: '約5分',
        risk: 'medium',
        actions: [
          'Enhanced版にまだストーリーのセーブがない場合：起動後のランディングページで「ストーリー」タブを選び、表示された確認画面でダウンロードする',
          'Enhanced版にすでにセーブがある場合：ストーリーモードでポーズメニューを開き、「ゲーム」→「セーブデータをダウンロード」（英語表示：Game → Download Save Game）→移したいセーブを選んでダウンロードする',
          'ダウンロードが終わると、自動でそのセーブが読み込まれる',
        ],
        note: 'ダウンロードした後は、そのアカウントでストーリーの移行はもうできません。ダウンロードする前に、アップロードしたセーブが正しいか確認してください。',
      },
    ],
    avoid: [
      '正しいセーブか確かめる前にEnhanced版でダウンロードしない（移行は1回だけ）',
      'アップロード後、90日を過ぎて放置しない',
    ],
    cautions: [
      'セーブの大きさやサーバーの混雑によって、移行に時間がかかる場合があります（公式）。',
      'ゲーム内の項目名は、表示言語やバージョンによって異なる場合があります。',
    ],
    faqs: [
      {
        question: 'PS5やXboxのストーリーのセーブをPCに移せますか？',
        answer:
          'できません。Rockstarの公式サポートによると、Legacy版からEnhanced版への移行はPC同士のみで、PCと家庭用機の間の移行には対応していません。',
      },
      {
        question: '移行したあと、Legacy版で進めた分も反映されますか？',
        answer:
          '反映されません。移行後にLegacy版で進めたストーリーの進行は、Enhanced版には同期されません（公式）。',
      },
      {
        question: 'アップロードしたセーブを変えたいです。',
        answer:
          'Enhanced版でダウンロードする前なら、Legacy版から別のセーブをアップロードし直して上書きできます。ダウンロードした後は変更できません。',
      },
    ],
    sources: [
      {
        label:
          'Rockstar Games公式サポート：Migrating your Story Mode Save from GTAV Legacy to GTAV Enhanced on PC',
        url: 'https://support.rockstargames.com/articles/mmRgMVfuQC3xNzXK4Cq9b/migrating-your-story-mode-save-from-grand-theft-auto-v-legacy-to-grand-theft',
      },
      {
        label: 'Rockstar Games公式サポート：Grand Theft Auto V',
        url: 'https://support.rockstargames.com/gta-v',
      },
    ],
    related: [],
    metaDescription:
      'GTA5 Legacy版のストーリーモードのセーブをEnhanced版に移行する方法。Rockstar公式の手順（アップロード→ダウンロード）、1回だけ・90日間・PC同士のみといった注意点を解説。',
  }),
  make({
    gameSlug: 'skyrim-special-edition',
    slug: 'skse-after-update',
    category: 'mods',
    seoTitle: 'スカイリムのアップデート後にSKSEが起動しない時の対処法【PC版】',
    title:
      'スカイリム（Skyrim SE・AE）のアップデート後にSKSEで起動しない・落ちる時の対処法【PC版】',
    shortTitle: 'アップデート後にSKSEが動かない',
    targetVersion: 'Steam版・GOG版（Windows）',
    symptom:
      'ゲーム本体の更新後に、SKSE（Skyrim Script Extender）経由で起動しない、起動直後に落ちる場合の確認手順です。',
    conclusion:
      'SKSEは、ゲーム本体のバージョンごとに対応するビルドが分かれています。本体が更新されたら、SKSE公式サイトで対応するビルドを入れ直します。公式サイトは、パッチ後に起動時に落ちる場合は「Data/SKSE/Plugins」のファイルを外して試すよう案内しています（プラグインを使うMODも更新が必要なため）。',
    description:
      'SKSE公式サイトは2026年8月14日に、Bethesdaが本体の更新を予告したとして注意を呼びかけています。2026年9月29日時点で、Steam版向けのAnniversary Editionビルドは2.3.1（本体1.7.104）、GOG版向けは2.2.6（本体1.6.1179）です。',
    causes: [
      '本体の更新後、SKSEが古いバージョンのまま',
      'SKSEのプラグインを使うMOD（Data/SKSE/Plugins）が新しい本体に未対応',
      'Steam版とGOG版でSKSEのビルドを取り違えている',
      'Game Pass（Microsoft Store）版・Epic版を使っている（SKSEは非対応）',
    ],
    quickFacts: [
      {
        label: 'SKSEが対応する版',
        value: 'Steam版・GOG版（Game Pass・Epic版は非対応）',
      },
      {
        label: '本体の更新後に落ちる時',
        value: 'Data/SKSE/Pluginsのファイルを外して試す（SKSE公式）',
      },
      {
        label: '問い合わせに添えるログ',
        value:
          'skse.log・skse_loader.log・skse_steam_loader.log（マイドキュメントのMy Games内）',
      },
      {
        label: 'セーブの場所',
        value: String.raw`%USERPROFILE%\Documents\My Games\Skyrim Special Edition\Saves`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: 'SKSEからの起動でバージョンが合わないというメッセージが出る',
        cause: 'SKSEが本体の新しいバージョンに未対応',
        stepId: 'check-version',
      },
      {
        symptom: 'SKSEは新しいのに起動直後に落ちる',
        cause: 'SKSEプラグインを使うMODが未対応',
        stepId: 'plugins-off',
      },
      {
        symptom: 'SKSEなしでも起動しない',
        cause: '本体側の問題',
        stepId: 'vanilla-check',
      },
    ],
    steps: [
      {
        id: 'vanilla-check',
        title: 'SKSEを使わずにゲームが起動するか確認する',
        summary:
          'SKSE公式は、問い合わせの前にSKSEなしでゲームが正しく起動することを確認するよう案内しています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'セーブフォルダを別の場所へコピーしておく',
          '購入したストアの通常の起動方法で「The Elder Scrolls V: Skyrim Special Edition」を起動する（Steam版はSteam、GOG版はGOGの通常起動。SKSEのローダーは使わない）',
          'Steam版が起動しない場合は、' +
            verifySteam('The Elder Scrolls V: Skyrim Special Edition'),
        ],
        note: '整合性の確認は、MODで置き換えた本体のファイルも元に戻します。MOD管理ツールを使っている場合は、ツールの案内も確認してください。',
      },
      {
        id: 'check-version',
        title: '本体のバージョンに合ったSKSEを入れ直す',
        summary:
          'Steam版とGOG版では配布ビルドが異なり、それぞれ対応する本体バージョンが決まっています。ストアとバージョンの両方を合わせます。',
        time: '約10分',
        risk: 'low',
        actions: [
          'ゲームのフォルダ（Steamで右クリック→「管理」→「ローカルファイルを閲覧」）で「SkyrimSE.exe」を右クリック→「プロパティ」→「詳細」タブの「ファイル バージョン」を確認する',
          'SKSE公式サイト（skse.silverlock.org）で、そのバージョンに対応するビルドを確認する。Steam版はAnniversary Editionビルド、GOG版はGOG用のビルドを使う',
          '公式サイトの案内に従って、SKSEのファイルを入れ直す',
          'まだ対応ビルドが出ていない場合は、SKSEの更新を待つ',
        ],
        note: '公式ページで選んだSE/AE用ビルドの配布先と同梱手順に従ってください。7zファイルの展開には7-Zipを使えます。classic版の「Install via Steam」やインストーラーをSE/AE用と取り違えないでください。',
      },
      {
        id: 'plugins-off',
        title: 'SKSEプラグインを外して、対応するMODから戻す',
        summary:
          '本体の更新後は、SKSEのプラグインを使うMODも更新が必要な場合があります。',
        time: '約10分',
        risk: 'medium',
        actions: [
          'ゲームのフォルダの「Data\\SKSE\\Plugins」の中身を、別の場所へ移動する（MOD管理ツールの場合は、プラグインを含むMODを無効にする）',
          'SKSEのローダーから起動できるか確認する',
          '起動できたら、MODの配布ページで新しい本体に対応した版が出ているかを確認し、対応したものから1つずつ戻す',
        ],
      },
    ],
    avoid: [
      '古いセーブを上書きする前にバックアップを取る（MODを外した状態のセーブは戻せない場合がある）',
      '非公式の配布元からSKSEをダウンロードしない',
    ],
    cautions: [
      'SKSEチームに問い合わせる場合は、マイドキュメントの「My Games」内にあるSKSEフォルダの skse.log・skse_loader.log・skse_steam_loader.log を添えるよう公式が案内しています。',
      '本記事のバージョン番号は確認日時点のものです。最新の対応状況はSKSE公式サイトで確認してください。',
    ],
    faqs: [
      {
        question: 'Game Pass版やEpic版でSKSEは使えますか？',
        answer:
          'SKSE公式サイトによると、Windows Store／Game Pass版とEpic Games Store版には対応していません。',
      },
      {
        question: '本体を古いバージョンのまま使う方法はありますか？',
        answer:
          'SKSE公式サイトは、本体を古いバージョン（1.5.97）に戻した人向けのビルドも残していますが、通常はSteam最新版向けのAnniversary Editionビルドを使うよう案内しています。',
      },
    ],
    sources: [
      {
        label: 'SKSE公式サイト：Skyrim Script Extender (SKSE)',
        url: 'https://skse.silverlock.org/',
      },
      {
        label: 'Steamストア：The Elder Scrolls V: Skyrim Special Edition',
        url: 'https://store.steampowered.com/app/489830/',
      },
    ],
    related: [],
    metaDescription:
      'スカイリム（Skyrim SE・AE）の本体アップデート後にSKSEで起動しない・落ちる時の対処法。本体バージョンの確認方法、対応するSKSEビルドの入れ直し、SKSEプラグインの切り分けをSKSE公式の案内をもとに解説。',
  }),
  make({
    gameSlug: 'stardew-valley',
    slug: 'save-restore',
    category: 'save',
    seoTitle:
      'スターデューバレーのセーブが消えた・読み込めない時の復元方法【PC版】',
    title:
      'スターデューバレーのセーブデータの場所｜消えた・読み込めない時の復元方法【PC・Steam版】',
    shortTitle: 'セーブの場所・復元',
    targetVersion: 'Windows版（Steam・GOG）',
    symptom:
      'セーブデータの場所を知りたい、セーブが一覧から消えた、読み込めない、前の日に戻したい人向けです。',
    conclusion: String.raw`セーブは「%appdata%\StardewValley\Saves」の中の「農場名_数字」のフォルダです。消えた・読み込めない場合は、①ファイル名の「_STARDEWVALLEYSAVETMP」を外す、②最後のセーブを取り消す（_oldのファイルに戻す）、③SMAPIの自動バックアップから戻す、の順で確認します。作業前に必ずフォルダごとコピーしておきます。`,
    description:
      'ゲームは1日の終わり（寝た時・倒れた時・深夜2時）にセーブします。その日の途中で終了すると、その日の進行は保存されません（公式Wiki）。',
    causes: [
      'その日を終える前にゲームを終了した（仕様）',
      'セーブの途中でファイル名が一時的な名前のまま残った',
      'Steamクラウドが古いセーブで上書きした',
      'フォルダ名とファイル名が一致していない',
      '古いバージョンのゲームで新しいセーブを開こうとした',
    ],
    quickFacts: [
      {
        label: 'セーブの場所',
        value: String.raw`%appdata%\StardewValley\Saves`,
        copy: true,
      },
      {
        label: '必要なファイル',
        value:
          '「農場名_数字」のファイルとSaveGameInfoの2つ（フォルダごと扱う）',
      },
      {
        label: 'セーブされるタイミング',
        value: '1日の終わり（寝る・倒れる・深夜2時）',
      },
      {
        label: 'SMAPIのバックアップ',
        value: 'ゲームのフォルダの「save-backups」（最大10日分）',
      },
    ],
    diagnosis: [
      {
        symptom: 'ファイル名に「_STARDEWVALLEYSAVETMP」が付いている',
        cause: 'セーブ途中の一時的な名前のまま残った',
        stepId: 'tmp-name',
      },
      {
        symptom: 'ロードすると落ちる・前の日に戻したい',
        cause: '最後のセーブの不具合',
        stepId: 'undo-save',
      },
      {
        symptom: 'セーブのフォルダ自体が消えた（SMAPIを使っている）',
        cause: 'ファイルの削除・破損',
        stepId: 'smapi-backup',
      },
      {
        symptom: '進めたはずの日が戻っている',
        cause: 'Steamクラウドが古いセーブで上書きした',
        stepId: 'cloud-overwrite',
      },
    ],
    steps: [
      {
        id: 'open-backup',
        title: 'セーブフォルダを開いて、丸ごとバックアップする',
        summary: '復元の作業を始める前に、今の状態をコピーしておきます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームを終了する',
          String.raw`Windows＋Rキーを押し、「%appdata%\StardewValley\Saves」と入力して「OK」を押す`,
          '「農場名_数字」のフォルダを右クリックして圧縮（ZIP）し、デスクトップなど別の場所へ保存する',
        ],
        note: 'バックアップのフォルダをSavesフォルダの中に置かないでください。ゲームが読み込もうとして一覧に出てしまいます（公式Wiki）。',
      },
      {
        id: 'tmp-name',
        title: 'ファイル名の「_STARDEWVALLEYSAVETMP」を外す',
        summary: '公式Wikiが最初に挙げている復元方法です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'セーブのフォルダを開き、名前に「_STARDEWVALLEYSAVETMP」が付いたファイルがあるか確認する',
          'ある場合は、その部分を名前から削除してゲームを起動する',
          '起動するたびに名前が戻る場合は、Steamのライブラリで「Stardew Valley」の歯車アイコン→「プロパティ」→「一般」で、Steamクラウドの同期をオフにしてから、もう一度名前を直す',
          'フォルダ名と「農場名_数字」のファイル名が完全に一致しているかも確認する',
        ],
      },
      {
        id: 'undo-save',
        title: '最後のセーブを取り消す（_oldのファイルに戻す）',
        summary:
          'フォルダ内に「_old」の付いたファイルが2つあれば、1日前の状態に戻せます。',
        time: '約3分',
        risk: 'medium',
        actions: [
          'セーブのフォルダに「SaveGameInfo_old」と「農場名_数字_old」があるか確認する（ない場合はこの手順は使えない）',
          'ゲームを終了し、STEP 1のバックアップをSavesの外に保存できていることと、ZIPの中に元のファイルがあることを確認する',
          '作業対象の「SaveGameInfo」と「農場名_数字」（_oldが付いていない方）は削除せず、Savesの外の別フォルダへ退避する。退避先を控えておく',
          '「SaveGameInfo_old」と「農場名_数字_old」の名前から「_old」を外す。2つがそろわない、同名ファイルが既にある場合は上書きせず停止する',
          '読み込めない・違う日のデータだった場合はゲームを終了し、変更後のフォルダも別に保全してから、STEP 1で保存した元のフォルダへ戻す',
        ],
      },
      {
        id: 'smapi-backup',
        title: 'SMAPIの自動バックアップから戻す',
        summary:
          'MOD用のSMAPIを入れている場合、付属のSaveBackupが最大10日分のバックアップを作っています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームのフォルダ（Steamで右クリック→「管理」→「ローカルファイルを閲覧」）を開く',
          '「save-backups」フォルダを開き、セーブが入っている一番新しいZIPファイルを展開する',
          'ゲームを終了し、Savesに同名のフォルダがあれば先にSavesの外へ退避してから、展開したセーブのフォルダをコピーする。ZIPと元のフォルダは残しておく',
        ],
      },
      {
        id: 'cloud-overwrite',
        title: 'Steamクラウドの上書きが疑われる時は、両方の版を保全する',
        summary:
          '進行が戻っただけではクラウドの上書きと断定できません。どの版を残すか分かるまで、起動や保存を繰り返さないでください。',
        time: '約3分',
        risk: 'medium',
        actions: [
          'ゲームを終了し、現在のセーブフォルダと手元のバックアップをそれぞれ別の場所へコピーする。元のファイルは削除しない',
          '農場名、ゲーム内の日付、更新日時、使用したゲームの版とMODを見比べる。更新日時だけで残す版を決めず、判断できなければ復元・同期を止める',
          '公式Wikiには起動中にフォルダを置き換える手順もあるが、唯一のセーブを失うおそれがあるため、本記事では初手として案内しない。下記の公式復旧ガイドやサポートへ、保全した版と発生状況を伝えて相談する',
        ],
        note: 'セーブの退避・復旧手順の安全上の注意を2026年10月3日に更新しました。ファイルの削除や上書きの前に、元の状態へ戻せるコピーを確認してください。',
      },
    ],
    avoid: [
      'バックアップを取る前に、ファイルの削除や名前の変更をしない',
      'バックアップのフォルダをSavesフォルダの中に置かない',
      'セーブ編集ツールを使わない（公式Wikiは、セーブを壊すことが多いと注意）',
    ],
    cautions: [
      'マルチプレイのセーブは、ホストのPCにだけ保存されます（公式Wiki）。',
      '古いバージョンのゲームでは、新しいバージョンで保存したセーブを読み込めません。',
    ],
    faqs: [
      {
        question: 'その日の途中でやめたら、進行が消えました。',
        answer:
          'スターデューバレーは、1日の終わり（寝た時・疲れて倒れた時・深夜2時に倒れた時）にだけセーブされます。その日の途中で終了すると、その日の進行は保存されません（公式Wiki）。',
      },
      {
        question: 'SteamとGOGの両方で持っています。セーブは別ですか？',
        answer:
          'PCでは、セーブはゲームとは別の場所に保存され、SteamとGOGなど異なるストアのゲームで共有されます（公式Wiki）。',
      },
      {
        question: 'MODを外したらセーブが読み込めません。',
        answer:
          '公式Wikiによると、使っていたMODによってはバニラで読み込めない場合があります。SMAPIを入れ直して1日プレイすると、SMAPIがセーブから追加コンテンツを取り除きます（持ち物に残っている追加アイテムはエラーアイテムになる場合があります）。',
      },
    ],
    sources: [
      {
        label: 'Stardew Valley公式Wiki：Saves（セーブの場所・復元）',
        url: 'https://stardewvalleywiki.com/Saves',
      },
      {
        label: 'Stardew Valley公式：セーブが消えた・壊れた時の復旧ガイド',
        url: 'https://www.stardewvalley.net/missing-corrupt-save-file-troubleshooting-guide/',
      },
      {
        label: 'Steamストア：Stardew Valley',
        url: 'https://store.steampowered.com/app/413150/',
      },
    ],
    related: [],
    metaDescription:
      'スターデューバレーのセーブデータの場所と、消えた・読み込めない時の復元方法。_STARDEWVALLEYSAVETMPの削除、_oldファイルでの取り消し、SMAPIのバックアップ、Steamクラウドの上書き対策を公式Wikiをもとに解説。',
  }),
];
