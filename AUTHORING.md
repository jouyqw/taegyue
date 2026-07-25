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
6. 피드 재생성: `node scripts/generate-blog-feeds.js`
7. 품질 검증: `node scripts/validate-content-quality.mjs` — **반드시 통과**.
8. 커밋 & 푸시:
   ```
   git add cloudflare_pages_upload content/drafts
   git commit -m "전주개인회생 칼럼 발행: <오늘 날짜>"
   git push
   ```
   push 하면 Cloudflare 자동 배포 + GitHub Actions가 피드 갱신·검색엔진 제출을 처리합니다.

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
