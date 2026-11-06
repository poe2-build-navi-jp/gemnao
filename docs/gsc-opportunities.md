# Search Consoleから改善対象を選ぶ

Search Consoleの検索パフォーマンスで期間を揃え、「ページ」を選択してCSVをエクスポートします。クエリ別CSVは対象外です。元データと結果には非公開の実績が含まれるため、Gitへ追加しません。

```bash
python3 scripts/gsc-opportunities.py Pages.csv --output priorities.csv
# 少数表示も調べたい場合（判断材料が少ない点に注意）
python3 scripts/gsc-opportunities.py Pages.csv --output exploratory.csv --min-impressions 10
```

標準は表示30回以上。平均1〜10位でCTRが3%未満のページを `low_ctr`、平均11〜30位を `content_11_30` として抽出します。CTRはクリック数÷表示回数から再計算します。3%は編集上の仮の選定基準で、順位ごとの標準値でも増加予測でもありません。`click_gap_at_target`も、設定したCTRに届いた場合の差を示すシナリオに過ぎません。

選定後は、そのページにフィルターをかけて検索語を確認します。広告・AI概要・端末・検索意図でもCTRは変わります。タイトルだけで改善を断定せず、本文との一致、冒頭の答え、次に読む記事、公式情報の鮮度も確認します。重複URL・不正な数値・ページ列のないCSVは停止します。

検証: `python3 -m unittest discover -s tests/seo -p 'test_*.py'`。
