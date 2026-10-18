'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { serverDirectoryCopy } from '@/lib/localized/server-directory-copy';
import { useState } from 'react';
import { useBoundedRequest } from './use-bounded-request';
import {
  activeTimes,
  discordServerGames,
  playStyles,
  recruitmentPurposes,
  voiceChatOptions,
} from '@/lib/discord-servers';

export function DiscordServerSubmitForm({
  locale = 'ja',
}: {
  locale?: 'ja' | 'en';
}) {
  const en = locale === 'en';
  const t = (value: string) =>
    en ? serverDirectoryCopy[value] || value : value;
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );

  const request = useBoundedRequest();
  const [uncertain, setUncertain] = useState(false);

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.isPending()) return;
    const formElement = event.currentTarget;
    setState('sending');
    setUncertain(false);
    const form = new FormData(formElement);
    if (!form.getAll('purpose').length || !form.getAll('activeTime').length) {
      setState('error');
      return;
    }
    const value = (name: string) => {
      const entry = form.get(name);
      return typeof entry === 'string' ? entry : '';
    };
    const result = await request.send('/api/discord-servers', {
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
    });
    if (!result) return;
    const response = result.response;
    setUncertain(!response);
    if (response?.ok) formElement.reset();
    setState(response?.ok ? 'sent' : 'error');
  }

  if (state === 'sent') {
    return (
      <output className="contact-success server-submit-success">
        <strong>{t('掲載申請を受け付けました')}</strong>
        <p>
          {t(
            '内容・招待リンク・禁止事項を確認後、掲載可否を判断します。申請直後には公開されません。',
          )}
        </p>
        <a href={en ? '/en/discord-servers' : '/discord-servers'}>
          {t('Discordサーバー募集へ戻る')}
        </a>
      </output>
    );
  }

  return (
    <form
      className="contact-form server-submit-form"
      onSubmit={submit}
      aria-busy={state === 'sending'}
    >
      <fieldset disabled={state === 'sending'}>
        <legend>{t('サーバーの基本情報')}</legend>
        <label>
          {t('サーバー名')}
          <input name="serverName" required minLength={2} maxLength={80} />
        </label>
        <label>
          {t('Discord招待URL')}
          <input
            name="inviteUrl"
            required
            type="url"
            pattern="https://(discord\.gg|discord\.com/invite)/.+"
            placeholder="https://discord.gg/..."
          />
          <small>{t('期限切れにならない招待リンクを推奨します。')}</small>
        </label>
        <label>
          {t('対象ゲーム')}
          <select name="game" required defaultValue="">
            <option value="" disabled>
              {t('選択してください')}
            </option>
            {discordServerGames.map((item) => (
              <option key={item} value={item}>
                {t(item)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('サーバー紹介')}
          <textarea
            name="description"
            required
            minLength={40}
            maxLength={600}
            rows={6}
            placeholder={t(
              '誰向けのサーバーか、普段どのように遊んでいるかを40文字以上で入力してください。',
            )}
          />
        </label>
      </fieldset>

      <fieldset disabled={state === 'sending'}>
        <legend>{t('募集条件')}</legend>
        <div className="server-check-group">
          <strong>{t('募集目的（1つ以上）')}</strong>
          <div>
            {recruitmentPurposes.map((item) => (
              <label key={item}>
                <input type="checkbox" name="purpose" value={item} />
                {t(item)}
              </label>
            ))}
          </div>
        </div>
        <div className="server-check-group">
          <strong>{t('プレイスタイル')}</strong>
          <div>
            {playStyles.map((item) => (
              <label key={item}>
                <input type="checkbox" name="playStyle" value={item} />
                {t(item)}
              </label>
            ))}
          </div>
        </div>
        <div className="server-check-group">
          <strong>{t('主な活動時間（1つ以上）')}</strong>
          <div>
            {activeTimes.map((item) => (
              <label key={item}>
                <input type="checkbox" name="activeTime" value={item} />
                {t(item)}
              </label>
            ))}
          </div>
        </div>
        <label>
          {t('VC条件')}
          <select name="voiceChat" required defaultValue="">
            <option value="" disabled>
              {t('選択してください')}
            </option>
            {voiceChatOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.label)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('参加条件')}
          <textarea
            name="requirements"
            required
            minLength={10}
            maxLength={300}
            rows={4}
            placeholder={t('年齢、ランク、対応機種など')}
          />
        </label>
        <label>
          {t('禁止事項')}
          <textarea
            name="rules"
            required
            minLength={10}
            maxLength={300}
            rows={4}
            placeholder={t('暴言、迷惑行為、無断勧誘など')}
          />
        </label>
      </fieldset>

      <fieldset disabled={state === 'sending'}>
        <legend>{t('掲載者情報')}</legend>
        <label>
          {t('運営者のDiscordユーザー名')}
          <input
            name="ownerDiscord"
            required
            maxLength={80}
            autoComplete="off"
          />
          <small>
            {t(
              '管理権限と募集継続の確認にだけ使用し、掲載ページには表示しません。',
            )}
          </small>
        </label>
        <label>
          {t('返信先メールアドレス')}
          <input
            name="replyEmail"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
          <small>{t('審査結果や再確認の連絡に使用します。')}</small>
        </label>
      </fieldset>

      <label className="contact-honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="contact-consent">
        <input type="checkbox" disabled={state === 'sending'} required />
        <span>
          <a
            href={
              en
                ? '/en/discord-servers/guidelines'
                : '/discord-servers/guidelines'
            }
            target="_blank"
          >
            {t('掲載ガイドライン')}
          </a>
          {t('と')}
          <a href={en ? '/en/privacy' : '/privacy'} target="_blank">
            {t('プライバシーポリシー')}
          </a>
          {t('に同意し、サーバーを管理する権限があることを確認します。')}
        </span>
      </label>
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? t('送信中…') : t('無料掲載を申請する')}
      </button>
      {state === 'error' ? (
        <p className="contact-error" role="alert">
          {uncertain
            ? t(
                '送信完了を確認できませんでした。入力内容は残っています。すでに受け付けられた可能性があるため、再送すると重複する場合があります。',
              )
            : t(
                '送信できませんでした。入力内容を確認し、時間を置いて再度お試しください。',
              )}
        </p>
      ) : null}
    </form>
  );
}
