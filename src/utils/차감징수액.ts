/**
 * 최종 결정 세액과 이미 납부한 세금을 비교하여 차감징수액을 계산합니다.
 *
 * @description
 * - 결과가 양수(+)이면 추가로 세금을 납부해야 합니다.
 * - 결과가 음수(-)이면 환급받을 수 있습니다.
 *
 * @param {Object} params
 * @param {number} params.결정세액 - 최종으로 결정된 세금 (내야 할 세금)
 * @param {number} params.기납부세액 - 이미 납부한 세금 (원천징수 등)
 * @returns {number} 차감징수액 - 납부할 금액 또는 환급받을 금액
 *
 */
export default function 차감징수액({
  결정세액,
  기납부세액,
}: {
  결정세액: number;
  기납부세액: number;
}) {
  return 결정세액 - 기납부세액;
}
