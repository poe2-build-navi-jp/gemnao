import type { GameArticle } from '@/lib/game-articles';

// Call of Duty: Modern Warfare 4（PC版）の個別記事。
// 製品版PC要件・発売日・TPM案内を2026-10-18に公式本文と再照合。
// シェーダーの説明には従来の公式ブログを使用。
// STEPのidは解決報告（D1）の集計キーなので、公開後は変更しないでください。

const sources = {
  tpm: {
    label:
      'Activision公式サポート：Call of DutyのためのTPM 2.0とセキュアブート（英語）',
    url: 'https://support.activision.com/articles/trusted-platform-module-and-secure-boot',
  },
  editions: {
    label:
      'Activision公式サポート：Modern Warfare 4のエディション・発売日・注意事項（英語）',
    url: 'https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions',
  },
  specs: {
    label:
      'Call of Duty公式ブログ：ベータ版のPC動作環境・シェーダーの事前読み込み（英語）',
    url: 'https://www.callofduty.com/blog/2026/08/call-of-duty-modern-warfare-4-next-early-intel-pc-specs',
  },
  retailSpecs: {
    label: 'Activision公式：製品版PC動作環境（10月1日更新・10月18日確認）',
    url: 'https://support.activision.com/modern-warfare-4/articles/pc-system-requirements-for-modern-warfare-4',
  },
  steam: {
    label:
      'Steamストア：Call of Duty: Modern Warfare 4（電話番号・TPM 2.0・セキュアブート）',
    url: 'https://store.steampowered.com/app/4435490/',
  },
  mbr2gpt: {
    label: 'Microsoft公式：MBR2GPT（MBRからGPTへの変換）',
    url: 'https://learn.microsoft.com/ja-jp/windows/deployment/mbr-to-gpt',
  },
  crashes: {
    label:
      'Activision公式サポート：Modern Warfare 4のクラッシュ・フリーズ（英語・10月16日更新）',
    url: 'https://support.activision.com/modern-warfare-4/articles/crashes-or-game-freezes-in-modern-warfare-4',
  },
  knownIssues: {
    label:
      'Activision公式サポート：Modern Warfare 4の既知の不具合（英語・10月23日更新）',
    url: 'https://support.activision.com/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
  },
  launchPatch: {
    label: 'Call of Duty公式：Modern Warfare 4 発売時のパッチノート（英語）',
    url: 'https://www.callofduty.com/patchnotes/2026/10/call-of-duty-modern-warfare-4-launch-patch-notes',
  },
  connecting: {
    label: 'Activision公式サポート：Modern Warfare 4に接続できない時（英語）',
    url: 'https://support.activision.com/modern-warfare-4/articles/connecting-to-modern-warfare-4',
  },
};

const biosEntry =
  'Windows 11：「設定」→「システム」→「回復」→「PCの起動をカスタマイズする」の「今すぐ再起動」→「トラブルシューティング」→「詳細オプション」→「UEFIファームウェアの設定」';

const drafts: Omit<GameArticle, 'symptoms'>[] = [
  {
    gameSlug: 'call-of-duty-modern-warfare-4',
    slug: 'tpm-secure-boot',
    category: 'launch',
    seoTitle:
      'CoD MW4がPCで遊べない時の対処法｜TPM 2.0とセキュアブートの有効化',
    title:
      'CoD MW4（Modern Warfare 4）がPCで起動しない・遊べない時の対処法｜TPM 2.0とセキュアブートの有効化【PC版】',
    shortTitle: 'TPM 2.0・セキュアブート',
    checkedAt: '2026-10-18',
    status: 'verified',
    targetVersion:
      'Steam版・Battle.net版・XBOX on PC版。2026年10月18日確認：通常発売は10月23日、デジタル予約特典のキャンペーン早期アクセスは10月16日（PT）開始の案内',
    symptom:
      'PC版でセキュリティ要件を満たしていないという通知が出る、オンラインモードに入れない、TPM 2.0を有効にしたのに何度も確認が出る、電話番号を求められる場合の確認手順です。',
    conclusion:
      'PC版のModern Warfare 4は、TPM 2.0とセキュアブートの両方が必須です。要件を満たさない場合はオンラインモードにアクセスできないと公式が案内しています。まずWindowsの「tpm.msc」と「msinfo32」で状態を確認し、無効でも直ちにBIOSを変更せず、バックアップ・暗号化の回復キー・機種別の公式手順を確認してください。Activision公式では、Activisionアカウントに携帯電話番号の登録が必要な場合があると案内しています。利用ストアとゲーム画面で対象アカウントを確認してください。',
    description:
      'Windows 11の要件はセキュアブートに対応していることで、有効になっているとは限りません。Windowsの版だけで判断せず、現在の状態を確認してください。Windows 10のPCや、自作PCでBIOSの設定を変えたことがある場合は特に確認が必要です。BIOSの操作を誤るとPCが起動しなくなることがあるため、マザーボードやPCメーカーの公式手順も必ず確認してください。',
    causes: [
      'TPM 2.0が無効（Intel PTT・AMD fTPMがBIOSでオフ）',
      'セキュアブートが無効、またはBIOSの起動モードがレガシー（CSM）',
      'Windowsが入ったディスクがMBR形式（セキュアブートにはGPT形式が必要）',
      '初回起動時のユーザーアカウント制御（UAC）の確認で「いいえ」を選んだ',
      'マザーボードのファームウェアが古い（AMDの一部バージョンなど）',
      '画面で求められたアカウントの携帯電話番号認証が完了していない',
    ],
    quickFacts: [
      {
        label: 'PC版の必須条件',
        value: 'TPM 2.0とセキュアブートの両方（Activision公式）',
      },
      { label: 'TPMの確認', value: 'tpm.msc', copy: true },
      { label: 'セキュアブートの確認', value: 'msinfo32', copy: true },
      { label: '対応OS', value: 'Windows 10（22H2以降）またはWindows 11' },
      {
        label: '電話番号',
        value:
          'Activisionアカウントへの登録が必要な場合あり。利用ストアと画面の条件も確認',
      },
      {
        label: '発売日',
        value:
          '2026年10月23日（デジタル版の予約でキャンペーン早期アクセスは10月16日〈PT〉から）',
      },
    ],
    diagnosis: [
      {
        symptom: 'セキュリティ要件を満たしていないという通知が出る',
        cause: 'TPM 2.0・セキュアブートの状態',
        stepId: 'step-1',
      },
      {
        symptom: 'tpm.msc で「互換性のあるTPMが見つかりません」',
        cause: 'TPM 2.0が無効',
        stepId: 'step-2',
      },
      {
        symptom: 'msinfo32 でセキュアブートが無効（Off）',
        cause: 'セキュアブートが無効',
        stepId: 'step-3',
      },
      {
        symptom: 'BIOSモードがレガシー（Legacy）、ディスクがMBR',
        cause: '起動モード・ディスク形式',
        stepId: 'step-4',
      },
      {
        symptom: '有効にしたのに何度も確認が出る',
        cause: 'UAC・ファームウェア・Windows Update',
        stepId: 'step-5',
      },
      {
        symptom: '電話番号を求められる・購入や起動ができない',
        cause: '電話番号の未登録',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'TPM 2.0とセキュアブートの状態を確認する',
        summary:
          'まずWindowsの画面で現在の状態を確認します。Activision公式の「Secure Attestation Wizard」を使うと、要件を満たしているかをまとめて確認できます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Windows + R を押し、「tpm.msc」と入力してEnter。状態に「TPMは使用する準備ができています」（英語表示では「The TPM is ready for use」）と出ればTPMは有効',
          'Windows + R を押し、「msinfo32」と入力してEnter。「BIOSモード」が「UEFI」で、「セキュアブートの状態」が有効（英語表示では「On」）になっていれば有効',
          'Activision公式サポートのページから「Call of Duty Secure Attestation Wizard」をダウンロードし、zipを展開して「CODSecureAttestationWizard.exe」を実行する（問題があれば、どの設定を直すべきか表示される）',
        ],
      },
      {
        id: 'step-2',
        title: 'BIOS（UEFI）でTPM 2.0を有効にする',
        summary:
          'ActivisionのTPM案内はIntel PTT・AMD fTPMのCPU条件と、独立したTPMチップ（dTPM）にも言及しています。製品版の最低CPU表だけでTPM対応を判断せず、現在のTPM状態と機種別サポートを確認してください。BIOSの項目名はメーカーで異なります。',
        time: '約15分',
        risk: 'medium',
        actions: [
          '作業前に大切なデータをバックアップし、BitLocker・デバイスの暗号化を使っている場合は回復キーを確認する。回復キーや機種別の公式手順が分からなければ変更せず、PCメーカーまたは管理者へ相談する。TPMの「クリア」は選ばない',
          biosEntry,
          'Windows 10：「設定」→「更新とセキュリティ」→「回復」→「PCの起動をカスタマイズする」の「今すぐ再起動」から同じ手順で進む',
          '「Advanced」「Security」「Trusted Computing」などのメニューで、Intelは「Intel PTT」（または「Security Device Support」）、AMDは「AMD CPU fTPM」を有効にする',
          '保存して再起動し（多くはF10）、tpm.msc で有効になったか確認する',
        ],
        note: '項目の場所はマザーボードやPCメーカーで異なります。操作に自信がない場合は、メーカーの公式手順を見ながら進めてください。',
      },
      {
        id: 'step-3',
        title: 'BIOS（UEFI）でセキュアブートを有効にする',
        summary:
          'セキュアブートは、BIOSの起動モードがUEFIで、Windowsのディスクが GPT 形式の場合に有効にできます。',
        time: '約15分',
        risk: 'medium',
        actions: [
          'この手順へ直接来た場合も、先にmsinfo32でUEFI、「ディスクの管理」でWindowsのディスクがGPTであることを確認する。MBR・不明なら手順4へ。バックアップ・暗号化の回復キー・機種別の公式手順を用意できなければ設定を変更しない',
          '手順2と同じ方法でBIOS（UEFI）の画面を開く',
          '「Boot」タブなどで「Secure Boot」を「Enabled」にする（見つからない場合は、BIOSの検索機能やメーカーの手順を確認）',
          '保存して再起動し、msinfo32 で「セキュアブートの状態」が有効になったか確認する',
        ],
        note: '「Secure Boot」が選べない理由は機種や設定によって異なります。CSMや起動キーを推測で変更せず、手順4でディスク形式と機種別の公式案内を確認してください。',
      },
      {
        id: 'step-4',
        title: '起動モードがレガシー・ディスクがMBRの場合',
        summary:
          'BIOSモードがレガシー（Legacy）の場合は、起動モードをUEFIに変える必要があります。その前に、Windowsのディスクが GPT 形式か確認します。MBR形式の場合は変換が必要で、失敗するとWindowsが起動しなくなるおそれがあります。',
        time: '約30分',
        risk: 'high',
        actions: [
          'Windowsの検索で「ディスクの管理」を開き、Windowsが入ったディスクを右クリック→「プロパティ」→「ボリューム」タブで「パーティションのスタイル」を確認する',
          'GPTでも、起動設定はPC・マザーボードメーカーの機種別手順を確認してから変更する。現在の設定を記録し、回復キーとデータのバックアップを用意する。会社・学校のPCは管理者に相談する',
          'MBRならここで設定変更を止める。先にCSMを無効にしたりUEFIへ切り替えたりするとWindowsが起動しなくなるおそれがある。ディスク形式・PCの型番・暗号化の状態を控え、メーカーに変換への対応と復旧手順を確認する',
          'MicrosoftのMBR2GPTには、変換前の検証、UEFIへの対応、変換後の起動設定などの条件がある。BitLockerは「保護の中断」と復号を伴う「暗号化の解除」が異なり、公式には中断した暗号化ボリュームの変換と保護機構の再設定が案内されている。暗号化を一律に解除せず、回復キーを確保したうえでメーカー・管理者の手順に従う',
        ],
        note: '安全上の注意を2026年10月3日に再確認。MBR2GPTは実行後に元の形式へ戻す機能はありません。復旧方法・バックアップ・回復キーが分からない場合は実行しないでください。要件は下記のMicrosoft公式資料と機種別サポートで確認してください。',
      },
      {
        id: 'step-5',
        title:
          '有効にしたのに確認が出続ける時は、UAC・ファームウェア・Windows Updateを確認する',
        summary:
          '初回起動時に出るユーザーアカウント制御（UAC）の確認や、マザーボードのファームウェアが原因で、要件を満たしていないと判定されることがあります。',
        time: '約20分',
        risk: 'medium',
        actions: [
          '公式ランチャーから通常起動した時の「CODBrokerInstaller.exe」または「enrollaik.exe」のUACは、発行元と公式案内を確認してから許可する。不明な実行ファイルや突然の要求は許可しない',
          'UACの画面が出ずに「authorization declined」と表示される場合は、「ユーザーアカウント制御設定の変更」で通知のスライダーを既定の位置以上にしてからゲームを再起動する',
          'tpm.msc の製造元の情報（Manufacturer Version）でバージョンを確認する。AMDで「3.＊.0.＊」の形のバージョンは非対応で、マザーボードのファームウェア（BIOS）の更新が必要',
          '「TCG Event Log」の失敗と表示される場合は、Windows Updateで最新にしてからPCを再起動する',
        ],
        note: 'Intelで「INTC 302.12.＊.＊」「INTC 303.12.＊.＊」の場合も、ファームウェアの更新が必要なことがあります。更新の有無はマザーボードやPCメーカーに確認してください。',
      },
      {
        id: 'step-6',
        title: '電話番号を求められたアカウントを確認する',
        summary:
          'Activision公式は、PC版でActivisionアカウントに携帯電話番号の登録が必要な場合があると案内しています。Steamなど利用ストア側の条件も現在の表示で確認し、別のアカウントへ登録しただけで完了とは判断しないでください。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームの案内でActivisionアカウントの認証を求められた場合は、公式アカウント管理画面で携帯電話番号を登録・確認する',
          'Steam側の電話番号認証も求められる場合は、Steamのアカウント詳細で対象アカウントを確認し、表示される手順に従う',
        ],
      },
    ],
    avoid: [
      '手順が分からないままBIOSの設定を次々に変えない（1項目ずつ変えて、そのたびに起動を確認する）',
      'バックアップを取らずにMBRからGPTへの変換をしない',
      'TPMやセキュアブートを回避するとうたう非公式ツールを使わない（不正対策の仕組みのため、アカウントの処分につながるおそれがある）',
    ],
    cautions: [
      '動作環境は10月1日更新のActivision製品版PC要件を10月18日に確認した値です。発売時点の要件で、今後変更される場合があります。SSD空き115GBに加え、必須アップデート用の追加容量が必要になる場合があります。',
      'BIOSの画面や項目名はメーカーによって違います。Activision公式サポートのページには、ASUS・MSI・GIGABYTE・ASRock・Dell・HP・Lenovoなどの公式手順へのリンクがあります。',
    ],
    faqs: [
      {
        question:
          'TPM 2.0とセキュアブートがないと、キャンペーンも遊べませんか？',
        answer:
          'Activision公式は、PC版のModern Warfare 4ではTPM 2.0とセキュアブートの両方が必須と案内しています。要件を満たさない場合はオンラインモードにアクセスできないと案内しています。',
      },
      {
        question: 'Windows 10でも遊べますか？',
        answer:
          'Windows 10はバージョン22H2以降が必要です。そのうえでTPM 2.0とセキュアブートを有効にする必要があります（Activision公式）。推奨環境はWindows 11です。',
      },
      {
        question: '動作環境はどのくらいですか？',
        answer:
          '製品版の最低環境はRyzen 5 1400・Core i5-6600、メモリ8GB、GTX 970・GTX 1060・RX 470・Arc A580（VRAM 3GB）、SSD空き115GBです。推奨はRyzen 5 3600・Core i7-8700、メモリ16GB、RTX 3060 Ti・RX 6600 XT・Arc B580（VRAM 8GB）。推奨値はマルチプレイの高画質90fpsを対象とします。CPU要件を満たしてもTPM 2.0・セキュアブート対応は別に確認が必要です。',
      },
      {
        question: 'オフラインで遊べますか？',
        answer:
          'テクスチャをストリーミングで読み込む仕組みのため、マルチプレイ（プライベートマッチを含む）とDMZには常時インターネット接続が必要です（Activision公式）。',
      },
      {
        question: '初回起動に時間がかかります。',
        answer:
          'PC版はシェーダーを事前に準備する仕組みがあり、Steam版は初回起動時にシェーダーのコンパイルが行われます（公式ブログ）。途中で強制終了せずに待ってください。',
      },
    ],
    sources: [
      sources.tpm,
      sources.editions,
      sources.retailSpecs,
      sources.specs,
      sources.steam,
      sources.mbr2gpt,
      {
        label: 'Microsoft：Windows 11とセキュアブート（対応と有効状態の違い）',
        url: 'https://support.microsoft.com/ja-jp/windows/security/devicesecurity/windows-11-and-secure-boot',
      },
    ],
    related: [
      'xbox-pc-launch-button',
      'loadout-not-saving',
      'stats-not-showing',
    ],
    metaDescription:
      'CoD MW4（Modern Warfare 4）がPCで起動しない・遊べない時の対処法。必須のTPM 2.0とセキュアブートの確認（tpm.msc・msinfo32）とBIOSでの有効化、MBR形式の場合、UACの確認、Activisionなど対象アカウントの電話番号認証まで公式の案内をもとに解説。',
  },
  {
    gameSlug: 'call-of-duty-modern-warfare-4',
    slug: 'crash',
    category: 'launch',
    seoTitle: 'CoD MW4がPCで落ちる時の対処法｜Season 1更新後のSteamクラッシュ',
    title:
      'CoD MW4（Modern Warfare 4）がPCで落ちる・クラッシュする・キャンペーンやDMZを起動できない時の対処法【PC版】',
    shortTitle: '落ちる・クラッシュ',
    checkedAt: '2026-11-12',
    updatedAt: '2026-11-12',
    status: 'verified',
    targetVersion:
      'Steam版・Battle.net版・XBOX on PC版。Season 1のSteam起動クラッシュはSteam版が対象。2026年11月12日に既知問題・PC要件・Season 1パッチを照合',
    symptom:
      'PC版で起動直後やマルチプレイ中に落ちる、フリーズする、XBOX on PC版でキャンペーンやDMZを起動するボタンが出ない場合の確認手順です。',
    conclusion:
      'Season 1更新後にSteam版が起動時に落ちる場合は、まずゲームの更新完了を確認し、Steamでファイルの整合性を確認してください。11月7日の公式告知にこの症状が掲載され、11月10日にも安定性改善が案内されていますが、Steamの起動クラッシュが解消したとは断定できません。更新前から落ちる場合や他の配布元では、ドライバー・競合アプリ・動作環境を順に確認します。',
    description:
      'TPM 2.0やセキュアブートの要件を満たしていない場合は、落ちるのではなくオンラインモードに入れません。その場合は「TPM 2.0とセキュアブート」の記事を先に確認してください。この記事は、要件を満たしたうえで落ちる・止まる場合が対象です。',
    causes: [
      'GPUドライバーが公式の推奨バージョンと違う',
      '録画ソフト・オーバーレイ・キー割り当て（入力リマップ）ソフトとの競合（起動していなくても影響する場合がある）',
      'PCが動作環境を満たしていない（AVX命令に対応したIntel・AMDのCPUのみ対応、Intel ArcはResizable BARが必要）',
      'PCやノートPCの熱',
      'XBOX on PC版の起動ボタンがない別症状（専用記事で切り分け）',
    ],
    quickFacts: [
      {
        label: '更新後のSteam起動クラッシュ',
        value:
          '11月7日の公式告知に掲載。更新完了→整合性確認→同じ起動操作で比較。11月10日の安定性改善だけでは、この問題の解決を確認できません。',
      },
      {
        label: '確認の範囲',
        value:
          '公式資料の確認です。ゲムなおによる実機の起動試験・FPS測定は未実施です。',
      },
      {
        label: '再現条件を揃える',
        value:
          '配布元・ゲームのバージョン・落ちる画面・エラー全文を控える。変更は一度に一つにして、起動直後なら同じ起動操作、対戦中なら同じモードで比較する。',
      },
      {
        label: '修復後も同じ場面で落ちる時',
        value:
          '変更前後のドライバー版、停止したオーバーレイ名、再現した日時を控えてPC Crash Reportへ。ゲームが終了せず接続だけ切れる場合は、サーバーと回線の確認へ進む。',
      },
      {
        label: '推奨GPUドライバー（公式）',
        value: 'NVIDIA 616.56・AMD 26.7.1・Intel 32.0.101.9150',
      },
      {
        label: '落ちやすい場面（公式）',
        value: 'ゲームの起動時と、公開マッチのマルチプレイ中',
      },
      {
        label: 'CPUの条件',
        value: 'AVX命令に対応したIntel・AMDのCPUのみ',
      },
      {
        label: '空き容量',
        value: 'SSDに115GB以上（発売時点。アップデートで増える場合あり）',
      },
      {
        label: 'クラッシュの報告',
        value: '公式の「Call of Duty PC Crash Report」から送れる',
      },
    ],
    diagnosis: [
      {
        symptom: 'Season 1更新後からSteam版が起動時に落ちる',
        cause: '公式告知にあるSteam版の症状と照合',
        stepId: 'season-1-steam',
      },
      {
        symptom: '設定を変えた前後を比較したい',
        cause: '同じ条件で起動結果・再発を記録',
        stepId: 'compare-results',
      },
      {
        symptom: '起動直後やマッチ中に落ちる・固まる',
        cause: 'GPUドライバーのバージョン',
        stepId: 'step-1',
      },
      {
        symptom: '録画・配信・オーバーレイのソフトを使っている',
        cause: '他のソフトとの競合',
        stepId: 'step-2',
      },
      {
        symptom: '古いCPU・Intel Arc・ノートPCで落ちる',
        cause: '動作環境・熱',
        stepId: 'step-3',
      },
      {
        symptom: 'XBOX on PC版で起動ボタンがない',
        cause: '未導入コンテンツ・デバイス登録数の確認',
        stepId: 'step-4',
      },
      {
        symptom: 'オンラインにつながらない・切断される',
        cause: 'サーバーの状況・回線',
        stepId: 'step-5',
      },
      {
        symptom: 'ロードアウトが保存できない・戦績が表示されない',
        cause: '公式の解決済み項目と現在の症状を照合',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'season-1-steam',
        title: 'Season 1更新後のSteam版は、まず更新と整合性を確認する',
        summary:
          '11月7日のSeason 1パッチノートはSteam版の起動クラッシュを調査中とし、整合性確認を先に案内しています。',
        time: '約5〜15分（ダウンロードを除く）',
        risk: 'low',
        actions: [
          'Steam版かを確認し、Season 1更新の前後どちらから症状が出たか、ゲームの版・発生画面・エラーを控える。Xbox PCで起動ボタンがない場合は「XBOX on PC版で起動ボタンが出ない時」の手順へ',
          'ゲームの更新・ダウンロードを完了させ、Steamライブラリで対象のゲームを右クリック→「プロパティ」→「インストール済みファイル」→整合性を確認する',
          '再取得があれば完了を待ち、同じ起動操作でタイトル画面まで進むか比較する。再取得の有無と、起動できたかは別々に記録する',
          'まだ落ちる場合は、先に比較記録を残して公式のPC Crash Reportへ。11月10日の安定性改善を、この症状の修正完了とは扱わない',
        ],
        note: '公式には再インストールの最終回避策もありますが、削除対象を取り違えないでください。steamapps/common全体や他ゲームのフォルダは削除しません。バックアップ・対象のCall of Dutyフォルダ・復元方法を特定できなければ、削除へ進まず公式へ相談してください。',
        guideLink: {
          href: '/guide/verify-steam-files',
          label: 'Steamの整合性確認の詳しい手順',
          description: '再取得の有無と起動結果を分けて確認します。',
        },
      },
      {
        id: 'compare-results',
        title: '変更前後の起動結果とFPSを、同じ条件で記録する',
        summary:
          '以下は比較のための編集手順です。測定済みの結果ではありません。まず非破壊の整合性確認か、不要なアプリ1つの終了で比較します。',
        time: '約10〜20分',
        risk: 'low',
        actions: [
          '変更前にCPU・GPU・メモリ・Windows版・ドライバー版・配布元・ゲーム版を控える。設定画面を撮る場合は、アカウント名やチャットなどが写らないようにする',
          '解像度・画質・アップスケール・フレーム生成・FPS上限、同じモード・地点・視点・経路を揃える。更新で旧版に戻せない場合は「同一版での比較不可」と明記する',
          '変更は一度に1項目だけ。比較前後でタイトル到達の可否、何分後にどの画面で落ちたか、再試行回数と各回の結果を記録する。起動できない場合のFPSは0ではなく「未測定」にする',
          '起動できる場合だけ、同じ計測手段・同じ60秒の経路を前後それぞれ3回測る。FPSは測定方法と3回分の値を併記し、初回シェーダー処理中の値とは混ぜない。録画を使うなら前後とも同じ条件にする',
          '元の状態に戻せる変更なら戻して症状が再発するか確認する。未再発でも観察時間・試行回数を添え、「必ず直る」「原因確定」とは書かない。セキュリティやアンチチートは停止しない',
          'マイゲームでCoD MW4を追加し、「設定スナップショット」に前後の設定、「実験ログ」に実施日・変更項目・FPS・測定条件を残す。未測定欄は空欄にする。端末内保存で、自動公開や他端末同期はされない',
        ],
        guideLink: {
          href: '/my-games#my-game-call-of-duty-modern-warfare-4',
          label: 'マイゲームで比較を記録する',
          description:
            'ゲームを追加すると設定スナップショットと実験ログを使えます。',
        },
        note: '現在、掲載できるCoD MW4の実機比較データ・前後の実画面はありません。この記録手順を実機テストの成功実績として紹介しません。',
      },

      {
        id: 'step-1',
        title: 'GPUドライバーを公式の推奨バージョンにする',
        summary:
          'Activision公式の動作環境ページに、Modern Warfare 4の推奨ドライバーが載っています。画面の不具合や落ちる場合は、まずこのバージョンに合わせます。',
        time: '約10分',
        risk: 'low',
        actions: [
          'NVIDIA：616.56（11月5日更新の公式PC要件に掲載。自分のGPUの対応状況も確認）',
          'AMD：26.7.1',
          'Intel：32.0.101.9150',
          'ドライバーはNVIDIA・AMD・Intelの公式サイトか、各社の公式アプリから入手する',
          'Windowsも最新の状態にする（Windows Update）。試用版・ベータ版・Insider版のWindowsは対象外の場合がある',
        ],
      },
      {
        id: 'step-2',
        title: '録画ソフト・オーバーレイ・キー割り当てソフトを止める',
        summary:
          '公式は、入力のリマップソフト、オーバーレイ、録画ソフトなどが、起動していなくてもゲームの起動やプレイを妨げる場合があると案内しています。',
        time: '約10分',
        risk: 'low',
        actions: [
          '自分で開いた録画・オーバーレイ・キー割り当てなど、今回不要なアプリを通常の終了操作で1つずつ閉じて起動結果を比較する。保護機能や役割が分からない常駐処理は停止しない',
          'それでも落ちる場合は、録画ソフト・オーバーレイ・キー割り当てソフトのアンインストールを試す（公式の案内）',
        ],
        note: '公式はこれらのソフトについて「Call of Duty セキュリティ・不正対策ポリシー」もあわせて確認するよう案内しています。',
      },
      {
        id: 'step-3',
        title: '動作環境と、PCの熱を確認する',
        summary:
          '動作環境を満たしていない場合や、PCが熱を持っている場合も落ちることがあります。',
        time: '約10分',
        risk: 'low',
        actions: [
          'PCやノートPCは、涼しく風通しのよい場所に置く（公式の案内）',
          'CPUがAVX命令に対応したIntel・AMD製か確認する（それ以外は対象外）',
          'Intel ArcのGPUは、Resizable BAR（ReBAR）が有効になっているか確認する',
          '最低環境：Ryzen 5 1400・Core i5-6600、メモリ8GB、GTX 970・GTX 1060・RX 470・Arc A580（VRAM 3GB）、SSDの空き115GB',
        ],
        note: 'ノートPCは、同じ名前のGPUでも別のモデルで、対象外の場合があると公式が注意しています。',
      },
      {
        id: 'step-4',
        guideLink: {
          href: '/games/call-of-duty-modern-warfare-4/xbox-pc-launch-button',
          label: 'Xbox PC版の起動ボタンがない時の確認',
          description: '対象範囲と公式の確認項目を分けて確認します。',
        },
        title: 'XBOX on PC版で起動ボタンが出ない時は、専用記事の確認項目を使う',
        summary:
          'COD Homeの起動ボタンがない症状は、起動後のクラッシュとは分けて扱います。対象と確認項目は専用記事へ進んでください。',
        time: '約10分',
        risk: 'low',
        actions: [
          '未導入のMW4 Content Packsを確認する。番号を限定せず公式の現行案内と照合する',
          'Microsoft Storeのデバイス管理で、登録しているデバイスが上限の10台を超えていないか確認する',
        ],
      },
      {
        id: 'step-5',
        title: 'オンラインにつながらない時は、サーバーの状況と回線を確認する',
        summary:
          '落ちるのではなく接続できない・切断される場合は、まず公式のサーバー状況を確認します。',
        time: '約10分',
        risk: 'low',
        actions: [
          'Activision公式のModern Warfare 4サーバー状況のページで、PCの表示が緑か、お知らせが出ていないか確認する',
          'できればWi-Fiではなく有線LANでつなぐ（公式の推奨）',
          'ルーターを再起動し、動画や大きなダウンロードなど回線を多く使うものを止める',
          'それでもだめな場合は、ルーターの設定でUPnPを有効にする（ポート開放をしている場合はいったん無効にする）',
        ],
        note: '学校・会社などの共有ネットワークでは、管理者に相談してください。',
      },
      {
        id: 'step-6',
        title: '調査中と修正済みの項目を分けて確認する',
        summary:
          '11月6日更新の既知問題と、11月7日・10日のSeason 1パッチを11月12日に照合しました。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steam版のSeason 1更新後の起動クラッシュは、上の専用STEPへ。XBOX on PC版の起動ボタンがない症状は「起動ボタンが出ない時」の手順へ',
          'ロードアウトの保存、DMZオペレーターのプレステージ、Combat Recordの表示問題は、既知問題ページでは解決済みに移っています。以前の調査中情報だけで設定を変更しない',
          '同じ症状が残る場合は、現在の版・モード・発生画面を添えて改めて公式へ報告する。別の原因や再発の有無をこの記事だけで確定しない',
        ],
      },
    ],
    avoid: [
      '公式以外のサイトからドライバーや修正ツールを入れない',
      'チートと誤解されるおそれのある、ゲームの動作を書き換えるツールを使わない',
    ],
    cautions: [
      '推奨ドライバーは11月5日更新のPC要件、既知問題は11月6日更新、Season 1パッチは11月10日更新の本文を、2026年11月12日に照合しました。資料確認と実機検証は別です。案内は今後変わる場合があります。',
      '発売前のパッチノートでは、マルチプレイのサーバーのクラッシュや、DMZのクラッシュ（10月20日・21日）の修正が案内されています。ゲームは最新の状態にしてから試してください。',
    ],
    faqs: [
      {
        question: '11月10日の安定性改善でSteamの起動クラッシュは直りましたか？',
        answer:
          '公式は安定性改善を告知していますが、SteamのSeason 1起動クラッシュを修正完了とは明示していません。現在の版で起動結果を確認し、未再発なら観察時間と試行回数も残してください。',
      },
      {
        question: 'この記事のFPS改善値は実測ですか？',
        answer:
          'CoD MW4の実測値はまだ掲載していません。60秒・3回は比較の測定条件案で、改善率や成功率ではありません。起動できない状態はFPS未測定として記録します。',
      },
      {
        question: 'セキュリティ要件を満たしていないと表示されます。',
        answer:
          'PC版はTPM 2.0とセキュアブートの両方が必須です。「TPM 2.0とセキュアブート」の記事で確認してください。',
      },
      {
        question: 'キャンペーンを始めると落ちます。',
        answer:
          'まず推奨ドライバーと、録画ソフト・オーバーレイの停止を試してください。発売前のパッチで、キャンペーン「Counter Attack」のホテルの場面で進めなくなる問題が修正されています。ゲームを最新の状態にしてください。',
      },
      {
        question: '直らない場合はどこに連絡しますか？',
        answer:
          'Activision公式サポートのバグ報告フォーム、またはPCのクラッシュレポートから報告できます。',
      },
    ],
    sources: [
      sources.crashes,
      {
        ...sources.knownIssues,
        label: 'Activision：既知の問題（11月6日更新・11月12日確認／英語）',
      },
      {
        ...sources.retailSpecs,
        label: 'Activision：製品版PC要件（11月5日更新・11月12日確認／英語）',
      },
      {
        label:
          'Call of Duty：Season 1パッチノート（11月10日更新・11月12日確認／英語）',
        url: 'https://www.callofduty.com/patchnotes/2026/11/call-of-duty-modern-warfare-4-season-1-patch-notes',
      },
      sources.launchPatch,
      sources.connecting,
    ],
    related: [
      'dmz-prestige-trait-missing',
      'tpm-secure-boot',
      'xbox-pc-launch-button',
      'loadout-not-saving',
      'stats-not-showing',
    ],
    nextChecks: {
      heading: '症状別の確認へ',
      links: [
        {
          href: '/games/call-of-duty-modern-warfare-4/tpm-secure-boot',
          label: 'TPM 2.0とセキュアブートを確認する',
        },
      ],
    },
    metaDescription:
      'CoD MW4がPCで落ちる時の確認手順。Season 1更新後のSteam起動クラッシュ、整合性確認、公式推奨ドライバー、修正済みの問題を整理。変更前後の起動結果・FPSを同じ条件で記録する方法も解説します。',
    ogTitle: 'CoD MW4がPCで落ちる時の対処法',
    ogSteps: [
      'Season 1のSteam症状を確認',
      '更新完了・整合性を確認',
      '変更前後の結果を記録',
    ],
  },
];

export const codMw4Articles: GameArticle[] = drafts.map((draft) => ({
  ...draft,
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
}));
