import type { GameArticle } from '@/lib/game-articles';

// Call of Duty: Modern Warfare 4（PC版）の個別記事。
// 2026-09-28にActivision公式サポート（TPM 2.0とセキュアブート・エディション）、
// Call of Duty公式ブログ（ベータ版のPC動作環境）、Steamストアで確認した内容だけを載せています。
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
  steam: {
    label:
      'Steamストア：Call of Duty: Modern Warfare 4（電話番号・TPM 2.0・セキュアブート）',
    url: 'https://store.steampowered.com/app/4435490/',
  },
  mbr2gpt: {
    label: 'Microsoft公式：MBR2GPT（MBRからGPTへの変換）',
    url: 'https://learn.microsoft.com/ja-jp/windows/deployment/mbr-to-gpt',
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
    checkedAt: '2026-09-28',
    status: 'verified',
    targetVersion:
      'Steam版・Battle.net版・XBOX on PC版（発売前）・2026年9月28日時点の公式情報',
    symptom:
      'PC版でセキュリティ要件を満たしていないという通知が出る、オンラインモードに入れない、TPM 2.0を有効にしたのに何度も確認が出る、電話番号を求められる場合の確認手順です。',
    conclusion:
      'PC版のModern Warfare 4は、TPM 2.0とセキュアブートの両方が必須です。ベータ版では、どちらかが無効だとオンラインモードを一切遊べませんでした。まずWindowsの「tpm.msc」と「msinfo32」で状態を確認し、無効ならBIOS（UEFI）で有効にします。Steam版は、Steamアカウントに携帯電話番号の登録も必要です。',
    description:
      'Windows 11のPCは、OSの要件として両方が有効になっていることが多いです。Windows 10のPCや、自作PCでBIOSの設定を変えたことがある場合は特に確認が必要です。BIOSの操作を誤るとPCが起動しなくなることがあるため、マザーボードやPCメーカーの公式手順も必ず確認してください。',
    causes: [
      'TPM 2.0が無効（Intel PTT・AMD fTPMがBIOSでオフ）',
      'セキュアブートが無効、またはBIOSの起動モードがレガシー（CSM）',
      'Windowsが入ったディスクがMBR形式（セキュアブートにはGPT形式が必要）',
      '初回起動時のユーザーアカウント制御（UAC）の確認で「いいえ」を選んだ',
      'マザーボードのファームウェアが古い（AMDの一部バージョンなど）',
      'Steamアカウントに携帯電話番号が登録されていない',
    ],
    quickFacts: [
      {
        label: 'PC版の必須条件',
        value: 'TPM 2.0とセキュアブートの両方（Activision公式）',
      },
      { label: 'TPMの確認', value: 'tpm.msc', copy: true },
      { label: 'セキュアブートの確認', value: 'msinfo32', copy: true },
      { label: '対応OS', value: 'Windows 10（22H2以降）またはWindows 11' },
      { label: 'Steam版', value: 'Steamアカウントに携帯電話番号の登録が必要' },
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
          'TPM 2.0には、Intelは第8世代以降（Intel PTT）、AMDはRyzen 2000シリーズ以降（AMD fTPM）のCPUが必要です。BIOSの画面や項目名はメーカーによって違います。',
        time: '約15分',
        risk: 'medium',
        actions: [
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
          '手順2と同じ方法でBIOS（UEFI）の画面を開く',
          '「Boot」タブなどで「Secure Boot」を「Enabled」にする（見つからない場合は、BIOSの検索機能やメーカーの手順を確認）',
          '保存して再起動し、msinfo32 で「セキュアブートの状態」が有効になったか確認する',
        ],
        note: '「Secure Boot」が選べない（灰色）場合は、起動モードがレガシー（CSM）のままです。手順4を確認してください。',
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
          'GPTなら、BIOSで起動モードを「UEFI」にし、CSMを無効にしてからセキュアブートを有効にする',
          'MBRの場合は、先に大切なデータをバックアップし、BitLockerなどの暗号化をオフにしてから、Microsoft公式のMBR2GPTの手順に沿って変換する',
        ],
        note: 'MBRからGPTへの変換には、Windows 10 バージョン1703以降、64bit、パーティションが3つ以下、デュアルブートでないことなどの条件があります（Activision公式）。自信がない場合はPCメーカーや専門の業者に相談してください。',
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
          '初回起動時に「CODBrokerInstaller.exe」や「enrollaik.exe」のUACの確認が出たら「はい」を選ぶ（「いいえ」を選ぶと遊べない）',
          'UACの画面が出ずに「authorization declined」と表示される場合は、「ユーザーアカウント制御設定の変更」で通知のスライダーを既定の位置以上にしてからゲームを再起動する',
          'tpm.msc の製造元の情報（Manufacturer Version）でバージョンを確認する。AMDで「3.＊.0.＊」の形のバージョンは非対応で、マザーボードのファームウェア（BIOS）の更新が必要',
          '「TCG Event Log」の失敗と表示される場合は、Windows Updateで最新にしてからPCを再起動する',
        ],
        note: 'Intelで「INTC 302.12.＊.＊」「INTC 303.12.＊.＊」の場合も、ファームウェアの更新が必要なことがあります。更新の有無はマザーボードやPCメーカーに確認してください。',
      },
      {
        id: 'step-6',
        title: 'Steamアカウントに携帯電話番号を登録する',
        summary:
          'Steamストアには、プレイにはSteamアカウントに携帯電話番号がリンクされている必要があると記載されています。Activisionアカウントへの電話番号の登録を求められる場合もあります。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Steamの右上のアカウント名→「アカウント詳細」を開き、電話番号を追加する',
          'ゲームで求められた場合は、Activisionアカウントにも携帯電話番号を登録する',
        ],
      },
    ],
    avoid: [
      '手順が分からないままBIOSの設定を次々に変えない（1項目ずつ変えて、そのたびに起動を確認する）',
      'バックアップを取らずにMBRからGPTへの変換をしない',
      'TPMやセキュアブートを回避するとうたう非公式ツールを使わない（不正対策の仕組みのため、アカウントの処分につながるおそれがある）',
    ],
    cautions: [
      'ここに載せた動作環境はベータ版のもので、製品版では変わる可能性があります（公式）。発売前に公式の最新情報も確認してください。',
      'BIOSの画面や項目名はメーカーによって違います。Activision公式サポートのページには、ASUS・MSI・GIGABYTE・ASRock・Dell・HP・Lenovoなどの公式手順へのリンクがあります。',
    ],
    faqs: [
      {
        question:
          'TPM 2.0とセキュアブートがないと、キャンペーンも遊べませんか？',
        answer:
          'Activision公式は、PC版のModern Warfare 4ではTPM 2.0とセキュアブートの両方が必須と案内しています。ベータ版では、要件を満たさないとオンラインモードを一切遊べませんでした。',
      },
      {
        question: 'Windows 10でも遊べますか？',
        answer:
          'Windows 10はバージョン22H2以降が必要です。そのうえでTPM 2.0とセキュアブートを有効にする必要があります（Activision公式）。推奨環境はWindows 11です。',
      },
      {
        question: '動作環境はどのくらいですか？',
        answer:
          'ベータ版の最低環境は、Ryzen 5 1600・Core i5-8400、メモリ12GB、GTX 970・GTX 1060・RX 470・Arc A580（VRAM 3GB）、SSD必須です。推奨はRyzen 5 3600・Core i7-8700、メモリ16GB、RTX 3060 Ti・RX 6700 XT・Arc B580（VRAM 8GB）です。製品版では変わる可能性があります。',
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
      sources.specs,
      sources.steam,
      sources.mbr2gpt,
    ],
    related: [],
    metaDescription:
      'CoD MW4（Modern Warfare 4）がPCで起動しない・遊べない時の対処法。必須のTPM 2.0とセキュアブートの確認（tpm.msc・msinfo32）とBIOSでの有効化、MBR形式の場合、UACの確認、Steamの電話番号登録までActivision公式の案内をもとに解説。',
  },
];

export const codMw4Articles: GameArticle[] = drafts.map((draft) => ({
  ...draft,
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
}));
