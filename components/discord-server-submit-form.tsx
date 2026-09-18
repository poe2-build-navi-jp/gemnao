'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useState } from 'react';
import {
  activeTimes,
  discordServerGames,
  playStyles,
  recruitmentPurposes,
  voiceChatOptions,
} from '@/lib/discord-servers';

export function DiscordServerSubmitForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    const form = new FormData(event.currentTarget);
    if (!form.getAll('purpose').length || !form.getAll('activeTime').length) {
      setState('error');
      return;
    }
    const value = (name: string) => {
      const entry = form.get(name);
      return typeof entry === 'string' ? entry : '';
    };
    const response = await fetch('/api/discord-servers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serverName: value('serverName'),
        inviteUrl: value('inviteUrl'),
        game: value('game'),
        description: value('description'),
        purposes: form.getAll('purpose'),
        styles: form.getAll('playStyle'),
        activeTimes: form.getAll('activeTime'),
        voiceChat: value('voiceChat'),
        requirements: value('requirements'),
        rules: value('rules'),
        ownerDiscord: value('ownerDiscord'),
        replyEmail: value('replyEmail'),
        website: value('website'),
      }),
    }).catch(() => null);
    setState(response?.ok ? 'sent' : 'error');
    if (response?.ok) event.currentTarget.reset();
  }

  if (state === 'sent') {
    return (
      <output className="contact-success server-submit-success">
        <strong>掲載申請を受け付けました</strong>
        <p>内容・招待リンク・禁止事項を確認後、掲載可否を判断します。申請直後には公開されません。</p>
        <a href="/discord-servers">Discordサーバー募集へ戻る</a>
      </output>
    );
  }

  return (
    <form className="contact-form server-submit-form" onSubmit={submit}>
      <fieldset>
        <legend>サーバーの基本情報</legend>
        <label>サーバー名<input name="serverName" required minLength={2} maxLength={80} /></label>
        <label>
          Discord招待URL
          <input name="inviteUrl" required type="url" pattern="https://(discord\.gg|discord\.com/invite)/.+" placeholder="https://discord.gg/..." />
          <small>期限切れにならない招待リンクを推奨します。</small>
        </label>
        <label>
          対象ゲーム
          <select name="game" required defaultValue="">
            <option value="" disabled>選択してください</option>
            {discordServerGames.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          サーバー紹介
          <textarea name="description" required minLength={40} maxLength={600} rows={6} placeholder="誰向けのサーバーか、普段どのように遊んでいるかを40文字以上で入力してください。" />
        </label>
      </fieldset>

      <fieldset>
        <legend>募集条件</legend>
        <div className="server-check-group">
          <strong>募集目的（1つ以上）</strong>
          <div>{recruitmentPurposes.map((item) => <label key={item}><input type="checkbox" name="purpose" value={item} />{item}</label>)}</div>
        </div>
        <div className="server-check-group">
          <strong>プレイスタイル</strong>
          <div>{playStyles.map((item) => <label key={item}><input type="checkbox" name="playStyle" value={item} />{item}</label>)}</div>
        </div>
        <div className="server-check-group">
          <strong>主な活動時間（1つ以上）</strong>
          <div>{activeTimes.map((item) => <label key={item}><input type="checkbox" name="activeTime" value={item} />{item}</label>)}</div>
        </div>
        <label>
          VC条件
          <select name="voiceChat" required defaultValue="">
            <option value="" disabled>選択してください</option>
            {voiceChatOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label>参加条件<textarea name="requirements" required minLength={10} maxLength={300} rows={4} placeholder="年齢、ランク、対応機種など" /></label>
        <label>禁止事項<textarea name="rules" required minLength={10} maxLength={300} rows={4} placeholder="暴言、迷惑行為、無断勧誘など" /></label>
      </fieldset>

      <fieldset>
        <legend>掲載者情報</legend>
        <label>運営者のDiscordユーザー名<input name="ownerDiscord" required maxLength={80} autoComplete="off" /><small>管理権限と募集継続の確認にだけ使用し、掲載ページには表示しません。</small></label>
        <label>返信先メールアドレス<input name="replyEmail" type="email" required maxLength={254} autoComplete="email" /><small>審査結果や再確認の連絡に使用します。</small></label>
      </fieldset>

      <label className="contact-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="contact-consent">
        <input type="checkbox" required />
        <span><a href="/discord-servers/guidelines" target="_blank">掲載ガイドライン</a>と<a href="/privacy" target="_blank">プライバシーポリシー</a>に同意し、サーバーを管理する権限があることを確認します。</span>
      </label>
      <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? '送信中…' : '無料掲載を申請する'}</button>
      {state === 'error' ? <p className="contact-error" role="alert">送信できませんでした。入力内容を確認し、時間を置いて再度お試しください。</p> : null}
    </form>
  );
}
