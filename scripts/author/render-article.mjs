// 변호사 문체 칼럼 렌더러 (taeandkyujeonju.com · 전주개인회생)
// 사용: node scripts/author/render-article.mjs content/drafts/<slug>.json
// 변호사가 직접 쓴 본문(초안 JSON)을 받아 메타·OG·JSON-LD·내부링크가 완비된
// cloudflare_pages_upload/blog/<slug>.html 파일로 변환합니다. 자동화 고지 문구는 넣지 않습니다.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const site = 'https://taeandkyujeonju.com';
const outBlog = 'cloudflare_pages_upload/blog';
const officialPhone = '0507-1336-5516';

const REGIONS = {
  jeonju: '전주', iksan: '익산', gunsan: '군산', common: '전북',
};
const regionLabel = (slug) => {
  if (/(^|-)jeonju-/.test(slug)) return '전주';
  if (/(^|-)iksan-/.test(slug)) return '익산';
  if (/(^|-)gunsan-/.test(slug)) return '군산';
  return '전북';
};

const esc = (v = '') => String(v)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const STYLE = `:root{--navy:#0d1728;--navy2:#16243c;--gold:#c89a3d;--gold-soft:#f7edd7;--ink:#162033;--muted:#667085;--line:#e3e8ef;--bg:#f5f7fa;--soft:#f8fafc}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:'Noto Sans KR',Arial,sans-serif;line-height:1.85;word-break:keep-all}.top{background:var(--navy);color:#fff}.wrap{max-width:920px;margin:auto;padding:0 22px}.top .wrap{min-height:66px;display:flex;align-items:center;justify-content:space-between}.top a{color:#fff;text-decoration:none}.brand{font-weight:900}.home-link{font-size:13px;color:#f0d68b!important}.page{padding:28px 0 72px}.crumb{font-size:13px;color:var(--muted);margin-bottom:16px}.crumb a{color:var(--muted);text-decoration:none}.article{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 20px 55px rgba(13,23,40,.08)}.head{padding:44px 48px 32px;background:linear-gradient(150deg,#fff 60%,#fbf6e8);border-bottom:1px solid var(--line)}.badge{display:inline-block;background:var(--gold-soft);color:#5d4312;border:1px solid #ecdba6;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:900}h1{font-size:clamp(27px,4.2vw,40px);line-height:1.34;letter-spacing:-.03em;margin:16px 0 18px;color:var(--navy)}.summary{background:var(--navy);color:#fff;border-left:5px solid var(--gold);padding:18px 20px;border-radius:10px;font-size:16.5px;font-weight:700}.byline{margin-top:16px;color:var(--muted);font-size:13px;display:flex;flex-wrap:wrap;gap:6px 16px}.body{padding:38px 48px 46px}.body h2{font-size:24px;line-height:1.42;letter-spacing:-.02em;margin:48px 0 14px;color:var(--navy)}.body h2:first-of-type{margin-top:26px}.body h3{font-size:18px;color:var(--navy);margin:22px 0 9px}.body p{margin:0 0 17px;font-size:16.5px}.body strong{color:var(--navy);font-weight:900}.body ul,.body ol{padding-left:22px;margin:0 0 17px}.body li{margin:6px 0}.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;margin:18px 0 24px;background:#fff}table{width:100%;border-collapse:collapse;min-width:600px}th,td{text-align:left;padding:14px 15px;border-bottom:1px solid var(--line);vertical-align:top}thead th{background:var(--navy);color:#fff;font-size:14px}tbody th{background:var(--soft);color:var(--navy);width:34%}tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}.infographic{margin:26px 0;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 10px 28px rgba(13,23,40,.06)}.infographic-h{background:var(--navy);color:#fff;padding:15px 22px;font-weight:900;font-size:15px}.ig-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}.ig-item{background:#fff;padding:20px;display:flex;gap:13px;align-items:flex-start}.ig-ic{flex-shrink:0;width:42px;height:42px;border-radius:50%;background:var(--gold-soft);border:1px solid #ecdba6;display:flex;align-items:center;justify-content:center;color:#9a7a1e}.ig-item b{display:block;color:var(--navy);font-size:15px;margin-bottom:4px}.ig-item .t{font-size:13.5px;color:#4b5563;line-height:1.6}.figure-note{color:var(--muted);font-size:12.5px;margin:-16px 0 24px;text-align:center}.callout,.warn{border-radius:12px;padding:20px 22px;margin:24px 0}.callout{background:#eef5ff;border:1px solid #c9ddfa}.warn{background:#fff2f3;border:1px solid #f1c8cd}.callout .label,.warn .label{display:inline-block;font-size:12px;font-weight:900;color:#755712;margin-bottom:7px}.callout b,.warn b{color:var(--navy)}.sources{margin-top:34px;padding-top:22px;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}.sources a{color:var(--navy2);font-weight:700}.faq{margin-top:12px}.faq details{border-top:1px solid var(--line);padding:15px 2px}.faq details:last-child{border-bottom:1px solid var(--line)}.faq summary{cursor:pointer;font-weight:850;color:var(--navy)}.faq p{margin:9px 0 2px;color:#475467}.cta{margin-top:32px;background:linear-gradient(135deg,var(--navy),var(--navy2));color:#fff;padding:24px;border-radius:12px}.cta b{font-size:17px}.cta a{display:inline-block;margin-top:10px;color:#111;background:#f0d68b;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:900}.disclaimer{margin-top:26px;padding-top:18px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}.foot{padding:28px 0;color:var(--muted);font-size:13px}@media(max-width:720px){.head{padding:34px 20px 26px}.body{padding:28px 20px 38px}.body p{font-size:16px;line-height:1.9;margin-bottom:18px}.body h2{font-size:21px;margin:38px 0 12px}.summary{font-size:15.5px;padding:16px}.ig-grid{grid-template-columns:1fr}table{min-width:0}th,td{padding:12px;font-size:14px}tbody th{width:40%}.callout,.warn{padding:16px 18px}}`;

export function renderArticle(draft) {
  const slug = draft.slug;
  const url = `${site}/blog/${slug}`;
  const region = regionLabel(slug);
  const publishDate = draft.date;
  const faqs = draft.faqs || [];
  const related = draft.related || [];

  const faqHtml = faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
  const relatedHtml = related.length
    ? `<div class="callout"><b>함께 보면 좋은 칼럼</b><ul>${related.map((r) => `<li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`).join('')}</ul></div>`
    : '';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: draft.title,
        description: draft.description,
        image: `${site}/kim-gitae-photo.jpg`,
        author: { '@type': 'Person', name: '김기태', jobTitle: '변호사', worksFor: { '@type': 'LegalService', name: '법무법인 태앤규' } },
        publisher: { '@type': 'LegalService', name: '법무법인 태앤규', url: site },
        datePublished: publishDate,
        dateModified: publishDate,
        mainEntityOfPage: url,
        about: ['전주개인회생', `${region}개인회생`],
        inLanguage: 'ko-KR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '전주개인회생 칼럼', item: `${site}/blog/` },
          { '@type': 'ListItem', position: 2, name: draft.title, item: url },
        ],
      },
      ...(faqs.length ? [{
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }] : []),
    ],
  };

  return `<!doctype html>
<html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(draft.title)} | 법무법인 태앤규</title>
<meta name="description" content="${esc(draft.description)}"><meta name="author" content="김기태 변호사">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${esc(draft.title)}"><meta property="og:description" content="${esc(draft.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/og-cover.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(draft.title)}"><meta name="twitter:description" content="${esc(draft.description)}"><meta name="twitter:image" content="${site}/og-cover.jpg">
<style>${STYLE}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head><body>
<header class="top"><div class="wrap"><div class="brand">법무법인 태앤규</div><a class="home-link" href="/blog/">개인회생 칼럼 →</a></div></header>
<main class="page"><div class="wrap"><nav class="crumb"><a href="/">홈</a> · <a href="/blog/">개인회생 칼럼</a> · ${esc(region)}개인회생</nav>
<article class="article"><header class="head"><span class="badge">${esc(region)} 개인회생 안내</span><h1>${esc(draft.title)}</h1><div class="summary">${esc(draft.lead)}</div><div class="byline"><span>작성·검토 김기태 변호사</span><span>최종 검토 ${publishDate}</span><span>상담지역 전주·완주·군산·익산</span></div></header>
<div class="body">
${draft.bodyHtml}
${relatedHtml}
${faqs.length ? `<h2>자주 묻는 질문</h2><div class="faq">${faqHtml}</div>` : ''}
<div class="sources"><b>공식 자료 확인</b><p><a href="https://www.law.go.kr/법령/채무자회생및파산에관한법률" target="_blank" rel="noopener">국가법령정보센터 · 채무자 회생 및 파산에 관한 법률</a> · <a href="https://jeonju.scourt.go.kr" target="_blank" rel="noopener">전주지방법원</a></p></div>
<div class="cta"><b>${esc(region)} 개인회생, 지금 상황에 맞는 준비 순서를 확인하세요.</b><br>채무목록, 소득, 재산, 최근 대출과 압류 여부를 함께 검토합니다.<br><a href="tel:${officialPhone}">${officialPhone} 상담</a></div>
<p class="disclaimer">이 글은 개인회생 절차에 관한 일반적인 정보 제공을 위한 것으로, 개별 사건에 대한 법률 자문이나 결과 보장이 아닙니다. 실제 진행은 채무·소득·재산 자료와 법령·법원 실무에 따라 달라질 수 있으므로 변호사 상담을 통해 확인하시기 바랍니다.</p>
</div></article></div></main>
<footer class="foot"><div class="wrap">© 법무법인 태앤규 · 전북 전주시 완산구 홍산남로 19 즐거운빌딩 3층 302호 · ${officialPhone}</div></footer>
</body></html>`;
}

const draftPath = process.argv[2];
if (draftPath) {
  if (!existsSync(draftPath)) { console.error(`Draft not found: ${draftPath}`); process.exit(1); }
  const draft = JSON.parse(readFileSync(draftPath, 'utf8'));
  const html = renderArticle(draft);
  const outPath = `${outBlog}/${draft.slug}.html`;
  writeFileSync(outPath, html, 'utf8');
  console.log(`Rendered ${outPath} (${html.length} bytes)`);
}
