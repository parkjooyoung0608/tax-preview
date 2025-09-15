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
    <div className="md:flex md:justify-between md:items-center">
      <div className="flex items-center gap-2">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>
          <Title
            title={label}
            tooltipContent={tooltipContent}
            tooltipPosition="right"
          />
        </label>
      </div>

      {checked && (
        <p className="font-bold text-blue-600 text-right">
          {formatKoreanCurrency(amount)}원
        </p>
      )}
    </div>
  );
}
