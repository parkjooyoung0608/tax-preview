import { useState, useEffect } from "react";
import formatNumberWithComma from "@utils/formatNumberWithComma";
import { IInputNumberProps } from "@interface";

export default function InputNumber({
  label,
  value,
  placeholder,
  onChange,
  hint,
}: IInputNumberProps) {
  const [inputValue, setInputValue] = useState<string>(value?.toString() || "");

  // 부모 value 변경 시 내부 상태 동기화
  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 포맷팅 제거
    const raw = e.target.value.replace(/,/g, "");

    // 빈값, - 허용, 숫자/소수점만 허용
    if (raw === "" || raw === "-" || /^-?\d*\.?\d*$/.test(raw)) {
      setInputValue(raw);

      // 부모 onChange에 전달
      if (raw === "" || raw === "-") {
        onChange(undefined);
      } else {
        onChange(Number(raw));
      }
    }
  };

  return (
    <label className="grid gap-1 text-sm mb-2">
      <span className="font-medium">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        className="px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-"
        value={formatNumberWithComma(inputValue)}
        onChange={handleChange}
      />
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
