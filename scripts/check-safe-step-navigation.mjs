import assert from 'node:assert/strict';
import { build } from 'esbuild';
const built = await build({
  stdin: {
    contents: `export {classicGameArticles} from './lib/classic-game-articles'; export {localizedArticle} from './lib/localized'; export {commonGuides} from './lib/common-guides';`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { classicGameArticles, localizedArticle, commonGuides } = await import(
  `data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`
);
const ja = classicGameArticles.find(
  (a) => a.gameSlug === 'cyberpunk-2077' && a.slug === 'not-launching',
);
const checks = {
  ja: {
    protect: /ウイルス対策・ファイアウォールは有効/,
    one: /1つずつ/,
    caution: /検疫を解除したり、除外設定を追加したりしない/,
    support: /公式窓口.*CD PROJEKT RED/,
  },
  en: {
    protect: /Keep antivirus and firewall protection enabled/,
    one: /one at a time/,
    caution: /Do not restore a quarantined file or add an exclusion/,
    support: /security provider or game support/,
  },
  zh: {
    protect: /保持杀毒软件和防火墙开启/,
    one: /逐一/,
    caution: /不要.*恢复隔离文件或添加排除项/,
    support: /官方支持.*CD PROJEKT RED/,
  },
  es: {
    protect: /Mantén activos el antivirus y el cortafuegos/,
    one: /una por una/,
    caution: /No restaures archivos en cuarentena ni añadas exclusiones/,
    support: /soporte oficial.*CD PROJEKT RED/,
  },
};
for (const locale of ['ja', 'en', 'zh', 'es']) {
  const article =
    locale === 'ja'
      ? ja
      : localizedArticle(locale, 'cyberpunk-2077', 'not-launching');
  assert.ok(article, locale);
  const step = article.steps.find((s) => s.id === 'verify-files');
  const text = [...step.actions, step.note].join('\n');
  for (const pattern of Object.values(checks[locale]))
    assert.match(text, pattern, locale);
  assert.doesNotMatch(
    text,
    /セキュリティソフトなど不要なアプリ|除外設定を追加したら|退出硬件监控、杀毒软件|添加例外后|cierra monitores de hardware, antivirus|Si añades una excepción/,
  );
  assert.deepEqual(
    article.steps.map((s) => s.id),
    ja.steps.map((s) => s.id),
    'stable feedback/fragment IDs',
  );
}
const gated = commonGuides.flatMap((g) =>
  g.steps.flatMap((s, i) => (s.advanceCheck ? [`${g.slug}:${i}`] : [])),
);
assert.deepEqual(
  gated,
  ['steam-input-controller:0'],
  'other articles have no gate',
);
const check = commonGuides.find((g) => g.slug === 'steam-input-controller')
  .steps[0].advanceCheck;
assert.equal(check.unresolvedHref, '#input-device');
assert.match(check.confirmedLabel, /機器名とボタン反応/);
assert.match(check.resolvedLabel, /ゲーム内/);
console.log(
  'PASS: four-language Cyberpunk protection/one-at-a-time/support guidance, unchanged STEP IDs; prerequisite only on Steam Input STEP 1',
);
