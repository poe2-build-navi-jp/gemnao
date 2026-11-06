'use client';
/* oxlint-disable next/no-html-link-for-pages -- External Steam hub and native article navigation. */
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
type Draft = {
  game: string;
  title: string;
  locale: string;
  body: string;
  path: string;
  checkedAt: string;
};
export function SteamGuidePublisher({
  drafts,
  choices,
}: {
  drafts: Draft[];
  choices: { slug: string; title: string; appId: string }[];
}) {
  const [game, setGame] = useState(choices[0]?.slug || ''),
    [locale, setLocale] = useState('ja'),
    [message, setMessage] = useState('');
  const draft = drafts.find((d) => d.game === game && d.locale === locale),
    choice = choices.find((c) => c.slug === game);
  async function copy() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.body);
      setMessage(
        'Steam用の本文をコピーしました。内容と公式の最新情報を確認し、Steamの編集画面に貼り付けてください。',
      );
      trackEvent('steam_guide_copied', {
        page_location: 'https://gemnao.pages.dev/tools/steam-guides',
        page_title: 'Steam guide drafts',
        page_referrer: '',
      });
    } catch {
      setMessage('コピーできません。下の本文を選択してコピーしてください。');
    }
  }
  function download() {
    if (!draft) return;
    const u = URL.createObjectURL(
      new Blob([draft.body], { type: 'text/plain;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = u;
    a.download = `gemnao-steam-${game}-${locale}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }
  return (
    <section className="gemnao-form">
      <h2>Steamでも読める、3本のガイド原稿</h2>
      <p>
        外部サイトのリンクだけでなく、Steam上で確認できる基本手順・出典・確認日を含めています。対象ゲームが自分のSteamライブラリにあり、投稿できることを先に確認してください。
      </p>
      <label>
        ゲーム
        <select
          value={game}
          onChange={(e) => {
            setGame(e.target.value);
            setMessage('');
          }}
        >
          {choices.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        原稿の言語
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      {draft ? (
        <>
          <h3>{draft.title}</h3>
          <p>
            資料の確認記録：{draft.checkedAt}
            。公開前に出典で現行版への適用を確認してください。
          </p>
          <label>
            Steam用本文（BBCode）
            <textarea
              className="gemnao-steam-draft"
              readOnly
              value={draft.body}
            />
          </label>
          <div className="gemnao-actions">
            <button onClick={copy}>本文をコピー</button>
            <button onClick={download}>原稿を保存</button>
            {choice && (
              <a
                href={`https://steamcommunity.com/app/${choice.appId}/guides/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Steamのガイド一覧を開く ↗
              </a>
            )}
            <a href={draft.path}>元の記事を確認 →</a>
          </div>
        </>
      ) : (
        <p>この言語の校正済み原稿はありません。日本語を選んでください。</p>
      )}
      <output className="gemnao-message">{message}</output>
      <ol>
        <li>原稿を読み、現在のゲーム版と条件を出典で確認する。</li>
        <li>Steamの対象ゲームの「ガイド」から作成画面を開く。</li>
        <li>
          タイトル・言語・カテゴリーを設定し、本文を編集画面へ貼り付ける。
        </li>
        <li>Steamのプレビューで段落・リンクを確認して公開する。</li>
      </ol>
      <p>
        このページからSteamへ自動投稿はしません。Steamアカウントの認証情報はゲムなおに入力しないでください。
      </p>
      <a href="https://help.steampowered.com/en/faqs/view/7E51-0A01-FAF2-BDAE">
        Steam公式：ガイドの作成条件（英語）↗
      </a>
    </section>
  );
}
