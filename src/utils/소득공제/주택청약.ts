/**
 * 주택청약 소득공제 계산 함수
 *
 * 총 급여 7,000만 원 이하인 무주택 세대주를 대상으로,
 * 주택청약종합저축 납입액의 40%를 소득공제하며,
 * 최대 공제 한도는 300만 원입니다.
 *
 * 참고: [국세청](https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40610&cntntsId=239022)
 *
 * @param {number} 납입액 - 주택청약종합저축 납입액
 * @returns {number} 주택청약 소득공제액
 *
 */
export default function 주택청약소득공제(납입액: number) {
  return Math.min(납입액 * 0.4, 3_000_000);
}
