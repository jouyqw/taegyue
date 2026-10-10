import { createSign } from 'node:crypto';

const siteUrl = 'https://taeandkyujeonju.com/';
const sitemapUrl = 'https://taeandkyujeonju.com/sitemap.xml';
const indexNowKey = '91a7460f8c9b4e8db4f2a13d67a0c5e2';

function base64url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function readSitemapUrls() {
  const response = await fetch(sitemapUrl, { headers: { 'cache-control': 'no-cache' } });
  if (!response.ok) throw new Error(`사이트맵을 읽지 못했습니다: ${response.status}`);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  if (!urls.length) throw new Error('사이트맵에 페이지 주소가 없습니다.');
  return urls;
}

async function submitIndexNow(urls) {
  const host = new URL(siteUrl).host;
  const body = JSON.stringify({
    host,
    key: indexNowKey,
    keyLocation: `${siteUrl}${indexNowKey}.txt`,
    // IndexNow에는 사이트맵 주소가 아니라 실제 칼럼 주소를 보낸다.
    urlList: urls,
  });

  // 허브(api.indexnow.org)만 쏘면 네이버 반영이 느리다. 네이버 직행도 함께 보낸다.
  // 구글은 IndexNow 를 받지 않으므로 사이트맵 제출이 따로 필요하다.
  const endpoints = ['https://api.indexnow.org/indexnow', 'https://searchadvisor.naver.com/indexnow'];

  let accepted = 0;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      });
      const ok = response.ok || response.status === 202;
      console.log(`IndexNow ${host} → ${endpoint}: ${response.status} ${response.statusText}`);
      if (ok) accepted += 1;
      else if (response.status !== 429) console.warn(await response.text());
    } catch (error) {
      console.warn(`IndexNow ${endpoint} 실패: ${error.message}`);
    }
  }

  // 한 곳이라도 받았으면 성공으로 본다. 한쪽이 죽었다고 전체를 세우지 않는다.
  if (!accepted) throw new Error('IndexNow 모든 엔드포인트 실패');
}

async function createGoogleAccessToken() {
  const rawJson = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!rawJson) {
    console.log('Google Search Console: GSC_SERVICE_ACCOUNT_JSON secret is missing, skipped.');
    return null;
  }

  const credentials = JSON.parse(rawJson);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: credentials.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(credentials.private_key);
  const jwt = `${unsigned}.${base64url(signature)}`;

  const response = await fetch(claim.aud, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Google token error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function submitGoogleSitemap() {
  const token = await createGoogleAccessToken();
  if (!token) return;

  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}` },
  });

  console.log(`Google sitemap ${sitemapUrl}: ${response.status} ${response.statusText}`);
  if (!response.ok && response.status !== 204) {
    // 권한이 아직 연결되지 않았더라도 네이버 제출까지 실패 처리하지 않는다.
    console.warn(`Google sitemap warning: ${await response.text()}`);
  }
}

const urls = await readSitemapUrls();
console.log(`사이트맵 URL ${urls.length}건`);
await submitIndexNow(urls);
await submitGoogleSitemap();
