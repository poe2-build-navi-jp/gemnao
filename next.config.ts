import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Put title, description, canonical and OGP in <head> for every visitor.
  // The default does this only for a fixed bot list, so LINE, Hatena
  // Bookmark, Bluesky and Googlebot received them inside <body>.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
