/**
 * 최종 결정 세액을 계산합니다.
 *
 * @param {Object} params - 함수 파라미터 객체
 * @param {number} params.산출세액 - 계산된 산출 세액
 * @param {number} params.공제세액 - 적용할 세액 공제
 * @returns {number} 최종으로 납부할 세액
 */
export default function 결정세액({
  산출세액,
  공제세액,
}: {
  산출세액: number;
  공제세액: number;
}) {
  return 산출세액 - 공제세액;
}
