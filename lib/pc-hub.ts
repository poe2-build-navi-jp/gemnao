export const pcHub = {
  title: 'PCトラブルの対処法｜症状別に原因を切り分けるWindows 11ガイド',
  description:
    'PCトラブルは、Windowsを操作できるか・どこまで症状が出るかで対処が変わります。黒い画面、ネット接続、音・マイク、USB-C、更新エラーを症状別に確認。操作画面、結果別の次の行動、公式の相談先を案内します。',
  answer:
    'PCトラブルは、まず「Windowsを操作できるか」「PC全体か特定のアプリ・機器だけか」「更新や接続変更の直後か」を確認します。不審な遠隔操作が続く場合は先にネット接続を切ってください。それ以外で操作できる場合は作業を保存し、症状に合う設定や接続先を一つずつ比較してください。画面が映らない場合と、停止コードを伴って再起動する場合は確認先が異なります。下の表から、自分の症状に合う手順へ進めます。',
  checkedAt: '2026-09-30',
};

export const pcHubSources = [
  {
    label: 'Microsoft：Windowsの回復オプション',
    url: 'https://support.microsoft.com/ja-jp/windows/experience/backup-recovery/recovery-options-in-windows',
  },
  {
    label: 'Microsoft：空白・黒い画面の対処',
    url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/troubleshooting-blank-screens-in-windows',
  },
  {
    label: 'Microsoft：予期しない再起動・停止コード',
    url: 'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors',
  },
  {
    label: 'Microsoft：Windowsのパフォーマンスを改善する',
    url: 'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows',
  },
  {
    label: 'Microsoft：スタートアップ修復',
    url: 'https://support.microsoft.com/ja-jp/windows/experience/startup-boot/startup-repair',
  },
];

export const pcHubRows = [
  {
    symptom: 'PCが壊れた？電源・画面・起動のどこで止まるか不明',
    check:
      '危険な異常の有無、電源ランプ、ロゴ、Windowsの順に確認。初期化よりデータ保全を優先',
    href: '/pc/pc-broken',
    label: '故障の確認と修理に出す目安',
  },
  {
    symptom: 'PCが乗っ取られた疑い／勝手な操作・不審なログイン',
    check:
      '不審な遠隔操作があればネットを切り、安全な別端末からアカウントを保護。重いだけ・偽警告だけの場合と区別',
    href: '/pc/pc-hacked-signs',
    label: '乗っ取りの兆候と最初の対処を確認する',
  },
  {
    symptom: 'Windowsが起動しない／再起動を繰り返す',
    check:
      '電源ランプ・メーカーのロゴ・Windowsの画面のどこまで進むか記録。電源が入らない場合はPCメーカーへ',
    href: pcHubSources[4].url,
    label: 'Windows起動失敗：Microsoftの修復案内',
  },
  {
    symptom: '黒い画面／カーソルだけ表示される',
    check:
      'Ctrl＋Alt＋Deleteで画面が出るか確認。停止コードが出る場合は次の行へ',
    href: '/pc/black-screen-after-sign-in',
    label: 'サインイン後の黒い画面を切り分ける',
  },
  {
    symptom: '停止コードが出て再起動する',
    check: '画面の色ではなく停止コード・発生時刻・直前の機器や更新の変更を記録',
    href: pcHubSources[2].url,
    label: '停止コード：Microsoftの確認手順',
  },
  {
    symptom: 'PCが重い／一つのアプリが固まる',
    check:
      '他のアプリも遅いか比較。タスクマネージャーでCPU・メモリ・ディスクを見る',
    href: '#pc-performance',
    label: '使用率と操作の重さを照合する',
  },
  {
    symptom: 'Wi-Fiがない／接続済みでもネットが使えない',
    check: 'Wi-Fi項目の有無、自分のPCと別端末、複数サイトの結果を比較',
    href: '#pc-network',
    label: 'Wi-Fi・インターネットの症状を選ぶ',
  },
  {
    symptom: '音が出ない／マイクが使えない',
    check: 'Windowsの出力・入力テストと、症状が出るアプリの結果を比較',
    href: '#pc-audio',
    label: '音声・通話の症状を選ぶ',
  },
  {
    symptom: 'USB-C機器／2台目のモニターが使えない',
    check: 'ハブ経由か直結かを比較。ケーブルとポートの対応機能も確認',
    href: '#pc-devices',
    label: '機器の認識・画面表示を調べる',
  },
  {
    symptom: '更新エラー／更新後だけ不調になる',
    check: 'Windows Updateの更新履歴で、KB番号・失敗日・エラーコードを控える',
    href: '#pc-update',
    label: '更新後の症状に合う記事を選ぶ',
  },
];

export const pcHubGroups = [
  {
    id: 'pc-hardware',
    title: '壊れた？故障の確認・修理',
    intro:
      '電源無反応・画面が映らない・Windows起動失敗を分け、データ保全と点検の目安を確認します。',
    slugs: ['pc-broken'],
  },
  {
    id: 'pc-security',
    title: '乗っ取りの疑い・セキュリティ',
    intro:
      '勝手な操作、アカウント侵害、偽警告を分け、確認より先に切断が必要な場合を案内します。',
    slugs: ['pc-hacked-signs'],
  },
  {
    id: 'pc-network',
    title: 'Wi-Fi・インターネット接続',
    intro: 'Wi-Fiの項目がない場合と、接続済みでも通信できない場合を分けます。',
    slugs: ['wifi-option-missing', 'wifi-connected-no-internet'],
  },
  {
    id: 'pc-audio',
    title: '音が出ない・マイク・通話',
    intro:
      'Windows全体の無音、特定アプリの無音、通話を始めた時だけの変化から選びます。',
    slugs: [
      'audio-after-update',
      'microphone-after-update',
      'bluetooth-connected-no-sound',
      'call-starts-audio-disappears',
    ],
  },
  {
    id: 'pc-devices',
    title: 'USB-C機器・モニター・画面',
    intro:
      '機器が一覧にない場合と、認識されても使えない場合で確認する場所が異なります。',
    slugs: [
      'usb-c-device-not-recognized',
      'second-monitor-not-detected',
      'black-screen-after-sign-in',
      'refresh-rate-stuck-60hz',
    ],
  },
  {
    id: 'pc-update',
    title: 'Windows Update・スリープ・エクスプローラー',
    intro: 'エラー番号や発生する操作を確認して、該当する手順へ進みます。',
    slugs: [
      'windows-update-0x800f081f',
      'sleep-wakes-up-by-itself',
      'file-explorer-freezes-on-right-click',
    ],
  },
  {
    id: 'pc-keys',
    title: '困った時に使えるショートカット',
    intro:
      '設定画面やタスクマネージャーを開くキーと、使える条件を確認できます。',
    slugs: ['gaming-shortcut-keys'],
  },
];

export const pcHubFaqs = [
  {
    question: 'PCトラブルは、何から確認すればよいですか？',
    answer:
      'Windowsを操作できるかを最初に確認します。操作できるなら、PC全体・特定アプリ・特定機器のどこまで症状が出るかを比較し、エラー文と直前の変更を記録します。起動しない場合は、電源・ロゴ・Windowsのどこで止まるかを分けてください。',
  },
  {
    question: 'PCを再起動すればトラブルは直りますか？',
    answer:
      '一時的な不調が改善することはありますが、原因までは分かりません。作業とエラー表示を保存して再起動し、同じ操作で再発するか確かめます。同じ症状が続く場合は、再起動を繰り返すより、症状別の確認表から次の手順を選んでください。',
  },
  {
    question: 'Windowsの初期化や再インストールは最初に必要ですか？',
    answer:
      '最初から初期化する必要はありません。出力先・接続・権限などを確認し、問題の範囲に合う手順から進めます。回復を検討する場合は重要なファイルをバックアップし、選ぶ方法で削除されるデータやアプリをMicrosoftの案内で確認してください。',
  },
  {
    question: '自分で直すのをやめて、修理や相談へ進む目安は？',
    answer:
      '電源が入らない、異臭・煙・バッテリーの膨らみがある場合は、設定変更を続けずメーカーへ相談してください。Windowsの起動失敗や停止コードが繰り返す場合も、発生条件と試した結果を整理して相談します。会社や学校の管理PCは管理担当者に連絡してください。',
  },
];
