# ゲーム記事102件の構造・根拠監査

PR146 (`ce784c0eaa4dc191fec3acf75d3a3821bd4a7dc9`) に依存するゲームカテゴリの後続差分。先行PR145/146の承認範囲とは別です。本番mergeなし。

残ゲーム102件を本文と既存対応言語・共通テンプレートに照らして確認し、24件を限定修正、78件は本文変更不要と判断しました。対象欄がなくても本文から対象が明確な場合は、その根拠を監査JSONへ残しています。出典数や実機テスト有無だけを合否基準にしていません。

変更は、公式の候補を原因確定としない、修正予定・過去版と現在の結果を分ける、体験版と製品版を分ける、保存コピーと復元確認を分ける、といった記事固有の限定です。新しい実測や作者・レビュー・確認日は追加しません。既存英語の説明範囲へ日本語を合わせ、新規翻訳は作成していません。鬼武者の未確認プリセット名は低い設定という表現へ限定し、対応するOGを1枚再生成しています。

日付の「資料の確認記録」表示と全191件coverageは、このゲーム差分をベースにする後続カテゴリPRで統合します。その共通表示改善を前提とする判定は監査JSONにも明示しています。

## 本文修正24件

| URLパス | 修正理由 |
|---|---|
| /games/monster-hunter-wilds/save-data | 対象Steam版と保存パス・アカウント照合・退避・復元後ロード比較は十分だが、短答の「コピーすれば完了」を復元検証と区別する必要。 |
| /games/monster-hunter-wilds/config-file | config.iniの場所を公式報告案内とPCGamingWikiで説明するが、短答・FAQ・要点が再生成を保証。実際に再生成されたかを確認する書き方へ統一する。 |
| /games/palworld/dedicated-server-settings | Windowsの実設定／テンプレートを区別し反映比較もあるが、既存実設定を初回テンプレートで上書きしない条件が操作文に不足。英語は保全を明示済み。 |
| /games/elden-ring/save-data | PCGamingWikiの場所、Steam対応、アカウントと復元前の保全はある。短答のコピー完了保証だけを、コピー内容と復元確認の区別へ修正する。 |
| /games/elden-ring/not-launching | Windows/Steam対象と症状別STEP、公式FAQ/PCGamingWiki出典はある。整合性確認によるMOD全復元の誤読だけを限定する。 |
| /games/elden-ring/fps | 公式FAQの3対策と60FPS上限、カクつき比較がある。ただし症状分類を原因確定にしている説明を限定する。 |
| /games/elden-ring/ultrawide | 公式非対応と通常黒帯、GPU拡大設定、非公式ツールを分離。全環境60Hz固定の断定を削り、実HzとFPSを区別する。 |
| /games/elden-ring/mod | 追加/置換ファイルと版、オフライン対象はある。検証だけで全復元/オンライン可能と誤読される箇所を、残存ファイルと正常経路確認へ限定する。 |
| /games/onimusha-way-of-the-sword/low-fps | 比較条件・フレーム生成・上限の手順は充実。日本語「最低」と既存英語「Low」の画面名対応を再確認していないため、画面名を低い設定として限定する。 |
| /games/the-blood-of-dawnwalker/shader-compilation-crash | 結論では対象IntelデスクトップCPUに限定するが、STEP 2の「新しいBIOSがあれば更新」が全機種へ読める。英語同様に適用対象判定を操作へ入れる。 |
| /games/star-wars-zero-company/not-launching | 公式の対象Intel第13/14世代デスクトップという結論の限定を、BIOS操作の「該当する場合」にも正確な型番判定として明示する。 |
| /games/star-wars-zero-company/black-screen | 説明文が黒画面の原因を3つに限定し、本文・英語のpossible causesと矛盾する。根拠の広げ過ぎを取り除く必要。 |
| /games/aion2/login-error | Steam/PURPLE・発売時のPlaytest・公式待機方針は詳しい。混雑原因の頻度根拠は示されず、正式版と終了済み先行条件の混同を短答で除く。 |
| /games/shin-sangoku-musou-2-remastered/not-launching | 無料体験版で「確実」とする短答を、既存英語同様に製品版全場面の保証ではない比較へ限定する。要件と具体手順の構造自体は十分。 |
| /games/control-resonant/crash-performance | 対象版1.3.3と公式/PCGamingWiki資料はある。準備中・全件次回修正・再起動成功を現在の保証として読める箇所を限定する。 |
| /games/silent-hill-townfall/stutter | 歴史的パッチの特定buildへの完全一致を現在操作に要求。後続版を許す既存英語と整合させ、当時の修正版の記録として示す。 |
| /games/minecraft-dungeons-2/multiplayer | Microsoftアカウント/4人/party codeという仕様と接続成功の「確実」を区別する。英語には確実保証がなく、短答を限定する。 |
| /games/call-of-duty-modern-warfare-4/crash | 10月23日資料確認と公式推奨ドライバー版、要件未達とクラッシュを区別。全バックグラウンド終了という対象拡大を、列挙されたアプリの個別比較へ狭める。 |
| /games/gears-of-war-e-day/not-launching | 最低要件とbeta情報の出典はある。要件外を実機で正常動作しない断定へ拡大せず、beta案内を製品版情報と分離する。 |
| /games/castlevania-belmonts-curse/not-launching | KONAMIの条件付き既知問題とVer1.1.3、60Hz未満が選べない場合を示す。回避策後の起動成功を読者の結果で確認する形へ限定。 |
| /games/tales-of-eternia-remastered/not-launching | 最低欄1GB GPUとDX12注記4GBの不整合を本文では留保するのに、短答は動作保証。既存英語のように記載条件と実際の起動可否を区別する。 |
| /games/phantom-blade-zero/not-launching | 発売前情報と対象版はあるが日本語短答の重い時の修正指示が現行製品版での結果に見える。既存英語の発売後比較・非再現という具体範囲を反映する。 |
| /games/dragon-quest-monsters-4/demo-transfer | 発売前/Steam/体験版の対象と公式の最大8体・LV1・対象外物品を明示。体験版動作を製品版まで確実と誤読させないよう限定。 |
| /games/where-the-seeds-fall/not-launching | 体験版配信中と未発売製品版を一つの対象にしている。要件は公表情報だが製品版の修復実績でないこと、製品版操作は配信後であることを具体的に補う。 |

## 読み取り監査の記録

- [前半50件](audit-games-a.json)：元SHAの判定と本文根拠
- [後半52件](audit-games-b.json)：元SHAの判定と本文・既存言語の整合

これらは修正前の監査記録です。`needs-specific-edit` は本PRで処理した指摘を表し、未処理の残件を意味しません。最終coverageは後続PRにまとめます。現在の全外部仕様の再研究や全ゲームの実機検証ではありません。既知の拒否を迂回していません。
