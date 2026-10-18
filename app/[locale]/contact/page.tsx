/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { EnglishStaticPage } from '@/components/english-static-page';
import { ContactForm } from '@/components/contact-form';
import { englishEditorialMetadata } from '@/lib/localized/editorial-metadata';
const info = {
  title: 'Contact and Article Corrections',
  description:
    'Report incorrect or outdated instructions, rights matters or privacy concerns. You can submit without providing an email address.',
  checkedAt: '2026-10-18',
};
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ url?: string; category?: string }>;
};
export async function generateMetadata({ params }: Props) {
  return (await params).locale === 'en'
    ? englishEditorialMetadata('/contact', info)
    : {};
}
export default async function Page({ params, searchParams }: Props) {
  if ((await params).locale !== 'en') notFound();
  const { url = '', category } = await searchParams;
  const initialUrl =
    typeof url === 'string' && url.startsWith('https://gemnao.pages.dev/')
      ? url
      : '';
  return (
    <EnglishStaticPage path="/contact" {...info}>
      <div className="contact-guidance">
        <h2>Before sending</h2>
        <ul>
          <li>
            Do not include passwords, addresses, phone numbers or other
            sensitive information.
          </li>
          <li>Save files and executables cannot be attached.</li>
          <li>
            We may be unable to answer individual PC repair or gameplay
            requests.
          </li>
        </ul>
      </div>
      <section className="contact-guidance" id="business">
        <h2>Business and manufacturer inquiries</h2>
        <p>
          For product usage guides, corrections to official information or
          proposed testing with loan equipment, choose Business or manufacturer
          inquiry. Read the{' '}
          <a href="/en/about#business">
            scope, disclosure and editorial policy
          </a>{' '}
          first.
        </p>
        <ul>
          <li>
            Include the company/department, product, project purpose and desired
            timing.
          </li>
          <li>
            State any loan, supplied product or compensation, and proposed test
            conditions or publication venue where known.
          </li>
          <li>
            If you want a reply, provide a business email address. Do not send
            confidential or unreleased material before terms are agreed.
          </li>
        </ul>
      </section>
      <ContactForm
        locale="en"
        initialUrl={initialUrl}
        initialCategory={category === 'business' ? 'business' : 'correction'}
      />
    </EnglishStaticPage>
  );
}

export const generateStaticParams = () => [{ locale: "en" }];
