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

// 같은 날짜로 예약된 글은 함께 낸다(2026-10-15 부터 평일 2편).
// 다만 밀린 날짜까지 한꺼번에 쏟지는 않는다 — 대량생성 신호가 된다.
// 그래서 "가장 오래된 하루치" 만 내고 나머지 날짜는 다음 실행으로 넘긴다.
due.sort((a, b) => a.at.localeCompare(b.at) || a.f.localeCompare(b.f));
const batch = due.filter((x) => x.at === due[0].at);
if (due.length > batch.length) {
  console.log(`발행일이 지난 글이 ${due.length}편입니다. 오늘은 ${due[0].at} 자 ${batch.length}편만 냅니다.`);
}

const titles = [];
for (const { f, draft, at } of batch) {

  if (fs.existsSync(path.join(BLOG, `${draft.slug}.html`))) {
    console.warn(`건너뜀 ${draft.slug} — 이미 발행된 글입니다. 큐에서만 제거합니다.`);
    if (!DRY) fs.rmSync(path.join(QUEUE, f));
    continue;
  }

  const { publishAt, ...rest } = draft;
  // date 는 publishAt 을 따른다. rest.date 를 우선하면 안 된다.
  //
  // 초안을 쓴 날이 date 로 박히는데, 예약일을 옮기면 publishAt 만 바뀌고 date 는 그대로다.
  // 그러면 10/13 에 나간 글이 datePublished 10/07 로 올라가고, 사이트맵 lastmod 도
  // 옛 날짜가 되어 (1) 검색엔진이 새 글로 보지 않고 (2) 발행 감시가 "멈췄다" 고 오탐한다.
  // 2026-10-13 에 실제로 그렇게 됐다 — 3편이 나갔는데 사이트맵 최신일이 10/07 이었다.
  const final = { ...rest, date: at || rest.date };
  const draftPath = path.join(DRAFTS, `${final.slug}.json`);

  if (DRY) {
    console.log(`[dry] ${final.slug} (${at}) — ${final.title}`);
    titles.push(final.title);
    continue;
  }

  fs.mkdirSync(DRAFTS, { recursive: true });
  fs.writeFileSync(draftPath, `${JSON.stringify(final, null, 2)}
`, 'utf8');
  execFileSync(process.execPath, ['scripts/author/render-article.mjs', draftPath], { stdio: 'inherit' });
  fs.rmSync(path.join(QUEUE, f));
  titles.push(final.title);
  console.log(`발행 ${final.slug} (${at})`);
}

emit(`published=${titles.length}`);
if (titles.length) emit(`summary=${titles.join(' / ').slice(0, 180)}`);
console.log(`
발행 ${titles.length}편, 큐 잔량 ${files.length - titles.length}편`);
