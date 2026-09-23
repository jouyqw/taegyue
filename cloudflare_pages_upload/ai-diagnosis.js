(()=>{
  'use strict';
  const CONTACT='https://pf.kakao.com/_vsGmn/chat';
  const state={step:0,answers:{}};
  const questions=[
    {id:'debtType',title:'채무 종류는 어떻게 구성되어 있나요?',help:'가장 비중이 큰 항목을 선택해 주세요.',options:[['credit','신용대출·카드'],['business','사업·보증 채무'],['secured','주택·차량 담보 포함'],['mixed','여러 종류가 섞여 있음']]},
    {id:'unsecured',title:'담보가 없는 채무는 총 얼마인가요?',help:'신용대출, 카드론, 현금서비스, 보증채무 등을 합산해 주세요.',input:true,unit:'만원',min:1,max:100000},
    {id:'secured',title:'담보채무는 총 얼마인가요?',help:'주택담보대출, 차량담보대출 등을 합산해 주세요. 없다면 0을 입력하세요.',input:true,unit:'만원',min:0,max:150000},
    {id:'incomeType',title:'현재 소득 형태를 알려주세요.',help:'개인회생은 앞으로도 반복되는 소득을 확인합니다.',options:[['salary','급여소득자'],['business','자영업자'],['freelance','프리랜서·일용직'],['none','현재 정기소득 없음']]},
    {id:'income',title:'월평균 실수령 소득은 얼마인가요?',help:'최근 3~12개월 평균을 기준으로 입력해 주세요.',input:true,unit:'만원',min:0,max:10000},
    {id:'family',title:'본인을 포함한 가구원 수는 몇 명인가요?',help:'실제 부양 인정 여부는 가족관계와 소득자료로 별도 판단합니다.',options:[['1','1명'],['2','2명'],['3','3명'],['4','4명'],['5','5명 이상']]},
    {id:'assets',title:'보유 재산의 대략적인 합계는 얼마인가요?',help:'부동산, 차량, 보증금, 예금, 보험환급금 등을 포함해 주세요.',input:true,unit:'만원',min:0,max:1000000},
    {id:'recentLoan',title:'최근 1년 안에 새로 받은 대출이 있나요?',help:'최근 대출이 있어도 신청이 불가능한 것은 아니지만 사용처 소명이 중요합니다.',options:[['none','없음'],['under30','전체 채무의 30% 미만'],['over30','전체 채무의 30% 이상'],['unknown','정확히 모르겠음']]},
    {id:'collection',title:'현재 연체·독촉·압류 상황은 어떤가요?',help:'긴급도와 준비 순서를 판단하는 질문입니다.',options:[['none','아직 연체 전'],['overdue','연체·독촉 중'],['order','지급명령·소송 진행'],['seizure','급여·통장 압류 우려 또는 진행']]},
    {id:'history',title:'과거 개인회생·파산 이력이 있나요?',help:'면책 시점이나 폐지 사유에 따라 재신청 검토가 달라집니다.',options:[['none','없음'],['dismissed','신청 후 기각·폐지'],['discharged5','면책 후 5년 이내'],['dischargedOld','면책 후 5년 초과']]}
  ];
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const modal=document.createElement('div');
  modal.className='ai-modal'; modal.id='aiDiagnosisModal'; modal.hidden=true;
  modal.innerHTML='<div class="ai-dialog" role="dialog" aria-modal="true" aria-labelledby="aiDiagTitle"><button class="ai-close" type="button" aria-label="진단창 닫기">×</button><header class="ai-head"><div class="ai-kicker">무료 AI 사전자격진단</div><h2 id="aiDiagTitle">개인회생 AI 자격진단</h2><p>아래 선택지를 한 문항씩 누르면 신청 가능성과 꼭 확인할 쟁점을 정리해 드립니다.</p></header><div class="ai-progress-wrap"><div class="ai-progress"><span></span></div><div class="ai-progress-text"></div></div><main class="ai-body"></main></div>';
  document.body.appendChild(modal);
  const body=modal.querySelector('.ai-body'), progress=modal.querySelector('.ai-progress span'), progressText=modal.querySelector('.ai-progress-text');
  let lastFocus=null;
  function openModal(e){if(e)e.preventDefault();lastFocus=document.activeElement;modal.hidden=false;document.body.classList.add('ai-modal-open');state.step=0;state.answers={};render();modal.querySelector('.ai-close').focus()}
  function closeModal(){modal.hidden=true;document.body.classList.remove('ai-modal-open');if(lastFocus)lastFocus.focus()}
  document.querySelectorAll('a[href="#diagnosis"],[data-ai-diagnosis]').forEach(a=>{a.classList.add('ai-diagnosis-trigger');a.addEventListener('click',openModal)});
  modal.querySelector('.ai-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});
  function render(){
    const q=questions[state.step]; const pct=Math.round((state.step/questions.length)*100);
    progress.style.width=pct+'%'; progressText.textContent=(state.step+1)+' / '+questions.length;
    let content='<section class="ai-question"><h3>'+esc(q.title)+'</h3><p class="ai-help">'+esc(q.help)+'</p>';
    if(q.options){content+='<div class="ai-options">'+q.options.map((o,i)=>'<button type="button" class="ai-option'+(state.answers[q.id]===o[0]?' selected':'')+'" data-value="'+o[0]+'"><b>'+String.fromCharCode(65+i)+'</b>'+esc(o[1])+'</button>').join('')+'</div>'}
    else{content+='<div class="ai-input-wrap"><div class="ai-input-row"><input id="aiAnswer" inputmode="numeric" type="number" min="'+q.min+'" max="'+q.max+'" value="'+(state.answers[q.id]??'')+'" placeholder="숫자로 입력"><span>'+q.unit+'</span></div><div class="ai-error" aria-live="polite"></div></div>'}
    content+='<div class="ai-nav">'+(state.step?'<button type="button" class="ai-prev">이전</button>':'')+(q.input?'<button type="button" class="ai-next">'+(state.step===questions.length-1?'결과 보기':'다음')+'</button>':'')+'</div></section>';
    body.innerHTML=content;
    body.querySelectorAll('.ai-option').forEach(btn=>btn.addEventListener('click',()=>{state.answers[q.id]=btn.dataset.value;next()}));
    body.querySelector('.ai-prev')?.addEventListener('click',()=>{state.step--;render()});
    body.querySelector('.ai-next')?.addEventListener('click',()=>{const input=body.querySelector('#aiAnswer');const value=Number(input.value);if(input.value===''||value<q.min||value>q.max){body.querySelector('.ai-error').textContent=q.min===0?'0 이상 숫자를 입력해 주세요.':'1 이상 숫자를 입력해 주세요.';input.focus();return}state.answers[q.id]=value;next()});
    body.querySelector('#aiAnswer')?.addEventListener('keydown',e=>{if(e.key==='Enter')body.querySelector('.ai-next').click()});
    body.querySelector('#aiAnswer')?.focus();
  }
  function next(){if(state.step<questions.length-1){state.step++;render()}else showResult()}
  function showResult(){
    const a=state.answers, total=Number(a.unsecured)+Number(a.secured), assets=Number(a.assets), income=Number(a.income);
    const base={1:154,2:252,3:322,4:390,5:453}[a.family]||453;
    const disposable=Math.max(0,income-base), estimated=Math.max(0,Math.round(disposable));
    let score=82; const issues=[], docs=['채권자별 채무액을 확인할 부채증명서','최근 소득을 확인할 급여명세·통장내역','보증금·차량·보험 등 재산자료'];
    if(a.unsecured>100000){score-=45;issues.push('무담보채무가 법정 한도 10억 원을 넘는 것으로 입력됐습니다.')}
    if(a.secured>150000){score-=45;issues.push('담보채무가 법정 한도 15억 원을 넘는 것으로 입력됐습니다.')}
    if(a.incomeType==='none'||income===0){score-=40;issues.push('계속적·반복적 소득이 없어 개인회생보다 파산 등 다른 절차 검토가 우선될 수 있습니다.')}
    if(total<=assets){score-=25;issues.push('재산이 채무와 같거나 많아 청산가치와 변제계획을 정밀하게 확인해야 합니다.')}
    if(estimated===0&&income>0){score-=18;issues.push('기준 생계비를 제외한 월 변제 여력이 낮아 부양가족 인정 범위 확인이 필요합니다.')}
    if(a.recentLoan==='over30'){score-=15;issues.push('최근 대출 비중이 높아 사용처와 채무 발생 경위 자료가 중요합니다.');docs.push('최근 대출금 사용처와 계좌 거래내역')}
    if(a.recentLoan==='unknown'){score-=5;issues.push('최근 1년 대출 내역을 먼저 확인하면 판단 정확도가 높아집니다.')}
    if(a.collection==='order'||a.collection==='seizure'){issues.push('법적 절차나 압류 위험이 있어 신청 시점과 금지·중지명령 검토가 시급합니다.');docs.push('독촉장·지급명령·압류 관련 서류')}
    if(a.history==='discharged5'){score-=30;issues.push('과거 면책 후 5년 이내라면 개인회생 면책 제한을 확인해야 합니다.')}
    if(a.history==='dismissed'){score-=10;issues.push('과거 기각·폐지 사유를 보완할 수 있는지 확인해야 합니다.');docs.push('과거 사건번호와 기각·폐지 결정문')}
    score=Math.max(10,Math.min(95,score));
    let level='개인회생 검토 가능성이 높습니다',desc='입력 내용상 기본요건을 대체로 충족할 가능성이 있습니다. 실제 변제금과 인가 가능성은 자료 검토가 필요합니다.';
    if(score<45){level='다른 절차까지 함께 검토가 필요합니다';desc='현재 입력만으로는 개인회생의 핵심 요건에 걸리는 부분이 있습니다. 파산·워크아웃 등 대안과 함께 확인해 보세요.'}
    else if(score<70){level='개인회생 정밀검토가 필요합니다';desc='신청 가능성은 있지만 재산, 최근 대출 또는 소득에서 확인할 쟁점이 있습니다.'}
    const urgency=(a.collection==='seizure'||a.collection==='order')?'빠른 상담 권장':(a.collection==='overdue'?'상담 권장':'일반 검토');
    const monthly=estimated?('약 '+estimated.toLocaleString()+'만 원 전후'):'별도 산정 필요';
    progress.style.width='100%';progressText.textContent='진단 완료';
    body.innerHTML='<section class="ai-result"><div class="ai-result-top"><small>AI 사전자격진단 결과</small><h3>'+level+'</h3><p>'+desc+'</p><div class="ai-score"><strong>'+score+'</strong><div class="ai-score-bar"><span style="width:'+score+'%"></span></div></div></div><div class="ai-result-grid"><div class="ai-result-card"><b>검토 가능성</b><strong>'+score+'점 / 100점</strong></div><div class="ai-result-card"><b>상담 우선순위</b><strong>'+urgency+'</strong></div><div class="ai-result-card"><b>총 채무 입력액</b><strong>'+total.toLocaleString()+'만 원</strong></div><div class="ai-result-card"><b>월 변제 여력 추정</b><strong>'+monthly+'</strong></div></div><div class="ai-result-section"><h4>꼭 확인할 사항</h4><ul class="ai-result-list">'+(issues.length?issues:['채무가 재산보다 많고 반복 소득이 있다면 개인회생을 적극 검토할 수 있습니다.','배우자 재산, 세금, 보증채무는 상담에서 별도 확인이 필요합니다.']).map(x=>'<li>'+x+'</li>').join('')+'</ul></div><div class="ai-result-section"><h4>상담 전에 준비하면 좋은 자료</h4><ul class="ai-result-list">'+[...new Set(docs)].map(x=>'<li>'+x+'</li>').join('')+'</ul></div><p class="ai-disclaimer">본 결과는 입력값에 따른 일반적인 사전 안내이며 법률의견이나 법원의 결정을 보장하지 않습니다. 실제 가능성·변제금은 채무 발생 경위, 재산 평가, 부양가족 인정, 법원 보정사항에 따라 달라질 수 있습니다.</p><div class="ai-result-actions"><a class="ai-consult" href="'+CONTACT+'" target="_blank" rel="noopener">카카오톡으로 결과 상담</a><button class="ai-restart" type="button">처음부터 다시 진단</button></div></section>';
    body.querySelector('.ai-restart').addEventListener('click',()=>{state.step=0;state.answers={};render()});
  }
  const reviews=[
    ['30대 직장인 김**','회생 상담','제가 가능한지도 몰랐는데 필요한 서류와 순서를 나눠 설명해 주셔서 준비가 쉬웠습니다.'],
    ['40대 자영업자 박**','채무조정','흩어진 대출을 먼저 정리해 주셔서 앞으로 무엇을 해야 할지 보였습니다.'],
    ['30대 급여소득자 이**','개인회생','독촉 때문에 불안했는데 절차와 예상 변제 방향을 알고 마음이 놓였습니다.'],
    ['프리랜서 최**','소득자료 검토','소득 증명이 어려울 줄 알았는데 어떤 자료가 필요한지 구체적으로 안내받았습니다.'],
    ['40대 회사원 장**','압류 상담','압류가 걱정됐는데 현재 단계에서 가능한 대응을 차분히 설명해 주셨습니다.']
  ];
  const toast=document.createElement('aside');toast.className='review-toast';toast.setAttribute('aria-live','polite');toast.innerHTML='<button type="button" aria-label="후기 알림 닫기">×</button><div class="live">최근 상담 후기</div><p></p><footer><span></span><strong></strong></footer>';document.body.appendChild(toast);
  let reviewIndex=0,reviewTimer=null,reviewStarted=false,reviewClosed=false;
  function showReview(){if(reviewClosed)return;const r=reviews[reviewIndex++%reviews.length];toast.querySelector('p').textContent='“'+r[2]+'”';toast.querySelector('footer span').textContent=r[0];toast.querySelector('footer strong').textContent=r[1];toast.classList.add('show');clearTimeout(reviewTimer);reviewTimer=setTimeout(()=>{toast.classList.remove('show');reviewTimer=setTimeout(showReview,3500)},6500)}
  function onScroll(){if(!reviewStarted&&scrollY>Math.min(500,innerHeight*.45)){reviewStarted=true;showReview();removeEventListener('scroll',onScroll)}}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  toast.querySelector('button').addEventListener('click',()=>{reviewClosed=true;clearTimeout(reviewTimer);toast.classList.remove('show')});
})();
