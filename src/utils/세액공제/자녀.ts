export default function 자녀세액공제(자녀수: number): number {
  if (자녀수 <= 0) return 0;

  if (자녀수 === 1) return 250_000;
  if (자녀수 === 2) return 550_000;

  return 550_000 + (자녀수 - 2) * 400_000;
}
