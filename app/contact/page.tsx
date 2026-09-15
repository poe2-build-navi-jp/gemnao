import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'お問い合わせ・記事の訂正依頼',
  description:
    'ゲムなおへの記事訂正、権利関係、プライバシー、その他のお問い合わせ窓口です。',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url = '' } = await searchParams;
  const initialUrl = url.startsWith('https://gemnao.pages.dev/') ? url : '';
  return (
    <main>
      <WikiHeader />
      <article className="static-page contact-page">
        <p className="page-kicker">CONTACT</p>
        <h1>お問い合わせ・記事の訂正依頼</h1>
        <p className="page-lead">
          記事の誤り、古くなった手順、権利関係のご連絡を受け付けています。専用フォームのためメールアドレスなしでも送信できます。
        </p>
        <div className="contact-guidance">
          <h2>送信前にご確認ください</h2>
          <ul>
            <li>
              パスワード、住所、電話番号などの機密情報は入力しないでください。
            </li>
            <li>セーブデータや実行ファイルは添付できません。</li>
            <li>
              個別のPC修理やゲーム攻略の依頼には回答できない場合があります。
            </li>
          </ul>
        </div>
        <ContactForm initialUrl={initialUrl} />
      </article>
      <WikiFooter />
    </main>
  );
}
