import type { AdvanceCheck } from './step-navigation';
import { blackScreenGuide } from './black-screen-guide';
import { crashGuide } from './crash-guide';
import { directxGuide } from './directx-guide';
import { steamLaunchGuide } from './steam-launch-guide';
import { gpuDriverGuide } from './gpu-driver-guide';
import { freezeGuide } from './freeze-guide';
import { stutterGuide } from './stutter-guide';
import { vramGuide } from './vram-guide';
import { lowFpsGuide } from './low-fps-guide';
import { lowGpuUsageGuide } from './low-gpu-usage-guide';
import { steamInputGuide } from './steam-input-guide';
import { controllerDoubleInputGuide } from './controller-double-input-guide';
import { uninstallSaveGuide } from './uninstall-save-guide';
import { saveBackupGuide } from './save-backup-guide';
import { shaderCacheGuide } from './shader-cache-guide';
import { reshadeGuide } from './reshade-guide';
import { resetConfigGuide } from './reset-config-guide';
import { removeModsGuide } from './remove-mods-guide';
import { visualCGuide } from './visual-c-guide';
import { verifySteamGuide } from './verify-steam-guide';
import type { ContentStatus } from '@/lib/game-articles';
import { commonGrowthGuides } from '@/lib/common-growth-guides';

export type CommonGuide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  conclusion: string;
  checkedAt: string;
  steps: { title: string; actions: string[]; advanceCheck?: AdvanceCheck }[];
  sources: { label: string; url: string }[];
  related: string[];
  status: ContentStatus;
  causes: string[];
  faqs?: { question: string; answer: string }[];
};
export const commonGuides: CommonGuide[] = [
  lowGpuUsageGuide,
  freezeGuide,
  steamLaunchGuide,
  verifySteamGuide,
  crashGuide,
  blackScreenGuide,
  gpuDriverGuide,
  stutterGuide,
  lowFpsGuide,
  vramGuide,
  saveBackupGuide,
  steamInputGuide,
  controllerDoubleInputGuide,
  directxGuide,
  visualCGuide,
  removeModsGuide,
  reshadeGuide,
  resetConfigGuide,
  shaderCacheGuide,
  uninstallSaveGuide,
  ...commonGrowthGuides,
];
export const commonGuideBySlug = (slug: string) =>
  commonGuides.find((g) => g.slug === slug);
