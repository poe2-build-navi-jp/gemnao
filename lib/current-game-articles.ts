import type { GameArticle } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';

// 鬼武者 Way of the Sword（PC版）の個別記事。
// 2026-09-27にカプコン公式トラブルシューティング（Steamコミュニティ固定投稿）、
// Steamストア、PCGamingWikiで確認した内容だけを載せています。
// STEPのidは解決報告（D1）の集計キーなので、既存のidは変更しないでください。
const game = gameBySlug('onimusha-way-of-the-sword');
if (!game) throw new Error('Onimusha data is missing');

const sources = {
  capcom: {
    label: 'カプコン公式：鬼武者 Way of the Sword トラブルシューティングガイド',
    url: 'https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/',
  },
  steam: {
    label: 'Steamストア：鬼武者 Way of the Sword（動作環境）',
    url: 'https://store.steampowered.com/app/2638890/',
  },
  pcgw: {
    label: 'PCGamingWiki：Onimusha: Way of the Sword（画面設定・保存場所）',
    url: 'https://www.pcgamingwiki.com/wiki/Onimusha:_Way_of_the_Sword',
  },
  msHdr: {
    label: 'Microsoft：Windows の HDR 設定',
    url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/hdr-settings-in-windows',
  },
  msHdrCalibration: {
    label: 'Microsoft：Windows HDR 調整アプリ',
    url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/calibrate-your-hdr-display-using-the-windows-hdr-calibration-app',
  },
};

const installDir = String.raw`C:\Program Files (x86)\Steam\steamapps\common\OnimushaWotS`;

type Draft = Omit<
  GameArticle,
  | 'gameSlug'
  | 'checkedAt'
  | 'symptoms'
  | 'seoTitle'
  | 'status'
  | 'targetVersion'
> & { seoTitle?: string; checkedAt?: string; targetVersion?: string };

const make = (draft: Draft): GameArticle => ({
  gameSlug: game.slug,
  checkedAt: '2026-09-27',
  status: 'verified',
  targetVersion: 'Steam版・2026年9月27日時点のカプコン公式案内',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const driverFact = {
  label: '公式が指定するGPUドライバー',
  value: 'NVIDIA GeForce 596.49以上／AMD Radeon 26.5.1以上',
};
const minimumSpecFact = {
  label: '最低動作環境',
  value:
    'Windows 11／GTX 1660（6GB）・RX 5500 XT（8GB）／メモリ16GB／SSD必須（Steamストア）',
};

export const currentGameArticles: GameArticle[] = [
  make({
    slug: 'not-launching',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: '鬼武者 Way of the Swordが起動しない・落ちる時の対処法【PC版】',
    category: 'launch',
    title:
      '鬼武者 Way of the Swordが起動しない・クラッシュする時の対処法【PC・Steam版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      '起動しない、起動直後やロード中に落ちる、表示が乱れる場合を、カプコン公式トラブルシューティングガイドの内容に沿って確認します。',
    conclusion:
      'カプコンの公式ガイドはPCの動作環境の確認から始まります。本記事では、動作環境を満たすことを確認したうえで、GPUドライバー（NVIDIA 596.49以上・AMD 26.5.1以上）と再起動、Steamの整合性確認、録画・オーバーレイの停止、保護履歴の順に切り分けます。公式は除外設定にも言及していますが、本記事では保護機能を有効に保ち、検出内容を提供元に相談する手順にしています。',
    description:
      '公式ガイドには17項目がありますが、多くの人に関係する順に並べ直しました。症状が分かっている場合は、下の早見表から該当するSTEPへ進めます。',
    causes: [
      '公式指定より古いGPUドライバー',
      'ゲームファイルの不足・破損',
      '録画ソフトやパフォーマンス表示など、描画に介入するアプリ',
      'セキュリティソフトの誤検知',
      'ノートPCで内蔵GPUが使われている、または互換モードの設定',
    ],
    quickFacts: [
      driverFact,
      minimumSpecFact,
      { label: 'インストール先（標準）', value: installDir, copy: true },
      {
        label: '直らない時に公式へ送る情報',
        value: 'DxDiag.txt、config.ini、CrashReportのzip、再現手順',
      },
    ],
    diagnosis: [
      {
        symptom: '起動しない・起動直後に落ちる',
        cause: '公式指定より古いGPUドライバー',
        stepId: 'driver',
      },
      {
        symptom: 'インストール直後や更新後から落ちる',
        cause: 'ゲームファイルの不足・破損',
        stepId: 'verify',
      },
      {
        symptom: '録画・配信ソフトを起動していると不安定',
        cause: '描画に介入するアプリ',
        stepId: 'overlay',
      },
      {
        symptom: 'セキュリティソフトの警告が出る、起動が妨げられる',
        cause: 'セキュリティソフトの誤検知',
        stepId: 'security',
      },
      {
        symptom: 'ノートPCで起動しない・極端に重い',
        cause: '内蔵GPUで動いている',
        stepId: 'gpu-select',
      },
      {
        symptom: '以前、互換モードや管理者実行を設定した',
        cause: '実行ファイルの互換設定',
        stepId: 'compat',
      },
    ],
    steps: [
      {
        id: 'driver',
        title: 'GPUドライバーを公式指定以上へ更新する',
        summary:
          'カプコンは、NVIDIA GeForce 596.49以上、AMD Radeon 26.5.1以上を条件としています。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'NVIDIA・AMDの公式サイトから最新のドライバーを入れる',
          'あわせてWindows Updateで最新の更新を適用する',
          'インストール後、必ずWindowsを再起動してからゲームを起動する',
        ],
        note: '公式ガイドでは、更新後の再起動を「重要」と明記しています。条件を満たすドライバーで問題が出る場合は、条件を満たす範囲で別のバージョンも試すよう案内されています。',
      },
      {
        id: 'verify',
        title: 'Steamでゲームファイルの整合性を確認する',
        summary:
          'インストール直後でも、不足・破損ファイルの修復が必要な場合があると公式が案内しています。',
        time: '5〜15分',
        risk: 'low',
        actions: [
          'PCを再起動する',
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を押す',
          '完了後にゲームを起動して確認する',
        ],
        note: '「1つ以上のファイルの検証に失敗」と表示されても、ローカルの設定ファイルであれば無視してよいと公式ガイドに記載されています。',
      },
      {
        id: 'overlay',
        title: '録画ソフトやオーバーレイを終了する',
        summary:
          'パフォーマンス表示や録画ツールなど、描画に介入するアプリはゲームを不安定にする場合があります。',
        time: '約2分',
        risk: 'low',
        actions: [
          'OBSなどの録画・配信ソフト、FPS表示ツールを終了する',
          'ブラウザなどPCの負荷が大きいアプリもできるだけ閉じる',
          'Steamとゲームだけの状態で起動して比べる',
        ],
      },
      {
        id: 'security',
        title: '保護履歴の検出内容を確認する',
        summary:
          '公式は除外設定にも言及していますが、一律の除外は検査範囲を狭めます。まず検出内容と対象ファイルを確認します。',
        time: '約5分',
        risk: 'medium',
        actions: [
          String.raw`保護履歴の検出名・時刻・対象ファイルを確認し、Steamから入れた正規のOnimushaWotS.exeへの検出か確かめる`,
          String.raw`ゲームファイルを確認し、検出がある場合はセキュリティソフトの提供元かカプコンに相談する。Steam全体やデータフォルダを一律に除外しない`,
          '誤検知と確認できた場合に限り提供元の指示で対象を絞って判断する。変更内容を記録し、不要な除外は残さない',
        ],
        note: '設定方法はセキュリティソフトごとに異なります。各ソフトの案内に従ってください。',
      },
      {
        id: 'gpu-select',
        title: 'ゲームを高パフォーマンスGPUで動かす',
        summary:
          '内蔵GPUと外部GPUを持つノートPCなどでは、ゲームが内蔵GPUで動くことがあります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windowsの「設定」→「システム」→「ディスプレイ」→「グラフィック」を開く',
          '一覧からゲームを選ぶ（ない場合は「参照」でOnimushaWotS.exeを登録する）',
          '「オプション」で「高パフォーマンス」を選び、ゲームを再起動する',
        ],
        note: 'ノートPCは充電器をつなぎ、電源設定も高パフォーマンスにします。公式ガイドではモバイルGPU・外付けGPUは基本的に動作保証の対象外とされています。',
      },
      {
        id: 'compat',
        title: '互換モードを解除する',
        summary:
          '互換モードが有効だと正しく起動しない場合があるため、公式はオフにするよう案内しています。',
        time: '約2分',
        risk: 'low',
        actions: [
          'インストール先のOnimushaWotS.exeを右クリック→「プロパティ」→「互換性」を開く',
          '「互換モードでこのプログラムを実行する」のチェックを外す',
          '改善しない場合は、Steam.exeの互換モードも同じようにオフにする',
        ],
      },
    ],
    avoid: [
      '起動させるために保護機能を停止したり、出所不明の隔離ファイルを復元したりしない',
      'Windows Insider Programなどの一般提供前のWindowsで問題を切り分けない（公式に動作保証外）',
      '複数の対処を同時に行わない。1つ試すごとに起動を確認する',
    ],
    cautions: [
      'config.iniやシェーダーキャッシュを変更する前に、別の場所へコピーしてください。',
      '公式ガイドが更新された場合は、新しい内容を優先してください。',
    ],
    faqs: [
      {
        question: 'Windows 10でも遊べますか？',
        answer:
          'Steamストアの最低動作環境・推奨動作環境はどちらも「Windows 11」と記載されています。公式は最低要件を満たさないPCへの技術サポートを正式には提供していません。',
      },
      {
        question: 'ロード画面で止まったまま進みません。',
        answer:
          'STEP 1のドライバー更新と再起動、STEP 2の整合性確認を行い、STEP 3で録画ソフトなどを終了してから起動し直してください。改善しない場合は、CrashReportの記事の手順で情報をまとめてカプコンのサポートへ問い合わせます。',
      },
      {
        question: 'Windows のNエディションを使っています。',
        answer:
          'Windows NまたはKNエディションでは動画再生に必要なコーデックが入っていない可能性があるため、公式ガイドはMicrosoftの「Media Feature Pack」のインストールを案内しています。',
      },
    ],
    sources: [
      {
        label: 'Microsoft：Windowsセキュリティの除外設定の注意',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      sources.capcom,
      sources.steam,
    ],
    related: [
      'gpu-driver-version',
      'crash-report',
      'shader-cache',
      'black-screen',
    ],
    metaDescription:
      '鬼武者 Way of the Sword PC版が起動しない・クラッシュする時の対処法。カプコン公式ガイドのドライバー条件（NVIDIA 596.49／AMD 26.5.1以上）、整合性確認、録画ソフト停止、保護履歴の確認を症状別に解説。',
  }),
  make({
    slug: 'crash-report',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: '鬼武者 Way of the SwordのCrashReportの場所【PC版】',
    category: 'launch',
    title:
      '鬼武者 Way of the SwordのCrashReportの場所とカプコンへの問い合わせ準備【PC版】',
    shortTitle: 'CrashReportの場所',
    symptom:
      'クラッシュ後に作られるレポートの場所を知りたい、カプコンのサポートへ問い合わせる前に必要な情報をそろえたい人向けです。',
    conclusion: String.raw`クラッシュ時には、標準で「C:\Program Files (x86)\Steam\steamapps\common\OnimushaWotS」に「CrashReport」フォルダが作られ、発生日時をファイル名にしたzipがほとんどの場合に出力されます。問題が起きた日時に一番近いzipを残しておきます。`,
    description:
      'カプコンの公式ガイドは、問い合わせ時にPCのスペック・グラフィック設定・現象の詳細・再現手順・クラッシュレポートを伝えるよう案内しています。この記事の手順で、一度にそろえられます。',
    causes: [],
    quickFacts: [
      {
        label: 'CrashReportの場所（標準）',
        value: String.raw`C:\Program Files (x86)\Steam\steamapps\common\OnimushaWotS\CrashReport`,
        copy: true,
      },
      { label: 'ファイル名', value: '発生日時（zip形式）' },
      {
        label: '保存先の表示',
        value: '保存完了時にクラッシュツールの画面に表示される',
      },
      {
        label: '一緒に用意するもの',
        value: 'DxDiag.txt、config.ini、発生状況と再現手順、スクリーンショット',
      },
    ],
    diagnosis: [
      {
        symptom: 'CrashReportフォルダの場所が分からない',
        cause: 'Steamのインストール先が標準と違う',
        stepId: 'open',
      },
      {
        symptom: 'zipが複数あってどれか分からない',
        cause: 'クラッシュのたびに日時付きで作られる',
        stepId: 'choose',
      },
      {
        symptom: '問い合わせに何を書けばよいか分からない',
        cause: '公式が求める情報が5種類ある',
        stepId: 'report',
      },
    ],
    steps: [
      {
        id: 'open',
        title: 'CrashReportフォルダを開く',
        summary: 'Steamから開けば、インストール先が標準と違っても迷いません。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「管理」→「ローカルファイルを閲覧」を選ぶ',
          '開いたOnimushaWotSフォルダ内の「CrashReport」フォルダを開く',
          'フォルダがない場合は、クラッシュ時のツール画面に表示された保存先を確認する',
        ],
      },
      {
        id: 'choose',
        title: '発生日時に一番近いzipを残す',
        summary:
          'ファイル名が発生日時になっているので、クラッシュした時刻と照合します。',
        time: '約1分',
        risk: 'low',
        actions: [
          'クラッシュした日時をメモする',
          'ファイル名が一番近いzipを、デスクトップなど分かりやすい場所へコピーする',
          '元のzipは削除しない（調査のため提供を求められる場合がある）',
        ],
      },
      {
        id: 'report',
        title: '公式が求める情報をそろえる',
        summary: 'カプコンの公式ガイドが問い合わせ時に求めている情報です。',
        time: '約10分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「情報をすべて保存」でDxDiag.txtを作る（CPU・GPU・VRAM・メモリ・OSの情報が入る）',
          'インストール先にあるconfig.ini（グラフィック設定）のコピーを用意する',
          '「いつ・どこで・キャラクターが何をしていた時に」起きたか、再起動で直ったか、再現手順と頻度を書き出す',
          '画面の問題はスクリーンショットを用意し、動画はYouTubeに限定公開でアップしてリンクを伝える',
        ],
        note: 'セキュリティソフトの名前、モニターの型番、HDMIケーブルの型番と4K・HDR対応の有無も、公式が求める情報に含まれています。',
      },
    ],
    avoid: [
      'CrashReportのzipを整理のつもりで削除しない',
      'config.iniを編集した状態のまま問い合わせない（編集した場合はその旨を伝える）',
    ],
    cautions: [
      '問い合わせ情報には個人情報を含めないよう、スクリーンショットの内容も確認してください。',
    ],
    faqs: [
      {
        question: 'CrashReportフォルダが作られていません。',
        answer:
          '公式ガイドでは、zipは「ほとんどの場合に」出力されると説明されています。保存先は保存完了時にクラッシュツールの画面に表示されるため、その表示も確認してください。作られない場合は、DxDiag.txtと再現手順だけでも問い合わせに役立ちます。',
      },
      {
        question: 'Steamを別のドライブに入れています。',
        answer:
          'STEP 1のとおり、Steamの「ローカルファイルを閲覧」から開くと、実際のインストール先のOnimushaWotSフォルダが開きます。',
      },
      {
        question: '動画やファイルが大きくて送れません。',
        answer:
          '動画はYouTubeに限定公開でアップロードしてリンクを伝えるよう案内されています。大きなデータを直接送りたい場合は、問い合わせ時にその旨を伝えると、個別にアップロード環境が用意されます。',
      },
    ],
    sources: [sources.capcom],
    related: ['not-launching', 'gpu-driver-version', 'shader-cache'],
    metaDescription:
      '鬼武者 Way of the Sword PC版のクラッシュレポートは、標準でSteamのOnimushaWotS\\CrashReportに発生日時のzipとして保存されます。コピーできるパスと、カプコンへの問い合わせ前にそろえる情報を解説。',
  }),
  make({
    slug: 'low-fps',
    checkedAt: '2026-10-03',
    targetVersion: 'Steam版・2026年10月3日にFPSとGPUの切り分け手順を再確認',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: '鬼武者 Way of the Swordが重い・FPSが低い時の設定【PC版】',
    category: 'display',
    title:
      '鬼武者 Way of the Swordが重い・FPSが低い・カクつく時の設定と対処法【PC版】',
    shortTitle: 'FPS低下・不安定',
    symptom:
      'PC版が重い、フレームレートが低い・安定しない、場面によって急にカクつく、ノートPCで重い、録画・配信中に重い場合の確認手順です。',
    conclusion:
      'カプコンの公式ガイドは、フレームレートが安定しない場合に「設定＞グラフィックス＞グラフィックプリセット」を「最低」にするよう案内しています。あわせてGPUドライバーを公式指定以上へ更新し、ノートPCは電源と排熱を確認します。',
    description:
      '公式の目安では、最低動作環境で「低」設定・1080p（アップスケール使用）30fps、推奨環境で「中」設定・1080p（アップスケール使用）60fpsです。自分のPCがどちらに近いかを先に確認すると、目指す設定が決めやすくなります。',
    causes: [
      'カプコン指定より古いGPUドライバー',
      'PCの性能に対して高すぎる描画設定',
      'ノートPCの省電力状態や排熱不足',
      '複数GPU環境でのGPU選択や電源設定の影響',
      '録画・配信など、同時に動くアプリによる負荷',
    ],
    quickFacts: [
      {
        label: '公式が最初に案内する設定',
        value: 'グラフィックプリセット「最低」',
      },
      {
        label: '最低環境の目安',
        value: 'GTX 1660・RX 5500 XT：「低」1080p（アップスケール）30fps',
      },
      {
        label: '推奨環境の目安',
        value: 'RTX 2060 Super・RX 6600：「中」1080p（アップスケール）60fps',
      },
      {
        label: '超解像技術',
        value: 'DLSS・FSRに対応（DLSSは対応するGeForce RTXが必要）',
      },
      {
        label: 'フレームレート上限',
        value: '30〜360fpsで設定、または上限なし（PCGamingWiki）',
      },
    ],
    diagnosis: [
      {
        symptom: '全体的にFPSが低い',
        cause: '解像度・画質の負荷を、同じ場面で比較する',
        stepId: 'step-2',
      },
      {
        symptom: 'ドライバーを長く更新していない',
        cause: '公式指定より古いGPUドライバー',
        stepId: 'step-1',
      },
      {
        symptom: 'ノートPCで重い、しばらく遊ぶと重くなる',
        cause: '電源・通気を確認し、時間の経過による変化を比較する',
        stepId: 'step-3',
      },
      {
        symptom: '30fps・60fpsなど、一定の値から上がらない',
        cause: '現在のFPS上限と一致しているかを先に確認する',
        stepId: 'step-4',
      },
      {
        symptom: '画質を下げても目標FPSに届かない／録画・配信中だけ重い',
        cause: 'GPUの選択・同時アプリの影響を一つずつ切り分ける',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'GPUドライバーを公式指定以上へ更新する',
        summary: 'NVIDIA 596.49以上、AMD 26.5.1以上が公式の条件です。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「ディスプレイ」タブでGPU名とドライバーのバージョンを確認する',
          'NVIDIA・AMDの公式サイト（ノートPCはPCメーカーの案内も確認）から対応版を入れる',
          'インストール後にWindowsを再起動し、同じ場面でFPSを比べる',
        ],
      },
      {
        id: 'step-2',
        title: 'グラフィックプリセットを「最低」にして比べる',
        summary: 'カプコンの公式ガイドが案内している方法です。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Steamの「設定」→「ゲーム中（In Game）」でパフォーマンスモニターを表示する。解像度・画質・超解像・フレーム生成・FPS上限を控え、読み込みが落ち着いた同じ場所・視点でFPSの範囲を記録する。フレーム生成を使う場合は、生成分を含む表示とゲーム本来のFPSを区別して比較する',
          '「設定」→「グラフィックス」→「グラフィックプリセット」を「最低」にして、同じ場所でFPSを比べる',
          '改善したら、解像度や画質を1項目ずつ戻し、重くなる項目を見つける。ほとんど変わらないなら設定を下げ続けず、一定値で頭打ちならSTEP 4、目標値を下回るならSTEP 5へ進む',
        ],
      },
      {
        id: 'step-3',
        title: '電源設定と排熱を確認する',
        summary: '高温や省電力状態では、PCが性能を落として動くことがあります。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ノートPCは充電器をつなぎ、変更前の電源モードを控える。Windows 11では「設定」→「システム」→「電源とバッテリー」→「電源モード」でBest performance（最適なパフォーマンス）を選び、同じ場面で比較する。電源接続時とバッテリー使用時が分かれている場合は、電源接続時の設定を変更する。項目がない場合は、メーカーの電源管理やコントロールパネルの「電源オプション」を確認し、対応する項目がある場合だけ変更する。改善しなければ元に戻す',
          'USB Type-Cで給電するノートPCは、給電用の正しいポートと対応ケーブルを使っているか確認する',
          'PCを壁から離して通気を確保する。フレームレート上限を抑えると発熱を減らせる場合もある',
        ],
      },
      {
        id: 'step-4',
        title: '描画負荷とFPS上限を別々に確認する',
        summary:
          '超解像は描画負荷の軽減、FPS上限は変動や発熱の抑制が目的です。上限を下げても、すでに低いFPSそのものが上がるわけではありません。',
        time: '約5分',
        risk: 'low',
        actions: [
          'FPSが30・60など一定値で止まるなら、ゲーム内の現在の上限値を控えて照合する。上限に届いていない場合は、上限を上げるだけで性能が改善すると考えない',
          '対応するGeForce RTXではDLSS、GTX 1660などDLSS非対応のGPUではゲーム内で選べるFSRを1項目ずつ比較する。同じ解像度・場所・視点で、文字や輪郭の見え方とFPSの両方を見る',
          '変動や発熱を抑えたい場合は、その場面で維持できるFPSを目安に上限を選ぶ。60fpsを維持できないPCに一律60fpsを勧める設定ではない',
          '改善しない変更は元に戻す。目標FPSを下回ったままなら、次のGPU選択・同時アプリを確認し、設定値だけを上げ下げし続けない',
        ],
        note: '公式の動作環境の目安は、アップスケールを使った状態で測定されています。',
      },
      {
        id: 'step-5',
        title: '同時アプリと、ゲームに指定したGPUを確認する',
        summary:
          'まず同時アプリの影響を比較し、複数GPUのPCではゲームのGPU優先設定を確認します。Windowsの設定画面だけで、実際に内蔵GPUで動いたと断定はできません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'タスクマネージャーでメモリ使用率を記録し、録画・配信を止めた状態と比較する。使用率が高いだけでメモリ不足と断定しない',
          '録画・配信・ブラウザなど不要なアプリを一つずつ終了し、同じ場面のFPSを比較する。変化がなければ、同時アプリだけが原因とは考えない',
          '複数GPUのPCでは、Windows「設定」→「システム」→「ディスプレイ」→「グラフィック」でOnimushaWotS.exeを選ぶ。なければSteamの「ローカルファイルを閲覧」で実行ファイルの場所を確認して追加する。変更前を控えて「オプション」→「高パフォーマンス」を選び、ゲームを再起動して同じ場面で比較する。変化がなければ元の設定へ戻す',
        ],
        note: '最低プリセットでも改善しなければ、GPU名・ドライバー版・解像度・比較した場面・各変更の結果を記録し、カプコン公式のトラブルシューティングへ。クラッシュも起きる場合は、関連記事のCrashReportを確認します。',
      },
    ],
    avoid: [
      '画質設定をまとめて変えない。1項目ずつ変えて同じ場所で比べる',
      'PCが異常に熱い、電源が落ちる状態で遊び続けない',
    ],
    cautions: [
      '設定を変える前に、今の設定をスクリーンショットで控えてください。',
    ],
    faqs: [
      {
        question: '推奨環境を満たしていれば60fpsで遊べますか？',
        answer:
          'Steamストアでは、推奨環境で「中」設定・1080p（アップスケール使用）60fpsが目安とされています。負荷の大きい場面ではフレームレートが低下する場合があるとも記載されています。',
      },
      {
        question: '配信しながら遊ぶと重くなります。',
        answer:
          'Steamストアの動作環境には、動画の撮影や配信などと併用する場合は環境に応じてメモリの追加を推奨すると書かれています。まずは不要なアプリを終了し、タスクマネージャーでメモリの使用率を確認してください。',
      },
      {
        question: 'ノートPCでも遊べますか？',
        answer:
          'カプコンの公式ガイドでは、モバイルGPUや外付けGPUは基本的に動作保証の対象外とされています。遊ぶ場合は、充電器の接続、高パフォーマンスの電源設定、高パフォーマンスGPUの選択を確認してください。',
      },
      {
        question: '購入前に、自分のPCで重いかどうか確かめられますか？',
        answer:
          'Steamで無料の体験版（鬼武者 Way of the Sword DEMO）が配信されています。体験版で、この記事の手順2の方法で同じ場面のFPSを測っておくと、製品版でどの設定を選べばよいかの目安になります。',
      },
    ],
    sources: [
      sources.capcom,
      sources.steam,
      {
        label: 'Steamストア：鬼武者 Way of the Sword DEMO（無料体験版）',
        url: 'https://store.steampowered.com/app/3974650/',
      },
      sources.pcgw,
      {
        label: 'NVIDIA公式：DLSSの対応GPU（英語）',
        url: 'https://forums.developer.nvidia.com/t/dlss-4-faq/321939',
      },
      {
        label: 'Steam公式：ゲーム内パフォーマンスモニターとフレーム生成',
        url: 'https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767',
      },
      {
        label: 'Microsoft公式：Windows PCの電源モードを変更する',
        url: 'https://support.microsoft.com/en-us/windows/change-the-power-mode-for-your-windows-pc-c2aff038-22c9-f46d-5ca0-78696fdf2de8',
      },
    ],
    related: [
      'gpu-driver-version',
      'shader-cache',
      'not-launching',
      'black-screen',
    ],
    metaDescription:
      '鬼武者 Way of the Sword PC版が重い・FPSが低い時の対処法。公式が案内するグラフィックプリセット「最低」、最低・推奨環境ごとのfps目安、DLSS・FSRとFPS上限、ノートPCの電源と排熱、配信時のメモリまで解説。',
  }),
  make({
    slug: 'shader-cache',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: '鬼武者 Way of the Swordのshader.cache削除・再構築【PC版】',
    category: 'settings',
    title:
      '鬼武者 Way of the Swordのshader.cacheの場所と削除・再構築方法【PC版】',
    shortTitle: 'shader.cache再構築',
    symptom:
      'アップデートやドライバー更新の後に描画がおかしい、動作が不安定な時に、シェーダーキャッシュを作り直したい人向けです。',
    conclusion:
      'カプコンの公式ガイドでは、ゲームが不安定な場合、OnimushaWotS.exeがあるインストールフォルダの「shader.cache」「shader.cache2」を削除するよう案内しています。この記事では、元に戻せるよう削除ではなく別の場所へ移してから再生成させます。',
    description:
      'シェーダーキャッシュが破損しているとグラフィックの問題が起きることがあります。公式ガイドは、ゲームが作るキャッシュに加えて、グラフィックドライバーが作るキャッシュの削除も案内しています。',
    causes: [
      'アップデート前に作られたshader.cacheの破損・不整合',
      'グラフィックドライバー側のシェーダーキャッシュの破損',
    ],
    quickFacts: [
      { label: '場所（標準）', value: installDir, copy: true },
      { label: '対象ファイル', value: '「shader.cache」と「shader.cache2」' },
      {
        label: 'ファイルがない場合',
        value: 'この作業は不要（公式ガイドの記載）',
      },
      {
        label: 'ドライバー側のキャッシュ',
        value: '削除方法はGPUメーカーの案内に従う',
      },
    ],
    diagnosis: [
      {
        symptom: 'アップデート後に描画が乱れる・不安定',
        cause: 'ゲームのシェーダーキャッシュの不整合',
        stepId: 'step-2',
      },
      {
        symptom: 'GPUドライバー更新後から不安定',
        cause: 'ドライバー側のシェーダーキャッシュ',
        stepId: 'step-4',
      },
      {
        symptom: 'shader.cacheが見つからない',
        cause: 'まだ作られていない',
        stepId: 'step-2',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'インストールフォルダを開き、ゲームとSteamを終了する',
        summary: 'ファイルを使用中の状態で移動しないようにします。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「管理」→「ローカルファイルを閲覧」でフォルダを開いておく',
          'ゲームを終了し、Steamもメニューの「終了」で閉じる',
        ],
      },
      {
        id: 'step-2',
        title: 'shader.cacheとshader.cache2を別の場所へ移す',
        summary: '公式は削除を案内していますが、元に戻せるよう移動で試します。',
        time: '約1分',
        risk: 'medium',
        actions: [
          'OnimushaWotS.exeと同じフォルダで「shader.cache」「shader.cache2」を探す',
          'あったファイルだけをデスクトップなどに作ったフォルダへ移す',
          'どちらも見つからない場合は、この作業は不要。ほかのファイルは消さない',
        ],
      },
      {
        id: 'step-3',
        title: 'ゲームを起動して作り直させる',
        summary: '起動するとシェーダーキャッシュが新しく作られます。',
        time: '数分',
        risk: 'low',
        actions: [
          'Steamからゲームを起動する',
          '起動直後はキャッシュを作り直すため、しばらく動作が重くなる場合がある',
          '同じ場面で比べ、改善したら移したファイルは削除してよい。悪化したら元へ戻す',
        ],
      },
      {
        id: 'step-4',
        title: 'グラフィックドライバー側のキャッシュも見直す',
        summary:
          '公式ガイドは、ドライバーが作るシェーダーキャッシュの削除も案内しています。',
        time: '約5分',
        risk: 'medium',
        actions: [
          'ゲームのキャッシュを作り直しても改善しない場合に行う',
          '削除方法はNVIDIA・AMDなどGPUメーカーの案内に従う（公式ガイドもGPUメーカーへの確認を案内）',
          '削除後はPCを再起動してからゲームを起動する',
        ],
      },
    ],
    avoid: [
      'インストールフォルダ内のほかのファイルをまとめて削除しない',
      'ゲーム起動中にキャッシュを移動しない',
    ],
    cautions: ['移したファイルは、改善を確認するまで残しておいてください。'],
    faqs: [
      {
        question: 'shader.cacheを消しても大丈夫ですか？',
        answer:
          'カプコンの公式ガイドが、ゲームが不安定な場合の対処として削除を案内しているファイルです。次に起動した時に作り直されます。心配な場合は、この記事のように移動して試してください。',
      },
      {
        question: 'shader.cacheが見つかりません。',
        answer:
          '公式ガイドでは、「shader.cache」「shader.cache2」がない場合は、この作業は不要とされています。',
      },
      {
        question: 'セーブデータは消えませんか？',
        answer:
          'セーブデータはインストールフォルダとは別の場所（Steam版はSteamフォルダ内のuserdata）に保存されるため、shader.cacheの移動では消えません（PCGamingWiki）。',
      },
    ],
    sources: [sources.capcom, sources.pcgw],
    related: ['low-fps', 'not-launching', 'black-screen', 'gpu-driver-version'],
    metaDescription:
      '鬼武者 Way of the SwordのシェーダーキャッシュはOnimushaWotS.exeと同じフォルダの「shader.cache」「shader.cache2」。公式ガイドに沿った削除・再構築の手順と、ドライバー側のキャッシュまで解説。',
  }),
  make({
    slug: 'black-screen',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: '鬼武者 Way of the Swordが黒画面・映らない時の対処法【PC版】',
    category: 'settings',
    title:
      '鬼武者 Way of the Swordが黒画面・映らない・ちらつく時の対処法【PC版】',
    shortTitle: '黒画面・映らない',
    symptom:
      'ゲームは起動するのに画面が真っ黒、激しくちらつく、一部しか映らない時の対処です。',
    conclusion:
      'カプコンの公式ガイドでは、画面が映らない・ちらつく・一部しか映らない場合、オプションの「スクリーンモード」「画面解像度」「垂直同期」「HDR出力」を調整するよう案内しています。録画ソフトの停止とモニター側の設定確認も合わせて行います。',
    description:
      '画面が見えないと設定を変えられないため、まず表示を取り戻す操作から始めます。',
    causes: [
      '保存された解像度・スクリーンモードがモニターと合っていない',
      '垂直同期やHDR出力の設定',
      '録画ソフトのゲームキャプチャーなど、描画に介入するアプリ',
      'モニターやケーブルが解像度・HDRに対応していない',
    ],
    quickFacts: [
      {
        label: '公式が挙げる調整項目',
        value: 'スクリーンモード／画面解像度／垂直同期／HDR出力',
      },
      {
        label: '選べる表示方式',
        value: 'フルスクリーン・ウィンドウ・ボーダーレス（PCGamingWiki）',
      },
      {
        label: '見落としやすい原因',
        value: '録画ソフトのゲームキャプチャー、HDMIケーブルの4K・HDR対応',
      },
    ],
    diagnosis: [
      {
        symptom: '起動すると真っ黒で何も見えない',
        cause: '保存された画面モード・解像度の不一致',
        stepId: 'step-1',
      },
      {
        symptom: 'ちらつく・一部しか映らない',
        cause: '解像度・垂直同期の設定',
        stepId: 'step-2',
      },
      {
        symptom: '録画ソフトを起動している時だけ黒い',
        cause: '描画に介入するアプリ',
        stepId: 'step-3',
      },
      {
        symptom: 'HDRをオンにしてから映らない',
        cause: 'HDR出力とモニター・ケーブルの組み合わせ',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '表示方式を切り替えて画面を取り戻す',
        summary: '画面が見えるようになれば、設定を安全な値に戻せます。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ゲームのウィンドウを選んだ状態で、Alt＋Enterを一度押す',
          '表示が戻れば、オプションの画面設定を開く',
          '戻らない場合は、見えないメニューを操作せず次のSTEPへ進む',
        ],
      },
      {
        id: 'step-2',
        title: '解像度と垂直同期を見直す',
        summary: '公式ガイドが調整を案内している項目です。1つずつ変えます。',
        time: '約3分',
        risk: 'low',
        actions: [
          '画面設定を開き、今の値をスクリーンショットで控える',
          'スクリーンモードをボーダーレスかウィンドウに、解像度をモニターの標準解像度にする',
          '次に垂直同期だけを切り替えて比べる',
        ],
      },
      {
        id: 'step-3',
        title: '録画ソフトとサブモニターを外して比べる',
        summary: '描画に介入するアプリは、ゲームを不安定にする場合があります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'OBSなどの録画・配信ソフトを終了してからゲームを起動する',
          'Windows＋Pキーで表示するモニターを1台にして比べる',
          'Steamオーバーレイをオフにして比べる。変化がなければ元に戻す',
        ],
      },
      {
        id: 'step-4',
        title: 'HDR出力をオフにし、モニターとケーブルを確認する',
        summary: 'HDRで問題が出る場合は、まずHDRなしで表示されるか確認します。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームの画面設定でHDR出力をオフにして比べる',
          'モニターの説明書を見て、入力設定や解像度・リフレッシュレートの対応を確認する',
          'HDMIケーブルが4K・HDRに対応した製品か確認する',
        ],
        note: 'HDRで使いたい場合は「HDRが白っぽい・有効にならない」記事の手順で設定し直します。',
      },
    ],
    avoid: [
      '画面が見えない状態でメニューを当てずっぽうに操作しない',
      '複数の表示設定を同時に変えない',
    ],
    cautions: [
      '変更前の設定を控えておき、改善しない場合は元に戻してください。',
    ],
    faqs: [
      {
        question: '録画ソフトを起動していると黒画面になります。',
        answer:
          'カプコンの公式ガイドは、パフォーマンスオーバーレイや録画ツールなど描画に介入するアプリがゲームを不安定にする場合があるとして、同時に起動しているアプリをできるだけ終了するよう案内しています。録画ソフトを終了した状態で起動して比べてください。',
      },
      {
        question: 'ケーブルでも変わるのですか？',
        answer:
          '公式ガイドでは、問い合わせ時の確認事項としてHDMIケーブルのブランドと型番、4K・HDRに準拠しているかを挙げています。4KやHDRで表示する場合は、対応したケーブルか確認してください。',
      },
      {
        question: 'ウルトラワイドモニターでは表示されますか？',
        answer:
          'PCGamingWikiによると21:9に対応しています。32:9では画面全体が21:9の比率で表示され、左右に黒帯が入ります。',
      },
    ],
    sources: [sources.capcom, sources.pcgw],
    related: ['hdr', 'not-launching', 'low-fps', 'shader-cache'],
    metaDescription:
      '鬼武者 Way of the Sword PC版が黒画面・映らない・ちらつく時の対処法。公式が案内するスクリーンモード・解像度・垂直同期・HDR出力の見直し、録画ソフトの停止、モニターとHDMIケーブルの確認を解説。',
  }),
  make({
    slug: 'hdr',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: '鬼武者 Way of the SwordのHDRが白っぽい時の直し方【PC版】',
    category: 'settings',
    title:
      '鬼武者 Way of the SwordのHDR設定｜白っぽい・有効にならない時の直し方【PC版】',
    shortTitle: 'HDRが白っぽい・有効にならない',
    symptom:
      'HDRを有効にできない、画面が白っぽい・暗い、UIだけまぶしい、HDRにすると表示が不安定な場合の記事です。',
    conclusion:
      '本作はHDRに対応しています（Steamストア）。先にWindowsとモニターのHDRを有効にしてから、ゲーム内のHDR出力をオンにし、最大輝度をモニターの性能に合わせてから全体の明るさを調整します。',
    description:
      'HDRの明るさ調整は、最大輝度・全体の明るさ・彩度・UIの明るさの4項目に分かれています（PCGamingWiki）。どの項目が何に効くかを知っておくと、白っぽさやまぶしさを狙って直せます。',
    causes: [
      'Windowsまたはモニター側でHDRが無効',
      '最大輝度の設定がモニターの性能と合っていない',
      'ケーブルがHDRに対応していない',
    ],
    quickFacts: [
      { label: 'HDR', value: '対応（Steamストア「HDR使用可能」）' },
      {
        label: 'ゲーム内の調整項目',
        value: '最大輝度／全体の明るさ／彩度／UIの明るさ（PCGamingWiki）',
      },
      {
        label: '先に行う設定',
        value: 'Windowsの「設定」→「システム」→「ディスプレイ」→「HDR」',
      },
      {
        label: 'Windows側の調整',
        value: 'Microsoftの「Windows HDR 調整」アプリ',
      },
    ],
    diagnosis: [
      {
        symptom: 'ゲーム内でHDRを選べない',
        cause: 'Windows・モニター側でHDRが無効',
        stepId: 'step-1',
      },
      {
        symptom: '全体が白っぽい・黒が浮く',
        cause: '最大輝度・全体の明るさの設定',
        stepId: 'step-3',
      },
      {
        symptom: 'UIや字幕だけがまぶしい',
        cause: 'UIの明るさの設定',
        stepId: 'step-3',
      },
      {
        symptom: 'HDRにすると映らない・ちらつく',
        cause: 'ケーブルやモニターの入力設定',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'WindowsとモニターのHDRを確認する',
        summary:
          'ゲームより先に、Windowsとモニター側でHDRを使える状態にします。',
        time: '約2分',
        risk: 'low',
        actions: [
          '「設定」→「システム」→「ディスプレイ」でゲームを表示するモニターを選ぶ',
          '「HDRを使用する」をオンにする。項目がない場合は、そのモニターまたは接続方法がHDRに対応していない',
          'モニター本体のメニューで、HDR入力が有効になっているか確認する',
        ],
      },
      {
        id: 'step-2',
        title: 'ゲーム内のHDR出力をオンにする',
        summary: 'Windows側とゲーム側を同時に変えないようにします。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ゲームのオプションで画面設定を開き、今の値を控える',
          'HDR出力をオンにして適用する',
        ],
      },
      {
        id: 'step-3',
        title: '最大輝度から順に明るさを合わせる',
        summary:
          '最大輝度を先に決めると、白っぽさや白飛びを直しやすくなります。',
        time: '約5分',
        risk: 'low',
        actions: [
          'まず最大輝度を、モニターが表示できる明るさに合わせる（調整画面の目印が見える範囲にする）',
          '次に全体の明るさで、暗い場面の見え方を整える',
          '色が薄い場合は彩度を、UIや字幕がまぶしい場合はUIの明るさを調整する',
        ],
      },
      {
        id: 'step-4',
        title: 'Windows HDR 調整アプリで調整する',
        summary: 'モニターが表示できる明るさを、Windowsに正しく伝えます。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Microsoft Storeから「Windows HDR 調整」アプリを入手する',
          '案内に沿って暗い部分・明るい部分・色の濃さを調整し、プロファイルを保存する',
          'ゲームを再起動して、STEP 3の設定を見直す',
        ],
      },
      {
        id: 'step-5',
        title: 'ケーブルとモニターの入力を確認する',
        summary: 'HDRにすると映らない場合は、接続側の対応を確認します。',
        time: '約3分',
        risk: 'low',
        actions: [
          'HDMIケーブルが4K・HDRに対応した製品か確認する（公式が問い合わせ時の確認事項に挙げている）',
          'モニターの説明書で、HDRで使える入力端子と設定を確認する',
          '改善しない場合はHDR出力をオフにして遊ぶ',
        ],
      },
    ],
    avoid: [
      'Windows側とゲーム側のHDR設定を同時に変えない',
      '明るさの項目をまとめて変えない。最大輝度→全体の明るさの順に1つずつ調整する',
    ],
    cautions: [
      'HDRの見え方はモニターの性能で大きく変わります。モニターの取扱説明書も確認してください。',
    ],
    faqs: [
      {
        question: 'HDRにすると全体が白っぽく見えます。',
        answer:
          '最大輝度の設定がモニターの性能と合っていない可能性があります。STEP 3のとおり、最大輝度をモニターに合わせてから全体の明るさを調整し、それでも白っぽい場合はWindows HDR 調整アプリでWindows側も調整してください。',
      },
      {
        question: 'UIや字幕だけがまぶしいです。',
        answer:
          'HDR用の設定には、ゲーム画面とは別にUIの明るさを調整する項目があります（PCGamingWiki）。UIの明るさだけを下げてください。',
      },
      {
        question: 'HDRにすると画面が映らなくなりました。',
        answer:
          'ケーブルやモニターの入力がHDRに対応していない可能性があります。「黒画面・映らない」記事の手順で表示を戻し、STEP 5でケーブルとモニターを確認してください。',
      },
    ],
    sources: [
      sources.steam,
      sources.pcgw,
      sources.capcom,
      sources.msHdr,
      sources.msHdrCalibration,
    ],
    related: ['black-screen', 'low-fps', 'not-launching'],
    metaDescription:
      '鬼武者 Way of the Sword PC版のHDR設定。Windowsとモニター側の準備、ゲーム内の最大輝度・全体の明るさ・彩度・UIの明るさの合わせ方、白っぽい・まぶしい・映らない時の直し方を解説。',
  }),
  make({
    slug: 'gpu-driver-version',
    // Shorter <title> for search results; the page heading keeps the full title.
    seoTitle: '鬼武者 Way of the SwordのGPUドライバー条件【NVIDIA・AMD】',
    category: 'launch',
    title:
      '鬼武者 Way of the SwordのGPUドライバー条件｜NVIDIA 596.49・AMD 26.5.1以上【PC版】',
    shortTitle: 'GPUドライバー対応版',
    symptom:
      '必要なNVIDIA・AMDのドライバーのバージョンを知りたい、自分のバージョンの確かめ方が分からない、更新しても不具合が続く場合の記事です。',
    conclusion:
      'カプコンの公式ガイドが指定する条件は、NVIDIA GeForce 596.49以上、AMD Radeon 26.5.1以上です。更新後は必ずWindowsを再起動します。条件を満たしても問題が出る場合は、条件の範囲で別のバージョンやクリーンインストールを試します。',
    description:
      '古いドライバーでは、起動しない・動作中に停止する・表示が乱れるなどの問題が起きる可能性があると公式が説明しています。',
    causes: [
      'NVIDIA 596.49、AMD 26.5.1より古いドライバー',
      '更新後にWindowsを再起動していない',
      '古いドライバーのファイルや設定の残り',
    ],
    quickFacts: [
      driverFact,
      {
        label: '更新後にすること',
        value: 'Windowsの再起動（公式ガイドで「重要」と明記）',
      },
      {
        label: 'dxdiagでの見分け方（NVIDIA）',
        value: '「32.0.15.9649」なら末尾5桁「59649」→ 596.49',
      },
      {
        label: 'Intel GPU',
        value: '公式ガイドにはNVIDIAとAMDの条件のみ記載',
      },
    ],
    diagnosis: [
      {
        symptom: '自分のドライバーのバージョンが分からない',
        cause: 'dxdiagの表記がドライバー名の番号と違う',
        stepId: 'step-1',
      },
      {
        symptom: '条件より古い',
        cause: '更新が必要',
        stepId: 'step-2',
      },
      {
        symptom: '更新したのに直らない',
        cause: '再起動していない、古いファイルが残っている',
        stepId: 'step-3',
      },
      {
        symptom: '条件を満たしているのに不具合が出る',
        cause: 'ドライバーとの相性、設定の残り',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '今のGPUとドライバーのバージョンを確認する',
        summary: 'NVIDIAはdxdiagの番号から、AMDはAMD Softwareで確認できます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Windows＋Rキーで「dxdiag」を実行し、「ディスプレイ」タブのGPU名とドライバーのバージョンを控える',
          'NVIDIAは、表示された番号（例：32.0.15.9649）の最後の5桁「59649」を「596.49」と読む',
          'AMDは、dxdiagの番号とドライバーのバージョンの表記が異なるため、AMD Softwareでバージョンを確認する',
        ],
      },
      {
        id: 'step-2',
        title: 'メーカー公式サイトから対応版へ更新する',
        summary: 'NVIDIA・AMDの公式サイトから入手します。',
        time: '10〜20分',
        risk: 'low',
        actions: [
          'NVIDIAはNVIDIA公式サイト、AMDはAMD公式サイトから最新版を入手する（ノートPCはPCメーカーの案内も確認）',
          'インストールする',
          'あわせてWindows Updateで最新の更新を適用する',
        ],
      },
      {
        id: 'step-3',
        title: 'Windowsを再起動し、ゲームだけで確認する',
        summary:
          '再起動でGPUが再初期化されます。公式ガイドで「重要」とされている手順です。',
        time: '約5分',
        risk: 'low',
        actions: [
          '更新が終わったらWindowsを再起動する',
          '録画・配信アプリを閉じ、Steamとゲームだけで同じ場面を確認する',
          '更新前後のドライバーのバージョンと症状をメモする',
        ],
      },
      {
        id: 'step-4',
        title: '条件の範囲で別の版・クリーンインストールを試す',
        summary:
          '条件を満たしていても問題が出る場合に、公式ガイドが案内している方法です。',
        time: '20〜30分',
        risk: 'high',
        actions: [
          '条件（NVIDIA 596.49以上・AMD 26.5.1以上）を満たす範囲で、別のバージョンを試す',
          '改善しない場合は、古いドライバーを完全に削除してから入れ直す（クリーンインストール）。公式ガイドでは、多くの人が使うツールとしてDisplay Driver Uninstaller（DDU、サードパーティー製）が紹介されている',
          '入れ直した後にPCを再起動し、最新のDirectXエンドユーザーランタイムを実行して再起動する',
        ],
        note: 'DDUは公式ではないツールです。使う場合は配布元の説明をよく読み、作業前に復元ポイントを作ってください。',
      },
    ],
    avoid: [
      '非公式の配布サイトからドライバーを入手しない',
      'ドライバー更新後、再起動せずにゲームを起動しない',
    ],
    cautions: [
      'ノートPCは、PCメーカーが配布するドライバーの案内も確認してください。',
    ],
    faqs: [
      {
        question: 'dxdiagの番号が「596.49」の形になっていません。',
        answer:
          'NVIDIAのドライバーは、dxdiagでは「32.0.15.9649」のような形式で表示されます。最後の5桁（この例では「59649」）が「596.49」を表します。AMDは表記の対応が異なるため、AMD Softwareで確認してください。',
      },
      {
        question: 'Intel ArcなどIntelのGPUではどの版が必要ですか？',
        answer:
          '2026年9月27日時点のカプコン公式ガイドには、NVIDIA GeForceとAMD Radeonの条件だけが記載されています。Intel製GPUはIntel公式サイトの最新ドライバーを使ってください。',
      },
      {
        question: '最新版より古い版を使ってもいいですか？',
        answer:
          '公式ガイドは、条件を満たしたドライバーで問題が出る場合、条件を満たす範囲で他のバージョンも試すよう案内しています。条件より古い版は使わないでください。',
      },
    ],
    sources: [sources.capcom],
    related: ['not-launching', 'low-fps', 'black-screen', 'crash-report'],
    metaDescription:
      '鬼武者 Way of the Sword PC版に必要なGPUドライバーはNVIDIA 596.49以上・AMD 26.5.1以上（カプコン公式）。dxdiagでのバージョンの読み方、更新後の再起動、直らない時のクリーンインストールまで解説。',
  }),
];
