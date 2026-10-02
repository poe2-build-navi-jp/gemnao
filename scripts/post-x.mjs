// Post to the site's X account through the X API v2 (OAuth 1.0a user context).
//   node scripts/post-x.mjs "text"          preview only (length check)
//   node scripts/post-x.mjs "text" --yes    actually post
//   node scripts/post-x.mjs --file post.txt [--yes]
// Keys come from the environment only, never from Git:
//   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
// (an app with "Read and write" permission, tokens generated after that).
import { createHmac, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const post = args.includes('--yes');
const fileIndex = args.indexOf('--file');
const text = (
  fileIndex >= 0
    ? readFileSync(args[fileIndex + 1], 'utf8')
    : args.filter((arg) => !arg.startsWith('--'))[0] || ''
).trim();
if (!text) {
  console.error('Usage: node scripts/post-x.mjs "text" [--yes]');
  process.exit(1);
}

// X counts most CJK characters and emoji as 2 and every URL as 23 (max 280).
const urlPattern = /https?:\/\/\S+/g;
const narrow = (code) =>
  code <= 4351 ||
  (code >= 8192 && code <= 8205) ||
  (code >= 8208 && code <= 8223) ||
  (code >= 8242 && code <= 8247);
const weight =
  (text.match(urlPattern) || []).length * 23 +
  [...text.replace(urlPattern, '')].reduce(
    (sum, char) => sum + (narrow(char.codePointAt(0)) ? 1 : 2),
    0,
  );
console.log(`${text}\n---\nlength: ${weight}/280`);
if (weight > 280) {
  console.error('Too long for one post.');
  process.exit(1);
}
if (!post) {
  console.log('Preview only. Add --yes to post.');
  process.exit(0);
}

const env = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing environment variable ${name}`);
    process.exit(1);
  }
  return value;
};
const consumerKey = env('X_API_KEY');
const consumerSecret = env('X_API_SECRET');
const token = env('X_ACCESS_TOKEN');
const tokenSecret = env('X_ACCESS_TOKEN_SECRET');

const endpoint = 'https://api.x.com/2/tweets';
const encode = (value) =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
const oauth = {
  oauth_consumer_key: consumerKey,
  oauth_nonce: randomBytes(16).toString('hex'),
  oauth_signature_method: 'HMAC-SHA1',
  oauth_timestamp: String(Math.floor(Date.now() / 1000)),
  oauth_token: token,
  oauth_version: '1.0',
};
// A JSON body is not part of the OAuth 1.0a signature base string.
const params = Object.keys(oauth)
  .sort()
  .map((key) => `${encode(key)}=${encode(oauth[key])}`)
  .join('&');
const base = ['POST', encode(endpoint), encode(params)].join('&');
oauth.oauth_signature = createHmac(
  'sha1',
  `${encode(consumerSecret)}&${encode(tokenSecret)}`,
)
  .update(base)
  .digest('base64');
const authorization = `OAuth ${Object.keys(oauth)
  .sort()
  .map((key) => `${encode(key)}="${encode(oauth[key])}"`)
  .join(', ')}`;

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { Authorization: authorization, 'Content-Type': 'application/json' },
  body: JSON.stringify({ text }),
});
const body = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error('X API:', response.status, JSON.stringify(body));
  process.exit(1);
}
console.log(`Posted: https://x.com/i/web/status/${body.data.id}`);
