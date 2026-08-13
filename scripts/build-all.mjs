// 전체 재빌드 — 랜딩 페이지 → 칼럼 후처리 → 허브 → 피드 순서로 실행합니다.
// 사용: node scripts/build-all.mjs
// 순서가 중요합니다. seo-enhance 가 칼럼 HTML을 바꾸고, 허브와 피드가 그 결과를 읽습니다.
import { execFileSync } from 'node:child_process';

const steps = [
  ['scripts/build-pages.mjs', '핵심 랜딩 페이지'],
  ['scripts/seo-enhance.mjs', '칼럼 내부링크·발행일·스키마'],
  ['scripts/build-hubs.mjs', '지역·주제 허브'],
  ['scripts/generate-blog-feeds.js', '칼럼 목록·sitemap·RSS'],
];

for (const [script, label] of steps) {
  console.log(`\n▶ ${label} (${script})`);
  execFileSync(process.execPath, [script], { stdio: 'inherit' });
}
console.log('\n✔ 전체 빌드 완료');
