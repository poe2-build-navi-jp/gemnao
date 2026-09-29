'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Search, ShieldCheck, Users } from 'lucide-react';
import {
  activeTimes,
  discordServerGames,
  recruitmentPurposes,
  type DiscordServer,
} from '@/lib/discord-servers';

export function DiscordServerDirectory({
  initialServers,
  initialLoadFailed,
}: {
  initialServers: DiscordServer[];
  initialLoadFailed: boolean;
}) {
  const [servers, setServers] = useState<DiscordServer[]>(initialServers);
  const [loadState, setLoadState] = useState<'ready' | 'error'>(
    initialLoadFailed ? 'error' : 'ready',
  );
  const [query, setQuery] = useState('');
  const [game, setGame] = useState('');
  const [purpose, setPurpose] = useState('');
  const [activeTime, setActiveTime] = useState('');
  const [voiceChat, setVoiceChat] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/discord-servers')
      .then(async (response) => {
        if (!response.ok) throw new Error('request failed');
        return (await response.json()) as { servers?: DiscordServer[] };
      })
      .then((data) => {
        if (!active) return;
        setServers(Array.isArray(data.servers) ? data.servers : []);
        setLoadState('ready');
      })
      .catch(() => {
        if (active) setLoadState('error');
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return servers.filter((server) => {
      const text = [
        server.name,
        server.game,
        server.description,
        ...server.purposes,
        ...server.styles,
      ]
        .join(' ')
        .toLowerCase();
      return (
        (!normalizedQuery || text.includes(normalizedQuery)) &&
        (!game || server.game === game) &&
        (!purpose || server.purposes.includes(purpose)) &&
        (!activeTime || server.activeTimes.includes(activeTime)) &&
        (!voiceChat || server.voiceChat === voiceChat)
      );
    });
  }, [activeTime, game, purpose, query, servers, voiceChat]);

  // An empty directory with a full search form reads as an unfinished page.
  const isEmpty = loadState === 'ready' && servers.length === 0;
  const hasFilters = Boolean(
    query || game || purpose || activeTime || voiceChat,
  );

  return (
    <section className="server-search" aria-labelledby="server-search-title">
      <div className="server-search-heading">
        <div>
          <p>SERVER DIRECTORY</p>
          <h2 id="server-search-title">
            {isEmpty
              ? '掲載中のDiscordサーバー'
              : 'Discordサーバーを条件から探す'}
          </h2>
        </div>
        <a className="server-submit-link" href="/discord-servers/submit">
          サーバーを掲載する <ArrowRight size={16} />
        </a>
      </div>

      {isEmpty ? null : (
        <>
          <div className="server-filters">
            <label className="server-keyword">
              <span>キーワード</span>
              <div>
                <Search size={18} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ゲーム名・サーバー名"
                />
              </div>
            </label>
            <label>
              <span>ゲーム</span>
              <select
                value={game}
                onChange={(event) => setGame(event.target.value)}
              >
                <option value="">すべてのゲーム</option>
                {discordServerGames.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>募集目的</span>
              <select
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
              >
                <option value="">すべての目的</option>
                {recruitmentPurposes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>活動時間</span>
              <select
                value={activeTime}
                onChange={(event) => setActiveTime(event.target.value)}
              >
                <option value="">すべての時間</option>
                {activeTimes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>ボイスチャット</span>
              <select
                value={voiceChat}
                onChange={(event) => setVoiceChat(event.target.value)}
              >
                <option value="">指定なし</option>
                <option value="required">VC必須</option>
                <option value="optional">VC任意</option>
                <option value="listen-only-ok">聞き専OK</option>
                <option value="none">VCなし</option>
              </select>
            </label>
          </div>

          <div className="server-result-summary" aria-live="polite">
            <span>
              {loadState === 'error'
                ? '募集情報を読み込めませんでした'
                : `${filtered.length}件の募集中サーバー`}
            </span>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setGame('');
                  setPurpose('');
                  setActiveTime('');
                  setVoiceChat('');
                }}
              >
                条件をクリア
              </button>
            ) : null}
          </div>
        </>
      )}

      {loadState === 'error' ? (
        <div className="server-empty" role="alert">
          <h3>募集情報を読み込めませんでした</h3>
          <p>時間を置いてページを再読み込みしてください。</p>
        </div>
      ) : filtered.length ? (
        <div className="server-card-grid">
          {filtered.map((server) => (
            <article className="server-card" id={server.slug} key={server.slug}>
              <div className="server-card-status">
                <span>
                  <ShieldCheck size={15} /> 活動確認済み
                </span>
                <time dateTime={server.lastVerifiedAt}>
                  {server.lastVerifiedAt}
                </time>
              </div>
              <p>{server.game}</p>
              <h3>{server.name}</h3>
              <div className="server-card-tags">
                {server.purposes.slice(0, 2).map((item) => (
                  <span key={item}>{item}</span>
                ))}
                {server.styles.slice(0, 2).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className="server-card-description">{server.description}</p>
              <dl className="server-card-conditions">
                <div>
                  <dt>活動時間</dt>
                  <dd>{server.activeTimes.join('・')}</dd>
                </div>
                <div>
                  <dt>VC</dt>
                  <dd>
                    {server.voiceChat === 'required'
                      ? '必須'
                      : server.voiceChat === 'optional'
                        ? '任意'
                        : server.voiceChat === 'listen-only-ok'
                          ? '聞き専OK'
                          : 'なし'}
                  </dd>
                </div>
                <div>
                  <dt>参加条件</dt>
                  <dd>{server.requirements}</dd>
                </div>
                <div>
                  <dt>禁止事項</dt>
                  <dd>{server.rules}</dd>
                </div>
              </dl>
              <a
                href={server.inviteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Discordに参加する <ArrowRight size={15} />
              </a>
              <a
                href={`/contact?url=${encodeURIComponent(`https://gemnao.pages.dev/discord-servers#${server.slug}`)}`}
              >
                招待切れ・掲載内容を連絡する
              </a>
            </article>
          ))}
        </div>
      ) : loadState === 'ready' ? (
        <div className="server-empty">
          <Users size={32} aria-hidden="true" />
          <h3>
            {hasFilters
              ? '条件に合う募集はありません'
              : '現在、掲載中のサーバーはありません'}
          </h3>
          <p>
            未確認のサーバーを水増し掲載せず、運営者確認と招待リンク確認が済んだ募集だけを公開します。
          </p>
          <a href="/discord-servers/submit">
            無料で掲載を申請する <ArrowRight size={15} />
          </a>
          <a
            href="https://discord.com/servers/gaming"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord公式でゲームサーバーを探す <ArrowRight size={15} />
          </a>
        </div>
      ) : null}

      <aside className="verification-note">
        <Clock3 size={20} aria-hidden="true" />
        <div>
          <strong>
            「活動中」は、運営者が募集継続を確認した日で判断します
          </strong>
          <p>
            Discord内の会話やメンバー情報を無断取得して判定することはありません。
          </p>
        </div>
      </aside>
    </section>
  );
}
