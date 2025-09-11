import Title from "@components/computedDeduction/Title";
import formatKoreanCurrency from "@utils/formatKoreanCurrency";
import { ICheckBoxProps } from "@interface";

export default function CheckBox({
  id,
  checked,
  label,
  tooltipContent,
  amount,
  onChange,
}: ICheckBoxProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>
          <Title title={label} tooltipContent={tooltipContent} />
        </label>
      </div>

      {checked && (
        <span className="font-bold text-blue-600">
          {formatKoreanCurrency(amount)}원
        </span>
      )}
    </div>
  );
}
