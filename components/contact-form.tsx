'use client';

import { useState } from 'react';

export function ContactForm({
  initialUrl = '',
  initialCategory = 'correction',
}: {
  initialUrl?: string;
  initialCategory?: 'correction' | 'business';
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );

  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    // React clears currentTarget after the synchronous event callback returns.
    const formElement = event.currentTarget;
    setState('sending');
    const form = new FormData(formElement);
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    }).catch(() => null);
    if (response?.ok) formElement.reset();
    setState(response?.ok ? 'sent' : 'error');
  }

  if (state === 'sent') {
    return (
      <output className="contact-success">
        <strong>送信しました</strong>
        <p>
          内容を確認し、必要に応じて対応します。返信先が未入力の場合、個別返信は行いません。送信完了は、企画・お仕事の受託確定を意味しません。
        </p>
      </output>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        お問い合わせ種別
        <select name="category" required defaultValue={initialCategory}>
          <option value="correction">記事の誤り・古い情報</option>
          <option value="business">企業・メーカーの企画相談</option>
          <option value="rights">著作権・権利関係</option>
          <option value="privacy">プライバシー</option>
          <option value="other">その他</option>
        </select>
      </label>
      <label>
        対象ページURL（任意）
        <input
          name="pageUrl"
          type="url"
          maxLength={500}
          defaultValue={initialUrl}
          placeholder="https://gemnao.pages.dev/..."
        />
      </label>
      <label>
        内容
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={8}
          placeholder="誤っている箇所、発生した症状、確認できる公式情報などを20文字以上で入力してください。"
        />
      </label>
      <label>
        返信先メールアドレス（任意）
        <input
          name="replyEmail"
          type="email"
          maxLength={254}
          autoComplete="email"
        />
        <small>個別返信が必要な場合だけ入力してください。</small>
      </label>
      <label className="contact-honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="contact-consent">
        <input type="checkbox" required />
        <span>
          <a href="/privacy" target="_blank">
            プライバシーポリシー
          </a>
          を確認し、入力内容の送信に同意します。
        </span>
      </label>
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? '送信中…' : '内容を送信する'}
      </button>
      {state === 'error' ? (
        <p className="contact-error" role="alert">
          送信できませんでした。入力内容を確認して、時間を置いて再度お試しください。
        </p>
      ) : null}
    </form>
  );
}
