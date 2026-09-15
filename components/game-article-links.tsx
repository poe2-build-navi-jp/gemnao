/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight } from 'lucide-react';
import { articlesForGame, categoryLabels } from '@/lib/game-articles';
import type { GameGuide } from '@/lib/games';

const clusters = [
  { label: '起動・クラッシュ', categories: ['launch'] },
  { label: 'データ・設定', categories: ['save', 'settings'] },
  { label: '専用サーバー', categories: ['server'] },
  { label: '映像・パフォーマンス', categories: ['display', 'specs'] },
  { label: '操作・拡張', categories: ['controller', 'mods'] },
] as const;

export function GameArticleLinks({
  game,
  heading = '症状から解決方法を探す',
}: {
  game: GameGuide;
  heading?: string;
}) {
  const articles = articlesForGame(game.slug);
  if (!articles.length) return null;
  const orderedClusters =
    game.slug === 'palworld'
      ? [clusters[1], clusters[2], clusters[0], clusters[3], clusters[4]]
      : clusters;
  return (
    <section
      className="article-link-section"
      aria-labelledby="article-links-title"
    >
      <div className="article-link-heading">
        <div>
          <p className="evidence-label">TROUBLESHOOTING</p>
          <h2 id="article-links-title">{heading}</h2>
        </div>
        <span>{articles.length}記事</span>
      </div>
      <p className="article-link-intro">
        困っている内容に近い項目を1つ選んでください。各記事は検索意図が重ならないよう、1つの問題と解決手順に絞っています。
      </p>
      <div className="article-clusters">
        {orderedClusters.map((cluster) => {
          const clusterArticles = articles.filter((article) =>
            cluster.categories.some(
              (category) => category === article.category,
            ),
          );
          if (!clusterArticles.length) return null;
          return (
            <section key={cluster.label}>
              <h3>{cluster.label}</h3>
              <div className="article-link-grid">
                {clusterArticles.map((article) => (
                  <a
                    href={`/games/${game.slug}/${article.slug}`}
                    key={article.slug}
                  >
                    <span>{categoryLabels[article.category]}</span>
                    <strong>{article.shortTitle}</strong>
                    <p>{article.symptom}</p>
                    <b>
                      手順を見る <ArrowRight size={15} />
                    </b>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
