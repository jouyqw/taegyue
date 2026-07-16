import { mkdirSync, writeFileSync } from 'node:fs';

const site = 'https://taeandkyujeonju.com';
const published = '2026-07-16';

const articles = [
  {
    slug: 'personal-rehabilitation-income-check',
    title: '전주개인회생 소득자료 준비법｜직장인·자영업자·프리랜서 체크리스트',
    description: '전주 개인회생 상담 전 직장인, 자영업자, 프리랜서가 준비할 소득자료와 통장 입금내역 정리 방법을 구분해 안내합니다.',
    summary: '소득자료의 목적은 단순히 월급 액수를 보여주는 것이 아니라 앞으로도 반복적인 소득이 생긴다는 점과 실제 월평균 소득을 설명하는 데 있습니다.',
    sections: [
      ['먼저 확인할 두 가지', '<p>개인회생에서는 <strong>계속적·반복적인 소득이 있는지</strong>와 그 소득에서 생활비를 제외한 금액을 어느 정도 변제에 사용할 수 있는지를 함께 봅니다. 한 달의 입금액만 제출하기보다 최근 여러 달의 흐름을 같은 기준으로 정리하는 것이 중요합니다.</p><div class="check"><b>상담 전 메모</b><ul><li>근무 또는 영업을 시작한 시점</li><li>최근 6~12개월 월별 입금액</li><li>상여금·성과급·현금매출처럼 매달 달라지는 수입</li><li>세금과 사업비 등 실제로 빠져나가는 비용</li></ul></div>'],
      ['소득 형태별 준비자료', '<div class="table"><table><thead><tr><th>구분</th><th>우선 준비할 자료</th><th>추가 설명이 필요한 경우</th></tr></thead><tbody><tr><td>직장인</td><td>재직증명서, 급여명세서, 급여통장, 원천징수영수증</td><td>수습기간, 이직, 휴직, 성과급 변동</td></tr><tr><td>자영업자</td><td>사업자등록, 부가세·소득세 자료, 카드매출, 사업용 통장</td><td>현금매출, 가족 명의 계좌, 계절별 매출 차이</td></tr><tr><td>프리랜서</td><td>계약서, 용역비 입금내역, 원천징수 내역</td><td>거래처별 지급주기와 계약 종료 가능성</td></tr><tr><td>일용·아르바이트</td><td>근로계약, 급여 입금내역, 근무확인 자료</td><td>근무일수와 월별 소득 차이</td></tr></tbody></table></div>'],
      ['통장 입금내역은 이렇게 정리합니다', '<p>입금자명만으로 급여인지 개인 간 이체인지 구분되지 않는 경우가 많습니다. 월별 표를 만들고 각 입금의 성격을 <strong>급여·매출·차용·가족이체·환불</strong>로 나누면 설명이 쉬워집니다. 현금으로 받은 수입은 계약서, 거래명세, 매출장부 등 다른 자료와 맞춰야 합니다.</p><p>여러 계좌를 사용했다면 유리해 보이는 계좌만 고르지 말고 소득과 생활비 흐름에 관련된 계좌를 먼저 목록화하는 편이 안전합니다.</p>'],
      ['자주 생기는 보완 사유', '<ul><li>급여명세서 금액과 실제 입금액이 다른 경우</li><li>사업 매출 전체를 소득으로 계산해 비용이 빠진 경우</li><li>가족 계좌로 매출이나 급여를 받은 경우</li><li>최근 이직·폐업으로 과거 평균과 현재 소득이 크게 다른 경우</li></ul><p>이런 차이가 있다고 곧바로 신청이 불가능한 것은 아닙니다. 차이가 생긴 이유와 현재 상태를 자료로 연결하는 것이 핵심입니다.</p>'],
      ['전주 상담 전 최종 점검', '<p>자료를 완벽하게 발급한 뒤 상담하려고 미루기보다, 현재 가지고 있는 자료와 빠진 자료를 구분해 가져오면 준비 순서를 정할 수 있습니다. 법무법인 태앤규는 채무·재산자료와 함께 소득의 지속성과 월평균 산정 방식을 검토합니다.</p>']
    ]
  },
  {
    slug: 'personal-rehabilitation-recent-loan',
    title: '전주개인회생 최근 대출이 있을 때｜사용처 정리와 확인사항',
    description: '개인회생 신청 전 최근 대출, 카드론, 현금서비스가 있다면 사용처와 채무 발생 경위를 어떻게 정리할지 안내합니다.',
    summary: '최근 대출이 있다는 이유만으로 개인회생이 일률적으로 불가능한 것은 아니지만, 대출 시점·사용처·현재 남은 재산을 구체적으로 설명할 준비가 필요합니다.',
    sections: [
      ['왜 최근 대출을 자세히 보는가', '<p>신청 직전 늘어난 채무는 생활비, 기존 채무 상환, 사업 운영비, 투자·도박 등 사용 목적에 따라 검토할 내용이 달라집니다. 대출금이 다른 채무를 갚는 데 사용됐다면 돈의 이동 경로를, 물건이나 보증금으로 남아 있다면 현재 재산 상태를 함께 확인해야 합니다.</p>'],
      ['먼저 만드는 대출 사용처 표', '<div class="table"><table><thead><tr><th>항목</th><th>정리 내용</th><th>확인 자료</th></tr></thead><tbody><tr><td>대출일·금액</td><td>금융회사별 실행일과 최초 금액</td><td>대출약정, 부채증명</td></tr><tr><td>입금 계좌</td><td>대출금이 들어온 계좌</td><td>해당일 전후 통장내역</td></tr><tr><td>주요 사용처</td><td>생활비·채무상환·사업비 등</td><td>이체내역, 카드명세, 계약서</td></tr><tr><td>남은 재산</td><td>보증금·차량·보험·예금 등</td><td>재산 관련 증빙</td></tr></tbody></table></div>'],
      ['카드론과 현금서비스가 반복된 경우', '<p>돌려막기처럼 보이는 거래도 날짜순으로 정리하면 구조가 보입니다. 카드 결제일, 대출 실행일, 기존 채무 상환일을 한 표에 놓고 생활비 지출과 분리하세요. 설명 없이 거래내역만 많이 제출하는 것보다 <strong>채무가 증가한 과정</strong>을 짧고 일관되게 정리하는 것이 좋습니다.</p>'],
      ['피해야 할 대응', '<div class="warn"><b>주의할 점</b><ul><li>신청을 예상하면서 새 대출을 받아 특정 채권자만 먼저 갚는 행동</li><li>가족이나 지인에게 큰돈을 보내고 이유를 남기지 않는 행동</li><li>재산을 급하게 처분하고 현금 사용처를 설명하지 못하는 상황</li><li>불리해 보이는 계좌나 채무를 누락하는 행동</li></ul></div><p>구체적인 평가는 각 거래의 시기와 이유에 따라 달라지므로, 임의로 거래를 정리하기 전에 상담을 받는 편이 안전합니다.</p>'],
      ['상담 때 가져오면 좋은 자료', '<p>최근 1년의 신규대출 목록, 대출금 입금계좌, 카드 사용명세, 가족 간 큰 금액 이체, 차량·보증금 등 재산 변동 자료를 준비하세요. 자료가 많다면 완벽하게 분류하기보다 먼저 계좌와 채권자 목록을 만드는 것부터 시작하면 됩니다.</p>']
    ]
  },
  {
    slug: 'personal-rehabilitation-seizure-response',
    title: '전주개인회생 급여압류·통장압류 대응｜준비 순서',
    description: '독촉, 지급명령, 급여압류와 통장압류 단계에서 개인회생 상담 전 확인할 문서와 대응 순서를 정리합니다.',
    summary: '독촉을 받고 있다는 사실만으로 같은 대응을 하는 것은 아닙니다. 단순 연체인지, 지급명령이나 소장이 도착했는지, 이미 압류가 진행됐는지를 먼저 구분해야 합니다.',
    sections: [
      ['현재 단계를 먼저 구분합니다', '<div class="table"><table><thead><tr><th>단계</th><th>확인할 것</th><th>준비할 자료</th></tr></thead><tbody><tr><td>연체·독촉</td><td>채권자와 연체 시작일</td><td>문자, 우편, 채무목록</td></tr><tr><td>지급명령·소송</td><td>법원명, 사건번호, 받은 날짜</td><td>법원 서류 봉투 포함 전체</td></tr><tr><td>압류 전 통지</td><td>대상 재산과 예정 시점</td><td>급여·계좌·재산 자료</td></tr><tr><td>압류 진행</td><td>제3채무자와 압류 범위</td><td>압류결정문, 통장·급여 내역</td></tr></tbody></table></div>'],
      ['법원 서류는 받은 날짜가 중요합니다', '<p>지급명령이나 소장에는 대응 기간이 연결될 수 있으므로 서류의 제목만 보지 말고 <strong>송달받은 날짜와 사건번호</strong>를 확인해야 합니다. 봉투와 안내문을 버리지 말고 촬영해 상담 시 전달하세요. 개인회생을 알아보고 있다는 이유로 기존 법원 절차가 자동으로 멈춘다고 생각해서는 안 됩니다.</p>'],
      ['급여와 생활계좌를 함께 점검합니다', '<p>급여가 어느 은행으로 들어오는지, 자동이체되는 생활비가 무엇인지, 이미 사용이 제한된 계좌가 있는지 목록을 만드세요. 회사에 도착한 서류가 있다면 담당 부서와 수령일도 확인합니다. 압류 이후 사용할 계좌를 임의로 돌리기보다 현재 상태를 정확히 파악하는 것이 먼저입니다.</p>'],
      ['신청 준비와 금지·중지 검토', '<p>개인회생 절차에서는 상황에 따라 채권자의 개별 집행에 관한 금지 또는 중지를 함께 검토할 수 있습니다. 다만 신청만 하면 무조건 즉시 해결되는 것은 아니며 사건 진행 상태와 제출자료에 따라 판단이 달라집니다. 따라서 채무목록·소득·재산자료와 압류 서류를 동시에 준비해야 합니다.</p>'],
      ['오늘 준비할 체크리스트', '<div class="check"><ul><li>독촉 중인 채권자 이름과 연락일 기록</li><li>법원 서류의 사건번호·송달일 확인</li><li>급여계좌와 주요 생활계좌 목록</li><li>월 소득, 보증금, 차량, 보험 등 기본 재산 정리</li><li>가장 급한 기한을 상담 시 먼저 알리기</li></ul></div>']
    ]
  },
  {
    slug: 'personal-rehabilitation-spouse-property',
    title: '전주개인회생 배우자 재산이 있을 때 확인할 점',
    description: '배우자 명의 아파트, 전세보증금, 차량, 보험이 있을 때 개인회생 상담에서 확인하는 취득 경위와 자금 흐름을 안내합니다.',
    summary: '배우자 명의라는 이유만으로 모두 신청인의 재산이 되는 것도, 전혀 관계없는 재산이 되는 것도 아닙니다. 취득 시기와 실제 자금 부담 관계를 자료로 확인해야 합니다.',
    sections: [
      ['명의보다 형성 과정이 중요합니다', '<p>혼인 전 취득인지 혼인 중 취득인지, 매수대금과 대출을 누가 부담했는지, 증여·상속처럼 별도 형성 사유가 있는지를 구분해야 합니다. 부부가 생활비와 재산 형성 자금을 섞어 사용했다면 통장 흐름을 통해 실제 관계를 설명할 필요가 있습니다.</p>'],
      ['재산별 확인자료', '<div class="table"><table><thead><tr><th>재산</th><th>확인할 내용</th><th>자료 예시</th></tr></thead><tbody><tr><td>주택·토지</td><td>취득일, 매수자금, 담보대출</td><td>등기, 매매계약, 대출내역</td></tr><tr><td>전세보증금</td><td>계약자와 보증금 마련 경위</td><td>임대차계약, 이체내역</td></tr><tr><td>차량</td><td>실제 사용자와 구매대금</td><td>등록원부, 할부내역</td></tr><tr><td>보험·예금</td><td>계약자·납부자·해약환급금</td><td>보험조회, 계좌내역</td></tr></tbody></table></div>'],
      ['최근 명의변경이 있었다면', '<p>신청 전 재산을 배우자에게 이전했거나 반대로 배우자 재산이 신청인에게 넘어온 경우에는 시점과 대가 지급 여부를 확인해야 합니다. 단순히 명의를 바꾸면 재산에서 빠진다고 생각해서는 안 됩니다. 계약서, 매매대금, 세금 납부자료를 그대로 보관하세요.</p>'],
      ['가족 생활비 이체는 설명을 붙입니다', '<p>매달 배우자에게 보내는 돈이 생활비인지 대출 상환 분담인지 구분해 월별로 정리합니다. 큰 금액이 오간 경우에는 사용처를 메모하고 관련 영수증이나 계약서를 연결하면 상담이 빨라집니다.</p>'],
      ['상담 전 질문 목록', '<ul><li>배우자 재산은 언제 어떤 자금으로 취득했는가?</li><li>신청인이 계약금·대출·보험료를 부담했는가?</li><li>최근 1~2년 사이 명의나 재산가치가 변했는가?</li><li>별거·이혼·재산분할 절차가 함께 진행 중인가?</li></ul><p>결론은 서류를 확인한 뒤 개별적으로 판단해야 하므로 재산을 임의 처분하기 전에 상담받는 것이 좋습니다.</p>']
    ]
  },
  {
    slug: 'self-employed-personal-rehabilitation-income',
    title: '전주개인회생 자영업자편｜매출과 사업비 정리 방법',
    description: '자영업자 개인회생에서 카드매출, 현금매출, 사업용 계좌와 사업비를 구분해 월평균 소득을 정리하는 방법입니다.',
    summary: '자영업자는 매출 전체가 소득이 아닙니다. 실제 매출에서 영업에 필요한 비용을 구분하고, 그 결과가 세금자료와 통장 흐름에 맞는지 보여줘야 합니다.',
    sections: [
      ['매출·비용·가용소득을 나눕니다', '<p>카드매출, 배달앱 정산, 현금매출, 계좌입금을 한데 모아 월별 총매출을 만들고 임차료, 재료비, 인건비, 플랫폼 수수료 같은 사업비를 별도로 정리합니다. 개인 생활비나 기존 대출 상환액은 사업비와 섞지 않는 것이 좋습니다.</p>'],
      ['기본 자료 체크', '<div class="table"><table><thead><tr><th>구분</th><th>자료</th><th>점검사항</th></tr></thead><tbody><tr><td>공식 신고</td><td>부가세, 종합소득세, 소득금액증명</td><td>최근 매출 감소가 반영됐는지</td></tr><tr><td>실제 매출</td><td>카드·배달앱·현금영수증 정산</td><td>중복 집계가 없는지</td></tr><tr><td>계좌</td><td>사업용·개인용 통장</td><td>가족 명의 입금이 있는지</td></tr><tr><td>사업비</td><td>임대차, 세금계산서, 급여자료</td><td>영업에 꼭 필요한 비용인지</td></tr></tbody></table></div>'],
      ['현금매출과 가족계좌 사용', '<p>현금매출이 신고자료와 다르거나 가족 계좌로 정산금을 받은 경우 이를 숨기기보다 월별 장부와 거래 증빙으로 연결해야 합니다. 반대로 단순 가족이체를 매출로 잘못 계산하지 않도록 입금 성격도 표시하세요.</p>'],
      ['매출이 최근 급감한 경우', '<p>과거 세금신고만 보면 현재 상황이 드러나지 않을 수 있습니다. 최근 3~6개월의 매출표, 휴업·이전·거래처 종료 등 감소 원인, 앞으로의 영업계획을 함께 정리합니다. 폐업했다면 새 소득원의 근무 시작일과 예상 급여도 확인해야 합니다.</p>'],
      ['한 장 요약표를 만드세요', '<div class="check"><p><strong>월별 매출 − 인정 가능한 사업비 = 사업소득 추정액</strong></p><p>이 계산을 최근 여러 달에 동일하게 적용하고, 숫자 옆에 근거자료 이름을 붙이면 변제계획 검토가 쉬워집니다. 정확한 인정 범위는 업종과 자료에 따라 달라질 수 있습니다.</p></div>']
    ]
  },
  {
    slug: 'personal-rehabilitation-payment-calculation',
    title: '전주개인회생 변제금 기준｜소득·생계비·재산 체크',
    description: '개인회생 예상 변제금을 검토할 때 소득, 생계비, 재산가치, 부양가족과 최근 거래를 함께 보는 이유를 설명합니다.',
    summary: '예상 변제금은 채무액에 일정 비율을 곱해 정하지 않습니다. 월 소득과 생계비만이 아니라 재산가치, 부양가족, 채무 발생 경위 등 여러 자료를 함께 검토합니다.',
    sections: [
      ['출발점은 월평균 소득입니다', '<p>직장인은 급여와 상여금, 자영업자는 매출에서 사업비를 제외한 금액, 프리랜서는 반복되는 용역 수입을 기준으로 월평균을 검토합니다. 최근 이직이나 매출 급감이 있다면 과거 평균을 그대로 적용하기보다 현재 소득이 계속될 수 있는지 자료로 설명해야 합니다.</p>'],
      ['생계비는 가족 수만으로 끝나지 않습니다', '<p>부양가족 수는 중요한 출발점이지만 실제 부양관계, 다른 가족의 소득, 주거·의료 등 추가 지출의 필요성과 증빙도 함께 검토될 수 있습니다. 인터넷 계산기의 숫자는 상담 전 참고값일 뿐 실제 변제계획과 같다고 단정하면 안 됩니다.</p>'],
      ['재산가치도 함께 비교합니다', '<div class="table"><table><thead><tr><th>재산</th><th>확인자료</th><th>주의할 부분</th></tr></thead><tbody><tr><td>임차보증금</td><td>계약서, 확정일자, 대출</td><td>지역·담보 관계</td></tr><tr><td>부동산</td><td>등기, 시가자료, 담보잔액</td><td>공동명의와 처분 이력</td></tr><tr><td>차량</td><td>등록원부, 시세, 할부잔액</td><td>실제 소유·사용 관계</td></tr><tr><td>보험·예금</td><td>해약환급금, 잔액증명</td><td>최근 인출과 계약자</td></tr></tbody></table></div>'],
      ['단순 계산이 빗나가는 경우', '<ul><li>상여금과 부수입이 빠진 경우</li><li>사업 매출을 소득으로 그대로 넣은 경우</li><li>배우자·공동명의 재산 검토가 빠진 경우</li><li>최근 대출금이나 재산 처분 사용처가 정리되지 않은 경우</li><li>추가 생계비를 증빙 없이 예상한 경우</li></ul>'],
      ['상담 전 예상표 만드는 법', '<p>① 최근 월별 소득표, ② 가족과 주거비 현황, ③ 재산목록과 담보잔액, ④ 채권자별 채무를 한 번에 준비하세요. 이 네 표가 맞아야 현실적인 변제 방향을 검토할 수 있습니다. 홈페이지의 자가진단 결과만으로 신청 여부나 최종 변제금을 결정하지 마시기 바랍니다.</p>']
    ]
  }
];

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const render = (article) => `<!doctype html>
<html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(article.title)} | 법무법인 태앤규</title>
<meta name="description" content="${esc(article.description)}"><meta name="author" content="김기태 변호사">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${site}/blog/${article.slug}">
<meta property="og:type" content="article"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${esc(article.title)}"><meta property="og:description" content="${esc(article.description)}"><meta property="og:url" content="${site}/blog/${article.slug}"><meta property="og:image" content="${site}/kim-gitae-photo.jpg">
<style>:root{--navy:#0d1728;--gold:#c89a3d;--ink:#162033;--muted:#667085;--line:#e3e8ef;--bg:#f5f7fa}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.85;word-break:keep-all}.top{background:var(--navy);color:#fff}.wrap{max-width:960px;margin:auto;padding:0 22px}.top .wrap{min-height:68px;display:flex;align-items:center;justify-content:space-between}.top a{color:#fff;text-decoration:none}.brand{font-weight:900}.page{padding:36px 0 76px}.crumb{font-size:13px;color:var(--muted);margin-bottom:16px}.article{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 18px 45px rgba(13,23,40,.08)}.head{padding:46px 50px 36px;border-bottom:1px solid var(--line)}.badge{display:inline-block;background:#f7ead0;color:#5d4312;padding:6px 10px;border-radius:4px;font-size:12px;font-weight:900}h1{font-size:clamp(28px,4vw,43px);line-height:1.35;margin:18px 0}.summary{background:#f8fafc;border-left:5px solid var(--gold);padding:20px;font-size:17px;font-weight:700}.byline{margin-top:18px;color:var(--muted);font-size:13px}.body{padding:38px 50px}.body h2{font-size:25px;line-height:1.45;margin:40px 0 14px}.body h2:first-child{margin-top:0}.body p{margin:0 0 17px}.body ul{padding-left:22px}.table{overflow:auto;border:1px solid var(--line);border-radius:10px;margin:18px 0 24px}table{width:100%;min-width:680px;border-collapse:collapse}th,td{text-align:left;padding:14px;border-bottom:1px solid var(--line);vertical-align:top}th{background:#f8fafc}.check,.warn{padding:18px 20px;border-radius:10px;margin:20px 0}.check{background:#eef7ff;border:1px solid #bfdcf5}.warn{background:#fff5f3;border:1px solid #f3c8c0}.sources{margin-top:44px;padding-top:24px;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}.sources a{color:#415d85}.cta{margin-top:34px;background:var(--navy);color:#fff;padding:24px;border-radius:10px}.cta a{display:inline-block;margin-top:10px;color:#111;background:#f1d28b;padding:10px 16px;border-radius:5px;text-decoration:none;font-weight:900}.foot{padding:28px 0;color:var(--muted);font-size:13px}@media(max-width:700px){.head,.body{padding-left:22px;padding-right:22px}table{min-width:610px}}</style>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.description,image:`${site}/kim-gitae-photo.jpg`,author:{'@type':'Person',name:'김기태',jobTitle:'변호사',worksFor:{'@type':'LegalService',name:'법무법인 태앤규'}},publisher:{'@type':'LegalService',name:'법무법인 태앤규',url:site},datePublished:published,dateModified:published,mainEntityOfPage:`${site}/blog/${article.slug}`,inLanguage:'ko-KR'})}</script>
</head><body><header class="top"><div class="wrap"><div class="brand">법무법인 태앤규</div><a href="/blog/">개인회생 칼럼</a></div></header>
<main class="page"><div class="wrap"><div class="crumb"><a href="/">홈</a> · <a href="/blog/">개인회생 칼럼</a></div><article class="article"><header class="head"><span class="badge">전주 개인회생 안내</span><h1>${esc(article.title)}</h1><div class="summary">${article.summary}</div><div class="byline">작성·검토 김기태 변호사 · 최종 검토 ${published}</div></header><div class="body">
${article.sections.map(([heading, body]) => `<section><h2>${heading}</h2>${body}</section>`).join('\n')}
<div class="sources"><b>공식 자료 확인</b><p><a href="https://www.law.go.kr/법령/채무자회생및파산에관한법률" target="_blank" rel="noopener">국가법령정보센터 · 채무자 회생 및 파산에 관한 법률</a> · <a href="https://jeonju.scourt.go.kr" target="_blank" rel="noopener">전주지방법원</a></p><p>이 글은 일반적인 절차 안내이며, 개별 사건의 결과를 보장하지 않습니다. 법령·법원 실무와 제출자료에 따라 판단이 달라질 수 있습니다.</p></div>
<div class="cta"><b>현재 상황에 맞는 준비 순서를 확인하세요.</b><br>채무목록, 소득, 재산, 최근 대출과 압류 여부를 함께 검토합니다.<br><a href="tel:0507-1336-5516">0507-1336-5516 상담</a></div>
</div></article></div></main><footer class="foot"><div class="wrap">© 법무법인 태앤규 · 전북 전주시 완산구 홍산남로 19 즐거운빌딩 3층 302호</div></footer></body></html>`;

mkdirSync('cloudflare_pages_upload/blog', { recursive: true });
for (const article of articles) {
  writeFileSync(`cloudflare_pages_upload/blog/${article.slug}.html`, render(article), 'utf8');
  console.log(`Built ${article.slug}`);
}
