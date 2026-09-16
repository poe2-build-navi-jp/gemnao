'use client';

import { CheckCircle2, CircleHelp, LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';

type Row = { topic: string; struggling: number; resolved: number };
const labels = {
  ja: {
    topics: [
      '保存場所',
      'FPS・表示',
      'コントローラー',
      '起動・クラッシュ',
      'MOD・日本語',
      'スペック',
      'Discordの起動・アプリ',
      'Discordの音声',
      'Discordの接続',
      'Discordの画面共有・配信',
    ],
    title: 'みんなの困りごと・解決状況',
    intro:
      'ゲムなお内でボタンが押された回数を集計します。公開後に実測値が蓄積され、どの問題が多く、どの情報が解決につながったかを確認できます。',
    struggling: '困っている',
    resolved: '解決した',
    unit: '件',
    note: '人数ではなく匿名の回答件数です。個人を特定する情報は保存しません。同じ端末・ブラウザでは各ボタンを1回だけ押せます。',
    loading: '読み込み中',
  },
  en: {
    topics: [
      'Save paths',
      'FPS & display',
      'Controllers',
      'Launch & crashes',
      'Mods & language',
      'Requirements',
      'Discord launch & app',
      'Discord audio',
      'Discord connection',
      'Discord screen share',
    ],
    title: 'Problems reported and resolved',
    intro:
      'These are button responses submitted on Gemnao. After publication, real responses will show which topics cause trouble and which guides helped.',
    struggling: 'I need help',
    resolved: 'Solved',
    unit: '',
    note: 'These are anonymous response counts, not unique people. We store no identifying information. Each button can be used once per browser and device.',
    loading: 'Loading',
  },
  zh: {
    topics: [
      '存档位置',
      'FPS 与显示',
      '手柄',
      '启动与崩溃',
      'MOD 与语言',
      '配置需求',
      'Discord 启动与应用',
      'Discord 语音',
      'Discord 连接',
      'Discord 屏幕共享',
    ],
    title: '遇到问题与已经解决',
    intro:
      '这里统计用户在“ゲムなお”点击按钮的次数。网站公开后，实际反馈会显示哪些问题较多、哪些指南帮助解决了问题。',
    struggling: '遇到问题',
    resolved: '已经解决',
    unit: '次',
    note: '此处是匿名回答次数，并非独立人数。本站不保存身份信息；同一设备和浏览器每个按钮只能点击一次。',
    loading: '加载中',
  },
  es: {
    topics: [
      'Partidas',
      'FPS y pantalla',
      'Mandos',
      'Inicio y cierres',
      'Mods e idioma',
      'Requisitos',
      'Discord: inicio y app',
      'Discord: audio',
      'Discord: conexión',
      'Discord: compartir pantalla',
    ],
    title: 'Problemas y soluciones de la comunidad',
    intro:
      'Contamos las respuestas enviadas en Gemnao. Cuando el sitio sea público, mostrarán qué problemas son frecuentes y qué guías ayudaron.',
    struggling: 'Necesito ayuda',
    resolved: 'Resuelto',
    unit: '',
    note: 'Son respuestas anónimas, no personas únicas. No guardamos datos identificativos. Cada botón solo puede usarse una vez por navegador y dispositivo.',
    loading: 'Cargando',
  },
} as const;
const topicIds = [
  'save',
  'display',
  'controller',
  'launch',
  'mods',
  'specs',
  'discord-launch',
  'discord-audio',
  'discord-connection',
  'discord-screen',
] as const;
type TopicId = (typeof topicIds)[number];
const publicCountThreshold = 10;

export function IssueFeedback({
  gameSlug,
  locale = 'ja',
  topics = topicIds,
  compact = false,
  solutionOptions = [],
}: {
  gameSlug: string;
  locale?: 'ja' | Locale;
  topics?: readonly TopicId[];
  compact?: boolean;
  solutionOptions?: { id: string; label: string }[];
}) {
  const ui = labels[locale];
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState('');
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [methodQuestion, setMethodQuestion] = useState<string | null>(null);
  const [methodSaved, setMethodSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      const saved = new Set<string>();
      for (const topic of topics)
        for (const kind of ['struggling', 'resolved']) {
          if (
            localStorage.getItem(`gemnao-feedback:${gameSlug}:${topic}:${kind}`)
          )
            saved.add(`${topic}:${kind}`);
        }
      try {
        const response = await fetch(
          `/api/feedback?game=${encodeURIComponent(gameSlug)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as { rows?: Row[] };
        setRows(data.rows || []);
        setVoted(saved);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError'))
          setVoted(saved);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [gameSlug, topics]);

  const counts = useMemo(
    () => new Map(rows.map((row) => [row.topic, row])),
    [rows],
  );
  async function vote(topic: string, kind: 'struggling' | 'resolved') {
    const key = `${topic}:${kind}`;
    if (voted.has(key) || sending) return;
    setSending(key);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: gameSlug, topic, kind }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { rows?: Row[] };
      setRows(data.rows || []);
      localStorage.setItem(`gemnao-feedback:${gameSlug}:${topic}:${kind}`, '1');
      setVoted(new Set([...voted, key]));
      if (kind === 'resolved' && solutionOptions.length)
        setMethodQuestion(topic);
    } finally {
      setSending('');
    }
  }
  async function saveMethod(method: { id: string; label: string }) {
    if (!methodQuestion || sending) return;
    setSending(`method:${method.id}`);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameSlug,
          topic: methodQuestion,
          kind: 'method',
          method: method.id,
          label: method.label,
        }),
      });
      if (!response.ok) return;
      localStorage.setItem(
        `gemnao-feedback:${gameSlug}:${methodQuestion}:method`,
        method.id,
      );
      setMethodSaved(true);
    } finally {
      setSending('');
    }
  }

  return (
    <section
      className={`feedback-panel${compact ? ' compact-feedback' : ''}`}
      aria-labelledby="feedback-title"
    >
      <div className="feedback-heading">
        <div>
          <p className="evidence-label">GEMNAO FIRST-PARTY DATA</p>
          <h2 id="feedback-title">
            {compact && locale === 'ja'
              ? 'この情報は役に立ちましたか？'
              : ui.title}
          </h2>
        </div>
        {loading && (
          <LoaderCircle className="spin" size={22} aria-label={ui.loading} />
        )}
      </div>
      {!compact && <p className="feedback-intro">{ui.intro}</p>}
      <div className="feedback-table">
        {topics.map((topic) => {
          const index = topicIds.indexOf(topic);
          const row = counts.get(topic) || { struggling: 0, resolved: 0 };
          const showCounts =
            row.struggling + row.resolved >= publicCountThreshold;
          return (
            <div className="feedback-row" key={topic}>
              <strong>{ui.topics[index]}</strong>
              <div className="feedback-actions">
                <button
                  type="button"
                  disabled={voted.has(`${topic}:struggling`) || !!sending}
                  onClick={() => vote(topic, 'struggling')}
                >
                  <CircleHelp size={16} />
                  <span>
                    {compact && locale === 'ja'
                      ? '解決しなかった'
                      : ui.struggling}
                  </span>
                  {showCounts && (
                    <b>
                      {row.struggling}
                      {ui.unit}
                    </b>
                  )}
                </button>
                <button
                  type="button"
                  disabled={voted.has(`${topic}:resolved`) || !!sending}
                  onClick={() => vote(topic, 'resolved')}
                >
                  <CheckCircle2 size={16} />
                  <span>{ui.resolved}</span>
                  {showCounts && (
                    <b>
                      {row.resolved}
                      {ui.unit}
                    </b>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {methodQuestion && (
        <div className="method-question">
          <strong>
            {methodSaved
              ? '回答ありがとうございました'
              : 'どの方法で直りましたか？'}
          </strong>
          {!methodSaved && (
            <div>
              {[...solutionOptions, { id: 'other', label: 'その他' }].map(
                (method) => (
                  <button
                    type="button"
                    onClick={() => saveMethod(method)}
                    disabled={!!sending}
                    key={method.id}
                  >
                    {method.label}
                  </button>
                ),
              )}
            </div>
          )}
          <small>
            回答は匿名の件数として保存し、少数のうちは公開しません。
          </small>
        </div>
      )}
      <p className="count-note">
        ※ 回答が一定数集まるまでは件数を表示しません。{ui.note}
      </p>
    </section>
  );
}
