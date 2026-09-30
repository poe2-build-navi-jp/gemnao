/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import type { BotRecommendation } from '@/lib/discord-recommended-bots';

export function DiscordBotComparison({ bots }: { bots: BotRecommendation[] }) {
  return (
    <section className="diagnosis-table" id="bot-comparison">
      <h2>DiscordおすすめBot比較表｜ゲームサーバーの用途で選ぶ</h2>
      <p>
        全機能を一度に入れず、今困っている用途の行から選んでください。導入ボタンは公式サイトへ移動します。自動で追加・課金されるボタンではありません。
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Bot・用途</th>
            <th scope="col">費用・制限の見方</th>
            <th scope="col">導入と設定</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <tr key={bot.id}>
              <td data-label="Bot・用途">
                <strong>{bot.name}</strong>
                <br />
                {bot.purpose}
              </td>
              <td data-label="費用・制限">{bot.cost}</td>
              <td data-label="導入と設定">
                <a href={`#bot-${bot.id}`}>{bot.name}の設定手順へ →</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <a href="#cause-2">先に共通の入れ方・権限を確認する →</a>
      </p>
    </section>
  );
}

export function DiscordBotRecommendations({
  bots,
}: {
  bots: BotRecommendation[];
}) {
  return (
    <section className="bot-recommendations" id="bot-setup">
      <h2>用途別の導入・初期設定｜一般メンバーで動作確認する</h2>
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
            <strong>向いているサーバー：</strong>
            {bot.fit}
          </p>
          <p>
            <strong>追加を急がなくてよい場合：</strong>
            {bot.skip}
          </p>
          <nav
            className="bot-official-links"
            aria-label={`${bot.name}の公式導入と設定`}
          >
            <a href={bot.entry.url} target="_blank" rel="noreferrer">
              {bot.entry.label} ↗
            </a>
            <a href={bot.dashboard} target="_blank" rel="noreferrer">
              {bot.name}のDashboard ↗
            </a>
            <a href={bot.manual} target="_blank" rel="noreferrer">
              公式の設定ガイド ↗
            </a>
          </nav>
          <h4>最初の設定手順</h4>
          <ol>
            {bot.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="procedure-note">{bot.example}</p>
          <dl className="bot-result-list">
            <dt>導入成功の目安</dt>
            <dd>{bot.success}</dd>
            <dt>動かない時</dt>
            <dd>{bot.failure}</dd>
            <dt>テスト後・元に戻す方法</dt>
            <dd>{bot.undo}</dd>
          </dl>
          <a href="#bot-comparison">比較表へ戻る ↑</a>
        </section>
      ))}
    </section>
  );
}
