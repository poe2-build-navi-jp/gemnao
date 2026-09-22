# ゲムなお：症状・解決データ更新（2026-09-22）

## 判断と根拠

短期のPV増加は未保証。Search Consoleのクエリ別実績・検索ボリュームは今回取得していない。公開検索だけで需要量や低競合を断定しない。既存ハブから到達でき、公式情報で具体的に回答できる検索意図を優先した。

- EA公式のZero Companyサポートで、GTX 10／RTX 20向けの環境ジオメトリ詳細、DLSSと610.88以前のドライバーの条件を確認。起動失敗と継続的なFPS不足を分離。GPU設定の記事を1本追加し、既存起動記事の抽象的なSTEPを操作手順へ更新。
  https://help.ea.com/ja/articles/star-wars/zero-company/troubleshoot-common-issues/
- Dawnwalker公式Hotfix 1.0.2（2026-09-09）にはPCの走行入力・デッドゾーン調整が記載済み。既存記事の感度0.8への変更優先を取り下げ、更新確認を優先。PS5ボタン割り当ては同告知では別の未解決事項。後続版でも未解決と断定しない。
  https://dawnwalkergame.com/us/en/news/hotfix-102
- Discord公式の最低クライアント条件（2026-02-20更新）は、2026-03-02以降の通話暗号化対応を案内。RTC一般とは分け、古い版で文字チャットだけ利用できるケースへ1本追加。Windows最低版1.0.9164、Firefox最低版142を記載し、最新推奨版とは区別。
  https://support.discord.com/hc/en-us/articles/38025123604631-Minimum-Client-Version-Requirements-for-Voice-Chat
- Googleのpeople-first方針に従い、単なる公式要約に加えて対象外条件、変更前の記録、同条件での比較、次の確認先を記載。実機検証・成功率を装わない。
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## 独自データ

記事STEPの登録IDをAPIで照合し、クライアントから届く任意ラベルは保存せず記事内の正式名を使用。旧method経路はゲームハブ向けに維持し、記事のSTEP集計への流用は拒否する。D1の既存集計・履歴は削除しない。新規migrationなし。

現行STEPに対応する正の整数報告が合計10件以上で、解決回答総数と矛盾しない場合のみランキング・各STEP件数を表示。同票は同率。上位から該当STEPへのリンクを設置。匿名回答は一意の人数ではなく、未解決→解決の両方を含み得ることを明示。端末保存による重複抑制であり、不正投稿の完全防止ではない。個別STEPの試行人数を保存していないため、STEP別成功率は算出しない。

## 継続評価

Search Consoleで対象URLの表示回数・クリック・クエリを更新前後で比較し、既存ページと競合する場合は役割を再調整する。記事量ではなく、有効な解決報告と次の症状への到達を評価する。今回、自動監視・定期記事生成は設定していない。
