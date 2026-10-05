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
        source: { label: 'Steamニュース（公式）', url: steamNews('1636440') },
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
