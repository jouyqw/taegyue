// 지역 허브(/blog/jeonju/ 등) · 주제 허브(/blog/topic/*/) 빌더
// 사용: node scripts/build-hubs.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { SITE, PHONE, KAKAO, page, sideCta, ctaBand, crumbHtml, esc, DISCLAIMER, faqLd, faqHtml } from './lib/site.mjs';
import { loadPosts, TOPICS, REGIONS } from './lib/taxonomy.mjs';

const OUT = 'cloudflare_pages_upload';
const HOME = { name: '홈', url: `${SITE}/` };
const BLOG = { name: '개인회생 칼럼', url: `${SITE}/blog/` };

const write = (p, html) => {
  mkdirSync(`${OUT}${p}`, { recursive: true });
  writeFileSync(`${OUT}${p}index.html`, html, 'utf8');
  console.log(`Built ${p} (${html.length} bytes)`);
};

const cards = (list) => `<div class="related-grid">${list.map((p) => `<a href="${p.href}"><span>${esc(p.region.label)}개인회생 · ${esc(p.topic.label)}</span>${esc(p.title)}</a>`).join('')}</div>`;

const itemListLd = (id, name, list) => ({
  '@type': 'ItemList',
  '@id': `${id}#itemlist`,
  name,
  numberOfItems: list.length,
  itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}${p.href}`, name: p.title })),
});

const posts = loadPosts();

/* ── 지역 허브 ───────────────────────────────────────────── */
const REGION_COPY = {
  jeonju: {
    h1: '전주개인회생 칼럼',
    lead: '전주지방법원 본원에 접수되는 개인회생 사건을 기준으로, 실제 상담에서 자주 나오는 질문을 정리한 칼럼 모음입니다.',
    body: `<h2>전주에서 개인회생을 준비한다면</h2>
<p>전주시(완산구·덕진구)에 주소를 둔 분의 개인회생 사건은 <strong>전주지방법원 본원</strong>에 접수됩니다. 김제시, 완주군, 임실군, 진안군, 무주군도 같은 본원 관할입니다.</p>
<p>전주 지역 상담에서 특히 자주 등장하는 쟁점은 세 가지입니다. 첫째는 <strong>전세·월세 보증금</strong>입니다. 보증금은 청산가치에 반영되기 때문에 소득이 비슷해도 변제 총액이 크게 달라집니다. 둘째는 <strong>자영업 소득</strong>입니다. 매출 전체를 소득으로 계산해 변제금이 과도하게 잡히는 실수가 잦습니다. 셋째는 <strong>급여압류가 임박한 상황</strong>에서의 신청 시점 판단입니다.</p>
<p>아래 칼럼은 이런 상황별로 무엇을 확인하고 어떤 자료를 준비해야 하는지 정리한 글입니다. 절차 전체 흐름은 <a href="/jeonju-personal-rehabilitation/">전주개인회생 종합 안내</a>에서 먼저 확인하시면 이해가 빠릅니다.</p>`,
  },
  iksan: {
    h1: '익산개인회생 칼럼',
    lead: '익산 거주자의 개인회생 사건은 전주지방법원 군산지원 관할입니다. 익산에서 자주 문의하시는 내용을 정리했습니다.',
    body: `<h2>익산에서 개인회생을 준비한다면</h2>
<p>익산시에 주소를 둔 분의 개인회생 사건은 전주가 아니라 <strong>전주지방법원 군산지원</strong>에 접수됩니다. &ldquo;전주가 더 가까운데&rdquo;라고 물으시는 경우가 많은데, 관할은 거리로 정해지지 않습니다.</p>
<p>다만 <strong>사건 접수 법원과 대리인 사무소 위치는 별개</strong>입니다. 군산지원 관할 사건이어도 전주에 있는 변호사에게 사건을 맡기는 데는 아무 문제가 없고, 실무상 서면으로 진행되는 부분이 대부분이라 이동 부담도 크지 않습니다.</p>
<p>익산 상담에서는 제조업·물류 종사자의 <strong>교대 근무 수당과 성과급 처리</strong>, 그리고 폐업 이후 남은 사업 채무를 어떻게 정리할지에 대한 문의가 많습니다. 관련 내용을 아래 칼럼에 정리했습니다.</p>`,
  },
  gunsan: {
    h1: '군산개인회생 칼럼',
    lead: '군산 거주자의 개인회생 사건은 전주지방법원 군산지원 관할입니다. 군산 상담에서 자주 나오는 쟁점을 모았습니다.',
    body: `<h2>군산에서 개인회생을 준비한다면</h2>
<p>군산시에 주소를 둔 분의 개인회생 사건은 <strong>전주지방법원 군산지원</strong>에서 담당합니다. 익산시도 같은 군산지원 관할입니다.</p>
<p>군산 상담에서 자주 나오는 쟁점은 <strong>소득의 계속성 소명</strong>입니다. 조선·자동차 협력업체 사정에 따라 소득이 크게 오르내린 이력이 있으면, 과거 평균과 현재 소득 중 어느 쪽을 기준으로 보아야 하는지가 문제됩니다. 최근 몇 달의 흐름과 앞으로의 근무 형태를 함께 설명할 자료가 필요합니다.</p>
<p>고령이거나 소득이 생계비 수준에 못 미치는 경우에는 개인회생 대신 <a href="/jeonju-personal-bankruptcy/">개인파산</a>을 먼저 검토하기도 합니다. 어느 쪽이 맞는지는 소득에서 생계비를 뺀 금액을 계산해 봐야 알 수 있습니다.</p>`,
  },
  common: null,
};

for (const region of REGIONS) {
  const list = posts.filter((p) => p.region.key === region.key);
  if (!list.length) continue;
  const copy = REGION_COPY[region.key];
  const path = `/blog/${region.key}/`;
  const trail = [HOME, BLOG, { name: `${region.label}개인회생`, url: `${SITE}${path}` }];
  const body = `<section class="phero"><div class="wrap">
<span class="eyebrow">${region.label} · 개인회생 법률칼럼 ${list.length}편</span>
<h1>${copy.h1}</h1>
<p class="lead">${copy.lead}</p>
<div class="phero-cta"><a class="btn gold" href="tel:${PHONE}">${PHONE} 전화상담</a><a class="btn ghost" href="${KAKAO}" target="_blank" rel="noopener">카카오톡 상담</a><a class="btn ghost" href="/jeonju-personal-rehabilitation/">개인회생 종합 안내</a></div>
</div></section>
<div class="wrap">
${crumbHtml(trail)}
<div class="layout">
<article class="main">
${copy.body}
<h2>${region.label}개인회생 칼럼 ${list.length}편</h2>
${cards(list)}
<h2>주제별로 찾아보기</h2>
<div class="related-grid">${TOPICS.map((t) => `<a href="/blog/topic/${t.key}/"><span>주제별</span>${esc(t.label)}</a>`).join('')}</div>
${ctaBand(`${region.label} 개인회생, 지금 상황부터 확인하세요.`, '채무 총액과 월 소득, 재산 상황만 알려주셔도 신청 가능성과 방향은 잡아 드릴 수 있습니다.')}
${DISCLAIMER}
</article>
${sideCta([{ href: '/jeonju-personal-rehabilitation/', label: '전주개인회생 종합 안내' }])}
</div></div>`;

  write(path, page({
    path,
    title: `${region.label}개인회생 법률칼럼 | 법무법인 태앤규`,
    description: `${copy.lead} 신청 자격, 변제금, 소득 증빙, 재산 검토, 압류 대응까지 ${list.length}편의 칼럼을 주제별로 정리했습니다.`,
    keywords: `${region.label}개인회생, ${region.label}개인회생변호사, ${region.label} 개인회생 상담`,
    trail,
    ld: [itemListLd(`${SITE}${path}`, `${region.label}개인회생 칼럼`, list), {
      '@type': 'CollectionPage', '@id': `${SITE}${path}#collection`, name: `${region.label}개인회생 칼럼`, inLanguage: 'ko-KR',
    }],
    body,
  }));
}

/* ── 주제 허브 ───────────────────────────────────────────── */
for (const topic of TOPICS) {
  const list = posts.filter((p) => p.topic.key === topic.key);
  if (!list.length) continue;
  const path = `/blog/topic/${topic.key}/`;
  const trail = [HOME, BLOG, { name: topic.label, url: `${SITE}${path}` }];
  const byRegion = REGIONS.map((r) => ({ r, items: list.filter((p) => p.region.key === r.key) })).filter((g) => g.items.length);
  const common = list.filter((p) => p.region.key === 'common');

  const body = `<section class="phero"><div class="wrap">
<span class="eyebrow">주제별 칼럼 ${list.length}편</span>
<h1>${esc(topic.title)}</h1>
<p class="lead">${esc(topic.intro)}</p>
<div class="phero-cta"><a class="btn gold" href="tel:${PHONE}">${PHONE} 전화상담</a><a class="btn ghost" href="/jeonju-personal-rehabilitation/">개인회생 종합 안내</a></div>
</div></section>
<div class="wrap">
${crumbHtml(trail)}
<div class="layout">
<article class="main">
<h2>${esc(topic.label)} &mdash; 무엇을 확인해야 하나</h2>
<p>${esc(topic.intro)}</p>
<ol class="steps">
${topic.points.map(([head, detail]) => `<li><b>${head}</b><span>${detail}</span></li>`).join('\n')}
</ol>
<p>이 주제로 정리한 칼럼 ${list.length}편을 지역별로 모았습니다. 절차 전체 흐름과 신청 자격은 <a href="/jeonju-personal-rehabilitation/">전주개인회생 종합 안내</a>에, 비용 구조는 <a href="/jeonju-personal-rehabilitation-cost/">비용 안내</a>에 정리해 두었습니다.</p>
${byRegion.map((g) => `<h2>${esc(g.r.label)}개인회생 · ${esc(topic.label)}</h2>${cards(g.items)}`).join('\n')}
${common.length ? `<h2>지역 공통 안내</h2>${cards(common)}` : ''}
<h2>${esc(topic.label)} 자주 묻는 질문</h2>
${faqHtml(topic.faqs)}
<h2>다른 주제도 함께 보기</h2>
<div class="related-grid">${TOPICS.filter((t) => t.key !== topic.key).map((t) => `<a href="/blog/topic/${t.key}/"><span>주제별</span>${esc(t.label)}</a>`).join('')}</div>
${ctaBand('상황에 맞는 준비 순서를 확인하세요.', '어떤 자료부터 정리해야 하는지 상담에서 순서를 잡아 드립니다.')}
${DISCLAIMER}
</article>
${sideCta([{ href: '/blog/jeonju/', label: '전주개인회생 칼럼' }, { href: '/blog/iksan/', label: '익산개인회생 칼럼' }, { href: '/blog/gunsan/', label: '군산개인회생 칼럼' }])}
</div></div>`;

  write(path, page({
    path,
    title: `${topic.title} | 전주개인회생 법률칼럼`,
    description: topic.desc,
    keywords: `전주개인회생 ${topic.label}, ${topic.label}, 개인회생 ${topic.label}`,
    trail,
    ld: [itemListLd(`${SITE}${path}`, topic.title, list), faqLd(topic.faqs), {
      '@type': 'CollectionPage', '@id': `${SITE}${path}#collection`, name: topic.title, inLanguage: 'ko-KR',
    }],
    body,
  }));
}

console.log(`\nDone. ${posts.length} posts indexed.`);
