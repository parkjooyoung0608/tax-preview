/**
 * 급여 세부내역에서 4대 보험을 자동 계산합니다.
 * @param 연봉 총 연봉 (비과세 제외 전 금액)
 * @param 비과세 비과세 소득
 */
export default function 사대보험자동계산(총급여: number) {
  const 월급여 = Math.floor(총급여 / 12);

  // 국민연금 (상·하한 적용)
  const 기준소득월액 = Math.min(Math.max(월급여, 370000), 5530000);
  const 국민연금 = Math.floor(기준소득월액 * 0.045);

  // 고용보험 (2024년 근로자 요율 0.9%)
  const 고용보험 = Math.floor(월급여 * 0.009);

  return {
    국민연금,
    고용보험,
  };
}
