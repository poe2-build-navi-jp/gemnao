import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import {
  SITE,
  articleUrl,
  inspectArticle,
  diffSnapshots,
  requireValue,
} from './indexnow-content.mjs';

const [command, ...args] = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i += 2) {
  requireValue(
    /^--(root|commit|out|before|after)$/.test(args[i]) &&
      args[i + 1] &&
      !args[i + 1].startsWith('--') &&
      !options[args[i]],
    'Invalid or repeated option',
  );
  options[args[i]] = args[i + 1];
}
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
let result;
requireValue(options['--out'], '--out is required');
if (command === 'snapshot') {
  requireValue(
    options['--root'] && /^[a-f0-9]{40}$/.test(options['--commit']),
    'snapshot needs --root and full --commit from the verified checkout',
  );
  const root = resolve(options['--root']);
  const routes = await read(join(root, 'dist/editorial-snapshots.json'));
  const articles = {};
  for (const [path, asset] of Object.entries(routes)) {
    const url = SITE + path;
    try {
      articleUrl(url);
    } catch {
      continue;
    }
    requireValue(
      /^\/_gemnao-snapshots\/[a-zA-Z0-9_-]+\.snapshot$/.test(asset),
      'Invalid snapshot asset',
    );
    articles[url] = inspectArticle(
      await readFile(join(root, 'dist/client', asset.slice(1)), 'utf8'),
      url,
    );
  }
  requireValue(Object.keys(articles).length > 0, 'No article snapshots');
  result = { version: 1, origin: SITE, commit: options['--commit'], articles };
} else {
  requireValue(
    command === 'diff' && options['--before'] && options['--after'],
    'Use snapshot or diff --before FILE --after FILE --out FILE',
  );
  result = diffSnapshots(
    await read(options['--before']),
    await read(options['--after']),
  );
}
await writeFile(options['--out'], JSON.stringify(result, null, 2) + '\n');
console.log(
  JSON.stringify({
    output: options['--out'],
    count: result.urls?.length ?? Object.keys(result.articles).length,
  }),
);
