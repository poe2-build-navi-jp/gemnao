// 週刊「PCゲーム不具合まとめ」。毎週、その週に出た公式のパッチ・障害・
// エラーコード・お知らせだけをまとめます（日付は日本時間）。
// 出典は各ゲームの公式のお知らせ（Steamニュースなど）。推測は書かない。
// 新しい号は配列の先頭に追加し、slugは週の初日（月曜日）にします。

export type WeeklyKind = 'patch' | 'outage' | 'error' | 'notice' | 'release';

export const weeklyKindLabels: Record<WeeklyKind, string> = {
  patch: 'パッチ・修正',
  outage: '障害・メンテ',
  error: 'エラーコード',
  notice: '公式のお知らせ',
  release: '発売・配信',
};

export type WeeklyItem = {
  /** 日本時間の日付（M/D）。 */
  date: string;
  game: string;
  /** games.ts のslug。マイページの「新着」表示に使う。 */
  gameSlug?: string;
  kind: WeeklyKind;
  title: string;
  summary: string;
  article?: { href: string; label: string };
  source: { label: string; url: string };
};

export type WeeklyReport = {
  slug: string;
  title: string;
  shortTitle: string;
  period: string;
  publishedAt: string;
  description: string;
  lead: string;
  highlights: string[];
  items: WeeklyItem[];
  upcoming: { date: string; game: string; note: string; href?: string }[];
};

const steamNews = (appId: string) =>
  `https://store.steampowered.com/news/app/${appId}`;

export const weeklyReports: WeeklyReport[] = [
  {
    slug: '2026-10-19',
    title:
      '今週のPCゲーム不具合まとめ（10月19日〜10月25日）｜HELLDIVERS 2のアンチチート変更・エースコンバット8の更新・Dawnwalker 1.1ほか',
    shortTitle: '10月19日〜10月25日',
    period: '2026年10月19日〜10月25日',
    publishedAt: '2026-10-26',
    description:
      '10月19日〜10月25日に出たPCゲームの公式パッチ・障害・お知らせをまとめました。HELLDIVERS 2のGameGuardからEasy Anti-Cheatへの切り替え、エースコンバット8のVer.1.01.002、The Blood of Dawnwalkerのアップデート1.1、Gears of War: E-Dayのホットフィックス、AION2のメンテナンスなど。',
    lead: '今週出た公式のパッチ・障害・エラー情報を、ゲームごとに1行で確認できます。詳しい直し方は各記事へ。',
    highlights: [
      'HELLDIVERS 2：10/20にアンチチートをGameGuardからEasy Anti-Cheatに切り替え。一部のMODは動かなくなる場合があると公式が案内',
      'エースコンバット8：Ver.1.01.002（10/23配信）で、ミッションが進まない問題や一部のクラッシュを修正。非同期コンピュートのON/OFFを追加',
      'The Blood of Dawnwalker：アップデート1.1で多数のクラッシュとセーブ時の短いフリーズを修正。RX 9070 XTではフレーム生成をONにすると落ちる場合があると公式が注意',
    ],
    items: [
      {
        date: '10/20',
        game: 'HELLDIVERS 2',
        gameSlug: 'helldivers-2',
        kind: 'notice',
        title: 'アンチチートをGameGuardからEasy Anti-Cheatに切り替え（7.2.0）',
        summary:
          '10/20の7.2.0で、GameGuardに代えてEasy Anti-Cheatを導入。不正なMODへの対策を強めたため、ほかのプレイヤーに影響するMODは動かなくなり、見た目だけのMODも作者の更新が必要になる場合があると公式が案内。7.2.0では、解像度やレンダースケールを切り替えた時のクラッシュなども修正した。',
        article: {
          href: '/games/helldivers-2/gameguard-error-114',
          label: 'GameGuardのエラー（切り替え前の記事）',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('553850') },
      },
      {
        date: '10/22',
        game: 'HELLDIVERS 2',
        gameSlug: 'helldivers-2',
        kind: 'patch',
        title: '7.2.1：ほかのプレイヤーの参加・離脱時のクラッシュを修正',
        summary:
          '主なクラッシュの1つだった、分隊にほかのプレイヤーが参加・離脱した時のクラッシュを修正。',
        source: { label: 'Steamニュース（公式）', url: steamNews('553850') },
      },
      {
        date: '10/20',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'patch',
        title:
          'Ver.1.01.002（10/23配信）：ミッションが進まない問題と一部のクラッシュを修正',
        summary:
          '一部のミッションで進行できなくなる問題、MISSION 11の連鎖爆発や機体選択・AIRCRAFT TREEの画面でのクラッシュなどを修正。対応GPUでは「SYSTEM」で非同期コンピュートのON/OFFを選べるようになった。Steamオーバーレイをオフにしているとゲーム内購入（ACE COINS）が進まない問題も修正。',
        article: {
          href: '/games/ace-combat-8/crashing-memory',
          label: '落ちる・クラッシュする時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '10/23',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'notice',
        title:
          'ACE COMBAT ZEROの単体アプリ版を配信（予約特典を持っている人のみ）',
        summary:
          '対象者のSteamライブラリに順次追加。同じPCなら、これまでのセーブはSteamクラウドの設定に関係なく自動で引き継がれる。別のPCへ移す場合は、起動前にSteamクラウドを有効にする。本編の起動時にZEROの選択画面を出さないようにするには、「常にこのオプションを使用」にチェックするか、プロパティの「DLC」でACE COMBAT ZEROのインストールを外す。',
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '10/22',
        game: 'The Blood of Dawnwalker',
        gameSlug: 'the-blood-of-dawnwalker',
        kind: 'patch',
        title: 'アップデート1.1：多数のクラッシュとセーブ時のフリーズを修正',
        summary:
          'フレーム生成の技術を更新し、専用の設定を追加。会話中やセーブデータの読み込み時などのクラッシュ、セーブ・ロード時の短いフリーズ、ウィンドウモードでDLSSフレーム生成をONにした時のちらつきを修正。コントローラーのデッドゾーン設定も追加。既知の問題として、RX 9070 XTではフレーム生成をOFFからONにすると落ちる場合がある。Steamの日本版では流血表現の規制がなくなった。',
        article: {
          href: '/games/the-blood-of-dawnwalker/stutter-windowed',
          label: 'カクつく・スタッターする時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3751260') },
      },
      {
        date: '10/23',
        game: 'Gears of War: E-Day',
        gameSlug: 'gears-of-war-e-day',
        kind: 'patch',
        title: '10月22日のホットフィックス：クラッシュの軽減とサインインの修正',
        summary:
          'PCなどで安定性・動作・クラッシュを改善。Windowsの日付・時刻の設定が正しくないとサインインできない問題も修正。長時間のプレイで固まる・落ちる報告はまだ調査中と公式が案内。',
        article: {
          href: '/games/gears-of-war-e-day/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3010850') },
      },
      {
        date: '10/22',
        game: 'Minecraft Dungeons II',
        gameSlug: 'minecraft-dungeons-2',
        kind: 'patch',
        title:
          'Hotfix 1.1.3.0：クラッシュとエラーコード「CH1」まわりのログインを改善',
        summary:
          'プレイ中のクラッシュ、画面分割の協力プレイでメインメニューに戻った時に固まる問題を修正。エラーコード「CH1」まわりのログインの安定性も改善した。',
        article: {
          href: '/games/minecraft-dungeons-2/multiplayer',
          label: '友達と遊べない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1912410') },
      },
      {
        date: '10/21',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'outage',
        title: '定期メンテナンス（15:30から約5時間30分）',
        summary:
          'スキル効果の表示などの不具合を修正。10/25 9:30からはヨーロッパのサーバーで、サマータイム終了に合わせた約2時間30分の臨時メンテナンスがあり、補償アイテムが配られた（受け取り期限は7日）。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/25',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title: '日替わりのリセットで一部のアイテムが届かない問題を調査中',
        summary:
          '10/25朝（中央ヨーロッパ時間）の日替わりのリセットで、シュゴの鍵とナイトメアのチケットを受け取れなかったプレイヤーがいるとして調査中。不正利用によるアカウント制限も、10/21・10/24に続けて発表された。',
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/23',
        game: 'Call of Duty: Modern Warfare 4',
        gameSlug: 'call-of-duty-modern-warfare-4',
        kind: 'release',
        title: '発売。ロードアウトの保存や戦績の表示などを公式が調査中',
        summary:
          'Activision公式サポートの「既知の不具合」（10/22更新）では、マルチプレイでロードアウトを保存できない、戦績が表示されない（記録は続いている）、XBOX on PC版でキャンペーン・DMZを起動するボタンが出ないなどを調査中としている。',
        article: {
          href: '/games/call-of-duty-modern-warfare-4/crash',
          label: '落ちる・クラッシュする時の対処法',
        },
        source: {
          label: 'Activision公式サポート：既知の不具合（英語）',
          url: 'https://support.activision.com/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
        },
      },
      {
        date: '10/23',
        game: 'ファイナルファンタジー レゾナンス',
        gameSlug: 'final-fantasy-resonance',
        kind: 'release',
        title: '発売。ミニマップの再表示と音のノイズを公式が調査中',
        summary:
          '発売のお知らせで、非表示にしたミニマップ・ヘルプが特定のタイミングで再び表示される問題と、特定のCPU構成でまれに音にノイズが入る問題を調査中と案内。',
        article: {
          href: '/games/final-fantasy-resonance/not-launching',
          label: '起動しない・特典が受け取れない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3259780') },
      },
      {
        date: '10/22',
        game: 'サイバーパンク2077',
        gameSlug: 'cyberpunk-2077',
        kind: 'patch',
        title: 'Edgerunners 2 アップデート（2.5）を配信',
        summary:
          'アニメ「サイバーパンク エッジランナーズ」第2作に合わせた新しい要素を追加。詳しい修正内容は公式のパッチノートで案内されている。',
        article: {
          href: '/games/cyberpunk-2077/not-launching',
          label: '起動しない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1091500') },
      },
      {
        date: '10/21',
        game: 'Football Manager 27',
        gameSlug: 'football-manager-27',
        kind: 'notice',
        title: '無料のローンチプレビューを10/30 3時から実施',
        summary:
          '日本時間10/30 3時〜11/4 3時の5日間、PC版を無料で遊べる。無料期間に始めたセーブは、有料のローンチプレビューと製品版でも続けられる。',
        article: {
          href: '/games/football-manager-27/not-launching',
          label: '起動しない・ローンチプレビュー・Denuvo',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('4530370') },
      },
    ],
    upcoming: [
      {
        date: '10/28',
        game: 'Phantom Blade Zero',
        note: '発売（Steamストアの表記）',
        href: '/games/phantom-blade-zero/not-launching',
      },
      {
        date: '10/30',
        game: 'Football Manager 27',
        note: '3時から無料のローンチプレビュー（11/4 3時まで）',
        href: '/games/football-manager-27/not-launching',
      },
      {
        date: '11/3',
        game: 'Godzilla: Destroy All Monsters Melee Remastered',
        note: '発売（Steamストアの表記）',
        href: '/games/godzilla-destroy-all-monsters-melee/not-launching',
      },
      {
        date: '11/4',
        game: 'AION2',
        note: 'アップデート「Ludra Awakens」（公式の告知。時刻は公式のお知らせで確認）',
        href: '/games/aion2/login-error',
      },
      {
        date: '11/5',
        game: '崩落の国',
        note: '発売（Steamストアの表記）',
        href: '/games/where-the-seeds-fall/not-launching',
      },
      {
        date: '11/10',
        game: 'Football Manager 27',
        note: '発売（Steamストアの表記）',
        href: '/games/football-manager-27/not-launching',
      },
    ],
  },
  {
    slug: '2026-10-12',
    title:
      '今週のPCゲーム不具合まとめ（10月12日〜10月18日）｜エースコンバット8のクラッシュ対策・AION2・Castlevaniaほか',
    shortTitle: '10月12日〜10月18日',
    period: '2026年10月12日〜10月18日',
    publishedAt: '2026-10-19',
    description:
      '10月12日〜10月18日に出たPCゲームの公式パッチ・障害・お知らせをまとめました。エースコンバット8のクラッシュの調査と仮想メモリの暫定対策、AION2の4Kモニターでのクラッシュ修正とSteam決済の不具合、Castlevania: Belmont’s CurseのVer.1.1.3、Gears of War: E-Dayのパッチなど。',
    lead: '今週出た公式のパッチ・障害・エラー情報を、ゲームごとに1行で確認できます。詳しい直し方は各記事へ。',
    highlights: [
      'エースコンバット8：プレイ中のクラッシュを公式が調査中。暫定対策として、Windowsの仮想メモリを増やす目安（メモリ32GBなら16GB以上、16GBなら32GB以上）を案内',
      'AION2：10/14のメンテナンスで、4Kモニターの一部のリフレッシュレートで落ちる問題を修正。10/6〜10/12のSteam決済の不具合は対応済み',
      'Castlevania: Belmont’s Curse：高リフレッシュレートのモニターで黒い画面のまま起動しない問題に、Ver.1.1.3で対応（環境によってはまだ起きる）',
    ],
    items: [
      {
        date: '10/16',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'notice',
        title:
          'プレイ中のクラッシュを調査中。仮想メモリを増やすと減る場合があると案内',
        summary:
          '使えるメモリ（RAMとWindowsの仮想メモリの合計）がおよそ48GB以上の環境では、メモリが原因のクラッシュが起きにくかったと公式が説明。暫定対策の目安は、RAMが32GBなら仮想メモリを16GB以上、16GBなら32GB以上。根本的な解決ではなく、メモリ使用量の削減と修正を進めているとしている。',
        article: {
          href: '/games/ace-combat-8/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '10/13',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'notice',
        title: 'ACE COMBAT ZEROを単体のアプリでも起動できるようにする予定',
        summary:
          'いまはエースコンバット8から起動して遊ぶ形。アップデート後は単体のアプリ版も使えるようになり、セーブデータはSteamクラウドで共有される見込み。配信日は確認が終わりしだい案内。',
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '10/14',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'outage',
        title:
          '定期メンテナンス（15:30から約4時間）。4Kモニターで落ちる問題などを修正',
        summary:
          '4Kモニターの一部のリフレッシュレートでクラッシュする問題を修正し、アビスの大規模な戦闘でのカクつきを軽減。設定にY軸の反転を追加。同じ日の6:00から約30分は、アカウント登録だけができないメンテナンスもあった。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/15',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title: 'Steam決済の不具合（10/6〜10/12）への対応が完了',
        summary:
          '支払いが終わったのにアイテムが届かない問題では、届いていなかったアイテムを配布。支払いが終わっていないのに購入回数の上限に達した問題では、上限を元に戻した。',
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/15',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title: 'サーバー移動には人数の上限があり、早めに締め切られることも',
        summary:
          '各サーバーへの移動・各サーバーからの移動には上限があり、受付期間中でも上限に達すると締め切られる。空きの数は毎時0分に更新。申し込めなかった場合は次の回を待つよう案内。申し込みが集中したサーバーは、移動の受付が終了することもある。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/17',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title: '不正利用によるアカウント制限を続けて実施',
        summary:
          '10/13・10/14・10/16・10/17にも、ボット・RMTなどの規約違反のアカウントを制限したと発表。不審な接続による一時的なセキュリティロック（処罰ではない）も続いている。心当たりがないのにログインできない場合は公式サポート（help.plaync.com）に問い合わせる。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/16',
        game: 'Castlevania: Belmont’s Curse',
        gameSlug: 'castlevania-belmonts-curse',
        kind: 'patch',
        title:
          'Ver.1.1.3：高リフレッシュレートのモニターで黒い画面のまま起動しない問題に対応',
        summary:
          '10/15の発売後に起きていた問題への更新。改善は見込まれるものの、環境によってはまだ起きる場合があり、完全な解決に向けて対応を続けると公式が説明。更新しても起動しない場合は、KONAMIのサポートへの問い合わせを案内している。',
        article: {
          href: '/games/castlevania-belmonts-curse/not-launching',
          label: '起動しない・黒い画面の時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('4231820') },
      },
      {
        date: '10/16',
        game: 'テイルズ オブ エターニア リマスター',
        gameSlug: 'tales-of-eternia-remastered',
        kind: 'release',
        title: 'Steamで発売',
        summary:
          'デラックスエディションには、デジタルアートブック・サウンドトラック・バトルBGMパックなどが付く。',
        article: {
          href: '/games/tales-of-eternia-remastered/not-launching',
          label: '起動しない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3470960') },
      },
      {
        date: '10/15',
        game: 'Gears of War: E-Day',
        gameSlug: 'gears-of-war-e-day',
        kind: 'patch',
        title: '10月14日のパッチ：長時間のプレイで落ちる・重くなる問題を改善',
        summary:
          'PCなどでメモリの使い方を改善し、長く遊んだ時のクラッシュや動作の低下に対応。アカウント連携やログインの問題も修正。キャンペーンの実績と報酬が正しく付かない場合がある問題は調査中で、公式サポート（aka.ms/GearsSupport）への連絡を案内。',
        article: {
          href: '/games/gears-of-war-e-day/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3010850') },
      },
      {
        date: '10/16',
        game: 'STAR WARS Zero Company',
        gameSlug: 'star-wars-zero-company',
        kind: 'patch',
        title: '1.2：進行不能やメインメニューから終了する時のクラッシュを修正',
        summary:
          'チュートリアルや「Retake Luunata」（エレベーターでセーブした場合）などで進めなくなる問題、メインメニューから終了する時のクラッシュ、いくつかの動作の重さを修正。',
        article: {
          href: '/games/star-wars-zero-company/save-progress',
          label: 'セーブ・進行が反映されない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2075800') },
      },
      {
        date: '10/16',
        game: 'アニモ（Aniimo）',
        gameSlug: 'aniimo',
        kind: 'patch',
        title: 'メンテナンスなしの更新。ゲームの再起動でダウンロード',
        summary:
          '10/15の更新（v1.0.3732728.0）で、エリートトレーニングでの切り替え時のカクつきや、Operation: Egg Heistで鍵を使っても扉が開かない問題などを修正。10/17の更新（v1.0.3743667）では、Tiered Grand Giftsの第4段階の報酬を受け取れない問題を修正した。',
        article: {
          href: '/games/aniimo/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('4126040') },
      },
      {
        date: '10/15',
        game: 'WARDOGS',
        gameSlug: 'wardogs',
        kind: 'patch',
        title: 'シーズン2（Update 0.2.0）：地域ごとのPing上限を導入',
        summary:
          '公式サーバーでは、Pingが上限を長く超え続けると自動でキックされ、次のマップに切り替わるまで同じサーバーに戻れない（一時的な遅延やサーバー側の遅延は除外）。サーバーブラウザーにPingの上限の表示と絞り込みを追加。',
        article: {
          href: '/games/wardogs/server-connection',
          label: 'サーバーに接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1867240') },
      },
    ],
    upcoming: [
      {
        date: '10/21',
        game: 'AION2',
        note: '正式サービスのサーバーからのサーバー移動の受付開始（10/28まで。定期メンテナンス後から）',
        href: '/games/aion2/login-error',
      },
      {
        date: '10/23',
        game: 'Call of Duty: Modern Warfare 4・ファイナルファンタジー レゾナンス',
        note: '発売',
      },
      {
        date: '10/28',
        game: 'Phantom Blade Zero',
        note: '発売（Steamストアの表記）',
        href: '/games/phantom-blade-zero/not-launching',
      },
    ],
  },
  {
    slug: '2026-10-05',
    title:
      '今週のPCゲーム不具合まとめ（10月5日〜10月11日）｜AION2正式サービス・エスコン8・CONTROL Resonantほか',
    shortTitle: '10月5日〜10月11日',
    period: '2026年10月5日〜10月11日',
    publishedAt: '2026-10-12',
    description:
      '10月5日〜10月11日に出たPCゲームの公式パッチ・障害・お知らせをまとめました。AION2の正式サービス開始・ヨーロッパの障害・サーバー移動の日程、エースコンバット8のオンラインのマッチング問題とアップデート予告、CONTROL Resonant・Minecraft Dungeons IIの修正など。',
    lead: '今週出た公式のパッチ・障害・エラー情報を、ゲームごとに1行で確認できます。詳しい直し方は各記事へ。',
    highlights: [
      'エースコンバット8：オンラインのマッチングが成立しにくい問題を公式が調査中。Windows 11とSSDで遊ぶよう案内。不具合修正のアップデートも準備中',
      'AION2：10/5に正式サービス開始。サーバー移動は10/14から受付（アジア地域は日本時間12:00〜16:00・18:00〜22:00）',
      'CONTROL Resonant（1.4.2）・Minecraft Dungeons II（1.1.2.0）で、進行不能やクラッシュの修正',
    ],
    items: [
      {
        date: '10/9',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'notice',
        title:
          '不具合修正を含むアップデートを準備中。オンラインのマッチングが成立しにくい問題も調査',
        summary:
          'アップデートの配信日と内容は決まりしだい案内。ACE COMBAT ONLINEでマッチングが成立しにくい要因の1つは、動作環境を満たさない環境からの接続の可能性があるとして、公式はWindows 11で遊ぶこと、SSDにインストールすることを求めている。',
        article: {
          href: '/games/ace-combat-8/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '10/7',
        game: 'Gears of War: E-Day',
        gameSlug: 'gears-of-war-e-day',
        kind: 'release',
        title: '正式発売（Steam・XBOX on PC・Game Pass）',
        summary:
          '早期アクセスに続き、全世界で発売。障害は公式のサービス状況ページ（status.gearsofwar.com）で確認できる。',
        article: {
          href: '/games/gears-of-war-e-day/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3010850') },
      },
      {
        date: '10/6',
        game: 'ドラゴンズドグマ2',
        gameSlug: 'dragons-dogma-2',
        kind: 'notice',
        title: '本編のアップデートを予告（ハードモードの追加など）',
        summary:
          'ダークアリズンの発売に合わせ、本編にもハードモードなどを追加するアップデートを予定。配信日は公式のお知らせで案内される。',
        article: {
          href: '/games/dragons-dogma-2/performance',
          label: '重い・カクつく時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2054970') },
      },
      {
        date: '10/9',
        game: 'ドラゴンズドグマ2',
        gameSlug: 'dragons-dogma-2',
        kind: 'release',
        title: 'ダークアリズン発売',
        summary:
          '北の新地域「ノルガン」と新しいストーリーなどを追加する拡張コンテンツ。',
        article: {
          href: '/games/dragons-dogma-2/performance',
          label: '重い・カクつく時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2054970') },
      },
      {
        date: '10/8',
        game: 'CONTROL Resonant',
        gameSlug: 'control-resonant',
        kind: 'patch',
        title: 'Hotfix 1.4.2：1.4.0で起きたクエストの進行不能を修正',
        summary:
          'クエスト「The House in Distress」でZoeがいなくなり進めない問題、Artist Resonantを倒した直後にメインメニューへ戻るとGapから出られない問題などを修正。「Every Dog Has Her Day」の報酬が出ない問題は、New Game+に入っていなければ後から受け取れる。',
        article: {
          href: '/games/control-resonant/crash-performance',
          label: '落ちる・重い時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3669870') },
      },
      {
        date: '10/8',
        game: 'SILENT HILL: Townfall',
        gameSlug: 'silent-hill-townfall',
        kind: 'patch',
        title: 'Patch 1.4.0：The Weightの行動と敵の反応を調整',
        summary:
          'ストーリー・ノーマル難易度では、The Weightのつかみ攻撃が即死ではなく大ダメージに。銃声や走る音への敵の反応も弱まった。適用後はメインメニュー右下が「v1.5.154194」になっているか確認する。',
        article: {
          href: '/games/silent-hill-townfall/stutter',
          label: '重い・カクつく時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1636440') },
      },
      {
        date: '10/9',
        game: 'Minecraft Dungeons II',
        gameSlug: 'minecraft-dungeons-2',
        kind: 'patch',
        title:
          'Hotfix 1.1.2.0：プレイ中やオンラインから抜ける時のクラッシュを修正',
        summary:
          'クライアント・サーバーのさまざまなクラッシュ、オンラインのゲームから抜ける時のクラッシュ、グラフィック品質「Ultra」で画面がぼやける問題を修正。',
        article: {
          href: '/games/minecraft-dungeons-2/multiplayer',
          label: '友達と遊べない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1912410') },
      },
      {
        date: '10/5',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'release',
        title: '正式サービスが予定どおり22:00に開始',
        summary:
          'アーリーアクセス終了後のメンテナンスを経て、全世界で正式サービスを開始。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/7',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'outage',
        title:
          '定期メンテナンス（15:30から約3時間30分。アジアのサーバーは約5時間30分）',
        summary:
          'ファウンダーズパックのスキン・称号などを、別のキャラクター・別のサーバーでも使えるように変更。購入時にエラーが出る場合は、クライアントを閉じてやり直すよう案内。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/9',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'outage',
        title:
          'ヨーロッパのサーバーでクラウドサービスの障害。臨時メンテナンスと補償',
        summary:
          '10/8にヨーロッパの一部サーバーで障害（解決済み）。10/9 15:30から約1時間30分の臨時メンテナンスを行い、「Special Daeva Supply chest」を配布（受け取り期限は7日）。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/10',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title: 'サーバー移動のQ&Aを公開。10/14から受付',
        summary:
          'アーリーアクセスのサーバーからの移動は10/14〜10/21、正式サービスのサーバーからは10/21〜10/28（いずれも定期メンテナンス後から）。アジア地域の受付時間は日本時間12:00〜16:00と18:00〜22:00。受付時間外や、移動元・移動先が上限に達している場合は申し込めない。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/11',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title:
          '不正利用でアカウントを制限。不審な接続には一時的なセキュリティロックも',
        summary:
          'ボット・RMTなどの規約違反のアカウントを制限。これとは別に、乗っ取りなどの危険がある端末・接続からのアクセスを検知すると、アカウントが一時的にロックされることがある（処罰ではない）。ログインできない場合は公式サポート（help.plaync.com）に問い合わせる。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/6',
        game: 'HELLDIVERS 2',
        gameSlug: 'helldivers-2',
        kind: 'outage',
        title: 'Galactic Networkのメンテナンス（17:00から約2時間）',
        summary:
          'メンテナンス開始時に出撃中だと、報酬が失われる場合があると公式が注意。',
        source: { label: 'Steamニュース（公式）', url: steamNews('553850') },
      },
    ],
    upcoming: [
      {
        date: '10/14',
        game: 'AION2',
        note: 'サーバー移動の受付開始（アーリーアクセスのサーバーから。10/21からは正式サービスのサーバーから）',
        href: '/games/aion2/login-error',
      },
      {
        date: '10/15',
        game: 'Castlevania: Belmont’s Curse',
        note: '発売（KONAMIの発表）',
        href: '/games/castlevania-belmonts-curse/not-launching',
      },
      {
        date: '10/16',
        game: 'テイルズ オブ エターニア リマスター',
        note: '7時発売',
        href: '/games/tales-of-eternia-remastered/not-launching',
      },
      {
        date: '10/23',
        game: 'Call of Duty: Modern Warfare 4・ファイナルファンタジー レゾナンス',
        note: '発売',
      },
      {
        date: '10/28',
        game: 'Phantom Blade Zero',
        note: '発売（Steamストアの表記）',
        href: '/games/phantom-blade-zero/not-launching',
      },
    ],
  },
  {
    slug: '2026-09-28',
    title:
      '今週のPCゲーム不具合まとめ（9月28日〜10月4日）｜エスコン8・AION2・CONTROL Resonantほか',
    shortTitle: '9月28日〜10月4日',
    period: '2026年9月28日〜10月4日',
    publishedAt: '2026-10-04',
    description:
      '9月28日〜10月4日に出たPCゲームの公式パッチ・障害・エラーコードをまとめました。エースコンバット8のクラッシュ調査とエラーST-3100001、AION2のログイン不具合の修正、CONTROL Resonantのクエスト進行不能の修正、SILENT HILL: Townfallのカクつき軽減、WARDOGSのエラーWD-L020の修正など。',
    lead: '今週出た公式のパッチ・障害・エラー情報を、ゲームごとに1行で確認できます。詳しい直し方は各記事へ。',
    highlights: [
      'エースコンバット8：Steam版のクラッシュを公式が調査中。クラッシュ報告用のスレッドが設けられた。エラーST-3100001は時刻の同期で直ることがある',
      'CONTROL Resonant：1.4.0で起きたクエスト「The Park Resonant」の進行不能は、翌日のHotfix 1.4.1で修正',
      'AION2：アーリーアクセスの権利が認識されない不具合を修正。正式サービスは10/5 22:00から（14:00〜22:00はメンテナンス）',
      'WARDOGS：Windows 11の更新（KB5124010）後に出ていたエラー「WD-L020」のクラッシュを修正',
    ],
    items: [
      {
        date: '9/29',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'notice',
        title: 'Steam版のクラッシュを調査中と発表',
        summary:
          '公式は、起動時に表示される推奨ドライバーへの更新、SSDの空き容量（16GB以上を推奨）、Windowsの仮想メモリの有効化を確認するよう案内。',
        article: {
          href: '/games/ace-combat-8/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '9/30',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'error',
        title: 'エラーコード「ST-3100001」の原因を公式が説明',
        summary:
          'ACE COMBAT ONLINEでサーバーとの通信が切れた時に出るエラー。Windowsの時刻を同期すると直ることがある。',
        article: {
          href: '/games/ace-combat-8/error-st-3100001',
          label: 'ST-3100001の意味と直し方',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '9/30',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'notice',
        title: 'フライトスティック（HOTAS）の設定について公式見解',
        summary:
          '7で一部の機器に用意されていた設定の一部が8では使えないことを認め、改善を検討中。対応には時間がかかる場合がある。',
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '10/2',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'notice',
        title: '予約特典「ACE COMBAT ZERO」を単体アプリで配信する方向で検討',
        summary:
          '現在は8の中から遊ぶ形。公式は、Steamで単体のアプリとして配信する方法を検討中で、実現するかと時期は追って案内するとしている。',
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '10/2',
        game: 'エースコンバット8',
        gameSlug: 'ace-combat-8',
        kind: 'release',
        title: '発売。PC版のクラッシュ報告スレッドを開設',
        summary:
          '公式は、PCの構成・Windowsのバージョン・エラーメッセージと再現手順・一緒に起動していたアプリを書いて報告するよう求めている。',
        article: {
          href: '/games/ace-combat-8/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('2288340') },
      },
      {
        date: '9/30',
        game: 'SILENT HILL: Townfall',
        gameSlug: 'silent-hill-townfall',
        kind: 'patch',
        title: 'Patch 1.3.1：シェーダーのプリコンパイルによるカクつきを軽減',
        summary:
          '適用後は、メインメニュー右下のバージョンが「v1.4.153829」になっているか確認する。',
        article: {
          href: '/games/silent-hill-townfall/stutter',
          label: '重い・カクつく時の対処法',
        },
        source: {
          label: 'KONAMI公式：Patch 1.3.1',
          url: 'https://www.konami.com/games/silenthill/townfall/updates/jp/ja/patch-note_v1-3-1',
        },
      },
      {
        date: '10/1',
        game: 'CONTROL Resonant',
        gameSlug: 'control-resonant',
        kind: 'patch',
        title: 'Update 1.4.0：New Game++と多数の修正',
        summary:
          'New Game++の追加、ロードアウト画面へのビルドパワーの表示、Unknown Zoneの戦闘量の調整など。',
        article: {
          href: '/games/control-resonant/crash-performance',
          label: '落ちる・重い時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3669870') },
      },
      {
        date: '10/2',
        game: 'CONTROL Resonant',
        gameSlug: 'control-resonant',
        kind: 'patch',
        title: 'Hotfix 1.4.1：1.4.0で起きた進行不能を修正',
        summary:
          'クエスト「The Park Resonant」で必要な手順（Moldを食べる）ができず進めなくなる問題と、Elevate中のダッシュの勢いが消える問題を修正。',
        article: {
          href: '/games/control-resonant/crash-performance',
          label: '落ちる・重い時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3669870') },
      },
      {
        date: '9/30',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'outage',
        title: 'アーリーアクセス開始が30分延期（22:30開始）',
        summary:
          'アーリーアクセスは日本時間9月30日22:30から。10月14日から同じ種族のサーバー間で移動できる（当初は無料）。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/1',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'outage',
        title: '臨時メンテナンス（15:00から約1時間30分）',
        summary:
          '一部のクエストでオブジェクトを調べると進まなくなる問題に対応するメンテナンス。終了後に補償を配布。',
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/1',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'patch',
        title: 'アーリーアクセスの権利が認識されない不具合を修正',
        summary:
          'ゲーム内購入の不具合も修正。再起動時に自動で更新される。アカウント連携の不具合は調査中。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/2',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title: 'Twitchドロップの連携で注意。NCの公式サイトで別途連携しない',
        summary:
          '既存の連携が外れてキャラクターに入れなくなる場合がある。Twitchには、いま遊んでいる方のアカウントを連携する。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/3',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title: '既知の問題を公開（10/4更新）',
        summary:
          'レベル45になる前にマップの「Duty」タブを開くと、45になってもその日はDutyが使えない（45になるまで開かなければ避けられる）。10/4追加：チャットで「Please Try Again Later」が出て送受信できない時は、キャラクターを切り替える・ロード画面を挟む・ログインし直すと直る。',
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/4',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'outage',
        title: '正式サービス開始前のメンテナンスが確定（10/5 14:00〜22:00）',
        summary:
          'アーリーアクセスを終了し、正式サービスを開始するための約8時間のメンテナンス。始まるとゲームから切断される。時間は変更される場合がある。',
        article: {
          href: '/games/aion2/login-error',
          label: 'ログイン・接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/4',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title:
          '正式サービスのサーバー一覧と、対戦相手のサーバーの組み合わせを公開',
        summary:
          '1つのサーバーには1つの種族だけ。起動後に地域→種族→サーバーの順に選ぶ。各サーバーは一定期間、アビスなどで戦う相手の種族のサーバーと組み合わされる。',
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/4',
        game: 'AION2',
        gameSlug: 'aion2',
        kind: 'notice',
        title:
          'ファウンダーズパックの衣装を、全サーバーの全キャラクターで使えるように変更へ',
        summary:
          '別サーバーの友達と遊ぶ時や別の職業を育てる時の不便を受けた変更。実施時期は公式のお知らせで案内される。',
        source: { label: 'Steamニュース（公式）', url: steamNews('3393110') },
      },
      {
        date: '10/1',
        game: 'Minecraft Dungeons II',
        gameSlug: 'minecraft-dungeons-2',
        kind: 'patch',
        title: 'Steam Deckで遊べるようになるアップデート',
        summary:
          '画面上のキーボードが出ないなどの問題は残る。エメラルドの上限が9,999から99,999に（ログインし直すと反映）。',
        article: {
          href: '/games/minecraft-dungeons-2/multiplayer',
          label: '友達と遊べない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1912410') },
      },
      {
        date: '10/2',
        game: 'Gears of War: E-Day',
        gameSlug: 'gears-of-war-e-day',
        kind: 'release',
        title:
          '早期アクセス開始（Premium Edition・Game Passのプレミアムアップグレード）',
        summary:
          '発売は日本時間10月7日0時。障害は公式のサービス状況ページ（status.gearsofwar.com）で確認できる。',
        article: {
          href: '/games/gears-of-war-e-day/not-launching',
          label: '起動しない・落ちる時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('3010850') },
      },
      {
        date: '9/30',
        game: 'WARDOGS',
        gameSlug: 'wardogs',
        kind: 'error',
        title: 'Update 0.1.2：エラー「WD-L020」で落ちる問題を修正',
        summary:
          'Windows 11の更新プログラム KB5124010 の適用後に起きていた WD-L020 のクラッシュを修正。経験値・お金の不正取得への対策も含む（約1時間のメンテナンス）。',
        article: {
          href: '/games/wardogs/server-connection',
          label: 'サーバーに接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1867240') },
      },
      {
        date: '10/2',
        game: 'WARDOGS',
        gameSlug: 'wardogs',
        kind: 'outage',
        title: 'セキュリティ・安定性の修正でメンテナンス（17:00から約1時間）',
        summary:
          '一部のプレイヤーに影響していた軽微なセキュリティと安定性の問題に対応。',
        article: {
          href: '/games/wardogs/server-connection',
          label: 'サーバーに接続できない時の対処法',
        },
        source: { label: 'Steamニュース（公式）', url: steamNews('1867240') },
      },
    ],
    upcoming: [
      {
        date: '10/5',
        game: 'AION2',
        note: '14:00〜22:00メンテナンス（公式の告知で確定。変更の場合あり）、22:00から正式サービス',
        href: '/games/aion2/login-error',
      },
      {
        date: '10/7',
        game: 'Gears of War: E-Day',
        note: '0時発売（Game Passでも遊べる）',
        href: '/games/gears-of-war-e-day/not-launching',
      },
      {
        date: '10/9',
        game: 'ドラゴンズドグマ2 ダークアリズン',
        note: '発売',
        href: '/games/dragons-dogma-2/performance',
      },
      {
        date: '10/15',
        game: 'Castlevania: Belmont’s Curse',
        note: '発売（KONAMIの発表）',
        href: '/games/castlevania-belmonts-curse/not-launching',
      },
      {
        date: '10/16',
        game: 'テイルズ オブ エターニア リマスター',
        note: '7時発売',
        href: '/games/tales-of-eternia-remastered/not-launching',
      },
    ],
  },
];

export const weeklyReportBySlug = (slug: string) =>
  weeklyReports.find((report) => report.slug === slug);

export const latestWeeklyReport = weeklyReports[0];
