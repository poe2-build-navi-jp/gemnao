import { powerShutdownGuide } from './power-shutdown-guide';
import { bsodGuide } from './bsod-guide';
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

const windowsAudio = {
  label: 'Microsoft：Windowsのサウンドまたはオーディオの問題を修正する',
  url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-sound-or-audio-problems-in-windows',
};

export const commonGrowthGuides: CommonGuide[] = [
  {
    slug: 'steam-cloud-sync-error',
    title: 'Steamクラウドが同期できない時の直し方｜同期エラー・競合の対処',
    shortTitle: 'Steamクラウド同期エラー',
    description:
      'Steamクラウドに同期できない、同期競合や「同期できません」と表示される場合に、セーブを失わない順番で切り分けます。',
    conclusion:
      'ゲームを起動せず、先にローカルのセーブデータを別の場所へコピーしてください。その後、Steam Cloudの有効状態、通信、同期競合に表示された更新日時を順に確認します。',
    checkedAt: '2026-09-20',
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
    related: [
      'save-data-backup',
      'uninstall-save-data',
      'steam-disk-write-error',
    ],
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
    title:
      'Steam「ディスク書き込みエラー」の直し方｜更新・インストールできない時の対処',
    shortTitle: 'Steamディスク書き込みエラー',
    description:
      'Steamのダウンロードや更新で「ディスク書き込みエラー」が出る場合に、空き容量、保存先、セキュリティソフト、ドライブを安全に確認する手順です。',
    conclusion:
      'SteamとPCを再起動し、ゲームを入れているドライブの空き容量を確認します。直らなければSteamライブラリの修復、隔離履歴、Windowsのドライブエラーを順に切り分けます。',
    checkedAt: '2026-09-20',
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
    related: [
      'verify-steam-files',
      'steam-game-not-launching',
      'steam-cloud-sync-error',
    ],
    status: 'verified',
    causes: [
      'ドライブの空き容量不足',
      'Steamライブラリの権限・ファイル不整合',
      'セキュリティソフトによる隔離や競合',
      'ストレージ接続・ファイルシステムの問題',
    ],
  },
  powerShutdownGuide,
  bsodGuide,
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
    related: [
      'directx-error',
      'verify-steam-files',
      'steam-game-not-launching',
    ],
    status: 'verified',
    causes: [
      'Windowsまたはゲームの出力先が別デバイス',
      '音量ミキサーやゲーム内設定のミュート',
      '仮想オーディオ・排他モード・音声拡張の競合',
      '音声ドライバーやゲームファイルの問題',
    ],
  },
];
