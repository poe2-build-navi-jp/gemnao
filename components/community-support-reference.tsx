/* oxlint-disable next/no-html-link-for-pages -- Public reference links use document navigation. */
import { CopyShareLink } from './copy-share-link';

export function CommunitySupportReference({
  locale = 'ja',
}: {
  locale?: 'ja' | 'en';
}) {
  const en = locale === 'en';
  const path = `${en ? '/en' : ''}/tools/windows-diagnosis#community-reference`;
  const guide = `${en ? '/en' : ''}/guide/pc-game-crash`;
  const reply = en
    ? `Please describe the game/version, when the symptom occurs, steps already tried and their results, and checks still pending. Start with the game's official notices and requirements; change one thing at a time and stop if it improves. Do not post raw logs, account details, local paths or device identifiers. This guide helps organize checks; it does not confirm a cause or an official fix. https://gemnao.pages.dev${path}`
    : `ゲーム名・バージョン、症状が出るタイミング、試した対処と結果、未確認の項目を教えてください。まずゲーム公式のお知らせと動作環境を確認し、変更は1つずつ。改善したら追加変更を止めてください。ログ全文・アカウント情報・PC内のパス・端末識別情報は投稿しないでください。原因や公式修正を確定する案内ではありません。参考：https://gemnao.pages.dev${path}`;
  return (
    <section id="community-reference" className="community-reference">
      <h2>
        {en
          ? 'For community FAQs and support replies'
          : 'コミュニティのFAQ・サポート返信に使うには'}
      </h2>
      <p>
        {en
          ? 'A public reference for moderators, game developers and friends helping with Windows PC game launch or stability issues. Gemnao is an independent guide, not an official support desk. A matching symptom is not proof of a known game bug. No download is required to use this checklist.'
          : 'Windows PCゲームの起動・安定性の問題を案内する、管理者・ゲーム開発者・友達向けの公開参考資料です。ゲムなおは独立したガイドで、公式サポート窓口ではありません。同じ症状でも既知のゲーム不具合とは限りません。このチェックリストにダウンロードは不要です。'}
      </p>
      <ol>
        <li>
          {en
            ? 'Check the game’s official notices, version and system requirements. Describe the timing and whether only this game is affected; do not reproduce a dangerous failure just to collect evidence.'
            : 'ゲーム公式のお知らせ・バージョン・動作環境を確認。発生するタイミングと、そのゲームだけかを整理します。記録のために危険な状態を再現しないでください。'}
        </li>
        <li>
          {en
            ? 'If there is smoke, unusual smell, swelling, dangerous heat or liquid ingress, stop use and seek manufacturer support. For drive failure warnings, power loss or whole-PC failures, prioritize specialist advice over game tweaks.'
            : '煙・異臭・膨らみ・危険な熱・液体侵入があれば使用を中止してメーカーへ相談。ドライブの重大な警告・電源断・PC全体の停止ではゲーム設定の変更より専門窓口への相談を優先します。'}
        </li>
        <li>
          {en
            ? 'For an ordinary game-only issue, choose one relevant check. Steam file verification may help with installed files; review mod and save backup instructions first. Record the result and any setting to restore. Avoid deleting saves, downloading individual DLLs or disabling security protections.'
            : 'ゲームだけの通常の問題なら、関連する確認を1つ選びます。Steamの整合性確認はインストール済みファイルの確認に使えます。先にMOD・セーブのバックアップ案内を確認し、結果と戻す設定を記録します。セーブ削除・個別DLLの取得・セキュリティ機能の無効化は避けてください。'}
        </li>
      </ol>
      <p>
        <a href={guide}>
          {en
            ? 'Crash timing and safe initial checks'
            : '落ちるタイミングと安全な初期確認'}
        </a>{' '}
        ·{' '}
        <a href="/diagnose">
          {en
            ? 'Browser diagnosis and previewable consultation summary (Japanese)'
            : 'ブラウザ診断で相談用まとめを確認・コピー'}
        </a>
      </p>
      <p>
        {en
          ? 'The browser diagnosis summarizes selected symptoms, recorded attempts and pending checks locally. Review the short summary before copying; add only the game and version information needed by your helper. Follow each community’s rules and use the publisher’s official channel for account or purchase issues.'
          : 'ブラウザ診断では選択した症状・記録済みの対処・残る確認を端末内で整理します。短いまとめを確認してコピーし、相談相手に必要なゲーム名やバージョンだけを補足してください。各コミュニティの規則に従い、アカウント・購入の問題は発売元の公式窓口へ相談してください。'}
      </p>
      <h3>{en ? 'Official references' : '公式の参考資料'}</h3>
      <ul>
        <li>
          <a
            href={`https://help.steampowered.com/${en ? 'en' : 'ja'}/faqs/view/0C48-FCBD-DA71-93EB`}
            rel="noreferrer"
          >
            {en
              ? 'Steam Support: Verify integrity of game files'
              : 'Steamサポート：ゲームファイルの整合性確認'}
          </a>
        </li>
        <li>
          <a
            href="https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior"
            rel="noreferrer"
          >
            {en
              ? 'Microsoft: Troubleshoot application crashes (technical reference)'
              : 'Microsoft：アプリのクラッシュ調査（技術資料・英語）'}
          </a>
        </li>
      </ul>
      <p>
        {en
          ? 'These sources explain investigation methods, not a fix confirmed for your game. Review the visible template below and copy it only if it fits the question. Nothing is posted automatically.'
          : '出典は調査方法の説明で、対象ゲームの修正を保証するものではありません。下のテンプレートを確認し、質問に合う場合だけコピーしてください。自動投稿は行いません。'}
      </p>
      <CopyShareLink path={path} locale={locale} text={reply} />
    </section>
  );
}
