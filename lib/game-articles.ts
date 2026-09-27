import { verifiedReleaseArticles } from './verified-release-articles';
import { gameBySlug } from '@/lib/games';
import { eldenArticles } from '@/lib/elden-articles';
import { currentGameArticles } from '@/lib/current-game-articles';
import { newReleaseArticles } from '@/lib/new-release-articles';
import { aniimoArticles } from '@/lib/aniimo-articles';
import { dawnwalkerArticles } from '@/lib/dawnwalker-articles';
import { monsterHunterArticles } from '@/lib/monster-hunter-articles';

export type ArticleCategory =
  | 'save'
  | 'launch'
  | 'display'
  | 'settings'
  | 'server'
  | 'controller'
  | 'mods'
  | 'specs';

export type ContentStatus = 'verified' | 'needs-review' | 'draft' | 'thin';

export type StepRisk = 'low' | 'medium' | 'high';

export type ArticleStep = {
  id: string;
  title: string;
  summary: string;
  actions: string[];
  note?: string;
  /** Rough time for the whole step, e.g. "約1分". */
  time?: string;
  /** How hard the step is to undo: low = no change, high = files replaced. */
  risk?: StepRisk;
};

export type GameArticle = {
  gameSlug: string;
  slug: string;
  category: ArticleCategory;
  title: string;
  shortTitle: string;
  symptom: string;
  conclusion: string;
  description: string;
  checkedAt: string;
  status?: ContentStatus;
  targetVersion?: string;
  causes?: string[];
  symptoms: { label: string; target: string }[];
  steps: ArticleStep[];
  cautions: string[];
  faqs?: { question: string; answer: string }[];
  /** "30秒でわかる" facts shown under the conclusion; `copy` adds a copy button. */
  quickFacts?: { label: string; value: string; copy?: boolean }[];
  /** Symptom → likely cause → which step to jump to. */
  diagnosis?: { symptom: string; cause: string; stepId: string }[];
  /** Things that make the problem worse or risk the save / account. */
  avoid?: string[];
  sources?: { label: string; url: string }[];
  related: string[];
  seoTitle: string;
  metaDescription: string;
};

export const categoryLabels: Record<ArticleCategory, string> = {
  save: 'セーブデータ',
  launch: '起動しない',
  display: 'FPS',
  settings: '画面・設定',
  server: '専用サーバー',
  controller: 'コントローラー',
  mods: 'MOD',
  specs: '推奨スペック',
};

const palworld = gameBySlug('palworld');
if (!palworld) throw new Error('Palworld guide data is missing');

const originalGameArticles: GameArticle[] = [
  {
    gameSlug: palworld.slug,
    slug: 'save-data',
    category: 'save',
    title: 'パルワールドのセーブデータ場所はどこ？バックアップ方法【Steam版】',
    shortTitle: 'Steam版セーブ場所',
    symptom:
      'Steam版パルワールドのSaveGamesフォルダを開きたい、1.0更新やMOD導入前にワールドをバックアップしたい人向けです。',
    conclusion: `Steam版の保存先は「${palworld.savePath}」です。ゲーム終了後に使用中のワールドフォルダを丸ごと別の場所へコピーします。`,
    description:
      'SaveGames内はSteam IDとワールドIDごとに分かれます。フォルダ名だけで判断せず、更新日時を見て現在遊んでいるワールドを確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '保存場所を開きたい', target: 'open-save' },
      { label: 'ワールドをバックアップしたい', target: 'backup-world' },
      { label: 'どのフォルダか分からない', target: 'identify-world' },
      { label: '復元前に保全したい', target: 'prepare-restore' },
    ],
    steps: [
      {
        id: 'open-save',
        title: 'Steam版のSaveGamesフォルダを開く',
        summary: 'Windowsの環境変数を使えばユーザー名を入力せずに開けます。',
        actions: [
          'パルワールドとSteamを終了する',
          'WindowsキーとRを同時に押す',
          String.raw`%LOCALAPPDATA%\Pal\Saved\SaveGames と入力してEnterを押す`,
          'Steam IDと思われる数字のフォルダを開く',
        ],
        note: `保存先の表記：${palworld.savePath}`,
      },
      {
        id: 'identify-world',
        title: '現在使っているワールドを更新日時で確認する',
        summary:
          '複数のワールドがある場合に、誤ったデータを操作しないための確認です。',
        actions: [
          'SaveGamesフォルダを詳細表示にする',
          '「更新日時」で新しい順に並べる',
          '最後にプレイした時刻と近いワールドフォルダを確認する',
          '判断できない場合はSaveGames全体をバックアップする',
        ],
      },
      {
        id: 'backup-world',
        title: 'ワールドフォルダを丸ごとコピーする',
        summary:
          '個別のsavファイルではなく、関連ファイルをまとめて保存します。',
        actions: [
          '対象のワールドフォルダを選択する',
          '別ドライブまたはドキュメント内のバックアップ先へコピーする',
          'フォルダ名に日付と「更新前」などの目的を付ける',
          'コピー先を開き、ファイルとPlayersフォルダが含まれるか確認する',
        ],
      },
      {
        id: 'prepare-restore',
        title: '復元前にも現在の状態を残す',
        summary: '復元結果が違ったときに元へ戻せるようにします。',
        actions: [
          'パルワールドとSteamを終了する',
          '現在のSaveGamesを別名でコピーする',
          'Steam Cloudの同期状態を確認する',
          'バックアップと現在データを混ぜず、フォルダ単位で管理する',
        ],
      },
    ],
    cautions: [
      'プレイ中やSteam Cloud同期中にセーブデータを上書きしないでください。',
      'Steam版とXbox／Microsoft Store版は保存形式と場所が異なるため、この手順をそのまま流用しないでください。',
    ],
    faqs: [
      {
        question: 'Steam版パルワールドのセーブデータはどこですか？',
        answer:
          'Windowsでは%LOCALAPPDATA%\\Pal\\Saved\\SaveGames内です。その下にSteam IDとワールドごとのフォルダがあります。',
      },
      {
        question: 'どのワールドフォルダをコピーすればいいですか？',
        answer:
          '最後にプレイした時刻と更新日時が近いフォルダを確認します。判別できない場合はSaveGamesフォルダ全体をコピーしてください。',
      },
      {
        question: 'バックアップはLevel.savだけで大丈夫ですか？',
        answer:
          'ワールドとプレイヤー情報の組み合わせを保つため、個別ファイルではなく対象ワールドのフォルダ全体をコピーしてください。',
      },
    ],
    sources: [
      {
        label: 'PCGamingWiki（Steam版保存場所）',
        url: 'https://www.pcgamingwiki.com/wiki/Palworld',
      },
    ],
    related: [
      'dedicated-server-backup',
      'not-launching',
      'system-requirements',
      'dedicated-server-settings',
    ],
    seoTitle:
      'パルワールドのセーブデータ場所はどこ？バックアップ方法【Steam版】',
    metaDescription:
      'Steam版パルワールドのセーブデータ場所を開く方法を解説。SaveGames内のワールドを見分け、1.0更新やMOD導入前に安全にバックアップする手順です。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'dedicated-server-settings',
    category: 'server',
    title: 'パルワールドのPalWorldSettings.iniはどこ？専用サーバー設定方法',
    shortTitle: 'PalWorldSettings.iniの場所',
    symptom:
      '専用サーバーの設定ファイルが見つからない、DefaultPalWorldSettings.iniを変更しても反映されない人向けです。',
    conclusion: String.raw`Windows版の実設定は「PalServer\Pal\Saved\Config\WindowsServer\PalWorldSettings.ini」です。DefaultPalWorldSettings.iniをコピーしてから実設定側を編集します。`,
    description:
      '公式サーバーガイドでは、設定用ディレクトリは専用サーバーを一度起動した後に作成されると案内されています。テンプレートと実際に読み込まれるファイルを混同しないことが重要です。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: 'iniが見つからない', target: 'create-directory' },
      { label: '設定が反映されない', target: 'copy-default' },
      { label: 'Windowsの保存先を知りたい', target: 'open-settings' },
      { label: '変更前に保全したい', target: 'backup-settings' },
    ],
    steps: [
      {
        id: 'create-directory',
        title: '専用サーバーを一度起動して終了する',
        summary:
          '初回起動前はConfig配下の必要なフォルダが存在しない場合があります。',
        actions: [
          'Palworld Dedicated Serverを起動する',
          '起動ログが落ち着くまで待つ',
          '参加者がいない状態でサーバーを正常終了する',
          'PalServerフォルダ内にPal\\Saved\\Configが作られたか確認する',
        ],
      },
      {
        id: 'copy-default',
        title: 'デフォルト設定を実設定ファイルへコピーする',
        summary:
          'DefaultPalWorldSettings.iniはテンプレートであり、直接編集しても反映されません。',
        actions: [
          String.raw`PalServer直下のDefaultPalWorldSettings.iniをコピーする`,
          String.raw`Pal\Saved\Config\WindowsServerフォルダを開く`,
          'コピーしたファイルを貼り付ける',
          'ファイル名をPalWorldSettings.iniにする',
        ],
        note: '拡張子が非表示の場合は、エクスプローラーの「表示」からファイル名拡張子をONにしてください。',
      },
      {
        id: 'open-settings',
        title: 'PalWorldSettings.iniを編集する',
        summary: 'サーバー停止中に、必要なパラメータだけを変更します。',
        actions: [
          'PalWorldSettings.iniを別名でコピーして保全する',
          'テキストエディターで実設定ファイルを開く',
          'ServerNameやServerPasswordなど必要な値だけを変更する',
          '引用符やカンマを崩さず保存する',
          '専用サーバーを再起動して反映を確認する',
        ],
      },
      {
        id: 'backup-settings',
        title: '反映しない場合は読み込み先と書式を確認する',
        summary:
          'テンプレート側を編集していないか、1行の構文が崩れていないかを確認します。',
        actions: [
          '編集先がWindowsServer\\PalWorldSettings.iniか確認する',
          'DefaultPalWorldSettings.iniだけを編集していないか確認する',
          '変更前バックアップと比較して括弧・引用符・カンマを確認する',
          '変更を1項目に戻して再起動する',
        ],
      },
    ],
    cautions: [
      '設定変更前にセーブデータとPalWorldSettings.iniをバックアップしてください。',
      'AdminPasswordやServerPasswordを記事、画像、公開リポジトリへ載せないでください。',
    ],
    faqs: [
      {
        question: 'PalWorldSettings.iniが見つからないのはなぜですか？',
        answer:
          '設定用ディレクトリは専用サーバーを一度起動した後に作成されます。起動して正常終了した後にWindowsServerフォルダを確認してください。',
      },
      {
        question:
          'DefaultPalWorldSettings.iniを編集しても反映されないのはなぜですか？',
        answer:
          'DefaultPalWorldSettings.iniはコピー元のテンプレートです。実際に編集するのはPal\\Saved\\Config\\WindowsServer\\PalWorldSettings.iniです。',
      },
      {
        question: '設定変更後に再起動は必要ですか？',
        answer:
          'はい。サーバーを停止して設定を保存し、再起動後に変更内容を確認してください。',
      },
    ],
    sources: [
      {
        label: 'Palworld公式サーバーガイド（設定パラメータ）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/configuration/',
      },
    ],
    related: [
      'dedicated-server-backup',
      'dedicated-server-port',
      'save-data',
      'not-launching',
    ],
    seoTitle: 'PalWorldSettings.iniはどこ？パルワールド専用サーバー設定方法',
    metaDescription:
      'パルワールド専用サーバーのPalWorldSettings.iniの場所、初回作成、DefaultPalWorldSettings.iniを編集しても反映されない時の確認方法を解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'dedicated-server-backup',
    category: 'server',
    title: 'パルワールド専用サーバーのセーブ場所と自動バックアップ設定',
    shortTitle: 'サーバー保存・バックアップ',
    symptom:
      '専用サーバーのワールド保存先を確認したい、自動バックアップを有効にしたい、更新前に手動保全したい管理者向けです。',
    conclusion: String.raw`実設定でbIsUseBackupSaveData=Trueにすると、セーブデータ内にbackupフォルダが作成されます。更新前は/Save後に正常終了し、WorldIDフォルダ全体も別の場所へコピーします。`,
    description:
      '公式の自動バックアップはサーバー内に保存されるため、同じストレージの障害には備えられません。内蔵履歴と別ドライブへの手動コピーを分けて考えます。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: 'サーバーの保存先を知りたい', target: 'locate-world' },
      { label: '自動バックアップを有効にしたい', target: 'enable-backup' },
      { label: '更新前に手動保存したい', target: 'save-and-stop' },
      { label: '安全にコピーしたい', target: 'copy-world' },
    ],
    steps: [
      {
        id: 'locate-world',
        title: '使用中のWorldIDフォルダを確認する',
        summary: '専用サーバーのワールドとプレイヤーデータをまとめて扱います。',
        actions: [
          String.raw`PalServer\Pal\Saved\SaveGames\0を開く`,
          'ランダムな文字列のWorldIDフォルダを確認する',
          '複数ある場合はサーバー停止後の更新日時で使用中フォルダを判別する',
          'フォルダ内のPlayersとワールド関連ファイルを確認する',
        ],
      },
      {
        id: 'enable-backup',
        title: '公式の自動バックアップを有効にする',
        summary: 'PalWorldSettings.iniのバックアップ設定をONにします。',
        actions: [
          '専用サーバーを停止する',
          'PalWorldSettings.iniをコピーして保全する',
          'bIsUseBackupSaveData=Trueに設定する',
          '保存してサーバーを起動する',
          'セーブデータ内にbackupフォルダが作成されるか確認する',
        ],
        note: '公式資料では30秒ごと5個、10分ごと6個、1時間ごと12個、1日ごと7個のバックアップが案内されています。',
      },
      {
        id: 'save-and-stop',
        title: '更新前に/Saveして正常終了する',
        summary: 'コピー中にサーバーが書き込まない状態を作ります。',
        actions: [
          'PalWorldSettings.iniでAdminPasswordを設定する',
          'ゲーム内で/AdminPassword <パスワード>を実行する',
          '/Saveを実行する',
          '/Shutdown [秒] [メッセージ]で参加者へ告知して終了する',
          'サーバープロセスが完全に停止したことを確認する',
        ],
      },
      {
        id: 'copy-world',
        title: 'WorldIDフォルダ全体を別ストレージへコピーする',
        summary: '内蔵backupと同じ場所だけに残さず、独立したコピーを作ります。',
        actions: [
          '停止中のWorldIDフォルダを丸ごとコピーする',
          'サーバー外の別ドライブまたは独立した保管先へ貼り付ける',
          '日付・サーバーバージョン・WorldIDを記録する',
          'コピー先にPlayersとワールド関連ファイルがあるか確認する',
        ],
      },
    ],
    cautions: [
      'サーバー稼働中にWorldIDフォルダを直接上書きしないでください。',
      'AdminPasswordは秘密情報です。コマンド履歴、配信画面、公開ファイルへ表示しないでください。',
      '自動バックアップを有効にするとディスク負荷が増えます。空き容量も確認してください。',
    ],
    faqs: [
      {
        question: 'パルワールド専用サーバーのセーブ場所はどこですか？',
        answer:
          '通常はPalServer\\Pal\\Saved\\SaveGames\\0の下にあるWorldIDフォルダです。環境やホスティングサービスにより上位のパスは異なります。',
      },
      {
        question: 'bIsUseBackupSaveDataを有効にするとどうなりますか？',
        answer:
          'セーブデータフォルダ内にbackupフォルダが作成され、複数の間隔でバックアップが保存されます。ディスク負荷は増加します。',
      },
      {
        question: '自動バックアップだけで十分ですか？',
        answer:
          '同じサーバーストレージ内にあるため、重要な更新前にはWorldIDフォルダ全体を別の保管先にもコピーしてください。',
      },
    ],
    sources: [
      {
        label: 'Palworld公式サーバーガイド（バックアップ設定）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/configuration/',
      },
      {
        label: 'Palworld公式サーバーガイド（管理コマンド）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/commands/',
      },
    ],
    related: [
      'dedicated-server-settings',
      'dedicated-server-port',
      'save-data',
      'not-launching',
    ],
    seoTitle: 'パルワールド専用サーバーのセーブ場所・自動バックアップ設定',
    metaDescription:
      'パルワールド専用サーバーのセーブデータ場所、bIsUseBackupSaveDataの自動バックアップ、/Saveと/Shutdownを使った更新前の安全な保全方法を解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'dedicated-server-port',
    category: 'server',
    title: 'パルワールド専用サーバーのポート8211設定と接続できない時の確認',
    shortTitle: 'ポート8211・接続できない',
    symptom:
      '専用サーバーの待受ポートを変更したい、PublicPortを変えても接続先が変わらない、外部から接続できない場合の切り分けです。',
    conclusion:
      '待受ポートは起動引数の-port=8211で指定します。PalWorldSettings.iniのPublicPortは公開情報用で、サーバーが実際に待ち受けるポートを変更しません。',
    description:
      '「起動引数」「PalWorldSettings.ini」「ルーター・ファイアウォール」を分けて確認します。公開IPや管理APIをむやみに外部公開しないことも重要です。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '待受ポートを設定したい', target: 'set-listen-port' },
      { label: 'PublicPortが反映されない', target: 'public-port' },
      { label: 'LANではつながる', target: 'check-network' },
      { label: '外部から接続できない', target: 'check-network' },
    ],
    steps: [
      {
        id: 'set-listen-port',
        title: '起動引数で待受ポートを指定する',
        summary: 'Steam版またはSteamCMDの起動方法に合わせて-portを追加します。',
        actions: [
          '専用サーバーを停止する',
          'Steam版はPalworld Dedicated Serverのプロパティを開く',
          '起動オプションへ-port=8211を追加する',
          'SteamCMD版はPalServer.exeの起動コマンドへ-port=8211を追加する',
          '再起動後に指定ポートで待ち受けているか確認する',
        ],
      },
      {
        id: 'public-port',
        title: 'PublicPortとの役割の違いを確認する',
        summary: 'PublicPortだけを変更しても待受ポートは変わりません。',
        actions: [
          'PalWorldSettings.iniのPublicPort値を確認する',
          '待受ポートを変える場合は-portの起動引数を確認する',
          'コミュニティサーバー公開時だけPublicPortとの整合を確認する',
          '設定変更後にサーバーを再起動する',
        ],
      },
      {
        id: 'check-network',
        title: '接続範囲をLAN内から順に切り分ける',
        summary:
          'いきなり全公開せず、サーバー自身、LAN、外部の順に確認します。',
        actions: [
          'サーバーが正常起動しエラーを出していないか確認する',
          'LAN内の別PCからローカルIPと指定ポートで接続を試す',
          'Windows DefenderファイアウォールでPalServerの通信許可を確認する',
          '外部接続が必要な場合だけルーター側の転送先IPとポートを確認する',
          '接続先へ入力したIPとポートがサーバー設定と一致するか確認する',
        ],
        note: 'ルーターの画面名や契約回線の仕様は機種・事業者で異なります。共有回線やCGNATでは、利用者側で外部公開できない場合があります。',
      },
    ],
    cautions: [
      'RCONやREST APIをインターネットへ直接公開しないでください。公式ガイドはREST APIをLAN内での利用に限定するよう警告しています。',
      '不要なポートをまとめて開放せず、使用するポートだけを対象にしてください。',
      '管理パスワードとグローバルIPを公開記事や画面共有へ載せないでください。',
    ],
    faqs: [
      {
        question: 'パルワールド専用サーバーのポートはどこで変更しますか？',
        answer:
          'サーバーの起動引数に-port=8211の形式で指定します。8211部分は使用するポート番号へ置き換えます。',
      },
      {
        question: 'PublicPortを変えても接続ポートが変わらないのはなぜですか？',
        answer:
          'PublicPortはコミュニティサーバーで外部公開ポートを明示する設定で、実際の待受ポートは変更しません。待受側は-port起動引数で指定します。',
      },
      {
        question: 'LAN内では接続できるのに外部から接続できません',
        answer:
          'ルーターの転送先、Windowsファイアウォール、契約回線のCGNATやポート制限を確認します。まず指定ポートとサーバーのローカルIPが一致しているか確認してください。',
      },
    ],
    sources: [
      {
        label: 'Palworld公式サーバーガイド（起動引数）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/arguments/',
      },
      {
        label: 'Palworld公式サーバーガイド（PublicPort）',
        url: 'https://docs.palworldgame.com/ja/settings-and-operation/configuration/',
      },
    ],
    related: [
      'dedicated-server-settings',
      'dedicated-server-backup',
      'not-launching',
      'system-requirements',
    ],
    seoTitle: 'パルワールド専用サーバーのポート8211設定｜接続できない時の確認',
    metaDescription:
      'パルワールド専用サーバーの-port=8211起動引数、PublicPortとの違い、LANではつながるのに外部から接続できない時の確認順を解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'not-launching',
    category: 'launch',
    title: 'パルワールド1.0が起動しない・クラッシュする時の対処法【Steam版】',
    shortTitle: '1.0で起動しない・クラッシュ',
    symptom:
      '1.0更新後に起動直後で落ちる、ワールド読み込み中にクラッシュする、古いMODを無効化しても直らない場合の確認手順です。',
    conclusion:
      '最初にセーブを保全し、Steam Workshopと手動導入を含む古いMODを完全に退避してから、ゲームファイルの整合性を確認します。',
    description:
      '公式告知では、1.0で基盤システムが大きく変わり、古いMODがクラッシュやセーブ破損の原因になり得ると案内されています。MOD管理画面でOFFにするだけでなく、導入元ごとに残存ファイルを確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '1.0更新後に落ちる', target: 'remove-mods' },
      { label: 'MODを無効化しても直らない', target: 'remove-remnants' },
      { label: '起動直後にクラッシュする', target: 'verify-files' },
      { label: 'ワールド読み込みで落ちる', target: 'test-new-world' },
    ],
    steps: [
      {
        id: 'backup-save',
        title: '作業前にセーブデータをバックアップする',
        summary: 'MOD削除や整合性確認の前に、現在のワールドを保全します。',
        actions: [
          'パルワールドとSteamを終了する',
          String.raw`%LOCALAPPDATA%\Pal\Saved\SaveGamesを開く`,
          'SaveGamesフォルダを別の場所へ丸ごとコピーする',
          'バックアップに日付と「1.0起動確認前」と付ける',
        ],
      },
      {
        id: 'remove-mods',
        title: 'Steam WorkshopのMODをすべて無効化する',
        summary: '公式のMod Management画面で有効なWorkshop MODを外します。',
        actions: [
          'SteamでパルワールドのMOD管理画面を開く',
          '有効なWorkshop MODをすべて無効化する',
          'Workshopの購読状況も確認する',
          'ゲームを起動せず次の残存ファイル確認へ進む',
        ],
      },
      {
        id: 'remove-remnants',
        title: '手動導入MODとローダーをゲーム外へ退避する',
        summary: '管理ツールでOFFにしても残るファイルを切り分けます。',
        actions: [
          'Steamからパルワールドのローカルファイルを開く',
          '手動で追加したMOD、UE4SS、外部ローダーの場所を確認する',
          '削除せずゲームフォルダ外の退避用フォルダへ移す',
          '導入元とファイル名を記録する',
        ],
        note: '公式告知では、MODを管理画面で無効にするだけでは不十分な場合があると案内されています。',
      },
      {
        id: 'verify-files',
        title: 'Steamでゲームファイルの整合性を確認する',
        summary: '不足・破損・改変された本体ファイルをSteamに確認させます。',
        actions: [
          'Steamライブラリでパルワールドを右クリックする',
          '「プロパティ」→「インストール済みファイル」を開く',
          '「ゲームファイルの整合性を確認」を実行する',
          '完了後にPCを再起動する',
          'MODを戻さずゲーム本体だけで起動する',
        ],
      },
      {
        id: 'test-new-world',
        title: '新規ワールドで本体と既存セーブを切り分ける',
        summary:
          'タイトル画面まで起動できる場合に、既存ワールド固有の問題か確認します。',
        actions: [
          'バックアップがあることを再確認する',
          'MODなしで一時的な新規ワールドを作成する',
          '新規ワールドが読み込めるか確認する',
          '新規だけ動く場合は既存セーブへ無理な上書きをせず公式サポート情報を確認する',
        ],
      },
    ],
    cautions: [
      'MODに依存する内容を含むセーブは、MODを外すと正常に読み込めない場合があります。バックアップを残してください。',
      '配布元不明の修復ツールや実行ファイルを使用しないでください。',
    ],
    faqs: [
      {
        question: 'パルワールド1.0で起動直後にクラッシュする時は？',
        answer:
          'セーブをバックアップし、Workshopと手動導入のMODをすべて退避してからSteamの整合性確認とPC再起動を行います。',
      },
      {
        question: 'MODをOFFにしたのに起動しないのはなぜですか？',
        answer:
          'MODローダーや手動導入ファイルがゲームフォルダに残っている可能性があります。管理画面だけでなく導入元ごとの残存ファイルを確認してください。',
      },
      {
        question: '新規ワールドは起動するのに既存ワールドだけ落ちます',
        answer:
          '既存セーブ固有またはMOD依存の可能性があります。バックアップへ上書きせず、使用していたMODの1.0対応と公式の最新告知を確認してください。',
      },
    ],
    sources: [
      {
        label: 'Pocketpair公式告知（1.0とMODの注意）',
        url: 'https://steamcommunity.com/games/1623730/announcements/',
      },
      {
        label: 'Steamサポート（ゲームが起動しない場合）',
        url: 'https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF',
      },
    ],
    related: [
      'save-data',
      'system-requirements',
      'dedicated-server-settings',
      'dedicated-server-backup',
    ],
    seoTitle: 'パルワールド1.0が起動しない・クラッシュする時の対処法【Steam】',
    metaDescription:
      'パルワールド1.0が起動しない、更新後にクラッシュする時の対処法。古いMODの完全退避、Steam整合性確認、セーブ保全、新規ワールドでの切り分けを解説します。',
  },
  {
    gameSlug: palworld.slug,
    slug: 'system-requirements',
    category: 'specs',
    title: 'パルワールド1.0の推奨スペック｜メモリ32GB・SSD要件【PC版】',
    shortTitle: '1.0推奨スペック',
    symptom:
      'メモリ16GBで足りるか、RTX 3060 Tiが必要か、SSDや空き容量を購入前に確認したい人向けです。',
    conclusion:
      '公式推奨はWindows 11、メモリ32GB、RTX 3060 TiまたはRX 6700 XT、40GB以上の空き容量、SSD必須です。最低条件のメモリは16GBです。',
    description:
      '最低動作環境と推奨環境を分け、CPU・GPUだけでなくメモリ、SSD、活動中のパル数による性能差まで確認します。',
    checkedAt: '2026-09-09',
    symptoms: [
      { label: '推奨スペックを知りたい', target: 'recommended' },
      { label: 'メモリ16GBで足りるか知りたい', target: 'memory' },
      { label: '最低スペックを知りたい', target: 'minimum' },
      { label: '自分のPC構成を確認したい', target: 'check-pc' },
    ],
    steps: [
      {
        id: 'recommended',
        title: '公式の推奨動作環境を確認する',
        summary: '快適さを重視する場合の公式目安です。',
        actions: [
          'OS：Windows 11 64-bitを確認する',
          'CPU：Core i5-12400またはRyzen 5 5600X以上を目安にする',
          'メモリ：32GB RAMを確認する',
          'GPU：RTX 3060 TiまたはRX 6700 XT以上を目安にする',
          '40GB以上の空きがあるSSDを用意する',
        ],
      },
      {
        id: 'memory',
        title: '16GBと32GBの違いを確認する',
        summary: '16GBは最低条件、32GBは公式推奨です。',
        actions: [
          'タスクマネージャーの「パフォーマンス」→「メモリ」を開く',
          '搭載容量とゲーム起動前の使用量を確認する',
          '16GB環境ではブラウザなど不要なアプリを終了する',
          '大規模拠点や活動中のパルが多い場面で使用量を再確認する',
        ],
      },
      {
        id: 'minimum',
        title: '最低動作環境を確認する',
        summary:
          '起動条件の目安であり、高画質や高fpsを保証するものではありません。',
        actions: [
          'OS：Windows 10 64-bit',
          'CPU：Core i5-9400F',
          'メモリ：16GB RAM',
          'GPU：GTX 1660',
          'DirectX 11、40GBのSSD空き容量を確認する',
        ],
      },
      {
        id: 'check-pc',
        title: 'Windowsで自分の構成を調べる',
        summary: '標準機能でCPU、メモリ、GPUを確認します。',
        actions: [
          'WindowsキーとRを押す',
          'dxdiagと入力してEnterを押す',
          'システムタブでCPUとメモリを確認する',
          'ディスプレイタブでGPUを確認する',
          'Steamストアの最新要件と比較する',
        ],
      },
    ],
    cautions: [
      '公式要件は更新される場合があります。PC購入・増設前はSteamストアの最新表示を確認してください。',
      'Steamは活動中のパル数により性能が変わると案内しています。拠点規模やマルチ人数も考慮してください。',
    ],
    faqs: [
      {
        question: 'パルワールドはメモリ16GBで遊べますか？',
        answer:
          '16GBは公式の最低条件です。公式推奨は32GBで、活動中のパル数や同時起動アプリによって使用量が変わります。',
      },
      {
        question: 'パルワールドにSSDは必要ですか？',
        answer:
          'はい。Steamストアの最低・推奨要件はいずれもSSD必須で、40GBの空き容量が必要です。',
      },
      {
        question: 'パルワールド1.0の推奨GPUは何ですか？',
        answer: '公式推奨はGeForce RTX 3060 TiまたはRadeon RX 6700 XTです。',
      },
    ],
    sources: [
      {
        label: 'Steamストア（公式システム要件）',
        url: 'https://store.steampowered.com/app/1623730/Palworld/',
      },
    ],
    related: [
      'not-launching',
      'save-data',
      'dedicated-server-settings',
      'dedicated-server-port',
    ],
    seoTitle: 'パルワールド1.0の推奨スペック｜メモリ32GB・SSD要件【PC版】',
    metaDescription:
      'パルワールド1.0の最低・推奨スペックを解説。メモリ16GBと32GB、RTX 3060 Ti、SSD 40GB、活動中のパル数による性能差を確認できます。',
  },
];

export const gameArticles: GameArticle[] = [
  ...aniimoArticles,
  ...monsterHunterArticles,
  ...originalGameArticles,
  ...eldenArticles,
  ...currentGameArticles,
  ...newReleaseArticles,
  ...dawnwalkerArticles,
  ...verifiedReleaseArticles,
];

export function articlesForGame(gameSlug: string) {
  return gameArticles.filter((article) => article.gameSlug === gameSlug);
}

export function articleBySlug(gameSlug: string, articleSlug: string) {
  return gameArticles.find(
    (article) => article.gameSlug === gameSlug && article.slug === articleSlug,
  );
}
