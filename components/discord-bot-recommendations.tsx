/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import type { BotRecommendation } from '@/lib/discord-recommended-bots';

export function DiscordBotComparison({ bots, locale = 'ja' }: { bots: BotRecommendation[]; locale?: 'ja' | 'en' }) {
  const en = locale === 'en';
  return (
    <section className="diagnosis-table" id="bot-comparison">
      <h2>{en ? 'Compare four bots by your server’s needs' : 'DiscordおすすめBot比較表｜ゲームサーバーの用途で選ぶ'}</h2>
      <p>
        {en ? 'Choose one missing function first. Official links open provider websites; following a link does not itself add a bot or purchase a plan.' : '全機能を一度に入れず、今困っている用途の行から選んでください。導入ボタンは公式サイトへ移動します。自動で追加・課金されるボタンではありません。'}
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">{en ? 'Bot and purpose' : 'Bot・用途'}</th>
            <th scope="col">{en ? 'When to choose it' : 'こんな時に選ぶ'}</th>
            <th scope="col">{en ? 'Costs and limits' : '費用・制限の見方'}</th>
            <th scope="col">{en ? 'Setup' : '導入と設定'}</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <tr key={bot.id}>
              <td data-label={en ? 'Bot and purpose' : 'Bot・用途'}>
                <strong>{bot.name}</strong>
                <br />
                {bot.purpose}
              </td>
              <td data-label={en ? 'Reason to choose' : '選ぶ理由'}>{bot.useCase}</td>
              <td data-label={en ? 'Costs and limits' : '費用・制限'}>{bot.cost}</td>
              <td data-label={en ? 'Setup' : '導入と設定'}>
                <a href={`#bot-${bot.id}`}>{en ? `${bot.name} setup →` : `${bot.name}の設定手順へ →`}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <a href="#cause-2">{en ? 'Check installation and permissions first →' : '先に共通の入れ方・権限を確認する →'}</a>
      </p>
    </section>
  );
}

export function DiscordBotRecommendations({
  bots, locale = 'ja',
}: {
  bots: BotRecommendation[];
  locale?: 'ja' | 'en';
}) {
  const en = locale === 'en';
  return (
    <section className="bot-recommendations" id="bot-setup">
      <h2>{en ? 'Set up one function and verify it with ordinary members' : '用途別の導入・初期設定｜一般メンバーで動作確認する'}</h2>
      {bots.map((bot) => (
        <section
          className="guide-section bot-recommendation"
          id={`bot-${bot.id}`}
          key={bot.id}
        >
          <h3>
            {bot.name}｜{bot.purpose}
          </h3>
          <p>
            <strong>{en ? 'Good fit: ' : '向いているサーバー：'}</strong>
            {bot.fit}
          </p>
          <p>
            <strong>{en ? 'You may not need it yet: ' : '追加を急がなくてよい場合：'}</strong>
            {bot.skip}
          </p>
          <nav
            className="bot-official-links"
            aria-label={en ? `${bot.name} official installation and setup` : `${bot.name}の公式導入と設定`}
          >
            <a href={bot.entry.url} target="_blank" rel="noreferrer">
              {bot.entry.label} ↗
            </a>
            <a href={bot.dashboard} target="_blank" rel="noreferrer">
              {en ? `${bot.name} dashboard ↗` : `${bot.name}のDashboard ↗`}
            </a>
            <a href={bot.manual} target="_blank" rel="noreferrer">
              {en ? 'Official setup guide ↗' : '公式の設定ガイド ↗'}
            </a>
          </nav>
          <h4>{en ? 'Initial setup' : '最初の設定手順'}</h4>
          <ol>
            {bot.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="procedure-note">{bot.example}</p>
          <dl className="bot-result-list">
            <dt>{en ? 'Expected result' : '導入成功の目安'}</dt>
            <dd>{bot.success}</dd>
            <dt>{en ? 'If it does not work' : '動かない時'}</dt>
            <dd>{bot.failure}</dd>
            <dt>{en ? 'After testing and undoing changes' : 'テスト後・元に戻す方法'}</dt>
            <dd>{bot.undo}</dd>
          </dl>
          <a href="#bot-comparison">{en ? 'Back to comparison ↑' : '比較表へ戻る ↑'}</a>
        </section>
      ))}
    </section>
  );
}
