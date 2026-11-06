import { gameArticles } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
import { localizedArticles } from '@/lib/localized/index';
export const steamGuideTargets = [
  { game: 'monster-hunter-wilds', article: 'not-launching' },
  { game: 'palworld', article: 'save-data' },
  { game: 'elden-ring', article: 'save-data' },
];
const plain = (s: string) => s.replaceAll('[', '（').replaceAll(']', '）');
export function steamGuideDraft(game: string, locale: 'ja' | 'en' = 'ja') {
  const target = steamGuideTargets.find((t) => t.game === game);
  const original =
    target &&
    gameArticles.find(
      (a) =>
        a.gameSlug === game &&
        a.slug === target.article &&
        !['draft', 'thin'].includes(a.status || 'verified'),
    );
  if (!original) return null;
  const translated =
    locale === 'en'
      ? localizedArticles.find(
          (a) =>
            a.locale === 'en' &&
            a.gameSlug === game &&
            a.slug === original.slug,
        )
      : undefined;
  if (locale === 'en' && !translated) return null;
  const item = translated || original,
    path = `${locale === 'en' ? '/en' : ''}/games/${game}/${original.slug}`,
    en = locale === 'en';
  const title = item.title;
  const sources = [
    ...(item.sources || []),
    ...(translated ? [] : gameBySlug(game)?.sources || []),
  ].filter((s) => s.url.startsWith('https://'));
  const body = [
    `[h1]${plain(title)}[/h1]`,
    en
      ? 'Independent troubleshooting notes by Gemnao. Not an official developer guide; no universal fix or hardware test result is claimed.'
      : 'ゲムなお編集部による確認ガイドです。開発元の公式ガイドではなく、全環境での解決や実機検証の成功を保証するものではありません。',
    `[h2]${en ? 'Start here' : 'まず確認すること'}[/h2]`,
    plain(translated ? translated.summary : original.conclusion),
    ...item.steps.flatMap((s, i) => [
      `[h2]${i + 1}. ${plain(s.title)}[/h2]`,
      plain(s.summary),
      '[list]',
      ...s.actions.map((a) => `[*]${plain(a)}`),
      '[/list]',
      ...(s.note ? [plain(s.note)] : []),
    ]),
    ...((item.avoid || []).length
      ? [
          `[h2]${en ? 'Avoid' : '避けたい操作'}[/h2]`,
          ...(item.avoid || []).map(plain),
        ]
      : []),
    ...(translated?.cautions || []).map(plain),
    `[h2]${en ? 'Sources and review record' : '出典・確認記録'}[/h2]`,
    `${en ? 'Source review record' : '資料の確認記録'}: ${item.checkedAt}`,
    ...[...new Map(sources.map((s) => [s.url, s])).values()].map(
      (s) => `[url=${s.url}]${plain(s.label)}[/url]`,
    ),
    `[h2]${en ? 'Detailed guide and related symptoms' : '詳しい手順・関連する症状'}[/h2]`,
    `[url=https://gemnao.pages.dev${path}?utm_source=steam&utm_medium=community_guide&utm_campaign=help_guides]${plain(title)} — Gemnao[/url]`,
    en
      ? 'Record your exact error, game version and each result. Keep saves before changing files; compare one change at a time.'
      : 'エラー全文、ゲームの版、各操作の結果を記録してください。ファイル操作前は保存を保全し、変更は一つずつ比較します。',
  ].join('\n\n');
  return { game, title, locale, body, path, checkedAt: item.checkedAt };
}
