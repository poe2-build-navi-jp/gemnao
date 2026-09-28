import { verifiedReleaseArticles } from './verified-release-articles';
import { gameBySlug } from '@/lib/games';
import { eldenArticles } from '@/lib/elden-articles';
import { currentGameArticles } from '@/lib/current-game-articles';
import { newReleaseArticles } from '@/lib/new-release-articles';
import { launchWeekArticles } from '@/lib/launch-week-articles';
import { fallReleaseArticles } from '@/lib/fall-release-articles';
import { codMw4Articles } from '@/lib/cod-mw4-articles';
import { octoberReleaseArticles } from '@/lib/october-release-articles';
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
  /** Compact wording for the social preview image; page title stays unchanged. */
  ogTitle?: string;
  ogSteps?: string[];
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
    title:
      'パルワールドのセーブデータの場所｜バックアップの確認と復元手順【Steam版】',
    shortTitle: 'セーブ場所・復元',
    symptom:
      'Steam版パルワールドのワールドをバックアップしたい、コピーが完了したか確かめたい、保存したワールドを元に戻したい人向けです。自分で作ったワールドが対象で、専用サーバーの管理データには適用しません。',
    conclusion: `保存先は「${palworld.savePath}」の下にあるワールド別フォルダです。ゲームとSteamを終了してフォルダを丸ごと別の場所へコピーし、ファイル名・サイズ・ファイル数を元と照合します。復元時は現在のデータを退避し、元と同じID・階層へフォルダごと戻します。`,
    description:
      'SaveGames内はユーザーIDとワールドIDで分かれます。バックアップを置く親フォルダに日付を付け、IDでできたワールドフォルダ名は変えずに保存すると、復元先を間違えにくくなります。',
    checkedAt: '2026-09-28',
    targetVersion: 'WindowsのSteam版・自分のPCに保存されるワールド',
    quickFacts: [
      {
        label: '保存場所を開く',
        value: String.raw`%LOCALAPPDATA%\Pal\Saved\SaveGames`,
        copy: true,
      },
      {
        label: 'コピーする単位',
        value: 'ユーザーIDの下にある、対象ワールドのIDフォルダ全体',
      },
      {
        label: 'フォルダの並び方',
        value: String.raw`SaveGames\<ユーザーID>\<ワールドID>\Level.sav`,
      },
      {
        label: 'コピー成功の確認',
        value:
          '両方のフォルダでファイル数・合計サイズとLevel.savなどのサイズを照合',
      },
      {
        label: '復元する場所',
        value: '元と同じユーザーIDの下へ、元と同じワールドIDの名前で戻す',
      },
    ],
    diagnosis: [
      {
        symptom: 'セーブ場所や対象のワールドが分からない',
        cause: 'ユーザーID・ワールドIDのフォルダ名だけでは判別できない',
        stepId: 'identify-world',
      },
      {
        symptom: 'コピーしたが、本当に保存できたか不安',
        cause: 'コピー先に必要なファイルが揃っているか未確認',
        stepId: 'verify-backup',
      },
      {
        symptom: 'バックアップを元に戻したい',
        cause: '復元前のデータとSteamクラウドの同期に注意が必要',
        stepId: 'restore-world',
      },
      {
        symptom: '復元後にワールドが出ない／最初から始まる',
        cause: 'コピー先の階層・ワールドID・データの組が違う可能性',
        stepId: 'check-restored',
      },
    ],
    symptoms: [
      { label: '保存場所を開きたい', target: 'open-save' },
      { label: 'どのフォルダか分からない', target: 'identify-world' },
      { label: 'ワールドをバックアップしたい', target: 'backup-world' },
      { label: 'コピーできたか確認したい', target: 'verify-backup' },
      { label: 'バックアップから復元したい', target: 'restore-world' },
      { label: '復元後の結果を確認したい', target: 'check-restored' },
    ],
    steps: [
      {
        id: 'open-save',
        title: 'Steam版のSaveGamesフォルダを開く',
        summary: 'Windowsの環境変数を使えばユーザー名を入力せずに開けます。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ゲームを終了し、Steamの同期が完了したことを確認してからSteamも終了する',
          'Windows＋Rキーを押し、「%LOCALAPPDATA%\\Pal\\Saved\\SaveGames」と入力してEnterを押す',
          '数字などで表示されるユーザーIDのフォルダを開き、さらに英数字のワールドIDのフォルダを探す',
        ],
        note: 'SaveGamesが見つからない場合は、Windows版のSteamでプレイしているか確認してください。Xbox／Microsoft Store版や専用サーバーでは保存先が異なります。',
      },
      {
        id: 'identify-world',
        title: '対象のワールドを最終プレイ日時で絞る',
        summary:
          '更新日時は目安です。迷ったまま別のワールドを上書きしないでください。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲーム内のワールド選択画面で、対象のワールド名と最後に遊んだ日時を控え、ゲームを終了する',
          'エクスプローラーでユーザーIDのフォルダを開き、ワールドIDの各フォルダを「詳細」表示にして更新日時を比べる',
          '候補の中でLevel.sav、LevelMeta.sav、Playersフォルダなどがあるか確かめる。ファイル構成は更新によって異なるため、見えるファイルだけでワールド名を決めつけない',
          '複数の候補から特定できない場合は、SaveGamesフォルダ全体を別の場所へコピーし、復元時もユーザーIDとワールドIDの対応を保管する',
        ],
      },
      {
        id: 'backup-world',
        title: 'ワールドフォルダを丸ごとコピーする',
        summary:
          '日付は保管先の親フォルダに付け、ワールドIDのフォルダ名は変えません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームとSteamが終了した状態で、対象のワールドIDのフォルダを右クリック→「コピー」する。分からなければSaveGamesフォルダ全体をコピーする',
          'ドキュメントや外付けドライブに「Palworld_更新前_2026-09-28」のような保管用フォルダを作り、その中へ貼り付ける',
          '元の「ユーザーID／ワールドID」をメモし、コピー先のワールドIDのフォルダ名は変更しない',
          'エクスプローラーでコピー先を実際に開き、次のSTEPで元データと照合する',
        ],
        note: '同じドライブだけに置いたコピーは、ドライブ故障時に同時に失われる可能性があります。重要なワールドは別ドライブにも保存してください。',
      },
      {
        id: 'verify-backup',
        title: 'コピー先を開き、ファイル数とサイズを照合する',
        summary:
          '貼り付けた表示だけでは完了と判断せず、コピー元とコピー先を別々に開いて照合します。',
        time: '約2分',
        risk: 'low',
        actions: [
          '元のワールドIDフォルダと、バックアップ先の同名フォルダをそれぞれ開く。両方にLevel.sav、LevelMeta.sav、Playersフォルダなど、元に存在した項目が揃っているか確認する',
          '各フォルダを右クリック→「プロパティ」で「ファイル数」と「サイズ」を照合する。ディスクの形式により「ディスク上のサイズ」は異なるので比べない',
          'Level.savと、元にLocalData.savがある場合はそのファイルも右クリック→「プロパティ」で、両方の「サイズ」を見比べる。コピー後に元のワールドを遊んで更新した場合は一致しないため、コピー時点の記録と比べる',
          'フォルダの中身が空、ファイル数が少ない、サイズが異なる場合は成功扱いにせず、ゲームとSteamを閉じて元からコピーし直す',
        ],
        note: 'サイズの一致は「コピーが揃っているか」の確認です。データをゲームが読み込める保証ではありません。実際に読み込めるかは、復元後のSTEPで確認します。',
      },
      {
        id: 'restore-world',
        title: '現在のワールドを退避してから、バックアップを元の場所へ戻す',
        summary:
          '同名ファイルだけを混ぜて上書きせず、元のワールドID・階層を再現します。',
        time: '約5分',
        risk: 'medium',
        actions: [
          'SteamのライブラリでPalworldを右クリック→「プロパティ」→「一般」を開き、そのゲームのSteamクラウド同期を一時的にオフにする',
          'ゲームとSteamを終了し、元のワールドIDフォルダをドキュメントなどSaveGamesの外へ「復元前の状態」として丸ごとコピーする。コピーしたフォルダを開いて中身があることも確認する',
          'コピー先とは別に「%LOCALAPPDATA%\\Pal\\Saved\\RestoreHold」のような一時フォルダを作り、元のワールドIDフォルダをそこへ移す。ユーザーIDのフォルダは残し、対象外のワールドには触れない',
          '保存しておいたバックアップのワールドIDフォルダを、元と同じSaveGames／ユーザーIDの下へコピーする。フォルダ名は元のワールドIDのままにし、階層が二重になっていないか確認する',
          'Steamを起動し、クラウド同期はまだオフのままPalworldを開いて、次のSTEPで復元結果を調べる',
        ],
        note: 'SaveGames全体を保管していた場合も、まず対応するユーザーIDと対象のワールドIDを確認してから、そのワールドフォルダだけを戻します。',
      },
      {
        id: 'check-restored',
        title: 'ワールド名・進行状況を確認してから同期を戻す',
        summary:
          'タイトル画面に出るだけでは復元完了ではありません。実際にロードして確かめます。',
        time: '約3分',
        risk: 'low',
        actions: [
          'ワールド選択画面で対象のワールドが表示されるか確認し、ロード後にキャラクター、拠点、パルなどバックアップ時点の進行状況を照合する',
          'ワールドが見つからない、またはキャラクター作成から始まる場合は新規保存せずにゲームを閉じる。ユーザーID・ワールドIDの階層、コピー元にPlayersなどが揃っていたか、選んだ時点のバックアップかを再確認する',
          '復元結果が違えばSteamとゲームを閉じ、復元したフォルダをSaveGamesの外へ移し、退避しておいた復元前のワールドIDフォルダを元のユーザーIDの下へ戻せる',
          '復元した進行状況で遊べると確認できたらゲームを正常終了する。Steamクラウドを再びオンにする際は、ローカルとクラウドの不一致が出たら日時だけで即決せず、退避データを残したまま復元した側の進行状況を確認して選ぶ',
        ],
        note: 'Steamクラウドをオンにした後は別のPCで古いセーブを開く前に同期状態を確認してください。同期の選択に迷う場合はクラウドをオフのままにし、退避したフォルダを消さないでください。',
      },
    ],
    avoid: [
      'バックアップ用に保管するワールドIDフォルダの名前を書き換えない。日付は外側の保管用フォルダへ付ける',
      '復元前のフォルダを削除してから貼り付けない。別の場所へ退避し、結果を見てから扱いを決める',
      '違うユーザーIDや違うワールドIDの場所へ貼り付けたり、複数時点のsavファイルを混ぜたりしない',
    ],
    cautions: [
      'この操作は自分のPCに保存されるSteam版ワールドの例です。専用サーバー、公式サーバー、Xbox／Microsoft Store版には適用しません。',
      'プレイ中やクラウド同期中にはセーブデータを置き換えないでください。',
    ],
    faqs: [
      {
        question: 'コピー先にLevel.savがあればバックアップは成功ですか？',
        answer:
          'それだけでは不足です。元と同じワールドIDのフォルダに、元にあったPlayersフォルダや他のファイルが揃い、ファイル数・合計サイズが一致するか確認してください。サイズが合っても読み込みの保証にはならず、復元後にゲーム内で進行状況を確かめます。',
      },
      {
        question:
          'バックアップのワールドIDフォルダに日付を付けて改名してもいいですか？',
        answer:
          '保管中は外側の親フォルダに日付を付け、内側のワールドID名はそのままにしてください。戻す際には元と同じユーザーIDの下に、元と同じワールドID名で置きます。',
      },
      {
        question:
          'クラウド同期を再開したら「ローカル」「クラウド」の選択が出ました',
        answer:
          '両方の日時と、直前にゲーム内で確認した進行状況を照合してください。復元したローカル側が目的の状態だと分かるまで選択せず、退避したセーブを保持します。判断がつかなければ同期をオフにしてSteam公式のクラウド案内を確認してください。',
      },
    ],
    sources: [
      {
        label: 'PCGamingWiki（Steam版保存場所）',
        url: 'https://www.pcgamingwiki.com/wiki/Palworld',
      },
      {
        label: 'Steam公式：Palworld（Steamクラウド対応）',
        url: 'https://store.steampowered.com/app/1623730/Palworld/',
      },
      {
        label: 'Steam公式サポート：ゲームごとのクラウド同期の切り替え',
        url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
      },
    ],
    related: [
      'dedicated-server-backup',
      'not-launching',
      'system-requirements',
      'dedicated-server-settings',
    ],
    seoTitle:
      'パルワールドのセーブデータ保存先｜バックアップ確認・復元方法【Steam版】',
    metaDescription:
      'Steam版パルワールドのセーブデータ保存先を開き、コピー後のファイル数・サイズを照合する方法を解説。ワールドIDを保ったバックアップ、Steamクラウドを一時停止した復元、ゲーム内での確認まで。',
    ogTitle: 'パルワールドのセーブを戻す方法',
    ogSteps: [
      'ワールドIDのフォルダを丸ごと保存',
      'ファイル数とサイズでコピーを確認',
      '現行データを退避して元へ復元',
      'ゲーム内で進行状況を照合',
    ],
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
      'Steam版パルワールドが1.0更新後に起動しない、タイトル画面で落ちる、既存ワールドだけ読み込めない場合の切り分けです。Workshop・手動導入・UE4SSを別々に確認します。',
    conclusion:
      'セーブをコピーした後、Workshopの購読を解除し、ゲームフォルダに残った手動MOD・ローダーをゲーム外へ退避します。Steamで整合性を確認し、MODなしで起動できるか試してください。整合性確認だけでは、手動で追加したファイルが残る場合があります。',
    description:
      'Pocketpairは、古いMODをオフにしただけでは残存ファイルやローダーが読み込まれ得ると案内しています。以下はSteam版クライアント用です。専用サーバーのPalServerフォルダには適用しません。ファイルの配置は導入方法によって異なるため、まず導入元とファイル名を照合します。',
    checkedAt: '2026-09-27',
    targetVersion:
      'Steam版・Windows・パルワールド1.0系（専用サーバーは対象外）',
    causes: [
      'Workshopの購読が残り、次の起動でMODが再配置されている',
      'Paks内の手動MODやWin64内の旧UE4SS・DLLローダーが残っている',
      '本体ファイルの不足・破損、またはMODに依存した既存セーブ',
    ],
    quickFacts: [
      {
        label: 'Steam版セーブの場所',
        value: String.raw`%LOCALAPPDATA%\Pal\Saved\SaveGames`,
        copy: true,
      },
      {
        label: 'ゲームのインストール先',
        value:
          'Steamライブラリ→パルワールドを右クリック→管理→ローカルファイルを閲覧',
      },
      {
        label: '手動導入を確認する場所',
        value: String.raw`Pal\Content\Paks / Pal\Binaries\Win64（ゲームのインストール先から）`,
      },
      {
        label: '公式Workshopの展開先',
        value: String.raw`Mods\NativeMods\UE4SS / Pal\Content\Paks\LogicMods・~WorkshopMods`,
      },
    ],
    diagnosis: [
      {
        symptom: 'WorkshopのMODを使っている／使っていた',
        cause: 'ゲーム内で無効化しても、Steamの購読や配置済みファイルが残る',
        stepId: 'remove-mods',
      },
      {
        symptom: 'Nexusなどから手動でMODやUE4SSを入れた',
        cause: 'Steamの整合性確認では追加ファイルを特定できない',
        stepId: 'remove-remnants',
      },
      {
        symptom: '整合性確認が「問題なし」でも起動しない',
        cause: '追加ファイルが残っているか、MOD以外の問題',
        stepId: 'check-verification-result',
      },
      {
        symptom: 'タイトルは開くが、既存ワールドだけ落ちる',
        cause: 'MOD依存データ、または既存セーブ固有の問題',
        stepId: 'test-new-world',
      },
    ],
    symptoms: [
      { label: 'Workshop MODを使っている', target: 'remove-mods' },
      { label: '手動MOD・UE4SSを入れた', target: 'remove-remnants' },
      { label: '整合性確認後も落ちる', target: 'check-verification-result' },
      { label: 'ワールド読み込みで落ちる', target: 'test-new-world' },
    ],
    steps: [
      {
        id: 'backup-save',
        title: '作業前にSteam版のセーブを別の場所へコピーする',
        summary:
          'MODを外すと、MOD由来のアイテムを含む既存ワールドが読み込めなくなることがあります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'パルワールドを終了し、Steamもタスクトレイから終了する。Steam Cloudの同期が終わっていることを確認する',
          String.raw`Windows＋Rを押し、%LOCALAPPDATA%\Pal\Saved\SaveGames を入力して開く`,
          'SaveGamesフォルダ全体をゲーム・Steamのインストール先とは別の場所へコピーする。コピー先にワールドのフォルダとファイルがあることを確認する',
          'コピー先に「Palworld_1.0_MOD退避前_日付」などの名前を付け、以降は元のセーブへ直接ファイルを上書きしない',
        ],
      },
      {
        id: 'remove-mods',
        title: 'ゲーム内のMOD管理とSteam Workshopの購読を確認する',
        summary:
          '「Mod Management」はSteamの設定画面ではなく、ゲームのタイトル画面にある項目です。起動できなければ購読確認から始めます。',
        time: '約3〜10分',
        risk: 'medium',
        actions: [
          'タイトル画面を開ける場合は「オプション」→「Mod Management」で有効なMODをオフにする。開けない場合はこの操作を飛ばす',
          'Steamのパルワールドのコミュニティハブから「ワークショップ」を開き、「あなたのファイル」→「サブスクライブしたアイテム」で購読中のMODを確認する（Steamの表示言語で名称が異なる）',
          '購読中のパルワールド用MODは個別ページの「サブスクライブ中」を押して購読を解除する。再ダウンロードや再配置を防ぐため、次の手順までMODは再購読しない',
          'Steamを終了し、次の手順でゲームフォルダに残ったファイルも確認する。購読解除だけで手動MODや配置済みのローダーは消えない',
        ],
      },
      {
        id: 'remove-remnants',
        title: '手動MOD・UE4SS・Workshopの配置済みファイルを退避する',
        summary:
          'Steamが開いた「Palworld」フォルダを基準に、導入方法ごとに場所を見ます。見覚えのない本体ファイルを名前だけで削除しません。',
        time: '約5〜15分',
        risk: 'medium',
        actions: [
          'Steamライブラリでパルワールドを右クリック→「管理」→「ローカルファイルを閲覧」。開いたPalworldフォルダを基準にする。PalServerでは作業しない',
          String.raw`手動の.pak／LogicModsは Pal\Content\Paks を開く。LogicModsや自分で作成したMOD用フォルダ、導入時に追加した.pakだけを、ゲームフォルダ外の「Palworld_MOD退避」へ移す`,
          String.raw`手動導入のUE4SS／DLLローダーは Pal\Binaries\Win64 を開く。導入時の説明・ダウンロード記録と照合し、自分で追加したue4ssフォルダやローダーのDLLだけを退避する`,
          String.raw`公式Workshopで展開された分は Mods\NativeMods\UE4SS・Mods\ManagedMods と Pal\Content\Paks\~WorkshopMods・LogicMods を確認する。購読解除後も残るMODファイルを、元の相対パスが分かる形でゲームフォルダ外へ退避する`,
          '退避フォルダ内を「手動PAK」「UE4SS」「Workshop残存」などに分け、元のパスとMOD名をメモする。どれが追加ファイルか判別できなければ無理に選別せず、STEP 5のフォルダ単位の方法を使う',
        ],
        note: 'Pal\\Content\\Paksにあるゲーム本体の.pakや、Win64にある本体のDLLを名前だけで選別しないでください。外部のMOD管理ツールを使った場合は、そのツールの導入履歴も確認します。',
      },
      {
        id: 'verify-files',
        title: 'Steamで整合性を確認して、MODなしで起動する',
        summary:
          '退避で不足した正規ファイルがあれば、Steamが再取得します。作業中はMODを戻しません。',
        time: '約5分〜（再取得があると長くなる）',
        risk: 'low',
        actions: [
          'Steamライブラリでパルワールドを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を押す',
          '確認と必要な再ダウンロードが完全に終わるまで待つ。再取得があったか、エラー表示が残るかを控える',
          'Steamを再起動し、Workshopを再購読せず、退避したMODも戻さない状態でパルワールドを起動する',
          'タイトルまで開くか、既存ワールドの読み込み時にだけ落ちるかを分けて記録する',
        ],
      },
      {
        id: 'check-verification-result',
        title: '整合性確認と起動結果から次の操作を選ぶ',
        summary:
          '「再取得された＝MODが原因」とは限りません。整合性確認の結果と、実際の起動結果を組み合わせます。',
        time: '約2分（フォルダ単位の退避は別途）',
        risk: 'medium',
        actions: [
          '再取得後にMODなしで起動できた：本体の不足か、退避したMODのどちらかが原因候補。直後に全MODを戻さず、STEP 7で1個ずつ確かめる',
          '「問題なし」なのに起動しない：整合性確認は手動で追加したファイルがない証明にはならない。STEP 3のPaks・Win64・Modsを再点検する',
          String.raw`どれが追加ファイルか見分けられない場合は、ゲームとSteamを閉じ、Pal\Binaries\Win64・Pal\Content\Paks・Mods の各フォルダを、容量に余裕があるゲーム外の場所へ「元のパスが分かる名前」で丸ごと移す。その後、STEP 4の整合性確認を再実行して正規ファイルを再取得する`,
          'フォルダ単位の退避後もタイトルに到達しない：MODだけを原因と決めず、エラー表示、Windowsの信頼性モニターの記録、GPUドライバーの状態を控え、記事末尾にあるPC共通の起動トラブルガイドへ進む',
        ],
        note: 'Paksには大容量のゲーム本体も含まれます。フォルダごと退避すると大きな空き容量と再ダウンロードが必要です。まずは特定できる追加ファイルだけを退避してください。',
      },
      {
        id: 'test-new-world',
        title: 'タイトルまで開くなら、一時的な新規ワールドで比較する',
        summary:
          '既存ワールド固有の問題とゲーム本体の問題を分けます。バックアップが取れている場合だけ実施します。',
        time: '約5分',
        risk: 'medium',
        actions: [
          '別の場所へコピーしたSaveGamesバックアップが存在することを確認する',
          'MODを入れ直さないまま、一時的な新規ワールドを作り、読み込みまで進むか確認する',
          '新規ワールドだけ正常なら既存ワールド／MOD依存データが原因候補。既存セーブを上書き・削除せず、使用していたMODの対応状況とセーブの記事を確認する',
          '新規ワールドも落ちるならセーブ固有と決めつけず、エラー文・発生時点を記録してPC共通のクラッシュ・強制終了ガイドを確認する',
        ],
      },
      {
        id: 'restore-mods',
        title: '直った後、必要なMODだけを1個ずつ戻す',
        summary:
          '最新版への対応が配布者から確認できたMODだけを個別に試します。',
        time: 'MODごとに約5分〜',
        risk: 'medium',
        actions: [
          'MODなしでタイトルと対象ワールドが正常に開く状態を確認し、セーブのバックアップをもう一度残す',
          '配布者が現在のパルワールド1.0系に対応すると案内しているMODを1個だけ購読または再導入する',
          '起動・ワールド読み込みを試し、問題がなければ次のMODを1個追加する。再発したら直前に加えたMODを外して再確認する',
          '旧版のUE4SSや退避したフォルダ全体をまとめて元へ戻さない',
        ],
      },
    ],
    avoid: [
      'MODが入ったままの既存セーブを、バックアップなしで開いて保存しない',
      'SaveGames内のセーブデータを「MODファイル」として削除しない',
      '整合性確認で「問題なし」と出ただけで、追加MODファイルも消えたと判断しない',
    ],
    cautions: [
      'ゲーム本体のフォルダとセーブのSaveGamesは別です。MOD退避・整合性確認中もセーブのバックアップを残してください。',
      'フォルダ単位の退避後はSteamが本体を再取得するまで起動しません。作業前に空き容量と通信量を確認してください。',
    ],
    faqs: [
      {
        question: 'MOD管理画面はSteamのどこにありますか？',
        answer:
          '「Mod Management」はパルワールドを起動した後のタイトル画面にある「オプション」内です。ゲームが起動しないなら開けないので、Steamのワークショップで購読を解除してからゲームフォルダの残存ファイルを確認してください。',
      },
      {
        question: 'Steamの整合性確認で「問題なし」ならMODは残っていませんか？',
        answer:
          'いいえ。整合性確認は主にSteam管理下の本体ファイルを確認します。手動で置いた.pak、UE4SS、外部DLLローダーなどは残り得ます。Paks・Win64・Modsの各場所を導入履歴と照合してください。',
      },
      {
        question: '新規ワールドは起動するのに既存ワールドだけ落ちます',
        answer:
          '旧MODに依存したアイテムやデータ、既存セーブ固有の問題が疑われます。新規ワールドのセーブで既存データを上書きせず、退避前のバックアップと使用MODの1.0系への対応状況を確認してください。',
      },
    ],
    sources: [
      {
        label: 'Pocketpair公式：1.0と古いMODに関する注意',
        url: 'https://steamcommunity.com/games/1623730/announcements/detail/686383649529010210',
      },
      {
        label: 'Pocketpair公式：MOD利用ガイドライン・削除対象',
        url: 'https://guideline.palworldgame.com/palworld-mod-guideline',
      },
      {
        label: 'Pocketpair公式：MOD管理と導入先（開発者向け資料）',
        url: 'https://github.com/pocketpairjp/PalworldModUploader/blob/main/PalworldModUploader/docs/en/04-Tech.md',
      },
      {
        label: 'Steamサポート：ゲームファイルの整合性確認',
        url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
      },
    ],
    related: ['save-data', 'system-requirements'],
    seoTitle: 'パルワールド1.0が起動しない・クラッシュする時の対処法【Steam】',
    metaDescription:
      'パルワールド1.0が起動しない・クラッシュする時の対処法。Steam Workshopの購読解除、手動.pak・UE4SSの場所と退避、整合性確認後の結果別判断まで解説。',
    ogTitle: 'パルワールド起動しない？ MODを退避',
    ogSteps: [
      'セーブを先に保全',
      'Workshopの購読を確認',
      '手動MOD・UE4SSを退避',
      '整合性確認後に起動を比較',
    ],
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
  ...launchWeekArticles,
  ...fallReleaseArticles,
  ...codMw4Articles,
  ...octoberReleaseArticles,
];

export function articlesForGame(gameSlug: string) {
  return gameArticles.filter((article) => article.gameSlug === gameSlug);
}

export function articleBySlug(gameSlug: string, articleSlug: string) {
  return gameArticles.find(
    (article) => article.gameSlug === gameSlug && article.slug === articleSlug,
  );
}
