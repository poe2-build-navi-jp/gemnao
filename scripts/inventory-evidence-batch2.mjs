import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const result = await build({
  stdin: {
    contents: `import {gameArticles} from './lib/game-articles';import {commonGuides} from './lib/common-guides';import {discordArticles} from './lib/discord-articles';import {pcArticles} from './lib/pc-articles';import {followupEvidenceReviews} from './lib/article-evidence-followup';import {localizedEvidenceReviews} from './lib/article-evidence-localized';export {gameArticles,commonGuides,discordArticles,pcArticles,followupEvidenceReviews,localizedEvidenceReviews};`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const d = await import(
  'data:text/javascript;base64,' +
    Buffer.from(result.outputFiles[0].text).toString('base64')
);
const prior = JSON.parse(
  readFileSync('docs/search-evidence-2026-10-25/structure-review.json'),
);
const inventory = JSON.parse(
  readFileSync('docs/search-evidence-2026-10-25/article-inventory.json'),
).articles;
const articles = new Map();
for (const [family, items] of [
  ['games', d.gameArticles],
  ['guide', d.commonGuides],
  ['discord', d.discordArticles],
  ['pc', d.pcArticles],
])
  for (const a of items)
    articles.set(
      `/${family}/${family === 'games' ? a.gameSlug + '/' : ''}${a.slug}`,
      a,
    );
const partialNotes = {
  '/games/ace-combat-8/error-st-3100001':
    '時計変更の個別報告と公式の許容時差非公開を分離。成功報告の条件と現行版の公式案内を再照合する。',
  '/guide/pc-game-freezes':
    'メモリ数値は仮例。停止・応答なし・OS全体停止ごとの実測記録の有無と対象Windows版を整理する。',
  '/guide/pc-game-crash':
    'SampleGameログは架空。既存Wilds本人報告を一般のクラッシュ復旧実績から分離し、日時の表記も照合する。',
  '/guide/gpu-driver-update':
    '比較表は記入用。GPU各社の更新・復元手順とドライバー版、編集部の実測有無を別欄にする。',
  '/guide/steam-disk-write-error':
    '空き容量の数値は仮例。必要容量の実測と誤読させず、保存先・書込権限の公式案内を再照合する。',
  '/discord/error-1002':
    'エラー・声・雑音の比較は記入例。コードの公式定義とKrisp切替の期待結果を分け、クライアント版を整理する。',
  '/discord/error-1003':
    '出力切替は未実測の比較例。音声出力の案内が対応するOS／クライアントとコードの出典を照合する。',
  '/discord/overlay-not-showing':
    'DM／通知／通話の表示例は実測でない。旧新オーバーレイと対象ゲームの対応を公式説明から区別する。',
  '/discord/bluetooth-audio-problem':
    '現状の未実測説明は製品紹介に限定。通話時の音質低下の本文にOS／接続プロファイル別の根拠を対応付ける。',
  '/discord/game-not-detected':
    'カード表示の比較は仮例。ゲーム検出とプロフィール公開を分離し、画面・版の公式説明を照合する。',
  '/discord/user-volume-low':
    '80→40は推奨値でない比較例。個別音量・ゲーム音量・入力ゲインを分け、実測と対象端末を整理する。',
  '/discord/voice-client-outdated':
    'アプリ／ブラウザ比較は判断例。警告の公式な対応版・更新条件を確認し、比較を実績として扱わない。',
};
const rows = prior.map((p) => {
  const a = articles.get(p.path),
    i = inventory.find((i) => i.path === p.path),
    review = d.followupEvidenceReviews[p.path];
  const answer = a.conclusion || a.answer || '',
    steps = a.steps || a.causes || [];
  const answerText =
    typeof answer === 'string' ? answer : JSON.stringify(answer);
  const fullText = JSON.stringify(a);
  const scopeMentions = [
    ...new Set(
      fullText.match(
        /Windows\s*(?:10|11)|Steam|Epic Games|PS5|Xbox|Android|iOS|macOS|PC版/g,
      ) || [],
    ),
  ];
  const isFirst = i.scope !== 'not-reviewed-this-change';
  return {
    path: p.path,
    title: i.title,
    family: p.family,
    languages: i.languages,
    priorClassification: p.classification,
    shortAnswer: {
      present: !!answer,
      characters: answerText.length,
      assessment:
        answerText.length > 220
          ? '長文のため短答化の編集候補（正確さ・必要な注意を残す）'
          : '結論欄あり。長さのみで品質を保証しない',
    },
    procedures: {
      steps: steps.length,
      actions: i.actionCount,
      resultFields: steps.filter((s) => s.next || s.check || s.result).length,
      assessment:
        '具体操作の構造あり。結果欄は期待される判断であり実測ではない',
    },
    evidence: {
      sourceCount: i.effectiveSources.length,
      sources: i.effectiveSources,
      existingSummary: p.existingEvidenceSummary,
      candidateQuotes: p.evidenceLanguageCandidates,
      disclosure: review
        ? '個別の結果・限界・比較を追加'
        : isFirst
          ? '先行の個別説明を継承'
          : p.classification.includes('partial')
            ? '一部の例・箇所に限定した説明'
            : p.classification.includes('limit-disclosure-present')
              ? '限界説明あり。記事全体の根拠照合は未完'
              : '個別の根拠分離が未認定',
      factReview: review
        ? review.sourceReview
        : 'このバッチで公式本文と全断定を照合していない',
      empiricalStatus: review
        ? '実測結果は未記録／数値例を実測としない'
        : '未監査。既存statusや日付を実機検証済みと解釈しない',
    },
    version: {
      declaredScope: review?.scope || i.declaredScope,
      bodyPlatformMentions: scopeMentions,
      testedBuild: review ? '未記録' : '未監査',
      gap: review
        ? '対象と未記録を明示'
        : i.declaredScope
          ? '対象欄あり。サポート対象と実測版の区別を要確認'
          : scopeMentions.length
            ? '対象欄なし。本文のプラットフォーム記述を個別整理する'
            : '対象欄なし。個別に出典から対象範囲を確認する',
    },
    status: review
      ? 'batch2-individual-disclosure'
      : isFirst
        ? 'inherited-first-wave'
        : 'pending-individual-audit',
    nextAction: review
      ? '既存翻訳への展開と、根拠欄以外の全断定の照合は後続'
      : partialNotes[p.path] ||
        (!isFirst
          ? `${i.title}：${i.declaredScope ? '既存対象欄を実測版と区別' : '本文の対象OS／配信版を出典に対応付ける'}。${p.evidenceLanguageCandidates.length ? '既存の限界説明が及ぶ手順を特定' : '期待結果と記録された結果を分離'}し、${i.effectiveSources[0]?.label || '既存出典'}が裏付ける手順を照合する。`
          : 'PR145の範囲と制限を保持'),
  };
});
const out = 'docs/evidence-batch2-2026-10-25';
mkdirSync(out, { recursive: true });
writeFileSync(
  out + '/coverage.json',
  JSON.stringify(
    {
      base: '7b2cebd1c1690af7ceb93b560ba28a36e9c04850',
      dependency: 'PR145',
      method:
        '全191記事のデータ構造＋先行HTML抽出を再監査。本文の真偽・全公式資料の最新性・実機再現を一括認定しない。共通テンプレートの表示と各記事の内容を区別する。',
      summary: {
        total: rows.length,
        firstWave: rows.filter((r) => r.status === 'inherited-first-wave')
          .length,
        batch2: 5,
        pending: rows.filter((r) => r.status === 'pending-individual-audit')
          .length,
        partialRemaining: 12,
        limitedDisclosureRemaining: 50,
        evidenceSeparationRemaining: 119,
      },
      localizedRoutes: Object.keys(d.localizedEvidenceReviews).map(
        (k) => '/' + k.replace(':', ''),
      ),
      articles: rows,
    },
    null,
    2,
  ) + '\n',
);
writeFileSync(
  out + '/coverage.tsv',
  'path\tanswer_chars\tactions\tsources\tscope\tstatus\n' +
    rows
      .map((r) =>
        [
          r.path,
          r.shortAnswer.characters,
          r.procedures.actions,
          r.evidence.sourceCount,
          r.version.declaredScope ? 'declared' : 'body-review-needed',
          r.status,
        ].join('\t'),
      )
      .join('\n') +
    '\n',
);
console.log(
  `Coverage: ${rows.length} JP articles, 8 existing translated routes; 181 JP individual audits remain.`,
);
