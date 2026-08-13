// 칼럼 후처리기 — 내부링크·발행일·스키마·트위터카드를 전 글에 통일 적용합니다.
// 사용: node scripts/seo-enhance.mjs
// 여러 번 실행해도 결과가 같도록(멱등) 마커 주석으로 감싼 구간만 교체합니다.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { SITE, esc } from './lib/site.mjs';
import { loadPosts, relatedFor, BLOG_DIR } from './lib/taxonomy.mjs';

const START = '<!-- seo-enhance:start -->';
const END = '<!-- seo-enhance:end -->';

const CSS = `<style>
.se-block{margin:34px 0 0;padding-top:26px;border-top:2px solid #e3e8ef}
.se-block h2{font-size:20px;color:#0d1728;margin:0 0 4px}
.se-block .se-note{color:#667085;font-size:14px;margin:0 0 16px}
.se-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin-bottom:24px}
.se-grid a{display:block;background:#fff;border:1px solid #e3e8ef;border-radius:10px;padding:14px 16px;text-decoration:none;color:#162033;font-size:14.5px;font-weight:700;line-height:1.6}
.se-grid a:hover{border-color:#c89a3d;box-shadow:0 8px 20px rgba(13,23,40,.07)}
.se-grid a em{display:block;font-style:normal;color:#8a6725;font-size:11.5px;font-weight:900;margin-bottom:5px}
.se-hubs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}
.se-hubs a{border:1px solid #dcc48b;background:#fffaf0;color:#674b15;border-radius:999px;padding:8px 14px;text-decoration:none;font-size:13px;font-weight:900}
.se-hubs a:hover{background:#f7edd7}
.se-pillar{background:#eef5ff;border:1px solid #c9ddfa;border-radius:12px;padding:18px 20px;margin:0 0 24px}
.se-pillar b{display:block;color:#0d1728;margin-bottom:6px}
.se-pillar p{margin:0;font-size:14.5px;color:#475467}
.se-pillar a{color:#1b3a63;font-weight:900}
</style>`;

const posts = loadPosts();
const bySlug = new Map(posts.map((p) => [p.slug, p]));
let changed = 0;

for (const post of posts) {
  const file = path.join(BLOG_DIR, post.file);
  let html = readFileSync(file, 'utf8');
  const before = html;

  // 이전 실행 결과 제거 (멱등성). 앞뒤 공백까지 함께 걷어내야 재실행 때 줄바꿈이 누적되지 않습니다.
  html = html.replace(new RegExp(`\\s*${START}[\\s\\S]*?${END}\\s*`, 'g'), '');

  /* ── 1. 관련글 블록 ─────────────────────────────────── */
  // 본문에 이미 손으로 걸어둔 링크는 중복으로 넣지 않습니다.
  const existing = new Set([...html.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]));
  const related = relatedFor(post, posts.filter((p) => !existing.has(p.slug)), 8);

  const hubs = [
    { href: `/blog/${post.region.key}/`, label: `${post.region.label}개인회생 칼럼` },
    { href: `/blog/topic/${post.topic.key}/`, label: post.topic.label },
    { href: '/blog/', label: '전체 칼럼' },
  ].filter((h) => h.href !== '/blog/common/');

  const block = `${START}
${CSS}
<div class="se-block">
<div class="se-pillar"><b>개인회생 절차 전체가 궁금하시다면</b>
<p>신청 자격, 변제금이 정해지는 방식, 변제기간, 절차별 소요기간과 준비서류를 한 페이지에 정리했습니다. → <a href="/jeonju-personal-rehabilitation/">전주개인회생 종합 안내</a> · <a href="/jeonju-personal-rehabilitation-cost/">비용 안내</a> · <a href="/jeonju-personal-bankruptcy/">개인파산 안내</a></p></div>
<div class="se-hubs">${hubs.map((h) => `<a href="${h.href}">${esc(h.label)}</a>`).join('')}</div>
<h2>${esc(post.region.label)}개인회생 · ${esc(post.topic.label)} 관련 칼럼</h2>
<p class="se-note">같은 주제에서 자주 함께 확인하는 글입니다.</p>
<div class="se-grid">
${related.map((r) => `<a href="${r.href}"><em>${esc(r.region.label)}개인회생 · ${esc(r.topic.label)}</em>${esc(r.title)}</a>`).join('\n')}
</div>
</div>
${END}`;

  // 삽입 위치: CTA 박스 바로 앞 (세 가지 템플릿 모두 공통으로 가지고 있는 앵커)
  if (html.includes('<div class="cta"')) {
    html = html.replace('<div class="cta"', `\n${block}\n<div class="cta"`);
  } else if (html.includes('</article>')) {
    html = html.replace('</article>', `\n${block}\n</article>`);
  }

  /* ── 2. 발행일 노출 통일 ────────────────────────────── */
  if (!/<time[^>]*datetime=/.test(html) && post.date) {
    const [y, m, d] = post.date.split('-');
    const human = `${y}년 ${Number(m)}월 ${Number(d)}일`;
    const timeTag = `<time datetime="${post.date}">${human}</time>`;
    if (html.includes(`최종 검토 ${post.date}`)) {
      html = html.replace(`최종 검토 ${post.date}`, `최종 검토 ${timeTag}`);
    } else if (/<div class="byline">/.test(html)) {
      html = html.replace('<div class="byline">', `<div class="byline"><span>최종 검토 ${timeTag}</span>`);
    } else if (/<\/h1>/.test(html)) {
      html = html.replace('</h1>', `</h1><div class="byline" style="margin-top:14px;color:#667085;font-size:13px">작성·검토 김기태 변호사 · 최종 검토 ${timeTag}</div>`);
    }
  }

  /* ── 3. BreadcrumbList 보강 ─────────────────────────── */
  if (!html.includes('BreadcrumbList')) {
    const crumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: '개인회생 칼럼', item: `${SITE}/blog/` },
        ...(post.region.key !== 'common'
          ? [{ '@type': 'ListItem', position: 3, name: `${post.region.label}개인회생`, item: `${SITE}/blog/${post.region.key}/` }]
          : []),
        { '@type': 'ListItem', position: post.region.key !== 'common' ? 4 : 3, name: post.title, item: `${SITE}${post.href}` },
      ],
    };
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(crumb)}</script>\n</head>`);
  }

  /* ── 4. 트위터 카드 · og 보강 ───────────────────────── */
  // 세로 인물사진(962x1280)은 소셜 카드에서 잘리므로 1200x630 전용 커버로 통일합니다.
  html = html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*kim-gitae-photo\.jpg(")/g, `$1${SITE}/og-cover.jpg$2`);
  if (html.includes('property="og:image"') && !html.includes('property="og:image:width"')) {
    html = html.replace(/(<meta property="og:image" content="[^"]*">)/, '$1<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">');
  }

  const metaAdd = [];
  if (!html.includes('name="twitter:card"')) {
    metaAdd.push(`<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(post.title)}"><meta name="twitter:description" content="${esc(post.description)}"><meta name="twitter:image" content="${SITE}/og-cover.jpg">`);
  }
  if (!html.includes('property="og:site_name"')) metaAdd.push('<meta property="og:site_name" content="법무법인 태앤규">');
  if (!html.includes('property="og:locale"')) metaAdd.push('<meta property="og:locale" content="ko_KR">');
  if (!html.includes('hreflang=')) metaAdd.push(`<link rel="alternate" hreflang="ko-KR" href="${SITE}${post.href}">`);
  if (!html.includes('rel="alternate" type="application/rss+xml"')) metaAdd.push(`<link rel="alternate" type="application/rss+xml" title="법무법인 태앤규 개인회생 칼럼 RSS" href="${SITE}/rss.xml">`);
  if (!html.includes('rel="icon"')) metaAdd.push('<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">');
  if (metaAdd.length) html = html.replace('</head>', `${metaAdd.join('')}\n</head>`);

  if (html !== before) {
    writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`Enhanced ${changed}/${posts.length} posts.`);
