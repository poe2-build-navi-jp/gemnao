import type { CommonGuide } from '@/lib/common-guides';

// 新作PCゲームで「起動できない」原因になりやすい必須条件の共通ガイド。
// 2026-09-28にMicrosoft公式サポート・Activision公式サポート・AMD公式の製品情報・
// 各ゲームの公式動作環境で確認した内容だけを載せています。

const msTpm = {
  label: 'Microsoft公式：PCでTPM 2.0を有効にする',
  url: 'https://support.microsoft.com/ja-jp/windows/security/devicesecurity/enable-tpm-2-0-on-your-pc',
};
const msSecureBoot = {
  label: 'Microsoft公式：Windows 11とセキュアブート',
  url: 'https://support.microsoft.com/ja-jp/windows/security/devicesecurity/windows-11-and-secure-boot',
};
const msHealthCheck = {
  label: 'Microsoft公式：PC正常性チェックアプリの使用方法',
  url: 'https://support.microsoft.com/ja-jp/windows/experience/compatibility/how-to-use-the-pc-health-check-app',
};
const activisionTpm = {
  label: 'Activision公式：Call of DutyのためのTPM 2.0とセキュアブート（英語）',
  url: 'https://support.activision.com/articles/trusted-platform-module-and-secure-boot',
};
const msMbr2gpt = {
  label: 'Microsoft公式：MBR2GPTの前提条件・BitLocker・変換後の注意（安全上の注意：2026-10-03確認）',
  url: 'https://learn.microsoft.com/ja-jp/windows/deployment/mbr-to-gpt',
};
const roundup = {
  label: 'ゲムなお：2026年10月発売の新作PCゲーム 動作環境まとめ',
  url: 'https://gemnao.pages.dev/new-releases/2026-10',
};

export const tpmSecureBootGuide: CommonGuide = {
  slug: 'tpm-secure-boot',
  title:
    'ゲームでTPM 2.0・セキュアブートが必要と出た時の確認と有効化の方法【Windows】',
  shortTitle: 'TPM 2.0・セキュアブート',
  description:
    'PCゲームでTPM 2.0・セキュアブートが必要と表示された時の確認方法。tpm.msc・msinfo32で状態を調べ、変更前にディスク形式、バックアップ、暗号化の回復キー、メーカーの手順を確認します。',
  conclusion:
    'Windows + R で「tpm.msc」を開き、TPMの仕様バージョンが2.0か確認します。セキュアブートは「msinfo32」でBIOSモードと現在の状態を確認。無効でも、すぐに起動モードを切り替えないでください。先にディスク形式、バックアップ、暗号化の回復キー、PCメーカーの機種別手順を確認します。',
  checkedAt: '2026-09-28',
  status: 'verified',
  causes: [
    'TPMがUEFI（BIOS）で無効になっている（自作PC向けマザーボードは初期状態でオフのことが多い）',
    'TPMのバージョンが2.0ではない',
    'セキュアブートが無効、または起動モードがレガシー（CSM）',
    'Windowsが入ったディスクがMBR形式（セキュアブートにはGPTが必要）',
  ],
  steps: [
    {
      title: 'Windowsで今の状態を確認する',
      actions: [
        'Windows + R を押して「tpm.msc」と入力し、OKを押す。TPMを使用する準備ができている旨の表示と、「TPM製造元情報」の仕様バージョンが2.0かを確認する。「互換性のあるTPMが見つかりません」と出たらTPMが無効の可能性がある',
        'Windows + R を押して「msinfo32」と入力し、「BIOSモード」がUEFIか、「セキュアブートの状態」が有効（英語表示ではOn）かを確認する',
        'Windows 11のPCは、OSの要件として両方が有効になっていることが多い',
      ],
    },
    {
      title: 'UEFI（BIOS）の設定画面を開く',
      actions: [
        '大切なデータをバックアップし、BitLocker・デバイスの暗号化を使っている場合は回復キーを確認する。機種別の公式手順や回復キーが不明なら、変更せずPCメーカー・管理者に相談する。TPMの「クリア」は選ばない',
        'Windows 11：「設定」→「システム」→「回復」→「PCの起動をカスタマイズする」の「今すぐ再起動」を選ぶ',
        '再起動後の画面で「トラブルシューティング」→「詳細オプション」→「UEFIファームウェアの設定」→「再起動」を選ぶ',
        '作業中のファイルは先に保存しておく。画面や項目名はPC・マザーボードのメーカーで異なる',
      ],
    },
    {
      title: 'TPMを有効にする',
      actions: [
        '「Advanced」「Security」「Trusted Computing」などのメニューを探す（Microsoft公式による例）',
        '「Intel PTT」「Intel Platform Trust Technology」「AMD fTPM switch」「AMD PSP fTPM」「Security Device Support」「TPM State」などの項目を有効にする',
        '保存して再起動し（多くはF10）、tpm.msc で仕様バージョン2.0になったか確認する',
      ],
    },
    {
      title: 'セキュアブートを有効にする',
      actions: [
        '設定変更前に「ディスクの管理」でWindowsが入ったディスク番号を右クリック→「プロパティ」→「ボリューム」からパーティションのスタイルを確認する。MBRまたは不明なら、CSMを無効にしたりUEFIに切り替えたりせず、メーカーに相談する',
        'UEFI・GPTを確認でき、機種別の手順と復旧方法を用意できた場合に限り、メーカーの手順でSecure Bootを有効にする。現在の設定を先に記録し、再起動後にmsinfo32で確認する。項目が選べない場合は推測でキーを削除しない',
        'MBRからGPTへの変換が必要な環境では、Microsoft公式のMBR2GPTの前提条件をメーカー・管理者と確認する。変換は元へ戻す機能がなく、暗号化の保護や起動設定にも対応が必要。バックアップと回復キーなしで進めたり、暗号化を一律に解除したりしない',
      ],
    },
    {
      title: '有効にしたのにゲームで要件を満たさないと出る場合',
      actions: [
        'ゲームの初回起動時に出るユーザーアカウント制御（UAC）の確認で「はい」を選ぶ（CoDでは「いいえ」を選ぶと遊べない）',
        'Windows Updateで最新の状態にしてから再起動する',
        'マザーボードのファームウェア（BIOS）が古いと認識されないことがある。Activisionは、AMDの一部のファームウェア（バージョン3.＊.0.＊）は非対応で更新が必要と案内している。更新はPC・マザーボードメーカーの手順に従う',
      ],
    },
  ],
  faqs: [
    {
      question:
        'TPMやセキュアブートを有効にすると、ほかのゲームに影響しますか？',
      answer:
        '通常のゲームの動作には影響しません。ただし、起動モードをレガシーからUEFIに切り替えると、MBR形式のディスクのWindowsは起動しなくなるため、先にディスクの形式を確認してください。',
    },
    {
      question: 'どのゲームで必要ですか？',
      answer:
        '例として、Call of Duty: Modern Warfare 4のPC版はTPM 2.0とセキュアブートの両方が必須です（Activision公式）。必要かどうかは、各ゲームのSteamストアや公式サイトの動作環境に書かれています。',
    },
    {
      question: '自分で設定を変えるのが不安です。',
      answer:
        'Microsoft公式も、BIOSの操作に慣れていない場合はPCメーカーのサポート情報を確認するよう案内しています。メーカー製PCならサポート窓口、自作PCならマザーボードメーカーの手順を見ながら、1項目ずつ変更してください。',
    },
  ],
  related: [
    'steam-game-not-launching',
    'windows-11-required',
    'ray-tracing-gpu',
  ],
  sources: [msTpm, msSecureBoot, activisionTpm, msMbr2gpt],
};

export const windows11RequiredGuide: CommonGuide = {
  slug: 'windows-11-required',
  title:
    '動作環境が「Windows 11」のゲームをWindows 10で遊べる？確認方法とアップグレード前の注意',
  shortTitle: 'Windows 11が必要なゲーム',
  description:
    '2026年10月の新作では、エースコンバット8、真・三國無双2 Remastered、FFレゾナンスなど、動作環境の最低条件がWindows 11の作品が増えています。自分のWindowsのバージョンと、Windows 11にアップグレードできるかを確認する方法をまとめました。',
  conclusion:
    'Windows + R →「winver」でWindowsのバージョンを確認します。動作環境の最低条件がWindows 11のゲームは、Windows 10では公式にサポートされません。Windows 10のサポートは2025年10月14日に終了しており、Microsoftも移行を推奨しています。アップグレードできるかは「PC正常性チェック」アプリで確認できます。',
  checkedAt: '2026-09-28',
  status: 'verified',
  causes: [
    'Windows 10のまま遊んでいる（動作環境の最低条件を満たさない）',
    'TPM 2.0やセキュアブートが無効で、Windows 11にアップグレードできない',
    'Windows 10でもバージョンが古い（22H2以降を求めるゲームもある）',
  ],
  steps: [
    {
      title: 'Windowsのバージョンを確認する',
      actions: [
        'Windows + R を押して「winver」と入力し、Enterを押す',
        '「Windows 11」か「Windows 10」かと、バージョン（例：22H2）・ビルド番号を控える',
        'ゲームのSteamストアの「システム要件」で、最低・推奨のOSを確認する',
      ],
    },
    {
      title: 'Windows 11にアップグレードできるか確認する',
      actions: [
        'タスクバーの検索で「PC正常性チェック」を開き、「今すぐチェック」を選ぶ（未インストールなら aka.ms/GetPCHealthCheckApp から入手）',
        '要件を満たさない理由が表示されたら、その項目を確認する。TPM 2.0やセキュアブートが無効なだけなら、設定で有効にできる場合がある',
      ],
    },
    {
      title: 'アップグレードの前にセーブデータをバックアップする',
      actions: [
        'ゲームのセーブデータの場所を確認し、フォルダごと外付けドライブやクラウドにコピーする',
        'Steamクラウドに対応したゲームは、同期が終わっているか確認する',
      ],
    },
    {
      title: 'Windows 10のまま遊ぶ場合の注意',
      actions: [
        '最低条件がWindows 11のゲームは、Windows 10で起動しても公式のサポート対象外になる。不具合が出ても問い合わせで対応されない可能性がある',
        'Windows 10でも遊べるゲームは、バージョンの条件（例：22H2以降）を満たしているか確認し、Windows Updateで最新にする',
        '購入前に体験版がある作品は、体験版で動作を確かめる',
      ],
    },
  ],
  faqs: [
    {
      question: '2026年10月の新作で、Windows 11が必要なのはどれですか？',
      answer:
        '動作環境の表記上、エースコンバット8、真・三國無双2 Remastered、ドラゴンズドグマ2（ダークアリズン）、Castlevania: Belmont’s Curse、テイルズ オブ エターニア リマスター、FFレゾナンスなどはWindows 11と記載されています。一覧は「2026年10月発売の新作PCゲーム 動作環境まとめ」を見てください。',
    },
    {
      question: 'Windows 10のサポートはいつ終わりましたか？',
      answer:
        '2025年10月14日に終了しました。PCは引き続き動きますが、Windows Updateによる無料の更新やセキュリティ修正は提供されなくなっています（Microsoft公式）。',
    },
    {
      question: 'PC正常性チェックで「要件を満たしていない」と出ました。',
      answer:
        '表示された理由を確認してください。TPM 2.0やセキュアブートが無効なだけの場合は、UEFI（BIOS）で有効にすると要件を満たせることがあります。CPUが対象外の場合は、設定では解決できません。',
    },
  ],
  related: ['tpm-secure-boot', 'save-data-backup', 'steam-game-not-launching'],
  sources: [msHealthCheck, msTpm, msSecureBoot, roundup],
};

export const rayTracingGpuGuide: CommonGuide = {
  slug: 'ray-tracing-gpu',
  title:
    '「レイトレーシング対応GPUが必要」なゲームが起動しない｜自分のGPUが対応か確認する方法',
  shortTitle: 'レイトレーシング対応GPU',
  description:
    'エースコンバット8やGears of War: E-Dayのように、最低環境から「ハードウェアレイトレーシング対応GPU」を必須にするPCゲームがあります。非対応のGPUでは設定を下げても起動できないため、購入前に自分のGPUを確認する方法をまとめました。',
  conclusion:
    'タスクマネージャーの「パフォーマンス」→「GPU」でGPU名を確認します。NVIDIAはGeForce RTXシリーズ（RTX 20シリーズ以降）、AMDはRadeon RX 6000シリーズ以降が、ハードウェアのレイトレーシング機能を備えています。GTX 10／16シリーズやRadeon RX 5000シリーズ以前は非対応で、ゲーム側の設定では解決できません。',
  checkedAt: '2026-09-28',
  status: 'verified',
  causes: [
    'GPUがハードウェアレイトレーシングに対応していない（GTX 10／16シリーズ、RX 5000シリーズ以前など）',
    'ノートPCで、レイトレーシング非対応の内蔵GPUでゲームが動いている',
    'GPUドライバーが古い',
  ],
  steps: [
    {
      title: 'GPU名を確認する',
      actions: [
        'Ctrl + Shift + Esc でタスクマネージャーを開き、「パフォーマンス」→「GPU」を選ぶ',
        '右上に表示されるGPU名を控える。GPUが2つ（GPU 0とGPU 1）ある場合は、両方の名前を確認する',
      ],
    },
    {
      title: 'レイトレーシングに対応しているか判断する',
      actions: [
        'NVIDIA：GeForce RTX（RTX 20・30・40・50シリーズ）は対応。GeForce GTX（GTX 10・16シリーズなど）は非対応',
        'AMD：Radeon RX 6000シリーズ以降は対応（例：RX 6600の仕様には「レイ アクセラレータ」の数が記載されている）。RX 5000シリーズ以前は非対応',
        'ゲームの最低環境のGPUと比べ、対応していても性能が下回る場合は重くなる',
      ],
    },
    {
      title: 'ノートPCはゲームが使うGPUを確認する',
      actions: [
        'ゲームを起動したままタスクマネージャーの「プロセス」タブで、「GPUエンジン」列にどのGPUが使われているか見る（列がなければ見出しを右クリックして追加）',
        'Windowsの「設定」→「システム」→「ディスプレイ」→「グラフィック」で、ゲームを「高パフォーマンス」のGPUに設定する',
      ],
    },
    {
      title: '対応GPUなのに起動しない場合',
      actions: [
        'GPUドライバーを最新にする（NVIDIA App、AMD Software: Adrenalin Edition、Intelの公式サイト）',
        'ゲームの動作環境のほかの必須条件（Windows 11、SSD、TPM 2.0など）も確認する',
      ],
    },
  ],
  faqs: [
    {
      question: 'GTX 1660 SuperやGTX 1080 Tiでも起動できませんか？',
      answer:
        '最低環境で「ハードウェアレイトレーシング対応GPU」が必須のゲームは、GTXシリーズでは要件を満たしません。性能の高さに関係なく、ハードウェアのレイトレーシング機能がないためです。',
    },
    {
      question: 'ゲーム内でレイトレーシングをオフにすれば動きますか？',
      answer:
        'レイトレーシングを必須にしているゲームでは、オフにする設定がないか、オフにしても対応GPUが必要です。レイトレーシングが「推奨」や「任意」のゲームとは違うので、動作環境の表記を確認してください。',
    },
    {
      question:
        '2026年10月の新作で、レイトレーシング対応GPUが必須なのはどれですか？',
      answer:
        'エースコンバット8とGears of War: E-Dayです。一覧は「2026年10月発売の新作PCゲーム 動作環境まとめ」で確認できます。',
    },
  ],
  related: [
    'gpu-driver-update',
    'steam-game-not-launching',
    'windows-11-required',
  ],
  sources: [
    {
      label: 'AMD公式：Radeon RX 6600の仕様（レイ アクセラレータ）',
      url: 'https://www.amd.com/ja/products/graphics/desktops/radeon/6000-series/amd-radeon-rx-6600.html',
    },
    {
      label: 'エースコンバット8 公式サイト：STEAM版システム要件',
      url: 'https://enso-order.acecombat.jp/',
    },
    {
      label: 'Steamストア：Gears of War: E-Day（動作環境）',
      url: 'https://store.steampowered.com/app/3010850/',
    },
    roundup,
  ],
};
