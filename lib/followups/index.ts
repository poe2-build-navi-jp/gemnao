import { apexJavelinGuide } from './apex-javelin';
import { valorantRestriction5Guide } from './valorant-restriction5';
import { valorantVan9005Guide } from './valorant-van9005';
import { apexCrashGuide } from './apex-crash';
import { apexNetworkGuide } from './apex-network';
import { fortniteRunningGuide } from './fortnite-running';
import { fortniteDx12Guide } from './fortnite-dx12';
import { battlefieldJavelin94Guide } from './battlefield-javelin94';
import { battlefieldSecureBootGuide } from './battlefield-secure-boot';
import { valorantLaunchGuide } from './valorant-launch';
import { valorantVan9003Guide } from './valorant-van9003';
import { valorantVan9001Guide } from './valorant-van9001';
import { apexLaunchGuide } from './apex-launch';
import { connectionGuide } from './connection';
import { timeSyncGuide } from './time-sync';
import { wildsRecurrenceGuide } from './wilds-recurrence';
import { japaneseFollowup, translatedFollowups } from './types';

export const followupGuides = [
  apexJavelinGuide,
  valorantRestriction5Guide,
  valorantVan9005Guide,
  timeSyncGuide,
  connectionGuide,
  wildsRecurrenceGuide,
  valorantVan9003Guide,
  valorantVan9001Guide,
  apexLaunchGuide,
  apexCrashGuide,
  apexNetworkGuide,
  fortniteRunningGuide,
  fortniteDx12Guide,
  battlefieldJavelin94Guide,
  battlefieldSecureBootGuide,
  valorantLaunchGuide,
];
export const followupGameArticles = followupGuides.map(japaneseFollowup);
export const followupLocalizedArticles =
  followupGuides.flatMap(translatedFollowups);
