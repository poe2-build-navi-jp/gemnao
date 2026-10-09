import type { ArticleStep } from './game-articles';

export type StepEndpoint = {
  symptom: string;
  href?: string;
  label?: string;
};

const launch: StepEndpoint = {
  symptom: '起動しない・落ちる',
  href: '/trouble/not-launching',
  label: '起動しない時の共通対処を確認',
};
const performance: StepEndpoint = {
  symptom: '重い・カクつく',
  href: '/trouble/fps',
  label: 'FPS・カクつきの共通対処を確認',
};
const controller: StepEndpoint = {
  symptom: 'コントローラーが反応しない',
  href: '/trouble/controller',
  label: 'コントローラーの共通対処を確認',
};
const save: StepEndpoint = {
  symptom: 'セーブの引き継ぎ・同期',
  href: '/trouble/save',
  label: 'セーブの症状に合う記事を確認',
};
const content: StepEndpoint = { symptom: '特典・追加コンテンツが出てこない' };
const connection: StepEndpoint = {
  symptom: 'オンラインに接続できない',
  href: '/trouble/server',
  label: '接続の症状に合う記事を確認',
};

// Editorial boundaries in mixed-topic legacy articles. A missing entry retains
// the existing sequence; an endpoint never advances into another symptom.
// Keep original article content, fragment IDs, and anonymous vote keys intact.
export const articleStepEndpoints: Record<
  string,
  Record<string, StepEndpoint>
> = {
  'final-fantasy-resonance/not-launching': {
    'step-2': launch,
    'step-3': save,
    'step-4': save,
    'step-5': content,
    'step-6': content,
  },
  'dragons-dogma-2/performance': { 'step-5': performance, 'step-6': content },
  'castlevania-belmonts-curse/not-launching': {
    'step-2': launch,
    'step-3': controller,
    'step-4': content,
  },
  'tales-of-eternia-remastered/not-launching': {
    'step-3': launch,
    'step-4': controller,
    'step-5': content,
  },
  'silent-hill-townfall/stutter': { 'step-5': performance, 'step-6': content },
  'control-resonant/crash-performance': {
    'step-3': {
      symptom: 'クラッシュ・重い',
      href: '/trouble/crash',
      label: 'クラッシュの共通対処を確認',
    },
    'step-4': { symptom: '音が出ない・音が途切れる' },
    'step-5': controller,
    'step-6': { symptom: 'クエストが進まない' },
  },
  'shin-sangoku-musou-2-remastered/not-launching': {
    'step-5': launch,
    'step-6': controller,
  },
  'ace-combat-8/not-launching': { 'step-6': launch, 'step-7': connection },
  'gears-of-war-e-day/not-launching': {
    'step-5': launch,
    'step-6': connection,
  },
  'minecraft-dungeons-2/multiplayer': {
    'step-5': connection,
    'step-6': content,
  },
  'call-of-duty-modern-warfare-4/tpm-secure-boot': {
    'step-5': launch,
    'step-6': { symptom: 'アカウントの電話番号確認' },
  },
  'dragon-quest-monsters-4/demo-transfer': {
    'step-3': save,
    'step-4': content,
    'step-5': launch,
  },
  'elden-ring/fps': { shader: performance, 'offline-only': performance },
  'palworld/not-launching': {
    'test-new-world': launch,
    'restore-mods': launch,
  },
};

export function stepsWithEndpoints(article: {
  gameSlug: string;
  slug: string;
  steps: ArticleStep[];
}) {
  const endpoints = articleStepEndpoints[`${article.gameSlug}/${article.slug}`];
  return article.steps.map((step) => ({
    ...step,
    endpoint: endpoints?.[step.id],
  }));
}
