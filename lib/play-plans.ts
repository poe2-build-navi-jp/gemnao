import {
  SETTINGS_SNAPSHOTS_KEY,
  parseSettingsSnapshots,
  validSettingsSnapshot,
  copySettingsSnapshot,
  type SettingsSnapshot,
} from './game-settings-snapshots';
export const PLAY_PLANS_KEY = 'gemnao-play-plans-v1';
export const PLAY_PLANS_EVENT = 'gemnao-play-plans';
export type Company = 'unset' | 'solo' | 'friends' | 'either';
export type Prepared = 'unset' | 'yes' | 'no';
export type PlayDraft = {
  progress: string;
  next: string;
  guideUrl: string;
  snapshotId: string;
  minutes: string;
  company: Company;
  prepared: Prepared;
};
export type PlayPlan = Omit<PlayDraft, 'snapshotId'> & {
  gameSlug: string;
  snapshot: SettingsSnapshot | null;
  updatedAt: string;
  revision: number;
};
export const emptyPlayDraft = (): PlayDraft => ({
  progress: '',
  next: '',
  guideUrl: '',
  snapshotId: '',
  minutes: '',
  company: 'unset',
  prepared: 'unset',
});
export class PlayPlanError extends Error {
  constructor(
    readonly code:
      | 'invalid'
      | 'url'
      | 'minutes'
      | 'reference'
      | 'limit'
      | 'conflict'
      | 'missing',
  ) {
    super(code);
  }
}
export function safeGuideUrl(value: string) {
  const text = value.trim();
  if (!text) return '';
  if (
    text.length > 1000 ||
    text.split('').some((c) => c.charCodeAt(0) <= 32 || c.charCodeAt(0) === 127)
  )
    throw new PlayPlanError('url');
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    throw new PlayPlanError('url');
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new PlayPlanError('url');
  return url.href;
}
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length <= max;
export const validMinutes = (v: unknown): v is string =>
  typeof v === 'string' &&
  (v === '' || (/^[1-9]\d{0,3}$/.test(v) && Number(v) <= 1440));
function validPlan(v: unknown): v is PlayPlan {
  if (
    !object(v) ||
    !str(v.gameSlug, 100) ||
    !/^[a-z0-9-]+$/.test(v.gameSlug) ||
    !str(v.progress, 300) ||
    !str(v.next, 300) ||
    !str(v.guideUrl, 1000) ||
    !validMinutes(v.minutes) ||
    typeof v.company !== 'string' ||
    !['unset', 'solo', 'friends', 'either'].includes(v.company) ||
    typeof v.prepared !== 'string' ||
    !['unset', 'yes', 'no'].includes(v.prepared) ||
    !str(v.updatedAt, 40) ||
    !Number.isFinite(Date.parse(v.updatedAt)) ||
    !Number.isSafeInteger(v.revision) ||
    Number(v.revision) < 1 ||
    !(
      v.snapshot === null ||
      (validSettingsSnapshot(v.snapshot) && v.snapshot.gameSlug === v.gameSlug)
    )
  )
    return false;
  try {
    return safeGuideUrl(v.guideUrl) === v.guideUrl;
  } catch {
    return false;
  }
}
function copyPlan(v: PlayPlan): PlayPlan {
  return {
    gameSlug: v.gameSlug,
    progress: v.progress,
    next: v.next,
    guideUrl: v.guideUrl,
    minutes: v.minutes,
    company: v.company,
    prepared: v.prepared,
    updatedAt: v.updatedAt,
    revision: v.revision,
    snapshot: v.snapshot ? copySettingsSnapshot(v.snapshot) : null,
  };
}
export function parsePlayPlans(raw: string | null): PlayPlan[] {
  if (raw === null) return [];
  if (raw.length > 1_000_000) throw new PlayPlanError('invalid');
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new PlayPlanError('invalid');
  }
  if (
    !object(data) ||
    data.version !== 1 ||
    !Array.isArray(data.items) ||
    data.items.length > 100 ||
    !data.items.every(validPlan) ||
    new Set(data.items.map((p) => p.gameSlug)).size !== data.items.length
  )
    throw new PlayPlanError('invalid');
  return data.items.map(copyPlan);
}
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export function savePlayPlan(
  storage: Store,
  gameSlug: string,
  draft: PlayDraft,
  expectedRevision: number,
  now = new Date(),
) {
  const previous = parsePlayPlans(storage.getItem(PLAY_PLANS_KEY));
  const old = previous.find((p) => p.gameSlug === gameSlug);
  if ((old?.revision || 0) !== expectedRevision)
    throw new PlayPlanError('conflict');
  if (!old && previous.length >= 100) throw new PlayPlanError('limit');
  if (!validMinutes(draft.minutes)) throw new PlayPlanError('minutes');
  let snapshot: SettingsSnapshot | null = null;
  if (draft.snapshotId) {
    let choices: SettingsSnapshot[];
    try {
      choices = parseSettingsSnapshots(storage.getItem(SETTINGS_SNAPSHOTS_KEY));
    } catch {
      throw new PlayPlanError('reference');
    }
    snapshot =
      choices.find(
        (s) => s.gameSlug === gameSlug && s.id === draft.snapshotId,
      ) || (old?.snapshot?.id === draft.snapshotId ? old.snapshot : null);
    if (!snapshot) throw new PlayPlanError('reference');
  }
  const item = {
    gameSlug,
    progress: draft.progress,
    next: draft.next,
    guideUrl: safeGuideUrl(draft.guideUrl),
    minutes: draft.minutes,
    company: draft.company,
    prepared: draft.prepared,
    snapshot,
    updatedAt: now.toISOString(),
    revision: (old?.revision || 0) + 1,
  };
  if (!validPlan(item)) throw new PlayPlanError('invalid');
  const saved = copyPlan(item);
  storage.setItem(
    PLAY_PLANS_KEY,
    JSON.stringify({
      version: 1,
      items: [saved, ...previous.filter((p) => p.gameSlug !== gameSlug)],
    }),
  );
  return saved;
}
export function chooseToday(
  savedSlugs: string[],
  plans: PlayPlan[],
  minutes: string,
  company: 'solo' | 'friends',
) {
  if (!validMinutes(minutes) || minutes === '')
    throw new PlayPlanError('minutes');
  const ids = [...new Set(savedSlugs)];
  let unconfigured = 0;
  const matches = ids.flatMap((slug) => {
    const plan = plans.find((p) => p.gameSlug === slug);
    if (
      !plan ||
      plan.minutes === '' ||
      plan.company === 'unset' ||
      plan.prepared === 'unset'
    ) {
      unconfigured++;
      return [];
    }
    return Number(plan.minutes) <= Number(minutes) &&
      plan.prepared === 'yes' &&
      (plan.company === company || plan.company === 'either')
      ? [plan]
      : [];
  });
  return { matches: matches.slice(0, 3), total: matches.length, unconfigured };
}
export const TODAY_CHOICES_KEY = 'gemnao-today-choices-v1';
export type TodayChoice = { minutes: string; company: 'solo' | 'friends' };
export function parseTodayChoices(raw: string | null): TodayChoice[] {
  if (raw === null) return [];
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    throw new PlayPlanError('invalid');
  }
  if (
    !object(v) ||
    v.version !== 1 ||
    !validMinutes(v.minutes) ||
    !v.minutes ||
    !['solo', 'friends'].includes(String(v.company))
  )
    throw new PlayPlanError('invalid');
  return [{ minutes: v.minutes, company: v.company as 'solo' | 'friends' }];
}
export function saveTodayChoice(storage: Store, value: TodayChoice) {
  if (!validMinutes(value.minutes) || !value.minutes)
    throw new PlayPlanError('minutes');
  parseTodayChoices(storage.getItem(TODAY_CHOICES_KEY));
  const raw = JSON.stringify({ version: 1, ...value });
  parseTodayChoices(raw);
  storage.setItem(TODAY_CHOICES_KEY, raw);
}
