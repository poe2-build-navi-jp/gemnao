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
    related: ['xbox-pc-launch-button', 'loadout-not-saving', 'stats-not-showing'],
    metaDescription:
      'CoD MW4（Modern Warfare 4）がPCで起動しない・遊べない時の対処法。必須のTPM 2.0とセキュアブートの確認（tpm.msc・msinfo32）とBIOSでの有効化、MBR形式の場合、UACの確認、Activisionなど対象アカウントの電話番号認証まで公式の案内をもとに解説。',
  },
  {
    gameSlug: 'call-of-duty-modern-warfare-4',
    slug: 'crash',
    category: 'launch',
    seoTitle:
      'CoD MW4がPCで落ちる・クラッシュする時の対処法｜推奨ドライバーと既知の不具合',
    title:
      'CoD MW4（Modern Warfare 4）がPCで落ちる・クラッシュする・キャンペーンやDMZを起動できない時の対処法【PC版】',
    shortTitle: '落ちる・クラッシュ',
    checkedAt: '2026-10-23',
    status: 'verified',
    targetVersion:
      'Steam版・Battle.net版・XBOX on PC版。2026年10月23日（発売日）に公式サポートの本文を確認',
    symptom:
      'PC版で起動直後やマルチプレイ中に落ちる、フリーズする、XBOX on PC版でキャンペーンやDMZを起動するボタンが出ない場合の確認手順です。',
    conclusion:
      'Activision公式は、PCのクラッシュは起動時と公開マッチのマルチプレイ中に起きやすいと説明しています。まず公式の推奨ドライバー（NVIDIA 616.56、AMD 26.7.1、Intel 32.0.101.8974）に合わせ、録画ソフト・オーバーレイ・キー割り当てソフトを終了します。それでも落ちる場合は、公式が案内しているとおり、これらのソフトのアンインストールを試します。XBOX on PC版で起動ボタン自体がない場合は、クラッシュとは分けて専用記事の対象範囲と確認項目を見てください。',
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
        label: '推奨GPUドライバー（公式）',
        value: 'NVIDIA 616.56・AMD 26.7.1・Intel 32.0.101.8974',
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
        cause: '公式が調査中の既知の不具合',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'GPUドライバーを公式の推奨バージョンにする',
        summary:
          'Activision公式の動作環境ページに、Modern Warfare 4の推奨ドライバーが載っています。画面の不具合や落ちる場合は、まずこのバージョンに合わせます。',
        time: '約10分',
        risk: 'low',
        actions: [
          'NVIDIA：616.56（公式ページには、10月21日に対応ドライバーが公開されると記載）',
          'AMD：26.7.1',
          'Intel：32.0.101.8974',
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
        guideLink: { href: '/games/call-of-duty-modern-warfare-4/xbox-pc-launch-button', label: 'Xbox PC版の起動ボタンがない時の確認', description: '対象範囲と公式の確認項目を分けて確認します。' },
        title:
          'XBOX on PC版で起動ボタンが出ない時は、専用記事の確認項目を使う',
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
        title: '公式が調査中の不具合を確認する',
        summary:
          '以下の項目は10月23日更新の既知問題に掲載されています。一般的なPC設定変更で解消すると断定せず、各項目の案内と更新を確認します。',
        time: '約3分',
        risk: 'low',
        actions: [
          'マルチプレイでロードアウトを保存できない（全機種）',
          '戦績（Combat Record・リーダーボード）が表示されない（全機種）。表示だけの問題で、記録は続いている',
          'DMZでオペレーターのプレステージができない（全機種）。公式の回避策：アタッチメントのスロットが3つまでのレア武器（これまで4つ以上付けたことがないもの）を装備する',
          '載っていない不具合は、公式のバグ報告フォームから報告できる。PCのクラッシュは「Call of Duty PC Crash Report」で報告できる',
        ],
      },
    ],
    avoid: [
      '公式以外のサイトからドライバーや修正ツールを入れない',
      'チートと誤解されるおそれのある、ゲームの動作を書き換えるツールを使わない',
    ],
    cautions: [
      '推奨ドライバーと既知の不具合は、2026年10月23日に公式サポートで確認した内容です。今後のアップデートで変わるため、最新の情報は公式ページで確認してください。',
      '発売前のパッチノートでは、マルチプレイのサーバーのクラッシュや、DMZのクラッシュ（10月20日・21日）の修正が案内されています。ゲームは最新の状態にしてから試してください。',
    ],
    faqs: [
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
      sources.knownIssues,
      sources.retailSpecs,
      sources.launchPatch,
      sources.connecting,
    ],
    related: ['tpm-secure-boot', 'xbox-pc-launch-button', 'loadout-not-saving', 'stats-not-showing'],
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
      'CoD MW4（Modern Warfare 4）がPCで落ちる・クラッシュする・フリーズする時の対処法。公式の推奨GPUドライバー（NVIDIA 616.56・AMD 26.7.1・Intel 32.0.101.8974）、録画ソフト・オーバーレイの停止、XBOX on PC版で起動ボタンが出ない時の確認、公式が調査中の既知の不具合まで解説。',
    ogTitle: 'CoD MW4がPCで落ちる時の対処法',
    ogSteps: [
      '推奨ドライバーにする',
      '録画ソフト・オーバーレイを止める',
      '既知の不具合を確認',
    ],
  },
];

export const codMw4Articles: GameArticle[] = drafts.map((draft) => ({
  ...draft,
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
}));
