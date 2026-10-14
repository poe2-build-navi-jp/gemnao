// Link destinations read on 2026-10-14. This is NOT a live status feed.
// Riot's destination requires JavaScript; availability was not inferred from its shell.
export const playStatusLinks: Record<
  string,
  { provider: string; url: string; checkedAt: string }[]
> = {
  'apex-legends': [
    {
      provider: 'EA',
      url: 'https://help.ea.com/en/server-status/',
      checkedAt: '2026-10-14',
    },
  ],
  'battlefield-6': [
    {
      provider: 'EA',
      url: 'https://help.ea.com/en/server-status/',
      checkedAt: '2026-10-14',
    },
  ],
  valorant: [
    {
      provider: 'Riot Games',
      url: 'https://status.riotgames.com/',
      checkedAt: '2026-10-14',
    },
  ],
};
