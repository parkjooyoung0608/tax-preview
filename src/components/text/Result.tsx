import { IResultProps } from "@interface";

export default function Result({
  amount,
  message,
  color = "text-brand-blue",
}: IResultProps) {
  return (
    <p className="text-[20px] font-bold">
      <span className={color}>{amount}</span>원 {message}
    </p>
  );
}
