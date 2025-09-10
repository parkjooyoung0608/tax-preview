import formatKoreanCurrency from "@utils/formatKoreanCurrency";

/**
 * 이미 납부한 소득세(기납부세액)를 계산합니다.
 *
 * 원천징수로 월급 받으면서 미리 납부한 세금입니다.
 * 1~12월 동안 납부한 소득세를 합산합니다.
 *
 * @param {Object} params - 함수 파라미터
 * @param {number | number[]} params.소득세 - 한 달 세금 또는 월별 세금 배열
 * @returns {number} 기납부세액(합산된 금액 혹은 연간 금액, 원 단위 포맷 적용)
 *
 * @example
 * // 월별 세금 배열인 경우
 * 기납부세액({ 소득세: [100000, 100000, 100000] }); // 300000
 *
 * @example
 * // 한 달 세금이 동일한 경우
 * 기납부세액({ 소득세: 100000 }); // "1,200,000"
 */
export default function 기납부세액({ 소득세 }: { 소득세: number | number[] }) {
  if (Array.isArray(소득세)) {
    // 월별로 다른 경우: 배열 합산
    let 총합 = 0;
    for (const 세금 of 소득세) {
      총합 += 세금; // 배열 안 값 그대로 합산
    }
    return 총합;
  } else {
    // 한 달 세금이 동일한 경우
    return formatKoreanCurrency(소득세 * 12);
  }
}
