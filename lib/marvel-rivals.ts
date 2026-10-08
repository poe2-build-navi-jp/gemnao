import type { GameGuide } from '@/lib/games';
import type { GameArticle } from '@/lib/game-articles';

export const marvelRivalsGuide: GameGuide = {
  "slug": "marvel-rivals",
  "title": "Marvel Rivals（マーベル・ライバルズ）",
  "shortTitle": "Marvel Rivals",
  "hubTitle": "Marvel Rivalsのログイン・接続・高Ping対策【PC版】",
  "lead": "Marvel Rivals（マーベル・ライバルズ）のPC版で、ログインや試合参加に失敗する場合と、対戦中の通信遅延を分けて確認。公式のネットワーク診断とサーバー選択を案内します。",
  "accent": "#cf9a21",
  "demand": "PC版のログイン・試合参加・通信遅延",
  "updated": "2026-10-08",
  "tags": [
    "ログインできない",
    "試合に入れない",
    "高Ping",
    "ラグ",
    "CapturePro"
  ],
  "savePath": "接続診断ではセーブファイルを変更しません",
  "configPath": "接続診断では設定ファイルを削除しません",
  "fps": "",
  "ultrawide": "",
  "hdr": "",
  "controller": "",
  "launchFixes": [
    "入れないときは接続診断、入れるが遅いときはサーバー比較と遅延診断へ進みます。診断は修復の保証ではなく、再現条件を集めて公式サポートへ伝えるための手順です。",
    "公式告知と失敗する場面を確認し、PCの正規インストール内にあるCapturePro.exeでNetwork Adaptability Testを選びます。診断結果だけで原因を断定せず、改善しなければ時刻・エラーと合わせて公式サポートへ相談します。",
    "まず選択中のサーバーと表示される遅延を比べ、必要なら低遅延のノードで再確認します。改善しなければCapturePro.exeのNetwork Delay Testで、普段使うノードや近い地域を測り、遅延が出た時刻と結果を残します。"
  ],
  "mod": "",
  "japanese": "Steamストアでは日本語のインターフェース・音声・字幕に対応。",
  "specs": {
    "minimum": "Windows 10 64-bit（1909以降）、Core i5-6600K／Ryzen 5 1600X、RAM 16GB、GTX 1060／RX 580／Arc A380、DirectX 12",
    "recommended": "Core i5-10400／Ryzen 5 5600X、RAM 16GB、RTX 2060 (Super)／RX 5700-XT／Arc A750、DirectX 12",
    "storage": "空き容量70GB、SSDへのインストールを推奨（Steam表示）"
  },
  "sources": [
    {
      "label": "Marvel Rivals公式：ネットワーク解析ツールの使い方",
      "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
    },
    {
      "label": "Marvel Rivals公式：サーバー選択",
      "url": "https://www.marvelrivals.com/guide/server/"
    },
    {
      "label": "Marvel Rivals公式：リリースFAQ・サポート窓口",
      "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
    },
    {
      "label": "Marvel Rivals公式ニュース",
      "url": "https://www.marvelrivals.com/news/"
    },
    {
      "label": "Steamストア：Marvel Rivalsの動作環境・言語",
      "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
    }
  ],
  "focused": true
};

export const marvelRivalsArticles: GameArticle[] = [
  {
    "gameSlug": "marvel-rivals",
    "slug": "login-error",
    "category": "server",
    "title": "Marvel Rivalsにログインできない・試合に入れないときの確認方法【PC版】",
    "shortTitle": "ログイン・試合参加に失敗",
    "symptom": "ゲームのログインで止まる、ロビーには入れるが試合参加に失敗する人向けです。起動直後にアプリ自体が落ちる場合や、試合中だけ動作が遅い場合とは分けて調べます。",
    "conclusion": "公式告知と失敗する場面を確認し、PCの正規インストール内にあるCapturePro.exeでNetwork Adaptability Testを選びます。診断結果だけで原因を断定せず、改善しなければ時刻・エラーと合わせて公式サポートへ相談します。",
    "description": "Marvel RivalsのPC版でログインや試合参加に失敗するときに、公式告知、エラーの記録、CaptureProのNetwork Adaptability Test、診断結果の安全な提出を順に確認します。",
    "checkedAt": "2026-10-08",
    "status": "verified",
    "targetVersion": "Windows PC版／正規インストール内の公式ツール",
    "symptoms": [
      {
        "label": "公式告知と、止まる場所を記録する",
        "target": "check-service"
      },
      {
        "label": "正規のインストール先でCapturePro.exeを探す",
        "target": "open-capturepro"
      },
      {
        "label": "Network Adaptability Testで接続を調べる",
        "target": "test-connectivity"
      },
      {
        "label": "結果と再現条件を公式サポートへ伝える",
        "target": "contact-support"
      }
    ],
    "steps": [
      {
        "id": "check-service",
        "title": "公式告知と、止まる場所を記録する",
        "summary": "メンテナンスの案内と、手元で起きる失敗を分けて確認します。",
        "actions": [
          "公式ニュースで、利用している日時・地域・プラットフォームに関係する障害やメンテナンス告知を読む。告知がなければ正常と断定しない。",
          "ログイン前か、ロビーから試合に入る段階かを記録する。エラー全文と発生日時・タイムゾーン、利用ストアも控える。",
          "該当するメンテナンス中なら終了案内を待つ。終了後、同じ操作で再確認する。"
        ],
        "time": "約2分",
        "risk": "low",
        "nextStepId": "open-capturepro"
      },
      {
        "id": "open-capturepro",
        "title": "正規のインストール先でCapturePro.exeを探す",
        "summary": "公式はゲームのインストールフォルダにあるツールを案内しています。",
        "actions": [
          "利用ストアやランチャーでゲームのインストール先を確認して開く。",
          "CapturePro.exeがその正規インストール内にあることを確認し、公式ガイドと照合する。",
          "見つからない、またはセキュリティ警告が出る場合は実行を中止し、警告内容と入手元を公式サポートへ伝える。非公式サイトから単体ファイルを補わない。"
        ],
        "time": "約2分",
        "risk": "low",
        "nextStepId": "test-connectivity"
      },
      {
        "id": "test-connectivity",
        "title": "Network Adaptability Testで接続を調べる",
        "summary": "ログイン・試合参加に失敗する場合に公式が指定するテストです。",
        "actions": [
          "正規インストールのCapturePro.exeを開き、Network Adaptability Testを選ぶ。",
          "ツール内の案内に従い、表示された結果を記録する。成功表示でも、実際にログインや試合参加ができるか別途確認する。",
          "テストを実行できない場合も、それ自体を記録して次の問い合わせ準備へ進む。"
        ],
        "time": "所要時間は環境による",
        "risk": "low",
        "note": "公式の「約20秒後にStop」は遅延テストの説明です。この接続テストの共通制限時間としては扱いません。",
        "nextStepId": "contact-support"
      },
      {
        "id": "contact-support",
        "title": "結果と再現条件を公式サポートへ伝える",
        "summary": "診断の成否とゲーム側の成否を、別々に報告します。",
        "actions": [
          "発生日時・タイムゾーン、利用ストア、失敗する画面、エラー全文、診断の結果をまとめる。",
          "公式案内のtr_results_xxxxxxxx_xxxxxx.zipが作成された場合は、その保存場所を控える。ない場合は、作成されなかったことを伝える。",
          "公式FAQからDiscordのMarvel Rivals Supportへ進み、提出先と必要な情報を確認する。スクリーンショットのメールアドレス・IPアドレス等は隠す。ログ原本は残し、編集してよい項目が不明ならサポートに確認する。"
        ],
        "time": "約3分",
        "risk": "low"
      }
    ],
    "cautions": [
      "診断ファイルには接続先や端末・通信環境の情報が含まれる可能性があります。公開チャットには載せず、公式サイトからたどったサポート窓口で、必要な情報と安全な提出方法を確認してください。",
      "公式の公開資料を基にした案内です。実機での再現・解決を保証するものではありません。"
    ],
    "faqs": [
      {
        "question": "サーバー地域を変えるとログイン障害も直りますか？",
        "answer": "公式リリースFAQはログイン用サーバーとマッチング時に選ぶサーバーを区別しています。対戦ノードの選択だけでログイン障害が直るとは判断できません。"
      },
      {
        "question": "CapturePro.exeがありません。別サイトから取ってよいですか？",
        "answer": "非公式配布の実行ファイルは使わず、正規インストールに見当たらないことを公式サポートへ伝えてください。このガイドは単体ダウンロード先や、全ストアでの配置場所を保証しません。"
      },
      {
        "question": "診断では問題が出ないのに試合へ入れません。",
        "answer": "テスト実施時と失敗時の条件が違う可能性があります。成功した診断と、失敗した試合参加の日時・エラーを両方残して相談してください。アカウント制限や通信経路の原因を、この結果だけで断定しないでください。"
      }
    ],
    "quickFacts": [
      {
        "label": "使うテスト",
        "value": "Network Adaptability Test"
      },
      {
        "label": "対象",
        "value": "Windows PC版／正規インストール内の公式ツール"
      }
    ],
    "diagnosis": [
      {
        "symptom": "公式告知と、止まる場所を記録する",
        "cause": "メンテナンスの案内と、手元で起きる失敗を分けて確認します。",
        "stepId": "check-service"
      },
      {
        "symptom": "正規のインストール先でCapturePro.exeを探す",
        "cause": "公式はゲームのインストールフォルダにあるツールを案内しています。",
        "stepId": "open-capturepro"
      },
      {
        "symptom": "Network Adaptability Testで接続を調べる",
        "cause": "ログイン・試合参加に失敗する場合に公式が指定するテストです。",
        "stepId": "test-connectivity"
      },
      {
        "symptom": "結果と再現条件を公式サポートへ伝える",
        "cause": "診断の成否とゲーム側の成否を、別々に報告します。",
        "stepId": "contact-support"
      }
    ],
    "avoid": [
      "CapturePro.exeを検索広告・ミラーサイト・非公式の配布リンクから入手しない。",
      "通信トラブルを理由にウイルス対策やファイアウォールを一括無効化しない。",
      "パスワード、認証コード、トークンをスクリーンショットや問い合わせ本文に載せない。"
    ],
    "sources": [
      {
        "label": "Marvel Rivals公式：ネットワーク解析ツールの使い方",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals公式：サーバー選択",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals公式：リリースFAQ・サポート窓口",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals公式ニュース",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steamストア：Marvel Rivalsの動作環境・言語",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "related": [
      "high-ping"
    ],
    "seoTitle": "Marvel Rivalsにログインできない・試合に入れないときの確認方法【PC版】",
    "metaDescription": "Marvel RivalsのPC版でログインや試合参加に失敗するときに、公式告知、エラーの記録、CaptureProのNetwork Adaptability Test、診断結果の安全な提出を順に確認します。",
    "ogTitle": "ログイン・試合参加に失敗",
    "ogSteps": [
      "公式告知と、止まる場所を記録する",
      "正規のインストール先でCapturePro.exeを探す",
      "Network Adaptability Testで接続を調べる"
    ]
  },
  {
    "gameSlug": "marvel-rivals",
    "slug": "high-ping",
    "category": "server",
    "title": "Marvel RivalsのPingが高い・ラグいときの確認方法【PC版】",
    "shortTitle": "高Ping・通信ラグ",
    "symptom": "ログインと試合参加はできるものの、移動や攻撃の反映が遅い場合のPC向けガイドです。FPS低下だけの症状は、通信遅延と分けて記録してください。",
    "conclusion": "まず選択中のサーバーと表示される遅延を比べ、必要なら低遅延のノードで再確認します。改善しなければCapturePro.exeのNetwork Delay Testで、普段使うノードや近い地域を測り、遅延が出た時刻と結果を残します。",
    "description": "Marvel Rivalsの高Pingや対戦中の通信ラグを、サーバーノード選択と公式CaptureProのNetwork Delay Testで確認。約20秒の比較と症状発生時の記録を使い分けます。",
    "checkedAt": "2026-10-08",
    "status": "verified",
    "targetVersion": "Windows PC版／正規インストール内の公式ツール",
    "symptoms": [
      {
        "label": "通信遅延とFPS低下を分ける",
        "target": "separate-lag"
      },
      {
        "label": "対戦サーバーの候補を比較する",
        "target": "compare-nodes"
      },
      {
        "label": "Network Delay Testで遅延を記録する",
        "target": "test-delay"
      },
      {
        "label": "結果を比較し、必要なら公式窓口へ送る",
        "target": "review-delay"
      }
    ],
    "steps": [
      {
        "id": "separate-lag",
        "title": "通信遅延とFPS低下を分ける",
        "summary": "「重い」だけでは、通信と描画のどちらを見るべきか決まりません。",
        "actions": [
          "遅れるのが移動・攻撃の反映か、画面全体の滑らかさかを書き分ける。",
          "表示できる場合はPingとFPS、選択したノード、発生時刻を一緒に控える。数値がなければ症状だけ記録する。",
          "公式ニュースで関連する障害告知を確認する。FPSだけが下がる場合は、共通の低FPSガイドへ進む。"
        ],
        "time": "約2分",
        "risk": "low",
        "nextStepId": "compare-nodes",
        "guideLink": {
          "href": "/guide/low-fps",
          "label": "共通の低FPS対策",
          "description": "通信遅延ではなく描画が重い場合はこちら。"
        }
      },
      {
        "id": "compare-nodes",
        "title": "対戦サーバーの候補を比較する",
        "summary": "公式は1つのサーバー、または複数のサーバーの選択を案内しています。",
        "actions": [
          "ゲーム内で選択可能なサーバーと遅延表示を確認し、現在の選択を控える。",
          "まず遅延の低い候補で比較する。地名の近さだけで良好と決めず、実際の表示と試合中の状態を見る。",
          "選択を変えた場合は、変更前後のノード・時刻・症状を記録する。改善しなければ元の選択へ戻せるようにする。"
        ],
        "time": "約2分",
        "risk": "low",
        "note": "ノードの選択は低Pingや短い待ち時間を保証しません。利用できるノードは現在のクライアント表示を優先してください。",
        "nextStepId": "test-delay"
      },
      {
        "id": "test-delay",
        "title": "Network Delay Testで遅延を記録する",
        "summary": "公式ツールで普段使うノードや近い地域を選んで測定します。",
        "actions": [
          "正規のゲームインストール内のCapturePro.exeを開き、Network Delay Testを選ぶ。見つからない場合は非公式配布を使わずサポートへ相談する。",
          "普段接続するノード、または近い地域を選択する。短い比較測定では約20秒待ち、手動でStopを押す。",
          "公式はプレイ中の測定も案内している。症状を記録する場合は遅延が目立った時点でStopを押し、その時刻・ノード・症状を控える。"
        ],
        "time": "測定約20秒＋準備",
        "risk": "low",
        "note": "約20秒は公式の比較測定の目安であり、回復までの時間ではありません。警告を回避してツールを実行しないでください。",
        "nextStepId": "review-delay"
      },
      {
        "id": "review-delay",
        "title": "結果を比較し、必要なら公式窓口へ送る",
        "summary": "測定中の条件を添えると、症状を説明しやすくなります。",
        "actions": [
          "ノードを変えた前後と、遅延が発生した時の記録を比較する。1回の結果だけで回線業者やサーバーの故障と断定しない。",
          "改善した場合は選択したノードと条件を控える。再発した場合は、時刻・タイムゾーンと試合中の症状を追記する。",
          "改善しなければ公式FAQからMarvel Rivals Supportへ進む。生成されたtr_results_xxxxxxxx_xxxxxx.zipの提出方法を確認し、公開チャットには置かない。スクリーンショットの個人情報は隠し、ログ編集は窓口に確認してから行う。"
        ],
        "time": "約3分",
        "risk": "low"
      }
    ],
    "cautions": [
      "診断ファイルには接続先や端末・通信環境の情報が含まれる可能性があります。公開チャットには載せず、公式サイトからたどったサポート窓口で、必要な情報と安全な提出方法を確認してください。",
      "公式の公開資料を基にした案内です。実機での再現・解決を保証するものではありません。"
    ],
    "faqs": [
      {
        "question": "日本から遊ぶならTokyoを選べば必ず最速ですか？",
        "answer": "公式の一覧にはTokyoがありますが、最良の通信経路は接続環境で変わります。利用中のクライアントが示す遅延と、実際の試合中の状態で比較してください。"
      },
      {
        "question": "Network Delay TestでFPSも改善しますか？",
        "answer": "公式はネットワーク遅延の診断として案内しています。FPSを上げる機能とは説明していません。Pingが安定していてFPSだけ低い場合は描画負荷の確認へ進みます。"
      },
      {
        "question": "サーバーを全部選ぶ方がよいですか？",
        "answer": "公式は単一または複数の選択を認めていますが、全選択が常に最善とは説明していません。各候補の遅延を比べ、設定を変えた前後で症状を確認してください。"
      }
    ],
    "quickFacts": [
      {
        "label": "使うテスト",
        "value": "Network Delay Test"
      },
      {
        "label": "対象",
        "value": "Windows PC版／正規インストール内の公式ツール"
      }
    ],
    "diagnosis": [
      {
        "symptom": "通信遅延とFPS低下を分ける",
        "cause": "「重い」だけでは、通信と描画のどちらを見るべきか決まりません。",
        "stepId": "separate-lag"
      },
      {
        "symptom": "対戦サーバーの候補を比較する",
        "cause": "公式は1つのサーバー、または複数のサーバーの選択を案内しています。",
        "stepId": "compare-nodes"
      },
      {
        "symptom": "Network Delay Testで遅延を記録する",
        "cause": "公式ツールで普段使うノードや近い地域を選んで測定します。",
        "stepId": "test-delay"
      },
      {
        "symptom": "結果を比較し、必要なら公式窓口へ送る",
        "cause": "測定中の条件を添えると、症状を説明しやすくなります。",
        "stepId": "review-delay"
      }
    ],
    "avoid": [
      "CapturePro.exeを検索広告・ミラーサイト・非公式の配布リンクから入手しない。",
      "通信トラブルを理由にウイルス対策やファイアウォールを一括無効化しない。",
      "パスワード、認証コード、トークンをスクリーンショットや問い合わせ本文に載せない。"
    ],
    "sources": [
      {
        "label": "Marvel Rivals公式：ネットワーク解析ツールの使い方",
        "url": "https://www.marvelrivals.com/guide/20250106/41348_1204589.html"
      },
      {
        "label": "Marvel Rivals公式：サーバー選択",
        "url": "https://www.marvelrivals.com/guide/server/"
      },
      {
        "label": "Marvel Rivals公式：リリースFAQ・サポート窓口",
        "url": "https://www.marvelrivals.com/news/20241205/40185_1198415.html"
      },
      {
        "label": "Marvel Rivals公式ニュース",
        "url": "https://www.marvelrivals.com/news/"
      },
      {
        "label": "Steamストア：Marvel Rivalsの動作環境・言語",
        "url": "https://store.steampowered.com/app/2767030/Marvel_Rivals/"
      }
    ],
    "related": [
      "login-error"
    ],
    "seoTitle": "Marvel RivalsのPingが高い・ラグいときの確認方法【PC版】",
    "metaDescription": "Marvel Rivalsの高Pingや対戦中の通信ラグを、サーバーノード選択と公式CaptureProのNetwork Delay Testで確認。約20秒の比較と症状発生時の記録を使い分けます。",
    "ogTitle": "高Ping・通信ラグ",
    "ogSteps": [
      "通信遅延とFPS低下を分ける",
      "対戦サーバーの候補を比較する",
      "Network Delay Testで遅延を記録する"
    ]
  }
];
