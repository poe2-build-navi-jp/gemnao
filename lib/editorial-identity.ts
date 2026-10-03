import { siteConfig } from '@/lib/site-config';

/** The existing editorial organization, with the public policy that identifies it. */
export const editorialAuthor = {
  '@type': 'Organization',
  name: 'ゲムなお編集部',
  url: `${siteConfig.url}/about`,
};

export const editorialPublisher = { '@id': `${siteConfig.url}/#operator` };
