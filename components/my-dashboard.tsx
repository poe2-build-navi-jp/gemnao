'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, Cpu, ExternalLink, Gamepad2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MyPcFit } from '@/components/my-pc-fit';
import { ReadingList } from '@/components/reading-list';
import { RecentTroubles } from '@/components/recent-troubles';
import { SolutionNotebook } from '@/components/solution-notebook';
import { useMyGames, useMyPc } from '@/components/use-my-pc';
import { jstDate, usePreviousVisit } from '@/components/use-last-visit';
import { gpus, MY_GAMES_KEY, type MinSpec, type MyPc } from '@/lib/my-pc';
import { trackMyGameAdded } from '@/lib/analytics';

export type DashboardGame = {
  slug: string;
  name: string;
  articles: { href: string; label: string }[];
  maintenance: { title: string; start: string; end: string; url: string }[];
  spec?: MinSpec;
  hasNews: boolean;
  /** 記事の確認・週刊まとめ（30日以内、新しい順。dateはYYYY-MM-DD）。 */
  updates: { date: string; label: string; href: string }[];
};

function shortDate(value: string) {
  const [, month, date] = value.split('-').map(Number);
  return `${month}/${date}`;
}

const time = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
const day = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'numeric',
  day: 'numeric',
});

const vendors = [
  { label: 'NVIDIA GeForce', test: (id: string) => /^(gtx|rtx)/.test(id) },
  { label: 'AMD Radeon', test: (id: string) => id.startsWith('rx-') },
  { label: 'Intel Arc', test: (id: string) => id.startsWith('arc-') },
  { label: '内蔵GPU', test: (id: string) => id === 'igpu' },
];

function PcForm({
  pc,
  onSave,
  onClear,
}: {
  pc: MyPc | null;
  onSave: (pc: MyPc) => boolean;
  onClear: () => boolean;
}) {
  const [gpu, setGpu] = useState(pc?.gpu ?? '');
  const [ramGb, setRam] = useState(pc?.ramGb ?? 16);
  const [windows, setWindows] = useState<10 | 11>(pc?.windows ?? 11);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  return (
    <form
      className="my-pc-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!gpu) return;
        const success = onSave({ gpu, ramGb, windows });
        setSaved(success);
        setError(
          success
            ? ''
            : '保存できませんでした。ブラウザの保存設定を確認してください。',
        );
      }}
    >
      <label>
        GPU（グラフィックボード）
        <select
          value={gpu}
          onChange={(event) => {
            setGpu(event.target.value);
            setSaved(false);
          }}
          required
        >
          <option value="">選択してください</option>
          {vendors.map((vendor) => (
            <optgroup label={vendor.label} key={vendor.label}>
              {gpus
                .filter((item) => vendor.test(item.id))
                .map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label>
        メモリ
        <select
          value={ramGb}
          onChange={(event) => {
            setRam(Number(event.target.value));
            setSaved(false);
          }}
        >
          {[4, 8, 12, 16, 24, 32, 48, 64].map((value) => (
            <option value={value} key={value}>
              {value}GB
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>Windows</legend>
        {([11, 10] as const).map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="windows"
              checked={windows === value}
              onChange={() => {
                setWindows(value);
                setSaved(false);
              }}
            />{' '}
            Windows {value}
          </label>
        ))}
      </fieldset>
      <div className="my-pc-actions">
        <button type="submit">{pc ? '更新する' : '登録する'}</button>
        {pc ? (
          <button
            type="button"
            className="secondary"
            onClick={() => {
              if (!onClear())
                setError(
                  '削除できませんでした。ブラウザの保存設定を確認してください。',
                );
            }}
          >
            <Trash2 size={15} /> 削除
          </button>
        ) : null}
        {saved ? <output>このブラウザに保存しました</output> : null}
      </div>
      {error ? <p role="alert">{error}</p> : null}
      <details>
        <summary>自分のPCの調べ方</summary>
        <ul>
          <li>
            GPU：Ctrl＋Shift＋Escでタスクマネージャーを開き、「パフォーマンス」→「GPU」の右上に表示される名前
          </li>
          <li>メモリ：同じ画面の「メモリ」の右上に表示される容量</li>
          <li>Windows：Windows＋Rを押して「winver」と入力し、Enter</li>
          <li>
            一覧にないGPUは、名前の数字が近いもの（同じシリーズ）を選んでください。判定は目安になります。
          </li>
        </ul>
      </details>
    </form>
  );
}

type News = Record<string, { title: string; date: string; url: string }[]>;

export function MyDashboard({ games }: { games: DashboardGame[] }) {
  const [pc, savePc, pcReady] = useMyPc();
  const [myGames, saveGames, gamesReady] = useMyGames();
  const [gameMessage, setGameMessage] = useState('');
  const [news, setNews] = useState<News>({});
  const previous = usePreviousVisit();
  const previousDate = previous ? jstDate(previous) : '';
  // Only after a known earlier visit; on the first visit nothing is "new".
  const isNewDate = (date: string) =>
    Boolean(previousDate) && date > previousDate;
  const isNewTime = (iso: string) =>
    Boolean(previous) && Date.parse(iso) > Date.parse(previous as string);
  const mine = useMemo(
    () => games.filter((game) => myGames.includes(game.slug)),
    [games, myGames],
  );
  const newsKey = mine
    .filter((game) => game.hasNews)
    .map((game) => game.slug)
    .join(',');

  useEffect(() => {
    if (!newsKey) return;
    const controller = new AbortController();
    fetch(`/api/game-news?games=${newsKey}`, { signal: controller.signal })
      .then((response) =>
        response.ok ? (response.json() as Promise<News>) : {},
      )
      .then((value) => setNews(value))
      .catch(() => undefined);
    return () => controller.abort();
  }, [newsKey]);

  function toggle(slug: string) {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem(MY_GAMES_KEY) || '[]',
      );
      if (
        !Array.isArray(value) ||
        !value.every((item) => typeof item === 'string')
      )
        throw new Error('保存データを読み取れないため、変更していません。');
      const current = [...new Set(value as string[])];
      const removing = current.includes(slug);
      if (!removing && current.length >= 10) {
        setGameMessage('最大10本です。選択を減らしてから追加してください。');
        return;
      }
      const success = saveGames(
        removing ? current.filter((item) => item !== slug) : [...current, slug],
      );
      if (success && !removing) trackMyGameAdded();
      setGameMessage(
        success
          ? 'マイゲームをこのブラウザに保存しました。'
          : '保存できませんでした。ブラウザの保存設定を確認してください。',
      );
    } catch (error) {
      setGameMessage(
        error instanceof Error ? error.message : '保存できませんでした。',
      );
    }
  }

  return (
    <div className="my-dashboard">
      <ReadingList />
      <RecentTroubles variant="my" />

      <section id="my-feed" aria-labelledby="my-feed-title">
        <h2 id="my-feed-title">マイゲームの最新情報</h2>
        {mine.length && previous !== undefined ? (
          <p className="my-visit-note">
            {previous
              ? `前回（${shortDate(previousDate)}）見た後に出た情報に「新着」が付いています。`
              : '次に開いた時から、前回見た後に出た情報に「新着」が付きます。'}
          </p>
        ) : null}
        {mine.length ? (
          <div className="my-game-cards">
            {mine.map((game) => {
              const fresh =
                game.updates.filter((item) => isNewDate(item.date)).length +
                (news[game.slug] ?? []).filter((item) => isNewTime(item.date))
                  .length;
              return (
                <article className="my-game-card" key={game.slug}>
                  <h3>
                    <a href={`/games/${game.slug}`}>{game.name}</a>
                    {fresh ? (
                      <span className="my-new-badge">新着 {fresh}</span>
                    ) : null}
                  </h3>
                  {game.spec ? (
                    <p>
                      あなたのPCで：
                      <MyPcFit spec={game.spec} />
                    </p>
                  ) : null}
                  {game.maintenance.map((item) => (
                    <p className="my-game-maintenance" key={item.start}>
                      <b>メンテ</b> {time.format(new Date(item.start))}〜
                      {time.format(new Date(item.end))}：{item.title}{' '}
                      <a href={item.url} target="_blank" rel="noreferrer">
                        公式 <ExternalLink size={12} />
                      </a>
                    </p>
                  ))}
                  {news[game.slug]?.length ? (
                    <>
                      <h4>公式のお知らせ（Steam・30日以内）</h4>
                      <ul>
                        {news[game.slug].map((item) => (
                          <li key={item.url}>
                            {isNewTime(item.date) ? (
                              <span className="my-new-mark">新着</span>
                            ) : null}
                            {day.format(new Date(item.date))}{' '}
                            <a href={item.url} target="_blank" rel="noreferrer">
                              {item.title} <ExternalLink size={12} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {game.updates.length ? (
                    <>
                      <h4>記事の確認・週刊まとめ（30日以内）</h4>
                      <ul>
                        {game.updates.map((item) => (
                          <li key={`${item.date}-${item.label}`}>
                            {isNewDate(item.date) ? (
                              <span className="my-new-mark">新着</span>
                            ) : null}
                            {shortDate(item.date)}{' '}
                            <a href={item.href}>
                              {item.label} <ArrowRight size={12} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {game.articles.length ? (
                    <>
                      <h4>ゲムなおの解決記事</h4>
                      <ul>
                        {game.articles.map((article) => (
                          <li key={article.href}>
                            <a href={article.href}>
                              {article.label} <ArrowRight size={12} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <p>
            {gamesReady ? (
              <>
                <a href="#my-games">遊ぶゲームを登録</a>
                すると、公式のお知らせと解決記事がここにまとまります。
              </>
            ) : (
              'マイゲームを確認しています…'
            )}
          </p>
        )}
      </section>
      <section id="my-games" aria-labelledby="my-games-title">
        <p>
          <a href="/my-games">ゲーム名で探して、解決記事をすぐ開く →</a>
        </p>
        <h2 id="my-games-title">
          <Gamepad2 size={21} /> マイゲーム
        </h2>
        <p>
          遊んでいるゲームを選ぶと、公式のお知らせ・メンテナンス・解決記事がここにまとまります（最大10本）。
        </p>
        {gamesReady ? (
          <div className="my-game-picker">
            {games.map((game) => (
              <label key={game.slug}>
                <input
                  type="checkbox"
                  checked={myGames.includes(game.slug)}
                  onChange={() => toggle(game.slug)}
                />{' '}
                {game.name}
              </label>
            ))}
          </div>
        ) : null}
        <output className="solution-message">{gameMessage}</output>
      </section>

      <SolutionNotebook />

      <section id="my-pc" aria-labelledby="my-pc-title">
        <h2 id="my-pc-title">
          <Cpu size={21} /> マイPC
        </h2>
        <p>
          登録すると、新作の動作環境まとめなどで「あなたのPCで動くか」の目安が表示されます。内容はこのブラウザだけに保存され、サーバーには送信しません。
        </p>
        {pcReady ? (
          <PcForm
            key={pc ? `${pc.gpu}-${pc.ramGb}-${pc.windows}` : 'new'}
            pc={pc}
            onSave={(value) => savePc(value)}
            onClear={() => savePc(null)}
          />
        ) : null}
      </section>
    </div>
  );
}
