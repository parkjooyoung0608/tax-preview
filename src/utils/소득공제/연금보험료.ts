/**
 * 연금보험료 공제 계산 함수
 *
 * 납부한 국민연금 보험료를 기준으로 연간 공제액을 계산합니다.
 * 월 납부액을 12개월로 곱하여 연간 공제 금액을 산출합니다.
 *
 * @param {Object} params - 함수 파라미터 객체
 * @param {number} params.월국민연금 - 월 국민연금 납부액
 * @returns {number} 연금보험료 공제액 (연간)
 *
 */
export default function 연금보험료공제({ 월국민연금 }: { 월국민연금: number }) {
  return 월국민연금 * 12;
}
