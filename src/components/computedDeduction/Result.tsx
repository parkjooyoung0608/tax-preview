import TaxDeductionProgress from "@components/TaxProgress";
import Category from "@components/text/Category";
import Result from "@components/text/Result";
import formatKoreanCurrency from "@utils/formatKoreanCurrency";
import { IComputedDeductionResultProps } from "@interface";

export default function ComputedDeductionResult({
  title,
  tooltipContent,
  amount,
  message,
  limit,
}: IComputedDeductionResultProps) {
  return (
    <section>
      <Category title={title} tooltipContent={tooltipContent} />
      <Result amount={formatKoreanCurrency(amount)} message={message} />
      {limit && <TaxDeductionProgress 최대공제한도={limit} 공제금액={amount} />}
    </section>
  );
}
