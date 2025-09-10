export default function formatNumberWithComma(value: string) {
  if (!value || value === "-") return value;
  const [integer, decimal] = value.split(".");
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal !== undefined ? `${formatted}.${decimal}` : formatted;
}
