// 공용 사이트 상수·레이아웃 (taeandkyujeonju.com · 전주개인회생)
// 필러/서비스/허브 페이지가 동일한 헤더·푸터·스타일·스키마를 공유하도록 모아둔 모듈입니다.

export const SITE = 'https://taeandkyujeonju.com';
export const PHONE = '0507-1336-5516';
export const FIRM = '법무법인 태앤규';
export const LAWYER = '김기태';
export const ADDRESS = '전북 전주시 완산구 홍산남로 19 즐거운빌딩 3층 302호';
export const POSTAL = '54966';
export const BIZ_NO = '527-36-00479';
export const BAR = '전북지방변호사회';
export const KAKAO = 'https://pf.kakao.com/_vsGmn/chat';
export const NAVER_MAP = 'https://naver.me/Fy2SbxqM';
export const OG_IMAGE = `${SITE}/og-cover.jpg`;

export const esc = (v = '') => String(v)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// 구글 폰트: 실제 사용하는 웨이트만 로드합니다(기존 12웨이트 → 5웨이트).
export const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  + '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&family=Noto+Sans+KR:wght@400..900&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">';

export const FAVICONS = '<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">'
  + '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">';

export const STYLE = `:root{--navy:#0d1728;--navy2:#16243c;--gold:#c89a3d;--gold2:#f0d68b;--gold-soft:#f9f2e0;--ink:#162033;--muted:#667085;--line:#e3e8ef;--bg:#f5f7fa;--soft:#f8fafc}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:'Noto Sans KR',sans-serif;line-height:1.85;word-break:keep-all;-webkit-text-size-adjust:100%}
a{color:inherit}img{max-width:100%;height:auto}
.header{position:sticky;top:0;z-index:100;background:rgba(13,23,40,.97);border-bottom:1px solid rgba(212,166,78,.3);backdrop-filter:blur(10px)}
.head-in{max-width:1080px;height:64px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:14px}
.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;min-width:0}
.brand img{width:40px;height:40px;flex-shrink:0;background:#062748}
.brand-en{font-family:'Playfair Display',serif;letter-spacing:1.6px;font-size:12px;color:var(--gold2);line-height:1.2}
.brand-kr{font-size:12px;color:rgba(255,255,255,.72)}
.nav{display:flex;align-items:center;gap:2px}
.nav a{color:rgba(255,255,255,.84);font-size:13.5px;font-weight:700;padding:7px 10px;border-radius:4px;text-decoration:none;white-space:nowrap}
.nav a:hover{background:rgba(212,166,78,.16);color:var(--gold2)}
.nav a.call{background:var(--gold);color:#111;font-weight:900}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.crumb{font-size:13px;color:var(--muted);padding:18px 0 0}
.crumb a{color:var(--muted);text-decoration:none}.crumb a:hover{color:var(--navy)}
.phero{background:linear-gradient(150deg,#0d1728 0%,#16243c 62%,#1d3050 100%);color:#fff;padding:52px 0 56px;position:relative;overflow:hidden}
.phero::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 12% 14%,rgba(212,166,78,.18),transparent 34%);pointer-events:none}
.phero .wrap{position:relative;z-index:1}
.eyebrow{display:inline-block;border:1px solid rgba(212,166,78,.5);color:var(--gold2);padding:5px 12px;border-radius:999px;font-size:12px;font-weight:900;margin-bottom:16px}
h1{font-family:'Noto Serif KR',serif;font-size:clamp(28px,4.4vw,46px);line-height:1.3;letter-spacing:-.02em;font-weight:700}
.phero .lead{margin-top:18px;max-width:760px;color:rgba(255,255,255,.85);font-size:16.5px}
.phero-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:26px;max-width:820px}
.phero-facts div{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);border-radius:8px;padding:13px 15px}
.phero-facts b{display:block;color:var(--gold2);font-size:17px;line-height:1.3}
.phero-facts span{display:block;margin-top:3px;font-size:12.5px;color:rgba(255,255,255,.66)}
.phero-cta{display:flex;flex-wrap:wrap;gap:9px;margin-top:26px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:6px;font-weight:900;font-size:14px;text-decoration:none;border:1px solid transparent}
.btn.gold{background:var(--gold2);color:#1a1405;border-color:var(--gold2)}
.btn.ghost{background:rgba(255,255,255,.07);color:#fff;border-color:rgba(255,255,255,.34)}
.btn.solid{background:var(--navy);color:#fff;border-color:var(--navy)}
.btn.line{background:#fff;color:var(--navy);border-color:var(--line)}
.layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:34px;align-items:start;padding:36px 0 70px}
.main{background:#fff;border:1px solid var(--line);border-radius:14px;padding:38px 44px 46px;box-shadow:0 18px 46px rgba(13,23,40,.07)}
.main h2{font-family:'Noto Serif KR',serif;font-size:25px;line-height:1.42;color:var(--navy);margin:46px 0 14px;letter-spacing:-.02em;scroll-margin-top:80px}
.main h2:first-child{margin-top:0}
.main h3{font-size:18px;color:var(--navy);margin:26px 0 9px;font-weight:900}
.main p{margin:0 0 16px;font-size:16.5px}
.main ul,.main ol{padding-left:21px;margin:0 0 17px}.main li{margin:6px 0}
.main strong{color:var(--navy);font-weight:900}
.toc{background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:20px 22px;margin-bottom:34px}
.toc b{display:block;color:var(--navy);font-size:14px;margin-bottom:10px}
.toc ol{margin:0;padding-left:19px;columns:2;column-gap:26px}
.toc li{margin:4px 0;font-size:14px}
.toc a{color:#3d4a5f;text-decoration:none}.toc a:hover{color:var(--gold);text-decoration:underline}
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;margin:18px 0 26px;background:#fff}
table{width:100%;border-collapse:collapse;min-width:560px}
th,td{text-align:left;padding:13px 15px;border-bottom:1px solid var(--line);vertical-align:top;font-size:15px}
thead th{background:var(--navy);color:#fff;font-size:14px;font-weight:700}
tbody th{background:var(--soft);color:var(--navy);width:30%;font-weight:900}
tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}
.callout,.warn,.check{border-radius:12px;padding:19px 22px;margin:22px 0}
.callout{background:#eef5ff;border:1px solid #c9ddfa}
.warn{background:#fff2f3;border:1px solid #f1c8cd}
.check{background:var(--gold-soft);border:1px solid #ecdba6}
.callout b,.warn b,.check b{display:block;color:var(--navy);margin-bottom:7px}
.callout ul,.warn ul,.check ul{margin-bottom:0}
.steps{list-style:none;padding:0;margin:20px 0 26px;counter-reset:s}
.steps li{counter-increment:s;position:relative;padding:0 0 20px 46px;border-left:2px solid var(--line);margin-left:15px}
.steps li:last-child{border-left-color:transparent;padding-bottom:0}
.steps li::before{content:counter(s);position:absolute;left:-16px;top:-2px;width:31px;height:31px;border-radius:50%;background:var(--navy);color:var(--gold2);font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center}
.steps b{display:block;color:var(--navy);font-size:16.5px;margin-bottom:3px}
.steps span{display:block;color:#4b5563;font-size:14.5px;line-height:1.75}
.faq{margin-top:10px}
.faq details{border-top:1px solid var(--line);padding:15px 2px}
.faq details:last-of-type{border-bottom:1px solid var(--line)}
.faq summary{cursor:pointer;font-weight:900;color:var(--navy);font-size:16px}
.faq p{margin:9px 0 2px;color:#475467;font-size:15.5px}
.side{position:sticky;top:84px;display:grid;gap:14px}
.side-card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px;box-shadow:0 10px 28px rgba(13,23,40,.06)}
.side-card.dark{background:linear-gradient(140deg,var(--navy),var(--navy2));color:#fff;border-color:var(--navy)}
.side-card h3{font-size:15px;color:var(--navy);margin-bottom:11px;font-weight:900}
.side-card.dark h3{color:var(--gold2)}
.side-card p{font-size:13.5px;color:#4b5563;line-height:1.7;margin-bottom:12px}
.side-card.dark p{color:rgba(255,255,255,.8)}
.side-card .btn{width:100%;margin-bottom:7px;min-height:42px;font-size:13.5px}
.side-links{list-style:none;display:grid;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:9px;overflow:hidden}
.side-links li{background:#fff}
.side-links a{display:block;padding:11px 14px;font-size:14px;text-decoration:none;color:#3d4a5f;font-weight:700}
.side-links a:hover{background:var(--gold-soft);color:var(--navy)}
.related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:11px;margin:16px 0 26px}
.related-grid a{display:block;background:#fff;border:1px solid var(--line);border-radius:10px;padding:15px 17px;text-decoration:none;color:var(--ink);font-size:14.5px;font-weight:700;line-height:1.6}
.related-grid a:hover{border-color:var(--gold);box-shadow:0 8px 22px rgba(13,23,40,.07)}
.related-grid a span{display:block;color:#8a6725;font-size:11.5px;font-weight:900;margin-bottom:5px}
.cta-band{margin-top:40px;background:linear-gradient(135deg,var(--navy),var(--navy2));color:#fff;padding:28px 30px;border-radius:12px}
.cta-band b{display:block;font-size:18px;margin-bottom:7px;color:var(--gold2)}
.cta-band p{color:rgba(255,255,255,.82);font-size:15px;margin-bottom:16px}
.cta-band .btn{margin-right:8px;margin-bottom:8px}
.disclaimer{margin-top:28px;padding-top:18px;border-top:1px solid var(--line);color:var(--muted);font-size:13px;line-height:1.75}
.sitefoot{background:var(--navy);color:rgba(255,255,255,.62);padding:34px 0;font-size:13px;line-height:1.8}
.sitefoot a{color:var(--gold2);text-decoration:none}
.foot-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.foot-grid b{color:rgba(255,255,255,.88)}
.foot-legal{margin-top:22px;padding-top:16px;border-top:1px solid rgba(255,255,255,.12);font-size:12px;color:rgba(255,255,255,.44)}
@media(max-width:900px){.layout{grid-template-columns:minmax(0,1fr);gap:24px}.side{position:static}}
@media(max-width:720px){
 .nav a:not(.call){display:none}
 .main{padding:26px 20px 34px;border-radius:12px}
 .main h2{font-size:21px;margin:36px 0 12px}.main p{font-size:16px}
 .phero{padding:38px 0 42px}.toc ol{columns:1}
 table{min-width:0}th,td{padding:11px 12px;font-size:14px}tbody th{width:38%}
 .cta-band{padding:22px 20px}
}`;

export const header = (active = '') => {
  const item = (href, label) => `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<header class="header"><div class="head-in">
<a class="brand" href="/"><img src="/taengyu-logo.png" alt="${FIRM} 로고" width="40" height="40" decoding="async"><span><span class="brand-en">TAE &amp; KYU LAW</span><span class="brand-kr">${FIRM} 전주개인회생</span></span></a>
<nav class="nav" aria-label="주요 메뉴">
${item('/jeonju-personal-rehabilitation/', '전주개인회생')}
${item('/iksan-personal-rehabilitation/', '익산')}
${item('/gunsan-personal-rehabilitation/', '군산')}
${item('/jeonju-personal-rehabilitation-cost/', '비용')}
${item('/jeonju-personal-bankruptcy/', '개인파산')}
${item('/lawyer/', '변호사 소개')}
${item('/location/', '오시는 길')}
${item('/blog/', '칼럼')}
<a class="call" href="tel:${PHONE}">전화상담</a>
</nav></div></header>`;
};

export const footer = () => `<footer class="sitefoot"><div class="wrap">
<div class="foot-grid">
<div><b>${FIRM}</b><br>대표변호사 ${LAWYER}<br>(${POSTAL}) ${ADDRESS}<br>대표전화 <a href="tel:${PHONE}">${PHONE}</a><br>24시간 상담 접수</div>
<div><b>주요 안내</b><br><a href="/jeonju-personal-rehabilitation/">전주개인회생</a> · <a href="/iksan-personal-rehabilitation/">익산개인회생</a> · <a href="/gunsan-personal-rehabilitation/">군산개인회생</a><br><a href="/jeonju-personal-rehabilitation-cost/">개인회생 비용</a><br><a href="/jeonju-personal-bankruptcy/">전주개인파산</a> · <a href="/blog/">법률칼럼</a><br><a href="/lawyer/">변호사 소개</a> · <a href="/location/">오시는 길</a></div>
<div><b>지역별 칼럼</b><br><a href="/blog/jeonju/">전주개인회생</a> · <a href="/blog/iksan/">익산개인회생</a> · <a href="/blog/gunsan/">군산개인회생</a><br>전주 완산구·덕진구, 완주·김제·임실·진안·무주<br><a href="https://taeandkyu.com/" rel="noopener">전주변호사 법무법인 태앤규 본원</a></div>
</div>
<!-- TODO(운영자 확인 필요): 변호사 등록번호를 아래 줄에 추가해 주세요. -->
<div class="foot-legal">사업자등록번호 ${BIZ_NO} · 소속 ${BAR} · 광고책임변호사 ${LAWYER} 변호사<br>본 사이트의 게시물은 개인회생·개인파산 절차에 관한 일반적인 법률정보이며, 개별 사건의 결과를 보장하지 않습니다.<br>© ${FIRM}. All rights reserved. · 사이트 제작·운영 <a href="https://aubcompany.com/" rel="noopener">아비컴퍼니</a></div>
</div></footer>`;

export const legalServiceLd = () => ({
  '@type': 'LegalService',
  '@id': `${SITE}/#legalservice`,
  name: FIRM,
  url: `${SITE}/`,
  telephone: PHONE,
  logo: `${SITE}/taengyu-logo.png`,
  image: `${SITE}/kim-gitae-photo.jpg`,
  priceRange: '₩₩',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '완산구 홍산남로 19 즐거운빌딩 3층 302호',
    addressLocality: '전주시',
    addressRegion: '전북특별자치도',
    postalCode: POSTAL,
    addressCountry: 'KR',
  },
  areaServed: ['전주시', '완주군', '김제시', '익산시', '군산시', '임실군', '진안군', '무주군', '전북특별자치도'].map((n) => ({ '@type': 'AdministrativeArea', name: n })),
  employee: { '@type': 'Person', name: LAWYER, jobTitle: '대표변호사', memberOf: { '@type': 'Organization', name: BAR } },
  // 24시간 상담 접수 기준
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  }],
  sameAs: [NAVER_MAP, 'https://pf.kakao.com/_vsGmn', 'https://taeandkyu.com/'],
  hasMap: NAVER_MAP,
});

export const breadcrumbLd = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.url })),
});

export const faqLd = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const faqHtml = (faqs) => `<div class="faq">${faqs
  .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;

export const crumbHtml = (trail) => `<nav class="crumb" aria-label="현재 위치">${trail
  .map((t, i) => (i === trail.length - 1
    ? `<span>${esc(t.name)}</span>`
    : `<a href="${t.url.replace(SITE, '')}">${esc(t.name)}</a>`)).join(' · ')}</nav>`;

/**
 * 공통 페이지 셸. head 메타·OG·트위터카드·JSON-LD를 한 곳에서 통일합니다.
 */
export const page = ({ path, title, description, keywords, trail, ld = [], body, active }) => {
  const url = `${SITE}${path}`;
  const graph = { '@context': 'https://schema.org', '@graph': [legalServiceLd(), breadcrumbLd(trail), ...ld] };
  return `<!doctype html>
<html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">\n` : ''}<meta name="author" content="${LAWYER} 변호사">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ko-KR" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${FIRM}"><meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${OG_IMAGE}">
${FAVICONS}
${FONTS}
<style>${STYLE}</style>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head><body>
${header(active || path)}
<main>
${body}
</main>
${footer()}
</body></html>`;
};

export const sideCta = (extraLinks = []) => `<aside class="side">
<div class="side-card dark"><h3>상담 전 확인</h3><p>채무 총액, 월 소득, 재산, 최근 대출, 압류 진행 여부를 함께 정리하면 예상 변제금과 신청 가능성을 더 빠르게 검토할 수 있습니다.</p>
<a class="btn gold" href="tel:${PHONE}">${PHONE}</a>
<a class="btn ghost" href="${KAKAO}" target="_blank" rel="noopener">카카오톡 상담</a></div>
<div class="side-card"><h3>${LAWYER} 대표변호사</h3><p>변호사 17년 · ${BAR} · 前 전북경찰청 이의심사위원. 전주·완주·김제·익산·군산 채무자의 개인회생·개인파산 사건을 직접 검토합니다.</p><a class="btn line" href="/lawyer/">변호사 소개 보기</a></div>
<div class="side-card"><h3>함께 보면 좋은 안내</h3><ul class="side-links">
${[...extraLinks, { href: '/jeonju-personal-rehabilitation/', label: '전주개인회생 종합 안내' }, { href: '/iksan-personal-rehabilitation/', label: '익산개인회생 안내' }, { href: '/gunsan-personal-rehabilitation/', label: '군산개인회생 안내' }, { href: '/jeonju-personal-rehabilitation-cost/', label: '개인회생 비용·수임료' }, { href: '/jeonju-personal-bankruptcy/', label: '전주개인파산 안내' }, { href: '/blog/', label: '개인회생 법률칼럼' }, { href: '/location/', label: '오시는 길 · 전주지방법원' }]
    .filter((l, i, arr) => arr.findIndex((x) => x.href === l.href) === i)
    .map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}
</ul></div></aside>`;

export const ctaBand = (heading, text) => `<div class="cta-band"><b>${esc(heading)}</b><p>${esc(text)}</p>
<a class="btn gold" href="tel:${PHONE}">${PHONE} 전화상담</a><a class="btn ghost" href="${KAKAO}" target="_blank" rel="noopener">카카오톡 상담</a></div>`;

export const DISCLAIMER = '<p class="disclaimer">이 페이지는 개인회생·개인파산 절차에 관한 일반적인 법률정보를 제공하기 위한 것으로, 개별 사건에 대한 법률자문이나 결과 보장이 아닙니다. 실제 신청 가능 여부와 변제금은 채무 발생 경위, 소득·재산 자료, 법령과 법원 실무에 따라 달라질 수 있으므로 반드시 변호사 상담을 통해 확인하시기 바랍니다.</p>';
