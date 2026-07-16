import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const blogDir = 'cloudflare_pages_upload/blog';
const files = readdirSync(blogDir).filter((name) => name.endsWith('.html') && name !== 'index.html');
const errors = [];

const textOf = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const titleOf = (html) => (html.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1]
  .replace(/\s*\|\s*법무법인 태앤규\s*$/i, '')
  .trim();

const words = (text) => new Set(text.toLowerCase().replace(/[^가-힣a-z0-9\s]/g, ' ').split(/\s+/).filter((word) => word.length > 1));
const similarity = (a, b) => {
  const left = words(a);
  const right = words(b);
  const common = [...left].filter((word) => right.has(word)).length;
  return common / Math.max(1, left.size + right.size - common);
};

const posts = files.map((file) => {
  const html = readFileSync(join(blogDir, file), 'utf8');
  const title = titleOf(html);
  const text = textOf(html);
  if (/^personal-rehabilitation-[123]-20\d{2}-/.test(file)) errors.push(`${file}: 대량 예약생성 형식의 파일명입니다.`);
  if (!title) errors.push(`${file}: title이 없습니다.`);
  if (!/<link\s+rel=["']canonical["']/i.test(html)) errors.push(`${file}: canonical이 없습니다.`);
  if (!/<meta\s+name=["']description["']/i.test(html)) errors.push(`${file}: description이 없습니다.`);
  if (text.length < 700) errors.push(`${file}: 본문이 너무 짧습니다(${text.length}자).`);
  return { file, title, text };
});

for (let i = 0; i < posts.length; i += 1) {
  for (let j = i + 1; j < posts.length; j += 1) {
    if (posts[i].title === posts[j].title) errors.push(`${posts[i].file}, ${posts[j].file}: 제목이 같습니다.`);
    const score = similarity(posts[i].text, posts[j].text);
    if (score >= 0.9) errors.push(`${posts[i].file}, ${posts[j].file}: 본문 유사도가 지나치게 높습니다(${score.toFixed(2)}).`);
  }
}

if (errors.length) {
  console.error(`Content quality check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Content quality check passed: ${posts.length} articles`);
