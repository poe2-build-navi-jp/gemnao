import type { GameArticle } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';

const game = gameBySlug('elden-ring');
if (!game) throw new Error('ELDEN RING guide data is missing');

type Draft = Pick<
  GameArticle,
  | 'slug'
  | 'category'
  | 'title'
  | 'shortTitle'
  | 'symptom'
  | 'conclusion'
  | 'description'
  | 'steps'
>;

const make = (draft: Draft, related: string[]): GameArticle => ({
  gameSlug: game.slug,
  checkedAt: '2026-09-12',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  cautions: [
    'ファイルを移動・変更する前に必ずバックアップしてください。',
    '非公式ツールやMODは利用規約を確認し、Easy Anti-Cheatを無効化したオフライン環境だけで扱ってください。',
  ],
  faqs: [
    {
      question: `${draft.shortTitle}で最初に何を試しますか？`,
      answer: draft.conclusion,
    },
  ],
  sources: [
    {
      label: 'Steamストア（公式情報）',
      url: 'https://store.steampowered.com/app/1245620/ELDEN_RING/',
    },
    {
      label: 'Bandai Namco公式サポート',
      url: 'https://support.bandainamcoent.com/s/',
    },
  ],
  related,
  seoTitle: draft.title,
  metaDescription: draft.symptom,
  ...draft,
});

export const eldenArticles: GameArticle[] = [
  make(
    {
      slug: 'save-data',
      category: 'save',
      title: 'ELDEN RINGのセーブデータ場所とバックアップ方法【Steam版】',
      shortTitle: 'セーブデータの場所',
      symptom:
        'セーブデータの保存先を開きたい、MOD導入や設定変更の前にバックアップしたい人向けです。',
      conclusion: String.raw`Steam版は「%APPDATA%\EldenRing\<Steam ID>\ER0000.sl2」です。ゲーム終了後、Steam IDのフォルダごとコピーします。`,
      description:
        'ユーザー名を入力せずに保存先を開く方法と、復元できる形でバックアップを残す手順です。',
      steps: [
        {
          id: 'open-save',
          title: 'セーブデータの場所を開く',
          summary: '環境変数を使って直接開きます。',
          actions: [
            'ゲームとSteamを終了する',
            String.raw`エクスプローラーへ「%APPDATA%\EldenRing」と入力する`,
            '数字のSteam IDフォルダを開き、ER0000.sl2の更新日時を確認する',
          ],
        },
        {
          id: 'backup-save',
          title: 'Steam IDフォルダを丸ごとコピーする',
          summary: '関連ファイルもまとめて保全します。',
          actions: [
            'Steam IDフォルダをコピーする',
            '別ドライブへ貼り付ける',
            'フォルダ名にバックアップ日を付ける',
          ],
        },
        {
          id: 'verify-backup',
          title: 'コピー先の内容を確認する',
          summary: '復元時に迷わないよう記録します。',
          actions: [
            'コピー先にER0000.sl2があることを確認する',
            '元の場所とバックアップ先をメモする',
            '復元前にも現在のデータを別名で残す',
          ],
        },
      ],
    },
    ['not-launching', 'mod', 'fps', 'hdr'],
  ),
  make(
    {
      slug: 'not-launching',
      category: 'launch',
      title: 'ELDEN RINGが起動しない・白い画面で止まる時の対処法【PC版】',
      shortTitle: '起動しない・白い画面',
      symptom:
        'Steamから起動できない、白い画面で止まる、MOD導入後に動かない場合の切り分け手順です。',
      conclusion:
        'Steamの整合性確認、MODと外部DLLの退避、GraphicsConfig.xmlの再生成を順番に試します。',
      description:
        '1項目を試すたびに起動を確認し、設定やMODは削除せず退避します。',
      steps: [
        {
          id: 'verify-files',
          title: 'Steamで整合性を確認する',
          summary: '不足・破損ファイルを修復します。',
          actions: [
            'ライブラリでELDEN RINGを右クリックする',
            'プロパティ→インストール済みファイルを開く',
            '整合性確認後にPCを再起動する',
          ],
        },
        {
          id: 'remove-mods',
          title: 'MODと外部DLLを退避する',
          summary: '本体だけで起動できるか確認します。',
          actions: [
            '追加ファイルの場所を記録する',
            '削除せずゲームフォルダ外へ移す',
            'MODを戻さず起動する',
          ],
        },
        {
          id: 'reset-config',
          title: 'GraphicsConfig.xmlを再生成する',
          summary: '壊れた表示設定を初期化します。',
          actions: [
            String.raw`%APPDATA%\EldenRing\GraphicsConfig.xmlをコピーする`,
            '元ファイルを別の場所へ移す',
            'ゲームを起動して再生成を確認する',
          ],
        },
      ],
    },
    ['save-data', 'mod', 'fps', 'ultrawide'],
  ),
  make(
    {
      slug: 'fps',
      category: 'display',
      title: 'ELDEN RINGのFPS設定｜60FPS上限とカクつきの確認方法',
      shortTitle: '60FPS上限',
      symptom:
        '60FPSより上がらない、カクつく、高リフレッシュレートでも表示が変わらない場合の確認用です。',
      conclusion:
        'PC版の公式仕様は60FPS上限です。まず公式設定のまま安定性を確認します。',
      description:
        '上限解除MODはEasy Anti-Cheatを無効化したオフライン環境だけで扱います。',
      steps: [
        {
          id: 'understand-limit',
          title: '公式の60FPS上限を確認する',
          summary: '60FPS付近で止まるのは公式仕様です。',
          actions: [
            'ゲーム内設定を開く',
            '60FPS付近か確認する',
            '急な低下やカクつきの有無を確認する',
          ],
        },
        {
          id: 'check-settings',
          title: '負荷を1項目ずつ下げる',
          summary: '通常状態の安定性を確認します。',
          actions: [
            '現在の設定を記録する',
            '負荷の高い設定を1つ下げる',
            '同じ場所で比較する',
          ],
        },
        {
          id: 'offline-only',
          title: '上限解除はオフラインだけで使う',
          summary: 'オンライン環境と改変を分けます。',
          actions: [
            'セーブをバックアップする',
            '対応バージョンを確認する',
            'EACを無効化したオフライン環境だけで起動する',
          ],
        },
      ],
    },
    ['not-launching', 'ultrawide', 'hdr', 'mod'],
  ),
  make(
    {
      slug: 'ultrawide',
      category: 'settings',
      title: 'ELDEN RINGは21:9・ウルトラワイド対応？黒帯の仕様を解説',
      shortTitle: '21:9・黒帯',
      symptom:
        '3440×1440などで左右に黒帯が出る、21:9や32:9で遊べるか知りたい人向けです。',
      conclusion: '公式表示は16:9のため、21:9・32:9では左右に黒帯が入ります。',
      description:
        '黒帯を外すには非公式ツールが必要で、オンライン利用は避けます。',
      steps: [
        {
          id: 'confirm-spec',
          title: '16:9表示の仕様か確認する',
          summary: '左右だけの黒帯は公式表示です。',
          actions: [
            'Windowsの解像度を確認する',
            'ゲーム内解像度を確認する',
            '左右だけに黒帯があるか確認する',
          ],
        },
        {
          id: 'check-resolution',
          title: '16:9解像度で比較する',
          summary: '表示欠けや引き伸ばしを切り分けます。',
          actions: [
            '現在値を記録する',
            '16:9解像度へ変更する',
            'UI表示を確認して元へ戻す',
          ],
        },
        {
          id: 'offline-only',
          title: '解除ツールはオフラインだけで扱う',
          summary: '公式外の改変を分けます。',
          actions: [
            'セーブをバックアップする',
            'ツールの対応版を確認する',
            'EACを無効化した環境で確認する',
          ],
        },
      ],
    },
    ['fps', 'hdr', 'mod', 'not-launching'],
  ),
  make(
    {
      slug: 'hdr',
      category: 'settings',
      title: 'ELDEN RINGのHDR設定方法｜白っぽい・色がおかしい時の確認手順',
      shortTitle: 'HDR設定',
      symptom:
        'HDRを有効にしたい、画面が白っぽい、色や明るさが不自然な場合の確認手順です。',
      conclusion:
        'Windows側のHDRを先に有効化・調整し、その後にELDEN RINGを再起動します。',
      description:
        'ゲーム起動中ではなく、Windows側を設定してから再起動して比較します。',
      steps: [
        {
          id: 'enable-windows-hdr',
          title: 'Windows HDRを先に有効にする',
          summary: '対象ディスプレイを正しく選びます。',
          actions: [
            'ゲームを終了する',
            '設定→システム→ディスプレイを開く',
            '対象画面でHDRを有効にする',
          ],
        },
        {
          id: 'calibrate-hdr',
          title: 'HDRキャリブレーションを行う',
          summary: '暗部と明部を調整します。',
          actions: [
            'HDRキャリブレーションを開く',
            '案内に沿って調整する',
            '設定を保存する',
          ],
        },
        {
          id: 'restart-game',
          title: 'ゲームを再起動して比較する',
          summary: '暗い場所と明るい場所で確認します。',
          actions: [
            'HDRが有効か確認する',
            'ゲームを起動する',
            'ゲーム内の明るさを調整する',
          ],
        },
      ],
    },
    ['fps', 'ultrawide', 'not-launching', 'mod'],
  ),
  make(
    {
      slug: 'mod',
      category: 'mods',
      title: 'ELDEN RINGのMOD導入前準備｜動かない時の戻し方と注意点',
      shortTitle: 'MOD導入・戻し方',
      symptom:
        'MOD導入後に起動しない、本体更新後にMODが動かない場合の切り分けです。',
      conclusion:
        'セーブを複製し、MOD専用のオフライン環境で1個ずつ導入します。',
      description: '問題時はMODと外部DLLをすべて退避して本体だけで確認します。',
      steps: [
        {
          id: 'prepare',
          title: 'セーブと起動環境を分ける',
          summary: 'オンライン用とMOD用を混ぜません。',
          actions: [
            'セーブを別の場所へコピーする',
            '導入前のファイルを記録する',
            'EACを無効化したオフライン環境を用意する',
          ],
        },
        {
          id: 'remove-mods',
          title: 'MODと外部DLLをすべて退避する',
          summary: '本体だけで起動できるか確認します。',
          actions: [
            '追加ファイルをゲーム外へ移す',
            'Steamで整合性を確認する',
            '本体だけで起動する',
          ],
        },
        {
          id: 'check-version',
          title: 'MODを1個ずつ戻す',
          summary: '対応版と必要な前提を確認します。',
          actions: [
            '対応ゲームバージョンを確認する',
            '1個だけ戻して起動する',
            '問題がなければ次を追加する',
          ],
        },
      ],
    },
    ['save-data', 'not-launching', 'fps', 'ultrawide'],
  ),
];
