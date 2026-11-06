import { siteConfig } from '@/lib/site-config';

/** The existing editorial organization, with the public policy that identifies it. */
export const editorialAuthor = {
  '@type': 'Organization',
  '@id': `${siteConfig.url}/about#editorial-team`,
  name: 'ゲムなお編集部',
  alternateName: 'Gemnao Editorial Team',
  parentOrganization: { '@id': `${siteConfig.url}/#operator` },
  url: `${siteConfig.url}/about`,
};

export const editorialPublisher = { '@id': `${siteConfig.url}/#operator` };
