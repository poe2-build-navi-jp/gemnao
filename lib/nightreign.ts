import type { GameGuide } from '@/lib/games';
import type { GameArticle } from '@/lib/game-articles';

export const nightreignGuide: GameGuide = {
  "slug": "elden-ring-nightreign",
  "title": "ELDEN RING NIGHTREIGN",
  "shortTitle": "ナイトレイン",
  "hubTitle": "ナイトレインのDLC・深き夜トラブル対処ガイド",
  "lead": "DLCが反映されない、学者・葬儀屋が使えない、深き夜が出ない時のSteam版ガイド。購入・ダウンロード・ゲーム内解禁・オンライン接続を症状に合わせて確認します。",
  "accent": "#53689b",
  "demand": "Windows／Steam版：DLC有効化・深き夜の条件",
  "updated": "2026-10-08",
  "tags": [
    "DLCが反映されない",
    "学者",
    "葬儀屋",
    "深き夜",
    "オンライン",
    "Steam"
  ],
  "savePath": "",
  "configPath": "",
  "fps": "",
  "ultrawide": "",
  "hdr": "",
  "controller": "",
  "launchFixes": [
    "タイトルにThe Forsaken Hollowsがない：SteamのDLC所有権・有効化を確認",
    "DLC名はあるがキャラクターが使えない：「三つ首の獣」撃破後の会話を確認",
    "深き夜が出ない：「夜を象る者」撃破・オンライン接続・Steam更新を確認"
  ],
  "mod": "",
  "japanese": "日本語のインターフェイス・字幕に対応。",
  "specs": {
    "minimum": "公式Steamストアの最新要件を確認",
    "recommended": "公式Steamストアの最新要件を確認",
    "storage": "公式Steamストアの最新表示を確認"
  },
  "sources": [
    {
      "label": "公式：DLCの有効化・解禁手順",
      "url": "https://nightreign.eldenring.jp/article/251202_1.html"
    },
    {
      "label": "公式：深き夜のプレイ条件",
      "url": "https://nightreign.eldenring.jp/article/250828_1.html"
    },
    {
      "label": "公式：2026年7月2日のSteam版更新",
      "url": "https://nightreign.eldenring.jp/article/260702_1.html"
    },
    {
      "label": "公式：2026年9月18日のPS4／PS5版更新",
      "url": "https://nightreign.eldenring.jp/article/260918_1.html"
    },
    {
      "label": "Steam：製品・対応言語・動作環境",
      "url": "https://store.steampowered.com/app/2622380/ELDEN_RING_NIGHTREIGN/"
    }
  ],
  "focused": true
};

export const nightreignArticles: GameArticle[] = [
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "dlc-not-working",
    "title": "ナイトレインのDLCが反映されない｜学者・葬儀屋の解禁確認【Steam版】",
    "shortTitle": "DLC・学者・葬儀屋が使えない",
    "description": "Steam版ナイトレインでThe Forsaken Hollowsが反映されない時に、所有権、DLCのチェック、ダウンロード、タイトル表示、学者・葬儀屋の解禁条件を順に確認します。",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "判定する表示",
        "value": "タイトル画面の「The Forsaken Hollows」"
      },
      {
        "label": "対象",
        "value": "Windows／Steam版。PS・Xboxの操作とは別"
      },
      {
        "label": "解禁の入口",
        "value": "「三つ首の獣」撃破後、召使人形から小壺商人へ"
      },
      {
        "label": "Steam版の更新目安",
        "value": "2026年7月2日掲載：App 1.03.3／Regulation 1.03.5"
      }
    ],
    "diagnosis": [
      {
        "symptom": "SteamのDLC一覧にない",
        "cause": "所有アカウント・購入した商品を要確認",
        "stepId": "check-entitlement"
      },
      {
        "symptom": "DLC名がタイトルにない",
        "cause": "DLC有効化やダウンロードが未完了の可能性",
        "stepId": "enable-dlc"
      },
      {
        "symptom": "DLC名はあるが学者・葬儀屋を選べない",
        "cause": "ゲーム内の解禁条件や会話を要確認",
        "stepId": "unlock-nightfarers"
      },
      {
        "symptom": "キャラクターは使えるが追加標的がない",
        "cause": "キャラクターとは別の出撃条件",
        "stepId": "unlock-target"
      }
    ],
    "steps": [
      {
        "id": "check-entitlement",
        "title": "DLCを所有するSteamアカウントか確認する",
        "summary": "買い直す前に、購入した商品と現在のアカウントを照合します。",
        "actions": [
          "SteamライブラリでELDEN RING NIGHTREIGNを選び、右クリック→「プロパティ」→「DLC」を開く",
          "The Forsaken Hollowsが一覧にあるか確認する。なければ購入履歴や購入時の案内で、商品名・購入先・利用中のアカウントを照合する",
          "一覧にないままなら、チェックを付け直す操作には進まず、購入履歴を用意してSteamサポートで確認する"
        ],
        "note": "本編のみとDLC付き商品を取り違えないでください。別プラットフォームでの購入をSteamの所有権として判断しません。",
        "time": "約2分",
        "risk": "low",
        "nextStepId": "enable-dlc"
      },
      {
        "id": "enable-dlc",
        "title": "DLCにチェックを入れ、Steamを再起動する",
        "summary": "公式のSteam向け有効化手順に沿って、ダウンロード完了まで確認します。",
        "actions": [
          "DLC一覧のThe Forsaken Hollowsにチェックを入れる",
          "Steamクライアントを再起動し、本編とDLCに必要なダウンロードが終わるまで待つ",
          "ゲームを起動し、タイトル右下のバージョン表示の上にThe Forsaken Hollowsが出るか確認する",
          "表示が出れば次の解禁確認へ進む。ダウンロードが止まる、エラーが出る、完了後も表示がない場合は、エラーと表示を記録して最後のSTEPへ進む"
        ],
        "note": "確認日時点のPC向け告知はApp 1.03.3／Regulation 1.03.5です。9月18日のApp 1.03.4はPS4／PS5向けなので、Steamで同じ番号を待つ必要はありません。",
        "time": "確認約3分＋ダウンロード時間",
        "risk": "low",
        "nextStepId": "unlock-nightfarers"
      },
      {
        "id": "unlock-nightfarers",
        "title": "「三つ首の獣」撃破後の会話を確認する",
        "summary": "タイトルにDLC名が出ている場合は、進行条件を確認します。",
        "actions": [
          "今使っているセーブで標的「三つ首の獣」を撃破しているか確認する",
          "撃破済みなら円卓の召使人形に話しかけ、小壺商人からの言伝を聞く",
          "小壺商人のもとへ向かい、案内に沿って進めた後に学者・葬儀屋を選べるか確認する",
          "条件を満たして会話を確認しても変化がなければ、セーブを消さずに状況を記録する"
        ],
        "note": "この手順はキャラクターの解禁です。追加標的の条件とは分けて確認してください。",
        "time": "確認約3分・攻略時間は別",
        "risk": "low",
        "nextStepId": "unlock-target"
      },
      {
        "id": "unlock-target",
        "title": "追加標的がない場合は、別の条件を確認する",
        "summary": "キャラクターを選べる状態でも、追加標的には別の進行確認があります。",
        "actions": [
          "学者・葬儀屋の解禁と、標的を2体以上撃破した状態を確認する",
          "円卓の小壺商人の奥にある礼拝堂へ向かい、追加標的「安寧者たち」への出撃を確認する",
          "深き夜だけでDLC要素を見かけない場合は、関連記事の「深き夜が出ない」でマッチング条件を確認する"
        ],
        "note": "深き夜へのDLC要素追加は2025年12月17日に実施済みです。発売時の「今後のアップデート」を現在の未実装情報として扱わないでください。",
        "time": "確認約3分・攻略時間は別",
        "risk": "low",
        "nextStepId": "record-result"
      },
      {
        "id": "record-result",
        "title": "直らない場合は、どこまで確認できたかを整理する",
        "summary": "購入、インストール、解禁のどこで止まるかを伝えます。",
        "actions": [
          "DLC一覧の表示、タイトル画面のDLC名、App／Regulation番号を控える",
          "「三つ首の獣」撃破の有無、召使人形と小壺商人の会話、追加キャラクター選択の可否を整理する",
          "所有権が確認できない時はSteamサポートへ、ゲーム内の条件を満たしても進まない時は公式サイトのサポート案内へ、エラー全文と発生日時を添えて相談する",
          "本編自体が起動しない場合は、共通のSteam起動ガイドに進み、DLCの解禁操作とは分けて調べる"
        ],
        "note": "2026年1月15日には一部衣装・固有遺物が消失した場合の再入手に関する修正が公表されています。過去の消失報告と、現在のキャラクター未解禁を同じ不具合だと断定しません。",
        "time": "約5分",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Steamのゲームが起動しない時の共通ガイド",
          "description": "タイトル画面に到達できない場合に使います。DLCの所有権や解禁条件を変更する手順ではありません。"
        }
      }
    ],
    "avoid": [
      "DLC名が出ないだけで、購入済みDLCを買い直さない。",
      "セーブ削除・セーブ編集・非公式のDLC解除ツールを試さない。",
      "PS4／PS5向けパッチ番号や操作をSteam版へ当てはめない。"
    ],
    "cautions": [
      "公式情報を2026年10月8日に確認した手順です。実機での再現・解消を保証するものではありません。",
      "ダウンロード中は空き容量と通信エラーも確認し、複数の設定を一度に変えず結果を記録してください。"
    ],
    "faqs": [
      {
        "question": "デラックス版を持っていても有効化が必要ですか？",
        "answer": "公式の開始案内にはデラックス版などの購入者も有効化対象として記載されています。購入済みの確認と、SteamのDLCチェック・タイトル表示の確認を分けて進めてください。"
      },
      {
        "question": "学者と葬儀屋が使えれば、追加標的も出ますか？",
        "answer": "追加標的は別に標的2体以上の撃破と礼拝堂の確認が必要です。キャラクター選択ができることだけでは、追加標的の条件確認は終わりません。"
      },
      {
        "question": "衣装や遺物の消失情報を見ました。今も未修正ですか？",
        "answer": "2026年1月15日の公式更新には、消失した一部衣装・固有遺物を円卓で再入手する修正が記載されています。更新を適用した状態で対象を確認し、別の症状なら発生条件を分けて報告してください。"
      }
    ],
    "sources": [
      {
        "label": "公式：DLCの有効化・解禁手順",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "公式：2025年12月17日のDLC要素追加",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "公式：2026年1月15日の修正・調整",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "公式：2026年7月2日のSteam版更新",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "公式：2026年9月18日のPS4／PS5版更新",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "公式：お知らせ一覧",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "Steam：製品・対応言語・動作環境",
        "url": "https://store.steampowered.com/app/2622380/ELDEN_RING_NIGHTREIGN/"
      },
      {
        "label": "バンダイナムコ公式：DLCコンテンツの解禁方法（英語）",
        "url": "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-nightreign-how-unlock-the-dlc-content"
      }
    ],
    "category": "settings",
    "status": "verified",
    "symptom": "DLCを購入したのに追加キャラクターが選べない、タイトルにDLC名が出ない、追加標的に出撃できない人向けです。Steam版を対象に、インストールの問題とゲーム内の進行条件を分けます。",
    "conclusion": "タイトル右下のバージョン表記の上に「The Forsaken Hollows」があるかが分岐点です。なければSteam側のDLC有効化、あれば「三つ首の獣」撃破後の召使人形・小壺商人への会話を確認します。購入済みだけではキャラクター解禁まで完了したことになりません。",
    "targetVersion": "Windows／Steam版。公式情報確認：2026-10-08",
    "causes": [
      "所有アカウント・購入した商品を要確認",
      "DLC有効化やダウンロードが未完了の可能性",
      "ゲーム内の解禁条件や会話を要確認",
      "キャラクターとは別の出撃条件"
    ],
    "symptoms": [
      {
        "label": "SteamのDLC一覧にない",
        "target": "check-entitlement"
      },
      {
        "label": "DLC名がタイトルにない",
        "target": "enable-dlc"
      },
      {
        "label": "DLC名はあるが学者・葬儀屋を選べない",
        "target": "unlock-nightfarers"
      },
      {
        "label": "キャラクターは使えるが追加標的がない",
        "target": "unlock-target"
      }
    ],
    "related": [
      "deep-of-night-not-appearing"
    ],
    "seoTitle": "ナイトレインのDLCが反映されない｜学者・葬儀屋の解禁確認【Steam版】",
    "metaDescription": "Steam版ナイトレインでThe Forsaken Hollowsが反映されない時に、所有権、DLCのチェック、ダウンロード、タイトル表示、学者・葬儀屋の解禁条件を順に確認します。",
    "ogTitle": "ナイトレイン DLCが使えない",
    "ogSteps": [
      "DLC所有権",
      "Steamで有効化",
      "タイトル表示",
      "解禁条件"
    ]
  },
  {
    "gameSlug": "elden-ring-nightreign",
    "slug": "deep-of-night-not-appearing",
    "title": "ナイトレインで深き夜が出ない｜解放条件・オンライン接続を確認",
    "shortTitle": "深き夜が出ない",
    "description": "ナイトレインの深き夜が表示されない・遊べない時に、「夜を象る者」撃破、オンライン接続、Steam版更新を確認。DLC要素が出ない場合も分けて解説します。",
    "checkedAt": "2026-10-08",
    "quickFacts": [
      {
        "label": "解放条件",
        "value": "夜の王「夜を象る者」の撃破"
      },
      {
        "label": "接続条件",
        "value": "オンライン専用。1～3人出撃に対応"
      },
      {
        "label": "DLCとの関係",
        "value": "モード自体の解放とDLC要素の出現は別条件"
      },
      {
        "label": "確認日",
        "value": "2026年10月8日"
      }
    ],
    "diagnosis": [
      {
        "symptom": "モード自体が出ない",
        "cause": "撃破条件が未達の可能性",
        "stepId": "check-clear"
      },
      {
        "symptom": "1人で遊ぶのに選べない",
        "cause": "オフライン起動の可能性",
        "stepId": "check-online"
      },
      {
        "symptom": "ログインできない・更新を求められる",
        "cause": "更新未完了や接続エラーを要確認",
        "stepId": "check-update"
      },
      {
        "symptom": "深き夜でDLC要素だけ見かけない",
        "cause": "DLC適用メンバーの条件や出現抽選",
        "stepId": "check-dlc-content"
      }
    ],
    "steps": [
      {
        "id": "check-clear",
        "title": "現在のセーブで「夜を象る者」を撃破したか確認する",
        "summary": "深き夜の条件はDLCキャラクターの解禁条件とは異なります。",
        "actions": [
          "現在読み込んでいるセーブの進行状況を確認する",
          "「夜を象る者」を未撃破なら、通常の出撃で攻略を進める",
          "撃破済みなら次のオンライン状態確認へ進む"
        ],
        "note": "「三つ首の獣」の撃破だけで深き夜が解放されるという条件ではありません。セーブを作り直す対処は不要です。",
        "time": "確認約2分・攻略時間は別",
        "risk": "low",
        "nextStepId": "check-online"
      },
      {
        "id": "check-online",
        "title": "タイトル画面からオンライン接続を確認する",
        "summary": "1人出撃とオフラインプレイは別です。",
        "actions": [
          "タイトル画面に戻り、オフライン状態になっていないか確認する",
          "オフラインで起動していた場合はタイトルメニューの「LOGIN」を選ぶ",
          "接続後に深き夜を選べるか確認する。LOGINが失敗するなら、エラー文を控えて次のSTEPへ進む"
        ],
        "note": "公式案内ではオンライン接続中なら1～3人で出撃できます。人数を3人に変えることをモード解放の条件にはしません。",
        "time": "約2分",
        "risk": "low",
        "nextStepId": "check-update"
      },
      {
        "id": "check-update",
        "title": "Steam向け更新の完了と公式告知を確認する",
        "summary": "PC版と家庭用版の更新番号は一致しない場合があります。",
        "actions": [
          "ゲームを終了し、Steamでダウンロードや更新が残っていないか確認する",
          "更新完了後にゲームを起動し、タイトルのApp／Regulation番号を控える",
          "公式のお知らせ一覧でSteam対象の更新と、接続に影響する案内を確認する",
          "更新後にログインし直す。ログインできてもモードが出なければ、撃破条件の確認結果と併せて最後のSTEPへ進む"
        ],
        "note": "2026年10月8日の確認時点では、Steam向け最新掲載は7月2日のApp 1.03.3／Regulation 1.03.5です。9月18日のApp 1.03.4はPS4／PS5のみです。",
        "time": "確認約3分＋更新時間",
        "risk": "low",
        "nextStepId": "check-dlc-content"
      },
      {
        "id": "check-dlc-content",
        "title": "モードは遊べるがDLC要素が出ない場合を分ける",
        "summary": "これは深き夜そのものが未解放という症状ではありません。",
        "actions": [
          "The Forsaken Hollowsの有効化を確認する。タイトルにDLC名がなければ関連記事のDLC有効化ガイドへ進む",
          "マルチプレイではDLCを適用したプレイヤーだけでマッチングした出撃か確認する",
          "条件を満たしていても、1回の出撃で目的のボスや地変が出なかっただけで不具合と断定しない"
        ],
        "note": "DLC要素は2025年12月17日に追加済みで、2026年1月15日には出現率の調整も公表されています。必ず特定の要素が出るという案内ではありません。",
        "time": "約2分",
        "risk": "low",
        "nextStepId": "record-result"
      },
      {
        "id": "record-result",
        "title": "未解放・ログイン失敗・マッチング待ちを分けて報告する",
        "summary": "どの画面で止まるかを具体化すると、問い合わせ先で切り分けやすくなります。",
        "actions": [
          "「夜を象る者」の撃破、オンライン状態、Steam版の更新番号を記録する",
          "モードがないのか、選べるが接続エラーになるのか、出撃のマッチング待ちなのかを分ける",
          "発生日時、エラー全文、直前の更新、試した手順を添えて公式サイトのサポート案内へ進む",
          "タイトル自体に到達できない場合は共通の起動ガイドを使う。モードのためにセーブや認証関連ファイルを消さない"
        ],
        "note": "公式のメンテナンス案内が出ている時は、その対象・日時を確認してください。この記事はリアルタイムの障害発生を示すものではありません。",
        "time": "約5分",
        "risk": "low",
        "guideLink": {
          "href": "/guide/steam-game-not-launching",
          "label": "Steamのゲームが起動しない時の共通ガイド",
          "description": "本編が開かない場合の切り分けです。深き夜の解放条件とは別に確認します。"
        }
      }
    ],
    "avoid": [
      "深き夜を出すためにセーブデータを消さない。",
      "オンライン専用モードのためにアンチチートを回避しない。",
      "出撃を途中離脱して表示を試さない。マルチプレイ中の離脱にはペナルティが案内されています。"
    ],
    "cautions": [
      "モード選択、ログイン、マッチング待ちは別の症状です。エラーが出た画面を残してください。",
      "DLCを持つことと、深き夜の撃破・接続条件を満たすことは別です。"
    ],
    "faqs": [
      {
        "question": "深き夜は1人ならオフラインで遊べますか？",
        "answer": "遊べません。出撃人数を1人にしてもオンライン接続が必要です。通常モードの1人プレイと区別してください。"
      },
      {
        "question": "チームや合言葉を使うと深き夜に入れませんか？",
        "answer": "公式案内ではチームセッションとマルチプレイ合言葉を利用できます。待機が続く状況はモード未解放と分け、画面表示と接続状況を記録してください。"
      },
      {
        "question": "DLCを買わないと深き夜は出ませんか？",
        "answer": "公式のモード条件は「夜を象る者」撃破とオンライン接続です。DLC適用者のみのマッチングという条件は、深き夜の中でDLC追加要素が出現する場合のものです。"
      }
    ],
    "sources": [
      {
        "label": "公式：深き夜のプレイ条件",
        "url": "https://nightreign.eldenring.jp/article/250828_1.html"
      },
      {
        "label": "公式：DLCの有効化・解禁手順",
        "url": "https://nightreign.eldenring.jp/article/251202_1.html"
      },
      {
        "label": "公式：2025年12月17日のDLC要素追加",
        "url": "https://nightreign.eldenring.jp/article/251217_1.html"
      },
      {
        "label": "公式：2026年1月15日の修正・調整",
        "url": "https://nightreign.eldenring.jp/article/260115_1.html"
      },
      {
        "label": "公式：2026年7月2日のSteam版更新",
        "url": "https://nightreign.eldenring.jp/article/260702_1.html"
      },
      {
        "label": "公式：2026年9月18日のPS4／PS5版更新",
        "url": "https://nightreign.eldenring.jp/article/260918_1.html"
      },
      {
        "label": "公式：お知らせ一覧",
        "url": "https://nightreign.eldenring.jp/news.html"
      },
      {
        "label": "バンダイナムコ公式：深き夜の説明（スペイン語）",
        "url": "https://es.bandainamcoent.eu/elden-ring/noticias/elden-ring-nightreign-explicacion-de-profundidades-de-la-noche"
      }
    ],
    "category": "server",
    "status": "verified",
    "symptom": "高難度モード「深き夜」が使えない人向けです。モード自体の条件と、出撃中にDLCのボスや地変を見かけない状況を混同せず確認します。",
    "conclusion": "深き夜には「夜を象る者」の撃破とオンライン接続が必要です。1人出撃でもオフラインでは遊べません。条件を満たすのに使えない場合はSteamの更新完了を確認し、ログインエラーとモード表示を分けて記録します。",
    "targetVersion": "Windows／Steam版。公式情報確認：2026-10-08",
    "causes": [
      "撃破条件が未達の可能性",
      "オフライン起動の可能性",
      "更新未完了や接続エラーを要確認",
      "DLC適用メンバーの条件や出現抽選"
    ],
    "symptoms": [
      {
        "label": "モード自体が出ない",
        "target": "check-clear"
      },
      {
        "label": "1人で遊ぶのに選べない",
        "target": "check-online"
      },
      {
        "label": "ログインできない・更新を求められる",
        "target": "check-update"
      },
      {
        "label": "深き夜でDLC要素だけ見かけない",
        "target": "check-dlc-content"
      }
    ],
    "related": [
      "dlc-not-working"
    ],
    "seoTitle": "ナイトレインで深き夜が出ない｜解放条件・オンライン接続を確認",
    "metaDescription": "ナイトレインの深き夜が表示されない・遊べない時に、「夜を象る者」撃破、オンライン接続、Steam版更新を確認。DLC要素が出ない場合も分けて解説します。",
    "ogTitle": "ナイトレイン 深き夜が出ない",
    "ogSteps": [
      "撃破条件",
      "オンライン接続",
      "Steam版更新",
      "DLC条件を区別"
    ]
  }
];
