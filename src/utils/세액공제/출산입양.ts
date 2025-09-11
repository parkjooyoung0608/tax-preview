export default function 출산입양세액공제(자녀수: number) {
  let 금액 = 0;

  if (자녀수 === 1) {
    금액 = 300_000;
  } else if (자녀수 === 2) {
    금액 = 500_000;
  } else if (자녀수 >= 3) {
    금액 = 700_000;
  }

  return 금액;
}
