# 일일 칼럼 발행 플레이북 — taeandkyujeonju.com (전주개인회생)

이 문서는 매일 자동 세션(클라우드)이 그대로 따라 실행하는 지침입니다.
목표: **변호사가 직접 쓴 것 같은 고품질 전주개인회생 칼럼 3개**를 매일 발행.
자동화 티가 나는 문구는 **넣지 않습니다.**

## 매일 실행 순서

1. 저장소 루트에서 시작합니다. 오늘 날짜(KST, `YYYY-MM-DD`)를 확인합니다.
2. `cloudflare_pages_upload/blog/` 의 기존 파일명으로 이미 다룬 주제를 파악합니다.
3. `content/topic-bank.json` 에서 **아직 없는** 주제 3개를 고릅니다. 가능하면 지역(전주/익산/군산)·상황을 섞어 서로 다르게.
   - 후보가 소진되면 실제 상담에서 자주 나오는 새 주제를 직접 만듭니다(슬러그 중복 금지).
4. 각 글마다 `content/drafts/<slug>.json` 초안을 작성합니다(아래 형식·기준).
5. 렌더링: `node scripts/author/render-article.mjs content/drafts/<slug>.json`
6. 품질 검증: `node scripts/validate-content-quality.mjs` — **반드시 통과**.
7. 전체 재빌드: `node scripts/build-all.mjs`
8. 커밋 & 푸시:
   ```
   git add cloudflare_pages_upload content/drafts
   git commit -m "전주개인회생 칼럼 발행: <오늘 날짜>"
   git push
   ```
   push 하면 Cloudflare 자동 배포 + GitHub Actions가 후처리·허브·피드 갱신과 검색엔진 제출을 처리합니다.

> **발행 페이스**: 하루 3편씩 몰아서 올리지 마세요. 짧은 기간에 대량 발행하면 구글의
> 대량 생성 콘텐츠(scaled content abuse) 신호로 잡힐 수 있습니다. **주 2~3편**으로 나눠
> 발행하고, 남는 시간은 기존 글 보강에 쓰는 편이 순위에 유리합니다.

## 빌드 파이프라인

`scripts/build-all.mjs` 가 아래를 순서대로 실행합니다. 순서가 중요합니다.

| 순서 | 스크립트 | 하는 일 |
|---|---|---|
| 1 | `build-pages.mjs` | 핵심 랜딩 페이지 5종(`/jeonju-personal-rehabilitation/`, `-cost/`, `/jeonju-personal-bankruptcy/`, `/lawyer/`, `/location/`) |
| 2 | `seo-enhance.mjs` | 칼럼 전편에 관련글 8개·허브 링크·발행일 `<time>`·BreadcrumbList·트위터카드 주입 (**멱등**) |
| 3 | `build-hubs.mjs` | 지역 허브(`/blog/jeonju|iksan|gunsan/`)와 주제 허브(`/blog/topic/*/`) |
| 4 | `generate-blog-feeds.js` | 칼럼 목록·sitemap·RSS |

- 공용 헤더·푸터·스타일·스키마는 `scripts/lib/site.mjs` 한 곳에 있습니다.
- 지역·주제 분류와 관련글 선정 규칙은 `scripts/lib/taxonomy.mjs` 에 있습니다.
  새 주제 허브를 추가하려면 `TOPICS` 배열에 항목을 넣고, `generate-blog-feeds.js` 의
  `TOPIC_KEYS` 에도 같은 키를 추가해 sitemap에 실리도록 하세요.
- `seo-enhance.mjs` 는 `<!-- seo-enhance:start -->` ~ `:end` 마커 구간만 교체하므로
  몇 번을 다시 돌려도 결과가 같습니다. 본문에 손으로 걸어둔 `/blog/` 링크는 중복 추천에서 제외됩니다.

## 이미지

`kim-gitae-photo.webp`, `kim-gitae-photo-620.webp`, `taengyu-logo.webp`, `og-cover.jpg`(1200×630)는
저장소에 커밋된 산출물입니다. 원본 사진을 교체할 때만 다시 만들면 되고, 그때는 `sharp` 로
같은 파일명·규격으로 재생성해 주세요. OG 카드는 세로 인물사진이 아니라 반드시 `og-cover.jpg` 를 씁니다.

## 초안 JSON 형식

```json
{
  "slug": "jeonju-personal-rehabilitation-example",  // 영문·소문자·하이픈. 지역 접두사(jeonju-/iksan-/gunsan-) 권장. 절대 personal-rehabilitation-1-2026-... 같은 대량생성 형식 금지
  "date": "2026-07-25",
  "title": "전주개인회생 ...",                         // 제목에 전주개인회생/전주개인회생변호사 자연 포함
  "description": "45~160자 요약. 키워드 자연 포함.",
  "lead": "결론부터 말씀드리면, ...",
  "bodyHtml": "<p>...</p><h2>...</h2>...",
  "faqs": [{"q":"...","a":"..."}, ... 3개],
  "related": [{"href":"/blog/<기존 슬러그>","label":"..."}, ... 2개]
}
```

## 품질 기준

- **문체**: 변호사가 상담 경험으로 직접 쓰는 칼럼 톤. 정형화된 반복 금지.
- **가독성(모바일 우선)**: 한 문단 1~2문장. 문단을 자주 나눕니다.
- **분량**: 본문 텍스트 **2,000자 이상**(검증기 최소 700자이나 품질을 위해 2,000자+).
- **구조**: `<h1>`은 렌더러가 자동 생성하므로 bodyHtml에 넣지 말 것. `<h2>` 5~6개 권장.
- **비주얼 1개 이상**: `.infographic`·`.table-wrap`·`.callout`·`.warn` 중 최소 1개로 “깔끔하고 세련된 이미지”를 포함. 아이콘은 인라인 SVG(속성 홑따옴표).
- **키워드**: 전주개인회생/전주개인회생변호사를 자연스럽게 반복(스터핑 금지).
- **중복 방지**: 제목 중복 금지, 본문 유사도 90% 미만(검증기 자동 검사). 매번 다른 각도.
- **법률 준수**: 결과 보장·단정 금지. 일반적 정보 안내(렌더러가 하단 면책 자동 추가). 사례는 각색.
- **내부링크**: related는 실제 존재하는 슬러그로만.

## 비주얼 스니펫 예시 (인포그래픽)

```html
<div class="infographic"><div class="infographic-h">제목</div><div class="ig-grid">
  <div class="ig-item"><span class="ig-ic"><svg viewBox='0 0 24 24' width='21' height='21' fill='none' stroke='currentColor' stroke-width='1.8'><rect x='3.5' y='5' width='17' height='15.5' rx='2'/><path d='M3.5 9.5h17M8 3v4M16 3v4'/></svg></span><div><b>항목</b><span class="t">설명</span></div></div>
  ... (2~4개)
</div></div>
<p class="figure-note">▲ 캡션</p>
```

---

## ★ 품질 상향 기준 (2026-08 개정 · 구글/네이버 노출 최적화)

하루 1편을 "변호사가 직접 쓴 최고 품질"로 쓴다는 전제로, 아래를 이전 기준보다 우선한다.
검색엔진은 대량생성·중복·얕은 일반론을 저품질로 거르고, 개인회생 같은 YMYL 주제는 경험·전문성·신뢰(E-E-A-T)를 크게 본다. "많이"가 아니라 "깊이·독창"이 노출을 만든다.

1. **경험 신호(E-E-A-T)**: 도입부는 상담에서 실제로 자주 겪는 **구체적 장면 하나**로 연다. 서류·소득 유형·기간 같은 구체 정보를 담되 결과 보장·면책 확정·성공률 표현은 금지.
2. **GEO(AI 인용 대비)**: `<h2>`는 **이용자가 실제로 검색·질문하는 문장형**으로, 각 h2 첫 문단은 **요지부터 1~2문장으로 답**한 뒤 풀어쓴다.
3. **구조**: `<h2>` 5~6개, 결론요약(lead) 1개, 비주얼(`.infographic`/`.table-wrap`/`.callout`/`.warn`) **2종 이상**.
4. **분량**: 본문 텍스트 **2,400~3,000자**(검증기 하한 700자와 별개로 품질 목표를 상향).
5. **지역 특화 + 내부링크**: 선택한 지역(전주/익산/군산)의 상황을 구체적으로. 지역 필러 페이지 및 실제 존재하는 관련 글 2~3개로 연결. 깨진 링크 금지.
6. **각도 집중(중복 회피)**: 선택 주제의 `angle`만 파고들고 개인회생 일반론 반복 금지. 본문 유사도 90% 미만 반드시 통과. 막히면 각도·주제 교체.
7. **메타 품질**: title 중복 금지·지역 키워드 자연 포함, description 45~160자.

### 발행 전 자가 점검(모두 '예'여야 push)
- 도입부에 구체적 상담 장면이 있는가 / h2가 질문형이고 답부터인가
- 비주얼 2종 이상 / 본문 2,400자 이상인가
- 내부링크 2개 이상, 모두 실제 존재하는가
- 결과 보장·성공률·단정 표현이 없는가
- `build-all.mjs` → `validate-content-quality.mjs` 통과했는가
