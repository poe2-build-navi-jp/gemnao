import type { GameArticle } from '@/lib/game-articles';

// 2026年9月下旬に発売された（される）3作品の個別記事。
// 2026-09-28に開発元の公式ヘルプ・公式のお知らせ・Steamストア・PCGamingWikiで
// 確認した内容だけを載せています。
// STEPのidは解決報告（D1）の集計キーなので、公開後は変更しないでください。

type Draft = Omit<
  GameArticle,
  'checkedAt' | 'symptoms' | 'seoTitle' | 'status'
> & { seoTitle?: string; checkedAt?: string };

const make = (draft: Draft): GameArticle => ({
  checkedAt: '2026-09-28',
  status: 'verified',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const steamVerify =
  'Steam：ライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」';
const epicVerify =
  'Epic Games Launcher：ライブラリでゲームの「…」→「管理」→「確認」';

const controlSources = {
  knownIssues: {
    label: 'Remedy公式ヘルプ：既知の問題とアップデート（英語）',
    url: 'https://remedy.helpshift.com/hc/en/5-control-resonant/faq/314-resonance-disruption-known-issues-and-updates/',
  },
  audio: {
    label: 'Remedy公式ヘルプ：音声のトラブルシューティング（英語）',
    url: 'https://remedy.helpshift.com/hc/en/5-control-resonant/faq/254-sound-and-audio-troubleshooting-for-control-resonant/',
  },
  saves: {
    label: 'Remedy公式ヘルプ：PC版のセーブデータの場所（英語）',
    url: 'https://remedy.helpshift.com/hc/en/5-control-resonant/faq/304-where-to-find-control-resonant-save-files-on-pc/',
  },
  news: {
    label: 'Steamニュース（公式）：発売時のホットフィックス1.3.3・今後の予定',
    url: 'https://store.steampowered.com/news/app/3669870',
  },
  steam: {
    label: 'Steamストア：CONTROL Resonant（動作環境）',
    url: 'https://store.steampowered.com/app/3669870/',
  },
  pcgw: {
    label: 'PCGamingWiki：Control Resonant（設定ファイル・画面設定）',
    url: 'https://www.pcgamingwiki.com/wiki/Control_Resonant',
  },
};

const townfallSources = {
  news: {
    label:
      'Steamニュース（公式）：アップデートの予定・DLCが反映されない問題の解消',
    url: 'https://store.steampowered.com/news/app/1636440',
  },
  patch131: {
    label:
      'Steamニュース（公式）：Game Update (Patch 1.3.1)（シェーダーのプリコンパイルによるカクつきを軽減）',
    url: 'https://store.steampowered.com/news/app/1636440',
  },
  steam: {
    label: 'Steamストア：SILENT HILL: Townfall（動作環境）',
    url: 'https://store.steampowered.com/app/1636440/',
  },
  pcgw: {
    label: 'PCGamingWiki：Silent Hill: Townfall（保存場所・画面設定）',
    url: 'https://www.pcgamingwiki.com/wiki/Silent_Hill:_Townfall',
  },
};

const dungeonsSources = {
  systems: {
    label:
      'Minecraft公式：Minecraft Dungeons IIの新しいゲームシステム（協力プレイ・クロスプレイ）',
    url: 'https://www.minecraft.net/en-us/article/minecraft-dungeons-ii-gameplay-systems',
  },
  steam: {
    label:
      'Steamストア：Minecraft Dungeons II（動作環境・Microsoftアカウント）',
    url: 'https://store.steampowered.com/app/1912410/',
  },
  cape: {
    label:
      'Steamニュース（公式）：Hero Cape（同じMicrosoftアカウントで受け取り）',
    url: 'https://store.steampowered.com/news/app/1912410',
  },
  deck: {
    label: 'Steamニュース（公式）：New Update: Steam Deck Playable（10月1日）',
    url: 'https://store.steampowered.com/news/app/1912410',
  },
};

export const fallReleaseArticles: GameArticle[] = [
  make({
    gameSlug: 'control-resonant',
    slug: 'crash-performance',
    category: 'launch',
    seoTitle: 'CONTROL Resonantが落ちる・重い・音が途切れる時の対処法【PC版】',
    title:
      'CONTROL Resonant（コントロール レゾナント）が落ちる・重い・音が途切れる時の対処法【PC版】',
    shortTitle: 'クラッシュ・重い・音の不具合',
    targetVersion:
      'Steam版・Epic版（ホットフィックス1.3.3）・2026年9月28日時点',
    symptom:
      'プレイ中に落ちる、急にfpsが下がる、音がパチパチする・途切れる・ずれる、コントローラーが再接続できない、クエストが進まない場合の確認手順です。',
    conclusion:
      'AMD Radeon RX 7000・9000シリーズで重い場合は、Remedyが既知の問題として認めており、AMDが対策ドライバーを準備中です。レイトレーシングの設定を変えた後に急に重くなった場合は、ゲームを再起動すれば直ります（公式の回避策）。音の不具合は、Windowsの出力先と音声設定の見直しから始めます。',
    description:
      'Remedyの公式ヘルプには既知の問題の一覧があり、掲載された問題はすべて次のアップデートで修正予定とされています。まず自分の症状が一覧にあるかを確認すると、無駄な作業を避けられます。',
    causes: [
      'AMD Radeon RX 7000・9000シリーズでの性能の問題（公式の既知の問題）',
      'レイトレーシングの設定変更による急なfps低下（公式の既知の問題）',
      '古いGPUドライバー・破損したゲームファイル',
      'Windowsの音声出力先・音声強化機能・サンプリングレートの不一致',
      'Steam Input使用中にコントローラーの接続が切れた（公式の既知の問題）',
    ],
    quickFacts: [
      {
        label: 'セーブデータ（Steam版）',
        value: String.raw`C:\Program Files (x86)\Steam\userdata\<Steam ID>\3669870`,
        copy: true,
      },
      {
        label: 'セーブデータ（Epic版）',
        value: String.raw`%LocalAppData%\Remedy\CONTROLResonant`,
        copy: true,
      },
      {
        label: '最低動作環境',
        value:
          'GTX 1070・RX 5600 XT・Arc A580／メモリ16GB／SSD 120GB（Windows 10/11）',
      },
      {
        label: '推奨動作環境',
        value: 'RTX 3060 Ti・RX 6700 XT・Arc B580／メモリ16GB',
      },
      {
        label: '今後の予定（公式）',
        value: 'New Game++は10月、フォトモードは11月の予定',
      },
    ],
    diagnosis: [
      {
        symptom: 'Radeon RX 7000・9000シリーズで重い・落ちる',
        cause: 'AMD環境の既知の問題',
        stepId: 'step-1',
      },
      {
        symptom: 'グラフィック設定を変えたら急に重くなった',
        cause: 'レイトレーシング設定変更の既知の問題',
        stepId: 'step-2',
      },
      {
        symptom: 'プレイ中に落ちる（GPUを問わない）',
        cause: 'ドライバー・ファイル破損',
        stepId: 'step-3',
      },
      {
        symptom: '音がパチパチする・途切れる・ずれる',
        cause: '音声出力先・Windowsの音声設定',
        stepId: 'step-4',
      },
      {
        symptom: 'コントローラーをつなぎ直しても反応しない',
        cause: 'Steam Input使用中の再接続の既知の問題',
        stepId: 'step-5',
      },
      {
        symptom: '壁が消えない・敵が倒せずクエストが進まない',
        cause: 'クエストの既知の問題',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Radeon RX 7000・9000シリーズはAMDの対策ドライバーを確認する',
        summary:
          'Remedyは、AMD Radeon RX 7000・9000シリーズで性能の問題が起きることを既知の問題として公開しています。AMDが対策ドライバーを準備中で、AMDのWebサイトから任意でダウンロードする形になる予定です。',
        time: '約10分',
        risk: 'low',
        actions: [
          'タスクマネージャーの「パフォーマンス」→「GPU」でGPU名を確認する',
          'RX 7000・9000シリーズの場合は、AMDのWebサイトで本作向けのドライバーが公開されていないか確認する',
          '公開されるまでは、グラフィック設定（特にレイトレーシング）を下げて遊ぶ',
        ],
        note: '対策ドライバーは「任意（オプション）」の配布になると案内されています。自動更新では入らない場合があります。',
      },
      {
        id: 'step-2',
        title: 'レイトレーシングの設定を変えた後はゲームを再起動する',
        summary:
          'グラフィック設定でレイトレーシングの品質を変えると、fpsが大きく下がることがあります。公式の回避策は、ゲームの再起動です（設定は保存されます）。',
        time: '約2分',
        risk: 'low',
        actions: [
          'レイトレーシングの品質を変えたら、ゲームをいったん終了する',
          '起動し直して、fpsが戻ったか確認する',
        ],
      },
      {
        id: 'step-3',
        title: 'GPUドライバーを更新し、ゲームファイルを確認する',
        summary:
          'GPUを問わずプレイ中に落ちる場合は、ドライバーとファイルの状態を確認します。',
        time: '約15分',
        risk: 'low',
        actions: [
          'NVIDIAはNVIDIA App、AMDはAMD Software: Adrenalin Editionから最新のドライバーに更新し、PCを再起動する',
          steamVerify,
          epicVerify,
          'インストール先がSSDか確認する（動作環境でSSDが必須）',
        ],
      },
      {
        id: 'step-4',
        title: '音の不具合はWindowsの音声設定を見直す',
        summary:
          'Remedyの公式ヘルプの手順に沿って確認します。ほかのアプリでも同じ症状なら、ゲームではなくWindowsや機器側の問題です。',
        time: '約15分',
        risk: 'low',
        actions: [
          'ゲームを終了し、動画などほかのアプリで同じ症状が出るか確認する',
          'ゲーム内のオーディオ設定で、Dynamic Rangeを既定値に、Mono AudioとHyperacusis Filterをオフに、BassとTrebleを0にして試す（項目名は公式ヘルプの英語表記）',
          '本作にはゲーム内で出力先を選ぶ項目がないため、Windowsの「設定」→「システム」→「サウンド」で出力先を選ぶ',
          '同じ画面で「オーディオの強化」と「空間オーディオ」を一時的にオフにする',
          '出力デバイスの「形式」（例：24ビット・48000Hz）を変えて試す',
          '仮想オーディオミキサー・イコライザー・録画や配信ソフトを閉じる',
        ],
      },
      {
        id: 'step-5',
        title: 'コントローラーが再接続できない時はゲームを再起動する',
        summary:
          'PC版では、Steam Inputを使っている時に接続が切れると、コントローラーを再接続できないことがあります（公式の既知の問題）。',
        time: '約2分',
        risk: 'low',
        actions: [
          'コントローラーをつないだ状態でゲームを再起動する',
          '途中でコントローラーを差し替えないようにする（PCGamingWikiでも、差し替え時に再起動が必要な場合があると報告）',
        ],
      },
      {
        id: 'step-6',
        title: 'クエストが進まない時は最後のチェックポイントを読み込む',
        summary:
          '公式の既知の問題として、クエストの進行が止まる症状がいくつか公開されています（クエスト名は公式ヘルプの英語表記）。',
        time: '約3分',
        risk: 'low',
        actions: [
          '「Evacuation Protocols」で12階の戦闘後にヒスの壁が消えない：最後のチェックポイントを読み込み直す',
          '「The End」で倒せない位置に敵が出現する：最後のチェックポイントを読み込み直す',
          'Fast Travel Doorを使うと衣装が外れることがある：着替え直す',
        ],
      },
    ],
    avoid: [
      'AMDの対策ドライバーを待たずに、非公式のドライバーや設定ファイルの書き換えを試さない',
      'セーブデータのフォルダの中身を編集・削除しない（バックアップは、ゲームとランチャーを閉じてからフォルダごとコピー）',
      'サポートに問い合わせる時も、SteamやEpicのパスワード・認証コードは絶対に伝えない（公式の注意）',
    ],
    cautions: [
      '既知の問題は次のアップデートで修正予定です（公式）。アップデート後は症状が変わることがあります。',
      '直らない場合は、Remedyの公式ヘルプ（remedy.helpshift.com）右下のチャットから問い合わせできます。',
    ],
    faqs: [
      {
        question: '序盤の敵が硬すぎます。',
        answer:
          '発売時のホットフィックス1.3.3で、多くの敵の体力とひるみに必要な値が下げられ、ディランの攻撃力の上限も上がりました。さらに調整したい場合は、オプションの「ゲームプレイ」にあるアシストモードで、敵の攻撃性や受けるダメージなどを個別に変えられます。',
      },
      {
        question: 'HDRにすると色が濃すぎる場所があります。',
        answer:
          'HDR使用時に一部の場所で色が濃くなりすぎる症状は、公式の既知の問題として掲載されており、次のアップデートで修正予定です。',
      },
      {
        question: 'フォトモードはありますか？',
        answer:
          '発売時点ではありません。公式は、フォトモードを11月ごろに追加する予定と発表しています。周回プレイを繰り返せる「New Game++」は10月の予定です。',
      },
    ],
    sources: [
      controlSources.knownIssues,
      controlSources.audio,
      controlSources.saves,
      controlSources.news,
      controlSources.steam,
      controlSources.pcgw,
    ],
    related: [],
    metaDescription:
      'CONTROL Resonant PC版が落ちる・重い・音が途切れる時の対処法。Radeon RX 7000/9000の既知の問題とAMDの対策ドライバー、レイトレ設定変更後の再起動、音声設定の見直し、セーブデータの場所まで公式ヘルプをもとに解説。',
  }),
  make({
    gameSlug: 'silent-hill-townfall',
    slug: 'stutter',
    category: 'display',
    checkedAt: '2026-10-01',
    seoTitle: 'SILENT HILL: Townfallが重い・カクつく時の対処法【PC版】',
    title:
      'SILENT HILL: Townfall（サイレントヒル タウンフォール）が重い・カクつく時の対処法【PC版】',
    shortTitle: '重い・カクつく',
    targetVersion:
      'Steam版・Epic版（Patch 1.3.1／v1.4.153829）・2026年10月1日時点',
    symptom:
      'PC版でカクつく、移動中に一瞬止まる、fpsが安定しない、予約特典やDLCが反映されない場合の確認手順です。',
    conclusion:
      '2026年9月30日に、シェーダーのプリコンパイルが原因のカクつきを軽減するアップデート（Patch 1.3.1）が配信されました。まずメインメニュー右下のバージョンが「v1.4.153829」になっているか確認します。適用後も重い場合は、アップスケーリングとフレームレート上限で負荷を下げて比べます。',
    description:
      '本作はUnreal Engine 5で作られており、動作環境はWindows 11です。まず動作環境を満たしているかを確認し、そのうえで設定を見直します。',
    causes: [
      'シェーダーのプリコンパイルによるカクつき（Patch 1.3.1で軽減）',
      'Windows 11ではない・動作環境を満たしていない',
      '画質や解像度に対してGPUの負荷が高い',
      '古いGPUドライバー・破損したゲームファイル',
    ],
    quickFacts: [
      {
        label: '修正パッチ',
        value:
          'Patch 1.3.1（9月30日配信）でシェーダーのプリコンパイルによるカクつきを軽減。メインメニュー右下が「v1.4.153829」なら適用済み',
      },
      {
        label: '最低動作環境',
        value:
          'Windows 11／RTX 2060 Super・RX 6600／メモリ16GB（1080p・低・30fps）',
      },
      {
        label: '推奨動作環境',
        value:
          'RTX 3080・RX 7800 XT／メモリ32GB（4K・高・30fps、アップスケールのバランス使用）',
      },
      {
        label: 'セーブデータ',
        value: String.raw`%LOCALAPPDATA%\Townfall\Saved\SaveGames`,
        copy: true,
      },
      {
        label: '設定ファイル',
        value: String.raw`%LOCALAPPDATA%\Townfall\Saved\Config\Windows`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: '設定を変えても移動中にカクつく',
        cause: 'Patch 1.3.1が未適用',
        stepId: 'step-1',
      },
      {
        symptom: 'Windows 10のPCで遊んでいる',
        cause: '動作環境を満たしていない',
        stepId: 'step-2',
      },
      {
        symptom: '全体的にfpsが低い',
        cause: 'GPUの負荷が高い',
        stepId: 'step-3',
      },
      {
        symptom: 'fpsが上下して安定しない',
        cause: 'フレームレート上限が未設定',
        stepId: 'step-4',
      },
      {
        symptom: '更新後に落ちる・表示がおかしい',
        cause: 'ドライバー・ファイル',
        stepId: 'step-5',
      },
      {
        symptom: '予約特典・DLCが反映されない',
        cause: 'DLCの解除の問題（解消済み）',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Patch 1.3.1が適用されているか確認する',
        summary:
          '2026年9月30日配信のPatch 1.3.1で、シェーダーのプリコンパイルが原因のカクつきが軽減されました（公式）。',
        time: '約2分',
        risk: 'low',
        actions: [
          'ゲームを起動し、メインメニュー右下のバージョンが「v1.4.153829」になっているか確認する',
          '古いバージョンの場合は、ゲームを終了してSteam（またはEpic Games Launcher）のダウンロード画面で更新を適用してから起動する',
          '更新の直後は、シェーダーの準備で最初の起動に時間がかかる場合がある。同じ場面で更新前と比べる',
          '今後の更新は、SteamのSILENT HILL: Townfallのページの「ニュース」で確認する',
        ],
      },
      {
        id: 'step-2',
        title: 'Windows 11と動作環境を確認する',
        summary: '動作環境では、最低・推奨ともOSがWindows 11です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Windows + R を押し、「winver」と入力してEnterを押し、「Windows 11」と表示されるか確認する',
          'タスクマネージャーの「パフォーマンス」→「GPU」でGPU名を確認し、RTX 2060 Super・RX 6600以上か確認する',
          'メモリは最低16GB、推奨32GB',
        ],
      },
      {
        id: 'step-3',
        title: 'アップスケーリングを使い、重い設定を下げる',
        summary:
          '本作はDLSS 4・FSR 4・TSR・TAAUに対応しています。公式の推奨環境の目安も、アップスケーリング（バランス）を使った数値です。',
        time: '約5分',
        risk: 'low',
        actions: [
          'グラフィック設定でDLSS（NVIDIA）・FSR（AMDなど）・TSRのいずれかを選び、品質を「バランス」や「パフォーマンス」にする',
          'ハードウェアLumen（レイトレーシング）をオンにしている場合はオフにして比べる',
          '4K・WQHDの場合は解像度を下げて比べる',
        ],
      },
      {
        id: 'step-4',
        title: 'フレームレートの上限を設定する',
        summary:
          'フレームレートの上限は30〜240fps（30fps刻み）で設定できます。上限をPCが安定して出せる値にすると、fpsの上下が小さくなります。',
        time: '約3分',
        risk: 'low',
        actions: [
          'ゲーム内のフレームレート上限を、普段出ているfpsより少し低い値にする（例：60fps前後で上下するなら30fpsや60fpsで比べる）',
          '垂直同期（V-Sync）はオフ・フル・1/2・1/3・1/4から選べるので、上限と組み合わせて比べる',
        ],
      },
      {
        id: 'step-5',
        title: 'GPUドライバーを更新し、ゲームファイルを確認する',
        summary:
          'ドライバーやファイルの問題で、落ちたり表示が乱れたりすることがあります。',
        time: '約15分',
        risk: 'low',
        actions: [
          'NVIDIAはNVIDIA App、AMDはAMD Software: Adrenalin Editionから最新のドライバーに更新し、PCを再起動する',
          steamVerify,
          epicVerify,
        ],
      },
      {
        id: 'step-6',
        title: '予約特典・DLCが反映されない時はSteamを再起動する',
        summary:
          '予約購入版・Deluxe Editionで一部のDLCが解除されない問題は、公式が解消済みと発表しています。すでにプレイを始めている場合は、次の手順が必要です。',
        time: '約3分',
        risk: 'low',
        actions: [
          'ゲームを終了する',
          'インターネットに接続していることを確認する',
          'Steamを再起動してから、ゲームを起動する',
        ],
      },
    ],
    avoid: [
      '非公式の性能改善MODや設定ファイルの書き換えは、公式パッチと競合するおそれがあるため、試す場合は設定ファイルのフォルダを先にバックアップする',
      '重いからといって、先にWindowsの再インストールをしない（まず公式パッチと設定を確認する）',
    ],
    cautions: [
      'Patch 1.3.1の内容は「シェーダーのプリコンパイルによるカクつきの軽減」です。今後の更新で症状が変わることがあるため、最新の告知もあわせて確認してください。',
    ],
    faqs: [
      {
        question: 'Windows 10でも遊べますか？',
        answer:
          '動作環境では、最低・推奨ともOSがWindows 11（64bit）です。Windows 10は要件を満たしません。',
      },
      {
        question: 'HDRの明るさを調整できません。',
        answer:
          'PCGamingWikiによると、WindowsでHDRを有効にしていると起動時に自動でHDRになり、ゲーム内にHDRの調整項目はありません。明るさが合わない場合は、Windows側のHDR設定で比べてください。',
      },
      {
        question: '家庭用ゲーム機版も重いですか？',
        answer:
          '公式が性能の問題への対応を発表したのは、Steam版とEpic Games Store版です。',
      },
      {
        question: 'Patch 1.3.1で何が直りましたか？',
        answer:
          '公式のお知らせによると、シェーダーのプリコンパイルの問題が原因のプレイ中のカクつきが軽減されました。適用後のバージョンは、メインメニュー右下に「v1.4.153829」と表示されます。',
      },
    ],
    sources: [
      townfallSources.patch131,
      townfallSources.news,
      townfallSources.steam,
      townfallSources.pcgw,
    ],
    related: [],
    metaDescription:
      'SILENT HILL: Townfall PC版が重い・カクつく時の対処法。9月30日配信のPatch 1.3.1（カクつき軽減）の確認方法、Windows 11の動作環境、アップスケーリングとフレームレート上限の設定、DLCが反映されない時の手順、セーブデータの場所まで解説。',
  }),
  make({
    gameSlug: 'minecraft-dungeons-2',
    slug: 'multiplayer',
    category: 'server',
    checkedAt: '2026-10-03',
    seoTitle:
      'Minecraft Dungeons IIで友達と遊べない時の対処法【マルチ・クロスプレイ】',
    title:
      'Minecraft Dungeons IIで友達と遊べない・マルチプレイに入れない時の対処法【PC版】',
    shortTitle: 'マルチプレイ・クロスプレイ',
    targetVersion:
      'Steam版・Microsoft Store版（Game Pass）・2026年10月1日時点の公式情報',
    symptom:
      '友達のパーティーに入れない、クロスプレイで一緒に遊べない、Microsoftアカウントのサインインで止まる、Hero Capeが受け取れない場合の確認手順です。',
    conclusion:
      '本作はSteam版を含むすべての版でMicrosoftアカウントが必要です（Steamアカウントとのリンクに対応）。友達と遊ぶ時は、全員がMicrosoftアカウントでサインインし、パーティーコードで参加するのが確実です。パーティーは同じPCで遊ぶ人も含めて最大4人です。',
    description:
      '2026年9月29日発売。オンラインのクロスプレイ、同じPCでの協力プレイ、その両方を組み合わせた「ミックス協力プレイ」、マッチメイキングに対応しています（公式）。',
    causes: [
      'Microsoftアカウントにサインインしていない・別のアカウントでサインインしている',
      'パーティーが満員（同じPCで遊ぶ人も含めて最大4人）',
      'サービス側の障害・メンテナンス',
      'VPNや自宅の回線の影響',
    ],
    quickFacts: [
      {
        label: 'Microsoftアカウント',
        value: 'すべての版で必要（Steam版はSteamアカウントとリンク）',
      },
      {
        label: 'パーティーの人数',
        value: '最大4人（同じPC・本体で遊ぶ人も含む）',
      },
      { label: '参加方法', value: 'パーティーコード、マッチメイキング' },
      {
        label: '最低動作環境',
        value:
          'Windows 10（1703以降）／GTX 1050・RX 560（VRAM 2GB以上）／メモリ8GB',
      },
      {
        label: 'Game Pass',
        value: 'PC Game Passに含まれる（Microsoft Store版）',
      },
    ],
    diagnosis: [
      {
        symptom: 'オンラインのメニューに進めない・サインインで止まる',
        cause: 'Microsoftアカウントのサインイン',
        stepId: 'step-1',
      },
      {
        symptom: '友達のパーティーが見つからない',
        cause: '参加方法の違い',
        stepId: 'step-2',
      },
      {
        symptom: '友達は入れたのに自分だけ入れない',
        cause: 'パーティーの人数が上限',
        stepId: 'step-3',
      },
      {
        symptom: '全員つながらない',
        cause: 'サービス側の障害',
        stepId: 'step-4',
      },
      {
        symptom: '自分だけつながらない・よく切れる',
        cause: 'VPN・回線',
        stepId: 'step-5',
      },
      {
        symptom: 'Hero Capeが受け取れない',
        cause: 'Microsoftアカウントの違い',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Microsoftアカウントでサインインする',
        summary:
          '本作はSteam版を含むすべての版でMicrosoftアカウントが必要です。Steam版は、SteamアカウントとMicrosoftアカウントのリンクに対応しています。',
        time: '約5分',
        risk: 'low',
        actions: [
          'ゲームの案内に従ってMicrosoftアカウントでサインインする',
          '家族や友達と同じPCを使う場合は、自分のMicrosoftアカウントでサインインしているか確認する',
          'Microsoftアカウントのパスワードが分からない場合は、Microsoftのアカウントページで再設定する',
        ],
      },
      {
        id: 'step-2',
        title: 'パーティーコードで参加する',
        summary:
          '本作では、パーティーコードで友達のゲームに参加できます。知らない人と遊ぶ場合はマッチメイキングも使えます。',
        time: '約3分',
        risk: 'low',
        actions: [
          'ホスト（部屋を作る人）にパーティーコードを確認してもらう',
          '参加する人はコードを入力して参加する（打ち間違いに注意）',
          'クロスプレイでも、全員がMicrosoftアカウントにサインインしていることを確認する',
        ],
      },
      {
        id: 'step-3',
        title: 'パーティーの人数を確認する',
        summary:
          'パーティーは最大4人です。同じPCや本体で2人以上が遊びながらオンラインの友達を呼ぶ「ミックス協力プレイ」では、同じ画面で遊ぶ人も人数に入ります。',
        time: '約1分',
        risk: 'low',
        actions: [
          'ホスト側で同じ画面で遊んでいる人数と、オンラインで参加している人数の合計を数える',
          '4人を超える場合は、同じ画面の人数を減らすか、別のパーティーに分かれる',
        ],
      },
      {
        id: 'step-4',
        title: 'サービス側の障害・メンテナンスを確認する',
        summary:
          '全員がつながらない場合は、自分のPCではなくサービス側の問題の可能性があります。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Minecraft公式X（@Minecraft）やSteamの本作のページのニュースで、障害の告知がないか確認する',
          '障害の告知が出ている間は、再インストールや回線の設定変更をしない',
        ],
      },
      {
        id: 'step-5',
        title: 'VPNを止め、回線を見直す',
        summary:
          'サービス側に問題がないのに自分だけつながらない場合に確認します。',
        time: '約10分',
        risk: 'low',
        actions: [
          'VPNや通信最適化ツールを使っている場合はオフにして試す',
          'ルーターの電源を抜いて30秒ほど待ち、入れ直す',
          'Wi-Fiの場合は、可能であればLANケーブルで有線接続にする',
          steamVerify,
        ],
      },
      {
        id: 'step-6',
        title: 'Hero Capeは同じMicrosoftアカウントで遊ぶ',
        summary:
          'Hero Capeは、Minecraft Dungeons（1作目）と本作の両方を、同じMicrosoftアカウントで遊ぶと受け取れます（公式）。',
        time: '約5分',
        risk: 'low',
        actions: [
          '1作目と本作で、同じMicrosoftアカウントにサインインしているか確認する',
          '条件を満たしてから反映されるまで、時間がかかる場合がある（公式の注記）',
        ],
      },
    ],
    avoid: [
      '友達のMicrosoftアカウントを借りてサインインしない（進行状況や特典が自分のアカウントに残らない）',
      '障害の告知が出ている間に、再インストールや回線の設定変更をしない',
    ],
    cautions: [
      '発売前後は仕様や告知が変わることがあります。最新のお知らせもあわせて確認してください。',
      '不具合は、公式のバグ報告窓口（aka.ms/Dungeons2Bugs）から報告できます（公式の案内）。',
    ],
    faqs: [
      {
        question: 'Steam版とGame Pass（Microsoft Store）版で一緒に遊べますか？',
        answer:
          '本作はクロスプレイに対応しています（公式）。どちらの版も、Microsoftアカウントへのサインインが必要です。',
      },
      {
        question: '1台のPCで2人以上で遊べますか？',
        answer:
          '同じPCでの協力プレイ（ローカル協力プレイ）に対応しています。さらにオンラインの友達を加える「ミックス協力プレイ」もできますが、パーティー全体で最大4人です。',
      },
      {
        question: '古いノートPCでも動きますか？',
        answer:
          '最低動作環境は、GTX 1050・RX 560（VRAM 2GB以上）の専用グラフィックス、メモリ8GB、Windows 10（1703以降）です。推奨はGTX 1060・RX 580（VRAM 6GB以上）、メモリ16GBです。',
      },
      {
        question: 'Steam Deckで遊べますか？',
        answer:
          '10月1日のアップデートで、Steam Deckで遊べるようになりました（公式）。ただし画面上のキーボードが出ないなどの問題が残る場合があり、Steam Deck認証（Verified）に向けた改善は今後のアップデートで行うと公式は案内しています。',
      },
    ],
    sources: [
      dungeonsSources.systems,
      dungeonsSources.steam,
      dungeonsSources.cape,
      dungeonsSources.deck,
    ],
    related: [],
    metaDescription:
      'Minecraft Dungeons IIで友達と遊べない・マルチプレイに入れない時の対処法。Steam版でも必要なMicrosoftアカウント、パーティーコードでの参加、最大4人の数え方、クロスプレイ、Hero Capeの受け取りまで公式情報をもとに解説。',
  }),
];
