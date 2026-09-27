import { steamCloudGuide } from './steam-cloud-guide';
import { powerShutdownGuide } from './power-shutdown-guide';
import { bsodGuide } from './bsod-guide';
import { audioGuide } from './audio-guide';
import { steamDiskWriteGuide } from './steam-disk-write-guide';
import type { CommonGuide } from '@/lib/common-guides';

export const commonGrowthGuides: CommonGuide[] = [
  steamCloudGuide,
  steamDiskWriteGuide,
  powerShutdownGuide,
  bsodGuide,
  audioGuide,
];
