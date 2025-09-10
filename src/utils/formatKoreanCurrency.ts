export default function formatKoreanCurrency(n: number) {
  return `${n.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}`;
}
