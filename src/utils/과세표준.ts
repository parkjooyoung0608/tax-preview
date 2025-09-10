export default function 과세표준({
  총급여,
  소득공제,
}: {
  총급여: number;
  소득공제: number;
}) {
  return 총급여 - 소득공제;
}
