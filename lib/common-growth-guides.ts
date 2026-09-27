import { steamCloudGuide } from './steam-cloud-guide';
import { powerShutdownGuide } from './power-shutdown-guide';
import { bsodGuide } from './bsod-guide';
import type { CommonGuide } from '@/lib/common-guides';

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
  steamCloudGuide,
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
