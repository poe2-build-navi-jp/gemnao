'use client';
/* oxlint-disable next/no-html-link-for-pages -- Public native links. */
import { useEffect, useState } from 'react';
import { useMyGames } from '@/components/use-my-pc';
import { trackEvent } from '@/lib/analytics';
type Choice = { slug: string; title: string };
export function GameAlertSubscription({ choices }: { choices: Choice[] }) {
  const [saved, , ready] = useMyGames(),
    [selection, setSelection] = useState<string[]>([]),
    [message, setMessage] = useState(''),
    [active, setActive] = useState(false);
  const key = selection.slice().sort().join(','),
    href = key
      ? 'https://gemnao.pages.dev/api/game-updates-feed?games=' + key
      : '';
  useEffect(() => {
    if (!active || !key) return;
    let stopped = false;
    const controller = new AbortController();
    let baseline: Set<string> | null = null;
    const enabledAt = Date.now();
    async function poll() {
      try {
        const response = await fetch('/api/game-news?games=' + key, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as Record<
          string,
          { title: string; url: string; date: string }[]
        >;
        if (!data || typeof data !== 'object' || Array.isArray(data)) return;
        const entries = key
          .split(',')
          .flatMap((slug) =>
            (Array.isArray(data[slug]) ? data[slug] : [])
              .filter(
                (n) =>
                  n && typeof n.url === 'string' && typeof n.title === 'string',
              )
              .map((n) => ({ ...n, slug })),
          );
        if (stopped) return;
        const ids = new Set(entries.map((n) => n.url));
        if (baseline) {
          const fresh = entries.filter(
            (n) => !baseline!.has(n.url) && Date.parse(n.date) >= enabledAt,
          );
          for (const n of fresh.slice(0, 3)) {
            if (Notification.permission === 'granted') {
              const notice = new Notification('ゲムなお｜公式ニュース更新', {
                body: n.title.slice(0, 120),
                tag: n.url,
              });
              notice.onclick = () => {
                window.focus();
                location.href = '/games/' + n.slug;
              };
            }
          }
          if (fresh.length)
            setMessage(
              `新しい公式ニュース ${fresh.length}件。ゲーム別ページで確認できます。`,
            );
        }
        baseline = new Set([...(baseline || []), ...ids]);
      } catch {
        /* keep prior state */
      }
    }
    void poll();
    const timer = setInterval(() => void poll(), 300000);
    return () => {
      stopped = true;
      controller.abort();
      clearInterval(timer);
    };
  }, [active, key]);
  async function enable() {
    if (!key) {
      setMessage('先にゲームを選んでください。');
      return;
    }
    if (!('Notification' in window)) {
      setMessage(
        'このブラウザーでは通知に対応していません。RSS購読をご利用ください。',
      );
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setActive(permission === 'granted');
      setMessage(
        permission === 'granted'
          ? 'このページを開いている間、約5分ごとに確認します。既存のお知らせは通知しません。'
          : '通知は有効になっていません。RSS購読は利用できます。',
      );
    } catch {
      setMessage('通知を有効にできませんでした。');
    }
  }
  return (
    <section className="gemnao-form">
      <h2>遊んでいるゲームだけ、更新を受け取る</h2>
      <p>
        Steam公式ニュースをゲーム別にまとめます。修正以外の告知も含み、各ゲーム最大3件・直近30日が対象です。取得できない時は掲載が遅れます。
      </p>
      <button
        disabled={!ready}
        onClick={() => {
          setActive(false);
          setSelection(
            saved.filter((s) => choices.some((c) => c.slug === s)).slice(0, 10),
          );
          setMessage(
            '通知対応ゲームをマイゲームから読み込みました。未対応のゲームは含まれません。',
          );
        }}
      >
        マイゲームから読み込む
      </button>
      <fieldset>
        <legend>購読するゲーム（最大10作品）</legend>
        <div className="gemnao-game-choices">
          {choices.map((c) => (
            <label key={c.slug}>
              <input
                type="checkbox"
                checked={selection.includes(c.slug)}
                onChange={(e) => {
                  setActive(false);
                  setSelection((s) =>
                    e.target.checked
                      ? s.length < 10
                        ? [...s, c.slug]
                        : s
                      : s.filter((x) => x !== c.slug),
                  );
                }}
              />
              {c.title}
            </label>
          ))}
        </div>
      </fieldset>
      <h3>サイトを閉じている間も：RSS購読</h3>
      <p>
        下のURLをRSSアプリへ追加してください。通知の有無・更新間隔・有料機能はアプリ側の仕様と設定によります。購読先アプリに、選んだゲームの一覧が渡ります。選択変更後は新しいURLを登録し、旧購読を解除してください。
      </p>
      {href && (
        <>
          <label>
            購読URL
            <input readOnly value={href} />
          </label>
          <div className="gemnao-actions">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(href);
                  setMessage(
                    'RSS購読URLをコピーしました。RSSアプリに追加してください。',
                  );
                  trackEvent('game_alert_feed_copied', {
                    page_location: 'https://gemnao.pages.dev/tools/game-alerts',
                    page_referrer: '',
                    page_title: 'Game alerts',
                  });
                } catch {
                  setMessage(
                    'コピーできません。URLを選択してコピーしてください。',
                  );
                }
              }}
            >
              RSS購読URLをコピー
            </button>
            <a href={href}>フィードを開く</a>
          </div>
        </>
      )}
      <h3>このページを開いている間：ブラウザー通知</h3>
      <p>
        端末が対応している場合のみ利用できます。ページを閉じると停止します。ゲーム選択を変えた場合も停止し、再度有効化が必要です。
      </p>
      <button disabled={!key || active} onClick={enable}>
        このページで通知を有効にする
      </button>
      {active && (
        <button
          onClick={() => {
            setActive(false);
            setMessage('このページでの通知を停止しました。');
          }}
        >
          通知を停止
        </button>
      )}
      <output className="gemnao-message">{message}</output>
      <p>
        <a href="/my-games">マイゲームへ戻る →</a>
      </p>
    </section>
  );
}
