/**
 * 예약 칼럼 발행기 — node scripts/publish-queue.mjs [--dry]
 *
 * content/queue/*.json 중 publishAt 이 오늘(KST) 이하인 초안 한 편을
 *   1) content/drafts/<slug>.json 으로 옮기고
 *   2) scripts/author/render-article.mjs 로 렌더링한다
 * 이후 build-all.mjs 와 validate-content-quality.mjs 는 워크플로가 이어서 실행한다.
 *
 * 왜 이렇게 하나: 매일 칼럼을 쓰던 클라우드 예약 세션이 조용히 실패하는 날이 많았다.
 * 세션은 매일 실행됐는데 커밋이 들어오지 않아 발행이 끊겼다. 그래서 "글 쓰기"와
 * "글 내보내기"를 분리한다. 내보내기에는 LLM 이 끼지 않으므로 실패할 여지가 거의 없다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DRY = process.argv.includes('--dry');
const QUEUE = path.join('content', 'queue');
const DRAFTS = path.join('content', 'drafts');
const BLOG = path.join('cloudflare_pages_upload', 'blog');

const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
console.log(`KST 오늘 = ${today}`);

const out = process.env.GITHUB_OUTPUT;
const emit = (line) => {
  if (out) fs.appendFileSync(out, `${line}\n`);
};

if (!fs.existsSync(QUEUE)) {
  console.log('큐 폴더가 없습니다. 발행할 것이 없습니다.');
  emit('published=0');
  process.exit(0);
}

const files = fs.readdirSync(QUEUE).filter((f) => f.endsWith('.json')).sort();
const due = [];
for (const f of files) {
  const draft = JSON.parse(fs.readFileSync(path.join(QUEUE, f), 'utf8'));
  const at = String(draft.publishAt || draft.date || '').slice(0, 10);
  if (at && at <= today) due.push({ f, draft, at });
}

if (!due.length) {
  console.log(`발행일이 된 글이 없습니다. 큐에 ${files.length}편 남아 있습니다.`);
  emit('published=0');
  process.exit(0);
}

// 밀린 날짜가 여러 개여도 하루 한 편만 낸다. 한꺼번에 쏟으면 대량생성 신호가 된다.
due.sort((a, b) => a.at.localeCompare(b.at));
const [{ f, draft, at }] = due;

if (fs.existsSync(path.join(BLOG, `${draft.slug}.html`))) {
  console.warn(`건너뜀 ${draft.slug} — 이미 발행된 글입니다. 큐에서만 제거합니다.`);
  if (!DRY) fs.rmSync(path.join(QUEUE, f));
  emit('published=0');
  process.exit(0);
}

const { publishAt, ...rest } = draft;
const final = { ...rest, date: rest.date || at };
const draftPath = path.join(DRAFTS, `${final.slug}.json`);

if (DRY) {
  console.log(`[dry] ${final.slug} (${at}) — ${final.title}`);
  process.exit(0);
}

fs.mkdirSync(DRAFTS, { recursive: true });
fs.writeFileSync(draftPath, `${JSON.stringify(final, null, 2)}\n`, 'utf8');
execFileSync(process.execPath, ['scripts/author/render-article.mjs', draftPath], { stdio: 'inherit' });
fs.rmSync(path.join(QUEUE, f));

emit('published=1');
emit(`summary=${final.title.slice(0, 180)}`);
console.log(`\n발행 ${final.slug} (${at}), 큐 잔량 ${files.length - 1}편`);
