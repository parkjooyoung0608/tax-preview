import Title from "@components/computedDeduction/Title";
import RefLink from "@components/ui/RefLink";
import formatKoreanCurrency from "@utils/formatKoreanCurrency";
import { IComputedDeductionDisplay } from "@interface";

export default function ComputedDeductionDisplay({
  title,
  공제금액,
  공제한도,
  url,
  tooltipContent,
}: IComputedDeductionDisplay) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <Title
          title={title}
          tooltipContent={tooltipContent}
          tooltipPosition="left"
        />
        {url && <RefLink url={url} />}
      </div>
      <div className="text-right">
        <span className="font-bold text-blue-600">
          {formatKoreanCurrency(공제금액)}원
        </span>
        {공제한도 && (
          <div className="mt-1 text-xs text-gray-600">
            최대 공제 한도 {formatKoreanCurrency(공제한도)}원
          </div>
        )}
      </div>
    </div>
  );
}
