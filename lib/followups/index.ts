import { valorantVan9003Guide } from './valorant-van9003';
import { valorantVan9001Guide } from './valorant-van9001';
import { apexLaunchGuide } from './apex-launch';
import { connectionGuide } from './connection';
import { timeSyncGuide } from './time-sync';
import { wildsRecurrenceGuide } from './wilds-recurrence';
import { japaneseFollowup, translatedFollowups } from './types';

export const followupGuides = [
  timeSyncGuide,
  connectionGuide,
  wildsRecurrenceGuide,
  valorantVan9003Guide,
  valorantVan9001Guide,
  apexLaunchGuide,
];
export const followupGameArticles = followupGuides.map(japaneseFollowup);
export const followupLocalizedArticles =
  followupGuides.flatMap(translatedFollowups);
