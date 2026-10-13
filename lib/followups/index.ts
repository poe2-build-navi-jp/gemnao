import { connectionGuide } from './connection';
import { timeSyncGuide } from './time-sync';
import { wildsRecurrenceGuide } from './wilds-recurrence';
import { japaneseFollowup, translatedFollowups } from './types';

export const followupGuides = [
  timeSyncGuide,
  connectionGuide,
  wildsRecurrenceGuide,
];
export const followupGameArticles = followupGuides.map(japaneseFollowup);
export const followupLocalizedArticles =
  followupGuides.flatMap(translatedFollowups);
