/**
 * 지정기부금 세액공제 계산
 * @param 금액 - 기부한 금액
 * @returns 세액공제 금액
 * [2025년 기준]
 * - 사회복지법인, 공익법인 등: 15% 공제
 */
export default function 지정기부금세액공제(금액: number): number {
  if (!금액 || 금액 <= 0) return 0;
  return 금액 * 0.15;
}
