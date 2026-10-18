'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */


import { useState } from 'react';
import { useBoundedRequest } from './use-bounded-request';

export function ContactForm({
  locale = 'ja',
  initialUrl = '',
  initialCategory = 'correction',
}: {
  locale?: 'ja' | 'en';
  initialUrl?: string;
  initialCategory?: 'correction' | 'business';
}) {
  const en = locale === 'en';
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );

  const request = useBoundedRequest();
  const [uncertain, setUncertain] = useState(false);

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.isPending()) return;
    // React clears currentTarget after the synchronous event callback returns.
    const formElement = event.currentTarget;
    setState('sending');
    setUncertain(false);
    const form = new FormData(formElement);
    const result = await request.send('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    if (!result) return;
    const response = result.response;
    setUncertain(!response);
    if (response?.ok) formElement.reset();
    setState(response?.ok ? 'sent' : 'error');
  }

  if (state === 'sent') {
    return (
      <output className="contact-success">
        <strong>{en ? 'Message sent' : '送信しました'}</strong>
        <p>
          {en
            ? 'We will review your message and act as appropriate. Without a reply address, we cannot respond individually. Submission does not confirm acceptance of a project or contract.'
            : '内容を確認し、必要に応じて対応します。返信先が未入力の場合、個別返信は行いません。送信完了は、企画・お仕事の受託確定を意味しません。'}
        </p>
      </output>
    );
  }

  return (
    <form
      className="contact-form"
      onSubmit={submit}
      aria-busy={state === 'sending'}
    >
      <label>
        {en ? 'Inquiry category' : 'お問い合わせ種別'}
        <select
          name="category"
          disabled={state === 'sending'}
          required
          defaultValue={initialCategory}
        >
          <option value="correction">
            {en ? 'Correction or outdated information' : '記事の誤り・古い情報'}
          </option>
          <option value="business">
            {en
              ? 'Business or manufacturer inquiry'
              : '企業・メーカーの企画相談'}
          </option>
          <option value="rights">
            {en ? 'Copyright or rights' : '著作権・権利関係'}
          </option>
          <option value="privacy">{en ? 'Privacy' : 'プライバシー'}</option>
          <option value="other">{en ? 'Other' : 'その他'}</option>
        </select>
      </label>
      <label>
        {en ? 'Page URL (optional)' : '対象ページURL（任意）'}
        <input
          name="pageUrl"
          readOnly={state === 'sending'}
          type="url"
          maxLength={500}
          defaultValue={initialUrl}
          placeholder="https://gemnao.pages.dev/..."
        />
      </label>
      <label>
        {en ? 'Message' : '内容'}
        <textarea
          name="message"
          readOnly={state === 'sending'}
          required
          minLength={20}
          maxLength={2000}
          rows={8}
          placeholder={
            en
              ? 'Describe the error, symptom or official evidence in at least 20 characters.'
              : '誤っている箇所、発生した症状、確認できる公式情報などを20文字以上で入力してください。'
          }
        />
      </label>
      <label>
        {en ? 'Reply email (optional)' : '返信先メールアドレス（任意）'}
        <input
          name="replyEmail"
          readOnly={state === 'sending'}
          type="email"
          maxLength={254}
          autoComplete="email"
        />
        <small>
          {en
            ? 'Enter this only if you want an individual reply.'
            : '個別返信が必要な場合だけ入力してください。'}
        </small>
      </label>
      <label className="contact-honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="contact-consent">
        <input type="checkbox" disabled={state === 'sending'} required />
        <span>
          <a href={en ? '/en/privacy' : '/privacy'} target="_blank">
            {en ? 'Privacy Policy' : 'プライバシーポリシー'}
          </a>
          {en
            ? ' has been read, and I consent to sending this information.'
            : 'を確認し、入力内容の送信に同意します。'}
        </span>
      </label>
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending'
          ? en
            ? 'Sending\u2026'
            : '送信中…'
          : en
            ? 'Send message'
            : '内容を送信する'}
      </button>
      {state === 'error' ? (
        <p className="contact-error" role="alert">
          {uncertain
            ? en
              ? 'Receipt could not be confirmed. Your input is retained. It may already have arrived; retrying can create a duplicate.'
              : '送信完了を確認できませんでした。入力内容は残っています。すでに受け付けられた可能性があるため、再送すると重複する場合があります。'
            : en
              ? 'The message could not be sent. Check your input and try again later.'
              : '送信できませんでした。入力内容を確認して、時間を置いて再度お試しください。'}
        </p>
      ) : null}
    </form>
  );
}
