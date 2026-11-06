import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('.wrangler/steam-export', { recursive: true });
await build({
  stdin: {
    contents: "export * from './lib/steam-guide-export';",
    resolveDir: process.cwd(),
  },
  outfile: '.wrangler/steam-export/code.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
});
const { steamGuideDraft, steamGuideTargets } =
  await import('../.wrangler/steam-export/code.mjs');
await mkdir('docs/marketing/steam', { recursive: true });
for (const t of steamGuideTargets)
  for (const locale of ['ja', 'en']) {
    const draft = steamGuideDraft(t.game, locale);
    if (!draft) throw Error('Missing verified draft: ' + t.game + '/' + locale);
    await writeFile(
      `docs/marketing/steam/${t.game}-${locale}.txt`,
      draft.body + '\n',
    );
  }
console.log(
  'Generated six Steam guide drafts. No Steam publication performed.',
);
