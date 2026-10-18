import { troubleHubsEn } from './trouble-hubs-en';
import { gearArticlesEn } from './gear-articles-en';
import { weeklyReportsEn } from './weekly-reports-en';
import { releaseRoundupsEn } from './release-roundups-en';
export const remainingPagesEn = [
  {
    path: '/about',
    title: 'About Gemnao: Operator and Editorial Policy',
    items: [
      'Editorial sources',
      'Corrections and updates',
      'Advertising disclosures',
      'Contact the operator',
    ],
  },
  {
    path: '/contact',
    title: 'Contact Gemnao and Report Corrections',
    items: [
      'Article corrections',
      'Rights and privacy',
      'Business inquiries',
      'Optional reply address',
    ],
  },
  {
    path: '/discord-servers',
    title: 'Find Japanese-Speaking Discord Gaming Communities',
    items: [
      'Search and filter',
      'Check community rules',
      'Stay safe',
      'Apply for a listing',
    ],
  },
  {
    path: '/discord-servers/guidelines',
    title: 'Discord Server Directory: Listing Guidelines',
    items: [
      'Eligibility',
      'Information to include',
      'Review process',
      'Safety and removal',
    ],
  },
  {
    path: '/privacy',
    title: 'Gemnao Privacy Policy',
    items: [
      'Information we handle',
      'Browser storage',
      'Analytics choices',
      'Contact and retention',
    ],
  },
  {
    path: '/terms',
    title: 'Gemnao Terms of Use',
    items: [
      'Using the guides',
      'External services',
      'Content and links',
      'Contact',
    ],
  },
  {
    path: '/status',
    title: 'PC Game and Discord Service Status',
    items: [
      'Official announcements',
      'Maintenance schedules',
      'Source freshness',
      'Reader reports',
    ],
  },
  {
    path: '/gear',
    title: 'Gaming Equipment: Checks Before Buying',
    items: [
      'Start with the problem',
      'Check existing equipment',
      'Compare compatibility',
      'Review official specifications',
    ],
  },
  {
    path: '/weekly',
    title: 'PC Gaming Weekly: Official Announcements',
    items: [
      'Patches and fixes',
      'Outages and maintenance',
      'Error notices',
      'Historical weekly editions',
    ],
  },
  {
    path: '/tools/refresh-rate',
    title: 'Browser Refresh Rate Check',
    items: [
      'Run the browser check',
      'Compare the result',
      'Understand measurement limits',
      'Check Windows display settings',
    ],
  },
  {
    path: '/tools/save-locations',
    title: 'PC Game Save Locations and Backup Paths',
    items: [
      'Find the right game folder',
      'Copy a path',
      'Preserve existing saves',
      'Follow the game-specific guide',
    ],
  },
  ...troubleHubsEn.map((h) => ({
    path: `/trouble/${h.slug}`,
    title: h.title,
    items: h.quickChecks,
  })),
  ...gearArticlesEn.map((a) => ({
    path: `/gear/${a.slug}`,
    title: a.title,
    items: a.features.map((f) => f.title),
  })),
  ...weeklyReportsEn.map((r) => ({
    path: `/weekly/${r.slug}`,
    title: r.title,
    items: r.highlights,
  })),
  ...releaseRoundupsEn.map((r) => ({
    path: `/new-releases/${r.slug}`,
    title: r.title,
    items: [
      'Minimum GPU and Windows',
      'Memory and storage',
      'Additional requirements',
      'Your PC: estimated fit',
    ],
  })),
];
