import { steamCloudGuide } from './steam-cloud-guide';
import { powerShutdownGuide } from './power-shutdown-guide';
import { bsodGuide } from './bsod-guide';
import { audioGuide } from './audio-guide';
import type { CommonGuide } from '@/lib/common-guides';

const steamDiskCheck = {
  label: 'Steamサポート：PCのクラッシュ・ドライブ確認',
  url: 'https://help.steampowered.com/ja/faqs/view/6E58-B45E-9263-0B19',
};

const steamInterference = {
  label: 'Steamサポート：Steamと競合する可能性があるプログラム',
  url: 'https://help.steampowered.com/ja/faqs/view/1F39-DCB4-FF28-5748',
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
  audioGuide,
];
