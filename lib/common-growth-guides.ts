import type { CommonGuide } from '@/lib/common-guides';

const steamCloud = {
  label: 'Steamworks公式：Steam Cloud',
  url: 'https://partner.steamgames.com/doc/features/cloud',
};

const steamDiskCheck = {
  label: 'Steamサポート：PCのクラッシュ・ドライブ確認',
  url: 'https://help.steampowered.com/ja/faqs/view/6E58-B45E-9263-0B19',
};

const steamInterference = {
  label: 'Steamサポート：Steamと競合する可能性があるプログラム',
  url: 'https://help.steampowered.com/ja/faqs/view/1F39-DCB4-FF28-5748',
};

const windowsStopErrors = {
  label: 'Microsoft：予期しない再起動と停止コードのトラブルシューティング',
  url: 'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors',
};

const windowsAudio = {
  label: 'Microsoft：Windowsのサウンドまたはオーディオの問題を修正する',
  url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-sound-or-audio-problems-in-windows',
};

export const commonGrowthGuides: CommonGuide[] = [
  {
    slug: 'steam-cloud-sync-error',
    title: 'Steamクラウドに同期できない・同期エラーが出るときの対処法',
    shortTitle: 'Steamクラウド同期エラー',
    description:
      'Steamクラウドに同期できない、同期競合や「同期できません」と表示される場合に、セーブを失わない順番で切り分けます。',
    conclusion:
      'ゲームを起動せず、先にローカルのセーブデータを別の場所へコピーしてください。その後、Steam Cloudの有効状態、通信、同期競合に表示された更新日時を順に確認します。',
    checkedAt: '2026-09-19',
    steps: [
      {
        title: 'ゲームを起動せずセーブをバックアップする',
        actions: [
          '同期エラーが出ている間はゲームを起動せず、競合画面もすぐに確定しない',
          'ゲーム公式の保存先を確認し、セーブフォルダーをデスクトップ以外の別フォルダーへコピーする',
          '複数PCを使っている場合は、各PCのセーブ更新日時を記録する',
        ],
      },
      {
        title: 'Steam Cloudと通信状態を確認する',
        actions: [
          'Steamの「設定」→「クラウド」でSteam Cloudが有効か確認する',
          '対象ゲームの「プロパティ」→「一般」で、そのゲームのSteam Cloudが有効か確認する',
          'Steamを完全終了し、通信が安定した状態で再起動して同期表示を確認する',
          'ゲーム終了直後はアップロードが終わるまで待ち、Steamを強制終了しない',
        ],
      },
      {
        title: '同期競合では正しいセーブを更新日時で選ぶ',
        actions: [
          '競合画面にローカルとクラウドの候補が出たら、更新日時とプレイしたPCを確認する',
          '新しい方が常に正しいとは限らないため、バックアップしたファイルとゲーム内の進行状況を照合する',
          '選択後にゲームを起動し、正しいセーブを読み込めたことを確認してから再度終了する',
        ],
      },
      {
        title: 'ゲーム固有の保存先と対応状況を確認する',
        actions: [
          'Steamストアやゲーム公式サポートでSteam Cloud対応の有無を確認する',
          '別OS間やゲームの大型更新後だけ同期できない場合は、ゲーム公式の既知問題を確認する',
          'バックアップを残したまま、ゲーム公式サポートまたはSteamサポートへ状況を送る',
        ],
      },
    ],
    sources: [steamCloud],
    related: ['save-data-backup', 'uninstall-save-data', 'steam-disk-write-error'],
    status: 'verified',
    causes: [
      'Steam Cloudが全体またはゲーム単位で無効',
      'ゲーム終了後のアップロード未完了や通信エラー',
      '複数PC・複数OS間のセーブ競合',
      'ゲーム固有の保存先・Cloud設定の問題',
    ],
  },
  {
    slug: 'steam-disk-write-error',
    title: 'Steamの「ディスク書き込みエラー」を直す方法',
    shortTitle: 'Steamディスク書き込みエラー',
    description:
      'Steamのダウンロードや更新で「ディスク書き込みエラー」が出る場合に、空き容量、保存先、セキュリティソフト、ドライブを安全に確認する手順です。',
    conclusion:
      'SteamとPCを再起動し、ゲームを入れているドライブの空き容量を確認します。直らなければSteamライブラリの修復、隔離履歴、Windowsのドライブエラーを順に切り分けます。',
    checkedAt: '2026-09-19',
    steps: [
      {
        title: 'Steamを再起動して空き容量を確認する',
        actions: [
          'Steamのダウンロード画面でエラーになったゲーム名とドライブを記録する',
          'Steamを終了し、PCを再起動する',
          'ゲーム本体だけでなく更新用の一時領域も必要なため、対象ドライブに十分な空き容量を作る',
          '同じゲームの更新を再開してエラーが再現するか確認する',
        ],
      },
      {
        title: 'Steamライブラリとゲームファイルを修復する',
        actions: [
          'Steamの「設定」→「ストレージ」で対象ドライブを選び、ライブラリの修復機能を実行する',
          '対象ゲームの「プロパティ」→「インストール済みファイル」から整合性を確認する',
          '外付けドライブの場合は接続し直し、別のUSBポートへ直接接続して試す',
        ],
      },
      {
        title: 'セキュリティソフトの隔離履歴を確認する',
        actions: [
          'Windows セキュリティまたは利用中のセキュリティソフトで、Steamやゲームファイルの隔離履歴を確認する',
          'ファイルが隔離されている場合は、ゲーム公式とファイルの場所を確認してから復元可否を判断する',
          '保護機能を常時無効にせず、必要な場合だけ公式手順でSteamライブラリを除外して再確認する',
        ],
      },
      {
        title: 'Windowsでドライブのエラーを確認する',
        actions: [
          'エクスプローラーで対象ドライブを右クリックし「プロパティ」→「ツール」を開く',
          'エラーチェックを実行し、Windowsが修復を求めた場合は画面の指示に従う',
          '異音、認識切れ、ほかのアプリでも書き込み失敗がある場合は使用を止め、重要データを保全してPCメーカーまたはドライブメーカーへ相談する',
        ],
      },
    ],
    sources: [steamDiskCheck, steamInterference],
    related: ['verify-steam-files', 'steam-game-not-launching', 'steam-cloud-sync-error'],
    status: 'verified',
    causes: [
      'ドライブの空き容量不足',
      'Steamライブラリの権限・ファイル不整合',
      'セキュリティソフトによる隔離や競合',
      'ストレージ接続・ファイルシステムの問題',
    ],
  },
  {
    slug: 'pc-shuts-down-while-gaming',
    title: 'ゲーム中にPCの電源が落ちる・再起動するときの原因と対処法',
    shortTitle: 'ゲーム中に電源が落ちる',
    description:
      'PCゲーム中だけ突然電源が落ちる、再起動する場合に、Windows更新、温度、負荷、電源系統を安全に切り分ける方法です。',
    conclusion:
      '焦げた臭い、異音、異常な発熱がある場合は直ちに電源を切って使用を中止してください。異常がなければWindowsの更新とイベント記録、温度、オーバークロック、電源接続を順に確認します。',
    checkedAt: '2026-09-19',
    steps: [
      {
        title: '危険な兆候があれば使用を中止する',
        actions: [
          '焦げた臭い、火花、異音、触れないほどの発熱がある場合はPCを終了し、電源ケーブルを抜く',
          '電源ユニットやPC本体を分解せず、メーカーまたは修理窓口へ相談する',
          '異常がない場合も、繰り返し電源断が起きる間は重要データをバックアップする',
        ],
      },
      {
        title: 'Windows更新と発生記録を確認する',
        actions: [
          'Windows Updateを実行し、保留中の更新を完了して再起動する',
          '再起動後にWindows セキュリティとデバイスドライバーの警告を確認する',
          'イベント ビューアーまたは信頼性モニターで、停止直前の時刻とエラー名を記録する',
          '停止コードが表示される場合はブルースクリーンの記事へ進む',
        ],
      },
      {
        title: '温度と負荷を下げて再現するか確認する',
        actions: [
          'PCの吸排気口をふさがず、ほこりが目立つ場合は電源を切って外側から清掃する',
          'ゲームのFPS上限と画質を下げ、録画や配信など負荷の高いアプリを終了する',
          'PCメーカーまたは部品メーカーの監視ツールでCPU・GPU温度を確認する',
          '温度がメーカー上限付近まで上がる場合は使用を止めて点検を依頼する',
        ],
      },
      {
        title: '標準設定と電源接続で切り分ける',
        actions: [
          'CPU・GPU・メモリのオーバークロックやアンダーボルトを標準設定へ戻す',
          '電源タップを避け、PCの電源ケーブルを壁コンセントへ確実に接続して比較する',
          '特定ゲームだけならゲームファイルと公式既知問題、全ゲームならPCメーカーのハードウェア診断を確認する',
          '電源ユニット交換や内部配線作業は自分で断定せず、PCメーカーまたは専門店へ相談する',
        ],
      },
    ],
    sources: [windowsStopErrors],
    related: ['bsod-while-gaming', 'pc-game-crash', 'gpu-driver-update'],
    status: 'verified',
    causes: [
      'CPU・GPUの温度上昇',
      '高負荷時の電源供給や接続の問題',
      'オーバークロック・ドライバー・Windowsの不安定化',
      'メモリ、ストレージ、電源などハードウェアの異常',
    ],
  },
  {
    slug: 'bsod-while-gaming',
    title: 'ゲーム中にブルースクリーンが出るときの確認方法',
    shortTitle: 'ゲーム中のブルースクリーン',
    description:
      'PCゲーム中にブルースクリーンや停止コードが出る場合に、コードの記録、Windows更新、ドライバー、メモリとストレージを順に確認します。',
    conclusion:
      '最初に停止コードと「What failed」の表示を撮影してください。次にWindows Update、GPUなど直前に変更したドライバー、周辺機器、メモリ・ストレージ診断の順で切り分けます。',
    checkedAt: '2026-09-19',
    steps: [
      {
        title: '停止コードと発生条件を記録する',
        actions: [
          'ブルースクリーンに表示された停止コードと「What failed」があればスマホで撮影する',
          'ゲーム名、場面、発生時刻、直前に追加したドライバーや機器を記録する',
          'Windows再起動後に同じ操作を繰り返さず、重要データを先にバックアップする',
        ],
      },
      {
        title: 'Windowsと公式ドライバーを更新する',
        actions: [
          'Windows Updateを実行し、オプション更新を含めてメーカーが案内する更新を確認する',
          'GPUドライバーはNVIDIA、AMD、IntelまたはPCメーカーの公式手順で更新する',
          'ドライバー更新直後から発生した場合は、デバイス マネージャーの「ドライバーを元に戻す」が利用できるか確認する',
        ],
      },
      {
        title: '追加機器とオーバークロックを外す',
        actions: [
          '新しく接続したUSB機器や不要な周辺機器を外して確認する',
          'CPU・GPU・メモリのオーバークロックやアンダーボルトを標準設定へ戻す',
          'MOD、オーバーレイ、録画ツールを一時的に外し、ゲームファイルを確認する',
        ],
      },
      {
        title: 'Windowsのメモリとストレージを診断する',
        actions: [
          'Windows メモリ診断を実行し、再起動後の結果を確認する',
          'ゲームを入れているドライブのプロパティからエラーチェックを実行する',
          '同じ停止コードが続く場合は、コード、ミニダンプ、発生条件を添えてPCメーカーまたはMicrosoftサポートへ相談する',
        ],
      },
    ],
    sources: [windowsStopErrors],
    related: ['pc-shuts-down-while-gaming', 'gpu-driver-update', 'pc-game-crash'],
    status: 'verified',
    causes: [
      'デバイスドライバーやWindows更新の不整合',
      'メモリ・ストレージ・周辺機器の問題',
      'オーバークロックや高負荷時の不安定化',
      'ゲーム、MOD、オーバーレイとの競合',
    ],
  },
  {
    slug: 'no-game-audio',
    title: 'PCゲームで音が出ないときの対処法【Windows】',
    shortTitle: 'PCゲームで音が出ない',
    description:
      'PCゲームだけ音が出ない、Windows更新やモニター接続後に無音になった場合に、出力先、音量ミキサー、ゲーム設定、ドライバーを確認します。',
    conclusion:
      'Windowsの出力先と音量ミキサーでゲームがミュートされていないか確認し、ゲーム内の出力デバイスを「既定」へ戻します。次に排他モード、音声拡張、ドライバーを切り分けます。',
    checkedAt: '2026-09-19',
    steps: [
      {
        title: 'Windowsの出力先と音量ミキサーを確認する',
        actions: [
          'ゲームを起動した状態でタスクバーのスピーカーを開き、使うヘッドホンやスピーカーを選ぶ',
          '「設定」→「システム」→「サウンド」→「音量ミキサー」でゲームがミュートまたは音量0でないか確認する',
          'HDMIやDisplayPort接続後は、モニター側の音声出力へ切り替わっていないか確認する',
        ],
      },
      {
        title: 'ゲーム内の音声デバイスを既定へ戻す',
        actions: [
          'ゲームのオーディオ設定を開き、マスター音量と各チャンネルが0でないか確認する',
          '出力デバイスを「既定」または現在使う機器へ設定する',
          '出力先を変更した後はゲームを完全終了して起動し直す',
        ],
      },
      {
        title: 'ほかのアプリと音声拡張を切り分ける',
        actions: [
          'Discord、録画ソフト、音声ミキサー、仮想オーディオ機器を終了して比較する',
          'Windowsの出力デバイスのプロパティでオーディオ拡張機能を一時的にオフにする',
          '排他モードを使うアプリを終了し、サンプルレートを既定値へ戻す',
        ],
      },
      {
        title: 'Windows診断と公式ドライバーを確認する',
        actions: [
          'Windowsのサウンド設定から出力デバイスのトラブルシューティングを実行する',
          'Windows Updateを完了してPCを再起動する',
          'PC、マザーボード、ヘッドセットメーカーの公式手順で音声ドライバーを更新する',
          'ゲームだけ無音ならゲームファイルの整合性確認とゲーム公式の既知問題を確認する',
        ],
      },
    ],
    sources: [windowsAudio],
    related: ['directx-error', 'verify-steam-files', 'steam-game-not-launching'],
    status: 'verified',
    causes: [
      'Windowsまたはゲームの出力先が別デバイス',
      '音量ミキサーやゲーム内設定のミュート',
      '仮想オーディオ・排他モード・音声拡張の競合',
      '音声ドライバーやゲームファイルの問題',
    ],
  },
];
