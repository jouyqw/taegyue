const fs = require('fs');
const path = require('path');

const site = 'https://taeandkyujeonju.com';
const outDir = 'cloudflare_pages_upload';
const blogDir = path.join(outDir, 'blog');
const today = new Date().toISOString().slice(0, 10);

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const stripHtml = (value = '') => String(value)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const match = (html, regex) => (html.match(regex) || [])[1]?.trim() || '';

const blogFiles = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter((file) => file.endsWith('.html') && file !== 'index.html').sort()
  : [];

const posts = blogFiles.map((file) => {
  const fullPath = path.join(blogDir, file);
  const html = fs.readFileSync(fullPath, 'utf8');
  const slug = file.replace(/\.html$/, '');
  const url = `${site}/blog/${slug}`;
  const rawTitle = match(html, /<title>([\s\S]*?)<\/title>/i)
    || match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
    || slug;
  const title = stripHtml(rawTitle).replace(/\s*\|\s*법무법인[\s\S]*$/i, '');
  const description = match(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    || stripHtml(match(html, /<article[^>]*>([\s\S]*?)<\/article>/i)).slice(0, 180);
  const date = match(html, /"datePublished"\s*:\s*"([^"]+)"/i)
    || match(html, /<time[^>]*datetime=["']([^"']+)["']/i)
    || today;
  const lastmod = match(html, /"dateModified"\s*:\s*"([^"]+)"/i) || date;
  return { file, slug, url, title, description, date, lastmod };
}).sort((a, b) => b.date.localeCompare(a.date) || a.file.localeCompare(b.file));

const REGIONS = [
  { key: 'jeonju', label: '전주', re: /(^|-)jeonju-/ },
  { key: 'iksan', label: '익산', re: /(^|-)iksan-/ },
  { key: 'gunsan', label: '군산', re: /(^|-)gunsan-/ },
];
const regionOf = (slug) => REGIONS.find((r) => r.re.test(slug)) || { key: 'common', label: '공통' };

const catCounts = {};
posts.forEach((post) => { const k = regionOf(post.slug).key; catCounts[k] = (catCounts[k] || 0) + 1; });
const CHIP_DEFS = [
  { key: 'all', label: '전체' },
  { key: 'jeonju', label: '전주' },
  { key: 'iksan', label: '익산' },
  { key: 'gunsan', label: '군산' },
  { key: 'common', label: '공통' },
];
const chipsHtml = CHIP_DEFS
  .filter((c) => c.key === 'all' || catCounts[c.key])
  .map((c, i) => `<button class="chip${i === 0 ? ' active' : ''}" type="button" data-cat="${c.key}">${c.label}${c.key === 'all' ? '' : ` <b>${catCounts[c.key]}</b>`}</button>`)
  .join('\n            ');

const itemListLd = `<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: '전주·익산·군산 개인회생 법률칼럼', itemListElement: posts.map((post, i) => ({ '@type': 'ListItem', position: i + 1, url: post.url, name: post.title })) })}
</script>`;

const blogCards = posts.length
  ? posts.map((post) => {
      const region = regionOf(post.slug);
      const text = `${post.title} ${post.description}`.toLowerCase();
      return `        <a class="card" data-cat="${region.key}" data-text="${escapeXml(text)}" href="/blog/${post.slug}">
          <span class="card-region">${escapeXml(region.label)}개인회생</span>
          <span class="card-date">${escapeXml(post.date)}</span>
          <h2>${escapeXml(post.title)}</h2>
          <p>${escapeXml(post.description)}</p>
        </a>`;
    }).join('\n')
  : '        <div class="empty">아직 등록된 칼럼이 없습니다.</div>';

const filterScript = `<script>
(function(){
  var cards = [].slice.call(document.querySelectorAll('#blogGrid .card'));
  var search = document.getElementById('blogSearch');
  var clearBtn = document.getElementById('blogSearchClear');
  var chips = [].slice.call(document.querySelectorAll('#blogCats .chip'));
  var countEl = document.getElementById('blogCount');
  var emptyEl = document.getElementById('blogEmpty');
  var activeCat = 'all';
  function apply(){
    var q = (search ? search.value : '').trim().toLowerCase().replace(/\\s+/g,'');
    var shown = 0;
    cards.forEach(function(card){
      var cat = card.getAttribute('data-cat') || '';
      var text = (card.getAttribute('data-text') || '').replace(/\\s+/g,'');
      var show = (activeCat === 'all' || cat === activeCat) && (!q || text.indexOf(q) !== -1);
      card.style.display = show ? '' : 'none';
      if(show) shown++;
    });
    if(countEl) countEl.textContent = '총 ' + shown + '개 칼럼';
    if(emptyEl) emptyEl.style.display = shown ? 'none' : 'block';
    if(clearBtn) clearBtn.style.display = (search && search.value) ? 'flex' : 'none';
  }
  if(search) search.addEventListener('input', apply);
  if(clearBtn) clearBtn.addEventListener('click', function(){ search.value=''; search.focus(); apply(); });
  chips.forEach(function(chip){ chip.addEventListener('click', function(){
    chips.forEach(function(o){ o.classList.remove('active'); });
    chip.classList.add('active');
    activeCat = chip.getAttribute('data-cat') || 'all';
    apply();
  }); });
  apply();
})();
</script>`;

const blogIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>전주·익산·군산 개인회생 법률칼럼 | 법무법인 태앤규</title>
<meta name="description" content="전주개인회생, 익산개인회생, 군산개인회생의 신청조건, 변제금, 최근 대출, 압류 대응과 준비서류를 설명하는 법률칼럼입니다.">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${site}/blog/">
<link rel="alternate" type="application/rss+xml" title="법무법인 태앤규 칼럼 RSS" href="${site}/rss.xml">
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,'Noto Sans KR',sans-serif;background:#f5f6f8;color:#151b28;line-height:1.75}.top{background:#0d1728;color:#fff}.wrap{max-width:1080px;margin:0 auto;padding:0 22px}.top .wrap{min-height:72px;display:flex;align-items:center;justify-content:space-between}.brand{font-weight:900}.top a{color:#fff;text-decoration:none;font-size:14px}.hero{background:#fff;border-bottom:1px solid #e5e8ef}.hero .wrap{padding:58px 22px 46px}.badge{display:inline-block;background:#f0d68b;color:#2b210b;border-radius:4px;padding:6px 11px;font-size:12px;font-weight:900;margin-bottom:18px}h1{font-family:Georgia,'Noto Serif KR',serif;font-size:clamp(30px,4vw,46px);line-height:1.28;margin:0 0 14px}.lead{max-width:760px;color:#667085;font-size:17px;margin:0}.region-nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}.region-nav a{border:1px solid #dcc48b;background:#fffaf0;color:#674b15;border-radius:999px;padding:8px 12px;text-decoration:none;font-size:13px;font-weight:900}.section{padding:42px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}.card{display:block;background:#fff;border:1px solid #e5e8ef;border-radius:10px;padding:24px;text-decoration:none;color:#151b28;box-shadow:0 10px 30px rgba(13,23,40,.06)}.card:hover{border-color:#d4a64e;transform:translateY(-2px)}.card span{display:block;color:#8a6725;font-size:13px;font-weight:900;margin-bottom:10px}.card h2{font-size:20px;line-height:1.45;margin:0 0 10px}.card p{font-size:14px;color:#667085;margin:0}.empty{background:#fff;border:1px dashed #cbd5e1;border-radius:10px;padding:28px;color:#667085}.footer{padding:34px 0;color:#667085;font-size:13px}
.toolbar{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;margin-bottom:20px}
.search{position:relative;flex:1 1 300px;max-width:440px}
.search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#98a2b3;pointer-events:none}
.search input{width:100%;border:1px solid #d5dae3;border-radius:999px;padding:12px 40px 12px 42px;font-size:14px;font-family:inherit;background:#fff}
.search input:focus{outline:none;border-color:#d4a64e;box-shadow:0 0 0 3px rgba(212,166,78,.18)}
#blogSearchClear{display:none;position:absolute;right:10px;top:50%;transform:translateY(-50%);width:24px;height:24px;border:0;border-radius:50%;background:#e7ebf1;color:#475467;font-size:16px;line-height:1;cursor:pointer;align-items:center;justify-content:center}
#blogSearchClear:hover{background:#d4a64e;color:#fff}
.cats{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid #dcdfe6;background:#fff;color:#475467;border-radius:999px;padding:9px 15px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:6px;transition:border-color .15s,color .15s,background .15s}
.chip:hover{border-color:#d4a64e;color:#0d1728}
.chip.active{background:#0d1728;border-color:#0d1728;color:#fff}
.chip b{opacity:.55;font-size:11px;font-weight:800}
.chip.active b{opacity:.85}
.count{color:#8a6725;font-size:13px;font-weight:800;margin:0 0 16px}
.card{position:relative}
.card .card-region{display:inline-block;background:#0d1728;color:#f0d68b;border-radius:999px;padding:3px 11px;font-size:11px;font-weight:900;margin-bottom:12px}
.card .card-date{display:block;color:#8a6725;font-size:12px;font-weight:800;margin-bottom:8px}
@media(max-width:720px){.toolbar{flex-direction:column;align-items:stretch}.search{max-width:none}.cats{overflow-x:auto;flex-wrap:nowrap;padding-bottom:3px}.chip{flex:0 0 auto}}
</style>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CollectionPage","name":"전주·익산·군산 개인회생 법률칼럼","url":"${site}/blog/","inLanguage":"ko-KR","about":["전주개인회생","익산개인회생","군산개인회생"],"publisher":{"@type":"LegalService","@id":"${site}/#legalservice","name":"법무법인 태앤규","url":"${site}/"}}
</script>
${itemListLd}
</head>
<body>
<header class="top"><div class="wrap"><div class="brand">법무법인 태앤규 칼럼</div><a href="/">공식 홈페이지</a></div></header>
<main>
  <section class="hero"><div class="wrap"><span class="badge">LEGAL COLUMN</span><h1>전주·익산·군산 개인회생 법률칼럼</h1><p class="lead">개인회생 신청조건, 변제금, 소득자료, 최근 대출과 압류 대응 등 실제 상담에서 자주 묻는 질문을 지역별로 정리합니다.</p><nav class="region-nav" aria-label="지역별 개인회생 대표 안내"><a href="/">전주개인회생</a><a href="/blog/iksan-personal-rehabilitation-nearby-guide">익산개인회생</a><a href="/blog/gunsan-personal-rehabilitation-nearby-guide">군산개인회생</a></nav></div></section>
  <section class="section"><div class="wrap">
    <div class="toolbar">
      <div class="search">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="blogSearch" type="search" placeholder="제목·키워드로 검색 (예: 압류, 최근 대출, 재신청)" aria-label="칼럼 검색" autocomplete="off">
        <button type="button" id="blogSearchClear" aria-label="검색어 지우기">&times;</button>
      </div>
      <div class="cats" id="blogCats" role="tablist" aria-label="지역별 분류">
            ${chipsHtml}
      </div>
    </div>
    <p class="count" id="blogCount">총 ${posts.length}개 칼럼</p>
    <div class="grid" id="blogGrid">
${blogCards}
    </div>
    <div class="empty" id="blogEmpty" style="display:none">검색 결과가 없습니다. 다른 키워드나 지역을 선택해 보세요.</div>
  </div></section>
</main>
<footer class="footer"><div class="wrap">© 법무법인 태앤규. 본 칼럼은 일반적인 법률 정보이며 개별 사건의 결론을 보장하지 않습니다.</div></footer>
${filterScript}
</body>
</html>
`;

fs.mkdirSync(blogDir, { recursive: true });
fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndex);

const sitemapUrls = [
  { loc: `${site}/`, changefreq: 'weekly', priority: '1.0', lastmod: today },
  { loc: `${site}/blog/`, changefreq: 'weekly', priority: '0.8', lastmod: today },
  ...posts.map((post) => ({ loc: post.url, changefreq: 'monthly', priority: '0.9', lastmod: post.lastmod }))
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemapUrls.map((item) => [
    '  <url>',
    `    <loc>${escapeXml(item.loc)}</loc>`,
    `    <lastmod>${escapeXml(item.lastmod)}</lastmod>`,
    `    <changefreq>${item.changefreq}</changefreq>`,
    `    <priority>${item.priority}</priority>`,
    '  </url>'
  ].join('\n')).join('\n'),
  '</urlset>',
  ''
].join('\n');

const rssItems = posts.slice(0, 30).map((post) => [
  '    <item>',
  `      <title>${escapeXml(post.title)}</title>`,
  `      <link>${escapeXml(post.url)}</link>`,
  `      <guid isPermaLink="true">${escapeXml(post.url)}</guid>`,
  `      <description>${escapeXml(post.description)}</description>`,
  `      <pubDate>${new Date(`${post.date}T00:00:00+09:00`).toUTCString()}</pubDate>`,
  '    </item>'
].join('\n')).join('\n');

const rss = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0">',
  '  <channel>',
  '    <title>법무법인 태앤규 전주·익산·군산 개인회생 칼럼</title>',
  `    <link>${site}/blog/</link>`,
  '    <description>전주개인회생, 익산개인회생, 군산개인회생과 채무조정 법률칼럼</description>',
  '    <language>ko</language>',
  `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  rssItems,
  '  </channel>',
  '</rss>',
  ''
].join('\n');

fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(outDir, 'rss.xml'), rss);
console.log(`Generated blog index, sitemap with ${sitemapUrls.length} URLs, RSS with ${posts.length} items`);
