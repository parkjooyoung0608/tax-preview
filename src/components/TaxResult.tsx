import Category from "@components/text/Category";
import Result from "@components/text/Result";
import { ITaxResultProps } from "@interface";
import formatKoreanCurrency from "@utils/formatKoreanCurrency";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * 연말정산 최종 결과를 표시하는 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.amount - 연말 정산 결과(차감징수액) 금액 (음수=환급, 양수=납부)

 */
export default function TaxResult({
  차감징수액,
  최종결정세액,
  최종기납부세액,
}: ITaxResultProps) {
  const isRefund = 차감징수액 < 0;
  const absAmount = formatKoreanCurrency(Math.abs(차감징수액));

  const [open, setOpen] = useState(false);

  return (
    <section className="grid md:grid-cols-1 gap-6">
      <div className="bg-white w-full py-4 rounded-2xl border border-gray-300 dark:border-gray-700 text-center content-center">
        <Category
          title="차감징수액"
          tooltipContent="내가 내야 할 세금에서 이미 낸 세금을 뺀 금액이에요. 결과가 +면 더 내야 하고, -면 돌려받아요."
          center
        />
        {isRefund ? (
          <Result
            amount={absAmount}
            message="돌려받을 수 있어요🥳"
            color="text-brand-blue"
          />
        ) : (
          <Result
            amount={absAmount}
            message="추가
            납부해야해요😭"
            color="text-brand-red"
          />
        )}

        {/* 토글 버튼 */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col items-center justify-center w-full mt-3 text-sm text-gray-600 hover:text-gray-800 transition"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
          <span className="mr-1">상세 내역</span>
        </button>

        {/* 토글 콘텐츠 (애니메이션) */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            open ? "max-h-[500px] opacity-100 " : "max-h-0 opacity-0 "
          }`}
        >
          <div className="flex justify-center items-center flex-col">
            <div className="flex justify-center items-center flex-col w-full md:w-[50%] p-3 gap-3">
              <div className="w-full flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-left">결정세액</p>
                  <p className="text-[12px]  text-left text-gray-400">
                    내가 내야할 세금
                  </p>
                </div>
                <div>
                  <p className="text-right">
                    {formatKoreanCurrency(최종결정세액)}원
                  </p>
                  {최종결정세액 === 0 && (
                    <p className="text-[12px] text-red-500">
                      ※ 최대 환급액에 도달했어요!🥳
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-left">기납부세액</p>
                  <p className="text-[12px] text-left text-gray-400">
                    이미 낸 세금
                  </p>
                </div>
                <p className="text-right">{최종기납부세액}원</p>
              </div>

              <hr className="w-full" />

              <div className="w-full flex items-center justify-between">
                <div>
                  <b className="text-[18px] text-left">차감징수액</b>
                  <p className="text-[12px] text-left text-gray-400">
                    최종 결정된 세금
                  </p>
                </div>
                <b className="text-[18px]">
                  {formatKoreanCurrency(
                    최종결정세액 -
                      Number(String(최종기납부세액).replace(/,/g, ""))
                  )}
                  원
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
