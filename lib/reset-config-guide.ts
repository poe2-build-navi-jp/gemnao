import type { CommonGuide } from './common-guides';

export const resetConfigGuide: CommonGuide = {
  slug: 'reset-config-file',
  title: 'PCゲームの設定ファイルを初期化する方法｜場所の探し方・安全な戻し方',
  shortTitle: '設定ファイルの初期化・復元',
  description:
    '画質設定を変えたら黒画面になる・ゲームが起動しない時に。設定ファイルの場所の探し方、セーブと分けたバックアップ、再生成、元に戻す手順を解説。初期化後に設定が戻る場合やファイルが見つからない場合も確認できます。',
  conclusion:
    '設定ファイルを別の場所へコピーしてから退避し、ゲームを起動して既定値と比較します。直れば必要な設定を1つずつ戻し、直らなければバックアップを元の場所へ戻します。まず下のゲーム別表で対象ファイルを確認してください。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    '変更した解像度・画面モードなどと現在の表示環境が合わない',
    '手動編集や更新後に、保存された設定を正常に読み込めない',
    'クラウド同期や起動オプションなどが設定を戻す・上書きする',
  ],
  steps: [
    {
      title: '対象ファイルとセーブの場所を確認する',
      actions: [
        '上のゲーム別表からフォルダーを開き、対象ファイルを探す。エルデンリングはGraphicsConfig.xml、ワイルズはconfig.ini。',
        'Windows 11のエクスプローラーで「表示」→「表示」→「ファイル名拡張子」をオンにする。ゲーム内の設定画面が開く場合は、先に問題の項目だけを戻して試す。',
      ],
    },
    {
      title: 'ゲームを終了し、別の場所へコピーする',
      actions: [
        'ゲームを通常終了し、ランチャーの同期完了を待ってランチャーも終了する。',
        '設定ファイルを、ゲームや同期対象のフォルダー外に作った「ゲーム名_config_backup_作業日」へコピーする。元のパスをメモし、コピー先の名前・サイズを確認する。',
        'セーブも別途バックアップする。エルデンリングは同じEldenRingフォルダー内の数字のフォルダー、ワイルズはゲーム別ガイドのセーブ保存先を参照。',
      ],
    },
    {
      title: '設定だけを退避し、既定値で起動する',
      actions: [
        'コピーを残したまま、元の設定ファイルをゲームが読み込む場所から別フォルダーへ移動する。',
        'ゲームを起動し、同じ場面で症状が変わるか確認する。通常終了後、元の場所に新しい設定ファイルができたか確認する。',
      ],
    },
    {
      title: '再起動で確認し、必要なら元に戻す',
      actions: [
        '改善したら、ゲーム内で画質やキー割り当てを1項目ずつ戻す。通常終了→再起動で設定が保存されることも確認する。',
        '改善しない場合はゲームとランチャーを終了。新しい設定を別の場所へ移し、作業前のコピーを元の保存先・元のファイル名で戻す。',
        '復元後は整合性チェックなど次の対策へ進む。',
      ],
    },
  ],
  faqs: [
    {
      question: '設定ファイルを初期化するとセーブデータも消えますか？',
      answer:
        'エルデンリングのGraphicsConfig.xmlとワイルズのconfig.iniは、セーブとは別のファイルです。この設定ファイルだけの退避でセーブを削除することにはなりません。他のゲームでは保存構成が異なる場合があります。',
    },
    {
      question: 'Steamの整合性チェックだけで設定は初期化できますか？',
      answer:
        '初期化されるとは限りません。Steam公式は、照合されないローカル設定ファイルがあると説明しています。ゲーム本体のファイル確認と、ユーザーが保存した設定の退避・再生成は分けて考えてください。',
    },
    {
      question: '設定ファイルが見つからない時は、自分で作ればよいですか？',
      answer:
        '作る必要はありません。PC版・ストア・Windowsユーザーと保存先が合っているか確認します。初回起動や設定保存後に生成される場合もあります。',
    },
    {
      question: '初期化しても設定が元に戻るのはなぜですか？',
      answer:
        'クラウド同期、起動オプション、MODや設定管理ツールによる上書きが考えられます。「初期化後の結果」の表から切り分けてください。',
    },
    {
      question: '他の人のconfigファイルを使う方が早いですか？',
      answer:
        '画面構成やゲームの版、MOD環境が違うため、そのまま使っても改善するとは限りません。まず自分の環境で既定値を再生成して比較します。他人のファイルで上書きすると、どの項目が原因か分かりにくくなります。',
    },
  ],
  related: [
    'black-screen',
    'save-data-backup',
    'verify-steam-files',
    'remove-mods-safely',
    'steam-cloud-sync-error',
  ],
  sources: [
    {
      label: 'カプコン公式：ワイルズのインストール先・トラブル対処',
      url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
    },
    {
      label: 'Epic公式：Fortniteの設定ファイル・読み取り専用の解除',
      url: 'https://www.epicgames.com/help/c-202300000001636/c-202300000001719/a202300000013484',
    },
    {
      label: 'ELDEN RING MOD作者の記録：GraphicsConfig.xmlの保存場所',
      url: 'https://www.nexusmods.com/eldenring/mods/135',
    },
    {
      label: 'Microsoft：エクスプローラーの拡張子・隠しファイル表示',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/fileexplorer/file-explorer-in-windows',
    },
    {
      label: 'Steam：Steam Cloud（設定の同期と競合）',
      url: 'https://help.steampowered.com/en/faqs/view/68D2-35AB-09A9-7678',
    },
    {
      label: 'Steam：ゲームファイルの整合性確認（ローカル設定の扱い）',
      url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
    },
    {
      label: 'Epic Games：Unreal Engineの設定ファイルの仕組み',
      url: 'https://dev.epicgames.com/documentation/ja-jp/unreal-engine/configuration-files-in-unreal-engine',
    },
    {
      label: 'Steam：バックアップ機能に含まれないデータと保存先の確認',
      url: 'https://help.steampowered.com/en/faqs/view/4593-5CB7-DC3C-64F0',
    },
  ],
};
