'use client';
/* oxlint-disable next/no-img-element, next/no-html-link-for-pages -- Client-generated card and native navigation. */
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import {
  CARD_KEY,
  readCardCollection,
  cardSvg,
  cleanCard,
  type GemnaoCard,
} from '@/lib/gemnao-card';
const blank: GemnaoCard = {
  game: '',
  symptom: '',
  action: '',
  result: 'checking',
  theme: 'mint',
  article: '',
  date: '',
};
export function GemnaoCardStudio({
  articles,
}: {
  articles: { path: string; title: string }[];
}) {
  const [draft, setDraft] = useState(blank),
    [collection, setCollection] = useState<GemnaoCard[]>([]),
    [message, setMessage] = useState(''),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [healthy, setHealthy] = useState(true);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setDraft((d) => ({
        ...d,
        date: new Intl.DateTimeFormat('sv-SE', {
          timeZone: 'Asia/Tokyo',
        }).format(new Date()),
      }));
      try {
        setCollection(readCardCollection(localStorage.getItem(CARD_KEY)));
      } catch {
        setHealthy(false);
        setMessage(
          '保存済みカードを読み込めません。元データを上書きせず、画像の作成だけ利用できます。',
        );
      }
      const p = new URLSearchParams(location.search).get('article');
      if (p && articles.some((a) => a.path === p))
        setDraft((d) => ({ ...d, article: p }));
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [articles]);
  const svg = cardSvg(draft),
    preview = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const change = (key: keyof GemnaoCard, value: string) =>
    setDraft((d) => cleanCard({ ...d, [key]: value }));
  async function png() {
    setBusy(true);
    setMessage('');
    try {
      await document.fonts.ready;
      const img = new Image();
      img.src = preview;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw Error();
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(Error())), 'image/png'),
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gemnao-card.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      trackEvent('gemnao_card_exported', {
        page_location: 'https://gemnao.pages.dev/tools/gemnao-cards',
        page_title: 'Gemnao Cards',
        page_referrer: '',
      });
      setMessage('画像を作成しました。端末のダウンロードを確認してください。');
    } catch {
      setMessage(
        '画像を作成できませんでした。別のブラウザーでお試しください。',
      );
    } finally {
      setBusy(false);
    }
  }
  function save() {
    if (!draft.game || !draft.symptom || !draft.action) {
      setMessage('ゲーム名・症状・試したことを入力してください。');
      return;
    }
    if (!healthy || collection.length >= 100) {
      setMessage(
        '保存できません。カードは100枚までです。画像の作成は利用できます。',
      );
      return;
    }
    if (
      collection.some(
        (c) => JSON.stringify(c) === JSON.stringify(cleanCard(draft)),
      )
    ) {
      setMessage('同じカードはすでにコレクションにあります。');
      return;
    }
    const next = [cleanCard(draft), ...collection];
    try {
      localStorage.setItem(CARD_KEY, JSON.stringify(next));
      setCollection(next);
      trackEvent('gemnao_card_saved', {
        page_location: 'https://gemnao.pages.dev/tools/gemnao-cards',
        page_title: 'Gemnao Cards',
        page_referrer: '',
      });
      setMessage('このブラウザーのコレクションに保存しました。');
    } catch {
      setMessage('端末への保存に失敗しました。入力は画面に残っています。');
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `ゲムなおカード｜${draft.game}\n症状：${draft.symptom}\n試したこと：${draft.action}\n結果：${{ resolved: '解決した（本人の記録）', checking: '確認中', unresolved: 'まだ解決していない' }[draft.result]}\n効果を保証するものではありません。\n${draft.article ? '参考にした記事：https://gemnao.pages.dev' + draft.article : 'https://gemnao.pages.dev/tools/gemnao-cards'}`,
      );
      setMessage(
        '共有文をコピーしました。送信先で内容を確認してから投稿してください。',
      );
    } catch {
      setMessage('コピーできませんでした。');
    }
  }
  return (
    <>
      <div className="gemnao-studio">
        <section className="gemnao-form" aria-label="カードの編集">
          <h2>あなたの対処を、1枚のカードに。</h2>
          <p>
            入力はサーバーへ送信しません。アカウント名・メール・PCのユーザー名・パスなど、個人情報を含めないでください。
          </p>
          <label>
            ゲーム名
            <input
              maxLength={40}
              value={draft.game}
              onChange={(e) => change('game', e.target.value)}
            />
          </label>
          <label>
            症状
            <textarea
              maxLength={70}
              value={draft.symptom}
              onChange={(e) => change('symptom', e.target.value)}
            />
          </label>
          <label>
            試した対処・条件
            <textarea
              maxLength={130}
              value={draft.action}
              onChange={(e) => change('action', e.target.value)}
            />
          </label>
          <label>
            現在の結果
            <select
              value={draft.result}
              onChange={(e) => change('result', e.target.value)}
            >
              <option value="checking">確認中</option>
              <option value="resolved">解決した（本人の記録）</option>
              <option value="unresolved">まだ解決していない</option>
            </select>
          </label>
          <label>
            カードの仕上げ
            <select
              value={draft.theme}
              onChange={(e) => change('theme', e.target.value)}
            >
              <option value="mint">No.001 翡翠 — ミント箔</option>
              <option value="gold">No.002 琥珀 — ゴールド箔</option>
              <option value="violet">No.003 紫晶 — バイオレット箔</option>
            </select>
          </label>
          <label>
            参考にした記事（任意）
            <select
              value={draft.article}
              onChange={(e) => change('article', e.target.value)}
            >
              <option value="">選択なし</option>
              {articles.map((a) => (
                <option key={a.path} value={a.path}>
                  {a.title}
                </option>
              ))}
            </select>
          </label>
          <p>
            番号はデザインの種類です。希少性・修理の難易度・効果を表すものではありません。
          </p>
          <div className="gemnao-actions">
            <button disabled={!ready || busy} onClick={png}>
              PNG画像を保存
            </button>
            <button disabled={!ready || !healthy} onClick={save}>
              コレクションに残す
            </button>
            <button onClick={copy}>共有文をコピー</button>
          </div>
          <output className="gemnao-message">{message}</output>
        </section>
        <figure className="gemnao-card-preview">
          <img
            src={preview}
            width={720}
            height={1000}
            alt="入力した症状・対処・結果のゲムなおカードプレビュー"
          />
          <figcaption>
            見た目を選んで、記録を集める。共有は画像・文章を確認してから。
          </figcaption>
        </figure>
      </div>
      <section>
        <h2>
          マイコレクション <small>{collection.length} / 100</small>
        </h2>
        <p>
          このブラウザーだけに保存。履歴削除や端末変更で失われるため、大切なカードは画像でも残してください。
        </p>
        <div className="gemnao-collection">
          {collection.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                setDraft(c);
                setMessage('保存済みカードを編集画面に読み込みました。');
              }}
            >
              <img
                width={144}
                height={200}
                src={
                  'data:image/svg+xml;charset=utf-8,' +
                  encodeURIComponent(cardSvg(c))
                }
                alt={`${c.game}：${c.symptom}`}
              />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
