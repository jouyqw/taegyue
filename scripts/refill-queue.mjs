/**
 * taeandkyujeonju.com/blog (전주개인회생) — 예약 큐 자동 보충
 *
 *   node scripts/refill-queue.mjs [--force N] [--check] [--git]
 *
 * content/queue/<slug>.json (초안 + publishAt) 을 채운다.
 * 발행은 publish-queue.yml 이 매일 하루 1건씩 queue→drafts→render 하고,
 * 이후 build-all.mjs·validate-content-quality.mjs 를 워크플로가 돌린다.
 * 여기서는 초안을 만들고 renderArticle·자체검증을 미리 돌려 통과분만 큐에 넣는다.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE = path.join(ROOT, 'content', 'queue');
const DRAFTS = path.join(ROOT, 'content', 'drafts');
const LOG = path.join(ROOT, 'refill.log');
const LOCK = path.join(ROOT, '.refill.lock');
const DESK = path.join(process.env.USERPROFILE || '', 'Desktop', '전주개인회생칼럼_보충_실패.txt');

const THRESHOLD = 6;
const TARGET = 12;
const MAX_ADD = 12;
const RETRY = 2;
const BATCH_TIMEOUT = 30 * 60 * 1000;
const REGIONS = ['jeonju', 'iksan', 'gunsan'];

const CLAUDE = [
  'C:\\Users\\c\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Anthropic.ClaudeCode_Microsoft.Winget.Source_8wekyb3d8bbwe\\claude.exe',
  'claude',
].find((p) => p === 'claude' || fs.existsSync(p));

const BANNED = ['면책 보장', '반드시 면책', '100%', '무조건', '확실히 탕감', '전액 탕감 보장'];

const stamp = () => new Date().toISOString().replace('T', ' ').slice(0, 19);
function log(m) { const l = `[${stamp()}] ${m}`; console.log(l); try { fs.appendFileSync(LOG, l + '\n'); } catch { } }
const unlock = () => { try { fs.rmSync(LOCK); } catch { } };
function fail(m, d = '') {
  log('!! ' + m); if (d) log(String(d).slice(0, 700));
  try { fs.writeFileSync(DESK, `${stamp()}\ntaeandkyujeonju.com/blog 큐 보충 실패\n\n${m}\n\n${String(d).slice(0, 1200)}\n\n확인: node scripts/refill-queue.mjs --check\n`); } catch { }
  unlock(); process.exit(1);
}
const sleep = (ms) => { try { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); } catch { } };
const len = (s) => [...String(s || '')].length;
const textOf = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const TODAY = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

const jsonSlugs = (dir) => (fs.existsSync(dir) ? new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))) : new Set());
const queueItems = () => (fs.existsSync(QUEUE) ? fs.readdirSync(QUEUE).filter((f) => f.endsWith('.json')) : []);

function validate(slug, known) {
  const f = path.join(QUEUE, `${slug}.json`);
  if (!fs.existsSync(f)) return [`${slug}.json 없음`];
  let d;
  try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return [`${slug} JSON 오류: ${e.message}`]; }
  const e = [];
  for (const k of ['slug', 'title', 'description', 'lead', 'bodyHtml', 'faqs', 'related', 'publishAt']) {
    if (d[k] === undefined || d[k] === '' || d[k] === null) e.push(`${k} 없음`);
  }
  if (e.length) return e.map((x) => `${slug}: ${x}`);
  if (d.slug !== slug) e.push('slug 불일치');
  if (!/^(jeonju|iksan|gunsan)-/.test(d.slug)) e.push('slug 지역 접두사 없음');
  if (len(d.title) > 50) e.push(`title 50자 초과(${len(d.title)})`);
  const desc = len(d.description);
  if (desc < 45 || desc > 160) e.push(`description ${desc}자(45~160)`);
  if (!Array.isArray(d.faqs) || d.faqs.length < 3) e.push('faqs 3개 미만');
  if (!Array.isArray(d.related) || d.related.length < 2) e.push('related 2개 미만');
  const bt = len(textOf(d.bodyHtml));
  if (bt < 2000) e.push(`본문 ${bt}자(최소 2000)`);
  const h2 = (String(d.bodyHtml).match(/<h2/g) || []).length;
  if (h2 < 4) e.push(`h2 ${h2}개(최소 4)`);
  if (!/class=['"]?(infographic|table-wrap|callout|warn)/.test(d.bodyHtml)) e.push('비주얼 블록 없음');
  if (!/전주개인회생/.test(String(d.bodyHtml) + d.title)) e.push('전주개인회생 키워드 없음');
  for (const w of BANNED) if (String(d.bodyHtml).includes(w) || String(d.title).includes(w)) e.push(`금지표현: ${w}`);
  if (known.titles.has(d.title)) e.push('제목 중복');
  for (const r of d.related || []) {
    const m = String(r.href || '').match(/^\/blog\/(.+?)\/?$/);
    if (!m) { e.push(`related href 형식: ${r.href}`); continue; }
    if (!known.published.has(m[1]) && !known.newSlugs.has(m[1])) e.push(`related 없는 글: ${r.href}`);
  }
  return e.map((x) => `${slug}: ${x}`);
}

function prompt(batch, known) {
  const recent = [...known.titles].slice(-40).map((t) => `- ${t}`).join('\n');
  const rows = batch.map((b) => `- 지역: ${b.region} / slug 접두사: ${b.region}- / publishAt: ${b.publishAt}`).join('\n');
  const relatable = [...known.published].slice(-40).map((s) => `/blog/${s}`).join('\n');
  return `너는 법무법인 태앤규(전주)의 전주개인회생 칼럼을 쓴다. taeandkyujeonju.com/blog 예약 큐에 ${batch.length}건을 채운다.

## 먼저 읽을 것
- AUTHORING.md — "★ 품질 상향 기준", 초안 JSON 형식, 비주얼 스니펫
- content/topic-bank.json — 주제 후보. content/drafts 에 이미 있는 slug 주제는 피한다.

## 이번에 쓸 초안 (각 줄이 파일 하나: content/queue/<slug>.json)
${rows}

## 형식 (category·keyword 필드는 없다)
{ "slug": "<지역>-...", "publishAt": "<위 날짜>", "date": "<위 날짜>",
  "title": "전주개인회생 자연 포함, 50자 이하", "description": "45~160자",
  "lead": "결론부터 한두 문장", "bodyHtml": "<p>..</p><h2>..</h2>..",
  "faqs":[{"q","a"}x3], "related":[{"href":"/blog/<실제 슬러그>","label"}x2] }

## 품질(발행일 validate-content-quality 를 통과해야 하니 미리 지킨다)
- 본문 텍스트 2,400~3,000자. <h2> 5~6개(질문형, 첫 문단은 요지부터).
- 비주얼 2종 이상을 bodyHtml 에 반드시 넣는다(class 이름 유지):
  · <div class="callout"><span class="label">핵심</span><p>내용</p></div>
  · <div class="warn"><span class="label">주의</span><p>내용</p></div>
  · <div class="table-wrap"><table>...</table></div>
  · <div class="infographic">...</div> (svg 속성만 홑따옴표)
- 도입부는 상담에서 겪는 구체적 장면 하나로. 짧은 문단(1~2문장), 모바일 가독성 우선.
- 전주개인회생/전주개인회생변호사를 본문에 자연스럽게 반복(스터핑 금지). 지역(전주/익산/군산) 상황을 구체적으로.
- 면책·탕감 보장이나 단정 표현 금지.
- related 는 아래 "실제 존재하는 글" 에서만 고른다(깨진 링크 금지):
${relatable}
- slug 은 영문 소문자·하이픈, 지역 접두사 필수, 날짜 붙이지 말 것. 기존과 중복 금지.

## 기존 제목(겹치지 않게)
${recent}

## 하지 말 것
- render/git/build 등 명령 실행 금지. content/queue 의 JSON 만 쓴다. 기존 파일 수정 금지.

다 쓰면 파일명만 한 줄씩 출력하고 끝내라.`;
}

function runClaude(text) {
  for (let t = 1; t <= 3; t += 1) {
    const res = spawnSync(CLAUDE, ['-p', text, '--permission-mode', 'acceptEdits', '--allowedTools', 'Read,Write,Glob,Grep'],
      { cwd: ROOT, encoding: 'utf8', timeout: BATCH_TIMEOUT, maxBuffer: 64 * 1024 * 1024, windowsHide: true });
    if (!res.error && res.status === 0) return res;
    const why = String(res.stderr || res.stdout || res.error?.message || '').trim().slice(-300);
    log(`  !! claude 호출 실패 (${res.status ?? 'error'}) ${t}/3 — ${why}`);
    if (t < 3) { log('  60초 쉬었다가 다시'); sleep(60000); }
  }
  return null;
}

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const GIT = argv.includes('--git');
const fi = argv.indexOf('--force');
const FORCE = fi >= 0 ? Math.max(1, Math.min(MAX_ADD, Number(argv[fi + 1]) || 1)) : 0;
const git = (a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

fs.mkdirSync(QUEUE, { recursive: true });

// 원격을 세기 전에 먼저 반영한다.
// 예전에는 큐를 센 뒤 "보충 불필요"로 조기 종료한 다음에야 당겨왔다. 그래서 보충이 필요 없는
// 날에는 로컬이 영영 뒤처지고, publish-queue 가 매일 원격에서 한 편씩 빼가는데도 로컬 큐 개수는
// 그대로라 기준 미만으로 내려가질 않았다. 실제 큐가 0이 될 때까지 보충이 한 번도 안 돈다.
if (GIT) {
  try { git(['fetch', 'origin', 'main']); git(['merge', '--ff-only', 'origin/main']); log('원격 반영'); }
  catch (e) { fail('원격과 갈라짐', String(e.stdout || e.message)); }
}

let qn = queueItems().length;
log(`─── 큐 점검 (KST ${TODAY}) ─── 큐 ${qn}편 · 발행(초안) ${jsonSlugs(DRAFTS).size}편`);
if (CHECK) {
  queueItems().sort().forEach((f) => { const d = JSON.parse(fs.readFileSync(path.join(QUEUE, f), 'utf8')); console.log(`  ${d.publishAt}  ${d.title}`); });
  process.exit(0);
}
let need = FORCE || (qn < THRESHOLD ? Math.min(MAX_ADD, TARGET - qn) : 0);
if (need <= 0) { log(`큐 ${qn}편 — 보충 불필요(기준 ${THRESHOLD})`); process.exit(0); }
if (fs.existsSync(LOCK)) { if (Date.now() - fs.statSync(LOCK).mtimeMs < BATCH_TIMEOUT * 2) { log('이미 실행 중'); process.exit(0); } unlock(); }
fs.writeFileSync(LOCK, stamp());

const existAt = queueItems().map((f) => JSON.parse(fs.readFileSync(path.join(QUEUE, f), 'utf8')).publishAt).sort();
let base = existAt.length ? existAt[existAt.length - 1] : addDays(TODAY, -1);
const known = { published: new Set([...jsonSlugs(DRAFTS)]), titles: new Set(), newSlugs: new Set() };
queueItems().forEach((f) => { try { known.titles.add(JSON.parse(fs.readFileSync(path.join(QUEUE, f), 'utf8')).title); known.published.add(f.replace(/\.json$/, '')); } catch {} });

const batch = [];
for (let i = 0; i < need; i += 1) batch.push({ region: REGIONS[i % 3], publishAt: addDays(base, i + 1) });
log(`${need}건 보충 시작 → ${batch[0].publishAt} ~ ${batch[batch.length - 1].publishAt}`);

const written = [];
for (let i = 0; i < batch.length; i += 3) {
  const group = batch.slice(i, i + 3);
  let ok = false;
  for (let attempt = 0; attempt <= RETRY; attempt += 1) {
    if (attempt) log(`  재작성 ${attempt}회차`);
    const before = new Set(queueItems());
    if (!runClaude(prompt(group, known))) fail('claude 세 번 실패(사용량 한도로 보임)', `여기까지 ${written.length}건 반영`);
    const added = queueItems().filter((f) => !before.has(f));
    if (!added.length) { log('  !! 새 파일 없음'); continue; }
    added.forEach((f) => known.newSlugs.add(f.replace(/\.json$/, '')));
    const errs = added.flatMap((f) => validate(f.replace(/\.json$/, ''), known));
    if (!errs.length) { added.forEach((f) => { const d = JSON.parse(fs.readFileSync(path.join(QUEUE, f), 'utf8')); known.titles.add(d.title); known.published.add(f.replace(/\.json$/, '')); written.push(f.replace(/\.json$/, '')); }); ok = true; break; }
    log('  !! 규격 불통과: ' + errs.slice(0, 4).join(' / '));
    added.forEach((f) => { try { fs.rmSync(path.join(QUEUE, f)); known.newSlugs.delete(f.replace(/\.json$/, '')); } catch {} });
  }
  if (!ok) fail('규격을 통과하지 못했습니다', `여기까지 ${written.length}건 반영`);
  try { fs.writeFileSync(LOCK, stamp()); } catch {}
  log(`  통과 ${group.length}건 — 누적 ${written.length}`);
}
log(`─── 보충 완료 · ${written.length}건 ───`);
written.forEach((s) => log(`   ${s}`));
if (GIT && written.length) {
  try {
    git(['add', 'content/queue']);
    git(['-c', 'user.name=publish-bot', '-c', 'user.email=bot@auto.local', 'commit', '-m', `큐 보충: 전주개인회생 칼럼 ${written.length}건`]);
    git(['push', 'origin', 'main']);
    log('GitHub 푸시 완료 — publish-queue 가 매일 1건 발행');
  } catch (e) { fail('푸시 실패(큐는 로컬에 있음)', String(e.stdout || e.message)); }
}
try { if (fs.existsSync(DESK)) fs.rmSync(DESK); } catch {}
unlock();
