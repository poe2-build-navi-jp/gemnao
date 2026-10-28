/* oxlint-disable next/no-html-link-for-pages -- Native article navigation. */
// Deliberate pilot: four existing articles, based on their recorded evidence.
const contexts: Record<string, { ja: string[]; en: string[] }> = {
  '/games/ace-combat-8/error-st-3100001': {
    ja: [
      'Steam版・ACE COMBAT ONLINE（版番号は未確認）',
      'Windows（実機の版は未確認）',
      'オンライン中の ST-3100001',
      '公式案内に基づく手順。編集部の実機再現は未確認。',
    ],
    en: [
      'Steam / ACE COMBAT ONLINE (build unverified)',
      'Windows (tested OS version unverified)',
      'ST-3100001 during online play',
      'Based on official guidance; independent hands-on reproduction unverified.',
    ],
  },
  '/games/call-of-duty-modern-warfare-4/tpm-secure-boot': {
    ja: [
      'PC製品版・Steam／Battle.net／Xbox on PC（版番号は未確認）',
      '公式要件：Windows 10 22H2以降／推奨Windows 11。実機の版は未確認。',
      'TPM・セキュアブートの要件通知、オンラインに入れない',
      '公式要件の確認手順。編集部の実機再現は未確認。',
    ],
    en: [
      'PC retail / Steam, Battle.net, Xbox on PC (build unverified)',
      'Documented requirements: Windows 10 22H2 or later; Windows 11 recommended. Tested OS version unverified.',
      'TPM / Secure Boot requirement notice or blocked online access',
      'Official requirement checks; independent hands-on reproduction unverified.',
    ],
  },
  '/games/aniimo/not-launching': {
    ja: [
      'PC版・公式ランチャー／Steam（対象の版番号は未確認）',
      'Windows（実機の版は未確認）',
      '開始しても無反応、すぐ閉じる、プレイ中に落ちる',
      '公式FAQ・既存の告知記録に基づく手順。編集部の実機再現は未確認。',
    ],
    en: [
      'PC / official launcher or Steam (affected build unverified)',
      'Windows (tested OS version unverified)',
      'No response on launch, immediate exit, or a crash during play',
      'Based on official FAQs and recorded announcements; independent hands-on reproduction unverified.',
    ],
  },
  '/games/monster-hunter-wilds/not-launching': {
    ja: [
      'PC・Steam製品版（本人の版番号は未確認）',
      '本人のWindows版は未確認',
      '実例は製品版の起動直後クラッシュ。体験版は動作。',
      '本人PC：i5-14400F／RTX 4060 Ti。診断0.1.0で例外C0000005、OpenSteamTool.dll関連の追加DLLを切り離した後に起動できたとの報告。独立した実機再現なし。原因DLLの特定や全環境での解決を示すものではありません。',
    ],
    en: [
      'PC / Steam retail (player’s build unverified)',
      'Player’s Windows version unverified',
      'Reported case: retail game crashed immediately after launch; the demo ran.',
      'Player’s PC: i5-14400F / RTX 4060 Ti. Diagnosis 0.1.0 showed exception C0000005; the player reported launching after isolating added DLLs associated with OpenSteamTool.dll. No independent reproduction. This neither identifies a single causal DLL nor guarantees a fix on other systems.',
    ],
  },
};
export function ArticleContext({
  path,
  locale = 'ja',
}: {
  path: string;
  locale?: string;
}) {
  if (locale !== 'ja' && locale !== 'en') return null;
  const entry = contexts[path]?.[locale];
  if (!entry) return null;
  const en = locale === 'en';
  const labels = en
    ? ['Game version', 'Windows', 'Symptom', 'Hands-on evidence']
    : ['対象ゲーム版', 'Windows', '症状', '実機確認'];
  return (
    <aside
      className="article-context"
      aria-label={
        en ? 'Does this guide match your setup?' : '自分の環境に合うか確認'
      }
    >
      <dl>
        {entry.map((value, i) => (
          <div key={labels[i]}>
            <dt>{labels[i]}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {path.includes('monster-hunter-wilds') && (
        <a href={`${en ? '/en' : ''}/examples/wilds-steam-added-dll`}>
          {en
            ? 'Read the reported conditions and limits →'
            : '本人報告の条件・限界を読む →'}
        </a>
      )}
    </aside>
  );
}
